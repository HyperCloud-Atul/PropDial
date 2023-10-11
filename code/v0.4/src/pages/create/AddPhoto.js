import { useState, useEffect } from "react";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectStorage, timestamp } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import Select, { components } from "react-select";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useImageUpload } from "../../hooks/useImageUpload";
import DatePicker from "react-datepicker";
import Avatar from "../../Components/Avatar";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// styles
import "./AddBill.css";
import { el } from "date-fns/locale";

// components 
import Hero from "../../Components/Hero";
import PropertySidebar from "../../Components/PropertySidebar";

let photosCount = 0;
export default function AddPhoto(props) {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const { state } = useLocation();
  const { propertyid } = state;
  const navigate = useNavigate();
  const { addDocument, response } = useFirestore("photos");
  // const { document, error } = useDocument('properties', propertyid)
  // const { document: property, error: propertyerror } = useDocument('properties', propertyid)
  const { document: masterDataPhotoType, error: masterDataPhotoTypeerror } =
    useDocument("master", "PHOTOTYPE");
  // const { document: photosDocuments, error: photosDocumentserror } = useCollection('photos', ['propertyid', '==', propertyid])
  const { documents: photosdocuments, error: photoserror } = useCollection(
    "photos",
    ["propertyid", "==", propertyid]
  );

  // if (photosDocuments) {
  //     // photosCount = photosDocuments.length;
  //     console.log('photosDocuments:', photosDocuments)
  // }

  const { user } = useAuthContext();
  const { documents } = useCollection("users");
  const [users, setUsers] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const { imgUpload, isImgCompressPending, imgCompressedFile } =
    useImageUpload();
  // const [toggleFlag, setToggleFlag] = useState(false)

  // form field values
  const [photoType, setPhotoType] = useState("ALL");
  const [photoName, setPhotoName] = useState("");
  const [status, setStatus] = useState("active");
  const [formError, setFormError] = useState(null);
  const [photoTypeOptionsSorted, setphotoTypeOptionsSorted] = useState(null);

  let photoTypeOptions;
  if (masterDataPhotoType) {
    photoTypeOptions = masterDataPhotoType.data.map((photoTypeData) => ({
      label: photoTypeData.toUpperCase(),
      value: photoTypeData,
    }));
  }

  // create user values for react-select
  useEffect(() => {
    if (documents) {
      setUsers(
        documents.map((user) => {
          var userDetails = user.displayName + "(" + user.role + ")";
          // console.log('userDetails:', userDetails)
          return { value: { ...user, id: user.id }, label: userDetails };
        })
      );
    }

    if (photoTypeOptions) {
      setphotoTypeOptionsSorted(
        photoTypeOptions.sort((a, b) => a.label.localeCompare(b.label))
      );
    }
  }, [documents]);

  const handleFileChange = async (e) => {
    setThumbnail(null);
    let file = e.target.files[0];
    // console.log('file original selected:', file)
    // console.log('file size original selected:', file.size)
    // const image = await resizeFile(file);
    // const newImageFile = dataURIToBlob(image);

    const compressedImage = await imgUpload(file, 300, 300);
    // console.log('imgCom compressed in Signup.js', compressedImage);
    // console.log('imgCom size after compressed in Signup.js', compressedImage.size);

    if (!compressedImage) {
      setThumbnailError("Please select a file");
      return;
    }
    if (!compressedImage.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }

    // if (newImageFile.size > 20000000) {
    //   setThumbnailError('Image file size must be less than 20mb')
    //   return
    // }

    setThumbnailError(null);
    setThumbnail(compressedImage);
    console.log("thumbnail updated");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    let imgUrl = "";
    if (thumbnail) {
      // console.log('thumbnail in useSignup 2:', thumbnail)
      console.log("photosCount:", photosCount);
      // console.log('photosDocuments', photosdocuments)
      let photoName = photosdocuments.length + 1 + ".png";
      console.log("photoName:", photoName);
      const uploadPath = `propertyPhotos/${propertyid}/${photoName}`;
      const img = await projectStorage.ref(uploadPath).put(thumbnail);
      imgUrl = await img.ref.getDownloadURL();
    }

    const photo = {
      propertyid,
      photoType: photoType.label,
      photoName,
      photourl: imgUrl,
      status,
    };

    await addDocument(photo);
    // console.log('addDocument:', photo)
    if (!response.error) {
      navigate("/");
    }
  };

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
          Property Images
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
                <div className="col-lg-8 col-md-12">
                  <div className="upload_property_img">
                    <form onSubmit={handleSubmit}>
                      <div className="row no-gutters">
                        <div className="col-sm-6">
                          <div className="form_field st-2 mt-0">
                            <label>No. of Bedrooms</label>
                            <div className="field_inner select">
                              <Select
                                className=""
                                onChange={(option) => setPhotoType(option)}
                                options={photoTypeOptionsSorted}
                                value={photoType}
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    outline: "none",
                                    background: "#eee",
                                    borderBottom: " 1px solid var(--theme-blue)",
                                  }),
                                }}
                              />
                              <div className="field_icon">
                                <span class="material-symbols-outlined">bed</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form_field st-2 mt-0">
                            <label>Total Floor</label>
                            <div className="field_inner">
                              <input
                                required
                                type="text"
                                onChange={(e) => setPhotoName(e.target.value)}
                                value={photoName}
                                placeholder="Photo Name"
                              />
                              <div className="field_icon">
                                <span class="material-symbols-outlined">

                                  table_rows
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-12">
                          <input type="file" onChange={handleFileChange} />
                          {/* {thumbnailError && <div className="error">{thumbnailError}</div>} */}
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <button className="theme_btn btn_fill">Add Photo</button>
                          {formError && <p className="error">{formError}</p>}
                        </div>
                      </div>
                    </form>
                  </div>

                </div>
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
  );
}



// <form onSubmit={handleSubmit} className="auth-form">
//             <div className="row no-gutters">
//               <div className="col-lg-6 col-md-6 col-sm-12">
//                 <div>
//                   <h1 className="owner-heading">Photo Type</h1>
//                   <div className="">
//                     <Select
//                       className=""
//                       onChange={(option) => setPhotoType(option)}
//                       options={photoTypeOptionsSorted}
//                       value={photoType}
//                       styles={{
//                         control: (baseStyles, state) => ({
//                           ...baseStyles,
//                           outline: "none",
//                           background: "#eee",
//                           borderBottom: " 1px solid var(--theme-blue)",
//                         }),
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <br />
//                   <h1 className="owner-heading">Photo Name</h1>
//                   <input
//                     required
//                     type="text"
//                     onChange={(e) => setPhotoName(e.target.value)}
//                     value={photoName}
//                   />
//                 </div>
//                 <label>
//                   <div className="form-field-title">
//                     <span className="material-symbols-outlined">
//                       photo_camera
//                     </span>
//                     <h1>Profile Photo</h1>
//                     <input type="file" onChange={handleFileChange} />
//                   </div>

//                   {/* {thumbnailError && <div className="error">{thumbnailError}</div>} */}
//                 </label>
//               </div>
//             </div>
//             <br />
//             <div style={{ display: "flex", justifyContent: "center" }}>
//               <button className="theme_btn btn_fill">Add Photo</button>
//               {formError && <p className="error">{formError}</p>}
//             </div>
//             <br />
//           </form>