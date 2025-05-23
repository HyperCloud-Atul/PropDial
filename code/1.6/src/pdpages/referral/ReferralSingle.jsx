import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import "./ReferralSingle.scss";
import { Calendar, Gift, Mail, Phone } from "lucide-react";
const ReferralSingle = ({ referralDoc, user }) => {
  console.log(referralDoc);
  return (
    <>
      {referralDoc &&
        referralDoc.map((doc, index) => (
          <div
            className={`referral_card ${
             doc.isAccept ? "accepted" : "pending"
            }
  `}
            
            key={index}
            // onClick={() => handleShowEnquriyModal(doc)}
          >
            {/* <h4 className="top_right_content">
            <span>{format(new Date(doc.createdAt), "dd-MMM-yy hh:mm a")}</span>
          </h4> */}
            {/* {doc.isAccept && ( */}

            {/*commented by rahul aggarwal*/}
            {/* <div
              className={`top_tag_left ${
                doc.isAccept ? "successful" : "working"
              }`}
            >
              {doc.isAccept ? "Converted" : "Pending"}
            </div> */}

            {/* )} */}

            {/*commented by rahul aggarwal*/}
            {/* <div className="left">
              <div className="inner">
                <h5 className="title">{doc.name}</h5>
                <h6 className="sub_title">
                  {user && user.role === "owner"
                    ? doc.phone.replace(
                        /(\d{2})(\d{6})(\d{4})/,
                        "+$1 ****** $3"
                      )
                    : doc.phone.replace(/(\d{2})(\d{5})(\d{5})/, "+$1 $2-$3")}
                </h6> */}

            {/* {doc.email && (
                  <h6 className="sub_title text-capitalize">{doc.email}</h6>
                )} */}

            {/*commented by rahul aggarwal*/}
            {/* {doc && doc.referalCode && (
                  <Link
                    to={`/referrallogin/${doc.referalCode}`}
                    style={{
                      fontSize: "14px",
                      color: "var(--theme-green)",
                      wordBreak: "break-all",
                      display: "-webkit-box",
                      WebkitLineClamp: "1",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {doc.email}
                  </Link>
                )}

                {doc.source && doc.referredBy === "none" && (
                  <h6 className="sub_title text-capitalize">
                    Source :- {doc.source}{" "}
                  </h6>
                )}
              </div>
            </div> */}

            {/* {user && (user.role === "admin" || user.role === "superAdmin") && (
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
          )}  */}
            {/* {(doc.enquiryStatus === "open" ||
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
            )} */}

            {/* {user && user.role === "superAdmin" && (
         
             <span
              className="material-symbols-outlined delete_icon_top"
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent onClick from triggering
                handleDeleteClick(doc.id); // Open the delete confirmation modal
              }}
            >
              delete_forever
            </span>
       
          )} */}

            <div className="referral_card_inner">
              <div className="referral_card_inner_header">
                <div className="header-user-status">
                  <h5>{doc.name}</h5>
                  <p className={doc.isAccept ? "accepted" : "pending"}>
                    {doc.isAccept ? "Accepted" : "Pending"}
                  </p>
                </div>
                <div className="header-user-contact">
                  <p>
                    <Phone className="lucide-icon" />
                    <span>
                      +{doc.countryCode}-{doc.nationalNumber}
                    </span>
                  </p>
                  <p>
                    <Mail className="lucide-icon" />
                    <span>
                       <Link
                    to={`/referrallogin/${doc.referalCode}`}
                    style={{
                      fontSize: "14px",
                      color: "var(--theme-green)",
                      wordBreak: "break-all",
                      display: "-webkit-box",
                      WebkitLineClamp: "1",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {doc.email}
                  </Link>
                    </span>
                  </p>
                </div>
              </div>
              <div className="referral_card_inner_body">
                <div className="body_item">
                  <Gift className="lucide-icon" />
                  <div className="body_item_content">
                    <h6>Promo code</h6>
                    <p>{doc.promoCode}</p>
                  </div>
                </div>
                <div className="body_item">
                  <Calendar className="lucide-icon" />
                  <div className="body_item_content">
                    <h6>Referred on</h6>
                    <p>{format(doc.createdAt.toDate(), "MMM dd, yyyy")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      {/* <EnquiryDetailModal
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
    /> */}
    </>
  );
};

export default ReferralSingle;
