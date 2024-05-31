import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { timestamp } from "../../firebase/config";

const PropertyCard = ({ propertydoc }) => {

  const { user } = useAuthContext();
  const { document: userDoc, error: userDocError } = useDocument('users', propertydoc.propertyManager)
  const [toggleFlag, setToggleFlag] = useState(false);

  // expand more expand less start
  const [expanded, setExpanded] = useState(true);

  // console.log('propertydoc:', propertydoc)

  const handleExpand = () => {
    setExpanded(!expanded);
  };
  // sexpand more expand less end

  useEffect(() => {

    if (propertydoc.isActiveInactiveReview.toUpperCase() === "ACTIVE") setToggleFlag(false);
    else setToggleFlag(true);

  }, [propertydoc]);

  //---------------- Start of Change User ----------------------
  const { updateDocument, response: updateDocumentResponse } = useFirestore("properties");
  const { documents: dbUsers, error: dbuserserror } = useCollection("users", ["status", "==", "active"]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(dbUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [changeManagerPopup, setchangeManagerPopup] = useState(false);

  const openChangeManager = () => {
    console.log("Open Change Manager");
    setchangeManagerPopup(true);
  }
  const closeChangeManager = () => {
    setchangeManagerPopup(false);
  }

  const confirmChangeManager = async () => {
    console.log('In confirmChangeManager: ')
    console.log('selectedUser: ', selectedUser)

    const updatedProperty = {
      propertyManager: selectedUser,
      updatedAt: timestamp.fromDate(new Date()),
      updatedBy: user.uid
    };

    // console.log('updatedProperty', updatedProperty)
    // console.log('property id: ', property.id)

    await updateDocument(propertydoc.id, updatedProperty);

    setchangeManagerPopup(false);
  }

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterUsers(query);
  };

  const filterUsers = (query) => {
    // console.log('query: ', query)
    const filtered = dbUsers && dbUsers.filter((user) =>
      (user.fullName.toLowerCase().includes(query.toLowerCase()) || (user.phoneNumber.includes(query)))
    );
    setFilteredUsers(filtered);
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  //------------ End of Change User ---------

  const toggleBtnClick_Active_Inactive = async () => {
    let userSwitch = "";
    // e.preventDefault()

    if (toggleFlag) {
      userSwitch = "active";
    } else {
      let review_inactive = document.getElementById("id_inactive_review").innerHTML;
      console.log("review_inactive: ", review_inactive)
      userSwitch = review_inactive;
    }
    setToggleFlag(!toggleFlag);

    const updatedProperty = {
      status: userSwitch,
      updatedAt: timestamp.fromDate(new Date()),
      updatedBy: user.uid,
    };

    // console.log("updatedProperty", updatedProperty);
    // console.log('property id: ', property.id)

    // await updateDocument(propertydoc.id, updatedProperty);
  };



  //Manage In-Review | Active |Inactive
  const handleIsActiveInactiveReview = async (e, option) => {
    // console.log("In handleIsActiveInactiveReview")
    e.preventDefault();

    const updatedProperty = {
      isActiveInactiveReview: option,
      updatedAt: timestamp.fromDate(new Date()),
      updatedBy: user.uid,
    };

    // console.log("updatedProperty", updatedProperty);
    // console.log('property id: ', property.id)

    await updateDocument(propertydoc.id, updatedProperty);
  }

  return (
    <>
      {/* Change User Popup - Start */}
      <div className={changeManagerPopup ? 'pop-up-change-number-div open' : 'pop-up-change-number-div'}>
        <div className="direct-div">
          <span onClick={closeChangeManager} className="material-symbols-outlined close-button">
            close
          </span>
          <h1 style={{ color: 'var(--theme-orange)', fontSize: '1.4rem' }}>Change Property Manager</h1>
          <br></br>
          <div>
            <input style={{ background: '#efefef', height: '60px' }}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search users..."
            />
            {/* <ul>
              {filteredUsers && filteredUsers.map((user) => (
                <li key={user.id}>{user.fullName} ({user.phoneNumber.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2-$3')})</li>
              ))}
            </ul> */}
            <ul style={{ padding: '10px 0 10px 0' }}>
              {filteredUsers && filteredUsers.map((user) => (
                <li style={{ padding: '10px 0 10px 0' }} key={user.id}>
                  <label style={{
                    fontSize: "1rem", display: 'flex', alignItems: 'center', position: 'relative', width: '100%', background: '#efefef', padding: '10px 0 10px 0', margin: '0'
                  }}>
                    <input style={{ width: '10%' }}
                      name="selectedUser"
                      // type="checkbox"
                      // checked={selectedUsers.includes(user.id)}
                      type="radio"
                      checked={selectedUser === user.id}
                      onChange={() => handleUserSelect(user.id)}
                    />
                    {user.fullName} ({user.phoneNumber.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2-$3')})
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div id="id_sendotpButton" className="change-number-button-div">
            <button onClick={closeChangeManager} className="mybutton button5" style={{ background: "#afafaf" }}>Cancel</button>
            <button onClick={confirmChangeManager} className="mybutton button5">Confirm</button>
          </div>
        </div>
      </div >
      {/* Change User Popup - End */}


      <div className="psc_parent relative">
        <div className={`category ${propertydoc.category === "Residential" ? "residential" : "commercial"}`}>
          {propertydoc.category}
        </div>


        <div className="property_single_card relative">
          <div className={`purpose ${propertydoc.purpose === "Rent" ? "rent" : "sale"}`}>
            {propertydoc.status === 'Available for Rent' || propertydoc.status === 'Rented Out' ? 'Rent' : 'Sale'}
          </div>
          <Link to={`/propertydetails/${propertydoc.id}`} key={propertydoc.id} className="top relative">
            {/* <div className="fav">
          <span className="material-symbols-outlined">favorite</span>
        </div> */}

            <div className="img_container">
              <img src="./assets/img/admin_banner.jpg" alt="" />
            </div>
            <div className="left_side relative">
              {user && user.role === 'admin' &&
                <Link
                  className="prop_edit"
                  to={`/updateproperty/${propertydoc.id}`}
                  key={propertydoc.propertyid}
                >
                  <span className="material-symbols-outlined">edit_square</span>
                </Link>}
              <h5 className="demand">
                <span>₹</span> {propertydoc.demandPrice}
                {propertydoc.maintenancecharges !== '' && <span
                  style={{
                    fontSize: "10px",
                  }}
                >
                  + ₹{propertydoc.maintenancecharges} ({propertydoc.maintenancechargesfrequency})
                </span>}
              </h5>
              <div className="full_address">
                <h6>
                  {((propertydoc.status.toUpperCase() === 'AVAILABLE FOR RENT') || (propertydoc.status.toUpperCase() === 'AVAILABLE FOR SALE')) ? <span style={{ textAlign: 'center', color: 'white', fontWeight: "bolder", padding: '2px 8px', borderRadius: '8px', background: 'red' }} > {propertydoc.status}</span> : <span style={{ textAlign: 'center', color: 'black', fontWeight: "bolder", padding: '2px 8px', borderRadius: '8px', background: 'lightgreen' }} > {propertydoc.status}</span>}
                </h6>
                <h6>{propertydoc.unitNumber} | {propertydoc.society} </h6>
                <h6>{propertydoc.bhk} | {propertydoc.propertyType} {propertydoc.furnishing === "" ? "" : " | " + propertydoc.furnishing + "Furnished"}  </h6>
                <h6>{propertydoc.locality}, {propertydoc.city} | {propertydoc.state}</h6>
              </div>
            </div>
          </Link>
          <div className="middle relative">
            <div className="show_more_arrow" onClick={handleExpand}>
              <span className="material-symbols-outlined">
                {expanded ? "keyboard_arrow_down" : "keyboard_arrow_up"}
              </span>
            </div>
            <div className="middle_single">
              <div className="ms_child">
                <div className="icon_container">
                  <img src="/assets/img/new_carpet.png" alt="" />
                </div>
                <div className="left">
                  <h6>Super Area</h6>
                  <h5>{propertydoc.superArea} {propertydoc.superAreaUnit} </h5>
                </div>
              </div>
              <div className="ms_child">
                <div className="icon_container">
                  <img src="/assets/img/new_bedroom.png" alt="" />
                </div>
                <div className="left">
                  <h6>Bedroom</h6>
                  <h5>{propertydoc.numberOfBedrooms}</h5>
                </div>
              </div>
              <div className="ms_child">
                <div className="icon_container">
                  <img src="/assets/img/new_bathroom.png" alt="" />
                </div>
                <div className="left">
                  <h6>Bathroom</h6>
                  <h5>{propertydoc.numberOfBathrooms}</h5>
                </div>
              </div>
            </div>
            {expanded ? (
              ""
            ) : (
              <div className="middle_single">
                <div className="ms_child">
                  <div className="icon_container">
                    <img src="/assets/img/new_super_area.png" alt="" />
                  </div>
                  <div className="left">
                    <h6>Carpet Area</h6>
                    <h5>{propertydoc.carpetArea} {propertydoc.carpetAreaUnit}</h5>
                  </div>
                </div>
                <div className="ms_child">
                  <div className="icon_container">
                    <img src="/assets/img/new_bhk.png" alt="" />
                  </div>
                  <div className="left">
                    <h6>BHK</h6>
                    <h5>{propertydoc.bhk}</h5>
                  </div>
                </div>
                <div className="ms_child">
                  <div className="icon_container">
                    <img src="/assets/img/new_furniture.png" alt="" />
                  </div>
                  <div className="left">
                    <h6>furnishing</h6>
                    <h5>{propertydoc.furnishing}</h5>
                  </div>
                </div>
              </div>
            )}
            {expanded ? (
              ""
            ) : (
              <div className="middle_single addtional_rooms">
                <div className="ms_child">
                  <div className="icon_container">
                    <img src="/assets/img/new_room.png" alt="" />
                  </div>
                  <div className="left">
                    <h6>{propertydoc.displayName}</h6>
                    <h5>
                      {propertydoc.additionalRooms.length > 0 ?
                        (propertydoc.additionalRooms.map((additionalroom) => (
                          <span>{additionalroom}</span>
                        ))) : 'No Additional Rooms'}
                    </h5>
                  </div>
                </div>
              </div>
            )}
          </div>


          <div className="bottom" style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Temparary Code: Need to remove */}
            {/* {property && <div>
              {property.createdBy.fullName}-{property.createdBy.phoneNumber}-{property.createdBy.id}
            </div>} */}
            {/* Details: {property && (property.createdBy.fullName) && (property.createdBy.phoneNumber)} */}


            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div className="property_owner_detail">
                <div className="img_container">
                  {userDoc && <img src={userDoc && userDoc.photoURL} alt="" />}
                </div>
                <div className="pod_right">
                  <div>
                    {userDoc && (
                      <h5
                      onClick={user && user.role === "admin" ? openChangeManager : undefined}
                      className={user && user.role === "admin" ? "pointer" : ""}
                      >
                        {userDoc.fullName}
                        {user && user.role === "admin" && (
                          <span
                            className="material-symbols-outlined click_icon text_near_icon"                            
                          >
                            edit
                          </span>
                        )}
                      </h5>
                    )}



                  </div>

                  <h6>
                    {userDoc && <a href={"tel:" + userDoc && userDoc.phoneNumber} className="phone">
                      {userDoc && userDoc.phoneNumber.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2-$3')}
                    </a>}

                    {userDoc && <a href={"tel:" + userDoc && userDoc.phoneNumber} className="call whatsapp">
                      <img
                        src="/assets/img/phone-call.png"
                        style={{ width: "25px", height: "25px", marginLeft: "6px" }}
                        alt=""
                      />
                    </a>}
                    {userDoc && <a href={"https://wa.me/" + userDoc && userDoc.phoneNumber} className="whatsapp">
                      <img
                        src="/assets/img/whatsapp.png"
                        style={{ width: "25px", height: "25px", marginLeft: "6px" }}
                        alt=""
                      />
                    </a>}
                  </h6>

                </div>
              </div>

              <Link style={{ height: '25px', position: 'relative', top: '20px' }} to={`/propertydetails/${propertydoc.id}`} key={propertydoc.id} className="view_detail click_text">
                view more
              </Link>

            </div>



            {user && user.role === "admin" && <div className="form_field st-2 outline">
              {/* <label htmlFor="">
                Status</label> */}
              {/* <div className="form_field_inner"> */}
              {/* <div className="form_field_container"> */}
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
                      id="toggleFlag_inreview"
                      onClick={(e) => handleIsActiveInactiveReview(e, 'In-Review')}
                    />
                    <label
                      htmlFor="toggleFlag_inreview"
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
                      id="toggleFlag_active"
                      onClick={(e) => handleIsActiveInactiveReview(e, 'Active')}
                    />
                    <label
                      htmlFor="toggleFlag_active"
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
                      id="toggleFlag_inactive"
                      onClick={(e) => handleIsActiveInactiveReview(e, 'Inactive')}
                    />
                    <label
                      htmlFor="toggleFlag_inactive"
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
              {/* </div> */}
              {/* </div> */}
            </div>
            }
          </div>
        </div>
      </div>

    </>
  );
};

export default PropertyCard;
