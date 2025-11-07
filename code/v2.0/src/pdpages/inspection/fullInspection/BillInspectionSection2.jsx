import { Link } from "react-router-dom";
import { FaPlus, FaTrash, FaRetweet } from "react-icons/fa";

const BillInspectionSection = ({
  bills,
  selectedBill,
  handleBillTypeClick,
  getBillButtonClass,
  currentBillData,
  getBillFieldClass,
  amount,
  setAmount,
  remark,
  setRemark,
  handleBillImageUpload,
  handleBillImageDelete,
  isFinalSubmitEnabled,
  inspectionDatabaseData,
  setFinalSubmit,
  handleSaveBill,
  isBillDataSaving
}) => (
  <div className="bill_inspection">
    <div className="room-buttons">
      {bills.map((bill) => (
        <BillButton
          key={bill.id}
          bill={bill}
          isActive={selectedBill?.id === bill.id}
          buttonClass={getBillButtonClass(bill)}
          onClick={() => handleBillTypeClick(bill)}
        />
      ))}
    </div>
    <div className="vg22"></div>

    {selectedBill && (
      <div className="bill_fields">
        <BillInfoSection bill={selectedBill} />
        <div className="vg22"></div>

        <form className="add_inspection_form">
          <div className="aai_form">
            <div className="row row_gap_20">
              <BillField
                field="amount"
                label="Due Amount*"
                value={amount}
                onChange={setAmount}
                type="number"
                fieldClass={getBillFieldClass(selectedBill.id, "amount")}
              />

              <BillField
                field="remark"
                label="General Remark*"
                value={remark}
                onChange={setRemark}
                type="textarea"
                fieldClass={getBillFieldClass(selectedBill.id, "remark")}
              />

              <BillImageUpload
                billId={selectedBill.id}
                imageUrl={currentBillData.imageUrl}
                handleBillImageUpload={handleBillImageUpload}
                handleBillImageDelete={handleBillImageDelete}
              />

              {/* Display inspection status for the bill */}
              <div className="col-12">
                <div className="form_field w-100" style={{ padding: "10px", borderRadius: "5px", background: "white" }}>
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
                    Inspection Status
                  </h6>
                  <div className="field_box">
                    <StatusBadge status={currentBillData.inspectionStatus} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <SaveButtons
          isFinalSubmitEnabled={isFinalSubmitEnabled}
          inspectionDatabaseData={inspectionDatabaseData}
          setFinalSubmit={setFinalSubmit}
          handleSave={handleSaveBill}
          isSaving={isBillDataSaving}
          saveText="Save Bill Inspection"
        />
      </div>
    )}
  </div>
);

// Add StatusBadge component to show inspection status
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'full':
        return { label: 'Completed', className: 'status-completed', color: '#00a300' };
      case 'half':
        return { label: 'In Progress', className: 'status-in-progress', color: '#FFC107' };
      case 'notallowed':
        return { label: 'Not Allowed', className: 'status-not-allowed', color: '#dc3545' };
      default:
        return { label: 'Not Started', className: 'status-not-started', color: '#6c757d' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div 
      className={`status-badge ${config.className}`}
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        backgroundColor: `${config.color}15`,
        color: config.color,
        border: `1px solid ${config.color}`,
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      {config.label}
    </div>
  );
};

// Update BillButton to show status-based icons
const BillButton = ({ bill, isActive, buttonClass, onClick }) => (
  <button onClick={onClick} className={buttonClass}>
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
    <div className="room_name">{bill.billType}</div>
  </button>
);

// Rest of the components remain the same...
const BillInfoSection = ({ bill }) => (
  <div className="id_name">
    <div className="idn_single">
      <h6>Bill ID</h6>
      <h5>{bill.billId}</h5>
    </div>
    <div className="idn_single">
      <h6>Authority name</h6>
      <h5>{bill.authorityName}</h5>
    </div>
    {bill.billWebsiteLink && (
      <div className="idn_single" style={{ maxWidth: "200px" }}>
        <h6>Bill Website Link</h6>
        <h5 style={{ fontWeight: "400" }}>
          <Link className="sub_title text_green" target="_blank" to={bill.billWebsiteLink} style={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {bill.billWebsiteLink}
          </Link>
        </h5>
      </div>
    )}
  </div>
);

const BillField = ({ field, label, value, onChange, type, fieldClass }) => (
  <div className="col-xl-3 col-md-6">
    <div className={`form_field w-100 ${fieldClass}`} style={{ padding: "10px", borderRadius: "5px", background: "white" }}>
      <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
        {label}
      </h6>
      <div className="field_box theme_radio_new">
        {type === "textarea" ? (
          <textarea
            className="w-100"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <div className="price_input relative">
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={label}
              className="w-100"
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

const BillImageUpload = ({ billId, imageUrl, handleBillImageUpload, handleBillImageDelete }) => (
  <div className="col-12">
    <div className="form_field w-100" style={{ padding: "10px", borderRadius: "5px", background: "white" }}>
      <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
        Upload bill image if any
      </h6>
      <div className="image_upload_container">
        {imageUrl ? (
          <div className="image_preview">
            <div className="image_container">
              <img src={imageUrl} alt="Bill Preview" />
              <div className="trash_icon">
                <FaTrash size={14} color="red" onClick={() => handleBillImageDelete(billId)} />
              </div>
            </div>
            <div
              onClick={() => document.getElementById(`bill-file-input-${billId}`).click()}
              className="upload_icon"
            >
              <FaRetweet size={24} color="#555" />
              <h6>Replace Image</h6>
            </div>
            <input
              type="file"
              id={`bill-file-input-${billId}`}
              style={{ display: "none" }}
              onChange={(e) => handleBillImageUpload(e, billId)}
            />
          </div>
        ) : (
          <>
            <div
              onClick={() => document.getElementById(`bill-add-file-input-${billId}`).click()}
              className="upload_icon"
            >
              <FaPlus size={24} color="#555" />
              <h6>Add Image</h6>
            </div>
            <input
              type="file"
              id={`bill-add-file-input-${billId}`}
              style={{ display: "none" }}
              onChange={(e) => handleBillImageUpload(e, billId)}
            />
          </>
        )}
      </div>
    </div>
  </div>
);

const SaveButtons = ({ isFinalSubmitEnabled, inspectionDatabaseData, setFinalSubmit, handleSave, isSaving, saveText }) => (
  <div className="bottom_fixed_button" style={{ zIndex: "99999" }}>
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

export default BillInspectionSection;