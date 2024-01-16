import { useState, useEffect } from "react";
import { useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import { useSignupPhone } from "../../../hooks/useSignupPhone";
import { projectFirestore, timestamp } from "../../../firebase/config";
import { useFirestore } from "../../../hooks/useFirestore";
import { useCollection } from "../../../hooks/useCollection";

// import css
import "./PropAgentLS.css";

const PropAgentLogin = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  // add and remove class
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [lurl, setLURL] = useState("/");
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [flag, setFlag] = useState(false);
  const [confirmObj, setConfirmObj] = useState("");
  const [resendOTPFlag, setResendOTPFlag] = useState(false);
  const [counter, setCounter] = useState(30);
  const { setUpRecapcha, resendOTP } = useSignupPhone();
  const [sendOTPFlag, setSendOTPFlag] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();

  const { documents: dbUsers, error: dbuserserror } = useCollection("users", [
    "role",
    "in",
    ["propagent", "propagentadmin"],
  ]);

  // console.log('dbUsers:', dbUsers)

  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("users");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  // add and remove class

  // floating label code
  const handleInputFocus = (event) => {
    const label = event.target.previousSibling;
    label.classList.add("focused");
  };

  const handleInputBlur = (event) => {
    const label = event.target.previousSibling;
    if (!event.target.value) {
      label.classList.remove("focused");
    }
  };
  // floating label code

  const getOTP = async (e) => {
    e.preventDefault();
    setError("");
    console.log("phone:", phone);
    if (phone === "" || phone === undefined || phone.length < 10) {
      return setError("Please enter valid Phone Number");
    }

    const checkExistingUser =
      dbUsers && dbUsers.filter((item) => item.phoneNumber === phone);
    // console.log('dbUsers:', dbUsers)
    console.log(
      "checkExistingUser length:",
      checkExistingUser && checkExistingUser.length
    );
    console.log("checkExistingUser :", checkExistingUser);

    if (checkExistingUser && checkExistingUser.length > 0) {
      console.log(
        "checkExistingUser[0].phoneNumber:",
        checkExistingUser[0].phoneNumber
      );
      console.log("checkExistingUser[0].status:", checkExistingUser[0].status);
      if (checkExistingUser[0].status === "inactive") {
        navigate("/inactiveuser");
        return;
      }
      setIsNewUser(false);
    } else {
      setIsNewUser(true);
    }

    setSendOTPFlag(false);
    try {
      // console.log('in try 1', phone);
      const respons = await setUpRecapcha("+" + phone);
      // console.log('in try 2', respons);
      setConfirmObj(respons);
      setFlag(true);
    } catch (error) {
      console.log("2 error.message", error.message);
      setError(error.message);
      await resendOTP("+" + phone);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    // console.log('in verifyOTP')
    // setLoading(true);
    if (otp === "" || otp === undefined || otp === null) return;
    try {
      await confirmObj.confirm(otp).then(async (result) => {
        const user = result.user;
        console.log("user in verifyOTP", user);

        if (isNewUser) {
          let splitName = userName.split(" ");

          // Extract the first name
          let firstName = splitName[0];

          let imgUrl =
            "https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/userThumbnails%2F1default.png?alt=media&token=38880453-e642-4fb7-950b-36d81d501fe2";

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
              role: "propagent",
              status: "active",
              createdAt: timestamp.fromDate(new Date()),
              lastLoginTimestamp: timestamp.fromDate(new Date()),
            });
        } else {
          await updateDocument(user.uid, {
            online: true,
            lastLoginTimestamp: timestamp.fromDate(new Date()),
          });
        }

        // console.log(url);
        navigate("/agentdashboard");
      });

      navigate("/agentdashboard");
    } catch (error) {
      console.log("error.message", error.message);

      setError(
        "Given OTP is not valid, please enter the valid OTP sent to your mobile"
      );
      // setLoading(false);

      setTimeout(function () {
        setError("");
        setResendOTPFlag(true);
      }, 3000);
    }
  };
  let newArray = phone && phone.match(/^(91|)?(\d{3})(\d{3})(\d{4})$/);

  // show_pass or hide_pass
  // State variable for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // show_pass or hide_pass

  return (
    <>
      <div className="top_header_pg">
        <div
          className={`loginsignpg  ${
            sidebarOpen ? "sidebar-open" : "sidebar-close"
          }`}
        >
          <div
            className="ls_sidebar set_bg_img_with_overlay"
            style={{
              backgroundImage: "url('/assets/img/dharuhera.jpg')",
            }}
          >
            <div className="blur-bg"></div>
            <div className="open_close_icon" onClick={toggleSidebar}>
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </div>
            <div className="lss_content">
              <h3>Things you Can Do with PropAgent Account</h3>
              <ul>
                <li>
                  Showcase listings
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
                <li>
                  Explore properties
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
                <li>
                  Connect and collaborate
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
                <li>
                  Stay trend-aware
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
                <li>
                  Engage in conversations
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
                <li>
                  Access efficient tools
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
                <li>
                  Receive reliable support
                  <div className="li_icon">
                    <img src="./assets/img/tickIcon.png" alt="" />
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="right_main_form"
            style={{
              backgroundImage: "url('/assets/img/lsbg.png')",
            }}
          >
            <div className="rmf_inner">
              {error && <Alert variant="danger">{error}</Alert>}
              {
                <form
                  action=""
                  onSubmit={getOTP}
                  style={{ display: !flag ? "block" : "none" }}
                  className="form-w"
                >
                  <h4 className="title">Enter your mobile</h4>
                  {/* <div className="fl_form_field">
                                        <label className="floating-label" htmlFor="">
                                            Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            onChange={(e) => setUserName(e.target.value)}
                                            value={userName}
                                        />
                                    </div> */}
                  <div className="fl_form_field">
                    {/* <label className="floating-label" htmlFor="">
                    Mobile(+91)
                  </label> */}

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
                      placeholder="Enter Phone Number"
                      inputProps={{
                        name: "phone",
                        required: true,
                        autoFocus: true,
                      }}
                    ></PhoneInput>
                  </div>
                  <div className="fl_form_field top_margin">
                    <div id="recapcha-container"></div>
                  </div>
                  <div className="checkbox_parent">
                    <input type="checkbox" checked />
                    <label htmlFor="">
                      I agree to PropAgent{" "}
                      <Link
                        to="/propagenttermsandcondition"
                        className="click_text"
                      >
                        T&C
                      </Link>{" "}
                      &{" "}
                      <Link to="/propagentprivacypolicy" className="click_text">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <div
                    className="col-sm-12 mt-2"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {
                      <button
                        type="submit"
                        className="theme_btn no_icon full_width btn_fill"
                      >
                        Continue
                      </button>
                    }
                  </div>
                </form>
              }

              {
                <>
                  <Form
                    onSubmit={verifyOTP}
                    style={{ display: flag ? "block" : "none" }}
                    className="form-w"
                  >
                    <div className="otp_pg">
                      <div className="">
                        <h4 className="title">
                          <span>OTP has been sent to</span>
                          <br />+
                          {newArray && newArray.length >= 5
                            ? +newArray[1] +
                              " - " +
                              newArray[2] +
                              " - " +
                              newArray[3] +
                              " - " +
                              newArray[4]
                            : ""}
                        </h4>
                        {isNewUser && (
                          <div className="fl_form_field">
                            <label className="no-floating" htmlFor="">
                              Name
                            </label>
                            <input
                              required
                              type="text"
                              onFocus={handleInputFocus}
                              onBlur={handleInputBlur}
                              onChange={(e) => setUserName(e.target.value)}
                              value={userName}
                              className="name_input"
                              autoFocus
                            />
                          </div>
                        )}
                        <div className="otp_input_parent">
                          <div className="otp_input_label">
                            <h5>Enter OTP</h5>
                            <h6
                              onClick={togglePasswordVisibility}
                              className="pointer"
                            >
                              {" "}
                              {showPassword ? "Hide" : "Show"}
                            </h6>
                          </div>
                          <div
                            className={`fl_form_field input_otp ${
                              showPassword ? "password-show" : ""
                            }`}
                          >
                            <div>
                              <img src="./assets/img/otp_bg.png" alt="" />
                              <input
                                required
                                type={showPassword ? "text" : "password"} // Use the state variable to determine the input type
                                pattern="\d{6}"
                                maxLength={6}
                                autoFocus
                                // onFocus={handleInputFocus}
                                // onBlur={handleInputBlur}
                                onInput={(e) => {
                                  if (
                                    e.target.value.length > e.target.maxLength
                                  )
                                    e.target.value = e.target.value.slice(
                                      0,
                                      e.target.maxLength
                                    );
                                }}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                           
                              />
                            </div>
                          </div>
                        </div>

                        {/* <div className='txt_field'>
                      <input type="number" required maxLength={6}
                        onInput={(e) => {
                          if (e.target.value.length > e.target.maxLength)
                            e.target.value = e.target.value.slice(0, e.target.maxLength)
                        }}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}>

                      </input>
                    </div> */}
                        {
                          <div
                            className="col-sm-12 mt-4"
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {/* <Link to="/"> */}
                            <div id="recapcha-container"></div>

                            {
                              <button
                                type="submit"
                                className="theme_btn no_icon full_width btn_fill"
                              >
                                Login
                              </button>
                            }
                          </div>
                        }
                      </div>
                    </div>
                  </Form>

                  {/* {resendOTPFlag && (
                    <div
                      className="d-grid gap-2"
                      onClick={async (e) => {                       
                        setError("");
                        setOtp("");                        
                        await resendOTP("+" + phone);
                      }}
                    >
                      <Button
                        className="mybutton button5"
                        style={{ width: "150px", height: "40px" }}
                        type="submit"
                      >
                        Re-Send OTP
                      </Button>
                    
                    </div>
                  )}                  */}
                </>
              }
              <div className="form_footer">
                Use our online real estate community platform to search
                thousands of properties for your customers
                {/* You don't have account ? &nbsp;
                <Link to="/propagentsignup" className="click_text">
                  Create Now
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropAgentLogin;
