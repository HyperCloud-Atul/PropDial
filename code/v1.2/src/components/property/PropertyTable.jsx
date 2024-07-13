import React, { useMemo } from 'react';
import ReactTable from '../ReactTable';

const PropertyTable = ({ properties }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'S.No',
        accessor: (row, i) => i + 1,
        id: 'serialNumber',
        Cell: ({ row }) => row.index + 1,
        disableFilters: true,
      },
      {
        Header: 'PID',
        accessor: 'pid',    
      },
      
      {
        Header: 'City',
        accessor: 'city',    
      },
      {
        Header: 'Locality',
        accessor: 'locality',    
      },
      {
        Header: 'Society',
        accessor: 'society',    
      },
      {
        Header: 'Unit No',
        accessor: 'unitNumber',    
      },
      {
        Header: 'Type',
        accessor: 'category',    
      },
      {
        Header: 'Flag',
        accessor: 'purpose',    
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
