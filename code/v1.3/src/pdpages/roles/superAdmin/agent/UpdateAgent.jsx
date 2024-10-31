import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useCollection } from "../../../../hooks/useCollection";
import { useFirestore } from "../../../../hooks/useFirestore";
import { projectFirestore } from "../../../../firebase/config";
import { useDocument } from "../../../../hooks/useDocument";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";

const UpdateAgent = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const { updateDocument, error: updateAgentDocError } =
    useFirestore("agent-propdial");

  const { document: agentDoc, error: agentDocError } = useDocument(
    "agent-propdial",
    id
  );
  // console.log("agentDoc: ", agentDoc)

  //Master Data Loading Initialisation - Start
  const { documents: masterState, error: masterStateError } = useCollection(
    "m_states",
    ["status", "==", "active"],
    ["state", "asc"]
  );
  const { documents: masterCity, error: masterCityError } = useCollection(
    "m_cities",
    ["status", "==", "active"],
    ["city", "asc"]
  );
  const { documents: masterLocality, error: masterLocalityError } = useCollection(
    "m_localities",
    ["status", "==", "active"],
    ["locality", "asc"]
  );
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [locality, setLocality] = useState();
  const [society, setSociety] = useState();

  let stateOptions = useRef([]);
  let cityOptions = useRef([]);
  let localityOptions = useRef([]);
  let societyOptions = useRef([]);

  // stateOptions.current = masterState && masterState.map((stateData) => ({
  //   label: stateData.state,
  //   value: stateData.state,
  // }));

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
  const handleStateChange = async (option, selectedCity, selectedLocality, selectedSociety) => {
    setState(option);
    // console.log('state option:', option, state)
    const statename = option.label

    if (state && state.label !== option.label) {
      setCity({
        label: '',
        value: ''
      })
      setLocality({
        label: '',
        value: ''
      })
      setSociety({
        label: '',
        value: ''
      })
      selectedCity = {
        label: '',
        value: ''
      }
      selectedLocality = {
        label: '',
        value: ''
      }
      selectedSociety = {
        label: '',
        value: ''
      }
    }
    // console.log('selectedCity', selectedCity, 'selectedLocality', selectedLocality, 'selectedSociety', selectedSociety)
    const stateid = (masterState && masterState.find((e) => e.state.toLowerCase() === statename.toLowerCase())).id
    const ref = await projectFirestore
      .collection("m_cities")
      .where("state", "==", stateid)
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
            handleCityChange({
              label: '',
              value: ''
            }, {
              label: '',
              value: ''
            }, {
              label: '',
              value: ''
            });
          } else {
            if (selectedCity.label === '') {
              console.log('selectedCity', selectedCity, cityOptions.current)
              setCity({
                label: cityOptions.current[0].label,
                value: cityOptions.current[0].label,
              })
              handleCityChange({
                label: cityOptions.current[0].label,
                value: cityOptions.current[0].label,
              }, {
                label: '',
                value: ''
              }, {
                label: '',
                value: ''
              }
              );
            }
            else {
              // console.log('selectedLocality : ', selectedLocality)
              handleCityChange({
                label: selectedCity.label,
                value: selectedCity.label,
              }, selectedLocality, selectedSociety);
              // setCity()
              setCity(selectedCity);

            }
            // handleCityChange()
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

  //City select onchange
  const handleCityChange = async (option, selectedLocality, selectedSociety) => {
    setCity(option);
    // console.log('city option:', option, city, 'selectedLocality', selectedLocality)
    if (city && city.label !== option.label) {
      setLocality({
        label: '',
        value: ''
      })
      setSociety({
        label: '',
        value: ''
      })

      selectedLocality = {
        label: '',
        value: ''
      }
      selectedSociety = {
        label: '',
        value: ''
      }
    }

    if (option) {

      const cityname = option.label

      const cityid = (masterCity && masterCity.find((e) => e.city.toLowerCase() === cityname.toLowerCase())).id

      const ref = await projectFirestore
        .collection("m_localities")
        .where("city", "==", cityid)
        .orderBy("locality", "asc");
      ref.onSnapshot(
        async (snapshot) => {
          if (snapshot.docs) {
            localityOptions.current = snapshot.docs.map((localityData) => ({
              label: localityData.data().locality,
              value: localityData.id,
            }));

            // console.log("localityOptions: ", localityOptions);

            if (localityOptions.current.length === 0) {
              console.log("No Locality");
              handleLocalityChange({
                label: '',
                value: '',
              }, {
                label: '',
                value: '',
              });
            } else {
              if (selectedLocality && selectedLocality.label !== '') {
                handleLocalityChange(selectedLocality, selectedSociety);
                setLocality(selectedLocality);

              } else {
                handleLocalityChange({
                  label: localityOptions.current[0].label,
                  value: localityOptions.current[0].value,
                },
                  {
                    label: '',
                    value: '',
                  });
                setLocality({
                  label: localityOptions.current[0].label,
                  value: localityOptions.current[0].value,
                })
              }
            }
          } else {
            handleLocalityChange({
              label: '',
              value: '',
            }, selectedSociety);
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
  const handleLocalityChange = async (option, selectedSociety) => {
    setLocality(option);
    // console.log('locality option:', option, 'selectedSociety', selectedSociety)
    if (locality && locality.label !== option.label) {
      selectedSociety = {
        label: '',
        value: ''
      };

      setSociety({
        label: '',
        value: ''
      })
    }
    if (option) {
      const localityname = option.label

      // console.log("masterLocality: ", masterLocality)
      const localityid = (masterLocality && masterLocality.find((e) => e.locality.toLowerCase() === localityname.toLowerCase())).id
      // console.log('localityid', localityid)
      const ref = await projectFirestore
        .collection("m_societies")
        .where("locality", "==", localityid)
        .orderBy("society", "asc");
      ref.onSnapshot(
        async (snapshot) => {

          if (snapshot.docs) {
            societyOptions.current = snapshot.docs.map((societyData) => ({
              label: societyData.data().society,
              value: societyData.id,
            }));

            // console.log("societyOptions.current: ", societyOptions.current);

            if (societyOptions.current.length === 0) {
              console.log("No Society");
              handleSocietyChange({
                label: '',
                value: ''
              });
            } else {
              if (selectedSociety && selectedSociety.label !== '') {
                handleSocietyChange(selectedSociety);
                setSociety(selectedSociety);
              } else {
                handleSocietyChange({
                  label: societyOptions.current[0].label,
                  value: societyOptions.current[0].value,
                });
                setSociety({
                  label: societyOptions.current[0].label,
                  value: societyOptions.current[0].value,
                });
              }
            }
          } else {
            handleSocietyChange({
              label: '',
              value: '',
            });
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
  const [isUploading, setIsUploading] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentCompnayName, setAgentCompnayName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPancard, setAgentPancard] = useState("");
  const [agentGstNumber, setAgentGstNumber] = useState("");

  useEffect(() => {
    if (agentDoc) {
      setAgentName(agentDoc.agentName || "");
      setAgentCompnayName(agentDoc.agentCompnayName || "");
      setAgentPhone(agentDoc.agentPhone || "");
      setAgentEmail(agentDoc.agentEmail || "");
      setAgentPancard(agentDoc.agentPancard || "");
      setAgentGstNumber(agentDoc.agentGstNumber || "");

      setState({
        label: agentDoc.state || "",
        value: agentDoc.state || ""
      });
      setCity({
        label: agentDoc.city || "",
        value: agentDoc.city || ""
      });
      setLocality({
        label: agentDoc.locality || "",
        value: agentDoc.locality || ""
      });
      setSociety({
        label: agentDoc.society || "",
        value: agentDoc.society || ""
      });

      handleStateChange({
        label: agentDoc.state || "",
        value: agentDoc.state || ""
      }, {
        label: agentDoc.city || "",
        value: agentDoc.city || ""
      },
        {
          label: agentDoc.locality || "",
          value: agentDoc.locality || ""
        }, {
        label: agentDoc.society || "",
        value: agentDoc.society || ""
      })

      handleCityChange({
        label: agentDoc.city || "",
        value: agentDoc.city || "",
      }, {
        label: agentDoc.locality || "",
        value: agentDoc.locality || ""
      }, {
        label: agentDoc.society || "",
        value: agentDoc.society || ""
      }
      )


      handleLocalityChange({
        label: agentDoc.locality || "",
        value: agentDoc.locality || ""
      }, {
        label: agentDoc.society || "",
        value: agentDoc.society || ""
      })

    }
  }, [agentDoc]);




  // functions
  const handleChangeAgentName = (e) => setAgentName(e.target.value);
  const handleChangeAgentComanayName = (e) =>
    setAgentCompnayName(e.target.value);
  const handleChangeAgentPhone = (value) => setAgentPhone(value);
  const handleChangeAgentEmail = (e) => setAgentEmail(e.target.value);
  const handleChangeAgentPancard = (e) => setAgentPancard(e.target.value);
  const handleChangeAgentGstNumber = (e) => setAgentGstNumber(e.target.value);

  // Add additional state variables for tracking errors
  const [errors, setErrors] = useState({
    agentName: "",
    agentPhone: "",
    agentEmail: "",
    state: "",
    city: "",
    locality: "",
    society: "",
  });

  const someError = errors.agentName || errors.agentEmail;

  // Helper function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const submitUpdatedAgent = async () => {
    try {
      setIsUploading(true);

      // Log data before update
      // console.log("Updating with data:", {
      //   agentName,
      //   agentCompnayName,
      //   agentPhone,
      //   agentEmail,
      //   agentPancard,
      //   agentGstNumber,
      //   country: "India",
      //   state: state?.label || "",
      //   city: city?.label || "",
      //   locality: locality?.label || "",
      //   society: society?.label || "",
      //   status: "active",
      // });

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
        locality: locality?.label || "",
        society: society?.label || "",
        status: "active",
      };

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
    <div className="top_header_pg pg_bg pg_enquiry pg_enquiry_update">
      <div className="page_spacing">
        <div className="pg_header d-flex justify-content-between">
          <div
            className="left d-flex align-items-center pointer"
            style={{
              gap: "5px",
            }}
          >
            <span
              class="material-symbols-outlined pointer"
              onClick={backViewAgents}
            >
              arrow_back
            </span>
            <h2 className="m22 mb-1">Update Agent</h2>
          </div>
          {/* <div className="right">
          <div
            className="d-flex align-items-center"
            style={{
              gap: "22px",
            }}
          >
            <Link to="/enquiry/all" className="theme_btn btn_border">
              Cancel
            </Link>
            <button
              className="theme_btn btn_fill"
              onClick={submitEnquiry}
              disabled={isUploading}
            >
              {isUploading ? "Updating..." : "Update Enquiry"}
            </button>
          </div>
        </div> */}
        </div>
        <hr />
        <form>
          <div className="vg12"></div>
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
                <label htmlFor="">Email*</label>
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
                  {/* {console.log('stateOptions.current', stateOptions.current, 'state', state)} */}
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
                      console.log("e: ", e)
                      handleStateChange({
                        label: e.label,
                        value: e.label,
                      }, city, locality, society)
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
                        value: e.label
                      }, locality, society)
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
                  {errors.city && (
                    <div className="field_error">{errors.city}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6">
              <div className="form_field label_top">
                <label htmlFor="">Locality*</label>
                <div className="form_field_inner">
                  <Select
                    className=""
                    onChange={(e) => {
                      handleLocalityChange({
                        label: e.label,
                        value: e.label
                      }, society)
                    }}
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
            <div className="col-xl-4 col-lg-6">
              <div className="form_field label_top">
                <label htmlFor="">Society*</label>
                <div className="form_field_inner">
                  <Select
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
          </div>
          <div className="vg22"></div>
          {updateAgentDocError && (
            <>
              <div className="field_error">{updateAgentDocError}</div>
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
                  Please complete all required fields before submitting the
                  form.
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAgent;
