// src/components/sections/header/header.jsx
import React, { useEffect, useRef, useState } from "react";
import Navbar from "./navbar";
import { Link, useLocation } from "react-router-dom";
import ResponsiveNavbar from "./offcanvasNavbar";
import SearchBox from "./searchBox";

const Header = () => {
  const ref = useRef(null);
  const { pathname } = useLocation();
  const [isSticky, setIsSticky] = useState(false);

  // Handle different style modes based on route
  useEffect(() => {
    if (!ref.current) return;

    ref.current.classList.remove("style-2", "style-3");

    if (pathname === "/home-two") ref.current.classList.add("style-2");
    if (pathname === "/home-three") ref.current.classList.add("style-3");
  }, [pathname]);

  // Sticky navbar scroll behavior
  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 120);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    if (isSticky) ref.current.classList.add("sticky");
    else ref.current.classList.remove("sticky");
  }, [isSticky]);

  return (
    <>
      <div ref={ref} className="navbar-area" id="navbar">
        <div className="container">
          <nav className="navbar navbar-expand-lg">
            {/* Logo */}
            <Link className="navbar-brand" to="/">
              Prepare With AI
            </Link>

            {/* Right side (mobile) */}
            <div className="other-all-option">
              <div className="other-option d-lg-none">
                <button
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasTop"
                  className="search-button"
                >
                  <i className="bx bx-search" />
                </button>
              </div>

              {/* Burger Button */}
              <button
                className="navbar-toggler"
                data-bs-toggle="offcanvas"
                href="#navbarOffcanvas"
                role="button"
                aria-controls="navbarOffcanvas"
              >
                <span className="burger-menu">
                  <span className="top-bar" />
                  <span className="middle-bar" />
                  <span className="bottom-bar" />
                </span>
              </button>
            </div>

            {/* Desktop Nav */}
            <div className="collapse navbar-collapse">
              <Navbar />
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Offcanvas Navigation */}
      <ResponsiveNavbar />
      <SearchBox />
    </>
  );
};

export default Header;
