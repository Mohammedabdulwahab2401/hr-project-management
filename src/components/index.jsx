import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Clock, Calendar, CheckCircle, Shield, User, RefreshCw, 
  Pencil, ClipboardCheck, XCircle 
} from "lucide-react";

const Index = () => {
  const features = [
    { icon: CheckCircle, title: "Attendance Tracking", description: "Track employee check-ins and check-outs with geolocation verification." },
    { icon: Calendar, title: "Task Management", description: "Assign, track, and update tasks with priority levels and due dates." },
    { icon: RefreshCw, title: "Google Calendar Sync", description: "Automatically sync tasks with Google Calendar for better organization." },
    { icon: Shield, title: "Role-Based Access", description: "Differentiate between admin and employee access for better security." },
    { icon: User, title: "Employee Profiles", description: "Maintain comprehensive employee profiles with work history." },
    { icon: Clock, title: "Work Hour Analysis", description: "Get insights on work hours and productivity with detailed reports." },

    // Leave Request System Features
    { icon: Pencil, title: "Apply for Leave", description: "Employees can submit leave requests with start & end dates and reasons." },
    { icon: ClipboardCheck, title: "Admin Approval", description: "Admins can review, approve, or reject leave requests." },
    { icon: XCircle, title: "Leave Status", description: "Check the status of your leave request anytime from the dashboard." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="relative z-10 px-6 py-4 bg-white shadow-md dark:bg-gray-800">
        <div className="container mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            <span className="text-blue-500">Pulse</span>Track
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium">
              Get Started
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Streamline Your Team's <br />
            <span className="text-blue-500">Work Management</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-xl">
            Track attendance, manage tasks, and boost productivity with our all-in-one employee management platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
            <Link to="/signup" className="px-6 py-3 bg-blue-500 text-white rounded-md text-lg font-medium hover:bg-blue-600">
              Get Started for Free
            </Link>
            <a href="#features" className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-lg rounded-md font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
              Explore Features
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 relative"
        >
          <img
            src="https://placehold.co/600x400/e2e8f0/475569?text=Dashboard+Preview"
            alt="PulseTrack Dashboard Preview"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Comprehensive Features</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            Everything you need to manage your team efficiently in one place.
          </p>
          <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition"
              >
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
