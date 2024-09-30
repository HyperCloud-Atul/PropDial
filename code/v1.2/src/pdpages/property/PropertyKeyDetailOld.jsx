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
  const [keyNumber, setKeyNumber] = useState("");
  const [numberOfKey, setNumberOfKey] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [checkedStates, setCheckedStates] = useState({});
  const [documentFiles, setDocumentFiles] = useState([]); // Store selected files
const [imageUrls, setImageUrls] = useState([]); // Store URLs of uploaded images

  const [newDocId, setNewDocId] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [uploadingDocId, setUploadingDocId] = useState(null); // Track uploading document ID

  // all functions
  const handleShowAIForm = () => setShowAIForm(!showAIForm);
  const handleKeyNumberChange = (event) => setKeyNumber(event.target.value);
  const handleNumberOfKeyChange = (event) => setNumberOfKey(event.target.value);
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + documentFiles.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }
    setDocumentFiles((prevFiles) => [...prevFiles, ...files]);
  };
  

  const getFileType = (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    return fileExtension === "pdf" ? "pdf" : "image";
  };

  const addPropertyKey = async () => {
    if (keyNumber === "" || numberOfKey === "") {
      alert("All fields are required!");
      return;
    }
  
    try {
      setIsUploading(true);
      const docRef = await addDocument({
        keyNumber,
        numberOfKey,
        propertyId,
        pid: propertydoc.pid,
        postedBy: "Propdial",
      });
      setKeyNumber("");
      setNumberOfKey("");
      
      // Start uploading all images
      await Promise.all(documentFiles.map(file => uploadDocumentImage(docRef.id, file)));
      
      setDocumentFiles([]); // Clear the files after uploading
      setIsUploading(false);
    } catch (error) {
      console.error("Error adding document:", error);
      setIsUploading(false);
    }
  };
  

  

  useEffect(() => {
    if (newDocId && documentFile) {
      uploadDocumentImage();
    }
  }, [newDocId, documentFile]);
  const uploadDocumentImage = async (newDocId, file) => {
    try {
      const fileType = getFileType(file);
      const storageRef = projectStorage.ref(`docs/${newDocId}/${file.name}`);
      await storageRef.put(file);
      const fileURL = await storageRef.getDownloadURL();
      setImageUrls(prevUrls => [...prevUrls, fileURL]); // Store uploaded image URLs
      await updateDocument(newDocId, {
        keyImageUrl: fileURL,
        mediaType: fileType,
      });
    } catch (error) {
      console.error("Error uploading document image:", error);
    }
  };
  const handleDeleteImage = (index) => {
    setImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
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
                  Add New Key
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
              <div className="aai_form">
                <div className="row" style={{ rowGap: "18px" }}>
                  <div className="col-md-3">
                    <div className="add_info_text w-100">
                      <div className="form_field w-100">
                        <input
                          type="text"
                          value={keyNumber}
                          onChange={handleKeyNumberChange}
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
                          value={numberOfKey}
                          onChange={handleNumberOfKeyChange}
                          placeholder="Number of key"
                          className="w-100"
                        />
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
            <hr />
            <div className="vg22"></div>
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
        <div className="my_small_card_parent">
          {propertyKeyDoc &&
            propertyKeyDoc.map((doc, index) => (
              <div
                className="my_small_card notification_card relative"
                key={index}
              >
                             <input
  type="file"
  multiple
  onChange={handleFileChange}
  ref={fileInputRef}
/>

                <div className="uploaded-images">
  {imageUrls.map((url, index) => (
    <div key={index} className="uploaded-image">
      <img src={url} alt={`Uploaded Preview ${index + 1}`} />
      <button onClick={() => handleDeleteImage(index)}>Delete</button>
    </div>
  ))}
</div>
                <div className="left">
   

                  <div className="right">
                    <div className="right_inner">
                      <div className="ri_single">
                        <h5 className="title">{doc.keyNumber}</h5>
                        <h6 className="sub_title text-capitalize">
                          Key Number
                        </h6>
                      </div>
                      <div className="ri_single">
                        <h5 className="title">{doc.numberOfKey}</h5>
                        <h6 className="sub_title text-capitalize">
                          Number Of Key
                        </h6>
                      </div>
                      <div className="ri_single">
                        <h5 className="title">
                          {" "}
                          {format(doc.createdAt.toDate(), "dd-MMM-yy hh:mm a")}
                        </h5>
                        <h6 className="sub_title text-capitalize">Added At</h6>
                      </div>
                      <div className="ri_single">
                        <h5 className="title text-capitalize">
                          Sanskar Solanki
                        </h5>
                        <h6 className="sub_title text-capitalize">Added By</h6>
                      </div>
                    </div>
                  </div>
                </div>
                {user && user.role === "admin" && (
                  <>
                    <div
                      onClick={() => handleDeleteClick(doc.id)} // Set the document to delete
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
                        Are you sure you want to remove this utility bill?
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
