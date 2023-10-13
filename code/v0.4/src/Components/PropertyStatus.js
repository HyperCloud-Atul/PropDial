import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import PropertySidebar from './PropertySidebar'

const PropertyStatus = () => {
    const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);

    const openMoreAddOptions = () => {
        setHandleMoreOptionsClick(true)
    }
    const closeMoreAddOptions = () => {
        setHandleMoreOptionsClick(false)
    }
    return (
        <div className="dashboard_pg aflbg property_setup property_image">
            <div className="sidebarwidth">
                <PropertySidebar />
            </div>
            <div onClick={openMoreAddOptions} className="property-list-add-property">
                <span className="material-symbols-outlined">
                    apps
                </span>
            </div>
            <div className={handleMoreOptionsClick ? 'more-add-options-div open' : 'more-add-options-div'}
                onClick={closeMoreAddOptions} id="moreAddOptions">

                <div className='more-add-options-inner-div'>

                    <div className="more-add-options-icons">
                        <h1>Close</h1>
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </div>            

                    <Link to='' className="more-add-options-icons">
                        <h1>Add Property</h1>
                        <span className="material-symbols-outlined">
                            map
                        </span>
                    </Link>

                    <Link to='' className="more-add-options-icons">
                        <h1>Add Image</h1>
                        <span className="material-symbols-outlined">
                            location_city
                        </span>
                    </Link>

                    <Link to='' className="more-add-options-icons" >
                        <h1>Add Document</h1>
                        <span className="material-symbols-outlined">
                            holiday_village
                        </span>
                    </Link>

                    <Link to='' className="more-add-options-icons" >
                        <h1>Preview</h1>
                        <span className="material-symbols-outlined">
                            home
                        </span>
                    </Link>
                </div>
            </div>
            <div className="right_main_content">
               
                <div className="property-detail">
                    <div class="accordion" id="a1accordion_section">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="a1headingOne">
                                <button
                                    class="accordion-button"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#a1collapseOne"
                                    aria-expanded="true"
                                    aria-controls="a1collapseOne"
                                >
                                    <div className="inner">
                                        <div className="left">
                                            <h5>A-502</h5>
                                            <h6>
                                                High Mont Society,
                                                <br />
                                                Hinjewadi, Pune
                                            </h6>
                                        </div>
                                        <div className="right">
                                            <h5>Sanskar Solanki</h5>
                                            <h6>8770534650</h6>
                                        </div>
                                    </div>
                                </button>
                            </h2>
                            <div
                                id="a1collapseOne"
                                class="accordion-collapse collapse"
                                aria-labelledby="a1headingOne"
                                data-bs-parent="#a1accordion_section"
                            >
                                <div class="accordion-body">
                                    <div class="secondary-details-display">
                                        <div class="secondary-details-inside-display">
                                            <h5 style={{ textAlign: "center" }}>Atul Tripathi</h5>
                                            <div
                                                class="property-contact-div property-media-icons-horizontal"
                                                style={{
                                                    flexDirection: "row",
                                                    width: "100%",
                                                    height: "auto",
                                                }}
                                            >
                                                <div>
                                                    <span class="material-symbols-outlined">call</span>
                                                    <h1>Call</h1>
                                                </div>
                                                <div>
                                                    <img
                                                        src="./assets/img/whatsapp_square_icon.png"
                                                        alt=""
                                                    />
                                                    <h1>WhatsApp</h1>
                                                </div>
                                                <div>
                                                    <span class="material-symbols-outlined">
                                                        alternate_email
                                                    </span>
                                                    <h1>Mail</h1>
                                                </div>
                                            </div>
                                        </div>
                                        <hr class="secondary-details-hr" />
                                        <div style={{ width: "100%" }}>
                                            <h5 style={{ textAlign: "center" }}>Vinay Prajapati</h5>
                                            <div
                                                class="property-contact-div property-media-icons-horizontal"
                                                style={{
                                                    flexDirection: "row",
                                                    width: "100%",
                                                    height: "auto",
                                                }}
                                            >
                                                <div>
                                                    <span class="material-symbols-outlined">call</span>
                                                    <h1>Call</h1>
                                                </div>
                                                <div>
                                                    <img src="../img/whatsapp_square_icon.png" alt="" />
                                                    <h1>WhatsApp</h1>
                                                </div>
                                                <div>
                                                    <span class="material-symbols-outlined">
                                                        alternate_email
                                                    </span>
                                                    <h1>Mail</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br></br>
                <h2 className="pg_title">
                    Property Status
                </h2>
                <hr />
                <div className='d_inner_card'>
                    <div className="row no-gutters">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="property-status-property-card"
                                style={{ display: "grid", gridTemplateColumns: "100%" }}>
                                <div className="details" style={{ textAlign: "center" }}>

                                    <div className="property-status-property-card-active-toggle-div">
                                        <div style={{ padding: "0 10px 10px 10px" }}>
                                            <div className="switch">
                                                <span className="active" id="ResidentialText"
                                                    style={{ color: "#59981A" }}>Active</span>

                                                <div className="switch-button Residential"
                                                    id="propertyTypeToggleBtn"
                                                    onclick="propertyToggleClick(propertyTypeToggleBtn)">
                                                    <div className="switch-button-inner"></div>
                                                </div>

                                                <span id="CommercialText"
                                                    style={{ color: "#EB542E" }}>Inactive</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ padding: "8px" }}></div>

                                    <span style={{ color: "green" }}>
                                        <span style={{ position: "relative", top: "5px" }}
                                            className="material-symbols-outlined">
                                            home
                                        </span>
                                        Residential - 3 BHK
                                    </span>                             
                                    <br /><br />
                                    <br />
                                    <div className="property-status-image-document">

                                        <a href="propertyImages.html"
                                            className="property-status-image-document-card">
                                            <img src="../img/home_image.svg" alt="" />
                                            <h1>IMAGES</h1>
                                        </a>

                                        <a href="propertyDocument.html"
                                            className="property-status-image-document-card">
                                            <img src="../img/documents.svg" alt="" />
                                            <h1>DOCUMENTS</h1>
                                        </a>

                                    </div>
                                    <div style={{ padding: "13px" }}></div>
                                    <hr className="small" />
                                </div>

                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="premium-card">
                                <img src="../img/premium_img.jpg" width="50%" alt="" />
                                <p style={{ marginTop: "2px" }}>PMS Premium - PMS After Rent
                                </p>
                                <h1 style={{ marginTop: "2px", fontSize: "1.1rem", color: "#EB542E" }}>On Boarding
                                    2nd Jan'22
                                </h1>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        
        </div>
    )
}

export default PropertyStatus
