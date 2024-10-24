import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useFirestore } from "../hooks/useFirestore";
import PhoneInput from "react-phone-input-2";
const EnquiryAddModal = ({ show, handleClose, selectedProperty, activeOption }) => {
  const { addDocument, updateDocument, deleteDocument, error } =
    useFirestore("enquiry-propdial");
  const [iAm, setIam] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleChangeName = (event) => setName(event.target.value);
  const handleChangeIam = (event) => setIam(event.target.value);
  const handleChangeEmail = (event) => setEmail(event.target.value);
  const handleChangePhone = (value) => setPhone(value);
  const handleChangeDescription = (event) => setDescription(event.target.value);

  const submitEnquiry = async (event) => {
    event.preventDefault();

    if (!iAm || !name || !phone || !description || !email) {
      alert("All fields are required!");
      return;
    }

    try {
      setIsUploading(true);
      const newStatusUpdate = {
        status: "open",
        updatedAt: new Date(),
      };
      await addDocument({
        iAm,
        description,
        name,
        phone,
        email,
        pid: selectedProperty.pid, // Add the selected property ID here
        enquiryFrom: iAm,
        referredBy: "none",
        postedBy: "Propdial",
        propId: selectedProperty.id,
        enquiryType: activeOption.toLowerCase(),
        date: new Date().toISOString(),
        enquiryStatus: "open",
        source: "portal",
        employeeName: "",
        propertyOwner: "coming soon",
        propertyName: selectedProperty.society,
        statusUpdates: [newStatusUpdate], // Initialize statusUpdates with default status
      });
      setIam("");
      setName("");
      setEmail("");
      setPhone("");
      setDescription("");
      setIsUploading(false);
      handleClose();
    } catch (error) {
      console.error("Error adding document:", error);
      setIsUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="margin_top">
      <span class="material-symbols-outlined modal_close" onClick={handleClose}>
        close
      </span>
      <form onSubmit={submitEnquiry} className="guest_enquiry">
       
       <div className="section_title mb-3">
         <h5 className="text_orange">Enquiry</h5>
         <h6 className="modal_subtitle">
           Thank you for your interest in reaching out to us. Please use
           the form below to submit any question.
         </h6>
       </div>
       <div className="enq_fields">
         <div className="form_field st-2">
           <div className="field_inner select">
             <select value={iAm} onChange={handleChangeIam}>
               <option value="" disabled>
                 I am
               </option>
               <option value="Tenant">Tenant</option>
               <option value="Agent">Agent</option>
             </select>
             <div className="field_icon">
               <span className="material-symbols-outlined">person</span>
             </div>
           </div>
         </div>
         <div className="form_field st-2">
           <div className="field_inner">
             <input
               type="text"
               value={name}
               onChange={handleChangeName}
               placeholder="Name"
             />
             <div className="field_icon">
               <span className="material-symbols-outlined">person</span>
             </div>
           </div>
         </div>
         <div className="form_field st-2">
           <div className="field_inner">
             <input
               type="email"
               value={email}
               onChange={handleChangeEmail}
               placeholder="Email"
             />
             <div className="field_icon">
               <span className="material-symbols-outlined">email</span>{" "}
               {/* Updated icon to 'email' */}
             </div>
           </div>
         </div>
         <div className="form_field st-2" style={{
          border:"none"
         }}>
           <div className="field_inner">
             <PhoneInput
               country={"in"}
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
                 width: "100%",
                 paddingLeft: "45px",
                 fontSize: "16px",
                 borderRadius: "5px",
                 border: "1px solid #00A8A8",
               }}
               buttonStyle={{
                 borderRadius: "5px",
                 textAlign: "left",
                 border: "1px solid #00A8A8",
               }}
             />
             <div className="field_icon">
               <span className="material-symbols-outlined">call</span>
             </div>
           </div>
         </div>
         <div className="form_field st-2" style={{
          border:"none"
         }}>
           <div className="field_inner">
             <textarea
               value={description}
               onChange={handleChangeDescription}
               placeholder="Description"
             />
             <div className="field_icon">
               <span className="material-symbols-outlined">
                 description
               </span>
             </div>
           </div>
         </div>
       </div>
       <div className="submit_btn mt-3">
         <button
           type="submit"
           className="modal_btn theme_btn no_icon btn_fill"
           disabled={isUploading}
         >
           {isUploading ? "Submitting..." : "Submit"}
         </button>
       </div>
 
   </form>
    </Modal>
  );
};

export default EnquiryAddModal;
