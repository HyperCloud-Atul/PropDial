import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { BarLoader } from "react-spinners";
import jsPDF from "jspdf";

const DownloadReportModal = ({
  showDownloadModal,
  setShowDownloadModal,
  selectedInspection
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadType, setDownloadType] = useState("");

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
  const generatePDFReport = async (type = "standard") => {
    if (!selectedInspection) return;

    setIsGenerating(true);
    setDownloadType(type);

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

              // Handle Images - Only for detailed version
              if (type === "detailed" && fixtureData.images && fixtureData.images.length > 0) {
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
              } else if (fixtureData.images && fixtureData.images.length > 0) {
                // For standard version, just show image count
                pdf.setFontSize(9);
                pdf.setTextColor(100, 100, 100);
                pdf.text(`   📷 ${fixtureData.images.length} image(s) attached`, 30, yPosition);
                yPosition += 4;
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
      pdf.text(`• Report Type: ${type === 'detailed' ? 'Detailed' : 'Standard'}`, 100, yPosition + 22);
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
      setDownloadType("");
    }
  };

  // Enhanced UI with better design
  const DownloadOption = ({ icon, title, description, onClick, type }) => (
    <div
      className="download_option"
      onClick={() => !isGenerating && onClick()}
      style={{
        opacity: isGenerating ? 0.6 : 1,
        cursor: isGenerating ? 'not-allowed' : 'pointer',
        border: '2px solid #e0e0e0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '15px',
        transition: 'all 0.3s ease',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)'
      }}
    >
      <div className="option_icon" style={{ marginBottom: '15px' }}>
        {icon}
      </div>
      <div className="option_text">
        <h6 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#0066cc',
          marginBottom: '8px'
        }}>
          {title}
        </h6>
        <p style={{ 
          fontSize: '14px', 
          color: '#666',
          margin: 0,
          lineHeight: '1.4'
        }}>
          {description}
        </p>
      </div>
      {isGenerating && downloadType === type && (
        <div className="option_loader" style={{ marginTop: '15px' }}>
          <BarLoader color="#0066cc" width={80} height={4} />
        </div>
      )}
    </div>
  );

  if (!selectedInspection) return null;

  return (
    <Modal show={showDownloadModal} className="download_report_modal" centered size="lg">
      <div className="modal_header" style={{
        background: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)',
        color: 'white',
        padding: '20px',
        borderBottom: 'none',
        borderRadius: '12px 12px 0 0'
      }}>
        <h5 className="modal_title" style={{
          fontSize: '24px',
          fontWeight: '600',
          margin: 0,
          textAlign: 'center'
        }}>
          📊 Download Inspection Report
        </h5>
        <button 
          className="modal_close_btn"
          onClick={() => !isGenerating && setShowDownloadModal(false)}
          disabled={isGenerating}      
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="modal_body" style={{ padding: '25px' }}>
        <div className="inspection_info" style={{
          background: '#f8f9ff',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '25px',
          border: '1px solid #e0e7ff'
        }}>
          <div className="info_badge" style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '15px',
            flexWrap: 'wrap'
          }}>
            <span className="badge_type" style={{
              background: '#0066cc',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {selectedInspection.inspectionType} Inspection
            </span>
            <span className="badge_status" style={{
              background: selectedInspection.finalSubmit ? '#00a8a8' : '#ffa500',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {selectedInspection.finalSubmit ? '✅ Finalized' : '🟡 In Progress'}
            </span>
          </div>
          <p className="info_description" style={{
            fontSize: '16px',
            color: '#555',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Generate a professional {selectedInspection.inspectionType.toLowerCase()} inspection report with detailed findings and visual documentation.
          </p>
        </div>

        {isGenerating ? (
          <div className="generating_section" style={{
            textAlign: 'center',
            padding: '40px 20px'
          }}>
            <div className="spinner_container" style={{ marginBottom: '20px' }}>
              <div className="spinner_icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="64px"
                  viewBox="0 -960 960 960"
                  width="64px"
                  fill="#0066cc"
                >
                  <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z"/>
                </svg>
              </div>
            </div>
            <h6 className="generating_text" style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#0066cc',
              marginBottom: '10px'
            }}>
              Generating {downloadType === 'detailed' ? 'Detailed' : 'Standard'} PDF Report...
            </h6>
            <p className="generating_subtext" style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px'
            }}>
              Please wait while we compile your professional inspection report
            </p>
            <BarLoader color="#0066cc" width={250} height={5} />
          </div>
        ) : (
          <div className="download_options">
            {/* Regular Inspection - Single Enhanced Option */}
            {selectedInspection.inspectionType === "Regular" && (
              <DownloadOption
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="64px"
                    viewBox="0 -960 960 960"
                    width="64px"
                    fill="#0066cc"
                  >
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                  </svg>
                }
                title="Download Comprehensive Report"
                description="Complete PDF report with all inspection details, high-quality images, and professional formatting"
                onClick={() => generatePDFReport("detailed")}
                type="detailed"
              />
            )}

            {/* Full Inspection - Two Enhanced Options */}
            {selectedInspection.inspectionType === "Full" && (
              <>
                <DownloadOption
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="64px"
                      viewBox="0 -960 960 960"
                      width="64px"
                      fill="#0066cc"
                    >
                      <path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/>
                    </svg>
                  }
                  title="Standard Report"
                  description="Quick professional report with essential inspection details and summary"
                  onClick={() => generatePDFReport("standard")}
                  type="standard"
                />

                <DownloadOption
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="64px"
                      viewBox="0 -960 960 960"
                      width="64px"
                      fill="#0066cc"
                    >
                      <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/>
                    </svg>
                  }
                  title="Detailed Report"
                  description="Comprehensive report with high-resolution images, detailed analysis, and professional layout"
                  onClick={() => generatePDFReport("detailed")}
                  type="detailed"
                />
              </>
            )}
          </div>
        )}
      </div>

      {!isGenerating && (
        <div className="modal_footer" style={{
          background: '#f8f9ff',
          padding: '20px',
          borderTop: '1px solid #e0e7ff',
          borderRadius: '0 0 12px 12px'
        }}>
          <p className="footer_note" style={{
            fontSize: '14px',
            color: '#666',
            textAlign: 'center',
            margin: 0,
            lineHeight: '1.5'
          }}>
            💼 {downloadType === "detailed" 
              ? "Detailed report includes high-quality images, comprehensive analysis, and professional formatting suitable for clients and documentation"
              : "Standard report provides essential inspection details in a clean, professional format"}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default DownloadReportModal;