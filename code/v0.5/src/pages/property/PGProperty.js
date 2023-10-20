import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./PGProperty.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";

// component
import Banner from "../../Components/Banner";
import BottomRightFixedIcon from "../../Components/BottomRightFixedIcon";
import PropertyDetail from "../../Components/PropertyDetail";

const PGProperty = () => {
  const { documents: propertiesdocuments, error: propertieserror } =
  useCollection("properties");
      // Scroll to the top of the page whenever the location changes start
      const location = useLocation(); 
      useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);
       // Scroll to the top of the page whenever the location changes end

  return (

    <div className="pg_property aflbg">
      {/* <Banner></Banner> */}
      <BottomRightFixedIcon></BottomRightFixedIcon>
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
                  {propertiesdocuments && <PropertyDetail propertiesdocuments={propertiesdocuments}/> }                   
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
