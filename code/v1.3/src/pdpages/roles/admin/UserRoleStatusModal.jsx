import React from "react";
import Modal from "react-bootstrap/Modal";

const UserRoleStatusModal = ({
  show,
  handleClose,
  selectedUser,
  handleRoleChange,
  handleStatusChange,
  handleSaveChanges,
}) => {
  if (!selectedUser) return null;
  return (
    <Modal show={show} onHide={handleClose} className="my_modal margin_top">
      <span class="material-symbols-outlined modal_close" onClick={handleClose}>
        close
      </span>
      <Modal.Body>
        <h6 className="r16 r16-14-m lh22 mb-3">
          The <span className="m16 m16-14-m">{selectedUser.displayName}</span>{" "}
          role is currently set to{" "}
          <span className="m16 m16-14-m text_blue text-capitalize">
            {selectedUser.rolePropDial}
          </span>
          . You can change it here if needed.
        </h6>
        <div className="form_field">
          <div className="field_box theme_radio_new">
            <div
              className="theme_radio_container"
              style={{
                padding: "0px",
                border: "none",
              }}
            >
              <div className="radio_single">
                <input
                  type="radio"
                  name="user_role"
                  value="owner"
                  id="owner"
                  checked={selectedUser.rolePropDial === "owner"}
                  onChange={() => handleRoleChange("owner")}
                />
                <label htmlFor="owner">Owner</label>
              </div>
              <div className="radio_single">
                <input
                  type="radio"
                  name="user_role"
                  value="frontdesk"
                  id="frontdesk"
                  checked={selectedUser.rolePropDial === "frontdesk"}
                  onChange={() => handleRoleChange("frontdesk")}
                />
                <label htmlFor="frontdesk">Frontdesk</label>
              </div>
              <div className="radio_single">
                <input
                  type="radio"
                  name="user_role"
                  value="executive"
                  id="executive"
                  checked={selectedUser.rolePropDial === "executive"}
                  onChange={() => handleRoleChange("executive")}
                />
                <label htmlFor="executive">executive</label>
              </div>
              <div className="radio_single">
                <input
                  type="radio"
                  name="user_role"
                  value="admin"
                  id="admin"
                  checked={selectedUser.rolePropDial === "admin"}
                  onChange={() => handleRoleChange("admin")}
                />
                <label htmlFor="admin">Admin</label>
              </div>
              <div className="radio_single">
                <input
                  type="radio"
                  name="user_role"
                  value="agent"
                  id="agent"
                  checked={selectedUser.rolePropDial === "agent"}
                  onChange={() => handleRoleChange("agent")}
                />
                <label htmlFor="agent">agent</label>
              </div>
              <div className="radio_single">
                <input
                  type="radio"
                  name="user_role"
                  value="superAdmin"
                  id="superAdmin"
                  checked={selectedUser.rolePropDial === "superAdmin"}
                  onChange={() => handleRoleChange("superAdmin")}
                />
                <label htmlFor="superAdmin">Super Admin</label>
              </div>
              <div className="radio_single">
                <input
                  type="radio"
                  name="user_role"
                  value="tenant"
                  id="tenant"
                  checked={selectedUser.rolePropDial === "tenant"}
                  onChange={() => handleRoleChange("tenant")}
                />
                <label htmlFor="tenant">tenant</label>
              </div>
              <div className="radio_single">
                <input
                  type="radio"
                  name="user_role"
                  value="prospectiveTenant"
                  id="prospectiveTenant"
                  checked={selectedUser.rolePropDial === "prospectiveTenant"}
                  onChange={() => handleRoleChange("prospectiveTenant")}
                />
                <label htmlFor="prospectiveTenant">prospective Tenant</label>
              </div>
              <div className="radio_single">
                <input
                  type="radio"
                  name="user_role"
                  value="buyer"
                  id="buyer"
                  checked={selectedUser.rolePropDial === "buyer"}
                  onChange={() => handleRoleChange("buyer")}
                />
                <label htmlFor="buyer">buyer</label>
              </div>
              <div className="radio_single">
                <input
                  type="radio"
                  name="user_role"
                  value="prospectiveBuyer"
                  id="prospectiveBuyer"
                  checked={selectedUser.rolePropDial === "prospectiveBuyer"}
                  onChange={() => handleRoleChange("prospectiveBuyer")}
                />
                <label htmlFor="prospectiveBuyer">prospective Buyer</label>
              </div>
             
            </div>
          </div>
        </div>
        <hr />
        <h6 className="r16 r16-14-m lh22 mb-3">
          <span className="m16 m16-14-m">{selectedUser.displayName}</span>{" "}
          access managment
        </h6>
        <div className="access_manage">
          <div className="left">
            <div className="field_box theme_radio_new tab_type_radio active_right no_pd_bo">
              <div className="theme_radio_container">
                <div className="radio_single">
                  <input
                    type="radio"
                    name="access_type"
                    id="at_city"
                    // value={category.value}
                    // onChange={handleDocCatChange}
                    // checked={selectedDocCat === category.value}
                  />
                  <label htmlFor="at_city">City</label>
                </div>
                <div className="radio_single">
                  <input
                    type="radio"
                    name="access_type"
                    id="at_state"
                    // value={category.value}
                    // onChange={handleDocCatChange}
                    // checked={selectedDocCat === category.value}
                  />
                  <label htmlFor="at_state">state</label>
                </div>

                <div className="radio_single">
                  <input
                    type="radio"
                    name="access_type"
                    id="at_region"
                    // value={category.value}
                    // onChange={handleDocCatChange}
                    // checked={selectedDocCat === category.value}
                  />
                  <label htmlFor="at_region">Region</label>
                </div>
                <div className="radio_single">
                  <input
                    type="radio"
                    name="access_type"
                    id="at_country"
                    // value={category.value}
                    // onChange={handleDocCatChange}
                    // checked={selectedDocCat === category.value}
                  />
                  <label htmlFor="at_country">Country</label>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="form_field theme_checkbox">
              <div className="theme_checkbox_container">
                <div className="checkbox_single">
                  {" "}
                  <input type="checkbox" id="pune" name="access_value" />
                  <label htmlFor="pune">pune</label>
                </div>
                <div className="checkbox_single">
                  {" "}
                  <input type="checkbox" id="Delhi" name="access_value" />
                  <label htmlFor="Delhi">Delhi</label>
                </div>
                <div className="checkbox_single">
                  {" "}
                  <input type="checkbox" id="mumbai" name="access_value" />
                  <label htmlFor="mumbai">mumbai</label>
                </div>
                <div className="checkbox_single">
                  {" "}
                  <input type="checkbox" id="gurugram" name="access_value" />
                  <label htmlFor="gurugram">gurugram</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <h6 className="r16 r16-14-m lh22 mb-3">
          The status for{" "}
          <span className="m16 m16-14-m">{selectedUser.displayName}</span> is
          currently set to{" "}
          <span
            className={`m16 m16-14-m text-capitalize ${
              selectedUser.status === "active" ? "text_green2" : "text_red"
            }`}
          >
            {selectedUser.status}
          </span>
          , You can change it here if needed.
        </h6>
        <div className="form_field">
          <div className="field_box theme_radio_new">
            <div
              className="theme_radio_container"
              style={{
                padding: "0px",
                border: "none",
              }}
            >
              <div className="radio_single">
                <input
                  type="radio"
                  name="user_status"
                  value="active"
                  id="active"
                  checked={selectedUser.status === "active"}
                  onChange={() => handleStatusChange("active")}
                />
                <label htmlFor="active" 
                style={selectedUser.status === "active" ? { background: "var(--theme-green2)" } : {}}
                >Active</label>
              </div>
              <div className="radio_single">
                <input
                  type="radio"
                  name="user_status"
                  value="inactive"
                  id="inactive"
                  checked={selectedUser.status === "inactive"}
                  onChange={() => handleStatusChange("inactive")}
                />
                <label htmlFor="inactive"
                 style={selectedUser.status === "inactive" ? { background: "var(--theme-red)" } : {}}
                >Inactive</label>
              </div>
            </div>
          </div>
        </div>
        <div className="vg22"></div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="cancel_btn" onClick={handleClose}>
            Cancel
          </div>
          <div className="done_btn" onClick={handleSaveChanges}>
            Save Changes
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UserRoleStatusModal;
