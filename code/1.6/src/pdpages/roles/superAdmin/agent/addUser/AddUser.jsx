import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { projectFirestore, timestamp } from "../../../../../firebase/config";
import { camelCase } from "lodash";
import "react-phone-input-2/lib/style.css";

const AddUser = () => {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [whoIsUser, setWhoIsUser] = useState("");
  const [country, setCountry] = useState("");

  const [error, setError] = useState("");
  const [phoneExists, setPhoneExists] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if phone exists in Firestore
  useEffect(() => {
    const checkPhoneExists = async () => {
      if (phone.length >= 10) {
        const docRef = projectFirestore.collection("users-propdial").doc(phone);
        const doc = await docRef.get();
        setPhoneExists(doc.exists);
      } else {
        setPhoneExists(false);
      }
    };
    checkPhoneExists();
  }, [phone]);

  const handlePhoneChange = (value, data) => {
    setPhone(value);
    setCountryCode(data?.dialCode || "");
    setCountry(data?.name || "");
    setError("");
  };

  const allFieldsFilled = () => {
    return phone && name && email && city && gender && whoIsUser && !phoneExists;
  };

const resetForm = () => {
  setPhone("");
  setCountry("India");
  setCountryCode("91");
  setName("");
  setEmail("");
  setCity("");
  setGender("");
  setWhoIsUser("");
  setError("");
  setPhoneExists(false);
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allFieldsFilled()) {
      setError("Please fill all fields correctly.");
      return;
    }

    setIsSubmitting(true);

    const userData = {
      online: true,
      whatsappUpdate: false,
    displayName: name.trim().split(" ")[0],
      fullName: name,
      phoneNumber: phone,
      email: email.toLowerCase().trim(),
      city: camelCase(city.toLowerCase().trim()),
      address: "",
      gender,
      whoAmI: whoIsUser,
      country,
      propertyManagerID: phone,
      countryCode,
      photoURL: "",
      rolePropDial: whoIsUser,
      rolesPropDial: [whoIsUser],
      accessType: "country",
      accessValue: ["India"],
      status: "active",
      createdAt: timestamp.fromDate(new Date()),
      createdBy: phone,
      lastLoginTimestamp: timestamp.fromDate(new Date()),
      dateofJoinee: "",
      dateofLeaving: "",
      employeeId: "",
      reportingManagerId: "",
      department: "",
      designation: "",
      uan: "",
      pan: "",
      aadhaar: "",
    };

    try {
      await projectFirestore.collection("users-propdial").doc(phone).set(userData);
      alert("✅ User added successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      setError("❌ Failed to add user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-user-form" style={styles.form}>
      <h2 style={styles.heading}>➕ Add New User</h2>

      {/* Phone Number */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Phone Number *</label>
      <PhoneInput
  key={countryCode} // triggers re-render
  country={"in"}
  value={phone}
  onChange={handlePhoneChange}
  international
  placeholder="Enter phone number"
  inputStyle={styles.phoneInput}
  buttonStyle={styles.phoneButton}
/>

        {phoneExists && <span style={styles.error}>This phone number is already registered.</span>}
      </div>

      {/* Name */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Full Name *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
      </div>

      {/* Email */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Email *</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
      </div>

      {/* City */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>City *</label>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} style={styles.input} />
      </div>

      {/* Gender */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Gender *</label>
        <div style={styles.radioGroup}>
          {["male", "female", "other"].map((g) => (
            <label key={g} style={styles.radioLabel}>
           <input
  type="radio"
  name="gender"
  value={g}
  checked={gender === g}
  onChange={(e) => setGender(e.target.value)}
/>

              {" " + g.charAt(0).toUpperCase() + g.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Who Is User */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Who is User? *</label>
        <div style={styles.radioGroup}>
          {["owner", "tenant", "admin", "hr", "executive", "manager"].map((role) => (
            <label key={role} style={styles.radioLabel}>
            <input
  type="radio"
  name="whoIsUser"
  value={role}
  checked={whoIsUser === role}
  onChange={(e) => setWhoIsUser(e.target.value)}
/>

              {" " + role.charAt(0).toUpperCase() + role.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!allFieldsFilled() || isSubmitting}
        style={{
          ...styles.button,
          opacity: !allFieldsFilled() || isSubmitting ? 0.6 : 1,
          cursor: !allFieldsFilled() || isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "Adding..." : "Add User"}
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: 500,
    margin: "40px auto",
    padding: 20,
    borderRadius: "10px",
    background: "#f9ffff",
    border: "1px solid #00A8A8",
    boxShadow: "0 0 12px rgba(0, 168, 168, 0.15)",
  },
  heading: {
    textAlign: "center",
    color: "#007777",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    display: "block",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 5,
    fontSize: 16,
  },
  phoneInput: {
    width: "100%",
    height: "45px",
    paddingLeft: "48px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #00A8A8",
  },
  phoneButton: {
    borderRadius: "5px 0 0 5px",
    border: "1px solid #00A8A8",
  },
  radioGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: 5,
  },
  radioLabel: {
    fontSize: "14px",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginTop: 5,
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#00A8A8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "0.3s",
  },
};

export default AddUser;
