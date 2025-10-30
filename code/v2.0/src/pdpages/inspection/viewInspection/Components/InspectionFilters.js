import React from "react";

const InspectionFilters = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  handleModeChange
}) => {
  return (
    <div className="filters">
      <div className="left">
        <div className="rt_global_search search_field">
          <input
            type="text"
            placeholder="Search inspections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="field_icon">
            <span className="material-symbols-outlined">search</span>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="button_filter diff_views">
          <div
            className={`bf_single ${viewMode === "card_view" ? "active" : ""}`}
            onClick={() => handleModeChange("card_view")}
          >
            <span className="material-symbols-outlined">calendar_view_month</span>
          </div>
          <div
            className={`bf_single ${viewMode === "table_view" ? "active" : ""}`}
            onClick={() => handleModeChange("table_view")}
          >
            <span className="material-symbols-outlined">view_list</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionFilters;