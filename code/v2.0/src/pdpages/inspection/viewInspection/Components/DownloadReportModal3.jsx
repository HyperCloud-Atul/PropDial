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

  // Improved Image loading function with better error handling
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
          // Use JPEG format for better compression
          const dataURL = canvas.toDataURL('image/jpeg', 0.7); // Reduced quality for smaller file size
          resolve({
            dataURL,
            width: img.width,
            height: img.height,
            aspectRatio: img.width / img.height
          });
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        console.warn(`Failed to load image: ${url}`);
        // Return a placeholder instead of rejecting
        resolve({
          dataURL: null,
          width: 0,
          height: 0,
          aspectRatio: 1,
          error: true
        });
      };
      
      // Add cache busting
      const separator = url.includes('?') ? '&' : '?';
      const finalUrl = `${url}${separator}t=${new Date().getTime()}`;
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

  // Function to add image to PDF with proper sizing
  // const addImageToPDF = async (pdf, imageUrl, x, y, maxWidth, maxHeight) => {
  //   try {
  //     const imageData = await loadImage(imageUrl);
      
  //     if (imageData.error || !imageData.dataURL) {
  //       return { success: false, height: 0 };
  //     }

  //     let imgWidth = imageData.width * 0.2; // Scale down for PDF
  //     let imgHeight = imageData.height * 0.2;

  //     // Maintain aspect ratio while fitting within max dimensions
  //     if (imgWidth > maxWidth) {
  //       const ratio = maxWidth / imgWidth;
  //       imgWidth = maxWidth;
  //       imgHeight = imgHeight * ratio;
  //     }

  //     if (imgHeight > maxHeight) {
  //       const ratio = maxHeight / imgHeight;
  //       imgHeight = maxHeight;
  //       imgWidth = imgWidth * ratio;
  //     }

  //     // Add image border
  //     pdf.setDrawColor(200, 200, 200);
  //     pdf.roundedRect(x - 1, y - 1, imgWidth + 2, imgHeight + 2, 2, 2, 'S');
      
  //     // Add image
  //     pdf.addImage(imageData.dataURL, 'JPEG', x, y, imgWidth, imgHeight);
      
  //     return { success: true, height: imgHeight };
      
  //   } catch (error) {
  //     console.warn('Failed to add image to PDF:', error);
  //     return { success: false, height: 0 };
  //   }
  // };

  // Function to add image to PDF with proper sizing (NO BORDERS)
const addImageToPDF = async (pdf, imageUrl, x, y, maxWidth, maxHeight) => {
  try {
    const imageData = await loadImage(imageUrl);
    
    if (imageData.error || !imageData.dataURL) {
      return { success: false, height: 0 };
    }

    let imgWidth = imageData.width * 0.2;
    let imgHeight = imageData.height * 0.2;

    // Maintain aspect ratio while fitting within max dimensions
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

    // Add image WITHOUT border
    pdf.addImage(imageData.dataURL, 'JPEG', x, y, imgWidth, imgHeight);
    
    return { success: true, height: imgHeight };
    
  } catch (error) {
    console.warn('Failed to add image to PDF:', error);
    return { success: false, height: 0 };
  }
};
function safeText(pdf, text, x, y) {
  if (!text) return;
  pdf.text(text.toString(), x, y);
}

const generatePDFReport = async () => {
  if (!selectedInspection) return;
  setIsGenerating(true);

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header Section - Simple
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${selectedInspection.inspectionType} Inspection Report`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    
    const inspectionDate = formatDate(selectedInspection.updatedAt);
    const inspectorName = dbUserState?.find(user => user.id === selectedInspection.createdBy)?.fullName || selectedInspection.createdBy;
    
    pdf.text(`Inspected at: ${inspectionDate}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 4;
    pdf.text(`Inspected by: ${inspectorName}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;

    // Property Address Section
    pdf.setFillColor(245, 245, 245);
    pdf.rect(10, yPosition, pageWidth - 20, 8, 'F');
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Property Address', 15, yPosition + 6);
    yPosition += 12;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    if (propertyDetails) {
      // First line: Unit Number | Society
      pdf.text(`${propertyDetails.unitNumber || ''} | ${propertyDetails.society || ''}`, 15, yPosition);
      yPosition += 5;

      // Second line: BHK | Furnishing | Purpose
      let secondLine = '';
      if (propertyDetails.bhk) secondLine += `${propertyDetails.bhk}`;
      if (propertyDetails.furnishing) secondLine += ` | ${propertyDetails.furnishing}`;
      if (propertyDetails.purpose) {
        const purposeText = propertyDetails.purpose.toLowerCase() === 'rentsaleboth' ? 
          'For Rent / Sale' : `For ${propertyDetails.purpose}`;
        secondLine += ` | ${purposeText}`;
      }
      pdf.text(secondLine, 15, yPosition);
      yPosition += 5;

      // Third line: Locality, City, State
      pdf.text(`${propertyDetails.locality || ''}, ${propertyDetails.city || ''}, ${propertyDetails.state || ''}`, 15, yPosition);
      yPosition += 5;

      // Fourth line: PID
      pdf.setTextColor(100, 100, 100);
      pdf.text(`PID: ${propertyDetails.pid || selectedInspection.propertyId}`, 15, yPosition);
      pdf.setTextColor(0, 0, 0);
    }

    yPosition += 10;

    // Property Owner Section
    if (ownersData) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(10, yPosition, pageWidth - 20, 8, 'F');
      
      pdf.setFontSize(12);
      pdf.text('Property Owner', 15, yPosition + 6);
      yPosition += 12;

      pdf.setFontSize(10);
      const owner = ownersData[0];
      
      pdf.text(owner.fullName || 'N/A', 15, yPosition);
      yPosition += 4;
      
      if (owner.phoneNumber) {
        const formattedPhone = owner.phoneNumber.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2-$3');
        pdf.text(formattedPhone, 15, yPosition);
        yPosition += 4;
      }
      
      if (owner.email) {
        pdf.text(owner.email, 15, yPosition);
        yPosition += 4;
      }

      yPosition += 8;
    }

      // Property executive Section
    if (executivesData) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(10, yPosition, pageWidth - 20, 8, 'F');
      
      pdf.setFontSize(12);
      pdf.text('Property Executive', 15, yPosition + 6);
      yPosition += 12;

      pdf.setFontSize(10);
      const executive = executivesData[0];

      pdf.text(executive.fullName || 'N/A', 15, yPosition);
      yPosition += 4;

      if (executive.phoneNumber) {
        const formattedPhone = executive.phoneNumber.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2-$3');
        pdf.text(formattedPhone, 15, yPosition);
        yPosition += 4;
      }
      
      if (executive.email) {
        pdf.text(executive.email, 15, yPosition);
        yPosition += 4;
      }

      yPosition += 8;
    }

    // Tenants Section
    if (tenantsData.length > 0) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(10, yPosition, pageWidth - 20, 8, 'F');
      
      pdf.setFontSize(12);
      pdf.text('Tenants', 15, yPosition + 6);
      yPosition += 12;

      pdf.setFontSize(10);

      for (let i = 0; i < tenantsData.length; i++) {
        const tenant = tenantsData[i];
        if (i > 0) yPosition += 5; // Space between multiple tenants
        
        pdf.text(tenant.name || 'Tenant', 15, yPosition);
        yPosition += 4;
        
        if (tenant.mobile) {
          const formattedPhone = tenant.mobile.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2-$3');
          pdf.text(formattedPhone, 15, yPosition);
          yPosition += 4;
        }
        
        if (tenant.emailID) {
          pdf.text(tenant.emailID, 15, yPosition);
          yPosition += 4;
        }
      }

      yPosition += 8;
    }

    // Bill Details Section
    if (selectedInspection.bills && Object.keys(selectedInspection.bills).length > 0) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(10, yPosition, pageWidth - 20, 8, 'F');
      
      pdf.setFontSize(12);
      pdf.text('Bill Details', 15, yPosition + 6);
      yPosition += 12;

      pdf.setFontSize(10);

      const billsArray = Object.values(selectedInspection.bills);
      for (let index = 0; index < billsArray.length; index++) {
        const bill = billsArray[index];
        
        // Check page space before adding bill (leave space for footer)
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }

        // Bill header
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${bill.billType} | ${bill.authorityName || ''}`, 15, yPosition);
        yPosition += 4;

        // Bill details
        pdf.setTextColor(80, 80, 80);
        
        if (bill.thisBillUpdatedAt) {
          const billDate = formatDate(bill.thisBillUpdatedAt);
          pdf.text(`Last updated: ${billDate}`, 15, yPosition);
          yPosition += 4;
        }

        if (bill.billId) {
          pdf.text(`Bill ID: ${bill.billId}`, 15, yPosition);
          yPosition += 4;
        }

        if (bill.amount) {
          pdf.text(`Due Amount: ${bill.amount}`, 15, yPosition); // Fixed spacing
          yPosition += 4;
        }

        if (bill.billWebsiteLink) {
          pdf.setTextColor(0, 102, 204);
          // Note: textWithLink might not work in all browsers, using regular text
          pdf.text('Bill Website Link', 15, yPosition);
          pdf.setTextColor(80, 80, 80);
          yPosition += 4;
        }

        if (bill.remark) {
          const remarkLines = pdf.splitTextToSize(`Remarks: ${bill.remark}`, pageWidth - 30);
          pdf.text(remarkLines, 15, yPosition);
          yPosition += (remarkLines.length * 4) + 2;
        }

        // Bill Images if any
        if (bill.images && bill.images.length > 0) {
          pdf.setTextColor(0, 0, 0);
          pdf.text('Bill Images:', 15, yPosition);
          yPosition += 4;

          let imageX = 20;
          const imageWidth = 40;
          const imageHeight = 25;

          for (let i = 0; i < bill.images.length; i++) {
            const image = bill.images[i];
            
            // Check page space for image (leave space for footer)
            if (yPosition + imageHeight > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
              imageX = 20;
            }

            if (image && image.url) {
              const imageResult = await addImageToPDF(pdf, image.url, imageX, yPosition, imageWidth, imageHeight);
              if (imageResult.success) {
                pdf.setFontSize(7);
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Bill Image ${i + 1}`, imageX + (imageWidth / 2) - 12, yPosition + imageHeight + 3, { align: 'center' });
                
                imageX += imageWidth + 10;
                pdf.setFontSize(10);
                
                // Move to next row if no space
                if (imageX + imageWidth > pageWidth - 20) {
                  yPosition += imageHeight + 10;
                  imageX = 20;
                  
                  // Check page space after moving to new row
                  if (yPosition > pageHeight - 20) {
                    pdf.addPage();
                    yPosition = 20;
                  }
                }
              }
            }
          }

          if (imageX > 20) {
            yPosition += imageHeight + 10;
          }
        }

        yPosition += 8;
        
        // Separator between bills
        if (index < billsArray.length - 1) {
          pdf.setDrawColor(220, 220, 220);
          pdf.line(15, yPosition, pageWidth - 15, yPosition);
          yPosition += 8;
        }
      }

      yPosition += 5;
    }

    // Rooms Inspection Section
    if (selectedInspection.rooms && selectedInspection.rooms.length > 0) {
      // Check page space before adding rooms section
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFillColor(245, 245, 245);
      pdf.rect(10, yPosition, pageWidth - 20, 8, 'F');
      
      pdf.setFontSize(12);
      pdf.text('Rooms Inspection', 15, yPosition + 6);
      yPosition += 12;

      for (let roomIndex = 0; roomIndex < selectedInspection.rooms.length; roomIndex++) {
        const room = selectedInspection.rooms[roomIndex];
        
        // Check page space before adding room (leave space for footer)
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }

        // Room Name
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.text(room.roomName, 15, yPosition);
        yPosition += 5;

        // Tenant Permission Status
        if (room.isAllowForInspection === "no") {
          pdf.setFontSize(9);
          pdf.setTextColor(200, 0, 0);
          pdf.text('Not allowed by tenant for inspection', 15, yPosition);
          yPosition += 5;
          pdf.setTextColor(0, 0, 0);
        }

        // Different content based on inspection type
        if (selectedInspection.inspectionType.toLowerCase() === "full") {
          // FULL INSPECTION - Show fixtures
          if (room.isAllowForInspection === "yes" && room.fixtures && Object.keys(room.fixtures).length > 0) {
            pdf.setFontSize(10);
            pdf.setTextColor(80, 80, 80);
            pdf.text('Fixtures:', 15, yPosition);
            yPosition += 4;

            const fixtures = Object.entries(room.fixtures);
            for (let fixtureIndex = 0; fixtureIndex < fixtures.length; fixtureIndex++) {
              const [fixtureName, fixtureData] = fixtures[fixtureIndex];
              
              // Check page space before adding fixture
              if (yPosition > pageHeight - 40) {
                pdf.addPage();
                yPosition = 20;
              }

              const cleanName = cleanFixtureName(fixtureName);
              
              // Fixture name and status
              pdf.setFontSize(9);
              pdf.setTextColor(0, 0, 0);
              pdf.text(`• ${cleanName}:`, 20, yPosition);
              
              if (fixtureData.status) {
                const statusX = 80;
                const statusColor = fixtureData.status.toLowerCase() === 'working' || fixtureData.status.toLowerCase() === 'good' ? 
                  [0, 150, 0] : [200, 0, 0];
                pdf.setTextColor(...statusColor);
                pdf.text(fixtureData.status, statusX, yPosition);
                pdf.setTextColor(0, 0, 0);
              }

              yPosition += 4;

              // Remark if available
              if (fixtureData.remark) {
                pdf.setTextColor(80, 80, 80);
                const remarkLines = pdf.splitTextToSize(`  ${fixtureData.remark}`, pageWidth - 35);
                pdf.text(remarkLines, 25, yPosition);
                yPosition += (remarkLines.length * 3.5) + 1;
              }

              // Fixture Images
              if (fixtureData.images && fixtureData.images.length > 0) {
                pdf.setTextColor(0, 0, 0);
                pdf.text('  Images:', 25, yPosition);
                yPosition += 3;

                let imageX = 30;
                const imageWidth = 35;
                const imageHeight = 25;

                for (let i = 0; i < fixtureData.images.length; i++) {
                  const image = fixtureData.images[i];
                  
                  // Check page space for image (leave space for footer)
                  if (yPosition + imageHeight > pageHeight - 20) {
                    pdf.addPage();
                    yPosition = 20;
                    imageX = 30;
                  }

                  if (image && image.url) {
                    const imageResult = await addImageToPDF(pdf, image.url, imageX, yPosition, imageWidth, imageHeight);
                    if (imageResult.success) {
                      pdf.setFontSize(6);
                      pdf.setTextColor(100, 100, 100);
                      pdf.text(`${i + 1}`, imageX + (imageWidth / 2) - 2, yPosition + imageHeight + 2, { align: 'center' });
                      
                      imageX += imageWidth + 8;
                      pdf.setFontSize(9);
                      
                      // Move to next row if no space
                      if (imageX + imageWidth > pageWidth - 20) {
                        yPosition += imageHeight + 8;
                        imageX = 30;
                        
                        // Check page space after moving to new row
                        if (yPosition > pageHeight - 20) {
                          pdf.addPage();
                          yPosition = 20;
                        }
                      }
                    }
                  }
                }

                if (imageX > 30) {
                  yPosition += imageHeight + 6;
                }
              }

              yPosition += 2;
            }
          }
        } else {
          // REGULAR INSPECTION - Show basic issues
          if (room.isAllowForInspection === "yes") {
            pdf.setFontSize(9);
            pdf.setTextColor(0, 0, 0);

            // Basic issues
            if (room.seepage) {
              const seepageColor = room.seepage.toLowerCase() === 'yes' ? [200, 0, 0] : [0, 150, 0];
              pdf.setTextColor(...seepageColor);
              pdf.text(`• Seepage: ${room.seepage}`, 20, yPosition);
              yPosition += 3;
            }

            if (room.termites) {
              const termitesColor = room.termites.toLowerCase() === 'yes' ? [200, 0, 0] : [0, 150, 0];
              pdf.setTextColor(...termitesColor);
              pdf.text(`• Termites: ${room.termites}`, 20, yPosition);
              yPosition += 3;
            }

            if (room.otherIssue) {
              const otherColor = room.otherIssue.toLowerCase() === 'yes' ? [200, 0, 0] : [0, 150, 0];
              pdf.setTextColor(...otherColor);
              pdf.text(`• Other Issues: ${room.otherIssue}`, 20, yPosition);
              yPosition += 3;
            }

            // Cleaning Remark
            if (room.cleanRemark) {
              pdf.setTextColor(80, 80, 80);
              pdf.text(`• Cleaning: ${room.cleanRemark}`, 20, yPosition);
              yPosition += 3;
            }

            pdf.setTextColor(0, 0, 0);

            // Room Images
            if (room.images && room.images.length > 0) {
              pdf.text('Images:', 20, yPosition);
              yPosition += 3;

              let imageX = 25;
              const imageWidth = 40;
              const imageHeight = 30;

              for (let i = 0; i < room.images.length; i++) {
                const image = room.images[i];
                
                // Check page space for image (leave space for footer)
                if (yPosition + imageHeight > pageHeight - 20) {
                  pdf.addPage();
                  yPosition = 20;
                  imageX = 25;
                }

                if (image && image.url) {
                  const imageResult = await addImageToPDF(pdf, image.url, imageX, yPosition, imageWidth, imageHeight);
                  if (imageResult.success) {
                    pdf.setFontSize(7);
                    pdf.setTextColor(100, 100, 100);
                    pdf.text(`${i + 1}`, imageX + (imageWidth / 2) - 2, yPosition + imageHeight + 2, { align: 'center' });
                    
                    imageX += imageWidth + 10;
                    pdf.setFontSize(9);
                    
                    // Move to next row if no space
                    if (imageX + imageWidth > pageWidth - 20) {
                      yPosition += imageHeight + 8;
                      imageX = 25;
                      
                      // Check page space after moving to new row
                      if (yPosition > pageHeight - 20) {
                        pdf.addPage();
                        yPosition = 20;
                      }
                    }
                  }
                }
              }

              if (imageX > 25) {
                yPosition += imageHeight + 6;
              }
            }
          }
        }

        // General Remark
        if (room.generalRemark) {
          pdf.setFontSize(9);
          pdf.setTextColor(80, 80, 80);
          const remarkLines = pdf.splitTextToSize(`General Remark: ${room.generalRemark}`, pageWidth - 30);
          pdf.text(remarkLines, 15, yPosition);
          yPosition += (remarkLines.length * 3.5) + 2;
        }

        yPosition += 8;

        // Room separator
        if (roomIndex < selectedInspection.rooms.length - 1) {
          pdf.setDrawColor(220, 220, 220);
          pdf.line(15, yPosition, pageWidth - 15, yPosition);
          yPosition += 8;
        }
      }
    }

    // Footer on all pages - Add footer only if there's enough space
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 15, pageHeight - 10);
    }

    // Save PDF
    const fileName = `${selectedInspection.inspectionType}_Inspection_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    setTimeout(() => setShowDownloadModal(false), 1000);

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF report. Please try again.");
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
          Download comprehensive inspection report with images
        </p>
        
        <div className="d_b">
          <div className="single">
            <h6>Inspection Date</h6>
            <h5>{formatDate(selectedInspection?.updatedAt)}</h5>
          </div>
          <div className="single">
            <h6>Inspected By</h6>
            <h5>{dbUserState?.find(user => user.id === selectedInspection.createdBy)?.fullName || 'N/A'}</h5>
          </div>
        </div>
      </div>

      <div className="modal_body">
        {/* Report Preview */}
        {/* <div className="report_preview" style={{
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
            <p><strong>Includes:</strong> Images, {selectedInspection.inspectionType.toLowerCase() === "full" ? "detailed fixtures" : "basic issues"}</p>
          </div>
        </div> */}

        {/* Download Section */}
        <br />
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
              Generating PDF with Images...
            </h6>
            <p style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px'
            }}>
              This may take a moment as we process all images
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
            {/* <p style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '15px',
              lineHeight: '1.5'
            }}>
              Download professional PDF report with all inspection details and images
            </p> */}
            <button
              onClick={generatePDFReport}
              disabled={isGenerating}
              className="theme_btn btn_fill text-center no_icon w-100"
            >            
              Download {selectedInspection.inspectionType} Report with Images
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DownloadReportModal;