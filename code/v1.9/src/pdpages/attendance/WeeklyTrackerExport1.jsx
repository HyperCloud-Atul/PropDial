import React, { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { projectFirestore } from "../../firebase/config";
import { useExportToExcel } from "../../hooks/useExportToExcel";
import firebase from "firebase/compat/app";

const WeeklyTrackerExport = () => {
  const { exportToExcel } = useExportToExcel();

  const [show, setShow] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Helper: Get week ranges for a month
  const getWeekRanges = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return [
      [1, 7],
      [8, 14],
      [15, 21],
      [22, 28],
      [29, daysInMonth],
    ];
  };

  const handleExport = async () => {
    setLoading(true);

    try {
      const weekRanges = getWeekRanges(selectedYear, selectedMonth);
      const sheetsData = [];

      for (const [startDay, endDay] of weekRanges) {
        const startDate = new Date(selectedYear, selectedMonth - 1, startDay);
        const endDate = new Date(selectedYear, selectedMonth - 1, endDay + 1);

        const snapshot = await projectFirestore
          .collection("weeklyTracker")
          .where("createdAt", ">=", firebase.firestore.Timestamp.fromDate(startDate))
          .where("createdAt", "<", firebase.firestore.Timestamp.fromDate(endDate))
          .get();

        if (!snapshot.empty) {
          const data = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const d = doc.data();
              let userName = "--";
              let userPhone = "--";

              if (d.createdBy) {
                const userDoc = await projectFirestore
                  .collection("users-propdial")
                  .doc(d.createdBy)
                  .get();
                if (userDoc.exists) {
                  userName = userDoc.data()?.fullName || "--";
                  userPhone = userDoc.data()?.phoneNumber || "--";
                }
              }

              const formatDate = (ts) =>
                ts?.toDate().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }) || "--";

              const formatDateTime = (ts) =>
                ts?.toDate().toLocaleString("en-GB") || "--";

              return {
                Date: formatDate(d.createdAt),
                Name: userName,
                "Phone Number": userPhone,
                "Manager Review": d.managerReview?.answer || "--",
                "Manager Updated At": formatDateTime(d.managerReview?.updatedAt),
                "Self Review": d.selfReview?.answer || "--",
                "Self Updated At": formatDateTime(d.selfReview?.updatedAt),
                "Last Updated": formatDateTime(d.updatedAt),
                Week: d.week || "--",
              };
            })
          );

          sheetsData.push({
            sheetName: `${startDay}-${endDay} ${months[selectedMonth - 1].label}`,
            sheetData: data,
          });
        }
      }

      if (sheetsData.length === 0) {
        alert("No data found for the selected month.");
        setLoading(false);
        return;
      }

      exportToExcel(sheetsData, `weekly-tracker-${months[selectedMonth - 1].label}-${selectedYear}.xlsx`, true);
    } catch (error) {
      console.error("Export error:", error);
    }

    setLoading(false);
    setShow(false);
  };

  return (
    <>
  
       <button className="theme_btn btn_fill no_icon text-center mt-2" onClick={() => setShow(true)}>
     Export Weekly Tracker
      </button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Month & Year</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Year</Form.Label>
                  <Form.Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Month</Form.Label>
                  <Form.Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleExport} disabled={loading}>
            {loading ? "Exporting..." : "Export"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WeeklyTrackerExport;
