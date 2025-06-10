import React from "react";
import { useState, useEffect } from "react";
import PropertySingleCard from "../../components/property/PropertyCard";
import { useCollection } from "../../hooks/useCollection";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import PGSearchProperty from "./PGSearchProperty";
import PGCustomerProperty from "./PGCustomerProperty";
import PGAdminProperty from "./PGAdminProperty";

const PGProperties = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const { user } = useAuthContext();
  // console.log('user:', user)
  return (
    <>
      <div>
        {<PGSearchProperty />}
      </div>
      {/* <div>
        {user && user.role === 'owner' && <PGCustomerProperty />}
      </div>
      <div>
        {user && user.role === 'admin' && <PGAdminProperty />}
      </div> */}

    </>
  );
};

export default PGProperties;
