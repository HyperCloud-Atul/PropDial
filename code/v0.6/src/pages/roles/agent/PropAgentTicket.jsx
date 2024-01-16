import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const PropAgentTicket = ({ ticket }) => {
  // show more show less start
  const [expanded, setExpanded] = useState(false);

  const handleShowMoreClick = () => {
    setExpanded(!expanded);
  };
  const parentClassName = `propagentusersingle ${expanded ? "showmore" : ""}`;
  // show more show less end
  return (
    <div className={parentClassName}>
      <div className="left">
        <div>
          <div className="img_div">
            {/* <img src="./assets/img/congratulation.jpg" alt="" /> */}
            <img src={ticket.createdBy.photoURL} alt="" />
          </div>
        </div>
        <div className="">
          <h5 className="name">{ticket.createdBy.fullName}</h5>
          <h6 className="phone_number">+{ticket.createdBy.phoneNumber}</h6>
          <h6 className="phone_number">{ticket.createdBy.emailID}</h6>
          <h6 className="phone_number contact_message">
            {ticket.message}
          </h6>
        </div>
      </div>
      <h4 className="notification_date">
        <span>{formatDistanceToNow(ticket.createdAt.toDate(), { addSuffix: true })}</span>
      </h4>
      <h4 className="notification_date">
        <Link to="https://wa.me/+{ticket.createdBy.phoneNumber}">
          <img src="/assets/img/whatsapp.png" alt="" />
        </Link>
        {/* <Link to="mailto:solankisanskar8@gmail.com">
          <img src="/assets/img/email.png" alt="" className="email" />
        </Link> */}
      </h4>
      <h6 onClick={handleShowMoreClick} className="expand_line pointer">
        {expanded ? "show less" : "show more"}
      </h6>
      <div className='mt-4'>
        <button className="theme_btn btn_fill">Reply</button>
        {/* {formError && <p className="error">{formError}</p>} */}
      </div>
    </div>
  );
};

export default PropAgentTicket;
