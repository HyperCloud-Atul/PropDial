import { Link } from "react-router-dom";
// import Avatar from '../components/Avatar'
// import AddBill from '../pages/create/AddBill'
// import { useNavigate } from 'react-router-dom'
import { numberFormat } from "./NumberFormat";

// styles
import "./BillList.css";

// const numberFormat = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "INR",
// });

export default function BillList({ bills }) {
  // console.log('properties: ', properties)

  // const navigate = useNavigate();

  return (
    <>
      {/* <div>Property Bill</div> */}
      <div className="pgbills">
        <div className="container">
          <div className="row no-gutters">
            {bills.length === 0 && <p>No Bills Yet!</p>}
            <div className="row">
              {bills.map((bill) => (
                <>
                  {/* <Link to={`/bills/${bill.id}`} key={bill.id} style={{ textDecoration: 'none' }} > */}

                  <div
                    className="col-lg-4 col-sm-6 col-sm-12"
                    style={{ padding: "10px" }}
                  >
                    <div className="property-status-padding-div">
                      <div
                        className="profile-card-div"
                        style={{ position: "relative" }}
                      >
                        {/* <div className=Name{"event-id " + bill.category}>
                                        <h5>{bill.category}</h5>
                                    </div> */}
                        {bill.status === "pending" && (
                          // <div className={"bill-type"}>
                          <div
                            className={"bill-type " + bill.billType.toLowerCase()}
                          >
                            <h5>{bill.status}</h5>
                          </div>
                        )}
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
                              {/* <h5 style={{ margin: '0' }}>{bill.billTotalAmount}</h5> */}
                              <small style={{ margin: "0" }}>
                                {bill.billSubject}
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
                              <h1>Bill Due Date</h1>
                              <h2>{bill.billDueDate.toDate().toDateString()}</h2>
                            </div>
                            <div>
                              <h1>Pending</h1>
                              <h2>{numberFormat.format(bill.billTotalAmount)}</h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* </Link > */}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
