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

// styles
import "./PGProfile.css";

export default function PGProfile() {
  const { user } = useAuthContext();
  // const { document, error } = useDocument('users', user.uid)
  // const [email, setEmail] = useState('')
  const [userFullName, setUserFullName] = useState(user.fullName);
  const [userPhoneNumber, setUserPhoneNumber] = useState(user.phoneNumber);
  const { updateDocument, response } = useFirestore("users");
  const { document: userDocument, error: userDocumentError } = useDocument(
    "users",
    user.uid
  );
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
  }, [popupReturn]);

  //Popup Flags
  const showPopup = async (e) => {
    e.preventDefault();
    setShowPopupFlag(true);
    setPopupReturn(false);
  };

  const showDashboard = () => {
    if (user && user.role === "user") {
      // console.log('in user', user.role)
      navigate("/userdashboard");
    }

    if (user && user === "superadmin") {
      // console.log('in superadmin', user.role)
      navigate("/superadmindashboard");
    }

    if (user && user.role === "admin") {
      // console.log('in admin', user.role)
      navigate("/admindashboard");
    }

    if (user && user.role === "owner") {
      // console.log('in user', user.role)
      navigate("/ownerdashboard");
    }

    if (user && user.role === "tenant") {
      // console.log('in user', user.role)
      navigate("/tenantdashboard");
    }

    if (user && user.role === "executive") {
      // console.log('in user', user.role)
      navigate("/executivedashboard");
    }
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
    // setUserFullName(e.target.value)
    // console.log('e.target.value:', e)
    await updateDocument(user.uid, {
      fullName: userFullName,
      phoneNumber: userPhoneNumber,
    });
  };

  const handleSubmit = async (e) => {
    // deleteDocument(property.id)
    // history.push('/')
    e.preventDefault();
    setFormError(null);
  };

  const changePwd = (e) => {
    navigate("/updatepwd");
  };

  // --------------------HTML UI Codebase------------------
  return (
    <div>
      {/* Popup Component */}
      <Popup
        showPopupFlag={showPopupFlag}
        setShowPopupFlag={setShowPopupFlag}
        setPopupReturn={setPopupReturn}
        msg={"Are you sure you want to logout?"}
      />

      <div className="profile-card-div">
        <div className="content">
          <div className="user-name">
            <div className="user-logo-parent-div">
              <div className="user-logo">
                <Avatar src={user.photoURL} />
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                id="profile-upload-input"
                className="profile-upload-input"
              />
              <label
                htmlFor="profile-upload-input"
                className="profile-upload-label"
              >
                <span className="material-symbols-outlined">upload</span>
              </label>
            </div>

            <div className="details">
              <input
                type="text"
                className="profile-change-name"
                readOnly={isProfileEdit ? false : true}
                onChange={(e) => setUserFullName(e.target.value)}
                value={userFullName}
              ></input>
              <input
                type="number"
                maxLength={10}
                readOnly={isProfileEdit ? false : true}
                className="profile-change-phone"
                onChange={(e) => setUserPhoneNumber(e.target.value)}
                value={userPhoneNumber}
              ></input>
              <p style={{ paddingLeft: "8px" }}>{user.email}</p>
            </div>

            <div className="edit">
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

        <div className="edit-profile-div">
          <small>Visit Dashboard for more deatils</small>
          <div>
            <div></div>
            <button type="button" className="btn" onClick={showDashboard}>
              Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="row no-gutters">
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className="property-status-padding-div">
            <div className="profile-card-div">
              <div className="address-div">
                <div
                  className="icon"
                  style={{ background: "rgba(84,204,203,0.3)" }}
                >
                  <span className="material-symbols-outlined">security</span>
                </div>

                <div className="address-text">
                  <h5>Security alert list</h5>
                  <div className="">
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  margin: "0",
                  border: "none",
                  borderBottom: "1px solid #eee",
                }}
              />

              <div className="address-div" style={{ cursor: "pointer" }}>
                <div
                  className="icon"
                  style={{ background: "rgba(84,204,203,0.3)" }}
                >
                  <span className="material-symbols-outlined">sms</span>
                </div>

                <div className="address-text">
                  {/* {!isPending && <button className="btn" onClick={sendEmail} >Send Email</button>}
                                        {isPending && <button className="btn" disabled>Processing...</button>} */}
                  <h5>Help & Support</h5>
                  <div className="">
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className="property-status-padding-div">
            <div className="profile-card-div">
              <div
                className="address-div"
                style={{ cursor: "pointer" }}
                onClick={changePwd}
              >
                <div
                  className="icon"
                  style={{ background: "rgba(84,204,203,0.3)" }}
                >
                  <span className="material-symbols-outlined">lock_open</span>
                </div>

                {user && (
                  <div className="address-text">
                    {/* {!isPending && <button className="btn" onClick={changePwd} >Change Password</button>}
                                        {isPending && <button className="btn" disabled>Processing...</button>} */}
                    <h5>Change Password</h5>
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
                  borderBottom: "1px solid #aaa",
                }}
              />

              <div
                className="address-div"
                style={{ cursor: "pointer" }}
                onClick={showPopup}
              >
                <div
                  className="icon"
                  style={{ background: "rgba(84,204,203,0.3)" }}
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
      <br />
      {/* <form onSubmit={handleSubmit}>
                <label>
                    <span>Full Name:</span>
                    <input
                        required
                        type="text"
                        placeholder={user.displayName}
                        onChange={(e) => setFullName(e.target.value)}
                        value={fullName}
                    />
                </label>
                <label>
                    <span>Phone:</span>
                    <input
                        required
                        type="text"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                    />
                </label>

                <button className="btn">Save</button>

            </form> */}
    </div>
  );
}
