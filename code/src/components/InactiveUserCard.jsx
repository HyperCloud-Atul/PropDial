import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import "./InactiveUserCard.scss";

const InactiveUserCard = () => {
  const { user } = useAuthContext();
  return (
    <div className="top_header_pg pg_bg">
      <div className="page_spacing pg_min_height d-flex justify-content-center align-items-center">
      <div className="iu_card d-flex justify-content-center align-items-center">
            <div className="iu_card_inner text-center">
              <div className="iuc_img relative">
                <img src="/assets/img/inactive.png" alt="inactive_img" />             
              </div>
              <h5>Your account has been deactivated by the admin.</h5>
              <h6>
                We're sorry, but it looks like your access has been restricted.
              </h6>
              <div className="iuc_c">
                <h5>Please contact support for further assistance.</h5>
                <div className="mt-3 support_btn">
                <Link to="/" className="theme_btn btn_border text-center no_icon">
                    Return to Homepage
                    </Link>
                    <Link to="/contact-us" className="theme_btn btn_fill text-center no_icon">
                    Contact Support
                    </Link>
                   
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default InactiveUserCard;
