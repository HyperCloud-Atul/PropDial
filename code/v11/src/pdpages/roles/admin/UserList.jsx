import React, { useState, useEffect } from 'react';
import { useCollection } from "../../../hooks/useCollection";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";

// import component 
import UserSinglecard from './UserSinglecard';
import UserTable from './UserTable';

// css import 
import './UserList.scss'

// import filter 
import Filters from "../../../components/Filters";
const userFilter = ["Owner", "Frontdesk", "Manager", "Admin", "Super Admin", "Inactive", "Tenants", "Prospective Tenants", "Buyers", "Prospective Buyers"];

const UserList = () => {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  const { documents, error } = useCollection("users");
  const [filter, setFilter] = useState(userFilter[0]);


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
        case "Owner":
          return (document.rolePropDial === "owner") || (document.rolePropDial === "coowner");
        case "Frontdesk":
          return (document.rolePropDial === "frontdesk");
        case "Manager":
          return (document.rolePropDial === "manager");
        case "Admin":
          return document.rolePropDial === "admin";
        case "Super Admin":
          return document.rolePropDial === "superAdmin";
        case "Inactive":
          return document.status === "inactive";
        case "Tenants":
          return document.rolePropDial === "tenant";
        case "Prospective Tenants":
          return document.rolePropDial === "prospectiveTenant";
        case "Buyers":
          return document.rolePropDial === "buyers";
        case "Prospective Buyers":
          return document.rolePropDial === "prospectiveBuyers";
        default:
          return false;
      }
    })
    : null;


  // card and table view mode functionality start
  const [viewMode, setviewMode] = useState('card_view'); // Initial mode is grid with 3 columns

  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };
  // card and table view mode functionality end

  return (
    <div className='top_header_pg pg_bg'>
      <div className='page_spacing'>
        <div className="pg_header d-flex justify-content-between">
          <div className="left">
            <h2 className="m22">User List {" "}
              <span className="r14 light_black" >( Application's filtered users : {users && users.length} )</span>
            </h2>
          </div>
          <div className="right">
            <img src="./assets/img/icons/excel_logo.png" alt="" className="excel_dowanload" />
          </div>
        </div>
        <div className="vg12"></div>
        <div className="filters">
          <div className='left'>
            {viewMode === "card_view" && (
              <div className="rt_global_search search_field">
                <input
                  placeholder='Search'
                ></input>
                <div class="field_icon"><span class="material-symbols-outlined">search</span></div>
              </div>
            )}

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
              <div className={`bf_single ${viewMode === 'card_view' ? 'active' : ''}`} onClick={() => handleModeChange('card_view')}>
                <span className="material-symbols-outlined">calendar_view_month</span>
              </div>
              <div className={`bf_single ${viewMode === 'table_view' ? 'active' : ''}`} onClick={() => handleModeChange('table_view')}>
                <span className="material-symbols-outlined">view_list</span>
              </div>
            </div>
          </div>
        </div>
        <hr></hr>
        {error && <p className="error">{error}</p>}
        {users && users.length === 0 && <p className='text_red medium text-center' style={{
          fontSize: "18px"
        }}>No Users Yet!</p>}

        {viewMode === "card_view" && (
          <div className="propdial_users all_tenants">
            {users && <UserSinglecard users={users} />}
          </div>
        )}
        {viewMode === "table_view" && (
          <>
            {users && <UserTable users={users} />}
          </>
        )}
      </div>
    </div>

  )
}

export default UserList
