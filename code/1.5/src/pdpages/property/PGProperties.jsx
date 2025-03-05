import { Helmet } from "react-helmet";
import React from "react";
import { useState, useEffect } from "react";
import PropertySingleCard from "../../components/property/PropertyCard";
import { useCollection } from "../../hooks/useCollection";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import PGSearchProperty from "./PGSearchProperty";
import PGCustomerProperty from "./PGCustomerProperty";
import PGAdminProperty from "./PGAdminProperty";
import SEOHelmet from "../../components/SEOHelmet ";

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
    
      <SEOHelmet title="Explore Properties for Buy, Sell & Rent | Propdial" description="Find the best properties for buy, sell & rent with Propdial. Explore top real estate listings in prime locations and get expert property management services."
    og_description="Find the best properties for buy, sell & rent with Propdial. Explore top real estate listings in prime locations and get expert property management services."
    og_title="Explore Properties for Buy, Sell & Rent | Propdial" /> 
      <div>
        {<PGSearchProperty />}
      </div>
      {/* <div>
        {user && user.role === 'owner' && <PGCustomerProperty />}
      </div> */}
      {/* <div>
        {user && (user.role === 'admin' || user.role === 'superAdmin') && <PGAdminProperty />}
      </div> */}
     
    </>
  );
};

export default PGProperties;
