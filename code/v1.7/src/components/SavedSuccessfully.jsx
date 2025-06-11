import React from "react";
import { Modal } from "react-bootstrap"; // Bootstrap Modal use kar rahe ho to import required

const SavedSuccessfully = ({ show, onClose, message = "Saved Successfully" }) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      
      centered
    >
      <div className="text-center">
        <img
          src="/assets/img/icons/check-mark.png"
          alt="Success"
          style={{
            height: "65px",
            width: "auto",
            marginBottom: "15px",
          }}
        />
        <h5 className="text_green2 mb-0">{message}</h5>

        <div
          className="theme_btn btn_border w-100 no_icon text-center mt-4"
          onClick={onClose}
        >
          Okay
        </div>
      </div>
    </Modal>
  );
};

export default SavedSuccessfully;
