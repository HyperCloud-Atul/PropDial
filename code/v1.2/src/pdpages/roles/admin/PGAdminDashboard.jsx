import React from "react";
import { useState, useEffect } from "react";
import LinearProgressBar from "../../../pages/roles/owner/LinearProgressBar";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useCollection } from "../../../hooks/useCollection";
import { Navigate, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// owl carousel
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
// owl carousel

// component
import PropertyCard from "../../../components/property/PropertyCard";
import MyLineGraph from "../../graphs/MyLineGraph";
import MyColumnChart from "../../graphs/MyColumnChart";
import MyPieChart from "../../graphs/MyPieChart";
import CircularProgressBar from "../../../pages/roles/admin/CircularProgressBar";

// css
import "./PGAdminDashboard.scss";

const PGAdminDashboard = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const { user } = useAuthContext();
  // const { documents: properties, error: propertieserror } =
  //   useCollection("properties", ["postedBy", "==", "Propdial"]);

  const { documents: properties, error: propertieserror } = useCollection(
    "properties",
    ["postedBy", "==", "Propdial"],
    ["createdAt", "desc"]
  );

  let totalProperties = "50";
  // let activeProperties = "0";
  let availableForRentProperties = "25";
  let availableForSaleProperties = "10";
  let rentedoutProperties = "12";
  let soldoutProperties = "3";
  // let residentialProperties = "0";
  // let commercialProperties = "0";

  const activeProperties =
    properties &&
    properties.filter(
      (item) => item.isActiveInactiveReview.trim().toUpperCase() === "ACTIVE"
    );

  const pendingProperties =
    properties &&
    properties.filter(
      (item) => item.isActiveInactiveReview.trim().toUpperCase() === "IN-REVIEW"
    );

  const inactiveProperties =
    properties &&
    properties.filter(
      (item) => item.isActiveInactiveReview.trim().toUpperCase() === "INACTIVE"
    );

  const residentialProperties =
    properties &&
    properties.filter(
      (item) => item.category.trim().toUpperCase() === "RESIDENTIAL"
    );

  // commercialProperties
  const commercialProperties =
    properties &&
    properties.filter(
      (item) => item.category.trim().toUpperCase() === "COMMERCIAL"
    );

  //State Wise Properties
  const chandigarhProperties =
    properties &&
    properties.filter(
      (item) => item.state.trim().toUpperCase() === "CHANDIGARH"
    );

  const delhiProperties =
    properties &&
    properties.filter((item) => item.state.trim().toUpperCase() === "DELHI");

  const goaProperties =
    properties &&
    properties.filter((item) => item.state.trim().toUpperCase() === "GOA");

  const gujaratProperties =
    properties &&
    properties.filter(
      (item) =>
        item.state.trim().toUpperCase() === "GUJARAT" ||
        item.state.trim().toUpperCase() === "GUJRAT"
    );

  const haryanaProperties =
    properties &&
    properties.filter((item) => item.state.trim().toUpperCase() === "HARYANA");

  const karnatakaProperties =
    properties &&
    properties.filter(
      (item) => item.state.trim().toUpperCase() === "KARNATAKA"
    );

  const maharashtraProperties =
    properties &&
    properties.filter(
      (item) =>
        item.state.trim().toUpperCase() === "MAHARASHTRA" ||
        item.state.trim().toUpperCase() === "MAHARASTRA"
    );

  const rajasthanProperties =
    properties &&
    properties.filter(
      (item) => item.state.trim().toUpperCase() === "RAJASTHAN"
    );

  const tamilnaduProperties =
    properties &&
    properties.filter(
      (item) =>
        item.state.trim().toUpperCase() === "TAMILNADU" ||
        item.state.trim().toUpperCase() === "TAMIL NADU"
    );

  const telanganaProperties =
    properties &&
    properties.filter(
      (item) => item.state.trim().toUpperCase() === "TELANGANA"
    );

  const uttarpradeshProperties =
    properties &&
    properties.filter(
      (item) =>
        item.state.trim().toUpperCase() === "UTTARPRADESH" ||
        item.state.trim().toUpperCase() === "UTTAR PRADESH"
    );

  const uttarakhandProperties =
    properties &&
    properties.filter(
      (item) =>
        item.state.trim().toUpperCase() === "UTTARAKHAND" ||
        item.state.trim().toUpperCase() === "UTTARA KHAND"
    );

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


  const searchPropertiesByFilter = (filterOption) => {
    // console.log("Filter Option: ", filterOption)

    switch (filterOption.toUpperCase()) {
      case "IN-REVIEW":
        console.log("In-Review Properties: ", pendingProperties)
        navigate("/allproperties/" + filterOption);
        return true;
      case "ACTIVE":
        return true;
      default:
        return true;

    }

  }

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
      {/* 9 dots html  */}
      <Link
        to="/newproperty"
        className="property-list-add-property with_9dot"
      >
        <span class="material-symbols-outlined">add</span>
      </Link>
      <div onClick={openMoreAddOptions} className="property-list-add-property">
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
            <span class="material-symbols-outlined">real_estate_agent</span>
          </Link>
        </div>
      </div>
      {/* 9 dots html  */}
      <div className="top_header_pg pg_bg propagent_dashboard">
        <div className="page_spacing">
          <div className="pg_header">
            <h2 className="m22 mb-1">Admin Dashboard</h2>
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

                        <h6>360&deg; Property Management Solutions</h6>
                      </div>
                      <div className="number">
                        {properties && properties.length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-7 bg_575">
                  <div className="vg22_1199"></div>
                  <div className="property_status">
                    <Link to="/allproperties/in-review" className="ps_single pending">
                      <h5>{pendingProperties && pendingProperties.length}</h5>
                      <h6>In-Review</h6>
                    </Link>
                    <Link to="/allproperties/active" className="ps_single active">
                      <h5>{activeProperties && activeProperties.length}</h5>
                      <h6>Active</h6>
                    </Link>
                    <div className="ps_single inactive">
                      <h5>{inactiveProperties && inactiveProperties.length}</h5>
                      <h6>Inactive</h6>
                    </div>
                  </div>
                </div>
              </section>
              <div className="vg22"></div>
              <section className="property_status assign">
                <div className="ps_single one">
                  <h5>5</h5>
                  <h6>Not Assign To <br /> Owner </h6>
                </div>
                <div className="ps_single two">
                  <h5>8</h5>
                  <h6>Not Assign To <br /> Manager </h6>
                </div>
                <div className="ps_single three">
                  <h5>2</h5>
                  <h6>Not Assign To <br /> Tenant </h6>
                </div>
                <div className="ps_single four">
                  <h5>{residentialProperties &&
                    residentialProperties.length}</h5>
                  <h6>Property Category <br /> Residential </h6>
                </div>
                <div className="ps_single five">
                  <h5>{commercialProperties && commercialProperties.length}</h5>
                  <h6>Property Category <br /> Commercial </h6>
                </div>
              </section>
              {/* <div className="vg22"></div>
              <section className="upcoming">
                <div className="parent">
                  <div className="">
                    <div className="child">
                      <div className="inner">
                        <h5>
                          {residentialProperties &&
                            residentialProperties.length}
                        </h5>
                        <h6>Residential</h6>
                      </div>
                      <div className="dots bottom">
                        <img src="/assets/img/icons/dots.png" alt="" />
                      </div>
                      <div className="dots top">
                        <img src="/assets/img/icons/dots.png" alt="" />
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="child">
                      <div className="inner">
                        <h5>
                          {commercialProperties && commercialProperties.length}
                        </h5>
                        <h6>Commercial</h6>
                      </div>
                      <div className="dots bottom">
                        <img src="/assets/img/icons/dots.png" alt="" />
                      </div>
                      <div className="dots top">
                        <img src="/assets/img/icons/dots.png" alt="" />
                      </div>
                    </div>
                  </div>
                  <div className="coming_soon">
                    <div className="child">
                      <div className="inner">
                        <h5>0</h5>
                        <h6>Upcoming Inspections</h6>
                      </div>
                      <div className="dots bottom">
                        <img src="/assets/img/icons/dots.png" alt="" />
                      </div>
                      <div className="dots top">
                        <img src="/assets/img/icons/dots.png" alt="" />
                      </div>
                    </div>
                  </div>
                  <div className="coming_soon">
                    <div className="child">
                      <div className="inner">
                        <h5>0</h5>
                        <h6>Upcoming Rent Renewal</h6>
                      </div>
                      <div className="dots bottom">
                        <img src="/assets/img/icons/dots.png" alt="" />
                      </div>
                      <div className="dots top">
                        <img src="/assets/img/icons/dots.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </section> */}
              <div className="vg22"></div>
              <section className="self_property_detail">
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
                <div className="spd_single">
                  <div className="left residential">
                    <img src="/assets/img/house.png" alt="" />
                  </div>
                  <div className="right">
                    <h6>Rent or Sale</h6>
                    <h5>5</h5>
                  </div>
                </div>
                <div className="spd_single">
                  <div className="left commercial">
                    <img src="/assets/img/buildings.png" alt="" />
                  </div>
                  <div className="right">
                    <h6>Rented But Sale</h6>
                    <h5>6</h5>
                  </div>
                </div>
                <div className="spd_single">
                  <div className="left commercial">
                    <img src="/assets/img/buildings.png" alt="" />
                  </div>
                  <div className="right">
                    <h6>PMS Only</h6>
                    <h5>6</h5>
                  </div>
                </div>
              </section>
              <div className="vg22"></div>
              <div className="row">
                <div className="col-lg-6">

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
                      <div className="left col-6">
                        <div className="pi_cities_single mt-4">
                          <h6>Chandigarh</h6>
                          <h5>
                            {chandigarhProperties &&
                              chandigarhProperties.length > 0
                              ? chandigarhProperties.length
                              : "0"}
                          </h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width:
                                  ((chandigarhProperties &&
                                    chandigarhProperties.length) /
                                    (properties && properties.length)) *
                                  100,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Delhi</h6>
                          <h5>
                            {delhiProperties && delhiProperties.length > 0
                              ? delhiProperties.length
                              : "0"}
                          </h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width:
                                  ((delhiProperties && delhiProperties.length) /
                                    (properties && properties.length)) *
                                  100,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Goa</h6>
                          <h5>
                            {goaProperties && goaProperties.length > 0
                              ? goaProperties.length
                              : "0"}
                          </h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width:
                                  ((goaProperties && goaProperties.length) /
                                    (properties && properties.length)) *
                                  100,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Gujarat</h6>
                          <h5>
                            {gujaratProperties && gujaratProperties.length > 0
                              ? gujaratProperties.length
                              : "0"}
                          </h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width:
                                  ((gujaratProperties &&
                                    gujaratProperties.length) /
                                    (properties && properties.length)) *
                                  100,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Haryana</h6>
                          <h5>
                            {haryanaProperties && haryanaProperties.length > 0
                              ? haryanaProperties.length
                              : "0"}
                          </h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width:
                                  ((haryanaProperties &&
                                    haryanaProperties.length) /
                                    (properties && properties.length)) *
                                  100,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="pi_cities_single mt-4">
                          <h6>Karnataka</h6>
                          <h5>
                            {karnatakaProperties &&
                              karnatakaProperties.length > 0
                              ? karnatakaProperties.length
                              : "0"}
                          </h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width:
                                  ((karnatakaProperties &&
                                    karnatakaProperties.length) /
                                    (properties && properties.length)) *
                                  100,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="right col-6">
                        <div className="pi_cities_single mt-4">
                          <h6>Maharashtra</h6>
                          <h5>
                            {maharashtraProperties &&
                              maharashtraProperties.length > 0
                              ? maharashtraProperties.length
                              : "0"}
                          </h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width:
                                  ((maharashtraProperties &&
                                    maharashtraProperties.length) /
                                    (properties && properties.length)) *
                                  100,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="pi_cities_single mt-4">
                          <h6>Rajasthan</h6>
                          <h5>
                            {rajasthanProperties &&
                              rajasthanProperties.length > 0
                              ? rajasthanProperties.length
                              : "0"}
                          </h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width:
                                  ((rajasthanProperties &&
                                    rajasthanProperties.length) /
                                    (properties && properties.length)) *
                                  100,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Tamilnadu</h6>
                          <h5>
                            {tamilnaduProperties &&
                              tamilnaduProperties.length > 0
                              ? tamilnaduProperties.length
                              : "0"}
                          </h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width:
                                  ((tamilnaduProperties &&
                                    tamilnaduProperties.length) /
                                    (properties && properties.length)) *
                                  100,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Talangana</h6>
                          <h5>
                            {telanganaProperties &&
                              telanganaProperties.length > 0
                              ? telanganaProperties.length
                              : "0"}
                          </h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width:
                                  ((telanganaProperties &&
                                    telanganaProperties.length) /
                                    (properties && properties.length)) *
                                  100,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Uttar Pradesh</h6>
                          <h5>
                            {uttarpradeshProperties &&
                              uttarpradeshProperties.length > 0
                              ? uttarpradeshProperties.length
                              : "0"}
                          </h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width:
                                  ((uttarpradeshProperties &&
                                    uttarpradeshProperties.length) /
                                    (properties && properties.length)) *
                                  100,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pi_cities_single mt-4">
                          <h6>Uttrakhand</h6>
                          <h5>
                            {uttarakhandProperties &&
                              uttarakhandProperties.length > 0
                              ? uttarakhandProperties.length
                              : "0"}
                          </h5>
                          <div className="bar">
                            <div
                              className="bar_fill"
                              style={{
                                width:
                                  ((uttarakhandProperties &&
                                    uttarakhandProperties.length) /
                                    (properties && properties.length)) *
                                  100,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="vg22_991"></div>
                  <section style={{
                    display: "grid",
                    gap: "22px"
                  }}>
                    <CircularProgressBar
                      rentProperties={availableForRentProperties}
                      saleProperties={availableForSaleProperties}
                      rentedoutProperties={rentedoutProperties}
                      soldoutProperties={soldoutProperties}
                      // commercialProperties={commercialProperties}
                      // residentialProperties={residentialProperties}
                      totalProperties={totalProperties}
                    />
                    <Link
                      className="theme_btn btn_fill text-center no_icon"
                      to="/newproperty"
                    >
                      Add New Property
                    </Link>
                    <Link
                      className="theme_btn btn_fill text-center no_icon"
                      to="/allproperties/all"
                    >
                      View All Properties
                    </Link>
                  </section>
                </div>
              </div>

              <div className="vg22"></div>



              {/* <section className="property_cards_parent">
                {properties &&
                  properties.map((property) => (
                    <PropertyCard propertyid={property.id} />
                  ))}
              </section> */}

              {/* <>
                <div className="vg22"></div>
                <hr />
                <div className="vg22"></div>
                <div className="filters">
                  <div className="button_filter">
                    <div className="bf_single active">
                      April
                    </div>
                    <div className="bf_single ">
                      March
                    </div>
                    <div className="bf_single ">
                      February
                    </div>
                  </div>
                  <div className="icon_dropdown">
                    <select name="months" id="months">
                      <option value="" selected disabled>Select Month</option>
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>

                  </div>
                </div>
                <div className="vg22"></div>
                <section>
                  <div className="payment_card">
                    <div className="top">
                      <div className="left">
                        <h4 className="m20 text_grey">Payments</h4>
                        <h2 className="dashboard_number mt10">8,052</h2>
                      </div>
                      <div className="right"></div>
                    </div>
                    <div className="all_payments">
                      <div className="payment_single my_big_card">
                        <div className="icon bg_orange">
                          <img
                            src="./assets/img/brokreage_bill_icon.png"
                            alt=""
                          />
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
                          <img
                            src="./assets/img/brokreage_bill_icon.png"
                            alt=""
                          />
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
                <section className="graphs">
                  <div className="graph_single">
                    <MyLineGraph />
                  </div>
                  <div className="graph_single">
                    <MyColumnChart />
                  </div>
                  <div className="graph_single">
                    <MyPieChart />
                  </div>


                </section>
                <div className="vg22"></div>
                <hr />
              </> */}

              {/* <div className="vg22"></div> */}
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

export default PGAdminDashboard;
