import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import PropertyCard from "../../components/property/PropertyCard";
import PropertyTable from "../../components/property/PropertyTable";
import Switch from "react-switch";
// import filter
import Filters from "../../components/Filters";
const propertyFilter = ["Residential", "Commercial"];

const PGAdminProperty = () => {
  const { user } = useAuthContext();
  const { documents: properties, error: propertieserror } =
    useCollection("properties", ["postedBy", "==", "Propdial"], ["createdAt", "desc"]);

  // Filter state
  const [filter, setFilter] = useState(propertyFilter[0]);
  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  // Rent/Sale switch state
  const [rentSaleFilter, setRentSaleFilter] = useState("Rent");
  const handleRentSaleChange = (checked) => {
    setRentSaleFilter(checked ? "Sale" : "Rent");
  };

  // Search input state
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  //access level restriction
  // console.log('user accessType: ', user.accessType)
  // console.log('user accessValue: ', user.accessValue)



  let caseFilter = user.accessType;
  const accessedPropertyList = properties
    ? properties.filter((document) => {
      switch (caseFilter) {
        case "country":
          const lowerCaseCountryArray = user.accessValue.map(element => element.toLowerCase());
          return document.country && lowerCaseCountryArray.includes(document.country.toLowerCase())
        case "region":
          const lowerCaseRegionArray = user.accessValue.map(element => element.toLowerCase());
          return document.region && lowerCaseRegionArray.includes(document.region.toLowerCase())
        case "state":
          const lowerCaseStateArray = user.accessValue.map(element => element.toLowerCase());
          return document.state && lowerCaseStateArray.includes(document.state.toLowerCase())
        case "city":
          const lowerCaseCityArray = user.accessValue.map(element => element.toLowerCase());
          return document.city && lowerCaseCityArray.includes(document.city.toLowerCase())

        default: return true;
      }
    }) : null;

  // console.log("accessed PropertyList: ", accessedPropertyList)


  // Filter properties based on search input and other filters
  const filterProperties = accessedPropertyList
    ? accessedPropertyList.filter((document) => {
      let categoryMatch = true;
      let purposeMatch = true;
      let searchMatch = true;

      // Filter by category
      switch (filter) {
        case "Residential":
          categoryMatch = document.category.toUpperCase() === "RESIDENTIAL";
          break;
        case "Commercial":
          categoryMatch = document.category.toUpperCase() === "COMMERCIAL";
          break;
        default:
          categoryMatch = true;
      }

      // Filter by purpose
      purposeMatch =
        document.purpose.toUpperCase() === rentSaleFilter.toUpperCase();

      // Filter by search input
      searchMatch = searchInput
        ? Object.values(document).some(
          (field) =>
            typeof field === "string" &&
            field.toUpperCase().includes(searchInput.toUpperCase())
        )
        : true;

      return categoryMatch && purposeMatch && searchMatch;
    })
    : null;

  // console.log("filterProperties", filterProperties);

  // View mode state
  const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns
  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };

  // 9 dots controls state
  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };

  return (
    <div className="top_header_pg pg_bg pg_adminproperty">
      <div className="page_spacing">
        {/* 9 dots html */}
        <div
          onClick={openMoreAddOptions}
          className="property-list-add-property"
        >
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
            <Link to="/dashboard" className="more-add-options-icons">
              <h1>Dashboard</h1>
              <span class="material-symbols-outlined">Dashboard</span>
            </Link>
          </div>
        </div>
        {/* 9 dots html */}
        <div className="pg_header d-flex justify-content-between">
          <div className="left">
            <h2 className="m22">
              Filtered properties:{" "}
              {properties && (
                <span className="text_orange">{filterProperties.length}</span>
              )}
            </h2>
          </div>
          <div className="right">
            <img
              src="./assets/img/icons/excel_logo.png"
              alt=""
              className="excel_dowanload"
            />
          </div>
        </div>
        <div className="vg12"></div>
        <div className="filters">
          <div className="left">

            <div className="rt_global_search search_field">
              <input
                placeholder="Search"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <div className="field_icon">
                <span className="material-symbols-outlined">search</span>
              </div>
            </div>

          </div>
          <div className="right">
            <div className="user_filters new_inline">
              {properties && (
                <Filters
                  changeFilter={changeFilter}
                  filterList={propertyFilter}
                  filterLength={filterProperties.length}
                />
              )}
            </div>
            <div className="mobile_size residentail_commercial rent_sale">
              <label className={rentSaleFilter === "Sale" ? "on" : "off"}>
                <div className="switch">
                  <span
                    className={`rent ${rentSaleFilter === "Sale" ? "off" : "on"
                      }`}
                  >
                    Rent
                  </span>
                  <Switch
                    onChange={handleRentSaleChange}
                    checked={rentSaleFilter === "Sale"}
                    handleDiameter={20} // Set the handle diameter (optional)
                    uncheckedIcon={false} // Hide the wrong/right icon
                    checkedIcon={false} // Hide the wrong/right icon
                    className="pointer"
                  />
                  <span
                    className={`sale ${rentSaleFilter === "Sale" ? "on" : "off"
                      }`}
                  >
                    Sale
                  </span>
                </div>
              </label>
            </div>
            <div className="button_filter diff_views">
              <div
                className={`bf_single ${viewMode === "card_view" ? "active" : ""
                  }`}
                onClick={() => handleModeChange("card_view")}
              >
                <span className="material-symbols-outlined">
                  calendar_view_month
                </span>
              </div>
              <div
                className={`bf_single ${viewMode === "table_view" ? "active" : ""
                  }`}
                onClick={() => handleModeChange("table_view")}
              >
                <span className="material-symbols-outlined">view_list</span>
              </div>
            </div>
            <Link
              to="/newproperty"
              className="theme_btn btn_fill no_icon header_btn"
            >
              Create Property
            </Link>
          </div>
        </div>
        <hr></hr>
        <div className="vg12"></div>
        <div className="property_cards_parent">
          {viewMode === "card_view" && (
            <>
              {properties &&
                filterProperties.map((property) => (
                  <PropertyCard key={property.id} propertyid={property.id} />
                ))}
            </>
          )}
        </div>
        {viewMode === "table_view" && (
          <>{properties && <PropertyTable properties={filterProperties} />}</>
        )}
      </div>
    </div>
  );
};

export default PGAdminProperty;
