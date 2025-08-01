import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
  onSnapshot,
} from "firebase/firestore";
import { projectFirestore } from "../firebase/config";

const CACHE_KEY = "stateWisePropertyCounts";

const useStateWisePropertyCounts = () => {
  const [stateCounts, setStateCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      setStateCounts(JSON.parse(cached));
      setLoading(false);
    }

    const fetchCounts = async () => {
      try {
        const stateSnapshot = await getDocs(
          query(
            collection(projectFirestore, "m_states"),
            where("status", "==", "active")
          )
        );

        const activeStates = stateSnapshot.docs.map((doc) => doc.data().state);

        if (activeStates.length === 0) {
          console.warn("⚠️ No active states found.");
        }

        const baseColl = collection(projectFirestore, "properties-propdial");

        const countPromises = activeStates.map((stateName) => {
          return getCountFromServer(
            query(baseColl, where("state", "==", stateName))
          ).then((snap) => {
            return { [stateName]: snap.data().count };
          });
        });

        const resolvedCounts = await Promise.all(countPromises);
        const mergedCounts = resolvedCounts.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );

        const cachedOld = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "{}");
        if (JSON.stringify(mergedCounts) !== JSON.stringify(cachedOld)) {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(mergedCounts));
          setStateCounts(mergedCounts);
        } else {
        }

        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch state-wise property counts:", err);
        setLoading(false);
      }
    };

    fetchCounts();

    // Listener: if either collection changes, refresh counts
    const unsubProps = onSnapshot(
      collection(projectFirestore, "properties-propdial"),
      fetchCounts
    );
    const unsubStates = onSnapshot(
      collection(projectFirestore, "m_states"),
      fetchCounts
    );

    return () => {
      unsubProps();
      unsubStates();
    };
  }, []);

  return { stateCounts, loading };
};

export default useStateWisePropertyCounts;
