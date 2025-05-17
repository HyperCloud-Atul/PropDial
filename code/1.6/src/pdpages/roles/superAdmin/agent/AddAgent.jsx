import React from "react";
import { useState, useEffect, useRef } from "react";
import { useCollection } from "../../../../hooks/useCollection";
import { useFirestore } from "../../../../hooks/useFirestore";
import { projectFirestore } from "../../../../firebase/config";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import SearchBarAutoComplete from "../../../../pages/search/SearchBarAutoComplete";
import { useDocument } from "../../../../hooks/useDocument";
import { useNavigate } from "react-router-dom";
import { useCommon } from "../../../../hooks/useCommon";
import { Modal } from "react-bootstrap";
import { BeatLoader } from "react-spinners";

const AddAgent = ({ showAIForm, setShowAIForm, handleShowAIForm, agentID }) => {
  const { camelCase } = useCommon();
  const isReadOnly = agentID !== "new" ? true : false; // Set read-only based on param existence

  // add document
  const {
    addDocument: addAgentDoc,
    updateDocument: updateAgentDoc,
    deleteDocument: deleteAgentDoc,
    error: addingError,
  } = useFirestore("agent-propdial");
  // console.log('agentID', agentID)
  const navigate = useNavigate();

  //Master Data Loading Initialisation - Start
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
  const { documents: masterLocality, error: masterLocalityError } =
    useCollection("m_localities", "", ["locality", "asc"]);
  const { documents: masterSociety, error: masterSocietyError } = useCollection(
    "m_societies",
    "",
    ["society", "asc"]
  );
  const { document: agentDoc, error: agentDocError } = useDocument(
    "agent-propdial",
    agentID
  );
  // console.log(agentDoc, agentDocError)
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [locality, setLocality] = useState();
  const [society, setSociety] = useState();
  const [area, setArea] = useState();
  const [areaFilter, setAreaFilter] = useState([]);
  // const [searchList, setSearchList] = useState(null);
  // all useStates
  const [isUploading, setIsUploading] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentCompnayName, setAgentCompnayName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPancard, setAgentPancard] = useState("");
  const [agentGstNumber, setAgentGstNumber] = useState("");
  const [errors, setErrors] = useState({
    agentPhone: "",
    agentName: "",
    agentEmail: "",
    state: "",
    city: "",
    locality: "",
    society: "",
  });

  const [showModal, setShowModal] = useState(false);

  let stateOptions = useRef([]);
  let cityOptions = useRef([]);
  let localityOptions = useRef([]);
  let societyOptions = useRef([]);
  let areaOptions = useRef([]);

  if (masterState) {
    stateOptions.current = masterState.map((stateData) => ({
      label: stateData.state,
      value: stateData.id,
    }));
  }

  //Master Data Loading Initialisation - End
  useEffect(() => {
    // console.log('in useeffect')
    if (agentDoc && masterState) {
      console.log("agentDoc.state: ", agentDoc.state);
      console.log("masterState: ", masterState);
      let selectedstate =
        masterState && masterState.find((e) => e.state === agentDoc.state);

      console.log("selectedstate: ", selectedstate);

      selectedstate &&
        setState({
          label: agentDoc.state,
          value: selectedstate.id,
        });

      let selectedcity =
        masterCity && masterCity.find((e) => e.city === agentDoc.city);
      selectedcity &&
        setCity({
          label: agentDoc.city,
          value: selectedcity.id,
        });

      agentDoc.locality ? setLocality(agentDoc.locality) : setLocality([]);
      agentDoc.society ? setSociety(agentDoc.society) : setSociety([]);
      agentDoc.area ? setArea(agentDoc.area) : setArea([]);
      agentDoc.agentName
        ? setAgentName(camelCase(agentDoc.agentName))
        : setAgentName("");
      agentDoc.agentCompnayName
        ? setAgentCompnayName(agentDoc.agentCompnayName)
        : setAgentCompnayName("");

      agentDoc.agentPhone
        ? setAgentPhone(agentDoc.agentPhone)
        : setAgentPhone("");
      agentDoc.agentEmail
        ? setAgentEmail(agentDoc.agentEmail)
        : setAgentEmail("");
      agentDoc.agentPancard
        ? setAgentPancard(agentDoc.agentPancard)
        : setAgentPancard("");
      agentDoc.agentGstNumber
        ? setAgentGstNumber(agentDoc.agentGstNumber)
        : setAgentGstNumber("");

      handleStateChange({
        label: agentDoc.state,
        value: selectedstate.id,
      });
      handleCityChange({
        label: agentDoc.city,
        value: selectedcity.id,
      });
    }
  }, [agentDoc, masterState]);

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
              setLocality([]);
              setSociety([]);
              setArea([]);

              handleCityChange(null);
            } else {
              console.log("state else", option, agentDoc);
              if (agentDoc && option.label === agentDoc.state) {
                let selectedcity = masterCity.find(
                  (e) => e.city === agentDoc.city
                );

                setCity({
                  label: agentDoc.city,
                  value: selectedcity.id,
                });
                setLocality(agentDoc.locality);
                setSociety(agentDoc.society);
                setArea(agentDoc.area);

                handleCityChange({
                  label: agentDoc.city,
                  value: selectedcity.id,
                });
              } else {
                setLocality([]);
                setSociety([]);
                setArea([]);

                handleCityChange({
                  label: cityOptions.current[0].label,
                  value: cityOptions.current[0].value,
                });
              }
              setErrors((prev) => ({
                ...prev,
                state: "",
              }));
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
  const handleAreaChange = async (option) => {
    console.log("areaOptions.current", areaOptions.current);
    let list1 = areaOptions.current[0] ? areaOptions.current[0].options : [];
    let list2 = areaOptions.current[1] ? areaOptions.current[1].options : [];
    let list3 = [];
    let selectedSociety = [];
    let selectedLoclity = [];
    setArea(option);
    console.log(option, areaOptions.current, list1, list2);
    option.forEach((element) => {
      console.log(element, element.value);
      let str = element.value && element.value.split("#");
      console.log(str, element.value);
      if (element.value.includes("locality")) {
        selectedLoclity.push({
          label: element.label,
          value: str[0],
        });
        let list4 = list2.filter((e) => e.value.includes(str[0]));
        list4.forEach((element1) => {
          list3.push(element1);
        });
      } else {
        let str = element.value && element.value.split("#");
        let str1 = element.label && element.label.split(";");
        selectedSociety.push({
          label: element.label,
          value: str[0],
        });
        if (
          !selectedLoclity.find(
            (e) => e.label === str1[1] && e.value === str[1]
          )
        ) {
          selectedLoclity.push({
            label: str1[1],
            value: str[1],
          });
        }
      }
    });
    let list4 = [];
    let str = [];
    list3.forEach((element) => {
      str = element.value.split("#");
      list4.push({
        label: element.label,
        value: str[0],
      });
    });
    setLocality(selectedLoclity);
    setSociety(selectedSociety);
    setErrors((prev) => ({
      ...prev,
      area: "",
      locality: "",
      society: "",
    }));
    console.log(list3);
    // let _area = []
    // _area.push({
    //   'label': <span style={{ color: 'red', fontSize: "1.4rem", width: "100%", textDecoration: "underline" }} ><strong>Localities</strong></span>,
    //   'options': list1
    // })
    // _area.push({
    //   'label': <span style={{ color: 'red', fontSize: "1.4rem", width: "100%", textDecoration: "underline" }} ><strong>Socities</strong></span>,
    //   'options': list3
    // })
    // setAreaFilter(_area)
  };

  //City select onchange
  const handleCityChange = async (option) => {
    setCity(option, masterLocality, masterCity);
    console.log("city.id:", option.value);
    let _area = [];
    if (option) {
      let _localitylist = masterLocality.filter((e) => e.city === option.value);
      let _societylist = masterSociety.filter((e) => e.city === option.value);
      let list1 = [];
      _localitylist.forEach((element) => {
        list1.push({
          // ...element,
          label: element.locality,
          value: element.id + "#" + "locality",
          // type: 'locality'
        });
      });
      let list2 = [];

      let _localityList = [];
      _societylist.forEach((element) => {
        let _local = masterLocality.find((e) => e.id === element.locality);
        list2.push({
          // ...element,
          label: element.society + ";" + _local.locality,
          value: element.id + "#" + element.locality + "#" + "society",
          // type: 'society'
        });
      });
      console.log("_area", _area);
      _area.push({
        label: (
          <span
            style={{
              color: "red",
              fontSize: "1.4rem",
              width: "100%",
              textDecoration: "underline",
            }}
          >
            <strong>Localities</strong>
          </span>
        ),
        options: list1,
      });
      _area.push({
        label: (
          <span
            style={{
              color: "red",
              fontSize: "1.4rem",
              width: "100%",
              textDecoration: "underline",
            }}
          >
            <strong>Socities</strong>
          </span>
        ),
        options: list2,
      });
      areaOptions.current = _area;
      console.log(areaOptions.current);
      setAreaFilter(areaOptions.current);
      localityOptions.current = _localitylist.map((localityData) => ({
        label: localityData.locality,
        value: localityData.id,
      }));

      societyOptions.current = _societylist.map((societyData) => ({
        label:
          societyData.society +
          ";" +
          (masterLocality &&
            masterLocality.find((e) => e.id === societyData.locality).locality),
        value: societyData.id,
      }));

      if (localityOptions.current.length === 0) {
        console.log("No Locality");
        // handleLocalityChange(null);
        setLocality([]);
        setSociety([]);
        setArea([]);
      } else {
        console.log("handleCity", agentDoc);
        if (option.label === agentDoc?.city) {
          setLocality(agentDoc.locality);
          setSociety(agentDoc.society);
          setArea(agentDoc.area);
        } else {
          setLocality([]);
          setSociety([]);
          setArea([]);
        }
        setErrors((prev) => ({
          ...prev,
          city: "",
        }));
        // handleLocalityChange({
        //   label: localityOptions.current[0].label,
        //   value: localityOptions.current[0].value,
        // });
      }
    } else {
      // handleLocalityChange(null);
      // setError('No such document exists')
    }
  };

  //Locality select onchange
  const handleLocalityChange = async (option) => {
    // setLocality(option);
    console.log("locality.id:", option);
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
    let _locality = [];

    console.log("society.id:", option);
    option.forEach((element) => {
      // let str = []
      // str = element.label.split('; ')
      let _societyObj = masterSociety.find((e) => e.id === element.value);

      console.log(_societyObj);
      let _localityObj = masterLocality.find(
        (e) => e.id === _societyObj.locality
      );
      console.log("_localityObj", _localityObj);

      if (_locality.find((e) => e.value === _localityObj.id)) {
        console.log("already present");
      } else {
        _locality.push({
          label: _localityObj.locality,
          value: _localityObj.id,
        });
        console.log("not present");
      }
      console.log("_locality", _locality);
      setLocality(_locality);
    });
  };
  // Populate Master Data - End

  // functions
  const handleChangeAgentName = (e) => {
    setAgentName(e.target.value);
  };
  const handleChangeAgentComanayName = (e) => {
    setAgentCompnayName(e.target.value);
  };
  const handleChangeAgentPhone = (value) => {
    console.log("handleChangeAgentPhone", value);
    setAgentPhone(value);
    setErrors((prev) => ({ ...prev, agentPhone: "" }));
  };
  const handleChangeAgentEmail = (e) => {
    setAgentEmail(e.target.value);
    setErrors((prev) => ({ ...prev, agentEmail: "" }));
  };
  const handleChangeAgentPancard = (e) =>
    setAgentPancard(e.target.value.toUpperCase());
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

  const checkIfPhoneExists = async (value) => {
    const numericPhone = value.replace(/\D/g, ""); // remove all non-digits

    if (numericPhone.length >= 8 && numericPhone.length <= 15) {
      try {
        const doc = await projectFirestore
          .collection("agent-propdial")
          .where("agentPhone", "==", numericPhone)
          .get();

        if (!doc.empty) {
          setErrors((prev) => ({
            ...prev,
            agentPhone: "This number is already registered in Propdial",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            agentPhone: "",
          }));
        }
      } catch (error) {
        console.error("Error checking phone:", error);
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        agentPhone: "please enter a valid phone number",
      }));
    }
  };

  // Helper function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formValidation = () => {
    const newErrors = {};

    if (!agentPhone) newErrors.agentPhone = "Phone number is required";
    if (!agentName) newErrors.agentName = "Name is required";
    if (agentEmail !== "" && !isValidEmail(agentEmail))
      newErrors.agentEmail = "Invalid email required";
    if (!state) newErrors.state = "State is required";
    if (!city) newErrors.city = "City is required";
    if (!locality) newErrors.locality = "Locality is required";
    if (!society) newErrors.society = "Society is required";

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };
  const backViewAgents = () => {
    navigate("/agents");
  };

  // Update the submit function to set error messages when fields are empty or invalid
  const submitAgentDocument = async (e) => {
    e.preventDefault();
    if (!formValidation()) {
      return;
    }

    // let isPhoneExists = false;
    // let newErrors;

    try {
      setIsUploading(true);
      //Add new document for agent
      const dataSet = {
        agentName: camelCase(agentName),
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
        area: area,
        status: "active",
      };
      if (agentID === "new") {
        // const ref = await projectFirestore.collection("agent-propdial");
        // .where("agentPhone", "==", agentPhone);

        // console.log("ref: ", ref);

        // ref.onSnapshot(async (snapshot) => {
        // console.log("snapshot.docs", snapshot.docs);
        // if (snapshot.docs.length > 0) {
        //   isPhoneExists = true;
        // } else {
        //   isPhoneExists = false;
        // }
        // console.log("isPhoneExists: ", isPhoneExists);
        // newErrors = {
        //   // ...newErrors,
        //   agentName: !agentName ? "Name is required" : "",
        //   agentPhone:
        //     agentPhone.length < 10
        //       ? "Please enter correct mobile number"
        //       : isPhoneExists
        //       ? "Duplicate mobile no"
        //       : "",
        //   // agentPhone: isPhoneExists ? "Duplicate phone number" : "",
        //   // agentEmail: !agentEmail
        //   //   ? "Email is required"
        //   //   : !isValidEmail(agentEmail)
        //   //     ? "Invalid email format"
        //   //     : "",
        //   state: !state ? "State is required" : "",
        //   city: !city ? "City is required" : "",
        //   locality: !locality ? "Locality is required" : "",
        //   // society: !society ? "Society is required" : "",
        // };
        // setErrors(newErrors);
        // // Check if there are any errors
        // const hasErrors = Object.values(newErrors).some(
        //   (error) => error !== ""
        // );
        // if (hasErrors) return;
        // });
        console.log("add dataSet: ", dataSet);

        await addAgentDoc(dataSet);
      } else {
        //Update Document

        console.log("update dataSet: ", dataSet);
        await updateAgentDoc(agentID, dataSet);
        // backViewAgents();
      }

      // Reset fields and errors after successful submission
      setAgentName("");
      setAgentCompnayName("");
      setAgentPhone("91");
      setAgentEmail("");
      setAgentPancard("");
      setAgentGstNumber("");
      setState("");
      setLocality("");
      setCity("");
      setArea("");
      // setSociety("");
      setErrors({
        agentPhone: "",
        agentName: "",
        agentEmail: "",
        state: "",
        city: "",
        locality: "",
        society: "",
      });

      setShowModal(true);
    } catch (addingError) {
      console.error("Error adding document:", addingError);
      // setShowAIForm(!showAIForm);
    } finally {
      setIsUploading(false);
    }

    // setShowAIForm(!showAIForm);
  };

  return (
    <div className="top_header_pg pg_bg pg_agent">
      {isReadOnly && !agentPhone ? (
        <div className="filter_loading" style={{ height: "80vh" }}>
          <BeatLoader color={"var(--theme-green)"} />
        </div>
      ) : (
        <>
          <div className="page_spacing">
            <div className="pg_header  d-flex justify-content-between">
              <div
                className="left d-flex align-items-center pointer"
                style={{
                  gap: "5px",
                }}
              >
                <span
                  className="material-symbols-outlined pointer"
                  onClick={() => backViewAgents()}
                >
                  arrow_back
                </span>
                <h2 className="m22">
                  {isReadOnly ? "Update Agent" : "Add Agent"}
                </h2>
              </div>
            </div>
            <hr />
            <div className="vg12"></div>
            <form>
              <div className="vg12"></div>

              <div className="row row_gap form_full">
                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Phone number*</label>
                    <div className="form_field_inner">
                      <PhoneInput
                        country={"in"} // Default country is India
                        onlyCountries={["in"]} // Restrict to only India
                        // disableCountryCode={true} // Disable editing of the country code
                        // disableDropdown={true} // Disable the dropdown menu
                        countryCodeEditable={false}
                        disabled={isReadOnly}
                        value={agentPhone}
                        onBlur={() => checkIfPhoneExists(agentPhone)}
                        onChange={handleChangeAgentPhone}
                        // international
                        keyboardType="phone-pad"
                        placeholder="mobile number"
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
                        // style={{ textTransform: "uppercase" }}
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
                        minLength={15}
                        maxLength={15}
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
                      {errors.city && (
                        <div className="field_error">{errors.city}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Area*</label>
                    <div className="form_field_inner">
                      <Select
                        isMulti
                        className=""
                        onChange={(option) => handleAreaChange(option)}
                        options={areaFilter}
                        value={area}
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

                {/* <div className="col-xl-4 col-lg-6">
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
        </div> */}
                {/* <div className="col-xl-4 col-lg-6">
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
        </div> */}
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
                        onClick={backViewAgents}
                      >
                        Cancel
                      </div>
                    </div>
                    <div className="col-8">
                      <button
                        onClick={(e) => {
                          submitAgentDocument(e);
                        }}
                        className="theme_btn btn_fill no_icon text-center"
                        disabled={
                          isUploading || Object.values(errors).some((e) => e)
                        }
                        style={{
                          width: "100%",
                          opacity:
                            isUploading || Object.values(errors).some((e) => e)
                              ? "0.7"
                              : "1",
                          cursor:
                            isUploading || Object.values(errors).some((e) => e)
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {isUploading
                          ? agentID !== "new"
                            ? "Updating..."
                            : "Adding..."
                          : agentID !== "new"
                          ? "Update"
                          : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  {someError && (
                    <div className="field_error text-center mt-3">
                      Please complete all required fields before submitting the
                      form.
                    </div>
                  )}
                </div>
              </div>
              <div className="vg22"></div>
              <div className="vg22"></div>
              <div className="vg22"></div>
              <div className="vg22"></div>
              <div className="vg22"></div>
              <div className="vg22"></div>
              <div className="vg22"></div>
              <div className="vg22"></div>
              <div className="vg22"></div>
              <div className="vg22"></div>
            </form>
          </div>

          <Modal onHide={() => setShowModal(false)} show={showModal} centered>
            <Modal.Header
              closeButton
              style={{
                borderBottom: "none",
              }}
            />

            <Modal.Body>
              <div>
                <h5
                  className="text-center"
                  style={{
                    color: "var(--theme-green2)",
                  }}
                >
                  {agentID !== "new"
                    ? "Agent details have been updated successfully"
                    : "Agent has been added successfully"}
                </h5>
                <button
                  className="theme_btn btn_fill no_icon text-center"
                  style={{ width: "100%", marginTop: "15px" }}
                >
                  Cancel
                </button>
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
};

export default AddAgent;
