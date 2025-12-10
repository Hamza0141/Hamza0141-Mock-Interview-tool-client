// src/layouts/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { logoutUser as logoutAction } from "../features/auth/authSlice";
import authApi from "../api/authApi";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768; // collapsed by default on mobile
  });

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

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

  // ✅ Session / cookie check
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        await authApi.me();
      } catch (err) {
        if (!isMounted) return;
        console.error("❌ Session check failed:", err);
        const status = err?.response?.status;

        if (
          status === 401 ||
          status === 403 ||
          status === 400 ||
          status === undefined
        ) {
          localStorage.removeItem("user_data");
          dispatch(logoutAction());
          try {
            await authApi.logout();
          } catch (_) {}
          navigate("/login", { replace: true });
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch, navigate]);

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
