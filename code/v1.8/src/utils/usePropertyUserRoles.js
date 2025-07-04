import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

export const usePropertyUserRoles = (propertyId, user) => {
  const [isPropertyOwner, setIsPropertyOwner] = useState(false);
  const [propertyUserOwnerData, setPropertyUserOwnerData] = useState(null);

  const [isPropertyManager, setIsPropertyManager] = useState(false);
  const [propertyUserManagerData, setPropertyUserManagerData] = useState(null);

    const [isPropertyTenant, setIsPropertyTenant] = useState(false);
  const [propertyUserTenantData, setPropertyUserTenantData] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (propertyId && user?.phoneNumber && user.role === "owner") {
      const query = projectFirestore
        .collection("propertyusers")
        .where("propertyId", "==", propertyId)
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
  }, [propertyId, user]);

  useEffect(() => {
    let unsubscribe;

    if (propertyId && user?.phoneNumber && (user.role === "manager" || user.role === "executive")) {
      const query = projectFirestore
        .collection("propertyusers")
        .where("propertyId", "==", propertyId)
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
  }, [propertyId, user]);

    useEffect(() => {
    let unsubscribe;

    if (propertyId && user?.phoneNumber && user.role === "tenant") {
      const query = projectFirestore
        .collection("propertyusers")
        .where("propertyId", "==", propertyId)
        .where("userId", "==", user.phoneNumber)
        .where("userType", "==", "propertytenant");

      unsubscribe = query.onSnapshot(
        (snapshot) => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            setIsPropertyTenant(true);
            setPropertyUserTenantData({ id: doc.id, ...doc.data() });
          } else {
            setIsPropertyTenant(false);
            setPropertyUserTenantData(null);
          }
        },
        (error) => {
          console.error("Error fetching property tenant doc:", error);
        }
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [propertyId, user]);

  return {
    isPropertyOwner,
    propertyUserOwnerData,
    isPropertyManager,
    propertyUserManagerData,
    isPropertyTenant,
    propertyUserTenantData,
  };
};
