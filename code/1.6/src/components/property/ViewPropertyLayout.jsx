import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import Gallery from "react-image-gallery";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import PropertySummaryCard from "../../pdpages/property/PropertySummaryCard";
import { ClipLoader } from "react-spinners";

import "./PropertyLayout.scss";

const ViewPropertyLayout = () => {
  const { user } = useAuthContext();
  const { propertyLayoutId } = useParams();
  const [layoutData, setLayoutData] = useState(null);
  const [selectedMainRoom, setSelectedMainRoom] = useState(null);
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAttachmentOn, setIsAttachmentOn] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const [propertyDocument, setPropertyDocument] = useState(null);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (!propertyLayoutId) return;

    const docRef = projectFirestore
      .collection("property-layout-propdial")
      .doc(propertyLayoutId);

    const unsubscribe = docRef.onSnapshot(
      (docSnap) => {
        if (docSnap.exists) {
          const data = docSnap.data();
          setLayoutData(data);
          setAttachments(data.attachments || []);
          if (data.propertyId) {
            setPropertyId(data.propertyId);
          }
        }
      },
      (err) => {
        console.error("Error fetching layout data in real-time:", err);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [propertyLayoutId]);

  useEffect(() => {
    if (!propertyId) return;

    const docRef = projectFirestore
      .collection("properties-propdial")
      .doc(propertyId);

    const unsubscribe = docRef.onSnapshot(
      (docSnap) => {
        if (docSnap.exists) {
          setPropertyDocument(docSnap.data());
        } else {
          console.warn("No property found with this ID");
        }
      },
      (error) => {
        console.error("Error fetching property data:", error);
      }
    );

    return () => unsubscribe();
  }, [propertyId]);

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

  const [expandedCards2, setExpandedCards2] = useState({});

  const handleExpand2 = (i) => {
    setExpandedCards2((prev) => ({
      ...prev,
      [i]: !prev[i],
    }));
  };

  // sexpand more expand less end

  // sexpand more expand less end

  const [expandedCards3, setExpandedCards3] = useState({});

  const handleExpand3 = (roomKey) => {
    setExpandedCards3((prev) => ({
      ...prev,
      [roomKey]: !prev[roomKey],
    }));
  };

  // sexpand more expand less end



  return (
    <div className="top_header_pg pg_bg property_layout_pg">
      <div className="page_spacing pg_min_height">
           {layoutData || layoutData?.layouts ? (
                   <>
                      <div className="row row_reverse_991">
          <div className="col-lg-6">
            <div className="title_card with_title mobile_full_575 mobile_gap h-100">
              <h2 className="text-center">Property Layout</h2>
            </div>
          </div>
          <PropertySummaryCard
            propertydoc={propertyDocument}
            propertyId={propertyId}
          />
        </div>
        {user &&
          user.status === "active" &&
          (user.role === "admin" ||
            user.role === "superAdmin" ||
            user.role === "executive") && (
            <div
              onClick={() => setIsAttachmentOn(!isAttachmentOn)}
              className="property-list-add-property "
            >
              <span className="material-symbols-outlined">
                {isAttachmentOn ? "close" : "edit_square"}
              </span>
            </div>
          )}
        {/* <h2>Layout Details</h2>

        {selectedMainRoom ? (
          <p>
            <strong>Selected Main Room:</strong> {selectedMainRoom}
          </p>
        ) : (
          <p style={{ color: "gray" }}>
            Click on a room to select it as Main Room first
          </p>
        )} */}
        {isAttachmentOn && (
          <div className="bottom_fixed_button">
            <div className="next_btn_back">
              <button
                className="theme_btn no_icon btn_red full_width"
                onClick={() => setIsAttachmentOn(!isAttachmentOn)}
              >
                Cancel
              </button>
              {/* <button
              className="theme_btn no_icon btn_border full_width"
              onClick={handleReset}
            >
              Reset
            </button> */}

              <button
                className="theme_btn no_icon btn_fill full_width"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}

        {attachments.length != 0 && (
          <>
          <div className="vg22"></div>
            <h3 className="m22 mb-4 text-center">Attached Rooms Overview</h3>
            <div className="attachments_card">
              {attachments?.map((item, i) => (
                <div className="attachment_card_single">
                  <div className="attachments_title">
                    <h2>
                      {layoutData.layouts[item.mainRoom].roomName ||
                        item.mainRoom}
                    </h2>
                    {item.attachedRooms.map((roomKey, idx) => {
                      const room = layoutData.layouts[roomKey];
                      return <h2 key={idx}>+ {room.roomName || roomKey}</h2>;
                    })}
                  </div>
                  <div className="tcs_inner">
                    <div className="main_room">
                      <div key={i} className="room_layout_single">
                        <div className="top">
                          <h3>
                            {layoutData.layouts[item.mainRoom].roomName ||
                              item.mainRoom}
                          </h3>
                        </div>

                        {layoutData.layouts[item.mainRoom] && (
                          <div>
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
                            {(() => {
                              const roomKey = item.mainRoom;
                              const roomData = layoutData.layouts[roomKey];
                              const roomType = roomKey
                                .replace(/\d+$/, "")
                                .toLowerCase();

                              const defaultImageMap = {
                                bedroom:
                                  "/assets/img/icons/illustrate_bedroom.jpg",
                                kitchen:
                                  "/assets/img/icons/illustrate_kitchen.jpg",
                                "living room":
                                  "/assets/img/icons/illustrate_livingroom.jpg",
                                bathroom:
                                  "/assets/img/icons/illustrate_bathroom.jpg",
                                "dining room":
                                  "/assets/img/icons/illustrate_dining.jpg",
                                balcony:
                                  "/assets/img/icons/illustrate_balcony.jpg",
                              };

                              const hasRoomImages =
                                roomData.images &&
                                Array.isArray(roomData.images) &&
                                roomData.images.length > 0;

                              const galleryItems = hasRoomImages
                                ? roomData.images.map((img) => ({
                                    original: img.url,
                                    thumbnail: img.url,
                                  }))
                                : [
                                    {
                                      original:
                                        defaultImageMap[roomType] ||
                                        "/assets/img/icons/illustrate_basment.jpg",
                                      thumbnail:
                                        defaultImageMap[roomType] ||
                                        "/assets/img/icons/illustrate_basment.jpg",
                                    },
                                  ];

                              return (
                                <div className="bigimage_container">
                                  <Gallery
                                    items={galleryItems}
                                    showPlayButton={true}
                                    showFullscreenButton={true}
                                  />
                                </div>
                              );
                            })()}
                            <div className="bottom">
                              <div
                                className="show_more_arrow"
                                onClick={() => handleExpand2(i)}
                              >
                                <span className="material-symbols-outlined">
                                  {expandedCards2[i]
                                    ? "keyboard_arrow_up"
                                    : "keyboard_arrow_down"}
                                </span>
                              </div>
                              <div className="detail_box box_bg">
                                <div className="detail_single">
                                  <div className="icon">
                                    <img
                                      src="/assets/img/superarea.png"
                                      alt="img"
                                    />
                                  </div>
                                  <div className="left">
                                    <h6>Carpet Area</h6>
                                    <h5>
                                      {layoutData.layouts[item.mainRoom]
                                        .length &&
                                      layoutData.layouts[item.mainRoom].width
                                        ? `${(
                                            parseFloat(
                                              layoutData.layouts[item.mainRoom]
                                                .length
                                            ) *
                                            parseFloat(
                                              layoutData.layouts[item.mainRoom]
                                                .width
                                            )
                                          ).toFixed(2)} SqFt`
                                        : "Yet to be added"}
                                    </h5>
                                  </div>
                                </div>

                                <div className="detail_single">
                                  <div className="icon">
                                    <img
                                      src="/assets/img/icons/length.png"
                                      alt="img"
                                    />
                                  </div>
                                  <div className="left">
                                    <h6>Length</h6>
                                    <h5>
                                      {layoutData.layouts[item.mainRoom].length
                                        ? `${
                                            layoutData.layouts[item.mainRoom]
                                              .length
                                          } Ft`
                                        : "Yet to be added"}
                                    </h5>
                                  </div>
                                </div>

                                <div className="detail_single">
                                  <div className="icon">
                                    <img
                                      src="/assets/img/icons/width.png"
                                      alt="img"
                                    />
                                  </div>
                                  <div className="left">
                                    <h6>Width</h6>
                                    <h5>
                                      {layoutData.layouts[item.mainRoom].width
                                        ? `${
                                            layoutData.layouts[item.mainRoom]
                                              .width
                                          } Ft`
                                        : "Yet to be added"}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                              {expandedCards2[i] && (
                                <div className="box_bg">
                                  <h6>Flooring Type</h6>
                                  <h5>
                                    {layoutData.layouts[item.mainRoom]
                                      .flooringType || "Yet to be added"}
                                  </h5>
                                </div>
                              )}
                              {expandedCards2[i] && (
                                <div className="box_bg">
                                  <h6>Remark</h6>
                                  <h5>
                                    {layoutData.layouts[item.mainRoom]
                                      .remarks || "Yet to be added"}
                                  </h5>
                                </div>
                              )}
                              {expandedCards2[i] && (
                                <div className="box_bg">
                                  <div className="fixtures">
                                    <h6>Fixtures</h6>
                                    <div className="fixtures_list">
                                      {Array.isArray(
                                        layoutData.layouts[item.mainRoom]
                                          .fixtureBySelect
                                      ) &&
                                      layoutData.layouts[item.mainRoom]
                                        .fixtureBySelect > 0 ? (
                                        layoutData.layouts[
                                          item.mainRoom
                                        ].fixtureBySelect.map((f, i) => (
                                          <div
                                            className="fixture_single"
                                            key={i}
                                          >
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
                        )}
                      </div>
                    </div>

                    <div className="attached_room">
                      <h2>Attached With</h2>
                      <div className="attached_room_inner">
                        {item.attachedRooms.map((roomKey, idx) => {
                          const room = layoutData.layouts[roomKey];
                          return (
                            <div key={idx} className="room_layout_single">
                              <div className="top">
                                <h3>{room.roomName || roomKey}</h3>
                              </div>
                              {room && (
                                <>
                                  {Array.isArray(room.fixtures) && (
                                    <ul>
                                      {room.fixtures.map((f, i) => (
                                        <li key={i}>{f}</li>
                                      ))}
                                    </ul>
                                  )}
                                  {(() => {
                                    const roomType = roomKey
                                      .replace(/\d+$/, "")
                                      .toLowerCase();

                                    const defaultImageMap = {
                                      bedroom:
                                        "/assets/img/icons/illustrate_bedroom.jpg",
                                      kitchen:
                                        "/assets/img/icons/illustrate_kitchen.jpg",
                                      "living room":
                                        "/assets/img/icons/illustrate_livingroom.jpg",
                                      bathroom:
                                        "/assets/img/icons/illustrate_bathroom.jpg",
                                      "dining room":
                                        "/assets/img/icons/illustrate_dining.jpg",
                                      balcony:
                                        "/assets/img/icons/illustrate_balcony.jpg",
                                    };

                                    const hasRoomImages =
                                      room.images &&
                                      Array.isArray(room.images) &&
                                      room.images.length > 0;

                                    const galleryItems = hasRoomImages
                                      ? room.images.map((img) => ({
                                          original: img.url,
                                          thumbnail: img.url,
                                        }))
                                      : [
                                          {
                                            original:
                                              defaultImageMap[roomType] ||
                                              "/assets/img/icons/illustrate_basment.jpg",
                                            thumbnail:
                                              defaultImageMap[roomType] ||
                                              "/assets/img/icons/illustrate_basment.jpg",
                                          },
                                        ];

                                    return (
                                      <div className="bigimage_container">
                                        <Gallery
                                          items={galleryItems}
                                          showPlayButton={true}
                                          showFullscreenButton={true}
                                        />
                                      </div>
                                    );
                                  })()}

                                  <div className="bottom">
                                    <div
                                      className="show_more_arrow"
                                      onClick={() => handleExpand3(roomKey)}
                                    >
                                      <span className="material-symbols-outlined">
                                        {expandedCards3[roomKey]
                                          ? "keyboard_arrow_up"
                                          : "keyboard_arrow_down"}
                                      </span>
                                    </div>
                                    <div className="detail_box box_bg">
                                      {/* Area */}
                                      <div className="detail_single">
                                        <div className="icon">
                                          <img
                                            src="/assets/img/superarea.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="left">
                                          <h6>Carpet Area</h6>
                                          <h5>
                                            {room.length && room.width
                                              ? `${(
                                                  parseFloat(room.length) *
                                                  parseFloat(room.width)
                                                ).toFixed(2)} SqFt`
                                              : "Yet to be added"}
                                          </h5>
                                        </div>
                                      </div>

                                      {/* Length */}
                                      <div className="detail_single">
                                        <div className="icon">
                                          <img
                                            src="/assets/img/icons/length.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="left">
                                          <h6>Length</h6>
                                          <h5>
                                            {room.length
                                              ? `${room.length} Ft`
                                              : "Yet to be added"}
                                          </h5>
                                        </div>
                                      </div>

                                      {/* Width */}
                                      <div className="detail_single">
                                        <div className="icon">
                                          <img
                                            src="/assets/img/icons/width.png"
                                            alt="img"
                                          />
                                        </div>
                                        <div className="left">
                                          <h6>Width</h6>
                                          <h5>
                                            {room.width
                                              ? `${room.width} Ft`
                                              : "Yet to be added"}
                                          </h5>
                                        </div>
                                      </div>
                                    </div>
                                    {expandedCards3[roomKey] && (
                                      <div className="box_bg">
                                        <h6>Flooring Type</h6>
                                        <h5>
                                          {room.flooringType ||
                                            "Yet to be added"}
                                        </h5>
                                      </div>
                                    )}
                                    {expandedCards3[roomKey] && (
                                      <div className="box_bg">
                                        <h6>Remark</h6>
                                        <h5>
                                          {room.remarks || "Yet to be added"}
                                        </h5>
                                      </div>
                                    )}
                                    {expandedCards3[roomKey] && (
                                      <div className="box_bg">
                                        <div className="fixtures">
                                          <h6>Fixtures</h6>
                                          <div className="fixtures_list">
                                            {Array.isArray(
                                              room?.fixtureBySelect
                                            ) &&
                                            room.fixtureBySelect.length > 0 ? (
                                              room.fixtureBySelect.map(
                                                (f, i) => (
                                                  <div
                                                    className="fixture_single"
                                                    key={i}
                                                  >
                                                    {f}
                                                  </div>
                                                )
                                              )
                                            ) : (
                                              <h5>Yet to be added</h5>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {user?.status === "active" &&
                    (user.role === "admin" ||
                      user.role === "superAdmin" ||
                      user.role === "executive") && (
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
                    )}
                </div>
              ))}
            </div>
          </>
        )}
        <hr />
        <h3 className="m22 mb-4 text-center">Room Layout</h3>
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
                  {/* {Array.isArray(roomData.images) &&
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
                    )} */}
                  {(() => {
                    const roomType = roomKey.replace(/\d+$/, "").toLowerCase();

                    const defaultImageMap = {
                      bedroom: "/assets/img/icons/illustrate_bedroom.jpg",
                      kitchen: "/assets/img/icons/illustrate_kitchen.jpg",
                      "living room":
                        "/assets/img/icons/illustrate_livingroom.jpg",
                      bathroom: "/assets/img/icons/illustrate_bathroom.jpg",
                      "dining room": "/assets/img/icons/illustrate_dining.jpg",
                      balcony: "/assets/img/icons/illustrate_balcony.jpg",
                    };

                    const hasRoomImages =
                      Array.isArray(roomData.images) &&
                      roomData.images.length > 0;

                    const galleryItems = hasRoomImages
                      ? roomData.images.map((img) => ({
                          original: img.url,
                          thumbnail: img.url,
                        }))
                      : [
                          {
                            original:
                              defaultImageMap[roomType] ||
                              "/assets/img/icons/illustrate_basment.jpg",
                            thumbnail:
                              defaultImageMap[roomType] ||
                              "/assets/img/icons/illustrate_basment.jpg",
                          },
                        ];

                    return (
                      <div className="bigimage_container">
                        <Gallery
                          items={galleryItems}
                          showFullscreenButton={true}
                          showPlayButton={true}
                        />
                      </div>
                    );
                  })()}
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
                          <h6>Carpet Area</h6>
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
                      </div>
                    )}
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
                   </>
                  ) : (
                    <div className="page_loader">
                      <ClipLoader color="var(--theme-green2)" loading={true} />
                    </div>
                  )}
     
      </div>
    </div>
  );
};

export default ViewPropertyLayout;
