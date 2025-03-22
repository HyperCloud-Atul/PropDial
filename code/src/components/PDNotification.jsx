import React from "react";
import { useState, useEffect } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import PDNotificationDetailModal from "./PDNotificationDetailModal";

const PDNotification = ({ notification }) => {
  // Check if notification.createdAt exists before using it
  const createdAt = notification.createdAt && notification.createdAt.toDate();
  const notificationSingle = notification; // Keep full notification object

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleNotificationModalClose = () => setShowNotificationModal(false);
  const handleShowNotificationModal = (notificationSingle) => {
    setSelectedNotification(notificationSingle);
    setShowNotificationModal(true);
  };

  useEffect(() => {
    console.log("Notification data:", notification); // Debugging output
  }, [notification]);

  return (
   <>
    <div className="my_small_card notification_card pointer" onClick={() => handleShowNotificationModal(notificationSingle)}>
      <div className="left">
        <div className="img_div">
          {notification.type === "App Updates" ? (
            <img src="/assets/img/icons/app_update.png" alt="propdial" />
          ) : notification.type === "Discount" ? (
            <img src="/assets/img/icons/discount.png" alt="propdial" />
          ) : notification.type === "Offer" ? (
            <img src="/assets/img/icons/offer.png" alt="propdial" />         
          ) : (
            <img src="./assets/img/icons/notifications_icon.png" alt="propdial" />
          )}
        </div>
        <div className="right">
          <h5 className="title">{notification.shortDescription}</h5>
          <h6 className="sub_title">{notification.description}</h6>
        </div>
      </div>
      <h4 className="top_right_content">
        <span>
          {createdAt
            ? formatDistanceToNow(createdAt, {
                addSuffix: true,
              })
            : ""}
        </span>
      </h4>
      <h4 className="top_left_content">{notification.type}</h4>
    </div>
    <PDNotificationDetailModal
        show={showNotificationModal}
        handleClose={handleNotificationModalClose}
        selectedNotification={selectedNotification}
      />
   </>
  );
};

export default PDNotification;
