import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../../hooks/useCollection";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";
import Filters from "../../../Components/Filters";
import PropAgentPropertyCard from "./PropAgentPropertyCard";

const propertyFilter = ["RESIDENTIAL", "COMMERCIAL"];

const PropAgentAllProperties = () => {
  const { state } = useLocation();
  let { propSearchFilter } = state;
  // console.log('propSearchFilter', propSearchFilter)

  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const { user } = useAuthContext();
  const { logout, isPending } = useLogout();
  // const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState("RESIDENTIAL");
  const [purposeFilter, setPurposeFilterVal] = useState("RENT"); //rent/sale
  const [searchKey, setSearchKey] = useState(
    propSearchFilter ? propSearchFilter : ""
  );
  const [city, setCity] = useState("DELHI");
  const [filteredProperty, setFilteredProperty] = useState([]);
  const [propertyCopy, setPropertyCopy] = useState([]);
  const [toggleFlagResidentialCommercial, setToggleFlagResidentialCommercial] = useState(false)
  const [toggleFlagRentSale, setToggleFlagRentSale] = useState(false)
  const [category, setCategory] = useState('RESIDENTIAL') //Residential/Commercial
  const [purpose, setPurpose] = useState('RENT') //Rent/Sale

  // useEffect(() => {
  //   let flag = user && user.role === "propagent";

  //   if (!flag) {
  //     logout();
  //   }
  // }, [user, logout]);

  // console.log('user:', user)
  const { documents: dbpropertiesdocuments, error: dbpropertieserror } =
    useCollection("properties", ["postedBy", "==", "Agent"]);

  useEffect(() => {
    let propList = [];
    const activepropertiesdocuments =
      user &&
      user.uid &&
      dbpropertiesdocuments &&
      dbpropertiesdocuments.filter(
        (item) => (item.status.toUpperCase() === "ACTIVE" && item.postedBy.toUpperCase() === 'AGENT')
      );

    activepropertiesdocuments &&
      activepropertiesdocuments.forEach((element) => {
        propList.push({
          ...element,
          searchKey: element.city + element.locality + element.society,
        });
      });
    // console.log('propList :: ', propList)
    setPropertyCopy(propList);

    // var newArray = propList.filter(function (el) {
    //   return el.searchKey.toUpperCase().includes(searchKey.toUpperCase());
    // });
    // console.log('category in useEffect::', category)
    // console.log('purpose  in useEffect::', purpose)
    var newArray = propList.filter(function (el) {
      // console.log('el:', el)
      return ((el.searchKey.toUpperCase().includes(searchKey.toUpperCase())) && (el.category.toUpperCase() === category.toUpperCase()) && (el.purpose.toUpperCase() === purpose.toUpperCase()));
    });

    // console.log("newArray :: ", newArray);
    setFilteredProperty(newArray);

    // setFilteredProperty(propList);
  }, [dbpropertiesdocuments]);

  function searchProperties(searchVal) {

    setSearchKey(searchVal)
    // console.log('searchKey ::: ', searchKey, propertyCopy)

    // var newArray = propertyCopy.filter(function (el) {
    //   return el.searchKey.toUpperCase().includes(searchKey.toUpperCase());
    // });

    var newArray = propertyCopy.filter(function (el) {
      // console.log('el:', el)
      return ((el.searchKey.toUpperCase().includes(searchVal.toUpperCase())) && (el.category.toUpperCase() === category.toUpperCase()) && (el.purpose.toUpperCase() === purpose.toUpperCase()));
    });

    // console.log('filteredlist :: ', newArray)
    setFilteredProperty(newArray);
  }

  const toggleBtnResidentialCommercialClick = () => {
    if (toggleFlagResidentialCommercial) {
      setCategory('RESIDENTIAL')
      // console.log('Residential Switch')
      var newArray = propertyCopy.filter(function (el) {
        // console.log('el:', el)
        return ((el.searchKey.toUpperCase().includes(searchKey.toUpperCase())) && (el.category.toUpperCase() === 'RESIDENTIAL') && (el.purpose.toUpperCase() === purpose.toUpperCase()));
      });

      // console.log('filteredlist :: ', newArray)
      setFilteredProperty(newArray);

    }
    else {
      setCategory('COMMERCIAL')
      // console.log('Commercial Switch')
      var newArray = propertyCopy.filter(function (el) {
        // console.log('el:', el)
        return ((el.searchKey.toUpperCase().includes(searchKey.toUpperCase())) && (el.category.toUpperCase() === 'COMMERCIAL') && (el.purpose.toUpperCase() === purpose.toUpperCase()));
      });

      // console.log('filteredlist :: ', newArray)
      setFilteredProperty(newArray);
    }
    setToggleFlagResidentialCommercial(!toggleFlagResidentialCommercial);
  };

  const toggleBtnRentSaleClick = () => {
    if (toggleFlagRentSale) {
      setPurpose('RENT')
      // console.log('Residential Switch')
      var newArray = propertyCopy.filter(function (el) {
        // console.log('el:', el)
        return ((el.searchKey.toUpperCase().includes(searchKey.toUpperCase())) && (el.purpose.toUpperCase() === 'RENT') && (el.category.toUpperCase() === category.toUpperCase()));
      });

      // console.log('filteredlist :: ', newArray)
      // console.log('Category:: ', category)
      // console.log('Purpose:: ', purpose)
      setFilteredProperty(newArray);

    }
    else {
      setPurpose('SALE')
      // console.log('Commercial Switch')
      var newArray = propertyCopy.filter(function (el) {
        console.log('el:', el.purpose)
        return ((el.searchKey.toUpperCase().includes(searchKey.toUpperCase())) && (el.purpose.toUpperCase() === 'SALE') && (el.category.toUpperCase() === category.toUpperCase()));

      });

      // console.log('Category:: ', category)
      // console.log('Purpose:: ', purpose)
      // console.log('Properties in Sale :: ', newArray)
      setFilteredProperty(newArray);
    }
    setToggleFlagRentSale(!toggleFlagRentSale);
  };

  return (
    <div className="propagent_all_properties">
      <div className="pg_header">
        {searchKey !== "" ? (
          <h4 className="p_subtitle">
            <span style={{ color: "var(--p-theme-orange)" }}>
              {filteredProperty && filteredProperty.length} properties
            </span>{" "}
            found in{" "}
            <span style={{ color: "var(--p-theme-orange)" }}>{searchKey}</span>
          </h4>
        ) : propertyCopy && propertyCopy.length !== 0 ? (
          <h4 className="p_subtitle">
            You can explore{" "}
            <span
              style={{
                padding: "0px 3px",
                color: "var(--p-theme-orange)",
              }}
            >
              {" "}
              {propertyCopy && propertyCopy.length} Properties Here
            </span>{" "}
          </h4>
        ) : (
          ""
        )}
      </div>
      <div className="fl_form_field with_icon">
        <label htmlFor="" className="no-floating">
          Search
        </label>
        <input id='id_searchKeyTextbox'
          type="text"
          placeholder="Type city, locality or society ...."
          onChange={(e) => {
            // setSearchKey(e.target.value);
            searchProperties(e.target.value);
          }}
          value={searchKey}
        />
        <div className="field_icon"></div>
      </div>
      <div className="verticall_gap"></div>


      {searchKey !== "" &&
        <div className="pg_header">
          <div
            className="row no-gutters"
            style={{ margin: "10px 0px ", height: "50px", background: "white" }}
          >
            {/* <div className="col-md-6 col-sm-12 d-flex " style={{
              alignItems: "center",
              height: "50px"
            }}                          >
              <div className="residential-commercial-switch" style={{ top: "0" }}>
                <span className={toggleFlagResidentialCommercial ? '' : 'active'} style={{ color: 'var(--theme-blue)' }}>Residential</span>
                <div className={toggleFlagResidentialCommercial ? 'toggle-switch on commercial' : 'toggle-switch off residential'} style={{ padding: '0 10px' }}>                 
                  <div onClick={toggleBtnResidentialCommercialClick}>
                    <div></div>
                  </div>
                </div>
                <span className={toggleFlagResidentialCommercial ? 'active' : ''} style={{ color: 'var(--theme-orange)' }}>Commercial</span>
              </div>
            </div> */}

            <div className="col-md-6 col-sm-12 d-flex " style={{
              alignItems: "center",
              height: "50px"
            }}                          >
              <div className="residential-commercial-switch" style={{ top: "0" }}>
                <span className={toggleFlagRentSale ? '' : 'active'} style={{ color: 'var(--theme-blue)' }}>Rent</span>
                <div className={toggleFlagRentSale ? 'toggle-switch on commercial' : 'toggle-switch off residential'} style={{ padding: '0 10px' }}>
                  {/* <small>{toggleFlagRentSale ? 'On' : 'Off'}</small> */}
                  <div onClick={toggleBtnRentSaleClick}>
                    <div></div>
                  </div>
                </div>
                <span className={toggleFlagRentSale ? 'active' : ''} style={{ color: 'var(--theme-orange)' }}>Sale</span>
              </div>
            </div>

          </div>
        </div>

      }

      {/* <Filters
                    changeFilter={changeFilter}
                    filterList={propertyFilter}
                    activeFilter={filter}
                    filterLength={properties && properties.length}
                /> */}

      {filteredProperty && filteredProperty.length === 0 && (
        <h2 className="p_title">No property available</h2>
      )}

      {searchKey !== "" && (
        <div className="ppc_single_parent">
          {filteredProperty &&
            filteredProperty.map((property) => (
              <PropAgentPropertyCard key={property.id} property={property} />
            ))}
        </div>
      )}
      <div className="verticall_gap"></div>
      <div className="verticall_gap_991"></div>
    </div>
  );
};

export default PropAgentAllProperties;
