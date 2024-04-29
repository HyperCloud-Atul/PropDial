import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import Filters from "../Filters";
import PropertyCard from "./PropertyCard";
import SearchBarAutoComplete from "../../pages/search/SearchBarAutoComplete";
const propertyFilter = ["RESIDENTIAL", "COMMERCIAL"];

const PropdialAllProperties = () => {
    //   const { state } = useLocation();
    //   let { propSearchFilter } = state;
    let propSearchFilter = "";
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
    // const [purposeFilter, setPurposeFilterVal] = useState("RENT"); //rent/sale
    const [searchKey, setSearchKey] = useState(
        propSearchFilter === 'ACTIVE' || propSearchFilter === 'INACTIVE' || propSearchFilter === 'PENDING APPROVAL' ? "" : propSearchFilter
    );
    const [city, setCity] = useState("DELHI");
    const [filteredProperty, setFilteredProperty] = useState([]);
    const [propertyCopy, setPropertyCopy] = useState([]);
    const [toggleFlagResidentialCommercial, setToggleFlagResidentialCommercial] = useState(false)
    const [toggleFlagRentSale, setToggleFlagRentSale] = useState(false)
    const [category, setCategory] = useState('RESIDENTIAL') //Residential/Commercial
    // const [purpose, setPurpose] = useState('AVAILABLE FOR RENT') //Rent/Sale
    const [propSearch, setPropSearch] = useState(propSearchFilter ? propSearchFilter : "");
    const [distinctCityList, setDistinctCityList] = useState([])
    const [propertyPurposeFilter, setPropertyPurposeFilter] = useState("Available for Rent")
    const [propertyPurposeFilteredCount, setpropertyPurposeFilteredCount] = useState({
        availableForRentFilteredCount: 0,
        rentedOutFilteredCount: 0,
        availableForSaleFilteredCount: 0,
        soldOutFilteredCount: 0
    })

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
                    searchKey: element.city.trim() + "-" + element.locality.trim() + "-" + element.society.trim(),
                });
            });
        // console.log('propList length :: ', propList.length)
        setPropertyCopy(propList);
        let ldistinctCityList = [];
        propList &&
            propList.map((doc) => {
                if (!ldistinctCityList.find((e) => e.searchKey === doc.searchKey)) {
                    ldistinctCityList.push(
                        doc.searchKey
                    );
                }
            });
        // console.log('ldistinctCityList', ldistinctCityList)
        setDistinctCityList(ldistinctCityList)

        var newArray = propList.filter(function (el) {
            return el.searchKey.toUpperCase().includes(searchKey.toUpperCase());
        });
        // console.log('category in useEffect::', category)

        // console.log("newArray :: ", newArray);
        setFilteredProperty(newArray);

        // setFilteredProperty(propList);
    }, [dbpropertiesdocuments]);

    function searchProperties(searchVal) {
        searchVal !== '' ? setSearchKey(searchVal) : searchVal = searchKey
        // console.log('searchVal:', searchVal)

        var arrAvailableForRent = propertyCopy.filter(function (el) {
            return ((el.searchKey.toUpperCase().includes(searchVal.toUpperCase())) && (el.purpose === "Available for Rent"));
        });
        // console.log('arrAvailableForRent length:', arrAvailableForRent.length)

        var arrAvailableForSale = propertyCopy.filter(function (el) {
            return ((el.searchKey.toUpperCase().includes(searchVal.toUpperCase())) && (el.purpose === "Available for Sale"));
        });
        // console.log('arrAvailableForSale length:', arrAvailableForSale.length)

        var arrRentedOut = propertyCopy.filter(function (el) {
            return ((el.searchKey.toUpperCase().includes(searchVal.toUpperCase())) && (el.purpose === "Rented Out"));
        });
        // console.log('arrRentedOut length:', arrRentedOut.length)

        var arrSoldOut = propertyCopy.filter(function (el) {
            return ((el.searchKey.toUpperCase().includes(searchVal.toUpperCase())) && (el.purpose === "Sold Out"));
        });
        // console.log('arrSoldOut length:', arrSoldOut.length)

        setpropertyPurposeFilteredCount({
            availableForRentFilteredCount: arrAvailableForRent.length,
            rentedOutFilteredCount: arrRentedOut.length,
            availableForSaleFilteredCount: arrAvailableForSale.length,
            soldOutFilteredCount: arrSoldOut.length,
        })

        setPropertyPurposeFilter(arrAvailableForRent.length > 0 ? 'Available for Rent' : arrRentedOut.length > 0 ? 'Rented Out' : arrAvailableForSale.length > 0 ? 'Available for Sale' : arrSoldOut.length > 0 ? 'Sold Out' : 'Available for Rent')

        var newArray = propertyCopy.filter(function (el) {
            // console.log('el:', el)
            // console.log('propertyPurposeFilter:', propertyPurposeFilter)
            return ((el.searchKey.toUpperCase().includes(searchVal.toUpperCase())) && (el.category.toUpperCase() === category.toUpperCase()) && (el.purpose === propertyPurposeFilter));
        });

        // console.log('filteredlist :: ', newArray)
        setFilteredProperty(newArray);
    }

    const propertyPurposeFilterClick = (clickedPurpose) => {
        // console.log('clickedPurpose:', clickedPurpose)
        setPropertyPurposeFilter(clickedPurpose)

        var newArray = propertyCopy.filter(function (el) {
            // console.log('el:', el)
            // console.log('propertyPurposeFilter:', propertyPurposeFilter)
            return ((el.searchKey.toUpperCase().includes(searchKey.toUpperCase())) && (el.category.toUpperCase() === category.toUpperCase()) && (el.purpose === clickedPurpose));
        });

        // console.log('filteredlist :: ', newArray)
        setFilteredProperty(newArray);

    }

    // const toggleBtnRentSaleClick = () => {

    //   var newArray = [];
    //   if (toggleFlagRentSale) {
    //     // setPurpose('Available for Rent')
    //     // console.log('Available for Rent')
    //     newArray = propertyCopy.filter(function (el) {
    //       // console.log('el:', el)
    //       // console.log("searchKey.toUpperCase():", searchKey.toUpperCase())
    //       return ((el.searchKey.toUpperCase().includes(searchKey.toUpperCase())) && (el.category.toUpperCase() === category.toUpperCase()) && ((el.purpose.toUpperCase() === 'AVAILABLE FOR RENT') || (el.purpose.toUpperCase() === 'RENTED OUT')));
    //     });
    //   }
    //   else {
    //     // setPurpose('Available for Sale')
    //     // console.log('Commercial Switch')
    //     newArray = propertyCopy.filter(function (el) {
    //       // console.log('el:', el.purpose)
    //       return ((el.searchKey.toUpperCase().includes(searchKey.toUpperCase())) && (el.category.toUpperCase() === category.toUpperCase()) && ((el.purpose.toUpperCase() === 'AVAILABLE FOR SALE') || (el.purpose.toUpperCase() === 'SOLD OUT')));

    //     });
    //   }
    //   setFilteredProperty(newArray);
    //   setToggleFlagRentSale(!toggleFlagRentSale);
    // };


    function setSearchedProperty(propssearchkey) {
        setPropSearch(propssearchkey)
    }

    function setRedirectFlag(flag, key) {

    }

    return (
        <div className="top_header_pg pg_bg">
           <div className="page_spacing">
            <div className="allproperites">
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
            {/* <div className="fl_form_field with_icon">
        <label htmlFor="" className="no-floating">
          Search
        </label>
        <input id='id_searchKeyTextbox'
          type="text"
          placeholder="Type city, locality or society ...."
          onChange={(e) => {
            searchProperties(e.target.value);
          }}
          value={searchKey}
        />
        <div className="field_icon"></div>
      </div> */}

            <SearchBarAutoComplete
                enabled={false}
                dataList={distinctCityList ? distinctCityList : []}
                placeholderText={"Type city, locality or society new ...."}
                getQuery={searchProperties}
                queryValue={propSearch}
                setRedirectFlag={setRedirectFlag}
            ></SearchBarAutoComplete>
            <div className="verticall_gap"></div>


            {/* {searchKey !== "" &&
        <div className="pg_header">
          <div
            className="row no-gutters"
            style={{ margin: "10px 0px ", height: "50px", background: "white" }}
          >
            <div className="col-md-6 col-sm-12 d-flex " style={{
              alignItems: "center",
              height: "50px"
            }}                          >
              <div className="residential-commercial-switch" style={{ top: "0" }}>
                <span className={toggleFlagRentSale ? '' : 'active'} style={{ color: 'var(--theme-blue)' }}>Rent</span>
                <div className={toggleFlagRentSale ? 'toggle-switch on commercial' : 'toggle-switch off residential'} style={{ padding: '0 10px' }}>
                  <div onClick={toggleBtnRentSaleClick}>
                    <div></div>
                  </div>
                </div>
                <span className={toggleFlagRentSale ? 'active' : ''} style={{ color: 'var(--theme-orange)' }}>Sale</span>
              </div>
            </div>

          </div>
        </div>
      } */}

            {searchKey !== "" && filteredProperty.length > 0 && <div className="form_field st-2 new_radio_groups_parent new_single_field n_select_bg">
                <span className="no-floating">Filter</span>

                <div className="radio_group" style={{ paddingTop: "10px" }}>
                    {propertyPurposeFilteredCount.availableForRentFilteredCount > 0 && <div className="radio_group_single" style={{ position: 'relative', paddingTop: '5px', paddingBottom: '5px' }}>

                        <div className="purpose-filter-count-tag">
                            <small>{propertyPurposeFilteredCount.availableForRentFilteredCount}</small>
                        </div>

                        <div
                            className={
                                propertyPurposeFilter === "Available for Rent"
                                    ? "custom_radio_button radiochecked"
                                    : "custom_radio_button"
                            }
                        >
                            <input
                                type="checkbox"
                                id="purpose_availableforrent"
                                onClick={(e) => propertyPurposeFilterClick('Available for Rent')}

                            />
                            <label htmlFor="purpose_availableforrent" style={{ paddingTop: "7px" }}>
                                <div className="radio_icon">
                                    <span className="material-symbols-outlined add">add</span>
                                    <span className="material-symbols-outlined check">
                                        done
                                    </span>
                                </div>
                                <span style={{ fontSize: '0.8rem' }}>Available for Rent</span>
                            </label>
                        </div>
                    </div>}
                    {propertyPurposeFilteredCount.rentedOutFilteredCount > 0 && <div className="radio_group_single" style={{ position: 'relative', paddingTop: '5px', paddingBottom: '5px' }}>

                        <div className="purpose-filter-count-tag">
                            <small>{propertyPurposeFilteredCount.rentedOutFilteredCount}</small>
                        </div>

                        <div
                            className={
                                propertyPurposeFilter === "Rented Out"
                                    ? "custom_radio_button radiochecked"
                                    : "custom_radio_button"
                            }
                        >
                            <input
                                type="checkbox"
                                id="purpose_rentedout"
                                onClick={(e) => propertyPurposeFilterClick('Rented Out')}
                            />
                            <label htmlFor="purpose_rentedout" style={{ paddingTop: "7px" }}>
                                <div className="radio_icon">
                                    <span className="material-symbols-outlined add">add</span>
                                    <span className="material-symbols-outlined check">
                                        done
                                    </span>
                                </div>
                                <span style={{ fontSize: '0.8rem' }}>Rented Out</span>
                            </label>
                        </div>
                    </div>}
                    {propertyPurposeFilteredCount.availableForSaleFilteredCount > 0 && <div className="radio_group_single" style={{ position: 'relative', paddingTop: '5px', paddingBottom: '5px' }}>

                        <div className="purpose-filter-count-tag">
                            <small>{propertyPurposeFilteredCount.availableForSaleFilteredCount}</small>
                        </div>

                        <div
                            className={
                                propertyPurposeFilter === "Available for Sale"
                                    ? "custom_radio_button radiochecked"
                                    : "custom_radio_button"
                            }
                        >
                            <input
                                type="checkbox"
                                id="purpose_availableforsale"
                                onClick={(e) => propertyPurposeFilterClick('Available for Sale')}
                            />
                            <label htmlFor="purpose_availableforsale" style={{ paddingTop: "7px" }}>
                                <div className="radio_icon">
                                    <span className="material-symbols-outlined add">add</span>
                                    <span className="material-symbols-outlined check">
                                        done
                                    </span>
                                </div>
                                <span style={{ fontSize: '0.8rem' }}>Available for Sale</span>
                            </label>
                        </div>
                    </div>}
                    {propertyPurposeFilteredCount.soldOutFilteredCount > 0 && <div className="radio_group_single" style={{ position: 'relative', paddingTop: '5px', paddingBottom: '5px' }}>

                        <div className="purpose-filter-count-tag">
                            <small>{propertyPurposeFilteredCount.soldOutFilteredCount}</small>
                        </div>

                        <div
                            className={
                                propertyPurposeFilter === "Sold Out"
                                    ? "custom_radio_button radiochecked"
                                    : "custom_radio_button"
                            }
                        >
                            <input
                                type="checkbox"
                                id="purpose_soldout"
                                onClick={(e) => propertyPurposeFilterClick('Sold Out')}
                            />
                            <label htmlFor="purpose_soldout" style={{ paddingTop: "7px" }}>
                                <div className="radio_icon">
                                    <span className="material-symbols-outlined add">add</span>
                                    <span className="material-symbols-outlined check">
                                        done
                                    </span>
                                </div>
                                <span style={{ fontSize: '0.8rem' }}>Sold Out</span>
                            </label>
                        </div>
                    </div>}
                </div>
            </div>}



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
                <div className="property_cards_parent">
                    {filteredProperty &&
                        filteredProperty.map((property) => (
                            <PropertyCard key={property.id} propertydoc={property} />
                        ))}
                </div>
            )}
            <div className="verticall_gap"></div>
            <div className="verticall_gap_991"></div>
            </div>
           </div>
        </div>
    );
};

export default PropdialAllProperties;
