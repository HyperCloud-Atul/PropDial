import React from "react";
import ContactInfoSection from "./ContactInfoSection";
import LocationSection from "./LocationSection";
import StatusSection from "./StatusSection";

const AgentForm = ({
  formState,
  updateFormState,
  masterData,
  errors,
  clearError,
  isReadOnly,
  shouldDisableForm,
  agentDoc,
  dbUsers,
  onPhoneChange,
  isCheckingDuplicate,
  onSubmit,
  isUploading,
  isSubmitDisabled,
  addingError,
  agentID,
  onStatusChange
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="vg12"></div>

      <div className="row row_gap form_full">
        <ContactInfoSection
          formState={formState}
          updateFormState={updateFormState}
          errors={errors}
          clearError={clearError}
          shouldDisableForm={shouldDisableForm}
          isReadOnly={isReadOnly}
          onPhoneChange={onPhoneChange}
          isCheckingDuplicate={isCheckingDuplicate}
        />

        <LocationSection
          formState={formState}
          updateFormState={updateFormState}
          masterData={masterData}
          errors={errors}
          clearError={clearError}
          shouldDisableForm={shouldDisableForm}
        />

        {agentID !== "new" && (
          <StatusSection
            formState={formState}
            onStatusChange={onStatusChange}
            shouldDisableForm={shouldDisableForm}
            agentDoc={agentDoc}
            dbUsers={dbUsers}
          />
        )}
      </div>

      <FormActions
        addingError={addingError}
        isUploading={isUploading}
        isSubmitDisabled={isSubmitDisabled}
        agentID={agentID}
      />
    </form>
  );
};

const FormActions = ({ addingError, isUploading, isSubmitDisabled, agentID }) => (
  <>
    <div className="vg22"></div>
    {addingError && (
      <>
        <div className="field_error">{addingError}</div>
        <div className="vg22"></div>
      </>
    )}
    
    <div className="row">
      <div className="col-md-6"></div>
      <div className="col-md-6 col-12">
        <div className="row">
          <div className="col-4">
            <div className="theme_btn btn_border no_icon text-center">
              Cancel
            </div>
          </div>
          <div className="col-8">
            <button
              type="submit"
              className="theme_btn btn_fill no_icon text-center"
              disabled={isSubmitDisabled}
              style={{
                width: "100%",
                opacity: isSubmitDisabled ? "0.7" : "1",
                cursor: isSubmitDisabled ? "not-allowed" : "pointer",
              }}
            >
              {isUploading
                ? agentID !== "new" ? "Updating..." : "Adding..."
                : agentID !== "new" ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default AgentForm;