import { Link, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

// styles & images
import "./Navbar.css";

export default function Navbar() {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const showHome = () => {
    navigate("/");
  };
  const showDashboard = () => {
    if (!user) {
      // User is not logged in, navigate to "/"
      navigate("/search-property");
      return; // Exit the function to prevent further checks
    }
    else {
      navigate("/dashboard");
    }
  };

  const showSecondPage = () => {
    if (!user) {
      // User is not logged in, navigate to "/"
      navigate("/properties");
      return; // Exit the function to prevent further checks
    }
    else {
      navigate("/dashboard");
    }
  };
  const showThirdPage = () => {
    if (!user) {
      // User is not logged in, navigate to "/"
      navigate("/about-us");
      return; // Exit the function to prevent further checks
    }
    else {
      navigate("/contact-us");
    }
  };

  const showFourthPage = () => {
    navigate("/more");
  };
  const logoClick = () => {
    navigate("/");
  };

  //Menus as per role
  let firstMenuIcon = "home";
  let firstMenu = "Home"; //This is for all user type
  let secondMenuIcon = "";
  let secondMenu = "";
  let thirdMenuIcon = "";
  let thirdMenu = "";

  if (!user) {
    // firstMenuIcon = "home";
    // firstMenu = "Home";
    secondMenuIcon = "real_estate_agent";
    secondMenu = "Property";
    thirdMenuIcon = "import_contacts";
    thirdMenu = "About Us";
  }

  if (user && user.role === "admin") {
    secondMenuIcon = "dashboard";
    secondMenu = "Dashboard";
    thirdMenuIcon = "headset_mic";
    thirdMenu = "Contact";
  }
  if (user && user.role === "owner") {
    secondMenuIcon = "dashboard";
    secondMenu = "Dashboard";
    thirdMenuIcon = "real_estate_agent";
    thirdMenu = "Contact";
  }
  if (user && user.role === "tenant") {
    secondMenuIcon = "dashboard";
    secondMenu = "Dashboard";
    thirdMenuIcon = "real_estate_agent";
    thirdMenu = "Contact";
  }
  if (user && user.role === "propertymanager") {
    secondMenuIcon = "dashboard";
    secondMenu = "Dashboard";
    thirdMenuIcon = "real_estate_agent";
    thirdMenu = "Contact";
  }


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
  const moreDesktopActivePaths = ["/more-menu", "/faq",
    "/countrylist", "/statelist", "/citylist", "/localitylist", "/societylist", "/newproperty"];
  const shouldMoreDesktopActive = moreDesktopActivePaths.includes(location.pathname);
  const moreDesktopActiveClass = `menu_single pointer ${shouldMoreDesktopActive ? "active" : ""}`;
  // array of more class active on desktop 

  // display navbar on top Array 
  const excludedPaths = ["/", "/about-us", "/contact-us", "/faq"];
  const shouldOnTop = excludedPaths.includes(location.pathname);
  const navbarClassName = `navbarparent ${shouldOnTop ? "" : "on_top"}`;
  // display navbar on top Array 

  // array for header social media hide after login
  const socialMediaHidePaths = ["/", "aboutus", "contactus", "more-menu"];
  const shouldSocialMediaHide = socialMediaHidePaths.includes(location.pathname);
  const socialMediaClass = `menu_social_media ${shouldSocialMediaHide ? "" : "d_none"}`;
  // array for header social media hide after login 

  // hide navbar array 
  // const navbarHidePaths = ["/login"];
  const navbarHidePaths = [""];
  const shouldNavbarHide = navbarHidePaths.includes(location.pathname);
  const navbarHideClass = `${shouldNavbarHide ? "navbarhide" : ""}`;
  // hide navbar array 


  // arrrays  end
  return (
    <div className={navbarHideClass}>
      <header className={navbarClassName}>
        <nav className={navClass}>
          <ul>
            <li className="logo pointer" onClick={logoClick}>
              <img src="/assets/img/logo_propdial.png" alt="logo" />
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
                onClick={showSecondPage}
                className={`menu_single pointer ${location.pathname === "/dashboard" ? "active" : ""
                  }`}
              >
                <span className="material-symbols-outlined">{secondMenuIcon}</span>
                {secondMenu}
              </div>

              <div
                onClick={showThirdPage}
                className={`menu_single pointer ${location.pathname === "/contact-us" ? "active" : ""
                  }`}
              >
                <span className="material-symbols-outlined">{thirdMenuIcon}</span>
                {thirdMenu}
              </div>

              <Link to="/more-menu">
                <div
                  className={moreDesktopActiveClass}
                >
                  <span className="material-symbols-outlined">More</span>
                  More
                </div>
              </Link>
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
                <Link to="/login">
                  <div
                    className={`menu_single login pointer ${location.pathname === "/login" ? "active" : ""
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
            <li className="menu_social_media">
              <Link to="/ticketdetail">
                <img src="./assets/img/home/ticketicon_navbar.png" alt=""
                  className="pointer" />
              </Link>
              <Link to="/notification">
                <img src="./assets/img/home/notification.png" alt=""
                  className="pointer"
                  style={{
                    width: "22px",
                    height: "auto"
                  }}
                />
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
