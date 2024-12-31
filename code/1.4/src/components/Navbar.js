import { Link, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useCollection } from "../hooks/useCollection";
import { projectFirestore } from "../firebase/config";
// styles & images
import "./Navbar.css";

export default function Navbar() {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const showHome = () => {
    navigate("/");
  };
  const showDashboard = () => {
    if (!user) {
      // User is not logged in, navigate to "/"
      navigate("/search-property");
      return; // Exit the function to prevent further checks
    } else {
      navigate("/dashboard");
    }
  };

  const showSecondPage = () => {
    if (!user) {
      // User is not logged in, navigate to "/"
      navigate("/properties");
      return; // Exit the function to prevent further checks
    } else {
      navigate("/dashboard");
    }
  };
  const showThirdPage = () => {
    if (!user) {
      // User is not logged in, navigate to "/"
      navigate("/about-us");
      return; // Exit the function to prevent further checks
    } else {
      // console.log('showThirdPage')
      if (user.role === "admin" || user.role === "superAdmin" || user.role === "executive")
        navigate("/allproperties/all");
      else navigate("/contact-us");
    }
  };

  const showFourthPage = () => {
    navigate("/more");
  };
  const logoClick = () => {
    navigate("/");
  };

  //Menus as per role
  let firstMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" className="menu_svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#303030"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>;
  let firstMenu = "Home"; //This is for all user type
  let secondMenuIcon = "";
  let secondMenu = "";
  let thirdMenuIcon = "";
  let thirdMenu = "";

  if (!user) {
    // firstMenuIcon = "home";
    // firstMenu = "Home";
    secondMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" className="menu_svg"  height="24px" viewBox="0 -960 960 960" width="24px" fill="#303030"><path d="M760-400v-260L560-800 360-660v60h-80v-100l280-200 280 200v300h-80ZM560-800Zm20 160h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z"/></svg>;
    secondMenu = "Property";
    thirdMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" className="menu_svg"  height="24px" viewBox="0 -960 960 960" width="24px" fill="#303030"><path d="M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z"/></svg>;
    thirdMenu = "About Us";
  }

  if (user && (user.role === "admin" || user.role === "superAdmin" || user.role === "executive")) {
    secondMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" className="menu_svg"  height="24px" viewBox="0 -960 960 960" width="24px" fill="#303030"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>;
    secondMenu = "Dashboard";
    thirdMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" className="menu_svg"  height="24px" viewBox="0 -960 960 960" width="24px" fill="#303030"><path d="M760-400v-260L560-800 360-660v60h-80v-100l280-200 280 200v300h-80ZM560-800Zm20 160h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z"/></svg>;
    thirdMenu = "Properties";
  }
  if (user && user.role === "owner") {
    secondMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" className="menu_svg"  height="24px" viewBox="0 -960 960 960" width="24px" fill="#303030"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>;
    secondMenu = "Dashboard";
    thirdMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" className="menu_svg"  height="24px" viewBox="0 -960 960 960" width="24px" fill="#303030"><path d="M760-400v-260L560-800 360-660v60h-80v-100l280-200 280 200v300h-80ZM560-800Zm20 160h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z"/></svg>;
    thirdMenu = "Contact";
  }
  if (user && user.role === "tenant") {
    secondMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" className="menu_svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#303030"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>;
    secondMenu = "Dashboard";
    thirdMenuIcon = <svg xmlns="http://www.w3.org/2000/svg" className="menu_svg"  height="24px" viewBox="0 -960 960 960" width="24px" fill="#303030"><path d="M760-400v-260L560-800 360-660v60h-80v-100l280-200 280 200v300h-80ZM560-800Zm20 160h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z"/></svg>;
    thirdMenu = "Contact";
  }
  // if (user && user.role === "executive") {
  //   secondMenuIcon = "dashboard";
  //   secondMenu = "Dashboard";
  //   thirdMenuIcon = "real_estate_agent";
  //   thirdMenu = "Contact";
  // }

  // Add class on scroll start
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollThreshold = 100; // Adjust this value based on when you want to add the class
      setIsScrolled(scrollTop > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = isScrolled
    ? "navbar sticky-top scrolled"
    : "navbar sticky-top";
  // Add class on scroll end

  // arrrays start

  // array of more class active on desktop
  const moreDesktopActivePaths = [
    "/more-menu",
    "/faq",
    "/countrylist",
    "/statelist",
    "/citylist",
    "/localitylist",
    "/societylist",
    "/newproperty",
  ];
  const shouldMoreDesktopActive = moreDesktopActivePaths.includes(
    location.pathname
  );
  const moreDesktopActiveClass = `menu_single pointer ${shouldMoreDesktopActive ? "active" : ""
    }`;
  // array of more class active on desktop

  // display navbar on top Array
  const excludedPaths = ["/", "/about-us", "/contact-us", "/faq"];
  const shouldOnTop = excludedPaths.includes(location.pathname);
  const navbarClassName = `navbarparent ${shouldOnTop ? "" : "on_top"}`;
  // display navbar on top Array

  // array for header social media hide after login
  const socialMediaHidePaths = ["/", "aboutus", "contactus", "more-menu"];
  const shouldSocialMediaHide = socialMediaHidePaths.includes(
    location.pathname
  );
  const socialMediaClass = `menu_social_media ${shouldSocialMediaHide ? "" : "d_none"
    }`;
  // array for header social media hide after login

  // hide navbar array
  // const navbarHidePaths = ["/login"];
  const navbarHidePaths = [""];
  const shouldNavbarHide = navbarHidePaths.includes(location.pathname);
  const navbarHideClass = `${shouldNavbarHide ? "navbarhide" : ""}`;
  // hide navbar array

  // arrrays  end

  // code of notification seen only for user start
  const { documents: notifications } = useCollection(
    "notifications-propdial",
    "",
    ["createdAt", "desc"]
  );

  // Filter for unread notifications
  const unreadNotifications = notifications?.filter(
    (notification) => (notification.viewedBy || []).includes(user && user.uid) === false
  );
  // code of notification seen only for user end

  // code of notification seen by user and guest both start
  // const [unseenCount, setUnseenCount] = useState(0);

  // // Fetch unseen notifications
  // useEffect(() => {
  //   if (user) {
  //     // For logged-in users, fetch unseen notifications from Firestore
  //     const unsubscribe = projectFirestore
  //       .collection("notifications-propdial")
  //       .where("seenBy", "not-in", [user.uid])
  //       .onSnapshot((snapshot) => {
  //         setUnseenCount(snapshot.size);
  //       });

  //     return () => unsubscribe();
  //   } else {
  //     // For guest users, check unseen notifications in session storage
  //     const storedNotifications = JSON.parse(sessionStorage.getItem("seenNotifications") || "[]");

  //     projectFirestore
  //       .collection("notifications-propdial")
  //       .get()
  //       .then((snapshot) => {
  //         const unseen = snapshot.docs.filter(
  //           (doc) => !storedNotifications.includes(doc.id)
  //         );
  //         setUnseenCount(unseen.length);
  //       });
  //   }
  // }, [user]);

  // // Clear the notification count when notifications page is opened
  // const handleNotificationClick = () => {
  //   if (user) {
  //     // For logged-in users, update Firestore
  //     projectFirestore
  //       .collection("notifications-propdial")
  //       .get()
  //       .then((snapshot) => {
  //         snapshot.docs.forEach((doc) => {
  //           if (!doc.data().seenBy.includes(user.uid)) {
  //             projectFirestore.collection("notifications-propdial").doc(doc.id).update({
  //               seenBy: [...doc.data().seenBy, user.uid],
  //             });
  //           }
  //         });
  //       });
  //   } else {
  //     // For guest users, update session storage
  //     projectFirestore
  //       .collection("notifications-propdial")
  //       .get()
  //       .then((snapshot) => {
  //         const notificationIds = snapshot.docs.map((doc) => doc.id);
  //         sessionStorage.setItem("seenNotifications", JSON.stringify(notificationIds));
  //       });
  //   }
  //   setUnseenCount(0); // Remove bell indicator
  // };
  // code of notification seen by user and guest both end
  return (
    <div className={navbarHideClass}>
      <header className={navbarClassName}>
        <nav className={navClass}>
          <ul>
            <li className="logo pointer" onClick={logoClick}>
              <img src="/assets/img/logo_propdial.png" alt="logo" />
            </li>
            <li className="main_menus">
              <div
                onClick={showHome}
                className={`menu_single pointer ${location.pathname === "/" ? "active" : ""
                  }`}
              >
                {/* <span className="material-symbols-outlined"> */}
                  {firstMenuIcon}
                {/* </span> */}
                {/* <span>
                  <img src="/assets/material-icons/home.svg" alt=""></img>
                </span> */}
                {firstMenu}
              </div>

              <div
                onClick={showSecondPage}
                className={`menu_single pointer ${location.pathname === "/dashboard" ? "active" : ""
                  }`}
              >
                {/* <span className="material-symbols-outlined"> */}
                  {secondMenuIcon}
                {/* </span> */}
                {/* <span>
                  <img src="/assets/material-icons/dashboard.svg" alt=""></img>
                </span> */}

                {secondMenu}
              </div>

              <div
                onClick={showThirdPage}
                className={`menu_single pointer ${location.pathname === "/contact-us" ||
                  location.pathname === "/allproperties"
                  ? "active"
                  : ""
                  }`}
              >
                {/* <span className="material-symbols-outlined"> */}
                  {thirdMenuIcon}
                {/* </span> */}
                {/* <span>
                  <img src="/assets/material-icons/real_estate_agent.svg" alt=""></img>
                </span> */}

                {thirdMenu}
              </div>

              <Link to="/more-menu">
                <div className={moreDesktopActiveClass}>
                  {/* <span className="material-symbols-outlined">more</span> */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="menu_svg"  height="24px" viewBox="0 -960 960 960" width="24px" fill="#303030"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
                  {/* <span>
                    <img src="/assets/material-icons/more.svg" alt=""></img>
                  </span> */}

                  More
                </div>
              </Link>
              {user ? (
                <Link
                  to="/profile"
                  className={`menu_single profile pointer ${location.pathname === "/profile" ? "active" : ""
                    }`}
                >
                  <span>Hi, {user.displayName}</span>
                  <div className="user_img">
                    {user.photoURL === "" ? (
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/userThumbnails%2F1default.png?alt=media&token=38880453-e642-4fb7-950b-36d81d501fe2&_gl=1*1bbo31y*_ga*MTEyODU2MDU1MS4xNjc3ODEwNzQy*_ga_CW55HF8NVT*MTY4NjIzODcwMC42OS4xLjE2ODYyMzkwMjIuMC4wLjA."
                        alt=""
                      />
                    ) : (
                      <img src={user.photoURL} alt="" />
                    )}
                  </div>
                </Link>
              ) : (
                <Link to="/login">
                  <div
                    className={`menu_single login pointer ${location.pathname === "/login" ? "active" : ""
                      }`}
                  >
                    {/* <span className="material-symbols-outlined ba_animation">
                      login
                    </span> */}
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#303030"><path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg>
                    {/* <span>
                      <img src="/assets/material-icons/login.svg" alt=""></img>
                    </span> */}
                    Login
                  </div>
                </Link>
              )}
            </li>
            <li className="menu_social_media">
              {/* <Link to="/ticketdetail">
                <img src="./assets/img/home/ticketicon_navbar.png" alt=""
                  className="pointer" />
              </Link> */}

              <Link to="/notification" className="notification_icon relative">
                <img
                  src="/assets/img/home/notification.png"
                  alt=""
                  className="pointer"
                />
                {unreadNotifications && unreadNotifications.length > 0 && (
                  <span className="notification-badge">
                    {unreadNotifications.length}

                  </span>
                )}
              </Link>

              {/* html for notification both guest and user  */}
              {/* <Link to="/notification" onClick={handleNotificationClick}>
                <span className="notification-bell">
                  🔔
                  {unseenCount > 0 && (
                    <span className="notification-count">{unseenCount}</span>
                  )}
                </span>
              </Link> */}
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
