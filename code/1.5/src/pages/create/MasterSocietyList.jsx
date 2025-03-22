import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectFirestore } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { useCommon } from "../../hooks/useCommon";
import Select from "react-select";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
// component
import NineDots from "../../components/NineDots";
import MasterSocietyTable from "./MasterSocietyTable";

export default function MasterSocietyList() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  const { user } = useAuthContext();
  const { camelCase } = useCommon();
  // Scroll to the top of the page whenever the location changes end
  const { addDocument, response } = useFirestore("m_societies");
  // const { addDocumentWithCustomDocId, response: responseAddDocument } = useFirestore("m_societies");
  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("m_societies");

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
  // const { documents: masterLocality, error: masterLocalityError } =
  //   useCollection("m_localities", "", ["locality", "asc"]);

  const [filteredLocalityData, setfilteredLocalityData] = useState();

  // const { documents: masterSociety, error: masterSocietyError } = useCollection(
  //   "m_societies",
  //   "",
  //   ["society", "asc"]
  // );

  const [filteredSocietyData, setfilteredSocietyData] = useState();

  const [country, setCountry] = useState({ label: "INDIA", value: "_india" });
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [locality, setLocality] = useState();
  const [society, setSociety] = useState();
  const [selectedCategory, setSelectedCategory] = useState("Residential");

  let countryOptions = useRef([]);
  let stateOptions = useRef([]);
  let cityOptions = useRef([]);
  let localityOptions = useRef([]);
  // let societyOptions = useRef([]);

  //Master Data Loading Initialisation - End

  const [formError, setFormError] = useState(null);
  const [formErrorType, setFormErrorType] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formBtnText, setFormBtnText] = useState("");
  const [currentDocid, setCurrentDocid] = useState(null);
  const [handleAddSectionFlag, sethandleAddSectionFlag] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // console.log('in useeffect')
    if (masterCountry) {
      countryOptions.current = masterCountry.map((countryData) => ({
        label: countryData.country,
        value: countryData.id,
      }));

      // console.log("countryOptions: ", countryOptions)
      handleCountryChange({ label: "INDIA", value: "_india" });
    }
  }, [masterCountry]);

  // useEffect(() => {
  //   // console.log('in useeffect')
  //   if (masterSociety) {

  //     filteredDataNew(locality)
  //   }
  // }, [masterSociety]);

  // Populate Master Data - Start
  //Country select onchange
  const handleCountryChange = async (option) => {
    setCountry(option);
    // let countryname = option.label;
    // console.log('countryname:', countryname)
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

          if (cityOptions.current.length === 0) {
            // console.log("No City")
            handleCityChange(null);
          } else {
            handleCityChange({
              label: cityOptions.current[0].label,
              value: cityOptions.current[0].value,
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

  //City select onchange
  const handleCityChange = async (option) => {
    setCity(option);
    console.log('city option:', option)

    if (option) {
      const ref = await projectFirestore
        .collection("m_localities")
        .where("city", "==", option.value)
        .orderBy("locality", "asc");
      ref.onSnapshot(
        async (snapshot) => {
          if (snapshot.docs) {
            localityOptions.current = snapshot.docs.map((localityData) => ({
              label: localityData.data().locality,
              value: localityData.id,
            }));

            // console.log("localityOptions: ", localityOptions)

            if (localityOptions.current.length === 0) {
              // console.log("No Locality")
              handleLocalityChange(null);
            } else {
              handleLocalityChange({
                label: localityOptions.current[0].label,
                value: localityOptions.current[0].value,
              });
            }
          } else {
            handleLocalityChange(null);
            // setError('No such document exists')
          }
        },
        (err) => {
          console.log(err.message);
          // setError('failed to get document')
        }
      );
    }
  };

  //Locality select onchange
  const handleLocalityChange = async (option) => {
    setLocality(option);
    console.log('locality:', option)

    if (option) {
      try {

        const querySnapshot = await projectFirestore
          .collection("m_societies")
          .where("locality", "==", option.value)
          .orderBy("society", "asc");

        const unsubscribe = querySnapshot.onSnapshot(snapshot => {
          let results = []
          snapshot.docs.forEach(doc => {
            results.push({ ...doc.data(), id: doc.id })
          });

          console.log("list of Societies: ", results)

          // // update state
          setfilteredSocietyData(results)
          // setError(null)
        }, error => {
          console.log(error)
          // setError('could not fetch the data')
        })

        return () => unsubscribe(); // Cleanup listener when component unmounts


      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }


    // if (option) {
    //   const ref = await projectFirestore
    //     .collection("m_societies")
    //     .where("locality", "==", option.value)
    //     .orderBy("society", "asc");
    //   ref.onSnapshot(
    //     async (snapshot) => {
    //       if (snapshot.docs) {
    //         societyOptions.current = snapshot.docs.map((societyData) => ({
    //           label: societyData.data().society,
    //           value: societyData.id,
    //         }));

    //         filteredDataNew(option)
    //       } else {
    //         // handleSocietyChange(null)
    //       }
    //     },
    //     (err) => {
    //       console.log(err.message);
    //       // setError('failed to get document')
    //     }
    //   );
    // }
  };


  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const category = [
    { id: "residential", value: "Residential", label: "Residential" },
    {
      id: "commercial",
      value: "Commercial",
      label: "Commercial",
    },
    {
      id: "both",
      value: "Both",
      label: "Both",
    },
  ];

  //Society select onchange
  // const handleSocietyChange = async (option) => {
  //   setSociety(option);
  //   // console.log('society.id:', option.value)
  // };

  // Populate Master Data - End

  let results = [];

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsAdding(true);
  //   setFormError(null);
  //   setFormErrorType(null);
  //   let societyname = camelCase(society.trim());

  //   if (currentDocid) {
  //     await updateDocument(currentDocid, {
  //       country: country.value,
  //       state: state.value,
  //       city: city.value,
  //       locality: locality.value,
  //       society: societyname,
  //     });
  //     setFormErrorType("success_msg");
  //     setFormError("Successfully updated");
  //     setSociety("");
  //     setIsAdding(false);
  //     // Reset error message and locality after 5 seconds
  //     setTimeout(() => {
  //       setFormError(null);
  //       setFormErrorType(null);
  //       setLocality("");
  //     }, 5000);
  //   } else {
  //     let ref = projectFirestore
  //       .collection("m_societies")
  //       .where("society", "==", societyname);
  //     const unsubscribe = ref.onSnapshot(async (snapshot) => {
  //       snapshot.docs.forEach((doc) => {
  //         results.push({ ...doc.data(), id: doc.id });
  //       });

  //       if (results.length === 0) {
  //         const dataSet = {
  //           // docId: locality.value + "_" + societyname.split(" ").join("_").toLowerCase(),
  //           country: country.value,
  //           state: state.value,
  //           city: city.value,
  //           locality: locality.value,
  //           society: societyname,
  //           status: "active",
  //         };
  //         await addDocument(dataSet);
  //         // const _customDocId = dataSet.docId
  //         // await addDocumentWithCustomDocId(dataSet, _customDocId);
  //         setFormErrorType("success_msg");
  //         setFormError("Successfully added");
  //         setIsAdding(false);
  //         // Reset error message and locality after 5 seconds
  //         setTimeout(() => {
  //           setFormError(null);
  //           setFormErrorType(null);
  //           setLocality("");
  //         }, 5000);

  //         // sethandleAddSectionFlag(!handleAddSectionFlag);
  //       } else {
  //         setFormErrorType("error_msg");
  //         setFormError("Already added");
  //         setIsAdding(false);
  //         // Reset error message and locality after 5 seconds
  //         setTimeout(() => {
  //           setFormError(null);
  //           setFormErrorType(null);
  //         }, 5000);
  //         // sethandleAddSectionFlag(!handleAddSectionFlag);
  //       }
  //     });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setFormError(null);
    setFormErrorType(null);

    if (society) {

      let societyname = camelCase(society.trim());

      let locality_docid = locality.value;

      // console.log("Locality id: ", locality_docid)

      if (currentDocid) {
        // Check for duplicates before adding
        const ref = projectFirestore
          .collection("m_societies")
          .where("locality", "==", locality_docid)
          .where("society", "==", societyname);

        const snapshot = await ref.get(); // Use get() for one-time query

        if (snapshot.empty) {
          const dataSet = {
            country: country.value,
            state: state.value,
            city: city.value,
            locality: locality.value,
            society: societyname,
            category: selectedCategory
          };
          // Update existing document
          await updateDocument(currentDocid, dataSet);

          setFormErrorType("success_msg");
          setFormError("Successfully updated");
          setIsAdding(false);

          // Reset error message and locality after 5 seconds
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
        console.log("New Society to be added")
        // Check for duplicates before adding
        // const ref = projectFirestore
        //   .collection("m_societies")
        //   .where("society", "==", societyname);
        console.log("locality_docid: ", locality_docid)
        console.log("societyname: ", societyname)

        const ref = projectFirestore
          .collection("m_societies")
          .where("locality", "==", locality_docid)
          .where("society", "==", societyname);

        const snapshot = await ref.get(); // Use get() for one-time query
        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        console.log("results: ", results)
        console.log("selectedCategory: ", selectedCategory)

        if (results.length === 0) {
          // Add new document
          const dataSet = {
            country: country.value,
            state: state.value,
            city: city.value,
            locality: locality.value,
            society: societyname,
            status: "active",
            category: selectedCategory,
          };

          console.log("society dataSet: ", dataSet)
          await addDocument(dataSet);

          setFormErrorType("success_msg");
          setFormError("Successfully added");
          setIsAdding(false);

          // Reset error message and locality after 5 seconds
          setTimeout(() => {
            setFormError(null);
            setFormErrorType(null);
            setSociety("");
          }, 5000);
        } else {
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
      }
    }
    else {
      // Handle blank case
      setFormErrorType("error_msg");
      setFormError("Society should not be blank ");
      setIsAdding(false);

      // Reset error message after 5 seconds
      setTimeout(() => {
        setFormError(null);
        setFormErrorType(null);
      }, 5000);

    }
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
    setFormBtnText("Add Society");
    // setCountry(null);
    // setState(null)
    // setCity(null)
    // setLocality(null)
    setSociety("");
    setCurrentDocid(null);
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
    doclocality,
    docsociety,
    doccategory
  ) => {
    console.log('In handleEditCard: ', docid, doccountry, docstate, doclocality, docsociety, doccategory)
    // console.log("country id: ", doccountry)
    // const countryname = (
    //   masterCountry && masterCountry.find((e) => e.id === doccountry)
    // ).country;
    // console.log("country name: ", countryname)
    // const statename = (
    //   masterState && masterState.find((e) => e.id === docstate)
    // ).state;
    // const cityname = (masterCity && masterCity.find((e) => e.id === doccity))
    //   .city;
    // const localityname = (
    //   filteredLocalityData && filteredLocalityData.find((e) => e.id === doclocality)
    // ).locality;

    window.scrollTo(0, 0);
    setFormError(null);
    // setCountry({ label: countryname, value: doccountry });
    // setState({ label: statename, value: docstate });
    // setCity({ label: cityname, value: doccity });
    // setLocality({ label: localityname, value: doclocality });
    console.log("doccategory: ", doccategory)
    setSociety(docsociety);
    setSelectedCategory(doccategory);
    sethandleAddSectionFlag(!handleAddSectionFlag);
    setFormBtnText("Update Society");
    setCurrentDocid(docid);
  };

  const [searchInput, setSearchInput] = useState("");

  // const filteredDataNew = (data) => {
  //   // console.log(data);
  //   let _filterList = [];
  //   if (data) {
  //     // _filterList = masterCity.filter(e => e.state === data.value)
  //     _filterList =
  //       masterSociety && masterSociety.filter((e) => e.locality === data.value);
  //   }
  //   // console.log('_filterList', _filterList)
  //   setFilteredData(_filterList);
  //   // filterData
  //   // console.log('filteredData', filteredData)
  // };

  const handleSearchInputChange = (e) => {
    // console.log("e.target.value: ", e.target.value)
    setSearchInput(e.target.value);
  };

  // const filteredData = masterSociety
  //   ? masterSociety.filter((document) => {
  //     let _searchkey;
  //     let _locality = masterLocality.find(e => e.id === document.locality).locality;
  //     _searchkey = {
  //       society: document.society,
  //       locality: _locality
  //     }
  //     // console.log("_searchkey: ", _searchkey)

  //     // Search input filtering
  //     const searchMatch = searchInput
  //       ? Object.values(_searchkey).some(
  //         (field) =>
  //           typeof field === "string" &&
  //           field.toUpperCase().includes(searchInput.toUpperCase())
  //       )
  //       : true;

  //     return searchMatch;
  //   })
  //   : null;

  // nine dots menu start
  const nineDotsAdminMenu = [
    // { title: "Country's List", link: "/countrylist", icon: "public" },

    { title: "Society's List", link: "/societylist", icon: "home" },
  ];
  const nineDotsMenu = [
    // { title: "Country's List", link: "/countrylist", icon: "public" },
    { title: "State's List", link: "/statelist", icon: "map" },
    {
      title: "Locality's List",
      link: "/localitylist",
      icon: "holiday_village",
    },
    { title: "City's List", link: "/citylist", icon: "location_city" },
  ];
  // nine dots menu end

  // View mode start
  const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns
  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };
  // View mode end



  return (
    <>
      <div className="top_header_pg pg_bg pg_adminproperty">
        <div
          className={`page_spacing ${filteredSocietyData && filteredSocietyData.length === 0 && "pg_min_height"
            }`}
        >
          <NineDots
            nineDotsMenu={
              user && user.role === "superAdmin"
                ? nineDotsMenu
                : nineDotsAdminMenu
            }
          />

          {/* {filteredSocietyData && filteredSocietyData.length === 0 && (
            <div className={`pg_msg ${handleAddSectionFlag && "d-none"}`}>
              <div>
                No Society Yet!
                <div
                  onClick={handleAddSection}
                  className={`theme_btn no_icon header_btn mt-3 ${handleAddSectionFlag ? "btn_border" : "btn_fill"
                    }`}
                >
                  {handleAddSectionFlag ? "Cancel" : "Add New"}
                </div>
              </div>
            </div>
          )} */}
          {(
            <>
              <div className="pg_header d-flex justify-content-between">
                <div className="left">
                  <h2 className="m22">
                    Search for Societies
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
                  style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "15px" }}
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
                      onChange={(e) => {
                        setState(e);
                        handleStateChange(e);
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
                  <div>
                    <Select
                      className=""
                      // onChange={(option) => handleFilterStateChange(option)}
                      // onChange={(option) => setState(option)}
                      onChange={(e) => {
                        setCity(e);
                        handleCityChange(e);
                      }}
                      // changeFilter={changeFilter}
                      options={cityOptions.current}
                      value={city}
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
                  {<div>
                    <Select
                      className=""
                      // onChange={(option) => handleFilterStateChange(option)}
                      // onChange={(option) => setState(option)}
                      onChange={(e) => {
                        setLocality(e);
                        // filteredDataNew(e);
                        handleLocalityChange(e)
                      }}
                      // changeFilter={changeFilter}
                      options={localityOptions.current}
                      value={locality}
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
                  </div>}
                </div>
                <div className="right">
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
                      <span className="material-symbols-outlined">
                        view_list
                      </span>
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
            <form>
              <div className="row row_gap form_full">
                {/* <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Country</label>
                    <div className="form_field_inner">
                      <Select
                        className=""
                        onChange={handleCountryChange}
                        // options={countryOptionsSorted.current}
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
                </div> */}
                {/* <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">State</label>
                    <div className="form_field_inner">
                      <Select
                        className=""
                        onChange={handleStateChange}
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
                </div> */}
                {/* <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">City</label>
                    <div className="form_field_inner">
                      <Select
                        className=""
                        onChange={handleCityChange}
                        options={cityOptions.current}
                        // options={stateList}
                        value={city}
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
                </div> */}
                {/* <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Locality</label>
                    <div className="form_field_inner">
                      <Select
                        className=""
                        onChange={(option) => setLocality(option)}
                        options={localityOptions.current}
                        // options={stateList}
                        value={locality}
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
                </div> */}
                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Society</label>
                    <div className="form_field_inner">
                      <input
                        required
                        type="text"
                        placeholder="Entry Society Name"
                        onChange={(e) => setSociety(e.target.value)}
                        value={society}
                        styles={{
                          backgroundColor: "red",
                          borderBottom: " 5px solid var(--theme-blue)",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6">
                  <div className="form_field st-2 label_top">
                    <label htmlFor="">Category</label>
                    <div className="field_box theme_radio_new">
                      <div className="theme_radio_container" style={{
                        padding: "0px",
                        border: "none",
                        margin: "10px 0px"
                      }}>
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
                    className="theme_btn btn_border no_icon text-center"
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
            </form>
          </div>
          <div className="vg22"></div>
          {filteredSocietyData && filteredSocietyData.length > 0 ? (
            <div className="m18">
              Filtered Society: <span className="text_orange">{filteredSocietyData.length}</span>
            </div>
          ) : (
            "No data"
          )}
          {filteredSocietyData && filteredSocietyData.length !== 0 && (
            <>
              <div className="master_data_card">
                {viewMode === "card_view" && (
                  <>
                    {filteredSocietyData &&
                      filteredSocietyData.map((data) => (
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
                                      data.locality,
                                      data.society,
                                      data.category ? data.category : "Residential"
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
                                    {data.society}{" "}
                                  </h5>
                                  <small
                                    style={{
                                      margin: "0",
                                      transform: "translateY(5px)",
                                    }}
                                  >
                                    {/* {dblocalitiesdocuments[2].id} */}
                                    {
                                      (
                                        filteredLocalityData &&
                                        filteredLocalityData.find(
                                          (e) => e.id === data.locality
                                        )
                                      )?.locality
                                    }
                                    , {/* {data.city}, */}
                                    {
                                      (
                                        masterCity &&
                                        masterCity.find(
                                          (e) => e.id === data.city
                                        )
                                      )?.city
                                    }
                                    ,{" "}
                                    {
                                      (
                                        masterState &&
                                        masterState.find(
                                          (e) => e.id === data.state
                                        )
                                      )?.state
                                    }
                                    ,{" "}
                                    {
                                      (
                                        masterCountry &&
                                        masterCountry.find(
                                          (e) => e.id === data.country
                                        )
                                      ).country
                                    }
                                  </small>
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
                  {filteredSocietyData && (
                    <MasterSocietyTable filterData={filteredSocietyData} />
                  )}
                </>
              )}
            </>
          )}
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
        </div>
      </div>
    </>
  );
}
