// src/components/UserCardItem.jsx
import React from "react";
import { Link } from "react-router-dom";
import useUserPropertyCounts from "../../../utils/useUserPropertyCounts";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import formatCountry from "../../../utils/formatCountry";

const UserCardItem = ({ userObj, handleImageClick }) => {
  const { ownerCount, executiveCount } = useUserPropertyCounts(
    userObj.phoneNumber
  );

  return (
    <div className={`pu_single ${userObj.status === "inactive" && "inactive"}`}>
      <div className="tc_single relative item">
        {ownerCount > 0 && (
          <Link
            to={`/user-properties/${userObj.phoneNumber}?role=owner`}
            className="role_count"
          >
            {ownerCount}
          </Link>
        )}
        {executiveCount > 0 && (
          <Link
            to={`/user-properties/${userObj.phoneNumber}?role=executive`}
            className="role_count"
          >
            {executiveCount}
          </Link>
        )}
        <div className="left">
          <div className="tcs_img_container">
            <img
              src={userObj.photoURL || "/assets/img/dummy_user.png"}
              alt="Preview"
              className="pointer"
              onClick={() =>
                handleImageClick(
                  userObj.photoURL || "/assets/img/dummy_user.png",
                  <>
                    Here's How{" "}
                    <span
                      style={{
                        fontWeight: "500",
                        color: "var(--theme-blue)",
                      }}
                    >
                      {userObj.fullName}
                    </span>{" "}
                    Looks
                  </>
                )
              } // Pass dynamic title
            />
          </div>

          <div className="tenant_detail">
            <Link
              to={`/profiledetails/${userObj.id}`}
              className="t_name pointer"
            >
              {userObj.salutation} {userObj.fullName}
              <span className="material-symbols-outlined click_icon text_near_icon">
                edit
              </span>
            </Link>

            {userObj.phoneNumber && (
              <h6 className="t_number">
                {(() => {
                  try {
                    const phoneNumber = parsePhoneNumberFromString(
                      userObj.phoneNumber,
                      userObj.countryCode?.toUpperCase()
                    );
                    return phoneNumber
                      ? phoneNumber.formatInternational()
                      : userObj.phoneNumber;
                  } catch (error) {
                    return userObj.phoneNumber;
                  }
                })()}
              </h6>
            )}
            {userObj.email && <h6 className="t_number">{userObj.email}</h6>}
            <h6 className="t_number">
              {userObj.city}
              {userObj.city && (userObj.residentialCountry || userObj.country) && ", "}
              {formatCountry(userObj.residentialCountry || userObj.country)}
            </h6>
          </div>
        </div>

        <div className="wha_call_icon">
          <Link
            className="call_icon wc_single"
            to={`tel:+${userObj.phoneNumber}`}
            target="_blank"
          >
            <img src="/assets/img/simple_call.png" alt="propdial" />
          </Link>
          <Link
            className="wha_icon wc_single"
            to={`https://wa.me/+${userObj.phoneNumber}`}
            target="_blank"
          >
            <img src="/assets/img/whatsapp_simple.png" alt="propdial" />
          </Link>
        </div>

        {userObj.status === "inactive" && (
          <div className="inactive_tag">Inactive</div>
        )}
      </div>

      <div className="dates">
        <div className="date_single">
          <strong>On-Boarded</strong>:{" "}
          <span>
            {userObj.createdAt?.toDate &&
              userObj.createdAt.toDate().toLocaleDateString()}
          </span>
        </div>
        <div className="date_single">
          <strong>Last-Login</strong>:{" "}
          <span>
            {userObj.lastLoginTimestamp?.toDate &&
              userObj.lastLoginTimestamp.toDate().toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCardItem;
