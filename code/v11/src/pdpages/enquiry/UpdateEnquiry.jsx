import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDocument } from "../../hooks/useDocument";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const UpdateEnquiry = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updateDocument, error } = useFirestore("enquiry");
    const { document: enquiryDocument, error: enquiryDocError } = useDocument(
        "enquiry",
        id
    );

    const [enquiryFrom, setEnquiryFrom] = useState("");
    const [referredBy, setReferredBy] = useState("");
    const [enquiryType, setEnquiryType] = useState("");
    const [source, setSource] = useState("");
    const [name, setName] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [propertyOwner, setPropertyOwner] = useState("");
    const [propertyName, setPropertyName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [date, setDate] = useState(new Date());
    const [enquiryStatus, setEnquiryStatus] = useState("open");
    const [remark, setRemark] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (enquiryDocument) {
            setEnquiryFrom(enquiryDocument.enquiryFrom || "");
            setReferredBy(enquiryDocument.referredBy || "");
            setEnquiryType(enquiryDocument.enquiryType || "");
            setSource(enquiryDocument.source || "");
            setName(enquiryDocument.name || "");
            setEmployeeName(enquiryDocument.employeeName || "");
            setPropertyOwner(enquiryDocument.propertyOwner || "");
            setPropertyName(enquiryDocument.propertyName || "");
            setPhone(enquiryDocument.phone || "");
            setEmail(enquiryDocument.email || "");
            setDate(new Date(enquiryDocument.date) || new Date());
            setEnquiryStatus(enquiryDocument.enquiryStatus || "open");
            setRemark(enquiryDocument.remark || "");
        }
    }, [enquiryDocument]);

    const handleChangeEnquiryFrom = (event) => setEnquiryFrom(event.target.value);
    const handleChangeReferredBy = (event) => setReferredBy(event.target.value);
    const handleChangeEnquiryType = (event) => setEnquiryType(event.target.value);
    const handleChangeName = (event) => setName(event.target.value);
    const handleChangePhone = (phone) => setPhone(phone);
    const handleChangeEmail = (event) => setEmail(event.target.value);
    const handleChangeDate = (date) => setDate(date);
    const handleChangeEnquiryStatus = (event) => setEnquiryStatus(event.target.value);
    const handleChangeRemark = (event) => setRemark(event.target.value);
    const handleChangeSource = (event) => setSource(event.target.value);
    const handleChangeEmployeeName = (event) => setEmployeeName(event.target.value);
    const handleChangePropertyName = (event) => setPropertyName(event.target.value);
    const handleChangePropertyOwner = (event) => setPropertyOwner(event.target.value);

    const submitEnquiry = async (event) => {
        event.preventDefault();
        if (!name) {
            alert("All fields are required!");
            return;
        }
        try {
            setIsUploading(true);

            const newStatusUpdate = {
                status: enquiryStatus,
                // timestamp: new Date().toISOString(),
                updatedAt: (new Date()),
            };

            const updatedDocument = {
                enquiryFrom,
                referredBy,
                enquiryType,
                name,
                phone,
                email,
                date: new Date(date).toISOString(),
                enquiryStatus,
                remark,
                source,
                employeeName,
                propertyOwner,
                propertyName,
            };

            if (enquiryDocument?.statusUpdates) {
                updatedDocument.statusUpdates = [
                    ...enquiryDocument.statusUpdates,
                    newStatusUpdate,
                ];
            } else {
                updatedDocument.statusUpdates = [newStatusUpdate];
            }
            await updateDocument(id, updatedDocument);
            setIsUploading(false);
            navigate("/enquiry/all");
        } catch (error) {
            console.error("Error updating document:", error);
            setIsUploading(false);
        }
    };

    // get enquiry status   

    useEffect(() => {
        if (enquiryDocument) {
            const lastStatus = enquiryDocument?.statusUpdates?.length
                ? enquiryDocument.statusUpdates[enquiryDocument.statusUpdates.length - 1].status
                : "open";
            setEnquiryStatus(lastStatus);
        }
    }, [enquiryDocument]);

    const getStatusOptions = (currentStatus) => {
        switch (currentStatus) {
            case "open":
                return ["open", "working"];
            case "working":
                return ["working", "successful", "dead"];
            default:
                return ["working", "successful", "dead"];
        }
    };

    const statusOptions = getStatusOptions(enquiryStatus);
    // get enquiry status 

    const backViewEnquiry = () => {
        navigate("/enquiry/all");
    };

    return (
        <div className="top_header_pg pg_bg pg_enquiry">
            <div className="page_spacing">
                <div className="pg_header d-flex justify-content-between">
                    <div className="left d-flex align-items-center pointer" style={{
                        gap: "5px"
                    }}>
                        <span class="material-symbols-outlined pointer" onClick={backViewEnquiry} >
                            arrow_back
                        </span>
                        <h2 className="m22 mb-1">Update Enquiry
                        </h2>
                    </div>
                    <div className="right">
                        <div className="d-flex align-items-center" style={{
                            gap:"22px"
                        }} >
                            <Link to="/enquiry/all" className="theme_btn btn_border">
                                Cancel
                            </Link>
                            <button className="theme_btn btn_fill" onClick={submitEnquiry}
                                disabled={isUploading}>
                                {isUploading ? "Updating..." : "Update Enquiry"}
                            </button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="add_enquiry">
                    <div className="vg22"></div>
                    <div className="row row_gap">
                        <div className="col-md-4">
                            <div className="form_field label_top">
                                <label htmlFor="">Click To Select Date</label>
                                <div className="form_field_inner with_icon">
                                    <DatePicker
                                        selected={date}
                                        onChange={handleChangeDate}
                                        maxDate={new Date()}
                                        minDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                    <div className="field_icon">
                                        <span className="material-symbols-outlined">calendar_month</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form_field st-2 label_top">
                                <label htmlFor="">Enquiry Type</label>
                                <div className="field_box theme_radio_new">
                                    <div className="theme_radio_container">
                                        <div className="radio_single">
                                            <input
                                                type="radio"
                                                name="enquiryType"
                                                id="rent"
                                                onClick={handleChangeEnquiryType}
                                                value="rent"
                                                checked={enquiryType === "rent"}
                                            />
                                            <label htmlFor="rent" className="radio_label">rent</label>
                                        </div>
                                        <div className="radio_single">
                                            <input
                                                type="radio"
                                                name="enquiryType"
                                                id="sale"
                                                onClick={handleChangeEnquiryType}
                                                value="sale"
                                                checked={enquiryType === "sale"}
                                            />
                                            <label htmlFor="sale" className="radio_label">sale</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form_field st-2 label_top">
                                <label htmlFor="">Enquiry From</label>
                                <div className="field_box theme_radio_new">
                                    <div className="theme_radio_container">
                                        {enquiryType.toLowerCase() === "rent" && (
                                            <div className="radio_single">
                                                <input
                                                    type="radio"
                                                    name="enquiryFrom"
                                                    id="tenant"
                                                    onClick={handleChangeEnquiryFrom}
                                                    value="prospective tenant"
                                                    checked={enquiryFrom === "prospective tenant"}
                                                />
                                                <label htmlFor="tenant" className="radio_label">prospective tenant</label>
                                            </div>
                                        )}
                                        {enquiryType.toLowerCase() === "sale" && (
                                            <div className="radio_single">
                                                <input
                                                    type="radio"
                                                    name="enquiryFrom"
                                                    id="buyer"
                                                    onClick={handleChangeEnquiryFrom}
                                                    value="prospective buyer"
                                                    checked={enquiryFrom === "prospective buyer"}
                                                />
                                                <label htmlFor="buyer" className="radio_label">prospective buyer</label>
                                            </div>
                                        )}
                                        <div className="radio_single">
                                            <input
                                                type="radio"
                                                name="enquiryFrom"
                                                id="agent"
                                                onClick={handleChangeEnquiryFrom}
                                                value="agent"
                                                checked={enquiryFrom === "agent"}
                                            />
                                            <label htmlFor="agent" className="radio_label">Agent</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form_field st-2 label_top">
                                <label htmlFor="">Referred By</label>
                                <div className="field_box theme_radio_new">
                                    <div className="theme_radio_container">
                                        <div className="radio_single">
                                            <input
                                                type="radio"
                                                name="referredBy"
                                                id="owner"
                                                onClick={handleChangeReferredBy}
                                                value="owner"
                                                checked={referredBy === "owner"}
                                            />
                                            <label htmlFor="owner" className="radio_label">owner</label>
                                        </div>
                                        <div className="radio_single">
                                            <input
                                                type="radio"
                                                name="referredBy"
                                                id="propdial"
                                                onClick={handleChangeReferredBy}
                                                value="propdial"
                                                checked={referredBy === "propdial"}
                                            />
                                            <label htmlFor="propdial" className="radio_label">propdial</label>
                                        </div>
                                        <div className="radio_single">
                                            <input
                                                type="radio"
                                                name="referredBy"
                                                id="employee"
                                                onClick={handleChangeReferredBy}
                                                value="employee"
                                                checked={referredBy === "employee"}
                                            />
                                            <label htmlFor="employee" className="radio_label">employee</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {referredBy === "propdial" && (
                            <div className="col-md-8">
                                <div className="form_field st-2 label_top">
                                    <label htmlFor="">
                                        Source</label>
                                    <div className="field_box theme_radio_new">
                                        <div className="theme_radio_container">
                                            <div className="radio_single" >
                                                <input
                                                    type="radio"
                                                    name="source"
                                                    id="99acres"
                                                    onClick={handleChangeSource}
                                                    value="99acres"
                                                    checked={source === "99acres"}

                                                />
                                                <label htmlFor="99acres" className="radio_label">99acres</label>
                                            </div>
                                            <div className="radio_single" >
                                                <input
                                                    type="radio"
                                                    name="source"
                                                    id="magicBricks"
                                                    onClick={handleChangeSource}
                                                    value="magicbricks"
                                                    checked={source === "magicbricks"}

                                                />
                                                <label htmlFor="magicBricks" className="radio_label">magicbricks</label>
                                            </div>
                                            <div className="radio_single" >
                                                <input
                                                    type="radio"
                                                    name="source"
                                                    id="housing"
                                                    onClick={handleChangeSource}
                                                    value="housing"
                                                    checked={source === "housing"}
                                                />
                                                <label htmlFor="housing" className="radio_label">housing</label>
                                            </div>
                                            <div className="radio_single" >
                                                <input
                                                    type="radio"
                                                    name="source"
                                                    id="other"
                                                    onClick={handleChangeSource}
                                                    value="other"
                                                    checked={source === "other"}
                                                />
                                                <label htmlFor="other" className="radio_label">other</label>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {referredBy === "employee" && (
                            <div className="col-md-8">
                                <div className="form_field label_top">
                                    <label htmlFor="">Employee Name</label>
                                    <div className="form_field_inner with_icon">
                                        <input
                                            type="text"
                                            placeholder="Select employee"
                                            value={employeeName}
                                            onChange={handleChangeEmployeeName}
                                        />
                                        <div className="field_icon">
                                            <span class="material-symbols-outlined">
                                                search
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="row row_gap">
                            <div className="col-md-6">
                                <div className="form_field st-2 label_top">
                                    <label htmlFor="">Property Name</label>
                                    <input
                                        type="text"
                                        className="input_field"
                                        value={propertyName}
                                        onChange={handleChangePropertyName}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form_field st-2 label_top">
                                    <label htmlFor="">Property Owner</label>
                                    <input
                                        type="text"
                                        className="input_field"
                                        value={propertyOwner}
                                        onChange={handleChangePropertyOwner}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form_field st-2 label_top">
                                    <label htmlFor="">
                                        {enquiryFrom === "agent" ? "agent" : enquiryFrom === "prospective tenant" ? "Prospective Tenant" : enquiryFrom === "prospective buyer" ? "Prospective Buyer" : ""}
                                        {" "}
                                        Name</label>
                                    <input
                                        type="text"
                                        className="input_field"
                                        value={name}
                                        onChange={handleChangeName}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form_field label_top">
                                    <label htmlFor="">
                                        {enquiryFrom === "agent" ? "agent" : enquiryFrom === "prospective tenant" ? "Prospective Tenant" : enquiryFrom === "prospective buyer" ? "Prospective Buyer" : ""}
                                        {" "}
                                        Contact</label>
                                    <div className="form_field_inner with_flag">
                                        <PhoneInput
                                            country={"in"}
                                            onlyCountries={['in', 'us', 'ae']}
                                            value={phone}
                                            onChange={handleChangePhone}
                                            international
                                            keyboardType="phone-pad"
                                            countryCodeEditable={true}
                                            placeholder="Country code + mobile number"
                                            inputProps={{
                                                name: "phone",
                                                required: true,
                                                autoFocus: false,
                                            }}
                                            inputStyle={{
                                                width: '100%',
                                                paddingLeft: '45px',
                                            }}
                                            buttonStyle={{
                                                textAlign: 'left',
                                            }}
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form_field label_top">
                                    <label htmlFor="">
                                        {enquiryFrom === "agent" ? "agent" : enquiryFrom === "prospective tenant" ? "Prospective Tenant" : enquiryFrom === "prospective buyer" ? "Prospective Buyer" : ""}
                                        {" "}
                                        Email</label>
                                    <input
                                        type="email"
                                        className="input_field"
                                        value={email}
                                        onChange={handleChangeEmail}
                                    />
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="form_field label_top">
                                    <label htmlFor="">Remark</label>
                                    <input
                                        type="text"
                                        className="input_field"
                                        value={remark}
                                        onChange={handleChangeRemark}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form_field st-2 label_top">
                                    <label htmlFor="">Enquiry Status</label>
                                    <div className="field_box theme_radio_new">
                                        <div className="theme_radio_container">
                                            {statusOptions.includes("open") && (
                                                <div className="radio_single">
                                                    <input
                                                        type="radio"
                                                        name="enquiryStatus"
                                                        id="open"
                                                        onClick={handleChangeEnquiryStatus}
                                                        value="open"
                                                        checked={enquiryStatus === "open"}
                                                    />
                                                    <label htmlFor="open" className="radio_label">Open</label>
                                                </div>
                                            )}
                                            {statusOptions.includes("working") && (
                                                <div className="radio_single">
                                                    <input
                                                        type="radio"
                                                        name="enquiryStatus"
                                                        id="working"
                                                        onClick={handleChangeEnquiryStatus}
                                                        value="working"
                                                        checked={enquiryStatus === "working"}
                                                    />
                                                    <label htmlFor="working" className="radio_label">Working</label>
                                                </div>
                                            )}
                                            {statusOptions.includes("successful") && (
                                                <div className="radio_single">
                                                    <input
                                                        type="radio"
                                                        name="enquiryStatus"
                                                        id="successful"
                                                        onClick={handleChangeEnquiryStatus}
                                                        value="successful"
                                                        checked={enquiryStatus === "successful"}
                                                    />
                                                    <label htmlFor="successful" className="radio_label">Successful</label>
                                                </div>
                                            )}
                                            {statusOptions.includes("dead") && (
                                                <div className="radio_single">
                                                    <input
                                                        type="radio"
                                                        name="enquiryStatus"
                                                        id="dead"
                                                        onClick={handleChangeEnquiryStatus}
                                                        value="dead"
                                                        checked={enquiryStatus === "dead"}
                                                    />
                                                    <label htmlFor="dead" className="radio_label">Dead</label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 d-flex justify-content-end" style={{
                                gap:"22px"
                            }} >
                                <Link to="/enquiry/all" className="theme_btn btn_border">
                                    Cancel
                                </Link>
                                <button className="theme_btn btn_fill" onClick={submitEnquiry}
                                    disabled={isUploading}>
                                    {isUploading ? "Updating..." : "Update Enquiry"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
             
            </div>
        </div>

    );
};

export default UpdateEnquiry;
