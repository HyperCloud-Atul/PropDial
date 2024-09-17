import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { projectStorage } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import { BeatLoader } from "react-spinners";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import ScrollToTop from "../../components/ScrollToTop";

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
      setShowAIForm(!showAIForm)
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

  const deletePropertyDocument = async (docId) => {
    try {
      await deleteDocument(docId);
      // navigate("/properties");
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
    <div className="top_header_pg pg_bg property_docs_pg">
     <ScrollToTop/>
      <div className="page_spacing"> 
        <div className="row row_reverse_991">
          <div className="col-lg-6">
            <div className="title_card mobile_full_575 mobile_gap h-100">
              <h2 className="text-center mb-4">OnePlace for Property Keys</h2>
              {/* <h6 className="text-center mt-1 mb-2">Your Central Hub for Viewing, Downloading, and Uploading Property Documents</h6> */}
              {!showAIForm && (
                <div className="theme_btn btn_fill no_icon text-center short_btn" onClick={handleShowAIForm}>
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
                        <span className="card_badge">
                          {propertydoc.isActiveInactiveReview}
                        </span>
                      </div>
                      <h6 className="demand">
                        <span>₹</span>{propertydoc.demandPrice}
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
                          <span>₹</span> {propertydoc.demandPrice}
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
                  <div className="col-6">
                    <div className="add_info_text">
                      <div className="form_field">                        
                          <input
                            type="text"
                            value={keyNumber}
                            onChange={handleKeyNumberChange}
                            placeholder="Key number"
                          />                        
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="add_info_text">
                      <div className="form_field">                        
                          <input
                            type="number"
                            value={numberOfKey}
                            onChange={handleNumberOfKeyChange}
                            placeholder="Key number"
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
                    className={`theme_btn btn_fill text-center no_icon ${isUploading ? "disabled" : ""
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
        {propertyKeyDoc && propertyKeyDoc.map((doc, index) => (
                    <div className="col-xl-4 col-md-6" key={index}>
                      <div className="item card-container">
                        <div className="card-image relative">
                          {uploadingDocId !== doc.id && (
                            <label
                              htmlFor={`upload_img_${doc.id}`}
                              className="upload_img click_text by_text"
                            >
                              Upload PDF or Img
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
                                doc.keyImageUrl ||
                                "https://via.placeholder.com/150"
                              }
                              alt="Document"
                            />
                          )}                       
                        </div>
                        <div className="card-body">
                          <h3>{doc.keyNumber}</h3>
                          {/* <p className="card-subtitle">{doc.idNumber}</p> */}
                          {(user && user.role === "admin") && (
                            <div className="d-flex justify-content-between w-100">
                              <div className="card-author">
                                <div
                                  onClick={() => deletePropertyDocument(doc.id)}
                                  className="learn-more pointer"
                                >
                                  Delete
                                </div>
                              </div>                            
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
      </div>
    </div>
  );
};

export default PropertyKeyDetail
