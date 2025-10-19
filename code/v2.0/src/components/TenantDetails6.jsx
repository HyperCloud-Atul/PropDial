import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import firebase from "firebase/app";
import {
  projectStorage,
  projectFirestore,
  timestamp,
} from "../firebase/config";

const AddTenantDocument = () => {
  const { tenantId } = useParams();
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [rentPdfFile, setRentPdfFile] = useState(null);
  const [rentWordFile, setRentWordFile] = useState(null);
  const [kycType, setKycType] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      const docSnap = await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .get();
      if (docSnap.exists) {
        const data = docSnap.data();
        setDocuments(data.documents || []);
      }
    };
    fetchDocs();
  }, [tenantId]);

  // const handleFileChange = async (e) => {
  //   const selected = e.target.files[0];
  //   if (!selected) return;

  //   const isImage = selected.type.startsWith("image/");
  //   const isPdf = selected.type === "application/pdf";

  //   if (isImage) {
  //     const compressed = await imageCompression(selected, {
  //       maxSizeMB: 1,
  //       maxWidthOrHeight: 1024,
  //       useWebWorker: true,
  //     });
  //     setFile(compressed);
  //     setPreviewUrl(URL.createObjectURL(compressed));
  //   } else {
  //     setFile(selected);
  //     setPreviewUrl(URL.createObjectURL(selected));
  //   }
  // };

  const handleFileChange = async (e, type) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (docType === "rent") {
      if (type === "pdf" && selectedFile.type !== "application/pdf") {
        alert("Only PDF files allowed for Rent Agreement PDF.");
        return;
      }
      if (
        type === "word" &&
        ![
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(selectedFile.type)
      ) {
        alert("Only Word files allowed for Rent Agreement Word.");
        return;
      }

      if (type === "pdf") {
        setRentPdfFile(selectedFile);
      } else if (type === "word") {
        setRentWordFile(selectedFile);
      }
    } else {
      // Image compression for KYC or police verification
      const isImage = selectedFile.type.startsWith("image/");
      if (isImage) {
        const compressed = await imageCompression(selectedFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
        });
        setFile(compressed);
        setPreviewUrl(URL.createObjectURL(compressed));
      } else {
        setFile(selectedFile);
        setPreviewUrl(
          selectedFile.type === "application/pdf"
            ? URL.createObjectURL(selectedFile)
            : null
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!docType) {
      alert("Please select a document type.");
      return;
    }

    if (docType === "kyc" && !kycType) {
      alert("Please select a KYC type.");
      return;
    }

    if (docType === "rent") {
      if (!rentPdfFile || !rentWordFile) {
        alert("Please upload both PDF and Word files for Rent Agreement.");
        return;
      }
    } else {
      if (!file) {
        alert("Please upload a file.");
        return;
      }
    }

    setUploading(true);

    try {
      let newDoc = { docType, createdAt: timestamp.now() };
      const updatedDocs = [...documents];

      if (docType === "rent") {
        const pdfFileName = `${Date.now()}_RENT_PDF_${rentPdfFile.name}`;
        const wordFileName = `${Date.now()}_RENT_WORD_${rentWordFile.name}`;

        const pdfRef = projectStorage.ref(
          `tenantDocs/${tenantId}/${pdfFileName}`
        );
        const wordRef = projectStorage.ref(
          `tenantDocs/${tenantId}/${wordFileName}`
        );

        await pdfRef.put(rentPdfFile);
        await wordRef.put(rentWordFile);

        const pdfURL = await pdfRef.getDownloadURL();
        const wordURL = await wordRef.getDownloadURL();

        newDoc = {
          ...newDoc,
          rentPdf: {
            fileName: pdfFileName,
            fileType: rentPdfFile.type,
            downloadURL: pdfURL,
          },
          rentWord: {
            fileName: wordFileName,
            fileType: rentWordFile.type,
            downloadURL: wordURL,
          },
        };

        if (editingIndex !== null) {
          const prev = updatedDocs[editingIndex];
          // Delete previous rent files
          if (prev.rentPdf?.fileName) {
            await projectStorage
              .ref(`tenantDocs/${tenantId}/${prev.rentPdf.fileName}`)
              .delete();
          }
          if (prev.rentWord?.fileName) {
            await projectStorage
              .ref(`tenantDocs/${tenantId}/${prev.rentWord.fileName}`)
              .delete();
          }
          updatedDocs[editingIndex] = newDoc;
        } else {
          updatedDocs.push(newDoc);
        }
      } else {
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = projectStorage.ref(
          `tenantDocs/${tenantId}/${fileName}`
        );
        await storageRef.put(file);
        const downloadURL = await storageRef.getDownloadURL();

        newDoc = {
          ...newDoc,
          downloadURL,
          fileName,
          fileType: file.type,
          ...(docType === "kyc" && { kycType }),
        };

        if (editingIndex !== null) {
          const prev = updatedDocs[editingIndex];
          await projectStorage
            .ref(`tenantDocs/${tenantId}/${prev.fileName}`)
            .delete();
          updatedDocs[editingIndex] = newDoc;
        } else {
          updatedDocs.push(newDoc);
        }
      }

      await projectFirestore.collection("tenants").doc(tenantId).update({
        documents: updatedDocs,
      });

      setDocuments(updatedDocs);
      // Reset all states
      setFile(null);
      setRentPdfFile(null);
      setRentWordFile(null);
      setDocType("");
      setPreviewUrl(null);
      setEditingIndex(null);
      alert(editingIndex !== null ? "Document updated" : "Document uploaded");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (index) => {
    const docToDelete = documents[index];
    const updatedDocs = documents.filter((_, i) => i !== index);

    await projectStorage
      .ref(`tenantDocs/${tenantId}/${docToDelete.fileName}`)
      .delete();
    await projectFirestore.collection("tenants").doc(tenantId).update({
      documents: updatedDocs,
    });

    setDocuments(updatedDocs);
  };

  const handleEdit = (index) => {
    const doc = documents[index];
    setDocType(doc.docType);
    setEditingIndex(index);
    setFile(null);
    setRentPdfFile(null);
    setRentWordFile(null);
    setKycType(doc.kycType || "");

    if (doc.docType === "rent") {
      // Preview not shown directly but store URLs for preview later
      setPreviewUrl(null);
      setRentPdfFile({
        name: doc.rentPdf?.fileName,
        preview: doc.rentPdf?.downloadURL,
      });
      setRentWordFile({
        name: doc.rentWord?.fileName,
        preview: doc.rentWord?.downloadURL,
      });
    } else {
      setPreviewUrl(doc.downloadURL);
      setFile({ name: doc.fileName, type: doc.fileType });
    }
  };

  const renderPreview = () => {
    if (!previewUrl) return null;

    const isPdf =
      previewUrl.endsWith(".pdf") || file?.type === "application/pdf";
    const isImage =
      previewUrl.includes("image") || file?.type?.includes("image");

    if (isPdf) {
      return <embed src={previewUrl} width="100%" height="200px" />;
    } else if (isImage) {
      return (
        <img
          src={previewUrl}
          alt="Preview"
          style={{ width: "100%", maxHeight: "200px" }}
        />
      );
    } else {
      return (
        <a href={previewUrl} target="_blank" rel="noreferrer">
          View Document
        </a>
      );
    }
  };

  return (
    <div className="p-3 border bg-light">
      <h4>{editingIndex !== null ? "Edit" : "Upload"} Document</h4>
      <form onSubmit={handleSubmit}>
        <label>Document Type</label>
        <select
          className="form-control"
          value={docType}
          onChange={(e) => {
            setDocType(e.target.value);
            setFile(null);
            setRentPdfFile(null);
            setRentWordFile(null);
            setPreviewUrl(null);
            setKycType("");
          }}
        >
          <option value="">--Select--</option>
          <option value="kyc">KYC</option>
          <option value="police">Police Verification</option>
          <option value="rent">Rent Agreement</option>
        </select>
        {docType === "kyc" && (
          <>
            <label className="mt-3">KYC Type</label>
            <select
              className="form-control"
              value={kycType}
              onChange={(e) => setKycType(e.target.value)}
            >
              <option value="">--Select KYC Type--</option>
              <option value="aadhaar">Aadhaar Card</option>
              <option value="pan">PAN Card</option>
              <option value="voter">Voter ID</option>
              <option value="passport">Passport</option>
              <option value="driving">Driving License</option>
            </select>
          </>
        )}

        {docType === "rent" ? (
          <>
            <label className="mt-3">Upload Rent PDF (Required)</label>
            <input
              type="file"
              accept="application/pdf"
              className="form-control"
              onChange={(e) => handleFileChange(e, "pdf")}
            />
            {rentPdfFile?.preview && (
              <div className="mt-2">
                <embed src={rentPdfFile.preview} width="100%" height="200px" />
              </div>
            )}

            <label className="mt-3">Upload Rent Word File (Required)</label>
            <input
              type="file"
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="form-control"
              onChange={(e) => handleFileChange(e, "word")}
            />
            {rentWordFile?.preview && (
              <div className="mt-2">
                <a href={rentWordFile.preview} target="_blank" rel="noreferrer">
                  View Word File
                </a>
              </div>
            )}
          </>
        ) : (
          <>
            <label className="mt-3">Upload File</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => handleFileChange(e)}
              accept="image/*,application/pdf"
            />
            {previewUrl && <div className="mt-3">{renderPreview()}</div>}
          </>
        )}

        <button
          className="btn btn-primary mt-3"
          type="submit"
          disabled={uploading}
        >
          {uploading
            ? "Uploading..."
            : editingIndex !== null
            ? "Update Document"
            : "Upload Document"}
        </button>
      </form>

      <hr />

      <h5>Uploaded Documents</h5>
      <div className="row">
        {documents.map((doc, idx) => (
          <div className="col-md-4 mb-3" key={idx}>
            <div className="card p-2">
              {doc.docType === "rent" ? (
                <>
                  <p>
                    <strong>Rent PDF:</strong>{" "}
                    <a
                      href={doc.rentPdf?.downloadURL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View PDF
                    </a>
                  </p>
                  <p>
                    <strong>Rent Word:</strong>{" "}
                    <a
                      href={doc.rentWord?.downloadURL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Word
                    </a>
                  </p>
                </>
              ) : doc.fileType?.includes("image") ? (
                <img src={doc.downloadURL} alt="" className="img-fluid" />
              ) : doc.fileType === "application/pdf" ? (
                <embed src={doc.downloadURL} width="100%" height="150px" />
              ) : (
                <a href={doc.downloadURL} target="_blank" rel="noreferrer">
                  View Word Document
                </a>
              )}
              {doc.docType === "kyc" && doc.kycType && (
                <p>
                  <strong>KYC Type:</strong> {doc.kycType}
                </p>
              )}

              <p className="mt-2">
                <strong>Type:</strong> {doc.docType}
              </p>
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleEdit(idx)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(idx)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddTenantDocument;
