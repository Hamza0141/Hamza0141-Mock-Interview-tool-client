// src/components/Navbar.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon, Menu, Bell, Search } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  markNotificationRead,
} from "../features/notifications/notificationsSlice";

function NotificationBell() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.user);
  const { items = [], unreadCount = 0 } = useAppSelector(
    (s) => s.notifications || {}
  );

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // const handleNavigateForNotification = (n) => {
  //   switch (n.entity_type) {
  //     case "interview_session":
  //       navigate(`/evaluation/${n.entity_id}`);
  //       break;
  //     case "public_speech":
  //       navigate(`/speech/evaluation/${n.entity_id}`);
  //       break;
  //     case "support_ticket":
  //       navigate(`/tickets/${n.entity_id}`);
  //       break;
  //     case "credit_transaction":
  //     case "credit_transfer":
  //       navigate("/billing");
  //       break;
  //     default:
  //       navigate("/dashboard");
  //   }
  // };

  const handleClickItem = (n) => {
    dispatch(markNotificationRead(n.notification_id));
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-white/5 transition"
      >
        <Bell size={18} className="text-[var(--color-text-main)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-[var(--color-bg-panel)] shadow-lg z-40 overflow-hidden">
          <div className="px-3 py-2 border-b border-white/5 flex justify-between items-center">
            <span className="text-xs font-semibold text-[var(--color-text-main)]">
              Notifications
            </span>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/notifications");
              }}
              className="text-[10px] text-[var(--color-primary)] hover:underline"
            >
              View all
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-[11px] text-[var(--color-text-muted)] px-3 py-4 text-center">
                No notifications yet.
              </p>
            ) : (
              items.slice(0, 8).map((n) => (
                <button
                  key={n.notification_id}
                  type="button"
                  onClick={() => handleClickItem(n)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-white/5 flex flex-col gap-0.5 ${
                    n.is_read ? "opacity-70" : "opacity-100"
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-medium text-[var(--color-text-main)] truncate">
                      {n.title}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-[var(--color-text-muted)]">
                      {n.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)] line-clamp-2">
                    {n.body}
                  </span>
                  <span className="text-[9px] text-[var(--color-text-muted)]">
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

export default function Navbar({ collapsed, onToggleSidebar }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useAppSelector((s) => s.user);
  const [search, setSearch] = useState("");

  const imgSrc = user?.profile_url
    ? `${import.meta.env.VITE_API_IMG_URL}${user.profile_url}`
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // For now just log or later navigate to /search?q=search
    // console.log("Search:", search);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:px-6 shadow-sm z-50 gap-4 transition-colors duration-300"
      style={{
        backgroundColor: "var(--color-bg-panel)",
        color: "var(--color-text-main)",
      }}
    >
      {/* Left: logo + sidebar toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1 rounded-md hover:bg-white/5 md:mr-1"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-bold text-[var(--color-primary)] text-lg tracking-wide">
          MockPrep
        </h1>
      </div>

      {/* Center: search bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex items-center flex-1 max-w-md mx-4"
      >
        <div className="flex items-center w-full px-3 py-2 rounded-full border bg-[var(--color-bg-body)]/80 text-sm shadow-inner gap-2">
          <Search
            size={16}
            className="text-[var(--color-text-muted)] flex-shrink-0"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search interviews, speeches, tickets..."
            className="w-full bg-transparent outline-none text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] text-xs"
          />
        </div>
      </form>

      {/* Right: theme toggle, notifications, user chip */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-full transition border border-white/10 hover:border-[var(--color-primary)] hover:shadow-[0_0_10px_rgba(243,146,40,0.4)]"
          style={{
            backgroundColor: "var(--color-bg-body)",
            color: "var(--color-text-main)",
          }}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Notification bell */}
        <NotificationBell />

        {/* User chip */}
        {user && (
          <Link to="/profile">
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <img
                src={imgSrc}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-white/20"
              />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  Welcome back
                </span>
                <span className="text-xs font-semibold text-[var(--color-text-main)]">
                  {user.first_name || "User"}
                </span>
              </div>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
