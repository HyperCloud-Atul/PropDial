// LayoutInspection.js
import React, { useState, useEffect, useCallback } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { projectFirestore, projectStorage, timestamp } from "../../../firebase/config";
import imageCompression from "browser-image-compression";
import firebase from 'firebase/compat/app';
const LayoutInspection = ({ propertyId, inspectionId, user }) => {
  const [rooms, setRooms] = useState([]);
  const [inspectionData, setInspectionData] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [imageActionStatus, setImageActionStatus] = useState(null);
  const [layoutInspectionDone, setLayoutInspectionDone] = useState(false);

  useEffect(() => {
    if (!propertyId) return;

    const unsubscribe = projectFirestore
      .collection("property-layout-propdial")
      .where("propertyId", "==", propertyId)
      .onSnapshot(
        (snapshot) => {
          let roomsData = [];
          snapshot.forEach((doc) => {
            const layouts = doc.data().layouts || {};
            Object.entries(layouts).forEach(([roomKey, roomValue]) => {
              roomsData.push({
                id: `${doc.id}_${roomKey}`,
                roomName: roomValue.roomName || roomKey,
              });
            });
          });

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
                  thisLayoutUpdateAt: timestamp.now(),
                  otherIssue: "",
                  otherIssueRemark: "",
                  generalRemark: "",
                  cleanRemark: "",
                  isAllowForInspection: "yes",
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

      return (
        Boolean(room.seepage) &&
        Boolean(room.termites) &&
        Boolean(room.otherIssue) &&
        Boolean(room.seepageRemark) &&
        Boolean(room.termitesRemark) &&
        Boolean(room.otherIssueRemark) &&
        Boolean(room.cleanRemark) &&
        room.images?.length > 0
      );
    });

    if (layoutInspectionDone !== allRoomsInspected) {
      setLayoutInspectionDone(allRoomsInspected);
    }

    return allRoomsInspected;
  }, [inspectionData, layoutInspectionDone]);

  useEffect(() => {
    isAllLayoutInspectionDone();
  }, [inspectionData]);

  const handleImageUpload = async (e, roomId) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const existingCount = inspectionData[roomId]?.images?.length || 0;
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
        const storageRef = projectStorage.ref(
          `inspection_images/${inspectionId}/${roomId}/${compressedFile.name}`
        );
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

  const handleImageDelete = async (roomId, image) => {
    setImageActionStatus("deleting");
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
      setImageActionStatus(null);
    } catch (error) {
      console.error("Error deleting image:", error);
      setImageActionStatus(null);
    }
  };

  const handleChange = (roomId, field, value) => {
    setInspectionData((prev) => {
      const updatedRoomData = {
        ...prev[roomId],
        [field]: value,
      };
      
      if (field === "seepage" || field === "termites" || field === "otherIssue") {
        const remarkField = `${field}Remark`;
        if (value === "no") {
          updatedRoomData[remarkField] = "There is no issue";
        } else if (value === "yes") {
          updatedRoomData[remarkField] = "";
        }
      }

      return {
        ...prev,
        [roomId]: updatedRoomData,
      };
    });
  };

  const getRoomClass = (roomId, field) => {
    const room = inspectionData[roomId];
    let className = "room-button";

    if (room.isAllowForInspection === "no") {
      className += " notallowed";
    } else {
      const filledFields = [
        room.seepage,
        room.seepageRemark,
        room.termites,
        room.termitesRemark,
        room.otherIssue,
        room.otherIssueRemark,
        room.cleanRemark,
        room.images?.length > 0,
      ].filter(Boolean).length;

      if (filledFields === 8) className += " full";
      else if (filledFields > 0) className += " half";

      if (room[field]) {
        className += ` filled`;
      } else {
        className += ` notfilled`;
      }
    }

    if (roomId === activeRoom) className += " active";
    return className;
  };

  const getFieldClass = (roomId, field) => {
    const roomData = inspectionData?.[roomId] || {};
    if (field === "image") {
      return roomData.images && roomData.images.length > 0 ? "filled" : "notfilled";
    }
    return roomData[field] && roomData[field].trim() !== "" ? "filled" : "notfilled";
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
    inspectionData,
    activeRoom,
    setActiveRoom,
    layoutInspectionDone,
    handleImageUpload,
    handleImageDelete,
    handleChange,
    getRoomClass,
    getFieldClass,
    saveLayoutInspection
  };
};

export default LayoutInspection;