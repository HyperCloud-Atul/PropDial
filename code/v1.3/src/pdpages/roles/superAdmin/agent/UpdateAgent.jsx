import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useCollection } from "../../../../hooks/useCollection";
import { useFirestore } from "../../../../hooks/useFirestore";
import { projectFirestore } from "../../../../firebase/config";
import { useDocument } from "../../../../hooks/useDocument";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import { timestamp } from "../../../../firebase/config";
import ScrollToTop from "../../../../components/ScrollToTop";
import InactiveUserCard from "../../../../components/InactiveUserCard";

const UpdateAgent = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const {
    // addDocument: addAgentDoc,
    updateDocument: updateAgentDoc,
    // deleteDocument: deleteAgentDoc,
    error: addingError,
  } = useFirestore("agent-propdial");

  const navigate = useNavigate();
  const { documents: masterState, error: masterStateError } = useCollection(
    "m_states",
    "",
    ["state", "asc"]
  );
  const { documents: masterCity, error: masterCityError } = useCollection(
    "m_cities", "", ["city", "asc"]
  );
  const { documents: masterLocality, error: masterLocalityError } = useCollection(
    "m_localities", "", ["locality", "asc"]
  );
  const { documents: masterSociety, error: masterSocietyError } =
    useCollection("m_societies", "", ["society", "asc"]);

  const { updateDocument, error: updateAgentDocError } =
    useFirestore("agent-propdial");

  const { document: agentDoc, error: agentDocError } = useDocument(
    "agent-propdial",
    id
  );
  // console.log("agentDoc: ", agentDoc)

  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [locality, setLocality] = useState();
  const [society, setSociety] = useState();

  let stateOptions = useRef([]);
  let cityOptions = useRef([]);
  let localityOptions = useRef([]);
  let societyOptions = useRef([]);

  // const [searchList, setSearchList] = useState(null);
  useEffect(() => {
    if (agentDoc) {
      // console.log("agentDoc: ", agentDoc)

      setAgentName(agentDoc.agentName || "");
      setAgentCompnayName(agentDoc.agentCompnayName || "");
      setAgentPhone(agentDoc.agentPhone || "");
      setAgentEmail(agentDoc.agentEmail || "");
      setAgentPancard(agentDoc.agentPancard || "");
      setAgentGstNumber(agentDoc.agentGstNumber || "");
      let _state = masterState.find(e => e.state === agentDoc.state)
      setState({
        label: _state.state || "",
        value: _state.id || ""
      });
      // console.log(_state)

      let _city = masterCity.find(e => e.city === agentDoc.city && e.state === _state.id)
      // console.log(_city)
      setCity({
        label: _city.city || "",
        value: _city.id || ""
      });
      setLocality(agentDoc.locality

      );
      setSociety(agentDoc.society);



      handleStateChange({
        label: _state.state || "",
        value: _state.id || ""
      }, {
        label: _city.city || "",
        value: _city.id || ""
      }, agentDoc.locality, agentDoc.society

      )


      handleCityChange({
        label: _city.city || "",
        value: _city.id || ""
      }, agentDoc.locality,
        agentDoc.society
      )


      // handleLocalityChange(agentDoc.locality)

    }
  }, [agentDoc]);

  //Master Data Loading Initialisation - Start



  // if (masterState) {
  //   stateOptions.current = masterState.map((stateData) => ({
  //     label: stateData.state,
  //     value: stateData.id,
  //   }));
  // }

  //Master Data Loading Initialisation - End

  useEffect(() => {
    // console.log('in useeffect')
    // Master data: State Populate
    if (masterState) {
      stateOptions.current = masterState.map((stateData) => ({
        label: stateData.state,
        value: stateData.id,
      }));
    }
  }, [masterState]);

  // Populate Master Data - Start
  //State select onchange
  // const handleStateChange = async (option) => {
  const handleStateChange = async (option, selectedCity, selectedLocality, selectedSociety) => {
    setState(option);

    if (option.label === agentDoc.state) {
      setLocality(agentDoc.locality);
      setSociety(agentDoc.society);
      let cityList = masterCity.filter(e => e.state === option.value)
      cityOptions.current = cityList && cityList.map((cityData) => ({
        label: cityData.city,
        value: cityData.id,
      }));
      let _city = masterCity.find(e => e.city === agentDoc.city && e.state === option.value)
      // console.log(_city)
      setCity({
        label: _city.city || "",
        value: _city.id || ""
      });
      handleCityChange({
        label: _city.city || "",
        value: _city.id || ""
      }, agentDoc.locality, agentDoc.society);
    } else {
      if (option) {
        console.log('state.id:', option, city)
        let cityList = masterCity.filter(e => e.state === option.value)
        cityOptions.current = cityList && cityList.map((cityData) => ({
          label: cityData.city,
          value: cityData.id,
        }));
        console.log('cityList', cityList, selectedCity)
        if (cityList && selectedCity && cityList.find(e => e.id === selectedCity.value)) {

        } else {
          console.log('cityList', cityList[0])
          setLocality([]);
          setSociety([])
          setCity({
            label: cityList[0].city,
            value: cityList[0].id
          })
          handleCityChange({
            label: cityList[0].city,
            value: cityList[0].id
          }, selectedLocality, selectedSociety);
        }

        // if (cityOptions.current.length === 0) {
        //   console.log("No City");
        //   handleCityChange(null);
        // } else {
        //   // handleCityChange({
        //   //   label: cityOptions.current[0].label,
        //   //   value: cityOptions.current[0].value,
        //   // });
        //   console.log('before handleCityChange', city)
        //   handleCityChange(city);
        // }
      }

    }

  };

  //City select onchange
  // const handleCityChange = async (option) => {
  const handleCityChange = async (option, selectedLocality, selectedSociety) => {
    setCity(option);
    let _selectedlocalty = selectedLocality;
    let _selectedSociety = selectedSociety;
    // console.log('city.id:', option)

    // console.log('city.id:', option, masterLocality, masterCity, selectedLocality, selectedSociety)
    if (option) {

      let _localitylist = masterLocality.filter(e => e.city === option.value);
      let _societylist = masterSociety.filter(e => e.city === option.value);
      // console.log('_localitylist', _localitylist)
      // console.log('_societylist', _societylist)
      if (selectedSociety && selectedSociety[0] && _societylist.find(e => e.id === selectedSociety[0].value)) {

      } else {
        _selectedlocalty = [];
        _selectedSociety = [];
        setLocality([]);
        setSociety([]);
      }
      if (option.label === agentDoc.city) {
        setLocality(agentDoc.locality);
        setSociety(agentDoc.society);
      }
      localityOptions.current = _localitylist.map((localityData) => ({
        label: localityData.locality,
        value: localityData.id,
      }));

      societyOptions.current = _societylist.map((societyData) => ({
        label: societyData.society + "; " + (masterLocality && masterLocality.find((e) => e.id === societyData.locality).locality),
        value: societyData.id,
      }));

      if (localityOptions.current.length === 0) {
        console.log("No Locality");
        // handleLocalityChange(null);
      } else {
        // handleLocalityChange({
        //   label: localityOptions.current[0].label,
        //   value: localityOptions.current[0].value,
        // });
      }
    } else {
      // handleLocalityChange(null);
      // setError('No such document exists')
    }
  }


  //Locality select onchange
  // const handleLocalityChange = async (option) => {
  //   // setLocality(option);
  //   console.log('locality.id:', option)
  //   // console.log('selected city:', city)

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
  const handleSocietyChange = async (option) => {
    setSociety(option);
    // option
    let _locality = []

    console.log('society.id:', option)
    option.forEach(element => {
      // let str = []
      // str = element.label.split('; ')
      let _societyObj = masterSociety.find(e => e.id === element.value)

      console.log(_societyObj)
      let _localityObj = masterLocality.find(e => e.id === _societyObj.locality)
      console.log('_localityObj', _localityObj)

      if (_locality.find(e => e.value === _localityObj.id)) {

        console.log('already present')
      } else {
        _locality.push({
          label: _localityObj.locality,
          value: _localityObj.id
        })
        console.log('not present')
      }
      console.log('_locality', _locality)
      setLocality(_locality)
    });
  };
  // Populate Master Data - End

  // all useStates
  const [isUploading, setIsUploading] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentCompnayName, setAgentCompnayName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPancard, setAgentPancard] = useState("");
  const [agentGstNumber, setAgentGstNumber] = useState("");
  const [errors, setErrors] = useState({});

  // functions
  const handleChangeAgentName = (e) => setAgentName(e.target.value);
  const handleChangeAgentComanayName = (e) =>
    setAgentCompnayName(e.target.value);
  const handleChangeAgentPhone = (value) => setAgentPhone(value);
  const handleChangeAgentEmail = (e) => setAgentEmail(e.target.value);
  const handleChangeAgentPancard = (e) => setAgentPancard(e.target.value);
  const handleChangeAgentGstNumber = (e) => setAgentGstNumber(e.target.value);

  // Add additional state variables for tracking errors
  // const [errors, setErrors] = useState({
  //   agentName: "",
  //   agentPhone: "",
  //   // agentEmail: "",
  //   state: "",
  //   city: "",
  //   locality: "",
  //   society: "",
  // });

  const someError = errors.agentName || errors.agentEmail;

  // Helper function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Update the submit function to set error messages when fields are empty or invalid
  // const submitUpdatedAgent = async (e) => {
  //   e.preventDefault();

  //   const newErrors = {
  //     agentName: !agentName ? "Name is required" : "",
  //     agentPhone: !agentPhone ? "Phone number is required" : "",
  //     // agentEmail: !agentEmail
  //     //   ? "Email is required"
  //     //   : !isValidEmail(agentEmail)
  //     //     ? "Invalid email format"
  //     //     : "",
  //     state: !state ? "State is required" : "",
  //     city: !city ? "City is required" : "",
  //     locality: !locality ? "Locality is required" : "",
  //     // society: !society ? "Society is required" : "",
  //   };

  //   setErrors(newErrors);

  //   // Check if there are any errors
  //   const hasErrors = Object.values(newErrors).some((error) => error !== "");
  //   if (hasErrors) return;

  //   try {
  //     setIsUploading(true);

  //     const dataSet = {
  //       agentName,
  //       agentCompnayName,
  //       agentPhone,
  //       agentEmail,
  //       agentPancard: agentPancard.toUpperCase(),
  //       agentGstNumber: agentGstNumber.toUpperCase(),
  //       country: "India",
  //       state: state.label,
  //       city: city.label,
  //       locality: locality,
  //       society: society,
  //       status: "active",
  //     };

  //     console.log("dataSet: ", dataSet)

  //     const docRef = await addAgentDoc(dataSet);

  //     // Reset fields and errors after successful submission
  //     setAgentName("");
  //     setAgentCompnayName("");
  //     setAgentPhone("");
  //     setAgentEmail("");
  //     setAgentPancard("");
  //     setAgentGstNumber("");
  //     setState("");
  //     setLocality("");
  //     setCity("");
  //     // setSociety("");
  //     setErrors({});
  //     setIsUploading(false);
  //     setShowAIForm(!showAIForm);
  //   } catch (addingError) {
  //     console.error("Error adding document:", addingError);
  //     setIsUploading(false);
  //     setShowAIForm(!showAIForm);
  //   }
  // };

  const submitUpdatedAgent = async () => {
    try {
      setIsUploading(true);

      // Log data before update
      const updatedAgentDoc = {
        agentName,
        agentCompnayName,
        agentPhone,
        agentEmail,
        agentPancard: agentPancard.toUpperCase(),
        agentGstNumber: agentGstNumber.toUpperCase(),
        country: "India",
        state: state?.label || "",
        city: city?.label || "",
        locality: locality,
        society: society,
        status: "active",
        updatedAt: timestamp.fromDate(new Date()),
        updatedBy: user.uid,
      };
      // console.log('updatedAgentDoc', updatedAgentDoc, id)
      // Execute updateDocument
      const result = await updateDocument(id, updatedAgentDoc);
      console.log("Document update result:", result); // Check if update was successful

      setIsUploading(false);

      // Navigate if successful
      if (!updateAgentDocError) {
        navigate("/agents");
      }
    } catch (error) {
      console.error("Error updating document:", error);
      setIsUploading(false);
    }
  };

  const backViewAgents = () => {
    navigate("/agents");
  };
  return (
    <div>
    <ScrollToTop />
    {user && user.status === "active" ? (
      <div className="top_header_pg pg_bg pg_agent">
        <div className="page_spacing pg_min_height">
        <div className="pg_header d-flex justify-content-between">
                  <div
                    className="left d-flex align-items-center pointer"
                    style={{
                      gap: "5px",
                    }}
                  >
                    <span
                      className="material-symbols-outlined pointer"
                      onClick={backViewAgents}
                    >
                      arrow_back
                    </span>
                    <h2 className="m22">Update Agent</h2>
                  </div>
                </div>
                <hr />
        <form>
        <div className="vg12"></div>

        {/* Search Popup - Start */}
        {/* <div
        className={
          searchPopup
            ? "pop-up-change-number-div open"
            : "pop-up-change-number-div"
        }
      >
        <div className="direct-div">
          <span
            onClick={closeSearchPopup}
            className="material-symbols-outlined modal_close"
          >
            close
          </span>
          <h5 className="text_orange text-center">Search Society</h5>
          <div className="vg12"></div>
          <div>
            <div className="enq_fields">
              <div className="form_field st-2">
                <div className="field_inner">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search society by society name, location or city ..."
                  />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                </div>
              </div>
            </div>
           
            <ul className="search_results">
              {filteredData &&
                filteredData.map((item) => (
                  <li className="search_result_single" key={item.id}>
                    <label>
                      <input
                        name="searchInput"
                        type="radio"
                        checked={selectedValue === item.id}
                        onChange={() => handleSearchItem(item.id)}
                      />
                      <div>
                        <strong> {item.society} </strong>
                        <br></br>
                        {masterLocality && masterLocality.find((e) => e.id === item.locality).locality}
                        {", "}
                        {masterCity && masterCity.find((e) => e.id === item.city).city}
                        {", "}
                        {masterState && masterState.find((e) => e.id === item.state).state}
                       
                      </div>
                    </label>
                  </li>
                ))}
            </ul>
          </div>
          <div className="vg12"></div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: "15px",
            }}
          >
            <button
              onClick={closeSearchPopup}
              className="theme_btn full_width btn_border no_icon"
            >
              Cancel
            </button>
            <button
              onClick={confirmSearchPopup}
              className="theme_btn full_width btn_fill no_icon"
            >
              Confirm
            </button>
          </div>
        </div>
      </div> */}
        {/* Search Popup - End */}

        <div className="row row_gap form_full">
          <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label htmlFor="">Name*</label>
              <div className="form_field_inner">
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => {
                    handleChangeAgentName(e);
                    if (e.target.value) {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        agentName: "",
                      }));
                    }
                  }}
                  placeholder="Enter agent name"
                />
                {errors.agentName && (
                  <div className="field_error">{errors.agentName}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label htmlFor="">Phone number*</label>
              <div className="form_field_inner">
                <PhoneInput
                  country={"in"}
                  value={agentPhone}
                  // onChange={(e) => {
                  //   handleChangeAgentPhone(e);
                  //   if (e.target.value) {
                  //     setErrors((prevErrors) => ({
                  //       ...prevErrors,
                  //       agentPhone: "",
                  //     }));
                  //   }
                  // }}
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
                {errors.agentPhone && (
                  <div className="field_error">{errors.agentPhone}</div>
                )}
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
                  onChange={(e) => {
                    handleChangeAgentEmail(e);
                    if (e.target.value) {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        agentEmail: "",
                      }));
                    }
                  }}
                  placeholder="Enter agent email"
                />
                {errors.agentEmail && (
                  <div className="field_error">{errors.agentEmail}</div>
                )}
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
                  maxLength={10} // Set maximum length
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
                  value={agentGstNumber}
                  onChange={handleChangeAgentGstNumber}
                  placeholder="Enter GST number"
                />
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label htmlFor="">State*</label>
              <div className="form_field_inner">
                <Select
                  className=""
                  // onChange={(e) => {
                  //   handleStateChange(e);
                  //   if (e.target.value) {
                  //     setErrors((prevErrors) => ({
                  //       ...prevErrors,
                  //       state: "",
                  //     }));
                  //   }
                  // }}
                  onChange={(e) => {
                    handleStateChange({
                      label: e.label,
                      value: e.value,
                    }, city, locality, society
                    )
                  }}
                  options={stateOptions.current}
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
                {errors.state && (
                  <div className="field_error">{errors.state}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label htmlFor="">City*</label>
              <div className="form_field_inner">
                <Select
                  className=""
                  onChange={(e) => {
                    handleCityChange({
                      label: e.label,
                      value: e.value
                    }, locality, society

                    )
                  }}
                  options={cityOptions.current}
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
                {errors.city && <div className="field_error">{errors.city}</div>}
              </div>
            </div>
          </div>


          <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label htmlFor="">Society*</label>
              <div className="form_field_inner">
                <Select
                  isMulti
                  className=""
                  onChange={handleSocietyChange}
                  options={societyOptions.current}
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
                {errors.society && (
                  <div className="field_error">{errors.society}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label htmlFor="">Locality*</label>
              <div className="form_field_inner">
                <Select
                  isDisabled
                  isMulti
                  className=""
                  // onChange={handleLocalityChange}
                  options={localityOptions.current}
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
                {errors.locality && (
                  <div className="field_error">{errors.locality}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            {/* Search Input - Start */}
            {/* <div className="form_field label_top">
            <label htmlFor="searchinputfield">Search Society</label>
            <div
              className="form_field_inner with_icon pointer"
              onClick={(e) => {
                openSearchPopup(e);
              }}
              style={{
                cursor: "pointer"
              }}
            >
              <input
                type="text"
                placeholder="Search Society..."
                value={searchResultValue}
                onChange={handleChangeSearchText}
                id="searchinputfield"
                readOnly
                style={{
                  cursor: "pointer",
                }}
              />
              <div className="field_icon">
                <span className="material-symbols-outlined">search</span>
              </div>
            </div>
            {errors.society && (
              <div className="field_error">{errors.society}</div>
            )}
          </div> */}
            {/* Search Input - End */}
          </div>
        </div>

        <div className="vg22"></div>
        {addingError && (
          <>
            <div className="field_error">{addingError}</div>
            <div className="vg22"></div>
          </>
        )}
        <div className="row">
          <div className="col-md-6"></div>
          <div className="col-md-6 col-12">
            <div className="row">
              <div className="col-4">
                <div className="theme_btn btn_border no_icon text-center w-100"
                onClick={backViewAgents}
                >                
                  Cancel
                </div>
              </div>
              <div className="col-8">
                <div
                  onClick={submitUpdatedAgent}
                  className="theme_btn btn_fill no_icon text-center"
                  disabled={isUploading}
                >
                  {isUploading ? "Updating...." : "Update"}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            {someError && (
              <div className="field_error text-center mt-3">
                Please complete all required fields before submitting the form.
              </div>
            )}
          </div>
        </div>
      </form>
        </div>
      </div>
    ) : (
      <InactiveUserCard />
    )}
  </div>  
  );
};

export default UpdateAgent;
