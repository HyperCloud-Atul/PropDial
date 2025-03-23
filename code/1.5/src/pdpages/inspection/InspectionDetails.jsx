import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import { useDocument } from "../../hooks/useDocument";
import { useCollection } from "../../hooks/useCollection";
import { ClipLoader } from "react-spinners";
import format from "date-fns/format";
const InspectionDetails = () => {
  const { inspectionid } = useParams(); // Get ID from URL
  const [propertyDocument, setPropertyDocument] = useState(null);

  const { document: inspectionDoc, error: inspectionDocError } = useDocument(
    "inspections",
    inspectionid
  );
  
  useEffect(() => {
    if (!inspectionDoc?.propertyId) return;
  
    const unsubscribe = projectFirestore
      .collection("properties-propdial")
      .doc(inspectionDoc.propertyId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            setPropertyDocument({ id: doc.id, ...doc.data() });
          } else {
            console.error("❌ Property document not found!");
            setPropertyDocument(null);
          }
          
        },
        (error) => {
          console.error("❌ Error fetching property:", error);
          
        }
      );
  
    return () => unsubscribe(); // Unsubscribe to avoid memory leaks
  }, [inspectionDoc]); 


  // fetch user
  const { documents: dbUsers, error: dbuserserror } = useCollection(
    "users-propdial",
    ["status", "==", "active"]
  );
  const [dbUserState, setdbUserState] = useState(dbUsers);
  useEffect(() => {
    setdbUserState(dbUsers);
  });

  return (
    <div className="pg_property pd_single pg_bg inspection_report">
      <div className="page_spacing relative">
        {propertyDocument && propertyDocument.unitNumber ? (
            inspectionDoc && (
              <div className="report">
                <div className="report_header">
                  <h1>{inspectionDoc.inspectionType} Inspection Report</h1>
                  <div className="rh_inner">
                    <div className="date i_info">
                      <img src="/assets/img/icons/start-date.png" alt="" />
                      <div className="right">
                        <h6>Date & Time</h6>
                        <h5>
                          {format(
                            inspectionDoc.createdAt.toDate(),
                            "dd-MMM-yy, hh:mm a"
                          )}
                        </h5>
                      </div>
                    </div>
                    <div className="logo">
                      <img src="/assets/img/logo_propdial.png" alt="" />
                      <div className="company_address">
                        <span>#204, 2nd Floor, Vipul Trade Centre, Sector-48</span>
                        <span>Sohna Road, Gurugram-122018, Haryana</span>
                        <span>
                          propdial.com&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;info@prodial.com
                        </span>
                      </div>
                    </div>
                    <div
                      className="createdBy i_info"
                      style={{
                        justifyContent: "end",
                      }}
                    >
                      <img src="/assets/img/icons/add-user.png" alt="" />
                      <div className="right">
                        <h6>Inspection By</h6>
                        <h5>
                          {" "}
                          {dbUserState &&
                            dbUserState.find(
                              (user) => user.id === inspectionDoc.createdBy
                            )?.fullName}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="vg22"></div>
                <div className="detail_card">
                  <div className="dc_single">
                    <h2>Property Address</h2>
                    {propertyDocument && (
                    <>
                      <h5>{propertyDocument.unitNumber} | {propertyDocument.society}</h5>
                      <h5>{propertyDocument.locality} | {propertyDocument.city}</h5>
                      <h5>{propertyDocument.state} | {propertyDocument.country}</h5>
                    </>
                    )}
                    
                   
                  </div>
           
                  <div className="dc_single">
                    <h2>Property Owner</h2>
                    <h5>Ravi Sharma</h5>
                    <h6>+91 89589-98956</h6>
                    <h6>ravisharma125@gmail.com</h6>
                  </div>
                  <div className="dc_single">
                    <h2>Executive</h2>
                    <h5>Sankar Solanki</h5>
                    <h6>+91 87705-34650</h6>
                    <h6>solankisanskar88@gmail.com</h6>
                  </div>
                </div>
                <div className="room_wise_inspection">
                  {inspectionDoc?.rooms?.map((room, idx) => (
                    <div className="rwi_single" key={idx}>
                      <h2>{room.roomName}</h2>
                      <div className="issues">
                        <div className="top">
                          <div className="i_single">
                            <h6>Seepage</h6>
                            <h5 className={room.seepage.toLowerCase()}>
                              {room.seepage}
                            </h5>
                            <p>{room.seepage === "yes" ? room.seepageRemark : ""}</p>
                            <img src="/assets/img/icons/seepage.png" alt="" />
                          </div>
                          <div className="i_single">
                            <h6>Termites</h6>
                            <h5 className={room.termites.toLowerCase()}>
                              {room.termites}
                            </h5>
                           
                            <p>{room.termites === "yes" ? room.termitesRemark : ""}</p>
                            <img src="/assets/img/icons/termite.png" alt="" />
                          </div>
                          <div className="i_single">
                            <h6>Other Issues</h6>
                            <h5 className={room.otherIssue.toLowerCase()}>
                              {room.otherIssue}
                            </h5>
                           
                            <p>{room.otherIssue === "yes" ? room.otherIssueRemark : ""}</p>
                            <img
                              src="/assets/img/icons/problem-solving.png"
                              alt=""
                            />
                          </div>
                          <div className="i_single">
                            <h6>General Remark</h6>
                            <p>{room.generalRemark}</p>
                            <img src="/assets/img/icons/testimonial.png" alt="" />
                          </div>
                        </div>
                        {/* <div className="bottom">
    <h6>General Remark</h6>
    <p>Genral remark area</p>
    </div> */}
                      </div>
                      <div className="images_area">
                        <h6>Captured Images</h6>
                        <div className="img_bunch">
                          {room.images &&
                            room.images.map((img, i) => (
                              <img src={img.url} alt="" />
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        ) : (
          <div className="page_loader">
                  <ClipLoader color="var(--theme-green2)" loading={true} />
                </div>
        )}
      

      
      </div>
    </div>
  );
};

export default InspectionDetails;
