"use client";

import "./globals.css";
import Sidebar from "./components/sidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Login page should NOT show sidebar
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body>
        {isLoginPage ? (
          children
        ) : (
          <div className="flex min-h-screen">
            <div className="sticky top-0 h-screen">
              <Sidebar />
            </div>
            <main className="flex-1 p-4 bg-gray-100">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
