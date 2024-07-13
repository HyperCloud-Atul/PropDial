import { useEffect, useState } from "react";
import { projectFirestore } from "../../../firebase/config";
import { timestamp } from "../../../firebase/config";
import Popup from "../../../components/Popup";
import { useDocument } from "../../../hooks/useDocument";
import { useAuthContext } from "../../../hooks/useAuthContext";

// styles
import "./Settings.css";

export default function AdminSettings() {
  const { user } = useAuthContext();
  const [toggleFlag, setToggleFlag] = useState(false);
  const [expandParam, setExpandParam] = useState([
    "LogoTheme",
    "EMail",
    "PaymentGateway",
    "Wallet",
  ]);
  const [resetFlag, setResetFlag] = useState(true);
  const { document, error } = useDocument("settings", "SETTINGS");

  //Popup Flags
  const [showPopupFlag, setShowPopupFlag] = useState(false);
  const [popupReturn, setPopupReturn] = useState(false);

  //Email Settings
  const [emailFrom, setEmailFrom] = useState("");
  const [emailServerPwd, setEmailServerPwd] = useState("");

  //Payment Gateway Settings
  const [pgBusinessName, setPGBusinessName] = useState("");
  const [pgBusinessLogo, setPGBusinessLogo] = useState("");
  const [pgURLTest, setPGURLTest] = useState("");
  const [pgKeyTest, setPGKeyTest] = useState("");
  const [pgPasscodeTest, setPGPasscodeTest] = useState("");
  const [pgURLProd, setPGURLProd] = useState("");
  const [pgKeyProd, setPGKeyProd] = useState("");
  const [pgPasscodeProd, setPGPasscodeProd] = useState("");
  const [pgMode, setPGMode] = useState("");

  //Wallet Settings
  const [walletMinBalance, setWalletMinBalance] = useState("");

  // -------------------------------------------------
  const toggleBtnClick = () => {
    setToggleFlag(!toggleFlag);
  };

  const expandPanel = (param) => {
    // console.log('param value:', param)
    setExpandParam(param);
    setResetFlag(false);
  };
  const resetParam = () => {
    const param = ["LogoTheme", "EMail", "PaymentGateway", "Wallet"];
    setExpandParam(param);
    setResetFlag(true);
  };

  //Popup Flags
  useEffect(() => {
    // console.log('PopupReturn in useEffect', popupReturn)
    // console.log('expandParam in useEffect', expandParam)
    if (popupReturn) {
      if (expandParam == "EMail") saveEmailSettings();
      if (expandParam == "PaymentGateway") savePaymentGatewaySettings();
      if (expandParam == "Wallet") saveWalletSettings();
    }
  }, [popupReturn]);

  //Popup Flags
  const showPopup = async (e) => {
    e.preventDefault();
    setShowPopupFlag(true);
    setPopupReturn(false);
  };

  const saveEmailSettings = async () => {
    // e.preventDefault()
    var EMAIL = {
      from: emailFrom,
      serverPwd: emailServerPwd,
      status: "active",
      updatedAt: timestamp.fromDate(new Date()),
      updatedBy: user.uid,
    };
    await projectFirestore.collection("settings").doc("SETTINGS").update({
      EMAIL,
    });
  };
  const savePaymentGatewaySettings = async () => {
    // e.preventDefault()
    var PAYMENTGATEWAY = {
      businessName: pgBusinessName,
      businessLogo: pgBusinessLogo,
      testURL: pgURLTest,
      testMerchantKey: pgKeyTest,
      testPasscode: pgPasscodeTest,
      prodURL: pgURLProd,
      prodMerchantKey: pgKeyProd,
      prodPasscode: pgPasscodeProd,
      mode: pgMode,
      status: "active",
      updatedAt: timestamp.fromDate(new Date()),
      updatedBy: user.uid,
    };
    await projectFirestore.collection("settings").doc("SETTINGS").update({
      PAYMENTGATEWAY,
    });
  };
  const saveWalletSettings = async () => {
    // e.preventDefault()
    var WALLET = {
      minBalance: walletMinBalance,
      status: "active",
      updatedAt: timestamp.fromDate(new Date()),
      updatedBy: user.uid,
    };
    await projectFirestore.collection("settings").doc("SETTINGS").update({
      WALLET,
    });
  };

  // Show error if the document does not available in firebase
  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!document) {
    return <div className="loading">Loading...</div>;
  }

  // ---------------HTML Browser Code--------------------------------------------------------------------------

  return (
    <>
      <div className="fixed-settings-breadcrum">
        <div>
          <span
            style={{ fontSize: "2rem" }}
            className="material-symbols-outlined"
          >
            settings
          </span>
        </div>
        <span onClick={resetParam}> Settings </span>
        {!resetFlag && <span> &lt; </span>}
        <span> {!resetFlag && expandParam} </span>
      </div>

      {/* Popup Component */}
      <Popup
        showPopupFlag={showPopupFlag}
        setShowPopupFlag={setShowPopupFlag}
        setPopupReturn={setPopupReturn}
        msg={"Are you sure you want to update the changes?"}
      />

      <div className="row no-gutters">
        {/* Logo & Theme */}
        <div
          onClick={() => expandPanel("LogoTheme")}
          className="col-lg-6 col-md-12 col-sm-12"
          style={{
            display: expandParam.includes("LogoTheme") ? "block" : "none",
          }}
        >
          <div className="settings-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="settings-card-details">
                <div>
                  <span className="material-symbols-outlined">face_5</span>
                </div>
                <div>
                  <h1>Logo - Theme</h1>
                  <h2>Setup application logo & color theme</h2>
                </div>
              </div>
              <div className="settings-card-arrow">
                {/* <div className={toggleFlag ? 'toggle-switch on' : 'toggle-switch off'}>
                                    <small>{toggleFlag ? 'On' : 'Off'}</small>
                                    <div onClick={toggleBtnClick}>
                                        <div></div>
                                    </div>
                                </div> */}

                <div>
                  <span className="material-symbols-outlined">
                    arrow_forward_ios
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display:
                  !resetFlag && expandParam.includes("LogoTheme")
                    ? "block"
                    : "none",
              }}
            >
              <hr />
              <form onSubmit={showPopup} className="auth-form">
                {/* <h2>Email Settings</h2> */}
                <label>
                  <span>Logo:</span>
                  <input
                    required
                    type="text"
                    placeholder={document.EMAIL.from}
                    maxLength={50}
                    onChange={(e) => setEmailFrom(e.target.value)}
                    value={emailFrom}
                  />
                </label>
                <label>
                  <span>Theme:</span>
                  <input
                    required
                    type="text"
                    placeholder={document.EMAIL.serverPwd}
                    maxLength={30}
                    onChange={(e) => setEmailServerPwd(e.target.value)}
                    value={emailServerPwd}
                  />
                </label>
                {<button className="btn">Save</button>}
                {/* {!isPending && <button className="btn">Save</button>} */}
                {/* {isPending && <button className="btn" disabled>Saving...</button>} */}
                {/* {error && <div className="error">{error}</div>} */}
              </form>
            </div>
          </div>
        </div>

        <div
          onClick={() => expandPanel("EMail")}
          className="col-lg-6 col-md-12 col-sm-12"
          style={{ display: expandParam.includes("EMail") ? "block" : "none" }}
        >
          <div className="settings-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="settings-card-details">
                <div>
                  <span className="material-symbols-outlined">
                    outgoing_mail
                  </span>
                </div>
                <div>
                  <h1>Email</h1>
                  <h2>Setup outgoing email server, cc & bcc </h2>
                </div>
              </div>
              <div className="settings-card-arrow">
                <div
                  className={
                    toggleFlag ? "toggle-switch on" : "toggle-switch off"
                  }
                >
                  <small>{toggleFlag ? "On" : "Off"}</small>
                  <div onClick={toggleBtnClick}>
                    <div></div>
                  </div>
                </div>

                <div>
                  <span className="material-symbols-outlined">
                    arrow_forward_ios
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display:
                  !resetFlag && expandParam.includes("EMail")
                    ? "block"
                    : "none",
              }}
            >
              <hr />
              <form onSubmit={showPopup}>
                {/* <h2>Email Settings</h2> */}
                <label>
                  <span>From:</span>
                  <input
                    required
                    type="text"
                    placeholder={document.EMAIL.from}
                    maxLength={50}
                    onChange={(e) => setEmailFrom(e.target.value)}
                    value={emailFrom}
                  />
                </label>
                <label>
                  <span>Password:</span>
                  <input
                    required
                    type="text"
                    placeholder={document.EMAIL.serverPwd}
                    maxLength={30}
                    onChange={(e) => setEmailServerPwd(e.target.value)}
                    value={emailServerPwd}
                  />
                </label>
                {<button className="btn">Save</button>}
                {/* {!isPending && <button className="btn">Save</button>} */}
                {/* {isPending && <button className="btn" disabled>Saving...</button>} */}
                {/* {error && <div className="error">{error}</div>} */}
              </form>
            </div>
          </div>
        </div>
        <div
          onClick={() => expandPanel("PaymentGateway")}
          className="col-lg-6 col-md-12 col-sm-12"
          style={{
            display: expandParam.includes("PaymentGateway") ? "block" : "none",
          }}
        >
          <div className="settings-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="settings-card-details" style={{ width: "90%" }}>
                <div>
                  <span className="material-symbols-outlined">
                    currency_rupee
                  </span>
                </div>
                <div>
                  <h1>Payment Gateway</h1>
                  <h2>
                    Setup payment gateway parameters for Test and Prod
                    environment
                  </h2>
                </div>
              </div>
              <div className="settings-card-arrow" style={{ width: "10%" }}>
                {/* <div className={toggleFlag ? 'toggle-switch on' : 'toggle-switch off'}>
                                <small>{toggleFlag ? 'On' : 'Off'}</small>
                                <div onClick={toggleBtnClick}>
                                    <div></div>
                                </div>
                            </div> */}

                <div>
                  <span className="material-symbols-outlined">
                    arrow_forward_ios
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display:
                  !resetFlag && expandParam.includes("PaymentGateway")
                    ? "block"
                    : "none",
              }}
            >
              <hr />
              <form onSubmit={showPopup}>
                {/* <h2>Email Settings</h2> */}
                <label>
                  <span>Business Name:</span>
                  <input
                    required
                    type="text"
                    placeholder={document.PAYMENTGATEWAY.businessName}
                    maxLength={50}
                    onChange={(e) => setPGBusinessName(e.target.value)}
                    value={pgBusinessName}
                  />
                </label>
                <label>
                  <span>Business Logo:</span>
                  <input
                    required
                    type="text"
                    placeholder={document.PAYMENTGATEWAY.businessLogo}
                    onChange={(e) => setPGBusinessLogo(e.target.value)}
                    value={pgBusinessLogo}
                  />
                </label>
                <label>
                  <span>Test URL:</span>
                  <input
                    required
                    type="text"
                    placeholder={document.PAYMENTGATEWAY.testURL}
                    maxLength={150}
                    onChange={(e) => setPGURLTest(e.target.value)}
                    value={pgURLTest}
                  />
                </label>
                <label>
                  <span>Test Merchant Key:</span>
                  <input
                    required
                    type="text"
                    placeholder={document.PAYMENTGATEWAY.testMerchantKey}
                    maxLength={50}
                    onChange={(e) => setPGKeyTest(e.target.value)}
                    value={pgKeyTest}
                  />
                </label>
                <label>
                  <span>Test Passcode:</span>
                  <input
                    required
                    type="text"
                    placeholder={document.PAYMENTGATEWAY.testPasscode}
                    maxLength={50}
                    onChange={(e) => setPGPasscodeTest(e.target.value)}
                    value={pgPasscodeTest}
                  />
                </label>
                <label>
                  <span>Prod URL:</span>
                  <input
                    required
                    type="text"
                    placeholder={document.PAYMENTGATEWAY.prodURL}
                    maxLength={150}
                    onChange={(e) => setPGURLProd(e.target.value)}
                    value={pgURLProd}
                  />
                </label>
                <label>
                  <span>Prod Merchant Key:</span>
                  <input
                    required
                    type="text"
                    placeholder={document.PAYMENTGATEWAY.prodMerchantKey}
                    maxLength={50}
                    onChange={(e) => setPGKeyProd(e.target.value)}
                    value={pgKeyProd}
                  />
                </label>
                <label>
                  <span>Prod Passcode:</span>
                  <input
                    required
                    type="text"
                    placeholder={document.PAYMENTGATEWAY.prodPasscode}
                    maxLength={50}
                    onChange={(e) => setPGPasscodeProd(e.target.value)}
                    value={pgPasscodeProd}
                  />
                </label>
                <label>
                  <span>Mode:</span>
                  <input
                    required
                    type="text"
                    placeholder={document.PAYMENTGATEWAY.mode}
                    maxLength={5}
                    onChange={(e) => setPGMode(e.target.value)}
                    value={pgMode}
                  />
                </label>

                {<button className="btn">Save</button>}
                {/* {!isPending && <button className="btn">Save</button>} */}
                {/* {isPending && <button className="btn" disabled>Saving...</button>} */}
                {/* {error && <div className="error">{error}</div>} */}
              </form>
            </div>
          </div>
        </div>

        <div
          onClick={() => expandPanel("Wallet")}
          className="col-lg-6 col-md-12 col-sm-12"
          style={{ display: expandParam.includes("Wallet") ? "block" : "none" }}
        >
          <div className="settings-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="settings-card-details">
                <div>
                  <span className="material-symbols-outlined">
                    account_balance_wallet
                  </span>
                </div>
                <div>
                  <h1>Wallet</h1>
                  <h2>Setup wallet minimum balance for the users</h2>
                </div>
              </div>
              <div className="settings-card-arrow">
                <div
                  className={
                    toggleFlag ? "toggle-switch on" : "toggle-switch off"
                  }
                >
                  <small>{toggleFlag ? "On" : "Off"}</small>
                  <div onClick={toggleBtnClick}>
                    <div></div>
                  </div>
                </div>

                <div>
                  <span className="material-symbols-outlined">
                    arrow_forward_ios
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display:
                  !resetFlag && expandParam.includes("Wallet")
                    ? "block"
                    : "none",
              }}
            >
              <hr />
              <form onSubmit={showPopup}>
                {/* <h2>Email Settings</h2> */}
                <label>
                  <span>Minimum Balance:</span>
                  <input
                    required
                    type="number"
                    placeholder={document.WALLET.minBalance}
                    maxLength={5}
                    onChange={(e) => setWalletMinBalance(e.target.value)}
                    value={walletMinBalance}
                  />
                </label>

                {<button className="btn">Save</button>}
                {/* {!isPending && <button className="btn">Save</button>} */}
                {/* {isPending && <button className="btn" disabled>Saving...</button>} */}
                {/* {error && <div className="error">{error}</div>} */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
