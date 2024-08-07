import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./PGSearchProperty.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import Switch from "react-switch";
import { Navigate, Link } from "react-router-dom";
// component
import Banner from "../../components/Banner";
import BottomRightFixedIcon from "../../components/BottomRightFixedIcon";
import PropertyDetail from "../../components/property/SearchProperty";

const PGSearchProperty = () => {
  const { documents: propertiesdocuments, error: propertieserror } =
    useCollection("properties");
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  // switch 
  const [checked, setChecked] = useState(false);
  const handleChange = (checked) => {
    setChecked(checked);
  };
  // switch

  // rent and buy acitve 
  const [activeOption, setActiveOption] = useState('Buy');
  const handleOptionClick = (option) => {
    setActiveOption(option);
  };
  // rent and buy acitve 

  return (

    <div className="pg_property aflbg">
      {/* <Banner></Banner> */}
      <BottomRightFixedIcon></BottomRightFixedIcon>
      <div className="top_search_bar">
        <div className="search_area_header">
          <div className="for_buy_rent">
            <div
              className={`pointer ${activeOption === 'Buy' ? 'active' : ''}`}
              onClick={() => handleOptionClick('Buy')}
            >
              Buy
            </div>
            <div
              className={`pointer ${activeOption === 'Rent' ? 'active' : ''}`}
              onClick={() => handleOptionClick('Rent')}
            >
              Rent
            </div>
          </div>
          <div className="residentail_commercial">
            <label className={checked ? "on" : "off"}>
              <div className="switch">
                <span className={`Residential ${checked ? "off" : "on"}`} >
                  Residential
                </span>
                <Switch
                  onChange={handleChange}
                  checked={checked}
                  handleDiameter={20} // Set the handle diameter (optional)
                  uncheckedIcon={false} // Hide the wrong/right icon
                  checkedIcon={false} // Hide the wrong/right icon
                  className="pointer"
                />
                <span className={`Commercial ${checked ? "on" : "off"}`}
                >
                  Commercial
                </span>
              </div>
            </label>
          </div>
        </div>
        <div className="search_area_body">
          <div className="search_by">
            <div className="search_by_single">
              <select name="" id="" className="pointer">
                <option value="" selected>Select State</option>
                <option value="">Madhya Pradesh</option>
                <option value="">Maharastra</option>
                <option value="">Uttar Pradesh</option>
                <option value="">Arunachal Pradesh</option>
              </select>
            </div>
            <div className="search_by_single">
              <select name="" id="" className="pointer">
                <option value="" selected>Select City</option>
                <option value="">Ujjain</option>
                <option value="">Pune</option>
                <option value="">Indore</option>
                <option value="">Bhopal</option>
              </select>
            </div>
            <div className="search_by_single">
              <select name="" id="" className="pointer">
                <option value="" selected>Select BHK</option>
                <option value=""> 1 BHK</option>
                <option value="">2 BHK</option>
                <option value=""> 3 BHK</option>
              </select>
            </div>
          </div>
          <div className="search_property pointer">
            <Link to="/search-property">
              <button className="theme_btn btn_fill">
                Search
                <span className="material-symbols-outlined btn_arrow ba_animation">
                  arrow_forward
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
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
                    {propertiesdocuments && <PropertyDetail propertiesdocuments={propertiesdocuments} />}
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

export default PGSearchProperty;
