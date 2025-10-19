import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ReactTable from "../../components/ReactTable";

const MasterStateTable = ({ filterData, handleEditCard }) => {

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
        Header: "State Name",
        accessor: "state",
            Cell: ({ value, row }) => (
          <div
            onClick={() =>
              handleEditCard(row.original.id, row.original.country, row.original.state, row.original.stateCode, row.original.gstStateCode)
               
            }
            className="text_green pointer"
          >
           {value} <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 -960 960 960" width="12px" fill="#00a8a8"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
          </div>
        ),
      },   
      {
        Header: "State Code",
        accessor: "stateCode",
        disableSortBy: true,
      },
      {
        Header: "GST Code",
        accessor: "gstStateCode",
        disableSortBy: true,
      },
      {
        Header: "Date",
        accessor: "createdAt",
        disableSortBy: true,
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

export default MasterStateTable;
