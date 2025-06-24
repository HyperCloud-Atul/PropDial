import { useEffect, useState } from "react";
import { projectFirestore } from "../../../../firebase/config";

const useTenants = (propertyid) => {
  const [tenantDocument, setTenantDocument] = useState([]);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTenantId, setDeleteTenantId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!propertyid) return;

    const unsubscribe = projectFirestore
      .collection("tenants")
      .where("propertyId", "==", propertyid)
      .where("status", "==", "active")
      .orderBy("createdAt", "desc")
      .onSnapshot(async (snapshot) => {
        if (snapshot.empty) {
          setTenantDocument([]);
          return;
        }

        const tenantsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const userIds = [...new Set(tenantsData.map((t) => t.userId))];
        const users = await Promise.all(
          userIds.map(async (uid) => {
            const snap = await projectFirestore.collection("users-propdial").doc(uid).get();
            return snap.exists ? { id: uid, ...snap.data() } : { id: uid, notFound: true };
          })
        );

        const userMap = {};
        users.forEach((u) => (userMap[u.id] = u));

        const merged = tenantsData.map((t) => {
          const user = userMap[t.userId] || {};
          return {
            id: t.id,
            name: user.fullName || t.name || "Unknown",
            mobile: user.phoneNumber || t.mobile || "",
            emailId: user.email || t.emailId || "",
            tenantImgUrl: user.imgUrl || t.tenantImgUrl || "",
            status: t.status,
            userId: t.userId,
          };
        });

        setTenantDocument(merged);
      });

    return () => unsubscribe();
  }, [propertyid]);

  const confirmDeleteTenant = (tenantId, userId) => {
    setDeleteTenantId(tenantId);
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteTenant = async () => {
    if (!deleteTenantId) return;

    setIsDeleting(true);
    try {
      await projectFirestore.collection("tenants").doc(deleteTenantId).delete();
      const propertyUsersSnapshot = await projectFirestore
        .collection("propertyusers")
        .where("tenantDocId", "==", deleteTenantId)
        .get();

      const batch = projectFirestore.batch();
      propertyUsersSnapshot.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      setShowDeleteModal(false);
      setDeleteTenantId(null);
      setDeleteUserId(null);
    } catch (err) {
      console.error("Error deleting tenant:", err);
      alert("Failed to delete tenant.");
    }
    setIsDeleting(false);
  };

  return {
    tenantDocument,
    showAddTenantModal,
    setShowAddTenantModal,
    showDeleteModal,
    setShowDeleteModal,
    confirmDeleteTenant,
    handleDeleteTenant,
    isDeleting,
  };
};

export default useTenants;
