import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";

const useUserProperties = (phoneNumber, role) => {
  const [propertyIds, setPropertyIds] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
      const snapshot = await projectFirestore
  .collection("propertyusers")
  .where("userId", "==", phoneNumber)
  .get();

const filteredDocs = snapshot.docs.filter(
  doc => doc.data().userTag.toLowerCase() === role.toLowerCase()
);

const ids = filteredDocs.map(doc => doc.data().propertyId);
        setPropertyIds(ids);

        if (ids.length > 0) {
          const propertySnapshots = await Promise.all(
            ids.map(id => projectFirestore.collection("properties-propdial").doc(id).get())
          );
          const propertyData = propertySnapshots.map(doc => ({ id: doc.id, ...doc.data() }));
          setProperties(propertyData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };

    if (phoneNumber && role) fetchProperties();
  }, [phoneNumber, role]);

  return { properties, loading };
};
export default useUserProperties;
