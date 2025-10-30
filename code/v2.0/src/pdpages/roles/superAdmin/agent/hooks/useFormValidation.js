import { useState, useCallback } from "react";

export const useFormValidation = () => {
  const [errors, setErrors] = useState({
    agentPhone: "",
    agentName: "",
    agentEmail: "",
    state: "",
    city: "",
  });

  const clearError = useCallback((field) => {
    setErrors(prev => ({ ...prev, [field]: "" }));
  }, []);

  const setError = useCallback((field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const isValidEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateForm = useCallback(async (formState, agentID, checkMobileNumber) => {
    const newErrors = {};

    // Mobile number validation
    const cleanNumber = formState.agentPhone.replace(/\D/g, '');
    if (!formState.agentPhone || formState.agentPhone === "91") {
      newErrors.agentPhone = "Phone number is required";
    } else if (!cleanNumber.startsWith('91') || cleanNumber.length !== 12) {
      newErrors.agentPhone = "Please enter a valid 10-digit mobile number with +91 country code";
    }

    if (!formState.agentName.trim()) {
      newErrors.agentName = "Name is required";
    }

    if (formState.agentEmail && !isValidEmail(formState.agentEmail)) {
      newErrors.agentEmail = "Invalid email format";
    }

    if (!formState.state) {
      newErrors.state = "State is required";
    }

    if (!formState.city) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);

    // If there are basic validation errors, return false
    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    // For new agents, check duplicate again before submit
    if (agentID === "new") {
      try {
        const duplicateResult = await checkMobileNumber(formState.agentPhone);
        if (duplicateResult.hasDuplicates) {
          setErrors(prev => ({ 
            ...prev, 
            agentPhone: "This mobile number is already registered" 
          }));
          return false;
        }
      } catch (error) {
        console.error("Error during duplicate check:", error);
        return false;
      }
    }

    return true;
  }, [isValidEmail]);

  return {
    validateForm,
    errors,
    clearError,
    setError,
  };
};