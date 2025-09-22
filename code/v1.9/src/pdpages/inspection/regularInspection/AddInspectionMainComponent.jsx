// Updated AddInspection.js (Main Component)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Modal from "react-modal";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { projectFirestore, timestamp, projectStorage } from "../../../firebase/config";
import firebase from 'firebase/compat/app';
import { useDocument } from "../../../hooks/useDocument";
import { ClipLoader } from "react-spinners";
import ScrollToTop from "../../../components/ScrollToTop";
import PropertySummaryCard from "../../property/PropertySummaryCard";
import BillInspection from "./BillInspection";
import LayoutInspection from "./LayoutInspection";

const AddInspection = () => {
  const { inspectionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [propertyId, setPropertyId] = useState(null);
  const [isDataSaving, setIsDataSaving] = useState(false);
  const [show, setShow] = useState(false);
  const [finalSubmit, setFinalSubmit] = useState(false);
  const [finalSubmiting, setFinalSubmiting] = useState(false);
  const [afterSaveModal, setAfterSaveModal] = useState(false);
  const [propertydoc, setPropertyDoc] = useState(null);
  const [propertyerror, setPropertyError] = useState(null);
  const [inspectionType, setInspectionType] = useState("");
  const [activeInspection, setActiveInspection] = useState("layout");
  const [inspectionDatabaseData, setInspectionDatabaseData] = useState(null);
  const [bills, setBills] = useState([]);
  const [billInspectionData, setBillInspectionData] = useState({});
  const [allBillInspectionComplete, setAllBillInspectionComplete] = useState(false);

  const { document: inspectionDocument, error: inspectionDocumentError } =
    useDocument("inspections", inspectionId);

  // Fetch property data
  useEffect(() => {
    if (!propertyId) return;
    const unsubscribe = projectFirestore
      .collection("properties-propdial")
      .doc(propertyId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            setPropertyDoc({ id: doc.id, ...doc.data() });
          } else {
            setPropertyDoc(null);
            setPropertyError("Property not found.");
          }
        },
        (error) => {
          console.error("Error fetching property:", error);
          setPropertyError(error.message);
        }
      );

    return () => unsubscribe();
  }, [propertyId]);

  // Fetch inspection data
  useEffect(() => {
    if (!inspectionId) return;
    const unsubscribe = projectFirestore
      .collection("inspections")
      .doc(inspectionId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const inspectionData = doc.data();
            setPropertyId(inspectionData.propertyId);
            setInspectionType(inspectionData.inspectionType || "Not Available");
            if (inspectionData.rooms) {
              const formattedRooms = {};
              inspectionData.rooms.forEach((room) => {
                formattedRooms[room.roomId] = room;
              });
              // setInspectionData(formattedRooms); // This is now handled in LayoutInspection
            }
            if (inspectionData.bills) {
              setBillInspectionData(inspectionData.bills);
            }
          } else {
            console.error("Inspection not found!");
          }
        },
        (error) => {
          console.error("Error fetching inspection:", error);
        }
      );

    return () => unsubscribe();
  }, [inspectionId]);

  // Fetch bills data
  useEffect(() => {
    if (!propertyId || !inspectionId) return;
    const fetchBills = async () => {
      try {
        const billsSnapshot = await projectFirestore
          .collection("utilityBills-propdial")
          .where("propertyId", "==", propertyId)
          .get();

        const billsData = billsSnapshot.docs.map((doc) => ({
          id: doc.id,
          billDocId: doc.id,
          billType: doc.data().billType,
          billId: doc.data().billId,
          authorityName: doc.data().authorityName,
          billWebsiteLink: doc.data().billWebsiteLink,
        }));

        setBills(billsData);
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };

    fetchBills();
  }, [propertyId, inspectionId]);

  // Initialize inspection components
  const layoutInspection = LayoutInspection({ propertyId, inspectionId, user });
  const billInspection = BillInspection({
    propertyId,
    inspectionId,
    user,
    bills,
    billInspectionData,
    setBillInspectionData,
    allBillInspectionComplete,
    setAllBillInspectionComplete
  });

  // Check if final submit is enabled
  const isFinalSubmitEnabled = () => {
    return (
      allBillInspectionComplete &&
      Object.values(layoutInspection.inspectionData).every((room) => {
        if (room.isAllowForInspection === "no") {
          return room.generalRemark;
        }
        return (
          room.seepage &&
          room.termites &&
          room.otherIssue &&
          room.seepageRemark &&
          room.termitesRemark &&
          room.otherIssueRemark &&
          room.cleanRemark &&
          room.images?.length > 0
        );
      })
    );
  };

  // Handle final submission
  const handleFinalSubmit = async () => {
    setFinalSubmiting(true);
    
    // Save both inspections
    const billSaved = await billInspection.handleSaveBill();
    const layoutSaved = await layoutInspection.saveLayoutInspection();
    
    if (billSaved && layoutSaved) {
      try {
        await projectFirestore
          .collection("inspections")
          .doc(inspectionId)
          .update({
            finalSubmit: true,
            updatedAt: timestamp.now(),
            updatedInformation: firebase.firestore.FieldValue.arrayUnion({
              updatedAt: timestamp.now(),
              updatedBy: user.phoneNumber,
            }),
          });
        navigate(`/inspection-report/${inspectionId}`);
      } catch (error) {
        console.error("Error in final submit:", error);
      }
    }
    
    setFinalSubmiting(false);
    setFinalSubmit(false);
  };

  // Redirect if already submitted
  useEffect(() => {
    if (inspectionDocument?.finalSubmit) {
      navigate(`/inspection/${propertyId}`);
    }
  }, [inspectionDocument?.finalSubmit, navigate]);

  // Fetch realtime inspection data
  useEffect(() => {
    if (!inspectionId) return;
    const timeoutId = setTimeout(() => {
      const unsubscribe = projectFirestore
        .collection("inspections")
        .doc(inspectionId)
        .onSnapshot(
          (doc) => {
            if (doc.exists) {
              setInspectionDatabaseData(doc.data());
            } else {
              console.warn("Inspection document not found.");
            }
          },
          (error) => {
            console.error("Error fetching real-time inspection data:", error);
          }
        );

      return () => unsubscribe();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [inspectionId]);

  // Render functions for layout and bill inspections
  const renderLayoutInspection = () => (
    <>
      <div className="room-buttons">
        {layoutInspection.rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => layoutInspection.setActiveRoom(room.id)}
            className={layoutInspection.getRoomClass(room.id)}
          >
            {/* Room button content */}
          </button>
        ))}
      </div>
      
      {layoutInspection.activeRoom && (
        <div>
          <form className="add_inspection_form">
            {/* Form fields for layout inspection */}
          </form>
        </div>
      )}
    </>
  );

  const renderBillInspection = () => (
    <div className="bill_inspection">
      <div className="room-buttons">
        {billInspection.bills.map((bill) => (
          <button
            key={bill.id}
            onClick={() => billInspection.handleBillTypeClick(bill)}
            className={billInspection.getBillButtonClass(bill)}
          >
            {/* Bill button content */}
          </button>
        ))}
      </div>
      
      {billInspection.selectedBill && (
        <div className="bill_fields">
          {/* Bill form fields */}
        </div>
      )}
    </div>
  );

  return (
    <div className="pg_min_height">
      <ScrollToTop />
      <div className="top_header_pg pg_bg add_inspection_pg">
        <div className="page_spacing pg_min_height">
          {propertyId ? (
            <>
              <div className="row row_reverse_991">
                <div className="col-lg-6">
                  <div className="title_card with_title mobile_full_575 mobile_gap h-100">
                    <h2 className="text-center">{inspectionType} Inspection</h2>
                    <div className="inspection_type_buttons">
                      <button
                        onClick={() => setActiveInspection("layout")}
                        className={`${activeInspection === "layout" ? "active " : ""}${layoutInspection.layoutInspectionDone ? "done" : ""}`}
                      >
                        Layout Inspection
                        <img src="/assets/img/icons/check-mark.png" alt="" />
                      </button>

                      <button
                        onClick={() => setActiveInspection("bill")}
                        className={`${activeInspection === "bill" ? "active " : ""}${allBillInspectionComplete ? "done" : ""}`}
                      >
                        Bill Inspection
                        <img src="/assets/img/icons/check-mark.png" alt="" />
                      </button>
                    </div>
                  </div>
                </div>
                <PropertySummaryCard
                  propertydoc={propertydoc}
                  propertyId={propertyId}
                />
              </div>
              
              {activeInspection === "layout" && renderLayoutInspection()}
              {activeInspection === "bill" && renderBillInspection()}
              
              {/* Bottom buttons and modals */}
            </>
          ) : (
            <div className="page_loader">
              <ClipLoader color="var(--theme-green2)" loading={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddInspection;