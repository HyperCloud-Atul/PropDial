import React from "react";
import { Link, useLocation } from "react-router-dom";

// css 
import "./Hero.css"

const Hero = (props) => {
  const location = useLocation(); // Get the current location
  // hero display none Array 
  const excludedPaths = ["/", "/about-us", "/contact-us", "/faq", "/privacypolicy", "/terms"];
  const shouldHeroHide = excludedPaths.includes(location.pathname);
  const heroClass = `hero_component ${shouldHeroHide ? "" : "hero_display_none"}`;
  // hero display none Array 
  return (
    <div className={heroClass}>
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
