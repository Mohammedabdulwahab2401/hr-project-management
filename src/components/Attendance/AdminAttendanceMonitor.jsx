import React, { useEffect, useState } from 'react';
import supabase from "../../services/supabaseClient";
import { format } from 'date-fns';

const AdminAttendanceMonitor = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .gte("created_at", `${today}T00:00:00.000Z`)
        .lte("created_at", `${today}T23:59:59.999Z`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching attendance:', error);
        return;
      }

      // Group by user_id and split into check-in/check-out
      const userMap = {};
      data.forEach((entry) => {
        if (!userMap[entry.user_id]) {
          userMap[entry.user_id] = {
            user_id: entry.user_id,
            checkin: null,
            checkout: null,
            location: null,
          };
        }

        if (entry.type === "checkin" && !userMap[entry.user_id].checkin) {
          userMap[entry.user_id].checkin = format(new Date(entry.created_at), "HH:mm:ss");
          userMap[entry.user_id].location = `${entry.latitude.toFixed(4)}, ${entry.longitude.toFixed(4)}`;
        } else if (entry.type === "checkout") {
          userMap[entry.user_id].checkout = format(new Date(entry.created_at), "HH:mm:ss");
        }
      });

      setAttendanceData(Object.values(userMap));
    };

    fetchAttendance();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Admin Attendance Monitor</h2>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Employee ID</th>
            <th className="p-2 text-left">Check-In Time</th>
            <th className="p-2 text-left">Check-Out Time</th>
            <th className="p-2 text-left">Location</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center">No attendance records for today.</td>
            </tr>
          ) : (
            attendanceData.map((entry) => (
              <tr key={entry.user_id} className="border-t">
                <td className="p-2">{entry.user_id}</td>
                <td className="p-2">{entry.checkin || 'N/A'}</td>
                <td className="p-2">{entry.checkout || 'N/A'}</td>
                <td className="p-2">{entry.location || 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAttendanceMonitor;
