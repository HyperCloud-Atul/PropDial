import { Helmet } from "react-helmet";
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from "react-router-dom";
// components
import Hero from "../../components/Hero";
import CreateTicket from "../../chatboard/CreateTicket";
import EnquiryForm from '../../components/EnquiryForm';
import { useAuthContext } from '../../hooks/useAuthContext';
import SEOHelmet from '../../components/SEOHelmet ';

// css
import "./PGContactUs.css";
import BottomRightFixedIcon from "../../components/BottomRightFixedIcon";
const PGContactUs = () => {
  const { user } = useAuthContext();
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const contactFormRef = useRef(null);

  useEffect(() => {
    // Scroll to the contact form when the component mounts
    contactFormRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []); // Empty dependency array ensures this effect runs only once after the initial render
   

  return (
    
    <div className="pg_contact_us">
       <Helmet>
    
  </Helmet>
  <SEOHelmet title="Contact Propdial | India's Trusted Property Management Experts" description="Reach out to Propdial, India's leading property management company, for expert rental, maintenance, and property solutions. Get in touch with us today!"
    og_description="Reach out to Propdial, India's leading property management company, for expert rental, maintenance, and property solutions. Get in touch with us today!"
    og_title="Contact Propdial | India's Trusted Property Management Experts" /> 
      <BottomRightFixedIcon></BottomRightFixedIcon>
      <Hero
        pageTitle="Contact Propdial"
        pageSubTitle="Reach Out to Us"
        heroImage="./assets/img/contact_us_page_hero.jpg"
      ></Hero>
      <section className="loc_em_ph">
        <div className="container">
          <div
            className="loc_em_ph_inner"
            style={{
              backgroundImage: "url('./assets/img/contact_info_belt.jpg')",
            }}
          >
            <div className="section_title">
              <h3>Regional Offices</h3>
            </div>
            <div className="lep_single">
              <div>
                <div
                  className="icon_div "
                  style={{
                    backgroundImage: "url('./assets/img/bangaluru.jpg')",
                  }}
                ></div>
                <h4>Bengaluru</h4>
              </div>
              <h6 className="lep_single_address">
                #17, GF, 1st Cross, Lakshmi Layout Bannerghatta Rd, Bengaluru -
                560 076, Karnataka
              </h6>
            </div>
            <div className="lep_single">
              <div>
                <div
                  className="icon_div "
                  style={{
                    backgroundImage: "url('./assets/img/hyderabad.jpg')",
                  }}
                ></div>
                <h4>Hyderabad</h4>
              </div>
              <h6>
                #402, Jamuna Tirath, Nature Cure Hospital Road Ameerpet,
                Hyderabad, Telangana
              </h6>
            </div>
            <div className="lep_single">
              <div>
                <div
                  className="icon_div "
                  style={{
                    backgroundImage: "url('./assets/img/pune.jpg')",
                  }}
                ></div>
                <h4>Pune</h4>
              </div>
              <h6>
                Shop No. 2, Kalate Market, Datta Mandir Rd, Wakad, Pune - 411
                057, Maharashtra
              </h6>
            </div>
          </div>
        </div>
      </section>
      <section className="loc_em_ph" >
        <div className="container">
          <div
            className="loc_em_ph_inner"
            style={{
              backgroundImage: "url('./assets/img/contact_info_belt.jpg')",
            }}
          >
            <div className="lep_single">
              <div>
                <div className="icon_div ">
                  <img src="./assets/img/location_f_cpg.png"></img>
                </div>
                <h4>Address</h4>
              </div>
              <h6 className="lep_single_address">
                #204, 2nd floor, Vipul Trade Centre, Sector 48, Sohna Road,
                Gurugram <br></br>- 122 018, Haryana
              </h6>
            </div>
            <div className="lep_single">
              <div>
                <div className="icon_div">
                  <img src="./assets/img/emailcpg.png"></img>
                </div>
                <h4>Email</h4>
              </div>
              <h6>info@propdial.com</h6>
            </div>
            <div className="lep_single">
              <div>
                <div className="icon_div">
                  <img src="./assets/img/callcpg.png"></img>
                </div>
                <h4>Phone</h4>
              </div>
              <h6>
                +91 95821 95821
              </h6>
            </div>
          </div>
        </div>
      </section>
      <section className="form_sec">

        <iframe
          title="Propdial"
          src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=propdial managment company&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
        ></iframe>
      </section>
      <section className="form_sec" ref={contactFormRef}>
        <div className="left_img">
          <img src="./assets/img/contact_from_left.jpg" alt="Left" />
        </div>
        <div
          className="right_form"
          style={{
            backgroundImage: "url('./assets/img/contact_from_right.jpg')",
          }}
        >
          {/* {user && (
            <CreateTicket />
          )} */}
          {/* {!user && ( */}
            <EnquiryForm />
          {/* )} */}

        </div>
      </section>
    </div>
  );
};

export default PGContactUs;
