


import { useState } from "react";
import { Modal } from "react-bootstrap";
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

      // Step 3: Copy subcollections to ex-user
      const subcollections = ["properties", "impDoc"];
      for (const subColName of subcollections) {
        const subColSnap = await userRef.collection(subColName).get();
        for (const doc of subColSnap.docs) {
          await exUserRef.collection(subColName).doc(doc.id).set(doc.data());
        }
      }

      // Step 4: Delete only main document (subcollections remain in place)
      await userRef.delete();

      // Step 5: Redirect
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
      <button
        className="theme_btn btn_border_red no_icon text-center"
        onClick={handleShow}
      >
        Change This Employee
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          className="justify-content-center"
          style={{ paddingBottom: "0px", border: "none" }}
        >
          <h5>Alert</h5>
        </Modal.Header>
        <Modal.Body
          className="text-center"
          style={{ color: "#FA6262", fontSize: "20px", border: "none" }}
        >
          Are you sure you want to change this employee?
        </Modal.Body>
        <Modal.Footer
          className="d-flex justify-content-between"
          style={{ border: "none", gap: "15px" }}
        >
          <div className="cancel_btn" onClick={handleConfirm}>
            {loading ? "Processing..." : "Yes, Change"}
          </div>
          <div className="done_btn" onClick={handleClose}>
            No
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

