import React from "react";
// import {Button} from 'react-bootstrap';
import "./Footer.css";

const Footer = () => {
    return(
    <>
     <section className="contact-short">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 col-sm-12">
                    <h2>PROPDIAL ( Property Management Service )</h2>
                </div>

                <div className="col-lg-6 col-sm-12">
                    <button onclick="Submit" className="footer-upper-btn" style={{color: "white"}}>CONTACT US</button>
                </div>
            </div>
        </div>
    </section>

    <section className="footer-parent">
        <div className="container footer-upper">
            <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-12">
                    <h3><i className="bi bi-geo-alt"></i> OFFICE</h3>
                    <p>#204, 2nd Floor, Vipul Trade Centre, Sector-48 Sohna Road, Gurugram-122018,
                        Haryana, India
                    </p>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                    <h3><i className="bi bi-envelope"></i> EMAIL US</h3>
                    <br/>
                    <input placeholder="Message"/>
                    <button onclick="Submit" id="footer-btn" style={{color: "white"}}>SEND <i
                            className="bi bi-fast-forward"></i></button>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                    <h3><i className="bi bi-person-heart"></i> FOLLOW</h3>
                    <br/>
                    <i className="bi bi-facebook" style={{fontSize: "22px", marginLeft: "7px", cursor: "pointer"}}></i>
                    <i className="bi bi-instagram" style={{fontSize: "22px", marginLeft: "7px", cursor: "pointer"}}></i>
                    <i className="bi bi-twitter" style={{fontSize: "22px", marginLeft: "7px", cursor: "pointer"}}></i>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                    <h3><i className="bi bi-telephone-inbound"></i> CALL US</h3>
                    <br />
                    <p>+91 9456355275</p>
                </div>
            </div>
        </div>
        <br />
        <br />
        <hr style={{height: "21px", color: "white"}} />

        {/* start copyright are */}
        <div className="copyright-area">
            <div className="row">
                <div className="col">
                    <p>© 2023 Propdial. All Rights Reserved.</p>
                </div>
                <div className="col" style={{display: "flex"}}>
                    <p>Privacy</p>
                    <p>Terms</p>
                    <p>FAQs</p>
                    <p>Help</p>
                </div>
            </div>
        </div>
    </section>
    </>
    );
}
export default Footer;