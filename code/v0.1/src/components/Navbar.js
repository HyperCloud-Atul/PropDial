import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'

// styles & images
import './Navbar.css'
import Temple from '../assets/img/logo.png'
import { useState } from 'react'

export default function Navbar() {
  const { logout, isPending } = useLogout()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  function logoutSetPadding() {
    // props.setFlag(null);
    // console.log('in function logoutSetPadding', props.setFlag);    
    logout();
  }

  // const [expandNavbar, setExpandNavbar] = useState(false);

  // const openNavbarMenu = () => {
  //   setExpandNavbar(true);
  // };

  // const closeNavbarMenu = () => {
  //   setExpandNavbar(false);
  // };

  const showDashboard = () => {
    if (user && user.roles && user.roles.includes('superadmin')) {
      // console.log('in superadmin', user.roles)
      navigate('/superadmindashboard')
    }

    if (user && user.roles && user.roles.includes('admin')) {
      // console.log('in admin', user.roles)
      navigate('/admindashboard')
    }

    if (user && user.roles && user.roles.includes('owner')) {
      // console.log('in user', user.roles)
      navigate('/ownerdashboard')
    }

    if (user && user.roles && user.roles.includes('tenant')) {
      // console.log('in user', user.roles)
      navigate('/tenantdashboard')
    }
    if (user && user.roles && user.roles.includes('executive')) {
      // console.log('in user', user.roles)
      navigate('/executivedashboard')
    }
  }

  const showSecondPage = () => {
    if (user && user.roles && user.roles.includes('admin')) {
      // console.log('in user', user.roles)
      navigate('/adminproperties')
    }
    if (user && user.roles && user.roles.includes('owner')) {
      // console.log('in user', user.roles)
      navigate('/bills')
    }
  }

  const showFourthPage = () => {
    navigate('/more')
  }

  //Menus as per roles
  let firstMenuIcon = ''
  let firstMenu = '' //This is for all user type
  let secondMenuIcon = ''
  let secondMenu = ''
  let thirdMenuIcon = ''
  let thirdMenu = ''
  let fourthMenu = ''
  let fourthMenuIcon = ''
  if (user && !user.roles.includes('user')) {
    firstMenuIcon = 'home'
    firstMenu = 'Dashboard'
    fourthMenuIcon = 'apps'
    fourthMenu = 'More'
  }
  // if (user && user.roles && user.roles.includes('superadmin')) {
  //   secondMenu = 'Properties'
  //   thirdMenu = 'Users'
  //   fourthMenu = 'More'
  // }
  if (user && user.roles && user.roles.includes('admin')) {
    secondMenuIcon = 'analytics'
    secondMenu = 'Properties'
    thirdMenuIcon = 'confirmation_number';
    thirdMenu = 'Users'
  }
  if (user && user.roles && user.roles.includes('owner')) {
    secondMenuIcon = 'receipt_long'
    secondMenu = 'Bills'
    thirdMenuIcon = 'support_agent';
    thirdMenu = 'Tickets'
  }
  if (user && user.roles && user.roles.includes('tenant')) {
    secondMenu = 'Rent'
    thirdMenu = 'Tickets'
  }
  if (user && user.roles && user.roles.includes('executive')) {
    secondMenu = 'Bills'
    thirdMenu = 'Tickets'
  }

  return (
    <nav className="navbar sticky-top">
      <ul>
        <li className="logo">
          <img src={Temple} alt="logo" />
          {/* <span>Hyper Cloud</span> */}
        </li>

        {user && (
          <div className='small'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div></div>
              <li>
                <div className='navbar-notification-div'>
                  <span className="material-symbols-outlined">
                    notifications
                  </span>
                  <div></div>
                </div>
              </li>
            </div>
          </div>
        )}

        <div className='large'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div></div>
            <div className='navbar-laptop-menu-links-div'>

              <div className='navbar-laptop-menu-links'>

                <div onClick={showDashboard}>
                  <span className="material-symbols-outlined">
                    {firstMenuIcon}
                  </span>
                  <h1>{firstMenu}</h1>
                </div>

                <div onClick={showSecondPage}>
                  <span className="material-symbols-outlined">
                    {secondMenuIcon}
                  </span>
                  <h1>{secondMenu}</h1>
                </div>

                <div>
                  <span className="material-symbols-outlined">
                    {thirdMenuIcon}
                  </span>
                  <h1>{thirdMenu}</h1>
                </div>

                <div onClick={showFourthPage}>
                  <span className="material-symbols-outlined">
                    {fourthMenuIcon}
                  </span>
                  <h1>{fourthMenu}</h1>
                </div>

              </div>

              {user && !user.roles.includes('user') &&
                <div className='navbar-laptop-menu-icons-div'>
                  <div className='navbar-user-icon'>
                    <Link to="/profile">
                      {/* <span className="material-symbols-outlined">
                      person
                    </span> */}
                      {user.photoURL === '' ? <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/userThumbnails%2F1default.png?alt=media&token=38880453-e642-4fb7-950b-36d81d501fe2&_gl=1*1bbo31y*_ga*MTEyODU2MDU1MS4xNjc3ODEwNzQy*_ga_CW55HF8NVT*MTY4NjIzODcwMC42OS4xLjE2ODYyMzkwMjIuMC4wLjA." alt="" /> : <img src={user.photoURL} alt="" />}
                    </Link>
                  </div>

                  <li>
                    <div className='navbar-notification-div'>
                      <span className="material-symbols-outlined">
                        notifications
                      </span>
                      <div></div>
                    </div>
                  </li>

                  {/* <button className='btn'>Try Our New ChatBot</button> */}

                  {/* <div className='navbar-laptop-menu-icons-div-hamburger-icon' onClick={openNavbarMenu}> */}
                  <div className='navbar-laptop-menu-icons-div-hamburger-icon'>
                    <span className="material-symbols-outlined">
                      menu
                    </span>
                  </div>
                </div>
              }

            </div>

          </div>

          {/* <div className={expandNavbar ? 'navbar-menu-expand-div open' : 'navbar-menu-expand-div'}>
            <div className='navbar-menu-expand-div-content'>
              <div className='navbar-menu-expand-div-close-btn' onClick={closeNavbarMenu}>
                <span className="material-symbols-outlined">
                  close
                </span>
              </div>

              <div className='navbar-menu-expand-div-menu'>
                <h1>Home</h1>
                <div style={{ width: '53%' }}></div>
              </div>

              <div className='navbar-menu-expand-div-menu'>
                <h1>About Us</h1>
                <div style={{ width: '85%' }}></div>
              </div>

              <div className='navbar-menu-expand-div-menu'>
                <h1>Contact Us</h1>
                <div style={{ width: '100%' }}></div>
              </div>
            </div>
          </div> */}

        </div>

        {/* {!user && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )} */}

        {/* {user && (
          <li>
            {!isPending && <button className="btn" onClick={logout}>Logout</button>}
            {isPending && <button className="btn" disabled>Logging out...</button>}
          </li>
        )} */}
      </ul>
    </nav >
  )
}
