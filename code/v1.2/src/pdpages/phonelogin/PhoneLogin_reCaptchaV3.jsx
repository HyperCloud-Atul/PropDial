import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
// import 'flag-icon-css/css/flag-icon.min.css';
import OtpInput from "react-otp-input";

import { useSignupPhone } from "../../hooks/useSignupPhone";
import { useCollection } from "../../hooks/useCollection";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectAuth, projectAuthObj, projectFirestore, timestamp } from "../../firebase/config";
// import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

// css
import "./PhoneLogin.scss";
const PhoneLogin_reCaptchaV3 = () => {

    // login with phone code start
    // use states
    const [activeTab, setActiveTab] = useState(1);
    const [otp, setOtp] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [otptimer, setOtpTimer] = useState(20);
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    // const { setUpRecapcha, resendOTP } = useSignupPhone();
    const [confirmObj, setConfirmObj] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationId, setVerificationId] = useState("")
    const [userName, setUserName] = useState("");
    const [otpSliderState, setotpSliderState] = useState(false);
    const navigate = useNavigate();
    const [isNewUser, setIsNewUser] = useState(false);
    const [sendOTPFlag, setSendOTPFlag] = useState(true);
    const [flag, setFlag] = useState(false);
    const [resendOTPFlag, setResendOTPFlag] = useState(false);

    const { updateDocument, response: responseUpdateDocument } =
        useFirestore("users");

    const { documents: dbUsers, error: dbuserserror } = useCollection("users");
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

    let recaptchaVerifier = useRef(null);
    const setUpRecaptcha = () => {
        // window.recaptchaVerifier = new RecaptchaVerifier(
        //     "sign-in-button",
        //     {
        //         size: "invisible",
        //         callback: (response) => {
        //             // reCAPTCHA solved, allow signInWithPhoneNumber.
        //             handleSignIn();
        //         },
        //     },
        //     auth
        // );
        recaptchaVerifier = new projectAuthObj.RecaptchaVerifier(
            "btn_sendotp",
            {
                size: "invisible",
                callback: (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    handleSignIn();
                },
            }
        );
    };

    const handleSignIn = () => {
        // e.preventDefault();
        //     setOtpTimer(20);
        //     setIsResendDisabled(true);
        //     console.log("In getOTP");
        //     setError("");
        if (phone === "" || phone === undefined || phone.length < 10) {
            return setError("Please enter a valid mobile number");
        }

        try {
            let btnSendOTP = document.getElementById("btn_sendotp");
            btnSendOTP.style.display = "none";

            setUpRecaptcha();

            // projectAuth.signInWithPhoneNumber("+" + phone, recaptchaVerifier);

            projectAuth.signInWithPhoneNumber("+" + phone, recaptchaVerifier)
                .then((confirmationResult) => {
                    setVerificationId(confirmationResult.verificationId);
                    console.log('Verification id: ', confirmationResult.verificationId)
                    // setConfirmObj(respons);
                    setotpSliderState(true);

                })
                .catch((error) => {
                    console.error("Error during sign in:", error);
                });
        }
        catch (error) {
            console.log("2 error.message", error.message);
            setError(error.message);
            //         await resendOTP("+" + phone);
            let obj_maintenance = document.getElementById("btn_sendotp");
            obj_maintenance.style.display = "block";
        }




        // signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
        //     .then((confirmationResult) => {
        //         setVerificationId(confirmationResult.verificationId);
        //     })
        //     .catch((error) => {
        //         console.error("Error during sign in:", error);
        //     });
    };

    const handleVerifyOTP = () => {
        console.log("phone: ", "+" + phone)
        const credential = projectAuthObj.PhoneAuthProvider.credential(verificationId, otp);
        // console.log("credential: ", credential)

        projectAuth.signInWithCredential(credential)
            .then(async (result) => {
                console.log("User signed in successfully:", result.user);
                const user = result.user;
                // Check if the user is new
                if (result.additionalUserInfo.isNewUser) { //New User
                    console.log("New user signing-in");
                    setIsNewUser(true)
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
                }
                else { //Existing user
                    console.log("Existing user signing-in");
                    setIsNewUser(false)
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
            .catch((error) => {
                console.log("Error during code verification:", error.message);
                setError(
                    "Given OTP is not valid, please enter the valid OTP sent to your mobile ", "+" + phone
                );

                // setTimeout(function () {
                //     setError("");
                //     setResendOTPFlag(true);
                // }, 3000);

            });
    };

    // OLD Code
    // OTP verify
    // const verifyOTP = async (e) => {
    //     e.preventDefault();
    //     setError("");
    //     console.log("in verifyOTP", otp);
    //     // setLoading(true);
    //     if (otp === "" || otp === undefined || otp === null) return;
    //     try {
    //         await confirmObj.confirm(otp).then(async (result) => {
    //             const user = result.user;
    //             // Check if the user is new
    //             if (result.additionalUserInfo.isNewUser) {
    //                 console.log("New user signed in with phone number");
    //                 setUserName(user.displayName);
    //                 // Split the full name by space
    //                 let splitName = userName.split(" ");

    //                 // Extract the first name
    //                 let firstName = splitName[0];

    //                 let imgUrl = "/assets/img/dummy_user.png";

    //                 await user.updateProfile({
    //                     phoneNumber: phone,
    //                     displayName: firstName,
    //                     photoURL: imgUrl,
    //                 });

    //                 projectFirestore
    //                     .collection("users")
    //                     .doc(user.uid)
    //                     .set({
    //                         online: true,
    //                         displayName: firstName,
    //                         fullName: userName,
    //                         phoneNumber: phone,
    //                         email: "",
    //                         city: "",
    //                         country: "",
    //                         address: "",
    //                         photoURL: imgUrl,
    //                         rolePropAgent: "na",
    //                         rolePropDial: "owner",
    //                         rolesPropAgent: ["propagent"],
    //                         rolesPropDial: ['owner'],
    //                         status: "active",
    //                         createdAt: timestamp.fromDate(new Date()),
    //                         lastLoginTimestamp: timestamp.fromDate(new Date()),
    //                     });
    //             } else {
    //                 console.log("Existing user signed in with phone number");
    //                 let role = 'owner';
    //                 const docRef = projectFirestore.collection("users").doc(user.uid)
    //                 // Get the document snapshot
    //                 const docSnapshot = await docRef.get();
    //                 // Check if the document exists
    //                 if (docSnapshot.exists) {
    //                     // Extract the data from the document snapshot
    //                     // const data = docSnapshot.data();
    //                     if (docSnapshot.data().rolePropDial === 'na')
    //                         role = 'owner'
    //                     else
    //                         role = docSnapshot.data().rolePropDial
    //                 }

    //                 // console.log('role: ', role)
    //                 await updateDocument(user.uid, {
    //                     rolePropDial: role,
    //                     online: true,
    //                     lastLoginTimestamp: timestamp.fromDate(new Date()),
    //                 });

    //                 await updateDocument(user.uid, {
    //                     online: true,
    //                     lastLoginTimestamp: timestamp.fromDate(new Date()),
    //                 });
    //             }

    //             if (user) {
    //                 const providerData = user.providerData;
    //                 const isLinkedWithGoogle = providerData.some(provider => provider.providerId === projectAuthObj.GoogleAuthProvider.PROVIDER_ID);

    //                 if (isLinkedWithGoogle) {
    //                     console.log("User is already linked with Google");
    //                     // setError("User is already linked with Google");
    //                 } else {
    //                     console.log("User is not linked with Google");
    //                     // Now link with Google account
    //                     linkGoogleAccount(user);
    //                 }
    //             }

    //             navigate("/profile");

    //         })
    //     }
    //     catch (error) {
    //         console.log("error.message", error.message);
    //         setError(
    //             "Given OTP is not valid, please enter the valid OTP sent to your mobile"
    //         );

    //         setTimeout(function () {
    //             setError("");
    //             setResendOTPFlag(true);
    //         }, 3000);
    //     }
    // }

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
                            <div className="vg22"></div>
                            {/* <h5 className="m22 mt-3 mb-4">
                Unlocking Your Property Prospects: PropDial - Where Realty Meets
                Security.
           
              </h5> */}
                            <form action="">

                                <div className="new_form_field with_icon phoneinput">
                                    <label htmlFor="" className="text-center">
                                        Mobile Number
                                    </label>
                                    <div >
                                        <PhoneInput
                                            country={"in"}
                                            onlyCountries={['in', 'us', 'ae']}
                                            value={phone}
                                            onChange={setPhone}
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
                                                width: '100%',
                                                height: '45px',
                                                paddingLeft: '45px',
                                                fontSize: '16px',
                                                borderRadius: '5px',
                                                border: '1px solid #00A8A8',
                                            }}
                                            buttonStyle={{
                                                borderRadius: '5px',
                                                textAlign: 'left',
                                                border: '1px solid #00A8A8',
                                            }}
                                        ></PhoneInput>
                                    </div>
                                    {error && <div className="field_error">{error}</div>}
                                </div>
                                <div
                                    id="recapcha-container"
                                    style={{
                                        marginTop: "20px",
                                    }}
                                ></div>
                                <div className="ordiv">
                                    <span>
                                        Or
                                    </span>
                                </div>
                                <div onClick={signInWithGoogle} className="theme_btn btn_border d-flex align-items-center justify-content-center mb-3">
                                    <img src="./assets/img/icons/google.png" alt="google_img" style={{
                                        height: "23px",
                                        width: "auto",
                                        marginRight: "7px"
                                    }} />
                                    Sign-in with Google
                                </div>
                                {/* <div id='btn_sendotp'
                                    className="theme_btn btn_fill w_full"
                                    onClick={getOTP}
                                >
                                    Continue
                                </div> */}
                                <div id='btn_sendotp'
                                    className="theme_btn btn_fill w_full"
                                    onClick={handleSignIn}
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
                            </form>

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
                        {/* <h5 className="m20 mt-3 mb-4">
              Unlocking Your Property Prospects: PropDial - Where Realty Meets
              Security.
            </h5> */}
                        <div className="vg22"></div>

                        {isNewUser && (
                            <div>
                                <input
                                    type="text"
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Enter Your Name"
                                    style={{
                                        borderRadius: "5px",
                                        border: "1px solid var(--grey-dark)",
                                        padding: "5px",
                                        margin: "10px 0px",
                                    }}
                                />
                            </div>
                        )}
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
                        {error && <div className="field_error">{error}</div>}
                        <div className="vg10"></div>
                        <div className="vg10"></div>
                        {/* <button className="theme_btn btn_fill w_full" onClick={verifyOTP}>
                            Confirm
                        </button> */}

                        <button className="theme_btn btn_fill w_full" onClick={handleVerifyOTP}>
                            Confirm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhoneLogin_reCaptchaV3;
