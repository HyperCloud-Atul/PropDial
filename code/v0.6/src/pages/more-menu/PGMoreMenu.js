import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate, Navigate } from "react-router-dom";

// css
import "./PGMoreMenu.css";

// components
import Hero from "../../Components/Hero";
import ContactForm from "../create/ContactForm";

const PGMoreMenu = () => {
  const navigate = useNavigate();
  // get user from useauthcontext
  const { user } = useAuthContext();
  // get user from useauthcontext a

  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const agentDashboard = () => {
    navigate("/agentdashboard");
  };
  const agentProfile = () => {
    navigate("/profile");
  };
  const agentNotification = () => {
    navigate("/propagentnotification");
  };

  return (
    <div className="pgmoremenu pgls_mobile pa_bg top_header_pg">
      {/* <Hero
        pageTitle="Locate Everything"
        pageSubTitle="Explore more for better understanding"
        heroImage="./assets/img/more_banner.jpg"
      ></Hero> */}

      <section className="more-menus pa_inner_page">

        <div className="more-div-big-icon-div">

          <div className="more-div-big-icon-div-inner pointer" onClick={agentProfile}>
            <div>
              <span className="material-symbols-outlined">person</span>
            </div>
            <h1>My Account</h1>
          </div>



          <div className="more-div-big-icon-div-inner pointer" onClick={agentDashboard}>
            <div>
              <span className="material-symbols-outlined">
                dashboard
              </span>
            </div>
            <h1>Dashboard</h1>
          </div>


          <div className="more-div-big-icon-div-inner pointer" onClick={agentNotification}>
            <div>
              <span className="material-symbols-outlined">notifications</span>
            </div>
            <h1>Notifications</h1>
          </div>


        </div>
        <div className="verticall_gap"></div>
        <div className="more-menus_inner">
          {/* {user && user.role === "admin" && (
            <div className="mm_inner">
              <h6 className="title">Properties</h6>
              <Link className="mm_single" to="/addproperty">
                <span className="material-symbols-outlined mms_icon">
                  shopping_bag
                </span>
                <h5>Add Property</h5>
                <h6>all properties to be shown</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  shopping_bag
                </span>
                <h5>Add Bills</h5>
                <h6>All The Trips You Can Track Here</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>PMS Payments</h5>
                <h6>All The Trips You Can Track Here</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Manage Tickets</h5>
                <h6>All The Trips You Can Track Here</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>
          )} */}
          {/* {user && user.role === "admin" && (
            <div className="mm_inner">
              <h6 className="title">Users</h6>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  shopping_bag
                </span>
                <h5>Customer List</h5>
                <h6>add new property</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  shopping_bag
                </span>
                <h5>Executive List</h5>
                <h6>All The Trips You Can Track Here</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Customer List</h5>
                <h6>All The Trips You Can Track Here</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Executive List</h5>
                <h6>All The Trips You Can Track Here</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>
          )} */}
          {/* {user && user.role === "admin" && (
            <div className="mm_inner">
              <h6 className="title">Settings</h6>
              <Link className="mm_single" to="/adminsettings">
                <span className="material-symbols-outlined mms_icon">flag</span>
                <h5>Logo</h5>
                <h6>set your current location</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Theme</h5>
                <h6>All The Trips You Can Track Here</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Site Language</h5>
                <h6>All The Trips You Can Track Here</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Payment Gateway</h5>
                <h6>update your app password</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>
          )} */}
          {/* {user && user.role === "admin" && (
            <div className="mm_inner">
              <h6 className="title">Master Data</h6>
              <Link className="mm_single" to="/countrylist">
                <span className="material-symbols-outlined mms_icon">flag</span>
                <h5>Add Country</h5>
                <h6>set your current location</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/statelist">
                <span className="material-symbols-outlined mms_icon">
                  g_translate
                </span>
                <h5>Add State</h5>
                <h6>All The Trips You Can Track Here</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/citylist">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Add City</h5>
                <h6>All The Trips You Can Track Here</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/localitylist">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Add Locality</h5>
                <h6>update your app password</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/societylist">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Add Society</h5>
                <h6>update your app password</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>
          )} */}
          {/* {user && user.role === "owner" && (
            <div className="mm_inner">
              <h6 className="title">Properties</h6>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  shopping_bag
                </span>
                <h5>Manage Properties</h5>
                <h6>add new property</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  shopping_bag
                </span>
                <h5>Manage Documents</h5>
                <h6>All The Trips You Can Track Here</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Manage Payments</h5>
                <h6>All The Trips You Can Track Here</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Manage Tickets</h5>
                <h6>update your app password</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>
          )} */}
          {/* {user && user.role === "owner" && (
            <div className="mm_inner">
              <h6 className="title">Properties</h6>
              <Link className="mm_single" to="/bills">
                <span className="material-symbols-outlined mms_icon">
                  shopping_bag
                </span>
                <h5>Bills</h5>
                <h6>Your all generated bills</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/search-property">
                <span className="material-symbols-outlined mms_icon">
                  shopping_bag
                </span>
                <h5>Property</h5>
                <h6>All properties</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/tickets">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Tickets</h5>
                <h6>All generated tickets</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/ownerdashboard">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Dashboard</h5>
                <h6>Your dashboard</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>
          )} */}
          {/* {user && user.role === "owner" && (
            <div className="mm_inner">
              <h6 className="title">Settings</h6>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  flag
                </span>
                <h5>Country</h5>
                <h6>set your current location</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  g_translate
                </span>
                <h5>Language</h5>
                <h6>setup your native language</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  favorite
                </span>
                <h5>Password</h5>
                <h6>update your app password</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="">
                <span className="material-symbols-outlined mms_icon">
                  lock_open
                </span>
                <h5>Logout</h5>
                <h6>sign-out from the application</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>
          )} */}
          {user && user.role === "propagentadmin" && (
            <div className="mm_inner">
              <h6 className="title">PropAgent Admin</h6>
              <Link className="mm_single" to="/propagentadmindashboard">
                <span className="material-symbols-outlined mms_icon">help</span>
                <h5>Dashboard</h5>
                <h6>Your all work</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/propagentusers">
                <span className="material-symbols-outlined mms_icon">help</span>
                <h5>All users</h5>
                <h6>users</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>)}
          {user && user.role === "propagentadmin" && (
            <div className="mm_inner">
              <h6 className="title">PropAgent Admin</h6>
              <Link className="mm_single" to="/propagentaddnotification/new">
                <span className="material-symbols-outlined mms_icon">help</span>
                <h5>Add notifications</h5>
                <h6>update your notification page</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
              <Link className="mm_single" to="/ticketdetail">
                <span className="material-symbols-outlined mms_icon">help</span>
                <h5>User Tickets</h5>
                <h6>all user tickets are here</h6>
                <span className="material-symbols-outlined mms_ra">
                  chevron_right
                </span>
              </Link>
            </div>)}
          <div className="mm_inner">
            <h6 className="title">Contact</h6>
            <Link className="mm_single" to="/faq">
              <span className="material-symbols-outlined mms_icon">quiz</span>
              <h5>FAQ </h5>
              <h6>Answers to Common Queries</h6>
              <span className="material-symbols-outlined mms_ra">
                chevron_right
              </span>
            </Link>
            <Link className="mm_single" to="/about-us">
              <span className="material-symbols-outlined mms_icon">
                import_contacts
              </span>
              <h5>About</h5>
              <h6>Discover Our Vision and Purpose</h6>
              <span className="material-symbols-outlined mms_ra">
                chevron_right
              </span>
            </Link>

            <Link className="mm_single" to="/createticket">
              <span className="material-symbols-outlined mms_icon">
                contact_page
              </span>
              <h5>Contact Us</h5>
              <h6>Let's Connect and Communicate</h6>
              <span className="material-symbols-outlined mms_ra">
                chevron_right
              </span>
            </Link>
            {/* {user === null ? <Navigate to="/propagentlogin" /> : <ContactForm></ContactForm>} */}
          </div>
          <div className="mm_inner">
            <h6 className="title">Others</h6>
            <Link className="mm_single" to="/createticket">
              <span className="material-symbols-outlined mms_icon">help</span>
              <h5>Help & Support</h5>
              <h6>Assistance and Support Resources</h6>
              <span className="material-symbols-outlined mms_ra">
                chevron_right
              </span>
            </Link>
            <Link className="mm_single" to="/propagentprivacypolicy">
              <span className="material-symbols-outlined mms_icon">report</span>
              <h5>Privacy Policy</h5>
              <h6>Understanding Our Privacy Commitment</h6>
              <span className="material-symbols-outlined mms_ra">
                chevron_right
              </span>
            </Link>
            <Link className="mm_single" to="/propagenttermsandcondition">
              <span className="material-symbols-outlined mms_icon">gavel</span>
              <h5>Terms & Condition</h5>
              <h6>Guidelines for Usage and Conduct</h6>
              <span className="material-symbols-outlined mms_ra">
                chevron_right
              </span>
            </Link>
          </div>



        </div>
        <div className="verticall_gap"></div>
      </section>
    </div>
  );
};

export default PGMoreMenu;
