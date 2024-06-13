import React from 'react'
import { Navigate, Link } from "react-router-dom";
import { useCollection } from "../../../hooks/useCollection";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";

// css import 
import './UserList.scss'

// import filter 
import Filters from "../../../components/Filters";
import UserSinglecard from './UserSinglecard';
const userFilter = ["Owner", "Frontdesk", "Admin", "Inactive"];

const UserList = () => {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  const { documents, error } = useCollection("users");
  const [filter, setFilter] = useState("Owner");
  // const navigate = useNavigate();

  useEffect(() => {
    let flag = user && user.role === "admin";
    if (!flag) {
      logout();
    }
  }, [user]);

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const users = documents
    ? documents.filter((document) => {
      switch (filter) {
        case "All":
          return true;
        case "Admin":
          return document.rolePropDial === "admin";
        case "Owner":
          return (document.rolePropDial === "owner") || (document.rolePropDial === "coowner");
        case "Frontdesk":
          return (document.rolePropDial === "frondesk");
        case "TENANT":
          return document.rolePropDial === "tenant";
        case "PROPERTYMANAGER":
          return document.rolePropDial === "propertymanager";
        case "Inactive":
          return document.status === "inactive";
        default:
          return true;
      }
    })
    : null;

  return (
    <div className='top_header_pg pg_bg'>
      <div className='page_spacing'>
        <div className="pg_header d-flex justify-content-between">
         <div className="left">
         <h2 className="m22">User List {" "}
            <span className="r14 light_black" >( All application users : {users && users.length} )</span>
          </h2>
         </div>
          <div className="right">         
             <img src="./assets/img/icons/excel_logo.png" alt="" className="excel_dowanload" />         
          </div>
        </div>
        <div className="vg12"></div>
        <div className="filters">
          <div className='left'>
            <div className="rt_global_search search_field">
              <input
                placeholder='Search'
              ></input>
              <div class="field_icon"><span class="material-symbols-outlined">search</span></div>
            </div>
          </div>
          <div className="right">
            <div className="user_filters new_inline">
              {documents && (
                <Filters
                  changeFilter={changeFilter}
                  filterList={userFilter}
                  filterLength={users.length}
                />
              )}
            </div>
            <div className="button_filter diff_views">
              <div className="bf_single active">
                <span className="material-symbols-outlined">calendar_view_month</span>
              </div>
              {/* <div className="bf_single">
                <span className="material-symbols-outlined">grid_view</span>
              </div> */}
              <div className="bf_single">
                <span className="material-symbols-outlined">view_list</span>
              </div>
            </div>
          
          </div>
        </div>
        <div className="vg22"></div>
        {error && <p className="error">{error}</p>}   
        {users && users.length === 0 && <p className='text_red medium text-center' style={{
          fontSize: "18px"
        }}>No Users Yet!</p>}
        <div className="propdial_users all_tenants">
          {users && <UserSinglecard users={users} />}
        </div>
      </div>
    </div>

  )
}

export default UserList
