import React from "react";
import { useState, useEffect } from "react";
import LinearProgressBar from "../../../pages/roles/owner/LinearProgressBar";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Link } from "react-router-dom";
import useStateWisePropertyCounts from "../../../utils/useStateWisePropertyCounts";
import usePropertyCounts from "../../../utils/usePropertyCounts";
// owl carousel
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
// owl carousel

// component
import InactiveUserCard from "../../../components/InactiveUserCard";

// css
import "./PGAdminDashboard.scss";

const PGAdminDashboard = () => {
  const { user } = useAuthContext();
  const { stateCounts } = useStateWisePropertyCounts();
  const { counts, countLoading, countError } = usePropertyCounts();

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
    <div>
      {user && user.status === "active" ? (
        <>
          {/* 9 dots html  */}
          <Link
            to="/newproperty"
            className="property-list-add-property with_9dot"
          >
            <span className="material-symbols-outlined">add</span>
          </Link>
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

              <Link to="/newproperty" className="more-add-options-icons">
                <h1>Add property</h1>
                <span className="material-symbols-outlined">location_city</span>
              </Link>

              <Link to="/allproperties/all" className="more-add-options-icons">
                <h1>Properties</h1>
                <span className="material-symbols-outlined">
                  real_estate_agent
                </span>
              </Link>
            </div>
          </div>
          {/* 9 dots html  */}

          <div className="top_header_pg pg_bg propagent_dashboard">
            <div className="page_spacing pg_min_height">
              <div className="pg_header">
                <h2 className="m22 mb-1">
                  {user.role === "admin" ? "Admin" : "Super Admin"} Dashboard
                </h2>
                <h4 className="r18 light_black">
                  Welcome <b> {user.displayName} </b>to Propdial
                </h4>
              </div>
              <div className="vg22"></div>
              <div className="pg_body">
                <div className="propagent_dashboard_inner">
                  <section className="row">
                    <div className="col-xl-5">
                      <div className="total_prop_card relative">
                        <div className="bg_icon">
                          <img src="/assets/img/flats.png" alt="propdial" />
                        </div>
                        <div className="inner">
                          <div className="icon">
                            <img src="/assets/img/flats.png" alt="propdial" />
                          </div>
                          <div className="content">
                            <h4 className="title">My Properties</h4>
                            <div className="bar">
                              <LinearProgressBar total="55" current="20" />
                            </div>

                            <h6>360&deg; Property Management Solutions</h6>
                          </div>
                          <div className="number">{counts.totalCount}</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-7 bg_575">
                      <div className="vg22_1199"></div>
                      <div className="property_status">
                        <Link
                          to="/filtered-property?filter=inreview"
                          className="ps_single pending"
                        >
                          <h5>{counts.inReviewCount}</h5>
                          <h6>In-Review</h6>
                        </Link>
                        <Link className="ps_single active">
                          <h5>{counts.activeCount}</h5>
                          <h6>Active</h6>
                        </Link>
                        <Link
                          to="/filtered-property?filter=inactive"
                          className="ps_single inactive"
                        >
                          <h5>{counts.inactiveCount}</h5>
                          <h6>Inactive</h6>
                        </Link>
                      </div>
                    </div>
                  </section>
                  <div className="vg22"></div>
                  <section className="property_status assign">
                    <Link className="ps_single four">
                      <h5>{counts.residentialCount}</h5>
                      <h6>
                        Property Category <br /> Residential{" "}
                      </h6>
                    </Link>
                    <Link className="ps_single five">
                      <h5>{counts.commercialCount}</h5>
                      <h6>
                        Property Category <br /> Commercial{" "}
                      </h6>
                    </Link>
                    <Link className="ps_single five">
                      <h5>{counts.plotCount}</h5>
                      <h6>
                        Property Category <br /> Plot{" "}
                      </h6>
                    </Link>
                  </section>
                  <div className="vg22"></div>
                  <section className="self_property_detail">
                    <Link className="spd_single">
                      <div className="left rent">
                        <img src="/assets/img/key.png" alt="propdial" />
                      </div>
                      <div className="right">
                        <h6>Available For Rent</h6>
                        <h5>{counts.availableForRentCount}</h5>
                      </div>
                    </Link>
                    <Link className="spd_single">
                      <div className="left sale">
                        <img src="/assets/img/growth.png  " alt="propdial" />
                      </div>
                      <div className="right ">
                        <h6>Available For Sale</h6>
                        <h5>{counts.availableForSaleCount}</h5>
                      </div>
                    </Link>
                    <Link className="spd_single">
                      <div className="left rent">
                        <img src="/assets/img/rented_out.png" alt="propdial" />
                      </div>
                      <div className="right">
                        <h6>Rented Out</h6>
                        <h5>{counts.rentedOutCount}</h5>
                      </div>
                    </Link>
                    <Link className="spd_single">
                      <div className="left sale">
                        <img src="/assets/img/sold_out.png  " alt="propdial" />
                      </div>
                      <div className="right ">
                        <h6>Sold Out</h6>
                        <h5>{counts.soldCount}</h5>
                      </div>
                    </Link>
                    <div className="spd_single">
                      <div className="left residential">
                        <img src="/assets/img/house.png" alt="propdial" />
                      </div>
                      <div className="right">
                        <h6>Rent And Sale</h6>
                        <h5>{counts.rentAndSaleCount}</h5>
                      </div>
                    </div>
                    <div className="spd_single">
                      <div className="left commercial">
                        <img src="/assets/img/buildings.png" alt="propdial" />
                      </div>
                      <div className="right">
                        <h6>Rented But Sale</h6>
                        <h5>{counts.rentedButSaleCount}</h5>
                      </div>
                    </div>
                    <div className="spd_single">
                      <div className="left commercial">
                        <img src="/assets/img/buildings.png" alt="propdial" />
                      </div>
                      <div className="right">
                        <h6>PMS Only</h6>
                        <h5>{counts.pmsOnlyCount}</h5>
                      </div>
                    </div>
                    <div className="spd_single">
                      <div className="left commercial">
                        <img src="/assets/img/buildings.png" alt="propdial" />
                      </div>
                      <div className="right">
                        <h6>PMS After Rent</h6>
                        <h5>{counts.pmsAfterRentCount}</h5>
                      </div>
                    </div>
                  </section>
                  <div className="vg22"></div>

                  {/* properties map start */}
                  <div className="properties_map">
                    <h2
                      className="p_title"
                      style={{
                        fontSize: "21px",
                        fontWeight: "500",
                        marginBottom: "6px",
                      }}
                    >
                      Properties in major states
                    </h2>

                    <div className="pi_cities row">
                      {Object.entries(stateCounts)
                        .filter(([_, count]) => count > 0)
                        .map(([state, count]) => (
                          <div className="col-lg-3 col-md-4 col-6" key={state}>
                            <div className="pi_cities_single mt-4">
                              <h6>{state}</h6>
                              <h5>{count}</h5>
                              <div className="bar">
                                <div
                                  className="bar_fill"
                                  style={{
                                    width: `${
                                      (count / counts.totalCount) * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  {/* properties map end */}
                  <div className="vg22"></div>
                  {/* add carousel start  */}
                  <section className="add_section row">
                    <div className="add_single col-lg-6">
                      <OwlCarousel className="owl-theme" {...addImgOptions2}>
                        <div className="item">
                          <img
                            src="/assets/img/banner1.png"
                            alt="propdial"
                            className="add_img"
                          />
                        </div>
                        <div className="item">
                          <img
                            src="/assets/img/banner2.png"
                            alt="propdial"
                            className="add_img"
                          />
                        </div>
                      </OwlCarousel>
                    </div>
                    <div className="add_single col-lg-6 add_single_2">
                      <OwlCarousel className="owl-theme" {...addImgOptions}>
                        <div className="item">
                          <img
                            src="/assets/img/banner4.png"
                            alt="propdial"
                            className="add_img"
                          />
                        </div>
                        <div className="item">
                          <img
                            src="/assets/img/banner5.png"
                            alt="propdial"
                            className="add_img"
                          />
                        </div>
                      </OwlCarousel>
                    </div>
                  </section>
                  {/* add carousel end  */}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <InactiveUserCard />
      )}
    </div>
  );
};

export default PGAdminDashboard;
