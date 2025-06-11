import React, { useState } from "react";
import { projectFirestore } from "../firebase/config";

const AddField = () => {
  const [loading, setLoading] = useState(false);

  const handleAddStatus = async () => {
    setLoading(true);

    const collectionRef = projectFirestore.collection("agent-propdial");

    try {
      const snapshot = await collectionRef.get();
      let updatedCount = 0;

      for (const doc of snapshot.docs) {
        const data = doc.data();

        // Only update if status doesn't exist
        if (!data.status) {
          await collectionRef.doc(doc.id).update({
            status: "active",
          });
          updatedCount++;
          console.log(`✅ Added status to doc ${doc.id}`);
        }
      }

      console.log(`🎉 Total documents updated with status: ${updatedCount}`);
    } catch (error) {
      console.error("❌ Error adding status field:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAddStatus}
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
        {loading ? "Adding Status..." : "Add 'active' Status to All Docs"}
      </button>
    </div>
  );
};

export default AddField;
