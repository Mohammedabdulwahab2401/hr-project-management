// components/Dashboard/AdminSummaryChat.jsx

import { useState } from "react";
import { getSummary } from "@/lib/summarize";

export default function AdminSummaryChat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const reply = await getSummary(input, "admin", "admin");
      setResponse(reply);
    } catch (err) {
      console.error("Error getting summary:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleAsk} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Ask Gemini e.g. 'Show me today's summary'"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-2">
          {error}
        </div>
      )}

      {response && (
        <div className="bg-gray-50 p-4 rounded border text-sm whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  );
}
