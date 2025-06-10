import React from "react";
import Modal from "react-bootstrap/Modal";

const MakeInactivePopup = ({
  show,
  handleClose,
  propertyDocument,
  handleSelectedReasonChange,
  handleInactiveRemarkChange,
  handleSaveChanges,
}) => {
  const reasonsForInactive = [
    { id: "notRentable", value: "Not Rentable", label: "Not Rentable" },
    {
      id: "selfManage",
      value: "Self Manage",
      label: "Self Manage",
    },
    { id: "selfRented", value: "Self Rented", label: "Self Rented" },
    {
      id: "selfUse",
      value: "Self Use",
      label: "Self Use",
    },
    {
      id: "soldOut",
      value: "Sold Out",
      label: "Sold Out",
    },
    { id: "tempBreak", value: "Temp Break", label: "Temp Break" },
    {
      id: "unableToRent",
      value: "Unable To Rent",
      label: "Unable To Rent",
    },
    {
      id: "unhappy",
      value: "Unhappy",
      label: "Unhappy",
    },
    {
      id: "unreachable",
      value: "Unreachable",
      label: "Unreachable",
    },
    { id: "other", value: "Other", label: "Other" },
  ];

  return (
    <Modal show={show} onHide={handleClose} centered className="my_modal margin_top">
      <span className="material-symbols-outlined modal_close" onClick={handleClose}>
        close
      </span>
      <Modal.Body>
        <h6 className="r16 r16-14-m lh22 mb-3 text-center">
          {/* <span className="m16 m16-14-m">{propertyDocument.displayName}</span> */}
          <span className="m16 m16-14-m text_blue text-capitalize">
            Reason{" "}
          </span>
          for Making This Property as
          <span className="m16 m16-14-m text_red text-capitalize">
            {" "}Inactive
          </span>
        </h6>
        <div className="form_field">
          <div className="field_box theme_radio_new">
            <div className="theme_radio_container" style={{
              border: "none",
              padding: "0px"
            }}>
              {reasonsForInactive.map((reason) => (
                <div className="radio_single" key={reason.id}>
                  <input
                    type="radio"
                    name="reason_type"
                    id={reason.id}
                    value={reason.value}
                    onChange={handleSelectedReasonChange}
                  // checked={propertyDocument === reason.value}
                  />
                  <label htmlFor={reason.id}>{reason.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="vg22"></div>
        <div className="aai_form">
          <div className="form_field w-100" >
            <div className="relative">
              <textarea
                onChange={handleInactiveRemarkChange}
                placeholder="Remark"
                className="w-100"
                style={{
                  minHeight: "100px"
                }}
              />
            </div>
          </div>
        </div>

        <div className="vg22"></div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="theme_btn btn_border no_icon text-center" onClick={handleClose}>
            Cancel
          </div>
          <div className="theme_btn btn_fill no_icon text-center" onClick={handleSaveChanges}>
            Make Inactive
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MakeInactivePopup;
