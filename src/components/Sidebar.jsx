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
      { id: "buy-credits", label: "Credit", icon: <UilUsdCircle size={18} /> },
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
      className="position-fixed"
      style={{
        top: "4rem", // same as previous top-16 (4rem)
        left: 0,
        height: "calc(100vh - 4rem)",
        width: collapsed ? "5rem" : "16rem", // ~w-20 vs w-64
        backgroundColor: "var(--color-bg-sidebar)",
        borderRight: "1px solid var(--color-border)",
        color: "var(--color-text-main)",
        transition: "width 0.3s ease",
        zIndex: 1000,
      }}
    >
      <div className="d-flex flex-column justify-content-between h-100">
        {/* Nav Items */}
        <nav className="mt-3 px-2">
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <Link
                key={item.id}
                to={`/${item.id}`}
                aria-current={isActive ? "page" : undefined}
                className="position-relative d-flex align-items-center px-3 py-2 rounded-3 text-decoration-none mb-2 small"
                style={{
                  color: isActive
                    ? "var(--color-primary)"
                    : "var(--color-text-muted)",
                  backgroundColor: isActive
                    ? "rgba(243,146,40,0.15)" // similar to primary/15
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(243,146,40,0.6)"
                    : "1px solid transparent",
                  boxShadow: isActive
                    ? "0 0.2rem 0.4rem rgba(0,0,0,0.15)"
                    : "none",
                  transition: "all 0.15s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-bg-body)";
                    e.currentTarget.style.color = "var(--color-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--color-text-muted)";
                  }
                }}
              >
                {/* left active indicator bar */}
                {isActive && (
                  <span
                    className="position-absolute rounded-pill"
                    style={{
                      left: 0,
                      top: "0.25rem",
                      bottom: "0.25rem",
                      width: "0.25rem",
                      backgroundColor: "var(--color-primary)",
                    }}
                  />
                )}

                <span
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: "1.25rem" }}
                >
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="ms-2 text-truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div
          className="border-top mt-3 p-3"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button
            type="button"
            onClick={handleLogout}
            className="btn w-100 d-flex align-items-center px-3 py-2 rounded-3 border-0 text-start"
            style={{
              fontSize: "0.9rem",
              color: "var(--color-text-muted)",
              backgroundColor: "transparent",
              transition: "all 0.15s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-danger)";
              e.currentTarget.style.backgroundColor = "var(--color-bg-body)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-muted)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <LogOut size={18} />
            {!collapsed && <span className="ms-2">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
