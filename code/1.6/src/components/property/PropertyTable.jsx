import React, { useMemo } from "react";
import ReactTable from "../ReactTable";
import { Link } from "react-router-dom";
import { generateSlug } from "../../utils/generateSlug";

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
        Cell: ({ row }) => {
          const property = row.original;
          const slug = generateSlug(property);

          return (
            <div className="d-flex align-items-center">
              <Link to={`/propertydetails/${slug}`}>
                <span
                  className="material-symbols-outlined click_icon pointer"
                  style={{
                    fontSize: "20px",
                    marginRight: "8px",
                  }}
                >
                  visibility
                </span>
              </Link>
              <Link to={`/updateproperty/${property.id}`}>
                <span
                  className="material-symbols-outlined click_icon pointer"
                  style={{
                    fontSize: "20px",
                    marginRight: "8px",
                  }}
                >
                  border_color
                </span>
              </Link>
            </div>
          );
        },
      },

      {
        Header: "PID",
        accessor: "pid",
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
      },
      {
        Header: "State",
        accessor: "state",
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
      },
      {
        Header: "City",
        accessor: "city",
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
      },

      {
        Header: "Locality",
        accessor: "locality",
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
      },
      {
        Header: "Society",
        accessor: "society",
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
      },
      {
        Header: "Unit No",
        accessor: "unitNumber",
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
      },
      {
        Header: "Type",
        accessor: "category",
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
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
