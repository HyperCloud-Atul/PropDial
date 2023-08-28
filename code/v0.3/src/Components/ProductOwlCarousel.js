// for use owl carousel we have to install it by this command 
// npm install owl.carousel

// and after use this we have face some issue about "$ sign because this is the sign of jquery"
// so we have to also install jquery by this command 
// npm install jquery


// after that we have to export it 
// module.exports = {
//     // ... other ESLint configurations ...
//     globals: {
//       $: 'readonly', // Allows $ to be used as a global variable
//     },
//   };





/* global $ */
import React, { useEffect } from 'react';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel';
import $ from 'jquery'; // Import jQuery


// module.exports = {
//     // ... other ESLint configurations ...
//     globals: {
//       $: 'readonly', // Allows $ to be used as a global variable
//     },
//   };

const ProductOwlCarousel = () => {
    useEffect(() => {
        // Initialize Owl Carousel
        $('.owl-carousel').owlCarousel({
          items: 3,
          loop: true,
          margin: 10,
          autoplay: true,
        });
      }, []);
      return (
        <div className="owl-carousel">
          <div className="item">
       item1
          </div>
          <div className="item">Item 2</div>
          <div className="item">Item 3</div>
          {/* Add more items as needed */}
        </div>
      );
    };

export default ProductOwlCarousel
