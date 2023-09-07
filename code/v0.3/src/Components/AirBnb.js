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
    dots:false,
    loop: true,
    margin: 30,
    nav: true,
    // animateOut: 'fadeOut', // Fade out animation
    // animateIn: 'fadeIn',   // Fade in animation
    smartSpeed: 2000,
    autoplay: true, // Enable autoplay
    autoplayTimeout: 10000, // Set autoplay interval (in milliseconds)
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
        <OwlCarousel className="owl-theme ab_p_carousel" {...options}>
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
                <img src="./assets/img/airbnb/1.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/2.jpeg" alt="" className="ic_img-single" />             
                <img src="./assets/img/airbnb/4.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/5.jpeg" alt="" className="ic_img-single" />
              </Carousel>
            </div>
            <div className="card_inner">
              <h4 className="location">
                Margao1, India
              </h4>
              <div className="p_info">
                <div className="p_info_single">
                  <img src="./assets/img/plan.png"></img>
                  <h6>Sq Ft:</h6>
                  <h5>3800</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/bed.png"></img>
                  <h6>Bed:</h6>
                  <h5>2</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/bath.png"></img>
                  <h6>Baths:</h6>
                  <h5>3</h5>
                </div>
              </div>
              <h4 className="property_price">
                <b><span>₹</span>3345</b>
                <span>night</span>
              </h4>
            </div>
          </div>
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
                <img src="./assets/img/airbnb/1.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/2.jpeg" alt="" className="ic_img-single" />             
                <img src="./assets/img/airbnb/4.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/5.jpeg" alt="" className="ic_img-single" />
              </Carousel>
            </div>
            <div className="card_inner">
              <h4 className="location">
                Margao2, India
              </h4>
              <div className="p_info">
                <div className="p_info_single">
                  <img src="./assets/img/plan.png"></img>
                  <h6>Sq Ft:</h6>
                  <h5>3800</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/bed.png"></img>
                  <h6>Bed:</h6>
                  <h5>2</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/bath.png"></img>
                  <h6>Baths:</h6>
                  <h5>3</h5>
                </div>
              </div>
              <h4 className="property_price">
                <b><span>₹</span>3345</b>
                <span>night</span>
              </h4>
            </div>
          </div>
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
                <img src="./assets/img/airbnb/1.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/2.jpeg" alt="" className="ic_img-single" />             
                <img src="./assets/img/airbnb/4.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/5.jpeg" alt="" className="ic_img-single" />
              </Carousel>
            </div>
            <div className="card_inner">
              <h4 className="location">
                Margao4, India
              </h4>
              <div className="p_info">
                <div className="p_info_single">
                  <img src="./assets/img/plan.png"></img>
                  <h6>Sq Ft:</h6>
                  <h5>3800</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/bed.png"></img>
                  <h6>Bed:</h6>
                  <h5>2</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/bath.png"></img>
                  <h6>Baths:</h6>
                  <h5>3</h5>
                </div>
              </div>
              <h4 className="property_price">
                <b><span>₹</span>3345</b>
                <span>night</span>
              </h4>
            </div>
          </div>
          <div className="item card_single">
            <div className="card_img">
              <Carousel
                showDots={false}
                responsive={responsiveimg}
                ssr={false}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={2000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
              >
                <img src="./assets/img/airbnb/1.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/2.jpeg" alt="" className="ic_img-single" />             
                <img src="./assets/img/airbnb/4.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/5.jpeg" alt="" className="ic_img-single" />
              </Carousel>
            </div>
            <div className="card_inner">
              <h4 className="location">
                Margao5, India
              </h4>
              <div className="p_info">
                <div className="p_info_single">
                  <img src="./assets/img/plan.png"></img>
                  <h6>Sq Ft:</h6>
                  <h5>3800</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/bed.png"></img>
                  <h6>Bed:</h6>
                  <h5>2</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/bath.png"></img>
                  <h6>Baths:</h6>
                  <h5>3</h5>
                </div>
              </div>
              <h4 className="property_price">
                <b><span>₹</span>3345</b>
                <span>night</span>
              </h4>
            </div>
          </div>
  
        </OwlCarousel>
      </div>
    </section>
  );
};

export default AirBnb;
