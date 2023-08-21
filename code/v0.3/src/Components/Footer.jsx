import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../hooks/useAuthContext";

export default function Footer() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const showLogin = () => {
    navigate("/signup");
  };
  return (
    <>
      {/* <footer className="footer-section">
        <div className="container">
          <div className="footer-cta pt-5 pb-5">
            <div className="row">
              <div className="col-md-4">
                <div className="">
                  <div className="single-cta">
                    <span class="material-symbols-outlined">location_on</span>
                    <div className="cta-text">
                      <h4>Corporate Office</h4>
                      <span>
                        204, 2nd Floor, Vipul Trade Centre, Sector-48 Sohna
                        Road, Gurugram-122018, Haryana, India
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="single-cta">
                    <span class="material-symbols-outlined">call</span>
                    <div className="cta-text">
                      <h4>Call us</h4>
                      <span>9876543210 0</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="single-cta">
                    <span class="material-symbols-outlined">mail</span>
                    <div className="cta-text">
                      <h4>Mail us</h4>
                      <span>mail@info.com</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
                <div className="footer-widget">
                  <div className="footer-widget-heading">
                    <h3>Useful Links</h3>
                  </div>
                  <ul>
                    <li>
                      <a href="#">Home</a>
                    </li>
                    <li>
                      <a href="#">about</a>
                    </li>
                    <li>
                      <a href="#">services</a>
                    </li>
                    <li>
                      <a href="#">portfolio</a>
                    </li>
                    <li>
                      <a href="#">Contact</a>
                    </li>
                    <li>
                      <a href="#">About us</a>
                    </li>
                    <li>
                      <a href="#">Our Services</a>
                    </li>
                    <li>
                      <a href="#">Expert Team</a>
                    </li>
                    <li>
                      <a href="#">Contact us</a>
                    </li>
                    <li>
                      <a href="#">Latest News</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 mb-50">
                <div className="footer-widget">
                  <div className="footer-widget-heading">
                    <h3>Quick Links</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-content pt-5 pb-5">
            <div className="row">
              <div className="col-xl-4 col-lg-4 mb-50">
                <div className="footer-widget">
                  <div className="footer-logo">
                    <a href="index.html">
                      <img
                        src="https://i.ibb.co/QDy827D/ak-logo.png"
                        className="img-fluid"
                        alt="logo"
                      />
                    </a>
                  </div>
                  <div className="footer-text">
                    <p></p>
                  </div>
                  <div className="footer-social-icon">
                    <span>Follow us</span>
                    <a href="#">
                      <i className="fab fa-facebook-f facebook-bg"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-twitter twitter-bg"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-google-plus-g google-bg"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer> */}
      <div className="copyright-area">
        <div className="container">
          <div className="copyright-item">
            <p>© 2023 All right reserved Propdial</p>
            <p>
              Designed & Developed By <br />
              <a
                href="https://www.hyperclouddigital.com/"
                target="_blank"
                style={{
                  color: "var(--theme-orange)",
                  textDecoration:"underline"
                }}
              >
                <b>Hyper Cloud Digital Solutions</b>
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
