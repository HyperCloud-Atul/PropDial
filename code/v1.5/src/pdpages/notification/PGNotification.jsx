import React from 'react'
import { Helmet } from "react-helmet";
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFirestore } from '../../hooks/useFirestore';
import SEOHelmet from '../../components/SEOHelmet ';

import PDNotification from '../../components/PDNotification';
import './PGNotification.scss'

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
    useCollection("notifications-propdial", "", ["createdAt", "desc"]);
    const { updateDocument, response: updateDocumentResponse } =
    useFirestore("notifications-propdial");

  const activeNotifications =
    
    dbnotifications &&
    dbnotifications.filter((item) => item.status === "active");

    // After fetching notifications in PGNotification
useEffect(() => {
  if (activeNotifications && user) {
    activeNotifications.forEach(async (notification) => {
      if (!notification.viewedBy.includes(user.uid)) {
        await updateDocument(notification.id, {
          viewedBy: [...notification.viewedBy, user.uid],
        });
      }
    });
  }
}, [activeNotifications, user]);

  return (
    
    <div className="top_header_pg pg_bg pg_notification">
        
      <SEOHelmet title="Stay Updated with Propdial | Property Management Notifications" description="Get the latest updates and important notifications from Propdial, India's trusted property management company. Stay informed about your property services today!"
    og_description="Get the latest updates and important notifications from Propdial, India's trusted property management company. Stay informed about your property services today!"
    og_title="Stay Updated with Propdial | Property Management Notifications" /> 
      <div className={`page_spacing pg_min_height ${activeNotifications && activeNotifications.length === 0 ? "pg_min_height" : ""}`}>
        {activeNotifications && activeNotifications.length === 0 && (
          <div className="pg_msg">
            No notifications available at this time
          </div>
        )}
        {user && user.role === "propagentadmin" && (
          <div className="brf_icon">
            <Link to="/propagentaddnotification/new">
              <div className="brfi_single">
                <span className="material-symbols-outlined">add</span>
              </div>
            </Link>
          </div>
        )}
        {activeNotifications && activeNotifications.length !== 0 && (
          <>
            <div className="pg_header">
              <h1 className="m22 mb-1">Property Management Notifications</h1>
              <h4 className="r16 light_black">Your Notifications, Stay Updated</h4>
            </div>
            <div className="vg22"></div>
          </>
        )}
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
