import React from "react";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useState, useEffect, useRef } from "react";
import { useFirestore } from "../../../../hooks/useFirestore";
import { projectFirestore } from "../../../../firebase/config";
import { useCollection } from "../../../../hooks/useCollection";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";

// component
import ScrollToTop from "../../../../components/ScrollToTop";
import InactiveUserCard from "../../../../components/InactiveUserCard";
import NineDots from "../../../../components/NineDots";

const PGAgent = () => {
  const { user } = useAuthContext();
  // add document
  const {
    addDocument: addAgentDoc,
    updateDocument: updateAgentDoc,
    deleteDocument: deleteAgentDoc,
    error: addingError,
  } = useFirestore("agent-propdial");

  // get document
  const { documents: agentDoc, errors: agentDocError } = useCollection(
    "agent-propdial",
  );

  //Master Data Loading Initialisation - Start
  const { documents: masterState, error: masterStateError } = useCollection(
    "m_states", "", ["state", "asc"]
  );
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [locality, setLocality] = useState();
  const [society, setSociety] = useState();

  let stateOptions = useRef([]);
  let cityOptions = useRef([]);
  let localityOptions = useRef([]);
  let societyOptions = useRef([]);

  //Master Data Loading Initialisation - End


  useEffect(() => {
    // console.log('in useeffect')
    // Master data: State Populate
    if (masterState) {
      stateOptions.current = masterState.map((stateData) => ({
        label: stateData.state,
        value: stateData.id,
      }));

      // console.log("stateOptions: ", stateOptions)

      // handleStateChange({
      //   label: stateOptions.current[0].label,
      //   value: stateOptions.current[0].value,
      // });
    }
  }, [masterState]);

  // Populate Master Data - Start
  //State select onchange
  const handleStateChange = async (option) => {
    setState(option);
    // console.log('state.id:', option.value)   
    if (option) {
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
              console.log("No City")
              handleCityChange(null)
            }
            else {
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
    }
  };

  //City select onchange
  const handleCityChange = async (option) => {
    setCity(option);
    // console.log('city.id:', option.value)

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

            console.log("localityOptions: ", localityOptions)

            if (localityOptions.current.length === 0) {
              console.log("No Locality")
              handleLocalityChange(null)
            }
            else {
              handleLocalityChange({
                label: localityOptions.current[0].label,
                value: localityOptions.current[0].value,
              });
            }

          } else {
            handleLocalityChange(null)
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
    // console.log('locality.id:', option.value)

    if (option) {

      const ref = await projectFirestore
        .collection("m_societies")
        .where("locality", "==", option.value)
        .orderBy("society", "asc");
      ref.onSnapshot(
        async (snapshot) => {
          if (snapshot.docs) {
            societyOptions.current = snapshot.docs.map((societyData) => ({
              label: societyData.data().society,
              value: societyData.id,
            }));

            console.log("societyOptions.current: ", societyOptions.current)

            if (societyOptions.current.length === 0) {
              console.log("No Society")
              handleSocietyChange(null)
            }
            else {
              handleSocietyChange({
                label: societyOptions.current[0].label,
                value: societyOptions.current[0].value,
              });
            }
          } else {
            handleSocietyChange(null)
          }
        },
        (err) => {
          console.log(err.message);
          // setError('failed to get document')
        }
      );
    }
  };

  //Society select onchange
  const handleSocietyChange = async (option) => {
    setSociety(option);
    // console.log('society.id:', option.value)
  };

  // Populate Master Data - End

  // all useStates
  const [showAIForm, setShowAIForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentCompnayName, setAgentCompnayName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPancard, setAgentPancard] = useState("");
  const [agentGstNumber, setAgentGstNumber] = useState("");
  // functions
  const handleShowAIForm = () => setShowAIForm(!showAIForm);
  const handleChangeAgentName = (event) => setAgentName(event.target.value);
  const handleChangeAgentComanayName = (event) =>
    setAgentCompnayName(event.target.value);
  const handleChangeAgentPhone = (value) => setAgentPhone(value);
  const handleChangeAgentEmail = (event) => setAgentEmail(event.target.value);
  const handleChangeAgentPancard = (event) =>
    setAgentPancard(event.target.value);
  const handleChangeAgentGstNumber = (event) =>
    setAgentGstNumber(event.target.value);

  const submitAgentDocument = async (event) => {
    event.preventDefault();

    // if (!agentName || !agentPhone || !agentEmail) {
    //   alert("Name phone and email are required field");
    //   return;
    // }

    try {
      setIsUploading(true);

      const dataSet = {
        agentName,
        agentCompnayName,
        agentPhone,
        agentEmail,
        agentPancard,
        agentGstNumber,
        country: "India",
        state: state.label,
        city: city.label,
        locality: locality.label,
        society: society.label,
        status: "active",
      };

      console.log("dataSet: ", dataSet)

      // const docRef = await addAgentDoc(dataSet)

      setAgentName("");
      setAgentCompnayName("");
      setAgentPhone("");
      setAgentEmail("");
      setAgentPancard("");
      setAgentGstNumber("");
      setIsUploading(false);
      setShowAIForm(!showAIForm);
    } catch (addingError) {
      console.error("Error adding document:", addingError);
      setIsUploading(false);
      setShowAIForm(!showAIForm);
    }
  };

  // View mode start
  const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns
  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };
  // View mode end

  // nine dots menu start
  const nineDotsMenu = [
    { title: "User List", link: "/userlist", icon: "group" },
  ];
  // nine dots menu end
  return (
    <div>
      <ScrollToTop />
      {user && user.status === "active" ? (
        <div className="top_header_pg pg_bg pg_agent">
          <div className="page_spacing pg_min_height">
            <NineDots nineDotsMenu={nineDotsMenu} />
            {/* {masterCity && masterCity.length !== 0 && ( */}
            <>
              <div className="pg_header d-flex justify-content-between">
                <div className="left">
                  <h2 className="m22">
                    Total Agent:{" "}
                    {agentDoc && (
                      <span className="text_orange">{agentDoc.length}</span>
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
                      <span className="material-symbols-outlined">
                        view_list
                      </span>
                    </div>
                  </div>
                  <div
                    onClick={handleShowAIForm}
                    className={`theme_btn no_icon header_btn ${showAIForm ? "btn_border" : "btn_fill"
                      }`}
                  >
                    {showAIForm ? "Cancel" : "Add New"}
                  </div>
                </div>
              </div>
              <hr></hr>
            </>
            {showAIForm && (
              <>
                <form onSubmit={submitAgentDocument}>
                  <div className="vg12"></div>
                  <div className="row row_gap form_full">
                    <div className="col-xl-4 col-lg-6">
                      <div className="form_field label_top">
                        <label htmlFor="">Name</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            value={agentName}
                            onChange={handleChangeAgentName}
                            placeholder="Enter agent name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="form_field label_top">
                        <label htmlFor="">Phone number</label>
                        <div className="form_field_inner">
                          <PhoneInput
                            country={"in"}
                            value={agentPhone}
                            onChange={handleChangeAgentPhone}
                            international
                            keyboardType="phone-pad"
                            countryCodeEditable={true}
                            placeholder="Country code + mobile number"
                            inputProps={{
                              name: "phone",
                              required: true,
                              autoFocus: false,
                            }}
                            inputStyle={{
                              width: "100%",
                              paddingLeft: "45px",
                              fontSize: "16px",
                              borderRadius: "12px",
                              height: "45px",
                            }}
                            buttonStyle={{
                              borderRadius: "12px",
                              textAlign: "left",
                              border: "1px solid #00A8A8",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="form_field label_top">
                        <label htmlFor="">Email</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            value={agentEmail}
                            onChange={handleChangeAgentEmail}
                            placeholder="Enter agent email"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="form_field label_top">
                        <label htmlFor="">company name</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            value={agentCompnayName}
                            onChange={handleChangeAgentComanayName}
                            placeholder="Enter company name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="form_field label_top">
                        <label htmlFor="">Pancard Number</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            value={agentPancard}
                            onChange={handleChangeAgentPancard}
                            placeholder="Enter pancard number"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="form_field label_top">
                        <label htmlFor="">GST Number</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            value={agentName}
                            onChange={handleChangeAgentGstNumber}
                            placeholder="Enter GST number"
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-xl-4 col-lg-6">
                      <div className="form_field label_top">
                        <label htmlFor="">Country</label>
                        <div className="form_field_inner">
                          <select name="" id="">
                            <option value="">India</option>
                            <option value="">USA</option>
                          </select>
                        </div>
                      </div>
                    </div> */}
                    <div className="col-xl-4 col-lg-6">
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
                    </div>
                    <div className="col-xl-4 col-lg-6">
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
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="form_field label_top">
                        <label htmlFor="">Locality</label>
                        <div className="form_field_inner">
                          <Select
                            className=""
                            onChange={handleLocalityChange}
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
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="form_field label_top">
                        <label htmlFor="">Society</label>
                        <div className="form_field_inner">
                          <Select
                            className=""
                            onChange={handleSocietyChange}
                            options={societyOptions.current}
                            // options={stateList}
                            value={society}
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
                    <div className="col-12">
                      <div className="form_field label_top">
                        <label htmlFor="">Full Address</label>
                        <div className="form_field_inner">
                          <textarea name="" id=""></textarea>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="vg22"></div>

                  {/* {formError && (
                      <>
                        <div className="error">{formError}</div>
                        <div className="vg22"></div>
                      </>
                    )}           */}
                  <div
                    className="d-flex align-items-center justify-content-end"
                    style={{
                      gap: "15px",
                    }}
                  >
                    <div
                      className="theme_btn btn_border no_icon text-center"
                      onClick={handleShowAIForm}
                    >
                      Cancel
                    </div>
                    <button
                      type="submit"
                      className="theme_btn btn_fill no_icon"
                      disabled={isUploading}
                    >
                      {isUploading ? "Adding...." : "Add"}
                    </button>
                  </div>
                </form>
                <hr />
              </>
            )}
            <>
              {agentDoc &&
                agentDoc.map((doc) => (
                  <div
                    className={`pu_single`}
                  >
                    {doc.agentName}
                  </div>
                ))}

            </>
            {/* )} */}

          </div>
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </div>
  );
};

export default PGAgent;
