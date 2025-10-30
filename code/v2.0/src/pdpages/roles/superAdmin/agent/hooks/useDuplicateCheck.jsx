import { useState, useRef, useCallback } from "react";
import { projectFirestore } from "../../../../../firebase/config";

export const useDuplicateCheck = (agentID) => {
  const [duplicateState, setDuplicateState] = useState({
    isCheckingDuplicate: false,
    hasDuplicatePhone: false,
    showDuplicateModal: false,
  });

  const duplicateCheckCache = useRef(new Map());
  const lastPhoneCheck = useRef("");
  const phoneCheckTimeoutRef = useRef(null);

  const updateDuplicateState = useCallback((updates) => {
    setDuplicateState(prev => ({ ...prev, ...updates }));
  }, []);

  const checkMobileNumber = useCallback(async (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    // Check cache first
    if (duplicateCheckCache.current.has(cleanNumber)) {
      return duplicateCheckCache.current.get(cleanNumber);
    }

    if (lastPhoneCheck.current === cleanNumber) {
      const cachedResult = duplicateCheckCache.current.get(cleanNumber);
      if (cachedResult) return cachedResult;
    }

    lastPhoneCheck.current = cleanNumber;

    if (cleanNumber.startsWith('91') && cleanNumber.length === 12) {
      const actualNumber = cleanNumber.substring(2);

      if (actualNumber.length === 10) {
        updateDuplicateState({ isCheckingDuplicate: true });
        try {
          const query = projectFirestore
            .collection("agent-propdial")
            .where("agentPhone", "==", cleanNumber);

          const snapshot = await query.get();

          const result = {
            hasDuplicates: !snapshot.empty,
            isCurrentAgent: agentID !== "new" ? snapshot.docs.some(doc => doc.id === agentID) : false
          };

          duplicateCheckCache.current.set(cleanNumber, result);
          updateDuplicateState({ isCheckingDuplicate: false });
          return result;
        } catch (error) {
          console.error("Error checking mobile number:", error);
          updateDuplicateState({ isCheckingDuplicate: false });
          throw error;
        }
      }
    }

    return { hasDuplicates: false, isCurrentAgent: false };
  }, [agentID, updateDuplicateState]);

  const handlePhoneChange = useCallback((value) => {
    // Clear previous timeout
    if (phoneCheckTimeoutRef.current) {
      clearTimeout(phoneCheckTimeoutRef.current);
    }

    // Update duplicate state
    updateDuplicateState({ 
      hasDuplicatePhone: false,
      showDuplicateModal: false 
    });

    // Schedule duplicate check for new agents
    if (agentID === "new") {
      const cleanNumber = value.replace(/\D/g, '');
      if (cleanNumber.startsWith('91') && cleanNumber.length === 12) {
        phoneCheckTimeoutRef.current = setTimeout(() => {
          checkMobileNumber(value).then(result => {
            if (result.hasDuplicates) {
              updateDuplicateState({
                hasDuplicatePhone: true,
                showDuplicateModal: true
              });
            }
          });
        }, 800);
      }
    }

    return value;
  }, [agentID, checkMobileNumber, updateDuplicateState]);

  const handleDuplicateModalClose = useCallback(() => {
    updateDuplicateState({
      showDuplicateModal: false,
      hasDuplicatePhone: true
    });
  }, [updateDuplicateState]);

  return {
    duplicateState: {
      ...duplicateState,
      handleDuplicateModalClose
    },
    checkMobileNumber,
    handlePhoneChange,
  };
};