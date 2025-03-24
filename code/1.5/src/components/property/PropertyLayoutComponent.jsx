import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function PropertyLayoutComponent(props) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const layoutid = props.layoutid == null ? "1234" : props.layoutid;
  const { document: propertyLayoutDoc, error: propertyLayoutDocError } =
    useDocument("propertylayouts", layoutid);

  const {
    addDocument: addPropertyLayoutDocument,
    updateDocument: updatePropertyLayoutDocument,
    deleteDocument: deletePropertyLayoutDocument,
    error: propertyLayoutDocumentError,
  } = useFirestore("propertylayouts");

  //Property Layout
  const [propertyLayout, setPropertyLayout] = useState({
    RoomType: "",
    RoomName: "",
    RoomLength: "",
    RoomWidth: "",
    RoomTotalArea: "",
    // RoomFixtures: [],
    // RoomAttachments: [],
    RoomImgUrl: "",
  });

  // attachments in property layout
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  useEffect(() => { 
    if (propertyLayoutDoc) {
      setPropertyLayout({
        RoomType: propertyLayoutDoc.roomType,
        RoomName: propertyLayoutDoc.roomName,
        RoomLength: propertyLayoutDoc.roomLength,
        RoomWidth: propertyLayoutDoc.roomWidth,
        RoomTotalArea: propertyLayoutDoc.roomTotalArea,
        RoomFixtures: propertyLayoutDoc.roomFixtures,
        RoomAttachments: propertyLayoutDoc.roomAttachments,
        RoomImgUrl: propertyLayoutDoc.roomImgUrl,
      });
      setAttachments(propertyLayoutDoc.roomAttachments || []);

      setAdditionalInfos(propertyLayoutDoc.roomFixtures || []);
     
    }

  

    if (layoutid === "1234" || layoutid == null) {
      setPropertyLayout({
        RoomType: "",
        RoomName: "",
        RoomLength: "",
        RoomWidth: "",
        RoomTotalArea: "",
        RoomFixtures: [],
        RoomAttachments: [],
        RoomImgUrl: "",
      });

      // console.log("layout id is null")
    }
  }, [propertyLayoutDoc]);

  const hidePropertyLayoutComponent = () => {
    props.setShowPropertyLayoutComponent(false);
  };

  // add from field of additonal info code start
  const [additionalInfos, setAdditionalInfos] = useState([""]); // Initialize with one field

  const handleAddMore = () => {
    setAdditionalInfos([...additionalInfos, ""]);
  };

  const handleRemove = (index) => {
    if (additionalInfos.length > 1) {
      // Prevent removal if only one field remains
      const newInfos = additionalInfos.filter((_, i) => i !== index);
      setAdditionalInfos(newInfos);
    }
  };

  const handleInputChange = (index, value) => {
    const newInfos = [...additionalInfos];
    newInfos[index] = value;
    setAdditionalInfos(newInfos);
  };
  // add from field of additonal info code end

  // Function to add an item
  var addAttachment = (item) => {
    // console.log('item for addAttachment;', item)
    setAttachments([...attachments, item]);
    // setPropertyLayout([...propertyLayout.RoomAttachments, item]);
  };

  // Function to remove an item by value
  var removeAttachment = (item) => {
    // console.log('item for removeAttachment;', item)
    setAttachments(attachments.filter((i) => i !== item));
    // setPropertyLayout(propertyLayout.RoomAttachments && propertyLayout.RoomAttachments.filter(i => i !== item));
  };

  const handleAttachmentInputChange = (index, name, value, isChecked) => {    
    isChecked === true ? addAttachment(name) : removeAttachment(name);
  };

  const validateFields = () => {
    let validationErrors = {};
    if (!propertyLayout.RoomType) validationErrors.RoomType = "Room type is required.";
    if (!propertyLayout.RoomName) validationErrors.RoomName = "Room name is required.";
    if (!propertyLayout.RoomLength) validationErrors.RoomLength = "Room length is required.";
    if (!propertyLayout.RoomWidth) validationErrors.RoomWidth = "Room width is required.";
  
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length > 0) {
      setGlobalError("Please fill all mandatory fields.");
      return false;
    }
  
    setGlobalError("");
    return true;
  };
  
  // Function to clear the field error when it's updated
  const clearFieldError = (field) => {
    if (errors[field]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[field];
      setErrors(updatedErrors);
  
      // Check if all errors are cleared to remove the global error
      if (Object.keys(updatedErrors).length === 0) {
        setGlobalError("");
      }
    }
  };

  const handlePropertyLayout = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    const roomData = {
      propertyId: props.propertyid,
      roomType: propertyLayout.RoomType,
      roomName: propertyLayout.RoomName,
      roomLength: propertyLayout.RoomLength,
      roomWidth: propertyLayout.RoomWidth,
      // roomTotalArea: propertyLayout.RoomLength * propertyLayout.RoomWidth,
      roomTotalArea: (
        propertyLayout.RoomLength * propertyLayout.RoomWidth
      ).toFixed(2),
      roomFixtures: additionalInfos,
      roomAttachments: attachments,
      roomImgUrl: "",
    };
    // console.log('Room Data:', roomData)
    try {
      if (props.layoutid === null || props.layoutid === "1234") {
        // console.log('add layout')
        await addPropertyLayoutDocument(roomData);
        props.setShowPropertyLayoutComponent(false);
      } else {
        // console.log('update layout: ', props.layoutid)
        await updatePropertyLayoutDocument(props.layoutid, roomData);
        props.setShowPropertyLayoutComponent(false);
      }
    } catch (ex) {
      console.log("response error:", ex.message);
      navigate("/login");
    }

    if (propertyLayoutDocumentError) {
      console.log("response error:");
      navigate("/login");
    }
  };

  return (    <>
      <section className="property_card_single add_aditional_form mobile_full_card">
        <div className="more_detail_card_inner relative">
          <h2 className="card_title">Property Layout Component</h2>
          <div className="aai_form">
            <div
              className="row"
              style={{
                rowGap: "18px",
              }}
            >
              <div className="col-md-12">
                <div className="form_field"
                   style={{
                    padding: "10px",
                    border: "1px solid rgb(3 70 135 / 22%)",
                    borderRadius: "5px",
                  }}>
                    <h6
                            style={{
                              color: "var(--theme-blue)",
                              fontSize: "15px",
                              fontWeight: "500",
                              marginBottom: "8px",
                            }}
                          >
                            Select Room Type*
                          </h6>
                  <div className="field_box theme_radio_new">
                    <div className="theme_radio_container">                   
                       <div className="theme_radio_container">
                    {["Bedroom", "Bathroom", "Kitchen", "Living Room", "Dining Room", "Balcony", "Basement"].map((type) => (
                      <div key={type} className="radio_single">
                        <input
                          type="radio"
                          name="roomType"
                          id={type}
                          onClick={() => {
                            setPropertyLayout({ ...propertyLayout, RoomType: type });
                            clearFieldError("RoomType");
                          }}
                          checked={propertyLayout.RoomType === type}
                        />
                        <label htmlFor={type}>{type}</label>
                      </div>
                    ))}
                  </div>
                    </div>
                  </div>
                  {errors.RoomType && <div className="field_error">{errors.RoomType}</div>}
                </div>
              </div>
              {/* <div className="col-md-1">
                      <div className="form_field_upload">
                        <label htmlFor="upload">
                          <div className="text-center">
                            <span className="material-symbols-outlined">
                              upload
                            </span>
                            <p>Upload image</p>
                          </div>
                        </label>
                        <input type="file" id="upload" />
                      </div>
                    </div> */}
              <div className="col-md-12">
                <div className="add_info_text">
                  <div className="form_field" 
                   style={{
                    padding: "10px",
                    border: "1px solid rgb(3 70 135 / 22%)",
                    borderRadius: "5px",
                  }}>
                  <h6
                            style={{
                              color: "var(--theme-blue)",
                              fontSize: "15px",
                              fontWeight: "500",
                              marginBottom: "8px",
                            }}
                          >
                            Room Name*
                          </h6>
                    <input
                      type="text"
                      placeholder="Enter room name"
                      onChange={(e) => {
                        setPropertyLayout({ ...propertyLayout, RoomName: e.target.value });
                        clearFieldError("RoomName");
                      }}
                      value={propertyLayout && propertyLayout.RoomName}
                    />
                     {errors.RoomName && <div className="field_error">{errors.RoomName}</div>}
                  </div>
                  <div className="form_field"
                    style={{
                      padding: "10px",
                      border: "1px solid rgb(3 70 135 / 22%)",
                      borderRadius: "5px",
                    }}>
                    <h6
                              style={{
                                color: "var(--theme-blue)",
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                              }}
                            >
                              Room Length* <span style={{
                                fontSize: "12px",
                              }}>(In Feet)</span>
                            </h6>
                    <input
                      type="text"
                      placeholder="Enter length"
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const regex = /^\d*\.?\d{0,2}$/; // Regular expression to match numbers with up to 2 decimal places

                        if (regex.test(newValue)) {
                          setPropertyLayout({
                            ...propertyLayout,
                            RoomLength: newValue,
                          });
                        }
                        clearFieldError("RoomLength");
                      }}
                      value={propertyLayout.RoomLength}
                    />
                     {errors.RoomLength && <div className="field_error">{errors.RoomLength}</div>}
                  </div>
                  <div className="form_field"
                  style={{
                    padding: "10px",
                    border: "1px solid rgb(3 70 135 / 22%)",
                    borderRadius: "5px",
                  }}>
                  <h6
                            style={{
                              color: "var(--theme-blue)",
                              fontSize: "15px",
                              fontWeight: "500",
                              marginBottom: "8px",
                            }}
                          >
                            Room Width* <span style={{
                              fontSize: "12px",
                            }}>(In Feet)</span>
                          </h6>
                    <input
                      type="text"
                      placeholder="Enter width"
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const regex = /^\d*\.?\d{0,2}$/; // Regular expression to match numbers with up to 2 decimal places

                        if (regex.test(newValue)) {
                          setPropertyLayout({
                            ...propertyLayout,
                            RoomWidth: newValue,
                          });
                        }
                        clearFieldError("RoomWidth");
                      }}
                      value={propertyLayout.RoomWidth}
                    />
                     {errors.RoomWidth && <div className="field_error">{errors.RoomWidth}</div>}
                  </div>             

                  {additionalInfos.map((info, index) => (
                    <div className="form_field"
                    style={{
                      padding: "10px",
                      border: "1px solid rgb(3 70 135 / 22%)",
                      borderRadius: "5px",
                    }}>
                    <h6
                              style={{
                                color: "var(--theme-blue)",
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                              }}
                            >
                              Fixture
                            </h6>
                      <div className="relative" key={index}>
                        <input
                          type="text"
                          value={info}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                          placeholder="Fixtures etc. fan, light, furniture, etc."
                        />
                        {additionalInfos.length > 1 && (
                          <span
                            onClick={() => handleRemove(index)}
                            className="pointer close_field"
                          >
                            X
                          </span>
                        )}
                      </div>
                      
                    </div>
                  ))}
                  <div className="addmore" onClick={handleAddMore}>
                    add more
                  </div>
                </div>
              </div>
              {props.propertylayouts && props.propertylayouts.length !== 0 && (
                <div className="col-12">
                   <div className="form_field w-100"
                   style={{
                    padding: "10px",
                    border: "1px solid rgb(3 70 135 / 22%)",
                    borderRadius: "5px",
                  }}>
                    <h6
                            style={{
                              color: "var(--theme-blue)",
                              fontSize: "15px",
                              fontWeight: "500",
                              marginBottom: "8px",
                            }}
                          >
                            Attached With
                          </h6>
                  <div className="form_field theme_checkbox">
                    <div className="theme_checkbox_container">
                      {/* need to map all roomName of propertylayouts collection here */}
                      {props.propertylayouts.map((layout, index) => (
                        <div className="checkbox_single" key={layout.roomName}>
                          <input
                            type="checkbox"
                            id={layout.roomName}
                            name={layout.roomName}
                            onChange={(e) =>
                              handleAttachmentInputChange(
                                index,
                                layout.roomName,
                                e.target.value,
                                e.target.checked
                              )
                            }
                            checked={attachments.includes(layout.roomName)}
                          />
                          <label htmlFor={layout.roomName}>
                            {layout.roomName}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div></div>
              )}
            </div>
          </div>
          {globalError && <div className="field_error mt-2">{globalError}</div>}
          <div className="row mt-3">
            <div className="col-md-6">
              <div className="row">
                <div className="col-5">
                  <div
                    className="theme_btn btn_border text-center no_icon full_width"
                    onClick={hidePropertyLayoutComponent}
                  >
                    Cancel
                  </div>
                </div>
                <div className="col-7">
                  <div
                    className="theme_btn btn_fill text-center no_icon full_width"
                    onClick={handlePropertyLayout}
                  >
                    {props.layoutid === "1234" || props.layoutid === null
                      ? "Add"
                      : "Edit"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
