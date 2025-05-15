import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCollection } from "../../hooks/useCollection";
import { Link } from "react-router-dom";

import "./PGReferral.scss";

// component
import ScrollToTop from "../../components/ScrollToTop";
import InactiveUserCard from "../../components/InactiveUserCard";
import AddReferral from "./AddReferral";
import ViewReferral from "./ViewReferral";
import NineDots from "../../components/NineDots";

const PGReferral = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  if (!user) navigate("/login");

  const [showAIForm, setShowAIForm] = useState(false);
  const handleShowAIForm = () => setShowAIForm(!showAIForm);

  // get agent document start
  const { documents: referralDoc, errors: referralDocError } = useCollection(
    "referrals-propdial",
    ["referedBy", "==", user.phoneNumber],
    ["createdAt", "desc"]
  );
  // get agent document end

  // nine dots menu start
  const nineDotsMenu = [
    { title: "User List", link: "/userlist", icon: "group" },
  ];
  // nine dots menu end

  return (
    <div>
      <ScrollToTop />
      {user && user.status === "active" ? (
        <div className="top_header_pg pg_bg pg_referral">
          <div className="page_spacing pg_min_height">
            {/* nine dot menu and plus icons start  */}
            <NineDots nineDotsMenu={nineDotsMenu} />
            <Link className="property-list-add-property with_9dot">
              <span
                className="material-symbols-outlined"
                onClick={handleShowAIForm}
              >
                {showAIForm ? "close" : "add"}
              </span>
            </Link>
            {/* nine dot menu and plus icons start  */}

            {/* if no referral doc available start */}
            {referralDoc && referralDoc.length === 0 && (
              <div className={`pg_msg ${showAIForm && "d-none"}`}>
                <div>
                  No Reference Yet!
                  <div
                    onClick={handleShowAIForm}
                    className={`theme_btn no_icon header_btn mt-3 ${
                      showAIForm ? "btn_border" : "btn_fill"
                    }`}
                  >
                    {showAIForm ? "Cancel" : "Add New"}
                  </div>
                </div>
              </div>
            )}
            {/* if no referral doc available end  */}

            {/* view agent start  */}
            {referralDoc && referralDoc.length !== 0 && (
              <>
                {!showAIForm && (
                  <ViewReferral
                    referralDoc={referralDoc}
                    handleShowAIForm={handleShowAIForm}
                    user={user}
                  />
                )}
              </>
            )}
            {/* view agent end  */}

            {/* add agent start  */}
            {showAIForm && (
              <>
                <AddReferral
                  showAIForm={showAIForm}
                  setShowAIForm={setShowAIForm}
                  handleShowAIForm={handleShowAIForm}
                />
              </>
            )}
            {/* add agent end     */}
          </div>
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </div>
  );
};

export default PGReferral;
