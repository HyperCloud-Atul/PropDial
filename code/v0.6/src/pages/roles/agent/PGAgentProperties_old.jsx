import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../../hooks/useCollection";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";
// import { useNavigate, useParams } from 'react-router-dom'

// components
import Filters from "../../../Components/Filters";
import PropAgentPropertyCard from "./PropAgentPropertyCard";

const propertyFilter = ["ACTIVE", "INACTIVE", "PENDING APPROVAL"];
const propertyFilterForOthers = ["RESIDENTIAL", "COMMERCIAL"];

const PGAgentProperties_old = () => {
  const { state } = useLocation();
  const { propSearchFilter } = state;
  const { filterType } = state;
  console.log('propSearchFilter', propSearchFilter)
  console.log('filterType', filterType)

  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const { user } = useAuthContext();
  const { logout, isPending } = useLogout();
  const { documents: propertiesdocuments, error: propertieserror } =
    useCollection("properties", ["postedBy", "==", "Agent"]);

  // switch
  const [toggleFlag, setToggleFlag] = useState(false);
  const [purposeFilter, setPurposeFilterVal] = useState('RENT'); //rent/sale
  const [filter, setFilter] = useState("ACTIVE");
  const [properties, setProperties] = useState([]);
  const [city, setCity] = useState("DELHI");
  const [category, setCategory] = useState("RESIDENTIAL");
  const [flag, setFlag] = useState("BYME");

  useEffect(() => {
    // console.log("propSearchFilter in useeffect", propSearchFilter);
    if (
      propSearchFilter === "ACTIVE" ||
      propSearchFilter === "INACTIVE" ||
      propSearchFilter === "PENDING APPROVAL"
    ) {
      // console.log("propSearchFilter in active/inactive/pending approval",propSearchFilter);
      setToggleFlag(false);
      // setFilter(propSearchFilter);
      // getProperties(propSearchFilter);
    } else {
      // console.log("propSearchFilter value", propSearchFilter);
      setToggleFlag(true);
      if (filterType.toUpperCase() === 'CITY')
        changeCity(propSearchFilter)
      // getProperties(propSearchFilter);
    }
    setFilter(propSearchFilter);
    getProperties(propSearchFilter);

  }, [propSearchFilter, propertiesdocuments]);

  useEffect(() => {
    let flag = user && user.role === "propagent";

    if (!flag) {
      logout();
    }
  }, [user, logout]);

  const toggleBtnClick = () => {
    // console.log('toggleBtnClick')
    if (toggleFlag) {
      setFlag('BYME')
      getProperties("ACTIVE");
    } else {
      setFlag('BYOTHERS')
      getProperties("BYOTHERS");
    }
    setToggleFlag(!toggleFlag);
  };

  const changePurpose = (option) => {
    setPurposeFilterVal(option);
    console.log('new Option: ', option.toUpperCase())
    getProperties(option);
  };

  const changeCity = (newCity) => {
    setCity(newCity);
    console.log('new City: ', newCity)
    getProperties(newCity);
  };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
    getProperties(newFilter);
  };

  // let properties = []
  const getProperties = (filterVal) => {
    console.log('category in getProperties', category)
    console.log('filer in getProperties', filter)
    console.log("filterVal in getProperties", filterVal);
    // setFilter(filterVal);
    // console.log('property document:', propertiesdocuments)
    let filteredProperties = propertiesdocuments
      ? propertiesdocuments.filter((document) => {
        let filteredProperty = false;
        // console.log('useSwitch', userSwitch)
        // if (userSwitch === "BY ME") {
        switch (filterVal) {
          case "BYME":
            setFilter('BYME')
            document.createdBy.id === user.uid && document.status === "active"
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;
          case "ACTIVE":
            setFilter('ACTIVE')
            document.createdBy.id === user.uid && document.status === "active"
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;
          case "INACTIVE":
            setFilter('INACTIVE')
            document.createdBy.id === user.uid &&
              document.status === "inactive"
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "PENDING APPROVAL":
            setFilter('PENDING APPROVAL')
            document.createdBy.id === user.uid &&
              document.status === "pending approval"
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "BYOTHERS":
            setFilter('BYOTHERS')
            // console.log('city: ', city.label)
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.category === category &&
              document.city === city.label
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "RESIDENTIAL":
            setCategory('RESIDENTIAL')
            setFilter('RESIDENTIAL')
            // document.createdBy.id !== user.uid &&
            document.status.toUpperCase() === "ACTIVE" &&
              document.category.toUpperCase() === "RESIDENTIAL" &&
              document.city.toUpperCase() === city &&
              document.purpose.toUpperCase() === purposeFilter
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;
          case "COMMERCIAL":
            setCategory('COMMERCIAL')
            setFilter('COMMERCIAL')
            // document.createdBy.id !== user.uid &&
            document.status.toUpperCase() === "ACTIVE" &&
              document.category.toUpperCase() === "COMMERCIAL" &&
              document.city.toUpperCase() === city &&
              document.purpose.toUpperCase() === purposeFilter
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "RENT":
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.purpose === 'RENT' &&
              document.category === category
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "RENTED OUT":
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.purpose === "Rented Out"
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "SALE":
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.purpose === "SALE" &&
              document.category === category
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "SOLD OUT":
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.purpose === "Sold Out"
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "DELHI":
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.city === "DELHI" &&
              document.category === category
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "GURUGRAM":
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.city === "GURUGRAM" &&
              document.category === category
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "NOIDA":
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.city === "NOIDA" &&
              document.category === category
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "FARIDABAD":
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.city === "FARIDABAD" &&
              document.category === category
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "GHAZIABAD":
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.city === "GHAZIABAD" &&
              document.category === category
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "BANGALORE":
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.city === "BANGALORE" &&
              document.category === category
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "PUNE":
            console.log('in PUNE')
            console.log('category:', category)
            // document.createdBy.id !== user.uid &&
            document.status.toUpperCase() === "ACTIVE" &&
              document.city.toUpperCase() === "PUNE" &&
              document.category.toUpperCase() === category
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "MUMBAI":
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.city === "MUMBAI" &&
              document.category === category
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "HYDERABAD":
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.city === "HYDERABAD" &&
              document.category === category
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          case "GOA":
            // document.createdBy.id !== user.uid &&
            document.status === "active" &&
              document.city === "GOA" &&
              document.category === category
              ? (filteredProperty = true)
              : (filteredProperty = false);

            return filteredProperty;

          default:
            return true;
        }
      })
      : null;

    setProperties(filteredProperties);
  };

  console.log('properties: ', properties)

  //   add class when click on advance search
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false); // State to track advanced search
  const toggleAdvancedSearch = () => {
    setIsAdvancedSearch(!isAdvancedSearch);
  };
  //   add class when click on advance search

  return (
    <div className="top_header_pg pa_bg">
      <div className="pa_inner_page">
        <div className="brf_icon">
          <Link to="/agentaddproperties/new">
            <div className="brfi_single">
              <span className="material-symbols-outlined">add</span>
            </div>
          </Link>
        </div>
        <div className="pg_header">
          <h2 className="p_title">Properties</h2>
          {properties && properties.length !== 0 ? <h4 className="p_subtitle"  >You can explore your favourite <span style={{ padding: '0px 6px 0px 6px', fontSize: '36px', fontWeight: 'bolder' }} > {properties && properties.length}</span> properties here</h4> : ''}
        </div>

        <div
          className={`search_card${isAdvancedSearch ? " advanced_search" : ""}`}
          style={{
            margin: "10px 0px ",
            background: "white",
            padding: "15px 10px",
          }}
        >
          <div className="sc_first_row">
            <div className="residential-commercial-switch" style={{ top: "0" }}>
              <span
                className={toggleFlag ? "" : "active"}
                style={{ color: "var(--theme-blue)" }}
              >
                By Me
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
                By Others
              </span>
            </div>

            {flag === 'BYOTHERS' && <div className="form_field st-2">
              <div className="radio_group">
                <div className="radio_group_single">
                  <div className="custom_radio_button" >
                    {purposeFilter === 'RENT' ? <input type="radio" checked id="filter_rent" name='rent_sale' onClick={() => changePurpose('RENT')} /> : <input type="radio" id="filter_rent" name='rent_sale' onClick={() => changePurpose('RENT')} />}
                    <label htmlFor="filter_rent">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Rent</h6>
                    </label>
                  </div>
                </div>

                <div className="radio_group_single">
                  <div className="custom_radio_button">
                    <input type="radio" id="filter_sale" name='rent_sale' onClick={() => changePurpose('SALE')} />
                    <label htmlFor="filter_sale">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Sale</h6>
                    </label>
                  </div>
                </div>
              </div>
            </div>}


          </div>

          {flag === 'BYOTHERS' && <div className="row">
            <div className="col-lg-3 col-12">
              <div className="form_field st-2">
                <div className="field_inner select">
                  <select
                    onChange={(e) => changeCity(e.target.value)}
                    value={city}
                  >
                    {/* <option selected disabled>
                      City
                    </option> */}
                    <option>DELHI</option>
                    <option>PUNE</option>
                    <option>MUMBAI</option>
                    <option>GOA</option>
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
            </div>
            {/* <div className="col-lg-7 col-sm-10 col-8">
              <div className="form_field st-2">
                <div className="field_inner">
                  <input type="search" placeholder="Search" />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* <div className="col-lg-2 col-sm-2 col-4 text-end">
              <button
                className="theme_btn btn_fill no_icon"
                style={{
                  marginTop: "16px",
                }}
              >
                Search
              </button>
            </div> */}
          </div>}
        </div>

        <section>
          {flag === 'BYOTHERS' && <div>
            <h4 className="p_subtitle">Properties in <span style={{ padding: '0px 6px 0px 6px', fontSize: '36px', fontWeight: 'bolder' }} > {city}</span> </h4>
          </div>}
          <div>
            {propertieserror && <p className="error">{propertieserror}</p>}
            {properties &&
              (filter === "BYME" ||
                filter === "ACTIVE" ||
                filter === "INACTIVE" ||
                filter === "PENDING APPROVAL") && (
                <Filters
                  changeFilter={changeFilter}
                  filterList={propertyFilter}
                  activeFilter={filter}
                  filterLength={properties && properties.length}
                />
              )}

            {properties &&
              !(filter === "BYME" ||
                filter === "ACTIVE" ||
                filter === "INACTIVE" ||
                filter === "PENDING APPROVAL") && (
                <Filters
                  changeFilter={changeFilter}
                  filterList={propertyFilterForOthers}
                  activeFilter=""
                  // activeFilter={filter}
                  filterLength={properties && properties.length}
                />
              )}
            <br></br>
            {properties && properties.length === 0 && (
              <h2 className="p_title">No property available</h2>
            )}

            <div className="property_card_left">
              {properties &&
                properties.map((property) => (
                  <PropAgentPropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PGAgentProperties_old;
