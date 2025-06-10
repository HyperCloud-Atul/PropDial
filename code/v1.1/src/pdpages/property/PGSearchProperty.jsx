import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./PGSearchProperty.css";
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

const PGSearchProperty = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const [activeOption, setActiveOption] = useState("Rent");
  const [checked, setChecked] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Residential");

  const { documents: propdialProperties, error: propdialPropertiesError } = useCollection("properties", ["postedBy", "==", "Propdial"]);
  const { documents: propagentProperties, error: propagentPropertiesError } = useCollection("properties", ["postedBy", "==", "Agent"]);

  // functionality for fav start 
  const [favoritedProperties, setFavoritedProperties] = useState([]);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavoritedProperties(savedFavorites);
    setFavoriteCount(savedFavorites.length);
  }, []);

  const handleUpdateFavorites = (updatedFavorites) => {
    setFavoritedProperties(updatedFavorites);
    setFavoriteCount(updatedFavorites.length);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const filterFavoriteProperties = (properties) => {
    return properties.filter((property) => favoritedProperties.includes(property.id));
  };
  // functionality for fav end 

  // previous filter for rent and sale start
  // const filteredPropdialProperties = propdialProperties && propdialProperties.filter((property) => {
  //   return ((activeOption === "Rent" ? property.flag.toLowerCase() === "available for rent" : property.flag.toLowerCase() === "available for sale") && (property.category === activeCategory));
  // });
  // previous filter for rent and sale end

  // previous Filter for  recent properties start
  const filteredPropdialPropertiesRecent = propdialProperties && propdialProperties
    .filter((property) => ((activeOption === "Rent" ? property.flag.toLowerCase() === "available for rent" : property.flag.toLowerCase() === "available for sale") && (property.category === activeCategory)))
    .slice(0, 3);
  // previous Filter for  recent properties end


  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };


  // filterd propdial property with search  start
  const filteredPropdialProperties = propdialProperties && propdialProperties.filter((property) => {
    let categoryMatch = true;
    let purposeMatch = true;
    let searchMatch = true;

    // Filter by category
    categoryMatch = property.category.toUpperCase() === activeCategory.toUpperCase();

    // Filter by purpose
    purposeMatch = (activeOption === "Rent" ? property.flag.toLowerCase() === "available for rent" : property.flag.toLowerCase() === "available for sale");

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
    setActiveCategory(checked ? "Commercial" : "Residential");
    setChecked(checked);
  };

  const handleOptionClick = (option) => {
    setActiveOption(option);
  };
  return (

    <div className="pg_property aflbg">
      {/* <Banner></Banner> */}
      <BottomRightFixedIcon></BottomRightFixedIcon>
      <div className="top_search_bar">
        <div className="property_search_parent">
          <input type="search" value={searchQuery} className="property_search" onChange={handleSearchChange} placeholder="Search By Society, Locality, City, State... " />
          <div className="icon">
            <span class="material-symbols-outlined">
              search
            </span>
          </div>
        </div>
        <div className="search_area_header">
          <div className="for_buy_rent">
            <div
              className={`pointer ${activeOption === 'Rent' ? 'active' : ''}`}
              onClick={() => handleOptionClick('Rent')}
            >
              Rent
            </div>
            <div
              className={`pointer ${activeOption === 'Sale' ? 'active' : ''}`}
              onClick={() => handleOptionClick('Sale')}
            >
              Sale
            </div>
          </div>
          <div className="mobile_size residentail_commercial">
            <label className={checked ? "on" : "off"}>
              <div className="switch">
                <span className={`Residential ${checked ? "off" : "on"}`} >
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
                <span className={`Commercial ${checked ? "on" : "off"}`}
                >
                  Commercial
                </span>
              </div>
            </label>
          </div>
        </div>
        {/* <div className="search_area_body">
          <div className="search_by">
            <div className="search_by_single">
              <select name="" id="" className="pointer">
                <option value="" selected>Select State</option>
                <option value="">Madhya Pradesh</option>
                <option value="">Maharastra</option>
                <option value="">Uttar Pradesh</option>
                <option value="">Arunachal Pradesh</option>
              </select>
            </div>
            <div className="search_by_single">
              <select name="" id="" className="pointer">
                <option value="" selected>Select City</option>
                <option value="">Ujjain</option>
                <option value="">Pune</option>
                <option value="">Indore</option>
                <option value="">Bhopal</option>
              </select>
            </div>
            <div className="search_by_single">
              <select name="" id="" className="pointer">
                <option value="" selected>Select BHK</option>
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
      <div className="theme_tab">
        <Tabs>
          <div className="container-fluid"></div>
          <section className="property_cards">
            <div className="container-fluid">
              <div className="row">
                <div className="col-xl-9">
                  <TabList className="tabs">
                    <Tab className="pointer">Properties ({filteredPropdialProperties && filteredPropdialProperties.length})</Tab>
                    <Tab className="pointer">Favorites ({favoriteCount})</Tab>
                  </TabList>
                  <TabPanel>
                    <div className="property_card_left">
                      {filteredPropdialProperties && <PropdialPropertyCard propertiesdocuments={filteredPropdialProperties} />}
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="property_card_left">
                      {filterFavoriteProperties(propdialProperties || []).length > 0 ? (
                        <PropdialPropertyCard
                          propertiesdocuments={filterFavoriteProperties(propdialProperties)}
                          onUpdateFavorites={handleUpdateFavorites}
                        />
                      ) : (
                        <p>No favorite properties yet!</p>
                      )}
                    </div>
                  </TabPanel>
                </div>

                {/* Recent Properties start */}
                <div className="col-xl-3">
                  <div className="pp_sidebar">
                    <div className="pp_sidebar_cards">
                      {filteredPropdialPropertiesRecent && <PropAgentPropertyCard propagentProperties={filteredPropdialPropertiesRecent} />}
                    </div>
                  </div>
                </div>
                {/* Recent Properties end*/}
              </div>
            </div>
          </section>
        </Tabs>
      </div>
      <div className="vg22"></div>

    </div>
  );
};

export default PGSearchProperty;
