import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectFirestore } from "../../firebase/config";

// Components
import ScrollToTop from "../../components/ScrollToTop";
import PropertySummaryCard from "../../pdpages/property/PropertySummaryCard";
import RoomButtons from "./components/RoomButtons";
import RoomForm from "./components/RoomForm";
import ImageUploadModal from "./components/ImageUploadModal";
import SaveSuccessModal from "./components/SaveSuccessModal";
import LoadingState from "./components/LoadingState";

// Hooks
import usePropertyLayout from "./hooks/usePropertyLayout";
import useFixtureOptions from "./hooks/useFixtureOptions";

const AddPropertyLayout = () => {
  const { propertyLayoutId } = useParams();
  const { user } = useAuthContext();
  
  const {
    propertyId,
    propertyDocument,
    layouts,
    updateInfo,
    openField,
    toggleField, // ✅ Now using toggleField instead of setOpenField
    handleChange,
    handleMultiSelectChange,
    handleFlooringChange,
    handleImageUpload,
    handleDeleteImage,
    isLayoutSaving,
    afterSaveModal,
    setAfterSaveModal,
    saveData,
    imageActionStatus
  } = usePropertyLayout(propertyLayoutId, user);

  const { fixtureOptions } = useFixtureOptions();

  if (!propertyId) {
    return <LoadingState />;
  }

  return (
    <div className="top_header_pg pg_bg add_inspection_pg add_layout_pg">
      <ScrollToTop />
      <div className="page_spacing pg_min_height">
        <div className="row row_reverse_991">
          <div className="col-lg-6">
            <div className="title_card with_title mobile_full_575 mobile_gap h-100">
              <h2 className="text-center">Property Layout</h2>
            </div>
          </div>
          <PropertySummaryCard
            propertydoc={propertyDocument}
            propertyId={propertyId}
          />
        </div>

        <RoomButtons
          propertyDocument={propertyDocument}
          layouts={layouts}
          openField={openField}
          onToggleField={toggleField} // ✅ Pass the new toggleField
        />

        <div className="vg22"></div>

        {openField && (
          <RoomForm
            roomKey={openField}
            layouts={layouts}
            fixtureOptions={fixtureOptions}
            onFieldChange={handleChange}
            onMultiSelectChange={handleMultiSelectChange}
            onFlooringChange={handleFlooringChange}
            onImageUpload={handleImageUpload}
            onDeleteImage={handleDeleteImage}
            onSave={saveData}
            isSaving={isLayoutSaving}
          />
        )}

        <ImageUploadModal status={imageActionStatus} />
        <SaveSuccessModal 
          show={afterSaveModal} 
          onHide={() => setAfterSaveModal(false)} 
        />
      </div>
    </div>
  );
};

export default AddPropertyLayout;