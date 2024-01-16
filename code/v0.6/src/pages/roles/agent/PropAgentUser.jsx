import React from "react";
import { useState } from "react";
import { timestamp, projectFirestore } from "../../../firebase/config";
import { useFirestore } from "../../../hooks/useFirestore";
import { useAuthContext } from "../../../hooks/useAuthContext";


const PropAgentUser = ({ userDoc }) => {
  // switch
  const [toggleFlag, setToggleFlag] = useState(false);
  // const [userStatus, setuserStatus] = useState("active"); //Residential/Commercial
  const { user } = useAuthContext();

  const { updateDocument, response: updateDocumentResponse } =
    useFirestore("users");

  // const toggleBtnClick = () => {
  //   if (toggleFlag) setuserStatus("active");
  //   else setuserStatus("inactive");

  //   setToggleFlag(!toggleFlag);
  // };

  const toggleBtnClick = async () => {
    let userSwitch = ''
    // e.preventDefault()

    setToggleFlag(!toggleFlag);

    if (userDoc.status === 'active') {
      userSwitch = 'inactive'
    } else {
      userSwitch = 'active'
    }

    const updatedBy = {
      id: user.uid,
      displayName: user.displayName + "(" + user.role + ")",
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      emailID: user.email,
      photoURL: user.photoURL,
    };

    const updatedUser = {
      status: userSwitch,
      updatedAt: timestamp.fromDate(new Date()),
      updatedBy,
    };

    // console.log('updatedUsers', updatedUser)
    // console.log('property id: ', property.id)

    await updateDocument(userDoc.id, updatedUser);
  };

  // switch
  return (

      <div className="propagentusersingle ">
        <div className="left">
          <div className="img_div">
            <img src={userDoc && userDoc.photoURL} alt="" />
          </div>
          <div className="right user_name_parent">
            <h5 className="name">
              {userDoc && userDoc.role === 'propagentadmin' ? userDoc && userDoc.fullName + " (Admin)" : userDoc && userDoc.fullName}
            </h5>
            <h6 className="phone_number">
              {userDoc && userDoc.phoneNumber}
            </h6>

          </div>
        </div>
        <div className="right">
          <div
            className="d-flex my_switch"
            style={{
              alignItems: "center",
            }}
          >
            <div className="residential-commercial-switch" style={{ top: "0" }}>
              <span
                // className={toggleFlag ? "" : "active"}
                className={userDoc && userDoc.status === 'active' ? "active" : " "}
                style={{ color: "var(--p-theme-green)" }}
              >
                ACTIVE
              </span>
              <div
                className={
                  userDoc && userDoc.status === 'inactive'
                    ? "toggle-switch on commercial"
                    : "toggle-switch off residential"
                }
                style={{ padding: "0px 6px" }}
              >
                {/* <small>{userDoc.status === 'inactive' ? 'On' : 'Off'}</small> */}
                <div onClick={() => toggleBtnClick()}>
                  <div></div>
                </div>
              </div>
              <span
                // className={toggleFlag ? "active" : ""}
                className={userDoc && userDoc.status === 'inactive' ? "active" : ""}
                style={{ color: "var(--p-theme-grey)" }}
              >
                INACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>
  
  );
};

export default PropAgentUser;
