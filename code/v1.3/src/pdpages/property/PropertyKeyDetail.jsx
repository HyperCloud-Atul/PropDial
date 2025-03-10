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
import PropertySummaryCard from "./PropertySummaryCard";
import InactiveUserCard from "../../components/InactiveUserCard";

const PropertyKeyDetail = () => {
  const { user } = useAuthContext();
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { addDocument, updateDocument, deleteDocument, error } =
    useFirestore("propertyKeys");
  const { documents: propertyKeyDoc, errors: propertyKeyDocError } =
    useCollection(
      "propertyKeys",
      ["propertyId", "==", propertyId],
      ["createdAt", "desc"]
    );
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties-propdial",
    propertyId
  );

  // all usestates
  const [showAIForm, setShowAIForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // For tracking which row is being edited
  const [isEditing, setIsEditing] = useState(false); // Track if in edit mode
  const [docToDelete, setDocToDelete] = useState(null);
  const handleShowAIForm = () => {
    setDocToEdit(null); // Reset docToEdit to ensure form is for adding new key
    setKeyRows([{ keyFor: "", keyNumber: "", numberOfKey: "", keyRemark: "" }]); // Reset the form fields
    setShowAIForm(!showAIForm);
  };
  const [docToEdit, setDocToEdit] = useState(null); // New state for editing
  // all functions

  // State for key rows
  const [keyRows, setKeyRows] = useState([
    { keyFor: "", keyNumber: "", numberOfKey: "", keyRemark: "" },
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

  // Add or edit property keys
  const addOrUpdatePropertyKey = async () => {
    if (
      keyRows.some((row) => !row.keyFor || !row.numberOfKey)
    ) {
      alert("All fields are required for each row!");
      return;
    }

    try {
      setIsUploading(true);

      if (docToEdit) {
        // Update document
        await updateDocument(docToEdit.id, {
          propertyId,
          pid: propertydoc.pid,
          postedBy: "Propdial",
          keys: keyRows,
        });
      } else {
        // Add new document
        await addDocument({
          propertyId,
          pid: propertydoc.pid,
          postedBy: "Propdial",
          keys: keyRows,
        });
      }

      setKeyRows([
        { keyFor: "", keyNumber: "", numberOfKey: "", keyRemark: "" },
      ]); // Reset after save
      setIsUploading(false);
      setDocToEdit(null); // Reset docToEdit after editing
      setShowAIForm(!showAIForm);
    } catch (error) {
      console.error("Error adding or updating document:", error);
      setIsUploading(false);
      setShowAIForm(!showAIForm);
    }
  };

  // Handle edit click
  const handleEditClick = (doc) => {
    setDocToEdit(doc); // Set the document to be edited
    setKeyRows(doc.keys); // Populate form with existing values
    setShowAIForm(true); // Show the form
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

  return (
    <>
      {user && user.status === "active" ? (
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
              <PropertySummaryCard
                propertydoc={propertydoc}
                propertyId={propertyId}
              />
            </div>
            {showAIForm && (
              <>
                <div className="vg22"></div>
                <section className="my_big_card add_doc_form mobile_full_575">
                  <div className="aai_form">
                    {keyRows.map((row, index) => (
                      <div className="row fields_box" key={index}>
                        <div className="col-lg-3 col-md-6 col-12">
                          <div className="form_field w-100">
                            <input
                              type="text"
                              value={row.keyFor}
                              onChange={(e) =>
                                handleInputChange(index, "keyFor", e.target.value)
                              }
                              placeholder="For (e.g. Main Door, Bedroom, Almiras ..."
                              className="w-100"
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-6">
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
                        <div className="col-lg-3 col-md-6 col-6">
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
                        <div className="col-lg-3 col-md-6 col-12">
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

                        {index !== 0 && (
                          <span
                            className="pointer close_field"
                            onClick={() => handleRemoveKeyRow(index)}
                          >
                            X
                          </span>
                        )}
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
                        onClick={() => {
                          setDocToEdit(null); // Reset docToEdit when cancelling
                          handleShowAIForm();
                        }}
                      >
                        Cancel
                      </div>
                    </div>
                    <div className="col-sm-3 col-6">
                      <div
                        className={`theme_btn btn_fill text-center no_icon ${isUploading ? "disabled" : ""
                          }`}
                        onClick={isUploading ? null : addOrUpdatePropertyKey}
                      >
                        {isUploading ? "Saving..." : docToEdit ? "Update" : "Save"}
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
                    <div className="top relative">
                      By <b>Sanskar Solanki</b>, On{" "}
                      <b>{format(doc.createdAt.toDate(), "dd-MMM-yy hh:mm a")}</b>
                      {user && user.role === "superAdmin" && (
                        <span
                          className="material-symbols-outlined keys_edit"
                          onClick={() => handleEditClick(doc)}
                        >
                          edit_square
                        </span>
                      )}
                    </div>
                    <div className="key_details">
                      {Array.isArray(doc.keys) &&
                        doc.keys.map((keySingle, keyindex) => (
                          <div className="kd_single relative" key={keyindex}>
                            <div className="left">
                              <h6>{keySingle.keyFor}</h6>
                              <h6>{keySingle.keyNumber ? keySingle.keyNumber : "No key number"}</h6>

                            </div>
                            <div className="right">
                              <h5>{keySingle.numberOfKey}</h5>
                            </div>
                            {keySingle.keyRemark && (
                              <div className="remark_info">
                                <div className="info_icon">
                                  <span className="material-symbols-outlined">
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
                    {user && user.role === "superAdmin" && (
                      <>

                        <div
                          onClick={() => handleDeleteClick(doc.id)}
                          className="text_red pointer delete_box_top"
                        >
                          <span className="material-symbols-outlined">
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
      ) : (
        <InactiveUserCard />
      )}
    </>

  );
};

export default PropertyKeyDetail;
