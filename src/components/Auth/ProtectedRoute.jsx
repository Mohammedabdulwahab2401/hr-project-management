import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../../services/supabaseClient";
import { getUserRole } from "../../services/getuserRole";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Error fetching user:", error);
        setLoading(false);
        return;
      }

      const userRole = await getUserRole(user.id);
      setRole(userRole);
      setLoading(false);
    };

    fetchRole();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!role || role !== requiredRole) return <Navigate to="/login" replace />;
  
  return children;
};

export default ProtectedRoute;
