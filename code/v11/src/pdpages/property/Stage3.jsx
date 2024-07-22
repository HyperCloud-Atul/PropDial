import React from 'react'
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import { timestamp, projectStorage } from "../../firebase/config";
import Accordion from 'react-bootstrap/Accordion';
// import Adcarousel from "../../../Components/Ads";
import Gallery from "react-image-gallery";
import Popup from "../../components/Popup";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles


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

  //Popup Flags
  const [showPopupFlag, setShowPopupFlag] = useState(false);

  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const { document: propertyDocument, error: propertyerror } = useDocument(
    "properties",
    propertyid
  );

  const { updateDocument, response: updateDocumentResponse } =
    useFirestore("properties");

  const [propertyDetails, setPropertyDetails] = useState({
    MainDoorFacing: "",
    OverLooking: [],
    BalconyFacing: "",
    VisitingHrsFrom: "",
    VisitingHrsTo: "",
    VisitingDays: [],
    BachlorsBoysAllowed: "",
    BachlorsGirlsAllowed: "",
    PetsAllowed: "",
    VegNonVeg: "",
    PropertyDescription: "",
    OwnerInstructions: "",
  })



  useEffect(() => {
    if (propertyDocument) {
      console.log('Visiting Hrs From:', propertyDocument.visitingHrsFrom)
      setPropertyDetails({
        MainDoorFacing: propertyDocument.mainDoorFacing ? propertyDocument.mainDoorFacing : "",
        OverLooking: propertyDocument.overLooking ? propertyDocument.overLooking : [],
        BalconyFacing: propertyDocument.balconyFacing ? propertyDocument.balconyFacing : "",
        VisitingHrsFrom: propertyDocument.visitingHrsFrom ? propertyDocument.visitingHrsFrom : "",
        VisitingHrsTo: propertyDocument.visitingHrsTo ? propertyDocument.visitingHrsTo : "",
        VisitingDays: propertyDocument.visitingDays ? propertyDocument.visitingDays : [],
        BachlorsBoysAllowed: propertyDocument.bachlorsBoysAllowed ? propertyDocument.bachlorsBoysAllowed : "",
        BachlorsGirlsAllowed: propertyDocument.bachlorsGirlsAllowed ? propertyDocument.bachlorsGirlsAllowed : "",
        PetsAllowed: propertyDocument.petsAllowed ? propertyDocument.petsAllowed : "",
        VegNonVeg: propertyDocument.vegNonVeg ? propertyDocument.vegNonVeg : "",
        PropertyDescription: propertyDocument.propertyDescription ? propertyDocument.propertyDescription : "",
        OwnerInstructions: propertyDocument.ownerInstructions ? propertyDocument.ownerInstructions : "",

        // Visiting Hrs Values
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
        RoadClick:
          propertyDocument.overLooking &&
            propertyDocument.overLooking.find((e) => e === "Road")
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
        HillViewlClick:
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
      })
    }
  }, [propertyDocument])

  function handleBackSubmit() {
    props.setStateFlag('stage2');
  }

  const handleNextSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    const property = {
      mainDoorFacing: propertyDetails.MainDoorFacing,
      overLooking: propertyDetails.OverLooking ? propertyDetails.OverLooking : [],
      balconyFacing: propertyDetails.BalconyFacing,
      visitingHrsFrom: propertyDetails.VisitingHrsFrom,
      visitingHrsTo: propertyDetails.VisitingHrsTo,
      visitingDays: propertyDetails.VisitingDays ? propertyDetails.VisitingDays : [],
      bachlorsBoysAllowed: propertyDetails.BachlorsBoysAllowed,
      bachlorsGirlsAllowed: propertyDetails.BachlorsGirlsAllowed,
      petsAllowed: propertyDetails.PetsAllowed,
      vegNonVeg: propertyDetails.VegNonVeg,
      propertyDescription: propertyDetails.PropertyDescription,
      ownerInstructions: propertyDetails.OwnerInstructions,
    };

    // console.log('property:', property)

    if (propertyid !== "new") {
      const updatedProperty = {
        ...property,
        updatedAt: timestamp.fromDate(new Date()),
        updatedBy: user.uid,
      };
      console.log('updatedProperty:', updatedProperty)
      // console.log('propertyid:', propertyid)
      await updateDocument(propertyid, updatedProperty);

      if (updateDocumentResponse.error) {
        navigate("/");
      } else {
        props.setStateFlag("stage4");
        navigate("/propertydetails/" + propertyid)
      }
    }
  }

  const [value, setValue] = useState('');

  return (
    <>
      {/* <Popup
        showPopupFlag={showPopupFlag}
        setShowPopupFlag={setShowPopupFlag}
        setPopupReturn={setPopupReturn}
        msg={"Are you sure you want to delete?"}
      /> */}
      <form>
        <div className='add_property_fields'>



          <div className="stage4form">
            <br /><br /><br />
            <div className="row row_gap">
              {/* Maindoor Facing */}
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Maindoor Facing</label>
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === 'East'
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
                              MainDoorFacing: 'East'
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
                          <h6>East

                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === 'West'
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
                              MainDoorFacing: 'West'
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
                          <h6>West

                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === 'North'
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
                              MainDoorFacing: 'North'
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
                          <h6>North

                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === 'South'
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
                              MainDoorFacing: 'South'
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
                          <h6>South

                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === 'North East'
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
                              MainDoorFacing: 'North East'
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
                          <h6>North East

                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === 'North West'
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
                              MainDoorFacing: 'North West'
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
                          <h6>North West

                          </h6>
                        </label>
                      </div>
                    </div><div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === 'South East'
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
                              MainDoorFacing: 'South East'
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
                          <h6>South East

                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.MainDoorFacing === 'South West'
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
                              MainDoorFacing: 'South West'
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
                          <h6>South West

                          </h6>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Balcony Facing */}
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Balcony Facing</label>
                  <div className="radio_group">
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.BalconyFacing === 'East'
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="east_balconyfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              BalconyFacing: 'East'
                            });
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
                          <h6>East

                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.BalconyFacing === 'West'
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="west_balconyfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              BalconyFacing: 'West'
                            });
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
                          <h6>West

                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.BalconyFacing === 'North'
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="north_balconyfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              BalconyFacing: 'North'
                            });
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
                          <h6>North

                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.BalconyFacing === 'South'
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="south_balconyfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              BalconyFacing: 'South'
                            });
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
                          <h6>South

                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.BalconyFacing === 'North East'
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="northeast_balconyfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              BalconyFacing: 'North East'
                            });
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
                          <h6>North East

                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.BalconyFacing === 'North West'
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="northwest_balconyfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              BalconyFacing: 'North West'
                            });
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
                          <h6>North West

                          </h6>
                        </label>
                      </div>
                    </div><div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.BalconyFacing === 'South East'
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="southeast_balconyfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              BalconyFacing: 'South East'
                            });
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
                          <h6>South East

                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.BalconyFacing === 'South West'
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="southwest_balconyfacing"
                          onClick={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              BalconyFacing: 'South West'
                            });
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
                          <h6>South West

                          </h6>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                          <h6>Club
                          </h6>
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
                                GardenParkClick: !propertyDetails.GardenParkClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Garden/Park",
                                ],
                                GardenParkClick: !propertyDetails.GardenParkClick,
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
                          <h6>Garden/Park
                          </h6>
                        </label>
                      </div>
                    </div>
                    <div className="radio_group_single">
                      <div
                        className={
                          propertyDetails.RoadClick
                            ? "custom_radio_button radiochecked"
                            : "custom_radio_button"
                        }
                      >
                        <input
                          type="checkbox"
                          id="road_overlooking"
                          onClick={(e) => {
                            if (propertyDetails.RoadClick) {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking:
                                  propertyDetails.OverLooking &&
                                  propertyDetails.OverLooking.filter(
                                    (elem) => elem !== "Road"
                                  ),
                                RoadClick: !propertyDetails.RoadClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Road",
                                ],
                                RoadClick: !propertyDetails.RoadClick,
                              });
                            }
                          }}
                        />
                        <label htmlFor="road_overlooking">
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>Road
                          </h6>
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
                                SwimmingPoolClick: !propertyDetails.SwimmingPoolClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Swimming Pool",
                                ],
                                SwimmingPoolClick: !propertyDetails.SwimmingPoolClick,
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
                          <h6>Swimming Pool
                          </h6>
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
                                CentralParkClick: !propertyDetails.CentralParkClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Central Park",
                                ],
                                CentralParkClick: !propertyDetails.CentralParkClick,
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
                          <h6>Central Park
                          </h6>
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
                          <h6>Golf
                          </h6>
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
                          <h6>Hill View
                          </h6>
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
                          <h6>Beach

                          </h6>
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
                          <h6>Lake

                          </h6>
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
                                    (elem) => elem !== "Lake"
                                  ),
                                RiverClick: !propertyDetails.RiverClick,
                              });
                            } else {
                              setPropertyDetails({
                                ...propertyDetails,
                                OverLooking: [
                                  ...propertyDetails.OverLooking,
                                  "Lake",
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
                          <h6>River

                          </h6>
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
                          <h6>Forest
                          </h6>
                        </label>
                      </div>
                    </div>



                  </div>
                </div>
              </div>

              <hr></hr>
              {/* Visiting Hours From */}
              <div className="col-md-6">
                <div className="form_field label_top">
                  <label htmlFor="">Visiting Hours From</label>
                  <div className="form_field_inner">
                    <input
                      type="datetime-local"
                      placeholder="dd/mm/yyyy"
                      value={propertyDetails.VisitingHrsFrom}
                      onChange={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          VisitingHrsFrom: e.target.value
                        })
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
                      type="datetime-local"
                      placeholder="dd/mm/yyyy"
                      value={propertyDetails.VisitingHrsTo}
                      onChange={(e) => {
                        setPropertyDetails({
                          ...propertyDetails,
                          VisitingHrsTo: e.target.value
                        })
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
                          <h6>Monday


                          </h6>
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
                          <h6>Tuesday


                          </h6>
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
                          <h6>Wednesday


                          </h6>
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
                          <h6>Thursday


                          </h6>
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
                          <h6>Friday


                          </h6>
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
                          <h6>Saturday


                          </h6>
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
                          <h6>Sunday
                          </h6>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr></hr>
              {/* Bachelor Boys Allowed */}
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">
                    Bachelor Boys Allowed</label>
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

              </div>
              {/* Bachelor Girls Allowed */}
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">
                    Bachelor Girls Allowed</label>
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

              </div>
              {/* Pets Allowed */}
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">
                    Pets Allowed</label>
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

              </div>
              {/* Vegetarian / Non-Vegetarian */}
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">
                    Food Habit</label>
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
                              <h6>Veg</h6>
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
                              <h6>Non-Veg</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <hr></hr>
              {/* Property Description */}
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">
                    Property Description</label>
                  <div className="form_field_inner">
                    <div className="form_field_container">
                      <ReactQuill
                        theme="snow" // Specify the theme ('snow' for a clean, modern look)
                        placeholder="Type here..." // Add placeholder prop here
                        value={propertyDetails.PropertyDescription}
                        // onChange={setValue} // Set the value state when the editor content changes
                        onChange={(e) => {
                          setPropertyDetails({
                            ...propertyDetails,
                            PropertyDescription: e.target.value,
                          });
                        }}
                        modules={{
                          toolbar: [
                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                            [{ size: [] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' },
                            { 'indent': '-1' }, { 'indent': '+1' }],
                            ['link', 'image', 'video'],
                            ['clean']
                          ],
                        }}
                        formats={[
                          'header', 'font', 'size',
                          'bold', 'italic', 'underline', 'strike', 'blockquote',
                          'list', 'bullet', 'indent',
                          'link', 'image', 'video'
                        ]}
                      />
                    </div>
                  </div>
                </div>

              </div>
              {/* Owner Instructions */}
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">
                    Owner Instruction</label>
                  <div className="form_field_inner">
                    <div className="form_field_container">
                      <ReactQuill
                        theme="snow" // Specify the theme ('snow' for a clean, modern look)
                        value={value}
                        onChange={setValue} // Set the value state when the editor content changes
                        placeholder="Type here..." // Add placeholder prop here
                        modules={{
                          toolbar: [
                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                            [{ size: [] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' },
                            { 'indent': '-1' }, { 'indent': '+1' }],
                            ['link', 'image', 'video'],
                            ['clean']
                          ],
                        }}
                        formats={[
                          'header', 'font', 'size',
                          'bold', 'italic', 'underline', 'strike', 'blockquote',
                          'list', 'bullet', 'indent',
                          'link', 'image', 'video'
                        ]}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="verticall_gap"></div>
        <div style={{ display: "flex", alignItems: "center" }} className='next_btn_back bottom_fixed_button'>
          <div className="" style={{ width: "100%", padding: '0 20px 0 0' }}>
            {formError && <p className="error">{formError}</p>}
            <button className="theme_btn btn_fill" onClick={handleBackSubmit} style={{
              width: "100%"
            }}>
              {"<< Back"}
            </button>
          </div>

          <div className="" style={{ width: "100%", padding: '0 0 0 20px' }}>
            <button className="theme_btn btn_fill" onClick={handleNextSubmit} style={{
              width: "100%"
            }}>
              {"Submit"}
            </button>
          </div>

        </div>
      </form >

    </>
  )
}
