import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
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
