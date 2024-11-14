import React from "react";
import Select from "react-select";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
// import { useCommon } from "../../hooks/useCommon";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { projectFirestore, timestamp } from "../../firebase/config";
import SearchBarAutoComplete from "../../pages/search/SearchBarAutoComplete";
import Back from "../back/Back";
import InactiveUserCard from "../../components/InactiveUserCard";
import { TwoWheeler } from "@mui/icons-material";
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

const CreateProperty = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const navigate = useNavigate();

  function setRedirectFlag(flag, key) { }
  const { user } = useAuthContext();


  // const { amountToWords, response: amountToWordsResponse } = useCommon();
  // const { camelCase } = useCommon();
  // const { formatAmount, response: formatAmountResponse } = useCommon();
  // const { formatPhoneNumber } = useCommon();

  const { documents: dbpropertiesdocuments, error: propertieserror } =
    useCollection("properties-propdial");
  // console.log("dbpropertiesdocuments: ", dbpropertiesdocuments)

  const {
    addDocument: addNewPropertyDocument,
    response: addNewPropertyDocumentResponse,
  } = useFirestore("properties-propdial");

  const {
    addDocument: addProperyUsersDocument,
    response: addPropertyUsersDocumentResponse,
  } = useFirestore("propertyusers");

  //Master Data Loading Initialisation - Start
  // const { documents: masterCountry, error: masterCountryerror } =
  //   useCollection("m_countries", "", ["country", "asc"]);

  const { documents: masterState, error: masterStateError } = useCollection(
    "m_states", "", ["state", "asc"]
  );

  // const { documents: masterCity, error: masterCityError } = useCollection(
  //   "m_cities", "", ["city", "asc"]
  // );
  // const { documents: masterLocality, error: masterLocalityError } = useCollection(
  //   "m_localities", "", ["locality", "asc"]
  // );
  // const { documents: masterSociety, error: masterSocietyError } =
  //   useCollection("m_societies", "", ["society", "asc"]);

  // const [country, setCountry] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [locality, setLocality] = useState();
  const [society, setSociety] = useState();

  let countryOptions = useRef([]);
  let stateOptions = useRef([]);
  let cityOptions = useRef([]);
  let localityOptions = useRef([]);
  let societyOptions = useRef([]);

  stateOptions.current = masterState && masterState.map((stateData) => ({
    label: stateData.state,
    value: stateData.id,
  }));

  //Master Data Loading Initialisation - End

  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const [onboardingDate, setOnboardingDate] = useState(new Date());
  const [newProperty, setNewProperty] = useState(null);

  const [propertyDetails, setPropertyDetails] = useState({
    // All select type
    Package: "PMS Premium",
    Flag: "",
    Category: "Residential",
    UnitNumber: "",
    DemandPriceRent: "",
    DemandPriceSale: "",
    MaintenanceCharges: "",
    MaintenanceChargesFrequency: "",
    SecurityDeposit: "",
    Purpose: "",
    PropertyType: "",
    Bhk: "",
    FloorNo: "",
    Country: "",
    Region: "",
    State: "",
    City: "",
    Locality: "",
    Society: "",
    Pincode: "",
    PropertyName: "",
    FullAddress: ""
  });

  const setPurposeByFlag = () => {
    console.log("Flags: ", propertyDetails.Flag)
  };




  // useEffect(() => {
  //   // console.log('in useeffect')
  //   // Master data: State Populate
  //   if (masterState) {
  //     stateOptions.current = masterState && masterState.map((stateData) => ({
  //       label: stateData.state,
  //       value: stateData.id,
  //     }));

  //     // console.log("stateOptions: ", stateOptions.current)

  //   }
  // }, [masterState]);


  // Populate Master Data - Start
  //State select onchange
  const handleStateChange = async (option) => {
    setState(option);
    console.log('state.id:', option.value)
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

  function setSearchedSociety(societyname) {
    // console.log('societyname', societyname);
    setPropertyDetails({
      ...propertyDetails,
      Society: societyname,
    });
  }

  const handleSubmit = async (e, option) => {
    // console.log("In handleSubmit");
    e.preventDefault();
    // console.log('e: ', e)
    // console.log('option: ', option)
    // console.log("propertyDetails.Purpose: ", propertyDetails.Purpose)

    if (!(user && (user.role === "admin" || user.role === "superAdmin"))) {
      navigate("/");
    }

    setFormError(null);
    setFormSuccess(null);

    var btnProperties = document.getElementById("btn_create").innerHTML;
    // console.log("btnName: ", btnProperties);
    if (btnProperties === "Properties") {
      // console.log("btnName: ", btnProperties)
      navigate("/allproperties/all");
    } else {
      let errorFlag = false;
      let errorMsg = "Error: Please select ";

      if (propertyDetails.UnitNumber === "" ||
        propertyDetails.UnitNumber === "undefined" ||
        propertyDetails.UnitNumber === null
      ) {
        if (errorMsg === "Error: Please select ")
          errorMsg = errorMsg + "Unit Number";
        else errorMsg = errorMsg + ", Unit Number";
        errorFlag = true;

      }

      if (propertyDetails.Flag === "" || propertyDetails.Flag === "undefined" || propertyDetails.Flag === null) {
        if (errorMsg === "Error: Please select ")
          errorMsg = errorMsg + "Flag";
        else errorMsg = errorMsg + ", Flag";
        errorFlag = true;

      }

      if (
        propertyDetails.Purpose === "" ||
        propertyDetails.Purpose === "undefined" ||
        propertyDetails.Purpose === null
      ) {
        if (errorMsg === "Error: Please select ")
          errorMsg = errorMsg + "Purpose";
        else errorMsg = errorMsg + ", Purpose";
        errorFlag = true;
      } else {
        if (
          (propertyDetails.Purpose === "Rent" || propertyDetails.Purpose === "RentSaleBoth") &&
          (propertyDetails.MaintenanceFlag === "" ||
            propertyDetails.MaintenanceFlag === "undefined" ||
            propertyDetails.MaintenanceFlag == null)
        ) {
          if (errorMsg === "Error: Please select ")
            errorMsg = errorMsg + "Maintenance Status";
          else errorMsg = errorMsg + ", Maintenance Status";
          errorFlag = true;
        }
      }

      if (propertyDetails.PropertyType === "" || propertyDetails.PropertyType === "Select Property Type") {
        if (errorMsg === "Error: Please select ")
          errorMsg = "Please Enter Property Type";
        else errorMsg = errorMsg + ", Property Type";
        errorFlag = true;
      }

      if (propertyDetails.Bhk === "") {
        if (errorMsg === "Error: Please select ") errorMsg = "Please Enter BHK";
        else errorMsg = errorMsg + ", BHK";
        errorFlag = true;
      }

      if (propertyDetails.FloorNo === "" || propertyDetails.FloorNo === "Select Floor No") {
        if (errorMsg === "Error: Please select ")
          errorMsg = "Please Enter Floor No";
        else errorMsg = errorMsg + ", Floor No";
        errorFlag = true;
      }

      if ((propertyDetails.Flag.toLowerCase() === "available for rent" || propertyDetails.Flag.toLowerCase() === "rented out" || propertyDetails.Flag.toLowerCase() === "rent and sale" || propertyDetails.Flag.toLowerCase() === "rented but sale") &&
        (propertyDetails.DemandPriceRent === "" ||
          propertyDetails.DemandPriceRent === "0")
      ) {
        if (errorMsg === "Error: Please select ")
          errorMsg = "Please Enter Demand for Rent";
        else errorMsg = errorMsg + ", Demand for Rent";
        errorFlag = true;
      }

      if ((propertyDetails.Flag.toLowerCase() === "available for sale" || propertyDetails.Flag.toLowerCase() === "sold out" || propertyDetails.Flag.toLowerCase() === "rent and sale" || propertyDetails.Flag.toLowerCase() === "rented but sale") &&
        (propertyDetails.DemandPriceSale === "" ||
          propertyDetails.DemandPriceSale === "0")
      ) {
        if (errorMsg === "Error: Please select ")
          errorMsg = "Please Enter Demand for Sale";
        else errorMsg = errorMsg + ", Demand for Sale";
        errorFlag = true;
      }

      if (propertyDetails.MaintenanceCharges === "") {
        propertyDetails.MaintenanceChargesFrequency = "NA";
      } else {
        if (
          propertyDetails.MaintenanceCharges !== "" &&
          propertyDetails.MaintenanceChargesFrequency === ""
        ) {
          if (errorMsg === "Error: Please select ")
            errorMsg = errorMsg + "Frequency";
          else errorMsg = errorMsg + ", Frequency";
          errorFlag = true;
        } else {
          if (
            propertyDetails.MaintenanceCharges !== "" &&
            propertyDetails.MaintenanceChargesFrequency === "NA"
          ) {
            if (errorMsg === "Error: Please select ")
              errorMsg = errorMsg + "Frequency";
            else errorMsg = errorMsg + ", Frequency";
            errorFlag = true;
          }
        }
      }

      // console.log("state:", state);
      if (
        state.label === "" ||
        state === undefined ||
        state.label === "Select State"
      ) {
        if (errorMsg === "Error: Please select ") errorMsg = errorMsg + "State";
        else errorMsg = errorMsg + ", State";
        errorFlag = true;
      }

      if (
        city.label === "" ||
        city === undefined ||
        city.label === "Select City"
      ) {
        if (errorMsg === "Error: Please select ") errorMsg = errorMsg + "City";
        else errorMsg = errorMsg + ", City";
        errorFlag = true;
      }

      if (locality.label === "" || locality == undefined || locality === "Select Locality") {
        if (errorMsg === "Error: Please select ")
          errorMsg = errorMsg + "Locality";
        else errorMsg = errorMsg + ", Locality";
        errorFlag = true;
      }
      if (society === "" || society === undefined || society === "Select Society") {
        if (errorMsg === "Error: Please select ")
          errorMsg = errorMsg + "Society";
        else errorMsg = errorMsg + ", Society";
        errorFlag = true;
      }

      if (errorFlag) setFormError(errorMsg);
      else setFormError(null);

      const property = {
        package: propertyDetails.Package,
        flag: propertyDetails.Flag,
        category: propertyDetails.Category
          ? propertyDetails.Category
          : "Residential",
        unitNumber: propertyDetails.UnitNumber
          ? propertyDetails.UnitNumber.trim()
          : "",
        // purpose: propertyDetails.Purpose ? propertyDetails.Purpose : "",
        purpose: propertyDetails.Flag.toLowerCase() === "pms only" ? "PMS" : (propertyDetails.Flag.toLowerCase() === "available for rent" || propertyDetails.Flag.toLowerCase() === "rented out" || propertyDetails.Flag.toLowerCase() === "pms after rent") ? "Rent" : (propertyDetails.Flag.toLowerCase() === "available for sale" || propertyDetails.Flag.toLowerCase() === "sold out") ? "Sale" : "RentSaleBoth",
        propertyType: propertyDetails.PropertyType
          ? propertyDetails.PropertyType
          : "",
        bhk: propertyDetails.Bhk ? propertyDetails.Bhk : "",
        floorNo: propertyDetails.FloorNo ? propertyDetails.FloorNo : "1",
        status:
          propertyDetails.Purpose === "Rent"
            ? "Available for Rent" : propertyDetails.Purpose === "Sale" ?
              "Available for Sale" : propertyDetails.Purpose === "RentSaleBoth" ? "Available for Rent & Sale Both" : "PMS Only",
        demandPriceRent: removeCommas(propertyDetails.DemandPriceRent)
          ? removeCommas(propertyDetails.DemandPriceRent)
          : "",
        demandPriceSale: removeCommas(propertyDetails.DemandPriceSale)
          ? removeCommas(propertyDetails.DemandPriceSale)
          : "",
        maintenanceFlag: propertyDetails.MaintenanceFlag
          ? propertyDetails.MaintenanceFlag
          : "",
        maintenanceCharges: removeCommas(propertyDetails.MaintenanceCharges)
          ? removeCommas(propertyDetails.MaintenanceCharges)
          : "",
        maintenanceChargesFrequency: propertyDetails.MaintenanceChargesFrequency
          ? propertyDetails.MaintenanceChargesFrequency
          : "NA",
        securityDeposit: removeCommas(propertyDetails.SecurityDeposit)
          ? removeCommas(propertyDetails.SecurityDeposit)
          : "",
        state: state.label,
        city: city.label,
        // city: camelCase(propertyDetails.City.toLowerCase().trim()),
        locality: locality.label,
        // locality:  camelCase(propertyDetails.Locality.toLowerCase().trim()),
        society: society.label,
        // society: camelCase(propertyDetails.Society.toLowerCase().trim()),
        pincode: propertyDetails.Pincode ? propertyDetails.Pincode : "",
        propertyName: propertyDetails.UnitNumber.trim() + ", " + camelCase(propertyDetails.Society.toLowerCase().trim()),
      };

      const _newProperty = {
        ...property,
        //other property fields
        country: "India",
        region: (state.label === "Delhi" || state.label === "Haryana" || state.label === "Himachal Pradesh" || state.label === "Jammu and Kashmir" || state.label === "Punjab" || state.label === "Uttar Pradesh" || state.label === "Uttarakhand") ? "North India" :
          (state.label === "Andhra Pradesh" || state.label === "Karnataka" || state.label === "Kerala" || state.label === "Tamilnadu" || state.label === "Telangana") ? "South India" :
            (state.label === "Arunachal Pradesh" || state.label === "Assam" || state.label === "Bihar" || state.label === "Jharkhand" || state.label === "Manipur" || state.label === "Meghalaya" || state.label === "Mizoram" || state.label === "Nagaland" || state.label === "Odisha" || state.label === "Sikkim" || state.label === "Tripura") ? "East India" : "West India",
        source: "Propdial",
        ownership: "",
        numberOfBedrooms: "0",
        numberOfBathrooms: "0",
        numberOfBalcony: 0,
        numberOfKitchen: "0",
        numberOfLivingArea: "0",
        numberOfBasement: "0",
        numberOfFloors: propertyDetails.FloorNo ? propertyDetails.FloorNo : "1",
        numberOfFlatsOnFloor: "1",
        numberOfLifts: "0",
        numberOfOpenCarParking: "0",
        numberOfCoveredCarParking: "0",
        twoWheelarParking: "No",
        evChargingPointStatus: "No",
        evChargingPointType: "",
        lockinPeriod: 6,
        diningArea: "",
        livingAndDining: "",
        entranceGallery: "",
        passage: "",
        furnishing: "",
        additionalRooms: [],
        additionalArea: [],
        plotArea: "",
        superArea: "",
        superAreaUnit: "",
        builtupArea: "",
        builtupAreaUnit: "",
        carpetArea: "",
        carpetAreaUnit: "",
        images: [],
        imgURL: [],
        yearOfConstruction: "",
        // ageOfProperty: "",
        powerBackup: "",
        mainDoorFacing: "",
        overLooking: [],
        balconyFacing: [],
        visitingHrsFrom: "10:00",
        visitingHrsTo: "18:00",
        visitingDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        bachlorsBoysAllowed: "",
        bachlorsGirlsAllowed: "",
        petsAllowed: "",
        vegNonVeg: "",
        propertyDescription: "",
        ownerInstructions: "",
        // propertyManager: user.uid,
        // propertyCoManager: user.uid,
        // propertySalesManager: user.uid,
        // propertyOwner: user.uid,
        // propertyCoOwner: user.uid,
        // propertyPOC: user.uid,
        // tenantList: [],
        postedBy: "Propdial",
        isActiveInactiveReview: "In-Review",
        onboardingDate: timestamp.fromDate(new Date(onboardingDate)),
      };
      if (!errorFlag) {
        console.log("new property created: ");
        console.log(newProperty);

        setFormError(null);
        const propertiesCount = dbpropertiesdocuments && dbpropertiesdocuments.length + 2101;
        // const nextPropertySeqCounter = "PID: " + state.value + "-" + (propertiesCount + 1)
        // console.log("nextPropertySeqCounter: ", nextPropertySeqCounter)

        // console.log("state value: ", state.value)
        // console.log("dbstatesdocuments: ", dbstatesdocuments)
        const statecode = (masterState && masterState.find((e) => e.id === state.value)).stateCode
        // console.log("statecode: ", statecode)

        const formattedId = `${statecode}-${String(
          propertiesCount
        ).padStart(5, "0")}`;
        // console.log("formattedId: ", formattedId)

        const _propertyWithSeqCounter = {
          ..._newProperty,
          pid: formattedId,
          createdBy: user ? user.uid : "guest",
          createdAt: timestamp.fromDate(new Date()),
        };

        console.log("_propertyWithSeqCounter: ", _propertyWithSeqCounter)

        // const newpropid = await addNewPropertyDocument(_propertyWithSeqCounter);        
        const collectionRef = projectFirestore.collection("properties-propdial");
        // Add the document to the collection
        const docRef = await collectionRef.add(_propertyWithSeqCounter);

        // Get the ID of the newly created document
        const newpropid = docRef.id;
        // console.log("New Property ID: ", newpropid)

        setFormSuccess("Property Created Successfully");
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setFormSuccess(null);
        }, 3000);
        //Add created by id into propertyusers list
        const propertyUserData = {
          propertyId: newpropid,
          userId: user.uid,
          userTag: "Admin",
          userType: "propertyowner",
        };

        // console.log("New Property Data: ", propertyUserData)

        await addProperyUsersDocument(propertyUserData);

        if (addNewPropertyDocumentResponse.error) {
          navigate("/");
        } else {
          // var x = document.getElementById("btn_create").name;
          document.getElementById("btn_create").display = "none";
          // navigate("/dashboard");
          navigate("/allproperties/all");
          // setNewProperty(newProperty);
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

  // 9 dots controls state
  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };

  return (
    <>
      {user && user.status === "active" ? (
        <div className="top_header_pg pg_bg">
          <div className="page_spacing">
            {/* 9 dots html */}
            <div
              onClick={openMoreAddOptions}
              className="property-list-add-property"
            >
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
                <Link to="/allproperties/all" className="more-add-options-icons">
                  <h1>Properties</h1>
                  <span className="material-symbols-outlined">
                    real_estate_agent
                  </span>
                </Link>
                <Link to="/dashboard" className="more-add-options-icons">
                  <h1>Dashboard</h1>
                  <span className="material-symbols-outlined">Dashboard</span>
                </Link>
              </div>
            </div>
            {/* 9 dots html */}
            <Back pageTitle="Create Property" />
            <hr />
            <div className="vg22"></div>
            <div className="">
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
                              <label htmlFor="package_pmspremium">
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
                              <label htmlFor="package_pmslight">
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
                              <label htmlFor="package_pmssale">
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
                              <label htmlFor="package_prepms">
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
                              <label htmlFor="package_rentonly">
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
                              <label htmlFor="flag_availableforrent">
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
                              <label htmlFor="flag_rentedout">
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
                              <label htmlFor="flag_availableforsale">
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
                              <label htmlFor="flag_soldout">
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
                              <label htmlFor="flag_rentsale">
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
                              <label htmlFor="flag_rentedbutsale">
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
                                id="flag_rentedpmsonly"
                                onClick={(e) => {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    Flag: "PMS Only",
                                    Purpose: "PMS"
                                  });
                                }}
                              />
                              <label htmlFor="flag_rentedpmsonly">
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
                {/* Category */}
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
                              <label htmlFor="category_residential">
                                <div className="radio_icon">
                                  <span className="material-symbols-outlined add">
                                    add
                                  </span>
                                  <span className="material-symbols-outlined check">
                                    done
                                  </span>
                                </div>
                                Residential
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
                              <label htmlFor="category_commercial">
                                <div className="radio_icon">
                                  <span className="material-symbols-outlined add">
                                    add
                                  </span>
                                  <span className="material-symbols-outlined check">
                                    done
                                  </span>
                                </div>
                                Commercial
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
                    <label htmlFor="">Purpose</label>
                    <div className="form_field_inner">
                      <div className="form_field_container">
                        <div className="radio_group">
                          <div className="radio_group_single">
                            <div
                              className={
                                (propertyDetails.Purpose !== "") && (propertyDetails.Purpose === "Rent" || propertyDetails.Flag.toLowerCase() === "available for rent" || propertyDetails.Flag.toLowerCase() === "rented out" || propertyDetails.Flag.toLowerCase() === "rent and sale" || propertyDetails.Flag.toLowerCase() === "rented but sale")
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
                                    Purpose: "Rent",
                                  });
                                }}
                              />
                              <label htmlFor="purpose_rent">
                                <div className="radio_icon">
                                  <span className="material-symbols-outlined add">
                                    add
                                  </span>
                                  <span className="material-symbols-outlined check">
                                    done
                                  </span>
                                </div>
                                Rent
                              </label>
                            </div>
                          </div>
                          <div className="radio_group_single">
                            <div
                              className={
                                (propertyDetails.Purpose !== "") && (propertyDetails.Purpose === "Sale" || propertyDetails.Flag.toLowerCase() === "available for sale" || propertyDetails.Flag.toLowerCase() === "sold out" || propertyDetails.Flag.toLowerCase() === "rent and sale" || propertyDetails.Flag.toLowerCase() === "rented but sale")
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
                              <label htmlFor="purpose_sale">
                                <div className="radio_icon">
                                  <span className="material-symbols-outlined add">
                                    add
                                  </span>
                                  <span className="material-symbols-outlined check">
                                    done
                                  </span>
                                </div>
                                Sale
                              </label>
                            </div>
                          </div>

                          <div className="radio_group_single">
                            <div
                              className={
                                (propertyDetails.Purpose !== "") && (propertyDetails.Purpose === "PMS" || propertyDetails.Flag === "PMS Only")
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
                              <label htmlFor="purpose_pms">
                                <div className="radio_icon">
                                  <span className="material-symbols-outlined add">
                                    add
                                  </span>
                                  <span className="material-symbols-outlined check">
                                    done
                                  </span>
                                </div>
                                PMS
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
                    <label htmlFor="">Property Type</label>
                    <div className="form_field_inner">
                      <select
                        value={propertyDetails && propertyDetails.PropertyType}
                        onChange={(e) => {
                          setPropertyDetails({
                            ...propertyDetails,
                            PropertyType: e.target.value,
                          });
                        }}
                      >
                        <option
                          defaultValue={
                            propertyDetails &&
                              propertyDetails.PropertyType.toUpperCase ===
                              "SELECT PROPERTY TYPE"
                              ? true
                              : false
                          }
                        >
                          Select Property Type
                        </option>
                        <option
                          defaultValue={
                            propertyDetails &&
                              propertyDetails.PropertyType === "High Rise Apt"
                              ? true
                              : false
                          }
                        >
                          High Rise Apt (10+ floor)
                        </option>
                        <option
                          defaultValue={
                            propertyDetails &&
                              propertyDetails.PropertyType === "Low Rise Apt"
                              ? true
                              : false
                          }
                        >
                          Low Rise Apt (5-10 floor)
                        </option>
                        <option
                          defaultValue={
                            propertyDetails &&
                              propertyDetails.PropertyType === "Builder Floor"
                              ? true
                              : false
                          }
                        >
                          Builder Floor (Upto 4 floor)
                        </option>
                        <option
                          defaultValue={
                            propertyDetails &&
                              propertyDetails.PropertyType === "Kothi"
                              ? true
                              : false
                          }
                        >
                          Kothi/Independent house{" "}
                        </option>
                        <option
                          defaultValue={
                            propertyDetails &&
                              propertyDetails.PropertyType === "Villa - Simplex"
                              ? true
                              : false
                          }
                        >
                          Villa - Simplex
                        </option>
                        <option
                          defaultValue={
                            propertyDetails &&
                              propertyDetails.PropertyType === "Villa - Duplex"
                              ? true
                              : false
                          }
                        >
                          Villa - Duplex
                        </option>
                        <option
                          defaultValue={
                            propertyDetails &&
                              propertyDetails.PropertyType === "Row House - Simplex"
                              ? true
                              : false
                          }
                        >
                          Row House - Simplex
                        </option>
                        <option
                          defaultValue={
                            propertyDetails &&
                              propertyDetails.PropertyType === "Row House - Duplex"
                              ? true
                              : false
                          }
                        >
                          Row House - Duplex
                        </option>
                        <option
                          defaultValue={
                            propertyDetails &&
                              propertyDetails.PropertyType === "Pent House - Simplex"
                              ? true
                              : false
                          }
                        >
                          Pent House - Simplex
                        </option>
                        <option
                          defaultValue={
                            propertyDetails &&
                              propertyDetails.PropertyType === "Pent House - Duplex"
                              ? true
                              : false
                          }
                        >
                          Pent House - Duplex
                        </option>
                      </select>
                      {/* <div className="field_icon">
                 <span className="material-symbols-outlined">
                   format_list_bulleted
                 </span>
               </div> */}
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">BHK</label>
                    <div className="form_field_inner">
                      <select
                        value={propertyDetails && propertyDetails.Bhk}
                        onChange={(e) => {
                          setPropertyDetails({
                            ...propertyDetails,
                            Bhk: e.target.value,
                          });
                        }}
                      >
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "Select BHK"
                              ? true
                              : false
                          }
                        >
                          Select BHK
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "EWS"
                              ? true
                              : false
                          }
                        >
                          EWS
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "1 RK"
                              ? true
                              : false
                          }
                        >
                          1 RK
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "Studio"
                              ? true
                              : false
                          }
                        >
                          Studio
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "1"
                              ? true
                              : false
                          }
                        >
                          1 BHK
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "1.5"
                              ? true
                              : false
                          }
                        >
                          1.5 BHK{" "}
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "2"
                              ? true
                              : false
                          }
                        >
                          2 BHK{" "}
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "2.5"
                              ? true
                              : false
                          }
                        >
                          2.5 BHK{" "}
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "3"
                              ? true
                              : false
                          }
                        >
                          3 BHK{" "}
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "3.5 "
                              ? true
                              : false
                          }
                        >
                          3.5 BHK{" "}
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "4"
                              ? true
                              : false
                          }
                        >
                          4 BHK{" "}
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "5"
                              ? true
                              : false
                          }
                        >
                          5 BHK{" "}
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "6"
                              ? true
                              : false
                          }
                        >
                          6 BHK{" "}
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "7"
                              ? true
                              : false
                          }
                        >
                          7 BHK{" "}
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "8"
                              ? true
                              : false
                          }
                        >
                          8 BHK{" "}
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "9"
                              ? true
                              : false
                          }
                        >
                          9 BHK{" "}
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.Bhk === "9+"
                              ? true
                              : false
                          }
                        >
                          9+ BHK{" "}
                        </option>
                      </select>
                      {/* <div className="field_icon">
                 <span className="material-symbols-outlined">
                   bedroom_parent
                 </span>
               </div> */}
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Floor No</label>
                    <div className="form_field_inner">
                      <select
                        value={propertyDetails && propertyDetails.FloorNo}
                        onChange={(e) => {
                          setPropertyDetails({
                            ...propertyDetails,
                            FloorNo: e.target.value,
                          });
                        }}
                      >
                        <option
                          defaultValue={
                            propertyDetails &&
                              propertyDetails.FloorNo === "Select Floor No"
                              ? true
                              : false
                          }
                        >
                          Select Floor No
                        </option>
                        <option
                          defaultValue={
                            propertyDetails &&
                              propertyDetails.FloorNo === "Basement"
                              ? true
                              : false
                          }
                        >
                          Basement
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "Ground"
                              ? true
                              : false
                          }
                        >
                          Ground
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "Stilt"
                              ? true
                              : false
                          }
                        >
                          Stilt
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "1"
                              ? true
                              : false
                          }
                        >
                          1
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "2"
                              ? true
                              : false
                          }
                        >
                          2
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "3"
                              ? true
                              : false
                          }
                        >
                          3
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "4"
                              ? true
                              : false
                          }
                        >
                          4
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "5"
                              ? true
                              : false
                          }
                        >
                          5
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "6"
                              ? true
                              : false
                          }
                        >
                          6
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "7"
                              ? true
                              : false
                          }
                        >
                          7
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "8"
                              ? true
                              : false
                          }
                        >
                          8
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "9"
                              ? true
                              : false
                          }
                        >
                          9
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "10"
                              ? true
                              : false
                          }
                        >
                          10
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "11"
                              ? true
                              : false
                          }
                        >
                          11
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "12"
                              ? true
                              : false
                          }
                        >
                          12
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "13"
                              ? true
                              : false
                          }
                        >
                          13
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "14"
                              ? true
                              : false
                          }
                        >
                          14
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "15"
                              ? true
                              : false
                          }
                        >
                          15
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "16"
                              ? true
                              : false
                          }
                        >
                          16
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "17"
                              ? true
                              : false
                          }
                        >
                          17
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "18"
                              ? true
                              : false
                          }
                        >
                          18
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "19"
                              ? true
                              : false
                          }
                        >
                          19
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "20"
                              ? true
                              : false
                          }
                        >
                          20
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "21"
                              ? true
                              : false
                          }
                        >
                          21
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "22"
                              ? true
                              : false
                          }
                        >
                          22
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "23"
                              ? true
                              : false
                          }
                        >
                          23
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "24"
                              ? true
                              : false
                          }
                        >
                          24
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "25"
                              ? true
                              : false
                          }
                        >
                          25
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "26"
                              ? true
                              : false
                          }
                        >
                          26
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "27"
                              ? true
                              : false
                          }
                        >
                          27
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "28"
                              ? true
                              : false
                          }
                        >
                          28
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "29"
                              ? true
                              : false
                          }
                        >
                          29
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "30"
                              ? true
                              : false
                          }
                        >
                          30
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "31"
                              ? true
                              : false
                          }
                        >
                          31
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "32"
                              ? true
                              : false
                          }
                        >
                          32
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "33"
                              ? true
                              : false
                          }
                        >
                          33
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "34"
                              ? true
                              : false
                          }
                        >
                          34
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "35"
                              ? true
                              : false
                          }
                        >
                          35
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "36"
                              ? true
                              : false
                          }
                        >
                          36
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "37"
                              ? true
                              : false
                          }
                        >
                          37
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "38"
                              ? true
                              : false
                          }
                        >
                          38
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "39"
                              ? true
                              : false
                          }
                        >
                          39
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "40"
                              ? true
                              : false
                          }
                        >
                          40
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "41"
                              ? true
                              : false
                          }
                        >
                          41
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "42"
                              ? true
                              : false
                          }
                        >
                          42
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "43"
                              ? true
                              : false
                          }
                        >
                          43
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "44"
                              ? true
                              : false
                          }
                        >
                          44
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "45"
                              ? true
                              : false
                          }
                        >
                          45
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "46"
                              ? true
                              : false
                          }
                        >
                          46
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "47"
                              ? true
                              : false
                          }
                        >
                          47
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "48"
                              ? true
                              : false
                          }
                        >
                          48
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "49"
                              ? true
                              : false
                          }
                        >
                          49
                        </option>
                        <option
                          defaultValue={
                            propertyDetails && propertyDetails.FloorNo === "50+"
                              ? true
                              : false
                          }
                        >
                          50+
                        </option>
                      </select>
                      {/* <div className="field_icon">
                 <span className="material-symbols-outlined">
                   bedroom_parent
                 </span>
               </div> */}
                    </div>
                  </div>
                </div>
                {(propertyDetails.Flag.toLowerCase() === "available for rent" || propertyDetails.Flag.toLowerCase() === "pms after rent" || propertyDetails.Flag.toLowerCase() === "rented out" || propertyDetails.Flag.toLowerCase() === "rent and sale" || propertyDetails.Flag.toLowerCase() === "rented but sale") && <div className="col-xl-4 col-lg-6">
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
                        maxLength={12}
                        onInput={(e) => {
                          restrictInput(e, 12);
                        }}
                        onChange={(e) => {
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
                  </div>
                </div>}

                {(propertyDetails.Flag.toLowerCase() === "available for rent" || propertyDetails.Flag.toLowerCase() === "rented out" || propertyDetails.Flag.toLowerCase() === "rent and sale" || propertyDetails.Flag.toLowerCase() === "rented but sale") && (
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
                                      MaintenanceCharges: "",
                                      MaintenanceFlag: "Included",
                                    });
                                  }}
                                />
                                <label htmlFor="maintenanceflag_included">
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
                                  id="maintenanceflag_excluded"
                                  onClick={(e) => {
                                    setPropertyDetails({
                                      ...propertyDetails,
                                      MaintenanceFlag: "Extra",
                                    });
                                  }}
                                />
                                <label htmlFor="maintenanceflag_excluded">
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

                {propertyDetails && propertyDetails.MaintenanceFlag === "Extra" && (
                  <div className="col-xl-4 col-lg-6">
                    <div className="form_field st-2 new_radio_groups_parent new_single_field n_select_bg label_top">
                      <label>Maintenance fees</label>
                      <div className="form_field_inner price_input" style={{ display: "flex", alignItems: "center" }}>
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
                        style={{ fontSize: "smaller", borderTop: "1px solid #ddd", paddingTop: "3px" }}
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
                            setPropertyDetails({
                              ...propertyDetails,
                              SecurityDeposit: e.target.value.replace(/,/g, ""),
                            });
                          }}
                          value={propertyDetails && formatNumberWithCommas(propertyDetails.SecurityDeposit)}
                        />

                      </div>
                      <div style={{ fontSize: "smaller" }} className="mt-2 text-capitalize">
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
                               <label>Property Status - Rent</label>
                               <div className="form_field_inner">
                                   <select>
                                       <option value="">Select Flag</option>
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

                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">City</label>

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
                        onChange={handleLocalityChange}
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
                    <label htmlFor="">New Society</label>

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
                {/* Unit No */}
                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Unit Number</label>
                    <div className="form_field_inner">
                      <input
                        type="text"
                        required
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
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6">
                  <div className="form_field label_top">
                    <label htmlFor="">Pincode number</label>
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
                              Pincode: e.target.value.trim(),
                            });
                          }
                        }}
                        value={propertyDetails && propertyDetails.Pincode}
                      />
                      {/* <input
                   type="number"
                   placeholder="Enter here"
                   maxLength={6}
                   onChange={(e) =>
                     setPropertyDetails({
                       ...propertyDetails,
                       Pincode: e.target.value.trim(),
                     })
                   }
                   value={propertyDetails && propertyDetails.Pincode}
                 /> */}
                      <div className="field_icon"></div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  {formError && <p className="error_new">{formError}</p>}
                  {formSuccess && <p className="success_new">{formSuccess}</p>}
                </div>
                <div className="col-12">
                  <button
                    id="btn_create"
                    className="theme_btn btn_fill full_width no_icon"
                    onClick={(e) => handleSubmit(e, "Next")}
                    disabled={formSuccess ? true : false} // Apply disabled conditionally
                  >
                    Create
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div >
      ) : (
        <InactiveUserCard />
      )}
    </>

  );
};

export default CreateProperty;
