import React, { useState } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import Gallery from "react-image-gallery";
import Switch from "react-switch";
import { Navigate, Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import { useAuthContext } from "../hooks/useAuthContext";
// css 
import "./PDSingle.css"

// component 
import PropertyImageGallery from "./PropertyImageGallery";
import { Carousel } from "react-bootstrap";
const PDSingle = () => {
      // get user from useauthcontext
  const { user } = useAuthContext();
  // get user from useauthcontext
    // switch 
    const [checked, setChecked] = useState(false);
    const handleChange = (checked) => {
        setChecked(checked);
    };
    // switch 

    // rent and buy acitve 
    const [activeOption, setActiveOption] = useState('Buy');
    const handleOptionClick = (option) => {
        setActiveOption(option);
    };
    // rent and buy acitve 


    // owl Carousel controls 
    const propertyPeople = {
        items: 2.5,
        dots: false,
        loop: true,
        margin: 25,
        nav: false,
        smartSpeed: 1500,
        autoplay: true,
        autoplayTimeout: 5000,
        responsive: {
            // Define breakpoints and the number of items to show at each breakpoint
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            992: {
                items: 2.5,
            },
        },
    };
    // owl Carousel controls 
    return (
        <div className="pg_property aflbg pd_single">
            <div className="top_search_bar">
                <div className="back_btn">
                    <span class="material-symbols-outlined">
                        arrow_back
                    </span>
                    <span>Back</span>
                </div>
                <div className="search_area_header">

                    <div className="for_buy_rent">
                        <div
                            className={`pointer ${activeOption === 'Buy' ? 'active' : ''}`}
                            onClick={() => handleOptionClick('Buy')}
                        >
                            Buy
                        </div>
                        <div
                            className={`pointer ${activeOption === 'Rent' ? 'active' : ''}`}
                            onClick={() => handleOptionClick('Rent')}
                        >
                            Rent
                        </div>
                    </div>
                    <div className="residentail_commercial">
                        <label className={checked ? "on" : "off"}>
                            <div className="switch">
                                <span className={`Residential ${checked ? "off" : "on"}`} >
                                    Residential
                                </span>
                                <Switch
                                    onChange={handleChange}
                                    checked={checked}
                                    handleDiameter={20} // Set the handle diameter (optional)
                                    uncheckedIcon={false} // Hide the wrong/right icon
                                    checkedIcon={false} // Hide the wrong/right icon
                                    className="pointer"
                                />
                                <span className={`Commercial ${checked ? "on" : "off"}`}
                                >
                                    Commercial
                                </span>
                            </div>
                        </label>
                    </div>
                </div>
                <div className="search_area_body">
                    <div className="search_by">
                        <div className="search_by_single">
                            <select name="" id="" className="pointer">
                                <option value="" selected>Select State</option>
                                <option value="">Madhya Pradesh</option>
                                <option value="">Maharastra</option>
                                <option value="">Uttar Pradesh</option>
                                <option value="">Arunachal Pradesh</option>
                            </select>
                        </div>
                        <div className="search_by_single">
                            <select name="" id="" className="pointer">
                                <option value="" selected>Select City</option>
                                <option value="">Ujjain</option>
                                <option value="">Pune</option>
                                <option value="">Indore</option>
                                <option value="">Bhopal</option>
                            </select>
                        </div>
                        <div className="search_by_single">
                            <select name="" id="" className="pointer">
                                <option value="" selected>Select BHK</option>
                                <option value=""> 1 BHK</option>
                                <option value="">2 BHK</option>
                                <option value=""> 3 BHK</option>
                            </select>
                        </div>
                    </div>
                    <div className="search_property pointer">
                        <Link to="/search-property">
                            <button className="theme_btn btn_fill">
                                Search
                                <span class="material-symbols-outlined btn_arrow ba_animation">
                                    arrow_forward
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <br></br>
            <section className="property_cards">
                <div className="container-fluid">
                    <div className="row">
                        <div className='col-xl-9'>
                            <div className="property_card_single">
                                <div className="pcs_inner pointer" to="/pdsingle">

                                    <PropertyImageGallery></PropertyImageGallery>
                                    <div className="pcs_main_detail">
                                        <div className="pmd_top">
                                            <h4 className="property_name">
                                                2 BHK 1030 Sq-ft Flat For Sale<br />
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
                                        <div className="property_full_address">
                                            <h2 className="card_title">A-504</h2>
                                            <h3>High Mont Society, Hinjewadi Phase II</h3>
                                            <h3>Pune, Maharashtra, 411057</h3>
                                        </div>
                                        <div className="property_connected_people userlist">
                                            <OwlCarousel className="owl-theme" {...propertyPeople}>
                                                <div className="item pcp_single">
                                                    <div className="property_people_designation">
                                                        Owner
                                                    </div>
                                                    <div className="single_user">
                                                        <div className="left">
                                                            <div className="user_img">
                                                                <img src="./assets/img/user.png" alt="" />
                                                            </div>
                                                        </div>
                                                        <div className="right">
                                                            <h5>Sanskar Solanki</h5>
                                                            <h6>8770534650</h6>
                                                            <h6>Ujjain, India</h6>
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
                                                <div className="item pcp_single">
                                                    <div className="property_people_designation">
                                                        Co-Owner
                                                    </div>
                                                    <div className="single_user">
                                                        <div className="left">
                                                            <div className="user_img">
                                                                <img src="./assets/img/user.png" alt="" />
                                                            </div>
                                                        </div>
                                                        <div className="right">
                                                            <h5>Naman Gaur</h5>
                                                            <h6>8958965896</h6>
                                                            <h6>Guna, India</h6>
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
                                                <div className="item pcp_single">
                                                    <div className="property_people_designation">
                                                    POC
                                                    </div>
                                                    <div className="single_user">
                                                        <div className="left">
                                                            <div className="user_img">
                                                                <img src="./assets/img/user.png" alt="" />
                                                            </div>
                                                        </div>
                                                        <div className="right">
                                                            <h5>Mohan Yadav</h5>
                                                            <h6>8787854658</h6>
                                                            <h6>Ujjain, India</h6>
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
                                            </OwlCarousel>

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

