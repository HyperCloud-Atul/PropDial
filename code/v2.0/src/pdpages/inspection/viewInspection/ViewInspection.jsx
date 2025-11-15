  import React, { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import { projectFirestore } from "../../../firebase/config";
  import { useAuthContext } from "../../../hooks/useAuthContext";
  import { useDocument } from "../../../hooks/useDocument";
  import { useCollection } from "../../../hooks/useCollection";
  import { Modal } from "react-bootstrap";
  import { useMemo } from "react";
  import { Link } from "react-router-dom";
  import { format, subMonths } from "date-fns";
  import { usePropertyUserRoles } from "../../../utils/usePropertyUserRoles";
  import { ClipLoader, BarLoader } from "react-spinners";

  // Import components
  import ScrollToTop from "../../../components/ScrollToTop";
  import PropertySummaryCard from "../../property/PropertySummaryCard";
  import InactiveUserCard from "../../../components/InactiveUserCard";
  import ReactTable from "../../../components/ReactTable";
  import InspectionFilters from "./Components/InspectionFilters";
  import InspectionCardView from "./Components/InspectionCardView";
  import AddInspectionModal from "./Components/AddInspectionModal";
  import DownloadReportModal from "./Components/DownloadReportModal";

  // Import css
  import "../Inspection.scss";

  const ViewInspections = () => {
    const { propertyid } = useParams();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    // State management
    const [inspections, setInspections] = useState([]);
    const [filteredInspections, setFilteredInspections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [selectedInspectionForDownload, setSelectedInspectionForDownload] = useState(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    
    // Filters State
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedInspectionTypes, setSelectedInspectionTypes] = useState([]);
    const [selectedDateRange, setSelectedDateRange] = useState("");
    const [viewMode, setviewMode] = useState("card_view");

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

    // Fetch users
    const { documents: dbUsers, error: dbuserserror } = useCollection(
      "users-propdial",
      ["status", "==", "active"]
    );
    const [dbUserState, setdbUserState] = useState(dbUsers);

    useEffect(() => {
      setdbUserState(dbUsers);
    }, [dbUsers]);

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

    // Filter Logic
    useEffect(() => {
      let filtered = inspections;

      // Search Filter
      if (searchTerm) {
        filtered = filtered.filter(
          (insp) =>
            insp.inspectionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    // Last inspections state
    // const [lastInspections, setLastInspections] = useState({
    //   Regular: null,
    //   "Move-In": null,
    //   "Move-Out": null,
    //   Full: null,
    // });

    // useEffect(() => {
    //   if (inspections.length > 0) {
    //     const lastPending = {
    //       Regular: null,
    //       "Move-In": null,
    //       "Move-Out": null,
    //       Full: null,
    //     };

    //     ["Regular", "Move-In", "Move-Out", "Full"].forEach((type) => {
    //       const pending = inspections
    //         .filter((insp) => insp.inspectionType === type && !insp.finalSubmit)
    //         .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

    //       if (pending.length > 0) {
    //         lastPending[type] = pending[0];
    //       }
    //     });

    //     setLastInspections(lastPending);
    //   }
    // }, [inspections]);

    // Last inspections state
const [lastInspections, setLastInspections] = useState({
  Regular: null,
  "Move-In": null,
  "Move-Out": null,
  Full: null,
  "Issue Based": null,
});

useEffect(() => {
  if (inspections.length > 0) {
    const lastPending = {
      Regular: null,
      "Move-In": null,
      "Move-Out": null,
      Full: null,
      "Issue Based": null,
    };

    ["Regular", "Move-In", "Move-Out", "Full", "Issue Based"].forEach((type) => {
      const pending = inspections
        .filter((insp) => insp.inspectionType === type && !insp.finalSubmit)
        .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

      if (pending.length > 0) {
        lastPending[type] = pending[0];
      }
    });

    setLastInspections(lastPending);
  }
}, [inspections]);


    // Handle Add Inspection
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

    // Handle Download Report
    const handleDownloadReport = (inspection) => {
      setSelectedInspectionForDownload(inspection);
      setShowDownloadModal(true);
    };

    // Table columns
    const columns = useMemo(
      () => [
        {
          Header: "S.No",
          accessor: (row, i) => i + 1,
          id: "serialNumber",
          Cell: ({ row }) => row.index + 1,
          disableFilters: true,
          disableSortBy: true,
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
          disableSortBy: true,
          Cell: ({ row }) => {
            const { id, finalSubmit } = row.original;
            return (
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                {/* View Icon - Always show */}
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

                {/* Download Icon - Only show if finalSubmit is true */}
                {finalSubmit && (
                  <button 
                    onClick={() => handleDownloadReport(row.original)}
                    style={{ 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer",
                      padding: 0
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#00a8a8"
                    >
                      <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                    </svg>
                  </button>
                )}

                {/* Edit Icon - Only show if finalSubmit is false */}
                {!finalSubmit && (
                  <Link to={`/add-inspection/${id}`}>
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
          disableSortBy: true,
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
          disableSortBy: true,
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

    // Role wise inspection visibility
    const userRolesWithFullAccess = ["admin", "superAdmin", "executive"];
    const visibleInspections = filteredInspections?.filter((iDoc) => {
      if (userRolesWithFullAccess.includes(user?.role)) {
        return true;
      }
      return iDoc.finalSubmit === true;
    });

    // View mode handler
    const handleModeChange = (newViewMode) => {
      setviewMode(newViewMode);
    };

    // Toggle inspection type filter
    const toggleInspectionType = (type) => {
      setSelectedInspectionTypes((prev) =>
        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
      );
    };

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
            <h6 style={{ color: "var(--theme-green2)" }}>
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

                      {user && (user.role === "admin" || user.role === "superAdmin" || isPropertyManager) && (
                        <div
                          className="theme_btn btn_fill no_icon text-center short_btn"
                          onClick={() => setShowPopup(true)}
                        >
                          Add Inspection
                        </div>
                      )}
                    </div>
                  </div>
                  <PropertySummaryCard
                    propertydoc={propertydoc}
                    propertyId={propertyid}
                  />
                </div>

                {/* Add Inspection Modal */}
                <AddInspectionModal
                  showPopup={showPopup}
                  setShowPopup={setShowPopup}
                  lastInspections={lastInspections}
                  handleAddInspection={handleAddInspection}
                  navigate={navigate}
                />

                {/* Download Report Modal */}
                <DownloadReportModal
                  showDownloadModal={showDownloadModal}
                  setShowDownloadModal={setShowDownloadModal}
                  selectedInspection={selectedInspectionForDownload}
                  dbUserState={dbUserState}
                />

                {inspections && inspections.length === 0 && (
                  <div
                    className="pg_msg"
                    style={{ height: "calc(55vh)" }}
                  >
                    <div>No Inspection Yet!</div>
                  </div>
                )}

                {inspections && inspections.length !== 0 && (
                  <>
                    <div className="vg22"></div>
                    
                    {/* Filters Component */}
                    <InspectionFilters
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      viewMode={viewMode}
                      handleModeChange={handleModeChange}
                    />

                    <hr />

                    {/* Card View */}
                    {viewMode === "card_view" && (
                      <InspectionCardView
                        inspections={visibleInspections}
                        dbUserState={dbUserState}
                        handleDownloadReport={handleDownloadReport}
                        user={user}
                        isPropertyManager={isPropertyManager}
                      />
                    )}

                    {/* Table View */}
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