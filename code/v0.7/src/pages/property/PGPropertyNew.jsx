import React from "react";
import { useState, useEffect } from "react";
import PropertySingleCard from "./PropertySingleCard";
import { useCollection } from "../../hooks/useCollection";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

const PGPropertyNew = () => {

  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const { user } = useAuthContext();
  console.log('user in PGPropertyNew:', user)
  // const { documents: properties, error: propertieserror } = useCollection(
  //   "properties",
  //   ["postedBy", "==", "PropDial"]
  // );

  const { documents: properties, error: propertieserror } = useCollection(
    "properties",
    ["access", "array-contains", user.uid]
  );

  console.log('properties:', properties)

  // const myProperties = user && user.uid && properties.filter((item) => item.createdBy.id === user.uid);
  // 

  return (
    <div className="top_header_pg pg_bg">
      <div className="page_spacing">
        <div className="property_cards_parent">
          {properties && properties.map((property) => (
            <PropertySingleCard propertydoc={property} />
          ))}

        </div>
      </div>
    </div>
  );
};

export default PGPropertyNew;
