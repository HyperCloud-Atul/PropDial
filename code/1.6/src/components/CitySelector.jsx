import { useEffect, useRef, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { useCity } from "../hooks/useCity";

import "./CitySelector.scss";
import {
  ChevronDown,
  ChevronUp,
  LocateFixed,
  SearchIcon,
  X,
} from "lucide-react";
import { useCollection } from "../hooks/useCollection";
import { projectFirestore } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MajorCities = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Gurugram",
  "Pune",
  "Noida",
  "Lucknow",
  "Ghaziabad",
];
const formatText = (text) => {
  return text
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const CitySelector = () => {
  const [searchResult, setSearchResult] = useState([]);
  const { city, openCityModal, setOpenCityModal, setCity } = useCity();
  const [searchQuery, setSearchQuery] = useState(city || "");
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [showMoreCities, setShowMoreCities] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const { documents: masterCities, error: masterCitiesError } = useCollection(
    "m_cities",
    null,
    ["city", "asc"]
  );

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!searchQuery || searchQuery.trim() === "") {
        setSearchResult([]);
        return;
      }
      const searchQueryFormatted = formatText(searchQuery.trim());
      const query = projectFirestore
        .collection("m_cities")
        .orderBy("city")
        .startAt(searchQueryFormatted)
        .endAt(searchQueryFormatted + "\uf8ff");

      const querySnapshot = await query.get();
      if (querySnapshot.empty) {
        console.log("No results found.");
        setSearchResult([]);
        return;
      }
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      console.log("results", results);
      setSearchResult(results);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResult(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!openCityModal) {
    return null;
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResult(true);
  };

  //   const getCity = async (lat, long) => {
  //     const url = `https://google-maps-geocoding3.p.rapidapi.com/reversegeocode?lat=${lat}&long=${long}`;
  //     const options = {
  //       method: "GET",
  //       headers: {
  //         "x-rapidapi-key": "0c6000cf5emshf168eeb78d4b398p1d778cjsn890b8c2fdb0e",
  //         "x-rapidapi-host": "google-maps-geocoding3.p.rapidapi.com",
  //       },
  //     };

  //     try {
  //       const response = await fetch(url, options);
  //       const result = await response.text();
  //       console.log(result);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  // const handleCurrentLocation = () => {
  //   console.log("button clicked");
  //   // if (!navigator.geolocation) {
  //   //   return;
  //   // }
  //   // const location = navigator.geolocation;
  //   // location.getCurrentPosition(async (position) => {
  //   //   const lat = position.coords.latitude;
  //   //   const long = position.coords.longitude;
  //   //   const value = await getCity(lat, long);
  //   //   console.log(value);
  //   // });
  // };

  return (
    <Modal
      show={openCityModal}
      className="city-modal"
      onHide={() => {
        if (!city) {
          toast.error("Please select a city");
          return;
        }
        setSearchQuery("");
        setSearchResult([]);
        setOpenCityModal(false);
        setShowMoreCities(false);
      }}
    >
      <ModalHeader className="city-modal-header">
        <div className="city-modal-header-title">
          <h5>Select City </h5>
          <button
            onClick={() => {
              if (!city) {
                toast.error("Please select a city");
                return;
              }
              setSearchQuery("");
              setSearchResult([]);
              setOpenCityModal(false);
              setShowMoreCities(false);
            }}
          >
            <X className="close-icon" />
          </button>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="city-modal-body">
          <div className="city-modal-body-search">
            <div className="city-modal-body-search-title">
              <h5>Search City</h5>
              {/* <button onClick={handleCurrentLocation}>
                <Locate className="locate-icon" />
                <span>Current Location</span>
              </button> */}
            </div>
            <div className="city-modal-search-wrapper" ref={searchRef}>
              <div className="city-modal-body-search-input">
                <div className="city-modal-body-search-input-icon">
                  <SearchIcon className="search-icon" />
                </div>
                <input
                  type="text"
                  placeholder="Search City"
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => {
                    if (searchResult.length > 0) setShowSearchResult(true);
                  }}
                />
              </div>
              {showSearchResult && (
                <div className="city-modal-body-list">
                  <h5 className="city-modal-body-list-title">Search Results</h5>
                  {searchResult.length > 0 ? (
                    <ul>
                      {searchResult.map((city) => (
                        <li
                          key={city.id}
                          onClick={() => {
                            setCity(city.city);
                            setSearchQuery("");
                            setSearchResult([]);
                            setShowSearchResult(false);
                            setOpenCityModal(false);
                          }}
                        >
                          <LocateFixed className="locate-icon" />
                          <span>{city.city}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="no-results">No results found.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="city-modal-body-major-city">
            <div className="city-modal-body-major-city-title">
              <h5>Major City</h5>
            </div>

            <div className="city-modal-body-major-city-list">
              {MajorCities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setCity(city);
                    setSearchQuery("");
                    setSearchResult([]);
                    setShowSearchResult(false);
                    setOpenCityModal(false);
                    navigate(0);
                  }}
                >
                  <LocateFixed className="locate-icon" /> <span>{city}</span>
                </button>
              ))}
            </div>

            <div className="city-modal-body-city-view">
              <div className="city-modal-body-city-view-title">
                <button onClick={() => setShowMoreCities(!showMoreCities)}>
                  <span>View more cities</span>
                  {showMoreCities ? (
                    <ChevronUp className="down-icon" />
                  ) : (
                    <ChevronDown className="down-icon" />
                  )}
                </button>
              </div>

              <div className="city-modal-body-city-view-list">
                {showMoreCities &&
                  masterCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setCity(city.city);
                        setSearchQuery("");
                        setSearchResult([]);
                        setShowMoreCities(false);
                        setShowSearchResult(false);
                        setOpenCityModal(false);
                        navigate(0);
                      }}
                    >
                      <LocateFixed className="locate-icon" />
                      <span>{city.city}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default CitySelector;
