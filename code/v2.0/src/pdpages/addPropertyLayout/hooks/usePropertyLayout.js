import { useState, useEffect } from "react";
import { projectFirestore, projectStorage } from "../../../firebase/config";
import firebase from 'firebase/compat/app';
import imageCompression from "browser-image-compression";

// Default fixtures constant
const defaultFixtures = ["Walls", "Roof", "Floor", "Switches & Sockets"];

const usePropertyLayout = (propertyLayoutId, user) => {
  const [propertyId, setPropertyId] = useState("");
  const [propertyDocument, setPropertyDocument] = useState(null);
  const [layouts, setLayouts] = useState({});
  const [updateInfo, setUpdateInfo] = useState([]);
  const [openField, setOpenField] = useState(null);
  const [isLayoutSaving, setIsLayoutSaving] = useState(false);
  const [afterSaveModal, setAfterSaveModal] = useState(false);
  const [imageActionStatus, setImageActionStatus] = useState(null);

  useEffect(() => {
    const fetchPropertyLayout = async () => {
      try {
        const layoutRef = projectFirestore
          .collection("property-layout-propdial")
          .doc(propertyLayoutId);
        const layoutSnap = await layoutRef.get();

        if (layoutSnap.exists) {
          const layoutData = layoutSnap.data();
          setPropertyId(layoutData.propertyId || "");
          setLayouts(layoutData.layouts || {});
          setUpdateInfo(layoutData.updateInformation || []);

          if (layoutData.propertyId) {
            fetchPropertyDetails(layoutData.propertyId);
          }
        }
      } catch (error) {
        console.error("Error fetching property layout:", error);
      }
    };

    if (propertyLayoutId) {
      fetchPropertyLayout();
    }
  }, [propertyLayoutId]);

  const fetchPropertyDetails = (propId) => {
    const propRef = projectFirestore
      .collection("properties-propdial")
      .doc(propId);

    return propRef.onSnapshot(
      (propSnap) => {
        if (propSnap.exists) {
          const propertyData = propSnap.data();
          setPropertyDocument(propertyData);
          if (propertyData.layouts) {
            setLayouts(propertyData.layouts);
          }
        }
      },
      (error) => {
        console.error("Error fetching property details:", error);
      }
    );
  };

  // ✅ NEW: Initialize room with default fixtures when opened
  const toggleField = (roomKey) => {
    setOpenField((prev) => {
      if (prev === roomKey) {
        return null;
      } else {
        // Initialize room with default fixtures if it doesn't exist
        if (!layouts[roomKey]) {
          setLayouts((prevLayouts) => ({
            ...prevLayouts,
            [roomKey]: {
              fixtureBySelect: defaultFixtures, // ✅ Default fixtures set here
            },
          }));
        }
        return roomKey;
      }
    });
  };

  const handleChange = (roomKey, field, value) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      [roomKey]: {
        ...prevLayouts[roomKey],
        [field]: value,
      },
    }));
  };

  const handleMultiSelectChange = (roomKey, selectedOptions) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      [roomKey]: {
        ...prevLayouts[roomKey],
        fixtureBySelect: selectedOptions.map((option) => option.value),
      },
    }));
  };

  const handleFlooringChange = (roomKey, selectedOption) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      [roomKey]: {
        ...prevLayouts[roomKey],
        flooringType: selectedOption.value,
      },
    }));
  };

  const uploadImage = async (roomKey, file, onProgress) => {
    setImageActionStatus("uploading");
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });

      const storageRef = projectStorage.ref();
      const fileRef = storageRef.child(
        `property-layout/${propertyLayoutId}/${roomKey}/${file.name}`
      );

      const uploadTask = fileRef.put(compressedFile);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            setImageActionStatus(null);
            reject(error);
          },
          async () => {
            const downloadURL = await fileRef.getDownloadURL();
            setImageActionStatus(null);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Image upload error:", error);
      setImageActionStatus(null);
      throw error;
    }
  };

  const handleImageUpload = async (e, roomKey) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const existingImages = layouts[roomKey]?.images || [];

    if (existingImages.length + files.length > 5) {
      alert("You can only upload up to 5 images per room.");
      return;
    }

    const validImages = files.filter((file) => allowedTypes.includes(file.type));
    if (validImages.length !== files.length) {
      alert("Only JPG and PNG images are allowed.");
      return;
    }

    for (let file of validImages) {
      let progress = 0;
      const url = await uploadImage(roomKey, file, (p) => (progress = p));
      const newImage = { url, name: file.name };

      // Update local state
      setLayouts((prev) => ({
        ...prev,
        [roomKey]: {
          ...prev[roomKey],
          images: [...(prev[roomKey]?.images || []), newImage],
        },
      }));

      // Update Firestore collections
      const layoutRef = projectFirestore
        .collection("property-layouts")
        .doc(propertyLayoutId);
      await layoutRef.set(
        {
          [roomKey]: {
            images: firebase.firestore.FieldValue.arrayUnion(newImage),
          },
        },
        { merge: true }
      );

      const propertyRef = projectFirestore
        .collection("properties-propdial")
        .doc(propertyId);
      await propertyRef.set(
        {
          layoutImages: {
            [roomKey]: firebase.firestore.FieldValue.arrayUnion(newImage),
          },
        },
        { merge: true }
      );
    }
  };

  const handleDeleteImage = (roomKey, index) => {
    const imageToDelete = layouts[roomKey]?.images?.[index];
    if (!imageToDelete) return;
    setImageActionStatus("deleting");
    
    const fileRef = projectStorage.refFromURL(imageToDelete.url);

    fileRef
      .delete()
      .then(async () => {
        const updatedImages = [...layouts[roomKey].images];
        updatedImages.splice(index, 1);

        // Update UI
        setLayouts((prev) => ({
          ...prev,
          [roomKey]: {
            ...prev[roomKey],
            images: updatedImages,
          },
        }));

        // Update Firestore
        const layoutRef = projectFirestore
          .collection("property-layouts")
          .doc(propertyLayoutId);
        await layoutRef.update({
          [`${roomKey}.images`]: firebase.firestore.FieldValue.arrayRemove(imageToDelete),
        });

        const propertyRef = projectFirestore
          .collection("properties-propdial")
          .doc(propertyId);
        await propertyRef.update({
          [`layoutImages.${roomKey}`]: firebase.firestore.FieldValue.arrayRemove(imageToDelete),
        });
        
        setImageActionStatus(null);
      })
      .catch((error) => {
        console.error("Image delete error:", error);
        setImageActionStatus(null);
      });
  };

  const saveData = () => {
    const newUpdate = {
      updatedAt: new Date().toISOString(),
      updatedBy: user?.phoneNumber,
    };
    
    setIsLayoutSaving(true);

    // ✅ Ensure default fixtures are included in the save data
    const layoutsWithDefaults = { ...layouts };
    
    // Check if any room has fixtureBySelect, if not add default fixtures
    Object.keys(layoutsWithDefaults).forEach(roomKey => {
      if (!layoutsWithDefaults[roomKey].fixtureBySelect) {
        layoutsWithDefaults[roomKey].fixtureBySelect = defaultFixtures;
      }
    });

    const finalData = {
      layouts: layoutsWithDefaults, // ✅ Use the updated layouts with defaults
      updatedAt: newUpdate.updatedAt,
      updatedBy: newUpdate.updatedBy,
      updateInformation: [...updateInfo, newUpdate],
    };

    projectFirestore
      .collection("property-layout-propdial")
      .doc(propertyLayoutId)
      .update(finalData)
      .then(() => {
        setAfterSaveModal(true);
        setIsLayoutSaving(false);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        setIsLayoutSaving(false);
      });
  };

  return {
    propertyId,
    propertyDocument,
    layouts,
    updateInfo,
    openField,
    toggleField, // ✅ Return the new toggleField function
    handleChange,
    handleMultiSelectChange,
    handleFlooringChange,
    handleImageUpload,
    handleDeleteImage,
    isLayoutSaving,
    afterSaveModal,
    setAfterSaveModal,
    saveData,
    imageActionStatus
  };
};

export default usePropertyLayout;