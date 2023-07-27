import React from "react";
import "./AnimatedImages.css";
const AnimatedImages = () => {
  return (
    <>
    <div className="container">
        <div className="row">
            <div className="animated-img-div col-lg-4 col-md-4 col-sm-12">
                <img src={process.env.PUBLIC_URL + '/Images/home.png'} alt="animated-img" className="animated-img" />
                <div className="animated-img-num">5,12,400+</div>
                <div className="animated-img-text">Properties & Counting...</div>
            </div>
            <div className="animated-img-div  col-lg-4 col-md-4 col-sm-12">
                <img src={process.env.PUBLIC_URL + '/Images/2img.webp'}  alt="animated-img" className="animated-img"/>
                <div className="animated-img-num">4,300+</div>
                <div className="animated-img-text">Properties Listed</div>
            </div>
            <div className="animated-img-div  col-lg-4 col-md-4 col-sm-12">
                <img src={process.env.PUBLIC_URL + '/Images/1.png'} alt="animated-img" className="animated-img"/>
                <div className="animated-img-num">5,500+</div>
                <div className="animated-img-text">Sellers Contacted</div>
            </div>
        </div>
    </div>
    </>
  );
};

export default AnimatedImages;
