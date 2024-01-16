import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

// import css
import "./PropAgentLS.css";

const PropagentEnterOTP = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  // add and remove class
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  // add and remove class

  // floating label code
  const handleInputFocus = (event) => {
    const label = event.target.previousSibling;
    label.classList.add("focused");
  };

  const handleInputBlur = (event) => {
    const label = event.target.previousSibling;
    if (!event.target.value) {
      label.classList.remove("focused");
    }
  };
  // floating label code

  return (
    <div className="top_header_pg otp_pg">
      <div
        className={`loginsignpg  ${sidebarOpen ? "sidebar-open" : "sidebar-close"
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
          <div className="rmf_inner">
            <form action="">
              <h4 className="title">
                <span>Verify your number</span>
                <br />
                +91-8770534650
              </h4>
              <div className="fl_form_field">
                <img src="./assets/img/otp_bg.png" alt="" />
                {/* <label className="floating-label" htmlFor="">
                  Enter your 4 digit OTP
                </label> */}
                <input
                  required
                  type="password"
                  pattern="\d{6}"
                  maxLength={6}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}

                />
              </div>

              <div className="checkbox_parent">
                <label>
                  Haven't received yet? &nbsp;
                  <Link to="" className="click_text">
                    Resend OTP
                  </Link>
                </label>
              </div>

              <div
                className="col-sm-12 mt-2"
                style={{
                  textAlign: "center",
                }}
              >
                <button className="theme_btn no_icon full_width btn_fill">
                  Verify & Continue
                </button>
              </div>
            </form>
            <div className="form_footer">
              {/* Already registered? &nbsp; */}
              <Link to="/propagentsignup" className="click_text">
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropagentEnterOTP;
