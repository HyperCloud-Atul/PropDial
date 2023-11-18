import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";


const PropertyDetail = ({ propertiesdocuments }) => {
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
      {propertiesdocuments.map((property) => (
        <div className="property_card_single">
          <Link className="pcs_inner pointer" to={`/pdsingle/${property.id}`} key={property.id}>
            <div className="pcs_image_area">
              <img src="/assets/img/property/p1.jpg" className="bigimage"></img>
            </div>
            <div className="pcs_main_detail">
              <div className="pmd_top relative" >
                <h4 className="property_name">
                  {((user && user.role === 'owner') || (user && user.role === 'coowner')) ? property.unitNumber : ''} - {((user && user.role === 'owner') || (user && user.role === 'coowner')) ? property.society : ''}<br></br>
                  {property.bhk} | {property.furnishing} Furnished for {property.purpose} | {property.locality}
                </h4>
                <h6 className="property_location">{property.city}, {property.state}</h6>
                <div className="fav_and_share">
                  <span class="material-symbols-outlined mr-2 fav" style={{
                    marginRight: "3px"
                  }}>
                    favorite
                  </span>
                  <span class="material-symbols-outlined">
                    share
                  </span>
                </div>
              </div>
              <div className="pmd_body">
                <div className="property_information">
                  <div className="pi_single">
                    <h6>Carpet area</h6>
                    <h5>{property.carpetArea}</h5>
                  </div>
                  <div className="pi_single">
                    <h6>Floor number</h6>
                    <h5>{property.floorNumber}</h5>
                  </div>
                  <div className="pi_single">
                    <h6>TRANSACTION</h6>
                    <h5>New Property</h5>
                  </div>
                  <div className="pi_single">
                    <h6>BHK</h6>
                    <h5>{property.bhk}</h5>
                  </div>
                  <div className="pi_single">
                    <h6>Bedrooms</h6>
                    <h5>{property.numberOfBedrooms}</h5>
                  </div>
                  <div className="pi_single">
                    <h6>Kitchen</h6>
                    <h5>{property.numberOfKitchen}</h5>
                  </div>
                </div>
              </div>
              {/* <div className="pmd_bottom">
            <p className={`pshortdetail ${height ? "" : "readmore"}`}>
              Grandeur is Kalpataru's first offering to the city of Indore. This
              landmark address stands a class apart with its iconic design and
              exquisite execution. With world renowned consultants appointed for
              the design, landscaping, RCC and more, Kalpataru Grandeur
              synergizes international design elements with regional taste, and
              represents Kalpataru's strong legacy as a provider of high-end
              luxury living spaces.
            </p>
            <div onClick={handleHeight} className="readml pointer">
              {height ? "Read More" : "Read Less"}
            </div>
          </div> */}
            </div>
          </Link>
          <div className="pcs_other_info">
            <div className="poi_inner">
              <h6 className="property_value">
                <span>₹ </span> 2 cr
              </h6>
              <h6 className="value_per_sqf">
                <span>₹ </span> 9000 per sqf
              </h6>
              {/* <Link to="/contact-us" className="theme_btn no_icon btn_fill"
                style={{ padding: "5px 20px" }}>Contact Agent</Link> */}
              <button className="theme_btn no_icon btn_fill" data-bs-toggle="modal" data-bs-target="#exampleModal"
                style={{ padding: "5px 20px" }}>Enquire Now</button>
              {/* <h5 className="link">Check Loan Eligibility</h5> */}
            </div>
          </div>
        </div>

      ))}
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content relative">
            <span class="material-symbols-outlined close_modal" data-bs-dismiss="modal">
              close
            </span>

            <div class="modal-body">
              <form>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="section_title mb-4">
                      <h3>Enquiry</h3>
                      <h6 className="modal_subtitle">Thank you for your interest in reaching out to us. Please use the form below to submit any question.</h6>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div class="form_field st-2">
                      <div class="field_inner select">
                        <select>
                          <option value="" disabled selected>I am</option>
                          {/* <option>Owner</option> */}
                          <option>Tenant</option>
                          <option>Agent</option>
                        </select>
                        <div class="field_icon">
                          <span class="material-symbols-outlined">person</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div class="form_field st-2">
                      <div class="field_inner">
                        <input type="text" placeholder="Name" />
                        <div class="field_icon">
                          <span class="material-symbols-outlined">person</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div class="form_field st-2">
                      <div class="field_inner">
                        <input type="text" placeholder="Phone Number" />
                        <div class="field_icon">
                          <span class="material-symbols-outlined">call</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="submit_btn mt-4">
                      <button type="submit" className="modal_btn theme_btn no_icon btn_fill">
                        Submit
                        {/* <span class="material-symbols-outlined btn_arrow ba_animation">
                          arrow_forward
                        </span> */}
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

export default PropertyDetail;
