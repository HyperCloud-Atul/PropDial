import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";

const BootstrapCarousel = () => {
  return (
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
  );
};

export default BootstrapCarousel;
