import React, { useState } from 'react';
import ExportButton from './Exportbutton';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();

      const replyText = data.reply || data.response || 'No response from assistant.';
      const botMessage = { sender: 'bot', text: replyText };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Fetch failed:', error.message);
      const botMessage = { sender: 'bot', text: 'Error talking to assistant. Please try again later.' };
      setMessages((prev) => [...prev, botMessage]);
    }

    setInput('');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 border rounded-2xl shadow-lg flex flex-col h-[80vh] bg-white">
      <div className="p-4 font-semibold text-lg border-b bg-gray-100 rounded-t-2xl">💬 Chat Assistant</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] p-3 rounded-xl ${
              msg.sender === 'user'
                ? 'ml-auto bg-blue-500 text-white'
                : 'mr-auto bg-gray-200 text-gray-900'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about attendance or tasks..."
          className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Send
          
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
