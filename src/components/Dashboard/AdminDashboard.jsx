import React from "react";
import AdminAttendanceMonitor from "../Attendance/AdminAttendanceMonitor"; 
import AdminLeaveRequest from "../Attendance/AdminLeaverequest"; 
import TaskForm from "../Task/TaskFrom"; 
import ScheduleMeeting from "../pages/schedule";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ChatBox  from "../Ai/chatbot";


const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>

        {/* Admin Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attendance Monitor */}
          <Card className="shadow-lg border border-gray-200 dark:border-gray-800 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Attendance Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminAttendanceMonitor />
            </CardContent>
          </Card>

          {/* Leave Requests */}
          <Card className="shadow-lg border border-gray-200 dark:border-gray-800 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Leave Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminLeaveRequest />
            </CardContent>
          </Card>

          {/* Task Form */}
          <Card className="shadow-lg border border-gray-200 dark:border-gray-800 rounded-2xl md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Create a Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskForm />
            </CardContent>
          </Card>

          {/* Schedule Meeting */}
          <Card className="shadow-lg border border-gray-200 dark:border-gray-800 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Schedule a Meeting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleMeeting />
            </CardContent>
          </Card>
          
          
           {/* Chat Box for Admin */}
              <Card className="shadow-lg border border-gray-200 dark:border-gray-800 rounded-2xl md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    Chat with Gemini
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChatBox userId="admin" role="admin" />
                </CardContent>
              </Card>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
