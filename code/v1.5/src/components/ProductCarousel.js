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
    dots: false,
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
                Our Impactful and Extensive Global Reach
              </h3>
            </div>
          </div>
          <div className="col-md-8">
            <div className="lc_right">
              <OwlCarousel className="owl-theme" {...citiesOptions}>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Ffaridabad.webp?alt=media&token=20079c9d-6711-48e2-9758-faf794dfa743" alt="propdial" />
                  <h6>Faridabad</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fguru.webp?alt=media&token=b84c559c-2ba5-497f-bc7c-542c6a4e830a" alt="propdial" />
                  <h6>gurugram</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fsohna.webp?alt=media&token=ba64ccc2-4a2d-486a-ac64-3d2586dc5504" alt="propdial" />

                  <h6>sohna</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fdharuhera.webp?alt=media&token=34da2d8b-81f8-4a8c-875c-cc2cd9a881b2" alt="propdial" />

                  <h6>dharuhera</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fnoida.webp?alt=media&token=8d6b7036-29a0-43bc-b3c9-def6113e9f47" alt="propdial" />

                  <h6>noida</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fghazibad.webp?alt=media&token=a6615ef2-6661-49ff-ac8b-dba238e0331b" alt="propdial" />

                  <h6>ghazibad</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Flucknow.webp?alt=media&token=265d86a9-4c27-4772-a180-badabef61ef9" alt="propdial" />

                  <h6>lucknow</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fyamuna-expressway.webp?alt=media&token=0c2f4b5f-1f1a-49d1-be9f-f4e1aa8fd527" alt="propdial" />

                  <h6>yamuna expressway</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fdelhi.webp?alt=media&token=7a43ba34-cdbd-40a2-a200-d1794a5b8b9a" alt="propdial" />

                  <h6>delhi</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fpune.webp?alt=media&token=e3cdd849-6e65-430a-a327-0b39e0489fb6" alt="propdial" />

                  <h6>pune</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fmumbai.webp?alt=media&token=6eec3094-e186-49ef-b589-0e14e7db2649" alt="propdial" />

                  <h6>mumbai</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fthane.webp?alt=media&token=5efefe90-f6c7-4ca3-8e0c-2fb9ca6736e4" alt="propdial" />

                  <h6>thane</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fkalyan.webp?alt=media&token=2e4786c5-dbfe-47e4-a8b8-06394fb20109" alt="propdial" />

                  <h6>kalyan</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fbengaluru.webp?alt=media&token=5c7a80f7-fa82-42ce-b99e-a158347fd265" alt="propdial" />

                  <h6>bengaluru</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fhyderabad.webp?alt=media&token=05b5d8bd-6dc2-408c-abd3-34e8e5b14a24" alt="propdial" />

                  <h6>hyderabad</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fsecunderabad.webp?alt=media&token=2b8337c2-ba03-404d-a8ec-028e38d416a7" alt="propdial" />

                  <h6>secunderabad</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fchennai.webp?alt=media&token=853bd29b-400a-4aeb-95c4-3d7dabf01bd6" alt="propdial" />

                  <h6>chennai</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fchandigarh.webp?alt=media&token=f84e4949-39db-4f87-9b21-38417675ca9f" alt="propdial" />

                  <h6>chandigarh</h6>
                </div>
                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fgoa.webp?alt=media&token=ee95a630-f6aa-4f4d-95b0-f3c747ed81e4" alt="propdial" />

                  <h6>goa</h6>
                </div>

                <div className="item lc_slide_single">
                  <img src="https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/assets%2Fimg%2Fdehradun.webp?alt=media&token=e8315365-5304-47df-9ab0-e94cbccef90e" alt="propdial" />

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
        containerclassName="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListclassName="custom-dot-list-style"
        itemclassName="carousel-item-padding-40-px"
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
