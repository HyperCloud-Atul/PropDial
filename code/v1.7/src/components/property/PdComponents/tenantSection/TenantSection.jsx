import React, { useState } from "react";
import AddTenant from "./AddTenant";
import SureDelete from "../../../../pdpages/sureDelete/SureDelete";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import useTenants from "./useTenants";
import TenantControls from "./TenantControls";
import TenantSwiper from "./TenantSwiper";

const TenantSection = ({
  propertyid,
  isPropertyManager,
  propertyDocument,
  setShowSavedModal,
  isPropertyOwner,
}) => {
  const { user } = useAuthContext();

  const {
    tenantDocument,
    confirmDeleteTenant,
    handleDeleteTenant,
    showDeleteModal,
    setShowDeleteModal,
    isDeleting,
    setShowAddTenantModal,
    showAddTenantModal,
  } = useTenants(propertyid);

  if (
    !propertyDocument ||
    !["Residential", "Commercial"].includes(propertyDocument.category)
  )
    return null;

  const canView =
    user &&
    ((tenantDocument?.length === 0 &&
      (user?.role === "superAdmin" ||
        user?.role === "admin" ||
        isPropertyManager)) ||
      (tenantDocument?.length > 0 &&
        (user?.role === "superAdmin" ||
          user?.role === "admin" ||
          isPropertyManager ||
          isPropertyOwner)));

  return (
    <>
      {canView && (
        <section className="property_card_single full_width_sec with_orange">
          <span className="verticall_title">Tenants</span>
          <div className="more_detail_card_inner">
            <div className="row">
              <TenantControls
                user={user}
                isPropertyManager={isPropertyManager}
                setShowAddTenantModal={setShowAddTenantModal}
              />
              <TenantSwiper
                user={user}
                tenantDocument={tenantDocument}
                confirmDeleteTenant={confirmDeleteTenant}
              />
            </div>
          </div>

          <AddTenant
            setShowSavedModal={setShowSavedModal}
            propertyid={propertyid}
            showAddTenantModal={showAddTenantModal}
            setShowAddTenantModal={setShowAddTenantModal}
            user={user}
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
  );
};

export default TenantSection;
