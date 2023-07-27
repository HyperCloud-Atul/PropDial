import React from "react";
import "./Announcement.css";
const Announcement = () => {
  return (
    <>
    <section className="headannouncement position-fixed">
        <div className="container">
            <div className="row">
                <div className="announcement-left col-lg-6">
                    <i className="bi bi-facebook" style={{ fontSize: "20px", cursor: "pointer"}}></i>
                    <i className="bi bi-instagram" style={{fontSize: "20px", marginLeft: "50px", cursor: "pointer"}}></i>
                    <i className="bi bi-twitter" style={{fontSize: "20px", marginLeft: "50px", cursor: "pointer"}}></i>
                </div>

                <div className="announcement-right col-lg-6">
                    <p><i className="bi bi-telephone-plus"></i> 9456355275</p>
                    <p><i className="bi bi-envelope-plus"></i> Propdial@gmail.com</p>
                    <p style={{borderRight: "none"}}><i className="bi bi-geo-alt"></i> Gurugram(Haryana)</p>
                </div>
            </div>
        </div>
    </section>
    </>
  );
};

export default Announcement;
