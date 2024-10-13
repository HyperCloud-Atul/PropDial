import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { projectStorage } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import { BeatLoader } from "react-spinners";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import ScrollToTop from "../../components/ScrollToTop";
import { Modal } from "react-bootstrap"; // Ensure you have imported Modal
import { format } from "date-fns";

const PropertyKeyDetail = () => {
  const { user } = useAuthContext();
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { addDocument, updateDocument, deleteDocument, error } =
    useFirestore("propertyKeys");
  const { documents: propertyKeyDoc, errors: propertyKeyDocError } =
    useCollection("propertyKeys", ["propertyId", "==", propertyId]);
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties",
    propertyId
  );

  // all usestates
  const [showAIForm, setShowAIForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const handleShowAIForm = () => setShowAIForm(!showAIForm);
  // all functions

  const [keyRows, setKeyRows] = useState([
    { keyFor: "", keyNumber: "", numberOfKey: "", keyRemark: "" }, // Default one row
  ]);

  // Add more rows
  const handleAddKeyRow = () => {
    setKeyRows([
      ...keyRows,
      { keyFor: "", keyNumber: "", numberOfKey: "", keyRemark: "" },
    ]);
  };

  // Remove a row
  const handleRemoveKeyRow = (index) => {
    const newKeyRows = keyRows.filter(
      (_, keyRowIndex) => keyRowIndex !== index
    );
    setKeyRows(newKeyRows);
  };

  // Handle input change for dynamic rows
  const handleInputChange = (index, field, value) => {
    const newKeyRows = [...keyRows];
    newKeyRows[index][field] = value;
    setKeyRows(newKeyRows);
  };

  const addPropertyKey = async () => {
    if (
      keyRows.some((row) => !row.keyFor || !row.keyNumber || !row.numberOfKey)
    ) {
      alert("All fields are required for each row!");
      return;
    }

    try {
      setIsUploading(true);
      // Save the rows (array of maps) to Firestore
      const docRef = await addDocument({
        propertyId,
        pid: propertydoc.pid,
        postedBy: "Propdial",
        keys: keyRows, // Save rows as an array of maps
      });
      setKeyRows([
        { keyFor: "", keyNumber: "", numberOfKey: "", keyRemark: "" },
      ]); // Reset after save
      setIsUploading(false);
      setShowAIForm(!showAIForm);
    } catch (error) {
      console.error("Error adding document:", error);
      setIsUploading(false);
      setShowAIForm(!showAIForm);
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

  // Convert digit into comma formate start
  function formatNumberWithCommas(number) {
    // Convert number to a string if it's not already
    let numStr = number.toString();

    // Handle decimal part if present
    const [integerPart, decimalPart] = numStr.split(".");

    // Regular expression for Indian comma format
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);

    const formattedNumber =
      otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherDigits ? "," : "") +
      lastThreeDigits;

    // Return the formatted number with decimal part if it exists
    return decimalPart ? `${formattedNumber}.${decimalPart}` : formattedNumber;
  }

  return (
    <div className="top_header_pg pg_bg property_keys_pg">
      <ScrollToTop />
      <div className="page_spacing pg_min_height">
        <div className="row row_reverse_991">
          <div className="col-lg-6">
            <div className="title_card mobile_full_575 mobile_gap h-100">
              <h2 className="text-center mb-4">OnePlace for Property Keys</h2>
              {/* <h6 className="text-center mt-1 mb-2">Your Central Hub for Viewing, Downloading, and Uploading Property Documents</h6> */}
              {!showAIForm && (
                <div
                  className="theme_btn btn_fill no_icon text-center short_btn"
                  onClick={handleShowAIForm}
                >
                  Add Keys
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
                        <span
                          className={`card_badge ${propertydoc.isActiveInactiveReview.toLowerCase()}`}
                        >
                          {propertydoc.isActiveInactiveReview}
                        </span>
                      </div>
                      <h6 className="demand">
                        <span>₹</span>
                        {propertydoc.flag.toLowerCase() === "pms only" ||
                        propertydoc.flag.toLowerCase() === "pms after rent" ||
                        propertydoc.flag.toLowerCase() ===
                          "available for rent" ||
                        propertydoc.flag.toLowerCase() === "rented out"
                          ? propertydoc.demandPriceRent &&
                            formatNumberWithCommas(propertydoc.demandPriceRent)
                          : propertydoc.flag.toLowerCase() ===
                              "rent and sale" ||
                            propertydoc.flag.toLowerCase() === "rented but sale"
                          ? propertydoc.demandPriceRent &&
                            formatNumberWithCommas(
                              propertydoc.demandPriceRent
                            ) +
                              " / ₹" +
                              propertydoc.demandPriceSale &&
                            formatNumberWithCommas(propertydoc.demandPriceSale)
                          : propertydoc.demandPriceSale &&
                            formatNumberWithCommas(propertydoc.demandPriceSale)}

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
                          <span>₹</span>
                          {propertydoc.flag.toLowerCase() === "pms only" ||
                          propertydoc.flag.toLowerCase() === "pms after rent" ||
                          propertydoc.flag.toLowerCase() ===
                            "available for rent" ||
                          propertydoc.flag.toLowerCase() === "rented out"
                            ? propertydoc.demandPriceRent &&
                              formatNumberWithCommas(
                                propertydoc.demandPriceRent
                              )
                            : propertydoc.flag.toLowerCase() ===
                                "rent and sale" ||
                              propertydoc.flag.toLowerCase() ===
                                "rented but sale"
                            ? propertydoc.demandPriceRent &&
                              formatNumberWithCommas(
                                propertydoc.demandPriceRent
                              ) +
                                " / ₹" +
                                propertydoc.demandPriceSale &&
                              formatNumberWithCommas(
                                propertydoc.demandPriceSale
                              )
                            : propertydoc.demandPriceSale &&
                              formatNumberWithCommas(
                                propertydoc.demandPriceSale
                              )}

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
              <div className="aai_form">
                {keyRows.map((row, index) => (
                  <div className="row fields_box" key={index}>
                    <div className="col-md-3">
                      <div className="add_info_text w-100">
                        <div className="form_field w-100">
                          <input
                            type="text"
                            value={row.keyFor}
                            onChange={(e) =>
                              handleInputChange(index, "keyFor", e.target.value)
                            }
                            placeholder="For (e.g. Main Door, Bedroom, Almiras ... )"
                            className="w-100"
                          />
                        </div>{" "}
                      </div>{" "}
                    </div>
                    <div className="col-md-3">
                      <div className="add_info_text w-100">
                        <div className="form_field w-100">
                          <input
                            type="text"
                            value={row.keyNumber}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "keyNumber",
                                e.target.value
                              )
                            }
                            placeholder="Key number"
                            className="w-100"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="add_info_text w-100">
                        <div className="form_field w-100">
                          <input
                            type="number"
                            value={row.numberOfKey}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "numberOfKey",
                                e.target.value
                              )
                            }
                            placeholder="Number of keys"
                            className="w-100"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="add_info_text w-100">
                        <div className="form_field w-100">
                          <input
                            type="text"
                            value={row.keyRemark}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "keyRemark",
                                e.target.value
                              )
                            }
                            placeholder="Remark"
                            className="w-100"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      {index !== 0 && (
                        <span
                          className="pointer close_field"
                          onClick={() => handleRemoveKeyRow(index)}
                        >
                          X
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                <div
                  className="addmore mt-2"
                  onClick={handleAddKeyRow}
                  style={{
                    marginLeft: "auto",
                  }}
                >
                  Add More
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
                    onClick={isUploading ? null : addPropertyKey}
                  >
                    {isUploading ? "Uploading..." : "Save"}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
        {propertyKeyDoc && propertyKeyDoc.length !== 0 && (
          <>
            <div className="vg22"></div>
            {/* <hr />
            <div className="vg22"></div> */}
          </>
        )}
        {propertyKeyDoc && propertyKeyDoc.length === 0 && (
          <div
            className="pg_msg"
            style={{
              height: "calc(55vh)",
            }}
          >
            <div>No Property Key Yet!</div>
          </div>
        )}
        <div className="keys_card">
          {propertyKeyDoc &&
            propertyKeyDoc.map((doc, index) => (
              <div className="key_card_single relative" key={index}>
                <div className="top">
                  By <b>Sanskar Solanki</b>, On{" "}
                  <b>{format(doc.createdAt.toDate(), "dd-MMM-yy hh:mm a")}</b>
                </div>
                <div className="key_details">
                  {Array.isArray(doc.keys) &&
                    doc.keys.map((keySingle, keyindex) => (
                      <div className="kd_single relative" key={keyindex}>
                        <div className="left">
                          <h6>{keySingle.keyNumber}</h6>
                          <h6>{keySingle.keyFor}</h6>
                        </div>
                        <div className="right">
                          <h5>{keySingle.numberOfKey}</h5>
                        </div>
                        {keySingle.keyRemark && (
                          <div className="remark_info">
                            <div className="info_icon">
                              <span class="material-symbols-outlined">
                                info
                              </span>
                              <div className="key_remark">
                                {keySingle.keyRemark}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                {user && user.role === "admin" && (
                  <>
                    <div
                      onClick={() => handleDeleteClick(doc.id)}
                      className="text_red pointer delete_box_top"
                    >
                      <span class="material-symbols-outlined">
                        delete_forever
                      </span>
                    </div>
                    <Modal
                      show={showConfirmModal}
                      onHide={handleConfirmClose}
                      className="delete_modal"
                      centered
                    >
                      <div className="alert_text text-center">Alert</div>

                      <div className="sure_content text-center">
                        Are you sure you want to remove this keys?
                      </div>
                      <div className="yes_no_btn">
                        <div
                          className="theme_btn full_width no_icon text-center btn_border"
                          onClick={confirmDeleteDocument} 
                        >
                          Yes
                        </div>
                        <div
                          className="theme_btn full_width no_icon text-center btn_fill"
                          onClick={handleConfirmClose} 
                        >
                          No
                        </div>
                      </div>
                    </Modal>
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyKeyDetail;
