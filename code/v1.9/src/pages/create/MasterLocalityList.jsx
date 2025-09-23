import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectFirestore } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { useCommon } from "../../hooks/useCommon";
import Select from "react-select";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import MasterLocalityTable from "./MasterLocalityTable";
// component
import NineDots from "../../components/NineDots";

export default function MasterLocalityList() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  const { user } = useAuthContext();
  const { camelCase } = useCommon();
  const { addDocumentWithCustomDocId, response: responseAddDocument } = useFirestore("m_localities");
  const { updateDocument, response: responseUpdateDocument } = useFirestore("m_localities");

  //Master Data Loading Initialisation - Start
  const { documents: masterCountry, error: masterCountryerror } = useCollection("m_countries", "", ["country", "asc"]);
  const { documents: masterState, error: masterStateError } = useCollection(
    "m_states", 
    ["country", "==", "_india"],
    ["state", "asc"]
  );
  const { documents: masterCity, error: masterCityError } = useCollection("m_cities", "", ["city", "asc"]);

  const [filteredLocalityData, setfilteredLocalityData] = useState();
  const [country, setCountry] = useState({ label: "INDIA", value: "_india" });
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [locality, setLocality] = useState("");

  // Use useState for options to ensure reactivity
  const [stateOptions, setStateOptions] = useState([{ label: "Select State", value: "" }]);
  const [cityOptions, setCityOptions] = useState([{ label: "Select City", value: "" }]);

  const [formError, setFormError] = useState(null);
  const [formErrorType, setFormErrorType] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formBtnText, setFormBtnText] = useState("");
  const [currentDocid, setCurrentDocid] = useState(null);
  const [handleAddSectionFlag, sethandleAddSectionFlag] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Real-time listeners references
  const citiesListenerRef = useRef(null);
  const localitiesListenerRef = useRef(null);

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
    };
  }, []);

  const handleStateChange = async (option) => {
    setState(option);
    setCity(null);
    setfilteredLocalityData(null);
    
    // Cleanup previous listeners
    if (citiesListenerRef.current) {
      citiesListenerRef.current();
    }
    if (localitiesListenerRef.current) {
      localitiesListenerRef.current();
    }
    
    if (option && option.value) {
      // Load cities only for selected state with real-time listener
      setupCitiesRealTimeListener(option.value);
    } else {
      setCityOptions([{ label: "Select City", value: "" }]);
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
        
        setCity(null);
      },
      (error) => {
        console.error("Error loading cities:", error);
        setCityOptions([{ label: "Select City", value: "" }]);
        setCity(null);
      }
    );
  };

  const handleCityChange = async (option) => {
    setCity(option);
    
    // Cleanup previous locality listener
    if (localitiesListenerRef.current) {
      localitiesListenerRef.current();
    }
    
    if (option && option.value) {
      // Setup real-time listener for localities
      setupLocalitiesRealTimeListener(option.value);
    } else {
      setfilteredLocalityData(null);
    }
  };

  // Real-time listener for localities
  const setupLocalitiesRealTimeListener = (cityId) => {
    const ref = projectFirestore
      .collection("m_localities")
      .where("city", "==", cityId)
      .orderBy("locality", "asc");

    localitiesListenerRef.current = ref.onSnapshot(
      (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        console.log("Real-time localities update: ", results);
        setfilteredLocalityData(results);
      },
      (error) => {
        console.error("Error fetching localities:", error);
        setfilteredLocalityData([]);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormErrorType(null);
    setIsAdding(true);

    if (locality && city && city.value) {
      let localityname = camelCase(locality.trim());
      let isDuplicateLocality = city.value + "_" + localityname.split(" ").join("_").toLowerCase();

      if (currentDocid) {
        const ref = projectFirestore
          .collection("m_localities")
          .where("docId", "==", isDuplicateLocality);

        const snapshot = await ref.get();

        if (snapshot.empty) {
          const dataSet = {
            country: country.value,
            state: state.value,
            city: city.value,
            locality: localityname
          };

          await updateDocument(currentDocid, dataSet);    

          setFormErrorType("success_msg");
          setFormError("Successfully updated");
          setIsAdding(false);

          // Form reset after successful update
          if (!handleAddSectionFlag) {
            setLocality("");
            setCurrentDocid(null);
          }
        } else {
          setFormErrorType("error_msg");
          setFormError("Already added");
          setIsAdding(false);
        }
      } else {
        const ref = projectFirestore
          .collection("m_localities")
          .where("docId", "==", isDuplicateLocality);

        const snapshot = await ref.get();
        const results = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        if (results.length === 0) {
          const dataSet = {
            docId: city.value + "_" + localityname.split(" ").join("_").toLowerCase(),
            country: country.value,
            state: state.value,
            city: city.value,
            locality: localityname,
            status: "active",
          };

          const _customDocId = dataSet.docId;
          await addDocumentWithCustomDocId(dataSet, _customDocId);

          setFormErrorType("success_msg");
          setFormError("Successfully added");
          setIsAdding(false);
          setLocality("");
          
          // Locality automatically appear in the list due to real-time listener
        } else {
          setFormErrorType("error_msg");
          setFormError("Already added");
          setIsAdding(false);
        }
      }
    } else {
      setFormErrorType("error_msg");
      setFormError("Locality and City are required");
      setIsAdding(false);
    }

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
    setFormBtnText(handleAddSectionFlag ? "Add Locality" : "Update Locality");
    if (!handleAddSectionFlag) {
      setLocality("");
      setCurrentDocid(null);
    }
  };

  const handleChangeStatus = async (docid, status) => {
    const newStatus = status === "active" ? "inactive" : "active";
    await updateDocument(docid, { status: newStatus });
    // Status change automatically reflected due to real-time listener
  };

  const handleEditCard = (docid, doccountry, docstate, doccity, doclocality) => {
    window.scrollTo(0, 0);
    setFormError(null);
    setLocality(doclocality);
    sethandleAddSectionFlag(true);
    setFormBtnText("Update Locality");
    setCurrentDocid(docid);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Filter localities based on search input
  const filteredLocalities = filteredLocalityData ? filteredLocalityData.filter(locality => {
    if (!searchInput) return true;
    const searchLower = searchInput.toLowerCase();
    return (
      locality.locality.toLowerCase().includes(searchLower)
    );
  }) : [];

  // nine dots menu start
  const nineDotsAdminMenu = [
    { title: "Society's List", link: "/societylist", icon: "home" },
  ];
  
  const nineDotsMenu = [
    { title: "State's List", link: "/statelist", icon: "map" },
    { title: "City's List", link: "/citylist", icon: "location_city" },
    { title: "Society's List", link: "/societylist", icon: "home" },
  ];

  const [viewMode, setviewMode] = useState("card_view");

  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };

  return (
    <div className="top_header_pg pg_bg pg_adminproperty">   
      <div className={`page_spacing pg_min_height ${filteredLocalityData && filteredLocalityData.length === 0 && "pg_min_height"}`}>
        <NineDots nineDotsMenu={user && user.role === 'superAdmin' ? nineDotsMenu : nineDotsAdminMenu} />

        <div className="pg_header d-flex justify-content-between">
          <div className="left">
            <h2 className="m22">Search for Localities</h2>
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
                    width: '300px',
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
                    width: '300px',
                  }),
                }}
              />
            </div>

            <div className="rt_global_search search_field">
              <input
                placeholder="Search localities..."
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
            
            <div onClick={handleAddSection} className={`theme_btn no_icon header_btn ${handleAddSectionFlag ? "btn_border" : "btn_fill"}`}>
              {handleAddSectionFlag ? "Cancel" : "Add New"}
            </div>
          </div>
        </div>

        {/* Add Locality Form */}
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
                  <label htmlFor="">Locality Name</label>
                  <div className="form_field_inner">
                    <input
                      required
                      type="text"
                      placeholder="Enter Locality Name"
                      onChange={(e) => setLocality(e.target.value)}
                      value={locality}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="vg22"></div>

            <div className="btn_and_msg_area">
              {formError && (
                <div className={`msg_area big_font ${formErrorType}`}>
                  {formError}
                </div>
              )}

              <div className="d-flex align-items-center justify-content-end" style={{ gap: "15px" }}>
                <div className="theme_btn btn_border_red no_icon text-center" onClick={handleAddSection} style={{ minWidth: "140px" }}>
                  Close
                </div>
                <div className="theme_btn btn_fill no_icon text-center" onClick={isAdding ? null : handleSubmit} style={{ minWidth: "140px" }}>
                  {isAdding ? "Processing..." : formBtnText}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {filteredLocalities ? (
          filteredLocalities.length > 0 ? (
            <>
              <div className="vg22"></div>
              <div className="m18">
                Found Localities: <span className="text_orange">{filteredLocalities.length}</span>
              </div>
            </>
          ) : city && city.value ? (
            <div className="m18">No localities found for selected city</div>
          ) : null
        ) : city && city.value ? (
          <div className="m18">Loading localities...</div>
        ) : (
          <div className="m18">Please select a city to view localities</div>
        )}

        {/* Locality List Display */}
        {filteredLocalities && filteredLocalities.length > 0 && (
          <div className="master_data_card">
            {viewMode === "card_view" && (
              <>
                {filteredLocalities.map((data) => (
                  <div className="property-status-padding-div" key={data.id}>
                    <div className="profile-card-div" style={{ position: "relative" }}>
                      <div className="address-div" style={{ paddingBottom: "5px" }}>
                        <div className="icon" style={{ position: "relative", top: "-1px" }}>
                          <span className="material-symbols-outlined" style={{ color: "var(--darkgrey-color)" }}>
                            flag
                          </span>
                        </div>
                        <div className="address-text">
                          <div
                            onClick={() => handleEditCard(data.id, data.country, data.state, data.city, data.locality)}
                            style={{
                              width: "80%",
                              height: "170%",
                              textAlign: "left",
                              display: "flex",
                              justifyContent: "center",
                              flexDirection: "column",
                              transform: "translateY(-7px)",
                              cursor: "pointer",
                            }}
                          >
                            <h5 style={{ margin: "0", transform: "translateY(5px)" }}>
                              {data.locality} <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#00a8a8"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                            </h5>
                          </div>
                          <div
                            className=""
                            onClick={() => handleChangeStatus(data.id, data.status)}
                            style={{
                              width: "20%",
                              height: "calc(100% - -20px)",
                              position: "relative",
                              top: "-8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              cursor: "pointer",
                            }}
                          >
                            <small style={{
                              margin: "0",
                              background: data.status === "active" ? "var(--theme-green2)" : "var(--theme-red)",
                              color: "#fff",
                              padding: "3px 10px 3px 10px",
                              borderRadius: "4px",
                            }}>
                              {data.status}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            
            {viewMode === "table_view" && (
              <MasterLocalityTable filterData={filteredLocalities} handleEditCard={handleEditCard} />
            )}
          </div>
        )}

        {!filteredLocalityData && !city && (
          <div className="m18">Please select a state and city to view localities</div>
        )}
      </div>
    </div>
  );
}