import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";
import { projectFirestore } from "../../firebase/config";

const AddReferral = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  if (!user) navigate("/login");

  // add document
  const {
    addDocument: addReferralDoc,
    updateDocument,
    deleteDocument,
    errors,
  } = useFirestore("referrals-propdial");

  // all useState
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  // add document code
  const handleAddDoc = async () => {
    try {
      setIsUploading(true);
      const docRef = await addReferralDoc({
        name,
        email,
        phone: "",
        referTo: "",
        referalCode: "",
        referedBy: user.uid,
        isAccept: false,
      });
      // console.log("Document Reference:", docRef);
      if (docRef.id) {
        await updateDocument(docRef.id, { referalCode: docRef.id });
      }
      setName("");
      setEmail("");
      setIsUploading(false);
    } catch (error) {
      console.error("Error adding document:", error);
      setName("");
      setEmail("");
      setIsUploading(false);
    }
  };
  return (
    <div className="add_referral">
      <div className="row align-items-center pg_divide">
        <div className="col-md-6">
          <div className="img_part text-center">
            <img src="/assets/img/refer_win.png" alt="propdial" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="refer_form relative">
            <img src="/assets/img/gift.png" alt="propdial" className="gift_img" />
            <h3>Refer Friends, Reap Rewards!</h3>

            <div className="row aai_form" style={{ rowGap: "18px" }}>
              <div className="col-12">
                <div className="add_info_text w-100">
                  <div className="form_field w-100">
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Friend's name"
                        className="w-100"
                        onKeyPress={(e) => {
                          const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces allowed
                          if (!regex.test(e.key)) {
                            e.preventDefault(); // Prevent invalid input
                          }
                        }}
                      />
                      <div className="field_icon icon_left">
                        <span class="material-symbols-outlined">person</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="add_info_text w-100">
                  <div className="form_field w-100 with_icon">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Friend's email ID"
                        className="w-100"
                      />
                      <div className="field_icon icon_left">
                        <span class="material-symbols-outlined">mail</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <div
                      className={`theme_btn btn_fill text-center no_icon ${
                        isUploading ? "disabled" : ""
                      }`}
                      onClick={isUploading ? null : handleAddDoc}
                    >
                      {isUploading ? "Submiting..." : "Submit"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReferral;
