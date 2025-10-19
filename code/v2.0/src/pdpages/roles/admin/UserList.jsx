import React, { useState, useEffect } from "react";
import { useCollection } from "../../../hooks/useCollection";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";
import { useExportToExcel } from "../../../hooks/useExportToExcel";
import { format } from "date-fns";

// import component
import UserSinglecard from "./UserSinglecard";
import UserTable from "./UserTable";

// css import
import "./UserList.scss";

// import filter
import UserFilters from "./UserFilters";
const userFilter = [
  "Admin",
  "Executive",
  "Owner",
  "Tenant",
  "Agent",
  "All",
  "Super Admin",
  "HR",
  "Prospective Tenant",
  "Buyer",
  "Frontdesk",
  "Prospective Buyer",
  "Inactive",
];

const UserList = () => {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  const { documents, error } = useCollection("users-propdial", "", [
    "createdAt",
    "desc",
  ]);
  const [filter, setFilter] = useState("Admin");

  useEffect(() => {
    let flag = user && (user.role === "superAdmin" || user.role === "hr");
    if (!flag) {
      logout();
    }
  }, [user, logout]);

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  // Search input state
  const [searchInput, setSearchInput] = useState("");
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const users = documents
    ? documents.filter((document) => {
        let roleMatch = true;
        let searchMatch = true;
        const rolesArray = document.rolesPropDial || [];
        const primaryRole = document.rolePropDial;

        // Filter by role
        switch (filter) {
          case "All":
            // roleMatch = document.status === "inactive";
            break;
          case "Owner":
            roleMatch =
              primaryRole === "owner" ||
              primaryRole === "coowner" ||
              rolesArray.includes("owner") ||
              rolesArray.includes("coowner");
            break;
          case "Frontdesk":
            roleMatch =
              primaryRole === "frontdesk" || rolesArray.includes("frontdesk");
            break;
          case "Executive":
            roleMatch =
              primaryRole === "executive" || rolesArray.includes("executive");
            break;
          case "Admin":
            roleMatch = primaryRole === "admin" || rolesArray.includes("admin");
            break;
          case "Super Admin":
            roleMatch =
              primaryRole === "superAdmin" || rolesArray.includes("superAdmin");
            break;
          case "Agent":
            roleMatch = primaryRole === "agent" || rolesArray.includes("agent");
            break;
          case "Tenant":
            roleMatch =
              primaryRole === "tenant" || rolesArray.includes("tenant");
            break;
          case "Prospective Tenant":
            roleMatch =
              primaryRole === "prospectiveTenant" ||
              rolesArray.includes("prospectiveTenant");
            break;
          case "Buyer":
            roleMatch = primaryRole === "buyer" || rolesArray.includes("buyer");
            break;
          case "Prospective Buyer":
            roleMatch =
              primaryRole === "prospectiveBuyer" ||
              rolesArray.includes("prospectiveBuyer");
            break;
          case "HR":
            roleMatch = primaryRole === "hr" || rolesArray.includes("hr");
            break;
          case "Inactive":
            roleMatch = document.status === "inactive";
            break;
          default:
            roleMatch = true;
        }

        // Filter by search input
        // console.log("Object: ", Object)
        searchMatch = searchInput
          ? Object.values(document).some(
              (field) =>
                typeof field === "string" &&
                field.toUpperCase().includes(searchInput.toUpperCase())
            )
          : true;

        return roleMatch && searchMatch;
      })
    : null;

  // role wise count start
  const formatCount = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(".0", "")}K+`;
    }
    return num;
  };

  const userCounts = {
    All: 0,
    Owner: 0,
    Frontdesk: 0,
    Executive: 0,
    Admin: 0,
    Agent: 0,
    "Super Admin": 0,
    HR: 0,
    Tenant: 0,
    "Prospective Tenant": 0,
    Buyer: 0,
    "Prospective Buyer": 0,
    Inactive: 0,
  };

  if (documents) {
    documents.forEach((doc) => {
      const status = doc.status;
      const role = doc.rolePropDial;
      const roles = doc.rolesPropDial || [];

      // Inactive
      if (status === "inactive") {
        userCounts.Inactive++;
      }

      if (status === "active") {
        userCounts.All++;

        const allRoles = new Set([role, ...roles]);

        allRoles.forEach((r) => {
          switch (r) {
            case "owner":
            case "coowner":
              userCounts.Owner++;
              break;
            case "frontdesk":
              userCounts.Frontdesk++;
              break;
            case "executive":
              userCounts.Executive++;
              break;
            case "admin":
              userCounts.Admin++;
              break;
            case "superAdmin":
              userCounts["Super Admin"]++;
              break;
            case "agent":
              userCounts.Agent++;
              break;
            case "hr":
              userCounts.HR++;
              break;
            case "tenant":
              userCounts.Tenant++;
              break;
            case "prospectiveTenant":
              userCounts["Prospective Tenant"]++;
              break;
            case "buyer":
              userCounts.Buyer++;
              break;
            case "prospectiveBuyer":
              userCounts["Prospective Buyer"]++;
              break;
            default:
              break;
          }
        });
      }
    });
  }

  // role wise count end

  // card and table view mode functionality start
  const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns

  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };
  // card and table view mode functionality end

  const { exportToExcel, response: res } = useExportToExcel();

  const exportUsers = async () => {
    //create data
    const subsetData = users.map((item) => ({
      Name: item.fullName,
      Mobile: item.phoneNumber,
      Role: item.rolePropDial,
      Status: item.status,
      LastLogin: item.lastLoginTimestamp
        ? format(item.lastLoginTimestamp.toDate(), "dd-MMM-yy hh:mm a")
        : "N/A",
      OnboardedTimestamp: item.createdAt
        ? format(item.createdAt.toDate(), "dd-MMM-yy")
        : "N/A",

      // Add other fields as needed

      // Add other fields as needed
    }));

    let filename = "UserList.xlsx";
    exportToExcel(subsetData, filename);

    // console.log(res)
  };

  return (
    <div className="top_header_pg pg_bg user_pg">
      <div
        className="page_spacing pg_min_height
      "
      >
        <div className="pg_header d-flex justify-content-between">
          <div className="left">
            <h2 className="m22">
              Total: <span className="text_orange">{documents?.length}</span>,
              Filtered: <span className="text_orange">{users?.length}</span>
            </h2>
          </div>
          <div className="right">
            <img
              src="/assets/img/icons/excel_logo.png"
              alt="propdial"
              className="excel_dowanload pointer"
              onClick={exportUsers}
            />
          </div>
        </div>
        <div className="vg12"></div>
        <div className="filters">
          <div className="left">
            <div className="rt_global_search search_field">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <div className="field_icon">
                <span className="material-symbols-outlined">search</span>
              </div>
            </div>
            {/* <span className="r14 light_black">
              ( Filtered users : {users && users.length} )
            </span> */}
          </div>

          <div className="right">
            <div className="user_filters new_inline">
              {documents && (
                <UserFilters
                  changeFilter={changeFilter}
                  filterList={userFilter}
                  filterLength={users.length}
                  roleCounts={userCounts}
                  formatCount={formatCount}
                />
              )}
            </div>
            <div className="button_filter diff_views">
              <div
                className={`bf_single ${
                  viewMode === "card_view" ? "active" : ""
                }`}
                onClick={() => handleModeChange("card_view")}
              >
                <span className="material-symbols-outlined">
                  calendar_view_month
                </span>
              </div>
              <div
                className={`bf_single ${
                  viewMode === "table_view" ? "active" : ""
                }`}
                onClick={() => handleModeChange("table_view")}
              >
                <span className="material-symbols-outlined">view_list</span>
              </div>
            </div>
          </div>
        </div>
        <hr></hr>
        {error && <p className="error">{error}</p>}
        {users && users.length === 0 && (
          <p
            className="text_red medium text-center"
            style={{
              fontSize: "18px",
            }}
          >
            No Users Yet!
          </p>
        )}

        {viewMode === "card_view" && (
          <div className="propdial_users all_tenants">
            {users && <UserSinglecard users={users} />}
          </div>
        )}
        {viewMode === "table_view" && users && (
          <UserTable users={users} filter={filter} />
        )}
      </div>
    </div>
  );
};

export default UserList;
