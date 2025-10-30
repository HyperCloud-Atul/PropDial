import React from "react";

const FormHeader = ({ isReadOnly, onBack }) => {
  return (
    <div className="pg_header d-flex justify-content-between">
      <div className="left d-flex align-items-center pointer" style={{ gap: "5px" }}>
        <span className="material-symbols-outlined pointer" onClick={onBack}>
          arrow_back
        </span>
        <h2 className="m22">{isReadOnly ? "Update Agent" : "Add Agent"}</h2>
      </div>
    </div>
  );
};

export default FormHeader;