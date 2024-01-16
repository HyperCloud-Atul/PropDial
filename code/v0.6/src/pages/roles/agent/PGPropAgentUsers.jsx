import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../../hooks/useCollection";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";
import Filters from "../../../Components/Filters";

// component
import PropAgentUser from "./PropAgentUser";

const userFilter = ["ACTIVE", "INACTIVE", "ADMIN"];
const PGPropAgentUsers = () => {
  // 9 dots controls
  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };
  // 9 dots controls

  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const { user } = useAuthContext();
  const { logout, isPending } = useLogout();
  // const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState("ACTIVE");

  // console.log('user:', user)
  const { documents: dbUsers, error: dbuserserror } =
    useCollection("users", ["role", "in", ["propagent", "propagentadmin"]]);
  // console.log('dbUsers:', dbUsers)

  useEffect(() => {
    let flag = user && user.role === "propagentadmin";

    if (!flag) {
      logout();
    }

  }, [user, logout]);

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  let users = dbUsers
    ? dbUsers.filter((document) => {
      let filteredProperty = false;
      switch (filter) {
        case "ACTIVE":
          document.status === "active"
            ? (filteredProperty = true)
            : (filteredProperty = false);

          return filteredProperty;
        case "INACTIVE":
          document.status === "inactive"
            ? (filteredProperty = true)
            : (filteredProperty = false);

          return filteredProperty;

        case "ADMIN":
          document.role === "propagentadmin"
            ? (filteredProperty = true)
            : (filteredProperty = false);

          return filteredProperty;

        default:
          return true;
      }
    })
    : null;

  return (
    <div className="top_header_pg pa_bg">
      <div className="pa_inner_page">
        {/* 9 dots html  */}
        <>
          <div
            onClick={openMoreAddOptions}
            className="property-list-add-property"
          >
            <span className="material-symbols-outlined">apps</span>
          </div>
          <div
            className={
              handleMoreOptionsClick
                ? "more-add-options-div open"
                : "more-add-options-div"
            }
            onClick={closeMoreAddOptions}
            id="moreAddOptions"
          >
            <div className="more-add-options-inner-div">
              <div className="more-add-options-icons">
                <h1>Close</h1>
                <span className="material-symbols-outlined">close</span>
              </div>
              <Link to="/propagentaddnotification/new" className="more-add-options-icons">
                <h1>Add Notifications</h1>
                <span className="material-symbols-outlined">view_list</span>
              </Link>
              <Link
                to="/propagentadmindashboard"
                className="more-add-options-icons"
              >
                <h1>Approve Properties</h1>
                <span className="material-symbols-outlined">check_box</span>
              </Link>
              <Link to="/propagentusers" className="more-add-options-icons">
                <h1>Users</h1>
                <span className="material-symbols-outlined">group</span>
              </Link>
            </div>
          </div>
        </>
        {/* 9 dots html  */}
        <div className="pg_header">
          <h2 className="p_title">All Users</h2>
          <h4 className="p_subtitle">users</h4>
        </div>
        {users &&
          (
            <Filters
              changeFilter={changeFilter}
              filterList={userFilter}
              activeFilter={filter}
              filterLength={users && users.length}
            />
          )}
        <div className="verticall_gap"></div>
        <div className="propagentuser">
          {
            users &&
            users.map((userDoc) => (

              <PropAgentUser
                key={userDoc.id}
                userDoc={userDoc}
              />

            ))}
        </div>


      </div >
    </div >
  );
};

export default PGPropAgentUsers;
