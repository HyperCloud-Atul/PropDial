import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "react-image-gallery/styles/css/image-gallery.css";
import Gallery from "react-image-gallery";
import { projectStorage } from "../../firebase/config";
import Switch from "react-switch";
import imageCompression from "browser-image-compression";
import { ClipLoader, BarLoader } from "react-spinners";
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
import EnquiryAddModal from "../EnquiryAddModal";
import PropertyLayoutComponent from "./PropertyLayoutComponent";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import MakeInactivePopup from "./MakeInactivePopup";
import "./UserList.css";
import AddPropertyUser from "./AddPropertyUser";
import InactiveUserCard from "../InactiveUserCard";

// component
import PropertyImageGallery from "../PropertyImageGallery";
import ScrollToTop from "../ScrollToTop";

import PhoneInput from "react-phone-input-2";
import { firstLetterCapitalize } from "../../utils/lib";
const PropertyDetails = () => {
  // install Swiper modules
  SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

  // get user from useauthcontext
  const { slug } = useParams();

  // Get the last part after the final dash
  const parts = slug?.split("-");
  const propertyid = parts[parts.length - 1]; // 'abc123'
  // console.log("property id: ", propertyid)
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { document: propertyDocument, error: propertyDocError } = useDocument(
    "properties-propdial",
    propertyid
  );
  const { documents: inspections, errors: inspectionsError } = useCollection(
    "inspections",
    ["propertyId", "==", propertyid]
  );
  const { documents: enquiryDocs, error: enquiryDocsError } = useCollection(
    "enquiry-propdial",
    ["propId", "==", propertyid]
  );
  const { documents: layoutDoc, error: layoutDocError } = useCollection(
    "property-layout-propdial",
    ["propertyId", "==", propertyid]
  );

  // get user collection
  const [propertyManagerDoc, setpropertyManagerDoc] = useState(null);
  const [propertyOwnerDoc, setpropertyOwnerDoc] = useState(null);
  const [propertyCoOwnerDoc, setpropertyCoOwnerDoc] = useState(null);
  const [propertyPOCDoc, setpropertyPOCDoc] = useState(null);
  const [propertyOnboardingDateFormatted, setPropertyOnboardingDateFormatted] =
    useState();
  const [propertyUpdateDateFormatted, setPropertyUpdateDateFormatted] =
    useState();

  const { documents: dbUsers, error: dbuserserror } = useCollection(
    "users-propdial",
    ["status", "==", "active"]
  );

  const { documents: onlyOwners, error: onlyOwnersError } = useCollection(
    "users-propdial",
    ["rolePropDial", "==", "owner"]
  );

  const { documents: onlyAdmins, error: onlyAdminsError } = useCollection(
    "users-propdial",
    ["rolePropDial", "==", "admin"]
  );

  const { documents: onlyManagers, error: onlyManagersError } = useCollection(
    "users-propdial",
    ["rolePropDial", "==", "manager"]
  );

  // fetch property owner
  const [isPropertyOwner, setIsPropertyOwner] = useState(false);
  const [propertyUserOwnerData, setPropertyUserOwnerData] = useState(null);

  const [isPropertyManager, setIsPropertyManager] = useState(false);
  const [propertyUserManagerData, setPropertyUserManagerData] = useState(null);

  // Check for Property Owner
  useEffect(() => {
    let unsubscribe;

    if (propertyid && user?.phoneNumber) {
      const query = projectFirestore
        .collection("propertyusers")
        .where("propertyId", "==", propertyid)
        .where("userId", "==", user.phoneNumber)
        .where("userType", "==", "propertyowner");

      unsubscribe = query.onSnapshot(
        (snapshot) => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            setIsPropertyOwner(true);
            setPropertyUserOwnerData({ id: doc.id, ...doc.data() });
          } else {
            setIsPropertyOwner(false);
            setPropertyUserOwnerData(null);
          }
        },
        (error) => {
          console.error("Error fetching property owner doc:", error);
        }
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [propertyid, user]);

  // Check for Property Manager
  useEffect(() => {
    let unsubscribe;

    if (propertyid && user?.phoneNumber) {
      const query = projectFirestore
        .collection("propertyusers")
        .where("propertyId", "==", propertyid)
        .where("userId", "==", user.phoneNumber)
        .where("userType", "==", "propertymanager");

      unsubscribe = query.onSnapshot(
        (snapshot) => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            setIsPropertyManager(true);
            setPropertyUserManagerData({ id: doc.id, ...doc.data() });
          } else {
            setIsPropertyManager(false);
            setPropertyUserManagerData(null);
          }
        },
        (error) => {
          console.error("Error fetching property manager doc:", error);
        }
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [propertyid, user]);

  const {
    documents: users_Executive_Manager,
    error: users_Executive_ManagerError,
  } = useCollection("users-propdial", [
    "rolePropDial",
    "in",
    ["executive", "manager"],
  ]);

  const {
    documents: users_Admin_Executive_Manager,
    error: users_Admin_Executive_ManagerError,
  } = useCollection("users-propdial", [
    "rolePropDial",
    "in",
    ["admin", "executive", "manager"],
  ]);

  const { documents: onlyExecutives, error: onlyExecutivesError } =
    useCollection("users-propdial", ["rolePropDial", "==", "executive"]);

  const { documents: tenantDocument, errors: tenantDocError } = useCollection(
    "tenants",
    ["propertyId", "==", propertyid],
    ["createdAt", "desc"]
  );

  const { documents: propertyLayouts, errors: propertyLayoutsError } =
    useCollection(
      "propertylayouts",
      ["propertyId", "==", propertyid],
      ["createdAt", "desc"]
    );

  const { documents: propertyLayoutsNew, errors: propertyLayoutsNewError } =
    useCollection("property-layout-propdial", ["propertyId", "==", propertyid]);

  const { documents: allPropertyUsers, errors: propertyUsersError } =
    useCollection("propertyusers", ["propertyId", "==", propertyid]);

  const propertyOwners =
    allPropertyUsers &&
    allPropertyUsers.filter((doc) => doc.userType === "propertyowner");

  const propertyManagers =
    allPropertyUsers &&
    allPropertyUsers.filter((doc) => doc.userType === "propertymanager");

  const { documents: propertyDocList, errors: propertyDocListError } =
    useCollection("docs-propdial", ["masterRefId", "==", propertyid]);

  // console.log("propertyDocList: ", propertyDocList && propertyDocList.length);

  const { documents: advDocList, errors: advDocListError } = useCollection(
    "advertisements",
    ["propertyId", "==", propertyid]
  );

  // console.log("advDocList: ", advDocList && advDocList.length);

  const { documents: utilityBillList, errors: utilityBillListError } =
    useCollection("utilityBills-propdial", ["propertyId", "==", propertyid]);

  const { documents: propertyKeysList, errors: propertyKeysListError } =
    useCollection("propertyKeys", ["propertyId", "==", propertyid]);

  const { addDocument: tenantAddDocument, error: tenantAddDocumentError } =
    useFirestore("tenants");

  const {
    addDocument: userAddDocument,
    addDocumentWithCustomDocId: userAddDocumentWithCustomDocId,
    error: userAddDocumentError,
  } = useFirestore("users-propdial");

  const {
    addDocument: addProperyUsersDocument,
    updateDocument: updateProperyUsersDocument,
    deleteDocument: deleteProperyUsersDocument,
    error: errProperyUsersDocument,
  } = useFirestore("propertyusers");
  const {
    addDocument: propertyLayoutAddDocument,
    error: propertyLayoutAddDocumentError,
  } = useFirestore("propertylayouts");
  const {
    updateDocument: updatePropertyLayoutDocument,
    deleteDocument: deletePropertyLayoutDocument,
    error: propertyLayoutDocumentError,
  } = useFirestore("propertylayouts");

  // upload tenant code start
  const [tenantName, setTenantName] = useState("");
  const [editingTenantId, setEditingTenantId] = useState(null);
  const [tenantMobile, setTenantMobile] = useState("");
  const [tenantCountry, setTenantCountry] = useState("");
  const [tenantCountryCode, setTenantCountryCode] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [isTenantEditing, setIsTenantEditing] = useState(false);
  const [selectedTenantImage, setSelectedTenantImage] = useState(null);
  const [previewTenantImage, setPreviewTenantImage] = useState(null);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [tenantExist, setTenantExist] = useState(false);
  const [isTenantDataFetching, setIsTenantDataFetching] = useState(false);
  const [errorTenantForm, setErrorTenantForm] = useState({
    name: "",
    mobile: "",
    email: "",
  });
  // const handleEditTenantToggle = () => {
  //   setIsTenantEditing(!isTenantEditing);
  // };

  const handleNameChange = (e) => {
    setTenantName(e.target.value);
    setErrorTenantForm((prev) => ({ ...prev, name: "" }));
  };

  const handleMobileChange = (value, data) => {
    console.log("value: ", data);
    setTenantMobile(value);
    setTenantCountryCode(data?.dialCode || "");
    setTenantCountry(data?.name || "");
    setErrorTenantForm((prev) => ({ ...prev, mobile: "" }));
  };
  const handleEmailChange = (e) => {
    setTenantEmail(e.target.value);
    setErrorTenantForm((prev) => ({ ...prev, email: "" }));
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
  const [showPropertyLayoutComponent, setShowPropertyLayoutComponent] =
    useState(false);
  const handleShowPropertyLayoutComponent = () => {
    setLayoutId(null);
    setShowPropertyLayoutComponent(true);
  };

  const editPropertyLayout = async (layoutid) => {
    // console.log('layout id: ', layoutid)
    setShowPropertyLayoutComponent(true);
    setLayoutId(layoutid);
  };

  const deletePropertyLayout = async (layoutid) => {
    // console.log('layout id: ', layoutid)
    try {
      await deletePropertyLayoutDocument(layoutid);
      console.log("property layout document deleted successfully");
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
    console.log("item for addAttachment;", item);
    setAttachments([...attachments, item]);
    // setPropertyLayout([...propertyLayout.RoomAttachments, item]);
  };

  // Function to remove an item by value
  var removeAttachment = (item) => {
    console.log("item for removeAttachment;", item);
    setAttachments(attachments.filter((i) => i !== item));
    // setPropertyLayout(propertyLayout.RoomAttachments && propertyLayout.RoomAttachments.filter(i => i !== item));
  };

  const handleAttachmentInputChange = (index, name, value, isChecked) => {
    console.log("isChecked:", isChecked);
    // console.log('index:', index)
    // console.log('value:', value)
    isChecked === true ? addAttachment(name) : removeAttachment(name);
  };

  const fetchExistedUser = async (number) => {
    setIsTenantDataFetching(true);
    const doc = await projectFirestore
      .collection("users-propdial")
      .where("phoneNumber", "==", number);

    const data = await doc.get();
    const userData = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(userData);
    setTenantName(userData[0].fullName);
    setTenantMobile(userData[0].phoneNumber);
    setTenantEmail(userData[0].email);
    setIsTenantDataFetching(false);
  };

  const checkIfPhoneExists = async (value) => {
    const numericPhone = value.replace(/\D/g, ""); // remove all non-digits

    if (numericPhone.length >= 8 && numericPhone.length <= 15) {
      try {
        const doc = await projectFirestore
          .collection("users-propdial")
          .where("phoneNumber", "==", numericPhone)
          .get();

        if (!doc.empty) {
          await fetchExistedUser(numericPhone);
          setTenantExist(true);
        } else {
          setTenantExist(false);
        }
      } catch (error) {
        console.error("Error checking phone:", error);
      }
    } else {
      setErrorTenantForm((prev) => ({
        ...prev,
        agentPhone: "please enter a valid phone number",
      }));
    }
  };

  //validate Form
  const validateTenantForm = () => {
    let newErrors = {};
    if (!tenantName) newErrors.name = "Name is required";

    if (!tenantMobile) newErrors.mobile = "Mobile is required";
    if (!tenantEmail) newErrors.email = "email is required";
    else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantEmail) ||
      tenantEmail.length < 8
    )
      newErrors.email = "Invalid email required";

    setErrorTenantForm(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  //Tenant Information
  const handleAddTenant = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!validateTenantForm()) {
      return;
    }

    const tenantData = {
      propertyId: propertyid,
      name: tenantName,
      mobile: tenantMobile,
      whatsappNumber: "",
      status: "active",
      tenantImgUrl: "",
      onBoardingDate: "",
      offBoardingDate: "",
      idNumber: "",
      address: "",
      emailId: tenantEmail,
      rentStartDate: "",
      rentEndDate: "",
      isCurrentProperty: true,
    };

    const propertyUserData = {
      propertyId: propertyid,
      userId: tenantMobile,
      userTag: "Tenant",
      userType: "propertytenant",
      isCurrentProperty: true,
    };

    console.log("tenantData: ", tenantData);

    if (tenantExist) {
      await Promise.all([
        await tenantAddDocument(tenantData),
        await addProperyUsersDocument(propertyUserData),
      ]);
      if (tenantAddDocumentError) {
        console.log("response error");
      }
    } else {
      const userDetails = {
        online: true,
        whatsappUpdate: false,
        displayName: tenantName.trim().split(" ")[0],
        fullName: tenantName,
        phoneNumber: tenantMobile,
        email: tenantName.toLowerCase().trim(),
        city: "",
        address: "",
        gender: "",
        whoAmI: "tenant",
        country: tenantCountry,
        propertyManagerID: tenantMobile,
        countryCode: tenantCountryCode,
        photoURL: "",
        rolePropDial: "tenant",
        rolesPropDial: ["tenant"],
        accessType: "country",
        accessValue: ["India"],
        status: "active",
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

      await Promise.all([
        await tenantAddDocument(tenantData),
        await userAddDocumentWithCustomDocId(userDetails, tenantMobile),
        await addProperyUsersDocument(propertyUserData),
      ]);
    }

    setTenantName("");
    setTenantMobile("");
    setTenantEmail("");
    setTenantCountryCode("");
    setTenantCountry("");
    setShowAddTenantModal(false);

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

    if (propertyDocument?.updatedAt?.seconds) {
      const propertyUpdateDate = new Date(
        propertyDocument.updatedAt.seconds * 1000
      );
      if (!isNaN(propertyUpdateDate)) {
        setPropertyUpdateDateFormatted(
          format(propertyUpdateDate, "dd MMMM, yyyy")
        );
      }
    }

    // if (propertyDocument) {
    //   const propertyUpdateDate = new Date(
    //     propertyDocument?.updatedAt?.seconds * 1000
    //   );
    //   setPropertyUpdateDateFormatted(
    //     format(propertyUpdateDate, "dd MMMM, yyyy")
    //   );
    // }

    if (propertyDocument && propertyDocument.propertyManager) {
      const propertyManagerRef = projectFirestore
        .collection("users-propdial")
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
        .collection("users-propdial")
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
        .collection("users-propdial")
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
        .collection("users-propdial")
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
  const { updateDocument, response: updateDocumentResponse } = useFirestore(
    "properties-propdial"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(onlyOwners);
  const [selectedUser, setSelectedUser] = useState(null);
  const [changeManagerPopup, setchangeManagerPopup] = useState(false);
  const [userdbFieldName, setUserdbFieldName] = useState();
  const [changedUser, setChangedUser] = useState();
  const [dbUserState, setdbUserState] = useState(onlyOwners);
  const [changeUserRole, setChageUserRole] = useState("owner");

  // const openChangeUser = () => {
  //   console.log("Open Change Manager");
  //   setchangeManagerPopup(true);
  // }
  const openChangeUser = (docId, userRole) => {
    // console.log("Open Change User: ", userRole);
    setchangeManagerPopup(true);
    // setUserdbFieldName(option);
    setFilteredUsers(null);
    setChageUserRole(userRole);
    setChangedUser(docId);
  };

  const closeChangeManager = () => {
    setchangeManagerPopup(false);
  };

  const confirmChangeUser = async () => {
    // console.log("selectedUser", selectedUser);

    const updatedPropertyUser = {
      userId: selectedUser.id,
      userTag: selectedUser.rolePropDial,
    };

    // console.log('updateDocId: ', changedUser)

    await updateProperyUsersDocument(changedUser, updatedPropertyUser);

    const selectedUserRole = selectedUser.rolePropDial;
    if (
      selectedUserRole.toLowerCase() === "executive" ||
      selectedUserRole.toLowerCase() === "manager"
    ) {
      await updateDocument(propertyid, {
        propertyManagerID: selectedUser.phoneNumber,
      });
    }

    setchangeManagerPopup(false);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    console.log("query: ", query);

    setSearchQuery(query);

    if (query !== "") {
      filterUsers(query);
    }
  };

  const filterUsers = (query) => {
    // console.log('query: ', query)
    let filtered = null;

    // console.log("onlyOwners: ", onlyOwners)

    if (
      changeUserRole === "superadmin" ||
      changeUserRole === "admin" ||
      changeUserRole === "owner"
    ) {
      filtered =
        onlyOwners &&
        onlyOwners.filter(
          (ee) =>
            (ee.displayName.toLowerCase().includes(query.toLowerCase()) ||
              ee.phoneNumber.includes(query) ||
              propertyDocument.city
                .toLowerCase()
                .includes(query.toLowerCase())) &&
            ee.propertiesOwnedInCities &&
            propertyDocument &&
            ee.propertiesOwnedInCities.find(
              (e) => e.label === propertyDocument.city
            )
        );
    }

    if (
      changeUserRole === "superadmin" ||
      changeUserRole === "admin" ||
      changeUserRole === "manager" ||
      changeUserRole === "executive"
    ) {
      filtered =
        users_Admin_Executive_Manager &&
        users_Admin_Executive_Manager.filter(
          (user) =>
            user.rolePropDial.toLowerCase().includes(query.toLowerCase()) ||
            user.fullName.toLowerCase().includes(query.toLowerCase()) ||
            user.phoneNumber.includes(query) ||
            user.city.toLowerCase().includes(query.toLowerCase())
        );
    }

    // if (changeUserRole === "admin") {
    //   filtered =
    //     onlyAdmins &&
    //     onlyAdmins.filter(
    //       (user) =>
    //         user.fullName.toLowerCase().includes(query.toLowerCase()) ||
    //         user.phoneNumber.includes(query)
    //     );
    // }

    // if (changeUserRole === "manager") {
    //   filtered =
    //     onlyManagers &&
    //     onlyManagers.filter(
    //       (user) =>
    //         user.fullName.toLowerCase().includes(query.toLowerCase()) ||
    //         user.phoneNumber.includes(query)
    //     );
    // }

    // if (changeUserRole === "executive") {
    //   filtered =
    //     onlyExecutives &&
    //     onlyExecutives.filter(
    //       (user) =>
    //         user.fullName.toLowerCase().includes(query.toLowerCase()) ||
    //         user.phoneNumber.includes(query)
    //     );
    // }
    // console.log("filtered: ", filtered);
    setFilteredUsers(filtered);
  };

  const handleUserSelect = (_user) => {
    setSelectedUser(_user);
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
  // const fileInputRef = useRef(null);
  // const [productImages, setProductImages] = useState([]);
  // const [selectedImage, setSelectedImage] = useState(null);
  // const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  // const [isUploading, setIsUploading] = useState(false);
  // const handleAddMoreImages = () => {
  //   fileInputRef.current.click();
  // };

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedImage(URL.createObjectURL(file));
  //     setIsConfirmVisible(true);
  //   }
  // };

  // const handleConfirmUpload = async () => {
  //   if (selectedImage) {
  //     setIsUploading(true); // Set isUploading to false when upload completes
  //     try {
  //       const file = fileInputRef.current.files[0];
  //       const storageRef = projectStorage.ref(
  //         `properties/${propertyid}/${file.name}`
  //       );
  //       await storageRef.put(file);

  //       const downloadURL = await storageRef.getDownloadURL();
  //       const updatedImages = [...(propertyDocument.images || []), downloadURL];

  //       await projectFirestore
  //         .collection("properties-propdial")
  //         .doc(propertyid)
  //         .update({ images: updatedImages });
  //       setProductImages(updatedImages);

  //       setSelectedImage(null);
  //       setIsConfirmVisible(false);
  //       setIsUploading(false); // Set isUploading to false when upload completes
  //     } catch (error) {
  //       console.error("Error uploading image:", error);
  //     }
  //   }
  // };

  // STATES
  const fileInputRef = useRef(null);
  const [productImages, setProductImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Function to handle file selection
  const handleAddMoreImages = () => {
    fileInputRef.current.click();
  };

  // Function to compress & preview image
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const compressedBlobUrl = URL.createObjectURL(compressedFile);

        setSelectedImage(compressedBlobUrl);
        setSelectedFile(compressedFile);
        setIsConfirmVisible(true);
      } catch (error) {
        console.error("Image compression error:", error);
      }
    }
  };

  // Upload compressed image to Firebase
  const handleConfirmUpload = async () => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        const fileName = `compressed_${Date.now()}_${selectedFile.name}`;
        const storageRef = projectStorage.ref(
          `properties/${propertyid}/${fileName}`
        );
        await storageRef.put(selectedFile);

        const downloadURL = await storageRef.getDownloadURL();
        const updatedImages = [...(propertyDocument.images || []), downloadURL];

        await projectFirestore
          .collection("properties-propdial")
          .doc(propertyid)
          .update({ images: updatedImages });

        setProductImages(updatedImages);

        // Reset state
        setSelectedImage(null);
        setSelectedFile(null);
        setIsConfirmVisible(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Remove selected preview image
  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setIsConfirmVisible(false);
  };

  const images = [
    ...(propertyDocument?.images || []),
    ...(propertyDocument?.layoutImages
      ? Object.values(propertyDocument.layoutImages).flatMap((category) =>
          category.map((img) => img.url)
        )
      : []),
  ];
  // END CODE FOR ADD NEW IMAGES

  //Property Users / Owners - Starts

  const [filteredPropertyOwners, setfilteredPropertyOwners] = useState([]); //initialize array
  const [filteredPropertyManagers, setfilteredPropertyManagers] = useState([]); //initialize array

  useEffect(() => {
    setdbUserState(dbUsers);
    //Property Owners
    // Create a map from the selectedUsers array for quick lookup
    const selectedPropertyOwnersMap =
      propertyOwners &&
      propertyOwners.reduce((map, user) => {
        map[user.userId] = user;
        return map;
      }, {});

    // console.log('selectedUsersMap: ', selectedUsersMap)

    //Now create a list of users from all dbUser List as per the selected users map
    const filteredPropertyOwnerList =
      selectedPropertyOwnersMap &&
      dbUsers &&
      dbUsers
        .filter((user) => selectedPropertyOwnersMap[user.id])
        .map((user) => ({
          ...user,
          ...selectedPropertyOwnersMap[user.id],
        }));

    setfilteredPropertyOwners(filteredPropertyOwnerList);

    //Property Managers
    // Create a map from the selectedUsers array for quick lookup
    const selectedPropertyManagersMap =
      propertyManagers &&
      propertyManagers.reduce((map, user) => {
        map[user.userId] = user;
        return map;
      }, {});

    // console.log('selectedUsersMap: ', selectedUsersMap)

    //Now create a list of users from all dbUser List as per the selected users map
    const filteredPropertyManagerList =
      selectedPropertyManagersMap &&
      dbUsers &&
      dbUsers
        .filter((user) => selectedPropertyManagersMap[user.id])
        .map((user) => ({
          ...user,
          ...selectedPropertyManagersMap[user.id],
        }));

    setfilteredPropertyManagers(filteredPropertyManagerList);

    // console.log(
    //   "filteredProperty manager Users: ",
    //   filteredPropertyManagerList
    // );
  }, [allPropertyUsers, dbUsers]);

  //Add Property Users
  const handleAddPropertyUser = async (e, _usertype) => {
    e.preventDefault(); // Prevent the default form submission behavior

    console.log("user type: ", _usertype);
    // const filtered = dbUsers && dbUsers.filter((user) =>
    //   (user.fullName.toLowerCase().includes(query.toLowerCase()) || (user.phoneNumber.includes(query)))
    // );
    const isAlreadyExist =
      _usertype === "propertyowner"
        ? propertyOwners &&
          propertyOwners.filter(
            (propuser) =>
              propuser.userId === propertyDocument.createdBy &&
              propuser.userType === _usertype
          )
        : propertyManagers &&
          propertyManagers.filter(
            (propuser) =>
              propuser.userId === propertyDocument.createdBy &&
              propuser.userType === _usertype
          );

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
  };

  //Property Users / Owners - Ends

  // START CODE FOR EDIT Property desc by TEXT USING TEXT EDITOR
  const [editedPropDesc, setEditedPropDesc] = useState("");
  const [isPropDescEdit, setIsPropDescEdit] = useState(false);

  const [Propvalue, setPropValue] = useState(
    RichTextEditor.createValueFromString(
      propertyDocument && propertyDocument.propertyDescription + editedPropDesc,
      "html"
    )
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
    RichTextEditor.createValueFromString(
      propertyDocument &&
        propertyDocument.ownerInstructions + editedOwnerInstruction,
      "html"
    )
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

  useEffect(() => {
    if (propertyDocument) {
      setPropValue(
        RichTextEditor.createValueFromString(
          propertyDocument.propertyDescription,
          "html"
        )
      );

      setOwnerInstrucitonValue(
        RichTextEditor.createValueFromString(
          propertyDocument.ownerInstructions,
          "html"
        )
      );
    }
  }, [propertyDocument]);

  // END CODE FOR EDIT TEXT USING TEXT EDITOR

  // code for active or review property start

  // State to handle modal visibility and the option selected (Active/In-Review)
  const [showActiveReviewModal, setShowActiveReviewModal] = useState(false);
  const [selectedAorROption, setSelectedAorROption] = useState(null); // Store selected option (Active/In-Review)
  const [isProcessing, setIsProcessing] = useState(false); // For tracking the processing state

  // Function to show the modal and store the selected option
  const handleShowActiveReviewModal = (option) => {
    setSelectedAorROption(option); // Set the option clicked (Active/In-Review)
    setShowActiveReviewModal(true); // Show modal
  };

  // Function to close the modal
  const handleCloseActiveReviewModal = () => {
    setShowActiveReviewModal(false); // Close modal
    setSelectedAorROption(null); // Reset the option
  };

  // Function to handle confirmation when user clicks "Yes"
  const handleConfirm = async () => {
    if (selectedAorROption) {
      setIsProcessing(true); // Set processing state to true when clicked
      try {
        await handleIsActiveInactiveReview(selectedAorROption); // Pass the selected option (Active/In-Review)
        setShowActiveReviewModal(false); // Close modal after successful update
        setSelectedAorROption(null); // Reset option
      } catch (error) {
        console.error("Error updating property:", error); // Handle error case
      } finally {
        setIsProcessing(false); // Set processing state to false after completion
      }
    }
  };

  const handleIsActiveInactiveReview = async (option) => {
    // e.preventDefault();

    // Base updatedProperty object
    const updatedProperty = {};

    // Check if option is 'Active' or 'In-Review' and add corresponding fields
    if (option === "Active") {
      updatedProperty.isActiveInactiveReview = option;
      updatedProperty.isActiveUpdatedAt = timestamp.fromDate(new Date());
      updatedProperty.isActiveUpdatedBy = user.phoneNumber;
    } else if (option === "In-Review") {
      updatedProperty.isActiveInactiveReview = option;
      updatedProperty.isReviewUpdatedAt = timestamp.fromDate(new Date());
      updatedProperty.isReviewUpdatedBy = user.phoneNumber;
    }

    // Optionally, you can log the updated object for debugging
    console.log("Updated Property:", updatedProperty);

    // Update the document with the updated property data
    await updateDocument(propertyid, updatedProperty);
  };
  // code for active or review property end
  // modal controls start
  // start modal for property layout in detail
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false);

  const handleRoomModalClose = () => setShowRoomModal(false);
  const handleShowRoomModal = (roomKey) => {
    const roomType = roomKey.replace(/\d+/g, "").trim();
    setSelectedRoom({ roomType: roomType });
    setShowRoomModal(true);
  };
  // confirm room delete
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
    setSelectedUserTag(_newtag);
    // console.log('in handleUserTagChange: ', _newtag)
  };

  const handleClosePropUserTags = async (e, _option, _usertype) => {
    // console.log('In handleClosePropUserTags: ', _option)
    // console.log('In handleClosePropUserTags selectedPropUser id: ', selectedPropUser.id)
    if (_option === "save") {
      const updatedTag = {
        userTag: selectedUserTag,
      };

      // console.log('updatedTag: ', updatedTag)
      await updateProperyUsersDocument(selectedPropUser.id, updatedTag);
    }
    //Cancel opion check Not Required
    // if (option === 'cancel') {

    // }
    _usertype === "propowner"
      ? setShowPropOwner(false)
      : setShowPropManager(false);
  };
  const handleShowOwnerTags = (e, _propUser, _usertype) => {
    console.log("In handleShowOwnerTags propUser: ", _propUser);
    setSelectedPropUser(_propUser);

    _usertype === "propowner"
      ? setShowPropOwner(true)
      : setShowPropManager(true);
  };
  const [showConfirmPropUser, setShowConfirmPropUser] = useState(false);

  const handleCloseConfirmPropUser = async (e, _option) => {
    // console.log('_option: ', _option)
    //Delete Prop User if option is 'confirm'
    if (_option === "confirm") {
      await deleteProperyUsersDocument(selectedPropUser.id);
    }

    setShowConfirmPropUser(false);
  };

  const handleDeletePropUser = (e, propUser) => {
    console.log("propUser : ", propUser);
    setSelectedPropUser(propUser);
    setShowConfirmPropUser(true);
  };
  // modal controls end

  // add enquiry with modal and add document start
  const { addDocument } = useFirestore("enquiry-propdial");
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleEnquiryModalClose = () => setShowEnquiryModal(false);
  const handleEnquiryNowClick = (propertyDocument) => {
    setSelectedProperty(propertyDocument);
    setShowEnquiryModal(true);
  };
  // add enquiry with modal and add document end

  //   modal code start for whyinactive property
  const [showWhyInactive, setShowWhyInactive] = useState(false);
  const handleCloseWhyInactive = () => setShowWhyInactive(false);
  const handleShowWhyInactive = () => {
    setShowWhyInactive(true);
  };
  const [selectedReason, setSelectedReason] = useState("");
  const [inactiveRemark, setInactiveRemark] = useState("");
  const handleSelectedReasonChange = (e) => setSelectedReason(e.target.value);
  const handleInactiveRemarkChange = (event) =>
    setInactiveRemark(event.target.value);

  const saveReasonWhyInactive = async (e) => {
    e.preventDefault();
    // Validate the required fields
    if (!selectedReason) {
      alert("Please select a reason for marking the property as inactive.");
      return;
    }

    if (!inactiveRemark) {
      alert("Please provide a remark for marking the property as inactive.");
      return;
    }
    const updatedProperty = {
      isActiveInactiveReview: "Inactive",
      resonForInactiveProperty: selectedReason,
      remarkForInactiveProperty: inactiveRemark,
      isInactiveUpdatedAt: timestamp.fromDate(new Date()),
      isInactiveUpdatedBy: user.phoneNumber,
    };

    // console.log("updatedProperty", updatedProperty);
    // console.log('propertydoc: ', propertydoc)

    await updateDocument(propertyid, updatedProperty);
    setShowWhyInactive(false);
  };

  //   modal code end

  // Fetch all agent documents from the collection
  // const { documents: agentDoc, errors: agentDocError } = useCollection(
  //   "agent-propdial",
  //   "",
  //   ["createdAt", "desc"]
  // );

  // // Check if documents are available and then apply city and locality filters
  // const filteredAgentDocs = agentDoc
  //   ? agentDoc.filter(doc =>
  //       doc.city === propertyDocument.city &&
  //       doc.locality && doc.locality.includes(propertyDocument.locality)

  //     )
  //   : [];
  // // Debugging logs to check the filtered results

  // Inspection click code start
  const [showLayoutAlert, setShowLayoutAlert] = useState(false);

  // const handleInspectionClick = (e) => {
  //   const isMissingPropertyLayout =
  //     !propertyLayoutsNew || propertyLayoutsNew.length === 0;
  //   const isMissingUtilityBill =
  //     !utilityBillList || utilityBillList.length === 0;

  //   if (isMissingPropertyLayout || isMissingUtilityBill) {
  //     e.preventDefault(); // Prevent default redirect behavior
  //     setShowLayoutAlert(true); // Show the modal
  //   }
  // };

  const handleInspectionClick = (e) => {
    const isAuthorized =
      user?.status === "active" &&
      (user?.role === "admin" ||
        user?.role === "superAdmin" ||
        isPropertyManager);

    if (isAuthorized) {
      const isMissingPropertyLayout =
        !propertyLayoutsNew || propertyLayoutsNew.length === 0;
      const isMissingUtilityBill =
        !utilityBillList || utilityBillList.length === 0;

      if (isMissingPropertyLayout || isMissingUtilityBill) {
        e.preventDefault(); // Prevent default redirect behavior
        setShowLayoutAlert(true); // Show the modal
      }
    }
  };

  const closeLayoutAlertModal = () => setShowLayoutAlert(false);
  // Inspection click code end

  // Helper function to generate alert message on inspection click start
  const getAlertMessage = () => {
    const isMissingPropertyLayout =
      !propertyLayoutsNew || propertyLayoutsNew.length === 0;
    const isMissingUtilityBill =
      !utilityBillList || utilityBillList.length === 0;

    if (isMissingPropertyLayout && isMissingUtilityBill) {
      return "To proceed, Please add a Property Layout and Utility Bill.";
    } else if (isMissingPropertyLayout) {
      return "To proceed, Please add a Property Layout.";
    } else if (isMissingUtilityBill) {
      return "To proceed, Please add a Utility Bill.";
    }
    return "";
  };
  // Helper function to generate alert message on inspection click start

  const [isRedirecting, setIsRedirecting] = useState(false);
  const handleAddPropertyLayout = async () => {
    setIsRedirecting(true);
    try {
      const newLayoutRef = await projectFirestore
        .collection("property-layout-propdial")
        .add({
          createdBy: user && user.phoneNumber, // Assuming you have user object
          createdAt: new Date(),
          finalSubmit: false,
          propertyId: propertyid,
        });

      navigate(`/add-property-layout/${newLayoutRef.id}`);
    } catch (error) {
      console.error("Error creating new property layout:", error);
    } finally {
      setIsRedirecting(false);
    }
  };

  // code for add tenant by search start
  const [allUsers, setAllUsers] = useState([]);
  const [tenantFilteredUsers, setTenantFilteredUsers] = useState([]);
  const [tenantSearchQuery, setTenantSearchQuery] = useState("");
  const [tenantSelectedUser, setTenantSelectedUser] = useState(null);
  const [tenantLoading, setTenantLoading] = useState(false);
  const [tenantMode, setTenantMode] = useState("existing"); // or "new"

  // 🔄 Fetch all tenants from 'users-propdial' where role is tenant
  useEffect(() => {
    const fetchTenantUsers = async () => {
      setTenantLoading(true);
      try {
        const snapshot = await projectFirestore
          .collection("users-propdial")
          .where("rolePropDial", "==", "tenant")
          .get();

        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllUsers(users);
        setTenantFilteredUsers(users);
      } catch (err) {
        console.error("Error fetching tenants:", err);
      } finally {
        setTenantLoading(false);
      }
    };

    fetchTenantUsers();
  }, []);

  // 🔎 Search Handler
  const handleTenantSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setTenantSearchQuery(value);

    const filtered = allUsers.filter((user) => {
      const name = user.fullName?.toLowerCase() || "";
      const emailId = user.email?.toLowerCase() || "";
      const mobile = user.id?.toLowerCase() || ""; // doc ID == phoneNumber
      return (
        name.includes(value) ||
        emailId.includes(value) ||
        mobile.includes(value)
      );
    });

    setTenantFilteredUsers(filtered);
  };

  // ✅ Select user from list
  const handleTenantSelectUser = (user) => {
    setTenantSelectedUser(user);
  };

  // ➕ Add to 'tenants' collection
  // const handleAddTenantToCollection = async () => {
  //   if (!tenantSelectedUser) return alert("Please select a user");

  //   try {
  //     await projectFirestore.collection("tenants").add({
  //       address: "",
  //       name: tenantSelectedUser.fullName || "",
  //       emailId: tenantSelectedUser.email || "",
  //       mobile: tenantSelectedUser.id, // Document ID is phone number
  //       status: "active",
  //       propertyId: propertyid, // make sure propertyid is defined in this component
  //       createdAt: timestamp.now(),
  //       createdBy: user?.phoneNumber,
  //       offBoardingDate: "",
  //       onBoardingDate: "",
  //       rentEndDate: "",
  //       rentStartDate: "",
  //       tenantImgUrl: "",
  //       whatsappNumber: "",
  //       idNumber: "",
  //     });

  //     alert("Tenant added successfully!");
  //     setTenantSelectedUser(null);
  //   } catch (error) {
  //     console.error("Error adding tenant:", error);
  //     alert("Failed to add tenant");
  //   }
  // };
  const handleAddTenantToCollection = async () => {
    if (!tenantSelectedUser) return alert("Please select a user");

    try {
      // Add to 'tenants' collection and get the doc reference
      const tenantDocRef = await projectFirestore.collection("tenants").add({
        address: "",
        name: tenantSelectedUser.fullName || "",
        emailId: tenantSelectedUser.email || "",
        mobile: tenantSelectedUser.id, // Document ID is phone number
        status: "active",
        propertyId: propertyid,
        createdAt: timestamp.now(),
        createdBy: user?.phoneNumber,
        offBoardingDate: "",
        onBoardingDate: "",
        rentEndDate: "",
        rentStartDate: "",
        tenantImgUrl: "",
        whatsappNumber: "",
        idNumber: "",
      });

      // Add to 'propertyusers' collection with tenantDocId
      await projectFirestore.collection("propertyusers").add({
        propertyId: propertyid,
        userId: tenantSelectedUser.id,
        tenantDocId: tenantDocRef.id, // capturing tenant document ID here
        createdAt: timestamp.now(),
        createdBy: user?.phoneNumber,
        userTag: "Tenant",
        userType: "propertytenant",
        isCurrentProperty: true,
      });

      alert("Tenant added successfully!");
      setTenantSelectedUser(null);
    } catch (error) {
      console.error("Error adding tenant or propertyuser:", error);
      alert("Failed to add tenant");
    }
  };

  return (
    <>
      <ScrollToTop />
      <Modal show={isRedirecting} centered className="uploading_modal">
        <h6
          style={{
            color: "var(--theme-green2)",
          }}
        >
          Redirecting...
        </h6>
        <BarLoader color="var(--theme-green2)" loading={true} height={10} />
      </Modal>
      {/* Change User Popup - Start */}

      {propertyDocument ? (
        <div div className="pg_property pd_single pg_bg">
          <div className="page_spacing full_card_width relative">
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
                  className="material-symbols-outlined modal_close"
                >
                  close
                </span>
                {changeUserRole === "owner" ? (
                  <h5 className="text_orange text-center">
                    Owner List of {propertyDocument && propertyDocument.city}
                  </h5>
                ) : (
                  <h5 className="text_orange text-center">Change User</h5>
                )}
                <div className="vg12"></div>
                <div>
                  <div className="enq_fields">
                    <div className="form_field st-2">
                      <div className="field_inner">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          // onChange={(e) => handleSearchChange(e, 'admin')}
                          // onChange={() => handleUserSelect(user.id)}
                          placeholder="Search users by mobile no or name..."
                        />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            search
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <ul>
       {filteredUsers && filteredUsers.map((user) => (
         <li key={user.id}>{user.fullName} ({user.phoneNumber.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2-$3')})</li>
       ))}
     </ul> */}

                  {searchQuery !== "" ? (
                    <ul className="search_results">
                      {filteredUsers &&
                        filteredUsers.map((user) => (
                          <li className="search_result_single" key={user.id}>
                            <label>
                              <input
                                name="selectedUser"
                                // type="checkbox"
                                // checked={selectedUsers.includes(user.id)}
                                type="radio"
                                // checked={selectedUser === user.id}
                                checked={selectedUser?.id === user.id}
                                // onChange={() => handleUserSelect(user.id)}
                                onChange={() => handleUserSelect(user)}
                              />
                              <div>
                                <strong>
                                  {user.rolePropDial.toUpperCase()} -{" "}
                                  {user.fullName}{" "}
                                </strong>{" "}
                                (
                                {user.phoneNumber.replace(
                                  /(\d{2})(\d{5})(\d{5})/,
                                  "+$1 $2-$3"
                                )}
                                )<br></br> {user.email}, {user.city},{" "}
                                {user.country}
                              </div>
                            </label>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    ""
                  )}
                </div>
                <div className="vg12"></div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    gap: "15px",
                  }}
                >
                  <button
                    onClick={closeChangeManager}
                    className="theme_btn full_width btn_border no_icon"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmChangeUser}
                    className="theme_btn full_width btn_fill no_icon"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
            {/* Change User Popup - End */}
            {/* 9 dots html start  */}
            {user &&
              user.status === "active" &&
              (user.role === "admin" || user.role === "superAdmin") && (
                <div
                  onClick={openMoreAddOptions}
                  className="property-list-add-property"
                >
                  <span className="material-symbols-outlined">apps</span>
                </div>
              )}
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
                  <span className="material-symbols-outlined">
                    location_city
                  </span>
                </Link>

                <Link to="" className="more-add-options-icons">
                  <h1>Property Document</h1>
                  <span className="material-symbols-outlined">
                    holiday_village
                  </span>
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
            {/* 9 dots html end*/}
            {user &&
              user.status === "active" &&
              (user.role === "admin" ||
                user.role === "superAdmin" ||
                isPropertyManager) && (
                <Link
                  to={`/updateproperty/${propertyid}`}
                  className="property-list-add-property with_9dot"
                >
                  <span className="material-symbols-outlined">edit_square</span>
                </Link>
              )}
            {/* top search bar */}
            {!user && (
              <div className="top_search_bar">
                <Link to="/properties" className="back_btn">
                  <span className="material-symbols-outlined">arrow_back</span>
                  <span>Back</span>
                </Link>
              </div>
            )}

            <div
              className={`top_right_badge ${
                propertyDocument &&
                propertyDocument.isActiveInactiveReview.toLowerCase()
              }`}
            >
              {propertyDocument && propertyDocument.category}
            </div>
            <div className="property_cards">
              {propertyDocument && (
                <div className="">
                  {user &&
                    user.status === "active" &&
                    (user.role === "admin" || user.role === "superAdmin") && (
                      // <div className="property_card_single quick_detail_show mobile_full_card">
                      //   <div className="more_detail_card_inner">
                      //     <div className="row align-items-center">
                      //       <div className="col-6 col-md-9">
                      //         <div className="left">
                      //           <div className="qd_single">
                      //             <span className="material-symbols-outlined">
                      //               home
                      //             </span>
                      //             <h6>
                      //               {propertyDocument.category}-{" "}
                      //               {propertyDocument.bhk}
                      //             </h6>
                      //           </div>
                      //         </div>
                      //       </div>
                      //       <div className="col-6 col-md-3">
                      //         <div className="right">
                      //           <div className="premium text-center">
                      //             <img src="/assets/img/premium_img.jpg" alt="propdial" />
                      //             <h6>PMS Premium - PMS After Rent</h6>
                      //             <h5>On Boarding 2nd Jan'22</h5>
                      //           </div>
                      //         </div>
                      //       </div>
                      //     </div>
                      //   </div>
                      // </div>
                      <div className="property_card_single mobile_full_card overflow_unset">
                        <div className="more_detail_card_inner">
                          {/* <h2 className="card_title">About Property</h2> */}
                          <div className="p_info">
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/VisitingDays.png"
                                  alt="propdial"
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Property Added At</h6>
                                <h5>
                                  {propertyDocument &&
                                    propertyOnboardingDateFormatted}
                                </h5>
                                {/* <h5>{propertyDocument && new Date(propertyDocument.onboardingDate.seconds * 1000)}</h5> */}
                              </div>
                            </div>
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/user.png"
                                  alt="propdial"
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Property Added By</h6>
                                <h5>
                                  {dbUserState &&
                                    dbUserState.find(
                                      (user) =>
                                        user.id === propertyDocument.createdBy
                                    )?.fullName}
                                </h5>
                                {/* <h5>{propertyDocument && new Date(propertyDocument.onboardingDate.seconds * 1000)}</h5> */}
                              </div>
                            </div>

                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/package.png"
                                  alt="propdial"
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
                                  alt="propdial"
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Property Flag</h6>
                                <h5>
                                  {propertyDocument && propertyDocument.flag}
                                </h5>
                              </div>
                            </div>
                            {/* <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/property_source.png"
                                  alt="propdial"
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Property Source</h6>

                                <h5>
                                  {propertyDocument && propertyDocument.source}
                                </h5>
                              </div>
                            </div> */}
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/ownership.png"
                                  alt="propdial"
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Ownership</h6>
                                {propertyDocument && (
                                  <h5>
                                    {propertyDocument.ownership ||
                                      "Yet to be added"}
                                  </h5>
                                )}
                              </div>
                            </div>
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/VisitingDays.png"
                                  alt="propdial"
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Last Updated At</h6>
                                <h5>
                                  {propertyDocument &&
                                    propertyDocument.updatedAt &&
                                    propertyUpdateDateFormatted}
                                </h5>
                                {/* <h5>{propertyDocument && new Date(propertyDocument.onboardingDate.seconds * 1000)}</h5> */}
                              </div>
                            </div>
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/user.png"
                                  alt="propdial"
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Last Updated By</h6>
                                <h5>
                                  {dbUserState &&
                                    dbUserState.find(
                                      (user) =>
                                        user.id === propertyDocument.updatedBy
                                    )?.fullName}
                                </h5>
                                {/* <h5>{propertyDocument && new Date(propertyDocument.onboardingDate.seconds * 1000)}</h5> */}
                              </div>
                            </div>
                            {user &&
                              user.status === "active" &&
                              (user.role === "admin" ||
                                user.role === "superAdmin") &&
                              propertyDocument && (
                                <div className="form_field st-2 outline">
                                  <div className="radio_group air">
                                    <div className="radio_group_single">
                                      <div
                                        className={
                                          propertyDocument.isActiveInactiveReview ===
                                          "In-Review"
                                            ? "custom_radio_button radiochecked"
                                            : "custom_radio_button"
                                        }
                                      >
                                        <input
                                          type="checkbox"
                                          id={
                                            "toggleFlag_inreview" + propertyid
                                          }
                                          // onClick={(e) =>
                                          //   handleIsActiveInactiveReview(
                                          //     e,
                                          //     "In-Review"
                                          //   )
                                          // }
                                          onClick={() =>
                                            handleShowActiveReviewModal(
                                              "In-Review"
                                            )
                                          } // Show modal on click
                                        />
                                        <label
                                          htmlFor={
                                            "toggleFlag_inreview" + propertyid
                                          }
                                          className="pointer"
                                          s
                                        >
                                          <div className="radio_icon">
                                            <span className="material-symbols-outlined add">
                                              add
                                            </span>
                                            <span className="material-symbols-outlined check">
                                              done
                                            </span>
                                          </div>

                                          <div className="d-flex justify-content-between w-100 align-items-center">
                                            <div>
                                              {propertyDocument.isActiveInactiveReview ===
                                              "In-Review"
                                                ? "In-Review"
                                                : "Make In-Review"}
                                            </div>
                                            <div>
                                              {propertyDocument.isActiveInactiveReview ===
                                                "In-Review" &&
                                                propertyDocument.isReviewUpdatedAt && (
                                                  <div>
                                                    <div className="info_icon">
                                                      <span className="material-symbols-outlined">
                                                        info
                                                      </span>
                                                      <div className="info_icon_inner">
                                                        <b className="text_blue">
                                                          In-Review
                                                        </b>{" "}
                                                        by{" "}
                                                        <b>
                                                          {dbUserState &&
                                                            dbUserState.find(
                                                              (user) =>
                                                                user.id ===
                                                                propertyDocument.isReviewUpdatedBy
                                                            )?.fullName}
                                                        </b>{" "}
                                                        on,{" "}
                                                        <b>
                                                          {format(
                                                            propertyDocument.isReviewUpdatedAt.toDate(),
                                                            "dd-MMM-yy hh:mm a"
                                                          )}
                                                        </b>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="radio_group_single">
                                      <div
                                        className={
                                          propertyDocument.isActiveInactiveReview ===
                                          "Active"
                                            ? "custom_radio_button radiochecked"
                                            : "custom_radio_button"
                                        }
                                      >
                                        <input
                                          type="checkbox"
                                          id={"toggleFlag_active" + propertyid}
                                          // onClick={(e) =>
                                          //   handleIsActiveInactiveReview(e, "Active")
                                          // }
                                          onClick={() =>
                                            handleShowActiveReviewModal(
                                              "Active"
                                            )
                                          } // Show modal on click
                                        />
                                        <label
                                          htmlFor={
                                            "toggleFlag_active" + propertyid
                                          }
                                          style={{
                                            background:
                                              propertyDocument.isActiveInactiveReview ===
                                                "Active" &&
                                              "var(--success-color)",
                                          }}
                                          className="pointer"
                                        >
                                          <div className="radio_icon">
                                            <span className="material-symbols-outlined add">
                                              add
                                            </span>
                                            <span className="material-symbols-outlined check">
                                              done
                                            </span>
                                          </div>
                                          <div className="d-flex justify-content-between w-100 align-items-center">
                                            <div>
                                              {propertyDocument.isActiveInactiveReview ===
                                              "Active"
                                                ? "Active"
                                                : "Make Active"}
                                            </div>
                                            <div>
                                              {propertyDocument.isActiveInactiveReview ===
                                                "Active" &&
                                                propertyDocument.isActiveUpdatedAt && (
                                                  <div>
                                                    <div className="info_icon">
                                                      <span className="material-symbols-outlined">
                                                        info
                                                      </span>
                                                      <div className="info_icon_inner">
                                                        <b className="text_green2">
                                                          Active
                                                        </b>{" "}
                                                        by{" "}
                                                        <b>
                                                          {/* {activeUser ? activeUser.fullName : "Unknown"} */}
                                                          {dbUserState &&
                                                            dbUserState.find(
                                                              (user) =>
                                                                user.id ===
                                                                propertyDocument.isActiveUpdatedBy
                                                            )?.fullName}
                                                        </b>{" "}
                                                        on{" "}
                                                        <b>
                                                          {format(
                                                            propertyDocument.isActiveUpdatedAt.toDate(),
                                                            "dd-MMM-yy hh:mm a"
                                                          )}
                                                        </b>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    </div>
                                    {/* Modal for confirmation */}
                                    <Modal
                                      show={showActiveReviewModal}
                                      onHide={handleCloseActiveReviewModal}
                                      centered
                                    >
                                      <Modal.Header
                                        className="justify-content-center"
                                        style={{
                                          paddingBottom: "0px",
                                          border: "none",
                                        }}
                                      >
                                        <h5>Confirmation</h5>
                                      </Modal.Header>
                                      <Modal.Body
                                        className="text-center"
                                        style={{
                                          color: "#303030",
                                          fontSize: "20px",
                                          border: "none",
                                        }}
                                      >
                                        Are you sure you want to{" "}
                                        <span
                                          style={{
                                            color:
                                              selectedAorROption === "Active"
                                                ? "var(--theme-green2)"
                                                : selectedAorROption ===
                                                  "In-Review"
                                                ? "var(--theme-blue)"
                                                : "inherit",
                                          }}
                                        >
                                          Make This {selectedAorROption}?
                                        </span>
                                      </Modal.Body>
                                      <Modal.Footer
                                        className="d-grid"
                                        style={{
                                          border: "none",
                                          gap: "15px",
                                          gridTemplateColumns: "repeat(2,1fr)",
                                        }}
                                      >
                                        <div
                                          className="theme_btn btn_border no_icon text-center"
                                          onClick={handleCloseActiveReviewModal}
                                        >
                                          No
                                        </div>
                                        <div
                                          className={`theme_btn btn_fill no_icon text-center ${
                                            isProcessing && "disabled"
                                          }`}
                                          onClick={
                                            !isProcessing ? handleConfirm : null
                                          } // Disable click when processing
                                        >
                                          {isProcessing
                                            ? "Processing..."
                                            : "Yes"}
                                        </div>
                                      </Modal.Footer>
                                    </Modal>
                                    <div className="radio_group_single">
                                      <div
                                        className={
                                          propertyDocument.isActiveInactiveReview ===
                                          "Inactive"
                                            ? "custom_radio_button radiochecked"
                                            : "custom_radio_button"
                                        }
                                      >
                                        <input
                                          type="checkbox"
                                          id={
                                            "toggleFlag_inactive" + propertyid
                                          }
                                          onClick={
                                            propertyDocument.isActiveInactiveReview ===
                                            "Inactive"
                                              ? null // Disable onClick if already inactive
                                              : handleShowWhyInactive
                                          }
                                        />
                                        <label
                                          htmlFor={
                                            "toggleFlag_inactive" + propertyid
                                          }
                                          // style={{ paddingTop: "7px" }}
                                          style={{
                                            background:
                                              propertyDocument.isActiveInactiveReview ===
                                                "Inactive" &&
                                              "var(--theme-red)",
                                          }}
                                          className="pointer"
                                        >
                                          <div className="radio_icon">
                                            <span className="material-symbols-outlined add">
                                              add
                                            </span>
                                            <span className="material-symbols-outlined check">
                                              done
                                            </span>
                                          </div>
                                          <div className="d-flex justify-content-between w-100 align-items-center">
                                            <div>
                                              {propertyDocument.isActiveInactiveReview ===
                                              "Inactive"
                                                ? "Inactive"
                                                : "Make Inactive"}
                                            </div>
                                            <div>
                                              {propertyDocument.isActiveInactiveReview ===
                                                "Inactive" &&
                                                propertyDocument.isInactiveUpdatedAt && (
                                                  <div>
                                                    <div className="info_icon">
                                                      <span className="material-symbols-outlined">
                                                        info
                                                      </span>
                                                      <div className="info_icon_inner">
                                                        <b className="text_red">
                                                          Inactive
                                                        </b>{" "}
                                                        by{" "}
                                                        <b>
                                                          {dbUserState &&
                                                            dbUserState.find(
                                                              (user) =>
                                                                user.id ===
                                                                propertyDocument.isInactiveUpdatedBy
                                                            )?.fullName}
                                                        </b>{" "}
                                                        on,{" "}
                                                        <b>
                                                          {format(
                                                            propertyDocument.isInactiveUpdatedAt.toDate(),
                                                            "dd-MMM-yy hh:mm a"
                                                          )}
                                                        </b>
                                                        , reason{" "}
                                                        <b>
                                                          {
                                                            propertyDocument.resonForInactiveProperty
                                                          }
                                                        </b>{" "}
                                                        <br />
                                                        <div className="mt-1">
                                                          "
                                                          {
                                                            propertyDocument.remarkForInactiveProperty
                                                          }
                                                          "
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            <MakeInactivePopup
                              show={showWhyInactive}
                              handleClose={handleCloseWhyInactive}
                              handleSelectedReasonChange={
                                handleSelectedReasonChange
                              }
                              inactiveRemark={inactiveRemark}
                              handleInactiveRemarkChange={
                                handleInactiveRemarkChange
                              }
                              handleSaveChanges={saveReasonWhyInactive}
                            />
                            {/* <div className="p_info_single">
                     <div className="pd_icon">
                       <img src="/assets/img/property-detail-icon/Purpose.png" alt="propdial" />
                     </div>
                     <div className="pis_content">
                       <h6>Purpose</h6>
                       <h5>Rent</h5>
                     </div>
                   </div> */}
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="property_card_single mobile_full_card">
                    <div className="pcs_inner pointer" to="/pdsingle">
                      <div className="pcs_image_area relative">
                        {images.length > 0 ? (
                          <div className="bigimage_container relative">
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
                            <Link
                              className="property_image"
                              to={`/property-images/${propertyid}`}
                            >
                              {images.filter((url) => url)[0] && (
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-block",
                                  }}
                                  className="property_image_inner"
                                >
                                  {/* <img
        src={images.filter((url) => url)[0]}
        alt="First"
        style={{ width: "100%", height: "100%", borderRadius: "8px" }}
      /> */}
                                  <span className="number">
                                    {images.filter((url) => url).length >= 100
                                      ? "+99"
                                      : images.filter((url) => url).length}
                                    <h6>Photos</h6>
                                    <div>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20px"
                                        viewBox="0 -960 960 960"
                                        width="20px"
                                        fill="#FFFFFF"
                                      >
                                        <path d="M630-444H192v-72h438L429-717l51-51 288 288-288 288-51-51 201-201Z" />
                                      </svg>
                                    </div>
                                  </span>
                                </div>
                              )}
                            </Link>
                          </div>
                        ) : (
                          <img
                            className="default_prop_img"
                            src={
                              propertyDocument.category === "Plot"
                                ? "/assets/img/plot.jpg"
                                : propertyDocument.category === "Commercial"
                                ? "/assets/img/commercial.jpg"
                                : "/assets/img/admin_banner.jpg"
                            }
                            alt="Default"
                          />
                        )}

                        {/* {user &&
                          user.status === "active" &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") && (
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
                              {!isUploading && (
                                <button
                                  className="theme_btn btn_fill no_icon"
                                  onClick={handleAddMoreImages}
                                >
                                  {isConfirmVisible
                                    ? "Replace Image"
                                    : "Add More Images"}
                                </button>
                              )}

                              {selectedImage && (
                                <img
                                  src={selectedImage}
                                  alt="Selected img"
                                  style={{
                                    maxWidth: "100px",
                                    maxHeight: "100px",
                                    borderRadius: "10px",
                                  }}
                                />
                              )}
                              {selectedImage && (
                                <button
                                  className="theme_btn btn_fill no_icon"
                                  onClick={handleConfirmUpload}
                                  disabled={!isConfirmVisible || isUploading} // Disable button when uploading
                                >
                                  {isUploading ? "Uploading..." : "Confirm"}
                                </button>
                              )}
                            </div>
                          )} */}
                        {user &&
                          user.status === "active" &&
                          (user.role === "admin" ||
                            user.role === "superAdmin") && (
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

                              {!isUploading && (
                                <button
                                  className="theme_btn btn_fill no_icon"
                                  onClick={handleAddMoreImages}
                                >
                                  {isConfirmVisible
                                    ? "Replace Image"
                                    : "Add More Images"}
                                </button>
                              )}

                              {selectedImage && (
                                <>
                                  <img
                                    src={selectedImage}
                                    alt="Selected img"
                                    style={{
                                      maxWidth: "100px",
                                      maxHeight: "100px",
                                      borderRadius: "10px",
                                    }}
                                  />
                                  <button
                                    className="theme_btn btn_fill no_icon"
                                    onClick={handleConfirmUpload}
                                    disabled={!isConfirmVisible || isUploading}
                                  >
                                    {isUploading ? "Uploading..." : "Confirm"}
                                  </button>
                                  <button
                                    className="theme_btn btn_outline no_icon"
                                    onClick={handleRemoveSelectedImage}
                                    disabled={isUploading}
                                  >
                                    Remove
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                      </div>
                      <div className="pcs_main_detail">
                        <div className="pmd_top">
                          <h4 className="padd_right">
                            {user &&
                              user.status === "active" &&
                              (user.role === "superAdmin" ||
                                user.role === "admin" ||
                                isPropertyOwner ||
                                isPropertyManager) && (
                                <>{propertyDocument.unitNumber}, </>
                              )}
                            {propertyDocument.society}
                          </h4>

                          {/* <h6>
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
                 </h6> */}
                          <h4 className="property_name">
                            {propertyDocument &&
                              (propertyDocument.category === "Residential" ? (
                                <>
                                  {propertyDocument.bhk}{" "}
                                  {propertyDocument.furnishing && "|"}{" "}
                                  {propertyDocument.furnishing &&
                                    `${propertyDocument.furnishing}`}{" "}
                                  {propertyDocument.purpose && " | "}
                                  For{" "}
                                  {propertyDocument.purpose.toLowerCase() ===
                                  "rentsaleboth"
                                    ? "Rent / Sale"
                                    : propertyDocument.purpose}
                                </>
                              ) : propertyDocument.category === "Commercial" ? (
                                <>
                                  Your perfect {propertyDocument.propertyType}{" "}
                                  awaits—on{" "}
                                  {propertyDocument.purpose.toLowerCase() ===
                                  "rentsaleboth"
                                    ? "Rent / Lease Now"
                                    : propertyDocument.purpose.toLowerCase() ===
                                      "rent"
                                    ? "Lease Now"
                                    : propertyDocument.purpose.toLowerCase() ===
                                      "sale"
                                    ? "Sale Now"
                                    : ""}
                                </>
                              ) : propertyDocument.category === "Plot" ? (
                                <>
                                  {propertyDocument.propertyType} Plot | For{" "}
                                  {propertyDocument.purpose.toLowerCase() ===
                                  "rentsaleboth"
                                    ? "Rent / Lease"
                                    : propertyDocument.purpose.toLowerCase() ===
                                      "rent"
                                    ? "Lease"
                                    : propertyDocument.purpose.toLowerCase() ===
                                      "sale"
                                    ? "Sale"
                                    : ""}
                                </>
                              ) : null)}
                          </h4>
                          <h6 className="property_location">
                            {propertyDocument.locality}, {propertyDocument.city}
                            , {propertyDocument.state}
                          </h6>
                          <div className="badge_and_icons">
                            <span className="pid_badge">
                              PID: {" " + propertyDocument.pid}
                            </span>
                            <div className="action_icons">
                              <div
                                className="icon_single"
                                onClick={handleShareClick}
                              >
                                <img
                                  src="/assets/img/icons/sharearrow.png"
                                  alt="propdial"
                                />
                              </div>

                              <div
                                className="icon_single"
                                onClick={() =>
                                  handleEnquiryNowClick(propertyDocument)
                                }
                              >
                                <img
                                  src="/assets/img/icons/support.png"
                                  alt="propdial"
                                />
                              </div>

                              {propertyDocument &&
                                propertyDocument.propertyVideoYouTubeLink && (
                                  <Link
                                    to={
                                      propertyDocument &&
                                      propertyDocument.propertyVideoYouTubeLink
                                    }
                                    className="google_map icon_single"
                                  >
                                    <img
                                      src="/assets/img/icons/youtube.png"
                                      alt="propdial"
                                    />
                                  </Link>
                                )}
                              {propertyDocument &&
                                propertyDocument.propertyGoogleMap && (
                                  <Link
                                    to={
                                      propertyDocument &&
                                      propertyDocument.propertyGoogleMap
                                    }
                                    className="google_map icon_single"
                                  >
                                    <img
                                      src="/assets/img/icons/mappin.png"
                                      alt="propdial"
                                    />
                                  </Link>
                                )}
                            </div>
                          </div>
                        </div>
                        <div className="divider"></div>
                        <div className="pmd_section2">
                          <div className="pdms_single">
                            <h4>
                              <span className="currency">₹</span>
                              {propertyDocument.flag.toLowerCase() ===
                                "pms only" ||
                              propertyDocument.flag.toLowerCase() ===
                                "available for rent" ||
                              propertyDocument.flag.toLowerCase() ===
                                "rented out"
                                ? new Intl.NumberFormat("en-IN").format(
                                    propertyDocument.demandPriceRent
                                  )
                                : propertyDocument.flag.toLowerCase() ===
                                    "rent and sale" ||
                                  propertyDocument.flag.toLowerCase() ===
                                    "rented but sale"
                                ? new Intl.NumberFormat("en-IN").format(
                                    propertyDocument.demandPriceRent
                                  ) +
                                  " / ₹" +
                                  new Intl.NumberFormat("en-IN").format(
                                    propertyDocument.demandPriceSale
                                  )
                                : new Intl.NumberFormat("en-IN").format(
                                    propertyDocument.demandPriceSale
                                  )}

                              {/* 
                     {new Intl.NumberFormat("en-IN").format(
                       propertyDocument.demandPrice
                     )} */}

                              <span className="price"></span>
                            </h4>
                            <h6>
                              {propertyDocument.flag.toLowerCase() ===
                                "pms only" ||
                              propertyDocument.flag.toLowerCase() ===
                                "available for rent" ||
                              propertyDocument.flag.toLowerCase() ===
                                "rented out"
                                ? "Demand Price"
                                : propertyDocument.flag.toLowerCase() ===
                                    "rent and sale" ||
                                  propertyDocument.flag.toLowerCase() ===
                                    "rented but sale"
                                ? "Demand Rent / Sale"
                                : "Demand Price"}
                            </h6>
                          </div>
                          {propertyDocument &&
                            (propertyDocument.purpose.toLowerCase() ===
                              "rent" ||
                              propertyDocument.purpose.toLowerCase() ===
                                "rentsaleboth") &&
                            (propertyDocument.maintenanceFlag.toLowerCase() ===
                            "included" ? (
                              <div className="pdms_single">
                                <h4>Included</h4>
                                <h6>Maintenance</h6>
                              </div>
                            ) : (
                              <div className="pdms_single">
                                <h4>
                                  <span className="currency">₹</span>
                                  {new Intl.NumberFormat("en-IN").format(
                                    propertyDocument.maintenanceCharges
                                  )}
                                  /-{" "}
                                  <span className="extra">
                                    ({propertyDocument.maintenanceFlag})
                                  </span>
                                </h4>
                                <h6>
                                  Maintenance (
                                  {propertyDocument.maintenanceChargesFrequency}
                                  )
                                </h6>
                              </div>
                            ))}
                          {propertyDocument &&
                            (propertyDocument.purpose.toLowerCase() ===
                              "rent" ||
                              propertyDocument.purpose.toLowerCase() ===
                                "rentsaleboth") && (
                              <div className="pdms_single">
                                <h4>
                                  <span className="currency">₹</span>
                                  {new Intl.NumberFormat("en-IN").format(
                                    propertyDocument.securityDeposit
                                  )}
                                  /-
                                </h4>
                                <h6>Security Deposit</h6>
                              </div>
                            )}
                        </div>
                        <div className="divider"></div>
                        <div className="pmd_section2 pmd_section3">
                          <div className="pdms_single">
                            <h4>
                              <img
                                src="/assets/img/superarea.png"
                                alt="propdial"
                              />
                              {propertyDocument.category === "Residential" ? (
                                <>
                                  {propertyDocument.superArea}
                                  {propertyDocument.superArea &&
                                  propertyDocument.carpetArea &&
                                  propertyDocument.carpetArea !== "0"
                                    ? "/"
                                    : ""}
                                  {propertyDocument.carpetArea}
                                  {!(
                                    propertyDocument.superArea ||
                                    propertyDocument.carpetArea
                                  ) && "Yet to be added"}
                                  <h6
                                    style={{
                                      marginLeft: "3px",
                                    }}
                                  >
                                    {propertyDocument.superAreaUnit}
                                  </h6>
                                </>
                              ) : propertyDocument.category === "Commercial" ||
                                propertyDocument.category === "Plot" ? (
                                <>
                                  {propertyDocument.superArea ||
                                    "Yet to be added"}
                                  <h6
                                    style={{
                                      marginLeft: "3px",
                                    }}
                                  >
                                    {propertyDocument.superAreaUnit || ""}
                                  </h6>
                                </>
                              ) : null}
                            </h4>

                            <h6>
                              {propertyDocument.category === "Residential" ? (
                                <>
                                  {propertyDocument.superArea && "Super Area"}
                                  {propertyDocument.superArea &&
                                  propertyDocument.carpetArea &&
                                  propertyDocument.carpetArea !== "0"
                                    ? " / "
                                    : ""}
                                  {propertyDocument.carpetArea &&
                                    propertyDocument.carpetArea !== "0" &&
                                    "Carpet Area"}
                                  {!propertyDocument.superArea &&
                                    !propertyDocument.carpetArea &&
                                    "Area"}
                                </>
                              ) : propertyDocument.category === "Commercial" ? (
                                "Super Area"
                              ) : propertyDocument.category === "Plot" ? (
                                "Area"
                              ) : null}
                            </h6>
                          </div>
                          <div className="pdms_single">
                            <h4>
                              <img
                                src={
                                  propertyDocument.category === "Residential"
                                    ? "/assets/img/new_bedroom.png"
                                    : propertyDocument.category === "Commercial"
                                    ? "/assets/img/new_carpet.png"
                                    : propertyDocument.category === "Plot"
                                    ? "/assets/img/park.png"
                                    : "/assets/img/default.png"
                                }
                              ></img>
                              {propertyDocument.category === "Residential" ? (
                                propertyDocument.numberOfBedrooms === 0 ||
                                propertyDocument.numberOfBedrooms === "0" ? (
                                  "Yet to be added"
                                ) : (
                                  propertyDocument.numberOfBedrooms
                                )
                              ) : propertyDocument.category === "Commercial" ? (
                                propertyDocument.carpetArea ? (
                                  <>
                                    {propertyDocument.carpetArea}{" "}
                                    <h6
                                      style={{
                                        marginLeft: "3px",
                                      }}
                                    >
                                      {propertyDocument.superAreaUnit || ""}
                                    </h6>
                                  </>
                                ) : (
                                  "Yet to be added"
                                )
                              ) : propertyDocument.category === "Plot" ? (
                                propertyDocument.isParkFacingPlot ? (
                                  propertyDocument.isParkFacingPlot
                                ) : (
                                  "Yet to be added"
                                )
                              ) : null}
                            </h4>
                            <h6>
                              {propertyDocument.category === "Residential"
                                ? "Bedroom"
                                : propertyDocument.category === "Commercial"
                                ? "Carpet Area"
                                : propertyDocument.category === "Plot"
                                ? "Park Facing"
                                : ""}
                            </h6>
                          </div>

                          <div className="pdms_single">
                            <h4>
                              <img
                                src={
                                  propertyDocument.category === "Residential"
                                    ? "/assets/img/new_bathroom.png"
                                    : propertyDocument.category === "Commercial"
                                    ? "/assets/img/directions.png"
                                    : propertyDocument.category === "Plot"
                                    ? "/assets/img/directions.png"
                                    : "/assets/img/default.png"
                                }
                              ></img>
                              {propertyDocument.category === "Residential"
                                ? propertyDocument.numberOfBathrooms === 0 ||
                                  propertyDocument.numberOfBathrooms === "0"
                                  ? "Yet to be added"
                                  : propertyDocument.numberOfBathrooms
                                : propertyDocument.category === "Commercial" ||
                                  propertyDocument.category === "Plot"
                                ? propertyDocument.mainDoorFacing ||
                                  "Yet to be added"
                                : null}
                            </h4>
                            <h6>
                              {propertyDocument.category === "Residential"
                                ? "Bathroom"
                                : propertyDocument.category === "Commercial" ||
                                  propertyDocument.category === "Plot"
                                ? "Direction Facing"
                                : ""}
                            </h6>
                          </div>
                        </div>
                        <div className="divider"></div>
                        <div className="pmd_section2 pmd_section3">
                          <div className="pdms_single">
                            <h4>
                              <img
                                src={
                                  propertyDocument.category === "Residential"
                                    ? "/assets/img/floor.png"
                                    : propertyDocument.category === "Commercial"
                                    ? "/assets/img/propertytype.png"
                                    : propertyDocument.category === "Plot"
                                    ? "/assets/img/corner.png"
                                    : "/assets/img/default.png"
                                }
                              ></img>
                              {propertyDocument.category === "Residential"
                                ? propertyDocument.floorNo
                                  ? propertyDocument.floorNo === "Ground"
                                    ? "Ground"
                                    : propertyDocument.floorNo === "Stilt"
                                    ? "Stilt"
                                    : propertyDocument.floorNo === "Basement"
                                    ? "Basement"
                                    : `${propertyDocument.floorNo}${
                                        propertyDocument.numberOfFloors
                                          ? " of " +
                                            propertyDocument.numberOfFloors
                                          : ""
                                      }`
                                  : ""
                                : propertyDocument.category === "Commercial"
                                ? propertyDocument.propertyType ||
                                  "Yet to be added"
                                : propertyDocument.category === "Plot"
                                ? propertyDocument.isCornerSidePlot ||
                                  "Yet to be added"
                                : ""}
                            </h4>
                            <h6>
                              {propertyDocument.category === "Residential"
                                ? propertyDocument.floorNo
                                  ? ["Ground", "Stilt", "Basement"].includes(
                                      propertyDocument.floorNo
                                    )
                                    ? "Floor"
                                    : "Floor no"
                                  : ""
                                : propertyDocument.category === "Commercial"
                                ? "Property Type"
                                : propertyDocument.category === "Plot"
                                ? "Is Corner?"
                                : ""}
                            </h6>
                          </div>
                          <div className="pdms_single">
                            <h4>
                              <img
                                src={
                                  propertyDocument.category === "Residential"
                                    ? "/assets/img/new_bhk.png"
                                    : propertyDocument.category === "Commercial"
                                    ? "/assets/img/propertysubtype.png"
                                    : propertyDocument.category === "Plot"
                                    ? "/assets/img/gatedcomunity.png"
                                    : "/assets/img/default.png"
                                }
                                alt="bhk icon"
                              />
                              {propertyDocument.category === "Residential"
                                ? propertyDocument.bhk || "Yet to be added"
                                : propertyDocument.category === "Commercial"
                                ? propertyDocument.additionalRooms &&
                                  propertyDocument.additionalRooms.length > 0
                                  ? propertyDocument.additionalRooms[0]
                                  : "Yet to be added"
                                : propertyDocument.category === "Plot"
                                ? propertyDocument.gatedArea ||
                                  "Yet to be added"
                                : ""}
                            </h4>
                            <h6>
                              {propertyDocument.category === "Residential"
                                ? "BHK"
                                : propertyDocument.category === "Commercial"
                                ? "Property Sub-Type"
                                : propertyDocument.category === "Plot"
                                ? "Gated Community"
                                : ""}
                            </h6>
                          </div>

                          <div className="pdms_single">
                            <h4>
                              <img
                                src={
                                  propertyDocument.category === "Residential"
                                    ? "/assets/img/new_furniture.png"
                                    : propertyDocument.category === "Commercial"
                                    ? "/assets/img/new_furniture.png"
                                    : propertyDocument.category === "Plot"
                                    ? "/assets/img/road.png"
                                    : "/assets/img/default.png"
                                }
                                alt="furnishing icon"
                              />
                              {propertyDocument.category === "Residential" ||
                              propertyDocument.category === "Commercial" ? (
                                propertyDocument.furnishing?.toLowerCase() ===
                                "raw" ? (
                                  "Unfurnished"
                                ) : (
                                  propertyDocument.furnishing ||
                                  "Yet to be added"
                                )
                              ) : propertyDocument.category === "Plot" ? (
                                propertyDocument.roadWidth ? (
                                  <>
                                    {propertyDocument.roadWidth}{" "}
                                    <h6
                                      style={{
                                        marginLeft: "3px",
                                      }}
                                    >
                                      {propertyDocument.roadWidthUnit || ""}
                                    </h6>
                                  </>
                                ) : (
                                  "Yet to be added"
                                )
                              ) : (
                                ""
                              )}
                            </h4>
                            <h6>
                              {propertyDocument.category === "Residential" ||
                              propertyDocument.category === "Commercial"
                                ? "Furnishing"
                                : propertyDocument.category === "Plot"
                                ? "Road Width"
                                : ""}
                            </h6>
                          </div>
                        </div>
                        {/* <div className="pmd_section4">
                 <div className="left">                     
                 
                   
                 
                   
                  
                     
                 </div>

                
               </div> */}
                        <EnquiryAddModal
                          show={showEnquiryModal}
                          handleClose={handleEnquiryModalClose}
                          selectedProperty={selectedProperty}
                        />
                      </div>
                    </div>
                  </div>
                  {user &&
                    (user.role === "admin" || user.role === "superAdmin") && (
                      <div className="extra_info_card_property mobile_full_card">
                        <div className="card_upcoming">
                          <div className="parent">
                            <div className="child coming_soon">
                              <div className="left">
                                <h5>0-0-0</h5>
                                <div className="line">
                                  <div
                                    className="line_fill"
                                    style={{
                                      width: "25%",
                                      background: "#00a300",
                                    }}
                                  ></div>
                                </div>
                                <h6>Inspection Date</h6>
                              </div>
                            </div>
                            <div className="child coming_soon">
                              <div className="left">
                                <h5>0-0-0</h5>
                                <div className="line">
                                  <div
                                    className="line_fill"
                                    style={{
                                      width: "92%",
                                      background: "#FA6262",
                                    }}
                                  ></div>
                                </div>
                                <h6>Rent Renewal</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {user &&
                    user.status === "active" &&
                    (user.role === "superAdmin" ||
                      user.role === "admin" ||
                      isPropertyOwner ||
                      isPropertyManager) && (
                      <div className="extra_info_card_property">
                        <Swiper
                          spaceBetween={15}
                          slidesPerView={5.5}
                          pagination={false}
                          freeMode={true}
                          className="all_tenants"
                          breakpoints={{
                            320: {
                              slidesPerView: 2.5,
                              spaceBetween: 15,
                            },
                            767: {
                              slidesPerView: 2.5,
                              spaceBetween: 15,
                            },
                            991: {
                              slidesPerView: 5.5,
                              spaceBetween: 15,
                            },
                          }}
                        >
                          <SwiperSlide>
                            <Link to={`/property-utility-bills/${propertyid}`}>
                              <div className="eicp_single">
                                <div className="icon">
                                  <span className="material-symbols-outlined">
                                    receipt_long
                                  </span>
                                  <div className="text">
                                    <h6>
                                      {utilityBillList &&
                                        utilityBillList.length}
                                    </h6>
                                    <h5>Utility Bills</h5>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </SwiperSlide>
                          <SwiperSlide>
                            <Link
                              to={`/inspection/${propertyid}`}
                              onClick={handleInspectionClick}
                            >
                              <div className="eicp_single">
                                <div className="icon">
                                  <span className="material-symbols-outlined">
                                    pageview
                                  </span>
                                  <div className="text">
                                    <h6>{inspections && inspections.length}</h6>
                                    <h5>Inspections</h5>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </SwiperSlide>
                          {/* Documents */}
                          <SwiperSlide>
                            <Link to={`/propertydocumentdetails/${propertyid}`}>
                              <div className="eicp_single">
                                <div className="icon">
                                  <span className="material-symbols-outlined">
                                    description
                                  </span>
                                  <div className="text">
                                    <h6>
                                      {propertyDocList &&
                                        propertyDocList.length}
                                    </h6>
                                    <h5>Documents</h5>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </SwiperSlide>

                          {/* Enquiry  */}
                          <SwiperSlide>
                            <Link to={`/enquiry/${propertyid}`}>
                              <div className="eicp_single">
                                <div className="icon">
                                  <span className="material-symbols-outlined">
                                    support_agent
                                  </span>
                                  <div className="text">
                                    <h6>{enquiryDocs && enquiryDocs.length}</h6>
                                    <h5>Enquiries</h5>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </SwiperSlide>
                          <SwiperSlide>
                            <Link to={`/property-keys/${propertyid}`}>
                              <div className="eicp_single">
                                <div className="icon">
                                  <span className="material-symbols-outlined">
                                    key
                                  </span>
                                  <div className="text">
                                    <h6>
                                      {propertyKeysList &&
                                        propertyKeysList.length}
                                    </h6>
                                    <h5>Keys</h5>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </SwiperSlide>

                          <SwiperSlide>
                            <Link to={`/property-ads/${propertyid}`}>
                              <div className="eicp_single">
                                <div className="icon">
                                  <span className="material-symbols-outlined">
                                    featured_video
                                  </span>
                                  <div className="text">
                                    <h6>{advDocList && advDocList.length}</h6>
                                    <h5>Advertisements</h5>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </SwiperSlide>

                          {/* Transactions */}
                          {/* <SwiperSlide>
                   <Link to={`/transactions/${propertyid}`}>
                   <div className="eicp_single coming_soon">
                     <div className="icon">
                       <span className="material-symbols-outlined">
                         payments
                       </span>
                       <div className="text">
                         <h6>5</h6>
                         <h5>Transactions</h5>
                       </div>
                     </div>
                   </div>
                   </Link>
                 </SwiperSlide> */}
                        </Swiper>
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
                  {showPropertyLayoutComponent && (
                    <PropertyLayoutComponent
                      propertylayouts={propertyLayouts}
                      propertyid={propertyid}
                      layoutid={layoutid}
                      setShowPropertyLayoutComponent={
                        setShowPropertyLayoutComponent
                      }
                    ></PropertyLayoutComponent>
                  )}

                  {propertyDocument &&
                    propertyDocument.category === "Residential" && (
                      <>
                        {user?.status === "active" &&
                          ((propertyLayoutsNew?.length === 0 &&
                            (user.role === "superAdmin" ||
                              user.role === "admin" ||
                              isPropertyManager)) ||
                            (propertyLayoutsNew?.length > 0 &&
                              (user.role === "superAdmin" ||
                                user.role === "admin" ||
                                isPropertyManager ||
                                isPropertyOwner))) && (
                            <section className="property_card_single full_width_sec with_blue">
                              <span className="verticall_title">
                                Layout :{" "}
                                {
                                  Object.keys(
                                    propertyLayoutsNew[0]?.layouts || {}
                                  ).length
                                }
                              </span>
                              <div className="more_detail_card_inner">
                                <div className="row">
                                  {user &&
                                    user.status === "active" &&
                                    (user.role === "admin" ||
                                      user.role === "superAdmin" ||
                                      isPropertyManager) && (
                                      // <div
                                      //   className="col-sm-1 col-2 pointer"
                                      //   style={{
                                      //     paddingRight: "0px",
                                      //   }}
                                      // >
                                      //   <div className="plus_icon">
                                      //     <div
                                      //       className="plus_icon_inner"
                                      //       onClick={
                                      //         handleShowPropertyLayoutComponent
                                      //       }
                                      //     >
                                      //       <span className="material-symbols-outlined">
                                      //         add
                                      //       </span>
                                      //     </div>
                                      //   </div>
                                      // </div>

                                      <div
                                        className="col-sm-1 col-2 pointer"
                                        style={{
                                          paddingRight: "0px",
                                        }}
                                      >
                                        <div className="plus_icon">
                                          {layoutDoc &&
                                          layoutDoc[0]?.propertyId ===
                                            propertyid ? (
                                            <Link
                                              className="plus_icon_inner"
                                              to={`/add-property-layout/${
                                                layoutDoc && layoutDoc[0]?.id
                                              }`}
                                            >
                                              <span className="material-symbols-outlined">
                                                border_color
                                              </span>
                                            </Link>
                                          ) : (
                                            <div
                                              className="plus_icon_inner"
                                              onClick={handleAddPropertyLayout}
                                            >
                                              <span className="material-symbols-outlined">
                                                add
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  <div
                                    className={`${
                                      user &&
                                      user.status === "active" &&
                                      (user.role === "admin" ||
                                        isPropertyManager ||
                                        user.role === "superAdmin")
                                        ? "col-sm-11 col-10"
                                        : "col-12"
                                    }`}
                                  >
                                    <div className="property_layout_card">
                                      <Swiper
                                        spaceBetween={15}
                                        slidesPerView={2.5}
                                        pagination={false}
                                        freeMode={true}
                                        className="all_tenants"
                                        breakpoints={{
                                          320: {
                                            slidesPerView: 1.1,
                                            spaceBetween: 10,
                                          },
                                          767: {
                                            slidesPerView: 1.5,
                                            spaceBetween: 15,
                                          },
                                          991: {
                                            slidesPerView: 2.5,
                                            spaceBetween: 15,
                                          },
                                        }}
                                      >
                                        {propertyLayoutsNew &&
                                          Object.entries(
                                            propertyLayoutsNew[0]?.layouts || {}
                                          ).map(([roomKey, room], index) => (
                                            <SwiperSlide key={index}>
                                              <div className="ai_detail_show pointer">
                                                {/* onClick={() =>
                                                        handleShowRoomModal(
                                                          roomKey
                                                        )
                                                      } */}
                                                <div className="left relative">
                                                  {/* {(() => {
                                                    const roomType = roomKey
                                                      .replace(/\d+$/, "")
                                                      .toLowerCase(); // remove number and lowercase

                                                    const imageMap = {
                                                      bedroom:
                                                        "/assets/img/icons/illustrate_bedroom.jpg",
                                                      kitchen:
                                                        "/assets/img/icons/illustrate_kitchen.jpg",
                                                      "living room":
                                                        "/assets/img/icons/illustrate_livingroom.jpg",
                                                      bathroom:
                                                        "/assets/img/icons/illustrate_bathroom.jpg",
                                                      "dining room":
                                                        "/assets/img/icons/illustrate_dining.jpg",
                                                      balcony:
                                                        "/assets/img/icons/illustrate_balcony.jpg",
                                                    };

                                                    const imageSrc =
                                                      imageMap[roomType] ||
                                                      "/assets/img/icons/illustrate_basment.jpg";

                                                    return (
                                                      <img
                                                        src={imageSrc}
                                                        alt={roomType}
                                                      />
                                                    );
                                                  })()} */}
                                                  {(() => {
                                                    const roomType = roomKey
                                                      .replace(/\d+$/, "")
                                                      .toLowerCase();
                                                    const defaultImageMap = {
                                                      bedroom:
                                                        "/assets/img/icons/illustrate_bedroom.jpg",
                                                      kitchen:
                                                        "/assets/img/icons/illustrate_kitchen.jpg",
                                                      "living room":
                                                        "/assets/img/icons/illustrate_livingroom.jpg",
                                                      bathroom:
                                                        "/assets/img/icons/illustrate_bathroom.jpg",
                                                      "dining room":
                                                        "/assets/img/icons/illustrate_dining.jpg",
                                                      balcony:
                                                        "/assets/img/icons/illustrate_balcony.jpg",
                                                    };

                                                    const hasRoomImages =
                                                      room.images &&
                                                      Array.isArray(
                                                        room.images
                                                      ) &&
                                                      room.images.length > 0;

                                                    const imageSrc =
                                                      hasRoomImages
                                                        ? room.images[0]?.url
                                                        : defaultImageMap[
                                                            roomType
                                                          ] ||
                                                          "/assets/img/icons/illustrate_basment.jpg";

                                                    return (
                                                      <img
                                                        src={imageSrc}
                                                        alt={roomType}
                                                      />
                                                    );
                                                  })()}
                                                </div>
                                                <div className="right">
                                                  <h5>
                                                    {room.roomName || roomKey}
                                                  </h5>
                                                  {/* <h5>{(room.roomName || roomKey)?.replace(/\d+$/, '')}</h5> */}
                                                  <div className="in_detail">
                                                    {room.length &&
                                                      room.width && (
                                                        <span className="in_single">
                                                          Carpet Area:{" "}
                                                          {
                                                            +(
                                                              parseFloat(
                                                                room.length
                                                              ) *
                                                              parseFloat(
                                                                room.width
                                                              )
                                                            ).toFixed(2)
                                                          }{" "}
                                                          SqFt
                                                        </span>
                                                      )}

                                                    {/* {room.fixtureBySelect &&
                                                      room.fixtureBySelect.map(
                                                        (fixture, findex) => (
                                                          <span
                                                            className="in_single"
                                                            key={findex}
                                                          >
                                                            {fixture}
                                                          </span>
                                                        )
                                                      )} */}
                                                  </div>
                                                  <div className="in_detail">
                                                    {room.length && (
                                                      <span className="in_single">
                                                        Length: {room.length} Ft
                                                      </span>
                                                    )}
                                                    {room.width && (
                                                      <span className="in_single">
                                                        Width: {room.width} Ft
                                                      </span>
                                                    )}
                                                  </div>
                                                  {/* plz don't remove this  */}
                                                  {/* <div
                                                    className="view_edit d-flex justify-content-between mt-2"
                                                    style={{
                                                      marginLeft: "7px",
                                                    }}
                                                  >
                                                    {user &&
                                                      user.status ===
                                                        "active" &&
                                                      (user.role === "admin" ||
                                                        user.role ===
                                                          "superAdmin") && (
                                                        <span
                                                          className="click_text pointer"
                                                          onClick={() =>
                                                            editPropertyLayout(
                                                              room.id
                                                            )
                                                          }
                                                        >
                                                          Edit
                                                        </span>
                                                      )}
                                                    <span
                                                      className="click_text pointer"
                                                      onClick={() =>
                                                        handleShowRoomModal(
                                                          roomKey
                                                        )
                                                      }
                                                    >
                                                      View More
                                                    </span>
                                                  </div> */}
                                                </div>
                                              </div>
                                            </SwiperSlide>
                                          ))}
                                      </Swiper>

                                      {selectedRoom && (
                                        <>
                                          <Modal
                                            show={showRoomModal}
                                            onHide={handleRoomModalClose}
                                            className="margin_top detail_modal"
                                            centered
                                          >
                                            <span
                                              className="material-symbols-outlined modal_close"
                                              onClick={handleRoomModalClose}
                                            >
                                              close
                                            </span>
                                            <h5 className="modal_title text-center">
                                              {selectedRoom.roomName}
                                            </h5>
                                            <div className="modal_body">
                                              <div className="img_area">
                                                {(() => {
                                                  if (
                                                    selectedRoom.roomType ===
                                                    "Bedroom"
                                                  ) {
                                                    return (
                                                      <img
                                                        style={{
                                                          width: "100%",
                                                        }}
                                                        src="/assets/img/icons/illustrate_bedroom.jpg"
                                                        alt={
                                                          selectedRoom.roomType
                                                        }
                                                      />
                                                    );
                                                  } else if (
                                                    selectedRoom.roomType ===
                                                    "Kitchen"
                                                  ) {
                                                    return (
                                                      <img
                                                        style={{
                                                          width: "100%",
                                                        }}
                                                        src="/assets/img/icons/illustrate_kitchen.jpg"
                                                        alt={
                                                          selectedRoom.roomType
                                                        }
                                                      />
                                                    );
                                                  } else if (
                                                    selectedRoom.roomType ===
                                                    "Living Room"
                                                  ) {
                                                    return (
                                                      <img
                                                        style={{
                                                          width: "100%",
                                                        }}
                                                        src="/assets/img/icons/illustrate_livingroom.jpg"
                                                        alt={
                                                          selectedRoom.roomType
                                                        }
                                                      />
                                                    );
                                                  } else if (
                                                    selectedRoom.roomType ===
                                                    "Bathroom"
                                                  ) {
                                                    return (
                                                      <img
                                                        style={{
                                                          width: "100%",
                                                        }}
                                                        src="/assets/img/icons/illustrate_bathroom.jpg"
                                                        alt={
                                                          selectedRoom.roomType
                                                        }
                                                      />
                                                    );
                                                  } else if (
                                                    selectedRoom.roomType ===
                                                    "Dining Room"
                                                  ) {
                                                    return (
                                                      <img
                                                        style={{
                                                          width: "100%",
                                                        }}
                                                        src="/assets/img/icons/illustrate_dining.jpg"
                                                        alt={
                                                          selectedRoom.roomType
                                                        }
                                                      />
                                                    );
                                                  } else if (
                                                    selectedRoom.roomType ===
                                                    "Balcony"
                                                  ) {
                                                    return (
                                                      <img
                                                        style={{
                                                          width: "100%",
                                                        }}
                                                        src="/assets/img/icons/illustrate_balcony.jpg"
                                                        alt={
                                                          selectedRoom.roomType
                                                        }
                                                      />
                                                    );
                                                  } else {
                                                    return (
                                                      <img
                                                        style={{
                                                          width: "100%",
                                                        }}
                                                        src="/assets/img/icons/illustrate_basment.jpg"
                                                        alt={
                                                          selectedRoom.roomType
                                                        }
                                                      />
                                                    );
                                                  }
                                                })()}
                                              </div>
                                              <div className="main_detail">
                                                <div className="md_single">
                                                  Area:{" "}
                                                  <span className="value">
                                                    {selectedRoom.roomTotalArea}
                                                  </span>
                                                  <span className="unit">
                                                    {" "}
                                                    SqFt
                                                  </span>
                                                </div>
                                                {selectedRoom.lenght && (
                                                  <div className="md_single">
                                                    Length:{" "}
                                                    <span className="value">
                                                      {selectedRoom.lenght}
                                                    </span>
                                                    <span className="unit">
                                                      {" "}
                                                      Ft
                                                    </span>
                                                  </div>
                                                )}
                                                {selectedRoom.width && (
                                                  <div className="md_single">
                                                    Width:{" "}
                                                    <span className="value">
                                                      {selectedRoom.width}
                                                    </span>
                                                    <span className="unit">
                                                      {" "}
                                                      Ft
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                              <div className="more_detail">
                                                {selectedRoom.roomFixtures &&
                                                  selectedRoom.roomFixtures.map(
                                                    (fixture, index) => (
                                                      <span
                                                        className="more_detail_single"
                                                        key={index}
                                                      >
                                                        {fixture}
                                                      </span>
                                                    )
                                                  )}
                                              </div>
                                            </div>
                                            {/* {selectedRoom.roomAttachments
                                              .length !== 0 && (
                                              <div className="attached_with">
                                                {selectedRoom.roomAttachments && (
                                                  <h6 className="text-center text_black">
                                                    Attached with
                                                  </h6>
                                                )}
                                                <div className="more_detail">
                                                  {selectedRoom.roomAttachments &&
                                                    selectedRoom.roomAttachments.map(
                                                      (attachment, findex) => (
                                                        <span className="more_detail_single">
                                                          {attachment}
                                                        </span>
                                                      )
                                                    )}
                                                </div>
                                              </div>
                                            )} */}

                                            {/* {user &&
                                              user.status === "active" &&
                                              user.role === "superAdmin" && (
                                                <div className="modal_footer">
                                                  <div
                                                    onClick={handleConfirmShow}
                                                    className="delete_bottom"
                                                  >
                                                    <span className="material-symbols-outlined">
                                                      delete
                                                    </span>
                                                    <span>Delete</span>
                                                  </div>
                                                </div>
                                              )} */}
                                          </Modal>

                                          {/* <Modal
                                            show={showConfirmModal}
                                            onHide={handleConfirmClose}
                                            className="delete_modal"
                                            centered
                                          >
                                            <div className="alert_text text-center">
                                              Alert
                                            </div>

                                            <div className="sure_content text-center">
                                              Are you sure you want to delete?
                                            </div>
                                            <div className="yes_no_btn">
                                              <div
                                                className="theme_btn full_width no_icon text-center btn_border"
                                                onClick={() =>
                                                  deletePropertyLayout(
                                                    selectedRoom.id
                                                  )
                                                }
                                              >
                                                Yes
                                              </div>
                                              <div
                                                className="theme_btn full_width no_icon text-center btn_fill"
                                                onClick={handleConfirmClose}
                                              >
                                                No
                                              </div>
                                            </div>
                                          </Modal> */}
                                        </>
                                      )}
                                    </div>
                                    {Object.keys(
                                      propertyLayoutsNew[0]?.layouts || {}
                                    ).length > 0 && (
                                      <div className="text-center mt-3">
                                        <Link
                                          to={`/view-layout/${
                                            layoutDoc && layoutDoc[0]?.id
                                          }`}
                                          className="theme_btn btn_border no_icon text-center"
                                          style={{
                                            display: "inline-block",
                                          }}
                                        >
                                          View all property layout
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </section>
                          )}
                      </>
                    )}

                  {/* property layout section end  */}

                  {/* tenant card start */}
                  {propertyDocument &&
                    (propertyDocument.category === "Residential" ||
                      propertyDocument.category === "Commercial") && (
                      <>
                        {user?.status === "active" &&
                          ((tenantDocument?.length === 0 &&
                            (user.role === "superAdmin" ||
                              user.role === "admin" ||
                              isPropertyManager)) ||
                            (tenantDocument?.length > 0 &&
                              (user.role === "superAdmin" ||
                                user.role === "admin" ||
                                isPropertyManager ||
                                isPropertyOwner))) && (
                            <section className="property_card_single full_width_sec with_orange">
                              <span className="verticall_title">
                                Tenants
                                {/* {tenantDocument && tenantDocument.length} */}
                              </span>
                              <div className="more_detail_card_inner">
                                <div className="row">
                                  {user &&
                                    user.status === "active" &&
                                    (user.role === "admin" ||
                                      user.role === "superAdmin" ||
                                      isPropertyManager) && (
                                      <div
                                        className="col-sm-1 col-2 "
                                        style={{
                                          paddingRight: "0px",
                                        }}
                                      >
                                        <div className="plus_icon pointer">
                                          <div
                                            className="plus_icon_inner"
                                            onClick={() =>
                                              setShowAddTenantModal(true)
                                            }
                                          >
                                            <span className="material-symbols-outlined">
                                              add
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  <div
                                    className={`${
                                      user &&
                                      user.status === "active" &&
                                      (user.role === "admin" ||
                                        user.role === "superAdmin" ||
                                        isPropertyManager)
                                        ? "col-sm-11 col-10"
                                        : "col-12"
                                    }`}
                                  >
                                    <div className="tenant_card">
                                      <Swiper
                                        spaceBetween={15}
                                        slidesPerView={3.5}
                                        pagination={false}
                                        freeMode={true}
                                        className="all_tenants"
                                        breakpoints={{
                                          320: {
                                            slidesPerView: 1.1,
                                            spaceBetween: 10,
                                          },
                                          767: {
                                            slidesPerView: 1.5,
                                            spaceBetween: 15,
                                          },
                                          991: {
                                            slidesPerView: 2.5,
                                            spaceBetween: 15,
                                          },
                                          1199: {
                                            slidesPerView: 3.5,
                                            spaceBetween: 15,
                                          },
                                        }}
                                      >
                                        {tenantDocument &&
                                          tenantDocument.map(
                                            (tenant, index) => (
                                              <SwiperSlide key={index}>
                                                <div
                                                  className={`tc_single relative item ${
                                                    tenant.status === "inactive"
                                                      ? "t_inactive"
                                                      : ""
                                                  }`}
                                                >
                                                  <Link
                                                    className="left"
                                                    to={`/tenantdetails/${tenant.id}`}
                                                  >
                                                    <div className="tcs_img_container">
                                                      <img
                                                        src={
                                                          tenant.tenantImgUrl ||
                                                          "/assets/img/dummy_user.png"
                                                        }
                                                        alt="Preview"
                                                      />
                                                    </div>
                                                    <div
                                                      className={`tenant_detail ${
                                                        editingTenantId ===
                                                        tenant.id
                                                          ? "td_edit"
                                                          : ""
                                                      }`}
                                                    >
                                                      <h6 className="t_name">
                                                        {tenant.name
                                                          ? firstLetterCapitalize(
                                                              tenant.name
                                                            )
                                                          : "Tenant Name"}
                                                      </h6>
                                                      <h6 className="t_number">
                                                        {tenant.mobile
                                                          ? tenant.mobile.replace(
                                                              /(\d{2})(\d{5})(\d{5})/,
                                                              "+$1 $2-$3"
                                                            )
                                                          : "Tenant Phone"}
                                                      </h6>
                                                    </div>
                                                  </Link>
                                                  <div className="wha_call_icon">
                                                    <Link
                                                      className="call_icon wc_single"
                                                      to={`tel:+${tenantSelectedUser?.id}`}
                                                      target="_blank"
                                                    >
                                                      <img
                                                        src="/assets/img/simple_call.png"
                                                        alt="propdial"
                                                      />
                                                    </Link>
                                                    <Link
                                                      className="wha_icon wc_single"
                                                      to={`https://wa.me/+${tenant.mobile}`}
                                                      target="_blank"
                                                    >
                                                      <img
                                                        src="/assets/img/whatsapp_simple.png"
                                                        alt="propdial"
                                                      />
                                                    </Link>
                                                  </div>
                                                </div>
                                              </SwiperSlide>
                                            )
                                          )}
                                      </Swiper>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <Modal
                                show={showAddTenantModal}
                                centered
                                size="lg"
                              className={`add_new ${tenantMode === "new" && "new"}`}                             >
                                <h5 className="text_orange text-center">
                                  Add tenant
                                </h5>
                                <div className="project-filter">
                                  <nav>
                                    <button
                                      className={`pointer  ${
                                        tenantMode === "existing"
                                          ? "active"
                                          : ""
                                      }`}
                                      onClick={() => setTenantMode("existing")}
                                      style={{ marginRight: "10px" }}
                                    >
                                      Existing
                                    </button>
                                    <button
                                      className={`pointer ${
                                        tenantMode === "new" ? "active" : ""
                                      }`}
                                      onClick={() => setTenantMode("new")}
                                    >
                                      Add New
                                    </button>
                                  </nav>
                                </div>

                                <span
                                  className="material-symbols-outlined modal_close"
                                  onClick={() => setShowAddTenantModal(false)}
                                >
                                  close
                                </span>
                                {tenantMode === "new" && <AddPropertyUser propertyid={propertyid} user={user} whoIsUser={"tenant"}/>}
                                {tenantMode === "existing" && (
                                  <>
                                    <div className="form_field st-2">
                                      <div className="field_inner">
                                        <input
                                          type="text"
                                          style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                          }}
                                          value={tenantSearchQuery}
                                          onChange={handleTenantSearchChange}
                                          placeholder="Search users by name, email, or mobile..."
                                        />
                                        <div className="field_icon">
                                          <span className="material-symbols-outlined">
                                            search
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <ul className="search_results">
                                      {tenantFilteredUsers.map((user) => (
                                        <li
                                          className="search_result_single"
                                          key={user.id}
                                        >
                                          <label>
                                            <input
                                              type="radio"
                                              name="selectedTenant"
                                              checked={
                                                tenantSelectedUser?.id ===
                                                user.id
                                              }
                                              onChange={() =>
                                                handleTenantSelectUser(user)
                                              }
                                            />
                                            <div>
                                              <strong>
                                                {user.rolePropDial?.toUpperCase()}{" "}
                                                - {user.fullName}
                                              </strong>{" "}
                                              (
                                              {user.id?.replace(
                                                /(\d{2})(\d{5})(\d{5})/,
                                                "+$1 $2-$3"
                                              )}
                                              )<br />
                                              {user.email}, {user.city},{" "}
                                              {user.country}
                                            </div>
                                          </label>
                                        </li>
                                      ))}
                                    </ul>

                                    {tenantSelectedUser && (
                                      // <div
                                      //   className="tc_single relative"
                                      // >
                                      //   <div
                                      //     className="left"
                                      //   >
                                      //     <div className="tcs_img_container">
                                      //       <img
                                      //         src={
                                      //           tenantSelectedUser.photoURL ||
                                      //           "/assets/img/dummy_user.png"
                                      //         }
                                      //         alt="Preview"
                                      //       />
                                      //     </div>
                                      //     <div
                                      //       className="tenant_detail"
                                      //     >
                                      //       <h6 className="t_name">
                                      //         {tenantSelectedUser.fullName}
                                      //       </h6>
                                      //       <h6 className="t_number">
                                      //       {tenantSelectedUser.phoneNumber}
                                      //       </h6>
                                      //     </div>
                                      //   </div>
                                      // </div>
                                      <button
                                        onClick={handleAddTenantToCollection}
                                        className="theme_btn btn_fill no_icon full_width text-center"
                                      >
                                        Add
                                      </button>
                                    )}
                                  </>
                                )}
                              </Modal>
                            </section>
                          )}
                      </>
                    )}

                  {/* tenant card end  */}

                  {/* property user card  start */}
                  {user?.status === "active" &&
                    ((filteredPropertyOwners?.length === 0 &&
                      (user.role === "superAdmin" ||
                        user.role === "admin" ||
                        isPropertyManager)) ||
                      (filteredPropertyOwners?.length > 0 &&
                        (user.role === "superAdmin" ||
                          user.role === "admin" ||
                          isPropertyManager ||
                          isPropertyOwner))) && (
                      <>
                        <section className="property_card_single full_width_sec with_blue property_user">
                          <span className="verticall_title">
                            Owners
                            {/* {filteredPropertyOwners && filteredPropertyOwners.length} */}
                          </span>
                          <div className="more_detail_card_inner">
                            <div className="row">
                              {user &&
                                user.status === "active" &&
                                (user.role === "admin" ||
                                  user.role === "superAdmin") && (
                                  <div
                                    className="col-sm-1 col-2"
                                    style={{
                                      paddingRight: "0px",
                                    }}
                                  >
                                    <div className="plus_icon">
                                      <Link
                                        className="plus_icon_inner"
                                        onClick={(e) =>
                                          handleAddPropertyUser(
                                            e,
                                            "propertyowner"
                                          )
                                        }
                                      >
                                        <span className="material-symbols-outlined">
                                          add
                                        </span>
                                      </Link>
                                    </div>
                                  </div>
                                )}
                              <div
                                className={`${
                                  user &&
                                  user.status === "active" &&
                                  (user.role === "admin" ||
                                    user.role === "superAdmin")
                                    ? "col-sm-11 col-10"
                                    : "col-12"
                                }`}
                              >
                                <div className="tenant_card">
                                  <Swiper
                                    spaceBetween={15}
                                    slidesPerView={3.5}
                                    pagination={false}
                                    freeMode={true}
                                    className="all_tenants"
                                    breakpoints={{
                                      320: {
                                        slidesPerView: 1.1,
                                        spaceBetween: 10,
                                      },
                                      767: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 15,
                                      },
                                      991: {
                                        slidesPerView: 2.5,
                                        spaceBetween: 15,
                                      },
                                      1199: {
                                        slidesPerView: 3.5,
                                        spaceBetween: 15,
                                      },
                                    }}
                                  >
                                    {filteredPropertyOwners &&
                                      filteredPropertyOwners.map(
                                        (propUser, index) => (
                                          <SwiperSlide key={index}>
                                            <div className="tc_single relative">
                                              <div
                                                className="property_people_designation d-flex align-items-end justify-content-center pointer"
                                                onClick={
                                                  user &&
                                                  user.status === "active" &&
                                                  (user.role === "admin" ||
                                                    user.role === "superAdmin")
                                                    ? (e) =>
                                                        handleShowOwnerTags(
                                                          e,
                                                          propUser,
                                                          "propowner"
                                                        )
                                                    : null
                                                }
                                              >
                                                {propUser.userTag}
                                                {user &&
                                                  user.status === "active" &&
                                                  (user.role === "admin" ||
                                                    user.role ===
                                                      "superAdmin") && (
                                                    <span
                                                      className="material-symbols-outlined click_icon text_near_icon"
                                                      style={{
                                                        fontSize: "10px",
                                                      }}
                                                    >
                                                      edit
                                                    </span>
                                                  )}
                                              </div>
                                              <div className="left">
                                                <div className="tcs_img_container">
                                                  <img
                                                    src={
                                                      propUser.photoURL ||
                                                      "/assets/img/dummy_user.png"
                                                    }
                                                    alt="Preview"
                                                  />
                                                </div>
                                                <div className="tenant_detail">
                                                  <h5
                                                    onClick={
                                                      user &&
                                                      user.status ===
                                                        "active" &&
                                                      (user.role === "admin" ||
                                                        user.role ===
                                                          "superAdmin")
                                                        ? () =>
                                                            openChangeUser(
                                                              propUser.id,
                                                              "owner"
                                                            )
                                                        : ""
                                                    }
                                                    className={`t_name ${
                                                      user &&
                                                      (user.role === "admin" ||
                                                        user.role ===
                                                          "superAdmin")
                                                        ? "pointer"
                                                        : ""
                                                    }`}
                                                  >
                                                    {propUser.fullName}
                                                    {user &&
                                                      user.status ===
                                                        "active" &&
                                                      (user.role === "admin" ||
                                                        user.role ===
                                                          "superAdmin") && (
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
                                                  {user &&
                                                    user.status === "active" &&
                                                    user.role ===
                                                      "superAdmin" && (
                                                      <h6
                                                        className="text_red pointer"
                                                        style={{
                                                          width: "fit-content",
                                                          fontSize: "10px",
                                                          letterSpacing:
                                                            "0.4px",
                                                          marginLeft: "3px",
                                                        }}
                                                        onClick={(e) =>
                                                          handleDeletePropUser(
                                                            e,
                                                            propUser
                                                          )
                                                        }
                                                      >
                                                        Delete
                                                      </h6>
                                                    )}
                                                </div>
                                              </div>
                                              <div className="wha_call_icon">
                                                <Link
                                                  className="call_icon wc_single"
                                                  to={
                                                    propUser
                                                      ? `tel:+${propUser.phoneNumber.replace(
                                                          /\D/g,
                                                          ""
                                                        )}`
                                                      : "#"
                                                  }
                                                >
                                                  <img
                                                    src="/assets/img/simple_call.png"
                                                    alt="propdial"
                                                  />
                                                </Link>
                                                <Link
                                                  className="wha_icon wc_single"
                                                  to={
                                                    propUser
                                                      ? `https://wa.me/+${propUser.phoneNumber.replace(
                                                          /\D/g,
                                                          ""
                                                        )}`
                                                      : "#"
                                                  }
                                                  target="_blank"
                                                >
                                                  <img
                                                    src="/assets/img/whatsapp_simple.png"
                                                    alt="propdial"
                                                  />
                                                </Link>
                                              </div>
                                            </div>
                                          </SwiperSlide>
                                        )
                                      )}
                                  </Swiper>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                        {selectedPropUser && (
                          <Modal
                            show={showPropOwner}
                            onHide={(e) =>
                              handleClosePropUserTags(e, "cancel", "propowner")
                            }
                            className="my_modal"
                            centered
                          >
                            <span
                              className="material-symbols-outlined modal_close"
                              onClick={(e) =>
                                handleClosePropUserTags(
                                  e,
                                  "cancel",
                                  "propowner"
                                )
                              }
                            >
                              close
                            </span>
                            <Modal.Body>
                              <h6 className="m18 lh22 mb-3">
                                Full Name: {selectedPropUser.fullName}
                              </h6>
                              <div className="form_field">
                                <div className="field_box theme_radio_new">
                                  <div
                                    className="theme_radio_container"
                                    style={{
                                      padding: "0px",
                                      border: "none",
                                    }}
                                  >
                                    {/* <div className="radio_single">
                                      <input
                                        type="radio"
                                        name="prop_user"
                                        value="Admin"
                                        id="Admin"
                                        onChange={() =>
                                          handleUserTagChange("Admin")
                                        }
                                      />
                                      <label htmlFor="Admin">Admin</label>
                                    </div> */}
                                    {/* checked={selectedPropUser.userTag === "Admin"}  */}
                                    <div className="radio_single">
                                      <input
                                        type="radio"
                                        name="prop_user"
                                        value="Owner"
                                        id="Owner"
                                        onChange={() =>
                                          handleUserTagChange("Owner")
                                        }
                                      />
                                      <label htmlFor="Owner">Owner</label>
                                    </div>
                                    {/* checked={selectedPropUser.userTag === "Owner"}  */}
                                    <div className="radio_single">
                                      <input
                                        type="radio"
                                        name="prop_user"
                                        value="Co-Owner"
                                        id="Co-Owner"
                                        onChange={() =>
                                          handleUserTagChange("Co-Owner")
                                        }
                                      />
                                      <label htmlFor="Co-Owner">Co-Owner</label>
                                    </div>
                                    {/* checked={selectedPropUser.userTag === "Co-Owner"}  */}
                                    <div className="radio_single">
                                      <input
                                        type="radio"
                                        name="prop_user"
                                        value="POC"
                                        id="POC"
                                        onChange={() =>
                                          handleUserTagChange("POC")
                                        }
                                      />
                                      <label htmlFor="POC">POC</label>
                                    </div>
                                    {/* checked={selectedPropUser.userTag === "POC"}  */}
                                    <div className="radio_single">
                                      <input
                                        type="radio"
                                        name="prop_user"
                                        value="POA"
                                        id="POA"
                                        onChange={() =>
                                          handleUserTagChange("POA")
                                        }
                                      />
                                      <label htmlFor="POA">POA</label>
                                    </div>
                                    {/* checked={selectedPropUser.userTag === "POA"}  */}
                                  </div>
                                </div>
                              </div>
                              <div className="vg22"></div>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(2,1fr)",
                                  gridColumnGap: "22px",
                                }}
                              >
                                <div
                                  className="theme_btn btn_border no_icon full_width text-center"
                                  onClick={(e) =>
                                    handleClosePropUserTags(
                                      e,
                                      "cancel",
                                      "propowner"
                                    )
                                  }
                                >
                                  Cancel
                                </div>
                                <div
                                  className="theme_btn btn_fill no_icon full_width text-center"
                                  onClick={(e) =>
                                    handleClosePropUserTags(
                                      e,
                                      "save",
                                      "propowner"
                                    )
                                  }
                                >
                                  Save Changes
                                </div>
                              </div>
                            </Modal.Body>
                          </Modal>
                        )}
                        {selectedPropUser && (
                          <Modal
                            show={showConfirmPropUser}
                            onHide={(e) =>
                              handleCloseConfirmPropUser(e, "cancel")
                            }
                            className="delete_modal"
                            centered
                          >
                            <div className="text-center alert_text">Alert</div>
                            <div className="text-center sure_content">
                              Are you sure you want to delete?
                            </div>
                            <div className="yes_no_btn">
                              <div
                                className="theme_btn btn_border full_width no_icon text-center"
                                onClick={(e) =>
                                  handleCloseConfirmPropUser(e, "confirm")
                                }
                              >
                                Yes
                              </div>
                              <div
                                className="theme_btn btn_fill full_width no_icon text-center"
                                onClick={(e) =>
                                  handleCloseConfirmPropUser(e, "cancel")
                                }
                              >
                                No
                              </div>
                            </div>
                          </Modal>
                        )}
                      </>
                    )}
                  {/* property user card end  */}

                  {/* propdial managers / users card  start */}
                  {user?.status === "active" &&
                    ((filteredPropertyManagers?.length === 0 &&
                      (user.role === "superAdmin" ||
                        user.role === "admin" ||
                        isPropertyManager)) ||
                      (filteredPropertyManagers?.length > 0 &&
                        (user.role === "superAdmin" ||
                          user.role === "admin" ||
                          isPropertyManager ||
                          isPropertyOwner))) && (
                      <>
                        <section className="property_card_single full_width_sec with_orange property_user">
                          <span className="verticall_title">
                            Managers
                            {/* {filteredPropertyManagers && filteredPropertyManagers.length} */}
                          </span>
                          <div className="more_detail_card_inner">
                            <div className="row">
                              {user &&
                                user.status === "active" &&
                                (user.role === "admin" ||
                                  user.role === "superAdmin") && (
                                  <div
                                    className="col-sm-1 col-2"
                                    style={{
                                      paddingRight: "0px",
                                    }}
                                  >
                                    <div className="plus_icon">
                                      <Link
                                        className="plus_icon_inner"
                                        onClick={(e) =>
                                          handleAddPropertyUser(
                                            e,
                                            "propertymanager"
                                          )
                                        }
                                      >
                                        <span className="material-symbols-outlined">
                                          add
                                        </span>
                                      </Link>
                                    </div>
                                  </div>
                                )}
                              <div
                                className={`${
                                  user &&
                                  (user.role === "admin" ||
                                    user.role === "superAdmin")
                                    ? "col-sm-11 col-10"
                                    : "col-12"
                                }`}
                              >
                                <div className="tenant_card">
                                  <Swiper
                                    spaceBetween={15}
                                    slidesPerView={3.5}
                                    pagination={false}
                                    freeMode={true}
                                    className="all_tenants"
                                    breakpoints={{
                                      320: {
                                        slidesPerView: 1.1,
                                        spaceBetween: 10,
                                      },
                                      767: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 15,
                                      },
                                      991: {
                                        slidesPerView: 2.5,
                                        spaceBetween: 15,
                                      },
                                      1199: {
                                        slidesPerView: 3.5,
                                        spaceBetween: 15,
                                      },
                                    }}
                                  >
                                    {filteredPropertyManagers &&
                                      filteredPropertyManagers.map(
                                        (propUser, index) => (
                                          <SwiperSlide key={index}>
                                            <div className="tc_single relative item">
                                              <div
                                                className="property_people_designation d-flex align-items-end justify-content-center"
                                                onClick={(e) => {
                                                  if (
                                                    user &&
                                                    user.status === "active" &&
                                                    (user.role === "admin" ||
                                                      user.role ===
                                                        "superAdmin")
                                                  ) {
                                                    handleShowOwnerTags(
                                                      e,
                                                      propUser,
                                                      "propmanager"
                                                    );
                                                  }
                                                }}
                                              >
                                                {propUser.userTag}
                                                {user &&
                                                  user.status === "active" &&
                                                  (user.role === "admin" ||
                                                    user.role ===
                                                      "superAdmin") && (
                                                    <span
                                                      className="material-symbols-outlined click_icon text_near_icon"
                                                      style={{
                                                        fontSize: "10px",
                                                      }}
                                                    >
                                                      edit
                                                    </span>
                                                  )}
                                              </div>
                                              <div className="left">
                                                <div className="tcs_img_container">
                                                  <img
                                                    src={
                                                      propUser.photoURL ||
                                                      "/assets/img/dummy_user.png"
                                                    }
                                                    alt="propdial"
                                                  />
                                                </div>
                                                <div className="tenant_detail">
                                                  <h5
                                                    onClick={
                                                      user &&
                                                      user.status ===
                                                        "active" &&
                                                      (user.role === "admin" ||
                                                        user.role ===
                                                          "superAdmin")
                                                        ? () =>
                                                            openChangeUser(
                                                              propUser.id,
                                                              "admin"
                                                            )
                                                        : ""
                                                    }
                                                    className={`t_name ${
                                                      user &&
                                                      (user.role === "admin" ||
                                                        user.role ===
                                                          "superAdmin")
                                                        ? "pointer"
                                                        : ""
                                                    }`}
                                                  >
                                                    {propUser.fullName}
                                                    {user &&
                                                      user.status ===
                                                        "active" &&
                                                      (user.role === "admin" ||
                                                        user.role ===
                                                          "superAdmin") && (
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
                                                  {user &&
                                                    user.status === "active" &&
                                                    user.role ===
                                                      "superAdmin" && (
                                                      <h6
                                                        className="text_red pointer"
                                                        style={{
                                                          width: "fit-content",
                                                          fontSize: "10px",
                                                          letterSpacing:
                                                            "0.4px",
                                                          marginLeft: "3px",
                                                        }}
                                                        onClick={(e) =>
                                                          handleDeletePropUser(
                                                            e,
                                                            propUser
                                                          )
                                                        }
                                                      >
                                                        Delete
                                                      </h6>
                                                    )}
                                                </div>
                                              </div>
                                              <div className="wha_call_icon">
                                                <Link
                                                  className="call_icon wc_single"
                                                  to={
                                                    propUser
                                                      ? `tel:+${propUser.phoneNumber.replace(
                                                          /\D/g,
                                                          ""
                                                        )}`
                                                      : "#"
                                                  }
                                                >
                                                  <img
                                                    src="/assets/img/simple_call.png"
                                                    alt="propdial"
                                                  />
                                                </Link>
                                                <Link
                                                  className="wha_icon wc_single"
                                                  to={
                                                    propUser
                                                      ? `https://wa.me/+${propUser.phoneNumber.replace(
                                                          /\D/g,
                                                          ""
                                                        )}`
                                                      : "#"
                                                  }
                                                  target="_blank"
                                                >
                                                  <img
                                                    src="/assets/img/whatsapp_simple.png"
                                                    alt="propdial"
                                                  />
                                                </Link>
                                              </div>
                                            </div>
                                          </SwiperSlide>
                                        )
                                      )}
                                  </Swiper>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                        {selectedPropUser && (
                          <Modal
                            show={showPropManager}
                            onHide={(e) =>
                              handleClosePropUserTags(
                                e,
                                "cancel",
                                "propmanager"
                              )
                            }
                            className="my_modal"
                            centered
                          >
                            <span
                              className="material-symbols-outlined modal_close"
                              onClick={(e) =>
                                handleClosePropUserTags(
                                  e,
                                  "cancel",
                                  "propmanager"
                                )
                              }
                            >
                              close
                            </span>
                            <Modal.Body>
                              <h6 className="m18 lh22 mb-3">
                                Full Name: {selectedPropUser.fullName}
                              </h6>
                              <div className="form_field">
                                <div className="field_box theme_radio_new">
                                  <div
                                    className="theme_radio_container"
                                    style={{
                                      padding: "0px",
                                      border: "none",
                                    }}
                                  >
                                    <div className="radio_single">
                                      <input
                                        type="radio"
                                        name="prop_user_manager"
                                        value="Manager"
                                        id="Manager"
                                        // checked={
                                        //   selectedPropUser.userTag === "Manager"
                                        // }
                                        onChange={() =>
                                          handleUserTagChange("Manager")
                                        }
                                      />
                                      <label htmlFor="Manager">Manager</label>
                                    </div>
                                    <div className="radio_single">
                                      <input
                                        type="radio"
                                        name="prop_user_manager"
                                        value="Executive"
                                        id="Executive"
                                        // checked={
                                        //   selectedPropUser.userTag ===
                                        //   "Executive"
                                        // }
                                        onChange={() =>
                                          handleUserTagChange("Executive")
                                        }
                                      />
                                      <label htmlFor="Executive">
                                        Executive
                                      </label>
                                    </div>
                                    <div className="radio_single">
                                      <input
                                        type="radio"
                                        name="prop_user_manager"
                                        value="Substitute"
                                        id="Substitute"
                                        // checked={
                                        //   selectedPropUser.userTag ===
                                        //   "Substitute"
                                        // }
                                        onChange={() =>
                                          handleUserTagChange("Substitute")
                                        }
                                      />
                                      <label htmlFor="Substitute">
                                        Substitute
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="vg22"></div>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(2,1fr)",
                                  gridColumnGap: "22px",
                                }}
                              >
                                <div
                                  className="theme_btn no_icon full_width btn_border text-center"
                                  onClick={(e) =>
                                    handleClosePropUserTags(
                                      e,
                                      "cancel",
                                      "propmanager"
                                    )
                                  }
                                >
                                  Cancel
                                </div>
                                <div
                                  className="theme_btn no_icon full_width btn_fill text-center"
                                  onClick={(e) =>
                                    handleClosePropUserTags(
                                      e,
                                      "save",
                                      "propmanager"
                                    )
                                  }
                                >
                                  Save Changes
                                </div>
                              </div>
                            </Modal.Body>
                          </Modal>
                        )}
                      </>
                    )}
                  {/* propdial managers / user card end  */}

                  {/* Property Detail for residential  */}
                  {propertyDocument &&
                    propertyDocument.category === "Residential" && (
                      <div className="property_card_single mobile_full_card">
                        <div className="more_detail_card_inner">
                          <h2 className="card_title">Property Detail</h2>
                          <div className="p_info">
                            {/* BHK  */}
                            {propertyDocument && propertyDocument.bhk && (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/twin-bed.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>BHK Type</h6>
                                  <h5>{propertyDocument.bhk}</h5>
                                </div>
                              </div>
                            )}

                            {/* Furnishing  */}
                            {propertyDocument &&
                              propertyDocument.furnishing && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/furnishing.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Furnishing</h6>
                                    <h5>
                                      {propertyDocument.furnishing.toLowerCase() ===
                                      "raw"
                                        ? "Unfurnished"
                                        : propertyDocument.furnishing}
                                    </h5>
                                  </div>
                                </div>
                              )}
                            {/* Bedroom   */}

                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/bedrooms.png"
                                  alt="propdial"
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Bedroom</h6>
                                <h5>
                                  {propertyDocument.numberOfBedrooms === 0 ||
                                  propertyDocument.numberOfBedrooms === "0"
                                    ? "Yet to be added"
                                    : propertyDocument.numberOfBedrooms}
                                </h5>
                              </div>
                            </div>

                            {/* Bathroom  */}
                            {propertyDocument &&
                              propertyDocument.numberOfBathrooms && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/bathrroms.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Bathroom</h6>
                                    <h5>
                                      {propertyDocument.numberOfBathrooms ===
                                        0 ||
                                      propertyDocument.numberOfBathrooms === "0"
                                        ? "Yet to be added"
                                        : propertyDocument.numberOfBathrooms}
                                    </h5>
                                  </div>
                                </div>
                              )}
                            {/* Balcony  */}
                            {propertyDocument &&
                              propertyDocument.category === "Residential" &&
                              propertyDocument.numberOfBalcony !== 0 && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/balcony.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Balcony</h6>
                                    <h5>{propertyDocument.numberOfBalcony}</h5>
                                  </div>
                                </div>
                              )}
                            {/* Kitchen  */}
                            {propertyDocument.category === "Residential" && (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/kitchen.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Kitchen</h6>
                                  {/* <h5>{propertyDocument.numberOfKitchen}</h5> */}
                                  <h5>Yes</h5>
                                </div>
                              </div>
                            )}

                            {/* Living Area  */}
                            {propertyDocument &&
                              propertyDocument.category === "Residential" &&
                              propertyDocument.livingArea && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/livingArea.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Living Area</h6>
                                    <h5>{propertyDocument.livingArea}</h5>
                                  </div>
                                </div>
                              )}
                            {/* Dining  Area  */}
                            {propertyDocument &&
                              propertyDocument.category === "Residential" &&
                              propertyDocument.diningArea && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/diningArea.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Dining Area</h6>
                                    <h5>{propertyDocument.diningArea}</h5>
                                  </div>
                                </div>
                              )}
                            {/* Living Area And Dining Area Combine  */}
                            {propertyDocument &&
                              propertyDocument.category === "Residential" &&
                              propertyDocument.livingAndDining.toLowerCase() ===
                                "yes" && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/livingDining.png"
                                      alt="propdial"
                                    />
                                  </div>

                                  <div className="pis_content">
                                    <h6>Living & Dining:</h6>
                                    <h5>{propertyDocument.livingAndDining}</h5>
                                  </div>
                                </div>
                              )}
                            {/* Number Of Basment  */}
                            {/* {propertyDocument.numberOfBasement !== "0" && (
                 <div className="p_info_single">
                   <div className="pd_icon">
                     <img
                       src="/assets/img/property-detail-icon/calendar.png"
                       alt="propdial"
                     />
                   </div>
                   <div className="pis_content">
                     <h6>Basement</h6>
                     <h5>{propertyDocument.numberOfBasement}</h5>
                   </div>
                 </div>
               )} */}
                            {/* Passage  */}
                            {propertyDocument &&
                              propertyDocument.category === "Residential" &&
                              propertyDocument.passage && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/passages.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Passage</h6>
                                    <h5>{propertyDocument.passage}</h5>
                                  </div>
                                </div>
                              )}
                            {/* Entrance Gallery  */}
                            {propertyDocument &&
                              propertyDocument.category === "Residential" &&
                              propertyDocument.entranceGallery && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/browser.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Entrance Gallery</h6>
                                    <h5>{propertyDocument.entranceGallery}</h5>
                                  </div>
                                </div>
                              )}
                            {/* Year Of Consturction  */}
                            {propertyDocument &&
                              propertyDocument.yearOfConstruction && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/yearOfConstruction.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Year of Constuction</h6>
                                    <h5>
                                      {propertyDocument.yearOfConstruction}
                                    </h5>
                                  </div>
                                </div>
                              )}
                            {/* Age of Property  */}
                            {propertyDocument &&
                              propertyDocument.yearOfConstruction && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/ageOfproperty.png"
                                      alt="propdial"
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
                              )}
                            {/* lock in period  */}
                            {propertyDocument &&
                              propertyDocument.lockinPeriod && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/expire.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Lock in period</h6>
                                    <h5>{propertyDocument.lockinPeriod}</h5>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Rooms for commercial  */}
                  {propertyDocument &&
                    propertyDocument.category === "Commercial" && (
                      <div className="property_card_single mobile_full_card">
                        <div className="more_detail_card_inner">
                          <h2 className="card_title">Rooms</h2>
                          <div className="p_info">
                            {/* Workstations  */}
                            {propertyDocument &&
                              propertyDocument.numberOfWorkstations && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/workstation.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Workstations</h6>
                                    <h5>
                                      {propertyDocument.numberOfWorkstations}
                                    </h5>
                                  </div>
                                </div>
                              )}

                            {/* Cabins  */}
                            {propertyDocument &&
                              propertyDocument.numberOfCabins && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/cabin.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Cabins</h6>
                                    <h5>{propertyDocument.numberOfCabins}</h5>
                                  </div>
                                </div>
                              )}

                            {/* Meeting Rooms  */}
                            {propertyDocument &&
                              propertyDocument.numberOfMeetingRooms && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/conversation.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Meeting Rooms</h6>
                                    <h5>
                                      {propertyDocument.numberOfMeetingRooms}
                                    </h5>
                                  </div>
                                </div>
                              )}

                            {/* Reception Area?  */}
                            {propertyDocument &&
                              propertyDocument.isReceptionArea &&
                              propertyDocument.propertyType === "Office" && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/information-desk.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Reception Area?</h6>
                                    <h5>{propertyDocument.isReceptionArea}</h5>
                                  </div>
                                </div>
                              )}

                            {/* Pantry/Cafeteria  */}
                            {propertyDocument &&
                              propertyDocument.pantryCafeteria &&
                              (propertyDocument.propertyType === "Retail" ||
                                propertyDocument.propertyType === "Office") && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/cafetaria.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Pantry/Cafeteria</h6>
                                    <h5>{propertyDocument.pantryCafeteria}</h5>
                                  </div>
                                </div>
                              )}

                            {/* Washrooms  */}
                            {propertyDocument &&
                              propertyDocument.washrooms &&
                              propertyDocument.propertyType !== "Land" && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/washroom.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Washrooms</h6>
                                    <h5>{propertyDocument.washrooms}</h5>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Property Detail for commercial  */}
                  {propertyDocument &&
                    propertyDocument.category === "Commercial" && (
                      <div className="property_card_single mobile_full_card">
                        <div className="more_detail_card_inner">
                          <h2 className="card_title">Property Detail</h2>
                          <div className="p_info">
                            {/* property type  */}
                            {propertyDocument &&
                              propertyDocument.propertyType && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/propertytype.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Property Type</h6>
                                    <h5>{propertyDocument.propertyType}</h5>
                                  </div>
                                </div>
                              )}
                            {/* property sub type  */}
                            {propertyDocument &&
                              propertyDocument.additionalRooms && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/propertysubtype.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Property Sub-Type</h6>
                                    <h5>
                                      {propertyDocument.additionalRooms[0]}
                                    </h5>
                                  </div>
                                </div>
                              )}

                            {/* Property Readiness  */}
                            {propertyDocument &&
                              propertyDocument.readiness &&
                              propertyDocument.propertyType !== "Land" &&
                              propertyDocument.propertyType !== "Other" && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/construction.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Property Readiness</h6>
                                    <h5>{propertyDocument.readiness}</h5>
                                  </div>
                                </div>
                              )}

                            {/* Is Centrally Airconditioned?  */}
                            {propertyDocument &&
                              propertyDocument.isCentrallyAirconditioned &&
                              (propertyDocument.propertyType === "Retail" ||
                                propertyDocument.propertyType === "Office") && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/air.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Is Centrally Airconditioned?</h6>
                                    <h5>
                                      {
                                        propertyDocument.isCentrallyAirconditioned
                                      }
                                    </h5>
                                  </div>
                                </div>
                              )}

                            {/* Furnishing */}
                            {propertyDocument &&
                              propertyDocument.propertyType.toLowerCase() !==
                                "land" &&
                              propertyDocument.propertyType.toLowerCase() !==
                                "other" &&
                              propertyDocument.furnishing && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/furnishing.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Furnishing</h6>
                                    <h5>
                                      {propertyDocument.furnishing.toLowerCase() ===
                                      "raw"
                                        ? "Unfurnished"
                                        : propertyDocument.furnishing}
                                    </h5>
                                  </div>
                                </div>
                              )}

                            {/* Rooms   */}
                            {/* {propertyDocument &&
                     propertyDocument.propertyType.toLowerCase() !==
                       "land" &&
                     propertyDocument.propertyType.toLowerCase() !==
                       "other" && (
                       <div className="p_info_single">
                         <div className="pd_icon">
                           <img
                             src="/assets/img/property-detail-icon/bedrooms.png"
                             alt="propdial"
                           />
                         </div>
                         <div className="pis_content">
                           <h6>Rooms</h6>
                           <h5>
                             {propertyDocument.numberOfBedrooms === 0 ||
                             propertyDocument.numberOfBedrooms === "0"
                               ? "No"
                               : propertyDocument.numberOfBedrooms}
                           </h5>
                          
                         </div>
                       </div>
                     )} */}

                            {/* Toilet   */}
                            {/* {propertyDocument &&
                     propertyDocument.propertyType.toLowerCase() !==
                       "land" &&
                     propertyDocument.propertyType.toLowerCase() !==
                       "other" && (
                       <div className="p_info_single">
                         <div className="pd_icon">
                           <img
                             src="/assets/img/property-detail-icon/public-toilet.png"
                             alt="propdial"
                           />
                         </div>
                         <div className="pis_content">
                           <h6>Toilet</h6>
                           <h5>
                             {propertyDocument.numberOfBathrooms === 0 ||
                             propertyDocument.numberOfBathrooms === "0"
                               ? "No"
                               : propertyDocument.numberOfBathrooms}
                           </h5>
                          
                         </div>
                       </div>
                     )} */}

                            {/* Kitchen  */}
                            {/* {propertyDocument &&
                     propertyDocument.propertyType.toLowerCase() !==
                       "land" &&
                     propertyDocument.propertyType.toLowerCase() !==
                       "other" && (
                       <div className="p_info_single">
                         <div className="pd_icon">
                           <img
                             src="/assets/img/property-detail-icon/kitchen.png"
                             alt="propdial"
                           />
                         </div>
                         <div className="pis_content">
                           <h6>Kitchen</h6>
                           <h5>
                             {propertyDocument.numberOfKitchen === 0 ||
                             propertyDocument.numberOfKitchen === "0"
                               ? "No"
                               : propertyDocument.numberOfKitchen}
                           </h5>
                          
                         </div>
                       </div>
                     )} */}

                            {/* Balcony  */}
                            {propertyDocument &&
                              propertyDocument.numberOfBalcony !== 0 &&
                              propertyDocument.propertyType.toLowerCase() !==
                                "land" &&
                              propertyDocument.propertyType.toLowerCase() !==
                                "other" && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/balcony.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Balcony</h6>

                                    <h5>
                                      {propertyDocument.numberOfBalcony === 0 ||
                                      propertyDocument.numberOfBalcony === "0"
                                        ? "No"
                                        : propertyDocument.numberOfBalcony}
                                    </h5>
                                  </div>
                                </div>
                              )}

                            {/* Balcony facing  */}
                            {propertyDocument &&
                              (propertyDocument.numberOfBalcony !== 0 ||
                                propertyDocument.numberOfBalcony !== "0") &&
                              propertyDocument.balconyFacing &&
                              propertyDocument.propertyType.toLowerCase() !==
                                "land" &&
                              propertyDocument.propertyType.toLowerCase() !==
                                "other" && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/balcony_windowsFacing.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>
                                      Balcony({propertyDocument.numberOfBalcony}
                                      ) Facing
                                    </h6>
                                    <h5>
                                      {propertyDocument.balconyFacing
                                        ? propertyDocument.balconyFacing.join(
                                            ", "
                                          )
                                        : ""}
                                    </h5>
                                  </div>
                                </div>
                              )}

                            {/* Main Door Facing  */}
                            {propertyDocument &&
                              propertyDocument.mainDoorFacing && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/mainDoorFacing.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Direction Facing</h6>
                                    <h5>{propertyDocument.mainDoorFacing}</h5>
                                  </div>
                                </div>
                              )}

                            {/* Year Of Consturction  */}
                            {propertyDocument &&
                              propertyDocument.yearOfConstruction && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/yearOfConstruction.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Year of Constuction</h6>
                                    <h5>
                                      {propertyDocument.yearOfConstruction}
                                    </h5>
                                  </div>
                                </div>
                              )}
                            {/* Age of Property  */}
                            {propertyDocument &&
                              propertyDocument.yearOfConstruction && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/ageOfproperty.png"
                                      alt="propdial"
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
                              )}
                            {/* Gated Complex?  */}
                            {propertyDocument && propertyDocument.gatedArea && (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/expire.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Gated Complex?</h6>
                                  <h5>{propertyDocument.gatedArea}</h5>
                                </div>
                              </div>
                            )}

                            {/* Pre-leased?  */}
                            {propertyDocument &&
                              propertyDocument.isPreleased && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/expire.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Pre-leased?</h6>
                                    <h5>{propertyDocument.isPreleased}</h5>
                                  </div>
                                </div>
                              )}

                            {/* lock in period  */}
                            {propertyDocument &&
                              propertyDocument.lockinPeriod && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/expire.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Lock in period</h6>
                                    <h5>{propertyDocument.lockinPeriod}</h5>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Property Detail for plot  */}
                  {propertyDocument && propertyDocument.category === "Plot" && (
                    <div className="property_card_single mobile_full_card">
                      <div className="more_detail_card_inner">
                        <h2 className="card_title">Property Detail</h2>
                        <div className="p_info">
                          {/* property type  */}
                          {propertyDocument &&
                            propertyDocument.propertyType && (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/propertytype.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Property Type</h6>
                                  <h5>{propertyDocument.propertyType}</h5>
                                </div>
                              </div>
                            )}

                          {/* is corner  */}
                          {propertyDocument &&
                            propertyDocument.isCornerSidePlot && (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/corner.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Is corner?</h6>
                                  <h5>{propertyDocument.isCornerSidePlot}</h5>
                                </div>
                              </div>
                            )}

                          {/* is park facing  */}
                          {propertyDocument &&
                            propertyDocument.isParkFacingPlot && (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/park.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Is Park Facing?</h6>
                                  <h5>{propertyDocument.isParkFacingPlot}</h5>
                                </div>
                              </div>
                            )}

                          {/* Road Width  */}
                          {propertyDocument && propertyDocument.roadWidth && (
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/road.png"
                                  alt="propdial"
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Road Width</h6>
                                <h5>
                                  {propertyDocument.roadWidth}{" "}
                                  {propertyDocument.roadWidthUnit}
                                </h5>
                              </div>
                            </div>
                          )}

                          {/* Gated Community  */}
                          {propertyDocument && propertyDocument.gatedArea && (
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/gatedcomunity.png"
                                  alt="propdial"
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Gated Community</h6>
                                <h5>{propertyDocument.gatedArea}</h5>
                              </div>
                            </div>
                          )}

                          {/* Main Door Facing  */}
                          {propertyDocument &&
                            propertyDocument.mainDoorFacing && (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/mainDoorFacing.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Direction Facing</h6>
                                  <h5>{propertyDocument.mainDoorFacing}</h5>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )}

                  {propertyDocument && (
                    <div className="property_card_single mobile_full_card">
                      <div className="more_detail_card_inner">
                        <h2 className="card_title">Property Address</h2>
                        <div className="p_info">
                          {user &&
                            user.status === "active" &&
                            (user.role === "superAdmin" ||
                              user.role === "admin" ||
                              isPropertyManager ||
                              isPropertyOwner) && (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/unitnumber.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Unit Number</h6>
                                  <h5>{propertyDocument.unitNumber}</h5>
                                </div>
                              </div>
                            )}
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/society.png"
                                alt="propdial"
                              />
                            </div>
                            <div className="pis_content">
                              <h6>Society</h6>
                              <h5> {propertyDocument.society}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/locality.png"
                                alt="propdial"
                              />
                            </div>
                            <div className="pis_content">
                              <h6>locality</h6>
                              <h5> {propertyDocument.locality}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/city.png"
                                alt="propdial"
                              />
                            </div>
                            <div className="pis_content">
                              <h6>city</h6>
                              <h5> {propertyDocument.city}</h5>
                            </div>
                          </div>
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/state.png"
                                alt="propdial"
                              />
                            </div>
                            <div className="pis_content">
                              <h6>state</h6>
                              <h5> {propertyDocument.state}</h5>
                            </div>
                          </div>
                          {propertyDocument.pincode && (
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/pincode.png"
                                  alt="propdial"
                                />
                              </div>
                              <div className="pis_content">
                                <h6>Pincode</h6>
                                <h5> {propertyDocument.pincode}</h5>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* <div className="row">
               <div
                 className={
                   propertyDocument.propertyGoogleMap
                     ? "col-md-11 col-2"
                     : "col-12"
                 }
               >
                
               </div>
               {propertyDocument &&
                 propertyDocument.propertyGoogleMap && (
                   <div className="col-md-1 col-2">
                     <Link
                       to={
                         propertyDocument &&
                         propertyDocument.propertyGoogleMap
                       }
                       className="google_map"
                     >
                       <img
                         src="/assets/img/icons/googlemap_big.png"
                         alt="propdial"
                         className="w-100"
                       />
                     </Link>
                   </div>
                 )}
             </div> */}
                    </div>
                  )}

                  {/*Overlooking for all category */}
                  {propertyDocument &&
                    propertyDocument.overLooking.length > 0 && (
                      <div className="property_card_single mobile_full_card">
                        <div className="more_detail_card_inner">
                          <h2 className="card_title">Facing and Overlooking</h2>
                          <div className="p_info">
                            {/* Main Door Facing  */}
                            {propertyDocument &&
                              propertyDocument.category === "Residential" &&
                              propertyDocument.mainDoorFacing && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/mainDoorFacing.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Main Door Facing</h6>
                                    <h5>{propertyDocument.mainDoorFacing}</h5>
                                  </div>
                                </div>
                              )}
                            {/* Balcony facing  */}
                            {propertyDocument &&
                              propertyDocument.category === "Residential" &&
                              propertyDocument.numberOfBalcony !== 0 &&
                              propertyDocument.balconyFacing && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/balcony_windowsFacing.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>
                                      Balcony({propertyDocument.numberOfBalcony}
                                      ) Facing
                                    </h6>
                                    <h5>
                                      {propertyDocument.balconyFacing
                                        ? propertyDocument.balconyFacing.join(
                                            ", "
                                          )
                                        : ""}
                                    </h5>
                                  </div>
                                </div>
                              )}
                            {propertyDocument.overLooking.map((item) => (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  {item === "Club" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/club.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Garden/Park" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/park.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Children Play Area" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/slide.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Open Gymnasium" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/weightlifter.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Main Road" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/road.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Society Internal Road" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/societyroad.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Swimming Pool" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/swimming.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Central Park" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/central-park.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Forest" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/forest.png"
                                      alt="propdial"
                                    />
                                  ) : item === "River" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/river.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Golf" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/golf.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Lake" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/lake.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Other Society" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/skyline.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Same Society Tower" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/singletower.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Beach" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/beach.png"
                                      alt="propdial"
                                    />
                                  ) : item === "Hill View" ? (
                                    <img
                                      src="/assets/img/property-detail-icon/hill.png"
                                      alt="propdial"
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

                  {/* Additional Rooms for residential */}
                  {propertyDocument &&
                    propertyDocument.category === "Residential" && (
                      <>
                        {propertyDocument &&
                          propertyDocument.additionalRooms.length > 0 && (
                            <div className="property_card_single mobile_full_card">
                              <div className="more_detail_card_inner">
                                <h2 className="card_title">Additional Rooms</h2>
                                <div className="p_info">
                                  {(() => {
                                    const servantRooms =
                                      propertyDocument.additionalRooms.filter(
                                        (item) =>
                                          item === "Servent Room 1" ||
                                          item === "Servent Room 2"
                                      );
                                    const otherRooms =
                                      propertyDocument.additionalRooms.filter(
                                        (item) =>
                                          item !== "Servent Room 1" &&
                                          item !== "Servent Room 2"
                                      );

                                    return (
                                      <>
                                        {servantRooms.length > 0 && (
                                          <div className="p_info_single">
                                            <div className="pd_icon">
                                              <img
                                                src="/assets/img/property-detail-icon/servantRoom.png"
                                                alt="Servant Room"
                                              />
                                            </div>
                                            <div className="pis_content">
                                              <h5>
                                                {servantRooms.length > 1
                                                  ? `Servant Room (${servantRooms.length})`
                                                  : "Servant Room"}
                                              </h5>
                                            </div>
                                          </div>
                                        )}

                                        {otherRooms.map((item) => (
                                          <div
                                            className="p_info_single"
                                            key={item}
                                          >
                                            <div className="pd_icon">
                                              {item === "Office Room" ? (
                                                <img
                                                  src="/assets/img/property-detail-icon/officeRoom.png"
                                                  alt="Office Room"
                                                />
                                              ) : item === "Store Room" ? (
                                                <img
                                                  src="/assets/img/property-detail-icon/storeRoom.png"
                                                  alt="Store Room"
                                                />
                                              ) : item === "Utility Room" ? (
                                                <img
                                                  src="/assets/img/property-detail-icon/utility-room.png"
                                                  alt="Utility Room"
                                                />
                                              ) : item === "Pooja Room" ? (
                                                <img
                                                  src="/assets/img/property-detail-icon/poojaRoom.png"
                                                  alt="Pooja Room"
                                                />
                                              ) : item === "Study Room" ? (
                                                <img
                                                  src="/assets/img/property-detail-icon/studyRoom.png"
                                                  alt="Study Room"
                                                />
                                              ) : item === "Power Room" ? (
                                                <img
                                                  src="/assets/img/property-detail-icon/powerRoom.png"
                                                  alt="Power Room"
                                                />
                                              ) : item === "Powder Room" ? (
                                                <img
                                                  src="/assets/img/property-detail-icon/powderroom.png"
                                                  alt="Power Room"
                                                />
                                              ) : item === "Basement" ? (
                                                <img
                                                  src="/assets/img/property-detail-icon/basement.png"
                                                  alt="Power Room"
                                                />
                                              ) : null}
                                            </div>
                                            <div className="pis_content">
                                              <h5>{item}</h5>
                                            </div>
                                          </div>
                                        ))}
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          )}
                      </>
                    )}

                  {/* Additional Area for residential */}
                  {propertyDocument &&
                    propertyDocument.category === "Residential" && (
                      <>
                        {propertyDocument &&
                          propertyDocument.additionalArea.length > 0 && (
                            <div className="property_card_single mobile_full_card">
                              <div className="more_detail_card_inner">
                                <h2 className="card_title">Additional Area</h2>
                                <div className="p_info">
                                  {propertyDocument.additionalArea.map(
                                    (item) => (
                                      <div className="p_info_single">
                                        <div className="pd_icon">
                                          {item === "Front Yard" ? (
                                            <img
                                              src="/assets/img/property-detail-icon/frontyard.png"
                                              alt="propdial"
                                            />
                                          ) : item === "Back Yard" ? (
                                            <img
                                              src="/assets/img/property-detail-icon/backyard.png"
                                              alt="propdial"
                                            />
                                          ) : item === "Terrace" ? (
                                            <img
                                              src="/assets/img/property-detail-icon/terrace.png"
                                              alt="propdial"
                                            />
                                          ) : item === "Private Garden" ? (
                                            <img
                                              src="/assets/img/property-detail-icon/privateGarden.png"
                                              alt="propdial"
                                            />
                                          ) : item === "Garage" ? (
                                            <img
                                              src="/assets/img/property-detail-icon/garage.png"
                                              alt="propdial"
                                            />
                                          ) : item === "Roof Rights" ? (
                                            <img
                                              src="/assets/img/property-detail-icon/roofing.png"
                                              alt="propdial"
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
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                      </>
                    )}

                  {/* Property Size for all category */}

                  <div className="property_card_single mobile_full_card">
                    <div className="more_detail_card_inner">
                      <h2 className="card_title">Property Size</h2>
                      <div className="p_info">
                        {/* Plot Area  */}
                        {propertyDocument && propertyDocument.plotArea && (
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/calendar.png"
                                alt="propdial"
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
                        {/* Super Area  */}
                        {propertyDocument && propertyDocument.superArea && (
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/superArea.png"
                                alt="propdial"
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
                        {/* Built-Up Area  */}
                        {propertyDocument && propertyDocument.builtUpArea && (
                          <div className="p_info_single">
                            <div className="pd_icon">
                              <img
                                src="/assets/img/property-detail-icon/buildUpArea.png"
                                alt="propdial"
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
                        {/* Carpet Area  */}
                        {propertyDocument &&
                          propertyDocument.carpetArea !== "0" &&
                          propertyDocument.carpetArea && (
                            <div className="p_info_single">
                              <div className="pd_icon">
                                <img
                                  src="/assets/img/property-detail-icon/carpetArea.png"
                                  alt="propdial"
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

                  {/* Parking for category residential  */}
                  {propertyDocument &&
                    propertyDocument.category === "Residential" && (
                      <div className="property_card_single mobile_full_card">
                        <div className="more_detail_card_inner">
                          <h2 className="card_title">Parking</h2>
                          <div className="p_info">
                            {/* Covered Parking  */}
                            {(propertyDocument &&
                              propertyDocument.numberOfCoveredCarParking ===
                                0) ||
                            propertyDocument.numberOfCoveredCarParking ===
                              "0" ? (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/car-parking.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Covered Car Parking</h6>
                                  <h5>No</h5>
                                </div>
                              </div>
                            ) : (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/car-parking.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Covered Car Parking</h6>
                                  <h5>
                                    {propertyDocument.numberOfCoveredCarParking}
                                  </h5>
                                </div>
                              </div>
                            )}
                            {/* Open car parking  */}
                            {(propertyDocument &&
                              propertyDocument.numberOfOpenCarParking === 0) ||
                            propertyDocument.numberOfOpenCarParking === "0" ? (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/car-parking.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Open Car Parking</h6>
                                  <h5>No</h5>
                                </div>
                              </div>
                            ) : (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/car-parking.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Open Car Parking</h6>
                                  <h5>
                                    {propertyDocument.numberOfOpenCarParking}
                                  </h5>
                                </div>
                              </div>
                            )}
                            {/* 2 Wheeler Parking  */}
                            {propertyDocument &&
                              propertyDocument.twoWheelarParking && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/2Wheelerparking.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>2 Wheeler Parking</h6>
                                    <h5>
                                      {propertyDocument.twoWheelarParking}
                                    </h5>
                                  </div>
                                </div>
                              )}
                            {/* Electric Vehicle Charging Point  */}
                            {propertyDocument &&
                              propertyDocument.evChargingPointStatus &&
                              propertyDocument.evChargingPointStatus.toLowerCase() ===
                                "yes" && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/2Wheelerparking.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>EV Charging Point</h6>
                                    <h5>
                                      {propertyDocument.evChargingPointStatus +
                                        ", " +
                                        propertyDocument.evChargingPointType}
                                    </h5>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Parking for category commercial  */}
                  {propertyDocument &&
                    propertyDocument.category === "Commercial" &&
                    (propertyDocument.propertyType.toLowerCase() !== "land" ||
                      propertyDocument.propertyType.toLowerCase() !==
                        "other") && (
                      <div className="property_card_single mobile_full_card">
                        <div className="more_detail_card_inner">
                          <h2 className="card_title">Parking</h2>
                          <div className="p_info">
                            {/* Covered Parking  */}
                            {(propertyDocument &&
                              propertyDocument.numberOfCoveredCarParking ===
                                0) ||
                            propertyDocument.numberOfCoveredCarParking ===
                              "0" ? (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/car-parking.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Covered Car Parking</h6>
                                  <h5>No</h5>
                                </div>
                              </div>
                            ) : (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/car-parking.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Covered Car Parking</h6>
                                  <h5>
                                    {propertyDocument.numberOfCoveredCarParking}
                                  </h5>
                                </div>
                              </div>
                            )}
                            {/* Open car parking  */}
                            {(propertyDocument &&
                              propertyDocument.numberOfOpenCarParking === 0) ||
                            propertyDocument.numberOfOpenCarParking === "0" ? (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/car-parking.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Open Car Parking</h6>
                                  <h5>No</h5>
                                </div>
                              </div>
                            ) : (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/car-parking.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Open Car Parking</h6>
                                  <h5>
                                    {propertyDocument.numberOfOpenCarParking}
                                  </h5>
                                </div>
                              </div>
                            )}
                            {/* 2 Wheeler Parking  */}
                            {propertyDocument &&
                              propertyDocument.twoWheelarParking && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/2Wheelerparking.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>2 Wheeler Parking</h6>
                                    <h5>
                                      {propertyDocument.twoWheelarParking}
                                    </h5>
                                  </div>
                                </div>
                              )}
                            {/* Electric Vehicle Charging Point  */}
                            {propertyDocument &&
                              propertyDocument.evChargingPointStatus &&
                              propertyDocument.evChargingPointStatus.toLowerCase() ===
                                "yes" && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/2Wheelerparking.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>EV Charging Point</h6>
                                    <h5>
                                      {propertyDocument.evChargingPointStatus +
                                        ", " +
                                        propertyDocument.evChargingPointType}
                                    </h5>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Building for category residential  */}
                  {propertyDocument &&
                    propertyDocument.category === "Residential" && (
                      <div className="property_card_single mobile_full_card">
                        <div className="more_detail_card_inner">
                          <h2 className="card_title">Building</h2>
                          <div className="p_info">
                            {/* Total Number Of Floors  */}
                            {propertyDocument &&
                              propertyDocument.numberOfFloors && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/TotalFloors.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Total Floors</h6>
                                    <h5>{propertyDocument.numberOfFloors}</h5>
                                  </div>
                                </div>
                              )}
                            {/* Floor No  */}
                            {propertyDocument && propertyDocument.floorNo && (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/FloorNumber.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Floor Number</h6>
                                  <h5>{propertyDocument.floorNo}</h5>
                                </div>
                              </div>
                            )}
                            {/* Number of flats on floor  */}
                            {propertyDocument &&
                              propertyDocument.numberOfFlatsOnFloor && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/apartmentOnFloor.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Number of Flats on a Floor</h6>
                                    <h5>
                                      {propertyDocument.numberOfFlatsOnFloor}
                                    </h5>
                                  </div>
                                </div>
                              )}
                            {/* number of lifts  */}
                            {propertyDocument &&
                            propertyDocument.numberOfLifts == 0 ? (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/lift.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Lift</h6>
                                  <h5>No</h5>
                                </div>
                              </div>
                            ) : (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/lift.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Lift</h6>
                                  <h5>{propertyDocument.numberOfLifts}</h5>
                                </div>
                              </div>
                            )}
                            {/* Power Backup  */}
                            {propertyDocument &&
                              propertyDocument.powerBackup && (
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/PowerBackup.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Power Backup</h6>
                                    <h5>{propertyDocument.powerBackup}</h5>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Building for category commercial  */}
                  {propertyDocument &&
                    propertyDocument.category === "Commercial" &&
                    (propertyDocument.propertyType.toLowerCase() !== "land" ||
                      propertyDocument.propertyType.toLowerCase() !==
                        "other") && (
                      <div className="property_card_single mobile_full_card">
                        <div className="more_detail_card_inner">
                          <h2 className="card_title">Building</h2>
                          <div className="p_info">
                            {/* number of lifts  */}
                            {propertyDocument &&
                            propertyDocument.numberOfLifts == 0 ? (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/lift.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Lift</h6>
                                  <h5>No</h5>
                                </div>
                              </div>
                            ) : (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/lift.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Lift</h6>
                                  <h5>{propertyDocument.numberOfLifts}</h5>
                                </div>
                              </div>
                            )}
                            {/* Power Backup  */}
                            {propertyDocument && (
                              <div className="p_info_single">
                                <div className="pd_icon">
                                  <img
                                    src="/assets/img/property-detail-icon/PowerBackup.png"
                                    alt="propdial"
                                  />
                                </div>
                                <div className="pis_content">
                                  <h6>Power Backup</h6>
                                  <h5>
                                    {propertyDocument.powerBackup ||
                                      "Yet to be added"}
                                  </h5>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  {/* Additional Info only for category residential  */}
                  {propertyDocument &&
                    propertyDocument.category === "Residential" && (
                      <>
                        {propertyDocument.purpose.toLowerCase() !== "sale" && (
                          <div className="property_card_single mobile_full_card">
                            <div className="more_detail_card_inner">
                              <h2 className="card_title">Additional Info</h2>
                              <div className="p_info">
                                {/* Bachelor Boys Allowed  */}
                                {propertyDocument &&
                                  propertyDocument.bachlorsBoysAllowed && (
                                    <div className="p_info_single">
                                      <div className="pd_icon">
                                        <img
                                          src="/assets/img/property-detail-icon/BachelorBoys.png"
                                          alt="propdial"
                                        />
                                      </div>
                                      <div className="pis_content">
                                        <h6>Bachelor Boys Allowed</h6>
                                        <h5>
                                          {propertyDocument.bachlorsBoysAllowed}
                                        </h5>
                                      </div>
                                    </div>
                                  )}
                                {/* Bachelor Girls Allowed  */}
                                {propertyDocument &&
                                  propertyDocument.bachlorsGirlsAllowed && (
                                    <div className="p_info_single">
                                      <div className="pd_icon">
                                        <img
                                          src="/assets/img/property-detail-icon/BachelorGirls.png"
                                          alt="propdial"
                                        />
                                      </div>
                                      <div className="pis_content">
                                        <h6>Bachelor Girls Allowed</h6>
                                        <h5>
                                          {
                                            propertyDocument.bachlorsGirlsAllowed
                                          }
                                        </h5>
                                      </div>
                                    </div>
                                  )}
                                {/* Pets Allowed  */}
                                {propertyDocument &&
                                  propertyDocument.petsAllowed && (
                                    <div className="p_info_single">
                                      <div className="pd_icon">
                                        <img
                                          src="/assets/img/property-detail-icon/pets.png"
                                          alt="propdial"
                                        />
                                      </div>
                                      <div className="pis_content">
                                        <h6>Pets Allowed</h6>
                                        <h5>{propertyDocument.petsAllowed}</h5>
                                      </div>
                                    </div>
                                  )}
                                {/* Food Habit  */}
                                <div className="p_info_single">
                                  <div className="pd_icon">
                                    <img
                                      src="/assets/img/property-detail-icon/restaurant.png"
                                      alt="propdial"
                                    />
                                  </div>
                                  <div className="pis_content">
                                    <h6>Food Habit</h6>
                                    <h5>
                                      {propertyDocument.vegNonVeg === "Veg"
                                        ? "Vegetarian"
                                        : "No-Restrictions"}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                  {/* visiting detail for all category */}
                  <div className="property_card_single mobile_full_card">
                    <div className="more_detail_card_inner">
                      <h2 className="card_title">Visiting Details</h2>
                      <div className="p_info">
                        <div className="p_info_single ">
                          <div className="pd_icon">
                            <img
                              src="/assets/img/property-detail-icon/VisitingHrsFrom.png"
                              alt="propdial"
                            />
                          </div>
                          <div className="pis_content">
                            <h6>Visiting Hours</h6>
                            {/* <h5>
                     {propertyDocument.visitingHrsFrom &&
                       format(
                         new Date(propertyDocument.visitingHrsFrom),
                         "hh:mm aa"
                       )}{" "}
                     {propertyDocument.visitingHrsTo && "to"}{" "}
                     {propertyDocument.visitingHrsTo &&
                       format(
                         new Date(propertyDocument.visitingHrsTo),
                         "hh:mm aa"
                       )}
                   </h5> */}
                            {/* <h5>
                     {propertyDocument.visitingHrsFrom}
                     {propertyDocument.visitingHrsTo && " to"}{" "}
                     {propertyDocument.visitingHrsTo}
                   </h5> */}
                            <h5>
                              {propertyDocument.visitingHrsFrom &&
                                new Date(
                                  `1970-01-01T${propertyDocument.visitingHrsFrom}:00+05:30`
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}{" "}
                              {propertyDocument.visitingHrsTo &&
                                `to ${new Date(
                                  `1970-01-01T${propertyDocument.visitingHrsTo}:00+05:30`
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}`}
                            </h5>
                          </div>
                        </div>
                        <div className="p_info_single visiting_days">
                          <div className="pd_icon">
                            <img
                              src="/assets/img/property-detail-icon/VisitingDays.png"
                              alt="propdial"
                            />
                          </div>
                          <div className="pis_content">
                            <h6>Visiting Days</h6>
                            <h5>{propertyDocument.visitingDays.join(", ")}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Property Description for all category   */}
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="property_card_single mobile_full_card">
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
                                  className="theme_btn btn_border no_icon"
                                  onClick={handleCancelPropDesc}
                                  style={{
                                    width: "fit-content",
                                  }}
                                >
                                  Cancel
                                </div>
                                <div
                                  className="theme_btn btn_fill no_icon"
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
                                  user.status === "active" &&
                                  (user.role === "owner" ||
                                    user.role === "admin" ||
                                    user.role === "superAdmin") && (
                                    <span
                                      className="material-symbols-outlined click_icon text_near_icon"
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
                    {/* Owner Instruction  */}
                    {user &&
                      user.status === "active" &&
                      user.role !== "guest" && (
                        <div className="col-lg-6">
                          <div className="property_card_single mobile_full_card">
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
                                      className="theme_btn btn_border no_icon"
                                      onClick={handleCancelOwnerInstruction}
                                      style={{
                                        width: "fit-content",
                                      }}
                                    >
                                      Cancel
                                    </div>
                                    <div
                                      className="theme_btn btn_fill no_icon "
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
                                      user.status === "active" &&
                                      (user.role === "admin" ||
                                        user.role === "superAdmin") && (
                                        <span
                                          className="material-symbols-outlined click_icon text_near_icon"
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
                      )}
                  </div>
                </div>
              )}

              {/* {(user && user.status === "active" && user.role === "owner") ||
       (user && user.status === "active" && (user.role === "admin" || user.role === "superAdmin") && (
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
                             alt="propdial"
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
       ))} */}
            </div>
            <Modal
              show={showLayoutAlert}
              onHide={closeLayoutAlertModal}
              centered
            >
              <Modal.Header
                className="justify-content-center"
                style={{ paddingBottom: 0, border: "none" }}
              >
                <h5>Action Required!</h5>
              </Modal.Header>
              <Modal.Body
                className="text-center"
                style={{
                  color: "#FA6262",
                  fontSize: "20px",
                  border: "none",
                }}
              >
                {getAlertMessage()}
              </Modal.Body>
              <Modal.Footer
                className="d-flex justify-content-center"
                style={{
                  border: "none",
                  gap: "15px",
                }}
              >
                <div className="done_btn" onClick={closeLayoutAlertModal}>
                  OKAY
                </div>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      ) : (
        <div className="page_loader">
          <ClipLoader color="var(--theme-green2)" loading={true} />
        </div>
      )}
    </>
  );
};

export default PropertyDetails;
