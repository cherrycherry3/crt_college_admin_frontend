"use client";
import { useState } from "react";
import { apiRequest } from "../api"; // ← adjust the import path to your api.js file

export default function AddStudentModal({ isOpen, onClose, onSubmit }) {
  const [mode, setMode] = useState("single");
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    roll_number: "",
    phone: "",
    academic_year_id: "",
    branch_id: "",
    college_id: "",
    password: "",
  });

  if (!isOpen) return null;

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // ────────────────────────────────────────────────
  //                SINGLE STUDENT SUBMIT
  // ────────────────────────────────────────────────
  const handleSingleSubmit = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.roll_number ||
      !form.phone ||
      !form.academic_year_id ||
      !form.branch_id ||
      !form.college_id
    ) {
      alert("Please fill all mandatory fields");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      roll_number: form.roll_number.trim(),
      phone: form.phone.trim(),
      academic_year_id: Number(form.academic_year_id),
      branch_id: Number(form.branch_id),
      college_id: Number(form.college_id),
      password: form.password.trim() || "Auto@123",
    };

    setIsSubmitting(true);

    try {
      const response = await apiRequest("/api/college", "POST", payload);

      // Assuming successful response contains student_id or similar
      alert("Student added successfully! ✓");

      // You can also call the original onSubmit if you still need it
      onSubmit?.({
        ...payload,
        student_id: response?.student_id, // optional
      });

      // Reset form
      setForm({
        name: "",
        email: "",
        roll_number: "",
        phone: "",
        academic_year_id: "",
        branch_id: "",
        college_id: "",
        password: "",
      });

      onClose();
    } catch (error) {
      console.error("Single student creation failed:", error);
      const msg =
        error?.detail ||
        error?.message ||
        error?.error ||
        "Failed to add student. Please try again.";
      alert(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ────────────────────────────────────────────────
  //                   BULK UPLOAD
  // ────────────────────────────────────────────────
  const handleBulkFile = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setFileName(file.name);

  const formData = new FormData();
  formData.append("file", file);

  setIsSubmitting(true);

  try {
    const result = await apiRequest(
      "/api/college/bulk-upload",
      "POST",
      formData
    );

    let message = `Bulk upload completed!\n\nTotal: ${result.total_records}\nSuccessful: ${result.successfully_created}`;

    if (result.failed_records?.length > 0) {
      message += `\n\nFailed records (${result.failed_records.length}):`;
      result.failed_records.forEach((f) => {
        message += `\nRow ${f.row} (${f.email || "—"}): ${f.reason}`;
      });
    }

    alert(message);

    setFileName("");
    onClose();
  } catch (error) {
    console.error("Bulk upload failed:", error);

    const errMsg =
      error?.detail ||
      error?.message ||
      error?.error ||
      "Failed to process bulk upload. Please check the file and try again.";

    alert(`Error: ${errMsg}`);
    setFileName("");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 9998,
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "900px",
          maxHeight: "85vh",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 28px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Add Student
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Register students individually or via bulk import
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              width: "36px",
              height: "36px",
              border: "none",
              background: "#f3f4f6",
              borderRadius: "8px",
              fontSize: "24px",
              color: "#6b7280",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "20px 28px 0",
            background: "#fafafa",
          }}
        >
          <button
            onClick={() => setMode("single")}
            disabled={isSubmitting}
            style={{
              padding: "10px 24px",
              border: "none",
              background: mode === "single" ? "white" : "transparent",
              color: mode === "single" ? "#2563eb" : "#6b7280",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              borderRadius: "8px 8px 0 0",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            Single Student
          </button>
          <button
            onClick={() => setMode("bulk")}
            disabled={isSubmitting}
            style={{
              padding: "10px 24px",
              border: "none",
              background: mode === "bulk" ? "white" : "transparent",
              color: mode === "bulk" ? "#2563eb" : "#6b7280",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              borderRadius: "8px 8px 0 0",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            Bulk Import
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px",
            background: "white",
          }}
        >
          {/* Single Student Form */}
          {mode === "single" && (
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                {/* ... all input fields remain exactly the same ... */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                    Full Name <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      padding: "11px 14px",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#111827",
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                    Email <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      padding: "11px 14px",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#111827",
                    }}
                  />
                </div>

                {/* Roll Number */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                    Roll Number <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter roll number"
                    value={form.roll_number}
                    onChange={(e) => update("roll_number", e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      padding: "11px 14px",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#111827",
                    }}
                  />
                </div>

                {/* Phone */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                    Phone <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      padding: "11px 14px",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#111827",
                    }}
                  />
                </div>

                {/* Branch */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                    Branch <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    value={form.branch_id}
                    onChange={(e) => update("branch_id", e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      padding: "11px 14px",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#111827",
                      background: "white",
                    }}
                  >
                    <option value="">Select Branch</option>
                    <option value="1">Computer Science (CSE)</option>
                    <option value="2">Electronics (ECE)</option>
                    <option value="3">Mechanical (MECH)</option>
                    <option value="4">Civil Engineering</option>
                    <option value="5">Electrical (EEE)</option>
                  </select>
                </div>

                {/* Academic Year */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                    Academic Year <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    value={form.academic_year_id}
                    onChange={(e) => update("academic_year_id", e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      padding: "11px 14px",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#111827",
                      background: "white",
                    }}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                {/* College ID */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                    College ID <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter college ID"
                    value={form.college_id}
                    onChange={(e) => update("college_id", e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      padding: "11px 14px",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#111827",
                    }}
                  />
                </div>

                {/* Password */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                    Password <span style={{ fontSize: "12px", color: "#6b7280" }}>(Optional)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Default: Auto@123"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      padding: "11px 14px",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#111827",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "14px 16px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#1e40af",
                }}
              >
                <span>ℹ️</span>
                <p style={{ margin: 0 }}>
                  All fields marked with <span style={{ color: "#dc2626" }}>*</span> are mandatory. 
                  Default password is <strong>Auto@123</strong>
                </p>
              </div>
            </div>
          )}

          {/* Bulk Import – UI stays exactly the same */}
          {mode === "bulk" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.3fr",
                gap: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "100%",
                    padding: "32px 24px",
                    border: "2px dashed #cbd5e1",
                    borderRadius: "12px",
                    textAlign: "center",
                    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>📤</div>
                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "#1e293b",
                    }}
                  >
                    Upload CSV/Excel File
                  </h3>
                  <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#64748b" }}>
                    Drag and drop or click to browse
                  </p>

                  <label
                    style={{
                      display: "inline-block",
                      padding: "11px 28px",
                      background: isSubmitting ? "#93c5fd" : "#2563eb",
                      color: "white",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      marginBottom: "10px",
                    }}
                  >
                    {fileName ? `✓ ${fileName}` : isSubmitting ? "Uploading..." : "📁 Choose File"}
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={handleBulkFile}
                      disabled={isSubmitting}
                      style={{ display: "none" }}
                    />
                  </label>

                  {fileName && !isSubmitting && (
                    <div>
                      <button
                        onClick={() => setFileName("")}
                        disabled={isSubmitting}
                        style={{
                          padding: "8px 20px",
                          background: "transparent",
                          color: "#dc2626",
                          border: "1px solid #dc2626",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions – remains unchanged */}
              <div
                style={{
                  background: "#fafafa",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              >
                {/* ... rest of the instructions code remains exactly the same ... */}
                <h4 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700, color: "#111827" }}>
                  📋 Required CSV Format
                </h4>

                <div style={{ marginBottom: "20px" }}>
                  <code
                    style={{
                      display: "block",
                      padding: "12px",
                      background: "white",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "#374151",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    name,email,roll_number,phone,academic_year_id,branch_id,college_id,password
                  </code>
                </div>

                {/* ... rest unchanged ... */}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            padding: "20px 28px",
            borderTop: "1px solid #e5e7eb",
            background: "#fafafa",
          }}
        >
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              padding: "10px 24px",
              border: "1.5px solid #d1d5db",
              background: "white",
              color: "#374151",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            Cancel
          </button>

          {mode === "single" && (
            <button
              onClick={handleSingleSubmit}
              disabled={isSubmitting}
              style={{
                padding: "10px 24px",
                background: isSubmitting ? "#93c5fd" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                minWidth: "140px",
              }}
            >
              {isSubmitting ? "Adding..." : "Add Student"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}