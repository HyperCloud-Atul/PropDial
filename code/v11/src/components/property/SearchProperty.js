import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const SearchProperty = ({ propertiesdocuments, onUpdateFavorites }) => {
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

  return (
    <>
      {propertiesdocuments &&
        propertiesdocuments.map((property) => (
          <div className="property_card_single" key={property.id}>
            <div className="left relative">
              <Link className="pcs_inner pointer" to={`/propertydetails/${property.id}`}>
                <div className="pcs_image_area">
                  <img src="/assets/img/property/p1.jpg" className="bigimage" alt="Property" />
                </div>
                <div className="pcs_main_detail">
                  <div className="pmd_top relative">
                    <h4 className="property_name">
                      {property.bhk} | {property.furnishing === "" ? "" : property.furnishing + "Furnished | "} {property.status}
                    </h4>
                    <h6 className="property_location">{property.locality}, {property.city} |  {property.state}</h6>
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
                        <h5>{property.balcony}</h5>
                      </div>
                      <div className="pi_single">
                        <h6>Floor number</h6>
                        <h5>{property.floorNo}</h5>
                      </div>
                      <div className="pi_single">
                        <h6>Lift</h6>
                        <h5>{property.lift}</h5>
                      </div>
                      <div className="pi_single">
                        <h6>Carpet area</h6>
                        <h5>{property.carpetArea}</h5>
                      </div>
                    </div>
                  </div>
                </div>
             
              </Link>
              <div className="fav_and_share">
                  <span
                    className={`material-symbols-outlined mr-2 fav ${favorites.includes(property.id) ? 'favorited' : ''}`}
                    onClick={() => handleFavoriteClick(property.id)}
                  >
                    favorite
                  </span>
                  {/* <span className="material-symbols-outlined">share</span> */}
                </div>
            </div>
            <div className="pcs_other_info">
              <div className="poi_inner">
                <h6 className="value_per_sqf">Onwards</h6>
                <h6 className="property_value">
                  <span>₹ </span> {property.demandPrice}
                </h6>
                <h6 className="value_per_sqf">
                  {property.carpetArea}  {property.carpetAreaUnit}
                </h6>
                <button
                  className="theme_btn no_icon btn_fill"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  style={{ padding: "5px 20px" }}
                >
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
        ))}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content relative">
            <span className="material-symbols-outlined close_modal" data-bs-dismiss="modal">
              close
            </span>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="section_title mb-4">
                      <h3>Enquiry</h3>
                      <h6 className="modal_subtitle">Thank you for your interest in reaching out to us. Please use the form below to submit any question.</h6>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="form_field st-2">
                      <div className="field_inner select">
                        <select>
                          <option value="" disabled selected>I am</option>
                          <option>Tenant</option>
                          <option>Agent</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">person</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="form_field st-2">
                      <div className="field_inner">
                        <input type="text" placeholder="Name" />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">person</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="form_field st-2">
                      <div className="field_inner">
                        <input type="text" placeholder="Phone Number" />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">call</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="submit_btn mt-4">
                      <button type="submit" className="modal_btn theme_btn no_icon btn_fill">
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchProperty;
