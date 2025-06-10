import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";
import EnquiryAddModal from "../EnquiryAddModal";

const SearchProperty = ({
  propertiesdocuments,
  onUpdateFavorites,
  activeOption,
}) => {
  console.log("activeOption in SearchProperty: ", activeOption);
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    if (onUpdateFavorites) {
      onUpdateFavorites(favorites);
    }
  }, [favorites, onUpdateFavorites]);

  const handleFavoriteClick = (propertyId) => {
    let updatedFavorites = [];
    if (favorites.includes(propertyId)) {
      updatedFavorites = favorites.filter((id) => id !== propertyId);
    } else {
      updatedFavorites = [...favorites, propertyId];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // add enquiry with modal and add document start
  const { addDocument, updateDocument, deleteDocument, error } =
    useFirestore("enquiry-propdial");
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleEnquiryModalClose = () => setShowEnquiryModal(false);
  const handleEnquiryNowClick = (property) => {
    setSelectedProperty(property);
    setShowEnquiryModal(true);
  };
  // add enquiry with modal and add document end

  return (
    <>
      {propertiesdocuments &&
        propertiesdocuments.map((property) => (
          <div
            className="guest_property_card property_card_single "
            key={property.id}
          >
            <div className="left relative">
              <Link
                className="pcs_inner pointer"
                to={`/propertydetails/${property.id}`}
              >
                <div className="pcs_image_area">
                  {property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      className="bigimage"
                      alt={property.bhk}
                    />
                  ) : property.category === "Plot" ? (
                    <img
                      src="/assets/img/plot.jpg"
                      className="bigimage"
                      alt="Plot"
                    />
                  ) : property.category === "Commercial" ? (
                    <img
                      src="/assets/img/commercial.jpg"
                      className="bigimage"
                      alt="Commercial"
                    />
                  ) : (
                    <img
                      src="/assets/img/admin_banner.jpg"
                      className="bigimage"
                      alt="Residential"
                    />
                  )}
                </div>

                <div className="id_badge on_mobile_767">
                  PID: {" " + property.pid}
                </div>
                <div className="pcs_main_detail">
                  <div className="pmd_top relative">
                    <h4 className="property_name">{property.society}</h4>
                    <h4 className="property_name">
                      {property &&
                        (property.category === "Residential" ? (
                          <>
                            {property.bhk} {property.furnishing && "|"}{" "}
                            {property.furnishing &&
                              `${property.furnishing} Furnished`}{" "}
                            {property.purpose && " | "}
                            For{" "}
                            {property.purpose.toLowerCase() === "rentsaleboth"
                              ? "Rent / Sale"
                              : property.purpose}
                          </>
                        ) : property.category === "Commercial" ? (
                          <>
                            Your perfect {property.propertyType} awaits—on{" "}
                            {property.purpose.toLowerCase() === "rentsaleboth"
                              ? "Rent / Lease Now"
                              : property.purpose.toLowerCase() === "rent"
                              ? "Lease Now"
                              : property.purpose.toLowerCase() === "sale"
                              ? "Sale Now"
                              : ""}
                          </>
                        ) : property.category === "Plot" ? (
                          <>
                            {property.propertyType} Plot | For{" "}
                            {property.purpose.toLowerCase() === "rentsaleboth"
                              ? "Rent / Lease"
                              : property.purpose.toLowerCase() === "rent"
                              ? "Lease"
                              : property.purpose.toLowerCase() === "sale"
                              ? "Sale"
                              : ""}
                          </>
                        ) : null)}
                    </h4>

                    <h6 className="property_location">
                      {property.locality}, {property.city} | {property.state}
                    </h6>
                  </div>
                  <div className="pmd_body">
                    <div className="property_information">
                      <div className="pi_single">
                        <h6>
                          {property.category === "Plot"
                            ? "Area"
                            : property.category === "Commercial"
                            ? "Super Area"
                            : property.category === "Residential"
                            ? property.superArea
                              ? "Super Area"
                              : property.carpetArea
                              ? "Carpet Area"
                              : "Area"
                            : "Area"}
                        </h6>
                        <h5>
                          {property.category === "Residential"
                            ? property.superArea
                              ? `${property.superArea} ${property.superAreaUnit}`
                              : property.carpetArea
                              ? `${property.carpetArea} ${property.superAreaUnit}`
                              : "Yet to be added"
                            : property.category === "Commercial" ||
                              property.category === "Plot"
                            ? property.superArea
                              ? `${property.superArea} ${property.superAreaUnit}`
                              : "Yet to be added"
                            : "Yet to be added"}
                        </h5>
                      </div>
                      <div className="pi_single">
                        {property.category === "Residential" ? (
                          <>
                            <h6>Bedrooms</h6>
                            <h5>
                              {property.numberOfBedrooms === 0 ||
                              property.numberOfBedrooms === "0"
                                ? "Yet to be added"
                                : property.numberOfBedrooms}
                            </h5>
                          </>
                        ) : property.category === "Commercial" ? (
                          <>
                            <h6>Carpet Area</h6>
                            <h5>
                              {property.carpetArea
                                ? `${property.carpetArea} ${
                                    property.superAreaUnit || ""
                                  }`
                                : "Yet to be added"}
                            </h5>
                          </>
                        ) : property.category === "Plot" ? (
                          <>
                            <h6>Park Facing</h6>
                            <h5>
                              {property.isParkFacingPlot
                                ? property.isParkFacingPlot
                                : "Yet to be added"}
                            </h5>
                          </>
                        ) : null}
                      </div>

                      <div className="pi_single">
                        {property.category === "Residential" ? (
                          <>
                            <h6>Bathroom</h6>
                            <h5>
                              {property.numberOfBathrooms === 0 ||
                              property.numberOfBathrooms === "0"
                                ? "Yet to be added"
                                : property.numberOfBathrooms}
                            </h5>
                          </>
                        ) : property.category === "Commercial" ||
                          property.category === "Plot" ? (
                          <>
                            <h6>Direction Facing</h6>
                            <h5>
                              {property.mainDoorFacing
                                ? property.mainDoorFacing
                                : "Yet to be added"}
                            </h5>
                          </>
                        ) : null}
                      </div>

                      <div className="pi_single">
                        {property.category === "Residential" ? (
                          <>
                            <h6>
                              {property.floorNo
                                ? ["Ground", "Stilt", "Basement"].includes(
                                    property.floorNo
                                  )
                                  ? "Floor"
                                  : "Floor no"
                                : ""}
                            </h6>
                            <h5>
                              {property.floorNo
                                ? property.floorNo === "Ground"
                                  ? "Ground"
                                  : property.floorNo === "Stilt"
                                  ? "Stilt"
                                  : property.floorNo === "Basement"
                                  ? "Basement"
                                  : `${property.floorNo}${
                                      property.numberOfFloors
                                        ? " of " + property.numberOfFloors
                                        : ""
                                    }`
                                : "Yet to be added"}
                            </h5>
                          </>
                        ) : property.category === "Commercial" ? (
                          <>
                            <h6>Property Type</h6>
                            <h5>
                              {property.propertyType || "Yet to be added"}
                            </h5>
                          </>
                        ) : property.category === "Plot" ? (
                          <>
                            <h6>Is Corner?</h6>
                            <h5>
                              {" "}
                              {property.isCornerSidePlot || "Yet to be added"}
                            </h5>
                          </>
                        ) : null}
                      </div>

                      <div className="pi_single">
                        {property.category === "Residential" ? (
                          <>
                            <h6>BHK</h6>
                            <h5>{property.bhk || "Yet to be added"}</h5>
                          </>
                        ) : property.category === "Commercial" ? (
                          <>
                            <h6>Property Sub-Type</h6>
                            <h5>
                              {" "}
                              {property.additionalRooms &&
                              property.additionalRooms.length > 0
                                ? property.additionalRooms[0]
                                : "Yet to be added"}
                            </h5>
                          </>
                        ) : property.category === "Plot" ? (
                          <>
                            <h6>Gated Community</h6>
                            <h5> {property.gatedArea || "Yet to be added"}</h5>
                          </>
                        ) : null}
                      </div>

                      <div className="pi_single">
                        {property.category === "Residential" ||
                        property.category === "Commercial" ? (
                          <>
                            <h6>Furnishing</h6>
                            <h5>{property.furnishing || "Yet to be added"}</h5>
                          </>
                        ) : property.category === "Plot" ? (
                          <>
                            <h6>Road Width</h6>
                            <h5>
                              {property.roadWidth || "Yet to be added"}{" "}
                              {property.roadWidthUnit}
                            </h5>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="fav_and_share">
                <span
                  className={`material-symbols-outlined mr-2 fav ${
                    favorites.includes(property.id) ? "favorited" : ""
                  }`}
                  onClick={() => handleFavoriteClick(property.id)}
                >
                  favorite
                </span>
              </div>
            </div>
            <div className="pcs_other_info">
              <div className="id_badge on_desktop_hide_767">
                PID: {property.pid}
              </div>
              <div className="poi_inner">
                <div>
                  <h6 className="value_per_sqf">
                    {/* {property.flag.toLowerCase() === "pms only" || property.flag.toLowerCase() ===
                      "available for rent" || property.flag.toLowerCase() ===
                      "rented out"
                      ? "Demand Price"
                      : property.flag.toLowerCase() ===
                        "rent and sale" ||
                        property.flag.toLowerCase() ===
                        "rented but sale"
                        ? "Demand Rent / Sale"
                        : "Demand Price"
                    } */}
                    Demand Price
                  </h6>
                  <h6 className="property_value">
                    <span>₹ </span>
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
                    {activeOption.toLowerCase() === "rent"
                      ? new Intl.NumberFormat("en-IN").format(
                          property.demandPriceRent
                        )
                      : new Intl.NumberFormat("en-IN").format(
                          property.demandPriceSale
                        )}
                  </h6>
                </div>
                <button
                  className="theme_btn no_icon btn_fill"
                  style={{ padding: "5px 20px" }}
                  onClick={() => handleEnquiryNowClick(property)}
                >
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
        ))}
      <EnquiryAddModal
        show={showEnquiryModal}
        handleClose={handleEnquiryModalClose}
        selectedProperty={selectedProperty}
        activeOption={activeOption}
      />
    </>
  );
};

export default SearchProperty;
