import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navigationData } from "@/db/navigationData";

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <ul className="navbar-nav ms-auto align-items-center">
      {navigationData.map((item) => {
        const isActive = pathname === item.href;

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
