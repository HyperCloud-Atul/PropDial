import React from 'react'
import { Link } from "react-router-dom";
import { useState } from "react";

// component
import LeftSidebar from '../../Components/LeftSidebar';

const PGSearch = () => {
      // switch
  const [toggleFlag, setToggleFlag] = useState(false);
  const [propertyList, setPropertyList] = useState("residential"); //Residential/Commercial
  const toggleBtnClick = () => {
    if (toggleFlag) setPropertyList("residential");
    else setPropertyList("commercial");

    setToggleFlag(!toggleFlag);
  };
  // switch

  //   add class when click on advance search
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false); // State to track advanced search
  const toggleAdvancedSearch = () => {
    setIsAdvancedSearch(!isAdvancedSearch);
  };
  //   add class when click on advance search
  return (
    <div className="pgadmindasboard pgls_mobile aflbg">
    <div className="dashboard_pg pg_width">
      <div className="sidebarwidth">
        <LeftSidebar />
      </div>
      <div className="right_main_content">
        <br />
        <h2 className="pg_title">Search</h2>
        <hr />
        <div
          className={`search_card${
            isAdvancedSearch ? " advanced_search" : ""
          }`}
          style={{
            margin: "10px 0px ",
            background: "white",
            padding: "15px 10px",
          }}
        >
          <div className="expand_btn" onClick={toggleAdvancedSearch}>
            <span>Advance search</span>
            <span class="material-symbols-outlined expand_more">
              expand_more
            </span>
            <span class="material-symbols-outlined expand_less">
              expand_less
            </span>
          </div>
          <div className="sc_first_row">
            <div
              className="d-flex frs_single"
              style={{
                alignItems: "center",
              }}
            >
              <div
                className="residential-commercial-switch"
                style={{ top: "0" }}
              >
                <span
                  className={toggleFlag ? "" : "active"}
                  style={{ color: "var(--theme-blue)" }}
                >
                  Residential
                </span>
                <div
                  className={
                    toggleFlag
                      ? "toggle-switch on commercial"
                      : "toggle-switch off residential"
                  }
                  style={{ padding: "0 10px" }}
                >
                  {/* <small>{toggleFlag ? 'On' : 'Off'}</small> */}
                  <div onClick={toggleBtnClick}>
                    <div></div>
                  </div>
                </div>
                <span
                  className={toggleFlag ? "active" : ""}
                  style={{ color: "var(--theme-orange)" }}
                >
                  Commercial
                </span>
              </div>
            </div>
            <div class="form_field st-2 mt-lg-0 frs_single">
              {/* <label>Unit Number</label> */}
              <div class="field_inner">
                <input type="text" placeholder="Search here" />
                <div class="field_icon">
                  <span class="material-symbols-outlined">manage_search</span>
                </div>
              </div>
            </div>
            <div className="form_field st-2 mt-lg-0 frs_single">
              {/* <label>Purpose</label> */}
              <div className="field_inner select">
                <select>
                  <option selected disabled>
                    2022
                  </option>
                  <option>2021</option>
                  <option>2020</option>
                  <option>2019</option>
                </select>
                <div className="field_icon">
                  <span class="material-symbols-outlined">
                    hourglass_bottom
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="sc_second_row">              
            <div className="form_field st-2 trs_single">
              <div className="field_inner select">
                <select>
                  <option selected disabled>
                    Country
                  </option>
                  <option>India</option>
                  <option>Denmark</option>
                  <option>Malasia</option>
                  <option>China</option>
                </select>
                <div className="field_icon">
                  <span class="material-symbols-outlined">
                    hourglass_bottom
                  </span>
                </div>
              </div>
            </div>
            <div className="form_field st-2 trs_single">
              <div className="field_inner select">
                <select>
                  <option selected disabled>
                    State
                  </option>
                  <option>Delhi</option>
                  <option>Haryana</option>
                  <option>Madhya Pradesh</option>              
                </select>
                <div className="field_icon">
                  <span class="material-symbols-outlined">
                    hourglass_bottom
                  </span>
                </div>
              </div>
            </div>
            <div className="form_field st-2 trs_single">
              <div className="field_inner select">
                <select>
                  <option selected disabled>
                 City
                  </option>
                  <option>Mumbai</option>
                  <option>Pune</option>
                  <option>Orangabad</option>                  
                </select>
                <div className="field_icon">
                  <span class="material-symbols-outlined">
                    hourglass_bottom
                  </span>
                </div>
              </div>
            </div>
            <div
              className="d-flex trs_single form_field st-2 "
              style={{
                alignItems: "center",
              }}
            >
              <div
                className="residential-commercial-switch"
                style={{ top: "0" }}
              >
                <span
                  className={toggleFlag ? "" : "active"}
                  style={{ color: "var(--theme-blue)" }}
                >
                Rent
                </span>
                <div
                  className={
                    toggleFlag
                      ? "toggle-switch on commercial"
                      : "toggle-switch off residential"
                  }
                  style={{ padding: "0 10px" }}
                >
                  <div onClick={toggleBtnClick}>
                    <div></div>
                  </div>
                </div>
                <span
                  className={toggleFlag ? "active" : ""}
                  style={{ color: "var(--theme-orange)" }}
                >
                 Sale
                </span>
              </div>
            </div>
          
              <button className="theme_btn btn_fill">
                  Search
              </button>
         
          </div>
        </div>
        <br />
      </div>
    </div>
  </div>
  )
}

export default PGSearch
