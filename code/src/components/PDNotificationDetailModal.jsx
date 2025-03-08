import React from "react";
import Modal from "react-bootstrap/Modal";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const PDNotificationDetailModal = ({
  show,
  handleClose,
  selectedNotification,
}) => {
  useEffect(() => {
    console.log("Selected Notification:", selectedNotification); // Debugging output
  }, [selectedNotification]);

  if (!selectedNotification) return null;

  // Check and format the createdAt date
  const formattedDate =
    selectedNotification.createdAt && selectedNotification.createdAt.toDate
      ? format(selectedNotification.createdAt.toDate(), "dd-MMM-yy, hh:mm a")
      : "Date not available";

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="enquiry_modal margin_top"
      centered
    >
      <span
        className="material-symbols-outlined modal_close"
        onClick={handleClose}
      >
        close
      </span>
      <div className="modal_top_bar">
        <div className="left">
          {/* <span className="material-symbols-outlined">calendar_month</span>
          <span className="material-symbols-outlined">schedule</span> */}
          <b>
          {selectedNotification.type}{" "}Notification
          </b>
        </div>
        <div className="right">{formattedDate}</div>
      </div>
      <div className="modal_content">
        <div className="img_area text-center mt-4">
        {selectedNotification.type === "App Updates" ? (
            <img src="/assets/img/icons/app_update.png" alt="propdial" />
          ) : selectedNotification.type === "Discount" ? (
            <img src="/assets/img/icons/discount.png" alt="propdial" />
          ) : selectedNotification.type === "Offer" ? (
            <img src="/assets/img/icons/offer.png" alt="propdial" />         
          ) : (
            <img src="./assets/img/icons/notifications_icon.png" alt="propdial" />
          )}
        </div>
        <h5 className="text-center mt-2 text_light_black">
            {selectedNotification.shortDescription}
        </h5>
        <p className="text_grey text-center">
            {selectedNotification.description}
        </p>

      </div>
      {/* Additional content */}
    </Modal>
  );
};

export default PDNotificationDetailModal;
