import React from "react";
import AutoTypingEffect from "./AutoTypingEffect";
import "./Banner.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";


function Banner() {
  return (
    <div className="home_banner">
      <div className="swipercomp">
        <div className="swipercomp_inner relative">
          <Carousel>
            <Carousel.Item>
              <div className="ad_container">
                <img src="./assets/img/desktop-banner.webp" alt="Offer 1" />            
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="ad_container">
                <img src="./assets/img/homebanner2.jpg" alt="Offer 1" />
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="ad_container">
                <img src="./assets/img/homebanner3.jpg" alt="Offer 1" />
              </div>
            </Carousel.Item>
          </Carousel>
          <div className="banner_content">
                  <div className="bc_inner">
                    <div className="container">
                        <h1 className="typing_effect">
                         <span> Find Your Best House</span>                          
                          <AutoTypingEffect></AutoTypingEffect>
                        </h1>
                        <h6>We Have Million Properties For You</h6>
                    </div>
                  </div>
                </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
