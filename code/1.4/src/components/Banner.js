import React, { useState } from "react";
import AutoTypingEffect from "./AutoTypingEffect";
import "./Banner.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import Switch from "react-switch";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Navigate, Link } from "react-router-dom";

function Banner() {

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
    <div className="home_banner">
      <div className="swipercomp">
        <div className="swipercomp_inner relative">
          <Carousel>
            <Carousel.Item>
              <div className="ad_container">
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fhomebanner2.webp?alt=media&token=93f3b3d7-23b3-4027-90b9-73275ff37278" alt="propdial" />
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="ad_container">
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fhomebanner3.webp?alt=media&token=47b43718-dc60-4c28-aba4-70e1cac334b3" alt="propdial" />
              </div>
            </Carousel.Item>
          </Carousel>
          <div className="banner_content">
            <div className="bc_inner">
              <div className="container">
                <h1 className="typing_effect">
                  <span>Find Your Best House</span>
                  <AutoTypingEffect className="auto_typing_text"></AutoTypingEffect>
                </h1>
                <h6>Discover Your Perfect Property Among Our Million Options</h6>

                {/* <div className="search_area">
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
                </div> */}
                <br></br>
                <div className="search_property pointer">
                  <Link to="/properties">
                    <button className="theme_btn btn_fill no_icon">
                      Search Properties
                      <span className="material-symbols-outlined btn_arrow ba_animation">
                        arrow_forward
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
