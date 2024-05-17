import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "react-image-gallery/styles/css/image-gallery.css";
import Gallery from "react-image-gallery";
import Switch from "react-switch";
import { Navigate, Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import "./UserList.css"
// component
import PropertyImageGallery from "../PropertyImageGallery";
const PropertyDetails = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  // get user from useauthcontext
  const { id } = useParams();
  // console.log('property id: ', id)
  const { user } = useAuthContext();

  const { document: propertyDocument, error: propertyDocError } = useDocument(
    "properties",
    id
  );
  console.log("propertiesdocument:", propertyDocument);

  // variable of property age
  const ageOfProperty = ""; //2023 - propertyDocument.yearOfConstruction;
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

  // upload tenant code start 
  const [tenantName, setTenantName] = useState('Sanskar Solanki');
  // const [tenantWhatsappNumber, setTenantWhatsappNumber] = useState('+919009939289');
  const [tenantCallNumber, seTenantCallNumber] = useState('8770534650');
  const [isTenantEditing, setIsTenantEditing] = useState(false);

  const [selectedTenantImage, setSelectedTenantImage] = useState(null);
  const [previewTenantImage, setPreviewTenantImage] = useState(null);

  const handleEditTenantToggle = () => {
    setIsTenantEditing(!isTenantEditing);
  };

  const handleTenantImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedTenantImage(file);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewTenantImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveTenantImage = () => {
    setSelectedTenantImage(null);
    setPreviewTenantImage(null);
  };


  const getImageSrc = () => {
    if (isTenantEditing && !previewTenantImage) {
      return '/assets/img/upload_img_small.png';
    } else if (previewTenantImage) {
      return previewTenantImage;
    } else {
      return '/assets/img/user_dummy.png';
    }
  };

  // upload tenant code end 


  return (
    <div className="pg_property aflbg pd_single">
      {/* top search bar */}
      {!user && (
        <div className="top_search_bar">
          <Link to="/search-property" className="back_btn">
            <span class="material-symbols-outlined">arrow_back</span>
            <span>Back</span>
          </Link>
        </div>
      )}
      <br></br>
      <section className="property_cards">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              {propertyDocument && (
                <div className="">
                  {
                    <div className="property_card_single">
                      <div className="pcs_inner pointer" to="/pdsingle">
                        <PropertyImageGallery></PropertyImageGallery>
                        <div className="pcs_main_detail">
                          <div className="pmd_top">
                            <h4 className="property_name">
                              {propertyDocument.bhk} |{" "}
                              {propertyDocument.furnishing} Furnished | for{" "}
                              {propertyDocument.purpose}
                              <br />
                            </h4>
                            <h6 className="property_location">
                              {propertyDocument.locality},{" "}
                              {propertyDocument.city}, {propertyDocument.state}
                            </h6>
                          </div>
                          <div className="divider"></div>
                          <div className="pmd_section2 row">
                            <div className="pdms_single col-4">
                              <h4>
                                <span className="currency">₹</span>
                                {propertyDocument.demandprice}
                                <span className="price"></span>
                              </h4>
                              {propertyDocument.superArea !== "" ? (
                                <h6>
                                  {propertyDocument.superArea}{" "}
                                  {propertyDocument.superAreaUnit}
                                </h6>
                              ) : (
                                <h6>
                                  {propertyDocument.superArea}{" "}
                                  {propertyDocument.superAreaUnit}
                                </h6>
                              )}
                            </div>
                            <div className="pdms_single col-4">
                              <h4>{propertyDocument.carpetArea}</h4>
                              <h6>Area in {propertyDocument.carpetAreaUnit}</h6>
                            </div>
                            <div className="pdms_single col-4"></div>
                          </div>
                          <div className="divider"></div>
                          <div className="pmd_section2 pmd_section3 row">
                            <div className="pdms_single col-4">
                              <h4>
                                <img src="/assets/img/new_carpet.png"></img>

                                252sq/ft
                              </h4>
                              <h6>Super Area</h6>
                            </div>
                            <div className="pdms_single col-4">
                              <h4>
                                <img src="/assets/img/new_bedroom.png"></img>
                                {propertyDocument.numberOfBedrooms}
                              </h4>
                              <h6>Bedrooms</h6>
                            </div>
                            <div className="pdms_single col-4">
                              <h4>
                                <img src="/assets/img/new_bathroom.png"></img>
                                {propertyDocument.numberOfBathrooms}
                              </h4>
                              <h6>Bathroom</h6>
                            </div>
                          </div>
                          <div className="divider"></div>
                          <div className="pmd_section2 pmd_section3 row">
                            <div className="pdms_single col-4">
                              <h4>
                                <img src="/assets/img/new_super_area.png"></img>
                                222 sq/ft
                              </h4>
                              <h6>Carpet Area</h6>
                            </div>
                            <div className="pdms_single col-4">
                              <h4>
                                <img src="/assets/img/new_bhk.png"></img>
                                3
                              </h4>
                              <h6>BHK</h6>
                            </div>
                            <div className="pdms_single col-4">
                              <h4>
                                <img src="/assets/img/new_furniture.png"></img>
                                Furnished
                              </h4>
                              <h6>Furnishing</h6>
                            </div>
                          </div>
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
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  >
                                    {" "}
                                    Contact Agent
                                  </a>
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
                                                    Thank you for your interest in
                                                    reaching out to us. Please use
                                                    the form below to submit any
                                                    question.
                                                  </h6>
                                                </div>
                                              </div>
                                              <div className="col-sm-12">
                                                <div className="form_field st-2">
                                                  <div className="field_inner select">
                                                    <select>
                                                      <option
                                                        value=""
                                                        disabled
                                                        selected
                                                      >
                                                        I am
                                                      </option>

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
                                                    <input
                                                      type="text"
                                                      placeholder="Name"
                                                    />
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
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </form>
                                        </div>
                                        )
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  }

                  {((user && user.role === "owner") ||
                    (user && user.role === "coowner")
                    ||
                    (user && user.role === "admin")
                  ) && (
                      <div className="property_card_single">
                        <div className="more_detail_card_inner">
                          <div className="row no-gutters">
                            <div className="col-md-6">
                              <div className="property_full_address">
                                <h2 className="card_title">
                                  {propertyDocument.unitNumber},{" "}
                                  {propertyDocument.society}
                                </h2>
                                <h3>
                                  {propertyDocument.locality},{" "}
                                  {propertyDocument.city}{" "}
                                </h3>
                                <h3>
                                  {propertyDocument.state},{" "}
                                  {propertyDocument.country},{" "}
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
                            <div className="col-md-6">
                              <div className="userlist property_owners">
                                <div className="single_user">
                                  <div className="property_people_designation">
                                    Owner
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
                                  <div className="property_people_designation">
                                    POC
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
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  <div className="vg10"></div>
                  <div className="tenant_card">
                    <div className="tc_single relative">
                      <div className="tcs_img_container">
                        <img
                          src={getImageSrc()}
                          alt="Preview"
                        />
                        {/* {isTenantEditing && previewTenantImage && (
                          <div
                            onClick={handleRemoveTenantImage}
                          >
                            X
                          </div>

                        )} */}
                        {isTenantEditing && (
                          <div className="upload_tenant_img">
                            <label htmlFor="ut_img">
                              <input type="file" accept="image/*" id="ut_img" onChange={handleTenantImageChange} />
                            </label>
                          </div>
                        )}

                      </div>
                      <div className={`tenant_detail ${isTenantEditing ? "td_edit" : ""} `}>
                        <input
                          type="text"
                          value={tenantName}
                          onChange={(e) => setTenantName(e.target.value)}
                          readOnly={!isTenantEditing}
                          className="t_name"

                        />
                        <input
                          type="number"
                          value={tenantCallNumber}
                          onChange={(e) => seTenantCallNumber(e.target.value)}
                          readOnly={!isTenantEditing}
                          className="t_number"
                        />


                      </div>
                      <div className="wha_call_icon">
                        <Link className="call_icon wc_single">
                          <img src="/assets/img/simple_call.png" alt="" />
                        </Link>
                        <Link className="wha_icon wc_single">
                          <img src="/assets/img/whatsapp_simple.png" alt="" />
                        </Link>

                      </div>
                      <span className="edit_save" onClick={handleEditTenantToggle}>
                        {isTenantEditing ? 'save' : 'edit'}
                        </span>
                    </div>
                  </div>
                  <div className="vg10"></div>
                  {user && user.role === "owner" ||
                    (user && user.role === "admin") && (
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
                            <div className="col-md-6">
                              <div className="userlist property_owners">
                                <div className="single_user">
                                  <div className="property_people_designation">
                                    Level 1
                                  </div>
                                  <div className="right">
                                    <h5>8770534650</h5>
                                    <h6>level1@gmail.com</h6>
                                  </div>
                                </div>
                                <div className="single_user">
                                  <div className="property_people_designation">
                                    Level 2
                                  </div>
                                  <div className="right">
                                    <h5>8770534650</h5>
                                    <h6>level2@gmail.com</h6>
                                  </div>
                                </div>
                                <div className="single_user">
                                  <div className="property_people_designation">
                                    Level 3
                                  </div>
                                  <div className="right">
                                    <h5>8770534650</h5>
                                    <h6>level3@gmail.com</h6>
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
                      <h2 className="card_title">Basic About Property</h2>
                      <div className="p_info">
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/unitNo.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Unit Number</h6>
                            <h5>252</h5>
                          </div>
                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/calendar.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Property Added Date</h6>
                            <h5>20/jan/2024</h5>
                          </div>

                        </div>

                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/Property_status.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Property Status</h6>
                            <h5> Active</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/ownership.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Ownership</h6>
                            <h5>Free Hold</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/property_source.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Property Source</h6>
                            <h5>ICICI</h5>
                          </div>

                        </div>

                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/Purpose.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Purpose</h6>
                            <h5>Rent</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/package.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Package</h6>
                            <h5>Broker</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/property_flag.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Property Flag</h6>
                            <h5>In Maintainance</h5>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="property_card_single">
                    <div className="more_detail_card_inner">
                      <h2 className="card_title">Property Type</h2>
                      <div className="p_info">
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/calendar.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Type</h6>
                            <h5>{propertyDocument.bhk} BHK</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/FloorNumber.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Floor no</h6>
                            <h5>{propertyDocument.floorNumber}</h5>
                          </div>

                        </div>

                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/furnishing.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Furnishing</h6>
                            <h5>{propertyDocument.furnishing}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/bedrooms.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Bedrooms</h6>
                            <h5>{propertyDocument.numberOfBedrooms}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/bathrroms.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Bathrooms</h6>
                            <h5>{propertyDocument.numberOfBathrooms}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/balcony.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Balcony</h6>
                            <h5>{propertyDocument.numberOfBalcony}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/kitchen.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Kitchen</h6>
                            <h5>{propertyDocument.numberOfKitchen}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/livingArea.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Living Area</h6>
                            <h5>{propertyDocument.numberOfLivingArea}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/diningArea.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Dining Area</h6>
                            <h5>{propertyDocument.diningarea}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/livingDining.png" alt="" />
                          </div>

                          <div className="pis_content">
                            <h6>Living & Dining:</h6>
                            <h5>{propertyDocument.livingdining}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/passages.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Passages</h6>
                            <h5>{propertyDocument.passages}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/entrance-gallery.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Entrance Gallery</h6>
                            <h5>{propertyDocument.entrancegallery}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/yearOfConstruction.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Year of Constuction</h6>
                            <h5>2018</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/ageOfproperty.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Age of Property</h6>
                            <h5> {ageOfProperty} year</h5>
                          </div>

                        </div>

                        {propertyDocument.numberOfBasement &&
                          propertyDocument.numberOfBasement !== "0" && (
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img src="/assets/img/property-detail-icon/calendar.png" alt="" />
                              </div>
                              <div className="pis_content">
                                <h6>Basement</h6>
                                <h5>{propertyDocument.numberOfBasement}</h5>
                              </div>

                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="property_card_single">
                    <div className="more_detail_card_inner">
                      <h2 className="card_title">Additional Rooms</h2>
                      <div className="p_info">
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/servantRoom.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>1</h6>
                            <h5>Servent Room</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/officeRoom.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>2</h6>
                            <h5>Office Room</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/storeRoom.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>3</h6>
                            <h5> Store Room</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/poojaRoom.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>4</h6>
                            <h5>Pooja Room</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/studyRoom.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>5</h6>
                            <h5>Study Room</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/powerRoom.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>6</h6>
                            <h5>
                              Power Room</h5>
                          </div>

                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="property_card_single">
                    <div className="more_detail_card_inner">
                      <h2 className="card_title">Additional Area</h2>
                      <div className="p_info">
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/frontyard.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>1</h6>
                            <h5>Front Yard</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/backyard.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>2</h6>
                            <h5>Back Yard</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/terrace.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>3</h6>
                            <h5> Terrace</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/privateGarden.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>4</h6>
                            <h5>
                              Private Garden</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/garage.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>5</h6>
                            <h5>Garage</h5>
                          </div>

                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="property_card_single">
                    <div className="more_detail_card_inner">
                      <h2 className="card_title">Property Size</h2>
                      <div className="p_info">
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/calendar.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Plot Area:</h6>
                            <h5>
                              {propertyDocument.plotArea}{" "}
                              {propertyDocument.plotArea
                                ? propertyDocument.plotAreaUnit
                                : ""}
                            </h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/superArea.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Super Area</h6>
                            <h5>
                              {propertyDocument.superArea}{" "}
                              {propertyDocument.superArea
                                ? propertyDocument.superAreaUnit
                                : ""}
                            </h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/buildUpArea.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Built-up Area</h6>
                            <h5>
                              {propertyDocument.builtUpArea}{" "}
                              {propertyDocument.builtUpArea
                                ? propertyDocument.builtUpAreaUnit
                                : ""}
                            </h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/carpetArea.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Carpet Area</h6>
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
                  </div>
                  <div className="property_card_single">
                    <div className="more_detail_card_inner">
                      <h2 className="card_title">Parking</h2>
                      <div className="p_info">
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/car-parking.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Car Parking Mode</h6>
                            <h5>Open</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/car-parking.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>No. Car Parking</h6>
                            <h5>{propertyDocument.numberOfCarParking}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/2Wheelerparking.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>2 Wheeler Parking</h6>
                            <h5>{propertyDocument.twowheelerparking}</h5>
                          </div>

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
                          <h2 className="card_title">Additional Rooms </h2>
                          <div className="p_info">
                            {propertyDocument.additionalRooms.map(
                              (additionalroom) => (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img src="/assets/img/property-detail-icon/calendar.png" alt="" />
                                  </div>
                                  <h6>{additionalroom}</h6>
                                </div>
                              )
                            )}
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
                          <h2 className="card_title">Additional Area</h2>
                          <div className="p_info">
                            {propertyDocument.additionalArea.map(
                              (additionalarea) => (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img src="/assets/img/property-detail-icon/calendar.png" alt="" />
                                  </div>
                                  <h6>{additionalarea}</h6>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="property_card_single">
                    <div className="more_detail_card_inner">
                      <h2 className="card_title">Building</h2>
                      <div className="p_info">
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/TotalFloors.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Total Floors</h6>
                            <h5>{propertyDocument.totalFloor}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/FloorNumber.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Floor Number</h6>
                            <h5>{propertyDocument.floorNumber}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/apartmentOnFloor.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Apartment on Floor</h6>
                            <h5>{propertyDocument.numberOfAptOnFloor}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/lift.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Lift</h6>
                            <h5>{propertyDocument.numberOfLifts}</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/PowerBackup.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Power Backup</h6>
                            <h5>{propertyDocument.powerbackup}</h5>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="property_card_single">
                    <div className="more_detail_card_inner">
                      <h2 className="card_title">Additional Info</h2>
                      <div className="p_info">
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/mainDoorFacing.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Main Door Facing</h6>
                            <h5>East</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/Overlooking.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Overlooking</h6>
                            <h5>East</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/balcony_windowsFacing.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Balcony/Window Facing</h6>
                            <h5>East</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/VisitingHrsFrom.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Visiting Hours From</h6>
                            <h5></h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/VisitingHrsTo.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Visiting Hours To</h6>
                            <h5></h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/VisitingDays.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Visiting Days</h6>
                            <h5>Monday</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/BachelorBoys.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Bachelor Boys Allowed</h6>
                            <h5>Yes</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/BachelorGirls.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Bachelor Girls Allowed</h6>
                            <h5>Yes</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/pets.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>Pets Allowed</h6>
                            <h5>Yes</h5>
                          </div>

                        </div>
                        <div className="p_info_single">
                          <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/calendar.png" alt="" />
                          </div>
                          <div className="pis_content">
                            <h6>:</h6>
                            <h5>No choice</h5>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="property_card_single">
                        <div className="more_detail_card_inner">
                          <h2 className="card_title">Property Description</h2>
                          <div className="p_info_single"
                            style={{
                              width: "100%"
                            }}>
                            <h6>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error nisi eaque fuga cum laudantium accusantium. Ipsam, rerum. Placeat minima quia voluptatum facere animi fuga, totam aut, earum accusamus, odit sed!</h6>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="col-lg-6">
                      <div className="property_card_single">
                        <div className="more_detail_card_inner">
                          <h2 className="card_title">Owner Instruction</h2>
                          <div className="p_info_single"
                            style={{
                              width: "100%"
                            }}>
                            <h6>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error nisi eaque fuga cum laudantium accusantium. Ipsam, rerum. Placeat minima quia voluptatum facere animi fuga, totam aut, earum accusamus, odit sed!</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* <div className="col-xl-3">
              <div className="pp_sidebar">
                <div className="pp_sidebar_cards">
                  <div className="pp_sidebarcard_single">
                    <div className="ppss_img">
                      <img src="/assets/img/property/p2.jpg" alt="" />
                    </div>
                    <div className="ppss_header">
                      <h5>Brij Residency Phase 2</h5>
                      <h6>GRV Constructions</h6>
                      <h6 className="location">MR 11, Indore</h6>
                    </div>
                    <div className="ppss_footer">
                      <h6>1, 3 BHK Flats</h6>
                      <h6>
                        <span>₹ 22.2 Lac</span> onwards
                      </h6>
                      <h6>Marketed by D2R</h6>
                    </div>
                  </div>
                  <div className="pp_sidebarcard_single">
                    <div className="ppss_img">
                      <img src="/assets/img/property/p2.jpg" alt="" />
                    </div>
                    <div className="ppss_header">
                      <h5>Brij Residency Phase 2</h5>
                      <h6>GRV Constructions</h6>
                      <h6 className="location">MR 11, Indore</h6>
                    </div>
                    <div className="ppss_footer">
                      <h6>1, 3 BHK Flats</h6>
                      <h6>
                        <span>₹ 22.2 Lac</span> onwards
                      </h6>
                      <h6>Marketed by D2R</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>
      <br></br>
    </div>
  );
};

export default PropertyDetails;
