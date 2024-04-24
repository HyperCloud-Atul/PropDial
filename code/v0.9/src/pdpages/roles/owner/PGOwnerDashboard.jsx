import React from "react";
import { useState, useEffect } from "react";
import LinearProgressBar from "../../../pages/roles/owner/LinearProgressBar";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useCollection } from "../../../hooks/useCollection";

// owl carousel
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
// owl carousel

// component
import PropertyCard from "../../../components/property/PropertyCard";


// css
import "./PGOwnerDashboard.css";

const PGOwnerDashboard = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const { user } = useAuthContext();
  const { documents: properties, error: propertieserror } = useCollection(
    "properties"
  );
  // const { documents: properties, error: propertieserror } = useCollection(
  //   "properties",
  //   ["access", "array-contains", user.uid]
  // );

  const activeProperties =
    properties && properties.filter((item) => item.status.toUpperCase() === 'ACTIVE');

  const pendingProperties =
    properties && properties.filter((item) => item.status.toUpperCase() === 'PENDING APPROVAL');

  const inactiveProperties =
    properties && properties.filter((item) => item.status.toUpperCase() === 'INACTIVE');

  const residentialProperties =
    properties && properties.filter((item) => item.category.toUpperCase() === 'RESIDENTIAL');


  // commercialProperties
  const commercialProperties =
    properties && properties.filter((item) => item.category.toUpperCase() === 'COMMERCIAL');


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
            <h2 className="m22 mb-1">Dashboard</h2>
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
                      <img src="/assets/img/flats.png" alt="" />
                    </div>
                    <div className="inner">
                      <div className="icon">
                        <img src="/assets/img/flats.png" alt="" />
                      </div>
                      <div className="content">
                        <h4 className="title">My Properties</h4>
                        <div className="bar">
                          <LinearProgressBar total="55" current="20" />
                        </div>

                        <h6>
                          360&deg; Property Management Solutions
                        </h6>
                      </div>
                      <div className="number">{properties && properties.length}</div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-7 bg_575">
                  <div className="vg22_1199"></div>
                  <div className="property_status">
                    <div className="ps_single pending">
                      <h5>{pendingProperties && pendingProperties.length}</h5>
                      <h6>In-Review</h6>
                    </div>
                    <div className="ps_single active">
                      <h5>{activeProperties && activeProperties.length}</h5>
                      <h6>Active</h6>
                    </div>
                    <div className="ps_single inactive">
                      <h5>{inactiveProperties && inactiveProperties.length}</h5>
                      <h6>Inactive</h6>
                    </div>
                  </div>
                </div>
              </section>
              <div className="vg22"></div>
              <hr />
              <div className="vg22"></div>
              <section className="self_property_detail">
                <div className="spd_single">
                  <div className="left residential">
                    <img src="/assets/img/house.png" alt="" />
                  </div>
                  <div className="right">
                    <h6>Residential</h6>
                    <h5>{residentialProperties && residentialProperties.length}</h5>
                  </div>
                </div>
                <div className="spd_single">
                  <div className="left commercial">
                    <img src="/assets/img/buildings.png" alt="" />
                  </div>
                  <div className="right">
                    <h6>Commercial</h6>
                    <h5>{commercialProperties && commercialProperties.length}</h5>
                  </div>
                </div>

                {/* <div className="spd_single">
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
                </div> */}
              </section>
              <div className="vg22"></div>
              <hr />
              <div className="vg22"></div>
              <section className="property_cards_parent">
                {properties && properties.map((property) => (
                  <PropertyCard propertydoc={property} />))}
              </section>
              <div className="vg22"></div>
              <hr />
              <div className="vg22"></div>
              <section>
                <div className="payment_card">
                  {/* <div className="top">
                  <div className="left">
                    <h4 className="m20 text_grey">Payments</h4>
                    <h2 className="dashboard_number mt10">8,052</h2>
                  </div>
                  <div className="right"></div>
                </div> */}
                  <div className="all_payments">
                    <div className="payment_single my_big_card">
                      <div className="icon bg_orange">
                        <img src="./assets/img/brokreage_bill_icon.png" alt="" />
                      </div>
                      <div className="right">
                        <h6 className="r14 text_grey">Brokerage Payment</h6>
                        <h5 className="dashboard_number_small">₹ 1,000</h5>
                      </div>
                    </div>
                    <div className="payment_single my_big_card">
                      <div className="icon bg_blue">
                        <img src="./assets/img/financial.png" alt="" />
                      </div>
                      <div className="right">
                        <h6 className="r14 text_grey">PMS</h6>
                        <h5 className="dashboard_number_small">₹ 2,500</h5>
                      </div>
                    </div>
                    <div className="payment_single my_big_card">
                      <div className="icon bg_green">
                        <img src="./assets/img/electricity-bill.png" alt="" />
                      </div>
                      <div className="right">
                        <h6 className="r14 text_grey">Electricity Bill</h6>
                        <h5 className="dashboard_number_small">₹ 875</h5>
                      </div>
                    </div>
                    <div className="payment_single my_big_card">
                      <div className="icon bg_orange">
                        <img src="./assets/img/brokreage_bill_icon.png" alt="" />
                      </div>
                      <div className="right">
                        <h6 className="r14 text_grey">Society Maintainance</h6>
                        <h5 className="dashboard_number_small">₹ 2,000</h5>
                      </div>
                    </div>
                    <div className="payment_single my_big_card">
                      <div className="icon bg_blue">
                        <img src="./assets/img/financial.png" alt="" />
                      </div>
                      <div className="right">
                        <h6 className="r14 text_grey">Water Bill</h6>
                        <h5 className="dashboard_number_small">₹ 75</h5>
                      </div>
                    </div>
                    <div className="payment_single my_big_card">
                      <div className="icon bg_green">
                        <img src="./assets/img/electricity-bill.png" alt="" />
                      </div>
                      <div className="right">
                        <h6 className="r14 text_grey">Others</h6>
                        <h5 className="dashboard_number_small">₹ 875</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </section>            
              <div className="vg22"></div>
              <hr />
              <div className="vg22"></div>
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

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PGOwnerDashboard;
