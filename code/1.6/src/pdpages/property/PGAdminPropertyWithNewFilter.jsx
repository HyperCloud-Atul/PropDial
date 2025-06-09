import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { projectFirestore } from "../../firebase/config";
import { useMemo } from "react";
import PropertyCard from "../../components/property/PropertyCard";
import PropertyTable from "../../components/property/PropertyTable";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import Filters from "../../components/Filters";
import InactiveUserCard from "../../components/InactiveUserCard";
const propertyFilter = ["Residential", "Commercial", "Plot"];
const statusFilter = ["Active", "In-Review", "Inactive"];



const PGAdminProperty = () => {
  const { user } = useAuthContext();
  const { filterOption } = useParams();

  // populate state and city based on state start
  const { documents: mState, error: mStateError } = useCollection("m_states");
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [allproperties, setAllproperties] = useState([]);

  const stateOptions =
    mState?.map((doc) => ({
      value: doc.docId,
      label: doc.state,
    })) || [];

  const handleStateChange = (selectedOption) => {
    setSelectedStateId(selectedOption?.value || null);
    setSelectedCity(null);
    setCityOptions([]);
    setAllproperties([]);
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption?.value || null);
  };

  // Fetch cities on state select
  useEffect(() => {
    if (!selectedStateId) return;

    const unsubscribe = projectFirestore
      .collection("m_cities")
      .where("state", "==", selectedStateId)
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


    const propertyCounts = useMemo(() => {
  const count = {
    active: 0,
    inactive: 0,
    inreview: 0,
    residential: 0,
    commercial: 0,
    plot: 0,
  };

  accessedPropertyList?.forEach((doc) => {
    const status = doc.isActiveInactiveReview?.toLowerCase();
    const category = doc.category?.toLowerCase();

    if (status === "active") count.active++;
    else if (status === "inactive") count.inactive++;
    else if (status === "in-review") count.inreview++;

    if (category === "residential") count.residential++;
    else if (category === "commercial") count.commercial++;
    else if (category === "plot") count.plot++;
  });

  return count;
}, [accessedPropertyList]);


const categoryStatusCounts = useMemo(() => {
  const counts = {
    Residential: { active: 0, inreview: 0, inactive: 0 },
    Commercial: { active: 0, inreview: 0, inactive: 0 },
    Plot: { active: 0, inreview: 0, inactive: 0 },
  };

  accessedPropertyList?.forEach((doc) => {
    const category = doc.category?.trim().toLowerCase();
    const status = doc.isActiveInactiveReview?.trim().toLowerCase();

    const catKey =
      category === "residential"
        ? "Residential"
        : category === "commercial"
        ? "Commercial"
        : category === "plot"
        ? "Plot"
        : null;

    const statusKey =
      status === "active"
        ? "active"
        : status === "in-review"
        ? "inreview"
        : status === "inactive"
        ? "inactive"
        : null;

    if (catKey && statusKey) {
      counts[catKey][statusKey]++;
    }
  });

  return counts;
}, [accessedPropertyList]);

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
          {filteredProperties ? (
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
              <div className="pg_header d-flex justify-content-between">
                <div className="left">
                  <h2 className="m22">
                    Filtered properties:{" "}
                    {filteredProperties && (
                      <span className="text_orange">
                        {filteredProperties.length}
                      </span>
                    )}
                  </h2>
                </div>
                <div className="right">
                  <img
                    src="/assets/img/icons/excel_logo.png"
                    alt="propdial"
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
                  <label>Select State</label>
                  <Select
                    options={stateOptions}
                    onChange={handleStateChange}
                    placeholder="Select a state..."
                    isClearable
                  />

                  {selectedStateId && (
                    <>
                      <label className="mt-3">Select City</label>
                      <Select
                        options={cityOptions}
                        onChange={handleCityChange}
                        placeholder="Select a city..."
                        isClearable
                      />
                    </>
                  )}
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
                      className={`bf_single ${
                        viewMode === "card_view" ? "active" : ""
                      }`}
                      onClick={() => handleModeChange("card_view")}
                    >
                      <span className="material-symbols-outlined">
                        calendar_view_month
                      </span>
                    </div>
                    <div
                      className={`bf_single ${
                        viewMode === "table_view" ? "active" : ""
                      }`}
                      onClick={() => handleModeChange("table_view")}
                    >
                      <span className="material-symbols-outlined">
                        view_list
                      </span>
                    </div>
                  </div>
                  {user?.status === "active" &&
                    (user?.role === "admin" || user?.role === "superAdmin") && (
                      <Link
                        to="/newproperty"
                        className="theme_btn btn_fill no_icon header_btn"
                      >
                        Create Property
                      </Link>
                    )}
                </div>

              </div>
              <div className="btn-group my-2">
  <button onClick={() => setStatus("Active")}>
    Active ({propertyCounts.active})
  </button>
  <button onClick={() => setStatus("In-Review")}>
    In-Review ({propertyCounts.inreview})
  </button>
  <button onClick={() => setStatus("Inactive")}>
    Inactive ({propertyCounts.inactive})
  </button>
</div>

<div className="btn-group my-2">
  <button onClick={() => setFilter("Residential")}>
    Residential ({propertyCounts.residential})
  </button>
  <button onClick={() => setFilter("Commercial")}>
    Commercial ({propertyCounts.commercial})
  </button>
  <button onClick={() => setFilter("Plot")}>
    Plot ({propertyCounts.plot})
  </button>
  <button onClick={() => setFilter("All")}>All</button>
</div>

<div className="flex flex-wrap gap-4 mb-4">
  {propertyFilter.map((cat) => (
    <button
      key={cat}
      onClick={() => changeFilter(cat)}
      className={`px-4 py-2 rounded shadow ${
        filter === cat ? "bg-blue-600 text-white" : "bg-gray-100"
      }`}
    >
      <div className="font-semibold">{cat}</div>
      <div className="text-sm text-gray-700">
        Active: {categoryStatusCounts[cat]?.active || 0} |
        In-Review: {categoryStatusCounts[cat]?.inreview || 0} |
        Inactive: {categoryStatusCounts[cat]?.inactive || 0} <br />
        Total:{" "}
        {(
          (categoryStatusCounts[cat]?.active || 0) +
          (categoryStatusCounts[cat]?.inreview || 0) +
          (categoryStatusCounts[cat]?.inactive || 0)
        ).toString()}
      </div>
    </button>
  ))}
</div>

<div className="flex flex-col gap-4 mb-4">
  {propertyFilter.map((cat) => (
    <div key={cat} className="border p-3 rounded bg-white shadow">
        <div className="px-3 py-1 rounded border text-sm bg-green-100 font-semibold">
    Total:{" "}
    {["active", "inreview", "inactive"].reduce(
      (acc, stat) => acc + (categoryStatusCounts[cat]?.[stat] || 0),
      0
    )}
  </div>
      <button
        onClick={() => setFilter(cat)}
        className={`text-lg font-semibold mb-2 ${
          filter === cat ? "text-blue-600" : "text-gray-800"
        }`}
      >
        {cat}
      </button>

      {/* {filter === cat && ( */}
        <div className="flex gap-2 mt-2">
          {["active", "inreview", "inactive"].map((stat) => (
            <button
              key={stat}
              onClick={() => setStatus(stat)}
              className={`px-3 py-1 rounded border text-sm ${
                status === stat ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              {stat.charAt(0).toUpperCase() + stat.slice(1)} (
              {categoryStatusCounts[cat]?.[stat] || 0})
            </button>
          ))}
        </div>
      {/* )} */}

   
    </div>
  ))}
</div>


              <hr></hr>
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
            </div>
          ) : (
            <div className="page_loader">
              <ClipLoader color="var(--theme-green2)" loading={true} />
            </div>
          )}
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </>
  );
};

export default PGAdminProperty;
