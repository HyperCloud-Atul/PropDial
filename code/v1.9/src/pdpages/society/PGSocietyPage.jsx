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
  getDownloadURL,
  deleteObject,
  uploadBytesResumable, // Use uploadBytesResumable for progress tracking
} from "firebase/storage";
import { Link, useParams } from "react-router-dom";
import { projectStorage, projectFirestore } from "../../firebase/config";
import imageCompression from "browser-image-compression";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./PGSociety.scss";
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
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaEdit,
  FaRegHeart,
  FaShareAlt,
  FaRegCalendarAlt,
  FaPlus,
  FaCheck,
  FaMapMarkerAlt,
  FaBatteryFull,
  FaTint,
  FaTools,
  FaBuilding,
  FaVideo,
  FaUpload,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSave,
  FaHome,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { BsFileEarmarkText } from "react-icons/bs";
import { PiBuildingsDuotone } from "react-icons/pi";
import {
  IndianRupee,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  Calendar,
  Building,
  Star,
  Quote,
} from "lucide-react";

const ratingData = {
  average: 4.0,
  totalRatings: "35k",
  distribution: [
    { stars: 5, count: 14000 },
    { stars: 4, count: 6000 },
    { stars: 3, count: 4000 },
    { stars: 2, count: 800 },
    { stars: 1, count: 9000 },
  ],
  aspects: [
    { label: "Cleanliness", value: 4.0 },
    { label: "Safety & Security", value: 4.0 },
    { label: "Staff", value: 4.0 },
    { label: "Amenities", value: 3.5 },
    { label: "Location", value: 3.0 },
  ],
};

const ReviewSummary = () => {
  const maxCount = Math.max(...ratingData.distribution.map((d) => d.count));

  return (
    <div className="review-summary">
      <h2 className="title">Reviews</h2>
      <div className="summary-grid">
        <div className="left">
          <div className="rating-main">{ratingData.average.toFixed(1)}</div>
          <div className="stars">
            {[...Array(5)].map((_, i) => {
              const diff = ratingData.average - i;
              if (diff >= 1) return <FaStar key={i} className="star filled" />;
              else if (diff >= 0.5)
                return <FaStarHalfAlt key={i} className="star filled" />;
              else return <FaRegStar key={i} className="star" />;
            })}
          </div>
          <div className="rating-count">{ratingData.totalRatings} ratings</div>
        </div>

        <div className="right">
          {ratingData.distribution.map((item, i) => (
            <div className="bar-row" key={i}>
              <div className="bar-label">{item.stars}.0</div>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                ></div>
              </div>
              <div className="bar-count">
                {item.count.toLocaleString()} reviews
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="aspect-ratings">
        {ratingData.aspects.map((aspect, i) => (
          <div className="aspect-box" key={i}>
            <span
              className={`aspect-score ${
                aspect.value >= 4
                  ? "green"
                  : aspect.value >= 3.5
                  ? "amber"
                  : "gray"
              }`}
            >
              {aspect.value.toFixed(1)}
            </span>{" "}
            {aspect.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const LocationAdvantages = ({ societyId }) => {
  const [locations, setLocations] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLocation, setNewLocation] = useState({
    place: "",
    distance: "",
    time: "",
  });
  const [tempLocations, setTempLocations] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      if (!societyId) return;

      try {
        const docRef = doc(projectFirestore, "m_societies", societyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().locations) {
          setLocations(docSnap.data().locations);
          setTempLocations(docSnap.data().locations);
        }
      } catch (error) {
        console.error("Error fetching locations: ", error);
      }
    };

    fetchLocations();
  }, [societyId]);

  const handleAddClick = () => {
    setIsAdding(true);
    setTempLocations([...locations]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation({
      ...newLocation,
      [name]: value,
    });
  };

  const handleAddLocation = () => {
    if (newLocation.place && newLocation.distance && newLocation.time) {
      setTempLocations([...tempLocations, newLocation]);
      setNewLocation({
        place: "",
        distance: "",
        time: "",
      });
    }
  };

  const handleRemoveLocation = (index) => {
    const updatedLocations = [...tempLocations];
    updatedLocations.splice(index, 1);
    setTempLocations(updatedLocations);
  };

  const handleSave = async () => {
    if (!societyId) {
      alert("No society ID provided");
      return;
    }

    setIsSaving(true);
    try {
      const docRef = doc(projectFirestore, "m_societies", societyId);

      await updateDoc(docRef, {
        locations: tempLocations,
      });

      setLocations(tempLocations);
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving locations: ", error);
      alert("Failed to save locations. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setTempLocations([...locations]);
  };

  return (
    <div className="location-container">
      <h2 className="section-title">Nearby Locations</h2>

      {!isAdding ? (
        <div className="location-grid">
          {locations.map((item, index) => (
            <div key={index} className="location-card">
              <div className="location-icon">
                <MdCheckCircle />
              </div>
              <div className="location-text">
                <span className="place">{item.place}</span>
                <span className="meta">{`${item.distance} - ${item.time}`}</span>
              </div>
            </div>
          ))}

          <div className="add-location-card" onClick={handleAddClick}>
            <MdAdd size={24} color="#555" />
          </div>
        </div>
      ) : (
        <div>
          <div className="location-grid">
            {tempLocations.map((item, index) => (
              <div key={index} className="location-card">
                <div className="location-icon">
                  <MdCheckCircle />
                </div>
                <div className="location-text">
                  <span className="place">{item.place}</span>
                  <span className="meta">{`${item.distance} - ${item.time}`}</span>
                </div>
                <button
                  onClick={() => handleRemoveLocation(index)}
                  className="remove-button"
                >
                  <MdClose size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="add-location-form">
            <h3>Add New Location</h3>
            <div className="form-grid">
              <div>
                <label>Place Name</label>
                <input
                  type="text"
                  name="place"
                  value={newLocation.place}
                  onChange={handleInputChange}
                  placeholder="e.g. Shopping Mall"
                />
              </div>
              <div>
                <label>Distance</label>
                <input
                  type="text"
                  name="distance"
                  value={newLocation.distance}
                  onChange={handleInputChange}
                  placeholder="e.g. 1.5 km"
                />
              </div>
              <div>
                <label>Time</label>
                <input
                  type="text"
                  name="time"
                  value={newLocation.time}
                  onChange={handleInputChange}
                  placeholder="e.g. 10 mins"
                />
              </div>
            </div>
            <button onClick={handleAddLocation} className="add-button">
              Add Location
            </button>
          </div>

          <div className="action-buttons">
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="save-button"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FloorPlans = ({ societyId }) => {
  // State for floor plans
  const [floorPlans, setFloorPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newUnitType, setNewUnitType] = useState("BHK");
  const [newUnitValue, setNewUnitValue] = useState("1");
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [sizeUnit, setSizeUnit] = useState("Sq-ft");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);

  // Fetch floor plans data
  useEffect(() => {
    const fetchFloorPlans = async () => {
      if (!societyId) return;

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
          const data = docSnap.data();
          setFloorPlans(data.plans || []);
          if (data.plans && data.plans.length > 0) {
            setSelectedPlan(data.plans[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching floor plans:", error);
      }
    };

    fetchFloorPlans();
  }, [societyId]);

  // Add a new unit type
  const addUnitType = () => {
    if (!newUnitType || !newUnitValue || !minSize || !maxSize) return;
    if (parseInt(minSize) < 9) return;
    if (parseInt(maxSize) < parseInt(minSize)) return;

    const newPlan = {
      type: newUnitType,
      value: newUnitValue,
      minSize,
      maxSize,
      sizeUnit,
      images: [],
    };

    const updatedPlans = [...floorPlans, newPlan];
    setFloorPlans(updatedPlans);
    setSelectedPlan(newPlan);
    setNewUnitType("BHK");
    setNewUnitValue("1");
    setMinSize("");
    setMaxSize("");
  };

  // Delete an entire unit type with all its images
  const deleteUnitType = async (index) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this unit type and all its images?`
      )
    )
      return;

    const unitToDelete = floorPlans[index];

    try {
      // First delete all images from Firebase Storage
      await Promise.all(
        unitToDelete.images.map(async (imageUrl) => {
          try {
            const imageRef = ref(projectStorage, imageUrl);
            await deleteObject(imageRef);
          } catch (error) {
            console.error(`Error deleting image ${imageUrl}:`, error);
          }
        })
      );

      // Then remove the unit from Firestore
      const updatedPlans = [...floorPlans];
      updatedPlans.splice(index, 1);

      const docRef = doc(
        projectFirestore,
        "m_societies",
        societyId,
        "society_information",
        "floor_plans"
      );

      await setDoc(docRef, { plans: updatedPlans });

      // Update local state
      setFloorPlans(updatedPlans);
      setSelectedPlan(
        updatedPlans.length > 0
          ? updatedPlans[index] || updatedPlans[updatedPlans.length - 1]
          : null
      );
    } catch (error) {
      console.error("Error deleting unit type:", error);
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  // Upload images to Firebase Storage
  const uploadImages = async () => {
    if (!selectedPlan || selectedImages.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls = [];

      // Upload files sequentially to better track progress
      for (const file of selectedImages) {
        try {
          const timestamp = Date.now();
          const fileName = `${timestamp}-${file.name.replace(/\s+/g, "_")}`; // Replace spaces with underscores
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
                setUploadProgress(progress);
              },
              (error) => {
                console.error("Upload error:", error);
                reject(error);
              },
              async () => {
                try {
                  const url = await getDownloadURL(uploadTask.snapshot.ref);
                  resolve(url);
                } catch (error) {
                  console.error("Error getting download URL:", error);
                  reject(error);
                }
              }
            );
          });

          uploadedUrls.push(downloadURL);
        } catch (error) {
          console.error("Error uploading file:", file.name, error);
          // Continue with next file even if one fails
          continue;
        }
      }

      if (uploadedUrls.length > 0) {
        // Update the selected plan with new images
        const updatedPlans = floorPlans.map((plan) => {
          if (
            plan.type === selectedPlan.type &&
            plan.value === selectedPlan.value
          ) {
            return {
              ...plan,
              images: [...plan.images, ...uploadedUrls],
            };
          }
          return plan;
        });

        setFloorPlans(updatedPlans);
        setSelectedPlan({
          ...selectedPlan,
          images: [...selectedPlan.images, ...uploadedUrls],
        });
        setSelectedImages([]);
      }
    } catch (error) {
      console.error("Error in upload process:", error);
      // Consider showing an error message to the user
    } finally {
      setUploading(false);
    }
  };

  // Save floor plans to Firestore
  const saveFloorPlans = async () => {
    if (!societyId || floorPlans.length === 0) return;

    try {
      const docRef = doc(
        projectFirestore,
        "m_societies",
        societyId,
        "society_information",
        "floor_plans"
      );

      await setDoc(docRef, { plans: floorPlans });
      setEditMode(false);
    } catch (error) {
      console.error("Error saving floor plans:", error);
    }
  };

  // Delete an image
  const deleteImage = async (imageUrl) => {
    if (!selectedPlan) return;

    try {
      // Remove from Firestore first
      const updatedPlans = floorPlans.map((plan) => {
        if (
          plan.type === selectedPlan.type &&
          plan.value === selectedPlan.value
        ) {
          return {
            ...plan,
            images: plan.images.filter((img) => img !== imageUrl),
          };
        }
        return plan;
      });

      setFloorPlans(updatedPlans);
      setSelectedPlan({
        ...selectedPlan,
        images: selectedPlan.images.filter((img) => img !== imageUrl),
      });

      // Delete from Firebase Storage
      const imageRef = ref(projectStorage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Unit Navigation Component
  const UnitNavigation = () => (
    <div className="unit-navigation">
      {floorPlans.map((plan, index) => (
        <div
          key={`${plan.type}-${plan.value}-${index}`}
          className="unit-btn-container"
        >
          <button
            className={`unit-btn ${
              selectedPlan?.type === plan.type &&
              selectedPlan?.value === plan.value
                ? "active"
                : ""
            }`}
            onClick={() => setSelectedPlan(plan)}
          >
            {plan.value} {plan.type}
          </button>
          {editMode && (
            <button
              className="delete-unit-btn"
              onClick={() => deleteUnitType(index)}
              title="Delete this unit type"
            >
              <FaTimes />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="floorplans-container">
      <div className="header-section">
        <h2>Units & Floor Plans</h2>
        {!editMode && (
          <button onClick={() => setEditMode(true)} className="edit-btn">
            <FaEdit /> Edit
          </button>
        )}
      </div>

      {!editMode && floorPlans.length === 0 ? (
        <div className="no-data">
          <p>No floor plans data available</p>
          <button onClick={() => setEditMode(true)} className="edit-btn">
            <FaEdit /> Add Floor Plans
          </button>
        </div>
      ) : editMode ? (
        <div className="edit-mode">
          <UnitNavigation />

          {/* Add New Unit Form */}
          <div className="add-unit-form">
            <h3>Add New Unit Type</h3>
            <div className="form-group">
              <select
                value={newUnitType}
                onChange={(e) => setNewUnitType(e.target.value)}
              >
                <option value="BHK">BHK</option>
                <option value="VSP">VSP</option>
                <option value="RK">RK</option>
              </select>
              <input
                type="text"
                value={newUnitValue}
                onChange={(e) => setNewUnitValue(e.target.value)}
                placeholder="Unit value"
              />
            </div>
            <div className="form-group">
              <select
                value={sizeUnit}
                onChange={(e) => setSizeUnit(e.target.value)}
              >
                <option value="Sq-ft">Sq-ft</option>
                <option value="Sq-m">Sq-m</option>
              </select>
              <input
                type="number"
                min="9"
                value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
                placeholder="Min size"
              />
              <input
                type="number"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                placeholder="Max size"
              />
            </div>
            <button onClick={addUnitType} className="add-btn">
              Add Unit
            </button>
          </div>

          {/* Current Unit Display */}
          {selectedPlan && (
            <div className="current-unit">
              <div className="unit-info">
                <h3>
                  {selectedPlan.value} {selectedPlan.type} -{" "}
                  {selectedPlan.minSize} to {selectedPlan.maxSize}{" "}
                  {selectedPlan.sizeUnit}
                </h3>

                {/* Image Upload */}
                <div className="image-upload">
                  <label className="upload-btn">
                    <FaUpload /> Select Images
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: "none" }}
                    />
                  </label>
                  {selectedImages.length > 0 && (
                    <button
                      onClick={uploadImages}
                      disabled={uploading}
                      className="upload-submit-btn"
                    >
                      {uploading
                        ? `Uploading... ${Math.round(uploadProgress)}%`
                        : "Upload Images"}
                    </button>
                  )}
                </div>
              </div>

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="selected-images">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                      />
                      <button
                        onClick={() =>
                          setSelectedImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Uploaded Images */}
              {selectedPlan.images.length > 0 && (
                <div className="uploaded-images">
                  <h4>Floor Plan Images</h4>
                  <div className="images-grid">
                    {selectedPlan.images.map((img, index) => (
                      <div key={index} className="image-item">
                        <img src={img} alt={`Floor plan ${index}`} />
                        <button onClick={() => deleteImage(img)}>
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <div className="action-buttons">
            <button
              onClick={saveFloorPlans}
              disabled={floorPlans.length === 0}
              className="save-btn"
            >
              <FaSave /> Save Changes
            </button>
            <button onClick={() => setEditMode(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <UnitNavigation />

          {/* Selected Unit Display */}
          {selectedPlan && (
            <div className="unit-display">
              <h3>
                {selectedPlan.value} {selectedPlan.type} -{" "}
                {selectedPlan.minSize} to {selectedPlan.maxSize}{" "}
                {selectedPlan.sizeUnit}
              </h3>

              {selectedPlan.images.length > 0 ? (
                <div className="images-grid">
                  {selectedPlan.images.map((img, index) => (
                    <div key={index} className="image-item">
                      <img src={img} alt={`Floor plan ${index}`} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-images">No images available</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const UnitTypeAnimator = ({ unitTypes = [] }) => {
  const [currentText, setCurrentText] = useState("");
  const [unitIndex, setUnitIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  useEffect(() => {
    if (unitTypes.length === 0) return;

    const typingSpeed = isDeleting ? 50 : 150;
    const pauseDuration = 1000; // pause at full word

    const handleTyping = () => {
      const currentUnit = unitTypes[unitIndex];

      if (!isDeleting && !isPausing) {
        // Typing forward
        if (charIndex < currentUnit.length) {
          setCurrentText(currentUnit.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Finished typing - pause before deleting
          setIsPausing(true);
          setTimeout(() => {
            setIsPausing(false);
            setIsDeleting(true);
          }, pauseDuration);
        }
      } else if (isDeleting) {
        // Deleting
        if (charIndex > 0) {
          setCurrentText(currentUnit.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Finished deleting - move to next word
          setIsDeleting(false);
          setUnitIndex((prev) => (prev + 1) % unitTypes.length);
        }
      }
    };

    const timeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timeout);
  }, [unitTypes, unitIndex, charIndex, isDeleting, isPausing]);

  return (
    <div className="info-card">
      <span className="label">Unit Types</span>
      <div className="value-icon">
        <span className="value">{currentText}</span>
        {/* <span className="cursor">|</span> */}
        <FaBed className="icon" />
      </div>
    </div>
  );
};

const ProjectInfo = ({ societyId }) => {
  const [societyData, setSocietyData] = useState({
    possessionDate: "",
    readyToMove: false,
    description: "",
    launchDate: "",
    totalUnits: "",
    totalTowers: "",
    projectSize: "",
    unitTypes: [], // Array of unit types like ["2BHK", "3BHK"]
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

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // FIX 2: Use the formatAddress function for a clean and consistent location display
  return (
    <div className="project-info-container">
      {/* // */}

      <h1 className="title">About {societyData.society}</h1>

      <p className="subtitle">
        {societyData.description}
        <span className="read-more"> Read More</span>
      </p>

      <button className="edit-btn" onClick={() => setShowEditModal(true)}>
        <FaEdit />
      </button>

      <div className="rera-info">
        <span className="badge">
          {societyData.readyToMove ? "Ready To Move" : "Possession By"}{" "}
        </span>
        <span className="rera-date">
          {societyData.readyToMove
            ? null
            : `${new Date(societyData.launchDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}`}
        </span>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <span className="label">Project Size</span>
          <div className="value-icon">
            <span className="value">{societyData.projectSize} Acre</span>
            <BsFileEarmarkText className="icon" />
          </div>
        </div>

        <div className="info-card">
          <span className="label">Launch Date</span>
          <div className="value-icon">
            <span className="value">
              {societyData.readyToMove
                ? "Ready To Move"
                : `${new Date(societyData.launchDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                    }
                  )}`}
            </span>
            <FaRegCalendarAlt className="icon" />
          </div>
        </div>
        {societyData.totalUnits && (
          <div className="info-card">
            <span className="label">Total Units</span>
            <div className="value-icon">
              <span className="value">{societyData.totalUnits}</span>
              <MdMeetingRoom className="icon" />
            </div>
          </div>
        )}
        {societyData.totalTowers && (
          <div className="info-card">
            <span className="label">Total Towers</span>
            <div className="value-icon">
              <span className="value">{societyData.totalTowers}</span>
              <PiBuildingsDuotone className="icon" />
            </div>
          </div>
        )}

        {Array.isArray(societyData.unitTypes) &&
          societyData.unitTypes.length > 0 && (
            <UnitTypeAnimator unitTypes={societyData.unitTypes} />
          )}
      </div>
      {showEditModal && (
        <EditAbout
          data={societyData}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};


const ContactForm = () => {
  return (
    <div className={styles.section}>
      <h2>Looking for a Property in Assetz Trees and Tandem</h2>
      <form className={styles.contactForm}>
        <input type="text" placeholder="Name" className={styles.inputField} />
        <input type="email" placeholder="Email" className={styles.inputField} />
        <div className={styles.phoneGroup}>
          <select className={styles.countryCode}>
            <option value="IN">IND +91</option>
          </select>
          <input
            type="tel"
            placeholder="Mobile Number"
            className={styles.inputField}
          />
        </div>
        <div className={styles.termsText}>
          I Agree to Propdial'{" "}
          <a href="#" className={styles.link}>
            Terms of Use
          </a>
        </div>
        <button type="submit" className={styles.viewPhoneBtn}>
          View Phone No.
        </button>
      </form>
    </div>
  );
};

const SocietyOverview = ({ country, state, city, locality, societyId }) => {
  const [societyData, setSocietyData] = useState({
    societyType: "Residential",
    society: "New Society",
    builder: "",
    address: "",
    priceFrom: "",
    priceTo: "",
    possessionDate: "",
    readyToMove: false,
    launchDate: "", // Array of unit types like ["2BHK", "3BHK"]
  });
  console.log(country, state, city, locality, societyId);
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

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // FIX 2: Use the formatAddress function for a clean and consistent location display
  const formattedState = formatStateName(state);
  const formattedCity = formatStateName(city);
  const formattedLocality = formatStateName(locality);

  return (
    <div className="overview-section" id="Overview">
      <button className="edit-btn" onClick={() => setShowEditModal(true)}>
        <FaEdit />
      </button>

      <div className="society-header">
        <h1>{societyData.society}</h1>
        <div className="location">
          By <span className="builder-name">{societyData.builder}</span>
        </div>
        <div className="location">
          <FaMapMarkerAlt className="location-icon" /> {formattedLocality},{" "}
          {formattedCity}, {formattedState}
        </div>
      </div>

      {/* The rest of the component remains the same */}

      <div className="possession-status">
        <div className={`checkbox ${societyData.readyToMove ? "checked" : ""}`}>
          {societyData.readyToMove && <FaCheck size={12} />}
        </div>
        <span className={styles.circleIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="11"
              stroke="#00aa6c"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M8 12l2.5 2.5L16 9"
              stroke="#00aa6c"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </span>

        <span>
          {societyData.readyToMove
            ? "Ready To Move"
            : `Possession By ${new Date(
                societyData.launchDate
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}`}
        </span>
        <span className={styles.reraIcon}>R</span>
      </div>

      <div className="price-section">
        <div className="price-range">
          <span className="from">₹ {societyData.priceFrom} Cr</span>
          {" - "}
          <span className="to">₹ {societyData.priceTo} Cr</span>
        </div>
        <div className="bhk">Multiple Type Flats</div>
      </div>

      <button className={styles.contactBtn}>Contact Now</button>

      {showEditModal && (
        <EditModal
          data={societyData}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};


const ThingsToKnow = ({ societyId }) => {
  const [societyData, setSocietyData] = useState({
    electricityRateAuthority: "",
    electricityRatePowerBackup: "",
    waterCharges: "",
    commonAreaMaintenance: "",
    commonAreaElectricity: "",
    clubCharges: "",
  });

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

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="things-to-know">
      <button className="edit-btn" onClick={() => setShowEditModal(true)}>
        <FaEdit />
      </button>
      <h2>Society Rates</h2>
      <div className="info-grid">
        <div className="info-item">
          <FaBolt className="info-icon" />
          <h4>Electricity Rate (Authority)</h4>
          <p>₹{formatRupees(societyData.electricityRateAuthority)}</p>
        </div>
        <div className="info-item">
          <FaBatteryFull className="info-icon" />
          <h4>Electricity Rate (Power Backup)</h4>
          <p>₹{formatRupees(societyData.electricityRatePowerBackup)}</p>
        </div>
        <div className="info-item">
          <FaTint className="info-icon" />
          <h4>Water Charges</h4>
          <p>₹{formatRupees(societyData.waterCharges)}</p>
        </div>
        <div className="info-item">
          <FaTools className="info-icon" />
          <h4>Common Area Maintenance</h4>
          <p>₹{formatRupees(societyData.commonAreaMaintenance)}</p>
        </div>
        <div className="info-item">
          <FaBuilding className="info-icon" />
          <h4>Common Area Electricity</h4>
          <p>₹{formatRupees(societyData.commonAreaElectricity)}</p>
        </div>
        <div className="info-item">
          <FaRegBuilding className="info-icon" />
          <h4>Club Charges</h4>
          <p>₹{formatRupees(societyData.clubCharges)}</p>
        </div>
      </div>
      {showEditModal && (
        <EditRates
          data={societyData}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const MeetingPoint = ({ state, city, locality, societyId }) => {
  const [mapLink, setMapLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempMapLink, setTempMapLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch map link from Firebase
  useEffect(() => {
    const fetchMapLink = async () => {
      if (!societyId) return;

      try {
        const docRef = doc(projectFirestore, "m_societies", societyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().mapLink) {
          setMapLink(docSnap.data().mapLink);
        }
      } catch (error) {
        console.error("Error fetching map link: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapLink();
  }, [societyId]);

  const handleEditClick = () => {
    setTempMapLink(mapLink);
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!tempMapLink) return;

    try {
      const docRef = doc(projectFirestore, "m_societies", societyId);
      await updateDoc(docRef, {
        mapLink: tempMapLink,
      });
      setMapLink(tempMapLink);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving map link: ", error);
      alert("Failed to save map link. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const formattedState = formatStateName(state);
  const formattedCity = formatStateName(city);
  const formattedLocality = formatStateName(locality);

  return (
    <div className="meeting-point-section">
      <div className="section-header">
        <h2>Where we'll meet</h2>
        {!isEditing && (
          <button onClick={handleEditClick} className="edit-button">
            <FaEdit /> Edit Map
          </button>
        )}
      </div>

      <div className="location">
        <FaMapMarkerAlt className="location-icon" /> {formattedLocality},{" "}
        {formattedCity}, {formattedState}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="map-edit-form">
          <div className="form-group">
            <label htmlFor="mapLink">Google Maps Embed Link</label>
            <input
              type="text"
              id="mapLink"
              value={tempMapLink}
              onChange={(e) => setTempMapLink(e.target.value)}
              placeholder="Paste Google Maps embed link here"
              required
            />
            <small className="help-text">
              How to get the embed link: On Google Maps, click "Share" → "Embed
              a map" → Copy the iframe src URL
            </small>
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="save-button">
              <FaSave /> Save
            </button>
          </div>
        </form>
      ) : (
        <div className="map-container">
          {isLoading ? (
            <div className="map-loading">Loading map...</div>
          ) : (
            <iframe
              title="Meeting Point"
              src={
                mapLink ||
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61291.449298734176!2d73.8777386!3d15.5026635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb4fd095d6bff%3A0x427e9f60f589e059!2sViceroy's%20Arch!5e0!3m2!1sen!2sin!4v1694150123456!5m2!1sen!2sin"
              }
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          )}
        </div>
      )}
    </div>
  );
};
const AvailableProperties = ({ societyName }) => {
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // track total in DB
  const [filterPurpose, setFilterPurpose] = useState("Sale");

  const fetchProperties = async () => {
    try {
      // 1️⃣ Get total count
      const totalQuery = query(
        collection(projectFirestore, "properties-propdial"),
        where("society", "==", societyName),
        where("purpose", "==", filterPurpose)
      );
      const totalSnap = await getDocs(totalQuery);
      setTotalCount(totalSnap.size);

      // 2️⃣ Get first 10 properties
      const limitedQuery = query(
        collection(projectFirestore, "properties-propdial"),
        where("society", "==", societyName),
        where("purpose", "==", filterPurpose),
        limit(10)
      );
      const limitedSnap = await getDocs(limitedQuery);
      const data = limitedSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    if (societyName) {
      fetchProperties();
    }
  }, [societyName, filterPurpose]);

  return (
    <div id="Available-Properties" className="propertyTabsWrapper">
      <div className="propertyTabs">
        <div className="tabs">
          <div className="tabsHeader">
            <h1 className="tabH1">Properties in {societyName}</h1>
            <div className="tabButtons">
              <button
                className={filterPurpose === "Sale" ? "activeTab" : ""}
                onClick={() => setFilterPurpose("Sale")}
              >
                Buy
              </button>
              <button
                className={filterPurpose === "Rent" ? "activeTab" : ""}
                onClick={() => setFilterPurpose("Rent")}
              >
                Rent
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="propertyGridContainer">
          <div className="propertyGrid">
            {properties.length > 0 ? (
              <>
                {properties.map((property) => (
                  <Link
                    to={`/propertydetails/${property.id}`}
                    key={property.id}
                    className="propertyLink"
                  >
                    <div className="propertyCard">
                      <img
                        src={
                          property.images?.[0] ||
                          "/assets/img/default-property.jpg"
                        }
                        alt={property.propertyName || "Property"}
                        className="propertyImg"
                      />
                      <div className="cardContent">
                        <h3>
                          ₹{" "}
                          {filterPurpose === "Sale"
                            ? property.demandPriceSale || "N/A"
                            : property.demandPriceRent || "N/A"}
                        </h3>
                        <p>
                          {property.bhk} {property.propertyType} for{" "}
                          {filterPurpose} in {property.society}
                        </p>
                        <button className="outlineBtn">Contact Builder</button>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* See More button if totalCount > 10 */}
                {totalCount > 10 && (
                  <Link to="/all-properties" className="outlineBtn seeMoreBtn">
                    See More
                  </Link>
                )}
              </>
            ) : (
              <p>No properties found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSection = ({ societyId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState(["/hero1.jpg"]); // Default image
  const [viewerOpen, setViewerOpen] = useState(false);
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch image URLs from Firestore
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const docRef = projectFirestore
          .collection("m_societies")
          .doc(societyId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          const data = docSnap.data();
          if (
            data.images &&
            Array.isArray(data.images) &&
            data.images.length > 0
          ) {
            // Use the first 6 images for the slider
            setImages(data.images.slice(0, 6));
            // Store all images for the viewer
            setAllImages(data.images);
          } else {
            // Fallback to default image if no images found
            setImages(["/hero1.jpg"]);
          }
        } else {
          console.log("No such document!");
          setImages(["/hero1.jpg"]);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages(["/hero1.jpg"]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();

    // Alternatively, you can use real-time updates with onSnapshot:
    /*
    const unsubscribe = projectFirestore
      .collection('m_societies')
      .doc(societyId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            setImages(data.images.slice(0, 6));
            setAllImages(data.images);
          }
        }
      });

    return () => unsubscribe();
    */
  }, [societyId]);

  // Auto-slide images
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const viewerGoToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const viewerGoToNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return <div className="video-section loading">Loading images...</div>;
  }

  return (
    <div className="video-section">
      <div className="slider-container">
        <div
          className="slider-wrapper"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="slide">
              <img
                src={img}
                alt={`Slide ${idx + 1}`}
                className="video-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/hero1.jpg";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {allImages.length > 6 && (
        <button className="view-all-btn" onClick={() => setViewerOpen(true)}>
          View All Photos
          {/* ({allImages.length}) */}
        </button>
      )}

      {images.length > 1 && (
        <div className="dots-wrapper">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${currentIndex === idx ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
            ></span>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <>
          <button className="nav-btn prev" onClick={goToPrevious}>
            <FaChevronLeft />
          </button>
          <button className="nav-btn next" onClick={goToNext}>
            <FaChevronRight />
          </button>
        </>
      )}

      {viewerOpen && (
        <div className="image-viewer-overlay">
          <div className="image-viewer-content">
            <button
              className="close-viewer"
              onClick={() => setViewerOpen(false)}
            >
              <FaTimes />
            </button>
            <button className="nav-button prev" onClick={viewerGoToPrevious}>
              <FaChevronLeft />
            </button>
            <img
              src={allImages[currentIndex]}
              alt={`Gallery ${currentIndex}`}
              className="viewer-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/hero1.jpg";
              }}
            />
            <button className="nav-button next" onClick={viewerGoToNext}>
              <FaChevronRight />
            </button>
            <div className="image-counter">
              {currentIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const YouTubeVideoSlider = ({ societyId, title }) => {
  const sliderRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    url: "",
    title: "",
    category: "",
  });
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Fetch videos from Firestore
  useEffect(() => {
    const societyDocRef = doc(projectFirestore, "m_societies", societyId);

    const unsubscribe = onSnapshot(societyDocRef, (doc) => {
      if (doc.exists) {
        // <-- Correct property access
        const data = doc.data();
        setVideos(data?.videos || []);
      } else {
        console.log("No such document!");
        setVideos([]);
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
    handleScroll(); // Initial check

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
    // Handle regular YouTube URLs
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    // Handle YouTube Shorts URLs
    const shortsRegExp = /^.*(youtube.com\/shorts\/)([^#&?]*).*/;
    const shortsMatch = url.match(shortsRegExp);

    if (match && match[2].length === 11) {
      return match[2];
    } else if (shortsMatch && shortsMatch[2].length === 11) {
      return shortsMatch[2];
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoId = extractVideoId(newVideo.url);

    if (!videoId) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    try {
      await projectFirestore
        .collection("m_societies")
        .doc(societyId)
        .update({
          videos: [
            ...videos,
            {
              id: videoId,
              title: newVideo.title,
            },
          ],
        });

      setNewVideo({ url: "", title: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video");
    }
  };

  const handleDeleteVideo = async (index) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const updatedVideos = [...videos];
      updatedVideos.splice(index, 1);

      await projectFirestore
        .collection("m_societies")
        .doc(societyId)
        .update({ videos: updatedVideos });
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video");
    }
  };

  return (
    <div className="yt-slider-container">
      <div className="yt-slider-header">
        <h2 className="yt-slider-title">{title}</h2>
        <button className="yt-add-btn" onClick={() => setShowForm(!showForm)}>
          <FaPlus /> Add Video
        </button>
      </div>

      {showForm && (
        <div className="yt-video-form">
          <button className="yt-close-form" onClick={() => setShowForm(false)}>
            <FaTimes />
          </button>
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
              />
            </div>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={newVideo.title}
                onChange={handleInputChange}
                placeholder="Video title"
                required
              />
            </div>
            {/* <div className="form-group">
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={newVideo.category}
                onChange={handleInputChange}
                placeholder="Video category"
                required
              />
            </div> */}
            <button type="submit" className="yt-submit-btn">
              Add Video
            </button>
          </form>
        </div>
      )}

      <div className="yt-slider-wrapper">
        {showLeftArrow && (
          <button className="yt-slider-btn left" onClick={scrollLeft}>
            <FaChevronLeft />
          </button>
        )}

        <div className="yt-slider" ref={sliderRef}>
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <div className="yt-card" key={index}>
                <div className="yt-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <button
                    className="yt-delete-btn"
                    onClick={() => handleDeleteVideo(index)}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="yt-card-footer">
                  <h3>{video.title}</h3>
                  {/* <span>{video.category}</span> */}
                </div>
              </div>
            ))
          ) : (
            <div className="yt-empty-state">
              <p>No videos added yet</p>
            </div>
          )}
        </div>

        {showRightArrow && videos.length > 0 && (
          <button className="yt-slider-btn right" onClick={scrollRight}>
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

const SocietyInfoForm = ({ societyId }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    manager: {
      name: "",
      designation: "Society Manager",
      mobile: "",
      email: "",
      responseRate: "100%",
      responseTime: "within an hour",
    },
    maintenance: {
      companyName: "",
      contactPerson: "",
      phone: "",
      email: "",
      contractStart: "",
      contractEnd: "",
    },
  });

  // Fetch existing society info
  useEffect(() => {
    const fetchSocietyInfo = async () => {
      try {
        const docRef = doc(projectFirestore, "m_societies", societyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            manager: {
              name: data.manager?.name || "",
              designation: data.manager?.designation || "Society Manager",
              mobile: data.manager?.mobile || "",
              email: data.manager?.email || "",
              responseRate: data.manager?.responseRate || "100%",
              responseTime: data.manager?.responseTime || "within an hour",
            },
            maintenance: {
              companyName: data.maintenance?.companyName || "",
              contactPerson: data.maintenance?.contactPerson || "",
              phone: data.maintenance?.phone || "",
              email: data.maintenance?.email || "",
              contractStart: data.maintenance?.contractStart || "",
              contractEnd: data.maintenance?.contractEnd || "",
            },
          });
        } else {
          console.log("No such document for societyId:", societyId);
        }
      } catch (error) {
        console.error("Error fetching society info:", error);
        // Display a user-friendly message instead of alert()
        // alert('Failed to load society information.');
      } finally {
        setLoading(false);
      }
    };

    fetchSocietyInfo();
  }, [societyId]);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(projectFirestore, "m_societies", societyId);
      await updateDoc(docRef, formData);
      setEditMode(false);
      // alert('Information saved successfully!'); // Use custom modal instead
    } catch (error) {
      console.error("Error updating society info:", error);
      // alert('Failed to save information'); // Use custom modal instead
    }
  };

  if (loading) {
    return <div className="society-info-loading">Loading...</div>;
  }

  return (
    <div className="society-info-container">
      <div className="society-info-header">
        <h2>Society Contacts</h2>
        {!editMode && (
          <button className="edit-btn" onClick={() => setEditMode(true)}>
            Edit
          </button>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit} className="society-info-form">
          {/* Society Manager Form */}
          <div className="profile-section">
            <h3>Society Manager</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.manager.name}
                onChange={(e) => handleInputChange(e, "manager")}
                required
              />
            </div>

            <div className="contact-grid">
              <div className="form-group">
                <label>Mobile:</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.manager.mobile}
                  onChange={(e) => handleInputChange(e, "manager")}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.manager.email}
                  onChange={(e) => handleInputChange(e, "manager")}
                  required
                />
              </div>
            </div>

            <div className="response-info">
              <div className="form-group">
                <label>Response Rate:</label>
                <select
                  name="responseRate"
                  value={formData.manager.responseRate}
                  onChange={(e) => handleInputChange(e, "manager")}
                >
                  <option value="100%">100%</option>
                  <option value="90%">90%</option>
                  <option value="80%">80%</option>
                </select>
              </div>

              <div className="form-group">
                <label>Response Time:</label>
                <select
                  name="responseTime"
                  value={formData.manager.responseTime}
                  onChange={(e) => handleInputChange(e, "manager")}
                >
                  <option value="within an hour">within an hour</option>
                  <option value="within a few hours">within a few hours</option>
                  <option value="within a day">within a day</option>
                </select>
              </div>
            </div>
          </div>

          {/* Maintenance Company Form */}
          <div className="profile-section">
            <h3>Maintenance Company</h3>
            <div className="form-group">
              <label>Company Name:</label>
              <input
                type="text"
                name="companyName"
                value={formData.maintenance.companyName}
                onChange={(e) => handleInputChange(e, "maintenance")}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Person:</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.maintenance.contactPerson}
                onChange={(e) => handleInputChange(e, "maintenance")}
              />
            </div>

            <div className="contact-grid">
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.maintenance.phone}
                  onChange={(e) => handleInputChange(e, "maintenance")}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.maintenance.email}
                  onChange={(e) => handleInputChange(e, "maintenance")}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contract Start:</label>
                <input
                  type="date"
                  name="contractStart"
                  value={formData.maintenance.contractStart}
                  onChange={(e) => handleInputChange(e, "maintenance")}
                />
              </div>
              <div className="form-group">
                <label>Contract End:</label>
                <input
                  type="date"
                  name="contractEnd"
                  value={formData.maintenance.contractEnd}
                  onChange={(e) => handleInputChange(e, "maintenance")}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      ) : (
        <div className="society-info-display">
          {/* Society Manager Card */}
          <div className="society-contact-card manager-card">
            <div className="card-header">
              <h3>{formData.manager.name || "Not specified"}</h3>
              <span className="card-badge">{formData.manager.designation}</span>
            </div>
            {/* You can add more manager details here if needed */}
            <div className="card-footer">
              <button className="contact-btn">
                Contact <FaArrowUpRightFromSquare className="contact-icon" />
              </button>
            </div>
          </div>

          {/* Maintenance Company Card */}
          <div className="society-contact-card maintenance-card">
            <div className="card-header">
              <h3>{formData.maintenance.companyName || "Not specified"}</h3>
              <span className="card-badge">Maintenance Company</span>
            </div>
            <div className="card-dates">
              <div className="date-item">
                <span>Contract Start:</span>
                <span>{formData.maintenance.contractStart || "-"}</span>
              </div>
              <div className="date-item">
                <span>Contract End:</span>
                <span>{formData.maintenance.contractEnd || "-"}</span>
              </div>
            </div>
            <div className="card-footer">
              <button className="contact-btn">
                Contact <FaArrowUpRightFromSquare className="contact-icon" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const amenitiesData = {
  club: [
    {
      title: "Grand Clubhouse",
      image: "/assets/img/society/hero1.jpg",
      description: "Premium clubhouse with lounge and event spaces",
    },
    {
      title: "Banquet Hall",
      image: "/assets/img/society/hero2.jpg",
      description: "Spacious hall for celebrations and gatherings",
    },
    {
      title: "Library",
      image: "/assets/img/society/hero3.jpg",
      description: "Quiet reading space with extensive collection",
    },
    {
      title: "Business Center",
      image: "/assets/img/society/hero4.jpg",
      description: "Professional workspace for residents",
    },
  ],
  sports: [
    {
      title: "Swimming Pool",
      image: "/assets/img/society/hero5.jpg",
      description: "Olympic-size swimming pool with deck area",
    },
    {
      title: "Fitness Center",
      image: "/assets/img/society/hero5.jpg",
      description: "State-of-the-art gym with latest equipment",
    },
    {
      title: "Tennis Court",
      image: "/assets/img/society/hero1.jpg",
      description: "Professional tennis court with night lighting",
    },
    {
      title: "Yoga Studio",
      image: "/assets/img/society/hero2.jpg",
      description: "Serene space for yoga and meditation",
    },
  ],
  children: [
    {
      title: "Kids Play Area",
      image: "/assets/img/society/hero3.jpg",
      description: "Safe and fun playground for children",
    },
    {
      title: "Daycare Center",
      image: "/assets/img/society/hero4.jpg",
      description: "Professional childcare facility",
    },
    {
      title: "Activity Room",
      image: "/assets/img/society/hero5.jpg",
      description: "Indoor activities and learning space",
    },
    {
      title: "Mini Theater",
      image: "/assets/img/society/hero1.jpg",
      description: "Entertainment space for kids and families",
    },
  ],
  security: [
    {
      title: "24/7 Security",
      image: "/assets/img/society/hero2.jpg",
      description: "Round-the-clock security personnel",
    },
    {
      title: "CCTV Surveillance",
      image: "/assets/img/society/hero3.jpg",
      description: "Complete CCTV coverage of premises",
    },
    {
      title: "Access Control",
      image: "/assets/img/society/hero4.jpg",
      description: "Smart card access for residents",
    },
    {
      title: "Fire Safety",
      image: "/assets/img/society/hero5.jpg",
      description: "Advanced fire detection and safety systems",
    },
  ],
  general: [
    {
      title: "Landscaped Gardens",
      image: "/assets/img/society/hero1.jpg",
      description: "Beautifully maintained green spaces",
    },
    {
      title: "Power Backup",
      image: "/assets/img/society/hero3.jpg",
      description: "100% power backup for all common areas",
    },
    {
      title: "Water Treatment",
      image: "/assets/img/society/hero1.jpg",
      description: "Advanced water purification system",
    },
    {
      title: "Waste Management",
      image: "/assets/img/society/hero2.jpg",
      description: "Eco-friendly waste processing",
    },
  ],
};

const categories = [
  { key: "club", label: "Club" },
  { key: "sports", label: "Sports & Fitness" },
  { key: "children", label: "For Children" },
  { key: "security", label: "Safety & Security" },
  { key: "general", label: "General Amenities" },
];

const NewAmenitiesSection = () => {
  const [activeCategory, setActiveCategory] = useState("club");

  return (
    <section className="amenities_section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">World-Class Amenities</h2>
          <p className="section-description">
            Experience luxury living with our comprehensive range of premium
            amenities
          </p>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.key}
              className={`category-button ${
                activeCategory === category.key ? "category-button--active" : ""
              }`}
              onClick={() => setActiveCategory(category.key)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Amenities Grid */}
        <div className="amenities-grid">
          {(amenitiesData[activeCategory] || []).map((amenity, index) => (
            <div key={index} className="amenity-card">
              <div className="amenity-card__image-wrapper">
                <img
                  src={amenity.image || "/placeholder.svg"}
                  alt={amenity.title}
                  className="amenity-card__image"
                />
              </div>
              <div className="amenity-card__content">
                <h3 className="amenity-card__title">{amenity.title}</h3>
                <p className="amenity-card__description">
                  {amenity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

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

  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h2>Society Profile Management</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              {/* <label>Society Type</label>
              <select
                name="societyType"
                value={formData.societyType}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Both">Both</option>
              </select> */}
              <label>Society Type</label>
              <input
                type="text"
                name="societyType"
                value={formData.societyType || ""}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Society Name</label>
              <input
                type="text"
                name="society"
                value={formData.society}
                readOnly
                // onChange={handleChange}
                // placeholder="Enter society name"
                // required
              />
            </div>

            <div className="form-group">
              {/* <label>Builder Name</label>
              <input
                type="text"
                name="builder"
                value={formData.builder}
                onChange={handleChange}
                placeholder="Enter builder name"
              /> */}
              <label>Builder Name</label>
              <input
                type="text"
                name="builder"
                value={formData.builder}
                onChange={(e) => {
                  let value = e.target.value;
                  // Allow only letters and spaces
                  value = value.replace(/[^a-zA-Z\s]/g, "");
                  setFormData({ ...formData, builder: value });
                }}
                placeholder="Enter builder name"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
              />
            </div>

            <div className="form-group">
              <label>Price From (₹ Cr)</label>
              <input
                type="number"
                name="priceFrom"
                value={formData.priceFrom}
                onChange={handleChange}
                placeholder="e.g., 2.02"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Price To (₹ Cr)</label>
              <input
                type="number"
                name="priceTo"
                value={formData.priceTo}
                onChange={handleChange}
                placeholder="e.g., 2.52"
                step="0.01"
                min="0"
                required
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
              <div className="toggle-description">
                <label className="toggle-label">Approved By RERA </label>
                <div
                  className={`toggle-switch ${formData.reraApproved ? "active" : ""}`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      reraApproved: !prev.reraApproved,
                    }))
                  }
                >
                  <div className="toggle-circle" />
                </div>
              </div>
                <div className="toggle-description">
                <label className="toggle-label">Ready to Move In</label>
                <div
                  className={`toggle-switch ${formData.readyToMove ? "active" : ""}`}
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
              <label>Possession Year</label>
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
                <label>Launched Year</label>
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
                {errors.launchedYear && <span className="error">{errors.launchedYear}</span>}
              </div>
            )}


            {/* <div className="form-group">
              <label>Unit Types</label>
              <div className="unit-types-container">
                <input
                  type="text"
                  value={currentUnitType}
                  onChange={(e) => setCurrentUnitType(e.target.value)}
                  placeholder="Add unit type"
                />
                <button
                  type="button"
                  onClick={handleUnitTypeAdd}
                  className="add-unit-type-btn"
                >
                  Add
                </button>
              </div>
              <div className="unit-types-list">
                {formData.unitTypes?.map((type) => (
                  <div key={type} className="unit-type-tag">
                    {type}
                    <button
                      type="button"
                      onClick={() => handleUnitTypeRemove(type)}
                      className="remove-unit-type-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div> */}
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h2>Edit Society Details</h2>
        <form onSubmit={handleSubmit}>
          {/* <div className="form-grid">
            <div className="form-group">
              <label>Project Size in Acre</label>
              <input
                type="number"
                name="projectSize"
                value={formData.projectSize}
                onChange={handleChange}
                placeholder="Enter project size in Acres"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Total Units</label>
              <input
                type="number"
                name="totalUnits"
                value={formData.totalUnits}
                onChange={handleChange}
                placeholder="Enter total units"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Total Towers</label>
              <input
                type="number"
                name="totalTowers"
                value={formData.totalTowers}
                onChange={handleChange}
                placeholder="Enter number of towers"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Unit Types</label>
              <div className="unit-types-input">
                <input
                  type="text"
                  value={currentUnitType}
                  onChange={(e) => setCurrentUnitType(e.target.value)}
                  placeholder="e.g. 2 BHK, 3BHK, etc."
                />
                <button
                  type="button"
                  className="add-unit-btn"
                  onClick={handleUnitTypeAdd}
                >
                  Add
                </button>
              </div>
              <div className="unit-tags">
                {formData.unitTypes.map((type) => (
                  <span key={type} className="unit-tag">
                    {type}
                    <button
                      type="button"
                      onClick={() => handleUnitTypeRemove(type)}
                      className="remove-tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="readyToMove"
                  checked={formData.readyToMove}
                  onChange={handleChange}
                />
                Ready to Move
              </label>
            </div>

            {!formData.readyToMove && (
              <div className="form-group">
                <label>Possession Date</label>
                <input
                  type="date"
                  name="possessionDate"
                  value={formData.possessionDate}
                  onChange={handleChange}
                />
              </div>
            )} */}

            {/* Description field moved to full width at the end */}
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter society description"
                rows="5"
              />
            </div>
          {/* </div> */}

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    // Clear error when user makes changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
      clubCharges: 9999
    };

    Object.keys(maxValues).forEach(field => {
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

  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h2>Edit Society Rates</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Electricity Rate (Authority)</label>
              <input
                type="number"
                name="electricityRateAuthority"
                value={formData.electricityRateAuthority || ''}
                onChange={handleChange}
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
              <label>Electricity Rate (Power Backup)</label>
              <input
                type="number"
                name="electricityRatePowerBackup"
                value={formData.electricityRatePowerBackup || ''}
                onChange={handleChange}
                placeholder="Enter rate"
                min="0"
                max="99"
                step="0.01"
              />
              {errors.electricityRatePowerBackup && (
                <span className="error">{errors.electricityRatePowerBackup}</span>
              )}
              <p className="rate-description">₹ per unit</p>
            </div>

            <div className="form-group">
              <label>Water Charges</label>
              <input
                type="number"
                name="waterCharges"
                value={formData.waterCharges || ''}
                onChange={handleChange}
                placeholder="Enter rate"
                min="0"
                max="99"
                step="0.01"
              />
              {errors.waterCharges && (
                <span className="error">{errors.waterCharges}</span>
              )}
              <p className="rate-description">₹ per 1000L</p>
            </div>

            <div className="form-group">
              <label>Common Area Maintenance</label>
              <input
                type="number"
                name="commonAreaMaintenance"
                value={formData.commonAreaMaintenance || ''}
                onChange={handleChange}
                placeholder="Enter rate"
                min="0"
                max="99"
                step="0.01"
              />
              {errors.commonAreaMaintenance && (
                <span className="error">{errors.commonAreaMaintenance}</span>
              )}
              <p className="rate-description">₹ per sq.ft/month</p>
            </div>

            <div className="form-group">
              <label>Common Area Electricity</label>
              <input
                type="number"
                name="commonAreaElectricity"
                value={formData.commonAreaElectricity || ''}
                onChange={handleChange}
                placeholder="Enter rate"
                min="0"
                max="99"
                step="0.01"
              />
              {errors.commonAreaElectricity && (
                <span className="error">{errors.commonAreaElectricity}</span>
              )}
              <p className="rate-description">₹ per sq.ft/month</p>
            </div>

            <div className="form-group">
              <label>Club Charges</label>
              <input
                type="number"
                name="clubCharges"
                value={formData.clubCharges || ''}
                onChange={handleChange}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};




const SocietyDetails = ( { country, state, city, locality, societyId }) => {
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
    reraApproved: false // Array of unit types like ["2BHK", "3BHK"]
  });
  console.log(country, state, city, locality, societyId);
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

  if (loading) return <div className="loading-spinner">Loading...</div>;
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
          {(societyData.builder && societyData.address && societyData.priceFrom && societyData.priceTo && societyData.totalUnits && societyData.totalTowers && societyData.projectSize) ?
          (<div className="details-column">
            {/* Status Badges */}
            
            <div className="badges-full">
              <div className="badges-container">
                {societyData.readyToMove &&
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
                  Ready to Move
                </div>
                }
                {societyData.reraApproved &&
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
}
              </div>
              {user && ["frontdesk", "admin", "superAdmin"].includes(user.role) && (
              <button className="edit-btn" onClick={() => setShowEditModal(true)}>
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
                <p className="developer-name">by {societyData.builder || "Unknown Developer"}</p>
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
                    className="icon icon--left"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="location-text">
                    {formattedLocality},{" "}{formattedCity}, {formattedState}
                  </span>
                  <button className="map-link">View on Map</button>
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="price-card">
              <div className="price-content">
                <p className="price-label">Price Range</p>
                <div className="price-value">₹ {societyData.priceFrom} Cr – ₹ {societyData.priceTo} Cr</div>
                <p className="price-description">
                Multiple Types • {societyData.societyType} • {societyData.readyToMove && "Ready to Move"}
                </p>
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
                    <p className="fact-value">{societyData.projectSize || 0} Acres</p>
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
                    <p className="fact-value">{societyData.totalUnits || 0} Units</p>
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
                    <p className="fact-value">{societyData.totalTowers || 0} Towers</p>
                  </div>
                </div>
              </div>
              <div className="fact-card">
                {societyData.readyToMove && 
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
                      <p className="fact-value">{societyData.launchedYear || 0}</p>
                    </div>
                  </div>
                }
                {!societyData.readyToMove && 
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
                      <p className="fact-value">{societyData.possessionYear || 0}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
            {showEditModal && (
              <EditModal
                data={societyData}
                onClose={() => setShowEditModal(false)}
                onSave={handleSave}
              />
            )}
          </div>) : (
            <>
            {(user && ["frontdesk", "admin", "superAdmin"].includes(user.role)) ? (
              <button className="no-details" onClick={() => setShowEditModal(true)}>
                <FaPlus /> <span className="no-details-text">Click Here to Upload Details</span>
              </button>) : (
              <div className="no-details">
                <p>No details available</p>
              </div>)}
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
                  {Array.isArray(societyData.images) && societyData.images[0] ? (
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
                  {Array.isArray(societyData.images) && societyData.images[1] ? (
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
                  {Array.isArray(societyData.images) && societyData.images[3] ? (
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
                  {Array.isArray(societyData.images) && societyData.images[4] ? (
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
                  <span className="rating-value">{societyData.societyType}</span>
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

  const fetchProperties = async (purpose = null, limitCount = 10) => {
    try {
      setLoading(true);
      
      // Create base query
      let q = query(
        collection(projectFirestore, "properties-propdial"),
        where("society", "==", societyName)
      );

      // Add purpose filter if not "all"
      if (purpose && purpose !== "all") {
        q = query(q, where("purpose", "==", purpose));
      }

      // Get total count
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
        where("society", "==", societyName),
        // where("isActiveInactiveReview", "==", "Active")
      );

      if (filter !== "all") {
        q = query(q, where("purpose", "==", filter));
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

  useEffect(() => {
    if (societyName) {
      const purpose = filter === "all" ? null : filter === "sale" ? "Sale" : "Rent";
      fetchProperties(purpose);
    }
  }, [societyName, filter]);

  return (
    <>
    {properties.length > 0 ? (
    <section className="properties-section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">Available Properties</h2>
          <p className="section-description">
            Discover your perfect home from our collection of premium apartments
            and villas
          </p>
        </div>

        {/* Filter Buttons */}
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

        {/* Properties Container with Horizontal Scroll */}
        <div className="properties-container">
          <div className="properties-scroll">
            {properties.length > 0 ? (
              properties.map((property) => (
                <Link to={`/propertydetails/${property.id}`}>
                <div key={property.id} className="property-card">
                  <span
                    className={`property-card__badge ${
                      property.purpose === "Sale"
                        ? "property-card__badge--sale"
                        : "property-card__badge--rent"
                    }`}
                  >
                    {property.purpose === "Sale" ? "For Sale" : "For Rent"}
                  </span>
                  <div className="property-card__image-wrapper">
                    <img
                      src={property.images?.[0] || "/placeholder.svg"}
                      alt={property.propertyName || "Property"}
                      className="property-card__image"
                    />
                  </div>

                  <div className="property-card__header">
                    {/* <h3 className="property-card__title">
                      {property.propertyName || "Property"}
                    </h3> */}
                    <div className="property-card__price-area-container">
                      <span className="property-card__price">
                        ₹ {property.purpose === "Sale" 
                          ? property.demandPriceSale || "N/A"
                          : property.demandPriceRent || "N/A"}
                      </span>
                      <span className="property-card__area">
                        {property.carpetArea || "N/A"} {" "}  {property.carpetAreaUnit}
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

                        {/* <span className="property-card__no-feature">
                          No features listed
                        </span> */}
                     
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
              !loading && <p className="no-properties">No properties found.</p>
            )}
          </div>
        </div>

        {/* Load More Button */}
        {loadedCount < totalCount && (
          <div className="load-more-container">
            <button 
              className="load-more-button" 
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </section>): null}
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
    { name: "Club House", icon: "FaRegBuilding", link:"https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_club%20house_.jpg?alt=media&token=1b1980a3-ade2-4cdd-b99e-7bfe18b50526" },
    { name: "Steam Bath Room", icon: "FaShower", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_steam%20bathroom_.jpg?alt=media&token=5272eaa9-4e88-403e-af46-184d975892d8" },
    { name: "Toddler Pool", icon: "FaSwimmingPool", link:"https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2Ftoddler%20pool.jpg?alt=media&token=64500230-007b-42dd-bd88-c1bf6406e88b" },
    { name: "Sauna Room", icon: "FaShower", link:"https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_sauna%20room_.jpg?alt=media&token=71a02f91-c3ab-48d0-b503-890d0ae03688" },
    { name: "Swimming Pool (Indoor)", icon: "FaSwimmingPool", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_swimming%20pool%20indoor_.jpg?alt=media&token=897710a3-1ec3-4f20-828d-7d11bd8a4d3b" },
    { name: "Swimming Pool (Outdoor)", icon: "FaSwimmingPool", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F__Swimming__pooL%20outdoor.jpg?alt=media&token=48b5fcbb-ad0d-4359-abf3-769c78d092f0" },
    { name: "Card Room", icon: "FaGamepad", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_card_room.jpg?alt=media&token=5b993d9d-4b4b-4563-b1e4-99890f78db15" },
    { name: "Party Room Small", icon: "MdMeetingRoom", link:"https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_party%20room%20small_.jpg?alt=media&token=aa257fad-9ba5-4e16-9648-7f9ddcc85b11" },
    { name: "Party Room Big", icon: "MdMeetingRoom", link:"https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_party_room_big.jpg?alt=media&token=27a02f5f-bffa-4166-8f24-1bab0fd72a9c" },
    { name: "Sun Deck", icon: "FaTree", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F__sun_deck.jpg?alt=media&token=33c347ce-278d-4745-bb94-5bb3284a0295" },
    { name: "Library", icon: "BsFileEarmarkText", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_library_.jpg?alt=media&token=65880d83-4796-4f81-a767-4bffc690c2cc" },
    { name: "Roof Deck Lounge", icon: "FaRegBuilding", link:"https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_roof%20deck%20lounge_.jpg?alt=media&token=914b20fa-ca18-484b-9959-b5155da06664"},
    { name: "Pool Deck Area", icon: "FaSwimmingPool", link:"https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_pool%20deck%20area_.jpg?alt=media&token=2dff684b-ac0e-409d-96b2-6383a5862ad9"},
    { name: "Spa Massage Room", icon: "FaShower", link:"https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_spa%20message%20room_.jpg?alt=media&token=5a4afe25-2491-431b-81b4-e71f978a1b15" },
    { name: "Kids Pool", icon: "FaRegBuilding", link:"https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_kids_pool.jpg?alt=media&token=282b8a5a-5201-4964-808c-a936765e5044" },
    { name: "Heated Lap Pool", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FclubAmenities%2F_heated%20lap%20pool_.jpg?alt=media&token=8024eccc-b6e5-4012-a5d3-cc5d3f6ed9ee"},
    // { name: "BBQ Area", icon: "FaRegBuilding" },
    // { name: "Multi Utility Store", icon: "FaRegBuilding" },
    // { name: "Bar", icon: "FaRegBuilding" },
    // { name: "Jacuzzi Spa", icon: "FaSwimmingPool" },
  ],
  "Sports & Fitness": [
    { name: "Cycle Track", icon: "FaWalking", link:"https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FCycle-Track.jpg?alt=media&token=f37783fa-23cd-42fb-b45d-0e7215930f99" },
    { name: "Dance Room", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FDance-Room.jpg?alt=media&token=06f6763b-eadd-457a-8bea-dd664a7f1ee4" },
    { name: "Garden Gym", icon: "FaDumbbell", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FGarden-Gymasium.jpg?alt=media&token=28c5ed0e-22e4-45f9-b57c-f4f500c6e4da" },
    { name: "Gymnesium", icon: "FaDumbbell", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FGymnesium.jpg?alt=media&token=e2c19c53-5be4-4065-89bd-daca84e93f98" },
    { name: "Health Club", icon: "FaPrayingHands", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FHealth-Club.jpg?alt=media&token=e1647b43-ccd2-41d6-aa77-296111385ef3" },
    { name: "Jogging Track", icon: "FaWalking", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FJogging-Track.jpg?alt=media&token=e5703af6-dce3-48c7-86e9-84a2c0f180c7" },
    { name: "Meditation", icon: "FaPrayingHands", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FMeditation.jpg?alt=media&token=ab26f0ab-05da-47b0-a88d-b1fc3dc1b985" },
    { name: "Yoga Deck", icon: "FaPrayingHands", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FYoga-Deck.jpg?alt=media&token=feca9864-50bb-46d2-9d1a-00b25e4b9937" },
    { name: "Yoga Room", icon: "FaPrayingHands", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FfitnessFreak%2FYoga-Room.jpg?alt=media&token=58c4c00c-1c1e-4a11-b0aa-049c2f4e8c0c" },
    { name: "Basket Ball", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Basket%20ball_.jpg?alt=media&token=b7fa719f-29d1-4353-9d02-c8872bac0ad8" },
    { name: "Billiards", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Billiards_.jpg?alt=media&token=382a7221-6260-4778-a757-cbd1479125f4" },
    { name: "Squash Court", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Squash%20court_.jpg?alt=media&token=4542a683-2569-48e3-8422-f4d9d43600be" },
    { name: "Cricket Pitch", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Cricket%20pitch_.jpg?alt=media&token=baeabef1-b809-4f4a-b663-892d3987fb6a" },
    { name: "Hourseback Riding", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_horseback%20riding_.jpg?alt=media&token=5eb87375-e090-4e10-bdf5-741a3e0cef31" },
    { name: "Volleyball Court", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_volleyball%20court_.jpg?alt=media&token=75c4964c-32f0-4211-92b5-1f6c53c5657f" },
    { name: "Badminton (Indoor)", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_badminton%20court%20indoor_.jpg?alt=media&token=ab98331f-bc9d-4076-a7f8-aba59be2d089" },
    { name: "Badminton (Outdoor)", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_badminton%20outdoor_.jpg?alt=media&token=0569318e-d8d1-483c-aa20-3858834bbc74" },
    { name: "Football Ground", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_football%20ground_.jpg?alt=media&token=21bcfd20-d98b-42b5-bd95-30ecc12cf103" },
    { name: "Golf Course", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Golf_course.jpg?alt=media&token=848ca032-1c01-496f-ab14-754789cb250a" },
    { name: "Skating Track", icon: "FaGamepad", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_skating%20rink_.jpg?alt=media&token=7ddd3802-36e9-4e59-9b83-9460599f24bb" },
    { name: "Tennis Court", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Tennis%20court_.jpg?alt=media&token=96d28ec9-5ea5-41c5-a164-b2c6f9a53e89" },
    { name: "Table Tennis", icon: "FaGamepad", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Table%20tennis_.jpg?alt=media&token=b6889230-e307-479d-9619-1a009b158089" },
    { name: "Bowling Alley", icon: "FaGamepad", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_Bowling%20alley_.jpg?alt=media&token=515726d7-444e-4173-842f-2aeb3e91c379" },
    { name: "Pool Table", icon: "FaGamepad", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsportsLover%2F_pool%20table_.jpg?alt=media&token=a36b6b5e-8776-4d35-b5e8-9c4474e67bcf" },
    // { name: "Skating Ring", icon: "FaGamepad", link: "" },
    // { name: "Horsebacking Ride", icon: "FaRegBuilding", link: "" },
    // { name: "Gymnasium", icon: "FaDumbbell", link: "" },
    // { name: "Cricket Ground", icon: "FaRegBuilding", link: "" },
    // { name: "Health Club", icon: "FaDumbbell", link: "" },
  ],
  "For Children": [
    { name: "Creche&daycare", icon: "FaGamepad", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren10_Creche%26daycare.jpg?alt=media&token=cd00649a-7ea6-4f63-a516-997def8b1345" },
    { name: "Kids Pool", icon: "FaSwimmingPool", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren1_kidsPool.jpg?alt=media&token=51c65118-b671-462e-9a46-e92052866f6e" },
    { name: "Toodler Pool", icon: "FaSwimmingPool", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren4_ToodlerPool.jpg?alt=media&token=24fc23a9-bb69-411d-aee1-9181baa39f09" },
    { name: "Heated Lap Pool", icon: "FaSwimmingPool", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren5_HeatedLapPool.jpg?alt=media&token=e46257de-16b4-4080-b35d-55ef185448a1" },
    { name: "Children Play Area (Indoor)", icon: "FaGamepad", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren2_ChildrenPlayArea(Indoor).jpg?alt=media&token=60e3fd23-edad-4c82-b382-4aa09b2a2533" },
    { name: "Children Play Area (Outdoor)", icon: "FaGamepad", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren3_ChildrenPlayArea(Outdoor).jpg?alt=media&token=77692755-1120-4228-ad27-0cc90a5ec131" },
    { name: "Miniature Golf", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren9_MiniatureGolf.jpg?alt=media&token=b313d3fd-ef77-41cd-bf0b-a5e73ab22987" },
    { name: "Play School", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren6_PlaySchool.jpg?alt=media&token=14ee1e35-8396-4d9a-bfd3-dbbd621e3999" },
    { name: "Pre-Primary School", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren7_PrePrimarySchool.jpg?alt=media&token=c6f059dc-949a-4b1d-94db-9a3d4dfccaab" },
    { name: "Primary School", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FforChildren%2FForChildren8_PrimarySchool.jpg?alt=media&token=d96c069d-1222-4d57-8ea8-240ee461adc2" },
    // { name: "Dance Room", icon: "FaRegBuilding", link: "" },
    // { name: "Yoga Deck", icon: "FaPrayingHands", link: "" },
    // { name: "Horseback Riding", icon: "FaRegBuilding", link: "" },
    // { name: "Creche and daycare", icon: "FaRegBuilding", link: "" },
  ],
  "Safety & Security": [
    { name: "cctv-in Common Area", icon: "FaVideo", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity6_CCTVincommonarea.jpg?alt=media&token=d0359d0f-9bf1-4bc7-a198-0e5afc29cbbc" },
    { name: "Fire Fighting System", icon: "FaUserShield", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity4_FireFightingSystems.jpg?alt=media&token=85a49c24-b5db-478d-9837-53f992280f21" },
    { name: "Intercom", icon: "FaUserShield", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity5_Intercom.jpg?alt=media&token=ed590729-74ae-4884-87e2-eab89ea45356" },
    { name: "PNG (Pipeline gas)", icon: "FaUserShield", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity7_PipedNaturalGas(PNG).jpg?alt=media&token=6c6712a8-5e23-4e00-9f15-6c097caa1c48" },
    { name: "Security (3 tier)", icon: "FaUserShield", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity1_Security3-Tier.jpg?alt=media&token=b7ad650b-8b79-427f-b4ad-82dd27fc93c2" },
    { name: "Security (Roaming)", icon: "FaUserShield", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity3_RoamingGuardSecurity.jpg?alt=media&token=86beb0ea-9882-4ae6-9177-61b027715b97" },
    { name: "Security (Single Guard)", icon: "FaUserShield", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FsafetySecurity%2FSafetyandSecurity2_.SingleGuardSecurity.jpg?alt=media&token=f43ee078-9ae6-4aa3-8ea0-f956920ac4a2" },

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
    { name: "24 Hour Water Supply", icon: "FaShower", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FwaterSupply.jpg?alt=media&token=67ad62ff-e007-46f5-8a9e-2972060711b9" },
    { name: "Car Parking (Basement)", icon: "FaParking", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FBasementCarParking.jpg?alt=media&token=e0b8e202-7dbe-4ca2-873c-3386250a55e0" },
    { name: "Car Parking (Under Shade)", icon: "FaParking", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FStiltCarParking.jpg?alt=media&token=25db3184-9ab1-4f96-99a1-0cc5c8c9b8ea" },
    { name: "Car Parking (For Visitors)", icon: "FaParking", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FStiltCarParking.jpg?alt=media&token=25db3184-9ab1-4f96-99a1-0cc5c8c9b8ea" },
    { name: "Car Parking (Open)", icon: "FaParking", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FOpenCarParking.jpg?alt=media&token=3323683b-7bc2-469b-8c0e-7295199e667b" },
    { name: "Designated Pet Area", icon: "FaTree", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FDesignatedPetArea.jpg?alt=media&token=85e67d62-0e89-41cb-a378-6ebcc6cd4f9b" },
    { name: "Gardens", icon: "FaTree", link: "" },
    { name: "Rain Water Harvesting", icon: "FaRegBuilding", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FRainWaterHarvesting.jpg?alt=media&token=f526e87c-0042-49a8-8873-831d2ad4f6e8" },
    { name: "Lifts", icon: "MdElevator", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FLift.jpg?alt=media&token=a7b6d8d1-8986-4b05-9a1c-a51614a45d0e" },
    { name: "High Speed Lifts", icon: "MdElevator", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FHighSpeedLifts.jpg?alt=media&token=3e115c3f-34a0-4aaa-b901-6d90acd421b1" },
    { name: "High Speed Elevator", icon: "MdElevator", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FHighSpeedElevators.jpg?alt=media&token=3335c0bb-0bd4-4904-8c30-8720f1450780" },
    { name: "Landscaped Gardens", icon: "FaTree", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FLandscapeGardens.jpg?alt=media&token=c9d525cf-51d1-43ac-8a39-b01bf4ea9147" },
    { name: "Rainwater Harvesting", icon: "FaShower", link: "" },
    { name: "Power Back (Full)", icon: "FaBolt", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2F100PowerBackUp.jpg?alt=media&token=a3cb33e4-26a8-4abe-a2df-e13e17fc539c" },
    { name: "Power Backup (Partial)", icon: "FaBolt", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2F80PowerBackUp.jpg?alt=media&token=4c0b715c-adc7-4d2d-a81d-069737e93d88" },
    { name: "Power Back (Lift Only)", icon: "FaBolt", link: "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/societyAmenities%2FgeneralAmenities%2FPowerBackUpLift.jpg?alt=media&token=094f9683-10cd-4df3-b3f3-1cf85b60919b" },

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
    return <div className="loading-spinner">Loading amenities...</div>;

  return (
    <div className="amenities-section">
      <div className="container">
      <div className="text-center mb-12">
          <h2 className="section-title">World-Class Amenities</h2>
          <p className="section-description">
            Experience luxury living with our comprehensive range of premium
            amenities
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

      <div className="amenities-grid">
        {(user && ["frontdesk", "admin", "superAdmin"].includes(user.role)) ? (
        <div className="add-amenity-card" onClick={handleAddAmenities}>
          <div className="plus-icon">
            <FaPlus />
          </div>
          <div className="label">Add Amenities</div>
        </div>) : null }
        {selectedAmenities[activeCategory] && selectedAmenities[activeCategory].length > 0 ? (
        selectedAmenities[activeCategory]?.map((item, index) => (
          <div
            className={`amenity-card ${item.highlight ? "highlighted" : ""}`}
            key={index}
            // onClick={() => toggleHighlight(item.name, activeCategory)}
          >
            {/* {item.highlight && <div className="flag"></div>}
            <div className="icon">
              {iconComponents[item.icon] || <FaRegBuilding />}
            </div>
            <div className="label">{item.name}</div> */}
             
              <div className="amenity-card__image-wrapper">
                <img
                  src={item.link || "/placeholder.svg"}
                  alt={item.name}
                  className="amenity-card__image"
                />
              </div>
              <div className="amenity-card__content">
                <h3 className="amenity-card__title">{item.name}</h3>
                {/* <p className="amenity-card__description">
                  {item.name}
                </p> */}
              </div>
            </div>
          
        )) ) : (
           (user && ["frontdesk", "admin", "superAdmin"].includes(user.role)) ? null :
        (
        <div className="no-amenities"> <p>No data amenities available</p> </div>

        )
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
              <h2>
                Select Amenities ({tempSelected.length} selected)
                {isEditing && <span> - Editing: {activeCategory}</span>}
              </h2>
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
    description: "",
    launchDate: "",
    totalUnits: "",
    totalTowers: "",
    projectSize: "",
    unitTypes: [], // Array of unit types like ["2BHK", "3BHK"]
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
  console.log(societyData.description)
  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  return (

    <section className="about-society-section">
      <div className="container">
        {(!societyData.description == "") ? (
          <>
            <div className="about-container">
              <h2 className="about-title">About {societyData.society}</h2>

          <p className="about-description">
            {societyData.description === "" ? (
              <span className="no-description">No description available.</span>
            ) : (
              societyData.description
            )}
          </p>

           {(user && ["frontdesk", "admin", "superAdmin"].includes(user.role)) ? (
          <button className="edit-btn" onClick={() => setShowEditModal(true)}>
            <FaEdit />
          </button> ): null }
        </div>
        <div className="about-society-content">
          <div className="about-card">
            <div className="about-card__content">
              <div className="about-card__grid">
                <div className="about-card__column">
                  <div className="about-card__fact">
                    <span className="about-card__fact-title">Product Size:</span>
                    <span className="about-card__fact-value">
                      {societyData.projectSize && societyData.projectAge ? (
                        `${societyData.projectSize} Acres (${societyData.projectAge} Years)`
                      ) : societyData.projectSize ? (
                        `${societyData.projectSize} Acres`
                      ) : (
                        "!"
                      )}
                    </span>
                  </div>

                  {societyData.readyToMove ? (
                    <div className="about-card__fact">
                      <span className="about-card__fact-title">Launched Year:</span>
                      <span className="about-card__fact-value">
                        {societyData.launchedYear ? societyData.launchedYear : "!"}
                      </span>
                    </div>
                  ) : (
                    <div className="about-card__fact">
                      <span className="about-card__fact-title">Possession Year:</span>
                      <span className="about-card__fact-value">
                        {societyData.possessionYear ? societyData.possessionYear : "!"}
                      </span>
                    </div>
                  )}

                  <div className="about-card__fact">
                    <span className="about-card__fact-title">Total Units:</span>
                    <span className="about-card__fact-value">
                      {societyData.totalUnits ? `${societyData.totalUnits} Units` : "!"}
                    </span>
                  </div>
                </div>

                <div className="about-card__column">
                  <div className="about-card__fact">
                    <span className="about-card__fact-title">Total Towers:</span>
                    <span className="about-card__fact-value">
                      {societyData.totalTowers ? `${societyData.totalTowers} Towers` : "!"}
                    </span>
                  </div>

                  <div className="about-card__fact">
                    <span className="about-card__fact-title">Society Types:</span>
                    <span className="about-card__fact-value">
                      {societyData.societyType ? societyData.societyType : "!"}
                    </span>
                  </div>

                  <div className="about-card__fact">
                    <span className="about-card__fact-title">Possession:</span>
                    <span className="about-card__fact-value">
                      {societyData.readyToMove
                        ? "Immediate Possession"
                        : societyData.possessionYear
                        ? societyData.possessionYear
                        : "!"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>) :(
          <>
          <div className="about-container">
              <h2 className="about-title">About {societyData.society}</h2>
              </div>
          
            
            {(user && ["frontdesk", "admin", "superAdmin"].includes(user.role)) ? (
              <button className="no-details" onClick={() => setShowEditModal(true)}>
                <FaPlus /> <span className="no-details-text">Click Here to Upload Details</span>
              </button>) : (
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

const FloorPlansSection = ({ societyId }) => {
  // State for floor plans - initialize as object with array values
  const { user } = useAuthContext();
  const [floorPlans, setFloorPlans] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [activeUnit, setActiveUnit] = useState("");
  const [activeVariant, setActiveVariant] = useState(0);
  
  // State for new unit type
  const [newUnitType, setNewUnitType] = useState("BHK");
  const [newUnitValue, setNewUnitValue] = useState("");
  
  // State for new variant
  const [newVariantSize, setNewVariantSize] = useState("");
  const [newVariantUnit, setNewVariantUnit] = useState("Sq-ft");
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  // Fetch floor plans data
  useEffect(() => {
    const fetchFloorPlans = async () => {
      if (!societyId) return;

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
          const data = docSnap.data();
          // Ensure each unit type has an array of variants
          const plans = data.plans || {};
          const validatedPlans = {};
          
          Object.keys(plans).forEach(unitType => {
            validatedPlans[unitType] = Array.isArray(plans[unitType]) 
              ? plans[unitType].map(variant => ({
                  ...variant,
                  image: variant.image || ""
                }))
              : [];
          });

          setFloorPlans(validatedPlans);
          
          // Set initial active unit if data exists
          const unitTypes = Object.keys(validatedPlans);
          if (unitTypes.length > 0) {
            setActiveUnit(unitTypes[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching floor plans:", error);
      }
    };

    fetchFloorPlans();
  }, [societyId]);

  // Add a new unit type
  const addUnitType = () => {
    if (!newUnitType || !newUnitValue) return;
    
    const unitKey = `${newUnitValue}${newUnitType}`;
    
    if (floorPlans[unitKey]) {
      alert("This unit type already exists");
      return;
    }

    const updatedPlans = {
      ...floorPlans,
      [unitKey]: [] // Initialize with empty array
    };

    setFloorPlans(updatedPlans);
    setActiveUnit(unitKey);
    setNewUnitValue("");
  };

  // Add a new variant to the active unit
  const addVariant = () => {
    if (!newVariantSize || !activeUnit) return;
    
    const variantName = `${newVariantSize} ${newVariantUnit}`;
    const newVariant = {
      size: variantName,
      image: ""
    };

    const updatedPlans = {
      ...floorPlans,
      [activeUnit]: [...(floorPlans[activeUnit] || []), newVariant]
    };

    setFloorPlans(updatedPlans);
    setActiveVariant(updatedPlans[activeUnit].length - 1);
    setNewVariantSize("");
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  // Upload image for the active variant
  const uploadImageForVariant = async () => {
    if (selectedImages.length === 0 || !activeUnit || !floorPlans[activeUnit]?.[activeVariant]) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const file = selectedImages[0];
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/\s+/g, "_")}`;
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
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (error) {
              console.error("Error getting download URL:", error);
              reject(error);
            }
          }
        );
      });

      // Update the specific variant with the new image
      const updatedPlans = { ...floorPlans };
      updatedPlans[activeUnit][activeVariant].image = downloadURL;
      setFloorPlans(updatedPlans);
      setSelectedImages([]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  // Delete a variant
  const deleteVariant = (index) => {
    if (!window.confirm("Are you sure you want to delete this variant?")) return;
    
    const updatedPlans = { ...floorPlans };
    updatedPlans[activeUnit].splice(index, 1);
    
    if (updatedPlans[activeUnit].length === 0) {
      delete updatedPlans[activeUnit];
      setActiveUnit(Object.keys(updatedPlans)[0] || "");
    }
    
    setFloorPlans(updatedPlans);
    setActiveVariant(0);
  };

  // Delete a unit type
  const deleteUnitType = (unitKey) => {
    if (!window.confirm("Are you sure you want to delete this unit type and all its variants?")) return;
    
    const updatedPlans = { ...floorPlans };
    delete updatedPlans[unitKey];
    
    setFloorPlans(updatedPlans);
    setActiveUnit(Object.keys(updatedPlans)[0] || "");
    setActiveVariant(0);
  };

  // Save floor plans to Firestore
  const saveFloorPlans = async () => {
    if (!societyId || Object.keys(floorPlans).length === 0) return;

    setSaving(true);

    try {
      // Save the floor plans data
      const docRef = doc(
        projectFirestore,
        "m_societies",
        societyId,
        "society_information",
        "floor_plans"
      );

      await setDoc(docRef, { plans: floorPlans });
      setEditMode(false);
    } catch (error) {
      console.error("Error saving floor plans:", error);
    } finally {
      setSaving(false);
    }
  };

  // Safely get variants for the active unit
  const getVariantsForActiveUnit = () => {
    if (!activeUnit || !floorPlans[activeUnit]) return [];
    return Array.isArray(floorPlans[activeUnit]) ? floorPlans[activeUnit] : [];
  };

  return (
    <section className="floor-plans-section">
      <div className="container">
        <div className="section-header">
          <h2>Unit Floor Plans</h2>
          <p>
            Explore our thoughtfully designed floor plans that maximize space
            and comfort
          </p>
          
          {!editMode && user && ["frontdesk", "admin", "superAdmin"].includes(user.role) ? (
            <button 
              onClick={() => setEditMode(true)} 
              className="edit-button"
            >
              <FaEdit /> Edit
            </button>
          ):null}
        </div>

        {editMode ? (
          <div className="edit-mode">
            {/* Unit Type Tabs */}
            <div className="unit-tabs">
              {Object.keys(floorPlans).map((unitType) => (
                <div key={unitType} className="tab-container">
                  <button
                    className={`tab-button ${
                      activeUnit === unitType ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveUnit(unitType);
                      setActiveVariant(0);
                      setSelectedImages([]);
                    }}
                  >
                    {unitType}
                  </button>
                  <button 
                    className="delete-unit-button"
                    onClick={() => deleteUnitType(unitType)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              
              {/* Add Unit Type Form */}
              <div className="add-unit-form">
                <select
                  value={newUnitType}
                  onChange={(e) => setNewUnitType(e.target.value)}
                >
                  <option value="EWS">EWS</option>
                  <option value="RK">RK</option>
                  <option value="BHK">BHK</option>
                  <option value="Hall">Hall</option>
                  <option value="Studio">Studio</option>
                </select>
                <input
                  type="text"
                  value={newUnitValue}
                  onChange={(e) => setNewUnitValue(e.target.value)}
                  placeholder="Unit value (e.g., 1, 2, 3)"
                />
                <button onClick={addUnitType} className="add-button">
                  Add Unit Type
                </button>
              </div>
            </div>

            {/* Variant Selection */}
            {activeUnit && (
              <>
                <div className="variant-tabs">
                  {getVariantsForActiveUnit().map((variant, index) => (
                    <div key={index} className="variant-container">
                      <button
                        className={`variant-button ${
                          activeVariant === index ? "active" : ""
                        }`}
                        onClick={() => {
                          setActiveVariant(index);
                          setSelectedImages([]);
                        }}
                      >
                        {variant.size}
                      </button>
                      <button 
                        className="delete-variant-button"
                        onClick={() => deleteVariant(index)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Variant Form */}
                  <div className="add-variant-form">
                    <input
                      type="number"
                      value={newVariantSize}
                      onChange={(e) => setNewVariantSize(e.target.value)}
                      placeholder="Size value"
                      min="0"
                      step="0.01"
                    />
                    <select
                      value={newVariantUnit}
                      onChange={(e) => setNewVariantUnit(e.target.value)}
                    >
                      <option value="Sq-ft">SqFt</option>
                      <option value="Sq-m">SqMtr</option>
                      <option value="Sq-yard">SqYard</option>
                    </select>
                    <button onClick={addVariant} className="add-button">
                      Add Variant
                    </button>
                  </div>
                </div>

                {/* Image Upload for Active Variant */}
                {activeUnit && floorPlans[activeUnit]?.[activeVariant] && (
                  <div className="image-upload-section">
                    <div className="image-upload">
                      <label className="upload-button">
                        <FaUpload /> Select Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          style={{ display: "none" }}
                        />
                      </label>
                      {selectedImages.length > 0 && (
                        <button
                          onClick={uploadImageForVariant}
                          disabled={uploading}
                          className="upload-button"
                        >
                          {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : "Upload Image"}
                        </button>
                      )}
                    </div>
                    
                    {/* Selected Image Preview */}
                    {selectedImages.length > 0 && (
                      <div className="image-preview">
                        <img 
                          src={URL.createObjectURL(selectedImages[0])} 
                          alt="Preview" 
                        />
                        <button onClick={() => setSelectedImages([])}>
                          <FaTimes />
                        </button>
                      </div>
                    )}

                    {/* Current Image */}
                    {floorPlans[activeUnit][activeVariant].image && (
                      <div className="current-image">
                        <p>Current Floor Plan:</p>
                        <img 
                          src={floorPlans[activeUnit][activeVariant].image} 
                          alt="Current floor plan" 
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Save/Cancel Buttons */}
            <div className="action-buttons">
              <button 
                onClick={saveFloorPlans} 
                disabled={Object.keys(floorPlans).length === 0 || saving}
                className="save-button"
              >
                {saving ? 'Saving...' : (
                  <>
                    <FaSave /> Save Changes
                  </>
                )}
              </button>
              <button 
                onClick={() => setEditMode(false)} 
                className="cancel-button"
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="view-mode">
            {/* Unit Type Tabs */}
            {Object.keys(floorPlans).length > 0 ? (
              <>
                <div className="unit-tabs">
                  {Object.keys(floorPlans).map((unitType) => (
                    <button
                      key={unitType}
                      className={`tab-button ${
                        activeUnit === unitType ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveUnit(unitType);
                        setActiveVariant(0);
                      }}
                    >
                      {unitType}
                    </button>
                  ))}
                </div>

                {/* Variant Selection */}
                {activeUnit && getVariantsForActiveUnit().length > 0 && (
                  <div className="variant-tabs">
                    {getVariantsForActiveUnit().map((variant, index) => (
                      <button
                        key={index}
                        className={`variant-button ${
                          activeVariant === index ? "active" : ""
                        }`}
                        onClick={() => setActiveVariant(index)}
                      >
                        {variant.size} Variant
                      </button>
                    ))}
                  </div>
                )}

                {/* Floor Plan Display */}
                <div className="floor-plan-display">
                  {activeUnit && floorPlans[activeUnit]?.[activeVariant]?.image ? (
                    <div className="card-floorPlan">
                      
                        <div className="image-container">
                          <img
                            src={floorPlans[activeUnit][activeVariant].image}
                            alt={`${activeUnit} ${floorPlans[activeUnit][activeVariant].size} floor plan`}
                          />
                        </div>
          
                    </div>
                  ) : (
                    <p className="no-image-message">No floor plan image available</p>
                  )}
                </div>
              </>
            ) : (
              <p className="no-data-message">No floor plans available</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const SocietyRatesSection = ({ societyId }) => {
  const { user } = useAuthContext();
  const [societyData, setSocietyData] = useState({
    electricityRateAuthority: "",
    electricityRatePowerBackup: "",
    waterCharges: "",
    commonAreaMaintenance: "",
    commonAreaElectricity: "",
    clubCharges: "",
  });

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

  if (loading) return <div className="loading-spinner">Loading...</div>;
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
          {(user && ["frontdesk", "admin", "superAdmin"].includes(user.role)) ? (
          <button className="edit-btn" onClick={() => setShowEditModal(true)}>
            <FaEdit />
          </button> ) : null }
        </div>

        {(societyData.electricityRateAuthority && societyData.electricityRatePowerBackup && societyData.waterCharges && societyData.commonAreaMaintenance && societyData.commonAreaElectricity && societyData.clubCharges ) ? (
          <>
            <div className="rates-grid">
                <div  className="rate-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <FaBolt className="icon" />
                      Electricity Rate (Authority)
                    </h3>
                  </div>
                  <div className="card-content">
                    <div className="rate-details">
                      <p className="rate-value">₹{societyData.electricityRateAuthority} per unit</p>

                    </div>
                  </div>
                </div>
                <div  className="rate-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <FaBatteryFull className="icon" />
                      Power Backup
                    </h3>
                  </div>
                  <div className="card-content">
                    <div className="rate-details">
                      <p className="rate-value">₹{societyData.electricityRatePowerBackup} per unit</p>

                    </div>
                  </div>
                </div>
                <div  className="rate-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <FaTint className="icon" />
                      Water Charges
                    </h3>
                  </div>
                  <div className="card-content">
                    <div className="rate-details">
                      <p className="rate-value">₹{societyData.waterCharges} per 1000L</p>

                    </div>
                  </div>
                </div>
                <div  className="rate-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <FaRegBuilding className="icon" />
                      Common Area Maintenance
                    </h3>
                  </div>
                  <div className="card-content">
                    <div className="rate-details">
                      <p className="rate-value">₹{societyData.commonAreaMaintenance} per sq.ft/month</p>
                    </div>
                  </div>
                </div>
                <div  className="rate-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <FaRegBuilding className="icon" />
                      Common Area Electricity
                    </h3>
                  </div>
                  <div className="card-content">
                    <div className="rate-details">
                      <p className="rate-value">₹{societyData.commonAreaElectricity} per sq.ft/month</p>
                    </div>
                  </div>
                </div>
                <div className="rate-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <FaRegBuilding className="icon" />
                      Club Charges
                    </h3>
                  </div>
                  <div className="card-content">
                    <div className="rate-details">
                      <p className="rate-value">₹{societyData.clubCharges} per month</p>
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
                      ? new Date(societyData.updatedAt.seconds * 1000).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                    )
                  </h3>
                  <p className="info-text">
                    All charges are subject to applicable taxes. Monthly charges are billed in advance. Online payment options are available through our resident portal.
                  </p>
                </div>
              </div>
            </div>
        </> ) : (
          <>
            {(user && ["frontdesk", "admin", "superAdmin"].includes(user.role)) ? (
              <button className="no-details" onClick={() => setShowEditModal(true)}>
                <FaPlus /> <span className="no-details-text">Click Here to Upload Details</span>
              </button>) : (
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
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageIndexes, setSelectedImageIndexes] = useState([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef(null);

  // Reference to the society's document in Firestore
  const societyDocRef = doc(projectFirestore, "m_societies", societyId);

  // Fetch existing images for this society from Firestore
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const docSnap = await getDoc(societyDocRef);
        if (docSnap.exists()) {
          const societyData = docSnap.data();
          // Ensure we have an array of image URLs (fallback to empty array)
          setImages(societyData.images || []);
        } else {
          console.log("No such document!");
          setImages([]);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
      }
    };

    fetchImages();
  }, [societyId]);

  const handleUploadClick = () => {
    // If there are no images, trigger file selection directly
    if (images.length === 0) {
      fileInputRef.current?.click();
    } else {
      // If there are existing images, open edit mode
      setEditMode(true);
      setSelectedImages([]);
      setSelectedImageIndexes([]);
    }
  };

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
      return file; // Return original if compression fails
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    // Check if total images would exceed 10
    if (images.length + selectedImages.length + files.length > 10) {
      alert(
        `Maximum 10 images allowed. You can add ${
          10 - (images.length + selectedImages.length)
        } more.`
      );
      return;
    }

    // Compress images before adding to selection
    const compressedFiles = await Promise.all(
      files.map((file) => compressImage(file))
    );

    setSelectedImages((prev) => [...prev, ...compressedFiles]);
    
    // If there were no existing images, automatically open edit mode
    if (images.length === 0) {
      setEditMode(true);
    }
  };

  const handleSaveAll = async () => {
    if (uploading) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const newUrls = [];

      // Upload selected images sequentially
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

      // Update Firestore document with new image URLs
      const updatedImages = [...images, ...newUrls];
      await updateDoc(societyDocRef, {
        images: updatedImages,
      });

      // Update local state
      setImages(updatedImages);
      setSelectedImages([]);
      setSelectedImageIndexes([]);
      setUploadProgress(100);

      setTimeout(() => {
        setUploading(false);
        setEditMode(false);
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload images. Please try again.");
      setUploading(false);
    }
  };

  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };

  const closeImageViewer = () => {
    setViewerOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDeleteExisting = async (index) => {
    try {
      // Get the image URL to delete
      const imageUrl = images[index];

      // Delete from Firebase storage
      const imageRef = ref(projectStorage, imageUrl);
      await deleteObject(imageRef);

      // Update Firestore document
      const updatedImages = images.filter((_, i) => i !== index);
      await updateDoc(societyDocRef, {
        images: updatedImages,
      });

      // Update local state
      setImages(updatedImages);
      setSelectedImageIndexes(selectedImageIndexes.filter(i => i !== index));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDeleteSelectedExisting = async () => {
    if (selectedImageIndexes.length === 0) return;
    
    try {
      // Sort in descending order to avoid index issues when deleting multiple items
      const sortedIndexes = [...selectedImageIndexes].sort((a, b) => b - a);
      
      // Delete from Firebase storage
      await Promise.all(
        sortedIndexes.map(index => {
          const imageUrl = images[index];
          const imageRef = ref(projectStorage, imageUrl);
          return deleteObject(imageRef).catch((error) => {
            console.error("Error deleting image:", error);
          });
        })
      );

      // Update Firestore document
      const updatedImages = images.filter((_, i) => !selectedImageIndexes.includes(i));
      await updateDoc(societyDocRef, {
        images: updatedImages,
      });

      // Update local state
      setImages(updatedImages);
      setSelectedImageIndexes([]);
    } catch (error) {
      console.error("Error deleting selected images:", error);
    }
  };

  const handleDeleteNew = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteSelectedNew = () => {
    if (selectedImageIndexes.length === 0) return;
    
    // Sort in descending order to avoid index issues when deleting multiple items
    const sortedIndexes = [...selectedImageIndexes].sort((a, b) => b - a);
    
    setSelectedImages(prev => prev.filter((_, i) => !selectedImageIndexes.includes(i)));
    setSelectedImageIndexes([]);
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all images?")) {
      try {
        // Delete all from Firebase storage
        await Promise.all(
          images.map((url) => {
            const imageRef = ref(projectStorage, url);
            return deleteObject(imageRef).catch((error) => {
              console.error("Error deleting image:", error);
            });
          })
        );

        // Update Firestore document
        await updateDoc(societyDocRef, {
          images: [],
        });

        // Update local state
        setImages([]);
        setSelectedImages([]);
        setSelectedImageIndexes([]);
      } catch (error) {
        console.error("Error deleting all images:", error);
      }
    }
  };

  const toggleImageSelection = (index) => {
    setSelectedImageIndexes(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const selectAllImages = () => {
    const totalImages = images.length + selectedImages.length;
    if (selectedImageIndexes.length === totalImages) {
      // If all are selected, deselect all
      setSelectedImageIndexes([]);
    } else {
      // Select all images
      setSelectedImageIndexes(Array.from({length: totalImages}, (_, i) => i));
    }
  };

  const renderGallery = () => {
    if (editMode) {
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
              />
            </label>
            
            {selectedImageIndexes.length > 0 && (
              <>
                <button
                  className="clear-all-btn"
                  onClick={() => setSelectedImageIndexes([])}
                >
                  Clear Selection
                </button>
                <button
                  className="delete-selected-btn"
                  onClick={images.length > 0 ? handleDeleteSelectedExisting : handleDeleteSelectedNew}
                >
                  Delete Selected ({selectedImageIndexes.length})
                </button>
              </>
            )}
            
            <button
              className="select-all-btn"
              onClick={selectAllImages}
            >
              {selectedImageIndexes.length === images.length + selectedImages.length ? 
                "Deselect All" : "Select All"}
            </button>
            
            <button
              className="delete-all-btn"
              onClick={handleDeleteAll}
              disabled={selectedImages.length === 0 && images.length === 0}
            >
              Delete All
            </button>
            <button
              className="save-all-btn"
              onClick={handleSaveAll}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Save All"}
            </button>
            <button
              className="cancel-btn"
              onClick={() => setEditMode(false)}
              disabled={uploading}
            >
              Cancel
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

            {images.length === 0 && selectedImages.length === 0 && (
              <p className="no-images-text">No images selected</p>
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
    }

    if (images.length === 0) {
      return (
        <div className="empty-gallery">
          <p>No images uploaded yet</p>
          <button className="upload-btn" onClick={handleUploadClick}>
            <FaUpload /> Upload Images
          </button>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </div>
      );
    }

    return (
 <div className="gallery-grid">
        {images.length >= 1 && (
          <div className="main-photo" onClick={() => openImageViewer(0)}>
            <img src={images[0]} alt="Main View" />
          </div>
        )}

        {images.length >= 2 && (
          <div className="sub-photo" onClick={() => openImageViewer(1)}>
            <img src={images[1]} alt="View 2" />
          </div>
        )}

        {images.length >= 3 && (
          <div
            className={`sub-photo photo ${images.length === 3 ? "end" : ""}`}
            onClick={() => openImageViewer(2)}
          >
            <img src={images[2]} alt="View 3" />
          </div>
        )}

        {images.length >= 4 && (
          <div className="sub-photo " onClick={() => openImageViewer(3)}>
            <img src={images[3]} alt="View 4" />
          </div>
        )}

        {images.length >= 5 && (
          <div
            className={`sub-photo endphoto ${
              images.length === 5 ? "end2" : ""
            }`}
            onClick={() => openImageViewer(4)}
          >
            <img src={images[4]} alt="View 5" />
          </div>
        )}

        {images.length > 5 && (
          <div className="show-more" onClick={() => openImageViewer(5)}>
            <button className="show-all-btn">
              <MdOutlinePhotoLibrary size={20} />
              Show all {images.length} photos
            </button>
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
          {images.length > 0 && !editMode && (
            <button
              className="upload-btn icon"
              title="Upload Images"
              onClick={handleUploadClick}
            >
              <FaUpload />
            </button>
          )}
          <FaShareAlt className="icon" title="Share" />
          {/* <FaRegHeart className="icon" title="Save" /> */}
        </div>
      </div>

      {renderGallery()}

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
    </div>
  );
};

const MapLocationSection = ({ state, city, locality, societyId }) => {
  const { user } = useAuthContext();
  const [societyData, setSocietyData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mapLink, setMapLink] = useState('');
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    place: '',
    distance: '',
    time: '',
    timeUnit: 'mins' // Default time unit
  });
  const [tempMapLink, setTempMapLink] = useState('');
  const [tempLocations, setTempLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!societyId) return;

      try {
        const docRef = doc(projectFirestore, "m_societies", societyId);
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
    try {
      const docRef = doc(projectFirestore, "m_societies", societyId);
      await updateDoc(docRef, {
        mapLink: tempMapLink,
        locations: tempLocations
      });
      setMapLink(tempMapLink);
      setNearbyLocations(tempLocations);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'distance') {
      // Only allow numbers and limit length
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 3) return;
      
      setNewLocation({
        ...newLocation,
        [name]: numericValue
      });
    } else if (name === 'time') {
      // Only allow numbers and limit length
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 2) return;
      
      setNewLocation({
        ...newLocation,
        [name]: numericValue
      });
    } else {
      setNewLocation({
        ...newLocation,
        [name]: value
      });
    }
  };

  const handleAddLocation = () => {
    if (newLocation.place && newLocation.distance && newLocation.time) {
      const locationToAdd = {
        place: newLocation.place,
        distance: `${newLocation.distance} km`,
        time: `${newLocation.time} ${newLocation.timeUnit}`
      };
      
      setTempLocations([...tempLocations, locationToAdd]);
      setNewLocation({
        place: '',
        distance: '',
        time: '',
        timeUnit: 'mins'
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

  // Helper function to parse time value and unit from stored format
  const parseTimeValue = (timeString) => {
    const match = timeString.match(/(\d+)\s*(mins|hrs)/);
    if (match) {
      return {
        value: match[1],
        unit: match[2]
      };
    }
    return { value: '', unit: 'mins' };
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
          {!isEditing && (societyData.description=="") && nearbyLocations.length > 0 && user && ["frontdesk", "admin", "superAdmin"].includes(user.role) && (
            <button className="edit-button" onClick={handleEditClick}>
              <FaEdit />Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Google Maps Embed Link</label>
              <input
                type="text"
                value={tempMapLink}
                onChange={handleMapLinkChange}
                placeholder="Paste Google Maps embed link here"
              />
              <small className="help-text">
                How to get the embed link: On Google Maps, click "Share" → "Embed a map" → Copy the iframe src URL
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
                            value={location.distance.replace(' km', '')}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(/\D/g, '');
                              if (numericValue.length > 3) return;
                              const updated = [...tempLocations];
                              updated[index].distance = `${numericValue} km`;
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
                              const numericValue = e.target.value.replace(/\D/g, '');
                              if (numericValue.length > 2) return;
                              const updated = [...tempLocations];
                              updated[index].time = `${numericValue} ${timeData.unit}`;
                              setTempLocations(updated);
                            }}
                            placeholder="Time"
                          />
                          <select
                            value={timeData.unit}
                            onChange={(e) => {
                              const updated = [...tempLocations];
                              updated[index].time = `${timeData.value} ${e.target.value}`;
                              setTempLocations(updated);
                            }}
                            className="time-unit-select"
                          >
                            <option value="mins">mins</option>
                            <option value="hrs">hrs</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveLocation(index)}
                        className="remove-button"
                      >
                        ×
                      </button>
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
                  disabled={!newLocation.place || !newLocation.distance || !newLocation.time}
                >
                  <FaPlus /> Add Location
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button onClick={handleCancel} className="cancel-button">
                <FaTimes /> Cancel
              </button>
              <button onClick={handleSave} className="save-button">
                <FaSave /> Save Changes
              </button>
            </div>
          </div>
        ) : (
          (societyData.description=="" && nearbyLocations.length > 0) ? (
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
                  <div className="map-iframe">
                    <iframe
                      title="Society Location"
                      src={mapLink || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.007168164708!2d77.75055731482193!3d12.972462990856818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae0d8a8f69a5a9%3A0x7a2c2b3e3e3e3e3e!2sWhitefield%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div className="address-details">
                    <p className="address-label">Complete Address:</p>
                    <p>{societyData.address}</p>
                    <p> 
        {formattedCity}, {formattedState}</p>
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
                          <span className="location-name">{location.place}</span>
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
                  ) : 
                   (user && ["frontdesk", "admin", "superAdmin"].includes(user.role)) ? (
              <button className="no-details"  onClick={handleEditClick}>
                <FaPlus /> <span className="no-details-text">Click Here to Upload Details</span>
              </button>) : (
              <div className="no-details">
                <p>No details available</p>
              </div>) 
        )}
      </div>
    </section>
  );
};

const PropertyVideosSection = ({ societyId }) => {
  const { user } = useAuthContext();
  const sliderRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    url: "",
    title: "",
  });
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Fetch videos from Firestore
  useEffect(() => {
    if (!societyId) return;

    const societyDocRef = doc(projectFirestore, "m_societies", societyId);
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
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const shortsRegExp = /^.*(youtube.com\/shorts\/)([^#&?]*).*/;
    const shortsMatch = url.match(shortsRegExp);

    if (match && match[2].length === 11) return match[2];
    if (shortsMatch && shortsMatch[2].length === 11) return shortsMatch[2];
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoId = extractVideoId(newVideo.url);

    if (!videoId) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    try {
      await updateDoc(doc(projectFirestore, "m_societies", societyId), {
        videos: [
          ...videos,
          {
            id: videoId,
            title: newVideo.title,
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            duration: "0:00"
          }
        ]
      });
      setNewVideo({ url: "", title: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video");
    }
  };

  const handleDeleteVideo = async (index) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const updatedVideos = [...videos];
      updatedVideos.splice(index, 1);
      await updateDoc(doc(projectFirestore, "m_societies", societyId), {
        videos: updatedVideos
      });
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video");
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
           {videos.length > 0 && user && ["frontdesk", "admin", "superAdmin"].includes(user.role) ? (
          <button 
            className="edit-button" 
            onClick={() => setShowForm(!showForm)}
          >
            <FaPlus /> Add Video
          </button>
           ): null}
        </div>

        {showForm && (
          <div className="video-form">
            <button 
              className="close-form-button" 
              onClick={() => setShowForm(false)}
            >
              <FaTimes />
            </button>
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
                />
              </div>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={newVideo.title}
                  onChange={handleInputChange}
                  placeholder="Video title"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Add Video
              </button>
            </form>
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
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteVideo(index)}
                    >
                      <FaTimes />
                    </button>
                    {/* <div className="duration-badge">{video.duration}</div> */}
                  </div>
                  <h3 className="video-title">{video.title}</h3>
                </div>
              ))
            ) : (
              (user && ["frontdesk", "admin", "superAdmin"].includes(user.role)) ? (
              <button className="no-details"  onClick={() => setShowForm(!showForm)}>
                <FaPlus /> <span className="no-details-text">Click Here to Upload Details</span>
              </button>) : (
              <div className="no-details">
                <p>No details available</p>
              </div>)
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

const ContactSection = ({ societyId }) => {
  const { user } = useAuthContext();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    manager: {
      name: "",
      designation: "Society Manager",
      mobile: "",
      email: "",
      responseRate: "100%",
      responseTime: "within an hour",
    },
    maintenance: {
      companyName: "",
      contactPerson: "",
      phone: "",
      email: "",
      contractStart: "",
      contractEnd: "",
    },
  });

  // Fetch existing society info
  useEffect(() => {
    const fetchSocietyInfo = async () => {
      try {
        const docRef = doc(projectFirestore, "m_societies", societyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            manager: {
              name: data.manager?.name || "",
              designation: data.manager?.designation || "Society Manager",
              mobile: data.manager?.mobile || "",
              email: data.manager?.email || "",
              responseRate: data.manager?.responseRate || "100%",
              responseTime: data.manager?.responseTime || "within an hour",
            },
            maintenance: {
              companyName: data.maintenance?.companyName || "",
              contactPerson: data.maintenance?.contactPerson || "",
              phone: data.maintenance?.phone || "",
              email: data.maintenance?.email || "",
              contractStart: data.maintenance?.contractStart || "",
              contractEnd: data.maintenance?.contractEnd || "",
            },
          });
        } else {
          console.log("No such document for societyId:", societyId);
        }
      } catch (error) {
        console.error("Error fetching society info:", error);
        // Display a user-friendly message instead of alert()
        // alert('Failed to load society information.');
      } finally {
        setLoading(false);
      }
    };

    fetchSocietyInfo();
  }, [societyId]);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(projectFirestore, "m_societies", societyId);
      await updateDoc(docRef, formData);
      setEditMode(false);
      // alert('Information saved successfully!'); // Use custom modal instead
    } catch (error) {
      console.error("Error updating society info:", error);
      // alert('Failed to save information'); // Use custom modal instead
    }
  };

  if (loading) {
    return <div className="society-info-loading">Loading...</div>;
  }
  return (
    <>
    {(user && ["frontdesk", "admin", "superAdmin"].includes(user.role)) ? (
    <section className="contact-section">
      <div className="container">
        <div className="section-header">
          <h2>Society Contact Information</h2>
          <p>
            Get in touch with our management team for any queries or assistance
          </p>
         {!editMode && formData.manager.name && formData.manager.mobile  && formData.manager.email && formData.manager.responseRate && formData.manager.responseTime && formData.maintenance.companyName && formData.maintenance.phone && formData.maintenance.email && formData.maintenance.contractStart && formData.maintenance.contractEnd && (
          <button className="edit-button" onClick={() => setEditMode(true)}>
            <FaEdit />Edit
          </button>
        )}
        </div>
      

      {editMode ? (
        <form onSubmit={handleSubmit} className="society-info-form">
          {/* Society Manager Form */}
          <div className="profile-section">
            <h3>Society Manager</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.manager.name}
                onChange={(e) => handleInputChange(e, "manager")}
                placeholder="Enter name"
                required
              />
            </div>

            <div className="contact-grid">
              <div className="form-group">
                <label>Mobile:</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.manager.mobile}
                  onChange={(e) => handleInputChange(e, "manager")}
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.manager.email}
                  onChange={(e) => handleInputChange(e, "manager")}
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>

            <div className="response-info">
              <div className="form-group">
                <label>Response Rate:</label>
                <select
                  name="responseRate"
                  value={formData.manager.responseRate}
                  onChange={(e) => handleInputChange(e, "manager")}
                >
                  <option value="100%">100%</option>
                  <option value="90%">90%</option>
                  <option value="80%">80%</option>
                </select>
              </div>

              <div className="form-group">
                <label>Response Time:</label>
                <select
                  name="responseTime"
                  value={formData.manager.responseTime}
                  onChange={(e) => handleInputChange(e, "manager")}
                >
                  <option value="within an hour">within an hour</option>
                  <option value="within a few hours">within a few hours</option>
                  <option value="within a day">within a day</option>
                </select>
              </div>
            </div>
          </div>

          {/* Maintenance Company Form */}
          <div className="profile-section">
            <h3>Maintenance Company</h3>
            <div className="form-group">
              <label>Company Name:</label>
              <input
                type="text"
                name="companyName"
                value={formData.maintenance.companyName}
                onChange={(e) => handleInputChange(e, "maintenance")}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Person:</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.maintenance.contactPerson}
                onChange={(e) => handleInputChange(e, "maintenance")}
                placeholder="Enter contact person name"
                
              />
            </div>

            <div className="contact-grid">
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.maintenance.phone}
                  onChange={(e) => handleInputChange(e, "maintenance")}
                  placeholder="Enter phone number"
                  // required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.maintenance.email}
                  onChange={(e) => handleInputChange(e, "maintenance")}
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contract Start:</label>
                  <input
                    type="text"   // text so we can control length
                    name="contractStart"
                    value={formData.maintenance.contractStart}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,4}$/.test(value)) {   // only 0–4 digits allowed
                        handleInputChange(e, "maintenance");
                      }
                    }}
                    placeholder="Enter contract starting year"
                    inputMode="numeric"  // shows numeric keyboard on mobile
                    pattern="\d*"        // hint for numeric only
                  />
                <span className="input-info">Year (YYYY)</span>
              </div>
              <div className="form-group">
                <label>Contract End:</label>
                  <input
                    type="text"   // use text instead of number
                    name="contractEnd"
                    value={formData.maintenance.contractEnd}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,4}$/.test(value)) {  // allow only up to 4 digits
                        handleInputChange(e, "maintenance");
                      }
                    }}
                    placeholder="Enter contract ending year"
                    inputMode="numeric"
                    pattern="\d*"
                  />
                  <span className="input-info">Year (YYYY)</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      ) : (
        (formData.manager.name && formData.manager.mobile  && formData.manager.email && formData.manager.responseRate && formData.manager.responseTime && formData.maintenance.companyName && formData.maintenance.phone && formData.maintenance.email && formData.maintenance.contractStart && formData.maintenance.contractEnd) ?
          (
        <div className="contact-grid">
          {/* Society Manager */}
          <div className="contact-card">
            <div className="card-header">
              <h3 className="card-title">
                <User className="icon" />
                Society Manager
              </h3>
            </div>
            <div className="card-content">
              <div className="contact-person">
                <p className="name">{formData.manager.name || "Not specified"}</p>
                <p className="designation">Senior Property Manager</p>
              </div>
              <div className="contact-details">
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span>{formData.manager.mobile || "Not specified"}</span>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>{formData.manager.email || "Not specified"}</span>
                </div>
              </div>
              <div className="availability">
                <p>Response Rate: {formData.manager.responseRate || "Not specified"}</p>
                <p>Response Time: {formData.manager.responseTime || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Maintenance Company */}
          <div className="contact-card">
            <div className="card-header">
              <h3 className="card-title">
                <Building className="icon" />
                Maintenance Company
              </h3>
            </div>
            <div className="card-content">
              <div className="contact-person">
                <p className="name">{formData.maintenance.companyName || "Not specified"}</p>
                <p className="designation">Professional Maintenance Services</p>
              </div>
              <div className="contact-details">
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span>{formData.maintenance.phone || "Not specified"}</span>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>{formData.maintenance.email || "Not specified"}</span>
                </div>
              </div>
              <div className="contract-details">
                <div className="contract-item">
                  <Calendar className="contract-icon" />
                  <div>
                    <p className="contract-label">Contract Period</p>
                    <p className="contract-date">{formData.maintenance.contractStart || "Not specified"} - {formData.maintenance.contractEnd || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>): 
        (user && ["frontdesk", "admin", "superAdmin"].includes(user.role)) ? (
              <button className="no-details"   onClick={() => setEditMode(true)}>
                <FaPlus /> <span className="no-details-text">Click Here to Upload Details</span>
              </button>) : (
              <div className="no-details">
                <p>No details available</p>
              </div>)
        )}
      </div>
    </section>): null}
    </>
  );
};

const PGSocietyPage = () => {
  // The 'society' param from the URL is the slug, e.g., "best-12345"
  const { country, state, city, locality, societyName, id } = useParams();
  console.log("Country:", country);
  console.log("State:", state);
  console.log("City:", city);
  console.log("Locality:", locality);
  console.log("Society:", societyName);
  console.log("Society ID:", id);

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
  console.log(society);
  const videos = [
    { id: "abc123", title: "Luxury Apartment Tour", category: "Property Tour" },
    { id: "def456", title: "Project Overview", category: "Overview" },
    { id: "ghi789", title: "Nearby Amenities", category: "Amenities" },
  ];
  return (
    <div className={styles.container}>
      {/* Header Image Slider */}
      {/* <div className={styles.heroSection}>
        <div
          className={styles.sliderWrapper}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <img
              key={idx}
              src={`/assets/img/society/${img}`}
              alt={`Slide ${idx + 1}`}
              className={styles.heroImage}
            />
          ))}
        </div>
        <button className={styles.viewAllBtn}>View All Photos</button>
        <div className={styles.dotsWrapper}>
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${
                currentIndex === idx ? styles.activeDot : ""
              }`}
            ></span>
          ))}
        </div>
      </div> */}
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
        {/* <div className={styles.overviewSection}>
          <div className={styles.contact}>
            <div>
              <SocietyOverview
                country={country}
                state={state}
                city={city}
                locality={locality}
                societyId={id}
              />
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </div> */}

        {/* Buy Rent Tabs */}
        {/* Available Properties Section */}
      <div  id="Available-Properties" >
        <PropertiesSection societyName={society.society}/>
          {/* <AvailableProperties societyName={society.society} /> */}
        </div>

        {/* Amenities */}
        <div id="Amenities">
          {/* <NewAmenitiesSection /> */}
          <AmenitiesSection societyId={id} />
        </div> 

        {/* About Project */}
        <div id="About-Society" > 
        <AboutSocietySection societyId={id}/>
          {/* <ProjectInfo societyId={id} /> */}
        </div>

        {/* Location Advantages */}
         {/* <div id="Nearby-Locations" className="locationAdvantages">
          <LocationAdvantages societyId={id} />
        </div>  */}

        {/* Floor Plans */}
        <div id="Units-Floor-Plans" >
        <FloorPlansSection id="Units-Floor-Plans" societyId={id} />
        {/* className="floorPlansSection"
          <FloorPlans societyId={id} /> */}
        </div> 

        {/* Society rate */}
        <div id="Things-to-Know" >

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
        <div id="Nearby-Locations" >
          <MapLocationSection state={state} city={city} locality={locality} societyId={id}/>
          {/* className="meetingPointSection"
          <MeetingPoint state={state} city={city} locality={locality} societyId={id} /> */}
        </div> 

        {/* ComponentBuilder */}
        {/* <div id="ComponentBuilder">
          <ComponentBuilder />
        </div> */}

        {/* YouTube Video Slider */}
        <div id="Society-Videos" >
        <PropertyVideosSection  societyId={id} />
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
