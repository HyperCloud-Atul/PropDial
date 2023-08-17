import React from "react";
import { Link, useLocation } from "react-router-dom";

import "./NavbarBottom.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function NavbarBottom() {
  const location = useLocation(); // Get the current location
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const showProfile = () => {
    navigate("/profile");
  };

  const showDashboard = () => {
    if (user && user.role === "superadmin") {
      // console.log('in superadmin', user.role)
      navigate("/superadmindashboard");
    }

    if (user && user.role === "admin") {
      // console.log('in admin', user.role)
      navigate("/admindashboard");
    }

    if (user && user.role === "owner") {
      // console.log('in user', user.role)
      navigate("/ownerdashboard");
    }

    if (user && user.role === "tenant") {
      // console.log('in user', user.role)
      navigate("/tenantdashboard");
    }
    if (user && user.role === "executive") {
      // console.log('in user', user.role)
      navigate("/executivedashboard");
    }
  };

  const showSecondPage = () => {
    if (user && user.role === "admin") {
      // console.log('in user', user.role)
      navigate("/adminproperties");
    }
    if (user && user.role === "owner") {
      // console.log('in user', user.role)
      navigate("/bills");
    }
  };

  const showFourthPage = () => {
    navigate("/more");
  };
const searchpage = () => {
  navigate("/search-property")
}
const homepage = () => {
  navigate("/")
}
  //Menus as per role
  let firstMenuIcon = "";
  let firstMenu = ""; //This is for all user type
  let secondMenuIcon = "";
  let secondMenu = "";
  let thirdMenuIcon = "";
  let thirdMenu = "";
  let fourthMenu = "";
  let fourthMenuIcon = "";
  if (user && user.role !== "user") {
    firstMenuIcon = "home";
    firstMenu = "Dashboard";
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
    secondMenuIcon = "receipt_long";
    secondMenu = "Bills";
    thirdMenuIcon = "support_agent";
    thirdMenu = "Tickets";
  }
  if (user && user.role === "tenant") {
    secondMenu = "Rent";
    thirdMenu = "Tickets";
  }
  if (user && user.role === "executive") {
    secondMenu = "Bills";
    thirdMenu = "Tickets";
  }

  return (
    // <div className="small navbar-mobile-bottom">
    //     <div className="navbar-mobile-bottom-menu" id="divBottomNavBar">
    //         <div className="navbar-mobile-bottom-menu-a"
    //             style={{ display: 'flex', flexDirection: 'column' }} onClick={showDashboard} >
    //             <span className="material-symbols-outlined">
    //                 {firstMenuIcon}
    //             </span>
    //             <small>{firstMenu}</small>
    //         </div>
    //         <div className="navbar-mobile-bottom-menu-a "
    //             style={{ display: 'flex', flexDirection: 'column' }} onClick={showSecondPage}>
    //             <span className="material-symbols-outlined">
    //                 {secondMenuIcon}
    //             </span>
    //             <small>{secondMenu}</small>
    //         </div>
    //         <a href="/">
    //         </a>
    //         <div to="/" className="navbar-mobile-bottom-menu-a "
    //             style={{ display: 'flex', flexDirection: 'column' }}>
    //             <span className="material-symbols-outlined">
    //                 {thirdMenuIcon}
    //             </span>
    //             <small>{thirdMenu}</small>
    //         </div>
    //         <div className="navbar-mobile-bottom-menu-a"
    //             style={{ display: 'flex', flexDirection: 'column' }} onClick={showFourthPage}>
    //             <span className="material-symbols-outlined">
    //                 {fourthMenuIcon}
    //             </span>
    //             <small>{fourthMenu}</small>
    //         </div>
    //     </div>
    //     <Link to="/profile" className="new-user " >
    //         <span className="material-symbols-outlined">
    //             person
    //         </span>
    //     </Link>
    // </div>
    <section className="bottom_menu_bar">
      <div className={`b_menu_single ${location.pathname === "/" ? "b_menu_active" : ""}`} onClick={homepage}>
        <div className="menu_icon">
          <span class="material-symbols-outlined">home</span>
        </div>
        <div className="menu_name">Home</div>
      </div>
      <div className="b_menu_single">
        <div className="menu_icon">
          <span class="material-symbols-outlined">settings_applications</span>
        </div>
        <div className="menu_name">Services</div>
      </div>
      <div className={
        `b_menu_single search ${location.pathname === "/search-property" ? "b_menu_active" : ""}`
      } onClick={searchpage}>
        <div className="menu_icon">
          <span class="material-symbols-outlined">search</span>
        </div>
        {/* <div className="menu_name">Home</div> */}
      </div>
      <div className="b_menu_single">
        <div className="menu_icon">
          <span class="material-symbols-outlined">contacts</span>
        </div>
        <div className="menu_name">Contact</div>
      </div>
      <div className="b_menu_single">
        <div className="menu_icon">
          <span class="material-symbols-outlined">apps</span>
        </div>
        <div className="menu_name">More</div>
      </div>
    </section>
  );
}
