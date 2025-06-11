import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import { useDocument } from "../../hooks/useDocument";
import { projectFirestore } from "../../firebase/config";
import { FaTrashAlt } from "react-icons/fa";

const PropertyImages = () => {
  const { propertyId } = useParams();
  const { document: propertyDocument } = useDocument("properties-propdial", propertyId);

  const images = propertyDocument?.images || [];
  const layoutImages = propertyDocument?.layoutImages || {};

  const sectionRefs = useRef({});
  const [activeTab, setActiveTab] = useState("Outdoors");

  const [scrollingByClick, setScrollingByClick] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const navbarHeight = 68;
  const headerTabHeight = 50;
  const offsetTotal = navbarHeight + headerTabHeight + 10;

  const scrollToSection = (sectionName) => {
    const section = sectionRefs.current[sectionName];
    if (section) {
      const yOffset = section.getBoundingClientRect().top + window.scrollY - offsetTotal;
      setScrollingByClick(true);
      setActiveTab(sectionName);
      window.scrollTo({ top: yOffset, behavior: "smooth" });
      setTimeout(() => {
        setScrollingByClick(false);
      }, 800);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollingByClick) return;
      let currentSection = "Outdoors";
      for (const [name, ref] of Object.entries(sectionRefs.current)) {
        const rect = ref.getBoundingClientRect();
        if (rect.top - offsetTotal < 50) {
          currentSection = name;
        }
      }
      setActiveTab(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [propertyDocument, scrollingByClick]);

  const handleDelete = async () => {
    if (!imageToDelete) return;

    try {
      const docRef = projectFirestore.collection("properties-propdial").doc(propertyId);

      if (imageToDelete.type === "images") {
        const updatedImages = [...images];
        updatedImages.splice(imageToDelete.index, 1);
        await docRef.update({ images: updatedImages });
      } else if (imageToDelete.type === "layoutImages") {
        const layoutArray = [...layoutImages[imageToDelete.layoutName]];
        layoutArray.splice(imageToDelete.index, 1);
        const updatedLayoutImages = {
          ...layoutImages,
          [imageToDelete.layoutName]: layoutArray,
        };
        await docRef.update({ layoutImages: updatedLayoutImages });
      }

      setShowConfirm(false);
      setImageToDelete(null);
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  return (
    <div className="top_header_pg pg_bg property_img_page pd_single">
      <ScrollToTop />

      {/* ✅ Fixed Header Tabs */}
      <div
        className="header_tabs"
        style={{
          position: "fixed",
          top: `${navbarHeight}px`,
          left: 0,
          width: "100%",
          background: "#fff",
          zIndex: 1000,
          padding: "10px 15px",
          borderBottom: "2px solid #ddd",
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          height: `${headerTabHeight}px`,
          alignItems: "center",
        }}
      >
        <button
          onClick={() => scrollToSection("Outdoors")}
          style={{
            padding: "10px 15px",
            border: "none",
            borderBottom: activeTab === "Outdoors" ? "3px solid var(--theme-blue)" : "none",
            background: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Outdoors
        </button>

        {Object.keys(layoutImages).map((layoutName) => (
          <button
            key={layoutName}
            onClick={() => scrollToSection(layoutName)}
            style={{
              padding: "10px 15px",
              border: "none",
              borderBottom: activeTab === layoutName ? "3px solid blue" : "none",
              background: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {layoutName}
          </button>
        ))}
      </div>

      <div
        className="page_spacing pg_min_height"
        // style={{ paddingTop: `${navbarHeight + headerTabHeight + 20}px` }}
        style={{
          paddingTop:"68px"
        }}
      >
        {/* ✅ Outdoors */}
        <div
          ref={(el) => (sectionRefs.current["Outdoors"] = el)}
          className="property_card_single mobile_full_card overflow_unset"
          
        >
          <div className="more_detail_card_inner">
            <h2 className="card_title">Outdoors</h2>
            <div
              className="image_gallery_grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(32%, 1fr))",
                gap: "15px",
              }}
            >
              {images.length > 0 ? (
                images.map((url, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={url}
                      alt={`Property Image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        aspectRatio:"1/1",
                        objectFit: "cover",
                      }}
                    />
                    {/* <FaTrashAlt
                      onClick={() =>
                        setImageToDelete({ type: "images", index })
                      }
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "red",
                        background: "#fff",
                        borderRadius: "50%",
                        padding: "5px",
                        cursor: "pointer",
                      }}
                    /> */}
                  </div>
                ))
              ) : (
                <p>No images found for this property.</p>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Layout Sections */}
        {Object.entries(layoutImages).map(([layoutName, images]) => (
          <div
            key={layoutName}
            ref={(el) => (sectionRefs.current[layoutName] = el)}
            className="property_card_single mobile_full_card overflow_unset"
            
          >
            <div className="more_detail_card_inner">
              <h2 className="card_title">{layoutName}</h2>
              <div
                className="image_gallery_grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(32%, 1fr))",
                  gap: "15px",
                }}
              >
                {images.length > 0 ? (
                  images.map((img, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        style={{
                          width: "100%",
                          height: "auto",
                          aspectRatio: "1/1",
                          objectFit: "cover",
                        }}
                      />
                      {/* <FaTrashAlt
                        onClick={() =>
                          setImageToDelete({
                            type: "layoutImages",
                            layoutName,
                            index,
                          })
                        }
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "red",
                          background: "#fff",
                          borderRadius: "50%",
                          padding: "5px",
                          cursor: "pointer",
                        }}
                      /> */}
                    </div>
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Confirmation Modal */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
              maxWidth: "400px",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            }}
          >
            <p>Are you sure you want to delete this image?</p>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={handleDelete} style={{ padding: "8px 16px", background: "red", color: "#fff", border: "none", borderRadius: "4px" }}>
                Yes, Delete
              </button>
              <button onClick={() => setShowConfirm(false)} style={{ padding: "8px 16px", background: "#ccc", border: "none", borderRadius: "4px" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImages;
