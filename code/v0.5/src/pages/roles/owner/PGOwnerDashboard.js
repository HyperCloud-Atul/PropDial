import { useCollection } from "../../../hooks/useCollection";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";
import OwlCarousel from "react-owl-carousel";
import { Link, useLocation } from "react-router-dom";

// components
import Filters from "../../../Components/Filters";
import PropertyList from "../../../Components/PropertyList";
import LeftSidebar from "../../../Components/LeftSidebar";
import PropertyDetail from "../../../Components/PropertyDetail";

// styles
// import './UserDashboard.css'
const propertyFilter = ["ALL", "RESIDENTIAL", "COMMERCIAL", "INACTIVE"];

export default function PGOwnerDashboard() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes en
  const { user } = useAuthContext();
  const { logout, isPending } = useLogout();
  const { documents: propertiesdocuments, error: propertieserror } =
    useCollection("properties");

  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    let flag = ((user && user.role === "owner") || (user && user.role === "coowner"));
    // if ((user && user.role === "owner") || (user && user.role === "coowner"))
    // flag = true;
    if (!flag) {
      logout();
    }
  }, [user, logout]);

  const servicesOptions = {
    items: 6,
    dots: false,
    loop: true,
    margin: 25,
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
        items: 2,
      },
      992: {
        items: 6,
      },
    },
  };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const properties = propertiesdocuments
    ? propertiesdocuments.filter((document) => {
      let filteredProperty = false;
      switch (filter) {
        case "ALL":
          // document.taggedUsersList.forEach((u) => {
          //   if (u.id === user.uid) {
          //     filteredProperty = true;
          //   }
          // });

          document.ownerDetails.id === user.uid ? filteredProperty = true : filteredProperty = false;

          return filteredProperty;
        case "RESIDENTIAL":
          // document.taggedUsersList.forEach((u) => {
          //   if (
          //     u.id === user.uid &&
          //     document.category.toUpperCase() === "RESIDENTIAL"
          //   ) {
          //     filteredProperty = true;
          //   }
          // });

          document.ownerDetails.id === user.uid &&
            document.category.toUpperCase() === "RESIDENTIAL" ? filteredProperty = true : filteredProperty = false;

          return filteredProperty;
        case "COMMERCIAL":
          // document.taggedUsersList.forEach((u) => {
          //   if (
          //     u.id === user.uid &&
          //     document.category.toUpperCase() === "COMMERCIAL"
          //   ) {
          //     filteredProperty = true;
          //   }
          // });
          document.ownerDetails.id === user.uid &&
            document.category.toUpperCase() === "COMMERCIAL" ? filteredProperty = true : filteredProperty = false;

          return filteredProperty;
        case "INACTIVE":
          // document.taggedUsersList.forEach((u) => {
          //   if (
          //     u.id === user.uid &&
          //     document.status.toUpperCase() === "INACTIVE"
          //   ) {
          //     filteredProperty = true;
          //   }
          // });

          document.ownerDetails.id === user.uid &&
            document.status.toUpperCase() === "INACTIVE" ? filteredProperty = true : filteredProperty = false;

          return filteredProperty;
        default:
          return true;
      }
    })
    : null;


  return (

    <div className="pgadmindasboard pgls_mobile aflbg" >
      <div className="dashboard_pg pg_width">

        <LeftSidebar />

        <div className="right_main_content">
          <section>
            <br />
            <div className="row no-gutters">
              <div className="col-lg-3 col-md-3 relative" style={{ padding: "15px" }}>
                <Link to="/pgpropertylist" className="admin-property-count-card">
                  <div className="">
                    <h1>80623</h1>
                    <div className="rent-sale-div">
                      <h3 className="rent-span">Rent (579)</h3>
                      <h3 className="sale-span">Sale (790)</h3>
                    </div>
                  </div>
                  <div className="">
                    <span className="material-symbols-outlined">
                      home_work
                    </span>
                  </div>
                  <div
                    className="admin_card_bottom">
                    <h2>Properties</h2>
                  </div>
                </Link>
                {/* <div style={{
              position:"absolute",
              top:"0",
              right:"20%"
            }} 
            className="progress-circle">

              <div className="c100 p50 big">
                <span>63+</span>
                <div className="slice">
                  <div className="bar"></div>
                  <div className="fill"></div>
                </div>
              </div>

            </div> */}
              </div>
              <div className="col-lg-3 col-md-3 relative" style={{ padding: "15px" }}>
                <Link to="/users" className="admin-property-count-card">
                  <div className="">
                    <h1>1,504</h1>
                    <div className="rent-sale-div">
                      <h3 className="rent-span">Rent (579)</h3>
                      <h3 className="sale-span">Sale (790)</h3>
                    </div>
                  </div>
                  <div className="">
                    <span className="material-symbols-outlined">
                      person
                    </span>
                  </div>
                  <div
                    className="admin_card_bottom">
                    <h2>Owners</h2>
                  </div>
                </Link>
              </div>
              <div className="col-lg-3 col-md-3 relative" style={{ padding: "15px" }}>
                <Link to="/users" className="admin-property-count-card">
                  <div className="">
                    <h1>1,235</h1>
                    <div className="rent-sale-div">
                      <h3>This month : 24</h3>
                    </div>
                  </div>
                  <div className="">
                    <span className="material-symbols-outlined">
                      hail
                    </span>
                  </div>
                  <div
                    className="admin_card_bottom">
                    <h2>Tenents</h2>
                  </div>
                </Link>
              </div>
              <div className="col-lg-3 col-md-3 relative" style={{ padding: "15px" }}>
                <div className="admin-property-count-card">
                  <div className="">
                    <h1>₹29,036</h1>
                    <div className="rent-sale-div">
                      <h3>New : 67</h3>
                    </div>
                  </div>
                  <div className="">
                    <span className="material-symbols-outlined">
                      payments
                    </span>
                  </div>
                  <div

                    className="admin_card_bottom">
                    <h2>Projected</h2>
                  </div>
                </div>
              </div>
            </div>
            <br />
          </section>
          <section className="admin_services_cards">
            <OwlCarousel className="owl-theme" {...servicesOptions}>
              <div className="item asc_single ">
                <center>
                  <span class="material-symbols-outlined">
                    groups
                  </span>
                  <h6>12749</h6>
                  <h5>Tenant List</h5>
                </center>
              </div>
              <div className="item asc_single ">
                <center>
                  <span class="material-symbols-outlined">
                    bedroom_parent
                  </span>
                  <h6>2617</h6>
                  <h5>Rent</h5>
                </center>
              </div>
              <div className="item asc_single ">
                <center>
                  <span class="material-symbols-outlined">
                    real_estate_agent
                  </span>
                  <h6>1824</h6>
                  <h5>Sale</h5>
                </center>
              </div>
              <div className="item asc_single ">
                <center>
                  <span class="material-symbols-outlined">
                    group_work
                  </span>
                  <h6>182</h6>
                  <h5>Both</h5>
                </center>
              </div>
              <div className="item asc_single ">
                <center>
                  <span class="material-symbols-outlined">
                    apartment
                  </span>
                  <h6>12</h6>
                  <h5>City List</h5>
                </center>
              </div>
              <div className="item asc_single ">
                <center>
                  <span class="material-symbols-outlined">
                    reduce_capacity
                  </span>
                  <h6>29</h6>
                  <h5>Employee List</h5>
                </center>
              </div>
              <div className="item asc_single ">
                <center>
                  <span class="material-symbols-outlined">
                    support_agent
                  </span>
                  <h6>10</h6>
                  <h5>Agent List</h5>
                </center>
              </div>
              <div className="item asc_single ">
                <center>
                  <span class="material-symbols-outlined">
                    event_available
                  </span>
                  <h5>Holiday List</h5>
                </center>
              </div>
            </OwlCarousel>
          </section>
          <br />
          <section>
            <div className="row no-gutters">
              <div
                className="col-lg-6 col-md-12 col-sm-12"
                style={{ padding: "10px" }}
              >
                <div className="default-card">
                  <div className="default-card-inner">
                    <div>
                      <h6>PMS Due</h6>
                      <h1 style={{ color: "var(--red-color)" }}>₹42000</h1>
                      <h3>Cut-off Date : 12 Jun'23</h3>
                      {/* <h4>Due Date Exceeded : ₹100</h4> */}
                    </div>
                    <div>
                      <h6>Property</h6>
                      <h3 style={{ color: "var(--theme-blue)" }}>D2-201 & A-504</h3>
                    </div>
                  </div>
                  <div className="default-card-inner">
                    <button className="btn info">Details</button>
                    <button className="btn">Pay Now</button>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-6 col-md-12 col-sm-12"
                style={{ padding: "10px" }}
              >
                <div className="default-card">
                  <div className="default-card-inner">
                    <div>
                      <h6>Brokerage Billing</h6>
                      <h1 style={{ color: "var(--red-color)" }}>₹2000</h1>
                      <h3>Cut-off Date : 12 Jun'23</h3>
                      {/* <h4>Due Date Exceeded : ₹100</h4> */}
                    </div>
                    <div>
                      <h6>Property</h6>
                      <h3 style={{ color: "var(--theme-blue)" }}>D2-201 & A-504</h3>
                    </div>
                  </div>
                  <div className="default-card-inner">
                    <button className="btn info">Details</button>
                    <button className="btn">Pay Now</button>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-6 col-md-12 col-sm-12"
                style={{ padding: "10px" }}
              >
                <div className="default-card">
                  <div className="default-card-inner">
                    <div>
                      <h6>Maintenance Billing</h6>
                      <h1 style={{ color: "var(--red-color)" }}>₹12000</h1>
                      <h3>Cut-off Date : 12 Jun'23</h3>
                      {/* <h4>Due Date Exceeded : ₹100</h4> */}
                    </div>
                    <div>
                      <h6>Property</h6>
                      <h3 style={{ color: "var(--theme-blue)" }}>D2-201 & A-504</h3>
                    </div>
                  </div>
                  <div className="default-card-inner">
                    <button className="btn info">Details</button>
                    <button className="btn">Pay Now</button>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-6 col-md-12 col-sm-12"
                style={{ padding: "10px" }}
              >
                <div className="default-card">
                  <div className="default-card-inner">
                    <div>
                      <h6>Sale Registration Advance or Registration Dues</h6>
                      <h1 style={{ color: "var(--red-color)" }}>₹15000</h1>
                      <h3>Cut-off Date : 12 Jun'23</h3>
                      {/* <h4>Due Date Exceeded : ₹100</h4> */}
                    </div>
                    <div>
                      <h6>Property</h6>
                      <h3 style={{ color: "var(--theme-blue)" }}>D2-201 & A-504</h3>
                    </div>
                  </div>
                  <div className="default-card-inner">
                    <button className="btn info">Details</button>
                    <button className="btn">Pay Now</button>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-6 col-md-12 col-sm-12"
                style={{ padding: "10px" }}
              >
                <div className="tenant-dashboard-ticket-card">
                  <div className="ticket-round-left"></div>
                  <div className="ticket-round-right"></div>
                  <h1 className="tenant-dashboard-ticket-card-heading">Tickets</h1>
                  <hr />
                  <div className="tenant-dashboard-ticket-card-content">
                    <div>
                      <h1>Pending Tickets</h1>
                      <h2>10</h2>
                      <h3>Last Raised Date</h3>
                      <h4>15 Jan 2023</h4>
                    </div>
                    <div>
                      <h1>Closed Tickets</h1>
                      <h2>30</h2>
                      <button className="mybutton button5">Raise Ticket</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div>
              <div className="page-title">
                <span className="material-symbols-outlined">real_estate_agent</span>
                <h1>Properties </h1>
              </div>
              {propertieserror && <p className="error">{propertieserror}</p>}
              {/* {billserror && <p className="error">{billserror}</p>} */}
              {propertiesdocuments && (
                <Filters
                  changeFilter={changeFilter}
                  filterList={propertyFilter}
                  filterLength={properties.length}
                />
              )}
              {/* {billsdocuments && <Filters changeFilter={changeFilter} />} */}

              {properties && <PropertyList properties={properties} />}

              {/* {bills && <BillList bills={bills} />} */}
              <br></br>
              <div className="property_card_left">
                {propertiesdocuments && <PropertyDetail propertiesdocuments={propertiesdocuments} />}
              </div>
            </div>
          </section>





          <section style={{ display: "none" }}>
            <div className="row no-gutters">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="profile-card-div" style={{ background: "#ff5757" }}>
                  <div className="address-div" style={{ padding: "8px 10px 4px 10px;" }}>
                    <div className="icon" style={{ background: "#fff" }}>
                      <span className="material-symbols-outlined">
                        money_off
                      </span>
                    </div>

                    <div className="address-text">
                      <div style={{ textAlign: "left", position: "relative", top: "-1px" }}>
                        <h5 style={{ color: "#fff", fontWeight: "bold" }}>PMS Due</h5>
                        <h5 style={{ margin: "0", fontSize: "0.8rem", color: "#dedede" }}>152</h5>
                      </div>
                      <div className="" style={{ position: "relative", top: "-6px" }}>
                        <h6 style={{ margin: "0", fontSize: "1.4rem", fontWeight: "600", color: "#fff" }}>₹84,538
                        </h6>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="profile-card-div" style={{ background: "#ff5757" }}>
                  <div className="address-div" style={{ padding: "8px 10px 4px 10px" }}>
                    <div className="icon" style={{ background: "#fff" }}>
                      <span className="material-symbols-outlined">
                        key_off
                      </span>
                    </div>

                    <div className="address-text">
                      <div style={{ textAlign: "left", position: "relative", top: "-1px" }}>
                        <h5 style={{ color: "#fff", fontWeight: "bold" }}>Brokerage Due</h5>
                        <h5 style={{ margin: "0", fontSize: "0.8rem", color: "#dedede" }}>10</h5>
                      </div>
                      <div className="" style={{ position: "relative", top: "-6px" }}>
                        <h6 style={{ margin: "0", fontSize: "1.4rem", fontWeight: "600", color: "#ededed" }}>₹845</h6>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="profile-card-div" style={{ background: "#ff5757" }}>
                  <div className="address-div" style={{ padding: "8px 10px 4px 10px" }}>
                    <div className="icon" style={{ background: "rgba(84,204,203, 0.8)", background: "#fff" }}>
                      <span className="material-symbols-outlined">
                        no_stroller
                      </span>
                    </div>

                    <div className="address-text">
                      <div style={{ textAlign: "left", position: "relative", top: "-1px" }}>
                        <h5 style={{ color: "#fff", fontWeight: "bold" }}>Maintenance Due</h5>
                        <h5 style={{ margin: "0", fontSize: "0.8rem", color: "#dedede" }}>167</h5>
                      </div>
                      <div className="" style={{ position: "relative", top: "-6px" }}>
                        <h6 style={{ margin: "0", fontSize: "1.4rem", fontWeight: "600", color: "#ededed" }}>₹1,68,069
                        </h6>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="profile-card-div" style={{ background: "#ff5757" }}>
                  <div className="address-div" style={{ padding: "8px 10px 4px 10px" }}>
                    <div className="icon" style={{ background: "#fff" }}>
                      <span className="material-symbols-outlined">
                        local_library
                      </span>
                    </div>

                    <div className="address-text">
                      <div style={{ textAlign: "left", position: "relative", top: "-1px" }}>
                        <h5 style={{ color: "#fff", fontWeight: "bold" }}>Maintenance Advance</h5>
                        <h5 style={{ margin: "0", fontSize: "0.8rem", color: "#dedede" }}>147</h5>
                      </div>
                      <div className="" style={{ position: "relative", top: "-6px" }}>
                        <h6 style={{ margin: "0", fontSize: "1.4rem", fontWeight: "600", color: "#ededed" }}>₹1,683
                        </h6>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="row no-gutters">
                  <div className="col-6" style={{ padding: "10px" }}>

                    <div className="dashboard-square-card">
                      <div>
                        <h1>216</h1>
                        <h2>For Rent</h2>
                      </div>
                    </div>

                  </div>

                  <div className="col-6" style={{ padding: "10px" }}>

                    <div className="dashboard-square-card">
                      <div>
                        <h1>58</h1>
                        <h2>For Sale</h2>
                      </div>
                    </div>

                  </div>

                  <div className="col-6" style={{ padding: "10px" }}>

                    <div className="dashboard-square-card">
                      <div>
                        <h1>64</h1>
                        <h2>Rent Renewal</h2>
                      </div>
                    </div>

                  </div>

                  <div className="col-6" style={{ padding: "10px" }}>

                    <div className="dashboard-square-card">
                      <div>
                        <h1>16</h1>
                        <h2>On Notice</h2>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
            <br />
          </section>
          <br />

        </div>
      </div>
    </div>
  );
}
