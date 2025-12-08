// src/components/sections/header/offcanvasNavbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navigationData } from "@/db/navigationData.js";
import { useAppSelector } from "../../../app/hooks";

const ResponsiveNavbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const handleNavClick = (href) => (e) => {
    e.preventDefault();

    // SPA navigation
    navigate(href);

    // Close the Bootstrap offcanvas panel
    const offcanvasEl = document.getElementById("navbarOffcanvas");
    if (offcanvasEl && window.bootstrap) {
      const instance =
        window.bootstrap.Offcanvas.getInstance(offcanvasEl) ||
        new window.bootstrap.Offcanvas(offcanvasEl);
      instance.hide();
    }
  };

  return (
    <div
      className="responsive-navbar offcanvas offcanvas-end"
      data-bs-backdrop="static"
      tabIndex="-1"
      id="navbarOffcanvas"
    >
      <div className="offcanvas-header">
        <Link
          className="logo d-inline-block"
          to="/"
          onClick={handleNavClick("/")}
        >
          Prepare With AI
        </Link>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>

      <div className="offcanvas-body">
        <ul className="mobile-nav list-style">
          {navigationData.map((item) => {
            const isActive = pathname === item.href;

            // 🔒 Hide Login/Sign Up if user is authenticated
            if (item.label === "Login/Sign Up" && isAuthenticated) {
              return null;
            }

            // 🔓 Hide Dashboard link if user is NOT authenticated
            if (item.label === "Dashboard" && !isAuthenticated) {
              return null;
            }

            return (
              <li key={item.label}>
                <Link
                  to={item.href}
                  onClick={handleNavClick(item.href)}
                  className={isActive ? "active" : ""}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="offcanvas-contact-info mt-4">
          <h4>Follow On</h4>
          <ul className="social-profile list-style">
            <li>
              <a href="#">
                <i className="bx bxl-facebook" />
              </a>
            </li>
            <li>
              <a href="#">
                <i className="bx bxl-instagram" />
              </a>
            </li>
            <li>
              <a href="#">
                <i className="bx bxl-linkedin" />
              </a>
            </li>
            <li>
              <a href="#">
                <i className="bx bxl-dribbble" />
              </a>
            </li>
            <li>
              <a href="#">
                <i className="bx bxl-pinterest" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveNavbar;
