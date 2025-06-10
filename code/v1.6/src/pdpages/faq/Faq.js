import { Helmet } from "react-helmet";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import Hero from "../../components/Hero";
import BottomRightFixedIcon from "../../components/BottomRightFixedIcon";
import SEOHelmet from "../../components/SEOHelmet ";
// css
import "./Faq.css";

const Faq = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    
    <div>        
<SEOHelmet title="Answers to Your Property Management Queries | Propdial FAQs" description="Find answers to common questions about Propdial's property management services in India. Learn about rental management, maintenance, tenant handling, and more."
    og_description="Find answers to common questions about Propdial's property management services in India. Learn about rental management, maintenance, tenant handling, and more."
    og_title="Answers to Your Property Management Queries | Propdial FAQs" /> 
      <BottomRightFixedIcon />
      <Hero
        pageTitle="Propdial FAQs"
        pageSubTitle="Free to ask"
        heroImage="./assets/img/faq_page_hero.jpg"
      />

      <section className="faq sect_padding">
        <div className="container">
          <div className="faq_section_single">
            <div className="section_title">
              <h3>About Propdial</h3>
            </div>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>What is PMS?</Accordion.Header>
                <Accordion.Body>
                  PMS stands for Property Management Services that we provide to
                  our customers, and includes the following services at a high
                  level:
                  <ol>
                    <li>Renting/Leasing - we will find the tenant if you want to let out.</li>
                    <li>Tenant background verification and rental agreement.</li>
                    <li>Rent collection and bill payment.</li>
                    <li>Quarterly property inspection with pictures.</li>
                    <li>Maintenance as needed (painting, plumbing, electrical work, etc.).</li>
                  </ol>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>What is PROPDIAL?</Accordion.Header>
                <Accordion.Body>
                  Propdial is a Property Management and Maintenance company designed to serve homeowners, and help them to manage their property with no hassle.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>What is the use of PMS agreement?</Accordion.Header>
                <Accordion.Body>
                  PMS is a legal document that helps us work on your behalf when managing your property. We visit your property to review, work with your tenant for rent collection, get repairs done after your approval, etc. This document helps us take care of all these things as an authorized service provider.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          <div className="faq_section_single">
            <div className="section_title">
              <h3>About Seller Verification</h3>
            </div>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>I don't think I need full PMS services. I just want to rent out my property.</Accordion.Header>
                <Accordion.Body>
                  We only provide renting services to those properties that are coming to us for Property Management Services and properties managed only by Propdial.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Why do you ask for 15 days BROKERAGE?</Accordion.Header>
                <Accordion.Body>
                  We have a big broker network who works for us on payment. We pass this brokerage to the brokers to have them work on your property on high priority. Propdial doesn't keep any brokerage amount.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Why PROPDIAL when I can use regular BROKERS to rent out my property?</Accordion.Header>
                <Accordion.Body>
                  <p>
                    There are many benefits to using Propdial services instead of a typical broker.
                  </p>
                  <p>
                    You can only work with one broker at a time as they have to keep keys to show your property to prospective tenants. Propdial works with many brokers at the same time. We keep the keys with ourselves, and market your property to all the brokers in the town. This helps to rent out the property quickly.
                  </p>
                  <p>
                    Broker services end the moment they find a tenant for you. We at Propdial will work with you and the tenant for background check, police verification, property handoff, and inventory assessment. We also assist at the time of tenant move-out and provide a final assessment of the property to the owner.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          
          <div className="faq_section_single">
            <div className="section_title">
              <h3>About Loan Process</h3>
            </div>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Why do we have to pay for BROKERAGE?</Accordion.Header>
                <Accordion.Body>
                  <p>
                    We engage all the brokers in the area to find a tenant for your property. This brokerage amount is passed on to the broker and helps to treat your property on a priority basis. We ask for this brokerage whenever we have to find a new tenant and engage brokers to do the job.
                  </p>
                  <p>
                    If you find a tenant from your contacts, or if an existing tenant is renewing the contract, then there are no brokerage fees charged.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>What are your policies if tenants are not paying rent regularly?</Accordion.Header>
                <Accordion.Body>
                  <p>
                    We collect post-dated checks in advance from tenants to avoid this kind of situation. We do background checks and police verification of the tenant and provide all reports to the homeowner. It is the homeowner who finalizes a tenant.
                  </p>
                  <p>
                    If a situation like this arises, we work with the homeowner to act on their behalf as directed by them.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>What is the procedure for POLICE VERIFICATION of tenants?</Accordion.Header>
                <Accordion.Body>
                  <p>
                    We ask for Passport/Aadhar Card/Driving License/3 photographs, and a certificate of permanent address.
                  </p>
                  <p>
                    All these documents are submitted to the police station.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>


          <div className="faq_section_single">
            <div className="section_title">
              <h3>About Legal Forms</h3>
            </div>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Since how long you people are into this business?</Accordion.Header>
                <Accordion.Body>
                  <p>
                  Mr. Vinay Prajapati is the founder of the company has expertise in REAL ESTATE for more than 10 long years. Propdial started 2.5 years back when some of our NRI customers asked for a desire to have a reliable and trusted property management service.
                  </p>
                  
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Do you also deal in sale/purchase of properties?</Accordion.Header>
                <Accordion.Body>
                  <p>
                  Yes, we do deal in sale purchase of properties for our clients.
                  </p>              
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Do you deal in commercial properties?</Accordion.Header>
                <Accordion.Body>
                
                  <p>
                  Yes, we do provide property management services for Commercial Properties.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header> How you will market or advertise my property? What's different?</Accordion.Header>
                <Accordion.Body>
                
                  <p>
                  We use all channels to advertise the property. We advertise property on our own PROPDIAL website and also on other commonly used real estate web portals. We also engage all brokers of the area to find a tenant for the property.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
