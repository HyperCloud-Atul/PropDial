import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./ProductCarousel.css";

// css
import "./AirBnb.css";

const AirBnb = () => {
  const options = {
    items: 3,
    loop: true,
    margin: 30,
    nav: true,
    // animateOut: 'fadeOut', // Fade out animation
    // animateIn: 'fadeIn',   // Fade in animation
    smartSpeed: 2000,
    // autoplay: true, // Enable autoplay
    autoplayTimeout: 3000, // Set autoplay interval (in milliseconds)
  };

  const responsiveimg = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <section
      className="sect_padding ari_bnb"
      style={{
        backgroundImage: "url('./assets/img/aribnb_bg.png')",
      }}
    >
      <div className="container">
        <div className="section_title">
          <h2 class="section_title_effect">Air BNB</h2>
          <h3>Lorem Ipsum is simply dummy text</h3>
        </div>
        <OwlCarousel className="owl-theme " {...options}>
          <div className="item card_single">
            <div className="card_img">
              <Carousel
                showDots={false}
                responsive={responsiveimg}
                ssr={false}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={4000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
              >
                <img src="./assets/img/airbnb/1.jpeg" alt="" className="ic_img-single"/>
                <img src="./assets/img/airbnb/2.jpeg" alt="" className="ic_img-single"/>
                <img src="./assets/img/airbnb/3.jpeg" alt="" className="ic_img-single"/>
                <img src="./assets/img/airbnb/4.jpeg" alt="" className="ic_img-single"/>
                <img src="./assets/img/airbnb/5.jpeg" alt="" className="ic_img-single"/>        
              </Carousel>
            </div>
            <div className="card_inner">
                
            </div>
          </div>
          <div className="item">2</div>
          <div className="item">3</div>
          <div className="item">4</div>
          <div className="item">5</div>
          <div className="item">6</div>
        </OwlCarousel>
      </div>
    </section>
  );
};

export default AirBnb;
