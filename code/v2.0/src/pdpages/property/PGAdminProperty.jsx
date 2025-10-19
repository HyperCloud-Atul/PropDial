import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { projectFirestore } from "../../firebase/config";
import PropertyCard from "../../components/property/PropertyCard";
import PropertyTable from "../../components/property/PropertyTable";
import Select from "react-select";
import Switch from "react-switch";
import { ClipLoader } from "react-spinners";
import usePropertyCounts from "../../utils/usePropertyCounts";
import Filters from "../../components/Filters";
import InactiveUserCard from "../../components/InactiveUserCard";
const propertyFilter = ["Residential", "Commercial", "Plot"];
const statusFilter = ["Active", "In-Review", "Inactive"];
const PGAdminProperty = () => {
  const { user } = useAuthContext();
  const { filterOption } = useParams();
  const { counts, countLoading, countError } = usePropertyCounts();
  // populate state and city based on state start
  const { documents: mState, errors: mStateError } =
    useCollection(
      "m_states",
      ["status", "==", "active"],
      // ["createdAt", "desc"]
    );
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [allproperties, setAllproperties] = useState([]);
  const [loading, setLoading] = useState(false);


  const stateOptions =
    mState?.map((doc) => ({
      value: doc.docId,
      label: doc.state,
    })) || [];
  //   setSelectedStateId(selectedOption?.value || null);
  //   setSelectedCity(null);
  //   setCityOptions([]);
  //   setAllproperties([]);
  // };

  // const handleCityChange = (selectedOption) => {
  //   setSelectedCity(selectedOption?.value || null);
  // };

  const handleStateChange = (selectedOption) => {
    const stateValue = selectedOption?.value || null;
    setSelectedStateId(stateValue);
    localStorage.setItem("selectedStateId", stateValue); // Save

    setSelectedCity(null);
    setCityOptions([]);
    setAllproperties([]);
    localStorage.removeItem("selectedCity"); // Reset city
  };

  const handleCityChange = (selectedOption) => {
    const cityValue = selectedOption?.value || null;
    setSelectedCity(cityValue);
    localStorage.setItem("selectedCity", cityValue); // Save
  };

  useEffect(() => {
    const savedStateId = localStorage.getItem("selectedStateId");
    const savedCity = localStorage.getItem("selectedCity");

    if (savedStateId) {
      setSelectedStateId(savedStateId);
    }

    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);


  // Fetch cities on state select
  useEffect(() => {
    if (!selectedStateId) return;

    const unsubscribe = projectFirestore
      .collection("m_cities")
      .where("state", "==", selectedStateId)
      .where("isShowInPropdial", "==", true)
        .where("status", "==", "active")
      .onSnapshot((snapshot) => {
        const options = snapshot.docs.map((doc) => ({
          value: doc.data().city,
          label: doc.data().city,
        }));
        setCityOptions(options);
      });

    return () => unsubscribe();
  }, [selectedStateId]);

  // Fetch properties on city select
  useEffect(() => {
    if (!selectedCity) return;
    setLoading(true);
    const unsubscribe = projectFirestore
      .collection("properties-propdial")
      .where("city", "==", selectedCity)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const props = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllproperties(props);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [selectedCity]);

  // populate state and city based on state end

  const {
    documents: assignedPopertyUserList,
    error: errassignedPopertyUserList,
  } = useCollection("propertyusers");
  const { documents: userList, error: erruserList } =
    useCollection("users-propdial");
  const [propertyListWithUsers, setPropertyListWithUsers] = useState();
  const [properties, setProperties] = useState();

  const [filter, setFilter] = useState(propertyFilter[0]);
  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };
  const [status, setStatus] = useState("active");
  const changeStatusFilter = (newStatus) => {
    setStatus(newStatus);
  };

  // // Search input state
  const [searchInput, setSearchInput] = useState("");
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const ITEMS_PER_PAGE = 10;
  const [lastVisiblePDDoc, setLastVisiblePDDoc] = useState(null);
  const [hasMorePDDoc, setHasMorePDDoc] = useState(true);

  useEffect(() => {
    let _properties = null;
    if (filterOption === "all") {
      _properties = allproperties;
    } else {
      _properties =
        allproperties &&
        allproperties.filter((item) =>
          filterOption.toLowerCase() === "in-review" ||
            filterOption.toLowerCase() === "active" ||
            filterOption.toLowerCase() === "inactive"
            ? item.isActiveInactiveReview.trim().toUpperCase() ===
            filterOption.toUpperCase()
            : filterOption.toLowerCase() === "residential" ||
              filterOption.toLowerCase() === "commercial" ||
              filterOption.toLowerCase() === "plot"
              ? item.category.trim().toUpperCase() === filterOption.toUpperCase()
              : item.purpose.trim().toUpperCase() === filterOption.toUpperCase()
        );
    }

    setProperties(_properties);

    let _propertyListWithUsers = [];
    _properties &&
      _properties.forEach((prop) => {
        let assigneduserList =
          assignedPopertyUserList &&
          assignedPopertyUserList.filter(
            (propdoc) => propdoc.propertyId === prop.id
          );

        let userDetails = "";

        if (assigneduserList && assigneduserList.length > 0) {
          assigneduserList.forEach((user) => {
            let userObt = userList.filter(
              (userDoc) => userDoc.id === user.userId
            );
            userDetails =
              userDetails +
              (userObt &&
                userObt[0] &&
                " " + userObt[0].fullName + " " + userObt[0].phoneNumber);
          });
        }

        prop = {
          ...prop,
          userList: userDetails,
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
          const lowerCaseCountryArray = user.accessValue.map((element) =>
            element.toLowerCase()
          );
          return (
            document.country &&
            lowerCaseCountryArray.includes(document.country.toLowerCase())
          );
        case "region":
          const lowerCaseRegionArray = user.accessValue.map((element) =>
            element.toLowerCase()
          );
          return (
            document.region &&
            lowerCaseRegionArray.includes(document.region.toLowerCase())
          );
        case "state":
          const lowerCaseStateArray = user.accessValue?.map(
            (element) =>
              //  element.toLowerCase()
              element
          );
          return (
            document.state &&
            lowerCaseStateArray.includes(document.state.toLowerCase())
          );
        case "city":
          const lowerCaseCityArray = user.accessValue.map((element) =>
            element.toLowerCase()
          );
          return (
            document.city &&
            lowerCaseCityArray.includes(document.city.toLowerCase())
          );
        default:
          return true;
      }
    })
    : null;

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
        case "Plot":
          categoryMatch = document.category.toUpperCase() === "PLOT";
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

      // Filter by status
      statusMatch =
        document.isActiveInactiveReview.toUpperCase() ===
        status.toUpperCase();

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
                  <span className="material-symbols-outlined">
                    location_city
                  </span>
                </Link>
                <Link to="/dashboard" className="more-add-options-icons">
                  <h1>Dashboard</h1>
                  <span className="material-symbols-outlined">Dashboard</span>
                </Link>
              </div>
            </div>
            {/* 9 dots html */}
            {user?.status === "active" &&
              (user?.role === "admin" || user?.role === "superAdmin") && (
                <Link
                  to="/newproperty"
                  className="property-list-add-property with_9dot"
                >
                  <span className="material-symbols-outlined">add</span>
                </Link>
              )}
            <div className="pg_header d-flex justify-content-between flex-wrap" style={{
              gap: "22px"
            }}>
              <div className="left">

                <h2 className="m22">
                  Total:{" "}
                  <span className="text_orange">
                    {counts.totalCount}
                  </span>,{" "}
                  Filtered:{" "}
                  {filteredProperties && (
                    <span className="text_orange">
                      {filteredProperties.length}
                    </span>
                  )}
                </h2>
              </div>
              <div className="right">
                <div className="new_inline">
                  <div className="project-filter">
                    <nav>
                      <button
                        className="pointer active"
                      >
                        All ({counts.totalCount})
                      </button>
                      <Link to="/filtered-property?filter=inreview"
                      >
                        <button
                          className="pointer"

                        >
                          Only In-Review ({counts.inReviewCount})
                        </button>
                      </Link>
                      <Link to="/filtered-property?filter=inactive"
                      >
                        <button
                          className="pointer"

                        >
                          Only Inactive ({counts.inactiveCount})
                        </button>
                      </Link>
                    </nav>
                  </div>
                </div>
                <img
                  src="/assets/img/icons/excel_logo.png"
                  alt="propdial"
                  className="excel_dowanload"
                />
              </div>
            </div>
            <hr />
            <div className="filters">
              <div className="left">
                <Select
                  options={stateOptions}
                  onChange={handleStateChange}

                  value={stateOptions.find((opt) => opt.value === selectedStateId) || null}
                  placeholder="Select a state..."
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    minWidth: "200px",
                  }}
                />

                {selectedStateId && (
                  <>
                    <Select
                      options={cityOptions}
                      onChange={handleCityChange}
                      value={cityOptions.find((opt) => opt.value === selectedCity) || null}
                      placeholder="Select a city..."
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        minWidth: "100px",
                      }}
                    />
                  </>
                )}
                <div className="rt_global_search search_field">
                  <input
                    placeholder="Search"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                  />
                  <div className="field_icon">
                    {/* <span className="material-symbols-outlined">search</span> */}
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3f5e98"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
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
                    <span className="material-symbols-outlined">
                      view_list
                    </span>
                  </div>
                </div>
                {/* {user?.status === "active" &&
                    (user?.role === "admin" || user?.role === "superAdmin") && (
                      <Link
                        to="/newproperty"
                        className="theme_btn btn_fill no_icon header_btn"
                      >
                        Create Property
                      </Link>
                    )} */}
              </div>
            </div>

            <hr></hr>
            {loading ? (
              <div className="page_loader">
                <ClipLoader color="var(--theme-green2)" loading={true} />
              </div>
            )
              : (
                <>
                  <div className="vg12"></div>
                  <div className="property_cards_parent">
                    {viewMode === "card_view" && (
                      <>
                        {filteredProperties &&
                          filteredProperties.map((property) => (
                            <PropertyCard
                              key={property.id}
                              propertyid={property.id}
                            />
                          ))}
                      </>
                    )}
                  </div>
                  {viewMode === "table_view" && (
                    <>
                      {filteredProperties && (
                        <PropertyTable
                          properties={filteredProperties}
                          user={user}
                        />
                      )}
                    </>
                  )}
                </>
              )
            }


          </div>
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </>
  );
};

export default PGAdminProperty;
