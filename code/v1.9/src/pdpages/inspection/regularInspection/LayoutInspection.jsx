// LayoutInspection.js
import React, { useState, useEffect, useCallback } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { projectFirestore, projectStorage, timestamp } from "../../../firebase/config";
import imageCompression from "browser-image-compression";
import firebase from 'firebase/compat/app';

const LayoutInspection = ({ propertyId, inspectionId, user }) => {
  const [rooms, setRooms] = useState([]);
  const [roomFixtures, setRoomFixtures] = useState({}); // {roomId: [fixtures]}
  const [inspectionData, setInspectionData] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);
  const [activeFixture, setActiveFixture] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [imageActionStatus, setImageActionStatus] = useState(null);
  const [layoutInspectionDone, setLayoutInspectionDone] = useState(false);

  // Fetch rooms and their fixtures
  useEffect(() => {
    if (!propertyId) return;

    const unsubscribe = projectFirestore
      .collection("property-layout-propdial")
      .where("propertyId", "==", propertyId)
      .onSnapshot(
        (snapshot) => {
          let roomsData = [];
          let fixturesByRoom = {};
          
          snapshot.forEach((doc) => {
            const layouts = doc.data().layouts || {};
            
            Object.entries(layouts).forEach(([roomKey, roomValue]) => {
              const roomId = `${doc.id}_${roomKey}`;
              
              roomsData.push({
                id: roomId,
                roomName: roomValue.roomName || roomKey,
              });
              
              // Extract fixtures for this room
              if (roomValue.fixtureBySelect && Array.isArray(roomValue.fixtureBySelect)) {
                fixturesByRoom[roomId] = roomValue.fixtureBySelect.map(fixture => ({
                  id: `${roomId}_${fixture.replace(/\s+/g, '_')}`,
                  name: fixture,
                  status: "",
                  images: [],
                  remark: ""
                }));
              } else {
                fixturesByRoom[roomId] = [];
              }
            });
          });

          setRooms(roomsData);
          setRoomFixtures(fixturesByRoom);
          
          // Initialize inspection data
          setInspectionData((prevData) => {
            const newData = { ...prevData };
            roomsData.forEach((room) => {
              if (!newData[room.id]) {
                newData[room.id] = {
                  roomId: room.id,
                  roomName: room.roomName,
                  isAllowForInspection: "yes",
                  generalRemark: "",
                  fixtures: fixturesByRoom[room.id] || []
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

  const isAllLayoutInspectionDone = useCallback(() => {
    const allRoomsInspected = Object.values(inspectionData).every((room) => {
      if (room.isAllowForInspection === "no") {
        return Boolean(room.generalRemark);
      }

      // Check if all fixtures in this room are completed
      const allFixturesCompleted = room.fixtures?.every(fixture => 
        fixture.status && fixture.remark && fixture.images?.length > 0
      );

      return allFixturesCompleted;
    });

    if (layoutInspectionDone !== allRoomsInspected) {
      setLayoutInspectionDone(allRoomsInspected);
    }

    return allRoomsInspected;
  }, [inspectionData, layoutInspectionDone]);

  useEffect(() => {
    isAllLayoutInspectionDone();
  }, [inspectionData]);

  const handleImageUpload = async (e, roomId, fixtureId = null) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    let currentImages = [];
    if (fixtureId) {
      // Uploading for a specific fixture
      const fixture = inspectionData[roomId]?.fixtures?.find(f => f.id === fixtureId);
      currentImages = fixture?.images || [];
    } else {
      // Uploading for room general images
      currentImages = inspectionData[roomId]?.images || [];
    }

    const existingCount = currentImages.length;
    const remainingSlots = 10 - existingCount;
    const validFiles = files.slice(0, remainingSlots);

    for (const file of validFiles) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG and PNG files are allowed.");
        continue;
      }

      setImageActionStatus("uploading");

      try {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        const path = fixtureId 
          ? `inspection_images/${inspectionId}/${roomId}/${fixtureId}/${compressedFile.name}`
          : `inspection_images/${inspectionId}/${roomId}/${compressedFile.name}`;
        
        const storageRef = projectStorage.ref(path);
        const uploadTask = storageRef.put(compressedFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: progress,
              }));
            },
            (error) => {
              console.error("Upload error:", error);
              setImageActionStatus(null);
              reject(error);
            },
            async () => {
              try {
                const url = await storageRef.getDownloadURL();
                
                if (fixtureId) {
                  // Update fixture images
                  setInspectionData(prev => {
                    const updatedData = { ...prev };
                    const roomIndex = updatedData[roomId].fixtures.findIndex(f => f.id === fixtureId);
                    
                    if (roomIndex !== -1) {
                      updatedData[roomId].fixtures[roomIndex].images = [
                        ...(updatedData[roomId].fixtures[roomIndex].images || []),
                        { url, name: compressedFile.name }
                      ];
                    }
                    
                    return updatedData;
                  });
                } else {
                  // Update room general images
                  setInspectionData(prev => ({
                    ...prev,
                    [roomId]: {
                      ...prev[roomId],
                      images: [
                        ...(prev[roomId]?.images || []),
                        { url, name: compressedFile.name }
                      ],
                    }
                  }));
                }
                
                setUploadProgress((prev) => ({
                  ...prev,
                  [file.name]: 100,
                }));
                resolve();
              } catch (error) {
                console.error("Download URL error:", error);
                reject(error);
              } finally {
                setImageActionStatus(null);
              }
            }
          );
        });
      } catch (error) {
        console.error("Compression error:", error);
        setImageActionStatus(null);
      }
    }
  };

  const handleImageDelete = async (roomId, image, fixtureId = null) => {
    setImageActionStatus("deleting");
    const path = fixtureId
      ? `inspection_images/${inspectionId}/${roomId}/${fixtureId}/${image.name}`
      : `inspection_images/${inspectionId}/${roomId}/${image.name}`;
    
    const storageRef = projectStorage.ref(path);

    try {
      await storageRef.delete();
      
      if (fixtureId) {
        // Delete fixture image
        setInspectionData(prev => {
          const updatedData = { ...prev };
          const roomIndex = updatedData[roomId].fixtures.findIndex(f => f.id === fixtureId);
          
          if (roomIndex !== -1) {
            updatedData[roomId].fixtures[roomIndex].images = 
              updatedData[roomId].fixtures[roomIndex].images.filter(img => img.url !== image.url);
          }
          
          return updatedData;
        });
      } else {
        // Delete room image
        setInspectionData(prev => ({
          ...prev,
          [roomId]: {
            ...prev[roomId],
            images: prev[roomId]?.images?.filter(img => img.url !== image.url),
          }
        }));
      }
      
      setImageActionStatus(null);
    } catch (error) {
      console.error("Error deleting image:", error);
      setImageActionStatus(null);
    }
  };

  const handleChange = (roomId, field, value, fixtureId = null) => {
    setInspectionData((prev) => {
      const updatedData = { ...prev };
      
      if (fixtureId) {
        // Update fixture field
        const fixtureIndex = updatedData[roomId].fixtures.findIndex(f => f.id === fixtureId);
        if (fixtureIndex !== -1) {
          updatedData[roomId].fixtures[fixtureIndex][field] = value;
        }
      } else {
        // Update room field
        updatedData[roomId][field] = value;
      }
      
      return updatedData;
    });
  };

  const getRoomClass = (roomId) => {
    const room = inspectionData[roomId];
    let className = "room-button";

    if (room?.isAllowForInspection === "no") {
      className += " notallowed";
    } else {
      // Check if all fixtures in this room are completed
      const allFixturesCompleted = room?.fixtures?.every(fixture => 
        fixture.status && fixture.remark && fixture.images?.length > 0
      );

      if (allFixturesCompleted) className += " full";
      else if (room?.fixtures?.some(fixture => fixture.status || fixture.remark || fixture.images?.length > 0)) {
        className += " half";
      }
    }

    if (roomId === activeRoom) className += " active";
    return className;
  };

  const getFixtureClass = (roomId, fixtureId) => {
    const room = inspectionData[roomId];
    if (!room) return "fixture-button";
    
    const fixture = room.fixtures?.find(f => f.id === fixtureId);
    if (!fixture) return "fixture-button";
    
    let className = "fixture-button";
    
    if (fixture.status && fixture.remark && fixture.images?.length > 0) {
      className += " full";
    } else if (fixture.status || fixture.remark || fixture.images?.length > 0) {
      className += " half";
    }
    
    if (fixtureId === activeFixture) className += " active";
    
    return className;
  };

  const saveLayoutInspection = async () => {
    try {
      await projectFirestore
        .collection("inspections")
        .doc(inspectionId)
        .update({
          rooms: Object.values(inspectionData),
          lastUpdatedAt: timestamp.now(),
          lastUpdatedBy: user.phoneNumber,
          layoutInspectionDone,
          updatedInformation: firebase.firestore.FieldValue.arrayUnion({
            updatedAt: timestamp.now(),
            updatedBy: user.phoneNumber,
          }),
        });
      return true;
    } catch (error) {
      console.error("Error saving inspection:", error);
      return false;
    }
  };

  return {
    rooms,
    roomFixtures,
    inspectionData,
    activeRoom,
    setActiveRoom,
    activeFixture,
    setActiveFixture,
    layoutInspectionDone,
    handleImageUpload,
    handleImageDelete,
    handleChange,
    getRoomClass,
    getFixtureClass,
    saveLayoutInspection
  };
};

export default LayoutInspection;
