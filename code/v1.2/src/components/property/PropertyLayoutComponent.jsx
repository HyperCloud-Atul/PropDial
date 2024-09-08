import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";

export default function PropertyLayoutComponent(props) {
  const navigate = useNavigate();

  // console.log('Property layouts: ', props.propertylayouts)
  // console.log('Property ID: ', props.propertyid)
  // console.log('Layout ID: ', props.layoutid)

  const layoutid = props.layoutid == null ? "1234" : props.layoutid;

  const { document: propertyLayoutDoc, error: propertyLayoutDocError } =
    useDocument("propertylayouts", layoutid);

  // console.log('propertyLayoutDoc: ', propertyLayoutDoc)

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
  const [attachments, setAttachments] = useState([]); //initialize array

  useEffect(() => {
    // console.log("propertyLayoutDoc: ", propertyLayoutDoc)
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

      // console.log('propertyLayoutDoc:', propertyLayoutDoc)
    }

    // console.log('layout id: ', layoutid)

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
    // console.log('isChecked:', isChecked)
    // console.log('index:', index)
    // console.log('value:', value)
    isChecked === true ? addAttachment(name) : removeAttachment(name);
  };

  const handlePropertyLayout = async (e) => {
    // e.preventDefault(); // Prevent the default form submission behavior
    // console.log("attachments:", attachments)
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

  return (
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
              <div className="form_field">
                <div className="field_box theme_radio_new">
                  <div className="theme_radio_container">
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="aai_type"
                        id="bedroom"
                        value={propertyLayout.RoomType}
                        onClick={(e) => {
                          setPropertyLayout({
                            ...propertyLayout,
                            RoomType: "Bedroom",
                          });
                        }}
                        checked={propertyLayout.RoomType === "Bedroom"}
                      />
                      <label htmlFor="bedroom">Bedroom</label>
                    </div>
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="aai_type"
                        id="bathroom"
                        value={propertyLayout.RoomType}
                        onClick={(e) => {
                          setPropertyLayout({
                            ...propertyLayout,
                            RoomType: "Bathroom",
                          });
                        }}
                        checked={propertyLayout.RoomType === "Bathroom"}
                      />
                      <label htmlFor="bathroom">Bathroom</label>
                    </div>
                    <div
                      className="radio_single"
                      // className={
                      //     propertyLayout.RoomType === "Kitchen"
                      //         ? "radio_single radiochecked"
                      //         : "radio_single"
                      // }
                    >
                      <input
                        type="radio"
                        name="aai_type"
                        id="kitchen"
                        onClick={(e) => {
                          setPropertyLayout({
                            ...propertyLayout,
                            RoomType: "Kitchen",
                          });
                        }}
                        checked={propertyLayout.RoomType === "Kitchen"}
                      />
                      <label htmlFor="kitchen">Kitchen</label>
                    </div>
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="aai_type"
                        id="living"
                        onClick={(e) => {
                          setPropertyLayout({
                            ...propertyLayout,
                            RoomType: "Living Room",
                          });
                        }}
                        checked={propertyLayout.RoomType === "Living Room"}
                      />
                      <label htmlFor="living">Living Room</label>
                    </div>
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="aai_type"
                        id="dining"
                        onClick={(e) => {
                          setPropertyLayout({
                            ...propertyLayout,
                            RoomType: "Dining Room",
                          });
                        }}
                        checked={propertyLayout.RoomType === "Dining Room"}
                      />
                      <label htmlFor="dining">Dining Room</label>
                    </div>
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="aai_type"
                        id="balcony"
                        onClick={(e) => {
                          setPropertyLayout({
                            ...propertyLayout,
                            RoomType: "Balcony",
                          });
                        }}
                        checked={propertyLayout.RoomType === "Balcony"}
                      />
                      <label htmlFor="balcony">Balcony</label>
                    </div>
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="aai_type"
                        id="basement"
                        onClick={(e) => {
                          setPropertyLayout({
                            ...propertyLayout,
                            RoomType: "Basement",
                          });
                        }}
                        checked={propertyLayout.RoomType === "Basement"}
                      />
                      <label htmlFor="basement">Basement</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-md-1">
                            <div className="form_field_upload">
                              <label htmlFor="upload">
                                <div className="text-center">
                                  <span class="material-symbols-outlined">
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
                <div className="form_field">
                  <input
                    type="text"
                    placeholder="Room Name"
                    onChange={(e) =>
                      setPropertyLayout({
                        ...propertyLayout,
                        RoomName: e.target.value,
                      })
                    }
                    value={propertyLayout && propertyLayout.RoomName}
                  />
                </div>
                <div className="form_field">
                  <input
                    type="text"
                    placeholder="Length in feet"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const regex = /^\d*\.?\d{0,2}$/; // Regular expression to match numbers with up to 2 decimal places

                      if (regex.test(newValue)) {
                        setPropertyLayout({
                          ...propertyLayout,
                          RoomLength: newValue,
                        });
                      }
                    }}
                    value={propertyLayout.RoomLength}
                  />
                </div>
                <div className="form_field">
                  <input
                    type="text"
                    placeholder="Width in feet"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const regex = /^\d*\.?\d{0,2}$/; // Regular expression to match numbers with up to 2 decimal places

                      if (regex.test(newValue)) {
                        setPropertyLayout({
                          ...propertyLayout,
                          RoomWidth: newValue,
                        });
                      }
                    }}
                    value={propertyLayout.RoomWidth}
                  />
                </div>
                {/* <div className="form_field">
                                    <input type="text"
                                        placeholder="Length in feet"
                                        
                                        onChange={(e) =>
                                            setPropertyLayout({
                                                ...propertyLayout,
                                                RoomLength: e.target.value,
                                            })
                                        }
                                        value={propertyLayout && propertyLayout.RoomLength}
                                        
                                    />
                                </div> */}
                {/* <div className="form_field">
                                    <input type="text"
                                        placeholder="Width in feet"
                                 
                                        onChange={(e) =>
                                            setPropertyLayout({
                                                ...propertyLayout,
                                                RoomWidth: e.target.value,
                                            })
                                        }
                                        value={propertyLayout && propertyLayout.RoomWidth}
                                    />
                                </div> */}
                {/* <div className="form_field">
                                    <input type="text" placeholder="Total area"
                                      value={propertyLayout.RoomLength * propertyLayout.RoomWidth}
                                    />
                                  </div> */}

                {additionalInfos.map((info, index) => (
                  <div className="form_field">
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
                <h2 className="card_title">Attached with</h2>
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
              </div>
            )}
          </div>
        </div>
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
  );
}
