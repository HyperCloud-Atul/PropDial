// this is new code with the help of deepseeker ai
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { projectFirestore, timestamp, projectStorage } from "../../../firebase/config";
import firebase from 'firebase/compat/app';
import imageCompression from "browser-image-compression";
import { ClipLoader } from "react-spinners";
import ScrollToTop from "../../../components/ScrollToTop";
import PropertySummaryCard from "../../property/PropertySummaryCard";
import LayoutInspectionSection from "./LayoutInspectionSection";
import BillInspectionSection from "./BillInspectionSection";
import ImageActionModal from "./ImageActionModal";
import SaveSuccessModal from "./SaveSuccessModal";
import FinalSubmitModal from "./FinalSubmitModal";

const RegularInspection = ({ inspectionId, inspectionDocument }) => {
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
    <>
      <div className="regular_inspection">
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

export default RegularInspection;