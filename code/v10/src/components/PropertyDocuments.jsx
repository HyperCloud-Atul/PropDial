import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCollection } from "../hooks/useCollection";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { projectFirestore, projectStorage } from "../firebase/config";
import { useFirestore } from "../hooks/useFirestore";

const PropertyDocuments = () => {
  const { propertyDocumentId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { updateDocument, deleteDocument, error } = useFirestore("docs");
  const { documents: propertyDocument, errors: propertyDocError } =
    useCollection("docs", ["propertyId", "==", propertyDocumentId]);

  const [showAIForm, setShowAIForm] = useState(false);
  const handleShowAIForm = () => setShowAIForm(!showAIForm);

  const [selectedIdType, setSelectedIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const handleRadioChange = (event) => setSelectedIdType(event.target.value);
  const handleIdNumberChange = (event) => setIdNumber(event.target.value);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  const getFileType = (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    return fileExtension === "pdf" ? "pdf" : "image";
  };

  const addPropertyDocuments = async () => {
    if (!selectedIdType || !idNumber || !documentFile) {
      alert("All fields are required!");
      return;
    }

    try {
      setIsUploading(true);
      const newProductRef = await projectFirestore.collection("docs").add({
        status: "",
        propertyId: propertyDocumentId,
        documentUrl: "",
        idType: selectedIdType,
        idNumber: idNumber,
        mediaType: "",
      });

      if (documentFile) {
        const newProductId = newProductRef.id;
        const storageRef = projectStorage.ref(`docs/${newProductId}`);
        const fileExtension = documentFile.name.split(".").pop();
        const fileType = getFileType(documentFile);
        const fileRef = storageRef.child(`document.${fileExtension}`);
        await fileRef.put(documentFile);
        const fileUrl = await fileRef.getDownloadURL();

        await newProductRef.update({
          documentUrl: fileUrl,
          mediaType: fileType,
        });
        setImageURL(fileUrl);
      }

      setSelectedIdType("");
      setIdNumber("");
      setDocumentFile(null);
      setImageURL("");
      setIsUploading(false);

      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error adding document:", error);
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
    <div style={{ marginTop: "100px" }}>
      {!showAIForm && (
        <div className="add_btn" onClick={handleShowAIForm}>
          <div className="add_btn_inner">
            <div className="add_icon">+</div>
            <div className="ab_text">Add new property document</div>
          </div>
        </div>
      )}
      {showAIForm && (
        <section className="property_card_single add_aditional_form">
          <div className="more_detail_card_inner relative">
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
                <div>
                  <div>
                    <input
                      type="file"
                      id="serviceimageInput"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
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
          </div>
        </section>
      )}

      {/* CODE FOR DOCUMENT CARD DESGIN */}
      <div style={{ margin: "50px" }}>
        {propertyDocument &&
          propertyDocument.map((doc, index) => (
            <Card key={index} sx={{ maxWidth: 345 }}>
              <div className="d-flex align-items-center justify-content-between p-2">
                <div>
                  <h5>{doc.idType}</h5>
                </div>
                <div>
                  <span
                    className="material-symbols-outlined"
                    style={{ cursor: "pointer" }}
                  >
                    download
                  </span>
                </div>
              </div>
              {doc.mediaType === "pdf" ? (
                <iframe
                  title="PDF Viewer"
                  src={doc.documentUrl}
                  style={{ width: "100%", height: "500px", border: "none" }}
                ></iframe>
              ) : (
                <CardMedia
                  component="img"
                  height="194"
                  image={doc.documentUrl || "https://via.placeholder.com/150"}
                />
              )}
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <h5>{doc.idType} Number :</h5>
                  {doc.idNumber}
                </Typography>
              </CardContent>
              <div onClick={() => deletePropertyDocument(doc.id)}>
                <span
                  className="material-symbols-outlined"
                  style={{ cursor: "pointer" }}
                >
                  delete
                </span>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default PropertyDocuments;
