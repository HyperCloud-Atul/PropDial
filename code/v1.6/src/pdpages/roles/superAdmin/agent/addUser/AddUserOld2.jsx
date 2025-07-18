import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { projectFirestore, timestamp } from "../../../../../firebase/config";
import "react-phone-input-2/lib/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { getNames } from "country-list";
import Select from "react-select";

const AddUser = () => {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [city, setCity] = useState("");
  const [gender, setGender] = useState("Mr.");
  const [whoIsUser, setWhoIsUser] = useState("");
  const [country, setCountry] = useState("");
  const [countryDialCode, setCountryDialCode] = useState("");
  const [salutation, setSalutation] = useState("");
  const [address, setAddress] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(false);

  const [residentialCountry, setResidentialCountry] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    const countries = getNames();
    const options = countries.map((country) => ({
      label: country,
      value: country,
    }));
    setCountryOptions(options);
  }, []);
  useEffect(() => {
    const countries = getNames(); // Returns array of country names
    setCountryList(countries);
  }, []);

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappNumberCountryCode, setWhatsappNumberCountryCode] =
    useState("");
  const [whatsappNumberCountryDialCode, setWhatsappNumberCountryDialCode] =
    useState("");
  const [whatsappNumberCountry, setWhatsappNumberCountry] = useState("");

  const [error, setError] = useState("");
  const [phoneExists, setPhoneExists] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Capitalize the first letter of each word, lowercase the rest
function toTitleCase(str) {
  return str
    .split(" ")
    .filter(Boolean)
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}
  // In your state section

  // Update salutation when gender changes
  useEffect(() => {
    if (gender === "male") setSalutation("Mr.");
    else if (gender === "female") setSalutation("Ms.");
    else setSalutation("Mr.");
  }, [gender]);

  const handlePhoneChange = (value, data) => {
    setPhone(value);
    setCountryCode(data?.countryCode || ""); // like "in"
    setCountryDialCode(data?.dialCode || ""); // like "91"
    setCountry(data?.name || ""); // like "India"
    setError("");
  };

  const handleWhatsAppChange = (value, data) => {
    setWhatsappNumber(value);
    setWhatsappNumberCountryCode(data?.countryCode || "");
    setWhatsappNumberCountryDialCode(data?.dialCode || "");
    setWhatsappNumberCountry(data?.name || "");
  };

  useEffect(() => {
    if (sameAsPhone) {
      setWhatsappNumber(phone);
      setWhatsappNumberCountryCode(countryCode);
      setWhatsappNumberCountryDialCode(countryDialCode);
      setWhatsappNumberCountry(country);
    }
  }, [sameAsPhone, phone, countryCode, countryDialCode, country]);

  const allFieldsFilled = () => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return (
      phone &&
      name &&
      email &&
      whatsappNumber &&
      validEmail &&
      gender &&
      whoIsUser &&
      salutation &&
      residentialCountry &&
      !phoneExists
    );
  };
  
const validateFields = () => {
  const errors = {};
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!phone) errors.phone = "Phone number is required.";
  if (!name) errors.name = "Full name is required.";
  if (!email) errors.email = "Email is required.";
  if (email && !validEmail) errors.email = "Invalid email format.";
  if (!whatsappNumber) errors.whatsappNumber = "WhatsApp number is required.";
  if (!gender) errors.gender = "Gender is required.";
  if (!whoIsUser) errors.whoIsUser = "User type is required.";
  if (!salutation) errors.salutation = "Salutation is required.";
  if (!residentialCountry) errors.residentialCountry = "Residential country is required.";

  setFieldErrors(errors);
  return Object.keys(errors).length === 0;
};

  const resetForm = () => {
    setPhone("");
    setCountry("");
    setCountryCode("");
    setCountryDialCode("");
    setName("");
    setSalutation("");
    setResidentialCountry(null);
    setWhatsappNumber("");
    setWhatsappNumberCountry("");
    setWhatsappNumberCountryCode("");
    setWhatsappNumberCountryDialCode("");
    setAddress("");
    setSameAsPhone(false);
    setEmail("");
    setCity("");
    setGender("");
    setWhoIsUser("");
    setError("");
    setPhoneExists(false);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

  if (!validateFields()) {
    setError("⚠️ Please fill all required fields.");
    return;
  }

  if (phoneExists) {
    setError("⚠️ This phone number is already registered.");
    return;
  }

  setError("");
  setIsSubmitting(true);
    let imgUrl = "/assets/img/dummy_user.png";
    const userData = {
      online: true,
      whatsappUpdate: false,
      displayName: name.trim().split(" ")[0],
      fullName: name,
      phoneNumber: phone,
      email: email.toLowerCase().trim(),
      city,
      address,
      gender,
      countryDialCode,
      whoAmI: whoIsUser,
      country,
      propertyManagerID: "",
      countryCode,
      photoURL: imgUrl,
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
      salutation,
      residentialCountry,
      whatsappNumber,
      whatsappNumberCountry,
      whatsappNumberCountryCode,
      whatsappNumberCountryDialCode,

      department: "",
      designation: "",
      uan: "",
      pan: "",
      aadhaar: "",
    };

    try {
      await projectFirestore
        .collection("users-propdial")
        .doc(phone)
        .set(userData);
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
    <div className="top_header_pg pg_bg">
      <div className="page_spacing">
        <div
          className="card shadow-lg rounded-4 border-0"
          style={{
            padding: "15px",
          }}
        >
          <h3 className="text-center text-primary mb-4">➕ Add New User</h3>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6">
                {/* Phone Number */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Phone Number *</label>
                  <PhoneInput
                    // country={"in"}
                    value={phone}
                    onChange={handlePhoneChange}
                    inputStyle={{
                      width: "100%",
                      height: "45px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: phoneExists
                        ? "1px solid red"
                        : "1px solid #ced4da",
                    }}
                    buttonStyle={{
                      borderRadius: "8px 0 0 8px",
                      border: phoneExists
                        ? "1px solid red"
                        : "1px solid #ced4da",
                    }}
                    placeholder="Enter phone number"
                  />
                  {phoneExists && (
                    <div className="text-danger small mt-1">
                      This phone number is already registered.
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                {/* WhatsApp Number */}              
                <div className="mb-4">
                  <label className="form-label fw-bold d-flex align-items-center justify-content-between">
                    WhatsApp Number *
                    <div>
                      <input
                        type="checkbox"
                        id="sameAsPhone"
                        checked={sameAsPhone}
                        onChange={() => setSameAsPhone(!sameAsPhone)}
                        className="me-2"
                      />
                      <label htmlFor="sameAsPhone" className="form-check-label">
                        Same as phone
                      </label>
                    </div>
                  </label>

                  <PhoneInput
                    // country={"in"}
                    value={whatsappNumber}
                    onChange={handleWhatsAppChange}
                    inputStyle={{
                      width: "100%",
                      height: "45px",
                      fontSize: "16px",
                      borderRadius: "6px",
                    }}
                    disabled={sameAsPhone}
                    placeholder="Enter whatsapp number"
                  />
                </div>
              </div>
              <div className="col-lg-12">
                {/* Gender */}
                <div className="field_box theme_radio_new mb-4">
                  <label className="form-label fw-bold mb-2">Gender *</label>
                  <div
                    className="theme_radio_container"
                    style={{
                      border: "none",
                      padding: "0px",
                    }}
                  >
                    {["male", "female"].map((g) => (
                      <div className="radio_single" key={g}>
                        <input
                          type="radio"
                          name="gender"
                          id={g}
                          value={g}
                          onChange={(e) => setGender(e.target.value)}
                          checked={gender === g}
                        />
                        <label htmlFor={g}>
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* user type  */}
              <div className="col-lg-12">
                <div className="field_box theme_radio_new mb-4">
                  <label className="form-label fw-bold mb-2">User Type *</label>
                  <div
                    className="theme_radio_container"
                    style={{
                      border: "none",
                      padding: "0px",
                    }}
                  >
                    {[
                      "owner",
                      "tenant",
                      "admin",
                      "hr",
                      "buyer",
                      "executive",
                      "manager",
                    ].map((role) => (
                      <div className="radio_single" key={role}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="whoIsUser"
                          id={role}
                          value={role}
                          checked={whoIsUser === role}
                          onChange={(e) => setWhoIsUser(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* salutation  */}
              <div className="col-4">
                <div className="form-floating mb-4">
                  <select
                    className="form-select"
                    id="floatingSalutation"
                    value={salutation}
                    onChange={(e) => setSalutation(e.target.value)}
                  >
                    <option value="">Select Salutation</option>
                    {[
                      "Capt.",
                      "Col.",
                      "Dr.",
                      "Hon.",
                      "Lt.",
                      "Madam",
                      "Major",
                      "Mr.",
                      "Mrs.",
                      "Ms.",
                      "Prof.",
                      "Rev.",
                      "Sir",
                    ].map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="floatingSalutation">Salutation *</label>
                </div>
              </div>
              {/* Name */}
              <div className="col-8">
                <div className="form-floating mb-4">
                  <input
                    type="text"
                    className="form-control rounded-3"
                    id="name"
                    placeholder="Full Name"
                    value={name}
                    onBlur={() => setName(toTitleCase(name))}    // ← apply Title Case on blur
                    onChange={(e) => setName(e.target.value)}
                       onKeyPress={(e) => {
                          const regex = /^[a-zA-Z\s]*$/; 
                          if (!regex.test(e.key)) {
                            e.preventDefault(); 
                          }
                        }}
                     
                  />
                  <label htmlFor="name">Full Name *</label>
                </div>
              </div>
              {/* Email */}
              <div className="col-lg-12">
                <div className="form-floating mb-4">
                  <input
                    type="email"
                    className="form-control rounded-3"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="email">Email *</label>
                </div>
              </div>

              {/* Residential Country */}
              {/* <div className="col-lg-6">
              <div className="form-floating mb-4">
                <select
                  className="form-select"
                  id="floatingCountry"
                  value={residentialCountry}
                  onChange={(e) => setResidentialCountry(e.target.value)}
                >
                  <option value="">Select Country</option>
                  {countryList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingCountry">Residential Country *</label>
              </div>
            </div> */}
              <div className="col-lg-6">
                <div className="custom_floating_label mb-4">
                  {/* <select
          className="form-select"
          id="floatingCountry"
          value={residentialCountry}
          onChange={(e) => setResidentialCountry(e.target.value)}
        >
          <option value="">Select Country</option>
          {countryList.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select> */}
                  <label htmlFor="floatingCountry" className="floating_label">
                    Residential Country *
                  </label>
                  {/* <Select
                    options={countryOptions}
                    value={countryOptions.find(
                      (c) => c.value === residentialCountry
                    )}
                    onChange={(selectedOption) =>
                      setResidentialCountry(
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    placeholder="Select Country"
                    isClearable
                    menuPortalTarget={document.body} // 👈 Mounts dropdown to body
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }), // 👈 Brings it on top
                    }}
                  /> */}
                  <Select
                    options={countryOptions}
                    value={
                      countryOptions.find(
                        (c) => c.value === residentialCountry
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      setResidentialCountry(
                        selectedOption ? selectedOption.value : null
                      )
                    }
                    placeholder="Select Country"
                    isClearable
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>
              </div>
              {/* City */}
              <div className="col-lg-6">
                <div className="form-floating mb-4">
                  <input
                    type="text"
                    className="form-control rounded-3"
                    id="city"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <label htmlFor="city">City</label>
                </div>
              </div>
              {/* address  */}
              <div className="col-lg-12">
                <div className="form-floating mb-4">
                  <textarea
                    className="form-control"
                    placeholder="Enter address"
                    id="floatingAddress"
                    style={{ height: "100px" }}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                  <label htmlFor="floatingAddress">Address</label>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-danger py-2 small">{error}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 mt-3 rounded-3"
              disabled={!allFieldsFilled() || isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
