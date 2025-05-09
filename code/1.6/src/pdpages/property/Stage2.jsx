import React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import { timestamp } from "../../firebase/config";
import Select from "react-select";
import { Category } from "@mui/icons-material";

//Restrict to Input
function restrictInput(event, maxLength) {
  // Get the value entered in the input field
  let inputValue = event.target.value;

  // Remove any non-numeric characters using a regular expression
  let numericValue = inputValue.replace(/[^0-9]/g, "");
  // console.log("numericValue: ", numericValue)

  if (numericValue.length > maxLength) {
    numericValue = numericValue.slice(0, maxLength);
  }

  // Update the input field with the numeric value
  event.target.value = numericValue;
}

//Restrict to Input
function restrictInputWith2DecimalPoints(event, maxLength) {
  // Get the value entered in the input field
  let inputValue = event.target.value;
  console.log("inputValue: ", inputValue)

  // Allow only numbers and a single decimal point
  inputValue = inputValue.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except '.'
  inputValue = inputValue.replace(/(\..*?)\..*/g, "$1"); // Prevent multiple decimal points

  // Split the input into integer and decimal parts
  const [integerPart, decimalPart] = inputValue.split(".");

  // Limit the integer part to 4 digits
  let sanitizedInput = integerPart?.slice(0, maxLength) || "";

  // Add the decimal part if it exists and limit it to 2 digits
  if (decimalPart !== undefined) {
    sanitizedInput += `.${decimalPart.slice(0, 2)}`;
  }

  // Update the input field with the numeric value
  event.target.value = sanitizedInput;
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
  const [yearOfConstruction, setYearOfConstruction] = useState({
    label: "Year of Construction",
    value: "Year of Construction",
  });

  let floornooptions = ["LB", "UB", "Basement", "Stilt", "Ground", "1"]


  const { document: propertyDocument, error: propertyerror } = useDocument(
    "properties-propdial",
    propertyid
  );
  // console.log('propertyDocument:', propertyDocument)
  const { updateDocument, response: updateDocumentResponse } =
    useFirestore("properties-propdial");

  const [propertyDetails, setPropertyDetails] = useState({
    // All select type
    Category: "",
    OwnerShip: "",
    PropertyType: "",
    Bhk: "",
    SuperArea: "",
    SuperAreaUnit: "",
    CarpetArea: "",
    CarpetAreaUnit: "",
    RoadWidth: "",
    RoadWidthUnit: "",
    NumberOfBedrooms: "",
    NumberOfBathrooms: "",
    NumberOfBalcony: "",
    NumberOfKitchen: "",
    NumberOfLivingArea: "",
    NumberOfBasement: "",
    NumberOfWorkstations: 0,
    NumberOfCabins: 0,
    NumberOfMeetingRooms: 0,
    LivingArea: "",
    DiningArea: "",
    LivingAndDining: "",
    Passage: "",
    EntranceGallery: "",
    Furnishing: "",
    Readiness: "Ready To Move-In",
    IsCentrallyAirconditioned: "",
    IsReceptionArea: "",
    IsPreleased: "",
    PantryCafeteria: "",
    Washrooms: "",
    AdditionalRooms: [],
    ServentRoomOneClick: false,
    ServentRoomTwoClick: false,
    OfficeRoomClick: false,
    StoreRoomClick: false,
    PoojaRoomClick: false,
    StudyRoomClick: false,
    PowderRoomClick: false,
    AdditionalArea: [],
    FrontYardClick: false,
    BackYardClick: false,
    TerraceClick: false,
    RoofRightsClick: false,
    GarageClick: false,
    PowerBackup: "",
    NumberOfFloors: 1,
    FloorNo: 0,
    NumberOfFlatsOnFloor: 1,
    NumberOfLifts: 0,
    IsCarParkingAvailable: "Yes",
    NumberOfOpenCarParking: 0,
    NumberOfCoveredCarParking: 0,
    TwoWheelarParking: "No",
    EVChargingPointStatus: "No",
    GatedArea: "",
    IsCornerSidePlot: "",
    IsParkFacingPlot: "",
    EVChargingPointType: "",
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
      });

      setPropertyDetails({
        // All select type
        OwnerShip: propertyDocument.ownership,
        PropertyType: propertyDocument.propertyType
          ? propertyDocument.propertyType
          : "Select Property Type",
        Category: propertyDocument.category,
        Bhk: propertyDocument.bhk ? propertyDocument.bhk : "Select BHK",
        SuperArea: propertyDocument.superArea,
        SuperAreaUnit: propertyDocument.superAreaUnit,
        CarpetArea: propertyDocument.carpetArea,
        CarpetAreaUnit: propertyDocument.carpetAreaUnit,
        RoadWidth: propertyDocument.roadWidth,
        RoadWidthUnit: propertyDocument.roadWidthUnit,
        NumberOfBedrooms: propertyDocument.numberOfBedrooms
          ? propertyDocument.numberOfBedrooms
          : "0",
        NumberOfBathrooms: propertyDocument.numberOfBathrooms
          ? propertyDocument.numberOfBathrooms
          : "0",
        NumberOfBalcony: propertyDocument.numberOfBalcony
          ? propertyDocument.numberOfBalcony
          : 0,
        NumberOfKitchen: propertyDocument.numberOfKitchen
          ? propertyDocument.numberOfKitchen
          : "0",
        NumberOfLivingArea: propertyDocument.numberOfLivingArea
          ? propertyDocument.numberOfLivingArea
          : "0",
        NumberOfBasement: propertyDocument.numberOfBasement
          ? propertyDocument.numberOfBasement
          : "0",
        LivingArea: propertyDocument.livingArea
          ? propertyDocument.livingArea
          : "",
        DiningArea: propertyDocument.diningArea
          ? propertyDocument.diningArea
          : "",
        LivingAndDining: propertyDocument.livingAndDining
          ? propertyDocument.livingAndDining
          : "",
        EntranceGallery: propertyDocument.entranceGallery
          ? propertyDocument.entranceGallery
          : "",
        Passage: propertyDocument.passage ? propertyDocument.passage : "",

        NumberOfWorkstations: propertyDocument.numberOfWorkstations
          ? propertyDocument.numberOfWorkstations
          : "0",
        NumberOfCabins: propertyDocument.numberOfCabins
          ? propertyDocument.numberOfCabins
          : "0",
        NumberOfMeetingRooms: propertyDocument.numberOfMeetingRooms
          ? propertyDocument.numberOfMeetingRooms
          : "0",

        Furnishing: propertyDocument.furnishing
          ? propertyDocument.furnishing
          : "",

        Readiness: propertyDocument.readiness
          ? propertyDocument.readiness
          : "Ready to Move-In",

        IsCentrallyAirconditioned: propertyDocument.isCentrallyAirconditioned
          ? propertyDocument.isCentrallyAirconditioned
          : "",
        IsReceptionArea: propertyDocument.isReceptionArea
          ? propertyDocument.isReceptionArea
          : "",
        IsPreleased: propertyDocument.isPreleased
          ? propertyDocument.isPreleased
          : "",

        PantryCafeteria: propertyDocument.pantryCafeteria
          ? propertyDocument.pantryCafeteria
          : "",
        Washrooms: propertyDocument.washrooms
          ? propertyDocument.washrooms
          : "",
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
        PowderRoomClick:
          propertyDocument.additionalRooms &&
            propertyDocument.additionalRooms.find((e) => e === "Powder Room")
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
        RoofRightsClick:
          propertyDocument.additionalArea &&
            propertyDocument.additionalArea.find((e) => e === "Roof Rights")
            ? true
            : false,
        GarageClick:
          propertyDocument.additionalArea &&
            propertyDocument.additionalArea.find((e) => e === "Garage")
            ? true
            : false,
        PowerBackup: propertyDocument.powerBackup
          ? propertyDocument.powerBackup
          : "",
        NumberOfFloors: propertyDocument.numberOfFloors
          ? propertyDocument.numberOfFloors
          : 1,
        FloorNo: propertyDocument.floorNo ? propertyDocument.floorNo : 0,
        NumberOfFlatsOnFloor: propertyDocument.numberOfFlatsOnFloor
          ? propertyDocument.numberOfFlatsOnFloor
          : 1,
        NumberOfLifts: propertyDocument.numberOfLifts
          ? propertyDocument.numberOfLifts
          : 0,
        IsCarParkingAvailable: propertyDetails.isCarParkingAvailable
          ? propertyDetails.isCarParkingAvailable
          : "Yes",
        NumberOfOpenCarParking: propertyDocument.numberOfOpenCarParking
          ? propertyDocument.numberOfOpenCarParking
          : 0,
        NumberOfCoveredCarParking: propertyDocument.numberOfCoveredCarParking
          ? propertyDocument.numberOfCoveredCarParking
          : 0,
        TwoWheelarParking: propertyDocument.twoWheelarParking
          ? propertyDocument.twoWheelarParking
          : "No",

        EVChargingPointStatus: propertyDocument.evChargingPointStatus
          ? propertyDocument.evChargingPointStatus
          : "No",
        EVChargingPointType: propertyDocument.evChargingPointType
          ? propertyDocument.evChargingPointType
          : "",
        GatedArea: propertyDocument.gatedArea
          ? propertyDocument.gatedArea
          : "",
        IsCornerSidePlot: propertyDocument.isCornerSidePlot
          ? propertyDocument.isCornerSidePlot
          : "",

        IsParkFacingPlot: propertyDocument.isParkFacingPlot
          ? propertyDocument.isParkFacingPlot
          : "",

        LockinPeriod: propertyDocument.lockinPeriod
          ? propertyDocument.lockinPeriod
          : 6,
        YearOfConstruction: propertyDocument.yearOfConstruction
          ? propertyDocument.yearOfConstruction
          : "Year of Construction",
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
      // Don't do anything
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
      } else if (input === "kitchenNumberInput") {
        // Ensure the value doesn't exceed 2
        if (inputValue <= 2) {
          setPropertyDetails({
            ...propertyDetails,
            NumberOfKitchen: inputValue,
          });
        }
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
      } else if (input === "floorNoInput") {
        if (propertyDetails.NumberOfFloors > propertyDetails.FloorNo) {
          setPropertyDetails({
            ...propertyDetails,
            FloorNo: inputValue,
          });
        } else {
          setPropertyDetails({
            ...propertyDetails,
            FloorNo: inputValue,
            NumberOfFloors: inputValue,
          });
        }
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
      } else if (input === "numberOfCoveredCarParkingInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfCoveredCarParking: inputValue,
        });
      } else if (input === "lockinperiodInput") {
        setPropertyDetails({
          ...propertyDetails,
          LockinPeriod: inputValue,
        });
      }
      else if (input === "workstationNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfWorkstations: inputValue,
        });
      }
      else if (input === "cabinsNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfCabins: inputValue,
        });
      }
      else if (input === "meetingroomsNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfMeetingRooms: inputValue,
        });
      }

    }
  }




  function decrementInput(input) {
    var inputValue = document.getElementById(input).value;
    console.log("decrementInput; ", input + " and value; ", inputValue)

    if (input === "floorNoInput" && inputValue > -1) {
      inputValue--; // Allow FloorNo to go to -1
      setPropertyDetails({
        ...propertyDetails,
        FloorNo: inputValue,
      });
    } else if (
      (input === "numberOfFloorsInput" || input === "numberOfFlatsOnFloorInput") &&
      inputValue > 1
    ) {
      inputValue--; // Ensure total floors and flats on floor don't go below 1
      if (input === "numberOfFloorsInput") {
        let currentFloor;
        if (propertyDetails.FloorNo === "LB" || propertyDetails.FloorNo === "UB" || propertyDetails.FloorNo === "Basement" || propertyDetails.FloorNo === "Stilt" || propertyDetails.FloorNo === "Ground") {
          currentFloor = 1
        }
        else {
          currentFloor = propertyDetails.FloorNo

        }
        if (propertyDetails.NumberOfFloors > currentFloor) {
          setPropertyDetails({
            ...propertyDetails,
            NumberOfFloors: inputValue,
          });
        }
      } else if (input === "numberOfFlatsOnFloorInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfFlatsOnFloor: inputValue,
        });
      }
    } else if (inputValue > 0) {
      inputValue--; // Ensure all other inputs don't go below 0
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
      } else if (input === "numberOfCoveredCarParkingInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfCoveredCarParking: inputValue,
        });
      } else if (input === "lockinperiodInput") {
        setPropertyDetails({
          ...propertyDetails,
          LockinPeriod: inputValue,
        });
      }
      else if (input === "workstationNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfWorkstations: inputValue,
        });
      }
      else if (input === "cabinsNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfCabins: inputValue,
        });
      }
      else if (input === "meetingroomsNumberInput") {
        setPropertyDetails({
          ...propertyDetails,
          NumberOfMeetingRooms: inputValue,
        });
      }
    }
  }



  const handleNextSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    let errorFlag = false;
    let errorMsg = "Please resolve ERRORs before proceeding...";

    if (propertyDetails.OwnerShip === "" || propertyDetails.OwnerShip === undefined || propertyDetails.OwnerShip === null) {
      errorFlag = true;
    }

    if (
      propertyDetails.PropertyType.toUpperCase() === "SELECT PROPERTY TYPE" ||
      propertyDetails.PropertyType === ""
    ) {
      // if (errorMsg === "Please select ") errorMsg = errorMsg + "Property Type";
      // else errorMsg = errorMsg + ", Property Type";
      errorFlag = true;
    }

    if (propertyDetails.Category === 'Residential' &&
      (propertyDetails.Bhk.toUpperCase() === "SELECT BHK" ||
        propertyDetails.Bhk === "")
    ) {
      // if (errorMsg === "Select BHK") errorMsg = errorMsg + "BHK";
      // else errorMsg = errorMsg + ", BHK";
      errorFlag = true;
    }
    // console.log(
    //   "propertyDetails.NumberOfBedrooms:",
    //   propertyDetails.NumberOfBedrooms
    // );

    if (
      // propertyDetails && propertyDetails.NumberOfBedrooms.toUpperCase() === "SELECT BEDROOM" ||
      propertyDetails.Category !== 'Plot' && (propertyDetails.Category === 'Commercial' && propertyDetails.PropertyType !== 'Land') && propertyDetails.Furnishing === ""
    ) {
      // if (errorMsg === "Select Furnishing") errorMsg = errorMsg + "Furnishing";
      // else errorMsg = errorMsg + ", Furnishing";
      errorFlag = true;
    }

    //SuperArea & CarpetArea Value
    if (propertyDetails && propertyDetails.Category === 'Commercial') {
      if (
        // (propertyDetails.SuperArea === "" || propertyDetails.CarpetArea === "" ||
        //   propertyDetails.SuperArea === "0" || propertyDetails.CarpetArea === "0")
        (propertyDetails.CarpetArea === "" || propertyDetails.CarpetArea === "0") //Carpet are is mandatory
      ) {
        // if (errorMsg === "Please select ")
        //   errorMsg = "Carpet Area is mandatory";
        // else errorMsg = errorMsg + ", Carpet Area is mandatory";
        errorFlag = true;
      }
    }
    else {
      if (
        (propertyDetails.SuperArea === "" && propertyDetails.CarpetArea === "") ||
        (propertyDetails.SuperArea === "0" && propertyDetails.CarpetArea === "0")
      ) {
        if (propertyDetails.Category === 'Plot') {
          if (errorMsg === "Please select ")
            errorMsg = "Enter Super Area or Carpet Area or both";
          else errorMsg = errorMsg + ", Enter Super Area or Carpet Area or both";
        } else {
          // if (errorMsg === "Please select ")
          //   errorMsg = "Enter Super Area or Carpet Area or both";
          // else errorMsg = errorMsg + ", Enter Super Area or Carpet Area or both";
        }
        errorFlag = true;
      }
      // else if ((propertyDetails.SuperArea !== "" && propertyDetails.CarpetArea !== "") &&
      //   Number(propertyDetails.SuperArea) <= Number(propertyDetails.CarpetArea)) {
      //   // if (errorMsg === "Please select ") {
      //   //   errorMsg = "Carpet Area should be less than Super Area";
      //   // } else {
      //   //   errorMsg = errorMsg + ", Carpet Area should be less than Super Area";
      //   // }
      //   errorFlag = true;
      // }

    }

    if ((propertyDetails.SuperArea !== "" && propertyDetails.CarpetArea !== "") &&
      Number(propertyDetails.SuperArea) <= Number(propertyDetails.CarpetArea)) {
      // if (errorMsg === "Please select ") {
      //   errorMsg = "Carpet Area should be less than Super Area";
      // } else {
      //   errorMsg = errorMsg + ", Carpet Area should be less than Super Area";
      // }
      errorFlag = true;
    }

    //SuperArea & CarpetArea Unit
    if (
      (propertyDetails.SuperAreaUnit === "" && propertyDetails.CarpetAreaUnit === "")
    ) {
      // if (errorMsg === "Please select ")
      //   errorMsg = "Super Area / Carpet Area Unit";
      // else errorMsg = errorMsg + ", Select Super Area / Carpet Area Unit";
      errorFlag = true;
    }

    //EV Charging Type
    // if (
    //   propertyDetails.Category !== 'Plot' && (propertyDetails.EVChargingPointType === "" && propertyDetails.EVChargingPointStatus.toLowerCase() === 'yes')
    // ) {
    //   if (errorMsg === "Please select ")
    //     errorMsg = "EV Charging Type";
    //   else errorMsg = errorMsg + ", EV Charging Type";
    //   errorFlag = true;
    // }


    //Plot - Field Validations
    if (propertyDetails && propertyDetails.Category === 'Plot') {
      //Road Width Validation
      if (propertyDetails.RoadWidth === "" || propertyDetails.RoadWidth === "0") {
        // if (errorMsg === "Please select ")
        //   errorMsg = "Enter Road Width";
        // else errorMsg = errorMsg + ", Enter Road Width";
        errorFlag = true;
      }

      if (propertyDetails.RoadWidthUnit === "") {
        // if (errorMsg === "Please select ")
        //   errorMsg = "Enter Road Width Unit";
        // else errorMsg = errorMsg + ", Enter Road Width Unit";
        errorFlag = true;
      }

      if (propertyDetails.isCornerSidePlot === "") {
        // if (errorMsg === "Please select ")
        //   errorMsg = "Select Corner Side Plot";
        // else errorMsg = errorMsg + ", Select Corner Side Plot";
        errorFlag = true;
      }

      if (propertyDetails.IsParkFacingPlot === "") {
        // if (errorMsg === "Please select ")
        //   errorMsg = "Select Park Facing Plot";
        // else errorMsg = errorMsg + ", Select Park Facing Plot";
        errorFlag = true;
      }

      if (propertyDetails.GatedArea === "") {
        // if (errorMsg === "Please select ")
        //   errorMsg = "Select Gated Community";
        // else errorMsg = errorMsg + ", Select Gated Community";
        errorFlag = true;
      }

    }


    if (errorFlag) setFormError(errorMsg);
    else setFormError("");

    const property = {
      ownership: propertyDetails.OwnerShip,
      propertyType: propertyDetails.PropertyType,
      bhk: propertyDetails.Bhk,

      numberOfBedrooms: propertyDetails.NumberOfBedrooms,
      numberOfBathrooms: propertyDetails.NumberOfBathrooms,
      numberOfBalcony: propertyDetails.NumberOfBalcony,
      numberOfKitchen: propertyDetails.NumberOfKitchen,
      numberOfLivingArea: propertyDetails.NumberOfLivingArea,
      numberOfBasement: propertyDetails.NumberOfBasement,
      numberOfWorkstations: propertyDetails.NumberOfWorkstations,
      numberOfCabins: propertyDetails.NumberOfCabins,
      numberOfMeetingRooms: propertyDetails.NumberOfMeetingRooms,
      livingArea: propertyDetails.LivingArea,
      diningArea: propertyDetails.DiningArea,
      livingAndDining: propertyDetails.LivingAndDining,
      passage: propertyDetails.Passage,
      entranceGallery: propertyDetails.EntranceGallery,
      isCentrallyAirconditioned: propertyDetails.IsCentrallyAirconditioned
        ? propertyDetails.IsCentrallyAirconditioned
        : "",
      isReceptionArea: propertyDetails.IsReceptionArea
        ? propertyDetails.IsReceptionArea
        : "",

      isPreleased: propertyDetails.IsPreleased
        ? propertyDetails.IsPreleased
        : "",

      pantryCafeteria: propertyDetails.PantryCafeteria
        ? propertyDetails.PantryCafeteria
        : "",
      washrooms: propertyDetails.Washrooms
        ? propertyDetails.Washrooms
        : "",
      furnishing: propertyDetails.Furnishing,
      readiness: propertyDetails.Readiness,

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

      roadWidth: propertyDetails.RoadWidth ? propertyDetails.RoadWidth : "",
      roadWidthUnit: propertyDetails.RoadWidthUnit ? propertyDetails.RoadWidthUnit : "",

      powerBackup: propertyDetails.PowerBackup
        ? propertyDetails.PowerBackup
        : "",
      numberOfFloors: propertyDetails.NumberOfFloors
        ? propertyDetails.NumberOfFloors
        : 0,
      floorNo: propertyDetails.FloorNo ? propertyDetails.FloorNo : "",
      numberOfFlatsOnFloor: propertyDetails.NumberOfFlatsOnFloor
        ? propertyDetails.NumberOfFlatsOnFloor
        : 0,
      numberOfLifts: propertyDetails.NumberOfLifts
        ? propertyDetails.NumberOfLifts
        : 0,

      isCarParkingAvailable: propertyDetails.IsCarParkingAvailable
        ? propertyDetails.IsCarParkingAvailable
        : "No",
      numberOfOpenCarParking: propertyDetails.NumberOfOpenCarParking
        ? propertyDetails.NumberOfOpenCarParking
        : 0,
      numberOfCoveredCarParking: propertyDetails.NumberOfCoveredCarParking
        ? propertyDetails.NumberOfCoveredCarParking
        : 0,

      twoWheelarParking: propertyDetails.TwoWheelarParking
        ? propertyDetails.TwoWheelarParking
        : "",

      evChargingPointStatus: propertyDetails.EVChargingPointStatus
        ? propertyDetails.EVChargingPointStatus
        : "No",
      evChargingPointType: propertyDetails.EVChargingPointType
        ? propertyDetails.EVChargingPointType
        : "",

      gatedArea: propertyDetails.GatedArea
        ? propertyDetails.GatedArea
        : "",

      isCornerSidePlot: propertyDetails.IsCornerSidePlot
        ? propertyDetails.IsCornerSidePlot
        : "",

      isParkFacingPlot: propertyDetails.IsParkFacingPlot
        ? propertyDetails.IsParkFacingPlot
        : "",

      lockinPeriod: propertyDetails.LockinPeriod
        ? propertyDetails.LockinPeriod
        : 0,
      yearOfConstruction: propertyDetails.YearOfConstruction,
      // ageOfProperty: propertyDetails.AgeOfProperty ? propertyDetails.AgeOfProperty : document.getElementById('ageOfPropertyCount'),
    };

    // console.log('property:', property)

    if (!errorFlag) {
      // console.log("Error Flag: ", errorFlag)
      if (propertyid !== "new") {
        const updatedProperty = {
          ...property,
          updatedAt: timestamp.fromDate(new Date()),
          updatedBy: user.phoneNumber,
        };

        console.log("Property id: ", propertyid, " and updatedProperty Object: ", updatedProperty);

        await updateDocument(propertyid, updatedProperty);

        if (updateDocumentResponse.error) {
          navigate("/");
        } else {
          props.setStateFlag("stage3");
        }
      }
    }
    else {
      console.log("Error Flag: ", errorFlag)
    }
  };
  function addFloorNumber(floorno) {
    let iFloor = 2
    while (iFloor <= Number(floorno)) {
      floornooptions.push(iFloor)
      iFloor = iFloor + 1
    }
    // console.log('floornooptions', floornooptions)
  }
  // const [years, setYears] = useState([]);
  // Function to generate years from 1980 to current year
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1980;
    const yearArray = [];
    for (let year = currentYear; year >= startYear; year--) {
      yearArray.push({
        label: year,
        value: year,
      });
    }
    yearArray.unshift({
      label: "Year of Construction",
      value: "Year of Construction",
    });
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

    setYearOfConstruction({ label: option.value, value: option.value });
  };

  return (
    <form>
      <div className="add_property_fields">
        <div className="row row_gap form_full">
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
              {(propertyDetails.OwnerShip === "" || propertyDetails.OwnerShip === undefined || propertyDetails.OwnerShip === null) ? <div className="field_error">Please select Ownership</div> : ""}
            </div>
          </div>


          {/* Property Type */}
          <div className="col-xl-4 col-lg-6 col-md-4">
            <div className="form_field label_top">
              <label htmlFor="">Property Type</label>
              <div className="form_field_inner">

                {propertyDetails && propertyDetails.Category === 'Residential' ? (
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
                          propertyDetails.PropertyType === "Multi Storey Apt"
                          ? true
                          : false
                      }
                    >
                      Multi Storey Apt
                    </option>
                    <option
                      defaultValue={
                        propertyDetails &&
                          propertyDetails.PropertyType === "Builder Floor"
                          ? true
                          : false
                      }
                    >
                      Builder Floor
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
                ) : propertyDetails && propertyDetails.Category === 'Commercial' ? (
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
                          propertyDetails.PropertyType === "Land"
                          ? true
                          : false
                      }
                    >
                      Land
                    </option>

                    <option
                      defaultValue={
                        propertyDetails &&
                          propertyDetails.PropertyType === "Retail"
                          ? true
                          : false
                      }
                    >
                      Retail
                    </option>
                    <option
                      defaultValue={
                        propertyDetails &&
                          propertyDetails.PropertyType === "Office"
                          ? true
                          : false
                      }
                    >
                      Office
                    </option>
                    <option
                      defaultValue={
                        propertyDetails &&
                          propertyDetails.PropertyType === "Storage"
                          ? true
                          : false
                      }
                    >
                      Storage
                    </option>
                    <option
                      defaultValue={
                        propertyDetails &&
                          propertyDetails.PropertyType === "Industry"
                          ? true
                          : false
                      }
                    >
                      Industry
                    </option>
                    <option
                      defaultValue={
                        propertyDetails &&
                          propertyDetails.PropertyType === "Hospitality"
                          ? true
                          : false
                      }
                    >
                      Hospitality
                    </option>
                    <option
                      defaultValue={
                        propertyDetails &&
                          propertyDetails.PropertyType === "Other"
                          ? true
                          : false
                      }
                    >
                      Other
                    </option>
                  </select>
                )

                  :
                  (
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
                            propertyDetails.PropertyType === "Residential"
                            ? true
                            : false
                        }
                      >
                        Residential
                      </option>
                      <option
                        defaultValue={
                          propertyDetails &&
                            propertyDetails.PropertyType === "Commercial"
                            ? true
                            : false
                        }
                      >
                        Commercial
                      </option>
                      <option
                        defaultValue={
                          propertyDetails &&
                            propertyDetails.PropertyType === "Industrial"
                            ? true
                            : false
                        }
                      >
                        Industrial
                      </option>
                      <option
                        defaultValue={
                          propertyDetails &&
                            propertyDetails.PropertyType === "Agriculture"
                            ? true
                            : false
                        }
                      >
                        Agriculture
                      </option>
                      <option
                        defaultValue={
                          propertyDetails &&
                            propertyDetails.PropertyType === "School Site"
                            ? true
                            : false
                        }
                      >
                        School Site
                      </option>
                      <option
                        defaultValue={
                          propertyDetails &&
                            propertyDetails.PropertyType === "Hospital Site"
                            ? true
                            : false
                        }
                      >
                        Hospital Site
                      </option>
                    </select>
                  )}
                {/* <div className="field_icon">
                 <span className="material-symbols-outlined">
                   format_list_bulleted
                 </span>
               </div> */}
              </div>
              {(propertyDetails.PropertyType === "" || propertyDetails.PropertyType === "Select Property Type") ? <div className="field_error">Please select Property Type</div> : ""}
            </div>
          </div>

          {/* BHK */}
          {propertyDetails && (propertyDetails.Category === 'Residential') && <div className="col-md-4">
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
                  <option
                    defaultValue={
                      propertyDetails && propertyDetails.Bhk === "Hall"
                        ? true
                        : false
                    }
                  >
                    Hall
                  </option>
                </select>
                {/* <div className="field_icon">
                  <span className="material-symbols-outlined">
                    bedroom_parent
                  </span>
                </div> */}
              </div>
              {(propertyDetails.Bhk === "" || propertyDetails.Bhk === "Select BHK") ? <div className="field_error">Please select BHK</div> : ""}

            </div>
          </div>}

          {/* Property Type Details */}
          {propertyDetails && (propertyDetails.Category === 'Commercial') && <div className="col-md-6">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Property Type Details</label>
              <div
                className="radio_group"
                style={{ display: "flex", alignItems: "center" }}
              >
                {propertyDetails.PropertyType === 'Office' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "IT Park"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="office_in_it_park"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["IT Park"],
                        });
                      }}
                    />
                    <label htmlFor="office_in_it_park">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>IT Park</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Office' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Commercial Building"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="office_in_commercial_bld"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Commercial Building"],
                        });
                      }}
                    />
                    <label htmlFor="office_in_commercial_bld">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Commercial Building</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Office' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Basement"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="office_in_basement"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Basement"],
                        });
                      }}
                    />
                    <label htmlFor="office_in_basement">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Basement</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Office' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Mall"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="office_in_mall"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Mall"],
                        });
                      }}
                    />
                    <label htmlFor="office_in_mall">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Mall</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Retail' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Shop"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="retail_shop"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Shop"],
                        });
                      }}
                    />
                    <label htmlFor="retail_shop">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Shop</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Retail' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Showroom"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="retail_showroom"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Showroom"],
                        });
                      }}
                    />
                    <label htmlFor="retail_showroom">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Showroom</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Storage' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Warehouse"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="storage_warehouse"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Warehouse"],
                        });
                      }}
                    />
                    <label htmlFor="storage_warehouse">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Warehouse</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Storage' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Cold Storage"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="storage_cold_storage"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Cold Storage"],
                        });
                      }}
                    />
                    <label htmlFor="storage_cold_storage">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Cold Storage</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Storage' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Basement"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="storage_basement"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Basement"],
                        });
                      }}
                    />
                    <label htmlFor="storage_basement">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Basement</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Land' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Farm House"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="land_farm_house"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Farm House"],
                        });
                      }}
                    />
                    <label htmlFor="land_farm_house">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Farm House</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Land' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Commercial Land"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="land_commercial_land"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Commercial Land"],
                        });
                      }}
                    />
                    <label htmlFor="land_commercial_land">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Commercial Land</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Land' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Institutional Land"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="land_institutional_land"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Institutional Land"],
                        });
                      }}
                    />
                    <label htmlFor="land_institutional_land">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Institutional Land</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Land' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Industrial Land"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="land_industrial_land"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Industrial Land"],
                        });
                      }}
                    />
                    <label htmlFor="land_industrial_land">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Industrial Land</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Industry' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Factory"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="industry_factory"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Factory"],
                        });
                      }}
                    />
                    <label htmlFor="industry_factory">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Factory</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Industry' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Building"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="industry_building"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Building"],
                        });
                      }}
                    />
                    <label htmlFor="industry_building">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Building</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Industry' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Shed"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="industry_shed"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Shed"],
                        });
                      }}
                    />
                    <label htmlFor="industry_shed">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Shed</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Hospitality' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Guest House"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="hospitality_guest_house"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Guest House"],
                        });
                      }}
                    />
                    <label htmlFor="hospitality_guest_house">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Guest House</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Hospitality' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Hotel"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="hospitality_hotel"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Hotel"],
                        });
                      }}
                    />
                    <label htmlFor="hospitality_hotel">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Hotel</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Hospitality' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Resort"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="hospitality_resort"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Resort"],
                        });
                      }}
                    />
                    <label htmlFor="hospitality_resort">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Resort</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Hospitality' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Banquet-Hall"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="hospitality_banquethall"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Banquet-Hall"],
                        });
                      }}
                    />
                    <label htmlFor="hospitality_banquethall">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Banquet-Hall</h6>
                    </label>
                  </div>
                </div>}
                {propertyDetails.PropertyType === 'Other' && <div className="radio_group_single" style={{ width: "100%" }}>
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.AdditionalRooms[0] === "Other"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_propertytypedetails"
                      id="other_other"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          AdditionalRooms: ["Other"],
                        });
                      }}
                    />
                    <label htmlFor="other_other">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Other</h6>
                    </label>
                  </div>
                </div>}
              </div>
            </div>
          </div>}

          {/*  Readiness  */}
          {propertyDetails && (propertyDetails.Category === 'Residential' || propertyDetails.Category === 'Commercial') && (propertyDetails.PropertyType !== 'Land' && propertyDetails.PropertyType !== 'Other') && <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Property Readiness</label>
              <div
                className="radio_group"
                style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
              >
                <div className="radio_group_single">
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.Readiness === "Ready to Move-In"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_readiness"
                      id="readiness_ready_to_move-in"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          Readiness: "Ready to Move-In",
                        });
                      }}
                    />
                    <label htmlFor="readiness_ready_to_move-in">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Ready to Move-In</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single">
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.Readiness === "Under Construction"
                      ? "radiochecked"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="group_readiness"
                      id="readiness_under_construction"
                      onClick={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          Readiness: "Under Construction",
                        });
                      }}
                    />
                    <label htmlFor="readiness_under_construction">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Under Construction</h6>
                    </label>
                  </div>
                </div>


              </div>
            </div>
          </div>}

          {/* Furnishing */}
          {propertyDetails && (propertyDetails.Category === 'Residential' || propertyDetails.Category === 'Commercial') && (propertyDetails.PropertyType !== 'Land' && propertyDetails.PropertyType !== 'Other') && <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Furnishing</label>
              <div
                className="radio_group"
                style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
              >
                <div className="radio_group_single">
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.Furnishing === "Fully-Furnished"
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
                          Furnishing: "Fully-Furnished",
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
                      <h6>Fully-Furnished</h6>
                    </label>
                  </div>
                </div>
                <div className="radio_group_single">
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.Furnishing === "Semi-Furnished"
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
                          Furnishing: "Semi-Furnished",
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
                      <h6>Semi-Furnished</h6>
                    </label>
                  </div>
                </div>

                <div className="radio_group_single">
                  <div
                    className={`custom_radio_button ${propertyDetails && propertyDetails.Furnishing === "Unfurnished"
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
                          Furnishing: "Unfurnished",
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
                      {propertyDetails.Category === 'Commercial' ? <h6>Bareshell</h6> : <h6>Unfurnished</h6>}
                    </label>
                  </div>
                </div>
              </div>
              {(propertyDetails.Furnishing === "") ? <div className="field_error">Please select Furnishing</div> : ""}
            </div>
          </div>}

          {/* Is Centrally Airconditioned: */}
          {(propertyDetails && propertyDetails.Category === 'Commercial') && (propertyDetails.PropertyType === 'Retail' || propertyDetails.PropertyType === 'Office') &&
            <div className="col-md-4">
              <div className="form_field st-2 label_top">
                <label htmlFor=""> Is Centrally Airconditioned? </label>
                <div className="form_field_inner">
                  <div className="form_field_container">
                    <div className="radio_group">
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.IsCentrallyAirconditioned === "Yes"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="isCentrallyAirconditioned_yes"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                IsCentrallyAirconditioned: "Yes",
                              });
                            }}
                          />
                          <label
                            htmlFor="isCentrallyAirconditioned_yes"
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
                            propertyDetails.IsCentrallyAirconditioned === "No"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="isCentrallyAirconditioned_no"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                IsCentrallyAirconditioned: "No",
                              });
                            }}
                          />
                          <label
                            htmlFor="isCentrallyAirconditioned_no"
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
            </div>}

          {/* Reception Area */}
          {(propertyDetails && propertyDetails.Category === 'Commercial') && (propertyDetails.PropertyType === 'Office') &&
            <div className="col-md-4">
              <div className="form_field st-2 label_top">
                <label htmlFor=""> Reception Area? </label>
                <div className="form_field_inner">
                  <div className="form_field_container">
                    <div className="radio_group">
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.IsReceptionArea === "Yes"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="isReceptionArea_yes"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                IsReceptionArea: "Yes",
                              });
                            }}
                          />
                          <label
                            htmlFor="isReceptionArea_yes"
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
                            propertyDetails.IsReceptionArea === "No"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="isReceptionArea_no"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                IsReceptionArea: "No",
                              });
                            }}
                          />
                          <label
                            htmlFor="isReceptionArea_no"
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
            </div>}

          {/* Pantry/Cafeteria*/}
          {(propertyDetails && propertyDetails.Category === 'Commercial') && (propertyDetails.PropertyType === 'Office' || propertyDetails.PropertyType === 'Retail') &&
            <div className="col-md-4">
              <div className="form_field st-2 label_top">
                <label htmlFor=""> Pantry/Cafeteria </label>
                <div className="form_field_inner">
                  <div className="form_field_container">
                    <div className="radio_group">
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.PantryCafeteria === "Private"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="pantrycafeteria_private"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                PantryCafeteria: "Private",
                              });
                            }}
                          />
                          <label
                            htmlFor="pantrycafeteria_private"
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
                            <h6>Private</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.PantryCafeteria === "Shared"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="pantrycafeteria_shared"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                PantryCafeteria: "Shared",
                              });
                            }}
                          />
                          <label
                            htmlFor="pantrycafeteria_shared"
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
                            <h6>Shared</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.PantryCafeteria === "Not Available"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="pantrycafeteria_not_available"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                PantryCafeteria: "Not Available",
                              });
                            }}
                          />
                          <label
                            htmlFor="pantrycafeteria_not_available"
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
                            <h6>Not Available</h6>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

          {/* Washrooms*/}
          {(propertyDetails && (propertyDetails.Category === 'Commercial' && propertyDetails.PropertyType !== 'Land')) &&
            <div className="col-md-4">
              <div className="form_field st-2 label_top">
                <label htmlFor=""> Washrooms </label>
                <div className="form_field_inner">
                  <div className="form_field_container">
                    <div className="radio_group">
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.Washrooms === "Private"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="washrooms_private"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                Washrooms: "Private",
                              });
                            }}
                          />
                          <label
                            htmlFor="washrooms_private"
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
                            <h6>Private</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.Washrooms === "Shared"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="washrooms_shared"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                Washrooms: "Shared",
                              });
                            }}
                          />
                          <label
                            htmlFor="washrooms_shared"
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
                            <h6>Shared</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.Washrooms === "Not Available"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="washrooms_not_available"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                Washrooms: "Not Available",
                              });
                            }}
                          />
                          <label
                            htmlFor="washrooms_not_available"
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
                            <h6>Not Available</h6>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

          {/* Rooms */}
          {propertyDetails && (propertyDetails.Category === 'Residential') &&
            <div className="col-md-6">
              <div className="form_field label_top">
                <label htmlFor="">Rooms</label>
                <div className="increase_input_parent">
                  <div className="plus_minus_input_wrapper">
                    {propertyDetails.Category === 'Commercial' ? <span className="pmi_label">Rooms</span> : <span className="pmi_label">Bedroom</span>}
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
                        value={
                          propertyDetails && propertyDetails.NumberOfBedrooms
                        }
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
                    {propertyDetails.Category === 'Commercial' ? <span className="pmi_label">Toilets</span> : <span className="pmi_label">Bathroom</span>}
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
                        value={
                          propertyDetails && propertyDetails.NumberOfBathrooms
                        }
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
                  {propertyDetails.PropertyType !== "Storage" &&
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
                  }
                  {
                    propertyDetails.PropertyType !== "Storage" &&
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
                  }
                  {/* <div className="plus_minus_input_wrapper">
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
                </div> */}
                  {/* <div className="plus_minus_input_wrapper">
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
                </div> */}
                </div>
              </div>
            </div>}

          {/* Office Workstations, Cabins & Meeting Rooms */}
          {propertyDetails && (propertyDetails.Category === 'Commercial') && (propertyDetails.PropertyType === 'Office') &&
            <div className="col-md-6">
              <div className="form_field label_top">
                <label htmlFor="">Office Details</label>
                <div className="increase_input_parent">
                  <div className="plus_minus_input_wrapper">
                    <span className="pmi_label">Workstations</span>
                    <div className="plus_minus_input">
                      <div
                        className="left-minus-button pmbutton"
                        onClick={() => {
                          decrementInput("workstationNumberInput");
                        }}
                      >
                        <span className="material-symbols-outlined">remove</span>
                      </div>

                      <input
                        id="workstationNumberInput"
                        type="number"
                        disabled
                        value={
                          propertyDetails && propertyDetails.NumberOfWorkstations
                        }
                      />
                      <div
                        className="right-plus-button pmbutton"
                        onClick={() => {
                          incrementInput("workstationNumberInput");
                        }}
                      >
                        <span className="material-symbols-outlined">add</span>
                      </div>
                    </div>
                  </div>
                  <div className="plus_minus_input_wrapper">
                    <span className="pmi_label">Cabins</span>
                    <div className="plus_minus_input">
                      <div
                        className="left-minus-button pmbutton"
                        onClick={() => {
                          decrementInput("cabinsNumberInput");
                        }}
                      >
                        <span className="material-symbols-outlined">remove</span>
                      </div>

                      <input
                        id="cabinsNumberInput"
                        type="number"
                        disabled
                        value={
                          propertyDetails && propertyDetails.NumberOfCabins
                        }
                      />
                      <div
                        className="right-plus-button pmbutton"
                        onClick={() => {
                          incrementInput("cabinsNumberInput");
                        }}
                      >
                        <span className="material-symbols-outlined">add</span>
                      </div>
                    </div>
                  </div>
                  {propertyDetails.PropertyType !== "Storage" &&
                    <div className="plus_minus_input_wrapper">
                      <span className="pmi_label">Meeting Rooms</span>
                      <div className="plus_minus_input">
                        <div
                          className="left-minus-button pmbutton"
                          onClick={() => {
                            decrementInput("meetingroomsNumberInput");
                          }}
                        >
                          <span className="material-symbols-outlined">remove</span>
                        </div>

                        <input
                          id="meetingroomsNumberInput"
                          type="number"
                          disabled
                          value={propertyDetails && propertyDetails.NumberOfMeetingRooms}
                        />
                        <div
                          className="right-plus-button pmbutton"
                          onClick={() => {
                            incrementInput("meetingroomsNumberInput");
                          }}
                        >
                          <span className="material-symbols-outlined">add</span>
                        </div>
                      </div>
                    </div>
                  }

                  {/* <div className="plus_minus_input_wrapper">
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
                </div> */}
                  {/* <div className="plus_minus_input_wrapper">
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
                </div> */}
                </div>
              </div>
            </div>}

          {/* Additional Rooms */}
          {propertyDetails && (propertyDetails.Category === 'Residential') && <div className="col-md-6">
            <div className="form_field st-2 label_top">
              <label htmlFor="">
                {" "}
                Additional Rooms - ( {propertyDetails.AdditionalRooms.length} )
              </label>
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
                            ServentRoomOneClick:
                              !propertyDetails.ServentRoomOneClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms: [
                              ...propertyDetails.AdditionalRooms,
                              "Servent Room 1",
                            ],
                            ServentRoomOneClick:
                              !propertyDetails.ServentRoomOneClick,
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
                            ServentRoomTwoClick:
                              !propertyDetails.ServentRoomTwoClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms: [
                              ...propertyDetails.AdditionalRooms,
                              "Servent Room 2",
                            ],
                            ServentRoomTwoClick:
                              !propertyDetails.ServentRoomTwoClick,
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
                {/* <div className="radio_group_single">
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
                </div> */}
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
                      propertyDetails.PowderRoomClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="powder_room"
                      onClick={(e) => {
                        if (propertyDetails.PowderRoomClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms:
                              propertyDetails.AdditionalRooms &&
                              propertyDetails.AdditionalRooms.filter(
                                (elem) => elem !== "Powder Room"
                              ),
                            PowderRoomClick: !propertyDetails.PowderRoomClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalRooms: [
                              ...propertyDetails.AdditionalRooms,
                              "Powder Room",
                            ],
                            PowderRoomClick: !propertyDetails.PowderRoomClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="powder_room">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                      </div>
                      <h6> Powder Room</h6>
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
          </div>}

          {/* Living & Dining */}
          {propertyDetails && propertyDetails.Category === 'Residential' && <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Living & Dining Combined</label>
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
          </div>}

          {/* Living Area */}
          {propertyDetails.LivingAndDining.toLowerCase() === "no" && (
            <div className="col-md-4">
              <div className="form_field st-2 label_top">
                <label htmlFor="">Living Area</label>
                <div className="form_field_inner">
                  <div className="form_field_container">
                    <div className="radio_group">
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.LivingArea === "Yes"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="livingArea_yes"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                LivingArea: "Yes",
                              });
                            }}
                          />
                          <label
                            htmlFor="livingArea_yes"
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
                            propertyDetails.LivingArea === "No"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="livingArea_no"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                LivingArea: "No",
                              });
                            }}
                          />
                          <label
                            htmlFor="livingArea_no"
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
          )}

          {/* Dining Area */}
          {propertyDetails.LivingAndDining.toLowerCase() === "no" && (
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
          )}

          {/* Entrance Gallery */}
          {propertyDetails && (propertyDetails.Category === 'Residential') && <div className="col-md-4">
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
          </div>}

          {/* Passages */}
          {propertyDetails && (propertyDetails.Category === 'Residential') && <div className="col-md-4">
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
          </div>}

          {/* Year of Construction */}
          {propertyDetails && (propertyDetails.Category === 'Residential' || propertyDetails.Category === 'Commercial') && <div className="col-md-4">
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
                ></Select>
              </div>
            </div>
          </div>}

          {propertyDetails && (propertyDetails.Category === 'Residential' || propertyDetails.Category === 'Commercial') && <div className="col-md-4">
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
                  value={
                    propertyDetails &&
                    new Date().getFullYear() -
                    Number(propertyDetails.YearOfConstruction) +
                    " Years"
                  }
                />
              </div>
            </div>
          </div>}

          {/* Additional Area */}
          {propertyDetails && (propertyDetails.Category === 'Residential') && <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">
                {" "}
                Additional Area - ( {propertyDetails.AdditionalArea.length} )
              </label>
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
                      propertyDetails.RoofRightsClick
                        ? "custom_radio_button radiochecked"
                        : "custom_radio_button"
                    }
                  >
                    <input
                      type="checkbox"
                      id="roofrights_area"
                      onClick={(e) => {
                        if (propertyDetails.RoofRightsClick) {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalArea:
                              propertyDetails.AdditionalArea &&
                              propertyDetails.AdditionalArea.filter(
                                (elem) => elem !== "Roof Rights"
                              ),
                            RoofRightsClick: !propertyDetails.RoofRightsClick,
                          });
                        } else {
                          setPropertyDetails({
                            ...propertyDetails,
                            AdditionalArea: [
                              ...propertyDetails.AdditionalArea,
                              "Roof Rights",
                            ],
                            RoofRightsClick: !propertyDetails.RoofRightsClick,
                          });
                        }
                      }}
                    />
                    <label htmlFor="roofrights_area">
                      <div className="radio_icon">
                        <span className="material-symbols-outlined add">
                          add
                        </span>
                        <span className="material-symbols-outlined check">
                          done
                        </span>
                      </div>
                      <h6>Roof Rights</h6>
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
          </div>}

          {/* Power Backup */}
          {propertyDetails && (propertyDetails.Category === 'Residential' || propertyDetails.Category === 'Commercial') && (propertyDetails.PropertyType !== 'Land' && propertyDetails.PropertyType !== 'Other') && <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Power Backup</label>
              <div
                className="radio_group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  className="radio_group_single"
                  style={{ minWidth: "30%", width: "fit-content" }}
                >
                  <div
                    className={`custom_radio_button ${propertyDetails &&
                      propertyDetails.PowerBackup === "No Backup"
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
                <div
                  className="radio_group_single"
                  style={{ minWidth: "30%", width: "fit-content" }}
                >
                  <div
                    className={`custom_radio_button ${propertyDetails &&
                      propertyDetails.PowerBackup === "Full Backup"
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
                <div
                  className="radio_group_single"
                  style={{ minWidth: "30%", width: "fit-content" }}
                >
                  <div
                    className={`custom_radio_button ${propertyDetails &&
                      propertyDetails.PowerBackup === "Partial Backup"
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
                <div
                  className="radio_group_single"
                  style={{ minWidth: "30%", width: "fit-content" }}
                >
                  <div
                    className={`custom_radio_button ${propertyDetails &&
                      propertyDetails.PowerBackup === "Lift Only"
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
                <div
                  className="radio_group_single"
                  style={{ minWidth: "30%", width: "fit-content" }}
                >
                  <div
                    className={`custom_radio_button ${propertyDetails &&
                      propertyDetails.PowerBackup === "Inverter"
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
          </div>}

          {/* Super & Carpet Area */}
          <div className="col-md-4">
            <div className="form_field st-2 label_top">
              {propertyDetails.Category === 'Plot' ? <label htmlFor="">Area</label> : <label htmlFor="">Super area and Carpet area</label>}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "100%", padding: "5px 0 " }}>
                  <input
                    id="id_superArea"
                    className="custom-input"
                    style={{ paddingRight: "10px" }}
                    type="text"
                    placeholder="Super Area"
                    maxLength={8}
                    onInput={(e) => {
                      restrictInputWith2DecimalPoints(e, 5);
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
                {propertyDetails.Category !== 'Plot' && <div
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
                    maxLength={8}
                    onInput={(e) => {
                      restrictInputWith2DecimalPoints(e, 5);
                    }}
                    onChange={(e) =>
                      setPropertyDetails({
                        ...propertyDetails,
                        CarpetArea: e.target.value,
                      })
                    }
                    value={propertyDetails && propertyDetails.CarpetArea}
                  />
                </div>}
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
                            CarpetAreaUnit: "SqFt",
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
                            CarpetAreaUnit: "SqYd",
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
                            CarpetAreaUnit: "SqMtr",
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
                  {propertyDetails.Category === 'Plot' && <div className="radio_group_single" style={{ padding: "5px 0", width: "100%" }}>
                    <div
                      className={
                        propertyDetails.SuperAreaUnit === "Acre"
                          ? "custom_radio_button radiochecked"
                          : "custom_radio_button"
                      }
                    >
                      <input
                        type="checkbox"
                        id="superareaunit_Acre"
                        onClick={(e) => {
                          setPropertyDetails({
                            ...propertyDetails,
                            CarpetAreaUnit: "Acre",
                            SuperAreaUnit: "Acre",
                          });
                        }}
                      />
                      <label
                        htmlFor="superareaunit_Acre"
                        style={{ padding: "6px 0 10px 22px", height: "30px" }}
                      >
                        <div className="radio_icon">
                          <span
                            className="material-symbols-outlined add"
                            style={{
                              fontSize: "1rem",
                              transform: "translateX(-3px)",
                            }}
                          >
                            add
                          </span>
                          <span
                            className="material-symbols-outlined check"
                            style={{
                              fontSize: "1rem",
                              transform: "translateX(-3px)",
                            }}
                          >
                            done
                          </span>
                        </div>
                        <h6>Acre</h6>
                      </label>
                    </div>
                  </div>}
                </div>
              </div>
              <div>
                {(propertyDetails.Category === "Plot") ? <div className="field_error">Please enter Area & Unit</div> :
                  (propertyDetails.Category === "Residential" && ((propertyDetails.SuperArea === "" && propertyDetails.CarpetArea === "") || propertyDetails.SuperAreaUnit === "")) ? <div className="field_error">Please enter Super or Carpet Area & Unit  </div> :
                    ((propertyDetails.Category === "Residential" || propertyDetails.Category === "Commercial") &&
                      (propertyDetails.SuperArea !== "") && propertyDetails.CarpetArea !== "") &&
                      (Number(propertyDetails.SuperArea) <= Number(propertyDetails.CarpetArea)) ?
                      <div className="field_error">Super Area should be greater than Carpet Area  </div> :
                      (propertyDetails.Category === "Commercial" && (propertyDetails.CarpetArea === "" || propertyDetails.SuperAreaUnit === "")) ? <div className="field_error">Carpet Area & Unit is mandatory</div> : ""}
              </div>
            </div>

          </div>

          {/* Road Width */}
          {propertyDetails && propertyDetails.Category === 'Plot' &&
            <div className="col-md-4">
              <div>
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Road Width</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: "100%", padding: "5px 0 " }}>
                      <input
                        id="id_roadWidth"
                        className="custom-input"
                        style={{ paddingRight: "10px" }}
                        type="text"
                        placeholder="Road Width"
                        maxLength={2}
                        onInput={(e) => {
                          restrictInput(e, 2);
                        }}
                        onChange={(e) =>
                          setPropertyDetails({
                            ...propertyDetails,
                            RoadWidth: e.target.value,
                          })
                        }
                        value={propertyDetails && propertyDetails.RoadWidth}
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
                            propertyDetails.RoadWidthUnit === "Feet"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="roadwidth_Feet"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                RoadWidthUnit: "Feet",
                              });
                            }}
                          />
                          <label
                            htmlFor="roadwidth_Feet"
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
                            <h6>Feet</h6>
                          </label>
                        </div>
                      </div>
                      <div
                        className="radio_group_single"
                        style={{ padding: "5px 0", width: "100%" }}
                      >
                        <div
                          className={
                            propertyDetails.RoadWidthUnit === "Yard"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="roadwidth_Yard"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                RoadWidthUnit: "Yard",
                              });
                            }}
                          />
                          <label
                            htmlFor="roadwidth_Yard"
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
                            <h6>Yard</h6>
                          </label>
                        </div>
                      </div>
                      <div
                        className="radio_group_single"
                        style={{ padding: "5px 0", width: "100%" }}
                      >
                        <div
                          className={
                            propertyDetails.RoadWidthUnit === "Meter"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="roadwidth_Meter"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                RoadWidthUnit: "Meter",
                              });
                            }}
                          />
                          <label
                            htmlFor="roadwidth_Meter"
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
                            <h6>Meter</h6>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {(propertyDetails.RoadWidth === "" || propertyDetails.RoadWidth === "0" || propertyDetails.RoadWidthUnit === "") ? <div className="field_error">Please enter Road Width & Unit</div> : ""}
                  </div>
                </div>


              </div>
            </div>
          }

          {/* Total Floor */}
          {propertyDetails && (propertyDetails.Category === 'Residential' || (propertyDetails.Category === 'Commercial' && (propertyDetails.PropertyType !== 'Land' && propertyDetails.PropertyType !== 'Other'))) && <div className="col-md-4">
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
                    onChange={addFloorNumber(propertyDetails && propertyDetails.NumberOfFloors)}
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
          </div>}

          {/* Flat Floor No for Residential */}
          {/* {propertyDetails && propertyDetails.Category === 'Residential' && <div className="col-md-4">
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
          </div>} */}

          {/* Floor No for Commercial */}
          {propertyDetails && (propertyDetails.Category === 'Residential' || (propertyDetails.Category === 'Commercial' && (propertyDetails.PropertyType !== 'Land' && propertyDetails.PropertyType !== 'Other'))) &&
            <div className="col-xl-4 col-lg-6 col-md-4">
              <div className="form_field label_top">
                <label htmlFor="">Floor No</label>
                <div className="form_field_inner">

                  <select id="dropdown"
                    value={propertyDetails && propertyDetails.FloorNo}
                    onChange={(e) => {
                      setPropertyDetails({
                        ...propertyDetails,
                        FloorNo: e.target.value,
                      });

                    }}
                  >
                    {floornooptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}

                  </select>
                </div>
              </div>
            </div>}

          {/* No of Apts on Floor */}
          {propertyDetails && (propertyDetails.Category === 'Residential') && <div className="col-md-4">
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
                    value={
                      propertyDetails && propertyDetails.NumberOfFlatsOnFloor
                    }
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
          </div>}

          {/* No of Lifts */}
          {propertyDetails && (propertyDetails.Category === 'Residential' || propertyDetails.Category === 'Commercial') && (propertyDetails.PropertyType !== 'Land' && propertyDetails.PropertyType !== 'Other') && <div className="col-md-4">
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
          </div>}

          {/* Is Car Parking available */}
          {(propertyDetails && propertyDetails.Category !== 'Plot') && <div className="col-md-4">
            <div className="form_field st-2 label_top">
              {propertyDetails.Category === 'Residential' ? <label htmlFor="">Is Car Parking Available? </label> : <label htmlFor="">Is Private Car Parking Available? </label>}
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.IsCarParkingAvailable === "Yes"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="isCarParkingAvailable_yes"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              IsCarParkingAvailable: "Yes",
                            });
                          }}
                        />
                        <label
                          htmlFor="isCarParkingAvailable_yes"
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
                          propertyDetails.IsCarParkingAvailable === "No"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="isCarParkingAvailable_no"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              IsCarParkingAvailable: "No",
                            });
                          }}
                        />
                        <label
                          htmlFor="isCarParkingAvailable_no"
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
          </div>}

          {/* No of Close Car Parking */}
          {propertyDetails && (propertyDetails.Category === 'Residential' || propertyDetails.Category === 'Commercial') && (propertyDetails.IsCarParkingAvailable.toLowerCase() === "yes") && (propertyDetails.PropertyType !== 'Land' && propertyDetails.PropertyType !== 'Other') && <div className="col-md-4">
            <div className="form_field label_top">
              {propertyDetails.Category === 'Residential' ? <label htmlFor="">No. of Coverd Car Parking</label> : <label htmlFor="">No. of Car Parking</label>}
              <div className="plus_minus_input_wrapper">
                {propertyDetails.Category === 'Residential' ? <span className="pmi_label">#Covered</span> : <span className="pmi_label">#Count</span>}
                <div className="plus_minus_input">
                  <div
                    className="left-minus-button pmbutton"
                    onClick={() => {
                      decrementInput("numberOfCoveredCarParkingInput");
                    }}
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </div>

                  <input
                    id="numberOfCoveredCarParkingInput"
                    type="number"
                    disabled
                    value={
                      propertyDetails &&
                      propertyDetails.NumberOfCoveredCarParking
                    }
                  />
                  <div
                    className="right-plus-button pmbutton"
                    onClick={() => {
                      incrementInput("numberOfCoveredCarParkingInput");
                    }}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </div>
                </div>
              </div>
            </div>
          </div>}

          {/* No of Open Car Parking */}
          {propertyDetails && (propertyDetails.Category === 'Residential') && (propertyDetails.IsCarParkingAvailable.toLowerCase() === "yes") && (propertyDetails.PropertyType !== 'Land' && propertyDetails.PropertyType !== 'Other') && <div className="col-md-4">
            <div className="form_field label_top">
              <label htmlFor="">No. of Open Car Parking</label>
              <div className="plus_minus_input_wrapper">
                <span className="pmi_label">#Open</span>
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
                    value={
                      propertyDetails && propertyDetails.NumberOfOpenCarParking
                    }
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
          </div>}

          {/* two wheeler parking */}
          {propertyDetails && (propertyDetails.Category === 'Residential') && (propertyDetails.PropertyType !== 'Land' && propertyDetails.PropertyType !== 'Other') && <div className="col-md-4">
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
          </div>}
          {/* Charging Station for Electric Vehicle */}

          {(propertyDetails && propertyDetails.Category !== 'Plot') && <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Is EV Charging Point Available? </label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.EVChargingPointStatus === "Yes"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="evChargingPointStatus_yes"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              EVChargingPointStatus: "Yes",
                            });
                          }}
                        />
                        <label
                          htmlFor="evChargingPointStatus_yes"
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
                          propertyDetails.EVChargingPointStatus === "No"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="evChargingPointStatus_no"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              EVChargingPointStatus: "No",
                            });
                          }}
                        />
                        <label
                          htmlFor="evChargingPointStatus_no"
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
          </div>}
          {/* Private or Common Charging  Station for Electric Vehicle */}
          {(propertyDetails && propertyDetails.Category !== 'Plot') && propertyDetails.EVChargingPointStatus.toLowerCase() === "yes" &&
            <div className="col-md-4">
              <div className="form_field st-2 label_top">
                <label htmlFor="">EV Charging Point Type</label>
                <div className="form_field_inner">
                  <div className="form_field_container">
                    <div className="radio_group">
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.EVChargingPointType === "Private"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="evChargingPointType_private"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                EVChargingPointType: "Private",
                              });
                            }}
                          />
                          <label
                            htmlFor="evChargingPointType_private"
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
                            <h6>Private</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.EVChargingPointType === "Common"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="evChargingPointType_public"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                EVChargingPointType: "Common",
                              });
                            }}
                          />
                          <label
                            htmlFor="evChargingPointType_public"
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
                            <h6>Common</h6>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {propertyDetails && propertyDetails.Category === 'Plot' && <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Corner Side Plot? </label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.IsCornerSidePlot === "Yes"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="cornersideplot_yes"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              IsCornerSidePlot: "Yes",
                            });
                          }}
                        />
                        <label
                          htmlFor="cornersideplot_yes"
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
                          propertyDetails.IsCornerSidePlot === "No"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="cornersideplot_no"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              IsCornerSidePlot: "No",
                            });
                          }}
                        />
                        <label
                          htmlFor="cornersideplot_no"
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
              {(propertyDetails.IsCornerSidePlot === "") ? <div className="field_error">Is this corner side plot? </div> : ""}
            </div>
          </div>}

          {propertyDetails && propertyDetails.Category === 'Plot' && <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Park Facing Plot? </label>
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.IsParkFacingPlot === "Yes"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="parkfacingplot_yes"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              IsParkFacingPlot: "Yes",
                            });
                          }}
                        />
                        <label
                          htmlFor="parkfacingplot_yes"
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
                          propertyDetails.IsParkFacingPlot === "No"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="parkfacingplot_no"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              IsParkFacingPlot: "No",
                            });
                          }}
                        />
                        <label
                          htmlFor="parkfacingplot_no"
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
              {(propertyDetails.IsParkFacingPlot === "") ? <div className="field_error">Is this park facing plot? </div> : ""}
            </div>
          </div>}

          {<div className="col-md-4">
            <div className="form_field st-2 label_top">
              {propertyDetails.Category === 'Residential' ? <label htmlFor=""> Gated Community? </label> : <label htmlFor=""> Gated Complex? </label>}
              <div className="form_field_inner">
                <div className="form_field_container">
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.GatedArea === "Yes"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="gatedArea_yes"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              GatedArea: "Yes",
                            });
                          }}
                        />
                        <label
                          htmlFor="gatedArea_yes"
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
                          propertyDetails.GatedArea === "No"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="gatedArea_no"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              GatedArea: "No",
                            });
                          }}
                        />
                        <label
                          htmlFor="gatedArea_no"
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
              {(propertyDetails.GatedArea === "") ? <div className="field_error">Is this gated complex? </div> : ""}
            </div>
          </div>}


          {/* Lock-in Period */}
          {propertyDetails && (propertyDetails.Category === 'Residential' || propertyDetails.Category === 'Commercial') && <div className="col-md-4">
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
          </div>}

          {/* Pre-leased*/}
          {(propertyDetails && propertyDetails.Category === 'Commercial') &&
            <div className="col-md-4">
              <div className="form_field st-2 label_top">
                <label htmlFor=""> Pre-leased? </label>
                <div className="form_field_inner">
                  <div className="form_field_container">
                    <div className="radio_group">
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.IsPreleased === "Yes"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="isPreleased_yes"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                IsPreleased: "Yes",
                              });
                            }}
                          />
                          <label
                            htmlFor="isPreleased_yes"
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
                            propertyDetails.IsPreleased === "No"
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="isPreleased_no"
                            onClick={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                IsPreleased: "No",
                              });
                            }}
                          />
                          <label
                            htmlFor="isPreleased_no"
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
            </div>}

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
