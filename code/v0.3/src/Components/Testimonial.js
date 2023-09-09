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
          <h2 class="section_title_effect">Audible Testimonial</h2>
          <h3>Clients Radio Interview, We collect reviews from our customers.</h3>
        </div>

        <Carousel
          swipeable={true}
          draggable={true}
          showDots={true}
          responsive={responsive}
          ssr={true} // means to render carousel on the server-side.
          infinite={true}
          autoPlay={false} // Enable auto-play for the second carousel
          // autoPlaySpeed={4000}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          // containerClass="carousel-container"
          removeArrowOnDeviceType={[]}
          // dotListClass="custom-dot-list-style"
          // itemClass="carousel-item-padding-40-px"
          className="carousel_container"
        >
          <div className="testimonial_single relative">
            <h5>
            Propdial brought convenience and efficiency to managing my Indian property

            </h5>
            <audio controls className="c_interview">
              <source src="./assets/audio/parvinder-1.mp3"/>
            </audio>
            <div className="client_info_div">
              <div className="client_img">
                <img
                  src="./assets/img/client_img_1.jpg"
                  alt=""
                />
              </div>
              <div className="client_info">
                <h4>Mr. Parvinder</h4>
                <h6>Satisfied Propdial Client</h6>
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
            Propdial's service bridged the gap for managing my Indian property

            </h5>
            <audio controls className="c_interview">
              <source src="./assets/audio/snehlata-1.mp3"/>
            </audio>
            <div className="client_info_div">
              <div className="client_img">
                <img
                  src="./assets/img/client_img_2.jpg"
                  alt=""
                />
              </div>
              <div className="client_info">
                <h4>Mrs. Sneh Lata</h4>
                <h6>Satisfied Propdial Client</h6>
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
            Propdial made managing my Indian property from the US effortless.

            </h5>
                <audio controls className="c_interview">
              <source src="./assets/audio/sachin-1.mp3"/>
            </audio>
            <div className="client_info_div">
              <div className="client_img">
                <img
                  src="./assets/img/client_img_3.jpg"
                  alt=""
                />
              </div>
              <div className="client_info">
                <h4>Mr. Sachin Jain</h4>
                <h6>US Resident</h6>
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
            Propdial made long-distance property management hassle-free and stress-free.

            </h5>
                <audio controls className="c_interview">
              <source src="./assets/audio/nishant-1.mp3"/>
            </audio>
            <div className="client_info_div">
              <div className="client_img">
                <img
                  src="./assets/img/client_img_6.jpg"
                  alt=""
                />
              </div>
              <div className="client_info">
                <h4>Mr. Nishant Sharma</h4>
                <h6>Satisfied Propdial Client</h6>
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





// import React from "react";
// import OwlCarousel from 'react-owl-carousel';
// import 'owl.carousel/dist/assets/owl.carousel.css';
// import 'owl.carousel/dist/assets/owl.theme.default.css';
// import "./Testimonial.css";

// const ProductCarousel = () => {
//   const testimonialOptions = {
//     items: 2,
//     dots: true,
//     loop: true,
//     margin: 30,
//     nav: true,
//     smartSpeed: 1500,
//     autoplay: false,
//     autoplayTimeout: 10000,
//     responsive: {
//       // Define breakpoints and the number of items to show at each breakpoint
//       0: {
//         items: 1,
//       },
//       768: {
//         items: 1,
//       },
//       992: {
//         items: 2,
//       },
//     },
//   };


//   return (
//     <div className="sect_padding testimonial_sect">
//       <div className="container">

//         <div className="section_title">
//           <h2 class="section_title_effect">Audible Testimonial</h2>
//           <h3>Clients Radio Interview, We collect reviews from our customers.</h3>
//         </div>
//         <OwlCarousel className="owl-theme" {...testimonialOptions}>
     
//           <div className="item testimonial_single relative">
//             <h5>
//             Propdial brought convenience and efficiency to managing my Indian property

//             </h5>
//             <audio controls className="c_interview">
//               <source src="./assets/audio/parvinder-1.mp3"/>
//             </audio>
//             <div className="client_info_div">
//               <div className="client_img">
//                 <img
//                   src="./assets/img/client_img_1.jpg"
//                   alt=""
//                 />
//               </div>
//               <div className="client_info">
//                 <h4>Mr. Parvinder</h4>
//                 <h6>Satisfied Propdial Client</h6>
//               </div>
//               <div className="quote_down quote">
//                 <img src="./assets/img/quote.png" alt="" />
//               </div>
//               <div className="quote_up quote">
//                 <img src="./assets/img/quote.png" alt="" />
//               </div>
//             </div>
//           </div>
//           <div className="item testimonial_single relative">
//             <h5>
//             Propdial's service bridged the gap for managing my Indian property

//             </h5>
//             <audio controls className="c_interview">
//               <source src="./assets/audio/snehlata-1.mp3"/>
//             </audio>
//             <div className="client_info_div">
//               <div className="client_img">
//                 <img
//                   src="./assets/img/client_img_2.jpg"
//                   alt=""
//                 />
//               </div>
//               <div className="client_info">
//                 <h4>Mrs. Sneh Lata</h4>
//                 <h6>Satisfied Propdial Client</h6>
//               </div>
//               <div className="quote_down quote">
//                 <img src="./assets/img/quote.png" alt="" />
//               </div>
//               <div className="quote_up quote">
//                 <img src="./assets/img/quote.png" alt="" />
//               </div>
//             </div>
//           </div>
//           <div className="item testimonial_single relative">
//             <h5>
//             Propdial made managing my Indian property from the US effortless.

//             </h5>
//                 <audio controls className="c_interview">
//               <source src="./assets/audio/sachin-1.mp3"/>
//             </audio>
//             <div className="client_info_div">
//               <div className="client_img">
//                 <img
//                   src="./assets/img/client_img_3.jpg"
//                   alt=""
//                 />
//               </div>
//               <div className="client_info">
//                 <h4>Mr. Sachin Jain</h4>
//                 <h6>US Resident</h6>
//               </div>
//               <div className="quote_down quote">
//                 <img src="./assets/img/quote.png" alt="" />
//               </div>
//               <div className="quote_up quote">
//                 <img src="./assets/img/quote.png" alt="" />
//               </div>
//             </div>
//           </div>
//           <div className="item testimonial_single relative">
//             <h5>
//             Propdial made long-distance property management hassle-free and stress-free.

//             </h5>
//                 <audio controls className="c_interview">
//               <source src="./assets/audio/nishant-1.mp3"/>
//             </audio>
//             <div className="client_info_div">
//               <div className="client_img">
//                 <img
//                   src="./assets/img/client_img_6.jpg"
//                   alt=""
//                 />
//               </div>
//               <div className="client_info">
//                 <h4>Mr. Nishant Sharma</h4>
//                 <h6>Satisfied Propdial Client</h6>
//               </div>
//               <div className="quote_down quote">
//                 <img src="./assets/img/quote.png" alt="" />
//               </div>
//               <div className="quote_up quote">
//                 <img src="./assets/img/quote.png" alt="" />
//               </div>
//             </div>
//           </div>
//           </OwlCarousel>



//       </div>   
//     </div>
//   );
// };

// export default ProductCarousel;

