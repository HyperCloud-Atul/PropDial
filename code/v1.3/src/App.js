import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { useDocument } from "./hooks/useDocument";
import { useEffect, useState } from "react";
import { projectMsg, projectFirestore } from "./firebase/config";
import { useCollection } from "./hooks/useCollection";

import toast, { Toaster } from "react-hot-toast"; // You can use any toast notification library or create your custom popup

// components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NavbarBottom from "./components/NavbarBottom";

import "./App.css";
import PhoneLogin from "./pdpages/phonelogin/PhoneLogin_reCaptchaV2";
import PGProfile from "./pdpages/profile/PGProfile";
import PGUserProfileDetails from "./pdpages/profile/PGUserProfileDetails";
import PGNotification from "./pdpages/notification/PGNotification";
import PGAboutUs from "./pdpages/about_us/PGAboutUs";
import PGPriacyPolicy from "./pdpages/privacypolicy/PGPrivacyPolicy";
import PGTerms from "./pdpages/terms/PGTerms";
import PGContactUs from "./pdpages/contact_us/PGContactUs";
import Faq from "./pdpages/faq/Faq";
import Home from "./pdpages/home/Home";
import PGMoreMenu from "./pdpages/more-menu/PGMoreMenu";
import PGSearchProperty from "./pdpages/property/PGSearchProperty";
import PGProperties from "./pdpages/property/PGProperties";
import PGCreateProperty from "./pdpages/property/PGCreateProperty";
import PGUpdateProperty from "./pdpages/property/PGUpdateProperty";
import PGOwnerDashboard from "./pdpages/roles/owner/PGOwnerDashboard";
import HowUse from "./pdpages/howUse/HowUse";

// ------------------------------------------------------------------------------------

// pages
// superadmin
import PGAgent from "./pdpages/roles/superAdmin/agent/PGAgent";
import UpdateAgent from "./pdpages/roles/superAdmin/agent/UpdateAgent";
// admin
import PGAdminDashboard from "./pages/roles/admin/PGAdminDashboard";
import PGAdminProperties from "./pages/roles/admin/PGAdminProperties";
import PGPropertyEdit from "./pages/roles/admin/PGPropertyEdit";
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
import PGEnquiry from "./pdpages/enquiry/PGEnquiry";
import UpdateEnquiry from "./pdpages/enquiry/UpdateEnquiry";
import ScrollToTop from "./components/ScrollToTop";
import FCMNotification from "./components/FCMNotification";
import PGExportExcel from "./pdpages/util/PGImportExcel";
import PGReferral from "./pdpages/referral/PGReferral";
// import { Login } from "@mui/icons-material";
import ReferralLogin from "./pdpages/phonelogin/ReferralLogin";
import AlreadyLogin from "./pdpages/referral/AlreadyLogin";

// New component import end

function App() {
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

  const { authIsReady, user } = useAuthContext();
  const [fcmMessage, setFCMMessage] = useState(null);

  //FCM Messaging User Request Permission and get the user token
  const requestPermission = async () => {
    try {
      await Notification.requestPermission();
      console.log("Notification permission granted.");

      // Get the token if permission is granted
      if (Notification.permission === "granted") {
        const token = await projectMsg.getToken();
        console.log("FCM Token:", token);
        // Save this token to your server/database as required
      }
    } catch (error) {
      console.error("Unable to get permission to notify.", error);
    }
  };

  const handleIncomingMessages = () => {
    projectMsg.onMessage((payload) => {
      console.log("Message received. ", payload);
      // Show notification to the user or update UI
      // alert(`${payload.notification.title}` + `${payload.notification.body}`);
      // alert(`${payload.notification.icon}`);

      // Display the message using a toast notification
      // toast(payload.notification.title, {
      //   icon: "🔔",
      //   // icon: "/assets/img/logo_propdial.png",
      //   body: payload.notification.body,
      // });

      setFCMMessage({
        // icon: "🔔",
        icon: "/assets/img/logo_propdial.png",
        title: payload.notification.title,
        body: payload.notification.body,
      });
    });
  };

  const handleCloseFCMNotification = () => {
    setFCMMessage(null);
  };

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

  return (
    <div className={currentModeStatus === "dark" ? "dark" : "light"}>
      {fcmMessage && (
        <FCMNotification
          icon={fcmMessage.icon}
          title={fcmMessage.title}
          body={fcmMessage.body}
          onClose={handleCloseFCMNotification}
        />
      )}

      {/* Copy Collection Button  */}
      {/* <button onClick={handleCopy}>Copy Collection docs to other collection</button> */}

      <div className="page">
        {authIsReady && (
          <BrowserRouter>
            <div>
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
                          <img src="/assets/img/hc-logo.png" alt=""></img>
                          <h1>
                            For swift and efficient access, consider installing
                            the app on your device.
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
                <Routes>
                  <Route
                    path="/importexcel/:collectionName"
                    element={<PGExportExcel />}
                  ></Route>
                  <Route
                    path="/login"
                    element={user ? <Navigate to="/profile" /> : <PhoneLogin />}
                  ></Route>
                  <Route
                    path="/alreadylogin"
                    element={<AlreadyLogin />}
                  ></Route>
                  <Route
                    path="/referrallogin/:referralCode/:referredBy"
                    element={
                      // user ? <Navigate to="/alreadylogin" /> :
                      <ReferralLogin />
                    }
                  ></Route>
                  <Route path="/" element={<Home></Home>}></Route>
                  <Route
                    path="/more-menu"
                    element={<PGMoreMenu></PGMoreMenu>}
                  ></Route>
                  <Route path="/stage4" element={<Stage4 />}></Route>
                  {/* <Route
                    path="/profile"
                    element={user ? <PGProfile /> : <PhoneLogin />}
                  ></Route> */}
                  <Route path="/profile" element={<PGProfile />}></Route>
                  <Route
                    path="/referral"
                    element={user ? <PGReferral /> : <Navigate to="/login" />}
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
                        <UpdateAgent />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  ></Route>

                  <Route path="/properties" element={<PGProperties />}></Route>

                  <Route
                    path="/propertydetails/:propertyid"
                    element={<PropertyDetails></PropertyDetails>}
                  ></Route>

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
                      user ? <PropertyUtilityBills /> : <Navigate to="/login" />
                    }
                  ></Route>
                  <Route
                    path="/property-ads/:propertyId"
                    element={user ? <PropertyAds /> : <Navigate to="/login" />}
                  ></Route>

                  <Route
                    path="/propertyinspectiondocument/:propertyId"
                    element={<PropertyInspectionDocuments />}
                  ></Route>
                  <Route
                    path="/allproperties/:filterOption"
                    element={
                      user &&
                        (user.role === "admin" || user.role === "superAdmin") ? (
                        <PGAdminProperty />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  ></Route>

                  {/* <Route
                    path="/addproperty"
                    element={
                      user && user.role !== "admin" ? (
                        <PGUpdateProperty />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  ></Route> */}
                  {/* <Route
                    path="/allproperties"
                    element={<PropdialAllProperties />}
                  ></Route> */}
                  {/* <Route
                    path="/addproperty_quick"
                    element={
                      user && (user.role === "admin" || user.role === "superAdmin") ? (
                        <PGAddPropertyQuick />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  ></Route> */}
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
                    path="/addnotification/:notificationid"
                    element={<AddNotification />}
                  ></Route>
                  <Route
                    path="/userlist"
                    element={
                      user && user.role === "superAdmin" ? (
                        <UserList />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  ></Route>
                  <Route path="/ratecard" element={<PGRateCard />}></Route>
                  <Route
                    path="/transactions/:propertyid"
                    element={<PGTransactions />}
                  ></Route>
                  <Route path="/payment" element={<Payment />}></Route>
                  {/* owner & co-owner */}
                  <Route
                    path="/dashboard"
                    element={user ? <PGDashboard /> : <PhoneLogin />}
                  ></Route>
                  {/* *********************************** */}
                  {/* <Route
              path="/search-property"
              element={<PGSearchProperty></PGSearchProperty>}
            ></Route> */}
                  <Route
                    path="/pgsearch"
                    element={
                      user &&
                        (user.role === "admin" || user.role === "superAdmin") ? (
                        <PGSearch />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  ></Route>
                  <Route
                    path="/more-menu"
                    element={<PGMoreMenu></PGMoreMenu>}
                  ></Route>
                  <Route
                    path="/adminsettings"
                    element={<AdminSettings />}
                  ></Route>
                  <Route
                    path="/updatepwd"
                    element={user ? <UpdatePassword /> : <PhoneLogin />}
                  ></Route>
                  <Route
                    path="/admindashboard"
                    element={
                      user &&
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
                        <PGCreateProperty />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  ></Route>
                  <Route
                    path="/updateproperty/:propertyid"
                    element={
                      user &&
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                      user && user.role ? <PGBills /> : <Navigate to="/login" />
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
                  {/* <Route
              path="/ownerdashboardold"
              element={
                user && user.role === "owner" ? (
                  <PGOwnerDashboardOld />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route> */}
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
                  {/* <Route
                    path="/profile"
                    element={user ? <PGProfile /> : <PhoneLogin />}
                  ></Route> */}
                  <Route
                    path="/countrylist"
                    element={
                      user &&
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
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
                        (user.role === "admin" || user.role === "superAdmin") ? (
                        <PGAgent />
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
                    element={<AddNotification />}
                  ></Route>
                  <Route
                    path="/notification"
                    element={<PGNotification />}
                  ></Route>
                  <Route
                    path="/profiledetails/:userProfileId"
                    element={<PGUserProfileDetails />}
                  ></Route>
                </Routes>
                {/* {user && user.role !== "user" && <NavbarBottom></NavbarBottom>} */}
                <Footer></Footer>
                <NavbarBottom></NavbarBottom>
              </div>
            </div>
          </BrowserRouter>
        )}
      </div>
    </div>
  );
}

export default App;
