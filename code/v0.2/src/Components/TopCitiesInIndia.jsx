import React from "react";
import "./TopCitiesInIndia.css";

const TopCitiesInIndia = () => {
  return (
    <>
      <div className="top_cities_parent">
        <div className="top-cities-heading">
          <h3>
            Top Cities In <span>India</span>
          </h3>
          <p>Best places to live in India</p>
          <div className="divider-line"></div>
        </div>
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-4 col-sm-12 col-md-12 d-flex justify-content-center align-items-center right-city-div">
              <h2>Bengaluru</h2>
            </div>

            <div className="row col-lg-8 col-sm-12 col-md-0 left-city-div">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="cities-img pune d-flex justify-content-center align-items-center">
                  <h2>Pune</h2>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="cities-img delhi d-flex justify-content-center align-items-center">
                  <h2>Delhi</h2>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="cities-img mumbai d-flex justify-content-center align-items-center">
                  <h2>Mumbai</h2>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="cities-img noida d-flex justify-content-center align-items-center">
                  <h2>Noida</h2>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="cities-img lucknow d-flex justify-content-center align-items-center ">
                  <h2>Lucknow</h2>
                </div>
              </div>
            </div>
          </div>
          <div class="more-btn-div">
            <button type="button" class="more-btn-info">
              More
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default TopCitiesInIndia;
