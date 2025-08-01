import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFirestore } from '../../hooks/useFirestore';

import PDNotification from '../../components/PDNotification';
import './PGNotification.scss'

const PGNotification = () => {

  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  // Get Notifications from DB
  const { documents: dbnotifications, error: dbnotificationserror } =
    useCollection("notifications-propdial", "", ["createdAt", "desc"]);
  const { updateDocument } = useFirestore("notifications-propdial");

  // Define a state for filtering notification type
  const [filterType, setFilterType] = useState("all");

  const activeNotifications =
    dbnotifications &&
    dbnotifications.filter((item) => item.status === "active");

  // Update viewedBy field for notifications
  useEffect(() => {
    if (activeNotifications && user) {
      activeNotifications.forEach(async (notification) => {
        if (!notification.viewedBy.includes(user.phoneNumber)) {
          await updateDocument(notification.id, {
            viewedBy: [...notification.viewedBy, user.phoneNumber],
          });
        }
      });
    }
  }, [activeNotifications, user, updateDocument]);

  // Filter active notifications based on the selected filter type
  const filteredNotifications = activeNotifications && activeNotifications.filter((notification) => {
    return filterType === "all" || notification.type === filterType;
  });

  return (
    <div className="top_header_pg pg_bg pg_notification">
      <div className={`page_spacing ${filteredNotifications && filteredNotifications.length === 0 ? "pg_min_height" : ""}`}>

        {user && user.role === "propagentadmin" && (
          <div className="brf_icon">
            <Link to="/propagentaddnotification/new">
              <div className="brfi_single">
                <span className="material-symbols-outlined">add</span>
              </div>
            </Link>
          </div>
        )}

        {filteredNotifications && filteredNotifications.length !== 0 && (
          <>
            <div className="pg_header">
              <h1 className="m22 mb-1">Property Management Notifications</h1>
              <h4 className="r16 light_black">Your Notifications, Stay Updated</h4>
            </div>

            {/* Notification Filter Dropdown */}
            {/* <div className="filter_dropdown">
              <label htmlFor="notificationType">Filter by Type: </label>
              <select
                id="notificationType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="App Updates">App Updates</option>
                <option value="Discount">Discount</option>
                <option value="Offer">Offer</option>
              </select>
            </div> */}
            <div className="vg22"></div>
          </>
        )}

        <div className="my_small_card_parent">
          {filteredNotifications && filteredNotifications.length === 0 && (
            <div className="pg_msg">No notifications available at this time</div>
          )}
          
          {filteredNotifications && filteredNotifications.map((notification) => (
            <PDNotification key={notification.id} notification={notification} />
          ))}
        </div>
        <div className="vg22"></div>
      </div>
    </div>
  )
}

export default PGNotification;
