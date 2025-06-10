import { useState, useEffect, useRef } from "react";
import { projectFirestore } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import Filters from "../../components/Filters";
import { useCommon } from "../../hooks/useCommon";
import { Link } from "react-router-dom";
import MasterStateTable from "./MasterStateTable";

// component
import NineDots from "../../components/NineDots";

const dataFilter = ["INDIA", "USA", "OTHERS", "INACTIVE"];

export default function MasterStateList() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const { camelCase } = useCommon();
  // const { addDocument, response } = useFirestore("m_states");
  const { addDocumentWithCustomDocId, response } = useFirestore("m_states");

  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("m_states");

  //Master Data Loading Initialisation - Start
  const { documents: masterCountry, error: masterCountryerror } =
    useCollection("m_countries", "", ["country", "asc"]);

  const { documents: masterState, error: masterStateError } = useCollection(
    "m_states", "", ["state", "asc"]
  );
  const { documents: masterCity, error: masterCityError } = useCollection(
    "m_cities", "", ["city", "asc"]
  );
  const { documents: masterLocality, error: masterLocalityerror } =
    useCollection("m_localities", "", ["locality", "asc"]);

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

  const [stateCode, setStateCode] = useState("");
  const [gstStateCode, setGSTStateCode] = useState("");
  const [formError, setFormError] = useState(null);
  const [formErrorType, setFormErrorType] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formBtnText, setFormBtnText] = useState("");
  const [currentDocid, setCurrentDocid] = useState(null);
  const [handleAddSectionFlag, sethandleAddSectionFlag] = useState(false);
  const [filter, setFilter] = useState("INDIA");


  useEffect(() => {
    // console.log("in useeffect");
    if (masterCountry) {
      countryOptions.current = masterCountry.map((countryData) => ({
        label: countryData.country,
        value: countryData.id,
      }));

    }
  }, [masterCountry]);

  let results = [];
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setFormError(null);

  //   let _addCityFlag = false;

  //   let _state = camelCase(state.trim());
  //   let _stateCode = stateCode.trim().toUpperCase();
  //   let _gstStateCode = gstStateCode.trim().toUpperCase();
  //   if (currentDocid != null) {
  //     // console.log("Updated currentDocid: ", currentDocid)
  //     setFormError("Updated Successfully");
  //     await updateDocument(currentDocid, {
  //       country: country.value,
  //       state: _state,
  //       stateCode: _stateCode,
  //       gstStateCode: _gstStateCode
  //     });

  //   } else if (currentDocid == null) {
  //     let ref = projectFirestore
  //       .collection("m_states")
  //       .where("state", "==", _state);

  //     const unsubscribe = ref.onSnapshot(async (snapshot) => {
  //       snapshot.docs.forEach((doc) => {
  //         results.push({ ...doc.data(), id: doc.id });
  //       });

  //       // console.log("_addCityFlag: ", _addCityFlag)
  //       // console.log("results.length: ", results.length)

  //       if (results.length === 0) {
  //         const dataSet = {
  //           docId: "_" + _state.split(" ").join("_").toLowerCase(),
  //           country: country.value,
  //           state: _state,
  //           stateCode: _stateCode,
  //           gstStateCode: _gstStateCode,
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
  //         setFormError("Duplicate State");
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

    if (state) {

      const _state = camelCase(state.trim());
      const _stateCode = stateCode.trim().toUpperCase();
      const _gstStateCode = gstStateCode.trim().toUpperCase();
      const collectionRef = projectFirestore.collection("m_states");


      if (currentDocid) {
        // Query to check if country already exists

        const querySnapshot = await collectionRef
          .where("state", "==", _state)
          .get();

        if (querySnapshot.empty) {

          // Update existing document
          await updateDocument(currentDocid, {
            country: country.value,
            state: _state,
            stateCode: _stateCode,
            gstStateCode: _gstStateCode,
          });

          setFormErrorType("success_msg");
          setFormError("Updated Successfully");
          setIsAdding(false);

          // Reset error message after 5 seconds
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
          // Query to check for duplicate state
          const querySnapshot = await collectionRef
            .where("state", "==", _state)
            .get();

          if (querySnapshot.empty) {
            // If no duplicate exists, add new document
            const dataSet = {
              docId: "_" + _state.split(" ").join("_").toLowerCase(),
              country: country.value,
              state: _state,
              stateCode: _stateCode,
              gstStateCode: _gstStateCode,
              status: "active",
            };
            const _customDocId = dataSet.docId;

            await addDocumentWithCustomDocId(dataSet, _customDocId);

            setFormErrorType("success_msg");
            setFormError("Successfully added");
            setIsAdding(false);

            // Reset form and messages after 5 seconds
            setTimeout(() => {
              setFormError(null);
              setFormErrorType(null);
              setState("");
              setStateCode("");
              setGSTStateCode("");
            }, 5000);
          } else {
            // Handle duplicate case
            setFormErrorType("error_msg");
            setFormError("Duplicate State");
            setIsAdding(false);

            // Reset error message after 5 seconds
            setTimeout(() => {
              setFormError(null);
              setFormErrorType(null);
            }, 5000);
          }
        } catch (error) {
          // Handle errors if any
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
      setFormError("State should not be blank ");
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
  };
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredData = masterState
    ? masterState.filter((document) => {
      let isFiltered = false;

      // Role and country-based filtering
      switch (filter) {
        case "INDIA":
          const indiaid = masterCountry && masterCountry.find((e) => e.country.toUpperCase() === "INDIA").id
          if (document.country === indiaid) {
            isFiltered = true;
          }
          break;
        case "USA":
          const usaid = masterCountry && masterCountry.find((e) => e.country.toUpperCase() === "USA").id
          if (document.country === usaid) {
            isFiltered = true;
          }
          break;
        case "OTHERS":
          if (document.country !== "INDIA" && document.country !== "USA") {
            isFiltered = true;
          }
          break;
        case "INACTIVE":
          if (document.status.toLowerCase() === "inactive") {
            isFiltered = true;
          }
          break;
        default:
          isFiltered = true;
      }

      // Search input filtering
      const searchMatch = searchInput
        ? Object.values(document).some(
          (field) =>
            typeof field === "string" &&
            field.toUpperCase().includes(searchInput.toUpperCase())
        )
        : true;

      return isFiltered && searchMatch;
    })
    : null;


  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);

  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };

  const handleAddSection = () => {
    setCurrentDocid(null);
    setFormError(null);
    sethandleAddSectionFlag(!handleAddSectionFlag);
    setFormBtnText("Add State");
    setCountry({ label: "INDIA", value: "_india" })
    setState("");
    setStateCode("")
    setGSTStateCode("")
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

  const handleEditCard = (docid, doccountry, docstate, docstatecode, docgststatecode) => {
    // console.log('docid in handleEditCard:', docid)
    setCurrentDocid(docid);
    window.scrollTo(0, 0);
    setFormError(null);
    // console.log("country id: ", doccountry)
    const countryname = (masterCountry && masterCountry.find((e) => e.id === doccountry)).country
    // console.log("country name: ", countryname)
    setCountry({ label: countryname, value: doccountry });
    setState(docstate);
    setStateCode(docstatecode)
    setGSTStateCode(docgststatecode)
    sethandleAddSectionFlag(!handleAddSectionFlag);
    setFormBtnText("Update State");

  };

  // nine dots menu start
  const nineDotsMenu = [
    // { title: "Country's List", link: "/countrylist", icon: "public" },
    { title: "City's List", link: "/citylist", icon: "location_city" },
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

  return (
    <>
      <div className="top_header_pg pg_bg pg_adminproperty">
        <div
          className={`page_spacing pg_min_height ${masterState && masterState.length === 0 && "pg_min_height"
            }`}
        >
          <NineDots nineDotsMenu={nineDotsMenu} />

          {masterState && masterState.length === 0 && (
            <div className={`pg_msg ${handleAddSectionFlag && "d-none"}`}>
              <div>
                No State Yet!
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
          {masterState && masterState.length !== 0 && (
            <>
              <div className="pg_header d-flex justify-content-between">
                <div className="left">
                  <h2 className="m22">
                    Total State:{" "}
                    {masterState && (
                      <span className="text_orange">{masterState.length}</span>
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
                <div className="left">
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
                  {/* No need to add new state from UI, It will be added from back-end only */}
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
                <div className="col-xl-6 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Country</label>
                    <div className="form_field_inner">
                      <Select
                        className=""
                        onChange={(option) => setCountry(option)}
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
                <div className="col-xl-6 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">State</label>
                    <div className="form_field_inner">
                      <input
                        required
                        type="text"
                        placeholder="Entry State Name"
                        onChange={(e) => setState(e.target.value)}
                        value={state}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">State Code</label>
                    <div className="form_field_inner">
                      <input
                        required
                        type="text"
                        placeholder="Entry State Code"
                        onChange={(e) => setStateCode(e.target.value)}
                        value={stateCode}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">GST State Code</label>
                    <div className="form_field_inner">
                      <input
                        required
                        type="text"
                        placeholder="Entry GST State Code"
                        onChange={(e) => setGSTStateCode(e.target.value)}
                        value={gstStateCode}
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
            </form>
          </div>
          {masterState && masterState.length !== 0 && (
            <>
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
                                      data.stateCode,
                                      data.gstStateCode
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
                                    {camelCase(data.state)}
                                  </h5>
                                  <small
                                    style={{
                                      margin: "0",
                                      transform: "translateY(5px)",
                                    }}
                                  >
                                    {(masterCountry && masterCountry.find((e) => e.id === data.country)).country}, {" "}
                                    {/* {data.country} */}
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
                // <h5 className="text-center text_green">Coming Soon....</h5>
                <>{filteredData && <MasterStateTable filterData={filteredData} />}</>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
