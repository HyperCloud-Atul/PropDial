import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";
import firebase from "firebase/compat/app";
import { projectFirestore } from "../../firebase/config";
import { FaSignInAlt, FaSignOutAlt, FaTasks, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import "./Tracker.scss";

const DailyTrackerModal = () => {
  const { user } = useAuthContext();
  const [show, setShow] = useState(false);
  const [trackerStarted, setTrackerStarted] = useState(false);
  const [errors, setErrors] = useState({}); // NEW: to track errors
  const [formError, setFormError] = useState(""); // NEW

  const [questions, setQuestions] = useState([
    { id: "punchIn", label: "Punch-In done?", icon: <FaSignInAlt />, type: "radio", allowNA: true, answer: "", reason: "", updatedAt: null },
    { id: "punchOut", label: "Punch-Out done?", icon: <FaSignOutAlt />, type: "radio", allowNA: true, answer: "", reason: "", updatedAt: null },
    { id: "taskUpdate", label: "Task updated?", icon: <FaTasks />, type: "radio", allowNA: true, answer: "", reason: "", updatedAt: null },
    { id: "emailReplied", label: "All emails replied?", icon: <FaEnvelope />, type: "radio", allowNA: true, answer: "", reason: "", updatedAt: null },
    { id: "whatsappReplied", label: "All WhatsApp messages replied?", icon: <FaWhatsapp />, type: "radio", allowNA: true, answer: "", reason: "", updatedAt: null },
    { id: "agentConnected", label: "How many agents connected today?", icon: null, type: "text", answer: "", reason: "", updatedAt: null },
  ]);
  const [docId, setDocId] = useState(null);

  const todayDate = new Date().toLocaleDateString("en-CA");
useEffect(() => {
  const fetchTracker = async () => {
    if (!user?.phoneNumber) return;

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
      setTrackerStarted(true);
      setDocId(todayDoc.id);
      setQuestions((prev) =>
        prev.map((q) => ({
          ...q,
          answer: todayDoc[q.id]?.answer || "",
          updatedAt: todayDoc[q.id]?.updatedAt || null
        }))
      );
    }
  };

  fetchTracker();
}, [user?.phoneNumber]);

const handleShow = async () => {
  if (!docId) {
    // Create new tracker if not started yet
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
    setTrackerStarted(true);
  }
  setShow(true);
};


  const handleClose = () => setShow(false);

const handleSave = async () => {
  const now = firebase.firestore.Timestamp.now();
  let newErrors = {};

  questions.forEach((q) => {
    if ((q.answer === "no" || q.answer === "na") && !q.reason.trim()) {
      newErrors[q.id] = "Reason is required when you select No or N/A";
    }
  });

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    setFormError("⚠️ Please fill all mandatory fields before saving");
    return; // stop save
  }

  setFormError(""); // clear if no error

  const updates = questions.reduce((acc, q) => {
    acc[q.id] = {
      answer: q.answer,
      reason: q.reason || "",
      updatedAt: q.updatedAt || now,
    };
    return acc;
  }, {});
  updates.updatedAt = now;

  await projectFirestore.collection("dailyTracker").doc(docId).update(updates);
  setShow(false);
};


// ✅ Handle change for answer/reason
// ✅ Handle change for answer/reason
const handleChange = (id, value, field = "answer") => {
  const now = firebase.firestore.Timestamp.now();

  setQuestions((prev) =>
    prev.map((q) => {
      if (q.id === id) {
        // ✅ Agar answer change ho raha hai
        if (field === "answer") {
          return {
            ...q,
            answer: value,
            reason: "", // answer change hone par reason reset
            updatedAt: now,
          };
        }
        // ✅ Agar reason change ho raha hai
        return { ...q, [field]: value, updatedAt: now };
      }
      return q;
    })
  );

  // ✅ Agar reason type kiya to error hata do
  if (field === "reason") {
    setErrors((prev) => {
      const { [id]: removed, ...rest } = prev;
      if (Object.keys(rest).length === 0) {
        setFormError(""); // Global error bhi hatao
      }
      return rest;
    });
  }
};




  return (
    <>
     <button
  onClick={handleShow}
  className={`theme_btn text-center mt-2 no_icon ${
    trackerStarted ? "btn_border" : "btn_fill"
  }`}
>
  {trackerStarted ? "Daily Tracking Started" : "Start Daily Tracker"}
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

{/* ✅ Show reason field if No/NA selected */}
{(q.answer === "no" || q.answer === "na") && (
  <div className="mt-2">
    <Form.Control
      as="textarea"   // ✅ text field → textarea
      rows={2}
      placeholder={`Reason for ${q.answer.toUpperCase()}*`}
      value={q.reason}
      onChange={(e) => handleChange(q.id, e.target.value, "reason")}
      className={errors[q.id] ? "is-invalid" : ""}
    />
    {errors[q.id] && (
      <div className="text-danger small mt-1">{errors[q.id]}</div>
    )}
  </div>
)}


              </div>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
            {formError && (
    <div className="text-danger fw-semibold mb-2">{formError}</div>
  )}
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
