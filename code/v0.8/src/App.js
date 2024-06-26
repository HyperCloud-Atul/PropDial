import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { useEffect, useState } from "react";

// components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NavbarBottom from "./components/NavbarBottom";
import More from "./components/More";


import "./App.css";
import PhoneLogin from "./pdpages/profile/PhoneLogin";
import PGProfile from "./pdpages/profile/PGProfile";
import PGNotification from "./pdpages/notification/PGNotification";
import PGAboutUs from "./pdpages/about_us/PGAboutUs";
import PGContactUs from "./pdpages/contact_us/PGContactUs";
import Faq from "./pdpages/faq/Faq";
import Home from "./pdpages/home/Home";
import PGMoreMenu from "./pdpages/more-menu/PGMoreMenu";
import PGSearchProperty from "./pdpages/property/PGSearchProperty";
import PGProperties from "./pdpages/property/PGProperties";
import PGAddProperty from "./pdpages/property/PGAddProperty";
import PGOwnerDashboard from "./pdpages/roles/owner/PGOwnerDashboard";

// ------------------------------------------------------------------------------------


// pages
// superadmin
import SuperAdminDashboard from "./pages/roles/superadmin/PGSuperAdminDashboard";
import PGUserList from "./pages/roles/superadmin/PGUserList";
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
// prop agent
import PGAgentDashboard from "./pages/roles/agent/PGAgentDashboard";
import PGAgentProperties from "./pages/roles/agent/PGAgentProperties";
import PGAgentAddProperties from "./pages/roles/agent/PGAgentAddProperties";
import PropAgentHome from "./pages/roles/agent/PropAgentHome";

// other pages
import UserDashboard from "./pages/dashboard/UserDashboard";

import PGSignup from "./pages/login/PGSignup";


import PGAddPropertyQuick from "./pages/create/PGAddPropertyQuick";
import AddBill from "./pages/create/AddBill";
import AddPhoto from "./pages/create/AddPhoto";
import AddDocument from "./pages/create/AddDocument";
import AddDocumentNew from "./pages/create/AddDocumentNew";
import PropertyStatus from "./components/PropertyStatus";


import PGPropertyBills from "./pages/property/PGPropertyBills";
import PGPropertyDetails from "./pages/property/PGPropertyDetails";

import UserList from "./pages/user/UserList";

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
import PGDaashboard from "./pdpages/dashboard/PGDashboard";

// New component import start 

function App() {
  const { authIsReady, user } = useAuthContext();

  useEffect(() => { }, [user]);

  return (
    <div className="page">
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route
              path="/login"
              element={<PhoneLogin />}
            ></Route>
            <Route path="/" element={<Home></Home>}></Route>
            <Route
              path="/more-menu"
              element={<PGMoreMenu></PGMoreMenu>}
            ></Route>
            <Route
              path="/profile"
              element={user ? <PGProfile /> : <PhoneLogin />}
            ></Route>
            <Route
              path="/notification"
              element={< PGNotification />}
            ></Route>
            <Route path="/about-us" element={<PGAboutUs />}></Route>
            <Route path="/contact-us" element={<PGContactUs />}></Route>
            <Route path="/faq" element={<Faq></Faq>}></Route>
            <Route
              path="/properties"
              element={< PGProperties />}
            ></Route>
            <Route
              path="/propertydetails/:id"
              element={<PropertyDetails></PropertyDetails>}
            ></Route>
            <Route
              path="/addproperty"
              element={
                user && user.role !== "admin" ? (
                  <PGAddProperty />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>

            <Route
              path="/addproperty_quick"
              element={
                user && user.role === "admin" ? (
                  <PGAddPropertyQuick />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>

            <Route
              path="/ticketdetail"
              element={
                user && user.status === 'active' && (user.role !== "propagent" || user.role !== "propagentadmin") ?
                  <TicketDetail /> : <Navigate to="/phonelogin" />
              }
            ></Route>
            <Route
              path="/tickets"
              element={
                user && user.role ? <PGTickets /> : <Navigate to="/login" />
              }
            ></Route>
            <Route
              path="/addnotification/:notificationid"
              element={< AddNotification />}
            ></Route>

            {/* owner & co-owner */}
            <Route
              path="/dashboard"
              element={user ? < PGDaashboard /> : <PhoneLogin />}
            ></Route>

            {/* *********************************** */}

            {/* <Route
              path="/search-property"
              element={<PGSearchProperty></PGSearchProperty>}
            ></Route> */}



            <Route
              path="/pgsearch"
              element={
                user && user.role === "admin" ?
                  (
                    <PGSearch />
                  )
                  : (
                    <Navigate to="/login" />
                  )
              }
            ></Route>
            <Route
              path="/more-menu"
              element={<PGMoreMenu></PGMoreMenu>}
            ></Route>

            <Route path="/adminsettings" element={<AdminSettings />}></Route>

            <Route
              path="/updatepwd"
              element={user ? <UpdatePassword /> : <PhoneLogin />}
            ></Route>

            <Route
              exact
              path="/superadmindashboard"
              element={
                user && user.role === "superadmin" ? (
                  <SuperAdminDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>

            <Route
              exact
              path="/userlist"
              element={
                user && user.role === "superadmin" ? (
                  <PGUserList />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>

            <Route
              path="/admindashboard"
              element={
                user && user.role === "admin" ? (
                  <PGAdminDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>

            <Route
              path="/adminproperties"
              element={
                user && user.role === "admin" ? (
                  <PGAdminProperties />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>


            <Route
              path="/addproperty/:propertyid"
              element={
                user && user.role === "admin" ? (
                  <PGAddProperty />
                ) : (
                  <PhoneLogin />
                )
              }
            ></Route>

            <Route
              path="/addbill/:propertyid"
              element={
                user && user.role === "admin" ? (
                  <AddBill />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>

            <Route
              path="/addphoto"
              element={
                user && user.role === "admin" ? (
                  <AddPhoto />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>

            <Route
              path="/adddocument"
              element={
                user && user.role === "admin" ? (
                  <AddDocument />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>
            <Route
              path="/adddocumentnew"
              element={
                user && user.role === "admin" ? (
                  <AddDocumentNew />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>
            <Route
              path="/users"
              element={
                user && user.role === "admin" ? (
                  <UserList />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>
            <Route
              path="/pgpropertylist"
              element={
                user && user.role === "admin" ? (
                  <PGPropertyList />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>


            <Route
              path="/propertystatus"
              element={
                user && user.role === "admin" ? (
                  <PropertyStatus />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>

            <Route
              path="/propertyedit/:id"
              element={
                user && user.role === "admin" ? (
                  <PGPropertyEdit />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>

            <Route
              path="/propertybills/:propertyid"
              element={
                user && user.role === "admin" ? (
                  <PGPropertyBills />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>

            <Route
              path="/propertydetails"
              element={
                user && user.role ? (
                  <PGPropertyDetails />
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
                user && user.role ? <PGTickets /> : <Navigate to="/login" />
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
              path="/agentdashboard"
              element={
                user && user.role === "propagent" ? (
                  <PGAgentDashboard></PGAgentDashboard>
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>
            <Route
              path="/agentproperties"
              element={
                user && user.role === "propagent" ? (
                  <PGAgentProperties></PGAgentProperties>
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>
            <Route
              path="/agentaddproperties"
              element={
                user && user.role === "propagent" ? (
                  <PGAgentAddProperties></PGAgentAddProperties>
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
              path="/createticket"
              element={
                user && user.status === 'active' &&
                  ((user.role !== "propagent") || user.role !== 'propagentadmin')
                  ? (
                    <CreateTicket />
                  ) : (

                    <Navigate to="/phonelogin" />
                  )
              }
            ></Route>
            <Route
              path="/ticketdetail"
              element={
                user && user.status === 'active' && (user.role !== "propagent" || user.role !== "propagentadmin") ?
                  <TicketDetail /> : <Navigate to="/phonelogin" />
              }
            ></Route>

            <Route
              path="/more"
              element={user ? <More /> : <Navigate to="/login" />}
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
              path="/profile"
              element={user ? <PGProfile /> : <PhoneLogin />}
            ></Route>

            <Route
              path="/countrylist"
              element={
                user && user.role === "admin" ? (
                  <MasterCountryList />
                ) : (
                  <PhoneLogin />
                )
              }
            ></Route>
            <Route
              path="/statelist"
              element={
                user && user.role === "admin" ? (
                  <MasterStateList />
                ) : (
                  <PhoneLogin />
                )
              }
            ></Route>
            <Route
              path="/citylist"
              element={
                user && user.role === "admin" ? (
                  <MasterCityList />
                ) : (
                  <PhoneLogin />
                )
              }
            ></Route>
            <Route
              path="/localitylist"
              element={
                user && user.role === "admin" ? (
                  <MasterLocalityList />
                ) : (
                  <PhoneLogin />
                )
              }
            ></Route>
            <Route
              path="/societylist"
              element={
                user && user.role === "admin" ? (
                  <MasterSocietyList />
                ) : (
                  <PhoneLogin />
                )
              }
            ></Route>
            <Route path="/error" element={<PGError />}></Route>


            <Route
              path="/pgsingleproperty"
              element={< PGSingleProperty />}
            ></Route>


            <Route
              path="/addnotification/:notificationid"
              element={< AddNotification />}
            ></Route>

            <Route
              path="/notification"
              element={< PGNotification />}
            ></Route>
          </Routes>
          {/* {user && user.role !== "user" && <NavbarBottom></NavbarBottom>} */}
          <Footer></Footer>
          <NavbarBottom></NavbarBottom>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
