import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { generateSlug } from "../../utils/generateSlug";

const SearchPropAgentProperty = ({ activeOption, propagentProperties }) => {
  // console.log('activeOption: ', activeOption)
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
        <Link
          className="pp_sidebarcard_single relative"
          // to={`/propertydetails/${property.id}`}
          to={`/propertydetails/${generateSlug(property)}`}
          
        >
          <div className="ppss_img">
            {property.images.length > 0 ? (
              <img src={property.images[0]} alt={property.bhk} />
            ) : property.category === "Plot" ? (
              <img src="/assets/img/plot.jpg" alt="Plot" />
            ) : property.category === "Commercial" ? (
              <img src="/assets/img/commercial.jpg" alt="Commercial" />
            ) : (
              <img src="/assets/img/admin_banner.jpg" alt="Residential" />
            )}
          </div>
          <div className="cat_badge">{property.category}</div>
          <div className="ppss_header">
            <h5>
              {property.category === "Residential" ? (
                <>
                  {property.bhk} | For{" "}
                  {property.purpose.toLowerCase() === "rentsaleboth"
                    ? "Rent / Sale"
                    : property.purpose}
                </>
              ) : property.category === "Commercial" ? (
                <>
                  {property.propertyType} | For{" "}
                  {property.purpose.toLowerCase() === "rentsaleboth"
                    ? "Rent / Sale"
                    : property.purpose}
                </>
              ) : property.category === "Plot" ? (
                <>
                  {property.mainDoorFacing}-facing | {property.superArea}{" "}
                  {property.superAreaUnit} Plot
                </>
              ) : (
                "Details not available"
              )}
            </h5>

            <h5>{property.locality}</h5>
            <h6 className="location">
              {property.city}, {property.state}
            </h6>
          </div>
          <div className="ppss_footer">
            <h6>
              <span>
                ₹{" "}
                {/* {property.flag.toLowerCase() === "pms only" || property.flag.toLowerCase() ===
                                    "available for rent" || property.flag.toLowerCase() ===
                                    "rented out"
                                    ? new Intl.NumberFormat("en-IN").format(
                                        property.demandPriceRent
                                    )
                                    : property.flag.toLowerCase() ===
                                        "rent and sale" ||
                                        property.flag.toLowerCase() ===
                                        "rented but sale"
                                        ? new Intl.NumberFormat("en-IN").format(
                                            property.demandPriceRent
                                        ) + " / ₹" + new Intl.NumberFormat("en-IN").format(
                                            property.demandPriceSale
                                        )
                                        : new Intl.NumberFormat("en-IN").format(
                                            property.demandPriceSale
                                        )} */}
                {/* {activeOption.toLowerCase() === "rent"
                  ? new Intl.NumberFormat("en-IN").format(
                      property.demandPriceRent
                    )
                  : new Intl.NumberFormat("en-IN").format(
                      property.demandPriceSale
                    )} */}
                {property.flag.toLowerCase() === "pms only" ||
                property.flag.toLowerCase() === "available for rent" ||
                property.flag.toLowerCase() === "rented out"
                  ? new Intl.NumberFormat("en-IN").format(
                      property.demandPriceRent
                    )
                  : property.flag.toLowerCase() === "rent and sale" ||
                    property.flag.toLowerCase() === "rented but sale"
                  ? new Intl.NumberFormat("en-IN").format(
                      property.demandPriceRent
                    ) +
                    " / ₹" +
                    new Intl.NumberFormat("en-IN").format(
                      property.demandPriceSale
                    )
                  : new Intl.NumberFormat("en-IN").format(
                      property.demandPriceSale
                    )}
              </span>{" "}
              onwards
            </h6>
            <h6>Marketed by {property.postedBy}</h6>
          </div>
        </Link>
      ))}
    </>
  );
};

export default SearchPropAgentProperty;
