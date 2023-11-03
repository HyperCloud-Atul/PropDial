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

const billsFilter = ["PENDING", "PMS", "BROKERAGE", "MAINTENANCE", "INACTIVE"];

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
        case "PMS":
          document.taggedUsersList.forEach((u) => {
            if (
              u.id === user.uid &&
              document.billType.toUpperCase() === "PMS"
            ) {
              filteredProperty = true;
            }
          });
          return filteredProperty;
        case "BROKERAGE":
          document.taggedUsersList.forEach((u) => {
            if (
              u.id === user.uid &&
              document.billType.toUpperCase() === "BROKERAGE"
            ) {
              filteredProperty = true;
            }
          });
          return filteredProperty;
        case "MAINTENANCE":
          document.taggedUsersList.forEach((u) => {
            if (
              u.id === user.uid &&
              document.billType.toUpperCase() === "MAINTENANCE"
            ) {
              filteredProperty = true;
            }
          });
          return filteredProperty;
        case "INACTIVE":
          document.taggedUsersList.forEach((u) => {
            if (
              u.id === user.uid &&
              document.status.toUpperCase() === "INACTIVE"
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
