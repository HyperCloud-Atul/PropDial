import React, { useState, useEffect, useRef } from "react";
import styles from "./PropertyListingPage.module.scss";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import {
  ref,
  listAll,
  getStorage,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable, // Use uploadBytesResumable for progress tracking
} from "firebase/storage";
import { Link, useParams } from "react-router-dom";
import { projectStorage, projectFirestore } from "../../firebase/config";
import imageCompression from "browser-image-compression";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthContext } from "../../hooks/useAuthContext";
import { uploadBytes } from "firebase/storage";

import "./new-society.scss";
import ComponentBuilder from "./ComponentBuilder";
import {
  MdAdd,
  MdClose,
  MdElevator,
  MdCheckCircle,
  MdMeetingRoom,
  MdOutlinePhotoLibrary,
} from "react-icons/md"; // Add this
import {
  FaRegBuilding,
  FaExclamationTriangle,
  FaExpand,
  FaSpinner,
  FaWalking,
  FaBolt,
  FaSwimmingPool,
  FaUserShield,
  FaTree,
  FaParking,
  FaDumbbell,
  FaGamepad,
  FaShower,
  FaPrayingHands,
  FaBed,
  FaSearch,
  FaEdit,
  FaPlus,
  FaBatteryFull,
  FaTint,
  FaVideo,
  FaUpload,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSave,
  FaTrash,
  FaVectorSquare,
  FaExclamationCircle,
  FaCheckCircle,
  FaImage,
} from "react-icons/fa";
import { BsFileEarmarkText } from "react-icons/bs";

import {
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  Calendar,
  Building,
  Star,
  Quote,
  Loader2,
  Upload,
} from "lucide-react";

const reviews = [
  {
    name: "Priya Sharma",
    rating: 5,
    date: "2 months ago",
    review:
      "Excellent society with world-class amenities. The maintenance is top-notch and the security is very good. My family loves the swimming pool and kids play area.",
    apartment: "3BHK, Tower A",
  },
  {
    name: "Amit Patel",
    rating: 5,
    date: "3 months ago",
    review:
      "Great location with easy access to IT parks and malls. The clubhouse is amazing and the gym has all modern equipment. Highly recommend for IT professionals.",
    apartment: "2BHK, Tower B",
  },
  {
    name: "Sneha Reddy",
    rating: 4,
    date: "1 month ago",
    review:
      "Beautiful society with lush green landscaping. The apartments are spacious and well-designed. The management is responsive to all queries and complaints.",
    apartment: "4BHK, Tower C",
  },
  {
    name: "Rajesh Kumar",
    rating: 5,
    date: "4 months ago",
    review:
      "Premium quality construction and excellent amenities. The society has a great community feel. Kids love the playground and the library is well-maintained.",
    apartment: "3BHK, Tower D",
  },
  {
    name: "Meera Joshi",
    rating: 4,
    date: "2 weeks ago",
    review:
      "Good connectivity to major areas of Bangalore. The society is well-planned with ample parking space. The power backup system works efficiently.",
    apartment: "2BHK, Tower E",
  },
  {
    name: "Vikram Singh",
    rating: 5,
    date: "5 months ago",
    review:
      "Outstanding society with professional management. The security is excellent with 24/7 CCTV surveillance. Great investment for the future.",
    apartment: "4BHK, Tower F",
  },
];

const ReviewsSection = () => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`star-icon ${i < rating ? "filled" : "empty"}`}
      />
    ));
  };

  return (
    <section className="reviews-section">
      <div className="container">
        <div className="section-header">
          <h2>Resident Reviews</h2>
          <p>
            Hear what our residents have to say about their living experience at
            Emerald Heights
          </p>
        </div>

        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="card-content">
                <div className="review-content">
                  <Quote className="quote-icon" />
                  <div className="review-details">
                    <div className="rating-container">
                      <div className="stars">{renderStars(review.rating)}</div>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <p className="review-text">{review.review}</p>
                    <div className="reviewer-info">
                      <p className="reviewer-name">{review.name}</p>
                      <p className="reviewer-apartment">{review.apartment}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="average-rating">
          <div className="rating-badge">
            <div className="stars">{renderStars(5)}</div>
            <span className="rating-score">4.8/5</span>
            <span className="rating-count">• Based on 150+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

function formatStateName(slug) {
  return slug
    .replace(/-/g, " ") // Replace dashes with spaces
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" ");
}

const EditModal = ({ data, onClose, onSave }) => {
  const [formData, setFormData] = useState(data);
  const [currentUnitType, setCurrentUnitType] = useState("");
  const [errors, setErrors] = useState({});

  // Refs for each scrollable input field
  const builderRef = useRef(null);
  const addressRef = useRef(null);
  const priceFromRef = useRef(null);
  const priceToRef = useRef(null);
  const projectSizeRef = useRef(null);
  const totalUnitsRef = useRef(null);
  const totalTowersRef = useRef(null);
  const possessionYearRef = useRef(null);
  const launchedYearRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user makes changes
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleUnitTypeAdd = () => {
    if (currentUnitType && !formData.unitTypes.includes(currentUnitType)) {
      setFormData((prev) => ({
        ...prev,
        unitTypes: [...prev.unitTypes, currentUnitType],
      }));
      setCurrentUnitType("");
    }
  };

  const handleUnitTypeRemove = (typeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      unitTypes: prev.unitTypes.filter((type) => type !== typeToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    // Launched year validation
    if (formData.launchedYear) {
      if (parseInt(formData.launchedYear) > currentYear) {
        newErrors.launchedYear = "Launched year cannot be in the future";
      }
    }

    // Possession year validation
    if (formData.possessionYear) {
      if (parseInt(formData.possessionYear) < currentYear) {
        newErrors.possessionYear = "Possession year cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  // Generic function to scroll an element into view
  const handleFocus = (ref) => {
    if (ref.current) {
      setTimeout(() => {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300); // Small delay to let the keyboard appear
    }
  };

  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h2>Society Profile Management</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Society Type</label>
              <input
                type="text"
                name="societyType"
                value={formData.societyType || ""}
                readOnly
                disabled
              />
            </div>

            <div className="form-group">
              <label>Society Name</label>
              <input
                type="text"
                name="society"
                value={formData.society}
                readOnly
                disabled
              />
            </div>

            <div className="form-group">
              <label>Builder Name</label>
              <input
                ref={builderRef}
                type="text"
                name="builder"
                value={formData.builder}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/[^a-zA-Z\s]/g, "");
                  setFormData({ ...formData, builder: value });
                }}
                onFocus={() => handleFocus(builderRef)}
                placeholder="Enter builder name"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                ref={addressRef}
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onFocus={() => handleFocus(addressRef)}
                placeholder="Enter full address"
              />
            </div>

            <div className="form-group">
              <label>Price From (₹ Cr)</label>
              <input
                ref={priceFromRef}
                type="number"
                name="priceFrom"
                value={formData.priceFrom}
                onChange={handleChange}
                onFocus={() => handleFocus(priceFromRef)}
                placeholder="e.g., 2.02"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Price To (₹ Cr)</label>
              <input
                ref={priceToRef}
                type="number"
                name="priceTo"
                value={formData.priceTo}
                onChange={handleChange}
                onFocus={() => handleFocus(priceToRef)}
                placeholder="e.g., 2.52"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Project Size in Acre</label>
              <input
                ref={projectSizeRef}
                id="productSize"
                type="text"
                name="projectSize"
                value={formData.projectSize || ""}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 3) value = value.slice(0, 3);
                  setFormData({ ...formData, projectSize: value });
                }}
                onFocus={() => handleFocus(projectSizeRef)}
                inputMode="numeric"
                placeholder="Enter project size"
              />
            </div>

            <div className="form-group">
              <label>Total Units</label>
              <input
                ref={totalUnitsRef}
                id="totalUnits"
                type="text"
                name="totalUnits"
                value={formData.totalUnits || ""}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 4) value = value.slice(0, 4);
                  setFormData({ ...formData, totalUnits: value });
                }}
                onFocus={() => handleFocus(totalUnitsRef)}
                inputMode="numeric"
                placeholder="Enter total units"
              />
            </div>

            <div className="form-group">
              <label>Total Towers</label>
              <input
                ref={totalTowersRef}
                id="totalTowers"
                type="text"
                name="totalTowers"
                value={formData.totalTowers || ""}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 3) value = value.slice(0, 3);
                  setFormData({ ...formData, totalTowers: value });
                }}
                onFocus={() => handleFocus(totalTowersRef)}
                inputMode="numeric"
                placeholder="Enter total towers"
              />
            </div>

            <div className="form-group toggle-group">
              {/* <div className="toggle-description">
                <label className="toggle-label">Approved By RERA </label>
                <div
                  className={`toggle-switch ${
                    formData.reraApproved ? "active" : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      reraApproved: !prev.reraApproved,
                    }))
                  }
                >
                  <div className="toggle-circle" />
                </div>
              </div> */}

              <div className="toggle-description">
                <label className="toggle-label">Ready to Move In</label>
                <div
                  className={`toggle-switch ${
                    formData.readyToMove ? "active" : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      readyToMove: !prev.readyToMove,
                    }))
                  }
                >
                  <div className="toggle-circle" />
                </div>
              </div>
            </div>

            {!formData.readyToMove && (
              <div className="form-group">
                <label>Possession Year</label>
                <select
                  ref={possessionYearRef}
                  name="possessionYear"
                  value={formData.possessionYear || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, possessionYear: e.target.value })
                  }
                  onFocus={() => handleFocus(possessionYearRef)}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 70 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                {errors.possessionYear && (
                  <span className="error">{errors.possessionYear}</span>
                )}
              </div>
            )}

            {formData.readyToMove && (
              <div className="form-group">
                <label>Launched Year</label>
                <select
                  ref={launchedYearRef}
                  name="launchedYear"
                  value={formData.launchedYear || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, launchedYear: e.target.value })
                  }
                  onFocus={() => handleFocus(launchedYearRef)}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 50 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                {errors.launchedYear && (
                  <span className="error">{errors.launchedYear}</span>
                )}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditAbout = ({ data, onClose, onSave }) => {
  const [formData, setFormData] = useState(data);
  const [currentUnitType, setCurrentUnitType] = useState("");
  const [errors, setErrors] = useState({});
  const [currentPlan, setCurrentPlan] = useState(null);
  const descriptionRef = useRef(null); // Step 1: Create a ref

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user makes changes
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleUnitTypeAdd = () => {
    if (currentUnitType && !formData.unitTypes.includes(currentUnitType)) {
      setFormData((prev) => ({
        ...prev,
        unitTypes: [...prev.unitTypes, currentUnitType],
      }));
      setCurrentUnitType("");
    }
  };

  const handleUnitTypeRemove = (typeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      unitTypes: prev.unitTypes.filter((type) => type !== typeToRemove),
    }));
  };
  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    // Launched year validation
    if (formData.launchedYear) {
      if (parseInt(formData.launchedYear) > currentYear) {
        newErrors.launchedYear = "Launched year cannot be in the future";
      }
    }

    // Possession year validation
    if (formData.possessionYear) {
      if (parseInt(formData.possessionYear) < currentYear) {
        newErrors.possessionYear = "Possession year cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // New function to handle focus and scroll
  const handleFocus = () => {
    if (descriptionRef.current) {
      setTimeout(() => {
        descriptionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300); // A small delay to allow the keyboard to appear
    }
  };
  const backup = [
    "No Backup",
    "Full Backup",
    "Partial Backup",
    "Lift Only",
    "Inverter",
  ];

  const unitTypes = [
    "EWS",
    "1 RK",
    "Studio",
    "1 BHK",
    "1.5 BHK",
    "2 BHK",
    "2.5 BHK",
    "3 BHK",
    "3.5 BHK",
    "4 BHK",
    "5 BHK",
    "6 BHK",
    "7 BHK",
    "8 BHK",
    "9 BHK",
    "9+ BHK",
    "Hall",
  ];
  const handleUnitTypeChange = (option, isChecked) => {
    setFormData((prev) => {
      const newUnitTypes = isChecked
        ? [...(prev.unitTypes || []), option]
        : (prev.unitTypes || []).filter((item) => item !== option);
      return { ...prev, unitTypes: newUnitTypes };
    });
  };

  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h2>Edit Society Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Society Type</label>
              <input
                type="text"
                name="societyType"
                value={formData.societyType || ""}
                readOnly
                disabled
              />
            </div>
            <div className="form-group">
              <label>Project Size in Acre</label>
              <input
                id="productSize"
                type="text"
                name="projectSize"
                value={formData.projectSize || ""}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 3) value = value.slice(0, 3);
                  setFormData({ ...formData, projectSize: value });
                }}
                inputMode="numeric"
                placeholder="Enter project size"
              />
            </div>

            <div className="form-group">
              <label>Total Units</label>
              <input
                id="totalUnits"
                type="text"
                name="totalUnits"
                value={formData.totalUnits || ""}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, ""); // allow only digits
                  if (value.length > 4) value = value.slice(0, 4); // limit to 4 digits
                  setFormData({ ...formData, totalUnits: value });
                }}
                inputMode="numeric"
                placeholder="Enter total units"
              />
            </div>

            <div className="form-group">
              <label>Total Towers</label>
              <input
                id="totalTowers"
                type="text"
                name="totalTowers"
                value={formData.totalTowers || ""}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 3) value = value.slice(0, 3);
                  setFormData({ ...formData, totalTowers: value });
                }}
                inputMode="numeric"
                placeholder="Enter total towers"
              />
            </div>
            <div className="form-group toggle-group">
              {/* <div className="toggle-description">
                <label className="toggle-label">Approved By RERA </label>
                <div
                  className={`toggle-switch ${
                    formData.reraApproved ? "active" : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      reraApproved: !prev.reraApproved,
                    }))
                  }
                >
                  <div className="toggle-circle" />
                </div>
              </div> */}

              <div className="toggle-description">
                <label className="toggle-label">Ready to Move In</label>
                <div
                  className={`toggle-switch ${
                    formData.readyToMove ? "active" : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      readyToMove: !prev.readyToMove,
                    }))
                  }
                >
                  <div className="toggle-circle" />
                </div>
              </div>
            </div>
            {/* <div className="form-group toggle-group">
              
            </div> */}

            {!formData.readyToMove && (
              <div className="form-group">
                <label>Year of Handover</label>
                <select
                  name="possessionYear"
                  value={formData.possessionYear || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, possessionYear: e.target.value })
                  }
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 70 }, (_, i) => {
                    const year = new Date().getFullYear() + i; // current + next 70 years
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>

                {errors.possessionYear && (
                  <span className="error">{errors.possessionYear}</span>
                )}
              </div>
            )}

            {formData.readyToMove && (
              <div className="form-group">
                <label>Built In</label>
                <select
                  name="launchedYear"
                  value={formData.launchedYear || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, launchedYear: e.target.value })
                  }
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 50 }, (_, i) => {
                    const year = new Date().getFullYear() - i; // Last 50 years
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                {errors.launchedYear && (
                  <span className="error">{errors.launchedYear}</span>
                )}
              </div>
            )}

            <div className="form-group">
              <label>Power Backup</label>
              <select
                id="powerBackup"
                value={formData.powerBackup || "No Backup"}
                onChange={(e) =>
                  setFormData({ ...formData, powerBackup: e.target.value })
                }
              >
                {backup.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group toggle-group">
              <div className="toggle-description">
                <label className="toggle-label">Visitor Parking</label>
                <div
                  className={`toggle-switch ${
                    formData.visitorParking ? "active" : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      visitorParking: !prev.visitorParking,
                    }))
                  }
                >
                  <div className="toggle-circle" />
                </div>
              </div>

              <div className="toggle-description">
                <label className="toggle-label">Club</label>
                <div
                  className={`toggle-switch ${formData.club ? "active" : ""}`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      club: !prev.club,
                    }))
                  }
                >
                  <div className="toggle-circle" />
                </div>
              </div>
            </div>

            <div className="form-group toggle-group">
              <div className="toggle-description">
                <label className="toggle-label">Swimming Pool</label>
                <div
                  className={`toggle-switch ${
                    formData.swimmingPool ? "active" : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      swimmingPool: !prev.swimmingPool,
                    }))
                  }
                >
                  <div className="toggle-circle" />
                </div>
              </div>

              <div className="toggle-description">
                <label className="toggle-label">Gym</label>
                <div
                  className={`toggle-switch ${formData.gym ? "active" : ""}`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      gym: !prev.gym,
                    }))
                  }
                >
                  <div className="toggle-circle" />
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Unit Types</label>
              <div className="checkbox-grid">
                {unitTypes.map((option) => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.unitTypes?.includes(option) || false}
                      onChange={(e) =>
                        handleUnitTypeChange(option, e.target.checked)
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description field moved to full width at the end */}
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                ref={descriptionRef} // Step 2: Add the ref here
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={handleFocus} // Step 3: Add the onFocus event handler
                placeholder="Enter society description"
                rows="5"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditRates = ({ data, onClose, onSave }) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});

  // Refs for each input to scroll into view on focus
  const electricityAuthRef = useRef(null);
  const electricityBackupRef = useRef(null);
  const waterChargesRef = useRef(null);
  const maintenanceRef = useRef(null);
  const commonElectricityRef = useRef(null);
  const clubChargesRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;

    // Clear error when user makes changes
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const maxValues = {
      electricityRateAuthority: 99,
      electricityRatePowerBackup: 99,
      waterCharges: 99,
      commonAreaMaintenance: 99,
      commonAreaElectricity: 99,
      clubCharges: 9999,
    };

    Object.keys(maxValues).forEach((field) => {
      if (formData[field] > maxValues[field]) {
        newErrors[field] = `Value cannot exceed ${maxValues[field]}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  // Function to handle focus and scroll the element into view
  const handleFocus = (ref) => {
    if (ref.current) {
      setTimeout(() => {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300); // Small delay to let the keyboard appear
    }
  };

  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h2>Edit Society Rates</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Electricity Rate</label>
              <input
                ref={electricityAuthRef}
                type="number"
                name="electricityRateAuthority"
                value={formData.electricityRateAuthority || ""}
                onChange={handleChange}
                onFocus={() => handleFocus(electricityAuthRef)}
                placeholder="Enter rate"
                min="0"
                max="99"
                step="0.01"
              />
              {errors.electricityRateAuthority && (
                <span className="error">{errors.electricityRateAuthority}</span>
              )}
              <p className="rate-description">₹ per unit</p>
            </div>

            <div className="form-group">
              <label>Power Backup</label>
              <input
                ref={electricityBackupRef}
                type="number"
                name="electricityRatePowerBackup"
                value={formData.electricityRatePowerBackup || ""}
                onChange={handleChange}
                onFocus={() => handleFocus(electricityBackupRef)}
                placeholder="Enter rate"
                min="0"
                max="99"
                step="0.01"
              />
              {errors.electricityRatePowerBackup && (
                <span className="error">
                  {errors.electricityRatePowerBackup}
                </span>
              )}
              <p className="rate-description">₹ per unit</p>
            </div>

            {/* <div className="form-group">
              <label>Water Charges</label>
              <input
                ref={waterChargesRef}
                type="number"
                name="waterCharges"
                value={formData.waterCharges || ""}
                onChange={handleChange}
                onFocus={() => handleFocus(waterChargesRef)}
                placeholder="Enter rate"
                min="0"
                max="99"
                step="0.01"
              />
              {errors.waterCharges && (
                <span className="error">{errors.waterCharges}</span>
              )}
              <p className="rate-description">₹ per 1000L</p>
            </div> */}

            <div className="form-group">
              <label>Common Area Maintenance</label>
              <input
                ref={maintenanceRef}
                type="number"
                name="commonAreaMaintenance"
                value={formData.commonAreaMaintenance || ""}
                onChange={handleChange}
                onFocus={() => handleFocus(maintenanceRef)}
                placeholder="Enter rate"
                min="0"
                max="99"
                step="0.01"
              />
              {errors.commonAreaMaintenance && (
                <span className="error">{errors.commonAreaMaintenance}</span>
              )}
              <p className="rate-description">₹ per sq/ft</p>
            </div>

            {/* <div className="form-group">
              <label>Common Area Electricity</label>
              <input
                ref={commonElectricityRef}
                type="number"
                name="commonAreaElectricity"
                value={formData.commonAreaElectricity || ""}
                onChange={handleChange}
                onFocus={() => handleFocus(commonElectricityRef)}
                placeholder="Enter rate"
                min="0"
                max="99"
                step="0.01"
              />
              {errors.commonAreaElectricity && (
                <span className="error">{errors.commonAreaElectricity}</span>
              )}
              <p className="rate-description">₹ per month</p>
            </div> */}

            <div className="form-group">
              <label>Club Charges</label>
              <input
                ref={clubChargesRef}
                type="number"
                name="clubCharges"
                value={formData.clubCharges || ""}
                onChange={handleChange}
                onFocus={() => handleFocus(clubChargesRef)}
                placeholder="Enter rate"
                min="0"
                max="9999"
                step="1"
              />
              {errors.clubCharges && (
                <span className="error">{errors.clubCharges}</span>
              )}
              <p className="rate-description">₹ per month</p>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SocietyDetails = ({ country, state, city, locality, societyId }) => {
  const { user } = useAuthContext();
  const [societyData, setSocietyData] = useState({
    societyType: "Residential",
    society: "New Society",
    builder: "",
    address: "",
    priceFrom: "",
    priceTo: "",
    possessionYear: "",
    readyToMove: false,
    launchedYear: "",
    totalUnits: "",
    totalTowers: "",
    projectSize: "",
    // reraApproved: false,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch society data from Firestore (No changes needed here)
  useEffect(() => {
    const fetchData = async () => {
      if (!societyId) {
        setLoading(false);
        return;
      }
      try {
        const docRef = projectFirestore
          .collection("m_societies")
          .doc(societyId);
        const doc = await docRef.get();

        if (doc.exists) {
          const data = doc.data();
          setSocietyData((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [societyId]);

  // FIX 1: Correctly handle the save action
  const handleSave = async (updatedData) => {
    try {
      const docRef = projectFirestore.collection("m_societies").doc(societyId);

      // FIX 1.1: Use the correct keys from formData ('name', 'type')
      // The `updatedData` object already has the correct structure.
      const updateObject = {
        ...updatedData, // Spread the form data
        lastUpdated: new Date(),
      };

      await docRef.set(updateObject, { merge: true });

      // FIX 1.2: Update state correctly with the data from the form
      setSocietyData((prev) => ({ ...prev, ...updatedData }));
      setShowEditModal(false);
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save changes.");
    }
  };

  if (loading)
    return (
      <div className="loading-spinner">
        <FaSpinner className="spin" size={40} />
        <p>Loading Society Details...</p>
      </div>
    );
  if (error) return <div className="error-message">{error}</div>;

  // FIX 2: Use the formatAddress function for a clean and consistent location display
  const formattedState = formatStateName(state);
  const formattedCity = formatStateName(city);
  const formattedLocality = formatStateName(locality);
  return (
    <section className="society-details-section">
      <div className="container">
        <div className="content-grid">
          {/* Left Column - Society Details */}
          {societyData.builder &&
          societyData.address &&
          societyData.priceFrom &&
          societyData.priceTo &&
          societyData.totalUnits &&
          societyData.totalTowers &&
          societyData.projectSize ? (
            <div className="details-column">
              {/* Status Badges */}

              <div className="badges-full">
                <div className="badges-container">
                  {societyData.readyToMove ? (
                    <div className="badge badge--ready-to-move">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon--left"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-8.5" />
                        <path d="M22 4L12 14.01l-3-3" />
                      </svg>
                      <p style={{ fontSize: "16px" }}>
                        Ready to Move Since{" "}
                        <span style={{ fontWeight: "700" }}>
                          '{societyData?.launchedYear || "N/A"}'
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="badge badge--under-construction">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon--left"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <p style={{ fontSize: "16px" }}>
                        <span style={{ fontWeight: "700" }}>
                          Under Construction
                        </span>
                      </p>
                    </div>
                  )}

                  {/* {societyData.reraApproved && (
                    <div className="badge badge--rera-approved">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon--left"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      RERA Approved
                    </div>
                  )} */}
                </div>
                {user && ["admin", "superAdmin"].includes(user.role) && (
                  <button
                    className="edit-btn"
                    onClick={() => setShowEditModal(true)}
                  >
                    <FaEdit />
                  </button>
                )}
              </div>

              {/* Society Name & Developer */}
              <div className="name-developer-container">
                <h1 className="society-name">
                  {societyData.society || "New Society"}
                </h1>
                <div className="developer-info">
                  <p className="developer-name">
                    by {societyData.builder || "Unknown Developer"}
                  </p>
                  <div className="location-info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon--left icon-larger-screen"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="location-text">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon--left icon-small"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {formattedLocality}, {formattedCity}, {formattedState}
                    </span>
                    <button
                      className="map-link"
                      onClick={() => {
                        const section =
                          document.getElementById("Nearby-Locations");
                        if (section) {
                          section.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      View on Map
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="price-card">
                <div className="price-content">
                  <p className="price-label">Price Range</p>
                  <div className="price-value">
                    ₹ {societyData.priceFrom} Cr – ₹ {societyData.priceTo} Cr
                  </div>
                  {/* <p className="price-description">
                    Multiple Types • {societyData.societyType} •{" "}
                    {societyData.readyToMove && "Ready to Move"}
                  </p> */}
                </div>
              </div>

              {/* Key Facts */}
              <div className="facts-grid">
                <div className="fact-card">
                  <div className="fact-content">
                    <div className="fact-icon-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon"
                      >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <div>
                      <p className="fact-label">Project Size</p>
                      <p className="fact-value">
                        {societyData.projectSize || 0} Acres
                      </p>
                    </div>
                  </div>
                </div>
                <div className="fact-card">
                  <div className="fact-content">
                    <div className="fact-icon-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div>
                      <p className="fact-label">Total Units</p>
                      <p className="fact-value">
                        {societyData.totalUnits || 0} Units
                      </p>
                    </div>
                  </div>
                </div>
                <div className="fact-card">
                  <div className="fact-content">
                    <div className="fact-icon-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon"
                      >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <div>
                      <p className="fact-label">Total Towers</p>
                      <p className="fact-value">
                        {societyData.totalTowers || 0} Towers
                      </p>
                    </div>
                  </div>
                </div>
                <div className="fact-card">
                  {societyData.readyToMove && (
                    <div className="fact-content">
                      <div className="fact-icon-wrapper">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="icon"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div>
                        <p className="fact-label">Year Launched</p>
                        <p className="fact-value">
                          {societyData.launchedYear || 0}
                        </p>
                      </div>
                    </div>
                  )}
                  {!societyData.readyToMove && (
                    <div className="fact-content">
                      <div className="fact-icon-wrapper">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="icon"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div>
                        <p className="fact-label">Possession Date</p>
                        <p className="fact-value">
                          {societyData.possessionYear || 0}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {showEditModal && (
                <EditModal
                  data={societyData}
                  onClose={() => setShowEditModal(false)}
                  onSave={handleSave}
                />
              )}
            </div>
          ) : (
            <>
              {user && ["admin", "superAdmin"].includes(user.role) ? (
                <button
                  className="no-details"
                  onClick={() => setShowEditModal(true)}
                >
                  <FaPlus />{" "}
                  <span className="no-details-text">
                    Click Here to Upload Details
                  </span>
                </button>
              ) : (
                <div className="no-details">
                  <p>No details available</p>
                </div>
              )}
              {showEditModal && (
                <EditModal
                  data={societyData}
                  onClose={() => setShowEditModal(false)}
                  onSave={handleSave}
                />
              )}
            </>
            // <div >
            //   <p>No details available</p>
            // </div>
          )}

          {/* Right Column - Images */}
          <div className="images-column-wrapper">
            <div className="images-grid">
              <div className="image-group">
                <div className="image-container">
                  {Array.isArray(societyData.images) &&
                  societyData.images[0] ? (
                    <img
                      src={societyData.images[0]}
                      alt="Luxury Lobby"
                      className="image-style"
                    />
                  ) : (
                    <img
                      src="/assets/img/society/hero1.jpg"
                      alt="Luxury Lobby"
                      className="image-style"
                    />
                  )}
                </div>
                <div className="image-container image-container--video">
                  {Array.isArray(societyData.images) &&
                  societyData.images[1] ? (
                    <img
                      src={societyData.images[1]}
                      alt="Luxury Lobby"
                      className="image-style"
                    />
                  ) : (
                    <img
                      src="/assets/img/society/hero2.jpg"
                      alt="Luxury Lobby"
                      className="image-style"
                    />
                  )}
                </div>
              </div>
              <div className="image-group image-group--padded">
                <div className="image-container image-container--video">
                  {Array.isArray(societyData.images) &&
                  societyData.images[3] ? (
                    <img
                      src={societyData.images[3]}
                      alt="Swimming Pool"
                      className="image-style"
                    />
                  ) : (
                    <img
                      src="/assets/img/society/hero3.jpg"
                      alt="Swimming Pool"
                      className="image-style"
                    />
                  )}
                </div>
                <div className="image-container">
                  {Array.isArray(societyData.images) &&
                  societyData.images[4] ? (
                    <img
                      src={societyData.images[4]}
                      alt="Garden Area"
                      className="image-style"
                    />
                  ) : (
                    <img
                      src="/assets/img/society/hero4.jpg"
                      alt="Garden Area"
                      className="image-style"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Floating Rating Badge */}
            <div className="floating-rating">
              <div className="rating-card">
                <div className="rating-content">
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="star-icon"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg> */}
                  <span className="rating-value">
                    {societyData.societyType}
                  </span>
                  <span className="review-count">Society</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PropertiesSection = ({ societyName }) => {
  const [filter, setFilter] = useState("all");
  const [properties, setProperties] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const fetchProperties = async (purpose = null, limitCount = 10) => {
    try {
      setLoading(true);

      let q = query(
        collection(projectFirestore, "properties-propdial"),
        where("society", "==", societyName)
      );

      if (purpose && purpose !== "all") {
        const purposeValue = filter === "sale" ? "Sale" : "Rent";
        q = query(q, where("purpose", "==", purposeValue));
      }

      // Get total count first
      const totalSnap = await getDocs(q);
      setTotalCount(totalSnap.size);

      // Get limited properties
      const limitedQuery = query(q, limit(limitCount));
      const limitedSnap = await getDocs(limitedQuery);
      const data = limitedSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProperties(data);
      setLoadedCount(data.length);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const nextLimit = loadedCount + 10;

      let q = query(
        collection(projectFirestore, "properties-propdial"),
        where("society", "==", societyName)
      );

      if (filter !== "all") {
        const purpose = filter === "sale" ? "Sale" : "Rent";
        q = query(q, where("purpose", "==", purpose));
      }

      const limitedQuery = query(q, limit(nextLimit));
      const limitedSnap = await getDocs(limitedQuery);
      const data = limitedSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProperties(data);
      setLoadedCount(data.length);
    } catch (error) {
      console.error("Error loading more properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollRef.current.scrollLeft + scrollRef.current.clientWidth <
          scrollRef.current.scrollWidth
      );
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -380,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 380,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (societyName) {
      const purpose =
        filter === "all" ? null : filter === "sale" ? "Sale" : "Rent";
      fetchProperties(purpose);
    }
  }, [societyName, filter]);

  useEffect(() => {
    const handleScroll = () => checkScroll();
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      checkScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [properties]);

  // if(loading) return (
  //   <div className="loading-spinner">
  //         <FaSpinner className="spin" size={40} />
  //         <p>Loading properties...</p>
  //       </div>
  // );

  return (
    <>
      {properties.length > 0 ? (
        <section className="properties-section">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="section-title">Available Properties</h2>
              <p className="section-description">
                Discover your perfect home from our collection of premium
                apartments and villas
              </p>
            </div>
            <div className="filter-buttons">
              <button
                className={`filter-button ${
                  filter === "all" ? "filter-button--active" : ""
                }`}
                onClick={() => setFilter("all")}
              >
                All Properties
              </button>
              <button
                className={`filter-button ${
                  filter === "sale" ? "filter-button--active" : ""
                }`}
                onClick={() => setFilter("sale")}
              >
                Buy
              </button>
              <button
                className={`filter-button ${
                  filter === "rent" ? "filter-button--active" : ""
                }`}
                onClick={() => setFilter("rent")}
              >
                Rent
              </button>
            </div>
            <div className="properties-container">
              <div className="properties-scroll" ref={scrollRef}>
                {loading ? (
                  <div className="loading-spinner">
                    <FaSpinner className="spin" size={40} />
                    <p>Loading properties...</p>
                  </div>
                ) : properties.length > 0 ? (
                  properties.map((property) => (
                    <Link
                      to={`/propertydetails/${property.id}`}
                      key={property.id}
                      className="property-card-link"
                    >
                      <div className="property-card">
                        <span
                          className={`property-card__badge ${
                            property.purpose === "Sale"
                              ? "property-card__badge--sale"
                              : "property-card__badge--rent"
                          }`}
                        >
                          {property.purpose === "Sale"
                            ? "For Sale"
                            : "For Rent"}
                        </span>
                        <div className="property-card__image-wrapper">
                          <img
                            src={
                              property.images?.[0] ||
                              "/assets/img/society/hero3.jpg"
                            }
                            alt={property.propertyName || "Property"}
                            className="property-card__image"
                          />
                        </div>
                        <div className="property-card__header">
                          <div className="property-card__price-area-container">
                            <span className="property-card__price">
                              ₹{" "}
                              {property.purpose === "Sale"
                                ? property.demandPriceSale || "N/A"
                                : property.demandPriceRent || "N/A"}
                            </span>
                            <span className="property-card__area">
                              {property.carpetArea || "N/A"}{" "}
                              {property.carpetAreaUnit}
                            </span>
                          </div>
                        </div>
                        <div className="property-card__content">
                          <p className="property-card__floor">
                            {property.bhk} {property.propertyType}
                          </p>
                          <div className="property-card__features">
                            {property.category && (
                              <span className="property-card__feature-badge">
                                {property.category}
                              </span>
                            )}
                            {property.furnishing && (
                              <span className="property-card__feature-badge">
                                {property.furnishing}
                              </span>
                            )}
                            {property.package && (
                              <span className="property-card__feature-badge">
                                {property.package}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="property-card__footer">
                          <Link
                            to={`/propertydetails/${property.id}`}
                            className="property-card__action-button"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  !loading && (
                    <p className="no-properties">No properties found.</p>
                  )
                )}

                {/* Load More Button at the end of the scroll container */}
                {loading
                  ? null
                  : loadedCount < totalCount && (
                      <div className="load-more-container">
                        <button
                          className="load-more-button"
                          onClick={loadMore}
                          disabled={loading}
                        >
                          {/* {loading ? "Loading..." : "Load More"} */}
                          Load More
                        </button>
                      </div>
                    )}
              </div>
              <div className="scroll-buttons-container">
                <button
                  className="scroll-button scroll-button--left"
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="scroll-button scroll-button--right"
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

const StickyTabBar = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 350); // Change threshold if needed
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    "Overview",
    "Available Properties",
    "Amenities",
    "About Society",
    "Nearby Locations",
    "Units-Floor Plans",
    "Things to Know",
    "Photo Gallery",
    "Society Videos",
    "About Developer",
  ];

  return (
    <div className={`${styles.tabContainer} ${isSticky ? styles.sticky : ""}`}>
      {sections.map((section, idx) => (
        <a
          href={`#${section.replace(/\s+/g, "-")}`} // remove extra backslashes
          key={idx}
          className={styles.tabLink}
        >
          {section}
        </a>
      ))}
      {/* <span className={styles.arrow}>&gt;</span> */}
    </div>
  );
};

const allAmenitiesByCategory = {
  Club: [
    {
      name: "Club House",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_club%20house_.jpg?alt=media&token=1b1980a3-ade2-4cdd-b99e-7bfe18b50526",
    },
    {
      name: "Steam Bath Room",
      icon: "FaShower",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_steam%20bathroom_.jpg?alt=media&token=5272eaa9-4e88-403e-af46-184d975892d8",
    },
    {
      name: "Toddler Pool",
      icon: "FaSwimmingPool",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2Ftoddler%20pool.jpg?alt=media&token=64500230-007b-42dd-bd88-c1bf6406e88b",
    },
    {
      name: "Sauna Room",
      icon: "FaShower",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_sauna%20room_.jpg?alt=media&token=71a02f91-c3ab-48d0-b503-890d0ae03688",
    },
    {
      name: "Swimming Pool (Indoor)",
      icon: "FaSwimmingPool",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_swimming%20pool%20indoor_.jpg?alt=media&token=897710a3-1ec3-4f20-828d-7d11bd8a4d3b",
    },
    {
      name: "Swimming Pool (Outdoor)",
      icon: "FaSwimmingPool",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F__Swimming__pooL%20outdoor.jpg?alt=media&token=48b5fcbb-ad0d-4359-abf3-769c78d092f0",
    },
    {
      name: "Card Room",
      icon: "FaGamepad",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_card_room.jpg?alt=media&token=5b993d9d-4b4b-4563-b1e4-99890f78db15",
    },
    {
      name: "Party Room Small",
      icon: "MdMeetingRoom",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_party%20room%20small_.jpg?alt=media&token=aa257fad-9ba5-4e16-9648-7f9ddcc85b11",
    },
    {
      name: "Party Room Big",
      icon: "MdMeetingRoom",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_party_room_big.jpg?alt=media&token=27a02f5f-bffa-4166-8f24-1bab0fd72a9c",
    },
    {
      name: "Sun Deck",
      icon: "FaTree",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F__sun_deck.jpg?alt=media&token=33c347ce-278d-4745-bb94-5bb3284a0295",
    },
    {
      name: "Library",
      icon: "BsFileEarmarkText",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_library_.jpg?alt=media&token=65880d83-4796-4f81-a767-4bffc690c2cc",
    },
    {
      name: "Roof Deck Lounge",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_roof%20deck%20lounge_.jpg?alt=media&token=914b20fa-ca18-484b-9959-b5155da06664",
    },
    {
      name: "Pool Deck Area",
      icon: "FaSwimmingPool",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_pool%20deck%20area_.jpg?alt=media&token=2dff684b-ac0e-409d-96b2-6383a5862ad9",
    },
    {
      name: "Spa Massage Room",
      icon: "FaShower",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_spa%20message%20room_.jpg?alt=media&token=5a4afe25-2491-431b-81b4-e71f978a1b15",
    },
    {
      name: "Kids Pool",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_kids_pool.jpg?alt=media&token=282b8a5a-5201-4964-808c-a936765e5044",
    },
    {
      name: "Heated Lap Pool",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_heated%20lap%20pool_.jpg?alt=media&token=8024eccc-b6e5-4012-a5d3-cc5d3f6ed9ee",
    },
    // { name: "BBQ Area", icon: "FaRegBuilding" },
    // { name: "Multi Utility Store", icon: "FaRegBuilding" },
    // { name: "Bar", icon: "FaRegBuilding" },
    // { name: "Jacuzzi Spa", icon: "FaSwimmingPool" },
  ],
  "Sports & Fitness": [
    {
      name: "Cycle Track",
      icon: "FaWalking",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FCycle-Track.jpg?alt=media&token=f37783fa-23cd-42fb-b45d-0e7215930f99",
    },
    {
      name: "Dance Room",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FDance-Room.jpg?alt=media&token=06f6763b-eadd-457a-8bea-dd664a7f1ee4",
    },
    {
      name: "Garden Gym",
      icon: "FaDumbbell",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FGarden-Gymasium.jpg?alt=media&token=28c5ed0e-22e4-45f9-b57c-f4f500c6e4da",
    },
    {
      name: "Gymnesium",
      icon: "FaDumbbell",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FGymnesium.jpg?alt=media&token=e2c19c53-5be4-4065-89bd-daca84e93f98",
    },
    {
      name: "Health Club",
      icon: "FaPrayingHands",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FHealth-Club.jpg?alt=media&token=e1647b43-ccd2-41d6-aa77-296111385ef3",
    },
    {
      name: "Jogging Track",
      icon: "FaWalking",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FJogging-Track.jpg?alt=media&token=e5703af6-dce3-48c7-86e9-84a2c0f180c7",
    },
    {
      name: "Meditation",
      icon: "FaPrayingHands",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FMeditation.jpg?alt=media&token=ab26f0ab-05da-47b0-a88d-b1fc3dc1b985",
    },
    {
      name: "Yoga Deck",
      icon: "FaPrayingHands",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FYoga-Deck.jpg?alt=media&token=feca9864-50bb-46d2-9d1a-00b25e4b9937",
    },
    {
      name: "Yoga Room",
      icon: "FaPrayingHands",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FYoga-Room.jpg?alt=media&token=58c4c00c-1c1e-4a11-b0aa-049c2f4e8c0c",
    },
    {
      name: "Basket Ball",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Basket%20ball_.jpg?alt=media&token=b7fa719f-29d1-4353-9d02-c8872bac0ad8",
    },
    {
      name: "Billiards",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Billiards_.jpg?alt=media&token=382a7221-6260-4778-a757-cbd1479125f4",
    },
    {
      name: "Squash Court",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Squash%20court_.jpg?alt=media&token=4542a683-2569-48e3-8422-f4d9d43600be",
    },
    {
      name: "Cricket Pitch",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Cricket%20pitch_.jpg?alt=media&token=baeabef1-b809-4f4a-b663-892d3987fb6a",
    },
    {
      name: "Hourseback Riding",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_horseback%20riding_.jpg?alt=media&token=5eb87375-e090-4e10-bdf5-741a3e0cef31",
    },
    {
      name: "Volleyball Court",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_volleyball%20court_.jpg?alt=media&token=75c4964c-32f0-4211-92b5-1f6c53c5657f",
    },
    {
      name: "Badminton (Indoor)",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_badminton%20court%20indoor_.jpg?alt=media&token=ab98331f-bc9d-4076-a7f8-aba59be2d089",
    },
    {
      name: "Badminton (Outdoor)",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_badminton%20outdoor_.jpg?alt=media&token=0569318e-d8d1-483c-aa20-3858834bbc74",
    },
    {
      name: "Football Ground",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_football%20ground_.jpg?alt=media&token=21bcfd20-d98b-42b5-bd95-30ecc12cf103",
    },
    {
      name: "Golf Course",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Golf_course.jpg?alt=media&token=848ca032-1c01-496f-ab14-754789cb250a",
    },
    {
      name: "Skating Track",
      icon: "FaGamepad",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_skating%20rink_.jpg?alt=media&token=7ddd3802-36e9-4e59-9b83-9460599f24bb",
    },
    {
      name: "Tennis Court",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Tennis%20court_.jpg?alt=media&token=96d28ec9-5ea5-41c5-a164-b2c6f9a53e89",
    },
    {
      name: "Table Tennis",
      icon: "FaGamepad",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Table%20tennis_.jpg?alt=media&token=b6889230-e307-479d-9619-1a009b158089",
    },
    {
      name: "Bowling Alley",
      icon: "FaGamepad",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Bowling%20alley_.jpg?alt=media&token=515726d7-444e-4173-842f-2aeb3e91c379",
    },
    {
      name: "Pool Table",
      icon: "FaGamepad",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_pool%20table_.jpg?alt=media&token=a36b6b5e-8776-4d35-b5e8-9c4474e67bcf",
    },
    // { name: "Skating Ring", icon: "FaGamepad", link: "" },
    // { name: "Horsebacking Ride", icon: "FaRegBuilding", link: "" },
    // { name: "Gymnasium", icon: "FaDumbbell", link: "" },
    // { name: "Cricket Ground", icon: "FaRegBuilding", link: "" },
    // { name: "Health Club", icon: "FaDumbbell", link: "" },
  ],
  "For Children": [
    {
      name: "Creche&daycare",
      icon: "FaGamepad",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren10_Creche%26daycare.jpg?alt=media&token=cd00649a-7ea6-4f63-a516-997def8b1345",
    },
    {
      name: "Kids Pool",
      icon: "FaSwimmingPool",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren1_kidsPool.jpg?alt=media&token=51c65118-b671-462e-9a46-e92052866f6e",
    },
    {
      name: "Toodler Pool",
      icon: "FaSwimmingPool",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren4_ToodlerPool.jpg?alt=media&token=24fc23a9-bb69-411d-aee1-9181baa39f09",
    },
    {
      name: "Heated Lap Pool",
      icon: "FaSwimmingPool",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren5_HeatedLapPool.jpg?alt=media&token=e46257de-16b4-4080-b35d-55ef185448a1",
    },
    {
      name: "Children Play Area (Indoor)",
      icon: "FaGamepad",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren2_ChildrenPlayArea(Indoor).jpg?alt=media&token=60e3fd23-edad-4c82-b382-4aa09b2a2533",
    },
    {
      name: "Children Play Area (Outdoor)",
      icon: "FaGamepad",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren3_ChildrenPlayArea(Outdoor).jpg?alt=media&token=77692755-1120-4228-ad27-0cc90a5ec131",
    },
    {
      name: "Miniature Golf",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren9_MiniatureGolf.jpg?alt=media&token=b313d3fd-ef77-41cd-bf0b-a5e73ab22987",
    },
    {
      name: "Play School",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren6_PlaySchool.jpg?alt=media&token=14ee1e35-8396-4d9a-bfd3-dbbd621e3999",
    },
    {
      name: "Pre-Primary School",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren7_PrePrimarySchool.jpg?alt=media&token=c6f059dc-949a-4b1d-94db-9a3d4dfccaab",
    },
    {
      name: "Primary School",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren8_PrimarySchool.jpg?alt=media&token=d96c069d-1222-4d57-8ea8-240ee461adc2",
    },
    // { name: "Dance Room", icon: "FaRegBuilding", link: "" },
    // { name: "Yoga Deck", icon: "FaPrayingHands", link: "" },
    // { name: "Horseback Riding", icon: "FaRegBuilding", link: "" },
    // { name: "Creche and daycare", icon: "FaRegBuilding", link: "" },
  ],
  "Safety & Security": [
    {
      name: "cctv-in Common Area",
      icon: "FaVideo",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity6_CCTVincommonarea.jpg?alt=media&token=d0359d0f-9bf1-4bc7-a198-0e5afc29cbbc",
    },
    {
      name: "Fire Fighting System",
      icon: "FaUserShield",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity4_FireFightingSystems.jpg?alt=media&token=85a49c24-b5db-478d-9837-53f992280f21",
    },
    {
      name: "Intercom",
      icon: "FaUserShield",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity5_Intercom.jpg?alt=media&token=ed590729-74ae-4884-87e2-eab89ea45356",
    },
    {
      name: "PNG (Pipeline gas)",
      icon: "FaUserShield",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity7_PipedNaturalGas(PNG).jpg?alt=media&token=6c6712a8-5e23-4e00-9f15-6c097caa1c48",
    },
    {
      name: "Security (3 tier)",
      icon: "FaUserShield",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity1_Security3-Tier.jpg?alt=media&token=b7ad650b-8b79-427f-b4ad-82dd27fc93c2",
    },
    {
      name: "Security (Roaming)",
      icon: "FaUserShield",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity3_RoamingGuardSecurity.jpg?alt=media&token=86beb0ea-9882-4ae6-9177-61b027715b97",
    },
    {
      name: "Security (Single Guard)",
      icon: "FaUserShield",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity2_.SingleGuardSecurity.jpg?alt=media&token=f43ee078-9ae6-4aa3-8ea0-f956920ac4a2",
    },
  ],
  "General Amenities": [
    // { name: "Central Garden Atrium", icon: "FaTree", link: "" },
    // { name: "Outdoor Party Area", icon: "FaRegBuilding", link: "" },
    // { name: "Cafeteria", icon: "FaRegBuilding", link: "" },
    // { name: "Laundry Service", icon: "FaRegBuilding", link: "" },
    // { name: "Convenience Store", icon: "FaRegBuilding", link: "" },
    // { name: "Saloon", icon: "FaRegBuilding", link: "" },
    // { name: "Concierge", icon: "FaRegBuilding", link: "" },
    // { name: "Lounge Area", icon: "FaRegBuilding", link: "" },
    // { name: "Fountain", icon: "FaRegBuilding", link: "" },
    // { name: "Sky Garden", icon: "FaTree", link: "" },
    // { name: "Conference Room", icon: "MdMeetingRoom", link: "" },
    // { name: "Meeting Room", icon: "MdMeetingRoom", link: "" },
    // { name: "Medical Store", icon: "FaRegBuilding", link: "" },
    // { name: "Sky Lounge", icon: "FaRegBuilding", link: "" },
    // { name: "Extended Sky Patios", icon: "FaRegBuilding", link: "" },
    // { name: "Mini Theater", icon: "FaRegBuilding", link: "" },
    // { name: "Vegetable Shop", icon: "FaRegBuilding", link: "" },
    // { name: "Gazebos", icon: "FaRegBuilding", link: "" },
    // { name: "Restaurant", icon: "FaRegBuilding", link: "" },
    {
      name: "24 Hour Water Supply",
      icon: "FaShower",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FwaterSupply.jpg?alt=media&token=67ad62ff-e007-46f5-8a9e-2972060711b9",
    },
    {
      name: "Car Parking (Basement)",
      icon: "FaParking",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FBasementCarParking.jpg?alt=media&token=e0b8e202-7dbe-4ca2-873c-3386250a55e0",
    },
    {
      name: "Car Parking (Under Shade)",
      icon: "FaParking",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FStiltCarParking.jpg?alt=media&token=25db3184-9ab1-4f96-99a1-0cc5c8c9b8ea",
    },
    {
      name: "Car Parking (For Visitors)",
      icon: "FaParking",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FStiltCarParking.jpg?alt=media&token=25db3184-9ab1-4f96-99a1-0cc5c8c9b8ea",
    },
    {
      name: "Car Parking (Open)",
      icon: "FaParking",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FOpenCarParking.jpg?alt=media&token=3323683b-7bc2-469b-8c0e-7295199e667b",
    },
    {
      name: "Designated Pet Area",
      icon: "FaTree",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FDesignatedPetArea.jpg?alt=media&token=85e67d62-0e89-41cb-a378-6ebcc6cd4f9b",
    },
    // { name: "Gardens", icon: "FaTree", link: "" },
    {
      name: "Rainwater Harvesting",
      icon: "FaRegBuilding",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FRainWaterHarvesting.jpg?alt=media&token=f526e87c-0042-49a8-8873-831d2ad4f6e8",
    },
    {
      name: "Lifts",
      icon: "MdElevator",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FLift.jpg?alt=media&token=a7b6d8d1-8986-4b05-9a1c-a51614a45d0e",
    },
    {
      name: "High Speed Lifts",
      icon: "MdElevator",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FHighSpeedLifts.jpg?alt=media&token=3e115c3f-34a0-4aaa-b901-6d90acd421b1",
    },
    {
      name: "High Speed Elevator",
      icon: "MdElevator",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FHighSpeedElevators.jpg?alt=media&token=3335c0bb-0bd4-4904-8c30-8720f1450780",
    },
    {
      name: "Landscaped Gardens",
      icon: "FaTree",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FLandscapeGardens.jpg?alt=media&token=c9d525cf-51d1-43ac-8a39-b01bf4ea9147",
    },
    {
      name: "Power Back (Full)",
      icon: "FaBolt",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2F100PowerBackUp.jpg?alt=media&token=a3cb33e4-26a8-4abe-a2df-e13e17fc539c",
    },
    {
      name: "Power Backup (Partial)",
      icon: "FaBolt",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2F80PowerBackUp.jpg?alt=media&token=4c0b715c-adc7-4d2d-a81d-069737e93d88",
    },
    {
      name: "Power Back (Lift Only)",
      icon: "FaBolt",
      link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FPowerBackUpLift.jpg?alt=media&token=094f9683-10cd-4df3-b3f3-1cf85b60919b",
    },
  ],
};

const iconComponents = {
  FaRegBuilding: <FaRegBuilding />,
  FaVideo: <FaVideo />,
  FaWalking: <FaWalking />,
  FaBolt: <FaBolt />,
  FaSwimmingPool: <FaSwimmingPool />,
  FaUserShield: <FaUserShield />,
  FaTree: <FaTree />,
  FaParking: <FaParking />,
  FaDumbbell: <FaDumbbell />,
  FaGamepad: <FaGamepad />,
  FaShower: <FaShower />,
  FaPrayingHands: <FaPrayingHands />,
  FaBed: <FaBed />,
  MdElevator: <MdElevator />,
  MdMeetingRoom: <MdMeetingRoom />,
  BsFileEarmarkText: <BsFileEarmarkText />,
  FaPlus: <FaPlus />,
  FaSearch: <FaSearch />,
};

const AmenitiesSection = ({ societyId }) => {
  const { user } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState({});
  const [tempSelected, setTempSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Club");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch amenities from Firebase
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const doc = await projectFirestore
          .collection("m_societies")
          .doc(societyId)
          .collection("society_information")
          .doc("Amenities")
          .get();

        if (doc.exists) {
          setSelectedAmenities(doc.data() || {});
          // Initialize tempSelected with all selected amenities from all categories
          const allSelected = Object.values(doc.data() || {}).flat();
          setTempSelected(allSelected.map((a) => a.name));
        } else {
          // Initialize with empty categories
          const initialAmenities = {};
          Object.keys(allAmenitiesByCategory).forEach((category) => {
            initialAmenities[category] = [];
          });
          setSelectedAmenities(initialAmenities);
          setTempSelected([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, [societyId]);

  // Save amenities to Firebase
  const saveAmenitiesToFirebase = async (amenities) => {
    try {
      if (!societyId) throw new Error("Society ID is missing");

      // Structure the data by category
      const amenitiesByCategory = {};
      Object.keys(allAmenitiesByCategory).forEach((category) => {
        amenitiesByCategory[category] = allAmenitiesByCategory[category]
          .filter((amenity) => amenities.includes(amenity.name))
          .map((amenity) => ({
            ...amenity,
            highlight:
              selectedAmenities[category]?.some(
                (a) => a.name === amenity.name && a.highlight
              ) || false,
          }));
      });

      await projectFirestore
        .collection("m_societies")
        .doc(societyId)
        .collection("society_information")
        .doc("Amenities")
        .set(amenitiesByCategory, { merge: true });

      console.log("Amenities saved successfully");
      return true;
    } catch (err) {
      console.error("Firebase save error:", err);
      alert("Failed to save amenities. Please try again.");
      return false;
    }
  };

  const handleAddAmenities = () => {
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
  };

  const handleCheckboxChange = (amenityName) => {
    setTempSelected((prev) =>
      prev.includes(amenityName)
        ? prev.filter((name) => name !== amenityName)
        : [...prev, amenityName]
    );
  };

  const handleSaveAmenities = async () => {
    await saveAmenitiesToFirebase(tempSelected);

    // Update local state with the new selections
    const updatedAmenities = {};
    Object.keys(allAmenitiesByCategory).forEach((category) => {
      updatedAmenities[category] = allAmenitiesByCategory[category]
        .filter((amenity) => tempSelected.includes(amenity.name))
        .map((amenity) => ({
          ...amenity,
          highlight:
            selectedAmenities[category]?.some(
              (a) => a.name === amenity.name && a.highlight
            ) || false,
        }));
    });

    setSelectedAmenities(updatedAmenities);
    setShowModal(false);
    setIsEditing(false);
  };

  const toggleHighlight = async (amenityName, category) => {
    const updatedAmenities = { ...selectedAmenities };
    updatedAmenities[category] = updatedAmenities[category].map((amenity) =>
      amenity.name === amenityName
        ? { ...amenity, highlight: !amenity.highlight }
        : amenity
    );

    setSelectedAmenities(updatedAmenities);

    // Save to Firebase
    await projectFirestore
      .collection("m_societies")
      .doc(societyId)
      .collection("society_information")
      .doc("Amenities")
      .set(updatedAmenities, { merge: true });
  };

  const filteredAmenities = allAmenitiesByCategory[activeCategory].filter(
    (amenity) => amenity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="loading-spinner">
        <FaSpinner className="spin" size={40} />
        <p>Loading Amenities...</p>
      </div>
    );

  return (
    <div className="amenities-section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">World-Class Amenities</h2>
          {/* <p className="section-description">
         
            Note: All amenity photos are for representation only, not actual
            images.
          </p> */}
          <p className="note">
            Note: All amenity photos are for representation only, not actual
            images.
          </p>
        </div>

        {/* Navigation Bar for Categories */}
        <div className="category-tabs">
          {Object.keys(allAmenitiesByCategory).map((category) => (
            <button
              key={category}
              className={`category-button ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={`amenities-grid ${selectedAmenities[activeCategory]?.length > 0 ? "yes" : "no"}`}>
          {user && ["admin", "superAdmin"].includes(user.role) ? (
            <div className="add-amenity-card" onClick={handleAddAmenities}>
              <div className="plus-icon">
                <FaPlus />
              </div>
              <div className="label">Add Amenities</div>
            </div>
          ) : null}
          {selectedAmenities[activeCategory] &&
          selectedAmenities[activeCategory].length > 0 ? (
            selectedAmenities[activeCategory]?.map((item, index) => (
              <div
                className="amenity-card"
                // onClick={() => toggleHighlight(item.name, activeCategory)}
              >
                <div className="amenity-card__image-wrapper">
                  <img
                    src={item.link || "/placeholder.svg"}
                    alt={item.name}
                    className="amenity-card__image"
                  />
                  <h3 className="title">{item.name}</h3>
                </div>
                <div className="amenity-card__content">
                  <h3 className="amenity-card__title">{item.name}</h3>
                  {/* <p className="amenity-card__description">
                  {item.name}
                </p> */}
                </div>
              </div>
            ))
          ) : user && ["admin", "superAdmin"].includes(user.role) ? null : (
            <div className="no-amenities">
              {" "}
              <p>No data amenities available</p>{" "}
            </div>
          )}
        </div>

        {/* <div className="amenities-footer">
        <p className="show-more">
          Showing {selectedAmenities[activeCategory]?.length || 0} of{" "}
          {allAmenitiesByCategory[activeCategory].length} amenities in{" "}
          {activeCategory}
        </p>
        <button className="contact-btn">Contact Builder</button>
      </div> */}

        {showModal && (
          <div className="amenities-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Select Amenities: For {activeCategory}</h2>
                <button className="close-btn" onClick={handleCloseModal}>
                  &times;
                </button>
              </div>

              {!isEditing && (
                <div className="amenities-categories">
                  {Object.keys(allAmenitiesByCategory).map((category) => (
                    <button
                      key={category}
                      className={`category-btn ${
                        activeCategory === category ? "active" : ""
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}

              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search amenities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="amenities-list">
                {filteredAmenities.map((amenity) => (
                  <div className="amenity-item" key={amenity.name}>
                    <input
                      type="checkbox"
                      id={`amenity-${amenity.name}`}
                      checked={tempSelected.includes(amenity.name)}
                      onChange={() => handleCheckboxChange(amenity.name)}
                    />
                    <label htmlFor={`amenity-${amenity.name}`}>
                      <span className="amenity-icon">
                        {iconComponents[amenity.icon] || <FaRegBuilding />}
                      </span>
                      {amenity.name}
                    </label>
                  </div>
                ))}
                {filteredAmenities.length === 0 && (
                  <div className="no-results">No amenities found</div>
                )}
              </div>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSaveAmenities}>
                  Save Amenities
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AboutSocietySection = ({ societyId }) => {
  const { user } = useAuthContext();
  const [societyData, setSocietyData] = useState({
    possessionDate: "",
    readyToMove: false,
    visitorParking: false,
    club: false,
    swimmingPool: false,
    gym: false,
    description: "",
    launchDate: "",
    totalUnits: "",
    totalTowers: "",
    projectSize: "",
    powerBackup: "No Backup",
    unitTypes: [],
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch society data from Firestore (No changes needed here)
  useEffect(() => {
    const fetchData = async () => {
      if (!societyId) {
        setLoading(false);
        return;
      }
      try {
        const docRef = projectFirestore
          .collection("m_societies")
          .doc(societyId);
        const doc = await docRef.get();

        if (doc.exists) {
          const data = doc.data();
          setSocietyData((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [societyId]);

  // FIX 1: Correctly handle the save action
  const handleSave = async (updatedData) => {
    try {
      const docRef = projectFirestore.collection("m_societies").doc(societyId);

      // FIX 1.1: Use the correct keys from formData ('name', 'type')
      // The `updatedData` object already has the correct structure.
      const updateObject = {
        ...updatedData, // Spread the form data
        lastUpdated: new Date(),
      };

      await docRef.set(updateObject, { merge: true });

      // FIX 1.2: Update state correctly with the data from the form
      setSocietyData((prev) => ({ ...prev, ...updatedData }));
      setShowEditModal(false);
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save changes.");
    }
  };

  const maxLength = 200;
  const isLong =
    societyData.description && societyData.description.length > maxLength;
  const shortText = isLong
    ? societyData.description.slice(0, maxLength) + "..."
    : societyData.description;

  if (loading)
    return (
      <div className="loading-spinner">
        <FaSpinner className="spin" size={40} />
        <p>Loading Society info...</p>
      </div>
    );
  if (error) return <div className="error-message">{error}</div>;
  return (
    <section className="about-society-section">
      <div className="container">
        {!societyData.description == "" ? (
          <>
            <div className="about-container">
              <h2 className="about-title">Discover {societyData.society}</h2>

              <p className="about-description">
                {societyData.description === "" ? (
                  <span className="no-description">
                    No description available.
                  </span>
                ) : (
                  <>
                    {shortText}
                    {isLong && (
                      <button
                        className="read-more-btn"
                        onClick={() => setShowPopup(true)}
                      >
                        Read More
                      </button>
                    )}
                  </>
                )}
              </p>

              {/* Popup Modal */}
              {showPopup && (
                <div className="popup-overlay-about">
                  <div className="popup-content-about">
                    <h2>Full Description</h2>
                    <p>{societyData.description}</p>
                    <button
                      className="close-btn-about"
                      onClick={() => setShowPopup(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {user && ["admin", "superAdmin"].includes(user.role) ? (
                <button
                  className="edit-btn"
                  onClick={() => setShowEditModal(true)}
                >
                  <FaEdit />
                </button>
              ) : null}
            </div>
            <div className="about-society-content">
              <div className="about-card">
                <div className="about-card__content">
                  <div className="about-card__grid">
                    <div className="about-card__column">
                      <div className="about-card__fact">
                        <span className="about-card__fact-title">
                          Project Size:
                        </span>
                        <span className="about-card__fact-value">
                          {societyData.projectSize && societyData.projectAge
                            ? `${societyData.projectSize} Acres (${societyData.projectAge} Years)`
                            : societyData.projectSize
                            ? `${societyData.projectSize} Acres`
                            : "!"}
                        </span>
                      </div>

                      {societyData.readyToMove ? (
                        <div className="about-card__fact">
                          <span className="about-card__fact-title">
                            Built In:
                          </span>
                          <span className="about-card__fact-value">
                            {societyData.launchedYear
                              ? societyData.launchedYear
                              : "!"}
                          </span>
                        </div>
                      ) : (
                        <div className="about-card__fact">
                          <span className="about-card__fact-title">
                            Year of Handover:
                          </span>
                          <span className="about-card__fact-value">
                            {societyData.possessionYear
                              ? societyData.possessionYear
                              : "!"}
                          </span>
                        </div>
                      )}

                      <div className="about-card__fact">
                        <span className="about-card__fact-title">
                          Total Units:
                        </span>
                        <span className="about-card__fact-value">
                          {societyData.totalUnits
                            ? `${societyData.totalUnits} Units`
                            : "!"}
                        </span>
                      </div>

                      <div className="about-card__fact">
                        <span className="about-card__fact-title">
                          Power Backup:
                        </span>
                        <span className="about-card__fact-value">
                          {societyData.powerBackup
                            ? societyData.powerBackup
                            : "!"}
                        </span>
                      </div>

                      <div className="about-card__fact">
                        <span className="about-card__fact-title">Gym:</span>
                        <span className="about-card__fact-value">
                          {societyData.powerBackup ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="about-card__column">
                      <div className="about-card__fact">
                        <span className="about-card__fact-title">
                          Total Towers:
                        </span>
                        <span className="about-card__fact-value">
                          {societyData.totalTowers
                            ? `${societyData.totalTowers} Towers`
                            : "!"}
                        </span>
                      </div>

                      <div className="about-card__fact">
                        <span className="about-card__fact-title">
                          Unit Types:
                        </span>
                        <span className="about-card__fact-value">
                          {societyData.unitTypes &&
                          societyData.unitTypes.length > 0
                            ? societyData.unitTypes.join(", ")
                            : "!"}
                        </span>
                      </div>

                      <div className="about-card__fact">
                        <span className="about-card__fact-title">
                          Visitor Parking:
                        </span>
                        <span className="about-card__fact-value">
                          {societyData.visitorParking ? "Yes" : "No"}
                        </span>
                      </div>

                      <div className="about-card__fact">
                        <span className="about-card__fact-title">Club:</span>
                        <span className="about-card__fact-value">
                          {societyData.club ? "Yes" : "No"}
                        </span>
                      </div>

                      <div className="about-card__fact">
                        <span className="about-card__fact-title">
                          Swimming Pool:
                        </span>
                        <span className="about-card__fact-value">
                          {societyData.swimmingPool ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="about-container">
              <h2 className="about-title">About {societyData.society}</h2>
            </div>

            {user && ["admin", "superAdmin"].includes(user.role) ? (
              <button
                className="no-details"
                onClick={() => setShowEditModal(true)}
              >
                <FaPlus />{" "}
                <span className="no-details-text">
                  Click Here to Upload Details
                </span>
              </button>
            ) : (
              <div className="no-details">
                <p>No details available</p>
              </div>
            )}
          </>
        )}
      </div>
      {showEditModal && (
        <EditAbout
          data={societyData}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}
    </section>
  );
};

const SocietyRatesSection = ({ societyId }) => {
  const { user } = useAuthContext();
  const [societyData, setSocietyData] = useState({
    electricityRateAuthority: "",
    electricityRatePowerBackup: "",
    commonAreaMaintenance: "",
    clubCharges: "",
  });
  // commonAreaElectricity: "",
  // waterCharges: "",

  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from society_information collection
  useEffect(() => {
    const fetchData = async () => {
      if (!societyId) {
        setLoading(false);
        return;
      }
      try {
        const docRef = projectFirestore
          .collection("m_societies")
          .doc(societyId)
          .collection("society_information") // lowercase as per your screenshot
          .doc("Rates");

        const docSnap = await docRef.get();
        if (docSnap.exists) {
          setSocietyData(docSnap.data());
        } else {
          console.log("No rates found in society_information.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [societyId]);

  // Save only in society_information collection
  const handleSave = async (updatedData) => {
    try {
      const infoDocRef = projectFirestore
        .collection("m_societies")
        .doc(societyId)
        .collection("society_information")
        .doc("Rates");

      await infoDocRef.set(
        {
          ...updatedData,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      setSocietyData((prev) => ({ ...prev, ...updatedData }));
      setShowEditModal(false);
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save changes.");
    }
  };

  // Format currency in Indian numbering system
  const formatRupees = (value) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (loading)
    return (
      <div className="loading-spinner">
        <FaSpinner className="spin" size={40} />
        <p>Loading Society Rates...</p>
      </div>
    );
  if (error) return <div className="error-message">{error}</div>;

  return (
    <section className="society-rates-section">
      <div className="container">
        <div className="section-header">
          <h2>Society Rates & Charges</h2>
          <p>
            Transparent pricing structure for all society-related services and
            amenities
          </p>
          {user &&
          ["admin", "superAdmin"].includes(user.role) &&
          (societyData.electricityRateAuthority ||
            societyData.electricityRatePowerBackup ||
            societyData.commonAreaMaintenance ||
            societyData.clubCharges) ? (
            <button className="edit-btn" onClick={() => setShowEditModal(true)}>
              <FaEdit />
            </button>
          ) : null}
        </div>

        {societyData.electricityRateAuthority ||
        societyData.electricityRatePowerBackup ||
        societyData.commonAreaMaintenance ||
        societyData.clubCharges ? (
          <>
            <div className="rates-grid">
              <div className="rate-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <FaBolt className="icon" />
                    Electricity Rate
                  </h3>
                </div>
                <div className="card-content">
                  <div className="rate-details">
                    <p className="rate-value">
                      {societyData.electricityRateAuthority
                        ? `₹${societyData.electricityRateAuthority} per unit`
                        : "N/A per unit"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rate-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <FaBatteryFull className="icon" />
                    Power Backup
                  </h3>
                </div>
                <div className="card-content">
                  <div className="rate-details">
                    <p className="rate-value">
                      {societyData.electricityRatePowerBackup
                        ? `₹${societyData.electricityRatePowerBackup} per unit`
                        : "N/A per unit"}
                    </p>
                  </div>
                </div>
              </div>
              {/* <div className="rate-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <FaTint className="icon" />
                    Water Charges
                  </h3>
                </div>
                <div className="card-content">
                  <div className="rate-details">
                    <p className="rate-value">
                      ₹{societyData.waterCharges} per 1000L
                    </p>
                  </div>
                </div>
              </div> */}
              <div className="rate-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <FaRegBuilding className="icon" />
                    Maintenance
                  </h3>
                </div>
                <div className="card-content">
                  <div className="rate-details">
                    <p className="rate-value">
                      {societyData.commonAreaMaintenance
                        ? `₹${societyData.commonAreaMaintenance} per sq/ft`
                        : "N/A per sq/ft"}
                    </p>
                  </div>
                </div>
              </div>
              {/* <div className="rate-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <FaRegBuilding className="icon" />
                    Common Area Electricity
                  </h3>
                </div>
                <div className="card-content">
                  <div className="rate-details">
                    <p className="rate-value">
                      ₹{societyData.commonAreaElectricity} per month
                    </p>
                  </div>
                </div>
              </div> */}
              <div className="rate-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <FaRegBuilding className="icon" />
                    Club Charges
                  </h3>
                </div>
                <div className="card-content">
                  <div className="rate-details">
                    <p className="rate-value">
                      {societyData.clubCharges
                        ? `₹${societyData.clubCharges} per month`
                        : "N/A per month"}
                    </p>
                    {/* <p className="rate-description">Access to all club amenities</p> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-info">
              <div className="info-card">
                <div className="card-content">
                  <h3 className="info-title">
                    Charges Information (Last Updated on{" "}
                    {societyData.updatedAt
                      ? new Date(
                          societyData.updatedAt.seconds * 1000
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                    )
                  </h3>
                  {/* <p className="info-text">
                    All charges are subject to applicable taxes. Monthly charges
                    are billed in advance. Online payment options are available
                    through our resident portal.
                  </p> */}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {user && ["admin", "superAdmin"].includes(user.role) ? (
              <button
                className="no-details"
                onClick={() => setShowEditModal(true)}
              >
                <FaPlus />{" "}
                <span className="no-details-text">
                  Click Here to Upload Details
                </span>
              </button>
            ) : (
              <div className="no-details">
                <p>No details available</p>
              </div>
            )}
          </>
        )}
      </div>

      {showEditModal && (
        <EditRates
          data={societyData}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}
    </section>
  );
};

const GalleryPreview = ({ societyId, societyName, societyType }) => {
  const { user } = useAuthContext();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageIndexes, setSelectedImageIndexes] = useState([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "", // 'success', 'error', 'confirm'
    onConfirm: null,
  });

  // Firestore document reference
  const isFirebaseAvailable = projectFirestore && projectStorage;
  const societyDocRef = projectFirestore
    ? doc(
        projectFirestore,
        "m_societies",
        societyId,
        "society_information",
        "images"
      )
    : null;

  // Effect to fetch existing images from Firestore when component mounts or societyId changes
  useEffect(() => {
    let isMounted = true; // ✅ prevent state update if unmounted

    const fetchImages = async () => {
      if (!isFirebaseAvailable || !societyId) {
        if (isMounted) {
          setLoading(false);
          setImages([]);
        }
        return;
      }

      try {
        if (isMounted) setLoading(true);
        const docSnap = await getDoc(societyDocRef);
        if (isMounted) {
          if (docSnap.exists()) {
            const societyData = docSnap.data();
            setImages(societyData.images || []);
          } else {
            setImages([]);
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        if (isMounted) setImages([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchImages();

    return () => {
      isMounted = false; // cleanup
    };
  }, [societyId, isFirebaseAvailable]);

  // Handler for clicking the upload button
  const handleUploadClick = () => {
    if (images.length === 0) {
      fileInputRef.current?.click(); // Open file input if no images exist
    } else {
      setEditMode(true); // Enter edit mode if images exist
      setSelectedImages([]);
      setSelectedImageIndexes([]);
    }
  };

  // Image compression utility
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/jpeg",
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };

  // Handler for file selection from input
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    const compressedFiles = await Promise.all(
      files.map((file) => compressImage(file))
    );
    setSelectedImages((prev) => [...prev, ...compressedFiles]);
    if (images.length === 0) {
      setEditMode(true);
    }
    e.target.value = null; // Clear file input
  };

  // Handler to save all new and existing images
  const handleSaveAll = async () => {
    if (uploading) return;

    const totalImagesAfterUpload = images.length + selectedImages.length;
    if (totalImagesAfterUpload < 6) {
      setPopup({
        isOpen: true,
        message: `You must have at least 6 images in the gallery to save. Please add ${
          6 - totalImagesAfterUpload
        } more.`,
        type: "error",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const newUrls = [];
      for (const file of selectedImages) {
        const fileName = `${Date.now()}-${file.name}`;
        const imageRef = ref(
          projectStorage,
          `society_images/${societyId}/${fileName}`
        );
        const uploadTask = uploadBytesResumable(imageRef, file);

        const downloadURL = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progress));
            },
            (error) => reject(error),
            async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
          );
        });
        newUrls.push(downloadURL);
      }

      const updatedImages = [...images, ...newUrls];
      if (societyDocRef) {
        await setDoc(societyDocRef, { images: updatedImages }, { merge: true });
      }

      setImages(updatedImages);
      setSelectedImages([]);
      setSelectedImageIndexes([]);
      setUploadProgress(100);

      setTimeout(() => {
        setUploading(false);
        setEditMode(false);
        setPopup({
          isOpen: true,
          message: "Images uploaded and saved successfully.",
          type: "success",
        });
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      setPopup({
        isOpen: true,
        message: "Failed to upload images. Please try again.",
        type: "error",
      });
      setUploading(false);
    }
  };

  // Opens the fullscreen image viewer
  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };

  // Closes the fullscreen image viewer
  const closeImageViewer = () => {
    setViewerOpen(false);
  };

  // Navigates to the previous image in the viewer
  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Navigates to the next image in the viewer
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Deletes a single existing image from Firestore and Storage
  const handleDeleteExisting = async (indexToDelete) => {
    try {
      const imageUrl = images[indexToDelete];
      const updatedImages = images.filter((_, i) => i !== indexToDelete);

      if (updatedImages.length < 6) {
        setPopup({
          isOpen: true,
          message:
            "You must have at least 6 images in the gallery. Cannot delete this image.",
          type: "error",
        });
        return;
      }

      // Delete from Firebase Storage
      const imageRef = ref(projectStorage, imageUrl);
      await deleteObject(imageRef);

      // Update Firestore document
      if (societyDocRef) {
        await setDoc(societyDocRef, { images: updatedImages }, { merge: true });
      }

      setImages(updatedImages);
      setSelectedImageIndexes((prevIndexes) =>
        prevIndexes
          .filter((i) => i !== indexToDelete)
          .map((i) => (i > indexToDelete ? i - 1 : i))
      );
      setPopup({
        isOpen: true,
        message: "Image deleted successfully.",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      setPopup({
        isOpen: true,
        message: "Failed to delete image. Please try again.",
        type: "error",
      });
    }
  };

  // Deletes selected existing images from Firestore and Storage
  const handleDeleteSelectedExisting = async () => {
    if (selectedImageIndexes.length === 0) return;

    const remainingImagesCount =
      images.length -
      selectedImageIndexes.filter((index) => index < images.length).length;
    if (remainingImagesCount < 6) {
      setPopup({
        isOpen: true,
        message: `Deleting these images would leave fewer than 6 images. Please add more images before deleting.`,
        type: "error",
      });
      return;
    }

    setPopup({
      isOpen: true,
      message: `Are you sure you want to delete ${selectedImageIndexes.length} selected existing images?`,
      type: "confirm",
      onConfirm: async () => {
        try {
          // Filter out only the existing images that are selected
          const existingImageIndexesToDelete = selectedImageIndexes
            .filter((index) => index < images.length)
            .sort((a, b) => b - a); // Sort descending for correct filtering

          await Promise.all(
            existingImageIndexesToDelete.map((index) => {
              const imageUrl = images[index];
              const imageRef = ref(projectStorage, imageUrl);
              return deleteObject(imageRef).catch((error) =>
                console.error(`Error deleting image ${imageUrl}:`, error)
              );
            })
          );

          // Filter out deleted images from the current images array
          const updatedImages = images.filter(
            (_, i) => !existingImageIndexesToDelete.includes(i)
          );

          if (societyDocRef) {
            await updateDoc(societyDocRef, { images: updatedImages });
          }

          setImages(updatedImages);
          setSelectedImageIndexes([]); // Clear selection
          setPopup({
            isOpen: true,
            message: "Selected existing images deleted successfully.",
            type: "success",
          });
        } catch (error) {
          console.error("Error deleting selected existing images:", error);
          setPopup({
            isOpen: true,
            message:
              "Failed to delete selected existing images. Please try again.",
            type: "error",
          });
        }
      },
    });
  };

  // Deletes a single newly selected image (not yet uploaded)
  const handleDeleteNew = (indexToDelete) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== indexToDelete));
    // Adjust selectedImageIndexes for new images
    setSelectedImageIndexes(
      (prevIndexes) =>
        prevIndexes
          .filter((i) => i !== images.length + indexToDelete)
          .map((i) => (i > images.length + indexToDelete ? i - 1 : i))
          .filter((i) => i < images.length + selectedImages.length - 1) // Ensure index is within new bounds
    );
  };

  // Deletes selected newly added images (not yet uploaded)
  const handleDeleteSelectedNew = () => {
    if (selectedImageIndexes.length === 0) return;

    setPopup({
      isOpen: true,
      message: `Are you sure you want to remove ${selectedImageIndexes.length} selected new images?`,
      type: "confirm",
      onConfirm: () => {
        const indexesToRemoveFromNew = selectedImageIndexes
          .filter(
            (index) => index >= images.length // Only consider indexes for new images
          )
          .map((index) => index - images.length); // Convert to 0-based index for selectedImages array

        setSelectedImages((prev) =>
          prev.filter((_, i) => !indexesToRemoveFromNew.includes(i))
        );
        setSelectedImageIndexes([]); // Clear selection
        setPopup({
          isOpen: true,
          message: "Selected new images removed successfully.",
          type: "success",
        });
      },
    });
  };

  // Confirms and executes deletion of all images (existing and new)
  const confirmDeleteAll = async () => {
    try {
      // Delete existing images from Firebase Storage
      await Promise.all(
        images.map((url) => {
          const imageRef = ref(projectStorage, url);
          return deleteObject(imageRef).catch((error) =>
            console.error(`Error deleting image ${url}:`, error)
          );
        })
      );

      // Clear images array in Firestore
      if (societyDocRef) {
        await setDoc(societyDocRef, { images: [] }, { merge: true });
      }

      setImages([]);
      setSelectedImages([]);
      setSelectedImageIndexes([]);
      setPopup({
        isOpen: true,
        message: "All images deleted successfully.",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting all images:", error);
      setPopup({
        isOpen: true,
        message: "Failed to delete all images. Please try again.",
        type: "error",
      });
    }
  };

  // Initiates the deletion of all images with a confirmation popup
  const handleDeleteAll = () => {
    if (images.length === 0 && selectedImages.length === 0) {
      setPopup({
        isOpen: true,
        message: "No images to delete.",
        type: "error",
      });
      return;
    }

    setPopup({
      isOpen: true,
      message: "Are you sure you want to delete all existing and new images?",
      type: "confirm",
      onConfirm: () => {
        // First clear new images, then proceed to confirmDeleteAll for existing
        if (selectedImages.length > 0) {
          setSelectedImages([]);
          setSelectedImageIndexes([]);
        }
        confirmDeleteAll();
      },
    });
  };

  // Toggles selection of an image in edit mode
  const toggleImageSelection = (index) => {
    setSelectedImageIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Selects or deselects all images in edit mode
  const selectAllImages = () => {
    const totalImages = images.length + selectedImages.length;
    if (selectedImageIndexes.length === totalImages && totalImages > 0) {
      setSelectedImageIndexes([]); // Deselect all
    } else {
      // Select all images (existing + new)
      setSelectedImageIndexes(Array.from({ length: totalImages }, (_, i) => i));
    }
  };

  const totalImages = images.length + selectedImages.length;

  // Renders the gallery in edit mode
  const renderEditModeGallery = () => {
    return (
      <div className="edit-mode-gallery">
        <div className="edit-mode-controls">
          <label className="add-images-btn">
            <FaUpload /> Add Images
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
          </label>

          {selectedImageIndexes.length > 0 && (
            <>
              <button
                className="clear-selection-btn"
                onClick={() => setSelectedImageIndexes([])}
              >
                Clear Selection
              </button>
              <button
                className="delete-selected-btn"
                // Determine whether to delete existing or new selected images
                onClick={() => {
                  const hasExistingSelected = selectedImageIndexes.some(
                    (index) => index < images.length
                  );
                  const hasNewSelected = selectedImageIndexes.some(
                    (index) => index >= images.length
                  );

                  if (hasExistingSelected && hasNewSelected) {
                    // Handle mixed selection, maybe prompt user or delete both
                    setPopup({
                      isOpen: true,
                      message:
                        "You have selected both existing and new images. Please delete them separately or deselect some.",
                      type: "error",
                    });
                  } else if (hasExistingSelected) {
                    handleDeleteSelectedExisting();
                  } else if (hasNewSelected) {
                    handleDeleteSelectedNew();
                  }
                }}
              >
                Delete Selected ({selectedImageIndexes.length})
              </button>
            </>
          )}

          <button className="select-all-btn" onClick={selectAllImages}>
            {selectedImageIndexes.length === totalImages && totalImages > 0
              ? "Deselect All"
              : "Select All"}
          </button>

          <button
            className="delete-all-btn"
            onClick={handleDeleteAll}
            disabled={totalImages === 0}
          >
            Delete All
          </button>
          <button
            className="cancel-btn"
            onClick={() => setEditMode(false)}
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            className="save-all-btn"
            onClick={handleSaveAll}
            disabled={
              uploading || selectedImages.length === 0 || totalImages < 6
            }
          >
            {uploading
              ? `Uploading... ${Math.round(uploadProgress)}%`
              : "Save All"}
          </button>
        </div>

        <div className="selected-images-preview">
          {images.length > 0 && (
            <div className="existing-images-section">
              <h4>Existing Images</h4>
              <div className="selected-images-grid">
                {images.map((url, index) => (
                  <div
                    key={`existing-${index}`}
                    className="selected-image-item"
                  >
                    <div className="image-checkbox-container">
                      <input
                        type="checkbox"
                        checked={selectedImageIndexes.includes(index)}
                        onChange={() => toggleImageSelection(index)}
                        className="image-checkbox"
                      />
                    </div>
                    <img src={url} alt={`Existing ${index}`} />
                    <button
                      className="delete-image-btn"
                      onClick={() => handleDeleteExisting(index)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedImages.length > 0 && (
            <div className="new-images-section">
              <h4>New Images to Upload</h4>
              <div className="selected-images-grid">
                {selectedImages.map((file, index) => {
                  const adjustedIndex = images.length + index;
                  return (
                    <div key={`new-${index}`} className="selected-image-item">
                      <div className="image-checkbox-container">
                        <input
                          type="checkbox"
                          checked={selectedImageIndexes.includes(adjustedIndex)}
                          onChange={() => toggleImageSelection(adjustedIndex)}
                          className="image-checkbox"
                        />
                      </div>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Selected ${index}`}
                      />
                      <button
                        className="delete-image-btn"
                        onClick={() => handleDeleteNew(index)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {totalImages === 0 && (
            <p className="no-images-text">No images selected or uploaded.</p>
          )}
        </div>

        {uploading && (
          <div className="upload-progress">
            <progress value={uploadProgress} max="100" />
            <span>Uploading... {Math.round(uploadProgress)}%</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="gallery-preview">
      <div className="gallery-header">
        <h2 className="gallery-title">
          {societyName} - {societyType} Apartment
        </h2>
        <div className="gallery-icons">
          {/* Show upload button only if not in edit mode and user has appropriate role */}
          {images.length > 0 &&
          !editMode &&
          user &&
          ["admin", "superAdmin"].includes(user.role) ? (
            <button
              className="upload-btn icon"
              title="Upload Images"
              onClick={handleUploadClick}
            >
              <FaUpload />
            </button>
          ) : null}
        </div>
      </div>

      {/* Conditional rendering for the main gallery view */}
      {loading ? (
        <div className="loading-spinner">
          <FaSpinner className="spin" size={40} />
          <p>Loading gallery...</p>
        </div>
      ) : !isFirebaseAvailable ? (
        <div className="no-images">
          <FaExclamationTriangle size={64} />
          <p>
            Firebase services are not available. Please check your
            configuration.
          </p>
        </div>
      ) : editMode ? (
        renderEditModeGallery()
      ) : images.length > 0 ? (
        <>
          <div className="gallery-grid">
            {/* Each image is now clickable to open the viewer */}
            {images.length >= 1 && (
              <div
                className="main-photo clickable"
                onClick={() => openImageViewer(0)}
              >
                <img src={images[0]} alt="Main View" />
              </div>
            )}

            {images.length >= 2 && (
              <div
                className="sub-photo clickable"
                onClick={() => openImageViewer(1)}
              >
                <img src={images[1]} alt="View 2" />
              </div>
            )}

            {images.length >= 3 && (
              <div
                className={`sub-photo photo clickable ${
                  images.length === 3 ? "end" : ""
                }`}
                onClick={() => openImageViewer(2)}
              >
                <img src={images[2]} alt="View 3" />
              </div>
            )}

            {images.length >= 4 && (
              <div
                className="sub-photo clickable"
                onClick={() => openImageViewer(3)}
              >
                <img src={images[3]} alt="View 4" />
              </div>
            )}

            {/* {images.length >= 5 && (
            <div
              className={`sub-photo endphoto clickable ${
                images.length === 5 ? "end2" : ""
              }`}
              onClick={() => openImageViewer(4)}
            >
              <img src={images[4]} alt="View 5" />
            </div>
          )} */}

            {images.length >= 4 && (
              <div
                className={`sub-photo endphoto clickable ${
                  images.length === 5 ? "end2" : ""
                }`}
                onClick={() => openImageViewer(4)}
              >
                <img src={images[4]} alt="View 5" />
                <div className="show-more" onClick={() => openImageViewer(5)}>
                  <button className="show-all-btn">
                    <MdOutlinePhotoLibrary size={20} />
                    Show all {images.length} photos
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="show-more-small" onClick={() => openImageViewer(5)}>
            <button className="show-all-btn">
              <MdOutlinePhotoLibrary size={20} />
              Show all {images.length} photos
            </button>
          </div>
        </>
      ) : (
        <div className="empty-gallery">
          <p>No images uploaded yet</p>
          {user && ["admin", "superAdmin"].includes(user.role) ? (
            <button className="upload-btn" onClick={handleUploadClick}>
              <FaUpload /> Upload Images
            </button>
          ) : null}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      {viewerOpen && (
        <div className="image-viewer-overlay">
          <div className="image-viewer-content">
            <button className="close-viewer" onClick={closeImageViewer}>
              <FaTimes />
            </button>
            <button className="nav-button prev" onClick={goToPrevious}>
              <FaChevronLeft />
            </button>
            <img
              src={images[currentImageIndex]}
              alt={`Gallery ${currentImageIndex}`}
            />
            <button className="nav-button next" onClick={goToNext}>
              <FaChevronRight />
            </button>
            <div className="image-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      {/* Popup / Modal for messages and confirmations */}
      {popup.isOpen && (
        <div className="popup-overlay">
          <div className={`popup-content ${popup.type}`}>
            <div className="popup-icon">
              {popup.type === "success" && <FaCheckCircle />}
              {popup.type === "error" && <FaExclamationCircle />}
              {popup.type === "confirm" && <FaExclamationCircle />}
            </div>
            <div className="popup-message">
              <p>{popup.message}</p>
            </div>
            <div className="popup-actions">
              {popup.type === "confirm" && (
                <>
                  <button
                    className="btn-cancel"
                    onClick={() =>
                      setPopup({ isOpen: false, message: "", type: "" })
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-confirm"
                    onClick={() => {
                      if (popup.onConfirm) {
                        popup.onConfirm();
                      }
                      setPopup({ isOpen: false, message: "", type: "" });
                    }}
                  >
                    Confirm
                  </button>
                </>
              )}
              {(popup.type === "success" || popup.type === "error") && (
                <button
                  className="btn-close-popup"
                  onClick={() =>
                    setPopup({ isOpen: false, message: "", type: "" })
                  }
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MapLocationSection = ({ state, city, locality, address, societyId }) => {
  const { user } = useAuthContext();
  const [societyData, setSocietyData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mapLink, setMapLink] = useState("");
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    place: "",
    distance: "",
    time: "",
    timeUnit: "mins",
  });
  const [tempMapLink, setTempMapLink] = useState("");
  const [tempLocations, setTempLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!societyId) return;

      try {
        const docRef = doc(
          projectFirestore,
          "m_societies",
          societyId,
          "society_information",
          "map_location"
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSocietyData(docSnap.data());
          if (docSnap.data().mapLink) {
            setMapLink(docSnap.data().mapLink);
            setTempMapLink(docSnap.data().mapLink);
          }
          if (docSnap.data().locations) {
            setNearbyLocations(docSnap.data().locations);
            setTempLocations(docSnap.data().locations);
          }
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [societyId]);

  const handleEditClick = () => {
    setIsEditing(true);
    setTempMapLink(mapLink);
    setTempLocations([...nearbyLocations]);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempMapLink(mapLink);
    setTempLocations([...nearbyLocations]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(
        projectFirestore,
        "m_societies",
        societyId,
        "society_information",
        "map_location"
      );
      await setDoc(
        docRef,
        {
          mapLink: tempMapLink,
          locations: tempLocations,
        },
        { merge: true }
      );
      setMapLink(tempMapLink);
      setNearbyLocations(tempLocations);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;

    if (name === "distance") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 3) return;

      setNewLocation({
        ...newLocation,
        [name]: numericValue,
      });
    } else if (name === "time") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 2) return;

      setNewLocation({
        ...newLocation,
        [name]: numericValue,
      });
    } else {
      setNewLocation({
        ...newLocation,
        [name]: value,
      });
    }
  };

  const handleAddLocation = () => {
    if (newLocation.place && newLocation.distance && newLocation.time) {
      const locationToAdd = {
        place: newLocation.place,
        distance: `${newLocation.distance} km`,
        time: `${newLocation.time} ${newLocation.timeUnit}`,
      };

      setTempLocations([...tempLocations, locationToAdd]);
      setNewLocation({
        place: "",
        distance: "",
        time: "",
        timeUnit: "mins",
      });
    }
  };

  const handleRemoveLocation = (index) => {
    const updatedLocations = [...tempLocations];
    updatedLocations.splice(index, 1);
    setTempLocations(updatedLocations);
  };

  const handleMapLinkChange = (e) => {
    setTempMapLink(e.target.value);
  };

  const parseTimeValue = (timeString) => {
    const match = timeString.match(/(\d+)\s*(mins|hrs)/);
    if (match) {
      return {
        value: match[1],
        unit: match[2],
      };
    }
    return { value: "", unit: "mins" };
  };

  const formattedState = formatStateName(state);
  const formattedCity = formatStateName(city);
  const formattedLocality = formatStateName(locality);

  return (
    <section className="map-location-section">
      <div className="container">
        <div className="section-header">
          <h2>Location & Connectivity</h2>
          <p>
            Strategically located in the heart of Whitefield with excellent
            connectivity to key destinations
          </p>
          {!isEditing &&
            (nearbyLocations.length > 0 || mapLink) &&
            user &&
            ["admin", "superAdmin"].includes(user.role) && (
              <button className="edit-button" onClick={handleEditClick}>
                <FaEdit />
                Edit
              </button>
            )}
        </div>

        {/* Edit Form Popup */}
        {isEditing && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Edit Location Details</h3>
                <button className="modal-close" onClick={handleCancel}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Google Maps Embed Link</label>
                  <input
                    type="text"
                    value={tempMapLink}
                    onChange={handleMapLinkChange}
                    placeholder="Paste Google Maps embed link here"
                  />
                  <small className="help-text">
                    How to get the embed link: On Google Maps, click "Share" →
                    "Embed a map" → Copy the iframe src URL
                  </small>
                </div>

                <div className="locations-form">
                  <h3>Nearby Locations</h3>
                  <div className="locations-list">
                    {tempLocations.map((location, index) => {
                      const timeData = parseTimeValue(location.time);
                      return (
                        <div key={index} className="location-item">
                          <div className="location-info">
                            <MapPin className="location-icon" />
                            <input
                              type="text"
                              name="place"
                              value={location.place}
                              onChange={(e) => {
                                const updated = [...tempLocations];
                                updated[index].place = e.target.value;
                                setTempLocations(updated);
                              }}
                            />
                          </div>
                          <div className="location-meta">
                            <div className="distance-input-container">
                              <input
                                type="text"
                                name="distance"
                                value={location.distance.replace(" km", "")}
                                onChange={(e) => {
                                  const numericValue = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  if (numericValue.length > 3) return;
                                  const updated = [...tempLocations];
                                  updated[
                                    index
                                  ].distance = `${numericValue} km`;
                                  setTempLocations(updated);
                                }}
                                placeholder="Distance"
                              />
                              <span className="unit">km</span>
                            </div>
                            <div className="time-input-container">
                              <input
                                type="text"
                                name="time"
                                value={timeData.value}
                                onChange={(e) => {
                                  const numericValue = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  if (numericValue.length > 2) return;
                                  const updated = [...tempLocations];
                                  updated[
                                    index
                                  ].time = `${numericValue} ${timeData.unit}`;
                                  setTempLocations(updated);
                                }}
                                placeholder="Time"
                              />
                              <select
                                value={timeData.unit}
                                onChange={(e) => {
                                  const updated = [...tempLocations];
                                  updated[
                                    index
                                  ].time = `${timeData.value} ${e.target.value}`;
                                  setTempLocations(updated);
                                }}
                                className="time-unit-select"
                              >
                                <option value="mins">mins</option>
                                <option value="hrs">hrs</option>
                              </select>
                              <button
                                onClick={() => handleRemoveLocation(index)}
                                className="remove-button"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="add-location-form">
                    <h4>Add New Location</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Place Name</label>
                        <input
                          type="text"
                          name="place"
                          value={newLocation.place}
                          onChange={handleLocationChange}
                          placeholder="e.g. Shopping Mall"
                        />
                      </div>
                      <div className="form-group">
                        <label>Distance (in km)</label>
                        <div className="distance-input-container">
                          <input
                            type="text"
                            name="distance"
                            value={newLocation.distance}
                            onChange={handleLocationChange}
                            placeholder="e.g. 1.5"
                            maxLength={3}
                          />
                          <span className="unit">km</span>
                        </div>
                      </div>
                      <div className="form-group timeBox">
                        <label>Time</label>
                        <input
                          type="text"
                          name="time"
                          value={newLocation.time}
                          onChange={handleLocationChange}
                          placeholder="e.g. 10"
                          maxLength={2}
                        />
                        <select
                          name="timeUnit"
                          value={newLocation.timeUnit}
                          onChange={handleLocationChange}
                          className="time-unit-select"
                        >
                          <option value="mins">mins</option>
                          <option value="hrs">hrs</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={handleAddLocation}
                      className="add-button"
                      disabled={
                        !newLocation.place ||
                        !newLocation.distance ||
                        !newLocation.time
                      }
                    >
                      <FaPlus /> Add Location
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={handleCancel}
                  className="cancel-button"
                  disabled={isSaving}
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="save-button"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="spinner" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Display */}
        {mapLink || nearbyLocations.length > 0 ? (
          <div className="content-grid">
            {/* Map Section */}
            <div className="map-container">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <MapPin className="icon" />
                    Society Location
                  </h3>
                </div>
                <div className="card-content">
                  {/* <div className="map-iframe">
                    <iframe
                      title="Society Location"
                      src={
                        mapLink ||
                        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.007168164708!2d77.75055731482193!3d12.972462990856818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae0d8a8f69a5a9%3A0x7a2c2b3e3e3e3e3e!2sWhitefield%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                      }
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div> */}
                  <div
                    className="map-iframe"
                    dangerouslySetInnerHTML={{ __html: mapLink }}
                  />
                  <div className="address-details">
                    <p className="address-label">Complete Address:</p>
                    <p>{address}</p>
                    <p>
                      {formattedCity}, {formattedState}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Locations Section */}
            <div className="locations-container">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Nearby Locations</h3>
                </div>
                <div className="card-content">
                  <div className="locations-list">
                    {nearbyLocations.map((location, index) => (
                      <div key={index} className="location-item">
                        <div className="location-info">
                          <MapPin className="location-icon" />
                          <span className="location-name">
                            {location.place}
                          </span>
                        </div>
                        <div className="location-meta">
                          <span className="distance">{location.distance}</span>
                          <div className="time-info">
                            <Clock className="time-icon" />
                            <span>{location.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : user && ["admin", "superAdmin"].includes(user.role) ? (
          <button className="no-details" onClick={handleEditClick}>
            <FaPlus />{" "}
            <span className="no-details-text">
              Click Here to Upload Details
            </span>
          </button>
        ) : (
          <div className="no-details">
            <p>No details available</p>
          </div>
        )}
      </div>
    </section>
  );
};

const PropertyVideosSection = ({ societyId }) => {
  const { user } = useAuthContext();
  const sliderRef = useRef(null);
  const titleRef = useRef(null); // Step 1: Create a ref for the title input
  const [videos, setVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    url: "",
    title: "",
  });
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch videos from Firestore
  useEffect(() => {
    if (!societyId) return;

    const societyDocRef = doc(
      projectFirestore,
      "m_societies",
      societyId,
      "society_information",
      "videos"
    );
    const unsubscribe = onSnapshot(societyDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setVideos(data?.videos || []);
      }
    });

    return () => unsubscribe();
  }, [societyId]);

  // Check scroll position to show/hide arrows
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      setShowLeftArrow(slider.scrollLeft > 0);
      setShowRightArrow(
        slider.scrollLeft < slider.scrollWidth - slider.clientWidth - 1
      );
    };

    slider.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => slider.removeEventListener("scroll", handleScroll);
  }, [videos]);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVideo({ ...newVideo, [name]: value });
  };

  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const shortsRegExp = /^.*(youtube.com\/shorts\/)([^#&?]*).*/;
    const shortsMatch = url.match(shortsRegExp);

    if (match && match[2].length === 11) return match[2];
    if (shortsMatch && shortsMatch[2].length === 11) return shortsMatch[2];
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const videoId = extractVideoId(newVideo.url);

    if (!videoId) {
      alert("Please enter a valid YouTube URL");
      setIsSaving(false);
      return;
    }

    try {
      await setDoc(
        doc(
          projectFirestore,
          "m_societies",
          societyId,
          "society_information",
          "videos"
        ),
        {
          videos: [
            ...videos,
            {
              id: videoId,
              title: newVideo.title,
              thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
              duration: "0:00",
            },
          ],
        },
        { merge: true }
      );
      setNewVideo({ url: "", title: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVideo = async (index) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const updatedVideos = [...videos];
      updatedVideos.splice(index, 1);
      await setDoc(
        doc(
          projectFirestore,
          "m_societies",
          societyId,
          "society_information",
          "videos"
        ),
        { videos: updatedVideos },
        { merge: true }
      );
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video");
    }
  };

  const handleFocus = () => {
    if (titleRef.current) {
      setTimeout(() => {
        titleRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300); // Small delay to let the keyboard show up first
    }
  };

  return (
    <section className="property-videos-section">
      <div className="container">
        <div className="section-header">
          <h2>Property Videos</h2>
          <p>
            Get an immersive experience of our residential society through these
            detailed video tours
          </p>
          {videos.length > 0 &&
          user &&
          ["admin", "superAdmin"].includes(user.role) ? (
            <button className="edit-button" onClick={() => setShowForm(true)}>
              <FaPlus /> Add Video
            </button>
          ) : null}
        </div>

        {/* Video Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Add New Video</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowForm(false)}
                  disabled={isSaving}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>YouTube URL:</label>
                    <input
                      type="text"
                      name="url"
                      value={newVideo.url}
                      onChange={handleInputChange}
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                      disabled={isSaving}
                    />
                  </div>
                  <div className="form-group">
                    <label>Title:</label>
                    <input
                      ref={titleRef} // Step 2: Add the ref here
                      type="text"
                      name="title"
                      value={newVideo.title}
                      onChange={handleInputChange}
                      onFocus={handleFocus} // Step 3: Add the onFocus event handler
                      placeholder="Video title"
                      required
                      disabled={isSaving}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="cancel-button"
                      disabled={isSaving}
                    >
                      <FaTimes /> Cancel
                    </button>
                    <button
                      type="submit"
                      className="submit-button"
                      disabled={isSaving}
                    >
                      {isSaving ? "Adding..." : "Add Video"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="videos-slider-wrapper">
          {showLeftArrow && (
            <button className="slider-button left" onClick={scrollLeft}>
              <FaChevronLeft />
            </button>
          )}

          <div className="videos-slider" ref={sliderRef}>
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <div key={index} className="video-card">
                  <div className="thumbnail-container">
                    {video.id ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <>
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="thumbnail-image"
                        />
                      </>
                    )}
                    {user && ["admin", "superAdmin"].includes(user.role) && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteVideo(index)}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                  <h3 className="video-title">{video.title}</h3>
                </div>
              ))
            ) : user && ["admin", "superAdmin"].includes(user.role) ? (
              <button className="no-details" onClick={() => setShowForm(true)}>
                <FaPlus />{" "}
                <span className="no-details-text">
                  Click Here to Upload Videos
                </span>
              </button>
            ) : (
              <div className="no-details">
                <p>No videos available</p>
              </div>
            )}
          </div>

          {showRightArrow && videos.length > 0 && (
            <button className="slider-button right" onClick={scrollRight}>
              <FaChevronRight />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

// ✅ Function to format number with Indian commas
const formatIndianNumber = (num) => {
  if (!num) return "";
  return new Intl.NumberFormat("en-IN").format(num);
};

// ✅ Function to convert number to words
const numberToWords = (num) => {
  if (!num) return "";

  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
    if (n < 1000)
      return a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100);
    if (n < 100000)
      return inWords(Math.floor(n / 1000)) + " Thousand " + inWords(n % 1000);
    if (n < 10000000)
      return inWords(Math.floor(n / 100000)) + " Lakh " + inWords(n % 100000);
    return (
      inWords(Math.floor(n / 10000000)) + " Crore " + inWords(n % 10000000)
    );
  };

  return inWords(num).trim();
};

const FloorPlans = ({ societyId }) => {
  const { user } = useAuthContext();
  // const user = { role: 'admin' };
  const [price, setPrice] = useState("");
  const [floorPlans, setFloorPlans] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [currentBhk, setCurrentBHK] = useState("All");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const scrollRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = useState({
    left: false,
    right: false,
  });

  // ✅ CORRECT POSITION: popup state is now declared with other state variables
  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "",
    onConfirm: null,
  });

  const typeOptions = [
    "Apartment",
    "Builder Floor",
    "Villa",
    "Row House",
    "Duplex",
    "Penthouse",
    "Kothi",
  ];

  const bhkOptions = [
    "EWS",
    "1 RK",
    "Studio",
    "1 BHK",
    "1.5 BHK",
    "2 BHK",
    "2.5 BHK",
    "3 BHK",
    "3.5 BHK",
    "4 BHK",
    "5 BHK",
    "6 BHK",
    "7 BHK",
    "8 BHK",
    "9 BHK",
    "9+ BHK",
    "Hall",
  ];

  const bedroomOptions = [
    "1 Bedroom",
    "2 Bedrooms",
    "3 Bedrooms",
    "4 Bedrooms",
    "5 Bedrooms",
    "6 Bedrooms",
    "7 Bedrooms",
    "8 Bedrooms",
    "9 Bedrooms",
    "10+ Bedrooms",
  ];

  const bathroomOptions = [
    "1 Bathroom",
    "2 Bathrooms",
    "3 Bathrooms",
    "4 Bathrooms",
    "5 Bathrooms",
    "6 Bathrooms",
  ];

  const bhkOrder = [
    "EWS",
    "1 RK",
    "Studio",
    "1 BHK",
    "1.5 BHK",
    "2 BHK",
    "2.5 BHK",
    "3 BHK",
    "3.5 BHK",
    "4 BHK",
    "5 BHK",
    "6 BHK",
    "7 BHK",
    "8 BHK",
    "9 BHK",
    "9+ BHK",
    "Hall",
  ];

  const additionalOptions = [
    "Servant",
    "Study",
    "Store",
    "Puja",
    "Utility",
    "Powder",
    "Basement",
  ];

  const areaUnitOptions = ["SqFt", "SqYd", "SqMtr"]; //, "Acres", "Hectares"

  const updateUnitTypes = async (plans) => {
    if (!Array.isArray(plans)) {
      setUnitTypes(["All"]);
      return;
    }

    const uniqueBhkTypes = ["All", ...new Set(plans.map((plan) => plan.bhk))];

    uniqueBhkTypes.sort((a, b) => {
      if (a === "All") return -1;
      if (b === "All") return 1;

      const indexA = bhkOrder.indexOf(a);
      const indexB = bhkOrder.indexOf(b);

      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    setUnitTypes(uniqueBhkTypes);

    if (!uniqueBhkTypes.includes(currentBhk)) {
      setCurrentBHK("All");
    }

    // ✅ Save to Firestore (skip "All")
    try {
      const docRef = doc(projectFirestore, "m_societies", societyId);
      await setDoc(
        docRef,
        { unitTypes: uniqueBhkTypes.filter((t) => t !== "All") },
        { merge: true }
      );
    } catch (error) {
      console.error("❌ Error saving unit types:", error);
    }
  };

  useEffect(() => {
    const fetchFloorPlans = async () => {
      if (!societyId) return;

      setLoading(true);
      try {
        const docRef = doc(
          projectFirestore,
          "m_societies",
          societyId,
          "society_information",
          "floor_plans"
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedPlans = docSnap.data().plans || [];
          setFloorPlans(fetchedPlans);
          updateUnitTypes(fetchedPlans);
        } else {
          setFloorPlans([]);
          updateUnitTypes([]);
        }
      } catch (error) {
        console.error("Error fetching floor plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFloorPlans();
  }, [societyId]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollWidth, scrollLeft, clientWidth } = scrollRef.current;
        setShowScrollButtons({
          left: scrollLeft > 0,
          right: scrollLeft + clientWidth < scrollWidth,
        });
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [floorPlans, currentBhk]);

  const openModal = (plan = null, index = null) => {
    setCurrentPlan(
      plan
        ? { ...plan }
        : {
            type: "Apartment",
            bhk: "1 BHK",
            bedrooms: "1 Bedroom",
            bathrooms: "1 Bathroom",
            additional: [],
            superArea: "",
            carpetArea: "",
            areaUnit: "SqFt",
            price: "",
            image: null,
          }
    );
    setCurrentIndex(index);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPlan(null);
    setCurrentIndex(null);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setCurrentPlan((prev) => {
      const updatedPlan = { ...prev, [field]: value };
      validatePlan(updatedPlan);
      return updatedPlan;
    });
  };

  const handleAdditionalChange = (option, isChecked) => {
    setCurrentPlan((prev) => {
      const newAdditional = isChecked
        ? [...(prev.additional || []), option]
        : (prev.additional || []).filter((item) => item !== option);
      return { ...prev, additional: newAdditional };
    });
  };

  const handleBhk = (type) => {
    setCurrentBHK(type);
  };

  const validatePlan = (plan) => {
    const newErrors = {};
    if (parseFloat(plan.carpetArea) > parseFloat(plan.superArea)) {
      newErrors.carpetArea = "Carpet area cannot be larger than super area.";
    }
    if (!plan.type || !plan.bhk || !plan.bedrooms || !plan.bathrooms) {
      newErrors.required = "Please fill all required fields (*).";
    }
    setErrors(newErrors);
  };

  const saveChangesAndPersist = async () => {
    if (!currentPlan || Object.keys(errors).length > 0) {
      setPopup({
        isOpen: true,
        message: "Please fix validation errors before saving.",
        type: "error",
      });
      return;
    }

    setSaving(true);
    const existingPlans = Array.isArray(floorPlans) ? floorPlans : [];
    let updatedPlans = [...existingPlans];

    if (currentIndex !== null) {
      updatedPlans[currentIndex] = currentPlan;
    } else {
      updatedPlans.push(currentPlan);
    }

    try {
      const docRef = doc(
        projectFirestore,
        "m_societies",
        societyId,
        "society_information",
        "floor_plans"
      );
      await setDoc(docRef, { plans: updatedPlans });

      setFloorPlans(updatedPlans);
      updateUnitTypes(updatedPlans);
      closeModal();
      setPopup({
        isOpen: true,
        message: "Floor plan saved successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error saving floor plans:", error);
      setPopup({
        isOpen: true,
        message: "Error saving floor plans. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `societies/${societyId}/floor_plans/${Date.now()}_${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload error:", error);
          setIsUploading(false);
          setPopup({
            isOpen: true,
            message: "Image upload failed. Please try again.",
            type: "error",
          });
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setCurrentPlan((prev) => ({ ...prev, image: downloadURL }));
          setIsUploading(false);
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
    }
  };

  const deleteImageFromStorage = async (imageURL) => {
    if (!imageURL) return;
    try {
      const storage = getStorage();
      const imageRef = ref(storage, imageURL);
      await deleteObject(imageRef);
      console.log("Image deleted successfully from Firebase Storage.");
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        console.warn(
          "Image not found in storage, skipping deletion:",
          imageURL
        );
      } else {
        console.error("Error deleting image from storage:", error);
      }
    }
  };

  const confirmRemovePlan = async (index) => {
    const planToDelete = floorPlans[index];
    const updatedPlans = floorPlans.filter((_, i) => i !== index);

    try {
      if (planToDelete.image) {
        await deleteImageFromStorage(planToDelete.image);
      }
      const docRef = doc(
        projectFirestore,
        "m_societies",
        societyId,
        "society_information",
        "floor_plans"
      );
      await setDoc(docRef, { plans: updatedPlans });

      setFloorPlans(updatedPlans);
      updateUnitTypes(updatedPlans);
      setPopup({
        isOpen: true,
        message: "Floor plan removed successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error removing floor plan:", error);
      setPopup({
        isOpen: true,
        message: "Error removing floor plan. Please try again.",
        type: "error",
      });
    }
  };

  const removeFloorPlan = (index) => {
    setPopup({
      isOpen: true,
      message: "Are you sure you want to remove this floor plan?",
      type: "confirm",
      onConfirm: () => confirmRemovePlan(index),
    });
  };

  const openFullScreen = (imageSrc) => {
    setFullScreenImage(imageSrc);
  };

  const closeFullScreen = () => {
    setFullScreenImage(null);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0].offsetWidth + 24;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  if (loading)
    return (
      <div className="loading-spinner">
        <FaSpinner className="spin" size={40} />
        <p>Loading floors plans...</p>
      </div>
    );

  const handlePriceChange = (field, value) => {
    // remove commas before storing
    const rawValue = value.replace(/,/g, "");

    if (!isNaN(rawValue) && rawValue !== "") {
      setCurrentPlan((prev) => {
        const updatedPlan = { ...prev, [field]: rawValue };
        validatePlan(updatedPlan);
        return updatedPlan;
      });
    } else {
      // empty or invalid
      setCurrentPlan((prev) => {
        const updatedPlan = { ...prev, [field]: "" };
        validatePlan(updatedPlan);
        return updatedPlan;
      });
    }
  };

  const canEdit = user && ["admin", "superAdmin"].includes(user.role);

  const filteredPlans = Array.isArray(floorPlans)
    ? floorPlans.filter(
        (plan) => currentBhk === "All" || plan.bhk === currentBhk
      )
    : [];

  return (
    <div className="floor-plans-component">
      <div className="container">
        <div className="section-header">
          <h2>Unit Floor Plans</h2>
          <p>
            Explore our thoughtfully designed floor plans that maximize space
            and comfort
          </p>
          {canEdit && Array.isArray(floorPlans) && floorPlans.length !== 0 && (
            <button
              className="edit-button"
              onClick={() => openModal()}
              disabled={saving}
            >
              <FaPlus /> Add New Plan
            </button>
          )}
        </div>

        {Array.isArray(floorPlans) && floorPlans.length > 0 ? (
          <>
            {Array.isArray(unitTypes) && unitTypes.length > 0 && (
              <div className="unit-type-filters">
                {unitTypes.map((type, index) => (
                  <button
                    key={index}
                    onClick={() => handleBhk(type)}
                    className={`filter-button ${
                      currentBhk === type ? "active" : ""
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}

            <div className="view-mode">
              <div className="scrollable-content-wrapper">
                <div className="floor-plans-grid" ref={scrollRef}>
                  {filteredPlans.map((plan, index) => (
                    <div key={index} className="floor-plan-display">
                      <div className="plan-image-container">
                        {plan.image ? (
                          <>
                            <img
                              src={plan.image}
                              alt={`Floor plan ${index + 1}`}
                              onClick={() => openFullScreen(plan.image)}
                            />
                            <button
                              className="expand-button"
                              onClick={() => openFullScreen(plan.image)}
                            >
                              <FaExpand />
                            </button>
                          </>
                        ) : (
                          <div className="no-image">
                            <img
                              src="https://placehold.co/400x200/e0e0e0/ffffff?text=No+Image"
                              alt="No image available"
                            />
                          </div>
                        )}
                      </div>

                      <div className="plan-details">
                        <div className="plan-details-header">
                          <h3>
                            {plan.type} - {plan.bhk}
                          </h3>
                          {user &&
                            ["admin", "superAdmin"].includes(user.role) && (
                              <div className="plan-actions">
                                <button
                                  onClick={() => openModal(plan, index)}
                                  className="btn-icon"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => removeFloorPlan(index)}
                                  className="btn-icon btn-remove"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            )}
                        </div>

                        <div className="area-bathroom-row">
                          <div className="detail-item">
                            <FaBed className="icon-fa" size={18} />
                            <div className="name-flex">
                              <span className="name">Bedrooms</span>
                              <span className="value">{plan.bedrooms}</span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <FaShower className="icon-fa" size={18} />
                            <div className="name-flex">
                              <span className="name">Bathrooms</span>
                              <span className="value">{plan.bathrooms}</span>
                            </div>
                          </div>
                        </div>

                        <div className="area-bathroom-row">
                          <div className="detail-item">
                            <FaVectorSquare className="icon-fa" size={18} />
                            <div className="name-flex">
                              <span className="name">Super Area</span>
                              <span className="value">
                                {plan.superArea} {plan.areaUnit}
                              </span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <FaVectorSquare className="icon-fa" size={18} />
                            <div className="name-flex">
                              <span className="name">Carpet Area</span>
                              <span className="value">
                                {plan.carpetArea} {plan.areaUnit}
                              </span>
                            </div>
                          </div>
                        </div>

                        {plan.price && (
                          <div className="detail-row price-range-row">
                            <span className="label">Sale Price:</span>
                            <span className="value">
                              ₹
                              {new Intl.NumberFormat("en-IN").format(
                                plan.price
                              )}
                            </span>
                          </div>
                        )}

                        {plan.additional && plan.additional.length > 0 && (
                          <div className="detail-row additional-features-row">
                            <span className="label">Add. Rooms:</span>
                            <div className="value-container">
                              {plan.additional.map((feature, idx) => (
                                <span key={idx} className="value feature-pill">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="scroll-div">
                {showScrollButtons.left && (
                  <button
                    className="scroll-button prev"
                    onClick={() => scroll("left")}
                  >
                    <FaChevronLeft />
                  </button>
                )}
                {showScrollButtons.right && (
                  <button
                    className="scroll-button next"
                    onClick={() => scroll("right")}
                  >
                    <FaChevronRight />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : user && ["admin", "superAdmin"].includes(user.role) ? (
          <div className="no-details-container">
            <button className="no-details" onClick={() => openModal()}>
              <FaPlus /> <span className="no-details-text">Add New Plan</span>
            </button>
          </div>
        ) : (
          <div className="no-details">
            <p>No floor plans available.</p>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>
                  {currentIndex !== null
                    ? "Edit Floor Plan"
                    : "Add New Floor Plan"}
                </h3>
                <button onClick={closeModal} className="btn-close">
                  &times;
                </button>
              </div>

              {currentPlan && (
                <div className="modal-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="type">Type *</label>
                      <select
                        id="type"
                        value={currentPlan.type}
                        onChange={(e) =>
                          handleInputChange("type", e.target.value)
                        }
                      >
                        {typeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="bhk">BHK *</label>
                      <select
                        id="bhk"
                        value={currentPlan.bhk}
                        onChange={(e) =>
                          handleInputChange("bhk", e.target.value)
                        }
                      >
                        {bhkOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="bedrooms">Bedrooms *</label>
                      <select
                        id="bedrooms"
                        value={currentPlan.bedrooms}
                        onChange={(e) =>
                          handleInputChange("bedrooms", e.target.value)
                        }
                      >
                        {bedroomOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="bathrooms">Bathrooms *</label>
                      <select
                        id="bathrooms"
                        value={currentPlan.bathrooms}
                        onChange={(e) =>
                          handleInputChange("bathrooms", e.target.value)
                        }
                      >
                        {bathroomOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      {/* <label>Area Details</label> */}
                      <div className="area-input-group">
                        <div className="area-input">
                          <label htmlFor="superArea" className="label-area">
                            Super Area
                          </label>
                          <input
                            id="superArea"
                            type="number"
                            value={currentPlan.superArea}
                            onChange={(e) =>
                              handleInputChange("superArea", e.target.value)
                            }
                            placeholder="Super area"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        <div className="area-input">
                          <label htmlFor="carpetArea" className="label-area">
                            Carpet Area
                          </label>
                          <input
                            id="carpetArea"
                            type="number"
                            value={currentPlan.carpetArea}
                            onChange={(e) =>
                              handleInputChange("carpetArea", e.target.value)
                            }
                            placeholder="Carpet area"
                            min="0"
                            step="0.1"
                            className={errors.carpetArea ? "error" : ""}
                          />
                        </div>
                        <div className="area-unit-select">
                          <label className="label-area">Unit</label>
                          <select
                            value={currentPlan.areaUnit}
                            onChange={(e) =>
                              handleInputChange("areaUnit", e.target.value)
                            }
                          >
                            {areaUnitOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {errors.carpetArea && (
                        <p className="error-message">{errors.carpetArea}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="price">Sale Price</label>
                      <input
                        id="price"
                        type="text"
                        value={formatIndianNumber(currentPlan.price)}
                        onChange={(e) =>
                          handlePriceChange("price", e.target.value)
                        }
                        placeholder="Enter price"
                      />
                      {currentPlan.price && (
                        <p className="price-in-words">
                          {numberToWords(parseInt(currentPlan.price))} Only
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="form-group full-width addRoom">
                    <label>Additional Rooms</label>
                    <div className="checkbox-grid">
                      {additionalOptions.map((option) => (
                        <label key={option} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={currentPlan.additional.includes(option)}
                            onChange={(e) =>
                              handleAdditionalChange(option, e.target.checked)
                            }
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group full-width addRoom">
                    <label>Floor Plan Image</label>
                    <div className="image-upload-container">
                      {currentPlan.image ? (
                        <div className="image-preview">
                          {isUploading && (
                            <div className="upload-overlay">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Uploading...
                            </div>
                          )}
                          <img
                            src={currentPlan.image}
                            alt="Floor plan preview"
                          />
                          <button
                            className="btn-change-image"
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                            disabled={isUploading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Change Image
                          </button>
                        </div>
                      ) : (
                        <div
                          className="upload-placeholder"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                        >
                          {isUploading ? (
                            <div className="upload-loader">
                              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                              <span>Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-gray-400 mb-2" />
                              <span>Select Image</span>
                            </>
                          )}
                        </div>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden-input"
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                </div>
              )}
              {errors.required && (
                <p className="error-message">{errors.required}</p>
              )}
              <div className="modal-footer">
                <button
                  className="btn-cancel"
                  onClick={closeModal}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  className="btn-save"
                  onClick={saveChangesAndPersist}
                  disabled={
                    saving || Object.keys(errors).length > 0 || isUploading
                  }
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <FaSave /> Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {fullScreenImage && (
          <div className="full-screen-modal-overlay" onClick={closeFullScreen}>
            <div
              className="full-screen-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="full-screen-close-button"
                onClick={closeFullScreen}
              >
                <FaTimes />
              </button>
              <img src={fullScreenImage} alt="Full screen floor plan" />
            </div>
          </div>
        )}

        {popup.isOpen && (
          <div className="popup-overlay">
            <div className={`popup-content ${popup.type}`}>
              <div className="popup-icon">
                {popup.type === "success" && <FaCheckCircle />}
                {popup.type === "error" && <FaExclamationCircle />}
                {popup.type === "confirm" && <FaExclamationCircle />}
              </div>
              <div className="popup-message">
                <p>{popup.message}</p>
              </div>
              <div className="popup-actions">
                {popup.type === "confirm" && (
                  <>
                    <button
                      className="btn-cancel"
                      onClick={() =>
                        setPopup({ isOpen: false, message: "", type: "" })
                      }
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-confirm"
                      onClick={() => {
                        if (popup.onConfirm) {
                          popup.onConfirm();
                        }
                        setPopup({ isOpen: false, message: "", type: "" });
                      }}
                    >
                      Confirm
                    </button>
                  </>
                )}
                {(popup.type === "success" || popup.type === "error") && (
                  <button
                    className="btn-close-popup"
                    onClick={() =>
                      setPopup({ isOpen: false, message: "", type: "" })
                    }
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ContactSection = ({ societyId }) => {
  const { user } = useAuthContext();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    manager: { name: "", mobile: "", email: "" },
    maintenance: { companyName: "", landline: "", phone: "", email: "" },
    otherContacts: [{ phone: "", email: "" }],
  });

  // Refs
  const managerNameRef = useRef(null);
  const managerMobileRef = useRef(null);
  const managerEmailRef = useRef(null);
  const maintenanceCompanyRef = useRef(null);
  const maintenanceLandlineRef = useRef(null);
  const maintenancePhoneRef = useRef(null);
  const maintenanceEmailRef = useRef(null);
  const otherContactsRefs = useRef([
    { phone: React.createRef(), email: React.createRef() },
  ]);

  // Format phone for display
  const formatPhoneForDisplay = (phone) => {
    if (!phone) return "";
    return phone.replace(/^\+91/, "");
  };

  // Format phone for storage
  const formatPhoneForStorage = (phone) => {
    if (!phone) return "";
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length === 10) return `+91${digitsOnly}`;
    return phone.startsWith("+91") ? phone : `+91${digitsOnly}`;
  };

  // Fetch society info
  useEffect(() => {
    const fetchSocietyInfo = async () => {
      try {
        const docRef = doc(
          projectFirestore,
          "m_societies",
          societyId,
          "society_information",
          "contact_info"
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() || {};

          const managerMobile =
            data.manager?.mobiles?.[0] || data.manager?.mobile || "";
          const managerEmail =
            data.manager?.emails?.[0] || data.manager?.email || "";
          const maintenancePhone =
            data.maintenance?.phones?.[0] || data.maintenance?.phone || "";
          const maintenanceEmail =
            data.maintenance?.emails?.[0] || data.maintenance?.email || "";

          let otherContacts =
            Array.isArray(data.otherContacts) && data.otherContacts.length > 0
              ? data.otherContacts.map((c) => ({
                  phone: formatPhoneForDisplay(c.phone || ""),
                  email: c.email || "",
                }))
              : [{ phone: "", email: "" }];

          setFormData({
            manager: {
              name: data.manager?.name || "",
              mobile: formatPhoneForDisplay(managerMobile),
              email: managerEmail,
            },
            maintenance: {
              companyName: data.maintenance?.companyName || "",
              landline: data.maintenance?.landline || "",
              phone: formatPhoneForDisplay(maintenancePhone),
              email: maintenanceEmail,
            },
            otherContacts,
          });

          // sync refs
          otherContactsRefs.current = otherContacts.map(() => ({
            phone: React.createRef(),
            email: React.createRef(),
          }));
        } else {
          console.log("No such document for societyId:", societyId);
        }
      } catch (error) {
        console.error("Error fetching society info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (societyId) fetchSocietyInfo();
  }, [societyId]);

  const handleInputChange = (e, section, field, index = null) => {
    const value = e.target.value;

    // phone/landline only allow digits max 10
    if (["mobile", "phone", "landline"].includes(field)) {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        if (section === "otherContacts" && index !== null) {
          setFormData((prev) => {
            const newContacts = [...prev.otherContacts];
            newContacts[index][field] = digitsOnly;
            return { ...prev, otherContacts: newContacts };
          });
        } else {
          setFormData((prev) => ({
            ...prev,
            [section]: { ...prev[section], [field]: digitsOnly },
          }));
        }
      }
      return;
    }

    // other contacts email
    if (section === "otherContacts" && index !== null) {
      setFormData((prev) => {
        const newContacts = [...prev.otherContacts];
        newContacts[index][field] = value;
        return { ...prev, otherContacts: newContacts };
      });
      return;
    }

    // default
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const addOtherContact = () => {
    setFormData((prev) => ({
      ...prev,
      otherContacts: [...prev.otherContacts, { phone: "", email: "" }],
    }));
    otherContactsRefs.current.push({
      phone: React.createRef(),
      email: React.createRef(),
    });
  };

  const removeOtherContact = (index) => {
    if (formData.otherContacts.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      otherContacts: prev.otherContacts.filter((_, i) => i !== index),
    }));
    otherContactsRefs.current.splice(index, 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = {
        manager: {
          name: formData.manager.name,
          mobiles: formData.manager.mobile
            ? [formatPhoneForStorage(formData.manager.mobile)]
            : [],
          emails: formData.manager.email ? [formData.manager.email] : [],
        },
        maintenance: {
          companyName: formData.maintenance.companyName,
          landline: formData.maintenance.landline,
          phones: formData.maintenance.phone
            ? [formatPhoneForStorage(formData.maintenance.phone)]
            : [],
          emails: formData.maintenance.email
            ? [formData.maintenance.email]
            : [],
        },
        otherContacts: formData.otherContacts
          .filter((c) => c.phone || c.email)
          .map((c) => ({
            phone: c.phone ? formatPhoneForStorage(c.phone) : "",
            email: c.email || "",
          })),
      };

      const docRef = doc(
        projectFirestore,
        "m_societies",
        societyId,
        "society_information",
        "contact_info"
      );
      await setDoc(docRef, dataToSave, { merge: true });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating society info:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasContactData = () =>
    formData.manager.name ||
    formData.manager.mobile ||
    formData.manager.email ||
    formData.maintenance.companyName ||
    formData.maintenance.landline ||
    formData.maintenance.phone ||
    formData.maintenance.email ||
    formData.otherContacts.some((c) => c.phone || c.email);

  const formatDisplayPhone = (phone) => {
    if (!phone) return "Not specified";
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length === 10) return `+91${digitsOnly}`;
    return phone.startsWith("+91") ? phone : `+91${phone}`;
  };

  const handleFocus = (ref) => {
    if (ref?.current) {
      setTimeout(() => {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  };

  if (loading) return <div className="society-info-loading">Loading...</div>;

  const otherContacts = Array.isArray(formData.otherContacts)
    ? formData.otherContacts
    : [{ phone: "", email: "" }];

  return (
    <>
      {user && ["admin", "superAdmin"].includes(user.role) ? (
        <section className="contact-section">
          <div className="container">
            <div className="section-header">
              <h2>Society Contact Information</h2>
              <p>
                Get in touch with our management team for any queries or
                assistance
              </p>
              {!editMode && hasContactData() && (
                <button
                  className="edit-button"
                  onClick={() => setEditMode(true)}
                >
                  <FaEdit />
                  Edit
                </button>
              )}
            </div>

            {/* Edit Form Modal */}
            {editMode && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>Edit Contact Information</h3>
                    <button
                      className="modal-close"
                      onClick={() => setEditMode(false)}
                      disabled={isSaving}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="modal-body">
                    <form onSubmit={handleSubmit} className="society-info-form">
                      {/* Society Manager Form */}
                      <div className="profile-section">
                        <h3>Society Manager</h3>
                        <div className="form-group">
                          <label>Name:</label>
                          <input
                            ref={managerNameRef}
                            type="text"
                            name="name"
                            value={formData.manager.name}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[A-Za-z\s]*$/.test(value)) {
                                handleInputChange(e, "manager", "name");
                              }
                            }}
                            onFocus={() => handleFocus(managerNameRef)}
                            placeholder="Enter name"
                            disabled={isSaving}
                          />
                        </div>

                        <div className="contact-grid">
                          <div className="form-group">
                            <label>Mobile Number:</label>
                            <div className="phone-input-container">
                              <span className="phone-prefix">+91</span>
                              <input
                                ref={managerMobileRef}
                                type="tel"
                                name="value"
                                value={formData.manager.mobile}
                                onChange={(e) =>
                                  handleInputChange(e, "manager", "mobile")
                                }
                                onFocus={() => handleFocus(managerMobileRef)}
                                placeholder="Enter mobile number"
                                disabled={isSaving}
                                maxLength={10}
                                pattern="[0-9]{10}"
                                title="Please enter a 10-digit mobile number"
                              />
                            </div>
                            <span className="input-info">
                              10-digit mobile number
                            </span>
                          </div>

                          <div className="form-group">
                            <label>Email Address:</label>
                            <input
                              ref={managerEmailRef}
                              type="email"
                              name="email"
                              value={formData.manager.email}
                              onChange={(e) =>
                                handleInputChange(e, "manager", "email")
                              }
                              onFocus={() => handleFocus(managerEmailRef)}
                              placeholder="Enter email"
                              disabled={isSaving}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Maintenance Company Form */}
                      <div className="profile-section">
                        <h3>Maintenance Company</h3>
                        <div className="form-group">
                          <label>Company Name:</label>
                          <input
                            ref={maintenanceCompanyRef}
                            type="text"
                            name="companyName"
                            value={formData.maintenance.companyName}
                            onChange={(e) =>
                              handleInputChange(e, "maintenance", "companyName")
                            }
                            onFocus={() => handleFocus(maintenanceCompanyRef)}
                            placeholder="Enter company name"
                            disabled={isSaving}
                          />
                        </div>

                        <div className="contact-grid">
                          <div className="form-group">
                            <label>Landline Number:</label>
                            <div className="phone-input-container">
                              <input
                                ref={maintenanceLandlineRef}
                                type="tel"
                                name="landline"
                                value={formData.maintenance.landline}
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    "maintenance",
                                    "landline"
                                  )
                                }
                                onFocus={() =>
                                  handleFocus(maintenanceLandlineRef)
                                }
                                placeholder="Enter landline number"
                                disabled={isSaving}
                                maxLength={10}
                                pattern="[0-9]{1,10}" // ✅ allows 1 to 10 digits
                                title="Please enter up to a 10-digit landline number"
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Phone Number:</label>
                            <div className="phone-input-container">
                              <span className="phone-prefix">+91</span>
                              <input
                                ref={maintenancePhoneRef}
                                type="tel"
                                name="value"
                                value={formData.maintenance.phone}
                                onChange={(e) =>
                                  handleInputChange(e, "maintenance", "phone")
                                }
                                onFocus={() => handleFocus(maintenancePhoneRef)}
                                placeholder="Enter phone number"
                                disabled={isSaving}
                                maxLength={10}
                                pattern="[0-9]{10}"
                                title="Please enter a 10-digit phone number"
                              />
                            </div>
                            <span className="input-info">
                              10-digit phone number
                            </span>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Email Address:</label>
                          <input
                            ref={maintenanceEmailRef}
                            type="email"
                            name="email"
                            value={formData.maintenance.email}
                            onChange={(e) =>
                              handleInputChange(e, "maintenance", "email")
                            }
                            onFocus={() => handleFocus(maintenanceEmailRef)}
                            placeholder="Enter email"
                            disabled={isSaving}
                          />
                        </div>
                      </div>

                      {/* Other Contacts Form */}
                      <div className="profile-section">
                        <h3>Other Contacts</h3>
                        {otherContacts.map((contact, index) => (
                          <div key={index} className="contact-grid">
                            <div className="form-group">
                              <label>Phone Number:</label>
                              <div className="phone-input-container">
                                <span className="phone-prefix">+91</span>
                                <input
                                  ref={otherContactsRefs.current[index]?.phone}
                                  type="tel"
                                  name="value"
                                  value={contact.phone}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      "otherContacts",
                                      "phone",
                                      index
                                    )
                                  }
                                  onFocus={() =>
                                    handleFocus(
                                      otherContactsRefs.current[index]?.phone
                                    )
                                  }
                                  placeholder="Enter phone number"
                                  disabled={isSaving}
                                  maxLength={10}
                                  pattern="[0-9]{10}"
                                  title="Please enter a 10-digit phone number"
                                />
                              </div>
                              <span className="input-info">
                                10-digit phone number
                              </span>
                            </div>

                            <div className="form-group">
                              <label>Email Address:</label>
                              <input
                                ref={otherContactsRefs.current[index]?.email}
                                type="email"
                                name="email"
                                value={contact.email}
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    "otherContacts",
                                    "email",
                                    index
                                  )
                                }
                                onFocus={() =>
                                  handleFocus(
                                    otherContactsRefs.current[index]?.email
                                  )
                                }
                                placeholder="Enter email"
                                disabled={isSaving}
                              />
                            </div>

                            {otherContacts.length > 1 && (
                              <div className="form-group full-width">
                                <button
                                  type="button"
                                  className="remove-field-btn"
                                  onClick={() => removeOtherContact(index)}
                                  disabled={isSaving}
                                >
                                  <FaTimes /> Remove Contact
                                </button>
                              </div>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          className="add-field-btn"
                          onClick={addOtherContact}
                          disabled={isSaving}
                        >
                          <FaPlus /> Add Another Contact
                        </button>
                      </div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="cancel-button"
                          disabled={isSaving}
                        >
                          <FaTimes /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="save-button"
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <FaSpinner className="spinner" /> Saving...
                            </>
                          ) : (
                            <>
                              <FaSave /> Save
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Display Contact Information */}
            {hasContactData() ? (
              <div className="contact-display">
                <div className="contact-row">
                  {/* Society Manager */}
                  <div className="contact-section-display">
                    <div className="card-header">
                      <h3 className=" card-title">
                        {" "}
                        <User className="icon" /> Society Manager
                      </h3>
                    </div>
                    <div className="contact-details-grid">
                      <div className="contact-detail">
                        <strong>Name:</strong>{" "}
                        {formData.manager.name || "Not specified"}
                      </div>
                      <div className="contact-detail">
                        <strong>Mobile:</strong>{" "}
                        {formData.manager.mobile
                          ? formatDisplayPhone(formData.manager.mobile)
                          : "Not specified"}
                      </div>
                      <div className="contact-detail">
                        <strong>Email:</strong>{" "}
                        {formData.manager.email || "Not specified"}
                      </div>
                    </div>
                  </div>

                  {/* Maintenance Company */}
                  <div className="contact-section-display">
                    <div className="card-header">
                      <h3 className="card-title">
                        {" "}
                        <Building className="icon" /> Maintenance Company
                      </h3>
                    </div>
                    <div className="contact-details-grid">
                      <div className="contact-detail">
                        <strong>Company Name:</strong>{" "}
                        {formData.maintenance.companyName || "Not specified"}
                      </div>
                      <div className="contact-detail">
                        <strong>Landline:</strong>{" "}
                        {formData.maintenance.landline || "Not specified"}
                      </div>
                      <div className="contact-detail">
                        <strong>Phone:</strong>{" "}
                        {formData.maintenance.phone
                          ? formatDisplayPhone(formData.maintenance.phone)
                          : "Not specified"}
                      </div>
                      <div className="contact-detail">
                        <strong>Email:</strong>{" "}
                        {formData.maintenance.email || "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Contacts */}
                {otherContacts.some(
                  (contact) => contact.phone || contact.email
                ) && (
                  <div className="contact-row">
                    <div className="contact-section-display pair-height full-width">
                      <h3>Other Contacts</h3>
                      <div className="contact-details-others">
                        {otherContacts.map(
                          (contact, index) =>
                            (contact.phone || contact.email) && (
                              <div key={index} className="contact-pair">
                                <div className="contact-detail">
                                  <strong>Phone {index + 1}:</strong>{" "}
                                  {contact.phone ? (
                                    <span>
                                      {" "}
                                      {formatDisplayPhone(contact.phone)}{" "}
                                    </span>
                                  ) : (
                                    "Not specified"
                                  )}
                                </div>
                                <div className="contact-detail">
                                  <strong>Email {index + 1}:</strong>{" "}
                                  {contact.email || "Not specified"}
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button className="no-details" onClick={() => setEditMode(true)}>
                <FaPlus />{" "}
                <span className="no-details-text">
                  Click Here to Upload Details
                </span>
              </button>
            )}
          </div>
        </section>
      ) : null}
    </>
  );
};

const SocietyLayoutSection = ({ societyId, title, subtitle }) => {
  const { user } = useAuthContext();
  const [layoutImage, setLayoutImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ new state

  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "",
    onConfirm: null,
  });

  const isFirebaseAvailable = projectFirestore && projectStorage;

  const layoutDocRef =
    isFirebaseAvailable && societyId
      ? doc(
          projectFirestore,
          "m_societies",
          societyId,
          "society_information",
          "layout"
        )
      : null;

  useEffect(() => {
    let isMounted = true; // ✅ prevent state update if unmounted

    const fetchLayoutImage = async () => {
      if (!layoutDocRef || !societyId) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        if (isMounted) setLoading(true);
        const docSnap = await getDoc(layoutDocRef);
        if (docSnap.exists() && isMounted) {
          const layoutData = docSnap.data();
          setLayoutImage(layoutData.imageUrl || "");
        }
      } catch (error) {
        console.error("Error fetching layout image:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (isFirebaseAvailable) {
      fetchLayoutImage();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false; // cleanup
    };
  }, [societyId, isFirebaseAvailable]);

  // Trigger file input when user clicks upload button with no image
  useEffect(() => {
    if (editMode && !layoutImage && !tempImage) {
      document.getElementById("layout-image-input").click();
    }
  }, [editMode, layoutImage, tempImage]);

  // Handle escape key to exit full screen
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && fullScreenMode) {
        setFullScreenMode(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [fullScreenMode]);

  const handleEditClick = () => {
    if (!isFirebaseAvailable) {
      setPopup({
        isOpen: true,
        message:
          "Firebase services are not available. Please check your configuration.",
        type: "error",
      });
      return;
    }
    setEditMode(true);
    setTempImage(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setTempImage(null);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setPopup({
          isOpen: true,
          message: "Please select a valid image file.",
          type: "error",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setPopup({
          isOpen: true,
          message: "Image size should be less than 5MB.",
          type: "error",
        });
        return;
      }

      setTempImage(file);
    }
  };

  const handleSave = async () => {
    if (!tempImage || !isFirebaseAvailable || !societyId) return;

    setUploading(true);

    try {
      // Delete old image if exists
      if (layoutImage) {
        try {
          const oldImageRef = ref(projectStorage, layoutImage);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.warn("Could not delete old image:", error);
          // Continue with upload even if deletion fails
        }
      }

      // Upload new image
      const fileName = `layout-${Date.now()}-${tempImage.name}`;
      const imageRef = ref(
        projectStorage,
        `society_layouts/${societyId}/${fileName}`
      );

      const uploadTask = uploadBytesResumable(imageRef, tempImage);

      const downloadURL = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
        );
      });

      // Save to Firestore
      if (layoutDocRef) {
        await setDoc(layoutDocRef, { imageUrl: downloadURL }, { merge: true });
      }

      setLayoutImage(downloadURL);
      setEditMode(false);
      setTempImage(null);

      setPopup({
        isOpen: true,
        message: "Layout image updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error uploading layout image:", error);
      setPopup({
        isOpen: true,
        message: "Failed to upload layout image. Please try again.",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!layoutImage || !isFirebaseAvailable) return;

    setPopup({
      isOpen: true,
      message: "Are you sure you want to delete the layout image?",
      type: "confirm",
      onConfirm: async () => {
        try {
          // Delete from Firebase Storage
          const imageRef = ref(projectStorage, layoutImage);
          await deleteObject(imageRef);

          // Remove from Firestore
          if (layoutDocRef) {
            await setDoc(layoutDocRef, { imageUrl: "" }, { merge: true });
          }

          setLayoutImage("");
          setEditMode(false);

          setPopup({
            isOpen: true,
            message: "Layout image deleted successfully.",
            type: "success",
          });
        } catch (error) {
          console.error("Error deleting layout image:", error);
          setPopup({
            isOpen: true,
            message: "Failed to delete layout image. Please try again.",
            type: "error",
          });
        }
      },
    });
  };

  const handleFullScreenToggle = () => {
    setFullScreenMode(!fullScreenMode);
  };

  const canEdit = user && ["admin", "superAdmin"].includes(user.role);

  return (
    <>
      <section className="society-layout-section">
        <div className="container">
          <div className="society-layout-section__header">
            <h2>{"Society Layout"}</h2>
            <p>{subtitle}</p>

            {canEdit && layoutImage && !editMode && (
              <button className="edit-button" onClick={handleEditClick}>
                <FaEdit /> Change
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-spinner">
              <FaSpinner className="spin" size={40} />
              <p>Loading layout...</p>
            </div>
          ) : !isFirebaseAvailable ? (
            <div className="no-layout-image">
              <FaExclamationTriangle size={64} />
              <p>
                Firebase services are not available. Please check your
                configuration.
              </p>
            </div>
          ) : editMode ? (
            <div className="layout-edit-mode">
              <div className="layout-image-preview">
                {tempImage ? (
                  <img
                    src={URL.createObjectURL(tempImage)}
                    alt="Layout preview"
                  />
                ) : layoutImage ? (
                  <img src={layoutImage} alt="Current layout" />
                ) : (
                  <div className="no-image-preview">
                    <FaImage size={48} />
                    <p>No layout image selected</p>
                  </div>
                )}
              </div>

              <div className="layout-edit-controls">
                {!tempImage && (
                  <label className="upload-layout-btn">
                    <FaUpload />{" "}
                    {layoutImage ? "Replace Image" : "Select Image"}
                    <input
                      id="layout-image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: "none" }}
                    />
                  </label>
                )}

                <div className="layout-action-buttons">
                  <button
                    className="cancel-btn"
                    onClick={handleCancel}
                    disabled={uploading}
                  >
                    Cancel
                  </button>

                  {tempImage && (
                    <button
                      className="save-btn"
                      onClick={handleSave}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Save Changes"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : layoutImage ? (
            <div className="society-layout-section__image">
              <div className="image-container" onClick={handleFullScreenToggle}>
                <img src={layoutImage} alt="Society Layout" />
                <button
                  className="expand-button"
                  onClick={handleFullScreenToggle}
                >
                  <FaExpand />
                </button>
              </div>
            </div>
          ) : canEdit ? (
            <div className="no-layout-image">
              <FaImage size={64} />
              <p>No layout image uploaded yet</p>
              <button className="upload-layout-btn" onClick={handleEditClick}>
                <FaUpload /> Upload Layout Image
              </button>
            </div>
          ) : (
            <div className="no-layout-image">
              <FaImage size={64} />
              <p>No layout image available</p>
            </div>
          )}

          {/* Popup for messages and confirmations */}
          {popup.isOpen && (
            <div className="popup-overlay">
              <div className={`popup-content ${popup.type}`}>
                <div className="popup-icon">
                  {popup.type === "success" && <FaCheckCircle />}
                  {popup.type === "error" && <FaExclamationCircle />}
                  {popup.type === "confirm" && <FaExclamationCircle />}
                </div>
                <div className="popup-message">
                  <p>{popup.message}</p>
                </div>
                <div className="popup-actions">
                  {popup.type === "confirm" && (
                    <>
                      <button
                        className="btn-cancel"
                        onClick={() =>
                          setPopup({ isOpen: false, message: "", type: "" })
                        }
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-confirm"
                        onClick={() => {
                          if (popup.onConfirm) {
                            popup.onConfirm();
                          }
                          setPopup({ isOpen: false, message: "", type: "" });
                        }}
                      >
                        Confirm
                      </button>
                    </>
                  )}
                  {(popup.type === "success" || popup.type === "error") && (
                    <button
                      className="btn-close-popup"
                      onClick={() =>
                        setPopup({ isOpen: false, message: "", type: "" })
                      }
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Full Screen Overlay */}
      {fullScreenMode && (
        <div
          className="full-screen-overlay"
          onClick={() => setFullScreenMode(false)}
        >
          <div
            className="full-screen-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-full-screen"
              onClick={() => setFullScreenMode(false)}
            >
              &times;
            </button>
            <img src={layoutImage} alt="Society Layout Full Screen" />
          </div>
        </div>
      )}
    </>
  );
};

const PGSocietyPage = () => {
  // The 'society' param from the URL is the slug, e.g., "best-12345"
  const { country, state, city, locality, societyName, id } = useParams();

  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch society data from Firestore
  useEffect(() => {
    if (!id) return;
    const unsub = projectFirestore
      .collection("m_societies")
      .doc(id)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            setSociety({ id: doc.id, ...doc.data() });
            setLoading(false);
          } else {
            setError("Society not found");
            setLoading(false);
          }
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    return () => unsub();
  }, [id]);
  const images = [
    "/hero1.jpg",
    "/hero2.jpg",
    "/hero3.jpg",
    "/hero4.jpg",
    "/hero5.jpg",
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  const videos = [
    { id: "abc123", title: "Luxury Apartment Tour", category: "Property Tour" },
    { id: "def456", title: "Project Overview", category: "Overview" },
    { id: "ghi789", title: "Nearby Amenities", category: "Amenities" },
  ];
  return (
    <div className={`${styles.container} society-page-whole-wrapper `}>
      {/* Header Image Slider */}

      {/* <HeroSection societyId={id} /> */}
      <div id="Overview">
        <SocietyDetails
          country={country}
          state={state}
          city={city}
          locality={locality}
          societyId={id}
        />
      </div>
      {/* Sticky Tab Bar */}
      <StickyTabBar />

      {/* Overview Section */}
      <div className={styles.contentWrapper}>
        {/* Available Properties Section */}
        <div id="Available-Properties">
          <PropertiesSection societyName={society.society} />
          {/* <AvailableProperties societyName={society.society} /> */}
        </div>

        {/* Amenities */}
        <div id="Amenities">
          {/* <NewAmenitiesSection /> */}
          <AmenitiesSection societyId={id} />
        </div>

        {/* About Project */}
        <div id="About-Society">
          <AboutSocietySection societyId={id} />
          {/* <ProjectInfo societyId={id} /> */}
        </div>

        {/* Location Advantages */}
        {/* <div id="Nearby-Locations" className="locationAdvantages">
          <LocationAdvantages societyId={id} />
        </div>  */}

        {/* Society Layout */}

        <SocietyLayoutSection
          societyId={id}
          title={society.society}
          subtitle="Discover the master layout of our premium society, thoughtfully designed to create a modern and sustainable lifestyle."
        />

        {/* Floor Plans */}
        <div id="Units-Floor-Plans">
          {/* <FloorPlansSection id="Units-Floor-Plans" societyId={id} /> */}
          {/* className="floorPlansSection"*/}
          <FloorPlans societyId={id} />
        </div>

        {/* Society rate */}
        <div id="Things-to-Know">
          <SocietyRatesSection societyId={id} />
        </div>

        {/* Photo Gallery */}
        <div id="Photo-Gallery" className="gallerySection">
          <GalleryPreview
            societyId={id}
            societyName={society.society}
            societyType={society.societyType}
          />
        </div>

        {/* Meeting Point */}
        <div id="Nearby-Locations">
          <MapLocationSection
            state={state}
            city={city}
            locality={locality}
            address={society.address}
            societyId={id}
          />
          {/* className="meetingPointSection"
          <MeetingPoint state={state} city={city} locality={locality} societyId={id} /> */}
        </div>

        {/* ComponentBuilder */}
        {/* <div id="ComponentBuilder">
          <ComponentBuilder />
        </div> */}

        {/* YouTube Video Slider */}
        <div id="Society-Videos">
          <PropertyVideosSection societyId={id} />
          {/* className="videoSection"
          <YouTubeVideoSlider societyId={id} title="Property Videos" /> */}
        </div>

        {/* Society management info */}
        <ContactSection societyId={id} />
        {/* <div id="Society-Management" className="societyInfoSection">
          <SocietyInfoForm societyId={id} />
        </div> */}

        {/* Things to Know */}
        {/* <div id="Things-to-Know" className="thingsToKnowSection">
          <ThingsToKnow societyId={id} />
        </div> */}

        {/* Reviews and Locality */}
        {/* <ReviewsSection /> */}
        {/* <div id="Ratings-Reviews" className="reviewsSection">
          <ReviewSummary />
        </div> */}

        {/* About Developer */}
        <div id="About-Developer">
          {/* Optional: Add Developer info here */}
        </div>
      </div>
    </div>
  );
};

export default PGSocietyPage;
