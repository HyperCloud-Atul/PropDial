// BillInspection.js
import React, { useState, useEffect } from "react";
import { FaTrash, FaRetweet, FaPlus } from "react-icons/fa";
import { projectFirestore, timestamp, projectStorage } from "../../../firebase/config";
import firebase from 'firebase/compat/app';
import imageCompression from "browser-image-compression";

const BillInspection = ({ 
  propertyId, 
  inspectionId, 
  user, 
  bills, 
  billInspectionData, 
  setBillInspectionData, 
  allBillInspectionComplete, 
  setAllBillInspectionComplete 
}) => {
  const [selectedBill, setSelectedBill] = useState(null);
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [isBillDataSaving, setIsBillDataSaving] = useState(false);
  const [imageActionStatus, setImageActionStatus] = useState(null);

  useEffect(() => {
    const allBillInspectionFull = bills.every((bill) => {
      const billData = billInspectionData?.[bill.id] || {};
      return billData.amount && billData.amount && billData.remark;
    });

    setAllBillInspectionComplete(allBillInspectionFull);
  }, [bills, billInspectionData]);

  const handleBillTypeClick = (bill) => {
    if (selectedBill?.id === bill.id) return;
    
    setSelectedBill(bill);
    const billData = billInspectionData?.[bill.id] || {};
    setAmount(billData.amount || "");
    setRemark(billData.remark || "");
  };

  const getBillButtonClass = (bill) => {
    const billData = billInspectionData?.[bill.id] || {};
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
    const billData = billInspectionData?.[billId] || {};
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
    const billData = billInspectionData?.[billId];
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

      return true;
    } catch (error) {
      console.error("Error saving all bill data:", error);
      return false;
    } finally {
      setIsBillDataSaving(false);
    }
  };

  return {
    selectedBill,
    amount,
    setAmount,
    remark,
    setRemark,
    isBillDataSaving,
    handleBillTypeClick,
    getBillButtonClass,
    getBillFieldClass,
    handleBillImageUpload,
    handleBillImageDelete,
    handleSaveBill,
    bills
  };
};

export default BillInspection;