import React, { useState } from 'react'
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";

const PGRateCard = () => {
    // 9 dots controls
    const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
    const openMoreAddOptions = () => {
        setHandleMoreOptionsClick(true);
    };
    const closeMoreAddOptions = () => {
        setHandleMoreOptionsClick(false);
    };
    // 9 dots controls

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

                <div className="vg10"></div>
                <div className="add_rate_form">
                    <form action="">
                        <div className="row" style={{
                            rowGap: "10px"
                        }}>
                            <div className="col-md-2">
                                <div className="pg_header">
                                    <h2 className="m22 mb-1">Rates details</h2>
                                    <h4 className="r16 light_black">Lorem ipsum dolor, sit </h4>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div class="form_field">
                                    <label for="">Package</label>
                                    <div class="form_field_inner">
                                        <select name="" id="">
                                            <option value="">Package one</option>
                                            <option value="">Package two</option>
                                            <option value="">Package three</option>
                                        </select>
                                        <div class="field_icon">
                                            <span class="material-symbols-outlined">description</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div class="form_field">
                                    <label for="">Property Type</label>
                                    <div class="form_field_inner">
                                        <select name="" id="">
                                            <option value="">Villa</option>
                                            <option value="">Kothi</option>
                                        </select>
                                        <div class="field_icon">
                                            <span class="material-symbols-outlined">description</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div class="form_field">
                                    <label for="">Frequency</label>
                                    <div class="form_field_inner">
                                        <select name="" id="">
                                            <option value="">Monthly</option>
                                            <option value="">Yearly</option>
                                        </select>
                                        <div class="field_icon">
                                            <span class="material-symbols-outlined">description</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div class="form_field">
                                    <label for="">Amount</label>
                                    <div class="form_field_inner">
                                        <input required="" type="number" />
                                        <div class="field_icon">
                                            <span class="material-symbols-outlined">description</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="col-md-2">
                                <div className="theme_btn btn_fill mt-4 text-center">
                                    Add
                                </div>
                            </div>

                        </div>
                        <div className="vg22"></div>

                    </form>
                </div>
                <div className="vg22"></div>

                <div className="balance_sheet">
                    <Table responsive="sm">
                        <thead>
                            <tr>
                                <th>S.N.</th>
                                <th>Package</th>
                                <th>
                                    Property type
                                </th>
                                <th>Frequency</th>
                                <th>Amount</th>                             
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>package one</td>
                                <td>kothi</td>
                                <td>monthly</td>                            
                                <td>2000</td>
                              
                            </tr>





                        </tbody>
                    </Table>

                </div>

            </div>
        </div>
    )
}

export default PGRateCard

