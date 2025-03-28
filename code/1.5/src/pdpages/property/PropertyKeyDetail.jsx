import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { projectStorage } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import { FaPlus, FaTrash, FaRetweet } from "react-icons/fa";
import { BeatLoader, BarLoader, ClipLoader } from "react-spinners";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import ScrollToTop from "../../components/ScrollToTop";
import { Modal } from "react-bootstrap"; // Ensure you have imported Modal
import { format } from "date-fns";
import PropertySummaryCard from "./PropertySummaryCard";
import InactiveUserCard from "../../components/InactiveUserCard";
import imageCompression from "browser-image-compression";

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

  const { documents: dbUsers, error: dbuserserror } = useCollection(
    "users-propdial",
    ["status", "==", "active"]
  );
  const [dbUserState, setdbUserState] = useState(dbUsers);
  useEffect(() => {
    setdbUserState(dbUsers);
  });

  // all usestates
  const [showAIForm, setShowAIForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageActionStatus, setImageActionStatus] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // For tracking which row is being edited
  const [isEditing, setIsEditing] = useState(false); // Track if in edit mode
  const [docToDelete, setDocToDelete] = useState(null);
  const handleShowAIForm = () => {
    setDocToEdit(null); // Reset docToEdit to ensure form is for adding new key
    setKeyRows([
      {
        keyFor: "",
        keyNumber: "",
        numberOfKey: "",
        keyRemark: "",
        imageUrl: "",
      },
    ]); // Reset the form fields
    setShowAIForm(!showAIForm);
  };
  const [docToEdit, setDocToEdit] = useState(null); // New state for editing
  // all functions

  // State for key rows
  const [keyRows, setKeyRows] = useState([
    { keyFor: "", keyNumber: "", numberOfKey: "", keyRemark: "", imageUrl: "" },
  ]);

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageActionStatus("uploading");
    try {
      // Compress the image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1, // Maximum file size in MB
        maxWidthOrHeight: 1024, // Resize image if required
        useWebWorker: true, // Use web worker for better performance
      });

      // Generate file path
      const filePath = `propertyKeys/${keyRows[index].keyNumber}-${Date.now()}`;
      const storageRef = projectStorage.ref(filePath);
      const uploadTask = storageRef.put(compressedFile);

      uploadTask.on(
        "state_changed",
        null,
        (error) => console.error("Upload error:", error),
        async () => {
          try {
            // Get download URL once upload is complete
            const url = await storageRef.getDownloadURL();
            const updatedRows = [...keyRows];
            updatedRows[index].imageUrl = url;
            setKeyRows(updatedRows);
            setImageActionStatus(null);
          } catch (error) {
            console.error("Error getting download URL:", error);
          }
        }
      );
    } catch (error) {
      console.error("Image compression error:", error);
      setImageActionStatus(null); // Hide modal on error
    }
  };

  // Handle image delete
  const handleImageDelete = async (index) => {
    const imageUrl = keyRows[index].imageUrl;
    if (!imageUrl) return;
    setImageActionStatus("deleting");

    try {
      const filePath = decodeURIComponent(
        imageUrl.split("/").slice(-1)[0].split("?")[0]
      );
      const storageRef = projectStorage.ref(filePath);
      await storageRef.delete();

      const updatedRows = [...keyRows];
      updatedRows[index].imageUrl = "";
      setKeyRows(updatedRows);
      setImageActionStatus(null);
    } catch (error) {
      console.error("Error deleting image:", error);
      setImageActionStatus(null);
    }
  };

  // Add more rows
  const handleAddKeyRow = () => {
    setKeyRows([
      ...keyRows,
      {
        keyFor: "",
        keyNumber: "",
        numberOfKey: "",
        keyRemark: "",
        imageUrl: "",
      },
    ]);
  };

  // Remove a row
  const handleRemoveKeyRow = (index) => {
    const updatedRows = keyRows.filter((_, i) => i !== index);
    setKeyRows(updatedRows);
  };

  // Handle input change for dynamic rows
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...keyRows];
    updatedRows[index][field] = value;
    setKeyRows(updatedRows);
  };

  // Add or edit property keys
  const addOrUpdatePropertyKey = async () => {
    if (keyRows.some((row) => !row.keyFor || !row.numberOfKey)) {
      alert(
        "Key name, key number and number of key are required for each row!"
      );
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
        {
          keyFor: "",
          keyNumber: "",
          numberOfKey: "",
          keyRemark: "",
          imageUrl: "",
        },
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

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);

  const openModal = (keyDetails) => {
    setSelectedKey(keyDetails);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedKey(null);
    setModalIsOpen(false);
  };
  return (
    <>
      {user && user.status === "active" ? (
        <div className="top_header_pg pg_bg property_keys_pg">
          <ScrollToTop />
          {propertyKeyDoc ? (
            <div className="page_spacing pg_min_height">
              <div className="row row_reverse_991">
                <div className="col-lg-6">
                  <div className="title_card mobile_full_575 mobile_gap h-100">
                    <h2 className="text-center mb-4">
                      OnePlace for Property Keys
                    </h2>
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
                        <div
                          className="row fields_box align-items-center"
                          key={index}
                        >
                          <div className="col-lg-9 p-0">
                            <div className="row fields_box">
                              <div className="col-md-6 col-12">
                                <div className="form_field w-100">
                                  <input
                                    type="text"
                                    value={row.keyFor}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "keyFor",
                                        e.target.value
                                      )
                                    }
                                    placeholder="For* (e.g. Main Door, Bedroom, Almiras ..."
                                    className="w-100"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-6">
                                <div className="form_field w-100">
                                  <input
                                    type="text"
                                    value={row.keyNumber}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value.length <= 8) {
                                        // Restrict to max 8 characters
                                        handleInputChange(
                                          index,
                                          "keyNumber",
                                          value
                                        );
                                      }
                                    }}
                                    placeholder="Key number*"
                                    className="w-100"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-6">
                                <div className="form_field w-100">
                                  <input
                                    type="number"
                                    value={row.numberOfKey}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value.length <= 1) {
                                        // Restrict to max 2 digits
                                        handleInputChange(
                                          index,
                                          "numberOfKey",
                                          value
                                        );
                                      }
                                    }}
                                    placeholder="Number of keys*"
                                    className="w-100"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-12">
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
                          </div>
                          <div className="col-lg-3">
                            <div className="image_upload_container">
                              {row.imageUrl ? (
                                <div className="image_preview">
                                  <div className="image_container">
                                    <img src={row.imageUrl} alt="Key Preview" />
                                    <div className="trash_icon">
                                      <FaTrash
                                        size={14}
                                        color="red"
                                        onClick={() => handleImageDelete(index)}
                                      />
                                    </div>
                                  </div>
                                  <label className="upload_icon">
                                    <div>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment" 
                                        onChange={(e) =>
                                          handleImageUpload(e, index)
                                        }
                                        style={{ display: "none" }}
                                      />
                                      <FaRetweet size={24} color="#555" />
                                      <h6>Replace Image</h6>
                                    </div>
                                  </label>
                                </div>
                              ) : (
                                <label className="upload_icon">
                                  <div>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleImageUpload(e, index)
                                      }
                                      style={{ display: "none" }}
                                    />
                                    <FaPlus size={24} color="#555" />
                                    <h6>Add Image</h6>
                                  </div>
                                </label>
                              )}
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
                        Add More Key
                      </div>
                    </div>

                    <div className="row mt-4">
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
                          className={`theme_btn btn_fill text-center no_icon ${
                            isUploading ? "disabled" : ""
                          }`}
                          onClick={isUploading ? null : addOrUpdatePropertyKey}
                        >
                          {isUploading
                            ? "Saving..."
                            : docToEdit
                            ? "Update"
                            : "Save"}
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
                        By{" "}
                        <b>
                          {dbUserState &&
                            dbUserState.find(
                              (user) => user.id === doc.createdBy
                            )?.fullName}
                        </b>
                        , On{" "}
                        <b>
                          {format(doc.createdAt.toDate(), "dd-MMM-yy hh:mm a")}
                        </b>
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
                            <div
                              className="kd_single relative pointer"
                              key={keyindex}
                              onClick={() => openModal(keySingle)}
                            >
                              <div className="left">
                                <h5 className="text-capitalize">
                                  {keySingle.keyFor}
                                </h5>
                                <h6>
                                  Key Num:{" "}
                                  {keySingle.keyNumber
                                    ? keySingle.keyNumber
                                    : "No key number"}
                                </h6>
                              </div>
                              <div className="right">
                                <h5>{keySingle.numberOfKey}</h5>
                              </div>
                              {/* {keySingle.keyRemark && (
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
                            )} */}

                              <div className="remark_info">
                                <div className="info_icon">
                                  <span className="material-symbols-outlined">
                                    info
                                  </span>
                                </div>
                              </div>
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
              {/* image upload modal  */}
              <Modal
                show={imageActionStatus !== null}
                centered
                className="uploading_modal"
              >
                <h6
                  style={{
                    color:
                      imageActionStatus === "uploading"
                        ? "var(--theme-green2)"
                        : imageActionStatus === "deleting"
                        ? "var(--theme-red)"
                        : "var(--theme-blue)", // Default fallback color
                  }}
                >
                  {imageActionStatus === "uploading"
                    ? "Uploading..."
                    : "Deleting..."}
                </h6>

                <BarLoader
                  color={
                    imageActionStatus === "uploading"
                      ? "var(--theme-green2)"
                      : imageActionStatus === "deleting"
                      ? "var(--theme-red)"
                      : "var(--theme-blue)" // Default fallback color
                  }
                  loading={true}
                  height={10}
                />
              </Modal>
              {selectedKey && (
                <Modal
                  show={modalIsOpen}
                  onHide={closeModal}
                  className="margin_top detail_modal"
                  centered
                >
                  <span
                    className="material-symbols-outlined modal_close"
                    onClick={closeModal}
                  >
                    close
                  </span>
                  <h5 className="modal_title text-center">
                    {selectedKey.keyFor}
                  </h5>
                  <div className="modal_body">
                    <div className="img_area">
                      {selectedKey.imageUrl && (
                        <img
                          style={{
                            width: "100%",
                          }}
                          src={selectedKey.imageUrl}
                          alt={selectedKey.keyFor}
                        />
                      )}
                    </div>
                    <div className="main_detail">
                      <div className="md_single">
                        Key Number: {selectedKey.keyNumber}
                      </div>
                    </div>
                    <div className="more_detail">
                      <span
                        className="more_detail_single"
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                        }}
                      >
                        Total Key: {selectedKey.numberOfKey}
                      </span>
                    </div>
                  </div>
                  {selectedKey.keyRemark ? (
                    <div className="attached_with">
                      <h6 className="text-center text_black">Remark</h6>
                      <p
                        className="m-0 text-center"
                        style={{
                          fontSize: "15px",
                          color: "var(--theme-grey)",
                        }}
                      >
                        {selectedKey.keyRemark}
                      </p>
                    </div>
                  ) : (
                    <div className="attached_with">
                      <p
                        className="m-0 text-center"
                        style={{
                          fontSize: "15px",
                          color: "var(--theme-grey)",
                        }}
                      >
                        No Remark
                      </p>
                    </div>
                  )}
                </Modal>
              )}
            </div>
          ) : (
            <div className="page_loader">
              <ClipLoader color="var(--theme-green2)" loading={true} />
            </div>
          )}
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </>
  );
};

export default PropertyKeyDetail;
