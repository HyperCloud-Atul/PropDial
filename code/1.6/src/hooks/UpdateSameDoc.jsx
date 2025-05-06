import React, { useState } from "react";
import { projectFirestore } from "../firebase/config";

const UpdateSameDoc = () => {
  const [loading, setLoading] = useState(false);

  const handleReplace = async () => {
    setLoading(true);

    const collectionRef = projectFirestore.collection("attendance-propdial"); // 🔁 your collection name

    try {
      const snapshot = await collectionRef.get();
      let updatedCount = 0;

      for (const doc of snapshot.docs) {
        const data = doc.data();

        const phoneNo = data.userPhoneNo;

        // Only proceed if userPhoneNo exists
        if (phoneNo) {
          await collectionRef.doc(doc.id).update({
            userId: phoneNo,
          });
          updatedCount++;
          console.log(`✅ Updated doc ${doc.id}: userId → ${phoneNo}`);
        }
      }

      console.log(`🎉 Total updated documents: ${updatedCount}`);
    } catch (error) {
      console.error("❌ Error updating documents:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleReplace}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#17a2b8",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Updating..." : "Replace userId with userPhoneNo"}
      </button>
    </div>
  );
};

export default UpdateSameDoc;
