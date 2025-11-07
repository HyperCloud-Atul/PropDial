import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
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

  // Function to load image and convert to base64
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
          resolve({
            dataURL,
            width: img.width,
            height: img.height
          });
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };

      const timestamp = new Date().getTime();
      const finalUrl = url.includes('?') ? `${url}&t=${timestamp}` : `${url}?t=${timestamp}`;

      img.src = finalUrl;
    });
  };

  // Clean fixture name by removing %%
  const cleanFixtureName = (name) => {
    if (!name) return '';
    return name.replace(/^%%/g, '').trim();
  };

  // Generate PDF Report with Images
  const [propertyDetails, setPropertyDetails] = useState(null);
const [ownersData, setOwnersData] = useState([]);
const [coOwnersData, setCoOwnersData] = useState([]);
const [managersData, setManagersData] = useState([]);
const [executivesData, setExecutivesData] = useState([]);

// Property details fetch
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

// Owner & Executive details fetch (aapka existing code)
useEffect(() => {
  if (!selectedInspection?.propertyId) return;

  const unsubscribe = projectFirestore
    .collection("propertyusers")
    .where("propertyId", "==", selectedInspection.propertyId)
    .onSnapshot(
      async (snapshot) => {
        let ownerIds = [];
        let coOwnerIds = [];
        let managerIds = [];
        let executiveIds = [];

        snapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.userTag === "Owner") ownerIds.push(userData.userId);
          if (userData.userTag === "Co-Owner") coOwnerIds.push(userData.userId);
          if (userData.userTag === "Manager") managerIds.push(userData.userId);
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
              return docSnap.exists
                ? { id: docSnap.id, ...docSnap.data() }
                : null;
            })
          );

          return userDataArray.filter((user) => user !== null);
        };

        const ownersData = await fetchUserData(ownerIds);
        const coOwnersData = await fetchUserData(coOwnerIds);
        const managersData = await fetchUserData(managerIds);
        const executivesData = await fetchUserData(executiveIds);

        setOwnersData(ownersData);
        setCoOwnersData(coOwnersData);
        setManagersData(managersData);
        setExecutivesData(executivesData);
      },
      (error) => {
        console.error("❌ Error fetching property users:", error);
      }
    );

  return () => unsubscribe();
}, [selectedInspection]);
  const generatePDFReport = async () => {
    if (!selectedInspection) return;

    setIsGenerating(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add header with improved design
      pdf.setFillColor(0, 102, 204);
      pdf.roundedRect(10, 10, pageWidth - 20, 25, 5, 5, 'F');

      pdf.setFontSize(22);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`${selectedInspection.inspectionType} INSPECTION REPORT`, pageWidth / 2, 25, { align: 'center' });

      // Add company logo/text
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255);
      pdf.text('PropDial - Professional Property Inspection', pageWidth / 2, 32, { align: 'center' });

      let yPosition = 45;

      // Property Information Box - Improved Design
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(0, 102, 204);
      pdf.roundedRect(10, yPosition, pageWidth - 20, 35, 5, 5, 'FD');

      pdf.setFontSize(16);
      pdf.setTextColor(0, 102, 204);
      pdf.text('📋 PROPERTY INFORMATION', 15, yPosition + 10);

      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);

      // Left Column
      pdf.text(`• Inspection Type: ${selectedInspection.inspectionType}`, 15, yPosition + 18);
      pdf.text(`• Property ID: ${selectedInspection.propertyId}`, 15, yPosition + 25);

      // Right Column
      if (selectedInspection.createdAt) {
        const inspectionDate = selectedInspection.createdAt.toDate
          ? selectedInspection.createdAt.toDate().toLocaleDateString('en-IN')
          : new Date(selectedInspection.createdAt).toLocaleDateString('en-IN');
        pdf.text(`• Date: ${inspectionDate}`, 100, yPosition + 18);
      }

      if (selectedInspection.createdBy) {
        pdf.text(`• Inspector: ${selectedInspection.createdBy}`, 100, yPosition + 25);
      }

      yPosition += 45;

      // Rooms Inspection Section - Improved Design
      if (selectedInspection.rooms && selectedInspection.rooms.length > 0) {
        pdf.setFontSize(18);
        pdf.setTextColor(0, 102, 204);
        pdf.text('🏠 ROOMS INSPECTION DETAILS', 15, yPosition);
        yPosition += 12;

        for (const [roomIndex, room] of selectedInspection.rooms.entries()) {
          // Check if we need a new page
          if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = 20;
          }

          // Room Header - Improved Design
          pdf.setFillColor(240, 245, 255);
          pdf.setDrawColor(0, 102, 204);
          pdf.roundedRect(15, yPosition, pageWidth - 30, 12, 3, 3, 'FD');

          pdf.setFontSize(14);
          pdf.setTextColor(0, 0, 128);
          pdf.text(`📍 ${room.roomName || 'Unnamed Room'}`, 20, yPosition + 8);
          yPosition += 15;

          // Room Details - Improved Layout
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);

          if (room.isAllowForInspection !== undefined) {
            pdf.setFontSize(11);
            pdf.setTextColor(0, 100, 0);
            pdf.text(`✅ Tenant Allowed: ${room.isAllowForInspection ? 'Yes' : 'No'}`, 20, yPosition);
            yPosition += 6;
          }

          if (room.generalRemark) {
            pdf.setFontSize(10);
            pdf.setTextColor(80, 80, 80);
            const remarkLines = pdf.splitTextToSize(`📝 ${room.generalRemark}`, pageWidth - 40);
            pdf.text(remarkLines, 20, yPosition);
            yPosition += (remarkLines.length * 4.5) + 3;
          }

          // Fixtures Data - Improved Design
          if (room.fixtures && Object.keys(room.fixtures).length > 0) {
            pdf.setFontSize(12);
            pdf.setTextColor(0, 102, 204);
            pdf.text('🔧 FIXTURES & COMPONENTS', 20, yPosition);
            yPosition += 8;

            for (const [fixtureName, fixtureData] of Object.entries(room.fixtures)) {
              const cleanName = cleanFixtureName(fixtureName);

              if (yPosition > pageHeight - 40) {
                pdf.addPage();
                yPosition = 20;
              }

              // Fixture Header
              pdf.setFontSize(11);
              pdf.setTextColor(0, 0, 0);
              pdf.setFillColor(250, 250, 250);
              pdf.roundedRect(25, yPosition, pageWidth - 50, 6, 2, 2, 'F');
              pdf.text(`⚙️ ${cleanName}`, 30, yPosition + 4);
              yPosition += 8;

              // Fixture Details
              pdf.setFontSize(10);

              if (fixtureData.status) {
                const statusColor = fixtureData.status === 'Working' ? [0, 150, 0] : [200, 0, 0];
                pdf.setTextColor(...statusColor);
                pdf.text(`   Status: ${fixtureData.status}`, 30, yPosition);
                yPosition += 5;
              }

              if (fixtureData.remark) {
                pdf.setTextColor(80, 80, 80);
                const fixtureRemarkLines = pdf.splitTextToSize(`   Remarks: ${fixtureData.remark}`, pageWidth - 55);
                pdf.text(fixtureRemarkLines, 30, yPosition);
                yPosition += (fixtureRemarkLines.length * 4) + 2;
              }

              // Handle Images - Always include images in detailed report
              if (fixtureData.images && fixtureData.images.length > 0) {
                pdf.setTextColor(0, 102, 204);
                pdf.text(`   Images (${fixtureData.images.length}):`, 30, yPosition);
                yPosition += 5;

                // Process first image only to avoid PDF becoming too large
                const firstImage = fixtureData.images[0];
                if (firstImage && firstImage.url) {
                  try {
                    // Load and add image to PDF
                    const imageData = await loadImage(firstImage.url);

                    // Calculate image dimensions to fit in PDF
                    const maxWidth = pageWidth - 60;
                    const maxHeight = 40;
                    let imgWidth = imageData.width * 0.15;
                    let imgHeight = imageData.height * 0.15;

                    // Maintain aspect ratio
                    if (imgWidth > maxWidth) {
                      const ratio = maxWidth / imgWidth;
                      imgWidth = maxWidth;
                      imgHeight = imgHeight * ratio;
                    }

                    if (imgHeight > maxHeight) {
                      const ratio = maxHeight / imgHeight;
                      imgHeight = maxHeight;
                      imgWidth = imgWidth * ratio;
                    }

                    // Check if we need new page for image
                    if (yPosition + imgHeight > pageHeight - 20) {
                      pdf.addPage();
                      yPosition = 20;
                    }

                    // Add image border
                    pdf.setDrawColor(200, 200, 200);
                    pdf.roundedRect(35, yPosition, imgWidth + 2, imgHeight + 2, 2, 2, 'S');

                    // Add image to PDF
                    pdf.addImage(
                      imageData.dataURL,
                      'JPEG',
                      36,
                      yPosition + 1,
                      imgWidth,
                      imgHeight
                    );

                    // Add image caption
                    pdf.setFontSize(8);
                    pdf.setTextColor(100, 100, 100);
                    pdf.text(
                      `Image: ${firstImage.name || 'Inspection Image'}`,
                      35,
                      yPosition + imgHeight + 5
                    );

                    yPosition += imgHeight + 10;

                  } catch (imageError) {
                    console.log("Could not add image to PDF:", imageError);
                    pdf.text(`   [Image loading failed]`, 30, yPosition);
                    yPosition += 4;
                  }
                }

                // Show count of additional images
                if (fixtureData.images.length > 1) {
                  pdf.setFontSize(9);
                  pdf.setTextColor(100, 100, 100);
                  pdf.text(`   +${fixtureData.images.length - 1} more image(s)`, 30, yPosition);
                  yPosition += 4;
                }
              }

              yPosition += 3;
            }
          }

          yPosition += 10;

          // Add separator line between rooms
          if (roomIndex < selectedInspection.rooms.length - 1) {
            pdf.setDrawColor(220, 220, 220);
            pdf.setLineWidth(0.5);
            pdf.line(15, yPosition, pageWidth - 15, yPosition);
            yPosition += 8;
          }
        }
      }

      // Bills Section - Improved Design
      if (selectedInspection.bills && Object.keys(selectedInspection.bills).length > 0) {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(18);
        pdf.setTextColor(0, 102, 204);
        pdf.text('💰 UTILITY BILLS INSPECTION', 15, yPosition);
        yPosition += 12;

        Object.values(selectedInspection.bills).forEach((bill, billIndex) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setFillColor(245, 255, 245);
          pdf.setDrawColor(0, 150, 0);
          pdf.roundedRect(15, yPosition, pageWidth - 30, 22, 3, 3, 'FD');

          pdf.setFontSize(12);
          pdf.setTextColor(0, 100, 0);
          pdf.text(`📄 ${bill.billType}`, 20, yPosition + 8);

          if (bill.amount) {
            pdf.setFontSize(11);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Amount: ₹${bill.amount}`, 20, yPosition + 15);
          }

          if (bill.remark) {
            pdf.setFontSize(9);
            pdf.setTextColor(80, 80, 80);
            const billRemarkLines = pdf.splitTextToSize(`Remarks: ${bill.remark}`, pageWidth - 50);
            pdf.text(billRemarkLines, 20, yPosition + (bill.amount ? 20 : 15));
          }

          yPosition += 25;
        });
      }

      // Summary Section - Improved Design
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFillColor(255, 250, 240);
      pdf.setDrawColor(255, 140, 0);
      pdf.roundedRect(10, yPosition, pageWidth - 20, 40, 5, 5, 'FD');

      pdf.setFontSize(16);
      pdf.setTextColor(255, 140, 0);
      pdf.text('📊 INSPECTION SUMMARY', 15, yPosition + 8);

      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);

      const totalRooms = selectedInspection.rooms?.length || 0;
      let totalFixtures = 0;
      let completedFixtures = 0;
      let totalImages = 0;

      if (selectedInspection.rooms) {
        selectedInspection.rooms.forEach(room => {
          if (room.fixtures) {
            totalFixtures += Object.keys(room.fixtures).length;
            completedFixtures += Object.values(room.fixtures).filter(fixture =>
              fixture.status && fixture.remark
            ).length;

            // Count images
            Object.values(room.fixtures).forEach(fixture => {
              if (fixture.images) {
                totalImages += fixture.images.length;
              }
            });
          }
        });
      }

      const totalBills = Object.keys(selectedInspection.bills || {}).length;
      const completedBills = Object.values(selectedInspection.bills || {}).filter(bill =>
        bill.amount && bill.remark
      ).length;

      const completionRate = totalFixtures > 0 ? Math.round((completedFixtures / totalFixtures) * 100) : 0;

      // Summary items with better layout
      pdf.text(`• Total Rooms Inspected: ${totalRooms}`, 20, yPosition + 16);
      pdf.text(`• Fixtures Completed: ${completedFixtures}/${totalFixtures} (${completionRate}%)`, 20, yPosition + 22);
      pdf.text(`• Bills Documented: ${completedBills}/${totalBills}`, 20, yPosition + 28);
      pdf.text(`• Total Images: ${totalImages}`, 100, yPosition + 16);
      pdf.text(`• Report Type: Detailed`, 100, yPosition + 22);
      pdf.text(`• Status: ${selectedInspection.finalSubmit ? '✅ FINALIZED' : '🟡 IN PROGRESS'}`, 100, yPosition + 28);

      yPosition += 45;

      // Footer on every page - Improved Design
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);

        // Footer background
        pdf.setFillColor(240, 240, 240);
        pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');

        // Footer text
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
        pdf.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 15, pageHeight - 8);
        pdf.text('PropDial © 2024 - Confidential Report', pageWidth - 15, pageHeight - 8, { align: 'right' });
      }

      // Save PDF with proper naming
      const fileName = `${selectedInspection.inspectionType}_Report_${selectedInspection.propertyId}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      // Close modal after successful download
      setTimeout(() => {
        setShowDownloadModal(false);
      }, 1000);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
//   const generatePDFReport = async () => {
//   if (!selectedInspection) return;
//   setIsGenerating(true);

//   try {
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     const themeColor = [0, 80, 160]; // Dark blue tone

//     let y = 15;

//     // HEADER
//     pdf.setFontSize(16);
//     pdf.setTextColor(...themeColor);
//     pdf.text(`${selectedInspection.inspectionType} Inspection Report`, pageWidth / 2, y, { align: 'center' });

//     pdf.setFontSize(10);
//     pdf.setTextColor(80, 80, 80);
//     pdf.text('PropDial - Property Inspection Report', pageWidth / 2, y + 6, { align: 'center' });

//     y += 15;

//     // PROPERTY DETAILS
//     pdf.setDrawColor(...themeColor);
//     pdf.line(10, y, pageWidth - 10, y);
//     y += 6;

//     pdf.setFontSize(12);
//     pdf.setTextColor(...themeColor);
//     pdf.text('Property Information', 10, y);

//     y += 6;
//     pdf.setFontSize(10);
//     pdf.setTextColor(0, 0, 0);
//     pdf.text(`Inspection Type: ${selectedInspection.inspectionType}`, 10, y);
//     pdf.text(`Property ID: ${selectedInspection.propertyId}`, 100, y);

//     y += 6;
//     const inspectionDate = selectedInspection.createdAt?.toDate
//       ? selectedInspection.createdAt.toDate().toLocaleDateString('en-IN')
//       : new Date(selectedInspection.createdAt).toLocaleDateString('en-IN');
//     pdf.text(`Date: ${inspectionDate}`, 10, y);
//     pdf.text(`Inspector: ${selectedInspection.createdBy}`, 100, y);

//     y += 10;

//     // ROOMS SECTION
//     pdf.setFontSize(12);
//     pdf.setTextColor(...themeColor);
//     pdf.text('Rooms Inspection Details', 10, y);
//     y += 4;
//     pdf.setDrawColor(...themeColor);
//     pdf.line(10, y, pageWidth - 10, y);
//     y += 6;

//     for (const [index, room] of selectedInspection.rooms.entries()) {
//       if (y > pageHeight - 40) {
//         pdf.addPage();
//         y = 20;
//       }

//       pdf.setFontSize(11);
//       pdf.setTextColor(0, 0, 0);
//       pdf.text(`${index + 1}. ${room.roomName || 'Unnamed Room'}`, 10, y);
//       y += 5;

//       if (room.generalRemark) {
//         const remark = pdf.splitTextToSize(`Remarks: ${room.generalRemark}`, pageWidth - 20);
//         pdf.text(remark, 12, y);
//         y += remark.length * 4 + 2;
//       }

//       if (room.fixtures && Object.keys(room.fixtures).length > 0) {
//         pdf.setFontSize(10);
//         pdf.setTextColor(...themeColor);
//         pdf.text('Fixtures:', 12, y);
//         y += 4;

//         for (const [fixtureName, fixtureData] of Object.entries(room.fixtures)) {
//           if (y > pageHeight - 30) {
//             pdf.addPage();
//             y = 20;
//           }

//           pdf.setFontSize(10);
//           pdf.setTextColor(0, 0, 0);
//           pdf.text(`• ${fixtureName}`, 14, y);
//           y += 4;

//           if (fixtureData.status) {
//             pdf.text(`Status: ${fixtureData.status}`, 18, y);
//             y += 4;
//           }

//           if (fixtureData.remark) {
//             const remarkLines = pdf.splitTextToSize(`Remarks: ${fixtureData.remark}`, pageWidth - 30);
//             pdf.text(remarkLines, 18, y);
//             y += remarkLines.length * 4;
//           }

//           if (fixtureData.images && fixtureData.images[0]?.url) {
//             try {
//               const imgData = await loadImage(fixtureData.images[0].url);
//               const imgW = 40, imgH = 25;
//               if (y + imgH > pageHeight - 20) {
//                 pdf.addPage();
//                 y = 20;
//               }
//               pdf.addImage(imgData.dataURL, 'JPEG', 18, y, imgW, imgH);
//               y += imgH + 4;
//             } catch {
//               pdf.text('[Image not available]', 18, y);
//               y += 5;
//             }
//           }
//         }
//       }

//       y += 6;
//       pdf.setDrawColor(200, 200, 200);
//       pdf.line(10, y, pageWidth - 10, y);
//       y += 4;
//     }

//     // SUMMARY
//     if (y > pageHeight - 30) {
//       pdf.addPage();
//       y = 20;
//     }

//     pdf.setFontSize(12);
//     pdf.setTextColor(...themeColor);
//     pdf.text('Summary', 10, y);
//     y += 5;
//     pdf.line(10, y, pageWidth - 10, y);
//     y += 5;

//     const totalRooms = selectedInspection.rooms?.length || 0;
//     pdf.setFontSize(10);
//     pdf.setTextColor(0, 0, 0);
//     pdf.text(`Total Rooms: ${totalRooms}`, 10, y);
//     y += 5;
//     pdf.text(`Report Generated On: ${new Date().toLocaleDateString('en-IN')}`, 10, y);

//     // FOOTER
//     const pageCount = pdf.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       pdf.setPage(i);
//       pdf.setFontSize(8);
//       pdf.setTextColor(120, 120, 120);
//       pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
//     }

//     pdf.save(`${selectedInspection.inspectionType}_Report.pdf`);
//     setTimeout(() => setShowDownloadModal(false), 1000);

//   } catch (err) {
//     console.error('PDF generation failed', err);
//   } finally {
//     setIsGenerating(false);
//   }
// };
// const generatePDFReport = async () => {
//   if (!selectedInspection) return;
//   setIsGenerating(true);

//   try {
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     const themeColor = [0, 80, 160]; // professional blue
//     let y = 15;

//     // Header
//     pdf.setFontSize(16);
//     pdf.setTextColor(...themeColor);
//     pdf.text(
//       `${selectedInspection.inspectionType} Inspection Report`,
//       pageWidth / 2,
//       y,
//       { align: "center" }
//     );

//     pdf.setFontSize(10);
//     pdf.setTextColor(100, 100, 100);
//     pdf.text(
//       "PropDial - Professional Property Inspection",
//       pageWidth / 2,
//       y + 6,
//       { align: "center" }
//     );
//     y += 15;

//     // Property Info Section
//     pdf.setDrawColor(...themeColor);
//     pdf.line(10, y, pageWidth - 10, y);
//     y += 7;
//     pdf.setFontSize(12);
//     pdf.setTextColor(...themeColor);
//     pdf.text("Property Information", 10, y);
//     y += 6;

//     pdf.setFontSize(10);
//     pdf.setTextColor(0, 0, 0);
//     pdf.text(`Inspection Type: ${selectedInspection.inspectionType}`, 10, y);
//     pdf.text(`Property ID: ${selectedInspection.propertyId}`, 100, y);
//     y += 6;

//     const inspectionDate = selectedInspection.createdAt?.toDate
//       ? selectedInspection.createdAt.toDate().toLocaleDateString("en-IN")
//       : new Date(selectedInspection.createdAt).toLocaleDateString("en-IN");
//     pdf.text(`Date: ${inspectionDate}`, 10, y);
//     pdf.text(`Inspector: ${selectedInspection.createdBy}`, 100, y);
//     y += 10;

//     // Rooms Section
//     pdf.setFontSize(12);
//     pdf.setTextColor(...themeColor);
//     pdf.text("Rooms Inspection Details", 10, y);
//     y += 4;
//     pdf.line(10, y, pageWidth - 10, y);
//     y += 6;

//     for (const [index, room] of selectedInspection.rooms.entries()) {
//       if (y > pageHeight - 40) {
//         pdf.addPage();
//         y = 20;
//       }

//       // Room Title
//       pdf.setFontSize(11);
//       pdf.setTextColor(0, 0, 0);
//       pdf.text(`${index + 1}. ${room.roomName || "Unnamed Room"}`, 10, y);
//       y += 5;

//       // Tenant Allowed or Not
//       const allowed =
//         room.isAllowForInspection === true ||
//         room.isAllowForInspection === "yes";
//       const notAllowed =
//         room.isAllowForInspection === false ||
//         room.isAllowForInspection === "no";

//       if (allowed) {
//         pdf.setTextColor(0, 128, 0);
//         pdf.text("Tenant Allowed: Yes", 12, y);
//       } else if (notAllowed) {
//         pdf.setTextColor(200, 0, 0);
//         pdf.text("Tenant Allowed: No", 12, y);
//       }
//       y += 5;

//       // General Remark
//       if (room.generalRemark) {
//         pdf.setFontSize(10);
//         pdf.setTextColor(60, 60, 60);
//         const remark = pdf.splitTextToSize(
//           `Remarks: ${room.generalRemark}`,
//           pageWidth - 20
//         );
//         pdf.text(remark, 12, y);
//         y += remark.length * 4 + 2;
//       }

//       // Only show fixtures if tenant allowed
//       if (allowed && room.fixtures && Object.keys(room.fixtures).length > 0) {
//         pdf.setFontSize(10);
//         pdf.setTextColor(...themeColor);
//         pdf.text("Fixtures & Components:", 12, y);
//         y += 5;

//         for (const [fixtureName, fixtureData] of Object.entries(
//           room.fixtures
//         )) {
//           if (y > pageHeight - 30) {
//             pdf.addPage();
//             y = 20;
//           }

//           pdf.setFontSize(10);
//           pdf.setTextColor(0, 0, 0);
//           pdf.text(`• ${fixtureName}`, 14, y);
//           y += 4;

//           if (fixtureData.status) {
//             const statusColor =
//               fixtureData.status === "Working" ? [0, 150, 0] : [200, 0, 0];
//             pdf.setTextColor(...statusColor);
//             pdf.text(`Status: ${fixtureData.status}`, 18, y);
//             y += 4;
//           }

//           if (fixtureData.remark) {
//             pdf.setTextColor(60, 60, 60);
//             const lines = pdf.splitTextToSize(
//               `Remarks: ${fixtureData.remark}`,
//               pageWidth - 30
//             );
//             pdf.text(lines, 18, y);
//             y += lines.length * 4;
//           }

//           if (fixtureData.images && fixtureData.images[0]?.url) {
//             try {
//               const img = await loadImage(fixtureData.images[0].url);
//               const imgW = 40,
//                 imgH = 25;
//               if (y + imgH > pageHeight - 20) {
//                 pdf.addPage();
//                 y = 20;
//               }
//               pdf.addImage(img.dataURL, "JPEG", 18, y, imgW, imgH);
//               y += imgH + 5;
//             } catch {
//               pdf.setTextColor(120, 120, 120);
//               pdf.text("[Image not available]", 18, y);
//               y += 5;
//             }
//           }
//         }
//       }

//       // Divider line
//       y += 5;
//       pdf.setDrawColor(220, 220, 220);
//       pdf.line(10, y, pageWidth - 10, y);
//       y += 6;
//     }

//     // Summary Section
//     if (y > pageHeight - 40) {
//       pdf.addPage();
//       y = 20;
//     }

//     pdf.setFontSize(12);
//     pdf.setTextColor(...themeColor);
//     pdf.text("Summary", 10, y);
//     y += 4;
//     pdf.line(10, y, pageWidth - 10, y);
//     y += 6;

//     const totalRooms = selectedInspection.rooms?.length || 0;
//     pdf.setFontSize(10);
//     pdf.setTextColor(0, 0, 0);
//     pdf.text(`Total Rooms: ${totalRooms}`, 10, y);
//     y += 5;
//     pdf.text(
//       `Generated On: ${new Date().toLocaleDateString("en-IN")}`,
//       10,
//       y
//     );

//     // Footer
//     const pageCount = pdf.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       pdf.setPage(i);
//       pdf.setFontSize(8);
//       pdf.setTextColor(120, 120, 120);
//       pdf.text(
//         `Page ${i} of ${pageCount}`,
//         pageWidth / 2,
//         pageHeight - 8,
//         { align: "center" }
//       );
//     }

//     // Save file
//     const fileName = `${selectedInspection.inspectionType}_Report_${selectedInspection.propertyId}.pdf`;
//     pdf.save(fileName);

//     setTimeout(() => setShowDownloadModal(false), 1000);
//   } catch (err) {
//     console.error("PDF generation failed", err);
//   } finally {
//     setIsGenerating(false);
//   }
// };
// const generatePDFReport = async () => {
//   if (!selectedInspection) return;

//   setIsGenerating(true);

//   try {
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();

//     let yPosition = 15;

//     // 1. HEADER SECTION
//     pdf.setFillColor(0, 102, 204);
//     pdf.roundedRect(10, 10, pageWidth - 20, 25, 5, 5, 'F');

//     pdf.setFontSize(22);
//     pdf.setTextColor(255, 255, 255);
//     pdf.text(`${selectedInspection.inspectionType} INSPECTION REPORT`, pageWidth / 2, 25, { align: 'center' });

//     pdf.setFontSize(12);
//     pdf.setTextColor(255, 255, 255);
//     pdf.text('PropDial - Professional Property Inspection', pageWidth / 2, 32, { align: 'center' });

//     yPosition = 45;

//     // 2. PROPERTY DETAILS SECTION
//     pdf.setFillColor(248, 250, 252);
//     pdf.setDrawColor(0, 102, 204);
//     pdf.roundedRect(10, yPosition, pageWidth - 20, 45, 5, 5, 'FD');

//     pdf.setFontSize(16);
//     pdf.setTextColor(0, 102, 204);
//     pdf.text('📋 PROPERTY INFORMATION', 15, yPosition + 10);

//     pdf.setFontSize(11);
//     pdf.setTextColor(0, 0, 0);

//     // Property details from properties-propdial collection
//     if (propertyDetails) {
//       pdf.text(`• Property ID: ${propertyDetails.pid || selectedInspection.propertyId}`, 15, yPosition + 18);
//       pdf.text(`• BHK: ${propertyDetails.bhk || 'N/A'}`, 15, yPosition + 25);
//       pdf.text(`• Society: ${propertyDetails.society || 'N/A'}`, 15, yPosition + 32);
//       pdf.text(`• Locality: ${propertyDetails.locality || 'N/A'}`, 100, yPosition + 18);
//       pdf.text(`• City: ${propertyDetails.city || 'N/A'}`, 100, yPosition + 25);
//       pdf.text(`• Purpose: ${propertyDetails.purpose || 'N/A'}`, 100, yPosition + 32);
//     } else {
//       pdf.text(`• Property ID: ${selectedInspection.propertyId}`, 15, yPosition + 18);
//       pdf.text('• Property details not available', 15, yPosition + 25);
//     }

//     yPosition += 55;

//     // 3. OWNER & EXECUTIVE DETAILS SECTION
//     const allUsers = [...ownersData, ...coOwnersData, ...managersData, ...executivesData];
//     if (allUsers.length > 0) {
//       if (yPosition > pageHeight - 50) {
//         pdf.addPage();
//         yPosition = 20;
//       }

//       pdf.setFillColor(255, 248, 225);
//       pdf.setDrawColor(255, 193, 7);
//       pdf.roundedRect(10, yPosition, pageWidth - 20, 30, 5, 5, 'FD');

//       pdf.setFontSize(16);
//       pdf.setTextColor(255, 149, 0);
//       pdf.text('👥 PROPERTY STAKEHOLDERS', 15, yPosition + 10);

//       pdf.setFontSize(10);
//       pdf.setTextColor(0, 0, 0);

//       let userY = yPosition + 18;
      
//       // Owners
//       if (ownersData.length > 0) {
//         pdf.text(`• Owners: ${ownersData.map(owner => owner.fullName || owner.email).join(', ')}`, 15, userY);
//         userY += 5;
//       }
      
//       // Co-Owners
//       if (coOwnersData.length > 0) {
//         pdf.text(`• Co-Owners: ${coOwnersData.map(coOwner => coOwner.fullName || coOwner.email).join(', ')}`, 15, userY);
//         userY += 5;
//       }
      
//       // Managers
//       if (managersData.length > 0) {
//         pdf.text(`• Managers: ${managersData.map(manager => manager.fullName || manager.email).join(', ')}`, 15, userY);
//         userY += 5;
//       }
      
//       // Executives
//       if (executivesData.length > 0) {
//         pdf.text(`• Executives: ${executivesData.map(exec => exec.fullName || exec.email).join(', ')}`, 15, userY);
//       }

//       yPosition += 40;
//     }

//     // 4. INSPECTION BASIC INFO
//     if (yPosition > pageHeight - 40) {
//       pdf.addPage();
//       yPosition = 20;
//     }

//     pdf.setFillColor(240, 245, 255);
//     pdf.setDrawColor(100, 100, 255);
//     pdf.roundedRect(10, yPosition, pageWidth - 20, 25, 5, 5, 'FD');

//     pdf.setFontSize(14);
//     pdf.setTextColor(0, 0, 128);
//     pdf.text('📅 INSPECTION DETAILS', 15, yPosition + 10);

//     pdf.setFontSize(10);
//     pdf.setTextColor(0, 0, 0);

//     const inspectionDate = selectedInspection.createdAt?.toDate
//       ? selectedInspection.createdAt.toDate().toLocaleDateString('en-IN')
//       : new Date(selectedInspection.createdAt).toLocaleDateString('en-IN');

//     pdf.text(`• Inspection Date: ${inspectionDate}`, 15, yPosition + 18);
//     pdf.text(`• Inspector: ${selectedInspection.createdBy || 'N/A'}`, 100, yPosition + 18);

//     yPosition += 35;

//     // 5. BILLS SECTION
//     if (selectedInspection.bills && Object.keys(selectedInspection.bills).length > 0) {
//       if (yPosition > pageHeight - 50) {
//         pdf.addPage();
//         yPosition = 20;
//       }

//       pdf.setFontSize(18);
//       pdf.setTextColor(0, 102, 204);
//       pdf.text('💰 UTILITY BILLS INSPECTION', 15, yPosition);
//       yPosition += 12;

//       Object.values(selectedInspection.bills).forEach((bill, billIndex) => {
//         if (yPosition > pageHeight - 30) {
//           pdf.addPage();
//           yPosition = 20;
//         }

//         pdf.setFillColor(245, 255, 245);
//         pdf.setDrawColor(0, 150, 0);
//         pdf.roundedRect(15, yPosition, pageWidth - 30, 25, 3, 3, 'FD');

//         pdf.setFontSize(12);
//         pdf.setTextColor(0, 100, 0);
//         pdf.text(`📄 ${bill.billType || 'Bill'}`, 20, yPosition + 8);

//         if (bill.amount) {
//           pdf.setFontSize(11);
//           pdf.setTextColor(0, 0, 0);
//           pdf.text(`Amount: ₹${bill.amount}`, 20, yPosition + 15);
//         }

//         if (bill.remark) {
//           pdf.setFontSize(9);
//           pdf.setTextColor(80, 80, 80);
//           const billRemarkLines = pdf.splitTextToSize(`Remarks: ${bill.remark}`, pageWidth - 50);
//           pdf.text(billRemarkLines, 20, yPosition + (bill.amount ? 20 : 15));
//         }

//         yPosition += 28;
//       });
      
//       yPosition += 10;
//     }

//     // 6. ROOMS INSPECTION SECTION
//     if (selectedInspection.rooms && selectedInspection.rooms.length > 0) {
//       if (yPosition > pageHeight - 40) {
//         pdf.addPage();
//         yPosition = 20;
//       }

//       pdf.setFontSize(18);
//       pdf.setTextColor(0, 102, 204);
//       pdf.text('🏠 ROOMS INSPECTION DETAILS', 15, yPosition);
//       yPosition += 12;

//       for (const [roomIndex, room] of selectedInspection.rooms.entries()) {
//         // Check if we need a new page
//         if (yPosition > pageHeight - 60) {
//           pdf.addPage();
//           yPosition = 20;
//         }

//         // Room Header
//         pdf.setFillColor(240, 245, 255);
//         pdf.setDrawColor(0, 102, 204);
//         pdf.roundedRect(15, yPosition, pageWidth - 30, 12, 3, 3, 'FD');

//         pdf.setFontSize(14);
//         pdf.setTextColor(0, 0, 128);
//         pdf.text(`📍 ${room.roomName || 'Unnamed Room'}`, 20, yPosition + 8);
//         yPosition += 15;

//         // Room Details
//         pdf.setFontSize(11);
//         pdf.setTextColor(0, 0, 0);

//         if (room.isAllowForInspection !== undefined) {
//           const allowed = room.isAllowForInspection === true || room.isAllowForInspection === "yes";
//           pdf.setTextColor(allowed ? [0, 100, 0] : [200, 0, 0]);
//           pdf.text(`✅ Tenant Allowed: ${allowed ? 'Yes' : 'No'}`, 20, yPosition);
//           yPosition += 6;
//         }

//         if (room.generalRemark) {
//           pdf.setFontSize(10);
//           pdf.setTextColor(80, 80, 80);
//           const remarkLines = pdf.splitTextToSize(`📝 ${room.generalRemark}`, pageWidth - 40);
//           pdf.text(remarkLines, 20, yPosition);
//           yPosition += (remarkLines.length * 4.5) + 3;
//         }

//         // Fixtures Data
//         if (room.fixtures && Object.keys(room.fixtures).length > 0) {
//           pdf.setFontSize(12);
//           pdf.setTextColor(0, 102, 204);
//           pdf.text('🔧 FIXTURES & COMPONENTS', 20, yPosition);
//           yPosition += 8;

//           for (const [fixtureName, fixtureData] of Object.entries(room.fixtures)) {
//             const cleanName = cleanFixtureName(fixtureName);

//             if (yPosition > pageHeight - 40) {
//               pdf.addPage();
//               yPosition = 20;
//             }

//             // Fixture Header
//             pdf.setFontSize(11);
//             pdf.setTextColor(0, 0, 0);
//             pdf.setFillColor(250, 250, 250);
//             pdf.roundedRect(25, yPosition, pageWidth - 50, 6, 2, 2, 'F');
//             pdf.text(`⚙️ ${cleanName}`, 30, yPosition + 4);
//             yPosition += 8;

//             // Fixture Details
//             pdf.setFontSize(10);

//             if (fixtureData.status) {
//               const statusColor = fixtureData.status.toLowerCase() === 'good' || fixtureData.status.toLowerCase() === 'working' ? [0, 150, 0] : [200, 0, 0];
//               pdf.setTextColor(...statusColor);
//               pdf.text(`   Status: ${fixtureData.status}`, 30, yPosition);
//               yPosition += 5;
//             }

//             if (fixtureData.remark) {
//               pdf.setTextColor(80, 80, 80);
//               const fixtureRemarkLines = pdf.splitTextToSize(`   Remarks: ${fixtureData.remark}`, pageWidth - 55);
//               pdf.text(fixtureRemarkLines, 30, yPosition);
//               yPosition += (fixtureRemarkLines.length * 4) + 2;
//             }

//             // Handle Images
//             if (fixtureData.images && fixtureData.images.length > 0) {
//               pdf.setTextColor(0, 102, 204);
//               pdf.text(`   Images (${fixtureData.images.length}):`, 30, yPosition);
//               yPosition += 5;

//               // Process first image only
//               const firstImage = fixtureData.images[0];
//               if (firstImage && firstImage.url) {
//                 try {
//                   const imageData = await loadImage(firstImage.url);
//                   const maxWidth = pageWidth - 60;
//                   const maxHeight = 40;
//                   let imgWidth = imageData.width * 0.15;
//                   let imgHeight = imageData.height * 0.15;

//                   // Maintain aspect ratio
//                   if (imgWidth > maxWidth) {
//                     const ratio = maxWidth / imgWidth;
//                     imgWidth = maxWidth;
//                     imgHeight = imgHeight * ratio;
//                   }

//                   if (imgHeight > maxHeight) {
//                     const ratio = maxHeight / imgHeight;
//                     imgHeight = maxHeight;
//                     imgWidth = imgWidth * ratio;
//                   }

//                   // Check if we need new page for image
//                   if (yPosition + imgHeight > pageHeight - 20) {
//                     pdf.addPage();
//                     yPosition = 20;
//                   }

//                   // Add image border and image
//                   pdf.setDrawColor(200, 200, 200);
//                   pdf.roundedRect(35, yPosition, imgWidth + 2, imgHeight + 2, 2, 2, 'S');
//                   pdf.addImage(imageData.dataURL, 'JPEG', 36, yPosition + 1, imgWidth, imgHeight);

//                   // Add image caption
//                   pdf.setFontSize(8);
//                   pdf.setTextColor(100, 100, 100);
//                   pdf.text(`Image: ${firstImage.name || 'Inspection Image'}`, 35, yPosition + imgHeight + 5);

//                   yPosition += imgHeight + 10;

//                 } catch (imageError) {
//                   console.log("Could not add image to PDF:", imageError);
//                   pdf.text(`   [Image loading failed]`, 30, yPosition);
//                   yPosition += 4;
//                 }
//               }

//               // Show count of additional images
//               if (fixtureData.images.length > 1) {
//                 pdf.setFontSize(9);
//                 pdf.setTextColor(100, 100, 100);
//                 pdf.text(`   +${fixtureData.images.length - 1} more image(s)`, 30, yPosition);
//                 yPosition += 4;
//               }
//             }

//             yPosition += 3;
//           }
//         }

//         yPosition += 10;

//         // Add separator line between rooms
//         if (roomIndex < selectedInspection.rooms.length - 1) {
//           pdf.setDrawColor(220, 220, 220);
//           pdf.setLineWidth(0.5);
//           pdf.line(15, yPosition, pageWidth - 15, yPosition);
//           yPosition += 8;
//         }
//       }
//     }

//     // 7. SUMMARY SECTION
//     if (yPosition > pageHeight - 50) {
//       pdf.addPage();
//       yPosition = 20;
//     }

//     pdf.setFillColor(255, 250, 240);
//     pdf.setDrawColor(255, 140, 0);
//     pdf.roundedRect(10, yPosition, pageWidth - 20, 40, 5, 5, 'FD');

//     pdf.setFontSize(16);
//     pdf.setTextColor(255, 140, 0);
//     pdf.text('📊 INSPECTION SUMMARY', 15, yPosition + 8);

//     pdf.setFontSize(11);
//     pdf.setTextColor(0, 0, 0);

//     const totalRooms = selectedInspection.rooms?.length || 0;
//     let totalFixtures = 0;
//     let completedFixtures = 0;
//     let totalImages = 0;

//     if (selectedInspection.rooms) {
//       selectedInspection.rooms.forEach(room => {
//         if (room.fixtures) {
//           totalFixtures += Object.keys(room.fixtures).length;
//           completedFixtures += Object.values(room.fixtures).filter(fixture =>
//             fixture.status && fixture.remark
//           ).length;

//           // Count images
//           Object.values(room.fixtures).forEach(fixture => {
//             if (fixture.images) {
//               totalImages += fixture.images.length;
//             }
//           });
//         }
//       });
//     }

//     const totalBills = Object.keys(selectedInspection.bills || {}).length;
//     const completedBills = Object.values(selectedInspection.bills || {}).filter(bill =>
//       bill.amount && bill.remark
//     ).length;

//     const completionRate = totalFixtures > 0 ? Math.round((completedFixtures / totalFixtures) * 100) : 0;

//     // Summary items
//     pdf.text(`• Total Rooms Inspected: ${totalRooms}`, 20, yPosition + 16);
//     pdf.text(`• Fixtures Completed: ${completedFixtures}/${totalFixtures} (${completionRate}%)`, 20, yPosition + 22);
//     pdf.text(`• Bills Documented: ${completedBills}/${totalBills}`, 20, yPosition + 28);
//     pdf.text(`• Total Images: ${totalImages}`, 100, yPosition + 16);
//     pdf.text(`• Report Type: Detailed`, 100, yPosition + 22);
//     pdf.text(`• Status: ${selectedInspection.finalSubmit ? '✅ FINALIZED' : '🟡 IN PROGRESS'}`, 100, yPosition + 28);

//     yPosition += 45;

//     // FOOTER ON EVERY PAGE
//     const pageCount = pdf.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       pdf.setPage(i);

//       // Footer background
//       pdf.setFillColor(240, 240, 240);
//       pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');

//       // Footer text
//       pdf.setFontSize(8);
//       pdf.setTextColor(100, 100, 100);
//       pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
//       pdf.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 15, pageHeight - 8);
//       pdf.text('PropDial © 2024 - Confidential Report', pageWidth - 15, pageHeight - 8, { align: 'right' });
//     }

//     // Save PDF
//     const fileName = `${selectedInspection.inspectionType}_Report_${selectedInspection.propertyId}_${new Date().toISOString().split('T')[0]}.pdf`;
//     pdf.save(fileName);

//     // Close modal after successful download
//     setTimeout(() => {
//       setShowDownloadModal(false);
//     }, 1000);

//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     alert("Error generating PDF report. Please try again.");
//   } finally {
//     setIsGenerating(false);
//   }
// };



  if (!selectedInspection) return null;

  return (
    <Modal show={showDownloadModal} className="download_report_modal" centered >
      <div className="modal_header relative">
        <button
          className="modal_close_btn"
          onClick={() => !isGenerating && setShowDownloadModal(false)}
          disabled={isGenerating}
        >
          <span className="material-symbols-outlined" >close</span>
        </button>
        <h5 className="modal_title m-0 text-center">
          {selectedInspection?.inspectionType} Inspection Report
        </h5>
        <p className="m-0 text-center">
          In-depth report highlighting every checked point
        </p>
        <div className="d_b">
          <div className="single">
            <h6>Inspection Date</h6>
            <h5>
              {selectedInspection?.createdAt
                ? (selectedInspection?.createdAt.toDate
                  ? selectedInspection?.createdAt.toDate().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                  : new Date(selectedInspection?.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                )
                : 'Date not available'
              }
            </h5>
          </div>
          <div className="single">
            <h6>Inspected By</h6>
            <h5>{dbUserState && dbUserState.find(user => user.id === selectedInspection.createdBy)?.fullName}</h5>
          </div>
        </div>


      </div>

      <div className="modal_body" >



        {/* Rooms List */}
        {/* <div className="rooms_section" style={{
          marginBottom: '30px'
        }}>
          <h6 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#0066cc',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏠 Inspection Rooms
          </h6>
          
          <div className="rooms_list" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {selectedInspection.rooms && selectedInspection.rooms.length > 0 ? (
              selectedInspection.rooms.map((room, index) => (
                <div key={index} style={{
                  background: 'white',
                  border: '2px solid #f0f4ff',
                  borderRadius: '10px',
                  padding: '15px',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <h6 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#333',
                      margin: 0
                    }}>
                      {room.roomName || `Room ${index + 1}`}
                    </h6>
                    <span style={{
                      background: room.isAllowForInspection ? '#00a8a8' : '#ff6b6b',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {room.isAllowForInspection ? 'Tenant Allowed' : 'Tenant Not Allowed'}
                    </span>
                  </div>
                  
                  {room.generalRemark && (
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      margin: '8px 0 0 0',
                      lineHeight: '1.4'
                    }}>
                      <strong>Remarks:</strong> {room.generalRemark}
                    </p>
                  )}
                  
                  {room.fixtures && Object.keys(room.fixtures).length > 0 && (
                    <div style={{
                      marginTop: '10px',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      <strong>Fixtures:</strong> {Object.keys(room.fixtures).length}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '20px',
                color: '#666',
                fontSize: '14px'
              }}>
                No rooms found in this inspection
              </div>
            )}
          </div>
        </div> */}

        {/* Download Button */}
        {isGenerating ? (
          <div className="generating_section" style={{
            textAlign: 'center',
            padding: '30px 20px',
            background: '#f8f9ff',
            borderRadius: '12px',
            border: '2px dashed #e0e7ff'
          }}>        
            <h6 className="generating_text" style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--theme-green)',
              marginBottom: '10px'
            }}>
              Generating Detailed PDF Report...
            </h6>
            <p className="generating_subtext" style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px'
            }}>
              Please wait while we compile your professional inspection report
            </p>
           <div className="d-flex align-items-center justify-content-center">
 <BarLoader color="var(--theme-green)" width={200} height={4} />
           </div>
          </div>
        ) : (
          <div className="download_button_container" style={{
            textAlign: 'center',
            padding: '20px 0 10px 0'
          }}>
              <p style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '15px',
              lineHeight: '1.5'
            }}>
              📄 Download a comprehensive PDF report with all room details, fixture information, images, and professional analysis
            </p>
            <button
              onClick={generatePDFReport}
              disabled={isGenerating}
          className="theme_btn btn_fill text-center no_icon w-100"
            >            
              Download Report
            </button>

          
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DownloadReportModal;