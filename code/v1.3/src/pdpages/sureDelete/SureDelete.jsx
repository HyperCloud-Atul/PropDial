// SureDelete.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

const SureDelete = ({ show, handleClose, handleDelete, isDeleting }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header className="justify-content-center" style={{
        paddingBottom: "0px",
        border: "none"
      }}>
        <h5>
          Alert
        </h5>
      </Modal.Header>
      <Modal.Body className="text-center" style={{
        color: "#FA6262",
        fontSize: "20px",
        border: "none"
      }}>Are you sure you want to delete?</Modal.Body>
      <Modal.Footer className="d-flex justify-content-between" style={{
        border: "none",
        gap: "15px"
      }}>
        <div className="cancel_btn" onClick={handleDelete}  >
    {isDeleting ? "Deleting..." : "Yes"}
        </div>
        <div className="done_btn" onClick={handleClose}>
          No
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SureDelete;
