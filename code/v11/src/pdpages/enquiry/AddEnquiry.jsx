import React, { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";


const AddEnquiry = () => {
    // add enquiry with add document start
    const { addDocument, updateDocument, deleteDocument, error } =
        useFirestore("enquiry");


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
            const docRef = await addDocument({
                enquiryFrom,
                referredBy,
                enquiryType,
                name,
                phone,
                email,
                date: new Date(date).toISOString(), // save as ISO string including time
                enquiryStatus,
                remark,
                source,
                employeeName,
                propertyOwner,
                propertyName,
            });
            setEnquiryFrom("");
            setReferredBy("");
            setEnquiryType("");
            setName("");
            setPhone("")
            setEmail("");
            setDate("");
            setEnquiryStatus("");
            setRemark("");
            setSource("");
            setEmployeeName("");
            setPropertyOwner("");
            setPropertyName("");
            setIsUploading(false);
        } catch (error) {
            console.error("Error adding document:", error);
            setIsUploading(false);
        }
    };
    // add enquiry with add document end
    return (
        <>
            <div className="pg_header d-flex justify-content-between">
                <div className="left d-flex align-items-center pointer">
                    {/* <span class="material-symbols-outlined pointer" >
                        arrow_back
                    </span> */}
                    <h2 className="m22 mb-1">Add Enquiry
                    </h2>
                </div>

            </div>
            <hr />
            <div className="add_enquiry">
                <div className="vg12">
                </div>
                <div className="vg12"></div>
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
                                    <span class="material-symbols-outlined">
                                        calendar_month
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_field st-2 label_top">
                            <label htmlFor="">
                                Enquiry Type</label>
                            <div className="field_box theme_radio_new">
                                <div className="theme_radio_container">
                                    <div className="radio_single" >
                                        <input
                                            type="radio"
                                            name="enquiryType"
                                            id="rent"
                                            onClick={handleChangeEnquiryType}
                                            value="rent"
                                        />
                                        <label htmlFor="rent" className="radio_label">rent</label>
                                    </div>
                                    <div className="radio_single" >
                                        <input
                                            type="radio"
                                            name="enquiryType"
                                            id="sale"
                                            onClick={handleChangeEnquiryType}
                                            value="sale"

                                        />
                                        <label htmlFor="sale" className="radio_label">sale</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_field st-2 label_top">
                            <label htmlFor="">
                                Enquiry From</label>
                            <div className="field_box theme_radio_new">
                                <div className="theme_radio_container">
                                    {enquiryType.toLowerCase() === "rent" && (
                                        <div className="radio_single" >
                                            <input
                                                type="radio"
                                                name="enquiryFrom"
                                                id="tenant"
                                                onClick={handleChangeEnquiryFrom}
                                                value="prospective tenant"
                                            />
                                            <label htmlFor="tenant" className="radio_label">prospective tenant</label>
                                        </div>
                                    )}
                                    {enquiryType.toLowerCase() === "sale" && (
                                        <div className="radio_single" >
                                            <input
                                                type="radio"
                                                name="enquiryFrom"
                                                id="tenant"
                                                onClick={handleChangeEnquiryFrom}
                                                value="prospective buyer"
                                            />
                                            <label htmlFor="tenant" className="radio_label">prospective buyer</label>
                                        </div>
                                    )}


                                    <div className="radio_single" >
                                        <input
                                            type="radio"
                                            name="enquiryFrom"
                                            id="agent"
                                            onClick={handleChangeEnquiryFrom}
                                            value="agent"

                                        />
                                        <label htmlFor="agent" className="radio_label">Agent</label>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_field st-2 label_top">
                            <label htmlFor="">
                                Referred By</label>
                            <div className="field_box theme_radio_new">
                                <div className="theme_radio_container">
                                    <div className="radio_single" >
                                        <input
                                            type="radio"
                                            name="referredBy"
                                            id="owner"
                                            onClick={handleChangeReferredBy}
                                            value="owner"
                                        />
                                        <label htmlFor="owner" className="radio_label">owner</label>
                                    </div>
                                    <div className="radio_single" >
                                        <input
                                            type="radio"
                                            name="referredBy"
                                            id="propdial"
                                            onClick={handleChangeReferredBy}
                                            value="propdial"
                                        />
                                        <label htmlFor="propdial" className="radio_label">propdial</label>
                                    </div>
                                    <div className="radio_single" >
                                        <input
                                            type="radio"
                                            name="referredBy"
                                            id="employee"
                                            onClick={handleChangeReferredBy}
                                            value="employee"
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
                            <div className="form_field label_top">
                                <label htmlFor="">Property Name</label>
                                <div className="form_field_inner with_icon">
                                    <input
                                        type="text"
                                        placeholder="Search property"
                                        value={propertyName}
                                        onChange={handleChangePropertyName}
                                    />
                                    <div className="field_icon">
                                        <span class="material-symbols-outlined">
                                            search
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form_field label_top">
                                <label htmlFor="">Property Owner</label>
                                <div className="form_field_inner with_icon">
                                    <input
                                        type="text"
                                        placeholder="Search owner"
                                        value={propertyOwner}
                                        onChange={handleChangePropertyOwner}
                                    />
                                    <div className="field_icon">
                                        <span class="material-symbols-outlined">
                                            search
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form_field label_top">
                                <label htmlFor="">
                                    {enquiryFrom === "agent" ? "agent" : enquiryFrom === "prospective tenant" ? "Prospective Tenant" : enquiryFrom === "prospective buyer" ? "Prospective Buyer" : ""}
                                    {" "}
                                    Name</label>
                                <div className="form_field_inner with_icon">
                                    <input
                                        type="text"
                                        placeholder="Enter name"
                                        value={name}
                                        onChange={handleChangeName}
                                    />
                                    <div className="field_icon">
                                        <span class="material-symbols-outlined">
                                            draw
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form_field label_top">
                                <label htmlFor="">
                                    {enquiryFrom === "agent" ? "agent" : enquiryFrom === "prospective tenant" ? "Prospective Tenant" : enquiryFrom === "prospective buyer" ? "Prospective Buyer" : ""}
                                    {" "}
                                    Contact</label>
                                <div className="form_field_inner with_icon">
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
                                    <div className="field_icon">
                                        <span class="material-symbols-outlined">
                                            draw
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form_field label_top">
                                <label htmlFor="">
                                    {enquiryFrom === "agent" ? "agent" : enquiryFrom === "prospective tenant" ? "Prospective Tenant" : enquiryFrom === "prospective buyer" ? "Prospective Buyer" : ""}
                                    {" "}
                                    Email</label>
                                <div className="form_field_inner with_icon">
                                    <input
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={handleChangeEmail}
                                    />
                                    <div className="field_icon">
                                        <span class="material-symbols-outlined">
                                            draw
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="form_field label_top">
                                <label htmlFor="">Remarks (For Internal Use Only)</label>
                                <div className="form_field_inner with_icon">
                                    <textarea
                                        placeholder="Enter remarks"
                                        value={remark}
                                        onChange={handleChangeRemark}
                                    />
                                    <div className="field_icon">
                                        <span class="material-symbols-outlined">
                                            draw
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <button className="theme_btn btn_fill" onClick={submitEnquiry} disabled={isUploading}>
                                {isUploading ? "Submiting....." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default AddEnquiry
