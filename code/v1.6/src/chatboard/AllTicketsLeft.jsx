import React, { useState } from "react";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useAuthContext } from "../hooks/useAuthContext";

const AllTicketsLeft = ({ ticket, setSelectedTicket, activeTickets }) => {
  const { user } = useAuthContext();
  // console.log('user:', user, 'activeTickets', activeTickets);
  // console.log('user:', user);

  const [activeTicket, setactiveTicket] = useState(false)

  let iconurl = 'https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/masterData%2Ficons%2FGeneral%20Inquiries.png?alt=media&token=7726c8d9-e313-44c9-aa59-ff2d759481e0';
  if (ticket.type === 'Billing and Account Management')
    iconurl = 'https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/masterData%2Ficons%2FBilling%20and%20Account%20Management.png?alt=media&token=c4d299b6-a6ef-44fc-8c83-989919d88fac'

  if (ticket.type === 'Technical Issues')
    iconurl = 'https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/masterData%2Ficons%2FTechnical%20Issues.png?alt=media&token=ce7f3cd9-4b4b-46b1-80fa-ea0656640bd1'

  if (ticket.type === 'Training Requests')
    iconurl = 'https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/masterData%2Ficons%2FTraining%20Requests.png?alt=media&token=670159d8-8086-4eb0-9e99-b59db1bea6c7'

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
            {/* <img src="/assets/img/client_img_6.jpg" alt="propdial" /> */}
            <img src={iconurl} alt="propdial" />
          </div>
        </div>
        <div className="right">
          <div className="time">{formatDistanceToNow(ticket.updatedAt.toDate(), { addSuffix: true })}</div>
          <div className="unread_chat">{ticket.response ? (ticket.response.length + 1) : 1}</div>
          {user.role !== 'propagentadmin' && <h5>{ticket.createdBy.fullName}</h5>}
          <h5>{ticket.type}</h5>
          <h6>
            {ticket.message}
          </h6>
        </div>

      </div>



    </>
  )
}

export default AllTicketsLeft
