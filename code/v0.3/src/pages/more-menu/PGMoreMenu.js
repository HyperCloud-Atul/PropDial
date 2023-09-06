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
          <div className="row">
            <div className="col-md-6">
              <div className="mm_inner">
                <Link className="mm_single" to="/about-us">
                  <span class="material-symbols-outlined mms_icon">factory</span>
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
                <Link className="mm_single" to="/faq">
                  <span class="material-symbols-outlined mms_icon">quiz</span>
                  <h6>FAQ</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mm_inner">
                <Link className="mm_single" to="/faq">
                  <span class="material-symbols-outlined mms_icon">quiz</span>
                  <h6>FAQ</h6>
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
                <Link className="mm_single" to="/faq">
                  <span class="material-symbols-outlined mms_icon">quiz</span>
                  <h6>FAQ</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PGMoreMenu;
