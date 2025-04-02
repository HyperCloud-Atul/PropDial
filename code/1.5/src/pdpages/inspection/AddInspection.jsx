import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectFirestore, timestamp } from "../../firebase/config";
import firebase from "firebase";
import { projectStorage } from "../../firebase/config";
import { useCallback } from "react";
import { useDocument } from "../../hooks/useDocument";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaRetweet } from "react-icons/fa";
import { BarLoader, ClipLoader } from "react-spinners";
import ScrollToTop from "../../components/ScrollToTop";
import PropertySummaryCard from "../property/PropertySummaryCard";
const AddInspection = () => {
  const { inspectionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [rooms, setRooms] = useState([]);
  const [inspectionData, setInspectionData] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isDataSaving, setIsDataSaving] = useState(false);
  const [show, setShow] = useState(false);
  const [imageActionStatus, setImageActionStatus] = useState(null);
  const [finalSubmit, setFinalSubmit] = useState(false);
  const [finalSubmiting, setFinalSubmiting] = useState(false);
  const [afterSaveModal, setAfterSaveModal] = useState(false);
  const [propertydoc, setPropertyDoc] = useState(null);
  const [propertyerror, setPropertyError] = useState(null);
  const [inspectionType, setInspectionType] = useState("");
  const [activeInspection, setActiveInspection] = useState("layout");
  const { document: inspectionDocument, error: inspectionDocumentError } =
    useDocument("inspections", inspectionId);

  useEffect(() => {
    if (!propertyId) return; // Agar propertyId na ho toh return kar do

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

    return () => unsubscribe(); // Cleanup function
  }, [propertyId]);

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

  useEffect(() => {
    if (!propertyId) return;
    const unsubscribe = projectFirestore
      .collection("propertylayouts")
      .where("propertyId", "==", propertyId)
      .onSnapshot(
        (snapshot) => {
          const roomsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            roomName: doc.data().roomName,
          }));

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

  const handleImageUpload = async (e, roomId) => {
    const file = e.target.files[0];
    if (!file) return;

    // Allowed image formats
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG and PNG files are allowed.");
      return;
    }

    setImageActionStatus("uploading");

    try {
      // Image Compression Settings
      const options = {
        maxSizeMB: 0.2, // Maximum size 200KB
        maxWidthOrHeight: 1024, // Resize if necessary
        useWebWorker: true,
      };

      // Compress Image
      const compressedFile = await imageCompression(file, options);

      // Upload Process
      const storageRef = projectStorage.ref(
        `inspection_images/${inspectionId}/${roomId}/${compressedFile.name}`
      );
      const uploadTask = storageRef.put(compressedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
        },
        (error) => {
          console.error("Error uploading image:", error);
          setImageActionStatus(null);
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
            setUploadProgress((prev) => ({ ...prev, [file.name]: 100 })); // Mark upload as complete
          } catch (error) {
            console.error("Error getting download URL:", error);
          } finally {
            setImageActionStatus(null);
          }
        }
      );
    } catch (error) {
      console.error("Image compression error:", error);
      setShow(false); // Stop uploading state if compression fails
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
      // Check if the field is an issue field (like seepage, termites, or otherIssue)
      if (
        field === "seepage" ||
        field === "termites" ||
        field === "otherIssue"
      ) {
        const remarkField = `${field}Remark`; // Derive the corresponding remark field name
        if (value === "no") {
          updatedRoomData[remarkField] = "There is no issue";
        } else if (value === "yes") {
          updatedRoomData[remarkField] = ""; // Reset to blank if "yes"
        }
      }

      return {
        ...prev,
        [roomId]: updatedRoomData,
      };
    });
  };

  // const isFinalSubmitEnabled = () => {
  //   return (
  //     allBillInspectionComplete && // Ensures all bill inspections are complete
  //     Object.values(inspectionData).every(
  //       (room) =>
  //         room.seepage &&
  //         room.termites &&
  //         room.otherIssue &&
  //         room.seepageRemark &&
  //         room.termitesRemark &&
  //         room.otherIssueRemark &&
  //         room.generalRemark &&
  //         room.cleanRemark &&
  //         room.images?.length > 0 // Ensures every room has at least 1 image uploaded
  //     )
  //   );
  // };

  // const getRoomClass = (roomId) => {
  //   const room = inspectionData[roomId];
  //   const filledFields = [
  //     room.seepage,
  //     room.seepageRemark,
  //     room.termites,
  //     room.termitesRemark,
  //     room.otherIssue,
  //     room.otherIssueRemark,
  //     room.generalRemark,
  //     room.cleanRemark,
  //     room.images?.length > 0,
  //   ].filter(Boolean).length;

  //   let className = "room-button";
  //   if (filledFields === 9) className += " full";
  //   else if (filledFields > 0) className += " half";
  //   if (roomId === activeRoom) className += " active";

  //   return className;
  // };

  const getRoomClass = (roomId, field) => {
    const room = inspectionData[roomId];
    let className = "room-button";

    // If isAllowForInspection is "no", only add "notallowed" class
    if (room.isAllowForInspection === "no") {
      className += " notallowed";
    } else {
      // Otherwise, proceed with the original logic
      const filledFields = [
        room.seepage,
        room.seepageRemark,
        room.termites,
        room.termitesRemark,
        room.otherIssue,
        room.otherIssueRemark,
        // room.generalRemark,
        room.cleanRemark,
        room.images?.length > 0,
      ].filter(Boolean).length;

      if (filledFields === 8) className += " full";
      else if (filledFields > 0) className += " half";

      // Add class for each individual field
      if (room[field]) {
        className += ` filled`;
      } else {
        className += ` notfilled`;
      }
    }

    // Add 'active' if this roomId matches activeRoom
    if (roomId === activeRoom) className += " active";

    return className;
  };

  const getFieldClass = (roomId, field) => {
    const roomData = inspectionData?.[roomId] || {};

    if (field === "image") {
      return roomData.images && roomData.images.length > 0
        ? "filled"
        : "notfilled";
    }

    return roomData[field] && roomData[field].trim() !== ""
      ? "filled"
      : "notfilled";
  };

  const isFinalSubmitEnabled = () => {
    return (
      allBillInspectionComplete && // Ensures all bill inspections are complete
      Object.values(inspectionData).every((room) => {
        // If inspection is not allowed, skip field validation
        if (room.isAllowForInspection === "no") {
          // return true;
          return room.generalRemark;
        }

        // For allowed rooms, perform field validation
        return (
          room.seepage &&
          room.termites &&
          room.otherIssue &&
          room.seepageRemark &&
          room.termitesRemark &&
          room.otherIssueRemark &&
          // room.generalRemark &&
          room.cleanRemark &&
          room.images?.length > 0 // Ensures every allowed room has at least 1 image uploaded
        );
      })
    );
  };

  // code for check is all layoutinsection done or not start
  const [layoutInspectionDone, setLayoutInspectionDone] = useState(false);

  const isAllLayoutInspectionDone = useCallback(() => {
    const allRoomsInspected = Object.values(inspectionData).every((room) => {
      if (room.isAllowForInspection === "no") {
        return Boolean(room.generalRemark); // Ensures generalRemark is truthy
      }

      return (
        Boolean(room.seepage) &&
        Boolean(room.termites) &&
        Boolean(room.otherIssue) &&
        Boolean(room.seepageRemark) &&
        Boolean(room.termitesRemark) &&
        Boolean(room.otherIssueRemark) &&
        Boolean(room.cleanRemark) &&
        room.images?.length > 0 // Ensures at least 1 image uploaded
      );
    });

    if (layoutInspectionDone !== allRoomsInspected) {
      setLayoutInspectionDone(allRoomsInspected); // Update state only if needed
    }

    return allRoomsInspected;
  }, [inspectionData, layoutInspectionDone]);

  useEffect(() => {
    isAllLayoutInspectionDone();
  }, [inspectionData]);

  // code for check is all layoutinsection done or not end

  // general remark ko no krne pr remark ko mandatory krna
  // const isFinalSubmitEnabled = () => {
  //   if (!allBillInspectionComplete) return false; // Ensure all bill inspections are done

  //   return Object.values(inspectionData).every((room) => {
  //     const isNotAllowed = room.isAllowForInspection === "no";

  //     // If inspection is not allowed, only 'remark' is required
  //     if (isNotAllowed) return room.generalRemark?.trim() !== "";

  //     // If inspection is allowed, check all required fields
  //     const requiredFields = [
  //       room.seepage,
  //       room.termites,
  //       room.otherIssue,
  //       room.seepageRemark,
  //       room.termitesRemark,
  //       room.otherIssueRemark,
  //       room.generalRemark,
  //       room.cleanRemark,
  //       room.images?.length > 0,
  //     ];

  //     return requiredFields.every(Boolean);
  //   });
  // };

  const handleSave = async () => {
    setIsDataSaving(true);

    try {
      await projectFirestore
        .collection("inspections")
        .doc(inspectionId)
        .update({
          rooms: Object.values(inspectionData),
          lastUpdatedAt: timestamp.now(),
          lastUpdatedBy: user.uid,
          layoutInspectionDone,
          updatedInformation: firebase.firestore.FieldValue.arrayUnion({
            updatedAt: timestamp.now(),
            updatedBy: user.uid,
          }),
        });
      setIsDataSaving(false);
      setAfterSaveModal(true);
    } catch (error) {
      console.error("Error saving inspection:", error);
    } finally {
      setIsDataSaving(false);
    }
  };

  const handleFinalSubmit = async () => {
    setFinalSubmiting(true);
    handleSaveBill(); // Save bills before final submit
    try {
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
            updatedBy: user.uid,
          }),
        });
      navigate(`/inspection-report/${inspectionId}`);
      setFinalSubmiting(false);
      setFinalSubmit(false);
    } catch (error) {
      console.error("Error in final submit:", error);
    } finally {
      setFinalSubmiting(false);
      setFinalSubmit(false);
    }
  };

  // bill inspection code start
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isBillAvailable, setIsBillAvailable] = useState(null);
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [isBillDataSaving, setIsBillDataSaving] = useState(false);
  const [billInspectionData, setBillInspectionData] = useState({});
  const [allBillInspectionComplete, setAllBillInspectionComplete] =
    useState(false);

  // Function to check if all bills are "full"
  useEffect(() => {
    const allBillInspectionFull = bills.every((bill) => bill.status === "full");
    setAllBillInspectionComplete(allBillInspectionFull);
  }, [bills]);

  // Fetch bills and preload inspection data
  useEffect(() => {
    if (!propertyId || !inspectionId) return;

    const fetchData = async () => {
      try {
        // Fetch bills
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

        // Fetch inspection data
        const inspectionDoc = await projectFirestore
          .collection("inspections")
          .doc(inspectionId)
          .get();

        if (inspectionDoc.exists) {
          setBillInspectionData(inspectionDoc.data()?.bills || {});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [propertyId, inspectionId]);

  // Handle Bill Type Button Click (No unnecessary re-rendering)
  const handleBillTypeClick = (bill) => {
    if (selectedBill?.id === bill.id) return; // Do nothing if the same bill is clicked

    setSelectedBill(bill);

    // Load data for the selected bill
    const billData = billInspectionData?.[bill.id] || {};
    setIsBillAvailable(billData.isBillAvailable ?? null);
    setAmount(billData.amount || "");
    setRemark(billData.remark || "");
  };

  // Track bill field changes
  useEffect(() => {
    if (!selectedBill) return;

    // Temporary state update for UI feedback
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

  // Function to check if all bills are "full"
  // useEffect(() => {
  //   const allBillInspectionFull =
  //     bills.length > 0 &&
  //     bills.every((bill) => {
  //       const billData = billInspectionData?.[bill.id] || {};
  //       return (
  //         billData.isBillAvailable !== null &&
  //         (!billData.isBillAvailable ||
  //           (billData.amount && billData.amount > 0)) &&
  //         billData.remark
  //       );
  //     });

  //   setAllBillInspectionComplete(allBillInspectionFull);
  // }, [bills, billInspectionData]);
  useEffect(() => {
    const allBillInspectionFull =
      bills.length > 0 &&
      bills.every((bill) => {
        const billData = billInspectionData?.[bill.id] || {};
        return billData.amount && billData.amount && billData.remark;
      });

    setAllBillInspectionComplete(allBillInspectionFull);
  }, [bills, billInspectionData]);

  // Function to calculate the progress-based class for a bill button
  // const getBillButtonClass = (bill) => {
  //   const billData = billInspectionData?.[bill.id] || {};

  //   // Checking availability properly
  //   const isAvailable =
  //     billData.isBillAvailable !== undefined ? billData.isBillAvailable : null;
  //   const amountValid = billData.amount && billData.amount > 0;
  //   const hasRemark = billData.remark && billData.remark.trim() !== "";

  //   // Check if all fields are filled properly
  //   const isAllFieldsFilled =
  //     isAvailable !== null &&
  //     (isAvailable === "no" || amountValid) &&
  //     hasRemark;
  //   const isAnyFieldFilled = isAvailable !== null || amountValid || hasRemark;

  //   let className = "room-button";

  //   if (isAllFieldsFilled) {
  //     className += " full"; // Sabhi fields bharne par full class
  //   } else if (isAnyFieldFilled) {
  //     className += " half"; // Koi bhi ek field bharne par half class
  //   }

  //   if (selectedBill?.id === bill.id) {
  //     className += " active";
  //   }

  //   return className;
  // };
  // const getBillButtonClass = (bill) => {
  //   const billData = billInspectionData?.[bill.id] || {};

  //   // Checking availability
  //   const isAvailable = billData.isBillAvailable;
  //   const hasRemark = billData.remark?.trim() !== "";

  //   // Only check amount if bill is available
  //   const amountValid = isAvailable === "yes" ? billData.amount && billData.amount > 0 : true;

  //   // If isAvailable is "no", only remark needs to be filled
  //   const isAllFieldsFilled = isAvailable !== undefined && amountValid && hasRemark;

  //   const isAnyFieldFilled = isAvailable !== undefined || hasRemark || billData.amount;

  //   let className = "room-button";

  //   if (isAllFieldsFilled) {
  //     className += " full"; // Sabhi fields bharne par full class
  //   } else if (isAnyFieldFilled) {
  //     className += " half"; // Koi bhi ek field bharne par half class
  //   }

  //   if (selectedBill?.id === bill.id) {
  //     className += " active";
  //   }

  //   return className;
  // };
  // const getBillButtonClass = (bill) => {
  //   const billData = billInspectionData?.[bill.id] || {};

  //   // Checking availability
  //   const isAvailable = billData.isBillAvailable; // 'yes' or 'no'
  //   const hasRemark = billData.remark?.trim() !== "";

  //   // Check amount only if available is 'yes'
  //   const amountValid = isAvailable === "yes" ? billData.amount && billData.amount > 0 : true;

  //   // Final logic for all fields filled
  //   const isAllFieldsFilled =
  //     isAvailable !== undefined && // Ensure availability is selected
  //     hasRemark && // Remark must be filled
  //     (isAvailable === "no" || amountValid); // Amount check only when 'yes'

  //   const isAnyFieldFilled = isAvailable !== undefined || hasRemark || billData.amount;

  //   let className = "room-button";

  //   if (isAllFieldsFilled) {
  //     className += " full"; // All required fields are filled
  //   } else if (isAnyFieldFilled) {
  //     className += " half"; // Some fields are filled
  //   }

  //   if (selectedBill?.id === bill.id) {
  //     className += " active";
  //   }

  //   return className;
  // };

  // Save Data
  const getBillButtonClass = (bill) => {
    const billData = billInspectionData?.[bill.id] || {};

    // Check if amount and remark are valid
    const amountValid = billData.amount && billData.amount; // Amount must be greater than 0
    const hasRemark = billData.remark && billData.remark.trim() !== ""; // Remark must not be empty

    // Check if all required fields are filled
    const isAllFieldsFilled = amountValid && hasRemark;

    // Check if any field is filled
    const isAnyFieldFilled = amountValid || hasRemark;

    let className = "room-button";

    if (isAllFieldsFilled) {
      className += " full"; // Sabhi fields bharne par full class
    } else if (isAnyFieldFilled) {
      className += " half"; // Koi bhi ek field bharne par half class
    }

    if (selectedBill?.id === bill.id) {
      className += " active"; // Active class for selected bill
    }

    return className;
  };
  const getBillFieldClass = (billId, field) => {
    const billData = billInspectionData?.[billId] || {};
    return billData[field] && billData[field].trim() !== ""
      ? "filled"
      : "notfilled";
  };

  // const handleBillImageUpload = async (e, billId) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   try {
  //     // Compress the image
  //     const compressedFile = await imageCompression(file, {
  //       maxSizeMB: 1, // Maximum file size in MB
  //       maxWidthOrHeight: 1024, // Resize image if required
  //       useWebWorker: true, // Use web worker for better performance
  //     });

  //     // Generate file path
  //     const filePath = `billImages/${billId}-${Date.now()}`;
  //     const storageRef = projectStorage.ref(filePath);
  //     const uploadTask = storageRef.put(compressedFile);

  //     uploadTask.on(
  //       "state_changed",
  //       null,
  //       (error) => console.error("Upload error:", error),
  //       async () => {
  //         try {
  //           // Get download URL once upload is complete
  //           const url = await storageRef.getDownloadURL();

  //           // Update the selected bill with the image URL
  //           setBillInspectionData((prevData) => ({
  //             ...prevData,
  //             [billId]: {
  //               ...(prevData[billId] || {}),
  //               imageUrl: url,
  //             },
  //           }));
  //         } catch (error) {
  //           console.error("Error getting download URL:", error);
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Image compression error:", error);
  //   }
  // };

  // const handleBillImageDelete = async (billId) => {
  //   const billData = billInspectionData?.[billId];
  //   const imageUrl = billData?.imageUrl;

  //   if (!imageUrl) return;

  //   try {
  //     const filePath = decodeURIComponent(
  //       imageUrl.split("/").slice(-1)[0].split("?")[0]
  //     );
  //     const storageRef = projectStorage.ref(filePath);
  //     await storageRef.delete();

  //     // Remove the image URL from the bill data
  //     setBillInspectionData((prevData) => ({
  //       ...prevData,
  //       [billId]: {
  //         ...(prevData[billId] || {}),
  //         imageUrl: "",
  //       },
  //     }));
  //   } catch (error) {
  //     console.error("Error deleting image:", error);
  //   }
  // };

  // const handleSaveBill = async () => {
  //   if (!selectedBill) return;

  //   setIsBillDataSaving(true);

  //   try {
  //     const updatedBillData = {
  //       billId: selectedBill.billId,
  //       billType: selectedBill.billType,
  //       authorityName: selectedBill.authorityName,
  //       isBillAvailable,
  //       // amount: isBillAvailable ? amount : null,
  //       amount:amount,
  //       remark,
  //       lastUpdatedAt: timestamp.now(),
  //       lastUpdatedBy: user.uid,
  //       updatedInformation: firebase.firestore.FieldValue.arrayUnion({
  //         updatedAt: timestamp.now(),
  //         updatedBy: user.uid,
  //       }),
  //     };

  //     await projectFirestore
  //       .collection("inspections")
  //       .doc(inspectionId)
  //       .update({
  //         [`bills.${selectedBill.id}`]: updatedBillData,
  //       });

  //     // Update local state to reflect changes
  //     setBillInspectionData((prevData) => ({
  //       ...prevData,
  //       [selectedBill.id]: updatedBillData,
  //     }));

  //     setAfterSaveModal(true);
  //   } catch (error) {
  //     console.error("Error saving bill data:", error);
  //   } finally {
  //     setIsBillDataSaving(false);
  //   }
  // };

  // const handleSaveBill = async () => {
  //   if (!selectedBill) return;

  //   setIsBillDataSaving(true);

  //   try {
  //     const updatedBillData = {
  //       billId: selectedBill.billId,
  //       billType: selectedBill.billType,
  //       authorityName: selectedBill.authorityName,
  //       amount,
  //       remark,
  //       imageUrl: billInspectionData[selectedBill.id]?.imageUrl || null,
  //       lastUpdatedAt: timestamp.now(),
  //       lastUpdatedBy: user.uid,
  //       updatedInformation: firebase.firestore.FieldValue.arrayUnion({
  //         updatedAt: timestamp.now(),
  //         updatedBy: user.uid,
  //       }),
  //     };

  //     await projectFirestore
  //       .collection("inspections")
  //       .doc(inspectionId)
  //       .update({
  //         [`bills.${selectedBill.id}`]: updatedBillData,
  //       });

  //     setBillInspectionData((prevData) => ({
  //       ...prevData,
  //       [selectedBill.id]: updatedBillData,
  //     }));

  //     setAfterSaveModal(true);
  //   } catch (error) {
  //     console.error("Error saving bill data:", error);
  //   } finally {
  //     setIsBillDataSaving(false);
  //   }
  // };

  const handleBillImageUpload = async (e, billId) => {
    const file = e.target.files[0];
    if (!file) return;
    // Allowed image formats
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG and PNG files are allowed.");
      return;
    }
    try {
      setImageActionStatus("uploading"); // Start uploading modal

      // Compress the image
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
          setImageActionStatus(null); // Hide modal on error
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
            setImageActionStatus(null); // Hide modal on success
          } catch (error) {
            console.error("Error getting download URL:", error);
            setImageActionStatus(null); // Hide modal on error
          }
        }
      );
    } catch (error) {
      console.error("Image compression error:", error);
      setImageActionStatus(null); // Hide modal on error
    }
  };

  const handleBillImageDelete = async (billId) => {
    const billData = billInspectionData?.[billId];
    const imageUrl = billData?.imageUrl;
    if (!imageUrl) return;

    try {
      setImageActionStatus("deleting"); // Start deleting modal

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

      setImageActionStatus(null); // Hide modal on success
    } catch (error) {
      console.error("Error deleting image:", error);
      setImageActionStatus(null); // Hide modal on error
    }
  };

  // const handleSaveBill = async () => {
  //   if (!bills.length) return;

  //   setIsBillDataSaving(true);

  //   try {
  //     const updatedBills = {};

  //     bills.forEach((bill) => {
  //       if (billInspectionData[bill.id]) {
  //         updatedBills[`bills.${bill.id}`] = {
  //           ...billInspectionData[bill.id],
  //           lastUpdatedAt: timestamp.now(),
  //           lastUpdatedBy: user.uid,
  //           updatedInformation: firebase.firestore.FieldValue.arrayUnion({
  //             updatedAt: timestamp.now(),
  //             updatedBy: user.uid,
  //           }),
  //         };
  //       }
  //     });

  //     await projectFirestore
  //       .collection("inspections")
  //       .doc(inspectionId)
  //       .update(updatedBills);

  //     setAfterSaveModal(true);
  //   } catch (error) {
  //     console.error("Error saving all bill data:", error);
  //   } finally {
  //     setIsBillDataSaving(false);
  //   }
  // };

  // const handleSaveBill = async () => {
  //   if (!bills.length) return;

  //   setIsBillDataSaving(true);

  //   try {
  //     const updatedBills = { ...billInspectionData };

  //     bills.forEach((bill) => {
  //       updatedBills[bill.id] = {
  //         ...(billInspectionData[bill.id] || {}),
  //         billId: bill.billId,
  //         billDocId: bill.billDocId,
  //         billType: bill.billType,
  //         authorityName: bill.authorityName,
  //         billWebsiteLink: bill.billWebsiteLink,
  //         billUpdatedAt: timestamp.now(),
  //         billUpdatedBy: user.uid,

  //       };
  //     });

  //     await projectFirestore
  //       .collection("inspections")
  //       .doc(inspectionId)
  //       .update({
  //         bills: updatedBills, // ✅ Object format maintain kiya
  //         lastUpdatedAt: timestamp.now(),
  //         lastUpdatedBy: user.uid,
  //         allBillInspectionComplete,
  //         updatedInformation: firebase.firestore.FieldValue.arrayUnion({
  //           updatedAt: timestamp.now(),
  //           updatedBy: user.uid,
  //         }),
  //       });

  //     setAfterSaveModal(true);
  //   } catch (error) {
  //     console.error("Error saving all bill data:", error);
  //   } finally {
  //     setIsBillDataSaving(false);
  //   }
  // };

  const handleSaveBill = async () => {
    if (!bills.length) return; // 🔹 Agar koi bill hi nahi hai to kuch mat karo
  
    setIsBillDataSaving(true);
  
    try {
      const updatedBills = { ...billInspectionData }; // 🔹 Pehle ka data preserve karein
  
      bills.forEach((bill) => {
        const prevBillData = billInspectionData[bill.id] || {}; // 🔹 Existing data
        const newBillData = {
          billId: bill.billId,
          billDocId: bill.billDocId,
          billType: bill.billType,
          authorityName: bill.authorityName,
          billWebsiteLink: bill.billWebsiteLink,
        };
  
        // ✅ **Sirf wahi fields update karo jo change hui hain**
        const changedFields = {};
        Object.keys(newBillData).forEach((key) => {
          if (newBillData[key] !== prevBillData[key]) {
            changedFields[key] = newBillData[key];
          }
        });
  
        // ✅ **Agar koi field change hui hai to `thisBillUpdatedAt` aur `thisBillUpdatedBy` bhi update ho**
        if (Object.keys(changedFields).length > 0) {
          changedFields.thisBillUpdatedAt = timestamp.now();
          changedFields.thisBillUpdatedBy = user.uid;
        }
  
        updatedBills[bill.id] = {
          ...(prevBillData || {}), // 🔹 Pehle ka data rakho
          ...changedFields, // 🔹 Sirf changed fields update ho
        };
      });
  
      // ✅ **Firestore me saara data update ho ek saath**
      await projectFirestore
        .collection("inspections")
        .doc(inspectionId)
        .update({
          bills: updatedBills, // ✅ **Pura `bills` object update ho raha hai**
          lastUpdatedAt: timestamp.now(),
          lastUpdatedBy: user.uid,
          allBillInspectionComplete,
          updatedInformation: firebase.firestore.FieldValue.arrayUnion({
            updatedAt: timestamp.now(),
            updatedBy: user.uid,
          }),
        });
  
      setAfterSaveModal(true);
    } catch (error) {
      console.error("Error saving all bill data:", error);
    } finally {
      setIsBillDataSaving(false);
    }
  };

  

  // if final submit redirect to viewall inspection page
  useEffect(() => {
    if (inspectionDocument?.finalSubmit) {
      navigate(`/inspection/${propertyId}`);
    }
  }, [inspectionDocument?.finalSubmit, navigate]);

  // fetch realtime database data of inspection
  const [inspectionDatabaseData, setInspectionDatabaseData] = useState(null); // 🔹 Firestore data store karega

  useEffect(() => {
    if (!inspectionId) return; // ✅ Agar `inspectionId` nahi hai to kuch mat karo
  
    const timeoutId = setTimeout(() => {
      const unsubscribe = projectFirestore
        .collection("inspections")
        .doc(inspectionId)
        .onSnapshot(
          (doc) => {
            if (doc.exists) {
              setInspectionDatabaseData(doc.data()); // ✅ Real-time update hoga
            } else {
              console.warn("Inspection document not found.");
            }
          },
          (error) => {
            console.error("Error fetching real-time inspection data:", error);
          }
        );
  
      return () => unsubscribe(); // ✅ Cleanup function for memory optimization
    }, 3000); // ⏳ **3-second delay**
  
    return () => clearTimeout(timeoutId); // ✅ Cleanup timeout on unmount
  }, [inspectionId]); // 🔥 Jab bhi `inspectionId` change hoga, ye effect trigger hoga
  

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
                    {/* <div className="inspection_type_img text-center mt-3">
                      <img
                        src={
                          inspectionType === "Regular"
                            ? "/assets/img/regular.png"
                            : inspectionType === "Move-In"
                            ? "/assets/img/movein.png"
                            : inspectionType === "Move-Out"
                            ? "/assets/img/moveout.png"
                            : "/assets/img/full.png" // Default image
                        }
                        alt={`${inspectionType} Inspection`}
                      />
                    </div> */}
                    <div className="inspection_type_buttons">
                      <button
                        onClick={() => setActiveInspection("layout")}
                        className={`${
                          activeInspection === "layout" ? "active " : ""
                        }${layoutInspectionDone ? "done" : ""}`}
                      >
                        Layout Inspection
                        <img src="/assets/img/icons/check-mark.png" alt="" />
                      </button>

                      <button
                        onClick={() => setActiveInspection("bill")}
                        className={`${
                          activeInspection === "bill" ? "active " : ""
                        }${allBillInspectionComplete ? "done" : ""}`}
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
              {activeInspection === "layout" && (
                <>
                  <div className="room-buttons">
                    {rooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setActiveRoom(room.id)}
                        className={getRoomClass(room.id)}
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
                            <div className="bi_icon half">
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
                    ))}
                  </div>
                  <div className="vg22"></div>
                  {activeRoom && (
                    <div>
                      {/* plz don,t remove this commented code  */}
                      {/* <h3>
                    {rooms.find((room) => room.id === activeRoom)?.roomName}
                  </h3> */}
                      <form className="add_inspection_form">
                        <div className="aai_form">
                          <div className="row row_gap_20">
                            <div className="col-xl-3 col-md-6">
                              <div
                                className={`form_field w-100 ${getFieldClass(
                                  activeRoom,
                                  "isAllowForInspection"
                                )}`}
                                style={{
                                  padding: "10px",
                                  borderRadius: "5px",
                                  background: "white",
                                }}
                              >
                                <h6
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    marginBottom: "8px",
                                    color: "var(--theme-blue)",
                                  }}
                                >
                                  Tenant Allowed for Inspection*
                                </h6>
                                <div className="field_box theme_radio_new">
                                  <div className="theme_radio_container">
                                    <div className="radio_single">
                                      <input
                                        type="radio"
                                        name={`isAllowForInspection-${activeRoom}`}
                                        id={`owner-yes-${activeRoom}`}
                                        value="yes"
                                        checked={
                                          inspectionData[activeRoom]
                                            ?.isAllowForInspection === "yes"
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            activeRoom,
                                            "isAllowForInspection",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <label
                                        htmlFor={`owner-yes-${activeRoom}`}
                                      >
                                        Yes
                                      </label>
                                    </div>
                                    <div className="radio_single">
                                      <input
                                        type="radio"
                                        name={`isAllowForInspection-${activeRoom}`}
                                        id={`owner-no-${activeRoom}`}
                                        value="no"
                                        checked={
                                          inspectionData[activeRoom]
                                            ?.isAllowForInspection === "no"
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            activeRoom,
                                            "isAllowForInspection",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <label htmlFor={`owner-no-${activeRoom}`}>
                                        No
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {inspectionData[activeRoom]
                              ?.isAllowForInspection === "yes" && (
                              <div className="col-xl-3 col-md-6">
                                <div
                                  className={`form_field w-100 ${getFieldClass(
                                    activeRoom,
                                    "seepage"
                                  )}`}
                                  style={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    background: "white",
                                  }}
                                >
                                  <h6
                                    style={{
                                      fontSize: "15px",
                                      fontWeight: "500",
                                      marginBottom: "8px",
                                      color: "var(--theme-blue)",
                                    }}
                                  >
                                    Seepage*
                                  </h6>
                                  <div className="field_box theme_radio_new">
                                    <div className="theme_radio_container">
                                      <div className="radio_single">
                                        <input
                                          type="radio"
                                          name={`seepage-${activeRoom}`}
                                          id={`seepage-yes-${activeRoom}`}
                                          value="yes"
                                          checked={
                                            inspectionData[activeRoom]
                                              ?.seepage === "yes"
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              activeRoom,
                                              "seepage",
                                              e.target.value
                                            )
                                          }
                                        />
                                        <label
                                          htmlFor={`seepage-yes-${activeRoom}`}
                                        >
                                          Yes
                                        </label>
                                      </div>
                                      <div className="radio_single">
                                        <input
                                          type="radio"
                                          name={`seepage-${activeRoom}`}
                                          value="no"
                                          id={`seepage-no-${activeRoom}`}
                                          checked={
                                            inspectionData[activeRoom]
                                              ?.seepage === "no"
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              activeRoom,
                                              "seepage",
                                              e.target.value
                                            )
                                          }
                                        />
                                        <label
                                          htmlFor={`seepage-no-${activeRoom}`}
                                        >
                                          No
                                        </label>
                                      </div>
                                    </div>

                                    {inspectionData[activeRoom]?.seepage ===
                                      "yes" && (
                                      <>
                                        <div className="vg12"></div>
                                        <textarea
                                          placeholder="Seepage Remark*"
                                          className={`w-100 ${getFieldClass(
                                            activeRoom,
                                            "seepageRemark"
                                          )}`}
                                          value={
                                            inspectionData[activeRoom]
                                              ?.seepageRemark || ""
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              activeRoom,
                                              "seepageRemark",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            {inspectionData[activeRoom]
                              ?.isAllowForInspection === "yes" && (
                              <div className="col-xl-3 col-md-6">
                                <div
                                  className={`form_field w-100 ${getFieldClass(
                                    activeRoom,
                                    "termites"
                                  )}`}
                                  style={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    background: "white",
                                  }}
                                >
                                  <h6
                                    style={{
                                      fontSize: "15px",
                                      fontWeight: "500",
                                      marginBottom: "8px",
                                      color: "var(--theme-blue)",
                                    }}
                                  >
                                    Termites*
                                  </h6>
                                  <div className="field_box theme_radio_new">
                                    <div className="theme_radio_container">
                                      <div className="radio_single">
                                        <input
                                          type="radio"
                                          id={`Termites-yes-${activeRoom}`}
                                          name={`termites-${activeRoom}`}
                                          value="yes"
                                          checked={
                                            inspectionData[activeRoom]
                                              ?.termites === "yes"
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              activeRoom,
                                              "termites",
                                              e.target.value
                                            )
                                          }
                                        />
                                        <label
                                          htmlFor={`Termites-yes-${activeRoom}`}
                                        >
                                          Yes
                                        </label>
                                      </div>
                                      <div className="radio_single">
                                        <input
                                          id={`Termites-no-${activeRoom}`}
                                          type="radio"
                                          name={`termites-${activeRoom}`}
                                          value="no"
                                          checked={
                                            inspectionData[activeRoom]
                                              ?.termites === "no"
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              activeRoom,
                                              "termites",
                                              e.target.value
                                            )
                                          }
                                        />
                                        <label
                                          htmlFor={`Termites-no-${activeRoom}`}
                                        >
                                          No
                                        </label>
                                      </div>
                                    </div>

                                    {inspectionData[activeRoom]?.termites ===
                                      "yes" && (
                                      <>
                                        <div className="vg12"></div>
                                        <textarea
                                          // placeholder="Termites Remark*(mandatory)"
                                          placeholder="Termites Remark*"
                                          value={
                                            inspectionData[activeRoom]
                                              ?.termitesRemark || ""
                                          }
                                          className={`w-100 ${getFieldClass(
                                            activeRoom,
                                            "termitesRemark"
                                          )}`}
                                          onChange={(e) =>
                                            handleChange(
                                              activeRoom,
                                              "termitesRemark",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            {inspectionData[activeRoom]
                              ?.isAllowForInspection === "yes" && (
                              <div className="col-xl-3 col-md-6">
                                <div
                                  className={`form_field w-100 ${getFieldClass(
                                    activeRoom,
                                    "otherIssue"
                                  )}`}
                                  style={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    background: "white",
                                  }}
                                >
                                  <h6
                                    style={{
                                      fontSize: "15px",
                                      fontWeight: "500",
                                      marginBottom: "8px",
                                      color: "var(--theme-blue)",
                                    }}
                                  >
                                    Other Issue*
                                  </h6>
                                  <div className="field_box theme_radio_new">
                                    <div className="theme_radio_container">
                                      <div className="radio_single">
                                        <input
                                          id={`other-issue-yes-${activeRoom}`}
                                          type="radio"
                                          name={`otherIssue-${activeRoom}`}
                                          value="yes"
                                          checked={
                                            inspectionData[activeRoom]
                                              ?.otherIssue === "yes"
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              activeRoom,
                                              "otherIssue",
                                              e.target.value
                                            )
                                          }
                                        />
                                        <label
                                          htmlFor={`other-issue-yes-${activeRoom}`}
                                        >
                                          Yes
                                        </label>
                                      </div>
                                      <div className="radio_single">
                                        <input
                                          id={`other-issue-no-${activeRoom}`}
                                          type="radio"
                                          name={`otherIssue-${activeRoom}`}
                                          value="no"
                                          checked={
                                            inspectionData[activeRoom]
                                              ?.otherIssue === "no"
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              activeRoom,
                                              "otherIssue",
                                              e.target.value
                                            )
                                          }
                                        />
                                        <label
                                          htmlFor={`other-issue-no-${activeRoom}`}
                                        >
                                          No
                                        </label>
                                      </div>
                                    </div>

                                    {inspectionData[activeRoom]?.otherIssue ===
                                      "yes" && (
                                      <>
                                        <div className="vg12"></div>
                                        <textarea
                                          placeholder="Other Issue Remark*"
                                          value={
                                            inspectionData[activeRoom]
                                              ?.otherIssueRemark || ""
                                          }
                                          className={`w-100 ${getFieldClass(
                                            activeRoom,
                                            "otherIssueRemark"
                                          )}`}
                                          onChange={(e) =>
                                            handleChange(
                                              activeRoom,
                                              "otherIssueRemark",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            {inspectionData[activeRoom]
                              ?.isAllowForInspection === "yes" && (
                              <div className="col-xl-3 col-md-6">
                                <div
                                  className={`form_field w-100 ${getFieldClass(
                                    activeRoom,
                                    "cleanRemark"
                                  )}`}
                                  style={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    background: "white",
                                  }}
                                >
                                  <h6
                                    style={{
                                      fontSize: "15px",
                                      fontWeight: "500",
                                      marginBottom: "8px",
                                      color: "var(--theme-blue)",
                                    }}
                                  >
                                    Cleaning Remark*
                                  </h6>
                                  <div className="field_box theme_radio_new">
                                    <textarea
                                      style={{
                                        minHeight: "104px",
                                      }}
                                      placeholder="Cleaning Remark"
                                      value={
                                        inspectionData[activeRoom]
                                          ?.cleanRemark || ""
                                      }
                                      className="w-100"
                                      onChange={(e) =>
                                        handleChange(
                                          activeRoom,
                                          "cleanRemark",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="col-xl-3 col-md-6">
                              <div
                                className={`form_field w-100 ${
                                  inspectionData[activeRoom]
                                    ?.isAllowForInspection === "yes"
                                    ? "filled"
                                    : getFieldClass(activeRoom, "generalRemark")
                                }`}
                                style={{
                                  padding: "10px",
                                  borderRadius: "5px",
                                  background: "white",
                                }}
                              >
                                <h6
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    marginBottom: "8px",
                                    color: "var(--theme-blue)",
                                  }}
                                >
                                  General Remark
                                  {inspectionData[activeRoom]
                                    ?.isAllowForInspection === "yes"
                                    ? ""
                                    : "*"}
                                </h6>
                                <div className="field_box theme_radio_new">
                                  <textarea
                                    style={{
                                      minHeight: "104px",
                                    }}
                                    placeholder="General Remark"
                                    value={
                                      inspectionData[activeRoom]
                                        ?.generalRemark || ""
                                    }
                                    className="w-100"
                                    onChange={(e) =>
                                      handleChange(
                                        activeRoom,
                                        "generalRemark",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            {inspectionData[activeRoom]
                              ?.isAllowForInspection === "yes" && (
                              <div className="col-12">
                                {/* Image Upload and Preview Section */}
                                <div
                                  style={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    background: "white",
                                  }}
                                  className={`form_field w-100 ${getFieldClass(
                                    activeRoom,
                                    "image"
                                  )}`}
                                >
                                  <h6
                                    style={{
                                      fontSize: "15px",
                                      fontWeight: "500",
                                      marginBottom: "8px",
                                      color: "var(--theme-blue)",
                                    }}
                                  >
                                    Upload images*{" "}
                                    <span
                                      style={{
                                        fontSize: "13px",
                                      }}
                                    >
                                      (A minimum of 1 and a maximum of 10 images
                                      can be uploaded.)
                                    </span>
                                  </h6>
                                  <div className="add_and_images">
                                    {inspectionData[activeRoom]?.images?.map(
                                      (image, index) => (
                                        <div
                                          key={index}
                                          className="uploaded_images relative"
                                        >
                                          <img src={image.url} alt="Uploaded" />
                                          <div className="trash_icon">
                                            <FaTrash
                                              size={14}
                                              color="red"
                                              onClick={() =>
                                                handleImageDelete(
                                                  activeRoom,
                                                  image
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      )
                                    )}
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
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
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
                        {inspectionDatabaseData &&
                            inspectionDatabaseData.layoutInspectionDone &&
                            inspectionDatabaseData.allBillInspectionComplete && (
                              <button
                                className="theme_btn no_icon btn_fill2 full_width"
                                onClick={() => setFinalSubmit(true)}
                                disabled={!isFinalSubmitEnabled()}
                                style={{
                                  opacity: !isFinalSubmitEnabled() ? 0.3 : 1,
                                  cursor: !isFinalSubmitEnabled()
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                              >
                                Final Submit
                              </button>
                            )}

                          <button
                            className="theme_btn no_icon btn_fill full_width"
                            onClick={handleSave}
                            disabled={isDataSaving}
                            style={{
                              opacity: isDataSaving ? "0.5" : "1",
                            }}
                          >
                            {isDataSaving ? "Saving...." : "Save Inspection"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeInspection === "bill" && (
                <div className="bill_inspection">
                  {/* {allBillInspectionComplete && (
                    <h1 style={{ color: "green", fontWeight: "bold" }}>
                      All Done
                    </h1>
                  )} */}

                  {/* Display Bill Type Buttons */}
                  <div className="room-buttons">
                    {bills.map((bill) => (
                      <button
                        key={bill.id}
                        onClick={() => handleBillTypeClick(bill)}
                        className={` ${getBillButtonClass(bill)}`}
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
                            <div className="bi_icon half">
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
                          </div>
                          <div className="btn_text">
                            <h6 className="add">Start</h6>
                            <h6 className="half">In Progress</h6>
                            <h6 className="full">Completed</h6>
                          </div>
                        </div>
                        <div className="room_name">{bill.billType}</div>
                      </button>
                    ))}
                  </div>
                  <div className="vg22"></div>
                  {/* Display Bill Fields */}
                  {selectedBill && (
                    <div className="bill_fields">
                      <div className="id_name">
                        <div className="idn_single">
                          <h6>Bill ID</h6>
                          <h5>{selectedBill.billId}</h5>
                        </div>
                        <div className="idn_single">
                          <h6>Authority name</h6>
                          <h5>{selectedBill.authorityName}</h5>
                        </div>
                        {selectedBill.billWebsiteLink && (
                          <div
                            className="idn_single"
                            style={{
                              maxWidth: "200px",
                            }}
                          >
                            <h6>Bill Website Link</h6>
                            <h5
                              style={{
                                fontWeight: "400",
                              }}
                            >
                              <Link
                                className="sub_title text_green"
                                target="_blank"
                                to={selectedBill.billWebsiteLink}
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {selectedBill.billWebsiteLink}
                              </Link>
                            </h5>
                          </div>
                        )}
                      </div>
                      <div className="vg22"></div>
                      <form className="add_inspection_form">
                        <div className="aai_form">
                          <div className="row row_gap_20">
                            <div className="col-xl-3 col-md-6">
                              <div
                                className={`form_field w-100 ${getBillFieldClass(
                                  selectedBill?.id,
                                  "amount"
                                )}`}
                                style={{
                                  padding: "10px",
                                  borderRadius: "5px",
                                  background: "white",
                                }}
                              >
                                <h6
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    marginBottom: "8px",
                                    color: "var(--theme-blue)",
                                  }}
                                >
                                  Amount*
                                </h6>
                                <div className="field_box theme_radio_new">
                                  {/* <div className="theme_radio_container">
                                    <div className="radio_single">
                                      <input
                                        type="radio"
                                        value="Yes"
                                        id={`yes-${selectedBill.billType}`}
                                        checked={isBillAvailable === true}
                                        onChange={() => {
                                          setIsBillAvailable(true);
                                        }}
                                      />
                                      <label
                                        htmlFor={`yes-${selectedBill.billType}`}
                                      >
                                        Yes
                                      </label>
                                    </div>
                                    <div className="radio_single">
                                      <input
                                        type="radio"
                                        value="No"
                                        id={`no-${selectedBill.billType}`}
                                        checked={isBillAvailable === false}
                                        onChange={() => {
                                          setIsBillAvailable(false);
                                          setAmount(""); // Amount field blank on "No"
                                        }}
                                      />
                                      <label
                                        htmlFor={`no-${selectedBill.billType}`}
                                      >
                                        No
                                      </label>
                                    </div>
                                  </div> */}

                                  {/* {isBillAvailable && ( */}
                                  <>
                                    <div className="vg12"></div>
                                    <div className="price_input relative">
                                      <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) =>
                                          setAmount(e.target.value)
                                        }
                                        placeholder="Bill amount"
                                        className="w-100"
                                      />
                                    </div>
                                  </>
                                  {/* // )} */}
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-3 col-md-6">
                              <div
                                className={`form_field w-100 ${getBillFieldClass(
                                  selectedBill?.id,
                                  "remark"
                                )}`}
                                style={{
                                  padding: "10px",
                                  borderRadius: "5px",
                                  background: "white",
                                }}
                              >
                                <h6
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    marginBottom: "8px",
                                    color: "var(--theme-blue)",
                                  }}
                                >
                                  General Remark*
                                </h6>
                                <div className="field_box theme_radio_new">
                                  <textarea
                                    className="w-100"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                  ></textarea>
                                </div>
                              </div>
                            </div>

                            <div className="col-12">
                              <div
                                className="form_field w-100"
                                style={{
                                  padding: "10px",
                                  borderRadius: "5px",
                                  background: "white",
                                }}
                              >
                                <h6
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    marginBottom: "8px",
                                    color: "var(--theme-blue)",
                                  }}
                                >
                                  Upload bill image
                                </h6>
                                <div className="image_upload_container">
                                  {billInspectionData[selectedBill.id]
                                    ?.imageUrl ? (
                                    <div className="image_preview">
                                      <div className="image_container">
                                        <img
                                          src={
                                            billInspectionData[selectedBill.id]
                                              ?.imageUrl
                                          }
                                          alt="Bill Preview"
                                        />
                                        <div className="trash_icon">
                                          <FaTrash
                                            size={14}
                                            color="red"
                                            onClick={() =>
                                              handleBillImageDelete(
                                                selectedBill.id
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                      <label className="upload_icon">
                                        <div>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={(e) =>
                                              handleBillImageUpload(
                                                e,
                                                selectedBill.id
                                              )
                                            }
                                            style={{ display: "none" }}
                                          />
                                          <FaRetweet size={24} color="#555" />
                                          <h6>Replace Image</h6>
                                        </div>
                                      </label>
                                    </div>
                                  ) : (
                                    <label className="upload_icon">
                                      <div>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) =>
                                            handleBillImageUpload(
                                              e,
                                              selectedBill.id
                                            )
                                          }
                                          style={{ display: "none" }}
                                        />
                                        <FaPlus size={24} color="#555" />
                                        <h6>Add Image</h6>
                                      </div>
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
                          {inspectionDatabaseData &&
                            inspectionDatabaseData.layoutInspectionDone &&
                            inspectionDatabaseData.allBillInspectionComplete && (
                              <button
                                className="theme_btn no_icon btn_fill2 full_width"
                                onClick={() => setFinalSubmit(true)}
                                disabled={!isFinalSubmitEnabled()}
                                style={{
                                  opacity: !isFinalSubmitEnabled() ? 0.3 : 1,
                                  cursor: !isFinalSubmitEnabled()
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                              >
                                Final Submit
                              </button>
                            )}

                          <button
                            className="theme_btn no_icon btn_fill full_width"
                            onClick={handleSaveBill}
                            disabled={isBillDataSaving}
                            style={{
                              opacity: isBillDataSaving ? "0.5" : "1",
                            }}
                          >
                            {isBillDataSaving
                              ? "Saving...."
                              : "Save Inspection"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                      cursor: !isFinalSubmitEnabled()
                        ? "not-allowed"
                        : "pointer",
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
          {imageActionStatus === "uploading" ? "Uploading..." : "Deleting..."}
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
        {/* don't delete this commented code  */}
        {/* <h6 className="text-center text_black mb-0">
          What would you like to do next?
        </h6> */}
        {/* <div className="inspection_types">
          <Link className="it_single" onClick={() => setAfterSaveModal(false)}>
            <div
              className="d-flex align-items-center"
              style={{
                gap: "5px",
              }}
            >
              <img src="/assets/img/icons/continuous.png" alt="" />
              <div>
                <h5>Continue</h5>
                <h6>Stay on this page and continue working</h6>
              </div>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#303030"
            >
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>
          </Link>
          <Link className="it_single" to={`/inspection-report/${inspectionId}`}>
            <div
              className="d-flex align-items-center"
              style={{
                gap: "5px",
              }}
            >
              <img src="/assets/img/icons/view-report.png" alt="" />
              <div>
                <h5>Go to Report</h5>
                <h6>View and manage the details of this inspection</h6>
              </div>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#303030"
            >
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>
          </Link>
          <Link className="it_single" to={`/inspection/${propertyId}`}>
            <div
              className="d-flex align-items-center"
              style={{
                gap: "5px",
              }}
            >
              <img src="/assets/img/icons/view-all.png" alt="" />
              <div>
                <h5>View All</h5>
                <h6>Return to the inspections list to see all records</h6>
              </div>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#303030"
            >
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>
          </Link>
        </div> */}

        <div
          className="theme_btn btn_border w-100 no_icon text-center mb-4 mt-4"
          onClick={() => setAfterSaveModal(false)}
        >
          Okay
        </div>
      </Modal>

      {/* final submit alert  */}
      <Modal show={finalSubmit} onHide={() => setFinalSubmit(false)} centered>
        <Modal.Header
          className="justify-content-center"
          style={{
            paddingBottom: "0px",
            border: "none",
          }}
        >
          <h5>Alert</h5>
        </Modal.Header>
        <Modal.Body
          className="text-center"
          style={{
            color: "#FA6262",
            fontSize: "20px",
            border: "none",
          }}
        >
          After final submission, you won't be able to edit this inspection.
        </Modal.Body>
        <Modal.Footer
          className="d-flex justify-content-between"
          style={{
            border: "none",
            gap: "15px",
          }}
        >
          <div className="cancel_btn" onClick={() => setFinalSubmit(false)}>
            Cancel
          </div>
          <div className="done_btn" onClick={handleFinalSubmit}>
            {finalSubmiting ? "Processing..." : "Proceed"}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddInspection;
