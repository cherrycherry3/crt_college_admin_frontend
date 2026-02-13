"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardStats from "./homepage/dashboard";
import DepartmentProgressExact from "./homepage/departmentprogresscard";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      router.push("/login");
    }
  }, []);

  return (
    <div>
      <DashboardStats />
      <DepartmentProgressExact />
    </div>
  );
}
