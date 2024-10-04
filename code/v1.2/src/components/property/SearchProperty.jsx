import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";
import EnquiryAddModal from "../EnquiryAddModal";

const SearchProperty = ({ propertiesdocuments, onUpdateFavorites, activeOption }) => {
  console.log('activeOption in SearchProperty: ', activeOption)
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
    useFirestore("enquiry");
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
                  {/* <img src="/assets/img/property/p1.jpg" className="bigimage" alt="Property" /> */}
                  {property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      className="bigimage"
                      alt={property.bhk}
                    />
                  ) : (
                    <img
                      src="/assets/img/property/p1.jpg"
                      className="bigimage"
                      alt="Property"
                    />
                  )}
                </div>
                <div className="id_badge on_mobile_767">{property.pid}</div>
                <div className="pcs_main_detail">
                  <div className="pmd_top relative">
                    <h4 className="property_name">{property.society}</h4>
                    <h4 className="property_name">
                      {property.bhk} |{" "}
                      {property.furnishing === ""
                        ? ""
                        : property.furnishing + " Furnished | "}{" "}
                      {property.status}
                    </h4>
                    <h6 className="property_location">
                      {property.locality}, {property.city} | {property.state}
                    </h6>
                  </div>
                  <div className="pmd_body">
                    <div className="property_information">
                      <div className="pi_single">
                        <h6>Bedrooms</h6>
                        <h5>{property.numberOfBedrooms}</h5>
                      </div>
                      <div className="pi_single">
                        <h6>Bathroom</h6>
                        <h5>{property.numberOfBathrooms}</h5>
                      </div>
                      <div className="pi_single">
                        <h6>Balcony</h6>
                        <h5>{property.numberOfBalcony}</h5>
                      </div>
                      <div className="pi_single">
                        <h6>Floor number</h6>
                        <h5>
                          {property.floorNo}{" "}
                          {property.numberOfFloors && "Of"}{" "}
                          {property.numberOfFloors}
                        </h5>
                      </div>
                      <div className="pi_single">
                        <h6>Lift</h6>
                        <h5>{property.numberOfLifts}</h5>
                      </div>
                      <div className="pi_single">
                        <h6>
                          {property.superArea && "Super "}
                          {property.superArea &&
                            property.carpetArea
                            ? "/"
                            : ""}
                          {property.carpetArea && " Carpet "}
                          Area
                        </h6>
                        <h5>
                          {property.superArea}
                          {property.superArea &&
                            property.carpetArea
                            ? "/"
                            : ""}
                          {property.carpetArea}&nbsp;{property.superAreaUnit}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="fav_and_share">
                <span
                  className={`material-symbols-outlined mr-2 fav ${favorites.includes(property.id) ? "favorited" : ""
                    }`}
                  onClick={() => handleFavoriteClick(property.id)}
                >
                  favorite
                </span>
              </div>
            </div>
            <div className="pcs_other_info">
              <div className="id_badge on_desktop_hide_767">{property.pid}</div>
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
                    {activeOption.toLowerCase() === 'rent'
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
      />
    </>
  );
};

export default SearchProperty;
