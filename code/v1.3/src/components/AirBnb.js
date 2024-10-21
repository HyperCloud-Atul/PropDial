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
        nav: false,
      },
      768: {
        items: 2,
        nav: false,
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
        backgroundImage: "url('./assets/img/home/aribnb_bg.png')",
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

                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-1%2F2.webp?alt=media&token=7a07bf87-a8a0-4e01-9dc8-f911e80442f4" alt="" className="ic_img-single" />
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-1%2F1.webp?alt=media&token=56170837-7735-4670-8f3a-139313260292" alt="" className="ic_img-single" />
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-1%2F3.webp?alt=media&token=a4476f6b-5334-4fae-937c-0164beea5426" alt="" className="ic_img-single" />
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-1%2F10.webp?alt=media&token=6d67353e-bcd7-4e73-b380-ce759aaf7785" alt="" className="ic_img-single" />
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
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-2%2F2.webp?alt=media&token=61d5eee6-cfec-4379-b974-addc949a2dc8" alt="" className="ic_img-single" />
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-2%2F3.webp?alt=media&token=77c69fee-eaa3-47fb-a52f-cae43af60369" alt="" className="ic_img-single" />
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-2%2F1.webp?alt=media&token=12d12b89-a3f6-403e-bf11-a2e6c78ed817" alt="" className="ic_img-single" />


                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-2%2F4.webp?alt=media&token=9dd5bd8f-3cce-403d-9855-5c1f6f465e6b" alt="" className="ic_img-single" />
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
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-3%2F1.webp?alt=media&token=ce591d1e-1b36-4c15-9ae9-7484407766cb" alt="" className="ic_img-single" />
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-3%2F2.webp?alt=media&token=df0ace10-d431-4278-a0a2-946c50ed7b61" alt="" className="ic_img-single" />
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-3%2F4.webp?alt=media&token=175f06b4-f3dc-4a67-9b04-23d3b7d858d0" alt="" className="ic_img-single" />
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-3%2F3.webp?alt=media&token=bb137616-e588-4e85-ac8d-d718e0a731a8" alt="" className="ic_img-single" />
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

                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-4%2F2.webp?alt=media&token=3525fc01-3052-42d1-888f-df7b3402f82e" alt="" className="ic_img-single" />
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-4%2F1.webp?alt=media&token=30d648aa-47f9-4b31-b295-824cf85d6e09" alt="" className="ic_img-single" />
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-4%2F3.webp?alt=media&token=fd8705a1-b415-4215-b8d1-7d04258c795e" alt="" className="ic_img-single" />
                <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fairbnb%2Fproperty-4%2F4.webp?alt=media&token=7e0df7ac-08eb-4912-9bb5-ecdb2d98fd94" alt="" className="ic_img-single" />
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
