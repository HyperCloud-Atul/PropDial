// ✅ Final component with preview, delete, edit, and storage clean-up
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import firebase from "firebase/app";
import { projectStorage, projectFirestore, timestamp } from "../firebase/config";

const AddTenantDocument = () => {
  const { tenantId } = useParams();
  const [docType, setDocType] = useState("");
  const [kycType, setKycType] = useState("");
  const [rentFileType, setRentFileType] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      const docRef = await projectFirestore.collection("tenants").doc(tenantId).get();
      const data = docRef.data();
      if (data?.documents) setDocuments(data.documents);
    };
    fetchDocs();
  }, [tenantId]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const isImage = selectedFile.type.startsWith("image/");

    if (docType === "rent") {
      if (
        (rentFileType === "pdf" && selectedFile.type !== "application/pdf") ||
        (rentFileType === "word" && !["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(selectedFile.type))
      ) {
        alert(`Only ${rentFileType.toUpperCase()} files allowed for Rent Agreement.`);
        setFile(null);
        return;
      }
    }

    if (isImage && (docType === "kyc" || docType === "police")) {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
      const compressedFile = await imageCompression(selectedFile, options);
      setFile(compressedFile);
      setFilePreview(URL.createObjectURL(compressedFile));
    } else {
      setFile(selectedFile);
      if (selectedFile.type === "application/pdf") setFilePreview("pdf");
      else setFilePreview(null);
    }
  };

  const deleteFromStorage = async (fileName) => {
    const ref = projectStorage.ref(`tenantDocs/${tenantId}/${fileName}`);
    try {
      await ref.delete();
    } catch (err) {
      console.error("Failed to delete from storage:", err);
    }
  };

  const handleDelete = async (index) => {
    const updatedDocs = [...documents];
    const removed = updatedDocs.splice(index, 1)[0];
    await deleteFromStorage(removed.fileName);
    await projectFirestore.collection("tenants").doc(tenantId).update({
      documents: updatedDocs,
    });
    setDocuments(updatedDocs);
  };

  const handleEdit = (index) => {
    const doc = documents[index];
    setDocType(doc.docType);
    setKycType(doc.kycType || "");
    setRentFileType(doc.rentFileType || "");
    setEditIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docType || (docType === "kyc" && !kycType) || (docType === "rent" && !rentFileType) || !file) {
      alert("Please complete all required fields and upload a file.");
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = projectStorage.ref(`tenantDocs/${tenantId}/${fileName}`);
      await storageRef.put(file);
      const downloadURL = await storageRef.getDownloadURL();

      const newDoc = {
        docType,
        createdAt: timestamp.now(),
        downloadURL,
        fileName,
        fileType: file.type,
        ...(docType === "kyc" && { kycType }),
        ...(docType === "rent" && { rentFileType }),
      };

      const updatedDocs = [...documents];

      if (editIndex !== null) {
        await deleteFromStorage(documents[editIndex].fileName);
        updatedDocs[editIndex] = newDoc;
      } else {
        updatedDocs.push(newDoc);
      }

      await projectFirestore.collection("tenants").doc(tenantId).update({
        documents: updatedDocs,
      });

      setDocuments(updatedDocs);
      setDocType("");
      setKycType("");
      setRentFileType("");
      setFile(null);
      setFilePreview(null);
      setEditIndex(null);
      alert("Document uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light mb-4">
        <h4>{editIndex !== null ? "Edit" : "Add"} Tenant Document</h4>

        <label>Document Type:</label>
        <select
          className="form-control mb-2"
          value={docType}
          onChange={(e) => {
            setDocType(e.target.value);
            setKycType("");
            setRentFileType("");
            setFile(null);
            setFilePreview(null);
          }}
        >
          <option value="">--Select--</option>
          <option value="kyc">KYC</option>
          <option value="police">Police Verification</option>
          <option value="rent">Rent Agreement</option>
        </select>

        {docType === "kyc" && (
          <>
            <label>KYC Type:</label>
            <select className="form-control mb-2" value={kycType} onChange={(e) => setKycType(e.target.value)}>
              <option value="">--Select--</option>
              <option value="aadhar">Aadhar</option>
              <option value="pan">PAN</option>
              <option value="passport">Passport</option>
            </select>
          </>
        )}

        {docType === "rent" && (
          <>
            <label>File Type:</label>
            <select className="form-control mb-2" value={rentFileType} onChange={(e) => setRentFileType(e.target.value)}>
              <option value="">--Select--</option>
              <option value="pdf">PDF</option>
              <option value="word">Word</option>
            </select>
          </>
        )}

        <input className="form-control mb-2" type="file" onChange={handleFileChange} />

        {filePreview === "pdf" ? (
          <embed
            src={URL.createObjectURL(file)}
            width="100%"
            height="200px"
            type="application/pdf"
          />
        ) : filePreview ? (
          <img
            src={filePreview}
            alt="Preview"
            style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }}
          />
        ) : null}

        <button className="btn btn-primary mt-3" type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : editIndex !== null ? "Update Document" : "Upload Document"}
        </button>
      </form>

      <div className="row">
        {documents.map((doc, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card h-100">
              {doc.fileType.startsWith("image/") ? (
                <img src={doc.downloadURL} alt={doc.fileName} className="card-img-top" style={{ maxHeight: "200px", objectFit: "contain" }} />
              ) : doc.fileType === "application/pdf" ? (
                <embed src={doc.downloadURL} width="100%" height="200px" type="application/pdf" />
              ) : (
                <div className="p-3">{doc.fileName}</div>
              )}
              <div className="card-body">
                <p><strong>Type:</strong> {doc.docType.toUpperCase()}</p>
                {doc.kycType && <p><strong>KYC:</strong> {doc.kycType}</p>}
                {doc.rentFileType && <p><strong>Rent File:</strong> {doc.rentFileType}</p>}
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(index)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddTenantDocument;
