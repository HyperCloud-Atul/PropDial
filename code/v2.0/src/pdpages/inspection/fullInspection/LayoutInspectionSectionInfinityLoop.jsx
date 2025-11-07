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

  // Prevent form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  // Handle fixture click without form submission
  const handleFixtureClick = (fixtureName) => {
    if (activeFixture === fixtureName) {
      setActiveFixture(null);
    } else {
      setActiveFixture(fixtureName);
    }
  };

  // Check if fixture field is filled
  const isFixtureFieldFilled = (field) => {
    return currentFixtureData[field] && currentFixtureData[field].toString().trim() !== "";
  };

  // Check if fixture has any data
  const hasFixtureData = () => {
    return isFixtureFieldFilled('status') || 
           isFixtureFieldFilled('remark') || 
           (currentFixtureData.images && currentFixtureData.images.length > 0);
  };

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

      {/* Room Level Content - Bill Inspection ki tarah */}
      {activeRoom && (
        <div>
          {/* Room Level Form - Prevent default submission */}
          <form className="add_inspection_form" onSubmit={handleFormSubmit}>
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
                    {/* Fixture Selection Buttons - Bill inspection ke buttons ki tarah */}
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
                              isActive={activeFixture === fixtureName}
                              onClick={() => handleFixtureClick(fixtureName)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}  

                     {/* Fixture Form - Jab fixture select ho to niche hi form open ho */}
          {activeRoom && activeFixture && (
            <>
             
              
              <div className="fixture_form_section">
                <h4 className="text-center mb-4" style={{ color: "var(--theme-blue)" }}>
                  {activeFixture} Inspection
                </h4>
                
                {/* Fixture form - Prevent default submission */}
                <form className="add_inspection_form" onSubmit={handleFormSubmit}>
                  <div className="aai_form">
                    <div className="row row_gap_20">
                      <FixtureField
                        field="status"
                        label="Status*"
                        value={currentFixtureData.status}
                        onChange={(value) => handleFixtureChange(activeRoom, activeFixture, "status", value)}
                        type="select"
                        options={statusOptions}
                        isFilled={isFixtureFieldFilled('status')}
                      />

                      <FixtureField
                        field="remark"
                        label="Remark*"
                        value={currentFixtureData.remark}
                        onChange={(value) => handleFixtureChange(activeRoom, activeFixture, "remark", value)}
                        type="textarea"
                        isFilled={isFixtureFieldFilled('remark')}
                      />

                      <FixtureImageUpload
                        roomId={activeRoom}
                        fixtureName={activeFixture}
                        images={currentFixtureData.images || []}
                        handleImageUpload={handleFixtureImageUpload}
                        handleImageDelete={handleFixtureImageDelete}
                        isFilled={currentFixtureData.images && currentFixtureData.images.length > 0}
                      />
                    </div>
                  </div>
                </form>
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

     

          <SaveButtons
            isFinalSubmitEnabled={isFinalSubmitEnabled}
            inspectionDatabaseData={inspectionDatabaseData}
            setFinalSubmit={setFinalSubmit}
            handleSave={handleSave}
            isSaving={isDataSaving}
            saveText="Save Inspection"
          />
        </div>
      )}
    </>
  );
};

// Helper components for Layout Inspection
const RoomButton = ({ room, isActive, roomClass, onClick }) => (
  <button 
    type="button"
    onClick={onClick} 
    className={roomClass}
  >
    <div className="active_hand">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
        <path d="M412-96q-22 0-41-9t-33-26L48-482l27-28q17-17 41.5-20.5T162-521l126 74v-381q0-15.3 10.29-25.65Q308.58-864 323.79-864t25.71 10.46q10.5 10.46 10.5 25.92V-321l-165-97 199 241q3.55 4.2 8.27 6.6Q407-168 412-168h259.62Q702-168 723-189.15q21-21.15 21-50.85v-348q0-15.3 10.29-25.65Q764.58-624 779.79-624t25.71 10.35Q816-603.3 816-588v348q0 60-42 102T672-96H412Zm100-242Zm-72-118v-228q0-15.3 10.29-25.65Q460.58-720 475.79-720t25.71 10.35Q512-699.3 512-684v228h-72Zm152 0v-179.72q0-15.28 10.29-25.78 10.29-10.5 25.5-10.5t25.71 10.35Q664-651.3 664-636v180h-72Z" />
      </svg>
    </div>
    <div className="icon_text">
   <div className="btn_icon">
        <div className="bi_icon add">
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#3F5E98" strokeWidth="40">
            <path d="M446.67-446.67H200v-66.66h246.67V-760h66.66v246.67H760v66.66H513.33V-200h-66.66v-246.67Z" />
          </svg>
        </div>
        <div className="bi_icon half">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFC107">
            <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
          </svg>
        </div>
        <div className="bi_icon full">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00a300">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </svg>
        </div>
        <div className="bi_icon notallowed">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6262">
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z" />
          </svg>
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

const FixtureButton = ({ fixtureName, roomId, fixtureClass, isActive, onClick }) => (
  <button 
    type="button"
    onClick={onClick} 
    className={fixtureClass}
  >
    <div className="active_hand">
       <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
        <path d="M412-96q-22 0-41-9t-33-26L48-482l27-28q17-17 41.5-20.5T162-521l126 74v-381q0-15.3 10.29-25.65Q308.58-864 323.79-864t25.71 10.46q10.5 10.46 10.5 25.92V-321l-165-97 199 241q3.55 4.2 8.27 6.6Q407-168 412-168h259.62Q702-168 723-189.15q21-21.15 21-50.85v-348q0-15.3 10.29-25.65Q764.58-624 779.79-624t25.71 10.35Q816-603.3 816-588v348q0 60-42 102T672-96H412Zm100-242Zm-72-118v-228q0-15.3 10.29-25.65Q460.58-720 475.79-720t25.71 10.35Q512-699.3 512-684v228h-72Zm152 0v-179.72q0-15.28 10.29-25.78 10.29-10.5 25.5-10.5t25.71 10.35Q664-651.3 664-636v180h-72Z" />
      </svg>
    </div>
    <div className="icon_text">
      <div className="btn_icon">
        <div className="bi_icon add">
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#3F5E98" strokeWidth="40">
            <path d="M446.67-446.67H200v-66.66h246.67V-760h66.66v246.67H760v66.66H513.33V-200h-66.66v-246.67Z" />
          </svg>
        </div>
        <div className="bi_icon half">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFC107">
            <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
          </svg>
        </div>
        <div className="bi_icon full">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00a300">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </svg>
        </div>
        <div className="bi_icon notallowed">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6262">
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z" />
          </svg>
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
  options,
  isFilled
}) => {
  const fieldStyle = {
    padding: "10px", 
    borderRadius: "5px", 
    background: "white",
    border: isFilled ? "1px solid #ddd" : "1px solid var(--theme-red)" // Red border if not filled
  };

  const inputStyle = {
    padding: "8px", 
    borderRadius: "4px", 
    width: "100%"
  };

  return (
    <div className="col-xl-6 col-md-6">
      <div className="form_field w-100" style={fieldStyle}>
        <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
          {label}
        </h6>
        <div className="field_box">
          {type === "select" ? (
            <select
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              style={inputStyle}
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
              style={{
                ...(type === "textarea" ? { minHeight: "104px" } : {}),
              
                borderRadius: "4px",
                width: "100%",
                padding: "8px"
              }}
              placeholder={label}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const FixtureImageUpload = ({ roomId, fixtureName, images, handleImageUpload, handleImageDelete, isFilled }) => {
  const containerStyle = {
    padding: "10px", 
    borderRadius: "5px", 
    background: "white",
    border: isFilled ? "1px solid #ddd" : "1px solid var(--theme-red)" // Red border if no images
  };

  return (
    <div className="col-12">
      <div className="form_field w-100" style={containerStyle}>
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
};

const SaveButtons = ({ isFinalSubmitEnabled, inspectionDatabaseData, setFinalSubmit, handleSave, isSaving, saveText }) => (
  <div className="bottom_fixed_button" style={{ zIndex: "99999" }}>
    <div className="next_btn_back">
      {inspectionDatabaseData &&
        inspectionDatabaseData.layoutInspectionDone &&
        inspectionDatabaseData.allBillInspectionComplete && (
          <button
            type="button"
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
        type="button"
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