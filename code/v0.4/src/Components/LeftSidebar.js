// npm i react-pro-sidebar  (command)
// https://www.npmjs.com/package/react-pro-sidebar  (documentation link) 

import React from 'react'
import "./LeftSidebar.css"
const LeftSidebar = () => {
    return (
        <div>
            <div class="side-navbar side-navbar-large property-list-side-navbar"
            >
            <br/>
                <ul>
                    <li class="active">
                        <b></b>
                        <b></b>
                        <div className='sn_menu'>
                            <span class="material-symbols-outlined">
                                home
                            </span>
                            <small>Admin Dashboard</small>
                        </div>
                    </li>              
                    <li className='pointer'>
                        <b></b>
                        <b></b>
                       
                        <div className='sn_menu'>
                        <span class="material-symbols-outlined">
                                account_box
                            </span>
                            <small>Owner List</small>
                        </div>
                        
                    </li>
                    <li className='pointer'>
                        <b></b>
                        <b></b>
                        
                         <div className='sn_menu'>
                         <span class="material-symbols-outlined">
                                sentiment_satisfied
                            </span>
                            <small>Tenant List</small>
                         </div>
                       
                    </li>
                    <li className='pointer'>
                        <b></b>
                        <b></b>
                       
                         <div className='sn_menu'>
                         <span class="material-symbols-outlined">
                                description
                            </span>
                            <small>Property List</small>
                         </div>

                       
                    </li>
                    <li className='pointer'>
                        <b></b>
                        <b></b>
                      
                         <div className='sn_menu'>
                         <span class="material-symbols-outlined">
                                add
                            </span>
                            <small>Add Property</small>
                         </div>
                       
                    </li>
                    <li className='pointer'>
                        <b></b>
                        <b></b>
                   
                        <div className='sn_menu'>
                        <span class="material-symbols-outlined">
                                search
                            </span>
                            <small>Search</small>
                        </div>
                      
                    </li>
                    <li className='pointer'>
                 
                            <b></b>
                            <b></b>
                      <div className='sn_menu'>
                      <span class="material-symbols-outlined">
                                handyman
                            </span>
                            <small>Enquiries</small>
                      </div>
                        
                    </li>
                    <li className='pointer'>
                 
                            <b></b>
                            <b></b>
                      <div className='sn_menu'>
                      <span class="material-symbols-outlined">
                                volunteer_activism
                            </span>
                            <small>Refer & Earn</small>
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

export default LeftSidebar
