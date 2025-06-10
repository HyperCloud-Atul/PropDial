import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDocument } from "../hooks/useDocument";
import { useCollection } from "../hooks/useCollection";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFirestore } from "../hooks/useFirestore";
import { projectStorage } from "../firebase/config";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { BarLoader, BeatLoader, ClimbingBoxLoader } from "react-spinners";
import SureDelete from "../pdpages/sureDelete/SureDelete";
import Back from "../pdpages/back/Back";
import QuickAccessMenu from "../pdpages/quickAccessMenu/QuickAccessMenu";

const TenantDetails = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { tenantId } = useParams();
  console.log('Tenant ID: ', tenantId)
  const fileInputRef = useRef(null);

  const [editedFields, setEditedFields] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [imageURL, setImageURL] = useState();
  const [loading, setLoading] = useState(false); // New state for loading
  const { updateDocument, deleteDocument } = useFirestore("tenants");

  const { document: tenantInfo, error: tenantInfoError } = useDocument("tenants", tenantId);
  console.log('Tenant Info: ', tenantInfo)
  const { document: propertyInfo, error: propertyInfoError } = useDocument("properties", editedFields.propertyId);
  console.log('Property Details:', propertyInfo)
  const { documents: tenantDocs, errors: tenantDocsError } = useCollection("docs", ["masterRefId", "==", tenantId]);

  useEffect(() => {
    if (tenantInfo) {
      setEditedFields(tenantInfo);
      setImageURL(tenantInfo.tenantImgUrl);
    }
  }, [tenantInfo]);

  const handleEditClick = (fieldName) => {
    setEditingField(fieldName);
  };
  // modal controls start
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  // modal controls end
  const deleteTenant = async () => {
    try {
      await deleteDocument(tenantId);
      navigate(`/propertydetails/${editedFields.propertyId}`);
    } catch (error) {
      console.error("Error deleting tenant:", error);
    }
  };

  const handleSaveClick = async (fieldName) => {
    try {
      await updateDocument(tenantId, { [fieldName]: editedFields[fieldName] });
      setEditingField(null);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const changeTenantPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPath = `tenantPhoto/${tenantId}/${file.name}`;
    const storageRef = projectStorage.ref(uploadPath);

    try {
      setLoading(true); // Set loading to true before uploading
      const img = await storageRef.put(file);
      const imgUrl = await img.ref.getDownloadURL();
      setImageURL(imgUrl);
      await updateDocument(tenantId, { tenantImgUrl: imgUrl });
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false); // Set loading to false after uploading
    }
  };

  const deleteTenantPhoto = async () => {
    if (imageURL) {
      const storageRef = projectStorage.refFromURL(imageURL);
      try {
        await storageRef.delete();
        await updateDocument(tenantId, { tenantImgUrl: "" });
        setImageURL(null);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  const handleCancelClick = (fieldName) => {
    setEditedFields((prevFields) => ({
      ...prevFields,
      [fieldName]: tenantInfo[fieldName],
    }));
    setEditingField(null);
  };

  const handleInputChange = (fieldName, value) => {
    setEditedFields((prevFields) => ({
      ...prevFields,
      [fieldName]: value,
    }));
  };
  // 9 dots controls
  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };
  // 9 dots controls


  const { addDocument: tenantDocsAddDocument, updateDocument: tenantDocsUpdateDocument, deleteDocument: tenantDocsDeleteDocument, docerror } = useFirestore("docs");
  const [uploadingDocId, setUploadingDocId] = useState(null); // Track uploading document ID
  const [showAIForm, setShowAIForm] = useState(false);
  const handleShowAIForm = () => setShowAIForm(!showAIForm);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocCat, setSelectedDocCat] = useState("KYC");
  const [selectedIdType, setSelectedIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const handleDocCatChange = (event) => setSelectedDocCat(event.target.value);
  const handleRadioChange = (event) => setSelectedIdType(event.target.value);
  const handleIdNumberChange = (event) => setIdNumber(event.target.value);
  const [documentFile, setDocumentFile] = useState(null);
  const [newDocId, setNewDocId] = useState("");

  const addTenantDocuments = async () => {
    if (!selectedDocCat || !selectedIdType) {
      alert("All fields are required!");
      return;
    }

    try {
      setIsUploading(true);
      const docRef = await tenantDocsAddDocument({
        status: "active",
        masterRefId: tenantId,
        documentUrl: "",
        docCat: selectedDocCat,
        idType: selectedIdType,
        idNumber: idNumber,
        mediaType: "",
      });
      setSelectedDocCat("")
      setSelectedIdType("");
      setIdNumber("");
      setIsUploading(false);
      // setNewDocId(docRef.id);
    } catch (error) {
      console.error("Error adding document:", error);
      setIsUploading(false);
    }
  };
  console.log("doccat", selectedDocCat);
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

  useEffect(() => {
    if (newDocId && documentFile) {
      uploadDocumentImage();
    }
  }, [newDocId, documentFile]);

  const uploadDocumentImage = async () => {
    try {
      setIsUploading(true);
      setUploadingDocId(newDocId); // Set the uploading document ID
      const fileType = getFileType(documentFile);
      const storageRef = projectStorage.ref(`docs/${newDocId}/${documentFile.name}`);
      await storageRef.put(documentFile);

      const fileURL = await storageRef.getDownloadURL();

      await tenantDocsUpdateDocument(newDocId, {
        documentUrl: fileURL,
        mediaType: fileType,
      });

      setDocumentFile(null);
      setIsUploading(false);
      setUploadingDocId(null); // Reset the uploading document ID
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading document image:", error);
      setIsUploading(false);
      setUploadingDocId(null); // Reset the uploading document ID in case of error
    }
  };

  const deleteTenantDocument = async (docId) => {
    try {
      await tenantDocsDeleteDocument(docId);
      // navigate("/properties");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // render jsx code in short form start 
  const docCategories = [
    { id: "kyc", value: "KYC", label: "KYC" },
    { id: "police_verification", value: "Police Verification", label: "Police Verification" },
    { id: "agreement", value: "Rent Agreement", label: "Rent Agreement" }
  ];


  const docTypes = {
    "KYC": [
      { id: "aadhar", value: "Aadhar Card", label: "Aadhar Card" },
      { id: "pan_card", value: "Pan Card", label: "Pan Card" },
      { id: "voter_id", value: "Voter ID", label: "Voter ID" },
      { id: "driving_licence", value: "Driving Licence", label: "Driving Licence" }
    ],
    "Police Verification": [
      { id: "police_verification_doc", value: "Police Verification Document", label: "Police Verification Document" }
    ],
    "Rent Agreement": [
      { id: "rent_agree_doc", value: "Rent Agreement (Word Doc)", label: "Rent Agreement (Word Doc)" },
      { id: "rent_agree_pdf", value: "Rent Agreement (PDF)", label: "Rent Agreement (PDF)" }
    ]
  };
  // render jsx code in short form end

  // filters start 
  // filter for KYC start 
  const filteredTenantDocuments = tenantDocs ? tenantDocs.filter(doc => doc.docCat === "KYC") : [];
  const filteredTenantDocLength = filteredTenantDocuments.length;
  // filter for KYC end

  // filter for Police Verification document start 
  const filteredPoliceVerificationDocuments = tenantDocs ? tenantDocs.filter(doc => doc.docCat === "Police Verification") : [];
  const filteredPoliceVerificationDocLength = filteredPoliceVerificationDocuments.length;
  // filter for propertymaintainance document end
  // filter for property utility document start 
  const filteredRentAgreementDocuments = tenantDocs ? tenantDocs.filter(doc => doc.docCat === "Rent Agreement") : [];
  const filteredRentAgreementDocLength = filteredRentAgreementDocuments.length;
  // filter for property utility document end
  // filters end 


  // data of quick access menu  start  
  const menuItems = [
    { name: 'Dashboard', link: '/dashboard', icon: '/assets/img/icons/qa_dashboard.png' },
    { name: 'Property', link: '/propertydetails/' + editedFields.propertyId, icon: '/assets/img/icons/qa_property.png' },

    // { name: 'Tenant', link: '/', icon: '/assets/img/icons/qa_tenant.png' },
    // { name: 'Document', link: '/', icon: '/assets/img/icons/qa_documentation.png' },

    // { name: 'Transaction', link: '/', icon: '/assets/img/icons/qa_transaction.png' },
    // { name: 'Bills', link: '/', icon: '/assets/img/icons/qa_bilss.png' },
    // { name: 'Enquiry', link: '/', icon: '/assets/img/icons/qa_support.png' },
  ];
  // data of quick access menu  end
  return (
    <div className="tenant_detail_pg">
      <div className="top_header_pg pg_bg">
        <div className="page_spacing">
          {/* 9 dots html  */}
          <div
            onClick={openMoreAddOptions}
            className="property-list-add-property"
          >
            <span className="material-symbols-outlined">apps</span>
          </div>
          <div
            className={
              handleMoreOptionsClick
                ? "more-add-options-div open"
                : "more-add-options-div"
            }
            onClick={closeMoreAddOptions}
            id="moreAddOptions"
          >
            <div className="more-add-options-inner-div">
              <div className="more-add-options-icons">
                <h1>Close</h1>
                <span className="material-symbols-outlined">close</span>
              </div>

              <Link to="" className="more-add-options-icons">
                <h1>Property Image</h1>
                <span className="material-symbols-outlined">location_city</span>
              </Link>

              <Link to="" className="more-add-options-icons">
                <h1>Property Document</h1>
                <span className="material-symbols-outlined">
                  holiday_village
                </span>
              </Link>

              <Link to="" className="more-add-options-icons">
                <h1>Property Report</h1>
                <span className="material-symbols-outlined">home</span>
              </Link>
              <Link to="" className="more-add-options-icons">
                <h1>Property Bills</h1>
                <span className="material-symbols-outlined">home</span>
              </Link>
            </div>
          </div>
          <QuickAccessMenu menuItems={menuItems} />
         <div className="vg22"></div>
          <div className="">
            <div className="row">
              <div className="col-md-4">
                <div className={`tc_single ${tenantInfo && tenantInfo.status === "inactive" ? "t_inactive" : ""}`}>
                  <div className="tcs_img_container relative">
                    {loading ? (
                      <div className="loader">
                        <BeatLoader color={"#FF5733"} loading={true} />
                      </div>
                    ) : (
                      <>
                        <img alt="="
                          src={imageURL || "/assets/img/upload_img_small.png"}
                        />
                        <label htmlFor="upload" className="upload_img">
                          <input
                            type="file"
                            onChange={changeTenantPhoto}
                            ref={fileInputRef}
                            id="upload"
                          />
                        </label>

                        {imageURL && (
                          <span
                            className="material-symbols-outlined delete_icon"
                            onClick={deleteTenantPhoto}
                          >
                            delete_forever
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="tenant_detail ">
                    <h5 className="t_name">
                      {editingField === "name" ? (
                        <div className="edit_field">
                          <input
                            type="text"
                            value={editedFields.name || ""}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder="Name"
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() => handleCancelClick("name")}
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("name")}
                            >
                              Save
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {tenantInfo && tenantInfo.name
                            ? tenantInfo && tenantInfo.name
                            : "Name"}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("name")}
                            >
                              edit
                            </span>
                          )}
                        </>
                      )}
                    </h5>
                    <h6 className="t_number">
                      {editingField === "mobile" ? (
                        <div className="edit_field">
                          <input
                            type="text"
                            value={editedFields.mobile || ""}
                            onChange={(e) =>
                              handleInputChange("mobile", e.target.value)
                            }
                            placeholder="Mobile number"
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() => handleCancelClick("mobile")}
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("mobile")}
                            >
                              Save
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {tenantInfo && tenantInfo.mobile
                            ? tenantInfo && tenantInfo.mobile
                            : "Mobile number"}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("mobile")}
                            >
                              edit
                            </span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                  <div className="wha_call_icon">
                    <Link
                      className="call_icon wc_single"
                      to={`tel:${tenantInfo && tenantInfo.mobile}`}
                      target="_blank"
                    >
                      <img src="/assets/img/simple_call.png" alt="" />
                    </Link>
                    <Link
                      className="wha_icon wc_single"
                      to={`https://wa.me/${tenantInfo && tenantInfo.mobile}`}
                      target="_blank"
                    >
                      <img src="/assets/img/whatsapp_simple.png" alt="" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="tc_single">

                  {propertyInfo && (
                    <>
                      <div className="tcs_single">
                        <h5>Property</h5>
                        <h6>{propertyInfo.unitNumber}, {propertyInfo.society}, {propertyInfo.locality}, {propertyInfo.city}, {propertyInfo.state}</h6>
                      </div>
                      <div className="divider"></div></>)}
                  <div className="tcs_single">
                    <h5>Rent Start Date</h5>
                    <h6>
                      {editingField === "onBoardingDate" ? (
                        <div className="edit_field">
                          <input
                            type="date"
                            value={editedFields.onBoardingDate || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "onBoardingDate",
                                e.target.value
                              )
                            }
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() =>
                                handleCancelClick("onBoardingDate")
                              }
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("onBoardingDate")}
                            >
                              Save
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {tenantInfo && tenantInfo.onBoardingDate
                            ? tenantInfo && tenantInfo.onBoardingDate
                            : "Add onborading date"}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("onBoardingDate")}
                            >
                              edit
                            </span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                  <div className="divider"></div>
                  <div className="tcs_single">
                    <h5>Rent End Date</h5>
                    <h6>
                      {editingField === "offBoardingDate" ? (
                        <div className="edit_field">
                          <input
                            type="date"
                            value={editedFields.offBoardingDate || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "offBoardingDate",
                                e.target.value
                              )
                            }
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() =>
                                handleCancelClick("offBoardingDate")
                              }
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("offBoardingDate")}
                            >
                              Save
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {tenantInfo && tenantInfo.offBoardingDate
                            ? tenantInfo && tenantInfo.offBoardingDate
                            : "Add off borading date"}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("offBoardingDate")}
                            >
                              edit
                            </span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                  <div className="divider"></div>
                  <div className="tcs_single">
                    <h5>Status</h5>
                    <h6>
                      {editingField === "status" ? (
                        <div className="edit_field">
                          <div className="form_field">
                            <div className="field_box theme_radio_new">
                              <div className="theme_radio_container">
                                <div className="radio_single">
                                  <input
                                    type="radio"
                                    value="active"
                                    checked={editedFields.status === "active"}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "status",
                                        e.target.value
                                      )
                                    }
                                    id="active"
                                  />
                                  <label htmlFor="active">Active</label>
                                </div>
                                <div className="radio_single">
                                  <input
                                    type="radio"
                                    value="inactive"
                                    checked={editedFields.status === "inactive"}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "status",
                                        e.target.value
                                      )
                                    }
                                    id="inactive"
                                  />
                                  <label htmlFor="inactive">Inactive</label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() => handleCancelClick("status")}
                              style={{ marginLeft: "10px" }}
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("status")}
                            >
                              Save
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {tenantInfo && tenantInfo.status}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("status")}
                            >
                              edit
                            </span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                  <div className="divider"></div>
                  <div className="tcs_single">
                    <h5>Email ID</h5>
                    <h6>
                      {editingField === "emailID" ? (
                        <div className="edit_field">
                          <input
                            type="email"
                            value={editedFields.emailID || ""}
                            onChange={(e) =>
                              handleInputChange("emailID", e.target.value)
                            }
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() => handleCancelClick("emailID")}
                              style={{ marginLeft: "10px" }}
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("emailID")}
                            >
                              Save
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {tenantInfo && tenantInfo.emailID
                            ? tenantInfo && tenantInfo.emailID
                            : "Email ID here"}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("emailID")}
                            >
                              edit
                            </span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                  <div className="divider"></div>
                  <div className="tcs_single">
                    <h5>Address</h5>
                    <h6>
                      {editingField === "address" ? (
                        <div className="edit_field">
                          <input
                            type="text"
                            value={editedFields.address || ""}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value)
                            }
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() => handleCancelClick("address")}
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("address")}
                            >
                              Save
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {tenantInfo && tenantInfo.address
                            ? tenantInfo && tenantInfo.address
                            : "Address here"}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("address")}
                            >
                              edit
                            </span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="vg22"></div>
            <div className="pg_header d-flex align-items-center justify-content-between">
              <div className="left">
                <h2 className="m22 mb-1">Documents</h2>
                <h4 className="r16 light_black">
                  Add new, show and download documents{" "}
                </h4>
              </div>
              <div className="right">
                {!showAIForm && (
                  <div className="theme_btn btn_fill" onClick={handleShowAIForm}>
                    Add document
                  </div>
                )}
              </div>
            </div>
            {showAIForm && (
              <>
                <div className="vg22"></div>
                <section className="my_big_card">
                  <h2 className="card_title">Select document type</h2>
                  <div className="aai_form">
                    <div className="row" style={{ rowGap: "18px" }}>
                      <div className="col-12">
                        <div className="form_field">
                          <div className="field_box theme_radio_new tab_type_radio">
                            <div className="theme_radio_container">
                              {docCategories.map((category) => (
                                <div className="radio_single" key={category.id}>
                                  <input
                                    type="radio"
                                    name="doc_cat"
                                    id={category.id}
                                    value={category.value}
                                    onChange={handleDocCatChange}
                                    checked={selectedDocCat === category.value}
                                  />
                                  <label htmlFor={category.id}>{category.label}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {docTypes[selectedDocCat] && (
                        <div className="col-12">
                          <div className="form_field">
                            <div className="field_box theme_radio_new">
                              <div className="theme_radio_container">
                                {docTypes[selectedDocCat].map((radio) => (
                                  <div className="radio_single" key={radio.id}>
                                    <input
                                      type="radio"
                                      name="aai_type"
                                      id={radio.id}
                                      value={radio.value}
                                      onChange={handleRadioChange}
                                      checked={selectedIdType === radio.value}
                                    />
                                    <label htmlFor={radio.id}>{radio.label}</label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="col-md-11">
                        <div className="add_info_text">
                          <div className="form_field">
                            <div className="relative">
                              <input
                                type="text"
                                value={idNumber}
                                onChange={handleIdNumberChange}
                                placeholder="Document ID (optional)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-sm-2">
                      <div
                        className="theme_btn btn_border text-center"
                        onClick={isUploading ? null : handleShowAIForm}
                      >
                        Cancel
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <div
                        className={`theme_btn btn_fill text-center ${isUploading ? "disabled" : ""
                          }`}
                        onClick={isUploading ? null : addTenantDocuments}
                      >
                        {isUploading ? "Uploading..." : "Create"}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* <div className="blog_sect">
              <div className="row">
                {tenantDocs &&
                  tenantDocs.map((doc, index) => (
                    <div className="col-md-4" key={index}>
                      <div className="item card-container">
                        <div className="card-image relative" style={{
                          width: "100%",
                          aspectRatio: "3/2"
                        }}>
                          {uploadingDocId !== doc.id && (
                            <label htmlFor={`upload_img_${doc.id}`} className="upload_img click_text by_text">
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
                            <div className="loader d-flex justify-content-center align-items-center" style={{
                              width: "100%",
                              height: "100%"
                            }}>
                              <BeatLoader color={"#FF5733"} loading={true} />
                            </div>
                          ) : doc.mediaType === "pdf" ? (
                            <iframe
                              title="PDF Viewer"
                              src={doc.documentUrl}
                              style={{
                                width: "100%",
                                aspectRatio: "3/2",
                              }}
                            ></iframe>
                          ) : (
                            <img
                              src={doc.documentUrl || "https://via.placeholder.com/150"}
                              alt="Document"
                            />
                          )}
                        </div>
                        <div className="card-body">
                          <h3>{doc.idType}</h3>
                          <p className="card-subtitle">{doc.idNumber}</p>
                          <div className="card-author">
                            <div onClick={() => deleteTenantDocument(doc.id)} className="learn-more pointer">
                              Delete
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div> */}
            <div className="theme_tab prop_doc_tab">
              <Tabs>
                <TabList className="tabs">
                  <Tab className="pointer">Tenant KYC Document{" "}({filteredTenantDocLength})</Tab>
                  <Tab className="pointer">Police Verification{" "}({filteredPoliceVerificationDocLength})</Tab>
                  <Tab className="pointer">Rent Agreements{" "}({filteredRentAgreementDocLength})</Tab>
                </TabList>
                <TabPanel>             
                  <div className="blog_sect">
                    <div className="row">
                      {filteredTenantDocLength === 0 && (
                        <h5 className="m20 text_red mt-4">No data found</h5>
                      )}
                      {filteredTenantDocuments.map((doc, index) => (
                        <div className="col-md-4" key={index}>
                          <div className="item card-container">
                            <div className="card-image relative">
                              {uploadingDocId !== doc.id && (
                                <label htmlFor={`upload_img_${doc.id}`} className="upload_img click_text by_text">
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
                                <div className="loader d-flex justify-content-center align-items-center" style={{
                                  width: "100%",
                                  height: "100%"
                                }}>
                                  <BeatLoader color={"#FF5733"} loading={true} />
                                </div>
                              ) : doc.mediaType === "pdf" ? (
                                <iframe
                                  title="PDF Viewer"
                                  src={doc.documentUrl}
                                  style={{
                                    width: "100%",
                                    aspectRatio: "3/2",
                                  }}
                                ></iframe>
                              ) : (
                                <img
                                  src={doc.documentUrl || "https://via.placeholder.com/150"}
                                  alt="Document"
                                />
                              )}
                            </div>
                            <div className="card-body">
                              <h3>{doc.idType}</h3>
                              <p className="card-subtitle">{doc.idNumber}</p>
                              <div className="card-author">
                                <div onClick={() => deleteTenantDocument(doc.id)} className="learn-more pointer">
                                  Delete
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="blog_sect">
                    <div className="row">
                    {filteredPoliceVerificationDocLength === 0 && (
                        <h5 className="m20 text_red mt-4">No data found</h5>
                      )}
                      {filteredPoliceVerificationDocuments.map((doc, index) => (
                        <div className="col-md-4" key={index}>
                          <div className="item card-container">
                            <div className="card-image relative">
                              {uploadingDocId !== doc.id && (
                                <label htmlFor={`upload_img_${doc.id}`} className="upload_img click_text by_text">
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
                                <div className="loader d-flex justify-content-center align-items-center" style={{
                                  width: "100%",
                                  height: "100%"
                                }}>
                                  <BeatLoader color={"#FF5733"} loading={true} />
                                </div>
                              ) : doc.mediaType === "pdf" ? (
                                <iframe
                                  title="PDF Viewer"
                                  src={doc.documentUrl}
                                  style={{
                                    width: "100%",
                                    aspectRatio: "3/2",
                                  }}
                                ></iframe>
                              ) : (
                                <img
                                  src={doc.documentUrl || "https://via.placeholder.com/150"}
                                  alt="Document"
                                />
                              )}
                            </div>
                            <div className="card-body">
                              <h3>{doc.idType}</h3>
                              <p className="card-subtitle">{doc.idNumber}</p>
                              <div className="card-author">
                                <div onClick={() => deleteTenantDocument(doc.id)} className="learn-more pointer">
                                  Delete
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="blog_sect">
                    <div className="row">
                    {filteredRentAgreementDocLength === 0 && (
                        <h5 className="m20 text_red mt-4">No data found</h5>
                      )}
                      {filteredRentAgreementDocuments.map((doc, index) => (
                        <div className="col-md-4" key={index}>
                          <div className="item card-container">
                            <div className="card-image relative">
                              {uploadingDocId !== doc.id && (
                                <label htmlFor={`upload_img_${doc.id}`} className="upload_img click_text by_text">
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
                                <div className="loader d-flex justify-content-center align-items-center" style={{
                                  width: "100%",
                                  height: "100%"
                                }}>
                                  <BeatLoader color={"#FF5733"} loading={true} />
                                </div>
                              ) : doc.mediaType === "pdf" ? (
                                <iframe
                                  title="PDF Viewer"
                                  src={doc.documentUrl}
                                  style={{
                                    width: "100%",
                                    aspectRatio: "3/2",
                                  }}
                                ></iframe>
                              ) : (
                                <img
                                  src={doc.documentUrl || "https://via.placeholder.com/150"}
                                  alt="Document"
                                />
                              )}
                            </div>
                            <div className="card-body">
                              <h3>{doc.idType}</h3>
                              <p className="card-subtitle">{doc.idNumber}</p>
                              <div className="card-author">
                                <div onClick={() => deleteTenantDocument(doc.id)} className="learn-more pointer">
                                  Delete
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                </TabPanel>

              </Tabs>
            </div>








            {!editingField && user && user.role === "admin" && (
              <>
                <div className="vg22"></div>
                <div className="divider"></div>
                <div className="vg10"></div>
                <div onClick={handleShowModal} className="delete_bottom">
                  <span className="material-symbols-outlined">delete</span>
                  <span>Delete Tenant</span>
                </div>
                <div className="vg22"></div>
              </>
            )}
            <SureDelete
              show={showModal}
              handleClose={handleCloseModal}
              handleDelete={deleteTenant}
            />

            {/* <div>
            ID Number:
            {editingField === "idNumber" ? (
              <div>
                <input
                  type="text"
                  value={editedFields.idNumber || ""}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                />
                <div className="d-flex">
                  <button
                    className="product_edit_save_btn"
                    onClick={() => handleSaveClick("idNumber")}
                  >
                    Save
                  </button>
                  <button
                    className="product_edit_save_btn cancel-btn"
                    onClick={() => handleCancelClick("idNumber")}
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {tenantInfo && tenantInfo.idNumber}
                {!editingField && user && user.role === "admin" && (
                  <span
                    className="material-symbols-outlined"
                    onClick={() => handleEditClick("idNumber")}
                  >
                    edit
                  </span>
                )}
              </>
            )}
          </div>       */}

            {/* <div>
            Rent Start Date:
            {editingField === "rentStartDate" ? (
              <div>
                <input
                  type="date"
                  value={editedFields.rentStartDate || ""}
                  onChange={(e) =>
                    handleInputChange("rentStartDate", e.target.value)
                  }
                />
                <div className="d-flex">
                  <button
                    className="product_edit_save_btn"
                    onClick={() => handleSaveClick("rentStartDate")}
                  >
                    Save
                  </button>
                  <button
                    className="product_edit_save_btn cancel-btn"
                    onClick={() => handleCancelClick("rentStartDate")}
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {tenantInfo && tenantInfo.rentStartDate}
                {!editingField && user && user.role === "admin" && (
                  <span
                    className="material-symbols-outlined"
                    onClick={() => handleEditClick("rentStartDate")}
                  >
                    edit
                  </span>
                )}
              </>
            )}
          </div> */}
            {/* <div>
            Rent End Date:
            {editingField === "rentEndDate" ? (
              <div>
                <input
                  type="date"
                  value={editedFields.rentEndDate || ""}
                  onChange={(e) => handleInputChange("rentEndDate", e.target.value)}
                />
                <div className="d-flex">
                  <button
                    className="product_edit_save_btn"
                    onClick={() => handleSaveClick("rentEndDate")}
                  >
                    Save
                  </button>
                  <button
                    className="product_edit_save_btn cancel-btn"
                    onClick={() => handleCancelClick("rentEndDate")}
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {tenantInfo && tenantInfo.rentEndDate}
                {!editingField && user && user.role === "admin" && (
                  <span
                    className="material-symbols-outlined"
                    onClick={() => handleEditClick("rentEndDate")}
                  >
                    edit
                  </span>
                )}
              </>
            )}
          </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetails;
