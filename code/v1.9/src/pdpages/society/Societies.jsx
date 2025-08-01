import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectFirestore } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { useCommon } from "../../hooks/useCommon";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import "./society-style.scss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Societies = () => {
  const { documents: societyDoc, errors: societyDocError } =
    useCollection("m_societies");

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const { user } = useAuthContext();
  const { camelCase } = useCommon();
  const { addDocument } = useFirestore("m_societies");
  const { updateDocument } = useFirestore("m_societies");

  const { documents: masterCountry } = useCollection("m_countries", "", [
    "country",
    "asc",
  ]);
  const { documents: masterState } = useCollection("m_states", "", [
    "state",
    "asc",
  ]);
  const { documents: masterCity } = useCollection("m_cities", "", [
    "city",
    "asc",
  ]);

  const [filteredSocietyData, setFilteredSocietyData] = useState([]);
  const [country, setCountry] = useState({ label: "INDIA", value: "_india" });
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [locality, setLocality] = useState();
  const [society, setSociety] = useState();
  const [selectedCategory, setSelectedCategory] = useState("Residential");
  const [searchInput, setSearchInput] = useState(""); // ✅ search state

  const countryOptions = useRef([]);
  const stateOptions = useRef([]);
  const cityOptions = useRef([]);
  const localityOptions = useRef([]);

  useEffect(() => {
    if (masterCountry) {
      countryOptions.current = masterCountry.map((c) => ({
        label: c.country,
        value: c.id,
      }));
      handleCountryChange({ label: "INDIA", value: "_india" });
    }
  }, [masterCountry]);

  const handleCountryChange = async (option) => {
    setCountry(option);
    const ref = projectFirestore
      .collection("m_states")
      .where("country", "==", option.value)
      .orderBy("state", "asc");

    ref.onSnapshot((snapshot) => {
      stateOptions.current = snapshot.docs.map((doc) => ({
        label: doc.data().state,
        value: doc.id,
      }));

      if (stateOptions.current.length > 0) {
        handleStateChange(stateOptions.current[0]);
      } else {
        handleStateChange(null);
      }
    });
  };

  const handleStateChange = async (option) => {
    setState(option);
    if (!option) return;
    const ref = projectFirestore
      .collection("m_cities")
      .where("state", "==", option.value)
      .orderBy("city", "asc");

    ref.onSnapshot((snapshot) => {
      cityOptions.current = snapshot.docs.map((doc) => ({
        label: doc.data().city,
        value: doc.id,
      }));

      if (cityOptions.current.length > 0) {
        handleCityChange(cityOptions.current[0]);
      } else {
        handleCityChange(null);
      }
    });
  };

  const handleCityChange = async (option) => {
    setCity(option);
    if (!option) return;
    const ref = projectFirestore
      .collection("m_localities")
      .where("city", "==", option.value)
      .orderBy("locality", "asc");

    ref.onSnapshot((snapshot) => {
      localityOptions.current = snapshot.docs.map((doc) => ({
        label: doc.data().locality,
        value: doc.id,
      }));

      if (localityOptions.current.length > 0) {
        handleLocalityChange(localityOptions.current[0]);
      } else {
        handleLocalityChange(null);
      }
    });
  };

  const handleLocalityChange = async (option) => {
    setLocality(option);
    if (!option) return;

    const ref = projectFirestore
      .collection("m_societies")
      .where("locality", "==", option.value)
      .orderBy("society", "asc");

    ref.onSnapshot((snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setFilteredSocietyData(results);
    });
  };

  // ✅ Filter societies based on search input
  const filteredResults = filteredSocietyData.filter((item) =>
    item.society.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <div className="p-4">
        <div className="search">
          <h2 className="m22">Search for Societies</h2>
        </div>

        <div className="filters">
          <div
            className="left"
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            <div>
              <Select
                onChange={(e) => {
                  setState(e);
                  handleStateChange(e);
                }}
                options={stateOptions.current}
                value={state}
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    background: "#eee",
                    borderBottom: "1px solid var(--theme-blue)",
                    width: "300px",
                  }),
                }}
              />
            </div>

            <div>
              <Select
                onChange={(e) => {
                  setCity(e);
                  handleCityChange(e);
                }}
                options={cityOptions.current}
                value={city}
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    background: "#eee",
                    borderBottom: "1px solid var(--theme-blue)",
                    width: "300px",
                  }),
                }}
              />
            </div>

            <div>
              <Select
                onChange={(e) => {
                  setLocality(e);
                  handleLocalityChange(e);
                }}
                options={localityOptions.current}
                value={locality}
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    background: "#eee",
                    borderBottom: "1px solid var(--theme-blue)",
                    width: "300px",
                  }),
                }}
              />
            </div>

            <div className="rt_global_search search_field">
              <input
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)} // ✅ update search input
              />
              <div className="field_icon">
                <span className="material-symbols-outlined">search</span>
              </div>
            </div>
          </div>
        </div>

        {filteredSocietyData && filteredSocietyData.length > 0 ? (
          <div className="m18">
            Filtered Society:{" "}
            <span className="text_orange">{filteredResults.length}</span>
          </div>
        ) : (
          <div className="m18">No Society Found</div>
        )}
        {filteredResults.length > 0 && (
        <div className="society-grid">
          {filteredResults.map(item => (
            <Link
              to={`/pg-society/${item.id}`}
              className="location-card"
              key={item.id}
            >
              <div className="left">
                <div className="icon-box">
                  <img
                    src="/assets/img/building_icon.png"
                    alt="building icon"
                    className="flag-icon"
                  />
                </div>
                <div className="text-content">
                  <h2>{item.society}</h2>
                  <p>
                    <span>{city?.label}</span>, <span>{state?.label}</span>, <span>{country?.label}</span>
                  </p>
                </div>
              </div>
              <div className="status-badge">{item.status}</div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </>
  );
};

export default Societies;
