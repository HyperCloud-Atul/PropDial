import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Link } from "react-router-dom";

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
    // autoplay: true,
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
          <h2 className="section_title_effect">Air BNB</h2>
          <h3>Service Apartments - Short Time Rental</h3>
        </div>
        <OwlCarousel className="owl-theme ab_p_carousel" {...options}>
          <Link className="item card_single" to="https://www.airbnb.co.in/rooms/966417708640526996?guests=1&adults=1&viralityEntryPoint=1&s=76&source_impression_id=p3_1695556775_fA6WCaHp3etyoJem" target="_blank">
            <div className="card_img">
              <Carousel
                showDots={true}
                responsive={responsiveimg}
              >

                <img src="./assets/img/airbnb/property1/2.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/property1/1.jpg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/property1/3.jpg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/property1/10.jpg" alt="" className="ic_img-single" />
              </Carousel>
            </div>
            <div className="card_inner">
              <h4 className="location">
                Goa: 2 BHK in Tata Rio T3-201
              </h4>
              <div className="p_info">
                <div className="p_info_single">
                  <img src="./assets/img/plan.png"></img>
                  <h6>Guests:</h6>
                  <h5>4</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/bed.png"></img>
                  <h6>Bed:</h6>
                  <h5>2</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/hallway.png"></img>
                  <h6>Type:</h6>
                  <h5>Sharing apartment</h5>
                </div>
              </div>
              <h4 className="property_price">
                <b><span>₹</span>2k-2.5k</b>
                <span>per night</span>
              </h4>
              <Link className="know_detail learn-more" to="https://www.airbnb.co.in/rooms/966417708640526996?guests=1&adults=1&viralityEntryPoint=1&s=76&source_impression_id=p3_1695556775_fA6WCaHp3etyoJem" target="_blank">
                view detail
              </Link>

            </div>
          </Link>
          <Link className="item card_single" to="https://www.airbnb.co.in/rooms/971457138024310477?guests=1&adults=1&viralityEntryPoint=1&s=76&source_impression_id=p3_1695556775_IHy7Zg9xo5dt7OLG" target="_blank">
            <div className="card_img">
              <Carousel
                showDots={true}
                responsive={responsiveimg}
              >
                <img src="./assets/img/airbnb/property2/2.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/property2/3.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/property2/1.jpg" alt="" className="ic_img-single" />


                <img src="./assets/img/airbnb/property2/4.jpeg" alt="" className="ic_img-single" />
              </Carousel>
            </div>
            <div className="card_inner">
              <h4 className="location">
                Goa: 2 BHK in Tata Rio T4-607
              </h4>
              <div className="p_info">
                <div className="p_info_single">
                  <img src="./assets/img/plan.png"></img>
                  <h6>Guest:</h6>
                  <h5>4</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/bed.png"></img>
                  <h6>Bed:</h6>
                  <h5>2</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/hallway.png"></img>
                  <h6>Type:</h6>
                  <h5>Entire apartment</h5>
                </div>
              </div>
              <h4 className="property_price">
                <b><span>₹</span>2k-2.5k</b>
                <span>per night</span>
              </h4>
              <Link to="https://www.airbnb.co.in/rooms/971457138024310477?guests=1&adults=1&viralityEntryPoint=1&s=76&source_impression_id=p3_1695556775_IHy7Zg9xo5dt7OLG" className="know_detail learn-more" target="_blank">
                view detail
              </Link>
            </div>
          </Link>
          <Link className="item card_single" to="https://www.airbnb.co.in/rooms/871388524750609310?guests=1&adults=1&viralityEntryPoint=1&s=76&source_impression_id=p3_1695556775_4XdIug9%2BRzr4RwS5&modal=PHOTO_TOUR_SCROLLABLE" target="_blank">
            <div className="card_img">
              <Carousel
                showDots={true}
                responsive={responsiveimg}
              >
                <img src="./assets/img/airbnb/property3/1.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/property3/2.jpg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/property3/4.jpeg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/property3/3.jpg" alt="" className="ic_img-single" />
              </Carousel>
            </div>
            <div className="card_inner">
              <h4 className="location">
                Goa: 2 BHK in Tata Rio T6-306
              </h4>
              <div className="p_info">
                <div className="p_info_single">
                  <img src="./assets/img/plan.png"></img>
                  <h6>Guest:</h6>
                  <h5>4</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/bed.png"></img>
                  <h6>Bed:</h6>
                  <h5>2</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/hallway.png"></img>
                  <h6>Type:</h6>
                  <h5>Sharing apartment</h5>
                </div>
              </div>
              <h4 className="property_price">
                <b><span>₹</span>2k-2.5k</b>
                <span>per night</span>
              </h4>
              <Link to="https://www.airbnb.co.in/rooms/871388524750609310?guests=1&adults=1&viralityEntryPoint=1&s=76&source_impression_id=p3_1695556775_4XdIug9%2BRzr4RwS5&modal=PHOTO_TOUR_SCROLLABLE" className="know_detail learn-more" target="_blank">
                view detail
              </Link>
            </div>
          </Link>
          <Link className="item card_single" to="https://www.airbnb.co.in/rooms/864290115669008213?guests=1&adults=1&viralityEntryPoint=1&s=76&source_impression_id=p3_1695556776_XA6%2BspREIs5aMSXh" target="_blank">
            <div className="card_img">
              <Carousel
                showDots={true}
                responsive={responsiveimg}

              >

                <img src="./assets/img/airbnb/property4/2.jpg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/property4/1.jpg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/property4/3.jpg" alt="" className="ic_img-single" />
                <img src="./assets/img/airbnb/property4/4.jpg" alt="" className="ic_img-single" />
              </Carousel>
            </div>
            <div className="card_inner">
              <h4 className="location">
                Goa: 2 BHK in Tata Rio T9-205
              </h4>
              <div className="p_info">
                <div className="p_info_single">
                  <img src="./assets/img/plan.png"></img>
                  <h6>Guest:</h6>
                  <h5>4</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/bed.png"></img>
                  <h6>Bed:</h6>
                  <h5>2</h5>
                </div>
                <div className="p_info_single">
                  <img src="./assets/img/hallway.png"></img>
                  <h6>Type:</h6>
                  <h5>Entire apartment</h5>
                </div>
              </div>
              <h4 className="property_price">
                <b><span>₹</span>2k-2.5k</b>
                <span>per night</span>
              </h4>
              <Link to="https://www.airbnb.co.in/rooms/864290115669008213?guests=1&adults=1&viralityEntryPoint=1&s=76&source_impression_id=p3_1695556776_XA6%2BspREIs5aMSXh " className="know_detail learn-more" target="_blank">
                view detail
              </Link>
            </div>
          </Link>
        </OwlCarousel>
      </div>
    </section>
  );
};

export default AirBnb;
