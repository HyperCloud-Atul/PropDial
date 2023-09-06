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
              <div class="accordion" id="a1accordion_section">
                <div class="accordion-item">
                  <h2 class="accordion-header" id="a1headingOne">
                    <button
                      class="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#a1collapseOne"
                      aria-expanded="true"
                      aria-controls="a1collapseOne"
                    >
                      Could we get a advance forecast about our business
                    </button>
                  </h2>
                  <div
                    id="a1collapseOne"
                    class="accordion-collapse collapse show"
                    aria-labelledby="a1headingOne"
                    data-bs-parent="#a1accordion_section"
                  >
                    <div class="accordion-body">
                      Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="a1headingTwo">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#a1collapseTwo"
                      aria-expanded="false"
                      aria-controls="a1collapseTwo"
                    >
                      How is our Marketing Strength?
                    </button>
                  </h2>
                  <div
                    id="a1collapseTwo"
                    class="accordion-collapse collapse"
                    aria-labelledby="a1headingTwo"
                    data-bs-parent="#a1accordion_section"
                  >
                    <div class="accordion-body">
                      Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
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
                      Could get a free Consultation?
                    </button>
                  </h2>
                  <div
                    id="a1collapseThree"
                    class="accordion-collapse collapse"
                    aria-labelledby="a1headingThree"
                    data-bs-parent="#a1accordion_section"
                  >
                    <div class="accordion-body">
                      Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
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
                      Could get a free Consultation?
                    </button>
                  </h2>
                  <div
                    id="a1collapsefour"
                    class="accordion-collapse collapse"
                    aria-labelledby="a1headingfour"
                    data-bs-parent="#a1accordion_section"
                  >
                    <div class="accordion-body">
                      Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
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
                      Could get a free Consultation?
                    </button>
                  </h2>
                  <div
                    id="a1collapsefive"
                    class="accordion-collapse collapse"
                    aria-labelledby="a1headingfive"
                    data-bs-parent="#a1accordion_section"
                  >
                    <div class="accordion-body">
                      Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
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
