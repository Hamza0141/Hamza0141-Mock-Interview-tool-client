// src/components/Navbar.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon, Menu, Bell, Search, LogOut, HomeIcon } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { Link, useNavigate } from "react-router-dom";

import ForDark from "../assets/Logos/newLogo-Dark.png";
import forLight from "../assets/Logos/newLogo.png";

import {
  fetchNotifications,
  markNotificationRead,
} from "../features/notifications/notificationsSlice";
import { logoutUser } from "../features/auth/authSlice";

/* ------------------- NotificationBell ------------------- */

function NotificationBell() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.user);
  const { items = [], unreadCount = 0 } = useAppSelector(
    (s) => s.notifications || {}
  );

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ track narrow viewport for mobile notification positioning
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsNarrow(window.innerWidth < 490);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch notifications when user is known
  useEffect(() => {
    if (user?.profile_id) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user?.profile_id]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) return null;

  const handleClickItem = (n) => {
    dispatch(markNotificationRead(n.notification_id));
    setOpen(false);
    // later you can route based on n.entity_type here
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn border-0 p-2 rounded-circle position-relative"
        style={{
          backgroundColor: "transparent",
          color: "var(--color-text-main)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            className="position-absolute d-flex align-items-center justify-content-center rounded-pill"
            style={{
              top: "-2px",
              right: "-2px",
              minWidth: "16px",
              height: "16px",
              padding: "0 3px",
              backgroundColor: "#ef4444",
              color: "#ffffff",
              fontSize: "10px",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="position-absolute border rounded-3 shadow-lg"
          style={{
            // ✅ Center on very small screens so it doesn't get cut off
            right: isNarrow ? "auto" : 0,
            left: isNarrow ? "50%" : "auto",
            transform: isNarrow ? "translateX(-50%)" : "none",
            marginTop: "0.5rem",
            width: "min(20rem, 90vw)",
            backgroundColor: "var(--color-bg-panel)",
            zIndex: 1040,
            overflow: "hidden",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <span
              className="fw-semibold"
              style={{
                fontSize: "12px",
                color: "var(--color-text-main)",
              }}
            >
              Notifications
            </span>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/notifications");
              }}
              className="btn btn-link p-0"
              style={{
                fontSize: "10px",
                color: "var(--color-primary)",
                textDecoration: "none",
              }}
            >
              View all
            </button>
          </div>

          <div style={{ maxHeight: "18rem", overflowY: "auto" }}>
            {items.length === 0 ? (
              <p
                className="text-center mb-0 px-3 py-4"
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                }}
              >
                No notifications yet.
              </p>
            ) : (
              items.slice(0, 8).map((n) => (
                <button
                  key={n.notification_id}
                  type="button"
                  onClick={() => handleClickItem(n)}
                  className="w-100 text-start border-0 bg-transparent px-3 py-2"
                  style={{
                    fontSize: "12px",
                    opacity: n.is_read ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center gap-2">
                    <span
                      className="fw-medium text-truncate"
                      style={{ color: "var(--color-text-main)" }}
                    >
                      {n.title}
                    </span>
                    <span
                      className="rounded-pill"
                      style={{
                        fontSize: "9px",
                        padding: "2px 8px",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {n.type}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "var(--color-text-muted)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {n.body}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "9px",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------- Navbar ------------------------ */

export default function Navbar({ collapsed, onToggleSidebar }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useAppSelector((s) => s.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const imgSrc = user?.profile_url
    ? `${import.meta.env.VITE_API_IMG_URL}${user.profile_url}`
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const logoSrc = theme === "light" ? forLight : ForDark;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 200);
  };

  return (
    <header
      className="position-fixed d-flex align-items-center justify-content-between shadow-sm"
      style={{
        top: 0,
        left: 0,
        right: 0,
        height: "4rem",
        padding: "0 1rem",
        paddingRight: "1.5rem",
        zIndex: 1050,
        backgroundColor: "var(--color-bg-panel)",
        color: "var(--color-text-main)",
        borderBottom: "1px solid var(--color-border)",
        columnGap: "1rem",
      }}
    >
      {/* Left: logo + sidebar toggle */}
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="btn p-1 rounded-2 me-1 d-none d-md-block"
          style={{
            // ✅ make burger visible in both themes
            backgroundColor: "var(--color-bg-body)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-main)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-bg-body)";
          }}
        >
          <Menu size={20} />
        </button>
        <Link
          to="/dashboard"
          className="d-flex align-items-center text-decoration-none"
        >
          <img
            src={logoSrc}
            alt="SelfMock"
            style={{
              height: "2rem",
              width: "auto",
              objectFit: "contain",
              backgroundColor: "var(--color-bg-panel)",
            }}
          />
          <span
            className="d-none d-sm-inline ms-2 fw-semibold"
            style={{
              fontSize: "14px",
              letterSpacing: "0.04em",
              color: "var(--color-text-main)",
            }}
          >
            Prepare With AI
          </span>
        </Link>
      </div>

      {/* Center: search bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="d-none d-md-flex flex-grow-1 mx-3"
        style={{ maxWidth: "28rem" }}
      >
        <div
          className="d-flex align-items-center w-100 rounded-pill border shadow-inner"
          style={{
            padding: "0.35rem 0.75rem",
            // ✅ dynamic background for light/dark theme
            backgroundColor:
              theme === "light"
                ? "rgba(248,249,251,0.95)" // light-ish
                : "rgba(15,23,42,0.9)", // dark-ish
            borderColor: "var(--color-border)",
            columnGap: "0.5rem",
          }}
        >
          <Search
            size={16}
            style={{ color: "var(--color-text-muted)", flexShrink: 0 }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search interviews, speeches, tickets..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              color: "var(--color-text-main)",
              fontSize: "12px",
            }}
          />
        </div>
      </form>

      {/* Right: theme toggle, notifications, user chip, mobile logout */}
      <div className="d-flex align-items-center gap-2">
        {/* Home button */}
        <Link to="/">
          <button
            type="button"
            className="btn p-2 rounded-circle border"
            style={{
              backgroundColor: "var(--color-bg-body)",
              color: "var(--color-text-main)",
              borderColor: "rgba(255,255,255,0.1)",
              boxShadow: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-primary)";
              e.currentTarget.style.boxShadow = "0 0 10px rgba(243,146,40,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <HomeIcon size={16} />
          </button>
        </Link>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="btn p-2 rounded-circle border"
          style={{
            backgroundColor: "var(--color-bg-body)",
            color: "var(--color-text-main)",
            borderColor: "rgba(255,255,255,0.1)",
            boxShadow: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-primary)";
            e.currentTarget.style.boxShadow = "0 0 10px rgba(243,146,40,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Notification bell */}
        <NotificationBell />

        {/* User chip */}
        {user && (
          <Link to="/profile" className="text-decoration-none">
            <div
              className="d-flex align-items-center ps-3"
              style={{
                borderLeft: "1px solid rgba(255,255,255,0.1)",
                columnGap: "0.5rem",
              }}
            >
              <img
                src={imgSrc}
                alt="Profile"
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "999px",
                  objectFit: "cover",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
              <div className="d-none d-sm-flex flex-column">
                <span
                  style={{
                    fontSize: "10px",
                    color: "var(--color-text-muted)",
                  }}
                >
                  Welcome back
                </span>
                <span
                  className="fw-semibold"
                  style={{
                    fontSize: "12px",
                    color: "var(--color-text-main)",
                  }}
                >
                  {user.first_name || "User"}
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Mobile logout button (visible only < md) */}
        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-sm d-inline-flex d-md-none align-items-center px-2 py-1 rounded-pill"
          style={{
            fontSize: "11px",
            backgroundColor: "transparent",
            color: "var(--color-text-muted)",
            border: "1px solid var(--color-border)",
          }}
        >
          <LogOut size={14} className="me-1" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
