import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useFirestore } from "../../../hooks/useFirestore";
import { useAuthContext } from "../../../hooks/useAuthContext";
import UserRoleStatusModal from "./UserRoleStatusModal";
import ReactTable from "../../../components/ReactTable";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import useUserPropertyCounts from "../../../utils/useUserPropertyCounts";
const UserTable = ({ users }) => {
  const { user } = useAuthContext();
  const { updateDocument } = useFirestore("users-propdial");

  const [selectedUser, setSelectedUser] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (userObj) => {
    setSelectedUser(userObj);
    setShow(true);
  };

  const formatPhoneNumber = (phoneNumber) => {
    const countryCode = phoneNumber.slice(0, 2);
    const mainNumber = phoneNumber.slice(2);
    return `+${countryCode} ${mainNumber.replace(/(\d{5})(\d{5})/, "$1-$2")}`;
  };

  const handleEdit = (userObj) => {
    setSelectedUser(userObj);
    setShow(true);
  };

  const handleRoleChange = (newRole) => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      rolePropDial: newRole,
    }));
  };

  const handleStatusChange = (newStatus) => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      status: newStatus,
    }));
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    try {
      const updatedUser = {
        ...selectedUser,
        updatedAt: new Date(),
        updatedBy: user.phoneNumber,
      };

      await updateDocument(selectedUser.id, updatedUser);
      console.log("User role and status updated successfully");
      handleClose(); // Close modal after successful update
    } catch (error) {
      console.error("Error updating user role and status:", error);
      // Handle error as needed
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "serialNumber",
        Cell: ({ row }) => row.index + 1,
        disableFilters: true,
      },
      // {
      //   Header: 'Name',
      //   accessor: 'fullName',

      //   Cell: ({ row }) => (
      //     <div onClick={() => handleEdit(row.original)} className='pointer mobile_min_width'>
      //       <span className='text-capitalize'>{row.original.fullName}</span>
      //       <span className="material-symbols-outlined click_icon text_near_icon">edit</span>
      //     </div>
      //   ),
      // },

      {
        Header: "Name",
        accessor: "fullName",
        Cell: ({ row }) => {
          const phone = row.original.phoneNumber;
          const { ownerCount, executiveCount } = useUserPropertyCounts(phone); // Hook use karo

          return (
            <div className="pointer mobile_min_width">
              <div className="text-capitalize">{row.original.fullName}</div>
              <div style={{ fontSize: "14px", marginTop: "4px" }}>
                {ownerCount > 0 && (
                  <Link
                    to={`/user-properties/${phone}?role=owner`}
                    className="text_green"
                  >
                    Properties: {ownerCount}
                  </Link>
                )}
                {executiveCount > 0 && (
                  <Link
                    to={`/user-properties/${phone}?role=executive`}
                    className="text_green"
                  >
                    Properties: {executiveCount}
                  </Link>
                )}
              </div>
            </div>
          );
        },
      },

      {
        Header: "Phone Number",
        accessor: "phoneNumber",
        Cell: ({ row }) => {
          const value = row.original.phoneNumber;
          const countryCode = row.original.countryCode?.toUpperCase();

          try {
            const phoneNumber = parsePhoneNumberFromString(value, countryCode);
            return (
              <div className="phone-number mobile_min_width">
                <span>
                  {phoneNumber ? phoneNumber.formatInternational() : value}
                </span>
              </div>
            );
          } catch (error) {
            return (
              <div className="phone-number mobile_min_width">
                <span>{value}</span>
              </div>
            );
          }
        },
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
      },
      {
        Header: "Contact Options",
        accessor: "actions",

        Cell: ({ row }) => (
          <div className="contact_btn mobile_min_width">
            <Link
              className="whatsapp-icon"
              to={`https://wa.me/+${row.original.phoneNumber}`}
              target="_blank"
            >
              <img src="/assets/img/whatsapp_simple.png" alt="WhatsApp" />
            </Link>
            <Link
              className="call-icon"
              to={`tel:+${row.original.phoneNumber}`}
              target="_blank"
            >
              <img src="/assets/img/simple_call.png" alt="Call" />
            </Link>
          </div>
        ),
      },

      {
        Header: "On-Boarded",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <div className="mobile_min_width">
            {format(value.toDate(), "dd-MMM-yy hh:mm a")}
          </div>
        ),
      },
      {
        Header: "Last Login",
        accessor: "lastLoginTimestamp",
        Cell: ({ value }) => (
          <div className="mobile_min_width">
            {format(value.toDate(), "dd-MMM-yy hh:mm a")}
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",

        Cell: ({ value }) => (
          <span
            className={`text-capitalize  ${
              value === "active" ? "text_green2" : "text_red"
            }`}
          >
            {value}
          </span>
        ),
      },
    ],
    []
  );
  return (
    <div className="user-single-table table_filter_hide">
      <ReactTable tableColumns={columns} tableData={users} />

      {selectedUser && (
        <UserRoleStatusModal
          show={show}
          handleClose={handleClose}
          selectedUser={selectedUser}
          handleRoleChange={handleRoleChange}
          handleStatusChange={handleStatusChange}
          handleSaveChanges={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default UserTable;
