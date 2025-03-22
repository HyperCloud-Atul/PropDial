import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";
import { timestamp } from "../firebase/config";

const CreateTicket = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  // add and remove class
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
      postedBy: "Propdial",
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
    <div className="create_ticket_form">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <h3 className="section_title mb-4 orange">
              Create ticket
            </h3>
          </div>
          <div className="col-md-6">
            <div className="form_field">
              <label htmlFor="user_name" className="white">Name</label>
              <div className="form_field_inner">
                <input type="text" value={user && user.fullName} id="user_name" readOnly disabled />
                <div className="field_icon">
                  {/* <span className="material-symbols-outlined">Person</span> */}
                  <span>
                    <img src="/assets/material-icons/person.svg" alt="propdial"></img>
                  </span>
                </div>
              </div>
            </div>
            <div className="ff_gap"></div>
          </div>
          <div className="col-md-6">
            <div className="form_field">
              <label htmlFor="user_number" className="white">Phone number</label>
              <div className="form_field_inner">
                <input type="number" value={user && user.phoneNumber} id="user_number" readOnly disabled />
                <div className="field_icon">
                  <span className="material-symbols-outlined">call</span>

                </div>
              </div>
            </div>
            <div className="ff_gap"></div>
          </div>
          <div className="col-12">
            <div className="form_field">
              <label htmlFor="ticket_for" className="white">For</label>
              <div className="form_field_inner">
                <select
                  onChange={(e) => {
                    setTicketType(e.target.value);
                  }}
                  id="ticket_for"
                >
                  <option>General Inquiries</option>
                  {/* <option>Billing and Account Management</option> */}
                  <option>Technical Issues</option>
                  <option>Deactive account support</option>
                  {/* <option>Training Requests</option> */}
                </select>
                <div className="field_icon">
                  <span className="material-symbols-outlined">Person</span>
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

            <div className="ff_gap"></div>
          </div>
          <div className="col-12">
            <div className="submit_btn mt-4">
              <button type="submit" className="theme_btn btn_fill">
                Send
                <span className="material-symbols-outlined btn_arrow ba_animation">
                  arrow_forward
                </span>
              </button>
            </div>
            {formError && <p className="error">{formError}</p>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
