// this is new code with the help of deepseeker ai
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { BarLoader, ClipLoader } from "react-spinners";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { projectFirestore, timestamp, projectStorage } from "../../../firebase/config";
import firebase from 'firebase/compat/app';
import { useDocument } from "../../../hooks/useDocument";
import imageCompression from "browser-image-compression";
import { FaPlus, FaTrash, FaRetweet } from "react-icons/fa";
import ScrollToTop from "../../../components/ScrollToTop";
import PropertySummaryCard from "../../property/PropertySummaryCard";

const AddInspection = () => {
  const { inspectionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // State management
  const [rooms, setRooms] = useState([]);
  const [inspectionData, setInspectionData] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);
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
  const [activeInspection, setActiveInspection] = useState("layout");
  const [layoutInspectionDone, setLayoutInspectionDone] = useState(false);

  // Bill inspection state
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isBillAvailable, setIsBillAvailable] = useState(null);
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [isBillDataSaving, setIsBillDataSaving] = useState(false);
  const [billInspectionData, setBillInspectionData] = useState({});
  const [allBillInspectionComplete, setAllBillInspectionComplete] = useState(false);
  const [inspectionDatabaseData, setInspectionDatabaseData] = useState(null);

  const { document: inspectionDocument, error: inspectionDocumentError } =
    useDocument("inspections", inspectionId);

  // Memoized values
  const currentRoomData = useMemo(() =>
    inspectionData[activeRoom] || {},
    [inspectionData, activeRoom]
  );

  const currentBillData = useMemo(() =>
    selectedBill ? billInspectionData[selectedBill.id] || {} : {},
    [billInspectionData, selectedBill]
  );

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

            if (inspectionData.rooms) {
              const formattedRooms = {};
              inspectionData.rooms.forEach((room) => {
                formattedRooms[room.roomId] = room;
              });
              setInspectionData(formattedRooms);
            }

            if (inspectionData.bills) {
              setBillInspectionData(inspectionData.bills);
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

  // Rooms data effect
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

  // Bills data effect
  useEffect(() => {
    if (!propertyId || !inspectionId) return;

    const fetchBills = async () => {
      try {
        const billsSnapshot = await projectFirestore
          .collection("utilityBills-propdial")
          .where("propertyId", "==", propertyId)
          .get();

        const billsData = billsSnapshot.docs.map((doc) => ({
          id: doc.id,
          billDocId: doc.id,
          billType: doc.data().billType,
          billId: doc.data().billId,
          authorityName: doc.data().authorityName,
          billWebsiteLink: doc.data().billWebsiteLink,
        }));

        setBills(billsData);
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };

    fetchBills();
  }, [propertyId, inspectionId]);

  // Layout inspection completion check
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
  }, [inspectionData, isAllLayoutInspectionDone]);

  // Bill inspection completion check
  useEffect(() => {
    const allBillInspectionFull = bills.length > 0 &&
      bills.every((bill) => {
        const billData = billInspectionData[bill.id] || {};
        return billData.amount && billData.remark;
      });

    setAllBillInspectionComplete(allBillInspectionFull);
  }, [bills, billInspectionData]);

  // Final submit redirect
  useEffect(() => {
    if (inspectionDocument?.finalSubmit) {
      navigate(`/inspection/${propertyId}`);
    }
  }, [inspectionDocument?.finalSubmit, navigate, propertyId]);

  // Image handling functions
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

  // Form handling functions
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

  // UI helper functions
  const getRoomClass = (roomId) => {
    const room = inspectionData[roomId];
    if (!room) return "room-button";

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
    }

    if (roomId === activeRoom) className += " active";

    return className;
  };

  const getFieldClass = (roomId, field) => {
    const roomData = inspectionData[roomId] || {};

    if (field === "image") {
      return roomData.images && roomData.images.length > 0 ? "filled" : "notfilled";
    }

    return roomData[field] && roomData[field].trim() !== "" ? "filled" : "notfilled";
  };

  const isFinalSubmitEnabled = () => {
    return (
      allBillInspectionComplete &&
      Object.values(inspectionData).every((room) => {
        if (room.isAllowForInspection === "no") {
          return room.generalRemark;
        }

        return (
          room.seepage &&
          room.termites &&
          room.otherIssue &&
          room.seepageRemark &&
          room.termitesRemark &&
          room.otherIssueRemark &&
          room.cleanRemark &&
          room.images?.length > 0
        );
      })
    );
  };

  // Bill inspection functions
  const handleBillTypeClick = (bill) => {
    if (selectedBill?.id === bill.id) return;

    setSelectedBill(bill);
    const billData = billInspectionData[bill.id] || {};
    setIsBillAvailable(billData.isBillAvailable ?? null);
    setAmount(billData.amount || "");
    setRemark(billData.remark || "");
  };

  useEffect(() => {
    if (!selectedBill) return;

    setBillInspectionData((prevData) => ({
      ...prevData,
      [selectedBill.id]: {
        ...(prevData[selectedBill.id] || {}),
        isBillAvailable,
        amount,
        remark,
      },
    }));
  }, [isBillAvailable, amount, remark, selectedBill]);

  const getBillButtonClass = (bill) => {
    const billData = billInspectionData[bill.id] || {};
    const amountValid = billData.amount && billData.amount;
    const hasRemark = billData.remark && billData.remark.trim() !== "";
    const isAllFieldsFilled = amountValid && hasRemark;
    const isAnyFieldFilled = amountValid || hasRemark;

    let className = "room-button";

    if (isAllFieldsFilled) className += " full";
    else if (isAnyFieldFilled) className += " half";

    if (selectedBill?.id === bill.id) className += " active";

    return className;
  };

  const getBillFieldClass = (billId, field) => {
    const billData = billInspectionData[billId] || {};
    return billData[field] && billData[field].trim() !== "" ? "filled" : "notfilled";
  };

  const handleBillImageUpload = async (e, billId) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG and PNG files are allowed.");
      return;
    }

    try {
      setImageActionStatus("uploading");

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });

      const filePath = `billImages/${billId}-${Date.now()}`;
      const storageRef = projectStorage.ref(filePath);
      const uploadTask = storageRef.put(compressedFile);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error);
          setImageActionStatus(null);
        },
        async () => {
          try {
            const url = await storageRef.getDownloadURL();
            setBillInspectionData((prevData) => ({
              ...prevData,
              [billId]: {
                ...(prevData[billId] || {}),
                imageUrl: url,
              },
            }));
            setImageActionStatus(null);
          } catch (error) {
            console.error("Error getting download URL:", error);
            setImageActionStatus(null);
          }
        }
      );
    } catch (error) {
      console.error("Image compression error:", error);
      setImageActionStatus(null);
    }
  };

  const handleBillImageDelete = async (billId) => {
    const billData = billInspectionData[billId];
    const imageUrl = billData?.imageUrl;
    if (!imageUrl) return;

    try {
      setImageActionStatus("deleting");

      const filePath = decodeURIComponent(
        imageUrl.split("/").slice(-1)[0].split("?")[0]
      );
      const storageRef = projectStorage.ref(filePath);
      await storageRef.delete();

      setBillInspectionData((prevData) => ({
        ...prevData,
        [billId]: {
          ...(prevData[billId] || {}),
          imageUrl: "",
        },
      }));

      setImageActionStatus(null);
    } catch (error) {
      console.error("Error deleting image:", error);
      setImageActionStatus(null);
    }
  };

  // Save functions
  const handleSave = async () => {
    setIsDataSaving(true);

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
      setAfterSaveModal(true);
    } catch (error) {
      console.error("Error saving inspection:", error);
    } finally {
      setIsDataSaving(false);
    }
  };

  const handleSaveBill = async () => {
    if (!bills.length) return;

    setIsBillDataSaving(true);

    try {
      const updatedBills = { ...billInspectionData };

      bills.forEach((bill) => {
        const prevBillData = billInspectionData[bill.id] || {};
        const newBillData = {
          billId: bill.billId,
          billDocId: bill.billDocId,
          billType: bill.billType,
          authorityName: bill.authorityName,
          billWebsiteLink: bill.billWebsiteLink,
        };

        const changedFields = {};
        Object.keys(newBillData).forEach((key) => {
          if (newBillData[key] !== prevBillData[key]) {
            changedFields[key] = newBillData[key];
          }
        });

        if (Object.keys(changedFields).length > 0) {
          changedFields.thisBillUpdatedAt = timestamp.now();
          changedFields.thisBillUpdatedBy = user.phoneNumber;
        }

        updatedBills[bill.id] = {
          ...(prevBillData || {}),
          ...changedFields,
        };
      });

      await projectFirestore
        .collection("inspections")
        .doc(inspectionId)
        .update({
          bills: updatedBills,
          lastUpdatedAt: timestamp.now(),
          lastUpdatedBy: user.phoneNumber,
          allBillInspectionComplete,
          updatedInformation: firebase.firestore.FieldValue.arrayUnion({
            updatedAt: timestamp.now(),
            updatedBy: user.phoneNumber,
          }),
        });

      setAfterSaveModal(true);
    } catch (error) {
      console.error("Error saving all bill data:", error);
    } finally {
      setIsBillDataSaving(false);
    }
  };

  const handleFinalSubmit = async () => {
    setFinalSubmiting(true);

    try {
      // Save bills first
      await handleSaveBill();

      // Then final submit
      await projectFirestore
        .collection("inspections")
        .doc(inspectionId)
        .update({
          rooms: Object.values(inspectionData),
          finalSubmit: true,
          layoutInspectionDone,
          updatedAt: timestamp.now(),
          updatedInformation: firebase.firestore.FieldValue.arrayUnion({
            updatedAt: timestamp.now(),
            updatedBy: user.phoneNumber,
          }),
        });

      navigate(`/inspection-report/${inspectionId}`);
    } catch (error) {
      console.error("Error in final submit:", error);
    } finally {
      setFinalSubmiting(false);
      setFinalSubmit(false);
    }
  };

  // Component rendering
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
                    <div className="inspection_type_buttons">
                      <button
                        onClick={() => setActiveInspection("layout")}
                        className={`${activeInspection === "layout" ? "active " : ""}${layoutInspectionDone ? "done" : ""}`}
                      >
                        Layout Inspection
                        <img src="/assets/img/icons/check-mark.png" alt="" />
                      </button>

                      <button
                        onClick={() => setActiveInspection("bill")}
                        className={`${activeInspection === "bill" ? "active " : ""}${allBillInspectionComplete ? "done" : ""}`}
                      >
                        Bill Inspection
                        <img src="/assets/img/icons/check-mark.png" alt="" />
                      </button>
                    </div>
                  </div>
                </div>
                <PropertySummaryCard
                  propertydoc={propertydoc}
                  propertyId={propertyId}
                />
              </div>

              {/* Layout Inspection Section */}
              {activeInspection === "layout" && (
                <LayoutInspectionSection
                  rooms={rooms}
                  activeRoom={activeRoom}
                  setActiveRoom={setActiveRoom}
                  getRoomClass={getRoomClass}
                  inspectionData={inspectionData}
                  currentRoomData={currentRoomData}
                  getFieldClass={getFieldClass}
                  handleChange={handleChange}
                  handleImageUpload={handleImageUpload}
                  handleImageDelete={handleImageDelete}
                  isFinalSubmitEnabled={isFinalSubmitEnabled}
                  inspectionDatabaseData={inspectionDatabaseData}
                  setFinalSubmit={setFinalSubmit}
                  handleSave={handleSave}
                  isDataSaving={isDataSaving}
                />
              )}

              {/* Bill Inspection Section */}
              {activeInspection === "bill" && (
                <BillInspectionSection
                  bills={bills}
                  selectedBill={selectedBill}
                  handleBillTypeClick={handleBillTypeClick}
                  getBillButtonClass={getBillButtonClass}
                  currentBillData={currentBillData}
                  getBillFieldClass={getBillFieldClass}
                  amount={amount}
                  setAmount={setAmount}
                  remark={remark}
                  setRemark={setRemark}
                  handleBillImageUpload={handleBillImageUpload}
                  handleBillImageDelete={handleBillImageDelete}
                  isFinalSubmitEnabled={isFinalSubmitEnabled}
                  inspectionDatabaseData={inspectionDatabaseData}
                  setFinalSubmit={setFinalSubmit}
                  handleSaveBill={handleSaveBill}
                  isBillDataSaving={isBillDataSaving}
                />
              )}

              {/* Final Submit Button */}
              {inspectionDatabaseData &&
                inspectionDatabaseData.layoutInspectionDone &&
                inspectionDatabaseData.allBillInspectionComplete && (
                  <div className="bottom_fixed_button">
                    <div className="next_btn_back">
                      <button
                        className="theme_btn no_icon btn_fill2 full_width"
                        onClick={() => setFinalSubmit(true)}
                        disabled={!isFinalSubmitEnabled()}
                        style={{
                          opacity: !isFinalSubmitEnabled() ? 0.3 : 1,
                          cursor: !isFinalSubmitEnabled() ? "not-allowed" : "pointer",
                        }}
                      >
                        Final Submit
                      </button>
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
    </div>
  );
};

// Extracted components for better organization
const LayoutInspectionSection = ({
  rooms,
  activeRoom,
  setActiveRoom,
  getRoomClass,
  inspectionData,
  currentRoomData,
  getFieldClass,
  handleChange,
  handleImageUpload,
  handleImageDelete,
  isFinalSubmitEnabled,
  inspectionDatabaseData,
  setFinalSubmit,
  handleSave,
  isDataSaving
}) => (
  <>
    <div className="room-buttons">
      {rooms.map((room) => (
        <RoomButton
          key={room.id}
          room={room}
          isActive={activeRoom === room.id}
          roomClass={getRoomClass(room.id)}
          onClick={() => setActiveRoom(room.id)}
        />
      ))}
    </div>
    <div className="vg22"></div>
    {activeRoom && (
      <div>
        <form className="add_inspection_form">
          <div className="aai_form">
            <div className="row row_gap_20">
              <InspectionField
                field="isAllowForInspection"
                label="Tenant Allowed for Inspection*"
                value={currentRoomData.isAllowForInspection}
                onChange={(value) => handleChange(activeRoom, "isAllowForInspection", value)}
                type="radio"
                options={["yes", "no"]}
                fieldClass={getFieldClass(activeRoom, "isAllowForInspection")}
              />

              {currentRoomData.isAllowForInspection === "yes" && (
                <>
                 <InspectionField
  field="seepage"
  label="Seepage*"
  value={currentRoomData.seepage}
  onChange={(value) => handleChange(activeRoom, "seepage", value)}
  type="radio"
  options={["yes", "no"]}
  fieldClass={getFieldClass(activeRoom, "seepage")}
  remarkField="seepageRemark"
  remarkValue={currentRoomData.seepageRemark}
  onRemarkChange={(value) => handleChange(activeRoom, "seepageRemark", value)}
  showRemark={currentRoomData.seepage === "yes"}
  required={true} // Add this line
/>

<InspectionField
  field="termites"
  label="Termites*"
  value={currentRoomData.termites}
  onChange={(value) => handleChange(activeRoom, "termites", value)}
  type="radio"
  options={["yes", "no"]}
  fieldClass={getFieldClass(activeRoom, "termites")}
  remarkField="termitesRemark"
  remarkValue={currentRoomData.termitesRemark}
  onRemarkChange={(value) => handleChange(activeRoom, "termitesRemark", value)}
  showRemark={currentRoomData.termites === "yes"}
  required={true} // Add this line
/>

<InspectionField
  field="otherIssue"
  label="Other Issue*"
  value={currentRoomData.otherIssue}
  onChange={(value) => handleChange(activeRoom, "otherIssue", value)}
  type="radio"
  options={["yes", "no"]}
  fieldClass={getFieldClass(activeRoom, "otherIssue")}
  remarkField="otherIssueRemark"
  remarkValue={currentRoomData.otherIssueRemark}
  onRemarkChange={(value) => handleChange(activeRoom, "otherIssueRemark", value)}
  showRemark={currentRoomData.otherIssue === "yes"}
  required={true} // Add this line
/>

                  <InspectionField
                    field="cleanRemark"
                    label="Cleaning Remark*"
                    value={currentRoomData.cleanRemark}
                    onChange={(value) => handleChange(activeRoom, "cleanRemark", value)}
                    type="textarea"
                    fieldClass={getFieldClass(activeRoom, "cleanRemark")}
                  />
                </>
              )}

              <InspectionField
                field="generalRemark"
                label={`General Remark${currentRoomData.isAllowForInspection === "yes" ? "" : "*"}`}
                value={currentRoomData.generalRemark}
                onChange={(value) => handleChange(activeRoom, "generalRemark", value)}
                type="textarea"
                fieldClass={currentRoomData.isAllowForInspection === "yes" ? "filled" : getFieldClass(activeRoom, "generalRemark")}
              />

              {currentRoomData.isAllowForInspection === "yes" && (
                <ImageUploadSection
                  roomId={activeRoom}
                  images={currentRoomData.images || []}
                  handleImageUpload={handleImageUpload}
                  handleImageDelete={handleImageDelete}
                  fieldClass={getFieldClass(activeRoom, "image")}
                />
              )}
            </div>
          </div>
        </form>
        <SaveButtons
          isFinalSubmitEnabled={isFinalSubmitEnabled}
          inspectionDatabaseData={inspectionDatabaseData}
          setFinalSubmit={setFinalSubmit}
          handleSave={handleSave}
          isSaving={isDataSaving}
          saveText="Save Inspection"
        />
      </div>
    )}
  </>
);

const BillInspectionSection = ({
  bills,
  selectedBill,
  handleBillTypeClick,
  getBillButtonClass,
  currentBillData,
  getBillFieldClass,
  amount,
  setAmount,
  remark,
  setRemark,
  handleBillImageUpload,
  handleBillImageDelete,
  isFinalSubmitEnabled,
  inspectionDatabaseData,
  setFinalSubmit,
  handleSaveBill,
  isBillDataSaving
}) => (
  <div className="bill_inspection">
    <div className="room-buttons">
      {bills.map((bill) => (
        <BillButton
          key={bill.id}
          bill={bill}
          isActive={selectedBill?.id === bill.id}
          buttonClass={getBillButtonClass(bill)}
          onClick={() => handleBillTypeClick(bill)}
        />
      ))}
    </div>
    <div className="vg22"></div>

    {selectedBill && (
      <div className="bill_fields">
        <BillInfoSection bill={selectedBill} />
        <div className="vg22"></div>

        <form className="add_inspection_form">
          <div className="aai_form">
            <div className="row row_gap_20">
              <BillField
                field="amount"
                label="Due Amount*"
                value={amount}
                onChange={setAmount}
                type="number"
                fieldClass={getBillFieldClass(selectedBill.id, "amount")}
              />

              <BillField
                field="remark"
                label="General Remark*"
                value={remark}
                onChange={setRemark}
                type="textarea"
                fieldClass={getBillFieldClass(selectedBill.id, "remark")}
              />

              <BillImageUpload
                billId={selectedBill.id}
                imageUrl={currentBillData.imageUrl}
                handleBillImageUpload={handleBillImageUpload}
                handleBillImageDelete={handleBillImageDelete}
              />
            </div>
          </div>
        </form>

        <SaveButtons
          isFinalSubmitEnabled={isFinalSubmitEnabled}
          inspectionDatabaseData={inspectionDatabaseData}
          setFinalSubmit={setFinalSubmit}
          handleSave={handleSaveBill}
          isSaving={isBillDataSaving}
          saveText="Save Bill Inspection"
        />
      </div>
    )}
  </div>
);

// Helper components
const RoomButton = ({ room, isActive, roomClass, onClick }) => (
  <button onClick={onClick} className={roomClass}>
    <div className="active_hand">
    <img src="/img1" alt="" />
    </div>
    <div className="icon_text">
      <div className="btn_icon">
        <div className="bi_icon add">
         <img src="/img1" alt="" />
        </div>
        <div className="bi_icon half">
        <img src="/img1" alt="" />
        </div>
        <div className="bi_icon full">
      <img src="/img1" alt="" />
        </div>
        <div className="bi_icon notallowed">
          <img src="/img1" alt="" />
        </div>
      </div>
      <div className="btn_text">
        <h6 className="add">Start</h6>
        <h6 className="half">In Progress</h6>
        <h6 className="full">Completed</h6>
        <h6 className="notallowed">Not Allowed</h6>
      </div>
    </div>
    <div className="room_name">{room.roomName}</div>
  </button>
);

const InspectionField = ({
  field,
  label,
  value,
  onChange,
  type,
  options,
  fieldClass,
  remarkField,
  remarkValue,
  onRemarkChange,
  showRemark,
  required // Add this prop to indicate if field is required
}) => {
  // Check if remark field should show validation
  const shouldValidateRemark = showRemark && required;
  const remarkFieldClass = shouldValidateRemark && (!remarkValue || remarkValue.trim() === "") 
    ? "notfilled" 
    : "filled";

  return (
    <div className="col-xl-3 col-md-6">
      <div className={`form_field w-100 ${fieldClass}`} style={{ padding: "10px", borderRadius: "5px", background: "white" }}>
        <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
          {label}
        </h6>
        <div className="field_box theme_radio_new">
          {type === "radio" ? (
            <div className="theme_radio_container">
              {options.map(option => (
                <div key={option} className="radio_single">
                  <input
                    type="radio"
                    name={`${field}-${option}`}
                    id={`${field}-${option}`}
                    value={option}
                    checked={value === option}
                    onChange={(e) => onChange(e.target.value)}
                  />
                  <label htmlFor={`${field}-${option}`}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <textarea
              style={type === "textarea" ? { minHeight: "104px" } : {}}
              placeholder={label}
              value={value || ""}
              className="w-100"
              onChange={(e) => onChange(e.target.value)}
            />
          )}
          
          {showRemark && (
            <>
              <div className="vg12"></div>
              <textarea
                placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} Remark*`}
                value={remarkValue || ""}
                className={`w-100 ${remarkFieldClass}`} // Apply validation class here
                onChange={(e) => onRemarkChange(e.target.value)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ImageUploadSection = ({ roomId, images, handleImageUpload, handleImageDelete, fieldClass }) => (
  <div className="col-12">
    <div className={`form_field w-100 ${fieldClass}`} style={{ padding: "10px", borderRadius: "5px", background: "white" }}>
      <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
        Upload images* <span style={{ fontSize: "13px" }}>(A minimum of 1 and a maximum of 10 images can be uploaded.)</span>
      </h6>
      <div className="add_and_images">
        {images.map((image, index) => (
          <div key={index} className="uploaded_images relative">
            <img src={image.url} alt="Uploaded" />
            <div className="trash_icon">
              <FaTrash size={14} color="red" onClick={() => handleImageDelete(roomId, image)} />
            </div>
          </div>
        ))}
        {(images.length || 0) < 10 && (
          <div>
            <div
              onClick={() => document.getElementById(`file-input-${roomId}`).click()}
              className="add_icon"
            >
              <FaPlus size={24} color="#555" />
            </div>
            <input
              type="file"
              id={`file-input-${roomId}`}
              style={{ display: "none" }}
              multiple
              onChange={(e) => handleImageUpload(e, roomId)}
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

const SaveButtons = ({ isFinalSubmitEnabled, inspectionDatabaseData, setFinalSubmit, handleSave, isSaving, saveText }) => (
  <div className="bottom_fixed_button" style={{ zIndex: "1000" }}>
    <div className="next_btn_back">
      {inspectionDatabaseData &&
        inspectionDatabaseData.layoutInspectionDone &&
        inspectionDatabaseData.allBillInspectionComplete && (
          <button
            className="theme_btn no_icon btn_fill2 full_width"
            onClick={() => setFinalSubmit(true)}
            disabled={!isFinalSubmitEnabled()}
            style={{
              opacity: !isFinalSubmitEnabled() ? 0.3 : 1,
              cursor: !isFinalSubmitEnabled() ? "not-allowed" : "pointer",
            }}
          >
            Final Submit
          </button>
        )}

      <button
        className="theme_btn no_icon btn_fill full_width"
        onClick={handleSave}
        disabled={isSaving}
        style={{ opacity: isSaving ? "0.5" : "1" }}
      >
        {isSaving ? "Saving...." : saveText}
      </button>
    </div>
  </div>
);

const BillButton = ({ bill, isActive, buttonClass, onClick }) => (
  <button onClick={onClick} className={buttonClass}>
    <div className="active_hand">
    <img src="/img1" alt="" />
    </div>
    <div className="icon_text">
      <div className="btn_icon">
        <div className="bi_icon add">
          <img src="/img1" alt="" />
        </div>
        <div className="bi_icon half">
         <img src="/img1" alt="" />
        </div>
        <div className="bi_icon full">
        <img src="/img1" alt="" />
        </div>
      </div>
      <div className="btn_text">
        <h6 className="add">Start</h6>
        <h6 className="half">In Progress</h6>
        <h6 className="full">Completed</h6>
      </div>
    </div>
    <div className="room_name">{bill.billType}</div>
  </button>
);

const BillInfoSection = ({ bill }) => (
  <div className="id_name">
    <div className="idn_single">
      <h6>Bill ID</h6>
      <h5>{bill.billId}</h5>
    </div>
    <div className="idn_single">
      <h6>Authority name</h6>
      <h5>{bill.authorityName}</h5>
    </div>
    {bill.billWebsiteLink && (
      <div className="idn_single" style={{ maxWidth: "200px" }}>
        <h6>Bill Website Link</h6>
        <h5 style={{ fontWeight: "400" }}>
          <Link className="sub_title text_green" target="_blank" to={bill.billWebsiteLink} style={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {bill.billWebsiteLink}
          </Link>
        </h5>
      </div>
    )}
  </div>
);

const BillField = ({ field, label, value, onChange, type, fieldClass }) => (
  <div className="col-xl-3 col-md-6">
    <div className={`form_field w-100 ${fieldClass}`} style={{ padding: "10px", borderRadius: "5px", background: "white" }}>
      <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
        {label}
      </h6>
      <div className="field_box theme_radio_new">
        {type === "textarea" ? (
          <textarea
            className="w-100"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <div className="price_input relative">
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={label}
              className="w-100"
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

const BillImageUpload = ({ billId, imageUrl, handleBillImageUpload, handleBillImageDelete }) => (
  <div className="col-12">
    <div className="form_field w-100" style={{ padding: "10px", borderRadius: "5px", background: "white" }}>
      <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
        Upload bill image if any
      </h6>
      <div className="image_upload_container">
        {imageUrl ? (
          <div className="image_preview">
            <div className="image_container">
              <img src={imageUrl} alt="Bill Preview" />
              <div className="trash_icon">
                <FaTrash size={14} color="red" onClick={() => handleBillImageDelete(billId)} />
              </div>
            </div>
            <div
              onClick={() => document.getElementById(`bill-file-input-${billId}`).click()}
              className="upload_icon"
            >
              <FaRetweet size={24} color="#555" />
              <h6>Replace Image</h6>
            </div>
            <input
              type="file"
              id={`bill-file-input-${billId}`}
              style={{ display: "none" }}
              onChange={(e) => handleBillImageUpload(e, billId)}
            />
          </div>
        ) : (
          <>
            <div
              onClick={() => document.getElementById(`bill-add-file-input-${billId}`).click()}
              className="upload_icon"
            >
              <FaPlus size={24} color="#555" />
              <h6>Add Image</h6>
            </div>
            <input
              type="file"
              id={`bill-add-file-input-${billId}`}
              style={{ display: "none" }}
              onChange={(e) => handleBillImageUpload(e, billId)}
            />
          </>
        )}
      </div>
    </div>
  </div>
);

const ImageActionModal = ({ imageActionStatus }) => (
  <Modal show={imageActionStatus !== null} centered className="uploading_modal">
    <h6 style={{
      color: imageActionStatus === "uploading" ? "var(--theme-green2)" :
        imageActionStatus === "deleting" ? "var(--theme-red)" :
          "var(--theme-blue)"
    }}>
      {imageActionStatus === "uploading" ? "Uploading..." : "Deleting..."}
    </h6>
    <BarLoader
      color={imageActionStatus === "uploading" ? "var(--theme-green2)" :
        imageActionStatus === "deleting" ? "var(--theme-red)" :
          "var(--theme-blue)"}
      loading={true}
      height={10}
    />
  </Modal>
);

const SaveSuccessModal = ({ afterSaveModal, setAfterSaveModal }) => (
  <Modal show={afterSaveModal} onHide={() => setAfterSaveModal(false)} className="delete_modal inspection_modal" centered>
    <h5 className="done_div text-center">
      <img src="/assets/img/icons/check-mark.png" alt="" style={{ height: "65px", width: "auto" }} />
      <h5 className="text_green2 mb-0">Saved Successfully</h5>
    </h5>
    <div className="theme_btn btn_border w-100 no_icon text-center mb-4 mt-4" onClick={() => setAfterSaveModal(false)}>
      Okay
    </div>
  </Modal>
);

const FinalSubmitModal = ({ finalSubmit, setFinalSubmit, handleFinalSubmit, finalSubmiting }) => (
  <Modal show={finalSubmit} onHide={() => setFinalSubmit(false)} centered>
    <Modal.Header className="justify-content-center" style={{ paddingBottom: "0px", border: "none" }}>
      <h5>Alert</h5>
    </Modal.Header>
    <Modal.Body className="text-center" style={{ color: "#FA6262", fontSize: "20px", border: "none" }}>
      After final submission, you won't be able to edit this inspection.
    </Modal.Body>
    <Modal.Footer className="d-flex justify-content-between" style={{ border: "none", gap: "15px" }}>
      <div className="cancel_btn" onClick={() => setFinalSubmit(false)}>Cancel</div>
      <div className="done_btn" onClick={handleFinalSubmit}>
        {finalSubmiting ? "Processing..." : "Proceed"}
      </div>
    </Modal.Footer>
  </Modal>
);

export default AddInspection;