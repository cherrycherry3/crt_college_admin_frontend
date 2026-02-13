"use client";
import { useState } from "react";

import Overview from "../tabsdata/overview";
import Leaderboards from "../tabsdata/leaderboard";
import CourseAssignment from "../tabsdata/courseassignments";
import Students from "../tabsdata/students";

export default function DepartmentProgressExact() {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    "Overview",
    "Leaderboards",
    "Course Assignment",
    "Students",
  ];

  return (
    <div className="bg-[#F7F8FA] p-6 rounded-xl">
      {/* Tabs */}
      <div className="inline-flex gap-2 bg-[#EEF0F3] p-1 rounded-full mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded-full transition ${
              activeTab === tab
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && <Overview />}
      {activeTab === "Leaderboards" && <Leaderboards />}
      {activeTab === "Course Assignment" && <CourseAssignment />}
      {activeTab === "Students" && <Students />}
    </div>
  );
}
