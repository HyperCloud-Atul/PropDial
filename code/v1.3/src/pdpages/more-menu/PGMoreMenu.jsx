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
                  <span className="material-symbols-outlined">dashboard</span>
                </div>
                <h6 className="dr16 click_text">Dashboard</h6>
              </Link>
              <Link className="mqc_single" to="/profile">
                <div className="icon click_icon">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <h6 className="dr16 click_text">My account</h6>
              </Link>
              <Link className="mqc_single" to="/notification">
                <div className="icon click_icon">
                  <span className="material-symbols-outlined">
                    notifications
                  </span>
                </div>
                <h6 className="dr16 click_text">Notifications</h6>
              </Link>
            </section>
          )}
          {user && (user.role === "admin" || user.role === "superAdmin") && (
            <section className="more_quick_card card_shadow card_border_radius bg_white">
              <Link className="mqc_single" to="/dashboard">
                <div className="icon click_icon">
                  <span className="material-symbols-outlined">dashboard</span>
                </div>
                <h6 className="dr16 click_text">Dashboard</h6>
              </Link>
              <Link className="mqc_single" to="/profile">
                <div className="icon click_icon">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <h6 className="dr16 click_text">My account</h6>
              </Link>
              <Link className="mqc_single" to="/notification">
                <div className="icon click_icon">
                  <span className="material-symbols-outlined">
                    notifications
                  </span>
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
                    <span className="material-symbols-outlined mms_icon">
                      add
                    </span>
                    <h5 className="dr16">add property</h5>
                    <h6>Easily list your property</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                
                  <Link className="mm_single coming_soon r0" to="">
                    <span className="material-symbols-outlined mms_icon">
                      receipt_long
                    </span>
                    <h5 className="dr16"> add bills </h5>
                    <h6>
                      Enter and manage your billing information and payments
                    </h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="/allproperties/all">
                    <span className="material-symbols-outlined mms_icon">
                      real_estate_agent
                    </span>
                    <h5 className="dr16">property lists</h5>
                    <h6>
                      View and manage the complete list of available properties
                    </h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>                
                  <Link className="mm_single coming_soon r0" to="">
                    <span className="material-symbols-outlined mms_icon">
                      confirmation_number
                    </span>
                    <h5 className="dr16">Manage tickets</h5>
                    <h6>
                      Oversee and respond to all support tickets and inquiries
                    </h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single coming_soon r0" to="">
                    <span className="material-symbols-outlined mms_icon">
                      payments
                    </span>
                    <h5 className="dr16">PMS Payment</h5>
                    <h6> Manage and process your PMS payments.</h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                  <Link className="mm_single" to="/enquiry/all">
                    <span className="material-symbols-outlined mms_icon">
                      headphones
                    </span>
                    <h5 className="dr16">Enquiry</h5>
                    <h6>
                      View and respond to all customer enquiries and leads
                    </h6>
                    <span className="material-symbols-outlined mms_ra">
                      chevron_right
                    </span>
                  </Link>
                </div>
              </section>
            </div>
          )}
          {user && user.role === "superAdmin" && (
              <div className="admin_div">
                <div className="dvg22"></div>
                <section className="mm_inner mm_inner_full_width card_shadow card_border_radius bg_white">
                  <h6 className="title dm20 light_black">Super Admin</h6>
                  <div className="inner">                   
                    <Link className="mm_single" to="/addnotification/new">
                      <span className="material-symbols-outlined mms_icon">
                        notification_important
                      </span>
                      <h5 className="dr16"> add notification</h5>
                      <h6>
                        Create and manage your custom alerts and notifications
                      </h6>
                      <span className="material-symbols-outlined mms_ra">
                        chevron_right
                      </span>
                    </Link>            
                    <Link className="mm_single" to="/userlist">
                      <span className="material-symbols-outlined mms_icon">
                        group
                      </span>
                      <h5 className="dr16">user list</h5>
                      <h6>View and manage all registered users</h6>
                      <span className="material-symbols-outlined mms_ra">
                        chevron_right
                      </span>
                    </Link> 
                    <Link className="mm_single" to="/agents">
                      <span className="material-symbols-outlined mms_icon">
                        group
                      </span>
                      <h5 className="dr16">agent list</h5>
                      <h6>View and manage all registered agent</h6>
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
                      <span className="material-symbols-outlined mms_icon">
                        flag
                      </span>
                      <h5 className="dr16">Country's list</h5>
                      <h6>
                        Add and manage countries for your listings and settings
                      </h6>
                      <span className="material-symbols-outlined mms_ra">
                        chevron_right
                      </span>
                    </Link>
                    <Link className="mm_single" to="/statelist">
                      <span className="material-symbols-outlined mms_icon">
                        emoji_transportation
                      </span>
                      <h5 className="dr16">State's list</h5>
                      <h6>
                        Add and manage states for your listings and settings
                      </h6>
                      <span className="material-symbols-outlined mms_ra">
                        chevron_right
                      </span>
                    </Link>
                    <Link className="mm_single" to="/citylist">
                      <span className="material-symbols-outlined mms_icon">
                        holiday_village
                      </span>
                      <h5 className="dr16">City's list</h5>
                      <h6>
                        Add and manage cites for your listings and settings
                      </h6>
                      <span className="material-symbols-outlined mms_ra">
                        chevron_right
                      </span>
                    </Link>
                    <Link className="mm_single" to="/localitylist">
                      <span className="material-symbols-outlined mms_icon">
                        location_city
                      </span>
                      <h5 className="dr16">Locality's list</h5>
                      <h6>
                        Add and manage localites for your listings and settings
                      </h6>
                      <span className="material-symbols-outlined mms_ra">
                        chevron_right
                      </span>
                    </Link>
                    <Link className="mm_single" to="/societylist">
                      <span className="material-symbols-outlined mms_icon">
                        location_home
                      </span>
                      <h5 className="dr16">Society's list</h5>
                      <h6>
                        Add and manage societies for your listings and settings
                      </h6>
                      <span className="material-symbols-outlined mms_ra">
                        chevron_right
                      </span>
                    </Link>
                  </div>
                </section>
                <div className="dvg22"></div>
                <section className="mm_inner mm_inner_full_width card_shadow card_border_radius bg_white coming_soon r0">
                  <h6 className="title dm20 light_black">setting</h6>
                  <div className="inner">
                    <Link className="mm_single" to="/adminsettings">
                      <span className="material-symbols-outlined mms_icon">
                        flag
                      </span>
                      <h5 className="dr16">Country</h5>
                      <h6>set your current location</h6>
                      <span className="material-symbols-outlined mms_ra">
                        chevron_right
                      </span>
                    </Link>
                    <Link className="mm_single" to="/adminsettings">
                      <span className="material-symbols-outlined mms_icon">
                        diamond
                      </span>
                      <h5 className="dr16">Logo</h5>
                      <h6>Upload and update the logo displayed on your site</h6>
                      <span className="material-symbols-outlined mms_ra">
                        chevron_right
                      </span>
                    </Link>
                    <Link className="mm_single" to="">
                      <span className="material-symbols-outlined mms_icon">
                        contrast
                      </span>
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
                            appDisplayMode.displayMode == "dark"
                          }
                          size={50}
                        />
                      </span>
                    </Link>
                    <Link className="mm_single" to="">
                      <span className="material-symbols-outlined mms_icon">
                        g_translate
                      </span>
                      <h5 className="dr16">Site Language</h5>
                      <h6>
                        Select and set the preferred language for your website
                      </h6>
                      <span className="material-symbols-outlined mms_ra">
                        chevron_right
                      </span>
                    </Link>
                    <Link className="mm_single" to="">
                      <span className="material-symbols-outlined mms_icon">
                        credit_card
                      </span>
                      <h5 className="dr16">Payment Gateway</h5>
                      <h6>
                        Configure and switch your payment processing provider
                      </h6>
                      <span className="material-symbols-outlined mms_ra">
                        chevron_right
                      </span>
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
          )} */}

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
                <span className="material-symbols-outlined mms_icon">
                  notifications_active
                </span>
                <h5 className="dr16">notification</h5>
                <h6>Review your recent alerts and updates</h6>
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
              <Link className="mm_single r0" to="/contact-us">
                <span className="material-symbols-outlined mms_icon">help</span>
                <h5 className="dr16">Help & Support</h5>
                <h6>assistance and support resources</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single r0" to=" ">
                <span className="material-symbols-outlined mms_icon">
                  contrast
                </span>
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
                <span className="material-symbols-outlined mms_icon">
                  report
                </span>
                <h5 className="dr16">Privacy Policy</h5>
                <h6>understanding our privacy commitments</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/terms">
                <span className="material-symbols-outlined mms_icon">
                  gavel
                </span>
                <h5 className="dr16">Terms & Condition</h5>
                <h6>guidelines for usage and conduct</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              {user ? (
                <Link className="mm_single" to="" onClick={showPopup}>
                  <span className="material-symbols-outlined mms_icon">
                    logout
                  </span>
                  <h5 className="dr16">Logout</h5>
                  <h6>sign out to login with other mobile no</h6>
                  <span className="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
              ) : (
                <Link className="mm_single" to="/login">
                  <span className="material-symbols-outlined mms_icon">
                    login
                  </span>
                  <h5 className="dr16">Login</h5>
                  <h6>sign in with your mobile no</h6>
                  <span className="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
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
