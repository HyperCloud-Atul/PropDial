import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useCollection } from "../../../../hooks/useCollection";
import { useFirestore } from "../../../../hooks/useFirestore";
import { projectFirestore } from "../../../../firebase/config";
import { useDocument } from "../../../../hooks/useDocument";
import { useNavigate } from "react-router-dom";
import { useCommon } from "../../../../hooks/useCommon";
import { useAuthContext } from "../../../../hooks/useAuthContext";

// Components
import AgentForm from "./components/AgentForm";
import SuccessModal from "./components/SuccessModal";
import DuplicateModal from "./components/DuplicateModal";
import StatusModal from "./components/StatusModal";
import LoadingSpinner from "./components/LoadingSpinner";
import FormHeader from "./components/FormHeader";

// Custom Hooks
import { useMasterData } from "./hooks/useMasterData";
import { useFormState } from "./hooks/useFormState";
import { useDuplicateCheck } from "./hooks/useDuplicateCheck";
import { useFormValidation } from "./hooks/useFormValidation";

const AddAgent = ({ agentID }) => {
  const { camelCase } = useCommon();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isReadOnly = agentID !== "new";

  // Firestore operations
  const {
    addDocument: addAgentDoc,
    updateDocument: updateAgentDoc,
    error: addingError,
  } = useFirestore("agent-propdial");

  const { documents: dbUsers } = useCollection("users-propdial");
  const { document: agentDoc } = useDocument("agent-propdial", agentID);

  // Custom hooks
  const { masterData, masterDataLoading } = useMasterData();
  const { formState, updateFormState, resetForm, initializeForm } = useFormState();
  const { duplicateState, checkMobileNumber, handlePhoneChange } = useDuplicateCheck(agentID);
  const { validateForm, errors, clearError } = useFormValidation();

  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Initialize form when data is ready
  useEffect(() => {
    if (agentDoc && !masterDataLoading && !formState.isInitialized) {
      initializeForm(agentDoc, masterData, camelCase);
    } else if (agentID === "new" && !formState.isInitialized) {
      updateFormState({ isInitialized: true });
    }
  }, [agentDoc, masterDataLoading, agentID, formState.isInitialized, initializeForm, masterData, camelCase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = await validateForm(formState, agentID, checkMobileNumber);
    if (!isValid) return;

    if (duplicateState.hasDuplicatePhone) {
      duplicateState.setShowDuplicateModal(true);
      return;
    }

    await submitAgentData();
  };

  const submitAgentData = async () => {
    try {
      setIsUploading(true);
      let dataSet = prepareFormData();

      if (agentID === "new") {
        await addAgentDoc(dataSet);
        resetForm();
      } else {
        dataSet = addStatusData(dataSet);
        await updateAgentDoc(agentID, dataSet);
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving agent:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const prepareFormData = () => ({
    agentName: camelCase(formState.agentName),
    agentCompnayName: formState.agentCompanyName,
    agentPhone: formState.agentPhone.replace(/\D/g, ''),
    agentEmail: formState.agentEmail,
    agentPancard: formState.agentPancard.toUpperCase(),
    agentGstNumber: formState.agentGstNumber.toUpperCase(),
    country: "India",
    state: formState.state?.label || "",
    city: formState.city?.label || "",
    locality: formState.locality,
    society: formState.society,
    status: formState.status,
  });

  const addStatusData = (dataSet) => {
    const currentDate = new Date();
    return {
      ...dataSet,
      activeBy: formState.status === "active" ? user.phoneNumber : null,
      activeAt: formState.status === "active" ? currentDate : null,
      inactiveBy: formState.status === "banned" && user.phoneNumber,
      inactiveAt: formState.status === "banned" && currentDate,
      inactiveReason: formState.status === "banned" && formState.reason,
      inactiveRemark: formState.status === "banned" && formState.remark,
    };
  };

  const handleBack = () => navigate("/agents");

  if (!formState.isInitialized && agentID !== "new") {
    return <LoadingSpinner />;
  }

  const shouldDisableForm = agentID === "new" && duplicateState.hasDuplicatePhone;
  const isSubmitDisabled = isUploading || 
                          Object.values(errors).some(error => error) || 
                          shouldDisableForm ||
                          duplicateState.hasDuplicatePhone;

  return (
    <div className="top_header_pg pg_bg pg_agent">
      <div className="page_spacing">
        <FormHeader 
          isReadOnly={isReadOnly} 
          onBack={handleBack} 
        />
        
        <hr />
        <div className="vg12"></div>

        <AgentForm
          formState={formState}
          updateFormState={updateFormState}
          masterData={masterData}
          errors={errors}
          clearError={clearError}
          isReadOnly={isReadOnly}
          shouldDisableForm={shouldDisableForm}
          agentDoc={agentDoc}
          dbUsers={dbUsers}
          onPhoneChange={handlePhoneChange}
          isCheckingDuplicate={duplicateState.isCheckingDuplicate}
          onSubmit={handleSubmit}
          isUploading={isUploading}
          isSubmitDisabled={isSubmitDisabled}
          addingError={addingError}
          agentID={agentID}
          onStatusChange={() => setShowStatusModal(true)}
        />

        <SuccessModal
          show={showSuccessModal}
          onHide={() => setShowSuccessModal(false)}
          isEdit={agentID !== "new"}
        />

        <DuplicateModal
          show={duplicateState.showDuplicateModal}
          onHide={duplicateState.handleDuplicateModalClose}
        />

        <StatusModal
          show={showStatusModal}
          onHide={() => setShowStatusModal(false)}
          formState={formState}
          updateFormState={updateFormState}
        />
      </div>
    </div>
  );
};

export default AddAgent;