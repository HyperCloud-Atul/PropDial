import React, { useState, useEffect } from "react";
import styles from "./PropertyListingPage.module.scss";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
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
import {
  doc,
  getDoc,
  updateDoc,
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
} from "react-icons/fa";
import { BsFileEarmarkText } from "react-icons/bs";
import { PiBuildingsDuotone } from "react-icons/pi";

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


const GalleryPreview = ({ societyId, societyName, societyType }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reference to the society's image folder in storage
  const societyFolderRef = ref(projectStorage, `society_images/${societyId}`);

  // Fetch existing images for this society
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await listAll(societyFolderRef);
        const urls = await Promise.all(
          res.items.map((itemRef) => getDownloadURL(itemRef))
        );
        setImages(urls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [societyId]);

  const handleUploadClick = () => {
    setEditMode(true);
    setSelectedImages([]);
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
  };

  // const handleDeleteAll = () => {
  //   setSelectedImages([]);
  // };

  const handleSaveAll = async () => {
  if (uploading) return; // Prevent multiple clicks
  
  setUploading(true);
  setUploadProgress(0);

  try {
    const newUrls = [];
    
    // Upload selected images sequentially
    for (const file of selectedImages) {
      const fileName = `${Date.now()}-${file.name}`;
      const imageRef = ref(projectStorage, `society_images/${societyId}/${fileName}`);
      const uploadTask = uploadBytesResumable(imageRef, file);

      const downloadURL = await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
          },
          (error) => reject(error),
          async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
        );
      });
      
      newUrls.push(downloadURL);
    }

    // Update state with new images
    setImages(prev => [...prev, ...newUrls]);
    setSelectedImages([]);
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
      // Get the reference to the image in storage
      const imageUrl = images[index];
      const imageRef = ref(projectStorage, imageUrl);

      // Delete from Firebase storage
      await deleteObject(imageRef);

      // Update local state
      setImages((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDeleteNew = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all images?")) {
      // Delete all new selected images
      setSelectedImages([]);

      // If no existing images, we're done
      if (images.length === 0) return;

      // Delete all existing images from Firebase
      Promise.all(
        images.map((url) => {
          const imageRef = ref(projectStorage, url);
          return deleteObject(imageRef).catch((error) => {
            console.error("Error deleting image:", error);
          });
        })
      ).then(() => {
        setImages([]);
      });
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
                style={{ display: 'none' }}
              />
            </label>
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
              {uploading ? 'Uploading...' : 'Save All'}
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
            {/* Show existing images with delete option */}
            {images.length > 0 && (
              <div className="existing-images-section">
                <h4>Existing Images</h4>
                <div className="selected-images-grid">
                  {images.map((url, index) => (
                    <div key={`existing-${index}`} className="selected-image-item">
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
            
            {/* Show newly selected images */}
            {selectedImages.length > 0 && (
              <div className="new-images-section">
                <h4>New Images to Upload</h4>
                <div className="selected-images-grid">
                  {selectedImages.map((file, index) => (
                    <div key={`new-${index}`} className="selected-image-item">
                      <img src={URL.createObjectURL(file)} alt={`Selected ${index}`} />
                      <button 
                        className="delete-image-btn"
                        onClick={() => handleDeleteNew(index)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
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

    // Rest of your existing renderGallery implementation...
    // ... (keep the non-edit mode parts the same)
    if (images.length === 0) {
      return (
        <div className="empty-gallery">
          <p>No images uploaded yet</p>
          <button className="upload-btn" onClick={handleUploadClick}>
            <FaUpload /> Upload Images
          </button>
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
        <h2 className="gallery-title">{societyName} - {societyType} Apartment</h2>
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
          <FaRegHeart className="icon" title="Save" />
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

// Define all amenities categorized as per the images
const allAmenitiesByCategory = {
  Club: [
    { name: "Club House", icon: "FaRegBuilding" },
    { name: "Steam Bath Room", icon: "FaShower" },
    { name: "Saltwater Pool (Indoor)", icon: "FaSwimmingPool" },
    { name: "Sauna Room", icon: "FaShower" },
    { name: "Swimming Pool (Indoor)", icon: "FaSwimmingPool" },
    { name: "Swimming Pool (Outdoor)", icon: "FaSwimmingPool" },
    { name: "Card Room", icon: "FaGamepad" },
    { name: "Party Room Small", icon: "MdMeetingRoom" },
    { name: "Party Room Big", icon: "MdMeetingRoom" },
    { name: "Sun Deck", icon: "FaTree" },
    { name: "Library", icon: "BsFileEarmarkText" },
    { name: "Roof Deck Lounge", icon: "FaRegBuilding" },
    { name: "Pool Deck Area", icon: "FaSwimmingPool" },
    { name: "Spa Massage Room", icon: "FaShower" },
    { name: "BBQ Area", icon: "FaRegBuilding" },
    { name: "Multi Utility Store", icon: "FaRegBuilding" },
    { name: "Bar", icon: "FaRegBuilding" },
    { name: "Jacuzzi Spa", icon: "FaSwimmingPool" },
    { name: "Valet service", icon: "FaRegBuilding" },
  ],
  "Sports & Fitness": [
    { name: "Cycle Track", icon: "FaWalking" },
    { name: "Meditation Area", icon: "FaPrayingHands" },
    { name: "Billiard Room", icon: "FaGamepad" },
    { name: "Gymnastic Room", icon: "FaDumbbell" },
    { name: "Squash Court", icon: "FaRegBuilding" },
    { name: "Gymnasium", icon: "FaDumbbell" },
    { name: "Badminton (Indoor)", icon: "FaRegBuilding" },
    { name: "Cricket Pitch", icon: "FaRegBuilding" },
    { name: "Rock Climbing Walls", icon: "FaRegBuilding" },
    { name: "Volleyball Court", icon: "FaRegBuilding" },
    { name: "Health Club", icon: "FaDumbbell" },
    { name: "Badminton (Outdoor)", icon: "FaRegBuilding" },
    { name: "Football Ground", icon: "FaRegBuilding" },
    { name: "Skating Ring", icon: "FaGamepad" },
    { name: "Basket Ball", icon: "FaRegBuilding" },
    { name: "Golf Course", icon: "FaRegBuilding" },
    { name: "Skating Track", icon: "FaGamepad" },
    { name: "Tennis Court", icon: "FaRegBuilding" },
    { name: "Table Tennis", icon: "FaGamepad" },
    { name: "Bowling Alley", icon: "FaGamepad" },
    {
      name: "Dance Room",
      icon: "FaRegBuilding",
    },
    {
      name: "Yoga Deck",
      icon: "FaPrayingHands",
    },
    {
      name: "Horsebacking Ride",
      icon: "FaRegBuilding",
    },
    {
      name: "Garden Gym",
      icon: "FaDumbbell",
    },
    {
      name: "Yoga Room",
      icon: "FaPrayingHands",
    },
    {
      name: "Cricket Ground",
      icon: "FaRegBuilding",
    },
    {
      name: "Pool Table",
      icon: "FaGamepad",
    },
    {
      name: "Jogging Track",
      icon: "FaWalking",
    },
  ],
  "For Children": [
    { name: "Kids Pool", icon: "FaSwimmingPool" },
    { name: "Toddler Pool", icon: "FaSwimmingPool" },
    { name: "Heated Lap Pool", icon: "FaSwimmingPool" },
    { name: "Children Play Area (Indoor)", icon: "FaGamepad" },
    { name: "Children Play Area (Outdoor)", icon: "FaGamepad" },
    { name: "Creche and daycare", icon: "FaRegBuilding" },
    { name: "Miniature Golf", icon: "FaRegBuilding" },
    { name: "Dance Room", icon: "FaRegBuilding" },
    { name: "Yoga Deck", icon: "FaPrayingHands" },
    { name: "Horseback Riding", icon: "FaRegBuilding" },
    { name: "Play School", icon: "FaRegBuilding" },
    { name: "Pre-Primary School", icon: "FaRegBuilding" },
    { name: "Primary School", icon: "FaRegBuilding" },
  ],
  "Safety & Security": [
    { name: "cctv-in Common Area", icon: "FaVideo" },
    { name: "Fire Fighting", icon: "FaUserShield" },
    { name: "Intercom", icon: "FaUserShield" },
    { name: "PNG (Pipeline gas)", icon: "FaUserShield" },
    { name: "Security (3 tier)", icon: "FaUserShield" },
    { name: "Security (Roaming)", icon: "FaUserShield" },
    { name: "Security (Single Guard)", icon: "FaUserShield" },
  ],
  "General Amenities": [
    { name: "Central Garden Atrium", icon: "FaTree" },
    { name: "Outdoor Party Area", icon: "FaRegBuilding" },
    { name: "Cafeteria", icon: "FaRegBuilding" },
    { name: "Laundry Service", icon: "FaRegBuilding" },
    { name: "Convenience Store", icon: "FaRegBuilding" },
    { name: "Saloon", icon: "FaRegBuilding" },
    { name: "Concierge", icon: "FaRegBuilding" },
    { name: "Lounge Area", icon: "FaRegBuilding" },
    { name: "Fountain", icon: "FaRegBuilding" },
    { name: "Sky Garden", icon: "FaTree" },
    { name: "Conference Room", icon: "MdMeetingRoom" },
    { name: "Meeting Room", icon: "MdMeetingRoom" },
    { name: "Medical Store", icon: "FaRegBuilding" },
    { name: "Sky Lounge", icon: "FaRegBuilding" },
    { name: "Extended Sky Patios", icon: "FaRegBuilding" },
    { name: "Mini Theater", icon: "FaRegBuilding" },
    { name: "Vegetable Shop", icon: "FaRegBuilding" },
    { name: "Gazebos", icon: "FaRegBuilding" },
    { name: "Restaurant", icon: "FaRegBuilding" },
    { name: "24 Hour Water Supply", icon: "FaShower" },
    { name: "Car Parking (Basement)", icon: "FaParking" },
    { name: "Car Parking (Under Shade)", icon: "FaParking" },
    { name: "Car Parking (For Visitors)", icon: "FaParking" },
    { name: "Car Parking (Open)", icon: "FaParking" },
    { name: "Designated Pet Area", icon: "FaTree" },
    { name: "Gardens", icon: "FaTree" },
    { name: "Lifts", icon: "MdElevator" },
    { name: "High Speed Lifts", icon: "MdElevator" },
    { name: "Landscaped Gardens", icon: "FaTree" },
    { name: "Rainwater Harvesting", icon: "FaShower" },
    { name: "Power Back (Full)", icon: "FaBolt" },
    { name: "Power Backup (Partial)", icon: "FaBolt" },
    { name: "Power Back (Lift Only)", icon: "FaBolt" },
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
      <h2 className="amenities-heading">Amenities</h2>

      {/* Navigation Bar for Categories */}
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

      <div className="amenities-grid">
        {selectedAmenities[activeCategory]?.map((item, index) => (
          <div
            className={`amenity-card ${item.highlight ? "highlighted" : ""}`}
            key={index}
            onClick={() => toggleHighlight(item.name, activeCategory)}
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
          Showing {selectedAmenities[activeCategory]?.length || 0} of{" "}
          {allAmenitiesByCategory[activeCategory].length} amenities in{" "}
          {activeCategory}
        </p>
        <button className="contact-btn">Contact Builder</button>
      </div>

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

function formatStateName(slug) {
  return slug
    .replace(/-/g, " ") // Replace dashes with spaces
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" ");
}

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
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Both">Both</option>
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
          <div className="form-grid">
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

const EditRates = ({ data, onClose, onSave }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Send all updated data back to parent
  };

  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h2>Edit Society Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Electricity Rate (Authority)</label>
              <input
                type="number"
                name="electricityRateAuthority"
                value={formData.electricityRateAuthority}
                onChange={handleChange}
                placeholder="Enter electricity rate (Authority)"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Electricity Rate (Power Backup)</label>
              <input
                type="number"
                name="electricityRatePowerBackup"
                value={formData.electricityRatePowerBackup}
                onChange={handleChange}
                placeholder="Enter electricity rate (Power Backup)"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Water Charges</label>
              <input
                type="number"
                name="waterCharges"
                value={formData.waterCharges}
                onChange={handleChange}
                placeholder="Enter Water Charges"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Common Area Maintenance</label>
              <input
                type="number"
                name="commonAreaMaintenance"
                value={formData.commonAreaMaintenance}
                onChange={handleChange}
                placeholder="Enter Common Area Maintenance Charges"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Common Area Electricity</label>
              <input
                type="number"
                name="commonAreaElectricity"
                value={formData.commonAreaElectricity}
                onChange={handleChange}
                placeholder="Enter Common Area Electricity Charges"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Club Charges</label>
              <input
                type="number"
                name="clubCharges"
                value={formData.clubCharges}
                onChange={handleChange}
                placeholder="Enter Club Charges"
                min="0"
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

const MeetingPoint = ({ state, city, locality }) => {
  const formattedState = formatStateName(state);
  const formattedCity = formatStateName(city);
  const formattedLocality = formatStateName(locality);
  return (
    <div className="meeting-point-section">
      <h2>Where we’ll meet</h2>
      <div className="location">
        <FaMapMarkerAlt className="location-icon" /> {formattedLocality},{" "}
        {formattedCity}, {formattedState}
      </div>
      <div className="map-container">
        <iframe
          title="Meeting Point"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61291.449298734176!2d73.8777386!3d15.5026635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb4fd095d6bff%3A0x427e9f60f589e059!2sViceroy's%20Arch!5e0!3m2!1sen!2sin!4v1694150123456!5m2!1sen!2sin"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
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
  const [images, setImages] = useState(['/hero1.jpg']); // Default image
  const [viewerOpen, setViewerOpen] = useState(false);
  const [allImages, setAllImages] = useState([]); // All images from storage for viewer

  // Fetch images from Firebase Storage
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const societyFolderRef = ref(projectStorage, `society_images/${societyId}`);
        const res = await listAll(societyFolderRef);
        const urls = await Promise.all(
          res.items.map((itemRef) => getDownloadURL(itemRef))
        );
        
        if (urls.length > 0) {
          setImages(urls.slice(0, 6)); // Slider images
          setAllImages(urls); // All images for viewer
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [societyId]);

  // Auto-slide images with right-to-left movement
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const openImageViewer = (index) => {
    setViewerOpen(true);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const viewerGoToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const viewerGoToNext = () => {
    setCurrentIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

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
              />
            </div>
          ))}
        </div>
      </div>

      <button 
        className="view-all-btn"
        onClick={() => openImageViewer(currentIndex)}
      >
        View All Photos
      </button>

      <div className="dots-wrapper">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${currentIndex === idx ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          ></span>
        ))}
      </div>

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
            <button className="close-viewer" onClick={() => setViewerOpen(false)}>
              <FaTimes />
            </button>
            <button className="nav-button prev" onClick={viewerGoToPrevious}>
              <FaChevronLeft />
            </button>
            <img
              src={allImages[currentIndex]}
              alt={`Gallery ${currentIndex}`}
              className="viewer-image"
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
      <HeroSection societyId={id} />

      {/* Sticky Tab Bar */}
      <StickyTabBar />

      {/* Overview Section */}

      <div id="Overview" className={styles.contentWrapper}>
        <div className={styles.overviewSection}>
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
        </div>

        {/* Buy Rent Tabs */}
        <div>
          {/* Available Properties Section */}
          <AvailableProperties societyName={society.society} />
        </div>

        {/* Amenities */}
        <div id="Amenities">
          <AmenitiesSection societyId={id} />
        </div>

        {/* About Project */}
        <div id="About-Project" className="projectInfoSection">
          <ProjectInfo societyId={id} />
        </div>

        {/* Location Advantages */}
        <div id="Nearby-Locations" className="locationAdvantages">
          <LocationAdvantages societyId={id} />
        </div>

        {/* Floor Plans */}
        <div id="Units-Floor-Plans" className="floorPlansSection">
          <FloorPlans />
        </div>

        {/* Photo Gallery */}
        <div id="Photo-Gallery" className="gallerySection">
          <GalleryPreview societyId={id} societyName={society.society} societyType={society.societyType} />
        </div>

        {/* Meeting Point */}
        <div id="Meeting-Point" className="meetingPointSection">
          <MeetingPoint state={state} city={city} locality={locality} />
        </div>

        {/* ComponentBuilder */}
        {/* <div id="ComponentBuilder">
          <ComponentBuilder />
        </div> */}

        {/* Things to Know */}
        <div id="Things-to-Know" className="thingsToKnowSection">
          <ThingsToKnow societyId={id} />
        </div>

        {/* Reviews and Locality */}
        <div id="Ratings-Reviews" className="reviewsSection">
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
