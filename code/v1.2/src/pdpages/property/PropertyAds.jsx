import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { Modal } from "react-bootstrap"; // Ensure you have imported Modal
import { format } from "date-fns";
const PropertyAds = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  // get id from url
  const { propertyId } = useParams();
  // get property document
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties",
    propertyId
  );

  // add document
  const { addDocument, updateDocument, deleteDocument, error } =
    useFirestore("advertisements");

  // get adv document
  const { documents: advDoc, errors: advDocError } = useCollection(
    "advertisements",
    ["propertyId", "==", propertyId]
  );

  // all use states
  const [showAIForm, setShowAIForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAdvPortal, setSelectedAdvPortal] = useState("");
  const [advLink, setAdvLink] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  // functions
  const handleShowAIForm = () => setShowAIForm(!showAIForm);
  const handleAdvPortalChange = (event) =>
    setSelectedAdvPortal(event.target.value);
  const handleAdvLinkChange = (event) => setAdvLink(event.target.value);
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
    if ("") {
      alert("All fields are required!");
      return;
    }

    try {
      setIsUploading(true);
      const docRef = await addDocument({
        advLink,
        portal: selectedAdvPortal,
        pid: propertydoc.pid,
        propertyType: propertydoc.purpose,
        propertyId,
      });

      setSelectedAdvPortal("");
      setAdvLink("");
      setIsUploading(false);
      setShowAIForm(!showAIForm);
      // setNewDocId(docRef.id);
    } catch (error) {
      console.error("Error adding document:", error);
      setSelectedAdvPortal("");
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

  // expand more expand less start
  const [expanded, setExpanded] = useState(true);

  const handleExpand = () => {
    setExpanded(!expanded);
  };
  // sexpand more expand less end

  // prop summary click start
  const handleClick = (e) => {
    if (window.innerWidth > 575) {
      navigate(`/propertydetails/${propertyId}`);
    } else {
      e.preventDefault();
    }
  };
  // prop summary click start

  console.log("advDoc", advDoc);

  return (
    <div className="top_header_pg pg_bg property_docs_pg">
      <div className="page_spacing">
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
          <div className="col-lg-6">
            {propertydoc && (
              <div
                className="title_card short_prop_summary relative pointer"
                onClick={handleClick}
              >
                {expanded && (
                  <div className="top on_mobile_575">
                    <div
                      className="d-flex align-items-center"
                      style={{
                        gap: "5px",
                      }}
                    >
                      <h6
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                        }}
                      >
                        {propertydoc.unitNumber} | {propertydoc.society}{" "}
                      </h6>
                    </div>
                  </div>
                )}
                <div className="on_desktop_hide_575">
                  <div className="left">
                    <div className="img">
                      {propertydoc.images.length > 0 ? (
                        <img
                          src={propertydoc.images[0]}
                          alt={propertydoc.bhk}
                        />
                      ) : (
                        <img src="/assets/img/admin_banner.jpg" alt="" />
                      )}
                    </div>
                    <div className="detail">
                      <div>
                        <span className="card_badge">{propertydoc.pid}</span>{" "}
                        <span className="card_badge">
                          {propertydoc.isActiveInactiveReview}
                        </span>
                      </div>
                      <h6 className="demand">
                        <span>₹</span>
                        {propertydoc.demandPrice}
                        {propertydoc.maintenancecharges !== "" && (
                          <span
                            style={{
                              fontSize: "10px",
                            }}
                          >
                            + ₹{propertydoc.maintenancecharges} (
                            {propertydoc.maintenancechargesfrequency})
                          </span>
                        )}
                      </h6>
                      <h6>
                        {propertydoc.unitNumber} | {propertydoc.society}{" "}
                      </h6>
                      <h6>
                        {propertydoc.bhk} | {propertydoc.propertyType}{" "}
                        {propertydoc.furnishing === ""
                          ? ""
                          : " | " + propertydoc.furnishing + "Furnished"}{" "}
                      </h6>
                      <h6>
                        {propertydoc.locality}, {propertydoc.city} |{" "}
                        {propertydoc.state}
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="on_mobile_575">
                  {!expanded && (
                    <div className="left">
                      <div className="img w-100 d-flex align-items-center">
                        {propertydoc.images.length > 0 ? (
                          <img
                            src={propertydoc.images[0]}
                            alt={propertydoc.bhk}
                          />
                        ) : (
                          <img src="/assets/img/admin_banner.jpg" alt="" />
                        )}
                        <Link
                          to={`/propertydetails/${propertyId}`}
                          className="text_green text-center"
                          style={{
                            flexGrow: "1",
                          }}
                        >
                          View Detail
                        </Link>
                      </div>
                      <div className="detail">
                        <div>
                          <span className="card_badge">{propertydoc.pid}</span>{" "}
                          <span className="card_badge">
                            {propertydoc.isActiveInactiveReview}
                          </span>
                        </div>
                        <h6 className="demand">
                          <span>₹</span> {propertydoc.demandPrice}
                          {propertydoc.maintenancecharges !== "" && (
                            <span
                              style={{
                                fontSize: "10px",
                              }}
                            >
                              + ₹{propertydoc.maintenancecharges} (
                              {propertydoc.maintenancechargesfrequency})
                            </span>
                          )}
                        </h6>
                        <h6>
                          {propertydoc.unitNumber} | {propertydoc.society}{" "}
                        </h6>
                        <h6>
                          {propertydoc.bhk} | {propertydoc.propertyType}{" "}
                          {propertydoc.furnishing === ""
                            ? ""
                            : " | " + propertydoc.furnishing + "Furnished"}{" "}
                        </h6>
                        <h6>
                          {propertydoc.locality}, {propertydoc.city} |{" "}
                          {propertydoc.state}
                        </h6>
                      </div>
                    </div>
                  )}
                </div>

                <div className="expand on_mobile_575" onClick={handleExpand}>
                  <span className="material-symbols-outlined">
                    {expanded ? "keyboard_arrow_down" : "keyboard_arrow_up"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        {showAIForm && (
          <>
            <div className="vg22"></div>
            <section className="my_big_card add_doc_form">
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
                  <div className="col-md-2">
                    <div className="add_info_text">
                      <div className="form_field">
                        <div className="relative">
                          <input type="text" value={propertydoc.pid} readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="add_info_text">
                      <div className="form_field">
                        <div className="relative">
                          <input
                            type="text"
                            value={propertydoc.purpose}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="add_info_text">
                      <div className="form_field">
                        <div className="relative">
                          <input
                            type="text"
                            value={advLink}
                            onChange={handleAdvLinkChange}
                            placeholder="Link"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-sm-2 col-6">
                  <div
                    className="theme_btn btn_border text-center no_icon"
                    onClick={isUploading ? null : handleShowAIForm}
                  >
                    Cancel
                  </div>
                </div>
                <div className="col-sm-3 col-6">
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
            <hr />
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
                    {doc.portal.toLowerCase() === "magicbricks" ? (
                      <img src="/assets/img/icons/magicbrick.png" alt="" />
                    ) : doc.portal.toLowerCase() === "99acre" ? (
                      <img src="/assets/img/icons/acres.jpeg" alt="" />
                    ) : doc.portal.toLowerCase() === "housing" ? (
                      <img src="/assets/img/icons/housing.png" alt="" />
                    ) : doc.portal.toLowerCase() === "commonfloor" ? (
                      <img src="/assets/img/icons/commonfloor.png" alt="" />
                    ) : null}
                  </div>
                  <div className="right">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="title">{doc.portal}</h5>
                      <h6 className="sub_title">
                        {doc.pid}, {doc.propertyType}
                      </h6>
                    </div>
                    <div
                      onClick={() => handleDeleteClick(doc.id)} // Set the document to delete
                      className="text_red pointer"
                      style={{
                        fontSize: "12px",                     
                      }}
                    >
                      Remove
                    </div></div>
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
  );
};

export default PropertyAds;
