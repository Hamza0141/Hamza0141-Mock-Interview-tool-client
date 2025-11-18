// src/components/Sidebar.jsx
import { useMemo } from "react";
import {
  Home,
  User,
  BarChart3,
  LogOut,
  Bell,
  Ticket,
  FileText,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";
import { useAppDispatch } from "../app/hooks";

import {
  UilUsdCircle,
  UilUsersAlt,
  UilWindowSection,
} from "@iconscout/react-unicons";

export default function Sidebar({ collapsed }) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // All sidebar items (add /tickets and /notifications)
  const items = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
      { id: "interview", label: "Interview", icon: <UilUsersAlt size={18} /> },
      // { id: "speech", label: "Speech Practice", icon: <Mic size={18} /> },
      { id: "reports", label: "Results", icon: <BarChart3 size={18} /> },
      { id: "profile", label: "Profile", icon: <User size={18} /> },
      { id: "pricing", label: "Pricing", icon: <UilUsdCircle size={18} /> },
      { id: "notes", label: "Notes", icon: <UilWindowSection size={18} /> },
      { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
      { id: "tickets", label: "Support Tickets", icon: <Ticket size={18} /> },
      // { id: "settings", label: "Settings", icon: <FileText size={18} /> },
    ],
    []
  );

  // Determine active item based on current URL path
  const activeId = useMemo(() => {
    const path = location.pathname || "/";
    // e.g. "/dashboard", "/reports/123" → match "dashboard" or "reports"
    const match = items.find((item) =>
      path === "/" ? item.id === "dashboard" : path.startsWith(`/${item.id}`)
    );
    return match ? match.id : "dashboard";
  }, [location.pathname, items]);

  const handleLogout = async () => {
    dispatch(logoutUser());
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 200);
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
      style={{
        backgroundColor: "var(--color-bg-sidebar)",
        borderRight: "1px solid var(--color-border)",
        color: "var(--color-text-main)",
      }}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Nav Items */}
        <nav className="mt-4 space-y-1 px-2">
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <Link
                key={item.id}
                to={`/${item.id}`}
                aria-current={isActive ? "page" : undefined}
                className={`
                  relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                  transition-all duration-150
                  ${
                    isActive
                      ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/60 shadow-sm"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-body)] hover:text-[var(--color-primary)]"
                  }
                `}
              >
                {/* left active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-[var(--color-primary)]" />
                )}

                <span className="flex items-center justify-center w-5">
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="ml-1 truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div
          className="border-t mt-3 p-3"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-bg-body)] px-3 py-2 rounded-lg transition-all"
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
