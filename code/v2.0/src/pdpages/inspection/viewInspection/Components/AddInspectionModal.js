import React from "react";
import { Modal } from "react-bootstrap";

const AddInspectionModal = ({
  showPopup,
  setShowPopup,
  lastInspections,
  handleAddInspection,
  navigate
}) => {
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
        {["Regular", "Full", "Move-In", "Move-Out", "Issue Based"].map((type) => (
          <div
            key={type}
            onClick={() => {
              if (type === "Regular" || type === "Full") {
                if (lastInspections[type]) {
                  navigate(`/add-inspection/${lastInspections[type].id}`);
                } else {
                  handleAddInspection(type);
                }
              }
            }}
            className={`it_single ${
              type !== "Regular" && type !== "Full" ? "disabled" : ""
            }`}
            style={
              type !== "Regular" && type !== "Full"
                ? { cursor: "not-allowed", opacity: 0.6 }
                : {}
            }
          >
            <span>
              {type} Inspection{" "}
              {(type === "Regular" || type === "Full") &&
                lastInspections[type] && (
                  <div style={{ color: "var(--theme-red)", fontSize: "13px" }}>
                    (Complete the last inspection first)
                  </div>
                )}
            </span>

            {type !== "Regular" && type !== "Full" && (
              <div style={{ color: "gray", fontSize: "12px" }}>Coming Soon</div>
            )}

            <img
              src={`/assets/img/${type.toLowerCase().replace("-", "")}.png`}
              alt="propdial"
            />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default AddInspectionModal;