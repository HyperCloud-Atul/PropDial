import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const PropAgentNavbar = () => {
  const location = useLocation(); // Get the current location
  const { user } = useAuthContext(); // Get user from userauthcontext
  const navigate = useNavigate();

  // all menus code
  const showHome = () => {
    navigate("/");
  };

  const showDashboard = () => {
    navigate("/agentdashboard");
  };
  const agentNotification = () => {
    navigate("/propagentnotification");
  };

  const showThirdPage = () => {
    // navigate("/agentproperties");
    navigate("/agentproperties", {
      state: {
        propSearchFilter: "",
        // eventID: props.event.Eventid,
        // eventDetails: props.event,
        // entryCount: props.event.EntryCount
      },
    });
  };
  const showMore = () => {
    navigate("/more-menu");
  };
  const logoClick = () => {
    navigate("/");
  };
  const ticketDetail = () => {
    navigate("/ticketdetail");
  };

  //Menus as per role
  let firstMenuIcon = "home";
  let firstMenu = "Home";
  let secondMenuIcon = "dashboard";
  let secondMenu = "Dashboard";
  let thirdMenuIcon = "confirmation_number";
  let thirdMenu = "Properties";
  let fourthMenuIcon = "more";
  let fourthMenu = "More";

  //Menus as per role
  // all menus code

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

  const navClass = isScrolled
    ? "navbar sticky-top scrolled"
    : "navbar sticky-top";
  // Add class on scroll end

  // arrrays start

  // array of more class active on desktop
  const moreDesktopActivePaths = [
    "/more-menu",
    "/contact-us",
    "/faq",
    "/about-us",
    "/propagentprivacypolicy",
    "/propagenttermsandcondition",
  ];
  const shouldMoreDesktopActive = moreDesktopActivePaths.includes(
    location.pathname
  );
  const moreDesktopActiveClass = `menu_single pointer ${shouldMoreDesktopActive ? "active" : ""
    }`;
  // array of more class active on desktop

  // display navbar on top Array
  const excludedPaths = ["/", "/about-us", "/contact-us", "/faq"];
  const shouldOnTop = excludedPaths.includes(location.pathname);
  const navbarClassName = `navbarparent ${shouldOnTop ? "" : "on_top"}`;
  // display navbar on top Array

  // array for header social media hide after login
  const socialMediaHidePaths = ["/", "aboutus", "contactus", "more-menu"];
  const shouldSocialMediaHide = socialMediaHidePaths.includes(
    location.pathname
  );
  const socialMediaClass = `menu_social_media ${shouldSocialMediaHide ? "" : ""
    }`;
  // array for header social media hide after login

  // arrrays  end
  return (
    <header className={navbarClassName}>
      <nav className={navClass}>
        <ul>
          <li className="logo pointer" onClick={logoClick}>
            <img src="/assets/img/logo_propagent.png" alt="logo" />
          </li>
          <li className="main_menus">
            <div
              onClick={showHome}
              className={`menu_single pointer ${location.pathname === "/" ? "active" : ""
                }`}
            >
              <span className="material-symbols-outlined">{firstMenuIcon}</span>
              {firstMenu}
            </div>
            <div
              onClick={showDashboard}
              className={`menu_single pointer ${location.pathname === "/agentdashboard" ||
                  location.pathname === "/propagentadmindashboard"
                  ? "active"
                  : ""
                }`}
            >
              <span className="material-symbols-outlined">
                {secondMenuIcon}
              </span>
              {secondMenu}
            </div>
            <div
              onClick={showThirdPage}
              className={`menu_single pointer ${location.pathname === "/agentproperties" ? "active" : ""
                }`}
            >
              <span className="material-symbols-outlined">{thirdMenuIcon}</span>
              {thirdMenu}
            </div>
            <div className={moreDesktopActiveClass} onClick={showMore}>
              <span className="material-symbols-outlined">
                {fourthMenuIcon}
              </span>
              {fourthMenu}
            </div>
            {user ? (
              <Link
                to="/profile"
                className={`menu_single profile pointer ${location.pathname === "/profile" ? "active" : ""
                  }`}
              >
                <span>Hi, {user.displayName}</span>
                <div className="user_img">
                  {user.photoURL === "" ? (
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/userThumbnails%2F1default.png?alt=media&token=38880453-e642-4fb7-950b-36d81d501fe2&_gl=1*1bbo31y*_ga*MTEyODU2MDU1MS4xNjc3ODEwNzQy*_ga_CW55HF8NVT*MTY4NjIzODcwMC42OS4xLjE2ODYyMzkwMjIuMC4wLjA."
                      alt=""
                    />
                  ) : (
                    <img src={user.photoURL} alt="" />
                  )}
                </div>
              </Link>
            ) : (
              <Link to="/propagentlogin">
                <div
                  className={`menu_single login pointer ${location.pathname === "/propagentlogin" ? "active" : ""
                    }`}
                >
                  <span className="material-symbols-outlined ba_animation">
                    login
                  </span>
                  Login
                </div>
              </Link>
            )}
          </li>
          <li className={socialMediaClass}>
            {/* <Link
                            className="msm_single pointer"
                            to="https://www.facebook.com/propdial"
                        >
                            <img src="/assets/img/facebook.png"></img>
                        </Link>
                        <Link
                            className="msm_single pointer"
                            to="https://www.youtube.com/channel/UC9cJZCtePKupvCVhRoimjlg"
                        >
                            <img src="/assets/img/youtube.png"></img>
                        </Link>
                        <Link
                            className="msm_single pointer"
                            to="https://www.linkedin.com/company/propdial-india-pvt-ltd-/"
                        >
                            <img src="/assets/img/linkedin.png"></img>
                        </Link>
                        <Link
                            className="msm_single pointer"
                            to="https://twitter.com/i/flow/login?redirect_after_login=%2Fpropdial"
                        >
                            <img src="/assets/img/twitter.png"></img>
                        </Link> */}
            <span className="material-symbols-outlined pointer" onClick={ticketDetail}>
              airplane_ticket
            </span>
            <span
              className="material-symbols-outlined pointer"
              onClick={agentNotification}
            >
              notifications
            </span>
            {/* <img src="./assets/gif/alarm.gif" alt="" style={{
                            width: "32px"
                        }}  /> */}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default PropAgentNavbar;
