import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import OtpInput from "react-otp-input";
import { useSignupPhone } from "../../hooks/useSignupPhone";
import { useCollection } from "../../hooks/useCollection";
import { projectFirestore, timestamp } from "../../firebase/config";

// css
import "./PhoneLogin.scss";
const PhoneLogin = () => {
  const [showOtpInput, setShowOtpInput] = useState(false);

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
  const { documents: dbuserdocuments, error: dbusererror } = useCollection(
    "users",
    ["status", "==", "active"]
  );
  //   send opt
  const handleOtpButtonClick = async (e) => {
    setOtpTimer(20);
    setIsResendDisabled(true);
    e.preventDefault();
    console.log("In getOTP");
    setError("");
    if (phone === "" || phone === undefined || phone.length < 10) {
      return setError("Please enter valid Phone Number");
    }
    try {
      // console.log("in try 1", phone);
      const respons = await setUpRecapcha("+" + phone);
      // console.log("in try 2", respons);
      setConfirmObj(respons);
      // setFlag(true);
      setotpSliderState(true);
      //   setIsOtpButtonVisible(false); // Hide the OTP button

      //Set User Name for existing user, else blank
      const existingUser =
        dbuserdocuments &&
        dbuserdocuments.filter((item) => item.phoneNumber === phone);
      existingUser &&
        existingUser.length > 0 &&
        setUserName(existingUser[0].fullName);
    } catch (error) {
      console.log("2 error.message", error.message);
      setError(error.message);
      await resendOTP("+" + phone);
    }
  };

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

  //   OTP verify
  const verifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    console.log("in verifyOTP", otp);
    // setLoading(true);
    if (otp === "" || otp === undefined || otp === null) return;
    try {
      await confirmObj.confirm(otp).then(async (result) => {
        const user = result.user;
        console.log("user created:", user);

        setUserName(user.displayName);
        // Split the full name by space
        let splitName = userName.split(" ");

        // Extract the first name
        let firstName = splitName[0];

        let imgUrl =
          "https://firebasestorage.googleapis.com/v0/b/townify-dev.appspot.com/o/images%2FDefaultUserIcon.png?alt=media&token=625a6412-f072-4327-97ab-d59c3b67598f";

        // console.log('first name: ', firstName)
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
            // email,
            phoneNumber: phone,
            email: "",
            city: "",
            address: "",
            photoURL: imgUrl,
            role: "customer",
            status: "active",
            createdAt: timestamp.fromDate(new Date()),
            lastLoginTimestamp: timestamp.fromDate(new Date()),
          });
      });

      navigate("/profile");
    } catch (error) {
      console.log("error.message", error.message);

      setError(
        "Given OTP is not valid, please enter the valid OTP sent to your mobile"
      );
      // setLoading(false);

      setTimeout(function () {
        setError("");
        // setResendOTPFlag(true);
      }, 3000);
    }
  };

  return (
    <div className="phone_login two_col_page">
      <div className="right col_right">
        <img src="./assets/img/login_img.jpeg" alt="" />
      </div>
      <div className={`left col_left ${showOtpInput ? "show-otp" : ""}`}>
        {!otpSliderState && (
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
                  Mobile Number
                </label>
                <div className="nff_inner">
                  {/* <input type="number" placeholder="10 digit mobile number" /> */}
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
                    //   placeholder="10 Digit Phone Number"
                    inputProps={{
                      name: "phone",
                      required: true,
                      autoFocus: false,
                    }}
                  ></PhoneInput>
                  <div className="nff_icon">
                    <span class="material-symbols-outlined">call</span>
                  </div>
                </div>
              </div>
              <div className="new_form_field">
                <div className="checkbox">
                  <input type="checkbox" id="agree_tcp" />
                  <label htmlFor="agree_tcp">
                    I agree to PropAgent{" "}
                    <Link to="" class="my_click_text">
                      T&C
                    </Link>{" "}
                    &{" "}
                    <Link to="" class="my_click_text">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
              <div
                className="d-flex justify-content-center"
                style={{ margin: "10px 0px 10px 0px" }}
              >
                {" "}
                <div id="recapcha-container"></div>
              </div>
              <div
                className="p_theme_btn w_full"
                onClick={handleOtpButtonClick}
              >
                Send OTP
              </div>
            </form>
          </div>
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
                        <div className="d-flex justify-content-center flex-column align-items-center">
                          <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={
                              <span style={{ margin: "10px 5px 20px 5px" }}>
                                {" "}
                                -{" "}
                              </span>
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
                          <p className="resend_otp_timer">
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
                          </p>
                          <button className="btn_fill" onClick={verifyOTP}>
                            Confirm
                          </button>
                        </div>
                      )}
      </div>
    </div>
  );
};

export default PhoneLogin;
