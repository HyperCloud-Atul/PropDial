import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";

const usePropertyUsersData = (propertyId) => {
  const [ownerUsers, setOwnerUsers] = useState([]);
  const [firstOwnerUser, setFirstOwnerUser] = useState(null);

  const [executiveUsers, setExecutiveUsers] = useState([]);
  const [firstExecutiveUser, setFirstExecutiveUser] = useState(null);

  const [managerUsers, setManagerUsers] = useState([]);
  const [firstManagerUser, setFirstManagerUser] = useState(null);

  const [substituteUsers, setSubstituteUsers] = useState([]);
  const [firstSubstituteUser, setFirstSubstituteUser] = useState(null);

  const [tenantUsers, setTenantUsers] = useState([]);
  const [firstTenantUser, setFirstTenantUser] = useState(null);

  const fetchUserProfile = async (userId) => {
    if (userId) {
      const userDoc = await projectFirestore
        .collection("users-propdial")
        .doc(userId)
        .get();
      if (userDoc.exists) {
        return userDoc.data();
      }
    }
    return null;
  };

  useEffect(() => {
    if (!propertyId) return;

    // OWNER
    const unsubscribeOwner = projectFirestore
      .collection("propertyusers")
      .where("propertyId", "==", propertyId)
      .where("userType", "==", "propertyowner")
      .where("userTag", "==", "Owner")
      // .orderBy("createdAt", "desc")
      .onSnapshot(async (snapshot) => {
        const users = snapshot.docs.map((doc) => doc.data());
        setOwnerUsers(users);
        if (users[0]) {
          const profile = await fetchUserProfile(users[0].userId);
          setFirstOwnerUser({ ...users[0], profile: profile || {} });
        }
      });

    // EXECUTIVE
    const unsubscribeExecutive = projectFirestore
      .collection("propertyusers")
      .where("propertyId", "==", propertyId)

      .where("userType", "==", "propertymanager")
      .where("userTag", "==", "Executive")
      // .orderBy("createdAt", "desc")
      .onSnapshot(async (snapshot) => {
        const users = snapshot.docs.map((doc) => doc.data());
        setExecutiveUsers(users);
        if (users[0]) {
          const profile = await fetchUserProfile(users[0].userId);
          setFirstExecutiveUser({ ...users[0], profile: profile || {} });
        }
      });

    // MANAGER
    const unsubscribeManager = projectFirestore
      .collection("propertyusers")
      .where("propertyId", "==", propertyId)
      .where("userTag", "==", "Manager")
      .where("userType", "==", "propertymanager")
      // .orderBy("createdAt", "desc")
      .onSnapshot(async (snapshot) => {
        const users = snapshot.docs.map((doc) => doc.data());
        setManagerUsers(users);
        if (users[0]) {
          const profile = await fetchUserProfile(users[0].userId);
          setFirstManagerUser({ ...users[0], profile: profile || {} });
        }
      });

    // SUBSTITUTE
    const unsubscribeSubstitute = projectFirestore
      .collection("propertyusers")
      .where("propertyId", "==", propertyId)
      .where("userTag", "==", "Substitute")
      .where("userType", "==", "propertymanager")
      // .orderBy("createdAt", "desc")
      .onSnapshot(async (snapshot) => {
        const users = snapshot.docs.map((doc) => doc.data());
        setSubstituteUsers(users);
        if (users[0]) {
          const profile = await fetchUserProfile(users[0].userId);
          setFirstSubstituteUser({ ...users[0], profile: profile || {} });
        }
      });

    // TENANT
    const unsubscribeTenant = projectFirestore
      .collection("propertyusers")
      .where("propertyId", "==", propertyId)
      .where("userTag", "==", "Tenant")
      .where("userType", "==", "propertytenant")
      // .orderBy("createdAt", "desc")
      .onSnapshot(async (snapshot) => {
        const users = snapshot.docs.map((doc) => doc.data());
        setTenantUsers(users);
        if (users[0]) {
          const profile = await fetchUserProfile(users[0].userId);
          setFirstTenantUser({ ...users[0], profile: profile || {} });
        }
      });

    return () => {
      unsubscribeOwner();
      unsubscribeExecutive();
      unsubscribeManager();
      unsubscribeSubstitute();
      unsubscribeTenant();
    };
  }, [propertyId]);

  return {
    ownerUsers,
    firstOwnerUser,
    executiveUsers,
    firstExecutiveUser,
    managerUsers,
    firstManagerUser,
    substituteUsers,
    firstSubstituteUser,
    tenantUsers,
    firstTenantUser,
  };
};

export default usePropertyUsersData;
