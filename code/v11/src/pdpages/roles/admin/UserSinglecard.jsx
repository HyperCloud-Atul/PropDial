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

    const formatPhoneNumber = (phoneNumber) => {
        const countryCode = phoneNumber.slice(0, 2);
        const mainNumber = phoneNumber.slice(2);

        const formattedMainNumber = `${mainNumber.slice(0, 5)}-${mainNumber.slice(5)}`;
        return `+${countryCode} ${formattedMainNumber}`;
    };
    return (
        <>

            {users.map((userObj) => (
                <div
                    className="pu_single tc_single relative item" key={userObj.phoneNumber} >
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
                            <h6 className="t_name">
                                {userObj.displayName}
                            </h6>
                            {userObj.phoneNumber && (
                                <h6 className="t_number">
                                    {formatPhoneNumber(userObj.phoneNumber)}
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
                    {/* <Modal show={show} onHide={handleClose} className='my_modal'>
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
                                    marginRight: "15px"
                                }}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleClose}>
                                    Save Changes
                                </Button>
                            </div>
                        </Modal.Body>
                    </Modal> */}

                </div>

            ))}

        </>

    )
}

export default UserSinglecard
