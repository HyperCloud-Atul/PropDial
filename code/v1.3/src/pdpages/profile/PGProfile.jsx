import { useNavigate } from "react-router-dom";
// styles
import "./PGProfile.css";
// import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import Avatar from "../../components/Avatar";
import { BeatLoader } from "react-spinners";
import { useLogout } from "../../hooks/useLogout";
import Popup from "../../components/Popup";
import { useImageUpload } from "../../hooks/useImageUpload";
import {
  projectStorage,
  projectAuth,
  projectAuthObj,
} from "../../firebase/config";
import { useLocation, Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { Form, Button, Alert } from "react-bootstrap";

export default function PGProfile() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const { user } = useAuthContext();
  // console.log('user:', user)
  const navigate = useNavigate();

  if (!user) navigate("/login");

  const { updateDocument, response } = useFirestore("users-propdial");

  const [userPhoneNumber, setUserPhoneNumber] = useState(
    user && user.phoneNumber
  );

  const [userDetails, setUserDetails] = useState({
    FullName: "",
  });

  const [formError, setFormError] = useState(null);
  const { logout, isPending } = useLogout();
  //Popup Flags
  const [showPopupFlag, setShowPopupFlag] = useState(false);
  const [popupReturn, setPopupReturn] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);
  const [imgUploading, setImgUploading] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(null);
  const { imgUpload, isImgCompressPending, imgCompressedFile } =
    useImageUpload();

  //Popup Flags
  useEffect(() => {
    if (popupReturn) {
      //Logout
      logout();
    }

    var formattedNumber = userPhoneNumber
      ? userPhoneNumber.replace(/(\d{2})(\d{5})(\d{5})/, "+$1 $2-$3")
      : "";
    // console.log('userPhoneNumber formatted: ', formattedNumber)
    setUserPhoneNumber(formattedNumber);

    setUserDetails({
      DisplayName: user && user.displayName,
      FullName:
        user && user.fullName ? user.fullName : user && user.displayName,
      PhoneNumber: user && user.phoneNumber,
      Email: user && user.email,
      City: user && user.city,
      Country: user && user.country,
      Role: user && user.role ? user.role : "owner",
      Roles: user && user.roles ? user.roles : ["owner"],
    });
  }, [popupReturn]);

  //Popup Flags
  const showPopup = async (e) => {
    e.preventDefault();
    setShowPopupFlag(true);
    setPopupReturn(false);
  };

  const showDashboard = () => {
    navigate("/dashboard");
  };

  const handleFileChange = async (e) => {
    // setThumbnail(null)
    setImgUploading(true);
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
    setImgUploading(false);
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
      displayName: camelCase(firstName.toLowerCase()),
      fullName: camelCase(userDetails.FullName.toLowerCase()),
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

  const changeRole = async (changedRole) => {
    console.log("userid:", user.uid);
    console.log("changedRole:", changedRole);
    try {
      await updateDocument(user.uid, {
        rolePropDial: changedRole,
      });
    } catch (err) {
      console.log("Change Role:", err);
    }
  };
  // console.log('userDetails:', userDetails)
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [error, setError] = useState("");

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setError("");
    // console.log("phone:", phone);
    if (
      newPhoneNumber === "" ||
      newPhoneNumber === undefined ||
      newPhoneNumber.length < 10
    ) {
      return setError("Please enter valid Phone Number");
    }
    try {
      // console.log('newPhoneNumber: ', newPhoneNumber)

      // hide buttons
      // id_sendotpButton
      document.getElementById("id_sendotpButton").style.display = "none";

      const phoneProvider = new projectAuthObj.PhoneAuthProvider();
      // console.log('phoneProvider: ', phoneProvider)
      // const recaptchaVerifier = new projectAuthObj.RecaptchaVerifier('recaptcha-container');
      const recaptchaVerifier = new projectAuthObj.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
        }
      );

      // console.log('recaptchaVerifier: ', recaptchaVerifier)
      var newPhoneNumberWithPlus = "+" + newPhoneNumber;
      const id = await phoneProvider.verifyPhoneNumber(
        newPhoneNumberWithPlus,
        recaptchaVerifier
      );
      // console.log('id: ', id)
      setVerificationId(id);

      setchangeNumberScroller(true);
      // alert('Verification code sent!');
    } catch (error) {
      console.error("Error sending verification code:", error.message);
      setError("Error sending verification code");
    }
  };

  const handleChangePhoneNumber = async () => {
    // console.log('In handleChangePhoneNumber')
    try {
      const credential = projectAuthObj.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );

      const currentUser = projectAuth.currentUser;
      await currentUser.updatePhoneNumber(credential);

      // console.log('Phone number updated successfully!')

      //Logout and redirect to login page
      logout();
    } catch (error) {
      // Handle any errors
      console.error("Error changing phone number:", error.message);
      setError("Error changing phone number");
    }
  };

  const [changeNumberScroller, setchangeNumberScroller] = useState(false);
  const [changeNumberDisplay, setchangeNumberDisplay] = useState(false);

  const changeNumberBack = () => {
    // id_sendotpButton
    document.getElementById("id_sendotpButton").style.display = "block";
    setchangeNumberScroller(false);
  };

  const openChangeNumber = () => {
    setchangeNumberDisplay(true);
  };

  const closeChangeNumber = () => {
    setchangeNumberDisplay(false);
  };

  // Unlink old Google account
  const unlinkGoogleAccount = async () => {
    const user = projectAuth.currentUser;
    if (user) {
      // Check if the user is linked with Google
      const isLinkedWithGoogle = user.providerData.some(
        (provider) =>
          provider.providerId === projectAuthObj.GoogleAuthProvider.PROVIDER_ID
      );
      if (isLinkedWithGoogle) {
        try {
          await user.unlink(projectAuthObj.GoogleAuthProvider.PROVIDER_ID);
          await updateDocument(user.uid, {
            email: "",
          });
          console.log("Old Google account unlinked");
        } catch (error) {
          console.error("Error unlinking old Google account", error);
        }
      } else {
        console.log("User is not linked with a Google account");
      }
    }
  };

  // Link new Google account
  const linkNewGoogleAccount = () => {
    // const provider = new firebase.auth.GoogleAuthProvider();
    const provider = new projectAuthObj.GoogleAuthProvider();

    // firebase.auth().currentUser.linkWithPopup(provider)
    projectAuth.currentUser
      .linkWithPopup(provider)
      .then(async (result) => {
        await result.user.updateProfile({
          email: result.user.email,
        });
        await updateDocument(user.uid, {
          email: result.user.email,
        });
        console.log("New Google account linked", result.user);
      })
      .catch((error) => {
        console.error("Error linking new Google account", error);
      });
  };

  // Function to unlink old and link new Google account
  const changeGoogleAccount = () => {
    unlinkGoogleAccount();

    // Add a delay to ensure unlinking is complete before linking a new account
    setTimeout(() => {
      linkNewGoogleAccount();
    }, 1000);
  };


  const referralCode = "rBmt34SXDM6Vtm8cJ3jj";
  const referredById = "1SoZ9LHprrcSyMhGEiPFpRCIPyj1";

  // --------------------HTML UI Codebase------------------
  return (
    <div className="profile_pg pg_bg ">
      {/* Popup Component */}
      <Popup
        showPopupFlag={showPopupFlag}
        setShowPopupFlag={setShowPopupFlag}
        setPopupReturn={setPopupReturn}
        msg={"Are you sure you want to logout?"}
      />
      <section className="hero relative">
        <img src="/assets/img/profile_bg.jpeg" alt=""></img>
      </section>
      <section className="section_name profile_card">
        <div className="container">
          <div className="sn_inner">
            <div className="user_img relative">
              <img src={user && user.photoURL} alt=""></img>
              <input
                type="file"
                onChange={handleFileChange}
                id="profile-upload-input"
                className="profile-upload-input"
              />
              {!imgUploading && (
                <label
                  htmlFor="profile-upload-input"
                  className="profile-upload-label pointer"
                >
                  <span className="material-symbols-outlined">
                    photo_camera
                  </span>
                </label>
              )}
              {imgUploading && (
                <div
                  className="loader d-flex justify-content-center align-items-center"
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: "0",
                  }}
                >
                  <BeatLoader color={"#FF5733"} loading={true} />
                </div>
              )}
            </div>
            <div className="vg22"></div>

            <h4 className="user_name field_with_edit_icon">
              <input
                type="text"
                className="profile-change-name"
                readOnly={isProfileEdit ? false : true}
                // onChange={(e) => setUserFullName(e.target.value)}
                // value={userFullName}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    FullName: e.target.value,
                  })
                }
                value={userDetails && userDetails.FullName}
                style={{
                  width: "100%",
                }}
              ></input>
              <div
                className={`pp_edit_icon pointer ${
                  isProfileEdit ? "edit_done" : ""
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ display: isProfileEdit ? "none" : "" }}
                  onClick={handleProfileEdit}
                >
                  edit
                </span>
                <span
                  className="material-symbols-outlined done"
                  style={{ display: isProfileEdit ? "" : "none" }}
                  onClick={handleProfileSave}
                >
                  done
                </span>
              </div>
            </h4>
            <div className="vg12"></div>
            <h5 className="field_with_edit_icon">
              <input
                type="text"
                maxLength={10}
                readOnly={true}
                // readOnly={isProfileEdit ? false : true}
                className="profile-change-phone"
                // onChange={(e) => setUserPhoneNumber(e.target.value)}
                value={userPhoneNumber}
              ></input>
              <div className="pp_edit_icon">
                <span
                  className="material-symbols-outlined"
                  onClick={openChangeNumber}
                >
                  edit
                </span>
              </div>
            </h5>
            <div>
              <h5>
                {" "}
                {userDetails.City && userDetails.City.trim() + ", "}{" "}
                {userDetails.Country}
              </h5>
            </div>
            <div>
              <h5>{userDetails.Email}</h5>
            </div>
            {/* <h5>
              {user.email} <br />
              <Link onClick={changeGoogleAccount} className="click_text">Unlink Google Account</Link>
            </h5> */}
            <div
              className={
                changeNumberDisplay
                  ? "pop-up-change-number-div open"
                  : "pop-up-change-number-div"
              }
            >
              <div className="direct-div">
                <span
                  onClick={closeChangeNumber}
                  className="material-symbols-outlined close-button"
                >
                  close
                </span>
                <span className="r14">Existing no : {userPhoneNumber} </span>
                <div className="vg12"></div>
                <div className="m22">Enter New Number</div>

                <div className="sroll-outter-div">
                  <div className="sroll-inner-div">
                    <div
                      className="scroll-div"
                      style={{
                        transform: changeNumberScroller
                          ? "translateX(-100%)"
                          : "translateX(0%)",
                      }}
                    >
                      {error && <Alert variant="danger">{error}</Alert>}

                      <form action="" onSubmit={handleSendVerificationCode}>
                        <div className="form_field label_top">
                          <PhoneInput
                            country={"in"}
                            // onlyCountries={['in', 'us']}
                            value={newPhoneNumber}
                            onChange={setNewPhoneNumber}
                            international
                            keyboardType="phone-pad"
                            // countryCallingCodeEditable={false}
                            // countryCodeEditable={false}
                            // disableCountryCode={true}
                            placeholder="Enter New Mobile Number"
                            inputProps={{
                              name: "newPhoneNumber",
                              required: true,
                              // autoFocus: true,
                            }}
                          ></PhoneInput>
                          <div
                            id="id_sendotpButton"
                            className="change-number-button-div"
                          >
                            <button
                              onClick={closeChangeNumber}
                              className="theme_btn no_icon btn_red"
                            >
                              {" "}
                              Cancel
                            </button>
                            <button className="theme_btn btn_fill no_icon">
                              Send OTP
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    <div
                      className="scroll-div"
                      style={{
                        transform: changeNumberScroller
                          ? "translateX(-100%)"
                          : "translateX(0%)",
                      }}
                    >
                      <div className="form_field label_top">
                        <label>OTP</label>
                        <input
                          type="text"
                          placeholder="Enter verification code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          style={{
                            background: "none",
                          }}
                        />
                        {/* new code */}
                        <div className="change-number-button-div">
                          <button
                            onClick={changeNumberBack}
                            className="theme_btn no_icon"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleChangePhoneNumber}
                            className="theme_btn btn_fill no_icon"
                          >
                            Confirm
                          </button>
                        </div>
                        {/* new code */}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: changeNumberScroller ? "none" : "block",
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                  id="recaptcha-container"
                ></div>
                <div
                  style={{
                    display: changeNumberScroller ? "none" : "block",
                    height: "80px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="vg22"></div>
      <div className="container">
        {user && user.status === "active" ? (
          <div className="visit_dashboard">
            <span>Visit Dashboard for more deatils</span>
            <span
              className="theme_btn btn_fill pointer"
              onClick={showDashboard}
            >
              Dashboard
            </span>
          </div>
        ) : (
          <div className="visit_dashboard">
            <span className="text_red">Your account has been deactivated</span>
            <Link to="/contact-us" className="theme_btn btn_fill text-center no_icon">
                    Contact Support
                    </Link>
          </div>
        )}
      </div>

      <button>
        <Link to={`/referrallogin/${referralCode}/${referredById}`}>
          Go to Referral Login
        </Link>
      </button>

      {user && user.roles && user.roles.length > 1 && (
        <div className="container">
          <div className="vg22"></div>
          <div className="vg22_991"></div>

          <div className="form_field st-2 label_top">
            <label htmlFor="">Role</label>
            <div className="form_field_inner">
              <div className="form_field_container">
                <div
                  className="radio_group"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {user.roles.map((userrole) => (
                    <div
                      className="radio_group_single"
                      style={{ width: "100%" }}
                    >
                      <div
                        className={`custom_radio_button ${
                          user && user.role === userrole ? "radiochecked" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="group_furnishing"
                          id={userrole}
                          onClick={(e) => changeRole(userrole)}
                        />
                        <label htmlFor={userrole}>
                          <div className="radio_icon">
                            <span className="material-symbols-outlined add">
                              add
                            </span>
                            <span className="material-symbols-outlined check">
                              done
                            </span>
                          </div>
                          <h6>
                            {userrole === "admin"
                              ? "Admin"
                              : camelCase(userrole.toLowerCase())}
                          </h6>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="vg22"></div>
      <div className="container">
        <div className="row no-gutters">
        <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="property-status-padding-div">
              <div className="profile-card-div">
                <div className="address-div">
                  <div className="icon">
                    <span className="material-symbols-outlined">featured_seasonal_and_gifts</span>
                  </div>
                  <Link to="/referral" className="address-text">
                    <h5>Refer and win</h5>
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
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="property-status-padding-div">
              <div className="profile-card-div">             

              <div className="address-div" style={{ cursor: "pointer" }}>
                  <div className="icon">
                    <span className="material-symbols-outlined">sports</span>
                  </div>

                  <Link to="/referral" className="address-text">
                    <h5>My Referals</h5>
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
<div className="vg22"></div>

          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="property-status-padding-div">
              <div className="profile-card-div">
                <div className="address-div">
                  <div className="icon">
                    <span className="material-symbols-outlined">security</span>
                  </div>

                  <Link to="/how-use" className="address-text">
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
                  <div className="icon">
                    <span className="material-symbols-outlined">sms</span>
                  </div>

                  <Link to="/properties" className="address-text">
                    <h5>Properties</h5>
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

          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="vg22_991"></div>
            <div className="property-status-padding-div">
              <div className="profile-card-div">
                <div
                  className="address-div"
                  style={{ cursor: "pointer" }}
                  onClick={FAQ}
                >
                  <div className="icon">
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
                  <div className="icon">
                    <span className="material-symbols-outlined">logout</span>
                  </div>

                  {user && (
                    <div className="address-text">
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
      </div>
      <div className="vg22"></div>
      <div className="vg22"></div>
    </div>
  );
}
