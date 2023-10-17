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
                  <img src="./assets/img/faridabad.jpg" alt="" />
                  <h6>Faridabad</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/guru.jpg" alt="" />
                  <h6>gurugram</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/sohna.jpg" alt="" />

                  <h6>sohna</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/dharuhera.jpg" alt="" />

                  <h6>dharuhera</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/noida.jpg" alt="" />

                  <h6>noida</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/ghazibad.jpg" alt="" />

                  <h6>ghazibad</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/lucknow.jpg" alt="" />

                  <h6>lucknow</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/yamuna-expressway.jpg" alt="" />

                  <h6>yamuna expressway</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/delhi.jpg" alt="" />

                  <h6>delhi</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/pune.jpg" alt="" />

                  <h6>pune</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/mumbai.jpg" alt="" />

                  <h6>mumbai</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/thane.png" alt="" />

                  <h6>thane</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/kalyan.png" alt="" />

                  <h6>kalyan</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/bengaluru.jpg" alt="" />

                  <h6>bengaluru</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/hyderabad.jpg" alt="" />

                  <h6>hyderabad</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/secunderabad.jpg" alt="" />

                  <h6>secunderabad</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/chennai.png" alt="" />

                  <h6>chennai</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/chandigarh.jpeg" alt="" />

                  <h6>chandigarh</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="./assets/img/goa.png" alt="" />

                  <h6>goa</h6>
                </div>
               
                <div className="item lc_slide_single">
                  <img src="./assets/img/dehradun.jpg" alt="" />

                  <h6>dehradun</h6>
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
