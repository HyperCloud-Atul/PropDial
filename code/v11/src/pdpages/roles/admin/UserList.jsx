import React from 'react'
import { Navigate, Link } from "react-router-dom";
import { useCollection } from "../../../hooks/useCollection";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";

// css import 
import './UserList.css'

// import filter 
import Filters from "../../../components/Filters";
import UserSinglecard from './UserSinglecard';
const userFilter = ["All", "Admin", "Owner", "Frontdesk", "Inactive"];

const UserList = () => {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  const { documents, error } = useCollection("users");
  const [filter, setFilter] = useState("All");
  // const navigate = useNavigate();

  useEffect(() => {
    let flag = user && user.role === "superadmin";
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
        {error && <p className="error">{error}</p>}
        <div className="search_filter">
          <div className="row">
            <div className="col-3">
              <div className="form_field">
                <input type="text" placeholder='Search' />
              </div>
            </div>
            <div className="col-9">
              <div className="user_filters">
                {documents && (
                  <Filters
                    changeFilter={changeFilter}
                    filterList={userFilter}
                    filterLength={users.length}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="userlist">
          {users && <UserSinglecard users={users} />}
        </div>
      </div>
    </div>

  )
}

export default UserList
