import React, { useState } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import Gallery from "react-image-gallery";
// css 
import "./PDSingle.css"
const PDSingle = () => {
    // const [images, setImages] = useState([
    //     {
    //         id: 1,
    //         url: "./assets/img/p_img/fullview.jpg",
    //     },
    //     {
    //         id: 2,
    //         url: "./assets/img/p_img/drawingroom.jpg",
    //     },
    //     {
    //         id: 3,
    //         url: "./assets/img/p_img/balcony.jpg",
    //     }
    // ]);

    // const [bigImage, setBigImage] = useState(images[0]);

    // const handleImageClick = (image) => {
    //     const newImages = [...images];
    //     const index = newImages.findIndex((img) => img.id === image.id);
    //     newImages[index] = { ...image, url: bigImage.url };
    //     setImages(newImages);
    //     setBigImage(image);
    // };
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
        <div className="pg_property aflbg pd_single">
            <div className="container-fluid"></div>
            <section className="property_cards">
                <div className="container-fluid">
                    <div className="row">
                        <div className='col-xl-9'>
                            <div className="property_card_single">
                                <div className="pcs_inner pointer" to="/pdsingle">
                                    <div className="pcs_image_area">
                                     <div className="bigimage_container">
                                     {/* <img src={bigImage.url} alt="Big Property Image" className="bigimage" / > */}
                                     <Gallery items={images} slideDuration={slideDuration} />
                                     </div>
                                        {/* <div className="small_images">
                                        {images.map((image, index) => (
                                        <div
                                            key={index}
                                            className="small_image_single"
                                            onClick={() => handleImageClick(image)}
                                        >
                                            
                                                <img src={image.url} alt={`Small Property Image ${index}`} />
                                           
                                        </div>
                                    ))}
                                        </div> */}
                                    </div>
                                
                                    <div className="pcs_main_detail">
                                        <div className="pmd_top">
                                            <h4 className="property_name">
                                                2 BHK 1030 Sq-ft Flat For Sale Geeta Bhavan<br /> Indore, Madhya pradesh
                                            </h4>
                                            <h6 className="property_location">hello</h6>
                                        </div>
                                        <div className="pmd_body">
                                            <div className="property_information">
                                                <div className="pi_single">
                                                    <h6>Carpet area</h6>
                                                    <h5>8500 sqft</h5>
                                                </div>
                                                <div className="pi_single">
                                                    <h6>STATUS</h6>
                                                    <h5>Ready to Move</h5>
                                                </div>
                                                <div className="pi_single">
                                                    <h6>TRANSACTION</h6>
                                                    <h5>New Property</h5>
                                                </div>
                                                <div className="pi_single">
                                                    <h6>FURNISHING</h6>
                                                    <h5>Unfurnished</h5>
                                                </div>
                                                <div className="pi_single">
                                                    <h6>Society</h6>
                                                    <h5>Indore</h5>
                                                </div>
                                                <div className="pi_single">
                                                    <h6>BHK</h6>
                                                    <h5>2</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3">
                            <div className="pp_sidebar">
                                <div className="pp_sidebar_cards">
                                    <div className="pp_sidebarcard_single">
                                        <div className="ppss_img">
                                            <img src="./assets/img/property/p2.jpg" alt="" />
                                        </div>
                                        <div className="ppss_header">
                                            <h5>Brij Residency Phase 2</h5>
                                            <h6>GRV Constructions</h6>
                                            <h6 className="location">MR 11, Indore</h6>
                                        </div>
                                        <div className="ppss_footer">
                                            <h6>1, 3 BHK Flats</h6>
                                            <h6>
                                                <span>₹ 22.2 Lac</span> onwards
                                            </h6>
                                            <h6>Marketed by D2R</h6>
                                        </div>
                                    </div>
                                    <div className="pp_sidebarcard_single">
                                        <div className="ppss_img">
                                            <img src="./assets/img/property/p2.jpg" alt="" />
                                        </div>
                                        <div className="ppss_header">
                                            <h5>Brij Residency Phase 2</h5>
                                            <h6>GRV Constructions</h6>
                                            <h6 className="location">MR 11, Indore</h6>
                                        </div>
                                        <div className="ppss_footer">
                                            <h6>1, 3 BHK Flats</h6>
                                            <h6>
                                                <span>₹ 22.2 Lac</span> onwards
                                            </h6>
                                            <h6>Marketed by D2R</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <br></br>
        </div>


    )
}

export default PDSingle

