import { useCollection } from "../../../hooks/useCollection";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLocation } from "react-router-dom";
// import { useNavigate } from 'react-router-dom'
import { useLogout } from "../../../hooks/useLogout";

// components
import Filters from "../../../components/Filters";
import PropertyList from "../../../components/PropertyList";
import Hero from "../../../components/Hero";

// styles
import "./PGAdminDashboard.css";

export default function PGAdminProperties() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const { user } = useAuthContext();
  // const { logout, isPending } = useLogout()
  const { documents: properties, error } = useCollection("properties");
  const [filter, setFilter] = useState("all");
  // const navigate = useNavigate();

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  // const properties = documents
  //   ? documents.filter((document) => {
  //     switch (filter) {
  //       case "all":
  //         return true;
  //       case "mine":
  //         let assignedToMe = false;
  //         document.assignedUsersList.forEach((u) => {
  //           if (u.id === user.uid) {
  //             assignedToMe = true;
  //           }
  //         });
  //         return assignedToMe;
  //       case "residential":
  //       case "commercial":
  //       case "active":
  //       case "inactive":
  //         // console.log(document.category, filter)
  //         return document.category === filter;
  //       default:
  //         return true;
  //     }
  //   })
  //   : null;
  console.log("Properties:", properties);
  return (
    <div>
      <Hero
        pageTitle="Property"
        pageSubTitle="Explore your properties"
        heroImage="./assets/img/property_page_banner.jpg"
      ></Hero>
      <br />
      <br />

      {error && <p className="error">{error}</p>}
      {/* {properties && <Filters changeFilter={changeFilter} />} */}
      {properties && <PropertyList properties={properties} />}
      <PropertyList />
    </div>
  );
}
