import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import SureDelete from "../../sureDelete/SureDelete";


const IssueBasedInspectionSection = ({
  rooms,
  activeIssue,
  setActiveIssue,
  propertyRooms,
  issueTypes,
  addNewRoom,
  removeRoom,
  updateRoom,
  getFixturesForPropertyRoom,
  getRoomStatus,
  handleRoomImageUpload,
  handleRoomImageDelete,
  isFinalSubmitEnabled,
  inspectionDatabaseData,
  setFinalSubmit,
  handleSave,
  isDataSaving,
  handleFinalSubmit,
  finalSubmiting
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Check if room field is filled
  const isRoomFieldFilled = (roomIndex, field) => {
    return rooms[roomIndex]?.[field] && rooms[roomIndex][field].toString().trim() !== "";
  };

  // Get tab class based on status
  const getTabClass = (roomIndex) => {
    const status = getRoomStatus(rooms[roomIndex]);
    let className = "";

    if (roomIndex === activeIssue) {
      className += " active";
    }

    className += ` ${status}`;

    return className;
  };

  // Delete confirmation handlers
const handleDeleteConfirm = async () => {
  if (roomToDelete === null) return;
  
  setIsDeleting(true);
  try {
    await removeRoom(roomToDelete);
    setShowDeleteModal(false);
    setRoomToDelete(null);
  } catch (error) {
    console.error("Error deleting room:", error);
  } finally {
    setIsDeleting(false);
  }
};

const handleDeleteCancel = () => {
  setShowDeleteModal(false);
  setRoomToDelete(null);
};

  return (
    <>
      {/* Rooms Tabs Header */}
      <div className="room-buttons">
        {rooms.map((room, index) => (
          <button
            key={index}
            type="button"
            className={`room-button ${getTabClass(index)}`}
            onClick={() => setActiveIssue(index)}
          >
            <div className="active_hand">
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
                <path d="M412-96q-22 0-41-9t-33-26L48-482l27-28q17-17 41.5-20.5T162-521l126 74v-381q0-15.3 10.29-25.65Q308.58-864 323.79-864t25.71 10.46q10.5 10.46 10.5 25.92V-321l-165-97 199 241q3.55 4.2 8.27 6.6Q407-168 412-168h259.62Q702-168 723-189.15q21-21.15 21-50.85v-348q0-15.3 10.29-25.65Q764.58-624 779.79-624t25.71 10.35Q816-603.3 816-588v348q0 60-42 102T672-96H412Zm100-242Zm-72-118v-228q0-15.3 10.29-25.65Q460.58-720 475.79-720t25.71 10.35Q512-699.3 512-684v228h-72Zm152 0v-179.72q0-15.28 10.29-25.78 10.29-10.5 25.5-10.5t25.71 10.35Q664-651.3 664-636v180h-72Z" />
              </svg>
            </div>
            <div className="icon_text">
              <div className="btn_icon">
                {/* Add Icon */}
                <div className="bi_icon add">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#3F5E98" strokeWidth="40">
                    <path d="M446.67-446.67H200v-66.66h246.67V-760h66.66v246.67H760v66.66H513.33V-200h-66.66v-246.67Z" />
                  </svg>
                </div>
                {/* Half Icon */}
                <div className="bi_icon half">
                  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#FFC107">
                    <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
                  </svg>
                </div>
                {/* Full Icon */}
                <div className="bi_icon full">
                  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#00a300">
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                  </svg>
                </div>
              </div>
              <div className="btn_text">
                <h6 className="add">Start</h6>
                <h6 className="half">In Progress</h6>
                <h6 className="full">Completed</h6>
              </div>
              <div className="room_name">Issue {index + 1}</div>
            </div>

            {/* Remove button for tabs (only show if more than one room) */}
            {rooms.length > 1 && (
              <div
                className="remove_issue"
                onClick={(e) => {
                  e.stopPropagation();
                  setRoomToDelete(index);
                  setShowDeleteModal(true);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="vg22"></div>

      {/* Active Room Form */}
      {rooms.length > 0 && (
        <form className="add_inspection_form" onSubmit={(e) => e.preventDefault()}>
          <div className="aai_form">
            <div className="row row_gap_20">
              {/* Room Selection */}
              <div className="col-xl-6 col-md-6">
                <div
                  className="form_field w-100"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    background: "white",
                    border: isRoomFieldFilled(activeIssue, 'roomId') ? "1px solid #ddd" : "1px solid var(--theme-red)"
                  }}
                >
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
                    Select Room*
                  </h6>
                  <select
                    value={rooms[activeIssue]?.roomId || ""}
                    onChange={(e) => updateRoom(activeIssue, 'roomId', e.target.value)}
                    className="w-100"
                    style={{ padding: "8px", borderRadius: "4px" }}
                  >
                    <option value="">Select Room</option>
                    {propertyRooms.map(room => (
                      <option key={room.id} value={room.id}>
                        {room.roomName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fixture Selection */}
              {rooms[activeIssue]?.roomId && (
                <div className="col-xl-6 col-md-6">
                  <div
                    className="form_field w-100"
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      background: "white",
                      border: isRoomFieldFilled(activeIssue, 'fixture') ? "1px solid #ddd" : "1px solid var(--theme-red)"
                    }}
                  >
                    <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
                      Select Fixture*
                    </h6>
                    <select
                      value={rooms[activeIssue]?.fixture || ""}
                      onChange={(e) => updateRoom(activeIssue, 'fixture', e.target.value)}
                      className="w-100"
                      style={{ padding: "8px", borderRadius: "4px" }}
                    >
                      <option value="">Select Fixture</option>
                      {getFixturesForPropertyRoom(rooms[activeIssue].roomId).map(fixture => (
                        <option key={fixture} value={fixture}>
                          {fixture}
                        </option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Issue Type (only show if fixture is not 'other') */}
              {rooms[activeIssue]?.fixture && rooms[activeIssue]?.fixture !== 'other' && (
                <div className="col-xl-6 col-md-6">
                  <div
                    className="form_field w-100"
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      background: "white",
                      border: isRoomFieldFilled(activeIssue, 'issueType') ? "1px solid #ddd" : "1px solid var(--theme-red)"
                    }}
                  >
                    <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
                      Issue Type*
                    </h6>
                    <select
                      value={rooms[activeIssue]?.issueType || ""}
                      onChange={(e) => updateRoom(activeIssue, 'issueType', e.target.value)}
                      className="w-100"
                      style={{ padding: "8px", borderRadius: "4px" }}
                    >
                      <option value="">Select Issue Type</option>
                      {issueTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Explanation */}
              <div className="col-12">
                <div
                  className="form_field w-100"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    background: "white",
                    border: isRoomFieldFilled(activeIssue, 'explanation') ? "1px solid #ddd" : "1px solid var(--theme-red)"
                  }}
                >
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
                    Explain Issue*
                  </h6>
                  <textarea
                    style={{ minHeight: "104px", borderRadius: "4px", width: "100%", padding: "8px" }}
                    placeholder="Describe the issue in detail..."
                    value={rooms[activeIssue]?.explanation || ""}
                    onChange={(e) => updateRoom(activeIssue, 'explanation', e.target.value)}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="col-12">
                <div
                  className="form_field w-100"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    background: "white",
                    border: rooms[activeIssue]?.images?.length > 0 ? "1px solid #ddd" : "1px solid var(--theme-red)"
                  }}
                >
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
                    Upload images* <span style={{ fontSize: "13px" }}>(A minimum of 1 and a maximum of 10 images can be uploaded.)</span>
                  </h6>
                  <div className="add_and_images">
                    {rooms[activeIssue]?.images?.map((image, imgIndex) => (
                      <div key={imgIndex} className="uploaded_images relative">
                        <img src={image.url} alt="Uploaded" />
                        <div className="trash_icon">
                          <FaTrash size={14} color="red" onClick={() => handleRoomImageDelete(activeIssue, image)} />
                        </div>
                      </div>
                    ))}
                    {(rooms[activeIssue]?.images?.length || 0) < 10 && (
                      <div>
                        <div
                          onClick={() => document.getElementById(`file-input-${activeIssue}`).click()}
                          className="add_icon"
                        >
                          <FaPlus size={24} color="#555" />
                        </div>
                        <input
                          type="file"
                          id={`file-input-${activeIssue}`}
                          style={{ display: "none" }}
                          multiple
                          onChange={(e) => handleRoomImageUpload(e, activeIssue)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Add More Room Button (shown when no rooms exist) */}
      {rooms.length === 0 && (
        <div className="text-center mt-4">
          <button
            type="button"
            className="theme_btn no_icon btn_fill"
            onClick={addNewRoom}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <FaPlus />
            Add First Issue
          </button>
        </div>
      )}

      {/* Single Bottom Fixed Button Container */}
      {rooms.length > 0 && (
        <div className="bottom_fixed_button" style={{ zIndex: "99999" }}>
          <div className="next_btn_back">
            {/* Add New Issue Button - Always Visible */}
            <button
              type="button"
              className="theme_btn no_icon btn_border full_width"
              onClick={addNewRoom}
            >
              Add New
            </button>

            {/* Save Inspection Button - Always Visible */}
            <button
              type="button"
              className={`theme_btn no_icon full_width ${isDataSaving ? "theme_processing_btn" : "btn_fill"}`}
              onClick={handleSave}
              disabled={isDataSaving}
              style={{ opacity: isDataSaving ? "0.5" : "1" }}
            >
              {/* {isDataSaving ? "Saving...." : "Save Inspection"} */}
              Save
            </button>

            {/* Final Submit Button - Only when all issues are complete */}
            {isFinalSubmitEnabled() && (
              <button

                className={`theme_btn no_icon full_width ${finalSubmiting ? "theme_processing_btn2" : "btn_fill2"}`}
                onClick={() => setFinalSubmit(true)}
                disabled={finalSubmiting}
                style={{ opacity: finalSubmiting ? "0.5" : "1" }}
              >
                {/* {finalSubmiting ? "Processing..." : "Final Submit"}  */}
                Final Submit
              </button>
            )}
          </div>
        </div>
      )}

         <SureDelete 
      show={showDeleteModal}
      handleClose={handleDeleteCancel}
      handleDelete={handleDeleteConfirm}
      isDeleting={isDeleting}
    />
    </>
  );
};

export default IssueBasedInspectionSection;