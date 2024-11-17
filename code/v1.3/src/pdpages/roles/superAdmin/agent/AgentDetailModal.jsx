import React from "react";
import Modal from "react-bootstrap/Modal";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCollection } from "../../../../hooks/useCollection";

const AgentDetailModal = ({ show, handleClose, selectedAgent, user }) => {
  const { documents: dbUsers, error: dbuserserror } = useCollection(
    "users-propdial",
    ["status", "==", "active"]
  );
  const [dbUserState, setdbUserState] = useState(dbUsers);
  useEffect(() => {
    setdbUserState(dbUsers);
  });
  if (!selectedAgent) return null;
  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="enquiry_modal margin_top"
      style={{
        paddingLeft: "0px !important",
      }}
      centered
    >
      <span className="material-symbols-outlined modal_close" onClick={handleClose}>
        close
      </span>
      {/* <div className="modal_top_bar">
        <div className="left">
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="material-symbols-outlined">schedule</span>
        </div>
        <div className="right">
        {format(selectedAgent.createdAt.toDate(), "dd-MMM-yy, hh:mm a")}
        </div>
      </div>   */}
      <div className="img_area text-center">
        <img
          src={selectedAgent.agentImageUrl || "/assets/img/dummy_user.png"}
          alt=""
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            objectPosition: "center",
            borderRadius: "50%",
          }}
        />
      </div>
      <div className="details">
        <h6>Person Detail</h6>
        <ul>
          {selectedAgent.agentName && (
            <li>
              <div className="left">Name</div>
              <div className="middle">:-</div>
              <div className="right text-capitalize">
                {selectedAgent.agentName}
              </div>
            </li>
          )}
          {selectedAgent.agentPhone && (
            <li>
              <div className="left">Contact</div>
              <div className="middle">:-</div>
              <div className="right">
                {selectedAgent.agentPhone.replace(
                  /(\d{2})(\d{5})(\d{5})/,
                  "+$1 $2-$3"
                )}
              </div>
            </li>
          )}

          {selectedAgent.agentEmail && (
            <li>
              <div className="left">Email</div>
              <div className="middle">:-</div>
              <div
                className="right"
                style={{
                  wordBreak: "break-all",
                }}
              >
                {selectedAgent.agentEmail}
              </div>
            </li>
          )}
          {selectedAgent.state && (
            <li>
              <div className="left">City</div>
              <div className="middle">:-</div>
              <div className="right">
                {selectedAgent.city}, {selectedAgent.state}
              </div>
            </li>
          )}

          {selectedAgent.locality && selectedAgent.locality.length > 0 && (
            <li>
              <div className="left">Locality</div>
              <div className="middle">:-</div>
              <div className="right">
                {selectedAgent.locality.map(local =>
                  local.label).join(", ")}
              </div>
            </li>
          )}

          {selectedAgent.society && selectedAgent.society.length > 0 && (
            <li>
              <div className="left">Society</div>
              <div className="middle">:-</div>
              <div className="right">
                {selectedAgent.society.map(local =>
                  local.label).join(", ")}
              </div>
            </li>
          )}
        </ul>
      </div>
      <hr />
      <div className="details">
        <h6>Business Information</h6>
        {(selectedAgent.agentCompnayName || selectedAgent.agentPancard || selectedAgent.agentGstNumber) ? (
          <ul>
            {selectedAgent.agentCompnayName && (
              <li>
                <div className="left">Company Name</div>
                <div className="middle">:-</div>
                <div className="right text-capitalize">
                  {selectedAgent.agentCompnayName}
                </div>
              </li>
            )}
            {selectedAgent.agentPancard && (
              <li>
                <div className="left">PAN Card</div>
                <div className="middle">:-</div>
                <div className="right">{selectedAgent.agentPancard}</div>
              </li>
            )}

            {selectedAgent.agentGstNumber && (
              <li>
                <div className="left">GST Number</div>
                <div className="middle">:-</div>
                <div
                  className="right"
                  style={{
                    wordBreak: "break-all",
                  }}
                >
                  {selectedAgent.agentGstNumber}
                </div>
              </li>
            )}
          </ul>
        ) : (
          <ul>
            <li>Not added yet </li>
          </ul>
        )}

      </div>
      {selectedAgent.updatedAt && (
        <>
          <hr></hr>
          <div className="enquiry_status">
            <div
              className={`multi_steps show_status successful`}
              style={{
                marginTop: "0px",
                gridTemplateColumns: "repeat(2,1fr)",
              }}
            >
              <div className="progress_bar">
                <div
                  className="fill"
                  style={{
                    width: "100%",
                  }}
                ></div>
              </div>
              <div className={`step_single`}>
                <div className="number">
                  <span className="material-symbols-outlined">
                    {" "}
                    calendar_month
                  </span>
                </div>
                <h6 className="text-capitalize">
                  {format(selectedAgent.updatedAt.toDate(), "dd-MMM-yy, hh:mm a")}
                </h6>
                <h5>Updated At</h5>
              </div>
              <div className={`step_single`}>
                <div className="number">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <h6 className="text-capitalize">
                  {dbUserState &&
                    dbUserState.find(
                      (user) => user.id === selectedAgent.updatedBy
                    )?.fullName}
                </h6>
                <h5>Updated By</h5>
              </div>
            </div>
          </div>
        </>
      )
      }

      <hr></hr>
      <div className="enquiry_status">
        <div
          className={`multi_steps show_status`}
          style={{
            marginTop: "0px",
            gridTemplateColumns: "repeat(2,1fr)",
          }}
        >
          <div className="progress_bar">
            <div
              className="fill"
              style={{
                width: "100%",
              }}
            ></div>
          </div>
          <div className={`step_single`}>
            <div className="number">
              <span className="material-symbols-outlined"> calendar_month</span>
            </div>
            <h6 className="text-capitalize">
              {format(selectedAgent.createdAt.toDate(), "dd-MMM-yy, hh:mm a")}
            </h6>
            <h5>Created At</h5>
          </div>
          <div className={`step_single`}>
            <div className="number">
              <span className="material-symbols-outlined">person</span>
            </div>
            <h6 className="text-capitalize">
              {dbUserState &&
                dbUserState.find((user) => user.id === selectedAgent.createdBy)
                  ?.fullName}
            </h6>
            <h5>Created By</h5>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AgentDetailModal;
