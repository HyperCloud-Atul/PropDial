import React from "react";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";
import { timestamp } from "../../firebase/config";

export default function CreateTicket() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  // console.log('user:', user)
  const { addDocument, response: addDocumentResponse } =
    useFirestore("tickets");
  const [formError, setFormError] = useState(null);
  const [ticketType, setTicketType] = useState("General Inquiries");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setFormError(null)

    let errorMsg = "You are not logged-in";

    // let email = document.getElementById('id_email').value ? document.getElementById('id_email').value : ''
    let message = document.getElementById("id_message").value;

    // console.log('email is:', email)
    console.log("ticket Type:", ticketType);

    const newMessage = {
      email: "",
      message: message,
      postedBy: "Agent",
      status: "active",
      type: ticketType,
      updatedAt: timestamp.fromDate(new Date()),
    };
    if (!user || user === null) setFormError(errorMsg);
    else {
      await addDocument(newMessage);
      navigate("/ticketdetail");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form-w">
      <h4 className="title">Contact Us</h4>
      {/* <div className="fl_form_field">
        <label htmlFor="" className="no-floating">
          Name
        </label>
        <input
          readOnly
          type="text"
          placeholder="Name"
          value={user && user.fullName}
        />
        <div className="field_icon">
          <span className="material-symbols-outlined">person</span>
        </div>
      </div> */}
      {/* <div className="fl_form_field top_margin">
        <label htmlFor="" className="no-floating">
          Phone Number
        </label>
        <input
          readOnly
          type="text"
          placeholder="Phone Number"
          value={user && user.phoneNumber}
        />
      </div> */}
      <div className="fl_form_field st-2 top_margin">
        <label htmlFor="" className="no-floating">
          For
        </label>
        <select
          onChange={(e) => {
            setTicketType(e.target.value);
          }}
        >
          <option>General Inquiries</option>
          <option>Billing and Account Management</option>
          <option>Technical Issues</option>
          <option>Training Requests</option>
        </select>
      </div>
      <div className="form_field st-2">
        <div className="field_inner">
          <textarea
            id="id_message"
            required
            maxLength={500}
            type="text"
            placeholder="Message"
            name="message"
          />
          <div className="field_icon">
            <span className="material-symbols-outlined">chat</span>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="submit_btn mt-4">
          <button
            type="submit"
            className="modal_btn theme_btn no_icon btn_fill"
          >
            Send
          </button>
        </div>
        {formError && <p className="error">{formError}</p>}
      </div>
    </form>
  );
}
