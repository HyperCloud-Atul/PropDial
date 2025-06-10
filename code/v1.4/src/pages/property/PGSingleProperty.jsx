import React from "react";
import { Navigate, Link } from "react-router-dom";

const PGSingleProperty = () => {
  return (
    <div className="top_header_pg pg_bg pd_single">
      <div className="page_spacing">
        {/* top search bar */}

        {/* {!user && (
          <div className="top_search_bar">
            <Link to="/search-property" className="back_btn">
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Back</span>
            </Link>
          </div>
        )} */}

        <section className="property_cards">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-9"></div>
              <div className="col-xl-3">
                <div className="pp_sidebar">
                  <div className="pp_sidebar_cards">
                    <div className="pp_sidebarcard_single">
                      <div className="ppss_img">
                        <img src="/assets/img/property/p2.jpg" alt="" />
                      </div>
                      <div className="ppss_header">
                        <h5>Brij Residency Phase 2</h5>
                        <h6>GRV Constructions</h6>
                        <h6 className="location">MR 11, Indore</h6>
                      </div>
                      <div className="ppss_footer">
                        <h6>1, 3 BHK Flats</h6>
                        <h6>
                          <span>₹ 22.2 Lac</span> onwards
                        </h6>
                        <h6>Marketed by D2R</h6>
                      </div>
                    </div>
                    <div className="pp_sidebarcard_single">
                      <div className="ppss_img">
                        <img src="/assets/img/property/p2.jpg" alt="" />
                      </div>
                      <div className="ppss_header">
                        <h5>Brij Residency Phase 2</h5>
                        <h6>GRV Constructions</h6>
                        <h6 className="location">MR 11, Indore</h6>
                      </div>
                      <div className="ppss_footer">
                        <h6>1, 3 BHK Flats</h6>
                        <h6>
                          <span>₹ 22.2 Lac</span> onwards
                        </h6>
                        <h6>Marketed by D2R</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PGSingleProperty;
