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
import Filters from "../../../components/Filters";
const userFilter = [
  "All",
  "Owner",
  "Frontdesk",
  "Executive",
  "Admin",
  "Agent",
  "Super Admin",
  "HR",
  "Tenant",
  "Prospective Tenant",
  "Buyer",
  "Prospective Buyer",
  "Inactive",
];

const UserList = () => {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  const { documents, error } = useCollection("users-propdial", "", ["createdAt", "desc"]);
  // const { documents: inspections, errors: inspectionsError } = useCollection("propertyinspections",
  //   ["propertyId", "==", propertyId],
  //   ["createdAt", "desc"]);
  const [filter, setFilter] = useState(userFilter[0]);

  useEffect(() => {
    let flag = user && user.role === "superAdmin";
    if (!flag) {
      logout();
    }
  }, [user]);

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

      // Filter by role
      switch (filter) {
        case "All":
          roleMatch =
            document.status === "active";
          break;
        case "Owner":
          roleMatch =
            document.status === "active" &&
            document.rolePropDial === "owner" ||
            document.rolePropDial === "coowner";
          break;
        case "Frontdesk":
          roleMatch = document.status === "active" && document.rolePropDial === "frontdesk";
          break;
        case "Executive":
          roleMatch = document.status === "active" && document.rolePropDial === "executive";
          break;
        case "Admin":
          roleMatch = document.status === "active" && document.rolePropDial === "admin";
          break;
        case "Super Admin":
          roleMatch = document.status === "active" && document.rolePropDial === "superAdmin";
          break;
        case "Agent":
          roleMatch = document.status === "active" && document.rolePropDial === "agent";
          break;
        case "Inactive":
          roleMatch = document.status === "inactive";
          break;
        case "Tenant":
          roleMatch = document.status === "active" && document.rolePropDial === "tenant";
          break;
        case "Prospective Tenant":
          roleMatch = document.status === "active" && document.rolePropDial === "prospectiveTenant";
          break;
        case "Buyer":
          roleMatch = document.status === "active" && document.rolePropDial === "buyer";
          break;
        case "Prospective Buyer":
          roleMatch = document.status === "active" && document.rolePropDial === "prospectiveBuyer";
          break;
        case "HR":
          roleMatch = document.status === "active" && document.rolePropDial === "hr";
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
      LastLogin: format(item.lastLoginTimestamp.toDate(), "dd-MMM-yy hh:mm a"),
      OnboardedTimestamp: format(item.createdAt.toDate(), "dd-MMM-yy"),
      // Add other fields as needed

      // Add other fields as needed
    }));

    let filename = "UserList.xlsx";
    exportToExcel(subsetData, filename);

    // console.log(res)
  };

  return (
    <div className="top_header_pg pg_bg user_pg">
      <div className="page_spacing pg_min_height
      ">
        <div className="pg_header d-flex justify-content-between">
          <div className="left">
            <h2 className="m22">
              User List{" "}
              <span className="r14 light_black">
                ( Application's filtered users : {users && users.length} )
              </span>
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
                <Filters
                  changeFilter={changeFilter}
                  filterList={userFilter}
                  filterLength={users.length}
                />
              )}
            </div>
            <div className="button_filter diff_views">
              <div
                className={`bf_single ${viewMode === "card_view" ? "active" : ""
                  }`}
                onClick={() => handleModeChange("card_view")}
              >
                <span className="material-symbols-outlined">
                  calendar_view_month
                </span>
              </div>
              <div
                className={`bf_single ${viewMode === "table_view" ? "active" : ""
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
        )
        }

        {viewMode === "card_view" && (
          <div className="propdial_users all_tenants">
            {users && <UserSinglecard users={users} />}
          </div>
        )}
        {viewMode === "table_view" && (
          <>{users && <UserTable users={users} />}</>
        )}
      </div>
    </div>
  );
};

export default UserList;
