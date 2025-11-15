import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { projectFirestore, timestamp, projectStorage } from "../../../firebase/config";
import firebase from 'firebase/compat/app';
import { useDocument } from "../../../hooks/useDocument";
import imageCompression from "browser-image-compression";
import { ClipLoader } from "react-spinners";
import ScrollToTop from "../../../components/ScrollToTop";
import PropertySummaryCard from "../../property/PropertySummaryCard";
import IssueBasedInspectionSection from "./IssueBasedInspectionSection";
import ImageActionModal from "./ImageActionModal";
import SaveSuccessModal from "./SaveSuccessModal";
import FinalSubmitModal from "./FinalSubmitModal";

const IssueBasedInspection = () => {
  const { inspectionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // State management
  const [propertyRooms, setPropertyRooms] = useState([]); // Renamed from rooms to propertyRooms
  const [rooms, setRooms] = useState([]); // This will now store issues but named as rooms
  const [activeIssue, setActiveIssue] = useState(0); // Track active tab
  const [propertyId, setPropertyId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isDataSaving, setIsDataSaving] = useState(false);
  const [imageActionStatus, setImageActionStatus] = useState(null);
  const [finalSubmit, setFinalSubmit] = useState(false);
  const [finalSubmiting, setFinalSubmiting] = useState(false);
  const [afterSaveModal, setAfterSaveModal] = useState(false);
  const [propertydoc, setPropertyDoc] = useState(null);
  const [propertyerror, setPropertyError] = useState(null);
  const [inspectionType, setInspectionType] = useState("");
  const [inspectionDatabaseData, setInspectionDatabaseData] = useState(null);

  const { document: inspectionDocument, error: inspectionDocumentError } =
    useDocument("inspections", inspectionId);

  // Issue types
  const issueTypes = [
    "Damage",
    "Not Clean",
    "Seepage",
    "Termites",
    "Leakage",
    "Crack",
    "Peeling Paint",
    "Broken",
    "Stained",
    "Loose",
    "Missing",
    "Corroded",
    "Malfunctioning",
    "Worn Out",
    "Discolored"
  ];

  // Combined data fetching effect
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

            // Load existing rooms (previously issues)
            if (inspectionData.rooms) {
              setRooms(inspectionData.rooms);
            }

            setInspectionDatabaseData(inspectionData);
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

  // Property data effect
  useEffect(() => {
    if (!propertyId) return;

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

    return () => unsubscribe();
  }, [propertyId]);

  // Property rooms and fixtures data effect
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
              const fixtures = roomValue.fixtureBySelect || [];
              roomsData.push({
                id: `${doc.id}_${roomKey}`,
                roomName: roomValue.roomName || roomKey,
                fixtures: fixtures
              });
            });
          });

          setPropertyRooms(roomsData);
        },
        (error) => {
          console.error("Error fetching rooms:", error);
        }
      );

    return () => unsubscribe();
  }, [propertyId]); 

  // Get room status for database
  const getRoomStatusForDB = (room) => {
    if (!room) return "notstarted";

    const hasSomeData = room.roomId || room.fixture || room.issueType || room.explanation || (room.images?.length > 0);
    const isComplete = room.roomId && 
                      room.fixture && 
                      (room.fixture === 'other' ? true : room.issueType) && 
                      room.explanation && 
                      room.images?.length > 0;

    if (isComplete) return "full";
    else if (hasSomeData) return "half";
    else return "add";
  };

  // Get room status for tab display (UI only)
  const getRoomStatus = (room) => {
    return getRoomStatusForDB(room);
  };

  // Image handling functions for rooms
  const handleRoomImageUpload = async (e, roomIndex) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const existingCount = rooms[roomIndex]?.images?.length || 0;
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
          `inspection_images/${inspectionId}/rooms/${roomIndex}/${compressedFile.name}`
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
                setRooms(prev => {
                  const updatedRooms = [...prev];
                  const updatedRoom = { ...updatedRooms[roomIndex] };
                  
                  updatedRoom.images = [
                    ...(updatedRoom.images || []),
                    { url, name: compressedFile.name },
                  ];

                  // Auto-update inspectionStatus when images are added
                  updatedRoom.inspectionStatus = getRoomStatusForDB(updatedRoom);

                  updatedRooms[roomIndex] = updatedRoom;
                  return updatedRooms;
                });
                
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

  const handleRoomImageDelete = async (roomIndex, image) => {
    setImageActionStatus("deleting");
    const storageRef = projectStorage.ref(
      `inspection_images/${inspectionId}/rooms/${roomIndex}/${image.name}`
    );

    try {
      await storageRef.delete();
      setRooms(prev => {
        const updatedRooms = [...prev];
        const updatedRoom = { ...updatedRooms[roomIndex] };
        
        updatedRoom.images = updatedRoom.images?.filter((img) => img.url !== image.url) || [];
        
        // Auto-update inspectionStatus when images are removed
        updatedRoom.inspectionStatus = getRoomStatusForDB(updatedRoom);

        updatedRooms[roomIndex] = updatedRoom;
        return updatedRooms;
      });
      setImageActionStatus(null);
    } catch (error) {
      console.error("Error deleting image:", error);
      setImageActionStatus(null);
    }
  };

  // Room management functions
  const addNewRoom = () => {
    const newRoom = {
      roomId: "",
      roomName: "",
      fixture: "",
      issueType: "",
      explanation: "",
      images: [],
      inspectionStatus: "add", // Default status
      createdAt: timestamp.now()
    };
    
    setRooms(prev => [...prev, newRoom]);
    setActiveIssue(rooms.length); // Set active to the new room
  };

  const removeRoom = (index) => {
    setRooms(prev => prev.filter((_, i) => i !== index));
    
    // Adjust active room index after removal
    if (activeIssue >= index) {
      if (activeIssue === 0 && rooms.length === 1) {
        setActiveIssue(0); // Reset to first if only one remains
      } else if (activeIssue === index) {
        setActiveIssue(Math.max(0, index - 1)); // Move to previous room
      }
    }
  };

  const updateRoom = (index, field, value) => {
    setRooms(prev => {
      const updatedRooms = [...prev];
      const updatedRoom = {
        ...updatedRooms[index],
        [field]: value
      };

      // If room is changed, update roomName and reset fixture
      if (field === 'roomId') {
        const selectedPropertyRoom = propertyRooms.find(room => room.id === value);
        if (selectedPropertyRoom) {
          updatedRoom.roomName = selectedPropertyRoom.roomName;
          updatedRoom.fixture = ""; // Reset fixture when room changes
          updatedRoom.issueType = ""; // Reset issue type when room changes
        }
      }

      // Auto-update inspectionStatus when any field changes
      updatedRoom.inspectionStatus = getRoomStatusForDB(updatedRoom);

      updatedRooms[index] = updatedRoom;
      return updatedRooms;
    });
  };

  // Get fixtures for selected property room
  const getFixturesForPropertyRoom = (roomId) => {
    const room = propertyRooms.find(room => room.id === roomId);
    return room ? room.fixtures : [];
  };

  // Check if all required fields are filled for a room
  const isRoomComplete = (room) => {
    return room.roomId && 
           room.fixture && 
           (room.fixture === 'other' ? true : room.issueType) && 
           room.explanation && 
           room.images?.length > 0;
  };

  // Check if final submit is enabled
  const isFinalSubmitEnabled = () => {
    return rooms.length > 0 && rooms.every(isRoomComplete);
  };

  // Save functions
  const handleSave = async () => {
    setIsDataSaving(true);

    try {
      // Ensure all rooms have updated inspectionStatus before saving
      const roomsToSave = rooms.map(room => ({
        ...room,
        inspectionStatus: getRoomStatusForDB(room)
      }));

      await projectFirestore
        .collection("inspections")
        .doc(inspectionId)
        .update({
          rooms: roomsToSave,
          lastUpdatedAt: timestamp.now(),
          lastUpdatedBy: user.phoneNumber,
          updatedInformation: firebase.firestore.FieldValue.arrayUnion({
            updatedAt: timestamp.now(),
            updatedBy: user.phoneNumber,
          }),
        });
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
      // Ensure all rooms have updated inspectionStatus before final submit
      const roomsToSave = rooms.map(room => ({
        ...room,
        inspectionStatus: getRoomStatusForDB(room)
      }));

      await projectFirestore
        .collection("inspections")
        .doc(inspectionId)
        .update({
          rooms: roomsToSave,
          finalSubmit: true,
          updatedAt: timestamp.now(),
          updatedInformation: firebase.firestore.FieldValue.arrayUnion({
            updatedAt: timestamp.now(),
            updatedBy: user.phoneNumber,
          }),
        });

      // navigate(`/inspection-report/${inspectionId}`);
          navigate(`/inspection-report/${inspectionId}`, { replace: true });
    } catch (error) {
      console.error("Error in final submit:", error);
    } finally {
      setFinalSubmiting(false);
      setFinalSubmit(false);
    }
  };

  // Component rendering
  return (
    <>
      <ScrollToTop />
    
      <div className="full_inspection">
        {propertyId ? (
          <>
            <div className="row row_reverse_991">
              <div className="col-lg-6">
                <div className="title_card with_title mobile_full_575 mobile_gap h-100">
                  <h2 className="text-center">{inspectionType} Inspection</h2>
                </div>
              </div>
              <PropertySummaryCard
                propertydoc={propertydoc}
                propertyId={propertyId}
              />
            </div>

   {/* Issue Based Inspection Section */}
{!inspectionDatabaseData?.finalSubmit &&
            <IssueBasedInspectionSection
              rooms={rooms}
              activeIssue={activeIssue}
              setActiveIssue={setActiveIssue}
              propertyRooms={propertyRooms}
              issueTypes={issueTypes}
              addNewRoom={addNewRoom}
              removeRoom={removeRoom}
              updateRoom={updateRoom}
              getFixturesForPropertyRoom={getFixturesForPropertyRoom}
              getRoomStatus={getRoomStatus}
              handleRoomImageUpload={handleRoomImageUpload}
              handleRoomImageDelete={handleRoomImageDelete}
              isFinalSubmitEnabled={isFinalSubmitEnabled}
              inspectionDatabaseData={inspectionDatabaseData}
              setFinalSubmit={setFinalSubmit}
              handleSave={handleSave}
              isDataSaving={isDataSaving}
            />
}
         

            {/* Final Submit Button */}
            {/* {isFinalSubmitEnabled() && (
              <div className="bottom_fixed_button" style={{ zIndex: "99999" }}>
                <div className="next_btn_back">
                  <button
                    className="theme_btn no_icon btn_fill2 full_width"
                    onClick={() => setFinalSubmit(true)}
                  >
                    Final Submit
                  </button>
                </div>
              </div>
            )} */}
          </>
        ) : (
          <div className="page_loader">
            <ClipLoader color="var(--theme-green2)" loading={true} />
          </div>
        )}
      </div>

      {/* Modals */}
      <ImageActionModal imageActionStatus={imageActionStatus} />
      <SaveSuccessModal
        afterSaveModal={afterSaveModal}
        setAfterSaveModal={setAfterSaveModal}
      />
      <FinalSubmitModal
        finalSubmit={finalSubmit}
        setFinalSubmit={setFinalSubmit}
        handleFinalSubmit={handleFinalSubmit}
        finalSubmiting={finalSubmiting}
      />
    </>
  );
};

export default IssueBasedInspection;