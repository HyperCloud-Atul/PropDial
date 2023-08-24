import React from "react";
import { Link } from "react-router-dom";

// css 
import "./Footer.css";

// components 
import FooterBefore from "./FooterBefore";


export default function Footer() {
  return (
    <>
    <FooterBefore></FooterBefore>
      <footer className="footer-section" style={{
        backgroundImage:"url('./assets/img/footer-bg.png')",
        backgroundSize:"cover",
        backgroundPosition:"center",
        backgroundRepeat:"no-repeat",
        position:"relative",
        zIndex:"1",
        backgroundColor:"var(--theme-blue)"       
      }}>

        <div className="container">
        <section className="loc_em_ph">
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
          <div className="footer_site_logo">
            <img src="./assets/img/footer_site_logo.png" alt="Propdial" />
            <p className="about_site">
            Property Management Systems or Hotel Operating System, under business, terms may be used in real estate hospitality accommodation management.
            </p>
          </div>
        </div>
       
        <div className="col-lg-3 col-md-4 col-sm-6">
          <div className="footer_single_title">
          Important Links
          </div>
          <div className="footer_link">
            <Link to="/">
            Home
            </Link>
            <Link to="/about-us">
            About Us
            </Link>
            <Link to="contact-us">
            Contact Us
            </Link>
            <Link to="faq">
            FAQ
            </Link>
            <Link>
            Privacy Policy
            </Link>
            <Link>
            Terms & Condition
            </Link>
          </div>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6">
          <div className="footer_single_title">
          Quick Links
          </div>
          <div className="footer_link">
            <Link>
            Property  in Delhi
            </Link>
            <Link>
            Property  in Noida
            </Link>
            <Link>
            Property  in Ghaziabad
            </Link>
            <Link>
            Property  in Hyderabad
            </Link>
            <Link>
            Property  in Bangalore
            </Link>
            <Link>
            Property  in Gurgaon
            </Link>
          </div>
        </div>  
        <div className="col-lg-3 col-md-4 col-sm-12">
          <div className="footer_single_title">
          Follow Us
          </div>
       <div className="footer_social_icon">       
          <Link className="fsi_single" to="https://www.facebook.com/propdial">
          <img src="./assets/img/facebook_footer.png" alt="" />
          </Link>    
          <Link className="fsi_single" to="https://www.youtube.com/channel/UC9cJZCtePKupvCVhRoimjlg">
          <img src="./assets/img/youtube_footer.png" alt="" />
          </Link> 
          <Link className="fsi_single" to="https://www.linkedin.com/company/propdial-india-pvt-ltd-/">
          <img src="./assets/img/linkedin_footer.png" alt="" />
          </Link> 
          <Link className="fsi_single" to="https://twitter.com/i/flow/login?redirect_after_login=%2Fpropdial" >
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
                  textDecoration:"underline"
                }}
              >
                <b>Hyper Cloud Digital Solutions</b>
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
