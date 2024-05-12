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

export default function Stage4(props) {
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
  const [popupReturn, setPopupReturn] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

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
    _imgURL: [],
  })



  useEffect(() => {
    if (propertyDocument) {
      // console.log('propertyDocument:', propertyDocument)
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
        // _imgURL: propertyDocument.imgURL ? propertyDocument.imgURL : [],
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
      const updatedBy = {
        id: user.uid,
      };

      const updatedProperty = {
        ...property,
        updatedAt: timestamp.fromDate(new Date()),
        updatedBy,
      };
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


  const handleFileChange = async (e) => {
    //   // setThumbnail(null)
    //   let file = e.target.files[0];
    //   // console.log('file original selected:', file)
    //   // console.log('file size original selected:', file.size)

    //   const compressedImage = await imgUpload(file, 300, 300);

    //   if (!compressedImage) {
    //     setThumbnailError("Please select a file");
    //     return;
    //   }
    //   if (!compressedImage.type.includes("image")) {
    //     setThumbnailError("Selected file must be an image");
    //     return;
    //   }

    //   // setThumbnailError(null)

    //   let imgUrl = "";

    //   const thumbnailName = timestamp.fromDate(new Date()) + ".png";
    //   console.log('thumbnailName:', thumbnailName)
    //   const propertyimagesfolder = "Images";
    //   if (compressedImage) {
    //     const uploadPath = `properties/${propertyid}/${propertyimagesfolder}/${thumbnailName}`;
    //     const img = await projectStorage.ref(uploadPath).put(compressedImage);
    //     imgUrl = await img.ref.getDownloadURL();
    //     // console.log('imgUrl:', imgUrl)

    //     var propertyImages = propertyDetails._imgURL
    //     propertyImages.push(imgUrl)

    //     await updateDocument(propertyid, {
    //       imgURL: propertyImages,
    //     });

    //   }
    //   // console.log('thumbnail updated')
  };

  //Popup Flags
  //Popup Flags
  // useEffect(() => {
  //   (async () => {
  //     if (popupReturn) {
  //       //Delete that item from collection & storage
  //       console.log('selected image url:', currentImageUrl)
  //       //Delete value from an images arrage
  //       // Update the array field using arrayRemove
  //       var propertyImages = propertyDetails._imgURL
  //       console.log('Original Array:', propertyImages)
  //       const revisedPropertyImagesArray = propertyImages.filter((img) => img !== currentImageUrl);
  //       console.log('revisedPropertyImagesArray:', revisedPropertyImagesArray)
  //       await updateDocument(propertyid, {
  //         imgURL: revisedPropertyImagesArray,
  //       });

  //       //Delete from storage        
  //       const imageRef = projectStorage.refFromURL(currentImageUrl);
  //       // Delete the image
  //       await imageRef.delete();
  //     }
  //   })()

  // }, [popupReturn]);

  const showPopup = async (e) => {
    e.preventDefault();
    setShowPopupFlag(true);
    setPopupReturn(false);
  };

  const handleSlide = (currentIndex) => {
    const currentImage = propertyDocument.imgURL[currentIndex];
    setCurrentImageUrl(currentImage);
  };

  const [value, setValue] = useState('');
  return (
    <>
      <Popup
        showPopupFlag={showPopupFlag}
        setShowPopupFlag={setShowPopupFlag}
        setPopupReturn={setPopupReturn}
        msg={"Are you sure you want to delete?"}
      />
      <form>
        <div className='add_property_fields'>

          <div className="more_info_detail">
            <div className="row">
              <div className="col-4">
                <div className="layout_img">
                  <img src="/assets/img/layout.png" alt="" />
                </div>
              </div>
              <div className="col-8">
                <div className="my_accordion">
                  <Accordion>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Bedroom - (4)</Accordion.Header>
                      <Accordion.Body>
                        <div className="total_group">
                          <div className="row row_gap">
                            <div className="col-12">
                              <h5 className="m20 light_black text-center">
                                Bedroom 1
                              </h5>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Total Area</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value="1200 sqft 100 inch"
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Length</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Width</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field st-2 label_top">
                                <label htmlFor="">Is Bathroom attached ?</label>
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
                                            <h6>Yes</h6>
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
                                            <h6>No</h6>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                            <div className="col-md-4">
                              <div className="form_field st-2 label_top">
                                <label htmlFor="">Is Balcony attached ?</label>
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
                                            <h6>Yes</h6>
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
                                            <h6>No</h6>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label>Flooring Type</label>
                                <div className="form_field_inner">
                                  <select>
                                    <option value="" selected>Select</option>
                                    <option value="">Marble</option>
                                    <option value="">Vetrified Tile</option>
                                    <option value="">Vinyl</option>
                                    <option value="">Hardwood</option>
                                    <option value="">Granite</option>
                                    <option value="">Bamboo</option>
                                    <option value="">Concrete</option>
                                    <option value="">Laminate</option>
                                    <option value="">Linoleum</option>
                                    <option value="">Terrazzo (Mosaic)</option>
                                    <option value="">Brick</option>
                                    <option value="">Red Oxide</option>

                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form_field st-2 label_top">
                                <label htmlFor=""> Fitting & Fixtures</label>
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
                                        <h6> Fan</h6>
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
                                        <h6> Tube Light</h6>
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
                                        <h6> Almirah</h6>
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
                                        <h6>   Window</h6>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row row_gap">
                            <div className="col-12">
                              <h5 className="m20 light_black text-center">
                                Bedroom 2
                              </h5>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Total Area</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value="1200 sqft 100 inch"
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Length</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Width</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field st-2 label_top">
                                <label htmlFor="">Is Bathroom attached ?</label>
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
                                            <h6>Yes</h6>
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
                                            <h6>No</h6>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                            <div className="col-md-4">
                              <div className="form_field st-2 label_top">
                                <label htmlFor="">Is Balcony attached ?</label>
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
                                            <h6>Yes</h6>
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
                                            <h6>No</h6>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label>Flooring Type</label>
                                <div className="form_field_inner">
                                  <select>
                                    <option value="" selected>Select</option>
                                    <option value="">Marble</option>
                                    <option value="">Vetrified Tile</option>
                                    <option value="">Vinyl</option>
                                    <option value="">Hardwood</option>
                                    <option value="">Granite</option>
                                    <option value="">Bamboo</option>
                                    <option value="">Concrete</option>
                                    <option value="">Laminate</option>
                                    <option value="">Linoleum</option>
                                    <option value="">Terrazzo (Mosaic)</option>
                                    <option value="">Brick</option>
                                    <option value="">Red Oxide</option>

                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form_field st-2 label_top">
                                <label htmlFor=""> Fitting & Fixtures</label>
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
                                        <h6> Fan</h6>
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
                                        <h6> Tube Light</h6>
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
                                        <h6> Almirah</h6>
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
                                        <h6>   Window</h6>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row row_gap">
                            <div className="col-12">
                              <h5 className="m20 light_black text-center">
                                Bedroom 3
                              </h5>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Total Area</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value="1200 sqft 100 inch"
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Length</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Width</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field st-2 label_top">
                                <label htmlFor="">Is Bathroom attached ?</label>
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
                                            <h6>Yes</h6>
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
                                            <h6>No</h6>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                            <div className="col-md-4">
                              <div className="form_field st-2 label_top">
                                <label htmlFor="">Is Balcony attached ?</label>
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
                                            <h6>Yes</h6>
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
                                            <h6>No</h6>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label>Flooring Type</label>
                                <div className="form_field_inner">
                                  <select>
                                    <option value="" selected>Select</option>
                                    <option value="">Marble</option>
                                    <option value="">Vetrified Tile</option>
                                    <option value="">Vinyl</option>
                                    <option value="">Hardwood</option>
                                    <option value="">Granite</option>
                                    <option value="">Bamboo</option>
                                    <option value="">Concrete</option>
                                    <option value="">Laminate</option>
                                    <option value="">Linoleum</option>
                                    <option value="">Terrazzo (Mosaic)</option>
                                    <option value="">Brick</option>
                                    <option value="">Red Oxide</option>

                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form_field st-2 label_top">
                                <label htmlFor=""> Fitting & Fixtures</label>
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
                                        <h6> Fan</h6>
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
                                        <h6> Tube Light</h6>
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
                                        <h6> Almirah</h6>
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
                                        <h6>   Window</h6>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>Bathroom - (2)</Accordion.Header>
                      <Accordion.Body>
                        <div className="total_group">
                          <div className="row row_gap">
                            <div className="col-12">
                              <h5 className="m20 light_black text-center">
                                Bathroom 1
                              </h5>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Total Area</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value="1200 sqft 100 inch"
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Length</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Width</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form_field st-2 label_top">
                                <label htmlFor="">Is attached to Bedroom ?</label>
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
                                            <h6>Yes</h6>
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
                                            <h6>No</h6>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                            <div className="col-md-6">
                              <div className="form_field label_top">
                                <label>Flooring Type</label>
                                <div className="form_field_inner">
                                  <select>
                                    <option value="" selected>Select</option>
                                    <option value="">Marble</option>
                                    <option value="">Vetrified Tile</option>
                                    <option value="">Vinyl</option>
                                    <option value="">Hardwood</option>
                                    <option value="">Granite</option>
                                    <option value="">Bamboo</option>
                                    <option value="">Concrete</option>
                                    <option value="">Laminate</option>
                                    <option value="">Linoleum</option>
                                    <option value="">Terrazzo (Mosaic)</option>
                                    <option value="">Brick</option>
                                    <option value="">Red Oxide</option>

                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form_field st-2 label_top">
                                <label htmlFor=""> Fitting & Fixtures</label>
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
                                        <h6> Fan</h6>
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
                                        <h6> Tube Light</h6>
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
                                        <h6> Almirah</h6>
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
                                        <h6>   Window</h6>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>All Balcony - ( 1 )
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="total_group">
                          <div className="row row_gap">
                            <div className="col-12">
                              <h5 className="m20 light_black text-center">
                                Balcony 1
                              </h5>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Total Area</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value="1200 sqft 100 inch"
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Length</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Width</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                      <Accordion.Header>All Kitchen - ( 1 )

                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="total_group">
                          <div className="row row_gap">
                            <div className="col-12">
                              <h5 className="m20 light_black text-center">
                                Kitchen 1
                              </h5>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Total Area</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value="1200 sqft 100 inch"
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Length</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Width</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="4">
                      <Accordion.Header>Living - ( 1 )


                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="total_group">
                          <div className="row row_gap">
                            <div className="col-12">
                              <h5 className="m20 light_black text-center">
                                Kitchen 1
                              </h5>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Total Area</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value="1200 sqft 100 inch"
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Length</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Width</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="5">
                      <Accordion.Header>Living & Dining - ( 1 )



                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="total_group">
                          <div className="row row_gap">
                            <div className="col-12">
                              <h5 className="m20 light_black text-center">
                                Kitchen 1
                              </h5>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Total Area</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value="1200 sqft 100 inch"
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Length</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Width</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="6">
                      <Accordion.Header>Gallery & Passages - ( 1 )




                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="total_group">
                          <div className="row row_gap">
                            <div className="col-12">
                              <h5 className="m20 light_black text-center">
                                Kitchen 1
                              </h5>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Total Area</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value="1200 sqft 100 inch"
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Length</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Width</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="7">
                      <Accordion.Header>Bassment - ( 1 )





                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="total_group">
                          <div className="row row_gap">
                            <div className="col-12">
                              <h5 className="m20 light_black text-center">
                                Kitchen 1
                              </h5>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Total Area</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value="1200 sqft 100 inch"
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Length</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Width</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="8">
                      <Accordion.Header>Additional Rooms - ( 1 )
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="total_group">
                          <div className="row row_gap">
                            <div className="col-12">
                              <h5 className="m20 light_black text-center">
                                Kitchen 1
                              </h5>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Total Area</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value="1200 sqft 100 inch"
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Length</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_field label_top">
                                <label htmlFor="">Width</label>
                                <div className="form_field_inner">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    onChange={(e) =>
                                      setPropertyDetails({
                                        ...propertyDetails,
                                        UnitNumber: e.target.value.trim(),
                                      })
                                    }
                                    value={""}
                                  />
                                  <div className="field_icon"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>

          <div className="stage4form">
            <br /><br /><br />
            <div className="row row_gap">
              <div className="col-md-6">
                <div className="form_field label_top">
                  <label>Main Door Facing</label>
                  <div className="form_field_inner">
                    <select>
                      <option >Select</option>
                      <option >East</option>
                      <option>West</option>
                      <option>North</option>
                      <option>South</option>
                      <option>North East</option>
                      <option>North West</option>
                      <option>South West</option>
                      <option>South East</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* Overlooking */}
              <div className="col-6"></div>
              <div className="col-md-6">
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
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Balcony/Window Facing</label>
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
                          <h6>East

                          </h6>
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
                          <h6>West

                          </h6>
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
                          <h6> North

                          </h6>
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
                          <h6>South

                          </h6>
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
                          <h6>North East

                          </h6>
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
                          <h6> North West

                          </h6>
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
                          <h6>South West

                          </h6>
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
                          <h6>South East

                          </h6>
                        </label>
                      </div>
                    </div>



                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form_field label_top">
                  <label htmlFor="">Visiting Hours From</label>
                  <div className="form_field_inner">
                    <input
                      type="date"
                      placeholder="dd/mm/yyyy"

                    />

                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form_field label_top">
                  <label htmlFor="">Visiting Hours To</label>
                  <div className="form_field_inner">
                    <input
                      type="date"
                      placeholder="dd/mm/yyyy"

                    />

                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Visiting Days</label>
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
                          <h6>Monday


                          </h6>
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
                          <h6>Tuesday


                          </h6>
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
                          <h6>Wednesday


                          </h6>
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
                          <h6>Thursday


                          </h6>
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
                          <h6>Friday


                          </h6>
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
                          <h6> Saturday


                          </h6>
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
                          <h6>Sunday
                          </h6>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">
                    Bachelor Boys Allowed</label>
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
                              id="property_active"
                            />
                            <label
                              htmlFor="property_active"
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
                              propertyDetails.Purpose === "Sale"
                                ? "custom_radio_button radiochecked"
                                : "custom_radio_button"
                            }
                          >
                            <input
                              type="checkbox"
                              id="property_inactive"

                            />
                            <label
                              htmlFor="property_inactive"
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
              <div className="col-md-4">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">
                    Bachelor Girls Allowed</label>
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
                              id="property_active"
                            />
                            <label
                              htmlFor="property_active"
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
                              propertyDetails.Purpose === "Sale"
                                ? "custom_radio_button radiochecked"
                                : "custom_radio_button"
                            }
                          >
                            <input
                              type="checkbox"
                              id="property_inactive"

                            />
                            <label
                              htmlFor="property_inactive"
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
              <div className="col-md-4">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">
                    Pets Allowed</label>
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
                              id="property_active"
                            />
                            <label
                              htmlFor="property_active"
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
                              propertyDetails.Purpose === "Sale"
                                ? "custom_radio_button radiochecked"
                                : "custom_radio_button"
                            }
                          >
                            <input
                              type="checkbox"
                              id="property_inactive"

                            />
                            <label
                              htmlFor="property_inactive"
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
              <div className="col-md-4">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">
                    Pets Allowed</label>
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
                              id="property_active"
                            />
                            <label
                              htmlFor="property_active"
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
                              <h6>No Choice</h6>
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
                              id="property_inactive"

                            />
                            <label
                              htmlFor="property_inactive"
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
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="col-8"></div>
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">
                    Property Description</label>
                  <div className="form_field_inner">
                    <div className="form_field_container">
                      <ReactQuill
                        theme="snow" // Specify the theme ('snow' for a clean, modern look)
                        placeholder="Type here..." // Add placeholder prop here
                        value={value}
                        onChange={setValue} // Set the value state when the editor content changes
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
              <div className="pcs_image_area">
                <div className="bigimage_container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  {/* {propertyDetails._imgURL.length > 0 ? (
                    <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                      {propertyDetails._imgURL.length > 1 && <div className='img-delete-icon' onClick={showPopup}>
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </div>}
                      <Gallery onSlide={handleSlide} style={{ background: 'red' }}
                        items={propertyDocument && propertyDocument.imgURL

                          .map((url) => ({
                            original: url,
                            thumbnail: url,
                          }))}
                        slideDuration={1000}
                      />
                    </div>) : <div style={{ position: 'relative', textAlign: 'center', width: '100%', maxWidth: '600px' }}> <img width='100%' src='/assets/img/default_property_image.jpg' alt='default property pic'></img></div>} */}

                  {/* {propertyDetails._imgURL.length < 20 && ( */}
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ margin: "15px 0px" }}
                  >
                    <input
                      id="profile-upload-input"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="profile-upload-input"
                      className="mybutton button_transparent pointer"
                    >
                      <span>
                        Add More Images
                      </span>
                    </label>
                  </div>
                  )
                  {/* } */}
                </div>
                {/* {
                  propertyDetails._imgURL.length > 0 &&  */}
                {/* <div>
                  <div style={{ textAlign: 'center', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    Image count : {propertyDetails._imgURL.length} out of 20
                  </div>
                </div> */}
                {/* } */}
                <div className="verticall_gap"></div>
                <div className="verticall_gap"></div>
                <div style={{ textAlign: 'center', fontSize: '0.8rem', fontStyle: 'italic' }}>
                  <strong>Note: </strong>
                  A maximum of 20 images can be added for the property.
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
