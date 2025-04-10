import React, { useState } from "react";
import { createGoogleCalendarEvent } from "@/services/googleCalendarService";
import supabase from "@/services/supabaseClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      setMessage("Authentication Error: Please log in to create tasks.");
      setMessageType("error");
      return;
    }

    const { error } = await supabase.from("tasks").insert([
      {
        user_id: user.data.user.id,
        title,
        description,
        due_date: dueDate,
      },
    ]);

    if (error) {
      setMessage(`Supabase Error: ${error.message}`);
      setMessageType("error");
      return;
    }

    try {
      const accessToken = import.meta.env.VITE_GOOGLE_ACCESS_TOKEN;
      if (!accessToken) throw new Error("Missing VITE_GOOGLE_ACCESS_TOKEN");

      const event = {
        summary: title,
        description,
        start: { dateTime: new Date(dueDate).toISOString() },
        end: {
          dateTime: new Date(
            new Date(dueDate).getTime() + 60 * 60 * 1000
          ).toISOString(),
        },
        attendees: [{ email: user.data.user.email }],
      };

      const response = await createGoogleCalendarEvent(event, accessToken);

      if (response.success) {
        setMessage("✅ Task Created & Synced with Google Calendar.");
        setMessageType("success");
      } else {
        setMessage(`⚠️ Task saved but failed to sync: ${response.error}`);
        setMessageType("error");
      }
    } catch (error) {
      setMessage(`Google Calendar Error: ${error.message}`);
      setMessageType("error");
    }

    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <Card className="max-w-lg mx-auto shadow-lg p-6 bg-white dark:bg-gray-900 rounded-2xl">
      <CardContent>
        {message && (
          <div
            className={`p-2 mb-4 text-sm rounded ${
              messageType === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="due-date">Due Date</Label>
            <Input
              id="due-date"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Create Task & Sync
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
