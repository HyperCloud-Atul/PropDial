import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { projectFirestore } from "../../firebase/config";
import { useExportToExcel } from "../../hooks/useExportToExcel";
import { format } from "date-fns";

const MonthlyTrackerExport = () => {
  const { exportToExcel } = useExportToExcel();
  const [show, setShow] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, "0"));
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const monthKey = `${year}-${month}`; // Same as monthlyTracker month format
      const snapshot = await projectFirestore
        .collection("monthlyTracker")
        .where("month", "==", monthKey)
        .get();

      if (snapshot.empty) {
        alert("No data found for selected month.");
        setLoading(false);
        return;
      }

      const exportData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          "User Phone": data.createdBy || "--",
          Month: data.month,
          "Google Review": data.googleReview?.answer || "--",
          "Google Review Updated At": data.googleReview?.updatedAt
            ? format(data.googleReview.updatedAt.toDate(), "dd-MM-yyyy HH:mm")
            : "--",
          CreatedAt: data.createdAt
            ? format(data.createdAt.toDate(), "dd-MM-yyyy HH:mm")
            : "--",
          UpdatedAt: data.updatedAt
            ? format(data.updatedAt.toDate(), "dd-MM-yyyy HH:mm")
            : "--",
        };
      });

      exportToExcel(exportData, `monthly-tracker-${monthKey}.xlsx`);
    } catch (error) {
      console.error("Error exporting monthly tracker:", error);
    }
    setLoading(false);
    setShow(false);
  };

  return (
    <>
      <button className="theme_btn btn_fill no_icon text-center mt-2" onClick={() => setShow(true)}>
        📤 Export Monthly Tracker
      </button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Month</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Month</Form.Label>
              <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
                {Array.from({ length: 12 }, (_, i) => {
                  const m = String(i + 1).padStart(2, "0");
                  return (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? "Exporting..." : "Export"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MonthlyTrackerExport;
