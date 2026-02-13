"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import AddStudentModal from "../components/AddStudentModal";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  /* --------------------------------
     Fetch students
  -------------------------------- */
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/api/college/students");
      setStudents(data);
      setFiltered(data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* --------------------------------
     Search logic
  -------------------------------- */
  useEffect(() => {
    if (!search) {
      setFiltered(students);
      return;
    }

    const q = search.toLowerCase();

    setFiltered(
      students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.roll_no.toLowerCase().includes(q) ||
          s.branch.toLowerCase().includes(q)
      )
    );
  }, [search, students]);

  /* --------------------------------
     UI
  -------------------------------- */
  return (
    <div style={{ padding: "24px" }}>
      {/* Header row – DO NOT disturb alignment */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>
            Students
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>
            Manage student records
          </p>
        </div>

        {/* + Add Student button — position unchanged */}
        <button
          onClick={() => setOpenModal(true)}
          style={{
            padding: "10px 18px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Student
        </button>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search by name, email, roll number, branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "320px",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1.5px solid #d1d5db",
            fontSize: "14px",
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Loading students...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            No students found
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead style={{ background: "#f9fafb" }}>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Roll No</th>
                <th style={th}>Branch</th>
                <th style={th}>Academic Year</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.student_id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={td}>{s.name}</td>
                  <td style={td}>{s.email}</td>
                  <td style={td}>{s.roll_no}</td>
                  <td style={td}>{s.branch}</td>
                  <td style={td}>{s.academic_year}</td>
                  <td style={td}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background:
                          s.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                        color:
                          s.status === "ACTIVE" ? "#166534" : "#991b1b",
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={fetchStudents}
      />
    </div>
  );
}

/* --------------------------------
   Table styles
-------------------------------- */
const th = {
  textAlign: "left",
  padding: "14px",
  fontWeight: 700,
  color: "#374151",
};

const td = {
  padding: "14px",
  color: "#111827",
};
