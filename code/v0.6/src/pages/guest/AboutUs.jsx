import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// component
import Hero from "../../Components/Hero";
import OurTeam from "../../Components/OurTeam";
import BottomRightFixedIcon from "../../Components/BottomRightFixedIcon";
import ContactForm from "../create/ContactForm";
// css
import "./AboutUs.css";


const AboutUs = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  return (
    <div className="about_us_pg">
      {/* <BottomRightFixedIcon /> */}
      <Hero
        pageTitle="About Us"
        pageSubTitle="Discover Our Story
        "
        heroImage="./assets/img/about_us_banner.jpg"
      ></Hero>
      <section className="about_content sect_padding">
        <div className="container">
          <div className="row reverse-991">
            <div className="col-lg-6">
              <div className="abc_left">
                <h2>Your Trusted Property Agent Community Partner
                </h2>
                <p>
                  Welcome to PropAgent, a vibrant community platform specially designed for property agents! At PropAgent, we understand the importance of collaboration and networking in the dynamic real estate industry. Our platform serves as a dedicated space for property agents to quickly connect, collaborate, and thrive together.

                </p>
                <p>
                  As property professionals, we recognize the value of a strong community, and PropAgent is here to foster that sense of unity. Whether you're an experienced agent or just starting in the industry, our platform provides a welcoming environment for you to showcase your listings, explore properties added by fellow agents, and engage in meaningful conversations.

                </p>
                <p>PropAgent aims to revolutionize the way property agents connect and grow. By offering a user-friendly interface, powerful tools, and a robust support system, we empower our community members to expand their networks, share valuable insights, and stay updated on the latest industry trends.</p>
                <div className="mt-2">
                  <Link className="theme_btn btn_fill" to="/createticket">Get In Touch</Link>
                </div>            
              </div>
            </div>
            <div className="col-lg-6">
              <div className="abc_right">
                <div className="abc_right_inner relative">
                  <img src="./assets/img/about_01.jpg" alt="" />
                  <div className="abcr_div">
                    <h4>Elevate your real estate journey with PropAgent: Connect, Collaborate, Thrive!</h4>
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
                      <strong>Collaboration Hub:</strong> Unify agents globally, fostering efficiency and connectivity for seamless transactions in a dynamic real estate industry.
                    </p>
                  </div>
                  <div className="vs_single">
                    <img
                      // src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>
                      <strong>Empowering Technology:</strong> PropAgent provides agents a 360-degree tech solution, simplifying processes, enhancing management, and ensuring industry adaptability.

                    </p>
                  </div>
                  <div className="vs_single">
                    <img
                      // src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>
                      <strong>Showcasing Excellence:</strong> Dynamic marketplace celebrating diverse skills and achievements, where agents highlight listings, success stories, and professional expertise.

                    </p>
                  </div>
                  <div className="vs_single">
                    <img
                      // src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>
                      <strong>Insightful Conversations:</strong> PropAgent nurtures a knowledge-sharing hub, facilitating discussions on trends, regulations, and best practices for continuous industry adaptation.

                    </p>
                  </div>
                  <div className="vs_single">
                    <img
                      // src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>
                      <strong>Ahead in Trends:</strong> PropAgent ensures agents stay competitive with timely updates on market trends, technologies, and regulations for informed decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 mabc_right">
              <h3>A 360-Degree Solution <br />for Property Agents

              </h3>
              <h6>Decentralized Efficiency
              </h6>
              <ul>
                <li>
                  PropAgent decentralizes efficiency for property agents, providing a comprehensive solution for seamless collaboration and networking in the real estate industry.
                </li>
                <li>
                  Our platform breaks down traditional barriers, allowing agents to connect, share insights, and thrive collectively in a decentralized environment.
                </li>
              </ul>

              <h6>Integrated Tools and Support
              </h6>
              <ul>
                <li>
                  PropAgent offers a suite of integrated tools that simplify tasks, enhance property management, and streamline communication, providing a holistic solution for property professionals.
                </li>
                <li>
                  With a robust support system, our platform ensures that agents have the resources and assistance needed to navigate challenges and succeed in their endeavors.
                </li>
              </ul>

            </div>
          </div>
        </div>
      </section>

      {/* <OurTeam></OurTeam> */}

    </div>
  );
};

export default AboutUs;
