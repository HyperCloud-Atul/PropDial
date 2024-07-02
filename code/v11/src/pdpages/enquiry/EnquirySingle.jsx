import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import Modal from 'react-bootstrap/Modal';

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
          <div className="left">
            {/* <div className="img_div">
     <img src="./assets/img/loudspeaker.jpg" alt="" />
   </div>       */}
            <div className="right">
              <h5 className="title">{doc.name}</h5>
              <h6 className="sub_title">
                {doc.phone.replace(
                  /(\d{2})(\d{5})(\d{5})/,
                  "+$1 $2-$3"
                )}
              </h6>
              {doc.description && (
                <h6 className="sub_title">{doc.description} </h6>
              )}
              {doc.remark && (
                <h6 className="sub_title">{doc.remark} </h6>
              )}

            </div>
          </div>
          <h4 className="top_right_content">
            <span>
            {format(new Date(doc.date), 'dd-MMM-yy hh:mm a')}
            </span>
          </h4>
          {doc.iAm && (
            <h4 className="top_left_content">
              <span>
                {doc.iAm}
              </span>
            </h4>
          )}
          {doc.referredBy && (
            <h4 className="top_left_content">
              <span>
                {doc.referredBy}
              </span>
            </h4>
          )}
        </div>
      ))}
      {selectedEnquiry && (
        <>
          <Modal show={showEnquriyModal} onHide={handleEnquriyModalClose} className="enquiry_modal">
            <span class="material-symbols-outlined modal_close" onClick={handleEnquriyModalClose}>
              close
            </span>
            <div className="modal_left_content">
              {/* {format(selectedEnquiry.createdAt.toDate(), 'dd-MMM-yy hh:mm a')} */}
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
            <div className="enquiry_status d">
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
                <div className="step_single" >
                  <div className="number">
                    <span class="material-symbols-outlined">
                      open_in_new
                    </span>
                  </div>
                  <h6>
                    Open
                  </h6>
                  <h5>
                    01-Jul-2024, 5:24 PM
                  </h5>
                </div>
                <div className={`step_single ${selectedEnquiry.enquiryStatus === "open" ? "wait" : ""}`}>
                  <div className="number">
                    <span class="material-symbols-outlined">
                      autorenew
                    </span>
                  </div>
                  <h6>
                    Working
                  </h6>
                </div>
                <div className={`step_single ${selectedEnquiry.enquiryStatus === "open" || selectedEnquiry.enquiryStatus === "working" ? "wait" : ""}`}>
                  <div className="number">
                    <span class="material-symbols-outlined">
                      
                      {selectedEnquiry.enquiryStatus === "successful" ? "check_circle" : "cancel"}
                    </span>
                  </div>
                  <h6>
                    {selectedEnquiry.enquiryStatus === "successful" ? "Successful" : "Dead"}
                  </h6>
                </div>
              </div>
            </div>

          </Modal>
        </>

      )}

    </>

  )
}

export default EnquirySingle
