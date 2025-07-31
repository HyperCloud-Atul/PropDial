import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useFirestore } from "../../../hooks/useFirestore";
import { useAuthContext } from "../../../hooks/useAuthContext";
import UserRoleStatusModal from "./UserRoleStatusModal";
import ReactTable from "../../../components/ReactTable";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import useUserPropertyCounts from "../../../utils/useUserPropertyCounts";
import formatCountry from "../../../utils/formatCountry";
const UserTable = ({ users, filter }) => {
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

const columns = useMemo(() => {
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
      Header: "Name",
      accessor: "fullName",
      disableSortBy: false,
      Cell: ({ row }) => {
        const phone = row.original.phoneNumber;
        const { ownerCount, executiveCount } = useUserPropertyCounts(phone);
        return (
          <div className="pointer mobile_min_width">
            <Link to={`/profiledetails/${phone}`} className="text-capitalize text_light_black">
              {row.original.fullName}
              <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#00a8a8">
                <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
              </svg>
            </Link>
            <div style={{ fontSize: "14px", marginTop: "4px" }}>
              {ownerCount > 0 && (
                <Link to={`/user-properties/${phone}?role=owner`} className="text_green">
                  Properties: {ownerCount}
                </Link>
              )}
              {executiveCount > 0 && (
                <Link to={`/user-properties/${phone}?role=executive`} className="text_green">
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
      disableSortBy: true,
      Cell: ({ row }) => {
        const value = row.original.phoneNumber;
        const countryCode = row.original.countryCode?.toUpperCase();
        try {
          const phoneNumber = parsePhoneNumberFromString(value, countryCode);
          return <div className="phone-number mobile_min_width">{phoneNumber ? phoneNumber.formatInternational() : value}</div>;
        } catch {
          return <div className="phone-number mobile_min_width">{value}</div>;
        }
      },
    },
    {
      Header: "Email",
      accessor: "email",
      disableSortBy: false,
      Cell: ({ value }) => <div className="mobile_min_width">{value}</div>,
    },
    {
      Header: "Contact Options",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row }) => (
        <div className="contact_btn mobile_min_width">
          <Link className="whatsapp-icon" to={`https://wa.me/+${row.original.phoneNumber}`} target="_blank">
            <img src="/assets/img/whatsapp_simple.png" alt="WhatsApp" />
          </Link>
          <Link className="call-icon" to={`tel:+${row.original.phoneNumber}`} target="_blank">
            <img src="/assets/img/simple_call.png" alt="Call" />
          </Link>
        </div>
      ),
    },   
    {
  Header: "City / Country",
  accessor: "city", // You can keep this for sorting/filtering
  disableSortBy: false,
  Cell: ({ row }) => {
    const city = row.original.city;
    const country =
      row.original.residentialCountry || row.original.country;

    const formattedCountry = formatCountry(country);

    return (
      <div className="mobile_min_width">
        {city}
        {city && country && ", "}
        {formattedCountry}
      </div>
    );
  },
}

  ];

  // 👇 Inject extra column at position 2 if filter is Owner
  if (filter === "Owner") {
  baseColumns.splice(2, 0, {
    Header: "Cities Owned",
    accessor: "propertiesOwnedInCities",
    disableSortBy: true,
    Cell: ({ value }) => {
      if (!value || value.length === 0) return <span>-</span>;

      // Join city labels with comma
      const cityNames = value.map(city => city.label).join(", ");

      return (
        <div className="mobile_min_width" style={{ fontSize: "14px" }}>
          {cityNames}
        </div>
      );
    },
  });
}
  return baseColumns;
}, [filter]); // 👈 include filter as dependency

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
