import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectFirestore, projectStorage } from "../../firebase/config"; // Ensure you have projectStorage for image deletion
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { Modal } from "react-bootstrap";
import { useMemo } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

// import component
import ScrollToTop from "../../components/ScrollToTop";
import PropertySummaryCard from "../property/PropertySummaryCard";
import InactiveUserCard from "../../components/InactiveUserCard";
import ReactTable from "../../components/ReactTable";
import { ClipLoader, BarLoader } from "react-spinners";

// import css
import "./Inspection.scss";

const ViewInspections = () => {
  const { propertyid } = useParams();
  const { user } = useAuthContext();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties-propdial",
    propertyid
  );  

  useEffect(() => {
    if (!propertyid) return;

    // Firestore real-time listener
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
          } else {
            console.log("No inspections found for this property.");
            setInspections([]);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching inspections:", error);
          setLoading(false);
        }
      );

    // Cleanup function to unsubscribe on component unmount
    return () => unsubscribe();
  }, [propertyid]);

  const handleAddInspection = async (type) => {
    if (inspections.length > 0) {
      // Get the last created inspection by sorting inspections by createdAt
      const lastInspection = inspections
        .slice()
        .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())[0];
  
      if (lastInspection) {
        if (lastInspection.inspectionType === type && !lastInspection.finalSubmit) {
          alert("You cannot add a new inspection until the last one is finished.");
          return;
        }
      }
    }
  
    // Proceed with creating the new inspection if conditions are met
    setShowPopup(false);
    setIsRedirecting(true); // Show loader
  
    try {
      const newInspectionRef = await projectFirestore.collection("inspections").add({
        propertyId: propertyid,
        inspectionType: type,
        createdBy: user.uid,
        createdAt: new Date(),
        finalSubmit: false, // Default to false until submitted
      });
  
      const newInspectionId = newInspectionRef.id;
      navigate(`/add-inspection/${newInspectionId}`);
    } catch (error) {
      console.error("Error creating new inspection document:", error);
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
            <div style={{ display: "flex", alignItems: "center" }} >
              <Link to={`/inspection-report/${id}`} >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00a8a8">
                  <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                </svg>
              </Link>
              {/* Show Edit Icon only if finalSubmit is false */}
              {!finalSubmit && (
                <Link to={`/add-inspection/${id}`}  style={{
                  paddingLeft: "15px",
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00a8a8">
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
        {user && user.status === "active" ? (
          <div className="top_header_pg pg_bg property_keys_pg property_inspection_pg">
            <ScrollToTop />
            <div className="page_spacing pg_min_height">
              <div className="row row_reverse_991">
                <div className="col-lg-6">
                  <div className="title_card mobile_full_575 mobile_gap h-100">
                    <h2 className="text-center mb-4">
                      OnePlace for Property Inspection
                    </h2>

                    <div
                      className="theme_btn btn_fill no_icon text-center short_btn"
                      onClick={() => setShowPopup(true)}
                    >
                      Add Inspection
                    </div>
                    <Modal
                      show={showPopup}
                      // onHide={handleConfirmClose}
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
                      <div className="inspection_types">
                        <div
                          onClick={() => handleAddInspection("Regular")}
                          className="it_single"
                        >
                          <span> Regular Inspection</span>
                          <img
                            src="/assets/img/inspection3.png"
                            alt="propdial"
                          />
                        </div>
                        <div
                          onClick={() => handleAddInspection("Move-In")}
                          className="it_single"
                        >
                          <span>Move-In Inspection</span>
                          <img src="/assets/img/check-in.png" alt="propdial" />
                        </div>
                        <div
                          onClick={() => handleAddInspection("Move-Out")}
                          className="it_single"
                        >
                          <span>Move-Out Inspection</span>
                          <img src="/assets/img/check-out.png" alt="propdial" />
                        </div>
                        <div
                          onClick={() => handleAddInspection("Full")}
                          className="it_single"
                        >
                          <span>Full Inspection</span>
                          <img
                            src="/assets/img/inspection1.png"
                            alt="propdial"
                          />
                        </div>
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
                <div className="user-single-table table_filter_hide mt-3">
                  <ReactTable tableColumns={columns} tableData={inspections} />
                </div>
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
