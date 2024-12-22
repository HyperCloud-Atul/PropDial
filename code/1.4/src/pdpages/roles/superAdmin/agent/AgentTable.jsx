import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useAuthContext } from "../../../../hooks/useAuthContext";

// import component
import ReactTable from "../../../../components/ReactTable";
import AgentDetailModal from "./AgentDetailModal";

const AgentTable = ({ agentDoc }) => {
  const { user } = useAuthContext();

  const columns = useMemo(() => [
    {
      Header: "S.No",
      accessor: (row, i) => i + 1,
      id: "serialNumber",
      Cell: ({ row }) => row.index + 1,
      disableFilters: true,
    },  
    {
      Header: "Date",
      accessor: "createdAt",
      Cell: ({ value }) => (
        <div className="mobile_min_width">
          {format(value.toDate(), "dd-MMM-yy hh:mm a")}
        </div>
      ),
    },
  ]);

  return (
    <div className="user-single-table table_filter_hide mt-3">
      <ReactTable tableColumns={columns} tableData={agentDoc} />
    </div>
  );
};

export default AgentTable;
