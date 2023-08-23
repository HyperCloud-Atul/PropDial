import React from "react";

// css
import "./OurTeam.css";

const OurTeam = () => {
  return (
    <>
      <section className="our_team sect_padding">
        <div className="container">
          <div className="section_title">
            <div class="section_title_effect">OUR TEAM</div>
            <h3>Unveiling the Stars Behind Our Success</h3>
          </div>
          <div className="team_member">
            <div className="tm_single">
              <div class="flip-card" tabIndex="0">
                <div class="flip-card-inner">
                  <div class="flip-card-front" style={{
                    backgroundImage:"url('./assets/img/team1.jpg')"
                  }}>                    
                  </div>
                  <div class="flip-card-back"
                  style={{
                    backgroundImage:"url('./assets/img/team1.jpg')"
                  }}>
                    <h3>An engineering brain, worked in US Software Industry for 10 years. Launched brokerage firm for primary market in 2009.Build and sold a product for property agents to connect and share property needs. He is Real Estate expert and alumni of MMMEC Gorakhpur.</h3>
                  </div>
                </div>
              </div>
              <div className="about_tm">
                <h4>Mr.Vinay Prajapati</h4>
                <h5>CO-FOUNDER AND CEO</h5>
              </div>
            </div>
            <div className="tm_single">
              <div class="flip-card" tabIndex="0">
                <div class="flip-card-inner">
                  <div class="flip-card-front" style={{
                    backgroundImage:"url('./assets/img/team2.jpg')"
                  }}>                    
                  </div>
                  <div class="flip-card-back"
                  style={{
                    backgroundImage:"url('./assets/img/team2.jpg')"
                  }}>
                    <h3>A seasoned Entrepreneur, thought leader and alumnus of IIT Kanpur and IIT Kharagpur. Prior to Propdial, he was part of a Global IT consulting firm for close to two decades, working at various leadership roles, responsible for building and growing multiple business verticals</h3>
                  </div>
                </div>
              </div>
              <div className="about_tm">
                <h4>Mr. Gopal Mishra</h4>
                <h5>CO-FOUNDER AND COO</h5>
              </div>
            </div>
            <div className="tm_single">
              <div class="flip-card" tabIndex="0">
                <div class="flip-card-inner">
                  <div class="flip-card-front" style={{
                    backgroundImage:"url('./assets/img/team3.jpg')"
                  }}>                    
                  </div>
                  <div class="flip-card-back"
                  style={{
                    backgroundImage:"url('./assets/img/team3.jpg')"
                  }}>
                    <h3>A Technocrat with 15 plus years of experience in the area of E-commerce, Android application, Web application, Online advertising (PPC), SEO consulting, Affiliate marketing. M. Sc. (Computer Science) from MD University, Rohtak, Haryana.</h3>
                  </div>
                </div>
              </div>
              <div className="about_tm">
                <h4>Mr. Vivek Pandey</h4>
                <h5>HEAD OF ENGINEERING</h5>
              </div>
            </div>
            <div className="tm_single">
              <div class="flip-card" tabIndex="0">
                <div class="flip-card-inner">
                  <div class="flip-card-front" style={{
                    backgroundImage:"url('./assets/img/team4.jpg')"
                  }}>                    
                  </div>
                  <div class="flip-card-back"
                  style={{
                    backgroundImage:"url('./assets/img/team4.jpg')"
                  }}>
                    <h3>A renowned lawyer with 18 plus years of experience in legal profession. He has been rendering legal advice and services to various international and national clients and has considerable experience in various fields of law. Graduated from ‘Campus Law Centre’, University of Delhi.</h3>
                  </div>
                </div>
              </div>
              <div className="about_tm">
                <h4>Mr. Naveen Bhardwaj</h4>
                <h5>Head of Legal and Compliance</h5>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurTeam;
