import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  projectFirestore,
  projectStorage,
  timestamp,
} from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";

// import component
import PropertySummaryCard from "../property/PropertySummaryCard";
import InactiveUserCard from "../../components/InactiveUserCard";
import ScrollToTop from "../../components/ScrollToTop";

const AddInspection = () => {
  const { propertyid, inspectionId } = useParams();
  const [searchParams] = useSearchParams();
  const inspectionType = searchParams.get("type");
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties-propdial",
    propertyid
  );

  const [inspections, setInspections] = useState([
    {
      roomName: "",
      general: "",
      seepage: "",
      termites: "",
      others: "",
      images: [],
      imagePreviews: [], // Keep previews separate for each inspection
      createdAt: timestamp.now(),
    },
  ]);

  const [rooms, setRooms] = useState([]);

  const [existingImageUrls, setExistingImageUrls] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const snapshot = await projectFirestore
          .collection("propertylayouts")
          .where("propertyId", "==", propertyid)
          .get();
        const roomsData = snapshot.docs.map((doc) => doc.data().roomName);
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, [propertyid]);

  useEffect(() => {
    if (inspectionId) {
      const fetchInspection = async () => {
        try {
          const doc = await projectFirestore
            .collection("inspections")
            .doc(inspectionId)
            .get();
          if (doc.exists) {
            const data = doc.data();
            setInspections([
              {
                ...data,
                images: [],
                imagePreviews: [],
                createdAt: data.createdAt,
              },
            ]);
            setExistingImageUrls(data.images || []);
          }
        } catch (error) {
          console.error("Error fetching inspection:", error);
        }
      };
      fetchInspection();
    }
  }, [inspectionId]);

  const handleInspectionChange = (index, field, value) => {
    const updatedInspections = [...inspections];
    updatedInspections[index][field] = value;
    setInspections(updatedInspections);
  };

  const addMoreInspection = () => {
    setInspections([
      ...inspections,
      {
        roomName: "",
        general: "",
        seepage: "",
        termites: "",
        others: "",
        images: [],
        imagePreviews: [],
        createdAt: timestamp.now(),
      },
    ]);
  };

  


  const removeInspection = (index) => {
    const updatedInspections = inspections.filter((_, i) => i !== index);
    setInspections(updatedInspections);
  };

  const handleImageUpload = (index, files) => {
    const newFiles = Array.from(files);
    const updatedInspections = [...inspections];
    const currentImages = updatedInspections[index].images;

    if (currentImages.length + newFiles.length > 3) {
      alert("You can upload a maximum of 3 images per inspection.");
      return;
    }

    updatedInspections[index].images = [...currentImages, ...newFiles];
    updatedInspections[index].imagePreviews = [
      ...updatedInspections[index].imagePreviews,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ];
    setInspections(updatedInspections);
  };

  const handleRemoveImage = (inspectionIndex, imageIndex) => {
    const updatedInspections = [...inspections];
    updatedInspections[inspectionIndex].images.splice(imageIndex, 1);
    updatedInspections[inspectionIndex].imagePreviews.splice(imageIndex, 1);
    setInspections(updatedInspections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const inspectionPromises = inspections.map(async (inspection) => {
        const imageUrls = await Promise.all(
          inspection.images.map(async (file) => {
            const storageRef = projectStorage.ref(
              `inspection/${propertyid}/${file.name}`
            );
            await storageRef.put(file);
            return await storageRef.getDownloadURL();
          })
        );

        return { ...inspection, images: [...imageUrls, ...existingImageUrls] };
      });

      const finalInspections = await Promise.all(inspectionPromises);

      if (inspectionId) {
        await projectFirestore
          .collection("inspections")
          .doc(inspectionId)
          .update({
            propertyId: propertyid,
            inspectionType,
            inspections: finalInspections,
            updatedAt: timestamp.now(),
          });
        alert("Inspection updated successfully!");
      } else {
        await projectFirestore.collection("inspections").add({
          propertyId: propertyid,
          inspectionType,
          inspections: finalInspections,
          createdAt: timestamp.now(),
        });
        alert("Inspection added successfully!");
      }

      navigate(`/inspection/${propertyid}`);
    } catch (error) {
      console.error("Error submitting inspections:", error);
      alert("Failed to save inspections.");
    }
  };

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

                    {/* <div
                    className="theme_btn btn_fill no_icon text-center short_btn"
                    onClick={() => setShowPopup(true)}
                  >
                    Add Inspection
                  </div> */}
                  </div>
                </div>
                <PropertySummaryCard
                  propertydoc={propertydoc}
                  propertyId={propertyid}
                />
              </div>
              <div className="vg22"></div>
              <form className="add_inspection_form">
                {inspections.map((inspection, index) => (
                  <div
                    key={index}
                    className="my_big_card add_doc_form mobile_full_575 "
                  >
                    {/* <h3>Inspection {index + 1}</h3> */}
                    <div className="aai_form">
                      <div className="row row_gap_20">
                        <div className="col-md-12">
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                            }}
                          >
                            <h6
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                                color: "var(--theme-blue)",
                              }}
                            >
                              Room Name*
                            </h6>
                            <select
                              value={inspection.roomName}
                              onChange={(e) =>
                                handleInspectionChange(
                                  index,
                                  "roomName",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Room</option>
                              {rooms.map((room, i) => (
                                <option key={i} value={room}>
                                  {room}
                                </option>
                              ))}
                            </select>
                            {/* <div className="field_box theme_radio_new">
                              <div className="theme_radio_container">
                                {rooms.map((room, i) => (
                                  <div className="radio_single">
                                    <input
                                      type="radio"
                                      name={`roomName-${index}`}
                                      id={room}
                                      value={room}
                                      checked={inspection.roomName === room}
                                      onChange={(e) =>
                                        handleInspectionChange(
                                          index,
                                          "roomName",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label htmlFor={room}>{room}</label>
                                  </div>
                                ))}
                              </div>
                            </div> */}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                            }}
                          >
                            <h6
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                                color: "var(--theme-blue)",
                              }}
                            >
                              General*
                            </h6>

                            <input
                              type="text"
                              placeholder="General"
                              value={inspection.general}
                              onChange={(e) =>
                                handleInspectionChange(
                                  index,
                                  "general",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                            }}
                          >
                            <h6
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                                color: "var(--theme-blue)",
                              }}
                            >
                              Seepage*
                            </h6>
                            <div className="field_box theme_radio_new">
                              <div className="theme_radio_container">
                                <div className="radio_single">
                                  <input
                                    type="radio"
                                    name={`seepage-${index}`}
                                    id="seepage-yes"
                                    value="Yes"
                                    checked={inspection.seepage === "Yes"}
                                    onChange={(e) =>
                                      handleInspectionChange(
                                        index,
                                        "seepage",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label htmlFor="seepage-yes">Yes</label>
                                </div>
                                <div className="radio_single">
                                  <input
                                    type="radio"
                                    name={`seepage-${index}`}
                                    value="No"
                                    id="seepage-no"
                                    checked={inspection.seepage === "No"}
                                    onChange={(e) =>
                                      handleInspectionChange(
                                        index,
                                        "seepage",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label htmlFor="seepage-no">No</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                            }}
                          >
                            <h6
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                                color: "var(--theme-blue)",
                              }}
                            >
                              Termites*
                            </h6>
                            <div className="field_box theme_radio_new">
                              <div className="theme_radio_container">
                                <div className="radio_single">
                                  <input
                                    type="radio"
                                    name={`termites-${index}`}
                                    id="termites-yes"
                                                   value="Yes"
                                    checked={inspection.termites === "Yes"}
                                    onChange={(e) =>
                                      handleInspectionChange(
                                        index,
                                        "termites",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label htmlFor="termites-yes">Yes</label>
                                </div>
                                <div className="radio_single">
                                  <input
                                    type="radio"
                                    name={`termites-${index}`}
                                    value="No"
                                    id="termites-no"
                                    checked={inspection.termites === "No"}
                                    onChange={(e) =>
                                      handleInspectionChange(
                                        index,
                                        "termites",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label htmlFor="termites-no">No</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                            }}
                          >
                            <h6
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                                color: "var(--theme-blue)",
                              }}
                            >
                              Other*
                              
                            </h6>
                            <div className="field_box theme_radio_new">
                              <div className="theme_radio_container">
                                <div className="radio_single">
                                  <input
                                    type="radio"
                                    name={`other-${index}`}
                                    id="other-yes"
                                                   value="Yes"
                                    checked={inspection.other === "Yes"}
                                    onChange={(e) =>
                                      handleInspectionChange(
                                        index,
                                        "other",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label htmlFor="other-yes">Yes</label>
                                </div>
                                <div className="radio_single">
                                  <input
                                    type="radio"
                                    name={`other-${index}`}
                                    value="No"
                                    id="other-no"
                                    checked={inspection.other === "No"}
                                    onChange={(e) =>
                                      handleInspectionChange(
                                        index,
                                        "other",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label htmlFor="other-no">No</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div
                            className="form_field w-100"
                            style={{
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid rgb(3 70 135 / 22%)",
                            }}
                          >
                            <h6
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginBottom: "8px",
                                color: "var(--theme-blue)",
                              }}
                            >
                              Upload Image*
                            </h6>
                            <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {inspection.imagePreviews.map((preview, i) => (
                          <div key={i} style={{ position: "relative" }}>
                            <img
                              src={preview}
                              alt="Preview"
                              style={{ width: "100px", height: "100px" }}
                            />
                            <button
                              type="button"
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                background: "red",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                              }}
                              onClick={() => handleRemoveImage(index, i)}
                            >
                              X
                            </button>
                          </div>
                        ))}

                        {inspection.images.length < 3 && (
                          <button
                            type="button"
                            style={{
                              width: "100px",
                              height: "100px",
                              fontSize: "24px",
                              border: "1px dashed #000",
                              background: "none",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              document
                                .getElementById(`file-input-${index}`)
                                .click()
                            }
                          >
                            +
                          </button>
                        )}

                        <input
                          id={`file-input-${index}`}
                          type="file"
                          multiple
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleImageUpload(index, e.target.files)
                          }
                        />
                      </div>
                          
                          </div>
                        </div>
                      </div>
                    </div>

                 

                    {inspections.length > 1 && (
  <button type="button" onClick={() => removeInspection(index)}>
    Remove
  </button>
)}
                  </div>
                ))}
             
              </form>
              <div className="bottom_fixed_button">
      
        <div className="next_btn_back">
        <button
            className="theme_btn no_icon btn_border full_width"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="theme_btn no_icon btn_fill full_width"
            onClick={addMoreInspection}
          >
          Add More
          </button>         
        
        </div>
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

export default AddInspection;
