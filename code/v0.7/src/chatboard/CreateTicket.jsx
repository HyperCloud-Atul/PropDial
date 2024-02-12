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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
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
    <div className="top_header_pg">
     <div className="page_spacing">
     <div
        className={`  ${
          sidebarOpen ? "sidebar-open" : "sidebar-close"
        }`}
      >
       

        <div
          className="right_main_form"
          style={{
            backgroundImage: "url('/assets/img/lsbg.png')",
          }}
        >
          <div className="rmf_inner">
            <form onSubmit={handleSubmit} className="form-w">
              <h4 className="title">Contact Us</h4>

              <div className="form_field top_margin">
                <label htmlFor="" className="">
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
          </div>
        </div>
      </div>
     </div>
    </div>
  );
};

export default CreateTicket;
