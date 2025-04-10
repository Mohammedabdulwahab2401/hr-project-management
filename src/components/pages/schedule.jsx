import React, { useState, useEffect } from "react";
import { Video } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export function MeetingScheduler() {
  const [meetings, setMeetings] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "09:00",
    platform: "google",
    attendees: "",
  });
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  async function fetchMeetings() {
    try {
      const res = await fetch("http://localhost:5000/api/meetings");
      const data = await res.json();
      setMeetings(data || []);
    } catch (err) {
      toast.error("Failed to load meetings");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isScheduling) return;

    const attendeesList = newMeeting.attendees
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (
      !newMeeting.title ||
      !newMeeting.date ||
      !newMeeting.time ||
      attendeesList.length === 0
    ) {
      toast.error("All fields are required");
      return;
    }

    if (attendeesList.some(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      toast.error("Invalid email format");
      return;
    }

    setIsScheduling(true);
    try {
      const endpoint =
        newMeeting.platform === "google"
          ? "/api/google-meeting"
          : "/api/zoom-meeting";

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMeeting,
          attendees: attendeesList,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scheduling failed");

      toast.success("Meeting scheduled!");
      setNewMeeting({
        title: "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "09:00",
        platform: "google",
        attendees: "",
      });
      fetchMeetings();
    } catch (err) {
      toast.error(err.message || "Error occurred");
    } finally {
      setIsScheduling(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Video className="w-6 h-6" />
          Schedule New Meeting
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Meeting Title"
            value={newMeeting.title}
            onChange={(e) =>
              setNewMeeting((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="date"
            value={newMeeting.date}
            onChange={(e) =>
              setNewMeeting((prev) => ({ ...prev, date: e.target.value }))
            }
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="time"
            value={newMeeting.time}
            onChange={(e) =>
              setNewMeeting((prev) => ({ ...prev, time: e.target.value }))
            }
            className="w-full p-2 border rounded"
            required
          />

          <select
            value={newMeeting.platform}
            onChange={(e) =>
              setNewMeeting((prev) => ({ ...prev, platform: e.target.value }))
            }
            className="w-full p-2 border rounded"
          >
            <option value="google">Google Meet</option>
            <option value="zoom">Zoom</option>
          </select>

          <input
            type="text"
            placeholder="Attendee emails (comma-separated)"
            value={newMeeting.attendees}
            onChange={(e) =>
              setNewMeeting((prev) => ({ ...prev, attendees: e.target.value }))
            }
            className="w-full p-2 border rounded"
            required
          />

          <button
            type="submit"
            disabled={isScheduling}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isScheduling ? "Scheduling..." : "Schedule Meeting"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MeetingScheduler;
