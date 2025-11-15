import React from "react";
import { Modal } from "react-bootstrap";

const AddInspectionModal = ({
  showPopup,
  setShowPopup,
  lastInspections,
  handleAddInspection,
  navigate
}) => {
  // const inspectionTypes = ["Regular", "Full", "Move-In", "Move-Out", "Issue Based"];
    const inspectionTypes = ["Regular", "Full", "Issue Based"];

  return (
    <Modal show={showPopup} className="delete_modal inspection_modal" centered>
      <span
        className="material-symbols-outlined modal_close"
        onClick={() => setShowPopup(false)}
      >
        close
      </span>

      <h5 className="text_blue text-center">Select Inspection Type</h5>

      <div className="inspection_types">
        {inspectionTypes.map((type) => (
          <div
            key={type}
            className="it_single"
            onClick={() => {
              if (lastInspections[type]) {
                // Redirect to last pending inspection
                navigate(`/add-inspection/${lastInspections[type].id}`);
              } else {
                // Create a new one
                handleAddInspection(type);
              }
            }}
          >
            <span>
              {type} Inspection{" "}
              {lastInspections[type] && (
                <div style={{ color: "var(--theme-red)", fontSize: "13px" }}>
                  (Complete the last inspection first)
                </div>
              )}
            </span>

            <img
              src={`/assets/img/${type.toLowerCase().replace(/[- ]/g, "")}.png`}
              alt="propdial"
            />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default AddInspectionModal;
