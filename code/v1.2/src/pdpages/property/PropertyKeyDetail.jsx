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
  const [newDocId, setNewDocId] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [uploadingDocId, setUploadingDocId] = useState(null); // Track uploading document ID

  // all functions
  const handleShowAIForm = () => setShowAIForm(!showAIForm);
  const handleKeyNumberChange = (event) => setKeyNumber(event.target.value);
  const handleNumberOfKeyChange = (event) => setNumberOfKey(event.target.value);
  const handleFileChange = (event, docId) => {
    const file = event.target.files[0];
    if (file) {
      setDocumentFile(file);
      setNewDocId(docId);
    }
  };

  const getFileType = (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    return fileExtension === "pdf" ? "pdf" : "image";
  };

  const addPropertyKey = async () => {
    if ("") {
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
      setIsUploading(false);
      setNewDocId(docRef.id);
    } catch (error) {
      console.error("Error adding document:", error);
      setKeyNumber("");
      setNumberOfKey("");
      setIsUploading(false);
      setShowAIForm(!showAIForm);
    }
  };

  useEffect(() => {
    if (newDocId && documentFile) {
      uploadDocumentImage();
    }
  }, [newDocId, documentFile]);

  const uploadDocumentImage = async () => {
    try {
      setIsUploading(true);
      setUploadingDocId(newDocId);
      const fileType = getFileType(documentFile);
      const storageRef = projectStorage.ref(
        `docs/${newDocId}/${documentFile.name}`
      );
      await storageRef.put(documentFile);
      const fileURL = await storageRef.getDownloadURL();
      await updateDocument(newDocId, {
        keyImageUrl: fileURL,
        mediaType: fileType,
      });
      setDocumentFile(null);
      setIsUploading(false);
      setUploadingDocId(null);
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading document image:", error);
      setIsUploading(false);
      setUploadingDocId(null);
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

// Use replace() to remove all commas
function removeCommas(stringWithCommas) {
  const stringWithoutCommas = stringWithCommas.replace(/,/g, '');
  return stringWithoutCommas;
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
                  Add New Key
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            {propertydoc &&
              <div className="title_card short_prop_summary relative pointer" onClick={handleClick}>
                {expanded && (
                  <div className="top on_mobile_575">
                    <div className="d-flex align-items-center" style={{
                      gap: "5px"
                    }} >
                      <h6 style={{
                        fontSize: "14px",
                        fontWeight: "400"
                      }}>{propertydoc.unitNumber} | {propertydoc.society} </h6>
                    </div>
                  </div>
                )}
                <div className="on_desktop_hide_575">
                  <div className="left">
                    <div className="img">
                      {propertydoc.images.length > 0 ? <img src={propertydoc.images[0]} alt={propertydoc.bhk} />
                        : <img src="/assets/img/admin_banner.jpg" alt="" />}
                    </div>
                    <div className="detail">
                      <div>
                        <span className="card_badge">
                          {propertydoc.pid}
                        </span>
                        {" "}{" "}
                        <span className={`card_badge ${propertydoc.isActiveInactiveReview.toLowerCase()}`}>
                          {propertydoc.isActiveInactiveReview}
                        </span>
                      </div>
                      <h6 className="demand">
                        <span>₹</span>
                        {(propertydoc.flag.toLowerCase() === "pms only" || propertydoc.flag.toLowerCase() === "pms after rent" || propertydoc.flag.toLowerCase() === "available for rent" || propertydoc.flag.toLowerCase() === "rented out") ? propertydoc.demandPriceRent && formatNumberWithCommas(propertydoc.demandPriceRent) : (propertydoc.flag.toLowerCase() === "rent and sale" || propertydoc.flag.toLowerCase() === "rented but sale") ? propertydoc.demandPriceRent && formatNumberWithCommas(propertydoc.demandPriceRent) + " / ₹" + propertydoc.demandPriceSale && formatNumberWithCommas(propertydoc.demandPriceSale) : propertydoc.demandPriceSale && formatNumberWithCommas(propertydoc.demandPriceSale)}

                        {propertydoc.maintenancecharges !== '' && <span
                          style={{
                            fontSize: "10px",
                          }}
                        >
                          + ₹{propertydoc.maintenancecharges} ({propertydoc.maintenancechargesfrequency})
                        </span>}
                      </h6>
                      <h6>{propertydoc.unitNumber} | {propertydoc.society} </h6>
                      <h6>{propertydoc.bhk} | {propertydoc.propertyType} {propertydoc.furnishing === "" ? "" : " | " + propertydoc.furnishing + "Furnished"}  </h6>
                      <h6>{propertydoc.locality}, {propertydoc.city} | {propertydoc.state}</h6>
                    </div>
                  </div>
                </div>
                <div className="on_mobile_575">
                  {!expanded && (
                    <div className="left">
                      <div className="img w-100 d-flex align-items-center">
                        {propertydoc.images.length > 0 ? <img src={propertydoc.images[0]} alt={propertydoc.bhk} />
                          : <img src="/assets/img/admin_banner.jpg" alt="" />}
                        <Link to={(`/propertydetails/${propertyId}`)} className='text_green text-center' style={{
                          flexGrow: "1"
                        }}>
                          View Detail
                        </Link>
                      </div>
                      <div className="detail">
                        <div>
                          <span className="card_badge">
                            {propertydoc.pid}
                          </span>
                          {" "}{" "}
                          <span className="card_badge">
                            {propertydoc.isActiveInactiveReview}
                          </span>
                        </div>
                        <h6 className="demand">
                        <span>₹</span>
                        {(propertydoc.flag.toLowerCase() === "pms only" || propertydoc.flag.toLowerCase() === "pms after rent" || propertydoc.flag.toLowerCase() === "available for rent" || propertydoc.flag.toLowerCase() === "rented out") ? propertydoc.demandPriceRent && formatNumberWithCommas(propertydoc.demandPriceRent) : (propertydoc.flag.toLowerCase() === "rent and sale" || propertydoc.flag.toLowerCase() === "rented but sale") ? propertydoc.demandPriceRent && formatNumberWithCommas(propertydoc.demandPriceRent) + " / ₹" + propertydoc.demandPriceSale && formatNumberWithCommas(propertydoc.demandPriceSale) : propertydoc.demandPriceSale && formatNumberWithCommas(propertydoc.demandPriceSale)}

                        {propertydoc.maintenancecharges !== '' && <span
                          style={{
                            fontSize: "10px",
                          }}
                        >
                          + ₹{propertydoc.maintenancecharges} ({propertydoc.maintenancechargesfrequency})
                        </span>}
                      </h6>                   
                        <h6>{propertydoc.unitNumber} | {propertydoc.society} </h6>
                        <h6>{propertydoc.bhk} | {propertydoc.propertyType} {propertydoc.furnishing === "" ? "" : " | " + propertydoc.furnishing + "Furnished"}  </h6>
                        <h6>{propertydoc.locality}, {propertydoc.city} | {propertydoc.state}</h6>


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
            }
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
                <div className="left">
                  <div className="img_div relative">
                    {uploadingDocId !== doc.id && (
                      <label
                        htmlFor={`upload_img_${doc.id}`}
                        className="upload_img click_text by_text"
                      >
                        Upload Key Img
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, doc.id)}
                          ref={fileInputRef}
                          id={`upload_img_${doc.id}`}
                        />
                      </label>
                    )}
                    {uploadingDocId === doc.id ? (
                      <div
                        className="loader d-flex justify-content-center align-items-center"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <BeatLoader color={"#FF5733"} loading={true} />
                      </div>
                    ) : doc.mediaType === "pdf" ? (
                      <iframe
                        title="PDF Viewer"
                        src={doc.keyImageUrl}
                        style={{
                          width: "100%",
                          aspectRatio: "3/2",
                        }}
                      ></iframe>
                    ) : (
                      <img
                        src={
                          doc.keyImageUrl || "/assets/img/icons/key-chain.png"
                        }
                        alt="Document"
                      />
                    )}
                  </div>
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
