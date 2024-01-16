import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

// sign up hooks
import { useSignup } from "../../../hooks/useSignup";
import { useImageUpload } from "../../../hooks/useImageUpload";
import { useSendEmail } from "../../../hooks/useSendEmail";
// sign up hooks

// import css
import "./PropAgentLS.css";

const PropAgentSignupOld = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  // add and remove class
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  // Sign up code
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const { signup, isPending, error } = useSignup();
  const { imgUpload, isImgCompressPending, imgCompressedFile } =
    useImageUpload();
  const { sendMyEmail, isSendEmailPending } = useSendEmail();

  //Sign Email Format
  // const emailSubject = 'Welcome to HYPER CLOUD DIGITAL SOLUTIONS!';
  const emailSubject = "Welcome to Propdial!";
  const emailBody =
    "<strong>Dear User,</strong><br/><br/>" +
    "Thank you for signing up with HYPER CLOUD DIGITAL SOLUTIONS!<br/><br/> We are excited to have you as a member of our community.<br/><br/>" +
    "As a registered member, you now have access to all the features and benefits of our platform.<br/>" +
    "To get started, simply log in to your account using the credentials you provided during sign up.<br/><br/>" +
    "If you have any questions or need any assistance, feel free to reach out to our support team.<br/><br/>" +
    "Thank you again for choosing Hyper Cloud Digital Solutions and we look forward to seeing you around our platform!<br/><br/>" +
    "<strong>Best regards,</strong><br/>" +
    "HYPER CLOUD TEAM";
  let ccList = "";
  let bccList = "atul@hyperclouddigital.com";

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, phoneNumber, displayName, thumbnail);

    // sendMyEmail(email, ccList, bccList, emailSubject, emailBody);
  };

  const handleFileChange = async (e) => {
    setThumbnail(null);
    let file = e.target.files[0];
    console.log("file original selected:", file);
    console.log("file size original selected:", file.size);
    // const image = await resizeFile(file);
    // const newImageFile = dataURIToBlob(image);

    const compressedImage = await imgUpload(file, 300, 300);
    console.log("imgCom compressed in Signup.js", compressedImage);
    console.log(
      "imgCom size after compressed in Signup.js",
      compressedImage.size
    );

    if (!compressedImage) {
      setThumbnailError("Please select a file");
      return;
    }
    if (!compressedImage.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }

    // if (newImageFile.size > 20000000) {
    //   setThumbnailError('Image file size must be less than 20mb')
    //   return
    // }

    setThumbnailError(null);
    setThumbnail(compressedImage);
    console.log("thumbnail updated");
  };
  // Sign up code
  return (
    <div className="top_header_pg">
      <div
        className={`loginsignpg  ${sidebarOpen ? "sidebar-open" : "sidebar-close"
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
            <form action="" onSubmit={handleSubmit}>
              <h4 className="title">Sign Up</h4>
              <div className="fl_form_field">
                <label className="floating-label" htmlFor="">
                  Name
                </label>
                <input
                  required
                  type="text"
                  maxLength={30}
                  onChange={(e) => setDisplayName(e.target.value)}
                  value={displayName}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
              <div className="fl_form_field">
                <label className="floating-label" htmlFor="">
                  Mobile(+91)
                </label>
                <input
                  required
                  type="text"
                  pattern="\d{10}"
                  maxLength={10}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  value={phoneNumber}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
              <div className="fl_form_field">
                <label className="floating-label" htmlFor="">
                  Email
                </label>
                <input
                  required
                  type="email"
                  maxLength={50}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
              <div className="fl_form_field">
                <label className="floating-label" htmlFor="">
                  Password
                </label>
                <input
                  required
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
              <div className="fl_form_field type_file">
                <label className="" htmlFor="" >
                  Profile Photo
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                {thumbnailError && (
                  <div className="error">{thumbnailError}</div>
                )}
              </div>

              <div className="checkbox_parent">
                <input type="checkbox" />
                <label htmlFor="">
                  I agree to PropAgent{" "}
                  <Link to="" className="click_text">
                    T&C
                  </Link>
                  ,{" "}
                  <Link to="" className="click_text">
                    Privacy Policy
                  </Link>
                  , &{" "}
                  <Link to="" className="click_text">
                    Cookie Policy
                  </Link>
                </label>
              </div>

              <div
                className="col-sm-12 mt-2"
                style={{
                  textAlign: "center",
                }}
              >
                {!isPending && (
                  <button className="theme_btn no_icon full_width btn_fill">
                    Sign up
                  </button>
                )}
                {isPending && (
                  <button
                    className="theme_btn no_icon full_width btn_fill"
                    disabled
                  >
                    Redirecting...
                  </button>
                )}

                {error && <div className="error">{error}</div>}
              </div>
            </form>
            <div className="form_footer">
              Already registered? &nbsp;
              <Link to="/propagentlogin" className="click_text">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropAgentSignupOld;
