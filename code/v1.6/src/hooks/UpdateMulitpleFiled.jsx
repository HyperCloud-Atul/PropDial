import React, { useState } from "react";
import { projectFirestore } from "../firebase/config";

const UpdateMulitpleFiled = () => {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    const propertyUsersRef = projectFirestore.collection("inspections");
    const usersRef = projectFirestore.collection("users-propdial");

    const fallbackNumber = "918749001111";

    // ✅ Fields to be checked/updated
    const fieldsToUpdate = [
      "createdBy",
    //   "isActiveUpdatedBy",
    //   "isInactiveUpdatedBy",
    //   "isReviewUpdatedBy",
    //   "updatedBy",
      "lastUpdatedBy"
    ];

    try {
      // Step 1: Create UID → Phone map
      const usersSnapshot = await usersRef.get();
      const uidToPhoneMap = {};
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.uid && data.phoneNumber) {
          uidToPhoneMap[data.uid] = data.phoneNumber;
        }
      });

      // Step 2: Go through all propertyusers
      const docsSnapshot = await propertyUsersRef.get();
      let updatedCount = 0;

      for (const doc of docsSnapshot.docs) {
        const data = doc.data();
        const updateData = {};

        fieldsToUpdate.forEach((field) => {
          const value = data[field];
          if (value) {
            updateData[field] = uidToPhoneMap[value] || fallbackNumber;
          }
        });

        if (Object.keys(updateData).length > 0) {
          await propertyUsersRef.doc(doc.id).update(updateData);
          updatedCount++;
          console.log(`✅ Updated doc ${doc.id}`, updateData);
        }
      }

      console.log(`🎉 Successfully updated ${updatedCount} documents.`);
    } catch (err) {
      console.error("❌ Error updating documents:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleUpdate}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Updating..." : "Update All UID Fields"}
      </button>
    </div>
  );
};

export default UpdateMulitpleFiled;
