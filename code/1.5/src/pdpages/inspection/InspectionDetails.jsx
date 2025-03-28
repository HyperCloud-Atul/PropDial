import React, { useEffect, useState, useRef  } from "react";
import { useParams } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import { useDocument } from "../../hooks/useDocument";
import { useCollection } from "../../hooks/useCollection";
import { ClipLoader } from "react-spinners";
import format from "date-fns/format";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const InspectionDetails = () => {
  const { inspectionid } = useParams(); // Get ID from URL
  const reportRef = useRef(); // Reference for capturing UI
  const [propertyDocument, setPropertyDocument] = useState(null);
  const [billDocument, setBillDocument] = useState([]); // Initialize as an array
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

  useEffect(() => {
    if (!inspectionDoc?.propertyId) return;
  
    const unsubscribe = projectFirestore
      .collection("utilityBills-propdial")
      .where("propertyId", "==", inspectionDoc.propertyId) // Match propertyId
      .onSnapshot(
        (snapshot) => {
          if (!snapshot.empty) {
            const documents = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setBillDocument(documents); // Store all matching documents
          } else {
            console.warn("No bill documents found for this property!");
            setBillDocument([]); // Set as an empty array to handle in UI
          }
        },
        (error) => {
          console.error("Error fetching bill documents:", error);
        }
      );
  
    return () => unsubscribe(); // Unsubscribe to avoid memory leaks
  }, [inspectionDoc]);
  

  console.log("billDocument", billDocument);
  

  // fetch user
  const { documents: dbUsers, error: dbuserserror } = useCollection(
    "users-propdial",
    ["status", "==", "active"]
  );
  const [dbUserState, setdbUserState] = useState(dbUsers);
  useEffect(() => {
    setdbUserState(dbUsers);
  });


    // Function to generate PDF
    const generatePDF = () => {
      const input = reportRef.current;
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("inspection-report.pdf");
      });
    };

  return (
    <div className="pg_property pd_single pg_bg inspection_report">
      <div className="page_spacing relative">
        {propertyDocument && propertyDocument.unitNumber ? (
          inspectionDoc && (
            <div className="report" ref={reportRef}>
                 {/* Generate PDF Button */}
            {/* <div className="pdf-button-container" style={{ marginTop: "20px" }}>
              <button onClick={generatePDF} className="btn btn-primary">
                Download PDF
              </button>
            </div> */}
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
                      <span>
                        #204, 2nd Floor, Vipul Trade Centre, Sector-48
                      </span>
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
                <Link className="dc_single" to={`/propertydetails/${propertyDocument.id}`}>
                  <h2 className="d-flex" style={{
                    justifyContent: "space-between",
                    gap: "10px",
                    alignItems: "center"
                  }}>Property Address 
                  <span className="pid_badge" style={{ fontSize: "13px" }}>
                            PID: {" " + propertyDocument.pid}
                          </span>
                  </h2>
                  {propertyDocument && (
                    <>
                      <h5>
                        {propertyDocument.unitNumber} |{" "}
                        {propertyDocument.society}
                      </h5>
                      <h5>
                      {propertyDocument &&
                            (propertyDocument.category === "Residential" ? (
                              <>
                                {propertyDocument.bhk}{" "}
                                {propertyDocument.furnishing && "|"}{" "}
                                {propertyDocument.furnishing &&
                                  `${propertyDocument.furnishing}`}{" "}
                                {propertyDocument.purpose && " | "}
                                For{" "}
                                {propertyDocument.purpose.toLowerCase() ===
                                "rentsaleboth"
                                  ? "Rent / Sale"
                                  : propertyDocument.purpose}
                              </>
                            ) : propertyDocument.category === "Commercial" ? (
                              <>
                                Your perfect {propertyDocument.propertyType}{" "}
                                awaits—on{" "}
                                {propertyDocument.purpose.toLowerCase() ===
                                "rentsaleboth"
                                  ? "Rent / Lease Now"
                                  : propertyDocument.purpose.toLowerCase() ===
                                    "rent"
                                  ? "Lease Now"
                                  : propertyDocument.purpose.toLowerCase() ===
                                    "sale"
                                  ? "Sale Now"
                                  : ""}
                              </>
                            ) : propertyDocument.category === "Plot" ? (
                              <>
                                {propertyDocument.propertyType} Plot | For{" "}
                                {propertyDocument.purpose.toLowerCase() ===
                                "rentsaleboth"
                                  ? "Rent / Lease"
                                  : propertyDocument.purpose.toLowerCase() ===
                                    "rent"
                                  ? "Lease"
                                  : propertyDocument.purpose.toLowerCase() ===
                                    "sale"
                                  ? "Sale"
                                  : ""}
                              </>
                            ) : null)}
                      </h5>
                      <h5>
                      {propertyDocument.locality}, {propertyDocument.city},{" "}
                      {propertyDocument.state}
                      </h5>
                    </>
                  )}
                </Link>

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
              <div className="vg22"></div>
              <div className="tenant_card ">
                <h2>Tenants</h2>
                <div className="tc_inner all_tenants">
                  <div className="tc_single relative">
                    <Link className="left">
                      <div className="tcs_img_container">
                        <img src="/assets/img/dummy_user.png" alt="Preview" />
                      </div>
                      <div className="tenant_detail">
                        <h6 className="t_name">Rajkumar Singh</h6>
                        <h6 className="t_number">+91 89589-98956</h6>
                        <h6 className="t_number">rajkumarsing@gmail.com</h6>
                      </div>
                    </Link>
                    <div className="wha_call_icon">
                      <Link
                        className="call_icon wc_single"
                        // to={`tel:+${tenant.mobile}`}
                        target="_blank"
                      >
                        <img src="/assets/img/simple_call.png" alt="propdial" />
                      </Link>
                      <Link
                        className="wha_icon wc_single"
                        // to={`https://wa.me/+${tenant.mobile}`}
                        target="_blank"
                      >
                        <img
                          src="/assets/img/whatsapp_simple.png"
                          alt="propdial"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="tc_single relative">
                    <Link className="left">
                      <div className="tcs_img_container">
                        <img src="/assets/img/dummy_user.png" alt="Preview" />
                      </div>
                      <div className="tenant_detail">
                        <h6 className="t_name">Mohan Sharma</h6>
                        <h6 className="t_number">+91 99689-69325</h6>
                        <h6 className="t_number">mohansharma@gmail.com</h6>
                      </div>
                    </Link>
                    <div className="wha_call_icon">
                      <Link
                        className="call_icon wc_single"
                        // to={`tel:+${tenant.mobile}`}
                        target="_blank"
                      >
                        <img src="/assets/img/simple_call.png" alt="propdial" />
                      </Link>
                      <Link
                        className="wha_icon wc_single"
                        // to={`https://wa.me/+${tenant.mobile}`}
                        target="_blank"
                      >
                        <img
                          src="/assets/img/whatsapp_simple.png"
                          alt="propdial"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="tc_single relative">
                    <Link className="left">
                      <div className="tcs_img_container">
                        <img src="/assets/img/dummy_user.png" alt="Preview" />
                      </div>
                      <div className="tenant_detail">
                        <h6 className="t_name">Rajiv Thakur</h6>
                        <h6 className="t_number">+91 69898-98585</h6>
                        <h6 className="t_number">rajkumarsing@gmail.com</h6>
                      </div>
                    </Link>
                    <div className="wha_call_icon">
                      <Link
                        className="call_icon wc_single"
                        // to={`tel:+${tenant.mobile}`}
                        target="_blank"
                      >
                        <img src="/assets/img/simple_call.png" alt="propdial" />
                      </Link>
                      <Link
                        className="wha_icon wc_single"
                        // to={`https://wa.me/+${tenant.mobile}`}
                        target="_blank"
                      >
                        <img
                          src="/assets/img/whatsapp_simple.png"
                          alt="propdial"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="vg22"></div>
              <div className="tenant_card ">
                <h2>Summary</h2>
                <div className="summary">All in Good Condition</div>
              </div>
              <div className="vg22"></div>
              <div className="bill_card">
                <h2>Bill Details</h2>
                <div className="bcard_inner">
                {Object.values(inspectionDoc?.bills || {}).map((billDoc, index) => (
  <div className="bc_single" key={index}>
    <div className="left">
      <h6>{billDoc.billType} | {billDoc.authorityName}</h6>
      
      <div className="d-flex mt-2" style={{
        gap: "5px",
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <div className="pid_badge">
          Bill ID: {billDoc.billId}
        </div>
        {billDoc?.amount && (
        <h5 className="pid_badge">Amount: ₹{billDoc?.amount}</h5>
        )}
      </div>   
      <div style={{
        fontSize: "14px",
        marginTop: "3px",
        color: "var(--light-black)"
      }}>
        Last update at: {format(
                          billDoc.lastUpdatedAt.toDate(),
                          "dd-MMM-yy"
                        )}
                      
      </div>
      <div style={{
        fontSize: "14px",
        marginTop: "3px",
        color: "var(--light-black)"
      }}>
        {/* Last update at: {format(
                          billDoc.lastUpdatedAt.toDate(),
                          "dd-MMM-yy"
                        )} */}
                        Remark: {billDoc.remark}
      </div>         
    </div>    

    
   
  </div>
))}

                <div>
     
    </div>
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
                          <p>
                            {room.seepage === "yes" ? room.seepageRemark : ""}
                          </p>
                          <img src="/assets/img/icons/seepage.png" alt="" />
                        </div>
                        <div className="i_single">
                          <h6>Termites</h6>
                          <h5 className={room.termites.toLowerCase()}>
                            {room.termites}
                          </h5>

                          <p>
                            {room.termites === "yes" ? room.termitesRemark : ""}
                          </p>
                          <img src="/assets/img/icons/termite.png" alt="" />
                        </div>
                        <div className="i_single">
                          <h6>Other Issues</h6>
                          <h5 className={room.otherIssue.toLowerCase()}>
                            {room.otherIssue}
                          </h5>

                          <p>
                            {room.otherIssue === "yes"
                              ? room.otherIssueRemark
                              : ""}
                          </p>
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
