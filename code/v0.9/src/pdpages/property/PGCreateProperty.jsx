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
import Back from "../back/Back";
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

//Convert Amount to Words - Starts

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

function convertToWords(number) {
    if (number === 0) {
        return "zero";
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
    const places = [
        "",
        "thousand",
        "million",
        "billion",
        "trillion",
        "quadrillion",
        "quintillion",
    ];
    return places[index];
}

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

const CreateProperty = () => {

    function setRedirectFlag(flag, key) { }
    const { user } = useAuthContext();

    let statesOptions = useRef([]);
    let statesOptionsSorted = useRef([]);
    let citiesOptions = useRef([]);
    let citiesOptionsSorted = useRef([]);
    var distinctCityList = [];
    var distinctLocalityList = [];
    var distinctSocietyList = [];
    const [state, setState] = useState({ label: "Select State", value: "Select State" });
    const [city, setCity] = useState({ label: "Select City", value: "Select City" });
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

    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end
    const navigate = useNavigate();

    const { documents: dbstatesdocuments, error: dbstateserror } = useCollection(
        "m_states",
        ["country", "==", "INDIA"]
    );

    const { documents: dbcitiesdocuments, error: dbcitieserror } = useCollection(
        "m_cities",
        ["status", "==", "active"]
    );

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
    //     dbpropertiesdocuments.map((doc) => {
    //         if (!distinctCityList.find((e) => e.city === doc.city)) {
    //             distinctCityList.push({
    //                 state: doc.state,
    //                 city: doc.city,
    //             });
    //         }
    //     });

    // dbpropertiesdocuments &&
    //     dbpropertiesdocuments.map((doc) => {
    //         if (!distinctLocalityList.find((e) => e.locality === doc.locality)) {
    //             distinctLocalityList.push({
    //                 city: doc.city,
    //                 locality: doc.locality,
    //             });
    //         }
    //     });
    // console.log('distinctLocalityList: ', distinctLocalityList)

    // dbpropertiesdocuments &&
    //     dbpropertiesdocuments.map((doc) => {
    //         if (!distinctSocietyList.find((e) => e.society === doc.society)) {
    //             distinctSocietyList.push({
    //                 locality: doc.locality,
    //                 society: doc.society,
    //             });
    //         }
    //     });

    const [propertyDetails, setPropertyDetails] = useState({
        // All select type
        Category: "Residential",
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

    }, [dbstatesdocuments]);

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

        setSearchedCity(option.value)
    }

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

        console.log('Locality dataList: ', dataList)

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


    const handleSubmit = async (e, option) => {
        console.log("In handleSubmit")
        e.preventDefault();
        // console.log('e: ', e)
        // console.log('option: ', option)

        setFormError(null);
        setFormSuccess(null);

        var btnProperties = document.getElementById("btn_create").innerHTML;
        console.log("btnName: ", btnProperties)
        if (btnProperties === "Properties") {
            // console.log("btnName: ", btnProperties)
            navigate("/dashboard");
        }
        else {

            let errorFlag = false;
            let errorMsg = "Error: Please select ";

            if (propertyDetails.Purpose === "" || propertyDetails.Purpose === "undefined" || propertyDetails.Purpose === null) {
                if (errorMsg === "Error: Please select ") errorMsg = errorMsg + "Purpose";
                else errorMsg = errorMsg + ", Purpose";
                errorFlag = true;
            }
            else {
                if ((propertyDetails.Purpose === "Rent") && (propertyDetails.MaintenanceFlag === "" || propertyDetails.MaintenanceFlag === "undefined" || propertyDetails.MaintenanceFlag == null)) {
                    if (errorMsg === "Error: Please select ") errorMsg = errorMsg + "Maintenance Status";
                    else errorMsg = errorMsg + ", Maintenance Status";
                    errorFlag = true;
                }
            }

            if (propertyDetails.DemandPrice === "" || propertyDetails.DemandPrice === "0") {
                if (errorMsg === "Error: Please select ") errorMsg = "Please Enter Demand Price";
                else errorMsg = errorMsg + ", Demand Price";
                errorFlag = true;
            }


            if (propertyDetails.MaintenanceCharges === "") {
                propertyDetails.MaintenanceChargesFrequency = "NA"
            } else {
                if (
                    (propertyDetails.MaintenanceCharges !== "") &&
                    propertyDetails.MaintenanceChargesFrequency === ""
                ) {
                    if (errorMsg === "Error: Please select ")
                        errorMsg = errorMsg + "Frequency";
                    else errorMsg = errorMsg + ", Frequency";
                    errorFlag = true;
                }
                else {
                    if (propertyDetails.MaintenanceCharges !== "" &&
                        propertyDetails.MaintenanceChargesFrequency === "NA") {
                        if (errorMsg === "Error: Please select ")
                            errorMsg = errorMsg + "Frequency";
                        else errorMsg = errorMsg + ", Frequency";
                        errorFlag = true;
                    }
                }
            }

            console.log('state:', state)
            if (state.label === "" || state === undefined || state.label === "Select State") {
                if (errorMsg === "Error: Please select ") errorMsg = errorMsg + "State";
                else errorMsg = errorMsg + ", State";
                errorFlag = true;
            }

            if (city.label === "" || city === undefined || city.label === "Select City") {
                if (errorMsg === "Error: Please select ") errorMsg = errorMsg + "City";
                else errorMsg = errorMsg + ", City";
                errorFlag = true;
            }

            if (propertyDetails.Locality === "") {
                if (errorMsg === "Error: Please select ") errorMsg = errorMsg + "Locality";
                else errorMsg = errorMsg + ", Locality";
                errorFlag = true;
            }
            if (propertyDetails.Society === "") {
                if (errorMsg === "Error: Please select ") errorMsg = errorMsg + "Society";
                else errorMsg = errorMsg + ", Society";
                errorFlag = true;
            }

            if (errorFlag) setFormError(errorMsg);
            else setFormError(null);

            const property = {
                category: propertyDetails.Category
                    ? propertyDetails.Category
                    : "Residential",
                unitNumber: propertyDetails.UnitNumber ? propertyDetails.UnitNumber : "",
                purpose: propertyDetails.Purpose ? propertyDetails.Purpose : "",
                status: propertyDetails.Purpose === "Rent" ? "Available for Rent" : "Available for Sale",
                demandprice: propertyDetails.DemandPrice
                    ? propertyDetails.DemandPrice
                    : "",
                maintenanceflag: propertyDetails.MaintenanceFlag
                    ? propertyDetails.MaintenanceFlag
                    : "",
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
            };

            const newProperty = {
                ...property,
                //other property fields
                source: "",
                ownership: "",
                package: "",
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
                propertyCoManager: "",
                propertySalesManager: "",
                propertyOwner: user.uid,
                propertyCoOwner: "",
                propertyPOC: "",
                tenantList: [],
                postedBy: "Propdial",
                isActiveInactiveReview: "In-Review",
                onboardingDate: timestamp.fromDate(new Date(onboardingDate)),
            };
            if (!errorFlag) {
                console.log("new property created: ")
                console.log(newProperty)
                setFormSuccess("Property Created Successfully");
                setFormError(null)
                await addDocument(newProperty);
                if (addDocumentResponse.error) {
                    navigate("/");
                } else {
                    // var x = document.getElementById("btn_create").name;
                    document.getElementById("btn_create").innerHTML = "Properties";
                    // navigate("/dashboard");
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
    return (

        <div className='top_header_pg pg_bg'>
            <div className="page_spacing">
                <Back pageTitle="Create Property" />
                <hr />
                <div className="vg22"></div>
                <div className="add_property_fields">
                    <div className="row row_gap">
                        <div className="col-md-4">
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

                        <div className="col-md-4">
                            <div className="form_field st-2 label_top">
                                <label htmlFor="">
                                    Category</label>
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



                        {/* <div className="col-md-4">
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
                        <div className="col-md-4">
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="col-md-4">
                            <div id="id_demand" className="form_field label_top">
                                <label htmlFor="">Demand/Price</label>
                                <div className="form_field_inner">
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
                                            setPropertyDetails({
                                                ...propertyDetails,
                                                // DemandPrice: e.target.value,
                                                DemandPrice: e.target.value.trim(),
                                                // DemandPriceInWords: amountToWords(e.target.value)
                                            });
                                        }}
                                        value={propertyDetails && propertyDetails.DemandPrice}
                                    />
                                    <div style={{ fontSize: "smaller" }}>
                                        {convertToWords(propertyDetails.DemandPrice)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {propertyDetails && propertyDetails.Purpose === "Rent" && <div className="col-md-4">
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
                                                        propertyDetails.MaintenanceFlag === "Excluded"
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
                                                                MaintenanceFlag: "Excluded",
                                                            });
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor="maintenanceflag_excluded"
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
                                                        <h6>Excluded</h6>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}

                        {propertyDetails && propertyDetails.Purpose === "Rent" && (
                            <div className="col-md-4">
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
                                                            <h6 style={{ fontSize: "0.8rem" }}>Half Yearly</h6>
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

                        {propertyDetails && propertyDetails.Purpose === "Rent" && <div className="col-md-4">
                            <div id="id_demand" className="form_field label_top">
                                <label htmlFor="">Security Deposit</label>
                                <div className="form_field_inner">
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
                                    <div style={{ fontSize: "smaller" }}>
                                        {convertToWords(propertyDetails.SecurityDeposit)}
                                    </div>
                                </div>
                            </div>
                        </div>}

                        {/* <div className="col-md-4">
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



                        {/* <div className="col-md-4">
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




                        <div className="col-md-4">
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

                        <div className="col-md-4">
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


                        <div className="col-md-4">
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
                        <div className="col-md-4">
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
                        <div className="col-md-4">
                            <div className="form_field label_top">
                                <label htmlFor="">Pincode number</label>
                                <div className="form_field_inner">
                                    <input
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
                                    />
                                    <div className="field_icon"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom_fixed_button">
                    <div className="verticall_gap"></div>
                    <div className="next_btn_back">
                        {formError && <p className="error">{formError}</p>}
                        {formSuccess && <p className="success">{formSuccess}</p>}
                        <br></br>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div className="" style={{ width: "100%", padding: "0 20px 0 0" }}>
                                <button
                                    className="theme_btn btn_fill"
                                    onClick={handleBackSubmit}
                                    style={{
                                        width: "100%",
                                    }}
                                >
                                    {"<< Dashboard"}
                                </button>
                            </div>

                            <div className="" style={{ width: "100%", padding: "0 0 0 20px" }}>
                                <button
                                    id="btn_create"
                                    className="theme_btn btn_fill"
                                    onClick={(e) => handleSubmit(e, 'Next')}
                                    style={{
                                        width: "100%",
                                    }}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    );
};

export default CreateProperty;
