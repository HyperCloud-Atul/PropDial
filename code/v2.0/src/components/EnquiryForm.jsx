import React, { useState } from "react";
import { useFirestore } from "../hooks/useFirestore";
import PhoneInput from "react-phone-input-2";
import { useSendEmail } from "../hooks/useSendEmail";

const EnquiryForm = () => {
  const { addDocument } = useFirestore("enquiry-propdial");

  const [iAm, setIam] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { sendMyEmail, isSendEmailPending } = useSendEmail()

  // ✅ Error state
  const [errors, setErrors] = useState({});

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!iAm) newErrors.iAm = "Please select an option";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // onChange handlers with error reset
  const handleChangeName = (e) => {
    setName(e.target.value);
    if (errors.name) setErrors({ ...errors, name: "" });
  };

  const handleChangeIam = (e) => {
    setIam(e.target.value);
    if (errors.iAm) setErrors({ ...errors, iAm: "" });
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors({ ...errors, email: "" });
  };

  const handleChangePhone = (value) => {
    setPhone(value);
    if (errors.phone) setErrors({ ...errors, phone: "" });
  };

  const handleChangeDescription = (e) => setDescription(e.target.value);

  // Submit
  const submitEnquiry = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

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
        pid: "",
        enquiryFrom: iAm,
        postedBy: "Propdial",
        propId: "",
        referredBy: "none",
        enquiryType: "",
        date: new Date().toISOString(),
        enquiryStatus: "open",
        source: "contact us page",
        employeeName: "",
        propertyOwner: "",
        propertyName: "",
        statusUpdates: [newStatusUpdate],
      });
 
   const toList = [email]; // agar single email bhejna hai
const ccList = ["atul@hyperclouddigital.com"];
const bccList = ["naman@hyperclouddigital.com"];
const emailSubject = "New General Enquiry";

// const htmlEmailBody = `
//   <div style="font-family: Arial, sans-serif; background-color:#f4f6f9; padding:20px;">
//     <table width="100%" border="0" cellspacing="0" cellpadding="0" 
//       style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
//       <tr>
//         <td style="background: linear-gradient(135deg,#00A8A8,#007a7a); padding:20px; text-align:center; color:#fff;">
//           <h1 style="margin:0; font-size:24px;">Thank You for Contacting Us</h1>
//           <p style="margin:5px 0 0; font-size:14px;">We have received your enquiry and will get back to you shortly.</p>
//         </td>
//       </tr>
//       <tr>
//         <td style="padding:20px;">
//           <h2 style="color:#333; font-size:20px; margin-bottom:15px;">Your Enquiry Details</h2>
//           <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
//             <tr style="background:#f9f9f9;">
//               <td width="30%" style="font-weight:bold; color:#555;">Name:</td>
//               <td style="color:#333;">${name}</td>
//             </tr>
//             <tr>
//               <td style="font-weight:bold; color:#555;">Email:</td>
//               <td style="color:#333;">${email}</td>
//             </tr>
//             <tr style="background:#f9f9f9;">
//               <td style="font-weight:bold; color:#555;">Phone:</td>
//               <td style="color:#333;">${phone}</td>
//             </tr>
//             <tr>
//               <td style="font-weight:bold; color:#555;">I am:</td>
//               <td style="color:#333; text-transform:capitalize;">${iAm}</td>
//             </tr>
//             <tr style="background:#f9f9f9;">
//               <td style="font-weight:bold; color:#555;">Message:</td>
//               <td style="color:#333;">${description || "—"}</td>
//             </tr>
//           </table>
//           <div style="margin-top:20px; text-align:center;">
//             <a href="https://propdial.com" target="_blank" 
//               style="display:inline-block; background:#00A8A8; color:#fff; padding:12px 24px; 
//               border-radius:8px; text-decoration:none; font-size:16px; font-weight:bold;">
//               Visit Our Website
//             </a>
//           </div>
//         </td>
//       </tr>
//       <tr>
//         <td style="background:#f4f4f4; padding:15px; text-align:center; font-size:12px; color:#888;">
//           &copy; ${new Date().getFullYear()} Propdial. All rights reserved.
//         </td>
//       </tr>
//     </table>
//   </div>
// `;
const htmlEmailBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f4f6f9; padding:20px;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" 
      style="max-width:650px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <tr>
        <td style="background: linear-gradient(135deg,#00A8A8,#007a7a); padding:25px; text-align:center; color:#fff;">
          <img src="https://your-cdn-link.com/propdial-logo.png" alt="Propdial Logo" width="160" style="margin-bottom:10px;" />
          <h1 style="margin:0; font-size:22px;">Thank You for Contacting Propdial</h1>
          <p style="margin:5px 0 0; font-size:14px;">We’ve received your enquiry and will get back to you soon.</p>
        </td>
      </tr>

      <!-- User Details -->
      <tr>
        <td style="padding:25px;">
          <h2 style="color:#333; font-size:20px; margin-bottom:15px;">Your Enquiry Details</h2>
          <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse; border:1px solid #eee; border-radius:8px; overflow:hidden;">
            <tr style="background:#f9f9f9;">
              <td width="35%" style="font-weight:bold; color:#555;">Name</td>
              <td style="color:#333;">${name}</td>
            </tr>
            <tr>
              <td style="font-weight:bold; color:#555;">Email</td>
              <td style="color:#333;">${email}</td>
            </tr>
            <tr style="background:#f9f9f9;">
              <td style="font-weight:bold; color:#555;">Phone</td>
              <td style="color:#333;">${phone}</td>
            </tr>
            <tr>
              <td style="font-weight:bold; color:#555;">I am</td>
              <td style="color:#333; text-transform:capitalize;">${iAm}</td>
            </tr>
            <tr style="background:#f9f9f9;">
              <td style="font-weight:bold; color:#555;">Message</td>
              <td style="color:#333;">${description || "—"}</td>
            </tr>
          </table>

          <!-- CTA Button -->
          <div style="margin-top:25px; text-align:center;">
            <a href="https://propdial.com" target="_blank" 
              style="display:inline-block; background:#00A8A8; color:#fff; padding:14px 28px; 
              border-radius:8px; text-decoration:none; font-size:16px; font-weight:bold;">
              Visit Propdial
            </a>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f4f4f4; padding:15px; text-align:center; font-size:12px; color:#888;">
          &copy; ${new Date().getFullYear()} Propdial. All rights reserved.
        </td>
      </tr>
    </table>
  </div>
`;


sendMyEmail(toList, ccList, bccList, emailSubject, htmlEmailBody);
      // Reset fields
      setIam("");
      setName("");
      setPhone("");
      setEmail("");
      setDescription("");
      setIsUploading(false);
    } catch (error) {
      console.error("Error adding document:", error);
      setIsUploading(false);
    }
  };

  return (
    <div className="create_ticket_form">
      <form onSubmit={submitEnquiry}>
        <div className="row">
          <div className="col-12">
            <h3 className="section_title mb-4 orange" id="enquiry_form">Enquiry</h3>
          </div>

          {/* Name */}
          <div className="col-md-6">
            <div className="form_field">
              <label className="white">Name*</label>
              <div className="form_field_inner">
                <input
                  type="text"
                  value={name}
                  onChange={handleChangeName}
                  placeholder="Name"
                  onKeyPress={(e) => {
                    const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces allowed
                    if (!regex.test(e.key)) {
                      e.preventDefault(); // Prevent invalid input
                    }
                  }}
                />
                <div className="field_icon">
                  <span className="material-symbols-outlined">person</span>
                </div>
              </div>
              {errors.name && <p className="text-danger">{errors.name}</p>}
            </div>
            <div className="ff_gap"></div>
          </div>

          {/* Phone */}
          <div className="col-md-6">
            <div className="form_field">
              <label className="white">Phone number*</label>
              <div className="form_field_inner">
                <PhoneInput
                  country={"in"}
                  value={phone}
                  onChange={handleChangePhone}
                  international
                  countryCodeEditable={true}
                  placeholder="Country code + mobile number"
                  inputStyle={{
                    width: "100%",
                    // paddingLeft: "45px",
                    fontSize: "16px",
                    borderRadius: "12px",
                    height: "45px",
                  }}
                  buttonStyle={{
                    borderRadius: "12px",
                    textAlign: "left",
                    border: "1px solid #00A8A8",
                  }}
                />
              </div>
              {errors.phone && <p className="text-danger">{errors.phone}</p>}
            </div>
            <div className="ff_gap"></div>
          </div>

          {/* Email */}
          <div className="col-md-6">
            <div className="form_field">
              <label className="white">Email*</label>
              <div className="form_field_inner">
                <input
                  type="text"
                  value={email}
                  onChange={handleChangeEmail}
                  placeholder="Email"
                />
                <div className="field_icon">
                  <span className="material-symbols-outlined">email</span>
                </div>
              </div>
              {errors.email && <p className="text-danger">{errors.email}</p>}
            </div>
            <div className="ff_gap"></div>
          </div>

          {/* I am */}
          <div className="col-md-6">
            <div className="form_field">
              <label className="white">I am*</label>
              <div className="form_field_inner">
                <select value={iAm} onChange={handleChangeIam}>
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="home owner">Home Owner</option>
                  <option value="prospective tenant">Prospective Tenant</option>
                  <option value="prospective buyer">Prospective Buyer</option>
                  <option value="agent">Agent</option>
                  <option value="other">Other</option>
                </select>
                <div className="field_icon">
                  <span className="material-symbols-outlined">person</span>
                </div>
              </div>
              {errors.iAm && <p className="text-danger">{errors.iAm}</p>}
            </div>
            <div className="ff_gap"></div>
          </div>

          {/* Message */}
          <div className="col-12">
            <div className="form_field">
              <label className="white">Message</label>
              <div className="form_field_inner">
                <textarea
                  value={description}
                  onChange={handleChangeDescription}
                  placeholder="Description"
                />
                <div className="field_icon">
                  <span className="material-symbols-outlined">description</span>
                </div>
              </div>
            </div>
            <div className="ff_gap"></div>
          </div>

          {/* Submit */}
          <div className="col-12">
            <div className="submit_btn mt-2">
              <button
                type="submit"
                className="theme_btn btn_fill no_icon w-100"
                disabled={isUploading}
              >
                {isUploading ? "Sending...." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EnquiryForm;
