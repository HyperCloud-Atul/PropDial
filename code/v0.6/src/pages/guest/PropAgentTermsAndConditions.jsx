import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const PropAgentTermsAndConditions = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  // Function to get the current year
  const getCurrentYear = () => new Date().getFullYear();
  return (
    <div className="top_header_pg pa_bg pg_tc">
      <div className="pa_inner_page info_in_ul_li max-991">
        <div className="pg_header">
          <h2 className="p_title">Terms and Conditions</h2>
          <h4 className="p_subtitle">
            Welcome to our platform! By using our services, you agree to abide
            by our Terms and Conditions.
          </h4>
        </div>
        <ul>
          <li>
            <b>Acceptance of Terms</b>
            <p>
              By using PropAgent, you agree to comply with our Terms and
              Conditions. If you disagree, please refrain from using our
              platform.
            </p>
          </li>
          <li>
            <b>User Conduct</b>
            <p>
              Users must adhere to ethical and legal standards. PropAgent
              reserves the right to terminate accounts violating our guidelines.
            </p>
          </li>
          <li>
            <b>Intellectual Property</b>
            <p>
              All content on PropAgent is protected by intellectual property
              laws. Users may not reproduce, distribute, or use content without
              permission.
            </p>
          </li>
          <li>
            <b>Limitation of Liability</b>
            <p>
              PropAgent is not liable for any direct, indirect, or consequential
              damages arising from platform use.
            </p>
          </li>
          <li>
            <b>Termination</b>
            <p>
              PropAgent reserves the right to terminate or suspend accounts for
              any reason without notice.
            </p>
          </li>
          <li>
            <b>Governing Law</b>
            <p>
              These terms are governed by indian goverments laws. Any disputes
              will be resolved through arbitration.
            </p>
          </li>
          <li>
            <b>Updates to Terms</b>
            <p>
              We may update our Terms and Conditions. Users are responsible for
              reviewing changes.
            </p>
          </li>
        </ul>
      </div>
      <section className="copyright-area">
        <div className="container">
          <div className="copyright-item">
            <p>© {getCurrentYear()} All rights reserved PropAgent</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropAgentTermsAndConditions;
