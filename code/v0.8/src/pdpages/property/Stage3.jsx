import React from 'react'
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import { timestamp, projectStorage } from "../../firebase/config";
// import Adcarousel from "../../../Components/Ads";
import Gallery from "react-image-gallery";
import Popup from "../../components/Popup";

import { useImageUpload } from "../../hooks/useImageUpload";

export default function Stage3(props) {
  const { propertyid } = useParams();
  // console.log('property id in Stage 2: ', propertyid)
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const { imgUpload, isImgCompressPending, imgCompressedFile } =
    useImageUpload();
  const { updateDocument, response } = useFirestore("properties");
  //Popup Flags
  const [showPopupFlag, setShowPopupFlag] = useState(false);
  const [popupReturn, setPopupReturn] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const { document: propertyDocument, error: propertyerror } = useDocument(
    "properties",
    propertyid
  );

  const [propertyDetails, setPropertyDetails] = useState({
    _imgURL: []
  })
  useEffect(() => {
    if (propertyDocument) {
      // console.log('propertyDocument:', propertyDocument)
      setPropertyDetails({
        _imgURL: propertyDocument.imgURL
          ? propertyDocument.imgURL
          : [],
      })
    }
  }, [propertyDocument])

  function handleBackSubmit() {
    props.setStateFlag('stage2');
  }
  const handleNextSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    navigate("/agentproperties", {
      state: {
        propSearchFilter: 'PENDING APPROVAL'
      }
    });
  }
  const handleFileChange = async (e) => {
    // setThumbnail(null)
    let file = e.target.files[0];
    // console.log('file original selected:', file)
    // console.log('file size original selected:', file.size)

    const compressedImage = await imgUpload(file, 300, 300);

    if (!compressedImage) {
      setThumbnailError("Please select a file");
      return;
    }
    if (!compressedImage.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }

    // setThumbnailError(null)

    let imgUrl = "";

    const thumbnailName = timestamp.fromDate(new Date()) + ".png";
    console.log('thumbnailName:', thumbnailName)
    const propertyimagesfolder = "Images";
    if (compressedImage) {
      const uploadPath = `properties/${propertyid}/${propertyimagesfolder}/${thumbnailName}`;
      const img = await projectStorage.ref(uploadPath).put(compressedImage);
      imgUrl = await img.ref.getDownloadURL();
      // console.log('imgUrl:', imgUrl)

      var propertyImages = propertyDetails._imgURL
      propertyImages.push(imgUrl)

      await updateDocument(propertyid, {
        imgURL: propertyImages,
      });

    }
    // console.log('thumbnail updated')
  };
  //Popup Flags
  //Popup Flags
  useEffect(() => {
    (async () => {
      if (popupReturn) {
        //Delete that item from collection & storage
        console.log('selected image url:', currentImageUrl)
        //Delete value from an images arrage
        // Update the array field using arrayRemove
        var propertyImages = propertyDetails._imgURL
        console.log('Original Array:', propertyImages)
        const revisedPropertyImagesArray = propertyImages.filter((img) => img !== currentImageUrl);
        console.log('revisedPropertyImagesArray:', revisedPropertyImagesArray)
        await updateDocument(propertyid, {
          imgURL: revisedPropertyImagesArray,
        });

        //Delete from storage        
        const imageRef = projectStorage.refFromURL(currentImageUrl);
        // Delete the image
        await imageRef.delete();
      }
    })()

  }, [popupReturn]);

  const showPopup = async (e) => {
    e.preventDefault();
    setShowPopupFlag(true);
    setPopupReturn(false);
  };
  const handleSlide = (currentIndex) => {
    // currentIndex is the index of the currently displayed image
    // console.log('current image index:', currentIndex)
    const currentImage = propertyDocument.imgURL[currentIndex];
    // console.log('current image :', currentImage)
    // console.log('current image url original:', currentImage.original)
    setCurrentImageUrl(currentImage);
    // setCurrentImageUrl(currentImage.original);
  };
  return (
    <>
      <Popup
        showPopupFlag={showPopupFlag}
        setShowPopupFlag={setShowPopupFlag}
        setPopupReturn={setPopupReturn}
        msg={"Are you sure you want to delete?"}
      />
      <form>
        <div className='add_property_fields'>
          <div className="pcs_image_area">
            <div className="bigimage_container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {propertyDetails._imgURL.length > 0 ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                  {propertyDetails._imgURL.length > 1 && <div className='img-delete-icon' onClick={showPopup}>
                    <span className="material-symbols-outlined">
                      delete
                    </span>
                  </div>}
                  <Gallery onSlide={handleSlide} style={{ background: 'red' }}
                    items={propertyDocument && propertyDocument.imgURL
                      // .filter((url) => url)
                      .map((url) => ({
                        original: url,
                        thumbnail: url,
                      }))}
                    slideDuration={1000}
                  />
                </div>) : <div style={{ position: 'relative', textAlign: 'center', width: '100%', maxWidth: '600px' }}> <img width='100%' src='/assets/img/default_property_image.jpg' alt='default property pic'></img></div>}
              {/* Box for adding more images */}
              {propertyDetails._imgURL.length < 20 && (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ margin: "15px 0px" }}
                >
                  <input
                    id="profile-upload-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="profile-upload-input"
                    className="mybutton button_transparent pointer"
                  >
                    <span>
                      Add More Images
                    </span>
                  </label>
                </div>
              )}
            </div>
            {
              propertyDetails._imgURL.length > 0 && <div>
                <div style={{ textAlign: 'center', fontSize: '0.8rem', fontStyle: 'italic' }}>
                  {/* <strong>Note: </strong> */}
                  Image count : {propertyDetails._imgURL.length} out of 20
                </div>
              </div>
            }
            <div className="verticall_gap"></div>
            <div className="verticall_gap"></div>
            <div style={{ textAlign: 'center', fontSize: '0.8rem', fontStyle: 'italic' }}>
              <strong>Note: </strong>
              A maximum of 20 images can be added for the property.
            </div>
          </div>
        </div>
        <div className="verticall_gap"></div>
        <div style={{ display: "flex", alignItems: "center" }} className='next_btn_back bottom_fixed_button'>
          <div className="" style={{ width: "100%", padding: '0 20px 0 0' }}>
            {formError && <p className="error">{formError}</p>}
            <button className="theme_btn btn_fill" onClick={handleBackSubmit} style={{
              width: "100%"
            }}>
              {"<< Back"}
            </button>
          </div>

          <div className="" style={{ width: "100%", padding: '0 0 0 20px' }}>
            <button className="theme_btn btn_fill" onClick={handleNextSubmit} style={{
              width: "100%"
            }}>
              {"Submit"}
            </button>
          </div>

        </div>
      </form >

    </>
  )
}
