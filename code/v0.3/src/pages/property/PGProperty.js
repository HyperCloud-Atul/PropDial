import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./PGProperty.css";

// component
import Banner from "../../Components/Banner";

const PGProperty = () => {
  // read more read less
  const [height, setHeight] = useState(true);

  const handleHeight = () => {
    setHeight(!height);
  };
  // read more read less
  return (
    <div className="pg_property">
      {/* <Banner></Banner> */}
      <div className="top_search_bar"></div>
      <Tabs>
        <div className="container-fluid"></div>

        <section className="property_cards">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-9">
                <TabList className="tabs">  
                  <Tab className="pointer">Properties (3,212)</Tab>
                  <Tab className="pointer">New Projects</Tab>
                  <Tab className="pointer">Top Agents</Tab>
                </TabList>
                <TabPanel>
                  <div className="property_card_left">
                    <div className="property_card_single">
                      <div className="pcs_inner">
                        <div className="pcs_image_area">
                          <img src="./assets/img/property/p1.jpg"></img>
                        </div>
                        <div className="pcs_main_detail">
                          <div className="pmd_top">
                            <h4 className="property_name">
                              Plot/Land for Sale in Vistara Township, Indore
                              Bypass Road
                            </h4>
                            <h6 className="property_location">
                              Indore Madhya Pradesh
                            </h6>
                          </div>
                          <div className="pmd_body">
                            <div className="property_information">
                              <div className="pi_single">
                                <h6>Carpet area</h6>
                                <h5>8500 sqft</h5>
                              </div>
                              <div className="pi_single">
                                <h6>STATUS</h6>
                                <h5>Ready to Move</h5>
                              </div>
                              <div className="pi_single">
                                <h6>TRANSACTION</h6>
                                <h5>New Property</h5>
                              </div>
                              <div className="pi_single">
                                <h6>FURNISHING</h6>
                                <h5>Unfurnished</h5>
                              </div>
                              <div className="pi_single">
                                <h6>Society</h6>
                                <h5>Indore</h5>
                              </div>
                              <div className="pi_single">
                                <h6>BHK</h6>
                                <h5>2</h5>
                              </div>
                            </div>
                          </div>
                          <div className="pmd_bottom">
                            <p
                              className={`pshortdetail ${
                                height ? "" : "readmore"
                              }`}
                            >
                              Grandeur is Kalpataru's first offering to the city
                              of Indore. This landmark address stands a class
                              apart with its iconic design and exquisite
                              execution. With world renowned consultants
                              appointed for the design, landscaping, RCC and
                              more, Kalpataru Grandeur synergizes international
                              design elements with regional taste, and
                              represents Kalpataru's strong legacy as a provider
                              of high-end luxury living spaces.
                            </p>
                            <div
                              onClick={handleHeight}
                              className="readml pointer"
                            >
                              {height ? "Read More" : "Read Less"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pcs_other_info">
                        <div className="poi_inner">
                          <h6 className="property_value">
                            <span>₹ </span> 2 cr
                          </h6>
                          <h6 className="value_per_sqf">
                            <span>₹ </span> 9000 per sqf
                          </h6>
                          <button className="theme_btn btn_fill">
                            Contact Agent
                          </button>
                          <button className="theme_btn btn_border">
                            Enquire Now
                          </button>
                          <h5 className="link">Check Loan Eligibility</h5>
                        </div>
                      </div>
                    </div>
                    <div className="property_card_single">
                      <div className="pcs_inner">
                        <div className="pcs_image_area">
                          <img src="./assets/img/property/p1.jpg"></img>
                        </div>
                        <div className="pcs_main_detail">
                          <div className="pmd_top">
                            <h4 className="property_name">
                              Plot/Land for Sale in Vistara Township, Indore
                              Bypass Road
                            </h4>
                            <h6 className="property_location">
                              Indore Madhya Pradesh
                            </h6>
                          </div>
                          <div className="pmd_body">
                            <div className="property_information">
                              <div className="pi_single">
                                <h6>Carpet area</h6>
                                <h5>8500 sqft</h5>
                              </div>
                              <div className="pi_single">
                                <h6>STATUS</h6>
                                <h5>Ready to Move</h5>
                              </div>
                              <div className="pi_single">
                                <h6>TRANSACTION</h6>
                                <h5>New Property</h5>
                              </div>
                              <div className="pi_single">
                                <h6>FURNISHING</h6>
                                <h5>Unfurnished</h5>
                              </div>
                              <div className="pi_single">
                                <h6>Society</h6>
                                <h5>Indore</h5>
                              </div>
                              <div className="pi_single">
                                <h6>BHK</h6>
                                <h5>2</h5>
                              </div>
                            </div>
                          </div>
                          <div className="pmd_bottom">
                            <p
                              className={`pshortdetail ${
                                height ? "" : "readmore"
                              }`}
                            >
                              Grandeur is Kalpataru's first offering to the city
                              of Indore. This landmark address stands a class
                              apart with its iconic design and exquisite
                              execution. With world renowned consultants
                              appointed for the design, landscaping, RCC and
                              more, Kalpataru Grandeur synergizes international
                              design elements with regional taste, and
                              represents Kalpataru's strong legacy as a provider
                              of high-end luxury living spaces.
                            </p>
                            <div
                              onClick={handleHeight}
                              className="readml pointer"
                            >
                              {height ? "Read More" : "Read Less"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pcs_other_info">
                        <div className="poi_inner">
                          <h6 className="property_value">
                            <span>₹ </span> 2 cr
                          </h6>
                          <h6 className="value_per_sqf">
                            <span>₹ </span> 9000 per sqf
                          </h6>
                          <button className="theme_btn btn_fill">
                            Contact Agent
                          </button>
                          <button className="theme_btn btn_border">
                            Enquire Now
                          </button>
                          <h5 className="link">Check Loan Eligibility</h5>
                        </div>
                      </div>
                    </div>
                    <div className="property_card_single">
                      <div className="pcs_inner">
                        <div className="pcs_image_area">
                          <img src="./assets/img/property/p1.jpg"></img>
                        </div>
                        <div className="pcs_main_detail">
                          <div className="pmd_top">
                            <h4 className="property_name">
                              Plot/Land for Sale in Vistara Township, Indore
                              Bypass Road
                            </h4>
                            <h6 className="property_location">
                              Indore Madhya Pradesh
                            </h6>
                          </div>
                          <div className="pmd_body">
                            <div className="property_information">
                              <div className="pi_single">
                                <h6>Carpet area</h6>
                                <h5>8500 sqft</h5>
                              </div>
                              <div className="pi_single">
                                <h6>STATUS</h6>
                                <h5>Ready to Move</h5>
                              </div>
                              <div className="pi_single">
                                <h6>TRANSACTION</h6>
                                <h5>New Property</h5>
                              </div>
                              <div className="pi_single">
                                <h6>FURNISHING</h6>
                                <h5>Unfurnished</h5>
                              </div>
                              <div className="pi_single">
                                <h6>Society</h6>
                                <h5>Indore</h5>
                              </div>
                              <div className="pi_single">
                                <h6>BHK</h6>
                                <h5>2</h5>
                              </div>
                            </div>
                          </div>
                          <div className="pmd_bottom">
                            <p
                              className={`pshortdetail ${
                                height ? "" : "readmore"
                              }`}
                            >
                              Grandeur is Kalpataru's first offering to the city
                              of Indore. This landmark address stands a class
                              apart with its iconic design and exquisite
                              execution. With world renowned consultants
                              appointed for the design, landscaping, RCC and
                              more, Kalpataru Grandeur synergizes international
                              design elements with regional taste, and
                              represents Kalpataru's strong legacy as a provider
                              of high-end luxury living spaces.
                            </p>
                            <div
                              onClick={handleHeight}
                              className="readml pointer"
                            >
                              {height ? "Read More" : "Read Less"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pcs_other_info">
                        <div className="poi_inner">
                          <h6 className="property_value">
                            <span>₹ </span> 2 cr
                          </h6>
                          <h6 className="value_per_sqf">
                            <span>₹ </span> 9000 per sqf
                          </h6>
                          <button className="theme_btn btn_fill">
                            Contact Agent
                          </button>
                          <button className="theme_btn btn_border">
                            Enquire Now
                          </button>
                          <h5 className="link">Check Loan Eligibility</h5>
                        </div>
                      </div>
                    </div>
                    <div className="property_card_single">
                      <div className="pcs_inner">
                        <div className="pcs_image_area">
                          <img src="./assets/img/property/p1.jpg"></img>
                        </div>
                        <div className="pcs_main_detail">
                          <div className="pmd_top">
                            <h4 className="property_name">
                              Plot/Land for Sale in Vistara Township, Indore
                              Bypass Road
                            </h4>
                            <h6 className="property_location">
                              Indore Madhya Pradesh
                            </h6>
                          </div>
                          <div className="pmd_body">
                            <div className="property_information">
                              <div className="pi_single">
                                <h6>Carpet area</h6>
                                <h5>8500 sqft</h5>
                              </div>
                              <div className="pi_single">
                                <h6>STATUS</h6>
                                <h5>Ready to Move</h5>
                              </div>
                              <div className="pi_single">
                                <h6>TRANSACTION</h6>
                                <h5>New Property</h5>
                              </div>
                              <div className="pi_single">
                                <h6>FURNISHING</h6>
                                <h5>Unfurnished</h5>
                              </div>
                              <div className="pi_single">
                                <h6>Society</h6>
                                <h5>Indore</h5>
                              </div>
                              <div className="pi_single">
                                <h6>BHK</h6>
                                <h5>2</h5>
                              </div>
                            </div>
                          </div>
                          <div className="pmd_bottom">
                            <p
                              className={`pshortdetail ${
                                height ? "" : "readmore"
                              }`}
                            >
                              Grandeur is Kalpataru's first offering to the city
                              of Indore. This landmark address stands a class
                              apart with its iconic design and exquisite
                              execution. With world renowned consultants
                              appointed for the design, landscaping, RCC and
                              more, Kalpataru Grandeur synergizes international
                              design elements with regional taste, and
                              represents Kalpataru's strong legacy as a provider
                              of high-end luxury living spaces.
                            </p>
                            <div
                              onClick={handleHeight}
                              className="readml pointer"
                            >
                              {height ? "Read More" : "Read Less"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pcs_other_info">
                        <div className="poi_inner">
                          <h6 className="property_value">
                            <span>₹ </span> 2 cr
                          </h6>
                          <h6 className="value_per_sqf">
                            <span>₹ </span> 9000 per sqf
                          </h6>
                          <button className="theme_btn btn_fill">
                            Contact Agent
                          </button>
                          <button className="theme_btn btn_border">
                            Enquire Now
                          </button>
                          <h5 className="link">Check Loan Eligibility</h5>
                        </div>
                      </div>
                    </div>
                    <div className="property_card_single">
                      <div className="pcs_inner">
                        <div className="pcs_image_area">
                          <img src="./assets/img/property/p1.jpg"></img>
                        </div>
                        <div className="pcs_main_detail">
                          <div className="pmd_top">
                            <h4 className="property_name">
                              Plot/Land for Sale in Vistara Township, Indore
                              Bypass Road
                            </h4>
                            <h6 className="property_location">
                              Indore Madhya Pradesh
                            </h6>
                          </div>
                          <div className="pmd_body">
                            <div className="property_information">
                              <div className="pi_single">
                                <h6>Carpet area</h6>
                                <h5>8500 sqft</h5>
                              </div>
                              <div className="pi_single">
                                <h6>STATUS</h6>
                                <h5>Ready to Move</h5>
                              </div>
                              <div className="pi_single">
                                <h6>TRANSACTION</h6>
                                <h5>New Property</h5>
                              </div>
                              <div className="pi_single">
                                <h6>FURNISHING</h6>
                                <h5>Unfurnished</h5>
                              </div>
                              <div className="pi_single">
                                <h6>Society</h6>
                                <h5>Indore</h5>
                              </div>
                              <div className="pi_single">
                                <h6>BHK</h6>
                                <h5>2</h5>
                              </div>
                            </div>
                          </div>
                          <div className="pmd_bottom">
                            <p
                              className={`pshortdetail ${
                                height ? "" : "readmore"
                              }`}
                            >
                              Grandeur is Kalpataru's first offering to the city
                              of Indore. This landmark address stands a class
                              apart with its iconic design and exquisite
                              execution. With world renowned consultants
                              appointed for the design, landscaping, RCC and
                              more, Kalpataru Grandeur synergizes international
                              design elements with regional taste, and
                              represents Kalpataru's strong legacy as a provider
                              of high-end luxury living spaces.
                            </p>
                            <div
                              onClick={handleHeight}
                              className="readml pointer"
                            >
                              {height ? "Read More" : "Read Less"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pcs_other_info">
                        <div className="poi_inner">
                          <h6 className="property_value">
                            <span>₹ </span> 2 cr
                          </h6>
                          <h6 className="value_per_sqf">
                            <span>₹ </span> 9000 per sqf
                          </h6>
                          <button className="theme_btn btn_fill">
                            Contact Agent
                          </button>
                          <button className="theme_btn btn_border">
                            Enquire Now
                          </button>
                          <h5 className="link">Check Loan Eligibility</h5>
                        </div>
                      </div>
                    </div>
                    <div className="property_card_single">
                      <div className="pcs_inner">
                        <div className="pcs_image_area">
                          <img src="./assets/img/property/p1.jpg"></img>
                        </div>
                        <div className="pcs_main_detail">
                          <div className="pmd_top">
                            <h4 className="property_name">
                              Plot/Land for Sale in Vistara Township, Indore
                              Bypass Road
                            </h4>
                            <h6 className="property_location">
                              Indore Madhya Pradesh
                            </h6>
                          </div>
                          <div className="pmd_body">
                            <div className="property_information">
                              <div className="pi_single">
                                <h6>Carpet area</h6>
                                <h5>8500 sqft</h5>
                              </div>
                              <div className="pi_single">
                                <h6>STATUS</h6>
                                <h5>Ready to Move</h5>
                              </div>
                              <div className="pi_single">
                                <h6>TRANSACTION</h6>
                                <h5>New Property</h5>
                              </div>
                              <div className="pi_single">
                                <h6>FURNISHING</h6>
                                <h5>Unfurnished</h5>
                              </div>
                              <div className="pi_single">
                                <h6>Society</h6>
                                <h5>Indore</h5>
                              </div>
                              <div className="pi_single">
                                <h6>BHK</h6>
                                <h5>2</h5>
                              </div>
                            </div>
                          </div>
                          <div className="pmd_bottom">
                            <p
                              className={`pshortdetail ${
                                height ? "" : "readmore"
                              }`}
                            >
                              Grandeur is Kalpataru's first offering to the city
                              of Indore. This landmark address stands a class
                              apart with its iconic design and exquisite
                              execution. With world renowned consultants
                              appointed for the design, landscaping, RCC and
                              more, Kalpataru Grandeur synergizes international
                              design elements with regional taste, and
                              represents Kalpataru's strong legacy as a provider
                              of high-end luxury living spaces.
                            </p>
                            <div
                              onClick={handleHeight}
                              className="readml pointer"
                            >
                              {height ? "Read More" : "Read Less"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pcs_other_info">
                        <div className="poi_inner">
                          <h6 className="property_value">
                            <span>₹ </span> 2 cr
                          </h6>
                          <h6 className="value_per_sqf">
                            <span>₹ </span> 9000 per sqf
                          </h6>
                          <button className="theme_btn btn_fill">
                            Contact Agent
                          </button>
                          <button className="theme_btn btn_border">
                            Enquire Now
                          </button>
                          <h5 className="link">Check Loan Eligibility</h5>
                        </div>
                      </div>
                    </div>
                    <div className="property_card_single">
                      <div className="pcs_inner">
                        <div className="pcs_image_area">
                          <img src="./assets/img/property/p1.jpg"></img>
                        </div>
                        <div className="pcs_main_detail">
                          <div className="pmd_top">
                            <h4 className="property_name">
                              Plot/Land for Sale in Vistara Township, Indore
                              Bypass Road
                            </h4>
                            <h6 className="property_location">
                              Indore Madhya Pradesh
                            </h6>
                          </div>
                          <div className="pmd_body">
                            <div className="property_information">
                              <div className="pi_single">
                                <h6>Carpet area</h6>
                                <h5>8500 sqft</h5>
                              </div>
                              <div className="pi_single">
                                <h6>STATUS</h6>
                                <h5>Ready to Move</h5>
                              </div>
                              <div className="pi_single">
                                <h6>TRANSACTION</h6>
                                <h5>New Property</h5>
                              </div>
                              <div className="pi_single">
                                <h6>FURNISHING</h6>
                                <h5>Unfurnished</h5>
                              </div>
                              <div className="pi_single">
                                <h6>Society</h6>
                                <h5>Indore</h5>
                              </div>
                              <div className="pi_single">
                                <h6>BHK</h6>
                                <h5>2</h5>
                              </div>
                            </div>
                          </div>
                          <div className="pmd_bottom">
                            <p
                              className={`pshortdetail ${
                                height ? "" : "readmore"
                              }`}
                            >
                              Grandeur is Kalpataru's first offering to the city
                              of Indore. This landmark address stands a class
                              apart with its iconic design and exquisite
                              execution. With world renowned consultants
                              appointed for the design, landscaping, RCC and
                              more, Kalpataru Grandeur synergizes international
                              design elements with regional taste, and
                              represents Kalpataru's strong legacy as a provider
                              of high-end luxury living spaces.
                            </p>
                            <div
                              onClick={handleHeight}
                              className="readml pointer"
                            >
                              {height ? "Read More" : "Read Less"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pcs_other_info">
                        <div className="poi_inner">
                          <h6 className="property_value">
                            <span>₹ </span> 2 cr
                          </h6>
                          <h6 className="value_per_sqf">
                            <span>₹ </span> 9000 per sqf
                          </h6>
                          <button className="theme_btn btn_fill">
                            Contact Agent
                          </button>
                          <button className="theme_btn btn_border">
                            Enquire Now
                          </button>
                          <h5 className="link">Check Loan Eligibility</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  No Data Found
                </TabPanel>
                <TabPanel>
                  No Data Found
                </TabPanel>
              </div>

              <div className="col-xl-3">
                <div className="pp_sidebar">
                  <div className="pp_sidebar_cards">
                    <div className="pp_sidebarcard_single">
                      <div className="ppss_img">
                        <img src="./assets/img/property/p2.jpg" alt="" />
                      </div>
                      <div className="ppss_header">
                        <h5>Brij Residency Phase 2</h5>
                        <h6>GRV Constructions</h6>
                        <h6 className="location">MR 11, Indore</h6>
                      </div>
                      <div className="ppss_footer">
                        <h6>1, 3 BHK Flats</h6>
                        <h6>
                          <span>₹ 22.2 Lac</span> onwards
                        </h6>
                        <h6>Marketed by D2R</h6>
                      </div>
                    </div>
                    <div className="pp_sidebarcard_single">
                      <div className="ppss_img">
                        <img src="./assets/img/property/p2.jpg" alt="" />
                      </div>
                      <div className="ppss_header">
                        <h5>Brij Residency Phase 2</h5>
                        <h6>GRV Constructions</h6>
                        <h6 className="location">MR 11, Indore</h6>
                      </div>
                      <div className="ppss_footer">
                        <h6>1, 3 BHK Flats</h6>
                        <h6>
                          <span>₹ 22.2 Lac</span> onwards
                        </h6>
                        <h6>Marketed by D2R</h6>
                      </div>
                    </div>
                    <div className="pp_sidebarcard_single">
                      <div className="ppss_img">
                        <img src="./assets/img/property/p2.jpg" alt="" />
                      </div>
                      <div className="ppss_header">
                        <h5>Brij Residency Phase 2</h5>
                        <h6>GRV Constructions</h6>
                        <h6 className="location">MR 11, Indore</h6>
                      </div>
                      <div className="ppss_footer">
                        <h6>1, 3 BHK Flats</h6>
                        <h6>
                          <span>₹ 22.2 Lac</span> onwards
                        </h6>
                        <h6>Marketed by D2R</h6>
                      </div>
                    </div>
                    <div className="pp_sidebarcard_single">
                      <div className="ppss_img">
                        <img src="./assets/img/property/p2.jpg" alt="" />
                      </div>
                      <div className="ppss_header">
                        <h5>Brij Residency Phase 2</h5>
                        <h6>GRV Constructions</h6>
                        <h6 className="location">MR 11, Indore</h6>
                      </div>
                      <div className="ppss_footer">
                        <h6>1, 3 BHK Flats</h6>
                        <h6>
                          <span>₹ 22.2 Lac</span> onwards
                        </h6>
                        <h6>Marketed by D2R</h6>
                      </div>
                    </div>
                    <div className="pp_sidebarcard_single">
                      <div className="ppss_img">
                        <img src="./assets/img/property/p2.jpg" alt="" />
                      </div>
                      <div className="ppss_header">
                        <h5>Brij Residency Phase 2</h5>
                        <h6>GRV Constructions</h6>
                        <h6 className="location">MR 11, Indore</h6>
                      </div>
                      <div className="ppss_footer">
                        <h6>1, 3 BHK Flats</h6>
                        <h6>
                          <span>₹ 22.2 Lac</span> onwards
                        </h6>
                        <h6>Marketed by D2R</h6>
                      </div>
                    </div>
                    <div className="pp_sidebarcard_single">
                      <div className="ppss_img">
                        <img src="./assets/img/property/p2.jpg" alt="" />
                      </div>
                      <div className="ppss_header">
                        <h5>Brij Residency Phase 2</h5>
                        <h6>GRV Constructions</h6>
                        <h6 className="location">MR 11, Indore</h6>
                      </div>
                      <div className="ppss_footer">
                        <h6>1, 3 BHK Flats</h6>
                        <h6>
                          <span>₹ 22.2 Lac</span> onwards
                        </h6>
                        <h6>Marketed by D2R</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Tabs>
    </div>
  );
};

export default PGProperty;
