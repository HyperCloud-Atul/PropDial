import React from "react";
import { Link, useLocation } from "react-router-dom";

// css
import "./PhoneLogin.scss";
const PhoneLogin = () => {
  return (
    <div className="phone_login two_col_page">
      <div className="right col_right">
        <img src="./assets/img/login_img.jpeg" alt="" />
      </div>
      <div className="left col_left">
        <div className="left_inner col_left_inner">
          <div className="page_inner_logo">
            <img src="/assets/img/logo_propdial.png" alt="" />
          </div>
          <h5 className="m20 mt-3 mb-4">
            Unlocking Your Property Prospects: PropDial - Where Realty Meets
            Security.
          </h5>
          <form action="">
            <div className="new_form_field with_icon">
              <label htmlFor="" className="text-center">
                Mobile Number
              </label>
              <div className="nff_inner">
                <input type="number" placeholder="10 digit mobile number" />
                <div className="nff_icon">
                  <span class="material-symbols-outlined">call</span>
                </div>
              </div>
            </div>
            <div className="new_form_field">
              <div className="checkbox">
                <input type="checkbox" id="agree_tcp" />
                <label htmlFor="agree_tcp">I agree to PropAgent <Link to="" class="my_click_text">T&C</Link> & <Link to="" class="my_click_text">Privacy Policy</Link></label>
              </div>
            </div>
            <button className="p_theme_btn w_full">
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;
