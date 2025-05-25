📌 Overview
An open-source solution designed to streamline HR and project management tasks, including attendance tracking, task assignment, calendar integration, and AI-generated summaries.

🚀 Features
Authentication: Secure login system using Supabase.
Attendance Management: Check-in/out functionality with GPS support.
Task Management: Create, assign, and track tasks.
Calendar Integration: Sync tasks with Google Calendar.
AI Summaries: Generate summaries of attendance and tasks using Google Gemini AI.
Meeting Scheduling: Organize meetings with participants, date, and time.
Admin Dashboard: Monitor attendance, approve leave requests, and view reports.
Employee Dashboard: Submit leave requests, view announcements, and manage tasks.

⚙️ Tech Stack
Frontend: React.js with Vite
Backend: Node.js with Express
Database: Supabase (PostgreSQL)
Authentication: Supabase Auth
AI Integration: Google Gemini AI
Calendar Integration: Google Calendar API

🛠️ Installation Guide
Frontend Setup
npx create-react-app hrm-tool
cd hrm-tool
npm install @supabase/supabase-js @supabase/auth-ui-react react-router-dom

Backend Setup
mkdir backend
cd backend
npm init -y
npm install express cors dotenv @supabase/supabase-js googleapis

👥 User Roles
Admin
Monitor Attendance
Assign & Track Tasks
Approve Leave Requests
View AI Summary Reports

Employee
Check-in/out via GPS
Task Dashboard
Submit Leave Requests
View Announcements

Integrated with Google Gemini AI to generate summaries using attendance and task data.
