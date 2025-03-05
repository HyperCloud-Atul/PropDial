import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import SEOHelmet from "../../components/SEOHelmet ";

// component
import Hero from "../../components/Hero";
import OurTeam from "../../components/OurTeam";
import BottomRightFixedIcon from "../../components/BottomRightFixedIcon";
// css
import "../about_us/PGAboutUs.css";


const PGTerms = () => {
    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end
    const navigate = useNavigate();
    return (
        <div className="about_us_pg tc_pg">
            <SEOHelmet title="Terms & Conditions | Propdial - Trusted Property Management in India" description="Explore the terms and conditions of Propdial, India's leading property management company. Understand your rights, responsibilities, and service policies."
    og_description="Explore the terms and conditions of Propdial, India's leading property management company. Understand your rights, responsibilities, and service policies."
    og_title="Terms & Conditions | Propdial - Trusted Property Management in India" /> 
            <BottomRightFixedIcon />
            <Hero
                pageTitle="Terms & Conditions | Propdial"
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
                                    <strong>Acceptance of Terms</strong><br></br>
                                    By using this application, you agree to comply with our Terms and Conditions. If you disagree, please refrain from using our platform.
                                </p>
                                <p>
                                    <strong>User Conduct</strong><br></br>
                                    Users must adhere to ethical and legal standards. We  reserves the right to terminate accounts violating our guidelines.
                                </p>
                                <p>

                                    <strong>Intellectual Property</strong><br></br>
                                    All content on our platform is protected by intellectual property laws. Users may not reproduce, distribute, or use content without permission.
                                </p>
                                <p>

                                    <strong>Limitation of Liability</strong><br></br>
                                    Propdial is not liable for any direct, indirect, or consequential damages arising from platform use.
                                </p>
                                <p>

                                    <strong>Termination</strong><br></br>
                                    Propdial reserves the right to terminate or suspend accounts for any reason without notice.
                                </p>
                                <p>

                                    <strong>Governing Law</strong><br></br>
                                    These terms are governed by the goverments laws. Any disputes will be resolved through arbitration.
                                </p>
                                <p>
                                    <strong>Updates to Terms</strong><br></br>
                                    We may update our Terms and Conditions on regular basis. Users are responsible for reviewing changes.
                                </p>
                                <br></br><br></br>
                                <div>
                                    <button className="theme_btn btn_fill"
                                        onClick={() => navigate("/contact-us")}
                                    >Get In Touch</button>
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

export default PGTerms;
