import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { projectFirestore, timestamp } from "../../firebase/config";
import { projectStorage } from "../../firebase/config";
import imageCompression from "browser-image-compression";
import { FaPlus, FaTrash } from "react-icons/fa"; 
import {
  BarLoader,
} from "react-spinners";
const AddInspection = () => {
  const { inspectionId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [inspectionData, setInspectionData] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

useEffect(() => {
    if (!inspectionId) return;
  
    const unsubscribe = projectFirestore
      .collection("inspections")
      .doc(inspectionId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const inspectionData = doc.data();
          setPropertyId(inspectionData.propertyId);
  
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
      }, (error) => {
        console.error("Error fetching inspection:", error);
      });
  
    return () => unsubscribe();
  }, [inspectionId]);
  
  useEffect(() => {
    if (!propertyId) return;
  
    const unsubscribe = projectFirestore
      .collection("propertylayouts")
      .where("propertyId", "==", propertyId)
      .onSnapshot((snapshot) => {
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
      }, (error) => {
        console.error("Error fetching rooms:", error);
      });
  
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
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
                images: [...(prev[roomId]?.images || []), { url, name: compressedFile.name }],
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
    const storageRef = projectStorage.ref(`inspection_images/${inspectionId}/${roomId}/${image.name}`);

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
    setInspectionData((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [field]: value,
      },
    }));
  };

  const isFinalSubmitEnabled = () => {
    return Object.values(inspectionData).every(
      (room) => room.seepage && room.termites && room.otherIssue
    );
  };

  const getRoomClass = (roomId) => {
    const room = inspectionData[roomId];
    const filledFields = [room.seepage, room.termites, room.otherIssue].filter(Boolean).length;

    let className = "room-button";
    if (filledFields === 3) className += " full";
    else if (filledFields > 0) className += " half";
    if (roomId === activeRoom) className += " active";

    return className;
  };

  const handleSave = async () => {
    try {
      await projectFirestore.collection("inspections").doc(inspectionId).update({
        rooms: Object.values(inspectionData),
        updatedAt: timestamp.now(),
      });
      alert("Inspection data saved successfully!");
    } catch (error) {
      console.error("Error saving inspection:", error);
    }
  };

  const handleFinalSubmit = async () => {
    if (!window.confirm("Final Submit ke baad aap isko edit nahi kar paayenge. Kya aap sure hain?")) {
      return;
    }

    try {
      await projectFirestore.collection("inspections").doc(inspectionId).update({
        rooms: Object.values(inspectionData),
        finalSubmit: true,
        updatedAt: timestamp.now(),
      });
      alert("Inspection data successfully finalized!");
    } catch (error) {
      console.error("Error in final submit:", error);
    }
  };

  return (
    <div>
        <br /><br /><br /><br /><br />
      <h2>Inspection Form</h2>

      {propertyId ? (
        <>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={getRoomClass(room.id)}
              >
                {room.roomName}
              </button>
            ))}
          </div>

          {activeRoom && (
            <div style={{ border: "1px solid #ccc", padding: "10px" }}>
              <h3>{rooms.find((room) => room.id === activeRoom)?.roomName}</h3>

              <label>Seepage:</label>
              <input
                type="radio"
                name={`seepage-${activeRoom}`}
                value="yes"
                checked={inspectionData[activeRoom]?.seepage === "yes"}
                onChange={(e) => handleChange(activeRoom, "seepage", e.target.value)}
              /> Yes
              <input
                type="radio"
                name={`seepage-${activeRoom}`}
                value="no"
                checked={inspectionData[activeRoom]?.seepage === "no"}
                onChange={(e) => handleChange(activeRoom, "seepage", e.target.value)}
              /> No
              <input
                type="text"
                placeholder="Seepage Remark"
                value={inspectionData[activeRoom]?.seepageRemark || ""}
                onChange={(e) => handleChange(activeRoom, "seepageRemark", e.target.value)}
              />

              <label>Termites:</label>
              <input
                type="radio"
                name={`termites-${activeRoom}`}
                value="yes"
                checked={inspectionData[activeRoom]?.termites === "yes"}
                onChange={(e) => handleChange(activeRoom, "termites", e.target.value)}
              /> Yes
              <input
                type="radio"
                name={`termites-${activeRoom}`}
                value="no"
                checked={inspectionData[activeRoom]?.termites === "no"}
                onChange={(e) => handleChange(activeRoom, "termites", e.target.value)}
              /> No
              <input
                type="text"
                placeholder="Termites Remark"
                value={inspectionData[activeRoom]?.termitesRemark || ""}
                onChange={(e) => handleChange(activeRoom, "termitesRemark", e.target.value)}
              />

              <label>Other Issue:</label>
              <input
                type="radio"
                name={`otherIssue-${activeRoom}`}
                value="yes"
                checked={inspectionData[activeRoom]?.otherIssue === "yes"}
                onChange={(e) => handleChange(activeRoom, "otherIssue", e.target.value)}
              /> Yes
              <input
                type="radio"
                name={`otherIssue-${activeRoom}`}
                value="no"
                checked={inspectionData[activeRoom]?.otherIssue === "no"}
                onChange={(e) => handleChange(activeRoom, "otherIssue", e.target.value)}
              /> No
              <input
                type="text"
                placeholder="Other Issue Remark"
                value={inspectionData[activeRoom]?.otherIssueRemark || ""}
                onChange={(e) => handleChange(activeRoom, "otherIssueRemark", e.target.value)}
              />

              <label>General Remark:</label>
              <textarea
                placeholder="General Remark"
                value={inspectionData[activeRoom]?.generalRemark || ""}
                onChange={(e) => handleChange(activeRoom, "generalRemark", e.target.value)}
              />
                        {/* Image Upload and Preview Section */}
            <div>
            <label>Upload Images:</label>
            <div 
              onClick={() => document.getElementById(`file-input-${activeRoom}`).click()} 
              style={{ 
                width: "50px", height: "50px", display: "flex", alignItems: "center", 
                justifyContent: "center", border: "1px dashed #999", cursor: "pointer" 
              }}
            >
              <FaPlus size={24} color="#555" />
            </div>
            <input 
              type="file" 
              id={`file-input-${activeRoom}`} 
              style={{ display: "none" }} 
              onChange={(e) => handleImageUpload(e, activeRoom)} 
            />
          </div>

          {/* Display Uploaded Images */}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {inspectionData[activeRoom]?.images?.map((image, index) => (
              <div key={index} style={{ position: "relative", textAlign: "center" }}>
                <img 
                  src={image.url} 
                  alt="Uploaded" 
                  style={{ width: "100px", height: "100px", borderRadius: "5px" }} 
                />
                <FaTrash 
                  size={16} 
                  color="red" 
                  style={{ position: "absolute", top: "5px", right: "5px", cursor: "pointer" }} 
                  onClick={() => handleImageDelete(activeRoom, image)} 
                />
                {isImageUploading && (
                  <div >
                    Uploadiiing
                  </div>
                )}
                
              </div>
            ))}
          </div>
       
     
     

              <button onClick={handleSave}>Save Inspection</button>

              <button onClick={handleFinalSubmit} disabled={!isFinalSubmitEnabled()}>
                Final Submit
              </button>
            </div>


          )}
        </>
      ) : (
        <p>Loading property details...</p>
      )}

<Modal show={show} centered className="uploading_modal">
   <h6 style={{
    color:"var(--theme-green2)"
   }}>Uploading....</h6>    
<BarLoader color="var(--theme-green2)" loading={true} height={10} />
      </Modal>
    </div>
  );
};

export default AddInspection;
