import { useCollection } from "../../../hooks/useCollection";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
// import { useNavigate } from 'react-router-dom'
import { useLogout } from "../../../hooks/useLogout";

// components
import Filters from "../../../Components/Filters";
import PropertyList from "../../../Components/PropertyList";

// styles
import "./PGAdminDashboard.css";

export default function PGAdminProperties() {
  const { user } = useAuthContext();
  // const { logout, isPending } = useLogout()
  const { documents, error } = useCollection("properties");
  const [filter, setFilter] = useState("all");
  // const navigate = useNavigate();

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const properties = documents
    ? documents.filter((document) => {
        switch (filter) {
          case "all":
            return true;
          case "mine":
            let assignedToMe = false;
            document.assignedUsersList.forEach((u) => {
              if (u.id === user.uid) {
                assignedToMe = true;
              }
            });
            return assignedToMe;
          case "residential":
          case "commercial":
          case "active":
          case "inactive":
            // console.log(document.category, filter)
            return document.category === filter;
          default:
            return true;
        }
      })
    : null;

  return (
    <div>
      <div className="page-title">
        <span className="material-symbols-outlined">dashboard_customize</span>
        <h1>Properties </h1>
      </div>
      <br />
      <br />

      {error && <p className="error">{error}</p>}
      {documents && <Filters changeFilter={changeFilter} />}
      {properties && <PropertyList properties={properties} />}
    </div>
  );
}
