import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// text 
import { useFirestore } from "../../hooks/useFirestore";
// text 



// css
import "./Home.css";

// component
import Banner from "../../components/Banner";
import TopCitiesInIndia from "../../components/TopCitiesInIndia";
import ProductCarousel from "../../components/ProductCarousel";
import CounterSection from "../../components/CounterSection";
import Testimonial from "../../components/Testimonial";
import Blog from "../../components/Blog";
import BottomRightFixedIcon from "../../components/BottomRightFixedIcon";
import CollapsibleGroup from "../../components/CollapsibleGroup";
import AirBnb from "../../components/AirBnb";

const Home = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end


  return (
    <div>
      <BottomRightFixedIcon></BottomRightFixedIcon>
      <Banner></Banner>
      <ProductCarousel></ProductCarousel>

      <section className="work_flow sect_padding">
        <div className="container">
          <div className="section_title">
            <div className="section_title_effect">work flow</div>
            <h3>Property Management Services</h3>
          </div>
          <div
            className="wf_first"
            style={{
              backgroundImage: "url('./assets/img/home/line.png')",
            }}
          >
            <div className="row">
              <div className="col-sm-3">
                <div className="wf_single top">
                  <div className="icon_div relative">
                    <img src="./assets/img/home/wf1.jpg" />
                    <div className="steps">1</div>
                  </div>
                  <h4>Property On-Boarding</h4>
                  <h5>
                    Property onboarding initiates by collecting pertinent data: ownership details, property type, and existing leases, fueling our management system efficiently.

                  </h5>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="wf_single bottom">
                  <div className="icon_div relative">
                    <img src="./assets/img/home/wf2.jpg" />
                    <div className="steps">2</div>
                  </div>
                  <h4>Inspection & Agreement</h4>
                  <h5>
                    Propdial initiates a property inspection to evaluate its condition, guiding maintenance decisions. We facilitate lease agreement signings for clarity and mutual consent.

                  </h5>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="wf_single top">
                  <div className="icon_div relative">
                    <img src="./assets/img/home/wf3.jpg" />
                    <div className="steps">3</div>
                  </div>
                  <h4>Financial & Legal Compliance</h4>
                  <h5>
                    Propdial maintains thorough property financial records, delivering regular statements to owners. We guarantee property compliance with local, state, and government laws.
                  </h5>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="wf_single bottom">
                  <div className="icon_div relative">
                    <img src="./assets/img/home/wf4.jpg" />
                    <div className="steps">4</div>
                  </div>
                  <h4>Reporting & Communication</h4>
                  <h5>
                    Propdial delivers periodic property reports to owners, including updates on property status, financial performance, and noteworthy developments.
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CounterSection></CounterSection>
      <section className="about_us sect_padding relative">
        {/* <div className="bg_video">
        <img src="./assets/gif/bg.gif"></img>
      </div> */}
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="ab_left row">
                <div className="col-sm-6">
                  <img
                    src="./assets/img/home/ab_left_img1.jpg"
                    alt=""
                    className="img_1"
                  />
                </div>
                <div className="col-sm-6">
                  <img
                    src="./assets/img/home/ab_left_img2.jpg"
                    alt=""
                    className="img_2"
                  />
                </div>
                <div className="col-sm-6 mt-4">
                  <img
                    src="./assets/img/home/ab_left_img3.jpg"
                    alt=""
                    className="img_1"
                  />
                </div>
                <div className="col-sm-6">
                  <img
                    src="./assets/img/home/ab_left_img4.jpg"
                    alt=""
                    className="img_2"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ab_right">
                <div className="section_title">
                  <div className="section_title_effect">ABOUT</div>
                  <h3>Your Trusted Property Management Partner</h3>
                </div>
                <h6>
                  Established in 2014, Propdial is a prominent property
                  management services company specializing in comprehensive
                  property management and care-taking services. We are committed
                  to delivering excellence and offer a complete 360-degree
                  solution for property management.
                </h6>
                <ul
                  style={{
                    listStyleType: "circle",
                  }}
                >
                  <li>
                    We efficiently manage the initial property on-boarding
                    process.
                  </li>
                  <li>
                    Our meticulous approach includes property inspection, rental
                    market analysis, tenant screening, lease agreement
                    management, and property maintenance.
                  </li>
                  <li>
                    At Propdial, customer satisfaction is our top priority. We
                    believe in transparent communication, legal compliance, and
                    regular reporting to keep our clients informed and content.
                  </li>
                </ul>
                <Link to="/about-us">
                  <button className="theme_btn btn_fill">
                    More About
                    <span className="material-symbols-outlined btn_arrow ba_animation">
                      arrow_forward
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="house_gif">
          <img src="./assets/gif/house-animation.gif"></img>
        </div> */}
      </section>

      <TopCitiesInIndia />
      <AirBnb />
      <section
        className="why_us sect_padding"
      >
        <div className="container">
          <div className="section_title">
            <div className="section_title_effect">WHY US</div>
            <h3>Elevating Properties, Simplifying Management</h3>
          </div>
          <div className="why_us_cards">
            <div className="row oneline_parent">
              <div className="col-lg-4 col-md-6 op_child">
                <div className="wuc_single b_top">
                  <img src="./assets/img/home/why_1.png" alt="" />
                  <h4 className="wucs_title">Satisfied Customers</h4>
                  <h6 className="wucs_desc">
                    We have a very happy customer base with a high retention
                    rate of more than 80%, one of the highest across industry.
                  </h6>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 op_child">
                <div className="wuc_single b_bottom">
                  <img src="./assets/img/home/why_2.png" alt="" />
                  <h4 className="wucs_title">Competitive Pricing</h4>
                  <h6 className="wucs_desc">
                    Propdial offers one of the best pricing for this service
                    across the industry, without compromising on the quality of
                    the service offered.
                  </h6>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 op_child">
                <div className="wuc_single b_top">
                  <img src="./assets/img/home/why_3.png" alt="" />
                  <h4 className="wucs_title">Technology At Forefront</h4>
                  <h6 className="wucs_desc">
                    Propdial leverages technology to make the process of
                    property management very smooth and efficient, with minimal
                    effort required by the property owners.
                  </h6>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 op_child">
                <div className="wuc_single b_bottom">
                  <img src="./assets/img/home/why_4.png" alt="" />
                  <h4 className="wucs_title">Full Transparency</h4>
                  <h6 className="wucs_desc">
                    Every step of the property management from tenant onboarding
                    to property inspection and maintenance is documented and
                    updated online immediately. This lets you have an eye on
                    your house.
                  </h6>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 op_child">
                <div className="wuc_single b_top">
                  <img src="./assets/img/home/why_5.png" alt="" />
                  <h4 className="wucs_title">Experienced Co-Founders</h4>
                  <h6 className="wucs_desc">
                    The co-founders including the core team have decades of
                    experience in the property management space and thus are
                    well equipped to solve customer pain points.
                  </h6>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 op_child">
                <div className="wuc_single b_bottom">
                  <img src="./assets/img/home/why_6.png" alt="" />
                  <h4 className="wucs_title">Our Wide Network</h4>
                  <h6 className="wucs_desc">
                    Our extensive network of offline brokers and vast reach
                    across multiple online platforms will ensure that you get
                    the best clients without much delay.
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- START SECTION SERVICES --> */}
      <section
        className="section-services sect_padding relative"
        style={{
          backgroundImage: "url('./assets/img/home/service_bg.jpg')",
        }}
      >
        <div className="container">
          <div className="section_title">
            <h2 className="section_title_effect">Services</h2>
            <h3>Services offered in our PMS package</h3>
          </div>
          <div className="row oneline_parent">
            <div className="col-md-6 col-lg-4 op_child">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <span className="material-symbols-outlined">cottage</span>
                  </span>
                  <h3 className="title">Property On Boarding</h3>
                  <p className="description">
                    Once the PMS agreement is signed by the property owner,
                    propdial assigns a dedicated property manager, who collects
                    the keys and conducts a full inspection to prepare the
                    property for renting
                  </p>
                  <Link to="/about-us" className="learn-more">
                    know more
                  </Link>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 op_child">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <span className="material-symbols-outlined">manage_search</span>
                  </span>
                  <h3 className="title">Tenant Discovery</h3>
                  <p className="description">
                    Our wide network of offline brokers and extensive reach
                    across online platforms ensure we do not miss out on any
                    potential tenant.
                  </p>
                  <Link to="/about-us" className="learn-more">
                    know more
                  </Link>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 op_child">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <span className="material-symbols-outlined">handshake</span>
                  </span>
                  <h3 className="title">Tenant On Board</h3>
                  <p className="description">
                    You will never be required to visit the house. We facilitate
                    a thorough professional background check of tenants to avoid
                    any surprises. Also, all rental paperwork will be taken care
                    of by our team in India.
                  </p>
                  <Link to="/about-us" className="learn-more">
                    know more
                  </Link>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 op_child">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <span className="material-symbols-outlined">article</span>
                  </span>
                  <h3 className="title">Property Inspections</h3>
                  <p className="description">
                    We conduct a thorough property inspection at the time of
                    move-in and move-out and provide detailed reports to the
                    owner for transparency. In addition to that, we also conduct
                    issue-based and periodic property inspections and provide
                    detailed reports to the owner.
                  </p>
                  <Link to="/about-us" className="learn-more">
                    know more
                  </Link>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 op_child">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <span className="material-symbols-outlined">engineering</span>
                  </span>
                  <h3 className="title">Maintenance Services</h3>
                  <p className="description">
                    We have an in-house and partner team of plumbers,
                    carpenters, handymen, construction workers etc. to provide
                    all the maintenance services, from deep cleaning to
                    painting, on a demand basis.
                  </p>
                  <Link to="/about-us" className="learn-more">
                    know more
                  </Link>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 op_child">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <span className="material-symbols-outlined">description</span>
                  </span>
                  <h3 className="title">Personalised Dashboard</h3>
                  <p className="description">
                    Our dashboard includes an online document vault, transaction
                    history of the tenant, personal expense tracker, inspection
                    reports, and more, accessible at the click of a button.
                  </p>
                  <Link to="/about-us" className="learn-more">
                    know more
                  </Link>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- / END SECTION SERVICES --> */}
      <section className="founder_speak sect_padding relative">
        <div className="container">
          <div className="row reverse-1199">
            <div className="col-xl-8">
              <div className="fs_left">
                <div className="section_title">
                  <div className="section_title_effect">FOUNDER'S SPEAK</div>
                  <h3>Click and watch video</h3>
                </div>
                {/* <div className="image_sect">
                  <Link
                    className="img_div"
                    to="https://www.youtube.com/watch?v=RphaFtAR8pw&feature=youtu.be"
                    target="_blank"
                  >
                    <img src="./assets/img/GP-Interview-new.jpg" alt="" />
                  </Link>
                  <Link
                    className="img_div"
                    to="https://www.youtube.com/watch?v=H2bDZ4WLlyA"
                    target="_blank"
                  >
                    <img src="./assets/img/VP-Interview-new.jpg" alt="" />
                  </Link>
                </div> */}
                <div className="image_sect">
                  <iframe
                    className="img_div"
                    src="https://www.youtube.com/embed/RphaFtAR8pw"
                    title="Founder's Video 1"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                  <iframe
                    className="img_div"
                    src="https://www.youtube.com/embed/H2bDZ4WLlyA"
                    title="Founder's Video 2"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="fs_right">
                <div className="fsr_inner">
                  <div className="section_title">
                    <h3>We make your life a lot easier...</h3>
                    <h6>Understand in Just 2 min!</h6>
                  </div>
                  <iframe
                    className="img_div"
                    height="200px"
                    src="https://www.youtube.com/embed/JV-lPfuBl20"
                    title="Intro Video"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                  {/* <div className="btn_group">
                    <Link
                      to="https://www.youtube.com/watch?v=JV-lPfuBl20&t=5s"
                      target={"_blank"}
                    >
                      <button className="theme_btn btn_white">
                        Watch Video
                        <span className="material-symbols-outlined btn_arrow ba_animation">
                          arrow_forward
                        </span>
                      </button>
                    </Link>
                    <Link to="/contact-us">
                      <button className="theme_btn btn_white">
                        Get Started
                        <span className="material-symbols-outlined btn_arrow ba_animation">
                          arrow_forward
                        </span>
                      </button>
                    </Link>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Testimonial></Testimonial>

      <Blog></Blog>
    </div>
  );
};

export default Home;
