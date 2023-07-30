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
      <footer
        style={{
          backgroundImage: "url('./assets/img/counterbg.png')",
        }}
      >
        <div className="newsletter-area">
          <div className="container  d-flex justify-content-center">
            <div className="row newsletter-wrap align-items-center">
              <div className="col-lg-6">
                <div className="newsletter-item">
                  <h2>Join Our Newsletter</h2>
                  <p>
                    Stay up-to-date with the latest news and exclusive offers by
                    subscribing to our newsletter today. Join us now!
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="newsletter-item">
                  <div className="newsletter-form">
                    <form className="newsletter-form">
                      {!user && (
                        <div>
                          <input
                            type="email"
                            placeholder="Enter Your Email"
                            name="EMAIL"
                            className="form-control"
                          />
                          <Link to="/login">
                            <div>
                              <button
                                onClick={showLogin}
                                type="submit"
                                class="more-btn-info newsletter-btn"
                              >
                                Subscribe
                              </button>
                            </div>
                          </Link>
                        </div>
                      )}
                      {user && !user.roles.includes("user") && (
                        <div>
                          <div>
                            <input
                              type="email"
                              placeholder={user.email}
                              value={user.email}
                              name="EMAIL"
                              className="form-control"
                            />
                            <button
                              onClick={showLogin}
                              type="submit"
                              class="more-btn-info newsletter-btn"
                            >
                              Subscribed
                            </button>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-lg-4">
              <div className="footer-item">
                <div className="footer-contact">
                  <h3>Contact Us</h3>
                  <ul>
                    <li>
                      <img
                        src="./assets/img/emailicon.png"
                        className="footer_icon"
                      ></img>
                      <a href="">info@prodial.com</a>
                      {/* <a href="">hello@dentamax.com</a> */}
                    </li>
                    <br></br>
                    <li>
                      <img
                        src="./assets/img/phone-callicon.png"
                        className="footer_icon"
                      ></img>
                      <a href="">+91 95821 95821</a>
                    </li>
                    <br></br>
                    <li>
                      <img
                        src="./assets/img/locationicon.png"
                        className="footer_icon"
                      ></img>
                      <span>
                        #204, 2nd Floor, Vipul Trade Centre, Sector-48 Sohna
                        Road, Gurugram-122018, Haryana, India
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="footer-item">
                <div className="footer-quick">
                  <h3>Quick Links</h3>
                  <ul>
                    <li>
                      <a>About us</a>
                    </li>
                    <li>
                      <a>Services</a>
                    </li>
                    <li>
                      <a>Resources</a>
                    </li>
                    <li>
                      <a>Timetables</a>
                    </li>
                    <li>
                      <a>term & conditions</a>
                    </li>
                    <li>
                      <a>FAQ</a>
                    </li>

                    <li>
                      <a href="#">Contact us</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="footer-item">
                <div className="footer-quick">
                  <h3>Our Services</h3>
                  <ul>
                    <li>
                      <a>Property Management in Gurgaon</a>
                    </li>
                    <li>
                      <a>Property Management in Delhi</a>
                    </li>
                    <li>
                      <a>Property Management in Gaziabad</a>
                    </li>
                    <li>
                      <a>Property Management in Noida</a>
                    </li>
                    <li>
                      <a>Property Management in Pune</a>
                    </li>
                    <li>
                      <a>Property Management in Hyderabad</a>
                    </li>
                    <li>
                      <a>Property Management in Bangalore</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="footer-item">
                <div className="footer-feedback">
                  <h3>Easy to chat us</h3>
                  <form>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Name"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Phone"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        id="your_message"
                        rows="5"
                        placeholder="Message"
                        className="form-control"
                      ></textarea>
                    </div>
                    <div className="text-left">
                      <button type="submit" className="btn feedback-btn">
                        SUBMIT
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
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
                  color: "var(--pink)",
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
