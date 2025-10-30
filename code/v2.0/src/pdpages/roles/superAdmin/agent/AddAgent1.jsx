import React from "react";
import { useState, useEffect, useRef } from "react";
import { useCollection } from "../../../../hooks/useCollection";
import { useFirestore } from "../../../../hooks/useFirestore";
import { projectFirestore } from "../../../../firebase/config";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import { useDocument } from "../../../../hooks/useDocument";
import { useNavigate } from "react-router-dom";
import { useCommon } from "../../../../hooks/useCommon";
import { Button, Modal } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { format } from "date-fns";

const AddAgent = ({ showAIForm, setShowAIForm, handleShowAIForm, agentID }) => {
  const { camelCase } = useCommon();
  const { user } = useAuthContext();
  const isReadOnly = agentID !== "new" ? true : false;

  // add document
  const {
    addDocument: addAgentDoc,
    updateDocument: updateAgentDoc,
    deleteDocument: deleteAgentDoc,
    error: addingError,
  } = useFirestore("agent-propdial");

  const { documents: dbUsers, error: dbuserserror } = useCollection("users-propdial");
  const navigate = useNavigate();

  //Master Data Loading Initialisation - Start
  const { documents: masterState, error: masterStateError } = useCollection("m_states", "", ["state", "asc"]);
  const { documents: masterCity, error: masterCityError } = useCollection("m_cities", "", ["city", "asc"]);
  const { documents: masterLocality, error: masterLocalityError } = useCollection("m_localities", "", ["locality", "asc"]);
  const { documents: masterSociety, error: masterSocietyError } = useCollection("m_societies", "", ["society", "asc"]);
  const { document: agentDoc, error: agentDocError } = useDocument("agent-propdial", agentID);

  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [locality, setLocality] = useState([]);
  const [society, setSociety] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentCompnayName, setAgentCompnayName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPancard, setAgentPancard] = useState("");
  const [agentGstNumber, setAgentGstNumber] = useState("");
  const [status, setStatus] = useState("active");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [reason, setReason] = useState("");
  const [remark, setRemark] = useState("");
  const [errorForNoSelectReasonMessage, setErrorForNoSelectReasonMessage] = useState("");
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const [errors, setErrors] = useState({
    agentPhone: "",
    agentName: "",
    agentEmail: "",
    state: "",
    city: "",
  });

  const [showModal, setShowModal] = useState(false);

  // Options for dropdowns
  const [cityOptions, setCityOptions] = useState([]);
  const [localityOptions, setLocalityOptions] = useState([]);
  const [societyOptions, setSocietyOptions] = useState([]);

  let stateOptions = useRef([]);

  if (masterState) {
    stateOptions.current = masterState.map((stateData) => ({
      label: stateData.state,
      value: stateData.id,
    }));
  }

  // Custom formatOptionLabel for check icons
  const formatOptionLabelWithCheck = ({ label, value }, { isSelected }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {isSelected && (
        <span 
          className="material-symbols-outlined" 
          style={{ 
            fontSize: '18px', 
            marginRight: '8px', 
            color: 'var(--theme-green)',
            fontWeight: 'bold'
          }}
        >
          check
        </span>
      )}
      {label}
    </div>
  );

  //Master Data Loading Initialisation - End
  useEffect(() => {
    if (agentDoc && masterState) {
      console.log("agentDoc.state: ", agentDoc.state);
      let selectedstate = masterState && masterState.find((e) => e.state === agentDoc.state);

      selectedstate && setState({
        label: agentDoc.state,
        value: selectedstate.id,
      });

      let selectedcity = masterCity && masterCity.find((e) => e.city === agentDoc.city);
      selectedcity && setCity({
        label: agentDoc.city,
        value: selectedcity.id,
      });

      agentDoc.locality ? setLocality(agentDoc.locality) : setLocality([]);
      agentDoc.society ? setSociety(agentDoc.society) : setSociety([]);
      agentDoc.agentName ? setAgentName(camelCase(agentDoc.agentName)) : setAgentName("");
      agentDoc.agentCompnayName ? setAgentCompnayName(agentDoc.agentCompnayName) : setAgentCompnayName("");
      agentDoc.agentPhone ? setAgentPhone(agentDoc.agentPhone) : setAgentPhone("");
      agentDoc.agentEmail ? setAgentEmail(agentDoc.agentEmail) : setAgentEmail("");
      agentDoc.agentPancard ? setAgentPancard(agentDoc.agentPancard) : setAgentPancard("");
      agentDoc.agentGstNumber ? setAgentGstNumber(agentDoc.agentGstNumber) : setAgentGstNumber("");
      agentDoc.status ? setStatus(agentDoc.status) : setStatus("active");

      // Load cities for the state
      if (selectedstate) {
        handleStateChange({
          label: agentDoc.state,
          value: selectedstate.id,
        });
      }

      // Load localities and societies for the city
      if (selectedcity) {
        handleCityChange({
          label: agentDoc.city,
          value: selectedcity.id,
        });
      }
    }
  }, [agentDoc, masterState]);

  // Mobile number validation and duplicate check - ONLY FOR NEW AGENTS
  const checkMobileNumber = async (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    if (cleanNumber.startsWith('91') && cleanNumber.length === 12) {
      const actualNumber = cleanNumber.substring(2);

      if (actualNumber.length === 10) {
        setIsCheckingDuplicate(true);
        try {
          let query = projectFirestore
            .collection("agent-propdial")
            .where("agentPhone", "==", cleanNumber);

          const snapshot = await query.get();

          if (!snapshot.empty) {
            // In update mode, we don't check duplicates for the same agent
            if (agentID !== "new") {
              const isCurrentAgent = snapshot.docs.some(doc => doc.id === agentID);
              if (!isCurrentAgent) {
                setShowDuplicateModal(true);
                setErrors(prev => ({ ...prev, agentPhone: "This mobile number is already registered" }));
                setIsFormDisabled(true);
              } else {
                setErrors(prev => ({ ...prev, agentPhone: "" }));
                setIsFormDisabled(false);
              }
            } else {
              // Only disable form for NEW agents with duplicate numbers
              setShowDuplicateModal(true);
              setErrors(prev => ({ ...prev, agentPhone: "This mobile number is already registered" }));
              setIsFormDisabled(true);
            }
          } else {
            setErrors(prev => ({ ...prev, agentPhone: "" }));
            setIsFormDisabled(false);
          }
        } catch (error) {
          console.error("Error checking mobile number:", error);
          setErrors(prev => ({ ...prev, agentPhone: "Error checking mobile number" }));
          setIsFormDisabled(false);
        } finally {
          setIsCheckingDuplicate(false);
        }
      } else {
        setErrors(prev => ({
          ...prev,
          agentPhone: "Mobile number must be exactly 10 digits after +91"
        }));
        setIsFormDisabled(false);
      }
    } else if (cleanNumber.length > 0 && (!cleanNumber.startsWith('91') || cleanNumber.length !== 12)) {
      setErrors(prev => ({
        ...prev,
        agentPhone: "Please enter a valid 10-digit mobile number with +91 country code"
      }));
      setIsFormDisabled(false);
    } else {
      setErrors(prev => ({ ...prev, agentPhone: "" }));
      setIsFormDisabled(false);
    }
  };

  // Handle phone input change with validation
  const handleChangeAgentPhone = (value) => {
    console.log("handleChangeAgentPhone", value);
    setAgentPhone(value);

    // Only check for duplicates if we're adding a new agent (not updating)
    if (agentID === "new") {
      const cleanNumber = value.replace(/\D/g, '');
      if (cleanNumber.startsWith('91') && cleanNumber.length === 12) {
        checkMobileNumber(value);
      } else {
        setErrors(prev => ({ ...prev, agentPhone: "" }));
        setIsFormDisabled(false);
      }
    }
  };

  // Populate Master Data - Start
  const handleStateChange = async (option) => {
    setState(option);
    setCity(null); // Reset city when state changes
    setLocality([]); // Reset locality
    setSociety([]); // Reset society

    if (option) {
      try {
        const citiesSnapshot = await projectFirestore
          .collection("m_cities")
          .where("state", "==", option.value)
          .orderBy("city", "asc")
          .get();

        if (!citiesSnapshot.empty) {
          const cities = citiesSnapshot.docs.map((cityData) => ({
            label: cityData.data().city,
            value: cityData.id,
          }));
          setCityOptions(cities);
          setErrors((prev) => ({
            ...prev,
            state: "",
          }));
        } else {
          setCityOptions([]);
          console.log("No cities found for this state");
        }
      } catch (err) {
        console.log(err.message);
      }
    } else {
      setCityOptions([]);
      setLocalityOptions([]);
      setSocietyOptions([]);
    }
  };

  const handleCityChange = async (option) => {
    setCity(option);
    setLocality([]); // Reset locality when city changes
    setSociety([]); // Reset society when city changes

    if (option) {
      try {
        // Get all localities for the selected city
        const localitiesSnapshot = await projectFirestore
          .collection("m_localities")
          .where("city", "==", option.value)
          .orderBy("locality", "asc")
          .get();

        if (!localitiesSnapshot.empty) {
          const localities = localitiesSnapshot.docs.map((localityData) => ({
            label: localityData.data().locality,
            value: localityData.id,
          }));
          setLocalityOptions(localities);
          setSocietyOptions([]); // Reset societies until localities are selected
          setErrors((prev) => ({
            ...prev,
            city: "",
          }));
        } else {
          setLocalityOptions([]);
          setSocietyOptions([]);
          console.log("No localities found for this city");
        }
      } catch (err) {
        console.log(err.message);
      }
    } else {
      setLocalityOptions([]);
      setSocietyOptions([]);
    }
  };

  const handleLocalityChange = async (selectedOptions) => {
    setLocality(selectedOptions || []);
    setSociety([]); // Reset society when localities change

    if (selectedOptions && selectedOptions.length > 0) {
      try {
        const localityIds = selectedOptions.map(option => option.value);

        // Get all societies for the selected localities
        const societiesSnapshot = await projectFirestore
          .collection("m_societies")
          .where("locality", "in", localityIds)
          .orderBy("society", "asc")
          .get();

        if (!societiesSnapshot.empty) {
          const societies = societiesSnapshot.docs.map((societyData) => {
            const society = societyData.data();
            // Find the locality name for this society
            const localityObj = selectedOptions.find(loc => loc.value === society.locality);
            const localityName = localityObj ? localityObj.label : "";

            return {
              label: `${society.society}, ${localityName}`,
              value: societyData.id,
              localityId: society.locality
            };
          });
          setSocietyOptions(societies);
        } else {
          setSocietyOptions([]);
          console.log("No societies found for selected localities");
        }
      } catch (err) {
        console.log(err.message);
        // If "in" query fails (too many localities), we'll get societies one by one
        if (err.code === 'invalid-argument') {
          const allSocieties = [];
          const selectedOptionsArray = selectedOptions || [];

          for (const localityOption of selectedOptionsArray) {
            try {
              const societiesSnapshot = await projectFirestore
                .collection("m_societies")
                .where("locality", "==", localityOption.value)
                .orderBy("society", "asc")
                .get();

              societiesSnapshot.docs.forEach((societyData) => {
                const society = societyData.data();
                allSocieties.push({
                  label: `${society.society}, ${localityOption.label}`,
                  value: societyData.id,
                  localityId: society.locality
                });
              });
            } catch (innerErr) {
              console.log(`Error fetching societies for locality ${localityOption.value}:`, innerErr.message);
            }
          }

          setSocietyOptions(allSocieties);
        }
      }
    } else {
      setSocietyOptions([]);
    }
  };

  const handleSocietyChange = async (selectedOptions) => {
    setSociety(selectedOptions || []);
  };

  // functions
  const handleChangeAgentName = (e) => {
    setAgentName(e.target.value);
  };
  const handleChangeAgentComanayName = (e) => {
    setAgentCompnayName(e.target.value);
  };
  const handleChangeAgentEmail = (e) => {
    setAgentEmail(e.target.value);
    setErrors((prev) => ({ ...prev, agentEmail: "" }));
  };
  const handleChangeAgentPancard = (e) => setAgentPancard(e.target.value.toUpperCase());
  const handleChangeAgentGstNumber = (e) => setAgentGstNumber(e.target.value);

  const someError = errors.agentName || errors.agentEmail;

  // Helper function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formValidation = () => {
    const newErrors = {};

    // Mobile number validation
    const cleanNumber = agentPhone.replace(/\D/g, '');
    if (!agentPhone) {
      newErrors.agentPhone = "Phone number is required";
    } else if (!cleanNumber.startsWith('91') || cleanNumber.length !== 12) {
      newErrors.agentPhone = "Please enter a valid 10-digit mobile number with +91 country code";
    }

    if (!agentName) newErrors.agentName = "Name is required";
    if (agentEmail !== "" && !isValidEmail(agentEmail)) newErrors.agentEmail = "Invalid email format";
    if (!state) newErrors.state = "State is required";
    if (!city) newErrors.city = "City is required";

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const backViewAgents = () => {
    navigate("/agents");
  };

  const submitAgentDocument = async (e) => {
    e.preventDefault();

    // Only check for duplicate mobile number when adding new agent
    if (agentID === "new") {
      const cleanNumber = agentPhone.replace(/\D/g, '');
      if (cleanNumber.startsWith('91') && cleanNumber.length === 12) {
        await checkMobileNumber(agentPhone);

        if (showDuplicateModal) {
          return;
        }
      }
    }

    if (!formValidation()) {
      return;
    }

    try {
      setIsUploading(true);
      let dataSet = {
        agentName: camelCase(agentName),
        agentCompnayName,
        agentPhone: agentPhone.replace(/\D/g, ''),
        agentEmail,
        agentPancard: agentPancard.toUpperCase(),
        agentGstNumber: agentGstNumber.toUpperCase(),
        country: "India",
        state: state.label,
        city: city.label,
        locality: locality,
        society: society,
        status,
      };

      if (agentID === "new") {
        console.log("Adding new agent:", dataSet);
        await addAgentDoc(dataSet);
        // Reset form after successful add
        setAgentName("");
        setAgentCompnayName("");
        setAgentPhone("91");
        setAgentEmail("");
        setAgentPancard("");
        setAgentGstNumber("");
        setState(null);
        setCity(null);
        setLocality([]);
        setSociety([]);
        setIsFormDisabled(false);
      } else {
        const currentDate = new Date();
        dataSet = {
          ...dataSet,
          activeBy: status === "active" ? user.phoneNumber : null,
          activeAt: status === "active" ? currentDate : null,
          inactiveBy: status === "banned" && user.phoneNumber,
          inactiveAt: status === "banned" && currentDate,
          inactiveReason: status === "banned" && reason,
          inactiveRemark: status === "banned" && remark,
        };
        console.log("Updating agent:", dataSet);
        await updateAgentDoc(agentID, dataSet);
      }

      setErrors({
        agentPhone: "",
        agentName: "",
        agentEmail: "",
        state: "",
        city: "",
      });

      setShowModal(true);
    } catch (addingError) {
      console.error("Error saving document:", addingError);
    } finally {
      setIsUploading(false);
    }
  };

  // Check if form should be disabled (only for new agent when duplicate mobile exists)
  const shouldDisableForm = agentID === "new" && isFormDisabled;

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
              <div className="left d-flex align-items-center pointer" style={{ gap: "5px" }}>
                <span className="material-symbols-outlined pointer" onClick={() => backViewAgents()}>
                  arrow_back
                </span>
                <h2 className="m22">{isReadOnly ? "Update Agent" : "Add Agent"}</h2>
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
                        country={"in"}
                        onlyCountries={["in"]}
                        countryCodeEditable={false}
                        disabled={isReadOnly || shouldDisableForm}
                        value={agentPhone}
                        onChange={handleChangeAgentPhone}
                        keyboardType="phone-pad"
                        placeholder="mobile number"
                        inputProps={{
                          name: "phone",
                          required: true,
                          autoFocus: false,
                          maxLength: 15,
                          readOnly: isReadOnly,
                        }}
                        inputStyle={{
                          width: "100%",
                          paddingLeft: "60px",
                          fontSize: "16px",
                          borderRadius: "12px",
                          height: "45px",
                          backgroundColor: (isReadOnly || shouldDisableForm) ? '#f5f5f5' : '#fff',
                        }}
                        buttonStyle={{
                          borderRadius: "12px",
                          textAlign: "left",
                          border: "1px solid #00A8A8",
                          backgroundColor: (isReadOnly || shouldDisableForm) ? '#f5f5f5' : '#fff',
                        }}
                      />
                      {isCheckingDuplicate && (
                        <div className="text-muted" style={{ fontSize: "12px", marginTop: "5px" }}>
                          Checking availability...
                        </div>
                      )}
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
                        onChange={handleChangeAgentName}
                        onKeyPress={(e) => {
                          const regex = /^[a-zA-Z\s]*$/;
                          if (!regex.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        placeholder="Enter agent name"
                        disabled={shouldDisableForm}
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
                        onChange={handleChangeAgentEmail}
                        placeholder="Enter agent email"
                        disabled={shouldDisableForm}
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
                        disabled={shouldDisableForm}
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
                        maxLength={10}
                        disabled={shouldDisableForm}
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
                        disabled={shouldDisableForm}
                      />
                    </div>
                  </div>
                </div>               
                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">State*</label>
                    <div className="form_field_inner">
                      <Select
                        className="custom-select-stage1"
                        onChange={handleStateChange}
                        options={stateOptions.current}
                        value={state}
                        isDisabled={shouldDisableForm}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            outline: "none",
                            background: shouldDisableForm ? '#f5f5f5' : '#eee',
                            borderBottom: " 1px solid var(--theme-blue)",
                          }),
                          menu: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 999,
                            position: 'absolute',
                          }),
                          menuPortal: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 999,
                          }),
                          container: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 999,
                          }),
                        }}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        menuShouldScrollIntoView={false}
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
                        options={cityOptions}
                        value={city}
                        isDisabled={!state || shouldDisableForm}
                        placeholder={state ? "Select City" : "First select State"}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            outline: "none",
                            background: (!state || shouldDisableForm) ? '#f5f5f5' : '#eee',
                            borderBottom: " 1px solid var(--theme-blue)",
                          }),
                          menu: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 999,
                            position: 'absolute',
                          }),
                          menuPortal: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 999,
                          }),
                          container: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 999,
                          }),
                        }}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        menuShouldScrollIntoView={false}
                      />
                      {errors.city && (
                        <div className="field_error">{errors.city}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Locality</label>
                    <div className="form_field_inner">
                      <Select
                        isMulti
                        className=""
                        onChange={handleLocalityChange}
                        options={localityOptions}
                        value={locality}
                        isDisabled={!city || shouldDisableForm}
                        placeholder={city ? "Select Locality" : "First select City"}
                        formatOptionLabel={formatOptionLabelWithCheck}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            outline: "none",
                            background: (!city || shouldDisableForm) ? '#f5f5f5' : '#eee',
                            borderBottom: " 1px solid var(--theme-blue)",
                          }),
                          menu: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 999,
                            position: 'absolute',
                          }),
                          menuPortal: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 999,
                          }),
                          container: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 999,
                          }),
                        }}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        menuShouldScrollIntoView={false}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Society</label>
                    <div className="form_field_inner">
                      <Select
                        isMulti
                        className=""
                        onChange={handleSocietyChange}
                        options={societyOptions}
                        value={society}
                        isDisabled={locality.length === 0 || shouldDisableForm}
                        placeholder={locality.length > 0 ? "Select Society" : "First select Locality"}
                        formatOptionLabel={formatOptionLabelWithCheck}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            outline: "none",
                            background: (locality.length === 0 || shouldDisableForm) ? '#f5f5f5' : '#eee',
                            borderBottom: " 1px solid var(--theme-blue)",
                          }),
                          menu: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 999,
                            position: 'absolute',
                          }),
                          menuPortal: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 999,
                          }),
                          container: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 999,
                          }),
                        }}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        menuShouldScrollIntoView={false}
                      />
                    </div>
                  </div>
                </div>

                {agentID !== "new" && (
                  <>
                    <div className="col-xl-4 col-lg-6">
                      <div className="form_field st-2 label_top">
                        <label htmlFor="">Status*</label>
                        <div className="form_field_inner">
                          <div className="form_field_container">
                            <div className="radio_group">
                              <div className="radio_group_single">
                                <div className={status === "active" ? "custom_radio_button radiochecked" : "custom_radio_button"}>
                                  <input
                                    type="checkbox"
                                    id="user_status-active"
                                    onChange={(e) => {
                                      if (status === "active") {
                                        return;
                                      }
                                      setShowStatusModal(true);
                                    }}
                                    checked={status === "active"}
                                    disabled={shouldDisableForm}
                                  />
                                  <label htmlFor="user_status-active" style={{ paddingTop: "7px" }}>
                                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <div>
                                        <div className="radio_icon">
                                          <span className="material-symbols-outlined add">add</span>
                                          <span className="material-symbols-outlined check">done</span>
                                        </div>
                                        Active
                                      </div>
                                      <div>
                                        {agentDoc && agentDoc.activeBy && agentDoc.activeAt && (
                                          <div className="info_icon">
                                            <span className="material-symbols-outlined">info</span>
                                            <div className="info_icon_inner">
                                              <b className="text_green2">Active</b> by{" "}
                                              <b>{agentDoc && dbUsers && dbUsers.find((user) => user.id === agentDoc.activeBy)?.fullName}</b> on{" "}
                                              <b>{agentDoc && format(agentDoc.activeAt.toDate(), "dd-MMM-yyyy hh:mm a")}</b>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </label>
                                </div>
                              </div>

                              <div className="radio_group_single">
                                <div className={status === "banned" ? "custom_radio_button radiochecked" : "custom_radio_button"}>
                                  <input
                                    type="checkbox"
                                    id="user_status-banned"
                                    onChange={(e) => {
                                      if (status === "banned") {
                                        return;
                                      }
                                      setShowStatusModal(true);
                                    }}
                                    checked={status === "banned"}
                                    disabled={shouldDisableForm}
                                  />
                                  <label htmlFor="user_status-banned" style={{ paddingTop: "7px" }}>
                                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <div>
                                        <div className="radio_icon">
                                          <span className="material-symbols-outlined add">add</span>
                                          <span className="material-symbols-outlined check">done</span>
                                        </div>
                                        Banned
                                      </div>
                                      <div>
                                        {agentDoc && agentDoc.inactiveBy && agentDoc.inactiveAt && (
                                          <div className="info_icon">
                                            <span className="material-symbols-outlined">info</span>
                                            <div className="info_icon_inner">
                                              <b className="text_green2">Banned</b> by{" "}
                                              <b>{agentDoc && dbUsers && dbUsers.find((user) => user.id === agentDoc.inactiveBy)?.fullName}</b> on{" "}
                                              <b>{agentDoc && format(agentDoc.inactiveAt.toDate(), "dd-MMM-yyyy hh:mm a")}</b>
                                              , Reason <b>{agentDoc && agentDoc.inactiveReason && agentDoc.inactiveReason}</b>
                                              ,{agentDoc && agentDoc.inactiveRemark && <> Remark <b>{agentDoc.inactiveRemark}</b></>}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
                      <Modal.Header className="justify-content-center" style={{ paddingBottom: "0px", border: "none" }}>
                        <h5>{status === "banned" ? "Reason For Inactive" : "Confirmation"}</h5>
                      </Modal.Header>
                      <Modal.Body className="text-center" style={{ color: "#FA6262", fontSize: "20px", border: "none" }}>
                        {status === "active" && (
                          <div>
                            <div className="form_field">
                              <div className="field_box theme_radio_new">
                                <div className="theme_radio_container" style={{ padding: "0px", border: "none" }}>
                                  <div className="radio_single">
                                    <input
                                      type="radio"
                                      name="reason"
                                      value="Security Concerns"
                                      checked={reason === "Security Concerns"}
                                      onChange={() => setReason("Security Concerns")}
                                      id="SecurityConcerns"
                                    />
                                    <label htmlFor="SecurityConcerns">Security Concerns</label>
                                  </div>
                                  <div className="radio_single">
                                    <input
                                      type="radio"
                                      name="reason"
                                      value="PolicyViolations"
                                      checked={reason === "Policy Violations"}
                                      onChange={() => setReason("Policy Violations")}
                                      id="PolicyViolations"
                                    />
                                    <label htmlFor="PolicyViolations">Policy Violations</label>
                                  </div>
                                  <div className="radio_single">
                                    <input
                                      type="radio"
                                      name="reason"
                                      value="other"
                                      checked={reason === "other"}
                                      onChange={() => setReason("other")}
                                      id="other"
                                    />
                                    <label htmlFor="other">Other</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form_field mt-3 mb-3">
                              <textarea
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                onFocus={(e) => (e.target.style.outline = "none")}
                                onBlur={(e) => (e.target.style.outline = "")}
                                placeholder="Enter any remark..."
                                style={{ outline: "none", paddingLeft: "10px" }}
                              ></textarea>
                            </div>
                          </div>
                        )}
                        Are you sure you want to mark this user as {status === "active" ? "Banned" : "Active"}?
                      </Modal.Body>
                      <Modal.Footer className="d-flex justify-content-between" style={{ border: "none", gap: "15px" }}>
                        {errorForNoSelectReasonMessage && (
                          <div style={{ fontSize: "15px", textAlign: "center", padding: "4px 15px", borderRadius: "8px", background: "#ffe9e9", color: "red", width: "100%", margin: "auto" }}>
                            {errorForNoSelectReasonMessage}
                          </div>
                        )}
                        <div
                          className="cancel_btn"
                          onClick={() => {
                            if (status === "active" && !reason) {
                              setErrorForNoSelectReasonMessage("Please select a reason before updating the status.");
                              return;
                            } else if (status === "active" && reason === "other" && !remark) {
                              setErrorForNoSelectReasonMessage("Please enter a remark.");
                              return;
                            }
                            setStatus((prev) => (prev === "active" ? "banned" : "active"));
                            setShowStatusModal(false);
                          }}
                        >
                          Yes, Update
                        </div>
                        <div className="done_btn" onClick={() => setShowStatusModal(false)}>
                          No
                        </div>
                      </Modal.Footer>
                    </Modal>
                  </>
                )}
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
                      <div className="theme_btn btn_border no_icon text-center" onClick={backViewAgents}>
                        Cancel
                      </div>
                    </div>
                    <div className="col-8">
                      <button
                        onClick={(e) => {
                          submitAgentDocument(e);
                        }}
                        className="theme_btn btn_fill no_icon text-center"
                        disabled={isUploading || Object.values(errors).some((e) => e) || showDuplicateModal || shouldDisableForm}
                        style={{
                          width: "100%",
                          opacity: isUploading || Object.values(errors).some((e) => e) || showDuplicateModal || shouldDisableForm ? "0.7" : "1",
                          cursor: isUploading || Object.values(errors).some((e) => e) || showDuplicateModal || shouldDisableForm ? "not-allowed" : "pointer",
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
                      Please complete all required fields before submitting the form.
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Success Modal */}
          <Modal onHide={() => setShowModal(false)} show={showModal} centered>
            <Modal.Header closeButton style={{ borderBottom: "none" }} />
            <Modal.Body>
              <div>
                <h5 className="text-center" style={{ color: "var(--theme-green2)" }}>
                  {agentID !== "new"
                    ? "Agent details have been updated successfully"
                    : "Agent has been added successfully"}
                </h5>
                <button
                  className="theme_btn btn_fill no_icon text-center"
                  style={{ width: "100%", marginTop: "15px" }}
                  onClick={() => {
                    setShowModal(false);
                    if (agentID === "new") {
                      backViewAgents();
                    }
                  }}
                >
                  OK
                </button>
              </div>
            </Modal.Body>
          </Modal>

          {/* Duplicate Mobile Number Modal */}
          <Modal show={showDuplicateModal} onHide={() => setShowDuplicateModal(false)} centered>
            <Modal.Header closeButton style={{ borderBottom: "none" }}>
              <Modal.Title className="text-center w-100" style={{ color: "#dc3545" }}>
                Mobile Number Already Registered
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <div style={{ fontSize: "18px", marginBottom: "20px" }}>
                <span className="material-symbols-outlined" style={{ color: "#dc3545", fontSize: "48px" }}>
                  error
                </span>
                <p style={{ marginTop: "10px" }}>
                  This mobile number is already registered in our system. Please use a different mobile number.
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer style={{ borderTop: "none", justifyContent: "center" }}>
              <button
                className="theme_btn btn_fill no_icon"
                onClick={() => {
                  setShowDuplicateModal(false);
                  setIsFormDisabled(false);
                }}
                style={{ padding: "8px 30px" }}
              >
                OK
              </button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default AddAgent;