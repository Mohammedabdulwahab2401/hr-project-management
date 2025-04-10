import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import supabase from "./services/supabaseClient";
import { getUserRole } from "./services/getUserRole";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import TaskForm from "./components/Task/TaskFrom";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeDashboard"; // ✅ EmployeeDashboard remains
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import DashboardLayout from "./components/Layout/Dashboardlayout";
import Index from "./components/index";

const AuthChangeHandler = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const handleAuthChange = async (event, session) => {
      if (event === "SIGNED_IN") {
        const role = await getUserRole();
        setUserRole(role);
        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/employee-dashboard", { replace: true }); // ✅ Employee route
        }
      } else if (event === "SIGNED_OUT") {
        setUserRole(null);
        navigate("/", { replace: true });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return null;
};

const App = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole();
      setUserRole(role);
    };

    fetchUserRole();
  }, []);

  return (
    <Router>
      <AuthChangeHandler />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout userRole={userRole}>
                <TaskForm />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout userRole={userRole}>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard" // ✅ Employee Dashboard remains
          element={
            <ProtectedRoute requiredRole="employee">
              <DashboardLayout userRole={userRole}>
                <EmployeeDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
