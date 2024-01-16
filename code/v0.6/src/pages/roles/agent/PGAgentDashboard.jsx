import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../../hooks/useCollection";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

// owl carousel
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
// owl carousel

// component
import CircularProgressBar from "./CircularProgressBar";
import LinearProgressBar from "./LinearProgressBar";

// css
import "./PGAgentDashboard.css";

const PGAgentDashboard = () => {
  // console.log("In PGAgentDashboard");
  const navigate = useNavigate();
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const { user } = useAuthContext();

  const { documents: propertiesdocuments, error: propertieserror } =
    useCollection("properties", ["postedBy", "==", "Agent"]);
  // console.log("propertiesdocuments: ", propertiesdocuments);

  // console.log('user.uid', user.uid)

  const myropertiesdocuments =
    user &&
    user.uid &&
    propertiesdocuments &&
    propertiesdocuments.filter((item) => item.createdBy.id === user.uid);

  // console.log('myropertiesdocuments: ', myropertiesdocuments)

  //All
  let totalProperties = "0";
  let activeProperties = "0";
  let availableForRentProperties = "0";
  let availableForSaleProperties = "0";
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

  //For me
  let myTotalProperties = "0";
  let myActiveProperties = "0";
  let myInActiveProperties = "0";
  let myPendingApprovalProperties = "0";
  let myAvailableForRentProperties = "0";
  let myAvailableForSaleProperties = "0";
  let myRentedOutProperties = "0";
  let mySoldOutProperties = "0";
  let myResidentialProperties = "0";
  let myCommercialProperties = "0";

  //All properties including my properties
  if (propertiesdocuments) {
    totalProperties = propertiesdocuments.length;
    // console.log('# of properties', totalProperties)
    activeProperties = propertiesdocuments.filter(
      (item) => item.status.toUpperCase() === "ACTIVE"
    ).length;
    // console.log('active properties', activeProperties.length)

    availableForRentProperties = propertiesdocuments.filter(
      (item) => item.purpose.toUpperCase() === "RENT"
    ).length;
    availableForSaleProperties = propertiesdocuments.filter(
      (item) => item.purpose.toUpperCase() === "SALE"
    ).length;

    residentialProperties = propertiesdocuments.filter(
      (item) => item.category.toUpperCase() === "RESIDENTAIL"
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
  //My Properties
  if (myropertiesdocuments) {
    //For me
    myTotalProperties = myropertiesdocuments.length;

    myActiveProperties = myropertiesdocuments.filter(
      (item) => item.status.toUpperCase() === "ACTIVE"
    ).length;
    myInActiveProperties = myropertiesdocuments.filter(
      (item) => item.status.toUpperCase() === "INACTIVE"
    ).length;
    myPendingApprovalProperties = myropertiesdocuments.filter(
      (item) => item.status.toUpperCase() === "PENDING APPROVAL"
    ).length;

    myAvailableForRentProperties = myropertiesdocuments.filter(
      (item) => item.purpose.toUpperCase() === "RENT"
    ).length;
    myAvailableForSaleProperties = myropertiesdocuments.filter(
      (item) => item.purpose.toUpperCase() === "SALE"
    ).length;
    myRentedOutProperties = myropertiesdocuments.filter(
      (item) => item.purpose.toUpperCase() === "RENTED OUT"
    ).length;
    mySoldOutProperties = myropertiesdocuments.filter(
      (item) => item.purpose.toUpperCase() === "SOLD OUT"
    ).length;

    myResidentialProperties = myropertiesdocuments.filter(
      (item) => item.category.toUpperCase() === "RESIDENTIAL"
    ).length;
    myCommercialProperties = myropertiesdocuments.filter(
      (item) => item.category.toUpperCase() === "COMMERCIAL"
    ).length;
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
        propSearchFilter: searchFilterVal
      },
    });
  };
  // 9 dots controls
  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };
  // 9 dots controls
  return (
    <div className="top_header_pg pa_bg propagent_dashboard">
      <div className="pa_inner_page">
        {/* 9 dots html  */}
        {user && user.role === "propagentadmin" && (
          <>
            <div
              onClick={openMoreAddOptions}
              className="property-list-add-property"
            >
              <span className="material-symbols-outlined">apps</span>
            </div>
            <div
              className={
                handleMoreOptionsClick
                  ? "more-add-options-div open"
                  : "more-add-options-div"
              }
              onClick={closeMoreAddOptions}
              id="moreAddOptions"
            >
              <div className="more-add-options-inner-div">
                <div className="more-add-options-icons">
                  <h1>Close</h1>
                  <span className="material-symbols-outlined">close</span>
                </div>
                <Link to="/propagentaddnotification/new" className="more-add-options-icons">
                  <h1>Add Notifications</h1>
                  <span className="material-symbols-outlined">view_list</span>
                </Link>
                <Link
                  to="/propagentadmindashboard"
                  className="more-add-options-icons"
                >
                  <h1>Approve Properties</h1>
                  <span className="material-symbols-outlined">check_box</span>
                </Link>
                <Link to="/propagentusers" className="more-add-options-icons">
                  <h1>Users</h1>
                  <span className="material-symbols-outlined">group</span>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* 9 dots html  */}
        <div className="pg_header">
          <h2 className="p_title">Dashboard</h2>
          <h4 className="p_subtitle">
            Welcome <b> {user.displayName} </b>to PropAgent
          </h4>
        </div>
        <div className="verticall_gap"></div>
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
                          total={totalProperties}
                          current={myTotalProperties}
                        />
                      </div>

                      <h6>
                        You have {myTotalProperties} properties out of Total{" "}
                        {totalProperties} properties in system
                      </h6>
                    </div>
                    <div className="number">{myTotalProperties}</div>
                  </div>
                </div>
              </div>
              <div className="verticall_gap_991"></div>
              <div className="col-lg-7 bg_575">
                <div className="verticall_gap_575"></div>
                <div className="property_status">
                  <div
                    className="ps_single pending"
                    onClick={() => getAgentProperties("PENDING APPROVAL")}
                  >
                    <h5>{myPendingApprovalProperties}</h5>
                    <h6>Pending Approval</h6>
                  </div>
                  <div
                    className="ps_single active"
                    onClick={() => getAgentProperties("ACTIVE")}
                  >
                    <h5>{myActiveProperties}</h5>
                    <h6>Active</h6>
                  </div>
                  <div
                    className="ps_single inactive"
                    onClick={() => getAgentProperties("INACTIVE")}
                  >
                    <h5>{myInActiveProperties}</h5>
                    <h6>Inactive</h6>
                  </div>
                </div>
                <div className="verticall_gap_575"></div>
              </div>
            </section>
            <div className="verticall_gap"></div>
            <section className="self_property_detail">
              <div className="spd_single">
                <div className="left residential">
                  <img src="/assets/img/house.png" alt="" />
                </div>
                <div className="right">
                  <h6>Residential</h6>
                  <h5>{myResidentialProperties}</h5>
                </div>
              </div>
              <div className="spd_single">
                <div className="left commercial">
                  <img src="/assets/img/buildings.png" alt="" />
                </div>
                <div className="right">
                  <h6>Commercial</h6>
                  <h5>{myCommercialProperties}</h5>
                </div>
              </div>
              <div className="spd_single">
                <div className="left rent">
                  <img src="/assets/img/key.png" alt="" />
                </div>
                <div className="right">
                  <h6>Available for Rent</h6>
                  <h5>{myAvailableForRentProperties}</h5>
                </div>
              </div>
              <div className="spd_single">
                <div className="left sale">
                  <img src="/assets/img/growth.png  " alt="" />
                </div>
                <div className="right ">
                  <h6>Available for Sale</h6>
                  <h5>{myAvailableForSaleProperties}</h5>
                </div>
              </div>
              <div className="spd_single">
                <div className="left rent">
                  <img src="/assets/img/rented_out.png" alt="" />
                </div>
                <div className="right">
                  <h6>Rented Out</h6>
                  <h5>{myRentedOutProperties}</h5>
                </div>
              </div>
              <div className="spd_single">
                <div className="left sale">
                  <img src="/assets/img/sold_out.png  " alt="" />
                </div>
                <div className="right ">
                  <h6>Sold Out</h6>
                  <h5>{mySoldOutProperties}</h5>
                </div>
              </div>
            </section>
            <div className="verticall_gap"></div>
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
      <div className="verticall_gap"></div>
    </div>
  );
};

export default PGAgentDashboard;
