import React from "react";
import "./FounderSpeak.css";
const FounderSpeak = () => {
  return (
    <>
    <div className="container founder-speak-section">
        <div className="founder-speak-heading">
            <h3>Founders <span>speak</span></h3>
            <div className="divider-line"></div>
        </div>
        <div className="row founder-speaks">
            <div className="founders-data col-lg-6 col-md-6 col-sm-12">
                <div className="col-lg-6 col-md-6 col-sm-6 founder-img-div">
                    <a href="https://www.youtube.com/watch?v=RphaFtAR8pw"><img className="founder-img"
                            src={process.env.PUBLIC_URL + '/Images/Screenshot 2023-01-29 103048.png'} alt="founder-image"/></a>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 founders-details">
                    <h2>Mr. Gopal Mishra</h2>
                    <p>Mr. Gopal Mishra in conversation with Radio City</p>
                    <img src={process.env.PUBLIC_URL + '/Images/RC-logo-1.png'} alt="radio city icon" style={{width: "70px"}}/>
                </div>
            </div>
            <div className="founders-data col-lg-6 col-md-6 col-sm-12">
                <div className="col-lg-6 col-md-6 col-sm-6 founder-img-div">
                    <a href="https://www.youtube.com/watch?v=H2bDZ4WLlyA"><img className="founder-img"
                            src={process.env.PUBLIC_URL + '/Images/Screenshot 2023-01-29 103021.png'} alt="founder-image"/></a>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 founders-details">
                    <h2>Mr. Vinay Prajapati</h2>
                    <p>Mr. Vinay Prajapati in conversation with Capital 1 TV</p>
                    <img src={process.env.PUBLIC_URL + '/Images/Capital-One-Logo.png'} alt="capital 1 tv" style={{width: "70px"}}/>
                </div>
            </div>
        </div>
    </div>
    </>
  );
};

export default FounderSpeak;