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
    ["createdAt", "desc"]);


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
  const handleAdvPortalChange = (event) =>
    setSelectedAdvPortal(event.target.value);
  const handlePropertyTypeChange = (event) =>
    setSelectedPropertyType(event.target.value);
  const handleAdvLinkChange = (event) => setAdvLink(event.target.value);
  const handlePortalPropIdChange = (event) =>
    setPortalPropId(event.target.value);
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

  // add document code
  const addAdvertisements = async () => {
    if (
      !advLink ||
      !selectedAdvPortal ||
      !portalPropId ||
      !propertyType
    ) {
      alert("All fields are required!");
      return;
    }

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
                <div className="row" style={{ rowGap: "18px" }}>
                  <div className="col-12">
                    <div className="form_field">
                      <div className="field_box theme_radio_new tab_type_radio">
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
                              <label htmlFor={portal.id}>{portal.label}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="add_info_text w-100">
                      <div className="form_field w-100">
                        <div className="relative w-100">
                          <input
                            type="text"
                            value={portalPropId}
                            onChange={handlePortalPropIdChange}
                            placeholder="Property ID of portal"
                            className="w-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="form_field">
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
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="add_info_text w-100">
                      <div className="form_field w-100">
                        <div className="relative w-100">
                          <input
                            type="text"
                            value={advLink}
                            onChange={handleAdvLinkChange}
                            placeholder="Link (e.g. https://example.com/)"
                            className="w-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-2 col-6">
                  <div
                    className="theme_btn btn_border text-center no_icon"
                    onClick={isUploading ? null : handleShowAIForm}
                  >
                    Cancel
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div
                    className={`theme_btn btn_fill text-center no_icon ${isUploading ? "disabled" : ""
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
                <div className="left">
                  <div className="img_div">
                    {doc.advPortal.toLowerCase() === "magicbricks" ? (
                      <img src="/assets/img/icons/magicbrick.png" alt="" />
                    ) : doc.advPortal.toLowerCase() === "99acre" ? (
                      <img src="/assets/img/icons/acres.jpeg" alt="" />
                    ) : doc.advPortal.toLowerCase() === "housing" ? (
                      <img src="/assets/img/icons/housing.png" alt="" />
                    ) : doc.advPortal.toLowerCase() === "commonfloor" ? (
                      <img src="/assets/img/icons/commonfloor.png" alt="" />
                    ) : null}
                  </div>
                  <div className="right">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="title">{doc.advPortal}{" "}
                          <span className="sub_title">
                            (For {doc.propertyType})
                          </span>
                        </h5>
                        <h6 className="sub_title">
                          ID:- {doc.portalPropId}
                        </h6>
                      </div>
                      {user && user.role === "superAdmin" && (
                        <div
                          onClick={() => handleDeleteClick(doc.id)} // Set the document to delete
                          className="text_red pointer"
                          style={{
                            fontSize: "12px",
                          }}
                        >
                          Remove
                        </div>
                      )}
                    </div>
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
    ):(
      <InactiveUserCard/>
    )}
  </>
  
  );
};

export default PropertyAds;
