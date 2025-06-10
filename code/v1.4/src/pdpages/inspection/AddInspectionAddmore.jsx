import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { projectFirestore, projectStorage, timestamp } from "../../firebase/config";

const AddInspection = () => {
  const { propertyid } = useParams();
  const [inspections, setInspections] = useState([
    {
      roomName: "",
      general: "",
      seepage: "",
      termites: "",
      others: "",
      images: [],
      createdAt: timestamp.now(),
    },
  ]);
  const [rooms, setRooms] = useState([]);

  // Load rooms from Firestore
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const snapshot = await projectFirestore
          .collection("propertylayouts")
          .where("propertyId", "==", propertyid)
          .get();

        const roomsData = snapshot.docs.map((doc) => doc.data().roomName);
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, [propertyid]);

  // Handle changes to individual inspection fields
  const handleInspectionChange = (index, field, value) => {
    const updatedInspections = [...inspections];
    updatedInspections[index][field] = value;
    setInspections(updatedInspections);
  };

  // Add a new inspection entry
  const addInspection = () => {
    setInspections([
      ...inspections,
      {
        roomName: "",
        general: "",
        seepage: "",
        termites: "",
        others: "",
        images: [],
        createdAt: timestamp.now(),
      },
    ]);
  };

  // Remove an inspection entry
  const removeInspection = (index) => {
    const updatedInspections = inspections.filter((_, i) => i !== index);
    setInspections(updatedInspections);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save inspections to Firestore
      const inspectionPromises = inspections.map(async (inspection) => {
        const imageUrls = await Promise.all(
          inspection.images.map(async (file) => {
            const storageRef = projectStorage.ref(`inspection/${propertyid}/${file.name}`);
            await storageRef.put(file);
            return await storageRef.getDownloadURL();
          })
        );

        return {
          ...inspection,
          images: imageUrls,
        };
      });

      const finalInspections = await Promise.all(inspectionPromises);

      await projectFirestore.collection("inspections").add({
        propertyId: propertyid,
        inspections: finalInspections,
        createdAt: timestamp.now(),
      });

      alert("Inspections added successfully!");
    } catch (error) {
      console.error("Error adding inspections:", error);
      alert("Failed to add inspections.");
    }
  };

  return (
    <div>
      <h2>Add Inspections</h2>
      <form onSubmit={handleSubmit}>
        {inspections.map((inspection, index) => (
          <div key={index} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
            <h3>Inspection {index + 1}</h3>
            <div>
              <label>Room Name:</label>
              <select
                value={inspection.roomName}
                onChange={(e) => handleInspectionChange(index, "roomName", e.target.value)}
              >
                <option value="">Select Room</option>
                {rooms.map((room, i) => (
                  <option key={i} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="General Condition"
              value={inspection.general}
              onChange={(e) => handleInspectionChange(index, "general", e.target.value)}
            />
            <div>
              <label>Seepage:</label>
              <input
                type="radio"
                name={`seepage-${index}`}
                value="Yes"
                checked={inspection.seepage === "Yes"}
                onChange={(e) => handleInspectionChange(index, "seepage", e.target.value)}
              />
              Yes
              <input
                type="radio"
                name={`seepage-${index}`}
                value="No"
                checked={inspection.seepage === "No"}
                onChange={(e) => handleInspectionChange(index, "seepage", e.target.value)}
              />
              No
            </div>

            <div>
              <label>Termites:</label>
              <input
                type="radio"
                name={`termites-${index}`}
                value="Yes"
                checked={inspection.termites === "Yes"}
                onChange={(e) => handleInspectionChange(index, "termites", e.target.value)}
              />
              Yes
              <input
                type="radio"
                name={`termites-${index}`}
                value="No"
                checked={inspection.termites === "No"}
                onChange={(e) => handleInspectionChange(index, "termites", e.target.value)}
              />
              No
            </div>

            <div>
              <label>Others:</label>
              <input
                type="radio"
                name={`others-${index}`}
                value="Yes"
                checked={inspection.others === "Yes"}
                onChange={(e) => handleInspectionChange(index, "others", e.target.value)}
              />
              Yes
              <input
                type="radio"
                name={`others-${index}`}
                value="No"
                checked={inspection.others === "No"}
                onChange={(e) => handleInspectionChange(index, "others", e.target.value)}
              />
              No
            </div>

            <button type="button" onClick={() => removeInspection(index)}>
              Remove Inspection
            </button>
          </div>
        ))}

        <button type="button" onClick={addInspection}>
          Add More
        </button>
        <button type="submit">Submit Inspections</button>
      </form>
    </div>
  );
};

export default AddInspection;
