# 🧠 Open-Source HR & Project Management Tool

📅 **Prototype 

---

## 🚀 System Setup & Usage Guide

### ⚛️ Frontend Setup (React.js / Vite)

```bash
npx create-react-app hrm-tool
cd hrm-tool
npm install @supabase/supabase-js @supabase/auth-ui-react react-router-dom
'''Backend Setup (Node.js + Express)
bash
Copy
Edit
npm init -y
npm install express cors dotenv supabase-js googleapis

🧪 API Documentation
Base URL: /api

🔐 Auth
POST /auth/login
Body: { email: string }
Returns: Supabase login URL or token

👤 Attendance
POST /attendance/check-in
POST /attendance/check-out
GET /attendance/:user_id

📝 Tasks
POST /tasks
GET /tasks/:user_id
PUT /tasks/:task_id

📆 Calendar Integration
POST /calendar/sync

Adds a task to Google Calendar

🤖 AI Summary
POST /summary

Input: user_id, date range
Output: AI-generated summary of attendance & tasks

📅 Meetings
POST /meetings
Body: participants, date, time

👥 User Guide
👑 Admin Features
Monitor Attendance
Assign & Track Tasks
Approve Leave Requests
View AI Summary Reports

🧑‍💼 Employee Features
Check-in/out via GPS
Task Dashboard
Submit Leave Requests
View Announcements

🤖 AI Chatbot Assistant (Gemini)
Generate summaries using Google Gemini AI
Integrated with attendance and task data


