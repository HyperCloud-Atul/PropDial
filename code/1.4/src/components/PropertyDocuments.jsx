import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useCollection } from "../hooks/useCollection";
import { projectFirestore, projectStorage } from "../firebase/config";
import { useFirestore } from "../hooks/useFirestore";
import { format } from "date-fns";
import { useDocument } from "../hooks/useDocument";
import { BeatLoader } from "react-spinners";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./PropertyDocuments.scss";
import Switch from "@mui/material/Switch";
import QuickAccessMenu from "../pdpages/quickAccessMenu/QuickAccessMenu";
import { useAuthContext } from "../hooks/useAuthContext";
import ScrollToTop from "./ScrollToTop";
import InactiveUserCard from "./InactiveUserCard";
import PropertySummaryCard from "../pdpages/property/PropertySummaryCard";
import SureDelete from "../pdpages/sureDelete/SureDelete";
import PropertyDocumentTableOnly from "./PropertyDocumentTableOnly";
import PropertyDocumentTable from "./PropertyDocumentTable";
const PropertyDocuments = () => {
  const { user } = useAuthContext();
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { addDocument, updateDocument, deleteDocument, error } =
    useFirestore("docs-propdial");

  const { documents: propertyDocument, errors: propertyDocError } =
    useCollection(
      "docs-propdial",
      ["masterRefId", "==", propertyId],
      ["createdAt", "desc"]
    );

  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties-propdial",
    propertyId
  );
  const [showAIForm, setShowAIForm] = useState(false);
  const handleShowAIForm = () => setShowAIForm(!showAIForm);
  const [selectedDocCat, setSelectedDocCat] = useState("Property Document");
  const [selectedIdType, setSelectedIdType] = useState("");
  const [selectedDocWhat, setSelectedDocWhat] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [checkedStates, setCheckedStates] = useState({});
  const [newDocId, setNewDocId] = useState("");
  const [uploadingDocId, setUploadingDocId] = useState(null); // Track uploading document ID
  // const [checked, setChecked] = React.useState(true);
  const handleDocCatChange = (event) => setSelectedDocCat(event.target.value);
  const handleRadioChange = (event) => setSelectedIdType(event.target.value);
  const handleIdNumberChange = (event) => setIdNumber(event.target.value);
  const handleDocWhatChange = (event) => setSelectedDocWhat(event.target.value);
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

  const addPropertyDocuments = async () => {
    if ("") {
      alert("All fields are required!");
      return;
    }

    try {
      setIsUploading(true);
      const docRef = await addDocument({
        status: "active",
        masterRefId: propertyId,
        documentUrl: "",
        docCat: selectedDocCat,
        idType: selectedIdType,
        docWhat: selectedDocWhat,
        idNumber: idNumber,
        mediaType: "",
        docVerified: "false",
      });
      setSelectedDocCat("");
      setSelectedIdType("");
      setSelectedDocWhat("");
      setIdNumber("");
      setIsUploading(false);
      setShowAIForm(!showAIForm);
      setNewDocId(docRef.id);
    } catch (error) {
      console.error("Error adding document:", error);
      setIsUploading(false);
      setShowAIForm(!showAIForm);
    }
  };

  useEffect(() => {
    if (newDocId && documentFile) {
      uploadDocumentImage();
    }
  }, [newDocId, documentFile]);

  // Fetch initial document data and initialize checkedStates
  useEffect(() => {
    if (propertyDocument) {
      const initialCheckedStates = {};
      propertyDocument.forEach((doc) => {
        initialCheckedStates[doc.id] = doc && doc.docVerified;
      });
      setCheckedStates(initialCheckedStates);
    }
  }, [propertyDocument]);

  // old code of upload document without delete picture from storage 
  // (Don't delete this code) 
  // const uploadDocumentImage = async () => {
  //   try {
  //     setIsUploading(true);
  //     setUploadingDocId(newDocId);
  //     const fileType = getFileType(documentFile);
  //     const storageRef = projectStorage.ref(
  //       `docs-propdial/${newDocId}/${documentFile.name}`
  //     );
  //     await storageRef.put(documentFile);
  //     const fileURL = await storageRef.getDownloadURL();
  //     await updateDocument(newDocId, {
  //       documentUrl: fileURL,
  //       mediaType: fileType,
  //     });
  //     setDocumentFile(null);
  //     setIsUploading(false);
  //     setUploadingDocId(null);
  //     fileInputRef.current.value = "";
  //   } catch (error) {
  //     console.error("Error uploading document image:", error);
  //     setIsUploading(false);
  //     setUploadingDocId(null);
  //   }
  // };

  
// new code of upload document with delete picture from storage 
  const uploadDocumentImage = async () => {
    try {
      setIsUploading(true);
      setUploadingDocId(newDocId);
  
      // Check if there's an existing document for the newDocId
      const currentDoc = propertyDocument?.find((doc) => doc.id === newDocId);
      if (currentDoc?.documentUrl) {
        // Extract the file path from the URL to delete the existing file
        const oldFileRef = projectStorage.refFromURL(currentDoc.documentUrl);
        await oldFileRef.delete();
      }
  
      // Determine the file type
      const fileType = getFileType(documentFile);
  
      // Reference for the new file
      const storageRef = projectStorage.ref(
        `docs-propdial/${newDocId}/${documentFile.name}`
      );
  
      // Upload the new file
      await storageRef.put(documentFile);
  
      // Get the download URL of the new file
      const fileURL = await storageRef.getDownloadURL();
  
      // Update the document with the new file URL and media type
      await updateDocument(newDocId, {
        documentUrl: fileURL,
        mediaType: fileType,
      });
  
      // Reset states and clear the file input
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
  
  

  // code for delete document with popup start
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [isDeleting, setIsDeleting] = useState(false); // Deleting state
  const [selectedDocId, setSelectedDocId] = useState(null); // Document to delete

  const handleDeleteClick = (docId) => {
    console.log(`Preparing to delete document with ID: ${docId}`); // Debug log
    setSelectedDocId(docId); // Set the document ID for deletion
    setShowModal(true); // Open the modal
  };

  // old handle delete document code without delete image from storage 
  // (Don't delete this code) 
  // const handleDelete = async () => {
  //   if (!selectedDocId) {
  //     console.error("No document ID selected for deletion."); // Debug log
  //     return;
  //   }

  //   setIsDeleting(true); // Show loading state

  //   try {
  //     await deletePropertyDocument(selectedDocId); // Call your delete function
  //     console.log(`Document with ID ${selectedDocId} deleted successfully.`);
  //   } catch (error) {
  //     console.error("Error deleting document:", error);
  //   } finally {
  //     setIsDeleting(false); // Reset loading state
  //     setShowModal(false); // Close modal
  //     setSelectedDocId(null); // Reset selected document
  //   }
  // };

  // new code of handle delete document code with delete image from storage 
  const handleDelete = async () => {
    if (!selectedDocId) {
      console.error("No document ID selected for deletion."); // Debug log
      return;
    }
  
    setIsDeleting(true); // Show loading state
  
    try {
      // Fetch the document details to get the `documentUrl`
      const docRef = projectFirestore.collection("docs-propdial").doc(selectedDocId);
      const docSnapshot = await docRef.get();
  
      if (docSnapshot.exists) {
        const { documentUrl } = docSnapshot.data();
        if (documentUrl) {
          // Delete the file from Firebase Storage
          const fileRef = projectStorage.refFromURL(documentUrl);
          await fileRef.delete();
          console.log(`File at ${documentUrl} deleted successfully.`);
        }
      } else {
        console.error(`Document with ID ${selectedDocId} does not exist.`);
      }
  
      // Delete the Firestore document
      await deleteDocument(selectedDocId);
      console.log(`Document with ID ${selectedDocId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting document or its file:", error);
    } finally {
      setIsDeleting(false); // Reset loading state
      setShowModal(false); // Close modal
      setSelectedDocId(null); // Reset selected document
    }
  };

  const handleCloseModal = () => {
    console.log("Delete modal closed without confirmation."); // Debug log
    setShowModal(false); // Close modal without deletion
    setSelectedDocId(null); // Reset selected document
  };

  const deletePropertyDocument = async (docId) => {
    try {
      console.log(`Attempting to delete document with ID: ${docId}`); // Debug log
      await deleteDocument(docId); // Ensure `deleteDocument` is working as expected
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error; // Propagate error for handling in `handleDelete`
    }
  };
  // code for delete document with popup end

  // render jsx code in short form start

  const docCategories = [
    { id: "prop_doc", value: "Property Document", label: "Property Document" },
    {
      id: "prop_main",
      value: "Maintainance Document",
      label: "Maintainance Document",
    },
    {
      id: "utility_bill",
      value: "Utility Document",
      label: "Utility Document",
    },
    { id: "property_tax", value: "Property Tax", label: "Property Tax" },
    {
      id: "approved_rent_agreement",
      value: "Approved Rent Agreement",
      label: "Approved Rent Agreement",
    },
  ];

  const docTypes = {
    "Property Document": [
      { id: "indexii", value: "Index II", label: "Index II" },
      { id: "rentagreement", value: "Rent Agreement", label: "Rent Agreement" },
      { id: "layout", value: "Layout", label: "Layout" },
      { id: "blueprint", value: "Blue Print", label: "Blue Print" },
      {
        id: "powerofattorney",
        value: "Power of Attorney",
        label: "Power of Attorney",
      },
    ],
  };

  const docWhat = {
    "Maintainance Document": [
      { id: "pm_bill", value: "Bill", label: "Bill" },
      { id: "pm_receipt", value: "Receipt", label: "Receipt" },
    ],
    "Utility Document": [
      { id: "ub_bill", value: "Bill", label: "Bill" },
      { id: "ub_receipt", value: "Receipt", label: "Receipt" },
    ],
    "Property Tax": [
      { id: "pt_bill", value: "Bill", label: "Bill" },
      { id: "pt_receipt", value: "Receipt", label: "Receipt" },
    ],
  };
  // render jsx code in short form end

  // filters start
  // filter for property document start
  const filteredPropertyDocuments = propertyDocument
    ? propertyDocument.filter((doc) => doc.docCat === "Property Document")
    : [];
  const filteredPropDocLength = filteredPropertyDocuments.length;
  // filter for property document end

  // filter for Maintainance Document document start
  const filteredPropertyMaintainanceDocuments = propertyDocument
    ? propertyDocument.filter((doc) => doc.docCat === "Maintainance Document")
    : [];
  const filteredMaintainanceDocLength =
    filteredPropertyMaintainanceDocuments.length;
  // filter for Maintainance Document document end
  // filter for property utility document start
  const filteredPropertyUtilityDocuments = propertyDocument
    ? propertyDocument.filter((doc) => doc.docCat === "Utility Document")
    : [];
  const filteredUtilityDocLength = filteredPropertyUtilityDocuments.length;
  // filter for property utility document end
  // filter for property utility document start
  const filteredPropertyPropertyTax = propertyDocument
    ? propertyDocument.filter((doc) => doc.docCat === "Property Tax")
    : [];
  const filteredPropertyTaxLength = filteredPropertyPropertyTax.length;
  // filter for property utility document end

  // filter for property utility document start
  const filteredPropertyApprovedRentAgreement = propertyDocument
    ? propertyDocument.filter((doc) => doc.docCat === "Approved Rent Agreement")
    : [];
  const filteredApprovedRentAgreementLength =
    filteredPropertyApprovedRentAgreement.length;
  // filter for property utility document end

  // filters end

  const handleToggleChange = async (event, id) => {
    const newCheckedState = event.target.checked;
    setCheckedStates((prevStates) => ({
      ...prevStates,
      [id]: newCheckedState,
    }));

    try {
      await updateDocument(id, {
        docVerified: newCheckedState,
      });
    } catch (error) {
      console.error("Error updating document state:", error);
    }
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

  // data of quick access menu  start
  const menuItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: "/assets/img/icons/qa_dashboard.png",
    },
    {
      name: "Property",
      link: "/propertydetails/" + propertyId,
      icon: "/assets/img/icons/qa_property.png",
    },
  ];
  // data of quick access menu  end

  // code for get created by user start
  const { documents: dbUsers, error: dbuserserror } = useCollection(
    "users-propdial",
    ["status", "==", "active"]
  );
  const [dbUserState, setdbUserState] = useState(dbUsers);
  useEffect(() => {
    setdbUserState(dbUsers);
  });
  // code for get created by user end

  // view mode control start
  const [viewMode, setViewMode] = useState("card_view");

  const handleModeChange = (newViewMode) => {
    setViewMode(newViewMode);
  };
  // view mode control end

  return (
    <>
      {user && user.status === "active" ? (
        <div className="top_header_pg pg_bg property_docs_pg">
          <ScrollToTop />
          <div className="page_spacing pg_min_height">
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
                  <span className="material-symbols-outlined">
                    location_city
                  </span>
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
            {/* <QuickAccessMenu menuItems={menuItems} /> */}

            <div className="row row_reverse_991">
              <div className="col-lg-6">
                <div className="title_card mobile_full_575 mobile_gap h-100">
                  <h2 className="text-center mb-4">
                    OnePlace for Property Documents
                  </h2>
                  {/* <h6 className="text-center mt-1 mb-2">Your Central Hub for Viewing, Downloading, and Uploading Property Documents</h6> */}
                  {user &&
                    (user.role === "admin" || user.role === "superAdmin") &&
                    !showAIForm && (
                      <div
                        className="theme_btn btn_fill no_icon text-center short_btn"
                        onClick={handleShowAIForm}
                      >
                        Add New Document
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
                <section className="my_big_card add_doc_form">
                  {/* <h2 className="card_title">Select any one document ID</h2> */}
                  <div className="aai_form">
                    <div className="row" style={{ rowGap: "18px" }}>
                      <div className="col-12">
                        <div
                          className="form_field"
                          style={{
                            padding: "10px",
                            border: "1px solid rgb(3 70 135 / 22%)",
                            borderRadius: "5px",
                          }}
                        >
                          <h6
                            style={{
                              color: "var(--theme-blue)",
                              fontSize: "15px",
                              fontWeight: "500",
                              marginBottom: "8px",
                            }}
                          >
                            Select Document Category
                          </h6>
                          <div className="field_box theme_radio_new">
                            {/* tab_type_radio */}
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
                          <div
                            className="form_field"
                            style={{
                              padding: "10px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                              borderRadius: "5px",
                            }}
                          >
                            <h6
                              style={{
                                color: "var(--theme-blue)",
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                              }}
                            >
                              Select Document Type
                            </h6>
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
                      {docWhat[selectedDocCat] && (
                        <div className="col-12">
                          <div
                            className="form_field"
                            style={{
                              padding: "10px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                              borderRadius: "5px",
                            }}
                          >
                            <h6
                              style={{
                                color: "var(--theme-blue)",
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                              }}
                            >
                              Select Document Type*
                            </h6>
                            <div className="field_box theme_radio_new">
                              <div className="theme_radio_container">
                                {docWhat[selectedDocCat].map((radio) => (
                                  <div className="radio_single" key={radio.id}>
                                    <input
                                      type="radio"
                                      name="doc_what"
                                      id={radio.id}
                                      value={radio.value}
                                      onChange={handleDocWhatChange}
                                      checked={selectedDocWhat === radio.value}
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
                      {selectedDocCat !== "Property Document" && (
                        <div className="col-md-5 col-12">
                          <div
                            className="add_info_text w-100"
                            style={{
                              padding: "10px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                              borderRadius: "5px",
                            }}
                          >
                            <h6
                              style={{
                                color: "var(--theme-blue)",
                                fontSize: "15px",
                                fontWeight: "500",
                              }}
                            >
                              Document Name*
                            </h6>
                            <div className="form_field w-100">
                              <div className="relative w-100">
                                <input
                                  type="text"
                                  value={idNumber}
                                  onChange={handleIdNumberChange}
                                  placeholder="Write here"
                                  className="w-100"
                                  style={{
                                    borderLeft: "none",
                                    borderRight: "none",
                                    borderTop: "none",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
                        onClick={isUploading ? null : addPropertyDocuments}
                      >
                        {isUploading ? "Uploading..." : "Save"}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
            <div className="theme_tab prop_doc_tab">
              <Tabs>
                <div className="tab_and_mode">
                  <TabList className="tabs">
                    <Tab className="pointer">
                      Property Documents ({filteredPropDocLength})
                    </Tab>
                    <Tab className="pointer">
                      Maintainance Documents ({filteredMaintainanceDocLength})
                    </Tab>
                    <Tab className="pointer">
                      Utility Documents ({filteredUtilityDocLength})
                    </Tab>
                    <Tab className="pointer">
                      Property Tax ({filteredPropertyTaxLength})
                    </Tab>
                    <Tab className="pointer">
                      Approved Rent Agreements (
                      {filteredApprovedRentAgreementLength})
                    </Tab>
                  </TabList>
                  <div className="filters">
                    <div className="button_filter diff_views">
                      <div
                        className={`bf_single ${
                          viewMode === "card_view" ? "active" : ""
                        }`}
                        onClick={() => handleModeChange("card_view")}
                      >
                        <span className="material-symbols-outlined">
                          calendar_view_month
                        </span>
                      </div>
                      <div
                        className={`bf_single ${
                          viewMode === "table_view" ? "active" : ""
                        }`}
                        onClick={() => handleModeChange("table_view")}
                      >
                        <span className="material-symbols-outlined">
                          view_list
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <TabPanel>
                  {filteredPropDocLength === 0 && (
                    <h5 className="m20 text_red mt-4">No data found</h5>
                  )}
                  {viewMode === "card_view" && (
                    <div className="blog_sect">
                      <div className="row">
                        {filteredPropertyDocuments.map((doc, index) => (
                          <div className="col-xl-4 col-md-6" key={index}>
                            <div
                              className="item card-container relative"
                              style={{
                                overflow: "inherit",
                              }}
                            >
                              <div className="card-image relative">
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
                                {doc.documentUrl && (
                                  <div
                                    className={`verified_batch ${
                                      doc.docVerified ? "review" : "verified"
                                    }`}
                                  >
                                    <span>
                                      {doc.docVerified
                                        ? "In Review"
                                        : "Verified"}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="card-body">
                                <h3
                                  className="d-flex justify-content-center"
                                  style={{
                                    gap: "5px",
                                  }}
                                >
                                  {doc.idType}
                                  {user &&
                                    (user.role === "admin" ||
                                      user.role === "superAdmin") && (
                                      <div className="verify_toggle">
                                        {doc.documentUrl && (
                                          <div className="force_rotate">
                                            <Switch
                                              checked={
                                                checkedStates[doc.id] || false
                                              }
                                              onChange={(e) =>
                                                handleToggleChange(e, doc.id)
                                              }
                                              inputProps={{
                                                "aria-label": "controlled",
                                              }}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </h3>
                                <div className="added_by">
                                  <div>
                                    <h6>Added at</h6>
                                    <h5>
                                      {format(
                                        doc.createdAt.toDate(),
                                        "dd-MMM-yyyy"
                                      )}
                                    </h5>
                                  </div>
                                  <div>
                                    <h6>Added By</h6>
                                    <h5>
                                      {dbUserState &&
                                        dbUserState.find(
                                          (user) => user.id === doc.createdBy
                                        )?.fullName}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                              {user && user.role === "superAdmin" && (
                                <span
                                  class="material-symbols-outlined delete_icon_top"
                                  onClick={() => handleDeleteClick(doc.id)}
                                >
                                  delete_forever
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {viewMode === "table_view" && (
                    filteredPropDocLength !== 0 &&
                    <>{filteredPropertyDocuments && <PropertyDocumentTableOnly filterDoc={filteredPropertyDocuments} dbUserState={dbUserState} />}</>
                    // <h5 className="text-center text_green">Coming Soon....</h5>
                  )}
                </TabPanel>
                <TabPanel>
                  {filteredMaintainanceDocLength === 0 && (
                    <h5 className="m20 text_red mt-4">No data found</h5>
                  )}
                  {viewMode === "card_view" && (
                   <div className="blog_sect">
                   <div className="row">
                     {filteredMaintainanceDocLength === 0 && (
                       <h5 className="m20 text_red mt-4">No data found</h5>
                     )}
                     {filteredPropertyMaintainanceDocuments.map(
                       (doc, index) => (
                         <div className="col-xl-4 col-md-6" key={index}>
                           <div
                             className="item card-container relative"
                             style={{
                               overflow: "inherit",
                             }}
                           >
                             <div className="card-image relative">
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
                               <h3 className="text-center">{doc.idNumber}                                
                               <span style={{
                                fontSize:"14px",
                                fontWeight:"400"
                               }}>({doc.docWhat})</span>
                                
                               </h3>
                               <div className="added_by">
                                 <div>
                                   <h6>Added at</h6>
                                   <h5>
                                     {format(
                                       doc.createdAt.toDate(),
                                       "dd-MMM-yyyy"
                                     )}
                                   </h5>
                                 </div>
                                 <div>
                                   <h6>Added By</h6>
                                   <h5>
                                     {dbUserState &&
                                       dbUserState.find(
                                         (user) => user.id === doc.createdBy
                                       )?.fullName}
                                   </h5>
                                 </div>
                               </div>
                             </div>
                             {user && user.role === "superAdmin" && (
                               <span
                                 class="material-symbols-outlined delete_icon_top"
                                 onClick={() => handleDeleteClick(doc.id)}
                               >
                                 delete_forever
                               </span>
                             )}
                           </div>
                         </div>
                       )
                     )}
                   </div>
                 </div>
                  )}
                  {viewMode === "table_view" && (
                    filteredMaintainanceDocLength !== 0 &&
                    <>{filteredPropertyMaintainanceDocuments && <PropertyDocumentTable filterDoc={filteredPropertyMaintainanceDocuments} dbUserState={dbUserState} />}</>
                    // <h5 className="text-center text_green">Coming Soon....</h5>
                  )}
                </TabPanel>
                <TabPanel>
                  {filteredUtilityDocLength === 0 && (
                    <h5 className="m20 text_red mt-4">No data found</h5>
                  )}
                  {viewMode === "card_view" && (
                 <div className="blog_sect">
                 <div className="row">                
                   {filteredPropertyUtilityDocuments.map((doc, index) => (
                     <div className="col-xl-4 col-md-6" key={index}>
                       <div
                         className="item card-container relative"
                         style={{
                           overflow: "inherit",
                         }}
                       >
                         <div className="card-image relative">
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
                           <h3 className="text-center">{doc.idNumber}</h3>
                           <div className="added_by">
                             <div>
                               <h6>Added at</h6>
                               <h5>
                                 {format(
                                   doc.createdAt.toDate(),
                                   "dd-MMM-yyyy"
                                 )}
                               </h5>
                             </div>
                             <div>
                               <h6>Added By</h6>
                               <h5>
                                 {dbUserState &&
                                   dbUserState.find(
                                     (user) => user.id === doc.createdBy
                                   )?.fullName}
                               </h5>
                             </div>
                           </div>
                         </div>
                         {user && user.role === "superAdmin" && (
                           <span
                             class="material-symbols-outlined delete_icon_top"
                             onClick={() => handleDeleteClick(doc.id)}
                           >
                             delete_forever
                           </span>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
                  )}
                  {viewMode === "table_view" && (
                    filteredUtilityDocLength !== 0 &&
                    <>{filteredPropertyUtilityDocuments && <PropertyDocumentTable filterDoc={filteredPropertyUtilityDocuments} dbUserState={dbUserState} />}</>
                    // <h5 className="text-center text_green">Coming Soon....</h5>
                  )}
                </TabPanel>
                <TabPanel>
                  {filteredPropertyTaxLength === 0 && (
                    <h5 className="m20 text_red mt-4">No data found</h5>
                  )}
                  {viewMode === "card_view" && (
                <div className="blog_sect">
                <div className="row">               
                  {filteredPropertyPropertyTax.map((doc, index) => (
                    <div className="col-xl-4 col-md-6" key={index}>
                      <div
                        className="item card-container relative"
                        style={{
                          overflow: "inherit",
                        }}
                      >
                        <div className="card-image relative">
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
                          <h3 className="text-center">{doc.idNumber}</h3>
                          <div className="added_by">
                            <div>
                              <h6>Added at</h6>
                              <h5>
                                {format(
                                  doc.createdAt.toDate(),
                                  "dd-MMM-yyyy"
                                )}
                              </h5>
                            </div>
                            <div>
                              <h6>Added By</h6>
                              <h5>
                                {dbUserState &&
                                  dbUserState.find(
                                    (user) => user.id === doc.createdBy
                                  )?.fullName}
                              </h5>
                            </div>
                          </div>
                        </div>
                        {user && user.role === "superAdmin" && (
                          <span
                            class="material-symbols-outlined delete_icon_top"
                            onClick={() => handleDeleteClick(doc.id)}
                          >
                            delete_forever
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
                  )}
                  {viewMode === "table_view" && (
                    filteredPropertyTaxLength !== 0 &&
                    <>{filteredPropertyPropertyTax && <PropertyDocumentTable filterDoc={filteredPropertyPropertyTax} dbUserState={dbUserState} />}</>
                    // <h5 className="text-center text_green">Coming Soon....</h5>
                  )}
                </TabPanel>              
                <TabPanel>
                  {filteredApprovedRentAgreementLength === 0 && (
                    <h5 className="m20 text_red mt-4">No data found</h5>
                  )}
                  {viewMode === "card_view" && (
            <div className="blog_sect">
            <div className="row">
           
              {filteredPropertyApprovedRentAgreement.map(
                (doc, index) => (
                  <div className="col-xl-4 col-md-6" key={index}>
                    <div
                      className="item card-container relative"
                      style={{
                        overflow: "inherit",
                      }}
                    >
                      <div className="card-image relative">
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
                        <h3 className="text-center">{doc.idNumber}</h3>
                        <div className="added_by">
                          <div>
                            <h6>Added at</h6>
                            <h5>
                              {format(
                                doc.createdAt.toDate(),
                                "dd-MMM-yyyy"
                              )}
                            </h5>
                          </div>
                          <div>
                            <h6>Added By</h6>
                            <h5>
                              {dbUserState &&
                                dbUserState.find(
                                  (user) => user.id === doc.createdBy
                                )?.fullName}
                            </h5>
                          </div>
                        </div>
                      </div>
                      {user && user.role === "superAdmin" && (
                        <span
                          class="material-symbols-outlined delete_icon_top"
                          onClick={() => handleDeleteClick(doc.id)}
                        >
                          delete_forever
                        </span>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
                  )}
                  {viewMode === "table_view" && (
                    filteredApprovedRentAgreementLength !== 0 &&
                    <>{filteredPropertyApprovedRentAgreement && <PropertyDocumentTable filterDoc={filteredPropertyApprovedRentAgreement} dbUserState={dbUserState} />}</>
                    // <h5 className="text-center text_green">Coming Soon....</h5>
                  )}
                </TabPanel>  

           
              </Tabs>
            </div>
          </div>
          <SureDelete
            show={showModal} // Modal visibility
            handleClose={handleCloseModal} // Close modal handler
            handleDelete={handleDelete} // Confirm delete handler
            isDeleting={isDeleting} // Loading state for delete action
          />
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </>
  );
};

export default PropertyDocuments;
