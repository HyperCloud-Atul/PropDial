import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

// css
import "./PGMoreMenu.css";

// components
import Hero from "../../Components/Hero";

const PGMoreMenu = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  return (
    <div className="pgmoremenu">
      <Hero
        pageTitle="Locate Everything"
        pageSubTitle="Explore more for better understanding"
        heroImage="./assets/img/about_us_banner.jpg"
      ></Hero>

      <section className="more-menus sect_padding">
        <div className="container">
          <div className="more-menus_inner">
            <div className="mm_inner">
              <h6 className="title">
                Contact
              </h6>
              <Link className="mm_single" to="/about-us">
                <span class="material-symbols-outlined mms_icon">
                  import_contacts
                </span>
                <h6>About</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/faq">
                <span class="material-symbols-outlined mms_icon">quiz</span>
                <h6>FAQ</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/contact-us">
                <span class="material-symbols-outlined mms_icon">
                  contact_page
                </span>
                <h6>Contact Us</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>
            <div className="mm_inner">
              <h6 className="title">
                Others
              </h6>
              <Link className="mm_single" to="">
                <span class="material-symbols-outlined mms_icon">
                  help
                </span>
                <h6>Help & Support</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span class="material-symbols-outlined mms_icon">
                  report
                </span>
                <h6>Privacy Policy</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span class="material-symbols-outlined mms_icon">
                  gavel
                </span>
                <h6>Terms & Condition</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>


          </div>



        </div>

      </section>
    </div>
  );
};

export default PGMoreMenu;
