import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';

const EnquirySingle = ({ enquiries }) => {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showEnquriyModal, setShowEnquriyModal] = useState(false);

  const handleEnquriyModalClose = () => setShowEnquriyModal(false);
  const handleShowEnquriyModal = (doc) => {
    setSelectedEnquiry(doc);
    setShowEnquriyModal(true);
  };

  return (
    <>
      {enquiries && enquiries.map((doc, index) => (
        <div className="my_small_card notification_card pointer" key={index} onClick={() => handleShowEnquriyModal(doc)}>
          <h4 className="top_right_content">
            <span>
              {format(new Date(doc.date), 'dd-MMM-yy hh:mm a')}
            </span>
          </h4>
          {doc.enquiryStatus && (
            <div className={`top_tag_left ${doc.enquiryStatus.toLowerCase()}`}>
              {doc.enquiryStatus}
            </div>
          )}
          <div className="left">
            <div className="inner">
              <h5 className="title">{doc.name}</h5>
              <h6 className="sub_title">
                {doc.phone.replace(
                  /(\d{2})(\d{5})(\d{5})/,
                  "+$1 $2-$3"
                )}
              </h6>
              {/* {doc.description && (
                <h6 className="sub_title">{doc.description} </h6>
              )} */}
              {/* {doc.remark && (
                <h6 className="sub_title">{doc.remark} </h6>
              )} */}
              {doc.referredBy && (
                <h6 className="sub_title text-capitalize">Referred By :- {doc.referredBy} </h6>
              )}
            </div>
          </div>
          <div className="wha_call_icon">
            <Link
              className="call_icon wc_single"
              to={`tel:${doc.phone && doc.phone}`}
              target="_blank"
            >
              <img src="/assets/img/simple_call.png" alt="" />
            </Link>
            <Link
              className="wha_icon wc_single"
              to={`https://wa.me/${doc.phone && doc.phone}`}
              target="_blank"            >
              <img src="/assets/img/whatsapp_simple.png" alt="" />
            </Link>
          </div>
          <Link
            to={`/edit-enquiry/${doc.id}`}
            className="enq_edit"
          >
            <span class="material-symbols-outlined">edit_square</span>
          </Link>



        </div>
      ))}
      {selectedEnquiry && (
        <>
          <Modal show={showEnquriyModal} onHide={handleEnquriyModalClose} className="enquiry_modal">
            <span class="material-symbols-outlined modal_close" onClick={handleEnquriyModalClose}>
              close
            </span>
            <div className="modal_left_content">
              {format(new Date(selectedEnquiry.date), 'dd-MMM-yy hh:mm a')}
            </div>
            <ul className="points">
              {selectedEnquiry.enquiry && (
                <li className='text-capitalize'>
                  {selectedEnquiry.enquiry}
                </li>
              )}

              {selectedEnquiry.referredBy && (
                <li className='text-capitalize'>
                  {selectedEnquiry.referredBy}
                </li>
              )}
              {selectedEnquiry.enquiryFrom && (
                <li className='text-capitalize'>
                  {selectedEnquiry.enquiryFrom}
                </li>
              )}
              {selectedEnquiry.enquiryType && (
                <li className='text-capitalize'>
                  {selectedEnquiry.enquiryType}
                </li>
              )}
            </ul>
            <hr />
            <div className="details">
              <h6>Person Detail</h6>
              <ul>
                {selectedEnquiry.name && (
                  <li>
                    <div className='left'>
                      Name
                    </div>
                    <div className="middle">
                      :-
                    </div>
                    <div className="right">
                      {selectedEnquiry.name}
                    </div>
                  </li>
                )}
                {selectedEnquiry.phone && (
                  <li>
                    <div className='left'>
                      Contact
                    </div>
                    <div className="middle">
                      :-
                    </div>
                    <div className="right">
                      {selectedEnquiry.phone}
                    </div>
                  </li>
                )}

                {selectedEnquiry.email && (
                  <li>
                    <div className='left'>
                      Email
                    </div>
                    <div className="middle">
                      :-
                    </div>
                    <div className="right">
                      {selectedEnquiry.email}
                    </div>
                  </li>
                )}
                {selectedEnquiry.description && (
                  <li>
                    <div className='left'>
                      Remark
                    </div>
                    <div className="middle">
                      :-
                    </div>
                    <div className="right">
                      {selectedEnquiry.description}
                    </div>
                  </li>
                )}
                {selectedEnquiry.remark && (
                  <li>
                    <div className='left'>
                      Remark
                    </div>
                    <div className="middle">
                      :-
                    </div>
                    <div className="right">
                      {selectedEnquiry.remark}
                    </div>
                  </li>
                )}

              </ul>
            </div>
            <hr />
            <div className="details">
              <h6>Property Detail</h6>
              <ul>
                <li>
                  <div className='left'>
                    PID
                  </div>
                  <div className="middle">
                    :-
                  </div>
                  <div className="right">
                    PID202201
                  </div>
                </li>
                <li>
                  <div className='left'>
                    Property
                  </div>
                  <div className="middle">
                    :-
                  </div>
                  <div className="right">
                    C-102<span> | </span>Hiranandani<span> | </span>9 BHK<span> | </span>Low Rise Apt (5-10 floor)<span> | </span>Devnahalli<span> | </span>Bangalore<span> | </span>Karnatak
                  </div>
                </li>
                <li>
                  <div className='left'>
                    Property Owner
                  </div>
                  <div className="middle">
                    :-
                  </div>
                  <div className="right">
                    Raju Mohan Sharma
                  </div>
                </li>
              </ul>
            </div>
            <hr />
            <div className="enquiry_status">
              <h6>Enquiry Status</h6>
              <div className={`multi_steps show_status
               ${selectedEnquiry.enquiryStatus === "open" ? "open" :
                  selectedEnquiry.enquiryStatus === "working" ? "working" :
                    selectedEnquiry.enquiryStatus === "successful" ? "successful" : selectedEnquiry.enquiryStatus === "dead" ? "dead" : ""}`}>
                <div className="progress_bar">
                  <div className="fill" style={{
                    width:
                      selectedEnquiry.enquiryStatus === "open" ? "33.333%" :
                        selectedEnquiry.enquiryStatus === "working" ? "66.66%" :
                          selectedEnquiry.enquiryStatus === "successful" || selectedEnquiry.enquiryStatus === "dead" ? "100%" : "0%"
                  }}>
                  </div>
                </div>
                {selectedEnquiry.statusUpdates.map((e) => {
                  if (e.status === "open") {
                    return (
                      <div className="step_single" key={e} >
                        <div className="number">
                          <span class="material-symbols-outlined">
                            open_in_new
                          </span>
                        </div>
                        <h6 className='text-capitalize'>
                          {e.status}
                        </h6>
                        {e.updatedAt && (
                          <h5>
                            {format(e.updatedAt.toDate(), 'dd-MMM-yy hh:mm a')}
                          </h5>
                        )}

                      </div>
                    );
                  } else if (e.status === "working") {
                    return (
                      <div className={`step_single ${selectedEnquiry.enquiryStatus === "open" ? "wait" : ""}`} key={e}>
                        <div className="number">
                          <span class="material-symbols-outlined">
                            autorenew
                          </span>
                        </div>
                        <h6 className='text-capitalize'>
                          {e.status}
                        </h6>
                        {e.updatedAt && (
                          <h5>
                            {format(e.updatedAt.toDate(), 'dd-MMM-yy hh:mm a')}
                          </h5>
                        )}
                      </div>
                    );
                  } else if (e.status === "successful") {
                    return (
                      <div className={`step_single ${selectedEnquiry.enquiryStatus === "open" || selectedEnquiry.enquiryStatus === "working" ? "wait" : ""}`} key={e}>
                        <div className="number">
                          <span class="material-symbols-outlined">
                            check_circle
                          </span>
                        </div>
                        <h6 className='text-capitalize'>
                          {e.status}
                        </h6>
                        {e.updatedAt && (
                          <h5>
                            {format(e.updatedAt.toDate(), 'dd-MMM-yy hh:mm a')}
                          </h5>
                        )}
                      </div>
                    );
                  } else if (e.status === "dead") {
                    return (
                      <div className={`step_single ${selectedEnquiry.enquiryStatus === "open" || selectedEnquiry.enquiryStatus === "working" ? "wait" : ""}`} key={e}>
                        <div className="number">
                          <span class="material-symbols-outlined">
                            cancel
                          </span>
                        </div>
                        <h6 className='text-capitalize'>
                          {e.status}
                        </h6>
                        {e.updatedAt && (
                          <h5>
                            {format(e.updatedAt.toDate(), 'dd-MMM-yy hh:mm a')}
                          </h5>
                        )}
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}             
              </div>
            </div>
       
           
          </Modal>
        </>

      )}

    </>

  )
}

export default EnquirySingle
