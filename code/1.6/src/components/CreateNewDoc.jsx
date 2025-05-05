import React from "react";
import { projectFirestore } from "../firebase/config";

const CreateNewDoc = () => {
  const handleCreateDocWithPhoneIds = async () => {
    try {
      const snapshot = await projectFirestore.collection("users-propdial").get();

      snapshot.forEach(async (doc) => {
        const data = doc.data();
        const phone = data.phoneNumber;

        // Skip if phoneNumber is missing
        if (!phone) return;

        const newDocData = {
            rolePropDial: data.rolePropDial || "",
            rolesPropDial: data.rolesPropDial || [],
            accessType: data.accessType || "",
            accessValue: data.accessValue || "",
            online: data.online || "",
            displayName: data.displayName || "",
            gender: data.gender || "",
            fullName: data.fullName || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            country: data.country || "",
            countryCode: data.countryCode || "",
            referredBy: data.referredBy || "",
            referralCode: data.referralCode || "",
            city: data.city || "",
            address: data.address || "",
            photoURL: data.photoURL || "",
            uid: doc.id || "",
            status: data.status || "active",
            createdAt: data.createdAt || "",
            lastLoginTimestamp: data.lastLoginTimestamp || "",
          
            // Employee Details
            dateofJoinee: data.dateofJoinee || "",
            dateofLeaving: data.dateofLeaving || "",
            employeeId: data.employeeId || "",
            reportingManagerId: data.reportingManagerId || "",
            department: data.department || "",
            designation: data.designation || "",
            uan: data.uan || "",
            pan: data.pan || "",
            aadhaar: data.aadhaar || "",
            vehicleStatus: data.vehicleStatus || "",
            vehicleDetails: data.vehicleDetails || "",
            isEmployee: data.isEmployee || false,
            isAttendanceRequired: data.isAttendanceRequired || false,
          };
          

        await projectFirestore.collection("users-propdial").doc(phone).set(newDocData);
        console.log(`Cloned user ${doc.id} to new doc with ID ${phone}`);
      });
    } catch (error) {
      console.error("Error cloning documents:", error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateDocWithPhoneIds}>
        Clone docs using phoneNumber as ID
      </button>
    </div>
  );
};

export default CreateNewDoc;
