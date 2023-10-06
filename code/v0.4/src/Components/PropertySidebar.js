import React from 'react'
// import "./LeftSidebar.css"

const PropertySidebar = () => {
    return (
        <div>
            <div class="side-navbar side-navbar-large property-list-side-navbar"
            >
                <br />
                <ul>
                    <li class="">
                        <b></b>
                        <b></b>
                        <div className='sn_menu'>
                            <span class="material-symbols-outlined">
                                home
                            </span>
                            <small>Property Status</small>
                        </div>
                    </li>
                    <li className='pointer'>
                        <b></b>
                        <b></b>

                        <div className='sn_menu'>
                            <span class="material-symbols-outlined">
                            image
                            </span>
                            <small>Property Images</small>
                        </div>

                    </li>
                    <li className='pointer active'>
                        <b></b>
                        <b></b>

                        <div className='sn_menu'>
                            <span class="material-symbols-outlined">
                            category
                            </span>
                            <small>Property Setup</small>
                        </div>

                    </li>
                    <li className='pointer'>
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
