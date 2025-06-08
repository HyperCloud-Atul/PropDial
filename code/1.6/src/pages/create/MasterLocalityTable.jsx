import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ReactTable from "../../components/ReactTable";

const MasterLocalityTable = ({ filterData }) => {

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "serialNumber",
        Cell: ({ row }) => row.index + 1,
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: "Locality",
        accessor: "locality",
      },    
      {
        Header: "Date",
        disableSortBy: true,
        accessor: "createdAt",
        Cell: ({ value }) => (
          <div className="mobile_min_width">
            {format(value.toDate(), "dd-MMM-yy hh:mm a")}
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
      }, 
        //   {
    //     Header: "Added By",
    //     accessor: "createdBy",
    //     Cell: ({ value }) => (
    //       <div className="mobile_min_width">
    //         {dbUserState &&
    //           dbUserState.find((user) => user.id === value)?.fullName}
    //       </div>
    //     ),
    //   },
    ],
    []
  );
  return (
    <div className="user-single-table table_filter_hide mt-3">
      <ReactTable tableColumns={columns} tableData={filterData} />  
    </div>
  );
};

export default MasterLocalityTable;
