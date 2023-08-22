import React from "react";

// component
import Hero from "../../Components/Hero";
import OurTeam from "../../Components/OurTeam";
// css
import "./PGAboutUs.css";
import FooterBefore from "../../Components/FooterBefore";


const PGAboutUs = () => {
  return (
    <div className="about_us_pg">
      <Hero pageTitle="About Us" pageSubTitle="A few words"></Hero>
      <section className="about_content">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="abc_left">
                <h2>Exceptional Value Remarkable Quality</h2>
                <p>
                  From the lush Waterline Square Park to dazzling glass facades,
                  a team of world-renowned design talent considered every detail
                  for truly impeccable surroundings.
                </p>
                <p>
                  Featuring a refined palette of natural materials, the open
                  living spaces provide a warm counterpoint to the soaring
                  ceilings and full-height windows. Custom herringbone floors
                  and hand-selected stone bring a rich tactility to the rooms.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="abc_right">
                <div className="abc_right_inner relative">
                  <img src="./assets/img/about_01.jpg" alt="" />
                  <div className="abcr_div">    
                    <h4>We Develop Quality Infrastructure And Real Estate</h4>
                    <div className="our_ex">
                      <h6>
                        YEARS <br></br> EXPERIENCE
                      </h6>
                      <h3>21</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <OurTeam></OurTeam>
      <FooterBefore></FooterBefore>
    </div>
  );
};

export default PGAboutUs;
