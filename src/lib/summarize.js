import axios from "axios";
import supabase from "../services/supabaseClient";

const geminiApiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;

// Real-time notification channel
const notificationChannel = supabase.channel('notifications');

// Utility functions
const getStartOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
};

const checkFollowUp = (response) => {
  return response.includes('?') || response.toLowerCase().includes('need more');
};

// Initialize chatbot
export async function initAIChatbot() {
  supabase
    .channel('attendance-tasks-updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: ['attendance', 'tasks']
    }, handleRealTimeUpdate)
    .subscribe();

  return {
    processMessage: handleUserMessage,
    sendNotification: sendUserNotification
  };
}

// Core message handler
async function handleUserMessage(userId, message, role = 'user') {
  try {
    const { attendance, tasks } = await getContextData(userId, role);
    const response = await generateAIResponse(message, attendance, tasks, role);
    const notificationTargets = detectNotificationRequirements(response, role);
    
    if (notificationTargets.length > 0) {
      await sendNotificationToTargets(notificationTargets, response);
    }

    return { response, metadata: { needsFollowUp: checkFollowUp(response) } };
  } catch (error) {
    console.error('Chatbot error:', error);
    return { error: "Sorry, I'm having trouble processing your request. Please try again later." };
  }
}

// Context data fetcher
async function getContextData(userId, role) {
  const today = getStartOfToday();
  let attendance = [];
  let tasks = [];

  if (role === 'admin') {
    ({ data: attendance } = await supabase
      .from('attendance')
      .select('*, profiles(email)')
      .gte('created_at', today));

    ({ data: tasks } = await supabase
      .from('tasks')
      .select('*, profiles(email), assignees:task_assignees(user_id)'));
  } else {
    ({ data: attendance } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', today));

    ({ data: tasks } = await supabase
      .from('tasks')
      .select('*, assignees:task_assignees(user_id)')
      .contains('assignees', [{ user_id: userId }]));
  }

  return { attendance, tasks };
}

// AI response generator
async function generateAIResponse(message, attendance, tasks, role) {
  const prompt = buildChatPrompt(attendance, tasks, message, role);
  
  const { data } = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
    {
      contents: [{
        parts: [{ text: prompt }],
        role: "user"
      }]
    }
  );

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try again.";
}

// Notification handler
async function handleRealTimeUpdate(payload) {
  const { eventType, table, record } = payload;
  
  if (table === 'attendance') {
    const message = await generateNotificationMessage('attendance', record, eventType);
    await sendRelevantNotifications('attendance', message, record.user_id);
  }

  if (table === 'tasks') {
    const message = await generateNotificationMessage('task', record, eventType);
    await sendTaskNotifications(record.id, message);
  }
}

// Notification message generator
async function generateNotificationMessage(type, data, eventType) {
  const prompt = `Generate a concise notification about ${type} ${eventType}:\n${JSON.stringify(data)}`;
  
  const { data: response } = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
    {
      contents: [{
        parts: [{ text: prompt }],
        role: "user"
      }]
    }
  );

  return response?.candidates?.[0]?.content?.parts?.[0]?.text || "System update occurred.";
}

// Send notifications
async function sendUserNotification(userId, message) {
  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      message,
      type: 'chatbot',
      metadata: { systemGenerated: true }
    });
}

async function sendRelevantNotifications(type, message, userId) {
  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      message: `${type} update: ${message}`,
      type: 'system'
    });
}

async function sendTaskNotifications(taskId, message) {
  const { data: assignees } = await supabase
    .from('task_assignees')
    .select('user_id')
    .eq('task_id', taskId);

  for (const { user_id } of assignees) {
    await sendUserNotification(user_id, message);
  }
}

// Prompt builder
function buildChatPrompt(attendance, tasks, message, isAdmin) {
  return `
    You are a helpful workplace assistant. Provide detailed but concise responses.
    Current context:
    - Today's attendance records: ${JSON.stringify(attendance)}
    - Task information: ${JSON.stringify(tasks)}
    
    User message: "${message}"
    
    ${isAdmin ? 'Include detailed analytics and patterns.' : 'Focus on personal summary and tasks.'}
    Format response with clear sections and emojis when appropriate.
  `;
}

function detectNotificationRequirements(response, role) {
  const keywords = role === 'admin' 
    ? ['alert', 'urgent', 'missing', 'delay']
    : ['reminder', 'deadline', 'pending'];
  
  return keywords.some(kw => response.toLowerCase().includes(kw)) 
    ? ['relevant_users']
    : [];
}

// Legacy export for backward compatibility
export const getSummary = async (message, role = "user", userId = "test-user-id") => {
  const chatbot = await initAIChatbot();
  const result = await chatbot.processMessage(userId, message, role);
  return result.response;
};

// New chatbot API exports
export const chatbotAPI = {
  initAIChatbot,
  sendUserNotification
};