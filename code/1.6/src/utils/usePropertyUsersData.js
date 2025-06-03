// import { useEffect, useState } from "react";
// import { projectFirestore } from "../firebase/config";

// const usePropertyUsersData = (propertyId) => {
//   const [ownerUsers, setOwnerUsers] = useState([]);
//   const [firstOwnerUser, setFirstOwnerUser] = useState(null);

//   const [executiveUsers, setExecutiveUsers] = useState([]);
//   const [firstExecutiveUser, setFirstExecutiveUser] = useState(null);

//   const [managerUsers, setManagerUsers] = useState([]);
//   const [firstManagerUser, setFirstManagerUser] = useState(null);

//   const [substituteUsers, setSubstituteUsers] = useState([]);
//   const [firstSubstituteUser, setFirstSubstituteUser] = useState(null);

//   const [tenantUsers, setTenantUsers] = useState([]);
//   const [firstTenantUser, setFirstTenantUser] = useState(null);

//   const fetchUserProfile = async (userId) => {
//     if (userId) {
//       const userDoc = await projectFirestore
//         .collection("users-propdial")
//         .doc(userId)
//         .get();
//       if (userDoc.exists) {
//         return userDoc.data();
//       }
//     }
//     return null;
//   };

//   useEffect(() => {
//     if (!propertyId) return;

//     // OWNER
//     const unsubscribeOwner = projectFirestore
//       .collection("propertyusers")
//       .where("propertyId", "==", propertyId)
//       .where("userType", "==", "propertyowner")
//       .where("userTag", "==", "Owner")
//       // .orderBy("createdAt", "desc")
//       .onSnapshot(async (snapshot) => {
//         const users = snapshot.docs.map((doc) => doc.data());
//         setOwnerUsers(users);
//         if (users[0]) {
//           const profile = await fetchUserProfile(users[0].userId);
//           setFirstOwnerUser({ ...users[0], profile: profile || {} });
//         }
//       });

//     // EXECUTIVE
//     const unsubscribeExecutive = projectFirestore
//       .collection("propertyusers")
//       .where("propertyId", "==", propertyId)

//       .where("userType", "==", "propertymanager")
//       .where("userTag", "==", "Executive")
//       // .orderBy("createdAt", "desc")
//       .onSnapshot(async (snapshot) => {
//         const users = snapshot.docs.map((doc) => doc.data());
//         setExecutiveUsers(users);
//         if (users[0]) {
//           const profile = await fetchUserProfile(users[0].userId);
//           setFirstExecutiveUser({ ...users[0], profile: profile || {} });
//         }
//       });

//     // MANAGER
//     const unsubscribeManager = projectFirestore
//       .collection("propertyusers")
//       .where("propertyId", "==", propertyId)
//       .where("userTag", "==", "Manager")
//       .where("userType", "==", "propertymanager")
//       // .orderBy("createdAt", "desc")
//       .onSnapshot(async (snapshot) => {
//         const users = snapshot.docs.map((doc) => doc.data());
//         setManagerUsers(users);
//         if (users[0]) {
//           const profile = await fetchUserProfile(users[0].userId);
//           setFirstManagerUser({ ...users[0], profile: profile || {} });
//         }
//       });

//     // SUBSTITUTE
//     const unsubscribeSubstitute = projectFirestore
//       .collection("propertyusers")
//       .where("propertyId", "==", propertyId)
//       .where("userTag", "==", "Substitute")
//       .where("userType", "==", "propertymanager")
//       // .orderBy("createdAt", "desc")
//       .onSnapshot(async (snapshot) => {
//         const users = snapshot.docs.map((doc) => doc.data());
//         setSubstituteUsers(users);
//         if (users[0]) {
//           const profile = await fetchUserProfile(users[0].userId);
//           setFirstSubstituteUser({ ...users[0], profile: profile || {} });
//         }
//       });

//     // TENANT
//     const unsubscribeTenant = projectFirestore
//       .collection("propertyusers")
//       .where("propertyId", "==", propertyId)
//       .where("userTag", "==", "Tenant")
//       .where("userType", "==", "propertytenant")
//       // .orderBy("createdAt", "desc")
//       .onSnapshot(async (snapshot) => {
//         const users = snapshot.docs.map((doc) => doc.data());
//         setTenantUsers(users);
//         if (users[0]) {
//           const profile = await fetchUserProfile(users[0].userId);
//           setFirstTenantUser({ ...users[0], profile: profile || {} });
//         }
//       });

//     return () => {
//       unsubscribeOwner();
//       unsubscribeExecutive();
//       unsubscribeManager();
//       unsubscribeSubstitute();
//       unsubscribeTenant();
//     };
//   }, [propertyId]);

//   return {
//     ownerUsers,
//     firstOwnerUser,
//     executiveUsers,
//     firstExecutiveUser,
//     managerUsers,
//     firstManagerUser,
//     substituteUsers,
//     firstSubstituteUser,
//     tenantUsers,
//     firstTenantUser,
//   };
// };

// export default usePropertyUsersData;



// import { useEffect, useState } from "react";
// import { projectFirestore } from "../firebase/config";

// const usePropertyUsersData = (propertyId) => {
//   // per-role arrays
//   const [ownerUsers, setOwnerUsers] = useState([]);
//   const [executiveUsers, setExecutiveUsers] = useState([]);
//   const [managerUsers, setManagerUsers] = useState([]);
//   const [substituteUsers, setSubstituteUsers] = useState([]);
//   const [tenantUsers, setTenantUsers] = useState([]);

//   // per-role “first” entries
//   const [firstOwnerUser, setFirstOwnerUser] = useState(null);
//   const [firstExecutiveUser, setFirstExecutiveUser] = useState(null);
//   const [firstManagerUser, setFirstManagerUser] = useState(null);
//   const [firstSubstituteUser, setFirstSubstituteUser] = useState(null);
//   const [firstTenantUser, setFirstTenantUser] = useState(null);

//   const fetchUserProfile = async (userId) => {
//     if (!userId) return null;
//     const snap = await projectFirestore
//       .collection("users-propdial")
//       .doc(userId)
//       .get();
//     return snap.exists ? snap.data() : null;
//   };

//   useEffect(() => {
//     if (!propertyId) return;

//     const unsub = projectFirestore
//       .collection("propertyusers")
//       .where("propertyId", "==", propertyId)
//       .onSnapshot(async (snap) => {
//         // group raw docs by tag
//         const grouped = {
//           Owner: [],
//           Executive: [],
//           Manager: [],
//           Substitute: [],
//           Tenant: [],
//         };

//         snap.docs.forEach((doc) => {
//           const d = { id: doc.id, ...doc.data() };
//           const tag = d.userTag;
//           if (grouped[tag]) grouped[tag].push(d);
//         });

//         // helper to enrich an array of docs with profile
//         const enrich = async (arr) => {
//           return Promise.all(
//             arr.map(async (d) => {
//               const profile = await fetchUserProfile(d.userId);
//               return { ...d, profile: profile || {} };
//             })
//           );
//         };

//         // enrich each role
//         const [
//           owners,
//           execs,
//           mgrs,
//           subs,
//           tenants,
//         ] = await Promise.all([
//           enrich(grouped.Owner),
//           enrich(grouped.Executive),
//           enrich(grouped.Manager),
//           enrich(grouped.Substitute),
//           enrich(grouped.Tenant),
//         ]);

//         // set arrays
//         setOwnerUsers(owners);
//         setExecutiveUsers(execs);
//         setManagerUsers(mgrs);
//         setSubstituteUsers(subs);
//         setTenantUsers(tenants);

//         // set first entries (or null)
//         setFirstOwnerUser(owners[0] || null);
//         setFirstExecutiveUser(execs[0] || null);
//         setFirstManagerUser(mgrs[0] || null);
//         setFirstSubstituteUser(subs[0] || null);
//         setFirstTenantUser(tenants[0] || null);
//       });

//     return () => unsub();
//   }, [propertyId]);

//   return {
//     ownerUsers,
//     firstOwnerUser,
//     executiveUsers,
//     firstExecutiveUser,
//     managerUsers,
//     firstManagerUser,
//     substituteUsers,
//     firstSubstituteUser,
//     tenantUsers,
//     firstTenantUser,
//   };
// };

// export default usePropertyUsersData;




import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";

const usePropertyUsersData = (propertyId) => {
  const [ownerUsers, setOwnerUsers] = useState([]);
  const [executiveUsers, setExecutiveUsers] = useState([]);
  const [managerUsers, setManagerUsers] = useState([]);
  const [substituteUsers, setSubstituteUsers] = useState([]);
  const [tenantUsers, setTenantUsers] = useState([]);

  const [firstOwnerUser, setFirstOwnerUser] = useState(null);
  const [firstExecutiveUser, setFirstExecutiveUser] = useState(null);
  const [firstManagerUser, setFirstManagerUser] = useState(null);
  const [firstSubstituteUser, setFirstSubstituteUser] = useState(null);
  const [firstTenantUser, setFirstTenantUser] = useState(null);

  const TAG_MAP = {
    owner: "Owner",
    executive: "Executive",
    manager: "Manager",
    substitute: "Substitute",
    tenant: "Tenant",
  };

  const fetchUserProfile = async (userId) => {
    if (!userId) return null;
    const snap = await projectFirestore
      .collection("users-propdial")
      .doc(userId)
      .get();
    return snap.exists ? snap.data() : null;
  };

  useEffect(() => {
    if (!propertyId) return;

    const unsub = projectFirestore
      .collection("propertyusers")
      .where("propertyId", "==", propertyId)
      .onSnapshot(async (snap) => {
        // prepare empty buckets
        const grouped = {
          Owner: [],
          Executive: [],
          Manager: [],
          Substitute: [],
          Tenant: [],
        };

        // bucketize with case-insensitive tag mapping
        snap.docs.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          const raw = (data.userTag || "").toString().toLowerCase();
          const key = TAG_MAP[raw];
          if (key) grouped[key].push(data);
        });

        // helper to enrich with profile
        const enrich = async (arr) => {
          return Promise.all(
            arr.map(async (d) => {
              const profile = await fetchUserProfile(d.userId);
              return { ...d, profile: profile || {} };
            })
          );
        };

        // enrich all roles in parallel
        const [owners, execs, mgrs, subs, tenants] = await Promise.all([
          enrich(grouped.Owner),
          enrich(grouped.Executive),
          enrich(grouped.Manager),
          enrich(grouped.Substitute),
          enrich(grouped.Tenant),
        ]);

        // set lists
        setOwnerUsers(owners);
        setExecutiveUsers(execs);
        setManagerUsers(mgrs);
        setSubstituteUsers(subs);
        setTenantUsers(tenants);

        // set first items
        setFirstOwnerUser(owners[0] || null);
        setFirstExecutiveUser(execs[0] || null);
        setFirstManagerUser(mgrs[0] || null);
        setFirstSubstituteUser(subs[0] || null);
        setFirstTenantUser(tenants[0] || null);
      });

    return () => unsub();
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


