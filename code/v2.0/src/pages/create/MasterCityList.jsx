import { useState, useEffect, useRef } from "react";
import { projectFirestore } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { useCommon } from "../../hooks/useCommon";
import Select from "react-select";
import Filters from "../../components/Filters";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Create.css";
import NineDots from "../../components/NineDots";
import MasterCityTable from "./MasterCityTable";

const dataFilter = ["INDIA", "USA", "OTHERS", "INACTIVE"];
export default function MasterCityList() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  const { camelCase } = useCommon();
  const { addDocumentWithCustomDocId, response: responseAddDocument } =
    useFirestore("m_cities");

  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("m_cities");

  //Master Data Loading Initialisation - Start
  const { documents: masterCountry, error: masterCountryerror } = useCollection(
    "m_countries",
    "",
    ["country", "asc"]
  );

  const { documents: masterState, error: masterStateError } = useCollection(
    "m_states",
    "",
    ["state", "asc"]
  );
  const { documents: masterCity, error: masterCityError } = useCollection(
    "m_cities",
    "",
    ["city", "asc"]
  );
  const [country, setCountry] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [isShowInPropdial, setIsShowInPropdial] = useState(true);
  const [isShowInPropagent, setIsShowInPropagent] = useState(true);

  let countryOptions = useRef([]);
  let stateOptions = useRef([]);
  let cityOptions = useRef([]);

  //Master Data Loading Initialisation - End

  const [formError, setFormError] = useState(null);
  const [formErrorType, setFormErrorType] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formBtnText, setFormBtnText] = useState("");
  const [currentDocid, setCurrentDocid] = useState(null);
  const [filter, setFilter] = useState("INDIA");
  const [stateFilter, setStateFilter] = useState("INDIA");
  const [handleAddSectionFlag, sethandleAddSectionFlag] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [aliasList, setAliasList] = useState([]);

  useEffect(() => {
    // console.log('in useeffect')
    if (masterCountry) {
      countryOptions.current = masterCountry.map((countryData) => ({
        label: countryData.country,
        value: countryData.id,
      }));
    }

    handleCountryChange({ label: "INDIA", value: "_india" });
  }, [masterCountry]);

  useEffect(() => {
    // console.log('in useeffect')
    if (masterCity) {
      filteredDataNew(state);
    }
  }, [masterCity]);

  // Populate Master Data - Start
  //Country select onchange
  const handleCountryChange = async (option) => {
    setCountry(option);
    const ref = await projectFirestore
      .collection("m_states")
      .where("country", "==", option.value)
      .orderBy("state", "asc");
    ref.onSnapshot(
      async (snapshot) => {
        if (snapshot.docs) {
          stateOptions.current = snapshot.docs.map((stateData) => ({
            label: stateData.data().state,
            value: stateData.id,
          }));

          if (stateOptions.current.length === 0) {
            console.log("No State");
            handleStateChange(null);
          } else {
            handleStateChange({
              label: stateOptions.current[0].label,
              value: stateOptions.current[0].value,
            });
          }
        } else {
        }
      },
      (err) => {
        console.log(err.message);
      }
    );
  };

  //Stae select onchange
  const handleStateChange = async (option) => {
    setState(option);
    // console.log('state.id:', option.value)
    const ref = await projectFirestore
      .collection("m_cities")
      .where("state", "==", option.value)
      .orderBy("city", "asc");
    ref.onSnapshot(
      async (snapshot) => {
        if (snapshot.docs) {
          cityOptions.current = snapshot.docs.map((cityData) => ({
            label: cityData.data().city,
            value: cityData.id,
          }));
        } else {
        }
      },
      (err) => {
        console.log(err.message);
      }
    );
  };
  // Populate Master Data - End

// useEffect(() => {
//   if (city && aliasList.length === 0) {
//     setAliasList([city]); // ✅ Only set if aliasList is empty (initial add)
//   }
// }, [city]);
useEffect(() => {
  if (city) {
    setAliasList((prev) => {
      const updated = [...prev];
      updated[0] = city;
      return updated;
    });
  }
}, [city]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setFormError("");
    setFormErrorType(null);

    if (city) {
      const cityname = camelCase(city.trim());
      const isDuplicateCity =
        state.value + "_" + cityname.split(" ").join("_").toLowerCase();

      console.log("isDuplicateCity: ", isDuplicateCity);

      if (currentDocid) {
        // Check for duplicate city
        const ref = projectFirestore
          .collection("m_cities")
          .where("docId", "==", isDuplicateCity);
        const snapshot = await ref.get();

        if (snapshot.empty || snapshot.docs[0].id === currentDocid) {
          // Safe to update
          await updateDocument(currentDocid, {
            docId: isDuplicateCity,
            country: country.value,
            state: state.value,
            city: cityname,
            isShowInPropdial,
            isShowInPropagent,
            // alias: aliasList,
            alias: aliasList.map((a) => a.trim().toLowerCase()),

          });

          setFormErrorType("success_msg");
          setFormError("Updated Successfully");
          setIsAdding(false);

          setTimeout(() => {
            setFormError(null);
            setFormErrorType(null);
          }, 5000);
        } else {
          setFormErrorType("error_msg");
          setFormError("Already added");
          setIsAdding(false);

          setTimeout(() => {
            setFormError(null);
            setFormErrorType(null);
          }, 5000);
        }
      } else {
        try {
          // Check for duplicate city
          const ref = projectFirestore
            .collection("m_cities")
            .where("docId", "==", isDuplicateCity);
          const snapshot = await ref.get();

          if (snapshot.empty) {
            // No duplicates found, add new document
            const dataSet = {
              docId: isDuplicateCity,
              country: country.value,
              state: state.value,
              city: cityname,
              status: "active",
              isShowInPropdial,
          isShowInPropagent,
              // alias: aliasList,
              alias: aliasList.map((a) => a.trim().toLowerCase()),

            };

            await addDocumentWithCustomDocId(dataSet, dataSet.docId);

            setFormErrorType("success_msg");
            setFormError("Successfully added");
            setIsAdding(false);

            // Reset form and messages after 5 seconds
            setTimeout(() => {
              setFormError(null);
              setFormErrorType(null);
              setCity("");
              setAliasList([]);
              setIsShowInPropagent(true);
              setIsShowInPropdial(true);
            }, 5000);
          } else {
            // Duplicate city found
            setFormErrorType("error_msg");
            setFormError("Duplicate City");
            setIsAdding(false);

            // Reset error message after 5 seconds
            setTimeout(() => {
              setFormError(null);
              setFormErrorType(null);
            }, 5000);
          }
        } catch (error) {
          // Handle any errors
          setFormErrorType("error_msg");
          setFormError("An error occurred. Please try again.");
          setIsAdding(false);

          // Reset error message after 5 seconds
          setTimeout(() => {
            setFormError(null);
            setFormErrorType(null);
          }, 5000);
        }
      }
    } else {
      // Handle blank case
      setFormErrorType("error_msg");
      setFormError("City should not be blank ");
      setIsAdding(false);

      // Reset error message after 5 seconds
      setTimeout(() => {
        setFormError(null);
        setFormErrorType(null);
      }, 5000);
    }
  };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
    // console.log(newFilter)
    let _counryCode = "_" + newFilter.toLowerCase();
    console.log(newFilter, _counryCode);
    let _filterList = [];
    // if (data) {
    _filterList = masterCity.filter((e) => e.country === _counryCode);
    // console.log('_filterList', _filterList)
    setFilteredData(_filterList);
    // };
  };

  // const changeStateFilter = (newFilter) => {
  //   setStateFilter(newFilter);
  // };

  const handleAddSection = () => {
    setCurrentDocid(null);
    setFormError("");
    sethandleAddSectionFlag(!handleAddSectionFlag);
    setFormBtnText("Add");
    setCountry({ label: "INDIA", value: "_india" });
    // setState(null);
    setCity("");
    setAliasList([]);
    setIsShowInPropagent(true);
    setIsShowInPropdial(true);
  };

  // const [cityStatus, setCityStatus] = useState();
  const handleChangeStatus = async (docid, status) => {
    // console.log('docid:', docid)
    if (status === "active") status = "inactive";
    else status = "active";
    await updateDocument(docid, {
      status,
    });
  };

  const handleEditCard = (
    docid,
    doccountry,
    docstate,
    doccity,
    docinpropdial,
    docinpropagent,
    docalias
  ) => {
    // console.log('data:', data)
    setCurrentDocid(docid);
    window.scrollTo(0, 0);
    setFormError(null);

    // console.log("country id: ", doccountry)
    const countryname = (
      masterCountry && masterCountry.find((e) => e.id === doccountry)
    ).country;
    // console.log("country name: ", countryname)
    const statename = (
      masterState && masterState.find((e) => e.id === docstate)
    ).state;

    setCountry({ label: countryname, value: doccountry });
    setState({ label: statename, value: docstate });
    setCity(doccity);
    setIsShowInPropagent(
      docinpropagent === undefined ? true : docinpropagent
    );
    setIsShowInPropdial(docinpropdial === undefined ? true : docinpropdial);
    // setAliasList(docalias && docalias.length > 0 ? docalias : [doccity]); 
    setAliasList(
  docalias && docalias.length > 0
    ? docalias
    : city
    ? [doccity]
    : []
);

    console.log("Setting aliasList to:", docalias);

    sethandleAddSectionFlag(!handleAddSectionFlag);
    setFormBtnText("Update City");
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    let _searchkey = e.target.value.toLowerCase();
    let _filterList = [];
    _filterList = masterCity.filter(
      (e) => e.docId.includes(_searchkey) || e.country.includes(_searchkey)
    );
    console.log("_filterList", _filterList);
    setFilteredData(_filterList);
  };

  const [searchInput, setSearchInput] = useState("");

  // let filteredData = [];
  const filteredDataNew = (data) => {
    // console.log("filteredDataNew data: ", data)
    let _filterList = [];
    if (data) {
      _filterList =
        masterCity && masterCity.filter((e) => e.state === data.value);
    }
    // console.log('_filterList', _filterList)
    setFilteredData(_filterList);
    // filterData
    // console.log('filteredData', filteredData)
  };

  // nine dots menu start

  const nineDotsMenu = [
    // { title: "Country's List", link: "/countrylist", icon: "public" },
    { title: "State's List", link: "/statelist", icon: "map" },
    {
      title: "Locality's List",
      link: "/localitylist",
      icon: "holiday_village",
    },
    { title: "Society's List", link: "/societylist", icon: "home" },
  ];
  // nine dots menu end

  // View mode start
  const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns
  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };
  // View mode end
  // console.log(filteredData)
  return (
    <div className="top_header_pg pg_bg pg_adminproperty">
      <div className="page_spacing pg_min_height">
        <NineDots nineDotsMenu={nineDotsMenu} />

        {masterCity && masterCity.length === 0 && (
          <div className={`pg_msg ${handleAddSectionFlag && "d-none"}`}>
            <div>
              No City Yet!
              <div
                onClick={handleAddSection}
                className={`theme_btn no_icon header_btn mt-3 ${
                  handleAddSectionFlag ? "btn_border" : "btn_fill"
                }`}
              >
                {handleAddSectionFlag ? "Cancel" : "Add New"}
              </div>
            </div>
          </div>
        )}
        {masterCity && masterCity.length !== 0 && (
          <>
            <div className="pg_header d-flex justify-content-between">
              <div className="left">
                <h2 className="m22">
                  Total City:{" "}
                  {masterCity && (
                    <span className="text_orange">{masterCity.length}</span>
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
                    className=""
                    // onChange={(option) => handleFilterStateChange(option)}
                    // onChange={(option) => setState(option)}
                    // defaultValue={label:'DELHI', value:'_delhi' }
                    onChange={(e) => {
                      setState(e);
                      filteredDataNew(e);
                    }}
                    // changeFilter={changeFilter}
                    options={stateOptions.current}
                    value={state}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        outline: "none",
                        background: "#eee",
                        borderBottom: " 1px solid var(--theme-blue)",
                        width: "300px",
                      }),
                    }}
                  />
                </div>
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
              </div>
              <div className="right">
                <div className="new_inline">
                  {filteredData && (
                    <Filters
                      changeFilter={changeFilter}
                      filterList={dataFilter}
                      filterLength={filteredData.length}
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
                    <span className="material-symbols-outlined">view_list</span>
                  </div>
                </div>
                {!handleAddSectionFlag && (
                  <div
                    onClick={handleAddSection}
                    className={`theme_btn no_icon header_btn ${
                      handleAddSectionFlag ? "btn_border" : "btn_fill"
                    }`}
                  >
                    Add New
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        <div
          style={{
            overflow: handleAddSectionFlag ? "visible" : "hidden",
            // transition: "1s",
            opacity: handleAddSectionFlag ? "1" : "0",
            maxHeight: handleAddSectionFlag ? "100%" : "0",
            background: "var(--theme-blue-bg)",
            marginLeft: handleAddSectionFlag ? "-22px" : "0px",
            marginRight: handleAddSectionFlag ? "-22px" : "0px",
            marginTop: handleAddSectionFlag ? "22px" : "0px",
            padding: handleAddSectionFlag ? "32px 22px" : "0px",
          }}
        >
          <div className="row row_gap form_full">
            <div className="col-xl-4 col-lg-6">
              <div className="form_field label_top">
                <label htmlFor="">Country</label>
                <div className="form_field_inner">
                  <Select
                    className=""
                    onChange={handleCountryChange}
                    options={countryOptions.current}
                    value={country}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        outline: "none",
                        background: "#eee",
                        borderBottom: " 1px solid var(--theme-blue)",
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6">
              <div className="form_field label_top">
                <label htmlFor="">State</label>
                <div className="form_field_inner">
                  <Select
                    className=""
                    onChange={(option) => setState(option)}
                    options={stateOptions.current}
                    // options={stateList}
                    value={state}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        outline: "none",
                        background: "#eee",
                        borderBottom: " 1px solid var(--theme-blue)",
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6">
              <div className="form_field label_top">
                <label htmlFor="">City</label>
                <div className="form_field_inner">
                  <input
                    required
                    type="text"
                    placeholder="Entry City Name"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                  />
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-6">
              <div className="form_field st-2 label_top">
                <label>Propdial Visibility</label>
                <div className="field_box theme_radio_new">
                  <div
                    className="theme_radio_container"
                    style={{
                      padding: "0px",
                      border: "none",
                      margin: "10px 0px",
                    }}
                  >
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="propdialVisibility"
                        value="hide"
                        id="propdial_show"
                        checked={isShowInPropdial}
                        onChange={() => setIsShowInPropdial(true)}
                      />
                      <label className="label" htmlFor="propdial_show">
                        Show
                      </label>
                    </div>
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="propdialVisibility"
                        value="hide"
                        id="propdial_hide"
                        checked={!isShowInPropdial}
                        onChange={() => setIsShowInPropdial(false)}
                      />
                      <label className="label" htmlFor="propdial_hide">
                        Hide
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6">
              <div className="form_field st-2 label_top">
                <label>PropAgent Visibility</label>
                <div className="field_box theme_radio_new">
                  <div
                    className="theme_radio_container"
                    style={{
                      padding: "0px",
                      border: "none",
                      margin: "10px 0px",
                    }}
                  >
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="propagentVisibility"
                        value="hide"
                        id="propagent_show"
                        checked={isShowInPropagent}
                        onChange={() => setIsShowInPropagent(true)}
                      />
                      <label className="label" htmlFor="propagent_show">
                        Show
                      </label>
                    </div>
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="propagentVisibility"
                        value="hide"
                        id="propagent_hide"
                        checked={!isShowInPropagent}
                        onChange={() => setIsShowInPropagent(false)}
                      />
                      <label className="label" htmlFor="propagent_hide">
                        Hide
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {city && (
              <div className="col-xl-12">
              <div className="form_field label_top">
                <label>Alias Name(s)</label>
                {aliasList.map((alias, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <input
                      type="text"
                      value={alias}
                      onChange={(e) => {
                        const updatedList = [...aliasList];
                        updatedList[index] = e.target.value;
                        setAliasList(updatedList);
                      }}
                      disabled={index === 0}
                      placeholder={
                        index === 0 ? "City name (default)" : `Alias ${index}`
                      }
                      style={{
                        flex: 1,
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        background: index === 0 ? "#f5f5f5" : "#fff",
                        textTransform:"capitalize"
                      }}
                    />
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...aliasList];
                          updated.splice(index, 1);
                          setAliasList(updated);
                        }}
                        style={{
                          padding: "8px 10px",
                          background: "#ff4d4d",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setAliasList([...aliasList, ""])}
                  style={{
                    marginTop: "5px",
                    padding: "8px 15px",
                    background: "#5a10d5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  + Add More Alias
                </button>
              </div>
            </div>
          )}
          </div>
          <div className="vg22"></div>

          <div className="btn_and_msg_area">
            {formError && (
              <div className={`msg_area big_font ${formErrorType}`}>
                {formError}
              </div>
            )}

            <div
              className="d-flex align-items-center justify-content-end"
              style={{
                gap: "15px",
              }}
            >
              <div
                className="theme_btn btn_border_red no_icon text-center"
                onClick={handleAddSection}
                style={{
                  minWidth: "140px",
                }}
              >
                Close
              </div>
              <div
                className="theme_btn btn_fill no_icon text-center"
                onClick={isAdding ? null : handleSubmit}
                style={{
                  minWidth: "140px",
                }}
              >
                {isAdding ? "Processing..." : formBtnText}
              </div>
            </div>
          </div>
        </div>
        {masterCity && masterCity.length !== 0 && (
          <>
            <div className="vg22"></div>
            {filteredData && filteredData.length > 0 ? (
              <div className="m18">
                Filtered City:{" "}
                <span className="text_orange">{filteredData.length}</span>
              </div>
            ) : (
              ""
            )}
            <div className="master_data_card">
              {viewMode === "card_view" && (
                <>
                  {filteredData &&
                    filteredData.map((data) => (
                      <div className="property-status-padding-div">
                        <div
                          className="profile-card-div"
                          style={{ position: "relative" }}
                        >
                          <div
                            className="address-div"
                            style={{ paddingBottom: "5px" }}
                          >
                            <div
                              className="icon"
                              style={{ position: "relative", top: "-1px" }}
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{ color: "var(--darkgrey-color)" }}
                              >
                                flag
                              </span>
                            </div>
                            <div className="address-text">
                              <div
                                onClick={() =>
                                  handleEditCard(
                                    data.id,
                                    data.country,
                                    data.state,
                                    data.city,
                                    data.isShowInPropdial,
                                    data.isShowInPropagent,
                                    data.alias
                                  )
                                }
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
                                <h5
                                  style={{
                                    margin: "0",
                                    transform: "translateY(5px)",
                                  }}
                                >
                                  {camelCase(data.city)}{" "}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="16px"
                                    viewBox="0 -960 960 960"
                                    width="16px"
                                    fill="#00a8a8"
                                  >
                                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                                  </svg>
                                </h5>
                                {masterCountry && masterState && (
                                  <small
                                    style={{
                                      margin: "0",
                                      transform: "translateY(5px)",
                                    }}
                                  >
                                    {/* {camelCase(data.state)}, */}
                                    {
                                      (
                                        masterState.length > 0 &&
                                        masterState.find(
                                          (e) => e.id === data.state
                                        )
                                      ).state
                                    }{" "}
                                    {
                                      (
                                        masterCountry.length > 0 &&
                                        masterCountry.find(
                                          (e) => e.id === data.country
                                        )
                                      ).country
                                    }
                                    {/* {data.country} */}
                                  </small>
                                )}
                              </div>
                              <div
                                className=""
                                onClick={() =>
                                  handleChangeStatus(data.id, data.status)
                                }
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
                                <small
                                  style={{
                                    margin: "0",
                                    background:
                                      data.status === "active"
                                        ? "var(--theme-green2)"
                                        : "var(--theme-red)",
                                    color: "#fff",
                                    padding: "3px 10px 3px 10px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  {data.status}
                                </small>
                                {/* <span className="material-symbols-outlined">
                                                chevron_right
                                            </span> */}
                              </div>
                            </div>
                          </div>
                      <div className="visibility">
  <div className={`vs ${data?.isShowInPropdial ? "show" : "hide"}`}>
    <span>{data?.isShowInPropdial ? "Show" : "Hide"}</span> in PD
  </div>
  <div className={`vs ${data?.isShowInPropagent ? "show" : "hide"}`}>
    <span>{data?.isShowInPropagent ? "Show" : "Hide"}</span> in PA
  </div>
</div>

                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
            {viewMode === "table_view" && (
              <>
                {filteredData && (
                  <MasterCityTable
                    filterData={filteredData}
                    handleEditCard={handleEditCard}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
