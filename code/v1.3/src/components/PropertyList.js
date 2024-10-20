import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import Avatar from "./Avatar";
// import AddBill from '../pages/create/AddBill'
import { useNavigate } from "react-router-dom";

//Date Formatter MMM dd, yyyy
import { format } from "date-fns";

// styles
import "./PropertyList.css";

export default function PropertyList({ properties }) {
  console.log('properties: ', properties)
  const { user } = useAuthContext();

  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <div className="row no-gutters">
          {properties.length === 0 && <p>No Property Yet!</p>}
          {properties.map((property) => (
            <>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="property-status-padding-div">
                  <div
                    className="profile-card-div"
                    style={{ position: "relative" }}
                  >
                    {user && (user.role === "admin" || user.role === "superAdmin") && (
                      <Link to={`/propertyedit/${property.id}`} key={property.id}>
                        <div className={"event-id " + property.category}>
                          <h5>{property.category} </h5>
                        </div>
                        <div
                          className="address-div"
                          style={{ paddingBottom: "5px" }}
                        >
                          <div className="icon">
                            <span
                              className="material-symbols-outlined"
                              style={{ color: "var(--darkgrey-color)" }}
                            >
                              home
                            </span>
                          </div>
                          <div className="address-text">
                            <div
                              style={{
                                textAlign: "left",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <h5 style={{ margin: "0" }}>
                                {property.unitNumber} : {property.society}{" "}
                              </h5>
                              <small style={{ margin: "0" }}>
                                {property.locality} ({property.city})
                              </small>
                            </div>
                            <div className="">
                              <span className="material-symbols-outlined">
                                chevron_right
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="tenant-profile-property-detail">
                          <div className="tenant-profile-property-detail-inner-div">
                            <div>
                              <h1>Onboarding Date</h1>
                              <h2>
                                {format(
                                  property.onboardingDate.toDate(),
                                  "dd MMM, yyyy"
                                )}
                              </h2>
                            </div>
                            <div>
                              <h1>Purpose</h1>
                              <h2>{property.purpose}</h2>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                    {user.role !== "admin" && (
                      <div>
                        <div className={"event-id " + property.category}>
                          <h5>{property.category}</h5>
                        </div>
                        <div
                          className="address-div"
                          style={{ paddingBottom: "5px" }}
                        >
                          <div className="icon">
                            <span
                              className="material-symbols-outlined"
                              style={{ color: "var(--darkgrey-color)" }}
                            >
                              home
                            </span>
                          </div>
                          <div className="address-text">
                            <div
                              style={{
                                textAlign: "left",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <h5 style={{ margin: "0" }}>
                                {property.unitNumber} : {property.society}{" "}
                              </h5>
                              <small style={{ margin: "0" }}>
                                {property.locality} ({property.city})
                              </small>
                            </div>
                            <div className="">
                              <span className="material-symbols-outlined">
                                chevron_right
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="tenant-profile-property-detail">
                          <div className="tenant-profile-property-detail-inner-div">
                            <div>
                              <h1>Onboarding Date</h1>
                              <h2>
                                {format(
                                  property.onboardingDate.toDate(),
                                  "dd MMM, yyyy"
                                )}
                              </h2>
                            </div>
                            <div>
                              <h1>Purpose</h1>
                              <h2>{property.purpose}</h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {
                      user.role === "propertymanager" ?
                        <>
                          <div
                            className="secondary-details-inside-display"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              paddingLeft: "15px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                width: "70%",
                              }}
                            >
                              <div className="secondary-details-inside-display-img">
                                <Avatar src={property.ownerDetails.photoURL} />
                              </div>
                              <div style={{ paddingLeft: "10px" }}>
                                <h5
                                  style={{
                                    textAlign: "center",
                                    padding: "10px 0 0 0",
                                    fontSize: "0.9rem",
                                    fontWeight: "bold",
                                    color: "#444",
                                    margin: "0",
                                  }}
                                >
                                  {property.ownerDetails.displayName} : {property.ownerDetails.phoneNumber}

                                </h5>
                                <h6
                                  style={{
                                    fontSize: "0.8rem",
                                    fontWeight: "normal",
                                    color: "#aaa",
                                  }}
                                >
                                  Property Manager
                                </h6>
                              </div>
                            </div>
                            <div
                              className="property-contact-div"
                              style={{ width: "30%", height: "auto" }}
                            >
                              <a href={"tel:" + property.ownerDetails.phoneNumber}>
                                {/* {console.log("tel:" + ele.phoneNumber)} */}
                                <div style={{ margin: "5px 0" }}>
                                  <span className="material-symbols-outlined">
                                    call
                                  </span>
                                </div>
                              </a>
                              <a href={"https://wa.me/" + property.ownerDetails.phoneNumber}>
                                <div style={{ margin: "5px 0" }}>
                                  <img
                                    src="/assets/img/whatsapp_square_icon.png"
                                    alt=""
                                  />
                                </div>
                              </a>
                            </div>
                          </div>
                        </>
                        : ''
                    }

                    {user && (user.role === "admin" || user.role === "superAdmin") && (
                      <div className="secondary-details-inside-display-btn-div">
                        {/* <button onClick={() => navigate('/addbill', { state: { propertyid: property.id } })}>Add Bill</button> */}
                        {/* <div
                          onClick={() =>
                            navigate("/addbill/" + property.id)
                          }
                        > */}
                        <Link to={`/addbill/${property.id}`} key={property.id}>
                          <div>

                            <h1>Add Bills</h1>
                          </div>
                        </Link>
                        <div
                          onClick={() =>
                            navigate("/adddocument", {
                              state: { propertyid: property.id },
                            })
                          }
                        >
                          <h1>Add Docs</h1>
                        </div>
                        <div
                          onClick={() =>
                            navigate("/addphoto", {
                              state: { propertyid: property.id },
                            })
                          }
                        >
                          <h1>Add Photos</h1>
                        </div>
                        <div>
                          <h1>Reports</h1>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
