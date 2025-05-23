import React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import { timestamp, projectStorage } from "../../firebase/config";
import RichTextEditor from "react-rte";
import Accordion from "react-bootstrap/Accordion";
// import Adcarousel from "../../../Components/Ads";
import Gallery from "react-image-gallery";
import Popup from "../../components/Popup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

import { useImageUpload } from "../../hooks/useImageUpload";

export default function Stage3(props) {
  const { propertyid } = useParams();
  // console.log('property id in Stage 2: ', propertyid)
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);

  // const [thumbnail, setThumbnail] = useState(null);
  // const [thumbnailError, setThumbnailError] = useState(null);
  // const { imgUpload, isImgCompressPending, imgCompressedFile } =
  //   useImageUpload();

  const { document: propertyDocument, error: propertyerror } = useDocument(
    "properties-propdial",
    propertyid
  );

  const { updateDocument, response: updateDocumentResponse } =
    useFirestore("properties-propdial");

  //Popup Flags
  const [showPopupFlag, setShowPopupFlag] = useState(false);
  const [editedPropDesc, setEditedPropDesc] = useState("");
  const [isPropDescEdit, setIsPropDescEdit] = useState(false);
  const [Propvalue, setPropValue] = useState(
    RichTextEditor.createValueFromString(
      propertyDocument && propertyDocument.propertyDescription + editedPropDesc,
      "html"
    )
  );

  const handleEditPropDesc = () => {
    setIsPropDescEdit(true);
  };

  const handleSavePropDesc = async () => {
    try {
      await updateDocument(propertyid, {
        propertyDescription: Propvalue.toString("html"),
      });
      setIsPropDescEdit(false);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleCancelPropDesc = () => {
    setIsPropDescEdit(false);
  };

  const [editedOwnerInstruction, setEditedOwnerInstruction] = useState("");
  const [isEditingOwnerInstruction, setIsEditingOwnerInstruction] =
    useState(false);
  const [ownerInstructionvalue, setOwnerInstrucitonValue] = useState(
    RichTextEditor.createValueFromString(
      propertyDocument &&
      propertyDocument.ownerInstructions + editedOwnerInstruction,
      "html"
    )
  );

  // START CODE FOR EDIT FIELDS
  const handleEditOwnerInstruction = () => {
    setIsEditingOwnerInstruction(true);
  };

  const handleSaveOwnerInstruction = async () => {
    try {
      await updateDocument(propertyid, {
        ownerInstructions: ownerInstructionvalue.toString("html"),
      });
      setIsEditingOwnerInstruction(false);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleCancelOwnerInstruction = () => {
    setIsEditingOwnerInstruction(false);
  };

  useEffect(() => {
    if (propertyDocument) {
      setPropValue(
        RichTextEditor.createValueFromString(
          propertyDocument.propertyDescription,
          "html"
        )
      );

      setOwnerInstrucitonValue(
        RichTextEditor.createValueFromString(
          propertyDocument.ownerInstructions,
          "html"
        )
      );
    }
  }, [propertyDocument]);

  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const [propertyDetails, setPropertyDetails] = useState({
    MainDoorFacing: "",
    OverLooking: [],
    Amenities: [],
    BalconyFacing: [],
    VisitingHrsFrom: "10:00 AM",
    VisitingHrsTo: "06:00 PM",
    VisitingDays: [],
    BachlorsBoysAllowed: "",
    BachlorsGirlsAllowed: "",
    PetsAllowed: "",
    VegNonVeg: "",
    PropertyDescription: "",
    OwnerInstructions: "",
    PropertyGoogleMap: "",
    PropertyVideoYouTubeLink: ""
  });

  useEffect(() => {
    if (propertyDocument) {
      console.log("Visiting Hrs From:", propertyDocument.visitingHrsFrom);
      setPropertyDetails({
        MainDoorFacing: propertyDocument.mainDoorFacing
          ? propertyDocument.mainDoorFacing
          : "",
        OverLooking: propertyDocument.overLooking
          ? propertyDocument.overLooking
          : [],
        Amenities: propertyDocument.amenities
          ? propertyDocument.amenities
          : [],
        BalconyFacing: propertyDocument.balconyFacing
          ? propertyDocument.balconyFacing
          : [],
        VisitingHrsFrom: propertyDocument.visitingHrsFrom
          ? propertyDocument.visitingHrsFrom
          : "10:00 AM",
        VisitingHrsTo: propertyDocument.visitingHrsTo
          ? propertyDocument.visitingHrsTo
          : "06:00 PM",
        VisitingDays: propertyDocument.visitingDays
          ? propertyDocument.visitingDays
          : [],
        BachlorsBoysAllowed: propertyDocument.bachlorsBoysAllowed
          ? propertyDocument.bachlorsBoysAllowed
          : "",
        BachlorsGirlsAllowed: propertyDocument.bachlorsGirlsAllowed
          ? propertyDocument.bachlorsGirlsAllowed
          : "",
        PetsAllowed: propertyDocument.petsAllowed
          ? propertyDocument.petsAllowed
          : "",
        VegNonVeg: propertyDocument.vegNonVeg ? propertyDocument.vegNonVeg : "",
        PropertyDescription: propertyDocument.propertyDescription
          ? propertyDocument.propertyDescription
          : "",
        OwnerInstructions: propertyDocument.ownerInstructions
          ? propertyDocument.ownerInstructions
          : "",
        PropertyGoogleMap: propertyDocument.propertyGoogleMap
          ? propertyDocument.propertyGoogleMap
          : "",
        PropertyVideoYouTubeLink: propertyDocument.propertyVideoYouTubeLink
          ? propertyDocument.propertyVideoYouTubeLink
          : "",


        // Visiting days Values
        MondayClick:
          propertyDocument.visitingDays &&
            propertyDocument.visitingDays.find((e) => e === "Monday")
            ? true
            : false,
        TuesdayClick:
          propertyDocument.visitingDays &&
            propertyDocument.visitingDays.find((e) => e === "Tuesday")
            ? true
            : false,
        WednesdayClick:
          propertyDocument.visitingDays &&
            propertyDocument.visitingDays.find((e) => e === "Wednesday")
            ? true
            : false,
        ThursdayClick:
          propertyDocument.visitingDays &&
            propertyDocument.visitingDays.find((e) => e === "Thursday")
            ? true
            : false,
        FridayClick:
          propertyDocument.visitingDays &&
            propertyDocument.visitingDays.find((e) => e === "Friday")
            ? true
            : false,
        SaturdayClick:
          propertyDocument.visitingDays &&
            propertyDocument.visitingDays.find((e) => e === "Saturday")
            ? true
            : false,
        SundayClick:
          propertyDocument.visitingDays &&
            propertyDocument.visitingDays.find((e) => e === "Sunday")
            ? true
            : false,

        //Balcony Values
        // Overlooking Values
        EastClick:
          propertyDocument.balconyFacing &&
            propertyDocument.balconyFacing.find((e) => e === "East")
            ? true
            : false,
        WestClick:
          propertyDocument.balconyFacing &&
            propertyDocument.balconyFacing.find((e) => e === "West")
            ? true
            : false,
        NorthClick:
          propertyDocument.balconyFacing &&
            propertyDocument.balconyFacing.find((e) => e === "North")
            ? true
            : false,
        SouthClick:
          propertyDocument.balconyFacing &&
            propertyDocument.balconyFacing.find((e) => e === "South")
            ? true
            : false,
        NorthEastClick:
          propertyDocument.balconyFacing &&
            propertyDocument.balconyFacing.find((e) => e === "North East")
            ? true
            : false,
        NorthWestClick:
          propertyDocument.balconyFacing &&
            propertyDocument.balconyFacing.find((e) => e === "North West")
            ? true
            : false,
        SouthEastClick:
          propertyDocument.balconyFacing &&
            propertyDocument.balconyFacing.find((e) => e === "South East")
            ? true
            : false,
        SouthWestClick:
          propertyDocument.balconyFacing &&
            propertyDocument.balconyFacing.find((e) => e === "South West")
            ? true
            : false,

        // Overlooking Values
        ClubClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Club")
            ? true
            : false,
        GardenParkClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Garden/Park")
            ? true
            : false,
        ChildrenPlayArea:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Children Play Area")
            ? true
            : false,
        OpenGymnasium:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Open Gymnasium")
            ? true
            : false,
        MainRoadClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Main Road")
            ? true
            : false,
        SocietyInternalRoadClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Society Internal Road")
            ? true
            : false,
        SwimmingPoolClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Swimming Pool")
            ? true
            : false,
        CentralParkClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Central Park")
            ? true
            : false,
        GolfClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Golf")
            ? true
            : false,
        HillViewClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Hill View")
            ? true
            : false,
        BeachClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Beach")
            ? true
            : false,
        LakeClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Lake")
            ? true
            : false,
        RiverClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "River")
            ? true
            : false,
        ForestClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Forest")
            ? true
            : false,
        OtherSocietyClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Other Society")
            ? true
            : false,
        SameSocietyTowerClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Same Society Tower")
            ? true
            : false,
        CornerClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Corner")
            ? true
            : false,

        // Amenities
        MaintenanceStaffClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "Maintenance Staff")
            ? true
            : false,
        ATMClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "ATM")
            ? true
            : false,
        ShoppingCenterClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "Shopping Center")
            ? true
            : false,
        CommonCafeteriaClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "Common Cafeteria")
            ? true
            : false,
        FoodCourtClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "Food Court")
            ? true
            : false,
        DGAvailabilityClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "DG Availability")
            ? true
            : false,
        CCTVClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "CCTV")
            ? true
            : false,
        GroceryShopClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "Grocery Shop")
            ? true
            : false,
        VisitiorParkingClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "Visitior Parking")
            ? true
            : false,
        PowerBackupClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "Power Backup")
            ? true
            : false,
        VastuComplaintClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "Vastu Complaint")
            ? true
            : false,
        SecurityStaffClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "Security Staff")
            ? true
            : false,
        IntercomClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "Intercom")
            ? true
            : false,
        LiftsClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "Lifts")
            ? true
            : false,
        HighSpeedLiftsClick:
          propertyDocument.amenities &&
            propertyDocument.amenities.find((e) => e === "HighSpeed Lifts")
            ? true
            : false,


      });
    }
  }, [propertyDocument]);

  function handleBackSubmit() {
    props.setStateFlag("stage2");
  }

  const handleNextSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    const property = {
      mainDoorFacing: propertyDetails.MainDoorFacing,
      overLooking: propertyDetails.OverLooking
        ? propertyDetails.OverLooking
        : [],
      amenities: propertyDetails.Amenities
        ? propertyDetails.Amenities
        : [],
      balconyFacing: propertyDetails.BalconyFacing
        ? propertyDetails.BalconyFacing
        : [],
      visitingHrsFrom: propertyDetails.VisitingHrsFrom,
      visitingHrsTo: propertyDetails.VisitingHrsTo,
      visitingDays: propertyDetails.VisitingDays
        ? propertyDetails.VisitingDays
        : [],
      bachlorsBoysAllowed: propertyDetails.BachlorsBoysAllowed,
      bachlorsGirlsAllowed: propertyDetails.BachlorsGirlsAllowed,
      petsAllowed: propertyDetails.PetsAllowed,
      vegNonVeg: propertyDetails.VegNonVeg,
      propertyDescription: propertyDetails.PropertyDescription,
      ownerInstructions: propertyDetails.OwnerInstructions,
      propertyGoogleMap: propertyDetails.PropertyGoogleMap,
      propertyVideoYouTubeLink: propertyDetails.PropertyVideoYouTubeLink


    };

    // console.log('property:', property)

    if (propertyid !== "new") {
      const updatedProperty = {
        ...property,
        updatedAt: timestamp.fromDate(new Date()),
        updatedBy: user.uid,
      };
      console.log("updatedProperty:", updatedProperty);
      // console.log('propertyid:', propertyid)
      await updateDocument(propertyid, updatedProperty);

      if (updateDocumentResponse.error) {
        navigate("/");
      } else {
        props.setStateFlag("stage4");
        navigate("/propertydetails/" + propertyid);
      }
    }
  };

  const [value, setValue] = useState("");
  return (
    <>
      {/* <Popup
        showPopupFlag={showPopupFlag}
        setShowPopupFlag={setShowPopupFlag}
        setPopupReturn={setPopupReturn}
        msg={"Are you sure you want to delete?"}
      /> */}
      <form>
        <div className="add_property_fields">
          <div className="stage4form">
            <div className="row row_gap form_full">
              {/* Main Door Facing */}
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  {propertyDocument && (propertyDocument.category === 'Residential' || propertyDocument.category === 'Commercial') ? <label htmlFor="">Main Door Facing</label> : <label htmlFor="">Direction Facing</label>}
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === "East"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="east_maindoorfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              MainDoorFacing: "East",
                            });
                          }}
                        />
                        <label htmlFor="east_maindoorfacing">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>East</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === "West"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="west_maindoorfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              MainDoorFacing: "West",
                            });
                          }}
                        />
                        <label htmlFor="west_maindoorfacing">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>West</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === "North"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="north_maindoorfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              MainDoorFacing: "North",
                            });
                          }}
                        />
                        <label htmlFor="north_maindoorfacing">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>North</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === "South"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="south_maindoorfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              MainDoorFacing: "South",
                            });
                          }}
                        />
                        <label htmlFor="south_maindoorfacing">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>South</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === "North East"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="northeast_maindoorfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              MainDoorFacing: "North East",
                            });
                          }}
                        />
                        <label htmlFor="northeast_maindoorfacing">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>North East</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === "North West"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="northwest_maindoorfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              MainDoorFacing: "North West",
                            });
                          }}
                        />
                        <label htmlFor="northwest_maindoorfacing">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>North West</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === "South East"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="southeast_maindoorfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              MainDoorFacing: "South East",
                            });
                          }}
                        />
                        <label htmlFor="southeast_maindoorfacing">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>South East</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === "South West"
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="southwest_maindoorfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              MainDoorFacing: "South West",
                            });
                          }}
                        />
                        <label htmlFor="southwest_maindoorfacing">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>South West</h6>
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Balcony: {propertyDocument.numberOfBalcony} */}
              {(propertyDetails && propertyDetails.Category !== 'Plot') && (propertyDocument && propertyDocument.numberOfBalcony > 0) &&
                <div className="col-md-6">
                  <div className="form_field st-2 label_top">
                    <label htmlFor="">Balcony Facing</label>
                    <div className="radio_group">
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.EastClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="east_balconyfacing"
                            onClick={(e) => {
                              if (propertyDetails.EastClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  BalconyFacing:
                                    propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.filter(
                                      (elem) => elem !== "East"
                                    ),
                                  EastClick: !propertyDetails.EastClick,
                                });
                              } else {
                                if (
                                  !propertyDetails.BalconyFacing ||
                                  (propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.length <
                                    propertyDocument.numberOfBalcony)
                                ) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    BalconyFacing: [
                                      ...propertyDetails.BalconyFacing,
                                      "East",
                                    ],
                                    EastClick: !propertyDetails.EastClick,
                                  });
                                }
                              }
                            }}
                          />
                          <label htmlFor="east_balconyfacing">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>East</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.WestClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="west_balconyfacing"
                            onClick={(e) => {
                              if (propertyDetails.WestClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  BalconyFacing:
                                    propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.filter(
                                      (elem) => elem !== "West"
                                    ),
                                  WestClick: !propertyDetails.WestClick,
                                });
                              } else {
                                if (
                                  !propertyDetails.BalconyFacing ||
                                  (propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.length <
                                    propertyDocument.numberOfBalcony)
                                ) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    BalconyFacing: [
                                      ...propertyDetails.BalconyFacing,
                                      "West",
                                    ],
                                    WestClick: !propertyDetails.WestClick,
                                  });
                                }
                              }
                            }}
                          />
                          <label htmlFor="west_balconyfacing">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>West</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.NorthClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="north_balconyfacing"
                            onClick={(e) => {
                              if (propertyDetails.NorthClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  BalconyFacing:
                                    propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.filter(
                                      (elem) => elem !== "North"
                                    ),
                                  NorthClick: !propertyDetails.NorthClick,
                                });
                              } else {
                                if (
                                  !propertyDetails.BalconyFacing ||
                                  (propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.length <
                                    propertyDocument.numberOfBalcony)
                                ) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    BalconyFacing: [
                                      ...propertyDetails.BalconyFacing,
                                      "North",
                                    ],
                                    NorthClick: !propertyDetails.NorthClick,
                                  });
                                }
                              }
                            }}
                          />
                          <label htmlFor="north_balconyfacing">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>North</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.SouthClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="south_balconyfacing"
                            onClick={(e) => {
                              if (propertyDetails.SouthClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  BalconyFacing:
                                    propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.filter(
                                      (elem) => elem !== "South"
                                    ),
                                  SouthClick: !propertyDetails.SouthClick,
                                });
                              } else {
                                if (
                                  !propertyDetails.BalconyFacing ||
                                  (propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.length <
                                    propertyDocument.numberOfBalcony)
                                ) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    BalconyFacing: [
                                      ...propertyDetails.BalconyFacing,
                                      "South",
                                    ],
                                    SouthClick: !propertyDetails.SouthClick,
                                  });
                                }
                              }
                            }}
                          />
                          <label htmlFor="south_balconyfacing">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>South</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.NorthEastClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="northeast_balconyfacing"
                            onClick={(e) => {
                              if (propertyDetails.NorthEastClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  BalconyFacing:
                                    propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.filter(
                                      (elem) => elem !== "North East"
                                    ),
                                  NorthEastClick:
                                    !propertyDetails.NorthEastClick,
                                });
                              } else {
                                if (
                                  !propertyDetails.BalconyFacing ||
                                  (propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.length <
                                    propertyDocument.numberOfBalcony)
                                ) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    BalconyFacing: [
                                      ...propertyDetails.BalconyFacing,
                                      "North East",
                                    ],
                                    NorthEastClick:
                                      !propertyDetails.NorthEastClick,
                                  });
                                }
                              }
                            }}
                          />
                          <label htmlFor="northeast_balconyfacing">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>North East</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.NorthWestClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="northwest_balconyfacing"
                            onClick={(e) => {
                              if (propertyDetails.NorthWestClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  BalconyFacing:
                                    propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.filter(
                                      (elem) => elem !== "North West"
                                    ),
                                  NorthWestClick:
                                    !propertyDetails.NorthWestClick,
                                });
                              } else {
                                if (
                                  !propertyDetails.BalconyFacing ||
                                  (propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.length <
                                    propertyDocument.numberOfBalcony)
                                ) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    BalconyFacing: [
                                      ...propertyDetails.BalconyFacing,
                                      "North West",
                                    ],
                                    NorthWestClick:
                                      !propertyDetails.NorthWestClick,
                                  });
                                }
                              }
                            }}
                          />
                          <label htmlFor="northwest_balconyfacing">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>North West</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.SouthEastClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="southeast_balconyfacing"
                            onClick={(e) => {
                              if (propertyDetails.SouthEastClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  BalconyFacing:
                                    propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.filter(
                                      (elem) => elem !== "South East"
                                    ),
                                  SouthEastClick:
                                    !propertyDetails.SouthEastClick,
                                });
                              } else {
                                if (
                                  !propertyDetails.BalconyFacing ||
                                  (propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.length <
                                    propertyDocument.numberOfBalcony)
                                ) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    BalconyFacing: [
                                      ...propertyDetails.BalconyFacing,
                                      "South East",
                                    ],
                                    SouthEastClick:
                                      !propertyDetails.SouthEastClick,
                                  });
                                }
                              }
                            }}
                          />
                          <label htmlFor="southeast_balconyfacing">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>South East</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.SouthWestClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="southwest_balconyfacing"
                            onClick={(e) => {
                              if (propertyDetails.SouthWestClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  BalconyFacing:
                                    propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.filter(
                                      (elem) => elem !== "South West"
                                    ),
                                  SouthWestClick:
                                    !propertyDetails.SouthWestClick,
                                });
                              } else {
                                if (
                                  !propertyDetails.BalconyFacing ||
                                  (propertyDetails.BalconyFacing &&
                                    propertyDetails.BalconyFacing.length <
                                    propertyDocument.numberOfBalcony)
                                ) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    BalconyFacing: [
                                      ...propertyDetails.BalconyFacing,
                                      "South West",
                                    ],
                                    SouthWestClick:
                                      !propertyDetails.SouthWestClick,
                                  });
                                }
                              }
                            }}
                          />
                          <label htmlFor="southwest_balconyfacing">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>South West</h6>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}


              {/* Overlooking */}
              <div className="col-md-12">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Overlooking</label>
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.ClubClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="club_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.ClubClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Club"
                                  ),
                                ClubClick: !propertyDetails.ClubClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Club",
                                ],
                                ClubClick: !propertyDetails.ClubClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="club_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Club</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.GardenParkClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="gardenpark_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.GardenParkClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Garden/Park"
                                  ),
                                GardenParkClick:
                                  !propertyDetails.GardenParkClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Garden/Park",
                                ],
                                GardenParkClick:
                                  !propertyDetails.GardenParkClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="gardenpark_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Garden/Park</h6>
                        </label>
                      </div>
                    </div>



                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.ChildrenPlayArea
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="childrenplayarea_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.ChildrenPlayArea) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Children Play Area"
                                  ),
                                ChildrenPlayArea:
                                  !propertyDetails.ChildrenPlayArea,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Children Play Area",
                                ],
                                ChildrenPlayArea:
                                  !propertyDetails.ChildrenPlayArea,
                              });
                            }
                          }}
                        />
                        <label htmlFor="childrenplayarea_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Children Play Area</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.OpenGymnasium
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="OpenGymnasium_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.OpenGymnasium) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Open Gymnasium"
                                  ),
                                OpenGymnasium:
                                  !propertyDetails.OpenGymnasium,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Open Gymnasium",
                                ],
                                OpenGymnasium:
                                  !propertyDetails.OpenGymnasium,
                              });
                            }
                          }}
                        />
                        <label htmlFor="OpenGymnasium_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Open Gymnasium</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainRoadClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="main_road_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.MainRoadClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Main Road"
                                  ),
                                MainRoadClick: !propertyDetails.MainRoadClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Main Road",
                                ],
                                MainRoadClick: !propertyDetails.MainRoadClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="main_road_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Main Road</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.SocietyInternalRoadClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="si_road_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.SocietyInternalRoadClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Society Internal Road"
                                  ),
                                SocietyInternalRoadClick: !propertyDetails.SocietyInternalRoadClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Society Internal Road",
                                ],
                                SocietyInternalRoadClick: !propertyDetails.SocietyInternalRoadClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="si_road_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Society Internal Road</h6>
                        </label>
                      </div>
                    </div>

                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.SwimmingPoolClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="swimmingpool_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.SwimmingPoolClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Swimming Pool"
                                  ),
                                SwimmingPoolClick:
                                  !propertyDetails.SwimmingPoolClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Swimming Pool",
                                ],
                                SwimmingPoolClick:
                                  !propertyDetails.SwimmingPoolClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="swimmingpool_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Swimming Pool</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.CentralParkClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button "
                        }
                      >
                        <input
                          type="checkbox"
                          id="centralpark_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.CentralParkClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Central Park"
                                  ),
                                CentralParkClick:
                                  !propertyDetails.CentralParkClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Central Park",
                                ],
                                CentralParkClick:
                                  !propertyDetails.CentralParkClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="centralpark_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Central Park</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.GolfClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="golf_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.GolfClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Golf"
                                  ),
                                GolfClick: !propertyDetails.GolfClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Golf",
                                ],
                                GolfClick: !propertyDetails.GolfClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="golf_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                          </div>
                          <h6>Golf</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.HillViewClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="hillview_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.HillViewClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Hill View"
                                  ),
                                HillViewClick: !propertyDetails.HillViewClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Hill View",
                                ],
                                HillViewClick: !propertyDetails.HillViewClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="hillview_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                          </div>
                          <h6>Hill View</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.BeachClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="beach_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.BeachClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Beach"
                                  ),
                                BeachClick: !propertyDetails.BeachClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Beach",
                                ],
                                BeachClick: !propertyDetails.BeachClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="beach_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                          </div>
                          <h6>Beach</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.LakeClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="lake_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.LakeClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Lake"
                                  ),
                                LakeClick: !propertyDetails.LakeClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Lake",
                                ],
                                LakeClick: !propertyDetails.LakeClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="lake_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                          </div>
                          <h6>Lake</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.RiverClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="river_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.RiverClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "River"
                                  ),
                                RiverClick: !propertyDetails.RiverClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "River",
                                ],
                                RiverClick: !propertyDetails.RiverClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="river_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                          </div>
                          <h6>River</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.ForestClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="forest_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.ForestClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Forest"
                                  ),
                                ForestClick: !propertyDetails.ForestClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Forest",
                                ],
                                ForestClick: !propertyDetails.ForestClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="forest_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                          </div>
                          <h6>Forest</h6>
                        </label>
                      </div>
                    </div>
                    {propertyDocument && (propertyDocument.category === 'Residential' || propertyDocument.category === 'Commercial') && <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.SameSocietyTowerClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="same_society_tower_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.SameSocietyTowerClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Same Society Tower"
                                  ),
                                SameSocietyTowerClick:
                                  !propertyDetails.SameSocietyTowerClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Same Society Tower",
                                ],
                                SameSocietyTowerClick:
                                  !propertyDetails.SameSocietyTowerClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="same_society_tower_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                          </div>
                          <h6>Same Society Tower</h6>
                        </label>
                      </div>
                    </div>}
                    {propertyDocument && (propertyDocument.category === 'Residential' || propertyDocument.category === 'Commercial') && <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.OtherSocietyClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="other_society_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.OtherSocietyClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Other Society"
                                  ),
                                OtherSocietyClick:
                                  !propertyDetails.OtherSocietyClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Other Society",
                                ],
                                OtherSocietyClick:
                                  !propertyDetails.OtherSocietyClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="other_society_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                          </div>
                          <h6>Other Society</h6>
                        </label>
                      </div>
                    </div>}


                    {/* <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.CornerClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="corner_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.CornerClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Corner"
                                  ),
                                CornerClick:
                                  !propertyDetails.CornerClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Corner",
                                ],
                                CornerClick:
                                  !propertyDetails.CornerClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="corner_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                          </div>
                          <h6>Corner</h6>
                        </label>
                      </div>
                    </div> */}

                  </div>
                </div>
              </div>

              {/* Amenities: */}
              {propertyDetails && propertyDetails.Category === 'Commercial' &&
                <div className="col-md-12">
                  <div className="form_field st-2 label_top">
                    <label htmlFor="">Amenities</label>
                    <div className="radio_group">
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.MaintenanceStaffClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_maintenancestaff"
                            onClick={(e) => {
                              if (propertyDetails.MaintenanceStaffClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "Maintenance Staff"
                                    ),
                                  MaintenanceStaffClick: !propertyDetails.MaintenanceStaffClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "Maintenance Staff",
                                  ],
                                  MaintenanceStaffClick: !propertyDetails.MaintenanceStaffClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_maintenancestaff">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>Maintenance Staff</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.ATMClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_atm"
                            onClick={(e) => {
                              if (propertyDetails.ATMClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "ATM"
                                    ),
                                  ATMClick:
                                    !propertyDetails.ATMClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "ATM",
                                  ],
                                  ATMClick:
                                    !propertyDetails.ATMClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_atm">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>ATM</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.ShoppingCenterClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_shoppingcenter"
                            onClick={(e) => {
                              if (propertyDetails.ShoppingCenterClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "Shopping Center"
                                    ),
                                  ShoppingCenterClick:
                                    !propertyDetails.ShoppingCenterClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "Shopping Center",
                                  ],
                                  ShoppingCenterClick:
                                    !propertyDetails.ShoppingCenterClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_shoppingcenter">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>Shopping Center</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.CommonCafeteriaClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_commoncafeteria"
                            onClick={(e) => {
                              if (propertyDetails.CommonCafeteriaClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "Common Cafeteria"
                                    ),
                                  CommonCafeteriaClick:
                                    !propertyDetails.CommonCafeteriaClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "Common Cafeteria",
                                  ],
                                  CommonCafeteriaClick:
                                    !propertyDetails.CommonCafeteriaClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_commoncafeteria">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>Common Cafeteria</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.FoodCourtClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_foodcourt"
                            onClick={(e) => {
                              if (propertyDetails.FoodCourtClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "Food Court"
                                    ),
                                  FoodCourtClick:
                                    !propertyDetails.FoodCourtClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "Food Court",
                                  ],
                                  FoodCourtClick:
                                    !propertyDetails.FoodCourtClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_foodcourt">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>Food Court</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.DGAvailabilityClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_dgavailability"
                            onClick={(e) => {
                              if (propertyDetails.DGAvailabilityClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "DG Availability"
                                    ),
                                  DGAvailabilityClick:
                                    !propertyDetails.DGAvailabilityClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "DG Availability",
                                  ],
                                  DGAvailabilityClick:
                                    !propertyDetails.DGAvailabilityClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_dgavailability">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>DG Availability</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.CCTVClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_cctv"
                            onClick={(e) => {
                              if (propertyDetails.CCTVClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "CCTV"
                                    ),
                                  CCTVClick:
                                    !propertyDetails.CCTVClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "CCTV",
                                  ],
                                  CCTVClick:
                                    !propertyDetails.CCTVClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_cctv">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>CCTV</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.GroceryShopClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_groceryshop"
                            onClick={(e) => {
                              if (propertyDetails.GroceryShopClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "Grocery Shop"
                                    ),
                                  GroceryShopClick:
                                    !propertyDetails.GroceryShopClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "Grocery Shop",
                                  ],
                                  GroceryShopClick:
                                    !propertyDetails.GroceryShopClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_groceryshop">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>Grocery Shop</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.VisitiorParkingClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_visitiorparking"
                            onClick={(e) => {
                              if (propertyDetails.VisitiorParkingClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "Visitior Parking"
                                    ),
                                  VisitiorParkingClick:
                                    !propertyDetails.VisitiorParkingClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "Visitior Parking",
                                  ],
                                  VisitiorParkingClick:
                                    !propertyDetails.VisitiorParkingClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_visitiorparking">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>Visitior Parking</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.PowerBackupClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_powerbackup"
                            onClick={(e) => {
                              if (propertyDetails.PowerBackupClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "Power Backup"
                                    ),
                                  PowerBackupClick:
                                    !propertyDetails.PowerBackupClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "Power Backup",
                                  ],
                                  PowerBackupClick:
                                    !propertyDetails.PowerBackupClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_powerbackup">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>Power Backup</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.VastuComplaintClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_vastucomplaint"
                            onClick={(e) => {
                              if (propertyDetails.VastuComplaintClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "Vastu Complaint"
                                    ),
                                  VastuComplaintClick:
                                    !propertyDetails.VastuComplaintClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "Vastu Complaint",
                                  ],
                                  VastuComplaintClick:
                                    !propertyDetails.VastuComplaintClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_vastucomplaint">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>Vastu Complaint</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.SecurityStaffClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_securitystaff"
                            onClick={(e) => {
                              if (propertyDetails.SecurityStaffClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "Security Staff"
                                    ),
                                  SecurityStaffClick:
                                    !propertyDetails.SecurityStaffClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "Security Staff",
                                  ],
                                  SecurityStaffClick:
                                    !propertyDetails.SecurityStaffClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_securitystaff">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>Security Staff</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.IntercomClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_intercom"
                            onClick={(e) => {
                              if (propertyDetails.IntercomClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "Intercom"
                                    ),
                                  IntercomClick:
                                    !propertyDetails.IntercomClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "Intercom",
                                  ],
                                  IntercomClick:
                                    !propertyDetails.IntercomClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_intercom">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>Intercom</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.LiftsClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_lifts"
                            onClick={(e) => {
                              if (propertyDetails.LiftsClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "Lifts"
                                    ),
                                  LiftsClick:
                                    !propertyDetails.LiftsClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "Lifts",
                                  ],
                                  LiftsClick:
                                    !propertyDetails.LiftsClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_lifts">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>Lifts</h6>
                          </label>
                        </div>
                      </div>
                      <div className="radio_group_single">
                        <div
                          className={
                            propertyDetails.HighSpeedLiftsClick
                              ? "custom_radio_button radiochecked"
                              : "custom_radio_button"
                          }
                        >
                          <input
                            type="checkbox"
                            id="amenities_highspeedlifts"
                            onClick={(e) => {
                              if (propertyDetails.HighSpeedLiftsClick) {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities:
                                    propertyDetails.Amenities &&
                                    propertyDetails.Amenities.filter(
                                      (elem) => elem !== "HighSpeed Lifts"
                                    ),
                                  HighSpeedLiftsClick:
                                    !propertyDetails.HighSpeedLiftsClick,
                                });
                              } else {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Amenities: [
                                    ...propertyDetails.Amenities,
                                    "HighSpeed Lifts",
                                  ],
                                  HighSpeedLiftsClick:
                                    !propertyDetails.HighSpeedLiftsClick,
                                });
                              }
                            }}
                          />
                          <label htmlFor="amenities_highspeedlifts">
                            <div className="radio_icon">
                              <span className="material-symbols-outlined add">
                                add
                              </span>
                              <span className="material-symbols-outlined check">
                                done
                              </span>
                            </div>
                            <h6>HighSpeed Lifts</h6>
                          </label>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>}

              {/* Visiting Hours From */}
              <div className="col-md-6">
                <div className="form_field label_top">
                  <label htmlFor="">Visiting Hours From</label>
                  <div className="form_field_inner">
                    <input
                      type="time"
                      min="09:00"
                      max="18:00"
                      step="1800"
                      // placeholder="dd/mm/yyyy"
                      value={propertyDetails.VisitingHrsFrom}
                      // value="10:00"
                      onChange={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          VisitingHrsFrom: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Visiting Hours To */}
              <div className="col-md-6">
                <div className="form_field label_top">
                  <label htmlFor="">Visiting Hours To</label>
                  <div className="form_field_inner">
                    <input
                      type="time"
                      min="10:00"
                      max="18:00"
                      step="1800"
                      // placeholder="dd/mm/yyyy"
                      value={propertyDetails.VisitingHrsTo}
                      onChange={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          VisitingHrsTo: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Visiting Days */}
              <div className="col-md-12">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Visiting Days</label>
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MondayClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="monday_visitingdays"
                          onClick={(e) => {
                            if (propertyDetails.MondayClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays:
                                  propertyDetails.VisitingDays &&
                                  propertyDetails.VisitingDays.filter(
                                    (elem) => elem !== "Monday"
                                  ),
                                MondayClick: !propertyDetails.MondayClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays: [
                                  ...propertyDetails.VisitingDays,
                                  "Monday",
                                ],
                                MondayClick: !propertyDetails.MondayClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="monday_visitingdays">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Monday</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.TuesdayClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="tuesday_visitingdays"
                          onClick={(e) => {
                            if (propertyDetails.TuesdayClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays:
                                  propertyDetails.VisitingDays &&
                                  propertyDetails.VisitingDays.filter(
                                    (elem) => elem !== "Tuesday"
                                  ),
                                TuesdayClick: !propertyDetails.TuesdayClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays: [
                                  ...propertyDetails.VisitingDays,
                                  "Tuesday",
                                ],
                                TuesdayClick: !propertyDetails.TuesdayClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="tuesday_visitingdays">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Tuesday</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.WednesdayClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="wednesday_visitingdays"
                          onClick={(e) => {
                            if (propertyDetails.WednesdayClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays:
                                  propertyDetails.VisitingDays &&
                                  propertyDetails.VisitingDays.filter(
                                    (elem) => elem !== "Wednesday"
                                  ),
                                WednesdayClick: !propertyDetails.WednesdayClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays: [
                                  ...propertyDetails.VisitingDays,
                                  "Wednesday",
                                ],
                                WednesdayClick: !propertyDetails.WednesdayClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="wednesday_visitingdays">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Wednesday</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.ThursdayClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="thursday_visitingdays"
                          onClick={(e) => {
                            if (propertyDetails.ThursdayClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays:
                                  propertyDetails.VisitingDays &&
                                  propertyDetails.VisitingDays.filter(
                                    (elem) => elem !== "Thursday"
                                  ),
                                ThursdayClick: !propertyDetails.ThursdayClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays: [
                                  ...propertyDetails.VisitingDays,
                                  "Thursday",
                                ],
                                ThursdayClick: !propertyDetails.ThursdayClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="thursday_visitingdays">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Thursday</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      {/* {console.log(propertyDetails.StudyRoomClick)} */}
                      <div
                        className={
                          propertyDetails.FridayClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button "
                        }
                      >
                        <input
                          type="checkbox"
                          id="friday_visitingdays"
                          onClick={(e) => {
                            if (propertyDetails.FridayClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays:
                                  propertyDetails.VisitingDays &&
                                  propertyDetails.VisitingDays.filter(
                                    (elem) => elem !== "Friday"
                                  ),
                                FridayClick: !propertyDetails.FridayClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays: [
                                  ...propertyDetails.VisitingDays,
                                  "Friday",
                                ],
                                FridayClick: !propertyDetails.FridayClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="friday_visitingdays">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Friday</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.SaturdayClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="saturday_visitingdays"
                          onClick={(e) => {
                            if (propertyDetails.SaturdayClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays:
                                  propertyDetails.VisitingDays &&
                                  propertyDetails.VisitingDays.filter(
                                    (elem) => elem !== "Saturday"
                                  ),
                                SaturdayClick: !propertyDetails.SaturdayClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays: [
                                  ...propertyDetails.VisitingDays,
                                  "Saturday",
                                ],
                                SaturdayClick: !propertyDetails.SaturdayClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="saturday_visitingdays">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                          </div>
                          <h6>Saturday</h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.SundayClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="sunday_visitingdays"
                          onClick={(e) => {
                            if (propertyDetails.SundayClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays:
                                  propertyDetails.VisitingDays &&
                                  propertyDetails.VisitingDays.filter(
                                    (elem) => elem !== "Sunday"
                                  ),
                                SundayClick: !propertyDetails.SundayClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                VisitingDays: [
                                  ...propertyDetails.VisitingDays,
                                  "Sunday",
                                ],
                                SundayClick: !propertyDetails.SundayClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="sunday_visitingdays">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                          </div>
                          <h6>Sunday</h6>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bachelor Boys Allowed */}
              {
                (propertyDocument && propertyDocument.category === 'Residential')
                && (
                  <div className="col-md-6">
                    <div className="form_field st-2 label_top">
                      <label htmlFor="">Bachelor Boys Allowed</label>
                      <div className="form_field_inner">
                        <div className="form_field_container">
                          <div className="radio_group">
                            <div className="radio_group_single">
                              <div
                                className={
                                  propertyDetails.BachlorsBoysAllowed === "Yes"
                                    ? "custom_radio_button radiochecked"
                                    : "custom_radio_button"
                                }
                              >
                                <input
                                  type="checkbox"
                                  id="bachloresboysallowed_yes"
                                  onClick={(e) => {
                                    setPropertyDetails({
                                      ...propertyDetails,
                                      BachlorsBoysAllowed: "Yes",
                                    });
                                  }}
                                />
                                <label
                                  htmlFor="bachloresboysallowed_yes"
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
                                  propertyDetails.BachlorsBoysAllowed === "No"
                                    ? "custom_radio_button radiochecked"
                                    : "custom_radio_button"
                                }
                              >
                                <input
                                  type="checkbox"
                                  id="bachloresboysallowed_no"
                                  onClick={(e) => {
                                    setPropertyDetails({
                                      ...propertyDetails,
                                      BachlorsBoysAllowed: "No",
                                    });
                                  }}
                                />
                                <label
                                  htmlFor="bachloresboysallowed_no"
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
                  </div>)}
              {/* Bachelor Girls Allowed */}
              {propertyDocument && propertyDocument.category === 'Residential' && <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Bachelor Girls Allowed</label>
                  <div className="form_field_inner">
                    <div className="form_field_container">
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={
                              propertyDetails.BachlorsGirlsAllowed === "Yes"
                                ? "custom_radio_button radiochecked"
                                : "custom_radio_button"
                            }
                          >
                            <input
                              type="checkbox"
                              id="bachloresgirlsallowed_yes"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  BachlorsGirlsAllowed: "Yes",
                                });
                              }}
                            />
                            <label
                              htmlFor="bachloresgirlsallowed_yes"
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
                              propertyDetails.BachlorsGirlsAllowed === "No"
                                ? "custom_radio_button radiochecked"
                                : "custom_radio_button"
                            }
                          >
                            <input
                              type="checkbox"
                              id="bachloresgirlsallowed_no"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  BachlorsGirlsAllowed: "No",
                                });
                              }}
                            />
                            <label
                              htmlFor="bachloresgirlsallowed_no"
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
              {/* Pets Allowed */}
              {propertyDocument && propertyDocument.category === 'Residential' && <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Pets Allowed</label>
                  <div className="form_field_inner">
                    <div className="form_field_container">
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={
                              propertyDetails.PetsAllowed === "Yes"
                                ? "custom_radio_button radiochecked"
                                : "custom_radio_button"
                            }
                          >
                            <input
                              type="checkbox"
                              id="petsallowed_yes"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  PetsAllowed: "Yes",
                                });
                              }}
                            />
                            <label
                              htmlFor="petsallowed_yes"
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
                              propertyDetails.PetsAllowed === "No"
                                ? "custom_radio_button radiochecked"
                                : "custom_radio_button"
                            }
                          >
                            <input
                              type="checkbox"
                              id="petsallowed_no"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  PetsAllowed: "No",
                                });
                              }}
                            />
                            <label
                              htmlFor="petsallowed_no"
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
              {/* Vegetarian / Non-Vegetarian */}
              {propertyDocument && propertyDocument.category === 'Residential' && <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Food Habit</label>
                  <div className="form_field_inner">
                    <div className="form_field_container">
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={
                              propertyDetails.VegNonVeg === "Veg"
                                ? "custom_radio_button radiochecked"
                                : "custom_radio_button"
                            }
                          >
                            <input
                              type="checkbox"
                              id="vegnonveg_veg"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  VegNonVeg: "Veg",
                                });
                              }}
                            />
                            <label
                              htmlFor="vegnonveg_veg"
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
                              <h6>Vegetarian</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={
                              propertyDetails.VegNonVeg === "Non-Veg"
                                ? "custom_radio_button radiochecked"
                                : "custom_radio_button"
                            }
                          >
                            <input
                              type="checkbox"
                              id="vegnonveg_nonveg"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  VegNonVeg: "Non-Veg",
                                });
                              }}
                            />
                            <label
                              htmlFor="vegnonveg_nonveg"
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
                              <h6>No-Restrictions</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}

              {/* New Property Description */}
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Property Description</label>
                  <div className="form_field_inner">
                    <div className="form_field_container">
                      {isPropDescEdit ? (
                        <div>
                          <div>
                            <RichTextEditor
                              value={Propvalue}
                              onChange={setPropValue}
                            />
                          </div>
                          <div className="vg10"></div>
                          <div className="d-flex justify-content-between">
                            <div
                              className="theme_btn btn_border no_icon"
                              onClick={handleCancelPropDesc}
                              style={{
                                width: "fit-content",
                              }}
                            >
                              Cancel
                            </div>
                            <div
                              className="theme_btn btn_fill no_icon"
                              onClick={handleSavePropDesc}
                              style={{
                                width: "fit-content",
                              }}
                            >
                              Save
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="d-flex align-items-center">
                            <p
                              className="editortext"
                              dangerouslySetInnerHTML={{
                                __html:
                                  propertyDocument &&
                                  propertyDocument.propertyDescription.toString(
                                    "html"
                                  ),
                              }}
                            ></p>
                            {!isPropDescEdit &&
                              user &&
                              (user.role === "owner" ||
                                user.role === "admin" || user.role === "superAdmin") && (
                                <span
                                  className="material-symbols-outlined click_icon text_near_icon"
                                  onClick={() =>
                                    handleEditPropDesc("propertyDescription")
                                  }
                                  style={{
                                    marginTop: "5px",
                                  }}
                                >
                                  edit
                                </span>
                              )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* New Owner Instruction */}
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Owner Instruction</label>
                  <div className="form_field_inner">
                    <div className="form_field_container">
                      {isEditingOwnerInstruction ? (
                        <div>
                          <div>
                            <RichTextEditor
                              value={ownerInstructionvalue}
                              onChange={setOwnerInstrucitonValue}
                            />
                          </div>
                          <div className="vg10"></div>
                          <div className="d-flex justify-content-between">
                            <div
                              className="theme_btn btn_border no_icon
no_icon"
                              onClick={handleCancelOwnerInstruction}
                              style={{
                                width: "fit-content",
                              }}
                            >
                              Cancel
                            </div>
                            <div
                              className="theme_btn btn_fill no_icon
no_icon"
                              onClick={handleSaveOwnerInstruction}
                              style={{
                                width: "fit-content",
                              }}
                            >
                              Save
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="d-flex align-items-center">
                            <p
                              dangerouslySetInnerHTML={{
                                __html:
                                  propertyDocument &&
                                  propertyDocument.ownerInstructions.toString(
                                    "html"
                                  ),
                              }}
                            ></p>
                            {!isEditingOwnerInstruction &&
                              user &&
                              (user.role === "admin" || user.role === "superAdmin") && (
                                <span
                                  className="material-symbols-outlined click_icon text_near_icon"
                                  onClick={() =>
                                    handleEditOwnerInstruction(
                                      "ownerInstructions"
                                    )
                                  }
                                  style={{
                                    marginTop: "5px",
                                  }}
                                >
                                  edit
                                </span>
                              )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Google Map Link */}
              <div className="col-md-12">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Property Google Map Link</label>
                  <div className="form_field_inner">
                    <div className="form_field_container">
                      <input
                        type="text"
                        placeholder="Enter Property Google Map Link"
                        maxLength={1000}
                        onChange={(e) =>
                          setPropertyDetails({
                            ...propertyDetails,
                            PropertyGoogleMap: e.target.value,
                          })
                        }
                        value={propertyDetails && propertyDetails.PropertyGoogleMap}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Video YouTube Link */}
              <div className="col-md-12">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Property Video YouTube Link</label>
                  <div className="form_field_inner">
                    <div className="form_field_container">
                      <input
                        type="text"
                        placeholder="Enter Property Video YouTube Link"
                        maxLength={1000}
                        onChange={(e) =>
                          setPropertyDetails({
                            ...propertyDetails,
                            PropertyVideoYouTubeLink: e.target.value,
                          })
                        }
                        value={propertyDetails && propertyDetails.PropertyVideoYouTubeLink}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Description */}
              {/* <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Property Description</label>
                  <div className="form_field_inner">
                    <div className="form_field_container">
                      <ReactQuill
                        theme="snow" // Specify the theme ('snow' for a clean, modern look)
                        placeholder="Type here..." // Add placeholder prop here
                        value={
                          propertyDetails && propertyDetails.PropertyDescription
                        }
                        // onChange={setValue} // Set the value state when the editor content changes
                        onChange={(e) => {
                          setPropertyDetails({
                            ...propertyDetails,
                            PropertyDescription: e.target.value,
                          });
                        }}
                        modules={{
                          toolbar: [
                            [{ header: "1" }, { header: "2" }, { font: [] }],
                            [{ size: [] }],
                            [
                              "bold",
                              "italic",
                              "underline",
                              "strike",
                              "blockquote",
                            ],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              { indent: "-1" },
                              { indent: "+1" },
                            ],
                            ["link", "image", "video"],
                            ["clean"],
                          ],
                        }}
                        formats={[
                          "header",
                          "font",
                          "size",
                          "bold",
                          "italic",
                          "underline",
                          "strike",
                          "blockquote",
                          "list",
                          "bullet",
                          "indent",
                          "link",
                          "image",
                          "video",
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div> */}
              {/* Owner Instructions */}
              {/* <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Owner Instruction</label>
                  <div className="form_field_inner">
                    <div className="form_field_container">
                      <ReactQuill
                        theme="snow" // Specify the theme ('snow' for a clean, modern look)
                        value={value}
                        onChange={setValue} // Set the value state when the editor content changes
                        placeholder="Type here..." // Add placeholder prop here
                        modules={{
                          toolbar: [
                            [{ header: "1" }, { header: "2" }, { font: [] }],
                            [{ size: [] }],
                            [
                              "bold",
                              "italic",
                              "underline",
                              "strike",
                              "blockquote",
                            ],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              { indent: "-1" },
                              { indent: "+1" },
                            ],
                            ["link", "image", "video"],
                            ["clean"],
                          ],
                        }}
                        formats={[
                          "header",
                          "font",
                          "size",
                          "bold",
                          "italic",
                          "underline",
                          "strike",
                          "blockquote",
                          "list",
                          "bullet",
                          "indent",
                          "link",
                          "image",
                          "video",
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="verticall_gap"></div>
        {formError && <p className="error_new">{formError}</p>}
        <div
          style={{ display: "flex", alignItems: "center", gap: "22px" }}
          className="next_btn_back bottom_fixed_button"
        >
          <button
            className="theme_btn btn_border full_width no_icon"
            onClick={handleBackSubmit}
          >
            {"<< Back"}
          </button>

          <button
            className="theme_btn btn_fill full_width no_icon"
            onClick={handleNextSubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
