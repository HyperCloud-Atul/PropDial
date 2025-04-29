import React, { useState, useEffect } from "react";
import ScrollToTop from "../ScrollToTop";
import { useParams } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import Select from "react-select";
import { projectStorage } from "../../firebase/config";
import imageCompression from "browser-image-compression";
import firebase from "firebase";

const AddPropertyLayout = () => {
  const { propertyLayoutId } = useParams();
  const [propertyId, setPropertyId] = useState("");
  const [propertyDocument, setPropertyDocument] = useState(null);
  const [openField, setOpenField] = useState(null);
  const [layouts, setLayouts] = useState({});
  const [updateInfo, setUpdateInfo] = useState([]);
  const [fixtureOptions, setFixtureOptions] = useState([]);

  useEffect(() => {
    const fetchPropertyLayout = async () => {
      try {
        const layoutRef = projectFirestore
          .collection("property-layout-propdial")
          .doc(propertyLayoutId);
        const layoutSnap = await layoutRef.get();

        if (layoutSnap.exists) {
          const layoutData = layoutSnap.data();
          setPropertyId(layoutData.propertyId || "");
          setLayouts(layoutData.layouts || {});
          setUpdateInfo(layoutData.updateInformation || []);

          if (layoutData.propertyId) {
            fetchPropertyDetails(layoutData.propertyId);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching property layout:", error);
      }
    };

    if (propertyLayoutId) {
      fetchPropertyLayout();
    }
      // 👇 Ye line add kar:
  fetchFixtureOptions(); // Fixtures fetch hoga jab component mount hota hai
  }, [propertyLayoutId]);

  const fetchPropertyDetails = async (propId) => {
    try {
      const propRef = projectFirestore.collection("properties-propdial").doc(propId);
      const propSnap = await propRef.get();

      if (propSnap.exists) {
        const propertyData = propSnap.data();
        setPropertyDocument(propertyData);

        if (propertyData.layouts) {
          setLayouts(propertyData.layouts);
        }
      } else {
        console.log("Property document not found!");
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  };

    // Fetch fixtures from Firestore
    const defaultFixtures = [
      "Walls",
      "⁠Roof",
      "⁠Floor",
      "⁠Switches & Sockets", 
    ];
    
    const fetchFixtureOptions = async () => {
      try {
        const fixtureRef = projectFirestore.collection("m_fixtures").doc("6jEq6BbUQiEOFPUGoEKJ");
        const fixtureSnap = await fixtureRef.get();
    
        if (fixtureSnap.exists) {
          const fixturesFromDB = fixtureSnap.data().fixtures || [];
    
          // Merge DB and default options without duplicates
          const mergedFixtures = Array.from(new Set([...fixturesFromDB, ...defaultFixtures]));
    
          // Sort A-Z
          const sortedFixtures = mergedFixtures.sort((a, b) => a.localeCompare(b));
    
          // Set for React Select
          setFixtureOptions(sortedFixtures.map((fixture) => ({ value: fixture, label: fixture })));
        }
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      }
    };
    

  const toggleField = (key) => {
    setOpenField((prev) => (prev === key ? null : key));
  };

  const handleChange = (roomKey, field, value) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      [roomKey]: {
        ...prevLayouts[roomKey],
        [field]: value,
      },
    }));
  };

   // Handle Multi-Select Fixtures Change
// Multi-Select Fixtures Change
const handleMultiSelectChange = (roomKey, selectedOptions) => {
  setLayouts((prevLayouts) => ({
    ...prevLayouts,
    [roomKey]: {
      ...prevLayouts[roomKey],
      fixtureBySelect: selectedOptions.map((option) => option.value), // New field in DB
    },
  }));
};

  const addFixture = (roomKey) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      [roomKey]: {
        ...prevLayouts[roomKey],
        fixtures: [...(prevLayouts[roomKey]?.fixtures || []), ""],
      },
    }));
  };

  const removeFixture = (roomKey, fixtureIndex) => {
    setLayouts((prevLayouts) => {
      const newFixtures = [...(prevLayouts[roomKey]?.fixtures || [])];
      newFixtures.splice(fixtureIndex, 1);
      return {
        ...prevLayouts,
        [roomKey]: {
          ...prevLayouts[roomKey],
          fixtures: newFixtures,
        },
      };
    });
  };

  const handleFixtureChange = (roomKey, fixtureIndex, value) => {
    setLayouts((prevLayouts) => {
      const newFixtures = [...(prevLayouts[roomKey]?.fixtures || [])];
      newFixtures[fixtureIndex] = value;
      return {
        ...prevLayouts,
        [roomKey]: {
          ...prevLayouts[roomKey],
          fixtures: newFixtures,
        },
      };
    });
  };

  const uploadImage = async (roomKey, file, onProgress) => {
    try {
      // compress
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });
  
      const storageRef = projectStorage.ref();

      const fileRef = storageRef.child(`property-layout/${propertyLayoutId}/${roomKey}/${file.name}`);
  
      const uploadTask = fileRef.put(compressedFile);
  
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await fileRef.getDownloadURL();
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };
  
  // const handleImageUpload = async (e, roomKey) => {
  //   const files = Array.from(e.target.files);
  //   const allowedTypes = ["image/jpeg", "image/png"];
  //   const existingImages = layouts[roomKey]?.images || [];
  
  //   if (existingImages.length + files.length > 5) {
  //     alert("You can only upload up to 5 images per room.");
  //     return;
  //   }
  
  //   const validImages = files.filter((file) => allowedTypes.includes(file.type));
  //   if (validImages.length !== files.length) {
  //     alert("Only JPG and PNG images are allowed.");
  //     return;
  //   }
  
  //   for (let file of validImages) {
  //     let progress = 0;
  //     const url = await uploadImage(roomKey, file, (p) => (progress = p));
  //     setLayouts((prev) => ({
  //       ...prev,
  //       [roomKey]: {
  //         ...prev[roomKey],
  //         images: [...(prev[roomKey]?.images || []), { url, name: file.name }],
  //       },
  //     }));
  //   }
  // };
  
  // const handleDeleteImage = (roomKey, index) => {
  //   const imageToDelete = layouts[roomKey]?.images?.[index];
  //   if (!imageToDelete) return;
  
  //   const fileRef = projectStorage.refFromURL(imageToDelete.url);

  //   fileRef
  //     .delete()
  //     .then(() => {
  //       const updatedImages = [...layouts[roomKey].images];
  //       updatedImages.splice(index, 1);
  //       setLayouts((prev) => ({
  //         ...prev,
  //         [roomKey]: {
  //           ...prev[roomKey],
  //           images: updatedImages,
  //         },
  //       }));
  //     })
  //     .catch((error) => console.error("Image delete error:", error));
  // };

  const handleImageUpload = async (e, roomKey) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const existingImages = layouts[roomKey]?.images || [];
  
    if (existingImages.length + files.length > 5) {
      alert("You can only upload up to 5 images per room.");
      return;
    }
  
    const validImages = files.filter((file) => allowedTypes.includes(file.type));
    if (validImages.length !== files.length) {
      alert("Only JPG and PNG images are allowed.");
      return;
    }
  
    for (let file of validImages) {
      let progress = 0;
      const url = await uploadImage(roomKey, file, (p) => (progress = p));
      const newImage = { url, name: file.name };
  
      // 1. ✅ Update local UI layout state
      setLayouts((prev) => ({
        ...prev,
        [roomKey]: {
          ...prev[roomKey],
          images: [...(prev[roomKey]?.images || []), newImage],
        },
      }));
  
      // 2. ✅ Update layout Firestore (already working)
      const layoutRef = projectFirestore.collection("property-layouts").doc(propertyLayoutId);
      await layoutRef.set(
        {
          [roomKey]: {
            images: firebase.firestore.FieldValue.arrayUnion(newImage),
          },
        },
        { merge: true }
      );
  
      // 3. 🔥 NEW: Also update in `properties-propdial` collection
      const propertyRef = projectFirestore.collection("properties-propdial").doc(propertyId);
      await propertyRef.set(
        {
          layoutImages: {
            [roomKey]: firebase.firestore.FieldValue.arrayUnion(newImage),
          },
        },
        { merge: true }
      );
    }
  };

  
  const handleDeleteImage = (roomKey, index) => {
    const imageToDelete = layouts[roomKey]?.images?.[index];
    if (!imageToDelete) return;
  
    const fileRef = projectStorage.refFromURL(imageToDelete.url);
  
    fileRef
      .delete()
      .then(async () => {
        const updatedImages = [...layouts[roomKey].images];
        updatedImages.splice(index, 1);
  
        // 1. UI Update
        setLayouts((prev) => ({
          ...prev,
          [roomKey]: {
            ...prev[roomKey],
            images: updatedImages,
          },
        }));
  
        // 2. Remove from `property-layouts`
        const layoutRef = projectFirestore.collection("property-layouts").doc(propertyLayoutId);
        await layoutRef.update({
          [`${roomKey}.images`]: firebase.firestore.FieldValue.arrayRemove(imageToDelete),
        });
  
        // 3. Remove from `properties-propdial`
        const propertyRef = projectFirestore.collection("properties-propdial").doc(propertyId);
        await propertyRef.update({
          [`layoutImages.${roomKey}`]: firebase.firestore.FieldValue.arrayRemove(imageToDelete),
        });
      })
      .catch((error) => console.error("Image delete error:", error));
  };
  

  const saveData = () => {
    const newUpdate = {
      updatedAt: new Date().toISOString(),
      updatedBy: "User123",
    };

    setUpdateInfo([...updateInfo, newUpdate]);

    const finalData = {
      layouts,
      updatedAt: newUpdate.updatedAt,
      updatedBy: newUpdate.updatedBy,
      updateInformation: [...updateInfo, newUpdate],
    };

    projectFirestore.collection("property-layout-propdial").doc(propertyLayoutId).update(finalData)
      .then(() => console.log("Data saved!"))
      .catch((error) => console.error("Error saving data:", error));
  };

  return (
    <div className="pg_min_height">
      <ScrollToTop />
      <div className="top_header_pg pg_bg add_inspection_pg">
        <div className="page_spacing pg_min_height">
          {/* <h2>Hello {propertyLayoutId}</h2> */}
          {/* <p>Property ID: {propertyId}</p> */}

          <div className="page_layout_container" style={{ display: "flex", flexDirection: "column" }}>
            {/* <div className="rooms_container" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {propertyDocument &&
                [
                  { key: "Bedrooms", count: propertyDocument.numberOfBedrooms },
                  { key: "Bathrooms", count: propertyDocument.numberOfBathrooms },
                  { key: "Kitchens", count: propertyDocument.numberOfKitchen },
                  { key: "Balconies", count: propertyDocument.numberOfBalcony },
                  { key: "Additional Rooms", count: propertyDocument.additionalRooms },
                  { key: "Additional Area", count: propertyDocument.additionalArea },
                   
                  { key: "Living & Dining", count: propertyDocument.livingAndDining === "Yes" ? 1 : 0 },
                  { key: "Living Area", count: propertyDocument.livingArea === "Yes" ? 1 : 0 },
                  { key: "Dining Area", count: propertyDocument.diningArea === "Yes" ? 1 : 0 },
                  { key: "Entrance Gallery", count: propertyDocument.entranceGallery === "Yes" ? 1 : 0 },
                  { key: "Passage", count: propertyDocument.passage === "Yes" ? 1 : 0 },
                ].map((room) =>
                  room.count > 0 &&
                  [...Array(room.count)].map((_, index) => {
                    const roomKey = `${room.key}${index + 1}`;
                    return (
                      <div key={roomKey}>
                        <div
                          onClick={() => toggleField(roomKey)}
                          style={{
                            padding: "10px 15px",
                            border: "1px solid black",
                            cursor: "pointer",
                            backgroundColor: openField === roomKey ? "#ddd" : "#fff",
                          }}
                        >
                          {room.count === 1 ? room.key : `${room.key} ${index + 1}`}
                        </div>
                      </div>
                    );
                  })
                )}
            </div> */}
<div
  className="rooms_container"
  style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
>
  {propertyDocument && [
    { key: "Bedroom", count: propertyDocument.numberOfBedrooms },
    { key: "Bathroom", count: propertyDocument.numberOfBathrooms },
    { key: "Kitchen", count: propertyDocument.numberOfKitchen },
    { key: "Balcony", count: propertyDocument.numberOfBalcony },

    // ✅ Convert additionalRooms array to objects
    ...(propertyDocument.additionalRooms || []).map((roomName, index) => ({
      key: roomName,
      count: 1,
      customKey: `AdditionalRoom${index + 1}`,
    })),

    // ✅ Convert additionalArea array to objects
    ...(propertyDocument.additionalArea || []).map((areaName, index) => ({
      key: areaName,
      count: 1,
      customKey: `AdditionalArea${index + 1}`,
    })),

    { key: "Living & Dining", count: propertyDocument.livingAndDining === "Yes" ? 1 : 0 },
    { key: "Living Area", count: propertyDocument.livingArea === "Yes" ? 1 : 0 },
    { key: "Dining Area", count: propertyDocument.diningArea === "Yes" ? 1 : 0 },
    { key: "Entrance Gallery", count: propertyDocument.entranceGallery === "Yes" ? 1 : 0 },
    { key: "Passage", count: propertyDocument.passage === "Yes" ? 1 : 0 },
  ]
    .filter((room) => room.count > 0)
    .map((room) =>
      [...Array(room.count)].map((_, index) => {
        const roomKey = room.customKey || `${room.key}${index + 1}`;
        return (
          <div key={roomKey}>
            <div
              onClick={() => toggleField(roomKey)}
              style={{
                padding: "10px 15px",
                border: "1px solid black",
                cursor: "pointer",
                backgroundColor: openField === roomKey ? "#ddd" : "#fff",
              }}
            >
              {room.count === 1 ? room.key : `${room.key} ${index + 1}`}
            </div>
          </div>
        );
      })
    )}
</div>

            {openField && (
              <div className="fields_container" style={{ marginTop: "10px", border: "1px solid #ccc", padding: "10px", width: "100%" }}>
                <h3>{openField}</h3>
                <input type="text" placeholder="Room Name" value={layouts[openField]?.roomName || ""} onChange={(e) => handleChange(openField, "roomName", e.target.value)} />
                <input type="text" placeholder="Room remark" value={layouts[openField]?.remarks || ""} onChange={(e) => handleChange(openField, "remarks", e.target.value)} />
                <input type="number" placeholder="Length" value={layouts[openField]?.length || ""} onChange={(e) => handleChange(openField, "length", e.target.value)} />
                <input type="number" placeholder="Width" value={layouts[openField]?.width || ""} onChange={(e) => handleChange(openField, "width", e.target.value)} />
                

                {/* Fixtures Section */}
                <br /><br />
                <div className="d-flex" style={{
                  gap: "10px",
                }}>
                  <h4>Fixtures</h4>
                  {layouts[openField]?.fixtures?.map((fixture, index) => (
                    <div key={index}>
                      <input type="text" value={fixture} onChange={(e) => handleFixtureChange(openField, index, e.target.value)} />
                      <button onClick={() => removeFixture(openField, index)}>Remove</button>
                    </div>
                  ))}
                  <button onClick={() => addFixture(openField)}>Add Fixture</button>
                </div>
                <br /><br />
             {/* Fixtures Multi-Select */}
             <div>
                  <h4>Fixtures (Multi-Select)</h4>
                  {/* <Select
                    isMulti
                    options={fixtureOptions}
                    value={fixtureOptions.filter((option) =>
                      (layouts[openField]?.fixtureBySelect || []).includes(option.value)
                    )}
                    onChange={(selectedOptions) => handleMultiSelectChange(openField, selectedOptions)}
                  /> */}
                  <Select
  isMulti
  options={fixtureOptions}
  value={
    fixtureOptions.filter((option) =>
      (layouts[openField]?.fixtureBySelect?.length
        ? layouts[openField].fixtureBySelect
        : defaultFixtures
      ).includes(option.value)
    )
  }
  onChange={(selectedOptions) =>
    handleMultiSelectChange(openField, selectedOptions)
  }
/>

                </div>

                {/* Image Upload Section */}
{/* <div style={{ marginTop: "10px" }}>
<div style={{ marginTop: "10px" }}>
  <label>Upload Images (Max 5):</label>
  <input type="file" multiple accept="image/png, image/jpeg" onChange={(e) => handleImageUpload(e, openField)} />
</div>



</div>
<div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
  {(layouts[openField]?.images || []).map((img, index) => (
    <div key={index} style={{ position: "relative" }}>
      <img src={img.url} alt={img.name} style={{ width: "120px", height: "120px", objectFit: "cover" }} />
      <button
        onClick={() => handleDeleteImage(openField, index)}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "red",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  ))}
</div>  */}
 <br />
 upload images (max 5)
<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
  {layouts[openField]?.images?.map((image, index) => (
    <div key={index} style={{ position: "relative" }}>
      <img src={image.url} alt={`Uploaded ${index}`} width="100" height="100" />
      <button
        style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          background: "red",
          color: "white",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => handleDeleteImage(openField, index)}
      >
        X
      </button>
    </div>
  ))}

{(!layouts[openField]?.images || layouts[openField].images.length < 5) && (
  <label
    style={{
      width: "100px",
      height: "100px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "2px dashed gray",
      cursor: "pointer",
      fontSize: "30px",
    }}
  >
    +
    <input
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={(e) => handleImageUpload(e, openField)}
    />
  </label>
)}

</div>


              </div>
            )}
          </div>
<br />
          <button onClick={saveData} className="theme_btn btn_fill text-center w-100 no_icon">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyLayout;
