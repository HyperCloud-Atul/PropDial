import React from "react";
import { useState, useEffect } from "react";

const PropertySingleCard = () => {
  // expand more expand less start
  const [expanded, setExpanded] = useState(true);

  const handleExpand = () => {
    setExpanded(!expanded);
  };
  // sexpand more expand less end
  return (

    <div className="property_single_card">
      <div className="top relative">
        <div className="fav">
          <span className="material-symbols-outlined">favorite</span>
        </div>
        <div className="img_container">
          <img src="./assets/img/admin_banner.jpg" alt="" />
        </div>
        <div className="left_side relative">
          <h5 className="demand">
            <span>₹</span> 45000
            <span
              style={{
                fontSize: "10px",
              }}
            >
              + Maintenance ₹12000 (Quarterly)
            </span>
          </h5>
          <div className="full_address">
            <h6>3 BHK High Rise Apt (10+ floor) for Rent</h6>
            <h6>High Mont | Hinjewadi Phase Ii</h6>
            <h6>Pune | Maharashtra</h6>
          </div>
        </div>
      </div>
      <div className="middle relative">
        <div className="show_more_arrow" onClick={handleExpand}>
          <span className="material-symbols-outlined">
            {expanded ? "keyboard_arrow_down" : "keyboard_arrow_up"}
          </span>
        </div>
        <div className="middle_single">
          <div className="ms_child">
            <div className="icon_container">
              <img src="/assets/img/new_carpet.png" alt="" />
            </div>
            <div className="left">
              <h6>Carpet area</h6>
              <h5>300</h5>
            </div>
          </div>
          <div className="ms_child">
            <div className="icon_container">
              <img src="/assets/img/new_bedroom.png" alt="" />
            </div>
            <div className="left">
              <h6>Bedroom</h6>
              <h5>3</h5>
            </div>
          </div>
          <div className="ms_child">
            <div className="icon_container">
              <img src="/assets/img/new_bathroom.png" alt="" />
            </div>
            <div className="left">
              <h6>Bathroom</h6>
              <h5>3</h5>
            </div>
          </div>
        </div>
        {expanded ? (
          ""
        ) : (
          <div className="middle_single">
            <div className="ms_child">
              <div className="icon_container">
                <img src="/assets/img/new_super_area.png" alt="" />
              </div>
              <div className="left">
                <h6>super area</h6>
                <h5>2000 sqft</h5>
              </div>
            </div>
            <div className="ms_child">
              <div className="icon_container">
                <img src="/assets/img/new_bhk.png" alt="" />
              </div>
              <div className="left">
                <h6>BHK</h6>
                <h5>3 BHK</h5>
              </div>
            </div>
            <div className="ms_child">
              <div className="icon_container">
                <img src="/assets/img/new_furniture.png" alt="" />
              </div>
              <div className="left">
                <h6>furnishing</h6>
                <h5>Semi</h5>
              </div>
            </div>
          </div>
        )}
        {expanded ? (
          ""
        ) : (
          <div className="middle_single addtional_rooms">
            <div className="ms_child">
              <div className="icon_container">
                <img src="/assets/img/new_room.png" alt="" />
              </div>
              <div className="left">
                <h6>Additional rooms</h6>
                <h5>
                  <span>Study Room</span>
                  <span>Pooja Room</span>
                </h5>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bottom">
        <div className="property_owner_detail">
          <div className="img_container">
            <img src="./assets/img/client_img_6.jpg" alt="" />
          </div>
          <div className="pod_right">
            <h5>Abhishek Sehrawat </h5>
            <h6>
              <a href="tel:917827996235" className="phone">
                +917827996235
              </a>
              <a href="tel:917827996235" className="call whatsapp">
                <img
                  src="/assets/img/phone-call.png"
                  alt=""
                  style={{
                    width: "25px",
                    height: "25px",
                    marginLeft: "6px",
                  }}
                />
              </a>
              <a href="https://wa.me/917827996235" className="whatsapp">
                <img
                  src="/assets/img/whatsapp.png"
                  alt=""
                  style={{
                    width: "25px",
                    height: "25px",
                    marginLeft: "6px",
                  }}
                />
              </a>
            </h6>
          </div>
        </div>
      </div>
    </div>


  );
};

export default PropertySingleCard;
