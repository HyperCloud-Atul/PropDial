import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./ProductCarousel.css"

const ProductCarousel = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
  };
  return (
    <div className="logo_carousel"> 
          <div className="container">
       <div className="row">
       <div className="col-md-6">
                <div className="lc_left">
                    <h4>Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using</h4>
                </div>
            </div>
            <div className="col-md-6">
                <div className="lc_right">
                <Carousel
        swipeable={false}
        draggable={false}
        showDots={false}
        responsive={responsive}
        ssr={true} // means to render carousel on the server-side.
        infinite={true}
        autoPlay={true} // Enable auto-play for the second carousel
        autoPlaySpeed={4000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        // containerClass="carousel-container"
        removeArrowOnDeviceType={["desktop", "tablet", "mobile"]}
        // dotListClass="custom-dot-list-style"
        // itemClass="carousel-item-padding-40-px"
      >
        <div className="lc_slide_single">
            <img src="./assets/img/lc_img_1.png" alt="" />
            <h5>Lorem Ipsum</h5>
            <h6>Lorem Ipsum</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/lc_img_2.png" alt="" />
            <h5>Lorem Ipsum</h5>
              <h6>Lorem Ipsum</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/lc_img_3.png" alt="" />
            <h5>Lorem Ipsum</h5>
              <h6>Lorem Ipsum</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/lc_img_4.png" alt="" />
            <h5>Lorem Ipsum</h5>
              <h6>Lorem Ipsum</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/lc_img_1.png" alt="" />
            <h5>Lorem Ipsum</h5>
            <h6>Lorem Ipsum</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/lc_img_2.png" alt="" />
            <h5>Lorem Ipsum</h5>
              <h6>Lorem Ipsum</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/lc_img_3.png" alt="" />
            <h5>Lorem Ipsum</h5>
              <h6>Lorem Ipsum</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/lc_img_4.png" alt="" />
            <h5>Lorem Ipsum</h5>
              <h6>Lorem Ipsum</h6>
        </div>
      </Carousel>
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
