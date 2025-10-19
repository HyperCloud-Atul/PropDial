import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";
import firebase from "firebase/compat/app";
import { projectFirestore } from "../../firebase/config";
import { FaUserCheck } from "react-icons/fa";
import "./Tracker.scss";

const MonthlyTrackerModal = () => {
  const { user } = useAuthContext();
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const [questions, setQuestions] = useState([
    { id: "googleReview", label: "Google review taken?", icon: <FaUserCheck />, type: "radio", allowNA: true, answer: "", reason: "", updatedAt: null },
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
          reason: thisMonthDoc[q.id]?.reason || "",
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
        newDoc[q.id] = { answer: "", reason: "", updatedAt: null };
      });
      const docRef = await projectFirestore.collection("monthlyTracker").add(newDoc);
      setDocId(docRef.id);
      setQuestions((prev) => prev.map((q) => ({ ...q, answer: "", reason: "", updatedAt: null })));
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
        updatedAt: q.updatedAt || now
      };
      return acc;
    }, {});
    updates.updatedAt = now;

    await projectFirestore.collection("monthlyTracker").doc(docId).update(updates);
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
              reason: (value === "no" || value === "na") ? "" : "", // reset reason always
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

export default MonthlyTrackerModal;
