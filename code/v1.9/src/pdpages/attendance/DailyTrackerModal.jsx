import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";
import firebase from "firebase/compat/app";
import { projectFirestore } from "../../firebase/config";
import { FaSignInAlt, FaSignOutAlt, FaTasks, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import "./Tracker.scss";

const DailyTrackerModal = () => {
  const { user } = useAuthContext();
  const [show, setShow] = useState(false);
  const [questions, setQuestions] = useState([
    { id: "punchIn", label: "Punch-In done?", icon: <FaSignInAlt />, type: "radio", allowNA: true, answer: "", updatedAt: null },
    { id: "punchOut", label: "Punch-Out done?", icon: <FaSignOutAlt />, type: "radio", allowNA: true, answer: "", updatedAt: null },
    { id: "taskUpdate", label: "Task updated?", icon: <FaTasks />, type: "radio", allowNA: true, answer: "", updatedAt: null },
    { id: "emailReplied", label: "All emails replied?", icon: <FaEnvelope />, type: "radio", allowNA: true, answer: "", updatedAt: null },
    { id: "whatsappReplied", label: "All WhatsApp messages replied?", icon: <FaWhatsapp />, type: "radio", allowNA: true, answer: "", updatedAt: null },
    { id: "agentConnected", label: "How many agents connected today?", icon: null, type: "text", answer: "", updatedAt: null },
  ]);
  const [docId, setDocId] = useState(null);

  const todayDate = new Date().toLocaleDateString("en-CA");

  const handleShow = async () => {
    const snapshot = await projectFirestore
      .collection("dailyTracker")
      .where("createdBy", "==", user.phoneNumber)
      .get();

    let todayDoc = null;
    snapshot.forEach((doc) => {
      const data = doc.data();
      const createdDate = data.createdAt?.toDate
        ? data.createdAt.toDate().toLocaleDateString("en-CA")
        : "";
      if (createdDate === todayDate) {
        todayDoc = { id: doc.id, ...data };
      }
    });

    if (todayDoc) {
      setDocId(todayDoc.id);
      setQuestions((prev) =>
        prev.map((q) => ({
          ...q,
          answer: todayDoc[q.id]?.answer || "",
          updatedAt: todayDoc[q.id]?.updatedAt || null
        }))
      );
    } else {
      const newDoc = {
        createdBy: user.phoneNumber,
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
      };
      questions.forEach((q) => {
        newDoc[q.id] = { answer: "", updatedAt: null };
      });
      const docRef = await projectFirestore.collection("dailyTracker").add(newDoc);
      setDocId(docRef.id);
      setQuestions((prev) => prev.map((q) => ({ ...q, answer: "", updatedAt: null })));
    }
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSave = async () => {
    const now = firebase.firestore.Timestamp.now();
    const updates = questions.reduce((acc, q) => {
      acc[q.id] = {
        answer: q.answer,
        updatedAt: q.updatedAt || now
      };
      return acc;
    }, {});
    updates.updatedAt = now;
    await projectFirestore.collection("dailyTracker").doc(docId).update(updates);
    setShow(false);
  };

  const handleChange = (id, value) => {
    const now = firebase.firestore.Timestamp.now();
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, answer: value, updatedAt: now }
          : q
      )
    );
  };

  return (
    <>
      <button onClick={handleShow} className="theme_btn btn_fill no_icon text-center mt-2">
        Daily Tracker
      </button>

      <Modal show={show} onHide={handleClose} centered className="tracker-modal" size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-4">📅 Daily Tracker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {questions.map((q) => (
              <div key={q.id} className="tracker-question-card">
                <div className="d-flex align-items-center mb-2">
                  {q.icon && <span className="tracker-icon me-2">{q.icon}</span>}
                  <Form.Label className="fw-semibold mb-0">
                    {q.label}{" "}
                    {q.updatedAt && (
                      <small className="text-muted">
                        (Last updated: {q.updatedAt.toDate().toLocaleString()})
                      </small>
                    )}
                  </Form.Label>
                </div>

                {q.type === "radio" ? (
                  <div className="toggle-group">
                    <div
                      className={`toggle-option ${q.answer === "yes" ? "selected-yes" : ""}`}
                      onClick={() => handleChange(q.id, "yes")}
                    >
                      Yes
                    </div>
                    <div
                      className={`toggle-option ${q.answer === "no" ? "selected-no" : ""}`}
                      onClick={() => handleChange(q.id, "no")}
                    >
                      No
                    </div>
                    {q.allowNA && (
                      <div
                        className={`toggle-option ${q.answer === "na" ? "selected-na" : ""}`}
                        onClick={() => handleChange(q.id, "na")}
                      >
                        N/A
                      </div>
                    )}
                  </div>
                ) : (
                  <Form.Control
                    type="number"
                    value={q.answer}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    placeholder="Enter here"
                    className="custom-input"
                  />
                )}
              </div>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DailyTrackerModal;
