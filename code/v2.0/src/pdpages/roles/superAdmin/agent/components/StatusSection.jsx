import React from "react";
import { format } from "date-fns";

const StatusSection = ({ formState, onStatusChange, shouldDisableForm, agentDoc, dbUsers }) => {
  return (
    <div className="col-xl-4 col-lg-6">
      <div className="form_field st-2 label_top">
        <label htmlFor="">Status*</label>
        <div className="form_field_inner">
          <div className="form_field_container">
            <div className="radio_group">
              <div className="radio_group_single">
                <div className={formState.status === "active" ? "custom_radio_button radiochecked" : "custom_radio_button"}>
                  <input
                    type="checkbox"
                    id="user_status-active"
                    onChange={(e) => {
                      if (formState.status === "active") return;
                      onStatusChange();
                    }}
                    checked={formState.status === "active"}
                    disabled={shouldDisableForm}
                  />
                  <label htmlFor="user_status-active" style={{ paddingTop: "7px" }}>
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div className="radio_icon">
                          <span className="material-symbols-outlined add">add</span>
                          <span className="material-symbols-outlined check">done</span>
                        </div>
                        Active
                      </div>
                      <div>
                        {agentDoc && agentDoc.activeBy && agentDoc.activeAt && (
                          <div className="info_icon">
                            <span className="material-symbols-outlined">info</span>
                            <div className="info_icon_inner">
                              <b className="text_green2">Active</b> by{" "}
                              <b>{agentDoc && dbUsers && dbUsers.find((user) => user.id === agentDoc.activeBy)?.fullName}</b> on{" "}
                              <b>{agentDoc && format(agentDoc.activeAt.toDate(), "dd-MMM-yyyy hh:mm a")}</b>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="radio_group_single">
                <div className={formState.status === "banned" ? "custom_radio_button radiochecked" : "custom_radio_button"}>
                  <input
                    type="checkbox"
                    id="user_status-banned"
                    onChange={(e) => {
                      if (formState.status === "banned") return;
                      onStatusChange();
                    }}
                    checked={formState.status === "banned"}
                    disabled={shouldDisableForm}
                  />
                  <label htmlFor="user_status-banned" style={{ paddingTop: "7px" }}>
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div className="radio_icon">
                          <span className="material-symbols-outlined add">add</span>
                          <span className="material-symbols-outlined check">done</span>
                        </div>
                        Banned
                      </div>
                      <div>
                        {agentDoc && agentDoc.inactiveBy && agentDoc.inactiveAt && (
                          <div className="info_icon">
                            <span className="material-symbols-outlined">info</span>
                            <div className="info_icon_inner">
                              <b className="text_green2">Banned</b> by{" "}
                              <b>{agentDoc && dbUsers && dbUsers.find((user) => user.id === agentDoc.inactiveBy)?.fullName}</b> on{" "}
                              <b>{agentDoc && format(agentDoc.inactiveAt.toDate(), "dd-MMM-yyyy hh:mm a")}</b>
                              , Reason <b>{agentDoc && agentDoc.inactiveReason && agentDoc.inactiveReason}</b>
                              ,{agentDoc && agentDoc.inactiveRemark && <> Remark <b>{agentDoc.inactiveRemark}</b></>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusSection;