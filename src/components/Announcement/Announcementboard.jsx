import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/services/supabaseClient";

const defaultAnnouncements = [
  { id: 1, title: "April Holidays", message: "April has some holidays, including Good Friday and Easter Monday!", created_at: new Date().toISOString() },
  { id: 2, title: "Tamil New Year", message: "April 14 is Tamil New Year, a time for celebrations!", created_at: new Date().toISOString() },
  { id: 3, title: "Office Maintenance", message: "Scheduled maintenance will take place on April 15th. Expect some downtime.", created_at: new Date().toISOString() },
  { id: 4, title: "May 1st Holiday", message: "May 1st is a declared holiday for International Workers' Day.", created_at: new Date().toISOString() }
];

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState(defaultAnnouncements);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase.from("announcements").select("id, title, message, created_at").order("created_at", { ascending: false });
      if (error) console.error("Error fetching announcements:", error);
      else setAnnouncements([...defaultAnnouncements, ...(data || [])]);
    };
    fetchAnnouncements();
  }, []);

  const postAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("announcements").insert([{ title, message }]);
      if (error) throw error;
      alert("Announcement posted successfully");
      setAnnouncements([{ title, message, created_at: new Date().toISOString() }, ...announcements]);
      setTitle("");
      setMessage("");
    } catch (error) {
      console.error("Error posting announcement:", error);
      alert("Failed to post announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg rounded-2xl border border-gray-300">
      <CardHeader className="bg-blue-500 text-white p-4 rounded-t-2xl">
        <CardTitle className="text-xl font-bold text-center">Announcement Board</CardTitle>
      </CardHeader>
      <CardContent>

        <div className="mt-6 space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-600">{announcement.title}</h3>
              <p className="text-gray-700">{announcement.message}</p>
              <span className="text-sm text-gray-500">{new Date(announcement.created_at).toLocaleString()}</span>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementBoard;
