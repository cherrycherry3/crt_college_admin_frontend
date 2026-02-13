"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await apiRequest(
        "/api/college/dashboard",
        "GET"
      );

      // Save only what UI needs
      setStats(data.stats.college_info);
    } catch (error) {
      console.error("Dashboard API error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-4">Loading dashboard...</p>;
  }

  if (!stats) {
    return <p className="p-4 text-red-500">No dashboard data</p>;
  }

  return (
    <div className="p-2">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-1">
        College Dashboard
      </h1>
      <p className="text-gray-500 mb-8">
        Overview of college performance and statistics
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Students"
          value={stats.total_students}
        />

        <DashboardCard
          title="Total Branches"
          value={stats.total_branches}
        />

        <DashboardCard
          title="Total Courses"
          value={stats.total_courses}
        />

        <DashboardCard
          title="Established Year"
          value={stats.established_year}
        />
      </div>
    </div>
  );
}

/* 🔹 Reusable Card Component */
function DashboardCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm mb-2">
          {title}
        </p>
        <p className="text-3xl font-bold">
          {value}
        </p>
      </div>
    </div>
  );
}
