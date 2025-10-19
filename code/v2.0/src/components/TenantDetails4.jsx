// React + Firebase Document Manager with Edit, Delete, Previews, and Tabs
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import firebase from "firebase/app";
import { projectStorage, projectFirestore, timestamp } from "../firebase/config";

const TenantDetails = () => {
  const { tenantId } = useParams();
  const [docType, setDocType] = useState("");
  const [kycType, setKycType] = useState("");
  const [rentFileType, setRentFileType] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("kyc");

  const fetchDocuments = async () => {
    const doc = await projectFirestore.collection("tenants").doc(tenantId).get();
    const data = doc.data();
    setDocuments(data.documents || []);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const isImage = selectedFile.type.startsWith("image/");

    if (docType === "rent") {
      if (
        (rentFileType === "pdf" && selectedFile.type !== "application/pdf") ||
        (rentFileType === "word" &&
          !["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(selectedFile.type))
      ) {
        alert(`Only ${rentFileType.toUpperCase()} files allowed for Rent Agreement.`);
        setFile(null);
        return;
      }
    }

    if (isImage && (docType === "kyc" || docType === "police")) {
      const compressed = await imageCompression(selectedFile, { maxSizeMB: 1, maxWidthOrHeight: 1024 });
      setFile(compressed);
      setFilePreview(URL.createObjectURL(compressed));
    } else {
      setFile(selectedFile);
      setFilePreview(selectedFile.type === "application/pdf" ? URL.createObjectURL(selectedFile) : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docType || (docType === "kyc" && !kycType) || (docType === "rent" && !rentFileType)) return alert("Fill all fields");
    if (!file) return alert("Please upload a file");

    setUploading(true);
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

    const docRef = projectFirestore.collection("tenants").doc(tenantId);
    const docSnap = await docRef.get();
    const currentDocs = docSnap.data().documents || [];

    if (editIndex !== null) {
      const oldDoc = currentDocs[editIndex];
      const oldRef = projectStorage.ref(`tenantDocs/${tenantId}/${oldDoc.fileName}`);
      await oldRef.delete();
      currentDocs[editIndex] = newDoc;
    } else {
      currentDocs.push(newDoc);
    }

    await docRef.update({ documents: currentDocs });
    alert(editIndex !== null ? "Document updated" : "Document added");

    setDocType("");
    setKycType("");
    setRentFileType("");
    setFile(null);
    setFilePreview(null);
    setEditIndex(null);
    fetchDocuments();
    setUploading(false);
  };

  const handleEdit = (doc, index) => {
    setDocType(doc.docType);
    setKycType(doc.kycType || "");
    setRentFileType(doc.rentFileType || "");
    setEditIndex(index);
    setFilePreview(
      doc.fileType.startsWith("image/") || doc.fileType === "application/pdf"
        ? doc.downloadURL
        : doc.fileType.includes("word")
        ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(doc.downloadURL)}`
        : null
    );
  };

  const handleDelete = async (index) => {
    const doc = documents[index];
    const storageRef = projectStorage.ref(`tenantDocs/${tenantId}/${doc.fileName}`);
    await storageRef.delete();

    const updatedDocs = [...documents];
    updatedDocs.splice(index, 1);
    await projectFirestore.collection("tenants").doc(tenantId).update({ documents: updatedDocs });
    fetchDocuments();
  };

  const renderPreview = () => {
    if (!filePreview) return null;
    if (filePreview.endsWith(".pdf") || file?.type === "application/pdf") {
      return (
        <iframe
          src={filePreview}
          title="PDF Preview"
          width="100%"
          height="300px"
        ></iframe>
      );
    } else if (filePreview.includes("view.officeapps.live.com")) {
      return <iframe src={filePreview} title="Word Preview" width="100%" height="300px"></iframe>;
    } else {
      return <img src={filePreview} alt="Preview" style={{ maxHeight: 200, objectFit: "contain" }} />;
    }
  };

  const filterByTab = documents.filter((d) => d.docType === activeTab);

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="border rounded bg-light p-3">
        <h4>Add/Edit Tenant Document</h4>
        <select value={docType} onChange={(e) => { setDocType(e.target.value); setKycType(""); setRentFileType(""); setFile(null); setFilePreview(null); }} className="form-control my-2">
          <option value="">--Select Document Type--</option>
          <option value="kyc">KYC</option>
          <option value="police">Police Verification</option>
          <option value="rent">Rent Agreement</option>
        </select>

        {docType === "kyc" && (
          <select value={kycType} onChange={(e) => setKycType(e.target.value)} className="form-control my-2">
            <option value="">--Select KYC Type--</option>
            <option value="aadhar">Aadhar</option>
            <option value="pan">PAN</option>
            <option value="passport">Passport</option>
          </select>
        )}

        {docType === "rent" && (
          <select value={rentFileType} onChange={(e) => setRentFileType(e.target.value)} className="form-control my-2">
            <option value="">--Select File Type--</option>
            <option value="pdf">PDF</option>
            <option value="word">Word</option>
          </select>
        )}

        <input type="file" onChange={handleFileChange} className="form-control my-2" />
        {renderPreview()}
        <button className="btn btn-primary mt-3" disabled={uploading}>{uploading ? "Uploading..." : editIndex !== null ? "Update Document" : "Upload Document"}</button>
      </form>

      <div className="mt-5">
        <h5>Documents</h5>
        <div className="btn-group mb-3">
          {['kyc', 'police', 'rent'].map(type => (
            <button key={type} className={`btn btn-${activeTab === type ? "primary" : "outline-primary"}`} onClick={() => setActiveTab(type)}>
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {filterByTab.map((doc, i) => (
          <div key={i} className="card p-2 mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{doc.fileName}</strong>
                <div>{doc.fileType}</div>
                <a href={doc.downloadURL} target="_blank" rel="noreferrer">View</a>
              </div>
              <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(doc, documents.indexOf(doc))}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(documents.indexOf(doc))}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TenantDetails;
