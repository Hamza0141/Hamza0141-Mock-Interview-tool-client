// src/layouts/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { checkSession } from "../features/auth/authSlice";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, sessionStatus } = useAppSelector((s) => s.auth);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768; // collapsed by default on mobile
  });

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  // ---------- Responsive sidebar / mobile detection ----------
  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        // on mobile we always treat sidebar as "collapsed"
        setCollapsed(true);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleSidebar = () => {
    // Only meaningful on desktop/tablet
    if (!isMobile) {
      setCollapsed((prev) => !prev);
    }
  };

  // ---------- Session check via Redux ----------
  // 1) Ask backend to validate cookie when session is "unknown"
  useEffect(() => {
    if (sessionStatus === "unknown") {
      dispatch(checkSession());
    }
  }, [sessionStatus, dispatch]);

  // 2) Redirect to login only when we definitively know the session is invalid
  useEffect(() => {
    if (!isAuthenticated && sessionStatus === "invalid") {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, sessionStatus, navigate]);

  // marginLeft only for desktop where sidebar is rendered
  const desktopMarginLeft = !isMobile ? (collapsed ? "5rem" : "16rem") : "0";

  return (
    <div
      className="min-h-screen transition-colors duration-300 selfmock-dashboard"
      style={{
        backgroundColor: "var(--color-bg-body)",
        color: "var(--color-text-main)",
      }}
    >
      {/* Fixed Navbar */}
      <Navbar collapsed={collapsed} onToggleSidebar={handleToggleSidebar} />

      <div className="flex pt-16">
        {/* Sidebar visible only on md+ (desktop / tablet) */}
        {!isMobile && <Sidebar collapsed={collapsed} />}

        {/* Main Content */}
        <main
          className="flex-1 p-4 p-md-5 transition-all duration-300"
          style={{
            marginLeft: desktopMarginLeft,
            backgroundColor: "var(--color-bg-body)",
            color: "var(--color-text-main)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
