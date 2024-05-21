import React, { useState } from 'react'
import Table from 'react-bootstrap/Table';
import { Link, useParams } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";
import ReactTable from '../../components/ReactTable';
import { useDocument } from '../../hooks/useDocument';
import { useCollection } from '../../hooks/useCollection';

const COLUMNS = [
    // {
    //     Header: 'Id',
    //     accessor: 'id'
    // },
    {
        Header: 'Expense Amount',
        disableFilters: true, //disable column filter for particular column
        accessor: 'expenseAmount'
    },
    {
        Header: 'Discount',
        disableFilters: true, //disable column filter for particular column
        accessor: 'discount'
    },
    {
        Header: 'Payment Amount',
        disableFilters: true, //disable column filter for particular column
        accessor: 'paymentAmount'
    },
    {
        Header: 'Status',
        disableFilters: true, //disable column filter for particular column
        accessor: 'paymentStatus'
    },
    {
        Header: 'Remarks',
        disableFilters: true, //disable column filter for particular column
        accessor: 'remarks'
    },
    {
        Header: 'Due Date',
        disableFilters: true, //disable column filter for particular column
        accessor: 'dueDate'
    },

]

const PGTransactions = () => {

    const { propertyid } = useParams();
    console.log("property id: ", propertyid)


    const { document: propertydoc, error: propertydocError } = useDocument('properties', propertyid)
    console.log("property doc:  ", propertydoc)

    const { documents: transactions, error: transactionserror } = useCollection("transactions", ["propertyid", "==", propertyid]);
    // const { documents: dbticketdocuments, error: dbticketerror } = useCollection(
    //     "tickets",
    //     ["postedBy", "==", "Propdial"],
    //     ["updatedAt", "desc"]
    // );
    console.log('transactions: ', transactions)

    const [transactionDetails, setTransactionDetails] = useState({
        // All select type        
        DueDate: "",
        PropertyAddress: "",
        Remarks: "",
        ExpenseAmount: 0,
        Discount: 0,
        PaymentAmount: 0,
        PaymentStatus: "UNPAID"
    });

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

    // console.log("paymentform", paymentForm);

    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const { addDocument, response: addDocumentResponse } = useFirestore("transactions");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        let errorFlag = false;
        const transaction = {
            propertyid,
            dueDate: transactionDetails.DueDate,
            propertyAddress: propertydoc.unitNumber + "," + propertydoc.locality + "," + propertydoc.society + "," + propertydoc.city,
            remarks: transactionDetails.Remarks,
            expenseAmount: transactionDetails.ExpenseAmount,
            discount: transactionDetails.Discount,
            paymentAmount: transactionDetails.PaymentAmount,
            paymentStatus: transactionDetails.PaymentStatus,
            deleted: false,
        };

        if (!errorFlag) {
            console.log("new transaction created: ")
            setFormSuccess("Transaction Created Successfully");
            setFormError(null)
            await addDocument(transaction);
            if (addDocumentResponse.error) {
                // navigate("/transaction");
            } else {
                // var x = document.getElementById("btn_create").name;
                // document.getElementById("btn_create").innerHTML = "Properties";
                // navigate("/dashboard");
                // setNewProperty(newProperty);
            }
        }
    }

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
                    <h2 className="m22 mb-1">Transaction Detail</h2>
                    <h4 className="r16 light_black">Your all transaction history </h4>
                </div>
                {propertydoc && <div className="pg_header">
                    <h2 className="m22 mb-1">{propertydoc.unitNumber}, {propertydoc.locality}, {propertydoc.society}, {propertydoc.city}</h2>
                </div>}
                <div className="vg22"></div>
                {paymentForm && (
                    <div className="add_payment_form">
                        <form action="">
                            <div className="row" style={{
                                rowGap: "10px"
                            }}>
                                <div className="col-md-4">
                                    <div class="form_field">
                                        <label for="">Expences amount</label>
                                        <div class="form_field_inner">
                                            <input
                                                required
                                                type="number"
                                                placeholder="Enter Amount"
                                                maxLength={6}
                                                onChange={(e) =>
                                                    setTransactionDetails({
                                                        ...transactionDetails,
                                                        ExpenseAmount: e.target.value.trim(),
                                                    })
                                                }
                                                value={transactionDetails && transactionDetails.ExpenseAmount}
                                            />
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
                                            <input
                                                required
                                                type="number"
                                                placeholder="Enter Discount"
                                                maxLength={2}
                                                onChange={(e) =>
                                                    setTransactionDetails({
                                                        ...transactionDetails,
                                                        Discount: e.target.value.trim(),
                                                    })
                                                }
                                                value={transactionDetails && transactionDetails.Discount}
                                            />
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
                                            <input
                                                required
                                                type="number"
                                                placeholder="Enter Amount"
                                                maxLength={6}
                                                onChange={(e) =>
                                                    setTransactionDetails({
                                                        ...transactionDetails,
                                                        PaymentAmount: e.target.value.trim(),
                                                    })
                                                }
                                                value={transactionDetails && transactionDetails.PaymentAmount}
                                            />
                                            <div class="field_icon">
                                                <span class="material-symbols-outlined">description</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-md-4">
                                    <div class="form_field">
                                        <label for="">Created Date</label>
                                        <div class="form_field_inner">
                                            <input required="" type="date" />
                                            <div class="field_icon">
                                                <span class="material-symbols-outlined">description</span>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="col-md-4">
                                    <div class="form_field">
                                        <label for="">Due Date</label>
                                        <div class="form_field_inner">
                                            {/* <input required="" type="date" /> */}

                                            <input
                                                required
                                                type="date"
                                                onChange={(e) =>
                                                    setTransactionDetails({
                                                        ...transactionDetails,
                                                        DueDate: e.target.value.trim(),
                                                    })
                                                }
                                                value={transactionDetails && transactionDetails.DueDate}
                                            />
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
                                            <input
                                                type="text"
                                                placeholder="Enter Remarks"
                                                maxLength={100}
                                                onChange={(e) =>
                                                    setTransactionDetails({
                                                        ...transactionDetails,
                                                        Remarks: e.target.value.trim(),
                                                    })
                                                }
                                                value={transactionDetails && transactionDetails.Remarks}
                                            />
                                            <div class="field_icon">
                                                <span class="material-symbols-outlined">description</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div class="form_field">
                                        <label for="">Status</label>
                                        <div class="form_field_inner">
                                            <select
                                                value={transactionDetails && transactionDetails.PaymentStatus}
                                                onChange={(e) => {
                                                    setTransactionDetails({
                                                        ...transactionDetails,
                                                        PaymentStatus: e.target.value,
                                                    });
                                                }}
                                            >
                                                <option
                                                    defaultValue={
                                                        transactionDetails && transactionDetails
                                                            .PaymentStatus === "Select Payment Status"
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    Select Payment Status
                                                </option>
                                                <option
                                                    defaultValue={
                                                        transactionDetails && transactionDetails.PaymentStatus === "UNPAID"
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    UNPAID
                                                </option>
                                                <option
                                                    defaultValue={
                                                        transactionDetails && transactionDetails.PaymentStatus === "PAID"
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    PAID
                                                </option>
                                            </select>

                                            <div class="field_icon">
                                                <span class="material-symbols-outlined">description</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-md-4">
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
                                </div> */}

                                <div className="col-md-4">
                                    <div className="theme_btn btn_fill mt-4 text-center">
                                        <button className="theme_btn btn_fill" onClick={handleSubmit} style={{
                                            width: "100%"
                                        }}>
                                            {"Add"}
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <div className="vg22"></div>

                        </form>
                    </div>
                )}

                {/* React Table to show the data */}
                {!paymentForm && transactions && <ReactTable tableColumns={COLUMNS} tableData={transactions}></ReactTable>}

            </div>
        </div>
    )
}

export default PGTransactions
