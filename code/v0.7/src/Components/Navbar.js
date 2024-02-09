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
  function logoutSetPadding() {
    // props.setFlag(null);
    // console.log('in function logoutSetPadding', props.setFlag);
    logout();
  }

  // const [expandNavbar, setExpandNavbar] = useState(false);

  // const openNavbarMenu = () => {
  //   setExpandNavbar(true);
  // };

  // const closeNavbarMenu = () => {
  //   setExpandNavbar(false);
  // };
  const showHome = () => {
    navigate("/");
  };
  const showDashboard = () => {
    if (!user) {
      // User is not logged in, navigate to "/"
      navigate("/search-property");
      return; // Exit the function to prevent further checks
    }
    if (user && user.role === "superadmin") {
      // console.log('in superadmin', user.role)
      navigate("/superadmindashboard");
    }

    if (user && user.role === "admin") {
      // console.log('in admin', user.role)
      navigate("/admindashboard");
    }

    if ((user && user.role === "owner") || (user && user.role === "coowner")) {
      // console.log('in user', user.role)
      navigate("/ownerdashboard");
    }

    if (user && user.role === "tenant") {
      // console.log('in user', user.role)
      navigate("/tenantdashboard");
    }
    if (user && user.role === "propertymanager") {
      // console.log('in user', user.role)
      navigate("/executivedashboard");
    }
    if (user && user.role === "propagent") {
      // console.log('in user', user.role)
      navigate("/agentdashboard");
    }
  };

  const showSecondPage = () => {
    if (!user) {
      // User is not logged in, navigate to "/"
      navigate("/about-us");
      return; // Exit the function to prevent further checks
    }
    if (user && user.role === "admin") {
      // console.log('in user', user.role)
      // navigate("/adminproperties");
      navigate("/pgpropertylist");
    }
    if ((user && user.role === "owner") || (user && user.role === "coowner")) {
      // console.log('in user', user.role)
      navigate("/ownerdashboard_new");
    }
    if (user && user.role === "propagent") {
      // console.log('in user', user.role)
      navigate("/agentdashboard");
    }
  };
  const showThirdPage = () => {
    if (!user) {
      // User is not logged in, navigate to "/"
      navigate("/pgpropertynew");
      return; // Exit the function to prevent further checks
    }
    if (user && user.role === "admin") {
      // console.log('in user', user.role)
      // navigate("/adminproperties");
      navigate("/users");
    }
    if ((user && user.role === "owner") || (user && user.role === "coowner")) {
      // console.log('in user', user.role)
      navigate("/pgpropertynew");
    }
    if (user && user.role === "propagent") {
      // console.log('in user', user.role)
      navigate("/agentproperties");
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
  let fourthMenu = "";
  let fourthMenuIcon = "";
  if (!user) {
    firstMenuIcon = "home";
    firstMenu = "Home";
    secondMenuIcon = "import_contacts";
    secondMenu = "About Us";
    thirdMenuIcon = "real_estate_agent";
    thirdMenu = "Property";
  }
  if (user && user.role !== "user") {
    // firstMenuIcon = "home";
    // firstMenu = "Dashboard";
    fourthMenuIcon = "apps";
    fourthMenu = "More";
  }

  if (user && user.role === "admin") {
    secondMenuIcon = "analytics";
    secondMenu = "Properties";
    thirdMenuIcon = "confirmation_number";
    thirdMenu = "Users";
  }
  if (user && user.role === "owner") {
    secondMenuIcon = "dashboard";
    secondMenu = "Dashboard";
    // thirdMenuIcon = "support_agent";
    thirdMenuIcon = "real_estate_agent";
    thirdMenu = "Property";
  }
  if (user && user.role === "tenant") {
    secondMenu = "Rent";
    thirdMenu = "Tickets";
  }
  if (user && user.role === "propertymanager") {
    secondMenu = "Bills";
    thirdMenu = "Tickets";
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
  const moreDesktopActivePaths = ["/more-menu", "/contact-us", "/faq",
    "/countrylist", "/statelist", "/citylist", "/localitylist", "/societylist", "/addproperty"];
  const shouldMoreDesktopActive = moreDesktopActivePaths.includes(location.pathname);
  const moreDesktopActiveClass = `menu_single pointer ${shouldMoreDesktopActive ? "active" : ""}`;
  // array of more class active on desktop 

  // display navbar on top Array 
  const excludedPaths = ["/", "/about-us", "/contact-us", "/more-menu", "/faq"];
  const shouldOnTop = excludedPaths.includes(location.pathname);
  const navbarClassName = `navbarparent ${shouldOnTop ? "" : "on_top"}`;
  // display navbar on top Array 

  // array for header social media hide after login
  const socialMediaHidePaths = ["/", "aboutus", "contactus", "more-menu"];
  const shouldSocialMediaHide = socialMediaHidePaths.includes(location.pathname);
  const socialMediaClass = `menu_social_media ${shouldSocialMediaHide ? "" : "d_none"}`;
  // array for header social media hide after login 

  // hide navbar array 
  const navbarHidePaths = ["/phonelogin"];
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
                // className={`menu_single pointer ${
                //   location.pathname === "/" ||
                //   location.pathname === "/ownerdashboard" || location.pathname === "/admindashboard"
                //     ? "active"
                //     : ""
                // }`}
                className="menu_single pointer"
              >
                <span className="material-symbols-outlined">{firstMenuIcon}</span>
                {firstMenu}
              </div>

              <div
                onClick={showSecondPage}
                // className={`menu_single pointer ${
                //   location.pathname === "/search-property" || location.pathname === "/bills"? "active" : "" || location.pathname === "/pgpropertylist" ? "active" : ""
                // }`}
                className="menu_single pointer"
              >
                <span className="material-symbols-outlined">{secondMenuIcon}</span>
                {secondMenu}
              </div>

              <div
                onClick={showThirdPage}
                // className={`menu_single pointer ${
                //   location.pathname === "/about-us" || location.pathname === "/tickets" ? "active" : "" || location.pathname === "/users" ? "active" : ""
                // }`}
                className="menu_single pointer"
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
                  <span>Hi, {user.fullName}</span>
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
                <Link to="/phonelogin">
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

              {/* <div className="menu_single pointer ">
                <span className="material-symbols-outlined">
                  settings_applications
                </span>
                Services
              </div>
              <Link to="/login">
                <div
                  className={`menu_single pointer ${
                    location.pathname === "/login" ? "active" : ""
                  }`}
                >
                  <span className="material-symbols-outlined">login</span>
                  Login/Signup
                </div>
              </Link> */}
            </li>
            <li className="menu_social_media">
              <Link to="/ticketdetail">
                <img src="./assets/img/ticketicon_navbar.png" alt=""
                  className="pointer" />
              </Link>
              <Link to="/notification">
                <img src="./assets/img/notification.png" alt=""
                  className="pointer"
                  style={{
                    width: "22px",
                    height: "auto"
                  }}
                />
              </Link>

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
            </li>

            {/* {user && (
          <div className='small'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div></div>
              <li>
                <div className='navbar-notification-div'>
                  <span className="material-symbols-outlined">
                    notifications
                  </span>
                  <div></div>
                </div>
              </li>
            </div>
          </div>
        )} */}

            {/* <div className='large'> */}
            {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div></div>
            <div className='navbar-laptop-menu-links-div'>

              <div className='navbar-laptop-menu-links'>

                <div onClick={showDashboard}>
                  <span className="material-symbols-outlined">
                    {firstMenuIcon}
                  </span>
                  <h1>{firstMenu}</h1>
                </div>

                <div onClick={showSecondPage}>
                  <span className="material-symbols-outlined">
                    {secondMenuIcon}
                  </span>
                  <h1>{secondMenu}</h1>
                </div>

                <div>
                  <span className="material-symbols-outlined">
                    {thirdMenuIcon}
                  </span>
                  <h1>{thirdMenu}</h1>
                </div>          

              </div>

              {user && user.role !== 'user' &&
                <div className='navbar-laptop-menu-icons-div'>
                  <div className='navbar-user-icon'>
                    <Link to="/profile">             
                      {user.photoURL === '' ? <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/userThumbnails%2F1default.png?alt=media&token=38880453-e642-4fb7-950b-36d81d501fe2&_gl=1*1bbo31y*_ga*MTEyODU2MDU1MS4xNjc3ODEwNzQy*_ga_CW55HF8NVT*MTY4NjIzODcwMC42OS4xLjE2ODYyMzkwMjIuMC4wLjA." alt="" /> : <img src={user.photoURL} alt="" />}
                    </Link>
                  </div>

                  <li>
                    <div className='navbar-notification-div'>
                      <span className="material-symbols-outlined">
                        notifications
                      </span>
                      <div></div>
                    </div>
                  </li>          
                  <div className='navbar-laptop-menu-icons-div-hamburger-icon' onClick={showFourthPage}>
                    <span className="material-symbols-outlined">
                      menu
                    </span>
                  </div>
                </div>
              }

            </div>

          </div> */}

            {/* <div className={expandNavbar ? 'navbar-menu-expand-div open' : 'navbar-menu-expand-div'}>
            <div className='navbar-menu-expand-div-content'>
              <div className='navbar-menu-expand-div-close-btn' onClick={closeNavbarMenu}>
                <span className="material-symbols-outlined">
                  close
                </span>
              </div>

              <div className='navbar-menu-expand-div-menu'>
                <h1>Home</h1>
                <div style={{ width: '53%' }}></div>
              </div>

              <div className='navbar-menu-expand-div-menu'>
                <h1>About Us</h1>
                <div style={{ width: '85%' }}></div>
              </div>

              <div className='navbar-menu-expand-div-menu'>
                <h1>Contact Us</h1>
                <div style={{ width: '100%' }}></div>
              </div>
            </div>
          </div> */}

            {/* </div> */}

            {/* {!user && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )} */}

            {/* {user && (
          <li>
            {!isPending && <button className="btn" onClick={logout}>Logout</button>}
            {isPending && <button className="btn" disabled>Logging out...</button>}
          </li>
        )} */}
          </ul>
        </nav>
      </header>
    </div>
  );
}
