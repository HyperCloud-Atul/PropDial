import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import EnquiryDetailModal from "./EnquiryDetailModal";
import SureDelete from "../sureDelete/SureDelete";

const EnquirySingle = ({ enquiries, deleteDocument }) => {
  const { user } = useAuthContext();

  // view enquiry detail modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showEnquriyModal, setShowEnquriyModal] = useState(false);

  const handleEnquriyModalClose = () => setShowEnquriyModal(false);
  const handleShowEnquriyModal = (doc) => {
    setSelectedEnquiry(doc);
    setShowEnquriyModal(true);
  };
  // view enquiry detail modal

  // delete enquiry modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const handleDeleteClick = (docId) => {
    setDocToDelete(docId);
    setShowConfirmModal(true);
  };

  // Function to hide the modal
  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    setDocToDelete(null);
  };

  // Function to delete the document after confirmation
  const confirmDeleteDocument = async () => {
    try {
      setIsDeleting(true);
      if (docToDelete) {
        await deleteDocument(docToDelete);
        setShowConfirmModal(false);
        setDocToDelete(null);
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      setShowConfirmModal(false);
      setDocToDelete(null);
      setIsDeleting(false);
    }
  };

  // delete enquiry modal

  return (
    <>
      {enquiries &&
        enquiries.map((doc, index) => (
          <div
            className={`my_small_card notification_card pointer ${
              user && (user.role === "admin" || user.role === "superAdmin")
                ? "right_gap"
                : ""
            }`}
            key={index}
            onClick={() => handleShowEnquriyModal(doc)}
          >
            <h4 className="top_right_content">
              <span>{format(new Date(doc.date), "dd-MMM-yy hh:mm a")}</span>
            </h4>
            {doc.enquiryStatus && (
              <div
                className={`top_tag_left ${doc.enquiryStatus.toLowerCase()}`}
              >
                {doc.enquiryStatus}
              </div>
            )}
            <div className="left">
              <div className="inner">
                <h5 className="title">{doc.name}</h5>
                <h6 className="sub_title">
                  {user && user.role === "owner"
                    ? doc.phone.replace(
                        /(\d{2})(\d{6})(\d{4})/,
                        "+$1 ****** $3"
                      )
                    : doc.phone.replace(/(\d{2})(\d{5})(\d{5})/, "+$1 $2-$3")}
                </h6>
                {doc.referredBy && doc.referredBy !== "none" && (
                  <h6 className="sub_title text-capitalize">
                    Referred By :- {doc.referredBy}{" "}
                  </h6>
                )}
                {doc.source && doc.referredBy === "none" && (
                  <h6 className="sub_title text-capitalize">
                    Source :- {doc.source}{" "}
                  </h6>
                )}
              </div>
            </div>
            {user && (user.role === "admin" || user.role === "superAdmin") && (
              <div className="wha_call_icon">
                <Link
                  className="call_icon wc_single"
                  to={`tel:+${doc.phone && doc.phone}`}
                  target="_blank"
                >
                  <img src="/assets/img/simple_call.png" alt="propdial" />
                </Link>
                <Link
                  className="wha_icon wc_single"
                  to={`https://wa.me/+${doc.phone && doc.phone}`}
                  target="_blank"
                >
                  <img src="/assets/img/whatsapp_simple.png" alt="propdial" />
                </Link>
              </div>
            )} 
            {(doc.enquiryStatus === "open" ||
              doc.enquiryStatus === "working" ||
              doc.enquiryStatus === "dead" ||
              doc.enquiryStatus === "successful") &&
              user &&
              (user.role === "admin" || user.role === "superAdmin" || user.role === "owner") && (
                <Link to={user && (user.role === "owner" ? `/enquiry-status/${doc.id}` : `/edit-enquiry/${doc.id}`)} className="enq_edit">
                  <span className="material-symbols-outlined">
              {user && user.role === "owner" ? "visibility" : "edit_square"}
                    
                  </span>
                </Link>
              )}

            {user && user.role === "superAdmin" && (
           
               <span
                className="material-symbols-outlined delete_icon_top"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent onClick from triggering
                  handleDeleteClick(doc.id); // Open the delete confirmation modal
                }}
              >
                delete_forever
              </span>
         
            )}
          </div>
        ))}
      <EnquiryDetailModal
        show={showEnquriyModal}
        handleClose={handleEnquriyModalClose}
        selectedEnquiry={selectedEnquiry}
        user={user}
      />
      <SureDelete
        show={showConfirmModal}
        handleClose={handleConfirmClose}
        handleDelete={confirmDeleteDocument}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default EnquirySingle;
