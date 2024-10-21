import { useState, useEffect, useRef } from "react";
import { projectFirestore } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import Filters from "../../components/Filters";
import { useCommon } from "../../hooks/useCommon";
import { Link } from "react-router-dom";

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
  const { addDocument, response } = useFirestore("m_states");
  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("m_states");
  // const { documents: masterState, error: masterStateerror } =
  //   useCollection("m_states");
  const { documents: masterState, error: masterStateerror } = useCollection(
    "m_states",
    "",
    ["state", "asc"]
  );
  const { documents: masterCountry, error: masterCountryerror } =
    useCollection("m_countries");

  const [country, setCountry] = useState();
  const [state, setState] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [gstStateCode, setGSTStateCode] = useState("");
  const [formError, setFormError] = useState(null);
  const [formBtnText, setFormBtnText] = useState("");
  const [currentDocid, setCurrentDocid] = useState(null);
  const [handleAddSectionFlag, sethandleAddSectionFlag] = useState(false);
  const [filter, setFilter] = useState("INDIA");

  let countryOptions = useRef([]);
  let countryOptionsSorted = useRef([]);
  if (masterCountry) {
    countryOptions.current = masterCountry.map((countryData) => ({
      label: countryData.country,
      value: countryData.country,
    }));

    countryOptionsSorted.current = countryOptions.current.sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }
  useEffect(() => {
    // console.log("in useeffect");
  }, []);

  let results = [];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    let _addCityFlag = false;

    let _state = state.trim().toUpperCase();
    let _stateCode = stateCode.trim().toUpperCase();
    let _gstStateCode = gstStateCode.trim().toUpperCase();
    if (currentDocid != null) {
      // console.log("Updated currentDocid: ", currentDocid)
      setFormError("Updated Successfully");
      await updateDocument(currentDocid, {
        country: country.label,
        state: _state,
        stateCode: _stateCode,
        gstStateCode: _gstStateCode
      });

    } else if (currentDocid == null) {
      let ref = projectFirestore
        .collection("m_states")
        .where("state", "==", _state);

      const unsubscribe = ref.onSnapshot(async (snapshot) => {
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        // console.log("_addCityFlag: ", _addCityFlag)
        // console.log("results.length: ", results.length)

        if (results.length === 0) {
          const dataSet = {
            country: country.label,
            state: _state,
            stateCode: _stateCode,
            gstStateCode: _gstStateCode,
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
          setFormError("Duplicate State");
          // sethandleAddSectionFlag(!handleAddSectionFlag);
        }
      });
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
          if (document.country === "INDIA") {
            isFiltered = true;
          }
          break;
        case "USA":
          if (document.country === "USA") {
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
    setState("");
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

  const handleEditCard = (docid, doccountry, docstate) => {
    // console.log('docid in handleEditCard:', docid)
    setCurrentDocid(docid);
    window.scrollTo(0, 0);
    setFormError(null);
    setCountry({ label: doccountry, value: doccountry });
    setState(docstate);
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
          className={`page_spacing ${masterState && masterState.length === 0 && "pg_min_height"
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
            <form>
              <div className="row row_gap form_full">
                <div className="col-xl-6 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Country</label>
                    <div className="form_field_inner">
                      <Select
                        className=""
                        onChange={(option) => setCountry(option)}
                        options={countryOptionsSorted.current}
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
                  onClick={handleSubmit}
                  style={{
                    minWidth: "140px",
                  }}
                >
                  {formBtnText}
                </div>
              </div>
            </form>
            <hr />
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
                                      data.state
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
                                    {data.country}
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
                <h5 className="text-center text_green">Coming Soon....</h5>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
