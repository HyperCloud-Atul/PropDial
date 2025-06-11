import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { projectFirestore, timestamp } from "../../firebase/config";

const AddInspection = () => {
  const { propertyid } = useParams();
  const [rooms, setRooms] = useState([]);
  const [inspectionData, setInspectionData] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const snapshot = await projectFirestore
          .collection("inspections")
          .where("propertyId", "==", propertyid)
          .get();

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setInspectionData(doc.data().rooms || {});
          setIsFinalized(doc.data().isFinalized || false);
        }

        const roomSnapshot = await projectFirestore
          .collection("propertylayouts")
          .where("propertyId", "==", propertyid)
          .get();

        const roomsData = roomSnapshot.docs.map((doc) => ({
          id: doc.id,
          roomName: doc.data().roomName,
        }));

        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInspection();
  }, [propertyid]);

  const handleChange = (roomId, field, value) => {
    setInspectionData((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        roomId,
        roomName: rooms.find((room) => room.id === roomId)?.roomName || "",
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const inspectionRef = await projectFirestore
        .collection("inspections")
        .where("propertyId", "==", propertyid)
        .get();

      if (!inspectionRef.empty) {
        await projectFirestore
          .collection("inspections")
          .doc(inspectionRef.docs[0].id)
          .update({ rooms: inspectionData, updatedAt: timestamp.now() });
      } else {
        await projectFirestore.collection("inspections").add({
          propertyId: propertyid,
          rooms: inspectionData,
          isFinalized: false,
          createdAt: timestamp.now(),
        });
      }
    } catch (error) {
      console.error("Error saving inspection:", error);
    }
    setTimeout(() => setIsSaving(false), 1000);
  };



const handleFinalSubmit = async () => {
    if (!window.confirm("Are you sure you want to finalize the inspection? You won't be able to edit after this.")) {
      return;
    }
    try {
      const inspectionRef = await projectFirestore
        .collection("inspections")
        .where("propertyId", "==", propertyid)
        .get();
  
      if (!inspectionRef.empty) {
        await projectFirestore
          .collection("inspections")
          .doc(inspectionRef.docs[0].id)
          .update({
            rooms: inspectionData,  // Ensure latest inspection data is saved
            isFinalized: true,
            finalizedAt: timestamp.now(),
          });
  
        setIsFinalized(true);
      }
    } catch (error) {
      console.error("Error finalizing inspection:", error);
    }
  };
  

  // Check form completion status for each room
  const getRoomStatus = (room) => {
    const data = inspectionData[room.id] || {};
    const requiredFields = ["seepage", "termites"];
    const filledFields = requiredFields.filter((field) => data[field]);
    
    if (filledFields.length === requiredFields.length) return "full";
    if (filledFields.length > 0) return "half";
    return "";
  };

  // Updated validation (Remarks are optional)
  const isFormComplete = Object.values(inspectionData).every(
    (room) => room.seepage && room.termites
  );

  return (
    <div>
      <br /><br /><br /><br /><br />
      <h2>Inspection Form</h2>

      {/* Tabs Section */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => setActiveRoom(room.id)}
            className={getRoomStatus(room)} // Adds "half" or "full" class
            style={{
              padding: "8px 15px",
              cursor: "pointer",
              background: activeRoom === room.id ? "#007bff" : "#ddd",
              color: activeRoom === room.id ? "#fff" : "#000",
              borderRadius: "5px",
              border: "none",
              transition: "background 0.3s ease",
            }}
          >
            {room.roomName}
          </button>
        ))}
      </div>

      {/* Form for Selected Room */}
      {activeRoom && (
        <div style={{ animation: "fadeIn 0.5s" }}>
          <h3>{rooms.find((room) => room.id === activeRoom)?.roomName}</h3>

          <label>Seepage:</label>
          <input
            type="radio"
            name={`seepage-${activeRoom}`}
            value="yes"
            checked={inspectionData[activeRoom]?.seepage === "yes"}
            onChange={(e) => handleChange(activeRoom, "seepage", e.target.value)}
          />{" "}
          Yes
          <input
            type="radio"
            name={`seepage-${activeRoom}`}
            value="no"
            checked={inspectionData[activeRoom]?.seepage === "no"}
            onChange={(e) => handleChange(activeRoom, "seepage", e.target.value)}
          />{" "}
          No
          <input
            type="text"
            placeholder="Seepage Remark (Optional)"
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
          />{" "}
          Yes
          <input
            type="radio"
            name={`termites-${activeRoom}`}
            value="no"
            checked={inspectionData[activeRoom]?.termites === "no"}
            onChange={(e) => handleChange(activeRoom, "termites", e.target.value)}
          />{" "}
          No
          <input
            type="text"
            placeholder="Termites Remark (Optional)"
            value={inspectionData[activeRoom]?.termitesRemark || ""}
            onChange={(e) => handleChange(activeRoom, "termitesRemark", e.target.value)}
          />

          <label>General Remark (Optional):</label>
          <input
            type="text"
            placeholder="General Remark"
            value={inspectionData[activeRoom]?.generalRemark || ""}
            onChange={(e) => handleChange(activeRoom, "generalRemark", e.target.value)}
          />
        </div>
      )}

      {/* Buttons */}
      {!isFinalized && (
        <div>
          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button onClick={handleFinalSubmit} disabled={!isFormComplete}>
            Final Submit
          </button>
        </div>
      )}

      {isFinalized && <p>This form has been finalized and cannot be edited.</p>}
    </div>
  );
};

export default AddInspection;
