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

  // login with phone code start
  // use states
  const [user, setUser] = useState();
  const [activeTab, setActiveTab] = useState(1);
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
  const [otptimer, setOtpTimer] = useState(20);
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
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);
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
    } else if (otptimer === 0) {
      setIsResendDisabled(false); // Enable the Resend button when the timer reaches zero
    }

    return () => clearInterval(interval);
  }, [activeTab, otptimer]);

  const handleResendOtp = () => {
    // Logic to resend OTP
    setOtpTimer(20);
    setIsResendDisabled(true);
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

          let imgUrl = "/assets/img/dummy_user.png";

          await user.updateProfile({
            phoneNumber: phone,
            displayName: firstName,
            photoURL: imgUrl,
            email: user.email,
          });

          projectFirestore
            .collection("users-propdial")
            .doc(user.uid)
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
          const docRef = projectFirestore.collection("users-propdial").doc(user.uid);
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

          await updateDocument(user.uid, {
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
        await updateDocument(user.uid, {
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

  // OTP verify
  const verifyOTP = async (e) => {
    if (otp === "" || otp === undefined || otp === null) return;
    try {
      setIsLoading(true); // Start the loader
      await confirmObj.confirm(otp).then(async (result) => {
        const user = result.user;
        setUser(user)

        // Check if the user is new
        if (result.additionalUserInfo.isNewUser) {
          console.log("New User Signed-In");
          allSliderVisible(false)
          setnewUserSliderState(true)
          setGenderSlider(true)

        }
        else {//Existing User
          console.log("Existing User Signed-In")
          setIsLoading(false); // Start the loader
          allSliderVisible(false)
          navigate("/dashboard"); //Navigae to dashboard 
        }
      })

    }
    catch (error) {
      console.log("error.message", error.message);
      setError(
        "Given OTP is not valid, please enter the valid OTP sent to your mobile"
      );

      setTimeout(function () {
        setError("");
        setResendOTPFlag(true);
      }, 30000);
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
        .doc(user.uid)
        .set({
          online: true,
          whatsappUpdate: false,
          displayName: camelCase(displayName.toLowerCase()),
          fullName: camelCase(name.toLowerCase()),
          phoneNumber: phone,
          email: camelCase(email.toLowerCase().trim()),
          city: camelCase(city.toLowerCase().trim()),
          address: camelCase(address.toLowerCase().trim()),
          gender,
          whoAmI,
          country,
          countryCode,
          photoURL: imgUrl,
          rolePropAgent: "na",
          rolePropDial: "owner",
          rolesPropAgent: ["propagent"],
          rolesPropDial: ["owner"],
          accessType: "country",
          accessValue: ["India"],
          status: "active",
          createdAt: timestamp.fromDate(new Date()),
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

  return (
    <div className="phone_login two_col_page top_header_pg">
      <div className="right col_right">
        <img src="./assets/img/login_img2.png" alt="" />
      </div>
      <div className="left col_left">

        {mobilenoSliderState && (
          <>
            <div className="left_inner col_left_inner">
              {/* <div className="page_inner_logo">
                <img src="/assets/img/logo_propdial.png" alt="" />
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
                <img src="/assets/img/logo_propdial.png" alt="" />
              </div> */}

              <div className="vg22"></div>
              <div className="otp_input"
                style={{
                  width: "fit-content",
                  margin: "auto"
                }}
              >
                <label htmlFor="" className="w-100 relative">Enter 6 digit OTP
                  <span onClick={toggleOtpVisibility} className="hs_otp pointer click_text"
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0"
                    }}
                  >
                    {isOtpHidden ? "Show" : "Hide"}
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
                {error && <div className="field_error">{error}</div>}
              </div>
              {/* <p className="resend_otp_timer">
                            Haven't received the OTP?{" "}
                            {otptimer > 0 ? (
                              <span>Resend In {otptimer} seconds</span>
                            ) : (
                              <span
                                onClick={handleResendOtp}
                                style={{
                                  cursor: isResendDisabled
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                              >
                                <a style={{ color: "blue" }}> Resend Now</a>{" "}
                              </span>
                            )}
                          </p> */}
              <div className="vg10"></div>
              {isLoading && (
                <button
                  className="theme_btn btn_fill w_full"
                  onClick={verifyOTP}
                >
                  Confirm
                </button>
              )}
              {!isLoading && (
                <div className="text-center">
                  <h6 className="text_green mb-2">Redirecting to Dashboard...</h6>
                  <BeatLoader color={"#00a8a8"} loading={true} />
                </div>
              )}
            </div>
          )}
        </div>
        {/* New User Slider to provide Name & City and email */}
        <div>
          {newUserSliderState && (
            <>
              <div className="left_inner col_left_inner">
                {/* <div className="page_inner_logo">
                  <img src="/assets/img/logo_propdial.png" alt="" />
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
                            src="assets/img/icons/men-icon-login.png"
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
                            src="assets/img/icons/women-icon-login.png"
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
