import React from "react";
import Select from "react-select";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useCommon } from "../../hooks/useCommon";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";

import { projectFirestore, timestamp } from "../../firebase/config";
import SearchBarAutoComplete from "../../pages/search/SearchBarAutoComplete";
import PropertyDetails from "../../components/property/PropertyDetails";

// import { projectID } from 'firebase-functions/params';

//Restrict to Input
function restrictInput(event, maxLength) {
  // Get the value entered in the input field
  let inputValue = event.target.value;

  // Remove any non-numeric characters using a regular expression
  let numericValue = inputValue.replace(/[^0-9]/g, "");

  // Limit the maximum length to 10 characters
  // let maxLength = 9;
  if (numericValue.length > maxLength) {
    numericValue = numericValue.slice(0, maxLength);
  }

  // Update the input field with the numeric value
  event.target.value = numericValue;
}


//Convert Amount to Words - new code start
const units = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
const teens = [
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const tens = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];
const places = ["", "thousand", "lakh", "crore", "arab", "kharab"];

function convertToWords(number) {

  if (number === 0) {
    return "zero";
  }

  // Split the number into groups of three digits for the first chunk and then two digits
  const chunks = [];
  chunks.push(number % 1000); // Get the last three digits
  number = Math.floor(number / 1000);

  while (number > 0) {
    chunks.push(number % 100); // Get chunks of two digits
    number = Math.floor(number / 100);
  }

  // Convert each chunk to words with Indian format
  const chunkWords = chunks.map((chunk, index) => {
    if (chunk === 0) {
      return "";
    }

    const chunkText = chunkToWords(chunk);
    const suffix = index === 0 ? "" : ` ${indexToPlace(index)}`;
    return `${chunkText}${suffix}`;
  });

  // Combine the chunk words
  return chunkWords.reverse().join(" ").trim();
}

function chunkToWords(chunk) {
  const hundredDigit = Math.floor(chunk / 100);
  const remainder = chunk % 100;

  let result = "";
  if (hundredDigit > 0) {
    result += `${units[hundredDigit]} hundred`;
  }

  if (remainder > 0) {
    if (result !== "") {
      result += " and ";
    }

    if (remainder < 10) {
      result += units[remainder];
    } else if (remainder < 20) {
      result += teens[remainder - 10];
    } else {
      const tenDigit = Math.floor(remainder / 10);
      const oneDigit = remainder % 10;

      result += tens[tenDigit];
      if (oneDigit > 0) {
        result += `-${units[oneDigit]}`;
      }
    }
  }

  return camelCase(result);
}

function indexToPlace(index) {
  return places[index] || "";
}

// Example usage:
const amount = 1200000;
const amountInWords = convertToWords(amount);
// console.log(`${amount} in words: ${amountInWords}`);
//Convert Amount to Words - new code end

// Convert digit into comma formate start
function formatNumberWithCommas(number) {
  // Convert number to a string if it's not already
  let numStr = number.toString();

  // Handle decimal part if present
  const [integerPart, decimalPart] = numStr.split(".");

  // Regular expression for Indian comma format
  const lastThreeDigits = integerPart.slice(-3);
  const otherDigits = integerPart.slice(0, -3);

  const formattedNumber =
    otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherDigits ? "," : "") +
    lastThreeDigits;

  // Return the formatted number with decimal part if it exists
  return decimalPart ? `${formattedNumber}.${decimalPart}` : formattedNumber;
}

// Use replace() to remove all commas
function removeCommas(stringWithCommas) {
  const stringWithoutCommas = stringWithCommas.replace(/,/g, '');
  return stringWithoutCommas;
}

function camelCase(inputStr) {
  let str = inputStr && inputStr.toLowerCase();
  return (
    str && str
      .replace(/\s(.)/g, function (a) {
        return a.toUpperCase();
      })
      // .replace(/\s/g, '')
      .replace(/^(.)/, function (b) {
        return b.toUpperCase();
      })
  );
}

const Stage1 = (props) => {
  const { propertyid } = useParams();
  // console.log('firebase projectid:', projectID)

  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const navigate = useNavigate();

  const { document: propertyDocument, error: propertyerror } = useDocument(
    "properties-propdial",
    propertyid
  );
  function setRedirectFlag(flag, key) { }
  const { user } = useAuthContext();

  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  // const { amountToWords, response: amountToWordsResponse } = useCommon();
  // const { camelCase } = useCommon();
  // const { formatAmount, response: formatAmountResponse } = useCommon();
  // const { formatPhoneNumber } = useCommon();

  const [onboardingDate, setOnboardingDate] = useState(new Date());
  const [newProperty, setNewProperty] = useState(null);

  const { addDocument, response: addDocumentResponse } =
    useFirestore("properties-propdial");
  const { updateDocument, response: updateDocumentResponse } =
    useFirestore("properties-propdial");

  const { documents: dbpropertiesdocuments, error: propertieserror } =
    useCollection("properties-propdial");

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

  const [propertyDetails, setPropertyDetails] = useState({
    // All select type
    Region: "",
    Package: "",
    Flag: "",
    Source: "",
    OwnerShip: "",
    Category: "",
    UnitNumber: "",
    DemandPriceRent: "",
    DemandPriceSale: "",
    MaintenanceFlag: "",
    MaintenanceCharges: "",
    MaintenanceChargesFrequency: "",
    Purpose: "",
    Country: "",
    State: "",
    City: "",
    Locality: "",
    Society: "",
    Pincode: "",
    PropertyName: "",
    FullAddress: ""
  });

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

  useEffect(() => {
    if (propertyDocument) {
      setPropertyDetails({
        // All select type
        Region: propertyDocument.region,
        Package: propertyDocument.package,
        Flag: propertyDocument.flag,
        Source: propertyDocument.source,
        OwnerShip: propertyDocument.ownership,
        Category: propertyDocument.category
          ? propertyDocument.category
          : "Residential",
        UnitNumber: propertyDocument.unitNumber
          ? propertyDocument.unitNumber
          : "",
        DemandPriceRent: propertyDocument.demandPriceRent
          ? propertyDocument.demandPriceRent
          : "",
        DemandPriceSale: propertyDocument.demandPriceSale
          ? propertyDocument.demandPriceSale
          : "",
        MaintenanceFlag: propertyDocument.maintenanceFlag
          ? propertyDocument.maintenanceFlag
          : "",
        MaintenanceCharges: propertyDocument.maintenanceCharges
          ? propertyDocument.maintenanceCharges
          : "",
        MaintenanceChargesFrequency:
          propertyDocument.maintenanceChargesFrequency
            ? propertyDocument.maintenanceChargesFrequency
            : "",
        SecurityDeposit: propertyDocument.securityDeposit
          ? propertyDocument.securityDeposit
          : "",
        Purpose: propertyDocument.purpose ? propertyDocument.purpose : "",
        Country: propertyDocument.country ? propertyDocument.country : "",
        State: propertyDocument.state ? propertyDocument.state : "",
        City: propertyDocument.city ? propertyDocument.city : "",
        Locality: propertyDocument.locality ? propertyDocument.locality : "",
        Society: propertyDocument.society ? propertyDocument.society : "",
        Pincode: propertyDocument.pincode ? propertyDocument.pincode : "",
        PropertyName:
          propertyDocument.unitNumber +
          ", " +
          camelCase(propertyDocument.society.toLowerCase().trim()),
        FullAddress: camelCase(propertyDocument.fullAddress && propertyDocument.fullAddress.toLowerCase().trim())
      });

      setState({
        label: propertyDocument.state || "",
        value: propertyDocument.state || ""
      });
      setCity({
        label: propertyDocument.city || "",
        value: propertyDocument.city || ""
      });
      setLocality({
        label: propertyDocument.locality || "",
        value: propertyDocument.locality || ""
      });
      setSociety({
        label: propertyDocument.society || "",
        value: propertyDocument.society || ""
      });

      handleStateChange({
        label: propertyDocument.state || "",
        value: propertyDocument.state || ""
      }, {
        label: propertyDocument.city || "",
        value: propertyDocument.city || ""
      },
        {
          label: propertyDocument.locality || "",
          value: propertyDocument.locality || ""
        }, {
        label: propertyDocument.society || "",
        value: propertyDocument.society || ""
      })

      handleCityChange({
        label: propertyDocument.city || "",
        value: propertyDocument.city || "",
      }, {
        label: propertyDocument.locality || "",
        value: propertyDocument.locality || ""
      }, {
        label: propertyDocument.society || "",
        value: propertyDocument.society || ""
      }
      )

      handleLocalityChange({
        label: propertyDocument.locality || "",
        value: propertyDocument.locality || ""
      }, {
        label: propertyDocument.society || "",
        value: propertyDocument.society || ""
      })

    }
  }, [propertyDocument]);

  // Populate Master Data - Start
  //State select onchange
  const handleStateChange = async (option, selectedCity, selectedLocality, selectedSociety) => {
    setState(option);
    // console.log('state option:', option)
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
    console.log('locality option:', option, 'selectedSociety', selectedSociety)
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
      const localityname = option.value
      // console.log("localityname: ", option)
      // console.log("masterLocality: ", masterLocality)
      const localityid = (masterLocality && masterLocality.find((e) => e.id.toLowerCase() === localityname.toLowerCase())).id
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

  const setPurpose = (option) => {
    // console.log("setPurpose e.target.value:", option);
    setPropertyDetails({
      ...propertyDetails,
      Purpose: option,
    });

    let obj_maintenance = document.getElementById("id_maintenancecharges");
    option.toUpperCase() === "SALE"
      ? (obj_maintenance.style.display = "none")
      : (obj_maintenance.style.display = "flex");
  };

  useEffect(() => {
    // console.log('addDocumentResponse', addDocumentResponse)
    try {
      if (addDocumentResponse.document) {
        // console.log('addDocumentResponse id', addDocumentResponse.document && addDocumentResponse.document.id)
        props.setPropertyObj({
          ...newProperty,
          id: addDocumentResponse.document && addDocumentResponse.document.id,
          // stageFlag: 'stage2'
        });

        props.setStateFlag("stage2");
        navigate("/updateproperty/" + addDocumentResponse.document.id);

      }
    } catch (error) {
      console.error("Error cloning image:", error.message);
    }
  }, [addDocumentResponse]);

  const handleSubmit = async (e, option) => {
    console.log("In handleSubmit");
    e.preventDefault();
    // console.log('e: ', e)
    // console.log('option: ', option)

    setFormError(null);
    setFormSuccess(null);

    let errorFlag = false;
    let errorMsg = "Please select ";

    if (propertyDetails.Purpose === "") {
      if (errorMsg === "Please select ") errorMsg = errorMsg + "Purpose";
      else errorMsg = errorMsg + ", Purpose";
      errorFlag = true;
    }

    if (propertyDetails.Purpose === "Rent" && (propertyDetails.DemandPriceRent === "" || propertyDetails.DemandPriceRent === "0")) {
      if (errorMsg === "Please select ") errorMsg = "Please Enter Demand Price for Rent";
      else errorMsg = errorMsg + ", Demand Price for Rent";
      errorFlag = true;
    }

    if (propertyDetails.Purpose === "Sale" && (propertyDetails.DemandPriceSale === "" || propertyDetails.DemandPriceSale === "0")) {
      if (errorMsg === "Please select ") errorMsg = "Please Enter Demand Price for Sale";
      else errorMsg = errorMsg + ", Demand Price for Sale";
      errorFlag = true;
    }

    if (propertyDetails.Purpose === "RentSaleBoth" && (propertyDetails.DemandPriceSale === "" || propertyDetails.DemandPriceRent === "" || propertyDetails.DemandPriceRent === "0" || propertyDetails.DemandPriceSale === 0)) {
      if (errorMsg === "Please select ") errorMsg = "Please Enter Demand Price for Rent & Sale both";
      else errorMsg = errorMsg + ", Demand Price for Rent & Sale Both";
      errorFlag = true;
    }

    if (propertyDetails.MaintenanceCharges === "") {
      propertyDetails.MaintenanceChargesFrequency = "NA"
    } else {
      if (
        (propertyDetails.MaintenanceCharges !== "") &&
        propertyDetails.MaintenanceChargesFrequency === ""
      ) {
        if (errorMsg === "Please select ")
          errorMsg = errorMsg + "Frequency";
        else errorMsg = errorMsg + ", Frequency";
        errorFlag = true;
      }
      else {
        if (propertyDetails.MaintenanceCharges !== "" &&
          propertyDetails.MaintenanceChargesFrequency === "NA") {
          if (errorMsg === "Please select ")
            errorMsg = errorMsg + "Frequency";
          else errorMsg = errorMsg + ", Frequency";
          errorFlag = true;
        }
      }
    }

    // console.log('state:', state)
    if (state === "" || state === undefined || state === "Select State") {
      if (errorMsg === "Please select ") errorMsg = errorMsg + "State";
      else errorMsg = errorMsg + ", State";
      errorFlag = true;
    }

    if (city.label === "") {
      if (errorMsg === "Please select ") errorMsg = errorMsg + "City";
      else errorMsg = errorMsg + ", City";
      errorFlag = true;
    }
    if (locality.label === "") {
      if (errorMsg === "Please select ") errorMsg = errorMsg + "Locality";
      else errorMsg = errorMsg + ", Locality";
      errorFlag = true;
    }

    if (society.label === "") {
      if (errorMsg === "Please select ") errorMsg = errorMsg + "Society";
      else errorMsg = errorMsg + ", Society";

      errorFlag = true;
    }

    if (errorFlag)
      setFormError(errorMsg);

    else setFormError("");

    // errorFlag = false;

    // console.log('propertyDetails.City:', propertyDetails.City)

    const property = {
      region: propertyDetails.Region,
      package: propertyDetails.Package,
      flag: propertyDetails.Flag,
      source: propertyDetails.Source,
      ownership: propertyDetails.OwnerShip,
      category: propertyDetails.Category
        ? propertyDetails.Category
        : "Residential",
      unitNumber: propertyDetails.UnitNumber ? propertyDetails.UnitNumber.trim() : "",
      purpose: propertyDetails.Purpose ? propertyDetails.Purpose : "",

      // demandprice: propertyDetails.DemandPrice
      //   ? propertyDetails.DemandPrice
      //   : "",



      demandPriceRent: removeCommas(propertyDetails.DemandPriceRent)
        ? removeCommas(propertyDetails.DemandPriceRent)
        : "",
      demandPriceSale: removeCommas(propertyDetails.DemandPriceSale)
        ? removeCommas(propertyDetails.DemandPriceSale)
        : "",
      securityDeposit: removeCommas(propertyDetails.SecurityDeposit) ? removeCommas(propertyDetails.SecurityDeposit) : "",
      maintenanceFlag: propertyDetails.MaintenanceFlag
        ? propertyDetails.MaintenanceFlag
        : "Extra",
      maintenanceCharges: removeCommas(propertyDetails.MaintenanceCharges)
        ? removeCommas(propertyDetails.MaintenanceCharges)
        : "",
      maintenanceChargesFrequency: propertyDetails.MaintenanceChargesFrequency
        ? propertyDetails.MaintenanceChargesFrequency
        : "NA",
      state: state.label,
      city: city.label,
      // city: camelCase(propertyDetails.City.toLowerCase().trim()),
      locality: locality.label,
      // locality: camelCase(propertyDetails.Locality.toLowerCase().trim()),
      society: society.label,
      // society: camelCase(propertyDetails.Society.toLowerCase().trim()),
      pincode: propertyDetails.Pincode ? propertyDetails.Pincode : "",
      propertyName:
        propertyDetails.UnitNumber.trim() +
        ", " +
        camelCase(propertyDetails.Society.toLowerCase().trim()),
    };

    if (propertyid === "new") {
      console.log("Property id while newly added : ", propertyid);
      // console.log("Property: ", property)

      const newProperty = {
        ...property,
        //Stage 2 fields-createhere        
        ownership: "",
        propertyType: "",
        bhk: "",
        numberOfBedrooms: "0",
        numberOfBathrooms: "0",
        furnishing: "",
        additionalRooms: [],
        superArea: "",
        superAreaUnit: "",
        carpetArea: "",
        carpetAreaUnit: "",
        imgURL: [],
        propertyManager: user.uid,
        propertyCoManager: user.uid,
        propertySalesManager: user.uid,
        propertyOwner: user.uid,
        propertyCoOwner: "",
        propertyPOC: "",
        tenantList: [],
        postedBy: "Propdial",
        status: "In-Review",
        onboardingDate: timestamp.fromDate(new Date(onboardingDate)),
      };
      if (!errorFlag) {
        console.log("new property created: ");
        console.log(newProperty);
        await addDocument(newProperty);
        if (addDocumentResponse.error) {
          navigate("/");
        } else {
          setNewProperty(newProperty);
        }
      }
    } else if (propertyid !== "new") {
      const updatedProperty = {
        ...property,

        updatedAt: timestamp.fromDate(new Date()),
        updatedBy: user.uid,
      };

      if (!errorFlag) {
        console.log("updatedProperty: ", updatedProperty)
        await updateDocument(propertyid, updatedProperty);

        if (updateDocumentResponse.error) {
          navigate("/");
        } else {
          if (option === "Save") {
            console.log("option: ", option);
            //Do nothing
            setFormSuccess("Data Saved Successfully");
            // Clear the success message after 3 seconds
            setTimeout(() => {
              setFormSuccess(null);
            }, 3000);
          } else {
            console.log("option: ", option);
            props.setStateFlag("stage2");
          }
        }
      }
    }
  };

  const handleBackSubmit = (e) => {
    // console.log('handleBackSubmit')
    navigate("/dashboard");
    // navigate("/agentproperties", {
    //   state: {
    //     propSearchFilter: "ACTIVE",
    //   },
    // });
  };

  return (
    <>
      <div className="add_property_fields">
        <div className="row row_gap form_full">
          {/* Package */}
          <div className="col-md-6">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Package</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Package === "PMS Premium"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="package_pmspremium"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Package: "PMS Premium",
                              Flag: "",
                              Purpose: ""
                            });
                          }}
                        />
                        <label
                          htmlFor="package_pmspremium"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          PMS Premium
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Package === "PMS Light"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="package_pmslight"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Package: "PMS Light",
                              Flag: "",
                              Purpose: ""
                            });
                          }}
                        />
                        <label
                          htmlFor="package_pmslight"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          PMS Light
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Package === "PMS Sale"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="package_pmssale"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Package: "PMS Sale",
                              Flag: "",
                              Purpose: ""
                            });
                          }}
                        />
                        <label
                          htmlFor="package_pmssale"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          PMS Sale
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Package === "Pre PMS"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="package_prepms"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Package: "Pre PMS",
                              Flag: "",
                              Purpose: ""
                            });
                          }}
                        />
                        <label
                          htmlFor="package_prepms"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Pre PMS
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Package === "Rent Only"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="package_rentonly"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Package: "Rent Only",
                              Flag: "",
                              Purpose: ""
                            });
                          }}
                        />
                        <label
                          htmlFor="package_rentonly"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Rent Only
                        </label>
                      </div>
                    </div>
                    {/* <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Package === "Rent Only"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="package_rentonly"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Package: "Rent Only",
                            });
                          }}

                        />
                        <label
                          htmlFor="package_rentonly"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Rent Only
                        </label>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Property Flags */}
          <div className="col-md-6">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Flags</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    {(propertyDetails.Package.toLowerCase() === "pms premium" || propertyDetails.Package.toLowerCase() === "pms light" || propertyDetails.Package.toLowerCase() === "rent only") && <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Flag === "Available For Rent"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="flag_availableforrent"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Flag: "Available For Rent",
                              Purpose: "Rent"
                            });
                          }}
                        />
                        <label
                          htmlFor="flag_availableforrent"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Available For Rent
                        </label>
                      </div>
                    </div>}
                    {(propertyDetails.Package.toLowerCase() === "pms premium" || propertyDetails.Package.toLowerCase() === "pms light" || propertyDetails.Package.toLowerCase() === "rent only") && <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Flag === "Rented Out"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="flag_rentedout"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Flag: "Rented Out",
                              Purpose: "Rent"
                            });
                          }}
                        />
                        <label
                          htmlFor="flag_rentedout"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Rented Out
                        </label>
                      </div>
                    </div>}
                    {(propertyDetails.Package.toLowerCase() === "pms premium" || propertyDetails.Package.toLowerCase() === "pms sale") && <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Flag === "Available For Sale"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="flag_availableforsale"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Flag: "Available For Sale",
                              Purpose: "Sale"
                            });
                          }}
                        />
                        <label
                          htmlFor="flag_availableforsale"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Available For Sale
                        </label>
                      </div>
                    </div>}
                    {(propertyDetails.Package.toLowerCase() === "pms premium" || propertyDetails.Package.toLowerCase() === "pms sale") && <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Flag === "Sold Out"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="flag_soldout"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Flag: "Sold Out",
                              Purpose: "Sale"
                            });
                          }}
                        />
                        <label
                          htmlFor="flag_soldout"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Sold Out
                        </label>
                      </div>
                    </div>}
                    {(propertyDetails.Package.toLowerCase() === "pms premium") && <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Flag === "Rent and Sale"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="flag_rentsale"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Flag: "Rent and Sale",
                              Purpose: "RentSaleBoth"
                            });
                          }}
                        />
                        <label
                          htmlFor="flag_rentsale"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Rent and Sale
                        </label>
                      </div>
                    </div>}
                    {(propertyDetails.Package.toLowerCase() === "pms premium" || propertyDetails.Package.toLowerCase() === "pms light") && <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Flag === "Rented But Sale"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="flag_rentedbutsale"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Flag: "Rented But Sale",
                              Purpose: "RentSaleBoth"
                            });
                          }}
                        />
                        <label
                          htmlFor="flag_rentedbutsale"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Rented But Sale
                        </label>
                      </div>
                    </div>}
                    {(propertyDetails.Package.toLowerCase() === "pms premium") && <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Flag === "PMS Only"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="flag_pmsonly"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Flag: "PMS Only",
                              Purpose: "PMS"
                            });
                          }}
                        />
                        <label
                          htmlFor="flag_pmsonly"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          PMS Only
                        </label>
                      </div>
                    </div>}
                    {(propertyDetails.Package.toLowerCase() === "pre pms") && <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Flag === "PMS After Rent"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="flag_prepms"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Flag: "PMS After Rent",
                              Purpose: "Rent"
                            });
                          }}
                        />
                        <label htmlFor="flag_prepms">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          PMS After Rent
                        </label>
                      </div>
                    </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Property Source */}
          <div className="col-xl-4 col-lg-6">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Propery Source</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    {<div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Source === "Propdial"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="source_propdial"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Source: "Propdial"
                            });
                          }}
                        />
                        <label
                          htmlFor="source_propdial"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Propdial
                        </label>
                      </div>
                    </div>}
                    {<div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Source === "Agent"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="source_agent"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Source: "Agent"
                            });
                          }}
                        />
                        <label
                          htmlFor="source_agent"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Agent
                        </label>
                      </div>
                    </div>}

                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Category  */}
          <div className="col-xl-4 col-lg-6">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Category</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Category === "Residential"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="category_residential"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Category: "Residential",
                            });
                          }}
                        />
                        <label
                          htmlFor="category_residential"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Residential</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Category === "Commercial"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="category_commercial"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Category: "Commercial",
                            });
                          }}
                        />
                        <label
                          htmlFor="category_commercial"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Commercial</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Category === "Plot"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="category_plot"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Category: "Plot",
                            });
                          }}
                        />
                        <label htmlFor="category_plot">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Plot
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Ownership */}
          <div className="col-xl-4 col-lg-6">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Ownership</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    {<div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.OwnerShip === "Freehold"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="ownership_freehold"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              OwnerShip: "Freehold"
                            });
                          }}
                        />
                        <label
                          htmlFor="ownership_freehold"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Freehold
                        </label>
                      </div>
                    </div>}
                    {<div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.OwnerShip === "Leasehold"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="ownership_leasehold"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              OwnerShip: "Leasehold"
                            });
                          }}
                        />
                        <label
                          htmlFor="ownership_leasehold"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Leasehold
                        </label>
                      </div>
                    </div>}
                    {<div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.OwnerShip === "Co-operative society"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="ownership_co-operative_society"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              OwnerShip: "Co-operative society"
                            });
                          }}
                        />
                        <label
                          htmlFor="ownership_co-operative_society"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Co-operative society
                        </label>
                      </div>
                    </div>}
                    {<div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.OwnerShip === "Power of attorney"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="ownership_power_of_attorney"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              OwnerShip: "Power of attorney"
                            });
                          }}
                        />
                        <label
                          htmlFor="ownership_power_of_attorney"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          Power of attorney
                        </label>
                      </div>
                    </div>}

                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-xl-4 col-lg-6">
            <div className="form_field st-2 label_top">
              <label htmlFor="">
                Purpose</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Purpose === "Rent"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="purpose_rent"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Purpose: "Rent",
                            });
                          }}
                        />
                        <label
                          htmlFor="purpose_rent"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Rent</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Purpose === "Sale"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="purpose_sale"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Purpose: "Sale",
                            });
                          }}

                        />
                        <label
                          htmlFor="purpose_sale"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Sale</h6>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label>Ownership</label>
              <div className="form_field_inner">
                <select>
                  <option selected>Free Hold</option>
                  <option >Lease Hold</option>
                  <option >Power Attorney</option>
                </select>
              </div>
            </div>
          </div> */}
          {/* <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label>Select Owner Name</label>
              <div className="form_field_inner">
                <select>
                  <option value="">Select</option>
                  <option selected>Sanskar solanki</option>
                </select>
              </div>
            </div>
          </div> */}
          {/* <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label>Co Owner Name</label>
              <div className="form_field_inner">
                <select>
                  <option value="">Select</option>
                  <option selected>Naman gaur</option>
                </select>
              </div>
            </div>
          </div> */}
          {/* <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label>Select Employee</label>
              <div className="form_field_inner">
                <select>
                  <option value="">Select</option>
                  <option selected>Khushi shrivastav</option>
                </select>
              </div>
            </div>
          </div> */}
          {/* <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label>Select Supplementary Employee</label>
              <div className="form_field_inner">
                <select>
                  <option value="">Select</option>
                  <option selected>Sugandha sahu</option>
                </select>
              </div>
            </div>
          </div> */}
          {/* <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label>Select Sales Employee</label>
              <div className="form_field_inner">
                <select>
                  <option value="">Select</option>
                  <option selected>Rajesh soni</option>
                </select>
              </div>
            </div>
          </div> */}
          {/* <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label>Property Source</label>
              <div className="form_field_inner">
                <select>
                  <option>Select</option>
                  <option >Propdial</option>
                  <option >Broker</option>
                  <option >ICICI</option>
                  <option >MyGate</option>
                  <option >Housing</option>
                  <option >Google</option>
                  <option >Reference</option>
                  <option selected>Exisiting Owner</option>

                </select>
              </div>
            </div>
          </div> */}
          <div className="col-xl-4 col-lg-6">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Purpose</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          (propertyDetails.Purpose !== "") && (propertyDetails.Flag.toLowerCase() === "available for rent" || propertyDetails.Flag.toLowerCase() === "rented out" || propertyDetails.Flag.toLowerCase() === "rent and sale" || propertyDetails.Flag.toLowerCase() === "rented but sale"
                            || propertyDetails.Flag.toLowerCase() === "pms after rent")
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          disabled
                          id="purpose_rent"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Purpose: propertyDetails.Category === 'Residential' || propertyDetails.Category === 'Plot' ? "Rent" : 'Lease',
                            });
                          }}
                        />
                        <label
                          htmlFor="purpose_rent"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>
                            {propertyDetails.Category === 'Residential' || propertyDetails.Category === 'Plot' ? "Rent" : 'Lease'}
                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          (propertyDetails.Purpose !== "") && (propertyDetails.Flag.toLowerCase() === "available for sale" || propertyDetails.Flag.toLowerCase() === "sold out" || propertyDetails.Flag.toLowerCase() === "rent and sale" || propertyDetails.Flag.toLowerCase() === "rented but sale")
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          disabled
                          id="purpose_sale"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Purpose: "Sale",
                            });
                          }}
                        />
                        <label
                          htmlFor="purpose_sale"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Sale</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          (propertyDetails.Purpose !== "") && (propertyDetails.Flag === "PMS Only")
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          disabled
                          id="purpose_pms"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Purpose: "PMS",
                            });
                          }}
                        />
                        <label
                          htmlFor="purpose_pms"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>PMS</h6>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(propertyDetails.Flag.toLowerCase() === "available for rent" ||
            propertyDetails.Flag.toLowerCase() === "pms after rent" || propertyDetails.Flag.toLowerCase() === "rented out" || propertyDetails.Flag.toLowerCase() === "rent and sale" || propertyDetails.Flag.toLowerCase() === "rented but sale" || propertyDetails.Flag.toLowerCase() === "pms only") && <div className="col-xl-4 col-lg-6">
              <div id="id_demand" className="form_field label_top">
                <label htmlFor="">Demand/Price for Rent</label>
                <div className="form_field_inner price_input">
                  <input
                    id="id_demandpricerent"
                    className="custom-input"
                    required
                    type="text"
                    placeholder="Demand for Rent"
                    maxLength={9}
                    onInput={(e) => {
                      restrictInput(e, 9);
                    }}
                    onChange={(e) => {
                      // const rawValue = e.target.value.replace(/,/g, ""); // Remove existing commas
                      // const formattedValue = formatNumberWithCommas(rawValue);

                      setPropertyDetails({
                        ...propertyDetails,
                        DemandPriceRent: e.target.value.replace(/,/g, ""),
                      });
                    }}
                    value={propertyDetails && formatNumberWithCommas(propertyDetails.DemandPriceRent)}
                  />
                </div>
                <div style={{ fontSize: "smaller" }} className="mt-2 text-capitalize">
                  {convertToWords(propertyDetails.DemandPriceRent)}
                </div>
                {(propertyDetails.DemandPriceRent === 0 || propertyDetails.DemandPriceRent === "") ? <div className="field_error">Please enter demand price</div> : ""}
              </div>
            </div>}

          {(propertyDetails.Flag.toLowerCase() === "available for sale" || propertyDetails.Flag.toLowerCase() === "sold out" || propertyDetails.Flag.toLowerCase() === "rent and sale" || propertyDetails.Flag.toLowerCase() === "rented but sale") && <div className="col-xl-4 col-lg-6">
            <div id="id_demand" className="form_field label_top">
              <label htmlFor="">Demand/Price for Sale</label>
              <div className="form_field_inner price_input">
                <input
                  id="id_demandpricesale"
                  className="custom-input"
                  required
                  type="text"
                  placeholder="Demand for Sale"
                  maxLength={9}
                  onInput={(e) => {
                    restrictInput(e, 9);
                  }}
                  onChange={(e) => {
                    // const rawValue = e.target.value.replace(/,/g, ""); // Remove existing commas
                    // const formattedValue = formatNumberWithCommas(rawValue);

                    setPropertyDetails({
                      ...propertyDetails,
                      DemandPriceSale: e.target.value.replace(/,/g, ""),
                    });
                  }}
                  value={propertyDetails && formatNumberWithCommas(propertyDetails.DemandPriceSale)}
                />
              </div>
              <div style={{ fontSize: "smaller" }} className="mt-2 text-capitalize">
                {convertToWords(propertyDetails.DemandPriceSale)}
              </div>
              {(propertyDetails.DemandPriceSale === 0 || propertyDetails.DemandPriceSale === "") ? <div className="field_error">Please enter demand price</div> : ""}
            </div>
          </div>}

          {propertyDetails && (propertyDetails.Flag.toLowerCase() === "available for rent" || propertyDetails.Flag.toLowerCase() === "rented out" || propertyDetails.Flag.toLowerCase() === "rent and sale" || propertyDetails.Flag.toLowerCase() === "rented but sale" || propertyDetails.Flag.toLowerCase() === "pms only") && (
            <div className="col-xl-4 col-lg-6">
              <div className="form_field st-2 label_top">
                <label htmlFor="">Maintenance Status</label>
                <div className="form_field_inner">
                  <div className="form_field_container">
                    <div className="radio_group">
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.MaintenanceFlag === "Included"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="maintenanceflag_included"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                MaintenanceFlag: "Included",
                              });
                            }}
                          />
                          <label
                            htmlFor="maintenanceflag_included"
                            style={{ paddingTop: "7px" }}
                          >
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>Included</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.MaintenanceFlag === "Extra"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="maintenanceflag_extra"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                MaintenanceFlag: "Extra",
                              });
                            }}
                          />
                          <label
                            htmlFor="maintenanceflag_extra"
                            style={{ paddingTop: "7px" }}
                          >
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>Extra</h6>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {propertyDetails && propertyDetails.Purpose === "Rent" && propertyDetails.MaintenanceFlag === "Extra" &&
            (<div className="col-xl-4 col-lg-6">
              <div className="form_field st-2 new_radio_groups_parent new_single_field n_select_bg label_top">
                <label>Maintenance fees</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    className="custom-input"
                    style={{ width: "30%", paddingRight: "10px" }}
                    type="text"
                    placeholder="Optional"
                    maxLength={6}
                    onInput={(e) => {
                      restrictInput(e, 6);
                    }}

                    onChange={(e) =>
                      setPropertyDetails({
                        ...propertyDetails,
                        MaintenanceCharges: e.target.value.replace(/,/g, ""),
                      })
                    }
                    value={
                      propertyDetails && formatNumberWithCommas(propertyDetails.MaintenanceCharges)
                    }
                  />
                  <div
                    style={{
                      width: "70%",
                      borderLeft: "2px solid #ddd",
                      padding: "5px 0 5px 12px",
                    }}
                  >
                    <div
                      className="radio_group"
                      style={{ gridColumnGap: "5px" }}
                    >
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.MaintenanceChargesFrequency ===
                              "Monthly"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="maintenane_monthly"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                MaintenanceChargesFrequency: "Monthly",
                              });
                            }}
                          />
                          <label
                            htmlFor="maintenane_monthly"
                            style={{
                              padding: "6px 0 10px 22px",
                              height: "30px",
                            }}
                          >
                            <div className="radio_icon">
                              <span
                                className="material-symbols-outlined add"
                                style={{
                                  fontSize: "1.2rem",
                                  transform: "translateX(-3px)",
                                }}
                              >
                                add
                              </span>
                              <span
                                className="material-symbols-outlined check"
                                style={{
                                  fontSize: "1.2rem",
                                  transform: "translateX(-3px)",
                                }}
                              >
                                done
                              </span>
                            </div>
                            <h6 style={{ fontSize: "0.8rem" }}>Monthly</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.MaintenanceChargesFrequency ===
                              "Quarterly"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="maintenance_quarterly"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                MaintenanceChargesFrequency: "Quarterly",
                              });
                            }}
                          />
                          <label
                            htmlFor="maintenance_quarterly"
                            style={{
                              padding: "6px 0 10px 22px",
                              height: "30px",
                              width: "90%",
                            }}
                          >
                            <div className="radio_icon">
                              <span
                                className="material-symbols-outlined add"
                                style={{
                                  fontSize: "1.2rem",
                                  transform: "translateX(-3px)",
                                }}
                              >
                                add
                              </span>
                              <span
                                className="material-symbols-outlined check"
                                style={{
                                  fontSize: "1.2rem",
                                  transform: "translateX(-3px)",
                                }}
                              >
                                done
                              </span>
                            </div>
                            <h6 style={{ fontSize: "0.8rem" }}>Quarterly</h6>
                          </label>
                        </div>
                      </div>

                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.MaintenanceChargesFrequency ===
                              "Yearly"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="maintenance_yearly"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                MaintenanceChargesFrequency: "Yearly",
                              });
                            }}
                          />
                          <label
                            htmlFor="maintenance_yearly"
                            style={{
                              padding: "6px 0 10px 22px",
                              height: "30px",
                              width: "90%",
                            }}
                          >
                            <div className="radio_icon">
                              <span
                                className="material-symbols-outlined add"
                                style={{
                                  fontSize: "1.2rem",
                                  transform: "translateX(-3px)",
                                }}
                              >
                                add
                              </span>
                              <span
                                className="material-symbols-outlined check"
                                style={{
                                  fontSize: "1.2rem",
                                  transform: "translateX(-3px)",
                                }}
                              >
                                done
                              </span>
                            </div>
                            <h6 style={{ fontSize: "0.8rem" }}>Yearly</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.MaintenanceChargesFrequency ===
                              "One Time"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="maintenance_onetime"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                MaintenanceChargesFrequency: "One Time",
                              });
                            }}
                          />
                          <label
                            htmlFor="maintenance_onetime"
                            style={{
                              padding: "6px 0 10px 22px",
                              height: "30px",
                            }}
                          >
                            <div className="radio_icon">
                              <span
                                className="material-symbols-outlined add"
                                style={{
                                  fontSize: "1.2rem",
                                  transform: "translateX(-3px)",
                                }}
                              >
                                add
                              </span>
                              <span
                                className="material-symbols-outlined check"
                                style={{
                                  fontSize: "1.2rem",
                                  transform: "translateX(-3px)",
                                }}
                              >
                                done
                              </span>
                            </div>
                            <h6 style={{ fontSize: "0.8rem" }}>
                              One Time
                            </h6>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{ fontSize: "smaller", borderTop: "1px solid #ddd" }}
                  className="text-capitalize"
                >
                  {convertToWords(propertyDetails.MaintenanceCharges)}
                </div>
              </div>
            </div>
            )}

          {propertyDetails && (propertyDetails.Flag.toLowerCase() === "available for rent" || propertyDetails.Flag.toLowerCase() === "rented out" || propertyDetails.Flag.toLowerCase() === "rent and sale" || propertyDetails.Flag.toLowerCase() === "rented but sale") && (
            <div className="col-xl-4 col-lg-6">
              <div id="id_demand" className="form_field label_top">
                <label htmlFor="">Security Deposit</label>
                <div className="form_field_inner price_input">
                  <input
                    id="id_securitydeposit"
                    className="custom-input"
                    required
                    type="text"
                    placeholder="Security Deposit Amount"
                    maxLength={9}
                    onInput={(e) => {
                      restrictInput(e, 9);
                    }}

                    onChange={(e) => {
                      // const rawValue = e.target.value.replace(/,/g, ""); // Remove existing commas
                      // const formattedValue = formatNumberWithCommas(rawValue);
                      setPropertyDetails({
                        ...propertyDetails,
                        // DemandPrice: e.target.value,
                        SecurityDeposit: e.target.value.replace(/,/g, ""),
                        // DemandPriceInWords: amountToWords(e.target.value)
                      });
                    }}
                    value={propertyDetails && formatNumberWithCommas(propertyDetails.SecurityDeposit)}
                  />
                </div>
                <div style={{ fontSize: "smaller" }} className="mt-2 text-capitalize">
                  {convertToWords(propertyDetails.SecurityDeposit)}
                </div>
                {(propertyDetails.SecurityDeposit === 0 || propertyDetails.SecurityDeposit === "") ? <div className="field_error">Please enter security deposit</div> : ""}
              </div>
            </div>
          )}

          {/* <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label>Package</label>
              <div className="form_field_inner">
                <select>
                  <option > Please Select </option>
                  <option selected="selected">PMS Premium</option>
                  <option>PMS Light</option>
                  <option>PMS Sale</option>
                  <option>Pre PMS</option>
                  <option>Rent Only</option>
                  <option>NA</option>
                  <option>InActive</option>
                  <option>Broker</option>
                </select>
              </div>
            </div>
          </div> */}

          {/* <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label>Select Property Flag</label>
              <div className="form_field_inner">
                <select>
                  <option value="">Select Property Flags</option>
                  <option>For Rent Sale</option>
                  <option>For Sale</option>
                  <option>In Maintenance</option>
                  <option>NA</option>
                  <option>On Notice</option>
                  <option>PMS Only</option>
                  <option>Rented But Sale</option>
                  <option>Rented Out</option>
                  <option>Sold Out</option>
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
                      background: "#efefef",
                      border: "none",
                      borderBottom: "none",
                      paddingLeft: "10px",
                      textTransform: "capitalize",
                    }),
                  }}
                />
              </div>
            </div>
          </div>
          {/* Region */}
          <div className="col-xl-4 col-lg-6">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Region</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    {<div className="radio_group_single">
                      <div
                        className={
                          // propertyDetails.Region === "North India"
                          //   ? "custom_radio_button radiochecked"
                          //   : "custom_radio_button"
                          state && (state.label === "Delhi" ||
                            state.label === "Chandigarh" ||
                            state.label === "Haryana" ||
                            state.label === "Himachal Pradesh" ||
                            state.label === "Jammu and Kashmir" ||
                            state.label === "Punjab" ||
                            state.label === "Uttar Pradesh" ||
                            state.label === "Uttarakhand")
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"

                        }
                      >
                        <input
                          type="checkbox"
                          id="region_northindia"
                          disabled
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Region: "North India",
                            });
                          }}
                        />
                        <label
                          htmlFor="region_northindia"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          North India
                        </label>
                      </div>
                    </div>}
                    <div className="radio_group_single">
                      <div
                        className={
                          state && (state.label === "Andhra Pradesh" ||
                            state.label === "Andaman & Nicobar Islands" ||
                            state.label === "Karnataka" ||
                            state.label === "Kerala" ||
                            state.label === "Lakshadweep" ||
                            state.label === "Tamil Nadu" ||
                            state.label === "Telangana")
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="region_southindia"
                          disabled
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Region: "South India",
                            });
                          }}
                        />
                        <label
                          htmlFor="region_southindia"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          South India
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          state && (state.label === "Arunachal Pradesh" ||
                            state.label === "Assam" ||
                            state.label === "Bihar" ||
                            state.label === "Chhattisgarh" ||
                            state.label === "Jharkhand" ||
                            state.label === "Manipur" ||
                            state.label === "Meghalaya" ||
                            state.label === "Mizoram" ||
                            state.label === "Nagaland" ||
                            state.label === "Odisha" ||
                            state.label === "Sikkim" ||
                            state.label === "Tripura")
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="region_eastindia"
                          disabled
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Region: "East India",
                            });
                          }}
                        />
                        <label
                          htmlFor="region_eastindia"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          East India
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          state && (state.label === "Dadra & Nagar Haveli" ||
                            state.label === "Daman & Diu" ||
                            state.label === "Goa" ||
                            state.label === "Gujarat" ||
                            state.label === "Madhya Pradesh" ||
                            state.label === "Maharashtra" ||
                            state.label === "Puducherry" ||
                            state.label === "Rajasthan" ||
                            state.label === "Sikkim")
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="region_westindia"
                          disabled
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Region: "West India",
                            });
                          }}
                        />
                        <label
                          htmlFor="region_westindia"
                          style={{ paddingTop: "7px" }}
                        >
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          West India
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label htmlFor="">City</label>

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
                      background: "#efefef",
                      border: "none",
                      borderBottom: "none",
                      paddingLeft: "10px",
                      textTransform: "capitalize",
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
                  onChange={(e) => {
                    handleLocalityChange({
                      label: e.label,
                      value: e.value
                    }, society)
                  }}
                  options={localityOptions.current}
                  value={locality}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      outline: "none",
                      background: "#efefef",
                      border: "none",
                      borderBottom: "none",
                      paddingLeft: "10px",
                      textTransform: "capitalize",
                    }),
                  }}
                />
              </div>
            </div>
          </div>

          {/* <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label htmlFor="">Locality</label>
              <div className="form_field_inner">
                <SearchBarAutoComplete
                  enabled={
                    propertyDetails && propertyDetails.City === ""
                      ? true
                      : false
                  }
                  dataList={distinctValuesLocality}
                  placeholderText={"Search or add new locality"}
                  getQuery={setSearchedLocality}
                  queryValue={propertyDetails ? propertyDetails.Locality : ""}
                  setRedirectFlag={setRedirectFlag}
                ></SearchBarAutoComplete>
              </div>
            </div>
          </div> */}
          <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label htmlFor="">Society</label>

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
                      background: "#efefef",
                      border: "none",
                      borderBottom: "none",
                      paddingLeft: "10px",
                      textTransform: "capitalize",
                    }),
                  }}
                />
              </div>
            </div>
          </div>
          {/* <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label htmlFor="">Society</label>
              <div className="form_field_inner">
                <SearchBarAutoComplete
                  enabled={
                    propertyDetails && propertyDetails.Locality === ""
                      ? true
                      : false
                  }
                  dataList={distinctValuesSociety}
                  placeholderText={"Search or add new society"}
                  getQuery={setSearchedSociety}
                  queryValue={propertyDetails ? propertyDetails.Society : ""}
                  setRedirectFlag={setRedirectFlag}
                ></SearchBarAutoComplete>
              </div>
            </div>
          </div> */}
          <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              {propertyDetails && (propertyDetails.Category === 'Residential' || propertyDetails.Category === 'Commercial') ? <label htmlFor="">Unit Number</label> : <label htmlFor="">Plot Number</label>}
              <div className="form_field_inner">
                <input
                  type="text"
                  placeholder="Enter House/Flat/Shop no"
                  maxLength={100}
                  onChange={(e) =>
                    setPropertyDetails({
                      ...propertyDetails,
                      UnitNumber: e.target.value,
                    })
                  }
                  value={propertyDetails && propertyDetails.UnitNumber}
                />
                <div className="field_icon"></div>
              </div>
              {(propertyDetails.UnitNumber === "" && propertyDetails.Category === "Plot") ? <div className="field_error">Please enter Plot number</div> : (propertyDetails.UnitNumber === "") ? <div className="field_error">Please enter Unit number</div> : ""}
            </div>
          </div>

          <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label htmlFor="">Pincode Number</label>
              <div className="form_field_inner">
                <input
                  type="text" // Use type="text" to control length
                  placeholder="Enter here"
                  maxLength={6} // Limits input to 6 characters
                  onInput={(e) => {
                    restrictInput(e, 6);
                  }}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    // Check if the input is numeric and has a maximum length of 6
                    if (/^\d{0,6}$/.test(value)) {
                      setPropertyDetails({
                        ...propertyDetails,
                        Pincode: e.target.value.trim(),
                      });
                    }
                  }}
                  value={propertyDetails && propertyDetails.Pincode}
                />
                <div className="field_icon"></div>
              </div>
              {/* <div className="field_error">Pincode is required field</div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="bottom_fixed_button">
        {formError && <p className="error_new">{formError}</p>}

        {formSuccess && <p className="success_new">{formSuccess}</p>}
        <div className="next_btn_back">
          <button
            className="theme_btn no_icon btn_border full_width"
            onClick={handleBackSubmit}
          >
            {"<< Back"}
          </button>
          {propertyid !== "new" && (
            <button
              className="theme_btn no_icon btn_fill full_width"
              onClick={(e) => handleSubmit(e, "Save")}
            >
              Save
            </button>
          )}
          <button
            className="theme_btn no_icon btn_border full_width"
            onClick={(e) => handleSubmit(e, "Next")}
          >
            {"Next >>"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Stage1;
