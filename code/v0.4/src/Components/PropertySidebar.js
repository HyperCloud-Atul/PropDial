import React from 'react'
// import "./LeftSidebar.css"
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

const PropertySidebar = () => {
    const location = useLocation(); // Get the current location
    const navigate = useNavigate();
    const psidemenuone = () => {
        navigate("/adddocumentnew");
      };   
      const psidemenutwo = () => {
          navigate("/addphoto");
        };
        const psidemenuthree = () => {
            navigate("/propertystatus");
          };
    return (
        <div>
            <div class="side-navbar side-navbar-large property-list-side-navbar"
            >
                <br />
                <ul>
                    <li  className={`pointer ${
                location.pathname === "/propertystatus" ? "active" : ""
              }`} onClick={psidemenuthree}>
                        <b></b>
                        <b></b>
                        <div className='sn_menu'>
                            <span class="material-symbols-outlined">
                                home
                            </span>
                            <small>Property Status</small>
                        </div>
                    </li>
                    <li className='pointer' onClick={psidemenutwo}>
                        <b></b>
                        <b></b>

                        <div className={`pointer sn_menu ${
                location.pathname === "/addphoto" ? "active" : ""
              }`}>
                            <span class="material-symbols-outlined">
                            image
                            </span>
                            <small>Property Images</small>
                        </div>

                    </li>
                    <li className={`pointer ${["/addphoto", "/adddocumentnew", "/propertystatus"].includes(location.pathname) ? "" : "active"}`}>
                        <b></b>
                        <b></b>

                        <div className='sn_menu'>
                            <span class="material-symbols-outlined">
                            category
                            </span>
                            <small>Property Setup</small>
                        </div>

                    </li>
                    <li className={`pointer sn_menu ${
                location.pathname === "/adddocumentnew" ? "active" : ""
              }`} onClick={psidemenuone}>
                        <b></b>
                        <b></b>

                        <div className='sn_menu'>
                            <span class="material-symbols-outlined">
                                description
                            </span>
                            <small>Property Documents</small>
                        </div>


                    </li>
                    <li className='pointer'>
                        <b></b>
                        <b></b>

                        <div className='sn_menu'>
                            <span class="material-symbols-outlined">
                            volunteer_activism
                            </span>
                            <small>Reports</small>
                        </div>

                    </li>             
                    <li className='pointer'>

                        <b></b>
                        <b></b>
                        <div className='sn_menu'>
                            <span class="material-symbols-outlined">
                                logout
                            </span>
                            <small>Logout</small>
                        </div>

                    </li>
                </ul>
            </div>
        </div>
    )
}

export default PropertySidebar
