import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCollection } from "../../../hooks/useCollection";
import Filters from "../../../Components/Filters";
import PropAgentPropertyCard from "./PropAgentPropertyCard";
// import { user } from 'firebase-functions/v1/auth';
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";
import LinearProgressBar from "./LinearProgressBar";

const propertyFilter = ["ACTIVE", "INACTIVE", "PENDING APPROVAL"];
const PropAgentAdminDashboard = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const { user } = useAuthContext();
  const { logout, isPending } = useLogout();

  const [filter, setFilter] = useState("PENDING APPROVAL");
  const { documents: dbpropertiesdocuments, error: dbpropertieserror } =
    useCollection("properties", ["postedBy", "==", "Agent"]);

  const properties_active =
    dbpropertiesdocuments &&
    dbpropertiesdocuments.filter(
      (item) => item.status.toUpperCase() === "ACTIVE"
    );
  const properties_inactive =
    dbpropertiesdocuments &&
    dbpropertiesdocuments.filter(
      (item) => item.status.toUpperCase() === "INACTIVE"
    );
  const properties_pendingapproval =
    dbpropertiesdocuments &&
    dbpropertiesdocuments.filter(
      (item) => item.status.toUpperCase() === "PENDING APPROVAL"
    );

  useEffect(() => {
    let flag = user && user.role === "propagentadmin";

    if (!flag) {
      logout();
    }
  }, [user, logout]);

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  let filteredProperties = dbpropertiesdocuments
    ? dbpropertiesdocuments.filter((document) => {
        let filteredProperty = false;
        // console.log('useSwitch', userSwitch)
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

          case "PENDING APPROVAL":
            document.status === "pending approval"
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          default:
            return true;
        }
      })
    : null;
  // 9 dots controls
  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };
  // 9 dots controls

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
              <Link
                to="/propagentaddnotification/new"
                className="more-add-options-icons"
              >
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
          <h2 className="p_title">Admin Dashboard</h2>
          <h4 className="p_subtitle">
            Hello <b>{user.displayName}</b> , From here you can manage all
            properties of your system.
          </h4>
        </div>
        <div className="verticall_gap"></div>
        <div className="pg_body">
          <div className="propagent_dashboard_inner">
            <section className="row">
              <div className="col-lg-5">
                <div className="total_prop_card relative">
                  <div className="bg_icon">
                    <img src="/assets/img/flats.png" alt="" />
                  </div>
                  <div className="inner">
                    <div className="icon">
                      <img src="/assets/img/flats.png" alt="" />
                    </div>
                    <div className="content">
                      <h4 className="title">All Properties</h4>
                      <div className="bar">
                        <LinearProgressBar
                          total={dbpropertiesdocuments && dbpropertiesdocuments.length}
                          current={dbpropertiesdocuments && dbpropertiesdocuments.length}
                        />
                      </div>

                      <h6>
                        From{" "}
                        {dbpropertiesdocuments && dbpropertiesdocuments.length}{" "}
                        properties, (
                        {properties_active && properties_active.length}) Active
                        | ({properties_inactive && properties_inactive.length})
                        Inactive |{" "}
                        ({properties_pendingapproval &&
                          properties_pendingapproval.length}){" "}
                        for Pending Aprroval
                      </h6>
                    </div>
                    <div className="number">
                      {dbpropertiesdocuments && dbpropertiesdocuments.length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="verticall_gap_991"></div>
              <div className="col-lg-7 bg_575">
                <div className="verticall_gap_575"></div>
                <div className="property_status">
                  <div className="ps_single pending">
                    {/* onClick={() => getAgentProperties("PENDING APPROVAL")} */}
                    <h5>
                      {properties_pendingapproval &&
                        properties_pendingapproval.length}
                    </h5>
                    <h6>Pending Approval</h6>
                  </div>
                  <div className="ps_single active">
                    {/* onClick={() => getAgentProperties("ACTIVE")} */}
                    <h5>{properties_active && properties_active.length}</h5>
                    <h6>Active</h6>
                  </div>
                  <div className="ps_single inactive">
                    {/* onClick={() => getAgentProperties("INACTIVE")} */}
                    <h5>
                      {properties_inactive && properties_inactive.length}
                    </h5>
                    <h6>Inactive</h6>
                  </div>
                </div>
                <div className="verticall_gap_575"></div>
              </div>
            </section>
          </div>
        </div>
        <div className="verticall_gap"></div>

        <section>
          <div>
            {dbpropertieserror && <p className="error">{dbpropertieserror}</p>}

            <Filters
              changeFilter={changeFilter}
              filterList={propertyFilter}
              activeFilter={filter}
              filterLength={filteredProperties && filteredProperties.length}
            />

            {dbpropertiesdocuments && dbpropertiesdocuments.length === 0 && (
              <div>No property available</div>
            )}

            <div className="ppc_single_parent">
              {filteredProperties &&
                filteredProperties.map((property) => (
                  <PropAgentPropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PropAgentAdminDashboard;
