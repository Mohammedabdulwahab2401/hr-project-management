import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import supabase from "../../services/supabaseClient";
import { getUserRole } from "../../services/getUserRole";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      setLoading(true);
      let error;
      if (isSignup) {
        ({ error } = await supabase.auth.signUp({ email, password }));
        toast.success("Signup successful! Check your email to confirm.");
      } else {
        ({ error } = await supabase.auth.signInWithPassword({ email, password }));
        if (!error) {
          const role = await getUserRole();
          navigate(role === "admin" ? "/admin" : "/tasks", { replace: true });
        }
      }
      if (error) throw error;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardTitle className="text-center">
              <span className="text-blue-500">Pulse</span>Track {isSignup ? "Signup" : "Login"}
            </CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button
            onClick={handleAuth}
            className="w-full bg-blue-500 text-white"
            disabled={loading}
          >
            {loading ? (isSignup ? "Signing up..." : "Logging in...") : isSignup ? "Sign Up" : "Login"}
          </Button>
          <Button
            onClick={handleGoogleAuth}
            className="w-full mt-4 bg-red-500 text-white"
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue with Google"}
          </Button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
