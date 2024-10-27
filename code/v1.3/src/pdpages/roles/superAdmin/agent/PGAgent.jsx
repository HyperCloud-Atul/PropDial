import React from "react";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useState, useEffect } from "react";
import { useFirestore } from "../../../../hooks/useFirestore";
import PhoneInput from "react-phone-input-2";

// component
import ScrollToTop from "../../../../components/ScrollToTop";
import InactiveUserCard from "../../../../components/InactiveUserCard";
import NineDots from "../../../../components/NineDots";

const PGAgent = () => {
  const { user } = useAuthContext();
  // add document
  const {
    addDocument: addAgentDocument,
    updateDocument: updateAgentDocument,
    deleteDocument: deleteAgentDocument,
    error: addingError,
  } = useFirestore("agent-propdial");

  // all useStates
  const [showAIForm, setShowAIForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentCompnayName, setAgentCompnayName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPancard, setAgentPancard] = useState("");
  const [agentGstNumber, setAgentGstNumber] = useState("");
  // functions
  const handleShowAIForm = () => setShowAIForm(!showAIForm);
  const handleChangeAgentName = (event) => setAgentName(event.target.value);
  const handleChangeAgentComanayName = (event) =>
    setAgentCompnayName(event.target.value);
  const handleChangeAgentPhone = (value) => setAgentPhone(value);
  const handleChangeAgentEmail = (event) => setAgentEmail(event.target.value);
  const handleChangeAgentPancard = (event) =>
    setAgentPancard(event.target.value);
  const handleChangeAgentGstNumber = (event) =>
    setAgentGstNumber(event.target.value);

  const submitAgentDocument = async (event) => {
    event.preventDefault();

    if (!agentName || !agentPhone || !agentEmail) {
      alert("Name phone and email are required field");
      return;
    }

    try {
      setIsUploading(true);
      const docRef = await addAgentDocument({
        agentName,
        agentCompnayName,
        agentPhone,
        agentEmail,
        agentPancard,
        agentGstNumber,
      });
      setAgentName("");
      setAgentCompnayName("");
      setAgentPhone("");
      setAgentEmail("");
      setAgentPancard("");
      setAgentGstNumber("");
      setIsUploading(false);
      setShowAIForm(!showAIForm);
    } catch (addingError) {
      console.error("Error adding document:", addingError);
      setIsUploading(false);
      setShowAIForm(!showAIForm);
    }
  };

  // View mode start
  const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns
  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };
  // View mode end

  // nine dots menu start
  const nineDotsMenu = [
    // { title: "Country's List", link: "/countrylist", icon: "public" },
    { title: "User List", link: "/userlist", icon: "group" },
  ];
  // nine dots menu end
  return (
    <div>
      <ScrollToTop />
      {user && user.status === "active" ? (
        <div className="top_header_pg pg_bg pg_agent">
          <div className="page_spacing pg_min_height">
            <NineDots nineDotsMenu={nineDotsMenu} />
            {/* {masterCity && masterCity.length !== 0 && ( */}
            <>
              <div className="pg_header d-flex justify-content-between">
                <div className="left">
                  <h2 className="m22">
                    Total Agent:{" "}
                    {/* {masterCity && (
                        <span className="text_orange">{masterCity.length}</span>
                      )} */}
                  </h2>
                </div>
                <div className="right">
                  <img
                    src="./assets/img/icons/excel_logo.png"
                    alt=""
                    className="excel_dowanload"
                  />
                </div>
              </div>
              <div className="vg12"></div>
              <div className="filters">
                <div className="left">
                  <div className="rt_global_search search_field">
                    <input
                      placeholder="Search"
                      // value={searchInput}
                      // onChange={handleSearchInputChange}
                    />
                    <div className="field_icon">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="button_filter diff_views">
                    <div
                      className={`bf_single ${
                        viewMode === "card_view" ? "active" : ""
                      }`}
                      onClick={() => handleModeChange("card_view")}
                    >
                      <span className="material-symbols-outlined">
                        calendar_view_month
                      </span>
                    </div>
                    <div
                      className={`bf_single ${
                        viewMode === "table_view" ? "active" : ""
                      }`}
                      onClick={() => handleModeChange("table_view")}
                    >
                      <span className="material-symbols-outlined">
                        view_list
                      </span>
                    </div>
                  </div>
                  <div
                    onClick={handleShowAIForm}
                    className={`theme_btn no_icon header_btn ${
                      showAIForm ? "btn_border" : "btn_fill"
                    }`}
                  >
                    {showAIForm ? "Cancel" : "Add New"}
                  </div>
                </div>
              </div>
              <hr></hr>
            </>
            {showAIForm && (
              <>
            <form onSubmit={submitAgentDocument}>
            <div className="vg12"></div>
                <div className="row row_gap form_full">
                  <div className="col-xl-4 col-lg-6">
                    <div className="form_field label_top">
                      <label htmlFor="">Name</label>
                      <div className="form_field_inner">
                        <input
                          type="text"
                          value={agentName}
                          onChange={handleChangeAgentName}
                          placeholder="Enter agent name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="form_field label_top">
                      <label htmlFor="">Phone number</label>
                      <div className="form_field_inner">
                        <PhoneInput
                          country={"in"}
                          value={agentPhone}
                          onChange={handleChangeAgentPhone}
                          international
                          keyboardType="phone-pad"
                          countryCodeEditable={true}
                          placeholder="Country code + mobile number"
                          inputProps={{
                            name: "phone",
                            required: true,
                            autoFocus: false,
                          }}
                          inputStyle={{
                            width: "100%",
                            paddingLeft: "45px",
                            fontSize: "16px",
                            borderRadius: "12px",
                            height: "45px",
                          }}
                          buttonStyle={{
                            borderRadius: "12px",
                            textAlign: "left",
                            border: "1px solid #00A8A8",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="form_field label_top">
                      <label htmlFor="">Email</label>
                      <div className="form_field_inner">
                        <input
                          type="text"
                          value={agentEmail}
                          onChange={handleChangeAgentEmail}
                          placeholder="Enter agent email"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="form_field label_top">
                      <label htmlFor="">company name</label>
                      <div className="form_field_inner">
                        <input
                          type="text"
                          value={agentCompnayName}
                          onChange={handleChangeAgentComanayName}
                          placeholder="Enter company name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="form_field label_top">
                      <label htmlFor="">Pancard Number</label>
                      <div className="form_field_inner">
                        <input
                          type="text"
                          value={agentPancard}
                          onChange={handleChangeAgentPancard}
                          placeholder="Enter pancard number"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="form_field label_top">
                      <label htmlFor="">GST Number</label>
                      <div className="form_field_inner">
                        <input
                          type="text"
                          value={agentName}
                          onChange={handleChangeAgentGstNumber}
                          placeholder="Enter GST number"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="form_field label_top">
                      <label htmlFor="">Country</label>
                      <div className="form_field_inner">
                        <select name="" id="">
                            <option value="">India</option>
                            <option value="">USA</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="form_field label_top">
                      <label htmlFor="">State</label>
                      <div className="form_field_inner">
                      <select name="" id="">
                            <option value="">MP</option>
                            <option value="">UP</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="form_field label_top">
                      <label htmlFor="">City</label>
                      <div className="form_field_inner">
                      <select name="" id="">
                            <option value="">Ujjain</option>
                            <option value="">Indore</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="form_field label_top">
                      <label htmlFor="">Locality</label>
                      <div className="form_field_inner">
                      <select name="" id="">
                            <option value="">Locality 1</option>
                            <option value="">Locality 2</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="form_field label_top">
                      <label htmlFor="">Society</label>
                      <div className="form_field_inner">
                      <select name="" id="">
                            <option value="">Society 1</option>
                            <option value="">Society 2</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form_field label_top">
                      <label htmlFor="">Full Address</label>
                      <div className="form_field_inner">
                     <textarea name="" id=""></textarea>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="vg22"></div>

                {/* {formError && (
                      <>
                        <div className="error">{formError}</div>
                        <div className="vg22"></div>
                      </>
                    )}           */}
                <div
                  className="d-flex align-items-center justify-content-end"
                  style={{
                    gap: "15px",
                  }}
                >
                  <div
                    className="theme_btn btn_border no_icon text-center"
                    onClick={handleShowAIForm}
                  >
                    Cancel
                  </div>
                  <button
                    type="submit"
                    className="theme_btn btn_fill no_icon"
                    disabled={isUploading}
                  >
                    {isUploading ? "Adding...." : "Add"}
                  </button>
                </div>
            </form>
                <hr />
              </>
            )}
            {/* )} */}
          </div>
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </div>
  );
};

export default PGAgent;
