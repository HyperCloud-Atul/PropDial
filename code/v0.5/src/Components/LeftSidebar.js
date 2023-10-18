import { React, useState } from "react";
import "./LeftSidebar.css";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const LeftSidebar = () => {
  const location = useLocation(); // Get the current location
  //   add class when click on toggle
  const [leftSidebar, setLeftSidebar] = useState(false); // State to track advanced search
  const sidebarToggle = () => {
    setLeftSidebar(!leftSidebar);
  };
  //   add class when click on advance toggle
  const { user } = useAuthContext();
  const navigate = useNavigate(); 


  const showLDashboard = () => {   
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

  const showSecondMenu = () => {
    if (user && user.role === "admin") {
      // console.log('in user', user.role)
      // navigate("/adminproperties");
      navigate("/users");
    }
    if (user && user.role === "owner") {
      // console.log('in user', user.role)
      navigate("/bills");
    }
  };
  const showThirdMenu = () => { 
    if (user && user.role === "admin") {
      // console.log('in user', user.role)
      // navigate("/adminproperties");
      navigate("/pgpropertylist");
    }
    if (user && user.role === "owner") {
      // console.log('in user', user.role)
      navigate("/tickets");
    }
  };

  const showFourthMenu = () => {
    if (user && user.role === "admin") {
      // console.log('in user', user.role)
      // navigate("/adminproperties");
      navigate("/addproperty_old");
    }
    if (user && user.role === "owner") {
      // console.log('in user', user.role)
      navigate("");
    }
  };
  const showFifthMenu = () => {
    if (user && user.role === "admin") {
      // console.log('in user', user.role)
      // navigate("/adminproperties");
      navigate("/pgsearch");
    }
    if (user && user.role === "owner") {
      // console.log('in user', user.role)
      navigate("");
    }
  };

  //Menus as per role
  let firstMenuIcon = "home";
  let firstMenu = ""; //This is for all user type
  let secondMenuIcon = "";
  let secondMenu = "";
  let thirdMenuIcon = "";
  let thirdMenu = "";
  let fourthMenu = "";
  let fourthMenuIcon = "";
  let fifthMenu = "";
  let fifthMenuIcon = "";


  if (user && user.role === "admin") {  
    firstMenu = "Admin Dashboard";
    secondMenuIcon = "account_box";
    secondMenu = "User List";
    thirdMenuIcon = "description";
    thirdMenu = "Property List";
    fourthMenuIcon = "add";
    fourthMenu = "Add Property"
    fifthMenuIcon = "search"
    fifthMenu = "Search"
  }
  if (user && user.role === "owner") {
    firstMenu = "Owner Dashboard";
    secondMenuIcon = "receipt_long";
    secondMenu = "Bills";
    thirdMenuIcon = "support_agent";
    thirdMenu = "Tickets";
    fourthMenuIcon = "";
    fourthMenu = ""
    fifthMenuIcon = ""
    fifthMenu = ""
  }
  if (user && user.role === "tenant") {
    firstMenu = "Tenant Dashboard";
    secondMenu = "Rent";
    thirdMenu = "Tickets";
  }
  if (user && user.role === "executive") {
    firstMenu = "";
    secondMenu = "Bills";
    thirdMenu = "Tickets";
  }

  return (
    <div class={`sidebarparent ${leftSidebar ? "baropen" : ""}`}>
      <div className="sidebartoggle" onClick={sidebarToggle}>
        <span class="material-symbols-outlined">menu</span>
      </div>
      <div className="sidebarwidth">
        <div class="side-navbar side-navbar-large property-list-side-navbar">
          <br />
          <ul>
            <li
              className={`pointer ${
                location.pathname === "/admindashboard" ? "active" : "" || location.pathname === "/ownerdashboard" ? "active" : ""
              }`}
              onClick={showLDashboard}
            >
              <b></b>
              <b></b>
              <div className="sn_menu">
                <span class="material-symbols-outlined">{firstMenuIcon}</span>
                <small>
                  {firstMenu}
                </small>
              </div>
            </li>
            <li
              className={`sb_menu pointer ${
                location.pathname === "/users" ? "active" : "" || location.pathname === "/bills" ? "active" : ""
              }`}
              onClick={showSecondMenu}
            >
              <b></b>
              <b></b>

              <div className="sn_menu">
                <span class="material-symbols-outlined"> {secondMenuIcon} </span>
                <small> {secondMenu} </small>
              </div>
            </li>
            <li
              className={`sb_menu pointer ${
                location.pathname === "/pgpropertylist" ? "active" : "" || location.pathname === "/tickets" ? "active" : ""
              }`}
              onClick={showThirdMenu}
            >
              <b></b>
              <b></b>

              <div className="sn_menu">
                <span class="material-symbols-outlined"> {thirdMenuIcon} </span>
                <small> {thirdMenu} </small>
              </div>
            </li>
            <li
              className={`sb_menu pointer ${
                location.pathname === "/addproperty_old" ? "active" : ""
              }`}
              onClick={showFourthMenu}
            >
              <b></b>
              <b></b>

              <div className="sn_menu">
                <span class="material-symbols-outlined"> {fourthMenuIcon} </span>
                <small> {fourthMenu} </small>
              </div>
            </li>
            <li
              className={`sb_menu pointer ${
                location.pathname === "/pgsearch" ? "active" : ""
              }`}
              onClick={showFifthMenu}
            >
              <b></b>
              <b></b>

              <div className="sn_menu">
                <span class="material-symbols-outlined"> {fifthMenuIcon} </span>
                <small> {fifthMenu} </small>
              </div>
            </li>
            <li className="pointer">
              <b></b>
              <b></b>
              <div className="sn_menu">
                <span class="material-symbols-outlined">handyman</span>
                <small>Enquiries</small>
              </div>
            </li>
            <li className="pointer">
              <b></b>
              <b></b>
              <div className="sn_menu">
                <span class="material-symbols-outlined">
                  volunteer_activism
                </span>
                <small>Refer & Earn</small>
              </div>
            </li>
            <li className="pointer">
              <b></b>
              <b></b>
              <div className="sn_menu">
                <span class="material-symbols-outlined">logout</span>
                <small>Logout</small>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
