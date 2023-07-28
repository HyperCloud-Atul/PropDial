import React from "react";
import "./Banner.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";

function Banner() {
  return (
    <div className="home_banner">
      <div className="swipercomp">
        <div className="swipercomp_inner">
          <Carousel>
            <Carousel.Item>
              <div className="ad_container relative">
                <img src="./assets/img/desktop-banner.webp" alt="Offer 1" />
                <div className="banner_content">
                  <div className="bc_inner">
                    <div className="container">
                      <h3 className="banner_subheading"></h3>
                      <h2 className="banner_heading"></h2>
                      <a href="#services-section">
                        <button className="btn_fill"></button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="ad_container relative">
                <img src="./assets/img/homebanner2.jpg" alt="Offer 1" />
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="ad_container relative">
                <img src="./assets/img/homebanner3.jpg" alt="Offer 1" />
              </div>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default Banner;
