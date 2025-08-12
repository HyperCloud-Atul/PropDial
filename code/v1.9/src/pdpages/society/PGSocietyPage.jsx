import React, { useState, useEffect, useRef } from "react";
import styles from "./PropertyListingPage.module.scss";
import { collection, query, where, getDocs, limit, onSnapshot,setDoc  } from "firebase/firestore";
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
  FaSave,
} from "react-icons/fa";
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { BsFileEarmarkText } from "react-icons/bs";
import { PiBuildingsDuotone } from "react-icons/pi";
import Modal from 'react-modal';

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
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDeleteNew = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
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
      } catch (error) {
        console.error("Error deleting all images:", error);
      }
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
                  {selectedImages.map((file, index) => (
                    <div key={`new-${index}`} className="selected-image-item">
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

const FloorPlans = ({ societyId }) => {
  // State for floor plans
  const [floorPlans, setFloorPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newUnitType, setNewUnitType] = useState('BHK');
  const [newUnitValue, setNewUnitValue] = useState('1');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [sizeUnit, setSizeUnit] = useState('Sq-ft');
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
      images: []
    };

    const updatedPlans = [...floorPlans, newPlan];
    setFloorPlans(updatedPlans);
    setSelectedPlan(newPlan);
    setNewUnitType('BHK');
    setNewUnitValue('1');
    setMinSize('');
    setMaxSize('');
  };

  // Delete an entire unit type with all its images
  const deleteUnitType = async (index) => {
    if (!window.confirm(`Are you sure you want to delete this unit type and all its images?`)) return;

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
      setSelectedPlan(updatedPlans.length > 0 ? 
        (updatedPlans[index] || updatedPlans[updatedPlans.length - 1]) : 
        null
      );
    } catch (error) {
      console.error("Error deleting unit type:", error);
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => [...prev, ...files]);
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
        const fileName = `${timestamp}-${file.name.replace(/\s+/g, '_')}`; // Replace spaces with underscores
        const imageRef = ref(
          projectStorage,
          `society_images/${societyId}/${fileName}`
        );
        
        const uploadTask = uploadBytesResumable(imageRef, file);
        
        const downloadURL = await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
      const updatedPlans = floorPlans.map(plan => {
        if (plan.type === selectedPlan.type && plan.value === selectedPlan.value) {
          return {
            ...plan,
            images: [...plan.images, ...uploadedUrls]
          };
        }
        return plan;
      });

      setFloorPlans(updatedPlans);
      setSelectedPlan({
        ...selectedPlan,
        images: [...selectedPlan.images, ...uploadedUrls]
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
      const updatedPlans = floorPlans.map(plan => {
        if (plan.type === selectedPlan.type && plan.value === selectedPlan.value) {
          return {
            ...plan,
            images: plan.images.filter(img => img !== imageUrl)
          };
        }
        return plan;
      });

      setFloorPlans(updatedPlans);
      setSelectedPlan({
        ...selectedPlan,
        images: selectedPlan.images.filter(img => img !== imageUrl)
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
        <div key={`${plan.type}-${plan.value}-${index}`} className="unit-btn-container">
          <button
            className={`unit-btn ${selectedPlan?.type === plan.type && selectedPlan?.value === plan.value ? 'active' : ''}`}
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
                  {selectedPlan.value} {selectedPlan.type} - {selectedPlan.minSize} to {selectedPlan.maxSize} {selectedPlan.sizeUnit}
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
                      style={{ display: 'none' }}
                    />
                  </label>
                  {selectedImages.length > 0 && (
                    <button onClick={uploadImages} disabled={uploading} className="upload-submit-btn">
                      {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload Images'}
                    </button>
                  )}
                </div>
              </div>

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="selected-images">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="image-preview">
                      <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                      <button onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}>
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
            <button onClick={saveFloorPlans} disabled={floorPlans.length === 0} className="save-btn">
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
                {selectedPlan.value} {selectedPlan.type} - {selectedPlan.minSize} to {selectedPlan.maxSize} {selectedPlan.sizeUnit}
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
        mapLink: tempMapLink
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
              How to get the embed link: On Google Maps, click "Share" → "Embed a map" → Copy the iframe src URL
            </small>
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-button">
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
              src={mapLink || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61291.449298734176!2d73.8777386!3d15.5026635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb4fd095d6bff%3A0x427e9f60f589e059!2sViceroy's%20Arch!5e0!3m2!1sen!2sin!4v1694150123456!5m2!1sen!2sin"}
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
          View All Photos ({allImages.length})
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
  const [newVideo, setNewVideo] = useState({ url: '', title: '', category: '' });
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Fetch videos from Firestore
    useEffect(() => {
    const societyDocRef = doc(projectFirestore, "m_societies", societyId);
    
    const unsubscribe = onSnapshot(societyDocRef, (doc) => {
      if (doc.exists) {  // <-- Correct property access
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

    slider.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => slider.removeEventListener('scroll', handleScroll);
  }, [videos]);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVideo({ ...newVideo, [name]: value });
  };

  const extractVideoId = (url) => {
    // Handle regular YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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
      alert('Please enter a valid YouTube URL');
      return;
    }

    try {
      await projectFirestore
        .collection('m_societies')
        .doc(societyId)
        .update({
          videos: [...videos, { 
            id: videoId, 
            title: newVideo.title, 
            category: newVideo.category 
          }]
        });

      setNewVideo({ url: '', title: '', category: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Failed to add video');
    }
  };

  const handleDeleteVideo = async (index) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    try {
      const updatedVideos = [...videos];
      updatedVideos.splice(index, 1);
      
      await projectFirestore
        .collection('m_societies')
        .doc(societyId)
        .update({ videos: updatedVideos });
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  };

  return (
    <div className="yt-slider-container">
      <div className="yt-slider-header">
        <h2 className="yt-slider-title">{title}</h2>
        <button 
          className="yt-add-btn" 
          onClick={() => setShowForm(!showForm)}
        >
          <FaPlus /> Add Video
        </button>
      </div>

      {showForm && (
        <div className="yt-video-form">
          <button 
            className="yt-close-form" 
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
            <div className="form-group">
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={newVideo.category}
                onChange={handleInputChange}
                placeholder="Video category"
                required
              />
            </div>
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
                  <span>{video.category}</span>
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
      name: '',
      designation: 'Society Manager',
      mobile: '',
      email: '',
      responseRate: '100%',
      responseTime: 'within an hour'
    },
    maintenance: {
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      contractStart: '',
      contractEnd: ''
    }
  });

  // Fetch existing society info
  useEffect(() => {
    const fetchSocietyInfo = async () => {
      try {
        const docRef = doc(projectFirestore, 'm_societies', societyId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            manager: {
              name: data.manager?.name || '',
              designation: data.manager?.designation || 'Society Manager',
              mobile: data.manager?.mobile || '',
              email: data.manager?.email || '',
              responseRate: data.manager?.responseRate || '100%',
              responseTime: data.manager?.responseTime || 'within an hour'
            },
            maintenance: {
              companyName: data.maintenance?.companyName || '',
              contactPerson: data.maintenance?.contactPerson || '',
              phone: data.maintenance?.phone || '',
              email: data.maintenance?.email || '',
              contractStart: data.maintenance?.contractStart || '',
              contractEnd: data.maintenance?.contractEnd || ''
            }
          });
        } else {
          console.log("No such document for societyId:", societyId);
        }
      } catch (error) {
        console.error('Error fetching society info:', error);
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
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(projectFirestore, 'm_societies', societyId);
      await updateDoc(docRef, formData);
      setEditMode(false);
      // alert('Information saved successfully!'); // Use custom modal instead
    } catch (error) {
      console.error('Error updating society info:', error);
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
                onChange={(e) => handleInputChange(e, 'manager')}
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
                  onChange={(e) => handleInputChange(e, 'manager')}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.manager.email}
                  onChange={(e) => handleInputChange(e, 'manager')}
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
                  onChange={(e) => handleInputChange(e, 'manager')}
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
                  onChange={(e) => handleInputChange(e, 'manager')}
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
                onChange={(e) => handleInputChange(e, 'maintenance')}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Person:</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.maintenance.contactPerson}
                onChange={(e) => handleInputChange(e, 'maintenance')}
              />
            </div>

            <div className="contact-grid">
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.maintenance.phone}
                  onChange={(e) => handleInputChange(e, 'maintenance')}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.maintenance.email}
                  onChange={(e) => handleInputChange(e, 'maintenance')}
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
                  onChange={(e) => handleInputChange(e, 'maintenance')}
                />
              </div>
              <div className="form-group">
                <label>Contract End:</label>
                <input
                  type="date"
                  name="contractEnd"
                  value={formData.maintenance.contractEnd}
                  onChange={(e) => handleInputChange(e, 'maintenance')}
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
              <h3>{formData.manager.name || 'Not specified'}</h3>
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
              <h3>{formData.maintenance.companyName || 'Not specified'}</h3>
              <span className="card-badge">Maintenance Company</span>
            </div>
            <div className="card-dates">
              <div className="date-item">
                <span>Contract Start:</span>
                <span>{formData.maintenance.contractStart || '-'}</span>
              </div>
              <div className="date-item">
                <span>Contract End:</span>
                <span>{formData.maintenance.contractEnd || '-'}</span>
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
          <FloorPlans societyId={id} />
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
        <div id="Meeting-Point" className="meetingPointSection">
          <MeetingPoint state={state} city={city} locality={locality} societyId={id} />
        </div>

        {/* ComponentBuilder */}
        {/* <div id="ComponentBuilder">
          <ComponentBuilder />
        </div> */}

        {/* YouTube Video Slider */}
        <div id="YouTube-Videos" className="videoSection">
          <YouTubeVideoSlider societyId={id} title="Property Videos" />
        </div>

        {/* Society management info */}
        <div id="Society-Management" className="societyInfoSection">
          <SocietyInfoForm societyId={id} />
        </div>

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
