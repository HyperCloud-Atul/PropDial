import React from "react";
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCollection } from "../hooks/useCollection";
import { useDocument } from "../hooks/useDocument"
import "react-image-gallery/styles/css/image-gallery.css";
import Gallery from "react-image-gallery";
import Switch from "react-switch";
import { Navigate, Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import { useAuthContext } from "../hooks/useAuthContext";
// css 
import "./PDSingle.css"

// component 
import PDSingleCard from "./PDSingleCard";
import { Carousel } from "react-bootstrap";
const PDSingle = () => {

    const { id } = useParams()
    // console.log('property id: ', id)
    const { user } = useAuthContext();

    const { document: propertyDoc, error: propertyDocError } = useDocument('properties', id)

    // console.log('property document - unitNumber:', propertyDoc.unitNumber);

    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end
    // get user from useauthcontext
    // const { user } = useAuthContext();
    // get user from useauthcontext
    // const { documents: propertiesdocuments, error: propertieserror } =
    //     useCollection("properties");

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




    // 9 dots controls 
    const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
    const openMoreAddOptions = () => {
        setHandleMoreOptionsClick(true);
    };
    const closeMoreAddOptions = () => {
        setHandleMoreOptionsClick(false);
    };
    // 9 dots controls 


    return (
        <div className="pg_property aflbg pd_single">


            {/* 9 dots html  */}
            <div onClick={openMoreAddOptions} className="property-list-add-property">
                <span className="material-symbols-outlined">apps</span>
            </div>
            <div
                className={
                    handleMoreOptionsClick
                        ? "more-add-options-div open"
                        : "more-add-options-div"
                }
                onClick={closeMoreAddOptions}
                id="moreAddOptions"
            >
                <div className="more-add-options-inner-div">
                    <div className="more-add-options-icons">
                        <h1>Close</h1>
                        <span className="material-symbols-outlined">close</span>
                    </div>

                    <Link to="" className="more-add-options-icons">
                        <h1>Property Image</h1>
                        <span className="material-symbols-outlined">photo_camera</span>
                    </Link>

                    <Link to="" className="more-add-options-icons">
                        <h1>Property Status</h1>
                        <span className="material-symbols-outlined">trending_up</span>
                    </Link>

                    <Link to="" className="more-add-options-icons">
                        <h1>Property Edit</h1>
                        <span className="material-symbols-outlined">edit</span>
                    </Link>
                </div>
            </div>
            {/* 9 dots html  */}


            {/* top search bar */}

            {!user && (
                <div className="top_search_bar">
                    <Link to="/search-property" className="back_btn">
                        <span className="material-symbols-outlined">
                            arrow_back
                        </span>
                        <span>Back</span>
                    </Link>
                </div>
            )}

            {/* <div className="top_search_bar">
                <Link to="/search-property" className="back_btn">
                    <span className="material-symbols-outlined">
                        arrow_back
                    </span>
                    <span>Back</span>
                </Link>
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
                                <span className="material-symbols-outlined btn_arrow ba_animation">
                                    arrow_forward
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div> */}

            <br></br>
            <section className="property_cards">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-9">
                            {propertyDoc && <PDSingleCard propertyDocument={propertyDoc} />}
                        </div>
                        <div className="col-xl-3">
                            <div className="pp_sidebar">
                                <div className="pp_sidebar_cards">
                                    <div className="pp_sidebarcard_single">
                                        <div className="ppss_img">
                                            <img src="/assets/img/property/p2.jpg" alt="" />
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
                                            <img src="/assets/img/property/p2.jpg" alt="" />
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
            </section >
            <br></br>
        </div >


    )
}

export default PDSingle

