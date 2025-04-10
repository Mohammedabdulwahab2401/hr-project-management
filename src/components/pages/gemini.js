// /pages/api/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import supabase from "@/services/supabaseClient";

const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { query, user_id } = req.body;

  try {
    let type = null;
    if (query.toLowerCase().includes("attendance")) {
      type = "attendance";
    } else if (query.toLowerCase().includes("task")) {
      type = "task";
    }

    if (!type) return res.status(400).json({ response: "I didn't understand your request." });

    let records = [];
    if (type === "attendance") {
      const { data } = await supabase
        .from("attendance")
        .select("date, status")
        .eq("user_id", user_id)
        .gte("date", new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0]);
      records = data || [];
    }

    if (type === "task") {
      const { data } = await supabase
        .from("tasks")
        .select("title, status, due_date")
        .eq("user_id", user_id)
        .neq("status", "done");
      records = data || [];
    }

    const prompt = `You are an HR assistant. Summarize this user's ${type} data:\n${JSON.stringify(records, null, 2)}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    res.status(200).json({ response });
  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).json({ response: "Something went wrong while generating the summary." });
  }
}

