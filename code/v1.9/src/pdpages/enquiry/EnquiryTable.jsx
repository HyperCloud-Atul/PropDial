import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ReactTable from "../../components/ReactTable";
import { format } from "date-fns";
import EnquiryDetailModal from "./EnquiryDetailModal";
import { useAuthContext } from "../../hooks/useAuthContext";

const EnquiryTable = ({ enquiries }) => {
  const { user } = useAuthContext();
  
  // code for open modal for selected enquiry start
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  const handleEnquiryModalClose = () => setShowEnquiryModal(false);
  const handleShowEnquiryModal = (doc) => {
    setSelectedEnquiry(doc);
    setShowEnquiryModal(true);
  };
  // code for open modal for selected enquiry end

  const columns = useMemo(
    () => {
      const baseColumns = [
        {
          Header: "S.No",
          accessor: (row, i) => i + 1,
          id: "serialNumber",
          Cell: ({ row }) => row.index + 1,
          disableFilters: true,
          disableSortBy: true,
        },
        {
          Header: "Action",
          accessor: "id",
          disableFilters: true,
          disableSortBy: true,
          Cell: ({ row }) => (
            <div className="d-flex align-items-center">
              <span
                className="material-symbols-outlined click_icon pointer"
                style={{ fontSize: "20px", marginRight: "8px" }}
                onClick={() => handleShowEnquiryModal(row.original)}
              >
                visibility
              </span>
              {user && (user.role === "admin" || user.role === "superAdmin") && (
                <Link to={`/edit-enquiry/${row.original.id}`}>
                  <span
                    className="material-symbols-outlined click_icon pointer"
                    style={{ fontSize: "20px" }}
                  >
                    border_color
                  </span>
                </Link>
              )}
            </div>
          ),
        },
        {
          Header: "Name",
          accessor: "name",
          disableFilters: true,
        },
        {
          Header: "I Am",
          accessor: "iAm",
          disableFilters: true,
        },
        {
          Header: "Date & Time",
          accessor: "createdAt",
          disableSortBy: true,
          Cell: ({ value }) => format(value.toDate(), "dd-MMM-yy hh:mm a"),
          disableFilters: true,
        },
        {
          Header: "Phone Number",
          disableSortBy: true,
          accessor: "phone",
          Cell: ({ value }) => (
            <div className="phone-number">
              <span>
                {`+${value.slice(0, 2)} ${value
                  .slice(2)
                  .replace(/(\d{5})(\d{5})/, "$1-$2")}`}
              </span>
            </div>
          ),
          disableFilters: true,
        },
      ];

      if (user && user.role === "admin") {
        baseColumns.push({
          Header: "Contact",
          accessor: "actions",
          disableFilters: true,
          Cell: ({ row }) => (
            <div className="contact_btn">
              <Link
                className="whatsapp-icon"
                to={`https://wa.me/+${row.original.phone}`}
                target="_blank"
              >
                <img src="/assets/img/whatsapp_simple.png" alt="WhatsApp" />
              </Link>
              <Link
                className="call-icon"
                to={`tel:+${row.original.phone}`}
                target="_blank"
              >
                <img src="/assets/img/simple_call.png" alt="Call" />
              </Link>
            </div>
          ),
        });
      }

      baseColumns.push(
        {
          Header: "Country",
          accessor: "country",
          disableFilters: true,
        },
        {
          Header: "State",
          accessor: "state",
          disableFilters: true,
        },
        {
          Header: "City",
          accessor: "city",
          disableFilters: true,
        },
        {
          Header: "Description",
          accessor: "description",
          disableSortBy: true,
          disableFilters: true,
        }
      );

      return baseColumns;
    },
    [user]
  );
  return (
    <div className="enquiry_table table_filter_hide">
      <ReactTable tableColumns={columns} tableData={enquiries} />
      <EnquiryDetailModal
        show={showEnquiryModal}
        handleClose={handleEnquiryModalClose}
        selectedEnquiry={selectedEnquiry}
        user={user}
      />
    </div>
  );
};

export default EnquiryTable;
