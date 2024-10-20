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
    } else if (user.role === "admin" || user.role === "superAdmin") {
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
    secondMenuIcon = "real_estate_agent";
    secondMenu = "Property";
    thirdMenuIcon = "import_contacts";
    thirdMenu = "About Us";
  }

  if (user && (user.role === "admin" || user.role === "superAdmin")) {
    secondMenuIcon = "dashboard";
    secondMenu = "Dashboard";
    thirdMenuIcon = "real_estate_agent";
    thirdMenu = "Properties";
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
            <span className="material-symbols-outlined">home</span>
          </div>
          <div className="menu_name">{firstMenu}</div>
        </div>
        <div
          className={`b_menu_single ${location.pathname === "/properties" || location.pathname === "/dashboard" ? "b_menu_active" : ""
            }`}
          onClick={showSecondPage}
        >
          <div className="menu_icon">
            <span className="material-symbols-outlined">{secondMenuIcon}</span>
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
                <span className="material-symbols-outlined">person</span>
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
                  <span className="material-symbols-outlined">person</span>
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
            <span className="material-symbols-outlined">{thirdMenuIcon}</span>
          </div>
          <div className="menu_name">{thirdMenu}</div>
        </div>
        <div
          className={moreActiveClass}
          onClick={showFourthPage}
        >
          <div className="menu_icon">
            <span className="material-symbols-outlined">menu</span>
          </div>
          <div className="menu_name">More</div>
        </div>
      </section>
    </div>
  );
}
