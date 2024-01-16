import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { useEffect, useState } from "react";

// components
import Navbar from "./Components/Navbar";
import More from "./Components/More";
import Footer from "./Components/Footer";
// import SidebarNew from './components/SidebarNew'
import NavbarBottom from "./Components/NavbarBottom";

import PGPropertyList from "./pages/pgpropertylist/PGPropertyList"

// prop agent
import PGAgentDashboard from "./pages/roles/agent/PGAgentDashboard"
import PGAgentProperties from "./pages/roles/agent/PGPropAgentProperties";
import PGAgentAddProperties from "./pages/roles/agent/PGAgentAddProperties";
import PropAgentHome from "./pages/roles/agent/PropAgentHome";
import PropAgentNavbar from "./pages/roles/agent/PropAgentNavbar";
import PropAgentNavbarBottom from "./pages/roles/agent/PropAgentNavbarBottom";
import PropAgentSignup from "./pages/roles/agent/PropAgentSignup";
import PropAgentLogin from "./pages/roles/agent/PropAgenLogin";
import PropAgentPropertyCard from "./pages/roles/agent/PropAgentPropertyCard"
import PropAgentAdminDashboard from "./pages/roles/agent/PropagentAdminDashboard";
// import PropAgentAdminDashboard from "./pages/roles/agent/PropAgentAdminDashboard";
import PropAgentPrivacyPolicy from "./pages/guest/PropAgentPrivacyPolicy";
import PropagentTermsAndConditions from "./pages/guest/PropAgentTermsAndConditions";
import PropagentEnterOTP from "./pages/roles/agent/PropagentEnterOTP";
import PGPropAgentUsers from "./pages/roles/agent/PGPropAgentUsers";
import PGPropAgentInactiveUser from "./pages/roles/agent/PGAgentInactiveUser";
import PGPropAgentAddNotification from "./pages/roles/agent/PGPropAgentAddNotification";
import PGAgentTickets from "./pages/roles/agent/PGAgentTickets";
import TicketDetail from "./pages/roles/agent/TicketDetail";
import CreateTicket from "./pages/create/CreateTicket";
import ContactForm from "./pages/create/ContactForm";

// other pages


import PGProfile from "./pages/profile/PGProfile";
import PropertyStatus from "./Components/PropertyStatus";
import PDSingle from "./Components/PDSingle";
// import OnlineUsers from './components/OnlineUsers'

// styles
import "./App.css";
import "./pages/create/Create.css"
import "./pages/create/PGAddProperty.css"
import "./pages/pgpropertylist/PGPropetyList.css"
import "./pages/roles/admin/Settings.css"

import Home from "./pages/home/Home"

import AboutUs from "./pages/guest/AboutUs";
import ContactUs from "./pages/guest/ContactUs";
import Faq from "./pages/guest/Faq";
import PGMoreMenu from "./pages/more-menu/PGMoreMenu";
import PGSearch from "./pages/search/PGSearch";
import PGAgentPropertyDetails from "./pages/roles/agent/PGAgentPropertyDetails";
import PGPropAgentNotification from "./pages/roles/agent/PGPropAgentNotification";
import SearchBarAutoComplete from "./pages/search/SearchBarAutoComplete";

// import BillList from './components/BillList'

function App() {
  const { authIsReady, user } = useAuthContext();

  // console.log("user in App.js", user);
  // console.log("authIsReady in App.js", authIsReady);
  // console.log('user role in App.js', user.role)

  useEffect(() => { }, [user]);

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <PropAgentNavbar></PropAgentNavbar>

          <div className={"full-content page"}>
            <Routes>


              {/* Routes for PropAgent App : START */}

              {/* <Route path="/searchbar" element={<SearchBarAutoComplete></SearchBarAutoComplete>}></Route> */}

              <Route path="/" element={<PropAgentHome></PropAgentHome>}></Route>

              <Route
                path="/propagentlogin"
                element={
                  < PropAgentLogin />
                }
              ></Route>
              <Route
                path="/propagentsignup"
                element={
                  <  PropAgentLogin />
                }
              ></Route>
              <Route
                path="/propagententerotp"
                element={
                  <PropagentEnterOTP />
                }
              ></Route>



              <Route
                path="/agentdashboard"
                element={
                  user && user.status === 'active' && ((user.role === "propagent") || user.role === 'propagentadmin') ? (
                    <PGAgentDashboard></PGAgentDashboard>
                  ) : (

                    <Navigate to="/propagentlogin" />
                  )
                }
              ></Route>

              <Route
                path="/createticket"
                element={
                  user && user.status === 'active' && ((user.role === "propagent") || user.role === 'propagentadmin') ? (
                    <ContactForm />
                  ) : (

                    <Navigate to="/propagentlogin" />
                  )
                }
              ></Route>

              <Route
                path="/propagentadmindashboard"
                element={
                  user && user.status === 'active' && user.role === "propagentadmin" ? (
                    <PropAgentAdminDashboard></PropAgentAdminDashboard>
                  ) : (
                    <Navigate to="/propagentlogin" />
                  )
                }
              ></Route>

              <Route
                path="/propagentusers"
                element={
                  user && user.status === 'active' && user.role === "propagentadmin" ? (
                    <PGPropAgentUsers></PGPropAgentUsers>) : (
                    <Navigate to="/propagentlogin" />
                  )
                }
              ></Route>

              <Route

                path="/propagentnotification"
                element={
                  user && user.status === 'active' && (user.role === "propagent" || user.role === "propagentadmin") ?
                    <PGPropAgentNotification /> : <Navigate to="/propagentlogin" />
                }
              >

              </Route>
              <Route
                path="/ticketdetail"
                element={
                  user && user.status === 'active' && (user.role === "propagent" || user.role === "propagentadmin") ?
                    <TicketDetail /> : <Navigate to="/propagentlogin" />
                }
              ></Route>









              <Route
                path="/propagentaddnotification/:notificationid"
                element={
                  user && user.status === 'active'
                    && user.role === "propagentadmin"
                    ? (
                      <PGPropAgentAddNotification />) : (
                      <Navigate to="/propagentlogin" />
                    )
                }
              ></Route>

              <Route
                path="/tickets"
                element={
                  user && user.status === 'active'
                    && user.role === "propagentadmin"
                    ? (
                      <PGAgentTickets />) : (
                      <Navigate to="/propagentlogin" />
                    )
                }
              ></Route>





              <Route
                path="/agentproperties"
                element={
                  user && user.status === 'active' && ((user.role === "propagent") || (user.role === 'propagentadmin')) ? (
                    <PGAgentProperties></PGAgentProperties>
                  ) : (
                    <Navigate to="/propagentlogin" />
                  )
                  // <PGAgentProperties></PGAgentProperties>
                }
              ></Route>
              <Route
                path="/agentaddproperties/:propertyid"
                element={
                  user && user.status === 'active' && (user.role === "propagent" || user.role === "propagentadmin") ? (
                    <PGAgentAddProperties></PGAgentAddProperties>
                  ) : (
                    <Navigate to="/propagentlogin" />
                  )
                }
              ></Route>
              <Route
                path="/agentaddproperties/:id"
                element={
                  user && user.status === 'active' && (user.role === "propagent" || user.role === "propagentadmin") ? (
                    <PGAgentAddProperties></PGAgentAddProperties>
                  ) : (
                    <Navigate to="/propagentlogin" />
                  )
                }
              ></Route>
              <Route
                path="/agentpropertydetails/:id"
                element={
                  user && user.status === 'active' && ((user.role === "propagent") || user.role === 'propagentadmin') ? (
                    <PGAgentPropertyDetails />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route>
              <Route
                path="/agentpropertycard"
                element={
                  user && user.status === 'active' && user.role === 'propagent' ? (
                    <PropAgentPropertyCard />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route>

              <Route
                path="/agenthome"
                element={
                  <PropAgentHome></PropAgentHome>
                }
              ></Route>


              <Route
                path="/login"
                element={user ? <Navigate to="/" /> : < PropAgentLogin />}
              ></Route>
              <Route
                path="/signup"
                element={user ? <Navigate to="/" /> : < PropAgentLogin />}
              ></Route>
              <Route
                path="/profile"
                element={
                  user && user.status === 'active' && ((user.role === "propagent") || (user.role === 'propagentadmin')) ? (
                    <PGProfile />
                  ) : (
                    < PropAgentLogin />
                  )
                }
              ></Route>

              <Route
                path="/inactiveuser"
                element={< PGPropAgentInactiveUser />}
              ></Route>

              <Route
                path="/more-menu"
                element={<PGMoreMenu></PGMoreMenu>}
              ></Route>
              <Route path="/faq" element={<Faq></Faq>}></Route>
              <Route path="/about-us" element={<AboutUs />}></Route>
              <Route path="/contact-us" element={<ContactUs />}></Route>
              <Route path="/propagentprivacypolicy" element={
                <PropAgentPrivacyPolicy></PropAgentPrivacyPolicy>}
              ></Route>
              <Route
                path="/propagenttermsandcondition" element={
                  <PropagentTermsAndConditions></PropagentTermsAndConditions>
                }
              ></Route>

              {/* Routes for PropAgent App : END */}


              {/* <Route
                path="/search-property"
                element={<PGProperty></PGProperty>}
              ></Route> */}
              {/* <Route
                path="/pdsingle/:id"
                element={<PDSingle></PDSingle>}
              ></Route> */}




              {/* <Route path="/adminsettings" element={<AdminSettings />}></Route> */}

              {/* <Route
                path="/updatepwd"
                element={user ? <UpdatePassword /> : <PGLogin />}
              ></Route> */}

              {/* <Route
                exact
                path="/superadmindashboard"
                element={
                  user && user.role === "superadmin" ? (
                    <SuperAdminDashboard />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                exact
                path="/userlist"
                element={
                  user && user.role === "superadmin" ? (
                    <PGUserList />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/admindashboard"
                element={
                  user && user.role === "admin" ? (
                    <PGAdminDashboard />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/adminproperties"
                element={
                  user && user.role === "admin" ? (
                    <PGAdminProperties />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/addproperty"
                element={
                  user && user.role === "admin" ? (
                    <PGAddProperty />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}
              {/* <Route
                path="/addproperty_quick"
                element={
                  user && user.role === "admin" ? (
                    <PGAddPropertyQuick />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/addproperty/:propertyid"
                element={
                  user && user.role === "admin" ? (
                    <PGAddProperty />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/addbill/:propertyid"
                element={
                  user && user.role === "admin" ? (
                    <AddBill />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/addphoto"
                element={
                  user && user.role === "admin" ? (
                    <AddPhoto />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/adddocument"
                element={
                  user && user.role === "admin" ? (
                    <AddDocument />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}
              {/* <Route
                path="/adddocumentnew"
                element={
                  user && user.role === "admin" ? (
                    <AddDocumentNew />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}
              {/* <Route
                path="/users"
                element={
                  user && user.role === "admin" ? (
                    <UserList />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}
              {/* <Route
                path="/pgpropertylist"
                element={
                  user && user.role === "admin" ? (
                    <PGPropertyList />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}
              {/* <Route
                path="/pgsearch"
                element={
                  user && user.role === "admin" ? (
                    <PGSearch />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/propertystatus"
                element={
                  user && user.role === "admin" ? (
                    <PropertyStatus />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/propertyedit/:id"
                element={
                  user && user.role === "admin" ? (
                    <PGPropertyEdit />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/propertybills/:propertyid"
                element={
                  user && user.role === "admin" ? (
                    <PGPropertyBills />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/propertydetails"
                element={
                  user && user.role ? (
                    <PGPropertyDetails />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/bills"
                element={
                  user && user.role ? <PGBills /> : <Navigate to="/login" />
                }
              ></Route> */}

              {/* <Route
                path="/tickets"
                element={
                  user && user.role ? <PGTickets /> : <Navigate to="/login" />
                }
              ></Route> */}

              {/* <Route
                path="/userdashboard"
                element={
                  user && user.role === "user" ? (
                    <UserDashboard />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/ownerdashboard"
                element={
                  (user && user.role === "owner") ||
                    (user && user.role === "coowner") ? (
                    <PGOwnerDashboard />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}
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


              {/* <Route
                path="/more"
                element={user ? <More /> : <Navigate to="/login" />}
              ></Route> */}

              {/* <Route
                path="/tenantdashboard"
                element={
                  user && user.role === "tenant" ? (
                    <TenantDashboard />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/executivedashboard"
                element={
                  user && user.role === "propertymanager" ? (
                    <ExecutiveDashboard />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              ></Route> */}

              {/* <Route
                path="/countrylist"
                element={
                  user && user.role === "admin" ? (
                    <MasterCountryList />
                  ) : (
                    <PGLogin />
                  )
                }
              ></Route> */}
              {/* <Route
                path="/statelist"
                element={
                  user && user.role === "admin" ? (
                    <MasterStateList />
                  ) : (
                    <PGLogin />
                  )
                }
              ></Route> */}
              {/* <Route
                path="/citylist"
                element={
                  user && user.role === "admin" ? (
                    <MasterCityList />
                  ) : (
                    <PGLogin />
                  )
                }
              ></Route> */}
              {/* <Route
                path="/localitylist"
                element={
                  user && user.role === "admin" ? (
                    <MasterLocalityList />
                  ) : (
                    <PGLogin />
                  )
                }
              ></Route> */}
              {/* <Route
                path="/societylist"
                element={
                  user && user.role === "admin" ? (
                    <MasterSocietyList />
                  ) : (
                    <PGLogin />
                  )
                }
              ></Route> */}
              {/* <Route path="/error" element={<PGError />}></Route> */}
            </Routes>
          </div>
          <Footer></Footer>
          <PropAgentNavbarBottom />
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
