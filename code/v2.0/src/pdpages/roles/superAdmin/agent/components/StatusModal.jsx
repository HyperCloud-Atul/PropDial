import React from "react";
import { Modal } from "react-bootstrap";

const StatusModal = ({ show, onHide, formState, updateFormState }) => {
  const handleStatusChange = (newStatus) => {
    updateFormState({ status: newStatus });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Change Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to change the status to {formState.status === "active" ? "banned" : "active"}?</p>
        <div className="row">
          <div className="col-6">
            <button
              className="theme_btn btn_border no_icon text-center w-100"
              onClick={onHide}
            >
              Cancel
            </button>
          </div>
          <div className="col-6">
            <button
              className="theme_btn btn_fill no_icon text-center w-100"
              onClick={() => handleStatusChange(formState.status === "active" ? "banned" : "active")}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default StatusModal;