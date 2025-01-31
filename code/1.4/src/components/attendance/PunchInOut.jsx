import React from "react";

import './Attendance.scss'

const PunchInOut = () => {
  return (
    <div className="punch_in_out">
     <div className="container">
     <div className="pio_inner">
     <div className="pioi_2">
     <div className="pio_left">
          <h3 className="title">
            Good Morning <span>Sanskar Solanki</span>
          </h3>
          <h6 className="no_punch">You have not yet Punch-in for TODAY!</h6>
          <div className="piol_inner">
            <div className="pioli_single">
              <h4 className="punch_in">Punch In</h4>
              <h6>8.00am</h6>
            </div>
            <div className="pioli_single">
              <h4 className="punch_out">Punch Out</h4>
              <h6>5:00pm</h6>
            </div>
          </div>
        </div>
        <div className="pio_right">
          <div className="theme_btn btn_fill no_icon text-center">Punch In</div>
        </div>
     </div>
        <div className="pio_bottom">
        
          <div className="piob_top">
            <div className="piobt_single">
            <h5 >Previous Punch In/Out</h5>
            </div>
          </div>
          <div className="piob_body">
            <div className="piobb_single">
            <h6>Date</h6>
            <h5>25-Jan-2025</h5>
            </div>
            <div className="piobb_single">
            <h6>Day</h6>
            <h5>Monday</h5>
            </div>
            <div className="piobb_single">
            <h6>Punch-in Time</h6>
            <h5>8:00am</h5>
            </div>
            <div className="piobb_single">
            <h6>Punch-out Time</h6>
            <h5>5:00pm</h5>
            </div>
            <div className="piobb_single">
            <h6>Trip Start</h6>
            <h5>25896</h5>
            </div>
            <div className="piobb_single">
            <h6>Trip End</h6>
            <h5>25926</h5>
            </div>
          </div>
        </div>
      </div>
     </div>
    </div>
  );
};

export default PunchInOut;
