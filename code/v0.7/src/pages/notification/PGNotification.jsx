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
    <div className="top_header_pg pg_bg">
      <div className="page_spacing">
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
          <h2 className="m22 mb-1">Alert Center!</h2>
          <h4 className="r16 light_black">Your Notifications, Stay Updated</h4>
        </div>
        <div className="vg22"></div>
        <div className="my_small_card_parent">
          {activeNotifications &&
            activeNotifications.map((notification) => (
              <PDNotification
                key={notification.id}
                notification={notification}
              />
            ))}
        </div>
        <div className="vg22"></div>
      </div>
    </div>
  )
}

export default PGNotification
