import React from "react";

const RoomButtons = ({
  propertyDocument,
  layouts,
  openField,
  onToggleField,
}) => {
  if (!propertyDocument) return null;

  const roomConfigs = [
    { key: "Bedroom", count: propertyDocument.numberOfBedrooms },
    { key: "Bathroom", count: propertyDocument.numberOfBathrooms },
    { key: "Kitchen", count: propertyDocument.numberOfKitchen },
    { key: "Balcony", count: propertyDocument.numberOfBalcony },
    ...(propertyDocument.additionalRooms || []).map((roomName, index) => ({
      key: roomName,
      count: 1,
      customKey: `AdditionalRoom${index + 1}`,
    })),
    ...(propertyDocument.additionalArea || []).map((areaName, index) => ({
      key: areaName,
      count: 1,
      customKey: `AdditionalArea${index + 1}`,
    })),
    {
      key: "Living & Dining",
      count: propertyDocument.livingAndDining === "Yes" ? 1 : 0,
    },
    {
      key: "Living Area",
      count: propertyDocument.livingArea === "Yes" ? 1 : 0,
    },
    {
      key: "Dining Area",
      count: propertyDocument.diningArea === "Yes" ? 1 : 0,
    },
    {
      key: "Entrance Gallery",
      count: propertyDocument.entranceGallery === "Yes" ? 1 : 0,
    },
    { key: "Passage", count: propertyDocument.passage === "Yes" ? 1 : 0 },
  ];

  return (
    <div className="room-buttons">
      {roomConfigs
        .filter((room) => room.count > 0)
        .map((room) =>
          [...Array(room.count)].map((_, index) => {
            const roomKey = room.customKey || `${room.key}${index + 1}`;
            const displayName = layouts[roomKey]?.roomName
              ? layouts[roomKey]?.roomName
              : room.count === 1
              ? room.key
              : `${room.key} ${index + 1}`;

            return (
              <button
                key={roomKey}
                onClick={() => onToggleField(roomKey)}
                className={`room-button ${
                  openField === roomKey ? "active" : ""
                }`}
              >
                <div className="active_hand">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#FFFFFF"
                  >
                    <path d="M412-96q-22 0-41-9t-33-26L48-482l27-28q17-17 41.5-20.5T162-521l126 74v-381q0-15.3 10.29-25.65Q308.58-864 323.79-864t25.71 10.46q10.5 10.46 10.5 25.92V-321l-165-97 199 241q3.55 4.2 8.27 6.6Q407-168 412-168h259.62Q702-168 723-189.15q21-21.15 21-50.85v-348q0-15.3 10.29-25.65Q764.58-624 779.79-624t25.71 10.35Q816-603.3 816-588v348q0 60-42 102T672-96H412Zm100-242Zm-72-118v-228q0-15.3 10.29-25.65Q460.58-720 475.79-720t25.71 10.35Q512-699.3 512-684v228h-72Zm152 0v-179.72q0-15.28 10.29-25.78 10.29-10.5 25.5-10.5t25.71 10.35Q664-651.3 664-636v180h-72Z" />
                  </svg>
                </div>
                <div className="icon_text">
                  <div className="btn_icon">
                    <div className="bi_icon add">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30px"
                        viewBox="0 -960 960 960"
                        width="30px"
                        fill="#3F5E98"
                        stroke-width="40"
                      >
                        <path d="M446.67-446.67H200v-66.66h246.67V-760h66.66v246.67H760v66.66H513.33V-200h-66.66v-246.67Z" />
                      </svg>
                    </div>
                  </div>
                  <div className="btn_text"></div>
                </div>
                <div className="room_name mt-2">{displayName}</div>
                <div className="room_name_new"></div>
              </button>
            );
          })
        )}
    </div>
  );
};

export default RoomButtons;
