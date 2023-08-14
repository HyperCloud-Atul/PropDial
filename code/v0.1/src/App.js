import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import { useEffect } from 'react'
import { pushMessages } from './firebase/config'
import { getToken } from './firebase/config'

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
import PGPropertyEdit from './pages/roles/admin/PGPropertyEdit'
// owner
import PGOwnerDashboard from './pages/roles/owner/PGOwnerDashboard'
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
import PGError from './pages/app/PGError'
import MasterCountryList from './pages/create/MasterCountryList'
import MasterCityList from './pages/create/MasterCityList'
import MasterStateList from './pages/create/MasterStateList'
import MasterLocalityList from './pages/create/MasterLocalityList'
import MasterSocietyList from './pages/create/MasterSocietyList'
import PGTickets from './pages/roles/owner/PGTickets'
import PGCustomerProperties from './pages/roles/owner/PGCustomerProperties'
import PGPropertyPhotos from './pages/property/PGPropertyPhotos'
import PGPropertyBills from './pages/property/PGPropertyBills'
import PGPropertyDocuments from './pages/property/PGPropertyDocuments'
import PGOwnerBills from './pages/roles/owner/PGOwnerBills'
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


  async function requestUserPermissionForPushMessaging() {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      //Generate Token
      // const token = await getToken(pushMessages, { vapiKey: "BLXmmKhydA6InNLevtX6O7hdUPKO3BDY7PmjXULhUfXSMljWwIwruSofKqxUa9yEns-8VZygemnC6fnAiUX133g" })
      // const token = pushMessages.getToken({ vapiKey: "BLXmmKhydA6InNLevtX6O7hdUPKO3BDY7PmjXULhUfXSMljWwIwruSofKqxUa9yEns-8VZygemnC6fnAiUX133g" })
      const token = pushMessages.getToken()
      console.log('Token: ', token)
    } else if (permission === 'denied') {
      alert('You denied for the notification')
    }
  }

  useEffect(() => {

    requestUserPermissionForPushMessaging()

  }, [user])

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          {/* {user && <Sidebar setFlag={openSideNavbar} />} */}
          <Navbar />
          {/* <Navbar setFlag={openSideNavbar} /> */}

          <div className={'full-content'} >
            <Routes>

              <Route path='/' element={
                user ? < PGProfile /> : <PGLogin />
              }>
              </Route>

              <Route path='/adminsettings' element={<AdminSettings />}>
              </Route>

              <Route path='/updatepwd' element={user ? < UpdatePassword /> : <PGLogin />}>
              </Route>



              <Route exact path="/superadmindashboard" element={
                user && user.role === 'superadmin' ? <SuperAdminDashboard /> : <Navigate to="/login" />
              }>
              </Route>

              <Route exact path="/userlist" element={
                user && user.role === 'superadmin' ? <PGUserList /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/admindashboard" element={
                user && user.role === 'admin' ? < PGAdminDashboard /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/adminproperties" element={
                user && user.role === 'admin' ? < PGAdminProperties /> : <Navigate to="/login" />
              }>
              </Route>
              {/* 
              <Route path="/addproperty" element={
                user && user.role === 'admin' ? < PGAddProperty /> : <Navigate to="/login" />
              }>
              </Route> */}

              <Route path="/addproperty/:propertyid" element={
                user && user.role === 'admin' ? < PGAddProperty /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/propertyedit/:id" element={
                user && user.role ? < PGPropertyEdit /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/addbill" element={
                user && user.role === 'admin' ? < AddBill /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/addphoto" element={
                user && user.role === 'admin' ? < AddPhoto /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/adddocument" element={
                user && user.role === 'admin' ? < AddDocument /> : <Navigate to="/login" />
              }>
              </Route>



              <Route path="/propertydetails" element={
                user && user.role ? < PGPropertyDetails /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/customerproperties" element={
                user && user.role ? < PGCustomerProperties /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/propertybills" element={
                user && user.role ? < PGPropertyBills /> : <Navigate to="/login" />
              }>
              </Route>
              <Route path="/ownerbills" element={
                user && user.role ? < PGOwnerBills /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/propertyphotos" element={
                user && user.role ? < PGPropertyPhotos /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/propertydocuments" element={
                user && user.role ? < PGPropertyDocuments /> : <Navigate to="/login" />
              }>
              </Route>


              <Route path="/tickets" element={
                user && user.role ? < PGTickets /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/userdashboard" element={
                user && user.role === 'user' ? < UserDashboard /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/ownerdashboard" element={
                user && user.role === 'owner' ? < PGOwnerDashboard /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/more" element={
                user ? < More /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/tenantdashboard" element={
                user && user.role === 'tenant' ? < TenantDashboard /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path="/executivedashboard" element={
                user && user.role === 'executive' ? < ExecutiveDashboard /> : <Navigate to="/login" />
              }>
              </Route>

              <Route path='/login' element={user ? <Navigate to="/" /> : < PGLogin />}>
              </Route>
              <Route path='/signup' element={user ? <Navigate to="/" /> : < PGSignup />}>
              </Route>
              <Route path='/profile' element={user ? < PGProfile /> : < PGLogin />}>
              </Route>

              {/* Master data */}
              <Route path="/countrylist" element={
                user && user.role === 'admin' ? < MasterCountryList /> : <PGLogin />
              }>
              </Route>
              <Route path="/statelist" element={
                user && user.role === 'admin' ? < MasterStateList /> : <PGLogin />
              }>
              </Route>
              <Route path="/citylist" element={
                user && user.role === 'admin' ? < MasterCityList /> : <PGLogin />
              }>
              </Route>
              <Route path="/localitylist" element={
                user && user.role === 'admin' ? < MasterLocalityList /> : <PGLogin />
              }>
              </Route>
              <Route path="/societylist" element={
                user && user.role === 'admin' ? < MasterSocietyList /> : <PGLogin />
              }>
              </Route>
              <Route path="/error" element={
                < PGError />
              }>
              </Route>

            </Routes>
          </div>

          {user && user.role !== 'user' && <NavbarBottom></NavbarBottom>}

        </BrowserRouter>
      )
      }
      <br /><br /><br />
    </div >
  );
}

export default App
