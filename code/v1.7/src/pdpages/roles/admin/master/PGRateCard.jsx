import React, { useState } from 'react'
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";
import { useFirestore } from '../../../../hooks/useFirestore';
import { useDocument } from '../../../../hooks/useDocument';
import { useCollection } from '../../../../hooks/useCollection';
import ReactTable from '../../../../components/ReactTable';
import ReactTableColumnFilter from '../../../../components/ReactTableColumnFilter';

const COLUMNS = [
    // {
    //     Header: 'Id',
    //     accessor: 'id'
    // },
    {
        Header: 'Package',
        accessor: 'package'
    },
    {
        Header: 'Property Type',
        accessor: 'propertytype'
    },
    {
        Header: 'Property Size',
        accessor: 'size',
        disableSortBy: true,
    },
    {
        Header: 'Frequency',
        accessor: 'frequency'
    },
    {
        Header: 'Amount',
        disableFilters: true, //disable column filter for particular column
        accessor: 'amount',
        disableSortBy: true,
    },
]


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

    const { documents: ratecards, error: ratecardserror } = useCollection("ratecard");
    console.log('ratecards: ', ratecards)

    const [propertyDetails, setPropertyDetails] = useState({
        // All select type
        Package: "",
        PropertyType: "",
        PropertySize: "",
        Frequency: "",
        Amount: "",
    });

    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const { addDocument, response: addDocumentResponse } = useFirestore("ratecard");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        let errorFlag = false;
        const ratecard = {
            package: propertyDetails.Package,
            propertytype: propertyDetails.PropertyType,
            size: propertyDetails.PropertySize,
            frequency: propertyDetails.Frequency,
            amount: propertyDetails.Amount
        };

        if (!errorFlag) {
            setFormSuccess("Rate Card Added Successfully");
            setFormError(null)
            await addDocument(ratecard);
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
                            <span className="material-symbols-outlined">receipt_long</span>
                        </Link>

                        <Link to="/addnotification/new" className="more-add-options-icons">
                            <h1>Add notification</h1>
                            <span className="material-symbols-outlined">notifications</span>
                        </Link>
                    </div>
                </div>
                {/* 9 dots html  */}

                <div className="vg10"></div>
                {/* Form to add Rate card  */}
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
                                <div className="form_field">
                                    <label for="">Package</label>
                                    <div className="form_field_inner">

                                        <select
                                            value={propertyDetails && propertyDetails.Package}
                                            onChange={(e) => {
                                                setPropertyDetails({
                                                    ...propertyDetails,
                                                    Package: e.target.value,
                                                });
                                            }}
                                        >
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.Package === "Select Package"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Select Package
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.Package === "PMS Premium"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                PMS Premium
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.Package === "PMS Light"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                PMS Light
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.Package === "PMS Sale"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                PMS Sale
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.Package === "Pre PMS"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Pre PMS
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.Package === "Rent Only"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Rent Only{" "}
                                            </option>


                                        </select>
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">description</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Property Type */}
                            <div className="col-md-2">
                                <div className="form_field">
                                    <label for="">Property Type</label>
                                    <div className="form_field_inner">

                                        <select
                                            value={propertyDetails && propertyDetails.PropertyType}
                                            onChange={(e) => {
                                                setPropertyDetails({
                                                    ...propertyDetails,
                                                    PropertyType: e.target.value,
                                                });
                                            }}
                                        >
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertyType === "Select Type"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Select Type
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertyType === "High Rise Apt"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                High Rise Apt
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertyType === "Low Rise Apt"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Low Rise Apt
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertyType === "Builder Floor"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Builder Floor
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertyType === "Kothi"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Kothi
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertyType === "Villa - Simplex"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Villa - Simplex{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertyType === "Villa - Duplex"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Villa - Duplex{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertyType === "Pent House - Simplex"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Pent House - Simplex{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertyType === "Pent House - Duplex"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Pent House - Duplex{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertyType === "Row House - Simplex"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Row House - Simplex{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertyType === "Row House - Duplex"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Row House - Duplex{" "}
                                            </option>

                                        </select>
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">description</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Property Size */}
                            <div className="col-md-2">
                                <div className="form_field">
                                    <label for="">Property Size</label>
                                    <div className="form_field_inner">
                                        <select
                                            value={propertyDetails && propertyDetails.PropertySize}
                                            onChange={(e) => {
                                                setPropertyDetails({
                                                    ...propertyDetails,
                                                    PropertySize: e.target.value,
                                                });
                                            }}
                                        >
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "Select Size"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Select Size
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "EWS"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                EWS
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "1 RK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                1 RK
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "Studio"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Studio
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "1 BHK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                1 BHK
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "1.5 BHK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                1.5 BHK{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "2 BHK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                2 BHK{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "2.5 BHK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                2.5 BHK{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "3 BHK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                3 BHK{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "3.5 BHK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                3.5 BHK{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "4 BHK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                4 BHK{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "5 BHK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                5 BHK{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "6 BHK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                6 BHK{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "7 BHK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                7 BHK{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "8 BHK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                8 BHK{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "9 BHK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                9 BHK{" "}
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.PropertySize === "9+ BHK"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                9+ BHK{" "}
                                            </option>
                                        </select>
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">description</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form_field">
                                    <label for="">Frequency</label>
                                    <div className="form_field_inner">

                                        <select
                                            value={propertyDetails && propertyDetails.Frequency}
                                            onChange={(e) => {
                                                setPropertyDetails({
                                                    ...propertyDetails,
                                                    Frequency: e.target.value,
                                                });
                                            }}
                                        >
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.Frequency === "Select Frequency"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Select Frequency
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.Frequency === "YEARLY"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                YEARLY
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.Frequency === "QUARTERLY"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                QUARTERLY
                                            </option>
                                            <option
                                                defaultValue={
                                                    propertyDetails && propertyDetails.Frequency === "MONTHLY"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                MONTHLY
                                            </option>
                                        </select>
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">description</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form_field">
                                    <label for="">Amount</label>
                                    <div className="form_field_inner">
                                        <input
                                            required
                                            type="number"
                                            placeholder="Enter Amount"
                                            maxLength={100}
                                            onChange={(e) =>
                                                setPropertyDetails({
                                                    ...propertyDetails,
                                                    Amount: e.target.value.trim(),
                                                })
                                            }
                                            value={propertyDetails && propertyDetails.Amount}
                                        />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">description</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="col-md-2">
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
                <div className="vg22"></div>
                {ratecards && <ReactTable tableColumns={COLUMNS} tableData={ratecards}></ReactTable>}

                {/* <div className="vg22"></div> */}
                {/* <div className="balance_sheet">
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
                </div> */}

            </div>
        </div >
    )
}

export default PGRateCard

