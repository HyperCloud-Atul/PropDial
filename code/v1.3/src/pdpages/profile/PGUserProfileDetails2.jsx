import React, { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import Gallery from "react-image-gallery";
import { Modal, Button } from "react-bootstrap";
import Switch from "react-switch";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useCommon } from "../../hooks/useCommon";
import { useFirestore } from "../../hooks/useFirestore";
import { format } from "date-fns";
import "./PGUserProfileDetails.scss";
import { text } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom";
export default function PGUserProfileDetails2() {
  const { userProfileId } = useParams();
  const { camelCase } = useCommon();

  const { document: userProfileDoc, error: userProfileDocError } = useDocument(
    "users-propdial",
    userProfileId
  );
  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("users-propdial");

  // full code for change role and bydefault check provided roles start
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [primaryRole, setPrimaryRole] = useState("");
  const [isRoleSaving, setIsRoleSaving] = useState(false);
  const [saveRoleMessage, setSaveRoleMessage] = useState("");
  const [roleMessageType, setRoleMessageType] = useState("");

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
  const [updateMessage, setUpdateMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

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
      setUpdateMessage("Please fill all required fields.");
      setTimeout(() => setUpdateMessage(""), 5000); // Clear message after 5 seconds
      return;
    }

    const dataSet = {
      employeeId,
      department: department.map((dept) => dept.value), // For multi-select, store the 'value' field
      designation: designation.value, // Store the 'value' from single select
      uanNumber,
      panNumber,
      aadhaarNumber,
    };

    setIsUpdating(true);
    setUpdateMessage("");

    try {
      await updateDocument(userProfileId, dataSet);
      setUpdateMessage("Employee details updated successfully!");
    } catch (error) {
      console.error("Error updating employee details:", error);
      setUpdateMessage("Failed to update employee details. Please try again.");
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateMessage(""), 5000); // Clear message after 5 seconds
    }
  };

  // code for active inactive
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

  // code for is employee

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
            {/* <h2 className="card_title">About Property</h2> */}
            <div className="p_info">
              <div className="p_info_single">
                <div className="pd_icon">
                  <img
                    src="/assets/img/property-detail-icon/VisitingDays.png"
                    alt=""
                  />
                </div>
                <div className="pis_content">
                  <h6>Date of Joinee</h6>
                  <h5>
                    {userProfileDoc && userProfileDoc.dateofJoinee
                      ? format(
                          userProfileDoc.dateofJoinee.toDate(),
                          "dd-MMM-yyyy"
                        )
                      : ""}
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
                  <h6>Date of Leaving</h6>
                  <h5>
                    {userProfileDoc && userProfileDoc.dateofLeaving
                      ? format(
                          userProfileDoc.dateofLeaving.toDate(),
                          "dd-MMM-yyyy"
                        )
                      : "NA"}
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
                  <h6>Last Logged-in</h6>
                  <h5>
                    {userProfileDoc && userProfileDoc.dateofJoinee
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
              {/* <div className="form_field outline blue_single">
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
                      />
                      <label htmlFor="active">active</label>
                    </div>
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="user_status"
                        value="inactive"
                        id="inactive"
                        checked={
                          userProfileDoc && userProfileDoc.status === "inactive"
                        }
                        //   onChange={() => handleRoleChange("frontdesk")}
                      />
                      <label htmlFor="inactive">inactive</label>
                    </div>
                  </div>
                </div>
              </div> */}
              <div>
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
                          checked={isEmployee === true}
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
                          checked={isEmployee === false}
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
            <h2 className="card_title">Roles</h2>
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
                        checked={selectedRoles.includes(id)}
                        onChange={() => handleRoleChange(id)}
                      />
                      <label htmlFor={id}>{label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="btn_msg_area">
            
              <button
                onClick={handleSaveRole}
                disabled={isRoleSaving}
                className={`theme_btn btn_fill no_icon min_width ${
                  isRoleSaving ? "disabled" : ""
                }`}
              >
                {isRoleSaving ? "Saving..." : "Save"}
              </button> 
              {saveRoleMessage && (
                <p className={`msg_area ${roleMessageType}`}>{saveRoleMessage}</p>
              )}            
            </div>
          </div>
        </div>
        {isEmployee && (
          <div className="update-employee-form">
            <div className="form-field">
              <label>Employee ID</label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter Employee ID"
              />
            </div>

            <div className="form-field">
              <label>Department</label>
              <Select
                isMulti
                value={department}
                onChange={setDepartment}
                options={departmentOptions}
                placeholder="Select Department(s)"
              />
            </div>

            <div className="form-field">
              <label>Designation</label>
              <Select
                value={designation}
                onChange={setDesignation}
                options={designationOptions}
                placeholder="Select Designation"
              />
            </div>

            <div className="form-field">
              <label>UAN Number</label>
              <input
                type="text"
                value={uanNumber}
                onChange={(e) => setUanNumber(e.target.value)}
                placeholder="Enter UAN Number"
              />
            </div>

            <div className="form-field">
              <label>PAN Number</label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                placeholder="Enter PAN Number"
              />
            </div>

            <div className="form-field">
              <label>Aadhaar Number</label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                placeholder="Enter Aadhaar Number"
              />
            </div>

            <div className="form-field">
              <button
                onClick={handleUpdateEmployeeDetails}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Update Employee Details"}
              </button>
            </div>

            {updateMessage && <p className="update-message">{updateMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
