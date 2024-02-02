import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import PDNotification from '../../Components/PDNotification';

const PGNotification = () => {

    const navigate = useNavigate();
    const { user } = useAuthContext();
  
    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end
    //Get Notifications from DB
    const { documents: dbnotifications, error: dbnotificationserror } =
      useCollection("notifications", ["postedBy", "==", "propdial"]);
  
    // console.log('dbpropertiesdocuments:', dbpropertiesdocuments)
  
    const activeNotifications =
      user &&
      user.uid &&
      dbnotifications &&
      dbnotifications.filter((item) => item.status === "active");
  
  return (
    <div className="top_header_pg pa_bg">
      <div className="pa_inner_page">
        {user && user.role === "propagentadmin" && (
          <div className="brf_icon">
            <Link to="/propagentaddnotification/new">
              <div className="brfi_single">
                <span className="material-symbols-outlined">add</span>
              </div>
            </Link>
          </div>
        )}
        <div className="pg_header">
          <h2 className="p_title">Alert Center!</h2>
          <h4 className="p_subtitle">Your Notifications, Stay Updated</h4>
        </div>
        <div className="verticall_gap"></div>
        <div className="propagentuser propagentnotification">
          {activeNotifications &&
            activeNotifications.map((notification) => (
              <PDNotification
                key={notification.id}
                notification={notification}
              />
            ))}
        </div>
        <div className="verticall_gap"></div>
      </div>
    </div>
  )
}

export default PGNotification
