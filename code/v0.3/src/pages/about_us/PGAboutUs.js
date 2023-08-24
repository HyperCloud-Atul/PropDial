import React from "react";

// component
import Hero from "../../Components/Hero";
import OurTeam from "../../Components/OurTeam";
import FooterBefore from "../../Components/FooterBefore";
import BottomRightFixedIcon from "../../Components/BottomRightFixedIcon";
// css
import "./PGAboutUs.css";


const PGAboutUs = () => {
  return (
    <div className="about_us_pg">
    <BottomRightFixedIcon/>
      <Hero
        pageTitle="About"
        pageSubTitle="A few words"
        heroImage="./assets/img/about_us_banner.jpg"
      ></Hero>
      <section className="about_content sect_padding">
        <div className="container">
          <div className="row reverse-991">
            <div className="col-lg-6">
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
                <div>
                  <button className="theme_btn btn_fill">Get In Touch</button>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
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
                  <div class="section_title_effect">OUR VISION</div>
                </div>
                <div className="vision_points">
                  <div className="vs_single">
                    <img
                      src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>                    
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </p>
                  </div>
                  <div className="vs_single">
                    <img
                      src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>                    
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </p>
                  </div>
                  <div className="vs_single">
                    <img
                      src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>                    
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </p>
                  </div>
                  <div className="vs_single">
                    <img
                      src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>                    
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </p>
                  </div>
                  <div className="vs_single">
                    <img
                      src="./assets/img/right-arrow.png"
                      alt=""
                      className="bullet_icon"
                    />
                    <p>                    
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 mabc_right">
              <h3>What is Lorem Ipsum?</h3>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.
              </p>
              <h6>Where does it come from?</h6>
              <p>
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old. Richard McClintock, a
                Latin professor at Hampden-Sydney College in Virginia, looked up
                one of the more obscure Latin words, consectetur, from a Lorem
                Ipsum passage
              </p>
              <h6>Where can I get some?</h6>
              <p>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable.
              </p>
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
