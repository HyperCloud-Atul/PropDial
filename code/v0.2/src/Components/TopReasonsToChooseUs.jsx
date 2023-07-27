import React from "react";
import "./TopReasonsToChooseUs.css";
const TopReasonsToChooseUs = () => {
  return (
    <>
    <section className="Services-parent">
        <div className="container">
            <div className="review-heading">
                <h3>Top 6 Reasons to <span>Choose Us</span></h3>
                <p>Happy and Satisfied Customers</p>
                <div className="divider-line"></div>
            </div>
            <div className="row gy-4">
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="service-card">
                        <i className="bi bi-emoji-smile"></i>
                        <h1>Happy and Satisfied Customers</h1>
                        <p>We have a very happy customer base with a high retention rate of more than 80%, one of
                            the
                            highest
                            across industry.</p>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="service-card">
                        <i className="bi bi-tags"></i>
                        <h1>Competitive Pricing</h1>
                        <p>Propdial offers one of the best pricing for this service across the industry, without
                            compromising on
                            the quality of the service offered.</p>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="service-card">
                        <i className="bi bi-cpu"></i>
                        <h1>Technology At Forefront</h1>
                        <p>Propdial leverages technology to make the process of property management very smooth and
                            efficient,
                            with minimal effort required by the property owners.</p>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="service-card">
                        <i className="bi bi-brightness-low"></i>
                        <h1>Full Transparency</h1>
                        <p>Every step of the property management from tenant onboarding to property inspection and
                            maintenance
                            is documented and updated online immediately.</p>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="service-card">
                        <i className="bi bi-award"></i>
                        <h1>Experienced Co-Founders</h1>
                        <p>The co-founders including the core team have decades of experience in the property
                            management
                            space
                            and thus are well equipped to solve customer pain points.</p>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="service-card">
                        <i className="bi bi-wifi"></i>
                        <h1>Our Wide Network</h1>
                        <p>Our extensive network of offline brokers and vast reach across multiple online platforms
                            will
                            ensure
                            that you get the best clients without much delay.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  );
};

export default TopReasonsToChooseUs;