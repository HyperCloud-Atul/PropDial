import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "react-image-gallery/styles/css/image-gallery.css";
import Gallery from "react-image-gallery";
import { projectStorage } from "../../firebase/config";
import { useRef } from "react";
import Switch from "react-switch";
import { Navigate, Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { projectFirestore } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { timestamp } from "../../firebase/config";
import { format } from "date-fns";
import RichTextEditor from "react-rte";

import "./UserList.css";

// component
import PropertyImageGallery from "../PropertyImageGallery";
const PropertyDetails = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  // get user from useauthcontext
  const { propertyid } = useParams();
  const { user } = useAuthContext();

  const { document: propertyDocument, error: propertyDocError } = useDocument(
    "properties",
    propertyid
  );

  const [propertyManagerDoc, setpropertyManagerDoc] = useState(null);
  const [propertyOwnerDoc, setpropertyOwnerDoc] = useState(null);
  const [propertyCoOwnerDoc, setpropertyCoOwnerDoc] = useState(null);
  const [propertyPOCDoc, setpropertyPOCDoc] = useState(null);
  const [propertyOnboardingDateFormatted, setPropertyOnboardingDateFormatted] =
    useState();

  // add data of tenant in firebase start
  const { documents: tenantDocument, errors: tenantDocError } = useCollection(
    "tenants",
    ["propertyId", "==", propertyid]
  );

  const { addDocument, error } = useFirestore("tenants");
  // upload tenant code start
  const [tenantName, setTenantName] = useState("");
  const [editingTenantId, setEditingTenantId] = useState(null);
  const [tenantMobile, setTenantMobile] = useState("");
  const [isTenantEditing, setIsTenantEditing] = useState(false);
  const [selectedTenantImage, setSelectedTenantImage] = useState(null);
  const [previewTenantImage, setPreviewTenantImage] = useState(null);
  // const handleEditTenantToggle = () => {
  //   setIsTenantEditing(!isTenantEditing);
  // };

  const handleNameChange = (tenantId, newName) => {
    setTenantName((prev) => ({
      ...prev,
      [tenantId]: newName,
    }));
  };

  const handleMobileChange = (tenantId, newMobile) => {
    setTenantMobile((prev) => ({
      ...prev,
      [tenantId]: newMobile,
    }));
  };

  const handleEditTenantToggle = (tenantId) => {
    const tenant = tenantDocument?.find((tenant) => tenant.id === tenantId);
    if (tenant) {
      setEditingTenantId(tenantId);
      setTenantName((prev) => ({
        ...prev,
        [tenantId]: tenant.name,
      }));
      setTenantMobile((prev) => ({
        ...prev,
        [tenantId]: tenant.mobile,
      }));
    } else {
      console.error("Tenant not found or tenantDocument is undefined");
    }
  };

  const updateTenantDetails = async (tenantId, name, mobile) => {
    try {
      await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .update({ name, mobile });
      console.log("Document updated successfully");
    } catch (error) {
      console.log("Error updating document:", error);
    }
  };

  const handleSaveTenant = async (tenantId) => {
    if (
      tenantName[tenantId] !== undefined &&
      tenantMobile[tenantId] !== undefined
    ) {
      await updateTenantDetails(
        tenantId,
        tenantName[tenantId],
        tenantMobile[tenantId]
      );
    }
    setEditingTenantId(null);
  };


  //Property Layout
  const [propertyLayout, setPropertyLayout] = useState({
    RoomType: "",
    RoomName: "",
    RoomLength: "",
    RoomWidth: "",
    RoomTotalArea: "",
    RoomFixtures: [],
    RoomImgUrl: "",
  });

  const handlePropertyLayout = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const roomData = {
      propertyId: propertyid,
      roomType: propertyLayout.RoomType,
      roomName: propertyLayout.RoomName.trim(),
      roomLength: propertyLayout.RoomLength.trim(),
      roomWidth: propertyLayout.RoomWidth.trim(),
      roomTotalArea: "",
      roomFixtures: propertyLayout.RoomFixtures,
      roomImgUrl: "",
    };
    console.log('Room Data:', roomData)
    // await addDocument(roomData);
    if (error) {
      console.log("response error");
    }
  }


  //Tenant Information
  const handleAddTenant = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const tenantData = {
      propertyId: propertyid,
      name: "",
      mobile: "",
      whatsappNumber: "",
      status: "active",
      tenantImgUrl: "",
      onBoardingDate: "",
      offBoardingDate: "",
      idNumber: "",
      address: "",
      emailId: "",
      rentStartDate: "",
      rentEndDate: "",
    };

    await addDocument(tenantData);
    if (error) {
      console.log("response error");
    }
    // setIsTenantEditing(!isTenantEditing);
  };

  const handleTenantImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedTenantImage(file);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewTenantImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveTenantImage = () => {
    setSelectedTenantImage(null);
    setPreviewTenantImage(null);
  };

  const getImageSrc = () => {
    if (isTenantEditing && !previewTenantImage) {
      return "/assets/img/upload_img_small.png";
    } else if (previewTenantImage) {
      return previewTenantImage;
    } else {
      return "/assets/img/dummy_user.png";
    }
  };

  // upload tenant code end

  // add data of tenant in firebase end

  // let propertyOnboardingDateFormatted = "date";
  useEffect(() => {
    if (propertyDocument) {
      const propertyOnboardingDate = new Date(
        propertyDocument.onboardingDate.seconds * 1000
      );
      // console.log('Property Onboarding Date after:', propertyOnboardingDate)
      setPropertyOnboardingDateFormatted(
        format(propertyOnboardingDate, "dd MMMM, yyyy")
      );
      // console.log('Property Onboarding Date formatted:', propertyOnboardingDateFormatted)
    }

    if (propertyDocument && propertyDocument.propertyManager) {
      const propertyManagerRef = projectFirestore
        .collection("users")
        .doc(propertyDocument.propertyManager);

      const unsubscribe = propertyManagerRef.onSnapshot(
        (snapshot) => {
          // need to make sure the doc exists & has data
          if (snapshot.data()) {
            setpropertyManagerDoc({ ...snapshot.data(), id: snapshot.id });
          } else {
            console.log("No such document exists");
          }
        },
        (err) => {
          console.log(err.message);
        }
      );
    }

    //Property Owner Document
    if (propertyDocument && propertyDocument.propertyOwner) {
      const propertyOwnerRef = projectFirestore
        .collection("users")
        .doc(propertyDocument.propertyOwner);

      const unsubscribe = propertyOwnerRef.onSnapshot(
        (snapshot) => {
          // need to make sure the doc exists & has data
          if (snapshot.data()) {
            setpropertyOwnerDoc({ ...snapshot.data(), id: snapshot.id });
          } else {
            console.log("No such document exists");
          }
        },
        (err) => {
          console.log(err.message);
        }
      );
    }

    //Property Owner Document
    if (propertyDocument && propertyDocument.propertyCoOwner) {
      const propertyCoOwnerRef = projectFirestore
        .collection("users")
        .doc(propertyDocument.propertyCoOwner);

      const unsubscribe = propertyCoOwnerRef.onSnapshot(
        (snapshot) => {
          // need to make sure the doc exists & has data
          if (snapshot.data()) {
            setpropertyCoOwnerDoc({ ...snapshot.data(), id: snapshot.id });
          } else {
            console.log("No such document exists");
          }
        },
        (err) => {
          console.log(err.message);
        }
      );
    }

    //Property Owner POC Document
    if (propertyDocument && propertyDocument.propertyPOC) {
      const propertyPOCRef = projectFirestore
        .collection("users")
        .doc(propertyDocument.propertyPOC);

      const unsubscribe = propertyPOCRef.onSnapshot(
        (snapshot) => {
          // need to make sure the doc exists & has data
          if (snapshot.data()) {
            setpropertyPOCDoc({ ...snapshot.data(), id: snapshot.id });
          } else {
            console.log("No such document exists");
          }
        },
        (err) => {
          console.log(err.message);
        }
      );
    }
  }, [propertyDocument]);

  // variable of property age
  const ageOfProperty = ""; //2023 - propertyDocument.yearOfConstruction;
  // variable of property age

  // share url code
  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          // title: `${property.unitNumber} - ${property.society}`,
          // text: `${property.bhk} | ${property.furnishing} Furnished for ${property.purpose} | ${property.locality}`,
          url: window.location.href, // You can replace this with the actual URL of the property details page
        });
      } else {
        alert("Web Share API not supported in your browser");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  // share url code
  //---------------- Change Property Manager ----------------------
  const { updateDocument, response: updateDocumentResponse } =
    useFirestore("properties");

  const { documents: dbUsers, error: dbuserserror } = useCollection("users", [
    "status",
    "==",
    "active",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(dbUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [changeManagerPopup, setchangeManagerPopup] = useState(false);
  const [userdbFieldName, setUserdbFieldName] = useState();

  // const openChangeUser = () => {
  //   console.log("Open Change Manager");
  //   setchangeManagerPopup(true);
  // }
  const openChangeUser = (option) => {
    console.log("Open Change User");
    setchangeManagerPopup(true);
    setUserdbFieldName(option);
  };

  const closeChangeManager = () => {
    setchangeManagerPopup(false);
  };

  // const confirmChangeManager = async () => {
  //   console.log('In confirmChangeManager: ')
  //   console.log('selectedUser: ', selectedUser)

  //   const updatedProperty = {
  //     propertyManager: selectedUser,
  //     updatedAt: timestamp.fromDate(new Date()),
  //     updatedBy: user.uid
  //   };

  //   // console.log('updatedProperty', updatedProperty)
  //   // console.log('property id: ', property.id)

  //   await updateDocument(id, updatedProperty);

  //   setchangeManagerPopup(false);
  // }

  const confirmChangeUser = async () => {
    let updatedProperty;
    if (userdbFieldName === "propertyManager") {
      updatedProperty = {
        propertyManager: selectedUser,
      };
    }
    if (userdbFieldName === "propertyOwner") {
      updatedProperty = {
        propertyOwner: selectedUser,
      };
    }

    if (userdbFieldName === "propertyCoOwner") {
      updatedProperty = {
        propertyCoOwner: selectedUser,
      };
    }

    if (userdbFieldName === "propertyPOC") {
      updatedProperty = {
        propertyPOC: selectedUser,
      };
    }

    updatedProperty = {
      ...updatedProperty,
      updatedAt: timestamp.fromDate(new Date()),
      updatedBy: user.uid,
    };

    // console.log('updatedProperty', updatedProperty)
    // console.log('property id: ', property.id)

    await updateDocument(propertyid, updatedProperty);

    setchangeManagerPopup(false);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterUsers(query);
  };

  const filterUsers = (query) => {
    // console.log('query: ', query)
    const filtered =
      dbUsers &&
      dbUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(query.toLowerCase()) ||
          user.phoneNumber.includes(query)
      );
    setFilteredUsers(filtered);
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  //------------ End of Change Property Manager ---------

  // owl carousel option start
  const options = {
    items: 6,
    dots: false,
    loop: true,
    margin: 30,
    nav: true,
    smartSpeed: 1500,
    // autoplay: true,
    autoplayTimeout: 10000,
    responsive: {
      // Define breakpoints and the number of items to show at each breakpoint
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 6,
      },
    },
  };
  // owl carousel option end

  // owl carousel option start for tenant
  const optionsTenant = {
    items: 4,
    dots: false,
    loop: false,
    margin: 15,
    nav: true,
    smartSpeed: 1500,
    // autoplay: true,
    autoplayTimeout: 10000,
    responsive: {
      // Define breakpoints and the number of items to show at each breakpoint
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 4,
      },
    },
  };
  // owl carousel option end

  // 9 dots controls
  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };
  // 9 dots controls

  // show add additional info form code start
  const [showAIForm, setShowAIForm] = useState(false);
  const handleShowAIForm = () => {
    setShowAIForm(!showAIForm);
  };
  // show add additional info form code end

  // add from field of additonal info code start
  const [additionalInfos, setAdditionalInfos] = useState([""]); // Initialize with one field

  const handleAddMore = () => {
    setAdditionalInfos([...additionalInfos, ""]);
  };

  const handleRemove = (index) => {
    if (additionalInfos.length > 1) {
      // Prevent removal if only one field remains
      const newInfos = additionalInfos.filter((_, i) => i !== index);
      setAdditionalInfos(newInfos);
    }
  };

  const handleInputChange = (index, value) => {
    const newInfos = [...additionalInfos];
    newInfos[index] = value;
    setAdditionalInfos(newInfos);
  };
  // add from field of additonal info code end

  // START CODE FOR ADD NEW IMAGES
  const fileInputRef = useRef(null);
  const [productImages, setProductImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const handleAddMoreImages = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setIsConfirmVisible(true);
    }
  };

  const handleConfirmUpload = async () => {
    if (selectedImage) {
      setIsUploading(true); // Set isUploading to false when upload completes
      try {
        const file = fileInputRef.current.files[0];
        const storageRef = projectStorage.ref(
          `properties/${propertyid}/${file.name}`
        );
        await storageRef.put(file);

        const downloadURL = await storageRef.getDownloadURL();
        const updatedImages = [...(propertyDocument.images || []), downloadURL];

        await projectFirestore
          .collection("properties")
          .doc(propertyid)
          .update({ images: updatedImages });
        setProductImages(updatedImages);

        setSelectedImage(null);
        setIsConfirmVisible(false);
        setIsUploading(false); // Set isUploading to false when upload completes
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const images = (propertyDocument && propertyDocument.images) || [];
  // END CODE FOR ADD NEW IMAGES

  // START CODE FOR EDIT Property desc by TEXT USING TEXT EDITOR
  const [editedPropDesc, setEditedPropDesc] = useState("");
  const [isPropDescEdit, setIsPropDescEdit] = useState(false);
  const [Propvalue, setPropValue] = useState(
    RichTextEditor.createValueFromString(editedPropDesc, "html")
  );

  // START CODE FOR EDIT FIELDS
  const handleEditPropDesc = () => {
    setIsPropDescEdit(true);
  };

  const handleSavePropDesc = async () => {
    try {
      await updateDocument(propertyid, {
        propertyDescription: Propvalue.toString("html"),
      });
      setIsPropDescEdit(false);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleCancelPropDesc = () => {
    setIsPropDescEdit(false);
  };
  // END CODE FOR EDIT Property desc by TEXT USING TEXT EDITOR

  // START CODE FOR EDIT TEXT USING TEXT EDITOR
  const [editedOwnerInstruction, setEditedOwnerInstruction] = useState("");
  const [isEditingOwnerInstruction, setIsEditingOwnerInstruction] =
    useState(false);
  const [ownerInstructionvalue, setOwnerInstrucitonValue] = useState(
    RichTextEditor.createValueFromString(editedOwnerInstruction, "html")
  );

  // START CODE FOR EDIT FIELDS
  const handleEditOwnerInstruction = () => {
    setIsEditingOwnerInstruction(true);
  };

  const handleSaveOwnerInstruction = async () => {
    try {
      await updateDocument(propertyid, {
        ownerInstructions: ownerInstructionvalue.toString("html"),
      });
      setIsEditingOwnerInstruction(false);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleCancelOwnerInstruction = () => {
    setIsEditingOwnerInstruction(false);
  };
  // END CODE FOR EDIT TEXT USING TEXT EDITOR

  return (
    <>
      {/* Change User Popup - Start */}
      <div
        className={
          changeManagerPopup
            ? "pop-up-change-number-div open"
            : "pop-up-change-number-div"
        }
      >
        <div className="direct-div">
          <span
            onClick={closeChangeManager}
            className="material-symbols-outlined close-button"
          >
            close
          </span>
          <h1 style={{ color: "var(--theme-orange)", fontSize: "1.4rem" }}>
            Change Property Manager
          </h1>
          <br></br>
          <div>
            <input
              style={{ background: "#efefef", height: "60px" }}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search users..."
            />
            {/* <ul>
              {filteredUsers && filteredUsers.map((user) => (
                <li key={user.id}>{user.fullName} ({user.phoneNumber.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2-$3')})</li>
              ))}
            </ul> */}
            <ul style={{ padding: "10px 0 10px 0" }}>
              {filteredUsers &&
                filteredUsers.map((user) => (
                  <li style={{ padding: "10px 0 10px 0" }} key={user.id}>
                    <label
                      style={{
                        fontSize: "1rem",
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        width: "100%",
                        background: "#efefef",
                        padding: "10px 0 10px 0",
                        margin: "0",
                      }}
                    >
                      <input
                        style={{ width: "10%" }}
                        name="selectedUser"
                        // type="checkbox"
                        // checked={selectedUsers.includes(user.id)}
                        type="radio"
                        checked={selectedUser === user.id}
                        onChange={() => handleUserSelect(user.id)}
                      />
                      {user.fullName} (
                      {user.phoneNumber.replace(
                        /(\d{2})(\d{5})(\d{5})/,
                        "+$1 $2-$3"
                      )}
                      )
                    </label>
                  </li>
                ))}
            </ul>
          </div>
          <div id="id_sendotpButton" className="change-number-button-div">
            <button
              onClick={closeChangeManager}
              className="mybutton button5"
              style={{ background: "#afafaf" }}
            >
              Cancel
            </button>
            <button onClick={confirmChangeUser} className="mybutton button5">
              Confirm
            </button>
          </div>
        </div>
      </div>
      {/* Change User Popup - End */}
      {/* 9 dots html  */}
      <div onClick={openMoreAddOptions} className="property-list-add-property">
        <span className="material-symbols-outlined">apps</span>
      </div>
      <div
        className={
          handleMoreOptionsClick
            ? "more-add-options-div open"
            : "more-add-options-div"
        }
        onClick={closeMoreAddOptions}
        id="moreAddOptions"
      >
        <div className="more-add-options-inner-div">
          <div className="more-add-options-icons">
            <h1>Close</h1>
            <span className="material-symbols-outlined">close</span>
          </div>

          <Link to="" className="more-add-options-icons">
            <h1>Property Image</h1>
            <span className="material-symbols-outlined">location_city</span>
          </Link>

          <Link to="" className="more-add-options-icons">
            <h1>Property Document</h1>
            <span className="material-symbols-outlined">holiday_village</span>
          </Link>

          <Link to="" className="more-add-options-icons">
            <h1>Property Report</h1>
            <span className="material-symbols-outlined">home</span>
          </Link>
          <Link to="" className="more-add-options-icons">
            <h1>Property Bills</h1>
            <span className="material-symbols-outlined">home</span>
          </Link>
        </div>
      </div>

      <div div className="pg_property aflbg pd_single">
        {/* top search bar */}
        {!user && (
          <div className="top_search_bar">
            <Link to="/properties" className="back_btn">
              <span class="material-symbols-outlined">arrow_back</span>
              <span>Back</span>
            </Link>
          </div>
        )}
        <br></br>
        <section className="property_cards">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                {propertyDocument && (
                  <div className="">
                    <div className="property_card_single quick_detail_show">
                      <div className="more_detail_card_inner">
                        <div className="row align-items-center">
                          <div className="col-md-9">
                            <div className="left">
                              <div className="qd_single">
                                <span class="material-symbols-outlined">
                                  home
                                </span>
                                <h6>
                                  {propertyDocument.category}-{" "}
                                  {propertyDocument.bhk}
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="right">
                              <div className="premium text-center">
                                <img src="/assets/img/premium_img.jpg" alt="" />
                                <h6>PMS Premium - PMS After Rent</h6>
                                <h5>On Boarding 2nd Jan'22</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="property_card_single">
                      <div className="pcs_inner pointer" to="/pdsingle">
                        {/* <div className="pcs_image_area relative">
                          {filteredImages.length > 0 ? (
                            <div className="bigimage_container">
                              <Gallery
                                items={filteredImages.map((url) => ({
                                  original: url,
                                  thumbnail: url,
                                }))}
                                slideDuration={1000}
                              />
                            </div>
                          ) : (
                            <img
                              className="default_prop_img"
                              src="/assets/img/admin_banner.jpg"
                              alt=""
                            />
                          )}
                          {user && user.role == "admin" && (
                            <div className="upload_prop_img">
                              <input
                                type="file"
                                accept="image/*"
                                id="imageInput"
                                multiple
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                                ref={fileInputRef}
                              />
                              <img
                                src="/assets/img/upload_img_small.png"
                                alt=""
                                onClick={handleAddMoreImages}
                              />
                            </div>
                          )}
                        </div> */}

                        <div className="pcs_image_area relative">
                          {images.length > 0 ? (
                            <div className="bigimage_container">
                              {" "}
                              <Gallery
                                style={{ background: "red" }}
                                items={images
                                  .filter((url) => url)
                                  .map((url, index) => ({
                                    original: url,
                                    thumbnail: url,
                                  }))}
                                slideDuration={1000}
                              />
                            </div>
                          ) : (
                            <img
                              className="default_prop_img"
                              src="/assets/img/admin_banner.jpg"
                              alt=""
                            />
                          )}
                          {user && user.role === "admin" && (
                            <div
                              className="d-flex align-items-center justify-content-center gap-2"
                              style={{ margin: "15px 0px" }}
                            >
                              <input
                                type="file"
                                accept="image/*"
                                id="imageInput"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                                ref={fileInputRef}
                              />
                              <div className="d-flex flex-column align-items-center justify-content-center">
                                {!isUploading && (
                                  <button
                                    className="btn_fill_add_property_images mb-2" // Use mb-2 for spacing between buttons
                                    onClick={handleAddMoreImages}
                                  >
                                    {isConfirmVisible
                                      ? "Replace Image"
                                      : "Add More Images"}
                                  </button>
                                )}

                                {selectedImage && (
                                  <button
                                    className="btn_fill_add_property_images"
                                    onClick={handleConfirmUpload}
                                    disabled={!isConfirmVisible || isUploading} // Disable button when uploading
                                  >
                                    {isUploading ? "Uploading..." : "Confirm"}
                                  </button>
                                )}
                              </div>
                              {selectedImage && (
                                <div>
                                  <img
                                    src={selectedImage}
                                    alt="Selected img"
                                    style={{ maxWidth: "100px" }}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="pcs_main_detail">
                          <div className="pmd_top">
                            <h4>
                              {propertyDocument.unitNumber},{" "}
                              {propertyDocument.society}
                            </h4>
                            <h6>
                              {propertyDocument.status.toUpperCase() ===
                                "AVAILABLE FOR RENT" ||
                                propertyDocument.status.toUpperCase() ===
                                "AVAILABLE FOR SALE" ? (
                                <span
                                  style={{
                                    textAlign: "center",
                                    color: "white",
                                    fontWeight: "bolder",
                                    padding: "2px 8px",
                                    borderRadius: "8px",
                                    background: "red",
                                  }}
                                >
                                  {" "}
                                  {propertyDocument.status}
                                </span>
                              ) : (
                                <span
                                  style={{
                                    textAlign: "center",
                                    color: "black",
                                    fontWeight: "bolder",
                                    padding: "2px 8px",
                                    borderRadius: "8px",
                                    background: "lightgreen",
                                  }}
                                >
                                  {" "}
                                  {propertyDocument.status}
                                </span>
                              )}
                            </h6>
                            <h4 className="property_name">
                              {propertyDocument.bhk} |{" "}
                              {propertyDocument.furnishing === ""
                                ? ""
                                : propertyDocument.furnishing +
                                " Furnished | "}{" "}
                              for {propertyDocument.purpose}
                              <br />
                            </h4>
                            <h6 className="property_location">
                              {propertyDocument.locality},{" "}
                              {propertyDocument.city}, {propertyDocument.state}
                            </h6>
                          </div>
                          <div className="divider"></div>
                          <div className="pmd_section2 row">
                            <div className="pdms_single col-4">
                              <h4>
                                <span className="currency">₹</span>
                                {propertyDocument.demandPrice}/-
                                <span className="price"></span>
                              </h4>
                              <h6>Demand Price</h6>
                              {propertyDocument.superArea !== "" ? (
                                <h6>
                                  {propertyDocument.superArea}{" "}
                                  {propertyDocument.superAreaUnit}
                                </h6>
                              ) : (
                                <h6>
                                  {propertyDocument.superArea}{" "}
                                  {propertyDocument.superAreaUnit}
                                </h6>
                              )}
                            </div>
                            {propertyDocument.purpose.toUpperCase() ===
                              "RENT" && (
                                <div className="pdms_single col-4">
                                  <h4>
                                    <span className="currency">₹</span>
                                    {propertyDocument.maintenanceCharges}/-{" "}
                                    <span style={{ fontSize: "0.8rem" }}>
                                      {" "}
                                      {propertyDocument.maintenanceFlag}
                                    </span>
                                  </h4>
                                  <h6>
                                    {propertyDocument.maintenanceChargesFrequency}{" "}
                                    Maintenance
                                  </h6>
                                </div>
                              )}
                            {propertyDocument.purpose.toUpperCase() ===
                              "RENT" && (
                                <div className="pdms_single col-4">
                                  <h4>
                                    <span className="currency">₹</span>
                                    {propertyDocument.securityDeposit}/-
                                  </h4>
                                  <h6>Security Deposit</h6>
                                </div>
                              )}

                            <div className="pdms_single col-4"></div>
                          </div>
                          <div className="divider"></div>
                          <div className="pmd_section2 pmd_section3 row">
                            <div className="pdms_single col-4">
                              <h4>
                                <img src="/assets/img/new_carpet.png"></img>
                                {propertyDocument.superArea}{" "}
                                {propertyDocument.superAreaUnit}
                              </h4>
                              <h6>Super Area</h6>
                            </div>
                            <div className="pdms_single col-4">
                              <h4>
                                <img src="/assets/img/new_bedroom.png"></img>
                                {propertyDocument.numberOfBedrooms}
                              </h4>
                              <h6>Bedrooms</h6>
                            </div>
                            <div className="pdms_single col-4">
                              <h4>
                                <img src="/assets/img/new_bathroom.png"></img>
                                {propertyDocument.numberOfBathrooms}
                              </h4>
                              <h6>Bathroom</h6>
                            </div>
                          </div>
                          <div className="divider"></div>
                          <div className="pmd_section2 pmd_section3 row">
                            <div className="pdms_single col-4">
                              <h4>
                                <img src="/assets/img/new_super_area.png"></img>
                                {propertyDocument.carpetArea}{" "}
                                {propertyDocument.carpetAreaUnit}
                              </h4>
                              <h6>Carpet Area</h6>
                            </div>
                            <div className="pdms_single col-4">
                              <h4>
                                <img src="/assets/img/new_bhk.png"></img>
                                {propertyDocument.bhk}
                              </h4>
                              <h6>BHK</h6>
                            </div>
                            <div className="pdms_single col-4">
                              <h4>
                                <img src="/assets/img/new_furniture.png"></img>
                                {propertyDocument.furnishing}
                              </h4>
                              <h6>Furnishing</h6>
                            </div>
                          </div>
                          <div className="pmd_section4">
                            <div className="left">
                              <span
                                className="material-symbols-outlined mr-2"
                                style={{
                                  marginRight: "3px",
                                }}
                              >
                                favorite
                              </span>
                              <span
                                className="material-symbols-outlined"
                                onClick={handleShareClick}
                              >
                                share
                              </span>
                            </div>

                            {!(
                              (user && user.role === "owner") ||
                              (user && user.role === "coowner") ||
                              (user && user.role === "admin")
                            ) && (
                                <div className="right">
                                  <a
                                    href="."
                                    className="theme_btn no_icon btn_fill"
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  >
                                    {" "}
                                    Contact Agent
                                  </a>
                                  <a
                                    href="."
                                    className="theme_btn no_icon btn_border"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                  >
                                    {" "}
                                    Enquire Now
                                  </a>
                                  <div
                                    className="modal fade"
                                    id="exampleModal"
                                    tabindex="-1"
                                    aria-labelledby="exampleModalLabel"
                                    aria-hidden="true"
                                  >
                                    <div className="modal-dialog">
                                      <div className="modal-content relative">
                                        <span
                                          className="material-symbols-outlined close_modal"
                                          data-bs-dismiss="modal"
                                        >
                                          close
                                        </span>
                                        <div className="modal-body">
                                          <form>
                                            <div className="row">
                                              <div className="col-sm-12">
                                                <div className="section_title mb-4">
                                                  <h3>Enquiry</h3>
                                                  <h6 className="modal_subtitle">
                                                    Thank you for your interest in
                                                    reaching out to us. Please use
                                                    the form below to submit any
                                                    question.
                                                  </h6>
                                                </div>
                                              </div>
                                              <div className="col-sm-12">
                                                <div className="form_field st-2">
                                                  <div className="field_inner select">
                                                    <select>
                                                      <option
                                                        value=""
                                                        disabled
                                                        selected
                                                      >
                                                        I am
                                                      </option>

                                                      <option>Tenant</option>
                                                      <option>Agent</option>
                                                    </select>
                                                    <div className="field_icon">
                                                      <span className="material-symbols-outlined">
                                                        person
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-sm-12">
                                                <div className="form_field st-2">
                                                  <div className="field_inner">
                                                    <input
                                                      type="text"
                                                      placeholder="Name"
                                                    />
                                                    <div className="field_icon">
                                                      <span className="material-symbols-outlined">
                                                        person
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-sm-12">
                                                <div className="form_field st-2">
                                                  <div className="field_inner">
                                                    <input
                                                      type="text"
                                                      placeholder="Phone Number"
                                                    />
                                                    <div className="field_icon">
                                                      <span className="material-symbols-outlined">
                                                        call
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-sm-12">
                                                <div className="submit_btn mt-4">
                                                  <button
                                                    type="submit"
                                                    className="modal_btn theme_btn no_icon btn_fill"
                                                  >
                                                    Submit
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </form>
                                        </div>
                                        )
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {user &&
                      (user.role === "owner" ||
                        user.role === "coowner" ||
                        user.role === "admin") && (

                        <div className="extra_info_card_property">
                          <OwlCarousel className="owl-theme" {...options}>
                            {/* Transactions */}
                            <Link to={`/transactions/${propertyid}`}>
                              <div className="item eicp_single">
                                <div className="icon">
                                  <span class="material-symbols-outlined">
                                    description
                                  </span>
                                  <div className="text">
                                    <h6>5</h6>
                                    <h5>Transactions</h5>
                                  </div>
                                </div>
                              </div>
                            </Link>
                            {/* Documents */}
                            <Link to={`/propertydocumentdetails/${propertyid}`}>
                              <div className="item eicp_single">
                                <div className="icon">
                                  <span class="material-symbols-outlined">
                                    description
                                  </span>
                                  <div className="text">
                                    <h6>5</h6>
                                    <h5>Documents</h5>
                                  </div>
                                </div>
                              </div>
                            </Link>

                            <div className="item eicp_single">
                              <div className="icon">
                                <span class="material-symbols-outlined">
                                  description
                                </span>
                                <div className="text">
                                  <h6>10</h6>
                                  <h5>Enquiries</h5>
                                </div>
                              </div>
                            </div>
                            <div className="item eicp_single">
                              <div className="icon">
                                <span class="material-symbols-outlined">
                                  description
                                </span>
                                <div className="text">
                                  <h6>2</h6>
                                  <h5>Bills</h5>
                                </div>
                              </div>
                            </div>
                          </OwlCarousel>
                        </div>

                      )}

                    {showAIForm && (
                      <section className="property_card_single add_aditional_form">
                        <div className="more_detail_card_inner relative">
                          <h2 className="card_title">
                            Property Layout
                          </h2>
                          <div className="aai_form">
                            <div
                              className="row"
                              style={{
                                rowGap: "18px",
                              }}
                            >
                              <div className="col-md-12">
                                <div className="form_field">
                                  <div className="field_box theme_radio_new">
                                    <div className="theme_radio_container">
                                      <div className="radio_single">
                                        <input
                                          type="radio"
                                          name="aai_type"
                                          id="bedroom"
                                          onClick={(e) => {
                                            setPropertyLayout({
                                              ...propertyLayout,
                                              RoomType: "Bedroom",
                                            })
                                          }}
                                        />
                                        <label htmlFor="bedroom">Bedroom</label>
                                      </div>
                                      <div className="radio_single">
                                        <input
                                          type="radio"
                                          name="aai_type"
                                          id="bathroom"
                                          onClick={(e) => {
                                            setPropertyLayout({
                                              ...propertyLayout,
                                              RoomType: "Bathroom",
                                            })
                                          }}
                                        />
                                        <label htmlFor="bathroom">
                                          Bathroom
                                        </label>
                                      </div>
                                      <div className="radio_single">
                                        <input
                                          type="radio"
                                          name="aai_type"
                                          id="kitchen"
                                          onClick={(e) => {
                                            setPropertyLayout({
                                              ...propertyLayout,
                                              RoomType: "Kitchen",
                                            })
                                          }}
                                        />
                                        <label htmlFor="kitchen">Kitchen</label>
                                      </div>
                                      <div className="radio_single">
                                        <input
                                          type="radio"
                                          name="aai_type"
                                          id="living"
                                          onClick={(e) => {
                                            setPropertyLayout({
                                              ...propertyLayout,
                                              RoomType: "Living Room",
                                            })
                                          }}
                                        />
                                        <label htmlFor="living">Living Room</label>
                                      </div>
                                      <div className="radio_single">
                                        <input
                                          type="radio"
                                          name="aai_type"
                                          id="dining"
                                          onClick={(e) => {
                                            setPropertyLayout({
                                              ...propertyLayout,
                                              RoomType: "Dining Room",
                                            })
                                          }}
                                        />
                                        <label htmlFor="dining">Dining Room</label>
                                      </div>
                                      <div className="radio_single">
                                        <input
                                          type="radio"
                                          name="aai_type"
                                          id="balcony"
                                          onClick={(e) => {
                                            setPropertyLayout({
                                              ...propertyLayout,
                                              RoomType: "Balcony",
                                            })
                                          }}
                                        />
                                        <label htmlFor="balcony">Balcony</label>
                                      </div>
                                      <div className="radio_single">
                                        <input
                                          type="radio"
                                          name="aai_type"
                                          id="basement"
                                          onClick={(e) => {
                                            setPropertyLayout({
                                              ...propertyLayout,
                                              RoomType: "Basement",
                                            })
                                          }}
                                        />
                                        <label htmlFor="basement">Basement</label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form_field_upload">
                                  <label htmlFor="upload">
                                    <div className="text-center">
                                      <span class="material-symbols-outlined">
                                        upload
                                      </span>
                                      <p>Upload image</p>
                                    </div>
                                  </label>
                                  <input type="file" id="upload" />
                                </div>
                              </div>
                              <div className="col-md-11">
                                <div className="add_info_text">
                                  <div className="form_field">
                                    <input type="text" placeholder="Room Name"
                                      onChange={(e) =>
                                        setPropertyLayout({
                                          ...propertyLayout,
                                          RoomName: e.target.value,
                                        })
                                      }
                                      value={propertyLayout && propertyLayout.RoomName}
                                    />
                                  </div>
                                  <div className="form_field">
                                    <input type="text" placeholder="Room Length"
                                      onChange={(e) =>
                                        setPropertyLayout({
                                          ...propertyLayout,
                                          RoomLength: e.target.value,
                                        })
                                      }
                                      value={propertyLayout && propertyLayout.RoomLength}
                                    />
                                  </div>
                                  <div className="form_field">
                                    <input type="text" placeholder="Room Width"
                                      onChange={(e) =>
                                        setPropertyLayout({
                                          ...propertyLayout,
                                          RoomWidth: e.target.value,
                                        })
                                      }
                                      value={propertyLayout && propertyLayout.RoomWidth}
                                    />
                                  </div>
                                  <div className="form_field">
                                    <input type="text" placeholder="Total area" />
                                  </div>
                                  {additionalInfos.map((info, index) => (
                                    <div className="form_field">
                                      <div className="relative" key={index}>
                                        <input
                                          type="text"
                                          value={info}
                                          onChange={(e) =>
                                            handleInputChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                          // onChange={(e) =>
                                          //   setPropertyLayout({
                                          //     ...propertyLayout,
                                          //     RoomFixture: e.target.value,
                                          //   })
                                          // }
                                          placeholder="Fixtures etc. fan, light, furniture, etc."
                                        />
                                        {
                                          additionalInfos.length > 1 && (
                                            <span
                                              onClick={() => handleRemove(index)}
                                              className="pointer close_field"
                                            >
                                              X
                                            </span>
                                          )
                                        }
                                      </div>
                                    </div>
                                  ))}
                                  <div
                                    className="addmore"
                                    onClick={handleAddMore}
                                  >
                                    add more
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <h2 className="card_title">
                                  Attached with
                                </h2>
                                <div className="form_field theme_checkbox">
                                  <div className="theme_checkbox_container">
                                    <div className="checkbox_single">
                                      <input
                                        type="checkbox"
                                        id="bathroom1"
                                        name="attach_with"
                                      />
                                      <label htmlFor="bathroom1">bathroom 1</label>
                                    </div>
                                    <div className="checkbox_single">
                                      <input
                                        type="checkbox"
                                        id="balcony1"
                                        name="attach_with"

                                      />
                                      <label htmlFor="balcony1">balcony 1</label>
                                    </div>
                                    <div className="checkbox_single">
                                      <input
                                        type="checkbox"
                                        id="bathroom2"
                                        name="attach_with"
                                      />
                                      <label htmlFor="bathroom2">bathroom 2</label>
                                    </div>
                                    <div className="checkbox_single">
                                      <input
                                        type="checkbox"
                                        id="balcony2"
                                        name="attach_with"

                                      />
                                      <label htmlFor="balcony2">balcony 2</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-sm-1">
                              <div
                                className="theme_btn btn_border text-center"
                                onClick={handleShowAIForm}
                              >
                                Cancel
                              </div>
                            </div>
                            <div className="col-sm-3">
                              <div className="theme_btn btn_fill text-center" onClick={handlePropertyLayout}>
                                Add
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    )}
                    <section className="property_card_single">
                      <div
                        className="more_detail_card_inner d-flex align-items-center"
                        style={{
                          gap: "15px",
                        }}
                      >
                        {!showAIForm && (
                          <div className="add_btn" onClick={handleShowAIForm}>
                            <div className="add_btn_inner">
                              <div className="add_icon">+</div>
                              <div className="ab_text">
                                Property Layout
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="col-md-4">
                          <div className="ai_detail_show">
                            <div className="left">
                              <img
                                src="/assets/img/p_img/drawingroom.jpg"
                                alt=""
                              />
                            </div>
                            <div className="right">
                              <h5>Master Bedroom</h5>
                              <div className="in_detail">
                                <span className="in_single">
                                  Area 1252sq/ft
                                </span>
                                <span className="in_single">2 fan</span>
                                <span className="in_single">2 almira</span>
                                <span className="in_single">2 fan</span>
                                <span className="in_single">2 almira</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    {/* tenant card start */}
                    <section className="property_card_single">
                      <div className="more_detail_card_inner">
                        <h2 className="card_title">Tenant Information</h2>
                        <div className="tenant_card">
                          <div className="row">
                            <div className="col-md-2">
                              <div
                                className="add_btn eicp_single mb-2"
                                onClick={handleAddTenant}
                              >
                                <div class="icon">
                                  <div class="text">
                                    <h6>
                                      {tenantDocument && tenantDocument.length}
                                    </h6>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="add_btn"
                                onClick={handleAddTenant}
                              >
                                <div className="add_btn_inner">
                                  <div className="add_icon">+</div>
                                  <div className="ab_text">
                                    Add Tenants
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-10">
                              {/* <OwlCarousel className="owl-theme" {...optionsTenant}> */}

                              <div
                                className="d-flex"
                                style={{
                                  gap: "15px",
                                }}
                              >
                                {tenantDocument &&
                                  tenantDocument.map((tenant, index) => (
                                    <div
                                      className={`tc_single relative item ${tenant.status === "inactive" ? "t_inactive" : ""}`}
                                      key={index}
                                    >
                                      {" "}
                                      <Link to={`/tenantdetails/${tenant.id}`}>
                                        <div className="tcs_img_container" >
                                          <img
                                            src={
                                              tenant.tenantImgUrl ||
                                              "/assets/img/dummy_user.png"
                                            }
                                            alt="Preview"
                                          />
                                        </div>
                                        <div
                                          className={`tenant_detail ${editingTenantId === tenant.id
                                            ? "td_edit"
                                            : ""
                                            }`}
                                        >
                                          <div className="edit_inputs">
                                            {/* <input
                                              type="text"
                                              placeholder="Tenant Name"
                                              value={
                                                tenantName[tenant.id] ??
                                                tenant.name
                                              }
                                              onChange={(e) =>
                                                handleNameChange(
                                                  tenant.id,
                                                  e.target.value
                                                )
                                              }
                                              readOnly={
                                                editingTenantId !== tenant.id
                                              }
                                              className="t_name"
                                            /> */}
                                            {/* <input
                                              type="number"
                                              placeholder="Tenant Phone"
                                              value={
                                                tenantMobile[tenant.id] ??
                                                tenant.mobile
                                              }
                                              onChange={(e) =>
                                                handleMobileChange(
                                                  tenant.id,
                                                  e.target.value
                                                )
                                              }
                                              readOnly={
                                                editingTenantId !== tenant.id
                                              }
                                              className="t_number"
                                            /> */}
                                            <h6 className="t_name">
                                              {
                                                tenant.name ? tenant.name : "Tenant Name"

                                              }
                                            </h6>
                                            <h6 className="t_number">
                                              {tenant.mobile
                                                ? tenant.mobile
                                                : "Tenant Phone"}
                                            </h6>
                                          </div>
                                        </div>
                                        <div className="wha_call_icon">
                                          <Link
                                            className="call_icon wc_single"
                                            to={`tel:${tenant.mobile}`}
                                            target="_blank"
                                          >
                                            <img
                                              src="/assets/img/simple_call.png"
                                              alt=""
                                            />
                                          </Link>
                                          <Link
                                            className="wha_icon wc_single"
                                            to={`https://wa.me/${tenant.mobile}`}
                                            target="_blank"
                                          >
                                            <img
                                              src="/assets/img/whatsapp_simple.png"
                                              alt=""
                                            />
                                          </Link>
                                        </div>
                                        {/* <span
                                          className="edit_save"
                                          onClick={() =>
                                            editingTenantId === tenant.id
                                              ? handleSaveTenant(tenant.id)
                                              : handleEditTenantToggle(
                                                tenant.id
                                              )
                                          }
                                        >
                                          {editingTenantId === tenant.id
                                            ? "save"
                                            : "edit"}
                                        </span> */}
                                      </Link>
                                    </div>
                                  ))}
                              </div>

                              {/* </OwlCarousel> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <div className="vg22"></div>
                    {/* tenant card end  */}
                    <div className="vg10"></div>
                    {((user && user.role === "owner") ||
                      (user && user.role === "coowner") ||
                      (user && user.role === "admin")) && (
                        <div className="property_card_single">
                          <div className="more_detail_card_inner">
                            <div className="row no-gutters row_reverse_767">
                              {/* <div className="col-md-6">
                              <div className="property_full_address d_none_767">
                                <h2 className="card_title">
                                  {propertyDocument.unitNumber},{" "}
                                  {propertyDocument.society}
                                </h2>
                                <h3>
                                  {propertyDocument.locality},{" "}
                                  {propertyDocument.city}{" "}
                                </h3>
                                <h3>
                                  {propertyDocument.state},{" "}
                                  {propertyDocument.country},{" "}
                                  {propertyDocument.pinCode}
                                </h3>
                              </div>
                              <div className="property_connected_people userlist">
                                <div className="item pcp_single">
                                  <div className="property_people_designation">
                                    Property Manager
                                  </div>
                                  <div className="single_user">
                                    <div className="left">
                                      <div className="user_img">
                                        {propertyManagerDoc && (
                                          <img
                                            src={
                                              propertyManagerDoc &&
                                              propertyManagerDoc.photoURL
                                            }
                                            alt=""
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="right">
                                      <h5
                                        onClick={
                                          user && user.role === "admin"
                                            ? () =>
                                                openChangeUser(
                                                  "propertyManager"
                                                )
                                            : ""
                                        }
                                        className={
                                          user && user.role === "admin"
                                            ? "pointer"
                                            : ""
                                        }
                                      >
                                        {propertyManagerDoc &&
                                          propertyManagerDoc.fullName}
                                        {user && user.role === "admin" && (
                                          <span className="material-symbols-outlined click_icon text_near_icon">
                                            edit
                                          </span>
                                        )}
                                      </h5>

                                      <h6>
                                        {propertyManagerDoc &&
                                          propertyManagerDoc.phoneNumber.replace(
                                            /(\d{2})(\d{5})(\d{5})/,
                                            "+$1 $2-$3"
                                          )}
                                      </h6>
                                    </div>
                                  </div>

                                  <div className="contacts">
                                    {propertyManagerDoc && (
                                      <Link
                                        to={
                                          "tel:" +
                                          propertyManagerDoc.phoneNumber
                                        }
                                        className="contacts_single"
                                      >
                                        <div className="icon">
                                          <span className="material-symbols-outlined">
                                            call
                                          </span>
                                        </div>
                                        <h6>Call</h6>
                                      </Link>
                                    )}
                                    {propertyManagerDoc && (
                                      <Link
                                        to={
                                          "https://wa.me/" +
                                          propertyManagerDoc.phoneNumber
                                        }
                                        className="contacts_single"
                                      >
                                        <div className="icon">
                                          <img
                                            src="/assets/img/whatsapp.png"
                                            alt=""
                                          />
                                        </div>
                                        <h6>Whatsapp</h6>
                                      </Link>
                                    )}
                                    {propertyManagerDoc &&
                                      propertyManagerDoc.email !== "" && (
                                        <Link
                                          to={
                                            "mailto:" + propertyManagerDoc.email
                                          }
                                          className="contacts_single"
                                        >
                                          <div className="icon">
                                            <span className="material-symbols-outlined">
                                              mail
                                            </span>
                                          </div>
                                          <h6>Email</h6>
                                        </Link>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div> */}
                              <div className="col-md-6">
                                <div className="userlist property_owners">
                                  <div className="single_user">
                                    <div className="property_people_designation">
                                      Property Manager
                                    </div>
                                    <div className="left">
                                      <div className="user_img">
                                        {propertyManagerDoc && (
                                          <img
                                            src={
                                              propertyManagerDoc &&
                                              propertyManagerDoc.photoURL
                                            }
                                            alt=""
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="right">
                                      <h5
                                        onClick={
                                          user && user.role === "admin"
                                            ? () =>
                                              openChangeUser("propertyManager")
                                            : ""
                                        }
                                        className={
                                          user && user.role === "admin"
                                            ? "pointer"
                                            : ""
                                        }
                                      >
                                        {propertyManagerDoc &&
                                          propertyManagerDoc.fullName}
                                        {user && user.role === "admin" && (
                                          <span className="material-symbols-outlined click_icon text_near_icon">
                                            edit
                                          </span>
                                        )}
                                      </h5>

                                      <h6>
                                        {propertyManagerDoc &&
                                          propertyManagerDoc.phoneNumber.replace(
                                            /(\d{2})(\d{5})(\d{5})/,
                                            "+$1 $2-$3"
                                          )}
                                      </h6>

                                      {/* <div className="wc">
                                        <Link
                                          to={
                                            "https://wa.me/" +
                                            propertyManagerDoc.phoneNumber
                                          }
                                          className="contacts_single"
                                        >
                                          <div className="icon">
                                            <img
                                              src="/assets/img/whatsapp.png"
                                              alt=""
                                            />
                                          </div>
                                        </Link>
                                        <img
                                          src="/assets/img/phone-call.png"
                                          className="pointer"
                                          alt=""
                                        />
                                      </div> */}
                                    </div>
                                  </div>
                                  <div className="single_user">
                                    <div className="property_people_designation">
                                      Substitute Property Managaer
                                    </div>
                                    <div className="left">
                                      <div className="user_img">
                                        {propertyCoOwnerDoc && (
                                          <img
                                            src={
                                              propertyCoOwnerDoc &&
                                              propertyCoOwnerDoc.photoURL
                                            }
                                            alt=""
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="right">
                                      <h5
                                        onClick={
                                          user && user.role === "admin"
                                            ? () =>
                                              openChangeUser("propertyCoOwner")
                                            : ""
                                        }
                                        className={
                                          user && user.role === "admin"
                                            ? "pointer"
                                            : ""
                                        }
                                      >
                                        {propertyCoOwnerDoc &&
                                          propertyCoOwnerDoc.fullName}
                                        {user && user.role === "admin" && (
                                          <span className="material-symbols-outlined click_icon text_near_icon">
                                            edit
                                          </span>
                                        )}
                                      </h5>

                                      <h6>
                                        {propertyCoOwnerDoc &&
                                          propertyCoOwnerDoc.phoneNumber.replace(
                                            /(\d{2})(\d{5})(\d{5})/,
                                            "+$1 $2-$3"
                                          )}
                                      </h6>
                                      <h6>
                                        {propertyCoOwnerDoc &&
                                          propertyCoOwnerDoc.city}
                                        ,{" "}
                                        {propertyCoOwnerDoc &&
                                          propertyCoOwnerDoc.country}
                                      </h6>

                                      <div className="wc">
                                        <img
                                          src="/assets/img/whatsapp.png"
                                          className="pointer"
                                          alt=""
                                        />
                                        <img
                                          src="/assets/img/phone-call.png"
                                          className="pointer"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="single_user">
                                    <div className="property_people_designation">
                                      Sales Manager
                                    </div>
                                    <div className="left">
                                      <div className="user_img">
                                        {propertyPOCDoc && (
                                          <img
                                            src={
                                              propertyPOCDoc &&
                                              propertyPOCDoc.photoURL
                                            }
                                            alt=""
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="right">
                                      <h5
                                        onClick={
                                          user && user.role === "admin"
                                            ? () => openChangeUser("propertyPOC")
                                            : ""
                                        }
                                        className={
                                          user && user.role === "admin"
                                            ? "pointer"
                                            : ""
                                        }
                                      >
                                        {propertyPOCDoc &&
                                          propertyPOCDoc.fullName}
                                        {user && user.role === "admin" && (
                                          <span className="material-symbols-outlined click_icon text_near_icon">
                                            edit
                                          </span>
                                        )}
                                      </h5>
                                      <h6>
                                        {propertyPOCDoc &&
                                          propertyPOCDoc.phoneNumber.replace(
                                            /(\d{2})(\d{5})(\d{5})/,
                                            "+$1 $2-$3"
                                          )}
                                      </h6>
                                      <h6>
                                        {propertyPOCDoc && propertyPOCDoc.city},{" "}
                                        {propertyPOCDoc && propertyPOCDoc.country}
                                      </h6>

                                      <div className="wc">
                                        <img
                                          src="/assets/img/whatsapp.png"
                                          className="pointer"
                                          alt=""
                                        />
                                        <img
                                          src="/assets/img/phone-call.png"
                                          className="pointer"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="userlist property_owners">
                                  <div className="single_user">
                                    <div className="property_people_designation">
                                      Owner
                                    </div>
                                    <div className="left">
                                      <div className="user_img">
                                        {propertyOwnerDoc && (
                                          <img
                                            src={
                                              propertyOwnerDoc &&
                                              propertyOwnerDoc.photoURL
                                            }
                                            alt=""
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="right">
                                      <h5
                                        onClick={
                                          user && user.role === "admin"
                                            ? () =>
                                              openChangeUser("propertyOwner")
                                            : ""
                                        }
                                        className={
                                          user && user.role === "admin"
                                            ? "pointer"
                                            : ""
                                        }
                                      >
                                        {propertyOwnerDoc &&
                                          propertyOwnerDoc.fullName}
                                        {user && user.role === "admin" && (
                                          <span className="material-symbols-outlined click_icon text_near_icon">
                                            edit
                                          </span>
                                        )}
                                      </h5>

                                      <h6>
                                        {propertyOwnerDoc &&
                                          propertyOwnerDoc.phoneNumber.replace(
                                            /(\d{2})(\d{5})(\d{5})/,
                                            "+$1 $2-$3"
                                          )}
                                      </h6>
                                      <h6>
                                        {propertyOwnerDoc &&
                                          propertyOwnerDoc.city}
                                        ,{" "}
                                        {propertyOwnerDoc &&
                                          propertyOwnerDoc.country}
                                      </h6>

                                      {/* <div className="wc">
                                      <Link
                                          to={"https://wa.me/" + propertyOwnerDoc.phoneNumber}
                                          className="contacts_single"
                                        >
                                          <div className="icon">
                                            <img
                                              src="/assets/img/whatsapp.png"
                                              alt=""
                                            />
                                          </div>                                          
                                        </Link>
                                        <img
                                          src="/assets/img/phone-call.png"
                                          className="pointer"
                                          alt=""
                                        />
                                      </div> */}
                                    </div>
                                  </div>
                                  <div className="single_user">
                                    <div className="property_people_designation">
                                      Co-Owner
                                    </div>
                                    <div className="left">
                                      <div className="user_img">
                                        {propertyCoOwnerDoc && (
                                          <img
                                            src={
                                              propertyCoOwnerDoc &&
                                              propertyCoOwnerDoc.photoURL
                                            }
                                            alt=""
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="right">
                                      <h5
                                        onClick={
                                          user && user.role === "admin"
                                            ? () =>
                                              openChangeUser("propertyCoOwner")
                                            : ""
                                        }
                                        className={
                                          user && user.role === "admin"
                                            ? "pointer"
                                            : ""
                                        }
                                      >
                                        {propertyCoOwnerDoc &&
                                          propertyCoOwnerDoc.fullName}
                                        {user && user.role === "admin" && (
                                          <span className="material-symbols-outlined click_icon text_near_icon">
                                            edit
                                          </span>
                                        )}
                                      </h5>

                                      <h6>
                                        {propertyCoOwnerDoc &&
                                          propertyCoOwnerDoc.phoneNumber.replace(
                                            /(\d{2})(\d{5})(\d{5})/,
                                            "+$1 $2-$3"
                                          )}
                                      </h6>
                                      <h6>
                                        {propertyCoOwnerDoc &&
                                          propertyCoOwnerDoc.city}
                                        ,{" "}
                                        {propertyCoOwnerDoc &&
                                          propertyCoOwnerDoc.country}
                                      </h6>

                                      <div className="wc">
                                        <img
                                          src="/assets/img/whatsapp.png"
                                          className="pointer"
                                          alt=""
                                        />
                                        <img
                                          src="/assets/img/phone-call.png"
                                          className="pointer"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="single_user">
                                    <div className="property_people_designation">
                                      POC
                                    </div>
                                    <div className="left">
                                      <div className="user_img">
                                        {propertyPOCDoc && (
                                          <img
                                            src={
                                              propertyPOCDoc &&
                                              propertyPOCDoc.photoURL
                                            }
                                            alt=""
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="right">
                                      <h5
                                        onClick={
                                          user && user.role === "admin"
                                            ? () => openChangeUser("propertyPOC")
                                            : ""
                                        }
                                        className={
                                          user && user.role === "admin"
                                            ? "pointer"
                                            : ""
                                        }
                                      >
                                        {propertyPOCDoc &&
                                          propertyPOCDoc.fullName}
                                        {user && user.role === "admin" && (
                                          <span className="material-symbols-outlined click_icon text_near_icon">
                                            edit
                                          </span>
                                        )}
                                      </h5>
                                      <h6>
                                        {propertyPOCDoc &&
                                          propertyPOCDoc.phoneNumber.replace(
                                            /(\d{2})(\d{5})(\d{5})/,
                                            "+$1 $2-$3"
                                          )}
                                      </h6>
                                      <h6>
                                        {propertyPOCDoc && propertyPOCDoc.city},{" "}
                                        {propertyPOCDoc && propertyPOCDoc.country}
                                      </h6>

                                      <div className="wc">
                                        <img
                                          src="/assets/img/whatsapp.png"
                                          className="pointer"
                                          alt=""
                                        />
                                        <img
                                          src="/assets/img/phone-call.png"
                                          className="pointer"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    {(user && user.role === "owner") ||
                      (user && user.role === "admin" && (
                        <div className="property_card_single">
                          <div className="more_detail_card_inner">
                            <div className="row no-gutters">
                              <div className="col-md-6">
                                <div className="property_full_address">
                                  <h2 className="card_title">
                                    escalation matrix
                                  </h2>
                                </div>
                                <div className="property_connected_people userlist">
                                  <div className="item pcp_single">
                                    <div className="property_people_designation">
                                      Indian contact number
                                    </div>
                                    <div className="single_user">
                                      <div className="right">
                                        <h5>+91 9698569856</h5>
                                        <h6>indiacontactnumber@gmail.com</h6>
                                      </div>
                                    </div>
                                    <div className="contacts">
                                      <Link
                                        to="tel:+918770534650"
                                        className="contacts_single"
                                      >
                                        <div className="icon">
                                          <span className="material-symbols-outlined">
                                            call
                                          </span>
                                        </div>
                                        <h6>Call</h6>
                                      </Link>
                                      <Link
                                        to="https://wa.me/918770534650"
                                        className="contacts_single"
                                      >
                                        <div className="icon">
                                          <img
                                            src="/assets/img/whatsapp.png"
                                            alt=""
                                          />
                                        </div>
                                        <h6>Whatsapp</h6>
                                      </Link>
                                      <Link
                                        to="mailto:solankisanskar8@gmail.com"
                                        className="contacts_single"
                                      >
                                        <div className="icon">
                                          <span className="material-symbols-outlined">
                                            mail
                                          </span>
                                        </div>
                                        <h6>Email</h6>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="userlist property_owners">
                                  <div className="single_user">
                                    <div className="property_people_designation">
                                      Level 1
                                    </div>
                                    <div className="right">
                                      <h5>8770534650</h5>
                                      <h6>level1@gmail.com</h6>
                                    </div>
                                  </div>
                                  <div className="single_user">
                                    <div className="property_people_designation">
                                      Level 2
                                    </div>
                                    <div className="right">
                                      <h5>8770534650</h5>
                                      <h6>level2@gmail.com</h6>
                                    </div>
                                  </div>
                                  <div className="single_user">
                                    <div className="property_people_designation">
                                      Level 3
                                    </div>
                                    <div className="right">
                                      <h5>8770534650</h5>
                                      <h6>level3@gmail.com</h6>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    <div className="property_card_single">
                      <div className="more_detail_card_inner">
                        <h2 className="card_title">About Property</h2>
                        <div className="p_info">
                          {/* <div className="p_info_single">
                            <div className="pd_icon">
                              <img src="/assets/img/property-detail-icon/unitNo.png" alt="" />
                            </div>
                            <div className="pis_content">
                              <h6>Unit Number</h6>
                              <h5>252</h5>
                            </div>
                          </div> */}
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/calendar.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Property Added Date</h6>
                              <h5>
                                {propertyDocument &&
                                  propertyOnboardingDateFormatted}
                              </h5>
                              {/* <h5>{propertyDocument && new Date(propertyDocument.onboardingDate.seconds * 1000)}</h5> */}
                            </div>
                          </div>

                          {/* <div className="p_info_single">
                            <div className="pd_icon">
                              <img src="/assets/img/property-detail-icon/Property_status.png" alt="" />
                            </div>
                            <div className="pis_content">
                              <h6>Property Status</h6>
                              <h5> Active</h5>
                            </div>

                          </div> */}
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/ownership.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Ownership</h6>
                              <h5>
                                {propertyDocument && propertyDocument.ownership}
                              </h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/property_source.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Property Source</h6>
                              <h5>
                                {propertyDocument && propertyDocument.source}
                              </h5>
                            </div>
                          </div>

                          {/* <div className="p_info_single">
                            <div className="pd_icon">
                              <img src="/assets/img/property-detail-icon/Purpose.png" alt="" />
                            </div>
                            <div className="pis_content">
                              <h6>Purpose</h6>
                              <h5>Rent</h5>
                            </div>
                          </div> */}
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/package.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Package</h6>
                              <h5>
                                {propertyDocument && propertyDocument.package}
                              </h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/property_flag.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Property Flag</h6>
                              <h5>
                                {propertyDocument && propertyDocument.flag}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="property_card_single">
                      <div className="more_detail_card_inner">
                        <h2 className="card_title">Property Type</h2>
                        <div className="p_info">
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/calendar.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Type</h6>
                              <h5>{propertyDocument.bhk}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/FloorNumber.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Floor no</h6>
                              <h5>{propertyDocument.floorNo}</h5>
                            </div>
                          </div>

                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/furnishing.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Furnishing</h6>
                              <h5>{propertyDocument.furnishing}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/bedrooms.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Bedrooms</h6>
                              <h5>{propertyDocument.numberOfBedrooms}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/bathrroms.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Bathrooms</h6>
                              <h5>{propertyDocument.numberOfBathrooms}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/balcony.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Balcony</h6>
                              <h5>{propertyDocument.numberOfBalcony}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/kitchen.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Kitchen</h6>
                              <h5>{propertyDocument.numberOfKitchen}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/livingArea.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Living Area</h6>
                              <h5>{propertyDocument.numberOfLivingArea}</h5>
                            </div>
                          </div>

                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/calendar.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Basement</h6>
                              <h5>{propertyDocument.numberOfBasement}</h5>
                            </div>
                          </div>

                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/diningArea.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Dining Area</h6>
                              <h5>{propertyDocument.diningArea}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/livingDining.png"
                                alt=""
                              />
                            </div>

                            <div className="pis_content">
                              <h6>Living & Dining:</h6>
                              <h5>{propertyDocument.livingAndDining}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/passages.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Passages</h6>
                              <h5>{propertyDocument.passage}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/entrance-gallery.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Entrance Gallery</h6>
                              <h5>{propertyDocument.entranceGallery}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/mainDoorFacing.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Main Door Facing</h6>
                              <h5>{propertyDocument.mainDoorFacing}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/balcony_windowsFacing.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Balcony Facing</h6>
                              <h5>{propertyDocument.balconyFacing}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/Overlooking.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Overlooking</h6>
                              <h5>{propertyDocument.overLooking}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/yearOfConstruction.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Year of Constuction</h6>
                              <h5>{propertyDocument.yearOfConstruction}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/ageOfproperty.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Age of Property</h6>
                              <h5>
                                {" "}
                                {propertyDocument &&
                                  new Date().getFullYear() -
                                  Number(
                                    propertyDocument.yearOfConstruction
                                  ) +
                                  " Years"}{" "}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Additional Rooms */}
                    {propertyDocument &&
                      propertyDocument.additionalRooms.length > 0 && (
                        <div className="property_card_single">
                          <div className="more_detail_card_inner">
                            <h2 className="card_title">Additional Rooms</h2>
                            <div className="p_info">
                              {propertyDocument.additionalRooms.map((item) => (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    {item === "Servent Room" ? (
                                      <img
                                        src="/assets/img/property-detail-icon/servantRoom.png"
                                        alt=""
                                      />
                                    ) : item === "Office Room" ? (
                                      <img
                                        src="/assets/img/property-detail-icon/officeRoom.png"
                                        alt=""
                                      />
                                    ) : item === "Store Room" ? (
                                      <img
                                        src="/assets/img/property-detail-icon/storeRoom.png"
                                        alt=""
                                      />
                                    ) : item === "Pooja Room" ? (
                                      <img
                                        src="/assets/img/property-detail-icon/poojaRoom.png"
                                        alt=""
                                      />
                                    ) : item === "Study Room" ? (
                                      <img
                                        src="/assets/img/property-detail-icon/studyRoom.png"
                                        alt=""
                                      />
                                    ) : item === "Power Room" ? (
                                      <img
                                        src="/assets/img/property-detail-icon/powerRoom.png"
                                        alt=""
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div className="pis_content">
                                    {/* <h6>1</h6> */}
                                    <h5>{item}</h5>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    {propertyDocument &&
                      propertyDocument.additionalArea.length > 0 && (
                        <div className="property_card_single">
                          <div className="more_detail_card_inner">
                            <h2 className="card_title">Additional Area</h2>
                            <div className="p_info">
                              {propertyDocument.additionalArea.map((item) => (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    {item === "Front Yard" ? (
                                      <img
                                        src="/assets/img/property-detail-icon/frontyard.png"
                                        alt=""
                                      />
                                    ) : item === "Back Yard" ? (
                                      <img
                                        src="/assets/img/property-detail-icon/backyard.png"
                                        alt=""
                                      />
                                    ) : item === "Terrace" ? (
                                      <img
                                        src="/assets/img/property-detail-icon/terrace.png"
                                        alt=""
                                      />
                                    ) : item === "Private Garden" ? (
                                      <img
                                        src="/assets/img/property-detail-icon/privateGarden.png"
                                        alt=""
                                      />
                                    ) : item === "Garage" ? (
                                      <img
                                        src="/assets/img/property-detail-icon/garage.png"
                                        alt=""
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div className="pis_content">
                                    {/* <h6>1</h6> */}
                                    <h5>{item}</h5>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    <div className="property_card_single">
                      <div className="more_detail_card_inner">
                        <h2 className="card_title">Property Size</h2>
                        <div className="p_info">
                          {propertyDocument && propertyDocument.plotArea && (
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/calendar.png"
                                  alt=""
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Plot Area:</h6>
                                <h5>
                                  {propertyDocument.plotArea}{" "}
                                  {propertyDocument.plotArea
                                    ? propertyDocument.plotAreaUnit
                                    : ""}
                                </h5>
                              </div>
                            </div>
                          )}
                          {propertyDocument && propertyDocument.superArea && (
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/superArea.png"
                                  alt=""
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Super Area</h6>
                                <h5>
                                  {propertyDocument.superArea}{" "}
                                  {propertyDocument.superArea
                                    ? propertyDocument.superAreaUnit
                                    : ""}
                                </h5>
                              </div>
                            </div>
                          )}
                          {propertyDocument && propertyDocument.builtUpArea && (
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/buildUpArea.png"
                                  alt=""
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Built-up Area</h6>
                                <h5>
                                  {propertyDocument.builtUpArea}{" "}
                                  {propertyDocument.builtUpArea
                                    ? propertyDocument.builtUpAreaUnit
                                    : ""}
                                </h5>
                              </div>
                            </div>
                          )}
                          {propertyDocument && propertyDocument.carpetArea && (
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/carpetArea.png"
                                  alt=""
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Carpet Area</h6>
                                <h5>
                                  {propertyDocument.carpetArea}{" "}
                                  {propertyDocument.carpetArea
                                    ? propertyDocument.carpetAreaUnit
                                    : ""}
                                </h5>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="property_card_single">
                      <div className="more_detail_card_inner">
                        <h2 className="card_title">Parking</h2>
                        <div className="p_info">
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/car-parking.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Open Car Parking</h6>
                              <h5>{propertyDocument.numberOfOpenCarParking}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/car-parking.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Closed Car Parking</h6>
                              <h5>
                                {propertyDocument.numberOfClosedCarParking}
                              </h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/2Wheelerparking.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>2 Wheeler Parking</h6>
                              <h5>{propertyDocument.twoWheelarParking}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* {propertyDocument.additionalRooms &&
                      propertyDocument.additionalRooms !== null &&
                      propertyDocument.additionalRooms !== '' &&
                      propertyDocument.additionalRooms.length > 0 && (
                        <div className="property_card_single">
                          <div className="more_detail_card_inner">
                            <h2 className="card_title">Additional Rooms </h2>
                            <div className="p_info">
                              {propertyDocument.additionalRooms.map(
                                (additionalroom) => (
                                  <div className="p_info_single">
                                    <div className="pd_icon">
                                      <img src="/assets/img/property-detail-icon/calendar.png" alt="" />
                                    </div>
                                    <h6>{additionalroom}</h6>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )} */}

                    {/* {propertyDocument.additionalArea &&
                      propertyDocument.additionalArea !== null &&
                      propertyDocument.additionalArea !== "" &&
                      propertyDocument.additionalArea.length > 0 && (
                        <div className="property_card_single">
                          <div className="more_detail_card_inner">
                            <h2 className="card_title">Additional Area</h2>
                            <div className="p_info">
                              {propertyDocument.additionalArea.map(
                                (additionalarea) => (
                                  <div className="p_info_single">
                                    <div className="pd_icon">
                                      <img src="/assets/img/property-detail-icon/calendar.png" alt="" />
                                    </div>
                                    <h6>{additionalarea}</h6>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )} */}

                    <div className="property_card_single">
                      <div className="more_detail_card_inner">
                        <h2 className="card_title">Building</h2>
                        <div className="p_info">
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/TotalFloors.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Total Floors</h6>
                              <h5>{propertyDocument.numberOfFloors}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/FloorNumber.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Floor Number</h6>
                              <h5>{propertyDocument.floorNo}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/apartmentOnFloor.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Number of Flats on a Floor</h6>
                              <h5>{propertyDocument.numberOfFlatsOnFloor}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/lift.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Lift</h6>
                              <h5>{propertyDocument.numberOfLifts}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/PowerBackup.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Power Backup</h6>
                              <h5>{propertyDocument.powerBackup}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="property_card_single">
                      <div className="more_detail_card_inner">
                        <h2 className="card_title">Additional Info</h2>
                        <div className="p_info">
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/BachelorBoys.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Bachelor Boys Allowed</h6>
                              <h5>{propertyDocument.bachlorsBoysAllowed}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/BachelorGirls.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Bachelor Girls Allowed</h6>
                              <h5>{propertyDocument.bachlorsGirlsAllowed}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/pets.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Pets Allowed</h6>
                              <h5>{propertyDocument.petsAllowed}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/calendar.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Food Habit</h6>
                              <h5>{propertyDocument.vegNonVeg}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="property_card_single">
                      <div className="more_detail_card_inner">
                        <h2 className="card_title">Visiting Details</h2>
                        <div className="p_info">
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/VisitingHrsFrom.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Visiting Hours From</h6>
                              <h5>
                                {propertyDocument.visitingHrsFrom &&
                                  format(
                                    new Date(propertyDocument.visitingHrsFrom),
                                    "dd MMM,yy hh:mm aa"
                                  )}
                              </h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/VisitingHrsTo.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Visiting Hours To</h6>
                              <h5>
                                {propertyDocument.visitingHrsTo &&
                                  format(
                                    new Date(propertyDocument.visitingHrsTo),
                                    "dd MMM,yy hh:mm aa"
                                  )}
                              </h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/VisitingDays.png"
                                alt=""
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Visiting Days</h6>
                              <h5>{propertyDocument.visitingDays}</h5>
                              <h5>
                                {propertyDocument.visitingDays.map((days) => (
                                  // <li key={user.id}>{user.fullName} ({user.phoneNumber.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2-$3')})</li>
                                  <span></span>
                                ))}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="property_card_single">
                          <div className="more_detail_card_inner">
                            <h2 className="card_title">Property Description</h2>
                            {isPropDescEdit ? (
                              <div>
                                <div>
                                  <RichTextEditor
                                    value={Propvalue}
                                    onChange={setPropValue}
                                  />
                                </div>
                                <div className="vg10"></div>
                                <div className="d-flex justify-content-between">
                                  <div
                                    className="theme_btn btn_border"
                                    onClick={handleCancelPropDesc}
                                    style={{
                                      width: "fit-content",
                                    }}
                                  >
                                    Cancel
                                  </div>
                                  <div
                                    className="theme_btn btn_fill"
                                    onClick={handleSavePropDesc}
                                    style={{
                                      width: "fit-content",
                                    }}
                                  >
                                    Save
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="d-flex align-items-center">
                                  <p
                                    className="editortext"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        propertyDocument &&
                                        propertyDocument.propertyDescription.toString(
                                          "html"
                                        ),
                                    }}
                                  ></p>
                                  {!isPropDescEdit &&
                                    user &&
                                    user.role == "admin" && (
                                      <span
                                        class="material-symbols-outlined click_icon text_near_icon"
                                        onClick={() =>
                                          handleEditPropDesc(
                                            "propertyDescription"
                                          )
                                        }
                                      >
                                        edit
                                      </span>
                                    )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="property_card_single">
                          <div className="more_detail_card_inner">
                            <h2 className="card_title">Owner Instruction</h2>

                            {isEditingOwnerInstruction ? (
                              <div>
                                <div>
                                  <RichTextEditor
                                    value={ownerInstructionvalue}
                                    onChange={setOwnerInstrucitonValue}
                                  />
                                </div>
                                <div className="vg10"></div>
                                <div className="d-flex justify-content-between">
                                  <div
                                    className="theme_btn btn_border"
                                    onClick={handleCancelOwnerInstruction}
                                    style={{
                                      width: "fit-content",
                                    }}
                                  >
                                    Cancel
                                  </div>
                                  <div
                                    className="theme_btn btn_fill"
                                    onClick={handleSaveOwnerInstruction}
                                    style={{
                                      width: "fit-content",
                                    }}
                                  >
                                    Save
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="d-flex align-items-center">
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        propertyDocument &&
                                        propertyDocument.ownerInstructions.toString(
                                          "html"
                                        ),
                                    }}
                                  ></p>
                                  {!isEditingOwnerInstruction &&
                                    user &&
                                    user.role == "admin" && (
                                      <span
                                        class="material-symbols-outlined click_icon text_near_icon"
                                        onClick={() =>
                                          handleEditOwnerInstruction(
                                            "ownerInstructions"
                                          )
                                        }
                                      >
                                        edit
                                      </span>
                                    )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* <div className="col-xl-3">
              <div className="pp_sidebar">
                <div className="pp_sidebar_cards">
                  <div className="pp_sidebarcard_single">
                    <div className="ppss_img">
                      <img src="/assets/img/property/p2.jpg" alt="" />
                    </div>
                    <div className="ppss_header">
                      <h5>Brij Residency Phase 2</h5>
                      <h6>GRV Constructions</h6>
                      <h6 className="location">MR 11, Indore</h6>
                    </div>
                    <div className="ppss_footer">
                      <h6>1, 3 BHK Flats</h6>
                      <h6>
                        <span>₹ 22.2 Lac</span> onwards
                      </h6>
                      <h6>Marketed by D2R</h6>
                    </div>
                  </div>
                  <div className="pp_sidebarcard_single">
                    <div className="ppss_img">
                      <img src="/assets/img/property/p2.jpg" alt="" />
                    </div>
                    <div className="ppss_header">
                      <h5>Brij Residency Phase 2</h5>
                      <h6>GRV Constructions</h6>
                      <h6 className="location">MR 11, Indore</h6>
                    </div>
                    <div className="ppss_footer">
                      <h6>1, 3 BHK Flats</h6>
                      <h6>
                        <span>₹ 22.2 Lac</span> onwards
                      </h6>
                      <h6>Marketed by D2R</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            </div>
          </div>
        </section>
        <br></br>
      </div>
    </>
  );
};

export default PropertyDetails;
