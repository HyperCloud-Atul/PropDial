import React, { useState } from 'react'
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";

const Payment = () => {
    // 9 dots controls
    const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
    const openMoreAddOptions = () => {
        setHandleMoreOptionsClick(true);
    };
    const closeMoreAddOptions = () => {
        setHandleMoreOptionsClick(false);
    };
    // 9 dots controls

    // show and hide add payment form start

    const [paymentForm, ShowPaymentForm] = useState(false);

    const handelShowPaymentForm = () => {
        ShowPaymentForm(!paymentForm);
    };

    // show and hide add payment form end

    // status change code start 
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [status, setStatus] = useState('Approved');
    const [selectedStatus, setSelectedStatus] = useState('Approved');

    const handleEditClick = () => {
        setShowEditPopup(true);
    };

    const handleCloseClick = () => {
        setShowEditPopup(false);
    };

    const handleStatusChange = (newStatus) => {
        setSelectedStatus(newStatus);
    };

    const handleDoneClick = () => {
        setStatus(selectedStatus);
        setShowEditPopup(false);
    };
    // status change code end



    return (
        <div className='top_header_pg pg_bg'>
            <div className='page_spacing'>
                {/* 9 dots html  */}
                <div onClick={openMoreAddOptions} className="property-list-add-property">
                    <span className="material-symbols-outlined">apps</span>
                </div>
                <div
                    className={
                        handleMoreOptionsClick
                            ? "more-add-options-div open"
                            : "more-add-options-div"
                    }
                    onClick={closeMoreAddOptions}
                    id="moreAddOptions"
                >
                    <div className="more-add-options-inner-div">
                        <div className="more-add-options-icons">
                            <h1>Close</h1>
                            <span className="material-symbols-outlined">close</span>
                        </div>

                        <Link to="/newproperty" className="more-add-options-icons">
                            <h1>Add property</h1>
                            <span className="material-symbols-outlined">location_city</span>
                        </Link>

                        <Link to="" className="more-add-options-icons">
                            <h1>Add bills</h1>
                            <span class="material-symbols-outlined">receipt_long</span>
                        </Link>

                        <Link to="/addnotification/new" className="more-add-options-icons">
                            <h1>Add notification</h1>
                            <span class="material-symbols-outlined">notifications</span>
                        </Link>
                    </div>
                </div>
                {/* 9 dots html  */}
                <Link className="bottom_add_button" onClick={handelShowPaymentForm}>
                    <span class="material-symbols-outlined">
                        {paymentForm ? "close" : "add"}
                    </span>
                </Link>
                <div className="pg_header">
                    <h2 className="m22 mb-1">Payment Detail</h2>
                    <h4 className="r16 light_black">Your all payment history </h4>
                </div>
                <div className="vg22"></div>
                {paymentForm && (
                    <div className="add_payment_form">
                        <form action="">
                            <div className="row" style={{
                                rowGap: "10px"
                            }}>
                                <div className="col-md-4">
                                    <div class="form_field">
                                        <label for="">Created Date</label>
                                        <div class="form_field_inner">
                                            <input required="" type="date" />
                                            <div class="field_icon">
                                                <span class="material-symbols-outlined">description</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div class="form_field">
                                        <label for="">Due Date</label>
                                        <div class="form_field_inner">
                                            <input required="" type="date" />
                                            <div class="field_icon">
                                                <span class="material-symbols-outlined">description</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div class="form_field">
                                        <label for="">Property</label>
                                        <div class="form_field_inner">
                                            <select name="" id="">
                                                <option value="">property one</option>
                                                <option value="">property two</option>
                                            </select>
                                            <div class="field_icon">
                                                <span class="material-symbols-outlined">description</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div class="form_field">
                                        <label for="">Remark</label>
                                        <div class="form_field_inner">
                                            <select name="" id="">
                                                <option value="">property one</option>
                                                <option value="">property two</option>
                                            </select>
                                            <div class="field_icon">
                                                <span class="material-symbols-outlined">description</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div class="form_field">
                                        <label for="">Expences amount</label>
                                        <div class="form_field_inner">
                                            <input type="number" placeholder='here' />
                                            <div class="field_icon">
                                                <span class="material-symbols-outlined">description</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div class="form_field">
                                        <label for="">Discount</label>
                                        <div class="form_field_inner">
                                            <select name="" id="">
                                                <option value="">5%</option>
                                                <option value="">10%</option>
                                            </select>
                                            <div class="field_icon">
                                                <span class="material-symbols-outlined">description</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div class="form_field">
                                        <label for="">payment amount</label>
                                        <div class="form_field_inner">
                                            <input type="number" placeholder='here' />
                                            <div class="field_icon">
                                                <span class="material-symbols-outlined">description</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div class="form_field">
                                        <label for="">status</label>
                                        <div class="form_field_inner">
                                            <select name="" id="">
                                                <option value="">Paid</option>
                                                <option value="">Unpaid</option>
                                            </select>
                                            <div class="field_icon">
                                                <span class="material-symbols-outlined">description</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="theme_btn btn_fill mt-4 text-center">
                                        Add
                                    </div>
                                </div>

                            </div>
                            <div className="vg22"></div>

                        </form>
                    </div>
                )}
                {!paymentForm && (
                    <div className="balance_sheet">
                        <Table responsive="sm">
                            <thead>
                                <tr>
                                    <th>S.N.</th>
                                    <th>Created Date</th>
                                    <th>
                                        Due Date
                                    </th>
                                    <th>Property Details</th>
                                    <th>Remark</th>
                                    <th>Exp. Amount</th>
                                    <th>Dis.</th>
                                    <th>Pay Amount</th>
                                    <th>Status</th>
                                    <th>View</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>15/05/2024</td>
                                    <td>15/06/2024</td>
                                    <td>G-25 | mp-nagar | kanipura road | ujjain</td>
                                    <td>On-boarding Charges</td>
                                    <td>200</td>
                                    <td>5%</td>
                                    <td>2000</td>
                                    <td className='relative'>
                                        <div className={`editable_text ${status.toLowerCase()}`} onClick={handleEditClick}>
                                            <span>
                                                {status}
                                            </span>
                                            <span class="material-symbols-outlined">
                                                edit
                                            </span>
                                        </div>
                                        {/* Edit Popup */}
                                        {showEditPopup && (
                                            <div className="edit_status_popup">
                                                <div className="edit_content">
                                                    <div className='form_field'>
                                                        {/* <label htmlFor="" className='label text-center mb-3'>Edit Status</label> */}
                                                        <div className='field_box theme_radio_new'>
                                                            <div className="theme_radio_container">
                                                                <div className="radio_single">
                                                                    <input type="radio" name="status" value="Approved" id='approved' checked={selectedStatus === 'Approved'} onChange={() => handleStatusChange('Approved')} />
                                                                    <label htmlFor="approved">Approved</label>
                                                                </div>
                                                                <div className="radio_single">
                                                                    <input type="radio" name="status" value="Pending" id='pending' checked={selectedStatus === 'Pending'} onChange={() => handleStatusChange('Pending')} />
                                                                    <label htmlFor="pending">pending</label>
                                                                </div>
                                                                <div className="radio_single">
                                                                    <input type="radio" name="status" value="Status 3" id='status3' checked={selectedStatus === 'Status 3'} onChange={() => handleStatusChange('Status 3')} />
                                                                    <label htmlFor="status3">Status 3</label>
                                                                </div>
                                                                <div className="radio_single">
                                                                    <input type="radio" name="status" value="Status 4" id='status4' checked={selectedStatus === 'Status 4'} onChange={() => handleStatusChange('Status 4')} />
                                                                    <label htmlFor="status4">Status 4</label>
                                                                </div>
                                                                <div className="radio_single">
                                                                    <input type="radio" name="status" value="Status 5" id='status5' checked={selectedStatus === 'Status 5'} onChange={() => handleStatusChange('Status 5')} />
                                                                    <label htmlFor="status5">Status 5</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between" style={{
                                                        gap: "10px",
                                                        marginTop: "10px"
                                                    }}>
                                                        <div className="theme_btn btn_border pointer" onClick={handleCloseClick}>
                                                            Close
                                                        </div>
                                                        <div className="theme_btn btn_fill  pointer" onClick={handleDoneClick}>
                                                            Change
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <Link className='click_icon'>
                                            <span class="material-symbols-outlined">
                                                visibility
                                            </span>
                                        </Link>
                                    </td>
                                    <td> <Link className="click_icon">
                                        <span class="material-symbols-outlined">
                                            more_vert
                                        </span>
                                        </Link> </td>
                                </tr>





                            </tbody>
                        </Table>

                    </div>
                )}
            </div>
        </div>
    )
}

export default Payment
