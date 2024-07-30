import React, { useMemo } from "react";
import ReactTable from "../ReactTable";
import { Link } from "react-router-dom";

const PropertyTable = ({ properties }) => {
  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "serialNumber",
        Cell: ({ row }) => row.index + 1,
        disableFilters: true,
      },
      {
        Header: "Action",
        accessor: "id",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <Link to={`/propertydetails/${row.original.id}`}>
              <span
                class="material-symbols-outlined click_icon pointer"
                style={{
                  fontSize: "20px",
                  marginRight: "8px",
                }}
              >
                visibility
              </span>
            </Link>
            <Link to={`/updateproperty/${row.original.id}`}>
              <span
                class="material-symbols-outlined click_icon pointer"
                style={{
                  fontSize: "20px",
                  marginRight: "8px",
                }}
              >
                border_color
              </span>
            </Link>
          </div>
        ),
      },

      {
        Header: "PID",
        accessor: "pid",
      },

      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "Locality",
        accessor: "locality",
      },
      {
        Header: "Society",
        accessor: "society",
      },
      {
        Header: "Unit No",
        accessor: "unitNumber",
      },
      {
        Header: "Type",
        accessor: "category",
      },
      {
        Header: "Flag",
        accessor: "purpose",
      },
    ],
    []
  );

  return (
    <div className="property_table table_filter_hide">
      <ReactTable tableColumns={columns} tableData={properties} />
    </div>
  );
};

export default PropertyTable;
