import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";
import DarkModeToggle from "react-dark-mode-toggle";

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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end



  const { document: appTypeDocument, error: appTypeDocumentError } =
    useDocument("settings", "AppType");
  const { document: appDisplayMode, error: appDisplayModeerror } = useDocument(
    "settings",
    "mode"
  );
  const { updateDocument, deleteDocument } = useFirestore("settings");

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
                  <span className="material-symbols-outlined">
                    dashboard
                  </span>
                </div>
                <h6 className="dr16 click_text">
                  Dashboard
                </h6>
              </Link>
              <Link className="mqc_single" to="/profile">
                <div className="icon click_icon">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <h6 className="dr16 click_text">
                  My account
                </h6>
              </Link>
              <Link className="mqc_single" to="/notification">
                <div className="icon click_icon">
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <h6 className="dr16 click_text">
                  Notifications
                </h6>
              </Link>

            </section>
          )}
          {user && user.role === "admin" && (
            <section className="more_quick_card card_shadow card_border_radius bg_white">
              <Link className="mqc_single" to="/dashboard">
                <div className="icon click_icon">
                  <span className="material-symbols-outlined">
                    dashboard
                  </span>
                </div>
                <h6 className="dr16 click_text">
                  Dashboard
                </h6>
              </Link>
              <Link className="mqc_single" to="/profile">
                <div className="icon click_icon">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <h6 className="dr16 click_text">
                  My account
                </h6>
              </Link>
              <Link className="mqc_single" to="/notification">
                <div className="icon click_icon">
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <h6 className="dr16 click_text">
                  Notifications
                </h6>
              </Link>

            </section>
          )}

          {user && user.role === "admin" && (
            <div className="admin_div">
              <div className="dvg22"></div>
              <section className="mm_inner mm_inner_full_width card_shadow card_border_radius bg_white">
                <h6 className="title dm20 light_black">Admin</h6>
                <div className="inner">
                  <Link className="mm_single" to="/newproperty">
                    <span className="material-symbols-outlined mms_icon">flag</span>
                    <h5 className="dr16">add property</h5>
                    <h6>set your current location</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="/addnotification/new">
                    <span className="material-symbols-outlined mms_icon">flag</span>
                    <h5 className="dr16"> add notification</h5>
                    <h6>set your current location</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="">
                    <span className="material-symbols-outlined mms_icon">flag</span>
                    <h5 className="dr16">  add bills </h5>
                    <h6>set your current location</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="">
                    <span className="material-symbols-outlined mms_icon">
                      favorite
                    </span>
                    <h5 className="dr16">property list</h5>
                    <h6>All The Trips You Can Track Here</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="">
                    <span className="material-symbols-outlined mms_icon">
                      favorite
                    </span>
                    <h5 className="dr16">user list</h5>
                    <h6>update your app password</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="">
                    <span className="material-symbols-outlined mms_icon">
                      favorite
                    </span>
                    <h5 className="dr16">Manage tickets</h5>
                    <h6>All The Trips You Can Track Here</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="">
                    <span className="material-symbols-outlined mms_icon">
                      favorite
                    </span>
                    <h5 className="dr16">PMS Payment</h5>
                    <h6>update your app password</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                </div>
              </section>
              <div className="dvg22"></div>
              <section className="mm_inner mm_inner_full_width card_shadow card_border_radius bg_white">
                <h6 className="title dm20 light_black">Master data</h6>
                <div className="inner">
                  <Link className="mm_single" to="/countrylist">
                    <span className="material-symbols-outlined mms_icon">flag</span>
                    <h5 className="dr16">Add Country</h5>
                    <h6>set your current location</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="/statelist">
                    <span className="material-symbols-outlined mms_icon">
                      g_translate
                    </span>
                    <h5 className="dr16">Add State</h5>
                    <h6>All The Trips You Can Track Here</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="/citylist">
                    <span className="material-symbols-outlined mms_icon">
                      favorite
                    </span>
                    <h5 className="dr16">Add City</h5>
                    <h6>All The Trips You Can Track Here</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="/localitylist">
                    <span className="material-symbols-outlined mms_icon">
                      favorite
                    </span>
                    <h5 className="dr16">Add Locality</h5>
                    <h6>update your app password</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="/societylist">
                    <span className="material-symbols-outlined mms_icon">
                      favorite
                    </span>
                    <h5 className="dr16">Add Society</h5>
                    <h6>update your app password</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                </div>
              </section>
              <div className="dvg22"></div>
              <section className="mm_inner mm_inner_full_width card_shadow card_border_radius bg_white">
                <h6 className="title dm20 light_black">setting</h6>
                <div className="inner">
                  <Link className="mm_single" to="/adminsettings">
                    <span className="material-symbols-outlined mms_icon">flag</span>
                    <h5 className="dr16">Country</h5>
                    <h6>set your current location</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="/adminsettings">
                    <span className="material-symbols-outlined mms_icon">flag</span>
                    <h5 className="dr16">Logo</h5>
                    <h6>set your current location</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="">
                    <span className="material-symbols-outlined mms_icon">
                      favorite
                    </span>
                    <h5 className="dr16">Theme</h5>
                    <h6>All The Trips You Can Track Here</h6>
                    <span className="material-symbols-outlined mms_ra">
                      <DarkModeToggle
                        onChange={() =>
                          toggleDarkMode(
                            appDisplayMode && appDisplayMode.id,
                            appDisplayMode &&
                            appDisplayMode.displayMode
                          )
                        }
                        checked={
                          appDisplayMode &&
                          appDisplayMode.displayMode == "dark"
                        }
                        size={50}
                      />
                    </span>
                  </Link>
                  <Link className="mm_single" to="">
                    <span className="material-symbols-outlined mms_icon">
                      favorite
                    </span>
                    <h5 className="dr16">Site Language</h5>
                    <h6>All The Trips You Can Track Here</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="">
                    <span className="material-symbols-outlined mms_icon">
                      favorite
                    </span>
                    <h5 className="dr16">Payment Gateway</h5>
                    <h6>update your app password</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                </div>
              </section>
            </div>
          )}

          {user && user.role === "owner" && (

            <div className="owner_div">
              <div className="dvg22"></div>
              <section className="mm_inner mm_inner_full_width card_shadow card_border_radius bg_white">
                <h6 className="title dm20 light_black">Owner</h6>
                <div className="inner">
                  <Link className="mm_single" to="/newproperty">
                    <span className="material-symbols-outlined mms_icon">flag</span>
                    <h5 className="dr16">Properties</h5>
                    <h6>check your all properties</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="/addnotification/new">
                    <span className="material-symbols-outlined mms_icon">flag</span>
                    <h5 className="dr16"> Bills</h5>
                    <h6>check your all bills</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="">
                    <span className="material-symbols-outlined mms_icon">flag</span>
                    <h5 className="dr16">Tickets </h5>
                    <h6>check your all communications</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                </div>
              </section>
            </div>
          )}
          <div className="dvg22"></div>
          <section className="more-menus_inner">
            <div className="mm_inner card_shadow card_border_radius bg_white">
              <h6 className="title">Quick links</h6>
              <Link className="mm_single" to="/">
                <span className="material-symbols-outlined mms_icon">home</span>
                <h5 className="dr16">Home </h5>
                <h6>explore limitless possibilities</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/notification">
                <span className="material-symbols-outlined mms_icon">notifications_active</span>
                <h5 className="dr16">notification</h5>
                <h6>stay updated: important message inside!</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/faq">
                <span className="material-symbols-outlined mms_icon">quiz</span>
                <h5 className="dr16">FAQ </h5>
                <h6>answer to common queries</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/about-us">
                <span className="material-symbols-outlined mms_icon">
                  import_contacts
                </span>
                <h5 className="dr16">About</h5>
                <h6>discover our vision and mission</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/contact-us">
                <span className="material-symbols-outlined mms_icon">
                  contact_page
                </span>
                <h5 className="dr16">Contact Us</h5>
                <h6>let's connect and communicate</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>
            <div className="mm_inner card_shadow card_border_radius bg_white">
              <h6 className="title">Others</h6>
              <Link className="mm_single" to="/ticketdetail">
                <span className="material-symbols-outlined mms_icon">help</span>
                <h5 className="dr16">Help & Support</h5>
                <h6>assistance and support resources</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single">
                <span className="material-symbols-outlined mms_icon">help</span>
                <h5 className="dr16">Display mode</h5>
                <h6>change your app mode to dark & light</h6>
                <span className="mms_ra">
                  <DarkModeToggle
                    onChange={() => toggleUserDarkMode()}
                    checked={
                      localStorage.getItem("mode") === "dark"
                    }
                    size={50}
                  />
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">report</span>
                <h5 className="dr16">Privacy Policy</h5>
                <h6>understanding our privacy commitments</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">gavel</span>
                <h5 className="dr16">Terms & Condition</h5>
                <h6>guidelines for usage and conduct</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">gavel</span>
                <h5 className="dr16">Logout</h5>
                <h6>sign out to login with other mobile no</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>
          </section>
        </div>

      </div>
    </div>

  );
};

export default PGMoreMenu;