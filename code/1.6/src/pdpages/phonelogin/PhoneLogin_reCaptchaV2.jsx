import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import PhoneInput, { allCountries } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// import 'flag-icon-css/css/flag-icon.min.css';
import OtpInput from "react-otp-input";

import { useSignupPhone } from "../../hooks/useSignupPhone";
import { useCollection } from "../../hooks/useCollection";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  projectAuth,
  projectAuthObj,
  projectFirestore,
  timestamp,
} from "../../firebase/config";
import { fetchSignInMethodsForEmail } from "firebase/auth";

// css
import "./PhoneLogin.scss";
import { displayName } from "react-quill";

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

// Simple email validation regex
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const PhoneLogin_reCaptchaV2 = () => {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { user1 } = useAuthContext();

  const handleSendOtpClick = () => {
    // Add logic to send OTP or perform any other action
    setShowOtpInput(true);
  };

  const { documents: dbUsers, error: dbuserserror } =
    useCollection("users-propdial");

  // login with phone code start
  // use states
  const [user, setUser] = useState();
  const [activeTab, setActiveTab] = useState(1);
  const [isNewUser, setIsNewUser] = useState(false);
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [country, setCountryName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [whoAmI, setWhoAmI] = useState("");
  const [error, setError] = useState("");
  const [otptimer, setOtpTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const { setUpRecapcha, resendOTP } = useSignupPhone();
  const [confirmObj, setConfirmObj] = useState("");
  const [userName, setUserName] = useState("");
  const [mobilenoSliderState, setmobilenoSliderState] = useState(true);
  const [otpSliderState, setotpSliderState] = useState(false);
  const [newUserSliderState, setnewUserSliderState] = useState(false);
  const [genderSlider, setGenderSlider] = useState(false);
  const [personalInfoSlider, setPersonalInfoSlider] = useState(false);
  const [whoAmISlider, setWhoAmISlider] = useState(false);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);
  const navigate = useNavigate();
  // const [isNewUser, setIsNewUser] = useState(false);
  const [sendOTPFlag, setSendOTPFlag] = useState(true);
  const [flag, setFlag] = useState(false);
  const [resendOTPFlag, setResendOTPFlag] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpHidden, setIsOtpHidden] = useState(true); // By default, OTP is hidden

  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("users-propdial");

  const handleWheel = (e) => {
    // Prevent scrolling changes
    e.preventDefault();
  };

  useEffect(() => {
    let interval;

    if (otpSliderState && otptimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    else if (otptimer === 0) {
      setIsResendDisabled(false); // Jab timer 0 ho tabhi enable ho
    }

    return () => clearInterval(interval);
  }, [otpSliderState, otptimer]); // Dependency fix

  const handleResendOtp = () => {
    handleGoBack()
    setOtpTimer(60);
    setIsResendDisabled(true);  // Timer restart ke sath hi disable bhi ho
  };

  // Google authentication
  const signInWithGoogle = () => {
    const provider = new projectAuthObj.GoogleAuthProvider();
    projectAuth
      .signInWithPopup(provider)
      .then(async (result) => {
        // User signed in
        console.log(result.user);
        const user = result.user;

        if (result.additionalUserInfo.isNewUser) {
          console.log("New user signed in with Google");
          console.log("new user created:", user);
          setUserName(user.displayName);
          // Split the full name by space
          let splitName = userName.split(" ");

          // Extract the first name
          let firstName = splitName[0];

          let imgUrl = "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/userThumbnails%2F1default.png?alt=media&token=38880453-e642-4fb7-950b-36d81d501fe2";

          await user.updateProfile({
            phoneNumber: phone,
            displayName: firstName,
            photoURL: imgUrl,
            email: user.email,
          });

          projectFirestore
            .collection("users-propdial")
            // .doc(user.uid)
            .doc(phone)
            .set({
              online: true,
              displayName: firstName,
              fullName: userName,
              // email,
              phoneNumber: phone,
              email: user.email,
              city,
              address,
              whoAmI,
              gender,
              country,
              countryCode,
              photoURL: imgUrl,
              rolePropAgent: "na",
              rolePropDial: "owner",
              rolesPropAgent: ["propagent"],
              rolesPropDial: ["owner"],
              status: "active",
              createdAt: timestamp.fromDate(new Date()),
              lastLoginTimestamp: timestamp.fromDate(new Date()),
            });
        } else {
          console.log("Existing user signed in with Google");
          console.log("existing user:", user);
          let role = "owner";
          const docRef = projectFirestore.collection("users-propdial").doc(phone);
          // Get the document snapshot
          const docSnapshot = await docRef.get();
          // Check if the document exists
          if (docSnapshot.exists) {
            // Extract the data from the document snapshot
            // const data = docSnapshot.data();
            if (docSnapshot.data().rolePropDial === "na") role = "owner";
            else role = docSnapshot.data().rolePropDial;
          }

          // console.log('role: ', role)
          await user.updateProfile({
            email: user.email,
          });

          await updateDocument(phone, {
            rolePropDial: role,
            online: true,
            email: user.email,
            lastLoginTimestamp: timestamp.fromDate(new Date()),
          });
        }

        // navigate("/profile");
      })
      .catch((error) => {
        // Handle Errors here.
        console.error(error);
      });
  };

  //Link Google Account with phone number
  const linkGoogleAccount = (curuser) => {
    const provider = new projectAuthObj.GoogleAuthProvider();

    curuser
      .linkWithPopup(provider)
      .then(async (result) => {
        const user = result.user;
        // Accounts successfully linked
        console.log("Accounts successfully linked", user);
        await updateDocument(phone, {
          email: user.email,
        });
      })
      .catch((error) => {
        // Handle Errors here.
        console.error("Error linking accounts", error);
      });
  };


  //New optimized code 
  const allSliderVisible = (state) => {
    setmobilenoSliderState(state)
    setotpSliderState(state)
    setGenderSlider(state)
    setPersonalInfoSlider(state)
    setWhoAmISlider(state)
  }

  // send opt
  const getOTP = async (e) => {
    e.preventDefault();

    // console.log("In getOTP");
    setError("");
    if (phone === "" || phone === undefined || phone.length < 10) {
      return setError("Please enter valid mobile number");
    }

    const checkExistingUser =
      // dbUsers && dbUsers.filter((item) => item.phoneNumber === phone);
      dbUsers && dbUsers.filter((item) => item.id === phone);
    console.log("checkExistingUser:", checkExistingUser);

    if (checkExistingUser && checkExistingUser.length > 0) {
      // console.log("checkExistingUser[0].status:", checkExistingUser[0].status);
      if (checkExistingUser[0].status === "inactive") {
        navigate("/inactiveuser");
        return;
      }
      // console.log('existing user')
      setIsNewUser(false);
    } else {
      console.log("set new user");
      setIsNewUser(true);
    }

    try {
      setIsLoading(true); // Start the loader
      const respons = await setUpRecapcha("+" + phone);
      setConfirmObj(respons);

      setIsLoading(true); // Start the loader
      allSliderVisible(false)
      setotpSliderState(true)

    }
    catch (err) {
      console.log("Error : ", err.message);
      setIsLoading(false); // loading false
    }
  }

  // OTP change hote hi Confirm button enable/disable hoga
  useEffect(() => {
    if (!otp || otp.length !== 6) {
      setIsConfirmDisabled(true);
    } else {
      setIsConfirmDisabled(false);
    }
  }, [otp]);

  // OTP verify
  const verifyOTP = async (e) => {
    if (isConfirmDisabled) return;
    try {
      setIsLoading(true); // Start the loader     

      await confirmObj.confirm(otp).then(async (result) => {
        const user = result.user;
        setUser(user)

        // Check if the user is new
        if (isNewUser) {
          console.log("New User Signed-In");
          allSliderVisible(false)
          setnewUserSliderState(true)
          setGenderSlider(true)

        }
        else {//Existing User
          console.log("Existing User Signed-In")
          allSliderVisible(false)
          console.log("existing user:", user);
          console.log("phone: ", phone)
          let role = "owner";
          const docRef = projectFirestore
            .collection("users-propdial")
            // .doc(user.uid);
            .doc(phone);
          // Get the document snapshot
          const docSnapshot = await docRef.get();
          // Check if the document exists
          if (docSnapshot.exists) {
            // Extract the data from the document snapshot
            // const data = docSnapshot.data();
            if (docSnapshot.data().rolePropDial === "" || docSnapshot.data().rolePropDial === "na") role = "owner";
            else role = docSnapshot.data().rolePropDial;
          }

          // console.log('role: ', role)
          // await updateDocument(user.uid, {
          await updateDocument(phone, {
            rolePropDial: role,
            online: true,
            lastLoginTimestamp: timestamp.fromDate(new Date()),
          });

          navigate("/dashboard"); //Navigae to dashboard 
        }
      })
      setIsLoading(false); // stop   the loader
    }
    catch (error) {
      setIsLoading(false); // stop the loader
      console.log("error.message", error.message);
      setError(
        "Given OTP is not valid, please enter the valid OTP sent to your mobile"
      );

      setTimeout(function () {
        setError("");
        setResendOTPFlag(true);
      }, 10000);

    }
  }


  const toggleOtpVisibility = () => {
    setIsOtpHidden(!isOtpHidden); // Toggles the OTP visibility
  };

  const handleNewUserData = async () => {
    console.log("in handleNewUserData")

    let splitName = name.split(" ");
    displayName = splitName.length > 0 ? splitName[0] : name;
    // console.log("User Display or First Name: ", displayName)
    // console.log("User Full Name: ", name)
    // console.log("User Gender: ", gender)
    // console.log("User Email: ", email)
    // console.log("User City: ", city)
    // console.log("User WhoAmI: ", whoAmI)


    let imgUrl = "/assets/img/dummy_user.png";

    try {

      await user.updateProfile({
        phoneNumber: phone,
        displayName: camelCase(displayName.toLowerCase()),
        photoURL: imgUrl,
      });

      projectFirestore
        .collection("users-propdial")
        // .doc(user.uid)
        .doc(phone)
        .set({
          online: true,
          whatsappUpdate: false,
          displayName: camelCase(displayName.toLowerCase()),
          fullName: camelCase(name.toLowerCase()),
          phoneNumber: phone,
          email: email.toLowerCase().trim(),
          city: camelCase(city.toLowerCase().trim()),
          address: camelCase(address.toLowerCase().trim()),
          gender,
          whoAmI,
          country,
          propertyManagerID: phone,
          countryCode,
          photoURL: imgUrl,
          // rolePropAgent: "agent",
          rolePropDial: "owner",
          // rolesPropAgent: ["agent"],
          rolesPropDial: ["owner"],
          accessType: "country",
          accessValue: ["India"],
          status: "active",
          createdAt: timestamp.fromDate(new Date()),
          createdBy: phone,
          lastLoginTimestamp: timestamp.fromDate(new Date()),
          //Employee Details
          dateofJoinee: "",
          dateofLeaving: "",
          employeeId: "",
          reportingManagerId: "",
          department: "",
          designation: "",
          uan: "",
          pan: "",
          aadhaar: ""
        });

      console.log("User Created Successfully")

      navigate("/dashboard"); //Navigae to dashboard 

    } catch ({ error }) {
      console.log("Error: ", error.message)
    }
  }

  const handlePhoneChange = (value, countryData) => {
    // setPhone(value);
    // setCountry(countryData);
    // console.log("value: ", value + " country code: ", countryData.countryCode + ", country name: ", countryData.name)
    setPhone(value);
    setCountryCode(countryData.countryCode);
    setCountryName(countryData.name);
  };

  // goback code

  const handleGoBack = () => {
    setmobilenoSliderState(true)
    setotpSliderState(false)
    setIsLoading(false)
    setOtp("");
    setIsOtpHidden(true)
    setOtpTimer(80);
  };
  // goback code



  return (
    <div className="phone_login two_col_page top_header_pg">
      <div className="right col_right">
        <img src="/assets/img/login_img2.png" alt="propdial" />
      </div>
      <div className="left col_left">

        {mobilenoSliderState && (
          <>
            <div className="left_inner col_left_inner">
              {/* <div className="page_inner_logo">
                <img src="/assets/img/logo_propdial.png" alt="propdial" />
              </div> */}
              <div className="vg22"></div>
              <form action="">
                <div className="new_form_field with_icon phoneinput">
                  <label htmlFor="" className="text-center">
                    Mobile Number
                  </label>

                  <div>
                    <PhoneInput
                      country={"in"}
                      // onlyCountries={['in', 'us', 'ae']}
                      value={phone}
                      // onChange={setPhone}
                      onChange={handlePhoneChange}
                      international
                      keyboardType="phone-pad"
                      // countryCallingCodeEditable={false}
                      countryCodeEditable={true}
                      // disableCountryCode={true}
                      placeholder="Country code + mobile number"
                      inputProps={{
                        name: "phone",
                        required: true,
                        autoFocus: false,
                      }}
                      inputStyle={{
                        width: "100%",
                        height: "45px",
                        paddingLeft: "45px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #00A8A8",
                      }}
                      buttonStyle={{
                        borderRadius: "5px",
                        textAlign: "left",
                        border: "1px solid #00A8A8",
                      }}
                    ></PhoneInput>
                    {error && <div className="field_error">{error}</div>}
                  </div>
                </div>
                <div
                  id="recapcha-container"
                  style={{
                    marginTop: "20px",
                  }}
                ></div>
                {/* <div className="ordiv">
                  <span>
                    Or
                  </span>
                </div> */}
                {/* <div onClick={signInWithGoogle} className="theme_btn btn_border d-flex align-items-center justify-content-center mb-3">
                  <img src="./assets/img/icons/google.png" alt="google_img" style={{
                    height: "23px",
                    width: "auto",
                    marginRight: "7px"
                  }} />
                  Sign-in with Google
                </div> */}
                {!isLoading && (
                  <>
                    <div
                      id="btn_sendotp"
                      className="theme_btn btn_fill w_full"
                      onClick={getOTP}
                    >
                      Continue
                    </div>
                    <div className="new_form_field">
                      <div className="checkbox justify-content-center">
                        {/* <input type="checkbox" id="agree_tcp" checked /> */}
                        <label htmlFor="agree_tcp">
                          By proceeding, I agree to Propdial{" "}
                          <Link to="/terms" className="click_text">
                            T&C
                          </Link>{" "}
                          &{" "}
                          <Link to="/privacypolicy" className="click_text">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </div>
                  </>
                )}
                {isLoading && (
                  <div className="text-center">
                    <h6 className="text_green mb-2">Sending OTP</h6>
                    <BeatLoader color={"#00a8a8"} loading={true} />
                  </div>
                )}
              </form>
            </div>
          </>
        )}

        {/* OTP Slider */}
        <div>
          {otpSliderState && (
            <div className="left_inner col_left_inner">
              {/* <div className="page_inner_logo">
                <img src="/assets/img/logo_propdial.png" alt="propdial" />
              </div> */}

              <div className="vg22"></div>

              <div className="otp_input"
                style={{
                  width: "fit-content",
                  margin: "auto"
                }}
              >
                <h5>OTP Verification</h5>
                <label htmlFor="" className="w-100 relative" style={{
                  color: "var(--theme-grey)",
                  maxWidth: "260px",
                  marginTop: "4px"
                }}>Enter the code from the sms we sent to <span className="mobile" style={{
                  color: "var(--light-black)",
                  fontWeight: "500"
                }}>{phone.replace(/(\d{2})(\d{5})(\d{5})/, "+$1 $2-$3")}</span>
                  <span onClick={toggleOtpVisibility} className="hs_otp pointer click_text"
                    style={{
                      marginLeft: "5px",
                      position: "relative",
                      top: "-2px"
                    }}
                  >
                    {!isOtpHidden ? (
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00a8a8"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00a8a8"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" /></svg>
                    )}
                  </span>

                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={
                    <span style={{ margin: "10px 5px 20px 5px" }}> - </span>
                  }
                  renderInput={(props) => (
                    <input
                      {...props}
                      type={isOtpHidden ? "password" : "number"} // Hide or show OTP
                      onWheel={handleWheel}
                      inputMode="numeric"
                      style={{
                        width: "40px",
                        height: "40px",
                        border: "1px solid gray",
                        textAlign: "center",
                        borderRadius: "5px",
                        margin: "10px 0px 20px 0px",
                      }}
                    />
                  )}
                />
                {error && <>
                  <div className="field_error">{error}</div>
                  <div className="vg10"></div>
                </>}
              </div>
              <p className="resend_otp_timer">
                Haven't received the OTP?{" "}
                {otptimer > 0 ? (
                  <span>Resend In {otptimer}sec</span>
                ) : (
                  <span
                    onClick={!isResendDisabled ? handleResendOtp : undefined}
                    style={{ cursor: isResendDisabled ? "not-allowed" : "pointer" }}
                  >
                    <a style={{ color: "var(--theme-green)" }}> Resend OTP</a>
                  </span>
                )}
              </p>
              <div className="vg22"></div>
              {/* {isLoading && ( */}
              {/* <button
                  className="theme_btn btn_fill w_full no_icon"
                  onClick={verifyOTP}                 
                >
                  Confirm
                </button> */}
              <button
                className="theme_btn btn_fill w_full no_icon"
                onClick={verifyOTP}
                disabled={isConfirmDisabled} // Disable logic apply
                style={{
                  cursor: isConfirmDisabled ? "not-allowed" : "pointer",
                  opacity: isConfirmDisabled ? 0.5 : 1,
                }}
              >
                Confirm
              </button>

              {/* )} */}
              {/* {!isLoading && ( 
                // <div className="text-center">
                //   <h6 className="text_green mb-2">Redirecting...</h6>
                //   <BeatLoader color={"#00a8a8"} loading={true} />
                // </div>
              )}   */}
              <div className="vg10"></div>

              <button
                className="theme_btn btn_border w_full no_icon"
                onClick={handleGoBack}
              >
                Change Number
              </button>

            </div>
          )}
        </div>
        {/* New User Slider to provide Name & City and email */}
        <div>
          {newUserSliderState && (
            <>
              <div className="left_inner col_left_inner">
                {/* <div className="page_inner_logo">
                  <img src="/assets/img/logo_propdial.png" alt="propdial" />
                </div> */}

                <div className="vg22"></div>
                <div></div>

                <label htmlFor="" className="text-center">

                  <h5>Congratulations and welcome aboard! 🎉</h5>

                  <p
                    style={{
                      marginTop: "3px",
                    }}
                  >
                    {" "}
                    Welcome to join the Propdial community.
                  </p>
                </label>
                <div className="vg22"></div>
                {/* stage one gender  */}
                {genderSlider && <div className="field_box theme_radio_new">
                  <div
                    className="theme_radio_container gender"
                    style={{
                      padding: "0px",
                      border: "none",
                      justifyContent: "center",
                    }}
                  >
                    <div className="radio_single male gender_single">
                      <input
                        type="radio"
                        name="gender"
                        id="male"
                        value="male"
                        onClick={(e) => { setGender('male') }}
                      />
                      <label htmlFor="male">
                        <div className="label_inner">
                          <img
                            src="/assets/img/icons/men-icon-login.png"
                            alt="icon"
                          />
                          <h6>Male</h6>
                        </div>
                      </label>
                    </div>

                    <div className="radio_single female gender_single">
                      <input
                        type="radio"
                        name="gender"
                        id="female"
                        value="female"
                        onClick={(e) => { setGender('female') }}
                      />
                      <label htmlFor="female">
                        <div className="label_inner">
                          <img
                            src="/assets/img/icons/women-icon-login.png"
                            alt="icon"
                          />
                          <h6>Female</h6>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="vg22"></div>
                  <div>
                    <button
                      className="theme_btn btn_fill w_full"
                      onClick={(e) => {
                        if (!gender) {
                          setError("Please select Gender");
                          allSliderVisible(false)
                          setGenderSlider(true)
                        }
                        else {
                          setError("");
                          allSliderVisible(false)
                          setPersonalInfoSlider(true)
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>}

                {/* stage two personal info  */}
                {personalInfoSlider && <div className="new_form_field with_icon">
                  <input
                    required
                    type="text"
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      background: "none",
                    }}
                  />
                  <div className="vg22"></div>
                  <input
                    required
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      background: "none",
                    }}
                  />
                  <div className="vg22"></div>
                  <input
                    required
                    type="text"
                    placeholder="Your Current City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      background: "none",
                    }}
                  />
                  <div className="vg22"></div>
                  <div>
                    <button
                      className="theme_btn btn_fill w_full"
                      onClick={(e) => {
                        if (name === "" || email === "" || city === "") {
                          setError("Please complete all the details");
                          allSliderVisible(false)
                          setPersonalInfoSlider(true)
                        }
                        else if (!validateEmail(email)) {
                          setError("Email format is not valid");
                          allSliderVisible(false)
                          setPersonalInfoSlider(true)
                        }
                        else {
                          setError("");
                          allSliderVisible(false)
                          setWhoAmISlider(true)
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>}

                {/* stage three who am i   */}
                {whoAmISlider && <div className="field_box theme_radio_new whoami">
                  <div className="inner">
                    <label htmlFor="" className="text-center mb-2">
                      <h6> Who am i?</h6>
                      <div className="emoji"></div>
                    </label>
                    <div className="vg12"></div>
                    <div
                      className="theme_radio_container"
                      style={{
                        padding: "0px",
                        border: "none",
                        justifyContent: "center",
                      }}
                    >
                      <div className="radio_single owner">
                        <input
                          type="radio"
                          name="whoAmI"
                          id="owner"
                          value="owner"
                          onClick={(e) => { setWhoAmI('owner') }}
                        />
                        <label htmlFor="owner">I Am owner</label>
                      </div>

                      <div className="radio_single agent">
                        <input
                          type="radio"
                          name="whoAmI"
                          id="agent"
                          value="agent"
                          onClick={(e) => { setWhoAmI('agent') }}
                        />
                        <label htmlFor="agent">I Am agent</label>
                      </div>
                      <div className="radio_single tenant">
                        <input
                          type="radio"
                          name="whoAmI"
                          id="tenant"
                          value="tenant"
                          onClick={(e) => { setWhoAmI('tenant') }}
                        />
                        <label htmlFor="tenant">I Am tenant</label>
                      </div>
                      <div className="radio_single buyer">
                        <input
                          type="radio"
                          name="whoAmI"
                          id="buyer"
                          value="buyer"
                          onClick={(e) => { setWhoAmI('buyer') }}
                        />
                        <label htmlFor="buyer">I Am buyer</label>
                      </div>
                      <div className="radio_single seller">
                        <input
                          type="radio"
                          name="whoAmI"
                          id="seller"
                          value="seller"
                          onClick={(e) => { setWhoAmI('seller') }}
                        />
                        <label htmlFor="seller">I Am seller</label>
                      </div>
                    </div>
                  </div>
                  <div className="vg22"></div>
                  <div className="vg22"></div>
                  <div>
                    <button
                      className="theme_btn btn_fill w_full"
                      onClick={(e) => {
                        if (whoAmI === "") {
                          setError("Please select who you are");
                          allSliderVisible(false)
                          setWhoAmISlider(true)
                        }
                        else {
                          setError("");
                          allSliderVisible(false)
                          handleNewUserData()
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>}

                {error && <div className="field_error">{error}</div>}
                <div className="vg10"></div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin_reCaptchaV2;
