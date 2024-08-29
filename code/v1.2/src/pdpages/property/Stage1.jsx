import React from "react";
import Select from "react-select";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useCommon } from "../../hooks/useCommon";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";

import { timestamp } from "../../firebase/config";
import SearchBarAutoComplete from "../../pages/search/SearchBarAutoComplete";

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

//Convert Amount to Words - old code Starts

// const units = [
//   "",
//   "one",
//   "two",
//   "three",
//   "four",
//   "five",
//   "six",
//   "seven",
//   "eight",
//   "nine",
// ];
// const teens = [
//   "ten",
//   "eleven",
//   "twelve",
//   "thirteen",
//   "fourteen",
//   "fifteen",
//   "sixteen",
//   "seventeen",
//   "eighteen",
//   "nineteen",
// ];
// const tens = [
//   "",
//   "",
//   "twenty",
//   "thirty",
//   "forty",
//   "fifty",
//   "sixty",
//   "seventy",
//   "eighty",
//   "ninety",
// ];

// function convertToWords(number) {
//   if (number === 0) {
//     return "zero";
//   }

//   // Split the number into groups of three digits
//   const chunks = [];
//   while (number > 0) {
//     chunks.push(number % 1000);
//     number = Math.floor(number / 1000);
//   }

//   // Convert each chunk to words
//   const chunkWords = chunks.map((chunk, index) => {
//     if (chunk === 0) {
//       return "";
//     }

//     const chunkText = chunkToWords(chunk);
//     const suffix = index === 0 ? "" : ` ${indexToPlace(index)}`;
//     return `${chunkText}${suffix}`;
//   });

//   // Combine the chunk words
//   return chunkWords.reverse().join(" ").trim();
// }

// function chunkToWords(chunk) {
//   const hundredDigit = Math.floor(chunk / 100);
//   const remainder = chunk % 100;

//   let result = "";
//   if (hundredDigit > 0) {
//     result += `${units[hundredDigit]} hundred`;
//   }

//   if (remainder > 0) {
//     if (result !== "") {
//       result += " and ";
//     }

//     if (remainder < 10) {
//       result += units[remainder];
//     } else if (remainder < 20) {
//       result += teens[remainder - 10];
//     } else {
//       const tenDigit = Math.floor(remainder / 10);
//       const oneDigit = remainder % 10;

//       result += tens[tenDigit];
//       if (oneDigit > 0) {
//         result += `-${units[oneDigit]}`;
//       }
//     }
//   }

//   return result;
// }

// function indexToPlace(index) {
//   const places = [
//     "",
//     "thousand",
//     "million",
//     "billion",
//     "trillion",
//     "quadrillion",
//     "quintillion",
//   ];
//   return places[index];
// }

// Example usage:
// const amount = 12000;
// const amountInWords = convertToWords(amount);
// console.log(`${amount} in words: ${amountInWords}`);

//Convert Amount to Words - Ends

// function formatAmount(amount) {
//   // Example: Add dashes
//   return amount.toLocaleString('en-US');
// }
// function formatAmount(event) {
//   // Example: Add dashes
//   let inputValue = event.target.value
//   return inputValue.toLocaleString('en-US');
// }

//Convert Amount to Words - old code End

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

  return result;
}

function indexToPlace(index) {
  return places[index] || "";
}

// Example usage:
const amount = 1200000;
const amountInWords = convertToWords(amount);
console.log(`${amount} in words: ${amountInWords}`);
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

function camelCase(inputStr) {
  let str = inputStr.toLowerCase();
  return (
    str
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

  const { document: propertyDocument, error: propertyerror } = useDocument(
    "properties",
    propertyid
  );
  function setRedirectFlag(flag, key) {}
  const { user } = useAuthContext();

  let statesOptions = useRef([]);
  let statesOptionsSorted = useRef([]);
  let citiesOptions = useRef([]);
  let citiesOptionsSorted = useRef([]);
  var distinctCityList = [];
  var distinctLocalityList = [];
  var distinctSocietyList = [];
  const [state, setState] = useState();
  const [city, setCity] = useState({
    label: "Select City",
    value: "Select City",
  });
  const [distinctValuesLocality, setdistinctValuesLocality] = useState([]);
  const [distinctValuesSociety, setdistinctValuesSociety] = useState([]);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  // const { amountToWords, response: amountToWordsResponse } = useCommon();
  // const { camelCase } = useCommon();
  // const { formatAmount, response: formatAmountResponse } = useCommon();
  // const { formatPhoneNumber } = useCommon();
  const [distinctValuesCity, setdistinctValuesCity] = useState([]);
  const [onboardingDate, setOnboardingDate] = useState(new Date());
  const [newProperty, setNewProperty] = useState(null);

  const { addDocument, response: addDocumentResponse } =
    useFirestore("properties");
  const { updateDocument, response: updateDocumentResponse } =
    useFirestore("properties");

  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const navigate = useNavigate();

  const { documents: dbpropertiesdocuments, error: propertieserror } =
    useCollection("properties", ["postedBy", "==", "Propdial"]);

  const { documents: dbstatesdocuments, error: dbstateserror } = useCollection(
    "m_states",
    ["country", "==", "INDIA"]
  );

  const { documents: dbcitiesdocuments, error: dbcitieserror } = useCollection(
    "m_cities",
    ["status", "==", "active"]
  );

  const [propertyDetails, setPropertyDetails] = useState({
    // All select type
    Region: "",
    Package: "",
    Flag: "",
    Category: "",
    UnitNumber: "",
    DemandPrice: "",
    MaintenanceCharges: "",
    MaintenanceChargesFrequency: "",
    Purpose: "",
    Country: "",
    State: "",
    City: "",
    Locality: "",
    Society: "",
    PropertyName: "",
  });

  //Not required Distinct list, Just fetch Cities from m_cities collection as per the city status as active
  dbcitiesdocuments &&
    dbcitiesdocuments.map((doc) => {
      // console.log("dbcitiesdocuments: ", dbcitiesdocuments)
      if (!distinctCityList.find((e) => e.city === doc.city)) {
        distinctCityList.push({
          state: doc.state,
          city: doc.city,
        });
      }
    });

  // dbpropertiesdocuments &&
  //   dbpropertiesdocuments.map((doc) => {
  //     if (!distinctCityList.find((e) => e.city === doc.city)) {
  //       distinctCityList.push({
  //         state: doc.state,
  //         city: doc.city,
  //       });
  //     }
  //   });

  dbpropertiesdocuments &&
    dbpropertiesdocuments.map((doc) => {
      if (!distinctLocalityList.find((e) => e.locality === doc.locality)) {
        distinctLocalityList.push({
          city: doc.city,
          locality: doc.locality,
        });
      }
    });
  // console.log('distinctLocalityList: ', distinctLocalityList)

  dbpropertiesdocuments &&
    dbpropertiesdocuments.map((doc) => {
      if (!distinctSocietyList.find((e) => e.society === doc.society)) {
        distinctSocietyList.push({
          locality: doc.locality,
          society: doc.society,
        });
      }
    });

  useEffect(() => {
    statesOptions.current =
      dbstatesdocuments &&
      dbstatesdocuments.map((stateData) => ({
        label: stateData.state,
        value: stateData.state,
      }));
    // // console.log('statesOptions:', statesOptions)
    statesOptionsSorted.current =
      statesOptions.current &&
      statesOptions.current.sort((a, b) => a.label.localeCompare(b.label));

    statesOptionsSorted.current &&
      statesOptionsSorted.current.unshift({
        label: "Select State",
        value: "Select State",
      });

    if (propertyDocument && propertyDocument.state) {
      setState({
        label: propertyDocument.state,
        value: propertyDocument.state,
      });
      handleStateChange({
        label: propertyDocument.state,
        value: propertyDocument.state,
      });
    } else {
      setState({ label: "Select State", value: "Select State" });
      handleStateChange({
        label: "Select State",
        value: "Select State",
      });
    }

    if (propertyDocument && propertyDocument.city) {
      setCity({
        label: propertyDocument.city,
        value: propertyDocument.city,
      });
      handleCityChange({
        label: propertyDocument.city,
        value: propertyDocument.city,
      });
    } else {
      setCity({ label: "Select City", value: "Select City" });
      handleCityChange({
        label: "Select City",
        value: "Select City",
      });
    }

    if (propertyDocument) {
      setPropertyDetails({
        // All select type
        Region: propertyDocument.region,
        Package: propertyDocument.package,
        Flag: propertyDocument.flag,
        Category: propertyDocument.category
          ? propertyDocument.category
          : "Residential",
        UnitNumber: propertyDocument.unitNumber
          ? propertyDocument.unitNumber
          : "",
        DemandPrice: propertyDocument.demandPrice
          ? propertyDocument.demandPrice
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
        PropertyName:
          propertyDocument.unitNumber +
          ", " +
          camelCase(propertyDocument.society.toLowerCase().trim()),
      });
    }
  }, [dbstatesdocuments, dbpropertiesdocuments, propertyDocument]);

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

  // const handleStateChange = async (option) => {
  //   setState(option);
  //   let statename = option.label;
  //   // console.log('state name:  ', statename)
  //   let cityListStateWise = [];
  //   cityListStateWise = distinctCityList.filter((e) => e.state === statename);
  //   // console.log('cityListStateWise:', cityListStateWise)

  //   const dataList =
  //     cityListStateWise && cityListStateWise.map((doc) => doc.city);
  //   // distinctValuesCity = [...new Set(dataCity)];
  //   setdistinctValuesCity([...new Set(dataList)]);
  //   // console.log('distinctValuesCity:', distinctValuesCity)
  // };

  const handleStateChange = async (option) => {
    setState(option);
    let statename = option.label;
    // console.log('state name:  ', statename)
    let cityListStateWise = [];
    cityListStateWise = distinctCityList.filter((e) => e.state === statename);
    // console.log('cityListStateWise:', cityListStateWise)

    const dataList =
      cityListStateWise && cityListStateWise.map((doc) => doc.city);
    // distinctValuesCity = [...new Set(dataCity)];
    setdistinctValuesCity([...new Set(dataList)]);
    // console.log('distinctValuesCity:', distinctValuesCity)

    //City Dropdown List as per state
    citiesOptions.current =
      cityListStateWise &&
      cityListStateWise.map((cityData) => ({
        label: cityData.city,
        value: cityData.city,
      }));
    // // console.log('statesOptions:', statesOptions)
    // citiesOptionsSorted = null;

    citiesOptionsSorted.current =
      citiesOptions.current &&
      citiesOptions.current.sort((a, b) => a.label.localeCompare(b.label));

    // citiesOptionsSorted.current &&
    //   citiesOptionsSorted.current.unshift({
    //     label: "Select City",
    //     value: "Select City",
    //   })
    setCity({ label: "Select City", value: "Select City" });
  };

  const handleCityChange = async (option) => {
    setCity(option);

    // console.log('City option: ', option)

    setSearchedCity(option.value);
  };

  function setSearchedCity(cityname) {
    // console.log('cityname', cityname);
    setPropertyDetails({
      ...propertyDetails,
      City: cityname,
    });

    let localityListStateWise = [];
    localityListStateWise = distinctLocalityList.filter(
      (e) => e.city === cityname
    );
    // console.log('localityListStateWise:', localityListStateWise)

    const dataList =
      localityListStateWise && localityListStateWise.map((doc) => doc.locality);
    setdistinctValuesLocality([...new Set(dataList)]);

    console.log("Locality dataList: ", dataList);
  }

  function setSearchedLocality(localityname) {
    // console.log('localityname', localityname);
    setPropertyDetails({
      ...propertyDetails,
      Locality: localityname,
    });
    let societyListStateWise = [];
    societyListStateWise = distinctSocietyList.filter(
      (e) => e.locality === localityname
    );
    // console.log("societyListStateWise:", societyListStateWise);

    const dataList =
      societyListStateWise && societyListStateWise.map((doc) => doc.society);
    setdistinctValuesSociety([...new Set(dataList)]);
  }
  function setSearchedSociety(societyname) {
    // console.log('societyname', societyname);
    setPropertyDetails({
      ...propertyDetails,
      Society: societyname,
    });
  }

  // const cloneImage = async (sourcePath, destinationPath) => {
  //   try {
  //     // Create a reference to the source image in Firebase Storage
  //     const sourceRef = projectStorage.refFromURL(sourcePath);

  //     // Get the download URL of the source image
  //     const downloadURL = await sourceRef.getDownloadURL();

  //     // Create a reference to the destination image in Firebase Storage
  //     const destinationRef = projectStorage.ref().child(destinationPath);

  //     // Copy the image from the source path to the destination path
  //     await destinationRef.putString(downloadURL, 'data_url');

  //     console.log('Image cloned successfully!');
  //   } catch (error) {
  //     console.error('Error cloning image:', error.message);
  //   }
  // }
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

        //add a default property image into storage for newly created propertyid
        // const sourceImagePath = 'gs://your-project-id.appspot.com/images/source.jpg';
        // const sourceImagePath = 'gs://' + projectID + '/masterData/icons/icon_propertyDefault.jpg'
        // console.log('sourceImagePath:', sourceImagePath)
        // const destinationImagePath = 'properties/' + addDocumentResponse.document.id + '/Images/' + timestamp.fromDate(new Date()) + ".png";
        // console.log('destinationImagePath:', destinationImagePath)
        // cloneImage(sourceImagePath, destinationImagePath);
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

    // if (propertyDetails.Purpose === "") {
    //   if (errorMsg === "Please select ") errorMsg = errorMsg + "Purpose";
    //   else errorMsg = errorMsg + ", Purpose";
    //   errorFlag = true;
    // }
    // if (propertyDetails.DemandPrice === "" || propertyDetails.DemandPrice === "0") {
    //   if (errorMsg === "Please select ") errorMsg = "Please Enter Demand Price";
    //   else errorMsg = errorMsg + ", Demand Price";
    //   errorFlag = true;
    // }

    // if (propertyDetails.MaintenanceCharges === "") {
    //   propertyDetails.MaintenanceChargesFrequency = "NA"
    // } else {
    //   if (
    //     (propertyDetails.MaintenanceCharges !== "") &&
    //     propertyDetails.MaintenanceChargesFrequency === ""
    //   ) {
    //     if (errorMsg === "Please select ")
    //       errorMsg = errorMsg + "Frequency";
    //     else errorMsg = errorMsg + ", Frequency";
    //     errorFlag = true;
    //   }
    //   else {
    //     if (propertyDetails.MaintenanceCharges !== "" &&
    //       propertyDetails.MaintenanceChargesFrequency === "NA") {
    //       if (errorMsg === "Please select ")
    //         errorMsg = errorMsg + "Frequency";
    //       else errorMsg = errorMsg + ", Frequency";
    //       errorFlag = true;
    //     }
    //   }
    // }

    // console.log('state:', state)
    // if (state === "" || state === undefined || state === "Select State") {
    //   if (errorMsg === "Please select ") errorMsg = errorMsg + "State";
    //   else errorMsg = errorMsg + ", State";
    //   errorFlag = true;
    // }

    // if (propertyDetails.City === "") {
    //   if (errorMsg === "Please select ") errorMsg = errorMsg + "City";
    //   else errorMsg = errorMsg + ", City";
    //   errorFlag = true;
    // }
    // if (propertyDetails.Locality === "") {
    //   if (errorMsg === "Please select ") errorMsg = errorMsg + "Locality";
    //   else errorMsg = errorMsg + ", Locality";
    //   errorFlag = true;
    // }
    // if (propertyDetails.Society === "") {
    //   if (errorMsg === "Please select ") errorMsg = errorMsg + "Society";
    //   else errorMsg = errorMsg + ", Society";

    //   errorFlag = true;
    // }

    if (errorFlag)
       setFormError(errorMsg);
      
    else setFormError("");

    errorFlag = false;

    // console.log('propertyDetails.City:', propertyDetails.City)

    const property = {
      region: propertyDetails.Region,
      package: propertyDetails.Package,
      flag: propertyDetails.Flag,
      category: propertyDetails.Category
        ? propertyDetails.Category
        : "Residential",
      unitNumber: propertyDetails.UnitNumber ? propertyDetails.UnitNumber : "",
      purpose: propertyDetails.Purpose ? propertyDetails.Purpose : "",
      demandprice: propertyDetails.DemandPrice
        ? propertyDetails.DemandPrice
        : "",
      maintenanceflag: propertyDetails.MaintenanceFlag
        ? propertyDetails.MaintenanceFlag
        : "Excluded",
      maintenancecharges: propertyDetails.MaintenanceCharges
        ? propertyDetails.MaintenanceCharges
        : "",
      maintenancechargesfrequency: propertyDetails.MaintenanceChargesFrequency
        ? propertyDetails.MaintenanceChargesFrequency
        : "NA",
      state: state.label,
      city: city.label,
      // city: camelCase(propertyDetails.City.toLowerCase().trim()),
      locality: camelCase(propertyDetails.Locality.toLowerCase().trim()),
      society: camelCase(propertyDetails.Society.toLowerCase().trim()),
      pincode: propertyDetails.Pincode ? propertyDetails.Pincode : "",
      propertyName:
        propertyDetails.UnitNumber +
        ", " +
        camelCase(propertyDetails.Society.toLowerCase().trim()),
    };

    if (propertyid === "new") {
      console.log("Property id while newly added : ", propertyid);
      // console.log("Property: ", property)

      const newProperty = {
        ...property,
        //Stage 2 fields-createhere
        source: "",
        ownership: "",
        flag: "",
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
          {/* Region */}
          <div className="col-md-12">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Region</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Region === "North India"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="region_northindia"
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
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Region === "South India"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="region_southindia"
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
                          propertyDetails.Region === "East India"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="region_eastindia"
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
                          propertyDetails.Region === "West India"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="region_westindia"
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
                    <div className="radio_group_single">
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
                    </div>
                    <div className="radio_group_single">
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
                    </div>
                    <div className="radio_group_single">
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
                    </div>
                    <div className="radio_group_single">
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
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Flag === "Rent or Sale"
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
                              Flag: "Rent or Sale",
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
                          Rent And Sale
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
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
                    </div>
                    <div className="radio_group_single">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Purpose === "PMS"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
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

          <div className="col-xl-4 col-lg-6">
            <div id="id_demand" className="form_field label_top">
              <label htmlFor="">Demand/Price</label>
              <div className="form_field_inner price_input">
                <input
                  id="id_demandprice"
                  className="custom-input"
                  required
                  type="text"
                  placeholder="Demand Amount for Rent or Sale"
                  maxLength={9}
                  onInput={(e) => {
                    restrictInput(e, 9);
                  }}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, ""); // Remove existing commas
                    const formattedValue = formatNumberWithCommas(rawValue);

                    setPropertyDetails({
                      ...propertyDetails,
                      DemandPrice: formattedValue,
                    });
                  }}
                  value={propertyDetails && propertyDetails.DemandPrice}
                />
              </div>
              <div style={{ fontSize: "smaller" }} className="mt-2">
                {convertToWords(propertyDetails.DemandPrice)}
              </div>
            </div>
          </div>

          {propertyDetails && propertyDetails.Purpose === "Rent" && (
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

          {propertyDetails &&
            propertyDetails.Purpose === "Rent" &&
            propertyDetails.MaintenanceFlag === "Extra" && (
              <div className="col-xl-4 col-lg-6">
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
                          MaintenanceCharges: e.target.value.trim(),
                        })
                      }
                      value={
                        propertyDetails && propertyDetails.MaintenanceCharges
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
                              "Half Yearly"
                                ? "custom_radio_button radiochecked"
                                : "custom_radio_button"
                            }
                          >
                            <input
                              type="checkbox"
                              id="maintenance_halfyearly"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  MaintenanceChargesFrequency: "Half Yearly",
                                });
                              }}
                            />
                            <label
                              htmlFor="maintenance_halfyearly"
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
                                Half Yearly
                              </h6>
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
                      </div>
                    </div>
                  </div>
                  <div
                    style={{ fontSize: "smaller", borderTop: "1px solid #ddd" }}
                  >
                    {convertToWords(propertyDetails.MaintenanceCharges)}
                  </div>
                </div>
              </div>
            )}

          {propertyDetails && propertyDetails.Purpose === "Rent" && (
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
                      setPropertyDetails({
                        ...propertyDetails,
                        // DemandPrice: e.target.value,
                        SecurityDeposit: e.target.value.trim(),
                        // DemandPriceInWords: amountToWords(e.target.value)
                      });
                    }}
                    value={propertyDetails && propertyDetails.SecurityDeposit}
                  />
                </div>
                <div style={{ fontSize: "smaller" }} className="mt-2">
                  {convertToWords(propertyDetails.SecurityDeposit)}
                </div>
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
                  onChange={handleStateChange}
                  options={statesOptionsSorted.current}
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

          <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label htmlFor="">City</label>

              <div className="form_field_inner">
                <Select
                  className=""
                  onChange={handleCityChange}
                  options={citiesOptionsSorted.current}
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
          </div>
          <div className="col-xl-4 col-lg-6">
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
          </div>
          <div className="col-xl-4 col-lg-6">
            <div className="form_field label_top">
              <label htmlFor="">Unit Number</label>
              <div className="form_field_inner">
                <input
                  type="text"
                  placeholder="Enter House/Flat/Shop no"
                  maxLength={100}
                  onChange={(e) =>
                    setPropertyDetails({
                      ...propertyDetails,
                      UnitNumber: e.target.value.trim(),
                    })
                  }
                  value={propertyDetails && propertyDetails.UnitNumber}
                />
                <div className="field_icon"></div>
              </div>
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
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    // Check if the input is numeric and has a maximum length of 6
                    if (/^\d{0,6}$/.test(value)) {
                      setPropertyDetails({
                        ...propertyDetails,
                        Pincode: value,
                      });
                    }
                  }}
                  value={propertyDetails && propertyDetails.Pincode}
                />
                <div className="field_icon"></div>
              </div>
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
