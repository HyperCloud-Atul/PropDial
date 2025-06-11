import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectFirestore, projectStorage } from "../../firebase/config"; // Ensure you have projectStorage for image deletion
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { Modal } from "react-bootstrap";

// import component
import ScrollToTop from "../../components/ScrollToTop";
import PropertySummaryCard from "../property/PropertySummaryCard";
import InactiveUserCard from "../../components/InactiveUserCard";

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
                        <img src="/assets/img/inspection3.png" alt="propdial" />
                      </div>
                      <div
                       onClick={() => handleAddInspection("Check-In")}
                        className="it_single"
                      >
                        <span>Move-In Inspection</span>
                        <img src="/assets/img/check-in.png" alt="propdial" />
                      </div>
                      <div
                       onClick={() => handleAddInspection("Check-Out")}
                        className="it_single"
                      >
                        <span>Check-Out Inspection</span>
                        <img src="/assets/img/check-out.png" alt="propdial" />
                      </div>
                      <div
                       onClick={() => handleAddInspection("Full")}
                        className="it_single"
                      >
                        <span>Full Inspection</span>
                        <img src="/assets/img/inspection1.png" alt="propdial" />
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
            <div className="keys_card">
              {inspections &&
                inspections.map((inspection, index) => (
                  <div className="key_card_single relative" key={inspection.id}>
                    {/* <div className="top relative">
                    By <b>
                    {dbUserState &&
                  dbUserState.find(
                    (user) => user.id === doc.createdBy
                  )?.fullName}
                      </b>, On{" "}
                    <b>{format(doc.createdAt.toDate(), "dd-MMM-yy hh:mm a")}</b>
                    {user && user.role === "superAdmin" && (
                      <span
                        className="material-symbols-outlined keys_edit"
                        onClick={() => handleEditClick(doc)}
                      >
                        edit_square
                      </span>
                    )}
                  </div> */}
                    created by
                    <div className="key_details">
                      {inspection.inspections.map((roomInspection, idx) => (
                        <div key={idx}>
                          <p>
                            <strong>Room Name:</strong>{" "}
                            {roomInspection.roomName}
                          </p>
                          <p>
                            <strong>General Condition:</strong>{" "}
                            {roomInspection.general}
                          </p>
                          <p>
                            <strong>Seepage:</strong> {roomInspection.seepage}
                          </p>
                          <p>
                            <strong>Termites:</strong> {roomInspection.termites}
                          </p>
                          <p>
                            <strong>Others:</strong> {roomInspection.others}
                          </p>
                          <div style={{ display: "flex", gap: "10px" }}>
                            {roomInspection.images &&
                              roomInspection.images.map((imgUrl, i) => (
                                <img
                                  key={i}
                                  src={imgUrl}
                                  alt={`Inspection ${idx + 1}`}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "5px",
                                  }}
                                />
                              ))}
                          </div>
                          <button
                            onClick={() =>
                              deleteRoomInspection(inspection.id, idx)
                            }
                            style={{
                              background: "orange",
                              color: "white",
                              marginTop: "10px",
                            }}
                          >
                            Delete This Room Inspection
                          </button>
                        </div>
                      ))}
                    </div>
                    {user && user.role === "superAdmin" && (
                      <>
                        <div
                          onClick={() => deleteEntireDocument(inspection.id)}
                          className="text_red pointer delete_box_top"
                        >
                          <span className="material-symbols-outlined">
                            delete_forever
                          </span>
                        </div>
                        {/* <Modal
                        show={showConfirmModal}
                        onHide={handleConfirmClose}
                        className="delete_modal"
                        centered
                      >
                        <div className="alert_text text-center">Alert</div>

                        <div className="sure_content text-center">
                          Are you sure you want to remove this keys?
                        </div>
                        <div className="yes_no_btn">
                          <div
                            className="theme_btn full_width no_icon text-center btn_border"
                            onClick={confirmDeleteDocument}
                          >
                            Yes
                          </div>
                          <div
                            className="theme_btn full_width no_icon text-center btn_fill"
                            onClick={handleConfirmClose}
                          >
                            No
                          </div>
                        </div>
                      </Modal> */}
                      </>
                    )}
                  </div>
                ))}
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
