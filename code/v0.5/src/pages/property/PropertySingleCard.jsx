import React from 'react'

const PropertySingleCard = () => {
  return (
    <div className="ppc_single" key={property.id}>
    <div className="ppc_single_top relative">
      {user && user.uid === property.createdBy.id ? (
        <Link
          className="prop_edit"
          to={`/agentaddproperties/${property.id}`}
          key={property.id}
        >
          <span className="material-symbols-outlined">edit_square</span>
        </Link>
      ) : (
        ""
      )}
      {user &&
        user.role === "propagent" &&
        property.createdBy.id !== user.uid ? (
        <div className="fav_and_share">
          <span
            className="material-symbols-outlined mr-2 fav"
            style={{
              marginRight: "3px",
            }}
          >
            favorite
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="img_container">
        {property.category.toUpperCase() === "RESIDENTIAL" ? (
          <img alt="" src="/assets/img/admin_banner.jpg"></img>
        ) : (
          <img alt="" src="/assets/img/bills.jpg"></img>
        )}
      </div>
      <div className="left_side relative">


        <h5 className="demand">
          <span>₹</span> <span>{property.demandprice}</span>
          {property.maintenancecharges === '' || property.maintenancecharges === '0' || property.purpose === 'Sale' ? "" : <> <span style={{ fontSize: '10px' }}> + Maintenance ₹{property.maintenancecharges} ({property.maintenancechargesfrequency})</span> </>}
        </h5>
        <div className="full_address">
          <h6>
            {property.bhk} {property.propertyType} for {property.purpose}
          </h6>
          <h6>
            {property.society} | {property.locality}
          </h6>
          <h6>
            {property.city} | {property.state}
          </h6>
        </div>
      </div>
    </div>
    <div className="ppc_single_middle_parent relative">
      <div className="show_more_arrow" onClick={handleExpand}>
        <span class="material-symbols-outlined">
          {expanded ? "keyboard_arrow_down" : "keyboard_arrow_up"}
        </span>
      </div>
      <div className="ppc_single_middle">
        <div className="ppcsm_single">
          <div className="icon_container">
            <img src="/assets/img/new_carpet.png" alt="" />
          </div>
          <div className="left">
            <h6>Carpet area</h6>
            <h5>{property.carpetArea}</h5>
          </div>
        </div>
        <div className="ppcsm_single">
          <div className="icon_container">
            <img src="/assets/img/new_bedroom.png" alt="" />
          </div>
          <div className="left">
            <h6>Bedroom</h6>
            <h5>{property.numberOfBedrooms}</h5>
          </div>
        </div>
        <div className="ppcsm_single">
          <div className="icon_container">
            <img src="/assets/img/new_bathroom.png" alt="" />
          </div>
          <div className="left">
            <h6>Bathroom</h6>
            <h5>{property.numberOfBathrooms}</h5>
          </div>
        </div>
      </div>
      {expanded ? (
        ""
      ) : (
        <div className="ppc_single_middle">
          <div className="ppcsm_single">
            <div className="icon_container">
              <img src="/assets/img/new_super_area.png" alt="" />
            </div>
            <div className="left">
              <h6>super area</h6>
              <h5>2000 sqft</h5>
            </div>
          </div>
          <div className="ppcsm_single">
            <div className="icon_container">
              <img src="/assets/img/new_bhk.png" alt="" />
            </div>
            <div className="left">
              <h6>BHK</h6>
              <h5>{property.bhk}</h5>
            </div>
          </div>
          <div className="ppcsm_single">
            <div className="icon_container">
              <img src="/assets/img/new_furniture.png" alt="" />
            </div>
            <div className="left">
              <h6>furnishing</h6>
              <h5>{property.furnishing}</h5>
            </div>
          </div>
        </div>
      )}
      {expanded ? (
        ""
      ) : (
        <div className="ppc_single_middle addtional_rooms">
          <div className="ppcsm_single">
            <div className="icon_container">
              <img src="/assets/img/new_room.png" alt="" />
            </div>
            <div className="left">
              <h6>Additional rooms</h6>
              <h5>
                {property.additionalRooms.map((room, index) => (
                  <span key={index}>{room}</span>
                ))}
              </h5>
            </div>
          </div>
        </div>
      )}
    </div>

    <div className="ppc_single_bottom">
      {user &&
        ((user.role === "propagent" && property.createdBy.id !== user.uid) ||
          user.role === "propagentadmin") ? (
        <div className="property_owner_detail">
          <div className="img_container">
            <img src={property.createdBy.photoURL} alt="" />
          </div>
          <div className="pod_right">
            <h5>{property.createdBy.fullName}</h5>

            <h6>
              <a href={"tel:" + property.createdBy.phoneNumber} className="phone">
                +{property.createdBy.phoneNumber}
              </a>

              <a href={"tel:" + property.createdBy.phoneNumber} className="call whatsapp">
                <img
                  src="/assets/img/phone-call.png"
                  style={{ width: "25px", height: "25px", marginLeft: "6px" }}
                  alt=""
                />
              </a>
              <a href={"https://wa.me/" + property.createdBy.phoneNumber} className="whatsapp">
                <img
                  src="/assets/img/whatsapp.png"
                  style={{ width: "25px", height: "25px", marginLeft: "6px" }}
                  alt=""
                />
              </a>
            </h6>

          </div>
        </div>
      ) : (
        ""
      )}

      {user && user.uid === property.createdBy.id && (
        <>
          {property.status !== "pending approval" && (
            <div
              className="residential-commercial-switch property_active_inactive"
              style={{ top: "0", marginLeft: "auto" }}
            >
              <span
                className={property.status === "active" ? "active" : " "}
                style={{
                  color: "var(--p-theme-green)",
                  fontSize: "0.8rem",
                  fontFamily: "r_medium"
                }}
              >
                ACTIVE
              </span>
              <div
                className={
                  toggleFlag
                    ? "toggle-switch on commercial"
                    : "toggle-switch off residential"
                }
                style={{ padding: "0 5px" }}
              >
                {/* <small>{toggleFlag ? 'On' : 'Off'}</small> */}
                {/* <div onClick={toggleBtnClick()}> */}
                <div onClick={() => toggleBtnClick_Active_Inactive()}>
                  <div>
                    <div></div>
                  </div>
                </div>
              </div>
              <span
                className={property.status === "inactive" ? "active" : " "}
                style={{
                  color: "var(--p-theme-grey)",
                  fontSize: "0.8rem",
                  fontFamily: "r_medium"
                }}
              >
                INACTIVE
              </span>
            </div>
          )}
        </>
      )}

      {user.role === "propagentadmin" && property.status !== "inactive" && (
        <div className="residential-commercial-switch" style={{ top: "0" }}>
          <span
            // className={toggleFlag ? "" : "active"}
            className={property.status === "active" ? "active" : " "}
            style={{
              color: "var(--p-theme-green)",
              fontSize: "0.8rem",
            }}
          >
            ACTIVE
          </span>
          <div
            className={
              toggleFlag
                ? "toggle-switch on commercial"
                : "toggle-switch off residential"
            }
            // className={
            //   property.status === 'pending approval'
            //     ? "toggle-switch on commercial"
            //     : "toggle-switch off residential"
            // }
            style={{ padding: "0 5px" }}
          >
            <div onClick={() => toggleBtnClick_Active_PendingApproval()}>
              <div>
                <div></div>
              </div>
            </div>
          </div>
          <span
            // className={toggleFlag ? "active" : ""}
            className={
              property.status === "pending approval" ? "active" : " "
            }
            style={{
              color: "var(--theme-orange)",
              fontSize: "0.8rem",
            }}
          >
            PENDING APPROVAL
          </span>
        </div>
      )}
    </div>

  </div>
  )
}

export default PropertySingleCard
