import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useCollection } from "../hooks/useCollection";
import { projectFirestore, projectStorage } from "../firebase/config";
import { useFirestore } from "../hooks/useFirestore";
import { useDocument } from "../hooks/useDocument";
import { BeatLoader } from "react-spinners";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./PropertyDocuments.scss";
import Switch from "@mui/material/Switch";
import QuickAccessMenu from "../pdpages/quickAccessMenu/QuickAccessMenu";
import { useAuthContext } from "../hooks/useAuthContext";
import ScrollToTop from "./ScrollToTop";
import PropertySummaryCard from "../pdpages/property/PropertySummaryCard";
const PropertyDocuments = () => {
  const { user } = useAuthContext();
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { addDocument, updateDocument, deleteDocument, error } =
    useFirestore("docs");
  const { documents: propertyDocument, errors: propertyDocError } =
    useCollection("docs", ["masterRefId", "==", propertyId]);
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties",
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
      setNewDocId(docRef.id);
    } catch (error) {
      console.error("Error adding document:", error);
      setIsUploading(false);
      setShowAIForm(!showAIForm)
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
        documentUrl: fileURL,
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

  // render jsx code in short form start
  const docCategories = [
    { id: "prop_doc", value: "Property Document", label: "Property Document" },
    {
      id: "prop_main",
      value: "Property Maintainance",
      label: "Property Maintainance",
    },
    { id: "utility_bill", value: "Utility Bills", label: "Utility Bills" },
    { id: "property_tax", value: "Property Tax", label: "Property Tax" },
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
    // "Property Maintainance": [
    //   { id: "main_doc", value: "Maintainance Document", label: "Maintainance Document" },
    // ],
    // "Utility Bills": [
    //   { id: "utility_doc", value: "Utility Bill Document", label: "Utility Bill Document" },
    // ],
    // "Property Tax": [
    //   { id: "property_tax_doc", value: "Property Tax Document", label: "Property Tax Document" },
    // ],
  };

  const docWhat = {
    "Property Maintainance": [
      { id: "pm_bill", value: "Bill", label: "Bill" },
      { id: "pm_receipt", value: "Receipt", label: "Receipt" },
    ],
    "Utility Bills": [
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

  // filter for property maintainance document start
  const filteredPropertyMaintainanceDocuments = propertyDocument
    ? propertyDocument.filter((doc) => doc.docCat === "Property Maintainance")
    : [];
  const filteredMaintainanceDocLength =
    filteredPropertyMaintainanceDocuments.length;
  // filter for propertymaintainance document end
  // filter for property utility document start
  const filteredPropertyUtilityDocuments = propertyDocument
    ? propertyDocument.filter((doc) => doc.docCat === "Utility Bills")
    : [];
  const filteredUtilityDocLength = filteredPropertyUtilityDocuments.length;
  // filter for property utility document end
  // filter for property utility document start
  const filteredPropertyPropertyTax = propertyDocument
    ? propertyDocument.filter((doc) => doc.docCat === "Property Tax")
    : [];
  const filteredPropertyTaxLength = filteredPropertyPropertyTax.length;
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

 

  return (
    <div className="top_header_pg pg_bg property_docs_pg">
     <ScrollToTop/>
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
              <span className="material-symbols-outlined">location_city</span>
            </Link>

            <Link to="" className="more-add-options-icons">
              <h1>Property Document</h1>
              <span className="material-symbols-outlined">holiday_village</span>
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
              <h2 className="text-center mb-4">OnePlace for Property Documents</h2>
              {/* <h6 className="text-center mt-1 mb-2">Your Central Hub for Viewing, Downloading, and Uploading Property Documents</h6> */}
              {!showAIForm && (
                <div className="theme_btn btn_fill no_icon text-center short_btn" onClick={handleShowAIForm}>
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
              <h2 className="card_title">Select any one document ID</h2>
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
                                <label htmlFor={radio.id}>{radio.label}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {docWhat[selectedDocCat] && (
                    <div className="col-12">
                      <div className="form_field">
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
                                <label htmlFor={radio.id}>{radio.label}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="col-12">
                    <div className="add_info_text">
                      <div className="form_field">
                        <div className="relative">
                          <input
                            type="text"
                            value={idNumber}
                            onChange={handleIdNumberChange}
                            placeholder="Document name (optional)"
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
                    className={`theme_btn btn_fill text-center no_icon ${isUploading ? "disabled" : ""
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
            <TabList className="tabs">
              <Tab className="pointer">
                Property Document ({filteredPropDocLength})
              </Tab>
              <Tab className="pointer">
                Maintainance Document ({filteredMaintainanceDocLength})
              </Tab>
              <Tab className="pointer">
                Utility Document ({filteredUtilityDocLength})
              </Tab>
              <Tab className="pointer">
                Property Tax ({filteredPropertyTaxLength})
              </Tab>
            </TabList>
            <TabPanel>
              <div className="blog_sect">
                <div className="row">
                  {filteredPropDocLength === 0 && (
                    <h5 className="m20 text_red mt-4">No data found</h5>
                  )}
                  {filteredPropertyDocuments.map((doc, index) => (
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
                                "https://via.placeholder.com/150"
                              }
                              alt="Document"
                            />
                          )}
                          {doc.documentUrl && (
                            <div className={`verified_batch ${doc.docVerified ? "review" : "verified"}`}>
                              <span>
                                {doc.docVerified ? "In Review" : "Verified"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="card-body">
                          <h3>{doc.idType}</h3>
                          <p className="card-subtitle">{doc.idNumber}</p>
                          {(user && user.role === "superAdmin") && (
                            <div className="d-flex justify-content-between w-100">
                              
                              <div className="card-author">
                                <div
                                  onClick={() => deletePropertyDocument(doc.id)}
                                  className="learn-more pointer"
                                >
                                  Delete
                                </div>
                              </div>
                              {doc.documentUrl && (
                                <div className="force_rotate">
                                  <Switch
                                    checked={checkedStates[doc.id] || false}
                                    onChange={(e) => handleToggleChange(e, doc.id)}
                                    inputProps={{ "aria-label": "controlled" }}
                                  />
                                </div>
                              )}
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
                  {filteredMaintainanceDocLength === 0 && (
                    <h5 className="m20 text_red mt-4">No data found</h5>
                  )}
                  {filteredPropertyMaintainanceDocuments.map((doc, index) => (
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
                                "https://via.placeholder.com/150"
                              }
                              alt="Document"
                            />
                          )}
                        </div>
                        <div className="card-body">
                          {/* <h3>{doc.idType}</h3> */}
                          <h3>Property Maintainance</h3>
                          <p className="card-subtitle">{doc.idNumber}</p>
                          {(user && user.role === "superAdmin") && (
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
            </TabPanel>
            <TabPanel>
              <div className="blog_sect">
                <div className="row">
                  {filteredUtilityDocLength === 0 && (
                    <h5 className="m20 text_red mt-4">No data found</h5>
                  )}
                  {filteredPropertyUtilityDocuments.map((doc, index) => (
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
                                "https://via.placeholder.com/150"
                              }
                              alt="Document"
                            />
                          )}
                        </div>
                        <div className="card-body">
                          {/* <h3>{doc.idType}</h3> */}
                          <h3>Utility Bills</h3>
                          <p className="card-subtitle">{doc.idNumber}</p>
                          {(user && user.role === "superAdmin") && (
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
            </TabPanel>
            <TabPanel>
              <div className="blog_sect">
                <div className="row">
                  {filteredPropertyTaxLength === 0 && (
                    <h5 className="m20 text_red mt-4">No data found</h5>
                  )}
                  {filteredPropertyPropertyTax.map((doc, index) => (
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
                                "https://via.placeholder.com/150"
                              }
                              alt="Document"
                            />
                          )}
                        </div>
                        <div className="card-body">
                          {/* <h3>{doc.idType}</h3> */}
                          <h3>Property Tax</h3>
                          <p className="card-subtitle">{doc.idNumber}</p>
                          {(user && user.role === "superAdmin") && (
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
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PropertyDocuments;
