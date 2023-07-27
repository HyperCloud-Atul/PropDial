import React from "react";
import "./SearchBar.css";
const SearchBar = () => {
  return (
    <>
     <div className="container hero-container">
        <div className="hero-heading">
            <h3>360 Degree Property <span>Management Services</span></h3>
            <div className="divider-line"></div>
        </div>
        <div className="search-options">
            <div className="search-options-child"><a className="search-options-a" href="#">BUY</a></div>
            <div className="search-options-child"><a className="search-options-a" href="#">RENT</a></div>
            <div className="search-options-child"><a className="search-options-a" href="#">SHORT-TERM RENT</a></div>
            <div className="search-options-child"><a className="search-options-a" href="#">PLOT</a></div>
            <div className="search-options-child"><a className="search-options-a" href="#">COMMERCIAL</a></div>
            <div className="search-options-child d-none d-sm-block "><a className="search-options-a" href="#">PROPERTY
                    Ad</a></div>
        </div>

        <div className="row search-section ">
            <div className="col-lg-3 col-sm-6 search-section-child"><i className="bi bi-geo-alt-fill"></i>
                <select name="budget" className="select-city budget">
                    <option value="city" className="city-options" selected>Bangalore</option>
                    <option value="city" className="city-options">Pune</option>
                    <option value="city" className="city-options">Delhi</option>
                    <option value="city" className="city-options">Mumbai</option>
                    <option value="city" className="city-options">Lucknow</option>
                    <option value="city" className="city-options">Noida</option>
                </select>
            </div>
            <div className="col-lg-3 d-none d-sm-block search-section-child">
                <i className="bi bi-house-add-fill"></i>
                <select name="budget" className="select-flat budget">
                    <option value="flat" className="flat-options" selected>Flat +1</option>
                    <option value="flat" className="flat-options">1 BHK</option>
                    <option value="flat" className="flat-options">2 BHK</option>
                    <option value="flat" className="flat-options">3 BHK</option>
                    <option value="flat" className="flat-options">4 BHK</option>
                    <option value="flat" className="flat-options">5+ BHK</option>
                </select>
            </div>

            <div className="col-lg-3 d-none d-sm-block search-section-child"><i className="bi bi-currency-rupee"></i>
                <select name="budget" className="select-budget budget">
                    <option value="sixty" className="budget-options" selected>Budget</option>
                    <option value="sixty" className="budget-options">₹60 Lac</option>
                    <option value="sixty" className="budget-options">₹70 Lac</option>
                    <option value="sixty" className="budget-options">₹80 Lac</option>
                    <option value="sixty" className="budget-options">₹90 Lac</option>
                    <option value="sixty" className="budget-options">₹1 Cr</option>
                </select>
            </div>
            <div className="col-lg-3 col-sm-6 hero-search">
                <button className="hero-search-btn"><i className="bi bi-search"></i>
                    <span>Search</span>
                </button>
            </div>
        </div>
    </div>
    </>
  );
};

export default SearchBar;