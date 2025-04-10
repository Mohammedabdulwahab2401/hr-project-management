import React, { useEffect, useState } from "react";
import supabase from "../../services/supabaseClient";
import AttendanceButtons from "../Attendance/Attendancebutton";
import LeaveRequest from "../LeaveRequest";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AnnouncementBoard from "../Announcement/Announcementboard";


const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      let { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.data.user.id);

      if (!error) setTasks(data);
      setLoading(false);
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Employee Dashboard
        </h1>

        {/* Attendance Section */}
        <Card className="shadow-lg border border-gray-200 dark:border-gray-800 rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceButtons />
          </CardContent>
        </Card>

        {/* Leave Request Section */}
        <Card className="shadow-lg border border-gray-200 dark:border-gray-800 rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Leave Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LeaveRequest />
          </CardContent>
        </Card>

        {/* Announcement Board Section */}
        <Card className="shadow-lg border border-gray-200 dark:border-gray-800 rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnnouncementBoard />
          </CardContent>
        </Card>

        {/* Assigned Tasks */}
        <Card className="shadow-lg border border-gray-200 dark:border-gray-800 rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Assigned Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ) : tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <Card key={task.id} className="p-4 shadow-md rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.due_date).toLocaleString()}
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No tasks assigned yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
