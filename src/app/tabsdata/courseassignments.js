"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/api";

const DEPARTMENTS = ["CSE", "ECE", "MECH"];
const YEARS = [1, 2, 3, 4];

const BRANCH_MAP = {
  CSE: 1,
  ECE: 2,
  MECH: 11,
};

export default function CourseAssignment() {
  const [selectedDept, setSelectedDept] = useState("CSE");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);

  /* -------------------------------
     FETCH COURSES
  -------------------------------- */
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await apiRequest("/api/college/courses/courses", "GET");

        setCourses(
          res.courses.map((c) => ({
            id: c.course_id,
            title: c.title,
            description: c.description,
            tag: c.category,
            mandatory: false,
            years: [],
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  /* -------------------------------
     HANDLERS
  -------------------------------- */
  const toggleYear = (courseId, year) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              years: c.years.includes(year)
                ? c.years.filter((y) => y !== year)
                : [...c.years, year],
            }
          : c
      )
    );
  };

  const toggleMandatory = (courseId) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, mandatory: !c.mandatory } : c
      )
    );
  };

  /* -------------------------------
     POST COURSE (FIXED PAYLOAD)
  -------------------------------- */
  const assignCourse = async (course) => {
    if (course.years.length === 0) {
      alert("Please select at least one year");
      return;
    }

    setSubmittingId(course.id);

    try {
      // 🔁 Send ONE request per academic year
      for (const year of course.years) {
        await apiRequest("/api/college/courses/assign", "POST", {
          course_id: course.id,
          branch_id: BRANCH_MAP[selectedDept],
          academic_year_id: year,
        });
      }

      alert(`${course.title} assigned successfully ✅`);
    } catch (err) {
      console.error(err);
      alert("Assignment failed ❌");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading courses...</p>;

  /* -------------------------------
     UI
  -------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex justify-between">
          <h1 className="text-2xl font-bold">Course Assignment</h1>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Courses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {course.description}
              </p>

              <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                {course.tag}
              </span>

              {/* Mandatory */}
             
              {/* Years */}
              <div className="mt-5 flex flex-wrap gap-2">
                {YEARS.map((year) => (
                  <button
                    key={year}
                    onClick={() => toggleYear(course.id, year)}
                    className={`px-3 py-1 rounded-full text-sm
                      ${
                        course.years.includes(year)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                  >
                    Year {year}
                  </button>
                ))}
              </div>

              {/* Assign Button */}
              <button
                disabled={submittingId === course.id}
                onClick={() => assignCourse(course)}
                className={`mt-8 w-full py-2 rounded-xl text-white
                  ${
                    submittingId === course.id
                      ? "bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {submittingId === course.id
                  ? "Assigning..."
                  : "Assign Course"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
