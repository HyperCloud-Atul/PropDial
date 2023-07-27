import React, { useState } from "react";
import "./Navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [showMediaIcons, setShowMediaIcons] = useState(false);
  return (
    <>
      <nav className="main-nav">
        {/* 1st logo part  */}
        <div className="nav-logo-div">
        <img src={process.env.PUBLIC_URL + '/Images/Main-Logo-Top.jpg'} alt="propdial logo" className="logo" />
</div>
        {/* 2nd menu part  */}
        <div
          className={
            showMediaIcons ? "menu-link mobile-menu-link" : "menu-link"
          }>
            <ul>
              <li><a className="navbar-link" href="#"><i className="bi bi-house-door" style={{fontSize: "1.8rem"}}></i>&nbsp;
                        Home</a>
                </li>
              <li><a className="navbar-link" href="#"><i className="bi bi-arrow-down-up" style={{fontSize: "1.8rem"}}></i>&nbsp;
                        Resources</a></li>
                <li><a className="navbar-link" href="#"><i className="bi bi-bookmark-check"
                            style={{fontSize: "1.8rem"}}></i>&nbsp;
                        About
                        Us</a></li>
                <li><a className="navbar-link" href="#"><i className="bi bi-phone" style={{fontSize: "1.8rem"}}></i>&nbsp;
                        Contact
                        Us</a>
                </li>
                <li><a className="navbar-link" href="#"><i className="bi bi-box-arrow-in-right"
                            style={{fontSize: "1.8rem"}}></i>&nbsp;
                        Login</a></li>
            </ul>
        </div>

        {/* hamburget menu start  */}
        <div className="social-media">
          <div className="hamburger-menu">
            <a href="#" onClick={() => setShowMediaIcons(!showMediaIcons)}>
              <GiHamburgerMenu />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;