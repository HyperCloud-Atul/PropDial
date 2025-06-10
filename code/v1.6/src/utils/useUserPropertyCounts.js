import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";

const useUserPropertyCounts = (phoneNumber) => {
  const [ownerCount, setOwnerCount] = useState(0);
  const [executiveCount, setExecutiveCount] = useState(0);

  useEffect(() => {
    if (!phoneNumber) return;

    const unsubscribe = projectFirestore
      .collection("propertyusers")
      .where("userId", "==", phoneNumber)
      .onSnapshot((snapshot) => {
        let owner = 0;
        let executive = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();

          const tag = (data.userTag || "").toLowerCase();
          const type = (data.userType || "").toLowerCase();

          if (type === "propertyowner" && tag === "owner") {
            owner++;
          } else if (type === "propertymanager" && tag === "executive") {
            executive++;
          }
        });

        setOwnerCount(owner);
        setExecutiveCount(executive);
      });

    return () => unsubscribe();
  }, [phoneNumber]);

  return { ownerCount, executiveCount };
};

export default useUserPropertyCounts;
