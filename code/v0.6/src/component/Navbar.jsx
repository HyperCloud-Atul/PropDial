import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  // variables start
  const navigate = useNavigate();
  // variables end

  // Add class on scroll start
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollThreshold = 100; // Adjust this value based on when you want to add the class
      setIsScrolled(scrollTop > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = isScrolled ? "navbar on_scrolled" : "navbar";
  // Add class on scroll end

  //   menus and all clicks start

  // on click on logo start
  const logoClick = () => {
    navigate("/");
  };
  // on click on logo end

  return (
    <nav className={navClass}>
      <ul>
        <li className="nav_logo pointer" onClick={logoClick}>
          <img src="/assets/img/logo_propdial.png" alt="logo" />
        </li>
        <li className="main_menus">
          <div className="menu_single pointer active">
            <span class="material-symbols-outlined">Home</span>
            Home
          </div>
          <div className="menu_single pointer">
          <span class="material-symbols-outlined">
import_contacts
</span>
         About Us
          </div>
          <div className="menu_single pointer">
            <span class="material-symbols-outlined">contact_support</span>
            Contact
          </div>      
          <div className="menu_single pointer">
            <span class="material-symbols-outlined">more</span>
           More
          </div>
        </li>
        <li className="social_media">
          <Link
            className="sm_single pointer"
            to="https://www.facebook.com/propdial"
          >
            <img src="/assets/img/facebook.png"></img>
          </Link>
          <Link
            className="sm_single pointer"
            to="https://www.youtube.com/channel/UC9cJZCtePKupvCVhRoimjlg"
          >
            <img src="/assets/img/youtube.png"></img>
          </Link>
          <Link
            className="sm_single pointer"
            to="https://www.linkedin.com/company/propdial-india-pvt-ltd-/"
          >
            <img src="/assets/img/linkedin.png"></img>
          </Link>
          <Link
            className="sm_single pointer"
            to="https://twitter.com/i/flow/login?redirect_after_login=%2Fpropdial"
          >
            <img src="/assets/img/twitter.png"></img>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
