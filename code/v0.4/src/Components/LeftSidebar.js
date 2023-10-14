import React from 'react'
import "./LeftSidebar.css"
import { useNavigate } from "react-router-dom";

const LeftSidebar = () => {
    const navigate = useNavigate();

 const sidemenuone = () => {
        navigate("/admindashboard");
      };
    const sidemenutwo = () => {
        navigate("/users");
      };
      const sidemenuthree = () => {
        navigate("/pgpropertylist");
      };
    const sidemenufour = () => {
        navigate("/addproperty_old");
      };
      const sidemenufive = () => {
        navigate("/pgsearch");
      };
   

    return (
        <div>
            <div class="side-navbar side-navbar-large property-list-side-navbar"
            >
            <br/>
                <ul>
                    <li class="active" onClick={sidemenuone}>
                        <b></b>
                        <b></b>
                        <div className='sn_menu'>
                            <span class="material-symbols-outlined">
                                home
                            </span>
                            <small>Admin Dashboard</small>
                        </div>
                    </li>              
                    <li className='pointer' onClick={sidemenutwo}>
                        <b></b>
                        <b></b>
                       
                        <div className='sn_menu'>
                        <span class="material-symbols-outlined">
                                account_box
                            </span>
                            <small>User List</small>
                        </div>
                        
                    </li>               
                    <li className='pointer' onClick={sidemenuthree}>
                        <b></b>
                        <b></b>
                       
                         <div className='sn_menu'>
                         <span class="material-symbols-outlined">
                                description
                            </span>
                            <small>Property List</small>
                         </div>

                       
                    </li>
                    <li className='pointer' onClick={sidemenufour}>
                        <b></b>
                        <b></b>
                      
                         <div className='sn_menu'>
                         <span class="material-symbols-outlined">
                                add
                            </span>
                            <small>Add Property</small>
                         </div>
                       
                    </li>
                    <li className='pointer' onClick={sidemenufive}>
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
