import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

// css
import "./PGMoreMenu.css";

// components
import Hero from "../../Components/Hero";

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

  return (
    <div className="pgmoremenu pgls_mobile">
      <Hero
        pageTitle="Locate Everything"
        pageSubTitle="Explore more for better understanding"
        heroImage="./assets/img/more_banner.jpg"
      ></Hero>

      <section className="more-menus sect_padding">
        <div className="container">
          <div className="more-div-big-icon-div">
            <div className="more-div-big-icon-div-inner pointer">
              <div>
                <Link to="/profile">
                  <span className="material-symbols-outlined">person</span>
                </Link>
              </div>
              <Link to="/profile">
                <h1>My Account</h1>
              </Link>
            </div>

            <div className="more-div-big-icon-div-inner pointer">
              <div>
                <span className="material-symbols-outlined">notifications</span>
              </div>
              <h1>Notifications</h1>
            </div>

            <div className="more-div-big-icon-div-inner pointer">
              <div>
                <span className="material-symbols-outlined">
                  account_balance_wallet
                </span>
              </div>
              <h1>Wallet</h1>
            </div>
          </div>
          <div className="more-menus_inner">
            {user && user.role === "admin" && (
              <div className="mm_inner">
                <h6 className="title">Properties</h6>
                <Link className="mm_single" to="/addproperty">
                  <span class="material-symbols-outlined mms_icon">
                    shopping_bag
                  </span>
                  <h5>Add Property</h5>
                  <h6>all properties to be shown</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    shopping_bag
                  </span>
                  <h5>Add Bills</h5>
                  <h6>All The Trips You Can Track Here</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>PMS Payments</h5>
                  <h6>All The Trips You Can Track Here</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Manage Tickets</h5>
                  <h6>All The Trips You Can Track Here</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
              </div>
            )}
            {user && user.role === "admin" && (
              <div className="mm_inner">
                <h6 className="title">Users</h6>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    shopping_bag
                  </span>
                  <h5>Customer List</h5>
                  <h6>add new property</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    shopping_bag
                  </span>
                  <h5>Executive List</h5>
                  <h6>All The Trips You Can Track Here</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Customer List</h5>
                  <h6>All The Trips You Can Track Here</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Executive List</h5>
                  <h6>All The Trips You Can Track Here</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
              </div>
            )}
            {user && user.role === "admin" && (
              <div className="mm_inner">
                <h6 className="title">Settings</h6>
                <Link className="mm_single" to="/adminsettings">
                  <span class="material-symbols-outlined mms_icon">flag</span>
                  <h5>Logo</h5>
                  <h6>set your current location</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Theme</h5>
                  <h6>All The Trips You Can Track Here</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Site Language</h5>
                  <h6>All The Trips You Can Track Here</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Payment Gateway</h5>
                  <h6>update your app password</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
              </div>
            )}
            {user && user.role === "admin" && (
              <div className="mm_inner">
                <h6 className="title">Master Data</h6>
                <Link className="mm_single" to="/countrylist">
                  <span class="material-symbols-outlined mms_icon">flag</span>
                  <h5>Add Country</h5>
                  <h6>set your current location</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="/statelist">
                  <span class="material-symbols-outlined mms_icon">
                    g_translate
                  </span>
                  <h5>Add State</h5>
                  <h6>All The Trips You Can Track Here</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="/citylist">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Add City</h5>
                  <h6>All The Trips You Can Track Here</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="/localitylist">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Add Locality</h5>
                  <h6>update your app password</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="/societylist">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Add Society</h5>
                  <h6>update your app password</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
              </div>
            )}
            {user && user.role === "owner" && (
              <div className="mm_inner">
                <h6 className="title">Properties</h6>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    shopping_bag
                  </span>
                  <h5>Manage Properties</h5>
                  <h6>add new property</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    shopping_bag
                  </span>
                  <h5>Manage Documents</h5>
                  <h6>All The Trips You Can Track Here</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Manage Payments</h5>
                  <h6>All The Trips You Can Track Here</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Manage Tickets</h5>
                  <h6>update your app password</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
              </div>
            )}
            {user && user.role === "owner" && (
              <div className="mm_inner">
                <h6 className="title">Properties</h6>
                <Link className="mm_single" to="/bills">
                  <span class="material-symbols-outlined mms_icon">
                    shopping_bag
                  </span>
                  <h5>Bills</h5>
                  <h6>Your all generated bills</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="/search-property">
                  <span class="material-symbols-outlined mms_icon">
                    shopping_bag
                  </span>
                  <h5>Property</h5>
                  <h6>All properties</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="/tickets">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Tickets</h5>
                  <h6>All generated tickets</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="/ownerdashboard">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Dashboard</h5>
                  <h6>Your dashboard</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
              </div>
            )}
            {user && user.role === "owner" && (
              <div className="mm_inner">
                <h6 className="title">Settings</h6>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    flag
                  </span>
                  <h5>Country</h5>
                  <h6>set your current location</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    g_translate
                  </span>
                  <h5>Language</h5>
                  <h6>setup your native language</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    favorite
                  </span>
                  <h5>Password</h5>
                  <h6>update your app password</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
                <Link className="mm_single" to="">
                  <span class="material-symbols-outlined mms_icon">
                    lock_open
                  </span>
                  <h5>Logout</h5>
                  <h6>sign-out from the application</h6>
                  <span class="material-symbols-outlined mms_ra">
                    chevron_right
                  </span>
                </Link>
              </div>
            )}
            <div className="mm_inner">
              <h6 className="title">Contact</h6>
              <Link className="mm_single" to="/faq">
                <span class="material-symbols-outlined mms_icon">quiz</span>
                <h5>FAQ </h5>
                <h6>Lorem ipsum text dummy text</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/about-us">
                <span class="material-symbols-outlined mms_icon">
                  import_contacts
                </span>
                <h5>About</h5>
                <h6>Lorem ipsum text dummy text</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>

              <Link className="mm_single" to="/contact-us">
                <span class="material-symbols-outlined mms_icon">
                  contact_page
                </span>
                <h5>Contact Us</h5>
                <h6>Lorem ipsum text dummy text</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>
            <div className="mm_inner">
              <h6 className="title">Others</h6>
              {/* <Link className="mm_single" to="">
                <span class="material-symbols-outlined mms_icon">help</span>
                <h5>Help & Support</h5>
                <h6>Lorem ipsum text dummy text</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link> */}
              <Link className="mm_single" to="/propertysinglecard">
                <span class="material-symbols-outlined mms_icon">help</span>
                <h5>Property card</h5>
                <h6>Lorem ipsum text dummy text</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/createticket">
                <span class="material-symbols-outlined mms_icon">help</span>
                <h5>create ticket</h5>
                <h6>Lorem ipsum text dummy text</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span class="material-symbols-outlined mms_icon">report</span>
                <h5>Privacy Policy</h5>
                <h6>Lorem ipsum text dummy text</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/addnotification/new">
                <span class="material-symbols-outlined mms_icon">report</span>
                <h5>Add notification</h5>
                <h6>Lorem ipsum text dummy text</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span class="material-symbols-outlined mms_icon">gavel</span>
                <h5>Terms & Condition</h5>
                <h6>Lorem ipsum text dummy text</h6>
                <span class="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PGMoreMenu;
