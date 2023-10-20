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
                            <div className="property_card_single">
                                <div className="more_detail_card_inner">
                                    <h2 className="card_title">
                                        Property Type :-
                                    </h2>
                                    <div class="p_info">
                                        <div class="p_info_single">
                                            <h6>Type:</h6>
                                            <h5>2 BHK
                                            </h5>
                                        </div>
                                        <div class="p_info_single">

                                            <h6>Floor no:
                                            </h6>
                                            <h5>
                                                5th
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Age of Property:
                                            </h6>
                                            <h5>12

                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Furnishing:
                                            </h6>
                                            <h5>Semi
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Bedrooms:
                                            </h6>
                                            <h5>2
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Bathrooms:
                                            </h6>
                                            <h5>2
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Balcony:
                                            </h6>
                                            <h5>2
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Kitchen:
                                            </h6>
                                            <h5>1
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Dining Area:
                                            </h6>
                                            <h5>No
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Living & Dining:
                                            </h6>
                                            <h5>Yes
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Passages:
                                            </h6>
                                            <h5>Yes
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Entrance Gallery:
                                            </h6>
                                            <h5>Yes
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Basement:
                                            </h6>
                                            <h5>No
                                            </h5>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="property_card_single">
                                <div className="more_detail_card_inner">
                                    <h2 className="card_title">
                                        Property Size :-
                                    </h2>
                                    <div class="p_info">
                                        <div class="p_info_single">
                                            <h6>Plot Area:</h6>
                                            <h5>1500 SqFt
                                            </h5>
                                        </div>
                                        <div class="p_info_single">

                                            <h6>Super Area:
                                            </h6>
                                            <h5>1500 SqFt
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Built-up Area:
                                            </h6>
                                            <h5>1500 SqFt
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Carpet Area:
                                            </h6>
                                            <h5>1500 SqFt
                                            </h5>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="property_card_single">
                                <div className="more_detail_card_inner">
                                    <h2 className="card_title">
                                        Parking :-
                                    </h2>
                                    <div class="p_info">
                                        <div class="p_info_single">
                                            <h6>Car Parking:</h6>
                                            <h5>2
                                            </h5>
                                        </div>
                                        <div class="p_info_single">

                                            <h6>2 Wheeler Parking:
                                            </h6>
                                            <h5>2
                                            </h5>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="property_card_single">
                                <div className="more_detail_card_inner">
                                    <h2 className="card_title">
                                        Additional Rooms :-
                                    </h2>
                                    <div class="p_info">
                                        <div class="p_info_single">
                                            <h6>Office Room
                                                :</h6>
                                            <h5>1
                                            </h5>
                                        </div>
                                        <div class="p_info_single">

                                            <h6>Pooja Room
                                                :
                                            </h6>
                                            <h5>1
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Servent Room
                                                :
                                            </h6>
                                            <h5>1
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Power Room

                                            </h6>
                                            <h5>1
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Store Room


                                            </h6>
                                            <h5>1
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Study Room


                                            </h6>
                                            <h5>1
                                            </h5>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="property_card_single">
                                <div className="more_detail_card_inner">
                                    <h2 className="card_title">
                                    Additional Area :-
                                    </h2>
                                    <div class="p_info">
                                        <div class="p_info_single">
                                            <h6>Back Yard

                                                :</h6>
                                            <h5>No
                                            </h5>
                                        </div>
                                        <div class="p_info_single">

                                            <h6>Front Yard

                                                :
                                            </h6>
                                            <h5>Yes
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Garage

                                                :
                                            </h6>
                                            <h5>No
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Garden


                                            </h6>
                                            <h5>Yes
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Terrace



                                            </h6>
                                            <h5>Yes
                                            </h5>
                                        </div>                                   
                                    </div>
                                </div>

                            </div>
                            <div className="property_card_single">
                                <div className="more_detail_card_inner">
                                    <h2 className="card_title">
                                    Building :-
                                    </h2>
                                    <div class="p_info">
                                        <div class="p_info_single">
                                            <h6>Total Floors

                                                :</h6>
                                            <h5>22
                                            </h5>
                                        </div>
                                        <div class="p_info_single">

                                            <h6>Apartment on Floor

                                                :
                                            </h6>
                                            <h5>6
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Lift

                                                :
                                            </h6>
                                            <h5>3
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Power Backup


                                            </h6>
                                            <h5>Partial Backup
                                            </h5>
                                        </div>
                                        <div class="p_info_single">
                                            <h6>Terrace



                                            </h6>
                                            <h5>Yes
                                            </h5>
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

