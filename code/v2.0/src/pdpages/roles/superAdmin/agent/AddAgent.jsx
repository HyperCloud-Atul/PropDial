import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
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

const AddAgent = ({agentID }) => {
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

  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [locality, setLocality] = useState([]);
  const [society, setSociety] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentCompnayName, setAgentCompnayName] = useState("");
  const [agentPhone, setAgentPhone] = useState("91");
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
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [hasDuplicatePhone, setHasDuplicatePhone] = useState(false);

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

  // Cache for duplicate checks and timeouts
  const duplicateCheckCache = useRef(new Map());
  const lastPhoneCheck = useRef("");
  const phoneCheckTimeoutRef = useRef(null);
  const initializationTimeoutRef = useRef(null);

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

  // Optimized: Pre-process master data for faster lookups
  const citiesByState = useRef(new Map());
  const localitiesByCity = useRef(new Map());
  const societiesByLocality = useRef(new Map());

  useEffect(() => {
    if (masterCity) {
      citiesByState.current.clear();
      masterCity.forEach(city => {
        if (!citiesByState.current.has(city.state)) {
          citiesByState.current.set(city.state, []);
        }
        citiesByState.current.get(city.state).push(city);
      });
    }
  }, [masterCity]);

  useEffect(() => {
    if (masterLocality) {
      localitiesByCity.current.clear();
      masterLocality.forEach(locality => {
        if (!localitiesByCity.current.has(locality.city)) {
          localitiesByCity.current.set(locality.city, []);
        }
        localitiesByCity.current.get(locality.city).push(locality);
      });
    }
  }, [masterLocality]);

  useEffect(() => {
    if (masterSociety) {
      societiesByLocality.current.clear();
      masterSociety.forEach(society => {
        if (!societiesByLocality.current.has(society.locality)) {
          societiesByLocality.current.set(society.locality, []);
        }
        societiesByLocality.current.get(society.locality).push(society);
      });
    }
  }, [masterSociety]);

  // FIXED: Proper form initialization with timeout cleanup
  useEffect(() => {
    if (agentDoc && masterState && masterCity && !isFormInitialized) {
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }

      initializationTimeoutRef.current = setTimeout(() => {
        try {
          let selectedstate = masterState.find((e) => e.state === agentDoc.state);
          if (selectedstate) {
            setState({
              label: agentDoc.state,
              value: selectedstate.id,
            });
          }

          let selectedcity = masterCity.find((e) => e.city === agentDoc.city);
          if (selectedcity) {
            setCity({
              label: agentDoc.city,
              value: selectedcity.id,
            });
          }

          if (agentDoc.locality) setLocality(agentDoc.locality);
          if (agentDoc.society) setSociety(agentDoc.society);
          if (agentDoc.agentName) setAgentName(camelCase(agentDoc.agentName));
          if (agentDoc.agentCompnayName) setAgentCompnayName(agentDoc.agentCompnayName);
          if (agentDoc.agentPhone) setAgentPhone(agentDoc.agentPhone);
          if (agentDoc.agentEmail) setAgentEmail(agentDoc.agentEmail);
          if (agentDoc.agentPancard) setAgentPancard(agentDoc.agentPancard);
          if (agentDoc.agentGstNumber) setAgentGstNumber(agentDoc.agentGstNumber);
          if (agentDoc.status) setStatus(agentDoc.status);

          setIsFormInitialized(true);
        } catch (error) {
          console.error("Error initializing form:", error);
          setIsFormInitialized(true);
        }
      }, 100);
    } else if (agentID === "new") {
      setIsFormInitialized(true);
    }

    return () => {
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
    };
  }, [agentDoc, masterState, masterCity, agentID, isFormInitialized]);

  // FIXED: Improved state change handler with proper error clearing
  const handleStateChange = useCallback(async (option) => {
    setState(option);
    setCity(null);
    setLocality([]);
    setSociety([]);
    setErrors(prev => ({ ...prev, state: "" }));

    if (option) {
      const cities = citiesByState.current.get(option.value) || [];
      const cityOptions = cities.map(city => ({
        label: city.city,
        value: city.id,
      }));
      setCityOptions(cityOptions);
    } else {
      setCityOptions([]);
      setLocalityOptions([]);
      setSocietyOptions([]);
    }
  }, []);

  // FIXED: Improved city change handler
  const handleCityChange = useCallback(async (option) => {
    setCity(option);
    setLocality([]);
    setSociety([]);
    setErrors(prev => ({ ...prev, city: "" }));

    if (option) {
      const localities = localitiesByCity.current.get(option.value) || [];
      const localityOptions = localities.map(locality => ({
        label: locality.locality,
        value: locality.id,
      }));
      setLocalityOptions(localityOptions);
      setSocietyOptions([]);
    } else {
      setLocalityOptions([]);
      setSocietyOptions([]);
    }
  }, []);

  // FIXED: Improved locality change handler
  const handleLocalityChange = useCallback(async (selectedOptions) => {
    setLocality(selectedOptions || []);
    setSociety([]);

    if (selectedOptions && selectedOptions.length > 0) {
      const localityIds = selectedOptions.map(option => option.value);
      const allSocieties = [];

      localityIds.forEach(localityId => {
        const societies = societiesByLocality.current.get(localityId) || [];
        societies.forEach(society => {
          const localityObj = selectedOptions.find(loc => loc.value === society.locality);
          const localityName = localityObj ? localityObj.label : "";
          
          allSocieties.push({
            label: `${society.society}, ${localityName}`,
            value: society.id,
            localityId: society.locality
          });
        });
      });

      setSocietyOptions(allSocieties);
    } else {
      setSocietyOptions([]);
    }
  }, []);

  const handleSocietyChange = useCallback(async (selectedOptions) => {
    setSociety(selectedOptions || []);
  }, []);

  // FIXED: IMPROVED DUPLICATE CHECK - Now returns promise for proper async handling
  const checkMobileNumber = async (phoneNumber) => {
    return new Promise(async (resolve, reject) => {
      const cleanNumber = phoneNumber.replace(/\D/g, '');

      // Check cache first
      if (duplicateCheckCache.current.has(cleanNumber)) {
        const cachedResult = duplicateCheckCache.current.get(cleanNumber);
        resolve(cachedResult);
        return;
      }

      if (lastPhoneCheck.current === cleanNumber) {
        const cachedResult = duplicateCheckCache.current.get(cleanNumber);
        if (cachedResult) {
          resolve(cachedResult);
          return;
        }
      }

      lastPhoneCheck.current = cleanNumber;

      if (cleanNumber.startsWith('91') && cleanNumber.length === 12) {
        const actualNumber = cleanNumber.substring(2);

        if (actualNumber.length === 10) {
          setIsCheckingDuplicate(true);
          try {
            let query = projectFirestore
              .collection("agent-propdial")
              .where("agentPhone", "==", cleanNumber);

            const snapshot = await query.get();

            const result = {
              hasDuplicates: !snapshot.empty,
              isCurrentAgent: agentID !== "new" ? snapshot.docs.some(doc => doc.id === agentID) : false
            };

            duplicateCheckCache.current.set(cleanNumber, result);
            setIsCheckingDuplicate(false);
            resolve(result);
          } catch (error) {
            console.error("Error checking mobile number:", error);
            setIsCheckingDuplicate(false);
            reject(error);
          }
        } else {
          const result = { hasDuplicates: false, isCurrentAgent: false };
          resolve(result);
        }
      } else if (cleanNumber.length > 0) {
        const result = { hasDuplicates: false, isCurrentAgent: false };
        resolve(result);
      } else {
        const result = { hasDuplicates: false, isCurrentAgent: false };
        resolve(result);
      }
    });
  };

  // FIXED: BETTER DUPLICATE RESULT HANDLING
  const handleDuplicateResult = (result) => {
    if (result.hasDuplicates) {
      if (agentID !== "new") {
        if (!result.isCurrentAgent) {
          setShowDuplicateModal(true);
          setHasDuplicatePhone(true);
          setErrors(prev => ({ ...prev, agentPhone: "This mobile number is already registered" }));
          setIsFormDisabled(true);
        } else {
          setHasDuplicatePhone(false);
          setErrors(prev => ({ ...prev, agentPhone: "" }));
          setIsFormDisabled(false);
        }
      } else {
        setShowDuplicateModal(true);
        setHasDuplicatePhone(true);
        setErrors(prev => ({ ...prev, agentPhone: "This mobile number is already registered" }));
        setIsFormDisabled(true);
      }
    } else {
      setHasDuplicatePhone(false);
      setErrors(prev => ({ ...prev, agentPhone: "" }));
      setIsFormDisabled(false);
    }
  };

  // FIXED: IMPROVED PHONE CHANGE HANDLER - Better duplicate detection
  const handleChangeAgentPhone = (value) => {
    setAgentPhone(value);
    // Clear previous duplicate state when user changes number
    setHasDuplicatePhone(false);
    setErrors(prev => ({ ...prev, agentPhone: "" }));

    if (agentID === "new") {
      const cleanNumber = value.replace(/\D/g, '');
      if (cleanNumber.startsWith('91') && cleanNumber.length === 12) {
        if (phoneCheckTimeoutRef.current) {
          clearTimeout(phoneCheckTimeoutRef.current);
        }
        
        phoneCheckTimeoutRef.current = setTimeout(() => {
          checkMobileNumber(value).then(handleDuplicateResult);
        }, 800);
      }
    }
  };

  // FIXED: Improved name change handler with immediate error clearing
  const handleChangeAgentName = (e) => {
    const value = e.target.value;
    setAgentName(value);
    if (value.trim()) {
      setErrors(prev => ({ ...prev, agentName: "" }));
    }
  };

  const handleChangeAgentComanayName = (e) => {
    setAgentCompnayName(e.target.value);
  };

  // FIXED: Improved email change handler with immediate error clearing
  const handleChangeAgentEmail = (e) => {
    setAgentEmail(e.target.value);
    setErrors(prev => ({ ...prev, agentEmail: "" }));
  };

  const handleChangeAgentPancard = (e) => setAgentPancard(e.target.value.toUpperCase());
  const handleChangeAgentGstNumber = (e) => setAgentGstNumber(e.target.value);

  // FIXED: IMPROVED FORM VALIDATION - Now includes duplicate check
  const formValidation = async () => {
    const newErrors = {};

    // Mobile number validation
    const cleanNumber = agentPhone.replace(/\D/g, '');
    if (!agentPhone || agentPhone === "91") {
      newErrors.agentPhone = "Phone number is required";
    } else if (!cleanNumber.startsWith('91') || cleanNumber.length !== 12) {
      newErrors.agentPhone = "Please enter a valid 10-digit mobile number with +91 country code";
    }

    if (!agentName.trim()) {
      newErrors.agentName = "Name is required";
    }

    if (agentEmail && !isValidEmail(agentEmail)) {
      newErrors.agentEmail = "Invalid email format";
    }

    if (!state) {
      newErrors.state = "State is required";
    }

    if (!city) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);

    // If there are basic validation errors, return false
    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    // FIXED: FOR NEW AGENTS, CHECK DUPLICATE AGAIN BEFORE SUBMIT
    if (agentID === "new") {
      try {
        const duplicateResult = await checkMobileNumber(agentPhone);
        if (duplicateResult.hasDuplicates) {
          setShowDuplicateModal(true);
          setHasDuplicatePhone(true);
          setErrors(prev => ({ 
            ...prev, 
            agentPhone: "This mobile number is already registered" 
          }));
          return false;
        }
      } catch (error) {
        console.error("Error during duplicate check:", error);
        return false;
      }
    }

    return true;
  };

  // Helper function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const backViewAgents = () => {
    navigate("/agents");
  };

  // FIXED: IMPROVED SUBMIT FUNCTION - Now properly waits for duplicate check
  const submitAgentDocument = async (e) => {
    e.preventDefault();

    // First validate the form (including duplicate check)
    const isValid = await formValidation();
    if (!isValid) {
      console.log("Form validation failed");
      return;
    }

    // FIXED: DOUBLE CHECK - If duplicate modal is still showing, don't proceed
    if (hasDuplicatePhone || showDuplicateModal) {
      console.log("Duplicate phone detected, cannot submit");
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
        await addAgentDoc(dataSet);
        resetForm();
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
        await updateAgentDoc(agentID, dataSet);
      }

      setShowModal(true);
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // FIXED: Reset form function
  const resetForm = () => {
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
    setErrors({
      agentPhone: "",
      agentName: "",
      agentEmail: "",
      state: "",
      city: "",
    });
    setIsFormDisabled(false);
    setHasDuplicatePhone(false);
    duplicateCheckCache.current.clear();
  };

  // FIXED: Proper cleanup on unmount
  useEffect(() => {
    return () => {
      if (phoneCheckTimeoutRef.current) {
        clearTimeout(phoneCheckTimeoutRef.current);
      }
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
    };
  }, []);

  const shouldDisableForm = agentID === "new" && (isFormDisabled || hasDuplicatePhone);
  
  // FIXED: IMPROVED SUBMIT BUTTON DISABLE LOGIC
  const isSubmitDisabled = isUploading || 
                          Object.values(errors).some(error => error) || 
                          shouldDisableForm || 
                          !isFormInitialized ||
                          hasDuplicatePhone;

  // FIXED: BETTER DUPLICATE MODAL CLOSE HANDLER
  const handleDuplicateModalClose = () => {
    setShowDuplicateModal(false);
    setIsFormDisabled(false);
    setHasDuplicatePhone(true); // Keep this true to prevent submission
    setErrors(prev => ({ 
      ...prev, 
      agentPhone: "Please change the mobile number to continue" 
    }));
  };

  // Show loading until form is properly initialized
  if (!isFormInitialized && agentID !== "new") {
    return (
      <div className="top_header_pg pg_bg pg_agent">
        <div className="filter_loading" style={{ height: "80vh" }}>
          <BeatLoader color={"var(--theme-green)"} />
        </div>
      </div>
    );
  }

  return (
    <div className="top_header_pg pg_bg pg_agent">
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
                    // disabled={isReadOnly || shouldDisableForm}
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
                    className={errors.agentName ? 'error-border' : ''}
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
                    className={errors.agentEmail ? 'error-border' : ''}
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
                    onChange={handleCityChange}
                    options={cityOptions}
                    value={city}
                    isDisabled={!state || shouldDisableForm}
                    placeholder={state ? "Select City" : "First select State"}
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
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-6">
              <div className="form_field label_top">
                <label htmlFor="">Society</label>
                <div className="form_field_inner">
                  <Select
                    isMulti
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
                </div>
              </div>
            </div>

            {/* Status section for existing agents */}
            {agentID !== "new" && (
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
                                if (status === "active") return;
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
                                if (status === "banned") return;
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
                  <div className="theme_btn btn_border no_icon text-center"
                  //  onClick={backViewAgents}
                   >
                    Cancel
                  </div>
                </div>
                <div className="col-8">
                  <button
                    onClick={submitAgentDocument}
                    className="theme_btn btn_fill no_icon text-center"
                    disabled={isSubmitDisabled}
                    style={{
                      width: "100%",
                      opacity: isSubmitDisabled ? "0.7" : "1",
                      cursor: isSubmitDisabled ? "not-allowed" : "pointer",
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
                // if (agentID === "new") {
                //   backViewAgents();
                // }
              }}
            >
              OK
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Duplicate Mobile Number Modal - FIXED: Now properly prevents submission */}
      <Modal show={showDuplicateModal} onHide={handleDuplicateModalClose} centered>
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
            <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
              You must change the mobile number before you can submit the form.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none", justifyContent: "center" }}>
          <button
            className="theme_btn btn_fill no_icon"
            onClick={handleDuplicateModalClose}
            style={{ padding: "8px 30px" }}
          >
            OK, I'll Change Number
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddAgent;