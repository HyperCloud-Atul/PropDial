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
            <div className="left_section text-center d-flex align-items-center flex-column">
              <h2>For Real Estate Developers</h2>
              {/* Left upper card */}
              <div className="d-flex card_div_1">
                <div>
                  <div className="d-flex align-items-center card_upper">
                    <img src="https://www.squareyards.com/assets/images/broker-performance/prime-connect.svg" />
                    <div> 
                      <h4>Prime Connect</h4>
                      <div
                        className="heading_underline"
                        style={{ backgroundColor: "#83d1d7" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h6>Confirmed Site Visits to your Project</h6>
                    </div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h6>Personalized Project Creatives for CPs</h6>
                    </div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h6>CP Payouts Handling for Site visits</h6>
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
                <div className="card_img d-flex align-items-end">
                  <img src="https://www.squareyards.com/assets/images/broker-performance/prime_connect-side.svg" />
                </div>
              </div>

              {/* left below card */}
              <div className="d-flex card_div_2">
                <div>
                  <div className="d-flex align-items-center card_upper">
                    <img src="https://www.squareyards.com/assets/images/broker-performance/propvr.svg" />
                    <div>
                      <h4>Prop VR</h4>
                      <div
                        className="heading_underline"
                        style={{ backgroundColor: "#708dc7" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h6>Get all 3D visualisation under one roof</h6>
                    </div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h6>Virtual Sales Tool for remote showcase</h6>
                    </div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h6>Tech-enabled Experience Center Solutions</h6>
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
                <div className="card_img d-flex align-items-end">
                  <img src="https://www.squareyards.com/assets/images/broker-performance/propvr-side.svg" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="col-md-6">
            <div className="left_section text-center d-flex align-items-center flex-column">
              <h2>For Agents</h2>
              {/* right upper card */}
              <div className="d-flex card_div_3">
                <div>
                  <div className="d-flex align-items-center card_upper">
                    <img src="https://www.squareyards.com/assets/images/broker-performance/square-connect.svg" />
                    <div>
                      <h4>Square Connect</h4>
                      <div
                        className="heading_underline"
                        style={{ backgroundColor: "#f2b196" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h6>Free Listing & Leads</h6>
                    </div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h6>Higher Visibility using In-app marketing tools</h6>
                    </div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h6>Exclusive Deals & Higher commission Slabs</h6>
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
                <div className="card_img d-flex align-items-end">
                  <img src="https://www.squareyards.com/assets/images/broker-performance/square-connect-side.png" />
                </div>
              </div>

              {/* right below card */}
              <div className="d-flex card_div_4">
                <div>
                  <div className="d-flex align-items-center card_upper">
                    <img src="https://www.squareyards.com/assets/images/broker-performance/superagent.svg" />
                    <div>
                      <h4>Smart Agent</h4>
                      <div
                        className="heading_underline"
                        style={{ backgroundColor: "#f2b196" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h6>Promote your brand through social media</h6>
                    </div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h6>Automate listing videos, website & brochures.</h6>
                    </div>
                    <div className="d-flex align-items-center cards_para">
                      <img src="https://www.squareyards.com/assets/images/broker-performance/tick.svg" />
                      <h6>Use powerful AI to enhance your content</h6>
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
                <div className="card_img d-flex align-items-end">
                  <img src="https://www.squareyards.com/assets/images/broker-performance/superagent-me-side.svg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersForAgents;
