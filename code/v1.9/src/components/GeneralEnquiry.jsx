import React, { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { projectFirestore } from "../firebase/config";
import firebase from "firebase/compat/app"; // 
import { useSendEmail } from "../hooks/useSendEmail";

const GeneralEnquiry = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    interest: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { sendMyEmail, isSendEmailPending } = useSendEmail()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // ✅ Firestore collection "generalEnquiries" me save karenge
      await projectFirestore.collection("generalEnquiries").add({
        ...formData,
        createdAt: firebase.firestore.Timestamp.now(),
      });

      setSuccessMsg("✅ Your enquiry has been submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        interest: "",
        message: "",
      });
      const email = "sanskar@hyperclouddigital.com";
      const ccList = ["atul@hyperclouddigital.com"];
      const bccList = ["naman@hyperclouddigital.com"];
      const emailSubject = "New General Enquiry";
      const emailBody = `You have received a new enquiry from ${formData.name} (${email}):\n\n${formData.message}`;
      sendMyEmail(email, ccList, bccList, emailSubject, emailBody);
    } catch (error) {
      console.error("Error adding enquiry:", error);
      setErrorMsg("❌ Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="contact-box shadow-lg p-4 rounded-4 bg-white">
              <h2 className="text-center mb-4 fw-bold">📩 Get in Touch</h2>

              {successMsg && (
                <div className="alert alert-success text-center">{successMsg}</div>
              )}
              {errorMsg && (
                <div className="alert alert-danger text-center">{errorMsg}</div>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">Phone Number</Form.Label>
                    <PhoneInput
                      country={"in"}
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      inputClass="w-100"
                      inputStyle={{ height: "45px", width: "100%" }}
                      specialLabel={""}
                      required
                    />
                  </Col>

                  <Col md={3} className="mb-3">
                    <Form.Label className="fw-semibold">I am</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="owner">Owner</option>
                      <option value="tenant">Tenant</option>
                      <option value="agent">Agent</option>
                    </Form.Select>
                  </Col>

                  <Col md={3} className="mb-3">
                    <Form.Label className="fw-semibold">Interested in</Form.Label>
                    <Form.Select
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="rent">Rent</option>
                      <option value="sale">Sale</option>
                    </Form.Select>
                  </Col>
                </Row>

                <div className="mb-3">
                  <Form.Label className="fw-semibold">Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <div className="text-center mt-4">
                  <Button
                    type="submit"
                    className="theme_btn btn_fill px-5 py-2 rounded-3"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Enquiry"}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default GeneralEnquiry;
