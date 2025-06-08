import React from "react";
import { useParams, useLocation } from "react-router-dom";
import useUserProperties from "../../../utils/useUserProperties";
import PropertyCard from "../../../components/property/PropertyCard";

const UserProperties = () => {
  const { phoneNumber } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  const { properties, loading } = useUserProperties(phoneNumber, role);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="top_header_pg pg_bg">
      <div className="page_spacing">
        {/* <h3>
          {role?.charAt(0).toUpperCase() + role?.slice(1)} Properties for{" "}
          {phoneNumber}
        </h3> */}
        <div className="property_cards_parent">
          {properties.length === 0 ? (
            <p>No properties found for this user and role.</p>
          ) : (
            properties.map((property) => (
              <PropertyCard key={property.id} propertyid={property.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProperties;
