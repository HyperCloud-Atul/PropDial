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
  return (
   
      <div className="inspection_card_view">
          {inspections && inspections.map((iDoc) => (
        <div className="ic_single" key={iDoc.id}>
          <div className="top">
          
              <h6>{iDoc.inspectionType} Inspection</h6>
             
          
            <div className="icons">
              {/* Download Icon - Only show if finalSubmit is true */}
              {iDoc.finalSubmit && (
                <div onClick={() => handleDownloadReport(iDoc)} className="pointer green2_bg icon_single">
                  <DownloadIcon />
                </div>
              )}
              {/* Edit Icon - Only for executive admin and superadmin */}
              {!iDoc.finalSubmit && (user?.role === "admin" || user?.role === "superAdmin" || isPropertyManager) && (
                <Link
                  to={`/add-inspection/${iDoc.id}`}
                  className="text-decoration-none green_bg icon_single"
                >
                  <ModeEditIcon />
                </Link>
              )}
              {/* View Icon */}
              {iDoc.finalSubmit && (
                <Link
                  to={`/inspection-report/${iDoc.id}`}
                  className="text-decoration-none green_bg icon_single"
                >
                  <VisibilityIcon />
                </Link>
              )}


            </div>
          </div>
          <div className="ic_body">
            <div className="inspected_room">
                 {iDoc.rooms?.length ? (
                      iDoc.rooms.map((room, idx) => (
                        <div className="ir_single" key={idx}>
                          <h6>{room.roomName || "No Room Name"}</h6>
                          {idx < iDoc.rooms.length - 1}
                       <p className={room.inspectionStatus}> 
                        {room.inspectionStatus === "add"
    ? "Not Started"
    : room.inspectionStatus === "half"
    ? "In Progress"
    : room.inspectionStatus === "full"
    ? "Completed"
    : room.inspectionStatus === "notallowed"
    ? "Not Allowed"
    : "Unknown"}</p>
                        </div>
                      ))
                    ) : (
                      <span>Inspection not start</span>                    )}
             
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
   
  );
};

export default InspectionCardView;