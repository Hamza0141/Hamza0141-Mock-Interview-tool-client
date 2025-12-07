// src/layout/root.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
// ⬇ Template CSS – imported here so conceptually tied to public site.
// Note: Vite bundles CSS globally, but this keeps it organized.
import "bootstrap/dist/css/bootstrap.min.css";
import "@/assets/css/boxicons.min.css";
import "@/assets/css/flaticon.css";
import "@/assets/css/header.css";
import "@/assets/css/style.css";
import "@/assets/css/responsive.css";

import Header from "@/components/sections/header/header.jsx"; 
import Footer from "@/components/sections/footer.jsx"; 
import AddAnimation from "@/components/ui/addAnimation.jsx";


const RootLayout = () => {
  const pathName = useLocation().pathname;
  const [themeClass, setThemeClass] = useState("dark-theme");

  useEffect(() => {
    if (pathName === "/home-two") {
      setThemeClass("light-theme");
    } else if (pathName === "/home-three") {
      setThemeClass("dark-theme-2");
    } else {
      setThemeClass("dark-theme");
    }
  }, [pathName]);

  const [showGoTop, setShowGoTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowGoTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className={`public-site ${themeClass}`}>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
        <AddAnimation />

        {showGoTop && (
          <div className="go-top active" onClick={scrollToTop}>
            <i className="bx bx-up-arrow-alt" />
          </div>
        )}
      </div>
    </>
  );
};

export default RootLayout;
