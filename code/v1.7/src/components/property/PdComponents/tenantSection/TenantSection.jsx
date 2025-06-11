import React from "react";
import { useState, useEffect } from "react";
import { projectFirestore } from "../../../../firebase/config";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { firstLetterCapitalize } from "../../../../utils/lib";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";

// import component 
import SureDelete from "../../../../pdpages/sureDelete/SureDelete";
import AddTenant from "./AddTenant";

const TenantSection = ({
  propertyid,
  isPropertyManager,
  propertyDocument,
  setShowSavedModal,  
  isPropertyOwner,
}) => {
  const { user } = useAuthContext();
  // code for add tenant by search start
 const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTenantId, setDeleteTenantId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  // fetch tenant
  const [tenantDocument, setTenantDocument] = useState([]);

  useEffect(() => {
    if (!propertyid) return;

    let unsubscribe;

    const fetchActiveTenants = async () => {
      try {
        let totalReads = 0;

        const tenantQuery = projectFirestore
          .collection("tenants")
          .where("propertyId", "==", propertyid)
          .where("status", "==", "active")
          .orderBy("createdAt", "desc");

        unsubscribe = tenantQuery.onSnapshot(async (tenantSnapshot) => {
          totalReads = tenantSnapshot.size;

          if (tenantSnapshot.empty) {
            setTenantDocument([]);
            console.log("Total Firebase Reads:", totalReads);
            return;
          }

          const tenantsData = tenantSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const uniqueUserIds = [
            ...new Set(tenantsData.map((tenant) => tenant.userId)),
          ];

          const userDocs = await Promise.all(
            uniqueUserIds.map(async (uid) => {
              const userSnap = await projectFirestore
                .collection("users-propdial")
                .doc(uid)
                .get();

              if (userSnap.exists) totalReads += 1;

              return userSnap.exists
                ? { id: uid, ...userSnap.data() }
                : { id: uid, notFound: true };
            })
          );

          const userMap = {};
          userDocs.forEach((user) => {
            userMap[user.id] = user;
          });

          const mergedTenantData = tenantsData.map((tenant) => {
            const user = userMap[tenant.userId] || {};
            return {
              id: tenant.id,
              name: user.fullName || tenant.name || "Unknown",
              mobile: user.phoneNumber || tenant.mobile || "",
              emailId: user.email || tenant.emailId || "",
              tenantImgUrl: user.imgUrl || tenant.tenantImgUrl || "",
              status: tenant.status,
            };
          });

          setTenantDocument(mergedTenantData);
          console.log("Total Firebase Document Reads:", totalReads);
          console.log(
            "Tenants:",
            tenantSnapshot.size,
            "| Users:",
            uniqueUserIds.length
          );
        });
      } catch (err) {
        console.error("Error fetching tenant data", err);
      }
    };

    fetchActiveTenants();

    // ✅ Cleanup real-time listener on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [propertyid]);

  // code for add tenant by search end

  //   delete tenant
  const confirmDeleteTenant = (tenantId, userId) => {
    setDeleteTenantId(tenantId);
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteTenant = async () => {
    if (!deleteTenantId) return;

    setIsDeleting(true);
    try {
      // Delete from tenants collection
      await projectFirestore.collection("tenants").doc(deleteTenantId).delete();

      // Delete from propertyusers collection
      const propertyUsersSnapshot = await projectFirestore
        .collection("propertyusers")
        .where("tenantDocId", "==", deleteTenantId)
        .get();

      const batch = projectFirestore.batch();
      propertyUsersSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      setShowDeleteModal(false);
      setDeleteTenantId(null);
      setDeleteUserId(null);
      setIsDeleting(false);
    } catch (error) {
      console.error("Error deleting tenant:", error);
      alert("Failed to delete tenant.");
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {propertyDocument &&
        (propertyDocument.category === "Residential" ||
          propertyDocument.category === "Commercial") && (
          <>
            {user &&
              ((tenantDocument?.length === 0 &&
                (user?.role === "superAdmin" ||
                  user?.role === "admin" ||
                  isPropertyManager)) ||
                (tenantDocument?.length > 0 &&
                  (user?.role === "superAdmin" ||
                    user?.role === "admin" ||
                    isPropertyManager ||
                    isPropertyOwner))) && (
                <section className="property_card_single full_width_sec with_orange">
                  <span className="verticall_title">Tenants</span>
                  <div className="more_detail_card_inner">
                    <div className="row">
                      {user &&
                        (user?.role === "admin" ||
                          user?.role === "superAdmin" ||
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
                                onClick={() => setShowAddTenantModal(true)}
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
                          (user?.role === "admin" ||
                            user?.role === "superAdmin" ||
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
                              tenantDocument.map((tenant, index) => (
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
                                    //   to={`/tenantdetails/${tenant.id}`}
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
                                      <div className="tenant_detail">
                                        <h6 className="t_name">
                                          {tenant.name
                                            ? firstLetterCapitalize(tenant.name)
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
                                        <h6 className="t_number">
                                          {tenant?.emailId}
                                        </h6>
                                        <h6 className="text_red"
                                          onClick={(e) => {
                                            e.preventDefault(); // Prevent link navigation
                                            e.stopPropagation(); // Prevent bubbling to parent
                                            confirmDeleteTenant(
                                              tenant.id,
                                              tenant.userId
                                            );
                                          }}
                                          style={{
                                            fontSize:"10px",
                                            letterSpacing:"0.4px"
                                          }}
                                        >
                                          Delete
                                        </h6>
                                      </div>
                                    </Link>
                                    <div className="wha_call_icon">
                                      <Link
                                        className="call_icon wc_single"
                                        to={`tel:+${tenant?.mobile}`}
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
                              ))}
                          </Swiper>
                        </div>
                      </div>
                    </div>
                  </div>

                <AddTenant
                setShowSavedModal={setShowSavedModal}
                propertyid={propertyid}
                 showAddTenantModal={showAddTenantModal}
  setShowAddTenantModal={setShowAddTenantModal}
                />
                  <SureDelete
                    show={showDeleteModal}
                    handleClose={() => setShowDeleteModal(false)}
                    handleDelete={handleDeleteTenant}
                    isDeleting={isDeleting}
                  />
                </section>
              )}
          </>
        )}
    </div>
  );
};

export default TenantSection;
