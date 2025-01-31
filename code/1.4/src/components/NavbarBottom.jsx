import React from "react";
import { Link, useLocation } from "react-router-dom";

import "./NavbarBottom.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { ShowChartOutlined } from "@mui/icons-material";

export default function NavbarBottom() {
  const location = useLocation(); // Get the current location
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const showProfile = () => {
    navigate("/profile");
  };

  const showDashboard = () => {
    if (!user) {
      // User is not logged in, navigate to "/"
      navigate("/");
      return; // Exit the function to prevent further checks
    }
    else {
      navigate("/");
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
      // User is not logged in, navigate to "/about-us"
      navigate("/about-us");
      return; // Exit the function to prevent further checks
    } else if (user.role === "admin" || user.role === "superAdmin" || user.role === "executive") {
      // User is logged in and role is admin, navigate to "/properties"
      navigate("/allproperties/all");
    } else {
      // User is logged in but not an admin, navigate to "/contact-us"
      navigate("/contact-us");
    }
  };


  const showFourthPage = () => {
    navigate("/more-menu");
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
    secondMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6304"><path d="M760-400v-260L560-800 360-660v60h-80v-100l280-200 280 200v300h-80ZM560-800Zm20 160h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z" /></svg>;
    secondMenu = "Property";
    thirdMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6304"><path d="M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z" /></svg>;
    thirdMenu = "About Us";
  }

  if (user && (user.role === "admin" || user.role === "superAdmin" || user.role === "executive")) {
    secondMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6304"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" /></svg>;
    secondMenu = "Dashboard";
    thirdMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6304"><path d="M760-400v-260L560-800 360-660v60h-80v-100l280-200 280 200v300h-80ZM560-800Zm20 160h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z" /></svg>;
    thirdMenu = "Properties";
  }
  if (user && user.role === "owner") {
    secondMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6304"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" /></svg>;
    secondMenu = "Dashboard";
    thirdMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6304"><path d="M760-400v-260L560-800 360-660v60h-80v-100l280-200 280 200v300h-80ZM560-800Zm20 160h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z" /></svg>;
    thirdMenu = "Contact";
  }
  if (user && user.role === "tenant") {
    secondMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6304"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" /></svg>;
    secondMenu = "Dashboard";
    thirdMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6304"><path d="M760-400v-260L560-800 360-660v60h-80v-100l280-200 280 200v300h-80ZM560-800Zm20 160h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z" /></svg>;
    thirdMenu = "Contact";
  }
  if (user && user.role === "manager") {
    secondMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6304"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" /></svg>;
    secondMenu = "Dashboard";
    thirdMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6304"><path d="M760-400v-260L560-800 360-660v60h-80v-100l280-200 280 200v300h-80ZM560-800Zm20 160h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z" /></svg>;
    thirdMenu = "Contact";
  }

  // more acitve class Array 
  const moreActivePaths = ["/more-menu", "/faq",
    "/countrylist", "/statelist", "/citylist", "/localitylist", "/societylist", "/newproperty"];
  const shouldMoreActive = moreActivePaths.includes(location.pathname);
  const moreActiveClass = `b_menu_single ${shouldMoreActive ? "b_menu_active" : ""}`;
  // more acitve class Array 

  // hide page_footer array 
  const pageBottomMenuHidePaths = ["/newproperty"];
  const shouldPageFooerHide = pageBottomMenuHidePaths.includes(location.pathname);
  const pageBottomMenuClass = `${shouldPageFooerHide ? "page_footer_hide" : ""}`;
  // hide page_footer array 
  return (

    <div className={pageBottomMenuClass}>
      <section className="bottom_menu_bar">
        <div
          className={`b_menu_single ${location.pathname === "/" ? "b_menu_active" : "" || location.pathname === "/agentdashboard" ? "b_menu_active" : ""
            }`}
          onClick={showDashboard}
        >
          <div className="menu_icon">
            {/* <span className="material-symbols-outlined">home</span> */}
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6304"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" /></svg>
            {/* <span className="menu_icon">
              <img src="/assets/material-icons/home.svg" alt=""></img>
            </span> */}
          </div>
          <div className="menu_name">{firstMenu}</div>
        </div>
        <div
          className={`b_menu_single ${location.pathname === "/properties" || location.pathname === "/dashboard" ? "b_menu_active" : ""
            }`}
          onClick={showSecondPage}
        >
          <div className="menu_icon">
            {/* <span className="material-symbols-outlined"></span> */}
            {secondMenuIcon}
          </div>
          <div className="menu_name">{secondMenu}</div>
        </div>

        {user ? (<Link
          to="/profile"
          className={`b_menu_single profile ${location.pathname === "/profile" ? "b_menu_active" : ""
            }`}
        >
          <div className="menu_icon">
            {user ?
              (user.photoURL === "" ? (
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/userThumbnails%2F1default.png?alt=media&token=38880453-e642-4fb7-950b-36d81d501fe2&_gl=1*1bbo31y*_ga*MTEyODU2MDU1MS4xNjc3ODEwNzQy*_ga_CW55HF8NVT*MTY4NjIzODcwMC42OS4xLjE2ODYyMzkwMjIuMC4wLjA."
                  alt=""
                />
              ) : (
                <img src={user.photoURL} alt="" />
              ))
              :
              (
                // <span className="material-symbols-outlined">person</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" /></svg>
              )
            }
          </div>
        </Link>) :
          (<Link
            to="/login"
            className={`b_menu_single profile ${location.pathname === "/profile" ? "b_menu_active" : ""
              }`}
          >
            <div className="menu_icon">
              {user ?
                (user.photoURL === "" ? (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/userThumbnails%2F1default.png?alt=media&token=38880453-e642-4fb7-950b-36d81d501fe2&_gl=1*1bbo31y*_ga*MTEyODU2MDU1MS4xNjc3ODEwNzQy*_ga_CW55HF8NVT*MTY4NjIzODcwMC42OS4xLjE2ODYyMzkwMjIuMC4wLjA."
                    alt=""
                  />
                ) : (
                  <img src={user.photoURL} alt="" />
                ))
                :
                (
                  // <span className="material-symbols-outlined">person</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" /></svg>
                )
              }
            </div>
          </Link>)
        }
        <div
          className={`b_menu_single ${location.pathname === "/about-us" || location.pathname === "/contact-us" || location.pathname === "/allproperties/all" ? "b_menu_active" : ""
            }`}
          onClick={showThirdPage}
        >
          <div className="menu_icon">
            {/* <span className="material-symbols-outlined"></span> */}
            {thirdMenuIcon}
          </div>
          <div className="menu_name">{thirdMenu}</div>
        </div>
        <div
          className={moreActiveClass}
          onClick={showFourthPage}
        >
          <div className="menu_icon">
            {/* <span className="material-symbols-outlined">menu</span> */}
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6304"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
          </div>
          <div className="menu_name">More</div>
        </div>
      </section>
      {/* <div className="bottom_punch_in">
        <div className="theme_btn btn_fill no_icon text-center w-100">
          Punch In
        </div>
      </div> */}
    </div>
  );
}
