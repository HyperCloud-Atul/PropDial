import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  projectFirestore,
  projectStorage,
  timestamp,
} from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";

// import component
import PropertySummaryCard from "../property/PropertySummaryCard";
import InactiveUserCard from "../../components/InactiveUserCard";
import ScrollToTop from "../../components/ScrollToTop";

const AddInspection = () => {
  const { propertyid, inspectionId } = useParams();
  const [searchParams] = useSearchParams();
  const inspectionType = searchParams.get("type");
  const [rooms, setRooms] = useState([]);
  const [fixtureDoc, setFixtureDoc] = useState("");
  const [roomFixtures, setRoomFixtures] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties-propdial",
    propertyid
  );
  console.log("propertyFixtures", fixtureDoc && fixtureDoc.roomFixtures);

  const [inspections, setInspections] = useState([
    {
      roomName: "",
      fixturesstatus: [], // ✅ New field
      general: "",
      seepage: "",
      termites: "",
      others: "",
      images: [],
      imagePreviews: [],
      createdAt: timestamp.now(),
    },
  ]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const snapshot = await projectFirestore
          .collection("propertylayouts")
          .where("propertyId", "==", propertyid)
          .get();
        const roomsData = snapshot.docs.map((doc) => ({
          id: doc.id, // Document ID store kar rahe hain
          roomName: doc.data().roomName,
        }));
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, [propertyid]);

  useEffect(() => {
    if (inspectionId) {
      const fetchInspection = async () => {
        try {
          const doc = await projectFirestore
            .collection("inspections")
            .doc(inspectionId)
            .get();
          if (doc.exists) {
            const data = doc.data();
            setInspections([
              {
                ...data,
                images: [],
                imagePreviews: [],
                createdAt: data.createdAt,
              },
            ]);
            setExistingImageUrls(data.images || []);
          }
        } catch (error) {
          console.error("Error fetching inspection:", error);
        }
      };
      fetchInspection();
    }
  }, [inspectionId]);

  const handleRoomSelection = (index, room) => {
    handleInspectionChange(index, "roomName", room.roomName);
    console.log(`Selected Room Name: ${room.roomName}`);
    console.log(`Selected Room ID: ${room.id}`);

    // 🛠 Naya room select hone par sirf uske fixtures load honge
    fetchFixtures(room.id, room.roomName);

    // 🛠 Multiple rooms ka selected state manage karne ke liye
    setSelectedRoom((prev) => ({
      ...prev,
      [index]: room, // ✅ Har index ke liye alag room store hoga
    }));
  };

  const fetchFixtures = async (roomId, roomName, index) => {
    try {
      const recordRef = projectFirestore
        .collection("propertylayouts")
        .doc(roomId);
      recordRef.onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const roomFixturesData = snapshot.data().roomFixtures || [];
          setRoomFixtures((prevFixtures) => ({
            ...prevFixtures,
            [roomName]: roomFixturesData,
          }));

          // Ensure inspection[index] exists before setting fixturesstatus
          setInspections((prevInspections) => {
            return prevInspections.map((inspection, idx) => {
              if (idx === index) {
                return {
                  ...inspection,
                  fixturesstatus: roomFixturesData.map((fixture) => ({
                    fixture,
                    status: "", // Default value
                  })),
                };
              }
              return inspection;
            });
          });
        } else {
          console.log(`No fixture data found for room: ${roomName}`);
          handleInspectionChange(index, "fixturesstatus", []);
        }
      });
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    }
  };

  const handleInspectionChange = (index, field, value) => {
    setInspections((prevInspections) => {
      return prevInspections.map((inspection, idx) => {
        if (idx === index) {
          return {
            ...inspection,
            [field]: value ?? [], // fixturesstatus agar undefined ho to empty array de
          };
        }
        return inspection;
      });
    });
  };



  const handleFixtureStatusChange = (
    inspectionIndex,
    fixture,
    value,
    fieldType
  ) => {
    setInspections((prevInspections) => {
      return prevInspections.map((inspection, idx) => {
        if (idx === inspectionIndex) {
          const updatedFixtures = [...inspection.fixturesstatus];

          // Check if fixture already exists, update it; otherwise, add new
          const fixtureIndex = updatedFixtures.findIndex(
            (item) => item.fixture === fixture
          );
          if (fixtureIndex !== -1) {
            updatedFixtures[fixtureIndex] = {
              ...updatedFixtures[fixtureIndex],
              [fieldType]: value,
            };
          } else {
            updatedFixtures.push({ fixture, [fieldType]: value });
          }

          return { ...inspection, fixturesstatus: updatedFixtures };
        }
        return inspection;
      });
    });
  };

  

  const addMoreInspection = () => {
    const selectedRooms = inspections.map((insp) => insp.roomName);
    const availableRooms = rooms.filter(
      (room) => !selectedRooms.includes(room.roomName)
    ); // ✅ Ensure matching format

    if (availableRooms.length === 0) {
      alert("All rooms have been selected.");
      return;
    }

    setInspections([
      ...inspections,
      {
        roomName: "", 
        fixturesstatus: [],
        general: "",
        seepage: "",
        termites: "",
        others: "",
        images: [],
        imagePreviews: [],
        createdAt: timestamp.now(),
      },
    ]);
  };

  const removeInspection = (index) => {
    const updatedInspections = inspections.filter((_, i) => i !== index);
    setInspections(updatedInspections);
  };

  const handleImageUpload = (index, files) => {
    const newFiles = Array.from(files);
    const updatedInspections = [...inspections];
    const currentImages = updatedInspections[index].images;

    if (currentImages.length + newFiles.length > 3) {
      alert("You can upload a maximum of 3 images per inspection.");
      return;
    }

    updatedInspections[index].images = [...currentImages, ...newFiles];
    updatedInspections[index].imagePreviews = [
      ...updatedInspections[index].imagePreviews,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ];
    setInspections(updatedInspections);
  };

  const handleRemoveImage = (inspectionIndex, imageIndex) => {
    const updatedInspections = [...inspections];
    updatedInspections[inspectionIndex].images.splice(imageIndex, 1);
    updatedInspections[inspectionIndex].imagePreviews.splice(imageIndex, 1);
    setInspections(updatedInspections);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalInspections = await Promise.all(
        inspections.map(async (inspection) => {
          const imageUrls = await Promise.all(
            inspection.images.map(async (file) => {
              const storageRef = projectStorage.ref(
                `inspection/${propertyid}/${file.name}`
              );
              await storageRef.put(file);
              return await storageRef.getDownloadURL();
            })
          );

          return {
            ...inspection,
            images: [...imageUrls, ...existingImageUrls],
            fixturesstatus: inspection.fixturesstatus, // ✅ Include new field
          };
        })
      );

      if (inspectionId) {
        await projectFirestore
          .collection("inspections")
          .doc(inspectionId)
          .update({
            propertyId: propertyid,
            inspectionType,
            inspections: finalInspections,
            updatedAt: timestamp.now(),
          });
        alert("Inspection updated successfully!");
      } else {
        await projectFirestore.collection("inspections").add({
          propertyId: propertyid,
          inspectionType,
          inspections: finalInspections,
          createdAt: timestamp.now(),
        });
        alert("Inspection added successfully!");
      }

      navigate(`/inspection/${propertyid}`);
    } catch (error) {
      console.error("Error submitting inspections:", error);
      alert("Failed to save inspections.");
    }
  };

  return (
    <>
      <div className="pg_min_height">
        {user && user.status === "active" ? (
          <div className="top_header_pg pg_bg property_keys_pg property_inspection_pg">
            <ScrollToTop />
            <div className="page_spacing pg_min_height">
              <div className="row row_reverse_991">
                <div className="col-lg-6">
                  <div className="title_card mobile_full_575 mobile_gap h-100">
                    <h2 className="text-center mb-4">
                      {inspectionType} Inspection
                    </h2>
                    <div className="inspection_type_img text-center">
                      <img
                        src={
                          inspectionType === "Regular"
                            ? "/assets/img/inspection3.png"
                            : inspectionType === "Move-In"
                            ? "/assets/img/check-in.png"
                            : inspectionType === "Move-Out"
                            ? "/assets/img/check-out.png"
                            : "/assets/img/inspection1.png" // Default image
                        }
                        alt={`${inspectionType} Inspection`}
                      />
                    </div>
                  </div>
                </div>
                <PropertySummaryCard
                  propertydoc={propertydoc}
                  propertyId={propertyid}
                />
              </div>
              <div className="vg22"></div>
              <form className="add_inspection_form">
                {inspections.map((inspection, index) => (
                  <div
                    key={index}
                    className="my_big_card add_doc_form mobile_full_575 relative "
                  >
                    {/* <h3>Inspection {index + 1}</h3> */}
                    <div className="aai_form">
                      <div className="row row_gap_20">
                        <div className="col-md-12">
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                            }}
                          >
                            <h6
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                                color: "var(--theme-blue)",
                              }}
                            >
                              Select Room*
                            </h6>

                            <div className="field_box theme_radio_new">
                              <div className="theme_radio_container">
                                {rooms
                                  .filter(
                                    (room) =>
                                      inspections[index].roomName ===
                                        room.roomName ||
                                      !inspections.some(
                                        (insp, idx) =>
                                          idx !== index &&
                                          insp.roomName === room.roomName
                                      )
                                  )
                                  .map((room) => (
                                    <div className="radio_single" key={room.id}>
                                      <input
                                        type="radio"
                                        name={`roomName-${index}`}
                                        id={`room-${room.roomName}-${index}`}
                                        value={room.roomName}
                                        checked={
                                          inspection.roomName === room.roomName
                                        }
                                        onChange={() =>
                                          handleRoomSelection(index, room)
                                        }
                                      />
                                      <label
                                        htmlFor={`room-${room.roomName}-${index}`}
                                      >
                                        {room.roomName}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        {inspectionType === "Move-In" && (
                          <>
                            {roomFixtures[inspection.roomName]?.map(
                              (fixture, fixtureIndex) => (
                        <div className="col-md-4"  key={fixtureIndex}>
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                            }}
                          >
                            <h6
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                                color: "var(--theme-blue)",
                              }}
                            >
                              {fixture}
                            </h6>
    {/* Status Selection */}
    <select
                                    onChange={(e) =>
                                      handleFixtureStatusChange(
                                        index,
                                        fixture,
                                        e.target.value,
                                        "status"
                                      )
                                    }
                                    style={{
                                      paddingLeft: "10px",                                    
                                      outline: "none",
                                    }}
                                    onFocus={(e) => (e.target.style.border = "1px solid var(--theme-blue)")}
                                    
                                  >
                                    <option value="">Select Status</option>
                                    <option value="Average">Average</option>
                                    <option value="Broken">
                                      Broken
                                    </option>
                                    <option value="Bad">Bad</option>
                                    <option value="Clean">Clean</option>
                                    <option value="Dirty">Dirty</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Not Working">Not Working</option>
                                    <option value="Working">Working</option>

                                  </select>
<div className="vg12"></div>
                                  {/* Remark Input */}
                                  <textarea
                                    type="text"
                                    placeholder="Enter remark"
                                    className="w-100"
                                    onChange={(e) =>
                                      handleFixtureStatusChange(
                                        index,
                                        fixture,
                                        e.target.value,
                                        "remark"
                                      )
                                    }
                                  />
                         
                          </div>
                        </div>
                            )
                          )}
                      
                              
                          
                          </>
                        )}
                        {inspectionType === "Regular" && (
                          <div className="col-md-3">
                            <div
                              className="form_field w-100"
                              style={{
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid rgb(3 70 135 / 22%)",
                              }}
                            >
                              <h6
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                  marginBottom: "8px",
                                  color: "var(--theme-blue)",
                                }}
                              >
                                Seepage*
                              </h6>
                              <div className="field_box theme_radio_new">
                                <div className="theme_radio_container">
                                  <div className="radio_single">
                                    <input
                                      type="radio"
                                      name={`seepage-${index}`}
                                      id={`seepage-yes${index}`}
                                      value="Yes"
                                      checked={inspection.seepage === "Yes"}
                                      onChange={(e) =>
                                        handleInspectionChange(
                                          index,
                                          "seepage",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label htmlFor={`seepage-yes${index}`}>
                                      Yes
                                    </label>
                                  </div>
                                  <div className="radio_single">
                                    <input
                                      type="radio"
                                      name={`seepage-${index}`}
                                      value="No"
                                      id={`seepage-no${index}`}
                                      checked={inspection.seepage === "No"}
                                      onChange={(e) =>
                                        handleInspectionChange(
                                          index,
                                          "seepage",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label htmlFor={`seepage-no${index}`}>
                                      No
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {inspectionType === "Regular" && (
                          <div className="col-md-3">
                            <div
                              className="form_field w-100"
                              style={{
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid rgb(3 70 135 / 22%)",
                              }}
                            >
                              <h6
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                  marginBottom: "8px",
                                  color: "var(--theme-blue)",
                                }}
                              >
                                Termites*
                              </h6>
                              <div className="field_box theme_radio_new">
                                <div className="theme_radio_container">
                                  <div className="radio_single">
                                    <input
                                      type="radio"
                                      name={`termites-${index}`}
                                      id={`termites-yes${index}`}
                                      value="Yes"
                                      checked={inspection.termites === "Yes"}
                                      onChange={(e) =>
                                        handleInspectionChange(
                                          index,
                                          "termites",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label htmlFor={`termites-yes${index}`}>
                                      Yes
                                    </label>
                                  </div>
                                  <div className="radio_single">
                                    <input
                                      type="radio"
                                      name={`termites-${index}`}
                                      value="No"
                                      id={`termites-no${index}`}
                                      checked={inspection.termites === "No"}
                                      onChange={(e) =>
                                        handleInspectionChange(
                                          index,
                                          "termites",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label htmlFor={`termites-no${index}`}>
                                      No
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {inspectionType === "Regular" && (
                          <div className="col-md-3">
                            <div
                              className="form_field w-100"
                              style={{
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid rgb(3 70 135 / 22%)",
                              }}
                            >
                              <h6
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                  marginBottom: "8px",
                                  color: "var(--theme-blue)",
                                }}
                              >
                                Other Issue*
                              </h6>
                              <div className="field_box theme_radio_new">
                                <div className="theme_radio_container">
                                  <div className="radio_single">
                                    <input
                                      type="radio"
                                      name={`other-${index}`}
                                      id={`other-yes${index}`}
                                      value="Yes"
                                      checked={inspection.other === "Yes"}
                                      onChange={(e) =>
                                        handleInspectionChange(
                                          index,
                                          "other",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label htmlFor={`other-yes${index}`}>
                                      Yes
                                    </label>
                                  </div>
                                  <div className="radio_single">
                                    <input
                                      type="radio"
                                      name={`other-${index}`}
                                      value="No"
                                      id={`other-no${index}`}
                                      checked={inspection.other === "No"}
                                      onChange={(e) =>
                                        handleInspectionChange(
                                          index,
                                          "other",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label htmlFor={`other-no${index}`}>
                                      No
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {inspectionType === "Regular" && (
                          <div className="col-md-3">
                            <div
                              className="form_field w-100"
                              style={{
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid rgb(3 70 135 / 22%)",
                              }}
                            >
                              <h6
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                  marginBottom: "8px",
                                  color: "var(--theme-blue)",
                                }}
                              >
                                Remark*
                              </h6>

                              <input
                                type="text"
                                placeholder="General"
                                value={inspection.general}
                                onChange={(e) =>
                                  handleInspectionChange(
                                    index,
                                    "general",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}
                        {inspectionType === "Regular" && (
                          <div className="col-md-12">
                            <div
                              className="form_field w-100"
                              style={{
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid rgb(3 70 135 / 22%)",
                              }}
                            >
                              <h6
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                  marginBottom: "8px",
                                  color: "var(--theme-blue)",
                                }}
                              >
                                Upload Image
                              </h6>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                {inspection.imagePreviews.map((preview, i) => (
                                  <div key={i} style={{ position: "relative" }}>
                                    <img
                                      src={preview}
                                      alt="Preview"
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                      }}
                                    />
                                    <button
                                      type="button"
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleRemoveImage(index, i)
                                      }
                                    >
                                      X
                                    </button>
                                  </div>
                                ))}

                                {inspection.images.length < 3 && (
                                  <button
                                    type="button"
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      fontSize: "24px",
                                      border: "1px dashed #000",
                                      background: "none",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      document
                                        .getElementById(`file-input-${index}`)
                                        .click()
                                    }
                                  >
                                    +
                                  </button>
                                )}

                                <input
                                  id={`file-input-${index}`}
                                  type="file"
                                  multiple
                                  style={{ display: "none" }}
                                  onChange={(e) =>
                                    handleImageUpload(index, e.target.files)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {inspections.length > 1 &&
                      user &&
                      user.role === "superAdmin" && (
                        <span
                          class="material-symbols-outlined delete_icon_top"
                          onClick={() => removeInspection(index)}
                        >
                          delete_forever
                        </span>
                      )}
                  </div>
                ))}
              </form>
              <div className="bottom_fixed_button">
                <div className="next_btn_back">
                  <button
                    className="theme_btn no_icon btn_border full_width"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  <button
                    className="theme_btn no_icon btn_fill full_width"
                    onClick={addMoreInspection}
                  >
                    Select More Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <InactiveUserCard />
        )}
      </div>
    </>
  );
};

export default AddInspection;
