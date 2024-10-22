import { useCollection } from "../../../hooks/useCollection";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
// import { useNavigate } from 'react-router-dom'
import { useLogout } from "../../../hooks/useLogout";

// components
import Filters from "../../../components/Filters";
import PropertyList from "../../../components/PropertyList";

// styles
// import './UserDashboard.css'

export default function ExecutiveDashboard() {
  const { user } = useAuthContext();
  const { logout, isPending } = useLogout();
  // const { documents, error } = useCollection("properties-propdial", ["postedBy", "==", "Propdial"]);
  const { documents, error } = useCollection("properties-propdial");

  const [filter, setFilter] = useState("all");
  // const navigate = useNavigate();

  useEffect(() => {
    let flag = user && user.role === "propertymanager";
    if (!flag) {
      logout();
    }
  }, [user]);

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const properties = documents
    ? documents.filter((document) => {
      let filteredProperty = false;
      switch (filter) {
        case "all":
          document.assignedUsersList.forEach((u) => {
            if (u.id === user.uid) {
              filteredProperty = true;
            }
          });
          return filteredProperty;
        case "residential":
          document.assignedUsersList.forEach((u) => {
            if (u.id === user.uid && document.category === "residential") {
              filteredProperty = true;
            }
          });
          return filteredProperty;
        case "commercial":
          document.assignedUsersList.forEach((u) => {
            if (u.id === user.uid && document.category === "commercial") {
              filteredProperty = true;
            }
          });
          return filteredProperty;
        case "active":
        case "inactive":
          document.assignedUsersList.forEach((u) => {
            if (u.id === user.uid && document.status === "inactive") {
              filteredProperty = true;
            }
          });
          return filteredProperty;
        // return document.status === filter
        default:
          return true;
      }
    })
    : null;

  return (
    <div>
      <h2 className="page-title">Executive Dashboard</h2>
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
                            <h6>PropDial Commission</h6>
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
      <hr />
      <div>
        <div className="page-title">
          <span className="material-symbols-outlined">real_estate_agent</span>
          <h1>Properties </h1>
        </div>
        {error && <p className="error">{error}</p>}
        {documents && <Filters changeFilter={changeFilter} />}

        {properties && <PropertyList properties={properties} />}
      </div>
    </div>
  );
}
