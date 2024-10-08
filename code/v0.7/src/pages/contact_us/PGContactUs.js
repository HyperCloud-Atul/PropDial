import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// components
import Hero from "../../Components/Hero";

// css
import "./PGContactUs.css";
import BottomRightFixedIcon from "../../Components/BottomRightFixedIcon";
const PGContactUs = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  return (
    <div className="pg_contact_us">
      <BottomRightFixedIcon></BottomRightFixedIcon>
      <Hero
        pageTitle="Contact"
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
      <section className="loc_em_ph">
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
                <br />
                +91 95821 95821
              </h6>
            </div>
          </div>
        </div>
      </section>
      <section className="form_sec">
        <div className="left_img">
          <img src="./assets/img/contact_from_left.jpg" alt="Left" />
        </div>
        <div
          className="right_form"
          style={{
            backgroundImage: "url('./assets/img/contact_from_right.jpg')",
          }}
        >
          <form>
            <div className="row">
              <div className="col-sm-12">
                <div className="section_title mb-4">
                  <h3>Get In Touch With Us</h3>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form_field">
                  <input type="text" placeholder="Name" name="name" />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">Person</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form_field">
                  <input type="email" placeholder="Email" name="email" />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form_field">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    name="phoneNumber"
                  />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form_field">
                  <input type="text" placeholder="Subject" name="subject" />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">subject</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="form_field">
                  <textarea type="text" placeholder="Message" name="message" />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">chat</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="submit_btn">
                  <button type="submit" className=" theme_btn btn_fill">
                    Send
                    <span className="material-symbols-outlined btn_arrow ba_animation">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <iframe
          title="Dentamax Clinic Location"
          src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=propdial managment company&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
        ></iframe>
      </section>
    </div>
  );
};

export default PGContactUs;
