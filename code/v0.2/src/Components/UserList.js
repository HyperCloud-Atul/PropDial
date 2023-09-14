import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

// styles
import "./UserList.css";

export default function UserList({ users }) {
  return (
    <div>
      {/* <h4>User List</h4> */}
      {users.length === 0 && <p>No Users Yet!</p>}

      {users.map((userObj) => (
        <Link
          to={`/users/${userObj.id}`}
          key={userObj.id}
          style={{ textDecoration: "none" }}
        >
          <div
            className={
              userObj.status == "inactive"
                ? "user-list-card inactive"
                : "user-list-card"
            }
          >
            <div className="is-user-active-div">
              <div>
                <div className={userObj.online ? "active" : "inactive"}></div>
                <h1>{userObj.online ? "ONLINE" : "OFFLINE"}</h1>
              </div>
              {/* <h2>{formatDistanceToNow(userObj.lastLoginTimestamp, { addSuffix: true })}</h2> */}
              {/* <h2> Last Logined: 26 Apr'23 09:34 pm</h2> */}
            </div>

            <div className="user-list-card-details">
              <div>
                <Avatar src={userObj.photoURL} />
              </div>
              <div className="user-list-card-details-name-div">
                <h1>{userObj.displayName}</h1>
                <div>
                  <h2>{userObj.email}</h2>
                  {/* <h2>aditya@gmail.com</h2> */}
                  <h4>
                    <strong>Role : </strong>
                    {userObj.role}
                  </h4>
                </div>
                <div>
                  {/* <h3>{userObj.phone}</h3> */}
                  <h3>{userObj.phoneNumber}</h3>
                  {/* <h5>Status: {userObj.status}</h5> */}
                  <h5>
                    <strong>Status : </strong>{" "}
                    <span
                      style={{
                        color:
                          userObj.status == "inactive" ? "#ff5757" : "#1ac61a",
                      }}
                    >
                      {" "}
                      {userObj.status}
                    </span>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
