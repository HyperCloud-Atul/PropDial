import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import firebase from "firebase/app";
import { projectStorage, projectFirestore, timestamp } from "../firebase/config";

const AddTenantDocument = () => {
  
  const { tenantId } = useParams();
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      const docSnap = await projectFirestore.collection("tenants").doc(tenantId).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        setDocuments(data.documents || []);
      }
    };
    fetchDocs();
  }, [tenantId]);

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const isImage = selected.type.startsWith("image/");
    const isPdf = selected.type === "application/pdf";

    if (isImage) {
      const compressed = await imageCompression(selected, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });
      setFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
    } else {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docType || !file) {
      alert("Fill all required fields");
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
        downloadURL,
        fileName,
        fileType: file.type,
        createdAt: timestamp.now(),
      };

      let updatedDocs = [...documents];
      if (editingIndex !== null) {
        // Delete previous from storage
        const prev = updatedDocs[editingIndex];
        await projectStorage.ref(`tenantDocs/${tenantId}/${prev.fileName}`).delete();
        updatedDocs[editingIndex] = newDoc;
      } else {
        updatedDocs.push(newDoc);
      }

      await projectFirestore.collection("tenants").doc(tenantId).update({
        documents: updatedDocs,
      });

      setDocuments(updatedDocs);
      setFile(null);
      setDocType("");
      setPreviewUrl(null);
      setEditingIndex(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (index) => {
    const docToDelete = documents[index];
    const updatedDocs = documents.filter((_, i) => i !== index);

    await projectStorage.ref(`tenantDocs/${tenantId}/${docToDelete.fileName}`).delete();
    await projectFirestore.collection("tenants").doc(tenantId).update({
      documents: updatedDocs,
    });

    setDocuments(updatedDocs);
  };

  const handleEdit = (index) => {
    const doc = documents[index];
    setDocType(doc.docType);
    setPreviewUrl(doc.downloadURL);
    setEditingIndex(index);
  };

  const renderPreview = () => {
    if (!previewUrl) return null;

    if (file?.type === "application/pdf" || previewUrl.endsWith(".pdf")) {
      return <embed src={previewUrl} width="100%" height="200px" />;
    } else if (file?.type?.includes("image") || previewUrl.includes("image")) {
      return <img src={previewUrl} alt="Preview" style={{ width: "100%", maxHeight: "200px" }} />;
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
        <select className="form-control" value={docType} onChange={(e) => setDocType(e.target.value)}>
          <option value="">--Select--</option>
          <option value="kyc">KYC</option>
          <option value="police">Police</option>
          <option value="rent">Rent Agreement</option>
        </select>

        <label className="mt-3">Choose File</label>
        <input type="file" onChange={handleFileChange} />

        <div className="mt-3">{renderPreview()}</div>

        <button className="btn btn-primary mt-3" type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : editingIndex !== null ? "Update Document" : "Upload Document"}
        </button>
      </form>

      <hr />

      <h5>Uploaded Documents</h5>
      <div className="row">
        {documents.map((doc, idx) => (
          <div className="col-md-4 mb-3" key={idx}>
            <div className="card p-2">
              {doc.fileType.includes("image") ? (
                <img src={doc.downloadURL} alt="" className="img-fluid" />
              ) : doc.fileType === "application/pdf" ? (
                <embed src={doc.downloadURL} width="100%" height="150px" />
              ) : (
                <a href={doc.downloadURL} target="_blank" rel="noreferrer">
                  View Word Document
                </a>
              )}
              <p className="mt-2">
                <strong>Type:</strong> {doc.docType}
              </p>
              <div className="d-flex justify-content-between">
                <button className="btn btn-sm btn-warning" onClick={() => handleEdit(idx)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(idx)}>
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
