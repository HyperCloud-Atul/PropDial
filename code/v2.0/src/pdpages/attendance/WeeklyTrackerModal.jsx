import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";
import firebase from "firebase/compat/app";
import { projectFirestore } from "../../firebase/config";
import { FaUserCheck, FaUserTie } from "react-icons/fa";
import "./Tracker.scss";

const WeeklyTrackerModal = () => {
  const { user } = useAuthContext();
  const [show, setShow] = useState(false);
  const [trackerStarted, setTrackerStarted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const [questions, setQuestions] = useState([
    { id: "selfReview", label: "Self review meeting done?", icon: <FaUserCheck />, type: "radio", allowNA: true, answer: "", reason: "", updatedAt: null },
    { id: "managerReview", label: "Manager review meeting done?", icon: <FaUserTie />, type: "radio", allowNA: true, answer: "", reason: "", updatedAt: null },
  ]);
  const [docId, setDocId] = useState(null);

  const getCurrentWeek = () => {
    const now = new Date();
    const firstJan = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - firstJan) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((now.getDay() + 1 + days) / 7);
    return `${now.getFullYear()}-W${weekNumber}`;
  };

  const currentWeek = getCurrentWeek();

  // ✅ Component mount hote hi status check
  useEffect(() => {
    const fetchTracker = async () => {
      if (!user?.phoneNumber) return;

      const snapshot = await projectFirestore
        .collection("weeklyTracker")
        .where("createdBy", "==", user.phoneNumber)
        .get();

      let thisWeekDoc = null;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.week === currentWeek) {
          thisWeekDoc = { id: doc.id, ...data };
        }
      });

      if (thisWeekDoc) {
        setTrackerStarted(true);
        setDocId(thisWeekDoc.id);
        setQuestions((prev) =>
          prev.map((q) => ({
            ...q,
            answer: thisWeekDoc[q.id]?.answer || "",
            reason: thisWeekDoc[q.id]?.reason || "",
            updatedAt: thisWeekDoc[q.id]?.updatedAt || null
          }))
        );
      }
    };

    fetchTracker();
  }, [user?.phoneNumber, currentWeek]);

  const handleShow = async () => {
    if (!docId) {
      // Naya tracker create karo
      const newDoc = {
        createdBy: user.phoneNumber,
        week: currentWeek,
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
      };
      questions.forEach((q) => {
        newDoc[q.id] = { answer: "", reason: "", updatedAt: null };
      });
      const docRef = await projectFirestore.collection("weeklyTracker").add(newDoc);
      setDocId(docRef.id);
      setQuestions((prev) => prev.map((q) => ({ ...q, answer: "", reason: "", updatedAt: null })));
      setTrackerStarted(true);
    }
    setShow(true);
  };

  const handleClose = () => setShow(false);

  // ✅ Save with validation
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
      return;
    }

    setFormError("");

    const updates = questions.reduce((acc, q) => {
      acc[q.id] = {
        answer: q.answer,
        reason: q.reason || "",
        updatedAt: q.updatedAt || now,
      };
      return acc;
    }, {});
    updates.updatedAt = now;

    await projectFirestore.collection("weeklyTracker").doc(docId).update(updates);
    setShow(false);
  };

  // ✅ Answer / Reason change
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
            reason: "", // answer badalte hi reason reset ho jaye
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
        className={`theme_btn btn_fill no_icon text-center mt-2 ${trackerStarted ? "btn_border" : "btn_fill"}`}
      >
        {trackerStarted ? "Weekly Tracking Started" : "Weekly Tracker"}
      </button>

      <Modal show={show} onHide={handleClose} centered className="tracker-modal">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-4">📆 Weekly Tracker</Modal.Title>
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

                {/* ✅ Reason textarea if No/NA */}
                {(q.answer === "no" || q.answer === "na") && (
                  <div className="mt-2">
                    <Form.Control
                      as="textarea"
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
        <Modal.Footer className="d-flex flex-column align-items-start">
          {formError && (
            <div className="text-danger fw-semibold mb-2">{formError}</div>
          )}
          <div className="d-flex w-100 justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Close
            </Button>
            <Button variant="success" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WeeklyTrackerModal;
