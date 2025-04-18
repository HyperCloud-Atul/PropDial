import React, { useState, useEffect } from "react";
import ScrollToTop from "../ScrollToTop";
import Modal from "react-bootstrap/Modal";
import { ClipLoader, BarLoader } from "react-spinners";
import { useAuthContext } from "../../hooks/useAuthContext";
import PropertySummaryCard from "../../pdpages/property/PropertySummaryCard";
import { useParams } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import Select from "react-select";
import { projectStorage } from "../../firebase/config";
import { FaPlus, FaTrash, FaRetweet } from "react-icons/fa";
import imageCompression from "browser-image-compression";
import firebase from "firebase";

const AddPropertyLayout = () => {
  const { propertyLayoutId } = useParams();
  const { user } = useAuthContext();
  const [propertyId, setPropertyId] = useState("");
  const [propertyDocument, setPropertyDocument] = useState(null);
  const [afterSaveModal, setAfterSaveModal] = useState(false);
  const [isLayoutSaving, setIsLayoutSaving] = useState(false);
  const [openField, setOpenField] = useState(null);
  const [layouts, setLayouts] = useState({});
  const [updateInfo, setUpdateInfo] = useState([]);
  const [fixtureOptions, setFixtureOptions] = useState([]);
  const [imageActionStatus, setImageActionStatus] = useState(null);

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

  // const fetchPropertyDetails = async (propId) => {
  //   try {
  //     const propRef = projectFirestore
  //       .collection("properties-propdial")
  //       .doc(propId);
  //     const propSnap = await propRef.get();

  //     if (propSnap.exists) {
  //       const propertyData = propSnap.data();
  //       setPropertyDocument(propertyData);

  //       if (propertyData.layouts) {
  //         setLayouts(propertyData.layouts);
  //       }
  //     } else {
  //       console.log("Property document not found!");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching property details:", error);
  //   }
  // };

  const fetchPropertyDetails = (propId) => {
    const propRef = projectFirestore
      .collection("properties-propdial")
      .doc(propId);

    const unsubscribe = propRef.onSnapshot(
      (propSnap) => {
        if (propSnap.exists) {
          const propertyData = propSnap.data();
          setPropertyDocument(propertyData);

          if (propertyData.layouts) {
            setLayouts(propertyData.layouts);
          }
        } else {
          console.log("Property document not found!");
        }
      },
      (error) => {
        console.error("Error fetching property details:", error);
      }
    );

    // Optional: Return unsubscribe if you plan to cleanup later
  };

  // Fetch fixtures from Firestore
  const defaultFixtures = ["Walls", "Roof", "Floor", "Switches & Sockets"];

  // const fetchFixtureOptions = async () => {
  //   try {
  //     const fixtureRef = projectFirestore
  //       .collection("m_fixtures")
  //       .doc("6jEq6BbUQiEOFPUGoEKJ");
  //     const fixtureSnap = await fixtureRef.get();

  //     if (fixtureSnap.exists) {
  //       const fixturesFromDB = fixtureSnap.data().fixtures || [];

  //       // Merge DB and default options without duplicates
  //       const mergedFixtures = Array.from(
  //         new Set([...fixturesFromDB, ...defaultFixtures])
  //       );

  //       // Sort A-Z
  //       const sortedFixtures = mergedFixtures.sort((a, b) =>
  //         a.localeCompare(b)
  //       );

  //       // Set for React Select
  //       setFixtureOptions(
  //         sortedFixtures.map((fixture) => ({ value: fixture, label: fixture }))
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error fetching fixtures:", error);
  //   }
  // };

  const fetchFixtureOptions = () => {
    return projectFirestore
      .collection("m_fixtures")
      .limit(1)
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const fixtureDoc = snapshot.docs[0];
          const fixturesFromDB = fixtureDoc.data().fixtures || [];
  
          const mergedFixtures = Array.from(
            new Set([...fixturesFromDB, ...defaultFixtures])
          );
  
          const sortedFixtures = mergedFixtures.sort((a, b) =>
            a.localeCompare(b)
          );
  
          setFixtureOptions(
            sortedFixtures.map((fixture) => ({
              value: fixture,
              label: fixture,
            }))
          );
        }
      }, (error) => {
        console.error("Realtime fixture fetch error:", error);
      });
  };
  
  useEffect(() => {
    const unsubscribe = fetchFixtureOptions();
  
    return () => unsubscribe(); // clean up
  }, []);
  
  

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

  const flooringOptions = [
    { value: "Vitrified tiles", label: "Vitrified tiles" },
    { value: "Concrete", label: "Concrete" },
    { value: "Marble", label: "Marble" },
    { value: "Vinyl", label: "Vinyl" },
    { value: "Hardwood", label: "Hardwood" },
    { value: "Granite", label: "Granite" },
    { value: "Bamboo", label: "Bamboo" },
    { value: "Laminate", label: "Laminate" },
    { value: "Linoleum", label: "Linoleum" },
    { value: "Terrazzo", label: "Terrazzo" },
    { value: "Red Oxide", label: "Red Oxide" },
    { value: "Brick", label: "Brick" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const handleFlooringChange = (roomKey, selectedOption) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      [roomKey]: {
        ...prevLayouts[roomKey],
        flooringType: selectedOption.value,
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
    setImageActionStatus("uploading"); // Start upload status
    try {
      // compress
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });

      const storageRef = projectStorage.ref();

      const fileRef = storageRef.child(
        `property-layout/${propertyLayoutId}/${roomKey}/${file.name}`
      );

      const uploadTask = fileRef.put(compressedFile);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            setImageActionStatus(null); // Reset on error
            reject(error);
          },
          async () => {
            const downloadURL = await fileRef.getDownloadURL();
            setImageActionStatus(null); // Reset on success
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Image upload error:", error);
      setImageActionStatus(null); // Reset on outer catch
      throw error;
    }
  };

  const handleImageUpload = async (e, roomKey) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const existingImages = layouts[roomKey]?.images || [];

    if (existingImages.length + files.length > 5) {
      alert("You can only upload up to 5 images per room.");
      return;
    }

    const validImages = files.filter((file) =>
      allowedTypes.includes(file.type)
    );
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
      const layoutRef = projectFirestore
        .collection("property-layouts")
        .doc(propertyLayoutId);
      await layoutRef.set(
        {
          [roomKey]: {
            images: firebase.firestore.FieldValue.arrayUnion(newImage),
          },
        },
        { merge: true }
      );

      // 3. 🔥 NEW: Also update in `properties-propdial` collection
      const propertyRef = projectFirestore
        .collection("properties-propdial")
        .doc(propertyId);
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
    setImageActionStatus("deleting"); // Start delete status
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
        const layoutRef = projectFirestore
          .collection("property-layouts")
          .doc(propertyLayoutId);
        await layoutRef.update({
          [`${roomKey}.images`]:
            firebase.firestore.FieldValue.arrayRemove(imageToDelete),
        });

        // 3. Remove from `properties-propdial`
        const propertyRef = projectFirestore
          .collection("properties-propdial")
          .doc(propertyId);
        await propertyRef.update({
          [`layoutImages.${roomKey}`]:
            firebase.firestore.FieldValue.arrayRemove(imageToDelete),
        });
        setImageActionStatus(null); // ✅ Reset after success
      })
      .catch((error) => {
        console.error("Image delete error:", error);
        setImageActionStatus(null); // ✅ Reset even on error
      });
  };

  const saveData = () => {
    const newUpdate = {
      updatedAt: new Date().toISOString(),
      updatedBy: user && user.uid,
    };
    setIsLayoutSaving(true);
    setUpdateInfo([...updateInfo, newUpdate]);

    const finalData = {
      layouts,
      updatedAt: newUpdate.updatedAt,
      updatedBy: newUpdate.updatedBy,
      updateInformation: [...updateInfo, newUpdate],
    };

    projectFirestore
      .collection("property-layout-propdial")
      .doc(propertyLayoutId)
      .update(finalData)
      .then(() => {
        console.log("Data saved!");
        setAfterSaveModal(true);
        setIsLayoutSaving(false);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        setIsLayoutSaving(false);
      });
  };

  return (
      
      <div className="top_header_pg pg_bg add_inspection_pg add_layout_pg">
      <ScrollToTop />
        <div className="page_spacing pg_min_height">
          {propertyId ? (
            <>
              <div className="row row_reverse_991">
                <div className="col-lg-6">
                  <div className="title_card with_title mobile_full_575 mobile_gap h-100">
                    <h2 className="text-center">Property Layout</h2>
                  </div>
                </div>
                <PropertySummaryCard
                  propertydoc={propertyDocument}
                  propertyId={propertyId}
                />
              </div>
              <div className="room-buttons">
                {propertyDocument &&
                  [
                    {
                      key: "Bedroom",
                      count: propertyDocument.numberOfBedrooms,
                    },
                    {
                      key: "Bathroom",
                      count: propertyDocument.numberOfBathrooms,
                    },
                    { key: "Kitchen", count: propertyDocument.numberOfKitchen },
                    { key: "Balcony", count: propertyDocument.numberOfBalcony },

                    // ✅ Convert additionalRooms array to objects
                    ...(propertyDocument.additionalRooms || []).map(
                      (roomName, index) => ({
                        key: roomName,
                        count: 1,
                        customKey: `AdditionalRoom${index + 1}`,
                      })
                    ),

                    // ✅ Convert additionalArea array to objects
                    ...(propertyDocument.additionalArea || []).map(
                      (areaName, index) => ({
                        key: areaName,
                        count: 1,
                        customKey: `AdditionalArea${index + 1}`,
                      })
                    ),

                    {
                      key: "Living & Dining",
                      count: propertyDocument.livingAndDining === "Yes" ? 1 : 0,
                    },
                    {
                      key: "Living Area",
                      count: propertyDocument.livingArea === "Yes" ? 1 : 0,
                    },
                    {
                      key: "Dining Area",
                      count: propertyDocument.diningArea === "Yes" ? 1 : 0,
                    },
                    {
                      key: "Entrance Gallery",
                      count: propertyDocument.entranceGallery === "Yes" ? 1 : 0,
                    },
                    {
                      key: "Passage",
                      count: propertyDocument.passage === "Yes" ? 1 : 0,
                    },
                  ]
                    .filter((room) => room.count > 0)
                    .map((room) =>
                      [...Array(room.count)].map((_, index) => {
                        const roomKey =
                          room.customKey || `${room.key}${index + 1}`;
                        return (
                          <button
                            key={roomKey}
                            onClick={() => toggleField(roomKey)}
                            className={`room-button ${
                              openField === roomKey ? "active" : ""
                            }`}
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
                                {/* <div className="bi_icon half">
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
                            <div className="bi_icon notallowed">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#FA6262"
                              >
                                <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z" />
                              </svg>
                            </div> */}
                              </div>
                              <div className="btn_text">
                            {/* <h6 className="add">{layouts[roomKey]?.roomName}</h6> */}
                            {/* <h6 className="half">In Progress</h6>
                            <h6 className="full">Completed</h6>
                            <h6 className="notallowed">Not Allowed</h6> */}
                          </div>
                            </div>
                            <div className="room_name mt-2">
                              {" "}
                            {layouts[roomKey]?.roomName ? layouts[roomKey]?.roomName : room.count === 1
                                ? room.key
                                : `${room.key} ${index + 1}` }
                              {/* {room.count === 1
                                ? room.key
                                : `${room.key} ${index + 1}`} */}
                            </div>
                            <div className="room_name_new">
                              
                            </div>
                          </button>
                        );
                      })
                    )}
              </div>
              <div className="vg22"></div>
              {openField && (
                <div>
                  {/* plz don,t remove this commented code  */}
                  {/* <h3>{openField}</h3> */}
                  <form className="add_inspection_form">
                    <div className="aai_form">
                      <div className="row row_gap_20">
                        <div className="col-xl-6 col-md-4">
                          <div className="form_field w-100 aai_form_field">
                            <h6 className="aaiff_title">Room Name</h6>
                            <div className="field_box w-100">
                              <input
                                type="text"
                                placeholder="Enter room name"
                                className="w-100"
                                value={layouts[openField]?.roomName || ""}
                                onChange={(e) =>
                                  handleChange(
                                    openField,
                                    "roomName",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-4">
                          <div className="form_field w-100 aai_form_field">
                            <h6 className="aaiff_title">
                              Room Lenght <span>(In feet)</span>
                            </h6>
                            <div className="field_box w-100 unit_field">
                              {/* <input
                                type="number"
                                className="w-100"
                                placeholder="Enter room length"
                                value={layouts[openField]?.length || ""}
                                onChange={(e) =>
                                  handleChange(
                                    openField,
                                    "length",
                                    e.target.value
                                  )
                                }
                              /> */}
                            <input
  type="number"
  step="0.01"
  className="w-100"
  placeholder="Enter room length"
  value={layouts[openField]?.length || ""}
  onInput={(e) => {
    const value = e.target.value;
    const regex = /^\d{0,2}(\.\d{0,2})?$/; // max 2 digits before & after decimal

    if (!regex.test(value)) {
      e.target.value = layouts[openField]?.length || "";
      return;
    }

    handleChange(openField, "length", value);
  }}
/>


                              <div className="unit">Ft</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-4">
                          <div className="form_field w-100 aai_form_field">
                            <h6 className="aaiff_title">
                              Room Width <span>(In feet)</span>
                            </h6>
                            <div className="field_box w-100 unit_field">
                              {/* <input
                                type="number"
                                placeholder="Enter room width"
                                className="w-100"
                                value={layouts[openField]?.width || ""}
                                onChange={(e) =>
                                  handleChange(
                                    openField,
                                    "width",
                                    e.target.value
                                  )
                                }
                              /> */}
                              <input
                                type="number"
                                step="0.01"
                                className="w-100"
                                placeholder="Enter room width"
                                value={layouts[openField]?.width || ""}
                                onInput={(e) => {
                                  const value = e.target.value;
                                  
                                  const regex = /^\d{0,2}(\.\d{0,2})?$/; // max 2 digits before & after decimal
                                  if (!regex.test(value)) {
                                    e.target.value =
                                      layouts[openField]?.width || "";
                                    return;
                                  }
                                  handleChange(openField, "width", value);
                                }}
                              />

                              <div className="unit">Ft</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form_field w-100 aai_form_field">
                            <h6 className="aaiff_title">Room Remark</h6>
                            <div className="field_box w-100">
                              <textarea
                                type="text"
                                placeholder="Enter room remark"
                                className="w-100"
                                value={layouts[openField]?.remarks || ""}
                                onChange={(e) =>
                                  handleChange(
                                    openField,
                                    "remarks",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form_field w-100 aai_form_field">
                            <h6 className="aaiff_title">Fixtures</h6>
                            <div className="field_box w-100">
                              <Select
                                isMulti
                                options={fixtureOptions}
                                value={fixtureOptions.filter((option) =>
                                  (layouts[openField]?.fixtureBySelect?.length
                                    ? layouts[openField].fixtureBySelect
                                    : defaultFixtures
                                  ).includes(option.value)
                                )}
                                onChange={(selectedOptions) =>
                                  handleMultiSelectChange(
                                    openField,
                                    selectedOptions
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form_field w-100 aai_form_field">
                            <h6 className="aaiff_title">Flooring Type</h6>
                            <div className="field_box w-100">
                              <Select
                                options={flooringOptions}
                                value={
                                  layouts[openField]?.flooringType
                                    ? {
                                        value: layouts[openField]?.flooringType,
                                        label: layouts[openField]?.flooringType,
                                      }
                                    : null
                                }
                                onChange={(selectedOption) =>
                                  handleFlooringChange(
                                    openField,
                                    selectedOption
                                  )
                                }
                                placeholder="Select flooring type"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form_field w-100 aai_form_field">
                            <h6 className="aaiff_title">Upload images <span>(Maximum 5)</span></h6>
                            <div className="add_and_images">
                              {layouts[openField]?.images?.map(
                                (image, index) => (
                                  <div
                                    key={index}
                                    className="uploaded_images relative"
                                  >
                                    <img
                                      src={image.url}
                                      alt={`Uploaded ${index}`}
                                    />
                                    <div className="trash_icon">
                                      <FaTrash
                                        size={14}
                                        color="red"
                                        onClick={() =>
                                          handleDeleteImage(openField, index)
                                        }
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                              {/*                                                   
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
                                                    </div> */}
                              {(!layouts[openField]?.images ||
                                layouts[openField].images.length < 5) && (
                                <label className="add_icon">
                                  <FaPlus size={24} color="#555" />

                                  <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={(e) =>
                                      handleImageUpload(e, openField)
                                    }
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div
                className="bottom_fixed_button"
                style={{
                  zIndex: "1000",
                }}
              >
                <div className="next_btn_back">
                  <button
                    className="theme_btn no_icon btn_fill full_width"
                    onClick={saveData}
                    disabled={isLayoutSaving}
                    style={{
                      opacity: isLayoutSaving ? "0.5" : "1",
                    }}
                  >
                    {isLayoutSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
                  {/* plz don't delete this commented section  */}
                  {/* add Fixtures Section */}
                  {/* <div
                    className="d-flex"
                    style={{
                      gap: "10px",
                    }}
                  >
                    <h4>Fixtures</h4>
                    {layouts[openField]?.fixtures?.map((fixture, index) => (
                      <div key={index}>
                        <input
                          type="text"
                          value={fixture}
                          onChange={(e) =>
                            handleFixtureChange(
                              openField,
                              index,
                              e.target.value
                            )
                          }
                        />
                        <button onClick={() => removeFixture(openField, index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addFixture(openField)}>
                      Add Fixture
                    </button>
                  </div> */}
                  {/* Fixtures Multi-Select */}
                </div>
                
              )}
           
              {/* image upload modal  */}
              <Modal
                show={imageActionStatus !== null}
                centered
                className="uploading_modal"
              >
                <h6
                  style={{
                    color:
                      imageActionStatus === "uploading"
                        ? "var(--theme-green2)"
                        : imageActionStatus === "deleting"
                        ? "var(--theme-red)"
                        : "var(--theme-blue)", // Default fallback color
                  }}
                >
                  {imageActionStatus === "uploading"
                    ? "Uploading..."
                    : "Deleting..."}
                </h6>

                <BarLoader
                  color={
                    imageActionStatus === "uploading"
                      ? "var(--theme-green2)"
                      : imageActionStatus === "deleting"
                      ? "var(--theme-red)"
                      : "var(--theme-blue)" // Default fallback color
                  }
                  loading={true}
                  height={10}
                />
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

                <div
                  className="theme_btn btn_border w-100 no_icon text-center mb-4 mt-4"
                  onClick={() => setAfterSaveModal(false)}
                >
                  Okay
                </div>
              </Modal>
            </>
          ) : (
            <div className="page_loader">
              <ClipLoader color="var(--theme-green2)" loading={true} />
            </div>
          )}
        </div>
      </div>
  );
};

export default AddPropertyLayout;
