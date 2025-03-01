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
  // Scroll to the top of the page whenever the location changes end
  // const { addDocument, response: responseAddDocument } = useFirestore("m_cities");
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
  // const { documents: masterLocality, error: masterLocalityerror } =
  //   useCollection("m_localities", "", ["locality", "asc"]);

  // const { documents: masterSociety, error: masterSocietyError } =
  //   useCollection("m_societies", "", ["society", "asc"]);

  const [country, setCountry] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [locality, setLocality] = useState();
  const [society, setSociety] = useState();

  let countryOptions = useRef([]);
  let stateOptions = useRef([]);
  let cityOptions = useRef([]);
  let localityOptions = useRef([]);
  let societyOptions = useRef([]);

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
  useEffect(() => {
    // console.log('in useeffect')
    if (masterCountry) {
      countryOptions.current = masterCountry.map((countryData) => ({
        label: countryData.country,
        value: countryData.id,
      }));
    }

    handleCountryChange({ label: "INDIA", value: "_india" });
    // filteredDataNew({
    //   label: "Andaman & Nicobar Islands",
    //   value: "_andaman_&_nicobar_islands",
    // });
  }, [masterCountry]);

  useEffect(() => {
    // console.log('in useeffect')
    if (masterCity) {

      filteredDataNew(state)
    }
  }, [masterCity]);

  // Populate Master Data - Start
  //Country select onchange
  const handleCountryChange = async (option) => {
    setCountry(option);
    // let countryname = option.label;
    // console.log('handleCountryChange option:', option)
    // const countryid = masterCountry && masterCountry.find((e) => e.country === countryname).id
    // console.log('countryid:', countryid)
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
          // setError('No such document exists')
        }
      },
      (err) => {
        console.log(err.message);
        // setError('failed to get document')
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

          // console.log("cityOptions.current: ", cityOptions.current)

          // setFilteredData(cityOptions.current)

          // if (cityOptions.current.length === 0) {
          //   // console.log("No City")
          //   handleCityChange(null)
          // }
          // else {
          //   handleCityChange({
          //     label: cityOptions.current[0].label,
          //     value: cityOptions.current[0].value,
          //   });
          // }
        } else {
          // handleCityChange(null)
          // setError('No such document exists')
        }
      },
      (err) => {
        console.log(err.message);
        // setError('failed to get document')
      }
    );
  };

  //Filter State select onchange
  // const handleFilterStateChange = async (option) => {
  //   setState(option);
  //   console.log('handleFilterStateChange state.id:', option.value)
  //   const ref = await projectFirestore
  //     .collection("m_cities")
  //     .where("state", "==", option.value)
  //     .orderBy("city", "asc");
  //   ref.onSnapshot(
  //     async (snapshot) => {
  //       if (snapshot.docs) {
  //         cityOptions.current = snapshot.docs.map((cityData) => ({
  //           label: cityData.data().city,
  //           value: cityData.id,
  //         }));

  //         console.log("cityOptions: ", cityOptions.current)

  //         // if (cityOptions.current.length === 0) {
  //         //   // console.log("No City")
  //         //   handleCityChange(null)
  //         // }
  //         // else {
  //         //   handleCityChange({
  //         //     label: cityOptions.current[0].label,
  //         //     value: cityOptions.current[0].value,
  //         //   });
  //         // }

  //       } else {
  //         // handleCityChange(null)
  //         // setError('No such document exists')
  //       }
  //     },
  //     (err) => {
  //       console.log(err.message);
  //       // setError('failed to get document')
  //     }
  //   );
  // };

  //City select onchange
  // const handleCityChange = async (option) => {
  //   setCity(option);
  //   // console.log('city.id:', option)

  //   if (option) {
  //     const ref = await projectFirestore
  //       .collection("m_localities")
  //       .where("city", "==", option.value)
  //       .orderBy("locality", "asc");
  //     ref.onSnapshot(
  //       async (snapshot) => {
  //         if (snapshot.docs) {
  //           localityOptions.current = snapshot.docs.map((localityData) => ({
  //             label: localityData.data().locality,
  //             value: localityData.id,
  //           }));

  //           // console.log("localityOptions: ", localityOptions)

  //         } else {
  //           // setError('No such document exists')
  //         }
  //       },
  //       (err) => {
  //         console.log(err.message);
  //         // setError('failed to get document')
  //       }
  //     );
  //   }
  // };

  //Locality select onchange
  // const handleLocalityChange = async (option) => {
  //   setLocality(option);
  //   // console.log('locality.id:', option.value)

  //   if (option) {
  //     const ref = await projectFirestore
  //       .collection("m_societies")
  //       .where("locality", "==", option.value)
  //       .orderBy("society", "asc");
  //     ref.onSnapshot(
  //       async (snapshot) => {
  //         if (snapshot.docs) {
  //           societyOptions.current = snapshot.docs.map((societyData) => ({
  //             label: societyData.data().society,
  //             value: societyData.id,
  //           }));

  //         } else {
  //           // handleSocietyChange(null)
  //         }
  //       },
  //       (err) => {
  //         console.log(err.message);
  //         // setError('failed to get document')
  //       }
  //     );
  //   }
  // };

  //Society select onchange
  // const handleSocietyChange = async (option) => {
  //   setSociety(option);
  //   // console.log('society.id:', option.value)
  // };

  // Populate Master Data - End

  let results = [];

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setFormError("");

  //   let _addCityFlag = false;

  //   let cityname = camelCase(city.trim());
  //   // console.log('cityname:', cityname)

  //   let isDuplicateCity = state.value + "_" + cityname.split(" ").join("_").toLowerCase()
  //   // console.log("value: ", isDuplicateLocality)

  //   // console.log("Updated currentDocid: ", currentDocid)
  //   if (currentDocid != null) {
  //     // console.log("Updated currentDocid: ", currentDocid)
  //     setFormError("Updated Successfully");
  //     // sethandleAddSectionFlag(!handleAddSectionFlag);
  //     await updateDocument(currentDocid, {
  //       country: country.value,
  //       state: state.value,
  //       city: cityname,
  //     });

  //   } else if (currentDocid == null) {
  //     let ref = projectFirestore
  //       .collection("m_cities")
  //       .where("docId", "==", isDuplicateCity);
  //     const unsubscribe = ref.onSnapshot(async (snapshot) => {
  //       snapshot.docs.forEach((doc) => {
  //         results.push({ ...doc.data(), id: doc.id });
  //       });
  //       // console.log("_addCityFlag: ", _addCityFlag)
  //       // console.log("results.length: ", results.length)
  //       if (results.length === 0) {
  //         const dataSet = {
  //           docId: state.value + "_" + cityname.split(" ").join("_").toLowerCase(),
  //           country: country.value,
  //           state: state.value,
  //           city: cityname,
  //           status: "active",
  //         };

  //         _addCityFlag = true
  //         // console.log("_addCityFlag: ", _addCityFlag)
  //         setFormError("Successfully added");
  //         // sethandleAddSectionFlag(!handleAddSectionFlag);
  //         // console.log("Successfully added")
  //         // console.log("handleAddSectionFlag: ", handleAddSectionFlag)
  //         // await addDocument(dataSet);
  //         const _customDocId = dataSet.docId
  //         await addDocumentWithCustomDocId(dataSet, _customDocId);
  //       } else if (results.length > 0 && _addCityFlag === false) {
  //         // console.log("Duplicate City")
  //         setFormError("Duplicate City");
  //         // console.log("handleAddSectionFlag: ", handleAddSectionFlag)
  //         // sethandleAddSectionFlag(!handleAddSectionFlag);
  //       }

  //     });

  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setFormError("");
    setFormErrorType(null);

    if (city) {

      const cityname = camelCase(city.trim());
      const isDuplicateCity =
        state.value + "_" + cityname.split(" ").join("_").toLowerCase();

      console.log("isDuplicateCity: ", isDuplicateCity)

      if (currentDocid) {
        // Check for duplicate city
        const ref = projectFirestore
          .collection("m_cities")
          .where("docId", "==", isDuplicateCity);
        const snapshot = await ref.get();

        if (snapshot.empty) {

          // Update existing document
          await updateDocument(currentDocid, {
            docId: isDuplicateCity,
            country: country.value,
            state: state.value,
            city: cityname,
          });

          setFormErrorType("success_msg");
          setFormError("Updated Successfully");
          setIsAdding(false);

          // Reset messages after 5 seconds
          setTimeout(() => {
            setFormError(null);
            setFormErrorType(null);
          }, 5000);
        }
        else {
          // Handle duplicate case
          setFormErrorType("error_msg");
          setFormError("Already added");
          setIsAdding(false);

          // Reset error message after 5 seconds
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
    }
    else {
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

  const handleEditCard = (docid, doccountry, docstate, doccity) => {
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

  // const searchCountry = (data) => {
  //   // console.log(data)
  //   let _filterList = [];

  //   setFilteredData(_filterList)
  //   // filterData
  //   console.log('filteredData', filteredData)

  // }

  // let filteredData = masterCity
  //   ? masterCity.filter((document) => {
  //     let isFiltered = false;

  //     console.log("document: ", document)
  //     // console.log("filter value: ", filter)
  //     console.log("State Filter: ", stateFilter)

  //     if (stateFilter.value === document.state) {
  //       isFiltered = true;
  //     }

  //     // Role and country-based filtering
  //     switch (filter) {
  //       case "INDIA":
  //         const indiaid = masterCountry && masterCountry.find((e) => e.country.toUpperCase() === "INDIA").id
  //         if (document.country === indiaid) {
  //           isFiltered = true;
  //         }
  //         break;
  //       case "USA":
  //         const usaid = masterCountry && masterCountry.find((e) => e.country.toUpperCase() === "USA").id
  //         if (document.country === usaid) {
  //           isFiltered = true;
  //         }
  //         break;
  //       case "OTHERS":
  //         const indiaid1 = masterCountry && masterCountry.find((e) => e.country.toUpperCase() === "INDIA").id
  //         const usaid1 = masterCountry && masterCountry.find((e) => e.country.toUpperCase() === "USA").id
  //         if (document.country !== indiaid1 && document.country !== usaid1) {
  //           isFiltered = true;
  //         }
  //         break;
  //       case "INACTIVE":
  //         if (document.status.toLowerCase() === "inactive") {
  //           isFiltered = true;
  //         }
  //         break;
  //       default:
  //         isFiltered = true;
  //     }

  //     // console.log("searchInput: ", searchInput)

  //     let searchMatch = "";
  //     // if (searchInput) {
  //     let _searchkey;
  //     let _state = masterState.find(e => e.id === document.state).state;
  //     _searchkey = {
  //       city: document.city,
  //       state: _state
  //     }
  //     // console.log("_searchkey: ", _searchkey)

  //     // Search input filtering
  //     searchMatch = searchInput
  //       ? Object.values(_searchkey).some(
  //         (field) =>
  //           typeof field === "string" &&
  //           field.toUpperCase().includes(searchInput.toUpperCase())
  //       )
  //       : true;
  //     // }

  //     return isFiltered && searchMatch;
  //   })
  //   : null;

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
                className={`theme_btn no_icon header_btn mt-3 ${handleAddSectionFlag ? "btn_border" : "btn_fill"
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
                  src="./assets/img/icons/excel_logo.png"
                  alt=""
                  className="excel_dowanload"
                />
              </div>
            </div>
            <div className="vg12"></div>
            <div className="filters">
              <div
                className="left"
                style={{ display: "flex", alignItems: "center", flexWrap:"wrap", gap:"15px" }}
              >
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
                    className={`bf_single ${viewMode === "card_view" ? "active" : ""
                      }`}
                    onClick={() => handleModeChange("card_view")}
                  >
                    <span className="material-symbols-outlined">
                      calendar_view_month
                    </span>
                  </div>
                  <div
                    className={`bf_single ${viewMode === "table_view" ? "active" : ""
                      }`}
                    onClick={() => handleModeChange("table_view")}
                  >
                    <span className="material-symbols-outlined">view_list</span>
                  </div>
                </div>
                {!handleAddSectionFlag && (
                  <div
                    onClick={handleAddSection}
                    className={`theme_btn no_icon header_btn ${handleAddSectionFlag ? "btn_border" : "btn_fill"
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
                Filtered City: <span className="text_orange">{filteredData.length}</span>
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
                                    data.city
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
                                  {camelCase(data.city)}
                                </h5>
                                {masterCountry && masterState && <small
                                  style={{
                                    margin: "0",
                                    transform: "translateY(5px)",
                                  }}
                                >
                                  {/* {camelCase(data.state)}, */}
                                  {(
                                    masterState.length > 0 && masterState.find(
                                      (e) => e.id === data.state
                                    )
                                  ).state
                                  }{" "}
                                  {
                                    (
                                      masterCountry.length > 0 && masterCountry.find(
                                        (e) => e.id === data.country
                                      )
                                    ).country
                                  }
                                  {/* {data.country} */}
                                </small>}
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
                                        ? "green"
                                        : "red",
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
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
            {viewMode === "table_view" && (
              <>
                {filteredData && <MasterCityTable filterData={filteredData} />}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
