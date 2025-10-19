import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";

const usePropertyStats = (propertyId) => {
  const [stats, setStats] = useState({
    inspections: {
      total: 0,
      regular: 0,
      full: 0,
      half: 0,
      more: 0,
    },
    bills: 0,
  });

  useEffect(() => {
    if (!propertyId) return;

    const fetchStats = async () => {
      try {
        // 🔹 1. Get inspections
        const inspectionsSnap = await projectFirestore
          .collection("inspections")
          .where("propertyId", "==", propertyId)
          .get();

        let inspectionCounts = {
          total: 0,
          regular: 0,
          full: 0,
          half: 0,
          more: 0,
        };

        inspectionsSnap.forEach((doc) => {
          const data = doc.data();
          inspectionCounts.total++;
          if (data.inspectionType && inspectionCounts[data.inspectionType] !== undefined) {
            inspectionCounts[data.inspectionType]++;
          }
        });

        // 🔹 2. Get utility bills
        const billsSnap = await projectFirestore
          .collection("utilityBills-propdial")
          .where("propertyId", "==", propertyId)
          .get();

        const billsCount = billsSnap.size;

        setStats({
          inspections: inspectionCounts,
          bills: billsCount,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [propertyId]);

  return stats;
};

export default usePropertyStats;
