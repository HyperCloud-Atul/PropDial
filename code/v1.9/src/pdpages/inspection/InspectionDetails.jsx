import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import { useDocument } from "../../hooks/useDocument";
import { useCollection } from "../../hooks/useCollection";
import { ClipLoader } from "react-spinners";
import { generateSlug } from "../../utils/generateSlug";
import format from "date-fns/format";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { usePropertyUserRoles } from "../../utils/usePropertyUserRoles";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
import "./Inspection-report.scss";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useSocietyRates } from "../../utils/useSocietyRates";
const InspectionDetails = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { inspectionid } = useParams(); // Get ID from URL
  const reportRef = useRef(); // Reference for capturing UI
  const [propertyDocument, setPropertyDocument] = useState(null);
  const [billDocument, setBillDocument] = useState([]); // Initialize as an array
  const { document: inspectionDoc, error: inspectionDocError } = useDocument(
    "inspections",
    inspectionid
  );

  // get owner and executive detail code start
  const [ownersData, setOwnersData] = useState([]);
  const [coOwnersData, setCoOwnersData] = useState([]);
  const [managersData, setManagersData] = useState([]);
  const [executivesData, setExecutivesData] = useState([]);

  useEffect(() => {
    if (!inspectionDoc?.propertyId) return;

    const unsubscribe = projectFirestore
      .collection("propertyusers")
      .where("propertyId", "==", inspectionDoc.propertyId)
      .onSnapshot(
        async (snapshot) => {
          let ownerIds = [];
          let coOwnerIds = [];
          let managerIds = [];
          let executiveIds = [];

          snapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.userTag === "Owner") ownerIds.push(userData.userId);
            if (userData.userTag === "Co-Owner")
              coOwnerIds.push(userData.userId);
            if (userData.userTag === "Manager")
              managerIds.push(userData.userId);
            if (userData.userTag === "Executive")
              executiveIds.push(userData.userId);
          });

          // ✅ Fetch user details using document IDs
          const fetchUserData = async (userIds) => {
            if (userIds.length === 0) return [];

            const userDataArray = await Promise.all(
              userIds.map(async (id) => {
                const docSnap = await projectFirestore
                  .collection("users-propdial")
                  .doc(id)
                  .get();
                return docSnap.exists
                  ? { id: docSnap.id, ...docSnap.data() }
                  : null;
              })
            );

            return userDataArray.filter((user) => user !== null); // Remove null values
          };

          // 🔥 Fetch all user data
          const ownersData = await fetchUserData(ownerIds);
          const coOwnersData = await fetchUserData(coOwnerIds);
          const managersData = await fetchUserData(managerIds);
          const executivesData = await fetchUserData(executiveIds);

          // ✅ Update states
          setOwnersData(ownersData);
          setCoOwnersData(coOwnersData);
          setManagersData(managersData);
          setExecutivesData(executivesData);
        },
        (error) => {
          console.error("❌ Error fetching property users:", error);
        }
      );

    return () => unsubscribe(); // Cleanup
  }, [inspectionDoc]);

  // get owner and executive detail code end

  // get tenantsData start
  const [tenantsData, setTenantsData] = useState([]);

  useEffect(() => {
    if (!inspectionDoc?.propertyId) return;

    const unsubscribe = projectFirestore
      .collection("tenants")
      .where("propertyId", "==", inspectionDoc.propertyId)
      .where("status", "==", "active") // ✅ Only fetch active tenants
      .onSnapshot(
        (snapshot) => {
          const tenants = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setTenantsData(tenants); // ✅ Store active tenants in state
        },
        (error) => {
          console.error("❌ Error fetching active tenants:", error);
        }
      );

    return () => unsubscribe(); // Cleanup
  }, [inspectionDoc]);
  // get tenantsData end

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

  const handleDownloadPDF = async () => {
    const element = document.getElementById("print-section");

    const canvas = await html2canvas(element, {
      scale: 2, // increase quality
      useCORS: true, // allow cross-origin images (e.g., fonts)
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("page.pdf");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check this out!",
          text: "Take a look at this inspection report:",
          url: window.location.href,
        })
        .then(() => console.log("Thanks for sharing!"))
        .catch((err) => console.error("Share failed:", err));
    } else {
      alert("Share not supported in your browser.");
    }
  };

  const {
    isPropertyOwner,
    propertyUserOwnerData,
    isPropertyManager,
    propertyUserManagerData,
  } = usePropertyUserRoles(propertyDocument?.id, user);

  // code for fetch so ciety rates 
  const { floorPlans, loading, error } = useSocietyRates(propertyDocument?.society);

  return (
    <div className=" pd_single pg_bg inspection_report">
      <div className="page_spacing relative">
        {/* 9 dots html  */}
        {user &&
          (user.role === "admin" ||
            user.role === "superAdmin" ||
            isPropertyManager) && (
            <>
              <div
                onClick={handleShare}
                className="property-list-add-property with_9dot"
              >
                <span className="material-symbols-outlined">share</span>
              </div>
              <div
                onClick={() => navigate(-1)}
                className="property-list-add-property"
              >
                <span class="material-symbols-outlined">arrow_back</span>
              </div>
            </>
          )}

        {/* 9 dots html  */}
        {propertyDocument && propertyDocument.unitNumber ? (
          inspectionDoc && (
            <div className="report" ref={reportRef} id="print-section">
              {/* Generate PDF Button */}
              {/* <div className="pdf-button-container" style={{ marginTop: "20px" }}>
              <button onClick={generatePDF} className="btn btn-primary">
                Download PDF
              </button>
            </div> */}

              {/* <button onClick={handleDownloadPDF}>Download as PDF</button> */}

              <div className="report_header">
                {/* <h1>{inspectionDoc.inspectionType} Inspection Report</h1> */}
                <div className="rh_inner">
                  <div className="inner date i_info">
                    <img src="/assets/img/icons/start-date.png" alt="" />
                    <div className="right">
                      <h6>Date & Time</h6>
                      <h5>
                        {format(
                          inspectionDoc.lastUpdatedAt.toDate(),
                          "dd-MMM-yy, hh:mm a"
                        )}
                      </h5>
                    </div>
                  </div>
                  <div className="inner logo">
                    <img src="/assets/img/logo_propdial.png" alt="" />
                    {/* <div className="company_address">
                      <span>
                        #204, 2nd Floor, Vipul Trade Centre, Sector-48
                      </span>
                      <span>Sohna Road, Gurugram-122018, Haryana</span>
                      <span>
                        propdial.com&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;info@prodial.com
                      </span>
                    </div> */}
                    <h1>{inspectionDoc.inspectionType} Inspection Report</h1>
                   


                  </div>
                  <div
                    className="inner createdBy i_info"
                    style={
                      {
                        // justifyContent: "end",
                      }
                    }
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
                <Link
                  className="dc_single"
                  // to={`/propertydetails/${propertyDocument.id}`}
                  to={`/propertydetails/${generateSlug(propertyDocument)}`}
                >
                  <h2
                    className="d-flex"
                    style={{
                      justifyContent: "space-between",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    Property Address
                    <span className="pid_badge" style={{ fontSize: "13px" }}>
                      PID: {" " + propertyDocument.pid}
                    </span>
                    <span className="pid_badge" style={{ fontSize: "13px" }}>
                      For{" "}
                      {propertyDocument.purpose.toLowerCase() === "rentsaleboth"
                        ? "Rent / Sale"
                        : propertyDocument.purpose}
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
                {ownersData?.length > 0 && (
                  <div className="dc_single">
                    <h2>Property Owner</h2>
                    <h5>{ownersData[0].fullName}</h5>
                    <h6>
                      {ownersData[0].phoneNumber.replace(
                        /(\d{2})(\d{5})(\d{5})/,
                        "+$1 $2-$3"
                      )}
                    </h6>
                    <h6>{ownersData[0].email}</h6>
                  </div>
                )}

                {executivesData?.length > 0 && (
                  <div className="dc_single">
                    <h2>Executive</h2>
                    <h5>{executivesData[0].fullName}</h5>
                    <h6>
                      {executivesData[0].phoneNumber.replace(
                        /(\d{2})(\d{5})(\d{5})/,
                        "+$1 $2-$3"
                      )}
                    </h6>
                    <h6>{executivesData[0].email}</h6>
                  </div>
                )}
              </div>
              {tenantsData.length > 0 && (
                <>
                  <div className="vg22"></div>
                  <div className="tenant_card">
                    <h2>Tenants</h2>
                    <div className="tc_inner all_tenants">
                      {tenantsData?.map((tenant) => (
                        <div className="tc_single relative" key={tenant.id}>
                          <Link
                            className="left"
                            to={`/tenantdetails/${tenant.id}`}
                          >
                            <div className="tcs_img_container">
                              <img
                                src={
                                  tenant.tenantImgUrl ||
                                  "/assets/img/dummy_user.png"
                                }
                                alt="Tenant"
                              />
                            </div>
                            <div className="tenant_detail">
                              <h6 className="t_name">
                                {tenant?.name || "Tenant name"}
                              </h6>
                              <h6 className="t_number">
                                {tenant?.mobile?.replace(
                                  /(\d{2})(\d{5})(\d{5})/,
                                  "+$1 $2-$3"
                                ) || "Tenant phone"}
                              </h6>
                              <h6 className="t_number">
                                {tenant.emailID || ""}
                              </h6>
                            </div>
                          </Link>
                          {tenant.mobile && (
                            <div className="wha_call_icon">
                              <Link
                                className="call_icon wc_single"
                                to={`tel:${tenant.mobile}`}
                                target="_blank"
                              >
                                <img
                                  src="/assets/img/simple_call.png"
                                  alt="Call Tenant"
                                />
                              </Link>
                              <Link
                                className="wha_icon wc_single"
                                to={`https://wa.me/${tenant.mobile}`}
                                target="_blank"
                              >
                                <img
                                  src="/assets/img/whatsapp_simple.png"
                                  alt="WhatsApp Tenant"
                                />
                              </Link>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {/* <div className="vg22"></div>
              <div className="tenant_card ">
                <h2>Summary</h2>
                <div className="summary">All in Good Condition</div>
              </div> */}
              <div className="vg22"></div>
              <div className="bill_card">
                <h2>Bill Details</h2>
                <div className="bcard_inner">
                  {Object.values(inspectionDoc?.bills || {}).map(
                    (billDoc, index) => (
                      <div className="bc_single" key={index}>
                        <div className="left">
                          <h6>
                            {billDoc.billType} | {billDoc.authorityName}
                          </h6>
                          {billDoc.thisBillUpdatedAt && (
                            <div
                              style={{
                                fontSize: "14px",
                                marginTop: "3px",
                                color: "var(--light-black)",
                              }}
                            >
                              <span>Last update at:{" "}
                                {format(
                                  billDoc.thisBillUpdatedAt.toDate(),
                                  "dd-MMM-yyyy"
                                )}</span>
                            </div>
                          )}

                          <div
                            className="d-flex mt-2"
                            style={{
                              gap: "5px",
                              flexWrap: "wrap",
                              alignItems: "center",
                            }}
                          >
                            <div
                              className="pid_badge"
                              style={{
                                fontSize: "13px",
                                color: "var(--light-black)",
                                background: "#eeeeee",
                              }}
                            >
                              Bill ID: {billDoc.billId}
                            </div>
                            {billDoc?.amount && (
                              <h5
                                className="pid_badge"
                                style={{
                                  fontSize: "13px",
                                  color: "var(--light-black)",
                                  background: "#eeeeee",
                                }}
                              >
                                Due Amount: ₹{billDoc?.amount}
                              </h5>
                            )}
                          </div>
                          {billDoc.billWebsiteLink && (
                            <div
                              className="d-flex mt-2"
                              style={{
                                gap: "5px",
                                flexWrap: "wrap",
                                alignItems: "center",
                              }}
                            >
                              <div
                                className="pid_badge"
                                style={{
                                  fontSize: "13px",
                                  color: "var(--theme-green)",
                                  background: "#eeeeee",
                                }}
                              >
                                <Link
                                  to={billDoc.billWebsiteLink}
                                  style={{
                                    fontSize: "13px",
                                    color: "var(--theme-green)",
                                  }}
                                >
                                  <span>Bill Website Link 👈</span>
                                </Link>
                              </div>
                            </div>
                          )}

                          <div
                            style={{
                              fontSize: "13px",
                              marginTop: "10px",
                              color: "var(--light-black)",
                            }}
                          >
                            {/* Last update at: {format(
                          billDoc.lastUpdatedAt.toDate(),
                          "dd-MMM-yy"
                        )} */}
                            {billDoc.remark}
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  <div></div>
                </div>
              </div>
              <div className="room_wise_inspection">
                {inspectionDoc?.rooms?.map((room, idx) => (
                  <div className="rwi_single" key={idx}>
                    <h2>
                      {room.roomName}
                      {room.isAllowForInspection === "no" && (
                        <h3>Not allowed by tenant for inspection</h3>
                      )}
                    </h2>

                    <div className="issues">
                      {room.isAllowForInspection === "yes" && (
                        <div className="top">
                          <div className="i_single">
                            <h6>Seepage</h6>
                            <h5 className={room?.seepage?.toLowerCase()}>
                              {room.seepage}
                            </h5>
                            <p>
                              {room.seepage === "yes" ? room.seepageRemark : ""}
                            </p>
                            <img src="/assets/img/icons/seepage.png" alt="" />
                          </div>
                          <div className="i_single">
                            <h6>Termites</h6>
                            <h5 className={room?.termites?.toLowerCase()}>
                              {room.termites}
                            </h5>

                            <p>
                              {room.termites === "yes"
                                ? room.termitesRemark
                                : ""}
                            </p>
                            <img src="/assets/img/icons/termite.png" alt="" />
                          </div>
                          <div className="i_single">
                            <h6>Other Issues</h6>
                            <h5 className={room?.otherIssue?.toLowerCase()}>
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
                            <h6>Cleaning Remark</h6>
                            <p>{room.cleanRemark}</p>
                            <img
                              src="/assets/img/icons/testimonial.png"
                              alt=""
                            />
                          </div>
                        </div>
                      )}

                      {room.generalRemark && (
                        <div className="bottom">
                          <h6>General Remark</h6>
                          <p>{room.generalRemark}</p>
                        </div>
                      )}
                    </div>
                    {room.isAllowForInspection === "yes" && (
                      <div className="images_area">
                        <h6>Captured Images</h6>
                        <div className="img_bunch">
                          {room.images &&
                            room.images.map((img, i) => (
                              <img src={img.url} alt="" />
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="rwi_single socity-rate">
                  <h2>Current Market Rate in your Society</h2>
                  <div className="cards">
                    {floorPlans.map((plan, index) => {
                    // Logic for area display
                    const hasSuperArea = plan.superArea && plan.arealInit;
                    const hasCarpetArea = plan.carpetArea && plan.arealInit;

                    return (
                      <div key={index} className="socity-rate-card">
                        {/* Header */}
                        <div className="card-header">
                          <h3>{plan.bhk}</h3>
                        </div>

                        {/* Body */}
                        <div className="card-body">
                          {/* Area display */}
                          {plan.superArea && plan.carpetArea ? (
                            <>
                              <p className="area">
                                Super Area: <span className="area-val">{plan.superArea} {plan.areaUnit} {plan.arealInit || ""}</span>
                              </p>
                              <p className="area">
                                Carpet Area: <span className="area-val">{plan.carpetArea} {plan.areaUnit} {plan.arealInit || ""}</span>
                              </p>
                            </>
                          ) : plan.superArea ? (
                            <p className="area">
                              Area: <span className="area-val">{plan.superArea} {plan.areaUnit} {plan.arealInit || ""}</span>
                            </p>
                          ) : plan.carpetArea ? (
                            <p className="area">
                              Area: <span className="area-val">{plan.carpetArea} {plan.areaUnit} {plan.arealInit || ""}</span>
                            </p>
                          ) : null}


                          {/* Rent */}
                          <div className="price-row">
                            <span className="label">Rent Price:</span>
                            <span className="rent">{plan.rentPrice? `₹${plan.rentPrice} `: NaN }</span>
                          </div>

                          {/* Sale */}
                          <div className="price-row">
                            <span className="label">Sale Price:</span>
                            <span className="sale">{plan.salePrice? `₹${plan.salePrice}` : NaN}</span>
                          </div>
                          <div className="updatedAt-wrapper">
                            <div className="updatedAt-container">
                              <span className="label">Last updated at{" "}</span> 
                              <span className="updatedAt"> {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString("en-GB") : new Date(plan.updatedAt).toLocaleDateString("en-GB")}</span> 
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
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
