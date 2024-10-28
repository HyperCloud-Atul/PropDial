import React from "react";
import { useState, useEffect } from "react";

// import component 
import AgentSingle from "./AgentSingle";

const ViewAgent = ({ agentDoc, handleShowAIForm }) => {
  // View mode start
  const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns
  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };
  // View mode end
  return (
    <>
      {/* view agent pg header and filters start  */}
      <div className="pg_header d-flex justify-content-between">
        <div className="left">
          <h2 className="m22">
            Total Agent:{" "}
            {agentDoc && <span className="text_orange">{agentDoc.length}</span>}
          </h2>
        </div>
        <div className="right">
          <img
            src="./assets/img/icons/excel_logo.png"
            alt=""
            className="excel_dowanload"
          />
        </div>
      </div>
      <div className="vg12"></div>
      <div className="filters">
        <div className="left">
          <div className="rt_global_search search_field">
            <input
              placeholder="Search"
              // value={searchInput}
              // onChange={handleSearchInputChange}
            />
            <div className="field_icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="button_filter diff_views">
            <div
              className={`bf_single ${
                viewMode === "card_view" ? "active" : ""
              }`}
              onClick={() => handleModeChange("card_view")}
            >
              <span className="material-symbols-outlined">
                calendar_view_month
              </span>
            </div>
            <div
              className={`bf_single ${
                viewMode === "table_view" ? "active" : ""
              }`}
              onClick={() => handleModeChange("table_view")}
            >
              <span className="material-symbols-outlined">view_list</span>
            </div>
          </div>
          <div
            onClick={handleShowAIForm}
            className="theme_btn no_icon header_btn btn_fill"
          >
            Add New
          </div>
        </div>
      </div>
      <hr></hr>
      {/* view agent pg header and filters end  */}

      {/* agent card and table  */}
      <AgentSingle 
      agentDoc={agentDoc}
      />
    </>
  );
};

export default ViewAgent;
