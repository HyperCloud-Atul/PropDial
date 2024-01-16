import { useState, useEffect, useRef } from "react";
import { useCollection } from "../../../hooks/useCollection";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { timestamp, projectFirestore } from "../../../firebase/config";
import { useFirestore } from "../../../hooks/useFirestore";
import { useDocument } from "../../../hooks/useDocument";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { el } from "date-fns/locale";
import SearchBarAutoComplete from "../../search/SearchBarAutoComplete";

const categories = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
];
// ---------------------------------------------------------------
// amount to words

const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function convertToWords(number) {
  if (number === 0) {
    return 'zero';
  }

  // Split the number into groups of three digits
  const chunks = [];
  while (number > 0) {
    chunks.push(number % 1000);
    number = Math.floor(number / 1000);
  }

  // Convert each chunk to words
  const chunkWords = chunks.map((chunk, index) => {
    if (chunk === 0) {
      return '';
    }

    const chunkText = chunkToWords(chunk);
    const suffix = index === 0 ? '' : ` ${indexToPlace(index)}`;
    return `${chunkText}${suffix}`;
  });

  // Combine the chunk words
  return chunkWords.reverse().join(' ').trim();
}

function chunkToWords(chunk) {
  const hundredDigit = Math.floor(chunk / 100);
  const remainder = chunk % 100;

  let result = '';
  if (hundredDigit > 0) {
    result += `${units[hundredDigit]} hundred`;
  }

  if (remainder > 0) {
    if (result !== '') {
      result += ' and ';
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
  const places = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'];
  return places[index];
}

// Example usage:
const amount = 12000;
const amountInWords = convertToWords(amount);
console.log(`${amount} in words: ${amountInWords}`);





// ------------------------------------------------------------

export default function PGAgentAddProperties() {
  const { propertyid } = useParams();
  // console.log('Property ID: ', propertyid)

  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const navigate = useNavigate();
  const { document: propertyDocument, error: propertyerror } = useDocument(
    "properties",
    propertyid
  );

  const { documents: dbpropertiesdocuments, error: propertieserror } =
    useCollection("properties", ["postedBy", "==", "Agent"]);

  var distinctCityList = [];
  dbpropertiesdocuments &&
    dbpropertiesdocuments.map((doc) => {
      if (!distinctCityList.find((e) => e.city === doc.city)) {
        distinctCityList.push({
          state: doc.state,
          city: doc.city,
        });
      }
    });
  // console.log('distinctCityList: ', distinctCityList)

  var distinctLocalityList = [];
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

  var distinctSocietyList = [];
  dbpropertiesdocuments &&
    dbpropertiesdocuments.map((doc) => {
      if (!distinctSocietyList.find((e) => e.society === doc.society)) {
        distinctSocietyList.push({
          locality: doc.locality,
          society: doc.society,
        });
      }
    });
  // console.log('distinctSocietyList: ', distinctSocietyList)

  // const dataLocality = dbpropertiesdocuments && dbpropertiesdocuments.map((doc) => doc.locality);
  // const distinctValuesLocality = [...new Set(dataLocality)];

  // const dataSociety = dbpropertiesdocuments && dbpropertiesdocuments.map((doc) => doc.society);
  // const distinctValuesSociety = [...new Set(dataSociety)];

  const { addDocument, response: addDocumentResponse } =
    useFirestore("properties");
  const { updateDocument, response: updateDocumentResponse } =
    useFirestore("properties");

  const { user } = useAuthContext();
  const [toggleFlag, setToggleFlag] = useState(false);

  // form field values
  const [taggedOwner, setTaggedOwner] = useState([]);
  const [country, setCountry] = useState({ label: "INDIA", value: "INDIA" });
  const [state, setState] = useState();
  // const [city, setCity] = useState()
  // const [newCity, setNewCity] = useState()
  // const [cityList, setCityList] = useState([])
  const [distinctValuesCity, setdistinctValuesCity] = useState([]);

  // const [localityList, setLocalityList] = useState([])
  // const [locality, setLocality] = useState()
  const [distinctValuesLocality, setdistinctValuesLocality] = useState([]);

  // const [society, setSociety] = useState('')
  const [distinctValuesSociety, setdistinctValuesSociety] = useState([]);

  const [category, setCategory] = useState("Residential"); //Residential/Commercial

  const [status, setStatus] = useState("pending approval");

  const [onboardingDate, setOnboardingDate] = useState(new Date());
  const [formError, setFormError] = useState(null);

  const [propertyDetails, setPropertyDetails] = useState({
    // All select type
    UnitNumber: "",
    DemandPrice: "",
    MaintenanceCharges: "",
    MaintenanceChargesFrequency: "Select Frequency",
    Purpose: "Rent",
    Country: "",
    State: "",
    // state,
    City: "",
    Locality: "",
    Society: "",
    PropertyType: "Select Property Type",
    Bhk: "Select BHK",
    Furnishing: "Raw",
    NumberOfBedrooms: "Select Bedroom",
    NumberOfBathrooms: "Select Bathroom",
    NumberOfBalcony: "",
    NumberOfKitchen: "",
    DiningArea: "",
    LivingDining: "",
    NumberOfLivingArea: "",
    Passages: "",
    EntranceGallery: "",
    NumberOfBasement: "",
    AdditionalRooms: [],
    AdditionalArea: [],
    NumberOfAptOnFloor: "",
    NumberOfLifts: "",
    PowerBackup: "",
    NumberOfCarParking: "",
    TwoWheelerParking: "",

    // input type text + select
    SuperArea: "",
    CarpetArea: "",
    ServentRoomClick: false,
    OfficeRoomClick: false,
    StoreRoomClick: false,
    PoojaRoomClick: false,
    StudyRoomClick: false,
    PowerRoomClick: false,
  });

  let statesOptions = useRef([]);
  let statesOptionsSorted = useRef([]);

  useEffect(() => {
    handleCountryChange(country);

    if (propertyDocument) {
      setCategory(propertyDocument.category);
      if (propertyDocument.category.toUpperCase() === "RESIDENTIAL")
        setToggleFlag(false);
      else setToggleFlag(true);

      setPropertyDetails({
        // All select type
        UnitNumber: propertyDocument.unitNumber
          ? propertyDocument.unitNumber
          : "",
        DemandPrice: propertyDocument.demandprice
          ? propertyDocument.demandprice
          : "",
        MaintenanceCharges: propertyDocument.maintenancecharges
          ? propertyDocument.maintenancecharges
          : "",
        MaintenanceChargesFrequency:
          propertyDocument.maintenancechargesfrequency
            ? propertyDocument.maintenancechargesfrequency
            : "Select Frequency",
        Purpose: propertyDocument.purpose ? propertyDocument.purpose : "",
        Country: propertyDocument.country ? propertyDocument.country : "",
        State: propertyDocument.state ? propertyDocument.state : "",
        City: propertyDocument.city ? propertyDocument.city : "",
        Locality: propertyDocument.locality ? propertyDocument.locality : "",
        Society: propertyDocument.society ? propertyDocument.society : "",
        PropertyType: propertyDocument.propertyType
          ? propertyDocument.propertyType
          : "",
        Bhk: propertyDocument.bhk ? propertyDocument.bhk : "",
        NumberOfBedrooms: propertyDocument.numberOfBedrooms
          ? propertyDocument.numberOfBedrooms
          : "",
        NumberOfBathrooms: propertyDocument.numberOfBathrooms
          ? propertyDocument.numberOfBathrooms
          : "",
        Furnishing: propertyDocument.furnishing
          ? propertyDocument.furnishing
          : "",
        AdditionalRooms: propertyDocument.additionalRooms
          ? propertyDocument.additionalRooms
          : [],
        SuperArea: propertyDocument.superArea ? propertyDocument.superArea : "",
        SuperAreaUnit: propertyDocument.superAreaUnit
          ? propertyDocument.superAreaUnit
          : "SqFt",
        CarpetArea: propertyDocument.carpetArea
          ? propertyDocument.carpetArea
          : "",
        CarpetAreaUnit: propertyDocument.carpetAreaUnit
          ? propertyDocument.carpetAreaUnit
          : "Select Unit",
        ServentRoomClick:
          propertyDocument.additionalRooms &&
            propertyDocument.additionalRooms.find((e) => e === "Servent Room")
            ? true
            : false,
        OfficeRoomClick:
          propertyDocument.additionalRooms &&
            propertyDocument.additionalRooms.find((e) => e === "Office Room")
            ? true
            : false,
        StoreRoomClick:
          propertyDocument.additionalRooms &&
            propertyDocument.additionalRooms.find((e) => e === "Store Room")
            ? true
            : false,
        PoojaRoomClick:
          propertyDocument.additionalRooms &&
            propertyDocument.additionalRooms.find((e) => e === "Pooja Room")
            ? true
            : false,
        StudyRoomClick:
          propertyDocument.additionalRooms &&
            propertyDocument.additionalRooms.find((e) => e === "Study Room")
            ? true
            : false,
        PowerRoomClick:
          propertyDocument.additionalRooms &&
            propertyDocument.additionalRooms.find((e) => e === "Power Room")
            ? true
            : false,
      });
    }
  }, [propertyDocument]);

  // console.log("property details:", propertyDetails);

  const toggleBtnClick = () => {
    if (toggleFlag) setCategory("RESIDENTIAL");
    else setCategory("COMMERCIAL");

    setToggleFlag(!toggleFlag);
  };

  const setPurpose = (option) => {
    console.log("setPurpose e.target.value:", option);
    setPropertyDetails({
      ...propertyDetails,
      Purpose: option,
    });

    let obj_maintenance = document.getElementById("id_maintenancecharges");
    option.toUpperCase() === "SALE"
      ? (obj_maintenance.style.display = "none")
      : (obj_maintenance.style.display = "flex");
  };

  //Country select onchange
  const handleCountryChange = async (option) => {
    setCountry(option);
    // let countryname = option.label;
    let countryname = "INDIA";
    const ref = await projectFirestore
      .collection("m_states")
      .where("country", "==", countryname);
    ref.onSnapshot(
      async (snapshot) => {
        if (snapshot.docs) {
          statesOptions.current = snapshot.docs.map((stateData) => ({
            label: stateData.data().state,
            value: stateData.data().state,
          }));
          // console.log('statesOptions:', statesOptions)
          statesOptionsSorted.current = statesOptions.current.sort((a, b) =>
            a.label.localeCompare(b.label)
          );

          statesOptionsSorted.current.unshift({
            label: "Select State",
            value: "Select State",
          });

          // console.log('statesOptionsSorted:', statesOptionsSorted)

          if (countryname === "INDIA") {
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
          } else {
            setState({
              label: statesOptionsSorted.current[0].label,
              value: statesOptionsSorted.current[0].value,
            });
            handleStateChange({
              label: statesOptionsSorted.current[0].label,
              value: statesOptionsSorted.current[0].value,
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
  };

  function camelCase(str) {
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
  // console.log('chennai in camelcase: ', camelCase('chennai abc def'))
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    let errorFlag = false;
    let errorMsg = "Please select ";

    if (state.value === "Select State") {
      errorMsg = errorMsg + "state";
      errorFlag = true;
    }

    let option_maintenancechargeFrequencey = document.getElementById(
      "id_maintenancechargeFrequencey"
    ).value;
    // console.log('option_maintenancechargeFrequencey:', option_maintenancechargeFrequencey)
    if (
      propertyDetails.MaintenanceCharges !== "" &&
      option_maintenancechargeFrequencey === "Select Frequency"
    ) {
      if (errorMsg === "Please select ")
        errorMsg = errorMsg + "Maintenance Charges Frequency";
      else errorMsg = errorMsg + ", Maintenance Charges Frequency";
      errorFlag = true;
    }

    if (
      propertyDetails.PropertyType.toUpperCase() === "SELECT PROPERTY TYPE" ||
      propertyDetails.PropertyType === ""
    ) {
      if (errorMsg === "Please select ") errorMsg = errorMsg + "property type";
      else errorMsg = errorMsg + ", property type";
      errorFlag = true;
    }
    if (propertyDetails.City === "") {
      if (errorMsg === "Please select ") errorMsg = errorMsg + "city";
      else errorMsg = errorMsg + ", city";
      errorFlag = true;
    }
    if (propertyDetails.Locality === "") {
      if (errorMsg === "Please select ") errorMsg = errorMsg + "locality";
      else errorMsg = errorMsg + ", locality";
      errorFlag = true;
    }
    if (propertyDetails.Society === "") {
      if (errorMsg === "Please select ") errorMsg = errorMsg + "society";
      else errorMsg = errorMsg + ", society";

      errorFlag = true;
    }
    if (
      propertyDetails.Bhk.toUpperCase() === "SELECT BHK" ||
      propertyDetails.PropertyType === ""
    ) {
      if (errorMsg === "Select BHK") errorMsg = errorMsg + "BHK";
      else errorMsg = errorMsg + ", BHK";
      errorFlag = true;
    }
    if (
      propertyDetails.NumberOfBedrooms.toUpperCase() === "SELECT BEDROOM" ||
      propertyDetails.NumberOfBedrooms === ""
    ) {
      if (errorMsg === "Select Bedroom") errorMsg = errorMsg + "Bedroom";
      else errorMsg = errorMsg + ", Bedroom";
      errorFlag = true;
    }
    if (
      propertyDetails.NumberOfBathrooms.toUpperCase() === "SELECT BATHROOM" ||
      propertyDetails.NumberOfBathrooms === ""
    ) {
      if (errorMsg === "Select Bathroom") errorMsg = errorMsg + "Bathroom";
      else errorMsg = errorMsg + ", Bathroom";
      errorFlag = true;
    }
    if (propertyDetails.SuperArea === "" && propertyDetails.CarpetArea === "") {
      if (errorMsg === "Enter Super Area or Carpet Area or both")
        errorMsg = errorMsg + "Enter Super Area or Carpet Area or both";
      else errorMsg = errorMsg + ", Enter Super Area or Carpet Area or both";
      errorFlag = true;
    } else {
      let option_SuperAreaUnit =
        document.getElementById("id_SuperAreaUnit").value;
      // console.log('option_SuperAreaUnit:', option_SuperAreaUnit)
      let option_CarpetAreaUnit =
        document.getElementById("id_CarpetAreaUnit").value;
      // console.log('option_CarpetAreaUnit:', option_CarpetAreaUnit)

      if (
        propertyDetails.SuperArea !== "" &&
        option_SuperAreaUnit === "Select Unit"
      ) {
        if (errorMsg === "Please select ")
          errorMsg = errorMsg + "Super Area Unit";
        else errorMsg = errorMsg + ", Super Area Unit";
        errorFlag = true;
      }
      if (
        propertyDetails.CarpetArea !== "" &&
        option_CarpetAreaUnit === "Select Unit"
      ) {
        if (errorMsg === "Please select ")
          errorMsg = errorMsg + "Carpet Area Unit";
        else errorMsg = errorMsg + ", Carpet Area Unit";
        errorFlag = true;
      }
    }
    // let obj_maintenance = document.getElementById('id_maintenancecharges')
    // option.toUpperCase() === 'SALE' ? obj_maintenance.style.display = 'none' : obj_maintenance.style.display = 'block'

    if (errorFlag) setFormError(errorMsg);
    else setFormError("");

    const property = {
      unitNumber: propertyDetails.UnitNumber ? propertyDetails.UnitNumber : "",
      demandprice: propertyDetails.DemandPrice
        ? propertyDetails.DemandPrice
        : "",
      maintenancecharges: propertyDetails.MaintenanceCharges
        ? propertyDetails.MaintenanceCharges
        : "",
      maintenancechargesfrequency: propertyDetails.MaintenanceChargesFrequency
        ? propertyDetails.MaintenanceChargesFrequency
        : "",
      category,
      purpose: propertyDetails.Purpose ? propertyDetails.Purpose : "Rent",
      country: country.label ? country.label : "",
      state: state.label ? state.label : "",
      city: camelCase(propertyDetails.City.toLowerCase()),
      locality: camelCase(propertyDetails.Locality.toLowerCase()),
      society: camelCase(propertyDetails.Society.toLowerCase()),
      propertyType: propertyDetails.PropertyType
        ? propertyDetails.PropertyType
        : "Select Property Type",
      bhk: propertyDetails.Bhk ? propertyDetails.Bhk : "Select BHK",
      numberOfBedrooms: propertyDetails.NumberOfBedrooms
        ? propertyDetails.NumberOfBedrooms
        : "",
      numberOfBathrooms: propertyDetails.NumberOfBathrooms
        ? propertyDetails.NumberOfBathrooms
        : "",
      furnishing: propertyDetails.Furnishing ? propertyDetails.Furnishing : "",
      additionalRooms: propertyDetails.AdditionalRooms
        ? propertyDetails.AdditionalRooms
        : [],
      superArea: propertyDetails.SuperArea ? propertyDetails.SuperArea : "",
      superAreaUnit: propertyDetails.SuperAreaUnit
        ? propertyDetails.SuperAreaUnit
        : "SqFt",
      carpetArea: propertyDetails.CarpetArea ? propertyDetails.CarpetArea : "",
      carpetAreaUnit: propertyDetails.CarpetAreaUnit
        ? propertyDetails.CarpetAreaUnit
        : "SqFt",
    };

    if (propertyid === "new") {
      // console.log('Property id while newly added : ', propertyid)
      // console.log("Property: ", property)

      const newProperty = {
        ...property,
        postedBy: "Agent",
        status: "pending approval",
        onboardingDate: timestamp.fromDate(new Date(onboardingDate)),
      };
      console.log("newProperty:", newProperty);
      if (!errorFlag) {
        await addDocument(newProperty);
        if (addDocumentResponse.error) {
          navigate("/");
        } else {
          // navigate('/agentproperties')
          navigate("/agentproperties", {
            state: {
              propSearchFilter: "PENDING APPROVAL",
            },
          });
        }
      }
    } else if (propertyid !== "new") {
      // console.log('Property id while update: ', propertyid)
      // console.log("Property: ", property)

      const updatedBy = {
        id: user.uid,
        displayName: user.displayName + "(" + user.role + ")",
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        emailID: user.email,
        photoURL: user.photoURL,
      };

      const updatedProperty = {
        ...property,
        updatedAt: timestamp.fromDate(new Date()),
        updatedBy,
      };
      // console.log('updated property:', updatedProperty)

      if (!errorFlag) {
        await updateDocument(propertyid, updatedProperty);

        if (updateDocumentResponse.error) {
          navigate("/");
        } else {
          // navigate('/agentproperties')
          navigate("/agentproperties", {
            state: {
              propSearchFilter: "ACTIVE",
            },
          });
          // console.log('Property Udpated Successfully:')
        }
      }
    }
  };

  return (
    <div className="top_header_pg pa_bg">
      <div className="pa_inner_page">
        <div className="pg_header">
          <h2 className="p_title">Add Property</h2>
          <h4 className="p_subtitle">You can add your property here</h4>
        </div>

        {/* <div
          className="row no-gutters"
          style={{ margin: "10px 0px ", height: "50px", background: "white" }}
        >
          <div
            className="col-md-6 col-sm-12 d-flex "
            style={{
              alignItems: "center",
              height: "50px",
            }}
          >
            <div className="residential-commercial-switch" style={{ top: "0" }}>
              <span
                className={toggleFlag ? "" : "active"}
                style={{ color: "var(--theme-blue)" }}
              >
                Residential
              </span>
              <div
                className={
                  toggleFlag
                    ? "toggle-switch on commercial"
                    : "toggle-switch off residential"
                }
                style={{ padding: "0 10px" }}
              >
               
                <div onClick={toggleBtnClick}>
                  <div></div>
                </div>
              </div>
              <span
                className={toggleFlag ? "active" : ""}
                style={{ color: "var(--theme-orange)" }}
              >
                Commercial
              </span>
            </div>
          </div>
        </div> */}
        <div className="verticall_gap"></div>
        <form onSubmit={handleSubmit}>
          <div className="add_property_fields">
            <div className="fl_form_field new_single_field">
              <label className="no-floating">
                Unit Number (Not for public display)
              </label>
              <input
                type="text"
                placeholder="Enter Property Unit Number (Optional)"
                maxLength={70}
                onChange={(e) =>
                  setPropertyDetails({
                    ...propertyDetails,
                    UnitNumber: e.target.value,
                  })
                }
                value={propertyDetails && propertyDetails.UnitNumber}
              />
            </div>
            <div className="fl_form_field new_single_field n_select_bg">
              <label className="no-floating">Purpose</label>
              <select
                value={propertyDetails && propertyDetails.Purpose}
                onChange={(e) => setPurpose(e.target.value)}
              >
                <option
                  defaultValue={
                    propertyDetails &&
                      propertyDetails.Purpose.toUpperCase() === "RENT"
                      ? true
                      : false
                  }
                >
                  Rent
                </option>
                <option
                  defaultValue={
                    propertyDetails &&
                      propertyDetails.Purpose.toUpperCase() === "SALE"
                      ? true
                      : false
                  }
                >
                  Sale
                </option>
              </select>
            </div>
            <div id="id_demand" className="fl_form_field new_single_field">
              <label className="no-floating">Demand/Price</label>
              <input
                required
                type="text"
                placeholder="Enter Property Price"
                maxLength={70}
                onChange={(e) =>
                  setPropertyDetails({
                    ...propertyDetails,
                    DemandPrice: e.target.value,
                  })
                }
                value={propertyDetails && propertyDetails.DemandPrice}
              />
              <div style={{ fontSize: 'smaller' }}>{convertToWords(propertyDetails.DemandPrice)}</div>
            </div>
            <div className="new_input_and_select new_single_field" id="id_maintenancecharges">
              <div
                className="fl_form_field new_input"
              >
                <label className="no-floating">Maintenance charges</label>
                <input
                  type="text"
                  placeholder="Enter Maintainance Charges (optional)"
                  maxLength={70}
                  onChange={(e) =>
                    setPropertyDetails({
                      ...propertyDetails,
                      MaintenanceCharges: e.target.value,
                    })
                  }
                  value={propertyDetails && propertyDetails.MaintenanceCharges}
                />
                <div style={{ fontSize: 'smaller' }}>{convertToWords(propertyDetails.MaintenanceCharges)}</div>
              </div>

              <div className="fl_form_field new_select">
                <label htmlFor="" className="no-floating">
                  Per
                </label>
                <select
                  id="id_maintenancechargeFrequencey"
                  value={
                    propertyDetails &&
                    propertyDetails.MaintenanceChargesFrequency
                  }
                  onChange={(e) => {
                    setPropertyDetails({
                      ...propertyDetails,
                      MaintenanceChargesFrequency: e.target.value,
                    });
                  }}
                >
                  <option defaultValue="Select Frequency">
                    Select Frequency
                  </option>
                  <option
                    defaultValue={
                      propertyDetails &&
                        propertyDetails.MaintenanceChargesFrequency === "Monthly"
                        ? true
                        : false
                    }
                  >
                    Monthly
                  </option>
                  <option
                    defaultValue={
                      propertyDetails &&
                        propertyDetails.MaintenanceChargesFrequency ===
                        "Quarterly"
                        ? true
                        : false
                    }
                  >
                    Quarterly
                  </option>
                  <option
                    defaultValue={
                      propertyDetails &&
                        propertyDetails.MaintenanceChargesFrequency ===
                        "Half Yearly"
                        ? true
                        : false
                    }
                  >
                    Half Yearly
                  </option>
                  <option
                    defaultValue={
                      propertyDetails &&
                        propertyDetails.MaintenanceChargesFrequency === "Yearly"
                        ? true
                        : false
                    }
                  >
                    Yearly
                  </option>
                </select>
              </div>

            </div>


            <div className="fl_form_field react_tags new_single_field n_select_bg">
              <label>State</label>

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
              {/* <div className="field_icon">
                      <span className="material-symbols-outlined">
                        {" "}
                        emoji_transportation
                      </span>
                    </div> */}
            </div>
            <div className="fl_form_field react_tags new_single_field">
              <label>City</label>
              {/* <span>distinctValuesCity in SearchBarAutoComplete: {distinctValuesCity}</span> */}
              <SearchBarAutoComplete
                enabled={state && state.value === "Select State" ? true : false}
                dataList={distinctValuesCity}
                placeholderText={"Search City or Add New City"}
                getQuery={setSearchedCity}
                queryValue={propertyDetails ? propertyDetails.City : ""}
              ></SearchBarAutoComplete>
            </div>
            <div className="fl_form_field react_tags new_single_field">
              <label>Locality</label>
              <SearchBarAutoComplete
                enabled={
                  propertyDetails && propertyDetails.City === "" ? true : false
                }
                dataList={distinctValuesLocality}
                placeholderText={"Search Locality or Add New Locality"}
                getQuery={setSearchedLocality}
                queryValue={propertyDetails ? propertyDetails.Locality : ""}
              ></SearchBarAutoComplete>
            </div>
            <div className="fl_form_field react_tags new_single_field">
              <label>Society</label>
              <SearchBarAutoComplete
                enabled={
                  propertyDetails && propertyDetails.Locality === ""
                    ? true
                    : false
                }
                dataList={distinctValuesSociety}
                placeholderText={"Search Society or Add New Society"}
                getQuery={setSearchedSociety}
                queryValue={propertyDetails ? propertyDetails.Society : ""}
              ></SearchBarAutoComplete>
            </div>
            <div className="fl_form_field new_single_field n_select_bg">
              <label className="no-floating">Property Type</label>

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
                    propertyDetails && propertyDetails.PropertyType === "Kothi"
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
            <div className="new_input_and_select new_single_field">
              <div className="fl_form_field new_input">
                <label className="no-floating">Super Area</label>
                <input
                  id="id_superarea"
                  type="text"
                  placeholder="Super Area"
                  onChange={(e) =>
                    setPropertyDetails({
                      ...propertyDetails,
                      SuperArea: e.target.value,
                    })
                  }
                  value={propertyDetails && propertyDetails.SuperArea}
                />
              </div>
              <div className="fl_form_field new_select">
                <label htmlFor="" className="no-floating">
                  Unit
                </label>
                <select
                  id="id_SuperAreaUnit"
                  value={propertyDetails && propertyDetails.SuperAreaUnit}
                  onChange={(e) => {
                    setPropertyDetails({
                      ...propertyDetails,
                      SuperAreaUnit: e.target.value,
                    });
                  }}
                >
                  <option defaultValue="Select Unit">Select Unit</option>
                  <option
                    defaultValue={
                      propertyDetails &&
                        propertyDetails.SuperAreaUnit === "SqFt"
                        ? true
                        : false
                    }
                  >
                    SqFt
                  </option>
                  <option
                    defaultValue={
                      propertyDetails &&
                        propertyDetails.SuperAreaUnit === "SqMtr"
                        ? true
                        : false
                    }
                  >
                    SqMtr
                  </option>
                  <option
                    defaultValue={
                      propertyDetails &&
                        propertyDetails.SuperAreaUnit === "SqYd"
                        ? true
                        : false
                    }
                  >
                    SqYd
                  </option>
                </select>
              </div>
            </div>
            <div className="new_input_and_select new_single_field">
              <div className="fl_form_field new_input">
                <label className="no-floating">Carpet Area</label>
                <input
                  id="id_carpetarea"
                  type="text"
                  placeholder="Carpet Area"
                  onChange={(e) =>
                    setPropertyDetails({
                      ...propertyDetails,
                      CarpetArea: e.target.value,
                    })
                  }
                  value={propertyDetails && propertyDetails.CarpetArea}
                />
              </div>
              <div className="fl_form_field new_select">
                <label className="no-floating">Unit</label>
                <select
                  id="id_CarpetAreaUnit"
                  value={propertyDetails && propertyDetails.CarpetAreaUnit}
                  onChange={(e) => {
                    setPropertyDetails({
                      ...propertyDetails,
                      CarpetAreaUnit: e.target.value,
                    });
                  }}
                >
                  <option defaultValue="Select Unit">Select Unit</option>
                  <option
                    defaultValue={
                      propertyDetails &&
                        propertyDetails.CarpetAreaUnit === "SqFt"
                        ? true
                        : false
                    }
                  >
                    SqFt
                  </option>
                  <option
                    defaultValue={
                      propertyDetails &&
                        propertyDetails.CarpetAreaUnit === "SqMtr"
                        ? true
                        : false
                    }
                  >
                    SqMtr
                  </option>
                  <option
                    defaultValue={
                      propertyDetails &&
                        propertyDetails.CarpetAreaUnit === "SqYd"
                        ? true
                        : false
                    }
                  >
                    SqYd
                  </option>
                </select>
              </div>
            </div>
            <div className="fl_form_field new_single_field n_select_bg">
              <label className="no-floating">BHK</label>

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
                    propertyDetails &&
                      propertyDetails.Bhk.toUpperCase === "Select BHK"
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
            <div className="fl_form_field new_single_field n_select_bg">
              <label className="no-floating">No. of Bedrooms</label>
              <select
                value={propertyDetails && propertyDetails.NumberOfBedrooms}
                onChange={(e) => {
                  setPropertyDetails({
                    ...propertyDetails,
                    NumberOfBedrooms: e.target.value,
                  });
                }}
              >
                <option
                  defaultValue={
                    propertyDetails &&
                      propertyDetails.NumberOfBedrooms.toUpperCase ===
                      "SELECT BEDROOM"
                      ? true
                      : false
                  }
                >
                  Select Bedroom
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBedrooms === "1"
                      ? true
                      : false
                  }
                >
                  1
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBedrooms === "2"
                      ? true
                      : false
                  }
                >
                  2
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBedrooms === "3"
                      ? true
                      : false
                  }
                >
                  3
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBedrooms === "4"
                      ? true
                      : false
                  }
                >
                  4
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBedrooms === "5"
                      ? true
                      : false
                  }
                >
                  5
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBedrooms === "6"
                      ? true
                      : false
                  }
                >
                  6
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBedrooms === "7"
                      ? true
                      : false
                  }
                >
                  7
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBedrooms === "8"
                      ? true
                      : false
                  }
                >
                  8
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBedrooms === "9"
                      ? true
                      : false
                  }
                >
                  9
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBedrooms === "9+"
                      ? true
                      : false
                  }
                >
                  9+
                </option>
              </select>
              {/* <div className="field_icon">
                      <span className="material-symbols-outlined">bed</span>
                    </div> */}
            </div>
            <div className="fl_form_field new_single_field n_select_bg">
              <label className="no-floating">No. of Bathrooms</label>

              <select
                value={propertyDetails && propertyDetails.NumberOfBathrooms}
                onChange={(e) => {
                  setPropertyDetails({
                    ...propertyDetails,
                    NumberOfBathrooms: e.target.value,
                  });
                }}
              >
                <option
                  defaultValue={
                    propertyDetails &&
                      propertyDetails.NumberOfBathrooms.toUpperCase ===
                      "SELECT BATHROOM"
                      ? true
                      : false
                  }
                >
                  Select Bathroom
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBathrooms === "1"
                      ? true
                      : false
                  }
                >
                  1
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBathrooms === "2"
                      ? true
                      : false
                  }
                >
                  2
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBathrooms === "3"
                      ? true
                      : false
                  }
                >
                  3
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBathrooms === "4"
                      ? true
                      : false
                  }
                >
                  4
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBathrooms === "5"
                      ? true
                      : false
                  }
                >
                  5
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBathrooms === "6"
                      ? true
                      : false
                  }
                >
                  6
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBathrooms === "7"
                      ? true
                      : false
                  }
                >
                  7
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBathrooms === "8"
                      ? true
                      : false
                  }
                >
                  8
                </option>
                <option
                  defaultValue={
                    propertyDetails && propertyDetails.NumberOfBathrooms === "9"
                      ? true
                      : false
                  }
                >
                  9
                </option>
                <option
                  defaultValue={
                    propertyDetails &&
                      propertyDetails.NumberOfBathrooms === "9+"
                      ? true
                      : false
                  }
                >
                  9+
                </option>
              </select>
              {/* <div className="field_icon">
                      <span className="material-symbols-outlined">bathtub</span>
                    </div> */}
            </div>
            <div className="form_field st-2 new_radio_groups_parent new_single_field n_select_bg">
              <label className="no-floating">Furnishing</label>
              <div
                className="radio_group"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.Furnishing === "Semi"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_furnishing"
                      id="semi_furnished"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          Furnishing: "Semi",
                        });
                      }}
                    />
                    <label htmlFor="semi_furnished">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Semi</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.Furnishing === "Fully"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_furnishing"
                      id="fully_furnished"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          Furnishing: "Fully",
                        });
                      }}
                    />
                    <label htmlFor="fully_furnished">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Fully</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.Furnishing === "Raw"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_furnishing"
                      id="raw_furnished"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          Furnishing: "Raw",
                        });
                      }}
                    />
                    <label htmlFor="raw_furnished">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Raw</h6>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="form_field st-2 new_radio_groups_parent new_single_field n_select_bg">
              <label className="no-floating">
                Additional Rooms - ( {propertyDetails.AdditionalRooms.length} )
              </label>
              <div className="radio_group">
                <div className="radio_group_single">
                  <div
                    className={
                      propertyDetails.ServentRoomClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="servent_room"
                      onClick={(e) => {
                        if (propertyDetails.ServentRoomClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms:
                              propertyDetails.AdditionalRooms &&
                              propertyDetails.AdditionalRooms.filter(
                                (elem) => elem !== "Servent Room"
                              ),
                            ServentRoomClick: !propertyDetails.ServentRoomClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms: [
                              ...propertyDetails.AdditionalRooms,
                              "Servent Room",
                            ],
                            ServentRoomClick: !propertyDetails.ServentRoomClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="servent_room">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Servent Room</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single">
                  <div
                    className={
                      propertyDetails.OfficeRoomClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="office_room"
                      onClick={(e) => {
                        if (propertyDetails.OfficeRoomClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms:
                              propertyDetails.AdditionalRooms &&
                              propertyDetails.AdditionalRooms.filter(
                                (elem) => elem !== "Office Room"
                              ),
                            OfficeRoomClick: !propertyDetails.OfficeRoomClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms: [
                              ...propertyDetails.AdditionalRooms,
                              "Office Room",
                            ],
                            OfficeRoomClick: !propertyDetails.OfficeRoomClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="office_room">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Office Room</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single">
                  <div
                    className={
                      propertyDetails.StoreRoomClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="store_room"
                      onClick={(e) => {
                        if (propertyDetails.StoreRoomClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms:
                              propertyDetails.AdditionalRooms &&
                              propertyDetails.AdditionalRooms.filter(
                                (elem) => elem !== "Store Room"
                              ),
                            StoreRoomClick: !propertyDetails.StoreRoomClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms: [
                              ...propertyDetails.AdditionalRooms,
                              "Store Room",
                            ],
                            StoreRoomClick: !propertyDetails.StoreRoomClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="store_room">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6> Store Room</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single">
                  <div
                    className={
                      propertyDetails.PoojaRoomClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="pooja_room"
                      onClick={(e) => {
                        if (propertyDetails.PoojaRoomClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms:
                              propertyDetails.AdditionalRooms &&
                              propertyDetails.AdditionalRooms.filter(
                                (elem) => elem !== "Pooja Room"
                              ),
                            PoojaRoomClick: !propertyDetails.PoojaRoomClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms: [
                              ...propertyDetails.AdditionalRooms,
                              "Pooja Room",
                            ],
                            PoojaRoomClick: !propertyDetails.PoojaRoomClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="pooja_room">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6> Pooja Room</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single">
                  <div
                    className={
                      propertyDetails.StudyRoomClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="study_room"
                      onClick={(e) => {
                        if (propertyDetails.StudyRoomClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms:
                              propertyDetails.AdditionalRooms &&
                              propertyDetails.AdditionalRooms.filter(
                                (elem) => elem !== "Study Room"
                              ),
                            StudyRoomClick: !propertyDetails.StudyRoomClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms: [
                              ...propertyDetails.AdditionalRooms,
                              "Study Room",
                            ],
                            StudyRoomClick: !propertyDetails.StudyRoomClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="study_room">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6> Study Room</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single">
                  <div
                    className={
                      propertyDetails.PowerRoomClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="power_room"
                      onClick={(e) => {
                        if (propertyDetails.PowerRoomClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms:
                              propertyDetails.AdditionalRooms &&
                              propertyDetails.AdditionalRooms.filter(
                                (elem) => elem !== "Power Room"
                              ),
                            PowerRoomClick: !propertyDetails.PowerRoomClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms: [
                              ...propertyDetails.AdditionalRooms,
                              "Power Room",
                            ],
                            PowerRoomClick: !propertyDetails.PowerRoomClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="power_room">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                      </div>
                      <h6> Power Room</h6>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button className="theme_btn btn_fill" style={{
              width: "100%"
            }}>
              {propertyid === "new" ? "Add Property" : "Update Property"}
            </button>
            {formError && <p className="error">{formError}</p>}
          </div>
        </form>
        <div className="verticall_gap"></div>
      </div>
    </div>
  );
}
