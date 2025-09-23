// hooks/useSocietyRates.js
import { useState, useEffect } from 'react';
import { projectFirestore } from "../firebase/config";

export const useSocietyRates = (societyName) => {
  const [floorPlans, setFloorPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!societyName) {
      setFloorPlans([]);
      setLoading(false);
      return;
    }

    let unsubscribeSociety = null;
    let unsubscribeFloorPlans = null;

    const setupRealTimeListener = () => {
      // Society document ke liye real-time listener
      unsubscribeSociety = projectFirestore
        .collection("m_societies")
        .where("society", "==", societyName)
        .onSnapshot(
          (societySnapshot) => {
            if (societySnapshot.empty) {
              setError("Society not found");
              setFloorPlans([]);
              setLoading(false);
              return;
            }

            const societyDoc = societySnapshot.docs[0];
            
            // Floor plans document ke liye real-time listener
            unsubscribeFloorPlans = societyDoc.ref
              .collection("society_information")
              .doc("floor_plans")
              .onSnapshot(
                (floorPlansSnapshot) => {
                  if (floorPlansSnapshot.exists) {
                    const data = floorPlansSnapshot.data();
                    const plansArray = data.plans || [];
                    setFloorPlans(plansArray);
                    setError(null);
                  } else {
                    setFloorPlans([]);
                    setError("No floor plans available");
                  }
                  setLoading(false);
                },
                (floorError) => {
                  console.error("Floor plans error:", floorError);
                  setError("Failed to load floor plans");
                  setLoading(false);
                }
              );
          },
          (societyError) => {
            console.error("Society error:", societyError);
            setError("Failed to find society");
            setLoading(false);
          }
        );
    };

    setupRealTimeListener();

    // Cleanup function
    return () => {
      if (unsubscribeSociety) {
        unsubscribeSociety();
      }
      if (unsubscribeFloorPlans) {
        unsubscribeFloorPlans();
      }
    };
  }, [societyName]);

  return { floorPlans, loading, error };
};