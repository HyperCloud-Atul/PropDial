import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";
import DarkModeToggle from "react-dark-mode-toggle";
import { useLogout } from "../../hooks/useLogout";
import Popup from "../../components/Popup";

// css
import "./PGMoreMenu.css";

// components
import Hero from "../../components/Hero";

const PGMoreMenu = () => {
  // get user from useauthcontext
  const { user } = useAuthContext();
  // get user from useauthcontext a

  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();

  // Scroll to the top of the page whenever the location changes end

  const { logout, isPending } = useLogout();
  //Popup Flags
  const [showPopupFlag, setShowPopupFlag] = useState(false);
  const [popupReturn, setPopupReturn] = useState(false);

  const { document: appTypeDocument, error: appTypeDocumentError } =
    useDocument("settings", "AppType");
  const { document: appDisplayMode, error: appDisplayModeerror } = useDocument(
    "settings",
    "mode"
  );
  const { updateDocument, deleteDocument } = useFirestore("settings");

  useEffect(() => {
    if (popupReturn) {
      //Logout
      logout();
    }

    window.scrollTo(0, 0);
  }, [popupReturn, location]);

  //Popup Flags
  const showPopup = async (e) => {
    e.preventDefault();
    setShowPopupFlag(true);
    setPopupReturn(false);
  };

  // START CODE FOR LIGHT/DARK MODE
  const toggleDarkMode = async (productId, currentModeStatus) => {
    // Calculate the new mode based on the current mode status
    const newDisplayMode = currentModeStatus === "light" ? "dark" : "light";

    // Update the mode in Firestore
    const updatedDocument = await updateDocument(productId, {
      displayMode: newDisplayMode,
    });

    // If the update is successful, update the local state
    if (updatedDocument && updatedDocument.success) {
      // setIsDarkMode(newDisplayMode === "dark");
      console.log("Mode status updated successfully");
    } else {
      console.error("Error updating mode status");
    }
  };

  // DARK\LIGHT CODE FOR CUSTOMER LOCAL STAORAGE
  const toggleUserDarkMode = async () => {
    // Retrieving a value from localStorage
    const currentModeStatus = localStorage.getItem("mode");

    const newDisplayMode = currentModeStatus === "light" ? "dark" : "light";
    // Storing a value in localStorage
    localStorage.setItem("mode", newDisplayMode);

    window.dispatchEvent(new Event("storage"));
  };
  // END CODE FOR LIGHT/DARK MODE

  return (
    <div className="pgmoremenu pg_bg ">
      {/* Popup Component */}
      <Popup
        showPopupFlag={showPopupFlag}
        setShowPopupFlag={setShowPopupFlag}
        setPopupReturn={setPopupReturn}
        msg={"Are you sure you want to logout?"}
      />
      <Hero
        pageTitle="Locate Everything"
        pageSubTitle="Explore more for better understanding"
        heroImage="./assets/img/more_banner.jpg"
      ></Hero>

      <div className="more-menus sect_padding">
        <div className="container">
          <div className="dvg22"></div>
          {user && user.role === "owner" && (
            <section className="more_quick_card card_shadow card_border_radius bg_white">
              <Link className="mqc_single" to="/dashboard">
                <div className="icon click_icon">
                  {/* <span className="material-symbols-outlined">dashboard</span> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#00a8a8"
                  >
                    <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
                  </svg>
                </div>
                <h6 className="dr16 click_text">Dashboard</h6>
              </Link>
              <Link className="mqc_single" to="/profile">
                <div className="icon click_icon">
                  {/* <span className="material-symbols-outlined">person</span> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#00a8a8"
                  >
                    <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                  </svg>
                </div>
                <h6 className="dr16 click_text">My account</h6>
              </Link>
              <Link className="mqc_single" to="/notification">
                <div className="icon click_icon">
                  {/* <span className="material-symbols-outlined">
                    notifications
                  </span> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#00a8a8"
                  >
                    <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
                  </svg>
                </div>
                <h6 className="dr16 click_text">Notifications</h6>
              </Link>
            </section>
          )}
          {user && (user.role === "admin" || user.role === "superAdmin") && (
            <section className="more_quick_card card_shadow card_border_radius bg_white">
              <Link className="mqc_single" to="/dashboard">
                <div className="icon click_icon">
                  {/* <span className="material-symbols-outlined">dashboard</span> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#00a8a8"
                  >
                    <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
                  </svg>
                </div>
                <h6 className="dr16 click_text">Dashboard</h6>
              </Link>
              <Link className="mqc_single" to="/profile">
                <div className="icon click_icon">
                  {/* <span className="material-symbols-outlined">person</span> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#00a8a8"
                  >
                    <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                  </svg>
                </div>
                <h6 className="dr16 click_text">My account</h6>
              </Link>
              <Link className="mqc_single" to="/notification">
                <div className="icon click_icon">
                  {/* <span className="material-symbols-outlined">
                    notifications
                  </span> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#00a8a8"
                  >
                    <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
                  </svg>
                </div>
                <h6 className="dr16 click_text">Notifications</h6>
              </Link>
            </section>
          )}

          {/* Admin cards */}
          {user && (user.role === "admin" || user.role === "superAdmin") && (
            <div className="admin_div">
              <div className="dvg22"></div>
              <section className="mm_inner mm_inner_full_width card_shadow card_border_radius bg_white">
                <h6 className="title dm20 light_black">Admin</h6>
                <div className="inner">
                  <Link className="mm_single" to="/newproperty">
                    {/* <span className="material-symbols-outlined mms_icon">
                      add
                    </span> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </svg>
                    <h5 className="dr16">add property</h5>
                    <h6>Easily list your property</h6>
                    {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>                  */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mms_ra"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                    </svg>
                  </Link>

                  <Link className="mm_single coming_soon r0" to="">
                    {/* <span className="material-symbols-outlined mms_icon">
                      receipt_long
                    </span> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm-40 0v-80 80Z" />
                    </svg>
                    <h5 className="dr16"> add bills </h5>
                    <h6>
                      Enter and manage your billing information and payments
                    </h6>
                    {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mms_ra"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                    </svg>
                  </Link>
                  <Link className="mm_single" to="/allproperties/all">
                    {/* <span className="material-symbols-outlined mms_icon">
                      real_estate_agent
                    </span> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M760-400v-260L560-800 360-660v60h-80v-100l280-200 280 200v300h-80ZM560-800Zm20 160h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z" />
                    </svg>
                    <h5 className="dr16">property lists</h5>
                    <h6>
                      View and manage the complete list of available properties
                    </h6>
                    {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mms_ra"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                    </svg>
                  </Link>
                  <Link className="mm_single coming_soon r0" to="">
                    {/* <span className="material-symbols-outlined mms_icon">
                      confirmation_number
                    </span> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480q0 17 11.5 28.5T480-440Zm0-160q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm320 440H160q-33 0-56.5-23.5T80-240v-160q33 0 56.5-23.5T160-480q0-33-23.5-56.5T80-560v-160q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v160q-33 0-56.5 23.5T800-480q0 33 23.5 56.5T880-400v160q0 33-23.5 56.5T800-160Zm0-80v-102q-37-22-58.5-58.5T720-480q0-43 21.5-79.5T800-618v-102H160v102q37 22 58.5 58.5T240-480q0 43-21.5 79.5T160-342v102h640ZM480-480Z" />
                    </svg>
                    <h5 className="dr16">Manage tickets</h5>
                    <h6>
                      Oversee and respond to all support tickets and inquiries
                    </h6>
                    {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mms_ra"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                    </svg>
                  </Link>
                  <Link className="mm_single coming_soon r0" to="">
                    {/* <span className="material-symbols-outlined mms_icon">
                      payments
                    </span> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" />
                    </svg>
                    <h5 className="dr16">PMS Payment</h5>
                    <h6> Manage and process your PMS payments.</h6>
                    {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mms_ra"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                    </svg>
                  </Link>
                  <Link className="mm_single" to="/enquiry/all">
                    {/* <span className="material-symbols-outlined mms_icon">
                      headphones
                    </span> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M360-120H200q-33 0-56.5-23.5T120-200v-280q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480v280q0 33-23.5 56.5T760-120H600v-320h160v-40q0-117-81.5-198.5T480-760q-117 0-198.5 81.5T200-480v40h160v320Zm-80-240h-80v160h80v-160Zm400 0v160h80v-160h-80Zm-400 0h-80 80Zm400 0h80-80Z" />
                    </svg>
                    <h5 className="dr16">Enquiry</h5>
                    <h6>
                      View and respond to all customer enquiries and leads
                    </h6>
                    {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mms_ra"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                    </svg>
                  </Link>
                  <Link className="mm_single" to="/agents">
                    {/* <span className="material-symbols-outlined mms_icon">
                      group
                    </span> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
                    </svg>
                    <h5 className="dr16">agent list</h5>
                    <h6>View and manage all registered agent</h6>
                    {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mms_ra"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                    </svg>
                  </Link>
                </div>
              </section>
            </div>
          )}
          {user && (user.role === "admin" || user.role === "superAdmin") && (
            <div className="admin_div">
              <div className="dvg22"></div>
              {user.role === "superAdmin" && (
                <section className="mm_inner mm_inner_full_width card_shadow card_border_radius bg_white">
                  <h6 className="title dm20 light_black">Super Admin</h6>
                  <div className="inner">
                    <Link className="mm_single" to="/addnotification/new">
                      {/* <span className="material-symbols-outlined mms_icon">
                      notification_important
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M440-440h80v-200h-80v200Zm40 120q17 0 28.5-11.5T520-360q0-17-11.5-28.5T480-400q-17 0-28.5 11.5T440-360q0 17 11.5 28.5T480-320ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
                      </svg>
                      <h5 className="dr16"> add notification</h5>
                      <h6>
                        Create and manage your custom alerts and notifications
                      </h6>
                      {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mms_ra"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </svg>
                    </Link>
                    <Link className="mm_single" to="/userlist">
                      {/* <span className="material-symbols-outlined mms_icon">
                      group
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
                      </svg>
                      <h5 className="dr16">user list</h5>
                      <h6>View and manage all registered users</h6>
                      {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mms_ra"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </svg>
                    </Link>
                    <Link className="mm_single" to="/attendance-dashboard">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z" />
                      </svg>
                      <h5 className="dr16">Attendance Dashboard</h5>
                      <h6>View and manage all employee attendance</h6>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mms_ra"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </svg>
                    </Link>
                    {/* <Link className="mm_single" to="/agents">
                    <span className="material-symbols-outlined mms_icon">
                      group
                    </span>
                    <h5 className="dr16">agent list</h5>
                    <h6>View and manage all registered agent</h6>
                    // <span className="material-symbols-outlined mms_ra">
                    //   chevron_right
                    // </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mms_ra" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00a8a8"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
                  </Link> */}
                  </div>
                </section>
              )}

              <div className="dvg22"></div>
              {
                <section className="mm_inner mm_inner_full_width card_shadow card_border_radius bg_white">
                  <h6 className="title dm20 light_black">Master data</h6>
                  <div className="inner">
                    {user.role === "superAdmin" && (
                      <Link className="mm_single" to="/countrylist">
                        {/* <span className="material-symbols-outlined mms_icon">
                      flag
                    </span> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#00a8a8"
                        >
                          <path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z" />
                        </svg>
                        <h5 className="dr16">Country's list</h5>
                        <h6>
                          Add and manage countries for your listings and
                          settings
                        </h6>
                        {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mms_ra"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#00a8a8"
                        >
                          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                        </svg>
                      </Link>
                    )}
                    {user.role === "superAdmin" && (
                      <Link className="mm_single" to="/statelist">
                        {/* <span className="material-symbols-outlined mms_icon">
                      emoji_transportation
                    </span> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#00a8a8"
                        >
                          <path d="M400-106v-228l56-160q5-11 14.5-18.5T494-520h292q14 0 24 7.5t14 18.5l56 160v228q0 11-7.5 18.5T854-80h-28q-11 0-18.5-7.5T800-106v-34H480v34q0 11-7.5 18.5T454-80h-28q-11 0-18.5-7.5T400-106Zm80-274h320l-28-80H508l-28 80Zm-20 60v120-120Zm60 100q17 0 28.5-11.5T560-260q0-17-11.5-28.5T520-300q-17 0-28.5 11.5T480-260q0 17 11.5 28.5T520-220Zm240 0q17 0 28.5-11.5T800-260q0-17-11.5-28.5T760-300q-17 0-28.5 11.5T720-260q0 17 11.5 28.5T760-220ZM240-400v-80h80v80h-80Zm200-240v-80h80v80h-80ZM240-240v-80h80v80h-80Zm0 160v-80h80v80h-80ZM80-80v-560h200v-240h400v280h-80v-200H360v240H160v480H80Zm380-120h360v-120H460v120Z" />
                        </svg>
                        <h5 className="dr16">State's list</h5>
                        <h6>
                          Add and manage states for your listings and settings
                        </h6>
                        {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mms_ra"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#00a8a8"
                        >
                          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                        </svg>
                      </Link>
                    )}
                    {user.role === "superAdmin" && (
                      <Link className="mm_single" to="/citylist">
                        {/* <span className="material-symbols-outlined mms_icon">
                      holiday_village
                    </span> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#00a8a8"
                        >
                          <path d="M80-160v-400l240-240 240 240v400H80Zm80-80h120v-120h80v120h120v-287L320-687 160-527v287Zm120-200v-80h80v80h-80Zm360 280v-433L433-800h113l174 174v466h-80Zm160 0v-499L659-800h113l108 108v532h-80Zm-640-80h320-320Z" />
                        </svg>
                        <h5 className="dr16">City's list</h5>
                        <h6>
                          Add and manage cites for your listings and settings
                        </h6>
                        {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mms_ra"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#00a8a8"
                        >
                          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                        </svg>
                      </Link>
                    )}
                    <Link className="mm_single" to="/localitylist">
                      {/* <span className="material-symbols-outlined mms_icon">
                      location_city
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M120-120v-560h240v-80l120-120 120 120v240h240v400H120Zm80-80h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm240 320h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm240 480h80v-80h-80v80Zm0-160h80v-80h-80v80Z" />
                      </svg>
                      <h5 className="dr16">Locality's list</h5>
                      <h6>
                        Add and manage localites for your listings and settings
                      </h6>
                      {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mms_ra"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </svg>
                    </Link>
                    <Link className="mm_single" to="/societylist">
                      {/* <span className="material-symbols-outlined mms_icon">
                      location_home
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="m480-840 320 240v480H160v-480l320-240Zm0 480q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0-80q-17 0-28.5-11.5T440-480q0-17 11.5-28.5T480-520q17 0 28.5 11.5T520-480q0 17-11.5 28.5T480-440Zm0 200q-41 0-80 10t-74 30h308q-35-20-74-30t-80-10ZM240-560v320q52-39 113-59.5T480-320q66 0 127 20.5T720-240v-320L480-740 240-560Zm240 80Z" />
                      </svg>
                      <h5 className="dr16">Society's list</h5>
                      <h6>
                        Add and manage societies for your listings and settings
                      </h6>
                      {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mms_ra"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </svg>
                    </Link>
                  </div>
                </section>
              }

              <div className="dvg22"></div>
              {user.role === "superAdmin" && (
                <section className="mm_inner mm_inner_full_width card_shadow card_border_radius bg_white coming_soon r0">
                  <h6 className="title dm20 light_black">setting</h6>
                  <div className="inner">
                    <Link className="mm_single" to="/adminsettings">
                      {/* <span className="material-symbols-outlined mms_icon">
                      flag
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z" />
                      </svg>
                      <h5 className="dr16">Country</h5>
                      <h6>set your current location</h6>
                      {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mms_ra"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </svg>
                    </Link>
                    <Link className="mm_single" to="/adminsettings">
                      {/* <span className="material-symbols-outlined mms_icon">
                      diamond
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M480-120 80-600l120-240h560l120 240-400 480Zm-95-520h190l-60-120h-70l-60 120Zm55 347v-267H218l222 267Zm80 0 222-267H520v267Zm144-347h106l-60-120H604l60 120Zm-474 0h106l60-120H250l-60 120Z" />
                      </svg>
                      <h5 className="dr16">Logo</h5>
                      <h6>Upload and update the logo displayed on your site</h6>
                      {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mms_ra"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </svg>
                    </Link>
                    <Link className="mm_single" to="">
                      {/* <span className="material-symbols-outlined mms_icon">
                      contrast
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z" />
                      </svg>
                      <h5 className="dr16">Theme</h5>
                      <h6>
                        Choose and apply a new theme for your site's appearance
                      </h6>
                      <span className="material-symbols-outlined mms_ra">
                        <DarkModeToggle
                          onChange={() =>
                            toggleDarkMode(
                              appDisplayMode && appDisplayMode.id,
                              appDisplayMode && appDisplayMode.displayMode
                            )
                          }
                          checked={
                            appDisplayMode &&
                            appDisplayMode.displayMode === "dark"
                          }
                          size={50}
                        />
                      </span>
                    </Link>
                    <Link className="mm_single" to="">
                      {/* <span className="material-symbols-outlined mms_icon">
                      g_translate
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="m480-80-40-120H160q-33 0-56.5-23.5T80-280v-520q0-33 23.5-56.5T160-880h240l35 120h365q35 0 57.5 22.5T880-680v520q0 33-22.5 56.5T800-80H480ZM286-376q69 0 113.5-44.5T444-536q0-8-.5-14.5T441-564H283v62h89q-8 28-30.5 43.5T287-443q-39 0-67-28t-28-69q0-41 28-69t67-28q18 0 34 6.5t29 19.5l49-47q-21-22-50.5-34T286-704q-67 0-114.5 47.5T124-540q0 69 47.5 116.5T286-376Zm268 20 22-21q-14-17-25.5-33T528-444l26 88Zm50-51q28-33 42.5-63t19.5-47H507l12 42h40q8 15 19 32.5t26 35.5Zm-84 287h280q18 0 29-11.5t11-28.5v-520q0-18-11-29t-29-11H447l47 162h79v-42h41v42h146v41h-51q-10 38-30 74t-47 67l109 107-29 29-108-108-36 37 32 111-80 80Z" />
                      </svg>
                      <h5 className="dr16">Site Language</h5>
                      <h6>
                        Select and set the preferred language for your website
                      </h6>
                      {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mms_ra"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </svg>
                    </Link>
                    <Link className="mm_single" to="">
                      {/* <span className="material-symbols-outlined mms_icon">
                      credit_card
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720Zm-720 80h640v-80H160v80Zm0 160v240h640v-240H160Zm0 240v-480 480Z" />
                      </svg>
                      <h5 className="dr16">Payment Gateway</h5>
                      <h6>
                        Configure and switch your payment processing provider
                      </h6>
                      {/* <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mms_ra"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#00a8a8"
                      >
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </svg>
                    </Link>
                  </div>
                </section>
              )}
            </div>
          )}
          {user && (user.role === "superAdmin" || user.role === "hr") && (
            <div className="admin_div">
              <div className="dvg22"></div>
              <section className="mm_inner mm_inner_full_width card_shadow card_border_radius bg_white">
                <h6 className="title dm20 light_black">HR</h6>
                <div className="inner">
                  <Link className="mm_single" to="/userlist">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
                    </svg>
                    <h5 className="dr16">user list</h5>
                    <h6>View and manage all registered users</h6>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mms_ra"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                    </svg>
                  </Link>
                  <Link className="mm_single" to="/attendance-dashboard">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z" />
                    </svg>
                    <h5 className="dr16">Attendance Dashboard</h5>
                    <h6>View and manage all employee attendance</h6>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mms_ra"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                    </svg>
                  </Link>
                </div>
              </section>
            </div>
          )}

          {/* Owner Cards */}
          {/* {user && user.role === "owner" && (
            <div className="owner_div">
              <div className="dvg22"></div>
              <section className="mm_inner mm_inner_full_width card_shadow card_border_radius bg_white">
                <h6 className="title dm20 light_black">Owner</h6>
                <div className="inner">
                  <Link className="mm_single" to="/newproperty">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00a8a8"><path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z"/></svg>
                    <h5 className="dr16">Properties</h5>
                    <h6>check your all properties</h6>
                    // <span className="material-symbols-outlined mms_ra">
                    //   chevron_right
                    // </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mms_ra" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00a8a8"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
                  </Link>
                  <Link className="mm_single" to="/addnotification/new">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00a8a8"><path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z"/></svg>
                    <h5 className="dr16"> Bills</h5>
                    <h6>check your all bills</h6>
                    // <span className="material-symbols-outlined mms_ra">
                    //   chevron_right
                    // </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mms_ra" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00a8a8"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
                  </Link>
                  <Link className="mm_single" to="">
                   <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00a8a8"><path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z"/></svg>
                    <h5 className="dr16">Tickets </h5>
                    <h6>check your all communications</h6>
                    // <span className="material-symbols-outlined mms_ra">
                    //   chevron_right
                    // </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mms_ra" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00a8a8"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
                  </Link>
                </div>
              </section>
            </div>
          )} */}

          <div className="dvg22"></div>
          <section className="more-menus_inner">
            <div className="mm_inner card_shadow card_border_radius bg_white">
              <h6 className="title">Quick links</h6>
              <Link className="mm_single" to="/">
                {/* <span className="material-symbols-outlined mms_icon">home</span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
                </svg>
                <h5 className="dr16">Home </h5>
                <h6>explore limitless possibilities</h6>
                {/* <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mms_ra"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </svg>
              </Link>
              <Link className="mm_single" to="/notification">
                {/* <span className="material-symbols-outlined mms_icon">
                  notifications_active
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M80-560q0-100 44.5-183.5T244-882l47 64q-60 44-95.5 111T160-560H80Zm720 0q0-80-35.5-147T669-818l47-64q75 55 119.5 138.5T880-560h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
                </svg>
                <h5 className="dr16">notification</h5>
                <h6>Review your recent alerts and updates</h6>
                {/* <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mms_ra"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </svg>
              </Link>
              <Link className="mm_single" to="/faq">
                {/* <span className="material-symbols-outlined mms_icon">quiz</span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M560-360q17 0 29.5-12.5T602-402q0-17-12.5-29.5T560-444q-17 0-29.5 12.5T518-402q0 17 12.5 29.5T560-360Zm-30-128h60q0-29 6-42.5t28-35.5q30-30 40-48.5t10-43.5q0-45-31.5-73.5T560-760q-41 0-71.5 23T446-676l54 22q9-25 24.5-37.5T560-704q24 0 39 13.5t15 36.5q0 14-8 26.5T578-596q-33 29-40.5 45.5T530-488ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
                </svg>
                <h5 className="dr16">FAQ </h5>
                <h6>answer to common queries</h6>
                {/* <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mms_ra"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </svg>
              </Link>
              <Link className="mm_single" to="/about-us">
                {/* <span className="material-symbols-outlined mms_icon">
                  import_contacts
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z" />
                </svg>
                <h5 className="dr16">About</h5>
                <h6>discover our vision and mission</h6>
                {/* <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mms_ra"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </svg>
              </Link>
              <Link className="mm_single" to="/blogs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z" />
                </svg>
                <h5 className="dr16">Blogs</h5>
                <h6>discover our blog</h6>
                {/* <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mms_ra"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </svg>
              </Link>
              <Link className="mm_single" to="/contact-us">
                {/* <span className="material-symbols-outlined mms_icon">
                  contact_page
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M480-400q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400ZM320-240h320v-23q0-24-13-44t-36-30q-26-11-53.5-17t-57.5-6q-30 0-57.5 6T369-337q-23 10-36 30t-13 44v23ZM720-80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80Zm0-80v-446L526-800H240v640h480Zm-480 0v-640 640Z" />
                </svg>
                <h5 className="dr16">Contact Us</h5>
                <h6>let's connect and communicate</h6>
                {/* <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mms_ra"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </svg>
              </Link>
            </div>
            <div className="mm_inner card_shadow card_border_radius bg_white">
              <h6 className="title">Others</h6>
              <Link className="mm_single r0" to="/contact-us">
                {/* <span className="material-symbols-outlined mms_icon">help</span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
                <h5 className="dr16">Help & Support</h5>
                <h6>assistance and support resources</h6>
                {/* <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mms_ra"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </svg>
              </Link>
              <Link className="mm_single r0" to=" ">
                {/* <span className="material-symbols-outlined mms_icon">
                  contrast
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z" />
                </svg>
                <h5 className="dr16">Display mode</h5>
                <h6>change your app mode to dark & light</h6>
                <span className="mms_ra">
                  <DarkModeToggle
                    onChange={() => toggleUserDarkMode()}
                    checked={localStorage.getItem("mode") === "dark"}
                    size={50}
                  />
                </span>
              </Link>
              <Link className="mm_single" to="/privacypolicy">
                {/* <span className="material-symbols-outlined mms_icon">
                  report
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm34-80h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z" />
                </svg>
                <h5 className="dr16">Privacy Policy</h5>
                <h6>understanding our privacy commitments</h6>
                {/* <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mms_ra"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </svg>
              </Link>
              <Link className="mm_single" to="/terms">
                {/* <span className="material-symbols-outlined mms_icon">
                  gavel
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M160-120v-80h480v80H160Zm226-194L160-540l84-86 228 226-86 86Zm254-254L414-796l86-84 226 226-86 86Zm184 408L302-682l56-56 522 522-56 56Z" />
                </svg>
                <h5 className="dr16">Terms & Condition</h5>
                <h6>guidelines for usage and conduct</h6>
                {/* <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mms_ra"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </svg>
              </Link>
              {user ? (
                <Link className="mm_single" to="" onClick={showPopup}>
                  {/* <span className="material-symbols-outlined mms_icon">
                    logout
                  </span> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#00a8a8"
                  >
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                  </svg>
                  <h5 className="dr16">Logout</h5>
                  <h6>sign out to login with other mobile no</h6>
                  {/* <span className="material-symbols-outlined mms_ra">
                    chevron_right
                  </span> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mms_ra"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#00a8a8"
                  >
                    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                  </svg>
                </Link>
              ) : (
                <Link className="mm_single" to="/login">
                  {/* <span className="material-symbols-outlined mms_icon">
                    login
                  </span> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#00a8a8"
                  >
                    <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                  </svg>
                  <h5 className="dr16">Login</h5>
                  <h6>sign in with your mobile no</h6>
                  {/* <span className="material-symbols-outlined mms_ra">
                    chevron_right
                  </span> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mms_ra"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#00a8a8"
                  >
                    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                  </svg>
                </Link>
              )}
            </div>
          </section>
          <div className="dvg22"></div>
        </div>
      </div>
    </div>
  );
};

export default PGMoreMenu;
