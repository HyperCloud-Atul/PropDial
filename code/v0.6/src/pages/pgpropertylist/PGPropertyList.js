import { Link, useLocation } from "react-router-dom";
// import AddBill from '../pages/create/AddBill'
import { useNavigate } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

//Date Formatter MMM dd, yyyy
import { format } from "date-fns";

// component
import LeftSidebar from "../../Components/LeftSidebar";
import Filters from "../../Components/Filters";
import PropertyList from "../../Components/PropertyList";

// styles
import "./PGPropetyList.css";

export default function PGPropertyList() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const propertyFilter = ["ALL", "RESIDENTIAL", "COMMERCIAL", "INACTIVE"];
  const { user } = useAuthContext();
  const { documents, error } = useCollection("properties");
  const [filter, setFilter] = useState("all");
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
  // switch
  const [toggleFlag, setToggleFlag] = useState(false);
  const [propertyList, setPropertyList] = useState("residential"); //Residential/Commercial
  const toggleBtnClick = () => {
    if (toggleFlag) setPropertyList("residential");
    else setPropertyList("commercial");

    setToggleFlag(!toggleFlag);
  };
  // switch

  //   add class when click on advance search
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false); // State to track advanced search
  const toggleAdvancedSearch = () => {
    setIsAdvancedSearch(!isAdvancedSearch);
  };
  //   add class when click on advance search
  return (
    <div className="pgadmindasboard pgls_mobile aflbg">
      <div className="dashboard_pg pg_width">

        <LeftSidebar />

        <div className="right_main_content">
          <br />
          <h2 className="pg_title">property List</h2>
          <hr />
          <div
            className={`search_card${isAdvancedSearch ? " advanced_search" : ""
              }`}
            style={{
              margin: "10px 0px ",
              background: "white",
              padding: "15px 10px",
            }}
          >
            <div className="expand_btn" onClick={toggleAdvancedSearch}>
              <span>Advance search</span>
              <span className="material-symbols-outlined expand_more">
                expand_more
              </span>
              <span className="material-symbols-outlined expand_less">
                expand_less
              </span>
            </div>
            <div className="sc_first_row">
              <div
                className="d-flex frs_single"
                style={{
                  alignItems: "center",
                }}
              >
                <div
                  className="residential-commercial-switch"
                  style={{ top: "0" }}
                >
                  <span
                    className={toggleFlag ? "" : "active"}
                    style={{ color: "var(--theme-blue)" }}
                  >
                    Residential
                  </span>
                  <div
                    className={
                      toggleFlag
                        ? "toggle-switch on commercial"
                        : "toggle-switch off residential"
                    }
                    style={{ padding: "0 10px" }}
                  >
                    {/* <small>{toggleFlag ? 'On' : 'Off'}</small> */}
                    <div onClick={toggleBtnClick}>
                      <div></div>
                    </div>
                  </div>
                  <span
                    className={toggleFlag ? "active" : ""}
                    style={{ color: "var(--theme-orange)" }}
                  >
                    Commercial
                  </span>
                </div>
              </div>
              <div className="form_field st-2 mt-lg-0 frs_single">
                {/* <label>Unit Number</label> */}
                <div className="field_inner">
                  <input type="text" placeholder="Search here" />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">manage_search</span>
                  </div>
                </div>
              </div>
              <div className="form_field st-2 mt-lg-0 frs_single">
                {/* <label>Purpose</label> */}
                <div className="field_inner select">
                  <select>
                    <option selected disabled>
                      2022
                    </option>
                    <option>2021</option>
                    <option>2020</option>
                    <option>2019</option>
                  </select>
                  <div className="field_icon">
                    <span className="material-symbols-outlined">
                      hourglass_bottom
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="sc_second_row">
              <div className="form_field st-2 trs_single">
                <div className="field_inner select">
                  <select>
                    <option selected disabled>
                      Country
                    </option>
                    <option>India</option>
                    <option>Denmark</option>
                    <option>Malasia</option>
                    <option>China</option>
                  </select>
                  <div className="field_icon">
                    <span className="material-symbols-outlined">
                      hourglass_bottom
                    </span>
                  </div>
                </div>
              </div>
              <div className="form_field st-2 trs_single">
                <div className="field_inner select">
                  <select>
                    <option selected disabled>
                      State
                    </option>
                    <option>Delhi</option>
                    <option>Haryana</option>
                    <option>Madhya Pradesh</option>
                  </select>
                  <div className="field_icon">
                    <span className="material-symbols-outlined">
                      hourglass_bottom
                    </span>
                  </div>
                </div>
              </div>
              <div className="form_field st-2 trs_single">
                <div className="field_inner select">
                  <select>
                    <option selected disabled>
                      City
                    </option>
                    <option>Mumbai</option>
                    <option>Pune</option>
                    <option>Orangabad</option>
                  </select>
                  <div className="field_icon">
                    <span className="material-symbols-outlined">
                      hourglass_bottom
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="d-flex trs_single form_field st-2 "
                style={{
                  alignItems: "center",
                }}
              >
                <div
                  className="residential-commercial-switch"
                  style={{ top: "0" }}
                >
                  <span
                    className={toggleFlag ? "" : "active"}
                    style={{ color: "var(--theme-blue)" }}
                  >
                    Rent
                  </span>
                  <div
                    className={
                      toggleFlag
                        ? "toggle-switch on commercial"
                        : "toggle-switch off residential"
                    }
                    style={{ padding: "0 10px" }}
                  >
                    <div onClick={toggleBtnClick}>
                      <div></div>
                    </div>
                  </div>
                  <span
                    className={toggleFlag ? "active" : ""}
                    style={{ color: "var(--theme-orange)" }}
                  >
                    Sale
                  </span>
                </div>
              </div>

              <button className="theme_btn btn_fill">
                Search
              </button>

            </div>
          </div>

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
    </div>
  );
}
