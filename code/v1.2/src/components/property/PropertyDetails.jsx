import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "react-image-gallery/styles/css/image-gallery.css";
import Gallery from "react-image-gallery";
import { projectStorage } from "../../firebase/config";
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
import PropertyLayoutComponent from "./PropertyLayoutComponent";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';



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

  // install Swiper modules
  SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

  // get user from useauthcontext
  const { propertyid } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { document: propertyDocument, error: propertyDocError } = useDocument(
    "properties",
    propertyid
  );
  const { documents: inspections, errors: inspectionsError } = useCollection("propertyinspections", ["propertyId", "==", propertyid]);
  const { documents: enquiryDocs, error: enquiryDocsError } = useCollection("enquiry", ["propId", "==", propertyid])
  const [propertyManagerDoc, setpropertyManagerDoc] = useState(null);
  const [propertyOwnerDoc, setpropertyOwnerDoc] = useState(null);
  const [propertyCoOwnerDoc, setpropertyCoOwnerDoc] = useState(null);
  const [propertyPOCDoc, setpropertyPOCDoc] = useState(null);
  const [propertyOnboardingDateFormatted, setPropertyOnboardingDateFormatted] =
    useState();

  const { documents: dbUsers, error: dbuserserror } = useCollection("users", [
    "status",
    "==",
    "active",
  ]);

  // add data of tenant in firebase start
  const { documents: tenantDocument, errors: tenantDocError } = useCollection(
    "tenants",
    ["propertyId", "==", propertyid]
  );

  const { documents: propertyLayouts, errors: propertyLayoutsError } = useCollection(
    "propertylayouts",
    ["propertyId", "==", propertyid]
  );

  const { documents: allPropertyUsers, errors: propertyUsersError } = useCollection(
    "propertyusers",
    ["propertyId", "==", propertyid]
  );

  const propertyOwners = allPropertyUsers && allPropertyUsers.filter((doc) => (doc.userType === "propertyowner"))

  const propertyManagers = allPropertyUsers && allPropertyUsers.filter((doc) => (doc.userType === "propertymanager"))


  const { documents: propertyDocList, errors: propertyDocListError } = useCollection("docs", ["masterRefId", "==", propertyid]);

  const { addDocument: tenantAddDocument, error: tenantAddDocumentError } = useFirestore("tenants");
  const { addDocument: addProperyUsersDocument, updateDocument: updateProperyUsersDocument, deleteDocument: deleteProperyUsersDocument, error: errProperyUsersDocument } = useFirestore("propertyusers");
  const { addDocument: propertyLayoutAddDocument, error: propertyLayoutAddDocumentError } = useFirestore("propertylayouts");
  const { updateDocument: updatePropertyLayoutDocument, deleteDocument: deletePropertyLayoutDocument, error: propertyLayoutDocumentError } = useFirestore("propertylayouts");


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
  const [layoutid, setLayoutId] = useState(null);
  const [showPropertyLayoutComponent, setShowPropertyLayoutComponent] = useState(false);
  const handleShowPropertyLayoutComponent = () => {
    setLayoutId(null)
    setShowPropertyLayoutComponent(true);
  };

  const editPropertyLayout = async (layoutid) => {
    // console.log('layout id: ', layoutid)
    setShowPropertyLayoutComponent(true);
    setLayoutId(layoutid)
  };

  const deletePropertyLayout = async (layoutid) => {
    // console.log('layout id: ', layoutid)
    try {
      await deletePropertyLayoutDocument(layoutid);
      console.log('property layout document deleted successfully')
    } catch (error) {
      console.error("Error deleting property layout document:", error);
    }
    setShowConfirmModal(false);
  };


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

  // attachments in property layout
  const [attachments, setAttachments] = useState([]); //initialize array

  // Function to add an item
  var addAttachment = (item) => {
    console.log('item for addAttachment;', item)
    setAttachments([...attachments, item]);
    // setPropertyLayout([...propertyLayout.RoomAttachments, item]);
  };

  // Function to remove an item by value
  var removeAttachment = (item) => {
    console.log('item for removeAttachment;', item)
    setAttachments(attachments.filter(i => i !== item));
    // setPropertyLayout(propertyLayout.RoomAttachments && propertyLayout.RoomAttachments.filter(i => i !== item));
  };

  const handleAttachmentInputChange = (index, name, value, isChecked) => {
    console.log('isChecked:', isChecked)
    // console.log('index:', index)
    // console.log('value:', value)
    isChecked === true ? addAttachment(name) : removeAttachment(name)
  };

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

    await tenantAddDocument(tenantData);
    if (tenantAddDocumentError) {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(dbUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [changeManagerPopup, setchangeManagerPopup] = useState(false);
  const [userdbFieldName, setUserdbFieldName] = useState();
  const [changedUser, setChangedUser] = useState();

  // const openChangeUser = () => {
  //   console.log("Open Change Manager");
  //   setchangeManagerPopup(true);
  // }
  const openChangeUser = (docId) => {
    console.log("Open Change User");
    setchangeManagerPopup(true);
    // setUserdbFieldName(option);
    setChangedUser(docId)
  };

  const closeChangeManager = () => {
    setchangeManagerPopup(false);
  };

  const confirmChangeUser = async () => {
    const updatedPropertyUser = {
      userId: selectedUser,
      updatedAt: timestamp.fromDate(new Date()),
      updatedBy: user.uid,
    };

    // console.log('updateDocId: ', changedUser)

    await updateProperyUsersDocument(changedUser, updatedPropertyUser);

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
    console.log('filtered: ', filtered)
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
    loop: false,
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

  // owl carousel option start for rooms
  const optionsroom = {
    items: 2,
    dots: false,
    loop: false,
    margin: 15,
    nav: true,
    smartSpeed: 1500,
    autoplay: false,
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
        items: 2,
      },
    },
  };
  // owl carousel option end for rooms


  // owl carousel option start for rooms
  const optionstenant = {
    items: 4,
    dots: false,
    loop: false,
    margin: 15,
    nav: true,
    smartSpeed: 1500,
    autoplay: false,
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


  // owl carousel option end for rooms

  // 9 dots controls
  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };
  // 9 dots controls



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

  //Property Users / Owners - Starts

  const [filteredPropertyOwners, setfilteredPropertyOwners] = useState([]); //initialize array
  const [filteredPropertyManagers, setfilteredPropertyManagers] = useState([]); //initialize array

  useEffect(() => {
    //Property Owners
    // Create a map from the selectedUsers array for quick lookup
    const selectedPropertyOwnersMap = propertyOwners && propertyOwners.reduce((map, user) => {
      map[user.userId] = user;
      return map;
    }, {});

    // console.log('selectedUsersMap: ', selectedUsersMap)

    //Now create a list of users from all dbUser List as per the selected users map    
    const filteredPropertyOwnerList = selectedPropertyOwnersMap && dbUsers && dbUsers
      .filter(user => selectedPropertyOwnersMap[user.id])
      .map(user => ({
        ...user,
        ...selectedPropertyOwnersMap[user.id]
      }));

    setfilteredPropertyOwners(filteredPropertyOwnerList)

    //Property Managers
    // Create a map from the selectedUsers array for quick lookup
    const selectedPropertyManagersMap = propertyManagers && propertyManagers.reduce((map, user) => {
      map[user.userId] = user;
      return map;
    }, {});

    // console.log('selectedUsersMap: ', selectedUsersMap)

    //Now create a list of users from all dbUser List as per the selected users map    
    const filteredPropertyManagerList = selectedPropertyManagersMap && dbUsers && dbUsers
      .filter(user => selectedPropertyManagersMap[user.id])
      .map(user => ({
        ...user,
        ...selectedPropertyManagersMap[user.id]
      }));

    setfilteredPropertyManagers(filteredPropertyManagerList)

  }, [allPropertyUsers])

  // console.log('filteredProperty Users: ', filteredPropertyusers)

  //Add Property Users
  const handleAddPropertyUser = async (e, _usertype) => {
    e.preventDefault(); // Prevent the default form submission behavior 

    console.log('user type: ', _usertype)
    // const filtered = dbUsers && dbUsers.filter((user) =>
    //   (user.fullName.toLowerCase().includes(query.toLowerCase()) || (user.phoneNumber.includes(query)))
    // );
    const isAlreadyExist = _usertype === 'propertyowner' ? propertyOwners && propertyOwners.filter((propuser) =>
      (propuser.userId === propertyDocument.createdBy) && (propuser.userType === _usertype)) : propertyManagers && propertyManagers.filter((propuser) =>
        (propuser.userId === propertyDocument.createdBy) && (propuser.userType === _usertype))

    // console.log('isAlreadyExist: ', isAlreadyExist)

    if (isAlreadyExist.length === 0) {
      const propertyUserData = {
        propertyId: propertyid,
        userId: propertyDocument.createdBy,
        userTag: "Admin",
        userType: _usertype,
      };

      await addProperyUsersDocument(propertyUserData);
      if (errProperyUsersDocument) {
        console.log("response error: ", errProperyUsersDocument);
      }
    }
  }

  //Property Users / Owners - Ends


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

  // modal controls start 
  // start modal for property layout in detail
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false);

  const handleRoomModalClose = () => setShowRoomModal(false);
  const handleShowRoomModal = (room) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };
  // confirm room delete 
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const handleConfirmClose = () => setShowConfirmModal(false);
  const handleConfirmShow = () => {
    setShowRoomModal(false);
    setShowConfirmModal(true);
  };
  // end modal for property layout in detail
  // modal for change role of property user 
  //   modal code 
  const [selectedPropUser, setSelectedPropUser] = useState(null);
  const [selectedUserTag, setSelectedUserTag] = useState(null);
  const [showPropOwner, setShowPropOwner] = useState(false);
  const [showPropManager, setShowPropManager] = useState(false);

  const handleUserTagChange = (_newtag) => {
    setSelectedUserTag(_newtag)
    // console.log('in handleUserTagChange: ', _newtag)
  };

  const handleClosePropUserTags = async (e, _option, _usertype) => {
    // console.log('In handleClosePropUserTags: ', _option)
    // console.log('In handleClosePropUserTags selectedPropUser id: ', selectedPropUser.id)
    if (_option === 'save') {
      const updatedTag = {
        userTag: selectedUserTag,
        updatedAt: timestamp.fromDate(new Date()),
        updatedBy: user.uid,
      };

      // console.log('updatedTag: ', updatedTag)
      await updateProperyUsersDocument(selectedPropUser.id, updatedTag);

    }
    //Cancel opion check Not Required
    // if (option === 'cancel') {

    // }
    _usertype === 'propowner' ? setShowPropOwner(false) : setShowPropManager(false)
  }
  const handleShowOwnerTags = (e, _propUser, _usertype) => {
    console.log('In handleShowOwnerTags propUser: ', _propUser)
    setSelectedPropUser(_propUser);

    _usertype === 'propowner' ? setShowPropOwner(true) : setShowPropManager(true)
  };
  const [showConfirmPropUser, setShowConfirmPropUser] = useState(false);

  const handleCloseConfirmPropUser = async (e, _option) => {
    // console.log('_option: ', _option)
    //Delete Prop User if option is 'confirm'
    if (_option === 'confirm') {
      await deleteProperyUsersDocument(selectedPropUser.id);
    }

    setShowConfirmPropUser(false);
  }

  const handleDeletePropUser = (e, propUser) => {
    console.log('propUser : ', propUser)
    setSelectedPropUser(propUser);
    setShowConfirmPropUser(true);

  };
  // modal controls end 

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
            Change User
          </h1>
          <br></br>
          <div>
            <input
              style={{ background: "#efefef", height: "40px", width: "90%", paddingLeft: "16px" }}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search users by mobile no or name..."
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
                      ) - {user.city}
                    </label>
                  </li>
                ))}
            </ul>
          </div>
          <div id="id_sendotpButton" className="change-number-button-div">
            <button
              onClick={closeChangeManager}
              className="theme_btn btn_fill"
              style={{ background: "#afafaf" }}
            >
              Cancel
            </button>
            <button onClick={confirmChangeUser} className="theme_btn full_width btn_border">
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

      <div div className="pg_property pd_single pg_bg">
        <div className="page_spacing full_card">
          {/* top search bar */}
          {!user && (
            <div className="top_search_bar">
              <Link to="/properties" className="back_btn">
                <span class="material-symbols-outlined">arrow_back</span>
                <span>Back</span>
              </Link>
            </div>
          )}
          <div className="property_cards">
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
                <div className="extra_info_card_property">
                  <div className="card_upcoming">
                    <div className="parent">
                      <div className="child">
                        <div className="left">
                          <h5>25-June-2025</h5>
                          <div className="line">
                            <div className="line_fill" style={{
                              width: "25%",
                              background: "#00a300"
                            }}>
                            </div>
                          </div>
                          <h6>Inspection Date</h6>
                        </div>
                        {/* <div className="right">
              <img src="./assets/img/icons/inspection.png" alt="" className="cion" />
              </div> */}
                      </div>
                      <div className="child">
                        <div className="left">
                          <h5>30-July-2024</h5>
                          <div className="line">
                            <div className="line_fill" style={{
                              width: "92%",
                              background: "#FA6262"
                            }}>
                            </div>
                          </div>
                          <h6>Rent Renewal</h6>
                        </div>
                        {/* <div className="right">
              <img src="./assets/img/icons/inspection.png" alt="" className="cion" />
              </div> */}
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
                        {/* Documents */}
                        <Link to={`/propertydocumentdetails/${propertyid}`} >
                          <div className="item eicp_single">
                            <div className="icon">
                              <span class="material-symbols-outlined">
                                description
                              </span>
                              <div className="text">
                                <h6>{propertyDocList && propertyDocList.length}</h6>
                                <h5>Documents</h5>
                              </div>
                            </div>
                          </div>
                        </Link>
                        {/* Inspection  */}
                        <Link to={`/propertyinspectiondocument/${propertyid}`} >
                          <div className="item eicp_single">
                            <div className="icon">
                              <span class="material-symbols-outlined">
                                pageview
                              </span>
                              <div className="text">
                                <h6>{inspections && inspections.length}</h6>
                                <h5>Inspections</h5>
                              </div>
                            </div>
                          </div>
                        </Link>
                        {/* Enquiry  */}
                        <Link to={`/enquiry/${propertyid}`} >
                          <div className="item eicp_single">
                            <div className="icon">
                              <span class="material-symbols-outlined">
                                support_agent
                              </span>
                              <div className="text">
                                <h6>{enquiryDocs && enquiryDocs.length}</h6>
                                <h5>Enquiries</h5>
                              </div>
                            </div>
                          </div>

                        </Link>
                        {/* Transactions */}
                        <Link to={`/transactions/${propertyid}`}>
                          <div className="item eicp_single">
                            <div className="icon">
                              <span class="material-symbols-outlined">
                                payments
                              </span>
                              <div className="text">
                                <h6>5</h6>
                                <h5>Transactions</h5>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </OwlCarousel>
                    </div>

                  )}
                {/* property layout section start */}
                {/* {!showAIForm && (
                  <section className="property_card_single add_aditional_form">
                    <div className="more_detail_card_inner relative">
                      <h2 className="card_title">
                        Property Layout Old
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
                          
                          <div className="col-md-12">
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
                                {propertyLayouts.map((layout, index) => (
                                  <div className="checkbox_single">
                                    <input
                                      type="checkbox"
                                      id={layout.roomName}
                                      name={layout.roomName}
                                      onChange={(e) =>
                                        handleAttachmentInputChange(
                                          index,
                                          layout.roomName,
                                          e.target.value,
                                          e.target.checked
                                        )
                                      }
                                    />
                                    <label htmlFor={layout.roomName}>{layout.roomName}</label>
                                  </div>
                                ))}
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
                )} */}
                {/* Show Property Layout Component */}
                {showPropertyLayoutComponent && <PropertyLayoutComponent propertylayouts={propertyLayouts} propertyid={propertyid} layoutid={layoutid} setShowPropertyLayoutComponent={setShowPropertyLayoutComponent}></PropertyLayoutComponent>}

                {
                  (<section className="property_card_single full_width_sec with_blue">
                    <span className="verticall_title">
                      Layout :  {propertyLayouts && propertyLayouts.length}
                    </span>
                    <div className="more_detail_card_inner">
                      <div className="row">
                        {(user && user.role === "admin") &&
                          <div className="col-1">
                            <div className="plus_icon">
                              <Link className="plus_icon_inner"
                                onClick={handleShowPropertyLayoutComponent}
                              >
                                <span class="material-symbols-outlined">
                                  add
                                </span>
                              </Link>
                            </div>
                          </div>}
                        <div className="col-11">
                          <div className="property_layout_card">
                            <OwlCarousel className="owl-theme" {...optionsroom}>
                              {propertyLayouts && propertyLayouts.map((room, index) => (
                                <div className="ai_detail_show item" key={index}>
                                  <div className="left relative">
                                    {(() => {
                                      if (room.roomType === "Bedroom") {
                                        return (
                                          <img
                                            src="/assets/img/icons/illustrate_bedroom.jpg"
                                            alt={room.roomType}
                                          />
                                        );
                                      } else if (room.roomType === "Kitchen") {
                                        return (
                                          <img
                                            src="/assets/img/icons/illustrate_kitchen.jpg"
                                            alt={room.roomType}
                                          />
                                        );
                                      } else if (room.roomType === "Living Room") {
                                        return (
                                          <img
                                            src="/assets/img/icons/illustrate_livingroom.jpg"
                                            alt={room.roomType}
                                          />
                                        );
                                      } else if (room.roomType === "Bathroom") {
                                        return (
                                          <img
                                            src="/assets/img/icons/illustrate_bathroom.jpg"
                                            alt={room.roomType}
                                          />
                                        );
                                      } else if (room.roomType === "Dining Room") {
                                        return (
                                          <img
                                            src="/assets/img/icons/illustrate_dining.jpg"
                                            alt={room.roomType}
                                          />
                                        );
                                      } else if (room.roomType === "Balcony") {
                                        return (
                                          <img
                                            src="/assets/img/icons/illustrate_balcony.jpg"
                                            alt={room.roomType}
                                          />
                                        );
                                      } else {
                                        return (
                                          <img
                                            src="/assets/img/icons/illustrate_basment.jpg"
                                            alt={room.roomType}
                                          />
                                        );
                                      }
                                    })()}
                                    <label htmlFor="imgupload" className="upload_img click_text by_text">
                                      Upload img
                                      <input
                                        type="file"
                                        id="imgupload"
                                      />
                                    </label>
                                  </div>
                                  <div className="right">
                                    <h5>{room.roomName}</h5>
                                    <div className="in_detail">
                                      <span className="in_single">Area {room.roomTotalArea}sq/ft</span>
                                      <span className="in_single">Length {room.roomLength}ft</span>
                                      <span className="in_single">Width {room.roomWidth}ft</span>
                                      {room.roomFixtures && room.roomFixtures.map((fixture, findex) => (
                                        <span className="in_single" key={findex}>{fixture}</span>
                                      ))}
                                    </div>
                                    <div className="view_edit d-flex justify-content-between mt-2" style={{ marginLeft: "7px" }}>
                                      <span className="click_text pointer" onClick={() => editPropertyLayout(room.id)}>Edit</span>
                                      <span className="click_text pointer" onClick={() => handleShowRoomModal(room)}>View More</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </OwlCarousel>

                            {selectedRoom && (
                              <>
                                <Modal show={showRoomModal} onHide={handleRoomModalClose} className="detail_modal">
                                  <span class="material-symbols-outlined modal_close" onClick={handleRoomModalClose}>
                                    close
                                  </span>
                                  <h5 className="modal_title text-center">
                                    {selectedRoom.roomName}
                                  </h5>
                                  <div className="modal_body">
                                    <div className="img_area">
                                      {(() => {
                                        if (selectedRoom.roomType === "Bedroom") {
                                          return (
                                            <img style={{
                                              width: "100%"
                                            }}
                                              src="/assets/img/icons/illustrate_bedroom.jpg"
                                              alt={selectedRoom.roomType}
                                            />
                                          );
                                        } else if (selectedRoom.roomType === "Kitchen") {
                                          return (
                                            <img style={{
                                              width: "100%"
                                            }}
                                              src="/assets/img/icons/illustrate_kitchen.jpg"
                                              alt={selectedRoom.roomType}
                                            />
                                          );
                                        } else if (selectedRoom.roomType === "Living Room") {
                                          return (
                                            <img style={{
                                              width: "100%"
                                            }}
                                              src="/assets/img/icons/illustrate_livingroom.jpg"
                                              alt={selectedRoom.roomType}
                                            />
                                          );
                                        } else if (selectedRoom.roomType === "Bathroom") {
                                          return (
                                            <img style={{
                                              width: "100%"
                                            }}
                                              src="/assets/img/icons/illustrate_bathroom.jpg"
                                              alt={selectedRoom.roomType}
                                            />
                                          );
                                        } else if (selectedRoom.roomType === "Dining Room") {
                                          return (
                                            <img style={{
                                              width: "100%"
                                            }}
                                              src="/assets/img/icons/illustrate_dining.jpg"
                                              alt={selectedRoom.roomType}
                                            />
                                          );
                                        } else if (selectedRoom.roomType === "Balcony") {
                                          return (
                                            <img style={{
                                              width: "100%"
                                            }}
                                              src="/assets/img/icons/illustrate_balcony.jpg"
                                              alt={selectedRoom.roomType}
                                            />
                                          );
                                        } else {
                                          return (
                                            <img style={{
                                              width: "100%"
                                            }}
                                              src="/assets/img/icons/illustrate_basment.jpg"
                                              alt={selectedRoom.roomType}
                                            />
                                          );
                                        }
                                      })()}
                                    </div>
                                    <div className="main_detail">
                                      <div className="md_single">
                                        Area : <span className="value">{selectedRoom.roomTotalArea}</span><span className="unit">sq/ft</span>
                                      </div>
                                      <div className="md_single">
                                        Length : <span className="value">{selectedRoom.roomLength}</span><span className="unit">ft</span>
                                      </div>
                                      <div className="md_single">
                                        Width : <span className="value">{selectedRoom.roomWidth}</span><span className="unit">ft</span>
                                      </div>
                                    </div>
                                    <div className="more_detail">
                                      {selectedRoom.roomFixtures && selectedRoom.roomFixtures.map((fixture, index) => (
                                        <span className="more_detail_single" key={index}>{fixture}</span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="attached_with">
                                    {selectedRoom.roomAttachments && (
                                      <h6 className="text-center text_black">Attached with</h6>
                                    )
                                    }
                                    <div className="more_detail">
                                      {selectedRoom.roomAttachments && selectedRoom.roomAttachments.map((attachment, findex) => (
                                        <span className="more_detail_single">{attachment}</span>
                                      ))}
                                    </div>

                                  </div>
                                  <div className="modal_footer">
                                    <div onClick={handleConfirmShow} className="delete_bottom">
                                      <span className="material-symbols-outlined">delete</span>
                                      <span>Delete</span>
                                    </div>
                                  </div>
                                </Modal>
                                <Modal show={showConfirmModal} onHide={handleConfirmClose}>
                                  <Modal.Header className="justify-content-center" style={{
                                    paddingBottom: "0px",
                                    border: "none"
                                  }}>
                                    <h5>
                                      Alert
                                    </h5>
                                  </Modal.Header>
                                  <Modal.Body className="text-center" style={{
                                    color: "#FA6262",
                                    fontSize: "20px",
                                    border: "none"
                                  }}>Are you sure you want to delete?</Modal.Body>
                                  <Modal.Footer className="d-flex justify-content-between" style={{
                                    border: "none",
                                    gap: "15px"
                                  }}>
                                    <div className="cancel_btn" onClick={() => deletePropertyLayout(selectedRoom.id)}  >
                                      Yes
                                    </div>
                                    <div className="done_btn" onClick={handleConfirmClose}>
                                      No
                                    </div>
                                  </Modal.Footer>
                                </Modal>
                              </>

                            )}


                          </div>
                        </div>
                      </div>

                    </div>
                  </section>)}
                {/* property layout section end  */}

                {/* tenant card start */}
                {((user && user.role === "owner") ||
                  (user && user.role === "coowner") ||
                  (user && user.role === "admin")) && (<section className="property_card_single full_width_sec with_orange">
                    <span className="verticall_title">
                      Tenants :  {tenantDocument && tenantDocument.length}
                    </span>
                    <div className="more_detail_card_inner">
                      <div className="row">
                        <div className="col-1">
                          <div className="plus_icon">
                            <Link className="plus_icon_inner" onClick={handleAddTenant}>
                              <span class="material-symbols-outlined">
                                add
                              </span>
                            </Link>
                          </div>

                        </div>
                        <div className="col-11">
                          <div className="tenant_card">
                            <Swiper
                              spaceBetween={15}
                              slidesPerView={3.5}
                              pagination={{ clickable: true }}
                              freeMode={true}
                              className='all_tenants'
                            >
                              {tenantDocument &&
                                tenantDocument.map((tenant, index) => (
                                  <SwiperSlide key={index}>
                                    <div
                                      className={`tc_single relative item ${tenant.status === "inactive" ? "t_inactive" : ""}`}
                                    >
                                      <Link className="left" to={`/tenantdetails/${tenant.id}`}>
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
                                      </Link>
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
                                    </div>
                                  </SwiperSlide>
                                ))}
                            </Swiper>

                          </div>
                        </div>
                      </div>

                    </div>
                  </section>)}
                {/* tenant card end  */}


                {/* property user card  start */}
                {((user && user.role === "owner") ||
                  (user && user.role === "coowner") ||
                  (user && user.role === "admin")) && (
                    <>
                      <section className="property_card_single full_width_sec with_blue property_user">
                        <span className="verticall_title">
                          Owners :  {filteredPropertyOwners && filteredPropertyOwners.length}
                        </span>
                        <div className="more_detail_card_inner">
                          <div className="row">
                            {(user && user.role === "admin") &&
                              <div className="col-1">
                                <div className="plus_icon">
                                  <Link className="plus_icon_inner" onClick={(e) => handleAddPropertyUser(e, 'propertyowner')}>
                                    <span class="material-symbols-outlined">
                                      add
                                    </span>
                                  </Link>
                                </div>

                              </div>
                            }
                            <div className="col-11">
                              <div className="tenant_card">
                                <Swiper
                                  spaceBetween={15}
                                  slidesPerView={3.5}
                                  pagination={{ clickable: true }}
                                  freeMode={true}
                                  className='all_tenants'
                                >
                                  {filteredPropertyOwners &&
                                    filteredPropertyOwners.map((propUser, index) => (
                                      <SwiperSlide key={index}>
                                        <div className="tc_single relative">
                                          <div
                                            className="property_people_designation d-flex align-items-end justify-content-center pointer"
                                            onClick={(e) => handleShowOwnerTags(e, propUser, 'propowner')}
                                          >
                                            {propUser.userTag}
                                            <span
                                              className="material-symbols-outlined click_icon text_near_icon"
                                              style={{ fontSize: "10px" }}
                                            >
                                              edit
                                            </span>
                                          </div>
                                          <div className="left">
                                            <div className="tcs_img_container">
                                              <img
                                                src={propUser.photoURL || "/assets/img/dummy_user.png"}
                                                alt="Preview"
                                              />
                                            </div>
                                            <div className="tenant_detail">
                                              <h5
                                                onClick={
                                                  user && user.role === "admin"
                                                    ? () => openChangeUser(propUser.id)
                                                    : ""
                                                }
                                                className={`t_name ${user && user.role === "admin" ? "pointer" : ""}`}
                                              >
                                                {propUser.fullName}
                                                {user && user.role === "admin" && (
                                                  <span className="material-symbols-outlined click_icon text_near_icon">
                                                    edit
                                                  </span>
                                                )}
                                              </h5>
                                              <h6 className="t_number">
                                                {propUser.phoneNumber.replace(
                                                  /(\d{2})(\d{5})(\d{5})/,
                                                  "+$1 $2-$3"
                                                )}
                                              </h6>
                                              <h6
                                                className="text_red pointer"
                                                style={{
                                                  width: "fit-content",
                                                  fontSize: "10px",
                                                  letterSpacing: "0.4px",
                                                  marginLeft: "3px"
                                                }}
                                                onClick={(e) => handleDeletePropUser(e, propUser)}
                                              >
                                                Delete
                                              </h6>
                                            </div>
                                          </div>
                                          <div className="wha_call_icon">
                                            <Link
                                              className="call_icon wc_single"
                                              to={propUser ? `tel:${propUser.phoneNumber.replace(/\D/g, '')}` : "#"}
                                            >
                                              <img src="/assets/img/simple_call.png" alt="" />
                                            </Link>
                                            <Link
                                              className="wha_icon wc_single"
                                              to={propUser ? `https://wa.me/${propUser.phoneNumber.replace(/\D/g, '')}` : "#"}
                                              target="_blank"
                                            >
                                              <img src="/assets/img/whatsapp_simple.png" alt="" />
                                            </Link>
                                          </div>
                                        </div>
                                      </SwiperSlide>
                                    ))}
                                </Swiper>

                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                      {selectedPropUser && (
                        <Modal show={showPropOwner} onHide={(e) => handleClosePropUserTags(e, 'cancel', 'propowner')} className='my_modal'>
                          <span class="material-symbols-outlined modal_close" onClick={(e) => handleClosePropUserTags(e, 'cancel', 'propowner')}>
                            close
                          </span>
                          <Modal.Body>
                            <h6 className="m18 lh22 mb-3">
                              Full Name: {selectedPropUser.fullName}
                            </h6>
                            <div className='form_field'>
                              <div className='field_box theme_radio_new'>
                                <div className="theme_radio_container" style={{
                                  padding: "0px",
                                  border: "none"
                                }}>
                                  <div className="radio_single">
                                    <input type="radio" name="prop_user" value="Admin" id='Admin'
                                      onChange={() => handleUserTagChange("Admin")} />
                                    <label htmlFor="Admin">Admin</label>
                                  </div>
                                  {/* checked={selectedPropUser.userTag === "Admin"}  */}
                                  <div className="radio_single">
                                    <input type="radio" name="prop_user" value="Owner" id='Owner'
                                      onChange={() => handleUserTagChange("Owner")} />
                                    <label htmlFor="Owner">Owner</label>
                                  </div>
                                  {/* checked={selectedPropUser.userTag === "Owner"}  */}
                                  <div className="radio_single">
                                    <input type="radio" name="prop_user" value="Co-Owner" id='Co-Owner'
                                      onChange={() => handleUserTagChange("Co-Owner")} />
                                    <label htmlFor="Co-Owner">Co-Owner</label>
                                  </div>
                                  {/* checked={selectedPropUser.userTag === "Co-Owner"}  */}
                                  <div className="radio_single">
                                    <input type="radio" name="prop_user" value="POC" id='POC'
                                      onChange={() => handleUserTagChange("POC")} />
                                    <label htmlFor="POC">POC</label>
                                  </div>
                                  {/* checked={selectedPropUser.userTag === "POC"}  */}
                                  <div className="radio_single">
                                    <input type="radio" name="prop_user" value="POA" id='POA'
                                      onChange={() => handleUserTagChange("POA")} />
                                    <label htmlFor="POA">POA</label>
                                  </div>
                                  {/* checked={selectedPropUser.userTag === "POA"}  */}
                                </div>
                              </div>
                            </div>
                            <div className="vg22"></div>
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="cancel_btn" onClick={(e) => handleClosePropUserTags(e, 'cancel', 'propowner')}  >
                                Cancel
                              </div>
                              <div className="done_btn" onClick={(e) => handleClosePropUserTags(e, 'save', 'propowner')}>
                                Save Changes
                              </div>
                            </div>

                          </Modal.Body>
                        </Modal>

                      )}
                      {selectedPropUser && (
                        <Modal show={showConfirmPropUser} onHide={(e) => handleCloseConfirmPropUser(e, 'cancel')}>
                          <Modal.Header className="justify-content-center" style={{
                            paddingBottom: "0px",
                            border: "none"
                          }}>
                            <h5>
                              Alert
                            </h5>
                          </Modal.Header>
                          <Modal.Body className="text-center" style={{
                            color: "#FA6262",
                            fontSize: "20px",
                            border: "none"
                          }}>Are you sure you want to delete?</Modal.Body>
                          <Modal.Footer className="d-flex justify-content-between" style={{
                            border: "none",
                            gap: "15px"
                          }}>
                            <div className="cancel_btn" onClick={(e) => handleCloseConfirmPropUser(e, 'confirm')}  >
                              Yes
                            </div>
                            <div className="done_btn" onClick={(e) => handleCloseConfirmPropUser(e, 'cancel')}>
                              No
                            </div>
                          </Modal.Footer>
                        </Modal>
                      )}
                    </>
                  )}
                {/* property user card end  */}

                {/* propdial managers / users card  start */}
                {((user && user.role === "owner") ||
                  (user && user.role === "coowner") ||
                  (user && user.role === "admin")) && (
                    <>

                      <section className="property_card_single full_width_sec with_orange property_user">
                        <span className="verticall_title">
                          Managers :  {filteredPropertyManagers && filteredPropertyManagers.length}
                        </span>
                        <div className="more_detail_card_inner">
                          <div className="row">
                            {(user && user.role === "admin") &&
                              <div className="col-1">
                                <div className="plus_icon">
                                  <Link className="plus_icon_inner" onClick={(e) => handleAddPropertyUser(e, 'propertymanager')}>
                                    <span class="material-symbols-outlined">
                                      add
                                    </span>
                                  </Link>
                                </div>

                              </div>
                            }
                            <div className="col-11">
                              <div className="tenant_card">
                                <Swiper
                                  spaceBetween={15}
                                  slidesPerView={3.5}
                                  pagination={{ clickable: true }}
                                  freeMode={true}
                                  className='all_tenants'
                                >
                                  {filteredPropertyManagers &&
                                    filteredPropertyManagers.map((propUser, index) => (
                                      <SwiperSlide key={index}>
                                        <div
                                          className="tc_single relative item"
                                        >
                                          <div className="property_people_designation d-flex align-items-end justify-content-center" onClick={(e) => handleShowOwnerTags(e, propUser, 'propmanager')}>
                                            {propUser.userTag}
                                            <span class="material-symbols-outlined click_icon text_near_icon" style={{
                                              fontSize: "10px"
                                            }}>edit</span>
                                          </div>
                                          <div className="left">
                                            <div className="tcs_img_container" >
                                              <img
                                                src={
                                                  propUser.photoURL ||
                                                  "/assets/img/dummy_user.png"
                                                }
                                                alt=""
                                              />
                                            </div>
                                            <div
                                              className="tenant_detail"
                                            >
                                              <h5
                                                onClick={
                                                  user && user.role === "admin"
                                                    ? () =>
                                                      openChangeUser(propUser.id)
                                                    : ""
                                                }
                                                className={`t_name ${user && user.role === "admin"
                                                  ? "pointer"
                                                  : ""
                                                  }`}
                                              >
                                                {propUser.fullName}
                                                {user && user.role === "admin" && (
                                                  <span className="material-symbols-outlined click_icon text_near_icon">
                                                    edit
                                                  </span>
                                                )}
                                              </h5>
                                              <h6 className="t_number">
                                                {propUser.phoneNumber.replace(
                                                  /(\d{2})(\d{5})(\d{5})/,
                                                  "+$1 $2-$3"
                                                )}
                                              </h6>
                                              <h6 className="text_red pointer" style={{
                                                width: "fit-content",
                                                fontSize: "10px",
                                                letterSpacing: "0.4px",
                                                marginLeft: "3px"
                                              }} onClick={(e) => handleDeletePropUser(e, propUser)}>
                                                Delete
                                              </h6>
                                            </div>
                                          </div>
                                          <div className="wha_call_icon">
                                            < Link
                                              className="call_icon wc_single"
                                              to={
                                                propUser
                                                  ? `tel:${propUser.phoneNumber.replace(/\D/g, '')}`
                                                  : "#"
                                              }
                                            >
                                              <img
                                                src="/assets/img/simple_call.png"
                                                alt=""
                                              />
                                            </Link>
                                            <Link
                                              className="wha_icon wc_single"
                                              to={
                                                propUser
                                                  ? `https://wa.me/${propUser.phoneNumber.replace(/\D/g, '')}`
                                                  : "#"
                                              }
                                              target="_blank"
                                            >
                                              <img
                                                src="/assets/img/whatsapp_simple.png"
                                                alt=""
                                              />
                                            </Link>
                                          </div>
                                        </div>
                                      </SwiperSlide>
                                    ))}
                                </Swiper>

                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                      {selectedPropUser && (
                        <Modal show={showPropManager} onHide={(e) => handleClosePropUserTags(e, 'cancel', 'propmanager')} className='my_modal'>
                          <span class="material-symbols-outlined modal_close" onClick={(e) => handleClosePropUserTags(e, 'cancel', 'propmanager')}>
                            close
                          </span>
                          <Modal.Body>
                            <h6 className="m18 lh22 mb-3">
                              Full Name: {selectedPropUser.fullName}
                            </h6>
                            <div className='form_field'>
                              <div className='field_box theme_radio_new'>
                                <div className="theme_radio_container" style={{
                                  padding: "0px",
                                  border: "none"
                                }}>
                                  <div className="radio_single">
                                    <input type="radio" name="prop_user" value="Admin" id='Admin'
                                      checked={selectedPropUser.userTag === "Admin"} onChange={() => handleUserTagChange("Admin")} />
                                    <label htmlFor="Admin">Admin</label>
                                  </div>
                                  <div className="radio_single">
                                    <input type="radio" name="prop_user" value="PropManager" id='PropManager'
                                      checked={selectedPropUser.userTag === "Property Manager"} onChange={() => handleUserTagChange("Property Manager")} />
                                    <label htmlFor="PropManager">Property Manager</label>
                                  </div>
                                  <div className="radio_single">
                                    <input type="radio" name="prop_user" value="SalesManager" id='SalesManager'
                                      checked={selectedPropUser.userTag === "Sales Manager"} onChange={() => handleUserTagChange("Sales Manager")} />
                                    <label htmlFor="SalesManager">Sales Manager</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="vg22"></div>
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="cancel_btn" onClick={(e) => handleClosePropUserTags(e, 'cancel', 'propmanager')}  >
                                Cancel
                              </div>
                              <div className="done_btn" onClick={(e) => handleClosePropUserTags(e, 'save', 'propmanager')}>
                                Save Changes
                              </div>
                            </div>
                          </Modal.Body>
                        </Modal>
                      )}
                    </>
                  )}
                {/* propdial managers / user card end  */}

                <div className="property_card_single">
                  <div className="more_detail_card_inner">
                    <h2 className="card_title">About Property</h2>
                    <div className="p_info">
                      <div className="p_info_single">
                        <div className="pd_icon">
                          <img
                            src="/assets/img/property-detail-icon/VisitingDays.png"
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
                                (user.role === "owner" || user.role === "admin") && (
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



          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;