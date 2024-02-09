import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// css
import "./Footer.css";

// components
import FooterBefore from "./FooterBefore";
import CollapsibleGroup from "./CollapsibleGroup";

export default function Footer() {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate();
  const logoClick = () => {
    navigate("/");
  };
  //  display none Array 
  const excludedPaths = ["/", "aboutus", "contactus", "more-menu"];
  const shouldHide = excludedPaths.includes(location.pathname);
  const className = `loc_em_ph ${shouldHide ? "" : "d_none"}`;
  //  display none Array 

  //  add class on footer display none Array 
  const excludedFooterPaths = ["/", "aboutus", "contactus", "more-menu"];
  const shouldClassAdd = excludedFooterPaths.includes(location.pathname);
  const footerClassName = `footer-section ${shouldClassAdd ? "" : "margin-padding"}`;
  //  add class on footer  display none Array 

  // hide page_footer array 
  const pageFooterHidePaths = ["/phonelogin", "/ticketdetail", "/addproperty"];
  const shouldPageFooerHide = pageFooterHidePaths.includes(location.pathname);
  const pageFooterclassName = `${shouldPageFooerHide ? "page_footer_hide" : ""}`;
  // hide page_footer array 

  return (
    <div className={pageFooterclassName}>
      <CollapsibleGroup></CollapsibleGroup>
      <FooterBefore></FooterBefore>
      <footer
        className={footerClassName}
        style={{
          backgroundImage: "url('./assets/img/footer-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          zIndex: "1",
          backgroundColor: "var(--theme-blue)",
        }}
      >
        <div className="container">
          <section className={className}>
            <div className="container">
              <div
                className="loc_em_ph_inner"
                style={{
                  backgroundImage: "url('./assets/img/contact_info_belt.jpg')",
                }}
              >
                <div className="lep_single">
                  <div>
                    <div className="icon_div ">
                      <img src="./assets/img/location_f_cpg.png"></img>
                    </div>
                    <h4>Address</h4>
                  </div>
                  <h6 className="lep_single_address">
                    #204, 2nd floor, Vipul Trade Centre, Sector 48, Sohna Road,
                    Gurugram <br></br>- 122 018, Haryana
                  </h6>
                </div>
                <div className="lep_single">
                  <div>
                    <div className="icon_div">
                      <img src="./assets/img/emailcpg.png"></img>
                    </div>
                    <h4>Email</h4>
                  </div>
                  <h6>info@propdial.com</h6>
                </div>
                <div className="lep_single">
                  <div>
                    <div className="icon_div">
                      <img src="./assets/img/callcpg.png"></img>
                    </div>
                    <h4>Phone</h4>
                  </div>
                  <h6>
                    +91 95821 95821
                    <br />
                    +91 95821 95821
                  </h6>
                </div>
              </div>
            </div>
          </section>
          <section className="main_footer">
            <div className="row">
              <div className="col-lg-3 col-md-12">
                <div className="footer_site_logo pointer" onClick={logoClick}>
                  <img src="./assets/img/footer_site_logo.png" alt="Propdial" />
                  <p className="about_site">
                    Propdial, established in 2014, is a leading property
                    management services company. We specialize in offering
                    comprehensive property management and property care-taking
                    services.
                  </p>
                </div>
              </div>

              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="footer_single_title">Important Links</div>
                <div className="footer_link">
                  <Link to="faq" className={`pointer ${location.pathname === "/faq" ? "active_f_link" : ""
                    }`}>FAQ</Link>
                  <Link to="/" className={`pointer ${location.pathname === "/" ? "active_f_link" : ""
                    }`}>Home</Link>
                  <Link to="/about-us" className={`pointer ${location.pathname === "/about-us" ? "active_f_link" : ""
                    }`}>About Us</Link>
                  <Link to="contact-us" className={`pointer ${location.pathname === "/contact-us" ? "active_f_link" : ""
                    }`}>Contact Us</Link>
                  <Link>Privacy Policy</Link>
                  <Link>Terms & Condition</Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="footer_single_title">Quick Links</div>
                <div className="footer_link">
                  <Link>Property in Delhi</Link>
                  <Link>Property in Noida</Link>
                  <Link>Property in Gurugram</Link>
                  <Link>Property in Pune</Link>
                  <Link>Property in Mumbai</Link>
                  <Link>Property in Bangalore</Link>
                  <Link>Property in Hyderabad</Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-12">
                <div className="footer_single_title">Follow Us</div>
                <div className="footer_social_icon">
                  <Link
                    className="fsi_single"
                    to="https://www.facebook.com/propdial"
                  >
                    <img src="./assets/img/facebook_footer.png" alt="" />
                  </Link>
                  <Link
                    className="fsi_single"
                    to="https://www.youtube.com/channel/UC9cJZCtePKupvCVhRoimjlg"
                  >
                    <img src="./assets/img/youtube_footer.png" alt="" />
                  </Link>
                  <Link
                    className="fsi_single"
                    to="https://www.linkedin.com/company/propdial-india-pvt-ltd-/"
                  >
                    <img src="./assets/img/linkedin_footer.png" alt="" />
                  </Link>
                  <Link
                    className="fsi_single"
                    to="https://twitter.com/i/flow/login?redirect_after_login=%2Fpropdial"
                  >
                    <img src="./assets/img/twitter_footer.png" alt="" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </footer>
      <section className="copyright-area">
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
                  textDecoration: "underline",
                }}
              >
                <b>Hyper Cloud Digital Solutions</b>
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
