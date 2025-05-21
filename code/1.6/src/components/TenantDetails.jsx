import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDocument } from "../hooks/useDocument";
import { useCollection } from "../hooks/useCollection";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFirestore } from "../hooks/useFirestore";
import { projectStorage } from "../firebase/config";
import { projectFirestore } from "../firebase/config";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { BarLoader, BeatLoader, ClimbingBoxLoader } from "react-spinners";
import SureDelete from "../pdpages/sureDelete/SureDelete";
import Back from "../pdpages/back/Back";
import QuickAccessMenu from "../pdpages/quickAccessMenu/QuickAccessMenu";
import PhoneInput from "react-phone-input-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import ImageModal from "../pdpages/imageModal/ImageModal";
import PropertySummaryCard from "../pdpages/property/PropertySummaryCard";
import { generateSlug } from "../utils/generateSlug";

const TenantDetails = () => {
  const location = useLocation();
  console.log("location: ", location);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { tenantId } = useParams();
  console.log("Tenant ID: ", tenantId);
  const fileInputRef = useRef(null);

  const [editedFields, setEditedFields] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [imageURL, setImageURL] = useState();
  const [loading, setLoading] = useState(false); // New state for loading
  const { updateDocument, deleteDocument } = useFirestore("tenants");

  const { document: tenantInfo, error: tenantInfoError } = useDocument(
    "tenants",
    tenantId
  );
  console.log("Tenant Info: ", tenantInfo);
const fetchPropertyById = async (propertyId) => {
  try {
    const docRef = projectFirestore.collection("properties-propdial").doc(propertyId);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn("No such property document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
};
const [propertydoc, setPropertydoc] = useState(null);

useEffect(() => {
  const getProperty = async () => {
    if (tenantInfo?.propertyId) {
      const fetched = await fetchPropertyById(tenantInfo.propertyId);
      setPropertydoc(fetched);
    }
  };
  getProperty();
}, [tenantInfo]);
  
  // const { document: propertyInfo, error: propertyInfoError } = useDocument("properties-propdial", editedFields.propertyId);
  // console.log('Property Details:', propertyInfo)
  const { documents: tenantDocs, errors: tenantDocsError } = useCollection(
    "docs",
    ["masterRefId", "==", tenantId]
  );

  useEffect(() => {
    if (tenantInfo) {
      setEditedFields(tenantInfo);
      setImageURL(tenantInfo.tenantImgUrl);
    }
  }, [tenantInfo]);

  // const handleEditClick = (fieldName) => {
  //   setEditingField(fieldName);
  // };
  const handleEditClick = (fieldName) => {
    if (fieldName === "offBoardingDate" && !editedFields.onBoardingDate) {
      alert("Please select Rent Start Date first.");
    } else {
      setEditingField(fieldName);
    }
  };

  // const deleteTenant = async () => {
  //   setIsDeleting(true);
  //   try {
  //     await deleteDocument(tenantId);
  //     setIsDeleting(false);
  //     navigate(`/propertydetails/${editedFields.propertyId}`);
  //   } catch (error) {
  //     console.error("Error deleting tenant:", error);
  //     setIsDeleting(false);
  //   }
  // };
const deleteTenant = async () => {
  setIsDeleting(true);
  try {
    await deleteDocument(tenantId);

    // Fetch the property document using tenantInfo.propertyId
    const property = await fetchPropertyById(tenantInfo.propertyId);
    
    if (property) {
      const slug = generateSlug(property);
      navigate(`/propertydetails/${slug}`);
    } else {
      navigate("/"); // fallback
    }

    setIsDeleting(false);
  } catch (error) {
    console.error("Error deleting tenant:", error);
    setIsDeleting(false);
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
    setIsDeleting(true);
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
    handleCloseModal();
    setIsDeleting(false);
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

  // Function to format date to dd/mm/yy
  const formatDateToDDMMMYYYY = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date)) {
      const day = String(date.getDate()).padStart(2, "0");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return "";
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

  const {
    addDocument: tenantDocsAddDocument,
    updateDocument: tenantDocsUpdateDocument,
    deleteDocument: tenantDocsDeleteDocument,
    docerror,
  } = useFirestore("docs");
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
      setSelectedDocCat("");
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
      const storageRef = projectStorage.ref(
        `docs/${newDocId}/${documentFile.name}`
      );
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
    {
      id: "police_verification",
      value: "Police Verification",
      label: "Police Verification",
    },
    { id: "agreement", value: "Rent Agreement", label: "Rent Agreement" },
  ];

  const docTypes = {
    KYC: [
      { id: "aadhar", value: "Aadhar Card", label: "Aadhar Card" },
      { id: "pan_card", value: "Pan Card", label: "Pan Card" },
      { id: "voter_id", value: "Voter ID", label: "Voter ID" },
      { id: "passport", value: "Passport", label: "Passport" },
      {
        id: "driving_licence",
        value: "Driving Licence",
        label: "Driving Licence",
      },
    ],
    "Police Verification": [
      {
        id: "police_verification_doc",
        value: "Police Verification Document",
        label: "Police Verification Document",
      },
    ],
    "Rent Agreement": [
      {
        id: "rent_agree_doc",
        value: "Rent Agreement (Word Doc)",
        label: "Rent Agreement (Word Doc)",
      },
      {
        id: "rent_agree_pdf",
        value: "Rent Agreement (PDF)",
        label: "Rent Agreement (PDF)",
      },
    ],
  };
  // render jsx code in short form end

  // filters start
  // filter for KYC start
  const filteredTenantDocuments = tenantDocs
    ? tenantDocs.filter((doc) => doc.docCat === "KYC")
    : [];
  const filteredTenantDocLength = filteredTenantDocuments.length;
  // filter for KYC end

  // filter for Police Verification document start
  const filteredPoliceVerificationDocuments = tenantDocs
    ? tenantDocs.filter((doc) => doc.docCat === "Police Verification")
    : [];
  const filteredPoliceVerificationDocLength =
    filteredPoliceVerificationDocuments.length;
  // filter for propertymaintainance document end
  // filter for property utility document start
  const filteredRentAgreementDocuments = tenantDocs
    ? tenantDocs.filter((doc) => doc.docCat === "Rent Agreement")
    : [];
  const filteredRentAgreementDocLength = filteredRentAgreementDocuments.length;
  // filter for property utility document end
  // filters end

  // modal controls
  // modal controls start
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(""); // Store the type of action
  const [isDeleting, setIsDeleting] = useState(false);

  const handleShowModal = (action) => {
    setActionType(action); // Set the action type (e.g., "deleteTenant")
    setShowModal(true); // Show modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
    setActionType(""); // Reset action type
  };

  // Generic delete handler based on action type
  const handleDelete = () => {
    if (actionType === "deleteTenant") {
      deleteTenant();
    } else if (actionType === "deleteTenantProfile") {
      deleteTenantPhoto();
    } else if (actionType === "deleteProfilePhoto") {
      // deleteProfilePhoto();
    }
  };

  // image modal code start
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [imageModalTitle, setImageModalTitle] = useState("");
  // handleImageClick to accept a title parameter
  const handleImageClick = (imageUrl, modalTitle) => {
    if (imageUrl === "/assets/img/dummy_user.png") {
      setSelectedImageUrl("/assets/img/dummy_user.png"); // Set dummy image
      setImageModalTitle(
        <span
          style={{
            fontSize: "18px",
            color: "var(--theme-red)",
          }}
        >
          🚫 No photo uploaded yet!
        </span>
      ); // Set the fallback message
    } else {
      setSelectedImageUrl(imageUrl); // Set the actual image
      setImageModalTitle(modalTitle); // Set the actual modal title
    }
    setShowImageModal(true);
  };
  // image modal code end
  // const propSummaryId = tenantInfo && tenantInfo.propertyId
  // const { document: propertydoc, error: propertyerror } = useDocument(
  //   "properties-propdial",
  //   ["propertyId", "===", propSummaryId],

  // );


  return (
    <div className="tenant_detail_pg">
      <div className="top_header_pg pg_bg">
        <div className="page_spacing pg_min_height">
          <div className="row row_reverse_991">
            <div className="col-lg-6">
              <div className="title_card mobile_full_575 mobile_gap h-100">
                <h2 className="text-center mb-1">Tenant Documents</h2>
                <h6 className="text-center mt-1 mb-4">
                  Add new, show and download documents
                </h6>
                {!showAIForm && (
                  <div
                    className="theme_btn btn_fill no_icon text-center short_btn"
                    onClick={handleShowAIForm}
                  >
                    Add document
                  </div>
                )}
              </div>
            </div>
        {propertydoc && (
  <PropertySummaryCard
    propertydoc={propertydoc}
    propertyId={tenantInfo.propertyId}
  />
)}
          </div>
          {showAIForm && (
            <>
              <div className="vg22_m15"></div>
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
                                <label htmlFor={category.id}>
                                  {category.label}
                                </label>
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
                                  <label htmlFor={radio.id}>
                                    {radio.label}
                                  </label>
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
                      onClick={isUploading ? null : addTenantDocuments}
                    >
                      {isUploading ? "Uploading..." : "Create"}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

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

          <div className="vg22_m15"></div>
          <div className="">
            <div
              className="row"
              style={{
                rowGap: "15px",
              }}
            >
              <div className="col-lg-4 tenant_mobile_full_card">
                <div
                  className={`tc_single${tenantInfo && tenantInfo.status === "inactive"
                      ? "t_inactive"
                      : ""
                    }`}
                >
                  <div className="tcs_img_container relative">
                    {loading ? (
                      <div className="loader">
                        <BeatLoader color={"#FF5733"} loading={true} />
                      </div>
                    ) : (
                      <>
                        <img
                          alt="="
                          src={imageURL || "/assets/img/dummy_user.png"}
                          className="pointer"
                          onClick={() =>
                            handleImageClick(
                              imageURL || "/assets/img/dummy_user.png",
                              <>
                                Here's How{" "}
                                <span
                                  style={{
                                    fontWeight: "500",
                                    color: "var(--theme-blue)",
                                  }}
                                >
                                  {tenantInfo && tenantInfo.name
                                    ? tenantInfo.name
                                    : "Tenant"}
                                </span>{" "}
                                Looks
                              </>
                            )
                          } // Pass dynamic title
                        />
                        <label htmlFor="upload" className="upload_img">
                          <input
                            type="file"
                            onChange={changeTenantPhoto}
                            ref={fileInputRef}
                            id="upload"
                          />
                          <span className="material-symbols-outlined">
                            photo_camera
                          </span>
                        </label>

                        {imageURL && (
                          <span
                            className="material-symbols-outlined delete_icon"
                            onClick={() =>
                              handleShowModal("deleteTenantProfile")
                            }
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
                              className="theme_btn btn_border text-center no_icon"
                              onClick={() => handleCancelClick("name")}
                            >
                              Cancel
                            </span>
                            <span
                              className="theme_btn btn_fill text-center no_icon"
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
                          {!editingField && user && (user.role === "admin" || user.role === "superAdmin") && (
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
                            placeholder="Mobile number (Ex:- +912234567899)"
                          />
                          {/* <PhoneInput
                            country={"in"}
                            // onlyCountries={['in', 'us', 'ae']}
                            value={editedFields.mobile || ""}
                            // onChange={setPhone}
                            onChange={(e) =>
                              handleInputChange("mobile", e.target.value)
                            }
                            international
                            keyboardType="phone-pad"
                            // countryCallingCodeEditable={false}
                            countryCodeEditable={true}
                            // disableCountryCode={true}
                            placeholder="Mobile number"
                            inputProps={{
                              name: "phone",
                              required: true,
                              autoFocus: false,
                            }}
                            inputStyle={{
                              width: "100%",
                              height: "45px",
                              paddingLeft: "45px",
                              fontSize: "16px",
                              borderRadius: "5px",
                              border: "1px solid #00A8A8",
                            }}
                            buttonStyle={{
                              borderRadius: "5px",
                              textAlign: "left",
                              border: "1px solid #00A8A8",
                            }}
                          ></PhoneInput> */}
                          <div className="d-flex justify-content-between">
                            <span
                              className="theme_btn btn_border text-center no_icon"
                              onClick={() => handleCancelClick("mobile")}
                            >
                              Cancel
                            </span>
                            <span
                              className="theme_btn btn_fill text-center no_icon"
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
                          {!editingField && user && (user.role === "admin" || user.role === "superAdmin") && (
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
                  {tenantInfo && tenantInfo.mobile && (
                    <div className="wha_call_icon">
                      <Link
                        className="call_icon wc_single"
                        to={`tel:+${tenantInfo && tenantInfo.mobile}`}
                        target="_blank"
                      >
                        <img src="/assets/img/simple_call.png" alt="propdial" />
                      </Link>
                      <Link
                        className="wha_icon wc_single"
                        to={`https://wa.me/+${tenantInfo && tenantInfo.mobile}`}
                        target="_blank"
                      >
                        <img src="/assets/img/whatsapp_simple.png" alt="propdial" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-8 tenant_mobile_full_card">
                <div className="tc_single">
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
                              className="theme_btn btn_border text-center no_icon"
                              onClick={() =>
                                handleCancelClick("onBoardingDate")
                              }
                            >
                              Cancel
                            </span>
                            <span
                              className="theme_btn btn_fill text-center no_icon"
                              onClick={() => handleSaveClick("onBoardingDate")}
                            >
                              Save
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Display the date in dd/mm/yy format */}
                          {tenantInfo && tenantInfo.onBoardingDate
                            ? formatDateToDDMMMYYYY(tenantInfo.onBoardingDate)
                            : "Add onborading date"}
                          {!editingField && user && (user.role === "admin" || user.role === "superAdmin") && (
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
                            // Set min date to one day after the Rent Start Date
                            min={
                              editedFields.onBoardingDate
                                ? new Date(
                                  new Date(
                                    editedFields.onBoardingDate
                                  ).getTime() +
                                  24 * 60 * 60 * 1000
                                )
                                  .toISOString()
                                  .split("T")[0]
                                : ""
                            }
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="theme_btn btn_border text-center no_icon"
                              onClick={() =>
                                handleCancelClick("offBoardingDate")
                              }
                            >
                              Cancel
                            </span>
                            <span
                              className="theme_btn btn_fill text-center no_icon"
                              onClick={() => handleSaveClick("offBoardingDate")}
                            >
                              Save
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {tenantInfo && tenantInfo.offBoardingDate
                            ? formatDateToDDMMMYYYY(tenantInfo.offBoardingDate)
                            : "Add offboarding date"}
                          {!editingField && user && (user.role === "admin" || user.role === "superAdmin") && (
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
                  <div className="tcs_single status">
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
                              className="theme_btn btn_border text-center no_icon"
                              onClick={() => handleCancelClick("status")}
                              style={{ marginLeft: "10px" }}
                            >
                              Cancel
                            </span>
                            <span
                              className="theme_btn btn_fill text-center no_icon"
                              onClick={() => handleSaveClick("status")}
                            >
                              Save
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span
                            className={`text-capitalize ${tenantInfo && tenantInfo.status
                              }`}
                          >
                            {tenantInfo && tenantInfo.status}
                          </span>
                          {!editingField && user && (user.role === "admin" || user.role === "superAdmin") && (
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
                            placeholder="Email ID type here"
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="theme_btn btn_border text-center no_icon"
                              onClick={() => handleCancelClick("emailID")}
                              style={{ marginLeft: "10px" }}
                            >
                              Cancel
                            </span>
                            <span
                              className="theme_btn btn_fill text-center no_icon"
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
                          {!editingField && user && (user.role === "admin" || user.role === "superAdmin") && (
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
                            placeholder="Address type here"
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="theme_btn btn_border text-center no_icon"
                              onClick={() => handleCancelClick("address")}
                            >
                              Cancel
                            </span>
                            <span
                              className="theme_btn btn_fill text-center no_icon"
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
                          {!editingField && user && (user.role === "admin" || user.role === "superAdmin") && (
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
            <ImageModal
              show={showImageModal}
              handleClose={() => setShowImageModal(false)}
              imageUrl={selectedImageUrl}
              imageModalTitle={imageModalTitle} // Pass the dynamic title as a prop
            />
            <div className="theme_tab prop_doc_tab">
              <Tabs>
                <TabList className="tabs">
                  <Tab className="pointer">
                    Tenant KYC Document ({filteredTenantDocLength})
                  </Tab>
                  <Tab className="pointer">
                    Police Verification ({filteredPoliceVerificationDocLength})
                  </Tab>
                  <Tab className="pointer">
                    Rent Agreements ({filteredRentAgreementDocLength})
                  </Tab>
                </TabList>
                <TabPanel>
                  <div className="blog_sect">
                    <div className="row">
                      {filteredTenantDocLength === 0 && (
                        <h5 className="m20 text_red mt-4">No data found</h5>
                      )}
                      {filteredTenantDocuments.map((doc, index) => (
                        <div className="col-lg-4 col-sm-6 " key={index}>
                          <div className="item card-container">
                            <div
                              className="card-image relative w-100"
                              style={{
                                aspectRatio: "3/2",
                              }}
                            >
                              {uploadingDocId !== doc.id && (
                                <label
                                  htmlFor={`upload_img_${doc.id}`}
                                  className="upload_img click_text by_text"
                                >
                                  Upload PDF or Img
                                  <input
                                    type="file"
                                    onChange={(e) =>
                                      handleFileChange(e, doc.id)
                                    }
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
                                  <BeatLoader
                                    color={"#FF5733"}
                                    loading={true}
                                  />
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
                                  src={
                                    doc.documentUrl ||
                                    "/assets/img/image_small_placeholder.png"
                                  }
                                  alt="Document"
                                />
                              )}
                            </div>
                            <div className="card-body">
                              <h3>{doc.idType}</h3>
                              <p className="card-subtitle">{doc.idNumber}</p>
                              {user && user.role === "superAdmin" && (
                                <div className="card-author">
                                  <div
                                    onClick={() => deleteTenantDocument(doc.id)}
                                    className="learn-more pointer"
                                  >
                                    Delete
                                  </div>
                                </div>
                              )}
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
                        <div className="col-lg-4 col-sm-6 " key={index}>
                          <div className="item card-container">
                            <div
                              className="card-image relative w-100"
                              style={{
                                aspectRatio: "3/2",
                              }}
                            >
                              {uploadingDocId !== doc.id && (
                                <label
                                  htmlFor={`upload_img_${doc.id}`}
                                  className="upload_img click_text by_text"
                                >
                                  Upload PDF or Img
                                  <input
                                    type="file"
                                    onChange={(e) =>
                                      handleFileChange(e, doc.id)
                                    }
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
                                  <BeatLoader
                                    color={"#FF5733"}
                                    loading={true}
                                  />
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
                                  src={
                                    doc.documentUrl ||
                                    "/assets/img/image_small_placeholder.png"
                                  }
                                  alt="Document"
                                />
                              )}
                            </div>
                            <div className="card-body">
                              <h3>{doc.idType}</h3>
                              <p className="card-subtitle">{doc.idNumber}</p>
                              {user && user.role === "superAdmin" && (
                                <div className="card-author">
                                  <div
                                    onClick={() => deleteTenantDocument(doc.id)}
                                    className="learn-more pointer"
                                  >
                                    Delete
                                  </div>
                                </div>
                              )}
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
                        <div className="col-lg-4 col-sm-6 " key={index}>
                          <div className="item card-container">
                            <div
                              className="card-image relative w-100"
                              style={{
                                aspectRatio: "3/2",
                              }}
                            >
                              {uploadingDocId !== doc.id && (
                                <label
                                  htmlFor={`upload_img_${doc.id}`}
                                  className="upload_img click_text by_text"
                                >
                                  Upload PDF or Img
                                  <input
                                    type="file"
                                    onChange={(e) =>
                                      handleFileChange(e, doc.id)
                                    }
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
                                  <BeatLoader
                                    color={"#FF5733"}
                                    loading={true}
                                  />
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
                                  src={
                                    doc.documentUrl ||
                                    "/assets/img/image_small_placeholder.png"
                                  }
                                  alt="Document"
                                />
                              )}
                            </div>
                            <div className="card-body">
                              <h3>{doc.idType}</h3>
                              <p className="card-subtitle">{doc.idNumber}</p>
                              {user && user.role === "superAdmin" && (
                                <div className="card-author">
                                  <div
                                    onClick={() => deleteTenantDocument(doc.id)}
                                    className="learn-more pointer"
                                  >
                                    Delete
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </div>

            {!editingField && user && user.role === "superAdmin" && (
              <>
                <div className="vg22_m15"></div>
                <div className="divider"></div>
                <div className="vg10"></div>
                <div
                  onClick={() => handleShowModal("deleteTenant")}
                  className="delete_bottom"
                >
                  <span className="material-symbols-outlined">delete</span>
                  <span>Delete Tenant</span>
                </div>
                <div className="vg22_m15"></div>
              </>
            )}
            <SureDelete
              show={showModal}
              handleClose={handleCloseModal}
              handleDelete={handleDelete} // This will now handle different actions
              isDeleting={isDeleting}
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
                    className="product_edit_theme_btn btn_fill text-center no_icon"
                    onClick={() => handleSaveClick("idNumber")}
                  >
                    Save
                  </button>
                  <button
                    className="product_edit_theme_btn btn_fill text-center no_icon cancel-btn"
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
                {!editingField && user && (user.role === "admin" || user.role === "superAdmin") && (
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
                    className="product_edit_theme_btn btn_fill text-center no_icon"
                    onClick={() => handleSaveClick("rentStartDate")}
                  >
                    Save
                  </button>
                  <button
                    className="product_edit_theme_btn btn_fill text-center no_icon cancel-btn"
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
                {!editingField && user && (user.role === "admin" || user.role === "superAdmin") && (
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
                    className="product_edit_theme_btn btn_fill text-center no_icon"
                    onClick={() => handleSaveClick("rentEndDate")}
                  >
                    Save
                  </button>
                  <button
                    className="product_edit_theme_btn btn_fill text-center no_icon cancel-btn"
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
                {!editingField && user && (user.role === "admin" || user.role === "superAdmin") && (
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
