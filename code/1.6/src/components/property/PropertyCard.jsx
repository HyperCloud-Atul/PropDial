import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { timestamp } from "../../firebase/config";
import { generateSlug } from "../../utils/generateSlug";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { usePropertyUserRoles } from "../../utils/usePropertyUserRoles";
import usePropertyUsersData from "../../utils/usePropertyUsersData";
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

// Use replace() to remove all commas
function removeCommas(stringWithCommas) {
  const stringWithoutCommas = stringWithCommas.replace(/,/g, "");
  return stringWithoutCommas;
}

const PropertyCard = ({ propertyid }) => {
  // console.log('property id: ', propertyid)
  const {
    ownerUsers,
    firstOwnerUser,
    ownerUserData,
    executiveUsers,
    firstExecutiveUser,
    executiveUserData,
    managerUsers,
    firstManagerUser,
    managerUserData,
    substituteUsers,
    firstSubstituteUser,
    substituteUserData,
    tenantUsers,
    firstTenantUser,
    tenantUserData,
  } = usePropertyUsersData(propertyid);

  const location = useLocation();

  const { user } = useAuthContext();
  const { document: propertydoc, error: errPropertyDoc } = useDocument(
    "properties-propdial",
    propertyid
  );
  const { documents: inspections, errors: inspectionsError } = useCollection(
    "inspections",
    ["propertyId", "==", propertyid]
  );

  // const { documents: myproperties, error: errMyProperties } = useCollection(
  //   "propertyusers",
  //   ["propertyId", "==", propertyid]
  // );
  // const { documents: myproperties, error: errMyProperties } = useCollection(
  //   "propertyusers"
  // );

  // console.log('my properties: ', myproperties)

  const [toggleFlag, setToggleFlag] = useState(false);

  // expand more expand less start
  const [expanded, setExpanded] = useState(true);

  // console.log('propertydoc:', propertydoc)

  const handleExpand = () => {
    setExpanded(!expanded);
  };
  // sexpand more expand less end

  useEffect(() => {
    if (propertydoc) {
      if (propertydoc.isActiveInactiveReview.toUpperCase() === "ACTIVE")
        setToggleFlag(false);
      else setToggleFlag(true);
    }
  }, [propertydoc]);

  //---------------- Start of Change User ----------------------
  const { updateDocument, response: updateDocumentResponse } = useFirestore(
    "properties-propdial"
  );
  const { documents: dbUsers, error: dbuserserror } = useCollection(
    "users-propdial",
    ["status", "==", "active"]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(dbUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [changeManagerPopup, setchangeManagerPopup] = useState(false);

  const openChangeManager = () => {
    console.log("Open Change Manager");
    setchangeManagerPopup(true);
  };
  const closeChangeManager = () => {
    setchangeManagerPopup(false);
  };

  const confirmChangeManager = async () => {
    console.log("In confirmChangeManager: ");
    console.log("selectedUser: ", selectedUser);

    const updatedProperty = {
      propertyManager: selectedUser,
      updatedAt: timestamp.fromDate(new Date()),
      updatedBy: user.phoneNumber,
    };

    // console.log('updatedProperty', updatedProperty)
    // console.log('propertydoc id: ', propertydoc.id)

    await updateDocument(propertydoc.id, updatedProperty);

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
      dbUsers &&
      dbUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(query.toLowerCase()) ||
          user.phoneNumber.includes(query)
      );
    setFilteredUsers(filtered);
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  //------------ End of Change User ---------

  // const toggleBtnClick_Active_Inactive = async () => {
  //   let userSwitch = "";
  //   // e.preventDefault()

  //   if (toggleFlag) {
  //     userSwitch = "active";
  //   } else {
  //     let review_inactive =
  //       document.getElementById("id_inactive_review").innerHTML;
  //     console.log("review_inactive: ", review_inactive);
  //     userSwitch = review_inactive;
  //   }
  //   setToggleFlag(!toggleFlag);

  //   const updatedProperty = {
  //     status: userSwitch,
  //     updatedAt: timestamp.fromDate(new Date()),
  //     updatedBy: user.uid,
  //   };

  //   // console.log("updatedProperty", updatedProperty);
  //   // console.log('property id: ', property.id)

  //   // await updateDocument(propertydoc.id, updatedProperty);
  // };

  //Manage In-Review | Active |Inactive
  const handleIsActiveInactiveReview = async (e, option) => {
    // console.log("In handleIsActiveInactiveReview")
    console.log("option: ", option);
    // console.log("selectedpropertyid: ", selectedpropertyid)
    // const propid = document.getElementById("propertydocid")
    // console.log("propid: ", propid)
    console.log("propertyid: ", propertyid);

    e.preventDefault();

    const updatedProperty = {
      isActiveInactiveReview: option,
      updatedAt: timestamp.fromDate(new Date()),
      updatedBy: user.phoneNumber,
    };

    // console.log("updatedProperty", updatedProperty);
    // console.log('propertydoc: ', propertydoc)

    await updateDocument(propertyid, updatedProperty);
  };

  const {
    isPropertyOwner,
    propertyUserOwnerData,
    isPropertyManager,
    propertyUserManagerData,
    isPropertyTenant,
    propertyUserTenantData,
  } = usePropertyUserRoles(propertyid, user);

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
            className="material-symbols-outlined close-button"
          >
            close
          </span>
          <h1 style={{ color: "var(--theme-orange)", fontSize: "1.4rem" }}>
            Change Property Manager
          </h1>
          <br></br>
          <div>
            <input
              style={{ background: "#efefef", height: "60px" }}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search users..."
            />
            <ul style={{ padding: "10px 0 10px 0" }}>
              {filteredUsers &&
                filteredUsers.map((user) => (
                  <li style={{ padding: "10px 0 10px 0" }} key={user.id}>
                    <label
                      style={{
                        fontSize: "1rem",
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        width: "100%",
                        background: "#efefef",
                        padding: "10px 0 10px 0",
                        margin: "0",
                      }}
                    >
                      <input
                        style={{ width: "10%" }}
                        name="selectedUser"
                        type="radio"
                        checked={selectedUser === user.id}
                        onChange={() => handleUserSelect(user.id)}
                      />
                      {user.fullName} (
                      {user.phoneNumber.replace(
                        /(\d{2})(\d{5})(\d{5})/,
                        "+$1 $2-$3"
                      )}
                      )
                    </label>
                  </li>
                ))}
            </ul>
          </div>
          <div id="id_sendotpButton" className="change-number-button-div">
            <button
              onClick={closeChangeManager}
              className="mybutton button5"
              style={{ background: "#afafaf" }}
            >
              Cancel
            </button>
            <button onClick={confirmChangeManager} className="mybutton button5">
              Confirm
            </button>
          </div>
        </div>
      </div>
      {/* Change User Popup - End */}

      <div className="psc_parent relative">
        {/* {propertydoc && <div className={`category ${propertydoc.category === "Residential" ? "residential" : "commercial"}`}>
          {propertydoc.category}
        </div>} */}
        {propertydoc && (
          <div
            // className={`category ${propertydoc.status.toUpperCase() === "AVAILABLE FOR RENT"
            //   ? "residential"
            //   : "commercial"
            //   }`}
            className="category residential"
          >
            {propertydoc.flag}
          </div>
        )}
        {propertydoc && (
          <div
            className={`property_single_card relative ${
              isPropertyManager || isPropertyOwner || isPropertyTenant
                ? "property_user"
                : ""
            }`}
          >
            {/* {propertydoc && <div className={`purpose ${propertydoc.purpose === "Rent" ? "rent" : "sale"}`}>
            {propertydoc.status === 'Available for Rent' || propertydoc.status === 'Rented Out' ? 'Rent' : 'Sale'}
            {propertydoc.purpose}
          </div>} */}

            <Link
              // to={`/propertydetails/${propertydoc.id}`}
              to={`/propertydetails/${generateSlug(propertydoc)}`}
              key={propertydoc.id}
              className="top relative"
            >
              <div className="img_container">
                {/* <img src="/assets/img/admin_banner.jpg" alt="propdial" /> */}
                {propertydoc.images?.length > 0 ? (
                  <img src={propertydoc.images[0]} alt={propertydoc.bhk} />
                ) : propertydoc.category === "Residential" ? (
                  <img
                    src="/assets/img/admin_banner.jpg"
                    alt="Residential Property"
                  />
                ) : propertydoc.category === "Commercial" ? (
                  <img
                    src="/assets/img/commercial.jpg"
                    alt="Commercial Property"
                  />
                ) : propertydoc.category === "Plot" ? (
                  <img src="/assets/img/plot.jpg" alt="Plot Property" />
                ) : null}
              </div>
              <div className="left_side relative">
                {user &&
                  (user.role === "admin" ||
                    user.role === "superAdmin" ||
                    isPropertyManager) && (
                    <Link
                      className="prop_edit"
                      to={`/updateproperty/${propertydoc.id}`}
                      key={propertydoc.propertyid}
                    >
                      <span className="material-symbols-outlined">
                        edit_square
                      </span>
                    </Link>
                  )}
                <h5 className="demand">
                  <span>₹</span>
                  {/* <span>{propertydoc.demandPriceRent}</span> */}
                  {propertydoc.flag.toLowerCase() === "pms only" ||
                  propertydoc.flag.toLowerCase() === "pms after rent" ||
                  propertydoc.flag.toLowerCase() === "available for rent" ||
                  propertydoc.flag.toLowerCase() === "rented out"
                    ? propertydoc.demandPriceRent &&
                      formatNumberWithCommas(propertydoc.demandPriceRent)
                    : propertydoc.flag.toLowerCase() === "rent and sale" ||
                      propertydoc.flag.toLowerCase() === "rented but sale"
                    ? propertydoc.demandPriceRent &&
                      formatNumberWithCommas(propertydoc.demandPriceRent) +
                        " / ₹" +
                        propertydoc.demandPriceSale &&
                      formatNumberWithCommas(propertydoc.demandPriceSale)
                    : propertydoc.demandPriceSale &&
                      formatNumberWithCommas(propertydoc.demandPriceSale)}

                  {propertydoc.maintenanceCharges !== "" && (
                    <span
                      style={{
                        fontSize: "10px",
                      }}
                    >
                      + ₹
                      {new Intl.NumberFormat("en-IN").format(
                        propertydoc.maintenanceCharges
                      )}
                      /- ({propertydoc.maintenanceChargesFrequency})
                    </span>
                  )}
                </h5>
                <div className="full_address">
                  <h6>
                    {propertydoc.unitNumber} | {propertydoc.society}{" "}
                  </h6>
                  <h6>
                    {propertydoc &&
                      (propertydoc.category === "Residential" ? (
                        <>
                          {propertydoc.bhk} {propertydoc.furnishing && "|"}{" "}
                          {propertydoc.furnishing &&
                            `${propertydoc.furnishing}`}{" "}
                          {propertydoc.purpose && " | "}
                          For{" "}
                          {propertydoc.purpose.toLowerCase() === "rentsaleboth"
                            ? "Rent / Sale"
                            : propertydoc.purpose}
                        </>
                      ) : propertydoc.category === "Commercial" ? (
                        <>
                          Your perfect {propertydoc.propertyType} awaits—on{" "}
                          {propertydoc.purpose.toLowerCase() === "rentsaleboth"
                            ? "Rent / Lease Now"
                            : propertydoc.purpose.toLowerCase() === "rent"
                            ? "Lease Now"
                            : propertydoc.purpose.toLowerCase() === "sale"
                            ? "Sale Now"
                            : ""}
                        </>
                      ) : propertydoc.category === "Plot" ? (
                        <>
                          {propertydoc.propertyType} Plot | For{" "}
                          {propertydoc.purpose.toLowerCase() === "rentsaleboth"
                            ? "Rent / Lease"
                            : propertydoc.purpose.toLowerCase() === "rent"
                            ? "Lease"
                            : propertydoc.purpose.toLowerCase() === "sale"
                            ? "Sale"
                            : ""}
                        </>
                      ) : null)}
                  </h6>

                  <h6>
                    {propertydoc.locality}, {propertydoc.city} |{" "}
                    {propertydoc.state}
                  </h6>
                </div>
                <div className="more_row">
                  <div className="left">
                    <span className="card_badge">
                      <span
                        className="status_dot"
                        style={{
                          backgroundColor:
                            propertydoc.isActiveInactiveReview === "Active"
                              ? "var(--success-color)" // Green for Active
                              : propertydoc.isActiveInactiveReview ===
                                "Inactive"
                              ? "var(--theme-red)" // Red for Inactive
                              : "var(--theme-blue)", // Dark Gold for In-Review (or any of the options above)
                        }}
                      ></span>
                      PID: {" " + propertydoc.pid}
                    </span>
                  </div>
                  {/* <div className="right">
                  <span className={`property_status card_badge ${propertydoc.status.toUpperCase() === 'AVAILABLE FOR RENT' ? "for_rent" : "for_sale"}`}>
                  {propertydoc.status}
                  </span>                
                </div> */}
                </div>
              </div>
            </Link>

            <div className="middle relative">
              {/* <div className="show_more_arrow" onClick={handleExpand}>
    <span className="material-symbols-outlined">
      {expanded ? "keyboard_arrow_down" : "keyboard_arrow_up"}
    </span>
  </div> */}

              {propertydoc && (
                <div className="middle_single">
                  <div className="ms_child">
                    <div className="icon_container">
                      <img src="/assets/img/superarea.png" alt="propdial" />
                    </div>
                    <div className="left">
                      <h6>
                        {propertydoc.category === "Plot"
                          ? "Area"
                          : propertydoc.category === "Commercial"
                          ? "Super Area"
                          : propertydoc.category === "Residential"
                          ? propertydoc.superArea
                            ? "Super Area"
                            : propertydoc.carpetArea
                            ? "Carpet Area"
                            : "Area"
                          : "Area"}
                      </h6>
                      <h5>
                        {propertydoc.category === "Residential"
                          ? propertydoc.superArea
                            ? `${propertydoc.superArea} ${propertydoc.superAreaUnit}`
                            : propertydoc.carpetArea
                            ? `${propertydoc.carpetArea} ${propertydoc.superAreaUnit}`
                            : "Yet to be added"
                          : propertydoc.category === "Commercial" ||
                            propertydoc.category === "Plot"
                          ? propertydoc.superArea
                            ? `${propertydoc.superArea} ${propertydoc.superAreaUnit}`
                            : "Yet to be added"
                          : "Yet to be added"}
                      </h5>
                    </div>
                  </div>
                  <div className="ms_child">
                    <div className="icon_container">
                      <img
                        src={
                          propertydoc.category === "Residential"
                            ? "/assets/img/new_bedroom.png"
                            : propertydoc.category === "Commercial"
                            ? "/assets/img/new_carpet.png"
                            : propertydoc.category === "Plot"
                            ? "/assets/img/park.png"
                            : "/assets/img/default.png" // Fallback image for other categories
                        }
                        alt={propertydoc.category || "Category"}
                      />
                    </div>

                    <div className="left">
                      {propertydoc.category === "Plot" ? (
                        <>
                          <h6>Park Facing</h6>
                          <h5>
                            {propertydoc.isParkFacingPlot || "Yet to be added"}
                          </h5>
                        </>
                      ) : propertydoc.category === "Commercial" ? (
                        <>
                          <h6>Carpet Area</h6>
                          <h5>
                            {propertydoc.carpetArea
                              ? `${propertydoc.carpetArea} ${
                                  propertydoc.superAreaUnit || ""
                                }`
                              : "Yet to be added"}
                          </h5>
                        </>
                      ) : (
                        <>
                          <h6>Bedroom</h6>
                          <h5>
                            {propertydoc.numberOfBedrooms === "0" ||
                            propertydoc.numberOfBedrooms === 0
                              ? "Yet to be added"
                              : propertydoc.numberOfBedrooms}
                          </h5>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ms_child">
                    <div className="icon_container">
                      <img
                        src={
                          propertydoc.category === "Residential"
                            ? "/assets/img/new_bathroom.png"
                            : propertydoc.category === "Commercial"
                            ? "/assets/img/directions.png"
                            : propertydoc.category === "Plot"
                            ? "/assets/img/directions.png"
                            : "/assets/img/default.png" // Fallback image for other categories
                        }
                        alt={propertydoc.category || "Category"}
                      />
                    </div>
                    <div className="left">
                      {propertydoc.category === "Plot" ||
                      propertydoc.category === "Commercial" ? (
                        <>
                          <h6>Direction Facing</h6>
                          <h5>
                            {propertydoc.mainDoorFacing || "Yet to be added"}
                          </h5>
                        </>
                      ) : (
                        <>
                          <h6>Bathroom</h6>
                          <h5>
                            {propertydoc.numberOfBathrooms === "0" ||
                            propertydoc.numberOfBathrooms === 0
                              ? "Yet to be added"
                              : propertydoc.numberOfBathrooms}
                          </h5>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {expanded
                ? ""
                : propertydoc && (
                    <div className="middle_single">
                      <div className="ms_child">
                        <div className="icon_container">
                          <img
                            src={
                              propertydoc.category === "Residential"
                                ? "/assets/img/floor.png"
                                : propertydoc.category === "Commercial"
                                ? "/assets/img/propertytype.png"
                                : propertydoc.category === "Plot"
                                ? "/assets/img/corner.png"
                                : "/assets/img/default.png" // Fallback image for other categories
                            }
                            alt="propdial"
                          />
                        </div>
                        <div className="left">
                          {propertydoc.category === "Residential" ? (
                            <>
                              <h6>Floor</h6>
                              <h5>
                                {propertydoc.floorNo
                                  ? propertydoc.floorNo === "Ground"
                                    ? "Ground"
                                    : propertydoc.floorNo === "Stilt"
                                    ? "Stilt"
                                    : propertydoc.floorNo === "Basement"
                                    ? "Basement"
                                    : `${propertydoc.floorNo}${
                                        propertydoc.numberOfFloors
                                          ? " of " + propertydoc.numberOfFloors
                                          : ""
                                      }`
                                  : "Yet to be added"}
                              </h5>
                            </>
                          ) : propertydoc.category === "Commercial" ? (
                            <>
                              <h6>Property Type</h6>
                              <h5>
                                {propertydoc.propertyType || "Yet to be added"}
                              </h5>
                            </>
                          ) : propertydoc.category === "Plot" ? (
                            <>
                              <h6>Is Corner?</h6>
                              <h5>
                                {propertydoc.isCornerSidePlot ||
                                  "Yet to be added"}
                              </h5>
                            </>
                          ) : (
                            <>
                              <h6>Property Details</h6>
                              <h5>Yet to be added</h5>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ms_child">
                        <div className="icon_container">
                          <img
                            src={
                              propertydoc.category === "Residential"
                                ? "/assets/img/new_bhk.png"
                                : propertydoc.category === "Commercial"
                                ? "/assets/img/propertysubtype.png"
                                : propertydoc.category === "Plot"
                                ? "/assets/img/gatedcomunity.png"
                                : "/assets/img/default.png" // Fallback image for other categories
                            }
                            alt="propdial"
                          />
                        </div>
                        <div className="left">
                          {propertydoc.category === "Residential" ? (
                            <>
                              <h6>BHK</h6>
                              <h5>{propertydoc.bhk || "Yet to be added"}</h5>
                            </>
                          ) : propertydoc.category === "Commercial" ? (
                            <>
                              <h6>Property Sub-Type</h6>
                              <h5>
                                {propertydoc.additionalRooms &&
                                propertydoc.additionalRooms.length > 0
                                  ? propertydoc.additionalRooms[0]
                                  : "Yet to be added"}
                              </h5>
                            </>
                          ) : propertydoc.category === "Plot" ? (
                            <>
                              <h6>Gated Community</h6>
                              <h5>
                                {propertydoc.gatedArea || "Yet to be added"}
                              </h5>
                            </>
                          ) : (
                            <>
                              <h6>Property Details</h6>
                              <h5>Yet to be added</h5>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ms_child">
                        <div className="icon_container">
                          <img
                            src={
                              propertydoc.category === "Residential"
                                ? "/assets/img/new_furniture.png"
                                : propertydoc.category === "Commercial"
                                ? "/assets/img/new_furniture.png"
                                : propertydoc.category === "Plot"
                                ? "/assets/img/road.png"
                                : "/assets/img/default.png" // Fallback image for other categories
                            }
                            alt="propdial"
                          />
                        </div>
                        <div className="left">
                          {propertydoc.category === "Plot" ? (
                            <>
                              <h6>Road Width</h6>
                              <h5>
                                {propertydoc.roadWidth || "Yet to be added"}{" "}
                                {propertydoc.roadWidthUnit}
                              </h5>
                            </>
                          ) : propertydoc.category === "Residential" ||
                            propertydoc.category === "Commercial" ? (
                            <>
                              <h6>Furnishing</h6>
                              <h5>
                                {propertydoc.furnishing || "Yet to be added"}
                              </h5>
                            </>
                          ) : (
                            <>
                              <h6>Details</h6>
                              <h5>Yet to be added</h5>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
              {expanded
                ? ""
                : propertydoc &&
                  (propertydoc.category === "Commercial" ||
                    propertydoc.category === "Residential") && (
                    <div className="middle_single addtional_rooms">
                      <div className="ms_child">
                        <div className="icon_container">
                          <img
                            src={
                              propertydoc.category === "Residential"
                                ? "/assets/img/new_room.png"
                                : propertydoc.category === "Commercial"
                                ? "/assets/img/overlooking.png"
                                : propertydoc.category === "Plot"
                                ? "/assets/img/overlooking.png"
                                : "/assets/img/default.png" // Fallback image for other categories
                            }
                            alt="propdial"
                          />
                        </div>
                        <div className="left">
                          {propertydoc.category === "Plot" ||
                          propertydoc.category === "Commercial" ? (
                            <>
                              <h6 className="mb-1">Overlooking</h6>
                              <h5>
                                {propertydoc.overLooking.length > 0
                                  ? propertydoc.overLooking.map(
                                      (overLooking) => (
                                        <span>{overLooking}</span>
                                      )
                                    )
                                  : "Yet to be added"}
                              </h5>
                            </>
                          ) : (
                            <>
                              <h6 className="mb-1">Additional Room</h6>
                              <h5>
                                {propertydoc.additionalRooms.length > 0
                                  ? propertydoc.additionalRooms.map(
                                      (additionalroom) => (
                                        <span>{additionalroom}</span>
                                      )
                                    )
                                  : "No Additional Rooms"}
                              </h5>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
            </div>
            <div className="card_upcoming">
              <div className="parent">
                <div className="child">
                  <div className="left">
                    <h5>0</h5>
                    <h6>Inspection</h6>
                  </div>
                </div>
                <div className="child">
                  <div className="left">
                    <h5>0</h5>
                    <h6>Bill</h6>
                  </div>
                </div>
                <div className="child">
                  <div className="left">
                    <h5>0</h5>
                    <h6>Ticket</h6>
                  </div>
                </div>
                <div className="child">
                  <div className="left">
                    <h5>0</h5>
                    <h6>Enquirys</h6>
                  </div>
                </div>
              </div>
            </div>
            {/* {user && (user.role === "admin" || user.role === "superAdmin") && (
<div className="card_upcoming">
            <div className="parent">
              <div className="child coming_soon">
                <div className="left">
                  <h5>0-0-0</h5>
                  <div className="line">
                    <div
                      className="line_fill"
                      style={{
                        width: "25%",
                        background: "#00a300",
                      }}
                    ></div>
                  </div>
                  <h6>Inspection Date</h6>
                </div>
              </div>
              <div className="child coming_soon">
                <div className="left">
                  <h5>0-0-0</h5>
                  <div className="line">
                    <div
                      className="line_fill"
                      style={{
                        width: "92%",
                        background: "#FA6262",
                      }}
                    ></div>
                  </div>
                  <h6>Rent Renewal</h6>
                </div>
              </div>
            </div>
          </div>
          )} */}
            <div className="property_users">
              {/* owner  */}
              {!isPropertyOwner && (
                <div className="property_user_single">
                  <div className="user_type">Owner</div>
                  <div className="inner">
                    <div className="img">
                      <img
                        src={
                          firstOwnerUser?.profile?.photoURL ||
                          "/assets/img/dummy_user.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="right">
                      {firstOwnerUser ? (
                        <>
                          <h5>{firstOwnerUser?.profile?.fullName} </h5>
                          {firstOwnerUser?.profile?.phoneNumber && (
                            <h6>
                              {(() => {
                                try {
                                  const phoneNumber =
                                    parsePhoneNumberFromString(
                                      firstOwnerUser?.profile?.phoneNumber,
                                      firstOwnerUser?.profile?.countryCode?.toUpperCase()
                                    );
                                  return phoneNumber
                                    ? phoneNumber.formatInternational()
                                    : firstOwnerUser?.profile?.phoneNumber;
                                } catch (error) {
                                  return firstOwnerUser?.profile?.phoneNumber;
                                }
                              })()}
                            </h6>
                          )}
                        </>
                      ) : (
                        <h6
                          style={{
                            color: "var(--theme-red)",
                          }}
                        >
                          No Owner Assigned
                        </h6>
                      )}
                    </div>
                  </div>
                  {/* Owner Actions */}
                  <div className="actions">
                    <a
                      href={
                        firstOwnerUser?.profile?.phoneNumber
                          ? `tel:+${firstOwnerUser.profile.phoneNumber}`
                          : undefined
                      }
                      className="a_single call"
                      style={{
                        opacity: firstOwnerUser?.profile?.phoneNumber ? 1 : 0.4,
                        pointerEvents: firstOwnerUser?.profile?.phoneNumber
                          ? "auto"
                          : "none",
                      }}
                    >
                      <img src="/assets/img/simple_call.png" alt="call" />
                      <h6>Call</h6>
                    </a>

                    <a
                      href={
                        firstOwnerUser?.profile?.phoneNumber
                          ? `https://wa.me/+${firstOwnerUser.profile.phoneNumber}`
                          : undefined
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="a_single whatsapp"
                      style={{
                        opacity: firstOwnerUser?.profile?.phoneNumber ? 1 : 0.4,
                        pointerEvents: firstOwnerUser?.profile?.phoneNumber
                          ? "auto"
                          : "none",
                      }}
                    >
                      <img
                        src="/assets/img/whatsapp_simple.png"
                        alt="whatsapp"
                      />
                      <h6>Whatsapp</h6>
                    </a>
                  </div>
                </div>
              )}
              {/* Executive  */}
              {!isPropertyManager && (
                <div className="property_user_single">
                  <div className="user_type">Executive</div>
                  <div className="inner">
                    <div className="img">
                      <img
                        src={
                          firstExecutiveUser?.profile?.photoURL ||
                          "/assets/img/dummy_user.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="right">
                      {firstExecutiveUser ? (
                        <>
                          <h5>{firstExecutiveUser?.profile?.fullName} </h5>

                          {firstExecutiveUser?.profile?.phoneNumber && (
                            <h6>
                              {(() => {
                                try {
                                  const phoneNumber =
                                    parsePhoneNumberFromString(
                                      firstExecutiveUser?.profile?.phoneNumber,
                                      firstExecutiveUser?.profile?.countryCode?.toUpperCase()
                                    );
                                  return phoneNumber
                                    ? phoneNumber.formatInternational()
                                    : firstExecutiveUser?.profile?.phoneNumber;
                                } catch (error) {
                                  return firstExecutiveUser?.profile
                                    ?.phoneNumber;
                                }
                              })()}
                            </h6>
                          )}
                        </>
                      ) : (
                        <h6
                          style={{
                            color: "var(--theme-red)",
                          }}
                        >
                          No Executive Assigned
                        </h6>
                      )}
                    </div>
                  </div>
                  {/* Executive Actions */}
                  <div className="actions">
                    <a
                      href={
                        firstExecutiveUser?.profile?.phoneNumber
                          ? `tel:+${firstExecutiveUser.profile.phoneNumber}`
                          : undefined
                      }
                      className="a_single call"
                      style={{
                        opacity: firstExecutiveUser?.profile?.phoneNumber
                          ? 1
                          : 0.4,
                        pointerEvents: firstExecutiveUser?.profile?.phoneNumber
                          ? "auto"
                          : "none",
                      }}
                    >
                      <img src="/assets/img/simple_call.png" alt="call" />
                      <h6>Call</h6>
                    </a>

                    <a
                      href={
                        firstExecutiveUser?.profile?.phoneNumber
                          ? `https://wa.me/+${firstExecutiveUser.profile.phoneNumber}`
                          : undefined
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="a_single whatsapp"
                      style={{
                        opacity: firstExecutiveUser?.profile?.phoneNumber
                          ? 1
                          : 0.4,
                        pointerEvents: firstExecutiveUser?.profile?.phoneNumber
                          ? "auto"
                          : "none",
                      }}
                    >
                      <img
                        src="/assets/img/whatsapp_simple.png"
                        alt="whatsapp"
                      />
                      <h6>Whatsapp</h6>
                    </a>
                  </div>
                </div>
              )}

              {/* tenant  */}
              {!isPropertyTenant && (
                <div className="property_user_single">
                  <div className="user_type">Tenant</div>
                  <div className="inner">
                    <div className="img">
                      <img
                        src={
                          firstTenantUser?.profile?.photoURL ||
                          "/assets/img/dummy_user.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="right">
                      {firstTenantUser ? (
                        <>
                          <h5>{firstTenantUser?.profile?.fullName} </h5>

                          {firstTenantUser?.profile?.phoneNumber && (
                            <h6>
                              {(() => {
                                try {
                                  const phoneNumber =
                                    parsePhoneNumberFromString(
                                      firstTenantUser?.profile?.phoneNumber,
                                      firstTenantUser?.profile?.countryCode?.toUpperCase()
                                    );
                                  return phoneNumber
                                    ? phoneNumber.formatInternational()
                                    : firstTenantUser?.profile?.phoneNumber;
                                } catch (error) {
                                  return firstTenantUser?.profile?.phoneNumber;
                                }
                              })()}
                            </h6>
                          )}
                        </>
                      ) : (
                        <h6
                          style={{
                            color: "var(--theme-red)",
                          }}
                        >
                          No Tenant Assigned
                        </h6>
                      )}
                    </div>
                  </div>
                  {/* Executive Actions */}
                  <div className="actions">
                    <a
                      href={
                        firstTenantUser?.profile?.phoneNumber
                          ? `tel:+${firstTenantUser.profile.phoneNumber}`
                          : undefined
                      }
                      className="a_single call"
                      style={{
                        opacity: firstTenantUser?.profile?.phoneNumber
                          ? 1
                          : 0.4,
                        pointerEvents: firstTenantUser?.profile?.phoneNumber
                          ? "auto"
                          : "none",
                      }}
                    >
                      <img src="/assets/img/simple_call.png" alt="call" />
                      <h6>Call</h6>
                    </a>

                    <a
                      href={
                        firstTenantUser?.profile?.phoneNumber
                          ? `https://wa.me/+${firstTenantUser.profile.phoneNumber}`
                          : undefined
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="a_single whatsapp"
                      style={{
                        opacity: firstTenantUser?.profile?.phoneNumber
                          ? 1
                          : 0.4,
                        pointerEvents: firstTenantUser?.profile?.phoneNumber
                          ? "auto"
                          : "none",
                      }}
                    >
                      <img
                        src="/assets/img/whatsapp_simple.png"
                        alt="whatsapp"
                      />
                      <h6>Whatsapp</h6>
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div
              className="bottom"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                {/* <div className="property_owner_detail">
                  <div className="img_container">
                    <img src="/assets/img/dummy_user.png" alt="" />
                  </div>
                  <div className="pod_right">
                    <div>
                      <h5>Rahul</h5>
                    </div>

                    <h6>
                      <a href="" className="phone">
                        36969696969
                      </a>

                      <a href="" className="call whatsapp">
                        <img
                          src="/assets/img/phone-call.png"
                          style={{
                            width: "25px",
                            height: "25px",
                            marginLeft: "6px",
                          }}
                          alt="propdial"
                        />
                      </a>
                      <a href="" className="whatsapp">
                        <img
                          src="/assets/img/whatsapp.png"
                          style={{
                            width: "25px",
                            height: "25px",
                            marginLeft: "6px",
                          }}
                          alt="propdial"
                        />
                      </a>
                    </h6>
                  </div>
                </div> */}
                {/* {propertydoc && <Link style={{ height: '25px', position: 'relative', top: '20px' }} to={`/propertydetails/${propertydoc.id}`} key={propertydoc.id} className="view_detail click_text">
                view more
              </Link>}  */}
              </div>

              {/* {user && (user.role === "admin" || user.role === "superAdmin") && propertydoc && (
              <div className="form_field st-2 outline">
                <div className="radio_group">
                  <div className="radio_group_single">
                    <div
                      className={
                        propertydoc.isActiveInactiveReview === "In-Review"
                          ? "custom_radio_button radiochecked"
                          : "custom_radio_button"
                      }
                    >
                      <input
                        type="checkbox"
                        id={"toggleFlag_inreview" + propertydoc.id}
                        onClick={(e) =>
                          handleIsActiveInactiveReview(e, "In-Review")
                        }
                      />
                      <label
                        htmlFor={"toggleFlag_inreview" + propertydoc.id}
                        style={{ paddingTop: "7px" }}
                      >
                        <div className="radio_icon">
                          <span className="material-symbols-outlined add">
                            add
                          </span>
                          <span className="material-symbols-outlined check">
                            done
                          </span>
                        </div>
                        In-Review
                      </label>
                    </div>
                  </div>
                  <div className="radio_group_single">
                    <div
                      className={
                        propertydoc.isActiveInactiveReview === "Active"
                          ? "custom_radio_button radiochecked"
                          : "custom_radio_button"
                      }
                    >
                      <input
                        type="checkbox"
                        id={"toggleFlag_active" + propertydoc.id}
                        onClick={(e) =>
                          handleIsActiveInactiveReview(e, "Active")
                        }
                      />
                      <label
                        htmlFor={"toggleFlag_active" + propertydoc.id}
                        style={{ paddingTop: "7px" }}
                      >
                        <div className="radio_icon">
                          <span className="material-symbols-outlined add">
                            add
                          </span>
                          <span className="material-symbols-outlined check">
                            done
                          </span>
                        </div>
                        Active
                      </label>
                    </div>
                  </div>
                  <div className="radio_group_single">
                    <div
                      className={
                        propertydoc.isActiveInactiveReview === "Inactive"
                          ? "custom_radio_button radiochecked"
                          : "custom_radio_button"
                      }
                    >
                      <input
                        type="checkbox"
                        id={"toggleFlag_inactive" + propertydoc.id}
                        onClick={(e) =>
                          handleIsActiveInactiveReview(e, "Inactive")
                        }
                      />
                      <label
                        htmlFor={"toggleFlag_inactive" + propertydoc.id}
                        style={{ paddingTop: "7px" }}
                      >
                        <div className="radio_icon">
                          <span className="material-symbols-outlined add">
                            add
                          </span>
                          <span className="material-symbols-outlined check">
                            done
                          </span>
                        </div>
                        Inactive
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PropertyCard;
