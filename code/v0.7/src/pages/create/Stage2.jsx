import React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import { timestamp } from "../../firebase/config";

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
    NumberOfBedrooms: "0",
    NumberOfBathrooms: "0",
    Furnishing: "Raw",
    AdditionalRooms: [],
    ServentRoomClick: false,
    OfficeRoomClick: false,
    StoreRoomClick: false,
    PoojaRoomClick: false,
    StudyRoomClick: false,
    PowerRoomClick: false,
  });

  useEffect(() => {
    if (propertyDocument) {
      console.log("propertyDocument:", propertyDocument);

      setPropertyDetails({
        // All select type
        PropertyType: propertyDocument.propertyType
          ? propertyDocument.propertyType
          : "Select Property Type",
        Bhk: propertyDocument.bhk ? propertyDocument.bhk : "Select BHK",
        SuperArea: propertyDocument.superArea,
        SuperAreaUnit: propertyDocument.superAreaUnit,
        CarpetArea: propertyDocument.carpetArea,
        // NumberOfBedrooms: propertyDocument.numberOfBedrooms ? propertyDocument.numberOfBedrooms : 'Select Bedroom',
        NumberOfBedrooms: propertyDocument.numberOfBedrooms
          ? propertyDocument.numberOfBedrooms
          : "0",
        // NumberOfBathrooms: propertyDocument.numberOfBathrooms ? propertyDocument.numberOfBathrooms : 'Select Bathroom',
        NumberOfBathrooms: propertyDocument.numberOfBathrooms
          ? propertyDocument.numberOfBathrooms
          : "0",
        Furnishing: propertyDocument.furnishing
          ? propertyDocument.furnishing
          : "Raw",
        AdditionalRooms: propertyDocument.additionalRooms
          ? propertyDocument.additionalRooms
          : [],
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

  const handleBackSubmit = (e) => {
    // console.log('handleBackSubmit')
    props.setStateFlag("stage1");
  };

  const [bedroomInput, setbedroomInput] = useState(1);
  const [bathroomInput, setbathroomInput] = useState(1);

  function increamentInput(input) {
    var inputValue = document.getElementById(input).value;
    if (inputValue === "20") {
      //Don't do anything
    } else {
      inputValue++;
      if (input === "bedroomNumberInput") {
        setbedroomInput(inputValue);
        setPropertyDetails({
          ...propertyDetails,
          NumberOfBedrooms: inputValue,
        });
      } else if (input === "bathroomNumberInput") {
        setbathroomInput(inputValue);
        setPropertyDetails({
          ...propertyDetails,
          NumberOfBathrooms: inputValue,
        });
      }
    }
  }

  function decreamentInput(input) {
    var inputValue = document.getElementById(input).value;
    if (inputValue === "0") {
      //Don't do anything
    } else {
      inputValue--;
      if (input === "bedroomNumberInput") {
        setbedroomInput(inputValue);
        setPropertyDetails({
          ...propertyDetails,
          NumberOfBedrooms: inputValue,
        });
      } else if (input === "bathroomNumberInput") {
        setbathroomInput(inputValue);
        setPropertyDetails({
          ...propertyDetails,
          NumberOfBathrooms: inputValue,
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
    console.log(
      "propertyDetails.NumberOfBedrooms:",
      propertyDetails.NumberOfBedrooms
    );
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
      Number(propertyDetails.SuperArea) <= Number(propertyDetails.CarpetArea)
    ) {
      if (errorMsg === "Please select ")
        errorMsg = "Carpet Area should be less than Super Area";
      else errorMsg = errorMsg + ", Carpet Area should be less than Super Area";
      errorFlag = true;
    }

    if (errorFlag) setFormError(errorMsg);
    else setFormError("");

    const property = {
      propertyType: propertyDetails.PropertyType,
      bhk: propertyDetails.Bhk,
      numberOfBedrooms: propertyDetails.NumberOfBedrooms,
      numberOfBathrooms: propertyDetails.NumberOfBathrooms,
      furnishing: propertyDetails.Furnishing,
      additionalRooms: propertyDetails.AdditionalRooms
        ? propertyDetails.AdditionalRooms
        : [],
      superArea: propertyDetails.SuperArea ? propertyDetails.SuperArea : "",
      carpetArea: propertyDetails.CarpetArea ? propertyDetails.CarpetArea : "",
      superAreaUnit: propertyDetails.SuperAreaUnit,
    };

    // console.log('property:', property)

    if (propertyid !== "new") {
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

      if (!errorFlag) {
        // console.log('updatedProperty:', updatedProperty)
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

  return (
    <form>
      <div className="add_property_fields"
      
      >
     <div className="row">
      <div className="col-md-6">
      <div className="form_field st-2 new_radio_groups_parent new_single_field n_select_bg">
        <span className="no-floating">Property Type</span>
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
              propertyDetails && propertyDetails.PropertyType === "Low Rise Apt"
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
      </div>
      <div className="col-md-6">
      <div className="form_field st-2 new_radio_groups_parent new_single_field n_select_bg">
        <span className="no-floating">BHK</span>

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
              propertyDetails && propertyDetails.Bhk === "EWS" ? true : false
            }
          >
            EWS
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "1 RK" ? true : false
            }
          >
            1 RK
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "Studio" ? true : false
            }
          >
            Studio
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "1" ? true : false
            }
          >
            1 BHK
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "1.5" ? true : false
            }
          >
            1.5 BHK{" "}
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "2" ? true : false
            }
          >
            2 BHK{" "}
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "2.5" ? true : false
            }
          >
            2.5 BHK{" "}
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "3" ? true : false
            }
          >
            3 BHK{" "}
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "3.5 " ? true : false
            }
          >
            3.5 BHK{" "}
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "4" ? true : false
            }
          >
            4 BHK{" "}
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "5" ? true : false
            }
          >
            5 BHK{" "}
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "6" ? true : false
            }
          >
            6 BHK{" "}
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "7" ? true : false
            }
          >
            7 BHK{" "}
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "8" ? true : false
            }
          >
            8 BHK{" "}
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "9" ? true : false
            }
          >
            9 BHK{" "}
          </option>
          <option
            defaultValue={
              propertyDetails && propertyDetails.Bhk === "9+" ? true : false
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
      <div className="col-md-6">
      <div className="form_field st-2 new_radio_groups_parent new_single_field n_select_bg">
        <span className="no-floating">Rooms</span>
        <div className="row no-gutters">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="number-input-div">
              <h2>#Bedrooms</h2>
              <div>
                <div
                  className="left-minus-button"
                  onClick={() => {
                    decreamentInput("bedroomNumberInput");
                  }}
                >
                  <span className="material-symbols-outlined">remove</span>
                </div>

                <input
                  id="bedroomNumberInput"
                  style={{
                    background: "#eee",
                    borderTop: "1px solid #ddd",
                    height: "35px",
                    color: "#222",
                    padding: "0 0 0 4px",
                  }}
                  type="number"
                  disabled
                  value={propertyDetails && propertyDetails.NumberOfBedrooms}
                />
                <div
                  className="right-plus-button"
                  onClick={() => {
                    increamentInput("bedroomNumberInput");
                  }}
                >
                  <span className="material-symbols-outlined">add</span>
                </div>
              </div>
            </div>
            <div
              style={{
                border: "none",
                borderTop: "1px solid #ddd",
                padding: "5px 0",
                marginTop: "10px",
              }}
            ></div>
          </div>
          {/* <div className="verticall_gap"></div> */}
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="number-input-div">
              <h2>#Bathroom</h2>
              <div>
                <div
                  className="left-minus-button"
                  onClick={() => {
                    decreamentInput("bathroomNumberInput");
                  }}
                >
                  <span className="material-symbols-outlined">remove</span>
                </div>

                <input
                  id="bathroomNumberInput"
                  style={{
                    background: "#eee",
                    borderTop: "1px solid #ddd",
                    height: "35px",
                    color: "#222",
                    padding: "0 0 0 4px",
                  }}
                  type="number"
                  disabled
                  value={propertyDetails && propertyDetails.NumberOfBathrooms}
                />
                <div
                  className="right-plus-button"
                  onClick={() => {
                    increamentInput("bathroomNumberInput");
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
      <div className="col-md-6">
      <div className="form_field st-2 new_radio_groups_parent new_single_field n_select_bg">
        <span className="no-floating">Furnishing</span>
        <div
          className="radio_group"
          style={{ display: "flex", alignItems: "center" }}
        >
          <div className="radio_group_single" style={{ width: "100%" }}>
            <div
              className={`custom_radio_button ${
                propertyDetails && propertyDetails.Furnishing === "Semi"
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
                  <span className="material-symbols-outlined add">add</span>
                  <span className="material-symbols-outlined check">done</span>
                </div>
                <h6>Semi</h6>
              </label>
            </div>
          </div>
          <div className="radio_group_single" style={{ width: "100%" }}>
            <div
              className={`custom_radio_button ${
                propertyDetails && propertyDetails.Furnishing === "Fully"
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
                  <span className="material-symbols-outlined add">add</span>
                  <span className="material-symbols-outlined check">done</span>
                </div>
                <h6>Fully</h6>
              </label>
            </div>
          </div>
          <div className="radio_group_single" style={{ width: "100%" }}>
            <div
              className={`custom_radio_button ${
                propertyDetails && propertyDetails.Furnishing === "Raw"
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
                  <span className="material-symbols-outlined add">add</span>
                  <span className="material-symbols-outlined check">done</span>
                </div>
                <h6>Raw</h6>
              </label>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div className="col-md-6">
      <div className="form_field st-2 new_radio_groups_parent new_single_field n_select_bg">
        <span className="no-floating">
          Additional Rooms - ( {propertyDetails.AdditionalRooms.length} )
        </span>
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
                  <span className="material-symbols-outlined add">add</span>
                  <span className="material-symbols-outlined check">done</span>
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
                  <span className="material-symbols-outlined add">add</span>
                  <span className="material-symbols-outlined check">done</span>
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
                  <span className="material-symbols-outlined add">add</span>
                  <span className="material-symbols-outlined check">done</span>
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
                  <span className="material-symbols-outlined add">add</span>
                  <span className="material-symbols-outlined check">done</span>
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
                  <span className="material-symbols-outlined add">add</span>
                  <span className="material-symbols-outlined check">done</span>
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
                  <span className="material-symbols-outlined check">done</span>
                  <span className="material-symbols-outlined add">add</span>
                </div>
                <h6> Power Room</h6>
              </label>
            </div>
          </div>
        </div>
      </div>
      </div>
     </div> 
      </div>
   
  
      <div className="next_btn_back bottom_fixed_button">
        {formError && <p className="error">{formError}</p>}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="" style={{ width: "100%", padding: "0 20px 0 0" }}>
            <button
              className="theme_btn btn_fill"
              onClick={handleBackSubmit}
              style={{
                width: "100%",
              }}
            >
              {"<< Back"}
            </button>
          </div>

          <div className="" style={{ width: "100%", padding: "0 0 0 20px" }}>
            <button
              className="theme_btn btn_fill next_btn"
              onClick={handleNextSubmit}
              style={{
                width: "100%",
              }}
            >
              {"Next >>"}
            </button>
          </div>
        </div>{" "}
      </div>
    </form>
  );
};

export default Stage2;