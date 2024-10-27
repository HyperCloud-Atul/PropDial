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

const dataFilter = ["INDIA", "USA", "OTHERS", "INACTIVE"];
export default function MasterCityList() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  const { camelCase } = useCommon();
  // Scroll to the top of the page whenever the location changes end
  const { addDocument, response: responseAddDocument } =
    useFirestore("m_cities");
  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("m_cities");
  // const { documents: masterCity, error: masterCityerror } =
  //   useCollection("m_cities");
  const { documents: masterCity, error: masterCityerror } = useCollection(
    "m_cities",
    "",
    ["city", "asc"]
  );
  const { documents: masterState, error: masterStateerror } = useCollection(
    "m_states",
    "",
    ["state", "asc"]
  );
  // const { documents: masterState, error: masterStateerror } = useCollection('m_states')
  const { documents: masterCountry, error: masterCountryerror } =
    useCollection("m_countries");
  // console.log('masterCountry:', masterCountry)

  const [country, setCountry] = useState();
  const [countryList, setCountryList] = useState();
  const [state, setState] = useState();
  // const [stateList, setStateList] = useState()
  const [city, setCity] = useState();
  const [formError, setFormError] = useState(null);
  const [formBtnText, setFormBtnText] = useState("");
  const [currentDocid, setCurrentDocid] = useState(null);
  const [filter, setFilter] = useState("INDIA");
  const [handleAddSectionFlag, sethandleAddSectionFlag] = useState(false);
  let countryOptions = useRef([]);
  let countryOptionsSorted = useRef([]);
  let stateOptions = useRef([]);
  let stateOptionsSorted = useRef([]);

  useEffect(() => {
    // console.log('in useeffect')
    if (masterCountry) {
      countryOptions.current = masterCountry.map((countryData) => ({
        label: countryData.country,
        value: countryData.id,
      }));

      countryOptionsSorted.current = countryOptions.current.sort((a, b) =>
        a.label.localeCompare(b.label)
      );

      setCountryList(countryOptionsSorted.current);

      setCountry({
        label: countryOptionsSorted.current[0].label,
        value: countryOptionsSorted.current[0].value,
      })

      handleCountryChange({
        label: countryOptionsSorted.current[0].label,
        value: countryOptionsSorted.current[0].value,
      });
    }
  }, [masterCountry]);

  //Country select onchange
  const handleCountryChange = async (option) => {
    // setCountry(option);
    let countryname = option.label;
    // console.log('countryname:', countryname)
    const countryid = masterCountry && masterCountry.find((e) => e.country === countryname).id
    // console.log('countryid:', countryid)
    const ref = await projectFirestore
      .collection("m_states")
      .where("country", "==", countryid);
    ref.onSnapshot(
      async (snapshot) => {
        if (snapshot.docs) {
          stateOptions.current = snapshot.docs.map((stateData) => ({
            label: stateData.data().state,
            value: stateData.id,
          }));
          // console.log('stateOptions:', stateOptions)
          stateOptionsSorted.current = stateOptions.current.sort((a, b) =>
            a.label.localeCompare(b.label)
          );


          setState({
            label: stateOptionsSorted.current[0].label,
            value: stateOptionsSorted.current[0].value,
          });

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

  let results = [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    let _addCityFlag = false;

    let cityname = camelCase(city.trim());
    // console.log('cityname:', cityname)
    // console.log("Updated currentDocid: ", currentDocid)
    if (currentDocid != null) {
      // console.log("Updated currentDocid: ", currentDocid)
      setFormError("Updated Successfully");
      // sethandleAddSectionFlag(!handleAddSectionFlag);
      await updateDocument(currentDocid, {
        country: country.value,
        state: state.value,
        city: cityname,
      });

    } else if (currentDocid == null) {
      let ref = projectFirestore
        .collection("m_cities")
        .where("city", "==", cityname);
      const unsubscribe = ref.onSnapshot(async (snapshot) => {
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });
        // console.log("_addCityFlag: ", _addCityFlag)
        // console.log("results.length: ", results.length)
        if (results.length === 0) {
          const dataSet = {
            country: country.value,
            state: state.value,
            city: cityname,
            status: "active",
          };

          _addCityFlag = true
          // console.log("_addCityFlag: ", _addCityFlag)
          setFormError("Successfully added");
          // sethandleAddSectionFlag(!handleAddSectionFlag);
          // console.log("Successfully added")
          // console.log("handleAddSectionFlag: ", handleAddSectionFlag)
          await addDocument(dataSet);
        } else if (results.length > 0 && _addCityFlag === false) {
          // console.log("Duplicate City")
          setFormError("Duplicate City");
          // console.log("handleAddSectionFlag: ", handleAddSectionFlag)
          // sethandleAddSectionFlag(!handleAddSectionFlag);
        }

      });

    }
  };


  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };


  const handleAddSection = () => {
    setCurrentDocid(null);
    setFormError("");
    sethandleAddSectionFlag(!handleAddSectionFlag);
    setFormBtnText("Add");
    handleCountryChange(country);
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
    const countryname = (masterCountry && masterCountry.find((e) => e.id === doccountry)).country
    // console.log("country name: ", countryname)
    const statename = (masterState && masterState.find((e) => e.id === docstate)).state

    setCountry({ label: countryname, value: doccountry });
    setState({ label: statename, value: docstate });
    setCity(doccity);
    sethandleAddSectionFlag(!handleAddSectionFlag);
    setFormBtnText("Update City");

  };

  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredData = masterCity
    ? masterCity.filter((document) => {
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
          const indiaid1 = masterCountry && masterCountry.find((e) => e.country.toUpperCase() === "INDIA").id
          const usaid1 = masterCountry && masterCountry.find((e) => e.country.toUpperCase() === "USA").id
          if (document.country !== indiaid1 && document.country !== usaid1) {
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

  return (
    <div className="top_header_pg pg_bg pg_adminproperty">
      <div
        className="page_spacing pg_min_height"
      >
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
                    <span className="material-symbols-outlined">view_list</span>
                  </div>
                </div>
                <div
                  onClick={handleAddSection}
                  className={`theme_btn no_icon header_btn ${handleAddSectionFlag ? "btn_border" : "btn_fill"
                    }`}
                >
                  {handleAddSectionFlag ? "Cancel" : "Add New"}
                </div>
              </div>
            </div>

            <hr></hr>
          </>
        )}
        <div className="vg12"></div>
        <div
          style={{
            overflow: handleAddSectionFlag ? "visible" : "hidden",
            // transition: "1s",
            opacity: handleAddSectionFlag ? "1" : "0",
            maxHeight: handleAddSectionFlag ? "100%" : "0",
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
                    // options={countryOptionsSorted.current}
                    options={countryList}
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
                    options={stateOptionsSorted.current}
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

          {formError && (
            <>
              <div className="error">{formError}</div>
              <div className="vg22"></div>
            </>
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
              Cancel
            </div>
            <div
              className="theme_btn btn_fill no_icon text-center"
              onClick={(e) => handleSubmit(e)}
              style={{
                minWidth: "140px",
              }}
            >
              {formBtnText}
            </div>
          </div>

          <hr />
        </div>
        {masterCity && masterCity.length !== 0 && (
          <>
            {/* {formError && (
              <>
                <div className="error">{formError}</div>
                <div className="vg22"></div>
              </>
            )} */}
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
                                <small
                                  style={{
                                    margin: "0",
                                    transform: "translateY(5px)",
                                  }}
                                >
                                  {/* {camelCase(data.state)}, */}
                                  {(masterState && masterState.find((e) => e.id === data.state)).state}
                                  {" "}
                                  {(masterCountry && masterCountry.find((e) => e.id === data.country)).country}
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
              <h5 className="text-center text_green">
                Coming Soon....
              </h5>
            )}
          </>
        )}
      </div>
    </div>
  );
}
