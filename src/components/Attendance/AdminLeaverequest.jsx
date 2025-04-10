import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from "@/services/supabaseClient";

const AdminLeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: userData, error: authError } = await supabase.auth.getUser();
        if (authError || !userData?.user) {
          setError("User not authenticated");
          return;
        }

        console.log("Logged in user:", userData.user.id);

        const { data: adminData, error: adminError } = await supabase
          .from("users")
          .select("role")
          .eq("auth_uid", userData.user.id)
          .single();

        if (adminError || !adminData || adminData.role !== "admin") {
          setError("Access denied: Not an admin");
          return;
        }

        const { data, error } = await supabase
          .from("leave_requests")
          .select("id, user_id, leave_type, start_date, end_date, reason, status, applied_at")
          .order("applied_at", { ascending: false });

        if (error) throw error;
        setLeaveRequests(data || []);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        setError(error.message || "Failed to load leave requests");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();

    const subscription = supabase
      .channel("leave_requests")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "leave_requests" },
        (payload) => {
          console.log("Realtime update:", payload);
          setLeaveRequests((prev) =>
            prev.map((req) =>
              req.id === payload.new.id ? { ...req, status: payload.new.status } : req
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const updateStatus = async (id, status) => {
    try {
      console.log(`Updating request ${id} to ${status}...`);
      const { data, error } = await supabase
        .from("leave_requests")
        .update({ status })
        .eq("id", id)
        .select();

      if (error) throw error;
      console.log("Updated request:", data);
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update leave request status");
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-center">Admin Leave Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : loading ? (
          <p className="text-center">Loading leave requests...</p>
        ) : leaveRequests.length === 0 ? (
          <p className="text-center">No leave requests found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">User ID</th>
                <th className="border p-2">Leave Type</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">End Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.id} className="border">
                  <td className="border p-2">{request.user_id}</td>
                  <td className="border p-2">{request.leave_type}</td>
                  <td className="border p-2">{request.start_date}</td>
                  <td className="border p-2">{request.end_date}</td>
                  <td className={`border p-2 font-bold text-${request.status === 'approved' ? 'green-600' : request.status === 'rejected' ? 'red-600' : 'gray-600'}`}>
                    {request.status}
                  </td>
                  <td className="border p-2 space-x-2">
                    {request.status === "pending" && (
                      <>
                        <Button className="bg-green-500 text-white" onClick={() => updateStatus(request.id, "approved")}>
                          Approve
                        </Button>
                        <Button className="bg-red-500 text-white" onClick={() => updateStatus(request.id, "rejected")}>
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminLeaveRequest;
