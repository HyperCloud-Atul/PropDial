import { useCollection } from "../../../hooks/useCollection";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";

// components
import Filters from "../../../components/Filters";
import UserList from "../../../components/UserList";

// styles
import "./PGUserList.css";

const userFilter = ["ALL", "ADMIN", "OWNER", "TENANT", "PROPERTYMANAGER", "INACTIVE"];
export default function PGUserList() {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  const { documents, error } = useCollection("users");
  const [filter, setFilter] = useState("ALL");
  // const navigate = useNavigate();

  useEffect(() => {
    let flag = user && user.role === "superadmin";
    if (!flag) {
      logout();
    }
  }, [user]);

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const users = documents
    ? documents.filter((document) => {
      switch (filter) {
        case "ALL":
          return true;
        case "ADMIN":
          return document.role === "admin";
        case "OWNER":
          return (document.role === "owner") || (document.role === "coowner");
        case "TENANT":
          return document.role === "tenant";
        case "PROPERTYMANAGER":
          return document.role === "propertymanager";
        case "INACTIVE":
          return document.status === "inactive";
        default:
          return true;
      }
    })
    : null;

  return (
    <div>
      {/* <h2 className="page-title">User List</h2> */}
      {error && <p className="error">{error}</p>}
      {documents && (
        <Filters
          changeFilter={changeFilter}
          filterList={userFilter}
          filterLength={users.length}
        />
      )}
      {users && <UserList users={users} />}
    </div>
  );
}
