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
import PropertySummaryCard from "./PropertySummaryCard";
import InactiveUserCard from "../../components/InactiveUserCard";
const PropertyUtilityBills = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  // get id from url
  const { propertyId } = useParams();
  // get property document
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties-propdial",
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
  const cancelClick = () => {
    setShowAIForm(!showAIForm);
    setSelectedBillType("");
    setAuthorityName("");
    setBillId("");
    setSelectedPaymentType("");
    setAmountDue("");
    setDueDate("");
    setRawDate("");

    setErrors([]);
  };

  const handleBillTypeChange = (event) => {
    setSelectedBillType(event.target.value);
    if (errors.selectedBillType) {
      setErrors((prevErrors) => ({ ...prevErrors, selectedBillType: "" }));
    }
  };

  const handleauthorityNameChange = (event) => {
    setAuthorityName(event.target.value);
    if (errors.authorityName) {
      setErrors((prevErrors) => ({ ...prevErrors, authorityName: "" }));
    }
  };

  const handleBillIdChange = (event) => {
    setBillId(event.target.value);
    if (errors.billId) {
      setErrors((prevErrors) => ({ ...prevErrors, billId: "" })); // Corrected key
    }
  };

  const handlePaymentTypeChange = (event) => {
    setSelectedPaymentType(event.target.value);
    if (errors.selectedPaymentType) {
      setErrors((prevErrors) => ({ ...prevErrors, selectedPaymentType: "" }));
    }
  };

  const handleAmountDueChange = (event) => {
    const value = Math.max(0, Number(event?.target?.value || 0)); // Ensure non-negative values
    setAmountDue(value); // Use the processed value
    if (errors.amountDue) {
      setErrors((prevErrors) => ({ ...prevErrors, amountDue: "" }));
    }
  };

  const handleDueDateChange = (date) => {
    // Format the selected date as '17 Sep 2024'
    const formattedDate = date ? format(date, "dd MMM yyyy") : "";
    setRawDate(date); // Store raw date
    setDueDate(formattedDate); // Store formatted date
    if (errors.rawDate) {
      setErrors((prevErrors) => ({ ...prevErrors, rawDate: "" }));
    }
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

  // error set code
  const [errors, setErrors] = useState({});

  // Validate form and set error messages
  const validateForm = () => {
    const newErrors = {};

    if (!selectedBillType)
      newErrors.selectedBillType = "Please select an advertisement portal.";
    if (!authorityName)
      newErrors.authorityName = "Please enter the property ID";
    if (!billId) newErrors.billId = "Please select the property type.";
    if (!selectedPaymentType)
      newErrors.selectedPaymentType = "Please enter a valid URL.";
    if (!amountDue) newErrors.amountDue = "Please enter a valid URL.";
    if (!rawDate) newErrors.rawDate = "Please enter a valid URL.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  useEffect(() => {
    // Clear errors whenever the fields change
    if (selectedBillType)
      setErrors((prevErrors) => ({ ...prevErrors, selectedBillType: "" }));
    if (authorityName)
      setErrors((prevErrors) => ({ ...prevErrors, authorityName: "" }));
    if (billId) setErrors((prevErrors) => ({ ...prevErrors, billId: "" }));
    if (selectedPaymentType)
      setErrors((prevErrors) => ({ ...prevErrors, selectedPaymentType: "" }));
    if (amountDue)
      setErrors((prevErrors) => ({ ...prevErrors, amountDue: "" }));
    if (rawDate) setErrors((prevErrors) => ({ ...prevErrors, rawDate: "" }));
  }, [
    selectedBillType,
    authorityName,
    billId,
    selectedPaymentType,
    amountDue,
    rawDate,
  ]);

  // add document code
  const addUtilityBill = async () => {
    if (!validateForm()) return;

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
        postedBy: "Propdial",
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

  return (
    <>
      {user && user.status === "active" ? (
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
              <PropertySummaryCard
                propertydoc={propertydoc}
                propertyId={propertyId}
              />
            </div>
            {showAIForm && (
              <>
                <div className="vg22"></div>
                <section className="my_big_card add_doc_form mobile_full_575 ">
                  {/* <h2 className="card_title">Select any one document ID</h2> */}
                  <div className="aai_form">
                    <div className="row row_gap_20">
                      <div className="col-12">
                        <div
                          className="form_field"
                          style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid rgb(3 70 135 / 22%)",
                          }}
                        >
                          <h6
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                              marginBottom: "8px",
                              color: "var(--theme-blue)",
                            }}
                          >
                            Select Bill Type*
                          </h6>

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
                          {errors.selectedBillType && (
                            <div className="field_error w-100">
                              {errors.selectedBillType}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div
                          className="form_field w-100"
                          style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid rgb(3 70 135 / 22%)",
                          }}
                        >
                          <h6
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                              marginBottom: "8px",
                              color: "var(--theme-blue)",
                            }}
                          >
                            Name of Authority*
                          </h6>
                          <div className="relative">
                            <input
                              type="text"
                              value={authorityName}
                              onChange={handleauthorityNameChange}
                              placeholder="Enter the name of the authority"
                              className="w-100"
                              onKeyPress={(e) => {
                                const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces allowed
                                if (!regex.test(e.key)) {
                                  e.preventDefault(); // Prevent invalid input
                                }
                              }}
                            />
                          </div>
                          {errors.authorityName && (
                            <div className="field_error w-100">
                              {errors.authorityName}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div
                          className="form_field w-100"
                          style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid rgb(3 70 135 / 22%)",
                          }}
                        >
                          <h6
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                              marginBottom: "8px",
                              color: "var(--theme-blue)",
                            }}
                          >
                            Bill ID*
                          </h6>
                          <div className="relative">
                            <input
                              type="text"
                              value={billId}
                              onChange={handleBillIdChange}
                              placeholder="Enter bill ID"
                              className="w-100"
                            />
                          </div>
                          {errors.billId && (
                            <div className="field_error w-100">
                              {errors.billId}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div
                          className="form_field w-100"
                          style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid rgb(3 70 135 / 22%)",
                          }}
                        >
                          <h6
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                              marginBottom: "8px",
                              color: "var(--theme-blue)",
                            }}
                          >
                            Payment Type*
                          </h6>
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
                          {errors.selectedPaymentType && (
                            <div className="field_error w-100">
                              {errors.selectedPaymentType}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div
                          className="form_field w-100"
                          style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid rgb(3 70 135 / 22%)",
                          }}
                        >
                          <h6
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                              marginBottom: "8px",
                              color: "var(--theme-blue)",
                            }}
                          >
                            Amount Due*
                          </h6>
                          <div className="price_input two relative">
                            <input
                              type="number"
                              value={amountDue}
                              onChange={handleAmountDueChange}
                              min="0"
                              placeholder="Enter the due amount"
                              className="w-100"
                            />
                          </div>
                          {errors.amountDue && (
                            <div className="field_error w-100">
                              {errors.amountDue}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div
                          className="form_field w-100"
                          style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid rgb(3 70 135 / 22%)",
                          }}
                        >
                          <h6
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                              marginBottom: "8px",
                              color: "var(--theme-blue)",
                            }}
                          >
                            Amount Due Date*
                          </h6>
                          <div className="relative">
                            <DatePicker
                              selected={rawDate}
                              onChange={handleDueDateChange}
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Select the due date"
                              className="w-100"
                              // isClearable
                            />
                          </div>
                          {errors.rawDate && (
                            <div className="field_error w-100">
                              {errors.rawDate}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="row">
                          <div className="col-7"></div>
                          <div className="col-md-2 col-6">
                            <div
                              className="theme_btn btn_border text-center no_icon"
                              onClick={isUploading ? null : cancelClick}
                            >
                              Cancel
                            </div>
                          </div>
                          <div className="col-md-3 col-6">
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
                </section>
              </>
            )}
            {utilityBillsDoc && utilityBillsDoc.length !== 0 && (
              <>
                {/* <div className="vg22"></div>
          <hr /> */}
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
                    {user && user.role === "superAdmin" && (
                      <span
                        className="material-symbols-outlined delete_icon_top"
                        onClick={() => handleDeleteClick(doc.id)} // Set the document to delete
                      >
                        delete_forever
                      </span>
                    )}
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
                    <div className="left">
                      <div className="img_div">
                        {doc.billType === "Common Area Maintenance (CAM)" ||
                        doc.billType.toLowerCase() === "maintenance" ? (
                          <img
                            src="/assets/img/icons/maintainance.png"
                            alt=""
                          />
                        ) : doc.billType.toLowerCase() === "club" ? (
                          <img src="/assets/img/icons/clubill.png" alt="" />
                        ) : doc.billType === "Common Area Electricity (CAE)" ||
                          doc.billType.toLowerCase() === "electricity" ? (
                          <img
                            src="/assets/img/icons/electicitybill.png"
                            alt=""
                          />
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
                        <h5 className="title">{doc.authorityName}</h5>
                        <h6 className="sub_title text-capitalize">
                          Bill ID:- {doc.billId}
                        </h6>
                        <h6 className="sub_title">
                          Payment Type: {doc.paymentType}
                        </h6>
                      </div>
                    </div>
                    <h4 className="top_right_content">
                      <span>
                        {format(doc.createdAt.toDate(), "dd-MMM-yy hh:mm a")}
                      </span>
                    </h4>

                    <div className="top_tag_left working">{doc.billType}</div>
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
      ) : (
        <InactiveUserCard />
      )}
    </>
  );
};

export default PropertyUtilityBills;
