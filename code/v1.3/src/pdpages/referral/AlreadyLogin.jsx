import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./AlreadyLogin.scss";

const AlreadyLogin = () => {
    const { user } = useAuthContext();
    return (
      <div className="top_header_pg pg_bg">
        <div className="page_spacing pg_min_height d-flex justify-content-center align-items-center">
        <div className="iu_card d-flex justify-content-center align-items-center">
              <div className="iu_card_inner text-center">
                <div className="iuc_img relative">
                  <img src={`/assets/img/${user && user.gender === "male" ? "happyboy" : "happygirl"}.png`} alt="inactive_img" /> 
                           
                </div>
                <h5>It looks like you're already part of our community.</h5>
                <h6>
                 This link is meant for new users to join in, but you can still play your part!
                </h6>
                <div className="iuc_c">
                  <h5>Share your unique referral link now and start earning rewards!</h5>
                  <div className="mt-3 support_btn">
                  <Link to="/dashboard" className="theme_btn btn_border text-center no_icon">
                      Dashboard
                      </Link>
                      <Link to="/referral" className="theme_btn btn_fill text-center no_icon">
                      Invite Friends 
                      </Link>                     
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  };
  

export default AlreadyLogin






