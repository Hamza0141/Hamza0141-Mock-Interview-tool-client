// src/components/Sidebar.jsx
import { useMemo } from "react";
import {
LayoutDashboard,
  User,
  BarChart3,
  LogOut,
  Bell,
  Ticket,
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

  // All sidebar items
  const items = useMemo(
    () => [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard size={16} />,
      },
      { id: "interview", label: "Interview", icon: <UilUsersAlt size={18} /> },
      { id: "reports", label: "Results", icon: <BarChart3 size={18} /> },
      { id: "profile", label: "Profile", icon: <User size={18} /> },
      { id: "buy-credits", label: "Credit", icon: <UilUsdCircle size={18} /> },
      { id: "notes", label: "Notes", icon: <UilWindowSection size={18} /> },
      { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
      { id: "tickets", label: "Support Tickets", icon: <Ticket size={18} /> },
    ],
    []
  );

  // Determine active item based on current URL path
  const activeId = useMemo(() => {
    const path = location.pathname || "/";
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
      className={`position-fixed dashboard-sidebar ${
        collapsed ? "is-collapsed" : ""
      }`}
      style={{
        top: "4rem", // same as navbar height
        left: 0,
        height: "calc(100vh - 4rem)",
        backgroundColor: "var(--color-bg-sidebar)",
        borderRight: "1px solid var(--color-border)",
        color: "var(--color-text-main)",
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
                className="sidebar-item position-relative d-flex align-items-center px-3 py-2 rounded-3 text-decoration-none mb-2 small"
                style={{
                  color: isActive
                    ? "var(--color-primary)"
                    : "var(--color-text-muted)",
                  backgroundColor: isActive
                    ? "rgba(243,146,40,0.15)"
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

                {/* Normal label (visible when not collapsed / desktop) */}
                {!collapsed && (
                  <span className="ms-2 text-truncate sidebar-label">
                    {item.label}
                  </span>
                )}

                {/* Tooltip label (for collapsed sidebar on hover) */}
                <span className="sidebar-tooltip">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout – desktop only (mobile uses navbar button) */}
        <div
          className="border-top mt-3 p-3 d-none d-md-block"
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
