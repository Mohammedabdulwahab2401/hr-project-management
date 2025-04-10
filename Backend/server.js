const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const moment = require("moment");
const { createClient } = require("@supabase/supabase-js");
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");
const archiver = require("archiver");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Supabase client setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Meetings data (local file store)
const MEETINGS_FILE = path.join(__dirname, "meetings.json");

function loadMeetings() {
  try {
    const data = fs.readFileSync(MEETINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveMeetings(meetings) {
  fs.writeFileSync(MEETINGS_FILE, JSON.stringify(meetings, null, 2));
}

let meetings = loadMeetings();

// ✅ Google Calendar setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// ✅ Validate meeting input
function validateMeetingData(req, res, next) {
  const { title, date, time, attendees } = req.body;
  if (!title || !date || !time || !attendees || !Array.isArray(attendees)) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }
  next();
}

// ✅ Routes

app.get("/", (req, res) => {
  res.send("🚀 HRM Management Backend is running!");
});

// === Google Meet Scheduling ===
app.post("/api/google-meeting", validateMeetingData, async (req, res) => {
  try {
    const { title, date, time, attendees } = req.body;
    const startDateTime = moment(`${date}T${time}`).toISOString();
    const endDateTime = moment(startDateTime).add(1, "hour").toISOString();

    const event = {
      summary: title,
      start: { dateTime: startDateTime, timeZone: "UTC" },
      end: { dateTime: endDateTime, timeZone: "UTC" },
      attendees: attendees.map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(2),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetingUrl = response.data.conferenceData.entryPoints[0].uri;
    const newMeeting = { ...req.body, platform: "google", meetingUrl };
    meetings.push(newMeeting);
    saveMeetings(meetings);

    res.json({ meetingUrl, success: true });
  } catch (error) {
    console.error("Google Meet Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to schedule Google Meet", details: error.message });
  }
});

// === Zoom (Fake URL) ===
app.post("/api/zoom-meeting", validateMeetingData, async (req, res) => {
  try {
    const meetingUrl = `https://zoom.us/fake-${Math.random().toString(36).substring(2, 7)}`;
    const newMeeting = { ...req.body, platform: "zoom", meetingUrl };
    meetings.push(newMeeting);
    saveMeetings(meetings);

    res.json({ meetingUrl, success: true });
  } catch (error) {
    res.status(500).json({ error: "Zoom scheduling failed", details: error.message });
  }
});

// === Get all meetings ===
app.get("/api/meetings", (req, res) => {
  res.json(meetings);
});

// === Chatbot Endpoint ===
app.post("/api/chatbot", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    if (query.toLowerCase().includes("attendance")) {
      const { data, error } = await supabase
        .from("attendance")
        .select("id, user_id, type, latitude, longitude, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error);
        return res.status(500).json({ error: "Error fetching attendance" });
      }

      return res.json({
        reply: `Found ${data.length} attendance records.`,
        records: data,
      });
    }

    if (query.toLowerCase().includes("task")) {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, user_id, title, status, due_date, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error);
        return res.status(500).json({ error: "Error fetching tasks" });
      }

      return res.json({
        reply: `Found ${data.length} tasks.`,
        records: data,
      });
    }

    res.json({ reply: "Sorry, I didn't understand. Try asking about 'attendance' or 'tasks'." });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// === Export attendance + tasks in zip ===
app.get("/api/export", async (req, res) => {
  try {
    const [attendanceRes, tasksRes] = await Promise.all([
      supabase.from("attendance").select("*"),
      supabase.from("tasks").select("*"),
    ]);

    const archive = archiver("zip", { zlib: { level: 9 } });
    res.attachment("export.zip");
    archive.pipe(res);

    const attendanceCSV = new Parser().parse(attendanceRes.data);
    const tasksCSV = new Parser().parse(tasksRes.data);
    archive.append(attendanceCSV, { name: "attendance.csv" });
    archive.append(tasksCSV, { name: "tasks.csv" });

    const workbook = new ExcelJS.Workbook();
    const attendanceSheet = workbook.addWorksheet("Attendance");
    const taskSheet = workbook.addWorksheet("Tasks");

    attendanceSheet.columns = Object.keys(attendanceRes.data[0] || {}).map(key => ({ header: key, key }));
    taskSheet.columns = Object.keys(tasksRes.data[0] || {}).map(key => ({ header: key, key }));

    attendanceRes.data.forEach(row => attendanceSheet.addRow(row));
    tasksRes.data.forEach(row => taskSheet.addRow(row));

    const excelBuffer = await workbook.xlsx.writeBuffer();
    archive.append(excelBuffer, { name: "data.xlsx" });

    await archive.finalize();
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: "Failed to export data" });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
