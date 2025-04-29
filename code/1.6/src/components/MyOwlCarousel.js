// for use owl carousel we have to install it by this command 
// npm install react-owl-carousel 



import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const MyOwlCarousel = () => {
  const options = {
    items: 1,
    loop: true,
    margin: 10,
    nav: true,
    // animateOut: 'fadeOut', // Fade out animation
    // animateIn: 'fadeIn',   // Fade in animation
    smartSpeed: 2000,
    autoplay: true, // Enable autoplay
    autoplayTimeout: 3000, // Set autoplay interval (in milliseconds)
  };

  return (
    <OwlCarousel className="owl-theme" {...options}>
      <div className="item">1</div>
      <div className="item">2</div>
      <div className="item">3</div>
      <div className="item">4</div>
      <div className="item">5</div>
      <div className="item">6</div>
    </OwlCarousel>
  );
};

export default MyOwlCarousel;
