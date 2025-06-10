import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";


const SearchPropAgentProperty = ({ propagentProperties }) => {
    // console.log('properties: ', propagentProperties)
    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end

    const { user } = useAuthContext();

    // read more read less
    const [height, setHeight] = useState(true);


    const handleHeight = () => {
        setHeight(!height);
    };
    // read more read less


    return (
        <>
            {propagentProperties.map((property) => (
                <div className="pp_sidebarcard_single">
                    <div className="ppss_img">
                        <img src="./assets/img/property/p2.jpg" alt="" />
                    </div>
                    <div className="ppss_header">
                        <h5>{property.bhk} | {property.purpose}</h5>
                        <h5>{property.locality}</h5>
                        <h6 className="location">{property.city}, {property.state}</h6>
                    </div>
                    <div className="ppss_footer">
                        <h6>{property.furnishing === "" ? "" : property.furnishing + "Furnished"} </h6>
                        <h6>
                            <span>₹ {property.demandPrice}</span> onwards
                        </h6>
                        <h6>Marketed by {property.postedBy}</h6>
                    </div>
                </div>

            ))}
        </>
    );
};

export default SearchPropAgentProperty;
