import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { format } from "date-fns";
import { useDocument } from "../../hooks/useDocument";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ReactTable from "../../components/ReactTable";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import Select from "react-select";
import { projectFirestore, timestamp } from "../../firebase/config";

const UpdateEnquiry = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { updateDocument, error: updateDocumentError } =
    useFirestore("enquiry-propdial");

  const { document: enquiryDocument, error: enquiryDocError } = useDocument(
    "enquiry-propdial",
    id
  );
  // get user collection
  const { documents: dbUsers, error: dbuserserror } = useCollection(
    "users-propdial",
    ["status", "==", "active"]
  );

  const [enquiryFrom, setEnquiryFrom] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [enquiryType, setEnquiryType] = useState("");
  const [source, setSource] = useState("");
  const [name, setName] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [propertyOwner, setPropertyOwner] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(new Date());
  const [enquiryStatus, setEnquiryStatus] = useState("open");
  const [remark, setRemark] = useState("");
  const [updateType, setUpdateType] = useState("");
  const [updateForOwner, setUpdateForOwner] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dbUserState, setdbUserState] = useState(dbUsers);


  const { documents: allProperties, error: allPropertiesError } = useCollection(
    "properties-propdial"
  );
  const [proeprtyListforUserIdState, setproeprtyListforUserIdState] =
    useState("");
  const [ownersProeprtyList, setOwnersProeprtyList] = useState();

  const proeprtyListforUserId = async (_userId) => {
    // console.log("_userId: ", _userId)
    let results = [];
    let propertyList = [];
    const ref = await projectFirestore
      .collection("propertyusers")
      .where("userId", "==", _userId);

    // console.log("ref: ", ref);
    const unsubscribe = ref.onSnapshot(async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        // console.log("user mapping doc: ", doc.data())
        results.push({ ...doc.data(), id: doc.id });
      });
      // console.log("results 1: ", results)
      // setproeprtyListforUserIdState(results);

      results &&
        results.map((property) => {
          const _prop = allProperties.find((e) => e.id === property.propertyId);
          propertyList.push({ ..._prop });
        });
      // console.log("propertyList: ", propertyList);

      setOwnersProeprtyList(
        propertyList.map((data) => ({
          label: data.propertyName,
          value: data.id,
        }))
      );

    });

    // console.log("results: ", results)

    // let results = [];

  };

  useEffect(() => {
    setdbUserState(dbUsers);
    if (enquiryDocument) {
      setEnquiryFrom(enquiryDocument.enquiryFrom || "");
      setReferredBy(enquiryDocument.referredBy || "");
      setEnquiryType(enquiryDocument.enquiryType || "");
      setSource(enquiryDocument.source || "");
      setName(enquiryDocument.name || "");
      setEmployeeName(enquiryDocument.employeeName || "");
      setPropertyOwner(enquiryDocument.propertyOwner || "");
      // setPropertyName(enquiryDocument.propertyName || "");
      setPropertyName({ label: enquiryDocument.propertyName, value: enquiryDocument.propId });
      setPhone(enquiryDocument.phone || "");
      setEmail(enquiryDocument.email || "");
      setDate(new Date(enquiryDocument.date) || new Date());
      setEnquiryStatus(enquiryDocument.enquiryStatus || "open");
      setRemark(enquiryDocument.remark || "");


      //Load Properties of assigned Owners
      proeprtyListforUserId(enquiryDocument.propertyOwnerId)
    }


  }, [enquiryDocument, dbUsers]);

  // console.log("dbUserState", dbUserState);


  const [errors, setErrors] = useState({});

  const handleFieldChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter(value);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors[name]) delete newErrors[name];
      return newErrors;
    });
  };

  const handleChangeEnquiryFrom = (event) => setEnquiryFrom(event.target.value);
  const handleChangeReferredBy = (event) => setReferredBy(event.target.value);
  const handleChangeEnquiryType = (event) => setEnquiryType(event.target.value);
  const handleChangeName = (event) => setName(event.target.value);
  const handleChangePhone = (phone) => setPhone(phone);
  const handleChangeEmail = (event) => setEmail(event.target.value);
  const handleChangeDate = (date) => setDate(date);
  // const handleChangeEnquiryStatus = (event) => setEnquiryStatus(event.target.value);
  const handleChangeEnquiryStatus = handleFieldChange(setEnquiryStatus);
  const handleChangeRemark = (event) => setRemark(event.target.value);
  const handleChangeSource = (event) => setSource(event.target.value);
  const handleChangeEmployeeName = (event) =>
    setEmployeeName(event.target.value);
  const handleChangePropertyName = (event) =>
    setPropertyName({ label: event.target.label, value: event.target.value });
  const handleChangePropertyOwner = (event) =>
    setPropertyOwner(event.target.value);
  // const handleChangeUpdateType = (event) => setUpdateType(event.target.value);
  const handleChangeUpdateType = handleFieldChange(setUpdateType);
  const handleChangeUpdateForOwner = (event) =>
    setUpdateForOwner(event.target.value);
  const handleChangeVisitDate = (date) => {
    setVisitDate(date); // Update state with selected date
  };

  const handlePropertyName = async (option) => {
    setPropertyName(option)
  }

  const validateFields = () => {
    let errors = {};

    if (!updateType) errors.updateType = "Update type is a required field";
    // Check if updateType is 'visit' and visitDate is not provided
    if (updateType === "visit" && !visitDate) {
      errors.visitDate = "Please select visiting date";
    }
    if (!enquiryStatus || enquiryStatus === "open") {
      errors.esForWorking = "Please select  enquiry status";
    }
    if (!updateForOwner) {
      errors.updateForOwner = "Update for owner is a required field";
    } else if (updateForOwner.length < 20) {
      errors.updateForOwner =
        "Update for owner must be at least 20 characters long";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitEnquiry = async (event) => {
    event.preventDefault();
    if (!validateFields()) {
      return;
    }
    try {
      setIsUploading(true);

      const newStatusUpdate = {
        status: enquiryStatus,
        // timestamp: new Date().toISOString(),
        updatedAt: new Date(),
        remark,
        updateType,
        updateForOwner,
        visitDate,
        updatedBy: user.uid,
      };

      const updatedDocument = {
        enquiryFrom,
        referredBy,
        enquiryType,
        name,
        phone,
        email,
        date: new Date(date).toISOString(),
        enquiryStatus,
        remark,
        source,
        employeeName,
        // propertyOwner,
        // propertyName,
      };

      if (enquiryDocument?.statusUpdates) {
        updatedDocument.statusUpdates = [
          ...enquiryDocument.statusUpdates,
          newStatusUpdate,
        ];
      } else {
        updatedDocument.statusUpdates = [newStatusUpdate];
      }
      await updateDocument(id, updatedDocument);
      setIsUploading(false);
      navigate("/enquiry/all");
    } catch (error) {
      console.error("Error updating document:", error);
      setIsUploading(false);
    }
  };

  //   get enquiry status

  useEffect(() => {
    if (enquiryDocument) {
      const lastStatus = enquiryDocument?.statusUpdates?.length
        ? enquiryDocument.statusUpdates[
          enquiryDocument.statusUpdates.length - 1
        ].status
        : "open";
      setEnquiryStatus(lastStatus);
    }
  }, [enquiryDocument]);

  const getStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case "open":
        return ["working"];
      case "working":
        return ["working", "successful", "dead"];
      default:
        return ["working", "successful", "dead"];
    }
  };

  const statusOptions = getStatusOptions(
    enquiryDocument && enquiryDocument.enquiryStatus
  );
  // get enquiry status

  const backViewEnquiry = () => {
    navigate("/enquiry/all");
  };

  // table data start
  const columns = useMemo(() => {
    if (!dbUserState) return []; // Return an empty array if dbUserState is not available

    return [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "serialNumber",
        Cell: ({ row }) => row.index + 1,
        disableFilters: true,
      },
      {
        Header: "Update for owner",
        accessor: "updateForOwner",
        disableFilters: true,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => <span className="text-capitalize">{value}</span>,
        disableFilters: true,
      },
      {
        Header: "Type",
        accessor: "updateType",
        Cell: ({ value }) => <span className="text-capitalize">{value}</span>,
        disableFilters: true,
      },
      {
        Header: "Visit Date",
        accessor: "visitDate",
        disableFilters: true,
        Cell: ({ value }) => {
          if (value && value.seconds) {
            const date = new Date(value.seconds * 1000);
            return format(date, "dd-MMM-yy");
          }
          return value ? format(new Date(value), "dd-MMM-yy") : "N/A";
        },
      },
      {
        Header: "Updated At",
        accessor: "updatedAt",
        Cell: ({ value }) =>
          format(new Date(value.seconds * 1000), "dd-MMM-yy hh:mm a"),
        disableFilters: true,
      },
      {
        Header: "Updated By",
        accessor: "updatedBy",
        Cell: ({ value }) => (
          <span className="text-capitalize">
            {dbUserState.find((user) => user.id === value)?.fullName || "Unknown"}
          </span>
        ),
        disableFilters: true,
      },
    ];
  }, [dbUserState]);



  if (!enquiryDocument) {
    return <div>Loading...</div>;
  }
  // table data end

  // field only in readonly mode
  const isReadOnly = user && user.role !== "superAdmin";



  return (
    <div className="top_header_pg pg_bg pg_enquiry pg_enquiry_update">
      <div className="page_spacing">
        <div className="pg_header d-flex justify-content-between">
          <div
            className="left d-flex align-items-center pointer"
            style={{
              gap: "5px",
            }}
          >
            <span
              className="material-symbols-outlined pointer"
              onClick={backViewEnquiry}
            >
              arrow_back
            </span>
            <h2 className="m22 mb-1">Update Enquiry
            </h2>
          </div>
          <div className="right">
            <div
              className="d-flex align-items-center"
              style={{
                gap: "22px",
              }}
            >
              <Link to="/enquiry/all" className="theme_btn btn_border no_icon text-center">
                Cancel
              </Link>
              <button
                className="theme_btn btn_fill no_icon text-center"
                onClick={submitEnquiry}
                disabled={isUploading}
              >
                {isUploading ? "Updating..." : "Update Enquiry"}
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="add_enquiry">
          <div className="vg22"></div>
          <div className="row row_gap">
            <div className="col-md-4">
              <div className="form_field label_top">
                <label htmlFor="">Click To Select Date</label>
                <div className="form_field_inner with_icon">
                  <DatePicker
                    selected={date}
                    onChange={handleChangeDate}
                    maxDate={new Date()}
                    minDate={
                      new Date(new Date().setDate(new Date().getDate() - 1))
                    }
                    dateFormat="dd/MM/yyyy"
                    readOnly={isReadOnly}
                    className={isReadOnly ? "no-drop-cursor" : ""}
                  />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">
                      calendar_month
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form_field st-2 label_top">
                <label htmlFor="">Enquiry Type</label>
                <div className="field_box theme_radio_new">
                  <div className="theme_radio_container">
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="enquiryType"
                        id="rent"
                        onClick={handleChangeEnquiryType}
                        value="rent"
                        checked={enquiryType === "rent"}
                        disabled={isReadOnly}
                      />
                      <label
                        htmlFor="rent"
                        className={`radio_label ${isReadOnly ? "no-drop-cursor" : ""
                          }`}
                      >
                        rent
                      </label>
                    </div>
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="enquiryType"
                        id="sale"
                        onClick={handleChangeEnquiryType}
                        value="sale"
                        checked={enquiryType === "sale"}
                        disabled={isReadOnly}
                      />
                      <label
                        htmlFor="sale"
                        className={`radio_label ${isReadOnly ? "no-drop-cursor" : ""
                          }`}
                      >
                        sale
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form_field st-2 label_top">
                <label htmlFor="">Enquiry From</label>
                <div className="field_box theme_radio_new">
                  <div className="theme_radio_container">
                    {enquiryType.toLowerCase() === "rent" && (
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="enquiryFrom"
                          id="tenant"
                          onClick={handleChangeEnquiryFrom}
                          value="prospective tenant"
                          checked={enquiryFrom === "prospective tenant"}
                          disabled={isReadOnly}
                        />
                        <label
                          htmlFor="tenant"
                          className={`radio_label ${isReadOnly ? "no-drop-cursor" : ""
                            }`}
                        >
                          prospective tenant
                        </label>
                      </div>
                    )}
                    {enquiryType.toLowerCase() === "sale" && (
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="enquiryFrom"
                          id="buyer"
                          onClick={handleChangeEnquiryFrom}
                          value="prospective buyer"
                          checked={enquiryFrom === "prospective buyer"}
                          disabled={isReadOnly}
                        />
                        <label
                          htmlFor="buyer"
                          className={`radio_label ${isReadOnly ? "no-drop-cursor" : ""
                            }`}
                        >
                          prospective buyer
                        </label>
                      </div>
                    )}
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="enquiryFrom"
                        id="agent"
                        onClick={handleChangeEnquiryFrom}
                        value="agent"
                        checked={enquiryFrom === "agent"}
                        disabled={isReadOnly}
                      />
                      <label
                        htmlFor="agent"
                        className={`radio_label ${isReadOnly ? "no-drop-cursor" : ""
                          }`}
                      >
                        Agent
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form_field st-2 label_top">
                <label htmlFor="">Referred By</label>
                <div className="field_box theme_radio_new">
                  <div className="theme_radio_container">
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="referredBy"
                        id="owner"
                        onClick={handleChangeReferredBy}
                        value="owner"
                        checked={referredBy === "owner"}
                        disabled={isReadOnly}
                      />
                      <label
                        htmlFor="owner"
                        className={`radio_label ${isReadOnly ? "no-drop-cursor" : ""
                          }`}
                      >
                        owner
                      </label>
                    </div>
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="referredBy"
                        id="propdial"
                        onClick={handleChangeReferredBy}
                        value="propdial"
                        checked={referredBy === "propdial"}
                        disabled={isReadOnly}
                      />
                      <label
                        htmlFor="propdial"
                        className={`radio_label ${isReadOnly ? "no-drop-cursor" : ""
                          }`}
                      >
                        propdial
                      </label>
                    </div>
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="referredBy"
                        id="employee"
                        onClick={handleChangeReferredBy}
                        value="employee"
                        checked={referredBy === "employee"}
                        disabled={isReadOnly}
                      />
                      <label
                        htmlFor="employee"
                        className={`radio_label ${isReadOnly ? "no-drop-cursor" : ""
                          }`}
                      >
                        employee
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {referredBy === "propdial" && (
              <div className="col-md-8">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Source</label>
                  <div className="field_box theme_radio_new">
                    <div className="theme_radio_container">
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="source"
                          id="99acres"
                          onClick={handleChangeSource}
                          value="99acres"
                          checked={source === "99acres"}
                          disabled={isReadOnly}
                        />
                        <label
                          htmlFor="99acres"
                          className={`radio_label ${isReadOnly ? "no-drop-cursor" : ""
                            }`}
                        >
                          99acres
                        </label>
                      </div>
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="source"
                          id="magicBricks"
                          onClick={handleChangeSource}
                          value="magicbricks"
                          checked={source === "magicbricks"}
                          disabled={isReadOnly}
                        />
                        <label
                          htmlFor="magicBricks"
                          className={`radio_label ${isReadOnly ? "no-drop-cursor" : ""
                            }`}
                        >
                          magicbricks
                        </label>
                      </div>
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="source"
                          id="housing"
                          onClick={handleChangeSource}
                          value="housing"
                          checked={source === "housing"}
                          disabled={isReadOnly}
                        />
                        <label
                          htmlFor="housing"
                          className={`radio_label ${isReadOnly ? "no-drop-cursor" : ""
                            }`}
                        >
                          housing
                        </label>
                      </div>
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="source"
                          id="other"
                          onClick={handleChangeSource}
                          value="other"
                          checked={source === "other"}
                          disabled={isReadOnly}
                        />
                        <label
                          htmlFor="other"
                          className={`radio_label ${isReadOnly ? "no-drop-cursor" : ""
                            }`}
                        >
                          other
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {referredBy === "employee" && (
              <div className="col-md-8">
                <div className="form_field label_top">
                  <label htmlFor="">Employee Name</label>
                  <div className="form_field_inner with_icon">
                    <input
                      type="text"
                      placeholder="Select employee"
                      value={employeeName}
                      onChange={handleChangeEmployeeName}
                      readOnly={isReadOnly}
                      className={isReadOnly ? "no-drop-cursor" : ""}
                    />
                    <div className="field_icon">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="row row_gap">
              <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Property Owner</label>
                  <div className="form_field_inner with_icon">
                    <input
                      type="text"
                      value={propertyOwner}
                      onChange={handleChangePropertyOwner}
                      readOnly
                      className={isReadOnly ? "no-drop-cursor" : ""}
                    />
                    <div className="field_icon">
                      <span className="material-symbols-outlined">search</span>
                    </div>{" "}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form_field label_top">
                  <label htmlFor="propname">Property Name*</label>
                  <div className="form_field_inner with_icon">

                    <Select
                      isDisabled
                      className=""
                      onChange={handlePropertyName}
                      options={ownersProeprtyList}
                      value={propertyName}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          outline: "none",
                          background: "#eee",
                          borderBottom: " 1px solid var(--theme-blue)",
                        }),
                      }}
                    />


                  </div>
                  {errors.propertyName && (
                    <div className="field_error">{errors.propertyName}</div>
                  )}
                </div>
              </div>
              {/* <div className="col-md-6">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Property Name</label>
                  <div className="form_field_inner with_icon">
                    <input
                      type="text"
                      value={propertyName}
                      onChange={handleChangePropertyName}
                      readOnly={isReadOnly}
                      className={isReadOnly ? "no-drop-cursor" : ""}
                    />
                    <div className="field_icon">
                      <span className="material-symbols-outlined">search</span>
                    </div>{" "}
                  </div>
                </div>
              </div> */}
              <div className="col-md-4">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">
                    {enquiryFrom === "agent"
                      ? "agent"
                      : enquiryFrom === "prospective tenant"
                        ? "Prospective Tenant"
                        : enquiryFrom === "prospective buyer"
                          ? "Prospective Buyer"
                          : ""}{" "}
                    Name
                  </label>
                  <div className="form_field_inner with_icon">
                    <input
                      type="text"
                      readOnly={isReadOnly}
                      className={isReadOnly ? "no-drop-cursor" : ""}
                      value={name}
                      onChange={handleChangeName}
                    />
                    <div className="field_icon">
                      <span className="material-symbols-outlined">draw</span>
                    </div>{" "}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form_field label_top">
                  <label htmlFor="">
                    {enquiryFrom === "agent"
                      ? "agent"
                      : enquiryFrom === "prospective tenant"
                        ? "Prospective Tenant"
                        : enquiryFrom === "prospective buyer"
                          ? "Prospective Buyer"
                          : ""}{" "}
                    Contact
                  </label>
                  <div className="form_field_inner with_icon">
                    <PhoneInput
                      country={"in"}
                      onlyCountries={["in", "us", "ae"]}
                      value={phone}
                      onChange={handleChangePhone}
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
                      }}
                      buttonStyle={{
                        textAlign: "left",
                      }}
                      disableAreaCodes={isReadOnly}
                      disabled={isReadOnly}
                      className={isReadOnly ? "no-drop-cursor" : ""}
                    />
                    <div className="field_icon">
                      <span className="material-symbols-outlined">draw</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form_field label_top">
                  <label htmlFor="">
                    {enquiryFrom === "agent"
                      ? "agent"
                      : enquiryFrom === "prospective tenant"
                        ? "Prospective Tenant"
                        : enquiryFrom === "prospective buyer"
                          ? "Prospective Buyer"
                          : ""}{" "}
                    Email
                  </label>
                  <div className="form_field_inner with_icon">
                    <input
                      type="email"
                      value={email}
                      onChange={handleChangeEmail}
                      readOnly={isReadOnly}
                      className={isReadOnly ? "no-drop-cursor" : ""}
                    />
                    <div className="field_icon">
                      <span className="material-symbols-outlined">draw</span>
                    </div>{" "}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form_field label_top">
                  <label htmlFor="">Remarks (For Office Use Only)</label>
                  <div className="form_field_inner with_icon">
                    <input
                      type="text"
                      className="input_field"
                      value={remark}
                      onChange={handleChangeRemark}
                    />
                    <div className="field_icon">
                      <span className="material-symbols-outlined">draw</span>
                    </div>{" "}
                  </div>
                </div>
              </div>
              <hr />
              <div className="col-md-4">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Enquiry Status</label>
                  <div className="field_box theme_radio_new">
                    <div className="theme_radio_container">
                      {statusOptions.includes("open") && (
                        <div className="radio_single">
                          <input
                            type="radio"
                            name="enquiryStatus"
                            id="open"
                            onClick={handleChangeEnquiryStatus}
                            value="open"
                            checked={enquiryStatus === "open"}
                          />
                          <label htmlFor="open" className="radio_label">
                            Open
                          </label>
                        </div>
                      )}
                      {statusOptions.includes("working") && (
                        <div className="radio_single">
                          <input
                            type="radio"
                            name="enquiryStatus"
                            id="working"
                            onClick={handleChangeEnquiryStatus}
                            value="working"
                            checked={enquiryStatus === "working"}
                          />
                          <label htmlFor="working" className="radio_label">
                            Working
                          </label>
                        </div>
                      )}
                      {statusOptions.includes("successful") && (
                        <div className="radio_single">
                          <input
                            type="radio"
                            name="enquiryStatus"
                            id="successful"
                            onClick={handleChangeEnquiryStatus}
                            value="successful"
                            checked={enquiryStatus === "successful"}
                          />
                          <label htmlFor="successful" className="radio_label">
                            Successful
                          </label>
                        </div>
                      )}
                      {statusOptions.includes("dead") && (
                        <div className="radio_single">
                          <input
                            type="radio"
                            name="enquiryStatus"
                            id="dead"
                            onClick={handleChangeEnquiryStatus}
                            value="dead"
                            checked={enquiryStatus === "dead"}
                          />
                          <label htmlFor="dead" className="radio_label">
                            Dead
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.esForWorking && (
                    <div className="field_error">{errors.esForWorking}</div>
                  )}
                  {errors.esForSD && (
                    <div className="field_error">{errors.esForSD}</div>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="form_field st-2 label_top">
                  <label htmlFor="">Update Type</label>
                  <div className="field_box theme_radio_new">
                    <div className="theme_radio_container">
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="updateType"
                          id="general"
                          onClick={handleChangeUpdateType}
                          value="general"
                        />
                        <label htmlFor="general" className="radio_label">
                          general
                        </label>
                      </div>
                      <div className="radio_single">
                        <input
                          type="radio"
                          name="updateType"
                          id="visit"
                          onClick={handleChangeUpdateType}
                          value="visit"
                        />
                        <label htmlFor="visit" className="radio_label">
                          visit
                        </label>
                      </div>
                    </div>
                  </div>
                  {errors.updateType && (
                    <div className="field_error">{errors.updateType}</div>
                  )}
                </div>
              </div>
              {updateType === "visit" && (
                <div className="col-md-4">
                  <div className="form_field label_top">
                    <label htmlFor="">Visit Date</label>
                    <div className="form_field_inner with_icon">
                      <DatePicker
                        selected={visitDate}
                        onChange={handleChangeVisitDate}
                        minDate={new Date(new Date().setDate(new Date().getDate() - 2))} // Allow only past 2 days
                        maxDate={new Date()} // Limit to today
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select a date"
                      />
                      <div className="field_icon">
                        <span className="material-symbols-outlined">
                          calendar_month
                        </span>
                      </div>
                    </div>
                    {errors.visitDate && (
                      <div className="field_error">{errors.visitDate}</div>
                    )}
                  </div>
                </div>
              )}

              <div className="col-md-12">
                <div className="form_field label_top">
                  <label htmlFor="updateForOwner">Add Update for Owner</label>
                  <div className="form_field_inner with_icon">
                    <textarea
                      placeholder="Update for owner"
                      value={updateForOwner}
                      onChange={handleChangeUpdateForOwner}
                      id="updateForOwner"
                    />
                    <div className="field_icon">
                      <span className="material-symbols-outlined">draw</span>
                    </div>{" "}
                  </div>
                  {errors.updateForOwner && (
                    <div className="field_error">{errors.updateForOwner}</div>
                  )}
                </div>
              </div>
              <div
                className="col-12 d-flex justify-content-end"
                style={{
                  gap: "22px",
                }}
              >
                <Link to="/enquiry/all" className="theme_btn btn_border no_icon text-center">
                  Cancel
                </Link>
                <button
                  className="theme_btn btn_fill no_icon text-center"
                  onClick={submitEnquiry}
                  disabled={isUploading}
                >
                  {isUploading ? "Updating..." : "Update Enquiry"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* {enquiryDocument && enquiryDocument.statusUpdates && enquiryDocument.statusUpdates.map((update, index) => (
                    <div className="step_single" key={index}>
                        <div className="number">
                            <span className="material-symbols-outlined">
                                open_in_new
                            </span>
                        </div>
                        <h6 className='text-capitalize'>
                            {update.status}
                        </h6>
                        {update.updatedAt && (
                            <h5>
                                {format(new Date(update.updatedAt.seconds * 1000), 'dd-MMM-yy hh:mm a')}
                            </h5>
                        )}
                    </div>
                ))} */}
        <div className="vg22"></div>
        <hr />
        <ReactTable
          tableColumns={columns}
          tableData={enquiryDocument.statusUpdates || []}
        />
      </div>
    </div>
  );
};

export default UpdateEnquiry;
