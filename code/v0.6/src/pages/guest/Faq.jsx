import React from "react";
import Hero from "../../Components/Hero";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// component
import BottomRightFixedIcon from "../../Components/BottomRightFixedIcon";

// css
import "./Faq.css";

const Faq = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  return (
    <div className="pa_bg ">
      {/* <BottomRightFixedIcon></BottomRightFixedIcon> */}
      <Hero
        pageTitle="FAQ"
        pageSubTitle="Free to ask"
        heroImage="./assets/img/faq_page_hero.jpg"
      ></Hero>

      <section className="faq sect_padding">
        <div className="container">
          <div className="faq_section_single">
            <div className="section_title">
              <h3>Frequently Asked Questions</h3>
            </div>
            <div className="accordion" id="a1accordion_section">
              <div className="accordion-item">
                <h2 className="accordion-header" id="a1headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a1collapseOne"
                    aria-expanded="true"
                    aria-controls="a1collapseOne"
                  >
                    Who we are?
                  </button>
                </h2>
                <div
                  id="a1collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="a1headingOne"
                  data-bs-parent="#a1accordion_section"
                >
                  <div className="accordion-body">
                    <p>
                      {" "}
                      Welcome to PropAgent, a vibrant community platform
                      specially designed for property agents! At PropAgent, we
                      understand the importance of collaboration and networking
                      in the dynamic real estate industry. Our platform serves
                      as a dedicated space for property agents to quickly connect,
                      collaborate, and thrive together.
                    </p>

                    <p>
                      As property professionals, we recognize the value of a
                      strong community, and PropAgent is here to foster that
                      sense of unity. Whether you're an experienced agent or
                      just starting in the industry, our platform provides a
                      welcoming environment for you to showcase your listings,
                      explore properties added by fellow agents, and engage in
                      meaningful conversations.
                    </p>

                    <p>
                      PropAgent aims to revolutionize the way property agents
                      connect and grow. By offering a user-friendly interface,
                      powerful tools, and a robust support system, we empower
                      our community members to expand their networks, share
                      valuable insights, and stay updated on the latest industry
                      trends.
                    </p>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="a1headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a1collapseTwo"
                    aria-expanded="false"
                    aria-controls="a1collapseTwo"
                  >
                    Why choose PropAgent?
                  </button>
                </h2>
                <div
                  id="a1collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="a1headingTwo"
                  data-bs-parent="#a1accordion_section"
                >
                  <div className="accordion-body">
                    <p>
                      <ul>
                        <li>
                          <b>Collaboration:</b> Join a community of like-minded
                          professionals who share your passion for real estate.
                          Collaborate on property listings, discuss market
                          trends, and exchange ideas to elevate your expertise.
                        </li>
                      </ul>
                    </p>
                    <p>
                      <ul>
                        <li>
                          <b> Networking Opportunities:</b> Expand your
                          professional network by connecting with agents from
                          various regions. Forge partnerships, seek advice, and
                          build lasting relationships within the expansive
                          Propagent community.
                        </li>
                      </ul>
                    </p>
                    <p>
                      <ul>
                        <li>
                          <b>Listing Showcase:</b> Effortlessly add and showcase
                          your property listings to a broad audience of fellow
                          agents. Gain exposure, attract potential clients, and
                          enhance your online presence in the competitive real
                          estate landscape.
                        </li>
                      </ul>
                    </p>
                    <p>
                      <ul>
                        <li>
                          <b>Knowledge Hub:</b> Stay informed and sharpen your
                          skills with access to our knowledge hub. Explore
                          educational resources, stay updated on industry news,
                          and elevate your understanding of the ever-evolving
                          real estate market.
                        </li>
                      </ul>
                    </p>
                    <p>
                      <ul>
                        <li>
                          <b>Support and Resources:</b> Benefit from a
                          supportive community and access valuable resources to
                          help you overcome challenges, seize opportunities, and
                          navigate the complexities of the property market.
                        </li>
                      </ul>
                    </p>
                    <p>
                      {" "}
                      Join PropAgent today and be a part of a thriving community
                      that empowers property agents to succeed. Together, let's
                      elevate the real estate experience and redefine the future
                      of property networking!"
                    </p>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="a1headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a1collapseThree"
                    aria-expanded="false"
                    aria-controls="a1collapseThree"
                  >
                    How to use this platform?
                  </button>
                </h2>
                <div
                  id="a1collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="a1headingThree"
                  data-bs-parent="#a1accordion_section"
                >
                  <div className="accordion-body how_use_propagent">
                    Here's a step-by-step guide on how to use PropAgent and set
                    up your profile to maximize your experience on the platform
                    <br />
                    <b>Getting Started with PropAgent: A Step-by-Step Guide</b>
                    <ol>
                      <li>
                        {" "}
                        <b>Create Your Account:</b>
                        <ul>
                          <li>
                            Visit the PropAgent website and click on the "Sign
                            Up" button.
                          </li>
                          <li>
                            Fill in the required information to create your
                            account. This includes your name, email address, and
                            a secure password.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <b>Login to Your Account:</b>
                        <ul>
                          <li>
                            {" "}
                            Log in using your credentials on the PropAgent
                            platform.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <b>Complete Your Profile:</b>
                        <ul>
                          <li>
                            Navigate to the "Profile" section to provide
                            additional details about yourself. This may include
                            profile picture.
                          </li>
                          <li>
                            You can edit your Name, Phone number, Profile pic
                            any time
                          </li>
                        </ul>
                      </li>
                      <li>
                        <b>Explore the Dashboard:</b>

                        <ul>
                          <li>
                            Familiarize yourself with the platform dashboard. Here, you'll find key features, notifications, and updates relevant to your profile.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <b>Navigate to Properties:</b>
                        <ul>
                          <li>
                            Head to the "Properties" menu to begin adding your listings. This is where you can showcase the properties you represent.
                          </li>
                          <li>
                            Click on the "Add Property" button to start filling in the details of the property you want to feature.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <b>Fill in Property Details:</b>
                        <ul>
                          <li>
                            Provide comprehensive information about the property, including its location, specifications, amenities, and any other relevant details.
                          </li>
                          <li>
                            Upload high-quality images to make your listing visually appealing.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <b>Save and Publish:</b>
                      </li>
                      <li>
                        <b>Connect with Others:</b>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="verticall_gap"></div>
          <div className="faq_section_single">
            <div className="section_title">
              <h3>About Seller Verification</h3>
            </div>
            <div className="accordion" id="a2accordion_section">
              <div className="accordion-item">
                <h2 className="accordion-header" id="a2headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a2collapseOne"
                    aria-expanded="true"
                    aria-controls="a2collapseOne"
                  >
                    I don't think I need full PMS services. I just want to rent
                    out my property.
                  </button>
                </h2>
                <div
                  id="a2collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="a2headingOne"
                  data-bs-parent="#a2accordion_section"
                >
                  <div className="accordion-body">
                    We only provide renting services to those properties which
                    are coming to us for Property Management Services and
                    properties who are managed by only Prodial.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="a2headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a2collapseTwo"
                    aria-expanded="false"
                    aria-controls="a2collapseTwo"
                  >
                    Why you ask for 15 days BROKERAGE?
                  </button>
                </h2>
                <div
                  id="a2collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="a2headingTwo"
                  data-bs-parent="#a2accordion_section"
                >
                  <div className="accordion-body">
                    We have a big broker network who work for us on payment. We
                    pass this brokerage to the brokers to have them work on your
                    property on high priority. Propagent doesn't keep any
                    brokerage amount.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="a2headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a2collapseThree"
                    aria-expanded="false"
                    aria-controls="a2collapseThree"
                  >
                    Why Propagent when I can use regular BROKERS to rent out my
                    property.
                  </button>
                </h2>
                <div
                  id="a2collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="a2headingThree"
                  data-bs-parent="#a2accordion_section"
                >
                  <div className="accordion-body">
                    <p>
                      There are many benefits with using Propagent services
                      instead of a typical broker.
                    </p>

                    <p>
                      You can only work with one broker at a time as he has to
                      keep keys to show your property to prospective tenants.
                      Propagent works with many brokers at the same time. We
                      keep the keys with ourselves, and market your property to
                      all the brokers in the town. This helps to rent out the
                      property quickly.
                    </p>

                    <p>
                      Broker services end the moment he finds a tenant for you.
                      We at Propagent will work with you and tenant for
                      background check, police verification, property handoff
                      and inventory assessment. We also work at the time of
                      tenant move out and provide a final assessment of the
                      property to the owner.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="verticall_gap"></div>
          <div className="faq_section_single">
            <div className="section_title">
              <h3>About Loan Process</h3>
            </div>
            <div className="accordion" id="a3accordion_section">
              <div className="accordion-item">
                <h2 className="accordion-header" id="a3headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a3collapseOne"
                    aria-expanded="true"
                    aria-controls="a3collapseOne"
                  >
                    Why we have to pay for BROKERAGE?
                  </button>
                </h2>
                <div
                  id="a3collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="a3headingOne"
                  data-bs-parent="#a3accordion_section"
                >
                  <div className="accordion-body">
                    <p>
                      We engage all the brokers in the area to find a tenant for
                      your property. This brokerage amount is passed on to the
                      broker and helps to treat your property on a priority
                      basis. We ask for this brokerage whenever we have to find
                      a new tenant and engage brokers to do the job.
                    </p>
                    <p>
                      If you find a tenant from your own contacts, of if
                      existing tenant is renewing the contract then there is no
                      brokerage fees charged.
                    </p>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="a3headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a3collapseTwo"
                    aria-expanded="false"
                    aria-controls="a3collapseTwo"
                  >
                    What are your policies if tenants are not paying rent
                    regularly?
                  </button>
                </h2>
                <div
                  id="a3collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="a3headingTwo"
                  data-bs-parent="#a3accordion_section"
                >
                  <div className="accordion-body">
                    <p>
                      We collect post-dated checks in advance from tenants to
                      avoid this kind of situation. We do background checks and
                      police verification of the tenant and provide all reports
                      to the home owner. It is the home owner who finalizes a
                      tenant.
                    </p>
                    <p>
                      If a situation like this arises we work with the home
                      owner to act on his behalf as directed by the owner.
                    </p>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="a3headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a3collapseThree"
                    aria-expanded="false"
                    aria-controls="a3collapseThree"
                  >
                    What is the procedure for POLICE VERIFICATION of tenants?
                  </button>
                </h2>
                <div
                  id="a3collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="a3headingThree"
                  data-bs-parent="#a3accordion_section"
                >
                  <div className="accordion-body">
                    <p>
                      We ask for Passport/Aadhar Card/ Driving licence/3
                      photographs and certificate of Permanent address.
                    </p>
                    <p>All these documents are submitted in POLICE STN.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="verticall_gap"></div>
          <div className="faq_section_single">
            <div className="section_title">
              <h3>About Legal Forms</h3>
            </div>
            <div className="accordion" id="a4accordion_section">
              <div className="accordion-item">
                <h2 className="accordion-header" id="a4headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a4collapseOne"
                    aria-expanded="true"
                    aria-controls="a4collapseOne"
                  >
                    Since how long you people are into this business?
                  </button>
                </h2>
                <div
                  id="a4collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="a4headingOne"
                  data-bs-parent="#a4accordion_section"
                >
                  <div className="accordion-body">
                    Mr. Vinay Prajapati is the founder of the company has
                    expertise in REAL ESTATE for more than 10 long years.
                    Propagent started 2.5 years back when some of our NRI
                    customers asked for a desire to have a reliable and trusted
                    property management service.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="a4headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a4collapseTwo"
                    aria-expanded="false"
                    aria-controls="a4collapseTwo"
                  >
                    Do you also deal in sale/purchase of properties?
                  </button>
                </h2>
                <div
                  id="a4collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="a4headingTwo"
                  data-bs-parent="#a4accordion_section"
                >
                  <div className="accordion-body">
                    Yes, we do deal in sale purchase of properties for our
                    clients.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="a4headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a4collapseThree"
                    aria-expanded="false"
                    aria-controls="a4collapseThree"
                  >
                    Do you deal in commercial properties?
                  </button>
                </h2>
                <div
                  id="a4collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="a4headingThree"
                  data-bs-parent="#a4accordion_section"
                >
                  <div className="accordion-body">
                    Yes, we do provide property management services for
                    Commercial Properties.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="a4headingfour">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a4collapsefour"
                    aria-expanded="false"
                    aria-controls="a4collapsefour"
                  >
                    How you will market or advertise my property? What's
                    different?
                  </button>
                </h2>
                <div
                  id="a4collapsefour"
                  className="accordion-collapse collapse"
                  aria-labelledby="a4headingfour"
                  data-bs-parent="#a4accordion_section"
                >
                  <div className="accordion-body">
                    We use all channels to advertise the property. We advertise
                    property on our own Propagent website and also on other
                    commonly used real estate web portals. We also engage all
                    brokers of the area to find a tenant for the property.
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default Faq;
