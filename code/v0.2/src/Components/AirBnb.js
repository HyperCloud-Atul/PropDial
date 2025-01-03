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
    dots: false,
    loop: false,
    margin: 30,
    nav: true,
    smartSpeed: 1500,
    autoplay: true,
    autoplayTimeout: 10000,
    responsive: {
      // Define breakpoints and the number of items to show at each breakpoint
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
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
          <h3>Service Apartments - Daily/Short Time Rental</h3>
        </div>
        <OwlCarousel className="owl-theme ab_p_carousel" {...options}>
          <div className="item card_single">
            <div className="card_img">
              <Carousel
                showDots={true}
                responsive={responsiveimg}          
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
              <div className="know_detail learn-more">
                Know More
              </div>
        
            </div>
          </div>
          <div className="item card_single">
            <div className="card_img">
              <Carousel
                showDots={true}
                responsive={responsiveimg}          
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
              <div className="know_detail learn-more">
                Know More
              </div>
            </div>
          </div>
          <div className="item card_single">
            <div className="card_img">
              <Carousel
                showDots={true}
                responsive={responsiveimg}       
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
              <div className="know_detail learn-more">
                Know More
              </div>
            </div>
          </div>
          <div className="item card_single">
            <div className="card_img">
              <Carousel
                showDots={true}
                responsive={responsiveimg}     
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
              <div className="know_detail learn-more">
                Know More
              </div>
            </div>
          </div>
          <div className="item card_single">
            <div className="card_img">
              <Carousel
                showDots={true}
                responsive={responsiveimg}     
              >
                <img src="./assets/img/airbnb/1.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/2.jpeg" alt="" className="ic_img-single" />             
                <img src="./assets/img/airbnb/4.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/5.jpeg" alt="" className="ic_img-single" />
              </Carousel>
            </div>
            <div className="card_inner">
              <h4 className="location">
                Margao6, India
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
              <div className="know_detail learn-more">
                Know More
              </div>
            </div>
          </div>
          <div className="item card_single">
            <div className="card_img">
              <Carousel
                showDots={true}
                responsive={responsiveimg}     
              >
                <img src="./assets/img/airbnb/1.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/2.jpeg" alt="" className="ic_img-single" />             
                <img src="./assets/img/airbnb/4.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/5.jpeg" alt="" className="ic_img-single" />
              </Carousel>
            </div>
            <div className="card_inner">
              <h4 className="location">
                Margao7, India
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
              <div className="know_detail learn-more">
                Know More
              </div>
            </div>
          </div>
          <div className="item card_single">
            <div className="card_img">
              <Carousel
                showDots={true}
                responsive={responsiveimg}     
              >
                <img src="./assets/img/airbnb/1.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/2.jpeg" alt="" className="ic_img-single" />             
                <img src="./assets/img/airbnb/4.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/5.jpeg" alt="" className="ic_img-single" />
              </Carousel>
            </div>
            <div className="card_inner">
              <h4 className="location">
                Margao8, India
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
              <div className="know_detail learn-more">
                Know More
              </div>
            </div>
          </div>
          <div className="item card_single">
            <div className="card_img">
              <Carousel
                showDots={true}
                responsive={responsiveimg}     
              >
                <img src="./assets/img/airbnb/1.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/2.jpeg" alt="" className="ic_img-single" />             
                <img src="./assets/img/airbnb/4.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/5.jpeg" alt="" className="ic_img-single" />
              </Carousel>
            </div>
            <div className="card_inner">
              <h4 className="location">
                Margao9, India
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
