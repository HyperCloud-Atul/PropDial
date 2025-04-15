import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import Gallery from "react-image-gallery";

import "./PropertyLayout.scss";

const ViewPropertyLayout = () => {
  const { propertyLayoutId } = useParams();
  const [layoutData, setLayoutData] = useState(null);
  const [selectedMainRoom, setSelectedMainRoom] = useState(null);
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAttachmentOn, setIsAttachmentOn] = useState(false);

  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const fetchLayoutData = async () => {
      try {
        const docRef = projectFirestore
          .collection("property-layout-propdial")
          .doc(propertyLayoutId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const data = docSnap.data();
          setLayoutData(data);
          setAttachments(data.attachments || []);
        }
      } catch (err) {
        console.error("Error fetching layout data:", err);
      }
    };

    fetchLayoutData();
  }, [propertyLayoutId]);

  // const handleRoomClick = (roomKey) => {
  //   // Click again on main room to deselect it
  //   if (!selectedMainRoom) {
  //     setSelectedMainRoom(roomKey);
  //   } else if (selectedMainRoom === roomKey) {
  //     // Deselect everything
  //     setSelectedMainRoom(null);
  //     setSelectedAttachments([]);
  //   } else {
  //     const alreadyAttached = selectedAttachments.includes(roomKey);
  //     if (alreadyAttached) {
  //       setSelectedAttachments(selectedAttachments.filter((r) => r !== roomKey));
  //     } else {
  //       setSelectedAttachments([...selectedAttachments, roomKey]);
  //     }
  //   }
  // };

  const handleRoomClick = (roomKey) => {
    const isBathroomOrBalcony =
      roomKey.toLowerCase().includes("bathroom") ||
      roomKey.toLowerCase().includes("balcony");

    if (!selectedMainRoom) {
      // If no main room is selected, only allow selection of non-bathroom/balcony
      if (isBathroomOrBalcony) {
        alert(
          "Please select a main room first before attaching a bathroom or balcony."
        );
        return;
      }
      setSelectedMainRoom(roomKey);
    } else if (selectedMainRoom === roomKey) {
      // Deselect everything if clicking again on the selected main room
      setSelectedMainRoom(null);
      setSelectedAttachments([]);
    } else {
      // Don't allow the main room to be attached again
      if (roomKey === selectedMainRoom) return;

      const alreadyAttached = selectedAttachments.includes(roomKey);
      if (alreadyAttached) {
        setSelectedAttachments(
          selectedAttachments.filter((r) => r !== roomKey)
        );
      } else {
        setSelectedAttachments([...selectedAttachments, roomKey]);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedMainRoom || selectedAttachments.length === 0) {
      alert("Please select a main room and at least one attachment.");
      return;
    }

    const newAttachment = {
      mainRoom: selectedMainRoom,
      attachedRooms: selectedAttachments,
    };

    const updatedAttachments = [...attachments, newAttachment];

    setIsSaving(true);
    try {
      await projectFirestore
        .collection("property-layout-propdial")
        .doc(propertyLayoutId)
        .update({
          attachments: updatedAttachments,
          updatedAt: new Date(),
        });
      setAttachments(updatedAttachments);
      setSelectedMainRoom(null);
      setSelectedAttachments([]);
      alert("Saved successfully!");
    } catch (err) {
      console.error("Error saving:", err);
      alert("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };
  // Get all attached room keys
  const allAttachedRooms = new Set();
  attachments.forEach((a) => {
    allAttachedRooms.add(a.mainRoom);
    a.attachedRooms.forEach((r) => allAttachedRooms.add(r));
  });
  const handleDetach = async (index) => {
    const confirm = window.confirm("Are you sure you want to detach?");
    if (!confirm) return;

    const updated = [...attachments];
    updated.splice(index, 1);

    try {
      await projectFirestore
        .collection("property-layout-propdial")
        .doc(propertyLayoutId)
        .update({
          attachments: updated,
          updatedAt: new Date(),
        });
      setAttachments(updated);
    } catch (err) {
      console.error("Detach error:", err);
      alert("Failed to detach.");
    }
  };

  const handleReset = () => {
    setSelectedMainRoom(null);
    setSelectedAttachments([]);
  };

  // expand more expand less start
  const [expandedCards, setExpandedCards] = useState({});

  const handleExpand = (roomKey) => {
    setExpandedCards((prev) => ({
      ...prev,
      [roomKey]: !prev[roomKey],
    }));
  };

  // sexpand more expand less end

  if (!layoutData || !layoutData.layouts) return <p>Loading layout...</p>;

  return (
    <div className="top_header_pg pg_bg property_layout_pg">
      <div className="page_spacing pg_min_height">
        <h2>Layout Details</h2>

        {selectedMainRoom ? (
          <p>
            <strong>Selected Main Room:</strong> {selectedMainRoom}
          </p>
        ) : (
          <p style={{ color: "gray" }}>
            Click on a room to select it as Main Room first
          </p>
        )}

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Attachment"}
          </button>
        </div>

        <div className="room_layouts">
          {Object.entries(layoutData.layouts)
            .filter(([roomKey]) => !allAttachedRooms.has(roomKey)) // hide attached ones
            .map(([roomKey, roomData], idx) => {
              const isMain = selectedMainRoom === roomKey;
              const isAttached = selectedAttachments.includes(roomKey);

              const borderColor = isMain
                ? "#28a745"
                : isAttached
                ? "#007bff"
                : "#ccc";
              const bgColor = isMain
                ? "#d4edda"
                : isAttached
                ? "#e0f0ff"
                : "#fff";

              return (
                <div
                  key={idx}
                  onClick={() => isAttachmentOn && handleRoomClick(roomKey)}
                  className="room_layout_single"
                  style={{
                    border: `2px solid ${borderColor}`,
                    backgroundColor: bgColor,
                  }}
                >
                  <div className="top">
                    <h3>{roomData.roomName || roomKey}</h3>
                  </div>
                  {Array.isArray(roomData.images) &&
                    roomData.images.length > 0 && (
                      <div className="bigimage_container">
                        <Gallery
                          items={roomData.images.map((img) => ({
                            original: img.url,
                            thumbnail: img.url,
                          }))}
                          showFullscreenButton={true}
                          showPlayButton={true}
                        />
                      </div>
                    )}
                  <div className="bottom">
                    <div
                      className="show_more_arrow"
                      onClick={() => handleExpand(roomKey)}
                    >
                      <span className="material-symbols-outlined">
                        {expandedCards[roomKey]
                          ? "keyboard_arrow_up"
                          : "keyboard_arrow_down"}
                      </span>
                    </div>

                    <div className="detail_box box_bg">
                      {/* Area */}
                      <div className="detail_single">
                        <div className="icon">
                          <img src="/assets/img/superarea.png" alt="img" />
                        </div>
                        <div className="left">
                          <h6>Area</h6>
                          <h5>
                            {roomData.length && roomData.width
                              ? `${(
                                  parseFloat(roomData.length) *
                                  parseFloat(roomData.width)
                                ).toFixed(2)} SqFt`
                              : "Yet to be added"}
                          </h5>
                        </div>
                      </div>

                      {/* Length */}
                      <div className="detail_single">
                        <div className="icon">
                          <img src="/assets/img/icons/length.png" alt="img" />
                        </div>
                        <div className="left">
                          <h6>Length</h6>
                          <h5>
                            {roomData.length
                              ? `${roomData.length} Ft`
                              : "Yet to be added"}
                          </h5>
                        </div>
                      </div>

                      {/* Width */}
                      <div className="detail_single">
                        <div className="icon">
                          <img src="/assets/img/icons/width.png" alt="img" />
                        </div>
                        <div className="left">
                          <h6>Width</h6>
                          <h5>
                            {roomData.width
                              ? `${roomData.width} Ft`
                              : "Yet to be added"}
                          </h5>
                        </div>
                      </div>
                    </div>
                    {expandedCards[roomKey] && (
                    <div className="box_bg">
                      <h6>Flooring Type</h6>
                      <h5>{roomData?.flooringType || "Yet to be added"}</h5>
                    </div>
                    )}
   {expandedCards[roomKey] && (
                    <div className="box_bg">
                      <h6>Remark</h6>
                      <h5>{roomData?.remarks || "Yet to be added"}</h5>
                    </div> )}
                    {expandedCards[roomKey] && (
                    <div className="box_bg">
                      <div className="fixtures">
                        <h6>Fixtures</h6>
                        <div className="fixtures_list">
                          {Array.isArray(roomData?.fixtureBySelect) &&
                          roomData.fixtureBySelect.length > 0 ? (
                            roomData.fixtureBySelect.map((f, i) => (
                              <div className="fixture_single" key={i}>
                                {f}
                              </div>
                            ))
                          ) : (
                            <h5>Yet to be added</h5>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              );
            })}
        </div>

        <h3>Attached Rooms Overview</h3>
        {attachments.length === 0 ? (
          <p>No attachments found.</p>
        ) : (
          attachments.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "10px",
                marginBottom: "20px",
                border: "2px solid #007bff",
                borderRadius: "10px",
                backgroundColor: "#eaf4ff",
              }}
            >
              <h4>Main Room: {item.mainRoom}</h4>
              {layoutData.layouts[item.mainRoom] && (
                <div style={{ marginLeft: "10px" }}>
                  <p>
                    <strong>Size:</strong>{" "}
                    {layoutData.layouts[item.mainRoom].size}
                  </p>
                  {Array.isArray(
                    layoutData.layouts[item.mainRoom].fixtures
                  ) && (
                    <ul>
                      {layoutData.layouts[item.mainRoom].fixtures.map(
                        (f, idx) => (
                          <li key={idx}>{f}</li>
                        )
                      )}
                    </ul>
                  )}
                  {Array.isArray(layoutData.layouts[item.mainRoom].images) && (
                    <div className="bigimage_container">
                      <Gallery
                        items={layoutData.layouts[item.mainRoom].images.map(
                          (img) => ({
                            original: img.url,
                            thumbnail: img.url,
                          })
                        )}
                        showPlayButton={true}
                        showFullscreenButton={true}
                      />
                    </div>
                  )}
                </div>
              )}

              <h5>Attached Rooms:</h5>
              {item.attachedRooms.map((roomKey, idx) => {
                const room = layoutData.layouts[roomKey];
                return (
                  <div
                    key={idx}
                    style={{ marginLeft: "20px", marginBottom: "10px" }}
                  >
                    <strong>{roomKey}</strong>
                    {room && (
                      <>
                        <p>
                          <strong>Size:</strong> {room.size}
                        </p>
                        {Array.isArray(room.fixtures) && (
                          <ul>
                            {room.fixtures.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        )}
                        {Array.isArray(room.images) && (
                          <div className="bigimage_container">
                            <Gallery
                              items={room.images.map((img) => ({
                                original: img.url,
                                thumbnail: img.url,
                              }))}
                              showPlayButton={true}
                              showFullscreenButton={true}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => handleDetach(i)}
                style={{
                  marginTop: "10px",
                  backgroundColor: "red",
                  color: "white",
                  padding: "5px 10px",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Detach
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewPropertyLayout;
