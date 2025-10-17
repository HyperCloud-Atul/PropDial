import { FaPlus, FaTrash } from "react-icons/fa";

const LayoutInspectionSection = ({
  rooms,
  activeRoom,
  setActiveRoom,
  activeFixture,
  setActiveFixture,
  getRoomClass,
  getFixtureClass,
  inspectionData,
  currentRoomData,
  currentFixtureData,
  handleRoomChange,
  handleFixtureChange,
  handleFixtureImageUpload,
  handleFixtureImageDelete,
  isFinalSubmitEnabled,
  inspectionDatabaseData,
  setFinalSubmit,
  handleSave,
  isDataSaving
}) => {
  const statusOptions = ["Working", "Not Working", "Damaged", "Needs Repair", "Good Condition"];

  return (
    <>
      {/* Room Selection */}
      <div className="room-buttons">
        {rooms.map((room) => (
          <RoomButton
            key={room.id}
            room={room}
            isActive={activeRoom === room.id}
            roomClass={getRoomClass(room.id)}
            onClick={() => {
              setActiveRoom(room.id);
              setActiveFixture(null);
            }}
          />
        ))}
      </div>
      
      <div className="vg22"></div>

      {/* Room Level Form */}
      {activeRoom && !activeFixture && (
        <div>
          <form className="add_inspection_form">
            <div className="aai_form">
              <div className="row row_gap_20">
                <InspectionField
                  field="isAllowForInspection"
                  label="Tenant Allowed for Inspection*"
                  value={currentRoomData.isAllowForInspection}
                  onChange={(value) => handleRoomChange(activeRoom, "isAllowForInspection", value)}
                  type="radio"
                  options={["yes", "no"]}
                />

                {currentRoomData.isAllowForInspection === "yes" && (
                  <>
                    {/* Fixture Selection Buttons */}
                    <div className="col-12">
                      <div className="form_field w-100" style={{ padding: "10px", borderRadius: "5px", background: "white" }}>
                        <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
                          Select Fixture for Inspection*
                        </h6>
                        <div className="room-buttons">
                          {currentRoomData.fixtures && Object.keys(currentRoomData.fixtures).map((fixtureName) => (
                            <FixtureButton
                              key={fixtureName}
                              fixtureName={fixtureName}
                              roomId={activeRoom}
                              fixtureClass={getFixtureClass(activeRoom, fixtureName)}
                              onClick={() => setActiveFixture(fixtureName)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <InspectionField
                  field="generalRemark"
                  label={`General Remark${currentRoomData.isAllowForInspection === "yes" ? "" : "*"}`}
                  value={currentRoomData.generalRemark}
                  onChange={(value) => handleRoomChange(activeRoom, "generalRemark", value)}
                  type="textarea"
                />
              </div>
            </div>
          </form>
          
          {currentRoomData.isAllowForInspection === "yes" && (
            <SaveButtons
              isFinalSubmitEnabled={isFinalSubmitEnabled}
              inspectionDatabaseData={inspectionDatabaseData}
              setFinalSubmit={setFinalSubmit}
              handleSave={handleSave}
              isSaving={isDataSaving}
              saveText="Save Room Inspection"
            />
          )}
        </div>
      )}

      {/* Fixture Level Form */}
      {activeRoom && activeFixture && (
        <div>
          <div className="back_button_section">
            <button 
              className="theme_btn no_icon btn_border"
              onClick={() => setActiveFixture(null)}
            >
              ← Back to {currentRoomData.roomName}
            </button>
          </div>
          
          <div className="vg22"></div>

          <form className="add_inspection_form">
            <div className="aai_form">
              <div className="row row_gap_20">
                <FixtureField
                  field="status"
                  label="Status*"
                  value={currentFixtureData.status}
                  onChange={(value) => handleFixtureChange(activeRoom, activeFixture, "status", value)}
                  type="select"
                  options={statusOptions}
                />

                <FixtureField
                  field="remark"
                  label="Remark*"
                  value={currentFixtureData.remark}
                  onChange={(value) => handleFixtureChange(activeRoom, activeFixture, "remark", value)}
                  type="textarea"
                />

                <FixtureImageUpload
                  roomId={activeRoom}
                  fixtureName={activeFixture}
                  images={currentFixtureData.images || []}
                  handleImageUpload={handleFixtureImageUpload}
                  handleImageDelete={handleFixtureImageDelete}
                />
              </div>
            </div>
          </form>

          <SaveButtons
            isFinalSubmitEnabled={isFinalSubmitEnabled}
            inspectionDatabaseData={inspectionDatabaseData}
            setFinalSubmit={setFinalSubmit}
            handleSave={handleSave}
            isSaving={isDataSaving}
            saveText="Save Fixture Inspection"
          />
        </div>
      )}
    </>
  );
};

// Helper components for Layout Inspection
const RoomButton = ({ room, isActive, roomClass, onClick }) => (
  <button onClick={onClick} className={roomClass}>
    <div className="active_hand">
      <img src="/img1" alt="" />
    </div>
    <div className="icon_text">
      <div className="btn_icon">
        <div className="bi_icon add">
          <img src="/img1" alt="" />
        </div>
        <div className="bi_icon half">
          <img src="/img1" alt="" />
        </div>
        <div className="bi_icon full">
          <img src="/img1" alt="" />
        </div>
        <div className="bi_icon notallowed">
          <img src="/img1" alt="" />
        </div>
      </div>
      <div className="btn_text">
        <h6 className="add">Start</h6>
        <h6 className="half">In Progress</h6>
        <h6 className="full">Completed</h6>
        <h6 className="notallowed">Not Allowed</h6>
      </div>
    </div>
    <div className="room_name">{room.roomName}</div>
  </button>
);

const FixtureButton = ({ fixtureName, roomId, fixtureClass, onClick }) => (
  <button onClick={onClick} className={fixtureClass}>
    <div className="active_hand">
      <img src="/img1" alt="" />
    </div>
    <div className="icon_text">
      <div className="btn_icon">
        <div className="bi_icon add">
          <img src="/img1" alt="" />
        </div>
        <div className="bi_icon half">
          <img src="/img1" alt="" />
        </div>
        <div className="bi_icon full">
          <img src="/img1" alt="" />
        </div>
      </div>
      <div className="btn_text">
        <h6 className="add">Start</h6>
        <h6 className="half">In Progress</h6>
        <h6 className="full">Completed</h6>
      </div>
    </div>
    <div className="room_name">{fixtureName}</div>
  </button>
);

const InspectionField = ({
  field,
  label,
  value,
  onChange,
  type,
  options
}) => {
  return (
    <div className="col-xl-6 col-md-6">
      <div className="form_field w-100" style={{ padding: "10px", borderRadius: "5px", background: "white" }}>
        <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
          {label}
        </h6>
        <div className="field_box theme_radio_new">
          {type === "radio" ? (
            <div className="theme_radio_container">
              {options.map(option => (
                <div key={option} className="radio_single">
                  <input
                    type="radio"
                    name={`${field}-${option}`}
                    id={`${field}-${option}`}
                    value={option}
                    checked={value === option}
                    onChange={(e) => onChange(e.target.value)}
                  />
                  <label htmlFor={`${field}-${option}`}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <textarea
              style={type === "textarea" ? { minHeight: "104px" } : {}}
              placeholder={label}
              value={value || ""}
              className="w-100"
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const FixtureField = ({
  field,
  label,
  value,
  onChange,
  type,
  options
}) => {
  return (
    <div className="col-xl-6 col-md-6">
      <div className="form_field w-100" style={{ padding: "10px", borderRadius: "5px", background: "white" }}>
        <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
          {label}
        </h6>
        <div className="field_box">
          {type === "select" ? (
            <select
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-100"
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            >
              <option value="">Select Status</option>
              {options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <textarea
              style={type === "textarea" ? { minHeight: "104px" } : {}}
              placeholder={label}
              value={value || ""}
              className="w-100"
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const FixtureImageUpload = ({ roomId, fixtureName, images, handleImageUpload, handleImageDelete }) => (
  <div className="col-12">
    <div className="form_field w-100" style={{ padding: "10px", borderRadius: "5px", background: "white" }}>
      <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
        Upload images* <span style={{ fontSize: "13px" }}>(A minimum of 1 and a maximum of 10 images can be uploaded.)</span>
      </h6>
      <div className="add_and_images">
        {images.map((image, index) => (
          <div key={index} className="uploaded_images relative">
            <img src={image.url} alt="Uploaded" />
            <div className="trash_icon">
              <FaTrash size={14} color="red" onClick={() => handleImageDelete(roomId, fixtureName, image)} />
            </div>
          </div>
        ))}
        {(images.length || 0) < 10 && (
          <div>
            <div
              onClick={() => document.getElementById(`file-input-${roomId}-${fixtureName}`).click()}
              className="add_icon"
            >
              <FaPlus size={24} color="#555" />
            </div>
            <input
              type="file"
              id={`file-input-${roomId}-${fixtureName}`}
              style={{ display: "none" }}
              multiple
              onChange={(e) => handleImageUpload(e, roomId, fixtureName)}
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

const SaveButtons = ({ isFinalSubmitEnabled, inspectionDatabaseData, setFinalSubmit, handleSave, isSaving, saveText }) => (
  <div className="bottom_fixed_button" style={{ zIndex: "1000" }}>
    <div className="next_btn_back">
      {inspectionDatabaseData &&
        inspectionDatabaseData.layoutInspectionDone &&
        inspectionDatabaseData.allBillInspectionComplete && (
          <button
            className="theme_btn no_icon btn_fill2 full_width"
            onClick={() => setFinalSubmit(true)}
            disabled={!isFinalSubmitEnabled()}
            style={{
              opacity: !isFinalSubmitEnabled() ? 0.3 : 1,
              cursor: !isFinalSubmitEnabled() ? "not-allowed" : "pointer",
            }}
          >
            Final Submit
          </button>
        )}

      <button
        className="theme_btn no_icon btn_fill full_width"
        onClick={handleSave}
        disabled={isSaving}
        style={{ opacity: isSaving ? "0.5" : "1" }}
      >
        {isSaving ? "Saving...." : saveText}
      </button>
    </div>
  </div>
);

export default LayoutInspectionSection;