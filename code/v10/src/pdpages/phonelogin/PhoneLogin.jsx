import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import OtpInput from "react-otp-input";
import { useSignupPhone } from "../../hooks/useSignupPhone";
import { useCollection } from "../../hooks/useCollection";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectAuth, projectAuthObj, projectFirestore, timestamp } from "../../firebase/config";

// css
import "./PhoneLogin.scss";
const PhoneLogin = () => {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { user1 } = useAuthContext();

  const handleSendOtpClick = () => {
    // Add logic to send OTP or perform any other action
    setShowOtpInput(true);
  };

  // login with phone code start
  // use states
  const [activeTab, setActiveTab] = useState(1);
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [otptimer, setOtpTimer] = useState(20);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const { setUpRecapcha, resendOTP } = useSignupPhone();
  const [confirmObj, setConfirmObj] = useState("");
  const [userName, setUserName] = useState("");
  const [otpSliderState, setotpSliderState] = useState(false);
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);
  const [sendOTPFlag, setSendOTPFlag] = useState(true);
  const [flag, setFlag] = useState(false);
  const [resendOTPFlag, setResendOTPFlag] = useState(false);

  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("users");
  // const { documents: dbuserdocuments, error: dbusererror } = useCollection(
  //   "users",
  //   ["status", "==", "active"]
  // );

  // const { documents: dbuserdocuments, error: dbuserserror } = useCollection("users", [
  //   "rolePropDial",
  //   "in",
  //   ["admin", "owner", "coowner", 'tenant', 'frontdesk', 'propertymanager']
  // ]);
  const { documents: dbUsers, error: dbuserserror } = useCollection("users");
  // console.log('dbuserdocuments:', dbuserdocuments)

  // const dbUsers =
  //   dbuserdocuments && dbuserdocuments.filter((item) => item.status === 'active');

  // console.log('dbuser:', dbUsers)

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
    projectAuth.signInWithPopup(provider)
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
            .collection("users")
            .doc(user.uid)
            .set({
              online: true,
              displayName: firstName,
              fullName: userName,
              // email,
              phoneNumber: phone,
              email: user.email,
              city: "",
              country: "",
              address: "",
              photoURL: imgUrl,
              rolePropAgent: "na",
              rolePropDial: "owner",
              rolesPropAgent: ["propagent"],
              rolesPropDial: ['owner'],
              status: "active",
              createdAt: timestamp.fromDate(new Date()),
              lastLoginTimestamp: timestamp.fromDate(new Date()),
            });

        } else {
          console.log("Existing user signed in with Google");
          console.log("existing user:", user);
          let role = 'owner';
          const docRef = projectFirestore.collection("users").doc(user.uid)
          // Get the document snapshot
          const docSnapshot = await docRef.get();
          // Check if the document exists
          if (docSnapshot.exists) {
            // Extract the data from the document snapshot
            // const data = docSnapshot.data();
            if (docSnapshot.data().rolePropDial === 'na')
              role = 'owner'
            else
              role = docSnapshot.data().rolePropDial
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

        navigate("/profile");

      })
      .catch((error) => {
        // Handle Errors here.
        console.error(error);
      });

  };

  //Link Google Account with phone number
  const linkGoogleAccount = (curuser) => {
    const provider = new projectAuthObj.GoogleAuthProvider();

    curuser.linkWithPopup(provider)
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

  //   send opt
  const getOTP = async (e) => {
    e.preventDefault();
    setOtpTimer(20);
    setIsResendDisabled(true);
    console.log("In getOTP");
    setError("");
    if (phone === "" || phone === undefined || phone.length < 10) {
      return setError("Please enter valid Phone Number");
    }

    try {
      let btnSendOTP = document.getElementById("btn_sendotp");
      btnSendOTP.style.display = "none";
      const respons = await setUpRecapcha("+" + phone);
      console.log("in try 2", respons);
      setConfirmObj(respons);
      setotpSliderState(true);
    }
    catch (error) {
      console.log("2 error.message", error.message);
      setError(error.message);
      await resendOTP("+" + phone);
      let obj_maintenance = document.getElementById("btn_sendotp");
      obj_maintenance.style.display = "block";
    }
  }

  // OTP verify
  const verifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    console.log("in verifyOTP", otp);
    // setLoading(true);
    if (otp === "" || otp === undefined || otp === null) return;
    try {
      await confirmObj.confirm(otp).then(async (result) => {
        const user = result.user;
        // Check if the user is new
        if (result.additionalUserInfo.isNewUser) {
          console.log("New user signed in with phone number");
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
          });

          projectFirestore
            .collection("users")
            .doc(user.uid)
            .set({
              online: true,
              displayName: firstName,
              fullName: userName,
              phoneNumber: phone,
              email: "",
              city: "",
              country: "",
              address: "",
              photoURL: imgUrl,
              rolePropAgent: "na",
              rolePropDial: "owner",
              rolesPropAgent: ["propagent"],
              rolesPropDial: ['owner'],
              status: "active",
              createdAt: timestamp.fromDate(new Date()),
              lastLoginTimestamp: timestamp.fromDate(new Date()),
            });
        } else {
          console.log("Existing user signed in with phone number");
          let role = 'owner';
          const docRef = projectFirestore.collection("users").doc(user.uid)
          // Get the document snapshot
          const docSnapshot = await docRef.get();
          // Check if the document exists
          if (docSnapshot.exists) {
            // Extract the data from the document snapshot
            // const data = docSnapshot.data();
            if (docSnapshot.data().rolePropDial === 'na')
              role = 'owner'
            else
              role = docSnapshot.data().rolePropDial
          }

          // console.log('role: ', role)
          await updateDocument(user.uid, {
            rolePropDial: role,
            online: true,
            lastLoginTimestamp: timestamp.fromDate(new Date()),
          });

          await updateDocument(user.uid, {
            online: true,
            lastLoginTimestamp: timestamp.fromDate(new Date()),
          });
        }

        if (user) {
          const providerData = user.providerData;
          const isLinkedWithGoogle = providerData.some(provider => provider.providerId === projectAuthObj.GoogleAuthProvider.PROVIDER_ID);

          if (isLinkedWithGoogle) {
            console.log("User is already linked with Google");
            // setError("User is already linked with Google");
          } else {
            console.log("User is not linked with Google");
            // Now link with Google account
            linkGoogleAccount(user);
          }
        }

        navigate("/profile");

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
      }, 3000);
    }
  }

  return (
    <div className="phone_login two_col_page top_header_pg">
      <div className="right col_right">
        <img src="./assets/img/login_img.jpeg" alt="" />
      </div>
      <div className="left col_left">
        {!otpSliderState && (
          <>
            <div className="left_inner col_left_inner">
              <div className="page_inner_logo">
                <img src="/assets/img/logo_propdial.png" alt="" />
              </div>
              <h5 className="m20 mt-3 mb-4">
                Unlocking Your Property Prospects: PropDial - Where Realty Meets
                Security.
              </h5>
              <form action="">
                <div className="new_form_field with_icon phoneinput">
                  <label htmlFor="" className="text-center">
                    Mobile Number
                  </label>
                  <div className="nff_inner">
                    <PhoneInput
                      country={"in"}
                      // onlyCountries={['in', 'us']}
                      value={phone}
                      onChange={setPhone}
                      international
                      keyboardType="phone-pad"
                      // countryCallingCodeEditable={false}
                      countryCodeEditable={false}
                      // disableCountryCode={true}
                      placeholder="10 Digit Phone Number"
                      inputProps={{
                        name: "phone",
                        required: true,
                        autoFocus: false,
                      }}
                    ></PhoneInput>
                    <div className="nff_icon">
                      <span className="material-symbols-outlined">call</span>
                    </div>
                  </div>
                </div>
                <div className="new_form_field">
                  <div className="checkbox">
                    <input type="checkbox" id="agree_tcp" checked />
                    <label htmlFor="agree_tcp">
                      I agree to PropAgent{" "}
                      <Link to="" className="my_click_text">
                        T&C
                      </Link>{" "}
                      &{" "}
                      <Link to="" className="my_click_text">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                <div
                  id="recapcha-container"
                  style={{
                    marginTop: "20px",
                  }}
                ></div>

                <div id='btn_sendotp'
                  className="p_theme_btn w_full"
                  onClick={getOTP}
                >
                  Send OTP
                </div>
              </form>
            </div>
            <div>
              Sign-in with Google
              <button onClick={signInWithGoogle} >Google Icon</button>
            </div>
          </>
        )}
        {/* {otpSliderState && (
          <div className="left_inner col_left_inner">
            <div className="page_inner_logo">
              <img src="/assets/img/logo_propdial.png" alt="" />
            </div>
            <h5 className="m20 mt-3 mb-4">
              Unlocking Your Property Prospects: PropDial - Where Realty Meets
              Security.
            </h5>
            <form action="">
              <div className="new_form_field with_icon">
                <label htmlFor="" className="text-center">
                  OTP
                </label>
                <div className="nff_inner">
            
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
                        type="number"
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
                </div>
              </div>
              <Link className="p_theme_btn w_full" onClick={verifyOTP}>
                Login
              </Link>
            </form>
          </div>
        )} */}
        {otpSliderState && (
          <div className="left_inner col_left_inner">
            <div className="page_inner_logo">
              <img src="/assets/img/logo_propdial.png" alt="" />
            </div>
            <h5 className="m20 mt-3 mb-4">
              Unlocking Your Property Prospects: PropDial - Where Realty Meets
              Security.
            </h5>
            <div className="otp_input">
              <label htmlFor="">Enter 6 digit OTP</label>
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
                    type="number"
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
            <button className="p_theme_btn w_full" onClick={verifyOTP}>
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneLogin;
