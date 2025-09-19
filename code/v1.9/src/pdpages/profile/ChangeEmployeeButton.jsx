import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { projectFirestore } from "../../firebase/config";

export default function ChangeEmployeeButton({ userProfileId }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const userRef = projectFirestore.collection("users-propdial").doc(userProfileId);

      // Step 1: Get current document
      const userSnap = await userRef.get();
      if (!userSnap.exists) throw new Error("User not found!");

      const userData = userSnap.data();

      // Step 2: Create new doc in users-propdial-ex (auto ID)
      const exUserRef = await projectFirestore.collection("users-propdial-ex").add(userData);

      // Step 3: Copy subcollections (properties, impDoc)
      const subcollections = ["properties", "impDoc"];
      for (const subColName of subcollections) {
        const subColSnap = await userRef.collection(subColName).get();
        for (const doc of subColSnap.docs) {
          await exUserRef.collection(subColName).doc(doc.id).set(doc.data());
        }
      }

      // Step 4: Delete subcollections from original
      for (const subColName of subcollections) {
        const subColSnap = await userRef.collection(subColName).get();
        for (const doc of subColSnap.docs) {
          await userRef.collection(subColName).doc(doc.id).delete();
        }
      }

      // Step 5: Delete the main document
      await userRef.delete();

      // Step 6: Redirect
      window.location.href = "/userlist";
    } catch (err) {
      console.error("Error changing employee:", err);
      alert("❌ Something went wrong!");
    }

    setLoading(false);
    handleClose();
  };

  return (
    <>
      <Button variant="warning" onClick={handleShow}>
        Change This Employee
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to change this employee?  
          <br />
          (This will copy main document + subcollections to <b>users-propdial-ex</b> 
          with auto-id, then delete from current.)
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={loading}>
            {loading ? "Processing..." : "Yes, Change"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
