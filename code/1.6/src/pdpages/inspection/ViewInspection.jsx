import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectFirestore, projectStorage } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useCollection } from "../../hooks/useCollection";
import { Modal } from "react-bootstrap";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { format, subMonths } from "date-fns";
import { usePropertyUserRoles } from "../../utils/usePropertyUserRoles";
import { ClipLoader, BarLoader } from "react-spinners";

// import component
import ScrollToTop from "../../components/ScrollToTop";
import PropertySummaryCard from "../property/PropertySummaryCard";
import InactiveUserCard from "../../components/InactiveUserCard";
import ReactTable from "../../components/ReactTable";

// import css
import "./Inspection.scss";

const ViewInspections = () => {
  const { propertyid } = useParams();
  const { user } = useAuthContext();
  const [inspections, setInspections] = useState([]);
  const [filteredInspections, setFilteredInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInspectionTypes, setSelectedInspectionTypes] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties-propdial",
    propertyid
  );
    const {
    isPropertyOwner,
    propertyUserOwnerData,
    isPropertyManager,
    propertyUserManagerData,
  } = usePropertyUserRoles(propertyid, user);
  // card and table view mode functionality start
  const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns

  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };
  // card and table view mode functionality end

  // fetch user
  const { documents: dbUsers, error: dbuserserror } = useCollection(
    "users-propdial",
    ["status", "==", "active"]
  );
  const [dbUserState, setdbUserState] = useState(dbUsers);
  useEffect(() => {
    setdbUserState(dbUsers);
  });

  // useEffect(() => {
  //   if (!propertyid) return;

  //   // Firestore real-time listener
  //   const unsubscribe = projectFirestore
  //     .collection("inspections")
  //     .where("propertyId", "==", propertyid)
  //     .orderBy("createdAt", "desc")
  //     .onSnapshot(
  //       (snapshot) => {
  //         if (!snapshot.empty) {
  //           const inspectionData = snapshot.docs.map((doc) => ({
  //             id: doc.id,
  //             ...doc.data(),
  //           }));
  //           setInspections(inspectionData);
  //         } else {
  //           console.log("No inspections found for this property.");
  //           setInspections([]);
  //         }
  //         setLoading(false);
  //       },
  //       (error) => {
  //         console.error("Error fetching inspections:", error);
  //         setLoading(false);
  //       }
  //     );

  //   // Cleanup function to unsubscribe on component unmount
  //   return () => unsubscribe();
  // }, [propertyid]);

  // Fetch Inspections from Firestore
  useEffect(() => {
    if (!propertyid) return;

    const unsubscribe = projectFirestore
      .collection("inspections")
      .where("propertyId", "==", propertyid)
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          if (!snapshot.empty) {
            const inspectionData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setInspections(inspectionData);
            setFilteredInspections(inspectionData);
          } else {
            setInspections([]);
            setFilteredInspections([]);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching inspections:", error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [propertyid]);

  // **Filter Logic**
  useEffect(() => {
    let filtered = inspections;

    // Search Filter
    if (searchTerm) {
      filtered = filtered.filter(
        (insp) =>
          insp.inspectionType
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          insp.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Inspection Type Filter
    if (selectedInspectionTypes.length > 0) {
      filtered = filtered.filter((insp) =>
        selectedInspectionTypes.includes(insp.inspectionType)
      );
    }

    // Date Range Filter
    if (selectedDateRange) {
      const now = new Date();
      let filterDate = now;

      if (selectedDateRange === "last3months") {
        filterDate = subMonths(now, 3);
      } else if (selectedDateRange === "last6months") {
        filterDate = subMonths(now, 6);
      } else if (selectedDateRange === "lastyear") {
        filterDate = subMonths(now, 12);
      }

      filtered = filtered.filter(
        (insp) => insp.createdAt.toDate() >= filterDate
      );
    }

    setFilteredInspections(filtered);
  }, [searchTerm, selectedInspectionTypes, selectedDateRange, inspections]);

  // **Function to Toggle Inspection Type Filter**
  const toggleInspectionType = (type) => {
    setSelectedInspectionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const [lastInspections, setLastInspections] = useState({
    Regular: null,
    "Move-In": null,
    "Move-Out": null,
    Full: null,
  });

  useEffect(() => {
    if (inspections.length > 0) {
      const lastPending = {
        Regular: null,
        "Move-In": null,
        "Move-Out": null,
        Full: null,
      };

      ["Regular", "Move-In", "Move-Out", "Full"].forEach((type) => {
        const pending = inspections
          .filter((insp) => insp.inspectionType === type && !insp.finalSubmit)
          .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()); // Newest first

        if (pending.length > 0) {
          lastPending[type] = pending[0]; // Latest pending inspection
        }
      });

      setLastInspections(lastPending);
    }
  }, [inspections]);
  const handleAddInspection = async (type) => {
    if (lastInspections[type]) {
      navigate(`/add-inspection/${lastInspections[type].id}`);
      return;
    }
    setShowPopup(false);
    setIsRedirecting(true);

    try {
      const newInspectionRef = await projectFirestore
        .collection("inspections")
        .add({
          propertyId: propertyid,
          inspectionType: type,
          createdBy: user.phoneNumber,
          createdAt: new Date(),
          finalSubmit: false,
        });

      navigate(`/add-inspection/${newInspectionRef.id}`);
    } catch (error) {
      console.error("Error creating new inspection:", error);
    } finally {
      setIsRedirecting(false);
    }
  };

  const deleteImagesFromStorage = async (inspectionDoc) => {
    try {
      const deleteImagePromises = [];
      inspectionDoc.inspections.forEach((roomInspection) => {
        if (roomInspection.images) {
          roomInspection.images.forEach((imgUrl) => {
            const imageRef = projectStorage.refFromURL(imgUrl);
            deleteImagePromises.push(imageRef.delete());
          });
        }
      });
      await Promise.all(deleteImagePromises);
      console.log("All images deleted from storage.");
    } catch (error) {
      console.error("Error deleting images from storage:", error);
    }
  };

  const deleteEntireDocument = async (id) => {
    try {
      const inspectionDoc = inspections.find(
        (inspection) => inspection.id === id
      );
      if (!inspectionDoc) return;

      // Delete images from storage
      await deleteImagesFromStorage(inspectionDoc);

      // Delete the document itself
      await projectFirestore.collection("inspections").doc(id).delete();

      // Update the state to remove the deleted inspection
      setInspections((prev) =>
        prev.filter((inspection) => inspection.id !== id)
      );
      console.log("Document and all associated images deleted successfully.");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const deleteRoomInspection = async (docId, roomIdx) => {
    try {
      const inspectionDoc = inspections.find(
        (inspection) => inspection.id === docId
      );
      if (!inspectionDoc) return;

      // Delete images from storage
      const roomInspection = inspectionDoc.inspections[roomIdx];
      if (roomInspection.images) {
        const deleteImagePromises = roomInspection.images.map((imgUrl) => {
          const imageRef = projectStorage.refFromURL(imgUrl);
          return imageRef.delete();
        });
        await Promise.all(deleteImagePromises);
      }

      // Update the document
      const updatedInspections = [...inspectionDoc.inspections];
      updatedInspections.splice(roomIdx, 1);

      await projectFirestore.collection("inspections").doc(docId).update({
        inspections: updatedInspections,
      });

      // Update state
      setInspections((prev) =>
        prev.map((inspection) =>
          inspection.id === docId
            ? { ...inspection, inspections: updatedInspections }
            : inspection
        )
      );

      console.log("Room inspection deleted successfully.");
    } catch (error) {
      console.error("Error deleting room inspection:", error);
    }
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
        Header: "Inspection Type",
        accessor: "inspectionType",
        disableFilters: true,
      },
      {
        Header: "Action",
        accessor: "id",
        disableFilters: true,
        Cell: ({ row }) => {
          const { id, finalSubmit } = row.original; // Get finalSubmit field
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Link to={`/inspection-report/${id}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#00a8a8"
                >
                  <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                </svg>
              </Link>
              {/* Show Edit Icon only if finalSubmit is false */}
              {!finalSubmit && (
                <Link
                  to={`/add-inspection/${id}`}
                  style={{
                    paddingLeft: "15px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#00a8a8"
                  >
                    <path d="M80 0v-160h800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 56 56ZM608-631l-29-29-28-28 57 57Z" />
                  </svg>
                </Link>
              )}
            </div>
          );
        },
      },
      {
        Header: "Inspection Date",
        accessor: "createdAt",
        disableFilters: true,
        Cell: ({ value }) => (
          <div className="mobile_min_width">
            {format(value.toDate(), "dd-MMM-yy hh:mm a")}
          </div>
        ),
      },
      {
        Header: "Inspections Areas",
        accessor: "rooms",
        disableFilters: true,
        Cell: ({ value }) => (
          <div className="mobile_min_width">
            {Array.isArray(value) && value.length > 0 ? (
              value.map((roomInspection, idx) => (
                <span key={idx}>
                  {roomInspection.roomName || "No Room Name"}
                  {idx !== value.length - 1 && ", "}
                </span>
              ))
            ) : (
              <span>No Inspections Available</span>
            )}
          </div>
        ),
      },
    ],
    []
  );

  // role wise inspection visiblity 
  const userRolesWithFullAccess = ["admin", "superAdmin", "executive"];

const visibleInspections = filteredInspections?.filter((iDoc) => {
  // Admin, SuperAdmin, Executive ke liye sab dikhega
  if (userRolesWithFullAccess.includes(user?.role)) {
    return true;
  }
  // Baaki users ke liye sirf finalSubmit true ho tab dikhao
  return iDoc.finalSubmit === true;
});


  if (loading) {
    return (
      <div className="page_loader">
        <ClipLoader color="var(--theme-green2)" loading={true} />
      </div>
    );
  }

  return (
    <>
      <div className="pg_min_height">
        <Modal show={isRedirecting} centered className="uploading_modal">
          <h6
            style={{
              color: "var(--theme-green2)",
            }}
          >
            Redirecting...
          </h6>
          <BarLoader color="var(--theme-green2)" loading={true} height={10} />
        </Modal>
        {user?.status === "active" ? (
          <div className="top_header_pg pg_bg property_keys_pg property_inspection_pg">
            <ScrollToTop />
            <div className="page_spacing pg_min_height">
              <div className="row row_reverse_991">
                <div className="col-lg-6">
                  <div className="title_card mobile_full_575 mobile_gap h-100">
                    <h2 className="text-center mb-4">
                      OnePlace for Property Inspection
                    </h2>

                   {user && (
                    user.role === "admin" || user.role === "superAdmin" || isPropertyManager
                   ) && (
                    <div
                    className="theme_btn btn_fill no_icon text-center short_btn"
                    onClick={() => setShowPopup(true)}
                  >
                    Add Inspection
                  </div>
                   )}
                    <Modal
                      show={showPopup}
                      className="delete_modal inspection_modal"
                      centered
                    >
                      <span
                        className="material-symbols-outlined modal_close"
                        onClick={() => setShowPopup(false)}
                      >
                        close
                      </span>
                      <h5 className="text_blue text-center">
                        Select Inspection Type
                      </h5>
{/* plz don't delete this code, this is the code for all move in move and full inspection click  */}
                      {/* <div className="inspection_types">
                        {["Regular", "Move-In", "Move-Out", "Full", "Issue Based"].map(
                          (type) => (
                            <div
                              key={type}
                              onClick={() =>
                                lastInspections[type]
                                  ? navigate(
                                      `/add-inspection/${lastInspections[type].id}`
                                    )
                                  : handleAddInspection(type)
                              }
                              className={`it_single ${
                                lastInspections[type] ? "disabled" : ""
                              }`}
                            >
                              <span>
                                {type} Inspection{" "}
                                {lastInspections[type] && (
                                  <div
                                    style={{
                                      color: "var(--theme-red)",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {" "}
                                    (Complete the last inspection first)
                                  </div>
                                )}
                              </span>
                              <img
                                src={`/assets/img/${type
                                  .toLowerCase()
                                  .replace("-", "")}.png`}
                                alt="propdial"
                              />
                            </div>
                          )
                        )}
                      </div> */}
                      <div className="inspection_types">
  {["Regular", "Move-In", "Move-Out", "Full"].map((type) => (
    <div
      key={type}
      onClick={() =>
        type === "Regular"
          ? lastInspections[type]
            ? navigate(`/add-inspection/${lastInspections[type].id}`)
            : handleAddInspection(type)
          : null
      }
      className={`it_single ${type !== "Regular" ? "disabled" : ""}`}
      style={type !== "Regular" ? { cursor: "not-allowed", opacity: 0.6 } : {}}
    >
      <span>
        {type} Inspection{" "}
        {type === "Regular" && lastInspections[type] && (
          <div
            style={{
              color: "var(--theme-red)",
              fontSize: "13px",
            }}
          >
            (Complete the last inspection first)
          </div>
        )}
      </span>
      {type !== "Regular" && (
        <div style={{ color: "gray", fontSize: "12px" }}>Coming Soon</div>
      )}
      <img
        src={`/assets/img/${type.toLowerCase().replace("-", "")}.png`}
        alt="propdial"
      />
    </div>
  ))}
</div>

                    </Modal>
                  </div>
                </div>
                <PropertySummaryCard
                  propertydoc={propertydoc}
                  propertyId={propertyid}
                />
              </div>
              {inspections && inspections.length === 0 && (
                <div
                  className="pg_msg"
                  style={{
                    height: "calc(55vh)",
                  }}
                >
                  <div>No Inspection Yet!</div>
                </div>
              )}
              {inspections && inspections.length !== 0 && (
                <>
                  <div className="vg22"></div>
                  <div className="filters">
                    <div className="left">
                      <div className="rt_global_search search_field">
                        <input
                          type="text"
                          placeholder="Search inspections..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            search
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="right">
                      {/* <div className="user_filters new_inline">
                        <div className="form_field">
              <div className="field_box theme_checkbox">
                <div
                  className="theme_checkbox_container"
                  style={{
                    padding: "0px",
                    border: "none",
                  }}
                >
                 {["Regular", "Move-In", "Move-Out", "Full"].map((type) => {
                    const count = inspections.filter(
                      (i) => i.inspectionType === type
                    ).length;
                    return (
                      <div
                        className="radio_single"
                        key={type}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedInspectionTypes.includes(type)}
                          onChange={() => toggleInspectionType(type)}
                          id={type}
                        />
                        <label htmlFor={type}>
                        {type} ({count})
                        </label>
                      </div>
                     );
                    })}
                </div>
              </div>
            </div>

                        <select
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                  >
                    <option value="">All Time</option>
                    <option value="last3months">Last 3 Months</option>
                    <option value="last6months">Last 6 Months</option>
                    <option value="lastyear">Last 1 Year</option>
                  </select>
                        <div className="active-filters">
                  <h4>Active Filters</h4>
                  {searchTerm && <span>Search: {searchTerm}</span>}
                  {selectedInspectionTypes.length > 0 && (
                    <span>
                      Inspection Types: {selectedInspectionTypes.join(", ")}
                    </span>
                  )}
                  {selectedDateRange && (
                    <span>Date Range: {selectedDateRange}</span>
                  )}
                </div>
                      </div> */}
                      <div className="button_filter diff_views">
                        <div
                          className={`bf_single ${
                            viewMode === "card_view" ? "active" : ""
                          }`}
                          onClick={() => handleModeChange("card_view")}
                        >
                          <span className="material-symbols-outlined">
                            calendar_view_month
                          </span>
                        </div>
                        <div
                          className={`bf_single ${
                            viewMode === "table_view" ? "active" : ""
                          }`}
                          onClick={() => handleModeChange("table_view")}
                        >
                          <span className="material-symbols-outlined">
                            view_list
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr></hr>
                  {viewMode === "card_view" && (
                    <div className="propdial_users all_tenants inspection_card">
                      {visibleInspections &&
                        visibleInspections.map((iDoc) => (
                          <div className="pu_single">
                            <div className="tc_single relative item">
                              <div className="left">
                                <div className="tenant_detail">
                                  <div className="t_name pointer">
                                    {iDoc.inspectionType} Inspection
                                  </div>
                                  <div className="i_areas">
                                    {iDoc.rooms?.length ? (
                                      iDoc.rooms.map((room, idx) => (
                                        <span key={idx}>
                                          {room.roomName || "No Room Name"}
                                          {idx < iDoc.rooms.length - 1}
                                        </span>
                                      ))
                                    ) : (
                                      <span>No Inspections Available</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`wha_call_icon ${
                                  iDoc.finalSubmit
                                    ? "final_submit"
                                    : "final_submit"
                                }`}
                              >
                                {user && !iDoc.finalSubmit && (user.role === "admin" || user.role === "superAdmin" || isPropertyManager) && (
                                  <Link
                                    className="wha_icon wc_single"
                                    to={`/add-inspection/${iDoc.id}`}
                                    style={{
                                      height: "100%",
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24px"
                                      viewBox="0 -960 960 960"
                                      width="24px"
                                      fill="#00a8a8"
                                    >
                                      <path d="M80 0v-160h800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 56 56ZM608-631l-29-29-28-28 57 57Z" />
                                    </svg>
                                  </Link>
                                )}
                                {iDoc.finalSubmit && (
                                  <Link
                                    className="call_icon wc_single"
                                    to={`/inspection-report/${iDoc.id}`}
                                    style={{
                                      height: "100%",
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24px"
                                      viewBox="0 -960 960 960"
                                      width="24px"
                                      fill="#00a8a8"
                                    >
                                      <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                                    </svg>
                                  </Link>
                                )}
                              </div>
                              {iDoc.status === "inactive" && (
                                <div className="inactive_tag">Inactive</div>
                              )}
                            </div>
                            <div className="dates">
                              <div className="date_single">
                                <strong>At</strong>:{" "}
                                {iDoc.lastUpdatedAt ? (<span>
                                  {format(iDoc.lastUpdatedAt.toDate(), "dd-MMM-yy")}
                                </span>) : (<span>
                                  {format(iDoc.createdAt.toDate(), "dd-MMM-yy")}
                                </span>)}
                                
                              </div>
                              <div className="date_single">
                                <strong>By</strong>:{" "}
                                
                                <span>
                                  {dbUserState &&
                                    dbUserState.find(
                                      (user) => user.id === iDoc.createdBy
                                    )?.displayName}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                  {viewMode === "table_view" && (
                    <div className="user-single-table table_filter_hide mt-3">
                      <ReactTable
                        tableColumns={columns}
                        tableData={visibleInspections}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <InactiveUserCard />
        )}
      </div>
    </>
  );
};

export default ViewInspections;
