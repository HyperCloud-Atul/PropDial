// import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import { useAuthContext } from "./hooks/useAuthContext";
import { useDocument } from "./hooks/useDocument";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import { projectMsg, projectFirestore } from "./firebase/config";
// import { projectFirestore } from "./firebase/config";
import { useCollection } from "./hooks/useCollection";
import SEOHelmet from "./components/SEOHelmet ";

import toast, { Toaster } from "react-hot-toast"; // You can use any toast notification library or create your custom popup

// components
import Navbar from "./components/Navbar";
import NavbarBottom from "./components/NavbarBottom";

import "./App.css";
import PhoneLogin from "./pdpages/phonelogin/PhoneLogin_reCaptchaV2";
import PGProfile from "./pdpages/profile/PGProfile";
import PGUserProfileDetails from "./pdpages/profile/PGUserProfileDetails";
import PGNotification from "./pdpages/notification/PGNotification";
import PGAttendance from "./pdpages/attendance/PGAttendance";
import PGHrAttendance from "./pdpages/attendance/PGHrAttendance";
import PGAboutUs from "./pdpages/about_us/PGAboutUs";

import PGPriacyPolicy from "./pdpages/privacypolicy/PGPrivacyPolicy";
import PGTerms from "./pdpages/terms/PGTerms";
import PGContactUs from "./pdpages/contact_us/PGContactUs";
import ChatApp from "./TicketSystem/ChatApp";
import PGMoreMenu from "./pdpages/more-menu/PGMoreMenu";
import PGSearchProperty from "./pdpages/property/PGSearchProperty";
import PGProperties from "./pdpages/property/PGProperties";
import PGCreateProperty from "./pdpages/property/PGCreateProperty";
import PGUpdateProperty from "./pdpages/property/PGUpdateProperty";
import MyProperties from "./pdpages/property/MyProperties";

import ViewInspection from "./pdpages/inspection/ViewInspection";
import InspectionDetails from "./pdpages/inspection/InspectionDetails";
import AddInspection from "./pdpages/inspection/AddInspection";
import PGOwnerDashboard from "./pdpages/roles/owner/PGOwnerDashboard";
import HowUse from "./pdpages/howUse/HowUse";
import BlogDetail from "./pdpages/blogs/BlogDetail";
import BlogEdit from "./pdpages/blogs/BlogEdit";
import BlogAdd from "./pdpages/blogs/BlogAdd";
import PGSocietyPage from "./pdpages/society/PGSocietyPage";
import City from "./pdpages/city/City";

// ------------------------------------------------------------------------------------

// pages
// superadmin
import PGAgent from "./pdpages/roles/superAdmin/agent/PGAgent";
import UpdateAgent from "./pdpages/roles/superAdmin/agent/UpdateAgent";
import AddUser from "./pdpages/roles/superAdmin/agent/addUser/AddUser";

// admin
import PGAdminDashboard from "./pages/roles/admin/PGAdminDashboard";
import PGAdminProperties from "./pages/roles/admin/PGAdminProperties";
import PGPropertyEdit from "./pages/roles/admin/PGPropertyEdit";
import FilteredProperties from "./pdpages/property/FilteredProperties";
// owner

import PGBills from "./pages/roles/owner/PGBills";
import PGTickets from "./pages/roles/owner/PGTickets";
// tenant
import TenantDashboard from "./pages/roles/tenant/TenantDashboard";
// executive
import ExecutiveDashboard from "./pages/roles/executive/ExecutiveDashboard";

// other pages
import UserDashboard from "./pages/dashboard/UserDashboard";

import PGSignup from "./pages/login/PGSignup";
// import PGAddPropertyQuick from "./pages/create/PGAddPropertyQuick";
import AddBill from "./pages/create/AddBill";
import AddPhoto from "./pages/create/AddPhoto";
import AddDocument from "./pages/create/AddDocument";
import AddDocumentNew from "./pages/create/AddDocumentNew";
import PropertyStatus from "./components/PropertyStatus";
import TenantDetails from "./components/TenantDetails";

import PGPropertyBills from "./pages/property/PGPropertyBills";
import PGPropertyDetails from "./pages/property/PGPropertyDetails";
import PDSingle from "./components/PDSingle";
// import OnlineUsers from './components/OnlineUsers'

// styles

import UpdatePassword from "./pages/login/PGUpdatePassword";
import AdminSettings from "./pages/roles/admin/AdminSettings";
import PGError from "./pages/app/PGError";
import MasterCountryList from "./pages/create/MasterCountryList";
import MasterCityList from "./pages/create/MasterCityList";
import MasterStateList from "./pages/create/MasterStateList";
import MasterLocalityList from "./pages/create/MasterLocalityList";
import MasterSocietyList from "./pages/create/MasterSocietyList";

import PGPropertyList from "./pages/pgpropertylist/PGPropertyList";
import PGSearch from "./pages/search/PGSearch";

// import BillList from './components/BillList'

// New component import start
import AddNotification from "./pages/create/AddNotification";
import CreateTicket from "./chatboard/CreateTicket";
import TicketDetail from "./chatboard/TicketDetail";
import PGSingleProperty from "./pages/property/PGSingleProperty";
import PropertyDetails from "./components/property/PropertyDetails";
import AddPropertyLayout from "./components/property/AddPropertyLayout";
import ViewPropertyLayout from "./components/property/ViewPropertyLayout";
import PropertyImages from "./components/property/PropertyImages";
import PGDashboard from "./pdpages/dashboard/PGDashboard";
import UserList from "./pdpages/roles/admin/UserList";
import PropdialAllProperties from "./components/property/PropdialAllProperties";
import Stage4 from "./pdpages/property/Stage4";
import Payment from "./pdpages/payment/Payment";
import PGTransactions from "./pdpages/property/PGTransactions";
import PGRateCard from "./pdpages/roles/admin/master/PGRateCard";
import PropertyDocuments from "./components/PropertyDocuments";
import PropertyAds from "./pdpages/property/PropertyAds";
import PropertyUtilityBills from "./pdpages/property/PropertyUtilityBills";
import PropertyKeyDetail from "./pdpages/property/PropertyKeyDetail";
import PropertyInspectionDocuments from "./components/PropertyInspectionDocuments";
import PGAdminProperty from "./pdpages/property/PGAdminProperty";
import UserProperties from "./pdpages/roles/admin/UserProperties";
import PGEnquiry from "./pdpages/enquiry/PGEnquiry";
import UpdateEnquiry from "./pdpages/enquiry/UpdateEnquiry";
import ScrollToTop from "./components/ScrollToTop";
// import FCMNotification from "./components/FCMNotification";
import PGExportExcel from "./pdpages/util/PGImportExcel";
import PGReferral from "./pdpages/referral/PGReferral";
// import { Login } from "@mui/icons-material";
import ReferralLogin from "./pdpages/phonelogin/ReferralLogin";
import AlreadyLogin from "./pdpages/referral/AlreadyLogin";
import Faq from "./pdpages/faq/Faq";
import EmailTest from "./testing/EmailTest";
import PGBlogs from "./pdpages/blogs/PGBlogs";
import { ToastContainer } from "react-toastify";
import AddAgent from "./pdpages/roles/superAdmin/agent/AddAgent";
// New component import end

// import Home from "./pdpages/home/Home";
const Home = React.lazy(() => import("./pdpages/home/Home"));
// import Footer from "./components/Footer";
const Footer = React.lazy(() => import("./components/Footer"));
const defaultTitle =
  "Propdial - Property Management Services for Rent, Buy, Lease a Property in India";
const defaultDescription =
  "Propdial offers expert property management services in India for buy, sell & rent. With 10+ years of experience, we serve Delhi NCR, Gurugram, Bangalore, Pune & more.";
function App() {
  const location = useLocation();
  //---------------------- Copy Collection Code - Start -----------------------------------
  // const { documents: dbCollectionDocument, error: dbCollectionDocumentError } =
  //   useCollection("users");  // name of existing documets collection

  // console.log(" Number of documents in the existing collection: ", dbCollectionDocument);

  // // Function to handle the button click and copy documents
  // const handleCopy = async () => {
  //   const cartCollectionRef = projectFirestore.collection("users-propagent");  // collection name of copy docs here

  //   try {
  //     // Loop through each user document
  //     for (const userDoc of dbCollectionDocument) {
  //       const docData = userDoc; // Already the document data
  //       const docId = userDoc.id; // Get document ID

  //       // Copy the entire document data to the 'cart' collection
  //       await cartCollectionRef.doc(docId).set(docData);

  //       console.log(`Documents copied: ${docId}`);
  //     }

  //     console.log("All documents copied successfully into new collection!");
  //   } catch (error) {
  //     console.error("Error copying users to cart: ", error);
  //   }
  // }

  // ---------------- Copy Collection Code - End ------------------------------

  // Start -  Remove the preloader when React mounts: Inside App.js, remove the preloader after React loads:
  useEffect(() => {
    document.getElementById("root").firstChild.classList.add("hide-preloader");
  }, []);
  // End - Remove the preloader when React mounts: Inside App.js, remove the preloader after React loads:

  const { authIsReady, user } = useAuthContext();
  // const [fcmMessage, setFCMMessage] = useState(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  console.log("authIsReady", authIsReady);

  useEffect(() => {
    // Fetch the latest version from the server
    fetch("/version.json")
      .then((response) => response.json())
      .then((data) => {
        const latestVersion = data.version;
        const currentVersion = process.env.REACT_APP_VERSION;

        // Compare versions
        if (
          latestVersion &&
          currentVersion &&
          latestVersion !== currentVersion
        ) {
          setIsUpdateAvailable(true);
        }
      })
      .catch((error) => console.error("Error fetching version:", error));
  }, []);

  const refreshApp = () => {
    // Reload the page to get the latest build
    window.location.reload(true);
  };

  //FCM Messaging User Request Permission and get the user token
  // const requestPermission = async () => {
  //   try {
  //     await Notification.requestPermission();
  //     console.log("Notification permission granted.");

  //     // Get the token if permission is granted
  //     if (Notification.permission === "granted") {
  //       const token = await projectMsg.getToken();
  //       console.log("FCM Token:", token);
  //       // Save this token to your server/database as required
  //     }
  //   } catch (error) {
  //     console.error("Unable to get permission to notify.", error);
  //   }
  // };

  // const handleIncomingMessages = () => {
  //   projectMsg.onMessage((payload) => {
  //     console.log("Message received. ", payload);
  //     // Show notification to the user or update UI
  //     // alert(`${payload.notification.title}` + `${payload.notification.body}`);
  //     // alert(`${payload.notification.icon}`);

  //     // Display the message using a toast notification
  //     // toast(payload.notification.title, {
  //     //   icon: "🔔",
  //     //   // icon: "/assets/img/logo_propdial.png",
  //     //   body: payload.notification.body,
  //     // });

  //     setFCMMessage({
  //       // icon: "🔔",
  //       icon: "/assets/img/logo_propdial.png",
  //       title: payload.notification.title,
  //       body: payload.notification.body,
  //     });
  //   });
  // };

  // const handleCloseFCMNotification = () => {
  //   setFCMMessage(null);
  // };

  useEffect(() => {
    //FCM Message Permission by End Users and get the user token
    // requestPermission();
    // Handle incoming messages
    // handleIncomingMessages();
  }, []);

  const [currentModeStatus, setCurrentModeStatus] = useState("dark");
  const { document: dbDisplayModeDocuments, error: dbDisplayModeError } =
    useDocument("settings", "mode");

  // PWA CODE START
  //  required to import useDocument
  const { document: dbTextContentDocuments, error: dbTextContentError } =
    useDocument("settings", "PWA");

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  function startChromeInstall() {
    // console.log('deferredPrompt: ', deferredPrompt)
    if (deferredPrompt) {
      // console.log("deferredPrompt: ", deferredPrompt)
      deferredPrompt.prompt();
    }
    setinstallPopupDiv(false);
  }

  const [installPopupDiv, setinstallPopupDiv] = useState(true);
  const closeInstallPopup = () => {
    setinstallPopupDiv(false);
  };
  // PWA CODE END

  useEffect(() => {
    //First time set display mode from db to useState variable and also store the same value in localStorage
    // console.log('local storage value:', localStorage.getItem('mode'))
    if (
      localStorage.getItem("mode") === null ||
      localStorage.getItem("mode") === "null" ||
      localStorage.getItem("mode") === ""
    ) {
      // console.log('dbdisplaymode: ', dbDisplayModeDocuments && dbDisplayModeDocuments.displayMode)
      setCurrentModeStatus(
        dbDisplayModeDocuments && dbDisplayModeDocuments.displayMode
      );
      localStorage.setItem(
        "mode",
        dbDisplayModeDocuments && dbDisplayModeDocuments.displayMode
      );
    }
    // Function to handle changes in localStorage
    const handleStorageChange = () => {
      const storedValue = localStorage.getItem("mode");
      setCurrentModeStatus(storedValue);
      // console.log('currentModeStatus:', currentModeStatus)
    };

    // Call the function initially
    handleStorageChange();

    // Listen for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dbDisplayModeDocuments]);

  // by default add title and description canonicallink in head tag

  // useEffect(() => {
  //   const updateMetaTags = () => {
  //     // Update title
  //     if (!document.querySelector("title") || document.title.trim() === "") {
  //       document.title = defaultTitle;
  //     }

  //     // Update meta description
  //     let metaDesc = document.querySelector("meta[name='description']");
  //     if (!metaDesc) {
  //       metaDesc = document.createElement("meta");
  //       metaDesc.setAttribute("name", "description");
  //       document.head.appendChild(metaDesc);
  //     }
  //     if (!metaDesc.getAttribute("content")?.trim()) {
  //       metaDesc.setAttribute("content", defaultDescription);
  //     }

  //     // Update Open Graph (OG) title
  //     let ogTitle = document.querySelector("meta[property='og:title']");
  //     if (!ogTitle) {
  //       ogTitle = document.createElement("meta");
  //       ogTitle.setAttribute("property", "og:title");
  //       document.head.appendChild(ogTitle);
  //     }
  //     if (!ogTitle.getAttribute("content")?.trim()) {
  //       ogTitle.setAttribute("content", defaultTitle);
  //     }

  //     // Update Open Graph (OG) description
  //     let ogDesc = document.querySelector("meta[property='og:description']");
  //     if (!ogDesc) {
  //       ogDesc = document.createElement("meta");
  //       ogDesc.setAttribute("property", "og:description");
  //       document.head.appendChild(ogDesc);
  //     }
  //     if (!ogDesc.getAttribute("content")?.trim()) {
  //       ogDesc.setAttribute("content", defaultDescription);
  //     }
  //   };

  //   updateMetaTags();
  // }, [location.pathname, defaultTitle, defaultDescription]);

  useEffect(() => {
    const updateMetaTags = () => {
      // Update title
      if (!document.querySelector("title") || document.title.trim() === "") {
        document.title = defaultTitle;
      }

      // Update meta description
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      if (!metaDesc.getAttribute("content")?.trim()) {
        metaDesc.setAttribute("content", defaultDescription);
      }

      // Update Open Graph (OG) title
      let ogTitle = document.querySelector("meta[property='og:title']");
      if (!ogTitle) {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        document.head.appendChild(ogTitle);
      }
      if (!ogTitle.getAttribute("content")?.trim()) {
        ogTitle.setAttribute("content", defaultTitle);
      }

      // Update Open Graph (OG) description
      let ogDesc = document.querySelector("meta[property='og:description']");
      if (!ogDesc) {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        document.head.appendChild(ogDesc);
      }
      if (!ogDesc.getAttribute("content")?.trim()) {
        ogDesc.setAttribute("content", defaultDescription);
      }

      // Update canonical link
      let canonicalLink = document.querySelector("link[rel='canonical']");
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      const currentUrl = window.location.href;
      if (canonicalLink.getAttribute("href") !== currentUrl) {
        canonicalLink.setAttribute("href", currentUrl);
      }
    };

    updateMetaTags();
  }, [location.pathname, defaultTitle, defaultDescription]);

  return (
    <div className={currentModeStatus === "dark" ? "dark" : "light"}>
      {/* <HelmetProvider> */}
      <SEOHelmet />
      {/* {fcmMessage && (
        <FCMNotification
          icon={fcmMessage.icon}
          title={fcmMessage.title}
          body={fcmMessage.body}
          onClose={handleCloseFCMNotification}
        />
      )} */}

      {/* Copy Collection Button  */}
      {/* <button onClick={handleCopy}>Copy Collection docs to other collection</button> */}

      <div className="page">
        <div>
          <div>
            {isUpdateAvailable && (
              <div className="update-notification">
                <p>A new version of the app is available!</p>
                <button onClick={refreshApp}>Update Now</button>
              </div>
            )}
            {/* Rest of your app */}
          </div>
          <div>
            {/* PWA INSTALLATION CODE START */}
            {dbTextContentDocuments &&
              dbTextContentDocuments.status == "active" ? (
              <>
                {" "}
                {deferredPrompt && (
                  <div
                    className={
                      installPopupDiv
                        ? "install-popup-div open"
                        : "install-popup-div"
                    }
                  >
                    <div>
                      <span
                        onClick={closeInstallPopup}
                        className="material-symbols-outlined close-button"
                      >
                        close
                      </span>
                      <img src="/assets/img/hc-logo.png" alt="propdial"></img>
                      <h1>
                        For swift and efficient access, consider installing the
                        app on your device.
                      </h1>
                      <button id="btn_install" onClick={startChromeInstall}>
                        Install App
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : null}
            {/* PWA INSTALLATION CODE END */}
            <ScrollToTop />
            <Navbar />
            {/* <Suspense fallback={<div>Loading...</div>}> */}
            <Suspense fallback={<span></span>}>
              <Routes>
                <Route path="/" element={<Home></Home>}></Route>
                <Route
                  path="/login"
                  element={user ? <Navigate to="/profile" /> : <PhoneLogin />}
                ></Route>
                <Route path="/alreadylogin" element={<AlreadyLogin />}></Route>
                <Route
                  path="/referrallogin/:referralCode"
                  element={
                    // user ? <Navigate to="/alreadylogin" /> :
                    <ReferralLogin />
                  }
                ></Route>
                <Route
                  path="/more-menu"
                  element={<PGMoreMenu></PGMoreMenu>}
                ></Route>
                <Route
                  path="/notification"
                  element={<PGNotification />}
                ></Route>
                <Route path="/how-use" element={<HowUse />}></Route>
                <Route
                  path="/privacypolicy"
                  element={<PGPriacyPolicy />}
                ></Route>
                <Route path="/terms" element={<PGTerms />}></Route>
                <Route path="/about-us" element={<PGAboutUs />}></Route>

                <Route path="/contact-us" element={<PGContactUs />}></Route>
                <Route path="/faq" element={<Faq></Faq>}></Route>
                <Route path="/emailTest" element={<EmailTest></EmailTest>}></Route>
                <Route path="/properties" element={<PGProperties />}></Route>
                {/* <Route path="/society-form" element={<PGSocietyForm />}></Route>
                <Route path="/society-page" element={<PGSocietyPage />}></Route> */}
                <Route
                  path="/more-menu"
                  element={<PGMoreMenu></PGMoreMenu>}
                ></Route>
                <Route path="/:country/:state/:city/:locality/:societyName/:id" element={<PGSocietyPage />} />

                {/* City Page Route */}
                <Route path="/city-page" element={<City/>} />




                {/* blog pages route  */}
                <Route path="/blogs" element={<PGBlogs />}></Route>
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/blog-edit/:id"
                  element={
                    user &&
                      (user.role === "frontdesk" || user.role === "executive" ||
                        user.role === "admin" || user.role === "hr" ||
                        user.role === "superAdmin") ? (
                      <BlogEdit />
                    ) : (
                      <Navigate to="/blogs" />
                    )
                  }
                ></Route>
                <Route
                  path="/add-blog"
                  element={
                    user &&
                    (user.role === "frontdesk" || 
                      user.role === "executive" ||
                      user.role === "admin" ||
                      user.role === "hr" ||
                      user.role === "superAdmin") ? (
                      <BlogAdd />
                    ) : (
                      <Navigate to="/blogs" />
                    )
                  }
                ></Route>

                {/* Restricted Routes start  */}
                {authIsReady && (
                  <>
                    <Route
                      path="/importexcel/:collectionName"
                      element={
                        user &&
                          (user.role === "superAdmin" ||
                            user.role === "admin") ? (
                          <PGExportExcel />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route path="/stage4" element={<Stage4 />}></Route>
                    <Route path="/profile" element={<PGProfile />}></Route>
                    <Route
                      path="/referral"
                      element={user ? <PGReferral /> : <Navigate to="/login" />}
                    ></Route>
                    <Route
                      path="/enquiry/:id"
                      element={
                        user &&
                          (user.role === "owner" ||
                            user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <PGEnquiry />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path={
                        user &&
                        (user.role === "owner"
                          ? "/enquiry-status/:id"
                          : "/edit-enquiry/:id")
                      }
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin" ||
                            user.role === "owner") ? (
                          <UpdateEnquiry />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/edit-agent/:id"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <UpdateAgent />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/allproperties/:filterOption"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin" ||
                            user.role === "executive") ? (
                          <PGAdminProperty />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    ></Route>
                     <Route path="/filtered-property" 
                        element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin"
                            //  || user.role === "executive"
                            )
                             ? (
                          <FilteredProperties />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                     />

                     <Route
                      path="/my-property"
                      element={
                        user ?
                         (
                          <MyProperties />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/add-property-layout/:propertyLayoutId"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin" ||
                            user.role === "executive") ? (
                          <AddPropertyLayout />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/propertydetails/:slug"
                      element={<PropertyDetails></PropertyDetails>}
                    ></Route>

                    <Route
                      path="/view-layout/:propertyLayoutId"
                      element={<ViewPropertyLayout></ViewPropertyLayout>}
                    ></Route>

                    <Route
                      path="/property-images/:propertyId"
                      element={<PropertyImages></PropertyImages>}
                    ></Route>

                    <Route
                      path="/inspection/:propertyid"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin" ||
                            user.role === "executive" ||
                            user.role === "owner") ? (
                          <ViewInspection />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/inspection-report/:inspectionid"
                      element={<InspectionDetails />}
                    ></Route>
                      <Route
                      path="/chatapp"
                      element={<ChatApp />}
                    ></Route>
                    
                    <Route
                      path="/add-inspection/:inspectionId"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "executive" ||
                            user.role === "superAdmin") ? (
                          <AddInspection />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    />
                    <Route
                      path="/tenantdetails/:tenantId"
                      element={<TenantDetails />}
                    ></Route>
                    <Route
                      path="/propertydocumentdetails/:propertyId"
                      element={
                        user ? <PropertyDocuments /> : <Navigate to="/login" />
                      }
                    ></Route>
                    <Route
                      path="/property-keys/:propertyId"
                      element={
                        user ? <PropertyKeyDetail /> : <Navigate to="/login" />
                      }
                    ></Route>
                    <Route
                      path="/property-utility-bills/:propertyId"
                      element={
                        user ? (
                          <PropertyUtilityBills />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/property-ads/:propertyId"
                      element={
                        user ? <PropertyAds /> : <Navigate to="/login" />
                      }
                    ></Route>
                    <Route
                      path="/propertyinspectiondocument/:propertyId"
                      element={<PropertyInspectionDocuments />}
                    ></Route>
                    <Route
                      path="/ticketdetail"
                      element={
                        user &&
                          user.status === "active" &&
                          (user.role === "owner" || user.role !== "admin") ? (
                          <TicketDetail />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/tickets"
                      element={
                        user && user.role ? (
                          <PGTickets />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/userlist"
                      element={user &&
                     (user.role === "hr" || user.role === "superAdmin") ? (
                          <UserList />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/ratecard"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <PGRateCard />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/transactions/:propertyid"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <PGTransactions />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/payment"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <Payment />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/dashboard"
                      element={user ? <PGDashboard /> : <PhoneLogin />}
                    ></Route>
                    <Route
                      path="/pgsearch"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <PGSearch />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/adminsettings"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <AdminSettings />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/updatepwd"
                      element={user ? <UpdatePassword /> : <PhoneLogin />}
                    ></Route>
                    <Route
                      path="/admindashboard"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <PGAdminDashboard />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/adminproperties"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <PGAdminProperties />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/newproperty"
                      element={
                        user &&
                          (user.role === "admin" || user.role === "executive" ||
                            user.role === "superAdmin") ? (
                          <PGCreateProperty />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                     <Route
                      path="/user-properties/:phoneNumber"
                      element={
                        user &&
                          (user.role === "admin" || 
                            user.role === "superAdmin") ? (
                          <UserProperties />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    ></Route>
                    
                    <Route
                      path="/updateproperty/:propertyid"
                      element={
                        user &&
                        (user.role === "admin" ||
                          user.role === "superAdmin" ||
                          user.role === "executive") ? (
                          <PGUpdateProperty />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/addbill/:propertyid"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <AddBill />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/addphoto"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <AddPhoto />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/adddocument"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <AddDocument />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/adddocumentnew"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <AddDocumentNew />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/pgpropertylist"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <PGPropertyList />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/propertystatus"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <PropertyStatus />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/propertyedit/:id"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <PGPropertyEdit />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/propertybills/:propertyid"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <PGPropertyBills />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/ratecard"
                      element={
                        user && user.role ? (
                          <PGRateCard />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/bills"
                      element={
                        user && user.role ? (
                          <PGBills />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/tickets"
                      element={
                        user && user.role ? (
                          <PGTickets />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/userdashboard"
                      element={
                        user && user.role === "user" ? (
                          <UserDashboard />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/ownerdashboard"
                      element={
                        (user && user.role === "owner") ||
                          (user && user.role === "coowner") ? (
                          <PGOwnerDashboard />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/tenantdashboard"
                      element={
                        user && user.role === "tenant" ? (
                          <TenantDashboard />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/executivedashboard"
                      element={
                        user && user.role === "propertymanager" ? (
                          <ExecutiveDashboard />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/login"
                      element={user ? <Navigate to="/" /> : <PhoneLogin />}
                    ></Route>
                    <Route
                      path="/signup"
                      element={user ? <Navigate to="/" /> : <PGSignup />}
                    ></Route>
                    <Route
                      path="/countrylist"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <MasterCountryList />
                        ) : (
                          <PhoneLogin />
                        )
                      }
                    ></Route>
                    <Route
                      path="/statelist"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <MasterStateList />
                        ) : (
                          <PhoneLogin />
                        )
                      }
                    ></Route>
                    <Route
                      path="/citylist"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <MasterCityList />
                        ) : (
                          <PhoneLogin />
                        )
                      }
                    ></Route>
                    <Route
                      path="/localitylist"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <MasterLocalityList />
                        ) : (
                          <PhoneLogin />
                        )
                      }
                    ></Route>
                    <Route
                      path="/societylist"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin" || user.role === "executive") ? (
                          <MasterSocietyList />
                        ) : (
                          <PhoneLogin />
                        )
                      }
                    ></Route>
                    <Route
                      path="/agents"
                      element={
                        user &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") ? (
                          <PGAgent />
                        ) : (
                          <PhoneLogin />
                        )
                      }
                    ></Route>

 <Route
                      path="/add-user"
                      element={
                        user &&
                          (user.role === "superAdmin") ? (
                          <AddUser />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    ></Route>
                    
                    <Route
                      path="/agents/new"
                      element={
                        user &&
                        (user.role === "admin" ||
                          user.role === "superAdmin") ? (
                          <AddAgent agentID={"new"} />
                        ) : (
                          <PhoneLogin />
                        )
                      }
                    ></Route>
                    <Route path="/error" element={<PGError />}></Route>
                    <Route
                      path="/pgsingleproperty"
                      element={<PGSingleProperty />}
                    ></Route>
                    <Route
                      path="/addnotification/:notificationid"
                      element={
                        user &&
                          (user.role === "superAdmin" ||
                            user.role === "admin") ? (
                          <AddNotification />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/profiledetails/:userProfileId"
                      element={
                        user && (user.role === "superAdmin" || user.role === "hr") ? (
                          <PGUserProfileDetails />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/attendance"
                      element={
                        user?.isEmployee && user?.isAttendanceRequired ? (
                          <PGAttendance />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    ></Route>
                    <Route
                      path="/attendance-dashboard"
                      element={
                        user &&
                          (user.role === "hr" || user.role === "superAdmin") ? (
                          <PGHrAttendance />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    ></Route>
                  </>
                )}
                {/* Restricted Routes end  */}
              </Routes>
              <Footer></Footer>
            </Suspense>
            {/* {user && user.role !== "user" && <NavbarBottom></NavbarBottom>} */}
            {/* <Footer></Footer> */}
            <NavbarBottom></NavbarBottom>
            <ToastContainer />
          </div>
        </div>
      </div>
      {/* </HelmetProvider> */}
    </div>
  );
}

export default App;
