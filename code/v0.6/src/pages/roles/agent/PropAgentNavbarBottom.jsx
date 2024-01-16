import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const PropAgentNavbarBottom = () => {
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

  const showThirdPage = () => {
    // navigate("/agentproperties");
    navigate("/agentproperties", {
      state: {
        propSearchFilter: ''
        // eventID: props.event.Eventid,
        // eventDetails: props.event,
        // entryCount: props.event.EntryCount
      }
    });
  };
  const showMore = () => {
    navigate("/more-menu");
  };
  const logoClick = () => {
    navigate("/");
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

  // more acitve class Array 
  const moreActivePaths = ["/more-menu", "/about-us", "/contact-us", "/faq", "/propagentprivacypolicy", "/propagenttermsandcondition"];
  const shouldMoreActive = moreActivePaths.includes(location.pathname);
  const moreActiveClass = `b_menu_single ${shouldMoreActive ? "b_menu_active" : ""}`;
  // more acitve class Array 
  return (
    <section className="bottom_menu_bar">
      <div
        className={`b_menu_single ${location.pathname === "/" ? "b_menu_active" : ""
          }`}
        onClick={showHome}
      >
        <div className="menu_icon">
          <span className="material-symbols-outlined">{firstMenuIcon}</span>
        </div>
        <div className="menu_name">{firstMenu}</div>
      </div>
      <div
        className={`b_menu_single ${location.pathname === "/agentdashboard" || location.pathname === "/propagentadmindashboard" ? "b_menu_active" : ""
          }`}
        onClick={showDashboard}
      >
        <div className="menu_icon">
          <span className="material-symbols-outlined">{secondMenuIcon}</span>
        </div>
        <div className="menu_name">{secondMenu}</div>
      </div>
      <Link
        to="/profile"
        className={`b_menu_single profile ${location.pathname === "/profile" || location.pathname === "/propagentlogin" ? "b_menu_active" : ""
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
        className={`b_menu_single ${location.pathname === "/agentproperties" || location.pathname === "/agentaddproperties/new" ? "b_menu_active" : ""
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
        onClick={showMore}
      >
        <div className="menu_icon">
          <span className="material-symbols-outlined">{fourthMenuIcon}</span>
        </div>
        <div className="menu_name">{fourthMenu}</div>
      </div>
    </section>
  )
}

export default PropAgentNavbarBottom
