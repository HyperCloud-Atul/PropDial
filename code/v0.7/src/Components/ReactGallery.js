// npm install react-image-gallery 


import React from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import Gallery from "react-image-gallery";

const PDSingle = () => {
  const images = [
    {
      original: "./assets/img/p_img/fullview.jpg",
      thumbnail: "./assets/img/p_img/fullview.jpg",
    },
    {
      original: "./assets/img/p_img/drawingroom.jpg",
      thumbnail: "./assets/img/p_img/drawingroom.jpg",
    },
    {
      original: "./assets/img/p_img/balcony.jpg",
      thumbnail: "./assets/img/p_img/balcony.jpg",
    },
    {
      original: "./assets/img/p_img/masterbedroom.jpg",
      thumbnail: "./assets/img/p_img/masterbedroom.jpg",
    },
  ];
  const slideDuration = 1000;

  return (
    <div className="pg_property aflbg pd_single">
      {/* ... rest of your code ... */}
      <div className="bigimage_container">
      <Gallery items={images} slideDuration={slideDuration} />
      </div>
      {/* ... rest of your code ... */}
    </div>
  );
};

export default PDSingle;