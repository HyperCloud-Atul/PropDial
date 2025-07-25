// import React, { useState } from "react";
// import { projectFirestore } from "../firebase/config";

// const AddField = () => {
//   const [loading, setLoading] = useState(false);

//   const handleAddStatus = async () => {
//     setLoading(true);

//     const collectionRef = projectFirestore.collection("m_cities");

//     try {
//       const snapshot = await collectionRef.get();
//       let updatedCount = 0;

//       for (const doc of snapshot.docs) {
//         const data = doc.data();

//         // Only update if status doesn't exist
//         if (!data.isShowInPropagent) {
//           await collectionRef.doc(doc.id).update({
//             // status: "active",
//             isShowInPropagent:true,
//             isShowInPropagent:true
//           });
//           updatedCount++;
//           console.log(`✅ Added status to doc ${doc.id}`);
//         }
//       }

//       console.log(`🎉 Total documents updated with status: ${updatedCount}`);
//     } catch (error) {
//       console.error("❌ Error adding status field:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <button
//         onClick={handleAddStatus}
//         disabled={loading}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "#28a745",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: loading ? "not-allowed" : "pointer",
//         }}
//       >
//         {loading ? "Adding Status..." : "Add 'active' Status to All Docs"}
//       </button>
//     </div>
//   );
// };

// export default AddField;


import React, { useState } from "react";
import { projectFirestore } from "../firebase/config";

const AddField = () => {
  const [loading, setLoading] = useState(false);

  const handleAddStatus = async () => {
    setLoading(true);

    const collectionRef = projectFirestore.collection("m_cities");

    try {
      const snapshot = await collectionRef.get();
      let updatedCount = 0;

      for (const doc of snapshot.docs) {
        const data = doc.data();

        // Ensure city exists before updating
        if (!data.alias && data.city) {
          const cityAlias = data.city.trim().toLowerCase(); // 👈 lowercase + trim

          await collectionRef.doc(doc.id).update({
            alias: [cityAlias], // 👈 save alias as array
            isShowInPropdial: true,
            isShowInPropagent: true,
          });

          updatedCount++;
          console.log(`✅ Updated doc ${doc.id} with alias: [${cityAlias}]`);
        }
      }

      console.log(`🎉 Total documents updated with alias: ${updatedCount}`);
    } catch (error) {
      console.error("❌ Error updating documents:", error);
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
        {loading ? "Updating..." : "Add Alias & Flags to All Docs"}
      </button>
    </div>
  );
};

export default AddField;

