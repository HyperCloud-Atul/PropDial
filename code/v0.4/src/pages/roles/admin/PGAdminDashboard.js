import { useCollection } from "../../../hooks/useCollection";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
// import { useNavigate } from 'react-router-dom'
import { useLogout } from "../../../hooks/useLogout";
import { useLocation } from "react-router-dom";

// components
import Filters from "../../../Components/Filters";
import PropertyList from "../../../Components/PropertyList";
import Hero from "../../../Components/Hero";

// styles
import "./PGAdminDashboard.css";
const propertyFilter = ["ALL", "RESIDENTIAL", "COMMERCIAL", "INACTIVE"];
export default function PGAdminDashboard() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const { user } = useAuthContext();
  const { logout, isPending } = useLogout();
  const { documents, error } = useCollection("properties");
  const [filter, setFilter] = useState("all");
  // const navigate = useNavigate();

  useEffect(() => {
    let flag = user && user.role === "admin";
    if (!flag) {
      logout();
    }
  }, [user]);

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const properties = documents
    ? documents.filter((document) => {
      switch (filter) {
        case "ALL":
          return true;
        case "mine":
          let assignedToMe = false;
          document.assignedUsersList.forEach((u) => {
            if (u.id === user.uid) {
              assignedToMe = true;
            }
          });
          return assignedToMe;
        case "RESIDENTIAL":
          return document.category.toUpperCase() === filter;
        case "COMMERCIAL":
          return document.category.toUpperCase() === filter;
        case "INACTIVE":
          // console.log(document.category, filter)
          return document.status.toUpperCase() === filter;
        default:
          return true;
      }
    })
    : null;

  return (
    <div className="pgadmindasboard pgls_mobile" style={{
      background: "#efefef"
    }} >
      <Hero
        pageTitle="Admin Dashboard"
        pageSubTitle="Explore your dashboard
        "
        heroImage="./assets/img/admin_banner.jpg"
      ></Hero>
      <br />
      <div className="container-fluid">
        <div className="large">
          <div className="row no-gutters">
            <div className="col-lg-3 col-md-3 relative" style={{ padding: "15px" }}>
              <a href="addproperty.html" className="admin-property-count-card">
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
              </a>
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
              <div className="admin-property-count-card">
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
              </div>
            </div>
            <div className="col-lg-3 col-md-3 relative" style={{ padding: "15px" }}>
              <div className="admin-property-count-card">
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
              </div>
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

          {/* <div class="container-fluid">
            <div class="row no-gutters">
              <div class="col-lg-6 col-md-6 col-sm-12">

                <div class="profile-card-div" style={{background:"#ff5757"}}>
                  <div class="address-div" style={{padding: "8px 10px 4px 10px;"}}>
                    <div class="icon" style={{background:"#fff"}}>
                      <span class="material-symbols-outlined">
                        money_off
                      </span>
                    </div>

                    <div class="address-text">
                      <div style="text-align: left;position: relative;top: -1px;">
                        <h5 style="color: #fff;font-weight: bold;">PMS Due</h5>
                        <h5 style="margin: 0;font-size: 0.8rem;color: #dedede;">152</h5>
                      </div>
                      <div class="" style="position: relative;top: -6px">
                        <h6 style="margin: 0;font-size:1.4rem;font-weight:600; color:#fff;">₹84,538
                        </h6>
                      </div>
                    </div>
                  </div>

                </div>

                <div class="profile-card-div" style={{background:"#ff5757"}}>
                  <div class="address-div" style={{padding: "8px 10px 4px 10px"}}>
                    <div class="icon" style={{background:"#fff"}}>
                      <span class="material-symbols-outlined">
                        key_off
                      </span>
                    </div>

                    <div class="address-text">
                      <div style="text-align: left;position: relative;top: -1px;">
                        <h5 style="color: #fff;font-weight: bold;">Brokerage Due</h5>
                        <h5 style="margin: 0;font-size: 0.8rem;color: #dedede;">10</h5>
                      </div>
                      <div class="" style="position: relative;top: -6px">
                        <h6 style="margin: 0;font-size:1.4rem;font-weight:600; color:#ededed;">₹845</h6>
                      </div>
                    </div>
                  </div>

                </div>

                <div class="profile-card-div" style= {{background:"#ff5757"}}>
                  <div class="address-div" style={{padding: "8px 10px 4px 10px"}}>
                    <div class="icon" style="background: rgba(84,204,203, 0.8);background: #fff;">
                      <span class="material-symbols-outlined">
                        no_stroller
                      </span>
                    </div>

                    <div class="address-text">
                      <div style="text-align: left;position: relative;top: -1px;">
                        <h5 style="color: #fff;font-weight: bold;">Maintenance Due</h5>
                        <h5 style="margin: 0;font-size: 0.8rem;color: #dedede">167</h5>
                      </div>
                      <div class="" style="position: relative;top: -6px">
                        <h6 style="margin: 0;font-size:1.4rem;font-weight:600; color:#ededed;">₹1,68,069
                        </h6>
                      </div>
                    </div>
                  </div>

                </div>

                <div class="profile-card-div" style= {{background:"#ff5757"}}>
                  <div class="address-div" style={{padding: "8px 10px 4px 10px"}}>
                    <div class="icon" style={{background:"#fff"}}>
                      <span class="material-symbols-outlined">
                        local_library
                      </span>
                    </div>

                    <div class="address-text">
                      <div style="text-align: left;position: relative;top: -1px;">
                        <h5 style="color: #fff;font-weight: bold;">Maintenance Advance</h5>
                        <h5 style="margin: 0;font-size: 0.8rem;color: #dedede;">147</h5>
                      </div>
                      <div class="" style="position: relative;top: -6px">
                        <h6 style="margin: 0;font-size:1.4rem;font-weight:600; color:#ededed;">₹1,683
                        </h6>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <div class="row no-gutters">
                  <div class="col-6" style="padding: 10px;">

                    <div class="dashboard-square-card">
                      <div>
                        <h1>216</h1>
                        <h2>For Rent</h2>
                      </div>
                    </div>

                  </div>

                  <div class="col-6" style="padding: 10px;">

                    <div class="dashboard-square-card">
                      <div>
                        <h1>58</h1>
                        <h2>For Sale</h2>
                      </div>
                    </div>

                  </div>

                  <div class="col-6" style="padding: 10px;">

                    <div class="dashboard-square-card">
                      <div>
                        <h1>64</h1>
                        <h2>Rent Renewal</h2>
                      </div>
                    </div>

                  </div>

                  <div class="col-6" style="padding: 10px;">

                    <div class="dashboard-square-card">
                      <div>
                        <h1>16</h1>
                        <h2>On Notice</h2>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div> */}
          <br />
        </div>
        {/* <div className="page-title">
        <span className="material-symbols-outlined">dashboard_customize</span>
        <h1>Admin Dashboard </h1>
      </div>      <br /> */}

        <div className="row no-gutters">
          <div
            className="col-lg-6 col-md-12 col-sm-12"
            style={{ padding: "10px" }}
          >
            <div className="rent-tenant-card">
              <div>
                <h6>Rent Balance</h6>
                <h1 style={{ color: "red" }}>₹42,000</h1>
                <h2>Cut-off Date : 12 Jun'23</h2>
                {/* <h4>Due Date Exceeded : ₹100</h4> */}
                <button
                  className="mybutton button5"
                  style={{
                    background: "var(--theme-blue)",
                    color: "#fff",
                    fontWeight: "bolder",
                  }}
                >
                  Details
                </button>
              </div>
              {/* <div>
                            <h6>Propdial Commission</h6>
                            <h2 style={{fontSize: '1.2rem',color: '#666'}}>₹10,000</h2>
                            <button style={{float: 'right'}} className="mybutton button5">Pay Now</button>
                        </div> */}
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
        <br />

        {error && <p className="error">{error}</p>}
        {documents && (
          <Filters
            changeFilter={changeFilter}
            filterList={propertyFilter}
            filterLength={properties.length}
          />
        )}
        {properties && <PropertyList properties={properties} />}
        <br />
        <br />
      </div>
    </div>
  );
}
