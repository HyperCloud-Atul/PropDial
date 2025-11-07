import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

// icons
import DownloadIcon from '@mui/icons-material/Download';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';

const InspectionCardView = ({
  inspections,
  dbUserState,
  handleDownloadReport,
  user,
  isPropertyManager
}) => {

  // Separate inspections based on finalSubmit
  const pendingInspections = inspections?.filter(i => !i.finalSubmit) || [];
  const submittedInspections = inspections?.filter(i => i.finalSubmit) || [];

  // Function to get bill status
  const getBillStatus = (bill) => {
    if (!bill) return "add";

    const hasAmount = bill.amount && bill.amount.trim() !== "";
    const hasRemark = bill.remark && bill.remark.trim() !== "";

    if (hasAmount && hasRemark) {
      return "full";
    } else if (hasAmount || hasRemark) {
      return "half";
    } else {
      return "add";
    }
  };

  // Function to get bill status text
  const getBillStatusText = (status) => {
    switch (status) {
      case "add": return "Not Started";
      case "half": return "In Progress";
      case "full": return "Completed";
      default: return "Unknown";
    }
  };

  return (
    <div className="inspection_card_view_wrapper">

      {/* PENDING INSPECTIONS */}
      <div className="inspection_section">
        <h5 className="section_title mb-3">🕓 Pending Inspections</h5>
        {pendingInspections.length > 0 ? (
          <div className="inspection_card_view pending">
            {pendingInspections.map((iDoc) => (
              <div className="ic_single" key={iDoc.id}>
                <div className="top">
                  <h6>{iDoc.inspectionType} Inspection</h6>
                  <div className="icons">
                    {/* Edit Icon */}
                    {(user?.role === "admin" || user?.role === "superAdmin" || isPropertyManager) && (
                      <Link
                        to={`/add-inspection/${iDoc.id}`}
                        className="text-decoration-none green_bg icon_single"
                      >
                        <ModeEditIcon />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="ic_body">
                  {/* Rooms Section */}
                  <div className="inspected_room mb-3">
                    <h6 className="section_subtitle">Rooms:</h6>
                    {iDoc.rooms?.length ? (
                      iDoc.rooms.map((room, idx) => (
                        <div className="ir_single" key={idx}>
                          <h6>{room.roomName || "No Room Name"}</h6>
                          <p className={room.inspectionStatus}>
                            {room.inspectionStatus === "add"
                              ? "Not Started"
                              : room.inspectionStatus === "half"
                                ? "In Progress"
                                : room.inspectionStatus === "full"
                                  ? "Completed"
                                  : room.inspectionStatus === "notallowed"
                                    ? "Not Allowed"
                                    : "Unknown"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <span>No rooms added</span>
                    )}
                  </div>
                  <hr />
                  {/* Bills Section */}
                  <div className="inspected_room">
                    <h6 className="section_subtitle">Bills:</h6>
                    {iDoc.bills && Object.keys(iDoc.bills).length > 0 ? (
                      Object.entries(iDoc.bills).map(([billId, bill], idx) => (
                        <div className="ir_single" key={billId}>
                          <h6>{bill.billType || "Unknown Bill Type"}</h6>
                          <p className={getBillStatus(bill)}>
                            {getBillStatusText(getBillStatus(bill))}
                          </p>
                        </div>
                      ))
                    ) : (
                      <span>No bills added</span>
                    )}
                  </div>
                </div>

                <div className="ic_footer">
                  <div className="date_single">
                    <strong>At</strong>:{" "}
                    {iDoc.lastUpdatedAt ? (
                      <span>{format(iDoc.lastUpdatedAt.toDate(), "dd-MMM-yy")}</span>
                    ) : (
                      <span>{format(iDoc.createdAt.toDate(), "dd-MMM-yy")}</span>
                    )}
                  </div>
                  <div className="date_single">
                    <strong>By</strong>:{" "}
                    <span>
                      {dbUserState &&
                        dbUserState.find((user) => user.id === iDoc.createdBy)
                          ?.displayName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No pending inspections available.</p>
        )}
      </div>

      {/* SUBMITTED INSPECTIONS */}
      <div className="inspection_section mt-5">
        <h5 className="section_title mb-3">✅ Final Submitted Inspections</h5>
        {submittedInspections.length > 0 ? (
          <div className="inspection_card_view">
            {submittedInspections.map((iDoc) => (
              <div className="ic_single" key={iDoc.id}>
                <div className="top">
                  <h6>{iDoc.inspectionType} Inspection</h6>
                </div>

                <div className="ic_body">
                  {/* Summary for submitted inspections */}
                  {/* <div className="inspection_summary">
                    <div className="summary_item">
                      <strong>Rooms:</strong> 
                      {iDoc.rooms?.length || 0} total
                      {iDoc.rooms?.filter(room => room.inspectionStatus === "full").length && (
                        <span className="text-success">
                          {" "}({iDoc.rooms.filter(room => room.inspectionStatus === "full").length} completed)
                        </span>
                      )}
                    </div>
                    <div className="summary_item ">
                      <strong>Bills:</strong> 
                      {iDoc.bills ? Object.keys(iDoc.bills).length : 0} total
                      {iDoc.bills && (
                        <span className="text-success">
                          {" "}({Object.values(iDoc.bills).filter(bill => getBillStatus(bill) === "full").length} completed)
                        </span>
                      )}
                    </div>
                  </div> */}

                  <div className="row mt-3">
                    <div className="col-6">
                      <div
                        onClick={() => handleDownloadReport(iDoc)}
                        className="theme_btn btn_border text-center w-100 pointer"
                      >
                        Download <DownloadIcon />
                      </div>
                    </div>
                    <div className="col-6">
                      <Link
                        to={`/inspection-report/${iDoc.id}`}
                        className="theme_btn btn_border2 text-center w-100 text-decoration-none d-block"
                      >
                        View <VisibilityIcon />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="ic_footer">
                  <div className="date_single">
                    <strong>At</strong>:{" "}
                    {iDoc.lastUpdatedAt ? (
                      <span>{format(iDoc.lastUpdatedAt.toDate(), "dd-MMM-yy")}</span>
                    ) : (
                      <span>{format(iDoc.createdAt.toDate(), "dd-MMM-yy")}</span>
                    )}
                  </div>
                  <div className="date_single">
                    <strong>By</strong>:{" "}
                    <span>
                      {dbUserState &&
                        dbUserState.find((user) => user.id === iDoc.createdBy)
                          ?.displayName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No final submitted inspections yet.</p>
        )}
      </div>

    </div>
  );
};

export default InspectionCardView;