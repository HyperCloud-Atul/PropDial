import React from "react";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import { useFirestore } from "../../../../hooks/useFirestore";
import { projectStorage } from "../../../../firebase/config";
import { BeatLoader } from "react-spinners";

// import component
import ImageModal from "../../../imageModal/ImageModal";
import AgentDetailModal from "./AgentDetailModal";
import SureDelete from "../../../sureDelete/SureDelete";

const AgentSingle = ({ agentDoc }) => {
  const { user } = useAuthContext();
  const fileInputRef = useRef(null);
  const { addDocument, updateDocument, deleteDocument, error } =
    useFirestore("agent-propdial");

  const [documentFile, setDocumentFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newDocId, setNewDocId] = useState("");
  const [uploadingDocId, setUploadingDocId] = useState(null); // Track uploading document ID
  // const [checked, setChecked] = React.useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

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
      setUploadingDocId(newDocId);
      const fileType = getFileType(documentFile);
      const storageRef = projectStorage.ref(
        `docs/${newDocId}/${documentFile.name}`
      );
      await storageRef.put(documentFile);
      const fileURL = await storageRef.getDownloadURL();
      await updateDocument(newDocId, {
        agentImageUrl: fileURL,
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

  // Delete confirmation modal
  const [isDeleting, setIsDeleting] = useState(false);
  const handleShowDeleteModal = (imageUrl, docId) => {
    setImageToDelete({ imageUrl, docId });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImageToDelete(null);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    if (imageToDelete) {
      const { imageUrl, docId } = imageToDelete;
      const storageRef = projectStorage.refFromURL(imageUrl);
      try {
        await storageRef.delete();
        await updateDocument(docId, { agentImageUrl: "" });
        setImageToDelete(null);
        setShowModal(false);
        setIsDeleting(false);
      } catch (error) {
        console.error("Error deleting image:", error);
        setIsDeleting(false);
      }
    }
  };

  // image modal code end

  // modal code start

  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);

  const handleAgentModalClose = () => setShowAgentModal(false);
  const handleShowAgentModal = (doc) => {
    setSelectedAgent(doc);
    setShowAgentModal(true);
  };

  return (
    <div className="agent_cards propdial_users all_tenants ">
      {agentDoc &&
        agentDoc.map((doc) => (
          <div className="pu_single">
            <div className="tc_single relative item">
              <div className="left">
                <div className="tcs_img_container">
                  {uploadingDocId !== doc.id && (
                    <label
                      htmlFor={`upload_img_${doc.id}`}
                      className="upload_btn pointer"
                      style={{
                        position: "absolute",
                        bottom: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        color: "var(--white-color)",
                        background: "var(--theme-green)",
                        padding: "4px",
                        left: "0",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        upload
                      </span>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, doc.id)}
                        ref={fileInputRef}
                        id={`upload_img_${doc.id}`}
                        className="d_none"
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
                      src={doc.agentImageUrl}
                      style={{
                        width: "100%",
                        aspectRatio: "3/2",
                      }}
                      className="pointer"
                      onClick={() =>
                        handleImageClick(
                          doc.photoURL || "/assets/img/dummy_user.png",
                          <>
                            Here's How{" "}
                            <span
                              style={{
                                fontWeight: "500",
                                color: "var(--theme-blue)",
                              }}
                            >
                              {doc.fullName}
                            </span>{" "}
                            Looks
                          </>
                        )
                      }
                    ></iframe>
                  ) : (
                    <img
                      src={
                        doc.agentImageUrl || "https://via.placeholder.com/150"
                      }
                      className="pointer"
                      onClick={() =>
                        handleImageClick(
                          doc.agentImageUrl || "/assets/img/dummy_user.png",
                          <>
                            Here's How{" "}
                            <span
                              style={{
                                fontWeight: "500",
                                color: "var(--theme-blue)",
                              }}
                            >
                              {doc.agentName}
                            </span>{" "}
                            Looks
                          </>
                        )
                      }
                      alt="Document"
                    />
                  )}
                  {doc.agentImageUrl && (
                    <span
                      className="material-symbols-outlined delete_icon"
                      style={{
                        right: "0"
                      }}
                      onClick={() =>
                        handleShowDeleteModal(doc.agentImageUrl, doc.id)}
                    >
                      delete_forever
                    </span>

                  )}

                </div>

                <div className="tenant_detail">
                  <h6 className="t_name pointer">
                    {doc.agentName}
                    {user && user.role === "superAdmin" && (
                      <Link
                        to={`/edit-agent/${doc.id}`}
                        className="click_icon "
                      >
                        <span className="material-symbols-outlined text_near_icon">
                          edit
                        </span>
                      </Link>
                    )}
                  </h6>
                  {doc.agentPhone && (
                    <h6 className="t_number">
                      {doc.agentPhone.replace(
                        /(\d{2})(\d{5})(\d{5})/,
                        "+$1 $2-$3"
                      )}
                    </h6>
                  )}
                  {/* {doc.agentEmail && (
                    <h6
                      className="t_number"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {doc.agentEmail}
                    </h6>
                  )} */}
                  <h6 className="t_number">
                    {doc.city}, {doc.state}
                  </h6>
                </div>
              </div>
              <div className="wha_call_icon">
                <Link
                  className="call_icon wc_single"
                  to={`tel:${doc.agentPhone}`}
                  target="_blank"
                >
                  <img src="/assets/img/simple_call.png" alt="" />
                </Link>
                <Link
                  className="wha_icon wc_single"
                  to={`https://wa.me/${doc.agentPhone}`}
                  target="_blank"
                >
                  <img src="/assets/img/whatsapp_simple.png" alt="" />
                </Link>
              </div>
            </div>
            <div className="dates">
              <div className="date_single">
                <strong>Created At</strong>:{" "}
                <span>{format(doc.createdAt.toDate(), "dd-MMM-yy")}</span>
              </div>
              <div
                className="date_single click_text pointer"
                onClick={() => handleShowAgentModal(doc)}
              >
                View
              </div>
            </div>
          </div>
        ))}
      <ImageModal
        show={showImageModal}
        handleClose={() => setShowImageModal(false)}
        imageUrl={selectedImageUrl}
        imageModalTitle={imageModalTitle} // Pass the dynamic title as a prop
      />
      <AgentDetailModal
        show={showAgentModal}
        handleClose={handleAgentModalClose}
        selectedAgent={selectedAgent}
        user={user}
      />
      {/* SureDelete Confirmation Modal */}
      <SureDelete
        show={showModal}
        handleClose={handleCloseModal}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AgentSingle;
