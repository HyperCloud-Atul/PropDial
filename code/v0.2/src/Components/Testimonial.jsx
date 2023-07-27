import React from "react";
import "./Testimonial.css";

const Tstimonial = () => {
  return (
    <>
     <div className="review-heading">
        <h3 style={{color: "#EA5632"}}>TESTIMONIAL</h3>
        <h1>Happy Customers</h1>
        <div className="divider-line"></div>
    </div>
    <div className="demod">
        <div class='sk-ww-google-reviews' data-embed-id='113604'></div>
        <script src='https://widgets.sociablekit.com/google-reviews/widget.js' async defer></script>
        <div className="demode"></div>
    </div>
    </>
  );
};

export default Tstimonial;