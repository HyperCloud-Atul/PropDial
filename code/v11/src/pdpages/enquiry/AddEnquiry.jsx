import React, { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";

// import component 
import Back from '../back/Back'

const AddEnquiry = () => {
    // add enquiry with add document start
    const { addDocument, updateDocument, deleteDocument, error } =
        useFirestore("enquiry");

    const [enquiry, setEnquiry] = useState("direct");
    const [enquiryFrom, setEnquiryFrom] = useState("");
    const [referredBy, setReferredBy] = useState("");
    const [enquiryType, setEnquiryType] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [date, setDate] = useState("");
    const [enquiryStatus, setEnquiryStatus] = useState("open");
    const [remark, setRemark] = useState("");

    const [isUploading, setIsUploading] = useState(false);


    const handleChangeEnquiry = (event) => setEnquiry(event.target.value);
    const handleChangeEnquiryFrom = (event) => setEnquiryFrom(event.target.value);
    const handleChangeReferredBy = (event) => setReferredBy(event.target.value);
    const handleChangeEnquiryType = (event) => setEnquiryType(event.target.value);
    const handleChangeName = (event) => setName(event.target.value);
    const handleChangePhone = (event) => setPhone(event.target.value);
    const handleChangeEmail = (event) => setEmail(event.target.value);
    const handleChangeDate = (event) => setDate(event.target.value);
    const handleChangeEnquiryStatus = (event) => setEnquiryStatus(event.target.value);
    const handleChangeRemark = (event) => setRemark(event.target.value);


    const submitEnquiry = async (event) => {
        event.preventDefault();

        if (!name) {
            alert("All fields are required!");
            return;
        }

        try {
            setIsUploading(true);
            const docRef = await addDocument({
                enquiry,
                enquiryFrom,
                referredBy,
                enquiryType,
                name,
                phone,
                email,
                date,
                enquiryStatus,
                remark,

            });
            setEnquiry("");
            setEnquiryFrom("");
            setReferredBy("");
            setEnquiryType("");
            setName("");
            setPhone("")
            setEmail("");
            setDate("");
            setEnquiryStatus("");
            setRemark("");
            setIsUploading(false);
        } catch (error) {
            console.error("Error adding document:", error);
            setIsUploading(false);
        }
    };
    // add enquiry with add document end
    return (

        <div className="add_enquiry">
            <div className="vg22">
            </div>
            <div className="vg12"></div>
            <div className="row row_gap">
                <div className="col-md-4">
                    <div className="form_field st-2 label_top">
                        <label htmlFor="">
                            Enquiry</label>
                        <div className="field_box theme_radio_new">
                            <div className="theme_radio_container">
                                <div className="radio_single" >
                                    <input
                                        type="radio"
                                        name="enquiry"
                                        id="direct"
                                        onClick={handleChangeEnquiry}
                                        value="direct"
                                        checked={enquiry === "direct"}
                                    />
                                    <label htmlFor="direct" className="radio_label">Direct</label>
                                </div>
                                <div className="radio_single" >
                                    <input
                                        type="radio"
                                        name="enquiry"
                                        id="byReference"
                                        onClick={handleChangeEnquiry}
                                        value="By Reference"

                                    />
                                    <label htmlFor="byReference" className="radio_label">By Reference</label>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {enquiry === "direct" && (
                    <div className="col-md-4">
                        <div className="form_field st-2 label_top">
                            <label htmlFor="">
                                Enquiry From</label>
                            <div className="field_box theme_radio_new">
                                <div className="theme_radio_container">
                                    <div className="radio_single" >
                                        <input
                                            type="radio"
                                            name="enquiryFrom"
                                            id="tenant"
                                            onClick={handleChangeEnquiryFrom}
                                            value="tenant"
                                        />
                                        <label htmlFor="tenant" className="radio_label">tenant</label>
                                    </div>
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
                )}
                {enquiry === "By Reference" && (
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
                                            id="employee"
                                            onClick={handleChangeReferredBy}
                                            value="employee"
                                        />
                                        <label htmlFor="employee" className="radio_label">employee</label>
                                    </div>
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

                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
                <div className="col-md-6">
                    <div className="form_field label_top">
                        <label htmlFor="">Property Name</label>
                        <div className="form_field_inner with_icon">
                            <input
                                type="text"
                                placeholder="Search property"
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
                                placeholder="Read only"
                                readOnly
                            />
                            <div className="field_icon">
                                <span class="material-symbols-outlined">
                                    bookmark
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form_field label_top">
                        <label htmlFor="">Name</label>
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
                        <label htmlFor="">Contact</label>
                        <div className="form_field_inner with_icon">
                            <input
                                type="number"
                                placeholder="Enter number"
                                value={phone}
                                onChange={handleChangePhone}
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
                        <label htmlFor="">Email</label>
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
                <div className="col-md-3">
                    <div className="form_field label_top">
                        <label htmlFor="">Click To Select Date</label>
                        <div className="form_field_inner with_icon">
                            <input
                                type="date"
                                placeholder="dd/mm/yy"
                                value={date}
                                onChange={handleChangeDate}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="form_field st-2 label_top">
                        <label htmlFor="">
                            Enquiry Status</label>
                        <div className="field_box theme_radio_new">
                            <div className="theme_radio_container">
                                <div className="radio_single" >
                                    <input
                                        type="radio"
                                        name="enquiryStatus"
                                        id="open"
                                        onClick={handleChangeEnquiryStatus}
                                        value="open"
                                        checked={enquiryStatus === "open"}
                                    />
                                    <label htmlFor="open" className="radio_label">open</label>
                                </div>
                                <div className="radio_single" >
                                    <input
                                        type="radio"
                                        name="enquiryStatus"
                                        id="sucessful"
                                        onClick={handleChangeEnquiryStatus}
                                        value="successful"

                                    />
                                    <label htmlFor="sucessful" className="radio_label">sucessful</label>
                                </div>
                                <div className="radio_single" >
                                    <input
                                        type="radio"
                                        name="enquiryStatus"
                                        id="dead"
                                        onClick={handleChangeEnquiryStatus}
                                        value="dead"

                                    />
                                    <label htmlFor="dead" className="radio_label">dead</label>
                                </div>
                                <div className="radio_single" >
                                    <input
                                        type="radio"
                                        name="enquiryStatus"
                                        id="working"
                                        onClick={handleChangeEnquiryStatus}
                                        value="working"

                                    />
                                    <label htmlFor="working" className="radio_label">working</label>
                                </div>

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
                    <button className="theme_btn btn_fill" onClick={submitEnquiry}>
                        {isUploading ? "Submiting....." : "Submit"}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default AddEnquiry
