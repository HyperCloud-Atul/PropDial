import React from 'react'
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";

const Payment = () => {
    return (
        <div className='top_header_pg pg_bg'>
            <div className='page_spacing'>
                <div className="pg_header">
                    <h2 className="m22 mb-1">Payment Detail</h2>
                    <h4 className="r16 light_black">Your all payment history </h4>
                </div>
                <div className="vg22"></div>
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
            </div>
        </div>
    )
}

export default Payment
