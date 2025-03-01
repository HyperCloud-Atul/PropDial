import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { projectFirestore, projectStorage, timestamp } from "../../firebase/config";

const AddInspection = () => {
  const { propertyid, inspectionId } = useParams();
  const [searchParams] = useSearchParams();
  const inspectionType = searchParams.get("type");
  const navigate = useNavigate();

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

  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);


  // Load rooms data from the "propertylayouts" collection based on propertyId
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const snapshot = await projectFirestore
          .collection("propertylayouts")
          .where("propertyId", "==", propertyid)  // Match the propertyId
          .get();

        // Extract room names from documents where propertyId matches
        const roomsData = snapshot.docs.map(doc => doc.data().roomName);  // Assuming the document has a field called 'roomName'
        setRooms(roomsData);  // Set the rooms in state
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, [propertyid]);  // Depend on propertyid to refetch rooms if it changes

  // Load existing inspection data if editing
  useEffect(() => {
    if (inspectionId) {
      const fetchInspection = async () => {
        try {
          const doc = await projectFirestore.collection("inspections").doc(inspectionId).get();
          if (doc.exists) {
            const data = doc.data();
            setFormData({
              roomName: data.roomName || "",
              general: data.general || "",
              seepage: data.seepage || "",
              termites: data.termites || "",
              others: data.others || "",
              images: [],
            });
            setExistingImageUrls(data.images || []);
          }
        } catch (error) {
          console.error("Error fetching inspection:", error);
        }
      };
      fetchInspection();
    }
  }, [inspectionId]);

  // Handle form field changes
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

  // Handle image upload and preview
  const handleImageUpload = (e) => {
    const files = e.target.files;
    const newFiles = Array.from(files);

    // Check for duplicate images
    const duplicate = newFiles.some(file => formData.images.some(img => img.name === file.name));
    if (duplicate) {
      alert("You selected this image already!");
      return;
    }

    if (formData.images.length + newFiles.length > 3) {
      alert("You can upload a maximum of 3 images.");
      return;
    }

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setFormData({ ...formData, images: [...formData.images, ...newFiles] });
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const imageUrls = await Promise.all(
  //       formData.images.map(async (file) => {
  //         const storageRef = projectStorage.ref(`inspection/${propertyid}/${file.name}`);
  //         await storageRef.put(file);
  //         return await storageRef.getDownloadURL();
  //       })
  //     );

  //     const finalImageUrls = [...existingImageUrls, ...imageUrls];

  //     if (inspectionId) {
  //       await projectFirestore.collection("inspections").doc(inspectionId).update({
  //         propertyId: propertyid,
  //         inspectionType,
  //         ...formData,
  //         images: finalImageUrls,
  //         updatedAt: timestamp.now(),
  //       });
  //       alert("Inspection updated successfully!");
  //     } else {
  //       await projectFirestore.collection("inspections").add({
  //         propertyId: propertyid,
  //         inspectionType,
  //         ...formData,
  //         images: finalImageUrls,
  //         createdAt: timestamp.now(),
  //       });
  //       alert("Inspection added successfully!");
  //     }

  //     navigate(`/inspection/${propertyid}`);
  //   } catch (error) {
  //     console.error("Error adding inspection:", error);
  //     alert("Failed to add inspection.");
  //   }
  // };

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
  

  // Function to remove existing images (stored in database)
const handleRemoveExistingImage = (index) => {
  const updatedImages = existingImageUrls.filter((_, i) => i !== index);
  setExistingImageUrls(updatedImages);
};

// Function to remove newly selected images
const handleRemoveNewImage = (index) => {
  const updatedImages = formData.images.filter((_, i) => i !== index);
  const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
  setFormData({ ...formData, images: updatedImages });
  setImagePreviews(updatedPreviews);
};

  return (
    <div>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <h2>{inspectionId ? "Edit" : "Add"} {inspectionType} Inspection</h2>
      <form onSubmit={handleSubmit}>
        {/* Render radio buttons dynamically for room name */}
        <div>
          <label>Room Name:</label>
          {rooms.map((room, index) => (
            <label key={index}>
              <input
                type="radio"
                name="roomName"
                value={room}
                onChange={handleInputChange}
                checked={formData.roomName === room}
              />
              {room}
            </label>
          ))}
        </div>

        <input
          type="text"
          name="general"
          placeholder="General"
          value={formData.general}
          onChange={handleInputChange}
          required
        />

        {/* Seepage, Termites, and Others radio buttons */}
        <div>
          <label>Seepage:</label>
          <input type="radio" name="seepage" value="Yes" onChange={handleInputChange} checked={formData.seepage === "Yes"} /> Yes
          <input type="radio" name="seepage" value="No" onChange={handleInputChange} checked={formData.seepage === "No"} /> No
        </div>

        <div>
          <label>Termites:</label>
          <input type="radio" name="termites" value="Yes" onChange={handleInputChange} checked={formData.termites === "Yes"} /> Yes
          <input type="radio" name="termites" value="No" onChange={handleInputChange} checked={formData.termites === "No"} /> No
        </div>

        <div>
          <label>Others:</label>
          <input type="radio" name="others" value="Yes" onChange={handleInputChange} checked={formData.others === "Yes"} /> Yes
          <input type="radio" name="others" value="No" onChange={handleInputChange} checked={formData.others === "No"} /> No
        </div>

        {/* Image upload and preview */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          {existingImageUrls.map((url, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={url}
                alt={`Existing Preview ${index + 1}`}
                style={{ width: "100px", height: "100px", borderRadius: "5px" }}
              />
              <button
                type="button"
                onClick={() => handleRemoveExistingImage(index)}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </div>
          ))}
          {imagePreviews.map((preview, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                style={{ width: "100px", height: "100px", borderRadius: "5px" }}
              />
              <button
                type="button"
                onClick={() => handleRemoveNewImage(index)}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        <input 
          type="file" 
          multiple 
          onChange={handleImageUpload} 
          accept="image/*" 
          style={{ display: "none" }} 
          id="fileInput"
        />

        {formData.images.length + existingImageUrls.length < 3 && (
          <button type="button" onClick={() => document.getElementById('fileInput').click()}>
            Add Image
          </button>
        )}

        <button type="submit">
          {inspectionId ? "Update" : "Add"} Inspection
        </button>
      </form>
    </div>
  );
};

export default AddInspection;
