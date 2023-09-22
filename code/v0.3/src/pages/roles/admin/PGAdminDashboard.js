import { useCollection } from "../../../hooks/useCollection";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
// import { useNavigate } from 'react-router-dom'
import { useLogout } from "../../../hooks/useLogout";

// components
import Filters from "../../../Components/Filters";
import PropertyList from "../../../Components/PropertyList";
import Hero from "../../../Components/Hero";

// styles
import "./PGAdminDashboard.css";
const propertyFilter = ["ALL", "RESIDENTIAL", "COMMERCIAL", "INACTIVE"];
export default function PGAdminDashboard() {
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
      background:"rgb(244, 242, 235)"
    }} >
      <Hero
        pageTitle="Admin Dashboard"
        pageSubTitle="Explore your dashboard
        "
        heroImage="./assets/img/admin_banner.jpg"
      ></Hero>
      <br />
   <div className="container">
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
