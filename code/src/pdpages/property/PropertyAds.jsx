import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { Modal } from "react-bootstrap"; // Ensure you have imported Modal
import { format } from "date-fns";
import PropertySummaryCard from "./PropertySummaryCard";
import InactiveUserCard from "../../components/InactiveUserCard";
const PropertyAds = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  // get id from url
  const { propertyId } = useParams();
  // get property document
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties-propdial",
    propertyId
  );

  // add document
  const { addDocument, updateDocument, deleteDocument, error } =
    useFirestore("advertisements");

  // get adv document
  const { documents: advDoc, errors: advDocError } = useCollection(
    "advertisements",
    ["propertyId", "==", propertyId],
    ["createdAt", "desc"]
  );

  // all use states
  const [showAIForm, setShowAIForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAdvPortal, setSelectedAdvPortal] = useState("");
  const [advLink, setAdvLink] = useState("");
  const [portalPropId, setPortalPropId] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  // functions
  const handleShowAIForm = () => setShowAIForm(!showAIForm);
  const cancelClick = () => {
 
    setShowAIForm(!showAIForm);   
   
    setSelectedAdvPortal("");
    setPortalPropId("");
    setSelectedPropertyType("");
    setAdvLink(""); 
    setErrors([]);
 
  };

  const handleAdvPortalChange = (event) => {
    setSelectedAdvPortal(event.target.value);
    if (errors.selectedAdvPortal) {
      setErrors((prevErrors) => ({ ...prevErrors, selectedAdvPortal: "" }));
    }
  };
  const handlePortalPropIdChange = (event) => {
    setPortalPropId(event.target.value);
    if (errors.portalPropId) {
      setErrors((prevErrors) => ({ ...prevErrors, portalPropId: "" }));
    }
  };

  const handlePropertyTypeChange = (event) => {
    setSelectedPropertyType(event.target.value);
    if (errors.selectedPropertyType) {
      setErrors((prevErrors) => ({ ...prevErrors, selectedPropertyType: "" }));
    }
  };

  const handleAdvLinkChange = (event) => {
    setAdvLink(event.target.value);
    if (errors.advLink) {
      setErrors((prevErrors) => ({ ...prevErrors, advLink: "" }));
    }
  };
  const handleDeleteClick = (docId) => {
    setDocToDelete(docId);
    setShowConfirmModal(true);
  };

  // Function to hide the modal
  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    setDocToDelete(null);
  };

  // Function to delete the document after confirmation
  const confirmDeleteDocument = async () => {
    try {
      if (docToDelete) {
        await deleteDocument(docToDelete);
        setShowConfirmModal(false);
        setDocToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // error set code
  const [errors, setErrors] = useState({});

  // Validate form and set error messages
  const validateForm = () => {
    const newErrors = {};

    if (!selectedAdvPortal)
      newErrors.selectedAdvPortal = "Please select an advertisement portal.";
    if (!portalPropId) newErrors.portalPropId = "Please enter the property ID";
    if (!selectedPropertyType)
      newErrors.selectedPropertyType = "Please select the property type.";
    if (!advLink) newErrors.advLink = "Please enter a valid URL.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  useEffect(() => {
    // Clear errors whenever the fields change
    if (selectedAdvPortal)
      setErrors((prevErrors) => ({ ...prevErrors, selectedAdvPortal: "" }));
    if (portalPropId)
      setErrors((prevErrors) => ({ ...prevErrors, portalPropId: "" }));
    if (selectedPropertyType)
      setErrors((prevErrors) => ({ ...prevErrors, selectedPropertyType: "" }));
    if (advLink) setErrors((prevErrors) => ({ ...prevErrors, advLink: "" }));
  }, [selectedAdvPortal, portalPropId, selectedPropertyType, advLink]);

  // add document code
  const addAdvertisements = async () => {
    if (!validateForm()) return;

    try {
      setIsUploading(true);
      const docRef = await addDocument({
        advLink,
        advPortal: selectedAdvPortal,
        pid: propertydoc.pid,
        portalPropId,
        propertyType: selectedPropertyType,
        propertyId,
        postedBy: "Propdial",
      });

      setSelectedAdvPortal("");
      setPortalPropId("");
      setSelectedPropertyType("");
      setAdvLink("");
      setIsUploading(false);
      setShowAIForm(!showAIForm);
      // setNewDocId(docRef.id);
    } catch (error) {
      console.error("Error adding document:", error);
      setSelectedAdvPortal("");
      setPortalPropId("");
      setSelectedPropertyType("");
      setAdvLink("");
      setIsUploading(false);
      setShowAIForm(!showAIForm);
    }
  };

  // render jsx code in short form start
  const advPortal = [
    { id: "housing", value: "Housing", label: "Housing" },
    {
      id: "magicbricks",
      value: "Magicbricks",
      label: "Magicbricks",
    },
    { id: "acre99", value: "99Acre", label: "99Acre" },
    { id: "commonfloor", value: "CommonFloor", label: "CommonFloor" },
  ];

  const propertyType = [
    { id: "rent", value: "Rent", label: "Rent" },
    {
      id: "sale",
      value: "Sale",
      label: "Sale",
    },
  ];
  return (
    <>
      {user && user.status === "active" ? (
        <div className="top_header_pg pg_bg property_adv_pg">
          <div className="page_spacing pg_min_height">
            <div className="row row_reverse_991">
              <div className="col-lg-6">
                <div className="title_card mobile_full_575 mobile_gap h-100">
                  <h2 className="text-center mb-4">
                    OnePlace for Property Advertisements
                  </h2>
                  {/* <h6 className="text-center mt-1 mb-2">Your Central Hub for Viewing, Downloading, and Uploading Property Documents</h6> */}
                  {!showAIForm && (
                    <div
                      className="theme_btn btn_fill no_icon text-center short_btn"
                      onClick={handleShowAIForm}
                    >
                      Add New Advertisement
                    </div>
                  )}
                </div>
              </div>
              <PropertySummaryCard
                propertydoc={propertydoc}
                propertyId={propertyId}
              />
            </div>
            {showAIForm && (
              <>
                <div className="vg22"></div>
                <section className="my_big_card mobile_full_575 ">
                  {/* <h2 className="card_title">Select any one document ID</h2> */}
                  <div className="aai_form">
                    <div className="row row_gap_20">
                      <div className="col-xl-6 col-md-12">
                        <div
                          className="form_field w-100"
                          style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid rgb(3 70 135 / 22%)",
                          }}
                        >
                          <h6
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                              marginBottom: "8px",
                              color: "var(--theme-blue)",
                            }}
                          >
                            Select Advertisement Portal*
                          </h6>
                          <div className="field_box theme_radio_new">
                            <div className="theme_radio_container">
                              {advPortal.map((portal) => (
                                <div className="radio_single" key={portal.id}>
                                  <input
                                    type="radio"
                                    name="doc_cat"
                                    id={portal.id}
                                    value={portal.value}
                                    onChange={handleAdvPortalChange}
                                    checked={selectedAdvPortal === portal.value}
                                  />
                                  <label htmlFor={portal.id}>
                                    {portal.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          {errors.selectedAdvPortal && (
                            <div className="field_error w-100">
                              {errors.selectedAdvPortal}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-6">
                        <div className="add_info_text w-100">
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                            }}
                          >
                            <h6
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                                color: "var(--theme-blue)",
                              }}
                            >
                              Property ID of Portal*
                            </h6>
                            <div className="relative w-100">
                              <input
                                type="text"
                                value={portalPropId}
                                onChange={handlePortalPropIdChange}
                                placeholder="Enter Property ID from the portal"
                                className="w-100"
                              />
                              {errors.portalPropId && (
                                <div className="field_error">
                                  {errors.portalPropId}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-6">
                        <div
                          className="form_field w-100"
                          style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid rgb(3 70 135 / 22%)",
                          }}
                        >
                          <h6
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                              marginBottom: "8px",
                              color: "var(--theme-blue)",
                            }}
                          >
                            Select Property Type*
                          </h6>
                          <div className="field_box theme_radio_new">
                            <div className="theme_radio_container">
                              {propertyType.map((pt) => (
                                <div className="radio_single" key={pt.id}>
                                  <input
                                    type="radio"
                                    name="p_t"
                                    id={pt.id}
                                    value={pt.value}
                                    onChange={handlePropertyTypeChange}
                                    checked={selectedPropertyType === pt.value}
                                  />
                                  <label htmlFor={pt.id}>{pt.label}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                          {errors.selectedPropertyType && (
                            <div className="field_error w-100">
                              {errors.selectedPropertyType}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-xl-12 col-md-12">
                        <div className="add_info_text w-100">
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                            }}
                          >
                            <h6
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                                color: "var(--theme-blue)",
                              }}
                            >
                              Paste the link of the property advertisement*
                            </h6>
                            <div className="relative w-100">
                              <input
                                type="text"
                                value={advLink}
                                onChange={handleAdvLinkChange}
                                placeholder="Link (e.g. https://example.com/)"
                                className="w-100"
                              />
                            </div>
                            {errors.advLink && (
                              <div className="field_error">
                                {errors.advLink}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-7"></div>
                    <div className="col-md-2 col-6">
                      <div
                        className="theme_btn btn_border text-center no_icon"
                        onClick={isUploading ? null : cancelClick}
                      >
                        Cancel
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div
                        className={`theme_btn btn_fill text-center no_icon ${
                          isUploading ? "disabled" : ""
                        }`}
                        onClick={isUploading ? null : addAdvertisements}
                      >
                        {isUploading ? "Uploading..." : "Save"}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
            {advDoc && advDoc.length !== 0 && (
              <>
                <div className="vg22"></div>
              </>
            )}
            {advDoc && advDoc.length === 0 && (
              <div
                className="pg_msg"
                style={{
                  height: "calc(55vh)",
                }}
              >
                <div>No Advertisement Yet!</div>
              </div>
            )}
            <div className="my_small_card_parent">
              {advDoc &&
                advDoc.map((doc, index) => (
                  <div className="my_small_card notification_card" key={index}>
                    {user && user.role === "superAdmin" && (
                      <span
                        className="material-symbols-outlined delete_icon_top"
                        onClick={() => handleDeleteClick(doc.id)} // Set the document to delete
                      >
                        delete_forever
                      </span>
                    )}
                    <div className="top_tag_left working">
                      For {doc.propertyType}
                    </div>
                    <div className="left">
                      <div className="img_div">
                        {doc.advPortal.toLowerCase() === "magicbricks" ? (
                          <img src="/assets/img/icons/magicbrick.png" alt="propdial" />
                        ) : doc.advPortal.toLowerCase() === "99acre" ? (
                          <img src="/assets/img/icons/acres.jpeg" alt="propdial" />
                        ) : doc.advPortal.toLowerCase() === "housing" ? (
                          <img src="/assets/img/icons/housing.png" alt="propdial" />
                        ) : doc.advPortal.toLowerCase() === "commonfloor" ? (
                          <img src="/assets/img/icons/commonfloor.png" alt="propdial" />
                        ) : null}
                      </div>
                      <div className="right">
                      <h5 className="title">{doc.advPortal} </h5>
                            <h6 className="sub_title">
                              Portal ID:- {doc.portalPropId}
                            </h6>
                        <Link
                          className="click_text"
                          to={doc.advLink}
                          target="_blank"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            wordBreak: "break-all",
                          }}
                        >
                          {doc.advLink}
                        </Link>
                      </div>
                    </div>
                    <h4 className="top_right_content">
                      <span>
                        {format(doc.createdAt.toDate(), "dd-MMM-yy hh:mm a")}
                      </span>
                    </h4>

                    <Modal
                      show={showConfirmModal}
                      onHide={handleConfirmClose}
                      className="delete_modal"
                      centered
                    >
                      <div className="alert_text text-center">Alert</div>

                      <div className="sure_content text-center">
                        Are you sure you want to remove this advertisement?
                      </div>
                      <div className="yes_no_btn">
                        <div
                          className="theme_btn full_width no_icon text-center btn_border"
                          onClick={confirmDeleteDocument} // Confirm and delete
                        >
                          Yes
                        </div>
                        <div
                          className="theme_btn full_width no_icon text-center btn_fill"
                          onClick={handleConfirmClose} // Close modal without deleting
                        >
                          No
                        </div>
                      </div>
                    </Modal>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </>
  );
};

export default PropertyAds;
