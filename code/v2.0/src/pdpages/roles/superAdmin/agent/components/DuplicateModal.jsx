import React from "react";
import { Modal } from "react-bootstrap";

const DuplicateModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ borderBottom: "none" }}>
        <Modal.Title className="text-center w-100" style={{ color: "#dc3545" }}>
          Mobile Number Already Registered
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div style={{ fontSize: "18px", marginBottom: "20px" }}>
          <span className="material-symbols-outlined" style={{ color: "#dc3545", fontSize: "48px" }}>
            error
          </span>
          <p style={{ marginTop: "10px" }}>
            This mobile number is already registered in our system. Please use a different mobile number.
          </p>
          <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
            You must change the mobile number before you can submit the form.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ borderTop: "none", justifyContent: "center" }}>
        <button
          className="theme_btn btn_fill no_icon"
          onClick={onHide}
          style={{ padding: "8px 30px" }}
        >
          OK, I'll Change Number
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DuplicateModal;