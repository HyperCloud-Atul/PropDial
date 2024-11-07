import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { useDocument } from "../../hooks/useDocument";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectFirestore, timestamp } from "../../firebase/config";
import Select from "react-select";

const AddEnquiry = ({ enquiryAdded }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  let { id } = useParams();
  // console.log("property id: ", id)
  // add enquiry with add document start
  const { addDocument, updateDocument, deleteDocument, error } =
    useFirestore("enquiry-propdial");

  // const { documents: propertyDoc, error: propertyDocError } = useCollection("properties-propdial", ["postedBy", "==", "Propdial"]);
  // const { documents: propertyDoc, error: propertyDocError } = useCollection("properties-propdial", ["id", "==", id]);
  const { document: propertyDoc, error: propertyDocError } = useDocument(
    "properties-propdial",
    id
  );
  // console.log("propertyDoc: ", propertyDoc)

  const { documents: propertyUsers, errors: propertyUsersError } =
    useCollection("propertyusers", ["propertyId", "==", id]);
  // console.log("propertyUsers: ", propertyUsers)

  const { documents: allUsers, error: allUsersError } =
    useCollection("users-propdial");
  // console.log("All Users: ", allUsers)

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
  const [isUploading, setIsUploading] = useState(false);
  // const [userDoc, setUserDoc] = useState();

  useEffect(() => {
    const propertyOwners =
      propertyUsers &&
      propertyUsers.filter(
        (doc) => doc.userType === "propertyowner" && doc.userTag !== "Admin"
      );

    // console.log("propertyOwners: ", propertyOwners)
    // console.log("propertyOwners.userId: ", propertyOwners && propertyOwners.length > 0 && propertyOwners[0].userId)

    if (propertyOwners && propertyOwners.length > 0) {
      const ownersUserDetails =
        allUsers && allUsers.find((e) => e.id === propertyOwners[0].userId);
      // console.log('ownersUserDetails: ', ownersUserDetails && ownersUserDetails.fullName)

      if (ownersUserDetails)
        setPropertyOwner(ownersUserDetails && ownersUserDetails.fullName);
    }

    if (propertyDoc) {
      setPropertyName(propertyDoc && propertyDoc.propertyName);
    }
  }, [propertyDoc]);

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

  const handleChangeEnquiryFrom = handleFieldChange(setEnquiryFrom);
  const handleChangeReferredBy = handleFieldChange(setReferredBy);
  const handleChangeEnquiryType = handleFieldChange(setEnquiryType);
  const handleChangeName = handleFieldChange(setName);
  const handleChangeEmail = handleFieldChange(setEmail);
  const handleChangeRemark = handleFieldChange(setRemark);
  const handleChangeSource = handleFieldChange(setSource);
  const handleChangeEmployeeName = handleFieldChange(setEmployeeName);
  const handleChangePropertyName = handleFieldChange(setPropertyName);
  const handleChangePropertyOwner = handleFieldChange(setPropertyOwner);

  const handleChangePhone = (phone) => {
    setPhone(phone);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors.phone) delete newErrors.phone;
      return newErrors;
    });
  };

  const handleChangeDate = (date) => {
    setDate(date);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors.date) delete newErrors.date;
      return newErrors;
    });
  };

  const handlePropertyName = async (option) => {
    setPropertyName(option)
  }


  const validateFields = () => {
    let errors = {};

    if (!enquiryType) errors.enquiryType = "Enquiry type is a required field";
    if (!enquiryFrom) errors.enquiryFrom = "Enquiry from is required field";
    if (!referredBy) errors.referredBy = "Referred by is a required field";
    if (referredBy === "propdial" && !source)
      errors.source = "Source is a required field";
    if (referredBy === "employee" && !employeeName)
      errors.employeeName = "Employee name is a required field";
    if (!propertyOwner)
      errors.propertyOwner = "Property owner is a required field";
    if (!propertyName)
      errors.propertyName = "Property name is a required field";
    if (!name) errors.name = "Name is a required field";
    // if (!phone) errors.phone = "Contact is a required field";
    if (!phone) {
      errors.phone = "Contact is a required field";
    } else if (
      phone.startsWith("+91") &&
      phone.replace(/\D/g, "").length !== 12
    ) {
      errors.phone = "Indian phone numbers must have exactly 10 digits excluding the country code";
    } else if (phone.replace(/\D/g, "").length > 12) {
      errors.phone = "Contact number should be a maximum of 10 digits excluding country code";
    }
    if (email && !/\S+@\S+\.\S+/.test(email))
      errors.email = "Email is not in the correct format";
    // if (!remark) {
    //   errors.remark = "Remark is a required field";
    // }
    // else if (remark.length < 50) {
    //     errors.remark = "Remark must be at least 50 characters long";
    // }

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
        status: "open",
        updatedAt: new Date(),
        updatedBy: user.uid,
      };
      if (id === "all") {
        console.log("all option: ")
        console.log(" propertyName: ", propertyName)
        id = propertyName !== '' ? propertyName.value : ""
      }

      const docRef = await addDocument({
        iAm: "",
        description: "",
        enquiryFrom,
        referredBy,
        enquiryType,
        name,
        phone,
        email,
        propId: id,
        date: new Date(date).toISOString(), // save as ISO string including time
        enquiryStatus,
        remark,
        source,
        employeeName,
        propertyOwner,
        propertyName: propertyName.label,
        pid: "",
        statusUpdates: [newStatusUpdate], // Initialize statusUpdates with default status
      });
      setEnquiryFrom("");
      setReferredBy("");
      setEnquiryType("");
      setName("");
      setPhone("");
      setEmail("");
      setDate("");
      setEnquiryStatus("");
      setRemark("");
      setSource("");
      setEmployeeName("");
      setPropertyOwner("");
      setPropertyName("");
      setIsUploading(false);
      enquiryAdded();
      // Corrected navigation
      if (id === "all") {
        navigate("/enquiry/all");
      } else {
        navigate(`/enquiry/${id}`);
      }
      // navigate("/enquiry/all");    
    } catch (error) {
      console.error("Error adding document:", error);
      setIsUploading(false);
    }
  };
  // add enquiry with add document end

  const ownerListforPropertyId = (_propertyId) => { };

  const [proeprtyListforUserIdState, setproeprtyListforUserIdState] =
    useState("");
  const proeprtyListforUserId = async (_userId) => {
    // console.log("_userId: ", _userId)
    let results = [];
    const ref = await projectFirestore
      .collection("propertyusers")
      .where("userId", "==", _userId);

    console.log("ref: ", ref);
    const unsubscribe = ref.onSnapshot(async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        // console.log("user mapping doc: ", doc.data())
        results.push({ ...doc.data(), id: doc.id });
      });
      // console.log("results: ", results)
      setproeprtyListforUserIdState(results);
    });

    // console.log("results: ", results)
  };

  //---------------- Change Property Manager ----------------------
  // const {
  //     updateDocument: updateProperyUsersDocument,
  //     error: errProperyUsersDocument,
  // } = useFirestore("propertyusers");
  // const { updateDocument: changeUserUpdateDocument , response: updateDocumentResponse } = useFirestore(
  //     "properties-propdial"
  // );

  const { documents: onlyOwners, error: onlyOwnersError } = useCollection(
    "users-propdial",
    ["rolePropDial", "==", "owner"]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(onlyOwners);
  const [selectedUser, setSelectedUser] = useState(null);
  const [changeManagerPopup, setchangeManagerPopup] = useState(false);
  // const [userdbFieldName, setUserdbFieldName] = useState();
  const [changedUser, setChangedUser] = useState();
  // const [dbUserState, setdbUserState] = useState(onlyOwners);

  // const openChangeUser = () => {
  //   console.log("Open Change Manager");
  //   setchangeManagerPopup(true);
  // }
  const openChangeUser = (docId) => {
    console.log("Open Change User");
    setchangeManagerPopup(true);
    // setUserdbFieldName(option);
    setChangedUser(docId);
  };

  const closeChangeManager = () => {
    setchangeManagerPopup(false);
  };

  const [ownersProeprtyList, setOwnersProeprtyList] = useState();
  const { documents: allProperties, error: allPropertiesError } = useCollection(
    "properties-propdial"
  );

  // console.log("allProperties: ", allProperties)

  const confirmChangeUser = async () => {
    console.log("selected user: ", selectedUser);
    const _userDoc =
      onlyOwners && onlyOwners.find((e) => e.id === selectedUser);
    console.log("_userDoc: ", _userDoc);

    const formattedPhoneNumber = _userDoc.phoneNumber.replace(
      /(\d{2})(\d{5})(\d{5})/,
      "+$1 $2-$3"
    );
    const _propertyOwner =
      _userDoc && _userDoc.fullName + " ( " + formattedPhoneNumber + " )";
    setPropertyOwner(_propertyOwner);

    proeprtyListforUserId(selectedUser);
    console.log("propertyListofSelectedUser: ", proeprtyListforUserIdState);
    console.log(" Property List Count: ", proeprtyListforUserIdState.length);

    // const ref = await projectFirestore
    //     .collection("properties-propdial")
    // let results = []
    // const unsubscribe = ref.onSnapshot(async snapshot => {
    //     snapshot.docs.forEach(doc => {
    //         console.log("properties docs: ", doc.data())
    //         results.push({ ...doc.data(), id: doc.id })
    //     });
    //     console.log("results: ", results)
    // })

    let results = [];
    proeprtyListforUserIdState &&
      proeprtyListforUserIdState.map((property) => {
        const _prop = allProperties.find((e) => e.id === property.propertyId);
        results.push({ ..._prop });
      });
    console.log("results: ", results);

    setOwnersProeprtyList(
      results.map((data) => ({
        label: data.propertyName,
        value: data.id,
      }))
    );

    setchangeManagerPopup(false);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterUsers(query);
  };

  const filterUsers = (query) => {
    // console.log('query: ', query)
    const filtered =
      onlyOwners &&
      onlyOwners.filter(
        (user) =>
          user.fullName.toLowerCase().includes(query.toLowerCase()) ||
          user.phoneNumber.includes(query)
      );
    console.log("filtered: ", filtered);
    setFilteredUsers(filtered);
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };



  //------------ End of Change Property Manager ---------

  return (
    <>
      {/* Change User Popup - Start */}
      <div
        className={
          changeManagerPopup
            ? "pop-up-change-number-div open"
            : "pop-up-change-number-div"
        }
      >
        <div className="direct-div">
          <span
            onClick={closeChangeManager}
            className="material-symbols-outlined modal_close"
          >
            close
          </span>
          <h5 className="text_orange text-center">Property Owner</h5>
          <div className="vg12"></div>
          <div>
            <div className="enq_fields">
              <div className="form_field st-2">
                <div className="field_inner">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search users by mobile no or name..."
                  />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                </div>
              </div>
            </div>
            {/* <ul>
              {filteredUsers && filteredUsers.map((user) => (
                <li key={user.id}>{user.fullName} ({user.phoneNumber.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2-$3')})</li>
              ))}
            </ul> */}
            <ul className="search_results">
              {filteredUsers &&
                filteredUsers.map((user) => (
                  <li className="search_result_single" key={user.id}>
                    <label>
                      <input
                        name="selectedUser"
                        // type="checkbox"
                        // checked={selectedUsers.includes(user.id)}
                        type="radio"
                        checked={selectedUser === user.id}
                        onChange={() => handleUserSelect(user.id)}
                      />
                      <div>
                        <strong> {user.fullName} </strong> (
                        {user.phoneNumber.replace(
                          /(\d{2})(\d{5})(\d{5})/,
                          "+$1 $2-$3"
                        )}
                        )<br></br> {user.email}, {user.city}, {user.country}
                      </div>
                    </label>
                  </li>
                ))}
            </ul>
          </div>
          <div className="vg12"></div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: "15px",
            }}
          >
            <button
              onClick={closeChangeManager}
              className="theme_btn full_width btn_border no_icon"
            >
              Cancel
            </button>
            <button
              onClick={confirmChangeUser}
              className="theme_btn full_width btn_fill no_icon"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
      {/* Change User Popup - End */}
      <hr />
      <div className="add_enquiry">
        <div className="vg12"></div>
        <div className="vg12"></div>
        <div className="row row_gap">
          <div className="col-md-4">
            <div className="form_field label_top">
              <label htmlFor="date">Click To Select Date*</label>
              <div className="form_field_inner with_icon">
                <DatePicker
                  selected={date}
                  onChange={handleChangeDate}
                  maxDate={new Date()}
                  minDate={
                    new Date(new Date().setDate(new Date().getDate() - 1))
                  }
                  dateFormat="dd/MM/yyyy"
                  id="date"
                />
                <div className="field_icon">
                  <span class="material-symbols-outlined">calendar_month</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="enqtype">Enquiry Type*</label>
              <div className="field_box theme_radio_new">
                <div className="theme_radio_container">
                  <div className="radio_single">
                    <input
                      type="radio"
                      name="enquiryType"
                      id="rent"
                      onClick={handleChangeEnquiryType}
                      value="rent"
                    />
                    <label htmlFor="rent" className="radio_label">
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
                    />
                    <label htmlFor="sale" className="radio_label">
                      sale
                    </label>
                  </div>
                </div>
              </div>
              {errors.enquiryType && (
                <div className="field_error">{errors.enquiryType}</div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Enquiry From*</label>
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
                      />
                      <label htmlFor="tenant" className="radio_label">
                        prospective tenant
                      </label>
                    </div>
                  )}
                  {enquiryType.toLowerCase() === "sale" && (
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="enquiryFrom"
                        id="tenant"
                        onClick={handleChangeEnquiryFrom}
                        value="prospective buyer"
                      />
                      <label htmlFor="tenant" className="radio_label">
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
                    />
                    <label htmlFor="agent" className="radio_label">
                      Agent
                    </label>
                  </div>
                </div>
              </div>
              {errors.enquiryFrom && (
                <div className="field_error">{errors.enquiryFrom}</div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form_field st-2 label_top">
              <label htmlFor="">Referred By*</label>
              <div className="field_box theme_radio_new">
                <div className="theme_radio_container">
                  <div className="radio_single">
                    <input
                      type="radio"
                      name="referredBy"
                      id="owner"
                      onClick={handleChangeReferredBy}
                      value="owner"
                    />
                    <label htmlFor="owner" className="radio_label">
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
                    />
                    <label htmlFor="propdial" className="radio_label">
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
                    />
                    <label htmlFor="employee" className="radio_label">
                      employee
                    </label>
                  </div>
                </div>
              </div>
              {errors.referredBy && (
                <div className="field_error">{errors.referredBy}</div>
              )}
            </div>
          </div>
          {referredBy === "propdial" && (
            <div className="col-md-8">
              <div className="form_field st-2 label_top">
                <label htmlFor="">Source*</label>
                <div className="field_box theme_radio_new">
                  <div className="theme_radio_container">
                    <div className="radio_single">
                      <input
                        type="radio"
                        name="source"
                        id="99acres"
                        onClick={handleChangeSource}
                        value="99acres"
                      />
                      <label htmlFor="99acres" className="radio_label">
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
                      />
                      <label htmlFor="magicBricks" className="radio_label">
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
                      />
                      <label htmlFor="housing" className="radio_label">
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
                      />
                      <label htmlFor="other" className="radio_label">
                        other
                      </label>
                    </div>
                  </div>
                </div>
                {errors.source && (
                  <div className="field_error">{errors.source}</div>
                )}
              </div>
            </div>
          )}
          {referredBy === "employee" && (
            <div className="col-md-8">
              <div className="form_field label_top">
                <label htmlFor="empname">Employee Name*</label>
                <div className="form_field_inner with_icon">
                  <input
                    type="text"
                    placeholder="Select employee"
                    value={employeeName}
                    onChange={handleChangeEmployeeName}
                    id="empname"
                  />
                  <div className="field_icon">
                    <span class="material-symbols-outlined">search</span>
                  </div>
                </div>
                {errors.employeeName && (
                  <div className="field_error">{errors.employeeName}</div>
                )}
              </div>
            </div>
          )}
          <div className="row row_gap">
            <div className="col-md-6">
              <div className="form_field label_top">
                <label htmlFor="propowner">Property Owner*</label>
                <div
                  className="form_field_inner with_icon pointer"
                  onClick={(e) => {
                    if (id === "all") {
                      openChangeUser(e);
                    }
                  }}
                  style={{
                    cursor: id === "all" ? "pointer" : "no-drop",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search owner"
                    value={propertyOwner}
                    onChange={handleChangePropertyOwner}
                    id="propowner"
                    readOnly
                    style={{
                      cursor: id === "all" ? "pointer" : "no-drop",
                    }}
                  />
                  <div className="field_icon">
                    <span class="material-symbols-outlined">search</span>
                  </div>
                </div>
                {errors.propertyOwner && (
                  <div className="field_error">{errors.propertyOwner}</div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form_field label_top">
                <label htmlFor="propname">Property Name*</label>
                <div className="form_field_inner with_icon">
                  {id === "all" ? (
                    <Select
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
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Search property"
                        value={propertyName}
                        onChange={handleChangePropertyName}
                        id="propname"
                        readOnly
                        style={{
                          cursor: id !== "all" ? "no-drop" : "pointer",
                        }}
                      />

                      <div className="field_icon">
                        <span class="material-symbols-outlined">search</span>
                      </div></>
                  )}

                </div>
                {errors.propertyName && (
                  <div className="field_error">{errors.propertyName}</div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form_field label_top">
                <label htmlFor="name">
                  {enquiryFrom === "agent"
                    ? "agent"
                    : enquiryFrom === "prospective tenant"
                      ? "Prospective Tenant"
                      : enquiryFrom === "prospective buyer"
                        ? "Prospective Buyer"
                        : ""}{" "}
                  Name*
                </label>
                <div className="form_field_inner with_icon">
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={handleChangeName}
                    id="name"
                  />
                  <div className="field_icon">
                    <span class="material-symbols-outlined">draw</span>
                  </div>
                </div>
                {errors.name && (
                  <div className="field_error">{errors.name}</div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="form_field label_top">
                <label htmlFor="contact">
                  {enquiryFrom === "agent"
                    ? "agent"
                    : enquiryFrom === "prospective tenant"
                      ? "Prospective Tenant"
                      : enquiryFrom === "prospective buyer"
                        ? "Prospective Buyer"
                        : ""}{" "}
                  Contact*
                </label>
                <div className="form_field_inner with_icon">
                  <PhoneInput
                    country={"in"}
                    id="contact"
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
                  />
                  <div className="field_icon">
                    <span class="material-symbols-outlined">draw</span>
                  </div>
                </div>
                {errors.phone && (
                  <div className="field_error">{errors.phone}</div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="form_field label_top">
                <label htmlFor="email">
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
                    placeholder="Enter email"
                    value={email}
                    onChange={handleChangeEmail}
                    id="email"
                  />
                  <div className="field_icon">
                    <span class="material-symbols-outlined">draw</span>
                  </div>
                </div>
                {errors.email && (
                  <div className="field_error">{errors.email}</div>
                )}
              </div>
            </div>

            <div className="col-md-12">
              <div className="form_field label_top">
                <label htmlFor="remark">Remarks (For Office Use Only)</label>
                <div className="form_field_inner with_icon">
                  <textarea
                    placeholder="Enter remarks"
                    value={remark}
                    onChange={handleChangeRemark}
                    id="remark"
                  />
                  <div className="field_icon">
                    <span class="material-symbols-outlined">draw</span>
                  </div>
                </div>
                {errors.remark && (
                  <div className="field_error">{errors.remark}</div>
                )}
              </div>
            </div>

            <div className="col-md-12">
              <button
                className="theme_btn btn_fill"
                onClick={submitEnquiry}
                disabled={isUploading}
              >
                {isUploading ? "Submiting....." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEnquiry;
