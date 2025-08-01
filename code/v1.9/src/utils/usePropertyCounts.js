
import { useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { projectFirestore } from "../firebase/config";

const usePropertyCounts = () => {
  const [counts, setCounts] = useState({});
  const [countLoading, setCountLoading] = useState(true);
  const [countError, setCountError] = useState("");

  useEffect(() => {
    const cached = sessionStorage.getItem("propertyCounts");

    if (cached) {
      setCounts(JSON.parse(cached));
      setCountLoading(false);
    }

    const fetchCounts = async () => {
      try {
        const baseColl = collection(projectFirestore, "properties-propdial");

        const [
          totalSnap,
          inReviewSnap,
          inactiveSnap,
          activeSnap,
          residentialSnap,
          commercialSnap,
          plotCountSnap,
          availableForRentSnap,
          availableForSaleSnap,
          rentedOutSnap,
          soldSnap,
          rentAndSaleSnap,
          rentedButSaleSnap,
          pmsOnlySnap,
          pmsAfterRentSnap,
        ] = await Promise.all([
          getCountFromServer(baseColl),
          getCountFromServer(query(baseColl, where("isActiveInactiveReview", "==", "In-Review"))),
          getCountFromServer(query(baseColl, where("isActiveInactiveReview", "==", "Inactive"))),
          getCountFromServer(query(baseColl, where("isActiveInactiveReview", "==", "Active"))),
          getCountFromServer(query(baseColl, where("category", "==", "Residential"))),
          getCountFromServer(query(baseColl, where("category", "==", "Commercial"))),
          getCountFromServer(query(baseColl, where("category", "==", "Plot"))),
          getCountFromServer(query(baseColl, where("flag", "==", "Available For Rent"))),
          getCountFromServer(query(baseColl, where("flag", "==", "Available For Sale"))),
          getCountFromServer(query(baseColl, where("flag", "==", "Rented Out"))),
          getCountFromServer(query(baseColl, where("flag", "==", "Sold Out"))),
          getCountFromServer(query(baseColl, where("flag", "==", "Rent and Sale"))),
          getCountFromServer(query(baseColl, where("flag", "==", "Rented But Sale"))),
          getCountFromServer(query(baseColl, where("flag", "==", "PMS Only"))),
          getCountFromServer(query(baseColl, where("flag", "==", "PMS After Rent"))),
        ]);

        const freshData = {
          totalCount: totalSnap.data().count,
          inReviewCount: inReviewSnap.data().count,
          inactiveCount: inactiveSnap.data().count,
          activeCount: activeSnap.data().count,
          residentialCount: residentialSnap.data().count,
          commercialCount: commercialSnap.data().count,
          plotCount: plotCountSnap.data().count,
          availableForRentCount: availableForRentSnap.data().count,
          availableForSaleCount: availableForSaleSnap.data().count,
          rentedOutCount: rentedOutSnap.data().count,
          soldCount: soldSnap.data().count,
          rentAndSaleCount: rentAndSaleSnap.data().count,
          rentedButSaleCount: rentedButSaleSnap.data().count,
          pmsOnlyCount: pmsOnlySnap.data().count,
          pmsAfterRentCount: pmsAfterRentSnap.data().count,
        };

        const oldData = JSON.parse(sessionStorage.getItem("propertyCounts") || "{}");

        if (JSON.stringify(oldData) !== JSON.stringify(freshData)) {
          sessionStorage.setItem("propertyCounts", JSON.stringify(freshData));
          setCounts(freshData);
        }

        setCountLoading(false);
      } catch (err) {
        console.error("❌ Error fetching property counts:", err);
        setCountError("Failed to fetch property counts");
        setCountLoading(false);
      }
    };

    const baseColl = collection(projectFirestore, "properties-propdial");
    const unsubscribe = onSnapshot(baseColl, () => fetchCounts());

    fetchCounts();

    return () => unsubscribe();
  }, []);

  return { counts, countLoading, countError };
};

export default usePropertyCounts;
