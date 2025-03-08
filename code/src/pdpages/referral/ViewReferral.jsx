import React, { useState, useEffect } from "react";

// import component
import ReferralSingle from "./ReferralSingle";
import LinearProgressBar from "../../pages/roles/owner/LinearProgressBar";

const ViewReferral = ({ referralDoc, handleShowAIForm, user }) => {
  // Search input state
  const [searchInput, setSearchInput] = useState("");
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // State for filtering by status
  const [filterStatus, setFilterStatus] = useState("all"); // Default is 'all'

  // Filter referral
  const filteredreferrals = referralDoc
    ? referralDoc.filter((document) => {
        let searchMatch = true;
        let statusMatch = true;

        // Filter by search input
        searchMatch = searchInput
          ? Object.values(document).some(
              (field) =>
                typeof field === "string" &&
                field.toUpperCase().includes(searchInput.toUpperCase())
            )
          : true;

        // Filter by status
        if (filterStatus === "success") {
          statusMatch = document.isAccept === true;
        } else if (filterStatus === "pending") {
          statusMatch = document.isAccept === false;
        }

        return searchMatch && statusMatch;
      })
    : [];

  // Count successful and pending referrals
  const successfulCount = referralDoc
    ? referralDoc.filter((doc) => doc.isAccept === true).length
    : 0;
  const pendingCount = referralDoc
    ? referralDoc.filter((doc) => doc.isAccept === false).length
    : 0;

  // View mode state
  const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns
  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };

  return (
    <div className="propagent_dashboard">
      {/* Header */}
      <div className="pg_header d-flex justify-content-between">
        <div className="left">
          <h2 className="m22 mb-1">
            {user && user.displayName}'s Referral Dashboard
          </h2>
          <h4 className="r18 light_black">
            Track Your Referrals and Earnings in Real-Time!
          </h4>
        </div>
        <div className="right">
          <img
            src="./assets/img/icons/excel_logo.png"
            alt="propdial"
            className="excel_dowanload"
          />
        </div>
      </div>
      <div className="vg22"></div>
      <div className="pg_body">
        <div className="propagent_dashboard_inner">
          <section className="row">
            <div className="col-xl-5">
              <div className="total_prop_card relative">
                <div className="bg_icon">
                  <img src="/assets/img/coin.png" alt="propdial" />
                </div>
                <div className="inner">
                  <div className="icon">
                    <img src="/assets/img/wallet.png" alt="propdial" />
                  </div>
                  <div className="content">
                    <h4 className="title">Referral Income</h4>
                    <div className="bar">
                      <LinearProgressBar total="55" current="20" />
                    </div>
                    <h6>The more you refer, the more you earn!</h6>
                  </div>
                  <div className="number">00</div>
                </div>
              </div>
            </div>

            <div className="col-xl-7 bg_575">
              <div className="vg22_1199"></div>
              <div className="property_status">
                <div
                  className={`ps_single pending pointer ${filterStatus === "all" && "arrow"}`}
                  onClick={() => setFilterStatus("all")}
                >
                  <h5>{referralDoc ? referralDoc.length : 0}</h5>
                  <h6>Total Referrals</h6>
                </div>
                <div
                  className={`ps_single active pointer ${filterStatus === "success" && "arrow"}`}
                  onClick={() => setFilterStatus("success")}
                >
                  <h5>{successfulCount}</h5>
                  <h6>Successful Conversions</h6>
                </div>
                <div
                  className={`ps_single inactive pointer ${filterStatus === "pending" && "arrow"}`}
                  onClick={() => setFilterStatus("pending")}
                >
                  <h5>{pendingCount}</h5>
                  <h6>Pending Referrals</h6>
                </div>
              </div>
            </div>
          </section>
          <div className="vg22"></div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="left">
          <div className="rt_global_search search_field">
            <input
              placeholder="Search"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
            <div className="field_icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="button_filter diff_views">
            <div
              className={`bf_single ${
                viewMode === "card_view" ? "active" : ""
              }`}
              onClick={() => handleModeChange("card_view")}
            >
              <span className="material-symbols-outlined">
                calendar_view_month
              </span>
            </div>
            <div
              className={`bf_single ${
                viewMode === "table_view" ? "active" : ""
              }`}
              onClick={() => handleModeChange("table_view")}
            >
              <span className="material-symbols-outlined">view_list</span>
            </div>
          </div>
          <div
            onClick={handleShowAIForm}
            className="theme_btn no_icon header_btn btn_fill"
          >
            Add New
          </div>
        </div>
      </div>
      <hr />

      {/* Referral Display */}
      {viewMode === "card_view" && (
        <div className="pg_enquiry">
          <div className="my_small_card_parent">
            {filteredreferrals && (
              <ReferralSingle referralDoc={filteredreferrals} user={user} />
            )}
          </div>
        </div>
      )}

      {viewMode === "table_view" && (
        <h5 className="text-center text_green">Coming Soon....</h5>
      )}
    </div>
  );
};

export default ViewReferral;
