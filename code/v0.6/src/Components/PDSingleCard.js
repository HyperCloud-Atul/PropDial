import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "react-image-gallery/styles/css/image-gallery.css";
import Gallery from "react-image-gallery";
import Switch from "react-switch";
import { Navigate, Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import { useAuthContext } from "../hooks/useAuthContext";

// component
import PropertyImageGallery from "./PropertyImageGallery";
const PDSingleCard = ({ propertyDocument }) => {
  // get user from useauthcontext
  const { user } = useAuthContext();
  // get user from useauthcontext
  console.log("propertiesdocument:", propertyDocument);

  // variable of property age
  const ageOfProperty = 2023 - propertyDocument.yearOfConstruction;
  // variable of property age

  // share url code
  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          // title: `${property.unitNumber} - ${property.society}`,
          // text: `${property.bhk} | ${property.furnishing} Furnished for ${property.purpose} | ${property.locality}`,
          url: window.location.href, // You can replace this with the actual URL of the property details page
        });
      } else {
        alert("Web Share API not supported in your browser");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  // share url code
  return (
    <>
      <div className="">
        <div className="property_card_single">
          <div className="pcs_inner pointer" to="/pdsingle">
            <PropertyImageGallery></PropertyImageGallery>
            <div className="pcs_main_detail">
              <div className="pmd_top">
                <h4 className="property_name">
                  {propertyDocument.bhk} | {propertyDocument.furnishing}{" "}
                  Furnished | for {propertyDocument.purpose}
                  <br />
                </h4>
                <h6 className="property_location">
                  {propertyDocument.locality}, {propertyDocument.city},{" "}
                  {propertyDocument.state}
                </h6>
              </div>
              <div className="divider"></div>
              <div className="pmd_section2 row">
                <div className="pdms_single col-4">
                  <h4>
                    <span className="currency">₹</span>47.6
                    <span className="price">L</span>
                  </h4>
                  <h6>
                    {propertyDocument.superArea} /{" "}
                    {propertyDocument.superAreaUnit}
                  </h6>
                </div>
                <div className="pdms_single col-4">
                  <h4>{propertyDocument.builtUpArea}</h4>
                  <h6>Area in {propertyDocument.builtUpAreaUnit}</h6>
                </div>
                <div className="pdms_single col-4">
                  {/* <h4>Under Construction</h4>
                        <h6>Construction status</h6> */}
                </div>
              </div>
              <div className="divider"></div>
              <div className="pmd_section2 pmd_section3 row">
                <div className="pdms_single col-4">
                  <h4>
                    <img src="/assets/img/home-black.png"></img>
                    {propertyDocument.bhk}
                  </h4>
                  <h6>BHK</h6>
                </div>
                <div className="pdms_single col-4">
                  <h4>
                    <img src="/assets/img/double-bed-black.png"></img>
                    {propertyDocument.numberOfBedrooms}
                  </h4>
                  <h6>Bedrooms</h6>
                </div>
                <div className="pdms_single col-4">
                  <h4>
                    <img src="/assets/img/bathtub-black.png"></img>
                    {propertyDocument.numberOfBathrooms}
                  </h4>
                  <h6>Bathroom</h6>
                </div>
              </div>
              <div className="divider"></div>
              <div className="pmd_section4">
                <div className="left">
                  <span
                    className="material-symbols-outlined mr-2"
                    style={{
                      marginRight: "3px",
                    }}
                  >
                    favorite
                  </span>
                  <span
                    className="material-symbols-outlined"
                    onClick={handleShareClick}
                  >
                    share
                  </span>
                </div>
                {!(
                  (user && user.role === "owner") ||
                  (user && user.role === "coowner") ||
                  (user && user.role === "admin")
                ) && (
                    <div className="right">
                      <a
                        className="theme_btn no_icon btn_fill"
                        data-bs-toggle="modal"
                        data-bs-target="#agentdetailmodal"
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        {" "}
                        Contact Agent
                      </a>
                      <div
                        className="modal fade"
                        id="agentdetailmodal"
                        tabindex="-1"
                        aria-labelledby="agentdetailmodalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content relative">
                            <span
                              className="material-symbols-outlined close_modal"
                              data-bs-dismiss="modal"
                            >
                              close
                            </span>
                            <div className="modal-body">
                              <div className="row">
                                <div className="col-sm-12">
                                  <div className="section_title mb-4">
                                    <h3>Property Agent</h3>
                                  </div>
                                </div>
                                <div className="col-sm-12">
                                  <div className="pcs_other_info propagent_details">
                                    <div className="item pcp_single">
                                      <div className="single_user">
                                        <div className="left">
                                          <div className="user_img">
                                            <img
                                              src="/assets/img/user.png"
                                              alt=""
                                            />
                                          </div>
                                        </div>
                                        <div className="right">
                                          <h5>Sanskar Solanki</h5>
                                        </div>
                                      </div>
                                      <div className="contacts">
                                        <Link
                                          to="tel:+918770534650"
                                          className="contacts_single"
                                        >
                                          <div className="icon">
                                            <span className="material-symbols-outlined">
                                              call
                                            </span>
                                          </div>
                                          <h6>Call</h6>
                                        </Link>
                                        <Link
                                          to="https://wa.me/918770534650"
                                          className="contacts_single"
                                        >
                                          <div className="icon">
                                            <img
                                              src="/assets/img/whatsapp.png"
                                              alt=""
                                            />
                                          </div>
                                          <h6>Whatsapp</h6>
                                        </Link>
                                        <Link
                                          to="mailto:solankisanskar8@gmail.com"
                                          className="contacts_single"
                                        >
                                          <div className="icon">
                                            <span className="material-symbols-outlined">
                                              mail
                                            </span>
                                          </div>
                                          <h6>Email</h6>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <a
                        className="theme_btn no_icon btn_border"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        {" "}
                        Enquire Now
                      </a>
                      <div
                        className="modal fade"
                        id="exampleModal"
                        tabindex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content relative">
                            <span
                              className="material-symbols-outlined close_modal"
                              data-bs-dismiss="modal"
                            >
                              close
                            </span>
                            <div className="modal-body">
                              <form>
                                <div className="row">
                                  <div className="col-sm-12">
                                    <div className="section_title mb-4">
                                      <h3>Enquiry</h3>
                                      <h6 className="modal_subtitle">
                                        Thank you for your interest in reaching
                                        out to us. Please use the form below to
                                        submit any question.
                                      </h6>
                                    </div>
                                  </div>
                                  <div className="col-sm-12">
                                    <div className="form_field st-2">
                                      <div className="field_inner select">
                                        <select>
                                          <option value="" disabled selected>
                                            I am
                                          </option>
                                          {/* <option>Owner</option> */}
                                          <option>Tenant</option>
                                          <option>Agent</option>
                                        </select>
                                        <div className="field_icon">
                                          <span className="material-symbols-outlined">
                                            person
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-12">
                                    <div className="form_field st-2">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Name" />
                                        <div className="field_icon">
                                          <span className="material-symbols-outlined">
                                            person
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-12">
                                    <div className="form_field st-2">
                                      <div className="field_inner">
                                        <input
                                          type="text"
                                          placeholder="Phone Number"
                                        />
                                        <div className="field_icon">
                                          <span className="material-symbols-outlined">
                                            call
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-12">
                                    <div className="submit_btn mt-4">
                                      <button
                                        type="submit"
                                        className="modal_btn theme_btn no_icon btn_fill"
                                      >
                                        Submit
                                        {/* <span className="material-symbols-outlined btn_arrow ba_animation">
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
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {((user && user.role === "owner") ||
          (user && user.role === "coowner")) && (
            <div className="property_card_single">
              <div className="more_detail_card_inner">
                <div className="row no-gutters">
                  <div className="col-md-6">
                    <div className="property_full_address">
                      <h2 className="card_title">
                        {propertyDocument.unitNumber}, {propertyDocument.society}
                      </h2>
                      <h3>
                        {propertyDocument.locality}, {propertyDocument.city}{" "}
                      </h3>
                      <h3>
                        {propertyDocument.state}, {propertyDocument.country},{" "}
                        {propertyDocument.pinCode}
                      </h3>
                    </div>
                    <div className="property_connected_people userlist">
                      <div className="item pcp_single">
                        <div className="property_people_designation">
                          Property Manager
                        </div>
                        <div className="single_user">
                          <div className="left">
                            <div className="user_img">
                              <img src="/assets/img/user.png" alt="" />
                            </div>
                          </div>
                          <div className="right">
                            <h5>Khushi Shrivastav</h5>
                            <h6>9698569856</h6>
                            <h6>Bhopal, India</h6>
                          </div>
                        </div>

                        <div className="contacts">
                          <Link
                            to="tel:+918770534650"
                            className="contacts_single"
                          >
                            <div className="icon">
                              <span className="material-symbols-outlined">call</span>
                            </div>
                            <h6>Call</h6>
                          </Link>
                          <Link
                            to="https://wa.me/918770534650"
                            className="contacts_single"
                          >
                            <div className="icon">
                              <img src="/assets/img/whatsapp.png" alt="" />
                            </div>
                            <h6>Whatsapp</h6>
                          </Link>
                          <Link
                            to="mailto:solankisanskar8@gmail.com"
                            className="contacts_single"
                          >
                            <div className="icon">
                              <span className="material-symbols-outlined">mail</span>
                            </div>
                            <h6>Email</h6>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="userlist property_owners">
                      <div className="single_user">
                        <div className="property_people_designation">Owner</div>
                        <div className="left">
                          <div className="user_img">
                            <img src="/assets/img/user.png" alt="" />
                          </div>
                        </div>
                        <div className="right">
                          <h5>Sanskar Solanki</h5>
                          <h6>8770534650</h6>
                          <h6>Ujjain, India</h6>
                          {user && user.role !== "owner" && (
                            <div className="wc">
                              <img
                                src="/assets/img/whatsapp.png"
                                className="pointer"
                                alt=""
                              />
                              <img
                                src="/assets/img/phone-call.png"
                                className="pointer"
                                alt=""
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="single_user">
                        <div className="property_people_designation">
                          Co-Owner
                        </div>
                        <div className="left">
                          <div className="user_img">
                            <img src="/assets/img/user.png" alt="" />
                          </div>
                        </div>
                        <div className="right">
                          <h5>Sanskar Solanki</h5>
                          <h6>8770534650</h6>
                          <h6>Ujjain, India</h6>
                          <div className="wc">
                            <img
                              src="/assets/img/whatsapp.png"
                              className="pointer"
                              alt=""
                            />
                            <img
                              src="/assets/img/phone-call.png"
                              className="pointer"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                      <div className="single_user">
                        <div className="property_people_designation">POC</div>
                        <div className="left">
                          <div className="user_img">
                            <img src="/assets/img/user.png" alt="" />
                          </div>
                        </div>
                        <div className="right">
                          <h5>Sanskar Solanki</h5>
                          <h6>8770534650</h6>
                          <h6>Ujjain, India</h6>
                          <div className="wc">
                            <img
                              src="/assets/img/whatsapp.png"
                              className="pointer"
                              alt=""
                            />
                            <img
                              src="/assets/img/phone-call.png"
                              className="pointer"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        {user && user.role === "owner" && (
          <div className="property_card_single">
            <div className="more_detail_card_inner">
              <div className="row no-gutters">
                <div className="col-md-6">
                  <div className="property_full_address">
                    <h2 className="card_title">escalation matrix</h2>
                  </div>
                  <div className="property_connected_people userlist">
                    <div className="item pcp_single">
                      <div className="property_people_designation">
                        Indian contact number
                      </div>
                      <div className="single_user">
                        {/* <div className="left">
                                        <div className="user_img">
                                            <img src="/assets/img/user.png" alt="" />
                                        </div>
                                    </div> */}
                        <div className="right">
                          <h5>+91 9698569856</h5>
                          <h6>indiacontactnumber@gmail.com</h6>
                        </div>
                      </div>
                      <div className="contacts">
                        <Link
                          to="tel:+918770534650"
                          className="contacts_single"
                        >
                          <div className="icon">
                            <span className="material-symbols-outlined">call</span>
                          </div>
                          <h6>Call</h6>
                        </Link>
                        <Link
                          to="https://wa.me/918770534650"
                          className="contacts_single"
                        >
                          <div className="icon">
                            <img src="/assets/img/whatsapp.png" alt="" />
                          </div>
                          <h6>Whatsapp</h6>
                        </Link>
                        <Link
                          to="mailto:solankisanskar8@gmail.com"
                          className="contacts_single"
                        >
                          <div className="icon">
                            <span className="material-symbols-outlined">mail</span>
                          </div>
                          <h6>Email</h6>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="userlist property_owners">
                    <div className="single_user">
                      <div className="property_people_designation">Level 1</div>
                      <div className="right">
                        <h5>8770534650</h5>
                        <h6>level1@gmail.com</h6>
                        {/* <div className="wc">
                                        <img src="/assets/img/whatsapp.png" className="pointer" alt="" />
                                        <img src="/assets/img/phone-call.png" className="pointer" alt="" />

                                    </div> */}
                      </div>
                    </div>
                    <div className="single_user">
                      <div className="property_people_designation">Level 2</div>
                      <div className="right">
                        <h5>8770534650</h5>
                        <h6>level2@gmail.com</h6>
                        {/* <div className="wc">
                                        <img src="/assets/img/whatsapp.png" className="pointer" alt="" />
                                        <img src="/assets/img/phone-call.png" className="pointer" alt="" />

                                    </div> */}
                      </div>
                    </div>
                    <div className="single_user">
                      <div className="property_people_designation">Level 3</div>
                      <div className="right">
                        <h5>8770534650</h5>
                        <h6>level3@gmail.com</h6>
                        {/* <div className="wc">
                                        <img src="/assets/img/whatsapp.png" className="pointer" alt="" />
                                        <img src="/assets/img/phone-call.png" className="pointer" alt="" />

                                    </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="property_card_single">
          <div className="more_detail_card_inner">
            <h2 className="card_title">Property Type</h2>
            <div className="p_info">
              <div className="p_info_single">
                <h6>Type:</h6>
                <h5>{propertyDocument.bhk} BHK</h5>
              </div>
              <div className="p_info_single">
                <h6>Floor no:</h6>
                <h5>{propertyDocument.floorNumber}</h5>
              </div>
              <div className="p_info_single">
                <h6>Age of Property:</h6>
                <h5> {ageOfProperty} year</h5>
              </div>
              <div className="p_info_single">
                <h6>Furnishing:</h6>
                <h5>{propertyDocument.furnishing}</h5>
              </div>
              <div className="p_info_single">
                <h6>Bedrooms:</h6>
                <h5>{propertyDocument.numberOfBedrooms}</h5>
              </div>
              <div className="p_info_single">
                <h6>Bathrooms:</h6>
                <h5>{propertyDocument.numberOfBathrooms}</h5>
              </div>
              <div className="p_info_single">
                <h6>Balcony:</h6>
                <h5>{propertyDocument.numberOfBalcony}</h5>
              </div>
              <div className="p_info_single">
                <h6>Kitchen:</h6>
                <h5>{propertyDocument.numberOfKitchen}</h5>
              </div>
              <div className="p_info_single">
                <h6>Living Area:</h6>
                <h5>{propertyDocument.numberOfLivingArea}</h5>
              </div>
              <div className="p_info_single">
                <h6>Dining Area:</h6>
                <h5>{propertyDocument.diningarea}</h5>
              </div>
              <div className="p_info_single">
                <h6>Living & Dining:</h6>
                <h5>{propertyDocument.livingdining}</h5>
              </div>
              <div className="p_info_single">
                <h6>Passages:</h6>
                <h5>{propertyDocument.passages}</h5>
              </div>
              <div className="p_info_single">
                <h6>Entrance Gallery:</h6>
                <h5>{propertyDocument.entrancegallery}</h5>
              </div>
              {propertyDocument.numberOfBasement &&
                propertyDocument.numberOfBasement !== "0" && (
                  <div className="p_info_single">
                    <h6>Basement:</h6>
                    <h5>{propertyDocument.numberOfBasement}</h5>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className="property_card_single">
          <div className="more_detail_card_inner">
            <h2 className="card_title">Property Size</h2>
            <div className="p_info">
              <div className="p_info_single">
                <h6>Plot Area:</h6>
                <h5>
                  {propertyDocument.plotArea}{" "}
                  {propertyDocument.plotArea
                    ? propertyDocument.plotAreaUnit
                    : ""}
                </h5>
              </div>
              <div className="p_info_single">
                <h6>Super Area:</h6>
                <h5>
                  {propertyDocument.superArea}{" "}
                  {propertyDocument.superArea
                    ? propertyDocument.superAreaUnit
                    : ""}
                </h5>
              </div>
              <div className="p_info_single">
                <h6>Built-up Area:</h6>
                <h5>
                  {propertyDocument.builtUpArea}{" "}
                  {propertyDocument.builtUpArea
                    ? propertyDocument.builtUpAreaUnit
                    : ""}
                </h5>
              </div>
              <div className="p_info_single">
                <h6>Carpet Area:</h6>
                <h5>
                  {propertyDocument.carpetArea}{" "}
                  {propertyDocument.carpetArea
                    ? propertyDocument.carpetAreaUnit
                    : ""}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="property_card_single">
          <div className="more_detail_card_inner">
            <h2 className="card_title">Parking</h2>
            <div className="p_info">
              <div className="p_info_single">
                <h6>Car Parking:</h6>
                <h5>{propertyDocument.numberOfCarParking}</h5>
              </div>
              <div className="p_info_single">
                <h6>2 Wheeler Parking:</h6>
                <h5>{propertyDocument.twowheelerparking}</h5>
              </div>
            </div>
          </div>
        </div>

        {propertyDocument.additionalRooms &&
          propertyDocument.additionalRooms !== null &&
          propertyDocument.additionalRooms !== "" &&
          propertyDocument.additionalRooms.length > 0 && (
            <div className="property_card_single">
              <div className="more_detail_card_inner">
                <h2 className="card_title">
                  Additional Rooms {/* pending  */}
                </h2>
                <div className="p_info">
                  {propertyDocument.additionalRooms.map((additionalroom) => (
                    <div className="p_info_single">
                      <h6>{additionalroom}</h6>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        {propertyDocument.additionalArea &&
          propertyDocument.additionalArea !== null &&
          propertyDocument.additionalArea !== "" &&
          propertyDocument.additionalArea.length > 0 && (
            <div className="property_card_single">
              <div className="more_detail_card_inner">
                <h2 className="card_title">Additional Area {/* pending  */}</h2>
                <div className="p_info">
                  {propertyDocument.additionalArea.map((additionalarea) => (
                    <div className="p_info_single">
                      <h6>{additionalarea}</h6>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        <div className="property_card_single">
          <div className="more_detail_card_inner">
            <h2 className="card_title">Building</h2>
            <div className="p_info">
              <div className="p_info_single">
                <h6>Total Floors :</h6>
                <h5>{propertyDocument.totalFloor}</h5>
              </div>
              <div className="p_info_single">
                <h6>Floor Number :</h6>
                <h5>{propertyDocument.floorNumber}</h5>
              </div>
              <div className="p_info_single">
                <h6>Apartment on Floor :</h6>
                <h5>{propertyDocument.numberOfAptOnFloor}</h5>
              </div>
              <div className="p_info_single">
                <h6>Lift :</h6>
                <h5>{propertyDocument.numberOfLifts}</h5>
              </div>
              <div className="p_info_single">
                <h6>
                  Power Backup
                  {/* pending  */}
                </h6>
                <h5>{propertyDocument.powerbackup}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PDSingleCard;
