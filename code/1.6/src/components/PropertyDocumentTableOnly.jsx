import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ReactTable from "./ReactTable";

const PropertyDocumentTableOnly = ({ filterDoc, dbUserState }) => {
  //   const { updateDocument } = useFirestore("users-propdial");

  //   const [selectedUser, setSelectedUser] = useState(null);
  //   const [show, setShow] = useState(false);

  //   const handleClose = () => setShow(false);

  //   const handleShow = userObj => {
  //     setSelectedUser(userObj);
  //     setShow(true);
  //   };

  //   const formatPhoneNumber = phoneNumber => {
  //     const countryCode = phoneNumber.slice(0, 2);
  //     const mainNumber = phoneNumber.slice(2);
  //     return `+${countryCode} ${mainNumber.replace(/(\d{5})(\d{5})/, '$1-$2')}`;
  //   };

  //   const handleEdit = userObj => {
  //     setSelectedUser(userObj);
  //     setShow(true);
  //   };

  //   const handleRoleChange = newRole => {
  //     setSelectedUser(prevUser => ({
  //       ...prevUser,
  //       rolePropDial: newRole,
  //     }));
  //   };

  //   const handleStatusChange = newStatus => {
  //     setSelectedUser(prevUser => ({
  //       ...prevUser,
  //       status: newStatus,
  //     }));
  //   };

  //   const handleSaveChanges = async () => {
  //     if (!selectedUser) return;
  //     try {
  //       const updatedUser = {
  //         ...selectedUser,
  //         updatedAt: new Date(),
  //         updatedBy: user.phoneNumber,
  //       };

  //       await updateDocument(selectedUser.id, updatedUser);
  //       console.log('User role and status updated successfully');
  //       handleClose(); // Close modal after successful update
  //     } catch (error) {
  //       console.error('Error updating user role and status:', error);
  //       // Handle error as needed
  //     }
  //   };

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
        Header: "Doc Name",
        accessor: "idType",
      },
      {
        Header: "Added At",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <div className="mobile_min_width">
            {format(value.toDate(), "dd-MMM-yy hh:mm a")}
          </div>
        ),
      },
      {
        Header: "Added By",
        accessor: "createdBy",
        Cell: ({ value }) => (
          <div className="mobile_min_width">
            {dbUserState &&
              dbUserState.find((user) => user.id === value)?.fullName}
          </div>
        ),
      },
    ],
    []
  );
  return (
    <div className="user-single-table table_filter_hide mt-3">
      <ReactTable tableColumns={columns} tableData={filterDoc} />

      {/* {selectedUser && (
        <UserRoleStatusModal
          show={show}
          handleClose={handleClose}
          selectedUser={selectedUser}
          handleRoleChange={handleRoleChange}
          handleStatusChange={handleStatusChange}
          handleSaveChanges={handleSaveChanges}
        />
      )} */}
    </div>
  );
};

export default PropertyDocumentTableOnly;
