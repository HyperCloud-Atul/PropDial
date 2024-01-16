import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const PropAgentPrivacyPolicy = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  return (
    <div className="top_header_pg pa_bg">
      <div className="pa_inner_page info_in_ul_li max-991">
        <div className="pg_header">
          <h2 className="p_title">Privacy Policy</h2>
          <h4 className="p_subtitle">
            Welcome to PropAgent's Privacy Policy. We are committed to
            protecting your privacy and ensuring the security of your personal
            information.
          </h4>
        </div>
        <ul>
          <li>
            <b>Information We Collect</b>
            <p>
              We collect information you provide when using our platform, such as contact details and property-related data, ensuring a personalized and efficient user experience.
            </p>
          </li>
          <li>
            <b>How We Use Your Information</b>
            <p>
              Your data is used to facilitate property transactions, enhance user experience, and communicate important updates. We do not sell your information to third parties.
            </p>
          </li>
          <li>
            <b>Data Security</b>
            <p>
              We employ industry-standard security measures to protect your information. However, no method is 100% secure; use PropAgent at your own risk.
            </p>
          </li>
          <li>
            <b>Cookies</b>
            <p>
              PropAgent uses cookies to enhance user experience and analyze usage patterns. You can manage cookie preferences in your browser settings.
            </p>
          </li>
          <li>
            <b>Third-Party Links</b>
            <p>
              Our platform may contain links to third-party sites. We are not responsible for their privacy practices; review their policies independently.
            </p>
          </li>
          <li>
            <b>Updates to Privacy Policy</b>
            <p>
              We may update our Privacy Policy. Check this page regularly for any changes.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PropAgentPrivacyPolicy;
