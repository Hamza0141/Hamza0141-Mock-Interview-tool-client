import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navigationData } from "@/db/navigationData";
import { useAppSelector } from "../../../app/hooks";

const Navbar = () => {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  return (
    <ul className="navbar-nav ms-auto align-items-center">
      {navigationData.map((item) => {
        const isActive = pathname === item.href;

        // Hide Login/Signup if authenticated
        if (item.label === "Login/Sign Up" && isAuthenticated) {
          return null;
        }

        // Add Dashboard when authenticated
        if (item.label === "Dashboard" && !isAuthenticated) {
          return null;
        }

        return (
          <li key={item.label} className="nav-item">
            <Link
              to={item.href}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Navbar;
