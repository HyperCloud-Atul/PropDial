import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import { useEffect, useState } from 'react'

// components
import Navbar from './components/Navbar'
import More from './components/More'
// import SidebarNew from './components/SidebarNew'
import NavbarBottom from './components/NavbarBottom'

// pages
// superadmin
import SuperAdminDashboard from './pages/roles/superadmin/PGSuperAdminDashboard'
import PGUserList from './pages/roles/superadmin/PGUserList'
// admin
import PGAdminDashboard from './pages/roles/admin/PGAdminDashboard'
import PGAdminProperties from './pages/roles/admin/PGAdminProperties'
// owner
import PGOwnerDashboard from './pages/roles/owner/PGOwnerDashboard'
import PGBills from './pages/roles/owner/PGBills'
// tenant
import TenantDashboard from './pages/roles/tenant/TenantDashboard'
// executive
import ExecutiveDashboard from './pages/roles/executive/ExecutiveDashboard'

// other pages
import UserDashboard from './pages/dashboard/UserDashboard'
import PGLogin from './pages/login/PGLogin'
import PGSignup from './pages/login/PGSignup'
import PGProfile from './pages/profile/PGProfile'
import PGAddProperty from './pages/create/PGAddProperty'
import AddBill from './pages/create/AddBill'
import AddPhoto from './pages/create/AddPhoto'
import AddDocument from './pages/create/AddDocument'
// import Property from './pages/property/Property'
import PGPropertyDetails from './pages/property/PGPropertyDetails'
// import OnlineUsers from './components/OnlineUsers'

// styles
import './App.css'
import UpdatePassword from './pages/login/PGUpdatePassword'
import AdminSettings from './pages/roles/admin/AdminSettings'
// import BillList from './components/BillList'

function App() {
  const { authIsReady, user } = useAuthContext();
  // const [sideNavbar, setSideNavbar] = useState(null);
  // const [onlineUsers, setOnlineUsers] = useState(true);

  // function openSideNavbar(flag) {
  // console.log('opensidenavbar flag in aap.js : ', flag);
  // setSideNavbar(flag);
  // }
  // console.log('user in App.js', user)

  useEffect(() => {
    // if (user && user.roles && user.roles.includes('owner')) {
    //   setSideNavbar(null);
    // } else if (user && user.roles && user.roles.includes('tenant')) {
    //   setSideNavbar(null);
    // } else if (user && user.roles && user.roles.includes('executive')) {
    //   setSideNavbar(null);
    // } else if (user && user.roles && user.roles.includes('admin')) {
    //   setSideNavbar(true);
    // } else if (user && user.roles && user.roles.includes('superadmin')) {
    //   setSideNavbar(true);
    // } else {
    //   setSideNavbar(null);
    // }
    // console.log('user in useEffect App.js:', user);
  }, [user])

  // console.log('user in App:', user);

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          {/* {user && <Sidebar setFlag={openSideNavbar} />} */}
          <Navbar />
          {/* <Navbar setFlag={openSideNavbar} /> */}


          {/* {user && user.roles && (user.roles.includes('admin') || user.roles.includes('superadmin')) && <SidebarNew setFlag={openSideNavbar}></SidebarNew>} */}


          {/* <div className={sideNavbar === true ? 'full-content' : sideNavbar === false ? 'full-content sidebar-open' : sideNavbar === null ? 'full-content no-sidebar' : ''}> */}
          <div className={'full-content'} >
            <Routes>

              <Route path='/adminsettings' element={<AdminSettings />}>
              </Route>

              <Route path='/updatepwd' element={user ? < UpdatePassword /> : <PGLogin />}>
              </Route>

              <Route path='/' element={user ? < PGProfile /> : <PGLogin />}>
              </Route>

              <Route exact path="/superadmindashboard" element={
                user && user.roles && user.roles.includes('superadmin') ? <SuperAdminDashboard /> : <Navigate to="/login" />
              }>
              </Route>

              <Route exact path="/userlist" element={
                user && user.roles && user.roles.includes('superadmin') ? <PGUserList /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/admindashboard" element={
                user && user.roles && user.roles.includes('admin') ? < PGAdminDashboard /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/adminproperties" element={
                user && user.roles && user.roles.includes('admin') ? < PGAdminProperties /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/addproperty" element={
                user && user.roles && user.roles.includes('admin') ? < PGAddProperty /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/addbill" element={
                user && user.roles && user.roles.includes('admin') ? < AddBill /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/addphoto" element={
                user && user.roles && user.roles.includes('admin') ? < AddPhoto /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/adddocument" element={
                user && user.roles && user.roles.includes('admin') ? < AddDocument /> : <Navigate to="/login" />
              }>
              </Route>

              {/* <Route path="/properties/:id" element={
                user && user.roles ? < PGPropertyDetails /> : <Navigate to="/login" />
              }>
              </Route> */}
              <Route path="/propertydetails" element={
                user && user.roles ? < PGPropertyDetails /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/bills" element={
                user && user.roles ? < PGBills /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/userdashboard" element={
                user && user.roles && user.roles.includes('user') ? < UserDashboard /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/ownerdashboard" element={
                user && user.roles && user.roles.includes('owner') ? < PGOwnerDashboard /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/more" element={
                user ? < More /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/tenantdashboard" element={
                user && user.roles && user.roles.includes('tenant') ? < TenantDashboard /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/executivedashboard" element={
                user && user.roles && user.roles.includes('executive') ? < ExecutiveDashboard /> : <Navigate to="/login" />
              }>
              </Route>

              {/* <Route path="/properties/:id">
                  {!user && <Login />}
                  {user && <Property />}
                </Route> */}


              {/* <Route path="/create">
                  {!user && <Navigate to="/login" />}
                  {user && <Create />}
                </Route>
                <Route path="/projects/:id">
                  {!user && <Navigate to="/login" />}
                  {user && <Project />}
                </Route> */}


              <Route path='/login' element={user ? <Navigate to="/" /> : < PGLogin />}>
              </Route>
              <Route path='/signup' element={user ? <Navigate to="/" /> : < PGSignup />}>
              </Route>
              <Route path='/profile' element={user ? < PGProfile /> : < PGLogin />}>
              </Route>


              {/* <Route path="/login">
                  {user && <Navigate to="/" />}
                  {!user && <Login />}
                </Route>
                <Route path="/signup">
                  {user && user.displayName && <Navigate to="/" />}
                  {!user && <Signup />}
                </Route>
                <Route path="/profile">
                  {!user && <Navigate to="/" />}
                  {user && <Profile />}
                </Route> */}
            </Routes>
          </div>
          {/* </div> */}
          {/* {user && user.roles && user.roles.includes('admin') && <OnlineUsers setFlag={openOnlineUser} />} */}


          {user && user.roles && (!user.roles.includes('user')) && <NavbarBottom></NavbarBottom>}

        </BrowserRouter>
      )
      }
      <br /><br /><br />
    </div >
  );
}

export default App
