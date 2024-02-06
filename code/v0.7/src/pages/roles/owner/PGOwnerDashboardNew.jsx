import React from 'react'
import LinearProgressBar from './LinearProgressBar'

// owl carousel
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
// owl carousel

// css 
import './PGOwnerDashboardNew.css'

const PGOwnerDashboardNew = () => {
     // advertisement img option in owl carousel
  const addImgOptions = {
    items: 1,
    dots: false,
    loop: true,
    margin: 10,
    nav: false,
    smartSpeed: 1500,
    autoplay: true,
    autoplayTimeout: 5000,
    responsive: {
      // Define breakpoints and the number of items to show at each breakpoint
      0: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 1,
      },
    },
  };
  const addImgOptions2 = {
    items: 1,
    dots: false,
    loop: true,
    margin: 10,
    nav: false,
    smartSpeed: 1500,
    autoplay: true,
    autoplayTimeout: 9000,
    responsive: {
      // Define breakpoints and the number of items to show at each breakpoint
      0: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 1,
      },
    },
  };
  // advertisement img option in owl carousel
  return (
    <div>
      <div className="top_header_pg pg_bg propagent_dashboard">
      <div className="page_spacing">  
        <div className="pg_header">
          <h2 className="p_title">Dashboard</h2>
          <h4 className="p_subtitle">
            Welcome <b> sanskar </b>to PropAgent
          </h4>
        </div>
        
        <div className="pg_body">
          <div className="propagent_dashboard_inner">
            <section className="row">
              <div className="col-lg-5">
                <div className="total_prop_card relative">
                  <div className="bg_icon">
                    <img src="/assets/img/flats.png" alt="" />
                  </div>
                  <div className="inner">
                    <div className="icon">
                      <img src="/assets/img/flats.png" alt="" />
                    </div>
                    <div className="content">
                      <h4 className="title">My Properties</h4>
                      <div className="bar">
                        <LinearProgressBar
                          total="55"
                          current="20"
                        />
                      </div>

                      <h6>
                        You have 20 properties out of Total{" "}
                        55 properties in system
                      </h6>
                    </div>
                    <div className="number">20</div>
                  </div>
                </div>
              </div>
            
              <div className="col-lg-7 bg_575">
               
                <div className="property_status">
                  <div
                    className="ps_single pending"                    
                  >
                    <h5>5</h5>
                    <h6>Pending Approval</h6>
                  </div>
                  <div
                    className="ps_single active"
                  
                  >
                    <h5>10</h5>
                    <h6>Active</h6>
                  </div>
                  <div
                    className="ps_single inactive"
                    
                  >
                    <h5>10</h5>
                    <h6>Inactive</h6>
                  </div>
                </div>
            
              </div>
            </section>
            <div className="verticall_gap" style={{
              height:"22px"
            }}></div>
            <section className="self_property_detail">
              <div className="spd_single">
                <div className="left residential">
                  <img src="/assets/img/house.png" alt="" />
                </div>
                <div className="right">
                  <h6>Residential</h6>
                  <h5>5</h5>
                </div>
              </div>
              <div className="spd_single">
                <div className="left commercial">
                  <img src="/assets/img/buildings.png" alt="" />
                </div>
                <div className="right">
                  <h6>Commercial</h6>
                  <h5>5</h5>
                </div>
              </div>
              <div className="spd_single">
                <div className="left rent">
                  <img src="/assets/img/key.png" alt="" />
                </div>
                <div className="right">
                  <h6>Available for Rent</h6>
                  <h5>5</h5>
                </div>
              </div>
              <div className="spd_single">
                <div className="left sale">
                  <img src="/assets/img/growth.png  " alt="" />
                </div>
                <div className="right ">
                  <h6>Available for Sale</h6>
                  <h5>5</h5>
                </div>
              </div>
              <div className="spd_single">
                <div className="left rent">
                  <img src="/assets/img/rented_out.png" alt="" />
                </div>
                <div className="right">
                  <h6>Rented Out</h6>
                  <h5>55</h5>
                </div>
              </div>
              <div className="spd_single">
                <div className="left sale">
                  <img src="/assets/img/sold_out.png  " alt="" />
                </div>
                <div className="right ">
                  <h6>Sold Out</h6>
                  <h5>6</h5>
                </div>
              </div>
            </section>
            <div className="verticall_gap" style={{
              height:"22px"
            }}></div>
            <section className="add_section row">
              <div className="add_single col-lg-6">
                <OwlCarousel className="owl-theme" {...addImgOptions2}>
                  <div className="item">
                    <img
                      src="/assets/img/banner2.png"
                      alt=""
                      className="add_img"
                    />
                  </div>
                  <div className="item">
                    <img
                      src="/assets/img/banner1.png"
                      alt=""
                      className="add_img"
                    />
                  </div>
                </OwlCarousel>
              </div>
              <div className="add_single col-lg-6 add_single_2">
                <OwlCarousel className="owl-theme" {...addImgOptions}>
                  <div className="item">
                    <img
                      src="/assets/img/banner1.png"
                      alt=""
                      className="add_img"
                    />
                  </div>
                  <div className="item">
                    <img
                      src="/assets/img/banner2.png"
                      alt=""
                      className="add_img"
                    />
                  </div>
                </OwlCarousel>
              </div>
            </section>
            {/* <div className="verticall_gap"></div>
            <section className="other_property_details">
              <div className="row">
                <div className="col-lg-6">
                  <div className="properties_map">
                    <h2 className="p_title">Properties in major cities</h2>
                    <div className="pi_cities row">
                      <div className="left col-6">
                        <div className="pi_cities_single">
                          <h6>Delhi</h6>
                          <h5>{delhiProperties}</h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width: delhiPropertiesPercentage + '%',
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Gurugram</h6>
                          <h5>{gurugramProperties}</h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width: gurugramPropertiesPercentage + '%',
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Noida</h6>
                          <h5>{noidaProperties}</h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width: noidaPropertiesPercentage + '%',
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Faridabad</h6>
                          <h5>{faridabadProperties}</h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width: faridabadPropertiesPercentage + '%',
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Ghaziabad</h6>
                          <h5>{ghaziabadProperties}</h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width: ghaziabadPropertiesPercentage + '%',
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="right col-6">
                        <div className="pi_cities_single">
                          <h6>Bangalore</h6>
                          <h5>{bangaloreProperties}</h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width: bangalorePropertiesPercentage + '%',
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Pune</h6>
                          <h5>{puneProperties}</h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width: punePropertiesPercentage + '%',
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Mumbai</h6>
                          <h5>{mumbaiProperties}</h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width: mumbaiPropertiesPercentage + '%',
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Hyderabad</h6>
                          <h5>{hyderabadProperties}</h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width: hyderabadPropertiesPercentage + '%',
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Goa</h6>
                          <h5>{goaProperties}</h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width: goaPropertiesPercentage + '%',
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="verticall_gap_991"></div>
                <div className="col-lg-6">
                  <CircularProgressBar
                    rentProperties={availableForRentProperties}
                    saleProperties={availableForSaleProperties}
                    commercialProperties={commercialProperties}
                    residentialProperties={residentialProperties}
                    totalProperties={totalProperties}
                  />
                </div>
              </div>
            </section>
            <div className="verticall_gap"></div> */}
          </div>
        </div>
      </div>
  
    </div>
    </div>
  )
}

export default PGOwnerDashboardNew
