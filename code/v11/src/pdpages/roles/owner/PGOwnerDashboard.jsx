import React from "react";

import { useState, useEffect } from "react";
import LinearProgressBar from "../../../pages/roles/owner/LinearProgressBar";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useCollection } from "../../../hooks/useCollection";
import { useFirestore } from "../../../hooks/useFirestore";
import { projectStorage, projectFirestore } from "../../../firebase/config";

import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";

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
  // console.log('user: ', user)
  const { documents: myproperties, error: errMyProperties } = useCollection(
    "propertyusers",
    ["userId", "==", user.uid]
  );

  // console.log('myproperties: ', myproperties)

  const { documents: properties, error: propertieserror } = useCollection("properties");
  // const { documents: properties, error: propertieserror } = useCollection(
  //   "properties",
  //   ["access", "array-contains", user.uid]
  // );


  const filteredproperties = myproperties && myproperties.map((doc) => (
    properties && properties.filter(propdoc => propdoc.id === doc.propertyId)
  ))

  // console.log('filteredproperties: ', filteredproperties)

  // const activeProperties =
  //   filteredproperties && filteredproperties.map((propdoc) => (
  //     console.log('active properties prop doc: ', propdoc)
  //     // propdoc.filter((item) => item.isActiveInactiveReview.toUpperCase() === 'ACTIVE')
  //   ))

  const activeProperties =
    filteredproperties && filteredproperties.map((propdoc) => (
      propdoc[0].isActiveInactiveReview.toUpperCase() === 'ACTIVE' ? propdoc[0] : null
    ))

  const activePropertieslengthWithoutNulls = activeProperties && activeProperties.filter(element => element !== null).length;

  const pendingProperties =
    filteredproperties && filteredproperties.map((propdoc) => (
      propdoc[0].isActiveInactiveReview.toUpperCase() === 'IN-REVIEW' ? propdoc[0] : null
    ))

  const pendingPropertieslengthWithoutNulls = pendingProperties && pendingProperties.filter(element => element !== null).length;
  // console.log('pendingPropertieslengthWithoutNulls: ', pendingPropertieslengthWithoutNulls)

  const inactiveProperties =
    filteredproperties && filteredproperties.map((propdoc) => (
      propdoc[0].isActiveInactiveReview.toUpperCase() === 'INACTIVE' ? propdoc[0] : null
    ))

  const inactivePropertieslengthWithoutNulls = inactiveProperties && inactiveProperties.filter(element => element !== null).length;

  // const inactiveProperties =
  //   filteredproperties && filteredproperties[0].filter((item) => item.isActiveInactiveReview.toUpperCase() === 'INACTIVE');

  const residentialProperties =
    filteredproperties && filteredproperties.map((propdoc) => (
      propdoc[0].category.toUpperCase() === 'RESIDENTIAL' ? propdoc[0] : null
    ))

  const residentialPropertieslengthWithoutNulls = residentialProperties && residentialProperties.filter(element => element !== null).length;

  // commercialProperties
  const commercialProperties =
    filteredproperties && filteredproperties.map((propdoc) => (
      propdoc[0].category.toUpperCase() === 'COMMERCIAL' ? propdoc[0] : null
    ))
  const commercialPropertieslengthWithoutNulls = commercialProperties && commercialProperties.filter(element => element !== null).length;

  // const commercialProperties =
  //   filteredproperties && filteredproperties[0].filter((item) => item.category.toUpperCase() === 'COMMERCIAL');

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
                      <div className="number">{myproperties && myproperties.length}</div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-7 bg_575">
                  <div className="vg22_1199"></div>
                  <div className="property_status">
                    <div className="ps_single pending">
                      <h5>{pendingProperties && pendingPropertieslengthWithoutNulls}</h5>
                      <h6>In-Review</h6>
                    </div>
                    <div className="ps_single active">
                      <h5>{activeProperties && activePropertieslengthWithoutNulls}</h5>
                      <h6>Active</h6>
                    </div>
                    <div className="ps_single inactive">
                      <h5>{inactiveProperties && inactivePropertieslengthWithoutNulls}</h5>
                      <h6>Inactive</h6>
                    </div>
                  </div>
                </div>
              </section>          
         
              <div className="vg22"></div>
              <section className="self_property_detail">
                <div className="spd_single">
                  <div className="left residential">
                    <img src="/assets/img/house.png" alt="" />
                  </div>
                  <div className="right">
                    <h6>Residential</h6>
                    <h5>{residentialProperties && residentialPropertieslengthWithoutNulls}</h5>
                  </div>
                </div>
                <div className="spd_single">
                  <div className="left commercial">
                    <img src="/assets/img/buildings.png" alt="" />
                  </div>
                  <div className="right">
                    <h6>Commercial</h6>
                    <h5>{commercialProperties && commercialPropertieslengthWithoutNulls}</h5>
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
             <div className="vg12"></div>
              <div className="vg22"></div>
              <section className="property_cards_parent">
                {myproperties && myproperties.map((property) => (
                  <PropertyCard propertyid={property.propertyId} />))}
              </section>
         {/* <>
         <div className="vg22"></div>
              <hr />

              <div className="vg22"></div>
              <section>
                <div className="row">
                  <div className="col-md-6">
                    <div className="payment_card">                      
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
                  </div>
                  <div className="col-md-6">
                    <div className="balance_sheet my_big_card">
                      <Table responsive="sm">
                        <thead>
                          <tr>
                            <th>S.N.</th>
                            <th>Property Details</th>
                            <th>Remark</th>
                            <th>Pay Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>G-25 | mp-nagar | kanipura road | ujjain</td>
                            <td>On-boarding Charges</td>
                            <td>2000</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>G-25 | mp-nagar | kanipura road | ujjain</td>
                            <td>On-boarding Charges</td>
                            <td>2000</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>G-25 | mp-nagar | kanipura road | ujjain</td>
                            <td>On-boarding Charges</td>
                            <td>2000</td>
                          </tr>

                        </tbody>
                      </Table>
                      <div className="text-end">
                        <Link className="click_text" to="/payment">
                          view more
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <div className="vg22"></div>
              <hr />
         </> */}

              <div className="vg22"></div>
              <section className="add_section row">
                <div className="add_single col-lg-6">
                  <OwlCarousel className="owl-theme" {...addImgOptions2}>
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
                <div className="add_single col-lg-6 add_single_2">
                  <OwlCarousel className="owl-theme" {...addImgOptions}>
                    <div className="item">
                      <img
                        src="/assets/img/banner4.png"
                        alt=""
                        className="add_img"
                      />
                    </div>
                    <div className="item">
                      <img
                        src="/assets/img/banner5.png"
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
