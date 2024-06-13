import React from 'react'
import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



const UserSinglecard = ({ users }) => {

    //   modal code 
    const [selectedUser, setSelectedUser] = useState(null);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (userObj) => {
        setSelectedUser(userObj);
        setShow(true);
    };
    console.log("In user single card");


    return (
        <>
            {users && users.map((userObj) => (
                <div className='pu_single'>
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
                                <h6 className="t_number">
                                    Ujjain, India
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
                    </div>
                </div>
            ))}
            {selectedUser && (
                <Modal show={show} onHide={handleClose} className='my_modal'>
                    <Modal.Body>
                        <h6 className="r16 lh22 mb-3">
                            The <span className='m16'>{selectedUser.displayName}</span> role is currently set to <span className='m16 text_blue text-capitalize'>{selectedUser.rolePropDial}</span>. You can change it here if needed.
                        </h6>
                        <div className='form_field'>
                            <div className='field_box theme_radio_new'>
                                <div className="theme_radio_container" style={{
                                    padding: "0px",
                                    border: "none"
                                }}>
                                    <div className="radio_single">
                                        <input type="radio" name="user_role" value="owner" id='owner'
                                            checked={selectedUser.rolePropDial === "owner"} />
                                        <label htmlFor="owner">owner</label>
                                    </div>
                                    <div className="radio_single">
                                        <input type="radio" name="user_role" value="frontdesk" id='frontdesk'
                                            checked={selectedUser.rolePropDial === "frontdesk"} />
                                        <label htmlFor="frontdesk">frontdesk</label>
                                    </div>
                                    <div className="radio_single">
                                        <input type="radio" name="user_role" value="admin" id='admin'
                                            checked={selectedUser.rolePropDial === "admin"} />
                                        <label htmlFor="admin">admin</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <h6 className="r16 lh22 mb-3">
                            The status for <span className='m16'>{selectedUser.displayName}</span>  is currently set to <span className={`m16 text-capitalize ${selectedUser.status === "active" ? "text_green2" : "text_red"}`}>{selectedUser.status}</span>, You can change it here if needed.
                        </h6>
                        <div className='form_field'>
                            <div className='field_box theme_radio_new'>
                                <div className="theme_radio_container" style={{
                                    padding: "0px",
                                    border: "none"
                                }}>
                                    <div className="radio_single">
                                        <input type="radio" name="user_status" value="Active" id='Active' checked={selectedUser.status === "active"} />
                                        <label htmlFor="Active">Active</label>
                                    </div>
                                    <div className="radio_single">
                                        <input type="radio" name="user_status" value="Inactive" id='Inactive' checked={selectedUser.status === "inactive"} />
                                        <label htmlFor="Inactive">Inactive</label>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="vg22"></div>
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="cancel_btn" onClick={handleClose}  >
                                Cancel
                            </div>
                            <div className="done_btn" onClick={handleClose}>
                                Save Changes
                            </div>
                        </div>

                    </Modal.Body>
                </Modal>
            )}

        </>

    )
}

export default UserSinglecard
