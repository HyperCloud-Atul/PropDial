import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";
import firebase from "firebase/compat/app";
import { projectFirestore } from "../../firebase/config";
import { FaUserCheck, FaUserTie, FaCalendarAlt } from "react-icons/fa";
import "./Tracker.scss";

const MonthlyTrackerModal = () => {
  const { user } = useAuthContext();
  const [show, setShow] = useState(false);
  const [questions, setQuestions] = useState([
    { id: "googleReview", label: "Google review taken?", icon: <FaUserCheck />, type: "radio", allowNA: true, answer: "", updatedAt: null },
    // { id: "managerReview", label: "Manager review meeting done?", icon: <FaUserTie />, type: "radio", allowNA: false, answer: "", updatedAt: null },
    // { id: "meetingsCount", label: "How many meetings you done?", icon: <FaCalendarAlt />, type: "text", answer: "", updatedAt: null },
  ]);
  const [docId, setDocId] = useState(null);

  // Month tracker key -> YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${now.getFullYear()}-${month}`;
  };

  const currentMonth = getCurrentMonth();

  const handleShow = async () => {
    const snapshot = await projectFirestore
      .collection("monthlyTracker")
      .where("createdBy", "==", user.phoneNumber)
      .get();

    let thisMonthDoc = null;
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.month === currentMonth) {
        thisMonthDoc = { id: doc.id, ...data };
      }
    });

    if (thisMonthDoc) {
      setDocId(thisMonthDoc.id);
      setQuestions((prev) =>
        prev.map((q) => ({
          ...q,
          answer: thisMonthDoc[q.id]?.answer || "",
          updatedAt: thisMonthDoc[q.id]?.updatedAt || null
        }))
      );
    } else {
      const newDoc = {
        createdBy: user.phoneNumber,
        month: currentMonth,
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
      };
      questions.forEach((q) => {
        newDoc[q.id] = { answer: "", updatedAt: null };
      });
      const docRef = await projectFirestore.collection("monthlyTracker").add(newDoc);
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
    await projectFirestore.collection("monthlyTracker").doc(docId).update(updates);
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
        Monthly Tracker
      </button>

      <Modal show={show} onHide={handleClose} centered className="tracker-modal">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-4">📅 Monthly Tracker</Modal.Title>
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
                    type="text"
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

export default MonthlyTrackerModal;
