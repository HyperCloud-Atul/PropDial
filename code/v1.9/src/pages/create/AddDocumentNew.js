import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// component
import PropertySidebar from "../../components/PropertySidebar";

const AddDocumentNew = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  return (
    <div className="dashboard_pg aflbg property_setup property_image">
      <div className="sidebarwidth">
        <PropertySidebar />
      </div>
      <div className="right_main_content">
        <div className="property-detail">
          <div className="accordion" id="a1accordion_section">
            <div className="accordion-item">
              <h2 className="accordion-header" id="a1headingOne">
                <button
                  className="accordion-button"
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
                className="accordion-collapse collapse"
                aria-labelledby="a1headingOne"
                data-bs-parent="#a1accordion_section"
              >
                <div className="accordion-body">
                  <div className="secondary-details-display">
                    <div className="secondary-details-inside-display">
                      <h5 style={{ textAlign: "center" }}>Atul Tripathi</h5>
                      <div
                        className="property-contact-div property-media-icons-horizontal"
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          height: "auto",
                        }}
                      >
                        <div>
                          <span className="material-symbols-outlined">call</span>
                          <h1>Call</h1>
                        </div>
                        <div>
                          <img
                            src="./assets/img/whatsapp_square_icon.png"
                            alt="propdial"
                          />
                          <h1>WhatsApp</h1>
                        </div>
                        <div>
                          <span className="material-symbols-outlined">
                            alternate_email
                          </span>
                          <h1>Mail</h1>
                        </div>
                      </div>
                    </div>
                    <hr className="secondary-details-hr" />
                    <div style={{ width: "100%" }}>
                      <h5 style={{ textAlign: "center" }}>Vinay Prajapati</h5>
                      <div
                        className="property-contact-div property-media-icons-horizontal"
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          height: "auto",
                        }}
                      >
                        <div>
                          <span className="material-symbols-outlined">call</span>
                          <h1>Call</h1>
                        </div>
                        <div>
                          <img src="../img/whatsapp_square_icon.png" alt="propdial" />
                          <h1>WhatsApp</h1>
                        </div>
                        <div>
                          <span className="material-symbols-outlined">
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
          Property Document
        </h2>
        <hr />
        <form>
          <Tabs>
            <TabList>
              <Tab className="pointer">PROPERTY DOCS</Tab>
              <Tab className="pointer">PROPDAIL DOCS</Tab>
              <Tab className="pointer">UTILITY BILLS</Tab>
              <Tab className="pointer">MAINTENANCE BILLS</Tab>
            </TabList>
            <TabPanel className="">
              <div className="row no-gutters">
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 1
                    <div className="indicating-letter"></div>
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 2
                    <div className="indicating-letter"></div>
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 3
                    <div className="indicating-letter"></div>
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 4
                    <div className="indicating-letter"></div>
                  </h4>
                </div>

              </div>
            </TabPanel>
            <TabPanel className="">
              <div className="row no-gutters">
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 1
                    <div className="indicating-letter"></div>
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 2
                    <div className="indicating-letter"></div>
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 3
                    <div className="indicating-letter"></div>
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 4
                    <div className="indicating-letter"></div>
                  </h4>
                </div>

              </div>
            </TabPanel>
            <TabPanel className="">
              <div className="row no-gutters">
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 1
                    <div className="indicating-letter"></div>
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 2
                    <div className="indicating-letter"></div>
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 3
                    <div className="indicating-letter"></div>
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 4
                    <div className="indicating-letter"></div>
                  </h4>
                </div>

              </div>
            </TabPanel>
            <TabPanel className="">
              <div className="row no-gutters">
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 1
                    <div className="indicating-letter"></div>
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 2
                    <div className="indicating-letter"></div>
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 3
                    <div className="indicating-letter"></div>
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="property-img-container">
                    <img src="./assets/img/document1.png"></img>
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                    <span className="material-symbols-outlined upload">
                      publish
                    </span>
                  </div>
                  <h4 className="property_desc">
                    Document 4
                    <div className="indicating-letter"></div>
                  </h4>
                </div>

              </div>
            </TabPanel>
          </Tabs>
        </form>
        <br />
      </div>
    </div>
  )
}

export default AddDocumentNew
