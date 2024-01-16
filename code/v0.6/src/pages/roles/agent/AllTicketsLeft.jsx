import React, { useState } from "react";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useAuthContext } from "../../../hooks/useAuthContext";

const AllTicketsLeft = ({ ticket, setSelectedTicket, activeTickets }) => {

  const { user } = useAuthContext();
  // console.log('user:', user, 'activeTickets', activeTickets);
  // console.log('user:', user);

  const [activeTicket, setactiveTicket] = useState(false)

  let iconurl = 'https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/icons%2FGeneral%20Inquiries.png?alt=media&token=caf9c7a3-f397-45bf-a18f-16d89af75b02';
  if (ticket.type === 'Billing and Account Management')
    iconurl = 'https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/icons%2FBilling%20and%20Account%20Management.png?alt=media&token=ce4ff116-43b2-4acd-a0d9-3d9cac19d660'

  if (ticket.type === 'Technical Issues')
    iconurl = 'https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/icons%2FTechnical%20Issues.png?alt=media&token=a36e9e2f-e7a9-4828-85a3-4359140cd246'

  if (ticket.type === 'Training Requests')
    iconurl = 'https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/icons%2FTraining%20Requests.png?alt=media&token=f2561faa-7831-412a-b4e7-0800f2a74cef'



  function setTicketinMainPage() {
    setSelectedTicket(ticket);
    setactiveTicket(true);
  }
  return (
    <>
      {/* <div className="all_tickets_left"> */}

      <div className={activeTickets.id === ticket.id ? "single_ticket currently_open" : "single_ticket"} onClick={setTicketinMainPage}>
        <div className="left">
          <div className="img_container">
            {/* <img src="/assets/img/client_img_6.jpg" alt="" /> */}
            <img src={iconurl} alt="" />
          </div>
        </div>
        <div className="right">
          <div className="time">{formatDistanceToNow(ticket.updatedAt.toDate(), { addSuffix: true })}</div>
          <div className="unread_chat">{ticket.response ? (ticket.response.length + 1) : 1}</div>
          {user.role === 'propagentadmin' && <h5>{ticket.createdBy.fullName}</h5>}
          <h5>{ticket.type}</h5>
          <h6>
            {ticket.message}
          </h6>
        </div>

      </div>
      {/* <div className="single_ticket">
        <div className="left">
          <div className="img_container">
            <img src="/assets/img/client_img_6.jpg" alt="" />
          </div>
        </div>
        <div className="right">
          <div className="time">5.30am</div>
          <div className="unread_chat">5</div>
          <h5>Rakesh Sharma</h5>
          <h6>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores
            numquam eius hic similique ad consequuntur sint, expedita voluptates
            rerum, placeat ipsam aperiam incidunt nihil voluptatum neque
            repellendus sequi blanditiis adipisci?
          </h6>
        </div>
      </div> */}

      {/* </div> */}
    </>
  );
};

export default AllTicketsLeft;
