import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useCommon } from "../../../../hooks/useCommon";
import { useCollection } from "../../../../hooks/useCollection";
// import component
import ReactTable from "../../../../components/ReactTable";
import AgentDetailModal from "./AgentDetailModal";

const AgentTable = ({ agentDoc }) => {
  const { user } = useAuthContext();

  // code for get created by user start
  const { documents: dbUsers, error: dbuserserror } = useCollection(
    "users-propdial",
    ["status", "==", "active"]
  );
  const [dbUserState, setdbUserState] = useState(dbUsers);
  useEffect(() => {
    setdbUserState(dbUsers);
  });
  // code for get created by user end

  // Handle text copy and display "Copied!" indicator start
  const [copiedField, setCopiedField] = useState(null); // Tracks the currently copied field

  // Handle text copy and display "Copied!" indicator
  const handleCopy = (value, uniqueId) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(uniqueId); // Set the copied field
      setTimeout(() => setCopiedField(null), 3333); // Reset after 3 seconds
    });
  };
  // Handle text copy and display "Copied!" indicator end

  const columns = useMemo(() => {
    if (!dbUserState) return []; // Return an empty array if dbUserState is not available

    return [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "serialNumber",
        Cell: ({ row }) => row.index + 1,
        disableFilters: true,
      },
      {
        Header: "Name",
        accessor: "agentName",
      },
      {
        Header: "Phone Number",
        accessor: "agentPhone",
        Cell: ({ value, row }) => {
          const uniqueId = `phone-${row.index}`;
          return (
            <div className="copy_value">
              <div onClick={() => handleCopy(value, uniqueId)}>
                {value.replace(/(\d{2})(\d{5})(\d{5})/, "+$1 $2-$3")}
              </div>
              {copiedField === uniqueId && (
                <div className="copied">Copied!</div>
              )}
            </div>
          );
        },
      },
      {
        Header: "Email",
        accessor: "agentEmail",
        Cell: ({ value, row }) => {
          const uniqueId = `email-${row.index}`;
          return (
            <div className="copy_value">
              <div onClick={() => handleCopy(value, uniqueId)}>{value}</div>
              {copiedField === uniqueId && (
                <div className="copied">Copied!</div>
              )}
            </div>
          );
        },
      },
      {
        Header: "Contact Options",
        accessor: "actions",

        Cell: ({ row }) => (
          <div className="contact_btn mobile_min_width with_three">
            <Link
              className="whatsapp-icon"
              to={`https://wa.me/+${row.original.agentPhone}`}
              target="_blank"
            >
              <img src="/assets/img/whatsapp_simple.png" alt="WhatsApp" />
            </Link>
            {row.original.agentEmail && (
              <Link
                className="call-icon"
                to={`mailto:${row.original.agentEmail}`}
                target="_blank"
              >
                <img src="/assets/img/gmailsimple.png" alt="Call" />
              </Link>
            )}
            <Link
              className="call-icon"
              to={`tel:+${row.original.agentPhone}`}
              target="_blank"
            >
              <img src="/assets/img/simple_call.png" alt="Call" />
            </Link>
          </div>
        ),
      },
      {
        Header: "Company",
        accessor: "agentCompnayName",
      },
      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "State",
        accessor: "state",
      },

      {
        Header: "Added By",
        accessor: "createdBy",
        Cell: ({ value }) => (
          <span className="text-capitalize">
            {dbUserState.find((user) => user.id === value)?.fullName ||
              "Unknown"}
          </span>
        ),
        disableFilters: false,
      },
      {
        Header: "Added At",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <div className="">{format(value.toDate(), "dd-MMM-yy hh:mm a")}</div>
        ),
      },
    ];
  }, [dbUserState, copiedField]);

  return (
    <div className="user-single-table table_filter_hide mt-3">
      <ReactTable tableColumns={columns} tableData={agentDoc} />
    </div>
  );
};

export default AgentTable;
