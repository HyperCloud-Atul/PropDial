import React from "react";
import { useState, useEffect } from "react";
import { projectFirestore, timestamp } from "../../../../firebase/config";
import parsePhoneNumberFromString from "libphonenumber-js";
import formatCountry from "../../../../utils/formatCountry";
import { Modal } from "react-bootstrap";

// component
import AddPropertyUser from "../../AddPropertyUser";

const AddTenant = ({
  setShowSavedModal,
  propertyid,
  setShowAddTenantModal,
  showAddTenantModal,
  user
}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [tenantFilteredUsers, setTenantFilteredUsers] = useState([]);
  const [tenantSearchQuery, setTenantSearchQuery] = useState("");
  const [tenantSelectedUser, setTenantSelectedUser] = useState(null);
  const [tenantLoading, setTenantLoading] = useState(false);
  const [isSearchTenantAdding, setIsSearchTenantAdding] = useState(false);
  const [tenantMode, setTenantMode] = useState("existing"); // or "new"

  // 🔄 Fetch all tenants from 'users-propdial' where role is tenant
  // useEffect(() => {
  //   const fetchTenantUsers = async () => {
  //     setTenantLoading(true);
  //     try {
  //       const snapshot = await projectFirestore
  //         .collection("users-propdial")
  //         .where("rolePropDial", "==", "tenant")
  //         .get();

  //       const users = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setAllUsers(users);
  //       setTenantFilteredUsers(users);
  //     } catch (err) {
  //       console.error("Error fetching tenants:", err);
  //     } finally {
  //       setTenantLoading(false);
  //     }
  //   };

  //   fetchTenantUsers();
  // }, []);
 useEffect(() => {
  setTenantLoading(true);

  // Caches
  let users1Cache = [];
  let users2Cache = [];

  // Combine logic with deduplication
  const combineUsers = (u1, u2) => {
    if (u1 !== null) users1Cache = u1;
    if (u2 !== null) users2Cache = u2;

    const combinedMap = new Map();
    [...users1Cache, ...users2Cache].forEach((user) => {
      combinedMap.set(user.id, user); // remove duplicates by ID
    });

    const allCombined = Array.from(combinedMap.values());

    setAllUsers(allCombined);
    setTenantFilteredUsers(allCombined);
    setTenantLoading(false);
  };

  // listener 1: rolePropDial == "tenant"
  const q1 = projectFirestore
    .collection("users-propdial")
    .where("rolePropDial", "==", "tenant");

  const unsub1 = q1.onSnapshot((snapshot1) => {
    const users1 = snapshot1.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    combineUsers(users1, null);
  });

  // listener 2: rolesPropDial contains "tenant"
  const q2 = projectFirestore
    .collection("users-propdial")
    .where("rolesPropDial", "array-contains", "tenant");

  const unsub2 = q2.onSnapshot((snapshot2) => {
    const users2 = snapshot2.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    combineUsers(null, users2);
  });

  return () => {
    unsub1();
    unsub2();
  };
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

  const handleAddTenantToCollection = async () => {
    if (!tenantSelectedUser) return alert("Please select a user");
    setIsSearchTenantAdding(true);
    try {
      // Add to 'tenants' collection and get the doc reference
      const tenantDocRef = await projectFirestore.collection("tenants").add({
        userId: tenantSelectedUser.id, // Document ID is phone number
        status: "active",
        propertyId: propertyid,
        createdAt: timestamp.now(),
        createdBy: user?.phoneNumber,
        offBoardingDate: "",
        onBoardingDate: "",
        rentEndDate: "",
        rentStartDate: "",
      });

      // Add to 'propertyusers' collection with tenantDocId
      await projectFirestore.collection("propertyusers").add({
        propertyId: propertyid,
        userId: tenantSelectedUser.id,
        tenantDocId: tenantDocRef.id, // capturing tenant document ID here
        createdAt: timestamp.now(),
        createdBy: user?.phoneNumber,
        userTag: "tenant",
        userType: "propertytenant",
        isCurrentProperty: true,
      });
      setIsSearchTenantAdding(false);
      setShowAddTenantModal(false);
      setShowSavedModal(true);
      setTenantSearchQuery("");
      setTenantSelectedUser(null);
    } catch (error) {
      console.error("Error adding tenant or propertyuser:", error);
      setShowAddTenantModal(false);
      alert("Failed to add tenant");
    }
  };
  return (
    <>
      <Modal
        show={showAddTenantModal}
        centered
        size="lg"
        className={`add_new ${tenantMode === "new" && "new"}`}
      >
        <h5 className="text_orange text-center">Add tenant</h5>
        <div className="project-filter">
          <nav>
            <button
              className={`pointer  ${
                tenantMode === "existing" ? "active" : ""
              }`}
              onClick={() => setTenantMode("existing")}
              style={{ marginRight: "10px" }}
            >
              Existing
            </button>
            <button
              className={`pointer ${tenantMode === "new" ? "active" : ""}`}
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
        {tenantMode === "new" && (
          <AddPropertyUser
            propertyid={propertyid}
            user={user}
            whoIsUser={"tenant"}
            setShowSavedModal={setShowSavedModal}
            setShowAddTenantModal={setShowAddTenantModal}
          />
        )}
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
                  <span className="material-symbols-outlined">search</span>
                </div>
              </div>
            </div>

            <ul className="search_results">
              {tenantFilteredUsers.map((user) => (
                <li className="search_result_single" key={user.id}>
                  <label>
                    <input
                      type="radio"
                      name="selectedTenant"
                      checked={tenantSelectedUser?.id === user.id}
                      onChange={() => handleTenantSelectUser(user)}
                    />
                    <div>
                      <strong>
                        {/* {user.rolePropDial?.toUpperCase()} - */}
                         {user.fullName}
                      </strong>{" "}
                      (
                      {(() => {
                        try {
                          const phoneNumber = parsePhoneNumberFromString(
                            user.phoneNumber,
                            user.countryCode?.toUpperCase()
                          );
                          return phoneNumber
                            ? phoneNumber.formatInternational()
                            : user.phoneNumber;
                        } catch (error) {
                          return user.phoneNumber;
                        }
                      })()}
                      )<br />
                      {user.email}, {user.city}
                      {user.city && user.residentialCountry && ", "}
                      {formatCountry(user.residentialCountry || user.country)}
                    </div>
                  </label>
                </li>
              ))}
            </ul>

            {tenantSelectedUser && (
              <button
                onClick={handleAddTenantToCollection}
                className="theme_btn btn_fill no_icon full_width text-center"
                disabled={isSearchTenantAdding}
              >
                {isSearchTenantAdding ? "Adding...." : "Add"}
              </button>
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export default AddTenant;
