"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/app/api"; // adjust path if needed

export default function Leaderboards() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -----------------------------
     Fetch Leaderboard Data
  ------------------------------*/
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await apiRequest(
          "/api/college/students/progress"
        );

        // Map API response → UI structure
        const mappedData = data.map((s) => ({
          id: s.student_id,
          name: s.name,
          dept: s.department,
          score: s.avg_score,       // ✅ mapped
          completion: s.progress,   // ✅ mapped
          rank: s.rank,
        }));

        setStudents(mappedData);
      } catch (err) {
        setError(err?.detail || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  /* -----------------------------
     Filter Logic
  ------------------------------*/
  const filteredStudents =
    filter === "All"
      ? students
      : students.filter((s) => s.dept === filter);

  /* -----------------------------
     UI
  ------------------------------*/
  if (loading) {
    return <p className="text-gray-500">Loading leaderboard...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Student Leaderboard
        </h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white"
        >
          <option value="All">All Courses</option>
          {[...new Set(students.map((s) => s.dept))].map(
            (dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            )
          )}
        </select>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-blue-600 font-semibold">↗</span>
          <h3 className="text-lg font-semibold">
            Overall Rankings
          </h3>
        </div>

        <div className="space-y-4">
          {filteredStudents.map((s) => (
            <div
              key={s.id}
              className={`flex items-center justify-between p-4 rounded-xl border
                ${
                  s.rank === 1
                    ? "bg-[#FFF7E6] border-yellow-200"
                    : s.rank === 3
                    ? "bg-[#FFF2E8] border-orange-200"
                    : "bg-[#F7F8FA] border-gray-200"
                }`}
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="w-6 text-gray-500">
                  {s.rank <= 3 ? "🏆" : s.rank}
                </div>

                <div>
                  <p className="font-semibold">
                    {s.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {s.dept}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">
                <div className="w-24">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#34D399]"
                      style={{
                        width: `${s.completion}%`,
                      }}
                    />
                  </div>
                </div>

                <span className="text-sm text-gray-500">
                  {s.completion}%
                </span>

                <span className="font-semibold">
                  {s.score}
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    pts
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
