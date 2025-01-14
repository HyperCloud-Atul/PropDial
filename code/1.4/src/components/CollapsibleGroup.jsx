import React from "react";
import { Link, useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";

// style
import "./CollapsibleGroup.css";

const CollapsibleGroup = () => {
  const location = useLocation(); // Get the current location

  // faq display none Array
  const excludedPaths = ["/", "aboutus", "contactus", "more-menu"];
  const shouldHide = excludedPaths.includes(location.pathname);
  const className = `faq_single_page sect_padding ${shouldHide ? "" : "d_none"}`;
  // faq display none Array

  return (
    <section className={className}>
      <div className="container">
        <div className="row">
          {/* Left section */}
          <div className="col-lg-5 img-div">
            <img src="/assets/img/home/coll-img.png" alt="FAQ Illustration" />
          </div>

          {/* Right section */}
          <div className="col-lg-7">
            <div className="fsp_right">
              <div className="section_title">
                <div className="section_title_effect">FAQ</div>
                <h3>Top 5 Common Queries Clarified</h3>
              </div>
              <Accordion defaultActiveKey="0" id="a1accordion_section2">
                <Accordion.Item eventKey="0" className="accordion-item">
                  <Accordion.Header className="accordion-header">
                    What is PROPDIAL?
                  </Accordion.Header>
                  <Accordion.Body className="accordion-body">
                    Propdial is a Property Management and Maintenance company designed to serve home owners, and help them to manage their property with no hassle.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1" className="accordion-item">
                  <Accordion.Header className="accordion-header">
                    What is PMS?
                  </Accordion.Header>
                  <Accordion.Body className="accordion-body">
                    PMS stands for Property Management Services that we provide to our customers, and includes the following services at a high level:
                    <ol>
                      <li>Renting/Leasing – we will find the tenant if you want to let out</li>
                      <li>Tenant background verification and rental agreement</li>
                      <li>Rent collection and Bill payment</li>
                      <li>Quarterly property inspection with pictures</li>
                      <li>Maintenance as needed (painting, plumbing, electrical work, etc.)</li>
                    </ol>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2" className="accordion-item">
                  <Accordion.Header className="accordion-header">
                    What is the use of PMS agreement?
                  </Accordion.Header>
                  <Accordion.Body className="accordion-body">
                    PMS is a legal document that helps us to work on your behalf when managing your property. We visit your property to review, work with your tenant for rent collection, get repairs done after your approval, etc., and this document helps us to take care of all these things as an authorised service provider.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3" className="accordion-item">
                  <Accordion.Header className="accordion-header">
                    I don’t think I need full PMS services. I just want to rent out my property.
                  </Accordion.Header>
                  <Accordion.Body className="accordion-body">
                    We only provide renting services to those properties which are coming to us for Property Management Services and properties that are managed solely by Propdial.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4" className="accordion-item">
                  <Accordion.Header className="accordion-header">
                    Why you ask for 15 days BROKERAGE?
                  </Accordion.Header>
                  <Accordion.Body className="accordion-body">
                    We have a big broker network who work for us on payment. We pass this brokerage to the brokers to have them work on your property on high priority. Propdial doesn’t keep any brokerage amount.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <Link to="/faq">
                <button className="theme_btn btn_fill no_icon">
                  More FAQ
                  <span className="material-symbols-outlined btn_arrow ba_animation">
                    arrow_forward
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollapsibleGroup;
