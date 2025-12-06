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
    return window.innerWidth < 768; // 👈 collapsed by default on mobile
  });

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setCollapsed(true); 
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

 useEffect(() => {
   let isMounted = true;

   async function checkSession() {
     try {
       // 🔹 this will validate HttpOnly cookie on the backend
       await authApi.me();
     } catch (err) {
       if (!isMounted) return;
       console.error("❌ Session check failed:", err);

       // If backend says 401/403/400 etc => treat as invalid session
       const status = err?.response?.status;

       if (status === 401 || status === 403 || status === 400 || status === undefined) {
         // 1) clear localStorage
         localStorage.removeItem("user_data");

         // 2) reset Redux auth state
         dispatch(logoutAction());

         // 3) optionally ask backend to clear cookie, ignore errors
         try {
           await authApi.logout();
         } catch (_) {}

         // 4) redirect to login (or "/" if you prefer)
         navigate("/login", { replace: true });
       }
     }
   }

   checkSession();

   return () => {
     isMounted = false;
   };
 }, [dispatch, navigate]);
  return (
    <div
      className="min-h-screen transition-colors duration-300 selfmock-dashboard"
      style={{
        backgroundColor: "var(--color-bg-body)",
        color: "var(--color-text-main)",
      }}
    >
      {/* Fixed Navbar */}
      <Navbar
        collapsed={collapsed}
        onToggleSidebar={() => setCollapsed(!collapsed)}
      />

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} />

        {/* Main Content */}
        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            collapsed ? "ml-20" : "ml-64"
          }`}
          style={{
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
