import React from "react";
import { Link } from "react-router-dom";

// style
import "./CollapsibleGroup.css";

const CollapsibleGroup = () => {
  return (
    <section className="faq_single_page sect_padding">
      <div className="container">
        <div className="row">
          {/* Left section */}
          <div className="col-lg-5 img-div">
            <img src="./assets/img/coll-img.png" />
          </div>

          {/* Right section */}
          <div className="col-lg-7">
            <div className="fsp_right">
              <div className="section_title">
                <div class="section_title_effect">FAQ</div>
                <h3>top 5 Common Queries Clarified</h3>
              </div>
              <div class="accordion" id="a1accordion_section2">
              <div class="accordion-item">
                  <h2 class="accordion-header" id="a1headingTwo">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#a1collapseTwo"
                      aria-expanded="true"
                      aria-controls="a1collapseTwo"
                    >
                     What is PROPDIAL?
                    </button>
                  </h2>
                  <div
                    id="a1collapseTwo"
                    class="accordion-collapse collapse show"
                    aria-labelledby="a1headingTwo"
                    data-bs-parent="#a1accordion_section2"
                  >
                    <div class="accordion-body">
                    Propdial is a Property Management and Maintenance company designed to serve home owners, and help them to manage their property with no hassle.
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="a1headingOne">
                    <button
                      class="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#a1collapseOne"
                      aria-expanded="false"
                      aria-controls="a1collapseOne"
                    >
                 What is PMS?
                    </button>
                  </h2>
                  <div
                    id="a1collapseOne"
                    class="accordion-collapse collapse "
                    aria-labelledby="a1headingOne"
                    data-bs-parent="#a1accordion_section2"
                  >
                     <div class="accordion-body">
                    PMS stands Property Management Services that we provide to our customers, and includes following services at a high level.
                    <ol>
                      <li>
                        Renting/Leasing – we will find the tenant if you want to let out
                      </li>
                      <li>
                        Tenant background verification and rental agreement
                      </li>
                      <li>
                        Rent collection and Bill payment
                      </li>
                      <li>
                        Quarterly property inspection with pictures
                      </li>
                      <li>
                        Maintenance as needed (painting, plumbing, electrical work etc.)
                      </li>
                    </ol>
                  </div>
                  </div>
                </div>
              
                <div class="accordion-item">
                  <h2 class="accordion-header" id="a1headingThree">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#a1collapseThree"
                      aria-expanded="false"
                      aria-controls="a1collapseThree"
                    >
                     What is the use of PMS agreement?
                    </button>
                  </h2>
                  <div
                    id="a1collapseThree"
                    class="accordion-collapse collapse"
                    aria-labelledby="a1headingThree"
                    data-bs-parent="#a1accordion_section2"
                  >
                    <div class="accordion-body">
                    PMS is a legal document that helps us to work on your behalf when managing your property. We visit your property to review, work with your tenant for rent collection, get repairs done after your approval etc. and this document helps us to take care of all these things as an authorised service provider.
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="a1headingfour">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#a1collapsefour"
                      aria-expanded="false"
                      aria-controls="a1collapsefour"
                    >
                      I don’t think I need full PMS services. I just want to rent out my property.
                    </button>
                  </h2>
                  <div
                    id="a1collapsefour"
                    class="accordion-collapse collapse"
                    aria-labelledby="a1headingfour"
                    data-bs-parent="#a1accordion_section2"
                  >
                    <div class="accordion-body">
                    We only provide renting services to those properties which are coming to us for Property Management Services and properties who are managed by only Prodial.
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="a1headingfive">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#a1collapsefive"
                      aria-expanded="false"
                      aria-controls="a1collapsefive"
                    >
                      Why you ask for 15 days BROKERAGE?
                    </button>
                  </h2>
                  <div
                    id="a1collapsefive"
                    class="accordion-collapse collapse"
                    aria-labelledby="a1headingfive"
                    data-bs-parent="#a1accordion_section2"
                  >
                    <div class="accordion-body">
                    We have a big broker network who work for us on payment. We pass this brokerage to the brokers to have them work on your property on high priority. Propdial doesn’t keep any brokerage amount.
                    </div>
                  </div>
                </div>
              </div>
              <Link to="/faq">
                  <button className="theme_btn btn_fill">More FAQ
                  <span class="material-symbols-outlined btn_arrow ba_animation">
                                arrow_forward
                              </span></button>
                </Link>

            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default CollapsibleGroup;
