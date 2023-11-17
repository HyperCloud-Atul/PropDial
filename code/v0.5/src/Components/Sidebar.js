import { NavLink, Link } from "react-router-dom"
import { useAuthContext } from '../hooks/useAuthContext'

// components
import Avatar from "./Avatar"

// styles & images
import "./Sidebar.css"
import DashboardIcon from '../assets/dashboard_icon.svg'
import AddIcon from '../assets/add_icon.svg'
import { useState } from "react"

export default function Sidebar(props) {
  const { user } = useAuthContext()

  const [sideNavbar, setSideNavbar] = useState(false);
  function openSideNavbar() {
    setSideNavbar(!sideNavbar);
    props.setFlag(sideNavbar);
  }

  return (
    <div className={sideNavbar ? 'sidebar open' : 'sidebar'}>
      <div className="sidebar-arrow" onClick={openSideNavbar}>
        <span className="material-symbols-outlined" style={{ transition: '1s', transform: sideNavbar ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          arrow_forward
        </span>
      </div>
      <div className="sidebar-content">
        <div className="sidebar-content-inner">
          <div className="user">
            <Avatar src={user.photoURL} />
            <p>Hey {user.displayName}</p>
            <Link to="/profile">Profile</Link>
          </div>
          <nav className="links">
            <ul>

              {user && user.role === 'superadmin' &&
                <li>
                  <NavLink exact to="/superadmindashboard">
                    <img src={DashboardIcon} alt="dashboard icon" />
                    <span>Super Admin</span>
                  </NavLink>
                </li>
              }

              {user && user.role === 'admin' &&
                <li>
                  <NavLink exact to="/admindashboard">
                    <img src={DashboardIcon} alt="dashboard icon" />
                    <span>Admin Dashboard</span>
                  </NavLink>
                </li>
              }

              {user && user.role === 'admin' &&
                <li>
                  <NavLink to="/addproperty">
                    <img src={AddIcon} alt="add property icon" />
                    <span>Add Property</span>
                  </NavLink>
                </li>
              }

              {user && user.role === 'owner' &&
                <li>
                  <NavLink exact to="/ownerdashboard">
                    <img src={DashboardIcon} alt="dashboard icon" />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
              }

              {user && user.role === 'tenant' &&
                <li>
                  <NavLink exact to="/tenantdashboard">
                    <img src={DashboardIcon} alt="dashboard icon" />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
              }

              {user && user.role === 'propertymanager' &&
                <li>
                  <NavLink exact to="/executivedashboard">
                    <img src={DashboardIcon} alt="dashboard icon" />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
              }

              <li>
                <NavLink to="/profile">
                  <img src={AddIcon} alt="add property icon" />
                  <span>Logout</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
