"use client";

import { useState } from "react";

export default function AddStudentsModal({ onClose }) {
  const [tab, setTab] = useState("single");
  const [file, setFile] = useState(null);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl relative">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Add Students</h3>
          <button onClick={onClose} className="text-xl">×</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-6 pt-4">
          <button
            onClick={() => setTab("single")}
            className={`flex-1 py-2 rounded-xl ${
              tab === "single"
                ? "border-2 border-blue-600 text-blue-600 font-medium"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            Add Single
          </button>

          <button
            onClick={() => setTab("bulk")}
            className={`flex-1 py-2 rounded-xl ${
              tab === "bulk"
                ? "border-2 border-blue-600 text-blue-600 font-medium"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            Bulk Upload
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* -------- ADD SINGLE -------- */}
          {tab === "single" && (
            <div className="space-y-4">
              <Input label="Full Name *" placeholder="Enter student name" />
              <Input label="Email (for OTP login) *" placeholder="student@college.edu" />
              <Input label="College ID / Roll Number *" placeholder="CSE2024001" />

              <div className="grid grid-cols-2 gap-4">
                <Select label="Branch / Department *" />
                <Select label="Year of Study *" />
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
                Add Student
              </button>
            </div>
          )}

          {/* -------- BULK UPLOAD -------- */}
          {tab === "bulk" && (
            <>
              <label className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center text-center cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={(e) => setFile(e.target.files[0])}
                />

                <p className="font-medium text-gray-700">
                  Upload a CSV file with student data
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Required: Name, Email | Optional: Roll Number, Branch, Year
                </p>

                <span className="mt-4 px-4 py-2 border rounded-lg text-sm">
                  Select CSV File
                </span>

                {file && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {file.name}
                  </p>
                )}
              </label>

              <div className="bg-gray-100 rounded-xl p-4 text-sm font-mono">
                <p>Name,Email,Roll Number,Branch,Year</p>
                <p>John Doe,john@college.edu,CSE001,CSE,3</p>
                <p>Jane Smith,jane@college.edu,ECE002,ECE,2</p>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
                Upload Students
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full mt-1 border rounded-xl px-4 py-3"
      />
    </div>
  );
}

function Select({ label }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select className="w-full mt-1 border rounded-xl px-4 py-3">
        <option>Select</option>
      </select>
    </div>
  );
}
