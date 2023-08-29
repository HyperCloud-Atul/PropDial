import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./ProductCarousel.css"

const ProductCarousel = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
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
       <div className="col-md-4">
             <div className="section_title">
              <div className="section_title_effect">
                Cities
              </div>
              <h3>Lorem Ipsum is that it has a more-or-less normal distribution of letters</h3>
             </div>
            </div>
            <div className="col-md-8">
                <div className="lc_right">
                <Carousel
        swipeable={true}
        // draggable={true}
        showDots={false}
        responsive={responsive}
        ssr={false} // means to render carousel on the server-side.
        infinite={true}
        autoPlay={true} // Enable auto-play for the second carousel
        autoPlaySpeed={4000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        // containerClass="carousel-container"
        // removeArrowOnDeviceType={["desktop", "tablet", "mobile"]}
        // dotListClass="custom-dot-list-style"
        // itemClass="carousel-item-padding-40-px"
      >
        <div className="lc_slide_single">
            <img src="./assets/img/haryana.jpg" alt="" />            
            <h6>Haryana</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/uttarpradesh.jpg" alt="" />            
              <h6>Uttar Pradesh</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/delhi.jpg" alt="" />
            
              <h6>Delhi</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/maharashtra.jpg" alt="" />
            
              <h6>Maharashtra</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/karnataka.jpg" alt="" />
            
            <h6>Karnataka</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/telangana.jpg" alt="" />
            
              <h6>telangana</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/tamilnadu.png" alt="" />
            
              <h6>Tamil Nadu</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/goa.png" alt="" />
            
              <h6>Goa</h6>
        </div>
        <div className="lc_slide_single">
            <img src="./assets/img/uttarakhand.jpg" alt="" />
            
              <h6>uttarakhand</h6>
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
