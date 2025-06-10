import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from '../../components/ReactTable';
import { format } from 'date-fns';

const EnquiryTable = ({ enquiries }) => {
    const formatPhoneNumber = phoneNumber => {
        const countryCode = phoneNumber.slice(0, 2);
        const mainNumber = phoneNumber.slice(2);
        return `+${countryCode} ${mainNumber.replace(/(\d{5})(\d{5})/, '$1-$2')}`;
    };
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
                Header: 'Name',
                accessor: 'name',
                disableFilters: true,
            },
            {
                Header: 'I Am',
                accessor: 'iAm',
                disableFilters: true,
            },
            {
                Header: 'Date & Time',
                accessor: 'createdAt',
                Cell: ({ value }) => format(value.toDate(), 'dd-MMM-yy hh:mm a'),
                disableFilters: true,
              },
            {
                Header: 'Phone Number',
                accessor: 'phone',
                Cell: ({ value }) => (
                    <div className="phone-number">
                        <span>{formatPhoneNumber(value)}</span>
                    </div>
                ),
                disableFilters: true,
            },
            {
                Header: 'Contact',
                accessor: 'actions',
                disableFilters: true,
                Cell: ({ row }) => (
                  <div className="contact_btn">
                    <Link
                      className="whatsapp-icon"
                      to={`https://wa.me/${row.original.phone}`}
                      target="_blank"
                    >
                      <img src="/assets/img/whatsapp_simple.png" alt="WhatsApp" />
                    </Link>
                    <Link
                      className="call-icon"
                      to={`tel:${row.original.phone}`}
                      target="_blank"
                    >
                      <img src="/assets/img/simple_call.png" alt="Call" />
                    </Link>
                  </div>
                ),
              }, 
              {
                Header: 'Country',
                accessor: 'country',
                disableFilters: true,
            }, 
            {
                Header: 'State',
                accessor: 'state',
                disableFilters: true,
            }, 
            {
                Header: 'City',
                accessor: 'city',
                disableFilters: true,
            }, 
              {
                Header: 'Description',
                accessor: 'description',
                disableFilters: true,
            },  

        ],
        []
    );
    return (
        <div className="enquiry_table table_filter_hide">
            <ReactTable tableColumns={columns} tableData={enquiries} />

        </div>
    )
}

export default EnquiryTable
