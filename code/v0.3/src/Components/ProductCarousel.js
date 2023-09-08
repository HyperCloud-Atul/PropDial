import React from "react";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import "./ProductCarousel.css";

const ProductCarousel = () => {
  const citiesOptions = {
    items: 6,
    loop: true,
    margin: 10,
    nav: true,
    // animateOut: 'fadeOut', // Fade out animation
    // animateIn: 'fadeIn',   // Fade in animation
    dots:false,
    smartSpeed: 2000,
    autoplay: true, // Enable autoplay
    autoplayTimeout: 5000, // Set autoplay interval (in milliseconds)
    responsive: {
      // Define breakpoints and the number of items to show at each breakpoint
      0: {
        items: 3,
      },
      768: {
        items: 4,
      },
      992: {
        items: 5,
      },
      1200: {
        items: 6,
      },
    },
  };

  return (
    <div className="logo_carousel">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="section_title">
              <div className="section_title_effect">Our Presence</div>
              <h3>
              Our Impactful and Extensive Global Reach
              </h3>
            </div>
          </div>
          <div className="col-md-8">
            <div className="lc_right">
            <OwlCarousel className="owl-theme" {...citiesOptions}>
                <div className="item lc_slide_single">
                  <img src="./assets/img/haryana.jpg" alt="" />
                  <h6>Haryana</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/uttarpradesh.jpg" alt="" />
                  <h6>Uttar Pradesh</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/delhi.jpg" alt="" />

                  <h6>Delhi</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/maharashtra.jpg" alt="" />

                  <h6>Maharashtra</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/karnataka.jpg" alt="" />

                  <h6>Karnataka</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/telangana.jpg" alt="" />

                  <h6>telangana</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/tamilnadu.png" alt="" />

                  <h6>Tamil Nadu</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/goa.png" alt="" />

                  <h6>Goa</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/uttarakhand.jpg" alt="" />

                  <h6>uttarakhand</h6>
                </div>
                </OwlCarousel>
            </div>
          </div>
        </div>
      </div>

      {/* <Carousel
        swipeable={false}
        draggable={false}
        showDots={true}
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={1000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
      </Carousel> */}
    </div>
  );
};

export default ProductCarousel;
