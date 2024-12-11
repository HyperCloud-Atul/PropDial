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
import PhoneInput from "react-phone-input-2";

// import scss
import "./PGUserProfileDetails.scss";

export default function PGUserProfileDetails2() {
  const { userProfileId } = useParams();
  const { camelCase } = useCommon();

  // get and update code start
  const { document: userProfileDoc, error: userProfileDocError } = useDocument(
    "users-propdial",
    userProfileId
  );
  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("users-propdial");
  // get and update code end

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

  // Function to handle the submission of the status change
  const handlePopupSubmit = async () => {
    setLoading(true);
    try {
      const currentDate = new Date();

      const updateData = {
        status: popupData.status,
        activeBy: popupData.status === "active" ? "Admin" : null, // replace with your logic
        activeAt: popupData.status === "active" ? currentDate : null, // replace with your logic
        inactiveBy: popupData.status === "inactive" ? "Admin" : null,
        inactiveAt: popupData.status === "inactive" ? currentDate : null,
      };

      // Add to the 'inactiveByAt' array to track status changes
      if (popupData.status === "inactive") {
        // Append inactive status details to the map
        updateData.inactiveByAt = userProfileDoc.inactiveByAt || [];
        updateData.inactiveByAt.push({
          inactiveBy: "Admin", // Replace with actual user who is marking inactive
          inactiveAt: currentDate, // Store the current timestamp
        });
      }

      if (popupData.status === "active") {
        // Append active status details to the map
        updateData.activeByAt = userProfileDoc.activeByAt || [];
        updateData.activeByAt.push({
          activeBy: "Admin", // Replace with actual user who is marking active
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
  const handleRoleChange = (role) => {
    if (selectedRoles.includes(role)) {
      // Remove role if already selected
      const updatedRoles = selectedRoles.filter((item) => item !== role);
      setSelectedRoles(updatedRoles);

      // Update primary role if the removed role was the primary one
      if (primaryRole === role && updatedRoles.length > 0) {
        setPrimaryRole(updatedRoles[0]);
      } else if (updatedRoles.length === 0) {
        setPrimaryRole("");
      }
    } else {
      // Add role if not selected
      const updatedRoles = [...selectedRoles, role];
      setSelectedRoles(updatedRoles);

      // Set the first selected role as the primary role
      if (primaryRole === "") {
        setPrimaryRole(role);
      }
    }
  };

  // Handle save button click
  const handleSaveRole = async () => {
    if (selectedRoles.length === 0) {
      setSaveRoleMessage("Please select at least one role.");
      setRoleMessageType("error_msg");
      setTimeout(() => {
        setSaveRoleMessage("");
        setRoleMessageType("");
      }, 5000); // Clear message after 5 seconds
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
      }, 5000); // Clear message after 5 seconds
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
      }, 5000);
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
      }, 5000); // Clear message after 5 seconds
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
  const [department, setDepartment] = useState([]);
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
      setDepartment(
        userProfileDoc.department
          ? userProfileDoc.department.map((dept) => ({
              value: dept,
              label: dept,
            }))
          : []
      );
      setDesignation(
        userProfileDoc.designation
          ? {
              value: userProfileDoc.designation,
              label: userProfileDoc.designation,
            }
          : ""
      );
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
      setDepartment(
        userProfileDoc.department
          ? userProfileDoc.department.map((dept) => ({
              value: dept,
              label: dept,
            }))
          : []
      );
      setDesignation(
        userProfileDoc.designation
          ? {
              value: userProfileDoc.designation,
              label: userProfileDoc.designation,
            }
          : ""
      );
      setUanNumber(userProfileDoc.uanNumber || "");
      setPanNumber(userProfileDoc.panNumber || "");
      setAadhaarNumber(userProfileDoc.aadhaarNumber || "");
      setDateOfJoining(userProfileDoc.dateOfJoining || "");
      setDateOfLeaving(
        userProfileDoc.dateOfJoining ? userProfileDoc.dateOfLeaving || "" : ""
      );
      setManagerName(userProfileDoc.managerName || "");
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
      !uanNumber ||
      !panNumber ||
      !aadhaarNumber ||
      !designation ||
      department.length === 0
    ) {
      setEmployeeDetailUpdateMessage("Please fill all required fields.");
      setEdMessageType("error_msg");
      setTimeout(() => {
        setEmployeeDetailUpdateMessage("");
        setEdMessageType("");
      }, 5000); // Clear message after 5 seconds

      return;
    }
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
      }, 5000);
      return;
    }

    const dataSet = {
      employeeId,
      department: department.map((dept) => dept.value),
      designation: designation.value,
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
      }, 5000);
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
      }, 5000); // Clear message after 5 seconds
    }
  };
  // full code for employee detail end

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

  // full code for ref1
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
    if (
      !ref1FormData.name ||
      !ref1FormData.phone ||
      !ref1FormData.email ||
      !ref1FormData.address
    ) {
      setSaveRef1Message("Please fill all required fields.");
      setRef1MessageType("error_msg");
      setTimeout(() => {
        setSaveRef1Message("");
        setRef1MessageType("");
      }, 5000);
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(ref1FormData.email)) {
      setSaveRef1Message("Please enter a valid email address.");
      setRef1MessageType("error_msg");
      setTimeout(() => {
        setSaveRef1Message("");
        setRef1MessageType("");
      }, 5000);
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
      }, 5000);
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
      }, 5000);
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
    if (
      !ref2FormData.name ||
      !ref2FormData.phone ||
      !ref2FormData.email ||
      !ref2FormData.address
    ) {
      setSaveRef2Message("Please fill all required fields.");
      setRef2MessageType("error_msg");
      setTimeout(() => {
        setSaveRef2Message("");
        setRef2MessageType("");
      }, 5000);
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(ref2FormData.email)) {
      setSaveRef2Message("Please enter a valid email address.");
      setRef2MessageType("error_msg");
      setTimeout(() => {
        setSaveRef2Message("");
        setRef2MessageType("");
      }, 5000);
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
      }, 5000);
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
      }, 5000);
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
      !bankDetailFormData.branchName ||
      !bankDetailFormData.ifscCode
    ) {
      setSaveBankDetailMessage("Please fill all required fields.");
      setBankDetailMessageType("error_msg");
      setTimeout(() => {
        setSaveBankDetailMessage("");
        setBankDetailMessageType("");
      }, 5000);
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
      }, 5000);
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
      }, 5000);
    }
  };
  // full code for ref2 end

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
            to={`https://wa.me/${userProfileDoc && userProfileDoc.phoneNumber}`}
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
                        <label htmlFor="active">Active</label>
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
                        <label htmlFor="inactive">Inactive</label>
                      </div>
                    </div>
                  </div>
                </div>
                <Modal
                  show={showPopup}
                  onHide={() => setShowPopup(false)}
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Confirm Status Change</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Are you sure you want to mark this user as{" "}
                      {popupData.status}?
                    </p>

                    {popupData.status === "inactive" && (
                      <div>
                        <div>
                          <label>Reason for Inactive:</label>
                          <div>
                            <input
                              type="radio"
                              name="reason"
                              value="resigned"
                              checked={reason === "resigned"}
                              onChange={() => setReason("resigned")}
                            />
                            <label>Resigned</label>
                            <input
                              type="radio"
                              name="reason"
                              value="leave"
                              checked={reason === "leave"}
                              onChange={() => setReason("leave")}
                            />
                            <label>On Leave</label>
                            <input
                              type="radio"
                              name="reason"
                              value="other"
                              checked={reason === "other"}
                              onChange={() => setReason("other")}
                            />
                            <label>Other</label>
                          </div>
                        </div>
                        <div>
                          <label>Remark:</label>
                          <textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            placeholder="Enter any remark..."
                          ></textarea>
                        </div>
                      </div>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={handlePopupSubmit}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Yes, Update"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowPopup(false)}
                    >
                      Cancel
                    </Button>
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
                  <Modal.Header closeButton>
                    <Modal.Title>Confirm Status Change</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Are you sure you want to mark this user as{" "}
                      {selectedEmployeeStatus === "yes"
                        ? "an employee"
                        : "not an employee"}
                      ?
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={handleUpdateIsEmployee}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Yes, Update"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowConfirmationPopup(false)}
                    >
                      Cancel
                    </Button>
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
                    { id: "owner", label: "Owner" },
                    { id: "frontdesk", label: "Frontdesk" },
                    { id: "executive", label: "Executive" },
                    { id: "admin", label: "Admin" },
                    { id: "agent", label: "Agent" },
                    { id: "superAdmin", label: "Super Admin" },
                    { id: "tenant", label: "Tenant" },
                    { id: "prospectiveTenant", label: "Prospective Tenant" },
                    { id: "buyer", label: "Buyer" },
                    { id: "prospectiveBuyer", label: "Prospective Buyer" },
                  ].map(({ id, label }) => (
                    <div className="radio_single" key={id}>
                      <input
                        type="checkbox"
                        name="user_role"
                        value={id}
                        id={id}
                        disabled={!isRoleEditing}
                        checked={selectedRoles.includes(id)}
                        onChange={() => handleRoleChange(id)}
                      />
                      <label htmlFor={id}>{label}</label>
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
                          ? userProfileDoc.department
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
                          ? userProfileDoc.designation
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
                  <div className="row row_gap form_full">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Date of Joining</label>
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
                            onChange={(e) => setEmployeeId(e.target.value)}
                            placeholder="Enter Employee ID"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Department</label>
                        <div className="form_field_inner">
                          <Select
                            // isMulti
                            value={department}
                            onChange={setDepartment}
                            options={departmentOptions}
                            placeholder="Select Department(s)"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Designation</label>
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
                        <label>Manager Name</label>
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
                            type="number"
                            value={uanNumber}
                            onChange={(e) => setUanNumber(e.target.value)}
                            placeholder="Enter UAN Number"
                          />
                        </div>
                      </div>
                    </div>{" "}
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>PAN Number</label>
                        <div className="form_field_inner">
                          <input
                            type="text"
                            value={panNumber}
                            onChange={(e) => setPanNumber(e.target.value)}
                            placeholder="Enter PAN Number"
                          />
                        </div>
                      </div>
                    </div>{" "}
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form_field label_top">
                        <label>Aadhaar Number</label>
                        <div className="form_field_inner">
                          <input
                            type="number"
                            value={aadhaarNumber}
                            onChange={(e) => setAadhaarNumber(e.target.value)}
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
              Bank Detail
                <span
                  className={`material-symbols-outlined action_icon ${
                    isBankDetailEditing ? "text_red" : "text_green"
                  }`}
                  onClick={
                    isBankDetailEditing ? handleBankDetailCancelClick : handleBankDetailEditClick
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
                        {userProfileDoc.bankDetail && userProfileDoc.bankDetail.acHolderName
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
                        {userProfileDoc.bankDetail && userProfileDoc.bankDetail.acNumber ? userProfileDoc.bankDetail.acNumber : "Not provided yet"}                            
                          
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
                        {userProfileDoc.bankDetail && userProfileDoc.bankDetail.bankName
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
                        {userProfileDoc.bankDetail && userProfileDoc.bankDetail.branchName
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
                        {userProfileDoc.bankDetail && userProfileDoc.bankDetail.ifscCode
                          ? userProfileDoc.bankDetail.ifscCode
                          : "Not provided yet"}
                      </h5>
                    </div>
                  </div>
                </div>
              )}

              {isBankDetailEditing && (
                <>
                  <div className="row row_gap form_full">
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
                        <label>Branch Name*</label>
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
                </div>
              )}

              {isRef1Editing && (
                <>
                  <div className="row row_gap form_full">
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
                        <label>Email*</label>
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
                </div>
              )}

              {isRef2Editing && (
                <>
                  <div className="row row_gap form_full">
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
                        <label>Email*</label>
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
      
      </div>
    </div>
  );
}
