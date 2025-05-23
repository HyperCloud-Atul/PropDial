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
      navigate("/");
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
      navigate("/search-property");
      return; // Exit the function to prevent further checks
    }
    if (user && user.role === "admin") {
      // console.log('in user', user.role)
      navigate("/adminproperties");
    }
    if ((user && user.role === "owner") || (user && user.role === "coowner")) {
      // console.log('in user', user.role)
      navigate("/ownerdashboard_new");
    }
    if (user && user.role === "propagent") {
      // console.log('in user', user.role)
      navigate("/addproperty_quick");
    }
  };
  const showThirdPage = () => {
    if (!user) {
      // User is not logged in, navigate to "/"
      navigate("/about-us");
      return; // Exit the function to prevent further checks
    }
    if (user && user.role === "owner") {
      // console.log('in user', user.role)
      navigate("/pgpropertynew");
    }
    if (user && user.role === "propagent") {
      // console.log('in user', user.role)
      navigate("/agentproperties");
    }
  };
  const showFourthPage = () => {
    navigate("/more-menu");
  };
  //Menus as per role
  let firstMenuIcon = "";
  let firstMenu = ""; //This is for all user type
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
    firstMenuIcon = "home";
    firstMenu = "Home";
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
  if (user && user.role === "propagent") {
    secondMenuIcon = "add";
    secondMenu = "Add";
    thirdMenuIcon = "confirmation_number";
    thirdMenu = "Properties";
  }
  // more acitve class Array 
  const moreActivePaths = ["/more-menu", "/about-us", "/contact-us", "/faq",
    "/countrylist", "/statelist", "/citylist", "/localitylist", "/societylist", "/addproperty"];
  const shouldMoreActive = moreActivePaths.includes(location.pathname);
  const moreActiveClass = `b_menu_single ${shouldMoreActive ? "b_menu_active" : ""}`;
  // more acitve class Array 

  // hide page_footer array 
  const pageBottomMenuHidePaths = ["/addproperty"];
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
          className={`b_menu_single ${location.pathname === "/ownerdashboard_new" ? "b_menu_active" : ""
            }`}
          onClick={showSecondPage}
        >
          <div className="menu_icon">
            <span className="material-symbols-outlined">{secondMenuIcon}</span>
          </div>
          <div className="menu_name">{secondMenu}</div>
        </div>

        <Link
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
        </Link>
        <div
          className={`b_menu_single ${location.pathname === "/pgpropertynew" ? "b_menu_active" : ""
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
