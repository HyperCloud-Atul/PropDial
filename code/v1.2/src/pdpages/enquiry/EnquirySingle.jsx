import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import EnquiryDetailModal from "./EnquiryDetailModal";

const EnquirySingle = ({ enquiries }) => {
  const { user } = useAuthContext();
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showEnquriyModal, setShowEnquriyModal] = useState(false);

  const handleEnquriyModalClose = () => setShowEnquriyModal(false);
  const handleShowEnquriyModal = (doc) => {
    setSelectedEnquiry(doc);
    setShowEnquriyModal(true);
  };

  return (
    <>
      {enquiries &&
        enquiries.map((doc, index) => (
          <div
            className={`my_small_card notification_card pointer ${user && user.role === "admin" ? "right_gap" : ""}`}
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
            {user && user.role === "admin" && (
              <div className="wha_call_icon">
                <Link
                  className="call_icon wc_single"
                  to={`tel:${doc.phone && doc.phone}`}
                  target="_blank"
                >
                  <img src="/assets/img/simple_call.png" alt="" />
                </Link>
                <Link
                  className="wha_icon wc_single"
                  to={`https://wa.me/${doc.phone && doc.phone}`}
                  target="_blank"
                >
                  <img src="/assets/img/whatsapp_simple.png" alt="" />
                </Link>
              </div>
            )}
            {/* {doc.enquiryStatus === "successful" || doc.enquiryStatus === "dead" ? "" : ( */}
            {user && user.role === "admin" && (
              <Link to={`/edit-enquiry/${doc.id}`} className="enq_edit">
                <span class="material-symbols-outlined">edit_square</span>
              </Link>
            )}
            {/* )} */}
          </div>
        ))}
      <EnquiryDetailModal
        show={showEnquriyModal}
        handleClose={handleEnquriyModalClose}
        selectedEnquiry={selectedEnquiry}
        user={user}
      />
    </>
  );
};

export default EnquirySingle;
