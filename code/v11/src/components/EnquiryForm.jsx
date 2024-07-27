import React from "react";
import { useState } from "react";
import { useFirestore } from "../hooks/useFirestore";


const EnquiryForm = () => {
    // add enquiry with add document start
    const { addDocument, updateDocument, deleteDocument, error } =
        useFirestore("enquiry");

    const [iAm, setIam] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleChangeName = (event) => setName(event.target.value);
    const handleChangeIam = (event) => setIam(event.target.value);
    const handleChangePhone = (event) => setPhone(event.target.value);
    const handleChangeDescription = (event) => setDescription(event.target.value);

    const submitEnquiry = async (event) => {
        event.preventDefault();

        if (!iAm || !name || !phone || !description) {
            alert("All fields are required!");
            return;
        }

        try {
            setIsUploading(true);
            const docRef = await addDocument({
                iAm,
                name,
                phone,
                description,
                city,
                country,
                state,

            });
            setIam("");
            setName("");
            setPhone("");
            setCity("");
            setCountry("")
            setState("")
            setDescription("");
            setIsUploading(false);
        } catch (error) {
            console.error("Error adding document:", error);
            setIsUploading(false);
        }
    };
    // add enquiry with add document end
    return (
        <div className="create_ticket_form">
            <form onSubmit={submitEnquiry}>
                <div className="row">
                    <div className="col-12">
                        <h3 className="section_title mb-4 orange">
                            Enquiry
                        </h3>
                    </div>
                 
                    <div className="col-md-12">
                        <div className="form_field">
                            <label htmlFor="user_name" className="white">Name</label>
                            <div className="form_field_inner">
                            <input type="text"
                          value={name}
                          onChange={handleChangeName}
                          placeholder="Name" />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">person</span>
                        </div>
                            </div>
                        </div>
                        <div className="ff_gap"></div>
                    </div>
                    <div className="col-md-6">
                        <div className="form_field">
                            <label htmlFor="user_number" className="white">Phone number</label>
                            <div className="form_field_inner">
                            <input type="number"
                          value={phone}
                          onChange={handleChangePhone}
                          placeholder="Phone" />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">call</span>
                        </div>
                            </div>
                        </div>
                        <div className="ff_gap"></div>
                    </div>
                    <div className="col-6">
                        <div className="form_field">
                            <label htmlFor="ticket_for" className="white">For</label>
                            <div className="form_field_inner">
                                <select value={iAm} onChange={handleChangeIam}>
                                    <option value="" disabled>I am</option>
                                    <option value="Tenant">Tenant</option>
                                    <option value="Agent">Agent</option>
                                </select>
                                <div className="field_icon">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                            </div>
                            <div className="ff_gap"></div>
                        </div>
                    </div>
                   
                    <div className="col-12">
                        <div className="form_field">
                            <label htmlFor="id_message" className="white">Message</label>
                            <div className="form_field_inner">
                            <textarea
                          value={description}
                          onChange={handleChangeDescription}
                          placeholder="Description" />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">description</span>
                        </div>
                            </div>
                        </div>

                        <div className="ff_gap"></div>
                    </div>
                    <div className="col-12">
                        <div className="submit_btn mt-4">
                            <button type="submit" className="theme_btn btn_fill" disabled={isUploading} >
                                {isUploading ? "Sending...." : "Send"}                          
                            </button>
                        </div>
                        {/* {formError && <p className="error">{formError}</p>} */}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EnquiryForm;
