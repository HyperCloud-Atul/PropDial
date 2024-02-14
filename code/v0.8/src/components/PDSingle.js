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
import PDSingleCard from "./property/PropertyDetails";
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
                        <span className="material-symbols-outlined">location_city</span>
                    </Link>

                    <Link to="" className="more-add-options-icons">
                        <h1>Property Document</h1>
                        <span className="material-symbols-outlined">holiday_village</span>
                    </Link>

                    <Link to="" className="more-add-options-icons">
                        <h1>Property Report</h1>
                        <span className="material-symbols-outlined">home</span>
                    </Link>
                    <Link to="" className="more-add-options-icons">
                        <h1>Property Bills</h1>
                        <span className="material-symbols-outlined">home</span>
                    </Link>
                </div>
            </div>


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



            <br></br>
            <section className="property_cards">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-9">
                            {propertyDoc && <PDSingleCard propertyDocument={propertyDoc} />}
                        </div>

                    </div>
                </div>
            </section >
            <br></br>
        </div >


    )
}

export default PDSingle

