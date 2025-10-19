import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { projectFirestore } from "../firebase/config";
import NineDots from "./NineDots";
import { useCommon } from "../hooks/useCommon";
import { useCollection } from "../hooks/useCollection";
import { Link } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { getNames } from "country-list";
import { useAuthContext } from "../hooks/useAuthContext";
import formatCountry from "../utils/formatCountry";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import AddTenantDocument from "./AddTenantDocument";
import { citizenshipOptions } from "../utils/citizenshipOptions";

// import scss

export default function TenantDetails() {
  const { tenantId } = useParams();
  const { camelCase } = useCommon();
  const { user } = useAuthContext();
  const [tenantData, setTenantData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fieldToEdit, setFieldToEdit] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { documents: dbUsers, error: dbuserserror } =
    useCollection("users-propdial");
  const [dbUserState, setdbUserState] = useState(dbUsers);
  // useEffect(() => {
  //   const fetchTenantAndUser = async () => {
  //     try {
  //       const tenantDoc = await projectFirestore
  //         .collection("tenants")
  //         .doc(tenantId)
  //         .get();

  //       if (!tenantDoc.exists) {
  //         console.warn("Tenant not found");
  //         setLoading(false);
  //         return;
  //       }

  //       const tenantInfo = tenantDoc.data();
  //       setTenantData(tenantInfo);

  //       const userId = tenantInfo.userId;

  //       if (userId) {
  //         const userDoc = await projectFirestore
  //           .collection("users-propdial")
  //           .doc(userId)
  //           .get();
  //         if (userDoc.exists) {
  //           setUserData(userDoc.data());
  //         } else {
  //           console.warn("User not found");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching tenant or user:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (tenantId) {
  //     fetchTenantAndUser();
  //   }
  // }, [tenantId]);
  useEffect(() => {
    if (!tenantId) return;

    const unsubscribeTenant = projectFirestore
      .collection("tenants")
      .doc(tenantId)
      .onSnapshot(async (tenantDoc) => {
        if (!tenantDoc.exists) {
          console.warn("Tenant not found");
          setTenantData(null);
          setUserData(null);
          setLoading(false);
          return;
        }

        const tenantInfo = tenantDoc.data();
        setTenantData(tenantInfo);
        setLoading(false);

        const userId = tenantInfo.userId;

        if (userId) {
          const unsubscribeUser = projectFirestore
            .collection("users-propdial")
            .doc(userId)
            .onSnapshot((userDoc) => {
              if (userDoc.exists) {
                setUserData(userDoc.data());
              } else {
                console.warn("User not found");
                setUserData(null);
              }
            });

          // Return user unsubscribe when tenant changes
          return () => unsubscribeUser();
        }
      });

    // Cleanup tenant listener on unmount
    return () => unsubscribeTenant();
  }, [tenantId]);

  const openEditModal = (field) => {
    setFieldToEdit(field);
    setSelectedDate(tenantData[field] ? new Date(tenantData[field]) : "");
    const modal = new window.bootstrap.Modal(
      document.getElementById("dateEditModal")
    );
    modal.show();
  };
  const handleSave = async () => {
    const updatedData = {
      ...tenantData,
      [fieldToEdit]: selectedDate.toISOString(),
    };

    await projectFirestore
      .collection("tenants")
      .doc(tenantId)
      .update({
        [fieldToEdit]: selectedDate.toISOString(),
      });

    setTenantData(updatedData);
    const modal = window.bootstrap.Modal.getInstance(
      document.getElementById("dateEditModal")
    );
    modal.hide();
  };

  const renderRow = (label, fieldKey) => {
    const isRentEndDisabled =
      fieldKey === "rentEndDate" && !tenantData.rentStartDate;

    return (
      
              <div className="p_info_single">
  <div className="pd_icon">
    <img
      src="/assets/img/property-detail-icon/VisitingDays.png"
      alt="propdial"
    />
  </div>
  <div className="pis_content">
    <h6>{label}</h6>
    <h5>
      {tenantData[fieldKey]
        ? format(new Date(tenantData[fieldKey]), "dd-MMM-yyyy")
        : "DD/MM/YY"}
      {!isRentEndDisabled && (
      
        <span
          className="ms-2 pointer"
          onClick={() => openEditModal(fieldKey)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#00a8a8"><path d="M96 0v-192h768V0H96Zm168-360h51l279-279-26-27-25-24-279 279v51Zm-72 72v-152.92L594-843q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24.1 15.94L747-792q11 11 16 24t5 27.4q0 13.49-4.95 26.54-4.95 13.05-15.75 23.85L345-288H192Zm503-455-51-49 51 49ZM594-639l-26-27-25-24 51 51Z"/></svg>
        </span>
      )}
    </h5>
  </div>
</div>

     
    );
  };

  // code for active inactive startF
  // Make sure that tenantDoc is not null before using it
  const [tenantStatus, setTenantStatus] = useState(
    tenantData?.status || "active"
  );
  const [popupData, setPopupData] = useState({});
  const [reason, setReason] = useState("");
  const [remark, setRemark] = useState("");
  const [tenantStatusLoading, setTenantStatusLoading] = useState(false);
  const [errorForNoSelectReasonMessage, setErrorForNoSelectReasonMessage] =
    useState("");
  const [showTenantStatusPopup, setShowTenantStatusPopup] = useState(false);
  const [tenantStatusData, setTenantStatusData] = useState({});
  const [tenantInactiveReason, setTenantInactiveReason] = useState("");
  const [tenantInactiveRemark, setTenantInactiveRemark] = useState("");
  const [tenantStatusReasonError, setTenantStatusReasonError] = useState("");

  // Function to handle status changes (active/inactive)
  const handleTenantStatusChange = (newStatus) => {
    setTenantStatus(newStatus);
    setTenantStatusData({ status: newStatus });
    setPopupData({ status: newStatus }); // ✅ this is the actual data used in submit
    setShowTenantStatusPopup(true);
  };

  // Function to handle the submission of the status change
  const handleTenantPopupSubmit = async () => {
    const status = tenantStatusData?.status;
    if (status === "inactive" && !tenantInactiveReason) {
      setTenantStatusReasonError(
        "Please select a reason before updating the status."
      );
      return;
    } else {
      setTenantStatusReasonError("");
    }
    setTenantStatusLoading(true);
    try {
      const currentDate = new Date();
      const updateData = {
        status,
        activeBy: status === "active" ? user.phoneNumber : null,
        activeAt: status === "active" ? currentDate : null,
        inactiveBy: status === "inactive" ? user.phoneNumber : null,
        inactiveAt: status === "inactive" ? currentDate : null,
        inactiveReason: status === "inactive" ? tenantInactiveReason : null,
        inactiveRemark: status === "inactive" ? tenantInactiveRemark : null,
      };
      if (status === "inactive") {
        updateData.inactiveByAt = tenantData.inactiveByAt || [];
        updateData.inactiveByAt.push({
          inactiveBy: user.phoneNumber,
          inactiveAt: currentDate,
          inactiveReason: tenantInactiveReason,
          inactiveRemark: tenantInactiveRemark,
        });
      }
      if (status === "active") {
        updateData.activeByAt = tenantData.activeByAt || [];
        updateData.activeByAt.push({
          activeBy: user.phoneNumber,
          activeAt: currentDate,
        });
      }
      await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .update(updateData);
      const propertyUsersSnapshot = await projectFirestore
        .collection("propertyusers")
        .where("tenantDocId", "==", tenantId)
        .get();

      // 🔄 Loop through matched documents (usually one, but supports multiple)
      const isCurrent = status === "active";
      const batch = projectFirestore.batch();

      propertyUsersSnapshot.forEach((doc) => {
        batch.update(doc.ref, { isCurrentProperty: isCurrent });
      });

      await batch.commit();
      setShowTenantStatusPopup(false);
    } catch (error) {
      console.error("Error updating tenant status:", error);
    } finally {
      setTenantStatusLoading(false);
    }
  };
  // code for active inactive end

  // code for address info card start
  const indiaStates = {
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bengaluru", "Mysore"],
    Delhi: ["New Delhi"],
    "Uttar Pradesh": ["Lucknow", "Noida", "Kanpur"],
    Gujarat: ["Ahmedabad", "Surat"],
  };
  const [tenant, setTenant] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    citizenship: "",
    country: "",
    state: "",
    city: "",
    permanentAddress: "",
  });

  useEffect(() => {
    const fetchTenant = async () => {
      const doc = await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .get();
      if (doc.exists) {
        const data = doc.data();
        setTenant(data);
        setFormData({
          citizenship: data.citizenship || "",
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          permanentAddress: data.permanentAddress || "",
        });
      }
    };
    fetchTenant();
  }, [tenantId]);

  const handleSaveTenantAddress = async () => {
    try {
      await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .update(formData);
      setEditMode(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const countryOptions = getNames().map((c) => ({ label: c, value: c }));
  const showStates = formData.country === "India";
  const stateOptions = showStates
    ? Object.keys(indiaStates).map((s) => ({ label: s, value: s }))
    : [];
  const cityOptions =
    showStates && indiaStates[formData.state]
      ? indiaStates[formData.state].map((c) => ({ label: c, value: c }))
      : [];
  // code for address info card end

  // company infor code start
  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    designation: "",
  });

  const [editCompanyMode, setEditCompanyMode] = useState(false);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const doc = await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .get();
      if (doc.exists) {
        const data = doc.data();
        setCompanyData({
          companyName: data.companyName || "",
          companyAddress: data.companyAddress || "",
          companyPhone: data.companyPhone || "",
          designation: data.designation || "",
        });
      }
    };
    fetchCompanyInfo();
  }, [tenantId]);

  const handleCompanySave = async () => {
    try {
      await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .update(companyData);
      setEditCompanyMode(false);
    } catch (err) {
      console.error("Company Info update failed", err);
    }
  };
  // company info code end

  // id card info code start
  const [idCardData, setIdCardData] = useState({
    aadharCard: "",
    panCard: "",
    gstNumber: "",
  });

  const [editIDCardMode, setEditIDCardMode] = useState(false);

  useEffect(() => {
    const fetchIDCardInfo = async () => {
      const doc = await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .get();
      if (doc.exists) {
        const data = doc.data();
        setIdCardData({
          aadharCard: data.aadharCard || "",
          panCard: data.panCard || "",
          gstNumber: data.gstNumber || "",
        });
      }
    };
    fetchIDCardInfo();
  }, [tenantId]);

  const handleIDCardSave = async () => {
    try {
      await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .update(idCardData);
      setEditIDCardMode(false);
    } catch (err) {
      console.error("ID Card info update failed", err);
    }
  };

  // id card info code end

  // previous landloard detail code start
  const [landlordData, setLandlordData] = useState({
    previousLandlordName: "",
    previousLandlordPhone: "",
  });

  const [editLandlordMode, setEditLandlordMode] = useState(false);

  useEffect(() => {
    const fetchLandlordInfo = async () => {
      const doc = await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .get();
      if (doc.exists) {
        const data = doc.data();
        setLandlordData({
          previousLandlordName: data.previousLandlordName || "",
          previousLandlordPhone: data.previousLandlordPhone || "",
        });
      }
    };
    fetchLandlordInfo();
  }, [tenantId]);

  const handleLandlordSave = async () => {
    try {
      await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .update(landlordData);
      setEditLandlordMode(false);
    } catch (err) {
      console.error("Landlord info update failed", err);
    }
  };
  //  previous landloard detail code end

  // family or bachelor code start
  const [familyBachelorData, setFamilyBachelorData] = useState({
    familyType: "Family",
    totalFamilyMembers: "",
    spouseName: "",
    spousePhone: "",
    spouseEmail: "",
  });

  const [editFamilyMode, setEditFamilyMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const doc = await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .get();
      if (doc.exists) {
        const data = doc.data();
        setFamilyBachelorData({
          familyType: data.familyType || "Family",
          totalFamilyMembers: data.totalFamilyMembers || "",
          spouseName: data.spouseName || "",
          spousePhone: data.spousePhone || "",
          spouseEmail: data.spouseEmail || "",
        });
      }
    };
    fetchData();
  }, [tenantId]);

  const handleSaveFamilyBachelor = async () => {
    try {
      await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .update(familyBachelorData);
      setEditFamilyMode(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };
  // family or bachelor code end

  // family member code start
  const [editFamilyMembers, setEditFamilyMembers] = useState(false);
  const [totalMembersAllowed, setTotalMembersAllowed] = useState(0);
  const [familyMembersList, setFamilyMembersList] = useState([]);

  useEffect(() => {
    const fetchTenantData = async () => {
      const doc = await projectFirestore
        .collection("tenants")
        .doc(tenantId)
        .get();
      if (doc.exists) {
        const data = doc.data();
        setTotalMembersAllowed(parseInt(data.totalFamilyMembers) || 0);
        setFamilyMembersList(data.familyMembers || []);
      }
    };

    fetchTenantData();
  }, [tenantId]);

  const handleInputChange = (index, field, value) => {
    const updated = [...familyMembersList];
    updated[index][field] = value;
    setFamilyMembersList(updated);
  };

  const handleAddMember = () => {
    if (familyMembersList.length >= totalMembersAllowed) return;
    setFamilyMembersList([
      ...familyMembersList,
      {
        name: "",
        gender: "",
        age: "",
        mobile: "",
        email: "",
        relationship: "",
      },
    ]);
  };

  const handleRemoveMember = (index) => {
    const updated = [...familyMembersList];
    updated.splice(index, 1);
    setFamilyMembersList(updated);
  };

  const handleSaveFamilyMember = async () => {
    try {
      await projectFirestore.collection("tenants").doc(tenantId).update({
        familyMembers: familyMembersList,
      });
      setEditFamilyMembers(false);
    } catch (err) {
      console.error("Failed to update family members", err);
    }
  };
  // family member code end
  if (loading) return <div>Loading...</div>;

  // nine dots menu start
  const nineDotsMenu = [
    // { title: "Country's List", link: "/countrylist", icon: "public" },
    { title: "User List", link: "/userlist", icon: "groups" },
    {
      title: "Attendance Dashboard",
      link: "/attendance-dashboard",
      icon: "alarm",
    },
  ];
  // nine dots menu end
  return (
    <div className="top_header_pg pg_bg user_detail_pg relative">
      <NineDots nineDotsMenu={nineDotsMenu} />
      <div className="basic_info relative">
        {tenantData?.status === "inactive" && (
  <div className="inactive_overlay"></div>
        )}
      
        <div
          className="pic_are relative"
          style={{
            backgroundImage: "url(/assets/img/profile_img_bg.jpg)",
          }}
        >
          <div className="pic">
            <img
              src={userData && userData.photoURL}
              alt="user img"
              style={{
                borderColor:
                  userData &&
                  camelCase(
                    userData.status === "active"
                      ? "var(--theme-green2)"
                      : "var(--theme-red)"
                  ),
              }}
            />
          </div>
          <Link
            to={`mailto:${userData && userData.email}`}
            className="icon left"
          >
            <img src="/assets/img/gmailbig.png" alt="propdial" />
          </Link>
          <Link
            to={`https://wa.me/+${userData && userData.phoneNumber}`}
            className="icon right"
          >
            <img src="/assets/img/whatsappbig.png" alt="propdial" />
          </Link>
        </div>
        <div className="p_info">
          <h5>{userData && userData.fullName}</h5>
          {userData?.phoneNumber && (
            <h6 className="t_number">
              {(() => {
                try {
                  const phoneNumber = parsePhoneNumberFromString(
                    userData.phoneNumber,
                    userData.countryCode?.toUpperCase()
                  );
                  return phoneNumber
                    ? phoneNumber.formatInternational()
                    : userData.phoneNumber;
                } catch (error) {
                  return userData.phoneNumber;
                }
              })()}
            </h6>
          )}
          <h6 className="break_all">
            {userData && userData.email}
            {/* {userData && userData.gender} */}
          </h6>
          <h6>
            {userData?.city}
            {userData?.city && userData?.residentialCountry && ", "}
            {formatCountry(userData?.residentialCountry || userData?.country)}
          </h6>
          {userData?.address && (
            <h6
              className="address"
              style={{
                background: "#ececec",
                fontSize: "14px",
                textTransform: "capitalize",
                padding: "8px",
                borderRadius: "6px",
                marginTop: "6px",
              }}
            >
              {userData?.address}
            </h6>
          )}
        </div>
      </div>
      <div className="detail_info pd_single">
          <div className="property_card_single mobile_full_card overflow_unset onboarded_card">
          <div className="more_detail_card_inner">
            <div className="p_info">
                {renderRow("Rent Start Date", "rentStartDate")}
          {renderRow("Rent End Date", "rentEndDate")}
          {/* {renderRow("Onboarding Date", "onBoardingDate")} */}
          {/* {renderRow("Offboarding Date", "offBoardingDate")} */}
         
                 {/* Bootstrap Modal */}
          <div
            className="modal fade"
            id="dateEditModal"
            tabIndex="-1"
            aria-labelledby="dateEditModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="dateEditModalLabel">
                    Edit {fieldToEdit}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd MMM yyyy"
                    className="form-control"
                    placeholder="Select date"
                    minDate={
                      fieldToEdit === "rentEndDate" && tenantData.rentStartDate
                        ? new Date(tenantData.rentStartDate)
                        : null
                    }
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
            </div>
            <div className="card_blue_divider">
            {/* ---------- Radio Buttons for Active / Inactive ---------- */}
          <div className="active_inactive">
            <div className="form_field outline blue_single makeai">
              <div className="field_box theme_radio_new">
                <div
                  className="theme_radio_container"
                  style={{
                    padding: "0px",
                    border: "none",
                    background: "transparent",
                  }}
                >
                  {/* ACTIVE RADIO */}
                  <div className="radio_single">
                    <input
                      type="radio"
                      name="tenant_status"
                      value="active"
                      id="active"
                      checked={tenantData?.status === "active"}
                      onChange={() => handleTenantStatusChange("active")}
                    />
                    <label htmlFor="active">
                      <div className="label_inner">
                      
 {tenantData?.status === "active" ? "Active" : "Make Active"}
                        {tenantData?.activeBy && tenantData?.activeAt && (
                          <div className="info_icon">
                            <span className="material-symbols-outlined">
                              info
                            </span>
                            <div className="info_icon_inner">
                              <b className="text_green2">Active</b> by{" "}
                              <b>
                                {dbUserState?.find(
                                  (user) => user.id === tenantData.activeBy
                                )?.fullName || tenantData.activeBy}
                              </b>{" "}
                              on{" "}
                              <b>
                                {format(
                                  tenantData.activeAt.toDate(),
                                  "dd-MMM-yyyy hh:mm a"
                                )}
                              </b>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* INACTIVE RADIO */}
                  <div className="radio_single">
                    <input
                      type="radio"
                      name="tenant_status"
                      value="inactive"
                      id="inactive"
                      checked={tenantData?.status === "inactive"}
                      onChange={() => handleTenantStatusChange("inactive")}
                    />
                    <label htmlFor="inactive">
                      <div className="label_inner">
                        {tenantData?.status === "inactive" ? "Inactive" : "Make Inactive"}

                        {tenantData?.inactiveBy && tenantData?.inactiveAt && (
                          <div className="info_icon">
                            <span className="material-symbols-outlined">
                              info
                            </span>
                            <div className="info_icon_inner">
                              <b className="text_red">Inactive</b> by{" "}
                              <b>
                                {dbUserState?.find(
                                  (user) => user.id === tenantData.inactiveBy
                                )?.fullName || tenantData.inactiveBy}
                              </b>{" "}
                              on{" "}
                              <b>
                                {format(
                                  tenantData.inactiveAt.toDate(),
                                  "dd-MMM-yyyy hh:mm a"
                                )}
                              </b>
                              , Reason <b>{tenantData?.inactiveReason}</b>
                              {tenantData?.inactiveRemark && (
                                <>
                                  , Remark <b>{tenantData.inactiveRemark}</b>
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
          </div>

          {/* ---------- Modal for Status Change Reason ---------- */}
          <Modal
            show={showTenantStatusPopup}
            onHide={() => setShowTenantStatusPopup(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Change Tenant Status to {tenantStatusData?.status}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {tenantStatusData?.status === "inactive" && (
                <>
                  <div className="form_group">
                    <label>Select Reason</label>
                    <select
                      className="form-control"
                      value={tenantInactiveReason}
                      onChange={(e) => setTenantInactiveReason(e.target.value)}
                    >
                      <option value="">--Select Reason--</option>
                      <option value="Moved out">Moved out</option>
                      <option value="Contract Ended">Contract Ended</option>
                      <option value="Other">Other</option>
                    </select>
                    {tenantStatusReasonError && (
                      <div className="text-danger mt-1">
                        {tenantStatusReasonError}
                      </div>
                    )}
                  </div>

                  <div className="form_group mt-2">
                    <label>Remark (optional)</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Add remark if any..."
                      value={tenantInactiveRemark}
                      onChange={(e) => setTenantInactiveRemark(e.target.value)}
                    />
                  </div>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowTenantStatusPopup(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleTenantPopupSubmit}
                disabled={tenantStatusLoading}
              >
                {tenantStatusLoading ? "Updating..." : "Confirm"}
              </Button>
            </Modal.Footer>
          </Modal>
            
            </div>
            
          </div>
        </div>
  

        <>
          
        </>
        {/* address infor  */}
        <div className="card p-3 my-3 position-relative">
          <h5 className="mb-3">🗂️ Address & Citizenship</h5>

          {/* Edit Icon on Card */}
          {!editMode ? (
            <span
              className="material-symbols-outlined position-absolute top-0 end-0 m-3 text-primary pointer"
              onClick={() => setEditMode(true)}
              title="Edit All"
            >
              edit
            </span>
          ) : (
            <button
              className="btn btn-success position-absolute top-0 end-0 m-3"
              onClick={handleSaveTenantAddress}
            >
              Save
            </button>
          )}

          {/* Citizenship */}
          <div className="mb-2">
            <label>Citizenship:</label>
            {editMode ? (
              <input
                type="text"
                className="form-control"
                value={formData.citizenship}
                onChange={(e) =>
                  setFormData({ ...formData, citizenship: e.target.value })
                }
              />
            ) : (
              <div>{formData.citizenship || "-"}</div>
            )}
          </div>
          <Select
  options={citizenshipOptions}
  value={
    formData.citizenship
      ? { label: formData.citizenship, value: formData.citizenship }
      : null
  }
  onChange={(selected) =>
    setFormData({ ...formData, citizenship: selected.value })
  }
/>

          {/* Country */}
          <div className="mb-2">
            <label>Country:</label>
            {editMode ? (
              <Select
                options={countryOptions}
                value={
                  formData.country
                    ? { label: formData.country, value: formData.country }
                    : null
                }
                onChange={(selected) =>
                  setFormData({
                    ...formData,
                    country: selected.value,
                    state: "",
                    city: "",
                  })
                }
              />
            ) : (
              <div>{formData.country || "-"}</div>
            )}
          </div>

          {/* State */}
          {showStates && (
            <div className="mb-2">
              <label>State:</label>
              {editMode ? (
                <Select
                  options={stateOptions}
                  value={
                    formData.state
                      ? { label: formData.state, value: formData.state }
                      : null
                  }
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      state: selected.value,
                      city: "",
                    })
                  }
                />
              ) : (
                <div>{formData.state || "-"}</div>
              )}
            </div>
          )}

          {/* City */}
          {showStates && formData.state && (
            <div className="mb-2">
              <label>City:</label>
              {editMode ? (
                <Select
                  options={cityOptions}
                  value={
                    formData.city
                      ? { label: formData.city, value: formData.city }
                      : null
                  }
                  onChange={(selected) =>
                    setFormData({ ...formData, city: selected.value })
                  }
                />
              ) : (
                <div>{formData.city || "-"}</div>
              )}
            </div>
          )}

          {/* Permanent Address */}
          <div className="mb-2">
            <label>Permanent Address:</label>
            {editMode ? (
              <textarea
                rows={3}
                className="form-control"
                value={formData.permanentAddress}
                onChange={(e) =>
                  setFormData({ ...formData, permanentAddress: e.target.value })
                }
              />
            ) : (
              <div>{formData.permanentAddress || "-"}</div>
            )}
          </div>
        </div>

        {/* company infor  */}
        <div className="card p-3 my-3 position-relative">
          <h5 className="mb-3">🏢 Company Information</h5>

          {/* Edit / Save Button */}
          {!editCompanyMode ? (
            <span
              className="material-symbols-outlined position-absolute top-0 end-0 m-3 text-primary pointer"
              onClick={() => setEditCompanyMode(true)}
              title="Edit Company Info"
            >
              edit
            </span>
          ) : (
            <button
              className="btn btn-success position-absolute top-0 end-0 m-3"
              onClick={handleCompanySave}
            >
              Save
            </button>
          )}

          {/* Company Name */}
          <div className="mb-2">
            <label>Company Name:</label>
            {editCompanyMode ? (
              <input
                type="text"
                className="form-control"
                value={companyData.companyName}
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    companyName: e.target.value,
                  })
                }
              />
            ) : (
              <div>{companyData.companyName || "-"}</div>
            )}
          </div>

          {/* Company Address */}
          <div className="mb-2">
            <label>Company Address:</label>
            {editCompanyMode ? (
              <textarea
                className="form-control"
                rows={2}
                value={companyData.companyAddress}
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    companyAddress: e.target.value,
                  })
                }
              />
            ) : (
              <div>{companyData.companyAddress || "-"}</div>
            )}
          </div>

          {/* Company Phone */}
          <div className="mb-2">
            <label>Company Phone:</label>
            {editCompanyMode ? (
              <input
                type="text"
                className="form-control"
                value={companyData.companyPhone}
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    companyPhone: e.target.value,
                  })
                }
              />
            ) : (
              <div>{companyData.companyPhone || "-"}</div>
            )}
          </div>

          {/* Designation */}
          <div className="mb-2">
            <label>Designation:</label>
            {editCompanyMode ? (
              <input
                type="text"
                className="form-control"
                value={companyData.designation}
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    designation: e.target.value,
                  })
                }
              />
            ) : (
              <div>{companyData.designation || "-"}</div>
            )}
          </div>
        </div>

        {/* id card detail  */}
        <div className="card p-3 my-3 position-relative">
          <h5 className="mb-3">🪪 ID Card Details</h5>

          {/* Edit / Save Button */}
          {!editIDCardMode ? (
            <span
              className="material-symbols-outlined position-absolute top-0 end-0 m-3 text-primary pointer"
              onClick={() => setEditIDCardMode(true)}
              title="Edit ID Info"
            >
              edit
            </span>
          ) : (
            <button
              className="btn btn-success position-absolute top-0 end-0 m-3"
              onClick={handleIDCardSave}
            >
              Save
            </button>
          )}

          {/* Aadhar */}
          <div className="mb-2">
            <label>Aadhar Card Number:</label>
            {editIDCardMode ? (
              <input
                type="text"
                className="form-control"
                value={idCardData.aadharCard}
                onChange={(e) =>
                  setIdCardData({ ...idCardData, aadharCard: e.target.value })
                }
              />
            ) : (
              <div>{idCardData.aadharCard || "-"}</div>
            )}
          </div>

          {/* PAN */}
          <div className="mb-2">
            <label>PAN Card Number:</label>
            {editIDCardMode ? (
              <input
                type="text"
                className="form-control"
                value={idCardData.panCard}
                onChange={(e) =>
                  setIdCardData({ ...idCardData, panCard: e.target.value })
                }
              />
            ) : (
              <div>{idCardData.panCard || "-"}</div>
            )}
          </div>

          {/* GST */}
          <div className="mb-2">
            <label>GST Number:</label>
            {editIDCardMode ? (
              <input
                type="text"
                className="form-control"
                value={idCardData.gstNumber}
                onChange={(e) =>
                  setIdCardData({ ...idCardData, gstNumber: e.target.value })
                }
              />
            ) : (
              <div>{idCardData.gstNumber || "-"}</div>
            )}
          </div>
        </div>

        {/* previous land loard  info  */}
        <div className="card p-3 my-3 position-relative">
          <h5 className="mb-3">🏠 Previous Landlord Details</h5>

          {!editLandlordMode ? (
            <span
              className="material-symbols-outlined position-absolute top-0 end-0 m-3 text-primary pointer"
              onClick={() => setEditLandlordMode(true)}
              title="Edit Previous Landlord Info"
            >
              edit
            </span>
          ) : (
            <button
              className="btn btn-success position-absolute top-0 end-0 m-3"
              onClick={handleLandlordSave}
            >
              Save
            </button>
          )}

          {/* Landlord Name */}
          <div className="mb-2">
            <label>Previous Landlord Name:</label>
            {editLandlordMode ? (
              <input
                type="text"
                className="form-control"
                value={landlordData.previousLandlordName}
                onChange={(e) =>
                  setLandlordData({
                    ...landlordData,
                    previousLandlordName: e.target.value,
                  })
                }
              />
            ) : (
              <div>{landlordData.previousLandlordName || "-"}</div>
            )}
          </div>

          {/* Landlord Number */}
          <div className="mb-2">
            <label>Previous Landlord Number:</label>
            {editLandlordMode ? (
              <input
                type="text"
                className="form-control"
                value={landlordData.previousLandlordPhone}
                onChange={(e) =>
                  setLandlordData({
                    ...landlordData,
                    previousLandlordPhone: e.target.value,
                  })
                }
              />
            ) : (
              <div>{landlordData.previousLandlordPhone || "-"}</div>
            )}
          </div>
        </div>

        {/* family bachelor code Start  */}
        <div className="card p-3 my-3 position-relative">
          <h5 className="mb-3">👨‍👩‍👧‍👦 Family / Bachelor Info</h5>

          {!editFamilyMode ? (
            <span
              className="material-symbols-outlined position-absolute top-0 end-0 m-3 text-primary pointer"
              onClick={() => setEditFamilyMode(true)}
            >
              edit
            </span>
          ) : (
            <button
              className="btn btn-success position-absolute top-0 end-0 m-3"
              onClick={handleSaveFamilyBachelor}
            >
              Save
            </button>
          )}

          {/* Family or Bachelor Radio */}
          <div className="mb-2">
            <label className="mb-1 d-block">Family Type:</label>
            {editFamilyMode ? (
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="familyType"
                    value="Family"
                    checked={familyBachelorData.familyType === "Family"}
                    onChange={(e) =>
                      setFamilyBachelorData({
                        ...familyBachelorData,
                        familyType: e.target.value,
                      })
                    }
                  />
                  <label className="form-check-label">Family</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="familyType"
                    value="Bachelor"
                    checked={familyBachelorData.familyType === "Bachelor"}
                    onChange={(e) =>
                      setFamilyBachelorData({
                        ...familyBachelorData,
                        familyType: e.target.value,
                      })
                    }
                  />
                  <label className="form-check-label">Bachelor</label>
                </div>
              </div>
            ) : (
              <div>{familyBachelorData.familyType}</div>
            )}
          </div>

          {/* Conditional Family Fields */}
          {familyBachelorData.familyType === "Family" && (
            <>
              <div className="mb-2">
                <label>Total Family Members:</label>
                {editFamilyMode ? (
                  <input
                    type="number"
                    className="form-control"
                    value={familyBachelorData.totalFamilyMembers}
                    onChange={(e) =>
                      setFamilyBachelorData({
                        ...familyBachelorData,
                        totalFamilyMembers: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div>{familyBachelorData.totalFamilyMembers || "-"}</div>
                )}
              </div>

              <div className="mb-2">
                <label>Spouse Name:</label>
                {editFamilyMode ? (
                  <input
                    type="text"
                    className="form-control"
                    value={familyBachelorData.spouseName}
                    onChange={(e) =>
                      setFamilyBachelorData({
                        ...familyBachelorData,
                        spouseName: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div>{familyBachelorData.spouseName || "-"}</div>
                )}
              </div>

              <div className="mb-2">
                <label>Spouse Phone:</label>
                {editFamilyMode ? (
                  <input
                    type="text"
                    className="form-control"
                    value={familyBachelorData.spousePhone}
                    onChange={(e) =>
                      setFamilyBachelorData({
                        ...familyBachelorData,
                        spousePhone: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div>{familyBachelorData.spousePhone || "-"}</div>
                )}
              </div>

              <div className="mb-2">
                <label>Spouse Email:</label>
                {editFamilyMode ? (
                  <input
                    type="email"
                    className="form-control"
                    value={familyBachelorData.spouseEmail}
                    onChange={(e) =>
                      setFamilyBachelorData({
                        ...familyBachelorData,
                        spouseEmail: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div>{familyBachelorData.spouseEmail || "-"}</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* family member card  */}
        <div className="card p-3 my-3 position-relative">
          <h5 className="mb-3">👥 Tenant Family/Members Details</h5>

          {!editFamilyMembers ? (
            <span
              className="material-symbols-outlined text-primary position-absolute top-0 end-0 m-3 pointer"
              onClick={() => setEditFamilyMembers(true)}
            >
              edit
            </span>
          ) : (
            <button
              className="btn btn-success position-absolute top-0 end-0 m-3"
              onClick={handleSaveFamilyMember}
            >
              Save
            </button>
          )}

          {familyMembersList.map((member, index) => (
            <div
              key={index}
              className="border p-3 rounded mb-3 position-relative"
            >
              {editFamilyMembers && (
                <span
                  className="material-symbols-outlined text-danger position-absolute top-0 end-0 m-2 pointer"
                  onClick={() => handleRemoveMember(index)}
                >
                  close
                </span>
              )}

              <div className="row">
                {[
                  "name",
                  "gender",
                  "age",
                  "mobile",
                  "email",
                  "relationship",
                ].map((field, i) => (
                  <div className="col-md-4 mb-2" key={i}>
                    <label className="form-label text-capitalize">
                      {field}
                    </label>
                    {editFamilyMembers ? (
                      <input
                        type={field === "age" ? "number" : "text"}
                        className="form-control"
                        value={member[field]}
                        onChange={(e) =>
                          handleInputChange(index, field, e.target.value)
                        }
                      />
                    ) : (
                      <div>{member[field] || "-"}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {editFamilyMembers &&
            familyMembersList.length < totalMembersAllowed && (
              <button
                className="btn btn-outline-primary"
                onClick={handleAddMember}
              >
                + Add More
              </button>
            )}

          {editFamilyMembers &&
            familyMembersList.length >= totalMembersAllowed && (
              <div className="text-muted mt-2">
                ⚠️ Maximum members reached as per family count
              </div>
            )}
        </div>

        <AddTenantDocument />
      
      </div>

      {/* <div className="p-3">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <h4>Tenant Details</h4>
        {tenantData ? (
          <div>
            <p>
              <strong>Tenant ID:</strong> {tenantId}
            </p>
            <p>
              <strong>Move-in Date:</strong> {tenantData.moveInDate || "-"}
            </p>
            <p>
              <strong>User ID:</strong> {tenantData.userId || "-"}
            </p>
          </div>
        ) : (
          <p>Tenant not found.</p>
        )}

        <h4 className="mt-4">User Details</h4>
        {userData ? (
          <div>
            <p>
              <strong>Name:</strong> {userData.fullName || "-"}
            </p>
            <p>
              <strong>Email:</strong> {userData.email || "-"}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {(() => {
                try {
                  const number = parsePhoneNumberFromString(
                    userData.phoneNumber,
                    userData.countryCode || "IN"
                  );
                  return number
                    ? number.formatInternational()
                    : userData.phoneNumber;
                } catch {
                  return userData.phoneNumber;
                }
              })()}
            </p>
            <p>
              <strong>Country:</strong> {formatCountry(userData.countryCode)}
            </p>
          </div>
        ) : (
          <p>User not found.</p>
        )}
      </div> */}
    </div>
  );
}
