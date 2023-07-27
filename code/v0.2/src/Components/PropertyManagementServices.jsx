import React from "react";
import "./PropertyManagementServices.css";
const PropertyManagementServices = () => {
  return (
    <>
     <div className="container">
        <div className="our-services-heading">
            <h3>Property Management <span>Services</span></h3>
            <p>Our Services</p>
            <div className="divider-line"></div>
        </div>
        <div className="row main-service-card ">
            <div className="col-lg-4 col-sm-12 col-md-12 right-service-div">
                <p style={{color: "#EA5632", fontSize: "large"}}>OUR SERVICES
                </p>
                <h2>We make your life a lot easier...</h2>
                <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live
                    the blind texts.
                    Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.
                </p>
                <button type="button" className="btn btn-info">Our Services</button>
            </div>

            <div className="row col-lg-8 col-sm-12 col-md-0 left-service-div">
                <div className="col-lg-4 col-md-4 col-sm-12 left-child-div">
                    <div className="pms-service-card">
                        <i className="bi bi-house-add"></i>
                        <h1>Property On Boarding</h1>
                        <p>Even the all-powerful Pointing has no control about the blind texts </p>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 left-child-div">
                    <div className="pms-service-card">
                        <i className="bi bi-search-heart"></i>
                        <h1>Tenant Discovery</h1>
                        <p>Even the all-powerful Pointing has no control about the blind texts </p>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 left-child-div">
                    <div className="pms-service-card">
                        <i className="bi bi-person-add"></i>
                        <h1>Tenant On Board</h1>
                        <p>Even the all-powerful Pointing has no control about the blind texts </p>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 left-child-div">
                    <div className="pms-service-card">
                        <i className="bi bi-file-earmark-richtext"></i>
                        <h1>Property Inspections and Reports</h1>
                        <p>Even the all-powerful Pointing has no control about the blind texts </p>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 left-child-div">
                    <div className="pms-service-card">
                        <i className="bi bi-sliders2-vertical"></i>
                        <h1>On Demand Maintenance Services</h1>
                        <p>Even the all-powerful Pointing has no control about the blind texts </p>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 left-child-div">
                    <div className="pms-service-card">
                        <i className="bi bi-graph-up-arrow"></i>
                        <h1>Personalised Dashboard For Owner and Tenant</h1>
                        <p>Even the all-powerful Pointing has no control about the blind texts </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    </>
  );
};

export default PropertyManagementServices;
