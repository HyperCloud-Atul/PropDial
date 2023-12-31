import { useCollection } from "../../../hooks/useCollection";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Link, useLocation } from "react-router-dom";
// import { useNavigate } from 'react-router-dom'
import { useLogout } from "../../../hooks/useLogout";

// components
import Filters from "../../../Components/Filters";
import BillList from "../../../Components/BillList";
import LeftSidebar from "../../../Components/LeftSidebar";

// styles
// import './UserDashboard.css'

const billsFilter = ["PENDING", "COMPLETED", "CANCELLED"];

export default function PGTickets() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const { user } = useAuthContext();
  const { logout, isPending } = useLogout();
  const { documents: billsdocuments, error: billserror } =
    useCollection("bills");

  const [filter, setFilter] = useState("PENDING");

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const bills = billsdocuments
    ? billsdocuments.filter((document) => {
      let filteredProperty = false;
      switch (filter) {
        case "PENDING":
          document.taggedUsersList.forEach((u) => {
            if (
              u.id === user.uid &&
              document.status.toUpperCase() === "PENDING"
            ) {
              filteredProperty = true;
            }
          });
          return filteredProperty;
        case "COMPLETED":
          document.taggedUsersList.forEach((u) => {
            if (
              u.id === user.uid &&
              document.billType.toUpperCase() === "COMPLETED"
            ) {
              filteredProperty = true;
            }
          });
          return filteredProperty;
        case "CANCELLED":
          document.taggedUsersList.forEach((u) => {
            if (
              u.id === user.uid &&
              document.billType.toUpperCase() === "CANCELLED"
            ) {
              filteredProperty = true;
            }
          });
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

          <br />

          <div
            className="col-lg-6 col-md-12 col-sm-12"
            style={{ padding: "10px" }}
          >
            {/* Tickets */}
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



          <h2 className="page-title">Tickets</h2>
          <div>
            {billserror && <p className="error">{billserror}</p>}

            {billsdocuments && (
              <Filters
                changeFilter={changeFilter}
                filterList={billsFilter}
                filterLength={bills.length}
              />
            )}

            {bills && <BillList bills={bills} />}
          </div>







          <br />
        </div>
      </div>
    </div>



  );
}
