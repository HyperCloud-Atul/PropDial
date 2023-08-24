import React from "react";
import Hero from "../../Components/Hero";

// component 
import BottomRightFixedIcon from "../../Components/BottomRightFixedIcon";


// css
import "./Faq.css";

const Faq = () => {
  return (
    <div>
        <BottomRightFixedIcon></BottomRightFixedIcon>
      <Hero
        pageTitle="FAQ"
        pageSubTitle="Free to ask"
        heroImage="./assets/img/faq_page_hero.jpg"
      ></Hero>

      <section className="faq sect_padding">
        <div className="container">
          <div className="faq_section_single">
            <div className="section_title">
              <h3>About Propdial</h3>
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
            </div>
          </div>
          <div className="faq_section_single">
            <div className="section_title">
              <h3>About Seller Verification</h3>
            </div>
            <div class="accordion" id="a2accordion_section">
              <div class="accordion-item">
                <h2 class="accordion-header" id="a2headingOne">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a2collapseOne"
                    aria-expanded="true"
                    aria-controls="a2collapseOne"
                  >
                   Could we get a advance forecast about our business
                  </button>
                </h2>
                <div
                  id="a2collapseOne"
                  class="accordion-collapse collapse show"
                  aria-labelledby="a2headingOne"
                  data-bs-parent="#a2accordion_section"
                >
                  <div class="accordion-body">
                  Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="a2headingTwo">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a2collapseTwo"
                    aria-expanded="false"
                    aria-controls="a2collapseTwo"
                  >
                How is our Marketing Strength?
                  </button>
                </h2>
                <div
                  id="a2collapseTwo"
                  class="accordion-collapse collapse"
                  aria-labelledby="a2headingTwo"
                  data-bs-parent="#a2accordion_section"
                >
                  <div class="accordion-body">
                  Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="a2headingThree">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a2collapseThree"
                    aria-expanded="false"
                    aria-controls="a2collapseThree"
                  >
               Could get a free Consultation?
                  </button>
                </h2>
                <div
                  id="a2collapseThree"
                  class="accordion-collapse collapse"
                  aria-labelledby="a2headingThree"
                  data-bs-parent="#a2accordion_section"
                >
                  <div class="accordion-body">
                  Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="faq_section_single">
            <div className="section_title">
              <h3>About Loan Process</h3>
            </div>
            <div class="accordion" id="a3accordion_section">
              <div class="accordion-item">
                <h2 class="accordion-header" id="a3headingOne">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a3collapseOne"
                    aria-expanded="true"
                    aria-controls="a3collapseOne"
                  >
                   Could we get a advance forecast about our business
                  </button>
                </h2>
                <div
                  id="a3collapseOne"
                  class="accordion-collapse collapse show"
                  aria-labelledby="a3headingOne"
                  data-bs-parent="#a3accordion_section"
                >
                  <div class="accordion-body">
                  Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="a3headingTwo">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a3collapseTwo"
                    aria-expanded="false"
                    aria-controls="a3collapseTwo"
                  >
                How is our Marketing Strength?
                  </button>
                </h2>
                <div
                  id="a3collapseTwo"
                  class="accordion-collapse collapse"
                  aria-labelledby="a3headingTwo"
                  data-bs-parent="#a3accordion_section"
                >
                  <div class="accordion-body">
                  Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="a3headingThree">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a3collapseThree"
                    aria-expanded="false"
                    aria-controls="a3collapseThree"
                  >
               Could get a free Consultation?
                  </button>
                </h2>
                <div
                  id="a3collapseThree"
                  class="accordion-collapse collapse"
                  aria-labelledby="a3headingThree"
                  data-bs-parent="#a3accordion_section"
                >
                  <div class="accordion-body">
                  Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="faq_section_single">
            <div className="section_title">
              <h3>About Legal Forms</h3>
            </div>
            <div class="accordion" id="a4accordion_section">
              <div class="accordion-item">
                <h2 class="accordion-header" id="a4headingOne">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a4collapseOne"
                    aria-expanded="true"
                    aria-controls="a4collapseOne"
                  >
                   Could we get a advance forecast about our business
                  </button>
                </h2>
                <div
                  id="a4collapseOne"
                  class="accordion-collapse collapse show"
                  aria-labelledby="a4headingOne"
                  data-bs-parent="#a4accordion_section"
                >
                  <div class="accordion-body">
                  Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="a4headingTwo">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a4collapseTwo"
                    aria-expanded="false"
                    aria-controls="a4collapseTwo"
                  >
                How is our Marketing Strength?
                  </button>
                </h2>
                <div
                  id="a4collapseTwo"
                  class="accordion-collapse collapse"
                  aria-labelledby="a4headingTwo"
                  data-bs-parent="#a4accordion_section"
                >
                  <div class="accordion-body">
                  Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="a4headingThree">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a4collapseThree"
                    aria-expanded="false"
                    aria-controls="a4collapseThree"
                  >
               Could get a free Consultation?
                  </button>
                </h2>
                <div
                  id="a4collapseThree"
                  class="accordion-collapse collapse"
                  aria-labelledby="a4headingThree"
                  data-bs-parent="#a4accordion_section"
                >
                  <div class="accordion-body">
                  Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
    </div>
  );
};

export default Faq;
