import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";


// component
import Banner from "../../Components/Banner";
import TopCitiesInIndia from "../../Components/TopCitiesInIndia";
import ProductCarousel from "../../Components/ProductCarousel";
import CounterSection from "../../Components/CounterSection";
import Testimonial from "../../Components/Testimonial";
import Blog from "../../Components/Blog";


import "./Home.css";
import BottomRightFixedIcon from "../../Components/BottomRightFixedIcon";
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
      <section className="about_us sect_padding relative">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="ab_left row">
                <div className="col-sm-6">
                  <img
                    src="./assets/img/ab_left_img1.png"
                    alt=""
                    className="img_1"
                  />
                </div>
                <div className="col-sm-6">
                  <img
                    src="./assets/img/ab_left_img2.png"
                    alt=""
                    className="img_2"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ab_right">
                <div className="section_title">
                  <div class="section_title_effect">ABOUT</div>
                  <h3>A bit about us</h3>
                </div>
                <h6>
                  Property Management Systems or Hotel Operating System, under
                  business, terms may be used in real estate hospitality
                  accommodation management.
                </h6>
                <ul
                  style={{
                    listStyleType: "circle",
                  }}
                >
                  <li>
                    Lorem Ipsum is that it has a more-or-less normal
                    distribution
                  </li>
                  <li>
                    Lorem Ipsum is that it has a more-or-less normal
                    distribution
                  </li>
                  <li>
                    Lorem Ipsum is that it has a more-or-less normal
                    distribution
                  </li>
                </ul>
                <Link to="/about-us">
                <button className="more-btn-info">More About</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="house_gif">
          <img src="./assets/gif/house-animation.gif"></img>
        </div>
      </section>
      <TopCitiesInIndia />
      <section
        className="why_us sect_padding"
        style={{
          backgroundImage: "url('./assets/img/why_bg.jpg')",
        }}
      >
        <div className="container">
          <div className="section_title">
            <div class="section_title_effect">WHY US</div>
            <h3>Elevating Properties, Simplifying Management</h3>
          </div>
          <div className="why_us_cards">
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="wuc_single b_top">
                  <img src="./assets/img/why_1.png" alt="" />
                  <h4 className="wucs_title">Happy and Satisfied Customers</h4>
                  <h6 className="wucs_desc">
                    We have a very happy customer base with a high retention
                    rate of more than 80%, one of the highest across industry.
                  </h6>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="wuc_single b_bottom">
                  <img src="./assets/img/why_2.png" alt="" />
                  <h4 className="wucs_title">Competitive Pricing</h4>
                  <h6 className="wucs_desc">
                    Propdial offers one of the best pricing for this service
                    across the industry, without compromising on the quality of
                    the service offered.
                  </h6>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="wuc_single b_top">
                  <img src="./assets/img/why_3.png" alt="" />
                  <h4 className="wucs_title">Technology At Forefront</h4>
                  <h6 className="wucs_desc">
                    Propdial leverages technology to make the process of
                    property management very smooth and efficient, with minimal
                    effort required by the property owners.
                  </h6>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="wuc_single b_bottom">
                  <img src="./assets/img/why_4.png" alt="" />
                  <h4 className="wucs_title">Full Transparency</h4>
                  <h6 className="wucs_desc">
                    Every step of the property management from tenant onboarding
                    to property inspection and maintenance is documented and
                    updated online immediately. This lets you have an eye on
                    your house.
                  </h6>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="wuc_single b_top">
                  <img src="./assets/img/why_5.png" alt="" />
                  <h4 className="wucs_title">Experienced Co-Founders</h4>
                  <h6 className="wucs_desc">
                    The co-founders including the core team have decades of
                    experience in the property management space and thus are
                    well equipped to solve customer pain points.
                  </h6>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="wuc_single b_bottom">
                  <img src="./assets/img/why_6.png" alt="" />
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
          backgroundImage: "url('./assets/img/service_bg.jpg')",
        }}
      >
        <div className="container">
          <div className="section_title">
            <h2 class="section_title_effect">Services</h2>
            <h3>Services offered in our PMS package</h3>
          </div>
          <div className="row">
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <span class="material-symbols-outlined">cottage</span>
                  </span>
                  <h3 className="title">Property On Boarding</h3>
                  <p className="description">
                    Once the PMS agreement is signed by the property owner,
                    propdial assigns a dedicated property manager, who collects
                    the keys and conducts a full inspection to prepare the
                    property for renting
                  </p>
                  <a href="#" className="learn-more">
                    Know More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <span class="material-symbols-outlined">manage_search</span>
                  </span>
                  <h3 className="title">Tenant Discovery</h3>
                  <p className="description">
                    Our wide network of offline brokers and extensive reach
                    across online platforms ensure we do not miss out on any
                    potential tenant.
                  </p>
                  <a href="#" className="learn-more">
                    Know More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <span class="material-symbols-outlined">handshake</span>
                  </span>
                  <h3 className="title">Tenant On Board</h3>
                  <p className="description">
                    You will never be required to visit the house. We facilitate
                    a thorough professional background check of tenants to avoid
                    any surprises. Also, all rental paperwork will be taken care
                    of by our team in India.
                  </p>
                  <a href="#" className="learn-more">
                    Know More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <span class="material-symbols-outlined">article</span>
                  </span>
                  <h3 className="title">Property Inspections</h3>
                  <p className="description">
                    We conduct a thorough property inspection at the time of
                    move-in and move-out and provide detailed reports to the
                    owner for transparency. In addition to that, we also conduct
                    issue-based and periodic property inspections and provide
                    detailed reports to the owner.
                  </p>
                  <a href="#" className="learn-more">
                    Know More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <span class="material-symbols-outlined">engineering</span>
                  </span>
                  <h3 className="title">Maintenance Services</h3>
                  <p className="description">
                    We have an in-house and partner team of plumbers,
                    carpenters, handymen, construction workers etc. to provide
                    all the maintenance services, from deep cleaning to
                    painting, on a demand basis.
                  </p>
                  <a href="#" className="learn-more">
                    Know More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <span class="material-symbols-outlined">description</span>
                  </span>
                  <h3 className="title">Personalised Dashboard</h3>
                  <p className="description">
                    Our dashboard includes an online document vault, transaction
                    history of the tenant, personal expense tracker, inspection
                    reports, and more, accessible at the click of a button.
                  </p>
                  <a href="#" className="learn-more">
                    Know More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CounterSection></CounterSection>
      {/* <!-- / END SECTION SERVICES --> */}
      <section className="founder_speak sect_padding relative">
        <div className="container">
          <div className="row reverse-1199">
            <div className="col-xl-8">
              <div className="fs_left">
                <div className="section_title">
                  <div class="section_title_effect">FOUNDER'S SPEAK</div>
                  <h3>Click and watch video</h3>
                </div>
                <div className="image_sect">
                  <Link className="img_div" to="https://www.youtube.com/watch?v=RphaFtAR8pw&feature=youtu.be" target="_blank">
                    <img src="./assets/img/GP-Interview-new.jpg" alt="" />
                  </Link>
                  <Link className="img_div" to="https://www.youtube.com/watch?v=H2bDZ4WLlyA" target="_blank">
                    <img src="./assets/img/VP-Interview-new.jpg" alt="" />
                  </Link>
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
                <div className="btn_group">
                  <Link to="https://www.youtube.com/watch?v=JV-lPfuBl20&t=5s" target={"_blank"}>
                  <button className="more-btn-info">Watch Video</button>
                  </Link>
                  <Link to="/contact-us">
                  <button className="more-btn-info">Get Started</button>
                  </Link>
                </div>
              </div>
         </div>
            </div>
          </div>
        </div>
      </section>
      <Testimonial></Testimonial>
      {/* <section
        className="perfect_layout sect_padding"
        style={{
          backgroundImage: "url('./assets/img/appartment_bg.jpg')",
        }}
      >
        <div className="container">
          <div className="section_title">
            <div class="section_title_effect">APARTMENT</div>
            <h3>The Perfect Layouts of your dream house</h3>
          </div>
          <div className="tabs">
            <Tabs>
              <TabList>
                <Tab className="pointer">STUDIO APARTMENT</Tab>
                <Tab className="pointer">PENTHOUSES</Tab>
                <Tab className="pointer">3 BEDROOMS</Tab>
                <Tab className="pointer">2 BEDROOMS</Tab>
                <Tab className="pointer">1 BEDROOM</Tab>
              </TabList>

              <TabPanel>
                <div className="row reverse">
                  <div className="col-lg-6">
                    <p>
                      The landscape infrastructures of streets are arranged in
                      with the common amenities for residents greatest ultural
                      institutions, its most fashionable stores, and its finest
                      restaurants idents great. The landscape infrastructures of
                      streets are arranged in with the common amenities for
                      residents greatest ultural institutions, its most
                      fashionable stores, and its finest restaurants idents
                      great.
                    </p>
                    <p className="mt-2">
                      The landscape infrastructures of streets are arranged in
                      with the common amenities for residents greatest ultural
                      institutions, its most fashionable stores, and its finest
                      restaurants idents great.
                    </p>
                    <ol>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                    </ol>
                  </div>
                  <div className="col-lg-6">
                    <div className="map_img">
                      <img
                        src="./assets/img/tap_img_1.png"
                        alt=""
                        style={{
                          width: "100%",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="row">
                  <div className="col-md-6">
                    <img
                      src="./assets/img/tap_img_1.png"
                      alt=""
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <p>
                      The landscape infrastructures of streets are arranged in
                      with the common amenities for residents greatest ultural
                      institutions, its most fashionable stores, and its finest
                      restaurants idents great. The landscape infrastructures of
                      streets are arranged in with the common amenities for
                      residents greatest ultural institutions, its most
                      fashionable stores, and its finest restaurants idents
                      great.
                    </p>
                    <p className="mt-2">
                      The landscape infrastructures of streets are arranged in
                      with the common amenities for residents greatest ultural
                      institutions, its most fashionable stores, and its finest
                      restaurants idents great.
                    </p>
                    <ol>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                    </ol>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="row reverse">
                  <div className="col-md-6">
                    <p>
                      The landscape infrastructures of streets are arranged in
                      with the common amenities for residents greatest ultural
                      institutions, its most fashionable stores, and its finest
                      restaurants idents great. The landscape infrastructures of
                      streets are arranged in with the common amenities for
                      residents greatest ultural institutions, its most
                      fashionable stores, and its finest restaurants idents
                      great.
                    </p>
                    <p className="mt-2">
                      The landscape infrastructures of streets are arranged in
                      with the common amenities for residents greatest ultural
                      institutions, its most fashionable stores, and its finest
                      restaurants idents great.
                    </p>
                    <ol>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                    </ol>
                  </div>
                  <div className="col-md-6">
                    <img
                      src="./assets/img/tap_img_1.png"
                      alt=""
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="row">
                  <div className="col-md-6">
                    <img
                      src="./assets/img/tap_img_1.png"
                      alt=""
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <p>
                      The landscape infrastructures of streets are arranged in
                      with the common amenities for residents greatest ultural
                      institutions, its most fashionable stores, and its finest
                      restaurants idents great. The landscape infrastructures of
                      streets are arranged in with the common amenities for
                      residents greatest ultural institutions, its most
                      fashionable stores, and its finest restaurants idents
                      great.
                    </p>
                    <p className="mt-2">
                      The landscape infrastructures of streets are arranged in
                      with the common amenities for residents greatest ultural
                      institutions, its most fashionable stores, and its finest
                      restaurants idents great.
                    </p>
                    <ol>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                    </ol>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="row reverse">
                  <div className="col-md-6">
                    <p>
                      The landscape infrastructures of streets are arranged in
                      with the common amenities for residents greatest ultural
                      institutions, its most fashionable stores, and its finest
                      restaurants idents great. The landscape infrastructures of
                      streets are arranged in with the common amenities for
                      residents greatest ultural institutions, its most
                      fashionable stores, and its finest restaurants idents
                      great.
                    </p>
                    <p className="mt-2">
                      The landscape infrastructures of streets are arranged in
                      with the common amenities for residents greatest ultural
                      institutions, its most fashionable stores, and its finest
                      restaurants idents great.
                    </p>
                    <ol>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                      <li>Lorem Ipsum</li>
                    </ol>
                  </div>
                  <div className="col-md-6">
                    <img
                      src="./assets/img/tap_img_1.png"
                      alt=""
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </section> */}
      <Blog></Blog>     
      {/* <CollapsibleGroup /> */}
      
    </div>
  );
};

export default Home;
