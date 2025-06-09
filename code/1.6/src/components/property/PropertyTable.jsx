import React, { useEffect, useState, useMemo } from "react";
import ReactTable from "../ReactTable";
import { generateSlug } from "../../utils/generateSlug";
import { Link } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { projectFirestore } from "../../firebase/config";

const PropertyTable = ({ properties }) => {
  const [mergedData, setMergedData] = useState([]);

  // old useeffect which render table again and again 
  // useEffect(() => {
  //   if (!properties || properties.length === 0) return;

  //   const initialData = properties.map((property) => ({
  //     ...property,
  //     owner: "...",
  //     executive: "...",
  //     tenant: "...",
  //   }));

  //   setMergedData(initialData);

  //   const userCache = new Map();

  //   const fetchUserDetails = async (userId) => {
  //     if (!userId) return ":::";

  //     if (userCache.has(userId)) return userCache.get(userId);

  //     try {
  //       const userDoc = await projectFirestore
  //         .collection("users-propdial")
  //         .doc(userId)
  //         .get();

  //       let result;
  //       if (userDoc.exists) {
  //         const data = userDoc.data();
  //         result = `${data.fullName || ""}::${data.email || ""}::${data.phoneNumber || userId}::${data.countryCode || "IN"}`;
  //       } else {
  //         result = `::${userId}`;
  //       }

  //       userCache.set(userId, result);
  //       return result;
  //     } catch (error) {
  //       console.error("Error fetching user details:", error);
  //       const fallback = `::${userId}`;
  //       userCache.set(userId, fallback);
  //       return fallback;
  //     }
  //   };

  //   const updateRoleField = (propertyId, field, value) => {
  //     setMergedData((prevData) =>
  //       prevData.map((item) =>
  //         item.id === propertyId ? { ...item, [field]: value } : item
  //       )
  //     );
  //   };

  //   const fetchRoles = async () => {
  //     for (const property of properties) {
  //       const rolesSnapshot = await projectFirestore
  //         .collection("propertyusers")
  //         .where("propertyId", "==", property.id)
  //         .get();

  //       for (const doc of rolesSnapshot.docs) {
  //         const data = doc.data();
  //         const type = (data.userType || "").toLowerCase();
  //         const tag = (data.userTag || "").toLowerCase();
  //         const userId = data.userId;

  //         if (!userId) continue;

  //         if (type === "propertyowner" && tag === "owner") {
  //           const ownerData = await fetchUserDetails(userId);
  //           updateRoleField(property.id, "owner", ownerData);
  //         }

  //         if (type === "propertymanager" && tag === "executive") {
  //           const execData = await fetchUserDetails(userId);
  //           updateRoleField(property.id, "executive", execData);
  //         }

  //         if (type === "propertytenant" && tag === "tenant") {
  //           const tenantData = await fetchUserDetails(userId);
  //           updateRoleField(property.id, "tenant", tenantData);
  //         }
  //       }
  //     }
  //   };

  //   fetchRoles();
  // }, [properties]);
  useEffect(() => {
    if (!properties || properties.length === 0) return;
 let isMounted = true;
    const initialData = properties.map((property) => ({
      ...property,
      owner: "...",
      executive: "...",
      tenant: "...",
    }));

    setMergedData(initialData);

    const userCache = new Map();

    const fetchUserDetails = async (userId) => {
      if (!userId) return ":::";

      if (userCache.has(userId)) return userCache.get(userId);

      try {
        const userDoc = await projectFirestore
          .collection("users-propdial")
          .doc(userId)
          .get();

        let result;
        if (userDoc.exists) {
          const data = userDoc.data();
          result = `${data.fullName || ""}::${data.email || ""}::${data.phoneNumber || userId}::${data.countryCode || "IN"}`;
        } else {
          result = `::${userId}`;
        }

        userCache.set(userId, result);
        return result;
      } catch (error) {
        console.error("Error fetching user details:", error);
        const fallback = `::${userId}`;
        userCache.set(userId, fallback);
        return fallback;
      }
    };

     const fetchRoles = async () => {
    const updatedData = [...initialData];

    for (const property of updatedData) {
      const rolesSnapshot = await projectFirestore
        .collection("propertyusers")
        .where("propertyId", "==", property.id)
        .get();

      for (const doc of rolesSnapshot.docs) {
        const data = doc.data();
        const type = (data.userType || "").toLowerCase();
        const tag = (data.userTag || "").toLowerCase();
        const userId = data.userId;

        if (!userId) continue;

        const userData = await fetchUserDetails(userId);

        if (type === "propertyowner" && tag === "owner") {
          property.owner = userData;
        }
           if (type === "propertyowner" && tag === "co-owner") {
          property.owner = userData;
        }
        if (type === "propertymanager" && tag === "executive") {
          property.executive = userData;
        }
        if (type === "propertytenant" && tag === "tenant") {
          property.tenant = userData;
        }
      }
    }

    if (isMounted) {
      setMergedData(updatedData); // set only once after full role fetch
    }
  };

  fetchRoles();

  return () => {
    isMounted = false;
  };
}, [properties]);
  const renderUserCell = (value) => {
    if (!value || value === "...") {
      return <div className="mobile_min_width">...</div>;
    }

    const [name, email, phone, countryCodeRaw] = value.split("::");
    const countryCode = (countryCodeRaw || "IN").toUpperCase();

    const formattedPhone = (() => {
      try {
        const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
        return phoneNumber ? phoneNumber.formatInternational() : phone || "-";
      } catch (error) {
        return phone || "-";
      }
    })();

    return (
      <div className="mobile_min_width">
        <div><strong>{name || "-"}</strong></div>
        <div>{email || "-"}</div>
        <div>{formattedPhone}</div>
        {/* <div>{countryCode}</div> */}
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "serialNumber",
        Cell: ({ row }) => row.index + 1,
        disableFilters: true,
      },
      {
        Header: "Action",
        accessor: "id",
        disableFilters: true,
        Cell: ({ row }) => {
          const property = row.original;
          const slug = generateSlug(property);
          return (
            <div className="d-flex align-items-center">
              <Link to={`/propertydetails/${slug}`}>
                <span
                  className="material-symbols-outlined click_icon pointer"
                  style={{ fontSize: "20px", marginRight: "8px" }}
                >
                  visibility
                </span>
              </Link>
              <Link to={`/updateproperty/${property.id}`}>
                <span
                  className="material-symbols-outlined click_icon pointer"
                  style={{ fontSize: "20px", marginRight: "8px" }}
                >
                  border_color
                </span>
              </Link>
            </div>
          );
        },
      },
      {
        Header: "PID",
        accessor: "pid",
        disableSortBy: true,
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
      },
      {
        Header: "State",
        accessor: "state",
        
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
      },
      {
        Header: "City",
        accessor: "city",
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
      },
      {
        Header: "Locality",
        accessor: "locality",
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
      },
      {
        Header: "Society",
        accessor: "society",
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
      },
      {
        Header: "Unit No",
        accessor: "unitNumber",
        disableSortBy: true,
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
      },
      {
        Header: "Owner",
        accessor: "owner",
        Cell: ({ value }) => renderUserCell(value),
      },
      {
        Header: "Executive",
        accessor: "executive",
        Cell: ({ value }) => renderUserCell(value),
      },
      {
        Header: "Tenant",
        accessor: "tenant",
        Cell: ({ value }) => renderUserCell(value),
      },
      { Header: "Flag", accessor: "purpose", disableSortBy: true, },
    ],
    []
  );

  return (
    <div className="property_table table_filter_hide">
      <ReactTable tableColumns={columns} tableData={mergedData} />
    </div>
  );
};

export default PropertyTable;
