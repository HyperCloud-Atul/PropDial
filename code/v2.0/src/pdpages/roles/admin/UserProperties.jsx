import React from "react";
import { useParams, useLocation } from "react-router-dom";
import useUserProperties from "../../../utils/useUserProperties";
import PropertyCard from "../../../components/property/PropertyCard";
import { projectFirestore } from "../../../firebase/config";
import { useEffect, useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import formatCountry from "../../../utils/formatCountry";
import { Link } from "react-router-dom";

const UserProperties = () => {
  const { phoneNumber } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  const { properties, loading } = useUserProperties(phoneNumber, role);

  // fetch user
  const [userDoc, setUserDoc] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  useEffect(() => {
    const fetchUserByPhone = async () => {
      try {
        const snapshot = await projectFirestore
          .collection("users-propdial")
          .where("phoneNumber", "==", phoneNumber)
          .get();

        if (!snapshot.empty) {
          setUserDoc(snapshot.docs[0].data()); // store the full doc data
        } else {
          console.warn("No user found with that phone number.");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setUserLoading(false);
      }
    };

    if (phoneNumber) {
      fetchUserByPhone();
    }
  }, [phoneNumber]);

  // fetch user end

  if (loading) return <p>Loading...</p>;

  return (
    <div className="top_header_pg pg_bg">
      <div className="page_spacing">
        <div className="row row_reverse_991">
          <div className="col-lg-4">
            <div className="title_card mobile_full_575 mobile_gap h-100">
              <h2 className="text-center mb-3">
                {role?.charAt(0).toUpperCase() + role?.slice(1)} Properties
              </h2>
              <h6
                className="text-center mt-1 mb-2"
                style={{
                  fontSize: "24px",
                  fontWeight: "500",
                  color: "var(--theme-blue)",
                }}
              >
                {properties?.length}
              </h6>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="property_user_card propdial_users all_tenants">
              <div className="pu_single">
                <div className="tc_single relative item">
                  <div className="left">
                    <div className="tcs_img_container">
                      <img
                        src={userDoc.photoURL || "/assets/img/dummy_user.png"}
                        alt="Preview"
                        className="pointer"
                        //  onClick={() =>
                        //    handleImageClick(
                        //      userDoc.photoURL || "/assets/img/dummy_user.png",
                        //      <>
                        //        Here's How{" "}
                        //        <span
                        //          style={{
                        //            fontWeight: "500",
                        //            color: "var(--theme-blue)",
                        //          }}
                        //        >
                        //          {userDoc.fullName}
                        //        </span>{" "}
                        //        Looks
                        //      </>
                        //    )
                        //  }
                      />
                    </div>

                    <div className="tenant_detail">
                      <div className="t_name pointer">
                        {userDoc.salutation} {userDoc.fullName}
                      </div>
                      {userDoc.phoneNumber && (
                        <h6 className="t_number">
                          {(() => {
                            try {
                              const phoneNumber = parsePhoneNumberFromString(
                                userDoc.phoneNumber,
                                userDoc.countryCode?.toUpperCase()
                              );
                              return phoneNumber
                                ? phoneNumber.formatInternational()
                                : userDoc.phoneNumber;
                            } catch (error) {
                              return userDoc.phoneNumber;
                            }
                          })()}
                        </h6>
                      )}
                      {userDoc.email && (
                        <h6 className="t_number">{userDoc.email}</h6>
                      )}
                      <h6 className="t_number">
                        {userDoc.city}
                        {userDoc.city && userDoc.residentialCountry && ", "}
                        {formatCountry(
                          userDoc.residentialCountry || userDoc.country
                        )}
                      </h6>
                    </div>
                  </div>

                  <div className="wha_call_icon">
                    <Link
                      className="call_icon wc_single"
                      to={`tel:+${userDoc.phoneNumber}`}
                      target="_blank"
                    >
                      <img src="/assets/img/simple_call.png" alt="propdial" />
                    </Link>
                    <Link
                      className="wha_icon wc_single"
                      to={`https://wa.me/+${userDoc.phoneNumber}`}
                      target="_blank"
                    >
                      <img
                        src="/assets/img/whatsapp_simple.png"
                        alt="propdial"
                      />
                    </Link>
                  </div>

                  {userDoc.status === "inactive" && (
                    <div className="inactive_tag">Inactive</div>
                  )}
                </div>

                <div className="dates">
                  <div className="date_single">
                    <strong>On-Boarded</strong>:{" "}
                    <span>
                      {userDoc.createdAt?.toDate &&
                        userDoc.createdAt.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="date_single">
                    <strong>Last-Login</strong>:{" "}
                    <span>
                      {userDoc.lastLoginTimestamp?.toDate &&
                        userDoc.lastLoginTimestamp.toDate().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="vg22"></div>
        <div className="vg12"></div>
        <div className="property_cards_parent">
          {properties.length === 0 ? (
            <p>No properties found for this user and role.</p>
          ) : (
            properties.map((property) => (
              <PropertyCard key={property.id} propertyid={property.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProperties;
