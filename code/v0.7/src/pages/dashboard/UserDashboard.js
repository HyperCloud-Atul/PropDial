import { useCollection } from "../../hooks/useCollection";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";

// components
import Filters from "../../Components/Filters";
import PropertyList from "../../Components/PropertyList";

// styles
// import './UserDashboard.css'

export default function UserDashboard() {
  // const { user } = useAuthContext()
  // const { logout, isPending } = useLogout()
  // const { documents, error } = useCollection('properties')
  // const [filter, setFilter] = useState('all')
  const navigate = useNavigate();

  const showProfile = () => {
    navigate("/profile");
  };

  return (
    <div>
      <div className="row no-gutters">
        <div
          className="col-lg-12 col-md-12 col-sm-12"
          style={{ padding: "10px" }}
        >
          <div className="auth-form">
            <div>
              <h1>Welcome to Propdial</h1>
              <br />
              <h6>
                We would like to inform you that your account is currently
                undergoing a routine review to ensure compliance with our
                policies and standards.
              </h6>
              <br />
              <h6>
                This process typically takes 3-5 business days. During this
                time, no further action is required from your end.
              </h6>
              <br />
              <h6>
                However, if you have any questions or need assistance, please
                don't hesitate to reach out to our support team at
                support@propdial.com.
              </h6>
              <br />
              <h6>
                We appreciate your patience and cooperation during this review
                process.
              </h6>

              <br />
              <button className="btn" onClick={showProfile}>
                Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
