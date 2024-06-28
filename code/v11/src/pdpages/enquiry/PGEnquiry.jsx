import React from 'react'
import EnquirySingle from './EnquirySingle'

const PGEnquiry = () => {
  return (
    <div className="top_header_pg pg_bg">
      <div className="page_spacing">    
        <div className="pg_header">
          <h2 className="m22 mb-1">Enquiry</h2>
          <h4 className="r16 light_black">All enquiry</h4>
        </div>
        <div className="vg22"></div>
        <div className="my_small_card_parent">     
              <EnquirySingle/>
      
        </div>
        <div className="vg22"></div>
      </div>
    </div>
  )
}

export default PGEnquiry
