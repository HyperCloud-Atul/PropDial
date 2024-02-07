import React from "react";
import PropertySingleCard from "./PropertySingleCard";

const PGPropertyNew = () => {
  return (
    <div className="top_header_pg pg_bg">
      <div className="page_spacing">
        <div className="property_cards_parent">
       <PropertySingleCard/>
       <PropertySingleCard/>
        </div>
      </div>
    </div>
  );
};

export default PGPropertyNew;
