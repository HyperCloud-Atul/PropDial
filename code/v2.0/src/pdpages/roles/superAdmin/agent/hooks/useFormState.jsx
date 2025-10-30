import { useState, useCallback } from "react";

export const useFormState = () => {
  const [formState, setFormState] = useState({
    state: null,
    city: null,
    locality: [],
    society: [],
    agentName: "",
    agentCompanyName: "",
    agentPhone: "91",
    agentEmail: "",
    agentPancard: "",
    agentGstNumber: "",
    status: "active",
    reason: "",
    remark: "",
    isInitialized: false,
  });

  const updateFormState = useCallback((updates) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      state: null,
      city: null,
      locality: [],
      society: [],
      agentName: "",
      agentCompanyName: "",
      agentPhone: "91",
      agentEmail: "",
      agentPancard: "",
      agentGstNumber: "",
      status: "active",
      reason: "",
      remark: "",
      isInitialized: true,
    });
  }, []);

  const initializeForm = useCallback((agentDoc, masterData, camelCase) => {
    if (!agentDoc || !masterData) return;

    const { masterState, masterCity } = masterData;
    
    const selectedState = masterState?.find((e) => e.state === agentDoc.state);
    const selectedCity = masterCity?.find((e) => e.city === agentDoc.city);

    setFormState(prev => ({
      ...prev,
      state: selectedState ? { label: agentDoc.state, value: selectedState.id } : null,
      city: selectedCity ? { label: agentDoc.city, value: selectedCity.id } : null,
      locality: agentDoc.locality || [],
      society: agentDoc.society || [],
      agentName: camelCase(agentDoc.agentName || ""),
      agentCompanyName: agentDoc.agentCompanyName || "",
      agentPhone: agentDoc.agentPhone || "91",
      agentEmail: agentDoc.agentEmail || "",
      agentPancard: agentDoc.agentPancard || "",
      agentGstNumber: agentDoc.agentGstNumber || "",
      status: agentDoc.status || "active",
      isInitialized: true,
    }));
  }, []);

  return {
    formState,
    updateFormState,
    resetForm,
    initializeForm,
  };
};