import React from "react";
import Navigation from "./Navigation";
import { Card, CardContent } from "@/components/ui/card";

const DashboardLayout = ({ children, userRole }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Navigation userRole={userRole} />
      <div className="flex-grow flex items-center justify-center p-6">
        <Card className="w-full max-w-7xl shadow-lg rounded-xl bg-white dark:bg-gray-800">
          <CardContent className="p-6 sm:p-8">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardLayout;
