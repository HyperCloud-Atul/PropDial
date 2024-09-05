import React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import { timestamp } from "../../firebase/config";
import Select from "react-select";

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




const Stage2 = (props) => {
  const { propertyid } = useParams();
  // console.log('property id in Stage 2: ', propertyid)
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);
  const [years, setYears] = useState({ label: "", value: "" });
  const [yearOfConstruction, setYearOfConstruction] = useState({ label: "Year of Construction", value: "Year of Construction" });
  const { document: propertyDocument, error: propertyerror } = useDocument(
    "properties",
    propertyid
  );
  // console.log('propertyDocument:', propertyDocument)
  const { updateDocument, response: updateDocumentResponse } =
    useFirestore("properties");

  const [propertyDetails, setPropertyDetails] = useState({
    // All select type
    PropertyType: "",
    Bhk: "",
    SuperArea: "",
    SuperAreaUnit: "",
    CarpetArea: "",
    CarpetAreaUnit: "",
    NumberOfBedrooms: "0",
    NumberOfBathrooms: "0",
    NumberOfBalcony: "0",
    NumberOfKitchen: "0",
    NumberOfLivingArea: "0",
    NumberOfBasement: "0",
    DiningArea: "",
    LivingAndDining: "",
    Passage: "",
    EntranceGallery: "",
    Furnishing: "Raw",
    AdditionalRooms: [],
    ServentRoomOneClick: false,
    ServentRoomTwoClick: false,
    OfficeRoomClick: false,
    StoreRoomClick: false,
    PoojaRoomClick: false,
    StudyRoomClick: false,
    PowerRoomClick: false,
    AdditionalArea: [],
    FrontYardClick: false,
    BackYardClick: false,
    TerraceClick: false,
    PrivateGardenClick: false,
    GarageClick: false,
    PowerBackup: "",
    NumberOfFloors: 1,
    FloorNo: 0,
    NumberOfFlatsOnFloor: 0,
    NumberOfLifts: 0,
    NumberOfOpenCarParking: 0,
    NumberOfClosedCarParking: 0,
    TwoWheelarParking: "No",
    LockinPeriod: 6,
    YearOfConstruction: { label: 0, value: 0 },
    // AgeOfProperty: 0,
  });

  useEffect(() => {

    if (propertyDocument) {
      // console.log("propertyDocument:", propertyDocument);

      setYearOfConstruction({
        label: propertyDocument.yearOfConstruction,
        value: propertyDocument.yearOfConstruction,
      })

      setPropertyDetails({
        // All select type
        PropertyType: propertyDocument.propertyType
          ? propertyDocument.propertyType
          : "Select Property Type",
        Bhk: propertyDocument.bhk ? propertyDocument.bhk : "Select BHK",
        SuperArea: propertyDocument.superArea,
        SuperAreaUnit: propertyDocument.superAreaUnit,
        CarpetArea: propertyDocument.carpetArea,
        CarpetAreaUnit: propertyDocument.carpetAreaUnit,
        NumberOfBedrooms: propertyDocument.numberOfBedrooms
          ? propertyDocument.numberOfBedrooms
          : "0",
        NumberOfBathrooms: propertyDocument.numberOfBathrooms
          ? propertyDocument.numberOfBathrooms
          : "0",
        NumberOfBalcony: propertyDocument.numberOfBalcony
          ? propertyDocument.numberOfBalcony
          : "0",
        NumberOfKitchen: propertyDocument.numberOfKitchen
          ? propertyDocument.numberOfKitchen
          : "0",
        NumberOfLivingArea: propertyDocument.numberOfLivingArea
          ? propertyDocument.numberOfLivingArea
          : "0",
        NumberOfBasement: propertyDocument.numberOfBasement
          ? propertyDocument.numberOfBasement
          : "0",
        DiningArea: propertyDocument.diningArea
          ? propertyDocument.diningArea
          : "",
        LivingAndDining: propertyDocument.livingAndDining
          ? propertyDocument.livingAndDining
          : "",
        EntranceGallery: propertyDocument.entranceGallery
          ? propertyDocument.entranceGallery
          : "",
        Passage: propertyDocument.passage
          ? propertyDocument.passage
          : "",
        Furnishing: propertyDocument.furnishing
          ? propertyDocument.furnishing
          : "Raw",
        AdditionalRooms: propertyDocument.additionalRooms
          ? propertyDocument.additionalRooms
          : [],
          ServentRoomOneClick:
          propertyDocument.additionalRooms &&
            propertyDocument.additionalRooms.find((e) => e === "Servent Room 1")
            ? true
            : false,
            ServentRoomTwoClick:
            propertyDocument.additionalRooms &&
              propertyDocument.additionalRooms.find((e) => e === "Servent Room 2")
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
        BasementClick:
          propertyDocument.additionalRooms &&
            propertyDocument.additionalRooms.find((e) => e === "Basement")
            ? true
            : false,

        AdditionalArea: propertyDocument.additionalArea
          ? propertyDocument.additionalArea
          : [],
        FrontYardClick:
          propertyDocument.additionalArea &&
            propertyDocument.additionalArea.find((e) => e === "Front Yard")
            ? true
            : false,
        BackYardClick:
          propertyDocument.additionalArea &&
            propertyDocument.additionalArea.find((e) => e === "Back Yard")
            ? true
            : false,
        TerraceClick:
          propertyDocument.additionalArea &&
            propertyDocument.additionalArea.find((e) => e === "Terrace")
            ? true
            : false,
        PrivateGardenClick:
          propertyDocument.additionalArea &&
            propertyDocument.additionalArea.find((e) => e === "Private Garden")
            ? true
            : false,
        GarageClick:
          propertyDocument.additionalArea &&
            propertyDocument.additionalArea.find((e) => e === "Garage")
            ? true
            : false,
        PowerBackup: propertyDocument.powerBackup ? propertyDocument.powerBackup : "",
        NumberOfFloors: propertyDocument.numberOfFloors ? propertyDocument.numberOfFloors : 1,
        FloorNo: propertyDocument.floorNo ? propertyDocument.floorNo : 0,
        NumberOfFlatsOnFloor: propertyDocument.numberOfFlatsOnFloor ? propertyDocument.numberOfFlatsOnFloor : 0,
        NumberOfLifts: propertyDocument.numberOfLifts ? propertyDocument.numberOfLifts : 0,
        NumberOfOpenCarParking: propertyDocument.numberOfOpenCarParking ? propertyDocument.numberOfOpenCarParking : 0,
        NumberOfClosedCarParking: propertyDocument.numberOfClosedCarParking ? propertyDocument.numberOfClosedCarParking : 0,
        TwoWheelarParking: propertyDocument.twoWheelarParking ? propertyDocument.twoWheelarParking : "No",
        LockinPeriod: propertyDocument.lockinPeriod ? propertyDocument.lockinPeriod : 6,
        YearOfConstruction: propertyDocument.yearOfConstruction ? propertyDocument.yearOfConstruction : "Year of Construction",
        // AgeOfProperty: propertyDocument.ageOfProperty ? propertyDocument.ageOfProperty : ""

      });
    }


  }, [propertyDocument]);

  const handleBackSubmit = (e) => {
    // console.log('handleBackSubmit')
    props.setStateFlag("stage1");
  };

  function incrementInput(input) {
    var inputValue = document.getElementById(input).value;
    if (inputValue === "99") {
      //Don't do anything
    } else {
      inputValue++;
      if (input === "bedroomNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfBedrooms: inputValue,
        });
      } else if (input === "bathroomNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfBathrooms: inputValue,
        });
      } else if (input === "balconyNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfBalcony: inputValue,
        });
      }
      else if (input === "kitchenNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfKitchen: inputValue,
        });
      }
      else if (input === "livingAreaNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfLivingArea: inputValue,
        });
      }
      else if (input === "basementNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfBasement: inputValue,
        });
      }
      else if (input === "floorNoInput") {
        setPropertyDetails({
          ...propertyDetails,
          FloorNo: inputValue,
        });
      }
      else if (input === "numberOfFloorsInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfFloors: inputValue,
        });
      }
      else if (input === "numberOfFlatsOnFloorInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfFlatsOnFloor: inputValue,
        });
      }
      else if (input === "numberOfLiftsInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfLifts: inputValue,
        });
      }
      else if (input === "numberOfOpenCarParkingInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfOpenCarParking: inputValue,
        });
      }
      else if (input === "numberOfClosedCarParkingInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfClosedCarParking: inputValue,
        });
      }
      else if (input === "lockinperiodInput") {
        setPropertyDetails({
          ...propertyDetails,
          LockinPeriod: inputValue,
        });
      }
    }
  }

  // function decrementInput(input) {
  //   var inputValue = document.getElementById(input).value;
  //   console.log("input value in decrementInput:", inputValue)
  //   if (inputValue === "0") {
  //     //Don't do anything
  //   } else {
  //     inputValue--;
  //     if (input === "bedroomNumberInput") {
  //       setPropertyDetails({
  //         ...propertyDetails,
  //         NumberOfBedrooms: inputValue,
  //       });
  //     } else if (input === "bathroomNumberInput") {
  //       setPropertyDetails({
  //         ...propertyDetails,
  //         NumberOfBathrooms: inputValue,
  //       });
  //     } else if (input === "balconyNumberInput") {
  //       setPropertyDetails({
  //         ...propertyDetails,
  //         NumberOfBalcony: inputValue,
  //       });
  //     }
  //     else if (input === "kitchenNumberInput") {
  //       setPropertyDetails({
  //         ...propertyDetails,
  //         NumberOfKitchen: inputValue,
  //       });
  //     }
  //     else if (input === "livingAreaNumberInput") {
  //       setPropertyDetails({
  //         ...propertyDetails,
  //         NumberOfLivingArea: inputValue,
  //       });
  //     }
  //     else if (input === "basementNumberInput") {
  //       setPropertyDetails({
  //         ...propertyDetails,
  //         NumberOfBasement: inputValue,
  //       });
  //     }
  //     else if (input === "floorNoInput") {
  //       setPropertyDetails({
  //         ...propertyDetails,
  //         FloorNo: inputValue,
  //       });
  //     }
  //     else if (input === "numberOfFloorsInput") {
  //       setPropertyDetails({
  //         ...propertyDetails,
  //         NumberOfFloors: inputValue,
  //       });
  //     }
  //     else if (input === "numberOfFlatsOnFloorInput") {
  //       setPropertyDetails({
  //         ...propertyDetails,
  //         NumberOfFlatsOnFloor: inputValue,
  //       });
  //     }
  //     else if (input === "numberOfLiftsInput") {
  //       setPropertyDetails({
  //         ...propertyDetails,
  //         NumberOfLifts: inputValue,
  //       });
  //     }
  //     else if (input === "numberOfOpenCarParkingInput") {
  //       setPropertyDetails({
  //         ...propertyDetails,
  //         NumberOfOpenCarParking: inputValue,
  //       });
  //     }
  //     else if (input === "numberOfClosedCarParkingInput") {
  //       setPropertyDetails({
  //         ...propertyDetails,
  //         NumberOfClosedCarParking: inputValue,
  //       });
  //     }
  //     else if (input === "lockinperiodInput") {
  //       setPropertyDetails({
  //         ...propertyDetails,
  //         LockinPeriod: inputValue,
  //       });
  //     }
  //   }
  // }


  function decrementInput(input) {
    var inputValue = document.getElementById(input).value;
  
    if (input === "floorNoInput" && inputValue > -1) {
      inputValue--; // Allow FloorNo to go to -1
      setPropertyDetails({
        ...propertyDetails,
        FloorNo: inputValue,
      });
    } else if (inputValue > 0) {
      inputValue--; // Ensure all others don't go below 0
      if (input === "bedroomNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfBedrooms: inputValue,
        });
      } else if (input === "bathroomNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfBathrooms: inputValue,
        });
      } else if (input === "balconyNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfBalcony: inputValue,
        });
      } else if (input === "kitchenNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfKitchen: inputValue,
        });
      } else if (input === "livingAreaNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfLivingArea: inputValue,
        });
      } else if (input === "basementNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfBasement: inputValue,
        });
      } else if (input === "numberOfFloorsInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfFloors: inputValue,
        });
      } else if (input === "numberOfFlatsOnFloorInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfFlatsOnFloor: inputValue,
        });
      } else if (input === "numberOfLiftsInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfLifts: inputValue,
        });
      } else if (input === "numberOfOpenCarParkingInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfOpenCarParking: inputValue,
        });
      } else if (input === "numberOfClosedCarParkingInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfClosedCarParking: inputValue,
        });
      } else if (input === "lockinperiodInput") {
        setPropertyDetails({
          ...propertyDetails,
          LockinPeriod: inputValue,
        });
      }
    }
  }
  



  const handleNextSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    let errorFlag = false;
    let errorMsg = "Please select ";

    if (
      propertyDetails.PropertyType.toUpperCase() === "SELECT PROPERTY TYPE" ||
      propertyDetails.PropertyType === ""
    ) {
      if (errorMsg === "Please select ") errorMsg = errorMsg + "Property Type";
      else errorMsg = errorMsg + ", Property Type";
      errorFlag = true;
    }
    if (
      propertyDetails.Bhk.toUpperCase() === "SELECT BHK" ||
      propertyDetails.Bhk === ""
    ) {
      if (errorMsg === "Select BHK") errorMsg = errorMsg + "BHK";
      else errorMsg = errorMsg + ", BHK";
      errorFlag = true;
    }
    // console.log(
    //   "propertyDetails.NumberOfBedrooms:",
    //   propertyDetails.NumberOfBedrooms
    // );
    if (
      // propertyDetails && propertyDetails.NumberOfBedrooms.toUpperCase() === "SELECT BEDROOM" ||
      Number(propertyDetails.NumberOfBedrooms) === 0
    ) {
      if (errorMsg === "Select Bedroom") errorMsg = errorMsg + "Bedroom";
      else errorMsg = errorMsg + ", Bedroom";
      errorFlag = true;
    }
    if (
      // propertyDetails.NumberOfBathrooms.toUpperCase() === "SELECT BATHROOM" ||
      Number(propertyDetails.NumberOfBathrooms) === 0
    ) {
      if (errorMsg === "Select Bathroom") errorMsg = errorMsg + "Bathroom";
      else errorMsg = errorMsg + ", Bathroom";
      errorFlag = true;
    }

    if (
      (propertyDetails.SuperArea === "" && propertyDetails.CarpetArea === "") ||
      (propertyDetails.SuperArea === "0" && propertyDetails.CarpetArea === "0")
    ) {
      if (errorMsg === "Enter Super Area or Carpet Area or both")
        errorMsg = errorMsg + "Enter Super Area or Carpet Area or both";
      else errorMsg = errorMsg + ", Enter Super Area or Carpet Area or both";
      errorFlag = true;
    } 

    if (
      propertyDetails.SuperArea !== null && 
      Number(propertyDetails.SuperArea) !== 0 &&
      Number(propertyDetails.SuperArea) <= Number(propertyDetails.CarpetArea)
    ) {
      if (errorMsg === "Please select ") {
        errorMsg = "Carpet Area should be less than Super Area";
      } else {
        errorMsg = errorMsg + ", Carpet Area should be less than Super Area";
      }
      errorFlag = true;
    }

    if (errorFlag) setFormError(errorMsg);
    else setFormError("");

    // errorFlag = false;

    const property = {
      propertyType: propertyDetails.PropertyType,
      bhk: propertyDetails.Bhk,
      numberOfBedrooms: propertyDetails.NumberOfBedrooms,
      numberOfBathrooms: propertyDetails.NumberOfBathrooms,
      numberOfBalcony: propertyDetails.NumberOfBalcony,
      numberOfKitchen: propertyDetails.NumberOfKitchen,
      numberOfLivingArea: propertyDetails.NumberOfLivingArea,
      numberOfBasement: propertyDetails.NumberOfBasement,
      diningArea: propertyDetails.DiningArea,
      livingAndDining: propertyDetails.LivingAndDining,
      passage: propertyDetails.Passage,
      entranceGallery: propertyDetails.EntranceGallery,
      furnishing: propertyDetails.Furnishing,
      additionalRooms: propertyDetails.AdditionalRooms
        ? propertyDetails.AdditionalRooms
        : [],
      additionalArea: propertyDetails.AdditionalArea
        ? propertyDetails.AdditionalArea
        : [],
      superArea: propertyDetails.SuperArea ? propertyDetails.SuperArea : "",
      carpetArea: propertyDetails.CarpetArea ? propertyDetails.CarpetArea : "",
      superAreaUnit: propertyDetails.SuperAreaUnit,
      carpetAreaUnit: propertyDetails.SuperAreaUnit,

      powerBackup: propertyDetails.PowerBackup ? propertyDetails.PowerBackup : "",
      numberOfFloors: propertyDetails.NumberOfFloors ? propertyDetails.NumberOfFloors : 0,
      floorNo: propertyDetails.FloorNo ? propertyDetails.FloorNo : "",
      numberOfFlatsOnFloor: propertyDetails.NumberOfFlatsOnFloor ? propertyDetails.NumberOfFlatsOnFloor : 0,
      numberOfLifts: propertyDetails.NumberOfLifts ? propertyDetails.NumberOfLifts : 0,
      numberOfOpenCarParking: propertyDetails.NumberOfOpenCarParking ? propertyDetails.NumberOfOpenCarParking : 0,
      numberOfClosedCarParking: propertyDetails.NumberOfClosedCarParking ? propertyDetails.NumberOfClosedCarParking : 0,

      twoWheelarParking: propertyDetails.TwoWheelarParking ? propertyDetails.TwoWheelarParking : "",
      lockinPeriod: propertyDetails.LockinPeriod ? propertyDetails.LockinPeriod : 0,
      yearOfConstruction: propertyDetails.YearOfConstruction,
      // ageOfProperty: propertyDetails.AgeOfProperty ? propertyDetails.AgeOfProperty : document.getElementById('ageOfPropertyCount'),
    };

    // console.log('property:', property)

    if (propertyid !== "new") {
      const updatedProperty = {
        ...property,
        updatedAt: timestamp.fromDate(new Date()),
        updatedBy: user.uid,
      };

      if (!errorFlag) {
        console.log('updatedProperty:', updatedProperty)
        // console.log('propertyid:', propertyid)
        await updateDocument(propertyid, updatedProperty);

        if (updateDocumentResponse.error) {
          navigate("/");
        } else {
          props.setStateFlag("stage3");
        }
      }
    }
  };


  // const [years, setYears] = useState([]);
  // Function to generate years from 1980 to current year
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1980;
    const yearArray = [];
    for (let year = startYear; year <= currentYear; year++) {
      yearArray.push({
        label: year,
        value: year,
      });
    }
    yearArray.unshift({
      label: "Year of Construction",
      value: "Year of Construction"
    })
    return yearArray;
  };

  useEffect(() => {
    const yearList = generateYears();
    setYears(yearList);
  }, []);



  const handleYearOfConstructionChange = async (option) => {
    // console.log('Year Of Construction option: ', option)

    // const ageOfProperty = (new Date().getFullYear()) - Number(option.value);

    setPropertyDetails({
      ...propertyDetails,
      YearOfConstruction: option.value,
      // AgeOfProperty: ageOfProperty,
    });

    setYearOfConstruction({ label: option.value, value: option.value })
  }

  return (
    <form>
      <div className="add_property_fields">
        <div className="row row_gap form_full">
          {/* Property Type */}
          <div className="col-md-4">
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
          {/* BHK */}
          <div className="col-md-4">
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
          {/* Furnishing */}
          <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Furnishing</label>
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
          </div>
          {/* Rooms */}
          <div className="col-md-6">
            <div className="form_field label_top">
              <label htmlFor="">Rooms</label>
              <div className="increase_input_parent">
                <div className="plus_minus_input_wrapper">
                  <span className="pmi_label">Bedroom</span>
                  <div className="plus_minus_input">
                    <div
                      className="left-minus-button pmbutton"
                      onClick={() => {
                        decrementInput("bedroomNumberInput");
                      }}
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </div>

                    <input
                      id="bedroomNumberInput"
                      type="number"
                      disabled
                      value={propertyDetails && propertyDetails.NumberOfBedrooms}
                    />
                    <div
                      className="right-plus-button pmbutton"
                      onClick={() => {
                        incrementInput("bedroomNumberInput");
                      }}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  </div>
                </div>
                <div className="plus_minus_input_wrapper">
                  <span className="pmi_label">Bathroom</span>
                  <div className="plus_minus_input">
                    <div
                      className="left-minus-button pmbutton"
                      onClick={() => {
                        decrementInput("bathroomNumberInput");
                      }}
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </div>

                    <input
                      id="bathroomNumberInput"
                      type="number"
                      disabled
                      value={propertyDetails && propertyDetails.NumberOfBathrooms}
                    />
                    <div
                      className="right-plus-button pmbutton"
                      onClick={() => {
                        incrementInput("bathroomNumberInput");
                      }}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  </div>
                </div>
                <div className="plus_minus_input_wrapper">
                  <span className="pmi_label">Balcony</span>
                  <div className="plus_minus_input">
                    <div
                      className="left-minus-button pmbutton"
                      onClick={() => {
                        decrementInput("balconyNumberInput");
                      }}
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </div>

                    <input
                      id="balconyNumberInput"
                      type="number"
                      disabled
                      value={propertyDetails && propertyDetails.NumberOfBalcony}
                    />
                    <div
                      className="right-plus-button pmbutton"
                      onClick={() => {
                        incrementInput("balconyNumberInput");
                      }}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  </div>
                </div>
                <div className="plus_minus_input_wrapper">
                  <span className="pmi_label">Kitchen</span>
                  <div className="plus_minus_input">
                    <div
                      className="left-minus-button pmbutton"
                      onClick={() => {
                        decrementInput("kitchenNumberInput");
                      }}
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </div>

                    <input
                      id="kitchenNumberInput"
                      type="number"
                      disabled
                      value={propertyDetails && propertyDetails.NumberOfKitchen}
                    />
                    <div
                      className="right-plus-button pmbutton"
                      onClick={() => {
                        incrementInput("kitchenNumberInput");
                      }}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  </div>
                </div>
                <div className="plus_minus_input_wrapper">
                  <span className="pmi_label">Living Area</span>
                  <div className="plus_minus_input">
                    <div
                      className="left-minus-button pmbutton"
                      onClick={() => {
                        decrementInput("livingAreaNumberInput");
                      }}
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </div>

                    <input
                      id="livingAreaNumberInput"
                      type="number"
                      disabled
                      value={propertyDetails && propertyDetails.NumberOfLivingArea}
                    />
                    <div
                      className="right-plus-button pmbutton"
                      onClick={() => {
                        incrementInput("livingAreaNumberInput");
                      }}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  </div>
                </div>
                <div className="plus_minus_input_wrapper">
                  <span className="pmi_label">Basement</span>
                  <div className="plus_minus_input">
                    <div
                      className="left-minus-button pmbutton"
                      onClick={() => {
                        decrementInput("basementNumberInput");
                      }}
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </div>

                    <input
                      id="basementNumberInput"
                      type="number"
                      disabled
                      value={propertyDetails && propertyDetails.NumberOfBasement}
                    />
                    <div
                      className="right-plus-button pmbutton"
                      onClick={() => {
                        incrementInput("basementNumberInput");
                      }}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Additional Rooms */}
          <div className="col-md-6">
            <div className="form_field st-2 label_top">
              <label htmlFor=""> Additional Rooms - ( {propertyDetails.AdditionalRooms.length} )</label>
              <div className="radio_group">
                <div className="radio_group_single">
                  <div
                    className={
                      propertyDetails.ServentRoomOneClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="servent_room_1"
                      onClick={(e) => {
                        if (propertyDetails.ServentRoomOneClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms:
                              propertyDetails.AdditionalRooms &&
                              propertyDetails.AdditionalRooms.filter(
                                (elem) => elem !== "Servent Room 1"
                              ),
                              ServentRoomOneClick: !propertyDetails.ServentRoomOneClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms: [
                              ...propertyDetails.AdditionalRooms,
                              "Servent Room 1",
                            ],
                            ServentRoomOneClick: !propertyDetails.ServentRoomOneClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="servent_room_1">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Servent Room 1</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single">
                  <div
                    className={
                      propertyDetails.ServentRoomTwoClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="servent_room_2"
                      onClick={(e) => {
                        if (propertyDetails.ServentRoomTwoClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms:
                              propertyDetails.AdditionalRooms &&
                              propertyDetails.AdditionalRooms.filter(
                                (elem) => elem !== "Servent Room 2"
                              ),
                              ServentRoomTwoClick: !propertyDetails.ServentRoomTwoClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms: [
                              ...propertyDetails.AdditionalRooms,
                              "Servent Room 2",
                            ],
                            ServentRoomTwoClick: !propertyDetails.ServentRoomTwoClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="servent_room_2">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Servent Room 2</h6>
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
                  {/* {console.log(propertyDetails.StudyRoomClick)} */}
                  <div
                    className={
                      propertyDetails.StudyRoomClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button "
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
                <div className="radio_group_single">
                  <div
                    className={
                      propertyDetails.BasementClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="basement_room"
                      onClick={(e) => {
                        if (propertyDetails.BasementClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms:
                              propertyDetails.AdditionalRooms &&
                              propertyDetails.AdditionalRooms.filter(
                                (elem) => elem !== "Basement"
                              ),
                            BasementClick: !propertyDetails.BasementClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms: [
                              ...propertyDetails.AdditionalRooms,
                              "Basement",
                            ],
                            BasementClick: !propertyDetails.BasementClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="basement_room">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                      </div>
                      <h6>Basement</h6>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Dining Area */}
          <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Dining Area</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.DiningArea === "Yes"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="diningArea_yes"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              DiningArea: "Yes",
                            });
                          }}
                        />
                        <label
                          htmlFor="diningArea_yes"
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
                          <h6>Yes</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.DiningArea === "No"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="diningArea_no"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              DiningArea: "No",
                            });
                          }}
                        />
                        <label
                          htmlFor="diningArea_no"
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
                          <h6>No</h6>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Living & Dining */}
          <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Living & Dining</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.LivingAndDining === "Yes"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="livinganddining_yes"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              LivingAndDining: "Yes",
                            });
                          }}
                        />
                        <label
                          htmlFor="livinganddining_yes"
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
                          <h6>Yes</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.LivingAndDining === "No"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="livinganddining_no"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              LivingAndDining: "No",
                            });
                          }}
                        />
                        <label
                          htmlFor="livinganddining_no"
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
                          <h6>No</h6>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* Passages */}
          <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Passages</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Passage === "Yes"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="passage_yes"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Passage: "Yes",
                            });
                          }}
                        />
                        <label
                          htmlFor="passage_yes"
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
                          <h6>Yes</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.Passage === "No"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="passage_no"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Passage: "No",
                            });
                          }}
                        />
                        <label
                          htmlFor="passage_no"
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
                          <h6>No</h6>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Entrance Gallery */}
          <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Entrance Gallery</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.EntranceGallery === "Yes"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="entrancegallery_yes"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              EntranceGallery: "Yes",
                            });
                          }}
                        />
                        <label
                          htmlFor="entrancegallery_yes"
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
                          <h6>Yes</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.EntranceGallery === "No"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="entrancegallery_no"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              EntranceGallery: "No",
                            });
                          }}
                        />
                        <label
                          htmlFor="entrancegallery_no"
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
                          <h6>No</h6>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Year of Construction */}
          <div className="col-md-4">
            <div className="form_field label_top">
              <label htmlFor="">Year of Constuction</label>
              <div className="form_field_inner">
                <Select
                  id="yearOfConstructionSelect"
                  className=""
                  onChange={handleYearOfConstructionChange}
                  options={years}
                  // value={propertyDetails && propertyDetails.YearOfConstruction}
                  value={yearOfConstruction}
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
                >

                </Select>

              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div id="id_demand" className="form_field label_top">
              <label htmlFor="">Age Of Property</label>
              <div className="form_field_inner">
                <input
                  id="ageOfPropertyCount"
                  className="custom-input"
                  disabled
                  type="text"
                  placeholder="Enter Here"
                  maxLength={9}
                  onInput={(e) => {
                    restrictInput(e, 9);
                  }}
                  value={propertyDetails && (((new Date().getFullYear()) - Number(propertyDetails.YearOfConstruction)) + " Years")}
                />
              </div>
            </div>

          </div>
          {/* Additional Area */}
          <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor=""> Additional Area  - ( {propertyDetails.AdditionalArea.length} )</label>
              <div className="radio_group">
                <div className="radio_group_single">
                  <div
                    className={
                      propertyDetails.FrontYardClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="frontyard_area"
                      onClick={(e) => {
                        if (propertyDetails.FrontYardClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalArea:
                              propertyDetails.AdditionalArea &&
                              propertyDetails.AdditionalArea.filter(
                                (elem) => elem !== "Front Yard"
                              ),
                            FrontYardClick: !propertyDetails.FrontYardClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalArea: [
                              ...propertyDetails.AdditionalArea,
                              "Front Yard",
                            ],
                            FrontYardClick: !propertyDetails.FrontYardClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="frontyard_area">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Front Yard</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single">
                  <div
                    className={
                      propertyDetails.BackYardClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="backyard_area"
                      onClick={(e) => {
                        if (propertyDetails.BackYardClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalArea:
                              propertyDetails.AdditionalArea &&
                              propertyDetails.AdditionalArea.filter(
                                (elem) => elem !== "Back Yard"
                              ),
                            BackYardClick: !propertyDetails.BackYardClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalArea: [
                              ...propertyDetails.AdditionalArea,
                              "Back Yard",
                            ],
                            BackYardClick: !propertyDetails.BackYardClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="backyard_area">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Back Yard</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single">
                  <div
                    className={
                      propertyDetails.TerraceClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="terrace_area"
                      onClick={(e) => {
                        if (propertyDetails.TerraceClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalArea:
                              propertyDetails.AdditionalArea &&
                              propertyDetails.AdditionalArea.filter(
                                (elem) => elem !== "Terrace"
                              ),
                            TerraceClick: !propertyDetails.TerraceClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalArea: [
                              ...propertyDetails.AdditionalArea,
                              "Terrace",
                            ],
                            TerraceClick: !propertyDetails.TerraceClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="terrace_area">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Terrace</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single">
                  <div
                    className={
                      propertyDetails.PrivateGardenClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="privategarden_area"
                      onClick={(e) => {
                        if (propertyDetails.PrivateGardenClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalArea:
                              propertyDetails.AdditionalArea &&
                              propertyDetails.AdditionalArea.filter(
                                (elem) => elem !== "Private Garden"
                              ),
                            PrivateGardenClick: !propertyDetails.PrivateGardenClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalArea: [
                              ...propertyDetails.AdditionalArea,
                              "Private Garden",
                            ],
                            PrivateGardenClick: !propertyDetails.PrivateGardenClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="privategarden_area">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Private Garden</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single">
                  {/* {console.log(propertyDetails.StudyRoomClick)} */}
                  <div
                    className={
                      propertyDetails.GarageClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button "
                    }
                  >
                    <input
                      type="checkbox"
                      id="garage_area"
                      onClick={(e) => {
                        if (propertyDetails.GarageClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalArea:
                              propertyDetails.AdditionalArea &&
                              propertyDetails.AdditionalArea.filter(
                                (elem) => elem !== "Garage"
                              ),
                            GarageClick: !propertyDetails.GarageClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalArea: [
                              ...propertyDetails.AdditionalArea,
                              "Garage",
                            ],
                            GarageClick: !propertyDetails.GarageClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="garage_area">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Garage</h6>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Power Backup */}
          <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Power Backup</label>
              <div
                className="radio_group"
                style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
              >
                <div className="radio_group_single" style={{ minWidth: "30%", width: "fit-content" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.PowerBackup === "No Backup"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_furnishing"
                      id="nobackup_powerbackup"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          PowerBackup: "No Backup",
                        });
                      }}
                    />
                    <label htmlFor="nobackup_powerbackup">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>No Backup</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single" style={{ minWidth: "30%", width: "fit-content" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.PowerBackup === "Full Backup"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_furnishing"
                      id="fullbackup_powerbackup"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          PowerBackup: "Full Backup",
                        });
                      }}
                    />
                    <label htmlFor="fullbackup_powerbackup">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Full Backup</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single" style={{ minWidth: "30%", width: "fit-content" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.PowerBackup === "Partial Backup"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_furnishing"
                      id="partialbackup_powerbackup"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          PowerBackup: "Partial Backup",
                        });
                      }}
                    />
                    <label htmlFor="partialbackup_powerbackup">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Partial Backup</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single" style={{ minWidth: "30%", width: "fit-content" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.PowerBackup === "Lift Only"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_furnishing"
                      id="liftonly_powerbackup"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          PowerBackup: "Lift Only",
                        });
                      }}
                    />
                    <label htmlFor="liftonly_powerbackup">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Lift Only</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single" style={{ minWidth: "30%", width: "fit-content" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.PowerBackup === "Inverter"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_furnishing"
                      id="inverter_powerbackup"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          PowerBackup: "Inverter",
                        });
                      }}
                    />
                    <label htmlFor="inverter_powerbackup">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Inverter</h6>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Super & Carpet Area */}
          <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Super area and Carpet area</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "100%", padding: "5px 0 " }}>
                  <input
                    id="id_superArea"
                    className="custom-input"
                    style={{ paddingRight: "10px" }}
                    type="text"
                    placeholder="Super Area"
                    maxLength={6}
                    onInput={(e) => {
                      restrictInput(e, 5);
                    }}
                    onChange={(e) =>
                      setPropertyDetails({
                        ...propertyDetails,
                        SuperArea: e.target.value,
                      })
                    }
                    value={propertyDetails && propertyDetails.SuperArea}
                  />
                </div>
                <div
                  style={{
                    width: "100%",
                    borderLeft: "2px solid #ddd",
                    padding: "5px 0 5px 10px",
                    marginLeft: "10px",
                  }}
                >
                  <input
                    id="id_carpetArea"
                    className="custom-input"
                    style={{ paddingRight: "10px" }}
                    type="text"
                    placeholder="Carpet Area"
                    maxLength={6}
                    onInput={(e) => {
                      restrictInput(e, 5);
                    }}
                    onChange={(e) =>
                      setPropertyDetails({
                        ...propertyDetails,
                        CarpetArea: e.target.value,
                      })
                    }
                    value={propertyDetails && propertyDetails.CarpetArea}
                  />
                </div>
              </div>
              <div style={{ width: "100%", padding: "5px 0" }}>
                <div
                  className="radio_group"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div
                    className="radio_group_single"
                    style={{ padding: "5px 0", width: "100%" }}
                  >
                    <div
                      className={
                        propertyDetails.SuperAreaUnit === "SqFt"
                          ? "custom_radio_button radiochecked"
                          : "custom_radio_button"
                      }
                    >
                      <input
                        type="checkbox"
                        id="superareaunit_SqFt"
                        onClick={(e) => {
                          setPropertyDetails({
                            ...propertyDetails,
                            SuperAreaUnit: "SqFt",
                          });
                        }}
                      />
                      <label
                        htmlFor="superareaunit_SqFt"
                        style={{ padding: "6px 0 10px 22px", height: "30px" }}
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
                        <h6>SqFt</h6>
                      </label>
                    </div>
                  </div>

                  <div
                    className="radio_group_single"
                    style={{ padding: "5px 0", width: "100%" }}
                  >
                    <div
                      className={
                        propertyDetails.SuperAreaUnit === "SqMtr"
                          ? "custom_radio_button radiochecked"
                          : "custom_radio_button"
                      }
                    >
                      <input
                        type="checkbox"
                        id="superareaunit_SqMtr"
                        onClick={(e) => {
                          setPropertyDetails({
                            ...propertyDetails,
                            SuperAreaUnit: "SqMtr",
                          });
                        }}
                      />
                      <label
                        htmlFor="superareaunit_SqMtr"
                        style={{ padding: "6px 0 10px 22px", height: "30px" }}
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
                        <h6>SqMtr</h6>
                      </label>
                    </div>
                  </div>

                  <div
                    className="radio_group_single"
                    style={{ padding: "5px 0", width: "100%" }}
                  >
                    <div
                      className={
                        propertyDetails.SuperAreaUnit === "SqYd"
                          ? "custom_radio_button radiochecked"
                          : "custom_radio_button"
                      }
                    >
                      <input
                        type="checkbox"
                        id="superareaunit_SqYd"
                        onClick={(e) => {
                          setPropertyDetails({
                            ...propertyDetails,
                            SuperAreaUnit: "SqYd",
                          });
                        }}
                      />
                      <label
                        htmlFor="superareaunit_SqYd"
                        style={{ padding: "6px 0 10px 22px", height: "30px" }}
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
                        <h6>SqYd</h6>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Flat Floor No */}
          <div className="col-md-4">
            <div className="form_field label_top">
              <label htmlFor="">Floor No.</label>
              <div className="plus_minus_input_wrapper">
                <span className="pmi_label">Floor no</span>
                <div className="plus_minus_input">
                  <div
                    className="left-minus-button pmbutton"
                    onClick={() => {
                      decrementInput("floorNoInput");
                    }}
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </div>

                  <input
                    id="floorNoInput"
                    type="number"
                    disabled
                    value={propertyDetails && propertyDetails.FloorNo}
                  />
                  <div
                    className="right-plus-button pmbutton"
                    onClick={() => {
                      incrementInput("floorNoInput");
                    }}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* Total Floor */}
          <div className="col-md-4">
            <div className="form_field label_top">
              <label htmlFor="">Total Floor</label>
              <div className="plus_minus_input_wrapper">
                <span className="pmi_label">Total Floor</span>
                <div className="plus_minus_input">
                  <div
                    className="left-minus-button pmbutton"
                    onClick={() => {
                      decrementInput("numberOfFloorsInput");
                    }}
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </div>

                  <input
                    id="numberOfFloorsInput"
                    type="number"
                    disabled
                    value={propertyDetails && propertyDetails.NumberOfFloors}
                  />
                  <div
                    className="right-plus-button pmbutton"
                    onClick={() => {
                      incrementInput("numberOfFloorsInput");
                    }}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* No of Apts on Floor */}
          <div className="col-md-4">
            <div className="form_field label_top">
              <label htmlFor="">No. of Apt On Floor</label>
              <div className="plus_minus_input_wrapper">
                <span className="pmi_label">Apts on Floor</span>
                <div className="plus_minus_input">
                  <div
                    className="left-minus-button pmbutton"
                    onClick={() => {
                      decrementInput("numberOfFlatsOnFloorInput");
                    }}
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </div>

                  <input
                    id="numberOfFlatsOnFloorInput"
                    type="number"
                    disabled
                    value={propertyDetails && propertyDetails.NumberOfFlatsOnFloor}
                  />
                  <div
                    className="right-plus-button pmbutton"
                    onClick={() => {
                      incrementInput("numberOfFlatsOnFloorInput");
                    }}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* No of Lifts */}
          <div className="col-md-4">
            <div className="form_field label_top">
              <label htmlFor="">No. of Lifts</label>
              <div className="plus_minus_input_wrapper">
                <span className="pmi_label">#Lift</span>
                <div className="plus_minus_input">
                  <div
                    className="left-minus-button pmbutton"
                    onClick={() => {
                      decrementInput("numberOfLiftsInput");
                    }}
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </div>

                  <input
                    id="numberOfLiftsInput"
                    type="number"
                    disabled
                    value={propertyDetails && propertyDetails.NumberOfLifts}
                  />
                  <div
                    className="right-plus-button pmbutton"
                    onClick={() => {
                      incrementInput("numberOfLiftsInput");
                    }}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* No of Open Car Parking */}
          <div className="col-md-4">
            <div className="form_field label_top">
              <label htmlFor="">No. of OPEN Car Parking</label>
              <div className="plus_minus_input_wrapper">
                <span className="pmi_label">#OPEN</span>
                <div className="plus_minus_input">
                  <div
                    className="left-minus-button pmbutton"
                    onClick={() => {
                      decrementInput("numberOfOpenCarParkingInput");
                    }}
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </div>

                  <input
                    id="numberOfOpenCarParkingInput"
                    type="number"
                    disabled
                    value={propertyDetails && propertyDetails.NumberOfOpenCarParking}
                  />
                  <div
                    className="right-plus-button pmbutton"
                    onClick={() => {
                      incrementInput("numberOfOpenCarParkingInput");
                    }}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* No of Close Car Parking */}
          <div className="col-md-4">
            <div className="form_field label_top">
              <label htmlFor="">No. of CLOSED Car Parking</label>
              <div className="plus_minus_input_wrapper">
                <span className="pmi_label">#CLOSED</span>
                <div className="plus_minus_input">
                  <div
                    className="left-minus-button pmbutton"
                    onClick={() => {
                      decrementInput("numberOfClosedCarParkingInput");
                    }}
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </div>

                  <input
                    id="numberOfClosedCarParkingInput"
                    type="number"
                    disabled
                    value={propertyDetails && propertyDetails.NumberOfClosedCarParking}
                  />
                  <div
                    className="right-plus-button pmbutton"
                    onClick={() => {
                      incrementInput("numberOfClosedCarParkingInput");
                    }}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* two wheeler parking */}
          <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">2-Wheeler Parking</label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.TwoWheelarParking === "Yes"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="twoWheelarParking_yes"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              TwoWheelarParking: "Yes",
                            });
                          }}
                        />
                        <label
                          htmlFor="twoWheelarParking_yes"
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
                          <h6>Yes</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.TwoWheelarParking === "No"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="twoWheelarParking_no"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              TwoWheelarParking: "No",
                            });
                          }}
                        />
                        <label
                          htmlFor="twoWheelarParking_no"
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
                          <h6>No</h6>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* Lock-in Period */}
          <div className="col-md-4">
            <div className="form_field label_top">
              <label htmlFor="">Lock-in Period</label>
              <div className="plus_minus_input_wrapper">
                <span className="pmi_label">#Lock-In Period</span>
                <div className="plus_minus_input">
                  <div
                    className="left-minus-button pmbutton"
                    onClick={() => {
                      decrementInput("lockinperiodInput");
                    }}
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </div>

                  <input
                    id="lockinperiodInput"
                    type="number"
                    disabled
                    value={propertyDetails && propertyDetails.LockinPeriod}
                  />
                  <div
                    className="right-plus-button pmbutton"
                    onClick={() => {
                      incrementInput("lockinperiodInput");
                    }}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" bottom_fixed_button">
        {formError && <p className="error_new">{formError}</p>}
        <div className="next_btn_back">
          <button
            className="theme_btn btn_border full_width no_icon"
            onClick={handleBackSubmit}
          >
            {"<< Back"}
          </button>
          <button
            className="theme_btn btn_border next_btn full_width no_icon"
            onClick={handleNextSubmit}

          >
            {"Next >>"}
          </button>

        </div>
      </div>
    </form>
  );
};

export default Stage2;
