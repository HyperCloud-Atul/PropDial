import React from "react";
import "./TopCitiesInIndia.css";

const TopCitiesInIndia = () => {
  return (
    <>
      <div className="container">
        <div className="top-cities-heading">
          <h3>
            Top Cities In <span>India</span>
          </h3>
          <p>Best places to live in India</p>
          <div className="divider-line"></div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-sm-12 col-md-12 d-flex right-city-div">
            <h2>Bengaluru</h2>
          </div>

          <div className="row col-lg-8 col-sm-12 col-md-0 left-city-div">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="cities-img pune">
                <h2>Pune</h2>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="cities-img delhi">
                <h2>Delhi</h2>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="cities-img mumbai">
                <h2>Mumbai</h2>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="cities-img noida">
                <h2>Noida</h2>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="cities-img lucknow">
                <h2>Gurugram</h2>
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
    </>
  );
};
export default TopCitiesInIndia;
