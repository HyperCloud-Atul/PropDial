import React from 'react'
import { useFirestore } from '../hooks/useFirestore'
import { useAuthContext } from "../hooks/useAuthContext";
import { timestamp } from "../firebase/config"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const SingleTicketChat = ({ ticket, backToChatList }) => {
  const { user } = useAuthContext();

  // console.log('in SingleTicketChat', ticket);
  const { updateDocument, response: updateDocumentResponse } = useFirestore('tickets')
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveResponse();
    }
  }
  async function saveResponse() {
    // const handleSubmit = async (e) => {


    let responseArray = []
    responseArray = ticket.response ? ticket.response : [];
    const response = {
      message: document.getElementById('id_message').value,
      createdAt: timestamp.fromDate(new Date()),
      createdBy: user.uid,
    }

    responseArray.push(response)

    const ticketObj = {
      ...ticket,
      updatedAt: timestamp.fromDate(new Date()),
      updatedBy: user.uid,
      response: responseArray

    }
    // console.log('ticket id:', ticket)
    // console.log('updated ticket obj:', ticketObj)
    await updateDocument(ticket.id, ticketObj)
    document.getElementById('id_message').value = '';
  }
  return (
    <div className='single_ticket_chat' style={{ overflow: 'hidden' }}>
      <div className="ticket_detail chat_box">
        <div className="chat_box_header">
          <div className="img_and_name">
            <div className="chat_user_img">
              {/* <img src="/assets/img/ab_left_img1.jpg" alt="propdial" /> */}
              <img src={ticket.createdBy.photoURL} alt="propdial" />
              {/* {console.log('in singleticketchat')} */}
            </div>
            <div className="right">
              {user.role !== 'propagentadmin' ? <h6 className="chatuser_name">{ticket.createdBy.fullName}</h6> : <h6 className="chatuser_name">{ticket.type}</h6>}
            </div>
          </div>

          <div className='mobile_chat_back_button' onClick={backToChatList}>
            <span className="material-symbols-outlined">
              arrow_back_ios
            </span>
            <small>BACK</small>
          </div>

        </div>
        <div className="chat_box_body"
          style={{
            backgroundImage: "url('/assets/img/lsbg.png')",
          }}>
          <div className="my_chat">
            <div className="chat_single">
              {ticket.message}
              <div className="time">{formatDistanceToNow(ticket.updatedAt.toDate(), { addSuffix: true })}</div>
            </div>
          </div>
          {ticket && ticket.response &&
            ticket.response.map((response) => {
              // console.log(response);
              return response.createdBy.role !== 'propagentadmin' ?
                <div className="partner_chat" key={response.createdAt}>
                  <div className="chat_single">
                    <h5>Support : {response.createdBy.fullName}</h5>
                    {response.message}
                    <div className="time">{formatDistanceToNow(response.createdAt.toDate(), { addSuffix: true })}</div>
                    <div className="support_img">
                      <img src="/assets/img/ab_left_img1.jpg" alt="propdial" />
                    </div>
                  </div>

                </div>
                :
                <div className="my_chat" key={response.createdAt}>
                  <div className="chat_single">
                    {response.message}
                    <div className="time">{formatDistanceToNow(response.createdAt.toDate(), { addSuffix: true })}</div>
                  </div>
                </div>
              // response.message
            })}

        </div>

        <div className="chat_box_footer relative">
          <input id='id_message' type="text" placeholder="Type a message" />
          <div className="send_icon pointer" onClick={saveResponse} >
            <span className="material-symbols-outlined">send</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleTicketChat
