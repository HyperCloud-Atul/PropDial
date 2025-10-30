import React from "react";
import { Modal } from "react-bootstrap";

const SuccessModal = ({ show, onHide, isEdit }) => {
  return (
    <Modal onHide={onHide} show={show} centered>
      <Modal.Header closeButton style={{ borderBottom: "none" }} />
      <Modal.Body>
        <div>
          <h5 className="text-center" style={{ color: "var(--theme-green2)" }}>
            {isEdit
              ? "Agent details have been updated successfully"
              : "Agent has been added successfully"}
          </h5>
          <button
            className="theme_btn btn_fill no_icon text-center"
            style={{ width: "100%", marginTop: "15px" }}
            onClick={onHide}
          >
            OK
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessModal;