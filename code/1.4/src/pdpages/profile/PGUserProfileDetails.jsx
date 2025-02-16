import React, { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useCommon } from "../../hooks/useCommon";
import { useFirestore } from "../../hooks/useFirestore";
import { format } from "date-fns";
import { BeatLoader } from "react-spinners";
import { projectStorage } from "../../firebase/config";
import PhoneInput from "react-phone-input-2";
import { useCollection } from "../../hooks/useCollection";
import { projectFirestore } from "../../firebase/config";

// import scss
import "./PGUserProfileDetails.scss";
import PropertyDetails from "../../components/property/PropertyDetails";

export default function PGUserProfileDetails2() {
  const { userProfileId } = useParams();
  const { camelCase } = useCommon();
  const { user } = useAuthContext();

  // get and update code start
  const { document: userProfileDoc, error: userProfileDocError } = useDocument(
    "users-propdial",
    userProfileId
  );

  // console.log("userProfileDoc: ", userProfileDoc)

  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("users-propdial");
  // get and update code end

  // get user
  const { documents: dbUsers, error: dbuserserror } =
    useCollection("users-propdial");
  const [dbUserState, setdbUserState] = useState(dbUsers);

  //Master Data Loading Initialisation - Start
  const { documents: masterCountry, error: masterCountryerror } = useCollection(
    "m_countries",
    "",
    ["country", "asc"]
  );

  const { documents: masterCity, error: masterCityError } = useCollection(
    "m_cities",
    ["status", "==", "active"],
    ["city", "asc"]
  );

  const [selectedAmLevel, setSelectedAmLevel] = useState("country");
  const handleAmRadioChange = (e) => {
    setSelectedAmLevel(e.target.value);
  };
  const [country, setCountry] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [locality, setLocality] = useState();
  const [society, setSociety] = useState();

  let countryOptions = useRef([]);
  let stateOptions = useRef([]);
  let cityOptions = useRef([]);
  let localityOptions = useRef([]);
  let societyOptions = useRef([]);

  useEffect(() => {
    // console.log('in useeffect')
    if (masterCountry) {
      countryOptions.current = masterCountry.map((countryData) => ({
        label: countryData.country,
        value: countryData.id,
      }));
    }

    if (masterCity) {
      cityOptions.current = masterCity.map((cityData) => ({
        label: cityData.city,
        value: cityData.id,
      }));
    }
    // console.log('userProfileDoc.propertiesOwnedInCities', userProfileDoc.propertiesOwnedInCities)
    setCity(
      userProfileDoc && userProfileDoc.propertiesOwnedInCities
        ? userProfileDoc.propertiesOwnedInCities
        : []
    );

    // handleCountryChange({ label: "INDIA", value: "_india" })
    // filteredDataNew({ label: "Andaman & Nicobar Islands", value: "_andaman_&_nicobar_islands" })
  }, [masterCountry, userProfileDoc]);

  // Populate Master Data - Start
  //Country select onchange
  const handleCountryChange = async (option) => {
    setCountry(option);
    // let countryname = option.label;
    // console.log('handleCountryChange option:', option)
    // const countryid = masterCountry && masterCountry.find((e) => e.country === countryname).id
    // console.log('countryid:', countryid)
    const ref = await projectFirestore
      .collection("m_states")
      .where("country", "==", option.value)
      .orderBy("state", "asc");
    ref.onSnapshot(
      async (snapshot) => {
        if (snapshot.docs) {
          stateOptions.current = snapshot.docs.map((stateData) => ({
            label: stateData.data().state,
            value: stateData.id,
          }));
          if (stateOptions.current.length === 0) {
            console.log("No State");
            handleStateChange(null);
          } else {
            handleStateChange({
              label: stateOptions.current[0].label,
              value: stateOptions.current[0].value,
            });
            // handleStateChange()
          }
        } else {
          // setError('No such document exists')
        }
      },
      (err) => {
        console.log(err.message);
        // setError('failed to get document')
      }
    );
  };

  //Stae select onchange
  const handleStateChange = async (option) => {
    setState(option);
    // console.log('state.id:', option.value)
  };

  // Populate Master Data - Ends

  //Stae select onchange
  const handleCityChange = async (option) => {
    setCity(option);
    // console.log('state.id:', option.value)
  };

  // handleSavePropertyOwnedInCities
  const handleSavePropertyOwnedInCities = async () => {
    console.log("selected cities", city);
    const updatedData = {
      propertiesOwnedInCities: city,
    };

    // console.log("updatedData: ", updatedData);

    try {
      await updateDocument(userProfileId, updatedData);
    } catch (error) {
      console.error("Error updating details:", error);
    } finally {
    }
  };

  // Save Access Mgmt details
  const handleSaveAccessMgmt = async () => {
    console.log("selected country", country);
    console.log("selected state", state);

    const updatedData = {
      accessType: "state",
      accessValue: state,
    };

    console.log("updatedData: ", updatedData);

    try {
      // const updatedData = {
      //   ...userProfileDoc,
      //   bankDetail: bankDetailFormData,
      // };

      await updateDocument(userProfileId, updatedData);
    } catch (error) {
      console.error("Error updating details:", error);
    } finally {
    }
  };

  useEffect(() => {
    setdbUserState(dbUsers);
  }, [dbUsers]);

  // code for active inactive start
  // Make sure that userProfileDoc is not null before using it
  const [status, setStatus] = useState(userProfileDoc?.status || "active");
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [reason, setReason] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle status changes (active/inactive)
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setShowPopup(true);
    setPopupData({ status: newStatus });
  };

  // Add a state to track the error message
  const [errorForNoSelectReasonMessage, setErrorForNoSelectReasonMessage] =
    useState("");

  // Function to handle the submission of the status change
  const handlePopupSubmit = async () => {
    // Check if a reason is selected when the status is inactive
    if (popupData.status === "inactive" && !reason) {
      setErrorForNoSelectReasonMessage(
        "Please select a reason before updating the status."
      );
      return; // Don't proceed if no reason is selected
    } else {
      setErrorForNoSelectReasonMessage(""); // Clear error message when a reason is selected
    }

    setLoading(true);
    try {
      const currentDate = new Date();

      const updateData = {
        status: popupData.status,
        activeBy: popupData.status === "active" ? user.uid : null, // replace with your logic
        activeAt: popupData.status === "active" ? currentDate : null, // replace with your logic
        inactiveBy: popupData.status === "inactive" ? user.uid : null,
        inactiveAt: popupData.status === "inactive" ? currentDate : null,
        inactiveReason: popupData.status === "inactive" ? reason : null, // Add reason here
        inactiveRemark: popupData.status === "inactive" ? remark : null, // Add remark here
      };

      // Add to the 'inactiveByAt' array to track status changes
      if (popupData.status === "inactive") {
        // Append inactive status details to the map
        updateData.inactiveByAt = userProfileDoc.inactiveByAt || [];
        updateData.inactiveByAt.push({
          inactiveBy: user.uid, // Replace with actual user who is marking inactive
          inactiveAt: currentDate, // Store the current timestamp
          inactiveReason: reason, // Add the selected reason here
          inactiveRemark: remark, // Add the remark here
        });
      }

      if (popupData.status === "active") {
        // Append active status details to the map
        updateData.activeByAt = userProfileDoc.activeByAt || [];
        updateData.activeByAt.push({
          activeBy: user.uid, // Replace with actual user who is marking active
          activeAt: currentDate, // Store the current timestamp
        });
      }

      // Call function to update the document in the database (replace this with your update logic)
      await updateDocument(userProfileId, updateData);
      setShowPopup(false);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };
  // code for active inactive end

  // full code for change role and bydefault check provided roles start
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [primaryRole, setPrimaryRole] = useState("");
  const [isRoleSaving, setIsRoleSaving] = useState(false);
  const [isRoleEditing, setIsRoleEditing] = useState(false);
  const [saveRoleMessage, setSaveRoleMessage] = useState("");
  const [roleMessageType, setRoleMessageType] = useState("");
  const handleRoleEditClick = () => {
    setIsRoleEditing(!isRoleEditing);
  };
  // Update state when userProfileDoc is fetched
  useEffect(() => {
    if (userProfileDoc) {
      setSelectedRoles(userProfileDoc.rolesPropDial || []);
      setPrimaryRole(userProfileDoc.rolePropDial || "");
    }
  }, [userProfileDoc]);

  // Handle role change
  // old code of handle role plz dont delete, this code without selected role number
  // const handleRoleChange = (role) => {
  //   if (selectedRoles.includes(role)) {
  //     // Remove role if already selected
  //     const updatedRoles = selectedRoles.filter((item) => item !== role);
  //     setSelectedRoles(updatedRoles);

  //     // Update primary role if the removed role was the primary one
  //     if (primaryRole === role && updatedRoles.length > 0) {
  //       setPrimaryRole(updatedRoles[0]);
  //     } else if (updatedRoles.length === 0) {
  //       setPrimaryRole("");
  //     }
  //   } else {
  //     // Add role if not selected
  //     const updatedRoles = [...selectedRoles, role];
  //     setSelectedRoles(updatedRoles);

  //     // Set the first selected role as the primary role
  //     if (primaryRole === "") {
  //       setPrimaryRole(role);
  //     }
  //   }
  // };

  // new code of selected roel number
  const handleRoleChange = (role) => {
    setSelectedRoles((prevRoles) => {
      let updatedRoles;

      if (prevRoles.includes(role)) {
        // Remove role if already selected
        updatedRoles = prevRoles.filter((item) => item !== role);

        // Update primary role if the removed role was the primary one
        if (primaryRole === role) {
          setPrimaryRole(updatedRoles.length > 0 ? updatedRoles[0] : "");
        }
      } else {
        // Add role if not selected
        updatedRoles = [...prevRoles, role];

        // Set the first selected role as the primary role
        if (!primaryRole) {
          setPrimaryRole(role);
        }
      }

      return updatedRoles;
    });
  };

  // Handle save button click
  const handleSaveRole = async () => {
    if (selectedRoles.length === 0) {
      setSaveRoleMessage("Please select at least one role.");
      setRoleMessageType("error_msg");
      setTimeout(() => {
        setSaveRoleMessage("");
        setRoleMessageType("");
      }, 4000); // Clear message after 5 seconds
      return;
    }

    // Check if there are changes
    if (
      JSON.stringify(selectedRoles) ===
        JSON.stringify(userProfileDoc.rolesPropDial || []) &&
      primaryRole === (userProfileDoc.rolePropDial || "")
    ) {
      setSaveRoleMessage(
        "No changes detected. Please make updates before saving."
      );
      setRoleMessageType("error_msg"); // Use a different type if desired
      setTimeout(() => {
        setSaveRoleMessage("");
        setRoleMessageType("");
      }, 4000); // Clear message after 5 seconds
      return;
    }

    // Proceed with save logic
    const dataSet = {
      rolePropDial: primaryRole || selectedRoles[0], // Default to first selected role if primaryRole is empty
      rolesPropDial: selectedRoles,
    };

    setIsRoleSaving(true);
    setSaveRoleMessage(""); // Clear previous message

    try {
      await updateDocument(userProfileId, dataSet);
      setRoleMessageType("success_msg");
      setSaveRoleMessage("Roles updated successfully!");
      setTimeout(() => {
        setIsRoleEditing(!isRoleEditing);
      }, 4000);
    } catch (error) {
      console.error("Error updating roles:", error);
      setRoleMessageType("error_msg");
      setSaveRoleMessage("Failed to update roles. Please try again.");
    } finally {
      setIsRoleSaving(false);
      // Clear the message after a delay
      setTimeout(() => {
        setSaveRoleMessage("");
        setRoleMessageType("");
      }, 4000); // Clear message after 5 seconds
    }
  };

  // role mapping for better readability start
  const roleMapping = {
    superAdmin: "Super Admin",
    admin: "Admin",
    owner: "Owner",
    frontdesk: "Frontdesk",
    executive: "Executive",
    agent: "Agent",
    tenant: "Tenant",
    prospectiveTenant: "Prospective Tenant",
    buyer: "Buyer",
    prospectiveBuyer: "Prospective Buyer",
  };
  // full code for change role and bydefault check provided roles end

  // full code for employee detail start
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [uanNumber, setUanNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [employeeDetailUpdateMessage, setEmployeeDetailUpdateMessage] =
    useState("");
  const [isEdUpdating, setIsEdUpdating] = useState(false);
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [dateOfLeaving, setDateOfLeaving] = useState("");
  const [managerName, setManagerName] = useState("");
  const [isEdEditing, setIsEdEditing] = useState(false);
  const [edMessageType, setEdMessageType] = useState("");
  const handleEdEditClick = () => {
    setIsEdEditing(!isEdEditing);
  };
  const handleEdCancelClick = () => {
    setIsEdEditing(!isEdEditing);
    if (userProfileDoc) {
      setEmployeeId(userProfileDoc.employeeId || "");
      setDepartment(userProfileDoc.department || "");
      setDesignation(userProfileDoc.designation || "");
      setUanNumber(userProfileDoc.uanNumber || "");
      setPanNumber(userProfileDoc.panNumber || "");
      setAadhaarNumber(userProfileDoc.aadhaarNumber || "");
      setDateOfJoining(userProfileDoc.dateOfJoining || "");
      setDateOfLeaving(
        userProfileDoc.dateOfJoining ? userProfileDoc.dateOfLeaving || "" : ""
      );
      setManagerName(userProfileDoc.managerName || "");
    }
  };

  useEffect(() => {
    if (userProfileDoc) {
      setEmployeeId(userProfileDoc.employeeId || "");
      setDepartment(userProfileDoc.department || "");
      setDesignation(userProfileDoc.designation || "");
      setUanNumber(userProfileDoc.uanNumber || "");
      setPanNumber(userProfileDoc.panNumber || "");
      setAadhaarNumber(userProfileDoc.aadhaarNumber || "");
      setDateOfJoining(userProfileDoc.dateOfJoining || "");
      setDateOfLeaving(userProfileDoc.dateOfLeaving || "");
      setManagerName(userProfileDoc.managerName || "");
    } else {
      // Set default values for new entries
      setEmployeeId("");
      setDepartment("");
      setDesignation("");
      setUanNumber("");
      setPanNumber("");
      setAadhaarNumber("");
      setDateOfJoining("");
      setDateOfLeaving("");
      setManagerName("");
    }
  }, [userProfileDoc]);

  // Department and Designation Dropdowns
  const departmentOptions = [
    { value: "it", label: "IT" },
    { value: "operation", label: "Operation" },
    { value: "marketing", label: "Marketing" },
    { value: "hr", label: "HR" },
  ];

  const designationOptions = [
    { value: "manager", label: "Manager" },
    { value: "tester", label: "Tester" },
    { value: "developer", label: "Developer" },
    { value: "hr", label: "HR" },
    // Add more options here
  ];

  const handleUpdateEmployeeDetails = async () => {
    // Validation for required fields
    if (
      !employeeId ||
      !dateOfJoining ||
      !panNumber ||
      !aadhaarNumber ||
      !department ||
      !designation ||
      department.length === 0
    ) {
      setEmployeeDetailUpdateMessage("Please fill all required fields.");
      setEdMessageType("error_msg");
      setTimeout(() => {
        setEmployeeDetailUpdateMessage("");
        setEdMessageType("");
      }, 4000); // Clear message after 5 seconds

      return;
    }

    // Validation for UAN number (exactly 12 digits)
    if (uanNumber && !/^\d{12}$/.test(uanNumber)) {
      setEmployeeDetailUpdateMessage("UAN number must be exactly 12 digits.");
      setEdMessageType("error_msg");
      setTimeout(() => {
        setEmployeeDetailUpdateMessage("");
        setEdMessageType("");
      }, 4000);
      return;
    }

    // Validation for PAN card (minimum 10 characters)
    if (panNumber.length < 10) {
      setEmployeeDetailUpdateMessage(
        "PAN card must have at least 10 characters."
      );
      setEdMessageType("error_msg");
      setTimeout(() => {
        setEmployeeDetailUpdateMessage("");
        setEdMessageType("");
      }, 4000);
      return;
    }

    // Remove spaces from the formatted Aadhaar number for validation
    const rawAadhaarNumber = aadhaarNumber.replace(/\s/g, "");

    // Validation for Aadhaar number (exactly 12 digits)
    if (!/^\d{12}$/.test(rawAadhaarNumber)) {
      setEmployeeDetailUpdateMessage(
        "Aadhaar number must be exactly 12 digits."
      );
      setEdMessageType("error_msg");
      setTimeout(() => {
        setEmployeeDetailUpdateMessage("");
        setEdMessageType("");
      }, 4000);
      return;
    }

    // Validation for date of joining and leaving
    if (
      !dateOfJoining ||
      (dateOfLeaving && new Date(dateOfLeaving) <= new Date(dateOfJoining))
    ) {
      setEmployeeDetailUpdateMessage(
        "Please ensure the Date of Joining is set and Date of Leaving is after the Date of Joining."
      );
      setEdMessageType("error_msg");
      setTimeout(() => {
        setEmployeeDetailUpdateMessage("");
        setEdMessageType("");
      }, 4000);
      return;
    }

    const dataSet = {
      employeeId,
      department,
      designation,
      uanNumber,
      panNumber,
      aadhaarNumber,
      dateOfJoining,
      dateOfLeaving,
      managerName,
    };

    setIsEdUpdating(true);
    setEmployeeDetailUpdateMessage("");

    try {
      await updateDocument(userProfileId, dataSet);
      setEdMessageType("success_msg");
      setEmployeeDetailUpdateMessage("Employee details updated successfully!");
      setTimeout(() => {
        setIsEdEditing(!isEdEditing);
      }, 4000);
    } catch (error) {
      console.error("Error updating employee details:", error);
      setEdMessageType("error_msg");
      setEmployeeDetailUpdateMessage(
        "Failed to update employee details. Please try again."
      );
    } finally {
      setIsEdUpdating(false);
      setTimeout(() => {
        setEmployeeDetailUpdateMessage("");
        setEdMessageType("");
      }, 4000); // Clear message after 5 seconds
    }
  };

  // full code for employee detail end

  // full code for vehicle detail start

  const [vehicleNumberPlate, setVehicleNumberPlate] = useState("");
  const [vehicleStatus, setVehicleStatus] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [drivingLicence, setDrivingLicence] = useState("");
  const [vehicleDetailUpdateMessage, setVehicleDetailUpdateMessage] =
    useState("");
  const [isVdUpdating, setIsVdUpdating] = useState(false);
  const [isVdEditing, setIsVdEditing] = useState(false);
  const [vdMessageType, setVdMessageType] = useState("");
  const handleVdEditClick = () => {
    setIsVdEditing(!isVdEditing);
  };
  const handleVdCancelClick = () => {
    setIsVdEditing(!isVdEditing);
    if (userProfileDoc) {
      setVehicleNumberPlate(userProfileDoc.vehicleNumberPlate || "");
      setVehicleStatus(userProfileDoc.vehicleStatus || "");
      setVehicleType(userProfileDoc.vehicleType || "");
      setDrivingLicence(userProfileDoc.drivingLicence || "");
    }
  };

  useEffect(() => {
    if (userProfileDoc) {
      setVehicleNumberPlate(userProfileDoc.vehicleNumberPlate || "");
      setVehicleStatus(userProfileDoc.vehicleStatus || "");
      setVehicleType(userProfileDoc.vehicleType || "");
      setDrivingLicence(userProfileDoc.drivingLicence || "");
    } else {
      // Set default values for new entries
      setVehicleNumberPlate("");
      setVehicleStatus("");
      setVehicleType("");
      setDrivingLicence("");
    }
  }, [userProfileDoc]);
  console.log("vehicleStatus", vehicleStatus);

  const handleUpdateVehicleDetail = async () => {
    // Validation for required fields
    if (
      vehicleStatus === "" ||
      vehicleStatus === undefined ||
      vehicleStatus === null
    ) {
      setVehicleDetailUpdateMessage("Please select vehicle status.");
      setVdMessageType("error_msg");
      setTimeout(() => {
        setVehicleDetailUpdateMessage("");
        setVdMessageType("");
      }, 4000); // Clear message after 5 seconds
      return;
    }

    const dataSet = {
      vehicleNumberPlate,
      vehicleStatus,
      vehicleType,
      drivingLicence,
    };

    setIsVdUpdating(true);
    setVehicleDetailUpdateMessage("");

    try {
      await updateDocument(userProfileId, dataSet);
      setVdMessageType("success_msg");
      setVehicleDetailUpdateMessage("Vehicle details updated successfully!");
      setTimeout(() => {
        setIsVdEditing(!isVdEditing);
      }, 4000);
    } catch (error) {
      console.error("Error updating vehicle details:", error);
      setVdMessageType("error_msg");
      setVehicleDetailUpdateMessage(
        "Failed to update vehicle details. Please try again."
      );
    } finally {
      setIsVdUpdating(false);
      setTimeout(() => {
        setVehicleDetailUpdateMessage("");
        setVdMessageType("");
      }, 4000); // Clear message after 5 seconds
    }
  };

  // full code for full code for vehicle detail end

  // code for isemployee start
  const [isEmployee, setIsEmployee] = useState(false); // Default is 'false'
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [selectedEmployeeStatus, setSelectedEmployeeStatus] = useState(null);

  const handleRadioChange = (value) => {
    setSelectedEmployeeStatus(value); // Set the selected value ("yes" or "no")
    setShowConfirmationPopup(true); // Show the confirmation popup
  };
  const handleUpdateIsEmployee = async () => {
    try {
      const updatedStatus = selectedEmployeeStatus === "yes" ? true : false;
      // Update in the database (assuming you have a function to do this)
      await updateDocument(userProfileId, { isEmployee: updatedStatus });

      setIsEmployee(updatedStatus); // Update the state to reflect the change
      setShowConfirmationPopup(false); // Close the popup
    } catch (error) {
      console.error("Error updating employee status:", error);
    }
  };
  // code for isemployee end

  // Code for isAttendanceRequired start
  const [isAttendanceRequired, setIsAttendanceRequired] = useState(false);
  const [showConfirmationPopupAr, setShowConfirmationPopupAr] = useState(false);
  const [
    selectedAttendanceRequiredStatus,
    setSelectedAttendanceRequiredStatus,
  ] = useState(null);

  const handleArRadioChange = (value) => {
    setSelectedAttendanceRequiredStatus(value); // Set the selected value ("yes" or "no")
    setShowConfirmationPopupAr(true); // Show the confirmation popup
  };

  const handleUpdateIsAttendanceRequired = async () => {
    try {
      setLoading(true);
      const updatedStatus = selectedAttendanceRequiredStatus === "yes"; // Fixed the issue

      await updateDocument(userProfileId, {
        isAttendanceRequired: updatedStatus,
      });

      setIsAttendanceRequired(updatedStatus); // Update state
      setShowConfirmationPopupAr(false); // Close popup
    } catch (error) {
      console.error("Error updating employee status:", error);
    } finally {
      setLoading(false);
    }
  };
  // Code for isAttendanceRequired end

  // full code for ref1 start
  const [ref1FormData, setRef1FormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Update ref1FormData when userProfileDoc changes
  useEffect(() => {
    if (userProfileDoc) {
      setRef1FormData({
        name: userProfileDoc.ref1?.name || "",
        phone: userProfileDoc.ref1?.phone || "",
        email: userProfileDoc.ref1?.email || "",
        address: userProfileDoc.ref1?.address || "",
      });
    }
  }, [userProfileDoc]);

  const [isRef1Saving, setIsRef1Saving] = useState(false);
  const [isRef1Editing, setIsRef1Editing] = useState(false);
  const [saveRef1Message, setSaveRef1Message] = useState("");
  const [ref1MessageType, setRef1MessageType] = useState("");

  // Toggle Edit Mode
  const handleRef1EditClick = () => {
    setIsRef1Editing(!isRef1Editing);
  };

  const handleRef1CancelClick = () => {
    if (userProfileDoc) {
      setRef1FormData({
        name: userProfileDoc.ref1?.name || "",
        phone: userProfileDoc.ref1?.phone || "",
        email: userProfileDoc.ref1?.email || "",
        address: userProfileDoc.ref1?.address || "",
      });
    }
    setIsRef1Editing(!isRef1Editing);
  };
  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRef1FormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangePhone = (value) => {
    setRef1FormData((prevData) => ({
      ...prevData,
      phone: value,
    }));
  };

  // Validate Fields
  const validateRef1Form = () => {
    if (!ref1FormData.name || !ref1FormData.phone || !ref1FormData.address) {
      setSaveRef1Message("Please fill all required fields.");
      setRef1MessageType("error_msg");
      setTimeout(() => {
        setSaveRef1Message("");
        setRef1MessageType("");
      }, 4000);
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (ref1FormData.email && !emailRegex.test(ref1FormData.email)) {
      setSaveRef1Message("Please enter a valid email address.");
      setRef1MessageType("error_msg");
      setTimeout(() => {
        setSaveRef1Message("");
        setRef1MessageType("");
      }, 4000);
      return false;
    }

    return true;
  };

  // Submit Form Data
  const handleRef1Submit = async () => {
    if (!validateRef1Form()) return;

    setIsRef1Saving(true);
    setSaveRef1Message("");

    try {
      const updatedData = {
        ...userProfileDoc,
        ref1: ref1FormData,
      };

      await updateDocument(userProfileId, updatedData);
      setRef1MessageType("success_msg");
      setSaveRef1Message("Updated successfully!");

      setTimeout(() => {
        setIsRef1Editing(false);
      }, 4000);
    } catch (error) {
      console.error("Error updating reference 1 details:", error);
      setRef1MessageType("error_msg");
      setSaveRef1Message(
        "Failed to update Reference 1 details. Please try again."
      );
    } finally {
      setIsRef1Saving(false);
      setTimeout(() => {
        setSaveRef1Message("");
        setRef1MessageType("");
      }, 4000);
    }
  };
  // full code for ref1 end

  // full code for ref2 start
  const [ref2FormData, setRef2FormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Update ref2FormData when userProfileDoc changes
  useEffect(() => {
    if (userProfileDoc) {
      setRef2FormData({
        name: userProfileDoc.ref2?.name || "",
        phone: userProfileDoc.ref2?.phone || "",
        email: userProfileDoc.ref2?.email || "",
        address: userProfileDoc.ref2?.address || "",
      });
    }
  }, [userProfileDoc]);

  const [isRef2Saving, setIsRef2Saving] = useState(false);
  const [isRef2Editing, setIsRef2Editing] = useState(false);
  const [saveRef2Message, setSaveRef2Message] = useState("");
  const [ref2MessageType, setRef2MessageType] = useState("");

  // Toggle Edit Mode
  const handleRef2EditClick = () => {
    setIsRef2Editing(!isRef2Editing);
  };

  const handleRef2CancelClick = () => {
    if (userProfileDoc) {
      setRef2FormData({
        name: userProfileDoc.ref2?.name || "",
        phone: userProfileDoc.ref2?.phone || "",
        email: userProfileDoc.ref2?.email || "",
        address: userProfileDoc.ref2?.address || "",
      });
    }
    setIsRef2Editing(!isRef2Editing);
  };

  // Handle Input Changes
  const handleRef2Change = (e) => {
    const { name, value } = e.target;
    setRef2FormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeRef2Phone = (value) => {
    setRef2FormData((prevData) => ({
      ...prevData,
      phone: value,
    }));
  };

  // Validate Fields
  const validateRef2Form = () => {
    if (!ref2FormData.name || !ref2FormData.phone || !ref2FormData.address) {
      setSaveRef2Message("Please fill all required fields.");
      setRef2MessageType("error_msg");
      setTimeout(() => {
        setSaveRef2Message("");
        setRef2MessageType("");
      }, 4000);
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (ref2FormData.email && !emailRegex.test(ref2FormData.email)) {
      setSaveRef2Message("Please enter a valid email address.");
      setRef2MessageType("error_msg");
      setTimeout(() => {
        setSaveRef2Message("");
        setRef2MessageType("");
      }, 4000);
      return false;
    }

    return true;
  };

  // Submit Form Data
  const handleRef2Submit = async () => {
    if (!validateRef2Form()) return;

    setIsRef2Saving(true);
    setSaveRef2Message("");

    try {
      const updatedData = {
        ...userProfileDoc,
        ref2: ref2FormData,
      };

      await updateDocument(userProfileId, updatedData);
      setRef2MessageType("success_msg");
      setSaveRef2Message("Updated successfully!");

      setTimeout(() => {
        setIsRef2Editing(false);
      }, 4000);
    } catch (error) {
      console.error("Error updating reference 1 details:", error);
      setRef2MessageType("error_msg");
      setSaveRef2Message(
        "Failed to update Reference 1 details. Please try again."
      );
    } finally {
      setIsRef2Saving(false);
      setTimeout(() => {
        setSaveRef2Message("");
        setRef2MessageType("");
      }, 4000);
    }
  };
  // full code for ref2 end

  // full code for bank detail start
  const [bankDetailFormData, setBankDetailFormData] = useState({
    acHolderName: "",
    acNumber: "",
    bankName: "",
    branchName: "",
    ifscCode: "",
  });

  // Update BankDetailFormData when userProfileDoc changes
  useEffect(() => {
    if (userProfileDoc) {
      setBankDetailFormData({
        acHolderName: userProfileDoc.bankDetail?.acHolderName || "",
        acNumber: userProfileDoc.bankDetail?.acNumber || "",
        bankName: userProfileDoc.bankDetail?.bankName || "",
        branchName: userProfileDoc.bankDetail?.branchName || "",
        ifscCode: userProfileDoc.bankDetail?.ifscCode || "",
      });
    }
  }, [userProfileDoc]);

  const [isBankDetailSaving, setIsBankDetailSaving] = useState(false);
  const [isBankDetailEditing, setIsBankDetailEditing] = useState(false);
  const [saveBankDetailMessage, setSaveBankDetailMessage] = useState("");
  const [BankDetailMessageType, setBankDetailMessageType] = useState("");

  // Toggle Edit Mode
  const handleBankDetailEditClick = () => {
    setIsBankDetailEditing(!isBankDetailEditing);
  };

  const handleBankDetailCancelClick = () => {
    if (userProfileDoc) {
      setBankDetailFormData({
        acHolderName: userProfileDoc.bankDetail?.acHolderName || "",
        acNumber: userProfileDoc.bankDetail?.acNumber || "",
        bankName: userProfileDoc.bankDetail?.bankName || "",
        branchName: userProfileDoc.bankDetail?.branchName || "",
        ifscCode: userProfileDoc.bankDetail?.ifscCode || "",
      });
    }
    setIsBankDetailEditing(!isBankDetailEditing);
  };

  // Handle Input Changes
  const handleBankDetailChange = (e) => {
    const { name, value } = e.target;
    setBankDetailFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate Fields
  const validateBankDetailForm = () => {
    if (
      !bankDetailFormData.acHolderName ||
      !bankDetailFormData.acNumber ||
      !bankDetailFormData.bankName ||
      !bankDetailFormData.ifscCode
    ) {
      setSaveBankDetailMessage("Please fill all required fields.");
      setBankDetailMessageType("error_msg");
      setTimeout(() => {
        setSaveBankDetailMessage("");
        setBankDetailMessageType("");
      }, 4000);
      return false;
    }

    return true;
  };

  // Submit Form Data
  const handleBankDetailSubmit = async () => {
    if (!validateBankDetailForm()) return;

    setIsBankDetailSaving(true);
    setSaveBankDetailMessage("");

    try {
      const updatedData = {
        ...userProfileDoc,
        bankDetail: bankDetailFormData,
      };

      await updateDocument(userProfileId, updatedData);
      setBankDetailMessageType("success_msg");
      setSaveBankDetailMessage("Updated successfully!");

      setTimeout(() => {
        setIsBankDetailEditing(false);
      }, 4000);
    } catch (error) {
      console.error("Error updating bank details:", error);
      setBankDetailMessageType("error_msg");
      setSaveBankDetailMessage(
        "Failed to update bank details. Please try again."
      );
    } finally {
      setIsBankDetailSaving(false);
      setTimeout(() => {
        setSaveBankDetailMessage("");
        setBankDetailMessageType("");
      }, 4000);
    }
  };
  // full code for ref2 end

  // old running code for upload document start
  // (Don't delete)
  // const fileInputRefs = useRef({});

  // const [isDocUploading, setIsDocUploading] = useState({});
  // const [files, setFiles] = useState({});
  // const [uploadDocInProgress, setUploadDocInProgress] = useState({});

  // const documentTypes = ["Aadhaar Card", "PAN Card", "Driving Licence"];

  // const handleDocFileChange = (event, docType) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setFiles((prev) => ({ ...prev, [docType]: file }));
  //   }
  // };

  // const getFileType = (file) => {
  //   const fileExtension = file.name.split(".").pop().toLowerCase();
  //   return fileExtension === "pdf" ? "pdf" : "image";
  // };

  // useEffect(() => {
  //   documentTypes.forEach((docType) => {
  //     if (files[docType]) {
  //       uploadDocument(docType);
  //     }
  //   });
  // }, [files]);

  // const uploadDocument = async (docType) => {
  //   try {
  //     setIsDocUploading((prev) => ({ ...prev, [docType]: true }));
  //     const file = files[docType];
  //     const fileType = getFileType(file);

  //     const storageRef = projectStorage.ref(
  //       `user-docs/${userProfileId}/${docType}/${file.name}`
  //     );
  //     const uploadTask = storageRef.put(file);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         setUploadDocInProgress((prev) => ({ ...prev, [docType]: progress }));
  //       },
  //       (error) => {
  //         console.error(`Error uploading ${docType}:`, error);
  //         setIsDocUploading((prev) => ({ ...prev, [docType]: false }));
  //       },
  //       async () => {
  //         const fileURL = await storageRef.getDownloadURL();
  //         await updateDocument(userProfileId, {
  //           [`${docType.replace(/ /g, "").toLowerCase()}Url`]: fileURL,
  //           [`${docType.replace(/ /g, "").toLowerCase()}Type`]: fileType,
  //         });
  //         setFiles((prev) => {
  //           const updatedFiles = { ...prev };
  //           delete updatedFiles[docType];
  //           return updatedFiles;
  //         });
  //         setIsDocUploading((prev) => ({ ...prev, [docType]: false }));
  //       }
  //     );
  //   } catch (error) {
  //     console.error(`Error uploading ${docType}:`, error);
  //     setIsDocUploading((prev) => ({ ...prev, [docType]: false }));
  //   }
  // };
  // old running code for upload document end

  // New code for upload document start
  const documentTypes = [
    "Aadhaar Card",
    "PAN Card",
    "Driving Licence",
    "Voter ID",
  ];
  const fileInputRefs = useRef({});
  const [isDocUploading, setIsDocUploading] = useState({});
  const [files, setFiles] = useState({});
  const [uploadDocInProgress, setUploadDocInProgress] = useState({});

  const handleDocFileChange = (event, docType) => {
    const file = event.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [docType]: file }));
    }
  };

  const getFileType = (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    return fileExtension === "pdf" ? "pdf" : "image";
  };

  useEffect(() => {
    Object.keys(files).forEach((docType) => {
      if (files[docType]) uploadDocument(docType);
    });
  }, [files]);

  // upload document code without delete previous doc from storage automatically
  //  (Don't delete )
  // const uploadDocument = async (docType) => {
  //   try {
  //     setIsDocUploading((prev) => ({ ...prev, [docType]: true }));
  //     const file = files[docType];
  //     const fileType = getFileType(file);

  //     const storageRef = projectStorage.ref(
  //       `user-docs/${userProfileId}/${docType}/${file.name}`
  //     );
  //     const uploadTask = storageRef.put(file);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         setUploadDocInProgress((prev) => ({ ...prev, [docType]: progress }));
  //       },
  //       (error) => {
  //         console.error(`Error uploading ${docType}:`, error);
  //         setIsDocUploading((prev) => ({ ...prev, [docType]: false }));
  //       },
  //       async () => {
  //         const fileURL = await storageRef.getDownloadURL();
  //         await updateDocument(userProfileId, {
  //           [`${docType.replace(/ /g, "").toLowerCase()}Url`]: fileURL,
  //           [`${docType.replace(/ /g, "").toLowerCase()}Type`]: fileType,
  //         });
  //         setFiles((prev) => {
  //           const updatedFiles = { ...prev };
  //           delete updatedFiles[docType];
  //           return updatedFiles;
  //         });
  //         setIsDocUploading((prev) => ({ ...prev, [docType]: false }));
  //       }
  //     );
  //   } catch (error) {
  //     console.error(`Error uploading ${docType}:`, error);
  //     setIsDocUploading((prev) => ({ ...prev, [docType]: false }));
  //   }
  // };

  // upload document code with delete previous doc from storage automatically
  const uploadDocument = async (docType) => {
    try {
      setIsDocUploading((prev) => ({ ...prev, [docType]: true }));
      const file = files[docType];
      const fileType = getFileType(file);

      // Check if there's an existing document and delete it
      const urlKey = `${docType.replace(/ /g, "").toLowerCase()}Url`;
      if (userProfileDoc && userProfileDoc[urlKey]) {
        const oldFileURL = userProfileDoc[urlKey];
        const oldFileRef = projectStorage.refFromURL(oldFileURL);

        try {
          await oldFileRef.delete();
          console.log(`Previous file for ${docType} deleted successfully.`);
        } catch (error) {
          console.error(`Error deleting previous file for ${docType}:`, error);
        }
      }

      // Upload the new document
      const storageRef = projectStorage.ref(
        `user-docs/${userProfileId}/${docType}/${file.name}`
      );
      const uploadTask = storageRef.put(file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadDocInProgress((prev) => ({ ...prev, [docType]: progress }));
        },
        (error) => {
          console.error(`Error uploading ${docType}:`, error);
          setIsDocUploading((prev) => ({ ...prev, [docType]: false }));
        },
        async () => {
          const fileURL = await storageRef.getDownloadURL();
          await updateDocument(userProfileId, {
            [`${docType.replace(/ /g, "").toLowerCase()}Url`]: fileURL,
            [`${docType.replace(/ /g, "").toLowerCase()}Type`]: fileType,
          });
          setFiles((prev) => {
            const updatedFiles = { ...prev };
            delete updatedFiles[docType];
            return updatedFiles;
          });
          setIsDocUploading((prev) => ({ ...prev, [docType]: false }));
        }
      );
    } catch (error) {
      console.error(`Error uploading ${docType}:`, error);
      setIsDocUploading((prev) => ({ ...prev, [docType]: false }));
    }
  };

  // code for delete uploaded document from database and storage both
  const handleDeleteDocument = async (docType) => {
    try {
      const urlKey = `${docType.replace(/ /g, "").toLowerCase()}Url`;
      if (userProfileDoc && userProfileDoc[urlKey]) {
        const oldFileURL = userProfileDoc[urlKey];
        const oldFileRef = projectStorage.refFromURL(oldFileURL);

        // Delete the file from storage
        await oldFileRef.delete();
        console.log(`File for ${docType} deleted successfully.`);

        // Remove the URL and file type from the database
        await updateDocument(userProfileId, {
          [urlKey]: null,
          [`${docType.replace(/ /g, "").toLowerCase()}Type`]: null,
        });

        console.log(`Database entry for ${docType} removed successfully.`);
      }
    } catch (error) {
      console.error(`Error deleting file for ${docType}:`, error);
    }
  };

  // code for delete upload document with confirmation popup
  const [showConfirmModalForDeleteDoc, setShowConfirmModalForDeleteDoc] =
    useState(false);
  const [modalDocType, setModalDocType] = useState("");
  const [isUploadedDocDeleting, setIsUploadedDocDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setIsUploadedDocDeleting(true);
      await handleDeleteDocument(modalDocType); // Call the delete function
      setIsUploadedDocDeleting(false);
      setShowConfirmModalForDeleteDoc(false); // Close modal after successful deletion
    } catch (error) {
      console.error(`Error deleting ${modalDocType}:`, error);
      setIsUploadedDocDeleting(false);
    }
  };

  const handleDeleteClick = (docType) => {
    setModalDocType(docType);
    setShowConfirmModalForDeleteDoc(true);
  };

  //  (Don't delete )
  // const renderFilePreview = (docType) => {
  //   const urlKey = `${docType.replace(/ /g, "").toLowerCase()}Url`;
  //   const typeKey = `${docType.replace(/ /g, "").toLowerCase()}Type`;

  //   if (userProfileDoc && userProfileDoc[urlKey]) {
  //     return userProfileDoc[typeKey] === "image" ? (
  //       <img src={userProfileDoc[urlKey]} alt={`${docType} preview`} />
  //     ) : (
  //       <iframe
  //         // title={`${docType} Viewer`}
  //         title="PDF Viewer"
  //         src={userProfileDoc[urlKey]}
  //         className="document-preview"
  //         style={{
  //           width: "100%",
  //           aspectRatio: "3/2",
  //         }}
  //       ></iframe>

  //     );
  //   }
  //   return <img src="/assets/img/image_small_placeholder.png" alt="Placeholder" />;
  // };

  // code for redering file with delete button
  const renderFilePreview = (docType) => {
    const urlKey = `${docType.replace(/ /g, "").toLowerCase()}Url`;
    const typeKey = `${docType.replace(/ /g, "").toLowerCase()}Type`;

    if (userProfileDoc && userProfileDoc[urlKey]) {
      return (
        <div className="image_container_inner">
          {userProfileDoc[typeKey] === "image" ? (
            <img src={userProfileDoc[urlKey]} alt={`${docType} preview`} />
          ) : (
            <iframe
              title="PDF Viewer"
              src={userProfileDoc[urlKey]}
              className="document-preview"
              style={{
                width: "100%",
                aspectRatio: "3/2",
              }}
            ></iframe>
          )}
          <span
            class="material-symbols-outlined delete_icon_top"
            onClick={() => handleDeleteClick(docType)}
          >
            delete_forever
          </span>
        </div>
      );
    }
    return (
      <img src="/assets/img/image_small_placeholder.png" alt="Placeholder" />
    );
  };
  return (
    <div className="top_header_pg pg_bg user_detail_pg relative">
      <div className="basic_info">
        <div
          className="pic_are relative"
          style={{
            backgroundImage: "url(/assets/img/profile_img_bg.jpg)",
          }}
        >
          <div className="pic">
            <img
              src={userProfileDoc && userProfileDoc.photoURL}
              alt="user img"
              style={{
                borderColor:
                  userProfileDoc &&
                  camelCase(
                    userProfileDoc.status === "active"
                      ? "var(--theme-green2)"
                      : "var(--theme-red)"
                  ),
              }}
            />
          </div>
          <Link
            to={`mailto:${userProfileDoc && userProfileDoc.email}`}
            className="icon left"
          >
            <img src="/assets/img/gmailbig.png" alt="" />
          </Link>
          <Link
            to={`https://wa.me/+${
              userProfileDoc && userProfileDoc.phoneNumber
            }`}
            className="icon right"
          >
            <img src="/assets/img/whatsappbig.png" alt="" />
          </Link>
        </div>
        <div className="p_info">
          <h5>{userProfileDoc && userProfileDoc.fullName}</h5>
          <h6>
            {" "}
            {userProfileDoc &&
              userProfileDoc.phoneNumber.replace(
                /(\d{2})(\d{5})(\d{5})/,
                "+$1 $2-$3"
              )}
          </h6>
          <h6 className="break_all">
            {userProfileDoc && userProfileDoc.email}
          </h6>
          <h6>
            {userProfileDoc && userProfileDoc.city},{" "}
            {userProfileDoc && userProfileDoc.country}{" "}
          </h6>
        </div>
        {/* <hr />
        <div className="roles">
          <h5>Provided Roles</h5>
          <ul>
            {userProfileDoc?.rolesPropDial?.length > 0 ? (
              userProfileDoc.rolesPropDial.map((role, index) => (
                <li key={index}>{roleMapping[role]}</li>
              ))
            ) : (
              <p>No roles assigned</p>
            )}
          </ul>
        </div> */}
      </div>
      <div className="detail_info pd_single">
        <div className="property_card_single mobile_full_card overflow_unset">
          <div className="more_detail_card_inner">
            <div className="p_info">
              <div className="p_info_single">
                <div className="pd_icon">
                  <img
                    src="/assets/img/property-detail-icon/VisitingDays.png"
                    alt=""
                  />
                </div>
                <div className="pis_content">
                  <h6>On-Boarded</h6>
                  <h5>
                    {userProfileDoc && userProfileDoc.createdAt
                      ? format(userProfileDoc.createdAt.toDate(), "dd-MMM-yyyy")
                      : ""}
                  </h5>
                </div>
              </div>
              <div className="p_info_single">
                <div className="pd_icon">
                  <img src="/assets/img/edicon/calendar2.png" alt="" />
                </div>
                <div className="pis_content">
                  <h6>Last Logged-in</h6>
                  <h5>
                    {userProfileDoc && userProfileDoc.createdAt
                      ? format(
                          userProfileDoc.lastLoginTimestamp.toDate(),
                          "dd-MMM-yyyy hh:mm a"
                        )
                      : ""}
                  </h5>
                </div>
              </div>
            </div>
            <div className="card_blue_divider">
              <div className="active_inactive">
                <div className="form_field outline blue_single">
                  <div className="field_box theme_radio_new">
                    <div
                      className="theme_radio_container"
                      style={{
                        padding: "0px",
                        border: "none",
                        background: "transparent",
                      }}
                    >
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="user_status"
                          value="active"
                          id="active"
                          checked={
                            userProfileDoc && userProfileDoc.status === "active"
                          }
                          onChange={() => handleStatusChange("active")}
                        />
                        <label htmlFor="active">
                          <div className="label_inner">
                            {userProfileDoc && userProfileDoc.activeAt
                              ? "Active"
                              : "Make Active"}

                            {userProfileDoc &&
                              userProfileDoc.activeBy &&
                              userProfileDoc.activeAt && (
                                <div className="info_icon">
                                  <span className="material-symbols-outlined">
                                    info
                                  </span>
                                  <div className="info_icon_inner">
                                    <b className="text_green2">Active</b> by{" "}
                                    <b>
                                      {userProfileDoc &&
                                        dbUserState &&
                                        dbUserState.find(
                                          (user) =>
                                            user.id === userProfileDoc.activeBy
                                        )?.fullName}
                                    </b>{" "}
                                    on{" "}
                                    <b>
                                      {userProfileDoc &&
                                        format(
                                          userProfileDoc.activeAt.toDate(),
                                          "dd-MMM-yyyy hh:mm a"
                                        )}
                                    </b>
                                  </div>
                                </div>
                              )}
                          </div>
                        </label>
                      </div>
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="user_status"
                          value="inactive"
                          id="inactive"
                          checked={
                            userProfileDoc &&
                            userProfileDoc.status === "inactive"
                          }
                          onChange={() => handleStatusChange("inactive")}
                        />
                        <label htmlFor="inactive">
                          <div className="label_inner">
                            {userProfileDoc && userProfileDoc.inactiveAt
                              ? "Inactive"
                              : "Make Inactive"}
                            {userProfileDoc &&
                              userProfileDoc.inactiveAt &&
                              userProfileDoc.inactiveBy && (
                                <div className="info_icon">
                                  <span className="material-symbols-outlined">
                                    info
                                  </span>
                                  <div className="info_icon_inner">
                                    <b className="text_red">Inactive</b> by{" "}
                                    <b>
                                      {userProfileDoc &&
                                        dbUserState &&
                                        dbUserState.find(
                                          (user) =>
                                            user.id ===
                                            userProfileDoc.inactiveBy
                                        )?.fullName}
                                    </b>{" "}
                                    on{" "}
                                    <b>
                                      {userProfileDoc &&
                                        format(
                                          userProfileDoc.inactiveAt.toDate(),
                                          "dd-MMM-yyyy hh:mm a"
                                        )}
                                    </b>
                                    , Reason{" "}
                                    <b>
                                      {userProfileDoc &&
                                        userProfileDoc.inactiveReason &&
                                        userProfileDoc.inactiveReason}
                                    </b>
                                    ,
                                    {userProfileDoc &&
                                      userProfileDoc.inactiveRemark && (
                                        <>
                                          {" "}
                                          Remark{" "}
                                          <b>{userProfileDoc.inactiveRemark}</b>
                                        </>
                                      )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <Modal
                  show={showPopup}
                  onHide={() => setShowPopup(false)}
                  centered
                >
                  <Modal.Header
                    className="justify-content-center"
                    style={{
                      paddingBottom: "0px",
                      border: "none",
                    }}
                  >
                    <h5>
                      {popupData.status === "inactive"
                        ? "Reason For Inactive"
                        : "Confirmation"}
                    </h5>
                  </Modal.Header>
                  <Modal.Body
                    className="text-center"
                    style={{
                      color: "#FA6262",
                      fontSize: "20px",
                      border: "none",
                    }}
                  >
                    {popupData.status === "inactive" && (
                      <div>
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
                                  name="reason"
                                  value="Security Concerns"
                                  checked={reason === "Security Concerns"}
                                  onChange={() =>
                                    setReason("Security Concerns")
                                  }
                                  id="SecurityConcerns"
                                />

                                <label htmlFor="SecurityConcerns">
                                  Security Concerns
                                </label>
                              </div>
                              <div className="radio_single">
                                <input
                                  type="radio"
                                  name="reason"
                                  value="PolicyViolations"
                                  checked={reason === "Policy Violations"}
                                  onChange={() =>
                                    setReason("Policy Violations")
                                  }
                                  id="PolicyViolations"
                                />

                                <label htmlFor="PolicyViolations">
                                  Policy Violations
                                </label>
                              </div>

                              {userProfileDoc && userProfileDoc.isEmployee && (
                                <div className="radio_single">
                                  <input
                                    type="radio"
                                    name="reason"
                                    value="resigned"
                                    checked={reason === "resigned"}
                                    onChange={() => setReason("resigned")}
                                    id="resigned"
                                  />
                                  <label htmlFor="resigned">Resigned</label>
                                </div>
                              )}
                              {userProfileDoc && userProfileDoc.isEmployee && (
                                <div className="radio_single">
                                  <input
                                    type="radio"
                                    name="reason"
                                    value="leave"
                                    checked={reason === "leave"}
                                    onChange={() => setReason("leave")}
                                    id="leave"
                                  />

                                  <label htmlFor="leave">Leave</label>
                                </div>
                              )}

                              <div className="radio_single">
                                <input
                                  type="radio"
                                  name="reason"
                                  value="other"
                                  checked={reason === "other"}
                                  onChange={() => setReason("other")}
                                  id="other"
                                />
                                <label htmlFor="other">Other</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form_field mt-3 mb-3">
                          <textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            onFocus={(e) => (e.target.style.outline = "none")}
                            onBlur={(e) => (e.target.style.outline = "")}
                            placeholder="Enter any remark..."
                            style={{ outline: "none", paddingLeft: "10px" }}
                          ></textarea>
                        </div>
                      </div>
                    )}
                    Are you sure you want to mark this user as{" "}
                    {popupData.status}?
                  </Modal.Body>
                  <Modal.Footer
                    className="d-flex justify-content-between"
                    style={{
                      border: "none",
                      gap: "15px",
                    }}
                  >
                    {errorForNoSelectReasonMessage && (
                      <div
                        style={{
                          fontSize: "15px",
                          padding: "4px 15px",
                          borderRadius: "8px",
                          background: "#ffe9e9",
                          color: "red",
                          width: "fit-content",
                          margin: "auto",
                        }}
                      >
                        {errorForNoSelectReasonMessage}
                      </div>
                    )}
                    <div
                      className="cancel_btn"
                      onClick={handlePopupSubmit}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Yes, Update"}
                    </div>
                    <div
                      className="done_btn"
                      onClick={() => setShowPopup(false)}
                    >
                      No
                    </div>
                  </Modal.Footer>
                </Modal>
              </div>
              <div className="blue_single is_employee">
                <h5>Is Employee?</h5>
                <div className="form_field">
                  <div className="field_box theme_radio_new">
                    <div
                      className="theme_radio_container"
                      style={{
                        padding: "0px",
                        border: "none",
                        background: "transparent",
                      }}
                    >
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="isemployee"
                          value="yes"
                          id="yes"
                          checked={
                            userProfileDoc && userProfileDoc.isEmployee === true
                          }
                          onChange={() => handleRadioChange("yes")}
                        />
                        <label htmlFor="yes">yes</label>
                      </div>
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="isemployee"
                          value="no"
                          id="no"
                          checked={
                            userProfileDoc &&
                            userProfileDoc.isEmployee === false
                          }
                          onChange={() => handleRadioChange("no")}
                        />
                        <label htmlFor="no">no</label>
                      </div>
                    </div>
                  </div>
                </div>

                <Modal
                  show={showConfirmationPopup}
                  onHide={() => setShowConfirmationPopup(false)}
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
                      color: "#FA6262",
                      fontSize: "20px",
                      border: "none",
                    }}
                  >
                    Are you sure you want to mark this user as{" "}
                    {selectedEmployeeStatus === "yes"
                      ? "an employee"
                      : "not an employee"}
                    ?
                  </Modal.Body>
                  <Modal.Footer
                    className="d-flex justify-content-between"
                    style={{
                      border: "none",
                      gap: "15px",
                    }}
                  >
                    <div
                      className="cancel_btn"
                      onClick={handleUpdateIsEmployee}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Yes, Update"}
                    </div>
                    <div
                      className="done_btn"
                      onClick={() => setShowConfirmationPopup(false)}
                    >
                      No
                    </div>
                  </Modal.Footer>
                </Modal>
              </div>

              <div className="blue_single is_employee">
                <h5>Current Role - </h5>
                <h6 className="text_blue text-capitalize">
                  {userProfileDoc && userProfileDoc.rolePropDial}
                </h6>
              </div>
              <div className="blue_single is_employee">
                <h5>Mode - </h5>
                <h6
                  className={` ${
                    userProfileDoc && userProfileDoc.online
                      ? "text_green2"
                      : "text_red"
                  }`}
                >
                  {userProfileDoc && userProfileDoc.online
                    ? "Online"
                    : "Offline"}
                </h6>
              </div>
              <div className="blue_single  is_employee is_attendance_required">
                <h5>Is Attendance Required?</h5>
                <div className="form_field">
                  <div className="field_box theme_radio_new">
                    <div
                      className="theme_radio_container"
                      style={{
                        padding: "0px",
                        border: "none",
                        background: "transparent",
                      }}
                    >
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="isar"
                          value="yes"
                          id="isaryes"
                          checked={
                            userProfileDoc?.isAttendanceRequired === true
                          } // Fixed checked condition
                          onChange={() => handleArRadioChange("yes")}
                        />
                        <label htmlFor="isaryes">yes</label>
                      </div>
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="isar"
                          value="no"
                          id="isarno"
                          checked={
                            userProfileDoc?.isAttendanceRequired === false
                          } // Fixed checked condition
                          onChange={() => handleArRadioChange("no")}
                        />
                        <label htmlFor="isarno">no</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirmation Modal */}
                <Modal
                  show={showConfirmationPopupAr}
                  onHide={() => setShowConfirmationPopupAr(false)}
                  centered
                >
                  <Modal.Header
                    className="justify-content-center"
                    style={{ paddingBottom: "0px", border: "none" }}
                  >
                    <h5>Confirmation</h5>
                  </Modal.Header>
                  <Modal.Body
                    className="text-center"
                    style={{
                      color: "#FA6262",
                      fontSize: "20px",
                      border: "none",
                    }}
                  >
                    Are you sure you want to mark this user as{" "}
                    {selectedAttendanceRequiredStatus === "yes"
                      ? "attendance required"
                      : "not attendance required"}
                    ?
                  </Modal.Body>
                  <Modal.Footer
                    className="d-flex justify-content-between"
                    style={{ border: "none", gap: "15px" }}
                  >
                    <div
                      className="cancel_btn"
                      onClick={handleUpdateIsAttendanceRequired}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Yes, Update"}
                    </div>
                    <div
                      className="done_btn"
                      onClick={() => setShowConfirmationPopupAr(false)}
                    >
                      No
                    </div>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>
        <div className="property_card_single mobile_full_card overflow_unset">
          <div className="more_detail_card_inner">
            <h2 className="card_title">
              Roles
              <span
                className={`material-symbols-outlined action_icon ${
                  isRoleEditing ? "text_red" : "text_green"
                }`}
                onClick={handleRoleEditClick}
              >
                {isRoleEditing ? "close" : "border_color"}
              </span>
            </h2>
            <div className="form_field">
              <div className="field_box theme_checkbox">
                <div
                  className="theme_checkbox_container"
                  style={{
                    padding: "0px",
                    border: "none",
                  }}
                >
                  {[
                    {
                      id: "owner",
                      label: "Owner",
                      isEmployee: false,
                      showInBoth: true,
                    },
                    {
                      id: "frontdesk",
                      label: "Frontdesk",
                      isEmployee: true,
                      showInBoth: false,
                    },
                    {
                      id: "executive",
                      label: "Executive",
                      isEmployee: true,
                      showInBoth: false,
                    },
                    {
                      id: "admin",
                      label: "Admin",
                      isEmployee: true,
                      showInBoth: false,
                    },
                    {
                      id: "hr",
                      label: "HR",
                      isEmployee: true,
                      showInBoth: false,
                    },
                    {
                      id: "admin RO",
                      label: "Admin RO",
                      isEmployee: true,
                      showInBoth: false,
                    },
                    {
                      id: "accountant",
                      label: "accountant",
                      isEmployee: true,
                      showInBoth: false,
                    },

                    {
                      id: "agent",
                      label: "Agent",
                      isEmployee: false,
                      showInBoth: false,
                    },
                    {
                      id: "superAdmin",
                      label: "Super Admin",
                      isEmployee: true,
                      showInBoth: false,
                    },
                    {
                      id: "tenant",
                      label: "Tenant",
                      isEmployee: false,
                      showInBoth: false,
                    },
                    {
                      id: "prospectiveTenant",
                      label: "Prospective Tenant",
                      isEmployee: false,
                      showInBoth: false,
                    },
                    {
                      id: "buyer",
                      label: "Buyer",
                      isEmployee: false,
                      showInBoth: false,
                    },
                    {
                      id: "prospectiveBuyer",
                      label: "Prospective Buyer",
                      isEmployee: false,
                      showInBoth: false,
                    },
                  ]
                    .filter(
                      (role) =>
                        userProfileDoc?.isEmployee
                          ? role.isEmployee || role.showInBoth // Show employee roles or those meant for both
                          : !role.isEmployee || role.showInBoth // Show non-employee roles or those meant for both
                    )
                    .map(({ id, label }) => (
                      // old code plz dont,t delete it
                      // <div className="radio_single" key={id}>
                      //   <input
                      //     type="checkbox"
                      //     name="user_role"
                      //     value={id}
                      //     id={id}
                      //     disabled={!isRoleEditing}
                      //     checked={selectedRoles.includes(id)}
                      //     onChange={() => handleRoleChange(id)}
                      //   />
                      //   <label htmlFor={id}>{label}</label>
                      // </div>
                      <div
                        className="radio_single"
                        key={id}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="user_role"
                          value={id}
                          id={id}
                          disabled={!isRoleEditing}
                          checked={selectedRoles.includes(id)}
                          onChange={() => handleRoleChange(id)}
                        />
                        <label htmlFor={id}>
                          {label}{" "}
                          {selectedRoles.includes(id) &&
                            `(${selectedRoles.indexOf(id) + 1})`}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {isRoleEditing && (
              <div className="btn_msg_area">
                {saveRoleMessage && (
                  <p className={`msg_area ${roleMessageType}`}>
                    {saveRoleMessage}
                  </p>
                )}
                <button
                  onClick={handleRoleEditClick}
                  disabled={isRoleSaving}
                  className={`theme_btn btn_border no_icon min_width ${
                    isRoleSaving ? "disabled" : ""
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRole}
                  disabled={isRoleSaving}
                  className={`theme_btn btn_fill no_icon min_width ${
                    isRoleSaving ? "disabled" : ""
                  }`}
                >
                  {isRoleSaving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>
        </div>
        {userProfileDoc &&
          (userProfileDoc.rolePropDial === "owner" ||
            (userProfileDoc.rolesPropDial &&
              userProfileDoc.rolesPropDial.includes("owner"))) && (
            <div className="property_card_single mobile_full_card overflow_unset">
              <div className="more_detail_card_inner">
                <h2 className="card_title">Properties owned within the city</h2>
                <div className="vg12"></div>
                <div className="row row_gap">
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="form_field label_top">
                      <label>City123</label>
                      <div className="form_field_inner">
                        <Select
                          className=""
                          // onChange={(e) => {
                          //   handleCityChange({
                          //     label: e.label,
                          //     value: e.label
                          //   }, locality, society)
                          // }}
                          onChange={handleCityChange}
                          isMulti
                          options={cityOptions.current}
                          value={city}
                          // styles={{
                          //   control: (baseStyles, state) => ({
                          //     ...baseStyles,
                          //     outline: "none",
                          //     background: "#efefef",
                          //     border: "none",
                          //     borderBottom: "none",
                          //     paddingLeft: "10px",
                          //     textTransform: "capitalize",
                          //   }),
                          // }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="vg12"></div>
                <div className="btn_msg_area">
                  {/* <button
                // onClick={handleEdCancelClick}
                // disabled={isEdUpdating}
                className={`theme_btn btn_border no_icon min_width ${isEdUpdating ? "disabled" : ""
                  }`}
              >
                Cancel
              </button> */}
                  <button
                    onClick={handleSavePropertyOwnedInCities}
                    // disabled={isEdUpdating}
                    className={`theme_btn btn_fill no_icon min_width ${
                      isEdUpdating ? "disabled" : ""
                    }`}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

        {userProfileDoc && userProfileDoc.isEmployee && (
          <div className="property_card_single mobile_full_card overflow_unset">
            <div className="more_detail_card_inner">
              <h2 className="card_title">Access Management</h2>
              <div className="form_field">
                <div className="field_box theme_radio_new">
                  <div
                    className="theme_radio_container"
                    style={{
                      padding: "0px",
                      border: "none",
                    }}
                  >
                    {[
                      { id: "country", label: "Country" },
                      { id: "region", label: "Region" },
                      { id: "state", label: "State" },
                      { id: "city", label: "City" },
                    ].map(({ id, label }) => (
                      <div className="radio_single" key={id}>
                        <input
                          type="radio"
                          name="user_role"
                          value={id}
                          id={id}
                          onChange={handleAmRadioChange}
                          defaultChecked={id === "country"} // Default check for Country
                        />
                        <label htmlFor={id}>{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="vg22"></div>
              <div className="vg12"></div>
              <div className="row row_gap">
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="form_field label_top">
                    <label>Country</label>
                    <div className="form_field_inner">
                      <Select
                        // value={designation}
                        // onChange={setDesignation}
                        // options={designationOptions}
                        onChange={handleCountryChange}
                        options={countryOptions.current}
                        value={country}
                        placeholder="Select Country"
                      />
                    </div>
                  </div>
                </div>
                {(selectedAmLevel === "region" ||
                  selectedAmLevel === "state" ||
                  selectedAmLevel === "city") && (
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="form_field label_top">
                      <label>Region</label>
                      <div className="form_field_inner">
                        <Select
                          // value={designation}
                          // onChange={setDesignation}
                          // options={designationOptions}
                          // onChange={handleCountryChange}
                          // options={countryOptions.current}
                          // value={country}
                          placeholder="Select Region"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {(selectedAmLevel === "state" ||
                  selectedAmLevel === "city") && (
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="form_field label_top">
                      <label>State</label>
                      <div className="form_field_inner">
                        <Select
                          isMulti
                          onChange={handleStateChange}
                          options={stateOptions.current}
                          value={state}
                          placeholder="Select state"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {selectedAmLevel === "city" && (
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="form_field label_top">
                      <label>City</label>
                      <div className="form_field_inner">
                        <Select
                          // value={designation}
                          // onChange={setDesignation}
                          // options={designationOptions}
                          placeholder="Select city"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="vg12"></div>
              <div className="btn_msg_area">
                <button
                  // onClick={handleEdCancelClick}
                  // disabled={isEdUpdating}
                  className={`theme_btn btn_border no_icon min_width ${
                    isEdUpdating ? "disabled" : ""
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAccessMgmt}
                  // disabled={isEdUpdating}
                  className={`theme_btn btn_fill no_icon min_width ${
                    isEdUpdating ? "disabled" : ""
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {userProfileDoc && userProfileDoc.isEmployee && (
          <div className="property_card_single mobile_full_card overflow_unset">
            <div className="more_detail_card_inner">
              <h2 className="card_title">
                Employee Detail
                <span
                  className={`material-symbols-outlined action_icon ${
                    isEdEditing ? "text_red" : "text_green"
                  }`}
                  onClick={
                    isEdEditing ? handleEdCancelClick : handleEdEditClick
                  }
                >
                  {isEdEditing ? "close" : "border_color"}
                </span>
              </h2>
              {!isEdEditing && (
                <div className="p_info">
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img
                        src="/assets/img/property-detail-icon/VisitingDays.png"
                        alt=""
                      />
                    </div>
                    <div className="pis_content">
                      <h6>Date of joining</h6>
                      <h5>
                        {userProfileDoc && userProfileDoc.dateOfJoining
                          ? format(
                              new Date(userProfileDoc.dateOfJoining), // Ensure it's converted to a Date object
                              "dd-MMM-yyyy"
                            )
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  {userProfileDoc && userProfileDoc.dateOfLeaving && (
                    <div className="p_info_single">
                      <div className="pd_icon">
                        <img
                          src="/assets/img/property-detail-icon/VisitingDays.png"
                          alt=""
                        />
                      </div>
                      <div className="pis_content">
                        <h6>Date of Leaving</h6>
                        <h5>
                          {userProfileDoc && userProfileDoc.dateOfLeaving
                            ? format(
                                new Date(userProfileDoc.dateOfLeaving), // Ensure it's converted to a Date object
                                "dd-MMM-yyyy"
                              )
                            : "Not provided yet"}
                        </h5>
                      </div>
                    </div>
                  )}
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/id.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Employee ID</h6>
                      <h5>
                        {userProfileDoc && userProfileDoc.employeeId
                          ? userProfileDoc.employeeId
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/department.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Department</h6>
                      <h5>
                        {userProfileDoc && userProfileDoc.department
                          ? userProfileDoc.department.value
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/designation.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Designation</h6>
                      <h5>
                        {userProfileDoc && userProfileDoc.designation
                          ? userProfileDoc.designation.value
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/id-card.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>UAN Number</h6>
                      <h5>
                        {userProfileDoc && userProfileDoc.uanNumber
                          ? userProfileDoc.uanNumber
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/id-card.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>PAN Number</h6>
                      <h5>
                        {userProfileDoc && userProfileDoc.panNumber
                          ? userProfileDoc.panNumber
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/id-card.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Aadhar Number</h6>
                      <h5>
                        {userProfileDoc && userProfileDoc.aadhaarNumber
                          ? userProfileDoc.aadhaarNumber
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                </div>
              )}

              {isEdEditing && (
                <>
                  <div className="row row_gap form_full mt-4">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Date of Joining*</label>
                        <div className="form_field_inner">
                          <input
                            type="date"
                            value={dateOfJoining}
                            onChange={(e) => setDateOfJoining(e.target.value)}
                            placeholder="Select Date of Joining"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Employee ID*</label>
                        <div className="form_field_inner">
                          <input
                            type="number"
                            value={employeeId}
                            // onChange={(e) => setEmployeeId(e.target.value)}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (newValue.length <= 4) {
                                setEmployeeId(newValue);
                              }
                            }}
                            maxLength="4"
                            placeholder="Enter Employee ID"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Department*</label>
                        <div className="form_field_inner">
                          <Select
                            // isMulti
                            value={department}
                            onChange={setDepartment}
                            options={departmentOptions}
                            placeholder="Select Department"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Designation*</label>
                        <div className="form_field_inner">
                          <Select
                            value={designation}
                            onChange={setDesignation}
                            options={designationOptions}
                            placeholder="Select Designation"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Manager Name*</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            value={managerName}
                            onChange={(e) => setManagerName(e.target.value)}
                            placeholder="Enter Manager Name"
                            onKeyPress={(e) => {
                              const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces allowed
                              if (!regex.test(e.key)) {
                                e.preventDefault(); // Prevent invalid input
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>UAN Number</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            value={uanNumber}
                            // onChange={(e) => setUanNumber(e.target.value)}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (newValue.length <= 12) {
                                setUanNumber(newValue);
                              }
                            }}
                            placeholder="Enter UAN Number"
                            maxLength="12"
                            style={{
                              textTransform: "uppercase",
                            }}
                          />
                        </div>
                      </div>
                    </div>{" "}
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>PAN Number*</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            value={panNumber}
                            onChange={(e) => {
                              const newValue = e.target.value.replace(
                                /\s+/g,
                                ""
                              ); // Remove spaces
                              if (newValue.length <= 10) {
                                setPanNumber(newValue);
                              }
                            }}
                            style={{
                              textTransform: "uppercase",
                            }}
                            placeholder="Enter PAN Number"
                            maxLength="10"
                          />
                        </div>
                      </div>
                    </div>{" "}
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Aadhaar Number*</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            value={aadhaarNumber}
                            onChange={(e) => {
                              const input = e.target.value.replace(/\s/g, ""); // Remove any existing spaces
                              if (/^\d*$/.test(input) && input.length <= 12) {
                                // Allow only digits and max 12 characters
                                const formatted =
                                  input
                                    .match(/.{1,4}/g) // Group digits in chunks of 4
                                    ?.join(" ") || ""; // Join chunks with a space
                                setAadhaarNumber(formatted);
                              }
                            }}
                            placeholder="Enter Aadhaar Number"
                          />
                        </div>
                      </div>
                    </div>
                    {userProfileDoc && userProfileDoc.dateOfJoining && (
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form_field label_top">
                          <label>Date of Leaving</label>
                          <div className="form_field_inner">
                            <input
                              type="date"
                              value={dateOfLeaving}
                              onChange={(e) => setDateOfLeaving(e.target.value)}
                              min={dateOfJoining} // Ensure only dates after Date of Joining can be selected
                              placeholder="Select Date of Leaving"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="btn_msg_area">
                    {employeeDetailUpdateMessage && (
                      <p className={`msg_area ${edMessageType}`}>
                        {employeeDetailUpdateMessage}
                      </p>
                    )}

                    <button
                      onClick={handleEdCancelClick}
                      disabled={isEdUpdating}
                      className={`theme_btn btn_border no_icon min_width ${
                        isEdUpdating ? "disabled" : ""
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateEmployeeDetails}
                      disabled={isEdUpdating}
                      className={`theme_btn btn_fill no_icon min_width ${
                        isEdUpdating ? "disabled" : ""
                      }`}
                    >
                      {isEdUpdating ? "Saving..." : "Save"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {userProfileDoc && userProfileDoc.isEmployee && (
          <div className="property_card_single mobile_full_card overflow_unset">
            <div className="more_detail_card_inner">
              <h2 className="card_title">
                Vehicle Detail
                <span
                  className={`material-symbols-outlined action_icon ${
                    isVdEditing ? "text_red" : "text_green"
                  }`}
                  onClick={
                    isVdEditing ? handleVdCancelClick : handleVdEditClick
                  }
                >
                  {isVdEditing ? "close" : "border_color"}
                </span>
              </h2>
              {!isVdEditing && (
                <div className="p_info">
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/steering-wheel.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Is Vehicle</h6>
                      <h5>
                        {userProfileDoc && userProfileDoc.vehicleStatus === true
                          ? "Yes"
                          : "No"}
                      </h5>
                    </div>
                  </div>
                  {userProfileDoc && userProfileDoc.vehicleStatus === true ? (
                    <div className="p_info_single">
                      <div className="pd_icon">
                        <img
                          src={`/assets/img/edicon/${
                            userProfileDoc
                              ? userProfileDoc.vehicleType === "2-Wheeler"
                                ? "bike.png"
                                : userProfileDoc.vehicleType === "4-Wheeler"
                                ? "car.png"
                                : "vehicles.png"
                              : "vehicles.png"
                          }`}
                          alt=""
                        />
                      </div>
                      <div className="pis_content">
                        <h6>Vehicle Type</h6>

                        <h5>
                          {userProfileDoc && userProfileDoc.vehicleType
                            ? userProfileDoc.vehicleType
                            : "Not provided yet"}
                        </h5>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {userProfileDoc && userProfileDoc.vehicleStatus === true ? (
                    <div className="p_info_single">
                      <div className="pd_icon">
                        <img src="/assets/img/edicon/numberplate.png" alt="" />
                      </div>
                      <div className="pis_content">
                        <h6>Number Plate</h6>
                        <h5>
                          {userProfileDoc && userProfileDoc.vehicleNumberPlate
                            ? userProfileDoc.vehicleNumberPlate
                            : "Not provided yet"}
                        </h5>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {userProfileDoc && userProfileDoc.vehicleStatus === true ? (
                    <div className="p_info_single">
                      <div className="pd_icon">
                        <img src="/assets/img/edicon/id-card.png" alt="" />
                      </div>
                      <div className="pis_content">
                        <h6>Driving Licence</h6>
                        <h5>
                          {userProfileDoc && userProfileDoc.drivingLicence
                            ? userProfileDoc.drivingLicence
                            : "Not provided yet"}
                        </h5>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}

              {isVdEditing && (
                <>
                  <div className="row row_gap form_full mt-4">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field st-2 label_top">
                        <label htmlFor="">Is Vehicle*</label>
                        <div className="radio_group">
                          <div className="radio_group_single">
                            <div
                              className={
                                vehicleStatus === true
                                  ? "custom_radio_button radiochecked"
                                  : "custom_radio_button"
                              }
                            >
                              <input
                                type="radio"
                                name="vehicleStatus"
                                id="vsyes"
                                value="true"
                                onChange={() => setVehicleStatus(true)}
                                checked={vehicleStatus === true}
                              />

                              <label htmlFor="vsyes">
                                <div className="radio_icon">
                                  <span className="material-symbols-outlined add">
                                    add
                                  </span>
                                  <span className="material-symbols-outlined check">
                                    done
                                  </span>
                                </div>
                                <h6>Yes</h6>
                              </label>
                            </div>
                          </div>
                          <div className="radio_group_single">
                            <div
                              className={
                                vehicleStatus !== true
                                  ? "custom_radio_button radiochecked"
                                  : "custom_radio_button"
                              }
                            >
                              <input
                                type="radio"
                                name="vehicleStatus"
                                id="vsno"
                                value="false"
                                onChange={() => setVehicleStatus(false)}
                                checked={vehicleStatus === false}
                              />

                              <label htmlFor="vsno">
                                <div className="radio_icon">
                                  <span className="material-symbols-outlined add">
                                    add
                                  </span>
                                  <span className="material-symbols-outlined check">
                                    done
                                  </span>
                                </div>
                                <h6>No</h6>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="form_field_inner">
                          <Select
                            // isMulti
                            value={vehicleStatus}
                            onChange={setVehicleStatus}
                            options={vehicleStatusOptions}
                            placeholder="Select"
                          />
            
                        </div> */}
                    </div>
                    {userProfileDoc && vehicleStatus === true && (
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        {/* <div className="form_field label_top">
                          <label>Vehicle Type*</label>
                          <div className="form_field_inner">
                            <Select
                              value={vehicleType}
                              onChange={setVehicleType}
                              options={vehicleTypeOptions}
                              placeholder="Select Vehicle Type"
                            />
                          </div>
                        </div> */}
                        <div className="form_field st-2 label_top">
                          <label htmlFor="">Vehicle Type*</label>
                          <div className="radio_group">
                            <div className="radio_group_single">
                              <div
                                className={
                                  vehicleType === "2-Wheeler"
                                    ? "custom_radio_button radiochecked"
                                    : "custom_radio_button"
                                }
                              >
                                <input
                                  type="radio"
                                  name="vehicleType"
                                  id="2-Wheeler"
                                  value="2-Wheeler"
                                  onChange={() => setVehicleType("2-Wheeler")}
                                  checked={vehicleType === "2-Wheeler"}
                                />

                                <label htmlFor="2-Wheeler">
                                  <div className="radio_icon">
                                    <span className="material-symbols-outlined add">
                                      add
                                    </span>
                                    <span className="material-symbols-outlined check">
                                      done
                                    </span>
                                  </div>
                                  <h6>2-Wheeler</h6>
                                </label>
                              </div>
                            </div>
                            <div className="radio_group_single">
                              <div
                                className={
                                  vehicleType === "4-Wheeler"
                                    ? "custom_radio_button radiochecked"
                                    : "custom_radio_button"
                                }
                              >
                                <input
                                  type="radio"
                                  name="4-Wheeler"
                                  id="4-Wheeler"
                                  value="4-Wheeler"
                                  onChange={() => setVehicleType("4-Wheeler")}
                                  checked={vehicleType === "4-Wheeler"}
                                />

                                <label htmlFor="4-Wheeler">
                                  <div className="radio_icon">
                                    <span className="material-symbols-outlined add">
                                      add
                                    </span>
                                    <span className="material-symbols-outlined check">
                                      done
                                    </span>
                                  </div>
                                  <h6>4-Wheeler</h6>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {userProfileDoc && vehicleStatus === true && (
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form_field label_top">
                          <label>Number Plate</label>
                          <div className="form_field_inner">
                            <input
                              type="text"
                              value={vehicleNumberPlate}
                              onChange={(e) =>
                                setVehicleNumberPlate(e.target.value)
                              }
                              placeholder="Enter Number Plate"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {userProfileDoc && vehicleStatus === true && (
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form_field label_top">
                          <label>Driving Licence Number</label>
                          <div className="form_field_inner">
                            <input
                              type="text"
                              value={drivingLicence}
                              onChange={(e) =>
                                setDrivingLicence(e.target.value)
                              }
                              placeholder="Enter Driving Licence Number"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="btn_msg_area">
                    {vehicleDetailUpdateMessage && (
                      <p className={`msg_area ${vdMessageType}`}>
                        {vehicleDetailUpdateMessage}
                      </p>
                    )}

                    <button
                      onClick={handleVdCancelClick}
                      disabled={isVdUpdating}
                      className={`theme_btn btn_border no_icon min_width ${
                        isVdUpdating ? "disabled" : ""
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateVehicleDetail}
                      disabled={isVdUpdating}
                      className={`theme_btn btn_fill no_icon min_width ${
                        isVdUpdating ? "disabled" : ""
                      }`}
                    >
                      {isVdUpdating ? "Saving..." : "Save"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {userProfileDoc && userProfileDoc.isEmployee && (
          <div className="property_card_single mobile_full_card overflow_unset">
            <div className="more_detail_card_inner">
              <h2 className="card_title">
                Employee Document
                {/* <span
                  className={`material-symbols-outlined action_icon ${
                    isRef2Editing ? "text_red" : "text_green"
                  }`}
                  onClick={
                    isRef2Editing ? handleRef2CancelClick : handleRef2EditClick
                  }
                >
                  {isRef2Editing ? "close" : "border_color"}
                </span> */}
              </h2>
              <div className="employee_docs">
                {documentTypes.map((docType) => (
                  <div key={docType} className="ed_single">
                    <div className="image_container relative">
                      {isDocUploading[docType] && (
                        <div className="loader">
                          <BeatLoader color={"#FF5733"} loading={true} />
                        </div>
                      )}
                      {renderFilePreview(docType)}
                    </div>
                    <div className=" ">
                      {isDocUploading[docType] ? (
                        <div className="uploader relative">
                          <span>
                            {Math.round(uploadDocInProgress[docType])}%
                          </span>
                          <div
                            className="u_bar"
                            style={{
                              width: `${Math.round(
                                uploadDocInProgress[docType]
                              )}%`,
                            }}
                          ></div>
                        </div>
                      ) : (
                        <div className="doc_name_upload">
                          <h6 className="doc_name">{docType}</h6>
                          <label
                            htmlFor={`upload_${docType}`}
                            className="upload_label"
                          >
                            <span class="material-symbols-outlined">
                              upload
                            </span>
                            <input
                              type="file"
                              id={`upload_${docType}`}
                              onChange={(e) => handleDocFileChange(e, docType)}
                              ref={(el) =>
                                (fileInputRefs.current[docType] = el)
                              }
                              style={{ display: "none" }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Modal
                  show={showConfirmModalForDeleteDoc}
                  onHide={() => setShowConfirmModalForDeleteDoc(false)}
                  centered
                >
                  <Modal.Header
                    className="justify-content-center"
                    style={{
                      paddingBottom: "0px",
                      border: "none",
                    }}
                  >
                    <h5>Confirm Deletion</h5>
                  </Modal.Header>
                  <Modal.Body
                    className="text-center"
                    style={{
                      color: "#FA6262",
                      fontSize: "20px",
                      border: "none",
                    }}
                  >
                    Are you sure you want to delete the uploaded {modalDocType}?
                  </Modal.Body>
                  <Modal.Footer
                    className="d-flex justify-content-between"
                    style={{
                      border: "none",
                      gap: "15px",
                    }}
                  >
                    <div
                      className="cancel_btn"
                      onClick={handleDeleteConfirm}
                      disabled={isUploadedDocDeleting}
                    >
                      {isUploadedDocDeleting ? "Deleting..." : "Yes"}
                    </div>
                    <div
                      className="done_btn"
                      onClick={() => setShowConfirmModalForDeleteDoc(false)}
                    >
                      No
                    </div>
                  </Modal.Footer>
                </Modal>{" "}
              </div>
            </div>
          </div>
        )}
        {userProfileDoc && userProfileDoc.isEmployee && (
          <div className="property_card_single mobile_full_card overflow_unset">
            <div className="more_detail_card_inner">
              <h2 className="card_title">
                Bank Detail
                <span
                  className={`material-symbols-outlined action_icon ${
                    isBankDetailEditing ? "text_red" : "text_green"
                  }`}
                  onClick={
                    isBankDetailEditing
                      ? handleBankDetailCancelClick
                      : handleBankDetailEditClick
                  }
                >
                  {isBankDetailEditing ? "close" : "border_color"}
                </span>
              </h2>
              {!isBankDetailEditing && (
                <div className="p_info for_ref">
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/accountholder.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>A/C Holder Name</h6>
                      <h5>
                        {userProfileDoc.bankDetail &&
                        userProfileDoc.bankDetail.acHolderName
                          ? userProfileDoc.bankDetail.acHolderName
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/accountnumber.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>A/C Number</h6>
                      <h5>
                        {userProfileDoc.bankDetail &&
                        userProfileDoc.bankDetail.acNumber
                          ? userProfileDoc.bankDetail.acNumber
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/bank.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Bank Name</h6>
                      <h5>
                        {userProfileDoc.bankDetail &&
                        userProfileDoc.bankDetail.bankName
                          ? userProfileDoc.bankDetail.bankName
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single ">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/branch.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Branch Name</h6>
                      <h5>
                        {userProfileDoc.bankDetail &&
                        userProfileDoc.bankDetail.branchName
                          ? userProfileDoc.bankDetail.branchName
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/ifsccode.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>IFSC Code</h6>
                      <h5>
                        {userProfileDoc.bankDetail &&
                        userProfileDoc.bankDetail.ifscCode
                          ? userProfileDoc.bankDetail.ifscCode
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                </div>
              )}

              {isBankDetailEditing && (
                <>
                  <div className="row row_gap form_full mt-4">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>A/C Holder Name*</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            name="acHolderName"
                            value={bankDetailFormData.acHolderName}
                            onChange={handleBankDetailChange}
                            required
                            placeholder="Type A/C holder name here"
                            onKeyPress={(e) => {
                              const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces allowed
                              if (!regex.test(e.key)) {
                                e.preventDefault(); // Prevent invalid input
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>A/C Number*</label>
                        <div className="form_field_inner">
                          <input
                            type="number"
                            name="acNumber"
                            value={bankDetailFormData.acNumber}
                            onChange={handleBankDetailChange}
                            required
                            placeholder="Type A/C number here"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Bank Name*</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            name="bankName"
                            value={bankDetailFormData.bankName}
                            onChange={handleBankDetailChange}
                            required
                            placeholder="Type bank name here"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Branch Name</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            name="branchName"
                            value={bankDetailFormData.branchName}
                            onChange={handleBankDetailChange}
                            required
                            placeholder="Type branch name here"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>IFSC Code*</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            name="ifscCode"
                            value={bankDetailFormData.ifscCode}
                            onChange={handleBankDetailChange}
                            required
                            placeholder="Type IFSC code here"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="btn_msg_area">
                    {saveBankDetailMessage && (
                      <p className={`msg_area ${BankDetailMessageType}`}>
                        {saveBankDetailMessage}
                      </p>
                    )}

                    <button
                      onClick={handleBankDetailCancelClick}
                      disabled={isBankDetailSaving}
                      className={`theme_btn btn_border no_icon min_width ${
                        isBankDetailSaving ? "disabled" : ""
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBankDetailSubmit}
                      disabled={isBankDetailSaving}
                      className={`theme_btn btn_fill no_icon min_width ${
                        isBankDetailSaving ? "disabled" : ""
                      }`}
                    >
                      {isBankDetailSaving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {userProfileDoc && userProfileDoc.isEmployee && (
          <div className="property_card_single mobile_full_card overflow_unset">
            <div className="more_detail_card_inner">
              <h2 className="card_title">
                Reference 1
                <span
                  className={`material-symbols-outlined action_icon ${
                    isRef1Editing ? "text_red" : "text_green"
                  }`}
                  onClick={
                    isRef1Editing ? handleRef1CancelClick : handleRef1EditClick
                  }
                >
                  {isRef1Editing ? "close" : "border_color"}
                </span>
              </h2>
              {!isRef1Editing && (
                <div className="p_info for_ref">
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/user.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Name</h6>
                      <h5>
                        {userProfileDoc.ref1 && userProfileDoc.ref1.name
                          ? userProfileDoc.ref1.name
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/mobile-phone.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Phone</h6>
                      <h5>
                        {userProfileDoc.ref1 && userProfileDoc.ref1.phone
                          ? userProfileDoc.ref1.phone.replace(
                              /(\d{2})(\d{5})(\d{5})/,
                              "+$1 $2-$3"
                            )
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/mail.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Email</h6>
                      <h5>
                        {userProfileDoc.ref1 && userProfileDoc.ref1.email
                          ? userProfileDoc.ref1.email
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single address">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/pin.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Address</h6>
                      <h5>
                        {userProfileDoc.ref1 && userProfileDoc.ref1.address
                          ? userProfileDoc.ref1.address
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single actions">
                    {userProfileDoc.ref1 && userProfileDoc.ref1.phone && (
                      <Link
                        to={`https://wa.me/+${
                          userProfileDoc.ref1 && userProfileDoc.ref1.phone
                        }`}
                        className="icon"
                      >
                        <img src="/assets/img/whatsappbig.png" alt="" />
                      </Link>
                    )}
                    {userProfileDoc.ref1 && userProfileDoc.ref1.phone && (
                      <Link
                        to={`tel:+${
                          userProfileDoc.ref1 && userProfileDoc.ref1.phone
                        }`}
                        className="icon"
                      >
                        <img src="/assets/img/call-icon.png" alt="" />
                      </Link>
                    )}
                    {userProfileDoc.ref1 && userProfileDoc.ref1.email && (
                      <Link
                        to={`mailto:${
                          userProfileDoc.ref1 && userProfileDoc.ref1.email
                        }`}
                        className="icon"
                      >
                        <img src="/assets/img/gmailbig.png" alt="" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {isRef1Editing && (
                <>
                  <div className="row row_gap form_full mt-4">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Name*</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            name="name"
                            value={ref1FormData.name}
                            onChange={handleChange}
                            required
                            placeholder="Type name here"
                            onKeyPress={(e) => {
                              const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces allowed
                              if (!regex.test(e.key)) {
                                e.preventDefault(); // Prevent invalid input
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Phone Number*</label>
                        <div className="form_field_inner">
                          <PhoneInput
                            country={"in"}
                            id="contact"
                            onlyCountries={["in", "us", "ae"]}
                            value={ref1FormData.phone}
                            onChange={handleChangePhone}
                            international
                            keyboardType="phone-pad"
                            countryCodeEditable={true}
                            placeholder="Country code + mobile number"
                            inputProps={{
                              name: "phone",
                              required: true,
                              autoFocus: false,
                            }}
                            inputStyle={{
                              width: "100%",
                              paddingLeft: "45px",
                            }}
                            buttonStyle={{
                              textAlign: "left",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Email</label>
                        <div className="form_field_inner">
                          <input
                            type="email"
                            name="email"
                            value={ref1FormData.email}
                            onChange={handleChange}
                            required
                            placeholder="Type email here"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form_field label_top">
                        <label>Address*</label>
                        <div className="form_field_inner">
                          <textarea
                            name="address"
                            value={ref1FormData.address}
                            onChange={handleChange}
                            required
                            placeholder="Type full address here"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="btn_msg_area">
                    {saveRef1Message && (
                      <p className={`msg_area ${ref1MessageType}`}>
                        {saveRef1Message}
                      </p>
                    )}

                    <button
                      onClick={handleRef1CancelClick}
                      disabled={isRef1Saving}
                      className={`theme_btn btn_border no_icon min_width ${
                        isRef1Saving ? "disabled" : ""
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRef1Submit}
                      disabled={isRef1Saving}
                      className={`theme_btn btn_fill no_icon min_width ${
                        isRef1Saving ? "disabled" : ""
                      }`}
                    >
                      {isRef1Saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {userProfileDoc && userProfileDoc.isEmployee && (
          <div className="property_card_single mobile_full_card overflow_unset">
            <div className="more_detail_card_inner">
              <h2 className="card_title">
                Reference 2
                <span
                  className={`material-symbols-outlined action_icon ${
                    isRef2Editing ? "text_red" : "text_green"
                  }`}
                  onClick={
                    isRef2Editing ? handleRef2CancelClick : handleRef2EditClick
                  }
                >
                  {isRef2Editing ? "close" : "border_color"}
                </span>
              </h2>
              {!isRef2Editing && (
                <div className="p_info for_ref">
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/user.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Name</h6>
                      <h5>
                        {userProfileDoc.ref2 && userProfileDoc.ref2.name
                          ? userProfileDoc.ref2.name
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/mobile-phone.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Phone</h6>
                      <h5>
                        {userProfileDoc.ref2 && userProfileDoc.ref2.phone
                          ? userProfileDoc.ref2.phone.replace(
                              /(\d{2})(\d{5})(\d{5})/,
                              "+$1 $2-$3"
                            )
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/mail.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Email</h6>
                      <h5>
                        {userProfileDoc.ref2 && userProfileDoc.ref2.email
                          ? userProfileDoc.ref2.email
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single address">
                    <div className="pd_icon">
                      <img src="/assets/img/edicon/pin.png" alt="" />
                    </div>
                    <div className="pis_content">
                      <h6>Address</h6>
                      <h5>
                        {userProfileDoc.ref2 && userProfileDoc.ref2.address
                          ? userProfileDoc.ref2.address
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                  <div className="p_info_single actions">
                    {userProfileDoc.ref2 && userProfileDoc.ref2.phone && (
                      <Link
                        to={`https://wa.me/+${
                          userProfileDoc.ref2 && userProfileDoc.ref2.phone
                        }`}
                        className="icon"
                      >
                        <img src="/assets/img/whatsappbig.png" alt="" />
                      </Link>
                    )}
                    {userProfileDoc.ref2 && userProfileDoc.ref2.phone && (
                      <Link
                        to={`tel:+${
                          userProfileDoc.ref2 && userProfileDoc.ref2.phone
                        }`}
                        className="icon"
                      >
                        <img src="/assets/img/call-icon.png" alt="" />
                      </Link>
                    )}
                    {userProfileDoc.ref2 && userProfileDoc.ref2.email && (
                      <Link
                        to={`mailto:${
                          userProfileDoc.ref2 && userProfileDoc.ref2.email
                        }`}
                        className="icon"
                      >
                        <img src="/assets/img/gmailbig.png" alt="" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {isRef2Editing && (
                <>
                  <div className="row row_gap form_full mt-4">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Name*</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            name="name"
                            value={ref2FormData.name}
                            onChange={handleRef2Change}
                            required
                            placeholder="Type name here"
                            onKeyPress={(e) => {
                              const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces allowed
                              if (!regex.test(e.key)) {
                                e.preventDefault(); // Prevent invalid input
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Phone Number*</label>
                        <div className="form_field_inner">
                          <PhoneInput
                            country={"in"}
                            id="contact"
                            onlyCountries={["in", "us", "ae"]}
                            value={ref2FormData.phone}
                            onChange={handleChangeRef2Phone}
                            international
                            keyboardType="phone-pad"
                            countryCodeEditable={true}
                            placeholder="Country code + mobile number"
                            inputProps={{
                              name: "phone",
                              required: true,
                              autoFocus: false,
                            }}
                            inputStyle={{
                              width: "100%",
                              paddingLeft: "45px",
                            }}
                            buttonStyle={{
                              textAlign: "left",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Email</label>
                        <div className="form_field_inner">
                          <input
                            type="email"
                            name="email"
                            value={ref2FormData.email}
                            onChange={handleRef2Change}
                            required
                            placeholder="Type email here"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form_field label_top">
                        <label>Address*</label>
                        <div className="form_field_inner">
                          <textarea
                            name="address"
                            value={ref2FormData.address}
                            onChange={handleRef2Change}
                            required
                            placeholder="Type full address here"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="btn_msg_area">
                    {saveRef2Message && (
                      <p className={`msg_area ${ref2MessageType}`}>
                        {saveRef2Message}
                      </p>
                    )}

                    <button
                      onClick={handleRef2CancelClick}
                      disabled={isRef2Saving}
                      className={`theme_btn btn_border no_icon min_width ${
                        isRef2Saving ? "disabled" : ""
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRef2Submit}
                      disabled={isRef2Saving}
                      className={`theme_btn btn_fill no_icon min_width ${
                        isRef2Saving ? "disabled" : ""
                      }`}
                    >
                      {isRef2Saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {/* <div className="upload-user-documents">
          <h2>Upload Documents</h2>
          <div className="document-upload-container">
            {documentTypes.map((docType) => (
              <div key={docType} className="document-upload">
                {docType === "Aadhaar Card" && (
                  <div>
                    {userProfileDoc && userProfileDoc.aadhaarcardUrl ? (
                      userProfileDoc.aadhaarcardType === "image" ? (
                        <img src={userProfileDoc.aadhaarcardUrl} alt="" />
                      ) : (
                        <iframe
                          title="PDF Viewer"
                          src={userProfileDoc.aadhaarcardUrl}
                          style={{
                            width: "100%",
                            aspectRatio: "3/2",
                          }}
                          className="pointer"
                        ></iframe>
                      )
                    ) : (
                      <img src="/assets/img/image_small_placeholder.png" alt="" />
                    )}
                  </div>
                )}
                {docType === "PAN Card" && (
                  <div>
                    {userProfileDoc && userProfileDoc.pancardUrl ? (
                      userProfileDoc.pancardType === "image" ? (
                        <img src={userProfileDoc.pancardUrl} alt="" />
                      ) : (
                        <iframe
                          title="PDF Viewer"
                          src={userProfileDoc.pancardUrl}
                          style={{
                            width: "100%",
                            aspectRatio: "3/2",
                          }}
                          className="pointer"
                        ></iframe>
                      )
                    ) : (
                      <img src="/assets/img/image_small_placeholder.png" alt="" />
                    )}
                  </div>
                )}
                   {docType === "Driving Licence" && (
                  <div>
                    {userProfileDoc && userProfileDoc.drivinglicenceUrl ? (
                      userProfileDoc.drivinglicenceType === "image" ? (
                        <img src={userProfileDoc.drivinglicenceUrl} alt="" />
                      ) : (
                        <iframe
                          title="PDF Viewer"
                          src={userProfileDoc.drivinglicenceUrl}
                          style={{
                            width: "100%",
                            aspectRatio: "3/2",
                          }}
                          className="pointer"
                        ></iframe>
                      )
                    ) : (
                      <img src="/assets/img/image_small_placeholder.png" alt="" />
                    )}
                  </div>
                )}

                <label
                  htmlFor={`upload_${docType}`}
                  className="upload-label pointer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "5px",
                    background: "var(--theme-green)",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  Upload {docType}
                  <input
                    type="file"
                    id={`upload_${docType}`}
                    onChange={(e) => handleDocFileChange(e, docType)}
                    ref={(el) => (fileInputRefs.current[docType] = el)}
                    style={{ display: "none" }}
                  />
                </label>
                {isDocUploading[docType] ? (
                  <div className="loader-container">
                    <BeatLoader color={"#FF5733"} loading={true} />
                    <p>Uploading {Math.round(uploadDocInProgress[docType])}%</p>
                  </div>
                ) : (
                  <p>No file selected</p>
                )}
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
