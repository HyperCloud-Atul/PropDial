import { useState, useEffect, useRef } from "react";
import { projectFirestore } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import Select from "react-select";
import Filters from "../../Components/Filters";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Create.css";
// component
import Hero from "../../Components/Hero";

const dataFilter = ["INDIA", "USA", "OTHERS", "INACTIVE"];
export default function MasterCityList() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const { addDocument, response: responseAddDocument } =
    useFirestore("m_cities");
  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("m_cities");
  const { documents: masterCity, error: masterCityerror } =
    useCollection("m_cities");
  // const { documents: masterState, error: masterStateerror } = useCollection('m_states')
  const { documents: masterCountry, error: masterCountryerror } =
    useCollection("m_countries");
  // console.log('masterCountry:', masterCountry)

  const [country, setCountry] = useState({ label: "INDIA", value: "INDIA" });
  const [countryList, setCountryList] = useState();
  const [state, setState] = useState();
  // const [stateList, setStateList] = useState()
  const [city, setCity] = useState();
  const [formError, setFormError] = useState(null);
  const [formBtnText, setFormBtnText] = useState("");
  const [currentDocid, setCurrentDocid] = useState(null);
  const [filter, setFilter] = useState("INDIA");

  let countryOptions = useRef([]);
  let countryOptionsSorted = useRef([]);
  let stateOptions = useRef([]);
  let stateOptionsSorted = useRef([]);

  useEffect(() => {
    // console.log('in useeffect')
    if (masterCountry) {
      countryOptions.current = masterCountry.map((countryData) => ({
        label: countryData.country,
        value: countryData.country,
      }));

      countryOptionsSorted.current = countryOptions.current.sort((a, b) =>
        a.label.localeCompare(b.label)
      );

      setCountryList(countryOptionsSorted.current);

      handleCountryChange(country);
    }
  }, [masterCountry]);

  //Country select onchange
  const handleCountryChange = async (option) => {
    setCountry(option);
    let countryname = option.label;
    // console.log('countryname:', countryname)
    const ref = await projectFirestore
      .collection("m_states")
      .where("country", "==", countryname);
    ref.onSnapshot(
      async (snapshot) => {
        if (snapshot.docs) {
          stateOptions.current = snapshot.docs.map((stateData) => ({
            label: stateData.data().state,
            value: stateData.data().state,
          }));
          // console.log('stateOptions:', stateOptions)
          stateOptionsSorted.current = stateOptions.current.sort((a, b) =>
            a.label.localeCompare(b.label)
          );

          // console.log('stateOptionsSorted.current:', stateOptionsSorted.current)
          // setStateList(stateOptionsSorted.current)

          if (countryname === "INDIA") {
            setState({ label: "DELHI", value: "DELHI" });
          } else {
            setState({
              label: stateOptionsSorted.current[0].label,
              value: stateOptionsSorted.current[0].value,
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

  let results = [];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    let cityname = city.trim().toUpperCase();
    // console.log('cityname:', cityname)

    if (currentDocid) {
      await updateDocument(currentDocid, {
        country: country.label,
        state: state.label,
        city: cityname,
      });
    } else {
      let ref = projectFirestore
        .collection("m_cities")
        .where("city", "==", cityname);
      const unsubscribe = ref.onSnapshot(async (snapshot) => {
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        if (results.length === 0) {
          const dataSet = {
            country: country.label,
            state: state.label,
            city: cityname,
            status: "active",
          };
          await addDocument(dataSet);
          setFormError("Successfully added");
        } else {
          setFormError("Already added");
        }
      });
    }
  };
  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);

  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };

  const [handleAddSectionFlag, sethandleAddSectionFlag] = useState(false);
  const handleAddSection = () => {
    setFormError(null);
    sethandleAddSectionFlag(true);
    setFormBtnText("Add City");
    handleCountryChange(country);
    setCity("");
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

  const handleEditCard = (docid, doccountry, docstate, doccity) => {
    // console.log('data:', data)
    setFormError(null);
    setCountry({ label: doccountry, value: doccountry });
    setState({ label: docstate, value: docstate });

    setCity(doccity);
    sethandleAddSectionFlag(true);
    setFormBtnText("Update City");
    setCurrentDocid(docid);
  };

  const filteredData = masterCity
    ? masterCity.filter((document) => {
        let isfiltered = false;
        switch (filter) {
          case "INDIA":
            return document.country === "INDIA"
              ? (isfiltered = true)
              : isfiltered;

          case "USA":
            return document.country === "USA"
              ? (isfiltered = true)
              : isfiltered;

          case "OTHERS":
            if (document.country !== "INDIA" && document.country !== "USA") {
              isfiltered = true;
            }
            return isfiltered;
          case "INACTIVE":
            return isfiltered;
          default:
            return true;
        }
      })
    : null;

  return (
    <div>
      <Hero
        pageTitle="City List"
        pageSubTitle="Add or update City
        "
        heroImage="./assets/img/city_banner.jpg"
      ></Hero>
      <div onClick={openMoreAddOptions} className="property-list-add-property">
        <span className="material-symbols-outlined">apps</span>
      </div>

      <div
        className={
          handleMoreOptionsClick
            ? "more-add-options-div open"
            : "more-add-options-div"
        }
        onClick={closeMoreAddOptions}
        id="moreAddOptions"
      >
        <div className="more-add-options-inner-div">
          <div className="more-add-options-icons">
            <h1>Close</h1>
            <span className="material-symbols-outlined">close</span>
          </div>

          <Link to="/countrylist" className="more-add-options-icons">
            <h1>Country List</h1>
            <span className="material-symbols-outlined">public</span>
          </Link>

          <Link to="/statelist" className="more-add-options-icons">
            <h1>State List</h1>
            <span className="material-symbols-outlined">map</span>
          </Link>

          <div
            onClick={handleAddSection}
            className="more-add-options-icons active"
          >
            <h1>Add City</h1>
            <span className="material-symbols-outlined">add</span>
          </div>

          <Link to="/localitylist" className="more-add-options-icons">
            <h1>Locality List</h1>
            <span className="material-symbols-outlined">holiday_village</span>
          </Link>

          <Link to="/societylist" className="more-add-options-icons">
            <h1>Society List</h1>
            <span className="material-symbols-outlined">home</span>
          </Link>
        </div>
      </div>

      <div className="container">
        <div
          style={{
            overflow: "hidden",
            transition: "2s",
            opacity: handleAddSectionFlag ? "1" : "0",
            maxHeight: handleAddSectionFlag ? "800px" : "0",
          }}
        >
          {/* <form onSubmit={handleSubmit} className="auth-form"> */}
          <form
            onSubmit={handleSubmit}
            className="auth-form"
            style={{ maxWidth: "350px" }}
          >
            <div className="row no-gutters">
              <div className="col-12">
                <div>
                  <h1 className="owner-heading">Country</h1>
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
                  <div className="underline"></div>
                </div>
              </div>
              <div className="col-12">
                <div>
                  <h1 className="owner-heading mt-3">State</h1>
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
                  <div className="underline"></div>
                </div>
              </div>
              <div className="col-12">
                <div>
                  <h1 className="owner-heading mt-3">City</h1>
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <button className="theme_btn btn_fill">{formBtnText}</button>

              {formError && (
                <div style={{ margin: "0" }} className="error">
                  {formError}
                </div>
              )}
            </div>
          </form>
        </div>
        <br />
        {filteredData && (
          <Filters
            changeFilter={changeFilter}
            filterList={dataFilter}
            filterLength={filteredData.length}
          />
        )}
        <div className="row no-gutters">
          {masterCity && masterCity.length === 0 && <p>No City Yet!</p>}
          {filteredData &&
            filteredData.map((data) => (
              <>
                <div className="col-lg-6 col-md-6 col-sm-12">
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
                              {data.city}
                            </h5>
                            <small
                              style={{
                                margin: "0",
                                transform: "translateY(5px)",
                              }}
                            >
                              {data.state}, {data.country}
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
                </div>
              </>
            ))}
        </div>
        <br />
      </div>
    </div>
  );
}
