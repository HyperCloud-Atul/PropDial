import React from 'react';
import Modal from 'react-bootstrap/Modal';

const UserRoleStatusModal = ({ show, handleClose, selectedUser, handleRoleChange, handleStatusChange, handleSaveChanges }) => {
    if (!selectedUser) return null;
    return (
        <Modal show={show} onHide={handleClose} className='my_modal'>
            <Modal.Body>
                <h6 className="r16 lh22 mb-3">
                    The <span className='m16'>{selectedUser.displayName}</span> role is currently set to <span className='m16 text_blue text-capitalize'>{selectedUser.rolePropDial}</span>. You can change it here if needed.
                </h6>
                <div className='form_field'>
                    <div className='field_box theme_radio_new'>
                        <div className="theme_radio_container"
                            style={{
                                padding: "0px",
                                border: "none"
                            }}>
                            <div className="radio_single">
                                <input type="radio" name="user_role" value="owner" id='owner'
                                    checked={selectedUser.rolePropDial === "owner"} onChange={() => handleRoleChange("owner")} />
                                <label htmlFor="owner">Owner</label>
                            </div>
                            <div className="radio_single">
                                <input type="radio" name="user_role" value="frontdesk" id='frontdesk'
                                    checked={selectedUser.rolePropDial === "frontdesk"} onChange={() => handleRoleChange("frontdesk")} />
                                <label htmlFor="frontdesk">Frontdesk</label>
                            </div>
                            <div className="radio_single">
                                <input type="radio" name="user_role" value="admin" id='admin'
                                    checked={selectedUser.rolePropDial === "admin"} onChange={() => handleRoleChange("admin")} />
                                <label htmlFor="admin">Admin</label>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <h6 className="r16 lh22 mb-3">
                    The status for <span className='m16'>{selectedUser.displayName}</span>  is currently set to <span className={`m16 text-capitalize ${selectedUser.status === "active" ? "text_green2" : "text_red"}`}>{selectedUser.status}</span>, You can change it here if needed.
                </h6>
                <div className='form_field'>
                    <div className='field_box theme_radio_new'>
                        <div className="theme_radio_container"
                            style={{
                                padding: "0px",
                                border: "none"
                            }}>
                            <div className="radio_single">
                                <input type="radio" name="user_status" value="active" id='active'
                                    checked={selectedUser.status === "active"} onChange={() => handleStatusChange("active")} />
                                <label htmlFor="active">Active</label>
                            </div>
                            <div className="radio_single">
                                <input type="radio" name="user_status" value="inactive" id='inactive'
                                    checked={selectedUser.status === "inactive"} onChange={() => handleStatusChange("inactive")} />
                                <label htmlFor="inactive">Inactive</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="vg22"></div>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="cancel_btn" onClick={handleClose}  >
                        Cancel
                    </div>
                    <div className="done_btn" onClick={handleSaveChanges}>
                        Save Changes
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default UserRoleStatusModal
