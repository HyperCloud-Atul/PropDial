import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// component
import Hero from "../../components/Hero";
import OurTeam from "../../components/OurTeam";
import BottomRightFixedIcon from "../../components/BottomRightFixedIcon";
// css
import "../about_us/PGAboutUs.css";


const PGPriacyPolicy = () => {
    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end
    const navigate = useNavigate();
    return (
        <div className="about_us_pg">
            <BottomRightFixedIcon />
            <Hero
                pageTitle="Privacy Policy"
                pageSubTitle="Discover Our Policies
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
                                <h6 style={{ marginTop: "-12px", color: "#888", fontWeight: "lighter" }}>Last updated: 1 Jul, 2024</h6>
                                <br></br>
                                <p>
                                    <strong>Information We Collect</strong><br></br>
                                    We collect information you provide when using our platform, such as contact details and property-related data, ensuring a personalized and efficient user experience.
                                </p>
                                <p>
                                    <strong>How We Use Your Information</strong><br></br>
                                    Your data is used to facilitate property transactions, enhance user experience, and communicate important updates. We do not sell your information to third parties.
                                </p>
                                <p>

                                    <strong>Data Security</strong><br></br>
                                    We employ industry-standard security measures to protect your information. However, no method is 100% secure; use the platform at your own risk.
                                </p>
                                <p>

                                    <strong>Cookies</strong><br></br>
                                    We uses cookies to enhance user experience and analyze usage patterns. You can manage cookie preferences in your browser settings.
                                </p>
                                <p>

                                    <strong>Third-Party Links</strong><br></br>
                                    Our platform may contain links to third-party sites. We are not responsible for their privacy practices; review their policies independently.
                                </p>
                                <p>

                                    <strong>Account Deletion</strong><br></br>
                                    User having registered as Trail or License account can now request to delete their account and personal information (if any) by sending an email to info@propdial.com. Inactive users data will be automatically removed/deleted after a period of 90 days.
                                </p>
                                <p>
                                    <strong>Updates to Privacy Policy</strong><br></br>
                                    We may update our Privacy Policy. Check this page regularly for any changes.
                                </p>
                                <br></br><br></br>
                                <div>
                                    <button className="theme_btn btn_fill" onClick={() => navigate("/contact-us")}  >Get In Touch</button>
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




        </div>
    );
};

export default PGPriacyPolicy;
