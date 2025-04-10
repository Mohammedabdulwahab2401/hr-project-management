import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from "@/services/supabaseClient";

const LeaveRequest = () => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("User authentication error:", error);
        return;
      }
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("User not authenticated");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("leave_requests").insert([
        {
          user_id: user.id,
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          reason: reason,
          status: "pending",
        },
      ]);
      if (error) throw error;
      alert("Leave request submitted successfully");
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-center">Request Leave</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Leave Type</option>
            <option value="casual">Casual</option>
            <option value="sick">Sick</option>
            <option value="annual">Annual</option>
          </select>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full p-2 border rounded" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="w-full p-2 border rounded" />
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for leave" required className="w-full p-2 border rounded"></textarea>
          <Button type="submit" disabled={loading} className="w-full bg-blue-500 text-white">
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeaveRequest;
