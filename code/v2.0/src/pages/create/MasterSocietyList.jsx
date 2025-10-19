import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectFirestore } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { useCommon } from "../../hooks/useCommon";
import Select from "react-select";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
// component
import NineDots from "../../components/NineDots";
import MasterSocietyTable from "./MasterSocietyTable";

export default function MasterSocietyList() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const { user } = useAuthContext();
  const { camelCase } = useCommon();
  const { addDocument, response } = useFirestore("m_societies");
  const { updateDocument, response: responseUpdateDocument } = useFirestore("m_societies");

  //Master Data Loading Initialisation - Start
  const { documents: masterCountry, error: masterCountryerror } = useCollection("m_countries", "", ["country", "asc"]);
  const { documents: masterState, error: masterStateError } = useCollection(
    "m_states",
    ["country", "==", "_india"],
    ["state", "asc"]
  );
  const { documents: masterCity, error: masterCityError } = useCollection("m_cities", "", ["city", "asc"]);

  const [filteredLocalityData, setfilteredLocalityData] = useState();
  const [filteredSocietyData, setfilteredSocietyData] = useState();

  const [country, setCountry] = useState({ label: "INDIA", value: "_india" });
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [locality, setLocality] = useState(null);
  const [society, setSociety] = useState();
  const [selectedCategory, setSelectedCategory] = useState("Residential");

  // Use useState for options to ensure reactivity
  const [stateOptions, setStateOptions] = useState([{ label: "Select State", value: "" }]);
  const [cityOptions, setCityOptions] = useState([{ label: "Select City", value: "" }]);
  const [localityOptions, setLocalityOptions] = useState([{ label: "Select Locality", value: "" }]);

  const [formError, setFormError] = useState(null);
  const [formErrorType, setFormErrorType] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formBtnText, setFormBtnText] = useState("");
  const [currentDocid, setCurrentDocid] = useState(null);
  const [handleAddSectionFlag, sethandleAddSectionFlag] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  // Real-time listeners references
  const citiesListenerRef = useRef(null);
  const localitiesListenerRef = useRef(null);
  const societiesListenerRef = useRef(null);

  // Initialize data on component mount
  useEffect(() => {
    if (masterState && masterState.length > 0) {
      setStateOptions([
        { label: "Select State", value: "" },
        ...masterState.map((stateData) => ({
          label: stateData.state,
          value: stateData.id,
        }))
      ]);
    }
  }, [masterState]);

  // Cleanup listeners on component unmount
  useEffect(() => {
    return () => {
      if (citiesListenerRef.current) {
        citiesListenerRef.current();
      }
      if (localitiesListenerRef.current) {
        localitiesListenerRef.current();
      }
      if (societiesListenerRef.current) {
        societiesListenerRef.current();
      }
    };
  }, []);

  const handleStateChange = async (option) => {
    setState(option);
    setCity(null);
    setLocality(null);
    setfilteredSocietyData(null);

    // Cleanup previous listeners
    if (citiesListenerRef.current) {
      citiesListenerRef.current();
    }
    if (localitiesListenerRef.current) {
      localitiesListenerRef.current();
    }
    if (societiesListenerRef.current) {
      societiesListenerRef.current();
    }

    if (option && option.value) {
      // Load cities only for selected state with real-time listener
      setupCitiesRealTimeListener(option.value);
    } else {
      setCityOptions([{ label: "Select City", value: "" }]);
      setLocalityOptions([{ label: "Select Locality", value: "" }]);
    }
  };

  // Real-time listener for cities
  const setupCitiesRealTimeListener = (stateId) => {
    const ref = projectFirestore
      .collection("m_cities")
      .where("state", "==", stateId)
      .orderBy("city", "asc");

    citiesListenerRef.current = ref.onSnapshot(
      (snapshot) => {
        if (snapshot.docs && snapshot.docs.length > 0) {
          setCityOptions([
            { label: "Select City", value: "" },
            ...snapshot.docs.map((cityData) => ({
              label: cityData.data().city,
              value: cityData.id,
            }))
          ]);
        } else {
          setCityOptions([{ label: "Select City", value: "" }]);
        }

        // Reset locality
        setLocalityOptions([{ label: "Select Locality", value: "" }]);
        setCity(null);
      },
      (error) => {
        console.error("Error loading cities:", error);
        setCityOptions([{ label: "Select City", value: "" }]);
        setLocalityOptions([{ label: "Select Locality", value: "" }]);
        setCity(null);
      }
    );
  };

  const handleCityChange = async (option) => {
    setCity(option);
    setLocality(null);
    setfilteredSocietyData(null);

    // Cleanup previous listeners
    if (localitiesListenerRef.current) {
      localitiesListenerRef.current();
    }
    if (societiesListenerRef.current) {
      societiesListenerRef.current();
    }

    if (option && option.value) {
      // Load localities only for selected city with real-time listener
      setupLocalitiesRealTimeListener(option.value);
    } else {
      setLocalityOptions([{ label: "Select Locality", value: "" }]);
    }
  };

  // Real-time listener for localities
  const setupLocalitiesRealTimeListener = (cityId) => {
    const ref = projectFirestore
      .collection("m_localities")
      .where("city", "==", cityId)
       .where("status", "==", "active") 
      .orderBy("locality", "asc");

    localitiesListenerRef.current = ref.onSnapshot(
      (snapshot) => {
        if (snapshot.docs && snapshot.docs.length > 0) {
          setLocalityOptions([
            { label: "Select Locality", value: "" },
            ...snapshot.docs.map((localityData) => ({
              label: localityData.data().locality,
              value: localityData.id,
            }))
          ]);
        } else {
          setLocalityOptions([{ label: "Select Locality", value: "" }]);
        }

        setLocality(null);
      },
      (error) => {
        console.error("Error loading localities:", error);
        setLocalityOptions([{ label: "Select Locality", value: "" }]);
        setLocality(null);
      }
    );
  };

  const handleLocalityChange = async (option) => {
    setLocality(option);

    // Cleanup previous society listener
    if (societiesListenerRef.current) {
      societiesListenerRef.current();
    }

    if (option && option.value) {
      // Setup real-time listener for societies
      setupSocietiesRealTimeListener(option.value);
    } else {
      setfilteredSocietyData(null);
    }
  };

  // Real-time listener for societies
  const setupSocietiesRealTimeListener = (localityId) => {
    const ref = projectFirestore
      .collection("m_societies")
      .where("locality", "==", localityId)
      .orderBy("society", "asc");

    societiesListenerRef.current = ref.onSnapshot(
      (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        console.log("Real-time societies update: ", results);
        setfilteredSocietyData(results);
      },
      (error) => {
        console.error("Error fetching societies:", error);
        setfilteredSocietyData([]);
      }
    );
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const category = [
    { id: "residential", value: "Residential", label: "Residential" },
    { id: "commercial", value: "Commercial", label: "Commercial" },
    { id: "both", value: "Both", label: "Both" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setFormError(null);
    setFormErrorType(null);

    if (society && locality && locality.value) {
      let societyname = camelCase(society.trim());
      let locality_docid = locality.value;

      if (currentDocid) {
        // Update logic
        const ref = projectFirestore
          .collection("m_societies")
          .where("locality", "==", locality_docid)
          .where("society", "==", societyname);

        const snapshot = await ref.get();

        if (snapshot.empty) {
          const dataSet = {
            country: country.value,
            state: state.value,
            city: city.value,
            locality: locality.value,
            society: societyname,
            category: selectedCategory,
          };

          await updateDocument(currentDocid, dataSet);
          setFormErrorType("success_msg");
          setFormError("Successfully updated");

          // Form reset after successful update
          if (!handleAddSectionFlag) {
            setSociety("");
            setCurrentDocid(null);
          }
        } else {
          setFormErrorType("error_msg");
          setFormError("Already added");
        }
      } else {
        // Add new logic
        const ref = projectFirestore
          .collection("m_societies")
          .where("locality", "==", locality_docid)
          .where("society", "==", societyname);

        const snapshot = await ref.get();
        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        if (results.length === 0) {
          const dataSet = {
            country: country.value,
            state: state.value,
            city: city.value,
            locality: locality.value,
            society: societyname,
            status: "active",
            category: selectedCategory,
          };

          await addDocument(dataSet);
          setFormErrorType("success_msg");
          setFormError("Successfully added");
          setSociety("");

          // Society automatically appear in the list due to real-time listener
        } else {
          setFormErrorType("error_msg");
          setFormError("Already added");
        }
      }
    } else {
      setFormErrorType("error_msg");
      setFormError("Society and Locality are required");
    }

    setIsAdding(false);
    setTimeout(() => {
      setFormError(null);
      setFormErrorType(null);
    }, 5000);
  };

  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);

  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };

  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };

  const handleAddSection = () => {
    setFormError(null);
    sethandleAddSectionFlag(!handleAddSectionFlag);
    setFormBtnText(handleAddSectionFlag ? "Add Society" : "Update Society");
    if (!handleAddSectionFlag) {
      setSociety("");
      setCurrentDocid(null);
    }
  };

  const handleChangeStatus = async (docid, status) => {
    const newStatus = status === "active" ? "inactive" : "active";
    await updateDocument(docid, { status: newStatus });
    // Status change automatically reflected due to real-time listener
  };

  const handleEditCard = (docid, doccountry, docstate, doccity, doclocality, docsociety, doccategory) => {
    window.scrollTo(0, 0);
    setFormError(null);
    setSociety(docsociety);
    setSelectedCategory(doccategory || "Residential");
    sethandleAddSectionFlag(true);
    setFormBtnText("Update Society");
    setCurrentDocid(docid);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Filter societies based on search input
  const filteredSocieties = filteredSocietyData ? filteredSocietyData.filter(society => {
    if (!searchInput) return true;
    const searchLower = searchInput.toLowerCase();
    return (
      society.society.toLowerCase().includes(searchLower)
    );
  }) : [];

  // nine dots menu start
  const nineDotsAdminMenu = [
    { title: "Society's List", link: "/societylist", icon: "home" },
  ];

  const nineDotsMenu = [
    { title: "State's List", link: "/statelist", icon: "map" },
    { title: "Locality's List", link: "/localitylist", icon: "holiday_village" },
    { title: "City's List", link: "/citylist", icon: "location_city" },
  ];

  const [viewMode, setviewMode] = useState("card_view");

  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };

  const slugify = (text) => {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  return (
    <>
      <div className="top_header_pg pg_bg pg_adminproperty ">
        <div className="page_spacing pg_min_height">
          <NineDots nineDotsMenu={user && user.role === "superAdmin" ? nineDotsMenu : nineDotsAdminMenu} />

          <div className="pg_header d-flex justify-content-between">
            <div className="left">
              <h2 className="m22">Search for Societies</h2>
            </div>
            <div className="right">
              <img src="/assets/img/icons/excel_logo.png" alt="propdial" className="excel_dowanload" />
            </div>
          </div>

          <div className="vg12"></div>

          <div className="filters">
            <div className="left" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
              {/* State Select */}
              <div>
                <Select
                  key={stateOptions.length}
                  className=""
                  onChange={handleStateChange}
                  options={stateOptions}
                  value={state}
                  placeholder="Select State"
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      outline: "none",
                      background: "#eee",
                      borderBottom: "1px solid var(--theme-blue)",
                      width: "300px",
                    }),
                  }}
                />
              </div>

              {/* City Select */}
              <div>
                <Select
                  key={cityOptions.length}
                  className=""
                  onChange={handleCityChange}
                  options={cityOptions}
                  value={city}
                  isDisabled={!state || !state.value}
                  placeholder={!state || !state.value ? "First select state" : "Select City"}
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      outline: "none",
                      background: "#eee",
                      borderBottom: "1px solid var(--theme-blue)",
                      width: "300px",
                    }),
                  }}
                />
              </div>

              {/* Locality Select */}
              <div>
                <Select
                  key={localityOptions.length}
                  className=""
                  onChange={handleLocalityChange}
                  options={localityOptions}
                  value={locality}
                  isDisabled={!city || !city.value}
                  placeholder={!city || !city.value ? "First select city" : "Select Locality"}
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      outline: "none",
                      background: "#eee",
                      borderBottom: "1px solid var(--theme-blue)",
                      width: "300px",
                    }),
                  }}
                />
              </div>

              {/* Search Field */}
              <div className="rt_global_search search_field">
                <input
                  placeholder="Search societies..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                <div className="field_icon">
                  <span className="material-symbols-outlined">search</span>
                </div>
              </div>
            </div>

            <div className="right">
              <div className="button_filter diff_views">
                <div className={`bf_single ${viewMode === "card_view" ? "active" : ""}`} onClick={() => handleModeChange("card_view")}>
                  <span className="material-symbols-outlined">calendar_view_month</span>
                </div>
                <div className={`bf_single ${viewMode === "table_view" ? "active" : ""}`} onClick={() => handleModeChange("table_view")}>
                  <span className="material-symbols-outlined">view_list</span>
                </div>
              </div>

              {user?.role === "superAdmin" && (
                <div onClick={handleAddSection} className={`theme_btn no_icon header_btn ${handleAddSectionFlag ? "btn_border" : "btn_fill"}`}>
                  {handleAddSectionFlag ? "Cancel" : "Add New"}
                </div>
              )}
            </div>
          </div>

          {/* Add Society Form */}
          <div style={{
            overflow: handleAddSectionFlag ? "visible" : "hidden",
            opacity: handleAddSectionFlag ? "1" : "0",
            maxHeight: handleAddSectionFlag ? "100%" : "0",
            background: "var(--theme-blue-bg)",
            marginLeft: handleAddSectionFlag ? "-22px" : "0px",
            marginRight: handleAddSectionFlag ? "-22px" : "0px",
            marginTop: handleAddSectionFlag ? "22px" : "0px",
            padding: handleAddSectionFlag ? "32px 22px" : "0px",
            transition: "all 0.3s ease-in-out"
          }}>
            <form>
              <div className="row row_gap form_full">
                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Society Name</label>
                    <div className="form_field_inner">
                      <input
                        required
                        type="text"
                        placeholder="Enter Society Name"
                        onChange={(e) => setSociety(e.target.value)}
                        value={society}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-xl-4 col-lg-6">
                  <div className="form_field st-2 label_top">
                    <label htmlFor="">Category</label>
                    <div className="field_box theme_radio_new">
                      <div className="theme_radio_container" style={{ padding: "0px", border: "none", margin: "10px 0px" }}>
                        {category.map((c) => (
                          <div className="radio_single" key={c.id}>
                            <input
                              type="radio"
                              name="category_type"
                              id={c.id}
                              value={c.value}
                              onChange={handleCategoryChange}
                              checked={selectedCategory === c.value}
                            />
                            <label className="label" htmlFor={c.id}>{c.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="vg22"></div>

              <div className="btn_and_msg_area">
                {formError && (
                  <div className={`msg_area big_font ${formErrorType}`}>{formError}</div>
                )}

                <div className="d-flex align-items-center justify-content-end" style={{ gap: "15px" }}>
                  <div className="theme_btn btn_border no_icon text-center" onClick={handleAddSection} style={{ minWidth: "140px" }}>
                    Close
                  </div>
                  <div className="theme_btn btn_fill no_icon text-center" onClick={isAdding ? null : handleSubmit} style={{ minWidth: "140px" }}>
                    {isAdding ? "Processing..." : formBtnText}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="vg22"></div>

          {/* Results Section */}
          {filteredSocieties ? (
            filteredSocieties.length > 0 ? (
              <div className="m18">
                Found Societies: <span className="text_orange">{filteredSocieties.length}</span>
              </div>
            ) : locality && locality.value ? (
              <div className="m18">No societies found for selected locality</div>
            ) : null
          ) : locality && locality.value ? (
            <div className="m18">Loading societies...</div>
          ) : (
            <div className="m18">Please select a locality to view societies</div>
          )}

          {/* Society List Display */}
          {filteredSocieties && filteredSocieties.length > 0 && (
            <div className="master_data_card">
              {viewMode === "card_view" && (
                <>
                  {filteredSocieties.map((data) => {
                    const localityDoc = masterCity?.find((e) => e.id === data.locality);
                    const localityName = localityDoc?.locality || locality?.label;
                    const cityName = masterCity?.find((e) => e.id === data.city)?.city;
                    const stateName = masterState?.find((e) => e.id === data.state)?.state;
                    const countryName = masterCountry?.find((e) => e.id === data.country)?.country;

                    const url = `/${slugify(countryName || "")}/${slugify(stateName || "")}/${slugify(cityName || "")}/${slugify(localityName || "")}/${slugify(data.society || "")}/${data.id}`;

                    return (
                      <div className="property-status-padding-div" key={data.id}>
                        <div className="profile-card-div" style={{ position: "relative" }}>
                          <div className="address-div" style={{ paddingBottom: "0px", border: "none" }}>
                            <div className="icon" style={{ position: "relative", top: "-1px" }}>
                              <span className="material-symbols-outlined" style={{ color: "var(--darkgrey-color)" }}>flag</span>
                            </div>
                            <div className="address-text">
                              <div
                                onClick={
                                  user?.role === "superAdmin"
                                    ? () =>
                                      handleEditCard(
                                        data.id,
                                        data.country,
                                        data.state,
                                        data.city,
                                        data.locality,
                                        data.society,
                                        data.category || "Residential"
                                      )
                                    : undefined // agar superAdmin nahi hai to click disabled
                                }
                                style={{ width: "80%", height: "170%", textAlign: "left", display: "flex", justifyContent: "center", flexDirection: "column", transform: "translateY(-7px)", cursor: "pointer" }}
                              >
                                <h5 style={{ margin: "0", transform: "translateY(5px)" }}>
                                  {data.society}

                                  {user?.role === "superAdmin" && (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#00a8a8"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
                                  )}

                                </h5>
                                <small style={{ margin: "0", transform: "translateY(5px)" }}>
                                  {localityName}, {cityName}, {stateName}, {countryName}
                                </small>
                              </div>
                              <div
                                onClick={
                                  user?.role === "superAdmin"
                                    ? () => handleChangeStatus(data.id, data.status)
                                    : undefined
                                }
                                style={{ width: "20%", height: "calc(100% - -20px)", position: "relative", top: "-8px", display: "flex", alignItems: "center", justifyContent: "flex-end", cursor: "pointer" }}
                              >
                                <small style={{
                                  margin: "0",
                                  background: data.status === "active" ? "var(--theme-green2)" : "var(--theme-red)",
                                  color: "#fff",
                                  padding: "3px 10px 3px 10px",
                                  borderRadius: "4px",
                                  cursor: "pointer"
                                }}>
                                  {data.status}
                                </small>
                              </div>
                            </div>
                          </div>

                          <Link to={url} state={{ societyId: data.id }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid #d4d0d0ff", padding: "5px 0px" }}>
                              <small style={{ margin: "0", cursor: "pointer", color: "var(--theme-green)", fontWeight: "500" }}>
                                View Detail <span style={{ fontSize: "14px", fontWeight: "800" }}>→</span>
                              </small>
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {viewMode === "table_view" && (
                <MasterSocietyTable filterData={filteredSocieties} handleEditCard={handleEditCard} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


