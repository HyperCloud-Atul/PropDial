import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "react-image-gallery/styles/css/image-gallery.css";
import Gallery from "react-image-gallery";
import Switch from "react-switch";
import { Navigate, Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import { useAuthContext } from "../hooks/useAuthContext";

// component 
import PropertyImageGallery from "./PropertyImageGallery";
const PDSingleCard = ({ propertiesdocuments }) => {
    // get user from useauthcontext
    const { user } = useAuthContext();
    // get user from useauthcontext
    console.log("propertiesdocument:" ,propertiesdocuments);
    return (
       <>
       {propertiesdocuments.map((property) => (
         <div className=''>
            <div className="property_card_single">
                <div className="pcs_inner pointer" to="/pdsingle">
                    <PropertyImageGallery></PropertyImageGallery>
                    <div className="pcs_main_detail">
                        <div className="pmd_top">
                            <h4 className="property_name">
                            {property.bhk} BHK 1030 Sq-ft Flat For Sale<br />
                            </h4>
                            <h6 className="property_location">Geeta Bhavan, Indore, Madhya pradesh</h6>
                        </div>
                        <div className="divider">
                        </div>
                        <div className="pmd_section2 row">
                            <div className="pdms_single col-4">
                                <h4><span className="currency">₹</span>47.6<span className="price">L</span></h4>
                                <h6>6,999 / sq ft</h6>
                            </div>
                            <div className="pdms_single col-4">
                                <h4>470</h4>
                                <h6>Area in sq ft</h6>
                            </div>
                            <div className="pdms_single col-4">
                                {/* <h4>Under Construction</h4>
                        <h6>Construction status</h6> */}
                            </div>
                        </div>
                        <div className="divider">
                        </div>
                        <div className="pmd_section2 pmd_section3 row">
                            <div className="pdms_single col-4">
                                <h4><img src="./assets/img/home-black.png"></img>2</h4>
                                <h6>BHK</h6>
                            </div>
                            <div className="pdms_single col-4">
                                <h4><img src="./assets/img/double-bed-black.png"></img>2</h4>
                                <h6>Bedrooms</h6>
                            </div>
                            <div className="pdms_single col-4">
                                <h4><img src="./assets/img/bathtub-black.png"></img>2</h4>
                                <h6>Bathroom</h6>
                            </div>
                        </div>
                        <div className="divider">
                        </div>
                        <div className="pmd_section4">
                            <div className="left">
                                <span class="material-symbols-outlined mr-2" style={{
                                    marginRight: "3px"
                                }}>
                                    favorite
                                </span>
                                <span class="material-symbols-outlined">
                                    share
                                </span>
                            </div>
                            <div className="right">
                                <a className="theme_btn no_icon btn_fill" style={{
                                    marginRight: "10px"
                                }}> Contact Agent</a>
                                <a className="theme_btn no_icon btn_border"> Enquire Now</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {user && user.role === "owner" && (
                <div className="property_card_single">
                    <div className="more_detail_card_inner">
                        <div className="row no-gutters">
                            <div className="col-md-6">
                                <div className="property_full_address">
                                    <h2 className="card_title">A-504</h2>
                                    <h3>High Mont Society, Hinjewadi Phase II</h3>
                                    <h3>Pune, Maharashtra, 411057</h3>
                                </div>
                                <div className="property_connected_people userlist">

                                    <div className="item pcp_single">
                                        <div className="property_people_designation">
                                            Property Manager
                                        </div>
                                        <div className="single_user">
                                            <div className="left">
                                                <div className="user_img">
                                                    <img src="./assets/img/user.png" alt="" />
                                                </div>
                                            </div>
                                            <div className="right">
                                                <h5>Khushi Shrivastav</h5>
                                                <h6>9698569856</h6>
                                                <h6>Bhopal, India</h6>
                                            </div>
                                        </div>

                                        <div className="contacts">
                                            <Link to="tel:+918770534650" className="contacts_single">
                                                <div className="icon">
                                                    <span class="material-symbols-outlined">
                                                        call
                                                    </span>
                                                </div>
                                                <h6>
                                                    Call
                                                </h6>
                                            </Link>
                                            <Link to="https://wa.me/918770534650" className="contacts_single">
                                                <div className="icon">
                                                    <img
                                                        src="./assets/img/whatsapp.png"
                                                        alt="" />
                                                </div>
                                                <h6>
                                                    Whatsapp
                                                </h6>
                                            </Link>
                                            <Link to="mailto:solankisanskar8@gmail.com" className="contacts_single">
                                                <div className="icon">
                                                    <span class="material-symbols-outlined">
                                                        mail
                                                    </span>
                                                </div>
                                                <h6>
                                                    Email
                                                </h6>
                                            </Link>
                                        </div>

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="userlist property_owners">
                                    <div class="single_user">
                                        <div className="property_people_designation">Owner
                                        </div>
                                        <div class="left">

                                            <div class="user_img">
                                                <img src="./assets/img/user.png" alt="" />
                                            </div>
                                        </div>
                                        <div class="right">
                                            <h5>Sanskar Solanki</h5>
                                            <h6>8770534650</h6>
                                            <h6>Ujjain, India</h6>
                                            {user && user.role !== "owner" && (
                                                <div class="wc">
                                                    <img src="./assets/img/whatsapp.png" class="pointer" alt="" />
                                                    <img src="./assets/img/phone-call.png" class="pointer" alt="" />

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div class="single_user">
                                        <div className="property_people_designation">
                                            Co-Owner
                                        </div>
                                        <div class="left">
                                            <div class="user_img">
                                                <img src="./assets/img/user.png" alt="" />
                                            </div>
                                        </div>
                                        <div class="right">
                                            <h5>Sanskar Solanki</h5>
                                            <h6>8770534650</h6>
                                            <h6>Ujjain, India</h6>
                                            <div class="wc">
                                                <img src="./assets/img/whatsapp.png" class="pointer" alt="" />
                                                <img src="./assets/img/phone-call.png" class="pointer" alt="" />

                                            </div>
                                        </div>
                                    </div>
                                    <div class="single_user">
                                        <div className="property_people_designation">
                                            POC
                                        </div>
                                        <div class="left">
                                            <div class="user_img">
                                                <img src="./assets/img/user.png" alt="" />
                                            </div>
                                        </div>
                                        <div class="right">
                                            <h5>Sanskar Solanki</h5>
                                            <h6>8770534650</h6>
                                            <h6>Ujjain, India</h6>
                                            <div class="wc">
                                                <img src="./assets/img/whatsapp.png" class="pointer" alt="" />
                                                <img src="./assets/img/phone-call.png" class="pointer" alt="" />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
            {user && user.role === "owner" && (
                <div className="property_card_single">
                    <div className="more_detail_card_inner">
                        <div className="row no-gutters">
                            <div className="col-md-6">
                                <div className="property_full_address">
                                    <h2 className="card_title">escalation matrix</h2>
                                </div>
                                <div className="property_connected_people userlist">

                                    <div className="item pcp_single">
                                        <div className="property_people_designation">
                                            Indian contact number
                                        </div>
                                        <div className="single_user">
                                            {/* <div className="left">
                                        <div className="user_img">
                                            <img src="./assets/img/user.png" alt="" />
                                        </div>
                                    </div> */}
                                            <div className="right">
                                                <h5>+91 9698569856</h5>
                                                <h6>indiacontactnumber@gmail.com</h6>
                                            </div>
                                        </div>
                                        <div className="contacts">
                                            <Link to="tel:+918770534650" className="contacts_single">
                                                <div className="icon">
                                                    <span class="material-symbols-outlined">
                                                        call
                                                    </span>
                                                </div>
                                                <h6>
                                                    Call
                                                </h6>
                                            </Link>
                                            <Link to="https://wa.me/918770534650" className="contacts_single">
                                                <div className="icon">
                                                    <img
                                                        src="./assets/img/whatsapp.png"
                                                        alt="" />
                                                </div>
                                                <h6>
                                                    Whatsapp
                                                </h6>
                                            </Link>
                                            <Link to="mailto:solankisanskar8@gmail.com" className="contacts_single">
                                                <div className="icon">
                                                    <span class="material-symbols-outlined">
                                                        mail
                                                    </span>
                                                </div>
                                                <h6>
                                                    Email
                                                </h6>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="userlist property_owners">
                                    <div class="single_user">
                                        <div className="property_people_designation">Level 1
                                        </div>
                                        <div class="right">
                                            <h5>8770534650</h5>
                                            <h6>level1@gmail.com</h6>
                                            {/* <div class="wc">
                                        <img src="./assets/img/whatsapp.png" class="pointer" alt="" />
                                        <img src="./assets/img/phone-call.png" class="pointer" alt="" />

                                    </div> */}
                                        </div>
                                    </div>
                                    <div class="single_user">
                                        <div className="property_people_designation">Level 2
                                        </div>
                                        <div class="right">
                                            <h5>8770534650</h5>
                                            <h6>level2@gmail.com</h6>
                                            {/* <div class="wc">
                                        <img src="./assets/img/whatsapp.png" class="pointer" alt="" />
                                        <img src="./assets/img/phone-call.png" class="pointer" alt="" />

                                    </div> */}
                                        </div>
                                    </div>
                                    <div class="single_user">
                                        <div className="property_people_designation">Level 3
                                        </div>
                                        <div class="right">
                                            <h5>8770534650</h5>
                                            <h6>level3@gmail.com</h6>
                                            {/* <div class="wc">
                                        <img src="./assets/img/whatsapp.png" class="pointer" alt="" />
                                        <img src="./assets/img/phone-call.png" class="pointer" alt="" />

                                    </div> */}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
            <div className="property_card_single">
                <div className="more_detail_card_inner">
                    <h2 className="card_title">
                        Property Type
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
                        Property Size
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
                        Parking
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
                        Additional Rooms
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
                        Additional Area
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
                        Building
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
                            <h6>Terrace



                            </h6>
                            <h5>Yes
                            </h5>
                        </div>
                        <div class="p_info_single">
                            <h6>Power Backup


                            </h6>
                            <h5>Partial Backup
                            </h5>
                        </div>

                    </div>
                </div>

            </div>
        </div>
        ))}
       </>
    )
}

export default PDSingleCard
