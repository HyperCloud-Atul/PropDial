import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";
import { timestamp } from "../../firebase/config";
import CreateTicket from "./CreateTicket";

const ContactForm = () => {
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
      postedBy: "Agent",
      status: "active",
      type: ticketType,
      updatedAt: timestamp.fromDate(new Date()),
    };
    if (!user || user === null) setFormError(errorMsg);
    else await addDocument(newMessage);
  };
  return (
    <>
    <div className="top_header_pg">
      <div
        className={`loginsignpg  ${
          sidebarOpen ? "sidebar-open" : "sidebar-close"
        }`}
      >
        <div
          className="ls_sidebar set_bg_img_with_overlay"
          style={{
            backgroundImage: "url('/assets/img/contact_img.jpg')",
          }}
        >
          <div className="blur-bg"></div>
          <div className="open_close_icon" onClick={toggleSidebar}>
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </div>
          <div className="lss_content">
            <h3>Things you Can Do with PropAgent Account</h3>
            <ul>
              <li>
                Showcase listings
                <div className="li_icon">
                  <img src="./assets/img/tickIcon.png" alt="" />
                </div>
              </li>
              <li>
                Explore properties
                <div className="li_icon">
                  <img src="./assets/img/tickIcon.png" alt="" />
                </div>
              </li>
              <li>
                Connect and collaborate
                <div className="li_icon">
                  <img src="./assets/img/tickIcon.png" alt="" />
                </div>
              </li>
              <li>
                Stay trend-aware
                <div className="li_icon">
                  <img src="./assets/img/tickIcon.png" alt="" />
                </div>
              </li>
              <li>
                Engage in conversations
                <div className="li_icon">
                  <img src="./assets/img/tickIcon.png" alt="" />
                </div>
              </li>
              <li>
                Access efficient tools
                <div className="li_icon">
                  <img src="./assets/img/tickIcon.png" alt="" />
                </div>
              </li>
              <li>
                Receive reliable support
                <div className="li_icon">
                  <img src="./assets/img/tickIcon.png" alt="" />
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="right_main_form"
          style={{
            backgroundImage: "url('/assets/img/lsbg.png')",
          }}
        >
            <div className="rmf_inner">
            <CreateTicket/>
            </div>
      
        </div>
      </div>
    </div>
  </>
  );
};

export default ContactForm;
