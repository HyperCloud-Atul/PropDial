import React from "react";
import "./TopCitiesInIndia.css";


const TopCitiesInIndia = () => {
  return (
    <>
      <section className="top_cities sect_padding">
        <div className="first_div">
          <div
            className="cities_single title"        
          >
            <div>
              <div className="section_title">
              <div class="section_title_effect">States</div>
                <h3>we are
operational in</h3>                
              </div>           
            </div>
          </div>
          <div className="cities_single down">
            <img src="./assets/img/city_3.jpg" alt="" className="city_image" />
            <div className="city_number">04.</div>
            <div className="city_name">
              <h6>Delhi</h6>
              <h5>The Heart of India</h5>
            </div>
          </div>
        </div>
        <div className="second_div">
          <div className="first_row">
            <div className="cities_single first_row_img pointer">
              <img
                src="./assets/img/city_7.jpg"
                alt=""
                className="city_image"
              />
              <div className="city_number">01.</div>
         
                <h6>Karnataka</h6>
                <h5>The Garden City</h5>
          
            </div>
            <div className="cities_single first_row_img pointer">
              <img
                src="./assets/img/city_6.jpg"
                alt=""
                className="city_image"
              />
              <div className="city_number">02.</div>
            
                <h6>Maharashtra</h6>
                <h5>Queen of the Deccan</h5>
             
            </div>
            <div className="cities_single first_row_img pointer">
              <img
                src="./assets/img/city_6.jpg"
                alt=""
                className="city_image"
              />
              <div className="city_number">03.</div>
           
                <h6>uttar pradesh</h6>
                <h5>City of Opportunities</h5>
            
            </div>
          </div>
          <div className="second_row">
            <div className="cities_single sr_img_1 pointer">
              <img
                src="./assets/img/city_5.jpg"
                alt=""
                className="city_image"
              />
              <div className="city_number">05.</div>
          
                <h6>Goa</h6>
                <h5>city of dream</h5>
             
            </div>
            <div className="cities_single sr_img_2 pointer">
              <img
                src="./assets/img/city_2.jpg"
                alt=""
                className="city_image"
              />
              <div className="city_number">06.</div>
            
                <h6>Haryana</h6>
                <h5>Millennium City</h5>
       
            </div>
          </div>
        </div>
      </section>
     
      {/* <div className="container">
        <div className="top-cities-heading">
          <h3>
            Top  In <span>India</span>
          </h3>
     
          <div className="divider-line"></div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-sm-12 col-md-12 d-flex right-city-div">
            <h2>Bengaluru</h2>
          </div>

          <div className="row col-lg-8 col-sm-12 col-md-0 left-city-div">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="cities-img pune">
                <h2>Pune</h2>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="cities-img delhi">
                <h2>Delhi</h2>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="cities-img mumbai">
                <h2>Mumbai</h2>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="cities-img noida">
                <h2>Noida</h2>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="cities-img lucknow">
                <h2>Gurugram</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="more-btn-div">
          <button type="button" class="more-btn-info">
            More
          </button>
        </div>
      </div> */}
    </>
  );
};
export default TopCitiesInIndia;
