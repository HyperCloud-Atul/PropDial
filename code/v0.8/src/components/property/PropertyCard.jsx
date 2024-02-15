import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const PropertyCard = ({ propertydoc }) => {
  // expand more expand less start
  const [expanded, setExpanded] = useState(true);

  // console.log('propertydoc:', propertydoc)

  const handleExpand = () => {
    setExpanded(!expanded);
  };
  // sexpand more expand less end
  return (


    <div className="property_single_card">
      <Link to={`/propertydetails/${propertydoc.id}`} key={propertydoc.id} className="top relative">
        <div className="fav">
          <span className="material-symbols-outlined">favorite</span>
        </div>
        <div className="img_container">
          <img src="./assets/img/admin_banner.jpg" alt="" />
        </div>
        <div className="left_side relative">
          <h5 className="demand">
            <span>₹</span> {propertydoc.demandprice}
            {propertydoc.maintenancecharges !== '' && <span
              style={{
                fontSize: "10px",
              }}
            >
              + Maintenance ₹{propertydoc.maintenancecharges} ({propertydoc.maintenancechargesfrequency})
            </span>}
          </h5>
          <div className="full_address">
            <h6>{propertydoc.bhk} {propertydoc.propertyType} for {propertydoc.purpose}</h6>
            <h6>{propertydoc.society} | {propertydoc.locality}</h6>
            <h6>{propertydoc.city} | {propertydoc.state}</h6>
          </div>
        </div>
      </Link>
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
              <h6>Super Area</h6>
              <h5>{propertydoc.superArea} {propertydoc.superAreaUnit} </h5>
            </div>
          </div>
          <div className="ms_child">
            <div className="icon_container">
              <img src="/assets/img/new_bedroom.png" alt="" />
            </div>
            <div className="left">
              <h6>Bedroom</h6>
              <h5>{propertydoc.numberOfBedrooms}</h5>
            </div>
          </div>
          <div className="ms_child">
            <div className="icon_container">
              <img src="/assets/img/new_bathroom.png" alt="" />
            </div>
            <div className="left">
              <h6>Bathroom</h6>
              <h5>{propertydoc.numberOfBathrooms}</h5>
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
                <h6>Carpet Area</h6>
                <h5>{propertydoc.carpetArea} {propertydoc.carpetAreaUnit}</h5>
              </div>
            </div>
            <div className="ms_child">
              <div className="icon_container">
                <img src="/assets/img/new_bhk.png" alt="" />
              </div>
              <div className="left">
                <h6>BHK</h6>
                <h5>{propertydoc.bhk}</h5>
              </div>
            </div>
            <div className="ms_child">
              <div className="icon_container">
                <img src="/assets/img/new_furniture.png" alt="" />
              </div>
              <div className="left">
                <h6>furnishing</h6>
                <h5>{propertydoc.furnishing}</h5>
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
                  {propertydoc.additionalRooms.length > 0 ?
                    (propertydoc.additionalRooms.map((additionalroom) => (
                      <span>{additionalroom}</span>
                    ))) : 'No Additional Rooms'}
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
        <Link to={`/propertydetails/${propertydoc.id}`} key={propertydoc.id} className="view_detail click_text">
          view more
        </Link>
      </div>
    </div>



  );
};

export default PropertyCard;
