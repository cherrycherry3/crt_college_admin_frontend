"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiGrid, FiAward, FiLogOut } from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", path: "/", icon: FiGrid },
  { name: "Students", path: "/students", icon: FiAward },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-5 flex flex-col">
      
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-md">
          <FiAward size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">CRT Platform</h2>
          <p className="text-xs text-slate-400">College Admin</p>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all
                ${
                  isActive
                    ? "bg-slate-800 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {isActive && <span>›</span>}
            </Link>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="mt-auto pt-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
        >
          <FiLogOut size={18} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
