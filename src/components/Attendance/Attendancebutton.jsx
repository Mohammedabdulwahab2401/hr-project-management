import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import supabase from "../../services/supabaseClient";

const AttendanceButtons = () => {
  const [workHours, setWorkHours] = useState(null);

  const handleAttendance = async (type) => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    const user = await supabase.auth.getUser();
    if (!user.data?.user?.id) {
      alert("User not found");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      if (type === "checkout") {
        const { data: lastCheckin, error: fetchError } = await supabase
          .from("attendance")
          .select("created_at")
          .eq("user_id", user.data.user.id)
          .eq("type", "checkin")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (fetchError || !lastCheckin) {
          alert("No check-in record found");
          return;
        }

        const checkinTime = new Date(lastCheckin.created_at);
        const checkoutTime = new Date();
        const diffMs = checkoutTime - checkinTime;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        const formattedTime =
          hours > 0
            ? `${hours.toFixed(2)} hr${hours > 1 ? "s" : ""}`
            : `${minutes.toFixed(2)} min${minutes > 1 ? "s" : ""}`;

        setWorkHours(formattedTime);
      }

      const { error } = await supabase.from("attendance").insert([
        {
          user_id: user.data.user.id,
          type,
          latitude,
          longitude,
        },
      ]);

      if (error) alert(error.message);
      else alert(`${type} recorded! ${type === "checkout" ? `You worked ${workHours}.` : ""}`);
    });
  };

  return (
    <div className="flex gap-2 mb-6">
      <Button
        onClick={() => handleAttendance("checkin")}
        className="bg-green-500 text-white px-3 py-1 text-sm"
      >
        ✅ Check In
      </Button>
      <Button
        onClick={() => handleAttendance("checkout")}
        className="bg-yellow-500 text-white px-3 py-1 text-sm"
      >
        🕒 Check Out
      </Button>
      {workHours && (
        <p className="text-gray-700 text-sm ml-2 mt-1">Worked: {workHours}</p>
      )}
    </div>
  );
};

export default AttendanceButtons;
