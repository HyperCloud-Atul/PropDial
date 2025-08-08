import React, { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { projectFirestore } from "../../firebase/config";
import { useExportToExcel } from "../../hooks/useExportToExcel";
import firebase from "firebase/compat/app";

const DailyTrackerExport = () => {
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

  // Helper function: format date to "08-Aug-2025"
  const formatDate = (date) => {
    if (!date) return "--";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
  };

  const handleExport = async () => {
    setLoading(true);

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 1);

    try {
      const snapshot = await projectFirestore
        .collection("dailyTracker")
        .where("createdAt", ">=", firebase.firestore.Timestamp.fromDate(startDate))
        .where("createdAt", "<", firebase.firestore.Timestamp.fromDate(endDate))
        .get();

      if (snapshot.empty) {
        alert("No data found for the selected month.");
        setLoading(false);
        return;
      }

      // Step 1: Get all tracker docs
      const trackerDocs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Step 2: Get unique user IDs from createdBy
      const userIds = [...new Set(trackerDocs.map((d) => d.createdBy))];

      // Step 3: Fetch all users in parallel
      const userSnapshots = await Promise.all(
        userIds.map((uid) =>
          projectFirestore.collection("users-propdial").doc(uid).get()
        )
      );

      const userMap = {};
      userSnapshots.forEach((snap) => {
        if (snap.exists) {
          const udata = snap.data();
          userMap[snap.id] = {
            name: udata.fullName || "--",
            phone: udata.phoneNumber || "--",
          };
        }
      });

      // Step 4: Build export data
      const data = trackerDocs.map((d) => ({
        Date: formatDate(d.createdAt?.toDate()),
        Name: userMap[d.createdBy]?.name || "--",
        "Phone Number": userMap[d.createdBy]?.phone || "--",
        "Did you punch in?": d.punchIn?.answer || "--",
        "Did you punch out?": d.punchOut?.answer || "--",
        "Did you reply to all emails?": d.emailReplied?.answer || "--",
        "Did you reply on WhatsApp?": d.whatsappReplied?.answer || "--",
        "How many agents you find today?": d.agentConnected?.answer || "--",
        "Last Updated": formatDate(d.updatedAt?.toDate()),
      }));

      exportToExcel(data, `daily-tracker-${selectedYear}-${selectedMonth}.xlsx`);
    } catch (error) {
      console.error("Export error:", error);
    }

    setLoading(false);
    setShow(false);
  };

  return (
    <>
      <button className="theme_btn btn_fill no_icon text-center mt-2" onClick={() => setShow(true)}>
        📤 Export Daily Tracker
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

export default DailyTrackerExport;
