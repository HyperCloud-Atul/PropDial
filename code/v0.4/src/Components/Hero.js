import React from "react";

// css 
import "./Hero.css"

const Hero = (props) => {
  return (
    <div className="hero_component">
      <section className="hero relative">
        <img src={props.heroImage}></img>
      </section>
      <section className="section_name">
        <div className="container">
          <div className="sn_inner">
            <h6>{props.pageSubTitle}</h6>
            <h1>{props.pageTitle}</h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
