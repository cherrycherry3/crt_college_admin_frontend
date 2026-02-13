"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/app/api"; // adjust path if needed

export default function Students() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [year, setYear] = useState("All");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ----------------------------- Fetch Students ------------------------------ */
  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await apiRequest("/api/college/students/progress");

        const mappedData = (data || []).map((s) => ({
          rank: s.rank,
          name: s.name,
          email: s.email,
          department: s.department,
          year: `${s.year}th Year`,
          avgScore: s.avg_score,
          progress: s.progress,
        }));

        setStudents(mappedData);
      } catch (err) {
        setError(err?.detail || "Failed to load students");
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  /* ----------------------------- Filters ------------------------------ */
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const matchDept = department === "All" || s.department === department;
    const matchYear = year === "All" || s.year === year;

    return matchSearch && matchDept && matchYear;
  });

  /* ----------------------------- UI States ------------------------------ */
  if (loading) {
    return <p className="text-gray-500">Loading students...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Students</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[260px]">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
          />
        </div>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3"
        >
          <option value="All">All Departments</option>
          {[...new Set(students.map((s) => s.department))].map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3"
        >
          <option value="All">All Years</option>
          {[...new Set(students.map((s) => s.year))].map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-gray-500 text-sm">
        Showing {filteredStudents.length} of {students.length} students
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-3">Rank</th>
              <th>Name</th>
              <th>Department</th>
              <th>Year</th>
              <th>Avg Score</th>
              <th>Progress</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s, index) => (
              <tr
                key={s.rank}
                className={`border-b ${
                  index % 2 === 1 ? "bg-gray-50" : ""
                }`}
              >
                <td className="py-5 font-semibold">#{s.rank}</td>

                <td>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-gray-500">{s.email}</p>
                </td>

                <td>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {s.department}
                  </span>
                </td>

                <td>{s.year}</td>

                <td className="font-semibold">{s.avgScore}%</td>

                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                        style={{ width: `${s.progress}%` }}
                      />
                    </div>
                    <span className="font-medium">{s.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
