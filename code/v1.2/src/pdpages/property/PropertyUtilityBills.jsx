import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { Modal } from "react-bootstrap"; // Ensure you have imported Modal
import { format } from "date-fns";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import the necessary CSS
const PropertyUtilityBills = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  // get id from url
  const { propertyId } = useParams();
  // get property document
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties",
    propertyId
  );

  // add document
  const { addDocument, updateDocument, deleteDocument, error } =
    useFirestore("utilityBills");

  // get adv document
  const { documents: utilityBillsDoc, errors: utilityBillsDocError } =
    useCollection("utilityBills", ["propertyId", "==", propertyId]);

  // all use states
  const [showAIForm, setShowAIForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedBillType, setSelectedBillType] = useState("");
  const [authorityName, setAuthorityName] = useState("");
  const [billId, setBillId] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [rawDate, setRawDate] = useState(""); // For the raw date input
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  // functions
  const handleShowAIForm = () => setShowAIForm(!showAIForm);
  const handleBillTypeChange = (event) =>
    setSelectedBillType(event.target.value);
  const handleauthorityNameChange = (event) =>
    setAuthorityName(event.target.value);
  const handleBillIdChange = (event) => setBillId(event.target.value);
  const handlePaymentTypeChange = (event) =>
    setSelectedPaymentType(event.target.value);
  const handleAmountDueChange = (event) => setAmountDue(event.target.value);
  //   const handleDueDateChange = (event) => setDueDate(event.target.value);
  const handleDueDateChange = (date) => {
    // Format the selected date as '17 Sep 2024'
    const formattedDate = date ? format(date, "dd MMM yyyy") : "";
    setRawDate(date); // Store raw date
    setDueDate(formattedDate); // Store formatted date
  };

  const handleDeleteClick = (docId) => {
    setDocToDelete(docId);
    setShowConfirmModal(true);
  };

  // Function to hide the modal
  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    setDocToDelete(null);
  };

  // Function to delete the document after confirmation
  const confirmDeleteDocument = async () => {
    try {
      if (docToDelete) {
        await deleteDocument(docToDelete);
        setShowConfirmModal(false);
        setDocToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Convert digit into comma formate start
  function formatNumberWithCommas(number) {
    // Convert number to a string if it's not already
    let numStr = number.toString();

    // Handle decimal part if present
    const [integerPart, decimalPart] = numStr.split(".");

    // Regular expression for Indian comma format
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);

    const formattedNumber =
      otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherDigits ? "," : "") +
      lastThreeDigits;

    // Return the formatted number with decimal part if it exists
    return decimalPart ? `${formattedNumber}.${decimalPart}` : formattedNumber;
  }

  // add document code
  const addUtilityBill = async () => {
    if (
      !selectedBillType ||
      !authorityName ||
      !billId ||
      !selectedPaymentType ||
      !amountDue ||
      !dueDate
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      setIsUploading(true);
      const docRef = await addDocument({
        billType: selectedBillType,
        authorityName,
        billId,
        paymentType: selectedPaymentType,
        amountDue,
        dueDate,
        pid: propertydoc.pid,
        propertyId,
      });
      setSelectedBillType("");
      setAuthorityName("");
      setBillId("");
      setSelectedPaymentType("");
      setAmountDue("");
      setDueDate("");
      setRawDate("");
      setIsUploading(false);
      setShowAIForm(!showAIForm);
      // setNewDocId(docRef.id);
    } catch (error) {
      console.error("Error adding document:", error);
      setSelectedBillType("");
      setAuthorityName("");
      setBillId("");
      setSelectedPaymentType("");
      setAmountDue("");
      setDueDate("");
      setRawDate("");
      setIsUploading(false);
      setShowAIForm(!showAIForm);
    }
  };

  // render jsx code in short form start
  const billType = [
    { id: "camcae", value: "CAM & CAE", label: "CAM & CAE" },
    {
      id: "camcaewater",
      value: "CAM & CAE & Water",
      label: "CAM & CAE & Water",
    },
    { id: "club", value: "Club", label: "Club" },
    {
      id: "commonareaelecticity",
      value: "Common Area Electricity (CAE)",
      label: "Common Area Electricity (CAE)",
    },
    {
      id: "commonareamaintenance",
      value: "Common Area Maintenance (CAM)",
      label: "Common Area Maintenance (CAM)",
    },
    { id: "electricity", value: "Electricity", label: "Electricity" },
    {
      id: "electricitywater",
      value: "Electricity & Water",
      label: "Electricity & Water",
    },
    {
      id: "electricityutilitybill",
      value: "Electricity / Utility Bill",
      label: "Electricity / Utility Bill",
    },
    {
      id: "mainelectwater",
      value: "Main + Elect + Water",
      label: "Main + Elect + Water",
    },
    { id: "maintenance", value: "Maintenance", label: "Maintenance" },
    {
      id: "maintenanceelectricity",
      value: "Maintenance & Electricity",
      label: "Maintenance & Electricity",
    },
    { id: "pnglpg", value: "PNG/LPG", label: "PNG/LPG" },
    { id: "powerbackup", value: "Power Back-up", label: "Power Back-up" },
    { id: "propertytax", value: "Property Tax", label: "Property Tax" },
    { id: "water", value: "Water", label: "Water" },
    {
      id: "watersewerage",
      value: "Water & Sewerage",
      label: "Water & Sewerage",
    },
  ];

  const paymentType = [
    { id: "prepaid", value: "Pre Paid", label: "Pre Paid" },
    {
      id: "postpaid",
      value: "Post Paid",
      label: "Post Paid",
    },
  ];

  // expand more expand less start
  const [expanded, setExpanded] = useState(true);

  const handleExpand = () => {
    setExpanded(!expanded);
  };
  // sexpand more expand less end

  // prop summary click start
  const handleClick = (e) => {
    if (window.innerWidth > 575) {
      navigate(`/propertydetails/${propertyId}`);
    } else {
      e.preventDefault();
    }
  };
  // prop summary click start

  console.log("utilityBillsDoc", utilityBillsDoc);

  return (
    <div className="top_header_pg pg_bg pg_utility_bill ">
      <div className="page_spacing pg_min_height">
        <div className="row row_reverse_991">
          <div className="col-lg-6">
            <div className="title_card mobile_full_575 mobile_gap h-100">
              <h2 className="text-center mb-4">
                OnePlace for Property Utility Bills
              </h2>
              {/* <h6 className="text-center mt-1 mb-2">Your Central Hub for Viewing, Downloading, and Uploading Property Documents</h6> */}
              {!showAIForm && (
                <div
                  className="theme_btn btn_fill no_icon text-center short_btn"
                  onClick={handleShowAIForm}
                >
                  Add New Utility Bill
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            {propertydoc && (
              <div
                className="title_card short_prop_summary relative pointer"
                onClick={handleClick}
              >
                {expanded && (
                  <div className="top on_mobile_575">
                    <div
                      className="d-flex align-items-center"
                      style={{
                        gap: "5px",
                      }}
                    >
                      <h6
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                        }}
                      >
                        {propertydoc.unitNumber} | {propertydoc.society}{" "}
                      </h6>
                    </div>
                  </div>
                )}
                <div className="on_desktop_hide_575">
                  <div className="left">
                    <div className="img">
                      {propertydoc.images.length > 0 ? (
                        <img
                          src={propertydoc.images[0]}
                          alt={propertydoc.bhk}
                        />
                      ) : (
                        <img src="/assets/img/admin_banner.jpg" alt="" />
                      )}
                    </div>
                    <div className="detail">
                      <div>
                        <span className="card_badge">{propertydoc.pid}</span>{" "}
                        <span className="card_badge">
                          {propertydoc.isActiveInactiveReview}
                        </span>
                      </div>
                      <h6 className="demand">
                        <span>₹</span>
                        {propertydoc.demandPrice}
                        {propertydoc.maintenancecharges !== "" && (
                          <span
                            style={{
                              fontSize: "10px",
                            }}
                          >
                            + ₹{propertydoc.maintenancecharges} (
                            {propertydoc.maintenancechargesfrequency})
                          </span>
                        )}
                      </h6>
                      <h6>
                        {propertydoc.unitNumber} | {propertydoc.society}{" "}
                      </h6>
                      <h6>
                        {propertydoc.bhk} | {propertydoc.propertyType}{" "}
                        {propertydoc.furnishing === ""
                          ? ""
                          : " | " + propertydoc.furnishing + "Furnished"}{" "}
                      </h6>
                      <h6>
                        {propertydoc.locality}, {propertydoc.city} |{" "}
                        {propertydoc.state}
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="on_mobile_575">
                  {!expanded && (
                    <div className="left">
                      <div className="img w-100 d-flex align-items-center">
                        {propertydoc.images.length > 0 ? (
                          <img
                            src={propertydoc.images[0]}
                            alt={propertydoc.bhk}
                          />
                        ) : (
                          <img src="/assets/img/admin_banner.jpg" alt="" />
                        )}
                        <Link
                          to={`/propertydetails/${propertyId}`}
                          className="text_green text-center"
                          style={{
                            flexGrow: "1",
                          }}
                        >
                          View Detail
                        </Link>
                      </div>
                      <div className="detail">
                        <div>
                          <span className="card_badge">{propertydoc.pid}</span>{" "}
                          <span className="card_badge">
                            {propertydoc.isActiveInactiveReview}
                          </span>
                        </div>
                        <h6 className="demand">
                          <span>₹</span> {propertydoc.demandPrice}
                          {propertydoc.maintenancecharges !== "" && (
                            <span
                              style={{
                                fontSize: "10px",
                              }}
                            >
                              + ₹{propertydoc.maintenancecharges} (
                              {propertydoc.maintenancechargesfrequency})
                            </span>
                          )}
                        </h6>
                        <h6>
                          {propertydoc.unitNumber} | {propertydoc.society}{" "}
                        </h6>
                        <h6>
                          {propertydoc.bhk} | {propertydoc.propertyType}{" "}
                          {propertydoc.furnishing === ""
                            ? ""
                            : " | " + propertydoc.furnishing + "Furnished"}{" "}
                        </h6>
                        <h6>
                          {propertydoc.locality}, {propertydoc.city} |{" "}
                          {propertydoc.state}
                        </h6>
                      </div>
                    </div>
                  )}
                </div>

                <div className="expand on_mobile_575" onClick={handleExpand}>
                  <span className="material-symbols-outlined">
                    {expanded ? "keyboard_arrow_down" : "keyboard_arrow_up"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        {showAIForm && (
          <>
            <div className="vg22"></div>
            <section className="my_big_card add_doc_form">
              {/* <h2 className="card_title">Select any one document ID</h2> */}
              <div className="aai_form">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <div className="form_field">
                      <div className="field_box theme_radio_new">
                        <div className="theme_radio_container">
                          {billType.map((bill) => (
                            <div className="radio_single" key={bill.id}>
                              <input
                                type="radio"
                                name="bill_type"
                                id={bill.id}
                                value={bill.value}
                                onChange={handleBillTypeChange}
                                checked={selectedBillType === bill.value}
                              />
                              <label htmlFor={bill.id}>{bill.label}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="row" style={{ rowGap: "18px" }}>
                      <div className="col-md-6">
                        <div className="add_info_text">
                          <div className="form_field">
                            <div className="relative">
                              <input
                                type="text"
                                value={authorityName}
                                onChange={handleauthorityNameChange}
                                placeholder="Name of authority"
                                className="w-100"
                              
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="add_info_text">
                          <div className="form_field">
                            <div className="relative">
                              <input
                                type="text"
                                value={billId}
                                onChange={handleBillIdChange}
                                placeholder="Bill ID"
                                className="w-100"
                                style={{
                                  background:"whitesmoke"
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form_field">
                          <div className="field_box theme_radio_new">
                            <div className="theme_radio_container">
                              {paymentType.map((pt) => (
                                <div className="radio_single" key={pt.id}>
                                  <input
                                    type="radio"
                                    name="payment_type"
                                    id={pt.id}
                                    value={pt.value}
                                    onChange={handlePaymentTypeChange}
                                    checked={selectedPaymentType === pt.value}
                                  />
                                  <label htmlFor={pt.id}>{pt.label}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="add_info_text">
                          <div className="form_field price_input relative">
                            <input
                              type="number"
                              value={amountDue}
                              onChange={handleAmountDueChange}
                              placeholder="Amount due"
                              className="w-100"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="add_info_text w-100">
                          <div className="form_field w-100">
                            <div className="relative">
                              <DatePicker
                                selected={rawDate}
                                onChange={handleDueDateChange}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Amount due date"
                                className="w-100"
                                // isClearable
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="row">
                          <div className="col-6">
                            <div
                              className="theme_btn btn_border text-center no_icon"
                              onClick={isUploading ? null : handleShowAIForm}
                            >
                              Cancel
                            </div>
                          </div>
                          <div className="col-6">
                            <div
                              className={`theme_btn btn_fill text-center no_icon ${
                                isUploading ? "disabled" : ""
                              }`}
                              onClick={isUploading ? null : addUtilityBill}
                            >
                              {isUploading ? "Uploading..." : "Save"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
        {utilityBillsDoc && utilityBillsDoc.length !== 0 && (
          <>
            <div className="vg22"></div>
            <hr />
            <div className="vg22"></div>
          </>
        )}
        {utilityBillsDoc && utilityBillsDoc.length === 0 && (
          <div
            className="pg_msg"
            style={{
              height: "calc(55vh)",
            }}
          >
            <div>No Utility Bill Yet!</div>
          </div>
        )}
        <div className="my_small_card_parent">
          {utilityBillsDoc &&
            utilityBillsDoc.map((doc, index) => (
              <div className="my_small_card notification_card" key={index}>
                <div className="left">
                  <div className="img_div">
                    {doc.billType === "Common Area Maintenance (CAM)" ||
                    doc.billType.toLowerCase() === "maintenance" ? (
                      <img src="/assets/img/icons/maintainance.png" alt="" />
                    ) : doc.billType.toLowerCase() === "club" ? (
                      <img src="/assets/img/icons/clubill.png" alt="" />
                    ) : doc.billType === "Common Area Electricity (CAE)" ||
                      doc.billType.toLowerCase() === "electricity" ? (
                      <img src="/assets/img/icons/electicitybill.png" alt="" />
                    ) : doc.billType.toLowerCase() === "water" ? (
                      <img src="/assets/img/icons/waterbill.png" alt="" />
                    ) : doc.billType === "PNG/LPG" ? (
                      <img src="/assets/img/icons/lpgbill.png" alt="" />
                    ) : doc.billType === "Power Back-up" ? (
                      <img src="/assets/img/icons/powerbackup.png" alt="" />
                    ) : doc.billType === "Property Tax" ? (
                      <img src="/assets/img/icons/propertytax.png" alt="" />
                    ) : doc.billType === "Main + Elect + Water" ||
                      doc.billType === "CAM & CAE & Water" ? (
                      <img src="/assets/img/icons/emw.png" alt="" />
                    ) : doc.billType === "Maintenance & Electricity" ||
                      doc.billType === "CAM & CAE" ? (
                      <img src="/assets/img/icons/em.png" alt="" />
                    ) : doc.billType === "Electricity & Water" ? (
                      <img src="/assets/img/icons/ew.png" alt="" />
                    ) : doc.billType === "Water & Sewerage" ? (
                      <img src="/assets/img/icons/sw.png" alt="" />
                    ) : doc.billType === "Electricity / Utility Bill" ? (
                      <img src="/assets/img/icons/ue.png" alt="" />
                    ) : null}
                  </div>
                  <div className="right">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="title">{doc.authorityName}</h5>
                        <h6 className="sub_title">{doc.paymentType}</h6>
                      </div>
                      <div
                        onClick={() => handleDeleteClick(doc.id)} // Set the document to delete
                        className="text_red pointer"
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        Remove
                      </div>
                      <Modal
                        show={showConfirmModal}
                        onHide={handleConfirmClose}
                        className="delete_modal"
                        centered
                      >
                        <div className="alert_text text-center">Alert</div>

                        <div className="sure_content text-center">
                          Are you sure you want to remove this utility bill?
                        </div>
                        <div className="yes_no_btn">
                          <div
                            className="theme_btn full_width no_icon text-center btn_border"
                            onClick={confirmDeleteDocument} // Confirm and delete
                          >
                            Yes
                          </div>
                          <div
                            className="theme_btn full_width no_icon text-center btn_fill"
                            onClick={handleConfirmClose} // Close modal without deleting
                          >
                            No
                          </div>
                        </div>
                      </Modal>
                    </div>
                    <h6 className="sub_title text-capitalize">{doc.billId}</h6>
                  </div>
                </div>
                <h4 className="top_right_content">
                  <span>
                    {format(doc.createdAt.toDate(), "dd-MMM-yy hh:mm a")}
                  </span>
                </h4>
                <h4 className="top_left_content">
                  <span className="text-capitalize">{doc.billType}</span>
                </h4>

                <div className="bottom_strip">
                  <div className="bs_left">
                    <h5>
                      {doc.dueDate}
                      <span>(Due Date)</span>
                    </h5>
                    <h6></h6>
                  </div>
                  <div className="bs_right">
                    <h4>₹ {formatNumberWithCommas(doc.amountDue)}</h4>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyUtilityBills;
