import React, { useState, useEffect } from "react";
import styles from "./PropertyListingPage.module.scss";
import { Link, useParams } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import "./PGSociety.scss";
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
  FaRupeeSign,
} from "react-icons/fa";
import { BsFileEarmarkText } from "react-icons/bs";
import { PiBuildingsDuotone } from "react-icons/pi";
const locations = [
  { place: "Koramangala", distance: "8 Km", time: "22 min" },
  { place: "Sarjapur Road", distance: "2 Km", time: "4 Min" },
  { place: "Byg Brewski", distance: "3.2 Km", time: "7 Min" },
  { place: "Manipal Hospital", distance: "1.2 Km", time: "2 Min" },
  { place: "HSR Layout", distance: "6.5 Km", time: "15 mins" },
  { place: "Singasandra Metro Station", distance: "5 Km", time: "15 mins" },
  {
    place: "Electronic City Metro Station",
    distance: "6.8 Km",
    time: "14 mins",
  },
  { place: "Wipro Limited", distance: "3.2 Km", time: "7 Min" },
  { place: "Infosys Limited", distance: "2 Km", time: "4Min" },
  { place: "National Public School", distance: "3.5 Km", time: "6 Min" },
];

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

const images = [
  "/assets/img/society/hero1.jpg",
  "/assets/img/society//assets/img/society/hero2.jpg",
  "/assets/img/society//assets/img/society/hero3.jpg",
  "/assets/img/society//assets/img/society/hero4.jpg",
  "/assets/img/society//assets/img/society/hero5.jpg",
  "/assets/img/society//assets/img/society/layout1.jpg",
  "/assets/img/society//assets/img/society/layout2.jpg",
  "/assets/img/society//assets/img/society/layout3.jpg",
  "/assets/img/society//assets/img/society/layout4.jpg",
  "/assets/img/society//assets/img/society/layout5.jpg",
];

const GalleryPreview = () => {
  return (
    <div className="gallery-preview">
      <div className="gallery-header">
        <h2 className="gallery-title">
          Assetz Trees and Tandem - Sample Apartment
        </h2>
        <div className="gallery-icons">
          <FaShareAlt className="icon" title="Share" />
          <FaRegHeart className="icon" title="Save" />
        </div>
      </div>

      <div className="gallery-grid">
        <div className="main-photo">
          <img src="/assets/img/society//hero1.jpg" alt="Main View" />
        </div>
        <div className="sub-photo">
          <img src="/assets/img/society//hero2.jpg" alt="View 2" />
        </div>
        <div className="sub-photo end">
          <img src="/assets/img/society//hero3.jpg" alt="View 3" />
        </div>
        <div className="sub-photo">
          <img src="/assets/img/society//hero4.jpg" alt="View 4" />
        </div>
        <div className="sub-photo end2">
          <img src="/assets/img/society//hero5.jpg" alt="View 5" />
        </div>
        <div className="show-more">
          <button className="show-all-btn">
            <MdOutlinePhotoLibrary size={20} />
            Show all photos
          </button>
        </div>
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

const floorPlanOptions = [
  { size: "1885 Sq-ft", image: "/assets/img/society/layout3.jpg" },
  { size: "2346 Sq-ft", image: "/assets/img/society/layout1.jpg" },
  { size: "2014 Sq-ft", image: "/assets/img/society/layout2.jpg" },
  { size: "2179 Sq-ft", image: "/assets/img/society/layout4.jpg" },
  { size: "2142 Sq-ft", image: "/assets/img/society/layout5.jpg" },
  { size: "2319 Sq-ft", image: "/assets/img/society/layout6.jpg" },
  { size: "1900 Sq-ft", image: "/assets/img/society/layout7.jpg" },
];

const FloorPlans = () => {
  const [selectedSize, setSelectedSize] = useState("1885 Sq-ft");

  const currentPlan = floorPlanOptions.find(
    (plan) => plan.size === selectedSize
  );

  return (
    <div className="floorplans-container">
      <h2 className="heading">Units & Floor plans</h2>
      <div className="bhk-heading">3 BHK Flat</div>
      <div className="size-options">
        {floorPlanOptions.map((plan) => (
          <button
            key={plan.size}
            className={`size-btn ${selectedSize === plan.size ? "active" : ""}`}
            onClick={() => setSelectedSize(plan.size)}
          >
            {plan.size}
          </button>
        ))}
      </div>

      {currentPlan?.image ? (
        <div className="floorplan-image">
          <img src={currentPlan.image} alt={selectedSize} />
        </div>
      ) : (
        <div className="no-plan">
          No floor plan available for {selectedSize}.
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

const ProjectInfo = ({ societyData }) => {
  return (
    <div className="project-info-container">
      <h1 className="title">About {societyData.society}</h1>

      <p className="subtitle">
        {societyData.description}
        <span className="read-more"> Read More</span>
      </p>

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
              {" "}
              {new Date(societyData.launchDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}
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
    </div>
  );
};

const allAmenities = [
  { name: "Club House", icon: "FaRegBuilding" },
  { name: "Jogging Track", icon: "FaWalking" },
  { name: "Power Back Up", icon: "FaBolt" },
  { name: "Swimming Pool", icon: "FaSwimmingPool" },
  { name: "Lift", icon: "MdElevator" },
  { name: "Security", icon: "FaUserShield" },
  { name: "Park", icon: "FaTree" },
  { name: "Reserved Parking", icon: "FaParking" },
  { name: "Gymnasium", icon: "FaDumbbell" },
  { name: "Indoor Games", icon: "FaGamepad" },
  { name: "Rain Water Harvesting", icon: "FaShower" },
  { name: "Meditation Area", icon: "FaPrayingHands" },
  { name: "Children's Play Area", icon: "FaGamepad" },
  { name: "Multipurpose Hall", icon: "MdMeetingRoom" },
  { name: "Badminton Court", icon: "FaRegBuilding" },
  { name: "Tennis Court", icon: "FaRegBuilding" },
  { name: "Basketball Court", icon: "FaRegBuilding" },
  { name: "Squash Court", icon: "FaRegBuilding" },
  { name: "Yoga Deck", icon: "FaPrayingHands" },
  { name: "Aerobics Room", icon: "FaDumbbell" },
  { name: "Sauna", icon: "FaShower" },
  { name: "Steam Room", icon: "FaShower" },
  { name: "Jacuzzi", icon: "FaSwimmingPool" },
  { name: "Banquet Hall", icon: "MdMeetingRoom" },
  { name: "Guest Rooms", icon: "FaBed" },
  { name: "Library", icon: "BsFileEarmarkText" },
  { name: "Cafeteria", icon: "FaRegBuilding" },
  { name: "Convenience Store", icon: "FaRegBuilding" },
  { name: "Amphitheater", icon: "FaRegBuilding" },
  { name: "Pet Park", icon: "FaTree" },
  { name: "Barbecue Area", icon: "FaRegBuilding" },
  { name: "Car Wash Area", icon: "FaParking" },
  { name: "Electric Vehicle Charging", icon: "FaBolt" },
  { name: "24x7 Water Supply", icon: "FaShower" },
  { name: "Waste Management", icon: "FaTree" },
  { name: "Fire Safety", icon: "FaUserShield" },
  { name: "CCTV Surveillance", icon: "FaUserShield" },
  { name: "Intercom Facility", icon: "FaUserShield" },
  { name: "Maintenance Staff", icon: "FaUserShield" },
  { name: "Housekeeping", icon: "FaUserShield" },
];

const iconComponents = {
  FaRegBuilding: <FaRegBuilding />,
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
  const [showModal, setShowModal] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [tempSelected, setTempSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  console.log(societyId);
  // Fetch amenities from Firebase
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const doc = await projectFirestore
          .collection("m_societies")
          .doc(societyId)
          .get();

        if (doc.exists) {
          // Use existing amenities or initialize empty array
          const data = doc.data();
          setSelectedAmenities(data.amenities || []);
          setTempSelected(
            data.amenities ? data.amenities.map((a) => a.name) : []
          );
        } else {
          // Initialize new document with empty amenities
          await projectFirestore
            .collection("m_societies")
            .doc(societyId)
            .set({ amenities: [] });

          setSelectedAmenities([]);
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
      if (!Array.isArray(amenities))
        throw new Error("Amenities must be an array");

      const amenitiesData = amenities.map((amenity) => ({
        name: amenity.name,
        icon: amenity.icon,
        highlight: amenity.highlight || false,
      }));

      // Use the correct collection name
      const docRef = projectFirestore.collection("m_societies").doc(societyId);
      const doc = await docRef.get();

      if (!doc.exists) {
        await docRef.set({ amenities: amenitiesData });
      } else {
        await docRef.update({ amenities: amenitiesData });
      }

      console.log("Amenities saved successfully");
      return true;
    } catch (err) {
      console.error("Firebase save error:", {
        error: err,
        message: err.message,
        stack: err.stack,
      });

      let errorMessage = "Failed to save amenities. Please try again.";
      if (err.message.includes("permission-denied")) {
        errorMessage = "You don't have permission to update amenities.";
      }

      alert(errorMessage);
      return false;
    }
  };

  const handleAddAmenities = () => {
    setTempSelected(selectedAmenities.map((a) => a.name));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCheckboxChange = (amenityName) => {
    setTempSelected((prev) =>
      prev.includes(amenityName)
        ? prev.filter((name) => name !== amenityName)
        : [...prev, amenityName]
    );
  };

  const handleSaveAmenities = async () => {
    const newAmenities = allAmenities
      .filter((amenity) => tempSelected.includes(amenity.name))
      .map((amenity) => ({
        ...amenity,
        highlight: selectedAmenities.some(
          (a) => a.name === amenity.name && a.highlight
        ),
      }));

    setSelectedAmenities(newAmenities);
    await saveAmenitiesToFirebase(newAmenities);
    setShowModal(false);
  };

  const toggleHighlight = async (amenityName) => {
    const updatedAmenities = selectedAmenities.map((amenity) =>
      amenity.name === amenityName
        ? { ...amenity, highlight: !amenity.highlight }
        : amenity
    );

    setSelectedAmenities(updatedAmenities);
    await saveAmenitiesToFirebase(updatedAmenities);
  };

  const filteredAmenities = allAmenities.filter((amenity) =>
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return <div className="loading-spinner">Loading amenities...</div>;

  return (
    <div className="amenities-section">
      <h2 className="amenities-heading">Amenities</h2>
      <div className="amenities-grid">
        {selectedAmenities.map((item, index) => (
          <div
            className="amenity-card"
            key={index}
            onClick={() => toggleHighlight(item.name)}
          >
            {item.highlight && <div className="flag"></div>}
            <div className="icon">
              {iconComponents[item.icon] || <FaRegBuilding />}
            </div>
            <div className="label">{item.name}</div>
          </div>
        ))}
        <div className="add-amenity-card" onClick={handleAddAmenities}>
          <div className="plus-icon">
            <FaPlus />
          </div>
          <div className="label">Add Amenities</div>
        </div>
      </div>
      <div className="amenities-footer">
        <p className="show-more">
          Showing {selectedAmenities.length} of {allAmenities.length} amenities
        </p>
        <button className="contact-btn">Contact Builder</button>
      </div>

      {showModal && (
        <div className="amenities-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Select Amenities ({tempSelected.length} selected)</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
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
                Save {tempSelected.length} Amenities
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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
    "About Project",
    "Nearby Locations",
    "Units-Floor Plans",
    "Photo Gallery",
    "Ratings-Reviews",
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

const normalize = (str = "") =>
  str
    .replace(/^_+/, "")
    .replace(/_/g, " ")
    .replace(/\s*&\s*/g, " & ")
    .toLowerCase()
    .trim();

const capitalizeWords = (str = "") =>
  str.replace(/\b\w/g, (c) => c.toUpperCase());

const getCleanName = (raw = "", ...removeParts) => {
  let result = normalize(raw);

  // Remove all prefixes (state, city, country) from raw
  removeParts.forEach((part) => {
    const normalizedPart = normalize(part);
    if (result.startsWith(normalizedPart)) {
      result = result.slice(normalizedPart.length).trim();
    }
  });

  return capitalizeWords(result);
};

const formatAddress = ({ title, country, state, city, locality }) => {
  const cityName = getCleanName(city, state, country);
  const rawLocality = getCleanName(locality, city, state, country);

  // Don't repeat city if already in the locality
  const showCity =
    !normalize(rawLocality).includes(normalize(cityName)) &&
    cityName.length > 0;

  const locationText = showCity ? `${rawLocality}, ${cityName}` : rawLocality;

  return `By ${capitalizeWords(title)} | ${locationText}`;
};

// ✅ Example usage
const data = {
  title: "Green Valley",
  country: "_india",
  state: "_andaman_&_nicobar_islands",
  city: "_andaman_&_nicobar_islands_sri_vijaya_puram",
  locality: "_andaman_&_nicobar_islands_sri_vijaya_puram_cellular_jail_road",
};

console.log(formatAddress(data));

const SocietyOverview = ({ societyId }) => {
  const [societyData, setSocietyData] = useState({
    societyType: "",
    country: "India",
    state: "",
    city: "",
    locality: "",
    society: "New Society",
    builder: "",
    address: "",
    priceFrom: "",
    priceTo: "",
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
  const displayAddress = formatAddress({
    title: societyData.builder,
    country: societyData.country,
    state: societyData.state,
    city: societyData.city,
    locality: societyData.locality,
  });

  return (
    <div className="overview-section" id="Overview">
      <button className="edit-btn" onClick={() => setShowEditModal(true)}>
        <FaEdit />
      </button>

      <div className="society-header">
        <h1>{societyData.society}</h1>
        <div className="location">
          {/* Use the formatted address here */}
          {displayAddress}
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
        <div className="bhk">3 BHK Flats</div>
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

const EditModal = ({ data, onClose, onSave }) => {
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
          <div className="form-grid">
            <div className="form-group">
              <label>Society Type</label>
              <select
                name="societyType"
                value={formData.societyType}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Apartment">Apartment</option>
                <option value="Gated Community">Gated Community</option>
              </select>
            </div>

            <div className="form-group">
              <label>Society Name</label>
              <input
                type="text"
                name="society"
                value={formData.society}
                onChange={handleChange}
                placeholder="Enter society name"
                required
              />
            </div>

            <div className="form-group">
              <label>Builder Name</label>
              <input
                type="text"
                name="builder"
                value={formData.builder}
                onChange={handleChange}
                placeholder="Enter builder name"
              />
            </div>

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
                  placeholder="e.g. 2BHK"
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
            )}

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

  return (
    <div className={styles.container}>
      {/* Header Image Slider */}
      <div className={styles.heroSection}>
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
      </div>

      {/* Sticky Tab Bar */}
      <StickyTabBar />

      {/* Overview Section */}
      <div id="Overview" className={styles.contentWrapper}>
        <div className={styles.contact}>
          <div>
            <SocietyOverview societyId={id} />
          </div>
          <div>
            <ContactForm />
          </div>
        </div>

        {/* Buy Rent Tabs */}
        <div id="Available-Properties" className="propertyTabs">
          <div className={styles.tabs}>
            <h1 className={styles.tabH1}>
              Properties in Assetz Trees and Tandem
            </h1>
            <div>
              <button className={styles.activeTab}>Buy</button>
              <button>Rent</button>
            </div>
          </div>
          {/* Properties Grid */}
          <div className={styles.propertyGrid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.propertyCard}>
                <img
                  src={`/assets/img/society/${images[i]}`}
                  alt="Flat"
                  className={styles.propertyImg}
                />
                <div className={styles.cardContent}>
                  <h3>₹ 2.20 Cr</h3>
                  <p>3 BHK Flat for Sale in Assetz Trees and Tandem</p>
                  <button className={styles.outlineBtn}>Contact Builder</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div id="Amenities">
          <AmenitiesSection societyId={id} />
        </div>

        {/* About Project */}
        <div id="About-Project">
          <ProjectInfo societyData={society} />
        </div>

        {/* Location Advantages */}
        <div id="Nearby-Locations">
          <LocationAdvantages societyId={id} />
        </div>

        {/* Floor Plans */}
        <div id="Units-Floor-Plans">
          <FloorPlans />
        </div>

        {/* Photo Gallery */}
        <div id="Photo-Gallery">
          <GalleryPreview />
        </div>

        {/* ComponentBuilder */}
        <div id="ComponentBuilder">
          <ComponentBuilder />
        </div>

        {/* Reviews and Locality */}
        <div id="Ratings-Reviews">
          <ReviewSummary />
        </div>

        {/* About Developer */}
        <div id="About-Developer">
          {/* Optional: Add Developer info here */}
        </div>
      </div>
    </div>
  );
};

export default PGSocietyPage;
