import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useCollection } from "../hooks/useCollection";
import { projectFirestore, projectStorage } from "../firebase/config";
import { useFirestore } from "../hooks/useFirestore";

import "./PropertyDocuments.scss";

const PropertyDocuments = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  const { propertyDocumentId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { addDocument, updateDocument, deleteDocument, error } =
    useFirestore("docs");
  const { documents: propertyDocument, errors: propertyDocError } =
    useCollection("docs", ["propertyId", "==", propertyDocumentId]);

  const [showAIForm, setShowAIForm] = useState(false);
  const handleShowAIForm = () => setShowAIForm(!showAIForm);

  const [selectedIdType, setSelectedIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [newDocId, setNewDocId] = useState("");

  const handleRadioChange = (event) => setSelectedIdType(event.target.value);
  const handleIdNumberChange = (event) => setIdNumber(event.target.value);

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
    if (!selectedIdType || !idNumber) {
      alert("All fields are required!");
      return;
    }

    try {
      setIsUploading(true);
      const docRef = await addDocument({
        status: "",
        propertyId: propertyDocumentId,
        documentUrl: "",
        idType: selectedIdType,
        idNumber: idNumber,
        mediaType: "",
      });
      setSelectedIdType("");
      setIdNumber("");
      setIsUploading(false);
      setNewDocId(docRef.id);
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

  const uploadDocumentImage = async () => {
    try {
      setIsUploading(true);
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
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading document image:", error);
      setIsUploading(false);
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

  return (
    <div className="top_header_pg pg_bg property_docs_pg">
      <div className="page_spacing">
        <div className="pg_header d-flex align-items-center justify-content-between">
          <div className="left">
            <h2 className="m22 mb-1">Property Documents</h2>
            <h4 className="r16 light_black">
              Add new, show and download existing document{" "}
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
              <h2 className="card_title">Select any one document ID</h2>
              <div className="aai_form">
                <div className="row" style={{ rowGap: "18px" }}>
                  <div className="col-md-12">
                    <div className="form_field">
                      <div className="field_box theme_radio_new">
                        <div className="theme_radio_container">
                          <div className="radio_single">
                            <input
                              type="radio"
                              name="aai_type"
                              id="indexii"
                              value="Index II"
                              onChange={handleRadioChange}
                              checked={selectedIdType === "Index II"}
                            />
                            <label htmlFor="indexii">Index II</label>
                          </div>
                          <div className="radio_single">
                            <input
                              type="radio"
                              name="aai_type"
                              id="rentagreement"
                              value="Rent Agreement"
                              onChange={handleRadioChange}
                              checked={selectedIdType === "Rent Agreement"}
                            />
                            <label htmlFor="rentagreement">
                              Rent Agreement
                            </label>
                          </div>
                          <div className="radio_single">
                            <input
                              type="radio"
                              name="aai_type"
                              id="layout"
                              value="Layout"
                              onChange={handleRadioChange}
                              checked={selectedIdType === "Layout"}
                            />
                            <label htmlFor="layout">Layout</label>
                          </div>
                          <div className="radio_single">
                            <input
                              type="radio"
                              name="aai_type"
                              id="blueprint"
                              value="Blue Print"
                              onChange={handleRadioChange}
                              checked={selectedIdType === "Blue Print"}
                            />
                            <label htmlFor="blueprint">Blue Print</label>
                          </div>
                          <div className="radio_single">
                            <input
                              type="radio"
                              name="aai_type"
                              id="aadhar"
                              value="Aadhar"
                              onChange={handleRadioChange}
                              checked={selectedIdType === "Aadhar"}
                            />
                            <label htmlFor="aadhar">Aadhar</label>
                          </div>
                          <div className="radio_single">
                            <input
                              type="radio"
                              name="aai_type"
                              id="passport"
                              value="Passport"
                              onChange={handleRadioChange}
                              checked={selectedIdType === "Passport"}
                            />
                            <label htmlFor="passport">Passport</label>
                          </div>
                          <div className="radio_single">
                            <input
                              type="radio"
                              name="aai_type"
                              id="voterid"
                              value="Voter Id"
                              onChange={handleRadioChange}
                              checked={selectedIdType === "Voter Id"}
                            />
                            <label htmlFor="voterid">Voter Id</label>
                          </div>
                          <div className="radio_single">
                            <input
                              type="radio"
                              name="aai_type"
                              id="drivinglicense"
                              value="Driving Licence"
                              onChange={handleRadioChange}
                              checked={selectedIdType === "Driving Licence"}
                            />
                            <label htmlFor="drivinglicense">
                              Driving Licence
                            </label>
                          </div>
                          <div className="radio_single">
                            <input
                              type="radio"
                              name="aai_type"
                              id="pancard"
                              value="Pan Card"
                              onChange={handleRadioChange}
                              checked={selectedIdType === "Pan Card"}
                            />
                            <label htmlFor="pancard">Pan Card</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-11">
                    <div className="add_info_text">
                      <div className="form_field">
                        <div className="relative">
                          <input
                            type="text"
                            value={idNumber}
                            onChange={handleIdNumberChange}
                            placeholder="Enter Document Id"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-sm-1">
                  <div
                    className="theme_btn btn_border text-center"
                    onClick={isUploading ? null : handleShowAIForm}
                  >
                    Cancel
                  </div>
                </div>
                <div className="col-sm-3">
                  <div
                    className={`theme_btn btn_fill text-center ${
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
        <div className="blog_sect">
          <div className="row">
            {propertyDocument &&
              propertyDocument.map((doc, index) => (
                <div className="col-md-4">
                  <div className="item card-container" key={index}>
                    <div>
                      <div>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, doc.id)}
                          ref={fileInputRef}
                        />
                      </div>
                    </div>
                    <div className="card-image">
                      {doc.mediaType === "pdf" ? (
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
                            doc.documentUrl || "https://via.placeholder.com/150"
                          }
                        />
                      )}
                    </div>
                    <div className="card-body">
                      <h3>{doc.idType}</h3>
                      <p className="card-subtitle">{doc.idNumber}</p>
                      <div className="card-author">
                        <div
                          onClick={() => deletePropertyDocument(doc.id)}
                          className="learn-more pointer"
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDocuments;
