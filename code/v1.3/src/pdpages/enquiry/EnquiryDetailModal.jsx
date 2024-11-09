import React from "react";
import Modal from "react-bootstrap/Modal";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const EnquiryDetailModal = ({ show, handleClose, selectedEnquiry, user }) => {
  const [previousStatus, setPreviousStatus] = useState("");

  // Update previousStatus whenever selectedEnquiry changes
  useEffect(() => {
    if (selectedEnquiry) {
      setPreviousStatus(selectedEnquiry.enquiryStatus);
    }
  }, [selectedEnquiry]);

  // Return null if selectedEnquiry is null to prevent rendering errors
  if (!selectedEnquiry) return null;
  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="enquiry_modal margin_top"
    >
      <span class="material-symbols-outlined modal_close" onClick={handleClose}>
        close
      </span>
      <div className="modal_top_bar">
        <div className="left">
          <span class="material-symbols-outlined">calendar_month</span>
          <span class="material-symbols-outlined">schedule</span>
        </div>
        <div className="right">
          {format(new Date(selectedEnquiry.date), "dd-MMM-yy, hh:mm a")}
        </div>
      </div>
      <div className="one_word_info">
        {selectedEnquiry.enquiryType && (
          <div className="owi_single">
            <h6>Enquiry Type</h6>
            <h5>{selectedEnquiry.enquiryType}</h5>
          </div>
        )}
        {selectedEnquiry.enquiryFrom && (
          <div className="owi_single">
            <h6>Enquiry From</h6>
            <h5> {selectedEnquiry.enquiryFrom}</h5>
          </div>
        )}
        {selectedEnquiry.referredBy && (
          <div className="owi_single">
            <h6>Referred By</h6>
            <h5>{selectedEnquiry.referredBy}</h5>
          </div>
        )}
        {(selectedEnquiry.referredBy.toLowerCase() === "propdial" ||
          selectedEnquiry.referredBy.toLowerCase() === "none") && (
          <div className="owi_single">
            <h6>Source</h6>
            <h5>{selectedEnquiry.source}</h5>
          </div>
        )}
        {selectedEnquiry.referredBy.toLowerCase() === "employee" && (
          <div className="owi_single">
            <h6>Employee Name</h6>
            <h5>{selectedEnquiry.employeeName}</h5>
          </div>
        )}
      </div>
      <hr />
      <div className="details">
        <h6>Person Detail</h6>
        <ul>
          {selectedEnquiry.name && (
            <li>
              <div className="left">Name</div>
              <div className="middle">:-</div>
              <div className="right text-capitalize">
                {selectedEnquiry.name}
              </div>
            </li>
          )}
          {selectedEnquiry.phone && (
            <li>
              <div className="left">Contact</div>
              <div className="middle">:-</div>
              <div className="right">
                {user && user.role === "owner"
                  ? selectedEnquiry.phone.replace(
                      /(\d{2})(\d{6})(\d{4})/,
                      "+$1 ****** $3"
                    )
                  : selectedEnquiry.phone.replace(
                      /(\d{2})(\d{5})(\d{5})/,
                      "+$1 $2-$3"
                    )}
              </div>
            </li>
          )}

          {selectedEnquiry.email && (
            <li>
              <div className="left">Email</div>
              <div className="middle">:-</div>
              <div
                className="right"
                style={{
                  wordBreak: "break-all",
                }}
              >
                {user && user.role === "owner"
                  ? `${selectedEnquiry.email
                      .split("@")[0]
                      .substring(0, 2)}***@${
                      selectedEnquiry.email.split("@")[1]
                    }`
                  : selectedEnquiry.email}
              </div>
            </li>
          )}
          {selectedEnquiry.description && (
            <li>
              <div className="left">Description</div>
              <div className="middle">:-</div>
              <div
                className="right text-capitalize"
                style={{
                  wordBreak: "break-all",
                }}
              >
                {selectedEnquiry.description}
              </div>
            </li>
          )}
        </ul>
      </div>
      <hr />

      <div className="details">
        <h6>Property Detail</h6>
        <ul>
          <li>
            <div className="left">PID</div>
            <div className="middle">:-</div>
            <div className="right">
              {selectedEnquiry.pid ? (
                <Link
                  className="click_text"
                  to={`/propertydetails/${selectedEnquiry.propId}`}
                >
                  {selectedEnquiry.pid}
                </Link>
              ) : (
                <div className="right">Yet to be added</div>
              )}
            </div>
          </li>
          <li>
            <div className="left">Property</div>
            <div className="middle">:-</div>
            <div className="right">            
              {selectedEnquiry.propertyName}
            </div>
          </li>
          {/* <li>
              <div className="left">Property Owner</div>
              <div className="middle">:-</div>
              <div className="right text-capitalize">              
                {selectedEnquiry.propertyOwner}
              </div>
            </li> */}
        </ul>
      </div>
      <hr />

      {user &&
        (user.role === "admin" || user.role === "superAdmin") &&
        selectedEnquiry.remark && (
          <>
            <div className="details">
              <h6>Office Uses</h6>
              <ul>
                {selectedEnquiry.remark && (
                  <li>
                    <div className="left">Remark</div>
                    <div className="middle">:-</div>
                    <div className="right text-break">
                      {selectedEnquiry.remark}
                    </div>
                  </li>
                )}
              </ul>
            </div>
            <hr />
          </>
        )}

      {/* old enquiry status line  */}
      {/* <div className="enquiry_status">
        <h6>Enquiry Status</h6>
        <div
          className={`multi_steps show_status
               ${
                 selectedEnquiry.enquiryStatus === "open"
                   ? "open"
                   : selectedEnquiry.enquiryStatus === "working"
                   ? "working"
                   : selectedEnquiry.enquiryStatus === "successful"
                   ? "successful"
                   : selectedEnquiry.enquiryStatus === "dead"
                   ? "dead"
                   : ""
               }`}
        >
          <div className="progress_bar">
            <div
              className="fill"
              style={{
                width:
                  selectedEnquiry.enquiryStatus === "open"
                    ? "33.333%"
                    : selectedEnquiry.enquiryStatus === "working"
                    ? "66.66%"
                    : selectedEnquiry.enquiryStatus === "successful" ||
                      selectedEnquiry.enquiryStatus === "dead"
                    ? "100%"
                    : "0%",
              }}
            ></div>
          </div>
          {selectedEnquiry.statusUpdates.map((e) => {
            if (e.status === "open") {
              return (
                <div className="step_single" key={e}>
                  <div className="number">
                    <span class="material-symbols-outlined">open_in_new</span>
                  </div>
                  <h6 className="text-capitalize">{e.status}</h6>
                  {e.updatedAt && (
                    <h5>{format(e.updatedAt.toDate(), "dd-MMM-yy hh:mm a")}</h5>
                  )}
                </div>
              );
            } else if (e.status === "working") {
              return (
                <div
                  className={`step_single ${
                    selectedEnquiry.enquiryStatus === "open" ? "wait" : ""
                  }`}
                  key={e}
                >
                  <div className="number">
                    <span class="material-symbols-outlined">autorenew</span>
                  </div>
                  <h6 className="text-capitalize">{e.status}</h6>
                  {e.updatedAt && (
                    <h5>{format(e.updatedAt.toDate(), "dd-MMM-yy hh:mm a")}</h5>
                  )}
                </div>
              );
            } else if (e.status === "successful") {
              return (
                <div
                  className={`step_single ${
                    selectedEnquiry.enquiryStatus === "open" ||
                    selectedEnquiry.enquiryStatus === "working"
                      ? "wait"
                      : ""
                  }`}
                  key={e}
                >
                  <div className="number">
                    <span class="material-symbols-outlined">check_circle</span>
                  </div>
                  <h6 className="text-capitalize">{e.status}</h6>
                  {e.updatedAt && (
                    <h5>{format(e.updatedAt.toDate(), "dd-MMM-yy hh:mm a")}</h5>
                  )}
                </div>
              );
            } else if (e.status === "dead") {
              return (
                <div
                  className={`step_single ${
                    selectedEnquiry.enquiryStatus === "open" ||
                    selectedEnquiry.enquiryStatus === "working"
                      ? "wait"
                      : ""
                  }`}
                  key={e}
                >
                  <div className="number">
                    <span class="material-symbols-outlined">cancel</span>
                  </div>
                  <h6 className="text-capitalize">{e.status}</h6>
                  {e.updatedAt && (
                    <h5>{format(e.updatedAt.toDate(), "dd-MMM-yy hh:mm a")}</h5>
                  )}
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div> */}

      {/* Simplified Enquiry Status Component */}
      {/* <div className="enquiry_status">
        <h6>Enquiry Status</h6>
        <div
          className={`multi_steps show_status ${selectedEnquiry.enquiryStatus}`}
        >
          <div className="progress_bar">
            <div
              className="fill"
              style={{
                width:
                  selectedEnquiry.enquiryStatus === "open"
                    ? "33.333%"
                    : selectedEnquiry.enquiryStatus === "working"
                    ? "66.66%"
                    : "100%",
              }}
            ></div>
          </div>

          {selectedEnquiry.statusUpdates.map((e) => {
            const statusConfig = {
              open: { icon: "open_in_new", conditionClass: "" },
              working: {
                icon: "autorenew",
                conditionClass:
                  selectedEnquiry.enquiryStatus === "open" ? "wait" : "",
              },
              successful: {
                icon: "check_circle",
                conditionClass:
                  selectedEnquiry.enquiryStatus === "open" ||
                  selectedEnquiry.enquiryStatus === "working"
                    ? "wait"
                    : "",
              },
              dead: {
                icon: "cancel",
                conditionClass:
                  selectedEnquiry.enquiryStatus === "open" ||
                  selectedEnquiry.enquiryStatus === "working"
                    ? "wait"
                    : "",
              },
            };

            const { icon, conditionClass } = statusConfig[e.status] || {};

            return (
              <div className={`step_single ${conditionClass}`} key={e.status}>
                <div className="number">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <h6 className="text-capitalize">{e.status}</h6>
                {e.updatedAt && (
                  <h5>{format(e.updatedAt.toDate(), "dd-MMM-yy hh:mm a")}</h5>
                )}
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Simplified Enquiry Status Component with Deduplication */}
      {/* <div className="enquiry_status">
  <h6>Enquiry Status</h6>
  <div
    className={`multi_steps show_status ${selectedEnquiry.enquiryStatus}`}
  >
    <div className="progress_bar">
      <div
        className="fill"
        style={{
          width:
            selectedEnquiry.enquiryStatus === "open"
              ? "33.333%"
              : selectedEnquiry.enquiryStatus === "working"
              ? "66.66%"
              : "100%",
        }}
      ></div>
    </div>

    {selectedEnquiry.statusUpdates
      .filter(
        (status, index, self) =>
          index ===
          self.findIndex((s) => s.status === status.status) // Filter unique statuses
      )
      .map((e) => {
        const statusConfig = {
          open: { icon: "open_in_new", conditionClass: "" },
          working: {
            icon: "autorenew",
            conditionClass:
              selectedEnquiry.enquiryStatus === "open" ? "wait" : "",
          },
          successful: {
            icon: "check_circle",
            conditionClass:
              selectedEnquiry.enquiryStatus === "open" ||
              selectedEnquiry.enquiryStatus === "working"
                ? "wait"
                : "",
          },
          dead: {
            icon: "cancel",
            conditionClass:
              selectedEnquiry.enquiryStatus === "open" ||
              selectedEnquiry.enquiryStatus === "working"
                ? "wait"
                : "",
          },
        };

        const { icon, conditionClass } = statusConfig[e.status] || {};

        return (
          <div
            className={`step_single ${conditionClass}`}
            key={e.status}
          >
            <div className="number">
              <span className="material-symbols-outlined">{icon}</span>
            </div>
            <h6 className="text-capitalize">{e.status}</h6>
            {e.updatedAt && (
              <h5>{format(e.updatedAt.toDate(), "dd-MMM-yy hh:mm a")}</h5>
            )}
          </div>
        );
      })}
  </div>
</div> */}

      {/* Simplified Enquiry Status Component with Deduplication in this only update update at */}
      <div className="enquiry_status">
        <h6>Enquiry Status</h6>
        <div
          className={`multi_steps show_status ${selectedEnquiry.enquiryStatus}`}
        >
          <div className="progress_bar">
            <div
              className="fill"
              style={{
                width:
                  selectedEnquiry.enquiryStatus === "open"
                    ? "33.333%"
                    : selectedEnquiry.enquiryStatus === "working"
                    ? "66.66%"
                    : "100%",
              }}
            ></div>
          </div>

          {Object.values(
            selectedEnquiry.statusUpdates.reduceRight((acc, e) => {
              // Keep only the latest update of each status
              if (!acc[e.status]) acc[e.status] = e;
              return acc;
            }, {})
          )
            .reverse() // Reverse to maintain original order
            .map((e) => {
              const statusConfig = {
                open: { icon: "open_in_new", conditionClass: "" },
                working: {
                  icon: "autorenew",
                  conditionClass:
                    selectedEnquiry.enquiryStatus === "open" ? "wait" : "",
                },
                successful: {
                  icon: "check_circle",
                  conditionClass:
                    selectedEnquiry.enquiryStatus === "open" ||
                    selectedEnquiry.enquiryStatus === "working"
                      ? "wait"
                      : "",
                },
                dead: {
                  icon: "cancel",
                  conditionClass:
                    selectedEnquiry.enquiryStatus === "open" ||
                    selectedEnquiry.enquiryStatus === "working"
                      ? "wait"
                      : "",
                },
              };

              const { icon, conditionClass } = statusConfig[e.status] || {};

              return (
                <div className={`step_single ${conditionClass}`} key={e.status}>
                  <div className="number">
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <h6 className="text-capitalize">{e.status}</h6>
                  {e.updatedAt && (
                    <h5>{format(e.updatedAt.toDate(), "dd-MMM-yy hh:mm a")}</h5>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* this is to show all updates */}
      {/* <div className="enquiry_status">
  <h6>Enquiry Status</h6>
  <div
    className={`multi_steps show_status ${selectedEnquiry.enquiryStatus}`}
  >
    <div className="progress_bar">
      <div
        className="fill"
        style={{
          width:
            selectedEnquiry.enquiryStatus === "open"
              ? "33.333%"
              : selectedEnquiry.enquiryStatus === "working"
              ? "66.66%"
              : "100%",
        }}
      ></div>
    </div>

    {selectedEnquiry.statusUpdates.map((e, index) => {
      const statusConfig = {
        open: { icon: "open_in_new", conditionClass: "" },
        working: {
          icon: "autorenew",
          conditionClass:
            selectedEnquiry.enquiryStatus === "open" && index === 0 ? "wait" : "",
        },
        successful: {
          icon: "check_circle",
          conditionClass:
            selectedEnquiry.enquiryStatus === "open" ||
            selectedEnquiry.enquiryStatus === "working"
              ? "wait"
              : "",
        },
        dead: {
          icon: "cancel",
          conditionClass:
            selectedEnquiry.enquiryStatus === "open" ||
            selectedEnquiry.enquiryStatus === "working"
              ? "wait"
              : "",
        },
      };

      const { icon, conditionClass } = statusConfig[e.status] || {};

      return (
        <div
          className={`step_single ${conditionClass}`}
          key={`${e.status}-${index}`}
        >
          <div className="number">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <h6 className="text-capitalize">{e.status}</h6>
          {e.updatedAt && (
            <h5>{format(e.updatedAt.toDate(), "dd-MMM-yy hh:mm a")}</h5>
          )}
        </div>
      );
    })}
  </div>
</div> */}
    </Modal>
  );
};

export default EnquiryDetailModal;
