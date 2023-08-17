import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Testimonial.css";

const ProductCarousel = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 2,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
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
    <div className="sect_padding testimonial_sect">
      <div className="container">

        <div className="section_title">
          <h2 class="section_title_effect">Testimonial</h2>
          <h3>What Our Clients Have to Say</h3>
        </div>

        <Carousel
          swipeable={true}
          draggable={true}
          showDots={true}
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
          className="carousel_container"
        >
          <div className="testimonial_single relative">
            <h5>
              Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a
              type specimen book
            </h5>
            <div className="client_info_div">
              <div className="client_img">
                <img
                  src="./assets/img/client_img_1.jpg"
                  alt=""
                />
              </div>
              <div className="client_info">
                <h4> Rakesh Mishra</h4>
                <h6>Lorem Ipsum</h6>
              </div>
              <div className="quote_down quote">
                <img src="./assets/img/quote.png" alt="" />
              </div>
              <div className="quote_up quote">
                <img src="./assets/img/quote.png" alt="" />
              </div>
            </div>
          </div>
          <div className="testimonial_single relative">
            <h5>
              Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a
              type specimen book
            </h5>
            <div className="client_info_div">
              <div className="client_img">
                <img
                  src="./assets/img/client_img_2.jpg"
                  alt=""
                />
              </div>
              <div className="client_info">
                <h4> Sonam Kapoor</h4>
                <h6>Lorem Ipsum</h6>
              </div>
              <div className="quote_down quote">
                <img src="./assets/img/quote.png" alt="" />
              </div>
              <div className="quote_up quote">
                <img src="./assets/img/quote.png" alt="" />
              </div>
            </div>
          </div>
          <div className="testimonial_single relative">
            <h5>
              Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a
              type specimen book
            </h5>
            <div className="client_info_div">
              <div className="client_img">
                <img
                  src="./assets/img/client_img_3.jpg"
                  alt=""
                />
              </div>
              <div className="client_info">
                <h4>Mohan Yadav</h4>
                <h6>Lorem Ipsum</h6>
              </div>
              <div className="quote_down quote">
                <img src="./assets/img/quote.png" alt="" />
              </div>
              <div className="quote_up quote">
                <img src="./assets/img/quote.png" alt="" />
              </div>
            </div>
          </div>
          <div className="testimonial_single relative">
            <h5>
              Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a
              type specimen book
            </h5>
            <div className="client_info_div">
              <div className="client_img">
                <img
                  src="./assets/img/client_img_6.jpg"
                  alt=""
                />
              </div>
              <div className="client_info">
                <h4>Deepti Sen</h4>
                <h6>Lorem Ipsum</h6>
              </div>
              <div className="quote_down quote">
                <img src="./assets/img/quote.png" alt="" />
              </div>
              <div className="quote_up quote">
                <img src="./assets/img/quote.png" alt="" />
              </div>
            </div>
          </div>
          <div className="testimonial_single relative">
            <h5>
              Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a
              type specimen book
            </h5>
            <div className="client_info_div">
              <div className="client_img">
                <img
                  src="./assets/img/client_img_4.jpg"
                  alt=""
                />
              </div>
              <div className="client_info">
                <h4>Varun Solanki</h4>
                <h6>Lorem Ipsum</h6>
              </div>
              <div className="quote_down quote">
                <img src="./assets/img/quote.png" alt="" />
              </div>
              <div className="quote_up quote">
                <img src="./assets/img/quote.png" alt="" />
              </div>
            </div>
          </div>
          <div className="testimonial_single relative">
            <h5>
              Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a
              type specimen book
            </h5>
            <div className="client_info_div">
              <div className="client_img">
                <img
                  src="./assets/img/client_img_5.jpg"
                  alt=""
                />
              </div>
              <div className="client_info">
                <h4>Khushi Sharma</h4>
                <h6>Lorem Ipsum</h6>
              </div>
              <div className="quote_down quote">
                <img src="./assets/img/quote.png" alt="" />
              </div>
              <div className="quote_up quote">
                <img src="./assets/img/quote.png" alt="" />
              </div>
            </div>
          </div>

        </Carousel>



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
