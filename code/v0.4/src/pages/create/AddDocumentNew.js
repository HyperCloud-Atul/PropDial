import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// component
import PropertySidebar from "../../Components/PropertySidebar"; 

const AddDocumentNew = () => {
  return (
    <div className="dashboard_pg aflbg property_setup property_image">
    <div className="sidebarwidth">
      <PropertySidebar />
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
        Property Document
      </h2>
      <br></br>
      <form>
        <Tabs>
          <TabList>
            <Tab className="pointer">ORIGINAL</Tab>
            <Tab className="pointer">INSPECTION</Tab>
            <Tab className="pointer">OTHER</Tab>
          </TabList>
          <TabPanel className="">
            <div className="row no-gutters">
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/fullview.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  house - full view
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/drawingroom.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  DRAWING ROOM
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/masterbedroom.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  MASTER BED ROOM
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/room_1.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  ROOM ADJECENT TO HALL
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/room_2.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  ROOM ADJECENT TO KITCHEN
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/balcony.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  BALCONY
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/kitchen.webp"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  KITCHEN
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/bathroom.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  BATHROOM
                  <div class="indicating-letter"></div>
                </h4>
              </div>
            </div>
          </TabPanel>
          <TabPanel className="">
            <div className="row no-gutters">
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/fullview.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  house - full view
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/drawingroom.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  DRAWING ROOM
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/masterbedroom.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  MASTER BED ROOM
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/room_1.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  ROOM ADJECENT TO HALL
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/room_2.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  ROOM ADJECENT TO KITCHEN
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/balcony.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  BALCONY
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/kitchen.webp"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  KITCHEN
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/bathroom.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  BATHROOM
                  <div class="indicating-letter"></div>
                </h4>
              </div>
            </div>
          </TabPanel>
          <TabPanel className="">
            <div className="row no-gutters">
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/fullview.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  house - full view
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/drawingroom.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  DRAWING ROOM
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/masterbedroom.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  MASTER BED ROOM
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/room_1.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  ROOM ADJECENT TO HALL
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/room_2.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  ROOM ADJECENT TO KITCHEN
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/balcony.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  BALCONY
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/kitchen.webp"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  KITCHEN
                  <div class="indicating-letter"></div>
                </h4>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="property-img-container">
                  <img src="./assets/img/p_img/bathroom.jpg"></img>
                  <span class="material-symbols-outlined delete">
                    delete
                  </span>
                  <span class="material-symbols-outlined upload">
                    publish
                  </span>
                </div>
                <h4 className="property_desc">
                  BATHROOM
                  <div class="indicating-letter"></div>
                </h4>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </form>
    </div>
  </div>
  )
}

export default AddDocumentNew