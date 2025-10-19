import React from "react";

const RoomFormFields = ({ roomKey, layouts, onFieldChange }) => {
  const handleNumberInput = (e, field) => {
    const value = e.target.value;
    const regex = /^\d{0,2}(\.\d{0,2})?$/;

    if (value === "0" || !regex.test(value)) {
      e.target.value = layouts[roomKey]?.[field] || "";
      return;
    }

    onFieldChange(roomKey, field, value);
  };

  return (
    <>
      <div className="col-xl-6 col-md-4">
        <div className="form_field w-100 aai_form_field">
          <h6 className="aaiff_title">Room Name</h6>
          <div className="field_box w-100">
            <input
              type="text"
              placeholder="Enter room name"
              className="w-100"
              value={layouts[roomKey]?.roomName || ""}
              onChange={(e) => onFieldChange(roomKey, "roomName", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="col-xl-3 col-md-4">
        <div className="form_field w-100 aai_form_field">
          <h6 className="aaiff_title">Room Length <span>(In feet)</span></h6>
          <div className="field_box w-100 unit_field">
            <input
              type="number"
              step="0.01"
              className="w-100"
              placeholder="Enter room length"
              value={layouts[roomKey]?.length || ""}
              onInput={(e) => handleNumberInput(e, "length")}
            />
            <div className="unit">Ft</div>
          </div>
        </div>
      </div>

      <div className="col-xl-3 col-md-4">
        <div className="form_field w-100 aai_form_field">
          <h6 className="aaiff_title">Room Width <span>(In feet)</span></h6>
          <div className="field_box w-100 unit_field">
            <input
              type="number"
              step="0.01"
              className="w-100"
              placeholder="Enter room width"
              value={layouts[roomKey]?.width || ""}
              onInput={(e) => handleNumberInput(e, "width")}
            />
            <div className="unit">Ft</div>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="form_field w-100 aai_form_field">
          <h6 className="aaiff_title">Room Remark</h6>
          <div className="field_box w-100">
            <textarea
              type="text"
              placeholder="Enter room remark"
              className="w-100"
              value={layouts[roomKey]?.remarks || ""}
              onChange={(e) => onFieldChange(roomKey, "remarks", e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomFormFields;