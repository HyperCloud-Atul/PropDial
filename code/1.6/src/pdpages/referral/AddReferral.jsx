import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";
import { projectFirestore } from "../../firebase/config";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./AddReferral.scss";
import { Gift, Send, Share2, UserPlus, LoaderCircle } from "lucide-react";

const AddReferral = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  if (!user) navigate("/login");

  const { addDocument: addReferralDoc, updateDocument } =
    useFirestore("referrals-propdial");

  // States
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [promoCodes, setPromoCodes] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState("");
  const [emailError, setEmailError] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [nationalNumber, setNationalNumber] = useState("");
  const [formDisable, setFormDisable] = useState(false);

  // Input handlers
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePhoneChange = (value, data) => {
    setPhone(value);
    setCountryCode(data.dialCode || ""); // e.g., "91"
    const numberWithoutCountryCode = value
      .replace(data.dialCode, "")
      .replace(/^\+/, "");
    setNationalNumber(numberWithoutCountryCode);
    setPhoneError(""); // reset error while typing
    setFormDisable(false);
  };

  const handlePromoChange = (value) => setSelectedPromo(value);

  // Fetch active promo codes
  useEffect(() => {
    const fetchPromoCodes = async () => {
      const snapshot = await projectFirestore
        .collection("promo-code-propdial")
        .where("status", "==", "active")
        .get();
      const promos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPromoCodes(promos);
    };

    fetchPromoCodes();
  }, []);

  const checkIfPhoneExists = async (value) => {
    const numericPhone = value.replace(/\D/g, ""); // remove all non-digits

    if (numericPhone.length >= 8 && numericPhone.length <= 15) {
      try {
        const doc = await projectFirestore
          .collection("users-propdial")
          .doc(numericPhone)
          .get();

        if (doc.exists) {
          setFormDisable(true);
          setPhoneError("This number is already registered in Propdial");
        } else {
          setPhoneError("");
          setFormDisable(false);
        }
      } catch (error) {
        console.error("Error checking phone:", error);
      }
    }
  };

  const checkIfEmailExists = async (value) => {
    if (!value) return;

    try {
      const snapshot = await projectFirestore
        .collection("users-propdial")
        .where("email", "==", value.trim().toLowerCase())
        .get();

      if (!snapshot.empty) {
        setFormDisable(true);
        setEmailError("This email is already registered in Propdial");
      } else {
        setEmailError("");
        setFormDisable(false);
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  //   const handleAddDoc = async () => {
  //     if (phoneError || emailError) return;

  //     try {
  //       setIsUploading(true);
  //       const docRef = await addReferralDoc({
  //         name,
  //         email,
  //         phone,
  //         referalCode: "",
  //         referedBy: user.uid,
  //         isAccept: false,
  //         promoCode: selectedPromo || "",
  //       });

  //       if (docRef.id) {
  //         await updateDocument(docRef.id, { referalCode: docRef.id });
  //       }

  //       setName("");
  //       setEmail("");
  //       setPhone("");
  //       setSelectedPromo("");
  //       setIsUploading(false);
  //     } catch (error) {
  //       console.error("Error adding referral:", error);
  //       setIsUploading(false);
  //     }
  //   };

  const handleAddDoc = async (e) => {
    e.preventDefault();
    if (phoneError || emailError) {
      return;
    }

    try {
      setIsUploading(true);

      const docRef = await addReferralDoc({
        name,
        email,
        phone,
        countryCode,
        nationalNumber,
        referalCode: "",
        referedBy: user.phoneNumber,
        isAccept: false,
        promoCode: selectedPromo || "",
      });

      const referralLink = `https://propdial-dev-aa266.web.app/referrallogin/${docRef.id}`;

      if (docRef.id) {
        await updateDocument(docRef.id, { referalCode: docRef.id });

        // Send WhatsApp (optional: only for mobile devices or use web redirect)
        const whatsappMsg = `Hi ${name}, you've been invited to join Propdial! Use this referral link: ${referralLink}`;
        const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(
          whatsappMsg
        )}`;
        window.open(whatsappLink, "_blank");

        // Send Email (if you're using EmailJS or similar)
        // await emailjs.send(
        //   'your_service_id',
        //   'your_template_id',
        //   {
        //     to_email: email,
        //     to_name: name,
        //     referral_link: referralLink,
        //   },
        //   'your_user_id'
        // );
      }

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setSelectedPromo("");
      setIsUploading(false);
    } catch (error) {
      console.error("Error adding referral:", error);
      setIsUploading(false);
    }
  };

  const steps = [
    {
      icon: <Share2 className="lucide-icon" />,
      title: "Invite Friends",
      description: "Share your unique promo code with friends",
    },
    {
      icon: <UserPlus className="lucide-icon" />,
      title: "Earn Rewards",
      description:
        "Share the advantages of Propdial with your friends and earn exciting rewards for every successful referral.Share the advantages of Propdial with your friends and earn exciting rewards for every successful referral. Share the advantages of Propdial with your friends and earn exciting rewards for every successful referral.Share the advantages of Propdial with your friends and earn exciting rewards for every successful referral.",
    },
    {
      icon: <Gift className="lucide-icon" />,
      title: "Everyone Wins",
      description:
        "Share the advantages of Propdial with your friends and earn exciting rewards for every successful referral.Share the advantages of Propdial with your friends and earn exciting rewards for every successful referral.",
    },
  ];

  return (
    //     <div className="add_referral">
    //     <div className="row align-items-center pg_divide">
    //       <div className="col-md-6">
    //       <div className="img_part text-center">
    //           <img src="/assets/img/refer_win.png" alt="propdial" />
    //         </div>
    //       </div>
    //       <div className="col-md-6">
    //         <div className="refer_form relative">
    //           <img src="/assets/img/gift.png" alt="gift" className="gift_img" />
    //           <h3>Refer Friends, Reap Rewards!</h3>

    //           <div className="row aai_form" style={{ rowGap: "18px" }}>
    //             {/* Name */}
    //             <div className="col-12">
    //               <input
    //                 type="text"
    //                 value={name}
    //                 onChange={handleNameChange}
    //                 placeholder="Friend's name"
    //                 className="w-100"
    //                 onKeyPress={(e) => {
    //                   const regex = /^[a-zA-Z\s]*$/;
    //                   if (!regex.test(e.key)) e.preventDefault();
    //                 }}
    //               />
    //             </div>

    //             {/* Email */}
    //             <div className="col-12">
    //             <input
    // type="email"
    // value={email}
    // onChange={handleEmailChange}
    // onBlur={() => checkIfEmailExists(email)}
    // placeholder="Friend's email ID"
    // className="w-100"
    // />
    // {emailError && <small style={{ color: "red" }}>{emailError}</small>}

    //             </div>

    //             {/* Phone */}
    //             <div className="col-12">
    //               {/* <input
    //                 type="tel"
    //                 value={phone}
    //                 onChange={handlePhoneChange}
    //                 placeholder="Friend's phone number"
    //                 className="w-100"
    //                 maxLength={10}
    //               /> */}
    //               <PhoneInput
    // country={"in"}
    // value={phone}
    // onChange={handlePhoneChange}
    // onBlur={() => checkIfPhoneExists(phone)}
    // inputClass="w-100"
    // inputStyle={{ width: "100%" }}
    // />
    // {phoneError && (
    // <small style={{ color: "red" }}>{phoneError}</small>
    // )}

    //             </div>

    //             {/* Promo Codes */}
    //             <div className="col-12">
    //               <label style={{ fontWeight: "bold" }}>Select a Promo Code:</label>
    //               {promoCodes.length > 0 ? (
    //                 promoCodes.map((promo) => (
    //                   <div key={promo.id} className="form-check">
    //                     <input
    //                       type="radio"
    //                       id={promo.id}
    //                       value={promo.code}
    //                       checked={selectedPromo === promo.code}
    //                       onChange={handlePromoChange}
    //                       className="form-check-input"
    //                     />
    //                     <label htmlFor={promo.id} className="form-check-label">
    //                       {promo.code}
    //                     </label>
    //                   </div>
    //                 ))
    //               ) : (
    //                 <p>No active promo codes</p>
    //               )}
    //             </div>

    //             {/* Submit Button */}
    //             <div className="col-12">
    //               <div
    //                 className={`theme_btn btn_fill text-center no_icon ${isUploading ? "disabled" : ""}`}
    //                 onClick={isUploading ? null : handleAddDoc}
    //               >
    //                 {isUploading ? "Submitting..." : "Submit"}
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    <div className="pg_min_height">
      <div className="invite-friends">
        <div className="invite-friends_header">
          <h1>Invite Your Friends to Propdial</h1>
          <p>
            Share the advantages of Propdial with your friends and earn exciting
            rewards for every successful referral.
          </p>
        </div>

        <div className="invite-friends_body">
          <div className="invite-friends_method">
            <div className="invite-friends_method_header">
              <h2>How it works</h2>
              <p>
                Follow the simple steps below to invite your friends to Propdial
                and reap rewards:
              </p>
            </div>
            <div className="invite-friends_method_body">
              {steps.map((step, index) => (
                <div className="invite-friends_method_step" key={index + step}>
                  <div className="invite-friends_method_step_icon">
                    {step.icon}
                  </div>
                  <div className="invite-friends_method_step_detail">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
              <div className="vertical-line" />

              {/* <div className="invite-friends_method_step">
                <div className="invite-friends_method_step_icon">
                  <Share2 className="lucide-icon" />
                </div>
                <div className="invite-friends_method_step_detail">
                  <h4>Share your unique referral link</h4>
                  <p>
                    Share the link below with your friends and get rewarded for
                    every successful referral.
                  </p>
                </div>
                <div className="vertical-line" />
              </div>
              <div className="invite-friends_method_step">
                <div className="invite-friends_method_step_icon">
                  <Share2 className="lucide-icon" />
                </div>
                <di className="invite-friends_method_step_detail">
                  <h4>Share your unique referral link</h4>
                  <p>
                    Share the link below with your friends and get rewarded for
                    every successful referral.
                  </p>
                </di>
              </div> */}
            </div>
          </div>
          <div className="invite-friends_form">
            <div className="invite-friends_form_header">
              <h2>Refer Friends</h2>
              <p>Fill in your friend's details below</p>
            </div>
            <form className="invite-friends_form_body" onSubmit={handleAddDoc}>
              <div className="form-name-number">
                <div className="form-input">
                  <label>
                    Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your friend's name"
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                </div>
                <div className="form-input">
                  <label>
                    Phone Number <span>*</span>
                  </label>

                  <PhoneInput
                    country="in"
                    value={phone}
                    onChange={handlePhoneChange}
                    onBlur={() => checkIfPhoneExists(phone)}
                    placeholder="Enter your friend's mobile number"
                    inputClass="form-control"
                    containerClass="custom-phone-input"
                    required
                  />
                  {phoneError && (
                    <small style={{ color: "red" }}>{phoneError}</small>
                  )}
                </div>
              </div>
              <div className="form-input">
                <label>
                  Email <span>*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => checkIfEmailExists(email)}
                  placeholder="Enter your friend's email"
                  required
                />
                {emailError && (
                  <small style={{ color: "red" }}>{emailError}</small>
                )}
              </div>

              <div className="form-input">
                <label>
                  Select a Promo Code <span>*</span>
                </label>
                <div className="promo-code">
                  {promoCodes.map((promoCode, index) => {
                    return (
                      <div
                        className={`promo-code-item ${
                          selectedPromo === promoCode.code ? "active-promo" : ""
                        }`}
                        key={index + promoCode}
                        onClick={() => handlePromoChange(promoCode.code)}
                      >
                        <h6>{promoCode.code}</h6>
                        <p>{promoCode.benefitSummary}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="invite-form-button">
                <button disabled={isUploading || formDisable}>
                  {isUploading ? (
                    <>
                      <LoaderCircle className="lucide-icon" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="lucide-icon" />
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReferral;
