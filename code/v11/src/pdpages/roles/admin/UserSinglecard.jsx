import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { format } from 'date-fns';
import { useFirestore } from "../../../hooks/useFirestore";
import { useAuthContext } from "../../../hooks/useAuthContext";
import UserRoleStatusModal from './UserRoleStatusModal';

const UserSinglecard = ({ users }) => {
    //   modal code start
    const [selectedUser, setSelectedUser] = useState(null);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (userObj) => {
        setSelectedUser(userObj);
        setShow(true);
    };
    console.log("In user single card");
    //   modal code end


    // update role and status 
    const { user } = useAuthContext();
    const { updateDocument } = useFirestore("users");
    const handleSaveChanges = async () => {
        if (!selectedUser) return;
        try {
            const updatedUser = {
                ...selectedUser,
                updatedAt: new Date(),
                updatedBy: user.uid,

            };

            await updateDocument(selectedUser.id, updatedUser);
            console.log('User role and status updated successfully');
            handleClose(); // Close modal after successful update
        } catch (error) {
            console.error('Error updating user role and status:', error);
            // Handle error as needed
        }
    };

    const handleRoleChange = (newRole) => {
        setSelectedUser(prevUser => ({
            ...prevUser,
            rolePropDial: newRole
        }));
    };

    const handleStatusChange = (newStatus) => {
        setSelectedUser(prevUser => ({
            ...prevUser,
            status: newStatus
        }));
    };
    // update role and status 


    return (
        <>
            {users && users.map((userObj) => (
                <div className='pu_single' style={{
                    opacity: userObj.status === "inactive" ? 0.4 : 1
                }}>
                    <div
                        className="tc_single relative item"  >
                        <div className="left">
                            <div className="tcs_img_container" >
                                <img
                                    src={
                                        userObj.photoURL ||
                                        "/assets/img/dummy_user.png"
                                    }
                                    alt="Preview"
                                />
                            </div>
                            <div
                                className="tenant_detail"
                            >
                                <h6 className="t_name pointer"
                                    onClick={() => handleShow(userObj)}>
                                    {userObj.displayName}
                                    <span class="material-symbols-outlined click_icon text_near_icon">edit</span>
                                </h6>
                                {userObj.phoneNumber && (
                                    <h6 className="t_number">
                                        {userObj.phoneNumber.replace(
                                            /(\d{2})(\d{5})(\d{5})/,
                                            "+$1 $2-$3"
                                        )}
                                    </h6>
                                )}
                                {userObj.email && (
                                    <h6 className="t_number">
                                        {userObj.email}
                                    </h6>
                                )}
                                <h6 className="t_number">
                                    {userObj.city},{" "}{userObj.country}
                                </h6>
                            </div>
                        </div>
                        <div className="wha_call_icon">
                            <Link
                                className="call_icon wc_single"
                                to={`tel:${userObj.phoneNumber}`}
                                target="_blank"
                            >
                                <img
                                    src="/assets/img/simple_call.png"
                                    alt=""
                                />
                            </Link>
                            <Link
                                className="wha_icon wc_single"
                                to={`https://wa.me/${userObj.phoneNumber}`}
                                target="_blank"
                            >
                                <img
                                    src="/assets/img/whatsapp_simple.png"
                                    alt=""
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="dates">
                        <div className="date_single">
                            <strong>On-Boarded</strong>:{" "}
                            <span>
                                {format(userObj.createdAt.toDate(), 'dd-MMM-yy')}
                            </span>
                        </div>
                        <div className="date_single">
                            <strong>Last-Login</strong>:{" "}
                            <span>
                                {format(userObj.lastLoginTimestamp.toDate(), 'dd-MMM-yy hh:mm a')}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
            {/* {selectedUser && (
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
            )} */}
            <UserRoleStatusModal
                show={show}
                handleClose={handleClose}
                selectedUser={selectedUser}
                handleRoleChange={handleRoleChange}
                handleStatusChange={handleStatusChange}
                handleSaveChanges={handleSaveChanges}
            />

        </>

    )
}

export default UserSinglecard
