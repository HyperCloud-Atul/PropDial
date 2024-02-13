import React from "react";
import { useState, useEffect } from "react";
import PropertySingleCard from "../../components/property/PropertyCardCustomer";
import { useCollection } from "../../hooks/useCollection";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import PGSearchProperty from "./PGSearchProperty";
import PGCustomerProperty from "./PGCustomerProperty";

const PGProperties = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const { user } = useAuthContext();

  return (

    // user ? <PGCustomerProperty /> : <PGSearchProperty />
    <PGSearchProperty />

  );
};

export default PGProperties;
