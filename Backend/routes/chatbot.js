const express = require("express");
const router = express.Router();
const supabase = require("./db");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Parser } = require("json2csv");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Chatbot route
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const today = new Date().toISOString().split("T")[0];

    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance")
      .select("name, check_in_time")
      .eq("date", today);

    const { data: taskData, error: taskError } = await supabase
      .from("tasks")
      .select("assigned_to, status, task_title");

    if (attendanceError || taskError) {
      console.error("Supabase Errors:", attendanceError || taskError);
      return res.status(500).json({ error: "Error fetching from Supabase" });
    }

    const context = `Attendance Today: ${attendanceData.map(d => `${d.name}: ${d.check_in_time || 'not checked in'}`).join(', ')} | Tasks: ${taskData.map(t => `${t.assigned_to} - ${t.task_title} (${t.status})`).join(', ')}`;

    const prompt = `You are an assistant for a Project Management Dashboard. Based on this data: ${context}. User asked: "${message}". Respond with a helpful summary.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    if (!result || !result.response) throw new Error("Gemini did not return a response");
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.message);
    res.status(500).json({ error: "Failed to respond", details: err.message });
  }
});

// Export attendance to CSV
router.get("/export", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select("id, user_id, status, latitude, longitude, timestamp");

    if (error) {
      console.error("Supabase fetch error:", error);
      return res.status(500).json({ error: "Failed to fetch attendance data" });
    }

    const fields = ["id", "user_id", "status", "latitude", "longitude", "timestamp"];
    const opts = { fields, delimiter: "," };
    const parser = new Parser(opts);
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("attendance_export.csv");
    res.send(csv);
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: "Failed to export data", details: err.message });
  }
});

module.exports = router;
