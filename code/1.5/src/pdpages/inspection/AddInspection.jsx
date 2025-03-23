import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectFirestore, timestamp } from "../../firebase/config";
import firebase from "firebase";
import { useDocument } from "../../hooks/useDocument";
import { projectStorage } from "../../firebase/config";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { BarLoader, ClipLoader } from "react-spinners";
import ScrollToTop from "../../components/ScrollToTop";
import PropertySummaryCard from "../property/PropertySummaryCard";
const AddInspection = () => {
  const { inspectionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [rooms, setRooms] = useState([]);
  const [inspectionData, setInspectionData] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isDataSaving, setIsDataSaving] = useState(false);
  const [show, setShow] = useState(false);
  const [finalSubmit, setFinalSubmit] = useState(false);
  const [finalSubmiting, setFinalSubmiting] = useState(false);
  const [afterSaveModal, setAfterSaveModal] = useState(false);
  const [propertydoc, setPropertyDoc] = useState(null);
  const [propertyerror, setPropertyError] = useState(null);
  const [inspectionType, setInspectionType] = useState("");

  useEffect(() => {
    if (!propertyId) return; // Agar propertyId na ho toh return kar do

    const unsubscribe = projectFirestore
      .collection("properties-propdial")
      .doc(propertyId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            setPropertyDoc({ id: doc.id, ...doc.data() });
          } else {
            setPropertyDoc(null);
            setPropertyError("Property not found.");
          }
        },
        (error) => {
          console.error("Error fetching property:", error);
          setPropertyError(error.message);
        }
      );

    return () => unsubscribe(); // Cleanup function
  }, [propertyId]);

  useEffect(() => {
    if (!inspectionId) return;

    const unsubscribe = projectFirestore
      .collection("inspections")
      .doc(inspectionId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const inspectionData = doc.data();
            setPropertyId(inspectionData.propertyId);
            setInspectionType(inspectionData.inspectionType || "Not Available");
            if (inspectionData.rooms) {
              const formattedRooms = {};
              inspectionData.rooms.forEach((room) => {
                formattedRooms[room.roomId] = room;
              });
              setInspectionData(formattedRooms);
            }
          } else {
            console.error("Inspection not found!");
          }
        },
        (error) => {
          console.error("Error fetching inspection:", error);
        }
      );

    return () => unsubscribe();
  }, [inspectionId]);

  useEffect(() => {
    if (!propertyId) return;

    const unsubscribe = projectFirestore
      .collection("propertylayouts")
      .where("propertyId", "==", propertyId)
      .onSnapshot(
        (snapshot) => {
          const roomsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            roomName: doc.data().roomName,
          }));

          setRooms(roomsData);

          setInspectionData((prevData) => {
            const newData = { ...prevData };
            roomsData.forEach((room) => {
              if (!newData[room.id]) {
                newData[room.id] = {
                  roomId: room.id,
                  roomName: room.roomName,
                  seepage: "",
                  seepageRemark: "",
                  termites: "",
                  termitesRemark: "",
                  otherIssue: "",
                  otherIssueRemark: "",
                  generalRemark: "",
                  
                };
              }
            });
            return newData;
          });
        },
        (error) => {
          console.error("Error fetching rooms:", error);
        }
      );

    return () => unsubscribe();
  }, [propertyId]);

  const handleImageUpload = async (e, roomId) => {
    const file = e.target.files[0];
    if (!file) return;

    setShow(true); // Start uploading state

    try {
      // Image Compression Settings
      const options = {
        maxSizeMB: 0.2, // Maximum size 200KB
        maxWidthOrHeight: 1024, // Resize if necessary
        useWebWorker: true,
      };

      // Compress Image
      const compressedFile = await imageCompression(file, options);

      // Upload Process
      const storageRef = projectStorage.ref(
        `inspection_images/${inspectionId}/${roomId}/${compressedFile.name}`
      );
      const uploadTask = storageRef.put(compressedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
        },
        (error) => {
          console.error("Error uploading image:", error);
          setShow(false); // Stop uploading state on error
        },
        async () => {
          try {
            const url = await storageRef.getDownloadURL();
            setInspectionData((prev) => ({
              ...prev,
              [roomId]: {
                ...prev[roomId],
                images: [
                  ...(prev[roomId]?.images || []),
                  { url, name: compressedFile.name },
                ],
              },
            }));
            setUploadProgress((prev) => ({ ...prev, [file.name]: 100 })); // Mark upload as complete
          } catch (error) {
            console.error("Error getting download URL:", error);
          } finally {
            setShow(false); // Stop uploading state after completion
          }
        }
      );
    } catch (error) {
      console.error("Image compression error:", error);
      setShow(false); // Stop uploading state if compression fails
    }
  };

  const handleImageDelete = async (roomId, image) => {
    const storageRef = projectStorage.ref(
      `inspection_images/${inspectionId}/${roomId}/${image.name}`
    );

    try {
      await storageRef.delete();
      setInspectionData((prev) => ({
        ...prev,
        [roomId]: {
          ...prev[roomId],
          images: prev[roomId]?.images?.filter((img) => img.url !== image.url),
        },
      }));
      alert("Image deleted successfully.");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleChange = (roomId, field, value) => {
    setInspectionData((prev) => {
      const updatedRoomData = {
        ...prev[roomId],
        [field]: value,
      };  
      // Check if the field is an issue field (like seepage, termites, or otherIssue)
      if (field === "seepage" || field === "termites" || field === "otherIssue") {
        const remarkField = `${field}Remark`; // Derive the corresponding remark field name
        if (value === "no") {
          updatedRoomData[remarkField] = "There is no issue";
        } else if (value === "yes") {
          updatedRoomData[remarkField] = ""; // Reset to blank if "yes"
        }
      }
  
      return {
        ...prev,
        [roomId]: updatedRoomData,
      };
    });
  };

  const isFinalSubmitEnabled = () => {
    return Object.values(inspectionData).every(
      (room) =>
        room.seepage &&
        room.termites &&
        room.otherIssue &&
        room.seepageRemark &&
        room.termitesRemark &&
        room.otherIssueRemark &&
        room.generalRemark &&
        room.images?.length > 0 // Ensures every room has at least 1 image uploaded
    );
  };

  const getRoomClass = (roomId) => {
    const room = inspectionData[roomId];
    const filledFields = [room.seepage, room.seepageRemark, room.termites, room.termitesRemark, room.otherIssue, room.otherIssueRemark, room.generalRemark, room.images?.length > 0].filter(
      Boolean
    ).length;

    let className = "room-button";
    if (filledFields === 8) className += " full";
    else if (filledFields > 0) className += " half";
    if (roomId === activeRoom) className += " active";

    return className;
  };
  const handleSave = async () => {
    setIsDataSaving(true);

    try {
      await projectFirestore
        .collection("inspections")
        .doc(inspectionId)
        .update({
          rooms: Object.values(inspectionData),
          lastUpdatedAt: timestamp.now(),
          lastUpdatedBy: user.uid,
          updatedInformation: firebase.firestore.FieldValue.arrayUnion({
            updatedAt: timestamp.now(),
            updatedBy: user.uid,
          }),
        });
      setIsDataSaving(false);
      setAfterSaveModal(true);
    } catch (error) {
      console.error("Error saving inspection:", error);
    } finally {
      setIsDataSaving(false);
    }
  };

  const handleFinalSubmit = async () => {
    setFinalSubmiting(true);
    try {
      await projectFirestore
        .collection("inspections")
        .doc(inspectionId)
        .update({
          rooms: Object.values(inspectionData),
          finalSubmit: true,
          updatedAt: timestamp.now(),
          updatedInformation: firebase.firestore.FieldValue.arrayUnion({
            updatedAt: timestamp.now(),
            updatedBy: user.uid,
          }),
        });
      navigate(`/inspection-report/${inspectionId}`);
      setFinalSubmiting(false);
      setFinalSubmit(false);
    } catch (error) {
      console.error("Error in final submit:", error);
    } finally {
      setFinalSubmiting(false);
      setFinalSubmit(false);
    }
  };

  return (
    <div className="pg_min_height">
      <ScrollToTop />
      <div className="top_header_pg pg_bg add_inspection_pg">
        <div className="page_spacing pg_min_height">
          {propertyId ? (
            <>
              <div className="row row_reverse_991">
                <div className="col-lg-6">
                  <div className="title_card with_title mobile_full_575 mobile_gap h-100">
                    <h2 className="text-center">{inspectionType} Inspection</h2>
                    <div className="inspection_type_img text-center mt-3">
                      <img
                        src={
                          inspectionType === "Regular"
                            ? "/assets/img/regular.png"
                            : inspectionType === "Move-In"
                            ? "/assets/img/movein.png"
                            : inspectionType === "Move-Out"
                            ? "/assets/img/moveout.png"
                            : "/assets/img/full.png" // Default image
                        }
                        alt={`${inspectionType} Inspection`}
                      />
                    </div>
                  </div>
                </div>
                <PropertySummaryCard
                  propertydoc={propertydoc}
                  propertyId={propertyId}
                />
              </div>
              <div className="room-buttons">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoom(room.id)}
                    className={getRoomClass(room.id)}
                  >
                    <div className="active_hand">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#FFFFFF"
                      >
                        <path d="M412-96q-22 0-41-9t-33-26L48-482l27-28q17-17 41.5-20.5T162-521l126 74v-381q0-15.3 10.29-25.65Q308.58-864 323.79-864t25.71 10.46q10.5 10.46 10.5 25.92V-321l-165-97 199 241q3.55 4.2 8.27 6.6Q407-168 412-168h259.62Q702-168 723-189.15q21-21.15 21-50.85v-348q0-15.3 10.29-25.65Q764.58-624 779.79-624t25.71 10.35Q816-603.3 816-588v348q0 60-42 102T672-96H412Zm100-242Zm-72-118v-228q0-15.3 10.29-25.65Q460.58-720 475.79-720t25.71 10.35Q512-699.3 512-684v228h-72Zm152 0v-179.72q0-15.28 10.29-25.78 10.29-10.5 25.5-10.5t25.71 10.35Q664-651.3 664-636v180h-72Z" />
                      </svg>
                    </div>
                    <div className="icon_text">
                      <div className="btn_icon">
                        <div className="bi_icon add">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="30px"
                            viewBox="0 -960 960 960"
                            width="30px"
                            fill="#3F5E98"
                            stroke-width="40"
                          >
                            <path d="M446.67-446.67H200v-66.66h246.67V-760h66.66v246.67H760v66.66H513.33V-200h-66.66v-246.67Z" />
                          </svg>
                        </div>
                        <div className="bi_icon half">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#FFC107"
                          >
                            <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
                          </svg>
                        </div>
                        <div className="bi_icon full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#00a300"
                          >
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="btn_text">
                        <h6 className="add">Start</h6>
                        <h6 className="half">In Progress</h6>
                        <h6 className="full">Completed</h6>
                      </div>
                    </div>
                    <div className="room_name">{room.roomName}</div>
                  </button>
                ))}
              </div>
              <div className="vg22"></div>
              {activeRoom && (
                <div>
                  {/* <h3>
                    {rooms.find((room) => room.id === activeRoom)?.roomName}
                  </h3> */}
                  <form className="add_inspection_form">
                    <div className="aai_form">
                      <div className="row row_gap_20">
                        <div className="col-xl-3 col-md-6">
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                              background: "white",
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
                                    name={`seepage-${activeRoom}`}
                                    id={`seepage-yes-${activeRoom}`}
                                    value="yes"
                                    checked={
                                      inspectionData[activeRoom]?.seepage ===
                                      "yes"
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        activeRoom,
                                        "seepage",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label htmlFor={`seepage-yes-${activeRoom}`}>
                                    Yes
                                  </label>
                                </div>
                                <div className="radio_single">
                                  <input
                                    type="radio"
                                    name={`seepage-${activeRoom}`}
                                    value="no"
                                    id={`seepage-no-${activeRoom}`}
                                    checked={
                                      inspectionData[activeRoom]?.seepage ===
                                      "no"
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        activeRoom,
                                        "seepage",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label htmlFor={`seepage-no-${activeRoom}`}>
                                    No
                                  </label>
                                </div>
                              </div>
                              
                              {inspectionData[activeRoom]?.seepage === "yes" && (
        <>
          <div className="vg12"></div>
          <textarea
            placeholder="Seepage Remark*"
            className="w-100"
            value={inspectionData[activeRoom]?.seepageRemark || ""}
            onChange={(e) =>
              handleChange(activeRoom, "seepageRemark", e.target.value)
            }
          />
        </>
      )}            
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                              background: "white",
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
                                    id={`Termites-yes-${activeRoom}`}
                                    name={`termites-${activeRoom}`}
                                    value="yes"
                                    checked={
                                      inspectionData[activeRoom]?.termites ===
                                      "yes"
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        activeRoom,
                                        "termites",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label htmlFor={`Termites-yes-${activeRoom}`}>
                                    Yes
                                  </label>
                                </div>
                                <div className="radio_single">
                                  <input
                                    id={`Termites-no-${activeRoom}`}
                                    type="radio"
                                    name={`termites-${activeRoom}`}
                                    value="no"
                                    checked={
                                      inspectionData[activeRoom]?.termites ===
                                      "no"
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        activeRoom,
                                        "termites",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label htmlFor={`Termites-no-${activeRoom}`}>
                                    No
                                  </label>
                                </div>
                              </div>                             
                            
                              {inspectionData[activeRoom]?.termites === "yes" && (
        <>
          <div className="vg12"></div>
          <textarea
            placeholder="Termites Remark*"
            value={inspectionData[activeRoom]?.termitesRemark || ""}
            className="w-100"
            onChange={(e) =>
              handleChange(activeRoom, "termitesRemark", e.target.value)
            }
          />
        </>
      )}
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                              background: "white",
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
                                    id={`other-issue-yes-${activeRoom}`}
                                    type="radio"
                                    name={`otherIssue-${activeRoom}`}
                                    value="yes"
                                    checked={
                                      inspectionData[activeRoom]?.otherIssue ===
                                      "yes"
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        activeRoom,
                                        "otherIssue",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`other-issue-yes-${activeRoom}`}
                                  >
                                    Yes
                                  </label>
                                </div>
                                <div className="radio_single">
                                  <input
                                    id={`other-issue-no-${activeRoom}`}
                                    type="radio"
                                    name={`otherIssue-${activeRoom}`}
                                    value="no"
                                    checked={
                                      inspectionData[activeRoom]?.otherIssue ===
                                      "no"
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        activeRoom,
                                        "otherIssue",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`other-issue-no-${activeRoom}`}
                                  >
                                    No
                                  </label>
                                </div>
                              </div>                           
                           
                                {inspectionData[activeRoom]?.otherIssue === "yes" && (
        <>
            <div className="vg12"></div>
          <textarea
            placeholder="Other Issue Remark*"
            value={inspectionData[activeRoom]?.otherIssueRemark || ""}
            className="w-100"
            onChange={(e) =>
              handleChange(activeRoom, "otherIssueRemark", e.target.value)
            }
          />
        </>
      )}
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                              background: "white",
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
                              General Remark*
                            </h6>
                            <div className="field_box theme_radio_new">
                              <textarea
                                style={{
                                  minHeight: "104px",
                                }}
                                placeholder="General Remark"
                                value={
                                  inspectionData[activeRoom]?.generalRemark ||
                                  ""
                                }
                                className="w-100"
                                onChange={(e) =>
                                  handleChange(
                                    activeRoom,
                                    "generalRemark",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          {/* Image Upload and Preview Section */}
                          <div
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                              background: "white",
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
                              Upload images*{" "}
                              <span
                                style={{
                                  fontSize: "13px",
                                }}
                              >
                                (A minimum of 1 and a maximum of 10 images can be uploaded.)
                              </span>
                            </h6>
                            <div className="add_and_images">
                              {inspectionData[activeRoom]?.images?.map(
                                (image, index) => (
                                  <div
                                    key={index}
                                    className="uploaded_images relative"
                                  >
                                    <img src={image.url} alt="Uploaded" />
                                    <div className="trash_icon">
                                      <FaTrash
                                        size={14}
                                        color="red"
                                        onClick={() =>
                                          handleImageDelete(activeRoom, image)
                                        }
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                              <div>
                                <div
                                  onClick={() =>
                                    document
                                      .getElementById(
                                        `file-input-${activeRoom}`
                                      )
                                      .click()
                                  }
                                  className="add_icon"
                                >
                                  <FaPlus size={24} color="#555" />
                                </div>
                                <input
                                  type="file"
                                  id={`file-input-${activeRoom}`}
                                  style={{ display: "none" }}
                                  onChange={(e) =>
                                    handleImageUpload(e, activeRoom)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="bottom_fixed_button">
                    <div className="next_btn_back">
                      <button
                        className="theme_btn no_icon btn_fill2 full_width"
                        onClick={() => setFinalSubmit(true)}
                        disabled={!isFinalSubmitEnabled()}
                        style={{
                          opacity: !isFinalSubmitEnabled() ? 0.5 : 1,
                          cursor: !isFinalSubmitEnabled()
                            ? "not-allowed"
                            : "pointer",
                        }}
                      >
                        Final Submit
                      </button>

                      <button
                        className="theme_btn no_icon btn_fill full_width"
                        onClick={handleSave}
                        disabled={isDataSaving}
                        style={{
                          opacity: isDataSaving ? "0.5" : "1",
                        }}
                      >
                        {isDataSaving ? "Saving...." : "Save Inspection"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="page_loader">
              <ClipLoader color="var(--theme-green2)" loading={true} />
            </div>
          )}
        </div>
      </div>
      {/* image upload modal  */}
      <Modal show={show} centered className="uploading_modal">
        <h6
          style={{
            color: "var(--theme-green2)",
          }}
        >
          Uploading....
        </h6>
        <BarLoader color="var(--theme-green2)" loading={true} height={10} />
      </Modal>

      {/* saved successfully  */}
      <Modal
        show={afterSaveModal}
        onHide={() => setAfterSaveModal(false)}
        className="delete_modal inspection_modal"
        centered
      >
        <h5 className="done_div text-center">
          <img
            src="/assets/img/icons/check-mark.png"
            alt=""
            style={{
              height: "65px",
              width: "auto",
            }}
          />
          <h5 className="text_green2 mb-0">Saved Successfully</h5>
        </h5>
        <h6 className="text-center text_black mb-0">
          What would you like to do next?
        </h6>
        <div className="inspection_types">
          <Link className="it_single" onClick={() => setAfterSaveModal(false)}>
            <div
              className="d-flex align-items-center"
              style={{
                gap: "5px",
              }}
            >
              <img src="/assets/img/icons/continuous.png" alt="" />
              <div>
                <h5>Continue</h5>
                <h6>Stay on this page and continue working</h6>
              </div>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#303030"
            >
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>
          </Link>
          <Link className="it_single" to={`/inspection-report/${inspectionId}`}>
            <div
              className="d-flex align-items-center"
              style={{
                gap: "5px",
              }}
            >
              <img src="/assets/img/icons/view-report.png" alt="" />
              <div>
                <h5>Go to Report</h5>
                <h6>View and manage the details of this inspection</h6>
              </div>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#303030"
            >
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>
          </Link>
          <Link className="it_single" to={`/inspection/${propertyId}`}>
            <div
              className="d-flex align-items-center"
              style={{
                gap: "5px",
              }}
            >
              <img src="/assets/img/icons/view-all.png" alt="" />
              <div>
                <h5>View All</h5>
                <h6>Return to the inspections list to see all records</h6>
              </div>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#303030"
            >
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>
          </Link>
        </div>
      </Modal>

      {/* final submit alert  */}
      <Modal show={finalSubmit} onHide={() => setFinalSubmit(false)} centered>
        <Modal.Header
          className="justify-content-center"
          style={{
            paddingBottom: "0px",
            border: "none",
          }}
        >
          <h5>Alert</h5>
        </Modal.Header>
        <Modal.Body
          className="text-center"
          style={{
            color: "#FA6262",
            fontSize: "20px",
            border: "none",
          }}
        >
          After final submission, you won't be able to edit this inspection.
        </Modal.Body>
        <Modal.Footer
          className="d-flex justify-content-between"
          style={{
            border: "none",
            gap: "15px",
          }}
        >
          <div className="cancel_btn" onClick={() => setFinalSubmit(false)}>
            Cancel
          </div>
          <div className="done_btn" onClick={handleFinalSubmit}>
            {finalSubmiting ? "Processing..." : "Proceed"}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddInspection;
