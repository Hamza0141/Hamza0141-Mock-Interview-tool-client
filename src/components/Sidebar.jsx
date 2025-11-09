import { useState } from "react";
import { Home, User, BarChart3, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";
import { useAppDispatch } from "../app/hooks";

import {
  UilUsdCircle,
  UilClipboardAlt,
  UilUsersAlt,
  UilWindowSection,
} from "@iconscout/react-unicons";

export default function Sidebar({ collapsed }) {
  const [active, setActive] = useState("dashboard");
  const dispatch = useAppDispatch();
  const items = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "pricing", label: "Pricing", icon: <UilUsdCircle size={18} /> },
    { id: "interview", label: "Interview", icon: <UilUsersAlt size={18} /> },
    { id: "reports", label: "Results", icon: <BarChart3 size={18} /> },
    { id: "notes", label: "Notes", icon: <UilWindowSection size={18} /> },
  ];

const handleLogout = async () => {

  // ✅ Try to clear cookie on backend (non-blocking)
  dispatch(logoutUser());

  // ✅ Redirect after a short delay (UI stays consistent)
  setTimeout(() => {
    navigate("/login", { replace: true });
  }, 200);
};

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)]  transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
      style={{
        backgroundColor: "var(--color-bg-sidebar)",
        borderColor: "var(--color-border)",
        color: "var(--color-text-main)",
      }}
    >
      <div className="flex flex-col h-full justify-between">
        <nav className="mt-6 space-y-1 px-3">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/${item.id}`}
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                active === item.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "hover:bg-[var(--color-bg-body)] hover:text-[var(--color-primary)]"
              }`}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div
          className="border-t p-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button
            className="flex items-center gap-3 hover:text-[var(--color-danger)]"
            type="click"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
