import { useState, useEffect } from "react";
import { useLogin } from "../../../hooks/useLogin";
import { useLocation, Link } from "react-router-dom";

// import css
import "./PropAgentLS.css";

const PropAgentLogin_old = () => {
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

  // login code
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isPending } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };
  // login code

  // password_show code
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  // password_show code
  return (
    <div className="top_header_pg">
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
          className="right_main_form min-100vh"
          style={{
            backgroundImage: "url('/assets/img/lsbg.png')",
          }}
        >
          <div className="rmf_inner">
            <form action="" onSubmit={handleSubmit}>
              <h4 className="title">Login</h4>
              <div className="fl_form_field">
                <label className="floating-label" htmlFor="">
                  Email ID
                </label>
                <input
                  required
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
              <div className="fl_form_field">
                <label className="floating-label" htmlFor="">
                  Password
                </label>
                <input
                  required
                  type={passwordVisible ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    right: "6px",
                    bottom: "6px",
                    cursor: "pointer",
                  }}
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? "visibility_off" : "visibility"}
                </span>
              </div>
              <div className="one_line">
                <div className="checkbox_parent">
                  <input type="checkbox" />
                  <label htmlFor="">Remember me</label>
                </div>
                <Link to="" className="click_text">
                  Forgot password?
                </Link>
              </div>

              <div
                className="col-sm-12 mt-2"
                style={{
                  textAlign: "center",
                }}
              >
                {!isPending && (
                  <button className="theme_btn no_icon full_width btn_fill">
                    Log in
                  </button>
                )}
                {isPending && (
                  <button
                    className="theme_btn no_icon full_width btn_fill"
                    disabled
                  >
                    Signing...
                  </button>
                )}
                {error && <div className="error">{error}</div>}
              </div>
            </form>
            <div className="form_footer">
              New to PropAgent? &nbsp;
              <Link to="/propagentsignup" className="click_text">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropAgentLogin_old;
