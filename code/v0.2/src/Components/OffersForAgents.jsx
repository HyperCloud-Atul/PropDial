import React from "react";

// styling
import "./OffersForAgents.css";
const OffersForAgents = () => {
  return (
    <div className="parent_section">
      <div className="container">
        <div className="row">
          {/* LEFT SECTION */}
          <div className="col-md-6">
            <div className="left_section text-center">
              <h2>For Real Estate Developers</h2>
              <div className="d-flex card_div_1">
                <div>
                  <div className="d-flex align-items-center card_upper">
                    <img src="https://www.squareyards.com/assets/images/broker-performance/prime-connect.svg" />
                    <div>
                      <h4>Prime Connect</h4>
                      <hr className="heading_underline" />
                    </div>
                  </div>
                  <div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h4>Confirmed Site Visits to your Project</h4>
                    </div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h4>Personalized Project Creatives for CPs</h4>
                    </div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h4>CP Payouts Handling for Site visits</h4>
                    </div>
                  </div>
                  <div className="btn_div d-flex align-items-center">
                    <button
                      type="button"
                      class="btn btn-primary text-dark know_more_btn"
                    >
                      Know more
                      <i class="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
                <div className="card_img d-flex align-items-end h-100">
                  <img src="https://www.squareyards.com/assets/images/broker-performance/prime_connect-side.svg" />
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT SECTION */}
          <div className="col-md-6">
            <div className="right_section text-center">
              <h2>For Agents</h2>
              <div className="card_div"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersForAgents;
