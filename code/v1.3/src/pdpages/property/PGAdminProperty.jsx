import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { projectFirestore } from "../../firebase/config";
import PropertyCard from "../../components/property/PropertyCard";
import PropertyTable from "../../components/property/PropertyTable";
import Switch from "react-switch";
import Filters from "../../components/Filters"; // Using your existing Filters component
import InactiveUserCard from "../../components/InactiveUserCard";
const propertyFilter = ["Residential", "Commercial"];
const statusFilter = ["In-Review", "Active", "Inactive"]; // Define the isActiveInactiveReview options

const PGAdminProperty = () => {
  const { user } = useAuthContext();
  const { filterOption } = useParams();
  // console.log("filterOption :", filterOption)

  // const { documents: allproperties, error: propertieserror } =
  //   useCollection("properties-propdial", ["postedBy", "==", "Propdial"], ["createdAt", "desc"]);
  const { documents: allproperties, error: propertieserror } =
    useCollection("properties-propdial", "", ["createdAt", "desc"]);

  const { documents: assignedPopertyUserList, error: errassignedPopertyUserList } = useCollection(
    "propertyusers"
  );

  const { documents: userList, error: erruserList } = useCollection(
    "users-propdial"
  );

  const [propertyListWithUsers, setPropertyListWithUsers] = useState();
  const [properties, setProperties] = useState();

  // Existing property filter state
  const [filter, setFilter] = useState(propertyFilter[0]);
  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  // // New isActiveInactiveReview filter state
  const [status, setStatus] = useState("In-Review"); // Default to 'In-Review'
  const changeStatusFilter = (newStatus) => {
    setStatus(newStatus);
  };

  // // Search input state
  const [searchInput, setSearchInput] = useState("");
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    let _properties = null;
    if (filterOption === 'all') {
      _properties = allproperties
    } else {
      _properties = allproperties &&
        allproperties.filter((item) =>
          (filterOption.toLowerCase() === "in-review" || filterOption.toLowerCase() === "active" || filterOption.toLowerCase() === "inactive") ? item.isActiveInactiveReview.trim().toUpperCase() === filterOption.toUpperCase() : (filterOption.toLowerCase() === "residential" || filterOption.toLowerCase() === "commercial") ? item.category.trim().toUpperCase() === filterOption.toUpperCase() : item.purpose.trim().toUpperCase() === filterOption.toUpperCase()
        );
    }

    setProperties(_properties);

    let _propertyListWithUsers = [];
    _properties && _properties.forEach(prop => {

      let assigneduserList = assignedPopertyUserList && assignedPopertyUserList.filter(propdoc => propdoc.propertyId === prop.id);

      let userDetails = '';

      if (assigneduserList && assigneduserList.length > 0) {
        assigneduserList.forEach(user => {
          let userObt = userList.filter(userDoc => userDoc.id === user.userId);
          userDetails = userDetails + (userObt && userObt[0] && (' ' + userObt[0].fullName + ' ' + userObt[0].phoneNumber));
        });
      }

      prop = {
        ...prop,
        userList: userDetails
      };

      _propertyListWithUsers.push(prop);
    });

    setPropertyListWithUsers(_propertyListWithUsers);
  }, [assignedPopertyUserList, allproperties, userList]);



  // // Rent/Sale switch state
  const [rentSaleFilter, setRentSaleFilter] = useState("Rent");
  const handleRentSaleChange = (checked) => {
    setRentSaleFilter(checked ? "Sale" : "Rent");
  };



  let caseFilter = user.accessType;

  // console.log("propertyListWithUsers: ", propertyListWithUsers)

  const accessedPropertyList = propertyListWithUsers
    ? propertyListWithUsers.filter((document) => {
      switch (caseFilter) {
        case "country":
          const lowerCaseCountryArray = user.accessValue.map(element => element.toLowerCase());
          return document.country && lowerCaseCountryArray.includes(document.country.toLowerCase());
        case "region":
          const lowerCaseRegionArray = user.accessValue.map(element => element.toLowerCase());
          return document.region && lowerCaseRegionArray.includes(document.region.toLowerCase());
        case "state":
          const lowerCaseStateArray = user.accessValue.map(element => element.toLowerCase());
          return document.state && lowerCaseStateArray.includes(document.state.toLowerCase());
        case "city":
          const lowerCaseCityArray = user.accessValue.map(element => element.toLowerCase());
          return document.city && lowerCaseCityArray.includes(document.city.toLowerCase());
        default: return true;
      }
    }) : null;

  // Filter properties based on search input, isActiveInactiveReview, and other filters
  const filteredProperties = accessedPropertyList
    ? accessedPropertyList.filter((document) => {
      let categoryMatch = true;
      let purposeMatch = true;
      let searchMatch = true;
      let statusMatch = true;

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
      purposeMatch = document.purpose.toUpperCase() === rentSaleFilter.toUpperCase();

      // Filter by search input
      searchMatch = searchInput
        ? Object.values(document).some(
          (field) =>
            typeof field === "string" &&
            field.toUpperCase().includes(searchInput.toUpperCase())
        )
        : true;

      // Filter by status
      statusMatch = document.isActiveInactiveReview.toUpperCase() === status.toUpperCase();

      return categoryMatch && searchMatch && statusMatch;
    })
    : null;



  //--------------------------- --------------------------  -------------

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
    <>
      {user && user.status === "active" ? (
        <div className="top_header_pg pg_bg pg_adminproperty">
          <div className="page_spacing pg_min_height">
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
                  <span className="material-symbols-outlined">Dashboard</span>
                </Link>
              </div>
            </div>
            {/* 9 dots html */}
            <div className="pg_header d-flex justify-content-between">
              <div className="left">
                <h2 className="m22">
                  Filtered properties:{" "}
                  {filteredProperties && (
                    <span className="text_orange">{filteredProperties.length}</span>
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
                <div className="new_inline">

                  {filteredProperties && (
                    <Filters
                      changeFilter={changeStatusFilter}
                      filterList={statusFilter}
                      filterLength={filteredProperties.length}
                    />
                  )}
                </div>
                <div className="new_inline">

                  {filteredProperties && (
                    <Filters
                      changeFilter={changeFilter}
                      filterList={propertyFilter}
                      filterLength={filteredProperties.length}
                    />
                  )}
                </div>
                {/* <div className="mobile_size residentail_commercial rent_sale">
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
               </div> */}
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
                  {filteredProperties &&
                    filteredProperties.map((property) => (
                      <PropertyCard key={property.id} propertyid={property.id} />
                    ))}
                </>
              )}
            </div>
            {viewMode === "table_view" && (
              <>{filteredProperties && <PropertyTable properties={filteredProperties} />}</>
            )}
          </div>
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </>

  );
};

export default PGAdminProperty;
