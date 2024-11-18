import React from "react";
import { useState, useEffect } from "react";

// import component
import ReferralSingle from "./ReferralSingle";
import LinearProgressBar from "../../pages/roles/owner/LinearProgressBar";

const ViewReferral = ({ referralDoc, handleShowAIForm, user }) => {
 // Search input state
 const [searchInput, setSearchInput] = useState("");
 const handleSearchInputChange = (e) => {
   setSearchInput(e.target.value);
 };

 // console.log("agent doc: ", referralDoc)

 // Filter referral
 const filteredAgentList = referralDoc
   ? referralDoc.filter((document) => {
     let searchMatch = true;

     // Filter by search input
     searchMatch = searchInput
       ? Object.values(document).some(
         (field) =>
           typeof field === "string" &&
           field.toUpperCase().includes(searchInput.toUpperCase())
       )
       : true;

     return searchMatch;
   })
   : null;

 // View mode start
 const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns
 const handleModeChange = (newViewMode) => {
   setviewMode(newViewMode);
 };
 // View mode end
 return (
   <div className="propagent_dashboard">
     {/* view agent pg header and filters start  */}
     <div className="pg_header d-flex justify-content-between">
       <div className="left">
      
            <h2 className="m22 mb-1">{user && user.displayName}'s Referral Dashboard</h2>
            <h4 className="r18 light_black">
            Track Your Referrals and Earnings in Real-Time!           
            </h4>       
     
       </div>
       <div className="right">
         <img
           src="./assets/img/icons/excel_logo.png"
           alt=""
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
                      <img src="/assets/img/coin.png" alt="" />
                    </div>
                    <div className="inner">
                      <div className="icon">
                        <img src="/assets/img/wallet.png" alt="" />
                      </div>
                      <div className="content">
                        <h4 className="title">Referral Income</h4>
                        <div className="bar">
                          <LinearProgressBar total="55" current="20" />
                        </div>

                        <h6>
                        The more you refer, the more you earn!
                        </h6>
                      </div>
                      <div className="number">
                        {/* {myproperties && myproperties.length} */}
                        2K
                        </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-7 bg_575">
                  <div className="vg22_1199"></div>
                  <div className="property_status">
                    <div className="ps_single pending">
                      <h5>
                        {/* {pendingProperties && pendingPropertieslengthWithoutNulls} */}
                        {referralDoc && referralDoc.length}
                        </h5>
                      <h6>Total Referrals</h6>
                    </div>
                    <div className="ps_single active">
                      <h5>
                        {/* {activeProperties && activePropertieslengthWithoutNulls} */}
                        10
                        </h5>
                      <h6>Successful Conversions</h6>
                    </div>
                    <div className="ps_single inactive">
                      <h5>
                        {/* {inactiveProperties && inactivePropertieslengthWithoutNulls} */}
                        5
                        </h5>
                      <h6>Pending Referrals</h6>
                    </div>
                  </div>
                </div>
              </section>
              <div className="vg22"></div>           
            </div>
          </div>
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
             className={`bf_single ${viewMode === "card_view" ? "active" : ""
               }`}
             onClick={() => handleModeChange("card_view")}
           >
             <span className="material-symbols-outlined">
               calendar_view_month
             </span>
           </div>
           <div
             className={`bf_single ${viewMode === "table_view" ? "active" : ""
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
     <hr></hr>
     {/* view agent pg header and filters end  */}

     {/* agent card and table  */}
     {viewMode === "card_view" && filteredAgentList && <ReferralSingle referralDoc={filteredAgentList} />}

     {viewMode === "table_view" && (
       <h5 className="text-center text_green">
         Coming Soon....
       </h5>
     )}
   </div>
 );
};

export default ViewReferral
