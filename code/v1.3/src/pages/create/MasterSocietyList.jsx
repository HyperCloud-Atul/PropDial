import { useState, useEffect, useRef } from "react";
import { projectFirestore } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { useCommon } from "../../hooks/useCommon";
import Select from "react-select";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
// component
import NineDots from "../../components/NineDots";

export default function MasterSocietyList() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  const { camelCase } = useCommon();
  // Scroll to the top of the page whenever the location changes end
  const { addDocument, response } = useFirestore("m_societies");
  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("m_societies");
  const { documents: dbcitiesdocuments, error: dbcitieserror } = useCollection(
    "m_cities"
  );
  const { documents: dbstatesdocuments, error: dbstateserror } = useCollection(
    "m_states"
  );
  const { documents: masterSociety, error: masterSocietyerror } =
    useCollection("m_societies", "", ["society", "asc"]);
  const { documents: dblocalitiesdocuments, error: dblocalitieserror } = useCollection(
    "m_localities"
  );

  // const { documents: masterState, error: masterStateerror } = useCollection('m_states')
  const { documents: masterCountry, error: masterCountryerror } =
    useCollection("m_countries");
  // console.log('masterCountry:', masterCountry)
  const [country, setCountry] = useState();
  const [countryList, setCountryList] = useState();
  const [dbStateList, setdbStateList] = useState();
  const [state, setState] = useState();
  const [dbCityList, setdbCityList] = useState();
  const [city, setCity] = useState();
  const [dbLocalityList, setdbLocalityList] = useState();
  const [locality, setLocality] = useState();
  const [society, setSociety] = useState();
  const [formError, setFormError] = useState(null);
  const [formBtnText, setFormBtnText] = useState("");
  const [currentDocid, setCurrentDocid] = useState(null);
  const [handleAddSectionFlag, sethandleAddSectionFlag] = useState(false);
  let countryOptions = useRef([]);
  let countryOptionsSorted = useRef([]);
  let stateOptions = useRef([]);
  let stateOptionsSorted = useRef([]);
  let cityOptions = useRef([]);
  let cityOptionsSorted = useRef([]);
  let localityOptions = useRef([]);
  let localityOptionsSorted = useRef([]);

  useEffect(() => {

    setdbLocalityList(dblocalitiesdocuments)
    setdbCityList(dbcitiesdocuments)
    setdbStateList(dbstatesdocuments)

    // console.log('in useeffect')
    if (masterCountry) {
      countryOptions.current = masterCountry.map((countryData) => ({
        label: countryData.country,
        value: countryData.id,
      }));

      console.log("countryOptions: ", countryOptions)

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
    console.log('countryname:', countryname)
    const countryid = masterCountry && masterCountry.find((e) => e.country === countryname).id
    console.log('countryid:', countryid)
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
          handleStateChange({
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

  //Stae select onchange
  const handleStateChange = async (option) => {
    setState(option);
    // console.log('option.label:', option.label)
    let statename = option.label;
    // console.log('statename:', statename)
    const stateid = dbstatesdocuments && dbstatesdocuments.find((e) => e.state === statename).id
    // console.log('stateid:', stateid)
    const ref = await projectFirestore
      .collection("m_cities")
      .where("state", "==", stateid);
    ref.onSnapshot(
      async (snapshot) => {
        if (snapshot.docs) {
          cityOptions.current = snapshot.docs.map((cityData) => ({
            label: cityData.data().city,
            value: cityData.id,
          }));
          cityOptionsSorted.current = cityOptions.current.sort((a, b) =>
            a.label.localeCompare(b.label)
          );

          setCity({
            label: cityOptionsSorted.current[0].label,
            value: cityOptionsSorted.current[0].value,
          });
          handleCityChange({
            label: cityOptionsSorted.current[0].label,
            value: cityOptionsSorted.current[0].value,
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
  //City select onchange
  const handleCityChange = async (option) => {
    setCity(option);
    let cityname = option.label;
    // console.log('cityname:', cityname)
    const cityid = dbcitiesdocuments && dbcitiesdocuments.find((e) => e.city === cityname).id
    // console.log('cityid:', cityid)
    const ref = await projectFirestore
      .collection("m_localities")
      .where("city", "==", cityid);
    ref.onSnapshot(
      async (snapshot) => {
        if (snapshot.docs) {
          console.log("snapshot.docs: ", snapshot.docs)
          localityOptions.current = snapshot.docs.map((localityData) => ({
            label: localityData.data().locality,
            value: localityData.id,
          }));

          localityOptionsSorted.current = localityOptions.current.sort((a, b) =>
            a.label.localeCompare(b.label)
          );

          // console.log("localityOptionsSorted: ", localityOptionsSorted)

          setLocality({
            label: localityOptionsSorted.current[0].label,
            value: localityOptionsSorted.current[0].value,
          });
        } else {
          // setError('No such document exists')

          localityOptionsSorted = null
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
    setFormError(null);

    let societyname = camelCase(society.trim());

    if (currentDocid) {
      await updateDocument(currentDocid, {
        country: country.value,
        state: state.value,
        city: city.value,
        locality: locality.value,
        society: societyname,
      });
      setFormError("Successfully updated");
    } else {
      let ref = projectFirestore
        .collection("m_societies")
        .where("society", "==", societyname);
      const unsubscribe = ref.onSnapshot(async (snapshot) => {
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        if (results.length === 0) {
          const dataSet = {
            country: country.value,
            state: state.value,
            city: city.value,
            locality: locality.value,
            society: societyname,
            status: "active",
          };
          await addDocument(dataSet);
          setFormError("Successfully added");
          sethandleAddSectionFlag(!handleAddSectionFlag);
        } else {
          setFormError("Already added");
          sethandleAddSectionFlag(!handleAddSectionFlag);
        }
      });
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
    handleCountryChange(country);
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
    docsociety
  ) => {
    // console.log('data:', data)
    // console.log("country id: ", doccountry)
    const countryname = (masterCountry && masterCountry.find((e) => e.id === doccountry)).country
    // console.log("country name: ", countryname)
    const statename = (dbstatesdocuments && dbstatesdocuments.find((e) => e.id === docstate)).state
    const cityname = (dbcitiesdocuments && dbcitiesdocuments.find((e) => e.id === doccity)).city
    const localityname = (dblocalitiesdocuments && dblocalitiesdocuments.find((e) => e.id === doclocality)).locality

    window.scrollTo(0, 0);
    setFormError(null);
    setCountry({ label: countryname, value: doccountry });
    setState({ label: statename, value: docstate });
    setCity({ label: cityname, value: doccity });
    setLocality({ label: localityname, value: doclocality });
    setSociety(docsociety);
    sethandleAddSectionFlag(!handleAddSectionFlag);
    setFormBtnText("Update Society");
    setCurrentDocid(docid);
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
          className={`page_spacing ${masterSociety && masterSociety.length === 0 && "pg_min_height"
            }`}
        >
          <NineDots nineDotsMenu={nineDotsMenu} />

          {masterSociety && masterSociety.length === 0 && (
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
          )}
          {masterSociety && masterSociety.length !== 0 && (
            <>
              <div className="pg_header d-flex justify-content-between">
                <div className="left">
                  <h2 className="m22">
                    Total Society:{" "}
                    {masterSociety && (
                      <span className="text_orange">{masterSociety.length}</span>
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
                    // value={searchInput}
                    // onChange={handleSearchInputChange}
                    />
                    <div className="field_icon">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                  </div>
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
            <form>
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
                        onChange={handleStateChange}
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

                      <Select
                        className=""
                        onChange={handleCityChange}
                        options={cityOptionsSorted.current}
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
                </div>
                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Locality</label>
                    <div className="form_field_inner">

                      <Select
                        className=""
                        onChange={(option) => setLocality(option)}
                        options={localityOptionsSorted.current}
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
                </div>
                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">New Society</label>
                    <div className="form_field_inner">
                      <input
                        required
                        type="text"
                        placeholder="Entry Locality Name"
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
          {masterSociety && masterSociety.length !== 0 && (
            <>
              <div className="master_data_card">
                {viewMode === "card_view" && (
                  <>
                    {masterSociety &&
                      masterSociety.map((data) => (
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
                                      data.society
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
                                    {(dbLocalityList && dbLocalityList.find((e) => e.id === data.locality))?.locality},
                                    {" "}
                                    {/* {data.city}, */}
                                    {(dbCityList && dbCityList.find((e) => e.id === data.city))?.city},{" "}
                                    {(dbStateList && dbStateList.find((e) => e.id === data.state))?.state},{" "}
                                    {(masterCountry && masterCountry.find((e) => e.id === data.country)).country}
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
                                        data.status === "active" ? "green" : "red",
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
    </>
  );
}
