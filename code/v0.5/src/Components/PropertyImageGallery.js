// npm install react-image-gallery


import React from 'react'
import Gallery from "react-image-gallery";

// css 
import "./PropertyImageGallery.css"
const PropertyImageGallery = () => {
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
        {
            original: "./assets/img/p_img/room_2.jpg",
            thumbnail: "./assets/img/p_img/room_2.jpg",
        },
        {
            original: "./assets/img/p_img/bathroom.jpg",
            thumbnail: "./assets/img/p_img/bathroom.jpg",
        },
    ];
    const slideDuration = 1000;
    return (
        <div className="pcs_image_area">
            <div className="bigimage_container">
                <Gallery items={images} slideDuration={slideDuration} />
            </div>

        </div>
    )
}

export default PropertyImageGallery
