import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext'
import Avatar from '../components/Avatar';
import './SideBarNew.css';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import Popup from './Popup';

export default function SidebarNew(props) {
    const { user } = useAuthContext();
    const [sideNavbarActive, setSideNavbarActive] = useState();
    const { logout, isPending } = useLogout();
    //Popup Flags
    const [showPopupFlag, setShowPopupFlag] = useState(false)
    const [popupReturn, setPopupReturn] = useState(false)

    //Popup Flags
    useEffect(() => {
        if (popupReturn) {
            //Logout
            logout();
        }

    }, [popupReturn])

    //Popup Flags
    const showPopup = async (e) => {
        e.preventDefault()
        setShowPopupFlag(true)
        setPopupReturn(false)
    }

    const sideNavbarMenuClick = (activeMenu) => {
        setSideNavbarActive(activeMenu);
    };

    const [sideNavbar, setSideNavbar] = useState(false);
    function openSideNavbar() {
        setSideNavbar(!sideNavbar);
        props.setFlag(sideNavbar);
    }

    return (

        <div className={sideNavbar ? 'sidebar-full-div open' : 'sidebar-full-div'} >
            {/* Popup Component */}
            < Popup showPopupFlag={showPopupFlag}
                setShowPopupFlag={setShowPopupFlag}
                setPopupReturn={setPopupReturn}
                msg={'Are you sure you want to logout?'} />

            <div className='sidebar-full-content'>

                <div className='sidebar-ham-icon' onClick={openSideNavbar}>
                    <div>
                        <span className="material-symbols-outlined">
                            menu
                        </span>
                    </div>
                    <div>
                        <span className="material-symbols-outlined">
                            arrow_back_ios
                        </span>
                    </div>
                </div>

                <div className='sidebar-profile-photo'>
                    <div>
                        {/* <h1>{user.displayName}</h1> */}
                        {/* <Avatar src={user.photoURL} /> */}

                    </div>
                </div>

                <ul>

                    {/* <li className='sidebar-profile-div-show active'>
                    <b></b>
                    <b></b>
                    <div className='sidebar-profile-div'>
                        <div className='sidebar-profile-div-face'>
                            <div>
                                <small>KS</small>
                            </div>
                        </div>
                        <div className='sidebar-profile-div-content'>
                            <h2>Khushi Soni</h2>
                            <h3>Edit Profile</h3>
                        </div>
                        <div className='sidebar-profile-div-arrow'>
                            <span className="material-symbols-outlined">
                                chevron_right
                            </span>
                        </div>
                    </div>
                </li> */}

                    {/* <div style={{ padding: '5px 0' }}></div>
                <hr style={{ border: 'none', borderTop: '2px solid #fff' }} /> */}

                    <Link to="/admindashboard" onClick={() => sideNavbarMenuClick('admindashboard')} style={{ textDecoration: 'none' }} >
                        <li className={sideNavbarActive == 'admindashboard' ? 'active' : ''}>
                            <b></b>
                            <b></b>
                            <div>
                                <span className="material-symbols-outlined">
                                    home
                                </span>
                                <h1>Dashboard</h1>
                            </div>
                        </li>
                    </Link>
                    <Link to="/addproperty" onClick={() => sideNavbarMenuClick('addproperty')} style={{ textDecoration: 'none' }} >
                        <li className={sideNavbarActive == 'addproperty' ? 'active' : ''}>
                            <b></b>
                            <b></b>

                            <div>
                                <span className="material-symbols-outlined">
                                    add_business
                                </span>
                                <h1>Add Property</h1>
                            </div>
                        </li>
                    </Link>

                    {/* Super Admin Links */}
                    <Link to="/userlist" onClick={() => sideNavbarMenuClick('userlist')} style={{ textDecoration: 'none' }} >
                        <li className={sideNavbarActive == 'userlist' ? 'active' : ''}>
                            <b></b>
                            <b></b>
                            <div>
                                <span className="material-symbols-outlined">
                                    group
                                </span>
                                <h1>Users</h1>
                            </div>
                        </li>
                    </Link>

                    {/* Common Links */}
                    <Link to="/adminsettings" onClick={() => sideNavbarMenuClick('adminsettings')} style={{ textDecoration: 'none' }} >
                        <li className={sideNavbarActive == 'adminsettings' ? 'active' : ''}>
                            <b></b>
                            <b></b>
                            <div>
                                <span className="material-symbols-outlined">
                                    settings
                                </span>
                                <h1>Settings</h1>
                            </div>
                        </li>
                    </Link>
                    <Link to="/" onClick={showPopup} style={{ textDecoration: 'none' }} >
                        <li className={sideNavbarActive == 'logout' ? 'active' : ''}>
                            <b></b>
                            <b></b>
                            <div>
                                <span className="material-symbols-outlined">
                                    logout
                                </span>
                                <h1>Logout</h1>
                            </div>
                        </li>
                    </Link>
                </ul>
            </div>
        </ div>
    )
}
