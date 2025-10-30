import React from "react";
import { BeatLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="top_header_pg pg_bg pg_agent">
      <div className="filter_loading" style={{ height: "80vh" }}>
        <BeatLoader color={"var(--theme-green)"} />
      </div>
    </div>
  );
};

export default LoadingSpinner;