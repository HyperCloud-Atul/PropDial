import { useNavigate } from "react-router-dom";
// import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import Avatar from "../../Components/Avatar";
import { useLogout } from "../../hooks/useLogout";
import Popup from "../../Components/Popup";
import { useImageUpload } from "../../hooks/useImageUpload";
import { projectStorage } from "../../firebase/config";
import { useLocation, Link } from "react-router-dom";



// styles
import "./PGProfile.css";

export default function PGProfile() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const { user } = useAuthContext();
  // const { document, error } = useDocument('users', user.uid)
  // const [email, setEmail] = useState('')

  const { updateDocument, response } = useFirestore("users");
  const { document: userDocument, error: userDocumentError } = useDocument(
    "users",
    user.uid
  );

  // console.log('user details:', user.uid)
  const [userFullName, setUserFullName] = useState(user.displayName);
  const [userPhoneNumber, setUserPhoneNumber] = useState(user.phoneNumber);

  const [userDetails, setUserDetails] = useState({
    FullName: '',
  })

  const [formError, setFormError] = useState(null);
  const { logout, isPending } = useLogout();
  //Popup Flags
  const [showPopupFlag, setShowPopupFlag] = useState(false);
  const [popupReturn, setPopupReturn] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const { imgUpload, isImgCompressPending, imgCompressedFile } =
    useImageUpload();

  const navigate = useNavigate();

  //Popup Flags
  useEffect(() => {
    if (popupReturn) {
      //Logout
      logout();
    }

    setUserDetails({
      FullName: userDocument && userDocument.fullName ? userDocument.fullName : user.displayName,
      PhoneNumber: userDocument && userDocument.phoneNumber ? userDocument.phoneNumber : user.phoneNumber,
    })


  }, [popupReturn, userDocument]);

  //Popup Flags
  const showPopup = async (e) => {
    e.preventDefault();
    setShowPopupFlag(true);
    setPopupReturn(false);
  };

  const showDashboard = () => {
    if (userDocument && userDocument.role === "propagent") {
      // console.log('in user', user.role)
      navigate("/agentdashboard");
    }

    // if (user && user.role === "admin") {
    //   // console.log('in admin', user.role)
    //   navigate("/admindashboard");
    // }
  };

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
    const thumbnailName = "profile.png";
    if (compressedImage) {
      const uploadPath = `userThumbnails/${user.uid}/${thumbnailName}`;
      const img = await projectStorage.ref(uploadPath).put(compressedImage);
      imgUrl = await img.ref.getDownloadURL();
      // console.log('imgUrl:', imgUrl)
      await updateDocument(user.uid, {
        photoURL: imgUrl,
      });
      // await user.updateProfile({ photoURL: imgUrl })
    } else {
      //if thumbnail is null
      //user1.png
      // imgUrl = 'https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/thumbnails%2Fthumbnail1.png?alt=media&token=445a89f4-d5c0-495d-8541-496cd8dfd232';
      //user2.png
      imgUrl =
        "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/userThumbnails%2F1default.png?alt=media&token=38880453-e642-4fb7-950b-36d81d501fe2";
      //user3.png
      // imgUrl = 'https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/thumbnails%2Fthumbnail3.png?alt=media&token=36ebeeff-a6a3-4180-a269-61a23cbc3632';
    }

    // console.log('thumbnail updated')
  };

  const [isProfileEdit, setisProfileEdit] = useState(false);

  const handleProfileEdit = async (e) => {
    setisProfileEdit(true);
  };
  const handleProfileSave = async (e) => {
    setisProfileEdit(false);

    let splitName = userDetails.FullName.split(" ");
    // Extract the first name
    let firstName = splitName[0];

    await updateDocument(user.uid, {
      displayName: camelCase(firstName),
      fullName: camelCase(userDetails.FullName)
    });
    // console.log('camelCase(firstName):', camelCase(firstName))
    // console.log('camelCase(userDetails.FullName):', camelCase(userDetails.FullName))
  };

  const handleSubmit = async (e) => {
    // deleteDocument(property.id)
    // history.push('/')
    e.preventDefault();
    setFormError(null);
  };

  const FAQ = (e) => {
    navigate("/faq");
  };

  function camelCase(str) {
    return (
      str
        .replace(/\s(.)/g, function (a) {
          return a.toUpperCase();
        })
        // .replace(/\s/g, '')
        .replace(/^(.)/, function (b) {
          return b.toUpperCase();
        })
    );
  }

  // --------------------HTML UI Codebase------------------
  return (
    <div className="profile_pg pa_bg">

      {/* Popup Component */}
      <Popup
        showPopupFlag={showPopupFlag}
        setShowPopupFlag={setShowPopupFlag}
        setPopupReturn={setPopupReturn}
        msg={"Are you sure you want to logout?"}
      />
      <section className="hero relative">
        <img src="/assets/img/profile_bg.jpeg" alt=''></img>
      </section>
      <section className="section_name profile_card">
        <div className="container">
          <div className="sn_inner">
            <div className="user_img relative">
              <img src={user.photoURL} alt=''></img>
              <input
                type="file"
                onChange={handleFileChange}
                id="profile-upload-input"
                className="profile-upload-input"
              />
              <label
                htmlFor="profile-upload-input"
                className="profile-upload-label pointer"
              >
                <span className="material-symbols-outlined">
                  photo_camera
                </span>
              </label>
            </div>
            <h4 className="user_name">
              <input
                type="text"
                className="profile-change-name"
                readOnly={isProfileEdit ? false : true}
                // onChange={(e) => setUserFullName(e.target.value)}
                // value={userFullName}
                onChange={(e) => setUserDetails({
                  ...userDetails,
                  FullName: e.target.value
                })}
                value={userDetails && userDetails.FullName}
              ></input>
            </h4>
            <h5>
              <input
                type="number"
                maxLength={10}
                readOnly={true}
                // readOnly={isProfileEdit ? false : true}
                className="profile-change-phone"
                onChange={(e) => setUserPhoneNumber(e.target.value)}
                value={userPhoneNumber}
              ></input>
            </h5>
            <h5>
              {user.email}
            </h5>
            <div className={`edit pointer ${isProfileEdit ? "edit_done" : ""}`}>
              <span
                className="material-symbols-outlined"
                style={{ display: isProfileEdit ? "none" : "block" }}
                onClick={handleProfileEdit}
              >
                edit
              </span>
              <span
                className="material-symbols-outlined done"
                style={{ display: isProfileEdit ? "block" : "none" }}
                onClick={handleProfileSave}
              >
                done
              </span>
            </div>

          </div>
        </div>
      </section>
      <div className="verticall_gap"></div>
      <div className="container">
        <div className="visit_dashboard">
          <span>Visit Dashboard for more deatils</span>
          <span className="theme_btn btn_fill pointer" onClick={showDashboard}>
            Dashboard
            <span className="material-symbols-outlined btn_arrow ba_animation">arrow_forward</span>
          </span>

        </div>
      </div>
      <div className="verticall_gap"></div>
      <div className="container">
        <div className="row no-gutters">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="property-status-padding-div">
              <div className="profile-card-div">
                <div className="address-div">
                  <div
                    className="icon"

                  >
                    <span className="material-symbols-outlined">security</span>
                  </div>

                  <Link to='/faq' className="address-text">
                    <h5>How to use this app</h5>
                    <div className="">
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </div>
                  </Link>
                </div>
                <hr
                  style={{
                    margin: "0",
                    border: "none",
                    borderBottom: "15px solid white",
                  }}
                />

                <div className="address-div" style={{ cursor: "pointer" }}>
                  <div
                    className="icon">
                    <span className="material-symbols-outlined">sms</span>
                  </div>

                  <Link to="/createticket" className="address-text" >
                    <h5>Help & Support</h5>
                    <div className="">
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </div>
                  </Link>

                </div>
              </div>
            </div>
          </div>
          <div className="verticall_gap_991"></div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="property-status-padding-div">
              <div className="profile-card-div">
                <div
                  className="address-div"
                  style={{ cursor: "pointer" }}
                  onClick={FAQ}
                >

                  <div
                    className="icon"

                  >
                    <span className="material-symbols-outlined">quiz</span>
                  </div>

                  {user && (
                    <div className="address-text">
                      {/* {!isPending && <button className="btn" onClick={changePwd} >Change Password</button>}
                                        {isPending && <button className="btn" disabled>Processing...</button>} */}
                      <h5>FAQ</h5>
                      <div className="">
                        <span className="material-symbols-outlined">
                          chevron_right
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <hr
                  style={{
                    margin: "0",
                    border: "none",
                    borderBottom: "15px solid white",
                  }}
                />

                <div
                  className="address-div"
                  style={{ cursor: "pointer" }}
                  onClick={showPopup}
                >
                  <div
                    className="icon"

                  >
                    <span className="material-symbols-outlined">logout</span>
                  </div>

                  {user && (
                    <div className="address-text">
                      {/* {!isPending && <button className="btn" onClick={logout}>Logout</button>}
                                        {isPending && <button className="btn" disabled>Logging out...</button>} */}
                      <h5>Logout</h5>
                      <div className="">
                        <span className="material-symbols-outlined">
                          chevron_right
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
      <div className="verticall_gap"></div>
    </div >
  );
}
