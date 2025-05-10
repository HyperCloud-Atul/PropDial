import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./PGSearchProperty.scss";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import Switch from "react-switch";
import { Navigate, Link } from "react-router-dom";
// component
import Banner from "../../components/Banner";
import BottomRightFixedIcon from "../../components/BottomRightFixedIcon";
import PropdialPropertyCard from "../../components/property/SearchProperty";
import PropAgentPropertyCard from "../../components/property/SearchPropAgentProperty";
import CitySelector from "../../components/CitySelector";
import { useCity } from "../../hooks/useCity";
import { Loader, MapPin } from "lucide-react";

const PGSearchProperty = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  const { city, setOpenCityModal } = useCity();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const [activeOption, setActiveOption] = useState("Rent");
  const [checked, setChecked] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Residential");

  // const { documents: propdialProperties, error: propdialPropertiesError } = useCollection("properties-propdial", ["postedBy", "==", "Propdial"]);
  const { documents: propdialProperties, error: propdialPropertiesError } =
    useCollection("properties-propdial", "", ["createdAt", "desc"]);

  // const { documents: propagentProperties, error: propagentPropertiesError } = useCollection("properties-propagent", ["postedBy", "==", "Agent"]);
  // const { documents: propagentProperties, error: propagentPropertiesError } =
  //   useCollection("properties-propagent");

  // functionality for fav start
  // const [favoritedProperties, setFavoritedProperties] = useState([]);
  // const [favoriteCount, setFavoriteCount] = useState(0);

  // useEffect(() => {
  //   const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
  //   setFavoritedProperties(savedFavorites);
  //   setFavoriteCount(savedFavorites.length);
  // }, []);

  // const handleUpdateFavorites = (updatedFavorites) => {
  //   setFavoritedProperties(updatedFavorites);
  //   setFavoriteCount(updatedFavorites.length);
  //   localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  // };

  // const filterFavoriteProperties = (properties) => {
  //   return properties.filter((property) => favoritedProperties.includes(property.id));
  // };

  const [favoritedProperties, setFavoritedProperties] = useState([]);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Load saved favorites on component mount and filter out any removed properties
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Only filter if propdialProperties is not null or undefined
    if (propdialProperties) {
      const updatedFavorites = savedFavorites.filter((favId) =>
        propdialProperties.some((property) => property.id === favId)
      );

      setFavoritedProperties(updatedFavorites);
      setFavoriteCount(updatedFavorites.length);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  }, [propdialProperties]);

  // Update favorites list and save to localStorage
  const handleUpdateFavorites = (updatedFavorites) => {
    setFavoritedProperties(updatedFavorites);
    setFavoriteCount(updatedFavorites.length);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Filter favorite properties based on IDs
  const filterFavoriteProperties = (properties) => {
    return properties.filter((property) =>
      favoritedProperties.includes(property.id)
    );
  };
  // functionality for fav end

  // previous filter for rent and sale start
  // const filteredPropdialProperties = propdialProperties && propdialProperties.filter((property) => {
  //   return ((activeOption === "Rent" ? property.flag.toLowerCase() === "available for rent" : property.flag.toLowerCase() === "available for sale") && (property.category === activeCategory));
  // });
  // previous filter for rent and sale end

  // previous Filter for  recent properties start
  // const filteredPropdialPropertiesRecent = propdialProperties && propdialProperties
  //   .filter((property) => ((activeOption === "Rent" ? property.flag.toLowerCase() === "available for rent" : property.flag.toLowerCase() === "available for sale") && (property.category === activeCategory)))
  //   .slice(0, 3);
  // const filteredPropdialPropertiesRecent =
  //   propdialProperties &&
  //   propdialProperties
  //     .filter(
  //       (property) =>
  //         property.isActiveInactiveReview.toLowerCase() === "active" &&
  //         (activeOption === "Rent"
  //           ? property.flag.toLowerCase() === "available for rent" ||
  //             property.flag.toLowerCase() === "rent and sale"
  //           : activeOption === "Sale"
  //           ? property.flag.toLowerCase() === "available for sale" ||
  //             property.flag.toLowerCase() === "rent and sale" ||
  //             property.flag.toLowerCase() === "rented but sale"
  //           : activeOption === "RentSaleBoth"
  //           ? property.purpose === "RentSaleBoth"
  //           : true) &&
  //         property.category === activeCategory
  //     )
  //     .slice(0, 3);
  const filteredPropdialPropertiesRecent =
    propdialProperties &&
    propdialProperties
      .filter(
        (property) => property.isActiveInactiveReview.toLowerCase() === "active"
      )
      .slice(0, 10);

  console.log("All propdialProperties: ", propdialProperties);
  console.log(
    "All filteredPropdialPropertiesRecent: ",
    filteredPropdialPropertiesRecent
  );

  // previous Filter for  recent properties end

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // filterd propdial property with search  start
  const filteredPropdialProperties =
    propdialProperties &&
    propdialProperties.filter((property) => {
      let categoryMatch = true;
      let purposeMatch = true;
      let searchMatch = true;

      // Filter by category
      categoryMatch =
        property.category.toUpperCase() === activeCategory.toUpperCase();

      // Filter by purpose
      purposeMatch =
        property.isActiveInactiveReview.toLowerCase() === "active" &&
        (activeOption === "Rent"
          ? property.flag.toLowerCase() === "available for rent" ||
            property.flag.toLowerCase() === "rent and sale"
          : activeOption === "Sale"
          ? property.flag.toLowerCase() === "available for sale" ||
            property.flag.toLowerCase() === "rent and sale" ||
            property.flag.toLowerCase() === "rented but sale"
          : activeOption === "RentSaleBoth"
          ? property.purpose.toLowerCase() === "rentsaleboth"
          : true);

      // Filter by search input
      searchMatch = searchQuery
        ? Object.values(property).some(
            (field) =>
              typeof field === "string" &&
              field.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;

      return categoryMatch && purposeMatch && searchMatch;
    });

  // filter propdial property with search end

  // filter propdial recent property with search start
  // const filteredPropdialPropertiesRecent = propdialProperties && propdialProperties
  //   .filter((property) => {
  //     let categoryMatch = true;
  //     let purposeMatch = true;
  //     let searchMatch = true;

  //     // Filter by category
  //     categoryMatch = property.category.toUpperCase() === activeCategory.toUpperCase();

  //     // Filter by purpose
  //     purposeMatch = (activeOption === "Rent" ? property.flag.toLowerCase() === "available for rent" : property.flag.toLowerCase() === "available for sale");

  //     // Filter by search input
  //     searchMatch = searchQuery
  //       ? Object.values(property).some(
  //         (field) =>
  //           typeof field === "string" &&
  //           field.toLowerCase().includes(searchQuery.toLowerCase())
  //       )
  //       : true;

  //     return categoryMatch && purposeMatch && searchMatch;
  //   })
  //   .slice(0, 3);
  // filtered propdial recent property with search end

  const handleChange = (checked) => {
    setActiveOption(checked ? "Sale" : "Rent");
    setChecked(checked);
  };

  const handleOptionClick = (option) => {
    setActiveOption(option);
  };
  if (!city) {
    setOpenCityModal(true);
  }
  return (
    <div className="pg_property aflbg guest_property">
      {/* <Banner></Banner> */}
      <BottomRightFixedIcon></BottomRightFixedIcon>

      <div className="theme_tab">
        <Tabs>
          <section className="property_cards">
            <div className="property_divide">
              <div
                className="filtered_property"
                style={{
                  padding: "0px",
                }}
              >
                <div className="top_search_bar">
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className="property_search_parent">
                      <input
                        type="search"
                        value={searchQuery}
                        className="property_search"
                        onChange={handleSearchChange}
                        placeholder="Search By Society, Locality, City, State... "
                      />
                      <div className="icon">
                        <span className="material-symbols-outlined">
                          search
                        </span>
                      </div>
                    </div>
                    <div>
                      <button
                        className="location"
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          gap: "5px",
                          alignItems: "center",
                          justifyContent: "end",
                          border: "none",
                          background: "white",
                          width: "100%",
                          padding: "8px",
                          borderRadius: "5px",
                        }}
                        onClick={() => setOpenCityModal(true)}
                      >
                        <MapPin style={{ width: "16px", height: "16px" }} />
                        <span
                          style={{
                            fontSize: "14px",
                            marginTop: "3px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {city}
                        </span>
                      </button>
                      <CitySelector />
                    </div>
                  </div>

                  <div className="new_inline">
                    {/* <div className="mobile_size residentail_commercial">
                        <label className={checked ? "on" : "off"}>
                          <div className="switch">
                            <span
                              className={`Residential ${
                                checked ? "off" : "on"
                              }`}
                            >
                              Residential
                            </span>
                            <Switch
                              onChange={handleChange}
                              checked={checked}
                              handleDiameter={20} // Set the handle diameter (optional)
                              uncheckedIcon={false} // Hide the wrong/right icon
                              checkedIcon={false} // Hide the wrong/right icon
                              className="pointer"
                            />
                            <span
                              className={`Commercial ${checked ? "on" : "off"}`}
                            >
                              Commercial
                            </span>
                          </div>
                        </label>
                      </div> */}
                    <div className="project-filter">
                      <nav>
                        <button
                          className={`pointer ${
                            activeCategory === "Residential" ? "active" : ""
                          }`}
                          onClick={() => setActiveCategory("Residential")}
                        >
                          Residential
                        </button>
                        <button
                          className={`pointer ${
                            activeCategory === "Commercial" ? "active" : ""
                          }`}
                          onClick={() => setActiveCategory("Commercial")}
                        >
                          Commercial
                        </button>
                        <button
                          className={`pointer ${
                            activeCategory === "Plot" ? "active" : ""
                          }`}
                          onClick={() => setActiveCategory("Plot")}
                        >
                          Plot
                        </button>
                      </nav>
                    </div>
                  </div>
                  {/* <div className="search_area_body">
                      <div className="search_by">
                        <div className="search_by_single">
                          <select name="" id="" className="pointer">
                            <option value="" selected>
                              Select State
                            </option>
                            <option value="">Madhya Pradesh</option>
                            <option value="">Maharastra</option>
                            <option value="">Uttar Pradesh</option>
                            <option value="">Arunachal Pradesh</option>
                          </select>
                        </div>
                        <div className="search_by_single">
                          <select name="" id="" className="pointer">
                            <option value="" selected>
                              Select City
                            </option>
                            <option value="">Ujjain</option>
                            <option value="">Pune</option>
                            <option value="">Indore</option>
                            <option value="">Bhopal</option>
                          </select>
                        </div>
                        <div className="search_by_single">
                          <select name="" id="" className="pointer">
                            <option value="" selected>
                              Select BHK
                            </option>
                            <option value=""> 1 BHK</option>
                            <option value="">2 BHK</option>
                            <option value=""> 3 BHK</option>
                          </select>
                        </div>
                      </div>
                      <div className="search_property pointer">
                        <Link to="/search-property">
                          <button className="theme_btn btn_fill">
                            Search
                            <span className="material-symbols-outlined btn_arrow ba_animation">
                              arrow_forward
                            </span>
                          </button>
                        </Link>
                      </div>
                    </div> */}
                </div>
                <div className="tab_and_filter">
                  <TabList className="tabs">
                    <Tab className="pointer">
                      Properties (
                      {filteredPropdialProperties &&
                        filteredPropdialProperties.length}
                      )
                    </Tab>
                    <Tab className="pointer">Favorites ({favoriteCount})</Tab>
                  </TabList>
                  {activeCategory !== "Plot" && (
                    <div className="mobile_size residentail_commercial rent_buy">
                      <label className={checked ? "on" : "off"}>
                        <div className="switch">
                          <span
                            className={`Residential ${checked ? "off" : "on"}`}
                          >
                            {activeCategory === "Residential"
                              ? "Rent"
                              : "Lease"}
                          </span>
                          <Switch
                            onChange={handleChange}
                            checked={checked}
                            handleDiameter={20} // Set the handle diameter (optional)
                            uncheckedIcon={false} // Hide the wrong/right icon
                            checkedIcon={false} // Hide the wrong/right icon
                            className="pointer"
                          />
                          <span
                            className={`Commercial ${checked ? "on" : "off"}`}
                          >
                            Buy
                          </span>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* {activeCategory !== "Plot" && (
                      <div className="new_inline">
                        <div className="project-filter">
                          <nav>
                            <button
                              className={`pointer ${
                                activeOption === "Rent" ? "active" : ""
                              }`}
                              onClick={() => handleOptionClick("Rent")}
                            >
                              {activeCategory === "Residential"
                                ? "Rent"
                                : "Lease"}
                            </button>
                            <button
                              className={`pointer ${
                                activeOption === "Sale" ? "active" : ""
                              }`}
                              onClick={() => handleOptionClick("Sale")}
                            >
                              Buy
                            </button>
                          </nav>
                        </div>
                      </div>
                    )} */}
                </div>
                <TabPanel>
                  {city ? (
                    <div className="property_card_left">
                      {filteredPropdialProperties && (
                        <PropdialPropertyCard
                          propertiesdocuments={filteredPropdialProperties}
                          activeOption={activeOption}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="loader">
                      <Loader className="loader-icon" />
                    </div>
                  )}
                </TabPanel>
                <TabPanel>
                  <div className="property_card_left">
                    {filterFavoriteProperties(propdialProperties || []).length >
                    0 ? (
                      <PropdialPropertyCard
                        propertiesdocuments={filterFavoriteProperties(
                          propdialProperties
                        )}
                        onUpdateFavorites={handleUpdateFavorites}
                        activeOption={activeOption}
                      />
                    ) : (
                      <p>No favorite properties yet!</p>
                    )}
                  </div>
                </TabPanel>
              </div>

              {/* Recent Properties start */}
              <div
                className="recent_property"
                style={{
                  padding: "0px",
                }}
              >
                <div className="header">
                  <div className="section_title_effect">Just Listed</div>
                  <h6>See what's newly added</h6>
                </div>
                <div className="pp_sidebar">
                  {city && (
                    <div className="pp_sidebar_cards">
                      {filteredPropdialPropertiesRecent && (
                        <PropAgentPropertyCard
                          propagentProperties={filteredPropdialPropertiesRecent}
                          activeOption={activeOption}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Recent Properties end*/}
            </div>
          </section>
        </Tabs>
      </div>
      <div className="vg22"></div>
    </div>
  );
};

export default PGSearchProperty;
