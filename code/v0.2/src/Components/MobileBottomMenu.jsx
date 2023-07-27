import React from "react";
import "./MobileBottomMenu.css";
const MobileBottomMenu = () => {
  return (
    <>
    <div className="mobile_bottom_menu">
        <div className="container d-sm-none">
            <div className="row" id="bottom_menu">
                <div className="col-md-3 col menus-options">
                    <a className="bottom-menu-a active" href="#">
                        <i className="bi bi-house-door-fill"></i>
                        <h1 style={{fontSize: "12px"}}>Home</h1>
                    </a>
                </div>
                <div className="col-md-3 col menus-options">
                    <a className="bottom-menu-a" href="#">
                        <i className="bi bi-hand-index"></i>
                        <h1 style={{fontSize: "12px"}}>Services</h1>
                    </a>
                </div>
                <div className="col-md-3 col menus-options bottom_profile_icon">
                    <a className="bottom-menu-a" href="#">
                        <span id="profile_icon">
                            <i className="bi bi-person-circle"></i>
                        </span>
                    </a>
                </div>
                <div className="col-md-3 col menus-options">
                    <a className="bottom-menu-a" href="#">
                        <i className="bi bi-credit-card"></i>
                        <h1 style={{fontSize: "12px"}}>Booking</h1>
                    </a>
                </div>
                <div className="col-md-3 col menus-options">
                    <a className="bottom-menu-a" href="#">
                        <i className="bi bi-person-lines-fill"></i>
                        <h1 style={{fontSize: "12px"}}>Contact</h1>
                    </a>
                </div>
            </div>
        </div>
    </div>
    </>
  );
};

export default MobileBottomMenu;