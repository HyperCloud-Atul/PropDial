import React, { useState } from "react";
import { projectFirestore } from "../firebase/config";

const UpdateCreatedByComponent = () => {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const utilityBillRef = projectFirestore.collection("inspections");
    const userRef = projectFirestore.collection("users-propdial");

    const fallbackNumber = "918749001111";

    try {
      const utilitySnapshot = await utilityBillRef.get();
      const userSnapshot = await userRef.get();

      // Step 1: Map UID to phone number
      const uidToPhoneMap = {};
      userSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.uid && data.phoneNumber) {
          uidToPhoneMap[data.uid] = data.phoneNumber;
        }
      });

      let updatedCount = 0;

      // Step 2: Update utility-bill documents
      for (const doc of utilitySnapshot.docs) {
        const data = doc.data();
        const createdById = data.createdBy;

        if (!createdById) continue; // skip if missing

        let newPhoneNumber = fallbackNumber;

        if (uidToPhoneMap.hasOwnProperty(createdById)) {
          newPhoneNumber = uidToPhoneMap[createdById];
        }

        await utilityBillRef.doc(doc.id).update({ createdBy: newPhoneNumber });
        updatedCount++;
        console.log(
          `✅ Updated: ${doc.id} → ${newPhoneNumber} (${uidToPhoneMap.hasOwnProperty(createdById) ? "matched" : "fallback"})`
        );
      }

      console.log(`🎉 Total documents updated: ${updatedCount}`);
    } catch (error) {
      console.error("❌ Error updating documents:", error);
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
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing..." : "Update CreatedBy Safely"}
      </button>
    </div>
  );
};

export default UpdateCreatedByComponent;
