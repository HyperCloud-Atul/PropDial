import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";


import PropertySidebar from "./PropertySidebar";

const PropertyStatus = () => {
   // Scroll to the top of the page whenever the location changes start
   const location = useLocation();
   useEffect(() => {
     window.scrollTo(0, 0);
   }, [location]);
   // Scroll to the top of the page whenever the location changes end
  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);

  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };



  // switch
  const [toggleFlag, setToggleFlag] = useState(false);
  const [propertyList, setPropertyList] = useState("residential"); //Residential/Commercial
  const toggleBtnClick = () => {
    if (toggleFlag) setPropertyList("residential");
    else setPropertyList("commercial");

    setToggleFlag(!toggleFlag);
  };
  // switch

  
  return (
    <div className="dashboard_pg aflbg property_setup property_image">
      <div className="sidebarwidth">
        <PropertySidebar />
      </div>
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
            <h1>Add Property</h1>
            <span className="material-symbols-outlined">map</span>
          </Link>

          <Link to="" className="more-add-options-icons">
            <h1>Add Image</h1>
            <span className="material-symbols-outlined">location_city</span>
          </Link>

          <Link to="" className="more-add-options-icons">
            <h1>Add Document</h1>
            <span className="material-symbols-outlined">holiday_village</span>
          </Link>

          <Link to="" className="more-add-options-icons">
            <h1>Preview</h1>
            <span className="material-symbols-outlined">home</span>
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
        <h2 className="pg_title">Property Status</h2>
        <hr />
        <div className="d_inner_card">
          <div className="property_status">
            <div className="row">
              <div className="col-lg-7">
                <div className="left">
                  <div
                    className="d-flex"
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="residential-commercial-switch"
                      style={{ top: "0" }}
                    >
                      <span
                        className={toggleFlag ? "" : "active"}
                        style={{ color: "var(--theme-blue)" }}
                      >
                        Active
                      </span>
                      <div
                        className={
                          toggleFlag
                            ? "toggle-switch on commercial"
                            : "toggle-switch off residential"
                        }
                        style={{ padding: "0 10px" }}
                      >
                        {/* <small>{toggleFlag ? 'On' : 'Off'}</small> */}
                        <div onClick={toggleBtnClick}>
                          <div></div>
                        </div>
                      </div>
                      <span
                        className={toggleFlag ? "active" : ""}
                        style={{ color: "var(--theme-orange)" }}
                      >
                        Inactive
                      </span>
                    </div>
                  </div>
                  <div
                    className="d-flex mt-lg-5 mb-lg-5"
                    style={{
                      gap: "4px",
                      color: "#e95733",
                      justifyContent: "center",
                    }}
                  >
                    <span class="material-symbols-outlined">home</span>
                    <span>Residential - 3 BHK</span>
                  </div>
                  <div
                    className="see_img_doc"
                    style={{
                      display: "flex",
                      gap: "35px",
                      justifyContent: "center",
                      paddingTop: "20px",
                    }}
                  >
                    <Link to="/addphoto">
                      <img
                        src="./assets/img/home_image.svg"
                        style={{ height: "80px", marginTop: "-60px" }}
                        alt=""
                      />
                      <h6>IMAGES</h6>
                    </Link>
                    <Link to="/adddocumentnew">
                      <img
                        src="./assets/img/documents.svg"
                        style={{ height: "80px", marginTop: "-60px" }}
                        alt=""
                      />
                      <h6>documents</h6>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="right text-center">
                  <img src="./assets/img/premium_img.jpg" alt="" />
                  <p
                    style={{
                      fontSize: "0.8rem",
                      
                      color: "#666"
                    }}
                  >
                    PMS Premium - PMS After Rent
                  </p>
                  <h6                 
                  >
                    On Boarding 2nd Jan'22
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d_inner_card">
            <div className="row">
                <div className="col-6">
                See & Edit Property Details
                </div>
                <div className="col-6 text-end">
                    <Link className="theme_btn btn_fill">
                 Edit
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyStatus;
