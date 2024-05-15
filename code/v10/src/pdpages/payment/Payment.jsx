import React, { useState } from 'react'
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";

const Payment = () => {

    const [paymentForm, ShowPaymentForm] = useState(false);

    // 9 dots controls
    const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
    const openMoreAddOptions = () => {
        setHandleMoreOptionsClick(true);
    };
    const closeMoreAddOptions = () => {
        setHandleMoreOptionsClick(false);
    };
    // 9 dots controls

    const handelShowPaymentForm = () => {
        ShowPaymentForm(!paymentForm);
    };

    console.log("paymentform", paymentForm);

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
                                    <td>Paid</td>
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
                                        </span></Link> </td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>15/05/2024</td>
                                    <td>15/06/2024</td>
                                    <td>G-25 | mp-nagar | kanipura road | ujjain</td>
                                    <td>On-boarding Charges</td>
                                    <td>200</td>
                                    <td>5%</td>
                                    <td>2000</td>
                                    <td>Paid</td>
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
                                        </span></Link> </td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>15/05/2024</td>
                                    <td>15/06/2024</td>
                                    <td>G-25 | mp-nagar | kanipura road | ujjain</td>
                                    <td>On-boarding Charges</td>
                                    <td>200</td>
                                    <td>5%</td>
                                    <td>2000</td>
                                    <td>Paid</td>
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
                                        </span></Link> </td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>15/05/2024</td>
                                    <td>15/06/2024</td>
                                    <td>G-25 | mp-nagar | kanipura road | ujjain</td>
                                    <td>On-boarding Charges</td>
                                    <td>200</td>
                                    <td>5%</td>
                                    <td>2000</td>
                                    <td>Paid</td>
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
                                        </span></Link> </td>
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
