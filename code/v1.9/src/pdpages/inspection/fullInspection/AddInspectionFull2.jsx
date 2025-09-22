import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { projectFirestore, timestamp, projectStorage } from "../../../firebase/config";
import firebase from 'firebase/compat/app';
import { useDocument } from "../../../hooks/useDocument";
import imageCompression from "browser-image-compression";
import { FaPlus, FaTrash, FaRetweet } from "react-icons/fa";
import { BarLoader, ClipLoader } from "react-spinners";
import ScrollToTop from "../../../components/ScrollToTop";
import PropertySummaryCard from "../../property/PropertySummaryCard";

const AddInspection = () => {
  const { inspectionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // State management
  const [rooms, setRooms] = useState([]);
  const [inspectionData, setInspectionData] = useState({});
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
  const [activeInspection, setActiveInspection] = useState("bill");
  const [fixtureInspectionDone, setFixtureInspectionDone] = useState(false);
  const [fixtures, setFixtures] = useState([]);
  const [fixtureInspectionData, setFixtureInspectionData] = useState({});

  // Room inspection state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [tenantAllowsInspection, setTenantAllowsInspection] = useState(true);
  const [selectedFixture, setSelectedFixture] = useState(null);

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

            if (inspectionData.fixtures) {
              setFixtureInspectionData(inspectionData.fixtures);
            }

            if (inspectionData.bills) {
              setBillInspectionData(inspectionData.bills);
            }

            if (inspectionData.roomInspections) {
              setInspectionData(inspectionData.roomInspections);
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

  // Rooms and fixtures data effect
  useEffect(() => {
    if (!propertyId) return;

    const unsubscribe = projectFirestore
      .collection("property-layout-propdial")
      .where("propertyId", "==", propertyId)
      .onSnapshot(
        (snapshot) => {
          let roomsData = [];
          let allFixtures = [];

          snapshot.forEach((doc) => {
            const layouts = doc.data().layouts || {};

            Object.entries(layouts).forEach(([roomKey, roomValue]) => {
              const roomId = `${doc.id}_${roomKey}`;
              const roomName = roomValue.roomName || roomKey;
              
              roomsData.push({
                id: roomId,
                roomName: roomName,
              });

              // Extract fixtures from each room
              if (roomValue.fixtureBySelect && Array.isArray(roomValue.fixtureBySelect)) {
                roomValue.fixtureBySelect.forEach((fixture) => {
                  allFixtures.push({
                    id: `${roomId}_${fixture.id || fixture.name}`,
                    name: fixture.name,
                    roomId: roomId,
                    roomName: roomName
                  });
                });
              }
            });
          });

          setRooms(roomsData);
          setFixtures(allFixtures);
          
          // Initialize fixture inspection data
          setFixtureInspectionData((prevData) => {
            const newData = { ...prevData };
            allFixtures.forEach((fixture) => {
              if (!newData[fixture.id]) {
                newData[fixture.id] = {
                  fixtureId: fixture.id,
                  fixtureName: fixture.name,
                  roomId: fixture.roomId,
                  roomName: fixture.roomName,
                  status: "",
                  remark: "",
                  images: [],
                  inspectedAt: timestamp.now(),
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

  // Fixture inspection completion check
  const isAllFixtureInspectionDone = useCallback(() => {
    const allFixturesInspected = fixtures.length > 0 && 
      fixtures.every((fixture) => {
        const fixtureData = fixtureInspectionData[fixture.id] || {};
        return (
          fixtureData.status && 
          fixtureData.remark && 
          fixtureData.images?.length > 0
        );
      });

    if (fixtureInspectionDone !== allFixturesInspected) {
      setFixtureInspectionDone(allFixturesInspected);
    }

    return allFixturesInspected;
  }, [fixtures, fixtureInspectionData, fixtureInspectionDone]);

  useEffect(() => {
    isAllFixtureInspectionDone();
  }, [fixtureInspectionData, isAllFixtureInspectionDone]);

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
  const handleImageUpload = async (e, fixtureId) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const existingCount = fixtureInspectionData[fixtureId]?.images?.length || 0;
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
          `inspection_images/${inspectionId}/${fixtureId}/${compressedFile.name}`
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
                setFixtureInspectionData((prev) => ({
                  ...prev,
                  [fixtureId]: {
                    ...prev[fixtureId],
                    images: [
                      ...(prev[fixtureId]?.images || []),
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

  const handleImageDelete = async (fixtureId, image) => {
    setImageActionStatus("deleting");
    const storageRef = projectStorage.ref(
      `inspection_images/${inspectionId}/${fixtureId}/${image.name}`
    );

    try {
      await storageRef.delete();
      setFixtureInspectionData((prev) => ({
        ...prev,
        [fixtureId]: {
          ...prev[fixtureId],
          images: prev[fixtureId]?.images?.filter((img) => img.url !== image.url),
        },
      }));
      setImageActionStatus(null);
    } catch (error) {
      console.error("Error deleting image:", error);
      setImageActionStatus(null);
    }
  };

  // Form handling functions
  const handleFixtureChange = (fixtureId, field, value) => {
    setFixtureInspectionData((prev) => ({
      ...prev,
      [fixtureId]: {
        ...prev[fixtureId],
        [field]: value,
      },
    }));
  };

  // Room selection handler
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setSelectedFixture(null);
    
    // Check if tenant allows inspection was already set for this room
    if (inspectionData[room.id]?.tenantAllowsInspection !== undefined) {
      setTenantAllowsInspection(inspectionData[room.id].tenantAllowsInspection);
    } else {
      setTenantAllowsInspection(true); // Default to yes
    }
  };

  // Save tenant allowance for room
  const saveTenantAllowance = async () => {
    if (!selectedRoom) return;

    setIsDataSaving(true);

    try {
      await projectFirestore
        .collection("inspections")
        .doc(inspectionId)
        .update({
          [`roomInspections.${selectedRoom.id}.tenantAllowsInspection`]: tenantAllowsInspection,
          lastUpdatedAt: timestamp.now(),
          lastUpdatedBy: user.phoneNumber,
          updatedInformation: firebase.firestore.FieldValue.arrayUnion({
            updatedAt: timestamp.now(),
            updatedBy: user.phoneNumber,
          }),
        });

      setInspectionData(prev => ({
        ...prev,
        [selectedRoom.id]: {
          ...prev[selectedRoom.id],
          tenantAllowsInspection
        }
      }));
    } catch (error) {
      console.error("Error saving tenant allowance:", error);
    } finally {
      setIsDataSaving(false);
    }
  };

  // UI helper functions
  const getRoomButtonClass = (room) => {
    const roomData = inspectionData[room.id] || {};
    const fixturesInRoom = fixtures.filter(f => f.roomId === room.id);
    const completedFixtures = fixturesInRoom.filter(f => {
      const fixtureData = fixtureInspectionData[f.id] || {};
      return fixtureData.status && fixtureData.remark && fixtureData.images?.length > 0;
    });

    let className = "room-button";

    if (completedFixtures.length === fixturesInRoom.length && fixturesInRoom.length > 0) {
      className += " full";
    } else if (completedFixtures.length > 0) {
      className += " half";
    }

    if (selectedRoom?.id === room.id) className += " active";

    return className;
  };

  const getFixtureButtonClass = (fixture) => {
    const fixtureData = fixtureInspectionData[fixture.id] || {};
    
    let className = "room-button";

    const filledFields = [
      fixtureData.status,
      fixtureData.remark,
      fixtureData.images?.length > 0,
    ].filter(Boolean).length;

    if (filledFields === 3) className += " full";
    else if (filledFields > 0) className += " half";

    if (selectedFixture?.id === fixture.id) className += " active";

    return className;
  };

  const getFixtureFieldClass = (fixtureId, field) => {
    const fixtureData = fixtureInspectionData[fixtureId] || {};
    
    if (field === "images") {
      return fixtureData.images && fixtureData.images.length > 0 ? "filled" : "notfilled";
    }

    return fixtureData[field] && fixtureData[field].trim() !== "" ? "filled" : "notfilled";
  };

  const isFinalSubmitEnabled = () => {
    return (
      allBillInspectionComplete &&
      fixtures.length > 0 &&
      fixtures.every((fixture) => {
        const fixtureData = fixtureInspectionData[fixture.id] || {};
        return (
          fixtureData.status && 
          fixtureData.remark && 
          fixtureData.images?.length > 0
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
          fixtures: fixtureInspectionData,
          roomInspections: inspectionData,
          lastUpdatedAt: timestamp.now(),
          lastUpdatedBy: user.phoneNumber,
          fixtureInspectionDone,
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
          fixtures: fixtureInspectionData,
          roomInspections: inspectionData,
          finalSubmit: true,
          fixtureInspectionDone,
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

  // Group fixtures by room
  const fixturesByRoom = useMemo(() => {
    const grouped = {};
    fixtures.forEach(fixture => {
      if (!grouped[fixture.roomId]) {
        grouped[fixture.roomId] = [];
      }
      grouped[fixture.roomId].push(fixture);
    });
    return grouped;
  }, [fixtures]);

  // Get fixtures for selected room
  const selectedRoomFixtures = useMemo(() => {
    if (!selectedRoom) return [];
    return fixturesByRoom[selectedRoom.id] || [];
  }, [selectedRoom, fixturesByRoom]);

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
                        onClick={() => setActiveInspection("bill")}
                        className={`${activeInspection === "bill" ? "active " : ""}${allBillInspectionComplete ? "done" : ""}`}
                      >
                        Bill Inspection
                        <img src="/assets/img/icons/check-mark.png" alt="" />
                      </button>

                      <button
                        onClick={() => setActiveInspection("fixture")}
                        className={`${activeInspection === "fixture" ? "active " : ""}${fixtureInspectionDone ? "done" : ""}`}
                      >
                        Fixture Inspection
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

              {/* Bill Inspection Section - Show first */}
              {activeInspection === "bill" && (
                <BillInspectionSection
                  bills={bills}
                  selectedBill={selectedBill}
                  handleBillTypeClick={handleBillTypeClick}
                  getBillButtonClass={getBillButtonClass}
                  currentBillData={billInspectionData[selectedBill?.id] || {}}
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

              {/* Fixture Inspection Section */}
              {activeInspection === "fixture" && (
                <div>
                  {/* Room Selection */}
                  {!selectedRoom && (
                    <div className="room-buttons">
                      <h3>Select Room for Inspection</h3>
                      <div className="rooms-grid">
                        {rooms.map((room) => (
                          <button
                            key={room.id}
                            onClick={() => handleRoomSelect(room)}
                            className={getRoomButtonClass(room)}
                          >
                            <div className="room_name">{room.roomName}</div>
                            <div className="status-indicator">
                              {fixturesByRoom[room.id]?.length > 0 && (
                                <span>
                                  {fixturesByRoom[room.id].filter(f => {
                                    const data = fixtureInspectionData[f.id] || {};
                                    return data.status && data.remark && data.images?.length > 0;
                                  }).length} / {fixturesByRoom[room.id].length}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Room Inspection Form */}
                  {selectedRoom && !selectedFixture && (
                    <div className="room-inspection-form">
                      <div className="back-button" onClick={() => setSelectedRoom(null)}>
                        &larr; Back to Rooms
                      </div>
                      <h3>Inspecting {selectedRoom.roomName}</h3>
                      
                      {/* Tenant Allowance Field */}
                      <div className="form-field">
                        <label>Tenant Allows Inspection</label>
                        <div className="radio-group">
                          <label>
                            <input
                              type="radio"
                              value="yes"
                              checked={tenantAllowsInspection === true}
                              onChange={() => {
                                setTenantAllowsInspection(true);
                                saveTenantAllowance();
                              }}
                            />
                            Yes
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="no"
                              checked={tenantAllowsInspection === false}
                              onChange={() => {
                                setTenantAllowsInspection(false);
                                saveTenantAllowance();
                              }}
                            />
                            No
                          </label>
                        </div>
                      </div>

                      {tenantAllowsInspection && (
                        <>
                          {/* Fixture Selection Dropdown */}
                          <div className="form-field">
                            <label>Select Fixture</label>
                            <select
                              value={selectedFixture?.id || ""}
                              onChange={(e) => {
                                const fixtureId = e.target.value;
                                if (fixtureId) {
                                  const fixture = selectedRoomFixtures.find(f => f.id === fixtureId);
                                  setSelectedFixture(fixture);
                                }
                              }}
                            >
                              <option value="">Select a fixture</option>
                              {selectedRoomFixtures.map(fixture => (
                                <option key={fixture.id} value={fixture.id}>
                                  {fixture.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Fixture List for the Room */}
                          <div className="fixture-buttons">
                            <h4>Fixtures in {selectedRoom.roomName}</h4>
                            {selectedRoomFixtures.map((fixture) => (
                              <button
                                key={fixture.id}
                                onClick={() => setSelectedFixture(fixture)}
                                className={getFixtureButtonClass(fixture)}
                              >
                                <div className="room_name">{fixture.name}</div>
                                <div className="status-indicator">
                                  {fixtureInspectionData[fixture.id]?.status ? "Completed" : "Not Started"}
                                </div>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Fixture Inspection Form */}
                  {selectedRoom && selectedFixture && (
                    <FixtureInspectionForm
                      fixture={selectedFixture}
                      fixtureData={fixtureInspectionData[selectedFixture.id] || {}}
                      getFixtureFieldClass={getFixtureFieldClass}
                      handleFixtureChange={handleFixtureChange}
                      handleImageUpload={handleImageUpload}
                      handleImageDelete={handleImageDelete}
                      onBack={() => setSelectedFixture(null)}
                      onSave={handleSave}
                      isSaving={isDataSaving}
                    />
                  )}
                </div>
              )}

              {/* Final Submit Button */}
              {inspectionDatabaseData &&
                inspectionDatabaseData.fixtureInspectionDone &&
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
const FixtureInspectionForm = ({
  fixture,
  fixtureData,
  getFixtureFieldClass,
  handleFixtureChange,
  handleImageUpload,
  handleImageDelete,
  onBack,
  onSave,
  isSaving
}) => (
  <div>
    <div className="back-button" onClick={onBack}>
      &larr; Back to {fixture.roomName}
    </div>
    <h3>Inspecting {fixture.name} in {fixture.roomName}</h3>
    
    <form className="add_inspection_form">
      <div className="aai_form">
        <div className="row row_gap_20">
          <div className="col-xl-4 col-md-6">
            <div className={`form_field w-100 ${getFixtureFieldClass(fixture.id, "status")}`}>
              <h6>Fixture Status*</h6>
              <select
                value={fixtureData.status || ""}
                onChange={(e) => handleFixtureChange(fixture.id, "status", e.target.value)}
                className="w-100"
              >
                <option value="">Select Status</option>
                <option value="working">Working</option>
                <option value="not-working">Not Working</option>
                <option value="good">Good Condition</option>
                <option value="not-good">Not Good Condition</option>
              </select>
            </div>
          </div>

          <div className="col-xl-8 col-md-6">
            <div className={`form_field w-100 ${getFixtureFieldClass(fixture.id, "remark")}`}>
              <h6>Remark*</h6>
              <textarea
                placeholder="Enter remarks about this fixture"
                value={fixtureData.remark || ""}
                className="w-100"
                onChange={(e) => handleFixtureChange(fixture.id, "remark", e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="col-12">
            <div className={`form_field w-100 ${getFixtureFieldClass(fixture.id, "images")}`}>
              <h6>Upload images* <span>(A minimum of 1 and a maximum of 10 images can be uploaded.)</span></h6>
              <div className="add_and_images">
                {fixtureData.images?.map((image, index) => (
                  <div key={index} className="uploaded_images relative">
                    <img src={image.url} alt="Uploaded" />
                    <div className="trash_icon">
                      <FaTrash size={14} color="red" onClick={() => handleImageDelete(fixture.id, image)} />
                    </div>
                  </div>
                ))}
                {(fixtureData.images?.length || 0) < 10 && (
                  <div>
                    <div
                      onClick={() => document.getElementById(`file-input-${fixture.id}`).click()}
                      className="add_icon"
                    >
                      <FaPlus size={24} color="#555" />
                    </div>
                    <input
                      type="file"
                      id={`file-input-${fixture.id}`}
                      style={{ display: "none" }}
                      multiple
                      onChange={(e) => handleImageUpload(e, fixture.id)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <div className="save-buttons">
      <button
        className="theme_btn no_icon btn_fill"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Fixture Inspection"}
      </button>
    </div>
  </div>
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
  isBillDataSaving,
  isBillAvailable,
  billInspectionData,
  setIsBillAvailable
}) => (
  <div className="bill_inspection">
    <div className="room-buttons">
      {bills.map((bill) => (
        <button
          key={bill.id}
          onClick={() => handleBillTypeClick(bill)}
          className={getBillButtonClass(bill)}
        >
          <div className="room_name">{bill.billType}</div>
          <div className="status-indicator">
            {billInspectionData[bill.id]?.amount ? "Completed" : "Not Started"}
          </div>
        </button>
      ))}
    </div>
    <div className="vg22"></div>

    {selectedBill && (
      <div className="bill_fields">
        <div className="bill_info_card">
          <h4>{selectedBill.billType} Bill Details</h4>
          <div className="bill_details">
            <p><strong>Authority:</strong> {selectedBill.authorityName || "N/A"}</p>
            <p><strong>Bill ID:</strong> {selectedBill.billId || "N/A"}</p>
            {selectedBill.billWebsiteLink && (
              <p>
                <strong>Website:</strong> 
                <a href={selectedBill.billWebsiteLink} target="_blank" rel="noopener noreferrer">
                  {selectedBill.billWebsiteLink}
                </a>
              </p>
            )}
          </div>
        </div>
        
        <div className="row row_gap_20">
          <div className="col-md-6">
            <div className={`form_field w-100 ${getBillFieldClass(selectedBill.id, "amount")}`}>
              <h6>Bill Amount*</h6>
              <input
                type="number"
                placeholder="Enter bill amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-100"
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form_field w-100">
              <h6>Bill Available*</h6>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="yes"
                    checked={isBillAvailable === true}
                    onChange={() => setIsBillAvailable(true)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="no"
                    checked={isBillAvailable === false}
                    onChange={() => setIsBillAvailable(false)}
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className={`form_field w-100 ${getBillFieldClass(selectedBill.id, "remark")}`}>
              <h6>Remark*</h6>
              <textarea
                placeholder="Enter remarks about this bill"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-100"
                rows={4}
              />
            </div>
          </div>

          {isBillAvailable && (
            <div className="col-12">
              <div className="form_field w-100">
                <h6>Upload Bill Image</h6>
                <div className="add_and_images">
                  {currentBillData.imageUrl && (
                    <div className="uploaded_images relative">
                      <img src={currentBillData.imageUrl} alt="Bill" />
                      <div className="trash_icon">
                        <FaTrash 
                          size={14} 
                          color="red" 
                          onClick={() => handleBillImageDelete(selectedBill.id)} 
                        />
                      </div>
                    </div>
                  )}
                  {!currentBillData.imageUrl && (
                    <div>
                      <div
                        onClick={() => document.getElementById(`bill-file-input-${selectedBill.id}`).click()}
                        className="add_icon"
                      >
                        <FaPlus size={24} color="#555" />
                      </div>
                      <input
                        type="file"
                        id={`bill-file-input-${selectedBill.id}`}
                        style={{ display: "none" }}
                        accept="image/jpeg,image/png"
                        onChange={(e) => handleBillImageUpload(e, selectedBill.id)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="save-buttons">
          <button
            className="theme_btn no_icon btn_fill"
            onClick={handleSaveBill}
            disabled={isBillDataSaving}
          >
            {isBillDataSaving ? "Saving..." : "Save Bill Inspection"}
          </button>
        </div>
      </div>
    )}

    {bills.length > 0 && inspectionDatabaseData?.allBillInspectionComplete && (
      <div className="bill_completion_status">
        <div className="completion_badge">
          <img src="/assets/img/icons/check-mark.png" alt="Completed" />
          <span>All bills inspected successfully!</span>
        </div>
      </div>
    )}
  </div>
);

// Modal Components
const ImageActionModal = ({ imageActionStatus }) => (
  <Modal show={!!imageActionStatus} centered>
    <Modal.Body className="text-center">
      {imageActionStatus === "uploading" && (
        <>
          <BarLoader color="#36d7b7" width="100%" />
          <p className="mt-2">Uploading image...</p>
        </>
      )}
      {imageActionStatus === "deleting" && (
        <>
          <ClipLoader color="#36d7b7" />
          <p className="mt-2">Deleting image...</p>
        </>
      )}
    </Modal.Body>
  </Modal>
);

const SaveSuccessModal = ({ afterSaveModal, setAfterSaveModal }) => (
  <Modal show={afterSaveModal} onHide={() => setAfterSaveModal(false)} centered>
    <Modal.Body className="text-center">
      <img src="/assets/img/icons/check-mark.png" alt="Success" width={50} />
      <h4 className="mt-3">Data Saved Successfully!</h4>
      <button 
        className="theme_btn no_icon btn_fill mt-3"
        onClick={() => setAfterSaveModal(false)}
      >
        Continue Inspection
      </button>
    </Modal.Body>
  </Modal>
);

const FinalSubmitModal = ({ finalSubmit, setFinalSubmit, handleFinalSubmit, finalSubmiting }) => (
  <Modal show={finalSubmit} onHide={() => setFinalSubmit(false)} centered>
    <Modal.Body className="text-center">
      <h4>Final Submit Inspection</h4>
      <p>Are you sure you want to finalize this inspection? This action cannot be undone.</p>
      <div className="d-flex gap-3 justify-content-center mt-4">
        <button 
          className="theme_btn no_icon btn_outline"
          onClick={() => setFinalSubmit(false)}
          disabled={finalSubmiting}
        >
          Cancel
        </button>
        <button 
          className="theme_btn no_icon btn_fill"
          onClick={handleFinalSubmit}
          disabled={finalSubmiting}
        >
          {finalSubmiting ? "Submitting..." : "Confirm Final Submit"}
        </button>
      </div>
    </Modal.Body>
  </Modal>
);

export default AddInspection;