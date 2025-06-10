import React from 'react'
import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



const UserSinglecard = ({ users }) => {


    //   modal code 
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            {users.length === 0 && <p>No Users Yet!</p>}

            {users.map((userObj) => (
                <div className="single_user">
                    <div className="us_top relative">
                        <div className="dates">
                            <h6>
                                {/* <img src="./assets/img/icons/add.png" alt="" /> */}
                                <span style={{
                                    fontSize: "14px"
                                }}> +</span> Sep 26, 2023
                            </h6>
                            |
                            <h6>
                                <div className="activeicon"></div>
                                Jan 12, 2024
                            </h6>
                        </div>
                        <img
                            src="./assets/img/icons/writing.png"
                            className="pointer edituser"
                            alt=""
                            onClick={handleShow}
                        />
                    </div>
                    <div className="user_single_inner">
                        <div className="left">
                            <div className="user_img">
                                <img src={userObj.photoURL} alt="" />
                            </div>
                        </div>
                        <div className="right">
                            <h5>{userObj.displayName}</h5>
                            <h6>{userObj.phoneNumber}
                            </h6>
                            <h6>Ujjain, India</h6>
                            <div className="wc">
                                <img
                                    src="./assets/img/icons/simple_call.png"
                                    className="pointer"
                                    alt=""
                                />
                                <img
                                    src="./assets/img/icons/simple_whatsapp.png"
                                    className="pointer"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    <Modal show={show} onHide={handleClose} className='my_modal'>
                        <Modal.Body>
                            <h6 className="m18">
                                Status
                            </h6>
                            <div className='form_field st-2 new_radio_groups_parent new_single_field n_select_bg'>
                                <div
                                    className="radio_group"
                                    style={{ display: "flex", alignItems: "center" }}
                                >

                                    <div className="radio_group_single" style={{ width: "100%" }}>
                                        <div
                                            className="custom_radio_button radiochecked"
                                        >
                                            <input
                                                type="radio"
                                                name="group_furnishing"
                                                id='active'

                                            />
                                            <label htmlFor="active">
                                                <div className="radio_icon">
                                                    <span className="material-symbols-outlined add">
                                                        add
                                                    </span>
                                                    <span className="material-symbols-outlined check">
                                                        done
                                                    </span>
                                                </div>
                                                <h6>active</h6>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="radio_group_single" style={{ width: "100%" }}>
                                        <div
                                            className="custom_radio_button"
                                        >
                                            <input
                                                type="radio"
                                                name="group_furnishing"
                                                id='inactive'

                                            />
                                            <label htmlFor="inactive">
                                                <div className="radio_icon">
                                                    <span className="material-symbols-outlined add">
                                                        add
                                                    </span>
                                                    <span className="material-symbols-outlined check">
                                                        done
                                                    </span>
                                                </div>
                                                <h6>inactive</h6>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
<div className="dvg22"></div>


<h6 className="m18">
                                Role
                            </h6>
                            <div className='form_field st-2 new_radio_groups_parent new_single_field n_select_bg'>
                                <div
                                    className="radio_group"
                                    style={{ display: "flex", alignItems: "center" }}
                                >

                                    <div className="radio_group_single" style={{ width: "100%" }}>
                                        <div
                                            className="custom_radio_button radiochecked"
                                        >
                                            <input
                                                type="radio"
                                                name="group_furnishing"
                                                id='customer'

                                            />
                                            <label htmlFor="customer">
                                                <div className="radio_icon">
                                                    <span className="material-symbols-outlined add">
                                                        add
                                                    </span>
                                                    <span className="material-symbols-outlined check">
                                                        done
                                                    </span>
                                                </div>
                                                <h6>Customer</h6>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="radio_group_single" style={{ width: "100%" }}>
                                        <div
                                            className="custom_radio_button"
                                        >
                                            <input
                                                type="radio"
                                                name="group_furnishing"
                                                id='Admin'

                                            />
                                            <label htmlFor="Admin">
                                                <div className="radio_icon">
                                                    <span className="material-symbols-outlined add">
                                                        add
                                                    </span>
                                                    <span className="material-symbols-outlined check">
                                                        done
                                                    </span>
                                                </div>
                                                <h6>Admin</h6>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="radio_group_single" style={{ width: "100%" }}>
                                        <div
                                            className="custom_radio_button"
                                        >
                                            <input
                                                type="radio"
                                                name="group_furnishing"
                                                id='Frontdesk'

                                            />
                                            <label htmlFor="Frontdesk">
                                                <div className="radio_icon">
                                                    <span className="material-symbols-outlined add">
                                                        add
                                                    </span>
                                                    <span className="material-symbols-outlined check">
                                                        done
                                                    </span>
                                                </div>
                                                <h6>Frontdesk</h6>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dvg22"></div>
                         <div className="d-flex-align-items-center">
                         <Button variant="danger" onClick={handleClose} style={{
                            marginRight:"15px"
                         }}>
                               Cancel
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
                                Save Changes
                            </Button>
                         </div>
                            </Modal.Body>
                    </Modal>
                </div>

            ))}

        </>

    )
}

export default UserSinglecard
