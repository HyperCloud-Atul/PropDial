import React from 'react'
import { format } from 'date-fns';

const EnquirySingle = ({ enquiries }) => {
  return (
    <>
      {enquiries && enquiries.map((doc, index) => (
        <div className="my_small_card notification_card" key={index}>
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
              <h6 className="sub_title">{doc.description} </h6>
            </div>
          </div>
          <h4 className="top_right_content">
            <span>
              {format(doc.createdAt.toDate(), 'dd-MMM-yy hh:mm a')}
            </span>
          </h4>
          <h4 className="top_left_content">
            <span>
            {doc.iAm}
            </span>
          </h4>
          
        </div>

      ))}
    </>

  )
}

export default EnquirySingle
