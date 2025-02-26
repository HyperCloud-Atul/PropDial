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

// import css
import "./Inspection.scss";

const ViewInspections = () => {
  const { propertyid } = useParams();
  const { user } = useAuthContext();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  
  const navigate = useNavigate();
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties-propdial",
    propertyid
  );

  const handleAddInspection = (type) => {
    setShowPopup(false);
    navigate(`/add-inspection/${propertyid}?type=${type}`);
  };

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const snapshot = await projectFirestore
          .collection("inspections")
          .where("propertyId", "==", propertyid)
          .get();

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
      } catch (error) {
        console.error("Error fetching inspections:", error);
      } finally {
        setLoading(false);
      }
    };

    if (propertyid) {
      fetchInspections();
    }
  }, [propertyid]);

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
        disableFilters: false,
      },
            {
              Header: "Inspection Date",
              accessor: "createdAt",
              Cell: ({ value }) => (
                <div className="mobile_min_width">
                  {format(value.toDate(), "dd-MMM-yy hh:mm a")}
                </div>
              ),
            },
            {
                Header: "Inspections Areas",
                accessor: "inspections",
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
              {
                Header: "Action",
                accessor: "id",
                Cell: ({ value }) => (
                  <Link to={value} className="mobile_min_width">
                    View
                  </Link>
                ),
              },
    ],
    []
  );

  if (loading) {
    return <p>Loading inspections...</p>;
  }



  return (
    <>
    <div className="pg_min_height">
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
                        <img src="/assets/img/inspection3.png" alt="" />
                      </div>
                      <div
                       onClick={() => handleAddInspection("Move-In")}
                        className="it_single"
                      >
                        <span>Move-In Inspection</span>
                        <img src="/assets/img/check-in.png" alt="" />
                      </div>
                      <div
                       onClick={() => handleAddInspection("Move-Out")}
                        className="it_single"
                      >
                        <span>Move-Out Inspection</span>
                        <img src="/assets/img/check-out.png" alt="" />
                      </div>
                      <div
                       onClick={() => handleAddInspection("Full")}
                        className="it_single"
                      >
                        <span>Full Inspection</span>
                        <img src="/assets/img/inspection1.png" alt="" />
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
           
            <div className="user-single-table table_filter_hide mt-3">
                  <ReactTable tableColumns={columns} tableData={inspections} />
                </div>
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
