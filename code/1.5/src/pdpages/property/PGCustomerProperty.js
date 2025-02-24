import React from 'react'
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import PropertyCard from "../../components/property/PropertyCard";

const PGCustomerProperty = () => {

    const { user } = useAuthContext();
    // const { documents: properties, error: propertieserror } = useCollection(
    //     "properties-propdial"
    // );
    const { documents: properties, error: propertieserror } = useCollection(
        "properties-propdial",
        ["access", "array-contains", user.uid]
    );

    return (
        <div className="top_header_pg pg_bg">
            <div className="page_spacing">
                {
                    <div className="property_cards_parent">
                        {properties && properties.map((property) => (
                            <PropertyCard propertydoc={property} />
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}
export default PGCustomerProperty;
