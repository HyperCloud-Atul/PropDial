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

    const { documents: propertiesdocs, error: propertiesdocserror } = useCollection("properties", ["postedBy", "==", "Propdial"]);

    const { addDocument: addNewPropertyDocument, response: addNewPropertyDocumentResponse } =
        useFirestore("properties");
    const { addDocument: addPropertyUsersDocument, response: addPropertyUsersDocumentResponse } =
        useFirestore("propertyusers");

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
        Package: "PMS Premium",
        Flag: "Available For Rent",
        Category: "Residential",
        UnitNumber: "",
        DemandPrice: "",
        MaintenanceCharges: "",
        MaintenanceChargesFrequency: "",
        SecurityDeposit: "",
        Purpose: "",
        PropertyType: "",
        Bhk: "",
        FloorNo: 0,
        Country: "",
        Region: "",
        State: "",
        City: "",
        Locality: "",
        Society: "",
        Pincode: ""
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

        if (!(user && user.role === 'admin')) {
            navigate("/")
        }

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

            if (propertyDetails.PropertyType === "") {
                if (errorMsg === "Error: Please select ") errorMsg = "Please Enter Property Type";
                else errorMsg = errorMsg + ", Property Type";
                errorFlag = true;
            }

            if (propertyDetails.Bhk === "") {
                if (errorMsg === "Error: Please select ") errorMsg = "Please Enter BHK";
                else errorMsg = errorMsg + ", BHK";
                errorFlag = true;
            }

            if (propertyDetails.FloorNo === "") {
                if (errorMsg === "Error: Please select ") errorMsg = "Please Enter Floor No";
                else errorMsg = errorMsg + ", Floor No";
                errorFlag = true;
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
                package: propertyDetails.Package,
                flag: propertyDetails.Flag,
                category: propertyDetails.Category
                    ? propertyDetails.Category
                    : "Residential",
                unitNumber: propertyDetails.UnitNumber ? propertyDetails.UnitNumber : "",
                purpose: propertyDetails.Purpose ? propertyDetails.Purpose : "",
                propertyType: propertyDetails.PropertyType ? propertyDetails.PropertyType : "",
                bhk: propertyDetails.Bhk ? propertyDetails.Bhk : "",
                floorNo: propertyDetails.FloorNo ? propertyDetails.FloorNo : "",
                status: propertyDetails.Purpose === "Rent" ? "Available for Rent" : "Available for Sale",
                demandPrice: propertyDetails.DemandPrice
                    ? propertyDetails.DemandPrice
                    : "",
                maintenanceFlag: propertyDetails.MaintenanceFlag
                    ? propertyDetails.MaintenanceFlag
                    : "",
                maintenanceCharges: propertyDetails.MaintenanceCharges
                    ? propertyDetails.MaintenanceCharges
                    : "",
                maintenanceChargesFrequency: propertyDetails.MaintenanceChargesFrequency
                    ? propertyDetails.MaintenanceChargesFrequency
                    : "NA",
                securityDeposit: propertyDetails.SecurityDeposit
                    ? propertyDetails.SecurityDeposit
                    : "",
                state: state.label,
                city: city.label,
                // city: camelCase(propertyDetails.City.toLowerCase().trim()),
                locality: camelCase(propertyDetails.Locality.toLowerCase().trim()),
                society: camelCase(propertyDetails.Society.toLowerCase().trim()),
                pincode: propertyDetails.Pincode ? propertyDetails.Pincode : "",
            };

            const _newProperty = {
                ...property,
                //other property fields
                country: "India",
                region: "India",
                source: "",
                ownership: "",
                numberOfBedrooms: 0,
                numberOfBathrooms: 0,
                numberOfBalcony: 0,
                numberOfKitchen: 0,
                numberOfLivingArea: 0,
                numberOfBasement: 0,
                numberOfFloors: 0,
                numberOfFlatsOnFloor: 0,
                numberOfLifts: 0,
                numberOfOpenCarParking: 0,
                numberOfClosedCarParking: 0,
                twoWheelarParking: "",
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
                balconyFacing: "",
                visitingHrsFrom: "",
                visitingHrsTo: "",
                visitingDays: [],
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
                console.log("new property created: ")
                console.log(newProperty)
                setFormSuccess("Property Created Successfully");
                setFormError(null)
                const propertiesCount = propertiesdocs && propertiesdocs.length;
                const nextPropertySeqCounter = "PID" + (propertiesCount + 1)
                console.log("nextPropertySeqCounter: ", nextPropertySeqCounter)
                const _propertyWithSeqCounter = {
                    ..._newProperty,
                    pid: nextPropertySeqCounter
                }

                await addNewPropertyDocument(_propertyWithSeqCounter);
                if (addNewPropertyDocumentResponse.error) {
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
                        {/* Package */}
                        <div className="col-md-6">
                            <div className="form_field st-2 label_top">
                                <label htmlFor="">
                                    Package</label>
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Property Flags */}
                        <div className="col-md-6">
                            <div className="form_field st-2 label_top">
                                <label htmlFor="">
                                    Flags</label>
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
                                                        Rent or Sale
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        {/* Unit No */}
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
                        {/* Category */}
                        <div className="col-xl-4 col-lg-6">
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
                                                        Commercial
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                                        Rent
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
                                                        Sale
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
                                                propertyDetails && propertyDetails.FloorNo === "Select Floor No"
                                                    ? true
                                                    : false
                                            }
                                        >
                                            Select Floor No
                                        </option>
                                        <option
                                            defaultValue={
                                                propertyDetails && propertyDetails.FloorNo === "Basement"
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
                        <div className="col-xl-4 col-lg-6">
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

                        {propertyDetails && propertyDetails.Purpose === "Rent" && <div className="col-xl-4 col-lg-6">
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

                        {propertyDetails && propertyDetails.Purpose === "Rent" && <div className="col-xl-4 col-lg-6">
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
                    {formError && <p className="error">{formError}</p>}
                    {formSuccess && <p className="success">{formSuccess}</p>}
                    <div className="next_btn_back">
                        <button
                            className="theme_btn btn_border full_width no_icon"
                            onClick={handleBackSubmit}
                        >
                            {"<< Dashboard"}
                        </button>
                        <button
                            id="btn_create"
                            className="theme_btn btn_fill full_width no_icon"
                            onClick={(e) => handleSubmit(e, 'Next')}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>



    );
};

export default CreateProperty;
