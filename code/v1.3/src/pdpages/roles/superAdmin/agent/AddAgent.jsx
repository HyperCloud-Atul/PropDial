import React from "react";
import { useState, useEffect, useRef } from "react";
import { useCollection } from "../../../../hooks/useCollection";
import { useFirestore } from "../../../../hooks/useFirestore";
import { projectFirestore } from "../../../../firebase/config";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import SearchBarAutoComplete from "../../../../pages/search/SearchBarAutoComplete";

const AddAgent = ({ showAIForm, setShowAIForm, handleShowAIForm }) => {
  // add document
  const {
    addDocument: addAgentDoc,
    updateDocument: updateAgentDoc,
    deleteDocument: deleteAgentDoc,
    error: addingError,
  } = useFirestore("agent-propdial");

  //Master Data Loading Initialisation - Start
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

  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [locality, setLocality] = useState();
  const [society, setSociety] = useState();
  // const [searchList, setSearchList] = useState(null);

  let stateOptions = useRef([]);
  let cityOptions = useRef([]);
  let localityOptions = useRef([]);
  let societyOptions = useRef([]);

  if (masterState) {
    stateOptions.current = masterState.map((stateData) => ({
      label: stateData.state,
      value: stateData.id,
    }));
  }

  //Master Data Loading Initialisation - End

  useEffect(() => {
    // console.log('in useeffect')


  }, [masterState]);

  // Populate Master Data - Start
  //State select onchange
  const handleStateChange = async (option) => {
    setState(option);
    if (option) {
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
              console.log("No City");
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
    }
  };

  //City select onchange
  const handleCityChange = async (option) => {
    setCity(option, masterLocality, masterCity);
    console.log('city.id:', option.value)
    if (option) {

      let _localitylist = masterLocality.filter(e => e.city === option.value);
      let _societylist = masterSociety.filter(e => e.city === option.value);

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
  const handleLocalityChange = async (option) => {
    // setLocality(option);
    console.log('locality.id:', option)
    // console.log('selected city:', city)

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
  const submitAgentDocument = async (e) => {
    e.preventDefault();

    const newErrors = {
      agentName: !agentName ? "Name is required" : "",
      agentPhone: !agentPhone ? "Phone number is required" : "",
      // agentEmail: !agentEmail
      //   ? "Email is required"
      //   : !isValidEmail(agentEmail)
      //     ? "Invalid email format"
      //     : "",
      state: !state ? "State is required" : "",
      city: !city ? "City is required" : "",
      locality: !locality ? "Locality is required" : "",
      // society: !society ? "Society is required" : "",
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) return;

    try {
      setIsUploading(true);

      const dataSet = {
        agentName,
        agentCompnayName,
        agentPhone,
        agentEmail,
        agentPancard: agentPancard.toUpperCase(),
        agentGstNumber: agentGstNumber.toUpperCase(),
        country: "India",
        state: state.label,
        city: city.label,
        locality: locality,
        society: society,
        status: "active",
      };

      console.log("dataSet: ", dataSet)

      const docRef = await addAgentDoc(dataSet);

      // Reset fields and errors after successful submission
      setAgentName("");
      setAgentCompnayName("");
      setAgentPhone("");
      setAgentEmail("");
      setAgentPancard("");
      setAgentGstNumber("");
      setState("");
      setLocality("");
      setCity("");
      // setSociety("");
      setErrors({});
      setIsUploading(false);
      setShowAIForm(!showAIForm);
    } catch (addingError) {
      console.error("Error adding document:", addingError);
      setIsUploading(false);
      setShowAIForm(!showAIForm);
    }
  };

  // const { documents: masterState, error: masterStateError } = useCollection(
  //   "m_states", "", ["state", "asc"]
  // );

  // const handleFieldChange = (setter) => (event) => {
  //   const { name, value } = event.target;
  //   setter(value);
  //   setErrors((prevErrors) => {
  //     const newErrors = { ...prevErrors };
  //     if (newErrors[name]) delete newErrors[name];
  //     return newErrors;
  //   });
  // };

  // const [searchInput, setSearchInput] = useState("");
  // const [searchQuery, setSearchQuery] = useState("");



  // const [changedUser, setChangedUser] = useState();
  // const [ownersProeprtyList, setOwnersProeprtyList] = useState();
  // const [searchResultValueId, setSearchResultValueId] = useState("");
  // const [propertyName, setPropertyName] = useState("");
  // const handleChangePropertyName = handleFieldChange(setPropertyName);


  // Search Popup - Start
  // const [searchPopup, setSearchPopup] = useState(false);
  // const [searchResultValue, setSearchResultValue] = useState("");
  // const [filteredData, setFilteredData] = useState(masterSociety);
  // const [selectedValue, setSelectedValue] = useState(null);
  // const handleChangeSearchText = handleFieldChange(setSearchResultValue);
  // Search Popup - End

  // const handleSearchInputChange = (e) => {
  //   console.log("e.target.value: ", e.target.value)
  //   setSearchInput(e.target.value);
  // };
  // useEffect(() => {
  //   let strList = []
  //   masterSociety && masterSociety.forEach(element => {
  //     let _locality = masterLocality.find(e => e.id === element.locality)
  //     let _city = masterCity.find(e => e.id === element.city)

  //     strList.push({
  //       ...element,
  //       localityName: _locality.locality,
  //       cityName: _city.city
  //     })
  //   });
  //   setSearchList(strList)

  // }, [masterSociety])


  // const openSearchPopup = (docId) => {
  //   console.log("Open Search Popup");
  //   setSearchPopup(true);
  //   // setUserdbFieldName(option);
  //   setChangedUser(docId);
  //   setOwnersProeprtyList({ lable: "", value: "" });
  // };

  // const closeSearchPopup = () => {
  //   console.log("close popup")
  //   setSearchPopup(false);
  // };


  // const confirmSearchPopup = async () => {
  //   console.log("selected value: ", selectedValue);

  //   setSearchPopup(false);
  // };

  // const handleSearchChange = (event) => {
  //   const query = event.target.value;
  //   setSearchQuery(query);
  //   filterDataByQuery(query);
  // };

  // const filterDataByQuery = (query) => {
  //   // console.log('query: ', searchList)
  //   const filtered =
  //     searchList &&
  //     searchList.filter(
  //       (society) =>
  //         society.society.toLowerCase().includes(query.toLowerCase())
  //         || society.localityName.toLowerCase().includes(query)
  //         || society.cityName.toLowerCase().includes(query)
  //     );
  //   // console.log("filtered: ", filtered);
  //   setFilteredData(filtered);


  //   // let strList = []
  //   //   masterSociety && masterSociety.forEach(element => {
  //   //     let _locality = masterLocality.find(e => e.id === element.locality)

  //   //     strList.push(element.society + '-' + _locality.locality)
  //   //   });
  //   //   setSearchList(strList)

  // };

  // const handleSearchItem = (val) => {
  //   setSelectedValue(val);
  // };


  return (
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
                onKeyPress={(e) => {
                  const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces allowed
                  if (!regex.test(e.key)) {
                    e.preventDefault(); // Prevent invalid input
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
                onlyCountries={["in"]} // Allow only India
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
                onChange={handleStateChange}
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
                onChange={handleCityChange}
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
                onChange={handleLocalityChange}
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
              <div
                className="theme_btn btn_border no_icon text-center"
                onClick={handleShowAIForm}
              >
                Cancel
              </div>
            </div>
            <div className="col-8">
              <div
                onClick={submitAgentDocument}
                className="theme_btn btn_fill no_icon text-center"
                disabled={isUploading}
              >
                {isUploading ? "Adding...." : "Add"}
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
  );
};

export default AddAgent;
