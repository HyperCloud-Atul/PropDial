import { useState, useEffect } from "react";
import { projectFirestore } from "../../../firebase/config";

// ✅ Export defaultFixtures so it can be used in other files
export const defaultFixtures = ["Walls", "Roof", "Floor", "Switches & Sockets"];

const useFixtureOptions = () => {
  const [fixtureOptions, setFixtureOptions] = useState([]);

  useEffect(() => {
    const fetchFixtureOptions = () => {
      return projectFirestore
        .collection("m_fixtures")
        .limit(1)
        .onSnapshot(
          (snapshot) => {
            if (!snapshot.empty) {
              const fixtureDoc = snapshot.docs[0];
              const fixturesFromDB = fixtureDoc.data().fixtures || [];

              const mergedFixtures = Array.from(
                new Set([...fixturesFromDB, ...defaultFixtures])
              );

              const sortedFixtures = mergedFixtures.sort((a, b) =>
                a.localeCompare(b)
              );

              setFixtureOptions(
                sortedFixtures.map((fixture) => ({
                  value: fixture,
                  label: fixture,
                }))
              );
            }
          },
          (error) => {
            console.error("Realtime fixture fetch error:", error);
          }
        );
    };

    const unsubscribe = fetchFixtureOptions();
    return () => unsubscribe();
  }, []);

  return { fixtureOptions, defaultFixtures }; // ✅ Return defaultFixtures as well
};

export default useFixtureOptions;