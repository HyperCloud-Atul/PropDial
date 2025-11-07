import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { BarLoader } from "react-spinners";
import { projectFirestore } from "../../../../firebase/config";
import jsPDF from "jspdf";

const DownloadReportModal = ({
  showDownloadModal,
  setShowDownloadModal,
  selectedInspection,
  dbUserState
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [ownersData, setOwnersData] = useState([]);
  const [executivesData, setExecutivesData] = useState([]);
  const [tenantsData, setTenantsData] = useState([]);

  // Fetch property details
  useEffect(() => {
    if (!selectedInspection?.propertyId) return;

    const fetchPropertyDetails = async () => {
      try {
        const docSnap = await projectFirestore
          .collection("properties-propdial")
          .doc(selectedInspection.propertyId)
          .get();
        
        if (docSnap.exists) {
          setPropertyDetails({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    fetchPropertyDetails();
  }, [selectedInspection]);

  // Fetch owners and executives
  useEffect(() => {
    if (!selectedInspection?.propertyId) return;

    const unsubscribe = projectFirestore
      .collection("propertyusers")
      .where("propertyId", "==", selectedInspection.propertyId)
      .onSnapshot(
        async (snapshot) => {
          let ownerIds = [];
          let executiveIds = [];

          snapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.userTag === "Owner") ownerIds.push(userData.userId);
            if (userData.userTag === "Executive") executiveIds.push(userData.userId);
          });

          const fetchUserData = async (userIds) => {
            if (userIds.length === 0) return [];
            const userDataArray = await Promise.all(
              userIds.map(async (id) => {
                const docSnap = await projectFirestore
                  .collection("users-propdial")
                  .doc(id)
                  .get();
                return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
              })
            );
            return userDataArray.filter((user) => user !== null);
          };

          const ownersData = await fetchUserData(ownerIds);
          const executivesData = await fetchUserData(executiveIds);

          setOwnersData(ownersData);
          setExecutivesData(executivesData);
        },
        (error) => {
          console.error("Error fetching property users:", error);
        }
      );

    return () => unsubscribe();
  }, [selectedInspection]);

  // Fetch tenants data
  useEffect(() => {
    if (!selectedInspection?.propertyId) return;

    const unsubscribe = projectFirestore
      .collection("tenants")
      .where("propertyId", "==", selectedInspection.propertyId)
      .where("status", "==", "active")
      .onSnapshot(
        (snapshot) => {
          const tenants = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTenantsData(tenants);
        },
        (error) => {
          console.error("Error fetching tenants:", error);
        }
      );

    return () => unsubscribe();
  }, [selectedInspection]);

  // Image loading function
  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        try {
          const dataURL = canvas.toDataURL('image/jpeg', 0.8);
          resolve({ dataURL, width: img.width, height: img.height });
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      const timestamp = new Date().getTime();
      const finalUrl = url.includes('?') ? `${url}&t=${timestamp}` : `${url}?t=${timestamp}`;
      img.src = finalUrl;
    });
  };

  // Clean fixture name
  const cleanFixtureName = (name) => {
    if (!name) return '';
    return name.replace(/^%%/g, '').trim();
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (date.toDate) {
      return date.toDate().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Generate PDF based on inspection type
  // const generatePDFReport = async () => {
  //   if (!selectedInspection) return;
  //   setIsGenerating(true);

  //   try {
  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const pageHeight = pdf.internal.pageSize.getHeight();
  //     let yPosition = 15;

  //     // Header Section
  //     pdf.setFillColor(0, 102, 204);
  //     pdf.roundedRect(10, 10, pageWidth - 20, 25, 5, 5, 'F');
      
  //     pdf.setFontSize(22);
  //     pdf.setTextColor(255, 255, 255);
  //     pdf.text(`${selectedInspection.inspectionType.toUpperCase()} INSPECTION REPORT`, pageWidth / 2, 25, { align: 'center' });
      
  //     pdf.setFontSize(12);
  //     pdf.setTextColor(255, 255, 255);
  //     pdf.text('PropDial - Professional Property Inspection', pageWidth / 2, 32, { align: 'center' });

  //     yPosition = 45;

  //     // Property Information Section
  //     pdf.setFillColor(248, 250, 252);
  //     pdf.setDrawColor(0, 102, 204);
  //     pdf.roundedRect(10, yPosition, pageWidth - 20, 35, 5, 5, 'FD');

  //     pdf.setFontSize(16);
  //     pdf.setTextColor(0, 102, 204);
  //     pdf.text('📋 PROPERTY INFORMATION', 15, yPosition + 10);

  //     pdf.setFontSize(11);
  //     pdf.setTextColor(0, 0, 0);

  //     // Property details
  //     if (propertyDetails) {
  //       pdf.text(`• Address: ${propertyDetails.unitNumber || ''} | ${propertyDetails.society || ''}`, 15, yPosition + 18);
  //       pdf.text(`• Locality: ${propertyDetails.locality || ''}, ${propertyDetails.city || ''}`, 15, yPosition + 25);
  //       pdf.text(`• PID: ${propertyDetails.pid || selectedInspection.propertyId}`, 100, yPosition + 18);
  //       pdf.text(`• Purpose: ${propertyDetails.purpose || 'N/A'}`, 100, yPosition + 25);
  //     }

  //     yPosition += 45;

  //     // Inspection Details Section
  //     pdf.setFillColor(240, 245, 255);
  //     pdf.setDrawColor(100, 100, 255);
  //     pdf.roundedRect(10, yPosition, pageWidth - 20, 25, 5, 5, 'FD');

  //     pdf.setFontSize(14);
  //     pdf.setTextColor(0, 0, 128);
  //     pdf.text('📅 INSPECTION DETAILS', 15, yPosition + 10);

  //     pdf.setFontSize(10);
  //     pdf.setTextColor(0, 0, 0);

  //     const inspectionDate = formatDate(selectedInspection.createdAt);
  //     const inspectorName = dbUserState?.find(user => user.id === selectedInspection.createdBy)?.fullName || selectedInspection.createdBy;

  //     pdf.text(`• Date: ${inspectionDate}`, 15, yPosition + 18);
  //     pdf.text(`• Inspector: ${inspectorName}`, 100, yPosition + 18);

  //     yPosition += 35;

  //     // Stakeholders Section
  //     if (ownersData.length > 0 || executivesData.length > 0) {
  //       pdf.setFillColor(255, 248, 225);
  //       pdf.setDrawColor(255, 193, 7);
  //       pdf.roundedRect(10, yPosition, pageWidth - 20, 25, 5, 5, 'FD');

  //       pdf.setFontSize(14);
  //       pdf.setTextColor(255, 149, 0);
  //       pdf.text('👥 STAKEHOLDERS', 15, yPosition + 10);

  //       pdf.setFontSize(10);
  //       pdf.setTextColor(0, 0, 0);

  //       if (ownersData.length > 0) {
  //         pdf.text(`• Owner: ${ownersData[0]?.fullName || ownersData[0]?.email}`, 15, yPosition + 18);
  //       }
  //       if (executivesData.length > 0) {
  //         pdf.text(`• Executive: ${executivesData[0]?.fullName || executivesData[0]?.email}`, 100, yPosition + 18);
  //       }

  //       yPosition += 35;
  //     }

  //     // Tenants Section (if any)
  //     if (tenantsData.length > 0) {
  //       pdf.setFillColor(230, 255, 230);
  //       pdf.setDrawColor(0, 150, 0);
  //       pdf.roundedRect(10, yPosition, pageWidth - 20, 20, 5, 5, 'FD');

  //       pdf.setFontSize(14);
  //       pdf.setTextColor(0, 100, 0);
  //       pdf.text('👤 TENANTS', 15, yPosition + 10);

  //       pdf.setFontSize(10);
  //       pdf.setTextColor(0, 0, 0);
  //       pdf.text(`• Active Tenants: ${tenantsData.length}`, 15, yPosition + 18);

  //       yPosition += 30;
  //     }

  //     // Bill Details Section
  //     if (selectedInspection.bills && Object.keys(selectedInspection.bills).length > 0) {
  //       if (yPosition > pageHeight - 50) {
  //         pdf.addPage();
  //         yPosition = 20;
  //       }

  //       pdf.setFontSize(16);
  //       pdf.setTextColor(0, 102, 204);
  //       pdf.text('💰 BILL DETAILS', 15, yPosition);
  //       yPosition += 8;

  //       Object.values(selectedInspection.bills).forEach((bill, index) => {
  //         if (yPosition > pageHeight - 30) {
  //           pdf.addPage();
  //           yPosition = 20;
  //         }

  //         pdf.setFillColor(245, 255, 245);
  //         pdf.setDrawColor(0, 150, 0);
  //         pdf.roundedRect(15, yPosition, pageWidth - 30, 20, 3, 3, 'FD');

  //         pdf.setFontSize(11);
  //         pdf.setTextColor(0, 100, 0);
  //         pdf.text(`📄 ${bill.billType} | ${bill.authorityName || ''}`, 20, yPosition + 8);

  //         if (bill.amount) {
  //           pdf.setFontSize(10);
  //           pdf.setTextColor(0, 0, 0);
  //           pdf.text(`Amount: ₹${bill.amount}`, 20, yPosition + 15);
  //         }

  //         yPosition += 23;
  //       });
  //       yPosition += 10;
  //     }

  //     // Rooms Inspection Section - Different based on inspection type
  //     if (selectedInspection.rooms && selectedInspection.rooms.length > 0) {
  //       if (yPosition > pageHeight - 40) {
  //         pdf.addPage();
  //         yPosition = 20;
  //       }

  //       pdf.setFontSize(16);
  //       pdf.setTextColor(0, 102, 204);
  //       pdf.text('🏠 ROOMS INSPECTION', 15, yPosition);
  //       yPosition += 10;

  //       for (const [roomIndex, room] of selectedInspection.rooms.entries()) {
  //         if (yPosition > pageHeight - 60) {
  //           pdf.addPage();
  //           yPosition = 20;
  //         }

  //         // Room Header
  //         pdf.setFillColor(240, 245, 255);
  //         pdf.setDrawColor(0, 102, 204);
  //         pdf.roundedRect(15, yPosition, pageWidth - 30, 12, 3, 3, 'FD');

  //         pdf.setFontSize(12);
  //         pdf.setTextColor(0, 0, 128);
  //         pdf.text(`📍 ${room.roomName}`, 20, yPosition + 8);
  //         yPosition += 15;

  //         // Tenant Permission Status
  //         if (room.isAllowForInspection === "no") {
  //           pdf.setFontSize(10);
  //           pdf.setTextColor(200, 0, 0);
  //           pdf.text('🚫 Not allowed by tenant for inspection', 20, yPosition);
  //           yPosition += 6;
  //         }

  //         // Different content based on inspection type
  //         if (selectedInspection.inspectionType.toLowerCase() === "full") {
  //           // FULL INSPECTION - Show fixtures in table format
  //           if (room.isAllowForInspection === "yes" && room.fixtures && Object.keys(room.fixtures).length > 0) {
  //             pdf.setFontSize(11);
  //             pdf.setTextColor(0, 102, 204);
  //             pdf.text('🔧 FIXTURES & COMPONENTS', 20, yPosition);
  //             yPosition += 8;

  //             for (const [fixtureName, fixtureData] of Object.entries(room.fixtures)) {
  //               if (yPosition > pageHeight - 30) {
  //                 pdf.addPage();
  //                 yPosition = 20;
  //               }

  //               const cleanName = cleanFixtureName(fixtureName);
                
  //               // Fixture row
  //               pdf.setFontSize(10);
  //               pdf.setTextColor(0, 0, 0);
  //               pdf.text(`• ${cleanName}`, 25, yPosition);
                
  //               // Status with color coding
  //               if (fixtureData.status) {
  //                 const statusX = 120;
  //                 const statusColor = fixtureData.status.toLowerCase() === 'working' || fixtureData.status.toLowerCase() === 'good' ? 
  //                   [0, 150, 0] : [200, 0, 0];
  //                 pdf.setTextColor(...statusColor);
  //                 pdf.text(fixtureData.status, statusX, yPosition);
  //               }

  //               yPosition += 5;

  //               // Remark if available
  //               if (fixtureData.remark) {
  //                 pdf.setTextColor(80, 80, 80);
  //                 const remarkLines = pdf.splitTextToSize(`  Remarks: ${fixtureData.remark}`, pageWidth - 45);
  //                 pdf.text(remarkLines, 27, yPosition);
  //                 yPosition += (remarkLines.length * 4) + 2;
  //               }

  //               yPosition += 3;
  //             }
  //           }
  //         } else {
  //           // REGULAR INSPECTION - Show basic issues
  //           if (room.isAllowForInspection === "yes") {
  //             pdf.setFontSize(10);
  //             pdf.setTextColor(0, 0, 0);

  //             // Seepage
  //             if (room.seepage) {
  //               const seepageColor = room.seepage.toLowerCase() === 'yes' ? [200, 0, 0] : [0, 150, 0];
  //               pdf.setTextColor(...seepageColor);
  //               pdf.text(`• Seepage: ${room.seepage}`, 20, yPosition);
  //               yPosition += 4;
  //             }

  //             // Termites
  //             if (room.termites) {
  //               const termitesColor = room.termites.toLowerCase() === 'yes' ? [200, 0, 0] : [0, 150, 0];
  //               pdf.setTextColor(...termitesColor);
  //               pdf.text(`• Termites: ${room.termites}`, 20, yPosition);
  //               yPosition += 4;
  //             }

  //             // Other Issues
  //             if (room.otherIssue) {
  //               const otherColor = room.otherIssue.toLowerCase() === 'yes' ? [200, 0, 0] : [0, 150, 0];
  //               pdf.setTextColor(...otherColor);
  //               pdf.text(`• Other Issues: ${room.otherIssue}`, 20, yPosition);
  //               yPosition += 4;
  //             }

  //             // Cleaning Remark
  //             if (room.cleanRemark) {
  //               pdf.setTextColor(80, 80, 80);
  //               pdf.text(`• Cleaning: ${room.cleanRemark}`, 20, yPosition);
  //               yPosition += 4;
  //             }
  //           }
  //         }

  //         // General Remark (for both types)
  //         if (room.generalRemark) {
  //           pdf.setFontSize(9);
  //           pdf.setTextColor(80, 80, 80);
  //           const remarkLines = pdf.splitTextToSize(`📝 ${room.generalRemark}`, pageWidth - 40);
  //           pdf.text(remarkLines, 20, yPosition);
  //           yPosition += (remarkLines.length * 3.5) + 3;
  //         }

  //         yPosition += 10;

  //         // Room separator
  //         if (roomIndex < selectedInspection.rooms.length - 1) {
  //           pdf.setDrawColor(220, 220, 220);
  //           pdf.setLineWidth(0.3);
  //           pdf.line(15, yPosition, pageWidth - 15, yPosition);
  //           yPosition += 8;
  //         }
  //       }
  //     }

  //     // Summary Section
  //     if (yPosition > pageHeight - 40) {
  //       pdf.addPage();
  //       yPosition = 20;
  //     }

  //     pdf.setFillColor(255, 250, 240);
  //     pdf.setDrawColor(255, 140, 0);
  //     pdf.roundedRect(10, yPosition, pageWidth - 20, 25, 5, 5, 'FD');

  //     pdf.setFontSize(14);
  //     pdf.setTextColor(255, 140, 0);
  //     pdf.text('📊 SUMMARY', 15, yPosition + 10);

  //     pdf.setFontSize(10);
  //     pdf.setTextColor(0, 0, 0);

  //     const totalRooms = selectedInspection.rooms?.length || 0;
  //     const allowedRooms = selectedInspection.rooms?.filter(room => room.isAllowForInspection === "yes").length || 0;

  //     pdf.text(`• Total Rooms: ${totalRooms}`, 20, yPosition + 18);
  //     pdf.text(`• Accessible Rooms: ${allowedRooms}`, 100, yPosition + 18);

  //     yPosition += 35;

  //     // Footer on all pages
  //     const pageCount = pdf.internal.getNumberOfPages();
  //     for (let i = 1; i <= pageCount; i++) {
  //       pdf.setPage(i);
  //       pdf.setFillColor(240, 240, 240);
  //       pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
        
  //       pdf.setFontSize(8);
  //       pdf.setTextColor(100, 100, 100);
  //       pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  //       pdf.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 15, pageHeight - 8);
  //       pdf.text('PropDial © 2024', pageWidth - 15, pageHeight - 8, { align: 'right' });
  //     }

  //     // Save PDF
  //     const fileName = `${selectedInspection.inspectionType}_Inspection_${selectedInspection.propertyId}_${new Date().toISOString().split('T')[0]}.pdf`;
  //     pdf.save(fileName);

  //     setTimeout(() => setShowDownloadModal(false), 1000);

  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     alert("Error generating PDF report. Please try again.");
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

const generatePDFReport = async () => {
  if (!selectedInspection) return;
  setIsGenerating(true);

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = 15;

    const addSectionTitle = (title) => {
      pdf.setFontSize(12);
      pdf.setTextColor(40, 40, 40);
      pdf.text(title, 12, y);
      y += 3;
      pdf.setDrawColor(0, 0, 0);
      pdf.line(10, y, pageWidth - 10, y);
      y += 6;
    };

    // Header
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${selectedInspection.inspectionType.toUpperCase()} INSPECTION REPORT`, pageWidth / 2, y, { align: "center" });
    y += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text('PropDial - Professional Property Inspection', pageWidth / 2, y, { align: "center" });
    y += 10;

    // Property Information
    addSectionTitle("PROPERTY INFORMATION");
    pdf.setFontSize(9);
    pdf.setTextColor(50, 50, 50);

    if (propertyDetails) {
      pdf.text(`Address: ${propertyDetails.unitNumber || ''} | ${propertyDetails.society || ''}`, 12, y);
      y += 5;
      pdf.text(`Location: ${propertyDetails.locality || ''}, ${propertyDetails.city || ''}`, 12, y);
      y += 5;
      pdf.text(`PID: ${propertyDetails.pid || selectedInspection.propertyId}`, 12, y);
      y += 5;
      pdf.text(`Purpose: ${propertyDetails.purpose || 'N/A'}`, 12, y);
      y += 8;
    }

    // Inspection Details
    addSectionTitle("INSPECTION DETAILS");
    const inspectionDate = formatDate(selectedInspection.createdAt);
    const inspectorName = dbUserState?.find(u => u.id === selectedInspection.createdBy)?.fullName || selectedInspection.createdBy;

    pdf.text(`Date: ${inspectionDate}`, 12, y);
    y += 5;
    pdf.text(`Inspector: ${inspectorName}`, 12, y);
    y += 8;

    // Owner / Executive
    if (ownersData.length > 0 || executivesData.length > 0) {
      addSectionTitle("STAKEHOLDERS");

      if (ownersData[0]) {
        pdf.text(`Owner: ${ownersData[0]?.fullName || ''}`, 12, y);
        y += 5;
      }

      if (executivesData[0]) {
        pdf.text(`Executive: ${executivesData[0]?.fullName || ''}`, 12, y);
        y += 8;
      }
    }

    // Tenants
    if (tenantsData.length > 0) {
      addSectionTitle("TENANTS");
      pdf.text(`Active Tenants: ${tenantsData.length}`, 12, y);
      y += 8;
    }

    // Bills
    if (selectedInspection.bills) {
      addSectionTitle("BILL DETAILS");
      for (const bill of Object.values(selectedInspection.bills)) {
        pdf.text(`${bill.billType} - ${bill.authorityName || ''}`, 12, y);
        y += 4;

        if (bill.amount) {
          pdf.text(`Amount: ₹${bill.amount}`, 12, y);
          y += 6;
        }

        y += 2;
      }
    }

    // Rooms Section
    if (selectedInspection.rooms?.length > 0) {
      addSectionTitle("ROOMS INSPECTION");

      for (const room of selectedInspection.rooms) {
        if (y > pageHeight - 30) {
          pdf.addPage();
          y = 12;
        }

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 120);
        pdf.text(room.roomName, 12, y);
        y += 5;

        if (room.isAllowForInspection === "no") {
          pdf.setTextColor(200, 0, 0);
          pdf.text("Not allowed for inspection", 12, y);
          y += 8;
          continue;
        }

        pdf.setTextColor(50, 50, 50);

        // Fixtures only for full
        if (selectedInspection.inspectionType.toLowerCase() === "full") {
          for (const [fixture, data] of Object.entries(room.fixtures || {})) {
            const statusColor = data.status?.toLowerCase() === "working" ? [0, 150, 0] : [200, 0, 0];

            pdf.text(`• ${fixture}`, 12, y);
            pdf.setTextColor(...statusColor);
            pdf.text(data.status || "", 120, y);
            pdf.setTextColor(50, 50, 50);
            y += 5;

            if (data.remark) {
              pdf.text(`  Remark: ${data.remark}`, 12, y);
              y += 6;
            }
          }
        }

        if (room.generalRemark) {
          pdf.setFontSize(9);
          const lines = pdf.splitTextToSize(room.generalRemark, pageWidth - 20);
          pdf.text(lines, 12, y);
          y += lines.length * 4 + 4;
        }

        pdf.setDrawColor(200, 200, 200);
        pdf.line(10, y, pageWidth - 10, y);
        y += 4;
      }
    }

    // Summary
    addSectionTitle("SUMMARY");
    const total = selectedInspection.rooms?.length || 0;
    const allowed = selectedInspection.rooms?.filter(r => r.isAllowForInspection === "yes").length || 0;

    pdf.text(`Total Rooms: ${total}`, 12, y);
    y += 5;
    pdf.text(`Accessible Rooms: ${allowed}`, 12, y);
    y += 10;

    pdf.save(`Inspection_${selectedInspection.propertyId}.pdf`);
  } catch (error) {
    console.error(error);
    alert("Error generating PDF");
  } finally {
    setIsGenerating(false);
  }
};



  if (!selectedInspection) return null;

  return (
    <Modal show={showDownloadModal} className="download_report_modal" centered>
      <div className="modal_header relative">
        <button
          className="modal_close_btn"
          onClick={() => !isGenerating && setShowDownloadModal(false)}
          disabled={isGenerating}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h5 className="modal_title m-0 text-center">
          {selectedInspection?.inspectionType} Inspection Report
        </h5>
        <p className="m-0 text-center">
          Download comprehensive inspection report
        </p>
        
        <div className="d_b">
          <div className="single">
            <h6>Inspection Date</h6>
            <h5>{formatDate(selectedInspection?.createdAt)}</h5>
          </div>
          <div className="single">
            <h6>Inspected By</h6>
            <h5>{dbUserState?.find(user => user.id === selectedInspection.createdBy)?.fullName || 'N/A'}</h5>
          </div>
        </div>
      </div>

      <div className="modal_body">
        {/* Report Preview */}
        <div className="report_preview" style={{
          background: '#f8f9ff',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '1px solid #e0e7ff'
        }}>
          <h6 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#0066cc',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📋 Report Preview
          </h6>
          
          <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
            <p><strong>Property:</strong> {propertyDetails?.unitNumber} | {propertyDetails?.society}</p>
            <p><strong>Type:</strong> {selectedInspection.inspectionType} Inspection</p>
            <p><strong>Rooms:</strong> {selectedInspection.rooms?.length || 0} rooms inspected</p>
            <p><strong>Includes:</strong> {
              selectedInspection.inspectionType.toLowerCase() === "full" 
                ? "Detailed fixtures & components" 
                : "Basic issues & remarks"
            }</p>
          </div>
        </div>

        {/* Download Section */}
        {isGenerating ? (
          <div className="generating_section" style={{
            textAlign: 'center',
            padding: '30px 20px',
            background: '#f8f9ff',
            borderRadius: '12px',
            border: '2px dashed #e0e7ff'
          }}>        
            <h6 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--theme-green)',
              marginBottom: '10px'
            }}>
              Generating PDF Report...
            </h6>
            <p style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px'
            }}>
              Preparing your {selectedInspection.inspectionType.toLowerCase()} inspection report
            </p>
            <div className="d-flex align-items-center justify-content-center">
              <BarLoader color="var(--theme-green)" width={200} height={4} />
            </div>
          </div>
        ) : (
          <div className="download_button_container" style={{
            textAlign: 'center',
            padding: '10px 0'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '15px',
              lineHeight: '1.5'
            }}>
              Download professional PDF report with all inspection details
            </p>
            <button
              onClick={generatePDFReport}
              disabled={isGenerating}
              className="theme_btn btn_fill text-center no_icon w-100"
            >            
              Download {selectedInspection.inspectionType} Report
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DownloadReportModal;