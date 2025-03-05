import { Helmet } from "react-helmet-async";
import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

// component
import Hero from "../../components/Hero";
import OurTeam from "../../components/OurTeam";
import BottomRightFixedIcon from "../../components/BottomRightFixedIcon";
// css
import "./PGAboutUs.css";


const PGAboutUs = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  return (
    <div className="about_us_pg">
        <Helmet>
  <title>Best Property Management Company in India | Propdial</title>
  <meta name="description" content="Propdial is a trusted property management company in India, offering hassle-free rental and maintenance solutions for homeowners, NRIs, and investors." />
</Helmet>
      <BottomRightFixedIcon />
      <Hero
        pageTitle="About Us"
        pageSubTitle="Discover Our Story
        "
        heroImage="/assets/img/about_us_banner.jpg"
      ></Hero>
      <section className="about_content sect_padding">
        <div className="container">
          <div className="row reverse-991">
            <div className="col-lg-6">
              <div className="abc_left">
                <h2>Your Trusted Property Management Partner
                </h2>
                <p>
                  Propdial, established in 2014, is a leading property management services company. We specialize in offering comprehensive property management and property care-taking services to property owners and landlords.

                </p>
                <p>
                  At Propdial, we prioritize our customers above all else. Our dedication to customer satisfaction is unwavering, and we believe in transparent communication, legal compliance, and regular reporting to keep our clients informed and content.

                </p>
                <p>Choose Propdial for all your property management needs, and experience the peace of mind that comes with having a reliable partner by your side.</p>
                <div>
                  <Link className="theme_btn btn_fill mt-3" style={{
                    display:"inline-block"
                  }} to="/contact-us">Get In Touch</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="abc_right">
                <div className="abc_right_inner relative">
                  <img src="./assets/img/about_01.jpg" alt="" />
                  <div className="abcr_div">
                    <h4>Delivering Quality and On-Time Service for Over a Decade</h4>
                    <div className="our_ex">
                      <h6>
                        YEARS <br></br> EXPERIENCE
                      </h6>
                      <h3>10+</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="main_about_content sect_padding relative"
        style={{
          backgroundImage: "url('./assets/img/about_main_content_bg.jpg')",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="our_vision">
                <div className="section_title">
                  <div className="section_title_effect">OUR VISION</div>
                </div>
                <div className="vision_points">
                  <div className="vs_single">
                    <img
                      // src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>
                      <strong> Excellence in Property Management:</strong> To be recognized as a leading provider of property management services known for excellence and reliability.

                    </p>
                  </div>
                  <div className="vs_single">
                    <img
                      // src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>
                      <strong>Customer-Centric Approach:</strong> To prioritize our customers and ensure their satisfaction through transparent communication and exceptional service.

                    </p>
                  </div>
                  <div className="vs_single">
                    <img
                      // src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>
                      <strong>Innovation and Technology:</strong> To leverage cutting-edge technology and innovation to enhance our property management solutions.

                    </p>
                  </div>
                  <div className="vs_single">
                    <img
                      // src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>
                      <strong>Compliance and Legal Integrity:</strong> To ensure strict compliance with all local, state, and government laws and regulations.

                    </p>
                  </div>
                  <div className="vs_single">
                    <img
                      // src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>
                      <strong>Continuous Improvement:</strong> To continuously evolve and improve our services to meet the ever-changing needs of our clients and the property management industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 mabc_right">
              <h3>A 360-Degree <br /> Property Management Solution
              </h3>
              <p>
                Our unwavering commitment to delivering excellence drives us to provide a holistic property management solution. We approach property management as a complete circle, starting from the initial property on-boarding process. At Propdial, we leave no stone unturned to ensure your property is well-taken care of and yields optimum returns.

              </p>
              <h6>Prioritizing Customer Satisfaction
              </h6>
              <p>
                At Propdial, our customers are at the heart of everything we do. We prioritize your satisfaction above all else, ensuring you have peace of mind knowing your property is in capable hands.


              </p>
              <h6>Choose Propdial
              </h6>
              <p>
                In your search for a property management partner, choose Propdial. With our extensive experience, commitment to excellence, and customer-centric approach, we ensure your property receives the care and attention it deserves. Partner with us for all your property management needs and experience the peace of mind that comes with having a reliable partner by your side.
              </p>
            </div>
          </div>
        </div>
      </section>

      <OurTeam></OurTeam>

    </div>
  );
};

export default PGAboutUs;
