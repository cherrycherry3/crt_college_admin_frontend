"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../api"; // adjust path if needed

export default function Overview() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const data = await apiRequest("/api/college/dashboard");

        // Extract branches and map to UI structure
        const mappedDepartments = data.stats.branches.map((branch) => ({
          name: branch.branch_name,
          students: branch.total_students,
          avg: Math.round(branch.average_crt_score), // for display
          progress: Math.round(branch.average_course_completion), // bar %
        }));

        setDepartments(mappedDepartments);
      } catch (error) {
        console.error("Failed to load overview data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <p className="text-gray-500">Loading department progress...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <h2 className="text-lg font-semibold mb-6">
        Department-wise Progress
      </h2>

      <div className="space-y-6">
        {departments.map((dept) => (
          <div key={dept.name}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-medium text-gray-900">
                  {dept.name}
                </p>

                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-[#F3F4F6] text-gray-700 px-3 py-1 rounded-full">
                    {dept.students} students
                  </span>
                  <span className="text-xs bg-[#F3F4F6] text-gray-700 px-3 py-1 rounded-full">
                    Avg: {dept.avg}%
                  </span>
                </div>
              </div>

              <p className="text-sm font-semibold text-gray-900">
                {dept.progress}%
              </p>
            </div>

            <div className="h-2 bg-[#ECEFF1] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#34D399]"
                style={{ width: `${dept.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
