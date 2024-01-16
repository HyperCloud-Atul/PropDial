import React from "react";
import { Link, useLocation } from "react-router-dom";

// css
import "./Footer.css";

// components
import FooterBefore from "./FooterBefore";
import CollapsibleGroup from "./CollapsibleGroup";

export default function Footer() {

  // Function to get the current year
  const getCurrentYear = () => new Date().getFullYear();


  const location = useLocation(); // Get the current location
  //  display none Array 
  const excludedPaths = ["/propagentlogin"];
  const shouldbottom = excludedPaths.includes(location.pathname);
  const classBottom = `copyright-area ${shouldbottom ? "copyright_bottom" : ""}`;
  //  display none Array 



  return (


   <></>

  );
}
