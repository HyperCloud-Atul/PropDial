import React, { useState } from "react";
import { projectFirestore } from "../firebase/config";

const DuplicateCollection = () => {
  const [status, setStatus] = useState("");

  const duplicateCollection = async () => {
    const sourceCollection = "tenants"; // 🔁 change this
    const targetCollection = "tenants-new"; // 🔁 change this

    try {
      setStatus("Copying...");

      const snapshot = await projectFirestore.collection(sourceCollection).get();

      if (snapshot.empty) {
        setStatus("No documents found to copy.");
        return;
      }

      const batch = projectFirestore.batch();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const targetDocRef = projectFirestore.collection(targetCollection).doc();
        batch.set(targetDocRef, data);
      });

      await batch.commit();

      setStatus(`Successfully copied ${snapshot.size} documents.`);
    } catch (err) {
      console.error("Error duplicating collection:", err);
      setStatus("Failed to copy collection.");
    }
  };

  return (
    <div>
      <button onClick={duplicateCollection}>Duplicate Collection</button>
      <p>{status}</p>
    </div>
  );
};

export default DuplicateCollection;
