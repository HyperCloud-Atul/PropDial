import React from "react";
import { useState, useEffect } from "react";
import AutoTypingEffect from "../../../Components/AutoTypingEffect";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// owl carousel
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

// component
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useCollection } from "../../../hooks/useCollection";
import CircularProgressBar from "./CircularProgressBar";

const PropAgentHome = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate()

  // console.log('In PropAgentHome')

  const [searchKey, setSearchKey] = useState('');



  const { documents: dbpropertiesdocuments, error: propertieserror } =
    useCollection("properties", ["postedBy", "==", "Agent"]);

  const propertiesdocuments = dbpropertiesdocuments && dbpropertiesdocuments.filter(
    (item) => item.status === 'active');

  // console.log('properties :', propertiesdocuments)

  const mypropertiesdocuments = user && user.uid && dbpropertiesdocuments && dbpropertiesdocuments.filter(
    (item) => item.status === 'pending approval' && item.createdBy.id === user.uid);

  // useEffect(() => {
  //   console.log('properties :', propertiesdocuments)
  // }, [propertiesdocuments, mypropertiesdocuments]);

  let myPendingProperties = 0;

  if (user && mypropertiesdocuments && mypropertiesdocuments.length > 0) {
    // console.log("mypropertiesdocuments: ", mypropertiesdocuments.length);
    myPendingProperties = mypropertiesdocuments.filter(
      (item) => item.createdBy.id === user.uid
    ).length;
  }

  //All
  let totalProperties = "0";
  let activeProperties = "0";
  let availableForRentProperties = "0";
  let availableForSaleProperties = "0";
  let rentedoutProperties = "0";
  let soldoutProperties = "0";
  let residentialProperties = "0";
  let commercialProperties = "0";

  let delhiProperties = "0";
  let delhiPropertiesPercentage = "0";
  let gurugramProperties = "0";
  let gurugramPropertiesPercentage = "0";
  let noidaProperties = "0";
  let noidaPropertiesPercentage = "0";
  let faridabadProperties = "0";
  let faridabadPropertiesPercentage = "0";
  let ghaziabadProperties = "0";
  let ghaziabadPropertiesPercentage = "0";
  let bangaloreProperties = "";
  let bangalorePropertiesPercentage = "0";
  let puneProperties = "0";
  let punePropertiesPercentage = "0";
  let mumbaiProperties = "0";
  let mumbaiPropertiesPercentage = "0";
  let hyderabadProperties = "0";
  let hyderabadPropertiesPercentage = "0";
  let goaProperties = "0";
  let goaPropertiesPercentage = "0";

  //All properties including my properties
  if (propertiesdocuments) {
    totalProperties = propertiesdocuments.length;
    // console.log('# of properties', totalProperties)
    activeProperties = propertiesdocuments.filter(
      (item) => item.status.toUpperCase() === "active"
    ).length;
    // console.log('active properties', activeProperties.length)

    availableForRentProperties = propertiesdocuments.filter(
      (item) => item.purpose.toUpperCase() === "RENT"
    ).length;

    availableForSaleProperties = propertiesdocuments.filter(
      (item) => item.purpose.toUpperCase() === "SALE"
    ).length;

    rentedoutProperties = propertiesdocuments.filter(
      (item) => item.purpose.toUpperCase() === "Rented Out"
    ).length;

    soldoutProperties = propertiesdocuments.filter(
      (item) => item.purpose.toUpperCase() === "Sold Out"
    ).length;

    residentialProperties = propertiesdocuments.filter(
      (item) => item.category.toUpperCase() === "RESIDENTIAL"
    ).length;
    commercialProperties = propertiesdocuments.filter(
      (item) => item.category.toUpperCase() === "COMMERCIAL"
    ).length;

    delhiProperties = propertiesdocuments.filter(
      (item) => item.city.toUpperCase() === "DELHI"
    ).length;
    delhiPropertiesPercentage = (delhiProperties / totalProperties) * 100;
    gurugramProperties = propertiesdocuments.filter(
      (item) => item.city.toUpperCase() === "GURUGRAM"
    ).length;
    gurugramPropertiesPercentage = (gurugramProperties / totalProperties) * 100;
    noidaProperties = propertiesdocuments.filter(
      (item) => item.city.toUpperCase() === "NOIDA"
    ).length;
    noidaPropertiesPercentage = (noidaProperties / totalProperties) * 100;
    faridabadProperties = propertiesdocuments.filter(
      (item) => item.city.toUpperCase() === "FARIDABAD"
    ).length;
    faridabadPropertiesPercentage =
      (faridabadProperties / totalProperties) * 100;
    ghaziabadProperties = propertiesdocuments.filter(
      (item) => item.city.toUpperCase() === "GHAZIABAD"
    ).length;
    ghaziabadPropertiesPercentage =
      (ghaziabadProperties / totalProperties) * 100;
    bangaloreProperties = propertiesdocuments.filter(
      (item) => item.city.toUpperCase() === "BANGALORE"
    ).length;
    bangalorePropertiesPercentage =
      (bangaloreProperties / totalProperties) * 100;
    puneProperties = propertiesdocuments.filter(
      (item) => item.city.toUpperCase() === "PUNE"
    ).length;
    punePropertiesPercentage = (puneProperties / totalProperties) * 100;
    mumbaiProperties = propertiesdocuments.filter(
      (item) => item.city.toUpperCase() === "MUMBAI"
    ).length;
    mumbaiPropertiesPercentage = (mumbaiProperties / totalProperties) * 100;
    hyderabadProperties = propertiesdocuments.filter(
      (item) => item.city.toUpperCase() === "HYDERABAD"
    ).length;
    hyderabadPropertiesPercentage =
      (hyderabadProperties / totalProperties) * 100;
    goaProperties = propertiesdocuments.filter(
      (item) => item.city.toUpperCase() === "GOA"
    ).length;
    goaPropertiesPercentage = (goaProperties / totalProperties) * 100;
  }



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

  const getAgentProperties = (searchFilterVal) => {
    // console.log('In getAgentProperties')
    navigate("/agentproperties", {
      state: {
        // propSearchFilter: searchFilterVal,
        // filterType: searchType,
        propSearchFilter: searchFilterVal
      }
    });
  }

  const getSearchedProperties = () => {
    // console.log('In getAgentProperties')
    navigate("/agentproperties", {
      state: {
        // propSearchFilter: searchFilterVal,
        // filterType: searchType,
        propSearchFilter: searchKey
      }
    });
  }

  return (
    <div className="pa_bg  propagent_home propagent_dashboard_inner ">
      <div className="home_banner">
        <div className="swipercomp">
          <div className="swipercomp_inner relative">
            <Carousel>
              <Carousel.Item>
                <div className="ad_container">
                  <img src="./assets/img/desktop-banner.webp" alt="Offer 1" />
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="ad_container">
                  <img src="./assets/img/homebanner2.jpg" alt="Offer 1" />
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="ad_container">
                  <img src="./assets/img/homebanner3.jpg" alt="Offer 1" />
                </div>
              </Carousel.Item>
            </Carousel>
            <div className="banner_content">
              <div className="bc_inner">
                <div className="container">
                  <h1 className="typing_effect">
                    <span>Find Your Best House</span>
                    <AutoTypingEffect className="auto_typing_text"></AutoTypingEffect>
                  </h1>
                  <h6>We Have Million Properties For You</h6>

                  <div className="search_area">
                    <div className="field_inner relative propagent_home_search">
                      <input
                        type="text"
                        placeholder="Type city, locality or society..."
                        onChange={(e) => setSearchKey(e.target.value)}
                      />
                      <div className="field_icon">
                        <span className="material-symbols-outlined">search</span>
                      </div>
                    </div>
                  </div>
                  <div className="search_property pointer mt-4">
                    {/* <Link to="/agentproperties"> */}
                    <button className="theme_btn btn_fill" onClick={() => getSearchedProperties()}>
                      Search
                      <span className="material-symbols-outlined btn_arrow ba_animation">
                        arrow_forward
                      </span>
                    </button>
                    {/* </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pa_inner_page">


        <section className="other_property_details">
          <div className="row flex_direction_991">
            <div className="col-lg-6">
              <div className="properties_map">
                <h2 className="p_title">Properties in major cities</h2>
                <div className="pi_cities row">
                  <div className="left col-6">
                    <div className="pi_cities_single" onClick={() => getAgentProperties('DELHI')}>
                      <h6>Delhi</h6>
                      <h5>{delhiProperties}</h5>
                      <div className="bar">
                        <div
                          className="bar_fill"
                          style={{
                            width: delhiPropertiesPercentage + "%",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="pi_cities_single mt-4" onClick={() => getAgentProperties('GURUGRAM')}>
                      <h6>Gurugram</h6>
                      <h5>{gurugramProperties}</h5>
                      <div className="bar">
                        <div
                          className="bar_fill"
                          style={{
                            width: gurugramPropertiesPercentage + "%",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="pi_cities_single mt-4" onClick={() => getAgentProperties('NOIDA')}>
                      <h6>Noida</h6>
                      <h5>{noidaProperties}</h5>
                      <div className="bar">
                        <div
                          className="bar_fill"
                          style={{
                            width: noidaPropertiesPercentage + "%",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="pi_cities_single mt-4" onClick={() => getAgentProperties('FARIDABAD')}>
                      <h6>Faridabad</h6>
                      <h5>{faridabadProperties}</h5>
                      <div className="bar">
                        <div
                          className="bar_fill"
                          style={{
                            width: faridabadPropertiesPercentage + "%",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="pi_cities_single mt-4" onClick={() => getAgentProperties('GHAZIABAD')}>
                      <h6>Ghaziabad</h6>
                      <h5>{ghaziabadProperties}</h5>
                      <div className="bar">
                        <div
                          className="bar_fill"
                          style={{
                            width: ghaziabadPropertiesPercentage + "%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="right col-6">
                    <div className="pi_cities_single" onClick={() => getAgentProperties('BANGALORE')}>
                      <h6>Bangalore</h6>
                      <h5>{bangaloreProperties}</h5>
                      <div className="bar">
                        <div
                          className="bar_fill"
                          style={{
                            width: bangalorePropertiesPercentage + "%",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="pi_cities_single mt-4" onClick={() => getAgentProperties('PUNE')}>
                      <h6>Pune</h6>
                      <h5>{puneProperties}</h5>
                      <div className="bar">
                        <div
                          className="bar_fill"
                          style={{
                            width: punePropertiesPercentage + "%",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="pi_cities_single mt-4" onClick={() => getAgentProperties('MUMBAI')}>
                      <h6>Mumbai</h6>
                      <h5>{mumbaiProperties}</h5>
                      <div className="bar">
                        <div
                          className="bar_fill"
                          style={{
                            width: mumbaiPropertiesPercentage + "%",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="pi_cities_single mt-4" onClick={() => getAgentProperties('HYDERABAD')}>
                      <h6>Hyderabad</h6>
                      <h5>{hyderabadProperties}</h5>
                      <div className="bar">
                        <div
                          className="bar_fill"
                          style={{
                            width: hyderabadPropertiesPercentage + "%",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="pi_cities_single mt-4" onClick={() => getAgentProperties('GOA')}>
                      <h6>Goa</h6>
                      <h5>{goaProperties}</h5>
                      <div className="bar">
                        <div
                          className="bar_fill"
                          style={{
                            width: goaPropertiesPercentage + "%",
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
              <div onClick={() => getAgentProperties('PENDING APPROVAL')}>
                {myPendingProperties > 0 && (
                  <section className="container">
                    {/* <div className="verticall_gap"></div> */}
                    {/* <Link to="/agentproperties"> */}
                    <div className="home_pending_property">
                      <span className="material-symbols-outlined">
                        arrow_forward_ios
                      </span>
                      <div className="left">
                        <img src="/assets/img/pending_watch.png" alt="" />
                      </div>
                      <div className="right text-end">
                        <h6>Pending property</h6>
                        <h5>{myPendingProperties}</h5>
                      </div>
                    </div>
                    {/* </Link> */}
                    <div className="verticall_gap"></div>
                  </section>
                )}
              </div>
              <CircularProgressBar
                rentProperties={availableForRentProperties}
                saleProperties={availableForSaleProperties}
                rentedoutProperties={rentedoutProperties}
                soldoutProperties={soldoutProperties}
                commercialProperties={commercialProperties}
                residentialProperties={residentialProperties}
                totalProperties={totalProperties}
              />
            </div>
          </div>
        </section>
        <div className="verticall_gap"></div>
        <section className="add_section row">
          <div className="add_single col-lg-6">
            <OwlCarousel className="owl-theme" {...addImgOptions2}>
              <div className="item">
                <img src="/assets/img/banner2.png" alt="" className="add_img" />
              </div>
              <div className="item">
                <img src="/assets/img/banner1.png" alt="" className="add_img" />
              </div>
            </OwlCarousel>
          </div>
          <div className="add_single col-lg-6 add_single_2">
            <OwlCarousel className="owl-theme" {...addImgOptions}>
              <div className="item">
                <img src="/assets/img/banner1.png" alt="" className="add_img" />
              </div>
              <div className="item">
                <img src="/assets/img/banner2.png" alt="" className="add_img" />
              </div>
            </OwlCarousel>
          </div>
        </section>
        <div className="verticall_gap"></div>
        {/* <section className="work_flow sect_padding">
        <div className="container">
          <div className="section_title text-center">
            <div className="section_title_effect">Agent Community</div>
            <h3>How It Works</h3>
          </div>
          <div className="how_it_work">
            <div className="hiw_single">
              <div className="icon">
                <span className="material-symbols-outlined">chronic</span>
              </div>
              <h5>Make an appointment</h5>
              <div className="steps">Step 1</div>
            </div>
            <div className="direction d_none_767">
              <span>--------</span> &gt;
            </div>
            <div className="hiw_single">
              <div className="icon">
                <span className="material-symbols-outlined">monitoring</span>
              </div>
              <h5>Evaluate the property</h5>
              <div className="steps">Step 2</div>
            </div>
            <div className="direction d_none_767">
              <span>--------</span> &gt;
            </div>
            <div className="hiw_single">
              <div className="icon">
                <span className="material-symbols-outlined">favorite</span>
              </div>
              <h5>Close the deal. Enjoy!</h5>
              <div className="steps">Step 3</div>
            </div>
          </div>
          <div
            className="wf_first"
            style={{
              backgroundImage: "url('./assets/img/line.png')",
            }}
          >
            <div className="row">
              <div className="col-sm-3">
                <div className="wf_single top">
                  <div className="icon_div relative">
                    <img src="./assets/img/wf1.jpg" />
                    <div className="steps">1</div>
                  </div>
                  <h4>Property On-Boarding</h4>
                  <h5>
                    Property onboarding initiates by collecting pertinent data: ownership details, property type, and existing leases, fueling our management system efficiently.

                  </h5>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="wf_single bottom">
                  <div className="icon_div relative">
                    <img src="./assets/img/wf2.jpg" />
                    <div className="steps">2</div>
                  </div>
                  <h4>Inspection & Agreement</h4>
                  <h5>
                    Propdial initiates a property inspection to evaluate its condition, guiding maintenance decisions. We facilitate lease agreement signings for clarity and mutual consent.

                  </h5>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="wf_single top">
                  <div className="icon_div relative">
                    <img src="./assets/img/wf3.jpg" />
                    <div className="steps">3</div>
                  </div>
                  <h4>Financial & Legal Compliance</h4>
                  <h5>
                    Propdial maintains thorough property financial records, delivering regular statements to owners. We guarantee property compliance with local, state, and government laws.
                  </h5>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="wf_single bottom">
                  <div className="icon_div relative">
                    <img src="./assets/img/wf4.jpg" />
                    <div className="steps">4</div>
                  </div>
                  <h4>Reporting & Communication</h4>
                  <h5>
                    Propdial delivers periodic property reports to owners, including updates on property status, financial performance, and noteworthy developments.
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      </div>
    </div>
  );
};

export default PropAgentHome;
