import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// component
import ContactForm from "../../create/ContactForm";

const PGPropAgentInactiveUser = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className="top_header_pg">
        <div
          className={`loginsignpg  ${
            sidebarOpen ? "sidebar-open" : "sidebar-close"
          }`}
        >
          <div
            className="ls_sidebar set_bg_img_with_overlay"
            style={{
              backgroundImage: "url('/assets/img/dharuhera.jpg')",
            }}
          >
            <div className="blur-bg"></div>
            <div className="open_close_icon" onClick={toggleSidebar}>
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </div>
            <div className="lss_content">
              <h3>Things you Can Do with PropAgent Account</h3>
              <ul>
                <li>
                  Showcase listings
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
                <li>
                  Explore properties
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
                <li>
                  Connect and collaborate
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
                <li>
                  Stay trend-aware
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
                <li>
                  Engage in conversations
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
                <li>
                  Access efficient tools
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
                <li>
                  Receive reliable support
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="right_main_form"
            style={{
              backgroundImage: "url('/assets/img/lsbg.png')",
            }}
          >
            <ContactForm />
            <div className="rmf_inner inactiveuser relative">
              <img src="/assets/img/sad_emoji.png" alt="" />
              <h4>
                You are <span>inactive</span>
              </h4>

              <h6>
                Please{" "}
                <span
                  className="click_text"
                  data-bs-toggle="modal"
                  data-bs-target="#contact_us_modal"
                >
                  contact
                </span>{" "}
                to support team
              </h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PGPropAgentInactiveUser;
