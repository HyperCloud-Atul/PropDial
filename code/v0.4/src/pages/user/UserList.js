import React from "react";
import { useState } from "react";

// component
import LeftSidebar from "../../Components/LeftSidebar";

// style
import "./UserList.css";

const UserList = () => {


// switch 
const [toggleFlag, setToggleFlag] = useState(false);
const [userlist, setUserlist] = useState("owner"); //Residential/Commercial
const toggleBtnClick = () => {
  if (toggleFlag) setUserlist("owner");
  else setUserlist("tenant");

  setToggleFlag(!toggleFlag);
};
// switch 


  return (
    <div className="pgadmindasboard pgls_mobile aflbg">
      <div className="dashboard_pg pg_width">
        <div className="sidebarwidth">
          <LeftSidebar />
        </div>
        <div className="right_main_content">
          <br />
          <h2 className="pg_title">USER List</h2>
          <hr />
          <div
            className="row no-gutters"
            style={{ margin: "10px 0px ", height: "50px", background: "white" }}
          >
            <div
              className="col-md-6 col-sm-12 d-flex "
              style={{
                alignItems: "center",
                height: "50px",
              }}
            >
              <div
                className="residential-commercial-switch"
                style={{ top: "0" }}
              >
                <span
                  className={toggleFlag ? "" : "active"}
                  style={{ color: "var(--theme-blue)" }}
                >
                  Owner
                </span>
                <div
                  className={
                    toggleFlag
                      ? "toggle-switch on commercial"
                      : "toggle-switch off residential"
                  }
                  style={{ padding: "0 10px" }}
                >
                  {/* <small>{toggleFlag ? 'On' : 'Off'}</small> */}
                  <div onClick={toggleBtnClick}>
                    <div></div>
                  </div>
                </div>
                <span
                  className={toggleFlag ? "active" : ""}
                  style={{ color: "var(--theme-orange)" }}
                >
                  Tenant
                </span>
              </div>
            </div>
            <div
              className="col-md-6 col-sm-12 d-flex"
              style={{
                alignItems: "center",
                height: "50px",
              }}
            ></div>
          </div>
          <div className="userlist">
            <div className="single_user">
              <div className="left">
                <div className="user_img">
                  <img src="./assets/img/user.png" alt="" />
                </div>
              </div>
              <div className="right">
                <h5>Sanskar Solanki</h5>
                <h6>8770534650</h6>
                <h6>Ujjain, India</h6>
                <div className="wc">
                  <img
                    src="./assets/img/whatsapp.png"
                    className="pointer"
                    alt=""
                  />
                  <img
                    src="./assets/img/phone-call.png"
                    className="pointer"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="single_user">
              <div className="left">
                <div className="user_img">
                  <img src="./assets/img/user.png" alt="" />
                </div>
              </div>
              <div className="right">
                <h5>Sanskar Solanki</h5>
                <h6>8770534650</h6>
                <h6>Ujjain, India</h6>
                <div className="wc">
                  <img
                    src="./assets/img/whatsapp.png"
                    className="pointer"
                    alt=""
                  />
                  <img
                    src="./assets/img/phone-call.png"
                    className="pointer"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="single_user">
              <div className="left">
                <div className="user_img">
                  <img src="./assets/img/user.png" alt="" />
                </div>
              </div>
              <div className="right">
                <h5>Sanskar Solanki</h5>
                <h6>8770534650</h6>
                <h6>Ujjain, India</h6>
                <div className="wc">
                  <img
                    src="./assets/img/whatsapp.png"
                    className="pointer"
                    alt=""
                  />
                  <img
                    src="./assets/img/phone-call.png"
                    className="pointer"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="single_user">
              <div className="left">
                <div className="user_img">
                  <img src="./assets/img/user.png" alt="" />
                </div>
              </div>
              <div className="right">
                <h5>Sanskar Solanki</h5>
                <h6>8770534650</h6>
                <h6>Ujjain, India</h6>
                <div className="wc">
                  <img
                    src="./assets/img/whatsapp.png"
                    className="pointer"
                    alt=""
                  />
                  <img
                    src="./assets/img/phone-call.png"
                    className="pointer"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="single_user">
              <div className="left">
                <div className="user_img">
                  <img src="./assets/img/user.png" alt="" />
                </div>
              </div>
              <div className="right">
                <h5>Sanskar Solanki</h5>
                <h6>8770534650</h6>
                <h6>Ujjain, India</h6>
                <div className="wc">
                  <img
                    src="./assets/img/whatsapp.png"
                    className="pointer"
                    alt=""
                  />
                  <img
                    src="./assets/img/phone-call.png"
                    className="pointer"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="single_user">
              <div className="left">
                <div className="user_img">
                  <img src="./assets/img/user.png" alt="" />
                </div>
              </div>
              <div className="right">
                <h5>Sanskar Solanki</h5>
                <h6>8770534650</h6>
                <h6>Ujjain, India</h6>
                <div className="wc">
                  <img
                    src="./assets/img/whatsapp.png"
                    className="pointer"
                    alt=""
                  />
                  <img
                    src="./assets/img/phone-call.png"
                    className="pointer"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="single_user">
              <div className="left">
                <div className="user_img">
                  <img src="./assets/img/user.png" alt="" />
                </div>
              </div>
              <div className="right">
                <h5>Sanskar Solanki</h5>
                <h6>8770534650</h6>
                <h6>Ujjain, India</h6>
                <div className="wc">
                  <img
                    src="./assets/img/whatsapp.png"
                    className="pointer"
                    alt=""
                  />
                  <img
                    src="./assets/img/phone-call.png"
                    className="pointer"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="single_user">
              <div className="left">
                <div className="user_img">
                  <img src="./assets/img/user.png" alt="" />
                </div>
              </div>
              <div className="right">
                <h5>Sanskar Solanki</h5>
                <h6>8770534650</h6>
                <h6>Ujjain, India</h6>
                <div className="wc">
                  <img
                    src="./assets/img/whatsapp.png"
                    className="pointer"
                    alt=""
                  />
                  <img
                    src="./assets/img/phone-call.png"
                    className="pointer"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="single_user">
              <div className="left">
                <div className="user_img">
                  <img src="./assets/img/user.png" alt="" />
                </div>
              </div>
              <div className="right">
                <h5>Sanskar Solanki</h5>
                <h6>8770534650</h6>
                <h6>Ujjain, India</h6>
                <div className="wc">
                  <img
                    src="./assets/img/whatsapp.png"
                    className="pointer"
                    alt=""
                  />
                  <img
                    src="./assets/img/phone-call.png"
                    className="pointer"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="single_user">
              <div className="left">
                <div className="user_img">
                  <img src="./assets/img/user.png" alt="" />
                </div>
              </div>
              <div className="right">
                <h5>Sanskar Solanki</h5>
                <h6>8770534650</h6>
                <h6>Ujjain, India</h6>
                <div className="wc">
                  <img
                    src="./assets/img/whatsapp.png"
                    className="pointer"
                    alt=""
                  />
                  <img
                    src="./assets/img/phone-call.png"
                    className="pointer"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="single_user">
              <div className="left">
                <div className="user_img">
                  <img src="./assets/img/user.png" alt="" />
                </div>
              </div>
              <div className="right">
                <h5>Sanskar Solanki</h5>
                <h6>8770534650</h6>
                <h6>Ujjain, India</h6>
                <div className="wc">
                  <img
                    src="./assets/img/whatsapp.png"
                    className="pointer"
                    alt=""
                  />
                  <img
                    src="./assets/img/phone-call.png"
                    className="pointer"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="single_user">
              <div className="left">
                <div className="user_img">
                  <img src="./assets/img/user.png" alt="" />
                </div>
              </div>
              <div className="right">
                <h5>Sanskar Solanki</h5>
                <h6>8770534650</h6>
                <h6>Ujjain, India</h6>
                <div className="wc">
                  <img
                    src="./assets/img/whatsapp.png"
                    className="pointer"
                    alt=""
                  />
                  <img
                    src="./assets/img/phone-call.png"
                    className="pointer"
                    alt=""
                  />
                </div>
              </div>
            </div>

          </div>
          <br/>
        </div>
      </div>
    </div>
  );
};

export default UserList;
